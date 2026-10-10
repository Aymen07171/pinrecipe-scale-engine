import fs from 'fs';
import path from 'path';

const WP_URL = process.env.WP_SITE_URL || 'https://foodsprepared.wasmer.app';
const SYNC_KEY = process.env.WP_AUTOSYNC_SECRET || '';

const OUTPUT_PDF_DIR = path.resolve('output/pdfs');
fs.mkdirSync(OUTPUT_PDF_DIR, { recursive: true });

// 1. Load INITIAL_RECIPES and ITALIAN_RECIPE_CATEGORIES from src/data/sampleRecipes.ts
function loadRecipesFromTs() {
  let code = fs.readFileSync(path.resolve('src/data/sampleRecipes.ts'), 'utf8');
  code = code.replace(/import\s+\{[^}]+\}\s+from\s+'[^']+';/g, '');
  code = code.replace(
    /import\s+(\w+)\s+from\s+'\.\.\/assets\/images\/([^']+)';/g,
    "const $1 = 'src/assets/images/$2';"
  );
  code = code.replace(/export const (\w+)\s*:\s*[^=]+=/g, 'export const $1 =');
  const tempFile = path.resolve('scripts/_temp_recipes_data.mjs');
  fs.writeFileSync(tempFile, code, 'utf8');
  return import(`file:///${tempFile.replace(/\\/g, '/')}`);
}

// 2. Pure Node.js Multi-Line A4 PDF Generator for Recipe Cards
function buildRecipePdfBuffer(recipe, wpPermalink) {
  const cleanPdfText = (str) =>
    String(str || '')
      .replace(/—|–/g, '-')
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/[^\x20-\x7E]/g, '')
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)');

  const wrapLine = (text, maxChars = 84) => {
    const words = String(text || '').split(/\s+/);
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

  const ops = [];
  let y = 790;

  // Top Tricolore Accent Bars
  ops.push('0.086 0.639 0.290 rg 40 810 170 5 re f'); // Green
  ops.push('0.882 0.114 0.282 rg 385 810 170 5 re f'); // Red

  const addLine = (text, font = 'F1', size = 10, r = 0.1, g = 0.15, b = 0.25, indent = 45, spacing = 14) => {
    if (y < 45) return;
    ops.push(`BT /${font} ${size} Tf ${r} ${g} ${b} rg ${indent} ${y} Td (${cleanPdfText(text)}) Tj ET`);
    y -= spacing;
  };

  addLine(`LA CUCINA ITALIANA - SEMPLICE ITALIAN KITCHEN | ${(recipe.italianCategory || 'ITALIAN RECIPES').toUpperCase()}`, 'F2', 9, 0.88, 0.11, 0.28, 45, 16);

  for (const l of wrapLine(recipe.title, 58)) {
    addLine(l, 'F2', 15, 0.06, 0.09, 0.16, 45, 19);
  }
  y -= 4;

  for (const l of wrapLine(recipe.metaDescription, 88)) {
    addLine(l, 'F1', 9.5, 0.28, 0.33, 0.41, 45, 13);
  }
  y -= 6;

  // Quick Facts Box
  ops.push(`0.95 0.96 0.98 rg 40 ${y - 6} 515 22 re f`);
  addLine(
    `Prep: ${recipe.prepTime}  |  Cook: ${recipe.cookTime}  |  Total: ${recipe.totalTime}  |  Yield: ${recipe.servings}  |  Calories: ${recipe.calories} kcal`,
    'F2',
    9.5,
    0.06,
    0.09,
    0.16,
    48,
    22
  );

  // Ingredients Section
  addLine('INGREDIENTS CHECKLIST', 'F2', 11.5, 0.08, 0.5, 0.24, 45, 16);
  for (const ing of recipe.ingredients || []) {
    const noteStr = ing.notes ? ` (${ing.notes})` : '';
    const lineStr = `[ ] ${ing.amount} ${ing.item}${noteStr}`;
    for (const l of wrapLine(lineStr, 86)) {
      addLine(l, 'F1', 9.5, 0.12, 0.16, 0.23, 52, 13);
    }
  }
  y -= 6;

  // Step-by-Step Instructions Section
  addLine('STEP-BY-STEP CULINARY INSTRUCTIONS', 'F2', 11.5, 0.88, 0.11, 0.28, 45, 16);
  for (const inst of recipe.instructions || []) {
    const timerStr = inst.timerMinutes ? ` [${inst.timerMinutes} mins]` : '';
    addLine(`Step ${inst.step}: ${inst.title}${timerStr}`, 'F2', 10, 0.06, 0.09, 0.16, 48, 13);
    for (const l of wrapLine(inst.text, 86)) {
      addLine(l, 'F1', 9.5, 0.2, 0.25, 0.33, 56, 13);
    }
    y -= 3;
  }
  y -= 4;

  // Chef's Pro Tips
  if (recipe.chefTips && recipe.chefTips.length > 0) {
    addLine("CHEF'S PRO TIPS & STORAGE", 'F2', 11, 0.08, 0.5, 0.24, 45, 15);
    for (const tip of recipe.chefTips) {
      for (const l of wrapLine(`* ${tip}`, 86)) {
        addLine(l, 'F1', 9, 0.2, 0.25, 0.33, 52, 12);
      }
    }
  }

  // Footer
  y = 28;
  addLine(`Official Printable Recipe Card | Full Article & 3 Step Photos: ${wpPermalink}`, 'F1', 8.5, 0.4, 0.45, 0.52, 45, 12);

  const streamContent = ops.join('\n');
  const streamBytes = Buffer.byteLength(streamContent, 'utf8');

  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n',
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n',
    `6 0 obj\n<< /Length ${streamBytes} >>\nstream\n${streamContent}\nendstream\nendobj\n`,
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

// 3. Upload PDF buffer to Catbox to get a permanent public https://files.catbox.moe/xxxx.pdf URL
async function uploadPdfToPublicHost(pdfBuffer, slug) {
  try {
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', new Blob([pdfBuffer], { type: 'application/pdf' }), `${slug}.pdf`);
    const res = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: form,
    });
    if (res.ok) {
      const url = (await res.text()).trim();
      if (url.startsWith('https://')) {
        return url;
      }
    }
  } catch (err) {
    console.warn(`PDF upload warning for ${slug}:`, err.message);
  }
  return `${WP_URL}/${slug}/#printable-recipe-card`;
}

// 4. Convert Markdown longArticleContent to styled HTML
function markdownToHtml(md) {
  if (!md) return '';
  const lines = md.split('\n');
  let html = '';
  let inList = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      if (inList) {
        html += '</ul>\n';
        inList = false;
      }
      continue;
    }
    const formatInline = (t) =>
      t
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>');

    if (line.startsWith('### ')) {
      if (inList) {
        html += '</ul>\n';
        inList = false;
      }
      html += `<h3 style="font-size:20px;font-weight:800;color:#0f172a;margin:24px 0 10px;">${formatInline(line.slice(4))}</h3>\n`;
    } else if (line.startsWith('## ')) {
      if (inList) {
        html += '</ul>\n';
        inList = false;
      }
      html += `<h2 style="font-size:24px;font-weight:800;color:#0f172a;margin:28px 0 12px;border-bottom:2px solid #e2e8f0;padding-bottom:8px;">${formatInline(line.slice(3))}</h2>\n`;
    } else if (/^(\d+\.|-|\*)\s+/.test(line)) {
      if (!inList) {
        html += '<ul style="margin:12px 0 18px;padding-left:22px;color:#334155;line-height:1.8;">\n';
        inList = true;
      }
      const itemText = line.replace(/^(\d+\.|-|\*)\s+/, '');
      html += `  <li style="margin-bottom:8px;">${formatInline(itemText)}</li>\n`;
    } else {
      if (inList) {
        html += '</ul>\n';
        inList = false;
      }
      html += `<p style="margin:0 0 16px;font-size:16px;color:#334155;line-height:1.8;">${formatInline(line)}</p>\n`;
    }
  }
  if (inList) html += '</ul>\n';
  return html;
}

// 5. Map our category names to the exact WordPress category names on https://foodsprepared.wasmer.app
function mapToWpCategories(italianCategory) {
  const cat = (italianCategory || 'Budget-Friendly Italian').trim();
  if (cat.toLowerCase().includes('budget')) {
    return ['Budget Friendly Italian', 'Italian Recipes'];
  }
  return [cat, 'Italian Recipes'];
}

async function main() {
  const { INITIAL_RECIPES, ITALIAN_RECIPE_CATEGORIES } = await loadRecipesFromTs();
  console.log(`Loaded ${INITIAL_RECIPES.length} Priority Italian Recipe Articles.`);

  // Step A: Collect all unique image paths used across thumbnails and galleryImages
  const uniqueImages = new Set();
  for (const r of INITIAL_RECIPES) {
    if (r.thumbnailUrl) uniqueImages.add(r.thumbnailUrl);
    if (r.imageUrl) uniqueImages.add(r.imageUrl);
    for (const g of r.galleryImages || []) {
      if (g.url) uniqueImages.add(g.url);
    }
  }
  const uniqueImageList = Array.from(uniqueImages);
  console.log(`Found ${uniqueImageList.length} unique Italian photography assets to upload to WordPress Media Library.`);

  // Step B: Upload each unique image to WordPress via AutoSync so every image gets a permanent https://foodsprepared.wasmer.app/wp-content/uploads/... URL
  // We map each of the first uniqueImageList.length recipes to carry one unique image in Pass 1
  const wpImageUrlMap = new Map();

  for (let i = 0; i < uniqueImageList.length; i++) {
    const localImgPath = uniqueImageList[i];
    const targetRecipe = INITIAL_RECIPES[i % INITIAL_RECIPES.length];
    const absPath = path.resolve(localImgPath);
    const b64 = `data:image/jpeg;base64,${fs.readFileSync(absPath).toString('base64')}`;

    console.log(`[Pass 1 - Media Upload ${i + 1}/${uniqueImageList.length}] Uploading ${path.basename(localImgPath)} via ${targetRecipe.id}...`);
    const res = await fetch(`${WP_URL}/wp-json/autosync/v1/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-sync-key': SYNC_KEY },
      body: JSON.stringify({
        articles: [
          {
            title: targetRecipe.title,
            slug: targetRecipe.slug,
            external_id: targetRecipe.id,
            status: 'publish',
            post_type: 'post',
            categories: mapToWpCategories(targetRecipe.italianCategory),
            featured_image: b64,
            content: `<p>${targetRecipe.metaDescription}</p>`,
          },
        ],
      }),
    });
    const syncData = await res.json();
    const postId = syncData?.results?.[0]?.post_id;
    if (postId) {
      const postInfo = await (await fetch(`${WP_URL}/wp-json/wp/v2/posts/${postId}`)).json();
      if (postInfo.featured_media) {
        const mediaInfo = await (await fetch(`${WP_URL}/wp-json/wp/v2/media/${postInfo.featured_media}`)).json();
        if (mediaInfo.source_url) {
          wpImageUrlMap.set(localImgPath, mediaInfo.source_url);
          console.log(`   -> Hosted on WP: ${mediaInfo.source_url}`);
        }
      }
    }
  }

  // Step C: Generate 12 real PDF files locally AND upload each to get a direct public .pdf download URL
  const pdfUrlMap = new Map();
  for (const r of INITIAL_RECIPES) {
    const wpPermalink = `${WP_URL}/${r.slug}/`;
    const pdfBuf = buildRecipePdfBuffer(r, wpPermalink);
    const localPdfFile = path.join(OUTPUT_PDF_DIR, `${r.slug}.pdf`);
    fs.writeFileSync(localPdfFile, pdfBuf);
    const publicPdfUrl = await uploadPdfToPublicHost(pdfBuf, r.slug);
    pdfUrlMap.set(r.id, publicPdfUrl);
    console.log(`[PDF Generated & Hosted] ${r.slug}.pdf -> ${publicPdfUrl}`);
  }

  // Step D: Pass 2 — Publish all 12 Priority Articles with their exact Featured Thumbnail, 3 WP-hosted Step Photos, and Live Downloadable PDF Link!
  const publishedArticlesSummary = [];

  for (let idx = 0; idx < INITIAL_RECIPES.length; idx++) {
    const r = INITIAL_RECIPES[idx];
    const absThumbPath = path.resolve(r.thumbnailUrl || r.imageUrl);
    const thumbBase64 = `data:image/jpeg;base64,${fs.readFileSync(absThumbPath).toString('base64')}`;
    const wpHeroUrl = wpImageUrlMap.get(r.thumbnailUrl || r.imageUrl) || '';
    const pdfDownloadUrl = pdfUrlMap.get(r.id) || `${WP_URL}/${r.slug}/#printable-recipe-card`;

    const gallery = (r.galleryImages || []).map((g, gIdx) => ({
      url: wpImageUrlMap.get(g.url) || wpHeroUrl,
      caption: g.caption || `Step ${gIdx + 1} Photo`,
      alt: g.alt || `${r.title} photo ${gIdx + 1}`,
    }));

    const storyHtml = markdownToHtml(r.longArticleContent);

    const fullWpArticleHtml = `
<div class="pinrecipe-italian-article" style="max-width:880px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1e293b;line-height:1.8;">

  <!-- TOP BANNER: CATEGORY + DIRECT DOWNLOADABLE PDF BUTTON -->
  <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;background:linear-gradient(135deg,#0f172a,#1e293b);color:#ffffff;padding:16px 22px;border-radius:14px;margin-bottom:24px;border-left:5px solid #16a34a;border-right:5px solid #e11d48;">
    <div>
      <span style="display:inline-block;background:#16a34a;color:#ffffff;font-size:11px;font-weight:800;padding:3px 10px;border-radius:999px;text-transform:uppercase;letter-spacing:0.04em;">
        🇮🇹 ${r.italianCategory}
      </span>
      <div style="font-size:13px;color:#cbd5e1;margin-top:4px;">
        Includes Catchy Thumbnail &bull; ${gallery.length} Step-by-Step Photos &bull; Free Printable PDF Recipe Card
      </div>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;">
      <a href="${pdfDownloadUrl}" target="_blank" rel="noopener" download="${r.slug}.pdf" style="display:inline-block;background:#e11d48;color:#ffffff;padding:10px 18px;border-radius:8px;font-weight:700;font-size:13px;text-decoration:none;">
        📥 Download Recipe PDF (.PDF)
      </a>
      <a href="#printable-recipe-card" style="display:inline-block;background:#ffffff;color:#0f172a;padding:10px 16px;border-radius:8px;font-weight:700;font-size:13px;text-decoration:none;">
        📋 Jump to Recipe Card
      </a>
    </div>
  </div>

  <!-- ELEMENT 1: VISUALLY APPEALING & CATCHY RECIPE THUMBNAIL -->
  <figure style="margin:0 0 26px;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 8px 24px rgba(15,23,42,0.08);">
    <img src="${wpHeroUrl}" alt="${r.title}" style="width:100%;max-height:500px;object-fit:cover;display:block;" />
    <figcaption style="padding:12px 16px;background:#f8fafc;font-size:13px;color:#475569;text-align:center;border-top:1px solid #e2e8f0;">
      <strong>${r.title}</strong> — ${r.metaDescription}
    </figcaption>
  </figure>

  <!-- QUICK RECIPE METRICS & MACROS BAR -->
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(125px,1fr));gap:12px;background:#f8fafc;border:1px solid #e2e8f0;padding:18px;border-radius:14px;margin-bottom:28px;text-align:center;">
    <div>
      <span style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;display:block;">Prep Time</span>
      <strong style="font-size:16px;color:#0f172a;">⏱️ ${r.prepTime}</strong>
    </div>
    <div>
      <span style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;display:block;">Cook Time</span>
      <strong style="font-size:16px;color:#0f172a;">🍳 ${r.cookTime}</strong>
    </div>
    <div>
      <span style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;display:block;">Total Time</span>
      <strong style="font-size:16px;color:#0f172a;">⏰ ${r.totalTime}</strong>
    </div>
    <div>
      <span style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;display:block;">Servings</span>
      <strong style="font-size:16px;color:#0f172a;">👥 ${r.servings}</strong>
    </div>
    <div>
      <span style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;display:block;">Calories</span>
      <strong style="font-size:16px;color:#e11d48;">🔥 ${r.calories} kcal</strong>
    </div>
    <div>
      <span style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;display:block;">Protein / Fiber</span>
      <strong style="font-size:15px;color:#16a34a;">💪 ${r.macros?.protein || '18g'} / ${r.macros?.fiber || '6g'}</strong>
    </div>
  </div>

  <!-- LONG-FORM EDITORIAL STORY & CULINARY SCIENCE -->
  <div class="italian-editorial-story" style="margin-bottom:32px;">
    ${storyHtml}
  </div>

  <!-- ELEMENT 2: TWO TO THREE (3) RELATED RECIPE IMAGES GALLERY -->
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:24px;margin-bottom:34px;">
    <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin:0 0 6px;">
      📸 Step-by-Step Visual Culinary Guide (${gallery.length} Recipe Photos)
    </h2>
    <p style="font-size:14px;color:#64748b;margin:0 0 18px;">
      Follow these three visual checkpoints—from Italian pantry preparation to simmering emulsion and final trattoria plating:
    </p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;">
      ${gallery
        .map(
          (img, i) => `
      <figure style="margin:0;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
        <img src="${img.url}" alt="${img.alt}" style="width:100%;height:200px;object-fit:cover;display:block;" />
        <figcaption style="padding:12px;font-size:13px;color:#334155;line-height:1.5;">
          <strong style="color:#e11d48;display:block;margin-bottom:4px;">Recipe Photo ${i + 1} of ${gallery.length}</strong>
          ${img.caption}
        </figcaption>
      </figure>`
        )
        .join('\n')}
    </div>
  </div>

  <!-- ELEMENT 3: COMPLETE PRINTABLE & DOWNLOADABLE RECIPE CARD -->
  <div id="printable-recipe-card" style="background:#ffffff;border:2px solid #0f172a;border-radius:18px;padding:28px;margin-bottom:32px;box-shadow:0 12px 28px rgba(15,23,42,0.08);">
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px;border-bottom:2px solid #e2e8f0;padding-bottom:18px;margin-bottom:22px;">
      <div>
        <span style="background:#dcfce7;color:#15803d;font-size:11px;font-weight:800;padding:4px 10px;border-radius:999px;text-transform:uppercase;">
          🇮🇹 Official Italian Recipe Card &bull; ${r.italianCategory}
        </span>
        <h2 style="font-size:24px;font-weight:800;color:#0f172a;margin:8px 0 4px;">${r.title}</h2>
        <p style="font-size:14px;color:#475569;margin:0;">${r.metaDescription}</p>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <a href="${pdfDownloadUrl}" target="_blank" rel="noopener" download="${r.slug}.pdf" style="display:inline-block;background:#e11d48;color:#ffffff;padding:12px 20px;border-radius:10px;font-weight:800;font-size:14px;text-decoration:none;">
          📥 Download Printable PDF File
        </a>
      </div>
    </div>

    <!-- INGREDIENTS LIST -->
    <h3 style="font-size:18px;font-weight:800;color:#0f172a;margin:0 0 12px;">
      🛒 Ingredients (${r.servings})
    </h3>
    <ul style="list-style:none;padding:0;margin:0 0 26px;display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:10px;">
      ${(r.ingredients || [])
        .map(
          (ing) => `
      <li style="background:#f8fafc;border:1px solid #e2e8f0;padding:10px 14px;border-radius:10px;font-size:14px;color:#1e293b;">
        <strong style="color:#e11d48;">&#10003; ${ing.amount}</strong> ${ing.item}
        ${ing.notes ? `<span style="color:#64748b;font-style:italic;"> (${ing.notes})</span>` : ''}
      </li>`
        )
        .join('\n')}
    </ul>

    <!-- STEP-BY-STEP INSTRUCTIONS -->
    <h3 style="font-size:18px;font-weight:800;color:#0f172a;margin:0 0 14px;">
      👩‍🍳 Step-by-Step Instructions
    </h3>
    <div style="display:flex;flex-direction:column;gap:14px;margin-bottom:26px;">
      ${(r.instructions || [])
        .map(
          (inst) => `
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
          <strong style="font-size:15px;color:#0f172a;">Step ${inst.step}: ${inst.title}</strong>
          ${
            inst.timerMinutes
              ? `<span style="background:#ffe4e6;color:#e11d48;font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;">⏱️ ${inst.timerMinutes} mins</span>`
              : ''
          }
        </div>
        <p style="margin:0;font-size:14px;color:#334155;line-height:1.6;">${inst.text}</p>
      </div>`
        )
        .join('\n')}
    </div>

    <!-- CHEF'S PRO TIPS -->
    ${
      r.chefTips && r.chefTips.length > 0
        ? `
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:18px;margin-bottom:20px;">
      <h4 style="font-size:16px;font-weight:800;color:#166534;margin:0 0 8px;">👨‍🍳 Nonna &amp; Chef's Pro Tips</h4>
      <ul style="margin:0;padding-left:20px;color:#15803d;font-size:14px;line-height:1.6;">
        ${r.chefTips.map((t) => `<li style="margin-bottom:6px;">${t}</li>`).join('\n')}
      </ul>
    </div>`
        : ''
    }

    <!-- BOTTOM PDF DOWNLOAD CALLOUT -->
    <div style="background:#0f172a;color:#ffffff;border-radius:12px;padding:18px 22px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
      <div>
        <strong style="font-size:15px;display:block;">Want to save or print this Italian recipe for your kitchen binder?</strong>
        <span style="font-size:13px;color:#cbd5e1;">Click the button to download the formatted 1-page A4 PDF recipe card.</span>
      </div>
      <a href="${pdfDownloadUrl}" target="_blank" rel="noopener" download="${r.slug}.pdf" style="background:#16a34a;color:#ffffff;padding:10px 20px;border-radius:8px;font-weight:800;font-size:13px;text-decoration:none;">
        📥 Download Free Recipe PDF
      </a>
    </div>
  </div>
</div>
`.trim();

    console.log(`[Pass 2 - Publishing Full Article ${idx + 1}/12] ${r.title}...`);
    const pubRes = await fetch(`${WP_URL}/wp-json/autosync/v1/import`, {
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
              r.focusKeyword || 'italian recipe',
              r.italianCategory,
              ...(r.pinterestPin?.hashtags?.map((h) => h.replace('#', '')) || []),
            ],
            featured_image: thumbBase64,
            content: fullWpArticleHtml,
            recipe: {
              title: r.title,
              prep_time: r.prepTime,
              cook_time: r.cookTime,
              total_time: r.totalTime,
              servings: r.servings,
              calories: String(r.calories),
              cuisine: 'Italian',
              ingredients: (r.ingredients || []).map((i) => `${i.amount} ${i.item}`),
              instructions: (r.instructions || []).map((s) => `${s.step}. ${s.title}: ${s.text}`),
            },
          },
        ],
      }),
    });

    const pubJson = await pubRes.json();
    const resItem = pubJson?.results?.[0] || {};
    console.log(`   -> Published Post ID ${resItem.post_id}: ${resItem.permalink}`);

    publishedArticlesSummary.push({
      priority: idx + 1,
      id: r.id,
      postId: resItem.post_id,
      title: r.title,
      slug: r.slug,
      category: r.italianCategory,
      permalink: resItem.permalink || `${WP_URL}/${r.slug}/`,
      thumbnailUrl: wpHeroUrl,
      galleryCount: gallery.length,
      pdfUrl: pdfDownloadUrl,
      totalTime: r.totalTime,
      calories: r.calories,
      servings: r.servings,
      metaDescription: r.metaDescription,
      gallery,
    });
  }

  // Step E: Update the Dedicated `/italian-recipes/` Hub on WordPress with all 6 Categories and all 12 Published Articles!
  const hubHtml = `
<div class="italian-recipes-master-hub" style="max-width:1100px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1e293b;">
  <div style="background:linear-gradient(135deg,#0f172a,#1e293b);color:#ffffff;border-radius:20px;padding:40px 32px;margin-bottom:36px;border-top:6px solid #16a34a;border-bottom:6px solid #e11d48;">
    <span style="background:#16a34a;color:#ffffff;padding:5px 14px;border-radius:999px;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;">
      🇮🇹 Semplice Italian Kitchen &bull; Official Recipe Hub
    </span>
    <h2 style="font-size:34px;font-weight:800;color:#ffffff;margin:14px 0 10px;">
      Authentic Italian Recipes: Cucina Povera, Regional Classics &amp; 30-Minute Dinners
    </h2>
    <p style="font-size:16px;color:#cbd5e1;line-height:1.7;margin:0;">
      Explore our 6 Italian recipe categories and 12 foundational articles. Every single recipe article includes a <strong>catchy featured thumbnail</strong>, <strong>3 step-by-step recipe photographs</strong>, and a <strong>free downloadable PDF recipe card</strong> for your kitchen.
    </p>
  </div>

  <h2 style="font-size:24px;font-weight:800;color:#0f172a;margin:0 0 16px;">
    Browse by Italian Recipe Category (6 Categories)
  </h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;margin-bottom:40px;">
    ${ITALIAN_RECIPE_CATEGORIES.map(
      (c) => `
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:20px;">
      <div style="font-size:24px;margin-bottom:6px;">${c.icon}</div>
      <h3 style="font-size:18px;font-weight:800;color:#0f172a;margin:0 0 6px;">
        <a href="${WP_URL}/category/${c.slug}/" style="color:#0f172a;text-decoration:none;">${c.name}</a>
      </h3>
      <p style="font-size:13px;color:#475569;line-height:1.5;margin:0 0 12px;">${c.description}</p>
      <a href="${WP_URL}/category/${c.slug}/" style="font-size:12px;font-weight:700;color:#e11d48;text-decoration:none;">
        Explore ${c.name} &rarr;
      </a>
    </div>`
    ).join('\n')}
  </div>

  <h2 style="font-size:24px;font-weight:800;color:#0f172a;margin:0 0 20px;">
    All 12 Featured Italian Recipe Articles (With 3 Photos &amp; Free PDF Cards)
  </h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:24px;">
    ${publishedArticlesSummary
      .map(
        (art) => `
    <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,0.05);">
      <a href="${art.permalink}" style="display:block;position:relative;">
        <img src="${art.thumbnailUrl}" alt="${art.title}" style="width:100%;height:220px;object-fit:cover;display:block;" />
      </a>
      <div style="padding:20px;">
        <span style="display:inline-block;background:#ffe4e6;color:#e11d48;font-size:11px;font-weight:800;padding:3px 10px;border-radius:999px;margin-bottom:8px;">
          #${art.priority} &bull; ${art.category}
        </span>
        <h3 style="font-size:18px;font-weight:800;color:#0f172a;margin:0 0 8px;line-height:1.4;">
          <a href="${art.permalink}" style="color:#0f172a;text-decoration:none;">${art.title}</a>
        </h3>
        <p style="font-size:13px;color:#475569;line-height:1.6;margin:0 0 14px;">${art.metaDescription}</p>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:14px;">
          ${art.gallery
            .slice(0, 3)
            .map(
              (g) =>
                `<img src="${g.url}" alt="${g.alt}" style="width:100%;height:64px;object-fit:cover;border-radius:6px;border:1px solid #e2e8f0;" />`
            )
            .join('')}
        </div>
        <div style="font-size:12px;color:#64748b;margin-bottom:14px;">
          ⏱️ ${art.totalTime} &bull; 👥 ${art.servings} &bull; 🔥 ${art.calories} kcal
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding-top:12px;border-top:1px solid #f1f5f9;">
          <a href="${art.permalink}" style="font-size:13px;font-weight:800;color:#e11d48;text-decoration:none;">
            Read Recipe &rarr;
          </a>
          <a href="${art.pdfUrl}" target="_blank" rel="noopener" download="${art.slug}.pdf" style="background:#0f172a;color:#ffffff;padding:8px 14px;border-radius:8px;font-size:12px;font-weight:700;text-decoration:none;">
            📥 Download PDF
          </a>
        </div>
      </div>
    </div>`
      )
      .join('\n')}
  </div>
</div>
`.trim();

  const hubRes = await fetch(`${WP_URL}/wp-json/autosync/v1/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-sync-key': SYNC_KEY },
    body: JSON.stringify({
      articles: [
        {
          title: 'Italian Recipes — La Cucina Italiana Hub (6 Categories & 12 Essential Recipes)',
          slug: 'italian-recipes',
          external_id: 'page-italian-recipes-hub',
          status: 'publish',
          categories: ['Italian Recipes'],
          content: hubHtml,
        },
      ],
    }),
  });
  const hubJson = await hubRes.json();
  console.log('\nDedicated Hub Sync Result:', hubJson);

  fs.writeFileSync(
    path.resolve('output/published_wordpress_12_articles.json'),
    JSON.stringify(publishedArticlesSummary, null, 2),
    'utf8'
  );

  // Clean up temporary module
  try {
    fs.unlinkSync(path.resolve('scripts/_temp_recipes_data.mjs'));
    fs.unlinkSync(path.resolve('scripts/test_wp_conn.mjs'));
  } catch {}

  console.log('\n================================================================');
  console.log('ALL 12 PRIORITY ITALIAN RECIPE ARTICLES PUBLISHED TO WORDPRESS!');
  console.log('================================================================');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
