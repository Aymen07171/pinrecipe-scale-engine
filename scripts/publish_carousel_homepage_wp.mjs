import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WP_URL = process.env.WP_SITE_URL || 'https://foodsprepared.wasmer.app';
const SYNC_KEY = process.env.WP_AUTOSYNC_SECRET || '';

const publishedMeta = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'output', 'published_wordpress_12_articles.json'), 'utf8')
);

const byPriority = {};
for (const item of publishedMeta) {
  byPriority[item.priority] = item;
}

const CATEGORIES_CONFIG = [
  {
    id: 'cat-budget-friendly-italian',
    name: 'Budget-Friendly Italian',
    slug: 'budget-friendly-italian',
    icon: '💰',
    accent: '#227755',
    bgSoft: '#eef7f2',
    borderSoft: '#cde4d8',
    tagline: 'Under $2.00 / Serving · Cucina Povera Classics',
    description:
      'Pasta e ceci, pasta e fagioli, pantry pasta, lentils, white beans, leftover bread dishes and inexpensive family meals crafted from humble everyday staples.',
    priorities: [1, 2, 6, 10, 5],
  },
  {
    id: 'cat-quick-italian-dinners',
    name: 'Quick Italian Dinners',
    slug: 'quick-italian-dinners',
    icon: '⚡',
    accent: '#D96B43',
    bgSoft: '#fdf3ef',
    borderSoft: '#f5d4c6',
    tagline: '20–30 Minute Weeknight Favorites',
    description:
      '20–30-minute dinners, glossy pan sauces, one-pan skillets, and effortless Italian recipes designed for busy weeknight evenings.',
    priorities: [5, 11, 2, 3, 9],
  },
  {
    id: 'cat-pasta-risotto-gnocchi',
    name: 'Pasta, Risotto & Gnocchi',
    slug: 'pasta-risotto-gnocchi',
    icon: '🍝',
    accent: '#b45309',
    bgSoft: '#fef9ec',
    borderSoft: '#f7e3b5',
    tagline: 'Artisanal Pasta Shapes & Traditional Sauces',
    description:
      'Pasta shapes and sauces, risotto-style toasted fregola, homemade crêpes, baked pasta, and traditional regional pasta combinations.',
    priorities: [7, 8, 10, 5, 4],
  },
  {
    id: 'cat-regional-italian-recipes',
    name: 'Regional Italian Recipes',
    slug: 'regional-italian-recipes',
    icon: '🗺️',
    accent: '#1d4ed8',
    bgSoft: '#eff6ff',
    borderSoft: '#bfdbfe',
    tagline: 'Tuscany · Liguria · Sardinia · Abruzzo · Rome',
    description:
      'Dedicated collections for Liguria, Sardinia, Abruzzo, Tuscany, and Lazio—preserving authentic local methods and regional ingredients.',
    priorities: [8, 12, 7, 3, 2],
  },
  {
    id: 'cat-soups-beans-vegetables',
    name: 'Soups, Beans & Vegetables',
    slug: 'soups-beans-vegetables',
    icon: '🥣',
    accent: '#15803d',
    bgSoft: '#f0fdf4',
    borderSoft: '#bbf7d0',
    tagline: 'Hearty One-Pot Legume Stews & Market Sides',
    description:
      'Bean soups, velvety chickpea stews, Tuscan white beans, vegetable frittatas, Italian side dishes, and nourishing legume-based meals.',
    priorities: [3, 4, 2, 12, 11],
  },
  {
    id: 'cat-protein-rich-italian-meals',
    name: 'Protein-Rich Italian Meals',
    slug: 'protein-rich-italian-meals',
    icon: '💪',
    accent: '#9333ea',
    bgSoft: '#faf5ff',
    borderSoft: '#e9d5ff',
    tagline: '20g–44g Protein · Balanced Dinners & Meal Prep',
    description:
      'Chicken and seafood dinners, high-fiber legume meals, balanced pasta dishes, and recipes that store and reheat beautifully for work lunches.',
    priorities: [9, 8, 10, 11, 4],
  },
];

function minifyHtmlForWp(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\r?\n/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/>\s+</g, '><')
    .trim();
}

function buildArticleCarouselCard(item, badgeColor = '#227755', cardId = '') {
  const shortDesc =
    item.metaDescription.length > 105
      ? item.metaDescription.slice(0, 102) + '...'
      : item.metaDescription;

  return `
    <div ${cardId ? `id="${cardId}"` : ''} class="sik-carousel-card" style="flex:0 0 305px;min-width:295px;max-width:315px;background:#ffffff;border:1px solid #eadfd5;border-radius:18px;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;">
      <div>
        <div style="position:relative;height:195px;overflow:hidden;background:#f4ece4;">
          <a href="${item.permalink}" style="display:block;width:100%;height:100%;">
            <img src="${item.thumbnailUrl}" alt="${item.title}" style="width:100%;height:100%;object-fit:cover;display:block;margin:0;" loading="lazy" />
          </a>
          <span style="position:absolute;top:12px;left:12px;background:${badgeColor};color:#ffffff;padding:4px 11px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:0.02em;">
            ${item.category}
          </span>
          <span style="position:absolute;bottom:10px;right:10px;background:#1a202c;color:#ffffff;padding:3px 9px;border-radius:6px;font-size:11px;font-weight:700;">
            ⏱️ ${item.totalTime}
          </span>
        </div>
        <div style="padding:18px 18px 14px;">
          <div style="font-size:12px;color:#718096;font-weight:600;margin-bottom:6px;">
            🔥 ${item.calories} kcal &nbsp;•&nbsp; 👥 ${item.servings.replace(/\s*\(.*?\)/, '')}
          </div>
          <h3 style="font-family:Georgia,serif;font-size:17px;font-weight:700;line-height:1.35;margin:0 0 8px;color:#1a202c;">
            <a href="${item.permalink}" style="color:#1a202c;text-decoration:none;">${item.title}</a>
          </h3>
          <p style="font-size:13px;color:#4a5568;line-height:1.55;margin:0;">
            ${shortDesc}
          </p>
        </div>
      </div>
      <div style="padding:12px 18px 16px;border-top:1px solid #f5ebe1;background:#fffaf5;display:flex;align-items:center;justify-content:space-between;gap:8px;">
        <a href="${item.permalink}" style="background:#227755;color:#ffffff;padding:8px 14px;border-radius:9px;text-decoration:none;font-size:12px;font-weight:700;display:inline-block;">
          Read Recipe &rarr;
        </a>
        <a href="${item.pdfUrl}" target="_blank" rel="noopener" style="background:#ffffff;color:#D96B43;border:1px solid #e6ccb8;padding:7px 11px;border-radius:9px;text-decoration:none;font-size:12px;font-weight:700;display:inline-block;">
          📥 Free PDF
        </a>
      </div>
    </div>
  `;
}

export function buildStructuredHomepageHtml() {
  // 1. Featured Articles Carousel Cards (All 12 Priority Articles)
  const featuredCardsHtml = publishedMeta
    .map((item, idx) => buildArticleCarouselCard(item, '#227755', `sik-feat-slide-${idx + 1}`))
    .join('');

  // 2. Category Overview Carousel Cards (All 6 Recipe Categories)
  const categoryOverviewCardsHtml = CATEGORIES_CONFIG.map((cat) => {
    const sampleImg = byPriority[cat.priorities[0]]?.thumbnailUrl || publishedMeta[0].thumbnailUrl;
    return `
      <div class="sik-cat-overview-card" style="flex:0 0 285px;min-width:275px;max-width:295px;background:${cat.bgSoft};border:1px solid ${cat.borderSoft};border-radius:18px;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;">
        <div>
          <div style="position:relative;height:145px;overflow:hidden;background:#1a202c;">
            <img src="${sampleImg}" alt="${cat.name}" style="width:100%;height:100%;object-fit:cover;display:block;margin:0;" loading="lazy" />
            <span style="position:absolute;top:12px;left:12px;background:#ffffff;color:#1a202c;width:36px;height:36px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;font-size:18px;">
              ${cat.icon}
            </span>
            <span style="position:absolute;bottom:10px;left:10px;background:#1a202c;color:#ffffff;padding:4px 9px;border-radius:6px;font-size:10px;font-weight:700;letter-spacing:0.03em;text-transform:uppercase;">
              ${cat.tagline}
            </span>
          </div>
          <div style="padding:16px 18px 12px;">
            <h3 style="font-family:Georgia,serif;font-size:18px;font-weight:700;color:#1a202c;margin:0 0 6px;">
              ${cat.name}
            </h3>
            <p style="font-size:13px;color:#4a5568;line-height:1.5;margin:0;">
              ${cat.description}
            </p>
          </div>
        </div>
        <div style="padding:12px 18px 16px;display:flex;align-items:center;justify-content:space-between;gap:8px;border-top:1px solid ${cat.borderSoft};">
          <a href="#${cat.id}" style="color:${cat.accent};font-size:12px;font-weight:800;text-decoration:none;">
            View Carousel &darr;
          </a>
          <a href="${WP_URL}/category/${cat.slug}/" style="background:#ffffff;color:#1a202c;border:1px solid ${cat.borderSoft};padding:5px 10px;border-radius:8px;font-size:11px;font-weight:700;text-decoration:none;">
            Archive &rarr;
          </a>
        </div>
      </div>
    `;
  }).join('');

  // 3. Individual Category Carousels (One Horizontal Carousel per Recipe Category)
  const categoryCarouselsHtml = CATEGORIES_CONFIG.map((cat) => {
    const catRecipes = cat.priorities.map((p) => byPriority[p]).filter(Boolean);
    const cardsHtml = catRecipes
      .map((item, i) => buildArticleCarouselCard(item, cat.accent, `${cat.id}-slide-${i + 1}`))
      .join('');

    return `
      <section id="${cat.id}" style="margin-bottom:44px;background:#ffffff;border:1px solid #eadfd5;border-radius:22px;padding:26px 24px;">
        <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px;margin-bottom:18px;padding-bottom:14px;border-bottom:2px solid ${cat.bgSoft};">
          <div>
            <div style="display:inline-flex;align-items:center;gap:8px;background:${cat.bgSoft};color:${cat.accent};border:1px solid ${cat.borderSoft};padding:4px 12px;border-radius:999px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">
              <span>${cat.icon} Recipe Category Carousel</span>
              <span>•</span>
              <span>${catRecipes.length} Curated Articles</span>
            </div>
            <h2 style="font-family:Georgia,serif;font-size:24px;font-weight:700;color:#1a202c;margin:0 0 4px;">
              ${cat.icon} ${cat.name}
            </h2>
            <p style="font-size:14px;color:#4a5568;margin:0;max-width:720px;line-height:1.5;">
              ${cat.description}
            </p>
          </div>
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <a href="#${cat.id}-slide-1" style="background:${cat.bgSoft};color:${cat.accent};border:1px solid ${cat.borderSoft};padding:7px 12px;border-radius:9px;text-decoration:none;font-size:12px;font-weight:700;">
              &larr; Start
            </a>
            <a href="#${cat.id}-slide-3" style="background:${cat.bgSoft};color:${cat.accent};border:1px solid ${cat.borderSoft};padding:7px 12px;border-radius:9px;text-decoration:none;font-size:12px;font-weight:700;">
              Next &rarr;
            </a>
            <a href="${WP_URL}/category/${cat.slug}/" style="background:${cat.accent};color:#ffffff;padding:8px 14px;border-radius:9px;text-decoration:none;font-size:12px;font-weight:700;">
              View All in ${cat.name} &rarr;
            </a>
          </div>
        </div>
        <div class="sik-carousel-track" style="display:flex;flex-wrap:nowrap;gap:20px;overflow:auto;padding:4px 2px 16px;">
          ${cardsHtml}
        </div>
      </section>
    `;
  }).join('');

  const fullHtml = `
    <div id="sik-top" class="semplice-homepage-wrapper" style="max-width:1120px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;color:#2d3748;line-height:1.65;">
      <div style="background:#ffffff;border:1px solid #eadfd5;border-radius:14px;padding:10px 16px;margin-bottom:22px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;">
        <div style="display:flex;align-items:center;gap:8px;font-weight:800;font-size:13px;color:#227755;">
          <span>🇮🇹 Semplice Italian Kitchen</span>
          <span style="color:#cbd5e0;">|</span>
          <span style="color:#718096;font-weight:600;font-size:12px;">Quick Carousel Navigation:</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          <a href="#carousel-featured" style="background:#eef7f2;color:#227755;padding:5px 11px;border-radius:999px;font-size:11px;font-weight:700;text-decoration:none;">⭐ Featured Carousel</a>
          <a href="#carousel-categories" style="background:#fdf3ef;color:#D96B43;padding:5px 11px;border-radius:999px;font-size:11px;font-weight:700;text-decoration:none;">🗂️ 6 Categories</a>
          <a href="#cat-budget-friendly-italian" style="background:#f8fafc;color:#334155;border:1px solid #e2e8f0;padding:5px 10px;border-radius:999px;font-size:11px;font-weight:600;text-decoration:none;">💰 Budget</a>
          <a href="#cat-quick-italian-dinners" style="background:#f8fafc;color:#334155;border:1px solid #e2e8f0;padding:5px 10px;border-radius:999px;font-size:11px;font-weight:600;text-decoration:none;">⚡ Quick Dinners</a>
          <a href="#cat-pasta-risotto-gnocchi" style="background:#f8fafc;color:#334155;border:1px solid #e2e8f0;padding:5px 10px;border-radius:999px;font-size:11px;font-weight:600;text-decoration:none;">🍝 Pasta &amp; Risotto</a>
          <a href="#cat-regional-italian-recipes" style="background:#f8fafc;color:#334155;border:1px solid #e2e8f0;padding:5px 10px;border-radius:999px;font-size:11px;font-weight:600;text-decoration:none;">🗺️ Regional</a>
          <a href="#cat-soups-beans-vegetables" style="background:#f8fafc;color:#334155;border:1px solid #e2e8f0;padding:5px 10px;border-radius:999px;font-size:11px;font-weight:600;text-decoration:none;">🥣 Soups &amp; Beans</a>
          <a href="#cat-protein-rich-italian-meals" style="background:#f8fafc;color:#334155;border:1px solid #e2e8f0;padding:5px 10px;border-radius:999px;font-size:11px;font-weight:600;text-decoration:none;">💪 Protein-Rich</a>
          <a href="#sik-footer" style="background:#1a202c;color:#ffffff;padding:5px 11px;border-radius:999px;font-size:11px;font-weight:700;text-decoration:none;">↓ Footer</a>
        </div>
      </div>

      <section style="background:#FFF8F2;border:2px solid #e6d7c8;border-radius:24px;padding:38px 32px;margin-bottom:40px;position:relative;overflow:hidden;">
        <div style="display:flex;flex-wrap:wrap;gap:28px;align-items:center;justify-content:space-between;">
          <div style="flex:1 1 460px;">
            <span style="display:inline-block;background:#227755;color:#ffffff;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;padding:5px 14px;border-radius:999px;margin-bottom:14px;">
              🇮🇹 Benvenuti · Real Italian Flavor, Everyday Cooking
            </span>
            <h1 style="font-family:Georgia,serif;font-size:34px;font-weight:700;color:#1a202c;line-height:1.22;margin:0 0 14px;">
              Welcome to Semplice Italian Kitchen: Authentic Recipes for Everyday Home Cooks
            </h1>
            <p style="font-size:16px;color:#4a5568;line-height:1.7;margin:0 0 20px;">
              Discover the heart of Italian home cooking—from time-honored <strong>Cucina Povera</strong> budget meals and <strong>20-minute weeknight pastas</strong> to regional treasures from <strong>Tuscany, Liguria, Sardinia, and Abruzzo</strong>. Every recipe is tested for everyday kitchens and includes <strong>step-by-step culinary photography</strong> plus a <strong>free printable 1-page PDF recipe card</strong>.
            </p>
            <div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:24px;">
              <a href="#carousel-featured" style="background:#227755;color:#ffffff;padding:12px 22px;border-radius:12px;text-decoration:none;font-size:14px;font-weight:700;">
                Explore Featured Articles Carousel &darr;
              </a>
              <a href="#carousel-categories" style="background:#D96B43;color:#ffffff;padding:12px 22px;border-radius:12px;text-decoration:none;font-size:14px;font-weight:700;">
                Browse 6 Recipe Categories &darr;
              </a>
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:10px;padding-top:16px;border-top:1px solid #e6d7c8;">
              <div style="flex:1 1 130px;background:#ffffff;border:1px solid #eadfd5;border-radius:12px;padding:10px 12px;">
                <div style="font-size:18px;font-weight:800;color:#227755;">12+</div>
                <div style="font-size:11px;color:#718096;font-weight:600;">Authentic Italian Articles</div>
              </div>
              <div style="flex:1 1 130px;background:#ffffff;border:1px solid #eadfd5;border-radius:12px;padding:10px 12px;">
                <div style="font-size:18px;font-weight:800;color:#D96B43;">6</div>
                <div style="font-size:11px;color:#718096;font-weight:600;">Curated Recipe Categories</div>
              </div>
              <div style="flex:1 1 130px;background:#ffffff;border:1px solid #eadfd5;border-radius:12px;padding:10px 12px;">
                <div style="font-size:18px;font-weight:800;color:#b45309;">100% Free</div>
                <div style="font-size:11px;color:#718096;font-weight:600;">Printable PDF Cards</div>
              </div>
            </div>
          </div>

          <div style="flex:1 1 340px;max-width:420px;background:#ffffff;border:1px solid #eadfd5;border-radius:20px;overflow:hidden;">
            <div style="position:relative;height:230px;">
              <img src="${byPriority[7].thumbnailUrl}" alt="${byPriority[7].title}" style="width:100%;height:100%;object-fit:cover;display:block;margin:0;" />
              <span style="position:absolute;top:14px;left:14px;background:#D96B43;color:#ffffff;padding:5px 12px;border-radius:999px;font-size:11px;font-weight:800;text-transform:uppercase;">
                🌟 Chef’s Featured Dish
              </span>
              <span style="position:absolute;bottom:12px;right:12px;background:#1a202c;color:#ffffff;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;">
                ⏱️ 27 mins · 📥 PDF Included
              </span>
            </div>
            <div style="padding:20px;">
              <div style="font-size:11px;font-weight:800;color:#227755;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">
                Pasta, Risotto &amp; Gnocchi · Liguria
              </div>
              <h2 style="font-family:Georgia,serif;font-size:19px;font-weight:700;color:#1a202c;margin:0 0 8px;line-height:1.35;">
                <a href="${byPriority[7].permalink}" style="color:#1a202c;text-decoration:none;">${byPriority[7].title}</a>
              </h2>
              <p style="font-size:13px;color:#4a5568;margin:0 0 14px;line-height:1.5;">
                ${byPriority[7].metaDescription}
              </p>
              <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
                <a href="${byPriority[7].permalink}" style="background:#227755;color:#ffffff;padding:9px 16px;border-radius:10px;text-decoration:none;font-size:12px;font-weight:700;">
                  Read Full Recipe &rarr;
                </a>
                <a href="${byPriority[7].pdfUrl}" target="_blank" rel="noopener" style="background:#FFF8F2;color:#D96B43;border:1px solid #e6ccb8;padding:8px 14px;border-radius:10px;text-decoration:none;font-size:12px;font-weight:700;">
                  📥 Download PDF Card
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="carousel-featured" style="margin-bottom:46px;background:#FFF8F2;border:1px solid #e6d7c8;border-radius:24px;padding:28px 24px;">
        <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px;margin-bottom:18px;">
          <div>
            <span style="display:inline-block;background:#eef7f2;color:#227755;border:1px solid #cde4d8;padding:4px 12px;border-radius:999px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">
              🎠 Interactive Article Carousel · Swipe or Scroll Horizontally
            </span>
            <h2 style="font-family:Georgia,serif;font-size:26px;font-weight:700;color:#1a202c;margin:0 0 4px;">
              Featured Italian Recipe Articles (All 12 Complete Guides)
            </h2>
            <p style="font-size:14px;color:#4a5568;margin:0;">
              Scroll horizontally through our signature Italian recipes—each complete with 3 step-by-step photos, chef tips, and a 1-click printable PDF.
            </p>
          </div>
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
            <a href="#sik-feat-slide-1" style="background:#ffffff;color:#227755;border:1px solid #cde4d8;padding:7px 12px;border-radius:9px;text-decoration:none;font-size:12px;font-weight:700;">Slides 1–4</a>
            <a href="#sik-feat-slide-5" style="background:#ffffff;color:#227755;border:1px solid #cde4d8;padding:7px 12px;border-radius:9px;text-decoration:none;font-size:12px;font-weight:700;">Slides 5–8</a>
            <a href="#sik-feat-slide-9" style="background:#ffffff;color:#227755;border:1px solid #cde4d8;padding:7px 12px;border-radius:9px;text-decoration:none;font-size:12px;font-weight:700;">Slides 9–12</a>
          </div>
        </div>

        <div class="sik-carousel-track" style="display:flex;flex-wrap:nowrap;gap:20px;overflow:auto;padding:4px 2px 16px;">
          ${featuredCardsHtml}
        </div>
      </section>

      <section id="carousel-categories" style="margin-bottom:46px;">
        <div style="display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:14px;margin-bottom:18px;">
          <div>
            <span style="display:inline-block;background:#fdf3ef;color:#D96B43;border:1px solid #f5d4c6;padding:4px 12px;border-radius:999px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">
              🗂️ Browse by Culinary Theme
            </span>
            <h2 style="font-family:Georgia,serif;font-size:26px;font-weight:700;color:#1a202c;margin:0 0 4px;">
              Explore Our 6 Italian Recipe Categories
            </h2>
            <p style="font-size:14px;color:#4a5568;margin:0;">
              Swipe through our 6 core Italian cooking collections below, or jump straight to each category’s dedicated article carousel.
            </p>
          </div>
        </div>

        <div class="sik-carousel-track" style="display:flex;flex-wrap:nowrap;gap:18px;overflow:auto;padding:4px 2px 16px;">
          ${categoryOverviewCardsHtml}
        </div>
      </section>

      <div style="margin-bottom:48px;">
        ${categoryCarouselsHtml}
      </div>

      <footer id="sik-footer" style="background:#1a202c;color:#e2e8f0;border-radius:24px;padding:40px 32px 28px;margin-top:48px;border-top:5px solid #227755;">
        <div style="display:flex;flex-wrap:wrap;gap:32px;justify-content:space-between;padding-bottom:32px;border-bottom:1px solid #2d3748;">
          
          <div style="flex:1 1 250px;">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
              <span style="background:#227755;color:#ffffff;width:36px;height:36px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;font-size:18px;">🇮🇹</span>
              <div>
                <div style="font-family:Georgia,serif;font-size:19px;font-weight:700;color:#ffffff;line-height:1.2;">Semplice Italian Kitchen</div>
                <div style="font-size:11px;color:#68d391;font-weight:600;">Real Italian Flavor. Everyday Cooking.</div>
              </div>
            </div>
            <p style="font-size:13px;color:#a0aec0;line-height:1.65;margin:0 0 16px;">
              Your home for authentic, budget-friendly Italian recipes, quick 20-minute weeknight dinners, regional specialties, and high-protein meal prep—complete with step-by-step photos and free printable PDF recipe cards.
            </p>
            <div style="background:#2d3748;border-radius:12px;padding:10px 14px;font-size:12px;color:#edf2f7;">
              ✅ <strong>12 Complete Guides</strong> &bull; 📸 <strong>36 Step Photos</strong> &bull; 📥 <strong>12 Free PDFs</strong>
            </div>
          </div>

          <div style="flex:1 1 200px;">
            <h3 style="font-family:Georgia,serif;font-size:16px;font-weight:700;color:#ffffff;margin:0 0 14px;padding-bottom:8px;border-bottom:2px solid #227755;display:inline-block;">
              Recipe Categories
            </h3>
            <ul style="list-style:none;padding:0;margin:0;font-size:13px;line-height:2.1;">
              ${CATEGORIES_CONFIG.map(
                (c) =>
                  `<li><a href="${WP_URL}/category/${c.slug}/" style="color:#cbd5e0;text-decoration:none;">${c.icon} ${c.name}</a></li>`
              ).join('')}
            </ul>
          </div>

          <div style="flex:1 1 220px;">
            <h3 style="font-family:Georgia,serif;font-size:16px;font-weight:700;color:#ffffff;margin:0 0 14px;padding-bottom:8px;border-bottom:2px solid #D96B43;display:inline-block;">
              Reader Favorites &amp; PDFs
            </h3>
            <ul style="list-style:none;padding:0;margin:0;font-size:13px;line-height:1.95;">
              <li><a href="${byPriority[1].permalink}" style="color:#cbd5e0;text-decoration:none;">🌾 What Is Cucina Povera? (+ Stew)</a></li>
              <li><a href="${byPriority[2].permalink}" style="color:#cbd5e0;text-decoration:none;">🥣 25-Min Roman Pasta e Ceci</a></li>
              <li><a href="${byPriority[3].permalink}" style="color:#cbd5e0;text-decoration:none;">🌿 Tuscan White Beans &amp; Rosemary</a></li>
              <li><a href="${byPriority[7].permalink}" style="color:#cbd5e0;text-decoration:none;">🍝 Ligurian Pesto Pasta (Trenette)</a></li>
              <li><a href="${byPriority[9].permalink}" style="color:#cbd5e0;text-decoration:none;">💪 44g Protein Chicken Pesto Pasta</a></li>
              <li><a href="${byPriority[12].permalink}" style="color:#cbd5e0;text-decoration:none;">🧀 Abruzzese Crespelle in Brodo</a></li>
            </ul>
          </div>

          <div style="flex:1 1 180px;">
            <h3 style="font-family:Georgia,serif;font-size:16px;font-weight:700;color:#ffffff;margin:0 0 14px;padding-bottom:8px;border-bottom:2px solid #EDA602;display:inline-block;">
              Quick Links &amp; Info
            </h3>
            <ul style="list-style:none;padding:0;margin:0;font-size:13px;line-height:2.1;">
              <li><a href="${WP_URL}/" style="color:#cbd5e0;text-decoration:none;">🏠 Website Homepage</a></li>
              <li><a href="${WP_URL}/italian-recipes/" style="color:#cbd5e0;text-decoration:none;">🇮🇹 All Italian Recipes Hub</a></li>
              <li><a href="${WP_URL}/about/" style="color:#cbd5e0;text-decoration:none;">📖 About Semplice Kitchen</a></li>
              <li><a href="${WP_URL}/contact/" style="color:#cbd5e0;text-decoration:none;">✉️ Contact &amp; Recipe Requests</a></li>
              <li><a href="#carousel-featured" style="color:#68d391;text-decoration:none;font-weight:700;">🎠 Featured Articles Carousel &uarr;</a></li>
              <li><a href="#sik-top" style="color:#fbd38d;text-decoration:none;font-weight:700;">&uarr; Back to Top of Page</a></li>
            </ul>
          </div>

        </div>

        <div style="padding-top:22px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;font-size:12px;color:#718096;">
          <div>
            &copy; ${new Date().getFullYear()} <strong style="color:#e2e8f0;">Semplice Italian Kitchen</strong> (<a href="${WP_URL}" style="color:#68d391;text-decoration:none;">foodsprepared.wasmer.app</a>). Handcrafted Italian recipes &amp; printable PDF kitchen cards.
          </div>
          <div style="display:flex;gap:14px;">
            <a href="${WP_URL}/about/" style="color:#a0aec0;text-decoration:none;">About</a>
            <span>&bull;</span>
            <a href="${WP_URL}/contact/" style="color:#a0aec0;text-decoration:none;">Contact</a>
            <span>&bull;</span>
            <a href="${WP_URL}/italian-recipes/" style="color:#a0aec0;text-decoration:none;">Recipe Index</a>
          </div>
        </div>
      </footer>
    </div>
  `;

  return minifyHtmlForWp(fullHtml);
}

async function publishHomepages() {
  const htmlContent = buildStructuredHomepageHtml();

  fs.writeFileSync(
    path.join(__dirname, '..', 'output', 'wordpress_carousel_homepage.html'),
    htmlContent
  );

  const targets = [
    {
      external_id: 'page-italian-recipes-hub',
      title: 'Semplice Italian Kitchen: Complete Italian Recipes Carousel Hub & Category Directory',
      slug: 'italian-recipes',
      category: 'Italian Recipes Hub',
    },
    {
      external_id: 'page-semplice-homepage-v1',
      title: 'Welcome to Semplice Italian Kitchen — Featured Italian Recipes & Category Carousels',
      slug: 'home',
      category: 'Italian Recipes Hub',
    },
  ];

  for (const t of targets) {
    console.log(`Publishing ${t.slug} (${t.external_id})...`);
    const payload = {
      external_id: t.external_id,
      title: t.title,
      slug: t.slug,
      excerpt:
        'Welcome to Semplice Italian Kitchen! Explore our interactive Featured Articles Carousel, browse all 6 Italian Recipe Category Carousels (Budget-Friendly, Quick Dinners, Pasta & Risotto, Regional Italian, Soups & Beans, and Protein-Rich Meals), and download free printable PDF recipe cards.',
      content: htmlContent,
      status: 'publish',
      categories: [t.category],
      featured_image_url: byPriority[7].thumbnailUrl,
      seo: {
        meta_title: t.title,
        meta_description:
          'Welcome to Semplice Italian Kitchen! Browse our interactive recipe carousels across 6 Italian cooking categories with step-by-step photos and free printable PDF cards.',
        focus_keyword: 'Italian Recipes Homepage',
      },
    };

    const res = await fetch(`${WP_URL}/wp-json/autosync/v1/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-sync-key': SYNC_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log(` -> Result for ${t.slug}:`, data);
  }
}

publishHomepages().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
