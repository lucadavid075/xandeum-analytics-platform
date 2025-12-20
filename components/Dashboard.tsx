
import React, { useMemo } from 'react';
import { ApiResponse, IpNodeDetail, MilestoneInfo } from '../types';
import { Server, AlertCircle, Database, HardDrive, Target, ArrowUpCircle, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
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
  if (loading) return <DashboardSkeleton />;
  if (error) return <div className="flex flex-col items-center justify-center h-96 text-rose-500 gap-4 bg-rose-500/5 rounded-3xl border border-rose-500/10">
    <AlertCircle size={48} />
    <div className="text-center">
      <h3 className="text-xl font-bold text-white mb-1">Connection Failed</h3>
      <p className="text-rose-400/70">{error}</p>
    </div>
  </div>;
  if (!data) return null;

  // Milestone Progress Logic
  const migrationProgress = useMemo(() => {
    if (!milestone) return 0;
    const onlineNodes = Object.values(data.ip_nodes).filter(n => n.status === 'online');
    if (onlineNodes.length === 0) return 0;
    
    const upToDateNodes = onlineNodes.filter(n => 
        n.version?.result?.version.includes(milestone.version)
    );
    
    return Math.round((upToDateNodes.length / onlineNodes.length) * 100);
  }, [data, milestone]);

  // Helper for formatting bytes
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Calculate Total Network Storage
  const totalStorage = useMemo(() => {
    return Object.values(data.ip_nodes).reduce((acc, node) => {
      const res = node.stats?.result;
      const stats = res?.stats || res;
      return acc + (stats?.file_size || 0);
    }, 0);
  }, [data]);

  // Derived Data for Charts
  const statusData = useMemo(() => {
    return [
      { name: 'Online', value: data.summary.online_ip_nodes, color: '#34d399' },
      { name: 'Offline', value: data.summary.offline_ip_nodes, color: '#f43f5e' },
    ];
  }, [data]);

  const sortedByCpu = useMemo(() => {
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
            ip,
            cpu: stats?.cpu_percent || 0
        };
      })
      .sort((a, b) => b.cpu - a.cpu)
      .slice(0, 5);
  }, [data]);

  return (
    <div className="space-y-8 animate-fade-in">
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
                        <span className="text-xs font-bold text-slate-500 uppercase">Upgrade Progress</span>
                        <span className="text-xs font-black text-teal-400">{migrationProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700 shadow-inner">
                        <div 
                            className="h-full bg-gradient-to-r from-teal-600 to-teal-400 transition-all duration-1000 ease-out"
                            style={{ width: `${migrationProgress}%` }}
                        ></div>
                    </div>
                    <span className="text-[10px] text-slate-600 mt-2 font-mono">XandMinerD Target Protocol: v{milestone.version}.x</span>
                </div>
            </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total pNodes" 
          value={data.summary.unique_pnodes} 
          icon={<Database size={20} />} 
          color="cyan"
        />
        <StatCard 
          title="Online Hosts" 
          value={data.summary.online_ip_nodes} 
          icon={<Server size={20} />} 
          color="green"
        />
        <StatCard 
          title="Offline Hosts" 
          value={data.summary.offline_ip_nodes} 
          icon={<AlertCircle size={20} />} 
          color="red"
        />
        <StatCard 
          title="Network Storage" 
          value={formatBytes(totalStorage)} 
          icon={<HardDrive size={20} />} 
          color="purple"
        />
      </div>

      {/* Network Graph */}
      <div className="w-full">
        <NetworkGraph data={data} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Status Distribution */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg flex flex-col items-center">
          <h3 className="text-slate-300 font-semibold mb-4 w-full text-left text-sm uppercase tracking-wider">Network Health</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-slate-400 text-sm">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top CPU Consumers */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg lg:col-span-2">
          <h3 className="text-slate-300 font-semibold mb-4 text-sm uppercase tracking-wider">Top CPU Usage (Online Nodes)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedByCpu} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="ip" type="category" width={100} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', color: '#fff' }}
                />
                <Bar dataKey="cpu" fill="#22d3ee" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
