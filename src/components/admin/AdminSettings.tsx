import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Save, Settings, Shield, Users, Wallet, Target, Activity, Share2 } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState('GENERAL');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'settings'), (snap) => {
      const data: Record<string, string> = {};
      snap.docs.forEach(d => { data[d.id] = d.data().value; });
      setSettings(data);
    }, (err) => console.warn(err));
    return () => unsub();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (key: string) => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', key), { value: settings[key] }, { merge: true });
      // add audit log
      const { addDoc } = await import('firebase/firestore');
      await addDoc(collection(db, 'auditLogs'), {
        adminId: localStorage.getItem('user_email') || 'Admin',
        action: 'UPDATE_SETTING',
        details: `Updated ${key}`,
        timestamp: Date.now()
      });
    } catch (e) {
      console.error(e);
      alert('Failed to save setting');
    }
    setSaving(false);
  };

  const categories = [
    { id: 'GENERAL', icon: Settings, label: 'General' },
    { id: 'SECURITY', icon: Shield, label: 'Security' },
    { id: 'USERS', icon: Users, label: 'User Settings' },
    { id: 'WALLET', icon: Wallet, label: 'Wallet & Fees' },
    { id: 'TRADING', icon: Activity, label: 'Trading Engine' },
    { id: 'KYC', icon: Shield, label: 'Document Verification' },
    { id: 'SOCIAL', icon: Share2, label: 'Social Media Links' }
  ];

  const renderInput = (label: string, key: string, placeholder = '') => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold text-[#8390a0]">{label}</label>
      <div className="flex gap-2">
        <input 
          value={settings[key] || ''} 
          onChange={e => handleChange(key, e.target.value)} 
          placeholder={placeholder}
          className="flex-1 bg-[#151a23] border border-[#2b3342] rounded-lg p-3 text-white focus:outline-none focus:border-[#3d72ff]" 
        />
        <button onClick={() => handleSave(key)} disabled={saving} className="px-4 py-2 bg-[#3d72ff] hover:bg-[#2b5ae6] text-white rounded-lg font-bold">
          <Save size={18} />
        </button>
      </div>
    </div>
  );

  const renderToggle = (label: string, key: string) => (
    <div className="flex justify-between items-center bg-[#151a23] border border-[#2b3342] rounded-lg p-4">
      <span className="text-sm font-bold text-white">{label}</span>
      <button 
        onClick={() => {
          const newVal = settings[key] === 'true' ? 'false' : 'true';
          handleChange(key, newVal);
          handleSave(key);
        }}
        className={`w-12 h-6 rounded-full relative transition-colors ${settings[key] === 'true' ? 'bg-[#3d72ff]' : 'bg-[#2b3342]'}`}
      >
        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${settings[key] === 'true' ? 'translate-x-6' : ''}`} />
      </button>
    </div>
  );

  return (
    <div className="space-y-6 text-white flex flex-col md:flex-row gap-6">
      {/* Sidebar */}
      <div className="w-full md:w-64 space-y-2">
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeCategory === c.id ? 'bg-[#3d72ff] text-white' : 'text-[#8390a0] hover:bg-[#1a202c] hover:text-white'}`}
          >
            <c.icon size={18} /> {c.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 bg-[#1a202c] border border-[#2b3342] rounded-xl p-6">
        <h3 className="text-xl font-bold mb-6">{categories.find(c => c.id === activeCategory)?.label} Configuration</h3>
        
        <div className="space-y-6 max-w-2xl">
          {activeCategory === 'GENERAL' && (
            <>
              {renderInput('Platform Name', 'platform_name', 'Rajadhan Gaming')}
              {renderInput('Support Email', 'support_email', 'support@example.com')}
              {renderInput('USD to INR Rate', 'usd_rate', '85')}
              {renderInput('Default Timezone', 'timezone', 'Asia/Kolkata')}
            </>
          )}

          {activeCategory === 'SECURITY' && (
            <>
              {renderToggle('Maintenance Mode', 'maintenance_mode')}
              {renderInput('Admin Session Timeout (mins)', 'admin_timeout', '60')}
              {renderToggle('Require 2FA for Admins', 'admin_2fa')}
            </>
          )}

          {activeCategory === 'USERS' && (
            <>
              {renderToggle('Enable New Registrations', 'allow_registrations')}
              {renderToggle('Require Document Verification (KYC)', 'doc_verification')}
              {renderInput('Default Welcome Bonus', 'welcome_bonus', '0')}
            </>
          )}

          {activeCategory === 'WALLET' && (
            <>
              {renderInput('Minimum Deposit', 'min_deposit', '10')}
              {renderInput('Minimum Withdrawal', 'min_withdrawal', '50')}
              {renderInput('Withdrawal Fee (%)', 'withdrawal_fee', '0')}
              {renderToggle('Enable UPI Deposits', 'gpay_enabled')}
              {renderInput('USDT TRC20 Address', 'usdt_address', '')}
              {renderInput('UPI ID', 'upi_id', '')}
            </>
          )}

          {activeCategory === 'TRADING' && (
            <>
              {renderToggle('Trading Engine Active', 'trading_active')}
              {renderInput('Minimum Trade Amount', 'min_trade', '1')}
              {renderInput('Maximum Trade Amount', 'max_trade', '1000')}
              {renderInput('Default Payout %', 'default_payout', '85')}
            </>
          )}

          {activeCategory === 'SOCIAL' && (
            <>
              {renderInput('Instagram Link', 'social_instagram', 'https://instagram.com/')}
              {renderInput('Facebook Link', 'social_facebook', 'https://facebook.com/')}
              {renderInput('YouTube Link', 'social_youtube', 'https://youtube.com/')}
            </>
          )}

          {activeCategory === 'KYC' && (
            <>
              {renderToggle('Enable Document Verification', 'kyc_enabled')}
              {renderToggle('Verification Required for Trading', 'kyc_required')}
              {renderInput('Allowed Document Types', 'kyc_allowed_types', 'Aadhaar, PAN, Passport')}
              {renderInput('Maximum File Size (MB)', 'kyc_max_size', '5')}
              {renderInput('Accepted File Formats', 'kyc_formats', 'JPG, PNG, PDF')}
              <div className="flex flex-col gap-1 mt-4">
                <label className="text-xs font-bold text-[#8390a0]">Verification Instructions</label>
                <div className="flex gap-2">
                  <textarea 
                    value={settings['kyc_instructions'] || ''} 
                    onChange={e => handleChange('kyc_instructions', e.target.value)} 
                    placeholder="e.g. Please upload a clear photo of your government ID."
                    className="flex-1 bg-[#151a23] border border-[#2b3342] rounded-lg p-3 text-white focus:outline-none focus:border-[#3d72ff]" 
                    rows={3}
                  />
                  <button onClick={() => handleSave('kyc_instructions')} disabled={saving} className="px-4 py-2 bg-[#3d72ff] hover:bg-[#2b5ae6] text-white rounded-lg font-bold">
                    <Save size={18} />
                  </button>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
