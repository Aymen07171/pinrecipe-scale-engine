import React, { useState } from 'react';
import { X, Plus, Sparkles, Database, FileSpreadsheet, RefreshCw } from 'lucide-react';
import { NICHE_PRESETS } from '../data/sampleRecipes';

interface IngestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIngestTopics: (topics: Array<{ topic: string; niche: string; dietary: string }>) => void;
}

export const IngestModal: React.FC<IngestModalProps> = ({
  isOpen,
  onClose,
  onIngestTopics,
}) => {
  if (!isOpen) return null;

  const [activeMode, setActiveMode] = useState<'single' | 'bulk' | 'ai_suggest'>('single');
  const [singleTopic, setSingleTopic] = useState('');
  const [singleNiche, setSingleNiche] = useState('French cuisine');
  const [singleDietary, setSingleDietary] = useState('Chef Curated');
  const [bulkText, setBulkText] = useState(
    'Classic French Coq au Vin with Pearl Onions\nGourmet Cast-Iron Recycled Skillet Pizza with Burrata\nShow-Stopping Herb-Roasted Thanksgiving Turkey'
  );
  const [aiNiche, setAiNiche] = useState('French cuisine');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleTopic.trim()) return;
    onIngestTopics([
      { topic: singleTopic.trim(), niche: singleNiche, dietary: singleDietary },
    ]);
    setSingleTopic('');
    onClose();
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = bulkText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    if (lines.length === 0) return;

    const items = lines.map((topic) => ({
      topic,
      niche: singleNiche,
      dietary: 'Standard',
    }));
    onIngestTopics(items);
    onClose();
  };

  const handleFetchAiKeywords = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/generate-keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche: aiNiche, count: 5 }),
      });
      const data = await res.json();
      if (data.keywords) {
        setAiSuggestions(data.keywords);
      }
    } catch {
      // Fallback local list if offline
      setAiSuggestions([
        { topic: `${aiNiche} Herb-Roasted Sheet Pan Chicken`, targetNiche: aiNiche, estimatedVolume: '22.4k/mo', pinPotential: 'Viral' },
        { topic: `Crispy ${aiNiche} Feta & Olive Stuffed Peppers`, targetNiche: aiNiche, estimatedVolume: '14.8k/mo', pinPotential: 'Evergreen' },
        { topic: `Creamy ${aiNiche} Lemon Garlic Orzo Skillet`, targetNiche: aiNiche, estimatedVolume: '31.2k/mo', pinPotential: 'Viral' }
      ]);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Ingest Recipe Campaign Slots</h2>
              <p className="text-xs text-slate-400">Add keywords to the 5-in-1 automated processing pipeline.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="px-5 py-2.5 border-b border-slate-800 bg-slate-900/60 flex items-center gap-1.5">
          <button
            onClick={() => setActiveMode('single')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              activeMode === 'single' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Single Topic
          </button>
          <button
            onClick={() => setActiveMode('bulk')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 ${
              activeMode === 'bulk' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-pink-400" />
            <span>Bulk CSV / Text</span>
          </button>
          <button
            onClick={() => setActiveMode('ai_suggest')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 ${
              activeMode === 'ai_suggest' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Niche Extractor</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {activeMode === 'single' && (
            <form onSubmit={handleSingleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Recipe Topic</label>
                <input
                  type="text"
                  placeholder="e.g. Sourdough Rosemary Focaccia"
                  value={singleTopic}
                  onChange={(e) => setSingleTopic(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Niche Category</label>
                  <select
                    value={singleNiche}
                    onChange={(e) => setSingleNiche(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                  >
                    {NICHE_PRESETS.map((n) => (
                      <option key={n.niche} value={n.niche}>
                        {n.niche}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Dietary Tag</label>
                  <input
                    type="text"
                    value={singleDietary}
                    onChange={(e) => setSingleDietary(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!singleTopic.trim()}
                  className="w-full py-2 bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white rounded-lg text-xs font-medium shadow-md transition-all disabled:opacity-50"
                >
                  Stage into Ingestion Queue
                </button>
              </div>
            </form>
          )}

          {activeMode === 'bulk' && (
            <form onSubmit={handleBulkSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Paste Line-Separated Recipe Topics (or CSV)
                </label>
                <textarea
                  rows={5}
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-pink-500 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white rounded-lg text-xs font-medium shadow-md transition-all"
              >
                Ingest All Lines into Queue
              </button>
            </form>
          )}

          {activeMode === 'ai_suggest' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Target culinary niche..."
                  value={aiNiche}
                  onChange={(e) => setAiNiche(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleFetchAiKeywords}
                  disabled={isGeneratingAi}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors inline-flex items-center gap-1.5"
                >
                  {isGeneratingAi ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>Generate Keywords</span>
                </button>
              </div>

              {aiSuggestions.length > 0 && (
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {aiSuggestions.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/60 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="text-white font-medium">{item.topic}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Vol: {item.estimatedVolume || '15k/mo'} · {item.pinPotential || 'Viral'}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          onIngestTopics([{ topic: item.topic, niche: aiNiche, dietary: 'Standard' }]);
                          onClose();
                        }}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-pink-300 rounded text-[11px] font-medium"
                      >
                        + Add to Queue
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
