import React from 'react';
import { useNavigate } from 'react-router-dom';
import QuotexLanguageDropdown from '../src/components/QuotexLanguageDropdown';

export default function Blog() {
  const navigate = useNavigate();
  
  const posts = [
    {
      title: "Understanding Candlestick Patterns",
      date: "Aug 15, 2026",
      excerpt: "Candlestick charts are a technical tool that packs data for multiple time frames into single price bars. Learn how to read them effectively.",
      img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "Top 5 Trading Strategies for Beginners",
      date: "Aug 10, 2026",
      excerpt: "Starting your trading journey can be daunting. We have compiled the top 5 simplest strategies to get your feet wet in the market.",
      img: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "Psychology of Trading: Keeping Emotions in Check",
      date: "Aug 02, 2026",
      excerpt: "Your biggest enemy in trading isn't the market, it's yourself. Discover techniques to maintain a cool head during volatile sessions.",
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600"
    }
  ];

  return (
    <div className="min-h-screen bg-[#11141a] font-sans text-white relative flex flex-col">
      <nav className="h-[70px] w-full flex items-center justify-between px-8 relative z-10 bg-[#11141a] border-b border-[#2a303d]">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="flex items-end gap-[2px]">
              <div className="w-[6px] h-4 bg-white rounded-[1px]"></div>
              <div className="w-[6px] h-6 bg-white rounded-[1px]"></div>
              <div className="w-[6px] h-5 bg-white rounded-[1px]"></div>
            </div>
            <span className="text-white font-black tracking-wider text-2xl">ZORVEX</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-6 text-[15px] font-bold text-[#8390a0]">
            <button onClick={() => navigate('/about')} className="hover:text-white transition-colors">About us</button>
            <button onClick={() => navigate('/faq')} className="hover:text-white transition-colors">FAQ</button>
            <button onClick={() => navigate('/blog')} className="text-[#1e88e5] transition-colors">Blog</button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <QuotexLanguageDropdown />
          <button 
            onClick={() => navigate('/login')}
            className="text-[#8390a0] hover:text-white font-bold text-sm px-4 py-2 transition-colors cursor-pointer"
          >
            Log in
          </button>
          <button 
            onClick={() => navigate('/signup')}
            className="bg-[#0ba259] hover:bg-[#0ea960] text-white font-bold text-sm px-6 py-2.5 rounded transition-colors cursor-pointer"
          >
            Registration
          </button>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center max-w-6xl mx-auto py-20 px-4 w-full">
        <h1 className="text-4xl md:text-5xl font-black mb-12 text-center text-white tracking-tight">Blog</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <div key={idx} className="bg-[#1f2631] border border-[#2a303d] rounded-lg overflow-hidden group cursor-pointer hover:border-[#1e88e5] transition-colors shadow-lg">
              <div className="h-48 overflow-hidden relative">
                 <div className="absolute inset-0 bg-[#11141a]/20 group-hover:bg-transparent transition-colors z-10"></div>
                 <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale-[0.2]" />
              </div>
              <div className="p-6">
                 <div className="text-[#1e88e5] text-[11px] font-bold tracking-widest uppercase mb-2">{post.date}</div>
                 <h3 className="text-xl font-bold text-white mb-3 leading-tight">{post.title}</h3>
                 <p className="text-[#8390a0] text-sm leading-relaxed mb-4">{post.excerpt}</p>
                 <span className="text-white text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">Read More &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
