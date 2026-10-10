import React from 'react';
import { EngineStats } from '../types/pipeline';

interface MetricsHeaderProps {
  stats: EngineStats;
  onRefresh?: () => void;
}

export const MetricsHeader: React.FC<MetricsHeaderProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* Card 1: CAMPAIGN INGESTION QUEUE */}
      <div className="bg-[#0f172a]/90 border border-slate-800/80 rounded-xl p-4 sm:p-5 relative overflow-hidden group hover:border-slate-700/80 transition-colors shadow-sm">
        <div className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 mb-1">
          CAMPAIGN INGESTION QUEUE
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-mono tabular-nums">
          {stats.queueProcessed} / {stats.queueTotal}
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Processed recipe campaign slots.
        </p>
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Card 2: IMAGES GENERATED */}
      <div className="bg-[#0f172a]/90 border border-slate-800/80 rounded-xl p-4 sm:p-5 relative overflow-hidden group hover:border-slate-700/80 transition-colors shadow-sm">
        <div className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 mb-1">
          IMAGES GENERATED
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-indigo-400 tracking-tight font-mono tabular-nums">
          {stats.imagesGenerated}
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Macro close-ups synthesized by Gemini.
        </p>
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Card 3: WORDPRESS CATEGORIES */}
      <div className="bg-[#0f172a]/90 border border-slate-800/80 rounded-xl p-4 sm:p-5 relative overflow-hidden group hover:border-slate-700/80 transition-colors shadow-sm">
        <div className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 mb-1">
          WORDPRESS CATEGORIES
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-emerald-400 tracking-tight font-mono tabular-nums">
          {stats.wpCategoriesCount}
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Fetched live blog niches available.
        </p>
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Card 4: OVERALL CAMPAIGN HEALTH */}
      <div className="bg-[#0f172a]/90 border border-slate-800/80 rounded-xl p-4 sm:p-5 relative overflow-hidden group hover:border-slate-700/80 transition-colors shadow-sm">
        <div className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 mb-1">
          OVERALL CAMPAIGN HEALTH
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-amber-400 tracking-tight font-mono tabular-nums">
          {stats.campaignHealth}%
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Rate of successful posting operations.
        </p>
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
      </div>
    </div>
  );
};
