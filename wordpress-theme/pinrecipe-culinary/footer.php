<footer class="site-footer" style="background: #1a202c; color: #e2e8f0; padding: 48px 0 28px; border-top: 5px solid #227755; margin-top: 48px;">
  <div class="container">
    <div style="display: flex; flex-wrap: wrap; gap: 32px; justify-content: space-between; padding-bottom: 32px; border-bottom: 1px solid #2d3748;">
      <div style="flex: 1 1 260px;">
        <div class="site-logo" style="color: white; margin-bottom: 10px;">
          <span class="logo-icon">🇮🇹</span>
          <span><?php bloginfo('name'); ?></span>
        </div>
        <p style="margin: 0; color: #a0aec0; font-size: 13px; max-width: 360px; line-height: 1.65;">
          Real Italian Flavor. Everyday Cooking. Authentic budget-friendly Italian recipes, quick 20-minute weeknight dinners, regional specialties, and free printable PDF recipe cards.
        </p>
      </div>

      <div style="flex: 1 1 200px; font-size: 13px;">
        <strong style="color: white; display: block; margin-bottom: 10px; font-family: Georgia, serif; font-size: 15px;">Italian Recipe Categories</strong>
        <ul style="list-style: none; padding: 0; margin: 0; line-height: 2.1;">
          <li><a href="<?php echo esc_url(home_url('/category/budget-friendly-italian/')); ?>" style="color: #cbd5e1; text-decoration: none;">💰 Budget-Friendly Italian</a></li>
          <li><a href="<?php echo esc_url(home_url('/category/quick-italian-dinners/')); ?>" style="color: #cbd5e1; text-decoration: none;">⚡ Quick Italian Dinners</a></li>
          <li><a href="<?php echo esc_url(home_url('/category/pasta-risotto-gnocchi/')); ?>" style="color: #cbd5e1; text-decoration: none;">🍝 Pasta, Risotto &amp; Gnocchi</a></li>
          <li><a href="<?php echo esc_url(home_url('/category/regional-italian-recipes/')); ?>" style="color: #cbd5e1; text-decoration: none;">🗺️ Regional Italian Recipes</a></li>
          <li><a href="<?php echo esc_url(home_url('/category/soups-beans-vegetables/')); ?>" style="color: #cbd5e1; text-decoration: none;">🥣 Soups, Beans &amp; Vegetables</a></li>
          <li><a href="<?php echo esc_url(home_url('/category/protein-rich-italian-meals/')); ?>" style="color: #cbd5e1; text-decoration: none;">💪 Protein-Rich Italian Meals</a></li>
        </ul>
      </div>

      <div style="flex: 1 1 180px; font-size: 13px;">
        <strong style="color: white; display: block; margin-bottom: 10px; font-family: Georgia, serif; font-size: 15px;">Quick Navigation</strong>
        <ul style="list-style: none; padding: 0; margin: 0; line-height: 2.1;">
          <li><a href="<?php echo esc_url(home_url('/home/')); ?>" style="color: #cbd5e1; text-decoration: none;">🏠 Website Homepage</a></li>
          <li><a href="<?php echo esc_url(home_url('/italian-recipes/')); ?>" style="color: #cbd5e1; text-decoration: none;">🇮🇹 Italian Recipes Hub</a></li>
          <li><a href="<?php echo esc_url(home_url('/about/')); ?>" style="color: #cbd5e1; text-decoration: none;">📖 About Our Kitchen</a></li>
          <li><a href="<?php echo esc_url(home_url('/contact/')); ?>" style="color: #cbd5e1; text-decoration: none;">✉️ Contact Us</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-copy" style="padding-top: 22px; font-size: 12px; color: #718096; display: flex; justify-content: space-between; flex-wrap: wrap;">
      <span>&copy; <?php echo date('Y'); ?> <strong><?php bloginfo('name'); ?></strong>. All Rights Reserved.</span>
      <a href="#top" style="color: #68d391; text-decoration: none; font-weight: 700;">&uarr; Back to Top</a>
    </div>
  </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
