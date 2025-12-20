
import React, { useState, useMemo } from 'react';
import { ApiResponse, IpNodeDetail } from '../types';
import { CheckCircle, XCircle, Search, ChevronDown, ChevronUp, Network, HardDrive, Activity, Clock, FileText, Layers } from 'lucide-react';
import { TableSkeleton } from './Skeletons';

interface IpNodeListProps {
  data: ApiResponse | null;
  loading: boolean;
}

type SortField = 'ip' | 'status' | 'cpu' | 'ram' | 'uptime';

const IpNodeList: React.FC<IpNodeListProps> = ({ data, loading }) => {
  const [filter, setFilter] = useState('');
  const [sortField, setSortField] = useState<SortField>('status');
  const [sortAsc, setSortAsc] = useState(true);
  const [expandedIp, setExpandedIp] = useState<string | null>(null);

  const getStats = (details: IpNodeDetail) => {
    // Handle both potential structures: result.stats.cpu or result.cpu
    const res = details.stats?.result;
    if (!res) return null;
    return res.stats || res;
  };

  const nodes = useMemo(() => {
    if (!data) return [];
    return Object.entries(data.ip_nodes).map(([ip, details]: [string, IpNodeDetail]) => {
        const stats = getStats(details);
        return {
            ip,
            ...details,
            cpu: stats?.cpu_percent || 0,
            ram: stats?.ram_used || 0,
            ramTotal: stats?.ram_total || 0,
            uptime: stats?.uptime || 0,
            // Detailed stats
            activeStreams: stats?.active_streams || 0,
            fileSize: stats?.file_size || 0,
            packetsReceived: stats?.packets_received || 0,
            packetsSent: stats?.packets_sent || 0,
            totalBytes: stats?.total_bytes || 0,
            totalPages: stats?.total_pages || 0,
            currentIndex: stats?.current_index || 0,
            lastUpdated: stats?.last_updated || 0,
        };
    });
  }, [data]);

  const filteredAndSortedNodes = useMemo(() => {
    let result = nodes.filter(n => n.ip.includes(filter));
    
    result.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];
      
      // Handle status specific sorting to group
      if (sortField === 'status') {
         valA = a.status === 'online' ? 1 : 0;
         valB = b.status === 'online' ? 1 : 0;
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    return result;
  }, [nodes, filter, sortField, sortAsc]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const toggleExpand = (ip: string) => {
      setExpandedIp(expandedIp === ip ? null : ip);
  };

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / (3600*24));
    const h = Math.floor(seconds % (3600*24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    return `${d}d ${h}h ${m}m`;
  };

  const formatBytes = (bytes: number) => {
      if (!bytes && bytes !== 0) return 'N/A';
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatNumber = (num: number | undefined) => {
      if (num === undefined || num === null) return '0';
      return new Intl.NumberFormat('en-US').format(num);
  };

  const formatTimestamp = (ts: number | string | undefined) => {
      if (!ts) return 'N/A';
      try {
        const numTs = Number(ts);
        if (!isNaN(numTs)) {
          // Heuristic for seconds vs millis. 
          // Current timestamp ~1.7e9. If less than 1e11, assume seconds.
          const date = numTs < 100000000000 ? new Date(numTs * 1000) : new Date(numTs);
          return date.toLocaleString();
        }
        return new Date(ts).toLocaleString();
      } catch {
        return 'Invalid Date';
      }
  };

  if (loading) return <TableSkeleton rows={10} cols={7} />;

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          IP Nodes Registry 
          <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">{nodes.length}</span>
        </h2>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search IP Address..." 
            className="bg-slate-800 text-white pl-10 pr-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-500 w-64"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 text-slate-400 text-sm uppercase tracking-wider">
              <th className="p-4 w-10"></th>
              <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('ip')}>IP Address</th>
              <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('status')}>Status</th>
              <th className="p-4">Version</th>
              <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('cpu')}>CPU</th>
              <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('ram')}>RAM</th>
              <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('uptime')}>Uptime</th>
              <th className="p-4 text-right">Pods</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredAndSortedNodes.map((node) => (
              <React.Fragment key={node.ip}>
                <tr 
                    className={`hover:bg-slate-800/30 transition-colors cursor-pointer ${expandedIp === node.ip ? 'bg-slate-800/50' : ''}`}
                    onClick={() => toggleExpand(node.ip)}
                >
                  <td className="p-4 text-slate-500">
                      {expandedIp === node.ip ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </td>
                  <td className="p-4 font-mono text-cyan-400 font-medium">{node.ip}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                      node.status === 'online' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {node.status === 'online' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      {node.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300 text-sm">
                    {node.version?.result?.version || <span className="text-slate-600">-</span>}
                  </td>
                  <td className="p-4">
                    {node.status === 'online' ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-700 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${node.cpu > 80 ? 'bg-rose-500' : 'bg-cyan-500'}`} 
                            style={{ width: `${Math.min(node.cpu, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-slate-400 w-8">{node.cpu.toFixed(1)}%</span>
                      </div>
                    ) : <span className="text-slate-600 text-xs">N/A</span>}
                  </td>
                  <td className="p-4">
                    {node.status === 'online' ? (
                       <div className="text-sm text-slate-300">{formatBytes(node.ram)}</div>
                    ) : <span className="text-slate-600 text-xs">N/A</span>}
                  </td>
                  <td className="p-4 text-sm text-slate-400 font-mono">
                    {node.status === 'online' ? formatUptime(node.uptime) : '-'}
                  </td>
                  <td className="p-4 text-right">
                    <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">
                      {node.pods?.length || 0}
                    </span>
                  </td>
                </tr>
                
                {/* Expanded Detail Row */}
                {expandedIp === node.ip && (
                    <tr className="bg-slate-800/20">
                        <td colSpan={8} className="p-0">
                            <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in border-b border-slate-700/50">
                                
                                {/* Network Stats */}
                                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                                    <h4 className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-3 flex items-center gap-2">
                                        <Network size={14} className="text-cyan-400" /> Network Activity
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Packets Received</span>
                                            <span className="text-slate-200 font-mono">{formatNumber(node.packetsReceived)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Packets Sent</span>
                                            <span className="text-slate-200 font-mono">{formatNumber(node.packetsSent)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm border-t border-slate-700 pt-2 mt-2">
                                            <span className="text-slate-500">Active Streams</span>
                                            <span className="text-emerald-400 font-bold">{node.activeStreams}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Memory & Storage */}
                                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                                    <h4 className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-3 flex items-center gap-2">
                                        <HardDrive size={14} className="text-purple-400" /> Memory & Storage
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">RAM Used</span>
                                            <span className="text-slate-200 font-mono">{formatBytes(node.ram)}</span>
                                        </div>
                                        {node.ramTotal > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">RAM Total</span>
                                                <span className="text-slate-200 font-mono">{formatBytes(node.ramTotal)}</span>
                                            </div>
                                        )}
                                        {node.ramTotal > 0 && (
                                            <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1 mb-3">
                                                <div 
                                                    className="bg-purple-500 h-1.5 rounded-full" 
                                                    style={{ width: `${Math.min((node.ram / node.ramTotal) * 100, 100)}%`}}
                                                ></div>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-sm border-t border-slate-700 pt-2">
                                            <span className="text-slate-500">File Size</span>
                                            <span className="text-slate-200 font-mono">{formatBytes(node.fileSize)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Metadata */}
                                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                                    <h4 className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-3 flex items-center gap-2">
                                        <FileText size={14} className="text-blue-400" /> Metadata
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Total Bytes</span>
                                            <span className="text-slate-200 font-mono">{formatNumber(node.totalBytes)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Total Pages</span>
                                            <span className="text-slate-200 font-mono">{formatNumber(node.totalPages)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm pt-2 mt-2 border-t border-slate-700">
                                            <span className="text-slate-500 flex items-center gap-1">
                                                <Clock size={12}/> Last Updated
                                            </span>
                                        </div>
                                        <div className="text-right text-slate-300 text-xs font-mono">{formatTimestamp(node.lastUpdated)}</div>
                                    </div>
                                </div>

                                {/* System Info */}
                                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                                    <h4 className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-3 flex items-center gap-2">
                                        <Activity size={14} className="text-orange-400" /> System State
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Current Index</span>
                                            <span className="text-slate-200 font-mono">#{node.currentIndex}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Uptime</span>
                                            <span className="text-slate-200 font-mono">{formatUptime(node.uptime)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm mt-3 pt-2 border-t border-slate-700">
                                             <span className="text-slate-500 flex items-center gap-1">
                                                <Layers size={12}/> Pods Hosted
                                            </span>
                                            <span className="text-cyan-400 font-bold">{node.pods?.length || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* HOSTED PODS LIST */}
                            {node.pods && node.pods.length > 0 && (
                                <div className="px-6 pb-6 border-b border-slate-700/50">
                                    <h4 className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-3 flex items-center gap-2">
                                        <Layers size={14} className="text-emerald-400" /> Hosted Pods ({node.pods.length})
                                    </h4>
                                    <div className="bg-slate-950 rounded border border-slate-800 overflow-hidden">
                                        <table className="w-full text-left text-xs">
                                            <thead className="bg-slate-900 text-slate-500">
                                                <tr>
                                                    <th className="p-3 font-medium">Pod Address</th>
                                                    <th className="p-3 font-medium">Version</th>
                                                    <th className="p-3 font-medium">Last Seen</th>
                                                    <th className="p-3 font-medium text-right">Known Peers</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-800">
                                                {node.pods.map((pod, idx) => (
                                                    <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                                                        <td className="p-3 font-mono text-cyan-300">{pod.address}</td>
                                                        <td className="p-3 text-slate-300">{pod.version}</td>
                                                        <td className="p-3 text-slate-400 font-mono">
                                                            {formatTimestamp(pod.last_seen_timestamp || pod.last_seen)}
                                                        </td>
                                                        <td className="p-3 text-right text-slate-400">
                                                            {formatNumber(pod.total_count)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </td>
                    </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IpNodeList;
