import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, query, orderBy, where, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Download, Search, CheckCircle, XCircle, AlertCircle, Eye, X } from 'lucide-react';

export default function AdminDeposits() {
  const [deposits, setDeposits] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'transactions'), where('type', '==', 'DEPOSIT'), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setDeposits(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.warn(err));
    return () => unsub();
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject', currentStatus: string, userId: string, amount: number) => {
    if (currentStatus !== 'PENDING') return alert('Transaction is already processed.');
    
    let reason = '';
    if (action === 'reject') {
      const input = prompt('Please enter rejection reason:');
      if (input === null || input.trim() === '') return alert('Rejection reason is mandatory.');
      reason = input;
    } else {
      if (!confirm(`Are you sure you want to approve this deposit of $${amount}?`)) return;
    }

    try {
      if (action === 'approve') {
        const { getDoc } = await import('firebase/firestore');
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const currentBalance = userSnap.data().balance || 0;
          await updateDoc(userRef, { balance: currentBalance + Number(amount) });
        }
      }

      await updateDoc(doc(db, 'transactions', id), {
        status: action === 'approve' ? 'COMPLETED' : 'REJECTED',
        rejectionReason: reason || null,
        updatedAt: Date.now(),
        processedBy: localStorage.getItem('user_email') || 'Admin'
      });

      await addDoc(collection(db, 'auditLogs'), {
        adminId: localStorage.getItem('user_email') || 'Admin',
        action: `DEPOSIT_${action.toUpperCase()}`,
        details: `${action === 'approve' ? 'Approved' : 'Rejected'} deposit ${id} for $${amount}. ${reason ? 'Reason: ' + reason : ''}`,
        timestamp: Date.now()
      });

    } catch (err) {
      console.error(err);
      alert('Error processing deposit.');
    }
  };

  const filtered = deposits.filter(d => {
    const matchSearch = (d.email || '').toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 text-white">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Deposit Management</h2>
        <div className="flex gap-4">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-[#1a202c] border border-[#2b3342] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#3d72ff]">
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8390a0]" size={16} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ID or Email..." className="bg-[#1a202c] border border-[#2b3342] text-white text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#3d72ff] w-64" />
          </div>
        </div>
      </div>

      <div className="bg-[#1a202c] rounded-xl border border-[#2b3342] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#2b3342] bg-[#151a23]">
              <th className="p-4 text-xs font-bold text-[#8390a0] uppercase">Txn ID / Date</th>
              <th className="p-4 text-xs font-bold text-[#8390a0] uppercase">User</th>
              <th className="p-4 text-xs font-bold text-[#8390a0] uppercase">Method / UTR</th>
              <th className="p-4 text-xs font-bold text-[#8390a0] uppercase">Amount</th>
              <th className="p-4 text-xs font-bold text-[#8390a0] uppercase">Proof</th>
              <th className="p-4 text-xs font-bold text-[#8390a0] uppercase">Status</th>
              <th className="p-4 text-xs font-bold text-[#8390a0] uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(tx => (
              <tr key={tx.id} className="border-b border-[#2b3342] hover:bg-[#202736]">
                <td className="p-4">
                  <div className="text-xs font-mono text-white">{tx.id}</div>
                  <div className="text-xs text-[#8390a0]">{new Date(tx.timestamp).toLocaleString()}</div>
                </td>
                <td className="p-4 text-sm font-medium">{tx.email}</td>
                <td className="p-4">
                  <div className="text-sm font-bold text-white">{tx.method || 'Manual'}</div>
                  <div className="text-xs text-[#8390a0] font-mono">{tx.utr || 'N/A'}</div>
                </td>
                <td className="p-4 text-sm font-bold text-[#3d72ff]">${Number(tx.amount).toFixed(2)}</td>
                <td className="p-4">
                  {tx.screenshot ? (
                    <button onClick={() => setSelectedImage(tx.screenshot)} className="flex items-center gap-1 text-xs bg-[#2b3342] px-2 py-1 rounded hover:text-white">
                      <Eye size={12}/> View
                    </button>
                  ) : <span className="text-xs text-[#8390a0]">None</span>}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${tx.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' : tx.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                    {tx.status}
                  </span>
                </td>
                <td className="p-4">
                  {tx.status === 'PENDING' ? (
                    <div className="flex gap-2">
                      <button onClick={() => handleAction(tx.id, 'approve', tx.status, tx.userId, tx.amount)} className="p-1.5 bg-green-500/20 text-green-500 rounded hover:bg-green-500/40" title="Approve"><CheckCircle size={16} /></button>
                      <button onClick={() => handleAction(tx.id, 'reject', tx.status, tx.userId, tx.amount)} className="p-1.5 bg-red-500/20 text-red-500 rounded hover:bg-red-500/40" title="Reject"><XCircle size={16} /></button>
                    </div>
                  ) : (
                    <span className="text-xs text-[#8390a0]">Processed</span>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-[#8390a0]">No deposits found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-3xl w-full">
            <button onClick={() => setSelectedImage(null)} className="absolute -top-10 right-0 text-white hover:text-red-500">
              <X size={32} />
            </button>
            <img src={selectedImage} alt="Proof" className="w-full h-auto rounded border border-[#2b3342]" />
          </div>
        </div>
      )}
    </div>
  );
}
