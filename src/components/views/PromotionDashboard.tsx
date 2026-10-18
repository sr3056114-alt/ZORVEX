import React, { useState, useMemo } from 'react';
import { 
  Megaphone, X, Copy, Download, TrendingUp, Users, DollarSign, 
  AlertTriangle, Target, Activity, CheckCircle2, ShieldAlert, Award,
  Clock, ArrowUpRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

const mockAnalytics = [
  { date: '1 Aug', clicks: 120, signups: 12, earnings: 450 },
  { date: '5 Aug', clicks: 250, signups: 28, earnings: 890 },
  { date: '10 Aug', clicks: 180, signups: 15, earnings: 600 },
  { date: '15 Aug', clicks: 390, signups: 45, earnings: 1200 },
  { date: '20 Aug', clicks: 290, signups: 32, earnings: 950 },
  { date: '25 Aug', clicks: 420, signups: 55, earnings: 1500 },
  { date: '30 Aug', clicks: 510, signups: 68, earnings: 2100 },
];

const mockUsers = [
  { id: 'USR-8932', name: 'Alex Johnson', date: '2023-08-30', volume: '$12,450', status: 'Active' },
  { id: 'USR-1294', name: 'Maria Garcia', date: '2023-08-29', volume: '$8,200', status: 'Active' },
  { id: 'USR-5541', name: 'David Chen', date: '2023-08-25', volume: '$0', status: 'Inactive' },
  { id: 'USR-7732', name: 'Sarah Miller', date: '2023-08-22', volume: '$45,100', status: 'Active' },
];

const mockCommissions = [
  { id: 'TRX-1092', user: 'Alex Johnson', amount: '+$124.50', type: 'RevShare', date: '2023-08-30' },
  { id: 'TRX-1091', user: 'Sarah Miller', amount: '+$451.00', type: 'CPA', date: '2023-08-29' },
  { id: 'TRX-1090', user: 'Maria Garcia', amount: '+$82.00', type: 'RevShare', date: '2023-08-28' },
];

const mockDonutData = [
  { name: 'RevShare (1% of Losses)', value: 4500, color: '#4f46e5' },
  { name: 'Deposit Bonus (15%)', value: 3100, color: '#ef4444' },
  { name: 'Sub-affiliates', value: 800, color: '#10b981' },
  { name: 'Contests', value: 600, color: '#8b5cf6' },
  { name: 'Other', value: 300, color: '#6b7280' },
];

const mockCampaigns = [
  { name: 'Twitter Summer Promo', clicks: 1240, conversions: 85, roi: '+124%' },
  { name: 'YouTube Review Link', clicks: 8500, conversions: 420, roi: '+310%' },
  { name: 'Telegram Group Drop', clicks: 430, conversions: 12, roi: '+45%' },
];

export default function PromotionDashboard({ isOpen, onClose, themeMode }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [timeframe, setTimeframe] = useState('monthly');
  
  // 7-digit unique code
  const [partnerCode] = useState(() => {
    const saved = localStorage.getItem('partnerCode');
    if (saved) return saved;
    const newCode = Math.random().toString(36).substring(2, 9).toUpperCase();
    localStorage.setItem('partnerCode', newCode);
    return newCode;
  });
  const referralLink = `https://zorvex.com/register?p=${partnerCode}`;

  if (!isOpen) return null;

  const isLight = themeMode === 'Light Mode';
  
  const theme = {
    bg: isLight ? 'bg-gray-50' : 'bg-[#0e1015]',
    panel: isLight ? 'bg-white' : 'bg-[#181a20]',
    border: isLight ? 'border-gray-200' : 'border-[#2a2d35]',
    text: isLight ? 'text-gray-900' : 'text-white',
    muted: isLight ? 'text-gray-500' : 'text-gray-400',
    highlight: isLight ? 'bg-gray-100' : 'bg-[#2a2d35]',
    accent: '#1e88e5'
  };

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Activity size={18} /> },
    { id: 'network', label: 'My Network', icon: <Users size={18} /> },
    { id: 'finances', label: 'Finances', icon: <DollarSign size={18} /> },
    { id: 'campaigns', label: 'Campaigns', icon: <Target size={18} /> },
    { id: 'security', label: 'Security', icon: <ShieldAlert size={18} /> },
  ];

  return (
    <div className={`fixed inset-0 z-50 flex ${theme.bg} animate-in fade-in duration-200`}>
      {/* Sidebar */}
      <div className={`w-[260px] ${theme.panel} border-r ${theme.border} flex flex-col`}>
        <div className={`h-16 flex items-center px-6 border-b ${theme.border}`}>
          <Megaphone className="text-[#1e88e5] mr-3" size={24} />
          <span className={`${theme.text} font-bold text-lg tracking-wide`}>PARTNER PRO</span>
        </div>
        
        <div className="flex-1 py-6 px-4 flex flex-col gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id 
                  ? 'bg-[#1e88e5]/10 text-[#1e88e5] font-bold' 
                  : `${theme.muted} hover:${theme.highlight} hover:${theme.text}`
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className={`p-6 border-t ${theme.border}`}>
          <div className="flex flex-col gap-2">
            <span className={`${theme.muted} text-xs font-bold uppercase`}>Your Partner Code</span>
            <div className={`flex items-center justify-between p-3 rounded-lg ${theme.highlight} border border-dashed ${theme.border}`}>
              <span className={`${theme.text} font-mono font-bold tracking-widest`}>{partnerCode}</span>
              <button onClick={copyLink} className="text-[#1e88e5] hover:opacity-80">
                {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header */}
        <div className={`h-16 ${theme.panel} border-b ${theme.border} flex items-center justify-between px-8 shrink-0`}>
          <h2 className={`${theme.text} text-xl font-bold`}>
            {tabs.find(t => t.id === activeTab)?.label}
          </h2>
          <div className="flex items-center gap-4">
            <button className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1e88e5] text-white font-medium hover:bg-[#1e88e5]/90 transition-colors`}>
              <Download size={16} />
              Export Reports
            </button>
            <button onClick={onClose} className={`w-10 h-10 rounded-full flex items-center justify-center ${theme.highlight} ${theme.text} hover:opacity-80 transition-opacity`}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-8 max-w-6xl mx-auto">
              
              {/* 1% RevShare Info Box */}
              <div className={`p-4 rounded-xl border border-[#1e88e5]/30 bg-[#1e88e5]/5 flex gap-4 items-start`}>
                 <div className="p-2 bg-[#1e88e5]/20 rounded-lg text-[#1e88e5] shrink-0">
                   <Target size={20} />
                 </div>
                 <div>
                   <h4 className={`${theme.text} font-bold text-sm mb-1`}>Active Plan: 1% RevShare + 15% Deposit Commission</h4>
                   <p className={`${theme.muted} text-sm leading-relaxed`}>
                     Users who register via your unique link or partner code will be permanently linked to your account. You will automatically receive <strong className={theme.text}>1% of all their net trading losses AND 15% of their first deposit</strong> directly into your dashboard earnings.
                   </p>
                 </div>
              </div>
              
              {/* Top Stats - Features 1-7 */}
              <div className="grid grid-cols-4 gap-4">
                <StatCard theme={theme} isLight={isLight} title="Total Referrals" value="1,248" icon={<Users size={22} />} trend="+12%" color="blue" />
                <StatCard theme={theme} isLight={isLight} title="New Users (30d)" value="342" icon={<TrendingUp size={22} />} trend="+5.2%" color="purple" />
                <StatCard theme={theme} isLight={isLight} title="Active Users" value="892" icon={<Activity size={22} />} color="default" />
                <StatCard theme={theme} isLight={isLight} title="Conversion Rate" value="14.8%" icon={<Target size={22} />} trend="+1.1%" color="orange" />
                
                <StatCard theme={theme} isLight={isLight} title="Total Earnings" value="$42,500.00" icon={<DollarSign size={22} />} color="green" />
                <StatCard theme={theme} isLight={isLight} title="Paid Earnings" value="$38,100.00" icon={<CheckCircle2 size={22} />} color="default" />
                <StatCard theme={theme} isLight={isLight} title="Pending Earnings" value="$4,400.00" icon={<Clock size={22} />} color="orange" />
                <div className={`border-2 border-dashed ${isLight ? 'border-[#1e88e5]/40 hover:border-[#1e88e5]' : 'border-[#1e88e5]/40 hover:border-[#1e88e5]'} bg-gradient-to-br ${isLight ? 'from-blue-50 to-transparent' : 'from-[#0f1b2d] to-transparent'} rounded-2xl p-5 flex flex-col justify-center items-center text-center relative overflow-hidden group cursor-pointer transition-all hover:shadow-lg`} onClick={copyLink}>
                   <div className="absolute inset-0 bg-[#1e88e5]/0 group-hover:bg-[#1e88e5]/5 transition-colors" />
                   <div className="w-12 h-12 rounded-full bg-[#1e88e5]/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                     <Copy className="text-[#1e88e5]" size={20} />
                   </div>
                   <span className={`${theme.text} font-bold mb-1 text-sm`}>Copy Referral Link</span>
                   <span className={`${theme.muted} text-[11px] break-all px-2 font-mono bg-black/5 dark:bg-black/20 rounded py-1`}>{referralLink}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className={`xl:col-span-2 ${theme.panel} border ${theme.border} rounded-2xl p-6`}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className={`${theme.text} font-bold text-lg`}>Earnings & Conversions</h3>
                    <div className={`flex bg-gray-500/10 rounded-lg p-1`}>
                      {['daily', 'weekly', 'monthly'].map(t => (
                        <button 
                          key={t}
                          onClick={() => setTimeframe(t)}
                          className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize ${timeframe === t ? 'bg-[#1e88e5] text-white' : theme.muted}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={mockAnalytics}>
                        <defs>
                          <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1e88e5" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#1e88e5" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={isLight ? '#e5e7eb' : '#2a2d35'} vertical={false} />
                        <XAxis dataKey="date" stroke={isLight ? '#6b7280' : '#9ca3af'} tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                        <YAxis stroke={isLight ? '#6b7280' : '#9ca3af'} tick={{fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: isLight ? '#fff' : '#181a20', borderColor: isLight ? '#e5e7eb' : '#2a2d35', borderRadius: '8px' }}
                          itemStyle={{ color: isLight ? '#111827' : '#fff' }}
                        />
                        <Area type="monotone" dataKey="earnings" stroke="#1e88e5" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className={`${theme.panel} border ${theme.border} rounded-2xl p-6 flex flex-col`}>
                  <h3 className={`${theme.text} font-bold text-lg mb-2`}>Earnings Breakdown</h3>
                  <span className={`${theme.muted} text-xs mb-4`}>Based on 1% RevShare structure</span>
                  <div className="flex-1 flex items-center justify-center relative">
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={mockDonutData}
                          innerRadius={65}
                          outerRadius={95}
                          paddingAngle={4}
                          dataKey="value"
                          stroke="none"
                        >
                          {mockDonutData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: isLight ? '#fff' : '#181a20', borderColor: isLight ? '#e5e7eb' : '#2a2d35', borderRadius: '8px' }}
                          itemStyle={{ color: isLight ? '#111827' : '#fff' }}
                          formatter={(value) => `${value}`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                      <span className={`${theme.muted} text-xs font-bold uppercase`}>Total</span>
                      <span className={`${theme.text} font-black text-xl`}>$9,300</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 mt-4">
                    {mockDonutData.map(item => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className={theme.muted}>{item.name}</span>
                        </div>
                        <span className={`${theme.text} font-bold`}>${item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'network' && (
            <div className="flex flex-col gap-6 max-w-6xl mx-auto">
              {/* Leaderboard - Feature 11 */}
              <div className={`${theme.panel} border ${theme.border} rounded-2xl p-6`}>
                <h3 className={`${theme.text} font-bold text-lg mb-4 flex items-center gap-2`}><Award className="text-[#f59e0b]" /> Top Referrers Leaderboard</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((rank) => (
                    <div key={rank} className={`p-4 rounded-xl border ${theme.border} flex items-center gap-4`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${rank === 1 ? 'bg-[#f59e0b]/20 text-[#f59e0b]' : rank === 2 ? 'bg-gray-400/20 text-gray-400' : 'bg-[#d97706]/20 text-[#d97706]'}`}>#{rank}</div>
                      <div>
                        <div className={`${theme.text} font-bold`}>Partner {Math.floor(Math.random() * 9000)}</div>
                        <div className={`${theme.muted} text-sm`}>{Math.floor(Math.random() * 500) + 100} conversions</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* User List - Feature 9 */}
              <div className={`${theme.panel} border ${theme.border} rounded-2xl overflow-hidden`}>
                <div className={`p-6 border-b ${theme.border}`}>
                  <h3 className={`${theme.text} font-bold text-lg`}>Referral-wise User List</h3>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`${theme.highlight} ${theme.muted} text-xs uppercase tracking-wider`}>
                      <th className="p-4 font-semibold">User ID</th>
                      <th className="p-4 font-semibold">Name</th>
                      <th className="p-4 font-semibold">Registration Date</th>
                      <th className="p-4 font-semibold">Trading Volume</th>
                      <th className="p-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockUsers.map((user, i) => (
                      <tr key={i} className={`border-b ${theme.border} hover:${theme.highlight} transition-colors`}>
                        <td className={`p-4 ${theme.text} font-medium`}>{user.id}</td>
                        <td className={`p-4 ${theme.text}`}>{user.name}</td>
                        <td className={`p-4 ${theme.muted}`}>{user.date}</td>
                        <td className={`p-4 ${theme.text} font-bold`}>{user.volume}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${user.status === 'Active' ? 'bg-[#0ba259]/20 text-[#0ba259]' : 'bg-gray-500/20 text-gray-500'}`}>
                            {user.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'finances' && (
            <div className="flex flex-col gap-6 max-w-6xl mx-auto">
              <div className="grid grid-cols-2 gap-6">
                {/* Commission History - Feature 12 */}
                <div className={`${theme.panel} border ${theme.border} rounded-2xl overflow-hidden`}>
                  <div className={`p-6 border-b ${theme.border}`}>
                    <h3 className={`${theme.text} font-bold text-lg`}>Commission History</h3>
                  </div>
                  <div className="p-2">
                    {mockCommissions.map((comm, i) => (
                      <div key={i} className={`flex items-center justify-between p-4 border-b ${theme.border} last:border-0`}>
                        <div>
                          <div className={`${theme.text} font-bold`}>{comm.type} Commission</div>
                          <div className={`${theme.muted} text-sm`}>From: {comm.user} • {comm.date}</div>
                        </div>
                        <div className="text-[#0ba259] font-bold text-lg">{comm.amount}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payout History - Feature 13 */}
                <div className={`${theme.panel} border ${theme.border} rounded-2xl overflow-hidden`}>
                  <div className={`p-6 border-b ${theme.border}`}>
                    <h3 className={`${theme.text} font-bold text-lg`}>Payout History</h3>
                  </div>
                  <div className="p-2">
                    <div className={`flex items-center justify-between p-4 border-b ${theme.border}`}>
                       <div>
                         <div className={`${theme.text} font-bold`}>Bitcoin (BTC) Withdrawal</div>
                         <div className={`${theme.muted} text-sm`}>Tx: 8x92...38d1 • 2023-08-01</div>
                       </div>
                       <div className="flex flex-col items-end">
                         <div className={`${theme.text} font-bold text-lg`}>$4,200.00</div>
                         <span className="text-[#1e88e5] text-xs font-bold uppercase">Completed</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'campaigns' && (
            <div className="flex flex-col gap-6 max-w-6xl mx-auto">
              <div className={`${theme.panel} border ${theme.border} rounded-2xl p-6`}>
                 <h3 className={`${theme.text} font-bold text-lg mb-6`}>Campaign Performance</h3>
                 <div className="grid grid-cols-3 gap-6">
                   {mockCampaigns.map((camp, i) => (
                     <div key={i} className={`p-5 rounded-xl border ${theme.border} bg-gradient-to-br from-transparent to-[#1e88e5]/5`}>
                        <h4 className={`${theme.text} font-bold mb-4`}>{camp.name}</h4>
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between">
                            <span className={theme.muted}>Clicks</span>
                            <span className={`${theme.text} font-bold`}>{camp.clicks}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className={theme.muted}>Conversions</span>
                            <span className={`${theme.text} font-bold`}>{camp.conversions}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-dashed border-gray-500/30">
                            <span className={theme.muted}>ROI</span>
                            <span className="text-[#0ba259] font-bold">{camp.roi}</span>
                          </div>
                        </div>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="flex flex-col gap-6 max-w-6xl mx-auto">
              <div className={`${theme.panel} border ${theme.border} border-l-4 border-l-[#e33f4a] rounded-2xl overflow-hidden`}>
                <div className={`p-6 border-b ${theme.border} flex justify-between items-center bg-[#e33f4a]/5`}>
                  <div className="flex items-center gap-2 text-[#e33f4a]">
                    <AlertTriangle size={20} />
                    <h3 className="font-bold text-lg">Fraud & Duplicate Alerts</h3>
                  </div>
                  <span className="bg-[#e33f4a] text-white text-xs px-2 py-1 rounded font-bold">2 Alerts</span>
                </div>
                <div className="p-2">
                  <div className={`flex items-start gap-4 p-4 border-b ${theme.border}`}>
                    <div className="w-8 h-8 rounded-full bg-[#e33f4a]/10 flex items-center justify-center shrink-0 mt-1">
                      <ShieldAlert size={16} className="text-[#e33f4a]" />
                    </div>
                    <div>
                      <div className={`${theme.text} font-bold text-base mb-1`}>Suspicious IP Match Detected</div>
                      <div className={`${theme.muted} text-sm leading-relaxed mb-3`}>
                        Users USR-5921 and USR-5922 registered using the same device fingerprint within 10 minutes. 
                        Commissions for these accounts are temporarily held pending review.
                      </div>
                      <button className="text-sm font-bold text-[#1e88e5] flex items-center gap-1 hover:underline">
                        Review Case <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </div>
                  <div className={`flex items-start gap-4 p-4 border-b ${theme.border}`}>
                    <div className="w-8 h-8 rounded-full bg-[#f59e0b]/10 flex items-center justify-center shrink-0 mt-1">
                      <AlertTriangle size={16} className="text-[#f59e0b]" />
                    </div>
                    <div>
                      <div className={`${theme.text} font-bold text-base mb-1`}>High Chargeback Ratio Warning</div>
                      <div className={`${theme.muted} text-sm leading-relaxed`}>
                        Traffic source "Telegram Group Drop" has generated 3 chargebacks this week. Please monitor traffic quality to avoid account penalties.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function StatCard({ theme, title, value, icon, trend, color = 'default', isLight = false }: { theme: any, title: any, value: any, icon: any, trend?: any, color?: string, isLight?: boolean }) {
  const colors = {
    default: { 
      bg: isLight ? 'from-white to-gray-50' : 'from-[#181a20] to-[#12141a]',
      icon: isLight ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-[#2a2d35] text-gray-300 border-gray-700',
      border: theme.border,
      glow: ''
    },
    blue: { 
      bg: isLight ? 'from-blue-50 to-white' : 'from-[#0f1b2d] to-[#181a20]', 
      icon: 'bg-blue-500/20 text-blue-500 border-blue-500/20', 
      border: isLight ? 'border-blue-200' : 'border-blue-500/30',
      glow: 'bg-blue-500'
    },
    green: { 
      bg: isLight ? 'from-emerald-50 to-white' : 'from-[#0b2416] to-[#181a20]', 
      icon: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/20', 
      border: isLight ? 'border-emerald-200' : 'border-emerald-500/30',
      glow: 'bg-emerald-500'
    },
    orange: { 
      bg: isLight ? 'from-orange-50 to-white' : 'from-[#2a1708] to-[#181a20]', 
      icon: 'bg-orange-500/20 text-orange-500 border-orange-500/20', 
      border: isLight ? 'border-orange-200' : 'border-orange-500/30',
      glow: 'bg-orange-500'
    },
    purple: { 
      bg: isLight ? 'from-purple-50 to-white' : 'from-[#1e132b] to-[#181a20]', 
      icon: 'bg-purple-500/20 text-purple-500 border-purple-500/20', 
      border: isLight ? 'border-purple-200' : 'border-purple-500/30',
      glow: 'bg-purple-500'
    }
  };

  const c = colors[color];

  return (
    <div className={`border ${c.border} rounded-2xl p-5 flex flex-col relative overflow-hidden group shadow-lg ${isLight ? 'shadow-gray-200/50' : 'shadow-black/40'} bg-gradient-to-br ${c.bg} transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5`}>
      {color !== 'default' && (
        <div className={`absolute -top-10 -right-10 w-32 h-32 ${c.glow} blur-[50px] rounded-full opacity-20 group-hover:opacity-30 transition-opacity`} />
      )}
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${c.icon} shadow-inner`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-[#0ba259]/10 text-[#0ba259]' : 'bg-red-500/10 text-red-500'} backdrop-blur-md border ${trend.startsWith('+') ? 'border-[#0ba259]/20' : 'border-red-500/20'}`}>
            {trend}
          </span>
        )}
      </div>
      <div className="flex flex-col relative z-10">
        <span className={`${theme.muted} text-sm font-semibold mb-1`}>{title}</span>
        <span className={`${theme.text} text-[28px] font-black tracking-tight leading-none`}>{value}</span>
      </div>
    </div>
  );
}
