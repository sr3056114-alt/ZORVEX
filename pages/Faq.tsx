import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuotexLanguageDropdown from '../src/components/QuotexLanguageDropdown';

export default function Faq() {
  const navigate = useNavigate();
  const [openQ, setOpenQ] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is a trading platform and why is it needed?",
      a: "A trading platform is a software interface provided by a broker to its clients. It allows users to execute trades in the financial markets, view real-time charts, and manage their investments."
    },
    {
      q: "What is the minimum deposit amount?",
      a: "The minimum deposit amount on our platform is 10 USD. This allows beginners to start trading with minimal risk."
    },
    {
      q: "How to withdraw money from the account?",
      a: "You can withdraw funds using the same method you used for depositing. Just go to the Withdrawal section in your account, choose your preferred method, enter the amount, and submit your request."
    },
    {
      q: "Is there any fee for depositing or withdrawing funds?",
      a: "No, Zorvex does not charge any hidden fees for deposits or withdrawals. However, your payment system or bank might apply standard conversion rates or transaction fees."
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
            <button onClick={() => navigate('/faq')} className="text-[#1e88e5] transition-colors">FAQ</button>
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

      <div className="flex-1 flex flex-col items-center max-w-4xl mx-auto py-20 px-4 w-full">
        <h1 className="text-4xl md:text-5xl font-black mb-12 text-center text-white tracking-tight">FAQ</h1>
        
        <div className="w-full flex flex-col gap-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-[#1f2631] border border-[#2a303d] rounded-lg overflow-hidden shadow-sm">
              <div 
                className="p-6 cursor-pointer flex justify-between items-center bg-[#1f2631] hover:bg-[#2a303d]/30 transition-colors"
                onClick={() => setOpenQ(openQ === idx ? null : idx)}
              >
                <h3 className="font-bold text-[16px] text-white">{faq.q}</h3>
                <span className="text-[#1e88e5] font-black text-xl">{openQ === idx ? '-' : '+'}</span>
              </div>
              {openQ === idx && (
                <div className="p-6 pt-0 text-[15px] text-[#8390a0] border-t border-[#2a303d] mt-2 pt-4 bg-[#1f2631]">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
