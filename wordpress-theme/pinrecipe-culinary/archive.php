<?php get_header(); ?>

<main class="container">
  <section class="hero-section" style="padding-bottom: 16px;">
    <span class="hero-badge">Curated Collection</span>
    <h1 class="hero-title"><?php the_archive_title(); ?></h1>
    <div class="hero-desc">
      <?php the_archive_description(); ?>
    </div>
  </section>

  <div class="recipes-grid">
    <?php if (have_posts()) : while (have_posts()) : the_post(); 
      $cook = get_post_meta(get_the_ID(), 'pinrecipe_cook_time', true) ?: '20 mins';
      $servings = get_post_meta(get_the_ID(), 'pinrecipe_servings', true) ?: '4 servings';
      $cal = get_post_meta(get_the_ID(), 'pinrecipe_calories', true) ?: '450';
      $terms = get_the_terms(get_the_ID(), 'recipe_theme');
      $theme_label = !empty($terms) ? $terms[0]->name : 'Recipe';
    ?>
      <article class="recipe-card-preview">
        <a href="<?php the_permalink(); ?>" class="recipe-thumb-wrap">
          <?php if (has_post_thumbnail()) : ?>
            <?php the_post_thumbnail('recipe-card-thumb'); ?>
          <?php else : ?>
            <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=450&fit=crop" alt="<?php the_title(); ?>" />
          <?php endif; ?>
          <span class="recipe-badge-tag"><?php echo esc_html($theme_label); ?></span>
        </a>

        <div class="recipe-card-body">
          <div class="recipe-meta-row">
            <span class="recipe-meta-item">⏱️ <?php echo esc_html($cook); ?></span>
            <span class="recipe-meta-item">👥 <?php echo esc_html($servings); ?></span>
            <span class="recipe-meta-item">🔥 <?php echo esc_html($cal); ?> kcal</span>
          </div>

          <h2 class="recipe-card-title">
            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
          </h2>

          <div class="recipe-card-excerpt">
            <?php echo wp_strip_all_tags(get_the_excerpt()); ?>
          </div>

          <div class="recipe-card-footer">
            <a href="<?php the_permalink(); ?>" style="font-weight: 700; color: var(--primary);">
              Read Recipe &rarr;
            </a>
            <a href="<?php the_permalink(); ?>?print_recipe=1" target="_blank" style="color: var(--text-muted); font-size: 12px;">
              📥 PDF Card
            </a>
          </div>
        </div>
      </article>
    <?php endwhile; else : ?>
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
        <h3>No recipes found in this theme yet</h3>
        <p style="color: #64748b;">Publish articles under this category from your PinRecipe engine.</p>
      </div>
    <?php endif; ?>
  </div>

  <div style="text-align: center; margin: 40px 0;">
    <?php the_posts_pagination(array(
      'mid_size'  => 2,
      'prev_text' => __('&larr; Previous', 'pinrecipe-culinary'),
      'next_text' => __('Next &rarr;', 'pinrecipe-culinary'),
    )); ?>
  </div>
</main>

<?php get_footer(); ?>
