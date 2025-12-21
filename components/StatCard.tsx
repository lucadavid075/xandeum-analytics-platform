
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color?: 'cyan' | 'green' | 'red' | 'purple' | 'yellow';
}

const colorClasses = {
  cyan: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  green: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  red: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  purple: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  yellow: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, color = 'cyan' }) => {
  return (
    <div className={`p-6 rounded-xl border ${colorClasses[color]} transition-all duration-300 hover:scale-[1.02]`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
        <div className={`p-2 rounded-lg ${colorClasses[color]} bg-opacity-20`}>
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-3xl font-bold text-slate-100">{value}</div>
        {trend && <span className="text-xs text-slate-500 mb-1">{trend}</span>}
      </div>
    </div>
  );
};

export default StatCard;
