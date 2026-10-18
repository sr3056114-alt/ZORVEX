import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, query, orderBy, limit, setDoc, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Wallet, ArrowDownRight, ArrowUpRight, CheckCircle, XCircle, Search, Edit3 } from 'lucide-react';

export default function AdminWallet() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'Transactions' | 'Adjustments'>('Transactions');
  const [adjustData, setAdjustData] = useState({ userId: '', amount: '', type: 'CREDIT', reason: '' });

  useEffect(() => {
    const unsubTx = onSnapshot(query(collection(db, 'transactions'), orderBy('timestamp', 'desc'), limit(100)), (snap) => {
      setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.warn(err));

    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.warn(err));

    return () => { unsubTx(); unsubUsers(); };
  }, []);

  const handleTransaction = async (id: string, action: 'approve' | 'reject', tx: any) => {
    try {
      if (action === 'approve') {
        const userRef = doc(db, 'users', tx.userId);
        const user = users.find(u => u.id === tx.userId);
        if (user) {
          const newBalance = tx.type === 'DEPOSIT' 
            ? (user.balance || 0) + Number(tx.amount)
            : (user.balance || 0) - Number(tx.amount);
          await updateDoc(userRef, { balance: newBalance });
        }
      }
      await updateDoc(doc(db, 'transactions', id), { 
        status: action === 'approve' ? 'COMPLETED' : 'REJECTED',
        updatedAt: Date.now()
      });
      
      // Audit log
      await addDoc(collection(db, 'auditLogs'), {
        adminId: localStorage.getItem('user_email') || 'Admin',
        action: `TRANSACTION_${action.toUpperCase()}`,
        details: `${tx.type} of ${tx.amount} for user ${tx.userId}`,
        timestamp: Date.now()
      });
    } catch (e) {
      console.error(e);
      alert('Error updating transaction');
    }
  };

  const handleAdjustment = async (e: any) => {
    e.preventDefault();
    try {
      const user = users.find(u => u.id === adjustData.userId || u.email === adjustData.userId);
      if (!user) return alert('User not found');
      
      const amount = Number(adjustData.amount);
      const newBalance = adjustData.type === 'CREDIT' 
        ? (user.balance || 0) + amount 
        : (user.balance || 0) - amount;

      await updateDoc(doc(db, 'users', user.id), { balance: newBalance, updatedAt: Date.now() });
      
      const txId = 'MANUAL_' + Date.now();
      await setDoc(doc(db, 'transactions', txId), {
        userId: user.id,
        email: user.email,
        type: adjustData.type,
        amount,
        status: 'COMPLETED',
        reason: adjustData.reason,
        timestamp: Date.now(),
        isManual: true
      });

      await addDoc(collection(db, 'auditLogs'), {
        adminId: localStorage.getItem('user_email') || 'Admin',
        action: 'MANUAL_WALLET_ADJUSTMENT',
        details: `${adjustData.type} of ${amount} to ${user.email}. Reason: ${adjustData.reason}`,
        timestamp: Date.now()
      });

      alert('Wallet adjusted successfully');
      setAdjustData({ userId: '', amount: '', type: 'CREDIT', reason: '' });
    } catch (e) {
      console.error(e);
      alert('Error adjusting wallet');
    }
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex gap-4 border-b border-[#2b3342] pb-4">
        <button onClick={() => setActiveTab('Transactions')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'Transactions' ? 'bg-[#3d72ff] text-white' : 'text-[#8390a0] hover:text-white'}`}>Transactions</button>
        <button onClick={() => setActiveTab('Adjustments')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'Adjustments' ? 'bg-[#3d72ff] text-white' : 'text-[#8390a0] hover:text-white'}`}>Manual Adjustments</button>
      </div>

      {activeTab === 'Transactions' && (
        <div className="bg-[#1a202c] rounded-xl border border-[#2b3342] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2b3342] bg-[#151a23]">
                <th className="p-4 text-xs font-bold text-[#8390a0] uppercase">Date</th>
                <th className="p-4 text-xs font-bold text-[#8390a0] uppercase">User</th>
                <th className="p-4 text-xs font-bold text-[#8390a0] uppercase">Type</th>
                <th className="p-4 text-xs font-bold text-[#8390a0] uppercase">Amount</th>
                <th className="p-4 text-xs font-bold text-[#8390a0] uppercase">Status</th>
                <th className="p-4 text-xs font-bold text-[#8390a0] uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id} className="border-b border-[#2b3342] hover:bg-[#202736]">
                  <td className="p-4 text-xs text-[#8390a0]">{new Date(tx.timestamp).toLocaleString()}</td>
                  <td className="p-4 text-sm font-medium">{tx.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${tx.type === 'DEPOSIT' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-mono">${tx.amount}</td>
                  <td className="p-4 text-xs font-bold">{tx.status}</td>
                  <td className="p-4">
                    {tx.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button onClick={() => handleTransaction(tx.id, 'approve', tx)} className="p-1.5 bg-green-500/20 text-green-500 rounded hover:bg-green-500/40"><CheckCircle size={16} /></button>
                        <button onClick={() => handleTransaction(tx.id, 'reject', tx)} className="p-1.5 bg-red-500/20 text-red-500 rounded hover:bg-red-500/40"><XCircle size={16} /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-[#8390a0]">No transactions found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'Adjustments' && (
        <form onSubmit={handleAdjustment} className="bg-[#1a202c] p-6 rounded-xl border border-[#2b3342] max-w-xl">
          <h3 className="text-lg font-bold mb-4">Manual Wallet Adjustment</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#8390a0] mb-1">User ID or Email</label>
              <input required value={adjustData.userId} onChange={e => setAdjustData({...adjustData, userId: e.target.value})} className="w-full bg-[#151a23] border border-[#2b3342] rounded-lg p-3 text-white focus:outline-none focus:border-[#3d72ff]" placeholder="user@example.com" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#8390a0] mb-1">Amount</label>
                <input required type="number" min="0.01" step="0.01" value={adjustData.amount} onChange={e => setAdjustData({...adjustData, amount: e.target.value})} className="w-full bg-[#151a23] border border-[#2b3342] rounded-lg p-3 text-white focus:outline-none focus:border-[#3d72ff]" placeholder="100.00" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8390a0] mb-1">Action Type</label>
                <select value={adjustData.type} onChange={e => setAdjustData({...adjustData, type: e.target.value})} className="w-full bg-[#151a23] border border-[#2b3342] rounded-lg p-3 text-white focus:outline-none focus:border-[#3d72ff]">
                  <option value="CREDIT">Credit (Add)</option>
                  <option value="DEBIT">Debit (Subtract)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#8390a0] mb-1">Reason (Mandatory for Audit)</label>
              <textarea required value={adjustData.reason} onChange={e => setAdjustData({...adjustData, reason: e.target.value})} className="w-full bg-[#151a23] border border-[#2b3342] rounded-lg p-3 text-white focus:outline-none focus:border-[#3d72ff]" placeholder="Reason for manual adjustment..."></textarea>
            </div>
            <button type="submit" className="w-full py-3 bg-[#3d72ff] hover:bg-[#2b5ae6] text-white font-bold rounded-lg transition-colors">
              Submit Adjustment
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
