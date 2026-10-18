
import React, { useState, useEffect } from 'react';

interface SliderImage {
  id: string;
  url: string;
  name: string;
}

const defaultSlides = [
  {
    title: "RAJADHAN GAME",
    subtitle: "VIP UPGRADE",
    benefits: ["VIP MONTHLY BONUS", "BONUS REBATE", "BONUS"],
    image: "https://picsum.photos/800/400?random=1",
    bgColor: "bg-gradient-to-br from-[#0b0e11] to-[#1e2329]"
  },
  {
    title: "NEW ARRIVAL",
    subtitle: "CRASH ROYALE",
    benefits: ["INSTANT WITHDRAW", "10X MULTIPLIER", "LUCKY DRAW"],
    image: "https://picsum.photos/800/400?random=2",
    bgColor: "bg-gradient-to-br from-[#0b0e11] to-[#1e2329]"
  }
];

const HeroSlider: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [slides, setSlides] = useState(defaultSlides);

  useEffect(() => {
    // Load custom slider images from localStorage
    const storedImages = localStorage.getItem('rajadhan_slider_images');
    if (storedImages) {
      try {
        const parsedImages: SliderImage[] = JSON.parse(storedImages);
        if (parsedImages && parsedImages.length > 0) {
          // Map the uploaded images to the slide format
          const customSlides = parsedImages.map((img, index) => ({
            title: index % 2 === 0 ? "RAJADHAN GAME" : "NEW ARRIVAL",
            subtitle: img.name.toUpperCase().replace(/\.[^/.]+$/, "") || "PROMO",
            benefits: ["VIP MONTHLY BONUS", "BONUS REBATE", "BONUS"],
            image: img.url,
            bgColor: "bg-gradient-to-br from-[#0b0e11] to-[#1e2329]"
          }));
          setSlides(customSlides);
        }
      } catch (e) {
        console.error("Failed to parse slider images", e);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden mb-6 shadow-2xl group">
      {slides.map((slide, idx) => (
        <div 
          key={idx}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === activeSlide ? 'opacity-100' : 'opacity-0'} ${slide.bgColor} p-4 flex items-center overflow-hidden`}
        >
          <div className="relative z-10 w-1/2">
             <div className="flex items-center gap-1 mb-1">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
               <span className="text-[10px] font-bold tracking-[0.2em] text-white/80">{slide.title}</span>
               <div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
             </div>
             <h2 className="text-3xl font-black tracking-tighter text-yellow-400 leading-none mb-3 drop-shadow-lg truncate">
               {slide.subtitle}
             </h2>
             <div className="space-y-1">
               {slide.benefits.map((benefit, bIdx) => (
                 <div key={bIdx} className="text-[9px] font-bold text-white/90 flex items-center gap-1">
                   <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                   {benefit}
                 </div>
               ))}
             </div>
          </div>
          
          <div className="absolute right-[-10%] top-[-10%] bottom-[-10%] w-[60%] flex items-center justify-center transform group-hover:scale-110 transition-transform duration-1000">
             <img src={slide.image} alt="Promo" className="w-full h-full object-cover rounded-full mix-blend-screen opacity-60" />
             <div className="absolute inset-0 bg-gradient-to-l from-[#1e2329]/50 to-transparent"></div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {slides.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeSlide ? 'w-4 bg-white' : 'w-1.5 bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
