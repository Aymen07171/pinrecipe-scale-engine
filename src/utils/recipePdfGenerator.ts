import { RecipeItem } from '../types/pipeline';

export const generateRecipePrintHtml = (recipe: RecipeItem): string => {
  const ingredientsList = (recipe.ingredients || [])
    .map((i) => {
      if (typeof i === 'string') return `<li>${i}</li>`;
      return `<li><strong>${i.amount || ''}</strong> ${i.item || ''} ${i.notes ? `<em>(${i.notes})</em>` : ''}</li>`;
    })
    .join('');

  const instructionsList = (recipe.instructions || [])
    .map((s) => {
      if (typeof s === 'string') return `<li>${s}</li>`;
      return `<li><strong>${s.title ? `${s.title}: ` : ''}</strong>${s.text || ''}${s.timerMinutes ? ` <span class="timer">⏱️ ${s.timerMinutes} mins</span>` : ''}</li>`;
    })
    .join('');

  const tipsList = (recipe.chefTips || [])
    .map((t) => `<li>${t}</li>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${recipe.title} - Recipe Master & PDF</title>
  <style>
    @page { margin: 15mm 15mm 20mm 15mm; size: A4 portrait; }
    *, *:before, *:after { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      max-width: 860px;
      margin: 0 auto;
      padding: 30px 24px;
      color: #1e293b;
      line-height: 1.6;
      background: #f8fafc;
    }
    .recipe-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 36px 40px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.04);
    }
    .header-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #fdf2f8;
      color: #db2777;
      padding: 5px 14px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 12px;
    }
    h1 {
      font-size: 28px;
      color: #0f172a;
      margin: 0 0 10px 0;
      line-height: 1.25;
      font-weight: 800;
    }
    .summary {
      font-size: 15px;
      color: #64748b;
      margin-bottom: 24px;
      line-height: 1.6;
    }
    .hero-image {
      width: 100%;
      max-height: 420px;
      object-fit: cover;
      border-radius: 14px;
      margin-bottom: 24px;
      display: block;
      border: 1px solid #f1f5f9;
    }
    .stats-ribbon {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      background: #f1f5f9;
      padding: 18px 20px;
      border-radius: 12px;
      margin-bottom: 24px;
      text-align: center;
    }
    .stat-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
    }
    .stat-value {
      font-size: 17px;
      font-weight: 700;
      color: #0f172a;
      margin-top: 4px;
    }
    .macros-ribbon {
      display: flex;
      justify-content: space-around;
      background: #fdf4ff;
      border: 1px solid #f5d0fe;
      padding: 12px 16px;
      border-radius: 10px;
      margin-bottom: 28px;
      font-size: 13px;
      color: #86198f;
    }
    .macros-ribbon span strong {
      color: #701a75;
    }
    h2 {
      font-size: 20px;
      color: #0f172a;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 8px;
      margin: 32px 0 16px 0;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    ul, ol {
      padding-left: 24px;
      margin: 0 0 24px 0;
    }
    li {
      margin-bottom: 12px;
      font-size: 15px;
      color: #334155;
      line-height: 1.6;
    }
    .timer {
      display: inline-block;
      background: #fef3c7;
      color: #b45309;
      font-size: 11px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 6px;
      margin-left: 6px;
    }
    .tips-box {
      background: #ecfdf5;
      border-left: 4px solid #10b981;
      padding: 16px 20px;
      border-radius: 0 10px 10px 0;
      margin: 28px 0;
    }
    .tips-box h3 {
      margin: 0 0 10px 0;
      font-size: 15px;
      color: #065f46;
      font-weight: 700;
    }
    .tips-box ul {
      margin: 0;
      padding-left: 20px;
    }
    .tips-box li {
      margin-bottom: 6px;
      color: #047857;
      font-size: 14px;
    }
    .action-bar {
      margin-top: 36px;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      border: none;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(0,0,0,0.08);
      transition: all 0.2s;
    }
    .btn-print {
      background: #0f172a;
      color: #ffffff;
    }
    .btn-wp {
      background: linear-gradient(135deg, #db2777, #6366f1);
      color: #ffffff;
    }
    .footer-note {
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
      margin-top: 24px;
    }
    @media print {
      body {
        background: #ffffff;
        padding: 0;
        margin: 0;
      }
      .recipe-card {
        border: none;
        box-shadow: none;
        padding: 0;
      }
      .action-bar {
        display: none !important;
      }
      .hero-image {
        max-height: 300px;
      }
      .gallery-grid img {
        max-height: 150px;
      }
    }
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      margin: 20px 0 28px 0;
    }
    .gallery-item {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      overflow: hidden;
    }
    .gallery-item img {
      width: 100%;
      height: 160px;
      object-fit: cover;
      display: block;
    }
    .gallery-caption {
      padding: 8px 10px;
      font-size: 11px;
      color: #475569;
      line-height: 1.4;
    }
  </style>
</head>
<body>
  <div class="recipe-card">
    <div class="header-badge">
      ${recipe.italianCategory || recipe.niche || 'Gourmet Recipe'} · ${recipe.dietary || 'Chef Selection'}
    </div>
    <h1>${recipe.title}</h1>
    <div class="summary">
      ${recipe.metaDescription || `An exquisite step-by-step culinary guide for ${recipe.title}.`}
    </div>

    ${(recipe.thumbnailUrl || recipe.imageUrl) ? `<img src="${recipe.thumbnailUrl || recipe.imageUrl}" alt="${recipe.title}" class="hero-image" />` : ''}

    ${recipe.galleryImages && recipe.galleryImages.length > 0 ? `
      <h2>📸 Step-by-Step Visual Gallery (${recipe.galleryImages.length} Recipe Photos)</h2>
      <div class="gallery-grid">
        ${recipe.galleryImages.map((img) => `
          <div class="gallery-item">
            <img src="${img.url}" alt="${img.alt || recipe.title}" />
            <div class="gallery-caption">${img.caption}</div>
          </div>
        `).join('')}
      </div>
    ` : ''}

    <div class="stats-ribbon">
      <div>
        <div class="stat-label">Prep Time</div>
        <div class="stat-value">${recipe.prepTime || '15 mins'}</div>
      </div>
      <div>
        <div class="stat-label">Cook Time</div>
        <div class="stat-value">${recipe.cookTime || '20 mins'}</div>
      </div>
      <div>
        <div class="stat-label">Yield</div>
        <div class="stat-value">${recipe.servings || '4 servings'}</div>
      </div>
      <div>
        <div class="stat-label">Calories</div>
        <div class="stat-value">${recipe.calories || 450} kcal</div>
      </div>
    </div>

    ${recipe.macros ? `
      <div class="macros-ribbon">
        <span>Protein: <strong>${recipe.macros.protein}</strong></span>
        <span>Carbs: <strong>${recipe.macros.carbs}</strong></span>
        <span>Fat: <strong>${recipe.macros.fat}</strong></span>
        ${recipe.macros.fiber ? `<span>Fiber: <strong>${recipe.macros.fiber}</strong></span>` : ''}
      </div>
    ` : ''}

    <h2>🥘 Ingredients</h2>
    <ul>
      ${ingredientsList}
    </ul>

    <h2>👨‍🍳 Step-by-Step Instructions</h2>
    <ol>
      ${instructionsList}
    </ol>

    ${tipsList ? `
      <div class="tips-box">
        <h3>Chef's Pro Tips</h3>
        <ul>${tipsList}</ul>
      </div>
    ` : ''}

    <div class="action-bar">
      <button onclick="window.print()" class="btn btn-print">
        🖨️ Print or Save as PDF
      </button>
      <a href="https://foodsprepared.wasmer.app/wp-admin/edit.php?post_type=rcpmst_recipe_comp" target="_blank" class="btn btn-wp">
        🌐 WP Recipe Section (rcpmst_recipe_comp)
      </a>
    </div>

    <div class="footer-note">
      PinRecipe Scale Engine (Tool AYMAN) · Recipe Master Section Component
    </div>
  </div>
</body>
</html>`;
};

/**
 * Triggers PDF printing safely within iframe without being blocked by browser popup blockers
 */
export const triggerRecipePrintViaIframe = (recipe: RecipeItem): void => {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.zIndex = '-999';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (doc) {
    doc.open();
    doc.write(generateRecipePrintHtml(recipe));
    doc.close();

    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        console.warn('Iframe print failed, falling back to direct download:', err);
        downloadRecipeHtmlFile(recipe);
      } finally {
        setTimeout(() => {
          if (iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
          }
        }, 2000);
      }
    }, 400);
  }
};

/**
 * Downloads a standalone HTML document which opens and prints immediately in any browser
 */
export const downloadRecipeHtmlFile = (recipe: RecipeItem): void => {
  const html = generateRecipePrintHtml(recipe);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${recipe.slug || 'recipe'}-printable.html`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
