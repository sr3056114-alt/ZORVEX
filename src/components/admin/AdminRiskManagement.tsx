import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { ShieldAlert, AlertTriangle, Activity, Settings, Save } from 'lucide-react';

export default function AdminRiskManagement() {
  const [limits, setLimits] = useState({
    minTransaction: 10,
    maxTransaction: 10000,
    dailyLimit: 50000,
    maxExposure: 100000,
    pauseTrading: false,
    incidentMode: false,
    incidentNotes: ''
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'riskRules', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        setLimits(prev => ({ ...prev, ...docSnap.data() }));
      }
    }, (err) => console.warn(err));
    return () => unsub();
  }, []);

  const handleSave = async () => {
    try {
      await setDoc(doc(db, 'riskRules', 'global'), limits, { merge: true });
      const { addDoc } = await import('firebase/firestore');
      await addDoc(collection(db, 'auditLogs'), {
        adminId: localStorage.getItem('user_email') || 'Admin',
        action: 'UPDATE_RISK_LIMITS',
        details: 'Updated global operational limits and incident mode status.',
        timestamp: Date.now()
      });
      alert('Risk limits saved securely.');
    } catch (err) {
      console.error(err);
      alert('Error saving risk limits');
    }
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShieldAlert className="text-orange-500" /> Transparent Risk Management
          </h2>
          <p className="text-[#8390a0] text-sm mt-1">Configure global operational thresholds. Rule: Never use for outcome manipulation.</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 bg-[#1e88e5] hover:bg-[#1e88e5]/90 text-white font-bold py-2 px-6 rounded-lg transition-colors">
          <Save size={18} /> Apply Limits
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Operational Limits */}
        <div className="bg-[#1a202c] border border-[#2b3342] rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-bold border-b border-[#2b3342] pb-2 flex items-center gap-2"><Settings size={18}/> Operational Limits</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#8390a0] uppercase mb-1">Min Transaction ($)</label>
              <input type="number" value={limits.minTransaction} onChange={e => setLimits({...limits, minTransaction: Number(e.target.value)})} className="w-full bg-[#11151c] border border-[#2b3342] p-3 rounded focus:outline-none focus:border-[#1e88e5]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#8390a0] uppercase mb-1">Max Transaction ($)</label>
              <input type="number" value={limits.maxTransaction} onChange={e => setLimits({...limits, maxTransaction: Number(e.target.value)})} className="w-full bg-[#11151c] border border-[#2b3342] p-3 rounded focus:outline-none focus:border-[#1e88e5]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#8390a0] uppercase mb-1">Daily Global Limit ($)</label>
              <input type="number" value={limits.dailyLimit} onChange={e => setLimits({...limits, dailyLimit: Number(e.target.value)})} className="w-full bg-[#11151c] border border-[#2b3342] p-3 rounded focus:outline-none focus:border-[#1e88e5]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#8390a0] uppercase mb-1">Max Platform Exposure ($)</label>
              <input type="number" value={limits.maxExposure} onChange={e => setLimits({...limits, maxExposure: Number(e.target.value)})} className="w-full bg-[#11151c] border border-[#2b3342] p-3 rounded focus:outline-none focus:border-[#1e88e5]" />
            </div>
          </div>
        </div>

        {/* Emergency Controls */}
        <div className="bg-[#1a202c] border border-red-500/30 rounded-xl p-6 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl rounded-full"></div>
          <h3 className="text-lg font-bold border-b border-[#2b3342] pb-2 flex items-center gap-2 text-red-500"><AlertTriangle size={18}/> Emergency Controls</h3>
          
          <div className="flex items-center justify-between p-4 bg-[#11151c] rounded-lg border border-[#2b3342]">
            <div>
              <h4 className="font-bold">Pause All Trading</h4>
              <p className="text-xs text-[#8390a0]">Immediately halts new trades. Existing trades run to expiration.</p>
            </div>
            <button 
              onClick={() => setLimits({...limits, pauseTrading: !limits.pauseTrading})}
              className={`w-12 h-6 rounded-full relative transition-colors ${limits.pauseTrading ? 'bg-red-500' : 'bg-[#2b3342]'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${limits.pauseTrading ? 'translate-x-6' : ''}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#11151c] rounded-lg border border-[#2b3342]">
            <div>
              <h4 className="font-bold">Incident Mode</h4>
              <p className="text-xs text-[#8390a0]">Displays a warning banner to all active users regarding platform issues.</p>
            </div>
            <button 
              onClick={() => setLimits({...limits, incidentMode: !limits.incidentMode})}
              className={`w-12 h-6 rounded-full relative transition-colors ${limits.incidentMode ? 'bg-orange-500' : 'bg-[#2b3342]'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${limits.incidentMode ? 'translate-x-6' : ''}`} />
            </button>
          </div>

          {limits.incidentMode && (
            <div>
              <label className="block text-xs font-bold text-[#8390a0] uppercase mb-1">Public Incident Notes</label>
              <textarea 
                value={limits.incidentNotes} 
                onChange={e => setLimits({...limits, incidentNotes: e.target.value})} 
                rows={2} 
                className="w-full bg-[#11151c] border border-orange-500/50 p-3 rounded focus:outline-none focus:border-orange-500 text-sm"
                placeholder="We are experiencing minor delays..."
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Alert Logs */}
      <div className="bg-[#1a202c] border border-[#2b3342] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#2b3342] bg-[#151a23]">
           <h3 className="text-sm font-bold flex items-center gap-2"><Activity size={16}/> System Risk Alerts (Last 24h)</h3>
        </div>
        <div className="p-8 text-center text-[#8390a0]">
          <ShieldCheck size={32} className="mx-auto mb-2 opacity-50" />
          <p>No anomalous activity detected.</p>
        </div>
      </div>
    </div>
  );
}

function ShieldCheck(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg>;
}
