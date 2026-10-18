import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { Bell, Plus, Trash2, Send } from 'lucide-react';

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
    const [formData, setFormData] = useState({ title: '', message: '', type: 'System', target: 'All Users', imageUrl: '' });
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const storageRef = ref(storage, `notifications/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFormData({...formData, imageUrl: url});
    } catch(err) {
      console.error(err);
      alert('Error uploading image');
    }
    setUploadingImage(false);
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'notifications'), (snap) => {
      setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => b.timestamp - a.timestamp));
    }, (err) => console.warn(err));
    return () => unsub();
  }, []);

  const handleSend = async (e: any) => {
    e.preventDefault();
    try {
      const newId = `NOTIF_${Date.now()}`;
      await setDoc(doc(db, 'notifications', newId), {
        ...formData,
        timestamp: Date.now(),
        read: false
      });
      setShowAdd(false);
      setFormData({ title: '', message: '', type: 'System', target: 'All Users', imageUrl: '' });
    } catch (e) {
      console.error(e);
      alert('Error sending notification');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notifications', id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Notification Management</h2>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-4 py-2 bg-[#3d72ff] hover:bg-[#2b5ae6] text-white rounded-lg font-bold">
          <Plus size={18} /> New Notification
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSend} className="bg-[#1a202c] p-6 rounded-xl border border-[#2b3342] space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#8390a0] mb-1">Title</label>
              <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#151a23] border border-[#2b3342] rounded-lg p-3 text-white focus:border-[#3d72ff] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#8390a0] mb-1">Type</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-[#151a23] border border-[#2b3342] rounded-lg p-3 text-white outline-none">
                <option>System</option><option>Wallet</option><option>Security</option><option>Promotion</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#8390a0] mb-1">Target Audience</label>
            <select value={formData.target} onChange={e => setFormData({...formData, target: e.target.value})} className="w-full bg-[#151a23] border border-[#2b3342] rounded-lg p-3 text-white outline-none">
              <option>All Users</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#8390a0] mb-1">Message</label>
            <textarea required rows={3} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-[#151a23] border border-[#2b3342] rounded-lg p-3 text-white focus:border-[#3d72ff] outline-none" />
          </div>
          <button type="submit" className="flex items-center justify-center gap-2 w-full py-3 bg-[#3d72ff] hover:bg-[#2b5ae6] font-bold rounded-lg transition-colors">
            <Send size={18} /> Send Notification
          </button>
        </form>
      )}

      <div className="bg-[#1a202c] rounded-xl border border-[#2b3342] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#2b3342] bg-[#151a23]">
              <th className="p-4 text-xs font-bold text-[#8390a0] uppercase">Date</th>
              <th className="p-4 text-xs font-bold text-[#8390a0] uppercase">Title</th>
              <th className="p-4 text-xs font-bold text-[#8390a0] uppercase">Type</th>
              <th className="p-4 text-xs font-bold text-[#8390a0] uppercase">Target</th>
              <th className="p-4 text-xs font-bold text-[#8390a0] uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map(n => (
              <tr key={n.id} className="border-b border-[#2b3342] hover:bg-[#202736]">
                <td className="p-4 text-xs text-[#8390a0]">{new Date(n.timestamp).toLocaleString()}</td>
                <td className="p-4 text-sm font-medium">{n.title}</td>
                <td className="p-4"><span className="px-2 py-1 text-[10px] font-bold uppercase rounded-full bg-[#3d72ff]/10 text-[#3d72ff]">{n.type}</span></td>
                <td className="p-4 text-sm text-[#8390a0]">{n.target}</td>
                <td className="p-4">
                  <button onClick={() => handleDelete(n.id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {notifications.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-[#8390a0]">No notifications sent.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
