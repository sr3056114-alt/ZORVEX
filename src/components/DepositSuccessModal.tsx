import React from 'react';
import { Check, Edit, Bitcoin } from 'lucide-react';
import { motion } from 'motion/react';
import { PaymentMethodIcon } from './PaymentMethodIcon';

export default function DepositSuccessModal({ amount, currency, onClose }: { amount: number, currency: string, onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-[99999] bg-white flex flex-col items-center justify-center p-4"
    >
      {/* Container */}
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Success Icon */}
        <div className="relative mb-6">
           <div className="w-16 h-16 bg-[#2ebd85] rounded-full flex items-center justify-center relative z-10 shadow-lg shadow-[#2ebd85]/30">
              <Check size={32} className="text-white" strokeWidth={3} />
           </div>
           {/* Sparkles decoration */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px]">
              <div className="absolute top-2 left-4 w-1.5 h-1.5 bg-[#2ebd85] rounded-full opacity-60"></div>
              <div className="absolute top-6 right-2 w-2 h-2 bg-yellow-400 rounded-full opacity-80"></div>
              <div className="absolute bottom-4 left-6 w-1 h-1 bg-blue-400 rounded-full opacity-50"></div>
              <div className="absolute bottom-2 right-8 w-1.5 h-1.5 bg-[#2ebd85] rounded-full opacity-70"></div>
              <div className="absolute -top-1 right-8 w-1 h-1 bg-gray-300 rounded-full opacity-80"></div>
           </div>
        </div>

        {/* Text */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">Deposit Successful</h2>
        <h1 className="text-4xl font-black text-gray-900 mb-2">{amount} {currency}</h1>
        <p className="text-sm text-gray-500 mb-8 font-medium">Your assets are now in your Spot Account.</p>

        {/* Button */}
        <button onClick={onClose} className="bg-[#fcd535] hover:bg-[#fbd124] text-black font-bold py-2.5 px-10 rounded-md text-sm transition-colors mb-12 shadow-sm">
          Check Assets
        </button>

        {/* Trade Hottest Crypto */}
        <p className="text-xs text-gray-400 mb-4 font-semibold">Trade with Hottest Crypto</p>
        <div className="flex gap-3 w-full justify-center mb-6">
          <div className="border border-gray-100 rounded-xl p-4 flex-1 flex flex-col items-center shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer">
             <div className="mb-3">
                <PaymentMethodIcon name="Bitcoin" type="BTC" size={32} />
             </div>
             <div className="text-xs font-bold text-gray-900">BTC <span className="text-gray-400 font-medium">/ {currency}</span></div>
          </div>
          <div className="border border-gray-100 rounded-xl p-4 flex-1 flex flex-col items-center shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer">
             <div className="mb-3">
                <PaymentMethodIcon name="Ethereum" type="ETH" size={32} />
             </div>
             <div className="text-xs font-bold text-gray-900">ETH <span className="text-gray-400 font-medium">/ {currency}</span></div>
          </div>
          <div className="border border-gray-100 rounded-xl p-4 flex-1 flex flex-col items-center shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer">
             <div className="mb-3">
                <PaymentMethodIcon name="Binance Pay" type="BINANCE_PAY" size={32} />
             </div>
             <div className="text-xs font-bold text-gray-900">BNB <span className="text-gray-400 font-medium">/ {currency}</span></div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mb-8">
           <div className="w-3 h-1 bg-gray-300 rounded-full"></div>
           <div className="w-1.5 h-1 bg-gray-100 rounded-full"></div>
        </div>

        {/* Feedback */}
        <div className="w-full border border-gray-100 rounded-lg p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
           <span className="text-sm font-bold text-gray-700">Provide Feedback</span>
           <Edit size={16} className="text-gray-500" />
        </div>
      </div>
    </motion.div>
  );
}
