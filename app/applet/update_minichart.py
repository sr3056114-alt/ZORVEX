with open('src/components/MiniChart.tsx', 'r') as f:
    content = f.read()

# 1. Update OHLC position
old_ohlc = '           <div className="absolute top-3 left-3 z-20 pointer-events-none select-none max-w-[calc(100%-85px)] overflow-hidden">'
new_ohlc = '           <div className={`absolute ${screenNumber === 1 ? "top-[62px]" : "top-3"} left-3 z-20 pointer-events-none select-none max-w-[calc(100%-85px)] overflow-hidden`}>'

assert old_ohlc in content, 'old_ohlc not found'
content = content.replace(old_ohlc, new_ohlc, 1)

# 2. Update corner tag to be clickable
tag_marker = '{/* Sub-chart corner tag at bottom-left shifted right to avoid overlap with toolbar'
idx = content.find(tag_marker)
assert idx != -1, 'tag marker not found'
end_tag = '</div>\n        </div>'
end_idx = content.find(end_tag, idx) + len(end_tag)

old_tag_block = content[idx:end_idx]

new_tag_block = '''{/* Sub-chart corner tag at bottom-left shifted right to avoid overlap with toolbar: Clickable to select chart & change pair (User Request 1 & 6) */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.();
            onOpenAssetModal?.();
          }}
          className="absolute bottom-3 left-16 z-20 flex gap-2 cursor-pointer select-none group"
          title="Click to select this chart and change pair"
        >
           <div className="bg-[var(--bg-panel)]/90 backdrop-blur-md border border-[var(--border-color)] px-2.5 py-1 rounded flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)] shadow-md group-hover:border-[#1e88e5] group-hover:bg-[#1e88e5]/10 transition-colors">
              {screenNumber && (
                <span className="w-4 h-4 rounded-full bg-[#1e88e5]/20 text-[#1e88e5] flex items-center justify-center text-[10px] font-mono font-bold">
                  {screenNumber}
                </span>
              )}
              <span>{asset}</span>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">· {timeframe}</span>
              <ChevronDown size={11} className="text-[var(--text-muted)] group-hover:text-[#1e88e5] transition-colors" />
           </div>
        </div>'''

content = content[:idx] + new_tag_block + content[end_idx:]

with open('src/components/MiniChart.tsx', 'w') as f:
    f.write(content)

print('MiniChart updated successfully!')
