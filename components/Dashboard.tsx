
import React, { useMemo, useState, useEffect } from 'react';
import { ApiResponse, IpNodeDetail, MilestoneInfo } from '../types';
import { Server, AlertCircle, Database, HardDrive, Target, ArrowUpCircle, Activity, ShieldCheck, Zap, Cpu } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, CartesianGrid } from 'recharts';
import StatCard from './StatCard';
import NetworkGraph from './NetworkGraph';
import { DashboardSkeleton } from './Skeletons';

interface DashboardProps {
  data: ApiResponse | null;
  loading: boolean;
  error: string | null;
  milestone: MilestoneInfo | null;
}

const Dashboard: React.FC<DashboardProps> = ({ data, loading, error, milestone }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Helper for formatting bytes
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Milestone Progress Logic
  const progressMetrics = useMemo(() => {
    if (!milestone || !data) return { percent: 0, count: 0, total: 0 };
    
    const pNodes = data.merged_pnodes;
    const total = pNodes.length;
    
    if (total === 0) return { percent: 0, count: 0, total: 0 };
    
    const targetVersion = milestone.version.trim(); 
    
    // Filter pNodes that contain the milestone version string
    const count = pNodes.filter(n => {
        const ver = n.version || '';
        return ver.includes(targetVersion);
    }).length;
    
    return {
        percent: Math.round((count / total) * 100),
        count,
        total
    };
  }, [data, milestone]);

  // Trigger animation when data loads or progress changes
  useEffect(() => {
    // Small timeout to ensure the DOM is ready for transition
    const timer = setTimeout(() => {
      setAnimatedProgress(progressMetrics.percent);
    }, 100);
    return () => clearTimeout(timer);
  }, [progressMetrics.percent]);

  // Calculate Storage Stats
  const storageStats = useMemo(() => {
    if (!data) return { committed: 0, used: 0 };
    let committed = 0;
    let used = 0;
    const nodes = Object.values(data.ip_nodes) as IpNodeDetail[];
    nodes.forEach(node => {
      const res = node.stats?.result;
      const stats = res?.stats || res;
      if (node.status === 'online') {
        committed += (stats?.file_size || 0);
        used += (stats?.total_bytes || 0);
      }
    });
    return { committed, used };
  }, [data]);

  // Derived Data for Charts
  const statusData = useMemo(() => {
    if (!data) return [];
    return [
      { name: 'Online', value: data.summary.online_ip_nodes, color: '#10b981' }, // Green
      { name: 'Offline', value: data.summary.offline_ip_nodes, color: '#f43f5e' }, // Red
    ];
  }, [data]);

  const sortedByCpu = useMemo(() => {
    if (!data) return [];
    return Object.entries(data.ip_nodes)
      .filter(([_, details]: [string, IpNodeDetail]) => {
         const res = details.stats?.result;
         const stats = res?.stats || res;
         return details.status === 'online' && stats?.cpu_percent !== undefined;
      })
      .map(([ip, details]: [string, IpNodeDetail]) => {
        const res = details.stats?.result;
        const stats = res?.stats || res;
        return {
            displayLabel: ip.split('.').slice(0, 2).join('.') + '.*.*', 
            fullAddress: ip, 
            cpu: stats?.cpu_percent || 0,
            type: 'Host'
        };
      })
      .sort((a, b) => b.cpu - a.cpu)
      .slice(0, 5);
  }, [data]);

  const sortedByStorage = useMemo(() => {
    if (!data) return [];
    return data.merged_pnodes
      .map(p => {
        const host = data.ip_nodes[p.source_ip];
        const res = host?.stats?.result;
        const stats = res?.stats || res;
        return {
          displayLabel: p.address.substring(0, 10) + '...',
          fullAddress: p.address,
          committed: (stats?.file_size || 0) / (1024 * 1024 * 1024), // To GB
          type: 'pNode'
        };
      })
      .sort((a, b) => b.committed - a.committed)
      .slice(0, 5);
  }, [data]);

  const fileSystemData = useMemo(() => {
    if (!data) return [];
    const categories = {
      enterprise: { name: 'Enterprise (5+ FS)', count: 0, color: '#10b981' }, // Green
      high: { name: 'High (2-4 FS)', count: 0, color: '#f59e0b' }, // Yellow
      single: { name: 'Standard (1 FS)', count: 0, color: '#a855f7' }, // Purple
      none: { name: 'Inactive (0 FS)', count: 0, color: '#475569' }
    };

    const nodes = Object.values(data.ip_nodes) as IpNodeDetail[];
    nodes.forEach(node => {
      if (node.status !== 'online') return;
      const count = node.pods?.length || 0;
      
      if (count >= 5) categories.enterprise.count++;
      else if (count >= 2) categories.high.count++;
      else if (count === 1) categories.single.count++;
      else categories.none.count++;
    });

    return Object.values(categories);
  }, [data]);

  const storageUsagePercent = storageStats.committed > 0 
    ? Math.round((storageStats.used / storageStats.committed) * 100) 
    : 0;

  // Custom Tooltip Component for Charts
  const CustomTooltip = ({ active, payload, unit }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl shadow-2xl backdrop-blur-md min-w-[320px]">
          <div className="flex items-center justify-between gap-4 mb-2">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
              {d.type === 'pNode' ? 'pNode Account Address' : 'Host IP Address'}
            </p>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${d.type === 'pNode' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
              {d.type}
            </span>
          </div>
          <p className="text-sm text-white font-mono mb-3 bg-slate-900 px-2 py-1.5 rounded border border-slate-800 break-all leading-relaxed">
            {d.fullAddress}
          </p>
          <div className="flex justify-between items-center border-t border-slate-800 pt-3">
            <span className="text-xs text-slate-400 font-medium">Metric Value:</span>
            <span className={`text-sm font-black ${unit === '%' ? 'text-amber-400' : 'text-purple-400'}`}>
              {payload[0].value.toFixed(2)}{unit}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) return <DashboardSkeleton />;
  if (error) return <div className="flex flex-col items-center justify-center h-96 text-rose-500 gap-4 bg-rose-500/5 rounded-3xl border border-rose-500/10">
    <AlertCircle size={48} />
    <div className="text-center">
      <h3 className="text-xl font-bold text-white mb-1">Connection Failed</h3>
      <p className="text-rose-400/70">{error}</p>
    </div>
  </div>;
  if (!data) return null;

  const totalHosts = data.summary.online_ip_nodes + data.summary.offline_ip_nodes;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Milestone Progress Banner */}
      {milestone && (
        <div className="relative group overflow-hidden bg-slate-900 border border-teal-500/30 rounded-2xl p-6 shadow-xl shadow-teal-500/5">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Target size={120} className="text-teal-400" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-teal-500/20 rounded-xl">
                        <ArrowUpCircle className="text-teal-400" size={32} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-teal-400 font-black text-xs uppercase tracking-widest">Active Milestone</span>
                            <span className="bg-teal-500 text-slate-950 px-2 py-0.5 rounded text-[10px] font-bold">v{milestone.version}</span>
                        </div>
                        <h2 className="text-2xl font-black text-white">{milestone.name}</h2>
                        <p className="text-slate-400 text-sm max-w-xl mt-1">
                            <span className="text-amber-400 font-bold">Goal: {milestone.goal}</span> — {milestone.description}
                        </p>
                    </div>
                </div>
                
                <div className="flex flex-col items-end min-w-[200px]">
                    <div className="flex justify-between w-full mb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase">pNode Upgrade Progress</span>
                        <span className="text-xs font-black text-teal-400">{progressMetrics.percent}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700 shadow-inner">
                        <div 
                            className="h-full bg-gradient-to-r from-teal-600 to-teal-400 transition-all duration-1000 ease-out"
                            style={{ width: `${animatedProgress}%` }}
                        ></div>
                    </div>
                    <span className="text-[10px] text-slate-600 mt-2 font-mono">
                      {progressMetrics.count} / {progressMetrics.total} pNodes Updated (v{milestone.version}+)
                    </span>
                </div>
            </div>
        </div>
      )}

      {/* Summary Cards with Purple, Yellow, Green Branding */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total pNodes" 
          value={data.summary.unique_pnodes} 
          icon={<Database size={18} />} 
          color="purple"
        />
        <StatCard 
          title="Host Availability" 
          value={`${data.summary.online_ip_nodes} / ${totalHosts}`} 
          icon={<Server size={18} />} 
          color="green"
          trend={`${data.summary.online_ip_nodes} Active / ${totalHosts} Total`}
        />
        <StatCard 
          title="Committed Capacity" 
          value={formatBytes(storageStats.committed)} 
          icon={<HardDrive size={18} />} 
          color="yellow"
          trend={`${storageUsagePercent}% Used`}
        />
        <StatCard 
          title="Used Storage" 
          value={formatBytes(storageStats.used)} 
          icon={<Zap size={18} />} 
          color="yellow"
          trend="Real-time Consumption"
        />
      </div>

      {/* Network Topology Visualization */}
      <div className="w-full">
        <NetworkGraph data={data} />
      </div>

      {/* Detailed Analytics Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg flex flex-col items-center">
          <h3 className="text-slate-300 font-bold mb-6 w-full text-left text-xs uppercase tracking-widest flex items-center gap-2">
             <ShieldCheck size={16} className="text-emerald-400" /> Network Integrity
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-6 mt-4 w-full justify-center">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-slate-400 text-xs font-bold uppercase">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* File System Distribution Chart */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg lg:col-span-2">
          <h3 className="text-slate-300 font-bold mb-6 text-xs uppercase tracking-widest flex items-center gap-2">
            <Activity size={16} className="text-amber-400" /> File System Distribution (Storage Pod Density)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fileSystemData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                   {fileSystemData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-slate-500 mt-4 italic font-medium uppercase tracking-tighter">Grouping of physical hosts by the number of independent storage pods (File Systems) they support.</p>
        </div>
      </div>

      {/* Detailed Analytics Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top CPU Consumers */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
          <h3 className="text-slate-300 font-bold mb-6 text-xs uppercase tracking-widest flex items-center gap-2">
            <Cpu size={16} className="text-amber-400" /> Top CPU Utilization (Active Hosts)
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedByCpu} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="displayLabel" type="category" width={120} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  content={<CustomTooltip unit="%" />}
                />
                <Bar dataKey="cpu" fill="#f59e0b" radius={[0, 6, 6, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Pods Storage Chart */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
          <h3 className="text-slate-300 font-bold mb-6 text-xs uppercase tracking-widest flex items-center gap-2">
            <HardDrive size={16} className="text-purple-400" /> Top pNodes by Storage Committed
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedByStorage} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="displayLabel" type="category" width={120} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  content={<CustomTooltip unit=" GB" />}
                />
                <Bar dataKey="committed" fill="#a855f7" radius={[0, 6, 6, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
