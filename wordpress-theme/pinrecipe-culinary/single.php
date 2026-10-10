<?php get_header(); ?>

<?php if (have_posts()) : while (have_posts()) : the_post(); 
  $post_id = get_the_ID();
  $prep = get_post_meta($post_id, 'pinrecipe_prep_time', true) ?: '15 mins';
  $cook = get_post_meta($post_id, 'pinrecipe_cook_time', true) ?: '20 mins';
  $total = get_post_meta($post_id, 'pinrecipe_total_time', true) ?: '35 mins';
  $servings = get_post_meta($post_id, 'pinrecipe_servings', true) ?: '4 servings';
  $cal = get_post_meta($post_id, 'pinrecipe_calories', true) ?: '450';
  $themes = get_the_terms($post_id, 'recipe_theme');
  $theme_name = !empty($themes) ? $themes[0]->name : 'Specialty Recipe';
?>

<main class="container">
  <article class="article-header">
    <span class="article-category-badge"><?php echo esc_html($theme_name); ?></span>
    <h1 class="article-title"><?php the_title(); ?></h1>
    <p class="article-lead">
      <?php echo wp_strip_all_tags(get_the_excerpt()); ?>
    </p>

    <div class="article-author-bar">
      <span>By <strong><?php the_author(); ?></strong></span>
      <span>&bull;</span>
      <span>Published <?php echo get_the_date('M j, Y'); ?></span>
      <span>&bull;</span>
      <span>⏱️ <?php echo esc_html($total); ?> Total</span>
    </div>

    <!-- Quick Jump & PDF Actions -->
    <div class="jump-nav">
      <a href="#recipe-card" class="btn btn-primary">
        👇 Jump to Recipe Card
      </a>
      <a href="<?php the_permalink(); ?>?print_recipe=1" target="_blank" class="btn btn-outline">
        📥 Download Recipe (PDF)
      </a>
      <button onclick="window.print()" class="btn btn-outline">
        🖨️ Print Recipe
      </button>
    </div>
  </article>

  <!-- Hero Image -->
  <?php if (has_post_thumbnail()) : ?>
    <div class="article-hero-media">
      <?php the_post_thumbnail('recipe-hero-large'); ?>
    </div>
  <?php endif; ?>

  <!-- Downloadable Recipe File Callout -->
  <div class="recipe-download-banner">
    <div class="recipe-download-info">
      <h4>📄 Take this Recipe to the Kitchen</h4>
      <p>Download our formatted 1-page printable card or PDF guide with full ingredient measurements and step timers.</p>
    </div>
    <div style="display: flex; gap: 10px;">
      <a href="<?php the_permalink(); ?>?print_recipe=1" target="_blank" class="btn" style="background: white; color: #1e1b4b !important; font-weight: 700;">
        📥 Download PDF Card
      </a>
    </div>
  </div>

  <!-- Long-Form Article Narrative -->
  <div class="article-content">
    <?php the_content(); ?>
  </div>

  <!-- Embedded Structured PinRecipe Card -->
  <section id="recipe-card" class="pinrecipe-card">
    <div class="card-top">
      <div class="card-title-group">
        <span class="article-category-badge" style="font-size: 11px; padding: 3px 10px;"><?php echo esc_html($theme_name); ?></span>
        <h2><?php the_title(); ?></h2>
        <p><?php echo wp_strip_all_tags(get_the_excerpt()); ?></p>
      </div>

      <div class="card-actions">
        <button onclick="window.print()" class="btn btn-primary" style="padding: 8px 16px; font-size: 13px;">
          🖨️ Print Card
        </button>
        <a href="<?php the_permalink(); ?>?print_recipe=1" target="_blank" class="btn btn-outline" style="padding: 8px 16px; font-size: 13px;">
          📥 PDF
        </a>
      </div>
    </div>

    <!-- Quick Facts -->
    <div class="recipe-facts-ribbon">
      <div class="fact-item">
        <div class="fact-label">Prep Time</div>
        <div class="fact-val"><?php echo esc_html($prep); ?></div>
      </div>
      <div class="fact-item">
        <div class="fact-label">Cook Time</div>
        <div class="fact-val"><?php echo esc_html($cook); ?></div>
      </div>
      <div class="fact-item">
        <div class="fact-label">Total Time</div>
        <div class="fact-val"><?php echo esc_html($total); ?></div>
      </div>
      <div class="fact-item">
        <div class="fact-label">Servings</div>
        <div class="fact-val"><?php echo esc_html($servings); ?></div>
      </div>
    </div>

    <!-- Interactive Checklist Script -->
    <script>
      function toggleIngredient(checkbox) {
        const row = checkbox.closest('.ingredient-row');
        if (row) {
          row.classList.toggle('checked', checkbox.checked);
        }
      }
    </script>
  </section>

</main>

<?php endwhile; endif; ?>

<?php get_footer(); ?>
