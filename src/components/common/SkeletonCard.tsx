import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden animate-pulse flex flex-col justify-between">
      <div>
        <div className="bg-slate-200 h-48 sm:h-52 w-full"></div>
        <div className="p-4 space-y-3">
          <div className="flex justify-between">
            <div className="h-3 bg-slate-200 rounded w-16"></div>
            <div className="h-3 bg-slate-200 rounded w-12"></div>
          </div>
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          <div className="flex gap-2 pt-2">
            <div className="h-4 bg-slate-200 rounded w-12"></div>
            <div className="h-4 bg-slate-200 rounded w-16"></div>
          </div>
        </div>
      </div>
      <div className="p-4 pt-0">
        <div className="h-6 bg-slate-200 rounded w-20 mb-3"></div>
        <div className="h-9 bg-slate-200 rounded w-full"></div>
      </div>
    </div>
  );
};
