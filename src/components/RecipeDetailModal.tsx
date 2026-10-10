import React, { useState } from 'react';
import { RecipeItem } from '../types/pipeline';
import { 
  X, 
  ExternalLink, 
  Clock, 
  Flame, 
  Copy, 
  Check, 
  Code, 
  Globe, 
  Share2, 
  FileText,
  Bookmark,
  Download,
  Printer
} from 'lucide-react';
import { triggerRecipePrintViaIframe, downloadRecipeHtmlFile } from '../utils/recipePdfGenerator';
import { formatRecipeForWpAdminCopy } from '../utils/recipeMasterXml';

interface RecipeDetailModalProps {
  recipe: RecipeItem | null;
  onClose: () => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  onClose,
}) => {
  if (!recipe) return null;

  const [activeTab, setActiveTab] = useState<'recipe' | 'pin' | 'wordpress' | 'schema'>('recipe');
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedWpData, setCopiedWpData] = useState(false);

  const handleCopySchema = () => {
    if (recipe.schemaJsonLd) {
      navigator.clipboard.writeText(JSON.stringify(recipe.schemaJsonLd, null, 2));
      setCopiedSchema(true);
      setTimeout(() => setCopiedSchema(false), 2000);
    }
  };

  const handleCopyWpData = () => {
    navigator.clipboard.writeText(formatRecipeForWpAdminCopy(recipe));
    setCopiedWpData(true);
    setTimeout(() => setCopiedWpData(false), 2000);
  };

  const handleDownloadPdf = () => {
    triggerRecipePrintViaIframe(recipe);
  };

  const handleSaveHtml = () => {
    downloadRecipeHtmlFile(recipe);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="min-w-0 pr-4">
            <span className="text-[11px] font-mono text-pink-400 uppercase tracking-wider font-semibold">
              {recipe.niche} · {recipe.dietary}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white truncate mt-0.5">
              {recipe.title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white text-xs font-semibold shadow transition-all"
              title="Download recipe as a printable PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-5 py-2.5 border-b border-slate-800 bg-slate-900/60 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('recipe')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'recipe' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Culinary Guide & Nutrition
          </button>
          <button
            onClick={() => setActiveTab('pin')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'pin' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-pink-400" />
            <span>Pinterest Pin Preview</span>
          </button>
          <button
            onClick={() => setActiveTab('wordpress')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'wordpress' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>WordPress Gutenberg Block</span>
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'schema' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-indigo-400" />
            <span>Google Schema.org JSON-LD</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6">
          {activeTab === 'recipe' && (
            <div className="space-y-6">
              {/* Hero Banner */}
              <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <div className="w-32 aspect-[2/3] rounded-lg overflow-hidden border border-slate-700 bg-slate-950 shrink-0 shadow-md">
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-2 text-xs flex-1">
                  <p className="text-slate-300 leading-relaxed">{recipe.metaDescription}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-slate-400 font-mono">
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <span className="block text-[10px] text-slate-500">Prep Time</span>
                      <span className="text-white font-semibold">{recipe.prepTime}</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <span className="block text-[10px] text-slate-500">Cook Time</span>
                      <span className="text-white font-semibold">{recipe.cookTime}</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <span className="block text-[10px] text-slate-500">Servings</span>
                      <span className="text-white font-semibold">{recipe.servings}</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <span className="block text-[10px] text-slate-500">Calories</span>
                      <span className="text-amber-400 font-semibold">{recipe.calories} kcal</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ingredients & Steps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Ingredients ({recipe.ingredients.length})
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {recipe.ingredients.map((ing, i) => (
                      <li key={i} className="p-2 bg-slate-900/40 rounded border border-slate-800 flex justify-between">
                        <span className="text-slate-200">{ing.item}</span>
                        <span className="font-mono text-pink-400">{ing.amount}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Instructions ({recipe.instructions.length} Steps)
                  </h3>
                  <div className="space-y-2 text-xs">
                    {recipe.instructions.map((inst, i) => (
                      <div key={i} className="p-2.5 bg-slate-900/40 rounded border border-slate-800 space-y-1">
                        <div className="font-semibold text-pink-400 font-mono text-[11px]">
                          Step {inst.step}. {inst.title}
                        </div>
                        <p className="text-slate-300 leading-relaxed text-[11px]">{inst.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pin' && (
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <div className="w-[260px] aspect-[2/3] rounded-2xl overflow-hidden relative shadow-2xl border border-slate-800 bg-slate-950 shrink-0">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col justify-end text-left">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-pink-400 font-bold mb-1">
                    {recipe.niche}
                  </span>
                  <h4 className="text-base font-bold text-white leading-tight">
                    {recipe.pinterestPin.overlayHeadline || recipe.title}
                  </h4>
                  <div className="mt-2 text-[9px] text-slate-400 font-mono">
                    TASTYSCALEBLOG.COM
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-300 flex-1">
                <div>
                  <span className="text-slate-500 block text-[11px]">Pin Title</span>
                  <p className="text-white font-semibold text-sm mt-0.5">{recipe.pinterestPin.title}</p>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Pin Description</span>
                  <p className="leading-relaxed mt-0.5">{recipe.pinterestPin.description}</p>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Target Board</span>
                  <p className="text-pink-400 font-mono font-medium">{recipe.pinterestPin.board}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {recipe.pinterestPin.hashtags.map((h, i) => (
                    <span key={i} className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wordpress' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-300">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Target: Recipe Section (<code>rcpmst_recipe_comp</code>)</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Category: <strong className="text-pink-300">{recipe.wpCategory || recipe.niche}</strong> · Yield: {recipe.servings}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handleCopyWpData}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
                  >
                    {copiedWpData ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedWpData ? 'Copied Recipe Data!' : 'Copy Recipe Component Data'}</span>
                  </button>
                  <a
                    href="https://foodsprepared.wasmer.app/wp-admin/edit.php?post_type=rcpmst_recipe_comp"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white rounded-lg text-xs font-medium transition-all shadow"
                  >
                    <span>Open WP Recipe Section</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Slug: <code className="text-pink-300 font-mono">/{recipe.slug}</code></span>
                <span className="text-[11px] text-slate-500 font-mono">Post Type: rcpmst_recipe_comp</span>
              </div>
              <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-72">
{`<!-- wp:heading {"level":2} -->
<h2>${recipe.title}</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>${recipe.metaDescription}</p>
<!-- /wp:paragraph -->

<div class="rcpmst-recipe-card">
  <h3>${recipe.title}</h3>
  <p>Prep: ${recipe.prepTime} | Cook: ${recipe.cookTime} | Servings: ${recipe.servings}</p>
  <h4>Ingredients:</h4>
  <ul>
${recipe.ingredients.map(i => `    <li>${typeof i === 'string' ? i : `${i.amount} ${i.item}`}</li>`).join('\n')}
  </ul>
  <h4>Instructions:</h4>
  <ol>
${recipe.instructions.map(s => `    <li><strong>${s.title}:</strong> ${s.text}</li>`).join('\n')}
  </ol>
</div>`}
              </pre>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Google Schema.org/Recipe structured JSON-LD</span>
                <button
                  onClick={handleCopySchema}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 hover:text-white"
                >
                  {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSchema ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-emerald-400 overflow-x-auto">
                {JSON.stringify(recipe.schemaJsonLd || {}, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
