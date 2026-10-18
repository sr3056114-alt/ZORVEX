import React from 'react';
import { Send, Play, Apple } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#151a22] pt-16 pb-8 border-t border-[#1a1f27] text-[#8390a0] z-20 relative w-full mt-auto text-sm shrink-0">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          
          {/* Logo / Brand */}
          <div className="md:col-span-3">
             <div className="flex items-center gap-2 mb-6 cursor-pointer">
                <div className="flex items-end gap-[2px]">
                   <div className="w-[6px] h-4 bg-[#1e88e5] rounded-[1px]"></div>
                   <div className="w-[6px] h-6 bg-[#0ba259] rounded-[1px]"></div>
                   <div className="w-[6px] h-5 bg-[#1e88e5] rounded-[1px]"></div>
                </div>
                <span className="text-white font-black tracking-wider text-2xl">ZORVE<span className="text-[#1e88e5]">X</span></span>
             </div>
          </div>

          {/* FAQ Column */}
          <div className="md:col-span-2">
             <h4 className="text-white font-bold mb-4 flex items-center gap-1 cursor-pointer hover:text-[#1e88e5] transition-colors">FAQ <span className="text-[10px]">❯</span></h4>
             <ul className="flex flex-col gap-3">
                <li><a href="#" className="hover:text-white transition-colors">General questions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Financial questions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Verification</a></li>
             </ul>
          </div>

          {/* About us Column */}
          <div className="md:col-span-2">
             <h4 className="text-white font-bold mb-4 flex items-center gap-1 cursor-pointer hover:text-[#1e88e5] transition-colors">About us <span className="text-[10px]">❯</span></h4>
             <ul className="flex flex-col gap-3">
                <li><a href="#" className="hover:text-white transition-colors">Reviews</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacts</a></li>
             </ul>
          </div>

          {/* More Column */}
          <div className="md:col-span-2">
             <h4 className="text-white font-bold mb-4">More</h4>
             <ul className="flex flex-col gap-3">
                <li><a href="#" className="hover:text-white transition-colors">Demo account</a></li>
                <li><a href="#" className="flex items-center gap-1 hover:text-white transition-colors">Affiliate program <span className="text-[10px] ml-1">⍈</span></a></li>
             </ul>
          </div>

          {/* App & Socials */}
          <div className="md:col-span-3">
             <h4 className="text-white font-bold mb-3">Download the app</h4>
             <div className="flex flex-col gap-3 mb-8">
                <button className="bg-black border border-[#2a303d] rounded-lg px-4 py-1.5 flex items-center justify-center gap-3 hover:bg-[#1a1f27] transition-colors w-40">
                    <Play size={20} className="text-white fill-white" />
                    <div className="text-left">
                       <div className="text-[8px] text-gray-400 uppercase leading-none">GET IT ON</div>
                       <div className="text-sm font-bold text-white leading-tight">Google Play</div>
                    </div>
                </button>
                <button className="bg-black border border-[#2a303d] rounded-lg px-4 py-1.5 flex items-center justify-center gap-3 hover:bg-[#1a1f27] transition-colors w-40">
                    <Apple size={20} className="text-white fill-white" />
                    <div className="text-left">
                       <div className="text-[8px] text-gray-400 uppercase leading-none">Progressive</div>
                       <div className="text-sm font-bold text-white leading-tight">Web App</div>
                    </div>
                </button>
             </div>

             <h4 className="text-white font-bold mb-3">Follow us on social media</h4>
             <div className="flex flex-col gap-2">
                <a href="#" className="bg-[#1a1f27] rounded-md py-2 px-4 flex items-center justify-between hover:bg-[#1f2631] transition-colors w-40 border border-[#2a303d]">
                   <svg className="w-4 h-4 text-[#1e88e5] fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                   <span className="text-[#1e88e5] font-bold text-xs">32K+</span>
                </a>
                <a href="#" className="bg-[#1a1f27] rounded-md py-2 px-4 flex items-center justify-between hover:bg-[#1f2631] transition-colors w-40 border border-[#2a303d]">
                   <svg className="w-4 h-4 text-[#1e88e5] fill-none stroke-current stroke-2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                   <span className="text-[#1e88e5] font-bold text-xs">110K+</span>
                </a>
                <a href="#" className="bg-[#1a1f27] rounded-md py-2 px-4 flex items-center justify-between hover:bg-[#1f2631] transition-colors w-40 border border-[#2a303d]">
                   <Send size={16} className="text-[#1e88e5] fill-[#1e88e5]" />
                   <span className="text-[#1e88e5] font-bold text-xs">390K+</span>
                </a>
             </div>
          </div>
        </div>

        {/* Legal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8 border-t border-[#1a1f27] text-[11px] leading-relaxed">
           <div className="md:col-span-1 flex flex-col gap-3">
              <h4 className="text-white font-bold mb-1 text-xs">Regulations</h4>
              <a href="#" className="hover:text-white transition-colors">Privacy policy</a>
              <a href="#" className="hover:text-white transition-colors">Service agreement</a>
              <a href="#" className="hover:text-white transition-colors">Risk disclosure</a>
              <a href="#" className="hover:text-white transition-colors">Rules of trading operations</a>
              <a href="#" className="hover:text-white transition-colors">Non-trading operations regulations</a>
              <a href="#" className="hover:text-white transition-colors">Payment policy</a>
           </div>
           
           <div className="md:col-span-3 flex flex-col gap-4 text-[#7d8794]">
              <p>ON SPOT GROUP LLC. Address: Main Street, P.O. Box 625, Charlestown, St. Kitts and Nevis.</p>
              <p>The website services are not available in a number of countries, including USA, Canada, Hong Kong, EEA countries, Israel, Russia as well as for persons under 18 years of age.</p>
              <p>Risk Warning: Trading Forex and Leveraged Financial Instruments involves significant risk and can result in the loss of your invested capital. You should not invest more than you can afford to lose and should ensure that you fully understand the risks involved. Trading leveraged products may not be suitable for all investors. Trading non-leveraged products such as stocks also involves risk as the value of a stock can fall as well as rise, which could mean getting back less than you originally put in. Past performance is no guarantee of future results. Before trading, please take into consideration your level of experience, investment objectives and seek independent financial advice if necessary. It is the responsibility of the Client to ascertain whether he/she is permitted to use the services of the Zorvex brand based on the legal requirements in his/her country of residence.</p>
              <div className="mt-4">
                 <p>ON SPOT GROUP LLC is the owner of the zorvex.com domain.</p>
                 <p>Copyright © 2026 Zorvex. All rights reserved</p>
              </div>
           </div>
        </div>
      </div>
    </footer>
  )
}
