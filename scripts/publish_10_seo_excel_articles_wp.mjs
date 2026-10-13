import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { NEW_10_SEO_ITALIAN_RECIPES } from './new_10_seo_italian_recipes_data.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env if present
const envPath = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^([A-Z0-9_]+)=["']?(.*?)["']?$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2];
    }
  }
}

const WP_URL = process.env.WP_SITE_URL || 'https://foodsprepared.wasmer.app';
const SYNC_KEY = process.env.WP_AUTOSYNC_SECRET || '';

async function fetchWithRetry(url, options = {}, retries = 4) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          Connection: 'close',
          ...(options.headers || {}),
        },
      });
      return res;
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(`   [Retry ${attempt}/${retries}] ${url} failed (${err.message}), retrying in ${attempt * 1500}ms...`);
      await new Promise((r) => setTimeout(r, attempt * 1500));
    }
  }
}

const OUTPUT_PDF_DIR = path.resolve(__dirname, '..', 'output', 'pdfs');
fs.mkdirSync(OUTPUT_PDF_DIR, { recursive: true });

const LOCAL_IMAGE_MAP = {
  limone: 'src/assets/images/italian_seo_pasta_al_limone.jpg',
  zozzona: 'src/assets/images/italian_seo_pasta_alla_zozzona.jpg',
  cenere: 'src/assets/images/italian_seo_pasta_alla_cenere.jpg',
  patate: 'src/assets/images/italian_seo_pasta_e_patate_provola.jpg',
  gricia: 'src/assets/images/italian_seo_pasta_alla_gricia.jpg',
  acquapazza: 'src/assets/images/italian_seo_pesce_acqua_pazza.jpg',
  focaccia: 'src/assets/images/italian_seo_focaccia_barese.jpg',
  acquacotta: 'src/assets/images/italian_seo_acquacotta_maremmana.jpg',
  carrettiera: 'src/assets/images/italian_seo_spaghetti_carrettiera.jpg',
  gramigna: 'src/assets/images/italian_seo_gramigna_salsiccia.jpg',
};

function mapToWpCategories(italianCategory) {
  const cat = (italianCategory || 'Budget-Friendly Italian').trim();
  if (cat.toLowerCase().includes('budget')) {
    return ['Budget Friendly Italian', 'Italian Recipes'];
  }
  return [cat, 'Italian Recipes'];
}

// Pure Node.js Multi-Line A4 PDF Generator for Recipe Cards
function buildRecipePdfBuffer(recipe, wpPermalink) {
  const cleanAscii = (str) =>
    (str || '')
      .replace(/[—–]/g, '-')
      .replace(/[’‘]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/[^\x20-\x7E]/g, '')
      .trim();

  const wrapLine = (text, maxChars = 84) => {
    const words = cleanAscii(text).split(/\s+/);
    const lines = [];
    let current = '';
    for (const w of words) {
      if ((current + ' ' + w).trim().length > maxChars) {
        if (current) lines.push(current.trim());
        current = w;
      } else {
        current = (current + ' ' + w).trim();
      }
    }
    if (current) lines.push(current.trim());
    return lines;
  };

  const escapePdfText = (s) => s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

  const ops = [];
  let y = 790;

  const drawText = (text, x, yPos, font = 'F1', size = 10, r = 0.1, g = 0.14, b = 0.2) => {
    ops.push(`BT /${font} ${size} Tf ${r} ${g} ${b} rg ${x} ${yPos} Td (${escapePdfText(text)}) Tj ET`);
  };

  // Top Header Banner
  ops.push(`0.13 0.47 0.33 rg 36 742 523 64 re f`);
  drawText(
    `SEMPLICE ITALIAN KITCHEN  |  ${cleanAscii(recipe.italianCategory || 'ITALIAN RECIPE').toUpperCase()}`,
    50,
    785,
    'F2',
    9,
    0.9,
    0.98,
    0.94
  );

  const titleLines = wrapLine(recipe.title, 58);
  drawText(titleLines[0] || '', 50, 767, 'F2', 13, 1, 1, 1);
  if (titleLines[1]) {
    drawText(titleLines[1], 50, 751, 'F2', 11, 0.95, 0.95, 0.95);
  }

  y = 720;
  // Quick Metrics Strip
  ops.push(`0.99 0.95 0.91 rg 36 ${y - 18} 523 28 re f`);
  drawText(
    `PREP: ${cleanAscii(recipe.prepTime)}   |   COOK: ${cleanAscii(recipe.cookTime)}   |   TOTAL: ${cleanAscii(recipe.totalTime)}   |   SERVINGS: ${cleanAscii(recipe.servings)}   |   CALORIES: ${recipe.calories} kcal`,
    48,
    y - 8,
    'F2',
    8.5,
    0.48,
    0.29,
    0.18
  );

  y -= 38;
  drawText('INGREDIENTS', 40, y, 'F2', 11, 0.85, 0.42, 0.26);
  y -= 15;

  for (const ing of recipe.ingredients || []) {
    if (y < 140) break;
    const lineStr = `* ${ing.amount} ${ing.item}${ing.notes ? ' (' + ing.notes + ')' : ''}`;
    for (const wl of wrapLine(lineStr, 88)) {
      drawText(wl, 46, y, 'F1', 9.2, 0.15, 0.2, 0.28);
      y -= 12.5;
    }
  }

  y -= 8;
  drawText('STEP-BY-STEP INSTRUCTIONS', 40, y, 'F2', 11, 0.13, 0.47, 0.33);
  y -= 15;

  for (const inst of recipe.instructions || []) {
    if (y < 80) break;
    drawText(
      `Step ${inst.step}: ${cleanAscii(inst.title)}${inst.timerMinutes ? ' (' + inst.timerMinutes + ' mins)' : ''}`,
      46,
      y,
      'F2',
      9.5,
      0.06,
      0.09,
      0.16
    );
    y -= 12.5;
    for (const wl of wrapLine(inst.text, 88)) {
      if (y < 65) break;
      drawText(wl, 54, y, 'F1', 9, 0.2, 0.25, 0.33);
      y -= 12;
    }
    y -= 4;
  }

  if (y > 85 && recipe.chefTips?.length) {
    y -= 4;
    drawText("NONNA'S CHEF TIPS:", 40, y, 'F2', 10, 0.85, 0.42, 0.26);
    y -= 12;
    for (const tip of recipe.chefTips.slice(0, 2)) {
      for (const wl of wrapLine(`- ${tip}`, 88)) {
        if (y < 55) break;
        drawText(wl, 46, y, 'F1', 8.5, 0.25, 0.3, 0.38);
        y -= 11;
      }
    }
  }

  // Footer
  ops.push(`0.85 0.42 0.26 RG 1 w 36 44 m 559 44 l S`);
  drawText(
    `Full Recipe & Step Photos Online: ${cleanAscii(wpPermalink)}`,
    40,
    30,
    'F2',
    8.5,
    0.35,
    0.4,
    0.48
  );

  const streamContent = ops.join('\n');
  const objects = [
    `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`,
    `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`,
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj\n`,
    `4 0 obj\n<< /Length ${Buffer.byteLength(streamContent, 'utf8')} >>\nstream\n${streamContent}\nendstream\nendobj\n`,
    `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`,
    `6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n`,
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (const obj of objects) {
    offsets.push(Buffer.byteLength(pdf, 'utf8'));
    pdf += obj;
  }
  const xrefStart = Buffer.byteLength(pdf, 'utf8');
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
  return Buffer.from(pdf, 'utf8');
}

async function uploadPdfToPublicHost(pdfBuffer, slug) {
  try {
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', new Blob([pdfBuffer], { type: 'application/pdf' }), `${slug}.pdf`);
    const res = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: form,
    });
    const text = (await res.text()).trim();
    if (res.ok && text.startsWith('https://')) {
      return text;
    }
  } catch (e) {
    console.warn('Catbox upload fallback:', e.message);
  }
  return `https://aymen07171.github.io/pinrecipe-scale-engine/output/pdfs/${slug}.pdf`;
}

function buildSimpleNourishStyleArticleHtml(r, wpHeroUrl, gallery, pdfDownloadUrl) {
  const photo1 = gallery[0]?.url || wpHeroUrl;
  const photo2 = gallery[1]?.url || wpHeroUrl;
  const photo3 = gallery[2]?.url || wpHeroUrl;

  const introHtml = (r.introParagraphs || [])
    .map((p) => `<p style="margin:0 0 18px;font-size:17px;line-height:1.8;color:#2d3748;">${p}</p>`)
    .join('\n');

  const whyLoveHtml = (r.whyLove || [])
    .map((item) => `<li style="margin-bottom:10px;font-size:16.5px;line-height:1.75;color:#2d3748;">${item}</li>`)
    .join('\n');

  const ingredientNotesHtml = (r.ingredientNotes || [])
    .map((item) => `<li style="margin-bottom:12px;font-size:16.5px;line-height:1.75;color:#2d3748;">${item}</li>`)
    .join('\n');

  const stepsBlogHtml = (r.instructions || [])
    .map(
      (inst) =>
        `<li style="margin-bottom:16px;font-size:16.5px;line-height:1.8;color:#2d3748;"><strong>${inst.title}:</strong> ${inst.text}</li>`
    )
    .join('\n');

  const faqHtml = (r.faqs || [])
    .map(
      (f) =>
        `<h3 style="font-size:19px;font-weight:700;color:#1a202c;margin:20px 0 8px;">${f.q}</h3>\n<p style="margin:0 0 16px;font-size:16.5px;line-height:1.75;color:#2d3748;">${f.a}</p>`
    )
    .join('\n');

  const storageHtml = (r.storageTips || [])
    .map((s) => `<li style="margin-bottom:10px;font-size:16.5px;line-height:1.75;color:#2d3748;">${s}</li>`)
    .join('\n');

  const variationsHtml = (r.variations || [])
    .map((v) => `<li style="margin-bottom:10px;font-size:16.5px;line-height:1.75;color:#2d3748;">${v}</li>`)
    .join('\n');

  const cardIngredientsHtml = (r.ingredients || [])
    .map(
      (ing) =>
        `<li style="margin-bottom:8px;font-size:16px;line-height:1.6;color:#2d3748;"><input type="checkbox" style="margin-right:10px;accent-color:#D96B43;transform:scale(1.15);" /><strong>${ing.amount}</strong> ${ing.item}${ing.notes ? ` <em style="color:#718096;">(${ing.notes})</em>` : ''}</li>`
    )
    .join('\n');

  const cardInstructionsHtml = (r.instructions || [])
    .map(
      (inst) =>
        `<li style="margin-bottom:14px;font-size:16px;line-height:1.75;color:#2d3748;"><strong>${inst.title}:</strong> ${inst.text}</li>`
    )
    .join('\n');

  const cardTipsHtml = (r.chefTips || []).length
    ? `<h3 style="font-size:20px;font-weight:700;color:#1a202c;margin:24px 0 12px;">Notes &amp; Pro Tips</h3>\n<ul style="margin:0 0 20px;padding-left:22px;">${(r.chefTips || [])
        .map((t) => `<li style="margin-bottom:8px;font-size:15.5px;line-height:1.7;color:#4a5568;">${t}</li>`)
        .join('\n')}</ul>`
    : '';

  const pinShareUrl = `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(
    `${WP_URL}/${r.slug}/`
  )}&media=${encodeURIComponent(wpHeroUrl)}&description=${encodeURIComponent(r.title)}`;

  return [
    `<div class="nourish-clean-article" style="max-width:780px;margin:0 auto;font-family:'Poppins',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#2d3748;">`,
    `<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;background:#FFF8F2;border:1px solid #F3E5D8;padding:14px 20px;border-radius:12px;margin-bottom:26px;">`,
    `<span style="font-size:14px;font-weight:600;color:#7C4A2D;">🇮🇹 ${r.italianCategory} &bull; ⏱️ ${r.totalTime}</span>`,
    `<div style="display:flex;gap:10px;flex-wrap:wrap;">`,
    `<a href="#recipe" style="background:#227755;color:#ffffff;padding:8px 18px;border-radius:999px;font-size:13px;font-weight:600;text-decoration:none;display:inline-block;">📋 Jump to Recipe</a>`,
    `<a href="${pdfDownloadUrl}" target="_blank" rel="noopener" download="${r.slug}.pdf" style="background:#D96B43;color:#ffffff;padding:8px 18px;border-radius:999px;font-size:13px;font-weight:600;text-decoration:none;display:inline-block;">📥 Download Recipe PDF</a>`,
    `</div></div>`,
    introHtml,
    `<p style="margin:28px 0;"><img src="${photo1}" alt="${r.title}" style="width:100%;max-height:540px;object-fit:cover;border-radius:14px;display:block;margin:0 auto;" /></p>`,
    `<h2 style="font-size:28px;font-weight:700;color:#1a202c;margin:36px 0 16px;">Why You&rsquo;ll Love It</h2>`,
    `<ul style="margin:0 0 28px;padding-left:24px;">${whyLoveHtml}</ul>`,
    `<h2 style="font-size:28px;font-weight:700;color:#1a202c;margin:36px 0 16px;">Ingredient Notes &amp; Details</h2>`,
    `<ul style="margin:0 0 28px;padding-left:24px;">${ingredientNotesHtml}</ul>`,
    `<p style="margin:28px 0;"><img src="${photo2}" alt="${r.title} preparation" style="width:100%;max-height:540px;object-fit:cover;border-radius:14px;display:block;margin:0 auto;" /></p>`,
    `<h2 style="font-size:28px;font-weight:700;color:#1a202c;margin:36px 0 16px;">Step-by-Step Instructions</h2>`,
    `<ol style="margin:0 0 28px;padding-left:24px;">${stepsBlogHtml}</ol>`,
    `<p style="margin:28px 0;"><img src="${photo3}" alt="${r.title} serving" style="width:100%;max-height:540px;object-fit:cover;border-radius:14px;display:block;margin:0 auto;" /></p>`,
    `<h2 style="font-size:28px;font-weight:700;color:#1a202c;margin:36px 0 16px;">FAQ</h2>`,
    faqHtml,
    `<h2 style="font-size:28px;font-weight:700;color:#1a202c;margin:36px 0 16px;">Storage Tips</h2>`,
    `<ul style="margin:0 0 28px;padding-left:24px;">${storageHtml}</ul>`,
    `<h2 style="font-size:28px;font-weight:700;margin:36px 0 16px;color:#1a202c;">Variations</h2>`,
    `<ul style="margin:0 0 40px;padding-left:24px;">${variationsHtml}</ul>`,
    `<div id="recipe" style="background:#FFF8F2;border:2px solid #F0E2D4;border-radius:20px;overflow:hidden;margin:40px 0 24px;box-shadow:0 8px 24px rgba(0,0,0,0.04);">`,
    `<div style="background:#227755;color:#ffffff;padding:30px 28px;text-align:center;">`,
    `<img src="${wpHeroUrl}" alt="${r.title}" style="width:170px;height:170px;object-fit:cover;border-radius:50%;border:6px solid #ffffff;margin:0 auto 16px;display:block;" />`,
    `<h2 style="font-size:26px;font-weight:700;color:#ffffff;margin:0 0 10px;">${r.title}</h2>`,
    `<p style="font-size:15px;line-height:1.65;color:#EAF5F0;max-width:620px;margin:0 auto 14px;">${r.metaDescription}</p>`,
    `<div style="font-size:16px;color:#FBBF24;margin-bottom:18px;">&#9733;&#9733;&#9733;&#9733;&#9733; <span style="font-size:13px;color:#ffffff;">5.0 from 24 reviews</span></div>`,
    `<div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">`,
    `<a href="${pdfDownloadUrl}" target="_blank" rel="noopener" download="${r.slug}.pdf" style="background:#ffffff;color:#227755;padding:10px 22px;border-radius:999px;font-size:14px;font-weight:700;text-decoration:none;display:inline-block;">📥 Download Recipe PDF</a>`,
    `<a href="${pinShareUrl}" target="_blank" rel="noopener nofollow" style="background:#D96B43;color:#ffffff;padding:10px 22px;border-radius:999px;font-size:14px;font-weight:700;text-decoration:none;display:inline-block;">📌 Pin Recipe</a>`,
    `</div></div>`,
    `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:12px;background:#FDF2E7;padding:18px 24px;border-bottom:1px solid #F0E2D4;text-align:center;">`,
    `<div><span style="font-size:12px;text-transform:uppercase;color:#8C6246;display:block;font-weight:600;">Prep Time</span><strong style="font-size:16px;color:#1a202c;">${r.prepTime}</strong></div>`,
    `<div><span style="font-size:12px;text-transform:uppercase;color:#8C6246;display:block;font-weight:600;">Cook Time</span><strong style="font-size:16px;color:#1a202c;">${r.cookTime}</strong></div>`,
    `<div><span style="font-size:12px;text-transform:uppercase;color:#8C6246;display:block;font-weight:600;">Total Time</span><strong style="font-size:16px;color:#1a202c;">${r.totalTime}</strong></div>`,
    `<div><span style="font-size:12px;text-transform:uppercase;color:#8C6246;display:block;font-weight:600;">Servings</span><strong style="font-size:16px;color:#1a202c;">${r.servings}</strong></div>`,
    `<div><span style="font-size:12px;text-transform:uppercase;color:#8C6246;display:block;font-weight:600;">Calories</span><strong style="font-size:16px;color:#D96B43;">${r.calories} kcal</strong></div>`,
    `</div>`,
    `<div style="padding:28px;">`,
    `<h3 style="font-size:22px;font-weight:700;color:#1a202c;margin:0 0 14px;border-bottom:2px solid #F0E2D4;padding-bottom:8px;">Ingredients</h3>`,
    `<ul style="margin:0 0 28px;padding-left:22px;">${cardIngredientsHtml}</ul>`,
    `<h3 style="font-size:22px;font-weight:700;color:#1a202c;margin:0 0 14px;border-bottom:2px solid #F0E2D4;padding-bottom:8px;">Instructions</h3>`,
    `<ol style="margin:0 0 20px;padding-left:22px;">${cardInstructionsHtml}</ol>`,
    cardTipsHtml,
    `<div style="margin-top:24px;padding:16px 20px;background:#ffffff;border:1px solid #F0E2D4;border-radius:12px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">`,
    `<span style="font-size:14px;color:#4a5568;"><strong>Nutrition per serving:</strong> ${r.calories} kcal &bull; Protein: ${r.macros?.protein || '18g'} &bull; Carbs: ${r.macros?.carbs || '48g'} &bull; Fat: ${r.macros?.fat || '14g'} &bull; Fiber: ${r.macros?.fiber || '5g'}</span>`,
    `<a href="${pdfDownloadUrl}" target="_blank" rel="noopener" download="${r.slug}.pdf" style="color:#D96B43;font-size:14px;font-weight:700;text-decoration:none;">📥 Save Printable PDF Card &rarr;</a>`,
    `</div>`,
    `</div></div>`,
    `</div>`,
  ].join('\n');
}

async function main() {
  console.log(`Starting WordPress Publication of ${NEW_10_SEO_ITALIAN_RECIPES.length} New SEO Opportunity Italian Recipes...`);

  // Load existing 12 articles so we can use their step gallery photos for secondary shots and merge the final 22-article manifest
  const manifestPath = path.resolve(__dirname, '..', 'output', 'published_wordpress_12_articles.json');
  const existing12 = JSON.parse(fs.readFileSync(manifestPath, 'utf8')).filter((item) => item.priority <= 12);
  const pantryPrepWpUrl = existing12[0]?.gallery?.[0]?.url || 'https://foodsprepared.wasmer.app/wp-content/uploads/2026/10/recipe-6aca84801a4d1.jpeg';
  const breadSideWpUrl = existing12[0]?.gallery?.[2]?.url || 'https://foodsprepared.wasmer.app/wp-content/uploads/2026/10/recipe-6aca8481ad7eb.jpeg';

  const newlyPublished = [];

  for (let i = 0; i < NEW_10_SEO_ITALIAN_RECIPES.length; i++) {
    const r = NEW_10_SEO_ITALIAN_RECIPES[i];
    const relImgPath = LOCAL_IMAGE_MAP[r.localImageKey];
    const absImgPath = path.resolve(__dirname, '..', relImgPath);
    const b64 = `data:image/jpeg;base64,${fs.readFileSync(absImgPath).toString('base64')}`;

    // 1. Generate & Upload Printable A4 PDF Recipe Card
    const wpPermalink = `${WP_URL}/${r.slug}/`;
    const pdfBuf = buildRecipePdfBuffer(r, wpPermalink);
    const localPdfFile = path.join(OUTPUT_PDF_DIR, `${r.slug}.pdf`);
    fs.writeFileSync(localPdfFile, pdfBuf);
    const pdfDownloadUrl = await uploadPdfToPublicHost(pdfBuf, r.slug);
    console.log(`[${i + 1}/10 PDF] ${r.slug}.pdf -> ${pdfDownloadUrl}`);

    // 2. Pass 1: Upload Featured Image to WordPress via AutoSync and get its permanent WP Media Library URL
    console.log(`[${i + 1}/10 Media Upload] Uploading ${path.basename(relImgPath)} for "${r.title}"...`);
    const pass1Res = await fetchWithRetry(`${WP_URL}/wp-json/autosync/v1/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-sync-key': SYNC_KEY },
      body: JSON.stringify({
        articles: [
          {
            title: r.title,
            slug: r.slug,
            external_id: r.id,
            status: 'publish',
            post_type: 'post',
            categories: mapToWpCategories(r.italianCategory),
            featured_image: b64,
            content: `<p>${r.metaDescription}</p>`,
          },
        ],
      }),
    });

    const pass1Json = await pass1Res.json();
    const postId = pass1Json?.results?.[0]?.post_id;
    let wpHeroUrl = '';
    if (postId) {
      const postInfo = await (await fetchWithRetry(`${WP_URL}/wp-json/wp/v2/posts/${postId}`)).json();
      if (postInfo.featured_media) {
        const mediaInfo = await (await fetchWithRetry(`${WP_URL}/wp-json/wp/v2/media/${postInfo.featured_media}`)).json();
        if (mediaInfo.source_url) {
          wpHeroUrl = mediaInfo.source_url;
          console.log(`   -> Hosted on WP Media Library: ${wpHeroUrl}`);
        }
      }
    }

    const gallery = [
      {
        url: wpHeroUrl,
        caption: `Photo 1: ${r.topic} — Plated trattoria-style with authentic Italian aromatics.`,
        alt: r.title,
      },
      {
        url: pantryPrepWpUrl,
        caption: `Photo 2: Mise en Place — Bronze-die pasta, fresh herbs, garlic, and cold-pressed olive oil.`,
        alt: `${r.topic} pantry preparation`,
      },
      {
        url: breadSideWpUrl,
        caption: `Photo 3: Trattoria Serving — Served warm with crusty garlic-rubbed Italian bread.`,
        alt: `${r.topic} table presentation`,
      },
    ];

    // 3. Pass 2: Publish Complete Clean Editorial HTML (with 3 images, Jump to Recipe, Download PDF, and WPRM-style Recipe Card)
    const cleanHtml = buildSimpleNourishStyleArticleHtml(r, wpHeroUrl, gallery, pdfDownloadUrl);
    const pass2Res = await fetchWithRetry(`${WP_URL}/wp-json/autosync/v1/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-sync-key': SYNC_KEY },
      body: JSON.stringify({
        articles: [
          {
            title: r.title,
            slug: r.slug,
            external_id: r.id,
            status: 'publish',
            post_type: 'post',
            categories: mapToWpCategories(r.italianCategory),
            tags: [
              r.focusKeyword,
              r.italianCategory,
              ...(r.pinterestPin?.hashtags?.map((h) => h.replace(/^#/, '')) || []),
            ],
            content: cleanHtml,
          },
        ],
      }),
    });

    const pass2Json = await pass2Res.json();
    const resItem = pass2Json?.results?.[0] || {};
    console.log(`   -> Published Post ID ${resItem.post_id || postId}: ${resItem.permalink || wpPermalink}`);

    newlyPublished.push({
      priority: r.priority,
      rankId: r.rankId,
      id: r.id,
      postId: resItem.post_id || postId,
      title: r.title,
      slug: r.slug,
      category: r.italianCategory,
      permalink: resItem.permalink || wpPermalink,
      thumbnailUrl: wpHeroUrl,
      galleryCount: 3,
      pdfUrl: pdfDownloadUrl,
      totalTime: r.totalTime,
      calories: r.calories,
      servings: r.servings,
      metaDescription: r.metaDescription,
      pinterestPin: r.pinterestPin,
      gallery,
    });

    fs.writeFileSync(
      path.resolve(__dirname, '..', 'output', 'published_new_10_seo_articles.json'),
      JSON.stringify(newlyPublished, null, 2),
      'utf8'
    );
  }

  // Save both the 10 new articles manifest and the combined 22 articles manifest
  const all22Articles = [...existing12, ...newlyPublished];
  fs.writeFileSync(
    path.resolve(__dirname, '..', 'output', 'published_new_10_seo_articles.json'),
    JSON.stringify(newlyPublished, null, 2),
    'utf8'
  );
  fs.writeFileSync(
    path.resolve(__dirname, '..', 'output', 'published_wordpress_22_articles.json'),
    JSON.stringify(all22Articles, null, 2),
    'utf8'
  );
  fs.writeFileSync(manifestPath, JSON.stringify(all22Articles, null, 2), 'utf8');

  console.log(`\nSuccessfully published all 10 new SEO Opportunity articles! Total live WordPress articles: ${all22Articles.length}.`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
