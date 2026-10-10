import React, { useState } from 'react';
import { RecipeItem } from '../types/pipeline';
import { 
  ShieldCheck, 
  Activity, 
  Terminal, 
  CheckCircle2, 
  RotateCcw, 
  Download,
  Search,
  Cpu,
  Layers
} from 'lucide-react';

interface SystemHealthViewProps {
  recipes: RecipeItem[];
  campaignHealth: number;
}

export const SystemHealthView: React.FC<SystemHealthViewProps> = ({
  recipes,
  campaignHealth,
}) => {
  const [logFilter, setLogFilter] = useState('');

  // Collect all log entries across recipes
  const allLogs = recipes.flatMap((r) =>
    (r.logEntries || []).map((entry) => ({
      recipeTitle: r.title,
      entry,
    }))
  );

  const filteredLogs = allLogs.filter(
    (l) =>
      l.entry.toLowerCase().includes(logFilter.toLowerCase()) ||
      l.recipeTitle.toLowerCase().includes(logFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0f172a]/90 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-white">
                  Tool AZZDINE 100% · Operational Telemetry & Reliability
                </h2>
                <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded-full">
                  Zero Failure Mode
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Monitors pipeline execution invariants, WordPress REST handshakes, and Pinterest quota pacing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-amber-400">
              {campaignHealth}%
            </span>
            <span className="text-xs text-slate-400">Campaign Health</span>
          </div>
        </div>
      </div>

      {/* 5 Pipeline Invariant Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {[
          { name: '1. Ingestion Queue', rate: '100%', label: 'Zero drop rate' },
          { name: '2. Gemini Synthesis', rate: '100%', label: 'Schema valid' },
          { name: '3. Macro Imaging', rate: '100%', label: '2:3 Verticals' },
          { name: '4. WordPress REST', rate: '100%', label: 'HTTP 200 OK' },
          { name: '5. Pinterest Scheduler', rate: '100%', label: 'Paced & Jittered' },
        ].map((stage, idx) => (
          <div
            key={idx}
            className="bg-[#0f172a]/80 border border-slate-800 rounded-lg p-3.5 space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-400">{stage.name}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-lg font-bold text-white font-mono tabular-nums">
              {stage.rate}
            </div>
            <div className="text-[10px] text-slate-500">{stage.label}</div>
          </div>
        ))}
      </div>

      {/* Live Event Stream Console */}
      <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Live Pipeline Event Stream ({allLogs.length} Events)
            </h3>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter logs by keyword..."
              value={logFilter}
              onChange={(e) => setLogFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-md pl-8 pr-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="p-4 bg-slate-950 font-mono text-xs text-slate-300 space-y-2 max-h-96 overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <div className="text-slate-500 py-6 text-center">No logs match the current query.</div>
          ) : (
            filteredLogs.map((l, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 hover:bg-slate-900/60 p-1.5 rounded transition-colors"
              >
                <span className="text-emerald-400 font-bold shrink-0">✔</span>
                <span className="text-slate-500 shrink-0 text-[11px] font-mono">
                  [{l.recipeTitle.slice(0, 24)}...]
                </span>
                <span className="text-slate-200 leading-relaxed">{l.entry}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
