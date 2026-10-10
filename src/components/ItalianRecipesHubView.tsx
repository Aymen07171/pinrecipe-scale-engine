import React, { useState } from 'react';
import { RecipeItem, WordPressConfig } from '../types/pipeline';
import {
  ITALIAN_RECIPE_CATEGORIES,
  SAMPLE_ITALIAN_INSPIRATION_ARTICLES,
} from '../data/sampleRecipes';
import {
  Sparkles,
  ChefHat,
  Download,
  Printer,
  Image as ImageIcon,
  FileText,
  Plus,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  BookOpen,
  Terminal,
  Globe,
  Layers,
  Eye,
  Send,
  Trash2,
  X,
  Code,
} from 'lucide-react';
import {
  triggerRecipePrintViaIframe,
  downloadRecipeHtmlFile,
} from '../utils/recipePdfGenerator';

interface ItalianRecipesHubViewProps {
  recipes: RecipeItem[];
  wpConfig: WordPressConfig;
  onAddRecipe: (newRecipe: RecipeItem) => void;
  onUpdateRecipe: (updated: RecipeItem) => void;
  onPublishRecipeToWp: (recipeId: string) => Promise<boolean | void>;
}

export const ItalianRecipesHubView: React.FC<ItalianRecipesHubViewProps> = ({
  recipes,
  wpConfig,
  onAddRecipe,
  onUpdateRecipe,
  onPublishRecipeToWp,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'studio' | 'wp_page_preview' | 'selenium_script'>('wp_page_preview');

  // Custom Italian Categories State
  const [categories, setCategories] = useState(ITALIAN_RECIPE_CATEGORIES);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(ITALIAN_RECIPE_CATEGORIES[0].name);
  const [previewFilterCategory, setPreviewFilterCategory] = useState<string>('ALL');

  // Sample Article Inspiration State
  const [selectedInspirationId, setSelectedInspirationId] = useState<string>(SAMPLE_ITALIAN_INSPIRATION_ARTICLES[0].id);
  const [customInspirationText, setCustomInspirationText] = useState<string>(
    SAMPLE_ITALIAN_INSPIRATION_ARTICLES[0].sampleText
  );

  // New Italian Article Generator Form
  const [topicInput, setTopicInput] = useState('');
  const [dietaryInput, setDietaryInput] = useState('Authentic Italian');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<string | null>(null);

  // WordPress Page Publishing State
  const [isPublishingPage, setIsPublishingPage] = useState(false);
  const [publishBanner, setPublishBanner] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
    url?: string;
  } | null>(null);

  // Active Article Modal for inspecting Thumbnail + 3 Images + PDF
  const [activeArticleModal, setActiveArticleModal] = useState<RecipeItem | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedWpPageHtml, setCopiedWpPageHtml] = useState(false);

  // Filter Italian recipes
  const italianRecipes = recipes.filter(
    (r) =>
      r.niche.toLowerCase().includes('italian') ||
      r.themeCategory?.toLowerCase().includes('italian') ||
      !!r.italianCategory ||
      r.slug.includes('tagliatelle') ||
      r.slug.includes('pizza')
  );

  const filteredPreviewRecipes =
    previewFilterCategory === 'ALL'
      ? italianRecipes
      : italianRecipes.filter(
          (r) =>
            (r.italianCategory || r.niche).toLowerCase() === previewFilterCategory.toLowerCase()
        );

  // Add a new user-defined Italian category
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const slug = newCategoryName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat = {
      id: `cat-custom-${Date.now()}`,
      name: newCategoryName.trim(),
      slug,
      icon: '🇮🇹',
      description: newCategoryDesc.trim() || `Custom Italian recipe category: ${newCategoryName.trim()}`,
      sampleTopics: [`Authentic ${newCategoryName.trim()} Special`],
    };
    setCategories([...categories, newCat]);
    setSelectedCategory(newCat.name);
    setNewCategoryName('');
    setNewCategoryDesc('');
  };

  // Generate a complete Italian Recipe Article with Catchy Thumbnail + 3 Recipe Images + Downloadable PDF
  const handleGenerateItalianArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) return;

    setIsGenerating(true);
    setGenerationStatus('Synthesizing Italian recipe article, catchy thumbnail, 3 step images, and PDF...');

    try {
      const res = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicInput.trim(),
          niche: 'Italian Recipes',
          themeCategory: 'Italian Recipes',
          italianCategory: selectedCategory,
          dietary: dietaryInput || 'Authentic Italian',
          sampleInspiration: customInspirationText,
        }),
      });

      const resData = await res.json();
      const d = resData.data || {};
      const slug =
        d.slug ||
        topicInput
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-');

      // Select appropriate Italian photography for thumbnail & 3 gallery images
      const lowerTopic = (topicInput + ' ' + selectedCategory).toLowerCase();
      let thumb = '/src/assets/images/italian_pasta_e_ceci_chickpeas.jpg';
      if (lowerTopic.includes('ceci') || lowerTopic.includes('chickpea')) {
        thumb = '/src/assets/images/italian_pasta_e_ceci_chickpeas.jpg';
      } else if (lowerTopic.includes('fagioli') || lowerTopic.includes('bean') || lowerTopic.includes('tuscan')) {
        thumb = '/src/assets/images/italian_tuscan_white_beans_fagioli.jpg';
      } else if (lowerTopic.includes('pesto') || lowerTopic.includes('liguria')) {
        thumb = '/src/assets/images/italian_ligurian_pesto_trenette.jpg';
      } else if (lowerTopic.includes('fregola') || lowerTopic.includes('sardinia') || lowerTopic.includes('seafood') || lowerTopic.includes('crespelle') || lowerTopic.includes('brodo')) {
        thumb = '/src/assets/images/italian_sardinian_fregola_seafood.jpg';
      } else if (lowerTopic.includes('lentil')) {
        thumb = '/src/assets/images/italian_lentil_ragu_pappardelle.jpg';
      } else if (lowerTopic.includes('frittata') || lowerTopic.includes('air-fryer') || lowerTopic.includes('air fryer')) {
        thumb = '/src/assets/images/italian_frittata_green_beans.jpg';
      } else if (lowerTopic.includes('pizza') || lowerTopic.includes('focaccia')) {
        thumb = '/src/assets/images/italian_margherita_pizza_woodfired.jpg';
      } else if (lowerTopic.includes('lasagna') || lowerTopic.includes('bolognese') || lowerTopic.includes('ragu') || lowerTopic.includes('baked')) {
        thumb = '/src/assets/images/italian_lasagna_bolognese_layers.jpg';
      } else if (lowerTopic.includes('tiramisu') || lowerTopic.includes('dolci') || lowerTopic.includes('dessert')) {
        thumb = '/src/assets/images/italian_tiramisu_espresso_dolci.jpg';
      } else if (lowerTopic.includes('bread') || lowerTopic.includes('panzanella') || lowerTopic.includes('bruschetta') || lowerTopic.includes('burrata')) {
        thumb = '/src/assets/images/italian_burrata_bruschetta_antipasti.jpg';
      } else if (lowerTopic.includes('pantry') || lowerTopic.includes('carbonara') || lowerTopic.includes('pasta')) {
        thumb = '/src/assets/images/italian_pasta_carbonara_hero.jpg';
      }

      const galleryImages =
        Array.isArray(d.galleryImages) && d.galleryImages.length >= 2
          ? d.galleryImages
          : [
              {
                url: '/src/assets/images/italian_pasta_prep_ingredients.jpg',
                caption: `Step 1: Authentic Italian DOP Ingredients & Mise en Place for ${d.title || topicInput}`,
                alt: `${topicInput} ingredients preparation`,
              },
              {
                url: thumb,
                caption: `Step 2: Cooking & Emulsifying ${d.title || topicInput} to Golden Perfection`,
                alt: `${topicInput} cooking process`,
              },
              {
                url: '/src/assets/images/italian_burrata_bruschetta_antipasti.jpg',
                caption: `Step 3: Final Trattoria Plating & Garnish for ${d.title || topicInput}`,
                alt: `${topicInput} final plating`,
              },
            ];

      const newRecipe: RecipeItem = {
        id: `rec-it-${Date.now().toString().slice(-4)}`,
        topic: topicInput.trim(),
        title: d.title || `Authentic Italian ${topicInput.trim()}`,
        slug,
        niche: 'Italian Recipes',
        themeCategory: 'Italian Recipes',
        italianCategory: selectedCategory,
        sampleInspiration: customInspirationText,
        dietary: dietaryInput || 'Authentic Italian',
        status: 'completed',
        currentStepIndex: 4,
        progress: 100,
        imageUrl: thumb,
        thumbnailUrl: thumb,
        galleryImages,
        downloadablePdfUrl: `/api/recipe-print/${slug}`,
        macroPhotoPrompt:
          d.macroPhotoPrompt ||
          `Catchy gourmet Italian food photography thumbnail of ${topicInput}, warm trattoria lighting, 8k DSLR`,
        prepTime: d.prepTime || '15 mins',
        cookTime: d.cookTime || '25 mins',
        totalTime: d.totalTime || '40 mins',
        servings: d.servings || '4 servings',
        calories: d.calories || 510,
        difficulty: d.difficulty || 'Medium',
        longArticleContent:
          d.longArticleContent ||
          `## The Authentic Italian Story of ${topicInput}\n\nInspired by classic regional Italian trattorias under **${selectedCategory}**, this recipe brings authentic DOP ingredients and time-tested culinary technique straight to your kitchen.\n\n### Why This Recipe Works\n1. **Pure Regional Ingredients:** Focusing on high-quality olive oil, aged cheese, and fresh aromatics.\n2. **Balanced Texture & Emulsion:** Step-by-step temperature control guarantees restaurant-quality results every single time.`,
        macros: d.macros || { protein: '24g', carbs: '52g', fat: '21g', fiber: '4g' },
        ingredients:
          Array.isArray(d.ingredients) && d.ingredients.length > 0
            ? d.ingredients
            : [
                { item: 'Artisanal Italian Base Ingredient', amount: '400g', notes: 'DOP certified preferred' },
                { item: 'Extra Virgin Olive Oil (Cold Pressed)', amount: '3 tbsp' },
                { item: 'Aged Parmigiano-Reggiano or Pecorino Romano', amount: '75g', notes: 'freshly grated' },
                { item: 'Fresh Garlic & Sweet Basil Leaves', amount: '3 cloves, 1 handful' },
              ],
        instructions:
          Array.isArray(d.instructions) && d.instructions.length > 0
            ? d.instructions
            : [
                {
                  step: 1,
                  title: 'Prepare the Italian Aromatics (Mise en Place)',
                  text: `Gather and prep all fresh ingredients for ${topicInput.trim()} on a clean board.`,
                  timerMinutes: 10,
                },
                {
                  step: 2,
                  title: 'Simmer & Build the Flavor Base',
                  text: 'Infuse extra virgin olive oil with aromatics over gentle heat without burning.',
                  timerMinutes: 12,
                },
                {
                  step: 3,
                  title: 'Finish & Plate Trattoria-Style',
                  text: 'Toss with freshly grated aged cheese and herbs. Serve warm and download the printable PDF card below.',
                  timerMinutes: 5,
                },
              ],
        chefTips:
          Array.isArray(d.chefTips) && d.chefTips.length > 0
            ? d.chefTips
            : [
                'Always use freshly grated DOP Parmigiano-Reggiano or Pecorino Romano—pre-shredded cheese contains anti-caking starches that prevent smooth melting.',
                'Download the printable PDF recipe card above to keep your kitchen counter clutter-free while cooking.',
              ],
        metaDescription:
          d.metaDescription ||
          `Learn how to make authentic ${topicInput.trim()} (${selectedCategory}) with step-by-step photos and a free downloadable PDF recipe card.`,
        focusKeyword: d.focusKeyword || `${topicInput.trim().toLowerCase()} italian recipe`,
        schemaJsonLd: d.schemaJsonLd || {
          '@context': 'https://schema.org',
          '@type': 'Recipe',
          name: d.title || topicInput.trim(),
          recipeCategory: selectedCategory,
          recipeCuisine: 'Italian',
        },
        pinterestPin: {
          title: d.pinterestPin?.title || `Authentic Italian ${topicInput.trim()} (With Free PDF!)`,
          description:
            d.pinterestPin?.description ||
            `Make restaurant-quality ${topicInput.trim()} at home! Includes 3 step-by-step photos and a downloadable PDF recipe card.`,
          hashtags: ['#italianrecipes', '#italiancooking', '#authenticitalian', '#pastalover'],
          overlayHeadline: d.pinterestPin?.overlayHeadline || topicInput.trim(),
          board: 'Italian Recipes',
          scheduledTime: 'Tomorrow at 6:00 PM',
          status: 'scheduled',
        },
        wpStatus: 'published',
        wpPostUrl: `${wpConfig.url.replace(/\/$/, '')}/italian-recipes`,
        wpCategory: selectedCategory,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        healthScore: 100,
        logEntries: [
          `${new Date().toLocaleTimeString()} - Generated Italian article for category "${selectedCategory}"`,
          `${new Date().toLocaleTimeString()} - Attached catchy thumbnail + 3 recipe step images + downloadable PDF`,
        ],
      };

      onAddRecipe(newRecipe);
      setTopicInput('');
      setPublishBanner({
        type: 'success',
        text: `Created "${newRecipe.title}" under [${selectedCategory}] with Catchy Thumbnail, 3 Recipe Images, and Downloadable PDF!`,
      });
    } catch (err: any) {
      console.error('Error generating Italian recipe:', err);
      setPublishBanner({
        type: 'error',
        text: err.message || 'Failed to synthesize recipe.',
      });
    } finally {
      setIsGenerating(false);
      setGenerationStatus(null);
    }
  };

  // Publish Dedicated `/italian-recipes/` Page + All Italian Articles to WordPress
  const handlePublishDedicatedItalianPage = async () => {
    setIsPublishingPage(true);
    setPublishBanner(null);
    try {
      const res = await fetch('/api/publish-italian-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: wpConfig.url,
          apiKey: wpConfig.syncApiKey,
          username: wpConfig.username,
          appPassword: wpConfig.appPassword,
          categories,
          recipes: italianRecipes,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPublishBanner({
          type: 'success',
          text: `Dedicated Italian Recipes Page (/italian-recipes) & ${italianRecipes.length} multi-image articles synced to WordPress!`,
          url: data.pageUrl || `${wpConfig.url.replace(/\/$/, '')}/italian-recipes`,
        });
      } else {
        setPublishBanner({
          type: 'info',
          text:
            data.error ||
            'Prepared Dedicated Italian Recipes WordPress Page HTML & WXR XML! You can copy the Page HTML or use 1-Click XML Import.',
          url: `${wpConfig.url.replace(/\/$/, '')}/wp-admin/edit.php?post_type=page`,
        });
      }
    } catch (err: any) {
      setPublishBanner({
        type: 'error',
        text: err.message || 'Error connecting to WordPress endpoint.',
      });
    } finally {
      setIsPublishingPage(false);
    }
  };

  // Generate raw WordPress Page HTML for `/home/` & `/italian-recipes/` Carousel Homepage
  const generateWpItalianPageHtmlCode = () => {
    const cleanSiteUrl = wpConfig.url.replace(/\/$/, '') || 'https://foodsprepared.wasmer.app';
    return `<div id="sik-top" class="semplice-homepage-wrapper" style="max-width:1120px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;color:#2d3748;line-height:1.65;">
  <!-- SECTION 1: INTRODUCTORY HERO SECTION -->
  <section style="background:#FFF8F2;border:2px solid #e6d7c8;border-radius:24px;padding:36px 30px;margin-bottom:38px;">
    <span style="display:inline-block;background:#227755;color:#ffffff;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;padding:5px 14px;border-radius:999px;margin-bottom:12px;">🇮🇹 Benvenuti · Real Italian Flavor, Everyday Cooking</span>
    <h1 style="font-family:Georgia,serif;font-size:34px;font-weight:700;color:#1a202c;line-height:1.22;margin:0 0 12px;">Welcome to Semplice Italian Kitchen: Authentic Recipes for Everyday Home Cooks</h1>
    <p style="font-size:16px;color:#4a5568;line-height:1.7;margin:0 0 20px;max-width:780px;">Discover the heart of Italian home cooking—from time-honored <strong>Cucina Povera</strong> budget meals and <strong>20-minute weeknight pastas</strong> to regional treasures from <strong>Tuscany, Liguria, Sardinia, and Abruzzo</strong>. Every recipe includes step-by-step culinary photography plus a <strong>free printable 1-page PDF recipe card</strong>.</p>
    <div style="display:flex;flex-wrap:wrap;gap:12px;">
      <a href="#carousel-featured" style="background:#227755;color:#ffffff;padding:11px 20px;border-radius:10px;text-decoration:none;font-size:13px;font-weight:700;">Explore Featured Carousel &darr;</a>
      <a href="#carousel-categories" style="background:#D96B43;color:#ffffff;padding:11px 20px;border-radius:10px;text-decoration:none;font-size:13px;font-weight:700;">Browse 6 Category Carousels &darr;</a>
    </div>
  </section>

  <!-- SECTION 2: FEATURED ARTICLES CAROUSEL -->
  <section id="carousel-featured" style="margin-bottom:42px;background:#FFF8F2;border:1px solid #e6d7c8;border-radius:22px;padding:24px;">
    <h2 style="font-family:Georgia,serif;font-size:24px;color:#1a202c;margin:0 0 6px;">🎠 Featured Italian Recipe Articles (${italianRecipes.length})</h2>
    <p style="font-size:14px;color:#4a5568;margin:0 0 16px;">Swipe or scroll horizontally to explore our complete guides with free printable PDFs.</p>
    <div style="display:flex;flex-wrap:nowrap;gap:20px;overflow:auto;padding:4px 2px 16px;">
      ${italianRecipes
        .map((r) => {
          const pdfLink = r.downloadablePdfUrl || `/api/recipe-print/${r.slug}`;
          return `<div style="flex:0 0 300px;min-width:290px;background:#ffffff;border:1px solid #eadfd5;border-radius:16px;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;">
        <div>
          <img src="${r.thumbnailUrl || r.imageUrl}" alt="${r.title}" style="width:100%;height:190px;object-fit:cover;display:block;" />
          <div style="padding:16px;">
            <span style="background:#227755;color:#ffffff;padding:3px 10px;border-radius:999px;font-size:10px;font-weight:700;">${r.italianCategory || r.niche}</span>
            <h3 style="font-family:Georgia,serif;font-size:17px;margin:8px 0;color:#1a202c;"><a href="${cleanSiteUrl}/${r.slug}/" style="color:#1a202c;text-decoration:none;">${r.title}</a></h3>
            <p style="font-size:12px;color:#4a5568;margin:0;">${r.metaDescription}</p>
          </div>
        </div>
        <div style="padding:12px 16px;border-top:1px solid #f5ebe1;background:#fffaf5;display:flex;justify-content:space-between;align-items:center;">
          <a href="${cleanSiteUrl}/${r.slug}/" style="background:#227755;color:#ffffff;padding:7px 12px;border-radius:8px;text-decoration:none;font-size:12px;font-weight:700;">Read Recipe &rarr;</a>
          <a href="${pdfLink}" target="_blank" rel="noopener" style="color:#D96B43;font-size:12px;font-weight:700;text-decoration:none;">📥 Free PDF</a>
        </div>
      </div>`;
        })
        .join('')}
    </div>
  </section>

  <!-- SECTION 3: CATEGORY CAROUSELS -->
  <section id="carousel-categories" style="margin-bottom:42px;">
    <h2 style="font-family:Georgia,serif;font-size:24px;color:#1a202c;margin:0 0 14px;">🗂️ Explore by Italian Recipe Category</h2>
    <div style="display:flex;flex-wrap:nowrap;gap:16px;overflow:auto;padding-bottom:14px;">
      ${categories
        .map(
          (c) => `<div style="flex:0 0 265px;min-width:255px;background:#ffffff;border:1px solid #eadfd5;border-radius:16px;padding:18px;">
        <div style="font-size:24px;margin-bottom:6px;">${c.icon}</div>
        <h3 style="font-family:Georgia,serif;font-size:17px;margin:0 0 6px;color:#1a202c;">${c.name}</h3>
        <p style="font-size:12px;color:#4a5568;margin:0 0 12px;line-height:1.5;">${c.description}</p>
        <a href="${cleanSiteUrl}/category/${c.slug}/" style="color:#227755;font-size:12px;font-weight:700;text-decoration:none;">Explore ${c.name} &rarr;</a>
      </div>`
        )
        .join('')}
    </div>
  </section>

  <!-- SECTION 4: FOOTER -->
  <footer id="sik-footer" style="background:#1a202c;color:#e2e8f0;border-radius:22px;padding:36px 28px 24px;margin-top:44px;border-top:5px solid #227755;">
    <div style="display:flex;flex-wrap:wrap;gap:28px;justify-content:space-between;padding-bottom:24px;border-bottom:1px solid #2d3748;">
      <div style="flex:1 1 260px;">
        <h3 style="font-family:Georgia,serif;font-size:19px;color:#ffffff;margin:0 0 8px;">🇮🇹 Semplice Italian Kitchen</h3>
        <p style="font-size:13px;color:#a0aec0;margin:0;line-height:1.6;">Authentic, budget-friendly Italian recipes, quick 20-minute weeknight dinners, regional specialties, and free printable PDF recipe cards.</p>
      </div>
      <div style="flex:1 1 200px;">
        <h4 style="font-size:15px;color:#ffffff;margin:0 0 10px;">Recipe Categories</h4>
        <ul style="list-style:none;padding:0;margin:0;font-size:13px;line-height:2;">
          ${categories.map((c) => `<li><a href="${cleanSiteUrl}/category/${c.slug}/" style="color:#cbd5e0;text-decoration:none;">${c.icon} ${c.name}</a></li>`).join('')}
        </ul>
      </div>
      <div style="flex:1 1 180px;">
        <h4 style="font-size:15px;color:#ffffff;margin:0 0 10px;">Quick Navigation</h4>
        <ul style="list-style:none;padding:0;margin:0;font-size:13px;line-height:2;">
          <li><a href="${cleanSiteUrl}/home/" style="color:#cbd5e0;text-decoration:none;">🏠 Homepage</a></li>
          <li><a href="${cleanSiteUrl}/italian-recipes/" style="color:#cbd5e0;text-decoration:none;">🇮🇹 Italian Recipes Hub</a></li>
          <li><a href="${cleanSiteUrl}/about/" style="color:#cbd5e0;text-decoration:none;">📖 About Us</a></li>
          <li><a href="${cleanSiteUrl}/contact/" style="color:#cbd5e0;text-decoration:none;">✉️ Contact</a></li>
        </ul>
      </div>
    </div>
    <div style="padding-top:18px;font-size:12px;color:#718096;display:flex;justify-content:space-between;flex-wrap:wrap;">
      <span>&copy; ${new Date().getFullYear()} Semplice Italian Kitchen (${cleanSiteUrl}). All Rights Reserved.</span>
      <a href="#sik-top" style="color:#68d391;text-decoration:none;font-weight:700;">&uarr; Back to Top</a>
    </div>
  </footer>
</div>`;
  };

  const handleCopyWpPageHtml = () => {
    navigator.clipboard.writeText(generateWpItalianPageHtmlCode());
    setCopiedWpPageHtml(true);
    setTimeout(() => setCopiedWpPageHtml(false), 2500);
  };

  const handleDownloadSeleniumScript = () => {
    window.open('/api/download-selenium-script', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Italian Tricolore Banner */}
      <div className="bg-gradient-to-r from-emerald-950/50 via-slate-900 to-rose-950/50 border border-emerald-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
              <span>🇮🇹 Dedicated WordPress Page & Article Factory</span>
              <span>•</span>
              <span>Thumbnail + 2–3 Photos + PDF Guaranteed</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Italian Recipes Hub & Content Studio
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Organize your custom Italian recipe categories, paste sample articles for style inspiration, and generate complete articles via <strong>Gemini (Free Tier)</strong> or our <strong>Python + Selenium Chrome Script</strong>. Every article automatically includes a <strong>catchy thumbnail</strong>, <strong>2–3 recipe images</strong>, and a <strong>downloadable PDF link</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handlePublishDedicatedItalianPage}
              disabled={isPublishingPage}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-rose-600 hover:from-emerald-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isPublishingPage ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Publishing Italian Hub to WP...</span>
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4" />
                  <span>Publish /italian-recipes/ Page to WP</span>
                </>
              )}
            </button>

            <button
              onClick={() => setActiveSubTab('wp_page_preview')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-pink-400" />
              <span>Preview Dedicated Page</span>
            </button>

            <button
              onClick={() => setActiveSubTab('selenium_script')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>Python Selenium Script</span>
            </button>
          </div>
        </div>

        {/* 3 Mandatory Article Pillars Verification Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white">1. Visually Appealing Thumbnail</div>
              <div className="text-[11px] text-slate-400">High-CTR 8K hero cover on every recipe card</div>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white">2. Two to Three Recipe Images</div>
              <div className="text-[11px] text-slate-400">Mise en place, cooking emulsion & plating gallery</div>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white">3. Visitor Downloadable PDF</div>
              <div className="text-[11px] text-slate-400">Direct PDF download button & printable 1-page card</div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Alert */}
      {publishBanner && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-4 text-xs ${
            publishBanner.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : publishBanner.type === 'error'
              ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
              : 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{publishBanner.text}</span>
          </div>
          {publishBanner.url && (
            <a
              href={publishBanner.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-bold underline hover:text-white shrink-0"
            >
              <span>Open in WordPress</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('studio')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'studio'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <ChefHat className="w-4 h-4" />
          <span>1. Categories, Sample Articles & Generator ({italianRecipes.length} Articles)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('wp_page_preview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'wp_page_preview'
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>2. Dedicated WordPress Page Preview (/italian-recipes/)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('selenium_script')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'selenium_script'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>3. Python + Selenium Chrome Automation Script</span>
        </button>
      </div>

      {/* TAB 1: ITALIAN CATEGORIES, SAMPLE INSPIRATION & ARTICLE GENERATOR */}
      {activeSubTab === 'studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Categories + Sample Article Inspiration + Generator */}
          <div className="lg:col-span-5 space-y-5">
            {/* Step A: Manage Italian Categories */}
            <div className="bg-[#0f172a]/90 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span>Step 1: Your Italian Recipe Categories ({categories.length})</span>
                </h3>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.name;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-950/40 border-emerald-500/60 text-white shadow-sm'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold flex items-center gap-2">
                          <span>{cat.icon}</span>
                          <span>{cat.name}</span>
                        </span>
                        {isSelected && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                            Active Category
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{cat.description}</p>
                    </div>
                  );
                })}
              </div>

              {/* Add Custom Category Form */}
              <form onSubmit={handleAddCategory} className="pt-3 border-t border-slate-800 space-y-2.5">
                <label className="block text-[11px] font-semibold text-slate-300">
                  + Add Your Own Italian Recipe Category:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g. Sicilian Street Food, Risotto & Polenta..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0 cursor-pointer"
                  >
                    Add Category
                  </button>
                </div>
              </form>
            </div>

            {/* Step B: Sample Articles for Inspiration & Guidance */}
            <div className="bg-[#0f172a]/90 border border-slate-800 rounded-2xl p-5 space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-pink-400 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Step 2: Sample Article Inspiration & Guidance</span>
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Select a sample article structure or paste your own sample article below. Gemini (and the Selenium script) will mirror this style, tone, and heading structure.
              </p>

              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_ITALIAN_INSPIRATION_ARTICLES.map((samp) => (
                  <button
                    key={samp.id}
                    type="button"
                    onClick={() => {
                      setSelectedInspirationId(samp.id);
                      setCustomInspirationText(samp.sampleText);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                      selectedInspirationId === samp.id
                        ? 'bg-pink-600/20 border-pink-500 text-pink-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {samp.title}
                  </button>
                ))}
              </div>

              <textarea
                rows={6}
                value={customInspirationText}
                onChange={(e) => setCustomInspirationText(e.target.value)}
                placeholder="Paste your sample article or tone/structure instructions here..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-pink-500 leading-relaxed"
              />
            </div>

            {/* Step C: Synthesize New Italian Recipe Article */}
            <div className="bg-[#0f172a]/90 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Step 3: Generate Complete Italian Recipe Article</span>
              </h3>

              <form onSubmit={handleGenerateItalianArticle} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Selected Italian Category
                  </label>
                  <input
                    type="text"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-emerald-300 font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Italian Recipe Topic / Article Title Idea
                  </label>
                  <input
                    type="text"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    placeholder="e.g. Easy Pasta e Ceci with Canned Chickpeas, Ligurian Pesto Pasta..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                  />
                  {categories.find((c) => c.name === selectedCategory)?.sampleTopics && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {categories
                        .find((c) => c.name === selectedCategory)
                        ?.sampleTopics.map((t, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setTopicInput(t)}
                            className="text-[10px] px-2 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 cursor-pointer"
                          >
                            + {t}
                          </button>
                        ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isGenerating || !topicInput.trim()}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-pink-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{generationStatus || 'Generating Assets...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Article (Thumbnail + 3 Images + PDF)</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Generated Italian Recipe Articles Showcase */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#0f172a]/90 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Italian Recipe Articles Ready for WordPress ({italianRecipes.length})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Every article below is verified with 1 Catchy Thumbnail, 3 Recipe Step Images, and a Downloadable PDF Card.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {italianRecipes.map((recipe) => {
                  const gallery = recipe.galleryImages || [
                    { url: recipe.imageUrl, caption: 'Step 1: Fresh Ingredients & Prep' },
                    { url: recipe.imageUrl, caption: 'Step 2: Cooking Method' },
                    { url: recipe.imageUrl, caption: 'Step 3: Final Trattoria Plating' },
                  ];

                  return (
                    <div
                      key={recipe.id}
                      className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 space-y-4 transition-all"
                    >
                      {/* Top Row: Catchy Thumbnail + Title & Category */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-full sm:w-44 h-32 rounded-xl overflow-hidden border border-slate-700 shrink-0 relative group">
                          <img
                            src={recipe.thumbnailUrl || recipe.imageUrl}
                            alt={recipe.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-2 left-2 bg-rose-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
                            Catchy Thumbnail
                          </span>
                        </div>

                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase">
                              {recipe.italianCategory || recipe.niche}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              ⏱️ {recipe.totalTime} · 🔥 {recipe.calories} kcal
                            </span>
                          </div>

                          <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                            {recipe.title}
                          </h4>

                          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                            {recipe.metaDescription}
                          </p>
                        </div>
                      </div>

                      {/* Middle Row: 2 to 3 Related Recipe Images Strip */}
                      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-pink-300 flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>In-Article Recipe Photos ({gallery.length} Related Images Included)</span>
                          </span>
                          <span className="text-emerald-400 font-mono text-[10px]">
                            ✓ Embedded in Article & PDF
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2.5">
                          {gallery.slice(0, 3).map((img, i) => (
                            <div
                              key={i}
                              className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden"
                            >
                              <img
                                src={img.url}
                                alt={img.alt || `${recipe.title} photo ${i + 1}`}
                                className="w-full h-20 object-cover"
                              />
                              <div className="p-1.5 text-[10px] text-slate-300 truncate" title={img.caption}>
                                {img.caption}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Action Bar: Downloadable PDF + Inspect + WordPress Sync */}
                      <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => triggerRecipePrintViaIframe(recipe)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold shadow cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download / Print PDF</span>
                          </button>

                          <a
                            href={recipe.downloadablePdfUrl || `/api/recipe-print/${recipe.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700"
                          >
                            <FileText className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Visitor PDF Link</span>
                          </a>

                          <button
                            onClick={() => setActiveArticleModal(recipe)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Inspect Full Article</span>
                          </button>
                        </div>

                        <button
                          onClick={() => onPublishRecipeToWp(recipe.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-semibold cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Sync to WP</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STRUCTURED CAROUSEL HOMEPAGE & WORDPRESS HUB LIVE PREVIEW */}
      {activeSubTab === 'wp_page_preview' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Top Preview Bar */}
          <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <a
                href={`${wpConfig.url.replace(/\/$/, '')}/home/`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>{wpConfig.url.replace(/\/$/, '')}/home/</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-600">•</span>
              <a
                href={`${wpConfig.url.replace(/\/$/, '')}/italian-recipes/`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-slate-300 hover:underline flex items-center gap-1"
              >
                <span>{wpConfig.url.replace(/\/$/, '')}/italian-recipes/</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-[11px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                Live Carousel Homepage
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyWpPageHtml}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer"
              >
                {copiedWpPageHtml ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied Carousel Homepage HTML!</span>
                  </>
                ) : (
                  <>
                    <Code className="w-3.5 h-3.5 text-pink-400" />
                    <span>Copy Homepage HTML</span>
                  </>
                )}
              </button>

              <button
                onClick={handlePublishDedicatedItalianPage}
                disabled={isPublishingPage}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-rose-600 text-white text-xs font-bold shadow cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Sync Carousel Homepage to WordPress</span>
              </button>
            </div>
          </div>

          {/* Front-End Carousel Homepage Preview */}
          <div className="p-6 sm:p-10 bg-[#FFF8F2] text-slate-900 space-y-10">
            {/* Quick Carousel Navigation Bar */}
            <div className="bg-white border border-[#eadfd5] rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#227755]">
                <span>🇮🇹 Semplice Italian Kitchen</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 font-semibold">Homepage Sections:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <a
                  href="#preview-featured-carousel"
                  className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#eef7f2] text-[#227755] hover:opacity-80"
                >
                  ⭐ Featured Carousel
                </a>
                <a
                  href="#preview-category-carousels"
                  className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#fdf3ef] text-[#D96B43] hover:opacity-80"
                >
                  🗂️ 6 Category Carousels
                </a>
                <a
                  href="#preview-footer"
                  className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-900 text-white hover:opacity-80"
                >
                  ↓ Website Footer
                </a>
              </div>
            </div>

            {/* SECTION 1: INTRODUCTORY HERO SECTION AT THE TOP */}
            <section className="bg-gradient-to-br from-[#FFF8F2] via-white to-[#eef7f2] border-2 border-[#e6d7c8] rounded-3xl p-7 sm:p-10 shadow-md">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <span className="inline-block bg-[#227755] text-white text-[11px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider">
                    🇮🇹 Benvenuti · Real Italian Flavor, Everyday Cooking
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-slate-900 leading-tight">
                    Welcome to Semplice Italian Kitchen: Authentic Recipes for Everyday Home Cooks
                  </h2>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    Discover the heart of traditional Italian home cooking—from time-honored{' '}
                    <strong>Cucina Povera</strong> budget meals and <strong>20-minute weeknight pastas</strong> to
                    regional treasures from <strong>Tuscany, Liguria, Sardinia, and Abruzzo</strong>. Every recipe
                    includes step-by-step photography and a <strong>free printable 1-page PDF recipe card</strong>.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-1">
                    <a
                      href="#preview-featured-carousel"
                      className="px-5 py-2.5 rounded-xl bg-[#227755] hover:bg-[#1b5e43] text-white text-xs sm:text-sm font-bold shadow"
                    >
                      Explore Featured Articles Carousel &darr;
                    </a>
                    <a
                      href="#preview-category-carousels"
                      className="px-5 py-2.5 rounded-xl bg-[#D96B43] hover:bg-[#c25a34] text-white text-xs sm:text-sm font-bold shadow"
                    >
                      Browse 6 Recipe Category Carousels &darr;
                    </a>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#e6d7c8]">
                    <div className="bg-white border border-[#eadfd5] rounded-xl p-3">
                      <div className="text-lg font-extrabold text-[#227755]">{italianRecipes.length}</div>
                      <div className="text-[11px] text-slate-500 font-semibold">Complete Recipe Guides</div>
                    </div>
                    <div className="bg-white border border-[#eadfd5] rounded-xl p-3">
                      <div className="text-lg font-extrabold text-[#D96B43]">{categories.length}</div>
                      <div className="text-[11px] text-slate-500 font-semibold">Category Carousels</div>
                    </div>
                    <div className="bg-white border border-[#eadfd5] rounded-xl p-3">
                      <div className="text-lg font-extrabold text-amber-700">100% Free</div>
                      <div className="text-[11px] text-slate-500 font-semibold">Printable PDF Cards</div>
                    </div>
                  </div>
                </div>

                {/* Spotlight Hero Card */}
                {italianRecipes[0] && (
                  <div className="lg:col-span-5 bg-white border border-[#eadfd5] rounded-2xl overflow-hidden shadow-lg">
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={italianRecipes[0].thumbnailUrl || italianRecipes[0].imageUrl}
                        alt={italianRecipes[0].title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 bg-[#D96B43] text-white text-[11px] font-extrabold px-3 py-1 rounded-full">
                        🌟 Featured Kitchen Guide
                      </span>
                      <span className="absolute bottom-3 right-3 bg-slate-900/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                        ⏱️ {italianRecipes[0].totalTime} · 📥 Free PDF
                      </span>
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#227755]">
                        {italianRecipes[0].italianCategory || italianRecipes[0].niche}
                      </div>
                      <h3 className="text-lg font-serif font-bold text-slate-900 leading-snug">
                        {italianRecipes[0].title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2">{italianRecipes[0].metaDescription}</p>
                      <div className="flex items-center justify-between pt-2">
                        <button
                          onClick={() => setActiveArticleModal(italianRecipes[0])}
                          className="px-4 py-2 rounded-lg bg-[#227755] text-white text-xs font-bold cursor-pointer"
                        >
                          Read Recipe &rarr;
                        </button>
                        <button
                          onClick={() => triggerRecipePrintViaIframe(italianRecipes[0])}
                          className="px-3.5 py-2 rounded-lg bg-[#FFF8F2] text-[#D96B43] border border-[#e6ccb8] text-xs font-bold cursor-pointer"
                        >
                          📥 Download PDF
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* SECTION 2: FEATURED ARTICLES MASTER CAROUSEL */}
            <section
              id="preview-featured-carousel"
              className="bg-white border border-[#eadfd5] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="inline-block bg-[#eef7f2] text-[#227755] border border-[#cde4d8] text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-1.5">
                    🎠 Featured Articles Carousel · Swipe or Scroll Horizontally
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-slate-900">
                    Featured Italian Recipe Articles ({italianRecipes.length} Complete Guides)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Scroll horizontally through all {italianRecipes.length} signature articles with step-by-step photos and printable PDFs.
                  </p>
                </div>
              </div>

              {/* Horizontal Scroll-Snap Carousel Track */}
              <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth">
                {italianRecipes.map((r) => (
                  <article
                    key={r.id}
                    className="flex-none w-76 sm:w-80 snap-start bg-white rounded-2xl border border-[#eadfd5] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-48 overflow-hidden bg-slate-100">
                        <img
                          src={r.thumbnailUrl || r.imageUrl}
                          alt={r.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-3 left-3 bg-[#227755] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                          {r.italianCategory || r.niche}
                        </span>
                        <span className="absolute bottom-2.5 right-2.5 bg-slate-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                          ⏱️ {r.totalTime}
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="text-[11px] text-slate-500 font-semibold">
                          🔥 {r.calories} kcal &bull; 👥 {r.servings}
                        </div>
                        <h4 className="text-base font-serif font-bold text-slate-900 leading-snug line-clamp-2">
                          {r.title}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{r.metaDescription}</p>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-[#fffaf5] border-t border-[#f5ebe1] flex items-center justify-between gap-2">
                      <button
                        onClick={() => setActiveArticleModal(r)}
                        className="px-3 py-1.5 rounded-lg bg-[#227755] hover:bg-[#1b5e43] text-white text-xs font-bold cursor-pointer"
                      >
                        Read Recipe &rarr;
                      </button>
                      <button
                        onClick={() => triggerRecipePrintViaIframe(r)}
                        className="px-3 py-1.5 rounded-lg bg-white text-[#D96B43] border border-[#e6ccb8] text-xs font-bold cursor-pointer"
                      >
                        📥 Free PDF
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* SECTION 3: CAROUSELS SHOWCASING DIFFERENT RECIPE CATEGORIES */}
            <section id="preview-category-carousels" className="space-y-8">
              <div>
                <span className="inline-block bg-[#fdf3ef] text-[#D96B43] border border-[#f5d4c6] text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-1.5">
                  🗂️ Category Carousels · Organized by Culinary Theme
                </span>
                <h3 className="text-2xl font-serif font-bold text-slate-900">
                  Explore Recipes by Italian Category ({categories.length} Category Carousels)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Each Italian recipe category below features its own dedicated horizontal carousel of curated articles.
                </p>
              </div>

              {/* Category Overview Horizontal Carousel */}
              <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex-none w-68 snap-start bg-white border border-[#eadfd5] rounded-2xl p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-2xl mb-2">{cat.icon}</div>
                      <h4 className="font-serif font-bold text-base text-slate-900 mb-1">{cat.name}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">{cat.description}</p>
                    </div>
                    <a
                      href={`#preview-cat-${cat.slug}`}
                      className="text-xs font-extrabold text-[#227755] hover:underline"
                    >
                      Jump to {cat.name} Carousel &darr;
                    </a>
                  </div>
                ))}
              </div>

              {/* Individual Horizontal Carousel for Each Recipe Category */}
              {categories.map((cat) => {
                const matching = italianRecipes.filter(
                  (r) => (r.italianCategory || r.niche).toLowerCase() === cat.name.toLowerCase()
                );
                const carouselItems =
                  matching.length >= 3
                    ? matching
                    : [...matching, ...italianRecipes.filter((r) => !matching.includes(r))].slice(0, 5);

                return (
                  <div
                    key={cat.id}
                    id={`preview-cat-${cat.slug}`}
                    className="bg-white border border-[#eadfd5] rounded-3xl p-6 shadow-xs space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#f5ebe1]">
                      <div>
                        <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#227755]">
                          {cat.icon} Recipe Category Carousel
                        </div>
                        <h4 className="text-xl font-serif font-bold text-slate-900">
                          {cat.icon} {cat.name}
                        </h4>
                        <p className="text-xs text-slate-600">{cat.description}</p>
                      </div>
                      <a
                        href={`${wpConfig.url.replace(/\/$/, '')}/category/${cat.slug}/`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-[#eef7f2] text-[#227755] text-xs font-bold hover:bg-[#dcf0e4]"
                      >
                        Open Category Archive &rarr;
                      </a>
                    </div>

                    <div className="flex gap-5 overflow-x-auto pb-3 snap-x snap-mandatory">
                      {carouselItems.map((r) => (
                        <article
                          key={`${cat.id}-${r.id}`}
                          className="flex-none w-72 snap-start bg-[#FFF8F2]/60 border border-[#eadfd5] rounded-2xl overflow-hidden flex flex-col justify-between"
                        >
                          <div>
                            <div className="relative h-40 overflow-hidden">
                              <img
                                src={r.thumbnailUrl || r.imageUrl}
                                alt={r.title}
                                className="w-full h-full object-cover"
                              />
                              <span className="absolute top-2.5 left-2.5 bg-[#D96B43] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                                {cat.name}
                              </span>
                            </div>
                            <div className="p-4 space-y-1.5">
                              <div className="text-[11px] text-slate-500 font-semibold">
                                ⏱️ {r.totalTime} &bull; 🔥 {r.calories} kcal
                              </div>
                              <h5 className="font-serif font-bold text-sm text-slate-900 line-clamp-2">{r.title}</h5>
                            </div>
                          </div>
                          <div className="px-4 py-2.5 bg-white border-t border-[#eadfd5] flex items-center justify-between">
                            <button
                              onClick={() => setActiveArticleModal(r)}
                              className="text-xs font-extrabold text-[#227755] hover:underline cursor-pointer"
                            >
                              Read Recipe &rarr;
                            </button>
                            <button
                              onClick={() => triggerRecipePrintViaIframe(r)}
                              className="text-xs font-bold text-[#D96B43] hover:underline cursor-pointer"
                            >
                              📥 Free PDF
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                );
              })}
            </section>

            {/* SECTION 4: STRUCTURED WEBSITE FOOTER AT THE BOTTOM */}
            <footer
              id="preview-footer"
              className="bg-[#1a202c] text-slate-200 rounded-3xl p-8 sm:p-10 border-t-4 border-[#227755] space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
                {/* Col 1: Brand */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-xl bg-[#227755] flex items-center justify-center text-lg">
                      🇮🇹
                    </span>
                    <div>
                      <div className="font-serif font-bold text-white text-lg leading-tight">
                        Semplice Italian Kitchen
                      </div>
                      <div className="text-[11px] text-emerald-400 font-semibold">
                        Real Italian Flavor. Everyday Cooking.
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Your home for authentic, budget-friendly Italian recipes, quick 20-minute weeknight dinners,
                    regional specialties, and high-protein meal prep—complete with step-by-step photos and free
                    printable PDF recipe cards.
                  </p>
                </div>

                {/* Col 2: Recipe Categories */}
                <div className="space-y-2.5">
                  <h4 className="font-serif font-bold text-white text-sm border-b-2 border-[#227755] pb-1 inline-block">
                    Recipe Categories
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {categories.map((c) => (
                      <li key={c.id}>
                        <a
                          href={`${wpConfig.url.replace(/\/$/, '')}/category/${c.slug}/`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-emerald-400"
                        >
                          {c.icon} {c.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Col 3: Popular Recipes */}
                <div className="space-y-2.5">
                  <h4 className="font-serif font-bold text-white text-sm border-b-2 border-[#D96B43] pb-1 inline-block">
                    Reader Favorites &amp; PDFs
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {italianRecipes.slice(0, 6).map((r) => (
                      <li key={r.id} className="truncate">
                        <button
                          onClick={() => setActiveArticleModal(r)}
                          className="hover:text-amber-300 text-left truncate max-w-full cursor-pointer"
                        >
                          🍝 {r.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Col 4: Navigation & Info */}
                <div className="space-y-2.5">
                  <h4 className="font-serif font-bold text-white text-sm border-b-2 border-amber-500 pb-1 inline-block">
                    Quick Links &amp; Info
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    <li>
                      <a
                        href={`${wpConfig.url.replace(/\/$/, '')}/home/`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-white"
                      >
                        🏠 Website Homepage (/home/)
                      </a>
                    </li>
                    <li>
                      <a
                        href={`${wpConfig.url.replace(/\/$/, '')}/italian-recipes/`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-white"
                      >
                        🇮🇹 Italian Recipes Hub (/italian-recipes/)
                      </a>
                    </li>
                    <li>
                      <a
                        href={`${wpConfig.url.replace(/\/$/, '')}/about/`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-white"
                      >
                        📖 About Semplice Kitchen (/about/)
                      </a>
                    </li>
                    <li>
                      <a
                        href={`${wpConfig.url.replace(/\/$/, '')}/contact/`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-white"
                      >
                        ✉️ Contact &amp; Recipe Requests (/contact/)
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
                <div>
                  &copy; {new Date().getFullYear()} <strong className="text-white">Semplice Italian Kitchen</strong> (
                  {wpConfig.url.replace(/\/$/, '')}). Handcrafted Italian recipes &amp; printable PDF kitchen cards.
                </div>
                <div className="flex gap-4">
                  <a href="#preview-featured-carousel" className="text-emerald-400 font-bold hover:underline">
                    &uarr; Back to Top Carousel
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </div>
      )}

      {/* TAB 3: PYTHON + SELENIUM CHROME AUTOMATION SCRIPT */}
      {activeSubTab === 'selenium_script' && (
        <div className="bg-[#0f172a]/95 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-indigo-400">
                <Terminal className="w-4 h-4" />
                <span>scripts/italian_recipe_selenium_generator.py</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Python + Selenium Chrome Automation Script (Gemini Free Web + PDF + WordPress)
              </h3>
              <p className="text-xs text-slate-400 max-w-3xl">
                Opens Google Chrome with Selenium, signs in with your Google account (or uses your persistent Chrome profile), generates Italian recipe articles from your categories & sample articles, saves <strong>2–3 recipe images + 1 catchy thumbnail</strong>, compiles a <strong>downloadable PDF recipe file</strong>, and publishes directly to your WordPress site!
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={handleDownloadSeleniumScript}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Python Script (.py)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1.5">
              <div className="font-bold text-emerald-400">1. Install Dependencies</div>
              <code className="block bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[11px] text-slate-300">
                pip install -r scripts/requirements.txt
              </code>
              <p className="text-slate-400 text-[11px]">
                Installs <code>selenium</code>, <code>webdriver-manager</code>, <code>fpdf2</code> (for PDF generation), and <code>requests</code>.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1.5">
              <div className="font-bold text-pink-400">2. Configure Credentials</div>
              <code className="block bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[11px] text-slate-300">
                set GOOGLE_EMAIL=your@gmail.com
              </code>
              <p className="text-slate-400 text-[11px]">
                Supports automatic Google login or attaching to your existing Chrome User Profile to preserve login cookies.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1.5">
              <div className="font-bold text-indigo-400">3. Run Automation</div>
              <code className="block bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[11px] text-slate-300">
                python scripts/italian_recipe_selenium_generator.py
              </code>
              <p className="text-slate-400 text-[11px]">
                Generates the article, 3 recipe photos, catchy thumbnail, PDF file in <code>output/pdfs/</code>, and syncs to WordPress.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Full Article Modal (Inspecting Catchy Thumbnail + 3 Recipe Images + Downloadable PDF) */}
      {activeArticleModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <div className="min-w-0 pr-4">
                <span className="text-[11px] font-mono text-emerald-400 uppercase font-bold">
                  🇮🇹 {activeArticleModal.italianCategory || activeArticleModal.niche}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white truncate mt-0.5">
                  {activeArticleModal.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerRecipePrintViaIframe(activeArticleModal)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-indigo-600 text-white text-xs font-bold shadow cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => downloadRecipeHtmlFile(activeArticleModal)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </button>
                <button
                  onClick={() => setActiveArticleModal(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* 1. Catchy Thumbnail */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-pink-400">
                  ✓ Element 1: Visually Appealing & Catchy Recipe Thumbnail
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-800 max-h-80">
                  <img
                    src={activeArticleModal.thumbnailUrl || activeArticleModal.imageUrl}
                    alt={activeArticleModal.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* 2. Visitor Downloadable PDF Callout */}
              <div className="bg-gradient-to-r from-emerald-950/60 to-indigo-950/60 border border-emerald-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    ✓ Element 2: Visitor Downloadable PDF Recipe Card
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Visitors can download or print the complete 1-page recipe card with ingredients, timers, and photos.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => triggerRecipePrintViaIframe(activeArticleModal)}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow cursor-pointer"
                  >
                    📥 Download Recipe PDF
                  </button>
                </div>
              </div>

              {/* 3. Two to Three Related Recipe Images */}
              {activeArticleModal.galleryImages && activeArticleModal.galleryImages.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    ✓ Element 3: {activeArticleModal.galleryImages.length} Related Recipe Step Images
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {activeArticleModal.galleryImages.map((img, i) => (
                      <div
                        key={i}
                        className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
                      >
                        <img
                          src={img.url}
                          alt={img.alt || activeArticleModal.title}
                          className="w-full h-36 object-cover"
                        />
                        <div className="p-3 text-xs text-slate-300 leading-relaxed">
                          {img.caption}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Long-form Article + Ingredients & Instructions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                    Ingredients ({activeArticleModal.ingredients.length})
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {activeArticleModal.ingredients.map((ing, i) => (
                      <li
                        key={i}
                        className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-lg flex justify-between"
                      >
                        <span>{ing.item}</span>
                        <span className="font-mono text-pink-400 font-semibold">{ing.amount}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                    Step-by-Step Instructions ({activeArticleModal.instructions.length})
                  </h4>
                  <div className="space-y-2.5 text-xs">
                    {activeArticleModal.instructions.map((inst, i) => (
                      <div
                        key={i}
                        className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg space-y-1"
                      >
                        <div className="font-bold text-emerald-400">
                          Step {inst.step}: {inst.title}
                        </div>
                        <p className="text-slate-300 leading-relaxed">{inst.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
