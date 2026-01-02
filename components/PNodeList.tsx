
import React, { useState, useMemo } from 'react';
import { ApiResponse, NodeStatsResult, NodeStatsFields } from '../types';
import { Layers, Search, ChevronDown, ChevronUp, Cpu, HardDrive, Copy, Check, Power, Key, Filter, ChevronLeft, ChevronRight, Activity, Globe, Clock } from 'lucide-react';
import { TableSkeleton } from './Skeletons';

interface PNodeListProps {
  data: ApiResponse | null;
  loading: boolean;
}

type SortField = 'cpu' | 'ram' | 'storage' | 'uptime';

const PNodeList: React.FC<PNodeListProps> = ({ data, loading }) => {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 20;

  // Helper to get stats from host safely
  const getHostStats = (ip: string): NodeStatsFields | null => {
    if (!data) return null;
    const host = data.ip_nodes[ip];
    if (!host?.stats?.result) return null;
    const res = host.stats.result as NodeStatsResult;
    return (res.stats || res) as NodeStatsFields;
  };

  // Enrich pNodes with real-time metrics from their parent IP Nodes
  const enrichedPNodes = useMemo(() => {
    if (!data) return [];
    return data.merged_pnodes.map(p => {
      const host = data.ip_nodes[p.source_ip];
      const stats = getHostStats(p.source_ip);
      return {
        ...p,
        status: host?.status || 'offline',
        cpu: stats?.cpu_percent || 0,
        ram: stats?.ram_used || 0,
        storage: stats?.file_size || 0,
        uptime: stats?.uptime || 0,
      };
    });
  }, [data]);

  // Filtering and Sorting
  const processedNodes = useMemo(() => {
    let result = enrichedPNodes.filter(p => 
      p.address.toLowerCase().includes(search.toLowerCase()) ||
      p.source_ip.includes(search) ||
      (p.pubkey && p.pubkey.toLowerCase().includes(search.toLowerCase())) ||
      p.version.includes(search)
    );

    if (sortField) {
      result.sort((a, b) => {
        const valA = a[sortField] || 0;
        const valB = b[sortField] || 0;
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [enrichedPNodes, search, sortField, sortAsc]);

  // Pagination calculations
  const totalPages = Math.ceil(processedNodes.length / ITEMS_PER_PAGE);
  const paginatedNodes = processedNodes.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
    setPage(1);
  };

  const handleCopy = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatBytes = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatUptime = (seconds: number) => {
    if (!seconds) return '-';
    const d = Math.floor(seconds / (3600*24));
    const h = Math.floor(seconds % (3600*24) / 3600);
    return `${d}d ${h}h`;
  };

  const formatDate = (dateInput: any) => {
    if (!dateInput) return 'N/A';
    const timestamp = Number(dateInput);
    const date = new Date(timestamp < 1e11 ? timestamp * 1000 : timestamp);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <TableSkeleton rows={12} cols={8} />;
  if (!data) return null;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-8 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-900/50">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Layers className="text-purple-400" size={28} /> pNode Registry
              <span className="text-sm bg-slate-800 text-slate-400 border border-slate-700 px-3 py-1 rounded-full font-mono">
                {processedNodes.length} Total
              </span>
            </h2>
            <p className="text-slate-400 text-sm mt-2">Active storage layer providers on the Xandeum network</p>
          </div>
          <div className="relative w-full md:w-[450px]">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
            <input 
              type="text" 
              placeholder="Search Address, IP, Version..." 
              className="bg-slate-800 text-white pl-12 pr-4 py-3.5 rounded-xl border border-slate-700 focus:outline-none focus:border-purple-500 w-full transition-all text-base placeholder-slate-600 shadow-inner"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        {/* Enhanced Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/40 text-slate-400 text-xs uppercase tracking-widest font-bold border-b border-slate-800">
                <th className="p-5 w-12"></th>
                {/* Fixed Headers (Non-sortable) */}
                <th className="p-5">pNode Address</th>
                <th className="p-5">Version</th>
                <th className="p-5">Status</th>
                
                {/* Metric Headers (Sortable) */}
                <th className="p-5 cursor-pointer hover:text-white transition-colors group" onClick={() => handleSort('cpu')}>
                  <div className="flex items-center gap-2">
                    CPU {sortField === 'cpu' ? (sortAsc ? <ChevronUp size={14} className="text-purple-400"/> : <ChevronDown size={14} className="text-purple-400"/>) : <Filter size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </div>
                </th>
                <th className="p-5 cursor-pointer hover:text-white transition-colors group" onClick={() => handleSort('ram')}>
                  <div className="flex items-center gap-2">
                    RAM {sortField === 'ram' ? (sortAsc ? <ChevronUp size={14} className="text-purple-400"/> : <ChevronDown size={14} className="text-purple-400"/>) : <Filter size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </div>
                </th>
                <th className="p-5 cursor-pointer hover:text-white transition-colors group" onClick={() => handleSort('storage')}>
                  <div className="flex items-center gap-2">
                    Storage {sortField === 'storage' ? (sortAsc ? <ChevronUp size={14} className="text-purple-400"/> : <ChevronDown size={14} className="text-purple-400"/>) : <Filter size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </div>
                </th>
                <th className="p-5 cursor-pointer hover:text-white transition-colors group text-right" onClick={() => handleSort('uptime')}>
                  <div className="flex items-center justify-end gap-2">
                    Uptime {sortField === 'uptime' ? (sortAsc ? <ChevronUp size={14} className="text-purple-400"/> : <ChevronDown size={14} className="text-purple-400"/>) : <Filter size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {paginatedNodes.map((node, idx) => {
                const uniqueKey = `${node.address}-${idx}`;
                const isExpanded = expandedKey === uniqueKey;
                const isOnline = node.status === 'online';
                
                return (
                  <React.Fragment key={uniqueKey}>
                    <tr 
                      className={`hover:bg-slate-800/50 transition-all cursor-pointer group ${isExpanded ? 'bg-slate-800/80 border-l-4 border-purple-500' : ''}`}
                      onClick={() => setExpandedKey(isExpanded ? null : uniqueKey)}
                    >
                      <td className="p-5 text-slate-500 group-hover:text-slate-300 transition-colors">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </td>
                      <td className="p-5">
                        <div className="text-purple-300 font-mono text-sm bg-purple-500/10 px-3 py-2 rounded-lg inline-block border border-purple-500/10">
                          {node.address.substring(0, 12)}...{node.address.substring(node.address.length - 10)}
                        </div>
                      </td>
                      <td className="p-5 font-mono text-cyan-400 text-sm font-bold uppercase">
                        {node.version.startsWith('v') ? node.version : `v${node.version}`}
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                           <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.3)]'}`}></div>
                           <span className={`text-xs font-black uppercase tracking-widest ${isOnline ? 'text-emerald-400' : 'text-rose-400'}`}>
                             {node.status}
                           </span>
                        </div>
                      </td>
                      <td className="p-5 text-sm text-slate-200 font-mono">
                        {isOnline ? (
                          <span className={node.cpu > 70 ? 'text-rose-400 font-bold' : 'text-slate-200'}>{node.cpu.toFixed(1)}%</span>
                        ) : <span className="text-slate-700">-</span>}
                      </td>
                      <td className="p-5 text-sm text-slate-200 font-mono">
                        {isOnline ? formatBytes(node.ram) : <span className="text-slate-700">-</span>}
                      </td>
                      <td className="p-5 text-sm text-slate-200 font-mono">
                        {isOnline ? formatBytes(node.storage) : <span className="text-slate-700">-</span>}
                      </td>
                      <td className="p-5 text-sm text-slate-400 font-mono text-right">
                        {isOnline ? formatUptime(node.uptime) : <span className="text-slate-700">-</span>}
                      </td>
                    </tr>

                    {/* Expandable Details Panel */}
                    {isExpanded && (
                      <tr className="bg-slate-950/60 border-b border-slate-800">
                        <td colSpan={8} className="p-0">
                          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in">
                            {/* Left Col: Keys */}
                            <div className="space-y-6">
                              <div className="flex items-center gap-3 mb-2">
                                <Key size={20} className="text-purple-400" />
                                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Network Identity</h4>
                              </div>
                              <div className="space-y-6">
                                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-inner">
                                  <label className="text-[11px] text-slate-500 block mb-3 font-black uppercase tracking-tighter">pNode Account Address</label>
                                  <div className="flex items-center gap-4">
                                    <code className="text-sm text-slate-200 break-all font-mono leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800 flex-1">{node.address}</code>
                                    <button 
                                      onClick={(e) => handleCopy(e, node.address)} 
                                      className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-all shadow-lg"
                                      title="Copy Address"
                                    >
                                      {copiedId === node.address ? <Check size={20} className="text-emerald-400" /> : <Copy size={20} />}
                                    </button>
                                  </div>
                                </div>
                                {node.pubkey && (
                                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-inner">
                                    <label className="text-[11px] text-slate-500 block mb-3 font-black uppercase tracking-tighter">Node Public Key</label>
                                    <div className="flex items-center gap-4">
                                      <code className="text-sm text-purple-300/90 break-all font-mono leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800 flex-1">{node.pubkey}</code>
                                      <button 
                                        onClick={(e) => handleCopy(e, node.pubkey!)} 
                                        className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-all shadow-lg"
                                        title="Copy PubKey"
                                      >
                                        {copiedId === node.pubkey ? <Check size={20} className="text-emerald-400" /> : <Copy size={20} />}
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Right Col: Health & Metrics */}
                            <div className="space-y-6">
                               <div className="flex items-center gap-3 mb-2">
                                <Activity size={20} className="text-emerald-400" />
                                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Host Health & Performance</h4>
                              </div>
                              <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
                                <div className="grid grid-cols-2 gap-8">
                                   <div className="space-y-2">
                                      <span className="text-[11px] text-slate-500 block uppercase font-bold tracking-tight">Software Build</span>
                                      <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                                        <span className="text-slate-100 font-mono text-base font-bold">v{node.version}</span>
                                      </div>
                                   </div>
                                   <div className="space-y-2">
                                      <span className="text-[11px] text-slate-500 block uppercase font-bold tracking-tight">Last Network Sync</span>
                                      <div className="flex items-center gap-2">
                                        <Clock size={14} className="text-slate-500" />
                                        <span className="text-slate-200 font-mono text-sm">{formatDate(node.last_seen || node.last_seen_timestamp)}</span>
                                      </div>
                                   </div>
                                </div>
                                
                                <div className="pt-6 border-t border-slate-800">
                                   <div className="flex justify-between items-center mb-4">
                                      <span className="text-sm font-bold text-slate-400">Host Compute Load</span>
                                      <span className={`text-base font-mono font-black ${node.cpu > 80 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                        {isOnline ? `${node.cpu.toFixed(1)}%` : 'OFFLINE'}
                                      </span>
                                   </div>
                                   <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                                      <div 
                                        className={`h-full transition-all duration-700 ease-out ${node.cpu > 80 ? 'bg-gradient-to-r from-rose-500 to-orange-500' : 'bg-gradient-to-r from-emerald-500 to-cyan-500'}`}
                                        style={{ width: `${isOnline ? Math.min(node.cpu, 100) : 0}%` }}
                                      ></div>
                                   </div>
                                </div>

                                <div className="flex flex-wrap gap-6 pt-2">
                                   <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-950 px-4 py-2 rounded-lg border border-slate-800">
                                      <HardDrive size={16} className="text-purple-400" /> 
                                      <span className="font-bold">{formatBytes(node.storage)}</span> 
                                      <span className="text-slate-600 font-medium">Allocated</span>
                                   </div>
                                   <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-950 px-4 py-2 rounded-lg border border-slate-800">
                                      <Power size={16} className="text-emerald-400" /> 
                                      <span className="font-bold">{formatUptime(node.uptime)}</span>
                                      <span className="text-slate-600 font-medium">Session</span>
                                   </div>
                                   <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-950 px-4 py-2 rounded-lg border border-slate-800">
                                      <Globe size={16} className="text-cyan-400" /> 
                                      <span className="font-bold">{node.source_ip}</span>
                                   </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Paginated Footer */}
        <div className="p-8 bg-slate-800/20 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-sm text-slate-400 font-bold">
            Showing <span className="text-white">{(page-1)*ITEMS_PER_PAGE + 1}</span> to <span className="text-white">{Math.min(page*ITEMS_PER_PAGE, processedNodes.length)}</span> of <span className="text-purple-400">{processedNodes.length}</span> active storage nodes
          </div>
          <div className="flex items-center gap-4">
            <button 
              disabled={page === 1}
              onClick={() => { setPage(p => p - 1); window.scrollTo({top: 0, behavior: 'smooth'}); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 hover:text-white disabled:opacity-30 disabled:hover:bg-slate-800 transition-all border border-slate-700 text-sm font-black shadow-lg"
            >
              <ChevronLeft size={18} /> Previous
            </button>
            <div className="flex items-center gap-3 px-6 py-2.5 bg-slate-900 rounded-xl border border-slate-800 shadow-inner font-mono text-sm">
              <span className="text-purple-400 font-black">{page}</span>
              <span className="text-slate-700">/</span>
              <span className="text-slate-500">{totalPages || 1}</span>
            </div>
            <button 
              disabled={page === totalPages || totalPages === 0}
              onClick={() => { setPage(p => p + 1); window.scrollTo({top: 0, behavior: 'smooth'}); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 hover:text-white disabled:opacity-30 disabled:hover:bg-slate-800 transition-all border border-slate-700 text-sm font-black shadow-lg"
            >
              Next <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {processedNodes.length === 0 && (
        <div className="text-center py-32 bg-slate-900/50 rounded-[2rem] border-2 border-dashed border-slate-800 animate-fade-in shadow-2xl">
          <div className="bg-slate-800/80 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-slate-700">
            <Filter className="text-slate-600" size={40} />
          </div>
          <h3 className="text-white font-black text-2xl tracking-tight">No pNodes Found</h3>
          <p className="text-slate-500 text-base max-w-sm mx-auto mt-3">We couldn't find any nodes matching your search or filters in the current epoch.</p>
          <button 
            onClick={() => { setSearch(''); setPage(1); }}
            className="mt-8 px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white text-sm font-black rounded-xl transition-all shadow-xl shadow-purple-900/20 active:scale-95"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default PNodeList;
