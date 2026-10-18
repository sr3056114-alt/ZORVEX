import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import { Plus, Edit2, Trash2, Gift, DollarSign, Image as ImageIcon, Calendar } from 'lucide-react';

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [claims, setClaims] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'DEPOSIT_BONUS',
    bannerUrl: '',
    startDate: '',
    endDate: '',
    minAmount: '50',
    rewardType: 'PERCENTAGE',
    rewardValue: '100',
    maxReward: '500',
    perUserLimit: '1',
    totalLimit: '1000',
    status: 'ACTIVE'
  });

  useEffect(() => {
    const unsubPromos = onSnapshot(query(collection(db, 'promotions'), orderBy('createdAt', 'desc')), (snap) => {
      setPromotions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubClaims = onSnapshot(query(collection(db, 'promotionClaims'), orderBy('timestamp', 'desc'), limit(100)), (snap) => {
      setClaims(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => { unsubPromos(); unsubClaims(); };
  }, []);

  const handleSave = async () => {
    if (!formData.name || !formData.startDate || !formData.endDate) return alert("Name and Dates are required.");
    try {
      const promoData = {
        ...formData,
        minAmount: Number(formData.minAmount),
        rewardValue: Number(formData.rewardValue),
        maxReward: Number(formData.maxReward),
        perUserLimit: Number(formData.perUserLimit),
        totalLimit: Number(formData.totalLimit),
        updatedAt: Date.now()
      };

      if (editId) {
        await updateDoc(doc(db, 'promotions', editId), promoData);
        await logAudit(`Updated Promotion: ${formData.name}`);
      } else {
        const newRef = doc(collection(db, 'promotions'));
        await setDoc(newRef, { ...promoData, createdAt: Date.now() });
        await logAudit(`Created Promotion: ${formData.name}`);
      }
      setShowModal(false);
      setEditId(null);
      // Reset form
    } catch (err: any) {
      alert("Error saving: " + err.message);
    }
  };

  const handleEdit = (promo: any) => {
    setFormData({
      name: promo.name,
      description: promo.description,
      type: promo.type,
      bannerUrl: promo.bannerUrl || '',
      startDate: promo.startDate,
      endDate: promo.endDate,
      minAmount: String(promo.minAmount),
      rewardType: promo.rewardType,
      rewardValue: String(promo.rewardValue),
      maxReward: String(promo.maxReward),
      perUserLimit: String(promo.perUserLimit),
      totalLimit: String(promo.totalLimit),
      status: promo.status
    });
    setEditId(promo.id);
    setShowModal(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if(confirm(`Are you sure you want to delete promotion ${name}?`)) {
       await deleteDoc(doc(db, 'promotions', id));
       await logAudit(`Deleted Promotion: ${name}`);
    }
  };

  const logAudit = async (action: string) => {
    await setDoc(doc(collection(db, 'auditLogs')), {
      adminId: 'ADMIN',
      action,
      targetId: 'PROMOTIONS',
      timestamp: Date.now()
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Promotions & Campaigns</h2>
        <button onClick={() => { setEditId(null); setShowModal(true); }} className="bg-[#1e88e5] hover:bg-[#1e88e5]/90 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2">
          <Plus size={16} /> Create Promotion
        </button>
      </div>

      <div className="bg-[#1a202c] border border-[#2b3342] rounded-xl overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="border-b border-[#2b3342] bg-[#151a23]">
                  <th className="p-4 text-xs font-bold text-[#8390a0] uppercase tracking-wider">Campaign</th>
                  <th className="p-4 text-xs font-bold text-[#8390a0] uppercase tracking-wider">Type / Reward</th>
                  <th className="p-4 text-xs font-bold text-[#8390a0] uppercase tracking-wider">Duration</th>
                  <th className="p-4 text-xs font-bold text-[#8390a0] uppercase tracking-wider">Limits</th>
                  <th className="p-4 text-xs font-bold text-[#8390a0] uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-bold text-[#8390a0] uppercase tracking-wider text-right">Actions</th>
               </tr>
            </thead>
            <tbody>
               {promotions.map(promo => (
                  <tr key={promo.id} className="border-b border-[#2b3342] hover:bg-[#202736] transition-colors">
                     <td className="p-4">
                        <div className="font-bold text-white text-sm">{promo.name}</div>
                        <div className="text-xs text-[#8390a0] truncate max-w-[200px]">{promo.description}</div>
                     </td>
                     <td className="p-4">
                        <div className="text-xs text-white bg-[#3b4353] inline-block px-2 py-0.5 rounded mb-1">{promo.type}</div>
                        <div className="text-sm text-[#0ba259] font-bold">
                           {promo.rewardType === 'PERCENTAGE' ? `${promo.rewardValue}% (Max $${promo.maxReward})` : `$${promo.rewardValue} Flat`}
                        </div>
                     </td>
                     <td className="p-4 text-xs text-[#8390a0]">
                        <div>{new Date(promo.startDate).toLocaleDateString()} to</div>
                        <div>{new Date(promo.endDate).toLocaleDateString()}</div>
                     </td>
                     <td className="p-4 text-xs text-[#8390a0]">
                        Min Dep: <span className="text-white">${promo.minAmount}</span><br/>
                        Usage: <span className="text-white">{claims.filter(c => c.promotionId === promo.id).length} / {promo.totalLimit}</span>
                     </td>
                     <td className="p-4">
                       <span className={`px-2 py-1 rounded text-xs font-bold ${promo.status === 'ACTIVE' ? 'bg-[#0ba259]/20 text-[#0ba259]' : promo.status === 'EXPIRED' ? 'bg-gray-500/20 text-gray-400' : 'bg-orange-500/20 text-orange-500'}`}>
                         {promo.status}
                       </span>
                     </td>
                     <td className="p-4 text-right flex justify-end gap-2">
                        <button onClick={() => handleEdit(promo)} className="w-8 h-8 rounded bg-[#2b3342] flex items-center justify-center text-white hover:bg-[#3b4353]">
                           <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(promo.id, promo.name)} className="w-8 h-8 rounded bg-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500/40">
                           <Trash2 size={14} />
                        </button>
                     </td>
                  </tr>
               ))}
               {promotions.length === 0 && (
                 <tr>
                   <td colSpan={6} className="p-8 text-center text-[#8390a0]">No promotions configured yet.</td>
                 </tr>
               )}
            </tbody>
         </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-10">
          <div className="bg-[#1a202c] border border-[#2b3342] rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl my-auto">
            <div className="p-4 border-b border-[#2b3342] flex justify-between items-center bg-[#151a23]">
               <h3 className="text-lg font-bold text-white">{editId ? 'Edit Promotion' : 'New Promotion'}</h3>
               <button onClick={() => setShowModal(false)} className="text-[#8390a0] hover:text-white">✕</button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
               <div className="grid grid-cols-2 gap-4">
                 <div className="col-span-2">
                    <label className="block text-xs font-bold text-[#8390a0] uppercase mb-1">Promotion Name</label>
                    <input type="text" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full bg-[#11151c] border border-[#2b3342] text-white px-3 py-2 rounded focus:outline-none focus:border-[#1e88e5]" />
                 </div>
                 <div className="col-span-2">
                    <label className="block text-xs font-bold text-[#8390a0] uppercase mb-1">Description</label>
                    <textarea value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full h-20 bg-[#11151c] border border-[#2b3342] text-white px-3 py-2 rounded focus:outline-none focus:border-[#1e88e5]" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-[#8390a0] uppercase mb-1">Type</label>
                    <select value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value})} className="w-full bg-[#11151c] border border-[#2b3342] text-white px-3 py-2 rounded focus:outline-none focus:border-[#1e88e5]">
                       <option value="DEPOSIT_BONUS">Deposit Bonus</option>
                       <option value="CASHBACK">Cashback</option>
                       <option value="FREE_SPIN">Free Spin / Draw</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-[#8390a0] uppercase mb-1">Banner URL (Optional)</label>
                    <input type="text" value={formData.bannerUrl} onChange={e=>setFormData({...formData, bannerUrl: e.target.value})} className="w-full bg-[#11151c] border border-[#2b3342] text-white px-3 py-2 rounded focus:outline-none focus:border-[#1e88e5]" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-[#8390a0] uppercase mb-1">Start Date</label>
                    <input type="date" value={formData.startDate} onChange={e=>setFormData({...formData, startDate: e.target.value})} className="w-full bg-[#11151c] border border-[#2b3342] text-white px-3 py-2 rounded focus:outline-none focus:border-[#1e88e5] color-scheme-dark" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-[#8390a0] uppercase mb-1">End Date</label>
                    <input type="date" value={formData.endDate} onChange={e=>setFormData({...formData, endDate: e.target.value})} className="w-full bg-[#11151c] border border-[#2b3342] text-white px-3 py-2 rounded focus:outline-none focus:border-[#1e88e5] color-scheme-dark" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-[#8390a0] uppercase mb-1">Min Qualifying Amount ($)</label>
                    <input type="number" value={formData.minAmount} onChange={e=>setFormData({...formData, minAmount: e.target.value})} className="w-full bg-[#11151c] border border-[#2b3342] text-white px-3 py-2 rounded focus:outline-none focus:border-[#1e88e5]" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-[#8390a0] uppercase mb-1">Reward Type</label>
                    <select value={formData.rewardType} onChange={e=>setFormData({...formData, rewardType: e.target.value})} className="w-full bg-[#11151c] border border-[#2b3342] text-white px-3 py-2 rounded focus:outline-none focus:border-[#1e88e5]">
                       <option value="PERCENTAGE">Percentage (%)</option>
                       <option value="FIXED">Fixed Amount ($)</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-[#8390a0] uppercase mb-1">Reward Value</label>
                    <input type="number" value={formData.rewardValue} onChange={e=>setFormData({...formData, rewardValue: e.target.value})} className="w-full bg-[#11151c] border border-[#2b3342] text-white px-3 py-2 rounded focus:outline-none focus:border-[#1e88e5]" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-[#8390a0] uppercase mb-1">Max Reward ($)</label>
                    <input type="number" value={formData.maxReward} onChange={e=>setFormData({...formData, maxReward: e.target.value})} className="w-full bg-[#11151c] border border-[#2b3342] text-white px-3 py-2 rounded focus:outline-none focus:border-[#1e88e5]" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-[#8390a0] uppercase mb-1">Per User Limit (Claims)</label>
                    <input type="number" value={formData.perUserLimit} onChange={e=>setFormData({...formData, perUserLimit: e.target.value})} className="w-full bg-[#11151c] border border-[#2b3342] text-white px-3 py-2 rounded focus:outline-none focus:border-[#1e88e5]" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-[#8390a0] uppercase mb-1">Total Campaign Limit</label>
                    <input type="number" value={formData.totalLimit} onChange={e=>setFormData({...formData, totalLimit: e.target.value})} className="w-full bg-[#11151c] border border-[#2b3342] text-white px-3 py-2 rounded focus:outline-none focus:border-[#1e88e5]" />
                 </div>
                 <div className="col-span-2">
                    <label className="block text-xs font-bold text-[#8390a0] uppercase mb-1">Status</label>
                    <select value={formData.status} onChange={e=>setFormData({...formData, status: e.target.value})} className="w-full bg-[#11151c] border border-[#2b3342] text-white px-3 py-2 rounded focus:outline-none focus:border-[#1e88e5]">
                       <option value="DRAFT">Draft</option>
                       <option value="ACTIVE">Active</option>
                       <option value="PAUSED">Paused</option>
                       <option value="EXPIRED">Expired</option>
                    </select>
                 </div>
               </div>
            </div>
            <div className="p-4 border-t border-[#2b3342] flex justify-end gap-3 bg-[#151a23]">
               <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded text-sm font-bold text-[#8390a0] hover:text-white">Cancel</button>
               <button onClick={handleSave} className="bg-[#1e88e5] hover:bg-[#1e88e5]/90 text-white px-4 py-2 rounded text-sm font-bold">Save Promotion</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
