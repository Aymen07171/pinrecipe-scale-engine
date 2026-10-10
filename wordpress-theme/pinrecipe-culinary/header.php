<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?> style="background-color: #FFF8F2; color: #2d3748;">
<?php wp_body_open(); ?>

<header class="site-header" style="background: #ffffff; border-bottom: 1px solid #eadfd5;">
  <div class="container">
    <div class="header-wrap">
      <a href="<?php echo esc_url(home_url('/')); ?>" class="site-logo" style="color: #1a202c;">
        <span class="logo-icon">🇮🇹</span>
        <span><?php bloginfo('name'); ?></span>
      </a>

      <nav class="site-nav">
        <a href="<?php echo esc_url(home_url('/')); ?>">Home</a>
        <a href="<?php echo esc_url(home_url('/italian-recipes/')); ?>">Italian Recipes Hub</a>
        <a href="<?php echo esc_url(home_url('/category/budget-friendly-italian/')); ?>">Budget Italian</a>
        <a href="<?php echo esc_url(home_url('/category/quick-italian-dinners/')); ?>">Quick Dinners</a>
        <a href="<?php echo esc_url(home_url('/category/pasta-risotto-gnocchi/')); ?>">Pasta &amp; Risotto</a>
        <a href="<?php echo esc_url(home_url('/category/regional-italian-recipes/')); ?>">Regional</a>
      </nav>

      <div class="nav-actions">
        <a href="<?php echo esc_url(home_url('/?s=')); ?>" class="btn btn-outline" style="padding: 8px 14px; font-size: 13px; border-color: #227755; color: #227755;">
          🔍 Search Recipes
        </a>
      </div>
    </div>
  </div>
</header>
