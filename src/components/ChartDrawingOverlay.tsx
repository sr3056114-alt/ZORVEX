import React, { useEffect, useRef } from 'react';
import { IChartApi, ISeriesApi, Time } from 'lightweight-charts';

export type DrawingPoint = { time: number; price: number; logical?: number };
export type DrawingShape = {
  id: string;
  type: string;
  points: DrawingPoint[];
  color: string;
  isComplete: boolean;
};

interface ChartDrawingOverlayProps {
  chart: IChartApi | null;
  series: ISeriesApi<any> | null;
  drawings: DrawingShape[];
  crosshairPoint: DrawingPoint | null;
  activeDrawingId: string | null;
  onUpdateDrawingPoint?: (id: string, idx: number, point: DrawingPoint) => void;
}

export const ChartDrawingOverlay: React.FC<ChartDrawingOverlayProps> = ({ chart, series, drawings, crosshairPoint, activeDrawingId, onUpdateDrawingPoint }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!chart || !series || !svgRef.current) return;
    let rafId: number;

    const renderDrawings = () => {
      const svg = svgRef.current;
      if (!svg) return;
      while (svg.firstChild) svg.removeChild(svg.firstChild);

      const timeScale = chart.timeScale();
      const visibleRange = timeScale.getVisibleLogicalRange();
      if (!visibleRange) return;

      const createLine = (x1: number, y1: number, x2: number, y2: number, color: string, width = '2', dash = '') => {
        const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        l.setAttribute('x1', x1.toString()); l.setAttribute('y1', y1.toString());
        l.setAttribute('x2', x2.toString()); l.setAttribute('y2', y2.toString());
        l.setAttribute('stroke', color); l.setAttribute('stroke-width', width);
        if (dash) l.setAttribute('stroke-dasharray', dash);
        return l;
      };

      const createText = (x: number, y: number, text: string, color: string) => {
        const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        t.setAttribute('x', x.toString()); t.setAttribute('y', y.toString());
        t.setAttribute('fill', color); t.setAttribute('font-size', '12px');
        t.setAttribute('font-family', 'sans-serif');
        t.textContent = text;
        return t;
      };

      drawings.forEach(d => {
        if (d.points.length === 0) return;
        const renderPoints = [...d.points];
        if (!d.isComplete && d.id === activeDrawingId && crosshairPoint) {
            renderPoints.push(crosshairPoint);
        }

        const coords = renderPoints.map(p => {
          let x: number | null = null;
          if (p.logical !== undefined && p.logical !== null) {
            try {
              x = timeScale.logicalToCoordinate(p.logical as any);
            } catch (e) {
              x = null;
            }
          }
          if (x === null || x === undefined) {
            try {
              x = timeScale.timeToCoordinate(p.time as Time);
            } catch (e) {
              x = null;
            }
          }
          // Robust calculation for points plotted ahead of current market (future space)
          if (x === null || x === undefined) {
            const vr = timeScale.getVisibleLogicalRange();
            if (vr && p.logical !== undefined && p.logical !== null) {
              const svgWidth = svg.clientWidth || svg.getBoundingClientRect().width;
              const bars = vr.to - vr.from;
              if (bars > 0 && svgWidth > 0) {
                x = ((p.logical - vr.from) / bars) * svgWidth;
              }
            }
          }
          const y = series.priceToCoordinate(p.price);
          return {
            x: (x !== null && x !== undefined) ? x : -1000,
            y: (y !== null && y !== undefined) ? y : -1000,
            p
          };
        }).filter(c => c.x !== -1000 && c.y !== -1000);

        if (coords.length === 0) return;

        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const shapeType = (d.type || '').toLowerCase();

        switch (shapeType) {
          case 'horizontal line':
          case 'flat top/bottom': {
             g.appendChild(createLine(0, coords[0].y, 10000, coords[0].y, d.color));
             break;
          }
          case 'vertical line': {
             g.appendChild(createLine(coords[0].x, 0, coords[0].x, 10000, d.color));
             break;
          }
          case 'cross line': {
             g.appendChild(createLine(0, coords[0].y, 10000, coords[0].y, d.color, '1', '4,4'));
             g.appendChild(createLine(coords[0].x, 0, coords[0].x, 10000, d.color, '1', '4,4'));
             break;
          }
          case 'trend line': {
             if (coords.length > 1) g.appendChild(createLine(coords[0].x, coords[0].y, coords[1].x, coords[1].y, d.color));
             break;
          }
          case 'ray': {
             if (coords.length > 1) {
                const dx = coords[1].x - coords[0].x;
                const dy = coords[1].y - coords[0].y;
                const dist = Math.sqrt(dx*dx + dy*dy) || 1;
                const ext = 5000;
                g.appendChild(createLine(coords[0].x, coords[0].y, coords[0].x + (dx/dist)*ext, coords[0].y + (dy/dist)*ext, d.color));
             }
             break;
          }
          case 'extended line': {
             if (coords.length > 1) {
                const dx = coords[1].x - coords[0].x;
                const dy = coords[1].y - coords[0].y;
                const dist = Math.sqrt(dx*dx + dy*dy) || 1;
                const ext = 5000;
                g.appendChild(createLine(coords[0].x - (dx/dist)*ext, coords[0].y - (dy/dist)*ext, coords[0].x + (dx/dist)*ext, coords[0].y + (dy/dist)*ext, d.color));
             }
             break;
          }
          case 'rectangle': {
             if (coords.length > 1) {
                const x = Math.min(coords[0].x, coords[1].x);
                const y = Math.min(coords[0].y, coords[1].y);
                const w = Math.abs(coords[1].x - coords[0].x);
                const h = Math.abs(coords[1].y - coords[0].y);
                const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                r.setAttribute('x', x.toString()); r.setAttribute('y', y.toString());
                r.setAttribute('width', w.toString()); r.setAttribute('height', h.toString());
                r.setAttribute('fill', d.color + '33'); r.setAttribute('stroke', d.color); r.setAttribute('stroke-width', '2');
                g.appendChild(r);
             }
             break;
          }
          case 'triangle': {
             if (coords.length > 1) {
                const p = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                const pts = coords.map(c => `${c.x},${c.y}`).join(' ');
                p.setAttribute('points', pts);
                p.setAttribute('fill', d.color + '33'); p.setAttribute('stroke', d.color); p.setAttribute('stroke-width', '2');
                g.appendChild(p);
             }
             break;
          }
          case 'parallel channel': {
             if (coords.length > 1) g.appendChild(createLine(coords[0].x, coords[0].y, coords[1].x, coords[1].y, d.color));
             if (coords.length > 2) {
                const dx = coords[1].x - coords[0].x;
                const dy = coords[1].y - coords[0].y;
                g.appendChild(createLine(coords[2].x, coords[2].y, coords[2].x + dx, coords[2].y + dy, d.color));
                // Fill
                const p = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                p.setAttribute('points', `${coords[0].x},${coords[0].y} ${coords[1].x},${coords[1].y} ${coords[2].x + dx},${coords[2].y + dy} ${coords[2].x},${coords[2].y}`);
                p.setAttribute('fill', d.color + '22');
                g.appendChild(p);
             }
             break;
          }
          case 'pitchfork': {
             if (coords.length > 1) g.appendChild(createLine(coords[0].x, coords[0].y, coords[1].x, coords[1].y, d.color, '1', '4,4'));
             if (coords.length > 2) {
                const mx = (coords[1].x + coords[2].x) / 2;
                const my = (coords[1].y + coords[2].y) / 2;
                const dx = mx - coords[0].x;
                const dy = my - coords[0].y;
                const dist = Math.sqrt(dx*dx + dy*dy) || 1;
                const ext = 5000;
                // Median
                g.appendChild(createLine(coords[0].x, coords[0].y, coords[0].x + (dx/dist)*ext, coords[0].y + (dy/dist)*ext, d.color));
                // Upper
                g.appendChild(createLine(coords[1].x, coords[1].y, coords[1].x + (dx/dist)*ext, coords[1].y + (dy/dist)*ext, d.color));
                // Lower
                g.appendChild(createLine(coords[2].x, coords[2].y, coords[2].x + (dx/dist)*ext, coords[2].y + (dy/dist)*ext, d.color));
             }
             break;
          }
          case 'fibonacci retracement': {
             if (coords.length > 1) {
                const y1 = coords[0].y;
                const y2 = coords[1].y;
                const diff = y2 - y1;
                const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1, 1.618, 2.618];
                g.appendChild(createLine(coords[0].x, y1, coords[1].x, y2, d.color, '1', '4,4'));
                levels.forEach(l => {
                    const y = y1 + diff * l;
                    g.appendChild(createLine(Math.min(coords[0].x, coords[1].x), y, Math.max(coords[0].x, coords[1].x) + 200, y, d.color));
                    g.appendChild(createText(Math.max(coords[0].x, coords[1].x) + 205, y + 4, `${l} (${(coords[0].p.price - (coords[0].p.price - coords[1].p.price)*l).toFixed(2)})`, d.color));
                });
             }
             break;
          }
          case 'fibonacci fan': {
             if (coords.length > 1) {
                const x1 = coords[0].x, y1 = coords[0].y;
                const dx = coords[1].x - x1, dy = coords[1].y - y1;
                const levels = [0, 0.382, 0.5, 0.618, 1];
                levels.forEach(l => {
                    const ey = y1 + dy * l;
                    const ex = x1 + dx;
                    const dist = Math.sqrt((ex-x1)**2 + (ey-y1)**2) || 1;
                    g.appendChild(createLine(x1, y1, x1 + ((ex-x1)/dist)*5000, y1 + ((ey-y1)/dist)*5000, d.color));
                });
             }
             break;
          }
          case 'gann box': {
             if (coords.length > 1) {
                 const w = coords[1].x - coords[0].x;
                 const h = coords[1].y - coords[0].y;
                 const divisions = [0, 0.25, 0.382, 0.5, 0.618, 0.75, 1];
                 divisions.forEach(lvl => {
                     g.appendChild(createLine(coords[0].x + w * lvl, coords[0].y, coords[0].x + w * lvl, coords[1].y, d.color, '1', '2,2'));
                     g.appendChild(createLine(coords[0].x, coords[0].y + h * lvl, coords[1].x, coords[0].y + h * lvl, d.color, '1', '2,2'));
                 });
                 const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                 r.setAttribute('x', Math.min(coords[0].x, coords[1].x).toString()); r.setAttribute('y', Math.min(coords[0].y, coords[1].y).toString());
                 r.setAttribute('width', Math.abs(w).toString()); r.setAttribute('height', Math.abs(h).toString());
                 r.setAttribute('fill', d.color + '11'); r.setAttribute('stroke', d.color);
                 g.appendChild(r);
                 g.appendChild(createLine(coords[0].x, coords[0].y, coords[1].x, coords[1].y, d.color));
                 g.appendChild(createLine(coords[0].x, coords[1].y, coords[1].x, coords[0].y, d.color));
             }
             break;
          }
          case 'trend angle': {
             if (coords.length > 1) {
                g.appendChild(createLine(coords[0].x, coords[0].y, coords[1].x, coords[1].y, d.color));
                const angle = Math.atan2(coords[1].y - coords[0].y, coords[1].x - coords[0].x) * (180 / Math.PI);
                g.appendChild(createText(coords[1].x + 10, coords[1].y, `${(-angle).toFixed(1)}°`, d.color));
             }
             break;
          }
          case 'price range': {
             if (coords.length > 1) {
                const x = (coords[0].x + coords[1].x) / 2;
                g.appendChild(createLine(x, coords[0].y, x, coords[1].y, d.color, '2'));
                g.appendChild(createLine(x - 5, coords[0].y, x + 5, coords[0].y, d.color, '2'));
                g.appendChild(createLine(x - 5, coords[1].y, x + 5, coords[1].y, d.color, '2'));
                const pDiff = coords[1].p.price - coords[0].p.price;
                const pPct = (pDiff / coords[0].p.price) * 100;
                g.appendChild(createText(x + 10, (coords[0].y + coords[1].y) / 2, `${pDiff > 0 ? '+' : ''}${pDiff.toFixed(2)} (${pPct.toFixed(2)}%)`, d.color));
             }
             break;
          }
          case 'date range': {
             if (coords.length > 1) {
                const y = (coords[0].y + coords[1].y) / 2;
                g.appendChild(createLine(coords[0].x, y, coords[1].x, y, d.color, '2'));
                g.appendChild(createLine(coords[0].x, y - 5, coords[0].x, y + 5, d.color, '2'));
                g.appendChild(createLine(coords[1].x, y - 5, coords[1].x, y + 5, d.color, '2'));
                const bars = Math.abs((coords[1].p.time - coords[0].p.time) / (1000 * 60)); // Approximate bars/duration
                g.appendChild(createText((coords[0].x + coords[1].x) / 2 - 20, y - 10, `${bars.toFixed(0)} bars`, d.color));
             }
             break;
          }
          case 'date and price range': {
             if (coords.length > 1) {
                 const x = Math.min(coords[0].x, coords[1].x);
                 const y = Math.min(coords[0].y, coords[1].y);
                 const w = Math.abs(coords[1].x - coords[0].x);
                 const h = Math.abs(coords[1].y - coords[0].y);
                 const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                 r.setAttribute('x', x.toString()); r.setAttribute('y', y.toString());
                 r.setAttribute('width', w.toString()); r.setAttribute('height', h.toString());
                 r.setAttribute('fill', d.color + '33'); r.setAttribute('stroke', d.color);
                 g.appendChild(r);
                 const pDiff = coords[1].p.price - coords[0].p.price;
                 const pPct = (pDiff / coords[0].p.price) * 100;
                 const bars = Math.abs((coords[1].p.time - coords[0].p.time) / (1000 * 60));
                 g.appendChild(createText(x + w/2 - 30, y + h/2, `${pDiff > 0 ? '+' : ''}${pDiff.toFixed(2)} (${pPct.toFixed(2)}%)`, d.color));
                 g.appendChild(createText(x + w/2 - 20, y + h/2 + 15, `${bars.toFixed(0)} bars`, d.color));
             }
             break;
          }
          case 'cyclic lines': {
             if (coords.length > 1) {
                const dx = Math.abs(coords[1].x - coords[0].x);
                if (dx > 5) {
                    for (let i = 0; i < 20; i++) {
                        g.appendChild(createLine(coords[0].x + i * dx, 0, coords[0].x + i * dx, 10000, d.color, '1', '4,4'));
                        g.appendChild(createLine(coords[0].x - i * dx, 0, coords[0].x - i * dx, 10000, d.color, '1', '4,4'));
                    }
                }
             }
             break;
          }
          case 'curve': {
             if (coords.length > 1) {
                const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                let dStr = `M ${coords[0].x} ${coords[0].y} `;
                if (coords.length === 2) {
                    dStr += `L ${coords[1].x} ${coords[1].y}`;
                } else {
                    for (let i = 1; i < coords.length - 1; i++) {
                        const xc = (coords[i].x + coords[i + 1].x) / 2;
                        const yc = (coords[i].y + coords[i + 1].y) / 2;
                        dStr += `Q ${coords[i].x} ${coords[i].y}, ${xc} ${yc} `;
                    }
                    dStr += `L ${coords[coords.length-1].x} ${coords[coords.length-1].y}`;
                }
                p.setAttribute('d', dStr);
                p.setAttribute('fill', 'none'); p.setAttribute('stroke', d.color); p.setAttribute('stroke-width', '2');
                g.appendChild(p);
             }
             break;
          }
          case 'arc': {
             if (coords.length > 1) {
                 const r = Math.sqrt((coords[1].x - coords[0].x)**2 + (coords[1].y - coords[0].y)**2);
                 const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                 circle.setAttribute('cx', coords[0].x.toString()); circle.setAttribute('cy', coords[0].y.toString());
                 circle.setAttribute('r', r.toString());
                 circle.setAttribute('fill', 'none'); circle.setAttribute('stroke', d.color); circle.setAttribute('stroke-width', '2');
                 g.appendChild(circle);
             }
             break;
          }
          case 'pitchfan': {
             if (coords.length > 1) {
                const x1 = coords[0].x, y1 = coords[0].y;
                const dx = coords[1].x - x1, dy = coords[1].y - y1;
                const slopes = [0.5, 0.75, 1, 1.5, 2];
                g.appendChild(createLine(x1, y1, coords[1].x, coords[1].y, d.color, '2'));
                slopes.forEach(s => {
                    const sx = dx; const sy = dy * s;
                    const dist = Math.sqrt(sx*sx + sy*sy) || 1;
                    g.appendChild(createLine(x1, y1, x1 + (sx/dist)*5000, y1 + (sy/dist)*5000, d.color, '1', '2,2'));
                });
             }
             break;
          }
          case 'disjoint channel': {
             if (coords.length > 1) g.appendChild(createLine(coords[0].x, coords[0].y, coords[1].x, coords[1].y, d.color));
             if (coords.length > 3) g.appendChild(createLine(coords[2].x, coords[2].y, coords[3].x, coords[3].y, d.color));
             else if (coords.length > 2) g.appendChild(createLine(coords[2].x, coords[2].y, coords[2].x, coords[2].y, d.color));
             break;
          }
          default:
             if (coords.length > 1) g.appendChild(createLine(coords[0].x, coords[0].y, coords[1].x, coords[1].y, d.color));
        }

        // Draw anchor points
        coords.forEach((c, idx) => {
           const circ = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
           circ.setAttribute('cx', c.x.toString()); circ.setAttribute('cy', c.y.toString());
           circ.setAttribute('r', '6'); // Slightly larger for easier clicking
           circ.setAttribute('fill', d.color); circ.setAttribute('stroke', '#fff'); circ.setAttribute('stroke-width', '1.5');
           
           circ.style.pointerEvents = 'auto';
           circ.style.cursor = 'move';
           
           circ.onmousedown = (e) => {
               e.stopPropagation();
               const svgRect = svg.getBoundingClientRect();
               
               const onMove = (me: MouseEvent) => {
                   const x = me.clientX - svgRect.left;
                   const y = me.clientY - svgRect.top;
                   if (chart && series && onUpdateDrawingPoint) {
                       let logical = chart.timeScale().coordinateToLogical(x);
                       const vr = chart.timeScale().getVisibleLogicalRange();
                       if ((logical === null || logical === undefined) && vr && svgRect.width > 0) {
                           const bars = vr.to - vr.from;
                           logical = (vr.from + (x / svgRect.width) * bars) as any;
                       }
                       const time = (chart.timeScale().coordinateToTime(x) as number) || Math.floor(Date.now() / 1000);
                       let price = series.coordinateToPrice(y);
                       if (price === null) {
                           price = series.coordinateToPrice(Math.max(5, Math.min(svgRect.height - 5, y)));
                       }
                       if (price !== null && (logical !== null || time !== null)) {
                           onUpdateDrawingPoint(d.id, idx, { 
                             time, 
                             price, 
                             logical: (logical !== null && logical !== undefined) ? Number(logical) : undefined 
                           });
                       }
                   }
               };
               
               const onUp = () => {
                   window.removeEventListener('mousemove', onMove);
                   window.removeEventListener('mouseup', onUp);
               };
               
               window.addEventListener('mousemove', onMove);
               window.addEventListener('mouseup', onUp);
           };
           
           g.appendChild(circ);
        });

        svg.appendChild(g);
      });
      rafId = requestAnimationFrame(renderDrawings);
    };

    rafId = requestAnimationFrame(renderDrawings);
    return () => cancelAnimationFrame(rafId);
  }, [chart, series, drawings, crosshairPoint, activeDrawingId]);

  return (
    <svg
      ref={svgRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10
      }}
    />
  );
};
