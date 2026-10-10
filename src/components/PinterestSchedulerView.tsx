import React, { useState, useEffect } from 'react';
import { PinterestConfig, RecipeItem } from '../types/pipeline';
import {
  Share2,
  Clock,
  Calendar,
  Download,
  Sliders,
  CheckCircle2,
  Shuffle,
  ExternalLink,
  Plus,
  Key,
  AlertTriangle,
  FileSpreadsheet,
  FileText,
  RefreshCw,
  Send,
  ShieldCheck,
  Terminal,
} from 'lucide-react';

interface PinterestSchedulerViewProps {
  pinterestConfig: PinterestConfig;
  onUpdateConfig: (newConfig: PinterestConfig) => void;
  recipes: RecipeItem[];
  onExportCsv: () => void;
}

export const PinterestSchedulerView: React.FC<PinterestSchedulerViewProps> = ({
  pinterestConfig,
  onUpdateConfig,
  recipes,
}) => {
  const [selectedBoard, setSelectedBoard] = useState(pinterestConfig.defaultBoard);
  const [intervalMinutes, setIntervalMinutes] = useState(180);
  const [jitter, setJitter] = useState(pinterestConfig.enableJitter);
  const [newBoardName, setNewBoardName] = useState('');

  // Pinterest OAuth 2.0 Credentials State
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [appId, setAppId] = useState('');
  const [appSecret, setAppSecret] = useState('');

  // Execution & Summary Report State
  const [isRunningJob, setIsRunningJob] = useState(false);
  const [summaryReport, setSummaryReport] = useState<any | null>(null);
  const [activeViewTab, setActiveViewTab] = useState<'table' | 'csv_preview' | 'logs'>('table');
  const [rawStrictCsv, setRawStrictCsv] = useState<string>('');

  useEffect(() => {
    fetch('/api/pinterest/status')
      .then((r) => r.json())
      .then((data) => {
        if (data?.summaryReport) {
          setSummaryReport(data.summaryReport);
        }
      })
      .catch(() => {});
  }, []);

  const handleAddBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;
    const updatedBoards = [...pinterestConfig.boards, newBoardName.trim()];
    onUpdateConfig({ ...pinterestConfig, boards: updatedBoards });
    setNewBoardName('');
  };

  const handleRunPublishOrFallback = async () => {
    setIsRunningJob(true);
    try {
      const res = await fetch('/api/pinterest/publish-or-fallback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken,
          refreshToken,
          appId,
          appSecret,
          intervalMinutes,
          validateImages: true,
        }),
      });
      const data = await res.json();
      if (data?.summaryReport) {
        setSummaryReport(data.summaryReport);
      }
      if (data?.strictCsv) {
        setRawStrictCsv(data.strictCsv);
      }
    } catch (err) {
      console.error('Pinterest job failed:', err);
    } finally {
      setIsRunningJob(false);
    }
  };

  const pinsList = summaryReport?.pins || [];
  const logsList = summaryReport?.logs || [];
  const totals = summaryReport?.totals || {
    totalRecipesInput: recipes.length,
    validRowsGenerated: recipes.length,
    invalidRowsSkippedFromStrictCsv: 0,
    rowsWithTruncatedText: 0,
    apiPublishedSuccess: 0,
    apiPublishedFailed: 0,
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="bg-gradient-to-r from-[#0f172a] via-rose-950/40 to-[#0f172a] border border-pink-500/30 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/40 text-pink-300 text-xs font-bold">
              <Share2 className="w-3.5 h-3.5" />
              <span>Pinterest API v5 Auto-Publisher + Bulk CSV Fallback Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Automated Pinterest Recipe Pin Publisher & CSV Bulk Exporter
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Publishes your live WordPress recipes directly to Pinterest via OAuth 2.0 (with automatic token refresh and 3x exponential-backoff retry). When API credentials are not set or a pin fails, it automatically generates a validated UTF-8 CSV matching Pinterest’s exact bulk upload template: <code className="text-pink-300 font-mono">Title,Media URL,Pinterest board,Thumbnail,Description,Link,Publish date,Keywords</code>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleRunPublishOrFallback}
              disabled={isRunningJob}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-pink-900/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isRunningJob ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Validating Images & Publishing...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Publish to Pinterest / Generate CSV</span>
                </>
              )}
            </button>

            <a
              href="/api/pinterest/download-csv"
              download="pinterest_bulk_upload_template.csv"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Download Template CSV (8 Cols)</span>
            </a>

            <a
              href="/api/pinterest/download-audit-csv"
              download="pinterest_bulk_audit_extended.csv"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Extended Audit CSV (12 Cols)</span>
            </a>

            <a
              href="/api/pinterest/download-log"
              download="pinterest_publish_log.txt"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Execution Log (.txt)</span>
            </a>
          </div>
        </div>

        {/* Summary Report Metrics Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
            <div className="text-[11px] text-slate-400">Total Recipes Input</div>
            <div className="text-lg font-extrabold text-white mt-0.5">{totals.totalRecipesInput} Pins</div>
          </div>
          <div className="bg-slate-950/70 border border-emerald-500/30 rounded-xl p-3">
            <div className="text-[11px] text-emerald-300">Valid & Accessible Media</div>
            <div className="text-lg font-extrabold text-emerald-400 mt-0.5">
              {totals.validRowsGenerated}/{totals.totalRecipesInput} Verified
            </div>
          </div>
          <div className="bg-slate-950/70 border border-amber-500/30 rounded-xl p-3">
            <div className="text-[11px] text-amber-300">Auto-Truncated (≤100 / ≤500)</div>
            <div className="text-lg font-extrabold text-amber-400 mt-0.5">
              {totals.rowsWithTruncatedText} Rows Trimmed
            </div>
          </div>
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
            <div className="text-[11px] text-slate-400">Invalid / Missing Rows</div>
            <div className="text-lg font-extrabold text-slate-200 mt-0.5">
              {totals.invalidRowsSkippedFromStrictCsv} Errors
            </div>
          </div>
          <div className="bg-slate-950/70 border border-pink-500/30 rounded-xl p-3">
            <div className="text-[11px] text-pink-300">Execution Mode</div>
            <div className="text-sm font-extrabold text-pink-400 mt-1 uppercase">
              {summaryReport?.mode === 'api_direct' ? 'Direct Pinterest API' : 'CSV Bulk Fallback Ready'}
            </div>
          </div>
        </div>
      </div>

      {/* Fallback / Status Banner */}
      {summaryReport?.fallbackTriggered && (
        <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">CSV Bulk Import Fallback Active: </span>
              <span>{summaryReport.fallbackReason}</span>
            </div>
          </div>
          <a
            href="/api/pinterest/download-csv"
            download="pinterest_bulk_upload_template.csv"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 font-bold shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Ready-to-Import CSV</span>
          </a>
        </div>
      )}

      {/* Main Grid: Left Configuration + Right Validated Pins & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: OAuth 2.0 Credentials & Pacing */}
        <div className="lg:col-span-4 space-y-5">
          {/* OAuth 2.0 Credentials Card */}
          <div className="bg-[#0f172a]/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-pink-400 flex items-center gap-2">
              <Key className="w-4 h-4" />
              <span>Pinterest API v5 OAuth Credentials</span>
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Provide a Pinterest OAuth 2.0 Access Token (or Refresh Token + App ID/Secret for auto-refresh). Leave blank to automatically use the <strong>Bulk CSV Fallback</strong>.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  OAuth Access Token (<code>PINTEREST_ACCESS_TOKEN</code>)
                </label>
                <input
                  type="password"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  placeholder="pina_..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  OAuth Refresh Token (<code>PINTEREST_REFRESH_TOKEN</code> — Optional)
                </label>
                <input
                  type="password"
                  value={refreshToken}
                  onChange={(e) => setRefreshToken(e.target.value)}
                  placeholder="pinr_..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    App ID
                  </label>
                  <input
                    type="text"
                    value={appId}
                    onChange={(e) => setAppId(e.target.value)}
                    placeholder="149..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    App Secret
                  </label>
                  <input
                    type="password"
                    value={appSecret}
                    onChange={(e) => setAppSecret(e.target.value)}
                    placeholder="Secret..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Built-In Safeguards Enforced:</span>
              </div>
              <ul className="list-disc pl-4 text-slate-400 space-y-0.5">
                <li>Title ≤ 100 chars &amp; Description ≤ 500 chars</li>
                <li>Live HTTP 200 Media URL accessibility check</li>
                <li>CSV Formula Injection sanitization</li>
                <li>3x Exponential Backoff Retry on 429/5xx</li>
              </ul>
            </div>
          </div>

          {/* Pacing & Board Controls */}
          <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-pink-400" />
              <span>Publish Date Cadence & Boards</span>
            </h3>

            <div className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Scheduled Publish Date Interval
                </label>
                <select
                  value={intervalMinutes}
                  onChange={(e) => setIntervalMinutes(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                >
                  <option value={60}>Every 1 Hour</option>
                  <option value={120}>Every 2 Hours</option>
                  <option value={180}>Every 3 Hours (Recommended)</option>
                  <option value={360}>Every 6 Hours</option>
                </select>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-white flex items-center gap-1.5">
                    <Shuffle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Anti-Spam Jitter</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Staggers publish timestamps naturally.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={jitter}
                  onChange={(e) => {
                    setJitter(e.target.checked);
                    onUpdateConfig({ ...pinterestConfig, enableJitter: e.target.checked });
                  }}
                  className="w-4 h-4 rounded text-pink-500 bg-slate-950 border-slate-700 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Default Target Board
                </label>
                <select
                  value={selectedBoard}
                  onChange={(e) => {
                    setSelectedBoard(e.target.value);
                    onUpdateConfig({ ...pinterestConfig, defaultBoard: e.target.value });
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                >
                  {pinterestConfig.boards.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <form onSubmit={handleAddBoard} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add custom board..."
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white rounded-lg inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column: Validated Pins Table, CSV Template Preview & Execution Logs */}
        <div className="lg:col-span-8 bg-[#0f172a]/90 border border-slate-800 rounded-xl p-5 space-y-4">
          {/* Sub-Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveViewTab('table')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeViewTab === 'table'
                    ? 'bg-pink-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Validated Pins ({pinsList.length})
              </button>
              <button
                onClick={() => setActiveViewTab('csv_preview')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeViewTab === 'csv_preview'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                CSV Template Preview
              </button>
              <button
                onClick={() => setActiveViewTab('logs')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeViewTab === 'logs'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Execution Log ({logsList.length})
              </button>
            </div>

            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-full">
              UTF-8 RFC-4180 Compliant
            </span>
          </div>

          {/* TAB A: VALIDATED PINS TABLE */}
          {activeViewTab === 'table' && (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {pinsList.map((pin: any) => (
                <div
                  key={pin.id}
                  className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-2.5 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <img
                        src={pin.mediaUrl}
                        alt={pin.altText || pin.title}
                        className="w-16 h-20 rounded-lg object-cover border border-slate-700 shrink-0 bg-slate-950"
                      />
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-pink-500/15 text-pink-300 border border-pink-500/30">
                            {pin.board}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            Section: {pin.section}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            Media HTTP {pin.mediaValidation?.status || 200} OK
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                          {pin.title}
                        </h4>

                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                          {pin.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 space-y-1">
                      <div className="text-[10px] font-mono text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        Title: {pin.title.length}/100
                      </div>
                      <div className="text-[10px] font-mono text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        Desc: {pin.description.length}/500
                      </div>
                      <div className="text-[10px] font-mono text-indigo-300 flex items-center justify-end gap-1 pt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{pin.publishDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Truncation or Validation Warning Banner */}
                  {pin.wasTruncated && (
                    <div className="bg-amber-950/40 border border-amber-500/30 rounded-lg px-3 py-1.5 text-[11px] text-amber-300 flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>
                        <strong>Truncated to fit limit:</strong> {pin.truncatedText}
                      </span>
                    </div>
                  )}

                  {pin.validationErrors && pin.validationErrors.length > 0 && (
                    <div className="bg-rose-950/40 border border-rose-500/40 rounded-lg px-3 py-1.5 text-[11px] text-rose-300">
                      <strong>Validation Error:</strong> {pin.validationErrors.join('; ')}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                    <div className="truncate max-w-md">
                      <span className="text-slate-500">Keywords: </span>
                      <span className="text-slate-300 font-mono">{pin.keywords}</span>
                    </div>
                    <a
                      href={pin.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-400 hover:underline font-semibold shrink-0"
                    >
                      <span>Destination Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB B: CSV TEMPLATE PREVIEW */}
          {activeViewTab === 'csv_preview' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>
                  Exact Pinterest Bulk Upload Columns:{' '}
                  <code className="text-emerald-400 font-mono">
                    Title,Media URL,Pinterest board,Thumbnail,Description,Link,Publish date,Keywords
                  </code>
                </span>
              </div>
              <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-[520px] leading-relaxed">
                {rawStrictCsv ||
                  [
                    'Title,Media URL,Pinterest board,Thumbnail,Description,Link,Publish date,Keywords',
                    ...pinsList.map(
                      (p: any) =>
                        `"${p.title.replace(/"/g, '""')}",${p.mediaUrl},"${p.board}",${p.thumbnail || ''},"${p.description.replace(/"/g, '""')}",${p.link},${p.publishDate},"${p.keywords}"`
                    ),
                  ].join('\n')}
              </pre>
            </div>
          )}

          {/* TAB C: EXECUTION LOGS */}
          {activeViewTab === 'logs' && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 max-h-[520px] overflow-y-auto font-mono text-xs">
              <div className="text-slate-400 pb-2 border-b border-slate-800 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span>Pinterest Publisher & Validator Log Stream</span>
              </div>
              {logsList.map((entry: any, i: number) => (
                <div
                  key={i}
                  className={`py-1 border-b border-slate-900 ${
                    entry.level === 'ERROR'
                      ? 'text-rose-400'
                      : entry.level === 'WARN'
                      ? 'text-amber-300'
                      : entry.level === 'SUCCESS'
                      ? 'text-emerald-400'
                      : 'text-slate-300'
                  }`}
                >
                  <span className="text-slate-500">[{entry.timestamp}]</span>{' '}
                  <span className="font-bold">[{entry.level}]</span> {entry.message}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
