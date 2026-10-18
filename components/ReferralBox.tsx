
import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

const ReferralBox: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState("1234567890123");

  useEffect(() => {
    const saved = localStorage.getItem('user_invite_code');
    if (saved && saved.length === 13) {
      setCode(saved);
    } else {
      const newCode = Math.floor(Math.random() * 9000000000000 + 1000000000000).toString();
      localStorage.setItem('user_invite_code', newCode);
      setCode(newCode);
    }
  }, []);

  const handleCopy = async () => {
    try {
      const invitationLink = `https://rajadhan.trust.com/#/register?invitationCode=${code}`;
      await navigator.clipboard.writeText(invitationLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  return (
    <div className="bg-[#1e2329] rounded-2xl p-4 mb-6 border border-white/5 flex items-center justify-between shadow-inner">
      <div className="flex flex-col">
        <span className="text-[11px] text-gray-400 font-medium">Invite Friend & Earn</span>
        <span className="text-lg font-black text-yellow-400 tracking-wider">{code}</span>
      </div>
      <button 
        onClick={handleCopy}
        className="bg-[#1e2329] hover:bg-[#3d2c6d] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border border-white/10 active:scale-95"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
};

export default ReferralBox;
