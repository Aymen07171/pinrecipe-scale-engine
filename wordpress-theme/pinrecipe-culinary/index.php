<?php get_header(); ?>

<!-- Quick Category Bar -->
<div class="category-bar" style="background: #ffffff; border-bottom: 1px solid #eadfd5;">
  <div class="container">
    <div class="category-pills">
      <a href="<?php echo esc_url(home_url('/')); ?>" class="category-pill active" style="background: #227755; color: #ffffff;">🇮🇹 All Italian Recipes</a>
      <a href="<?php echo esc_url(home_url('/category/budget-friendly-italian/')); ?>" class="category-pill">💰 Budget-Friendly Italian</a>
      <a href="<?php echo esc_url(home_url('/category/quick-italian-dinners/')); ?>" class="category-pill">⚡ Quick Italian Dinners</a>
      <a href="<?php echo esc_url(home_url('/category/pasta-risotto-gnocchi/')); ?>" class="category-pill">🍝 Pasta, Risotto &amp; Gnocchi</a>
      <a href="<?php echo esc_url(home_url('/category/regional-italian-recipes/')); ?>" class="category-pill">🗺️ Regional Italian</a>
      <a href="<?php echo esc_url(home_url('/category/soups-beans-vegetables/')); ?>" class="category-pill">🥣 Soups, Beans &amp; Veg</a>
      <a href="<?php echo esc_url(home_url('/category/protein-rich-italian-meals/')); ?>" class="category-pill">💪 Protein-Rich Meals</a>
    </div>
  </div>
</div>

<main class="container" style="padding-top: 28px; padding-bottom: 48px;">
  <!-- 1. Introductory Hero Section at the Top -->
  <section class="hero-section" style="background: #ffffff; border: 2px solid #e6d7c8; border-radius: 24px; padding: 40px 32px; margin-bottom: 40px; text-align: left;">
    <span class="hero-badge" style="background: #227755; color: #ffffff; padding: 5px 14px; border-radius: 999px; font-size: 11px; font-weight: 800; text-transform: uppercase;">
      🇮🇹 Benvenuti · Real Italian Flavor, Everyday Cooking
    </span>
    <h1 class="hero-title" style="font-family: Georgia, serif; font-size: 36px; color: #1a202c; margin: 14px 0 12px;">
      Welcome to <?php bloginfo('name'); ?>: Authentic Italian Recipes for Everyday Home Cooks
    </h1>
    <p class="hero-desc" style="font-size: 16px; color: #4a5568; max-width: 780px; margin: 0 0 22px; line-height: 1.7;">
      Discover traditional Italian cooking—from budget-friendly <strong>Cucina Povera</strong> classics and <strong>20-minute weeknight pastas</strong> to regional treasures from Tuscany, Liguria, Sardinia, and Abruzzo. Every article includes step-by-step photos and a <strong>free printable 1-page PDF recipe card</strong>.
    </p>
    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
      <a href="#featured-carousel" style="background: #227755; color: #ffffff; padding: 11px 20px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 14px;">
        Explore Featured Articles Carousel &darr;
      </a>
      <a href="#category-carousels" style="background: #D96B43; color: #ffffff; padding: 11px 20px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 14px;">
        Browse Recipe Category Carousels &darr;
      </a>
    </div>
  </section>

  <!-- 2. Featured Articles Carousel -->
  <section id="featured-carousel" style="margin-bottom: 48px;">
    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 18px;">
      <div>
        <span style="background: #eef7f2; color: #227755; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 800; text-transform: uppercase;">
          🎠 Featured Articles Carousel
        </span>
        <h2 style="font-family: Georgia, serif; font-size: 26px; color: #1a202c; margin: 6px 0 0;">
          Latest Italian Recipe Guides
        </h2>
      </div>
    </div>

    <div style="display: flex; flex-wrap: nowrap; gap: 20px; overflow-x: auto; padding: 6px 2px 18px; scroll-snap-type: x mandatory;">
      <?php if (have_posts()) : while (have_posts()) : the_post(); 
        $cook = get_post_meta(get_the_ID(), 'pinrecipe_cook_time', true) ?: '25 mins';
        $servings = get_post_meta(get_the_ID(), 'pinrecipe_servings', true) ?: '4 servings';
        $cal = get_post_meta(get_the_ID(), 'pinrecipe_calories', true) ?: '420';
        $cats = get_the_category();
        $cat_label = !empty($cats) ? $cats[0]->name : 'Italian Recipe';
      ?>
        <article style="flex: 0 0 310px; min-width: 295px; scroll-snap-align: start; background: #ffffff; border: 1px solid #eadfd5; border-radius: 18px; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <a href="<?php the_permalink(); ?>" style="display: block; position: relative; height: 200px; overflow: hidden; background: #f4ece4;">
              <?php if (has_post_thumbnail()) : ?>
                <?php the_post_thumbnail('recipe-card-thumb', array('style' => 'width:100%;height:100%;object-fit:cover;')); ?>
              <?php else : ?>
                <img src="https://foodsprepared.wasmer.app/wp-content/uploads/2026/10/recipe-6aca848661820.jpeg" alt="<?php the_title(); ?>" style="width:100%;height:100%;object-fit:cover;" />
              <?php endif; ?>
              <span style="position: absolute; top: 12px; left: 12px; background: #227755; color: #ffffff; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700;">
                <?php echo esc_html($cat_label); ?>
              </span>
            </a>

            <div style="padding: 18px;">
              <div style="font-size: 12px; color: #718096; font-weight: 600; margin-bottom: 6px;">
                ⏱️ <?php echo esc_html($cook); ?> &bull; 👥 <?php echo esc_html($servings); ?> &bull; 🔥 <?php echo esc_html($cal); ?> kcal
              </div>
              <h3 style="font-family: Georgia, serif; font-size: 18px; margin: 0 0 8px; line-height: 1.35;">
                <a href="<?php the_permalink(); ?>" style="color: #1a202c; text-decoration: none;"><?php the_title(); ?></a>
              </h3>
              <p style="font-size: 13px; color: #4a5568; margin: 0; line-height: 1.55;">
                <?php echo wp_trim_words(wp_strip_all_tags(get_the_excerpt()), 18); ?>
              </p>
            </div>
          </div>

          <div style="padding: 12px 18px 16px; border-top: 1px solid #f5ebe1; background: #fffaf5; display: flex; align-items: center; justify-content: space-between;">
            <a href="<?php the_permalink(); ?>" style="background: #227755; color: #ffffff; padding: 8px 14px; border-radius: 8px; text-decoration: none; font-size: 12px; font-weight: 700;">
              Read Recipe &rarr;
            </a>
            <a href="<?php the_permalink(); ?>?print_recipe=1" target="_blank" style="color: #D96B43; font-size: 12px; font-weight: 700; text-decoration: none;">
              📥 Free PDF
            </a>
          </div>
        </article>
      <?php endwhile; endif; ?>
    </div>
  </section>

  <!-- 3. Recipe Category Carousels Overview -->
  <section id="category-carousels" style="margin-bottom: 40px;">
    <span style="background: #fdf3ef; color: #D96B43; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 800; text-transform: uppercase;">
      🗂️ Browse by Culinary Category
    </span>
    <h2 style="font-family: Georgia, serif; font-size: 26px; color: #1a202c; margin: 6px 0 16px;">
      Explore Our 6 Italian Recipe Categories
    </h2>
    <div style="display: flex; flex-wrap: nowrap; gap: 18px; overflow-x: auto; padding-bottom: 16px;">
      <div style="flex: 0 0 270px; background: #ffffff; border: 1px solid #eadfd5; border-radius: 18px; padding: 20px;">
        <div style="font-size: 26px; margin-bottom: 8px;">💰</div>
        <h3 style="font-family: Georgia, serif; font-size: 18px; margin: 0 0 6px; color: #1a202c;">Budget-Friendly Italian</h3>
        <p style="font-size: 13px; color: #4a5568; margin: 0 0 12px;">Pasta e ceci, pasta e fagioli, pantry pasta, lentils, white beans &amp; leftover bread dishes.</p>
        <a href="<?php echo esc_url(home_url('/category/budget-friendly-italian/')); ?>" style="color: #227755; font-size: 12px; font-weight: 700; text-decoration: none;">Explore Category &rarr;</a>
      </div>
      <div style="flex: 0 0 270px; background: #ffffff; border: 1px solid #eadfd5; border-radius: 18px; padding: 20px;">
        <div style="font-size: 26px; margin-bottom: 8px;">⚡</div>
        <h3 style="font-family: Georgia, serif; font-size: 18px; margin: 0 0 6px; color: #1a202c;">Quick Italian Dinners</h3>
        <p style="font-size: 13px; color: #4a5568; margin: 0 0 12px;">20–30-minute dinners, simple pan sauces, one-pan dishes, and busy weeknight meals.</p>
        <a href="<?php echo esc_url(home_url('/category/quick-italian-dinners/')); ?>" style="color: #D96B43; font-size: 12px; font-weight: 700; text-decoration: none;">Explore Category &rarr;</a>
      </div>
      <div style="flex: 0 0 270px; background: #ffffff; border: 1px solid #eadfd5; border-radius: 18px; padding: 20px;">
        <div style="font-size: 26px; margin-bottom: 8px;">🍝</div>
        <h3 style="font-family: Georgia, serif; font-size: 18px; margin: 0 0 6px; color: #1a202c;">Pasta, Risotto &amp; Gnocchi</h3>
        <p style="font-size: 13px; color: #4a5568; margin: 0 0 12px;">Pasta shapes and sauces, risotto, homemade gnocchi, baked pasta &amp; regional pairings.</p>
        <a href="<?php echo esc_url(home_url('/category/pasta-risotto-gnocchi/')); ?>" style="color: #b45309; font-size: 12px; font-weight: 700; text-decoration: none;">Explore Category &rarr;</a>
      </div>
      <div style="flex: 0 0 270px; background: #ffffff; border: 1px solid #eadfd5; border-radius: 18px; padding: 20px;">
        <div style="font-size: 26px; margin-bottom: 8px;">🗺️</div>
        <h3 style="font-family: Georgia, serif; font-size: 18px; margin: 0 0 6px; color: #1a202c;">Regional Italian Recipes</h3>
        <p style="font-size: 13px; color: #4a5568; margin: 0 0 12px;">Dedicated collections for Sicily, Calabria, Liguria, Sardinia, Abruzzo &amp; Tuscany.</p>
        <a href="<?php echo esc_url(home_url('/category/regional-italian-recipes/')); ?>" style="color: #1d4ed8; font-size: 12px; font-weight: 700; text-decoration: none;">Explore Category &rarr;</a>
      </div>
      <div style="flex: 0 0 270px; background: #ffffff; border: 1px solid #eadfd5; border-radius: 18px; padding: 20px;">
        <div style="font-size: 26px; margin-bottom: 8px;">🥣</div>
        <h3 style="font-family: Georgia, serif; font-size: 18px; margin: 0 0 6px; color: #1a202c;">Soups, Beans &amp; Vegetables</h3>
        <p style="font-size: 13px; color: #4a5568; margin: 0 0 12px;">Minestrone, bean soups, vegetable stews, salads, side dishes &amp; legume-based meals.</p>
        <a href="<?php echo esc_url(home_url('/category/soups-beans-vegetables/')); ?>" style="color: #15803d; font-size: 12px; font-weight: 700; text-decoration: none;">Explore Category &rarr;</a>
      </div>
      <div style="flex: 0 0 270px; background: #ffffff; border: 1px solid #eadfd5; border-radius: 18px; padding: 20px;">
        <div style="font-size: 26px; margin-bottom: 8px;">💪</div>
        <h3 style="font-family: Georgia, serif; font-size: 18px; margin: 0 0 6px; color: #1a202c;">Protein-Rich Italian Meals</h3>
        <p style="font-size: 13px; color: #4a5568; margin: 0 0 12px;">Chicken and seafood dinners, bean-based meals, balanced pasta &amp; meal-prep lunches.</p>
        <a href="<?php echo esc_url(home_url('/category/protein-rich-italian-meals/')); ?>" style="color: #9333ea; font-size: 12px; font-weight: 700; text-decoration: none;">Explore Category &rarr;</a>
      </div>
    </div>
  </section>
</main>

<?php get_footer(); ?>
