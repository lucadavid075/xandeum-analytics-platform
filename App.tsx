
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import IpNodeList from './components/IpNodeList';
import PNodeList from './components/PNodeList';
import AiInsights from './components/AiInsights';
import FAQ from './components/FAQ';
import { fetchNodeData, fetchMilestoneInfo } from './services/nodeService';
import { ApiResponse, MilestoneInfo } from './types';
import { RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [milestone, setMilestone] = useState<MilestoneInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isAiOpen, setIsAiOpen] = useState(false);

  const loadData = async (isBackground = false) => {
    if (isBackground) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const [result, milestoneInfo] = await Promise.all([
        fetchNodeData(),
        fetchMilestoneInfo()
      ]);
      setData(result);
      setMilestone(milestoneInfo);
      setLastUpdated(new Date());
      setError(null);
    } catch (err: any) {
      if (!isBackground) {
        setError(err.message || 'Failed to fetch data');
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData(false);
    const interval = setInterval(() => loadData(true), 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-slate-950 text-slate-200 font-sans">
        {/* Fixed: Removed milestone prop from Sidebar as its props definition doesn't include it */}
        <Sidebar onAiToggle={() => setIsAiOpen(true)} />
        
        <AiInsights data={data} isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />

        <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-medium text-slate-400">Network Overview</h2>
              <div className="flex items-center gap-4">
                 {lastUpdated && (
                   <span className="text-xs text-slate-500">
                     Updated: {lastUpdated.toLocaleTimeString()}
                   </span>
                 )}
                 <button 
                  onClick={() => loadData(true)}
                  disabled={loading || isRefreshing}
                  className="p-2 bg-slate-800 rounded-full hover:bg-teal-500/20 hover:text-teal-400 transition-all disabled:opacity-50"
                  title="Refresh Data"
                 >
                   <RefreshCw size={18} className={loading || isRefreshing ? 'animate-spin' : ''} />
                 </button>
              </div>
            </div>

            <Routes>
              <Route path="/" element={<Dashboard data={data} loading={loading} error={error} milestone={milestone} />} />
              {/* Fixed: Removed milestone prop from IpNodeList as its props definition doesn't include it */}
              <Route path="/ip-nodes" element={<IpNodeList data={data} loading={loading} />} />
              <Route path="/pnodes" element={<PNodeList data={data} loading={loading} />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
