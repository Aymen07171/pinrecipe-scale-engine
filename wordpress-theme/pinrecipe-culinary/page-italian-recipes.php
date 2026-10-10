<?php
/**
 * Template Name: Dedicated Italian Recipes Hub
 * Template Post Type: page
 * Description: Dedicated WordPress page for Italian Recipes with category filters, catchy thumbnails, 2-3 recipe gallery photos, and downloadable PDF cards.
 */

get_header(); ?>

<main class="container" style="padding-top: 28px; padding-bottom: 60px;">
  <!-- Italian Tricolore Hero Banner -->
  <section style="background: linear-gradient(135deg, #0f172a, #1e1b4b); color: #ffffff; border-radius: 20px; padding: 44px 36px; margin-bottom: 36px; border-top: 5px solid #16a34a; border-bottom: 5px solid #dc2626; box-shadow: 0 12px 30px rgba(15, 23, 42, 0.15);">
    <span style="display: inline-block; background: rgba(22, 163, 74, 0.25); color: #86efac; border: 1px solid rgba(134, 239, 172, 0.4); padding: 5px 14px; border-radius: 999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
      🇮🇹 La Cucina Italiana &bull; Official Recipe Hub
    </span>
    <h1 style="font-size: 36px; font-weight: 800; margin: 14px 0 10px; color: #ffffff; line-height: 1.2;">
      <?php the_title(); ?>
    </h1>
    <p style="font-size: 16px; color: #cbd5e1; max-width: 760px; line-height: 1.6; margin: 0;">
      Explore our authentic regional Italian recipes—from Roman pasta emulsions and 72-hour Neapolitan pizza dough to Nonna’s Sunday ragù and Treviso Tiramisu. Every recipe includes a catchy thumbnail, 2–3 step-by-step culinary photos, and a free downloadable PDF recipe card.
    </p>
  </section>

  <!-- Page Editor Content (if custom blocks or categories are inserted) -->
  <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
    <?php if (trim(get_the_content()) !== '') : ?>
      <div class="italian-page-content" style="margin-bottom: 40px;">
        <?php the_content(); ?>
      </div>
    <?php endif; ?>
  <?php endwhile; endif; ?>

  <!-- Dynamic Query of Italian Recipe Articles (rcpmst_recipe_comp & post) -->
  <?php
  $italian_query = new WP_Query(array(
    'post_type'      => array('rcpmst_recipe_comp', 'post'),
    'posts_per_page' => 24,
    'post_status'    => 'publish',
  ));
  ?>

  <?php if ($italian_query->have_posts()) : ?>
    <h2 style="font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 20px;">
      Latest Italian Recipe Articles
    </h2>
    <div class="recipes-grid">
      <?php while ($italian_query->have_posts()) : $italian_query->the_post();
        $post_id  = get_the_ID();
        $cook     = get_post_meta($post_id, 'pinrecipe_cook_time', true) ?: '20 mins';
        $servings = get_post_meta($post_id, 'pinrecipe_servings', true) ?: '4 servings';
        $cal      = get_post_meta($post_id, 'pinrecipe_calories', true) ?: '520';
      ?>
        <article class="recipe-card-preview">
          <a href="<?php the_permalink(); ?>" class="recipe-thumb-wrap">
            <?php if (has_post_thumbnail()) : ?>
              <?php the_post_thumbnail('recipe-card-thumb'); ?>
            <?php endif; ?>
            <span class="recipe-badge-tag">🇮🇹 Italian Recipe &bull; 3 Photos + PDF</span>
          </a>

          <div class="recipe-card-body">
            <div class="recipe-meta-row">
              <span class="recipe-meta-item">⏱️ <?php echo esc_html($cook); ?></span>
              <span class="recipe-meta-item">👥 <?php echo esc_html($servings); ?></span>
              <span class="recipe-meta-item">🔥 <?php echo esc_html($cal); ?> kcal</span>
            </div>

            <h3 class="recipe-card-title">
              <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
            </h3>

            <div class="recipe-card-excerpt">
              <?php echo wp_strip_all_tags(get_the_excerpt()); ?>
            </div>

            <div class="recipe-card-footer">
              <a href="<?php the_permalink(); ?>" style="font-weight: 700; color: var(--primary);">
                Read Recipe &amp; 3 Photos &rarr;
              </a>
              <a href="<?php the_permalink(); ?>?print_recipe=1" target="_blank" style="background: #0f172a; color: #ffffff; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 700; text-decoration: none;">
                📥 Download PDF
              </a>
            </div>
          </div>
        </article>
      <?php endwhile; wp_reset_postdata(); ?>
    </div>
  <?php endif; ?>
</main>

<?php get_footer(); ?>
