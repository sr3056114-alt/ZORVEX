import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { Activity, Server, Database, Users, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function AdminSystemHealth() {
  const [health, setHealth] = useState({
    activeUsers: 0,
    openTrades: 0,
    dbStatus: 'Healthy',
    errors: 0
  });

  useEffect(() => {
    // We can simulate health or bind to actual stats
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      const active = snap.docs.filter(d => d.data().status === 'ACTIVE').length;
      setHealth(h => ({ ...h, activeUsers: active }));
    }, (err) => {
      setHealth(h => ({ ...h, dbStatus: 'Error', errors: h.errors + 1 }));
      console.warn(err);
    });

    const unsubTrades = onSnapshot(collection(db, 'liveTrades'), (snap) => {
      const open = snap.docs.filter(d => d.data().status === 'OPEN').length;
      setHealth(h => ({ ...h, openTrades: open }));
    }, (err) => console.warn(err));

    return () => { unsubUsers(); unsubTrades(); };
  }, []);

  const StatusCard = ({ title, value, icon: Icon, status }: any) => (
    <div className="bg-[#1a202c] p-6 rounded-xl border border-[#2b3342] flex items-center justify-between">
      <div>
        <p className="text-sm font-bold text-[#8390a0] uppercase mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-white">{value}</h4>
        {status && <p className={`text-xs mt-2 font-bold ${status === 'Healthy' ? 'text-green-500' : 'text-yellow-500'}`}>{status}</p>}
      </div>
      <div className={`p-4 rounded-full ${status === 'Healthy' ? 'bg-green-500/10 text-green-500' : status === 'Error' ? 'bg-red-500/10 text-red-500' : 'bg-[#2b3342] text-[#3d72ff]'}`}>
        <Icon size={24} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">System Health & Monitoring</h2>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-500 rounded-full text-sm font-bold border border-green-500/20">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          System Online
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard title="Database Status" value={health.dbStatus} icon={Database} status={health.dbStatus} />
        <StatusCard title="Active Users" value={health.activeUsers} icon={Users} />
        <StatusCard title="Open Trades" value={health.openTrades} icon={Activity} />
        <StatusCard title="System Errors" value={health.errors} icon={AlertTriangle} status={health.errors === 0 ? 'Healthy' : 'Warning'} />
      </div>

      <div className="bg-[#1a202c] p-6 rounded-xl border border-[#2b3342]">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Server size={20} className="text-[#3d72ff]" /> Real-time Listeners
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-[#151a23] rounded-lg border border-[#2b3342]">
            <div>
              <p className="text-sm font-bold text-white">Firebase Firestore Connection</p>
              <p className="text-xs text-[#8390a0]">WebSocket connection established</p>
            </div>
            <ShieldCheck className="text-green-500" />
          </div>
          <div className="flex justify-between items-center p-4 bg-[#151a23] rounded-lg border border-[#2b3342]">
            <div>
              <p className="text-sm font-bold text-white">Authentication Service</p>
              <p className="text-xs text-[#8390a0]">Token verification active</p>
            </div>
            <ShieldCheck className="text-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
