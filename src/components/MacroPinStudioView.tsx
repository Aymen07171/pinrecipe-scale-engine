import React, { useState } from 'react';
import { RecipeItem } from '../types/pipeline';
import { 
  Camera, 
  Share2, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Layers, 
  Type, 
  Palette,
  ExternalLink,
  Bookmark
} from 'lucide-react';

interface MacroPinStudioViewProps {
  currentRecipe: RecipeItem;
  allRecipes: RecipeItem[];
  onSelectRecipe: (recipe: RecipeItem) => void;
  onUpdateRecipe: (recipe: RecipeItem) => void;
}

export const MacroPinStudioView: React.FC<MacroPinStudioViewProps> = ({
  currentRecipe,
  allRecipes,
  onSelectRecipe,
  onUpdateRecipe,
}) => {
  const [overlayHeadline, setOverlayHeadline] = useState(
    currentRecipe.pinterestPin.overlayHeadline || currentRecipe.title
  );
  const [watermark, setWatermark] = useState('TASTYSCALEBLOG.COM');
  const [badgeText, setBadgeText] = useState(`${currentRecipe.totalTime} · ${currentRecipe.calories} kcal`);
  const [overlayTheme, setOverlayTheme] = useState<'scrim' | 'ribbon' | 'card' | 'minimal'>('scrim');
  const [copiedPinCopy, setCopiedPinCopy] = useState(false);

  const handleCopyPinCopy = () => {
    const text = `${currentRecipe.pinterestPin.title}\n\n${currentRecipe.pinterestPin.description}\n\n${currentRecipe.pinterestPin.hashtags.join(' ')}\n\nLink: ${currentRecipe.wpPostUrl || 'https://myculinaryblog.com'}`;
    navigator.clipboard.writeText(text);
    setCopiedPinCopy(true);
    setTimeout(() => setCopiedPinCopy(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="bg-[#0f172a]/90 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">
                Macro Food Photography & Pinterest Pin Studio
              </h2>
              <p className="text-xs text-slate-400">
                Synthesize high-converting 2:3 vertical visual assets and programmatic Pinterest pins.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyPinCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              {copiedPinCopy ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPinCopy ? 'Copied!' : 'Copy Pin Copy'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Workspace: Left Canvas Preview, Right Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 2:3 Vertical Pinterest Pin Canvas */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="text-xs font-medium text-slate-400 mb-2 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-pink-400" />
            <span>Pinterest 2:3 Vertical Canvas (1000 × 1500)</span>
          </div>

          {/* Interactive Pin Graphic Mockup */}
          <div className="w-[300px] sm:w-[340px] aspect-[2/3] rounded-2xl overflow-hidden relative shadow-2xl border border-slate-800 bg-slate-950 flex flex-col justify-between group">
            {/* Background Macro Image */}
            <img
              src={currentRecipe.imageUrl}
              alt={currentRecipe.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />

            {/* Top Bar with Save Button and Badge */}
            <div className="relative z-10 p-4 flex items-center justify-between">
              <span className="bg-black/60 backdrop-blur-md text-white font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/10 shadow-sm">
                {badgeText}
              </span>
              <div className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-lg transition-transform hover:scale-105 cursor-pointer">
                <Bookmark className="w-3 h-3 fill-current" />
                <span>Save</span>
              </div>
            </div>

            {/* Middle/Bottom Overlay Based on Theme */}
            {overlayTheme === 'scrim' && (
              <div className="relative z-10 p-5 pt-12 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col justify-end text-left">
                <p className="text-[10px] uppercase font-mono tracking-widest text-pink-400 font-bold mb-1">
                  {currentRecipe.niche}
                </p>
                <h3 className="text-xl font-extrabold text-white leading-tight drop-shadow-md">
                  {overlayHeadline}
                </h3>
                <div className="mt-3 pt-2.5 border-t border-white/20 flex items-center justify-between text-[10px] text-white/80 font-mono">
                  <span>{watermark}</span>
                  <span className="text-pink-300 font-bold">Tap for Full Recipe →</span>
                </div>
              </div>
            )}

            {overlayTheme === 'ribbon' && (
              <div className="relative z-10 p-4 m-3 rounded-xl bg-slate-950/90 backdrop-blur-md border border-white/20 shadow-xl">
                <p className="text-[10px] font-mono text-amber-400 font-bold uppercase mb-1">
                  Tested Chef Recipe
                </p>
                <h3 className="text-lg font-black text-white leading-snug">
                  {overlayHeadline}
                </h3>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{watermark}</span>
                  <span className="text-emerald-400">{currentRecipe.totalTime}</span>
                </div>
              </div>
            )}

            {overlayTheme === 'card' && (
              <div className="relative z-10 p-4 bg-white/95 text-slate-900 m-3 rounded-xl shadow-2xl">
                <span className="text-[10px] font-mono font-bold tracking-wider text-pink-600 uppercase">
                  {currentRecipe.niche}
                </span>
                <h3 className="text-base font-bold text-slate-900 leading-tight mt-0.5">
                  {overlayHeadline}
                </h3>
                <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-600 font-mono">
                  <span>{watermark}</span>
                  <span className="font-bold text-red-600">GET THE RECIPE</span>
                </div>
              </div>
            )}

            {overlayTheme === 'minimal' && (
              <div className="relative z-10 p-4 bg-black/40 backdrop-blur-xs flex items-center justify-between text-white text-[11px] font-mono">
                <span className="font-bold truncate max-w-[200px]">{overlayHeadline}</span>
                <span className="text-pink-300 font-bold">SAVE</span>
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-[11px] text-slate-500">Live 2:3 aspect ratio rendering</span>
          </div>
        </div>

        {/* Right: Controls, Macro Photo Prompt, and Pinterest Metadata */}
        <div className="lg:col-span-7 space-y-5">
          {/* Visual Asset Selector */}
          <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <Camera className="w-3.5 h-3.5 text-pink-400" />
              <span>Synthesized Macro Food Visuals</span>
            </h3>
            <div className="grid grid-cols-4 gap-2.5">
              {allRecipes.map((r) => (
                <div
                  key={r.id}
                  onClick={() => {
                    onSelectRecipe(r);
                    setOverlayHeadline(r.pinterestPin.overlayHeadline || r.title);
                  }}
                  className={`aspect-[2/3] rounded-lg overflow-hidden border cursor-pointer relative group transition-all ${
                    currentRecipe.id === r.id
                      ? 'border-pink-500 ring-2 ring-pink-500/40 shadow-lg'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={r.imageUrl}
                    alt={r.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-1.5 flex flex-col justify-end">
                    <span className="text-[9px] text-white font-medium truncate">{r.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overlay Customizer */}
          <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Palette className="w-3.5 h-3.5 text-indigo-400" />
              <span>Overlay Customizer</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Pin Overlay Headline
                </label>
                <input
                  type="text"
                  value={overlayHeadline}
                  onChange={(e) => setOverlayHeadline(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Brand Watermark / Domain
                </label>
                <input
                  type="text"
                  value={watermark}
                  onChange={(e) => setWatermark(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-pink-500 font-mono"
                />
              </div>
            </div>

            {/* Template Selector */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                Pin Layout Style
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['scrim', 'ribbon', 'card', 'minimal'] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => setOverlayTheme(style)}
                    className={`py-1.5 text-xs font-medium rounded-lg capitalize border transition-colors ${
                      overlayTheme === style
                        ? 'bg-slate-800 border-pink-500/80 text-white shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Macro Photography Prompt */}
          <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Macro Photo Prompt (Gemini Synthesizer)</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-500">2:3 Vertical Ratio</span>
            </div>
            <textarea
              rows={3}
              value={currentRecipe.macroPhotoPrompt}
              onChange={(e) =>
                onUpdateRecipe({ ...currentRecipe, macroPhotoPrompt: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 font-mono leading-relaxed focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Pinterest Metadata Box */}
          <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Share2 className="w-3.5 h-3.5 text-pink-400" />
              <span>Pinterest Copy & Scheduling Payload</span>
            </h3>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Pin Title (High Click-Through)
              </label>
              <input
                type="text"
                value={currentRecipe.pinterestPin.title}
                onChange={(e) => {
                  const updated = {
                    ...currentRecipe,
                    pinterestPin: { ...currentRecipe.pinterestPin, title: e.target.value },
                  };
                  onUpdateRecipe(updated);
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Pin Description with Rich Sensory Hooks
              </label>
              <textarea
                rows={2}
                value={currentRecipe.pinterestPin.description}
                onChange={(e) => {
                  const updated = {
                    ...currentRecipe,
                    pinterestPin: { ...currentRecipe.pinterestPin, description: e.target.value },
                  };
                  onUpdateRecipe(updated);
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {currentRecipe.pinterestPin.hashtags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[11px] font-mono text-pink-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
