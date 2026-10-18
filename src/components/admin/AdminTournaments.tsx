import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Plus, Edit2, Trash2, Trophy } from 'lucide-react';
import { useToast } from '../Toast';

export default function AdminTournaments() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    desc: '5 Trades | Any Asset',
    pool: 1000,
    fee: 0,
    start: Date.now(),
    status: 'UPCOMING',
    icon: '🥇',
    minTrades: 20,
    markets: 'Forex | Gold | Indices',
    prizes: [4000, 2500, 1500, 1000, 500],
    leaderboard: [
      { name: 'ProTrader007', profit: 3245.00, trades: 48, winRate: 83 },
      { name: 'KingGold', profit: 2890.00, trades: 62, winRate: 77 },
      { name: 'TradeMaster', profit: 2560.00, trades: 55, winRate: 72 },
      { name: 'RiskTaker', profit: 2340.00, trades: 41, winRate: 68 },
      { name: 'AlphaTrader', profit: 2120.00, trades: 37, winRate: 65 }
    ]
  });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'tournaments'), (snap) => {
      setTournaments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const handleSave = async () => {
    try {
      if (formData.id) {
        const { id, ...data } = formData;
        await updateDoc(doc(db, 'tournaments', id), data);
        showToast('Tournament updated successfully!', 'success');
      } else {
        const { id, ...data } = formData;
        await addDoc(collection(db, 'tournaments'), data);
        showToast('Tournament created successfully!', 'success');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if(window.confirm('Are you sure you want to delete this tournament?')) {
      await deleteDoc(doc(db, 'tournaments', id));
      showToast('Tournament deleted');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Tournaments Management</h2>
          <p className="text-sm text-[#8390a0]">Create and manage binary trading tournaments</p>
        </div>
        <button 
          onClick={() => {
            setFormData({
              id: '',
              title: '',
              desc: '5 Trades | Any Asset',
              pool: 1000,
              fee: 0,
              start: Date.now() + 86400000,
              status: 'UPCOMING',
              icon: '🥇',
              minTrades: 20,
              markets: 'Forex | Gold | Indices'
            });
            setIsModalOpen(true);
          }}
          className="bg-[#0ba259] text-white px-4 py-2 rounded font-bold text-sm flex items-center gap-2 hover:bg-[#0ba259]/90"
        >
          <Plus size={16} /> Create Tournament
        </button>
      </div>

      <div className="bg-[#1a202c] border border-[#2b3342] rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#1e2532] text-[#8390a0] font-bold text-xs">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Prize Pool</th>
              <th className="px-6 py-4">Entry Fee</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2b3342] text-white">
            {tournaments.map(t => (
              <tr key={t.id} className="hover:bg-[#202836]">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{t.icon}</span>
                    <div>
                       <div className="font-bold">{t.title}</div>
                       <div className="text-xs text-[#8390a0]">{t.desc}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-[#0ba259] font-bold">${t.pool}</td>
                <td className="px-6 py-4">{t.fee === 0 ? 'FREE' : `$${t.fee}`}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${t.status === 'ACTIVE' ? 'bg-[#0ba259]/10 text-[#0ba259]' : t.status === 'UPCOMING' ? 'bg-[#1e88e5]/10 text-[#1e88e5]' : 'bg-[#e33f4a]/10 text-[#e33f4a]'}`}>
                    {t.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => { setFormData(t); setIsModalOpen(true); }}
                      className="p-1.5 bg-[#1e88e5]/10 text-[#1e88e5] rounded hover:bg-[#1e88e5]/20"
                    ><Edit2 size={14} /></button>
                    <button 
                      onClick={() => handleDelete(t.id)}
                      className="p-1.5 bg-[#e33f4a]/10 text-[#e33f4a] rounded hover:bg-[#e33f4a]/20"
                    ><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {tournaments.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-[#8390a0]">
                  No tournaments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-[#1a202c] border border-[#2b3342] rounded-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"><div className="overflow-y-auto custom-scrollbar flex-1">
            <div className="p-4 border-b border-[#2b3342] flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">{formData.id ? 'Edit' : 'Create'} Tournament</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#8390a0] hover:text-white">✕</button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#8390a0] mb-1">Title</label>
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-[#111621] border border-[#2b3342] rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8390a0] mb-1">Icon (Emoji)</label>
                  <input 
                    type="text" 
                    value={formData.icon} 
                    onChange={e => setFormData({...formData, icon: e.target.value})}
                    className="w-full bg-[#111621] border border-[#2b3342] rounded px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8390a0] mb-1">Description (e.g. 5 Trades | Any Asset)</label>
                <input 
                  type="text" 
                  value={formData.desc} 
                  onChange={e => setFormData({...formData, desc: e.target.value})}
                  className="w-full bg-[#111621] border border-[#2b3342] rounded px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#8390a0] mb-1">Prize Pool ($)</label>
                  <input 
                    type="number" 
                    value={formData.pool} 
                    onChange={e => setFormData({...formData, pool: Number(e.target.value)})}
                    className="w-full bg-[#111621] border border-[#2b3342] rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8390a0] mb-1">Entry Fee ($) [0 for Free]</label>
                  <input 
                    type="number" 
                    value={formData.fee} 
                    onChange={e => setFormData({...formData, fee: Number(e.target.value)})}
                    className="w-full bg-[#111621] border border-[#2b3342] rounded px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#8390a0] mb-1">Min Trades required</label>
                  <input 
                    type="number" 
                    value={formData.minTrades} 
                    onChange={e => setFormData({...formData, minTrades: Number(e.target.value)})}
                    className="w-full bg-[#111621] border border-[#2b3342] rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8390a0] mb-1">Markets allowed</label>
                  <input 
                    type="text" 
                    value={formData.markets} 
                    onChange={e => setFormData({...formData, markets: e.target.value})}
                    className="w-full bg-[#111621] border border-[#2b3342] rounded px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#8390a0] mb-1">Status</label>
                  <select 
                    value={formData.status} 
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full bg-[#111621] border border-[#2b3342] rounded px-3 py-2 text-white"
                  >
                    <option value="UPCOMING">Upcoming</option>
                    <option value="ACTIVE">Active</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8390a0] mb-1">Start Time (Date/Time)</label>
                  <input 
                    type="datetime-local" 
                    value={new Date(formData.start - new Date().getTimezoneOffset() * 60000).toISOString().slice(0,16)}
                    onChange={e => setFormData({...formData, start: new Date(e.target.value).getTime()})}
                    className="w-full bg-[#111621] border border-[#2b3342] rounded px-3 py-2 text-white"
                  />
                </div>
              </div>
            
              <div className="border-t border-[#2b3342] pt-4 mt-4">
                <h4 className="text-white font-bold mb-2">Prize Distribution (Top 5)</h4>
                <div className="grid grid-cols-5 gap-2">
                  {[0,1,2,3,4].map(i => (
                    <div key={`prize-${i}`}>
                      <label className="block text-[10px] text-[#8390a0] mb-1">Rank {i+1} ($)</label>
                      <input type="number" value={formData.prizes?.[i] || 0} onChange={e => {
                        const newPrizes = [...(formData.prizes || [0,0,0,0,0])];
                        newPrizes[i] = Number(e.target.value);
                        setFormData({...formData, prizes: newPrizes});
                      }} className="w-full bg-[#111621] border border-[#2b3342] rounded px-2 py-1 text-white text-xs"/>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-[#2b3342] pt-4 mt-4">
                <h4 className="text-white font-bold mb-2">Live Leaderboard Simulation (Top 5)</h4>
                {[0,1,2,3,4].map(i => (
                  <div key={`lb-${i}`} className="grid grid-cols-4 gap-2 mb-2">
                    <div>
                      <label className="block text-[10px] text-[#8390a0] mb-1">Name (Rank {i+1})</label>
                      <input type="text" value={formData.leaderboard?.[i]?.name || ''} onChange={e => {
                        const newLb = [...(formData.leaderboard || [])];
                        if(!newLb[i]) newLb[i] = {name:'', profit:0, trades:0, winRate:0};
                        newLb[i].name = e.target.value;
                        setFormData({...formData, leaderboard: newLb});
                      }} className="w-full bg-[#111621] border border-[#2b3342] rounded px-2 py-1 text-white text-xs"/>
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#8390a0] mb-1">Profit ($)</label>
                      <input type="number" value={formData.leaderboard?.[i]?.profit || 0} onChange={e => {
                        const newLb = [...(formData.leaderboard || [])];
                        if(!newLb[i]) newLb[i] = {name:'', profit:0, trades:0, winRate:0};
                        newLb[i].profit = Number(e.target.value);
                        setFormData({...formData, leaderboard: newLb});
                      }} className="w-full bg-[#111621] border border-[#2b3342] rounded px-2 py-1 text-white text-xs"/>
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#8390a0] mb-1">Trades</label>
                      <input type="number" value={formData.leaderboard?.[i]?.trades || 0} onChange={e => {
                        const newLb = [...(formData.leaderboard || [])];
                        if(!newLb[i]) newLb[i] = {name:'', profit:0, trades:0, winRate:0};
                        newLb[i].trades = Number(e.target.value);
                        setFormData({...formData, leaderboard: newLb});
                      }} className="w-full bg-[#111621] border border-[#2b3342] rounded px-2 py-1 text-white text-xs"/>
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#8390a0] mb-1">Win Rate (%)</label>
                      <input type="number" value={formData.leaderboard?.[i]?.winRate || 0} onChange={e => {
                        const newLb = [...(formData.leaderboard || [])];
                        if(!newLb[i]) newLb[i] = {name:'', profit:0, trades:0, winRate:0};
                        newLb[i].winRate = Number(e.target.value);
                        setFormData({...formData, leaderboard: newLb});
                      }} className="w-full bg-[#111621] border border-[#2b3342] rounded px-2 py-1 text-white text-xs"/>
                    </div>
                  </div>
                ))}
              </div>

            </div>
            <div className="p-4 border-t border-[#2b3342] flex justify-end gap-2">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded text-[#8390a0] font-bold hover:bg-[#2b3342]"
              >Cancel</button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-[#0ba259] text-white rounded font-bold hover:bg-[#0ba259]/90"
              >Save</button>
            </div>
          </div></div>
        </div>
      )}
    </div>
  );
}
