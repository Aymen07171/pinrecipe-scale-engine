import React, { useState } from 'react';
import { WordPressConfig, RecipeItem } from '../types/pipeline';
import { 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink, 
  Layers, 
  Key, 
  Server,
  FolderTree,
  Send,
  Copy,
  Check,
  Code,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Download,
  BookOpen,
  Printer,
  FileText,
  X,
  FileCode,
  Plus,
  Clock,
  Flame,
  ChefHat
} from 'lucide-react';
import { downloadRecipeMasterXmlFile, formatRecipeForWpAdminCopy } from '../utils/recipeMasterXml';
import { triggerRecipePrintViaIframe, downloadRecipeHtmlFile } from '../utils/recipePdfGenerator';

interface WordPressSyncViewProps {
  wpConfig: WordPressConfig;
  onUpdateConfig: (newConfig: WordPressConfig) => void;
  recipes: RecipeItem[];
  onPublishRecipeToWp: (recipeId: string) => Promise<boolean | void>;
  onSyncAllToWp?: () => Promise<void>;
  isSyncing?: boolean;
}

export const WordPressSyncView: React.FC<WordPressSyncViewProps> = ({
  wpConfig,
  onUpdateConfig,
  recipes,
  onPublishRecipeToWp,
  onSyncAllToWp,
  isSyncing = false,
}) => {
  const [urlInput, setUrlInput] = useState(wpConfig.url || 'https://foodsprepared.wasmer.app');
  const [syncApiKeyInput, setSyncApiKeyInput] = useState(wpConfig.syncApiKey || '');
  const [usernameInput, setUsernameInput] = useState(wpConfig.username || 'elattarayman1@gmail.com');
  const [appPasswordInput, setAppPasswordInput] = useState(wpConfig.appPassword || '');
  const [authMethod, setAuthMethod] = useState<'autosync' | 'app_password'>('autosync');
  const [statusSelect, setStatusSelect] = useState<'draft' | 'publish' | 'pending'>(wpConfig.defaultStatus || 'publish');
  
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ 
    success: boolean; 
    message: string; 
    pingMs?: number; 
    pluginActive?: boolean;
    authValid?: boolean;
  } | null>(null);

  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string; link?: string } | null>(null);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [showPayloadModal, setShowPayloadModal] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [copiedRecipeId, setCopiedRecipeId] = useState<string | null>(null);

  // In-App Article Reader & PDF Modal
  const [previewRecipe, setPreviewRecipe] = useState<RecipeItem | null>(null);

  const webhookUrl = `${urlInput.replace(/\/$/, '')}/wp-json/autosync/v1/import`;
  const wpRecipeSectionUrl = `${urlInput.replace(/\/$/, '')}/wp-admin/edit.php?post_type=rcpmst_recipe_comp`;
  const wpNewRecipeUrl = `${urlInput.replace(/\/$/, '')}/wp-admin/post-new.php?post_type=rcpmst_recipe_comp`;

  const handleTestConnection = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/test-wordpress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: urlInput, 
          apiKey: syncApiKeyInput,
          username: usernameInput,
          appPassword: appPasswordInput
        }),
      });
      const data = await res.json();

      if (res.ok && data.connected) {
        onUpdateConfig({
          ...wpConfig,
          url: urlInput,
          syncApiKey: syncApiKeyInput,
          username: usernameInput,
          appPassword: appPasswordInput,
          defaultStatus: statusSelect,
          isConnected: true,
          activeCategories: data.categories || wpConfig.activeCategories,
          lastSyncTime: new Date().toLocaleTimeString(),
        });

        let msg = `WordPress connected (${data.pingMs}ms latency).`;
        if (data.pluginActive) {
          msg += data.authValid 
            ? ' AutoSync plugin verified & authenticated!' 
            : ' AutoSync plugin detected! ' + (data.authMessage || 'Please verify API key.');
        }

        setTestResult({
          success: true,
          message: msg,
          pingMs: data.pingMs,
          pluginActive: data.pluginActive,
          authValid: data.authValid,
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || 'Failed to verify connection to WordPress.',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Network error while testing connection.',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSaveSettings = () => {
    onUpdateConfig({
      ...wpConfig,
      url: urlInput,
      syncApiKey: syncApiKeyInput,
      username: usernameInput,
      appPassword: appPasswordInput,
      defaultStatus: statusSelect,
    });
    setSyncMessage({
      type: 'info',
      text: 'Settings saved! Target post type is set to rcpmst_recipe_comp.',
    });
    setTimeout(() => setSyncMessage(null), 3500);
  };

  const handleCopyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  const handlePublishSingle = async (recipeId: string) => {
    setSyncingId(recipeId);
    setSyncMessage(null);
    try {
      await onPublishRecipeToWp(recipeId);
      const recipe = recipes.find(r => r.id === recipeId);
      setSyncMessage({
        type: 'success',
        text: `Successfully synced "${recipe?.title || 'Article'}" to Recipe Section (rcpmst_recipe_comp)!`,
        link: wpRecipeSectionUrl
      });
    } catch (err: any) {
      setSyncMessage({
        type: 'error',
        text: err.message || 'Failed to sync recipe. You can also use the 1-Click XML Import below!',
        link: wpRecipeSectionUrl
      });
    } finally {
      setSyncingId(null);
    }
  };

  const handleCopyRecipeComponent = (recipe: RecipeItem) => {
    const text = formatRecipeForWpAdminCopy(recipe);
    navigator.clipboard.writeText(text);
    setCopiedRecipeId(recipe.id);
    setTimeout(() => setCopiedRecipeId(null), 2500);
  };

  const handleExportXml = () => {
    downloadRecipeMasterXmlFile(recipes);
    setSyncMessage({
      type: 'success',
      text: `Downloaded WXR XML with ${recipes.length} recipes! Import it in WP Admin → Tools → Import → WordPress.`,
      link: wpRecipeSectionUrl
    });
  };

  // Sample payload formatted for the Auto_Sync_API plugin
  const samplePayload = {
    articles: recipes.slice(0, 2).map((r) => ({
      title: r.title,
      content: `<p>${r.metaDescription}</p>`,
      external_id: r.id,
      post_type: 'rcpmst_recipe_comp',
      status: wpConfig.defaultStatus || 'publish',
      slug: r.slug,
      categories: [r.niche, 'Recipes'],
      tags: [r.focusKeyword, ...(r.pinterestPin?.hashtags?.map((h) => h.replace('#', '')) || [])],
      rcpmst_recipe_type: [r.niche],
      rcpmst_selection: ['Chef Curated'],
      rcpmst_dietary_notes: [r.dietary],
      quantity: parseInt(r.servings) || 4,
      unit: 'Portion',
      recipe: {
        title: r.title,
        prep_time: r.prepTime,
        cook_time: r.cookTime,
        servings: r.servings,
        calories: r.calories.toString(),
        cuisine: r.schemaJsonLd?.recipeCuisine || 'General',
        ingredients: r.ingredients.map((i) => `${i.amount} ${i.item}`),
        instructions: r.instructions.map((s) => `${s.step}. ${s.title}: ${s.text}`),
        notes: r.chefTips.join(' | ')
      },
      featured_image: r.imageUrl
    }))
  };

  const publishedRecipes = recipes.filter((r) => r.wpStatus === 'published');
  const readyToSyncRecipes = recipes.filter((r) => r.wpStatus !== 'published');

  return (
    <div className="space-y-6">
      {/* Troubleshooting Notice for Importer / Password / Posts */}
      <div className="bg-amber-950/30 border border-amber-500/40 rounded-2xl p-4 text-xs text-amber-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-amber-100 text-sm">PinRecipe Password & WXR Importer Guide</div>
            <p className="leading-relaxed">
              <strong>PinRecipe Password:</strong> <code className="bg-amber-900/60 px-1.5 py-0.5 rounded text-amber-200 font-mono">yWEP 5How u0iV e5M5 7tQ9 KrNQ</code> is configured as your Application Password / Sync Key.
              <br />
              <strong>"The wordpress importer is invalid or is not installed":</strong> This occurs when WordPress lacks the importer plugin. Bypass this by using the <strong>1-Click Sync / Publish</strong> buttons below, or install the WordPress Importer in WP Admin → Tools → Import.
              <br />
              <strong>"No post found":</strong> If a permalink shows 404, use the built-in <strong>Full Article & PDF Reader</strong> or verify posts are published in your custom post type list (<code className="font-mono text-amber-300">rcpmst_recipe_comp</code>).
            </p>
          </div>
        </div>
      </div>
      {/* Target Section Highlight Banner: Recipe Section (rcpmst_recipe_comp) */}
      <div className="bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-indigo-950/40 border border-rose-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/20 shrink-0">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  WordPress Recipe Section Hub (<code className="text-pink-300 font-mono text-sm">rcpmst_recipe_comp</code>)
                </h2>
                <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-500/50 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Target: Recipe Master Component
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Direct integration with your WordPress Recipe section at{' '}
                <a
                  href={wpRecipeSectionUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-pink-300 font-mono underline hover:text-white"
                >
                  foodsprepared.wasmer.app/wp-admin/edit.php?post_type=rcpmst_recipe_comp
                </a>
                . All articles include structured ingredients, step-by-step instructions, chef tips, nutrition cards, and downloadable PDF links.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleExportXml}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
              title="Download full WordPress WXR XML export to import into Recipe Master"
            >
              <Download className="w-4 h-4" />
              <span>Download 1-Click WXR XML ({recipes.length})</span>
            </button>

            <a
              href={wpRecipeSectionUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              <span>Open WP Recipe Section</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {onSyncAllToWp && (
              <button
                onClick={onSyncAllToWp}
                disabled={isSyncing}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md transition-all disabled:opacity-50"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Syncing Queue...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Sync All Articles Now</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* 10-Second XML Import Instructions */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-4 gap-3 text-[11px] text-slate-300">
          <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
            <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 font-bold flex items-center justify-center shrink-0">1</span>
            <span>Click <strong>Download 1-Click WXR XML</strong></span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
            <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 font-bold flex items-center justify-center shrink-0">2</span>
            <span>Go to WP Admin → <strong>Tools → Import</strong></span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
            <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 font-bold flex items-center justify-center shrink-0">3</span>
            <span>Upload the XML file & click <strong>Import</strong></span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60 text-emerald-300">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">4</span>
            <span>Recipes appear in <strong>Recipe Section</strong>!</span>
          </div>
        </div>
      </div>

      {/* Sync Status Alert Message */}
      {syncMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs animate-in fade-in ${
            syncMessage.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : syncMessage.type === 'error'
              ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
              : 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {syncMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : syncMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
            )}
            <span>{syncMessage.text}</span>
          </div>
          {syncMessage.link && (
            <a
              href={syncMessage.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold underline hover:text-white px-2 py-1 rounded bg-black/20"
            >
              <span>View in WP Recipe Section</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {/* Main Grid: Settings & Webhook on Left, Live Articles on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Plugin Credentials & Ingestion URL */}
        <div className="lg:col-span-5 space-y-5">
          {/* Plugin Setup Card */}
          <div className="bg-[#0f172a]/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Server className="w-3.5 h-3.5 text-rose-400" />
                <span>WordPress Connection Credentials</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowPayloadModal(true)}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
              >
                <Code className="w-3 h-3" />
                <span>View Schema JSON</span>
              </button>
            </div>

            {/* Auth Method Selector */}
            <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setAuthMethod('autosync')}
                className={`flex-1 py-1 px-2 rounded-md font-medium transition-colors ${
                  authMethod === 'autosync' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                AutoSync Secret Key
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('app_password')}
                className={`flex-1 py-1 px-2 rounded-md font-medium transition-colors ${
                  authMethod === 'app_password' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                WP Application Password
              </button>
            </div>

            <form onSubmit={handleTestConnection} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  WordPress Site Domain URL
                </label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://foodsprepared.wasmer.app"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>

              {authMethod === 'autosync' ? (
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center justify-between">
                    <span>AutoSync Plugin API Key (<code>x-sync-key</code>)</span>
                    <a
                      href="https://foodsprepared.wasmer.app/wp-admin/admin.php?page=autosync-settings"
                      target="_blank"
                      rel="noreferrer"
                      className="text-rose-400 hover:text-rose-300 font-normal"
                    >
                      Get Key from WP Admin →
                    </a>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={syncApiKeyInput}
                      onChange={(e) => setSyncApiKeyInput(e.target.value)}
                      placeholder="e.g. 32-character key from AutoSync settings"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-3 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 font-mono"
                    />
                    <Key className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      WordPress Username
                    </label>
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      placeholder="admin"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center justify-between">
                      <span>Application Password</span>
                      <a
                        href="https://foodsprepared.wasmer.app/wp-admin/profile.php"
                        target="_blank"
                        rel="noreferrer"
                        className="text-rose-400 hover:text-rose-300 font-normal"
                      >
                        Create in Profile →
                      </a>
                    </label>
                    <input
                      type="password"
                      value={appPasswordInput}
                      onChange={(e) => setAppPasswordInput(e.target.value)}
                      placeholder="xxxx xxxx xxxx xxxx"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Default Post Status
                  </label>
                  <select
                    value={statusSelect}
                    onChange={(e) => setStatusSelect(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="publish">Publish Live Instantly</option>
                    <option value="draft">Draft (Safe Review)</option>
                    <option value="pending">Pending Review</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Target Post Type
                  </label>
                  <div className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-[11px] font-mono text-pink-300 truncate">
                    rcpmst_recipe_comp
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  disabled={testing}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md transition-all disabled:opacity-50"
                >
                  {testing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Testing Endpoint...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Test & Save Connection</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </form>

            {testResult && (
              <div
                className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                  testResult.success
                    ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
                    : 'bg-rose-950/30 border-rose-800/40 text-rose-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span>{testResult.message}</span>
                </div>
                {testResult.pingMs && (
                  <span className="font-mono text-[11px] text-emerald-400 shrink-0">
                    {testResult.pingMs}ms
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Articles Ready to Sync & Published Live */}
        <div className="lg:col-span-7 space-y-5">
          {/* Ready to Sync Articles */}
          <div className="bg-[#0f172a]/90 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Send className="w-3.5 h-3.5 text-rose-400" />
                <span>Recipe Articles ({recipes.length})</span>
              </h3>
              <div className="flex items-center gap-2">
                <a
                  href={wpNewRecipeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 font-medium"
                >
                  <Plus className="w-3 h-3" />
                  <span>New Component in WP</span>
                </a>
              </div>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {recipes.map((r) => {
                const isPublished = r.wpStatus === 'published';
                const isCurrentlySyncing = syncingId === r.id;

                return (
                  <div
                    key={r.id}
                    className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition-colors space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-14 h-14 rounded-lg overflow-hidden border border-slate-800 shrink-0 bg-slate-950 relative">
                          <img
                            src={r.imageUrl}
                            alt={r.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-white truncate max-w-xs sm:max-w-md">
                            {r.title}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-pink-400 font-mono font-medium">{r.niche}</span>
                            <span>•</span>
                            <span className="text-slate-300">{r.totalTime}</span>
                            <span>•</span>
                            <span className="text-amber-400 font-mono">{r.calories} kcal</span>
                            <span>•</span>
                            <span className="text-emerald-400 font-mono">rcpmst_recipe_comp</span>
                          </div>
                        </div>
                      </div>

                      {isPublished && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-md shrink-0">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Synced</span>
                        </span>
                      )}
                    </div>

                    {/* Action Toolbar on Recipe Card */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Read Full Article & PDF */}
                        <button
                          onClick={() => setPreviewRecipe(r)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-medium border border-slate-700 transition-colors cursor-pointer"
                        >
                          <BookOpen className="w-3 h-3 text-pink-400" />
                          <span>Full Article & PDF</span>
                        </button>

                        {/* Quick Print PDF */}
                        <button
                          onClick={() => triggerRecipePrintViaIframe(r)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] border border-slate-700/80 transition-colors cursor-pointer"
                          title="Print / Save PDF without leaving page"
                        >
                          <Printer className="w-3 h-3 text-indigo-400" />
                          <span>Print PDF</span>
                        </button>

                        {/* Copy for WP Admin */}
                        <button
                          onClick={() => handleCopyRecipeComponent(r)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] border border-slate-700/80 transition-colors cursor-pointer"
                          title="Copy title, ingredients, and instructions for Recipe Master"
                        >
                          {copiedRecipeId === r.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-slate-400" />
                          )}
                          <span>{copiedRecipeId === r.id ? 'Copied!' : 'Copy for WP'}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Publish to WP button */}
                        <button
                          onClick={() => handlePublishSingle(r.id)}
                          disabled={isCurrentlySyncing}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-[11px] font-semibold shadow transition-all disabled:opacity-50 cursor-pointer"
                        >
                          {isCurrentlySyncing ? (
                            <>
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              <span>Posting...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-3 h-3" />
                              <span>Post to Recipe Section</span>
                            </>
                          )}
                        </button>

                        <a
                          href={wpRecipeSectionUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                          title="Open Recipe Section on WordPress"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* In-App Full Article Reader & PDF Modal */}
      {previewRecipe && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <div className="min-w-0 pr-4">
                <span className="text-[11px] font-mono text-pink-400 uppercase tracking-wider font-semibold">
                  {previewRecipe.niche} · {previewRecipe.dietary}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white truncate mt-0.5">
                  {previewRecipe.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerRecipePrintViaIframe(previewRecipe)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-semibold shadow transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => downloadRecipeHtmlFile(previewRecipe)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                  title="Download standalone HTML file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download HTML</span>
                </button>
                <button
                  onClick={() => setPreviewRecipe(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Complete Article Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
              {/* Hero Image */}
              {previewRecipe.imageUrl && (
                <div className="w-full max-h-[360px] rounded-xl overflow-hidden border border-slate-800 shadow-md">
                  <img
                    src={previewRecipe.imageUrl}
                    alt={previewRecipe.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Meta Description / Article Hook */}
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-200 text-sm leading-relaxed">
                <p className="font-medium text-pink-200">{previewRecipe.metaDescription}</p>
              </div>

              {/* Recipe Facts Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-center">
                  <span className="text-[10px] uppercase font-mono text-slate-500">Prep Time</span>
                  <div className="text-sm font-bold text-white mt-1">{previewRecipe.prepTime}</div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-center">
                  <span className="text-[10px] uppercase font-mono text-slate-500">Cook Time</span>
                  <div className="text-sm font-bold text-white mt-1">{previewRecipe.cookTime}</div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-center">
                  <span className="text-[10px] uppercase font-mono text-slate-500">Yield</span>
                  <div className="text-sm font-bold text-white mt-1">{previewRecipe.servings}</div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-center">
                  <span className="text-[10px] uppercase font-mono text-slate-500">Calories</span>
                  <div className="text-sm font-bold text-amber-400 mt-1">{previewRecipe.calories} kcal</div>
                </div>
              </div>

              {/* Nutrition Macros */}
              {previewRecipe.macros && (
                <div className="flex items-center justify-around p-3 bg-pink-950/20 border border-pink-500/20 rounded-xl text-xs text-pink-300">
                  <span>Protein: <strong className="text-white">{previewRecipe.macros.protein}</strong></span>
                  <span>Carbs: <strong className="text-white">{previewRecipe.macros.carbs}</strong></span>
                  <span>Fat: <strong className="text-white">{previewRecipe.macros.fat}</strong></span>
                  {previewRecipe.macros.fiber && <span>Fiber: <strong className="text-white">{previewRecipe.macros.fiber}</strong></span>}
                </div>
              )}

              {/* Ingredients List */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Ingredients Listing</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(previewRecipe.ingredients || []).map((i, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-white">{i.amount}</strong> {i.item}
                        {i.notes && <span className="text-slate-500 italic ml-1">({i.notes})</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Cooking Instructions */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>Step-by-Step Instructions</span>
                </h4>
                <div className="space-y-2.5">
                  {(previewRecipe.instructions || []).map((s, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">
                          Step {s.step || idx + 1}: {s.title}
                        </span>
                        {s.timerMinutes && (
                          <span className="text-[10px] font-mono text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded">
                            ⏱️ {s.timerMinutes} mins
                          </span>
                        )}
                      </div>
                      <p className="leading-relaxed text-slate-400">{s.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chef's Pro Tips */}
              {previewRecipe.chefTips && previewRecipe.chefTips.length > 0 && (
                <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-2 text-xs text-emerald-300">
                  <h4 className="font-bold flex items-center gap-1.5 text-emerald-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Chef's Pro Tips</span>
                  </h4>
                  <ul className="space-y-1.5 pl-4 list-disc text-slate-300">
                    {previewRecipe.chefTips.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                Post Type: rcpmst_recipe_comp · Section ID: {previewRecipe.id}
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={wpRecipeSectionUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
                >
                  <span>Open in WP Recipe Section</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={() => triggerRecipePrintViaIframe(previewRecipe)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save as PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* JSON Schema Payload Modal */}
      {showPayloadModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Code className="w-4 h-4 text-pink-400" />
                  <span>Recipe Section (rcpmst_recipe_comp) Import Payload Schema</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Targeting <code className="text-pink-300">/autosync/v1/import</code> with post type <code className="text-pink-300">rcpmst_recipe_comp</code>.
                </p>
              </div>
              <button
                onClick={() => setShowPayloadModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-96 leading-relaxed">
              {JSON.stringify(samplePayload, null, 2)}
            </pre>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                Compatible with Recipe Master & Auto_Sync_API
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(samplePayload, null, 2));
                  setCopiedPayload(true);
                  setTimeout(() => setCopiedPayload(false), 2000);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                {copiedPayload ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPayload ? 'Copied!' : 'Copy JSON'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
