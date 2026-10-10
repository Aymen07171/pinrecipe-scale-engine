import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { INITIAL_RECIPES } from './src/data/sampleRecipes';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

const getGeminiClient = () => {
  const apiKey = process.env.CODECRAFT_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('API key (GEMINI_API_KEY or CODECRAFT_API_KEY) is not configured in the server environment.');
  }
  const config: any = { apiKey };
  if (process.env.CODECRAFT_API_URL && !process.env.CODECRAFT_API_URL.includes('codecraftapi.com')) {
    config.httpOptions = {
      baseUrl: process.env.CODECRAFT_API_URL.replace(/\/$/, ''),
      headers: { 'User-Agent': 'aistudio-build' },
    };
  }
  return new GoogleGenAI(config);
};

// 1. Generate full structured recipe & SEO payload (with Italian Category, Sample Inspiration & 3 Gallery Images)
app.post('/api/generate-recipe', async (req, res) => {
  try {
    const { topic, niche, dietary, targetAudience, themeCategory, italianCategory, sampleInspiration } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Recipe topic is required' });
    }

    const activeCategory = italianCategory || themeCategory || niche || 'Budget-Friendly Italian';
    const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // Select matching Italian photography assets for thumbnail & 2-3 gallery images
    const lowerTopic = (topic + ' ' + activeCategory).toLowerCase();
    let thumbUrl = '/src/assets/images/italian_pasta_e_ceci_chickpeas.jpg';
    if (lowerTopic.includes('ceci') || lowerTopic.includes('chickpea')) {
      thumbUrl = '/src/assets/images/italian_pasta_e_ceci_chickpeas.jpg';
    } else if (lowerTopic.includes('fagioli') || lowerTopic.includes('bean') || lowerTopic.includes('tuscan')) {
      thumbUrl = '/src/assets/images/italian_tuscan_white_beans_fagioli.jpg';
    } else if (lowerTopic.includes('pesto') || lowerTopic.includes('liguria')) {
      thumbUrl = '/src/assets/images/italian_ligurian_pesto_trenette.jpg';
    } else if (lowerTopic.includes('fregola') || lowerTopic.includes('sardinia') || lowerTopic.includes('seafood') || lowerTopic.includes('crespelle') || lowerTopic.includes('brodo')) {
      thumbUrl = '/src/assets/images/italian_sardinian_fregola_seafood.jpg';
    } else if (lowerTopic.includes('lentil')) {
      thumbUrl = '/src/assets/images/italian_lentil_ragu_pappardelle.jpg';
    } else if (lowerTopic.includes('frittata') || lowerTopic.includes('air-fryer') || lowerTopic.includes('air fryer')) {
      thumbUrl = '/src/assets/images/italian_frittata_green_beans.jpg';
    } else if (lowerTopic.includes('pizza') || lowerTopic.includes('focaccia')) {
      thumbUrl = '/src/assets/images/italian_margherita_pizza_woodfired.jpg';
    } else if (lowerTopic.includes('lasagna') || lowerTopic.includes('bolognese') || lowerTopic.includes('ragu')) {
      thumbUrl = '/src/assets/images/italian_lasagna_bolognese_layers.jpg';
    } else if (lowerTopic.includes('tiramisu') || lowerTopic.includes('dolci') || lowerTopic.includes('dessert')) {
      thumbUrl = '/src/assets/images/italian_tiramisu_espresso_dolci.jpg';
    } else if (lowerTopic.includes('bread') || lowerTopic.includes('panzanella') || lowerTopic.includes('bruschetta') || lowerTopic.includes('burrata')) {
      thumbUrl = '/src/assets/images/italian_burrata_bruschetta_antipasti.jpg';
    } else if (lowerTopic.includes('pantry') || lowerTopic.includes('carbonara') || lowerTopic.includes('pasta')) {
      thumbUrl = '/src/assets/images/italian_pasta_carbonara_hero.jpg';
    }

    const defaultGalleryImages = [
      {
        url: '/src/assets/images/italian_pasta_prep_ingredients.jpg',
        caption: `Step 1: Authentic DOP Ingredients & Mise en Place for ${topic}`,
        alt: `${topic} ingredients preparation`
      },
      {
        url: thumbUrl,
        caption: `Step 2: Active Culinary Technique & Emulsion for ${topic}`,
        alt: `${topic} cooking process`
      },
      {
        url: '/src/assets/images/italian_burrata_bruschetta_antipasti.jpg',
        caption: `Step 3: Traditional Italian Trattoria Plating & Presentation`,
        alt: `${topic} final plating`
      }
    ];

    try {
      const ai = getGeminiClient();
      const inspirationBlock = sampleInspiration
        ? `\nFollow this Sample Article Inspiration & Guidance closely:\n${sampleInspiration}\n`
        : '';

      const prompt = `You are the core programmatic SEO culinary intelligence of PinRecipe Scale Engine (Scale v4.0).
Generate an exhaustive, high-converting, Google-compliant Recipe structure and full-length article for:
Topic: "${topic}"
Category: "${activeCategory}"
Dietary Requirements: "${dietary || 'Authentic Italian'}"
Target Audience: "${targetAudience || 'Food lovers seeking authentic Italian culinary masterpieces'}"
${inspirationBlock}
Every article MUST include a catchy thumbnail prompt, 3 step-by-step recipe image captions, and a downloadable PDF reference.

Return ONLY valid JSON matching this schema without markdown code blocks:
{
  "title": "Full Catchy SEO Recipe Title",
  "slug": "${slug}",
  "themeCategory": "${activeCategory}",
  "italianCategory": "${activeCategory}",
  "metaDescription": "Engaging 140-160 character meta description for Google Search.",
  "focusKeyword": "primary focus keyword",
  "prepTime": "15 mins",
  "cookTime": "25 mins",
  "totalTime": "40 mins",
  "servings": "4 servings",
  "calories": 510,
  "difficulty": "Medium",
  "longArticleContent": "Full in-depth culinary article in Markdown with H2 and H3 headings: 1) The Regional Italian Heritage & Story, 2) Why This Recipe Works (Culinary Science & Emulsion Chemistry), 3) Visual Step Checkpoints (referencing the 3 recipe photos), 4) Serving Suggestions & Printable PDF Guide.",
  "macros": {
    "protein": "26g",
    "carbs": "52g",
    "fat": "22g",
    "fiber": "4g"
  },
  "ingredients": [
    { "item": "ingredient name", "amount": "quantity with units", "notes": "DOP or prep detail" }
  ],
  "instructions": [
    { "step": 1, "title": "Step summary", "text": "Detailed action-oriented instruction", "timerMinutes": 5 }
  ],
  "chefTips": [
    "Expert culinary tip 1",
    "Expert culinary tip 2"
  ],
  "macroPhotoPrompt": "Ultra-detailed photography prompt for a visually appealing and catchy recipe thumbnail matching ${activeCategory}",
  "pinterestPin": {
    "title": "High-CTR Pinterest Pin Title",
    "description": "Engaging Pinterest description with rich sensory words, hook, and free PDF call to action.",
    "hashtags": ["#italianrecipes", "#italiancooking", "#authenticitalian"],
    "overlayHeadline": "3-5 word headline for vertical pin overlay image"
  },
  "schemaJsonLd": {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "name": "Recipe Title",
    "description": "Recipe summary",
    "prepTime": "PT15M",
    "cookTime": "PT25M",
    "totalTime": "PT40M",
    "recipeYield": "4 servings",
    "recipeCategory": "${activeCategory}",
    "recipeCuisine": "Italian",
    "keywords": "italian recipe, authentic, dinner"
  }
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [{ text: prompt }],
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '{}';
      let parsedData;
      try {
        parsedData = JSON.parse(responseText);
      } catch {
        const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedData = JSON.parse(cleaned);
      }

      parsedData.thumbnailUrl = thumbUrl;
      parsedData.galleryImages = defaultGalleryImages;
      parsedData.downloadablePdfUrl = `/api/recipe-print/${parsedData.slug || slug}`;

      return res.json({ success: true, data: parsedData });
    } catch (aiErr: any) {
      // Fallback synthesis so Italian article generation works even without GEMINI_API_KEY configured
      const fallbackData = {
        title: `Authentic Italian ${topic} (Trattoria Method)`,
        slug,
        themeCategory: activeCategory,
        italianCategory: activeCategory,
        thumbnailUrl: thumbUrl,
        galleryImages: defaultGalleryImages,
        downloadablePdfUrl: `/api/recipe-print/${slug}`,
        metaDescription: `Learn how to prepare authentic ${topic} (${activeCategory}) with 3 step-by-step photos, DOP ingredients, and a free downloadable PDF recipe card.`,
        focusKeyword: `${topic.toLowerCase()} italian recipe`,
        prepTime: '15 mins',
        cookTime: '20 mins',
        totalTime: '35 mins',
        servings: '4 servings',
        calories: 510,
        difficulty: 'Medium',
        longArticleContent: `## The Authentic Italian Story of ${topic}\n\nInspired by classic regional kitchens under **${activeCategory}**, this recipe celebrates pure Italian DOP ingredients and precise temperature control.\n\n### Why This Recipe Works\n1. **Starch & Fat Emulsion:** Combining bronze-die pasta or high-hydration dough with freshly grated aged cheese creates a velvety glaze.\n2. **Visual Checkpoints:** Follow the 3 step-by-step photographs included in this article and download the 1-page printable PDF card for your kitchen counter.`,
        macros: { protein: '25g', carbs: '54g', fat: '21g', fiber: '4g' },
        ingredients: [
          { item: `Artisanal Italian Base for ${topic}`, amount: '400g (14 oz)', notes: 'Bronze-die or Tipo 00' },
          { item: 'Aged Pecorino Romano or Parmigiano-Reggiano DOP', amount: '90g', notes: 'freshly micro-grated' },
          { item: 'Cold-Pressed Tuscan Extra Virgin Olive Oil', amount: '3 tbsp' },
          { item: 'Fresh Sweet Genovese Basil & Garlic Cloves', amount: '1 handful basil, 2 cloves garlic' },
          { item: 'Coarse Mediterranean Sea Salt & Cracked Black Pepper', amount: 'to taste' }
        ],
        instructions: [
          { step: 1, title: 'Mise en Place & DOP Ingredients', text: `Arrange and measure all authentic ingredients for ${topic} on a cool surface before heating the pan.`, timerMinutes: 5 },
          { step: 2, title: 'Build the Aromatic Foundation', text: 'Gently warm cold-pressed olive oil with aromatics over medium-low heat to infuse flavor without scorching.', timerMinutes: 8 },
          { step: 3, title: 'Off-Heat Emulsion & Glossy Finish', text: 'Fold in freshly grated DOP cheese with a splash of starchy cooking water, tossing vigorously until a glossy sauce coats every bite.', timerMinutes: 4 },
          { step: 4, title: 'Trattoria Plating & PDF Checklist', text: 'Serve immediately in warmed ceramic bowls. Click the Download Recipe PDF button above to save or print this recipe card.' }
        ],
        chefTips: [
          'Never use pre-grated cheese—freshly grated DOP Parmigiano or Pecorino melts into a smooth, silky emulsion without clumping.',
          'Save or print the downloadable 1-page PDF card included in this article for quick kitchen reference.'
        ],
        macroPhotoPrompt: `Catchy gourmet Italian food photography thumbnail of ${topic}, warm sunlit trattoria table, 8k DSLR`,
        pinterestPin: {
          title: `Authentic Italian ${topic} Recipe (With Free Printable PDF!)`,
          description: `Make restaurant-quality ${topic} at home! Includes 3 step-by-step recipe photos and a free downloadable PDF card.`,
          hashtags: ['#italianrecipes', '#italiancooking', '#authenticitalian', '#trattoria'],
          overlayHeadline: `Authentic ${topic}`
        },
        schemaJsonLd: {
          '@context': 'https://schema.org',
          '@type': 'Recipe',
          name: `Authentic Italian ${topic}`,
          description: `Traditional Italian recipe for ${topic} with 3 step photos and downloadable PDF.`,
          prepTime: 'PT15M',
          cookTime: 'PT20M',
          totalTime: 'PT35M',
          recipeYield: '4 servings',
          recipeCategory: activeCategory,
          recipeCuisine: 'Italian'
        }
      };
      return res.json({ success: true, data: fallbackData, fallbackUsed: true });
    }
  } catch (error: any) {
    console.error('Error generating recipe:', error);
    res.status(500).json({
      error: error.message || 'Failed to synthesize recipe',
    });
  }
});

// 2. Generate programmatic keyword batches for a niche
app.post('/api/generate-keywords', async (req, res) => {
  try {
    const { niche, count = 5 } = req.body;
    const ai = getGeminiClient();

    const prompt = `Generate ${count} high-intent, trending programmatic recipe search keywords for the niche: "${niche || 'Healthy Air Fryer'}".
For each item, provide:
- topic: recipe name
- targetNiche: categorization
- estimatedVolume: monthly search volume estimate (e.g. 18.5k/mo)
- difficultyScore: percentage difficulty (e.g. 24%)
- pinPotential: "High" | "Viral" | "Evergreen"
- dietary: relevant tag

Return ONLY a valid JSON array of objects without markdown wrappers.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [{ text: prompt }],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    res.json({ success: true, keywords: parsed });
  } catch (error: any) {
    console.error('Error generating keywords:', error);
    res.status(500).json({ error: error.message || 'Failed to generate keywords' });
  }
});

const resolveImageBase64 = (imgSource: string) => {
  if (!imgSource) return undefined;
  if (imgSource.startsWith('data:') || imgSource.startsWith('http://') || imgSource.startsWith('https://')) {
    return imgSource;
  }
  const cleaned = imgSource.replace(/^\//, '');
  const candidatePath = path.resolve(__dirname, cleaned);
  if (fs.existsSync(candidatePath)) {
    const ext = path.extname(candidatePath).replace('.', '') || 'jpeg';
    const buffer = fs.readFileSync(candidatePath);
    return `data:image/${ext === 'jpg' ? 'jpeg' : ext};base64,${buffer.toString('base64')}`;
  }
  return undefined;
};

const getWpRestUrl = (baseUrl: string, restPath: string) => {
  const clean = baseUrl.replace(/\/$/, '');
  const [pathname, search] = restPath.split('?');
  const path = pathname.startsWith('/') ? pathname : '/' + pathname;
  const baseRest = `${clean}/index.php?rest_route=${path}`;
  return search ? `${baseRest}&${search}` : baseRest;
};

// 3. WordPress REST & AutoSync Plugin Verification Endpoint
app.post('/api/test-wordpress', async (req, res) => {
  const { url, apiKey } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'WordPress URL is required' });
  }

  const cleanUrl = url.replace(/\/$/, '');
  const siteName = cleanUrl.replace(/^https?:\/\//, '');

  try {
    const start = Date.now();
    // Test base REST API via query rest_route
    const pingRes = await fetch(getWpRestUrl(cleanUrl, '/'));
    const pingMs = Date.now() - start;

    if (!pingRes.ok) {
      return res.status(502).json({
        error: `Could not reach WordPress at ${cleanUrl}. Server responded with ${pingRes.status}.`,
      });
    }

    let pluginActive = false;
    let authValid = false;
    let authMessage = '';

    const activeApiKey = (apiKey || process.env.WP_AUTOSYNC_SECRET || '').trim();
    // Test AutoSync Plugin endpoint via proper rest_route
    const syncEndpoint = getWpRestUrl(cleanUrl, '/autosync/v1/import');
    const pluginCheck = await fetch(syncEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(activeApiKey ? { 'x-sync-key': activeApiKey } : {}),
      },
      body: JSON.stringify({}),
    });

    if (pluginCheck.status !== 404) {
      pluginActive = true;
      if (pluginCheck.status === 403) {
        authValid = false;
        authMessage = activeApiKey
          ? 'API Key rejected. Please re-check the key from WP Admin → AutoSync.'
          : 'Plugin is active! Ready for your API Secret Key.';
      } else if (pluginCheck.status === 400 || pluginCheck.status === 200) {
        // 400 with "Empty JSON payload" means auth succeeded!
        authValid = true;
        authMessage = 'AutoSync Plugin authenticated successfully!';
      }
    }

    // Fetch live categories from WordPress
    let categories: Array<{ id: number; name: string; slug: string; count: number }> = [];
    try {
      const catRes = await fetch(getWpRestUrl(cleanUrl, '/wp/v2/categories?per_page=20'));
      if (catRes.ok) {
        const rawCats = await catRes.json();
        if (Array.isArray(rawCats)) {
          categories = rawCats.map((c: any) => ({
            id: c.id,
            name: c.name.replace(/&amp;/g, '&'),
            slug: c.slug,
            count: c.count || 0,
          }));
        }
      }
    } catch {
      // ignore taxonomy fetch errors
    }

    res.json({
      connected: true,
      siteName,
      endpoint: syncEndpoint,
      targetPostType: 'rcpmst_recipe_comp',
      pluginActive,
      authValid,
      authMessage,
      pingMs,
      categories: categories.length ? categories : [
        { id: 101, name: 'Budget-Friendly Italian', slug: 'budget-friendly-italian', count: 4 },
        { id: 102, name: 'Quick Italian Dinners', slug: 'quick-italian-dinners', count: 2 },
        { id: 103, name: 'Pasta, Risotto & Gnocchi', slug: 'pasta-risotto-gnocchi', count: 1 },
        { id: 104, name: 'Regional Italian Recipes', slug: 'regional-italian-recipes', count: 2 },
        { id: 105, name: 'Soups, Beans & Vegetables', slug: 'soups-beans-vegetables', count: 2 },
        { id: 106, name: 'Protein-Rich Italian Meals', slug: 'protein-rich-italian-meals', count: 1 },
      ],
    });
  } catch (err: any) {
    console.error('WordPress ping error:', err);
    res.status(500).json({ error: err.message || 'Failed to ping WordPress endpoint' });
  }
});

const publishedRecipesStore = new Map<string, any>();

// Seed all 12 Priority Italian Articles into publishedRecipesStore on server startup
const SEED_RECIPES: any[] = INITIAL_RECIPES;

SEED_RECIPES.forEach((r) => {
  publishedRecipesStore.set(r.id, r);
  if (r.slug) {
    publishedRecipesStore.set(r.slug, r);
  }
});

// Endpoint to register/store recipes in memory for persistent reader and printing
app.post('/api/register-recipe', (req, res) => {
  try {
    const { recipes, recipe } = req.body;
    const items = Array.isArray(recipes) ? recipes : recipe ? [recipe] : [];
    items.forEach((item: any) => {
      if (item && item.id) {
        publishedRecipesStore.set(item.id, item);
        if (item.slug) {
          publishedRecipesStore.set(item.slug, item);
        }
      }
    });
    res.json({ success: true, count: publishedRecipesStore.size });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Standalone accessible recipe full content and PDF download view endpoint
app.get('/api/recipe-print/:id', (req, res) => {
  const { id } = req.params;
  let recipe = publishedRecipesStore.get(id);

  if (!recipe) {
    // Try finding by slug or title match
    for (const val of publishedRecipesStore.values()) {
      if (val.slug === id || (val.title && val.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').includes(id.toLowerCase()))) {
        recipe = val;
        break;
      }
    }
  }

  // Fallback to first seed recipe if still not found
  if (!recipe) {
    recipe = SEED_RECIPES[0];
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${recipe.title} - Recipe Master & PDF</title>
        <style>
          @page { margin: 15mm; size: A4 portrait; }
          body { font-family: system-ui, -apple-system, sans-serif; max-width: 850px; margin: 40px auto; padding: 24px; color: #1e293b; line-height: 1.6; background: #f8fafc; }
          .card { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
          h1 { font-size: 28px; color: #0f172a; margin-bottom: 8px; }
          .badge { display: inline-block; background: #fce7f3; color: #db2777; padding: 6px 14px; border-radius: 9999px; font-size: 13px; font-weight: 600; margin-bottom: 16px; }
          .meta { font-size: 15px; color: #64748b; margin-bottom: 24px; }
          img { max-width: 100%; height: auto; border-radius: 12px; margin: 20px 0; max-height: 400px; object-fit: cover; }
          .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 24px 0; text-align: center; }
          .grid div { font-size: 14px; color: #475569; }
          .grid strong { display: block; font-size: 18px; color: #0f172a; margin-top: 4px; }
          h3 { font-size: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 32px; color: #0f172a; }
          ul, ol { padding-left: 24px; }
          li { margin-bottom: 10px; }
          .actions { margin-top: 40px; text-align: center; display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
          .btn { background: linear-gradient(to right, #db2777, #4f46e5); color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px rgba(219,39,119,0.25); border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; }
          .btn-print { background: #0f172a; }
          .footer { margin-top: 48px; font-size: 13px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          @media print {
            body { background: white; margin: 0; padding: 0; }
            .card { box-shadow: none; border: none; padding: 0; }
            .actions { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">${recipe.italianCategory || recipe.niche || 'Recipes'} · ${recipe.dietary || 'Standard'}</div>
          <h1>${recipe.title}</h1>
          <div class="meta">${recipe.metaDescription || `Full culinary recipe guide for ${recipe.title}.`}</div>
          ${(recipe.thumbnailUrl || recipe.imageUrl) ? `<img src="${recipe.thumbnailUrl || recipe.imageUrl}" alt="${recipe.title}" />` : ''}
          ${recipe.galleryImages && recipe.galleryImages.length > 0 ? `
            <h3>📸 Step-by-Step Recipe Photos (${recipe.galleryImages.length} Images)</h3>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:16px 0;">
              ${recipe.galleryImages.map((g: any) => `
                <div style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;background:#f8fafc;">
                  <img src="${g.url || g.path}" alt="${g.alt || recipe.title}" style="width:100%;height:140px;object-fit:cover;margin:0;border-radius:0;" />
                  <div style="padding:8px;font-size:11px;color:#475569;">${g.caption || ''}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}
          <div class="grid">
            <div>Prep Time<strong>${recipe.prepTime || '15 mins'}</strong></div>
            <div>Cook Time<strong>${recipe.cookTime || '20 mins'}</strong></div>
            <div>Yield<strong>${recipe.servings || '4 servings'}</strong></div>
            <div>Calories<strong>${recipe.calories || 450} kcal</strong></div>
          </div>
          <h3>Ingredients</h3>
          <ul>
            ${(recipe.ingredients || []).map((i: any) => typeof i === 'string' ? `<li>${i}</li>` : `<li><strong>${i.amount || ''}</strong> ${i.item || ''} ${i.notes ? '(' + i.notes + ')' : ''}</li>`).join('')}
          </ul>
          <h3>Instructions</h3>
          <ol>
            ${(recipe.instructions || []).map((s: any) => typeof s === 'string' ? `<li>${s}</li>` : `<li><strong>${s.title ? s.title + ': ' : ''}</strong>${s.text || ''}</li>`).join('')}
          </ol>
          ${recipe.chefTips && recipe.chefTips.length > 0 ? `
            <h3>Chef's Pro Tips</h3>
            <ul>
              ${recipe.chefTips.map((t: string) => `<li>${t}</li>`).join('')}
            </ul>
          ` : ''}
          <div class="actions">
            <button onclick="window.print()" class="btn btn-print">🖨️ Print / Save as PDF</button>
            <a href="https://foodsprepared.wasmer.app/wp-admin/edit.php?post_type=rcpmst_recipe_comp" target="_blank" class="btn">
              🌐 Open WP Recipe Section (rcpmst_recipe_comp)
            </a>
          </div>
        </div>
        <div class="footer">
          PinRecipe Scale Engine (Tool AYMAN) · Recipe Master Section Component
        </div>
      </body>
    </html>
  `;
  res.send(html);
});

// 4. Recipe Master & AutoSync WordPress Publisher Endpoint
app.post('/api/sync-wordpress-plugin', async (req, res) => {
  try {
    const { url, apiKey, username, appPassword, articles, defaultStatus } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'WordPress URL is required' });
    }

    const cleanUrl = url.replace(/\/$/, '');

    // Map recipes to Recipe Master (rcpmst_recipe_comp) schema
    const formattedArticles = (articles || []).map((item: any) => {
      const featuredImg = resolveImageBase64(item.imageUrl || item.featured_image);
      const articleId = item.id || `recipe-${Date.now()}`;
      publishedRecipesStore.set(articleId, { ...item, imageUrl: featuredImg || item.imageUrl });

      const servingsVal = parseInt(item.servings) || 4;
      const instructionsText = (item.instructions || [])
        .map((s: any) => `${s.step || ''}. ${s.title ? s.title + ': ' : ''}${s.text || ''}`)
        .join('\n\n');
      const ingredientsListing = (item.ingredients || [])
        .map((i: any) => typeof i === 'string' ? i : `${i.amount || ''} ${i.item || ''}`)
        .join(', ');

      const htmlContent = item.content && item.content.length > 50 ? item.content : `
        <p><strong>${item.metaDescription || `Delicious recipe guide for ${item.title}`}</strong></p>
        ${featuredImg ? `<p><img src="${featuredImg}" alt="${item.title}" style="border-radius:12px; max-width:100%; height:auto;" /></p>` : ''}
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:24px; margin:24px 0; color:#1e293b;">
          <h3 style="margin-top:0; color:#0f172a;">Quick Recipe Facts</h3>
          <ul style="list-style-type:disc; padding-left:20px;">
            <li><strong>Prep Time:</strong> ${item.prepTime || '15 mins'}</li>
            <li><strong>Cook Time:</strong> ${item.cookTime || '20 mins'}</li>
            <li><strong>Servings:</strong> ${item.servings || '4 servings'}</li>
            <li><strong>Calories:</strong> ${item.calories || 450} kcal</li>
          </ul>
          <h4 style="color:#0f172a;">Ingredients</h4>
          <ul style="list-style-type:disc; padding-left:20px;">
            ${(item.ingredients || []).map((i: any) => `<li><strong>${i.amount || ''}</strong> ${i.item || i}</li>`).join('')}
          </ul>
          <h4 style="color:#0f172a;">Instructions</h4>
          <ol style="padding-left:20px;">
            ${(item.instructions || []).map((s: any) => `<li><strong>${s.title || ''}:</strong> ${s.text || s}</li>`).join('')}
          </ol>
          ${item.chefTips && item.chefTips.length > 0 ? `
            <h4 style="color:#0f172a;">Chef's Pro Tips</h4>
            <ul style="list-style-type:disc; padding-left:20px;">
              ${item.chefTips.map((t: string) => `<li>${t}</li>`).join('')}
            </ul>
          ` : ''}
          <p style="margin-top:24px; display:flex; gap:12px; flex-wrap:wrap;">
            <a href="https://foodsprepared.wasmer.app/wp-admin/edit.php?post_type=rcpmst_recipe_comp" target="_blank" style="background:#db2777; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:600; display:inline-block;">
              🌐 View in WP Recipe Section (rcpmst_recipe_comp)
            </a>
          </p>
        </div>
      `;

      return {
        title: item.title,
        content: htmlContent,
        external_id: articleId,
        // Target custom post type for Recipe Master
        post_type: 'rcpmst_recipe_comp',
        target_post_type: 'rcpmst_recipe_comp',
        status: item.status || defaultStatus || 'publish',
        post_status: item.status || defaultStatus || 'publish',
        slug: item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        categories: item.categories || [item.niche || 'Recipes', 'Recipes'],
        tags: item.tags || [item.focusKeyword || 'recipe', ...(item.pinterestPin?.hashtags?.map((h: string) => h.replace('#', '')) || [])],
        // Recipe Master taxonomies: Types & Selections & Dietary
        rcpmst_recipe_type: [item.niche || 'Quick & Easy Dinners'],
        rcpmst_selection: ['Chef Curated'],
        rcpmst_dietary_notes: [item.dietary || 'Standard'],
        tax_input: {
          rcpmst_recipe_type: [item.niche || 'Quick & Easy Dinners'],
          rcpmst_selection: ['Chef Curated'],
          rcpmst_dietary_notes: [item.dietary || 'Standard'],
        },
        // Recipe Master quantity and unit
        quantity: servingsVal,
        unit: 'Portion',
        meta_input: {
          rcpmst_ingredient_or_recipe_meta: 'recipe',
          rcpmst_amount_meta: { val: servingsVal, unit: 'Portion' },
          rcpmst_recipe_meta: instructionsText,
          rcpmst_ingredients_meta: item.ingredients,
          rcpmst_activities_meta: { prep_time: item.prepTime, cook_time: item.cookTime },
          rcpmst_dietary_notes_meta: { manual_or_generated: 'manual' },
          rcpmst_ingredient_listing_meta: {
            manual_or_generated: 'manual',
            manual_listing: ingredientsListing,
            compound: '',
            alternate_name: ''
          }
        },
        ...(featuredImg ? { featured_image: featuredImg } : {})
      };
    });

    // 1. Try XML-RPC wp.newPost first for 100% reliability
    const escapeXml = (str: string) => (str || '').replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });

    const xmlrpcUrl = `${cleanUrl}/xmlrpc.php`;
    const un = (username && username !== 'admin' ? username : null) || 'elattarayman1';
    const pwd = appPassword || 'yWEP 5How u0iV e5M5 7tQ9 KrNQ';

    let xmlRpcSuccess = false;
    let xmlRpcResults: any[] = [];

    for (const article of formattedArticles) {
      const xmlBody = `<?xml version="1.0"?>
<methodCall>
  <methodName>wp.newPost</methodName>
  <params>
    <param><value><int>1</int></value></param>
    <param><value><string>${un}</string></value></param>
    <param><value><string>${pwd}</string></value></param>
    <param>
      <value>
        <struct>
          <member><name>post_type</name><value><string>rcpmst_recipe_comp</string></value></member>
          <member><name>post_title</name><value><string>${escapeXml(article.title)}</string></value></member>
          <member><name>post_content</name><value><string>${escapeXml(article.content)}</string></value></member>
          <member><name>post_status</name><value><string>${article.status || defaultStatus || 'publish'}</string></value></member>
          <member><name>post_name</name><value><string>${article.slug || ''}</string></value></member>
        </struct>
      </value>
    </param>
  </params>
</methodCall>`;

      try {
        const r = await fetch(xmlrpcUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/xml' },
          body: xmlBody
        });
        const text = await r.text();
        if (r.ok && !text.includes('faultCode')) {
          xmlRpcSuccess = true;
          xmlRpcResults.push({ title: article.title, success: true, response: text });
        } else {
          xmlRpcResults.push({ title: article.title, success: false, response: text });
        }
      } catch (e: any) {
        xmlRpcResults.push({ title: article.title, success: false, error: e.message });
      }
    }

    if (xmlRpcSuccess) {
      return res.json({
        success: true,
        data: { synced: xmlRpcResults.filter(r => r.success).length, results: xmlRpcResults },
        postType: 'rcpmst_recipe_comp',
        sectionUrl: `${cleanUrl}/wp-admin/edit.php?post_type=rcpmst_recipe_comp`,
        syncedCount: xmlRpcResults.filter(r => r.success).length,
        results: xmlRpcResults
      });
    }

    const activeApiKey = (apiKey || process.env.WP_AUTOSYNC_SECRET || '').trim();
    const basicAuth = username && appPassword 
      ? `Basic ${Buffer.from(`${username.trim()}:${appPassword.trim()}`).toString('base64')}` 
      : undefined;

    // Headers priority: AutoSync key or Basic Auth
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (activeApiKey) {
      headers['x-sync-key'] = activeApiKey;
    }
    if (basicAuth) {
      headers['Authorization'] = basicAuth;
    }

    // Try AutoSync endpoint first
    let syncEndpoint = getWpRestUrl(cleanUrl, '/autosync/v1/import');
    let wpRes = await fetch(syncEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ articles: formattedArticles }),
    });

    // If 404 or failed and basicAuth exists, try pinrecipe-bridge publish
    if (!wpRes.ok && basicAuth) {
      const bridgeEndpoint = getWpRestUrl(cleanUrl, '/pinrecipe-bridge/v1/publish');
      const bridgeRes = await fetch(bridgeEndpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ articles: formattedArticles, post_type: 'rcpmst_recipe_comp' }),
      });
      if (bridgeRes.ok) {
        wpRes = bridgeRes;
      }
    }

    let data: any = {};
    try {
      data = await wpRes.json();
    } catch {
      data = { message: 'HTTP ' + wpRes.status };
    }

    if (!wpRes.ok) {
      return res.status(wpRes.status).json({
        error: data.message || `WordPress returned status ${wpRes.status}. Check API Key or Application Password.`,
        details: data,
        xmlRpcResults,
        sectionUrl: `${cleanUrl}/wp-admin/edit.php?post_type=rcpmst_recipe_comp`
      });
    }

    res.json({
      success: true,
      data,
      postType: 'rcpmst_recipe_comp',
      sectionUrl: `${cleanUrl}/wp-admin/edit.php?post_type=rcpmst_recipe_comp`,
      syncedCount: data.synced || formattedArticles.length,
      results: data.results || []
    });
  } catch (error: any) {
    console.error('WordPress recipe section sync error:', error);
    res.status(500).json({ error: error.message || 'Failed to sync with WordPress Recipe Section' });
  }
});

const handleRecipeMasterXmlExport = (req: any, res: any) => {
  try {
    const { recipes } = req.body || {};
    const items = recipes && recipes.length ? recipes : Array.from(publishedRecipesStore.values());
    const finalItems = items.length > 0 ? items : SEED_RECIPES;

    const xmlItems = finalItems.map((r: any, idx: number) => {
      const pubDate = new Date(r.createdAt || Date.now()).toUTCString();
      const isoDate = new Date(r.createdAt || Date.now()).toISOString().replace('T', ' ').slice(0, 19);
      const servingsCount = parseInt(r.servings) || 4;
      const instructionsText = (r.instructions || [])
        .map((s: any) => `${s.step || idx + 1}. ${s.title ? s.title + ': ' : ''}${s.text || ''}`)
        .join('\n\n');
      const ingredientsListing = (r.ingredients || [])
        .map((i: any) => typeof i === 'string' ? i : `${i.amount || ''} ${i.item || ''}`)
        .join(', ');

      const formattedContent = r.content || `
        <p><strong>${r.metaDescription || `Exquisite recipe for ${r.title}`}</strong></p>
        <div class="rcpmst-recipe-card">
          <h3>Prep: ${r.prepTime || '15 mins'} | Cook: ${r.cookTime || '20 mins'} | Yield: ${r.servings || '4 servings'}</h3>
          <h4>Ingredients</h4>
          <ul>${(r.ingredients || []).map((i: any) => `<li>${typeof i === 'string' ? i : (i.amount + ' ' + i.item)}</li>`).join('')}</ul>
          <h4>Instructions</h4>
          <ol>${(r.instructions || []).map((s: any) => `<li><strong>${s.title || ''}:</strong> ${s.text || ''}</li>`).join('')}</ol>
        </div>
      `;

      return `
	<item>
		<title><![CDATA[${r.title}]]></title>
		<link>https://foodsprepared.wasmer.app/?post_type=rcpmst_recipe_comp&amp;p=${2000 + idx}</link>
		<pubDate>${pubDate}</pubDate>
		<dc:creator><![CDATA[admin]]></dc:creator>
		<guid isPermaLink="false">https://foodsprepared.wasmer.app/?post_type=rcpmst_recipe_comp&amp;p=${2000 + idx}</guid>
		<description></description>
		<content:encoded><![CDATA[${formattedContent}]]></content:encoded>
		<excerpt:encoded><![CDATA[${r.metaDescription || r.title}]]></excerpt:encoded>
		<wp:post_id>${2000 + idx}</wp:post_id>
		<wp:post_date><![CDATA[${isoDate}]]></wp:post_date>
		<wp:post_date_gmt><![CDATA[${isoDate}]]></wp:post_date_gmt>
		<wp:comment_status><![CDATA[open]]></wp:comment_status>
		<wp:ping_status><![CDATA[closed]]></wp:ping_status>
		<wp:post_name><![CDATA[${r.slug || r.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}]]></wp:post_name>
		<wp:status><![CDATA[publish]]></wp:status>
		<wp:post_parent>0</wp:post_parent>
		<wp:menu_order>0</wp:menu_order>
		<wp:post_type><![CDATA[rcpmst_recipe_comp]]></wp:post_type>
		<wp:post_password><![CDATA[]]></wp:post_password>
		<wp:is_sticky>0</wp:is_sticky>
		<category domain="rcpmst_recipe_type" nicename="${(r.niche || 'quick-dinners').toLowerCase().replace(/[^a-z0-9]+/g, '-')}"><![CDATA[${r.niche || 'Quick & Easy Dinners'}]]></category>
		<category domain="rcpmst_selection" nicename="chef-curated"><![CDATA[Chef Curated]]></category>
		<category domain="rcpmst_dietary_notes" nicename="${(r.dietary || 'standard').toLowerCase().replace(/[^a-z0-9]+/g, '-')}"><![CDATA[${r.dietary || 'Standard'}]]></category>
		<wp:postmeta>
			<wp:meta_key><![CDATA[rcpmst_ingredient_or_recipe_meta]]></wp:meta_key>
			<wp:meta_value><![CDATA[recipe]]></wp:meta_value>
		</wp:postmeta>
		<wp:postmeta>
			<wp:meta_key><![CDATA[rcpmst_amount_meta]]></wp:meta_key>
			<wp:meta_value><![CDATA[a:2:{s:3:"val";i:${servingsCount};s:4:"unit";s:7:"Portion";}]]></wp:meta_value>
		</wp:postmeta>
		<wp:postmeta>
			<wp:meta_key><![CDATA[rcpmst_recipe_meta]]></wp:meta_key>
			<wp:meta_value><![CDATA[${instructionsText}]]></wp:meta_value>
		</wp:postmeta>
		<wp:postmeta>
			<wp:meta_key><![CDATA[rcpmst_ingredient_listing_meta]]></wp:meta_key>
			<wp:meta_value><![CDATA[a:3:{s:20:"manual_or_generated";s:6:"manual";s:14:"manual_listing";s:${ingredientsListing.length}:"${ingredientsListing}";s:8:"compound";s:0:"";}]]></wp:meta_value>
		</wp:postmeta>
	</item>`;
    }).join('\n');

    const xmlContent = `<?xml version="1.0" encoding="UTF-8" ?>
<!-- generator="WordPress/6.7" created="${new Date().toISOString()}" -->
<rss version="2.0"
	xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
	xmlns:content="http://purl.org/rss/1.0/modules/content/"
	xmlns:wfw="http://wellformedweb.org/CommentAPI/"
	xmlns:dc="http://purl.org/dc/elements/1.1/"
	xmlns:wp="http://wordpress.org/export/1.2/"
>
<channel>
	<title>PinRecipe Scale Engine</title>
	<link>https://foodsprepared.wasmer.app</link>
	<description>Recipe Master Component Export for rcpmst_recipe_comp</description>
	<pubDate>${new Date().toUTCString()}</pubDate>
	<language>en-US</language>
	<wp:wxr_version>1.2</wp:wxr_version>
	<wp:base_site_url>https://foodsprepared.wasmer.app</wp:base_site_url>
	<wp:base_blog_url>https://foodsprepared.wasmer.app</wp:base_blog_url>

	<wp:term>
		<wp:term_id>501</wp:term_id>
		<wp:term_taxonomy>rcpmst_recipe_type</wp:term_taxonomy>
		<wp:term_slug>quick-easy-dinners</wp:term_slug>
		<wp:term_name><![CDATA[Quick & Easy Dinners]]></wp:term_name>
	</wp:term>
	<wp:term>
		<wp:term_id>502</wp:term_id>
		<wp:term_taxonomy>rcpmst_recipe_type</wp:term_taxonomy>
		<wp:term_slug>high-protein-keto</wp:term_slug>
		<wp:term_name><![CDATA[High-Protein & Keto]]></wp:term_name>
	</wp:term>
	<wp:term>
		<wp:term_id>503</wp:term_id>
		<wp:term_taxonomy>rcpmst_recipe_type</wp:term_taxonomy>
		<wp:term_slug>moroccan-tagine-classics</wp:term_slug>
		<wp:term_name><![CDATA[Moroccan & Tagine Classics]]></wp:term_name>
	</wp:term>
	<wp:term>
		<wp:term_id>504</wp:term_id>
		<wp:term_taxonomy>rcpmst_recipe_type</wp:term_taxonomy>
		<wp:term_slug>decadent-desserts</wp:term_slug>
		<wp:term_name><![CDATA[Decadent Desserts]]></wp:term_name>
	</wp:term>
	<wp:term>
		<wp:term_id>505</wp:term_id>
		<wp:term_taxonomy>rcpmst_selection</wp:term_taxonomy>
		<wp:term_slug>chef-curated</wp:term_slug>
		<wp:term_name><![CDATA[Chef Curated]]></wp:term_name>
	</wp:term>

${xmlItems}
</channel>
</rss>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Content-Disposition', `attachment; filename="recipe_master_rcpmst_export_${Date.now()}.xml"`);
    res.send(xmlContent);
  } catch (err: any) {
    console.error('XML export error:', err);
    res.status(500).json({ error: err.message || 'Failed to export Recipe Master XML' });
  }
};

// 5. Export Recipe Master WXR (WordPress XML) endpoint (both POST and GET)
app.post('/api/export-recipe-master-xml', handleRecipeMasterXmlExport);
app.get('/api/export-recipe-master-xml', handleRecipeMasterXmlExport);

// 6. Download Clean WordPress Theme ZIP Package (pinrecipe-culinary.zip)
app.get('/api/download-theme-zip', (req, res) => {
  try {
    const themeZipPath = path.resolve(__dirname, 'wordpress-theme', 'pinrecipe-culinary.zip');
    if (!fs.existsSync(themeZipPath)) {
      return res.status(404).json({ error: 'Theme zip file not found on server' });
    }
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="pinrecipe-culinary.zip"');
    const filestream = fs.createReadStream(themeZipPath);
    filestream.pipe(res);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to download theme' });
  }
});

// 7. AI Thematic Image Generation & Asset Mapping Endpoint
app.post('/api/generate-thematic-image', async (req, res) => {
  try {
    const { topic, themeCategory, imageStyle, includePeople } = req.body;
    
    // Curated high-res mapping for thematic categories
    const lowerCategory = (themeCategory || '').toLowerCase();
    const lowerTopic = (topic || '').toLowerCase();
    
    let selectedAsset = '/src/assets/images/recipe_truffle_pasta_1791456194437.jpg';
    
    if (lowerCategory.includes('french') || lowerTopic.includes('bourguignon') || lowerTopic.includes('coq') || lowerTopic.includes('ratatouille')) {
      selectedAsset = '/src/assets/images/recipe_french_bourguignon.jpg';
    } else if (lowerCategory.includes('pizza') || lowerTopic.includes('pizza') || lowerTopic.includes('recycled') || lowerTopic.includes('skillet')) {
      selectedAsset = '/src/assets/images/recipe_recycled_pizza.jpg';
    } else if (lowerCategory.includes('thanksgiving') || lowerTopic.includes('turkey') || lowerTopic.includes('stuffing') || lowerTopic.includes('cranberry')) {
      selectedAsset = '/src/assets/images/recipe_thanksgiving_turkey.jpg';
    } else if (lowerCategory.includes('salmon') || lowerTopic.includes('salmon') || lowerTopic.includes('keto')) {
      selectedAsset = '/src/assets/images/recipe_salmon_bowl_1791456206016.jpg';
    } else if (lowerCategory.includes('dessert') || lowerTopic.includes('cake') || lowerTopic.includes('sweet')) {
      selectedAsset = '/src/assets/images/recipe_berry_cheesecake_1791456217003.jpg';
    } else if (lowerCategory.includes('moroccan') || lowerTopic.includes('tagine')) {
      selectedAsset = '/src/assets/images/recipe_moroccan_tagine_1791456228215.jpg';
    }

    const peopleDetail = includePeople 
      ? 'Warm ambient scene with diners enjoying food in the background, candid smiling faces, soft atmospheric bokeh.' 
      : 'Artisanal culinary macro styling, dramatic food magazine lighting, glistening textures and aromatic steam.';

    const craftedPrompt = `Gourmet food photography of ${topic} (${themeCategory}). ${peopleDetail} High aesthetic, 8K ultra detail.`;

    res.json({
      success: true,
      imageUrl: selectedAsset,
      prompt: craftedPrompt,
      style: imageStyle || 'macro',
      includePeople: !!includePeople
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to process thematic image' });
  }
});

// 8. Publish Dedicated Italian Recipes Page (/italian-recipes) & Carousel Homepage (/home) to WordPress
app.post('/api/publish-italian-page', async (req, res) => {
  try {
    const { url, apiKey, categories = [], recipes = [] } = req.body;
    const cleanUrl = (url || 'https://foodsprepared.wasmer.app').replace(/\/$/, '');
    const activeApiKey = (apiKey || process.env.WP_AUTOSYNC_SECRET || '').trim();

    const prebuiltHomepagePath = path.resolve(__dirname, 'output', 'wordpress_carousel_homepage.html');
    let pageHtml = '';
    if (fs.existsSync(prebuiltHomepagePath)) {
      pageHtml = fs.readFileSync(prebuiltHomepagePath, 'utf8');
    } else {
      pageHtml = `<div class="semplice-homepage-wrapper" style="max-width:1100px;margin:0 auto;font-family:system-ui,-apple-system,sans-serif;"><h2>Welcome to Semplice Italian Kitchen</h2><p>Explore our ${recipes.length} authentic Italian recipes across ${categories.length} categories.</p></div>`;
    }

    let wpPublished = false;
    try {
      const syncEndpoint = getWpRestUrl(cleanUrl, '/autosync/v1/import');
      for (const target of [
        {
          external_id: 'page-italian-recipes-hub',
          title: 'Semplice Italian Kitchen: Complete Italian Recipes Carousel Hub & Category Directory',
          slug: 'italian-recipes',
        },
        {
          external_id: 'page-semplice-homepage-v1',
          title: 'Welcome to Semplice Italian Kitchen — Featured Italian Recipes & Category Carousels',
          slug: 'home',
        },
      ]) {
        const r = await fetch(syncEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-sync-key': activeApiKey,
          },
          body: JSON.stringify({
            external_id: target.external_id,
            title: target.title,
            slug: target.slug,
            status: 'publish',
            categories: ['Italian Recipes Hub'],
            content: pageHtml,
          }),
        });
        if (r.ok) {
          wpPublished = true;
        }
      }
    } catch {
      // ignore network error and return prepared page info
    }

    res.json({
      success: true,
      wpPublished,
      pageUrl: `${cleanUrl}/home/`,
      hubUrl: `${cleanUrl}/italian-recipes/`,
      articlesCount: recipes.length,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to publish Italian Recipes Homepage' });
  }
});

// 9. Download Python + Selenium Chrome Generator Script
app.get('/api/download-selenium-script', (req, res) => {
  try {
    const scriptPath = path.resolve(__dirname, 'scripts', 'italian_recipe_selenium_generator.py');
    if (!fs.existsSync(scriptPath)) {
      return res.status(404).json({ error: 'Selenium script not found on server' });
    }
    res.setHeader('Content-Type', 'text/x-python');
    res.setHeader('Content-Disposition', 'attachment; filename="italian_recipe_selenium_generator.py"');
    fs.createReadStream(scriptPath).pipe(res);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to download Selenium script' });
  }
});

// 10. Pinterest Automatic Publishing & CSV Bulk Import Fallback Endpoints
app.get('/api/pinterest/status', async (req, res) => {
  try {
    const reportPath = path.resolve(__dirname, 'output', 'pinterest_publish_summary_report.json');
    if (fs.existsSync(reportPath)) {
      const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
      return res.json({ success: true, summaryReport: report });
    }
    const { publishOrFallbackToCsv } = await import('./scripts/pinterest_publisher_and_csv_export.mjs');
    const articlesPath = path.resolve(__dirname, 'output', 'published_wordpress_12_articles.json');
    const rawArticles = fs.existsSync(articlesPath) ? JSON.parse(fs.readFileSync(articlesPath, 'utf8')) : [];
    const { summaryReport } = await publishOrFallbackToCsv(rawArticles, {}, { validateImages: false });
    res.json({ success: true, summaryReport });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to load Pinterest status' });
  }
});

app.post('/api/pinterest/publish-or-fallback', async (req, res) => {
  try {
    const {
      accessToken,
      refreshToken,
      appId,
      appSecret,
      startDate,
      intervalMinutes,
      validateImages = true,
      customPins,
    } = req.body || {};

    const { publishOrFallbackToCsv } = await import('./scripts/pinterest_publisher_and_csv_export.mjs');
    const articlesPath = path.resolve(__dirname, 'output', 'published_wordpress_12_articles.json');
    const defaultArticles = fs.existsSync(articlesPath) ? JSON.parse(fs.readFileSync(articlesPath, 'utf8')) : [];
    const inputItems = Array.isArray(customPins) && customPins.length > 0 ? customPins : defaultArticles;

    const { strictCsv, extendedCsv, summaryReport } = await publishOrFallbackToCsv(
      inputItems,
      { accessToken, refreshToken, appId, appSecret },
      { startDate, intervalMinutes, validateImages }
    );

    const outDir = path.resolve(__dirname, 'output');
    fs.writeFileSync(path.join(outDir, 'pinterest_bulk_upload_template.csv'), strictCsv, 'utf8');
    fs.writeFileSync(path.join(outDir, 'pinterest_bulk_audit_extended.csv'), extendedCsv, 'utf8');
    fs.writeFileSync(path.join(outDir, 'pinterest_publish_summary_report.json'), JSON.stringify(summaryReport, null, 2), 'utf8');

    const logLines = [
      '================================================================================',
      ' PINTEREST AUTOMATIC PUBLISHER & BULK CSV FALLBACK — EXECUTION SUMMARY REPORT',
      '================================================================================',
      `Job Started:               ${summaryReport.jobStartedAt}`,
      `Job Completed:             ${summaryReport.jobCompletedAt}`,
      `Execution Mode:            ${summaryReport.mode.toUpperCase()}`,
      `Fallback Triggered:        ${summaryReport.fallbackTriggered ? 'YES (' + summaryReport.fallbackReason + ')' : 'NO'}`,
      '--------------------------------------------------------------------------------',
      `Total Recipes Processed:   ${summaryReport.totals.totalRecipesInput}`,
      `Valid CSV Rows Generated:  ${summaryReport.totals.validRowsGenerated}`,
      `Invalid/Missing Rows:      ${summaryReport.totals.invalidRowsSkippedFromStrictCsv}`,
      `Rows Truncated (Limits):   ${summaryReport.totals.rowsWithTruncatedText}`,
      `Direct API Successes:      ${summaryReport.totals.apiPublishedSuccess}`,
      `Direct API Failures:       ${summaryReport.totals.apiPublishedFailed}`,
      '--------------------------------------------------------------------------------',
      'DETAILED EXECUTION LOG:',
      ...summaryReport.logs.map((l: any) => `[${l.timestamp}] [${l.level}] ${l.message}`),
      '================================================================================',
    ];
    fs.writeFileSync(path.join(outDir, 'pinterest_publish_log.txt'), logLines.join('\n') + '\n', 'utf8');

    res.json({
      success: true,
      summaryReport,
      strictCsv,
      extendedCsv,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Pinterest publish/fallback job failed' });
  }
});

app.get('/api/pinterest/download-csv', (req, res) => {
  try {
    const csvPath = path.resolve(__dirname, 'output', 'pinterest_bulk_upload_template.csv');
    if (!fs.existsSync(csvPath)) {
      return res.status(404).json({ error: 'Pinterest CSV file not found. Run publish/export first.' });
    }
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="pinterest_bulk_upload_template.csv"');
    fs.createReadStream(csvPath).pipe(res);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to download Pinterest CSV' });
  }
});

app.get('/api/pinterest/download-audit-csv', (req, res) => {
  try {
    const csvPath = path.resolve(__dirname, 'output', 'pinterest_bulk_audit_extended.csv');
    if (!fs.existsSync(csvPath)) {
      return res.status(404).json({ error: 'Extended Audit CSV file not found.' });
    }
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="pinterest_bulk_audit_extended.csv"');
    fs.createReadStream(csvPath).pipe(res);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to download Extended Audit CSV' });
  }
});

app.get('/api/pinterest/download-log', (req, res) => {
  try {
    const logPath = path.resolve(__dirname, 'output', 'pinterest_publish_log.txt');
    if (!fs.existsSync(logPath)) {
      return res.status(404).json({ error: 'Pinterest log file not found.' });
    }
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="pinterest_publish_log.txt"');
    fs.createReadStream(logPath).pipe(res);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to download log file' });
  }
});

// Initialize server with Vite middleware or static serving
const startServer = async () => {
  const isProd = process.env.NODE_ENV === 'production';
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`PinRecipe Scale Engine dev server listening on http://0.0.0.0:${port}`);
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
