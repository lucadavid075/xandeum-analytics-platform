
import React from 'react';

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-800/40 rounded-lg ${className}`} />
);

export const StatCardSkeleton = () => (
  <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 h-[140px] flex flex-col justify-between">
    <div className="flex justify-between items-start">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
    <div className="flex justify-between items-end">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-12" />
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) => (
  <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
    <div className="p-8 border-b border-slate-800 flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-12 w-[400px] rounded-xl" />
    </div>
    <div className="p-4 space-y-4">
      <div className="flex gap-4 mb-8">
        {Array(cols).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array(rows).fill(0).map((_, i) => (
        <div key={i} className="flex gap-4 py-4 border-t border-slate-800/50">
          {Array(cols).fill(0).map((_, j) => (
            <Skeleton key={j} className="h-6 flex-1" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>
    <div className="bg-slate-900 border border-slate-800 rounded-2xl h-[400px] p-8">
       <Skeleton className="h-8 w-48 mb-6" />
       <div className="w-full h-full flex items-center justify-center">
          <Skeleton className="w-64 h-64 rounded-full opacity-20" />
       </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
       <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl h-80">
          <Skeleton className="h-6 w-32 mb-8" />
          <div className="flex justify-center">
            <Skeleton className="h-48 w-48 rounded-full" />
          </div>
       </div>
       <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl lg:col-span-2 h-80">
          <Skeleton className="h-6 w-48 mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-[90%]" />
            <Skeleton className="h-8 w-[95%]" />
            <Skeleton className="h-8 w-[85%]" />
          </div>
       </div>
    </div>
  </div>
);
