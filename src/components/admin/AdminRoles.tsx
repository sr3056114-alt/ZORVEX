import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Shield, Plus, Edit2, Trash2 } from 'lucide-react';

export default function AdminRoles() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ email: '', role: 'Admin', uid: '' });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'adminUsers'), (snap) => {
      setAdmins(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.warn(err));
    return () => unsub();
  }, []);

  const handleAdd = async (e: any) => {
    e.preventDefault();
    if (!formData.uid || !formData.email) return alert('UID and Email are required.');
    try {
      await setDoc(doc(db, 'adminUsers', formData.uid), {
        email: formData.email,
        role: formData.role,
        createdAt: Date.now()
      });
      setShowAdd(false);
      setFormData({ email: '', role: 'Admin', uid: '' });
    } catch (err) {
      console.error(err);
      alert('Error adding admin');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove admin access?')) return;
    try {
      await deleteDoc(doc(db, 'adminUsers', id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Admins & Roles</h2>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-4 py-2 bg-[#3d72ff] hover:bg-[#2b5ae6] text-white rounded-lg font-bold">
          <Plus size={18} /> Add Admin
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-[#1a202c] p-6 rounded-xl border border-[#2b3342] space-y-4 max-w-xl">
          <div>
            <label className="block text-xs font-bold text-[#8390a0] mb-1">User UID</label>
            <input required value={formData.uid} onChange={e => setFormData({...formData, uid: e.target.value})} className="w-full bg-[#151a23] border border-[#2b3342] rounded-lg p-3 text-white outline-none focus:border-[#3d72ff]" placeholder="Firebase Auth UID" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#8390a0] mb-1">Email</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-[#151a23] border border-[#2b3342] rounded-lg p-3 text-white outline-none focus:border-[#3d72ff]" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#8390a0] mb-1">Role</label>
            <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-[#151a23] border border-[#2b3342] rounded-lg p-3 text-white outline-none focus:border-[#3d72ff]">
              <option>Super Admin</option>
              <option>Admin</option>
              <option>Finance Manager</option>
              <option>Support Agent</option>
              <option>Analyst</option>
            </select>
          </div>
          <button type="submit" className="w-full py-3 bg-[#3d72ff] hover:bg-[#2b5ae6] font-bold rounded-lg transition-colors">Grant Access</button>
        </form>
      )}

      <div className="bg-[#1a202c] rounded-xl border border-[#2b3342] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#2b3342] bg-[#151a23]">
              <th className="p-4 text-xs font-bold text-[#8390a0] uppercase">Email</th>
              <th className="p-4 text-xs font-bold text-[#8390a0] uppercase">Role</th>
              <th className="p-4 text-xs font-bold text-[#8390a0] uppercase">Granted On</th>
              <th className="p-4 text-xs font-bold text-[#8390a0] uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(a => (
              <tr key={a.id} className="border-b border-[#2b3342] hover:bg-[#202736]">
                <td className="p-4 text-sm font-medium flex items-center gap-2"><Shield size={16} className="text-[#3d72ff]"/> {a.email}</td>
                <td className="p-4"><span className="px-2 py-1 text-[10px] font-bold uppercase rounded-full bg-purple-500/10 text-purple-500">{a.role}</span></td>
                <td className="p-4 text-xs text-[#8390a0]">{a.createdAt ? new Date(a.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td className="p-4">
                  <button onClick={() => handleDelete(a.id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {admins.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-[#8390a0]">No admins configured.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
