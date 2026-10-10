<?php
/**
 * PinRecipe Culinary Theme Functions & Setup
 * Lightweight, zero-bloat recipe engine for WordPress
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// =============================================================================
// 1. STRIP UNNECESSARY WORDPRESS BLOAT & SPEED OPTIMIZATIONS
// =============================================================================

function pinrecipe_remove_wp_bloat() {
    // Remove emojis
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_styles', 'print_emoji_styles');
    remove_filter('the_content_feed', 'wp_staticize_emoji');
    remove_filter('comment_text_rss', 'wp_staticize_emoji');
    remove_filter('wp_mail', 'wp_staticize_emoji_for_email');

    // Remove RSD link, Windows Live Writer manifest, WP generator version
    remove_action('wp_head', 'rsd_link');
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'wp_generator');
    remove_action('wp_head', 'wp_shortlink_wp_head');
    remove_action('wp_head', 'rest_output_link_wp_head');
    remove_action('wp_head', 'wp_oembed_add_discovery_links');
    remove_action('wp_head', 'wp_oembed_add_host_js');

    // Remove XML-RPC pingback header
    add_filter('wp_headers', function($headers) {
        unset($headers['X-Pingback']);
        return $headers;
    });
}
add_action('init', 'pinrecipe_remove_wp_bloat');

// Disable self-pingbacks
add_action('pre_ping', function(&$links) {
    $home = get_option('home');
    foreach ($links as $l => $link) {
        if (0 === strpos($link, $home)) {
            unset($links[$l]);
        }
    }
});

// =============================================================================
// 2. THEME SETUP & ASSETS
// =============================================================================

function pinrecipe_theme_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption'));
    add_theme_support('responsive-embeds');

    // Set custom image sizes for recipe cards and pins
    add_image_size('recipe-card-thumb', 600, 450, true);
    add_image_size('recipe-hero-large', 1200, 750, true);

    // Register navigation menus
    register_nav_menus(array(
        'primary-menu' => __('Primary Navigation', 'pinrecipe-culinary'),
        'footer-menu'  => __('Footer Navigation', 'pinrecipe-culinary'),
    ));
}
add_action('after_setup_theme', 'pinrecipe_theme_setup');

function pinrecipe_enqueue_scripts() {
    wp_enqueue_style('pinrecipe-main-style', get_stylesheet_uri(), array(), '1.0.0');
}
add_action('wp_enqueue_scripts', 'pinrecipe_enqueue_scripts');

// =============================================================================
// 3. RECIPE TAXONOMY & CUSTOM POST TYPE INTEGRATION
// =============================================================================

function pinrecipe_register_taxonomies() {
    // Theme / Object Taxonomy: French cuisine, Recycled pizza, Thanksgiving, etc.
    $theme_labels = array(
        'name'              => _x('Recipe Themes & Objects', 'taxonomy general name', 'pinrecipe-culinary'),
        'singular_name'     => _x('Recipe Theme', 'taxonomy singular name', 'pinrecipe-culinary'),
        'search_items'      => __('Search Themes', 'pinrecipe-culinary'),
        'all_items'         => __('All Themes', 'pinrecipe-culinary'),
        'edit_item'         => __('Edit Theme', 'pinrecipe-culinary'),
        'update_item'       => __('Update Theme', 'pinrecipe-culinary'),
        'add_new_item'      => __('Add New Recipe Theme', 'pinrecipe-culinary'),
        'new_item_name'     => __('New Recipe Theme Name', 'pinrecipe-culinary'),
        'menu_name'         => __('Recipe Themes', 'pinrecipe-culinary'),
    );

    register_taxonomy('recipe_theme', array('post', 'rcpmst_recipe_comp'), array(
        'hierarchical'      => true,
        'labels'            => $theme_labels,
        'show_ui'           => true,
        'show_admin_column' => true,
        'show_in_rest'      => true,
        'query_var'         => true,
        'rewrite'           => array('slug' => 'theme'),
    ));

    // Register custom post type rcpmst_recipe_comp if not already registered by plugin
    if (!post_type_exists('rcpmst_recipe_comp')) {
        $labels = array(
            'name'                  => _x('Recipes', 'Post Type General Name', 'pinrecipe-culinary'),
            'singular_name'         => _x('Recipe', 'Post Type Singular Name', 'pinrecipe-culinary'),
            'menu_name'             => __('Recipes', 'pinrecipe-culinary'),
            'all_items'             => __('All Recipes', 'pinrecipe-culinary'),
            'add_new_item'          => __('Add New Recipe', 'pinrecipe-culinary'),
            'edit_item'             => __('Edit Recipe', 'pinrecipe-culinary'),
        );
        register_post_type('rcpmst_recipe_comp', array(
            'labels'             => $labels,
            'public'             => true,
            'publicly_queryable' => true,
            'show_ui'            => true,
            'show_in_menu'       => true,
            'query_var'          => true,
            'rewrite'            => array('slug' => 'recipes'),
            'capability_type'    => 'post',
            'has_archive'        => true,
            'hierarchical'       => false,
            'menu_position'      => 5,
            'menu_icon'          => 'dashicons-carrot',
            'supports'           => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
            'show_in_rest'       => true,
            'taxonomies'         => array('category', 'post_tag', 'recipe_theme'),
        ));
    }
}
add_action('init', 'pinrecipe_register_taxonomies');

// =============================================================================
// 4. RECIPE META & HELPERS
// =============================================================================

function pinrecipe_get_meta($post_id, $key, $default = '') {
    $val = get_post_meta($post_id, $key, true);
    return !empty($val) ? $val : $default;
}

// =============================================================================
// 5. AUTOMATIC GOOGLE SCHEMA.ORG RECIPE JSON-LD INJECTION
// =============================================================================

function pinrecipe_inject_schema_jsonld() {
    if (!is_singular(array('post', 'rcpmst_recipe_comp'))) {
        return;
    }

    global $post;
    $post_id = $post->ID;

    $title = get_the_title($post_id);
    $description = wp_strip_all_tags(get_the_excerpt($post_id) ?: get_the_content($post_id));
    $thumb_url = get_the_post_thumbnail_url($post_id, 'full');

    $prep_time = pinrecipe_get_meta($post_id, 'pinrecipe_prep_time', '15 mins');
    $cook_time = pinrecipe_get_meta($post_id, 'pinrecipe_cook_time', '20 mins');
    $total_time = pinrecipe_get_meta($post_id, 'pinrecipe_total_time', '35 mins');
    $servings = pinrecipe_get_meta($post_id, 'pinrecipe_servings', '4 servings');
    $calories = pinrecipe_get_meta($post_id, 'pinrecipe_calories', '450');

    // Convert time string to ISO 8601 (PT15M)
    $to_iso = function($time_str) {
        preg_match('/(\d+)\s*min/i', $time_str, $matches);
        if (!empty($matches[1])) {
            return 'PT' . $matches[1] . 'M';
        }
        return 'PT20M';
    };

    $schema = array(
        '@context'        => 'https://schema.org',
        '@type'           => 'Recipe',
        'name'            => $title,
        'description'     => substr($description, 0, 160),
        'author'          => array(
            '@type' => 'Person',
            'name'  => get_the_author_meta('display_name', $post->post_author) ?: 'Executive Chef',
        ),
        'datePublished'   => get_the_date('c', $post_id),
        'prepTime'        => $to_iso($prep_time),
        'cookTime'        => $to_iso($cook_time),
        'totalTime'       => $to_iso($total_time),
        'recipeYield'     => $servings,
        'nutrition'       => array(
            '@type'    => 'NutritionInformation',
            'calories' => $calories . ' calories',
        ),
    );

    if ($thumb_url) {
        $schema['image'] = array($thumb_url);
    }

    echo "\n<!-- PinRecipe Scale Engine JSON-LD Recipe Markup -->\n";
    echo '<script type="application/ld+json">' . json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . '</script>' . "\n";
}
add_action('wp_head', 'pinrecipe_inject_schema_jsonld');

// =============================================================================
// 6. INSTANT PRINTABLE / DOWNLOADABLE RECIPE PDF ENDPOINT
// =============================================================================

function pinrecipe_handle_print_view() {
    if (isset($_GET['print_recipe']) && $_GET['print_recipe'] == '1' && is_singular(array('post', 'rcpmst_recipe_comp'))) {
        include get_template_directory() . '/recipe-print-template.php';
        exit;
    }
}
add_action('template_redirect', 'pinrecipe_handle_print_view');

// =============================================================================
// 7. REST API ENDPOINT FOR 1-CLICK PUBLISHING FROM ENGINE
// =============================================================================

function pinrecipe_register_api_endpoints() {
    register_rest_route('pinrecipe/v1', '/publish', array(
        'methods'             => 'POST',
        'callback'            => 'pinrecipe_api_publish_recipe',
        'permission_callback' => function () {
            return current_user_can('edit_posts');
        },
    ));
}
add_action('rest_api_init', 'pinrecipe_register_api_endpoints');

function pinrecipe_api_publish_recipe($request) {
    $params = $request->get_json_params();
    if (empty($params['title'])) {
        return new WP_Error('missing_title', 'Recipe title is required', array('status' => 400));
    }

    $post_data = array(
        'post_title'   => sanitize_text_field($params['title']),
        'post_content' => wp_kses_post($params['content'] ?? ''),
        'post_status'  => sanitize_text_field($params['status'] ?? 'publish'),
        'post_type'    => sanitize_text_field($params['post_type'] ?? 'post'),
        'post_excerpt' => sanitize_text_field($params['metaDescription'] ?? ''),
    );

    $post_id = wp_insert_post($post_data);
    if (is_wp_error($post_id)) {
        return $post_id;
    }

    // Set Theme Category (French cuisine, Recycled pizza, Thanksgiving, etc.)
    if (!empty($params['themeCategory'])) {
        wp_set_object_terms($post_id, $params['themeCategory'], 'recipe_theme', true);
    }
    if (!empty($params['niche'])) {
        wp_set_object_terms($post_id, $params['niche'], 'category', true);
    }

    // Save recipe meta
    $meta_fields = array('prepTime', 'cookTime', 'totalTime', 'servings', 'calories');
    foreach ($meta_fields as $f) {
        if (!empty($params[$f])) {
            update_post_meta($post_id, 'pinrecipe_' . strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $f)), sanitize_text_field($params[$f]));
        }
    }

    return rest_ensure_response(array(
        'success'   => true,
        'post_id'   => $post_id,
        'permalink' => get_permalink($post_id),
    ));
}
