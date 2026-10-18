import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { MessageSquare, Image as ImageIcon, Send, CheckCircle, Clock } from 'lucide-react';

export default function AdminSupport() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'supportTickets'), orderBy('updatedAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setTickets(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const handleReply = async () => {
    if (!replyText.trim() || !selectedTicket) return;
    try {
      const updatedMessages = [
        ...(selectedTicket.messages || []),
        { sender: 'ADMIN', text: replyText, timestamp: Date.now() }
      ];
      await updateDoc(doc(db, 'supportTickets', selectedTicket.id), {
        messages: updatedMessages,
        status: 'ANSWERED',
        updatedAt: Date.now()
      });
      setReplyText('');
      alert("Reply sent successfully");
    } catch (err: any) {
      alert("Error sending reply: " + err.message);
    }
  };

  const markResolved = async (id: string) => {
    await updateDoc(doc(db, 'supportTickets', id), { status: 'RESOLVED', updatedAt: Date.now() });
  };

  return (
    <div className="flex gap-6 h-[75vh]">
      <div className="w-1/3 bg-[#1a202c] border border-[#2b3342] rounded-xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-[#2b3342] bg-[#151a23]">
          <h3 className="text-lg font-bold text-white">Support Tickets</h3>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
          {tickets.map(t => (
            <div 
              key={t.id} 
              onClick={() => setSelectedTicket(t)}
              className={`p-4 rounded-lg cursor-pointer border transition-colors ${selectedTicket?.id === t.id ? 'bg-[#1e88e5]/10 border-[#1e88e5]/50' : 'bg-[#11151c] border-[#2b3342] hover:border-[#3b4353]'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="text-white font-bold text-sm truncate">{t.subject || 'No Subject'}</div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${t.status === 'PENDING' ? 'bg-orange-500/20 text-orange-500' : t.status === 'RESOLVED' ? 'bg-[#0ba259]/20 text-[#0ba259]' : 'bg-[#1e88e5]/20 text-[#1e88e5]'}`}>{t.status}</span>
              </div>
              <div className="text-xs text-[#8390a0] mb-1">User: {t.userEmail}</div>
              <div className="text-[10px] text-[#5c6776]">{new Date(t.updatedAt).toLocaleString()}</div>
            </div>
          ))}
          {tickets.length === 0 && <div className="text-center text-[#8390a0] p-4 text-sm">No tickets found.</div>}
        </div>
      </div>
      
      <div className="flex-1 bg-[#1a202c] border border-[#2b3342] rounded-xl flex flex-col overflow-hidden">
        {selectedTicket ? (
          <>
            <div className="p-4 border-b border-[#2b3342] bg-[#151a23] flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedTicket.subject}</h3>
                <div className="text-xs text-[#8390a0]">Ticket ID: {selectedTicket.id} | User: {selectedTicket.userEmail}</div>
              </div>
              {selectedTicket.status !== 'RESOLVED' && (
                <button onClick={() => markResolved(selectedTicket.id)} className="bg-[#0ba259]/20 hover:bg-[#0ba259]/30 text-[#0ba259] px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition-colors">
                  <CheckCircle size={14} /> Mark Resolved
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
              {(selectedTicket.messages || []).map((msg: any, idx: number) => (
                <div key={idx} className={`flex ${msg.sender === 'ADMIN' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-4 rounded-xl ${msg.sender === 'ADMIN' ? 'bg-[#1e88e5] text-white rounded-br-none' : 'bg-[#2b313f] border border-[#3b4353] text-white rounded-bl-none'}`}>
                    <div className="text-xs text-white/70 font-bold mb-1 uppercase tracking-wider">{msg.sender}</div>
                    <div className="text-sm whitespace-pre-wrap">{msg.text}</div>
                    {msg.imageUrl && (
                      <div className="mt-3">
                        <img src={msg.imageUrl} alt="attachment" className="max-w-full h-auto rounded border border-white/20" />
                      </div>
                    )}
                    <div className="text-[10px] text-white/50 mt-2 text-right">{new Date(msg.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-[#2b3342] bg-[#151a23]">
              <div className="flex gap-3">
                <textarea 
                  value={replyText} 
                  onChange={e => setReplyText(e.target.value)} 
                  placeholder="Type your reply here..." 
                  className="flex-1 bg-[#11151c] border border-[#2b3342] text-white p-3 rounded-lg focus:outline-none focus:border-[#1e88e5] resize-none h-20"
                />
                <button onClick={handleReply} className="bg-[#1e88e5] hover:bg-[#1e88e5]/90 text-white px-6 rounded-lg font-bold flex items-center gap-2 transition-colors">
                  <Send size={18} /> Reply
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-[#8390a0]">
            <MessageSquare size={48} className="mb-4 opacity-50" />
            <p>Select a ticket to view conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}
