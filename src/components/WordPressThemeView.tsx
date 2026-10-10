import React, { useState } from 'react';
import { 
  Download, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  Layers, 
  FileText, 
  ExternalLink, 
  Check, 
  ShieldCheck, 
  Eye, 
  Printer, 
  Palette, 
  Globe, 
  FolderTree, 
  Code 
} from 'lucide-react';
import frenchBourguignonImg from '../assets/images/recipe_french_bourguignon.jpg';

export const WordPressThemeView: React.FC = () => {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<'desktop' | 'mobile' | 'code'>('desktop');

  const handleDownloadThemeZip = async () => {
    setDownloading(true);
    try {
      const res = await fetch('/api/download-theme-zip');
      if (!res.ok) throw new Error('Theme download failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pinrecipe-culinary.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      window.open('/api/download-theme-zip', '_blank');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-900/40 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Tailored WordPress Theme &bull; Zero Bloat
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              PinRecipe Culinary Theme <span className="text-indigo-400 font-mono text-xl">v1.0.0</span>
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Engineered exclusively for publishing high-ranking food articles, structured recipes, downloadable PDF files, and thematic categories like <strong>French cuisine</strong>, <strong>Recycled pizza</strong>, and <strong>Thanksgiving</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleDownloadThemeZip}
              disabled={downloading}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-pink-600/30 hover:shadow-pink-600/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  Downloaded pinrecipe-culinary.zip!
                </>
              ) : downloading ? (
                <>
                  <Zap className="w-4 h-4 animate-spin text-pink-200" />
                  Preparing Theme Package...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download Theme (.ZIP)
                </>
              )}
            </button>

            <a
              href="https://foodsprepared.wasmer.app/wp-admin/theme-install.php?upload"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-sm transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Upload to WordPress
            </a>
          </div>
        </div>
      </div>

      {/* 5 Core Theme Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">1. Stripped WordPress Bloat</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Eliminates unnecessary emoji scripts, RSD links, wlwmanifest, pingback spam, and heavy unused Gutenberg block stylesheets. Delivers blazing sub-second load times and 98+ PageSpeed scores.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
            <Printer className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">2. Downloadable Recipe PDFs</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every recipe article features built-in <strong>"Download Recipe (PDF)"</strong> and <strong>"Print Recipe"</strong> actions with dedicated print styling that reformats the recipe onto a clean single page.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">3. Theme & Object Taxonomies</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Organize recipes intuitively by theme or object (e.g. <em>French cuisine</em>, <em>Recycled pizza</em>, <em>Thanksgiving</em>). Includes category filter pill bars on the homepage and dedicated archives.
          </p>
        </div>
      </div>

      {/* Live Visual Theme Mockup */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="border-b border-slate-800 bg-slate-950/80 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-pink-400" />
            <span className="text-sm font-semibold text-white">Theme Live Front-End Preview</span>
            <span className="text-xs text-slate-500 font-mono">foodsprepared.wasmer.app</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActivePreviewTab('desktop')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                activePreviewTab === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Desktop Layout
            </button>
            <button
              onClick={() => setActivePreviewTab('mobile')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                activePreviewTab === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Mobile View
            </button>
            <button
              onClick={() => setActivePreviewTab('code')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                activePreviewTab === 'code' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Theme Files & Code
            </button>
          </div>
        </div>

        {activePreviewTab === 'desktop' && (
          <div className="p-6 sm:p-8 bg-slate-100 text-slate-900 min-h-[500px]">
            {/* Mock Header */}
            <header className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-lg">
                <span className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center text-sm">🍳</span>
                PinRecipe Culinary
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                <span className="text-rose-600">All Recipes</span>
                <span className="hover:text-rose-600 cursor-pointer">French Cuisine</span>
                <span className="hover:text-rose-600 cursor-pointer">Recycled Pizza</span>
                <span className="hover:text-rose-600 cursor-pointer">Thanksgiving</span>
              </div>
              <div className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full font-medium">
                🔍 Search Recipes
              </div>
            </header>

            {/* Mock Article View */}
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider">
                  French Cuisine
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
                  Classic French Beef Bourguignon with Burgundy Wine & Braised Pearl Onions
                </h2>
                <p className="text-slate-600 text-sm">
                  Master the quintessential French stew at home: tender beef chuck slow-braised in Pinot Noir with glazed pearl onions and mushrooms.
                </p>
                <div className="flex items-center justify-center gap-4 text-xs text-slate-500 pt-1">
                  <span>By Executive Chef</span>
                  <span>&bull;</span>
                  <span>⏱️ 2 hrs 55 mins Total</span>
                  <span>&bull;</span>
                  <span>👥 6 Servings</span>
                </div>

                <div className="flex items-center justify-center gap-3 pt-3">
                  <span className="bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-full cursor-pointer shadow-md shadow-rose-600/20">
                    👇 Jump to Recipe Card
                  </span>
                  <span className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-full cursor-pointer flex items-center gap-1.5 shadow-md">
                    📥 Download Recipe (PDF)
                  </span>
                </div>
              </div>

              {/* Hero Image */}
              <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200">
                <img
                  src={frenchBourguignonImg}
                  alt="French Beef Bourguignon"
                  className="w-full h-80 object-cover"
                />
              </div>

              {/* Downloadable PDF Callout */}
              <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl p-5 flex items-center justify-between gap-4 shadow-md">
                <div>
                  <h4 className="font-bold text-sm text-white">📄 Take this Recipe to the Kitchen</h4>
                  <p className="text-xs text-indigo-200">
                    Download the printable 1-page PDF recipe card with ingredient checklist and step timers.
                  </p>
                </div>
                <button
                  onClick={handleDownloadThemeZip}
                  className="bg-white text-slate-900 text-xs font-bold px-4 py-2 rounded-lg whitespace-nowrap shadow"
                >
                  📥 Download PDF Card
                </button>
              </div>

              {/* Mock Recipe Card */}
              <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-lg">Recipe Ingredients & Steps</h3>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">
                    Schema.org Verified
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 bg-slate-50 p-3 rounded-lg text-center text-xs">
                  <div><span className="text-slate-400 block font-semibold">PREP</span><strong>25 mins</strong></div>
                  <div><span className="text-slate-400 block font-semibold">COOK</span><strong>2 hrs 30 mins</strong></div>
                  <div><span className="text-slate-400 block font-semibold">YIELD</span><strong>6 servings</strong></div>
                  <div><span className="text-slate-400 block font-semibold">CALORIES</span><strong>580 kcal</strong></div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Ingredients Checklist</h4>
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded accent-rose-600" />
                      <span><strong>1.2 kg (2.6 lbs)</strong> Beef Chuck Roast (cut into 2-inch chunks)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded accent-rose-600" />
                      <span><strong>750 ml</strong> Burgundy Pinot Noir Red Wine</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded accent-rose-600" />
                      <span><strong>180g (6 oz)</strong> Thick-Cut Bacon Lardons</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activePreviewTab === 'mobile' && (
          <div className="p-8 bg-slate-950 flex justify-center">
            <div className="w-80 bg-slate-100 rounded-3xl border-8 border-slate-800 p-4 shadow-2xl space-y-4">
              <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto" />
              <div className="text-center space-y-1">
                <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">
                  FRENCH CUISINE
                </span>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Classic French Beef Bourguignon
                </h3>
              </div>
              <img
                src={frenchBourguignonImg}
                alt="Mobile preview"
                className="w-full h-36 object-cover rounded-lg"
              />
              <div className="flex gap-2">
                <button className="flex-1 bg-rose-600 text-white text-[10px] font-bold py-2 rounded-lg">
                  Jump to Recipe
                </button>
                <button className="flex-1 bg-slate-900 text-white text-[10px] font-bold py-2 rounded-lg">
                  Download PDF
                </button>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 text-[11px] space-y-2">
                <div className="font-bold text-slate-800">Ingredients</div>
                <div className="text-slate-600 space-y-1 text-[10px]">
                  <div>&bull; 1.2 kg Beef Chuck Roast</div>
                  <div>&bull; 750 ml French Burgundy Wine</div>
                  <div>&bull; 180g Thick-Cut Bacon Lardons</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activePreviewTab === 'code' && (
          <div className="p-6 bg-slate-950 text-slate-300 font-mono text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-pink-400 font-semibold">Theme Package Structure &bull; wordpress-theme/pinrecipe-culinary/</span>
              <button
                onClick={handleDownloadThemeZip}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded text-xs font-sans font-semibold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download Zip
              </button>
            </div>
            <pre className="text-slate-400 bg-slate-900 p-4 rounded-xl border border-slate-800 overflow-x-auto">
{`wordpress-theme/pinrecipe-culinary/
├── style.css                 # Zero-bloat stylesheet, responsive layout, print rules
├── functions.php             # Bloat removal, CPT, taxonomies, Schema JSON-LD, REST endpoint
├── header.php                # Clean HTML5 semantic header & category menu
├── footer.php                # Fast minimalist footer
├── index.php                 # Homepage recipe grid & category pill filter
├── single.php                # Long-form article page, Jump to Recipe, PDF download banner
├── archive.php               # Category/Theme archive (French cuisine, Recycled pizza, etc.)
├── recipe-print-template.php # Clean 1-page printable / PDF recipe layout
└── readme.txt                # Installation and setup documentation`}
            </pre>
          </div>
        )}
      </div>

      {/* 30-Second Installation Walkthrough */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">How to Install in 30 Seconds</h3>
            <p className="text-xs text-slate-400">Works with all WordPress 5.8 to 6.7+ installations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 font-bold flex items-center justify-center text-xs">1</div>
            <h4 className="font-bold text-white">Download Zip</h4>
            <p className="text-slate-400">
              Click <strong>Download Theme (.ZIP)</strong> above to save <code>pinrecipe-culinary.zip</code> to your computer.
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-xs">2</div>
            <h4 className="font-bold text-white">Upload Theme</h4>
            <p className="text-slate-400">
              In WordPress Admin, go to <strong>Appearance &rarr; Themes &rarr; Add New &rarr; Upload Theme</strong> and select the zip file.
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">3</div>
            <h4 className="font-bold text-white">Activate Theme</h4>
            <p className="text-slate-400">
              Click <strong>Activate</strong>. Your blog is instantly optimized for recipes with zero bloat and Google Schema markup.
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">4</div>
            <h4 className="font-bold text-white">1-Click Sync</h4>
            <p className="text-slate-400">
              Go to the <strong>WordPress CMS</strong> tab in this app and sync your recipes. They appear immediately with matching categories and PDF downloads!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
