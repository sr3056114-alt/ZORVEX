import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { ShieldAlert, AlertOctagon, UserX, Cpu } from 'lucide-react';

export default function AdminFraudSecurity() {
  const [users, setUsers] = useState<any[]>([]);
  const [suspiciousGroups, setSuspiciousGroups] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      const allUsers: any[] = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setUsers(allUsers);
      
      // Group by deviceId
      const grouped: Record<string, any[]> = {};
      allUsers.forEach(u => {
        if (u.deviceId) {
          if (!grouped[u.deviceId]) grouped[u.deviceId as string] = [];
          grouped[u.deviceId].push(u);
        }
      });
      
      const suspicious = Object.keys(grouped).filter(deviceId => {
        const group = grouped[deviceId];
        if (group.length < 2) return false;
        // Check if anyone in this group referred someone else in this group
        let hasSelfReferral = false;
        for (const u of group) {
          if (u.referredBy && group.find(x => x.id === u.referredBy || x.affiliateCode === u.referredBy)) {
            hasSelfReferral = true;
          }
        }
        // Also flag if there are just multiple accounts on the same device as highly suspicious
        return true; 
      }).map(deviceId => ({
        deviceId,
        users: grouped[deviceId],
        isSelfReferral: grouped[deviceId].some(u => u.referredBy && grouped[deviceId].find(x => x.id === u.referredBy || x.affiliateCode === u.referredBy))
      }));
      
      setSuspiciousGroups(suspicious);
    });
    return () => unsub();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldAlert className="text-red-500" /> Fraud & Security
        </h2>
      </div>

      <div className="bg-[#1a202c] border border-red-500/30 rounded-xl overflow-hidden">
         <div className="p-4 bg-red-500/10 border-b border-red-500/20 text-red-400 text-sm font-bold flex items-center gap-2">
           <AlertOctagon size={16} /> Automatically tracking multiple accounts created on the same device.
         </div>
         
         <div className="p-6">
            {suspiciousGroups.length === 0 ? (
              <div className="text-center py-10 text-[#0ba259] font-bold flex flex-col items-center gap-3">
                 <ShieldAlert size={48} />
                 No suspicious device overlaps detected.
              </div>
            ) : (
              <div className="space-y-6">
                 {suspiciousGroups.map((group, idx) => (
                   <div key={idx} className={`p-4 rounded-xl border ${group.isSelfReferral ? 'bg-red-500/10 border-red-500/30' : 'bg-[#11151c] border-[#2b3342]'}`}>
                      <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
                         <div className="flex items-center gap-2 text-white font-bold text-sm">
                            <Cpu size={16} className="text-[#8390a0]" /> Device Fingerprint: <span className="font-mono text-[#1e88e5]">{group.deviceId}</span>
                         </div>
                         {group.isSelfReferral && (
                           <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded tracking-wider uppercase flex items-center gap-1">
                             <UserX size={12} /> SELF-REFERRAL FRAUD
                           </span>
                         )}
                      </div>
                      
                      <table className="w-full text-left text-sm">
                         <thead>
                           <tr className="text-[#8390a0] border-b border-white/5">
                             <th className="pb-2">Email</th>
                             <th className="pb-2">UID</th>
                             <th className="pb-2">Created</th>
                             <th className="pb-2">Referred By</th>
                           </tr>
                         </thead>
                         <tbody>
                           {group.users.map((u: any) => (
                             <tr key={u.id} className="text-white border-b border-white/5 last:border-0">
                               <td className="py-2 font-bold">{u.email}</td>
                               <td className="py-2 font-mono text-xs text-[#8390a0]">{u.id}</td>
                               <td className="py-2 text-xs">{new Date(u.createdAt || Date.now()).toLocaleDateString()}</td>
                               <td className="py-2 text-xs text-orange-400">{u.referredBy || 'None'}</td>
                             </tr>
                           ))}
                         </tbody>
                      </table>
                   </div>
                 ))}
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
