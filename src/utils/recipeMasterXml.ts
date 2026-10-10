import { RecipeItem } from '../types/pipeline';

export const generateRecipeMasterWxrXml = (recipes: RecipeItem[]): string => {
  const xmlItems = recipes.map((r, idx) => {
    const pubDate = new Date(r.createdAt || Date.now()).toUTCString();
    const isoDate = new Date(r.createdAt || Date.now()).toISOString().replace('T', ' ').slice(0, 19);
    const servingsCount = parseInt(r.servings) || 4;
    
    const instructionsText = (r.instructions || [])
      .map((s, i) => `${s.step || i + 1}. ${s.title ? s.title + ': ' : ''}${s.text || ''}`)
      .join('\n\n');

    const ingredientsListing = (r.ingredients || [])
      .map((i) => typeof i === 'string' ? i : `${i.amount || ''} ${i.item || ''}${i.notes ? ` (${i.notes})` : ''}`.trim())
      .join(', ');

    const pdfUrl = r.downloadablePdfUrl || `https://foodsprepared.wasmer.app/?post_type=rcpmst_recipe_comp&p=${3000 + idx}&print_recipe=1`;
    const galleryHtml = r.galleryImages && r.galleryImages.length > 0 ? `
<div class="pinrecipe-gallery" style="margin:24px 0;">
  <h4 style="color:#0f172a; margin-bottom:12px;">📸 Step-by-Step Visual Recipe Gallery (${r.galleryImages.length} Photos)</h4>
  <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:14px;">
    ${r.galleryImages.map((img) => `
      <figure style="margin:0; background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; overflow:hidden;">
        <img src="${img.url}" alt="${img.alt || r.title}" style="width:100%; height:180px; object-fit:cover; display:block;" />
        <figcaption style="padding:10px; font-size:12px; color:#475569; line-height:1.4;">${img.caption}</figcaption>
      </figure>
    `).join('')}
  </div>
</div>` : '';

    const formattedContent = `
<p><strong>${r.metaDescription || `An extraordinary culinary guide for ${r.title}`}</strong></p>
${(r.thumbnailUrl || r.imageUrl) ? `<p><img src="${r.thumbnailUrl || r.imageUrl}" alt="${r.title} - Catchy Recipe Thumbnail" style="max-width:100%; height:auto; border-radius:12px; margin:16px 0;" /></p>` : ''}
<div class="pinrecipe-pdf-banner" style="background:linear-gradient(135deg, #0f172a, #1e1b4b); color:#ffffff; padding:18px 24px; border-radius:12px; margin:20px 0; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
  <div>
    <strong style="font-size:15px; display:block;">📄 Free Printable &amp; Downloadable Recipe Card (PDF)</strong>
    <span style="font-size:12px; color:#cbd5e1;">Save this recipe with full measurements, 3 step photos, and chef timers for your kitchen.</span>
  </div>
  <a href="${pdfUrl}" target="_blank" rel="noopener" style="background:#e11d48; color:#ffffff; padding:10px 20px; border-radius:8px; text-decoration:none; font-weight:700; font-size:13px;">📥 Download Recipe PDF</a>
</div>
${galleryHtml}
<div class="rcpmst-recipe-card" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:24px; margin:24px 0;">
  <h3 style="margin-top:0; color:#0f172a;">Quick Recipe Facts</h3>
  <ul>
    <li><strong>Category:</strong> ${r.italianCategory || r.niche || 'Italian Recipes'}</li>
    <li><strong>Prep Time:</strong> ${r.prepTime || '15 mins'}</li>
    <li><strong>Cook Time:</strong> ${r.cookTime || '20 mins'}</li>
    <li><strong>Yield:</strong> ${r.servings || '4 servings'}</li>
    <li><strong>Calories:</strong> ${r.calories || 450} kcal</li>
    <li><strong>Dietary:</strong> ${r.dietary || 'Standard'}</li>
  </ul>
  <h4>Ingredients</h4>
  <ul>
    ${(r.ingredients || []).map((i) => `<li>${typeof i === 'string' ? i : `<strong>${i.amount || ''}</strong> ${i.item || ''} ${i.notes ? `(${i.notes})` : ''}`}</li>`).join('\n    ')}
  </ul>
  <h4>Step-by-Step Instructions</h4>
  <ol>
    ${(r.instructions || []).map((s) => `<li><strong>${s.title || ''}:</strong> ${s.text || ''}</li>`).join('\n    ')}
  </ol>
  ${r.chefTips && r.chefTips.length > 0 ? `
  <h4>Chef's Pro Tips</h4>
  <ul>
    ${r.chefTips.map((t) => `<li>${t}</li>`).join('\n    ')}
  </ul>
  ` : ''}
  <p style="margin-top:18px;">
    <a href="${pdfUrl}" target="_blank" rel="noopener" style="display:inline-block; background:#0f172a; color:#ffffff; padding:10px 18px; border-radius:8px; text-decoration:none; font-weight:600; font-size:13px;">🖨️ Download / Print Recipe PDF</a>
  </p>
</div>
    `.trim();

    const nicheSlug = (r.niche || 'quick-dinners').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const dietarySlug = (r.dietary || 'standard').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const postId = 3000 + idx;

    return `	<item>
		<title><![CDATA[${r.title}]]></title>
		<link>https://foodsprepared.wasmer.app/?post_type=rcpmst_recipe_comp&amp;p=${postId}</link>
		<pubDate>${pubDate}</pubDate>
		<dc:creator><![CDATA[admin]]></dc:creator>
		<guid isPermaLink="false">https://foodsprepared.wasmer.app/?post_type=rcpmst_recipe_comp&amp;p=${postId}</guid>
		<description></description>
		<content:encoded><![CDATA[${formattedContent}]]></content:encoded>
		<excerpt:encoded><![CDATA[${r.metaDescription || r.title}]]></excerpt:encoded>
		<wp:post_id>${postId}</wp:post_id>
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
		<category domain="category" nicename="${nicheSlug}"><![CDATA[${r.niche || 'Quick & Easy Dinners'}]]></category>
		<category domain="recipe_theme" nicename="${nicheSlug}"><![CDATA[${r.themeCategory || r.niche || 'Quick & Easy Dinners'}]]></category>
		<category domain="rcpmst_recipe_type" nicename="${nicheSlug}"><![CDATA[${r.niche || 'Quick & Easy Dinners'}]]></category>
		<category domain="rcpmst_selection" nicename="chef-curated"><![CDATA[Chef Curated]]></category>
		<category domain="rcpmst_dietary_notes" nicename="${dietarySlug}"><![CDATA[${r.dietary || 'Standard'}]]></category>
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

  return `<?xml version="1.0" encoding="UTF-8" ?>
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
};

/**
 * Downloads a ready-to-import WordPress WXR XML file for Recipe Master
 */
export const downloadRecipeMasterXmlFile = (recipes: RecipeItem[]): void => {
  const xml = generateRecipeMasterWxrXml(recipes);
  const blob = new Blob([xml], { type: 'application/xml;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `recipe_master_rcpmst_comp_export_${Date.now()}.xml`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/**
 * Generates an easy-to-paste text block for creating a recipe component manually in WP Admin
 */
export const formatRecipeForWpAdminCopy = (recipe: RecipeItem): string => {
  const ingredientsListing = (recipe.ingredients || [])
    .map((i) => typeof i === 'string' ? i : `${i.amount || ''} ${i.item || ''}${i.notes ? ` (${i.notes})` : ''}`.trim())
    .join('\n');

  const instructionsText = (recipe.instructions || [])
    .map((s, idx) => `${s.step || idx + 1}. ${s.title ? s.title + ': ' : ''}${s.text || ''}`)
    .join('\n\n');

  return `=== RECIPE COMPONENT: ${recipe.title} ===
Post Type: rcpmst_recipe_comp
Category (Recipe Type): ${recipe.niche}
Selection: Chef Curated
Dietary Notes: ${recipe.dietary}
Servings: ${recipe.servings}
Prep Time: ${recipe.prepTime} | Cook Time: ${recipe.cookTime} | Total: ${recipe.totalTime}
Calories: ${recipe.calories} kcal

--- INGREDIENTS ---
${ingredientsListing}

--- INSTRUCTIONS ---
${instructionsText}

--- CHEF'S TIPS ---
${(recipe.chefTips || []).join('\n')}

--- META DESCRIPTION ---
${recipe.metaDescription}
`;
};
