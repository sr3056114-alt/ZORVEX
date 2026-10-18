import { collection, onSnapshot, doc, updateDoc, query, orderBy, limit, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../src/firebase';
import { useBalance } from '../App';
import React, { useState, useEffect } from 'react';
import { Trophy, 
  Users, Activity, DollarSign, ShieldAlert, FileText, 
  Settings, Server, PieChart, Wallet, CreditCard, 
  ArrowRightLeft, Briefcase, Zap, Bell, CheckCircle,
  XCircle, Clock, Search, Menu, X, Filter, Lock, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

import AdminAffiliates from '../src/components/admin/AdminAffiliates';
import AdminPromotions from '../src/components/admin/AdminPromotions';
import AdminSupport from '../src/components/admin/AdminSupport';
import AdminReports from '../src/components/admin/AdminReports';
import AdminFraudSecurity from '../src/components/admin/AdminFraudSecurity';
import AdminRiskManagement from '../src/components/admin/AdminRiskManagement';
import AdminMarketData from '../src/components/admin/AdminMarketData';

import AdminWallet from '../src/components/admin/AdminWallet';
import AdminInstruments from '../src/components/admin/AdminInstruments';
import AdminNotifications from '../src/components/admin/AdminNotifications';
import AdminTournaments from '../src/components/admin/AdminTournaments';
import AdminRoles from '../src/components/admin/AdminRoles';
import AdminSystemHealth from '../src/components/admin/AdminSystemHealth';
import AdminSettings from '../src/components/admin/AdminSettings';

import AdminDeposits from '../src/components/admin/AdminDeposits';
import AdminWithdrawals from '../src/components/admin/AdminWithdrawals';
import AdminPayments from '../src/components/admin/AdminPayments';



const socket = io('/', { transports: ['websocket'] });
const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
      active 
        ? 'bg-[#1e88e5]/10 text-[#1e88e5] border-r-2 border-[#1e88e5]' 
        : 'text-[#8390a0] hover:bg-[#1a202c] hover:text-white'
    }`}
  >
    <Icon size={18} />
    <span className="font-medium text-sm">{label}</span>
  </div>
);

const StatCard = ({ title, value, sub, icon: Icon, color }: any) => (
  <div className="bg-[#1a202c] border border-[#2b3342] rounded-xl p-5 flex items-start justify-between">
    <div>
      <div className="text-[#8390a0] text-xs font-bold uppercase tracking-wider mb-2">{title}</div>
      <div className="text-2xl font-black text-white">{value}</div>
      {sub && <div className={`text-xs mt-2 ${sub.startsWith('+') ? 'text-[#0ba259]' : 'text-[#e33f4a]'}`}>{sub}</div>}
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={20} className="text-white" />
    </div>
  </div>
);

// TAB: Dashboard
const AdminDashboard = ({ stats }: { stats: any }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold text-white">Platform Overview</h2>
      <div className="flex gap-2">
        <span className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-[#0ba259]/10 text-[#0ba259] border border-[#0ba259]/20">
          <span className="w-2 h-2 rounded-full bg-[#0ba259] animate-pulse"></span>
          SYSTEM HEALTHY
        </span>
        <span className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-[#1e88e5]/10 text-[#1e88e5] border border-[#1e88e5]/20">
          <span className="w-2 h-2 rounded-full bg-[#1e88e5] animate-pulse"></span>
          LIVE WS CONNECTED
        </span>
      </div>
    </div>
    
    {stats ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={stats.totalUsers} sub="+12 today" icon={Users} color="bg-blue-500/80" />
        <StatCard title="Total Deposits" value={`$${stats.totalDeposits.toLocaleString()}`} sub="Real-time" icon={DollarSign} color="bg-green-500/80" />
        <StatCard title="Total Withdrawals" value={`$${stats.totalWithdrawals.toLocaleString()}`} sub="Real-time" icon={ArrowRightLeft} color="bg-red-500/80" />
        <StatCard title="Active Trades" value={stats.openTrades} sub="Live" icon={Activity} color="bg-purple-500/80" />
      </div>
    ) : (
      <div className="animate-pulse flex space-x-4">
        <div className="flex-1 h-32 bg-[#1a202c] rounded-xl border border-[#2b3342]"></div>
        <div className="flex-1 h-32 bg-[#1a202c] rounded-xl border border-[#2b3342]"></div>
        <div className="flex-1 h-32 bg-[#1a202c] rounded-xl border border-[#2b3342]"></div>
        <div className="flex-1 h-32 bg-[#1a202c] rounded-xl border border-[#2b3342]"></div>
      </div>
    )}

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-[#1a202c] border border-[#2b3342] rounded-xl p-5">
         <h3 className="text-sm font-bold text-white mb-4">Trading Volume (24h)</h3>
         <div className="h-64 flex items-end gap-2">
           {[40,70,45,90,65,85,120,95,60,80,110,75].map((h, i) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-[#1e88e5]/10 to-[#1e88e5] rounded-t-sm" style={{ height: `${(h/120)*100}%`}}></div>
           ))}
         </div>
      </div>
      <div className="bg-[#1a202c] border border-[#2b3342] rounded-xl p-5">
         <h3 className="text-sm font-bold text-white mb-4">System Alerts</h3>
         <div className="space-y-4">
            <div className="flex items-start gap-3">
               <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle size={14} className="text-green-500" />
               </div>
               <div>
                  <div className="text-sm text-white font-medium">Database Synced</div>
                  <div className="text-[10px] text-[#8390a0] mt-1">2 mins ago</div>
               </div>
            </div>
            <div className="flex items-start gap-3">
               <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                  <Activity size={14} className="text-blue-500" />
               </div>
               <div>
                  <div className="text-sm text-white font-medium">WS Connections Normal</div>
                  <div className="text-[10px] text-[#8390a0] mt-1">5 mins ago</div>
               </div>
            </div>
         </div>
      </div>
    </div>
  </div>
);

// TAB: Users
const AdminUsers = ({ users, toggleUserStatus, handleEditBalance }: { users: any[], toggleUserStatus: any, handleEditBalance: any }) => {
  const [editingBalanceId, setEditingBalanceId] = React.useState<string | null>(null);
  const [editBalanceVal, setEditBalanceVal] = React.useState('');

  return (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold text-white">User Management</h2>
      <div className="flex gap-3">
         <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8390a0]" size={16} />
            <input type="text" placeholder="Search users..." className="bg-[#1a202c] border border-[#2b3342] text-white text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#1e88e5] w-64" />
         </div>
      </div>
    </div>
    <div className="bg-[#1a202c] border border-[#2b3342] rounded-xl overflow-hidden">
       <table className="w-full text-left border-collapse">
          <thead>
             <tr className="border-b border-[#2b3342] bg-[#151a23]">
                <th className="p-4 text-xs font-bold text-[#8390a0] uppercase tracking-wider">User / UID</th>
                <th className="p-4 text-xs font-bold text-[#8390a0] uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-[#8390a0] uppercase tracking-wider">Balance</th>
                <th className="p-4 text-xs font-bold text-[#8390a0] uppercase tracking-wider">Joined</th>
                <th className="p-4 text-xs font-bold text-[#8390a0] uppercase tracking-wider text-right">Actions</th>
             </tr>
          </thead>
          <tbody>
             {users.map(u => (
                <tr key={u.id} className="border-b border-[#2b3342] hover:bg-[#202736] transition-colors">
                   <td className="p-4">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1e88e5] to-purple-500 flex items-center justify-center font-bold text-white shadow-lg">
                            {(u.email || u.displayName || '?').substring(0,2).toUpperCase()}
                         </div>
                         <div>
                            <div className="text-sm font-bold text-white">{u.email || u.displayName || 'Unknown'}</div>
                            <div className="text-xs text-[#8390a0] font-mono">{u.id}</div>
                         </div>
                      </div>
                   </td>
                   <td className="p-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${u.status === 'ACTIVE' ? 'bg-[#0ba259]/10 text-[#0ba259] border border-[#0ba259]/20' : 'bg-[#e33f4a]/10 text-[#e33f4a] border border-[#e33f4a]/20'}`}>
                         {u.status || 'ACTIVE'}
                      </span>
                   </td>
                   <td className="p-4 text-sm font-bold text-white">
                      {editingBalanceId === u.id ? (
                         <div className="flex items-center gap-2">
                           <input 
                             type="number" 
                             value={editBalanceVal}
                             onChange={e => setEditBalanceVal(e.target.value)}
                             className="w-20 bg-[#11151c] border border-[#2b3342] text-white px-2 py-1 rounded text-xs focus:outline-none focus:border-[#1e88e5]"
                           />
                           <button onClick={() => { handleEditBalance(u.id, parseFloat(editBalanceVal)); setEditingBalanceId(null); }} className="text-green-500 hover:text-green-400 font-bold text-xs">Save</button>
                           <button onClick={() => setEditingBalanceId(null)} className="text-red-500 hover:text-red-400 font-bold text-xs">Cancel</button>
                         </div>
                      ) : (
                         <div className="flex items-center gap-2">
                            ${u.balance?.toFixed(2) || '0.00'}
                            <button onClick={() => { setEditingBalanceId(u.id); setEditBalanceVal(u.balance?.toString() || '0'); }} className="text-[#8390a0] hover:text-[#1e88e5] text-[10px] uppercase font-bold">Edit</button>
                         </div>
                      )}
                   </td>
                   <td className="p-4 text-sm text-[#8390a0]">{new Date(u.createdAt || Date.now()).toLocaleDateString()}</td>
                   <td className="p-4 text-right">
                      <button onClick={() => toggleUserStatus(u.id, u.status)} className={`text-sm font-bold transition-colors ${u.status === 'ACTIVE' ? 'text-red-500 hover:text-red-400' : 'text-[#0ba259] hover:text-[#098b4c]'}`}>
                         {u.status === 'ACTIVE' ? 'Suspend / Block' : 'Activate'}
                      </button>
                   </td>
                </tr>
             ))}
             {users.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-[#8390a0]">No users found</td></tr>
             )}
          </tbody>
       </table>
    </div>
  </div>
);
}
// TAB: KYC
const AdminKyc = ({ kyc, handleKyc }: { kyc: any[], handleKyc: any }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold text-white">KYC & Verification</h2>
    </div>
    <div className="bg-[#1a202c] border border-[#2b3342] rounded-xl overflow-hidden">
       <table className="w-full text-left border-collapse">
          <thead>
             <tr className="border-b border-[#2b3342] bg-[#151a23]">
                <th className="p-4 text-xs font-bold text-[#8390a0] uppercase tracking-wider">User</th>
                <th className="p-4 text-xs font-bold text-[#8390a0] uppercase tracking-wider">Document Photos</th>
                <th className="p-4 text-xs font-bold text-[#8390a0] uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-[#8390a0] uppercase tracking-wider">Submitted</th>
                <th className="p-4 text-xs font-bold text-[#8390a0] uppercase tracking-wider text-right">Actions</th>
             </tr>
          </thead>
          <tbody>
             {kyc.map(k => (
                <tr key={k.id} className="border-b border-[#2b3342] hover:bg-[#202736] transition-colors">
                   <td className="p-4">
                     <div className="text-sm text-white font-medium">{k.email || k.userId}</div>
                   </td>
                   <td className="p-4 flex gap-2">
                     {k.frontImage && <a href={k.frontImage} target="_blank" rel="noreferrer"><img src={k.frontImage} className="w-16 h-10 object-cover rounded border border-[#2b3342] hover:scale-150 transition-transform cursor-pointer" alt="Front" /></a>}
                     {k.backImage && <a href={k.backImage} target="_blank" rel="noreferrer"><img src={k.backImage} className="w-16 h-10 object-cover rounded border border-[#2b3342] hover:scale-150 transition-transform cursor-pointer" alt="Back" /></a>}
                     {(!k.frontImage && !k.backImage) && <span className="text-xs text-[#8390a0]">No images</span>}
                   </td>
                   <td className="p-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${
                         k.status === 'APPROVED' ? 'bg-[#0ba259]/10 text-[#0ba259] border border-[#0ba259]/20' : 
                         k.status === 'REJECTED' ? 'bg-[#e33f4a]/10 text-[#e33f4a] border border-[#e33f4a]/20' :
                         'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                      }`}>
                         {k.status}
                      </span>
                   </td>
                   <td className="p-4 text-sm text-[#8390a0]">{new Date(k.timestamp).toLocaleString()}</td>
                   <td className="p-4 text-right flex gap-3 justify-end items-center h-full pt-6">
                      {k.status === 'PENDING' && (
                         <>
                           <button onClick={() => handleKyc(k.id, k.userId, 'APPROVED')} className="text-green-500 hover:text-green-400 text-sm font-bold transition-colors">Approve</button>
                           <button onClick={() => handleKyc(k.id, k.userId, 'REJECTED')} className="text-red-500 hover:text-red-400 text-sm font-bold transition-colors">Reject</button>
                         </>
                      )}
                   </td>
                </tr>
             ))}
             {kyc.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-[#8390a0]">No KYC applications</td></tr>
             )}
          </tbody>
       </table>
    </div>
  </div>
);

// TAB: Transactions
const AdminTransactions = ({ transactions, type, handleTransaction }: { transactions: any[], type: string, handleTransaction: any }) => {
  const filtered = transactions.filter(t => t.type === type);
  return (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold text-white capitalize">{type}s Management</h2>
    </div>
    <div className="bg-[#1a202c] border border-[#2b3342] rounded-xl overflow-hidden">
       <table className="w-full text-left border-collapse">
          <thead>
             <tr className="border-b border-[#2b3342] bg-[#151a23]">
                <th className="p-4 text-xs font-bold text-[#8390a0] uppercase tracking-wider">Date / ID</th>
                <th className="p-4 text-xs font-bold text-[#8390a0] uppercase tracking-wider">User</th>
                <th className="p-4 text-xs font-bold text-[#8390a0] uppercase tracking-wider">Amount</th>
                <th className="p-4 text-xs font-bold text-[#8390a0] uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-[#8390a0] uppercase tracking-wider text-right">Actions</th>
             </tr>
          </thead>
          <tbody>
             {filtered.map(t => (
                <tr key={t.id} className="border-b border-[#2b3342] hover:bg-[#202736] transition-colors">
                   <td className="p-4">
                     <div className="text-[10px] text-[#8390a0]">{new Date(t.timestamp).toLocaleString()}</div>
                     <div className="text-xs text-white font-mono">{t.id}</div>
                   </td>
                   <td className="p-4 text-sm text-white font-medium">{t.email || t.userId}</td>
                   <td className="p-4 text-sm font-bold text-white">${(t.amount || 0).toFixed(2)}</td>
                   <td className="p-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${
                         t.status === 'APPROVED' ? 'bg-[#0ba259]/10 text-[#0ba259] border border-[#0ba259]/20' : 
                         t.status === 'REJECTED' ? 'bg-[#e33f4a]/10 text-[#e33f4a] border border-[#e33f4a]/20' :
                         'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                      }`}>
                         {t.status}
                      </span>
                   </td>
                   <td className="p-4 text-right flex gap-3 justify-end items-center h-full pt-6">
                      {t.status === 'PENDING' && (
                         <>
                           <button onClick={() => handleTransaction(t.id, t.userId, t.type, t.amount, 'APPROVED')} className="text-green-500 hover:text-green-400 text-sm font-bold transition-colors">Approve</button>
                           <button onClick={() => handleTransaction(t.id, t.userId, t.type, t.amount, 'REJECTED')} className="text-red-500 hover:text-red-400 text-sm font-bold transition-colors">Reject</button>
                         </>
                      )}
                   </td>
                </tr>
             ))}
             {filtered.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-[#8390a0]">No {type}s found</td></tr>
             )}
          </tbody>
       </table>
    </div>
  </div>
)};

// TAB: Audit Logs
const AdminLogs = ({ logs }: { logs: any[] }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold text-white">System Audit Logs</h2>
    </div>
    <div className="bg-[#1a202c] border border-[#2b3342] rounded-xl overflow-hidden">
       <table className="w-full text-left border-collapse">
          <thead>
             <tr className="border-b border-[#2b3342] bg-[#151a23]">
                <th className="p-4 text-xs font-bold text-[#8390a0] uppercase tracking-wider">Timestamp</th>
                <th className="p-4 text-xs font-bold text-[#8390a0] uppercase tracking-wider">Admin</th>
                <th className="p-4 text-xs font-bold text-[#8390a0] uppercase tracking-wider">Action</th>
                <th className="p-4 text-xs font-bold text-[#8390a0] uppercase tracking-wider">Details</th>
             </tr>
          </thead>
          <tbody>
             {logs.map(l => (
                <tr key={l.id} className="border-b border-[#2b3342] hover:bg-[#202736] transition-colors">
                   <td className="p-4 text-xs text-[#8390a0] font-mono">{new Date(l.timestamp).toLocaleString()}</td>
                   <td className="p-4 text-sm text-white font-medium">{l.adminId || 'System'}</td>
                   <td className="p-4">
                      <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20">{l.action}</span>
                   </td>
                   <td className="p-4 text-xs text-[#8390a0]">{l.details}</td>
                </tr>
             ))}
             {logs.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-[#8390a0]">No logs found</td></tr>
             )}
          </tbody>
       </table>
    </div>
  </div>
);







export default function AdminPanel() {
  const { usdRate, setUsdRate, showDocumentVerification, setShowDocumentVerification } = useBalance();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [kyc, setKyc] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [trades, setTrades] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  
  
  const [stats, setStats] = useState<any>({
    totalUsers: 0,
    activeUsers: 0,
    pendingVerifications: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    openTrades: 0
  });

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setStats(prev => ({ ...prev, totalUsers: snap.docs.length, activeUsers: snap.docs.filter(d => d.data().status === 'ACTIVE').length }));
    });
    
    const unsubKyc = onSnapshot(collection(db, 'kyc'), (snap) => {
      setKyc(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setStats(prev => ({ ...prev, pendingVerifications: snap.docs.filter(d => d.data().status === 'PENDING').length }));
    });

    const unsubTransactions = onSnapshot(query(collection(db, 'transactions'), orderBy('timestamp', 'desc'), limit(100)), (snap) => {
      setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      let deposits = 0;
      let withdrawals = 0;
      snap.docs.forEach(d => {
        const data = d.data();
        if (data.type === 'DEPOSIT') deposits += (data.amount || 0);
        if (data.type === 'WITHDRAWAL') withdrawals += (data.amount || 0);
      });
      setStats(prev => ({ ...prev, totalDeposits: deposits, totalWithdrawals: withdrawals }));
    });

    const unsubTrades = onSnapshot(query(collection(db, 'liveTrades'), orderBy('entryTime', 'desc'), limit(100)), (snap) => {
      setTrades(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setStats(prev => ({ ...prev, openTrades: snap.docs.filter(d => d.data().status === 'OPEN' || !d.data().status).length }));
    });

    const unsubLogs = onSnapshot(query(collection(db, 'auditLogs'), orderBy('timestamp', 'desc'), limit(50)), (snap) => {
      setLogs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubUsers();
      unsubKyc();
      unsubTransactions();
      unsubTrades();
      unsubLogs();
    };
  }, []);


  

  

  




  
  const handleEditBalance = async (id: string, newBalance: number) => {
    try {
      await updateDoc(doc(db, 'users', id), { balance: newBalance });
      alert('Balance updated successfully');
    } catch (e) {
      console.error('Error updating balance', e);
      alert('Failed to update balance');
    }
  };

  const toggleUserStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
      await updateDoc(doc(db, 'users', id), { status: newStatus });
    } catch (e) {
      console.error('Error toggling status', e);
    }
  };

  const handleKyc = async (id: string, userId: string, status: string) => {
    if(!confirm(`Are you sure you want to ${status} this KYC?`)) return;
    try {
      await updateDoc(doc(db, 'kyc', id), { status });
      if (status === 'APPROVED') {
        await updateDoc(doc(db, 'users', userId), { kycStatus: 'VERIFIED' });
      }
    } catch (e) {
      console.error('Error updating kyc', e);
    }
  };

  const handleTransaction = async (id: string, userId: string, type: string, amount: number, status: string) => {
    if(!confirm(`Are you sure you want to ${status} this transaction?`)) return;
    try {
      await updateDoc(doc(db, 'transactions', id), { status });
      if (status === 'APPROVED' && type === 'DEPOSIT') {
         // Add balance to user
         const userRef = doc(db, 'users', userId);
         const userSnap = await getDoc(userRef);
         if (userSnap.exists()) {
           const currentBalance = userSnap.data().balance || 0;
           await updateDoc(userRef, { balance: currentBalance + amount });
         }
      }
      if (status === 'REJECTED' && type === 'WITHDRAWAL') {
         // Refund balance to user (since it was deducted instantly on request)
         const userRef = doc(db, 'users', userId);
         const userSnap = await getDoc(userRef);
         if (userSnap.exists()) {
           const currentBalance = userSnap.data().balance || 0;
           await updateDoc(userRef, { balance: currentBalance + amount });
         }
      }
    } catch (e) {
      console.error('Error updating transaction', e);
    }
  };


  const menu = [
    { label: 'Dashboard', icon: PieChart },
    { label: 'Users', icon: Users },
    { label: 'KYC & Verification', icon: ShieldAlert },
    { label: 'Wallet', icon: Wallet },
    { label: 'Deposits', icon: ArrowRightLeft },
    { label: 'Withdrawals', icon: CreditCard },
    { label: 'Payments', icon: CreditCard },
    { label: 'Trading Engine', icon: Activity },
    { label: 'Instruments', icon: Briefcase },
    { label: 'Risk Management', icon: Zap },
    { label: 'Fraud & Security', icon: ShieldAlert },
    { label: 'Affiliates', icon: Users },
    { label: 'Tournaments', icon: Trophy },
    { label: 'Promotions', icon: DollarSign },
    { label: 'Support', icon: CheckCircle },
    { label: 'Reports', icon: FileText },
    { label: 'Notifications', icon: Bell },
    { label: 'Audit Logs', icon: FileText },
    { label: 'Admins & Roles', icon: Users },
    { label: 'System Health', icon: Server },
    { label: 'Settings', icon: Settings },
  ];

  const renderComingSoon = () => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
       <div className="w-20 h-20 rounded-full bg-[#1a202c] border border-[#2b3342] flex items-center justify-center mb-6 shadow-2xl">
          <Settings size={32} className="text-[#8390a0] animate-spin-slow" />
       </div>
       <h2 className="text-2xl font-black text-white mb-2">{activeTab} Module</h2>
       <p className="text-[#8390a0] max-w-md">This enterprise module is fully integrated with the backend but the UI is currently being assembled for production deployment.</p>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#0b0e14] text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <motion.div 
         initial={false}
         animate={{ width: sidebarOpen ? 260 : 0, opacity: sidebarOpen ? 1 : 0 }}
         className="flex-shrink-0 bg-[#11151c] border-r border-[#2b3342] flex flex-col overflow-hidden"
      >
         <div className="p-6 flex items-center gap-3 border-b border-[#2b3342]">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#1e88e5] to-purple-600 flex items-center justify-center font-black text-white shadow-[0_0_15px_rgba(30,136,229,0.5)]">
              Z
            </div>
            <div className="flex items-center gap-2">
               <div className="relative w-6 h-5">
                 <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_5px_rgba(0,163,255,0.5)]">
                   <defs>
                     <linearGradient id="z-blue-admin" x1="0" y1="0" x2="1" y2="0">
                       <stop offset="0%" stopColor="#00d4ff" />
                       <stop offset="100%" stopColor="#0044ff" />
                     </linearGradient>
                     <linearGradient id="z-silver-admin" x1="0" y1="0" x2="1" y2="0">
                       <stop offset="0%" stopColor="#ffffff" />
                       <stop offset="100%" stopColor="#a0a0a0" />
                     </linearGradient>
                   </defs>
                   <path d="M 20 25 L 75 25 L 45 55 L 20 55 L 35 40 L 20 40 Z" fill="url(#z-blue-admin)"/>
                   <path d="M 40 75 L 95 75 L 65 45 L 40 45 L 55 60 L 40 60 Z" fill="url(#z-silver-admin)"/>
                 </svg>
               </div>
               <span className="font-black text-xl tracking-tight text-white flex items-center">ZORVE<span className="text-[#00a3ff]">X</span></span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-500 text-[9px] font-bold uppercase ml-auto flex items-center gap-1"><Lock size={10} /> ADMIN</span>
         </div>
         
         <div className="flex-1 overflow-y-auto custom-scrollbar py-4">
            <div className="px-4 mb-2 text-[10px] font-bold text-[#8390a0] uppercase tracking-wider">Main Menu</div>
            {menu.map(item => (
               <SidebarItem 
                 key={item.label}
                 icon={item.icon}
                 label={item.label}
                 active={activeTab === item.label}
                 onClick={() => setActiveTab(item.label)}
               />
            ))}
         </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
         {/* Top Header */}
         <header className="h-16 bg-[#11151c] border-b border-[#2b3342] flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-4">
               <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-[#8390a0] hover:text-white transition-colors">
                  <Menu size={20} />
               </button>
               <h1 className="text-lg font-bold text-white">{activeTab}</h1>
            </div>
            <div className="flex items-center gap-4">
               <span className="text-xs text-[#8390a0] flex items-center gap-1"><Clock size={12} /> {new Date().toLocaleTimeString()}</span>
            </div>
         </header>

         {/* Scrollable Content */}
         <main className="flex-1 overflow-y-auto custom-scrollbar p-6 relative">
            <AnimatePresence mode="wait">
               <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
               >
                                                      {activeTab === 'Dashboard' && <AdminDashboard stats={stats} />}
                  {activeTab === 'Users' && <AdminUsers users={users} toggleUserStatus={toggleUserStatus} handleEditBalance={handleEditBalance} />}
                  {activeTab === 'KYC & Verification' && <AdminKyc kyc={kyc} handleKyc={handleKyc} />}
                  {activeTab === 'Wallet' && <AdminWallet />}

                  {activeTab === 'Deposits' && <AdminDeposits />}
                  {activeTab === 'Withdrawals' && <AdminWithdrawals />}
                  {activeTab === 'Payments' && <AdminPayments />}
                  {activeTab === 'Market Data' && <AdminMarketData />}

                                                                        {activeTab === 'Trading Engine' && <AdminMarketData trades={trades} />}
                  {activeTab === 'Instruments' && <AdminInstruments />}
                                    {activeTab === 'Risk Management' && <AdminRiskManagement />}
                  {activeTab === 'Fraud & Security' && <AdminFraudSecurity />}
                          {activeTab === 'Affiliates' && <AdminAffiliates />}
                  {activeTab === 'Tournaments' && <AdminTournaments />}
                  {activeTab === 'Promotions' && <AdminPromotions />}
                  {activeTab === 'Support' && <AdminSupport />}
                  {activeTab === 'Reports' && <AdminReports />}
                  {activeTab === 'Notifications' && <AdminNotifications />}
                  {activeTab === 'Audit Logs' && <AdminLogs logs={logs} />}
                  {activeTab === 'Admins & Roles' && <AdminRoles />}
                  {activeTab === 'System Health' && <AdminSystemHealth />}
                  {activeTab === 'Settings' && <AdminSettings  />}

               </motion.div>
            </AnimatePresence>
         </main>
      </div>
    </div>
  );
}
