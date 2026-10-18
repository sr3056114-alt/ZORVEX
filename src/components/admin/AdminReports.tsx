import React, { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import { Download, Users, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminReports() {
  const [users, setUsers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.warn(err));

    const unsubTx = onSnapshot(query(collection(db, 'transactions'), orderBy('timestamp', 'desc'), limit(1000)), (snap) => {
      setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.warn(err));

    return () => { unsubUsers(); unsubTx(); };
  }, []);

  const stats = useMemo(() => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    const activeUsers = users.filter(u => u.status === 'ACTIVE').length;
    const newUsers = users.filter(u => now - (u.createdAt || 0) < oneDay).length;
    
    const completedTx = transactions.filter(tx => tx.status === 'COMPLETED');
    const totalDeposits = completedTx.filter(tx => tx.type === 'DEPOSIT').reduce((acc, tx) => acc + Number(tx.amount || 0), 0);
    const totalWithdrawals = completedTx.filter(tx => tx.type === 'WITHDRAWAL').reduce((acc, tx) => acc + Number(tx.amount || 0), 0);
    
    return { activeUsers, newUsers, totalDeposits, totalWithdrawals };
  }, [users, transactions]);

  const chartData = useMemo(() => {
    const dataMap: Record<string, any> = {};
    const today = new Date();
    // Initialize last 7 days
    for(let i=6; i>=0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      dataMap[d.toLocaleDateString()] = { date: d.toLocaleDateString(), deposits: 0, withdrawals: 0 };
    }

    transactions.forEach(tx => {
      if (tx.status !== 'COMPLETED') return;
      const dateStr = new Date(tx.timestamp).toLocaleDateString();
      if (dataMap[dateStr]) {
        if (tx.type === 'DEPOSIT') dataMap[dateStr].deposits += Number(tx.amount || 0);
        if (tx.type === 'WITHDRAWAL') dataMap[dateStr].withdrawals += Number(tx.amount || 0);
      }
    });
    
    return Object.values(dataMap);
  }, [transactions]);

  const exportCSV = () => {
    const headers = ['ID', 'Email', 'Type', 'Amount', 'Status', 'Date'];
    const rows = transactions.map(tx => [
      tx.id, tx.email || '', tx.type, tx.amount, tx.status, new Date(tx.timestamp).toLocaleString()
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `transaction_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-[#1a202c] p-6 rounded-xl border border-[#2b3342] flex items-center justify-between">
      <div>
        <p className="text-xs font-bold text-[#8390a0] uppercase mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-white">{value}</h4>
      </div>
      <div className={`p-4 rounded-full ${color}`}>
        <Icon size={24} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 text-white">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Analytics & Reports</h2>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-[#1a202c] border border-[#2b3342] hover:bg-[#202736] text-white rounded-lg font-bold transition-colors">
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Active Users" value={stats.activeUsers} icon={Users} color="bg-[#3d72ff]/10 text-[#3d72ff]" />
        <StatCard title="New Users (24h)" value={stats.newUsers} icon={Activity} color="bg-purple-500/10 text-purple-500" />
        <StatCard title="Total Deposits" value={`$${stats.totalDeposits.toFixed(2)}`} icon={TrendingUp} color="bg-green-500/10 text-green-500" />
        <StatCard title="Total Withdrawals" value={`$${stats.totalWithdrawals.toFixed(2)}`} icon={DollarSign} color="bg-red-500/10 text-red-500" />
      </div>

      <div className="bg-[#1a202c] rounded-xl border border-[#2b3342] p-6">
        <h3 className="text-lg font-bold mb-6">Financial Volume (Last 7 Days)</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2b3342" />
              <XAxis dataKey="date" stroke="#8390a0" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#8390a0" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a202c', borderColor: '#2b3342', color: '#fff', borderRadius: '8px' }}
                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
              />
              <Line type="monotone" dataKey="deposits" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Deposits" />
              <Line type="monotone" dataKey="withdrawals" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Withdrawals" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
