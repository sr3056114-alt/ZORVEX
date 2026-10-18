import React, { useState } from 'react';
import { HelpCircle, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';

interface SupportViewProps {
  onBack?: () => void;
}

export const SupportView: React.FC<SupportViewProps> = ({ onBack }) => {
  const [topic, setTopic] = useState('Deposit & Payment Verification');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSent(true);
    setTimeout(() => {
      setMessage('');
      setSent(false);
    }, 2500);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-2xl mx-auto w-full text-[var(--text-primary)]">
      {onBack && (
        <button
          onClick={onBack}
          className="mb-4 p-2 bg-[var(--hover-bg)] hover:bg-[var(--hover-bg-strong)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 font-bold text-xs"
        >
          <ArrowLeft size={16} />
          <span>Back to Trade</span>
        </button>
      )}

      <div className="mb-6">
        <h2 className="text-2xl font-black flex items-center gap-2 text-[var(--text-primary)]">
          <HelpCircle className="text-[#00c26f]" /> Help & Support Center
        </h2>
        <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">
          24/7 dedicated support team available to assist with accounts, deposits, and trading inquiries.
        </p>
      </div>

      <div className="bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-2xl p-6 shadow-2xl">
        {sent ? (
          <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
            <CheckCircle2 size={48} className="text-[#00c26f] animate-bounce" />
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Ticket Submitted Successfully!</h3>
            <p className="text-xs text-[var(--text-muted)]">Our support specialist will reply to your registered email shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-[var(--text-muted)] font-semibold uppercase block mb-1.5">
                Topic / Department
              </label>
              <select
                value={topic}
                onChange={e => setTopic(e.target.value)}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#1e88e5] transition-colors"
              >
                <option value="Deposit & Payment Verification">Deposit & Payment Verification</option>
                <option value="Withdrawal Processing Status">Withdrawal Processing Status</option>
                <option value="Real Account Top-up Questions">Real Account Top-up Questions</option>
                <option value="Trading Terminal Technical Support">Trading Terminal Technical Support</option>
                <option value="General Feedback">General Feedback</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-[var(--text-muted)] font-semibold uppercase block mb-1.5">
                Describe your inquiry
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Please include transaction ID or detail if applicable..."
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-3 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#1e88e5] transition-colors"
              />
            </div>

            <button
              type="submit"
              className="py-3 bg-[#00c26f] hover:bg-[#00c26f]/90 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#00c26f]/20 cursor-pointer active:scale-95 transition-all"
            >
              <Send size={15} /> Submit Support Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SupportView;
