import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, updateDoc, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import { Plus, Edit2, Users, DollarSign, Activity, Percent, Link as LinkIcon, Power, PowerOff } from 'lucide-react';

export default function AdminAffiliates() {
  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    commissionType: 'PERCENTAGE',
    commissionValue: '10',
    minQualifyingAmount: '100',
    status: 'ACTIVE'
  });

  useEffect(() => {
    const unsubAff = onSnapshot(collection(db, 'affiliates'), (snap) => {
      setAffiliates(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubComm = onSnapshot(query(collection(db, 'commissions'), orderBy('timestamp', 'desc'), limit(100)), (snap) => {
      setCommissions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => { unsubAff(); unsubComm(); };
  }, []);

  const handleSave = async () => {
    if (!formData.name || !formData.code) return alert("Name and Code are required.");
    try {
      const affiliateData = {
        ...formData,
        commissionValue: Number(formData.commissionValue),
        minQualifyingAmount: Number(formData.minQualifyingAmount),
        link: `${window.location.origin}/signup?ref=${formData.code}`,
        updatedAt: Date.now()
      };

      if (editId) {
        await updateDoc(doc(db, 'affiliates', editId), affiliateData);
        await logAudit(`Updated Affiliate: ${formData.name}`);
      } else {
        const newRef = doc(collection(db, 'affiliates'));
        await setDoc(newRef, { ...affiliateData, createdAt: Date.now() });
        await logAudit(`Created Affiliate: ${formData.name}`);
      }
      setShowModal(false);
      setEditId(null);
      setFormData({ name: '', code: '', commissionType: 'PERCENTAGE', commissionValue: '10', minQualifyingAmount: '100', status: 'ACTIVE' });
    } catch (err: any) {
      alert("Error saving: " + err.message);
    }
  };

  const handleEdit = (aff: any) => {
    setFormData({
      name: aff.name,
      code: aff.code,
      commissionType: aff.commissionType,
      commissionValue: String(aff.commissionValue),
      minQualifyingAmount: String(aff.minQualifyingAmount),
      status: aff.status
    });
    setEditId(aff.id);
    setShowModal(true);
  };

  const toggleStatus = async (aff: any) => {
    const newStatus = aff.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    if(confirm(`Are you sure you want to ${newStatus === 'DISABLED' ? 'disable' : 'enable'} this affiliate?`)) {
       await updateDoc(doc(db, 'affiliates', aff.id), { status: newStatus });
       await logAudit(`Changed Affiliate Status: ${aff.name} to ${newStatus}`);
    }
  };

  const logAudit = async (action: string) => {
    await setDoc(doc(collection(db, 'auditLogs')), {
      adminId: 'ADMIN',
      action,
      targetId: 'AFFILIATES',
      timestamp: Date.now()
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Affiliates Management</h2>
        <button onClick={() => { setEditId(null); setShowModal(true); }} className="bg-[#0ba259] hover:bg-[#0ba259]/90 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2">
          <Plus size={16} /> Add Affiliate
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#1a202c] border border-[#2b3342] rounded-xl p-6">
          <div className="text-[#8390a0] font-bold text-xs uppercase mb-2">Total Affiliates</div>
          <div className="text-2xl font-black text-white">{affiliates.length}</div>
        </div>
        <div className="bg-[#1a202c] border border-[#2b3342] rounded-xl p-6">
          <div className="text-[#8390a0] font-bold text-xs uppercase mb-2">Active Affiliates</div>
          <div className="text-2xl font-black text-[#0ba259]">{affiliates.filter(a => a.status === 'ACTIVE').length}</div>
        </div>
        <div className="bg-[#1a202c] border border-[#2b3342] rounded-xl p-6">
          <div className="text-[#8390a0] font-bold text-xs uppercase mb-2">Total Commissions Paid</div>
          <div className="text-2xl font-black text-[#1e88e5]">
             ${commissions.filter(c => c.status === 'PAID').reduce((acc, curr) => acc + (curr.amount || 0), 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-[#1a202c] border border-[#2b3342] rounded-xl p-6">
          <div className="text-[#8390a0] font-bold text-xs uppercase mb-2">Pending Commissions</div>
          <div className="text-2xl font-black text-orange-500">
             ${commissions.filter(c => c.status === 'PENDING').reduce((acc, curr) => acc + (curr.amount || 0), 0).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="bg-[#1a202c] border border-[#2b3342] rounded-xl overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="border-b border-[#2b3342] bg-[#151a23]">
                  <th className="p-4 text-xs font-bold text-[#8390a0] uppercase tracking-wider">Affiliate Name</th>
                  <th className="p-4 text-xs font-bold text-[#8390a0] uppercase tracking-wider">Ref Code / Link</th>
                  <th className="p-4 text-xs font-bold text-[#8390a0] uppercase tracking-wider">Commission Rule</th>
                  <th className="p-4 text-xs font-bold text-[#8390a0] uppercase tracking-wider">Min Qualify</th>
                  <th className="p-4 text-xs font-bold text-[#8390a0] uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-bold text-[#8390a0] uppercase tracking-wider text-right">Actions</th>
               </tr>
            </thead>
            <tbody>
               {affiliates.map(aff => (
                  <tr key={aff.id} className="border-b border-[#2b3342] hover:bg-[#202736] transition-colors">
                     <td className="p-4 text-sm text-white font-bold">{aff.name}</td>
                     <td className="p-4 text-xs text-[#1e88e5] font-mono flex items-center gap-2">
                       <span className="bg-[#1e88e5]/10 px-2 py-1 rounded border border-[#1e88e5]/20">{aff.code}</span>
                       <LinkIcon size={12} className="cursor-pointer" onClick={() => navigator.clipboard.writeText(aff.link)} />
                     </td>
                     <td className="p-4 text-sm text-[#8390a0]">
                        {aff.commissionType === 'PERCENTAGE' ? `${aff.commissionValue}%` : `$${aff.commissionValue}`}
                     </td>
                     <td className="p-4 text-sm text-white">${aff.minQualifyingAmount}</td>
                     <td className="p-4">
                       <span className={`px-2 py-1 rounded text-xs font-bold ${aff.status === 'ACTIVE' ? 'bg-[#0ba259]/20 text-[#0ba259]' : 'bg-red-500/20 text-red-500'}`}>
                         {aff.status}
                       </span>
                     </td>
                     <td className="p-4 text-right flex justify-end gap-2">
                        <button onClick={() => handleEdit(aff)} className="w-8 h-8 rounded bg-[#2b3342] flex items-center justify-center text-white hover:bg-[#3b4353]">
                           <Edit2 size={14} />
                        </button>
                        <button onClick={() => toggleStatus(aff)} className={`w-8 h-8 rounded flex items-center justify-center text-white ${aff.status === 'ACTIVE' ? 'bg-red-500/20 text-red-500 hover:bg-red-500/40' : 'bg-[#0ba259]/20 text-[#0ba259] hover:bg-[#0ba259]/40'}`}>
                           {aff.status === 'ACTIVE' ? <PowerOff size={14} /> : <Power size={14} />}
                        </button>
                     </td>
                  </tr>
               ))}
               {affiliates.length === 0 && (
                 <tr>
                   <td colSpan={6} className="p-8 text-center text-[#8390a0]">No affiliates configured yet.</td>
                 </tr>
               )}
            </tbody>
         </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1a202c] border border-[#2b3342] rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[#2b3342] flex justify-between items-center bg-[#151a23]">
               <h3 className="text-lg font-bold text-white">{editId ? 'Edit Affiliate' : 'New Affiliate'}</h3>
               <button onClick={() => setShowModal(false)} className="text-[#8390a0] hover:text-white">✕</button>
            </div>
            <div className="p-6 space-y-4">
               <div>
                  <label className="block text-xs font-bold text-[#8390a0] uppercase mb-1">Affiliate Name</label>
                  <input type="text" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full bg-[#11151c] border border-[#2b3342] text-white px-3 py-2 rounded focus:outline-none focus:border-[#1e88e5]" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-[#8390a0] uppercase mb-1">Referral Code (Unique)</label>
                  <input type="text" value={formData.code} onChange={e=>setFormData({...formData, code: e.target.value})} className="w-full bg-[#11151c] border border-[#2b3342] text-white px-3 py-2 rounded focus:outline-none focus:border-[#1e88e5]" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-[#8390a0] uppercase mb-1">Commission Type</label>
                    <select value={formData.commissionType} onChange={e=>setFormData({...formData, commissionType: e.target.value})} className="w-full bg-[#11151c] border border-[#2b3342] text-white px-3 py-2 rounded focus:outline-none focus:border-[#1e88e5]">
                       <option value="PERCENTAGE">Percentage (%)</option>
                       <option value="FIXED">Fixed Amount ($)</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-[#8390a0] uppercase mb-1">Commission Value</label>
                    <input type="number" value={formData.commissionValue} onChange={e=>setFormData({...formData, commissionValue: e.target.value})} className="w-full bg-[#11151c] border border-[#2b3342] text-white px-3 py-2 rounded focus:outline-none focus:border-[#1e88e5]" />
                 </div>
               </div>
               <div>
                  <label className="block text-xs font-bold text-[#8390a0] uppercase mb-1">Min. Qualifying Deposit ($)</label>
                  <input type="number" value={formData.minQualifyingAmount} onChange={e=>setFormData({...formData, minQualifyingAmount: e.target.value})} className="w-full bg-[#11151c] border border-[#2b3342] text-white px-3 py-2 rounded focus:outline-none focus:border-[#1e88e5]" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-[#8390a0] uppercase mb-1">Status</label>
                  <select value={formData.status} onChange={e=>setFormData({...formData, status: e.target.value})} className="w-full bg-[#11151c] border border-[#2b3342] text-white px-3 py-2 rounded focus:outline-none focus:border-[#1e88e5]">
                     <option value="ACTIVE">Active</option>
                     <option value="DISABLED">Disabled</option>
                  </select>
               </div>
            </div>
            <div className="p-4 border-t border-[#2b3342] flex justify-end gap-3 bg-[#151a23]">
               <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded text-sm font-bold text-[#8390a0] hover:text-white">Cancel</button>
               <button onClick={handleSave} className="bg-[#1e88e5] hover:bg-[#1e88e5]/90 text-white px-4 py-2 rounded text-sm font-bold">Save Affiliate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
