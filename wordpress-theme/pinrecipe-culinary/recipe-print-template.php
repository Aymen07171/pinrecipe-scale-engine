<?php
/**
 * Standalone Printable & Downloadable PDF Recipe Template
 */
if (!defined('ABSPATH')) exit;

$post_id = get_the_ID();
$title = get_the_title($post_id);
$excerpt = wp_strip_all_tags(get_the_excerpt($post_id));
$thumb_url = get_the_post_thumbnail_url($post_id, 'full');
$prep = get_post_meta($post_id, 'pinrecipe_prep_time', true) ?: '15 mins';
$cook = get_post_meta($post_id, 'pinrecipe_cook_time', true) ?: '20 mins';
$total = get_post_meta($post_id, 'pinrecipe_total_time', true) ?: '35 mins';
$servings = get_post_meta($post_id, 'pinrecipe_servings', true) ?: '4 servings';
$cal = get_post_meta($post_id, 'pinrecipe_calories', true) ?: '450';
$themes = get_the_terms($post_id, 'recipe_theme');
$theme_name = !empty($themes) ? $themes[0]->name : 'Specialty Recipe';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title><?php echo esc_html($title); ?> - Printable Recipe Card</title>
  <style>
    @page { margin: 12mm; size: A4 portrait; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #0f172a;
      line-height: 1.5;
      background: white;
      margin: 0;
      padding: 24px;
    }
    .print-container {
      max-width: 800px;
      margin: 0 auto;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      padding: 30px;
    }
    .badge {
      display: inline-block;
      background: #ffe4e6;
      color: #e11d48;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 3px 10px;
      border-radius: 999px;
      margin-bottom: 8px;
    }
    h1 {
      margin: 0 0 8px;
      font-size: 26px;
      color: #0f172a;
    }
    .meta-summary {
      color: #475569;
      font-size: 14px;
      margin-bottom: 18px;
    }
    .facts-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      background: #f1f5f9;
      padding: 12px;
      border-radius: 8px;
      text-align: center;
      margin-bottom: 24px;
    }
    .facts-grid div {
      font-size: 11px;
      color: #64748b;
      text-transform: uppercase;
      font-weight: 600;
    }
    .facts-grid strong {
      display: block;
      font-size: 16px;
      color: #0f172a;
      margin-top: 2px;
    }
    .recipe-body {
      font-size: 14px;
      color: #1e293b;
    }
    .recipe-body h3, .recipe-body h4 {
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 4px;
      margin-top: 20px;
      color: #0f172a;
    }
    ul, ol {
      padding-left: 20px;
      margin: 10px 0;
    }
    li {
      margin-bottom: 6px;
    }
    .no-print-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid #e2e8f0;
    }
    .btn {
      background: #e11d48;
      color: white;
      border: none;
      padding: 8px 18px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      font-size: 14px;
    }
    .btn-secondary {
      background: #0f172a;
    }
    @media print {
      .no-print-bar { display: none !important; }
      .print-container { border: none !important; padding: 0 !important; }
    }
  </style>
</head>
<body>
  <div class="print-container">
    <div class="no-print-bar">
      <div>
        <a href="<?php the_permalink(); ?>" style="color: #64748b; font-size: 13px; text-decoration: none;">&larr; Back to full article</a>
      </div>
      <div>
        <button onclick="window.print()" class="btn">🖨️ Save as PDF / Print Now</button>
      </div>
    </div>

    <span class="badge"><?php echo esc_html($theme_name); ?></span>
    <h1><?php echo esc_html($title); ?></h1>
    <div class="meta-summary"><?php echo esc_html($excerpt); ?></div>

    <div class="facts-grid">
      <div>Prep Time<strong><?php echo esc_html($prep); ?></strong></div>
      <div>Cook Time<strong><?php echo esc_html($cook); ?></strong></div>
      <div>Total<strong><?php echo esc_html($total); ?></strong></div>
      <div>Yield<strong><?php echo esc_html($servings); ?></strong></div>
    </div>

    <div class="recipe-body">
      <?php the_content(); ?>
    </div>

    <div style="margin-top: 32px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;">
      Source: <?php echo esc_url(get_permalink()); ?> &bull; Printed via PinRecipe Culinary Engine
    </div>
  </div>
</body>
</html>
