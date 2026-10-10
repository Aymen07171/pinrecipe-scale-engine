import React, { useState } from 'react';
import { RecipeItem } from '../types/pipeline';
import { 
  Sparkles, 
  ChefHat, 
  Clock, 
  Flame, 
  Copy, 
  Check, 
  Code, 
  FileText, 
  Plus, 
  Trash2,
  RefreshCw,
  Share2,
  BookOpen,
  Download,
  Printer,
  Image as ImageIcon,
  Users,
  Compass,
  ArrowRight
} from 'lucide-react';
import { triggerRecipePrintViaIframe, downloadRecipeHtmlFile } from '../utils/recipePdfGenerator';

interface AIRecipeStudioViewProps {
  currentRecipe: RecipeItem;
  onUpdateRecipe: (updated: RecipeItem) => void;
  onSynthesizeNew: (topic: string, niche: string, dietary: string) => Promise<void>;
  isSynthesizing: boolean;
  onPublishToWp?: (recipeId: string) => Promise<boolean | void>;
}

export const AIRecipeStudioView: React.FC<AIRecipeStudioViewProps> = ({
  currentRecipe,
  onUpdateRecipe,
  onSynthesizeNew,
  isSynthesizing,
  onPublishToWp,
}) => {
  const [topicInput, setTopicInput] = useState('');
  const [nicheInput, setNicheInput] = useState(currentRecipe.themeCategory || currentRecipe.niche || 'French cuisine');
  const [dietaryInput, setDietaryInput] = useState('');
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'editor' | 'article' | 'image_studio' | 'schema' | 'gutenberg'>('editor');
  
  // Thematic Image Studio State
  const [imageStyle, setImageStyle] = useState<'macro' | 'thematic_scene' | 'rustic_bistro'>('thematic_scene');
  const [includeFaces, setIncludeFaces] = useState(true);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const THEME_CATEGORIES = [
    { label: '🇫🇷 French Cuisine', val: 'French cuisine' },
    { label: '🍕 Recycled Pizza', val: 'Recycled pizza' },
    { label: '🦃 Thanksgiving', val: 'Thanksgiving' },
    { label: '⏱️ Quick & Easy Dinners', val: 'Quick & Easy Dinners' },
    { label: '🥩 High-Protein & Keto', val: 'High-Protein & Keto' },
    { label: '🍰 Decadent Desserts', val: 'Decadent Desserts' },
  ];

  const handleCopySchema = () => {
    if (currentRecipe.schemaJsonLd) {
      navigator.clipboard.writeText(JSON.stringify(currentRecipe.schemaJsonLd, null, 2));
      setCopiedSchema(true);
      setTimeout(() => setCopiedSchema(false), 2000);
    }
  };

  const handleRunSynthesis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) return;
    await onSynthesizeNew(topicInput.trim(), nicheInput, dietaryInput);
    setTopicInput('');
  };

  const handleDownloadPdf = () => {
    triggerRecipePrintViaIframe(currentRecipe);
  };

  const handleSaveHtmlFile = () => {
    downloadRecipeHtmlFile(currentRecipe);
  };

  const handleGenerateThematicImage = async () => {
    setIsGeneratingImage(true);
    try {
      const res = await fetch('/api/generate-thematic-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: currentRecipe.title || currentRecipe.topic,
          themeCategory: currentRecipe.themeCategory || currentRecipe.niche,
          imageStyle,
          includePeople: includeFaces
        })
      });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        onUpdateRecipe({
          ...currentRecipe,
          imageUrl: data.imageUrl,
          macroPhotoPrompt: data.prompt || currentRecipe.macroPhotoPrompt
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Ingestion Form */}
      <div className="bg-[#0f172a]/95 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-pink-500/20">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Programmatic Culinary Article & Recipe Studio
              </h2>
              <p className="text-xs text-slate-400">
                Synthesize long-form articles, structured ingredients, Google Schema, and AI catchy images for any category.
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto text-[11px] font-mono text-indigo-400 bg-indigo-950/60 border border-indigo-500/30 px-3 py-1 rounded-full">
            Scale v4.0 Engine
          </span>
        </div>

        {/* Quick Theme Selection Pills */}
        <div className="mb-4">
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Select Category or Theme Object:
          </label>
          <div className="flex flex-wrap gap-2">
            {THEME_CATEGORIES.map((cat) => {
              const isSelected = nicheInput === cat.val;
              return (
                <button
                  key={cat.val}
                  type="button"
                  onClick={() => setNicheInput(cat.val)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-pink-600 to-indigo-600 text-white shadow-md shadow-pink-600/30'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleRunSynthesis} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Recipe Concept / Target Keyword
            </label>
            <input
              type="text"
              placeholder="e.g. Classic French Beef Bourguignon, Recycled Skillet Pizza..."
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Dietary Style / Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Traditional, Gluten-Free, Chef Curated"
              value={dietaryInput}
              onChange={(e) => setDietaryInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="sm:col-span-3 flex items-end">
            <button
              type="submit"
              disabled={isSynthesizing || !topicInput.trim()}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-pink-600 via-rose-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-pink-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSynthesizing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Article & Recipe...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Synthesize with Gemini</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Main Recipe Inspector / Editor */}
      <div className="bg-[#0f172a]/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Sub-Tabs Bar */}
        <div className="border-b border-slate-800 px-5 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveSubTab('editor')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeSubTab === 'editor'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Structured Recipe Card
            </button>
            <button
              onClick={() => setActiveSubTab('article')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeSubTab === 'article'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Long-Form Article</span>
            </button>
            <button
              onClick={() => setActiveSubTab('image_studio')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeSubTab === 'image_studio'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
              <span>AI Catchy Image</span>
            </button>
            <button
              onClick={() => setActiveSubTab('schema')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeSubTab === 'schema'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code className="w-3 h-3 text-emerald-400" />
              <span>Google Schema (JSON-LD)</span>
            </button>
            <button
              onClick={() => setActiveSubTab('gutenberg')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeSubTab === 'gutenberg'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3 h-3 text-indigo-400" />
              <span>Gutenberg HTML</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeSubTab === 'schema' && (
              <button
                onClick={handleCopySchema}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 rounded-md border border-slate-700 transition-colors"
              >
                {copiedSchema ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSchema ? 'Copied!' : 'Copy JSON-LD'}</span>
              </button>
            )}

            <button
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 rounded-lg shadow transition-all"
              title="Download formatted printable PDF recipe card"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Recipe (PDF)</span>
            </button>

            {onPublishToWp && (
              <button
                onClick={() => onPublishToWp(currentRecipe.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/50 rounded-lg transition-colors"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Publish to WordPress</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab 1: Full Recipe Editor */}
        {activeSubTab === 'editor' && (
          <div className="p-6 space-y-6">
            {/* Header Meta */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-[11px] font-bold uppercase">
                    {currentRecipe.themeCategory || currentRecipe.niche || 'Recipe'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    /{currentRecipe.slug}
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    SEO Recipe Title
                  </label>
                  <input
                    type="text"
                    value={currentRecipe.title}
                    onChange={(e) => onUpdateRecipe({ ...currentRecipe, title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm font-semibold text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Meta Description (Google SERP Snippet)
                  </label>
                  <textarea
                    rows={2}
                    value={currentRecipe.metaDescription}
                    onChange={(e) => onUpdateRecipe({ ...currentRecipe, metaDescription: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Photo & Quick Stats */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-20 h-24 rounded-lg overflow-hidden border border-slate-700/60 bg-slate-950 shrink-0 shadow">
                    <img
                      src={currentRecipe.imageUrl}
                      alt={currentRecipe.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="text-slate-400 font-medium">Prep: <span className="text-white font-mono">{currentRecipe.prepTime}</span></div>
                    <div className="text-slate-400 font-medium">Cook: <span className="text-white font-mono">{currentRecipe.cookTime}</span></div>
                    <div className="text-slate-400 font-medium">Yield: <span className="text-white font-mono">{currentRecipe.servings}</span></div>
                    <div className="text-slate-400 font-medium">Energy: <span className="text-amber-400 font-mono">{currentRecipe.calories} kcal</span></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-center pt-3 mt-3 border-t border-slate-800 text-[10px] font-mono">
                  <div className="bg-slate-800/60 rounded p-1">
                    <span className="text-slate-400 block">Protein</span>
                    <span className="text-emerald-400 font-semibold">{currentRecipe.macros.protein}</span>
                  </div>
                  <div className="bg-slate-800/60 rounded p-1">
                    <span className="text-slate-400 block">Carbs</span>
                    <span className="text-indigo-400 font-semibold">{currentRecipe.macros.carbs}</span>
                  </div>
                  <div className="bg-slate-800/60 rounded p-1">
                    <span className="text-slate-400 block">Fat</span>
                    <span className="text-amber-400 font-semibold">{currentRecipe.macros.fat}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ingredients & Cooking Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
              {/* Ingredients List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Structured Ingredients ({currentRecipe.ingredients.length})
                  </h3>
                  <button
                    onClick={() => {
                      const updated = [...currentRecipe.ingredients, { item: 'New Ingredient', amount: '1 unit' }];
                      onUpdateRecipe({ ...currentRecipe, ingredients: updated });
                    }}
                    className="text-[11px] text-pink-400 hover:text-pink-300 inline-flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Row
                  </button>
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {currentRecipe.ingredients.map((ing, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded-lg p-2 text-xs">
                      <input
                        type="text"
                        value={ing.amount}
                        placeholder="Amount"
                        onChange={(e) => {
                          const updated = [...currentRecipe.ingredients];
                          updated[idx].amount = e.target.value;
                          onUpdateRecipe({ ...currentRecipe, ingredients: updated });
                        }}
                        className="w-28 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-pink-300 font-mono text-[11px]"
                      />
                      <input
                        type="text"
                        value={ing.item}
                        placeholder="Item"
                        onChange={(e) => {
                          const updated = [...currentRecipe.ingredients];
                          updated[idx].item = e.target.value;
                          onUpdateRecipe({ ...currentRecipe, ingredients: updated });
                        }}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs"
                      />
                      <button
                        onClick={() => {
                          const updated = currentRecipe.ingredients.filter((_, i) => i !== idx);
                          onUpdateRecipe({ ...currentRecipe, ingredients: updated });
                        }}
                        className="text-slate-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Step-by-Step Method ({currentRecipe.instructions.length} Steps)
                </h3>
                <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                  {currentRecipe.instructions.map((inst, idx) => (
                    <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-pink-400 font-mono text-[11px]">
                          Step {inst.step}. {inst.title}
                        </span>
                        {inst.timerMinutes && (
                          <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                            <Clock className="w-2.5 h-2.5" /> {inst.timerMinutes} min
                          </span>
                        )}
                      </div>
                      <p className="text-slate-300 leading-relaxed text-[11px]">{inst.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chef Tips */}
            <div className="pt-4 border-t border-slate-800">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Chef's Pro Tips
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-400">
                {currentRecipe.chefTips.map((tip, idx) => (
                  <li key={idx} className="bg-slate-900/40 border border-slate-800/80 rounded-lg p-2.5 flex items-start gap-2">
                    <span className="text-pink-400 font-bold">★</span>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Long-Form Article Narrative */}
        {activeSubTab === 'article' && (
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Long-Form Article Narrative & Lore</h3>
                <p className="text-xs text-slate-400">
                  Provides high-ranking search content, culinary science, equipment guide, and storage tips.
                </p>
              </div>
              <span className="text-xs bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 px-2.5 py-1 rounded-full font-mono">
                Markdown / HTML
              </span>
            </div>

            <textarea
              rows={14}
              value={currentRecipe.longArticleContent || `## The Culinary Story of ${currentRecipe.title}\n\nOriginating from classic traditions, this recipe combines deep culinary science with tested techniques for maximum flavor.\n\n### Why This Recipe Works\n* High-heat searing caramelizes sugars for deep savory notes.\n* Gentle simmering marries aromatics seamlessly.\n\n### Essential Kitchen Equipment\n* Heavy Dutch Oven or Cast-Iron Skillet\n* Chef's knife and carving board\n\n### Storage & Reheating\nStore in an airtight container for up to 4 days.`}
              onChange={(e) => onUpdateRecipe({ ...currentRecipe, longArticleContent: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>
        )}

        {/* Tab 3: AI Thematic Image Studio */}
        {activeSubTab === 'image_studio' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">AI Thematic Image Studio</h3>
                <p className="text-xs text-slate-400">
                  Generate catchy, high-converting images matching your recipe and theme with optional dining scene faces.
                </p>
              </div>
              <span className="text-xs bg-pink-950/60 border border-pink-500/30 text-pink-300 px-2.5 py-1 rounded-full font-mono">
                Gemini Vision / Imagen
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Preview Image */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Active High-Res Featured Image
                </label>
                <div className="rounded-xl overflow-hidden border border-slate-800 aspect-[4/3] bg-slate-950 shadow-md relative group">
                  <img
                    src={currentRecipe.imageUrl}
                    alt={currentRecipe.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-xs text-white font-semibold bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700">
                      High-Res 8K Asset
                    </span>
                  </div>
                </div>
              </div>

              {/* Style & Atmosphere Controls */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Atmosphere & Photographic Style:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setImageStyle('thematic_scene')}
                      className={`p-3 rounded-xl border text-left text-xs space-y-1 transition-all ${
                        imageStyle === 'thematic_scene'
                          ? 'bg-indigo-950/50 border-indigo-500 text-white shadow-md'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-pink-400" />
                        Thematic Scene
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Atmospheric dining room, bistro tables, warm family faces in background.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setImageStyle('macro')}
                      className={`p-3 rounded-xl border text-left text-xs space-y-1 transition-all ${
                        imageStyle === 'macro'
                          ? 'bg-indigo-950/50 border-indigo-500 text-white shadow-md'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Gourmet Macro
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Extreme close-up, steam rising, glistening sauce, shallow depth of field.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setImageStyle('rustic_bistro')}
                      className={`p-3 rounded-xl border text-left text-xs space-y-1 transition-all ${
                        imageStyle === 'rustic_bistro'
                          ? 'bg-indigo-950/50 border-indigo-500 text-white shadow-md'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-emerald-400" />
                        Rustic Chef's Table
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Cast-iron skillet, fresh herbs, weathered wood cutting boards.
                      </p>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={includeFaces}
                      onChange={(e) => setIncludeFaces(e.target.checked)}
                      className="rounded accent-pink-600 w-4 h-4"
                    />
                    <span>Include background guests / dining faces where appropriate</span>
                  </label>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Prompt Specification:
                  </label>
                  <textarea
                    rows={3}
                    value={currentRecipe.macroPhotoPrompt}
                    onChange={(e) => onUpdateRecipe({ ...currentRecipe, macroPhotoPrompt: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleGenerateThematicImage}
                  disabled={isGeneratingImage}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-pink-600/30 hover:from-pink-500 hover:to-indigo-500 transition-all disabled:opacity-50"
                >
                  {isGeneratingImage ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generating Catchy Thematic Image...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Thematic Catchy Image</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Google Recipe Schema JSON-LD */}
        {activeSubTab === 'schema' && (
          <div className="p-6">
            <pre className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
              {JSON.stringify(currentRecipe.schemaJsonLd || {}, null, 2)}
            </pre>
          </div>
        )}

        {/* Tab 5: Gutenberg HTML Card */}
        {activeSubTab === 'gutenberg' && (
          <div className="p-6 space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 font-mono text-xs text-slate-300 overflow-x-auto">
              <div className="text-slate-500 mb-2">// Copy into WordPress Custom HTML / Gutenberg Block:</div>
              <code>
{`<!-- wp:heading {"level":2} -->
<h2 class="wp-block-heading">${currentRecipe.title}</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>${currentRecipe.metaDescription}</p>
<!-- /wp:paragraph -->

<div class="pinrecipe-download-banner" style="background:#1e1b4b; color:white; padding:18px 24px; border-radius:12px; margin:24px 0; display:flex; justify-content:space-between; align-items:center;">
  <span>Take this recipe to the kitchen:</span>
  <a href="${currentRecipe.wpPostUrl || '#'}" style="background:#e11d48; color:white; padding:8px 16px; border-radius:6px; text-decoration:none; font-weight:bold;">📥 Download Recipe (PDF)</a>
</div>

<div class="pinrecipe-card" style="border: 2px solid #e2e8f0; border-radius: 14px; padding: 28px; margin: 28px 0; background: white; color: #1e293b;">
  <span style="background:#ffe4e6; color:#e11d48; padding:3px 10px; border-radius:999px; font-size:11px; font-weight:bold; text-transform:uppercase;">${currentRecipe.themeCategory || currentRecipe.niche || 'Recipe'}</span>
  <h3 style="margin: 8px 0 16px;">${currentRecipe.title}</h3>
  <div style="display:grid; grid-template-columns:repeat(4,1fr); background:#f1f5f9; padding:12px; border-radius:8px; text-align:center; font-size:12px; margin-bottom:20px;">
    <div>PREP: <strong>${currentRecipe.prepTime}</strong></div>
    <div>COOK: <strong>${currentRecipe.cookTime}</strong></div>
    <div>YIELD: <strong>${currentRecipe.servings}</strong></div>
    <div>CALORIES: <strong>${currentRecipe.calories} kcal</strong></div>
  </div>
  <h4>Ingredients</h4>
  <ul>
${currentRecipe.ingredients.map(i => `    <li><strong>${i.amount}</strong> ${i.item}</li>`).join('\n')}
  </ul>
  <h4>Step-by-Step Instructions</h4>
  <ol>
${currentRecipe.instructions.map(s => `    <li><strong>${s.title}:</strong> ${s.text}</li>`).join('\n')}
  </ol>
</div>`}
              </code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
