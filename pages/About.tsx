import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe } from 'lucide-react';
import QuotexLanguageDropdown from '../src/components/QuotexLanguageDropdown';

export default function About() {
  const navigate = useNavigate();
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
            <button onClick={() => navigate('/about')} className="text-[#1e88e5] transition-colors">About us</button>
            <button onClick={() => navigate('/faq')} className="hover:text-white transition-colors">FAQ</button>
            <button onClick={() => navigate('/blog')} className="hover:text-white transition-colors">Blog</button>
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

      <div className="flex-1 flex flex-col items-center max-w-4xl mx-auto py-20 px-4">
        <h1 className="text-4xl md:text-5xl font-black mb-12 text-center text-white tracking-tight">About Us</h1>
        <div className="bg-[#1f2631] border border-[#2a303d] rounded-lg p-10 text-[15px] leading-relaxed text-[#8390a0] shadow-xl">
          <p className="mb-6">
            <strong className="text-white">ZORVEX</strong> is an innovative platform for smart investments. We have created a comfortable environment for everyone to trade on the financial markets, regardless of their background or experience.
          </p>
          <p className="mb-6">
            Our mission is to make the trading process as simple and accessible as possible. We offer an intuitive interface, the most essential indicators, and a blazing-fast trading engine. Everything is designed to keep you focused on what matters — your trades.
          </p>
          <p>
            With Zorvex, you get access to a wide range of assets, high payouts, and a reliable platform you can trust. Over 4 million users have already chosen us as their primary trading broker globally. Join the smart investing community today.
          </p>
        </div>
      </div>
    </div>
  )
}
