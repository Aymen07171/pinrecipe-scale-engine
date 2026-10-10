import { RecipeItem, WordPressConfig, PinterestConfig } from '../types/pipeline';
import trufflePastaImg from '../assets/images/recipe_truffle_pasta_1791456194437.jpg';
import salmonBowlImg from '../assets/images/recipe_salmon_bowl_1791456206016.jpg';
import berryCheesecakeImg from '../assets/images/recipe_berry_cheesecake_1791456217003.jpg';
import moroccanTagineImg from '../assets/images/recipe_moroccan_tagine_1791456228215.jpg';
import frenchBourguignonImg from '../assets/images/recipe_french_bourguignon.jpg';
import recycledPizzaImg from '../assets/images/recipe_recycled_pizza.jpg';
import thanksgivingTurkeyImg from '../assets/images/recipe_thanksgiving_turkey.jpg';
import italianCarbonaraImg from '../assets/images/italian_pasta_carbonara_hero.jpg';
import italianPizzaImg from '../assets/images/italian_margherita_pizza_woodfired.jpg';
import italianLasagnaImg from '../assets/images/italian_lasagna_bolognese_layers.jpg';
import italianTiramisuImg from '../assets/images/italian_tiramisu_espresso_dolci.jpg';
import italianPastaPrepImg from '../assets/images/italian_pasta_prep_ingredients.jpg';
import italianBruschettaImg from '../assets/images/italian_burrata_bruschetta_antipasti.jpg';
import italianPastaECeciImg from '../assets/images/italian_pasta_e_ceci_chickpeas.jpg';
import italianWhiteBeansImg from '../assets/images/italian_tuscan_white_beans_fagioli.jpg';
import italianLigurianPestoImg from '../assets/images/italian_ligurian_pesto_trenette.jpg';
import italianSardinianFregolaImg from '../assets/images/italian_sardinian_fregola_seafood.jpg';
import italianLentilRaguImg from '../assets/images/italian_lentil_ragu_pappardelle.jpg';
import italianFrittataImg from '../assets/images/italian_frittata_green_beans.jpg';

export const ITALIAN_RECIPE_CATEGORIES = [
  {
    id: 'cat-budget-italian',
    name: 'Budget-Friendly Italian',
    slug: 'budget-friendly-italian',
    icon: '🪙',
    description: 'Pasta e ceci, pasta e fagioli, pantry pasta, lentils, white beans, leftover bread dishes and inexpensive family meals.',
    sampleTopics: [
      'What Is Cucina Povera? Traditional Italian Cooking on a Budget',
      'Easy Pasta e Ceci with Canned Chickpeas',
      'What to Do with Leftover Italian Bread',
      'An Easy Italian Lentil and Tomato Ragù'
    ]
  },
  {
    id: 'cat-quick-italian',
    name: 'Quick Italian Dinners',
    slug: 'quick-italian-dinners',
    icon: '⏱️',
    description: '20–30-minute dinners, simple sauces, one-pan dishes, and recipes for busy evenings.',
    sampleTopics: [
      'Italian Pantry Dinners Made with Five Everyday Ingredients',
      'Air-Fryer Italian Frittata with Green Beans',
      'Easy Pasta e Ceci with Canned Chickpeas'
    ]
  },
  {
    id: 'cat-pasta-risotto-gnocchi',
    name: 'Pasta, Risotto & Gnocchi',
    slug: 'pasta-risotto-gnocchi',
    icon: '🍝',
    description: 'Pasta shapes and sauces, risotto, homemade gnocchi, baked pasta and traditional combinations.',
    sampleTopics: [
      'Ligurian Pesto Pasta with Potatoes and Green Beans',
      'An Easy Italian Lentil and Tomato Ragù',
      'Authentic Roman Spaghetti alla Carbonara'
    ]
  },
  {
    id: 'cat-regional-italian',
    name: 'Regional Italian Recipes',
    slug: 'regional-italian-recipes',
    icon: '🗺️',
    description: 'Dedicated collections for Sicily, Calabria, Liguria, Sardinia, Abruzzo, Tuscany and other regions as your library grows.',
    sampleTopics: [
      'Ligurian Pesto Pasta with Potatoes and Green Beans',
      'Sardinian Fregola with Seafood or Vegetables',
      'Abruzzese Crespelle in Brodo: A Regional Italian Recipe',
      'Tuscan-Style White Beans with Tomatoes and Rosemary'
    ]
  },
  {
    id: 'cat-soups-beans-veg',
    name: 'Soups, Beans & Vegetables',
    slug: 'soups-beans-vegetables',
    icon: '🥣',
    description: 'Minestrone, bean soups, vegetable stews, salads, Italian side dishes and legume-based meals.',
    sampleTopics: [
      'Tuscan-Style White Beans with Tomatoes and Rosemary',
      'Pasta e Fagioli: An Easy Italian Pasta and Bean Soup',
      'Easy Pasta e Ceci with Canned Chickpeas'
    ]
  },
  {
    id: 'cat-protein-italian',
    name: 'Protein-Rich Italian Meals',
    slug: 'protein-rich-italian-meals',
    icon: '💪',
    description: 'Chicken and seafood dinners, bean-based meals, balanced pasta dishes, and recipes that store well for lunches.',
    sampleTopics: [
      'High-Protein Chicken Pesto Pasta for Meal Prep',
      'Sardinian Fregola with Seafood or Vegetables',
      'Air-Fryer Italian Frittata with Green Beans'
    ]
  }
];

export const SAMPLE_ITALIAN_INSPIRATION_ARTICLES = [
  {
    id: 'insp-cucina-povera',
    title: 'Cucina Povera & Pantry Storytelling Style (Priority 1–6)',
    category: 'Budget-Friendly Italian',
    excerpt: 'Focuses on resourceful Italian home cooking, pantry staples (canned chickpeas, cannellini beans, leftover country bread), cost-per-serving value, 3 step photos, and a downloadable kitchen PDF.',
    sampleText: `## The Wisdom of Cucina Povera: Maximum Flavor from Humble Pantry Staples
Open with how traditional Italian home cooks transform everyday ingredients—dried pasta, canned legumes, rosemary, garlic, extra-virgin olive oil, and day-old bread—into deeply comforting meals.

### Why This Recipe Works (Culinary Technique)
1. **Starch-Thickened Brodo:** Explain how mashing or puréeing a quarter of the chickpeas or white beans creates a velvety, restaurant-level soup base without heavy cream.
2. **Aromatic Oil Infusion (Soffritto):** Gently blooming rosemary, sage, and garlic in olive oil builds a rich foundation in minutes.

### Visual Step Checkpoints & Printable PDF
Include 3 step-by-step recipe photographs (Pantry Ingredients, Simmering Pot, and Plated Bowl) and invite readers to click the 'Download Printable Recipe PDF' button.`
  },
  {
    id: 'insp-regional-protein',
    title: 'Regional Heritage & Balanced Meal-Prep Style (Priority 7–12)',
    category: 'Regional Italian Recipes',
    excerpt: 'Highlights authentic regional traditions (Liguria, Sardinia, Abruzzo, Tuscany) alongside practical modern tips for protein balance, meal-prep storage, and appliance shortcuts.',
    sampleText: `## Regional Italian Heritage Meets Modern Weeknight Cooking
Introduce the regional origin of the dish (such as Genoa in Liguria, coastal Sardinia, or mountainous Abruzzo) and explain how to recreate it with accessible supermarket ingredients. Always highlight the 3 step photos and downloadable PDF card.`
  }
];

export const INITIAL_RECIPES: RecipeItem[] = [
  // ===========================================================================
  // PRIORITY 1: What Is Cucina Povera? Traditional Italian Cooking on a Budget
  // ===========================================================================
  {
    id: 'rec-it-prio-01',
    topic: 'What Is Cucina Povera? Traditional Italian Cooking on a Budget',
    title: 'What Is Cucina Povera? Traditional Italian Cooking on a Budget (+ Master Peasant Stew Recipe)',
    slug: 'what-is-cucina-povera-traditional-italian-cooking-on-a-budget',
    niche: 'Budget-Friendly Italian',
    themeCategory: 'Budget-Friendly Italian',
    italianCategory: 'Budget-Friendly Italian',
    dietary: 'Cucina Povera · Budget Friendly',
    status: 'completed',
    currentStepIndex: 4,
    progress: 100,
    imageUrl: italianPastaECeciImg,
    thumbnailUrl: italianPastaECeciImg,
    downloadablePdfUrl: '/api/recipe-print/what-is-cucina-povera-traditional-italian-cooking-on-a-budget',
    galleryImages: [
      {
        url: italianPastaPrepImg,
        caption: 'Photo 1: The Cucina Povera Pantry — Bronze-die pasta, dried legumes, garlic, rosemary, and cold-pressed olive oil.',
        alt: 'Traditional Italian pantry ingredients on kitchen counter'
      },
      {
        url: italianPastaECeciImg,
        caption: 'Photo 2: Velvety Legume & Pasta Emulsion — Simmering ditalini and chickpeas together concentrates natural starches.',
        alt: 'Rustic terracotta bowl of Italian chickpea and pasta stew'
      },
      {
        url: italianBruschettaImg,
        caption: 'Photo 3: Zero-Waste Country Bread — Day-old crusty bread rubbed with garlic and drizzled with olive oil alongside soup.',
        alt: 'Toasted rustic Italian bread with tomatoes and olive oil'
      }
    ],
    macroPhotoPrompt: 'Rustic Italian Cucina Povera feast in a warm country kitchen, terracotta bowl of golden chickpea and pasta stew drizzled with olive oil, crusty peasant sourdough bread, rosemary sprigs, 8k DSLR food photography.',
    prepTime: '10 mins',
    cookTime: '20 mins',
    totalTime: '30 mins',
    servings: '4 servings ($1.65/serving)',
    calories: 430,
    difficulty: 'Easy',
    macros: { protein: '16g', carbs: '62g', fat: '12g', fiber: '9g' },
    ingredients: [
      { item: 'Ditalini or Broken Spaghetti Pasta', amount: '250g (9 oz)', notes: 'pantry staple short pasta' },
      { item: 'Canned Chickpeas & Cannellini Beans', amount: '2 cans (400g each)', notes: 'undrained with starchy liquid' },
      { item: 'Extra Virgin Olive Oil', amount: '3 tbsp', notes: 'plus extra for finishing drizzle' },
      { item: 'Fresh Garlic Cloves & Rosemary Sprig', amount: '3 cloves garlic, 2 sprigs rosemary' },
      { item: 'Tomato Paste or Crushed Tomatoes', amount: '2 tbsp' },
      { item: 'Day-Old Crusty Italian Bread', amount: '4 slices', notes: 'toasted for serving' }
    ],
    instructions: [
      { step: 1, title: 'Infuse the Rosemary & Garlic Oil', text: 'Warm 3 tablespoons of olive oil in a heavy pot over medium-low heat. Add crushed garlic cloves and fresh rosemary sprigs, letting them sizzle gently for 2 minutes until fragrant.', timerMinutes: 2 },
      { step: 2, title: 'Caramelize Tomato Paste & Add Legumes', text: 'Stir in the tomato paste for 1 minute to deepen its sweetness. Pour in the chickpeas and beans along with their flavorful canning liquid plus 2 cups of water.', timerMinutes: 8 },
      { step: 3, title: 'The Cucina Povera Creaminess Trick', text: 'Use an immersion blender (or potato masher) to pulse 1/4 of the beans directly in the pot. This creates a thick, velvety broth without a drop of dairy cream.', timerMinutes: 2 },
      { step: 4, title: 'Simmer Pasta Directly in the Broth', text: 'Add the dry pasta straight into the simmering bean broth and cook for 9 to 10 minutes, stirring frequently so the pasta starch thickens the stew. Serve over toasted day-old bread with a swirl of raw olive oil.', timerMinutes: 10 }
    ],
    chefTips: [
      'The Core Rule of Cucina Povera: Never throw away pasta cooking water, bean liquid (aquafaba), or stale bread—they are the natural thickeners of traditional Italian cooking.',
      'Save Parmigiano-Reggiano rinds in your freezer and drop one into any bean or vegetable soup while it simmers for deep umami flavor.'
    ],
    metaDescription: 'Discover What Is Cucina Povera—the art of traditional Italian cooking on a budget—plus a master 30-minute peasant legume & pasta recipe with free PDF.',
    focusKeyword: 'what is cucina povera italian cooking on a budget',
    longArticleContent: `## What Is Cucina Povera? The Soul of Resourceful Italian Cooking
Literally translated as *"poor kitchen"* or *"peasant cooking,"* **Cucina Povera** is the foundation of Italy’s most beloved regional dishes. Born out of rural necessity across Tuscany, Puglia, Lazio, and Sicily, it celebrates seasonal vegetables, humble legumes (chickpeas, lentils, cannellini beans), coarse grains, and zero-waste kitchen wisdom.

### Five Pillars of Traditional Italian Budget Cooking
1. **Legumes as Everyday Protein:** Chickpeas (*ceci*), white beans (*fagioli*), and lentils replace expensive cuts of meat while delivering rich texture.
2. **One-Pot Starch Emulsions:** Cooking pasta directly inside bean or vegetable broth releases starch that turns simple water and olive oil into a glossy sauce.
3. **Second-Life Bread (*Pane Raffermo*):** Stale country loaves become the star of *Ribollita*, *Panzanella*, *Pappa al Pomodoro*, and crispy garlic pangrattato crumbs.`,
    schemaJsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: 'Cucina Povera Master Chickpea & Bean Pantry Stew',
      description: 'An authentic guide to Cucina Povera (traditional Italian cooking on a budget) featuring a 30-minute one-pot pantry pasta and legume stew.',
      prepTime: 'PT10M',
      cookTime: 'PT20M',
      totalTime: 'PT30M',
      recipeYield: '4 servings',
      recipeCategory: 'Budget-Friendly Italian',
      recipeCuisine: 'Italian'
    },
    pinterestPin: {
      title: 'What Is Cucina Povera? 10 Secrets of Italian Cooking on a Budget!',
      description: 'Learn how Italian nonnas turn $5 of pantry staples—canned beans, pasta, garlic, rosemary, and leftover bread—into unforgettable family dinners. Free printable PDF guide!',
      hashtags: ['#cucinapovera', '#budgetitalian', '#italianrecipes', '#pantrymeals', '#cheapfamilymeals'],
      overlayHeadline: 'Cucina Povera Budget Guide',
      board: 'Budget-Friendly Italian',
      scheduledTime: 'Today at 5:00 PM',
      status: 'scheduled'
    },
    wpStatus: 'published',
    wpPostUrl: 'https://foodsprepared.wasmer.app/italian-recipes',
    wpCategory: 'Budget-Friendly Italian',
    createdAt: '2026-10-10T12:01:00Z',
    completedAt: '2026-10-10T12:02:00Z',
    healthScore: 100,
    logEntries: ['Priority 1 Article · SEO Angle: cuisine + budget · Category: Budget-Friendly Italian']
  },

  // ===========================================================================
  // PRIORITY 2: Easy Pasta e Ceci with Canned Chickpeas
  // ===========================================================================
  {
    id: 'rec-it-prio-02',
    topic: 'Easy Pasta e Ceci with Canned Chickpeas',
    title: 'Easy One-Pot Roman Pasta e Ceci with Canned Chickpeas (25-Minute Pantry Dinner)',
    slug: 'easy-pasta-e-ceci-with-canned-chickpeas',
    niche: 'Budget-Friendly Italian',
    themeCategory: 'Budget-Friendly Italian',
    italianCategory: 'Budget-Friendly Italian',
    dietary: 'Vegan / Vegetarian Pantry',
    status: 'completed',
    currentStepIndex: 4,
    progress: 100,
    imageUrl: italianPastaECeciImg,
    thumbnailUrl: italianPastaECeciImg,
    downloadablePdfUrl: '/api/recipe-print/easy-pasta-e-ceci-with-canned-chickpeas',
    galleryImages: [
      {
        url: italianPastaECeciImg,
        caption: 'Photo 1: Creamy Roman Pasta e Ceci — Tender ditalini and chickpeas bathed in a rosemary-garlic tomato emulsion.',
        alt: 'Bowl of Easy Pasta e Ceci with Canned Chickpeas'
      },
      {
        url: italianPastaPrepImg,
        caption: 'Photo 2: Five Everyday Pantry Ingredients — Canned chickpeas, short bronze-die pasta, garlic, rosemary, and olive oil.',
        alt: 'Italian pasta and aromatics prep on marble counter'
      },
      {
        url: italianWhiteBeansImg,
        caption: 'Photo 3: Simmering in Earthenware — Puréeing a scoop of chickpeas thickens the broth naturally in minutes.',
        alt: 'Simmering Italian legume soup in earthenware pot'
      }
    ],
    macroPhotoPrompt: 'Close-up food photography of Roman Pasta e Ceci made with canned chickpeas and ditalini pasta in a terracotta bowl, glossy rosemary olive oil swirl, black pepper, 8k DSLR.',
    prepTime: '5 mins',
    cookTime: '20 mins',
    totalTime: '25 mins',
    servings: '4 servings',
    calories: 445,
    difficulty: 'Easy',
    macros: { protein: '17g', carbs: '64g', fat: '13g', fiber: '10g' },
    ingredients: [
      { item: 'Canned Chickpeas (Garbanzo Beans)', amount: '2 cans (15 oz / 400g each)', notes: 'rinsed, or keep liquid for extra body' },
      { item: 'Ditalini, Tubetti, or Small Shells Pasta', amount: '225g (8 oz)' },
      { item: 'Garlic Cloves & Fresh Rosemary', amount: '4 cloves garlic (smashed), 1 large rosemary sprig' },
      { item: 'Double-Concentrated Tomato Paste', amount: '2 tbsp' },
      { item: 'Vegetable or Chicken Broth', amount: '750ml (3 cups)' },
      { item: 'Extra Virgin Olive Oil & Grated Pecorino Romano', amount: '3 tbsp olive oil, 40g Pecorino' }
    ],
    instructions: [
      { step: 1, title: 'Sizzle Garlic & Rosemary in Olive Oil', text: 'Heat olive oil in a Dutch oven over medium heat. Sauté smashed garlic cloves, rosemary sprig, and a pinch of red pepper flakes for 2 minutes until golden.', timerMinutes: 2 },
      { step: 2, title: 'Bloom Tomato Paste & Simmer Chickpeas', text: 'Stir in tomato paste for 60 seconds, then add both cans of chickpeas and 3 cups of warm broth. Simmer for 8 minutes.', timerMinutes: 8 },
      { step: 3, title: 'Mash Half the Chickpeas for Creaminess', text: 'Remove the rosemary stem. Mash or blend about 1/3 of the chickpeas right in the pot to create a rich, velvety golden base.', timerMinutes: 2 },
      { step: 4, title: 'Cook Ditalini Directly in the Pot', text: 'Stir in dry ditalini pasta and simmer uncovered for 9 minutes, stirring often so pasta does not stick to the bottom. Ladle into warm bowls and top with Pecorino and olive oil.', timerMinutes: 9 }
    ],
    chefTips: [
      'Using canned chickpeas cuts the cooking time from 2 hours down to 25 minutes while still delivering authentic Roman trattoria texture.',
      'Let the Pasta e Ceci rest off the heat for 3 minutes before serving—the broth thickens into a luscious gravy as it cools slightly.'
    ],
    metaDescription: 'Make authentic Roman Pasta e Ceci in 25 minutes using canned chickpeas, ditalini pasta, garlic, and rosemary. Budget-friendly, one-pot, with free PDF!',
    focusKeyword: 'easy pasta e ceci with canned chickpeas',
    longArticleContent: `## Why Canned Chickpeas Make the Best Weeknight Pasta e Ceci
In Rome, *Pasta e Ceci* is the ultimate rainy-day comfort food. By mashing a portion of canned chickpeas directly into a garlic-rosemary tomato soffritto and boiling the pasta in the same pot, you get a thick, velvety meal in 25 minutes for pennies per bowl.`,
    schemaJsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: 'Easy Pasta e Ceci with Canned Chickpeas',
      description: '25-minute one-pot Italian Pasta e Ceci made with canned chickpeas, ditalini pasta, rosemary, and garlic.',
      prepTime: 'PT5M',
      cookTime: 'PT20M',
      totalTime: 'PT25M',
      recipeYield: '4 servings',
      recipeCategory: 'Budget-Friendly Italian',
      recipeCuisine: 'Italian'
    },
    pinterestPin: {
      title: '25-Minute Easy Pasta e Ceci with Canned Chickpeas (One-Pot!)',
      description: 'Thick, cozy, and budget-friendly Roman Pasta e Ceci made with canned chickpeas, garlic, and rosemary! Includes 3 step photos & free downloadable PDF card.',
      hashtags: ['#pastaecici', '#chickpearecipes', '#pantrydinner', '#budgetitalian', '#onepotpasta'],
      overlayHeadline: 'Easy Canned Chickpea Pasta e Ceci',
      board: 'Budget-Friendly Italian',
      scheduledTime: 'Today at 6:00 PM',
      status: 'scheduled'
    },
    wpStatus: 'published',
    wpPostUrl: 'https://foodsprepared.wasmer.app/italian-recipes',
    wpCategory: 'Budget-Friendly Italian',
    createdAt: '2026-10-10T12:05:00Z',
    completedAt: '2026-10-10T12:06:00Z',
    healthScore: 100,
    logEntries: ['Priority 2 Article · SEO Angle: pantry + simple recipe · Category: Budget-Friendly Italian']
  },

  // ===========================================================================
  // PRIORITY 3: Tuscan-Style White Beans with Tomatoes and Rosemary
  // ===========================================================================
  {
    id: 'rec-it-prio-03',
    topic: 'Tuscan-Style White Beans with Tomatoes and Rosemary',
    title: 'Tuscan-Style White Beans with Tomatoes, Garlic & Fresh Rosemary (Fagioli all’Uccelletto)',
    slug: 'tuscan-style-white-beans-with-tomatoes-and-rosemary',
    niche: 'Soups, Beans & Vegetables',
    themeCategory: 'Soups, Beans & Vegetables',
    italianCategory: 'Soups, Beans & Vegetables',
    dietary: 'Vegan · Gluten-Free · Tuscan',
    status: 'completed',
    currentStepIndex: 4,
    progress: 100,
    imageUrl: italianWhiteBeansImg,
    thumbnailUrl: italianWhiteBeansImg,
    downloadablePdfUrl: '/api/recipe-print/tuscan-style-white-beans-with-tomatoes-and-rosemary',
    galleryImages: [
      {
        url: italianWhiteBeansImg,
        caption: 'Photo 1: Bubbling in Earthenware — Creamy cannellini beans simmered with crushed plum tomatoes, rosemary, and sage.',
        alt: 'Tuscan-Style White Beans with Tomatoes and Rosemary in earthenware pot'
      },
      {
        url: italianBruschettaImg,
        caption: 'Photo 2: Served Over Grilled Country Bread — Spoon warm Tuscan beans over garlic-rubbed sourdough toast.',
        alt: 'Grilled Tuscan sourdough bread with tomatoes and olive oil'
      },
      {
        url: italianPastaECeciImg,
        caption: 'Photo 3: Rich Herbal Olive Oil Finish — A final drizzle of peppery green Tuscan olive oil ties the dish together.',
        alt: 'Close up of creamy Italian legume stew with rosemary'
      }
    ],
    macroPhotoPrompt: 'Mouth-watering close-up food photography of Tuscan-Style White Beans with Tomatoes and Rosemary simmering in a rustic terracotta pot, plump cannellini beans, fresh rosemary and sage, crusty bread, 8k.',
    prepTime: '5 mins',
    cookTime: '20 mins',
    totalTime: '25 mins',
    servings: '4 servings',
    calories: 320,
    difficulty: 'Easy',
    macros: { protein: '15g', carbs: '42g', fat: '10g', fiber: '11g' },
    ingredients: [
      { item: 'Canned Cannellini White Beans', amount: '2 cans (400g each)', notes: 'rinsed and drained' },
      { item: 'Crushed San Marzano Tomatoes', amount: '1 cup (240ml)' },
      { item: 'Fresh Rosemary & Fresh Sage Leaves', amount: '2 sprigs rosemary, 6 sage leaves' },
      { item: 'Whole Garlic Cloves', amount: '4 cloves', notes: 'lightly crushed with skin off' },
      { item: 'Tuscan Extra Virgin Olive Oil', amount: '3 tbsp' },
      { item: 'Sea Salt & Freshly Cracked Black Pepper', amount: 'to taste' }
    ],
    instructions: [
      { step: 1, title: 'Infuse Olive Oil with Garlic, Rosemary & Sage', text: 'Warm olive oil in a wide skillet or clay pot over medium-low heat. Add whole crushed garlic cloves, rosemary sprigs, and sage leaves for 3 minutes until the herbs crisp and perfume the oil.', timerMinutes: 3 },
      { step: 2, title: 'Simmer the Crushed Tomatoes', text: 'Pour in the crushed San Marzano tomatoes with a pinch of sea salt and black pepper. Simmer gently for 5 minutes until slightly thickened.', timerMinutes: 5 },
      { step: 3, title: 'Fold in Cannellini Beans & Braise', text: 'Add the drained cannellini beans and 1/2 cup of warm water. Simmer gently on low for 12 minutes so the beans absorb the herbal tomato sauce without bursting.', timerMinutes: 12 },
      { step: 4, title: 'Drizzle with Raw Olive Oil & Serve', text: 'Remove from heat, drizzle with 1 tablespoon of fresh Tuscan olive oil, and serve with thick slices of toasted country bread.' }
    ],
    chefTips: [
      'In Florence, this classic dish is called Fagioli all’Uccelletto because sage and rosemary were the traditional herbs used for roasting small game birds.',
      'Leftovers taste even better on day two—mash them onto warm toast for a 5-minute high-fiber Italian lunch.'
    ],
    metaDescription: 'Make authentic Tuscan-Style White Beans with Tomatoes and Rosemary (Fagioli all’Uccelletto) in 25 minutes using canned cannellini beans. Includes free PDF!',
    focusKeyword: 'tuscan style white beans with tomatoes and rosemary',
    longArticleContent: `## Fagioli all’Uccelletto: Florence’s Iconic White Bean Dish
Tuscans have been affectionately known across Italy as *mangiafagioli* ("bean eaters") for centuries. **Tuscan-Style White Beans with Tomatoes and Rosemary** showcases how creamy cannellini beans, fragrant woodsy herbs, and sweet plum tomatoes create a dish worthy of any trattoria table.`,
    schemaJsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: 'Tuscan-Style White Beans with Tomatoes and Rosemary',
      description: 'Traditional Florentine cannellini white beans braised with San Marzano tomatoes, garlic, rosemary, and sage.',
      prepTime: 'PT5M',
      cookTime: 'PT20M',
      totalTime: 'PT25M',
      recipeYield: '4 servings',
      recipeCategory: 'Soups, Beans & Vegetables',
      recipeCuisine: 'Italian'
    },
    pinterestPin: {
      title: '25-Min Tuscan White Beans with Tomatoes & Rosemary (15g Protein!)',
      description: 'Creamy cannellini beans simmered in a fragrant garlic, rosemary, sage, and tomato sauce! Serve with crusty bread for the ultimate Tuscan dinner. Free PDF inside!',
      hashtags: ['#tuscanbeans', '#cannellinibeans', '#italianbeans', '#mediterraneandiet', '#veganitalian'],
      overlayHeadline: 'Tuscan White Beans & Rosemary',
      board: 'Soups, Beans & Vegetables',
      scheduledTime: 'Today at 7:00 PM',
      status: 'scheduled'
    },
    wpStatus: 'published',
    wpPostUrl: 'https://foodsprepared.wasmer.app/italian-recipes',
    wpCategory: 'Soups, Beans & Vegetables',
    createdAt: '2026-10-10T12:10:00Z',
    completedAt: '2026-10-10T12:11:00Z',
    healthScore: 100,
    logEntries: ['Priority 3 Article · SEO Angle: regional-inspired bean recipe · Category: Soups, Beans & Vegetables']
  },

  // ===========================================================================
  // PRIORITY 4: Pasta e Fagioli: An Easy Italian Pasta and Bean Soup
  // ===========================================================================
  {
    id: 'rec-it-prio-04',
    topic: 'Pasta e Fagioli: An Easy Italian Pasta and Bean Soup',
    title: 'Classic Pasta e Fagioli: An Easy One-Pot Italian Pasta and Bean Soup',
    slug: 'pasta-e-fagioli-easy-italian-pasta-and-bean-soup',
    niche: 'Soups, Beans & Vegetables',
    themeCategory: 'Soups, Beans & Vegetables',
    italianCategory: 'Soups, Beans & Vegetables',
    dietary: 'One-Pot Comfort Soup',
    status: 'completed',
    currentStepIndex: 4,
    progress: 100,
    imageUrl: italianWhiteBeansImg,
    thumbnailUrl: italianWhiteBeansImg,
    downloadablePdfUrl: '/api/recipe-print/pasta-e-fagioli-easy-italian-pasta-and-bean-soup',
    galleryImages: [
      {
        url: italianWhiteBeansImg,
        caption: 'Photo 1: Rich Tomato & Borlotti/Cannellini Base — Slow-simmered soffritto with creamy white beans and herbs.',
        alt: 'Pot of Italian Pasta e Fagioli soup'
      },
      {
        url: italianPastaECeciImg,
        caption: 'Photo 2: Al Dente Ditalini Pasta — Short tubular pasta catches the thick bean broth in every spoonful.',
        alt: 'Bowl of Italian pasta and legume soup with spoon'
      },
      {
        url: italianPastaPrepImg,
        caption: 'Photo 3: Freshly Grated Parmigiano-Reggiano — Crowned with aged cheese and a Parmigiano rind simmered in the pot.',
        alt: 'Grating Parmigiano-Reggiano cheese'
      }
    ],
    macroPhotoPrompt: 'Steaming bowl of classic Italian Pasta e Fagioli soup with cannellini beans, ditalini pasta, carrots, celery, rosemary, and grated Parmigiano-Reggiano, rustic wooden table, 8k.',
    prepTime: '10 mins',
    cookTime: '25 mins',
    totalTime: '35 mins',
    servings: '6 servings',
    calories: 410,
    difficulty: 'Easy',
    macros: { protein: '18g', carbs: '58g', fat: '11g', fiber: '10g' },
    ingredients: [
      { item: 'Cannellini or Borlotti Beans', amount: '2 cans (400g each)', notes: '1 can drained, 1 can with liquid' },
      { item: 'Ditalini or Small Elbow Pasta', amount: '200g (7 oz)' },
      { item: 'Italian Soffritto (Finely Diced Onion, Carrot, Celery)', amount: '1.5 cups total' },
      { item: 'Crushed Tomatoes & Vegetable/Chicken Broth', amount: '1 cup tomatoes, 4 cups broth' },
      { item: 'Parmigiano-Reggiano Rind + Grated Cheese', amount: '1 rind + 50g grated' },
      { item: 'Fresh Rosemary, Thyme & Garlic', amount: '2 cloves garlic, 1 tbsp herbs' }
    ],
    instructions: [
      { step: 1, title: 'Sweat the Classic Italian Soffritto', text: 'Heat olive oil in a Dutch oven over medium heat. Cook finely diced onion, carrot, and celery with a pinch of salt for 7 minutes until soft and sweet.', timerMinutes: 7 },
      { step: 2, title: 'Add Garlic, Herbs, Tomatoes & Beans', text: 'Stir in minced garlic and rosemary for 1 minute. Add crushed tomatoes, both cans of beans, vegetable broth, and a Parmigiano-Reggiano rind.', timerMinutes: 10 },
      { step: 3, title: 'Blend a Cup of Soup for Velvety Body', text: 'Ladle 1.5 cups of beans and broth into a blender (or pulse briefly with an immersion blender) and stir back into the pot so the soup becomes thick and creamy.', timerMinutes: 2 },
      { step: 4, title: 'Simmer Ditalini & Finish with Parmigiano', text: 'Add dry ditalini pasta and simmer for 9 minutes until al dente. Ladle into bowls, top with grated Parmigiano-Reggiano, and drizzle with extra virgin olive oil.', timerMinutes: 9 }
    ],
    chefTips: [
      'Blending just 1.5 cups of the beans and vegetables transforms Pasta e Fagioli from a watery broth into a rich, spoon-coating Italian stew.',
      'If storing leftovers for lunch the next day, cook the pasta separately and add it to individual bowls so it stays al dente.'
    ],
    metaDescription: 'Cozy up with authentic Italian Pasta e Fagioli! This easy 35-minute pasta and bean soup uses pantry cannellini beans, ditalini, and aromatic herbs. Free PDF!',
    focusKeyword: 'pasta e fagioli easy italian pasta and bean soup',
    longArticleContent: `## Pasta e Fagioli: Italy’s Beloved One-Pot Pasta and Bean Soup
Every Italian region—from Veneto to Campania—has its own cherished version of **Pasta e Fagioli**. The secret shared by all of them is building a patient *soffritto* of onion, carrot, and celery, and puréeing part of the beans to create a creamy, comforting base.`,
    schemaJsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: 'Pasta e Fagioli: An Easy Italian Pasta and Bean Soup',
      description: 'Classic 35-minute Italian Pasta e Fagioli made with cannellini beans, ditalini pasta, soffritto vegetables, and Parmigiano-Reggiano.',
      prepTime: 'PT10M',
      cookTime: 'PT25M',
      totalTime: 'PT35M',
      recipeYield: '6 servings',
      recipeCategory: 'Soups, Beans & Vegetables',
      recipeCuisine: 'Italian'
    },
    pinterestPin: {
      title: 'The Best One-Pot Italian Pasta e Fagioli Soup (35 Minutes!)',
      description: 'Rich, creamy, and packed with 18g protein! Learn the authentic Italian trick for velvety Pasta e Fagioli using pantry beans and ditalini. Free PDF recipe card!',
      hashtags: ['#pastaefagioli', '#italiansoup', '#beansoup', '#cucinapovera', '#onepotmeals'],
      overlayHeadline: 'Classic Italian Pasta e Fagioli',
      board: 'Soups, Beans & Vegetables',
      scheduledTime: 'Tomorrow at 12:00 PM',
      status: 'scheduled'
    },
    wpStatus: 'published',
    wpPostUrl: 'https://foodsprepared.wasmer.app/italian-recipes',
    wpCategory: 'Soups, Beans & Vegetables',
    createdAt: '2026-10-10T12:15:00Z',
    completedAt: '2026-10-10T12:16:00Z',
    healthScore: 100,
    logEntries: ['Priority 4 Article · SEO Angle: classic dish · Category: Soups, Beans & Vegetables']
  },

  // ===========================================================================
  // PRIORITY 5: Italian Pantry Dinners Made with Five Everyday Ingredients
  // ===========================================================================
  {
    id: 'rec-it-prio-05',
    topic: 'Italian Pantry Dinners Made with Five Everyday Ingredients',
    title: '5-Ingredient Italian Pantry Dinners (Ready in 20 Minutes with Everyday Staples)',
    slug: 'italian-pantry-dinners-made-with-five-everyday-ingredients',
    niche: 'Quick Italian Dinners',
    themeCategory: 'Quick Italian Dinners',
    italianCategory: 'Quick Italian Dinners',
    dietary: '5-Ingredient · 20-Min Dinner',
    status: 'completed',
    currentStepIndex: 4,
    progress: 100,
    imageUrl: italianCarbonaraImg,
    thumbnailUrl: italianCarbonaraImg,
    downloadablePdfUrl: '/api/recipe-print/italian-pantry-dinners-made-with-five-everyday-ingredients',
    galleryImages: [
      {
        url: italianPastaPrepImg,
        caption: 'Photo 1: Only 5 Everyday Ingredients — Bronze-die spaghetti, garlic/guanciale, Pecorino Romano, black pepper, and olive oil.',
        alt: 'Five Italian pantry ingredients on marble board'
      },
      {
        url: italianCarbonaraImg,
        caption: 'Photo 2: 15-Minute Glossy Pan Emulsion — Starchy pasta water binds cheese and olive oil into liquid gold.',
        alt: 'Twirling glossy Italian pantry pasta on fork'
      },
      {
        url: italianPastaECeciImg,
        caption: 'Photo 3: Pantry Chickpea & Garlic Variation — Swap in a can of chickpeas for a 5-ingredient plant-protein dinner.',
        alt: 'Bowl of 5-ingredient chickpea pantry pasta'
      }
    ],
    macroPhotoPrompt: 'Appetizing overhead food photography of 5-ingredient Italian pantry pasta being lifted with a fork, glossy garlic and olive oil emulsion, golden toasted breadcrumbs, grated Pecorino, 8k.',
    prepTime: '5 mins',
    cookTime: '15 mins',
    totalTime: '20 mins',
    servings: '4 servings',
    calories: 480,
    difficulty: 'Easy',
    macros: { protein: '19g', carbs: '60g', fat: '18g', fiber: '4g' },
    ingredients: [
      { item: '1. Bronze-Die Spaghetti or Bucatini', amount: '400g (14 oz)' },
      { item: '2. Extra Virgin Olive Oil', amount: '60ml (1/4 cup)' },
      { item: '3. Fresh Garlic Cloves', amount: '6 cloves', notes: 'thinly shaved' },
      { item: '4. Aged Pecorino Romano or Parmigiano-Reggiano', amount: '80g', notes: 'finely grated' },
      { item: '5. Crushed Calabrian Chili Flakes (or Toasted Breadcrumbs)', amount: '1 tsp chili flakes, 1/2 cup crumbs' }
    ],
    instructions: [
      { step: 1, title: 'Boil Pasta in Concentrating Salted Water', text: 'Cook spaghetti in a wide pot with 3 quarts of salted water until 2 minutes shy of al dente. Reserve 1.5 cups of starchy cooking water.', timerMinutes: 8 },
      { step: 2, title: 'Cold-Pan Garlic & Chili Infusion', text: 'Place sliced garlic, chili flakes, and olive oil in a cold skillet, then bring to medium-low heat for 4 minutes until the garlic turns pale golden and sweet.', timerMinutes: 4 },
      { step: 3, title: 'The 2-Minute Starch Emulsion (Mantecatura)', text: 'Transfer dripping pasta directly into the garlic oil skillet along with 3/4 cup starchy pasta water. Simmer and toss vigorously for 2 minutes until the water and oil emulsify into a creamy glaze.', timerMinutes: 2 },
      { step: 4, title: 'Toss Off-Heat with Grated Cheese', text: 'Remove pan from heat, shower with finely grated Pecorino Romano (and toasted breadcrumbs if using), toss for 30 seconds, and serve immediately.' }
    ],
    chefTips: [
      'The secret to 5-ingredient Italian pantry dinners (like Aglio e Olio, Cacio e Pepe, and Carbonara) is Mantecatura: tossing undercooked pasta in the skillet with starchy water so the sauce thickens naturally.',
      'Always start sliced garlic in cold olive oil—this extracts maximum aroma without turning the edges bitter.'
    ],
    metaDescription: 'Turn 5 everyday pantry staples into restaurant-quality Italian dinners in 20 minutes! Includes our master Pantry Pasta formula, variations, and a free PDF card.',
    focusKeyword: 'italian pantry dinners five everyday ingredients',
    longArticleContent: `## Why the Best Italian Dinners Only Need Five Pantry Ingredients
When your refrigerator looks bare on a busy Tuesday evening, an Italian pantry is a goldmine. Classic dishes like *Spaghetti Aglio, Olio e Peperoncino*, *Cacio e Pepe*, and *Pasta con la Mollica* rely on just **five everyday ingredients** plus culinary technique.`,
    schemaJsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: '5-Ingredient Italian Pantry Pasta',
      description: '20-minute Italian pantry dinner made with 5 everyday ingredients: spaghetti, extra virgin olive oil, shaved garlic, chili flakes, and Pecorino Romano.',
      prepTime: 'PT5M',
      cookTime: 'PT15M',
      totalTime: 'PT20M',
      recipeYield: '4 servings',
      recipeCategory: 'Quick Italian Dinners',
      recipeCuisine: 'Italian'
    },
    pinterestPin: {
      title: '5-Ingredient Italian Pantry Dinners Ready in 20 Minutes!',
      description: 'No grocery trip needed! Make glossy, restaurant-quality Italian pantry dinners with 5 everyday ingredients you already own. Free printable PDF cheat sheet!',
      hashtags: ['#5ingredientmeals', '#pantrypasta', '#quickitaliandinners', '#20minutemeals', '#aglioeolio'],
      overlayHeadline: '5-Ingredient Italian Pantry Dinners',
      board: 'Quick Italian Dinners',
      scheduledTime: 'Tomorrow at 5:30 PM',
      status: 'scheduled'
    },
    wpStatus: 'published',
    wpPostUrl: 'https://foodsprepared.wasmer.app/italian-recipes',
    wpCategory: 'Quick Italian Dinners',
    createdAt: '2026-10-10T12:20:00Z',
    completedAt: '2026-10-10T12:21:00Z',
    healthScore: 100,
    logEntries: ['Priority 5 Article · SEO Angle: budget roundup · Category: Quick Italian Dinners']
  },

  // ===========================================================================
  // PRIORITY 6: What to Do with Leftover Italian Bread
  // ===========================================================================
  {
    id: 'rec-it-prio-06',
    topic: 'What to Do with Leftover Italian Bread',
    title: 'What to Do with Leftover Italian Bread: Tuscan Panzanella, Bruschetta & Crispy Pangrattato',
    slug: 'what-to-do-with-leftover-italian-bread',
    niche: 'Budget-Friendly Italian',
    themeCategory: 'Budget-Friendly Italian',
    italianCategory: 'Budget-Friendly Italian',
    dietary: 'Zero-Waste Kitchen · Vegetarian',
    status: 'completed',
    currentStepIndex: 4,
    progress: 100,
    imageUrl: italianBruschettaImg,
    thumbnailUrl: italianBruschettaImg,
    downloadablePdfUrl: '/api/recipe-print/what-to-do-with-leftover-italian-bread',
    galleryImages: [
      {
        url: italianBruschettaImg,
        caption: 'Photo 1: Grilled Garlic Bruschetta & Panzanella — Toasting stale bread revives its crunch to soak up ripe tomato juices.',
        alt: 'Grilled leftover Italian bread bruschetta with tomatoes and burrata'
      },
      {
        url: italianWhiteBeansImg,
        caption: 'Photo 2: Ribollita & Bean Soup Base — Layering day-old country bread under hot Tuscan white bean soup.',
        alt: 'Tuscan bean soup served with crusty leftover bread'
      },
      {
        url: italianPastaECeciImg,
        caption: 'Photo 3: Golden Garlic Pangrattato ("Poor Man’s Parmesan") — Pulsed stale bread toasted in olive oil and herbs.',
        alt: 'Rustic Italian bread slices alongside pasta bowl'
      }
    ],
    macroPhotoPrompt: 'Appetizing food photography of golden toasted leftover Italian country bread transformed into Tuscan tomato bruschetta and Panzanella salad on an olive wood board, 8k.',
    prepTime: '10 mins',
    cookTime: '10 mins',
    totalTime: '20 mins',
    servings: '4 servings',
    calories: 330,
    difficulty: 'Easy',
    macros: { protein: '11g', carbs: '38g', fat: '15g', fiber: '4g' },
    ingredients: [
      { item: 'Day-Old or Stale Italian Country Loaf', amount: '350g (about 6 thick slices)', notes: 'torn into rustic chunks or slices' },
      { item: 'Ripe Heirloom or Plum Tomatoes', amount: '400g', notes: 'chopped with all their juices' },
      { item: 'Extra Virgin Olive Oil & Red Wine Vinegar', amount: '4 tbsp olive oil, 1.5 tbsp vinegar' },
      { item: 'Fresh Garlic Cloves & Sweet Basil Leaves', amount: '2 cloves garlic, 1 bunch basil' },
      { item: 'Optional Creamy Burrata or Fior di Latte', amount: '150g', notes: 'torn over the warm bread' }
    ],
    instructions: [
      { step: 1, title: 'Toast or Char the Stale Italian Bread', text: 'Tear or slice your leftover Italian bread and toast in a 400°F (200°C) oven or cast-iron skillet with 1 tablespoon of olive oil for 8 minutes until golden and crisp outside.', timerMinutes: 8 },
      { step: 2, title: 'Macerate Tomatoes in Vinegar & Olive Oil', text: 'In a large bowl, toss chopped ripe tomatoes with flaky sea salt, red wine vinegar, crushed garlic, and 3 tablespoons of extra virgin olive oil for 10 minutes to draw out a savory dressing.', timerMinutes: 10 },
      { step: 3, title: 'Toss for Panzanella or Top for Bruschetta', text: 'Toss the toasted bread cubes directly into the tomato juices for 5 minutes so the bread rehydrates into a chewy Tuscan Panzanella (or spoon over whole grilled slices with burrata).', timerMinutes: 2 },
      { step: 4, title: 'Bonus: Save Crumbs for Crispy Pangrattato', text: 'Pulse any remaining bread heels into coarse crumbs and fry in garlic olive oil until golden to sprinkle over pasta as "Poor Man’s Parmesan."' }
    ],
    chefTips: [
      'Stale bread works 10x better than fresh soft bread for Panzanella and Pappa al Pomodoro because dried-out starch absorbs tomato juice and olive oil without turning mushy.',
      'Keep a jar of homemade toasted garlic Pangrattato in the fridge for up to 2 weeks to add instant crunch to any pasta dish.'
    ],
    metaDescription: 'Never waste a loaf! Discover what to do with leftover Italian bread—including 20-minute Tuscan Panzanella, Pappa al Pomodoro, Bruschetta, and Pangrattato (+ PDF).',
    focusKeyword: 'what to do with leftover italian bread',
    longArticleContent: `## Why Stale Bread Is a Treasure in the Italian Kitchen
In Italian homes, throwing away bread is unthinkable. Instead, day-old *pane casareccio* is the secret ingredient behind Tuscany’s most famous dishes: **Panzanella** (summer bread and tomato salad), **Pappa al Pomodoro** (bread-thickened tomato soup), **Ribollita**, and **Pangrattato** (crispy garlic breadcrumbs used to top pasta).`,
    schemaJsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: 'Tuscan Leftover Italian Bread Panzanella & Bruschetta',
      description: 'Clever traditional Italian recipes for leftover bread, including Tuscan Panzanella, garlic bruschetta, and crispy pangrattato.',
      prepTime: 'PT10M',
      cookTime: 'PT10M',
      totalTime: 'PT20M',
      recipeYield: '4 servings',
      recipeCategory: 'Budget-Friendly Italian',
      recipeCuisine: 'Italian'
    },
    pinterestPin: {
      title: 'What to Do with Leftover Italian Bread (5 Genius Italian Recipes!)',
      description: 'Turn stale Italian bread into gourmet Tuscan Panzanella, Pappa al Pomodoro, garlic Bruschetta, and crispy pasta breadcrumbs! Free printable PDF guide.',
      hashtags: ['#leftoverbread', '#panzanella', '#bruschetta', '#zerowastekitchen', '#budgetitalian'],
      overlayHeadline: 'Leftover Italian Bread Recipes',
      board: 'Budget-Friendly Italian',
      scheduledTime: 'Tomorrow at 1:00 PM',
      status: 'scheduled'
    },
    wpStatus: 'published',
    wpPostUrl: 'https://foodsprepared.wasmer.app/italian-recipes',
    wpCategory: 'Budget-Friendly Italian',
    createdAt: '2026-10-10T12:25:00Z',
    completedAt: '2026-10-10T12:26:00Z',
    healthScore: 100,
    logEntries: ['Priority 6 Article · SEO Angle: leftover-ingredient recipes · Category: Budget-Friendly Italian']
  },

  // ===========================================================================
  // PRIORITY 7: Ligurian Pesto Pasta with Potatoes and Green Beans
  // ===========================================================================
  {
    id: 'rec-it-prio-07',
    topic: 'Ligurian Pesto Pasta with Potatoes and Green Beans',
    title: 'Authentic Ligurian Pesto Pasta with Potatoes and Green Beans (Trenette al Pesto)',
    slug: 'ligurian-pesto-pasta-with-potatoes-and-green-beans',
    niche: 'Pasta, Risotto & Gnocchi',
    themeCategory: 'Pasta, Risotto & Gnocchi',
    italianCategory: 'Pasta, Risotto & Gnocchi',
    dietary: 'Vegetarian · Ligurian Regional',
    status: 'completed',
    currentStepIndex: 4,
    progress: 100,
    imageUrl: italianLigurianPestoImg,
    thumbnailUrl: italianLigurianPestoImg,
    downloadablePdfUrl: '/api/recipe-print/ligurian-pesto-pasta-with-potatoes-and-green-beans',
    galleryImages: [
      {
        url: italianLigurianPestoImg,
        caption: 'Photo 1: Classic Genoese Presentation — Trenette pasta, tender potato cubes, and crisp green beans coated in emerald basil pesto.',
        alt: 'Ligurian Pesto Pasta with Potatoes and Green Beans on ceramic plate'
      },
      {
        url: italianPastaPrepImg,
        caption: 'Photo 2: DOP Cheese & Aromatics — Blending Parmigiano-Reggiano and aged Pecorino Fiore Sardo for authentic Pesto Genovese.',
        alt: 'Grating aged Italian cheese for pesto pasta'
      },
      {
        url: italianFrittataImg,
        caption: 'Photo 3: Fresh Market Green Beans — Cooking the green beans and potatoes in the same boiling pot as the pasta.',
        alt: 'Fresh green beans and herbs in Italian kitchen'
      }
    ],
    macroPhotoPrompt: 'Vibrant gourmet food photography of authentic Ligurian Pesto Pasta (Trenette al Pesto Genovese) tossed with tender diced potatoes and crisp green beans, marble mortar and pestle in background, 8k.',
    prepTime: '15 mins',
    cookTime: '12 mins',
    totalTime: '27 mins',
    servings: '4 servings',
    calories: 540,
    difficulty: 'Easy',
    macros: { protein: '16g', carbs: '64g', fat: '24g', fiber: '5g' },
    ingredients: [
      { item: 'Trenette, Trofie, or Linguine Pasta', amount: '400g (14 oz)' },
      { item: 'Yukon Gold Potatoes', amount: '250g (2 medium)', notes: 'peeled and cut into 1.5cm cubes' },
      { item: 'Fresh Tender Green Beans (Haricots Verts)', amount: '200g (7 oz)', notes: 'trimmed and halved' },
      { item: 'Fresh Sweet Basil Leaves', amount: '70g (3 packed cups)' },
      { item: 'Toasted Italian Pine Nuts & 1 Garlic Clove', amount: '40g pine nuts, 1 small clove garlic' },
      { item: 'Parmigiano-Reggiano, Pecorino & Extra Virgin Olive Oil', amount: '60g cheeses, 80ml olive oil' }
    ],
    instructions: [
      { step: 1, title: 'Pulse or Pound the Emerald Pesto Genovese', text: 'In a mortar and pestle (or food processor using short pulses with an ice cube to prevent oxidation), blend basil leaves, pine nuts, garlic, and coarse sea salt. Fold in grated cheeses and extra virgin olive oil until creamy.', timerMinutes: 6 },
      { step: 2, title: 'Boil Potatoes & Pasta in One Single Pot', text: 'Bring a large pot of salted water to a boil. Drop in the cubed Yukon Gold potatoes first for 3 minutes, then add the trenette pasta and trimmed green beans to cook together for 9 minutes.', timerMinutes: 12 },
      { step: 3, title: 'Reserve Starchy Potato-Pasta Water', text: 'Before draining, scoop out 1/2 cup of the extra-starchy potato and pasta cooking water.', timerMinutes: 1 },
      { step: 4, title: 'Toss Off-Heat (Never Cook Fresh Pesto!)', text: 'Transfer the drained pasta, potatoes, and green beans into a warm serving bowl. Add the fresh basil pesto and 3 tablespoons of reserved starchy water, tossing gently until a silky green emulsion coats every strand.' }
    ],
    chefTips: [
      'Boiling the diced potatoes in the same pot as the pasta releases extra potato starch into the water, which binds the basil pesto to the noodles like velvet.',
      'Never heat fresh basil pesto in a hot skillet on the stove—high heat turns bright green basil dark and bitter.'
    ],
    metaDescription: 'Make authentic Ligurian Pesto Pasta with Potatoes and Green Beans (Trenette al Pesto) in one pot! Learn the Genoese secret for bright emerald pesto (+ free PDF).',
    focusKeyword: 'ligurian pesto pasta with potatoes and green beans',
    longArticleContent: `## Trenette al Pesto: The Pride of Genoa and the Italian Riviera
In Liguria, ordering pesto pasta almost always brings a pleasant surprise to first-time visitors: nestled among the ribbons of *trenette* or twisted *trofie* are tender cubes of yellow potato and sweet green beans (*fagiolini*). Cooked together in a single pot, the soft potato starch marries the fragrant basil and pine nut emulsion to the pasta.`,
    schemaJsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: 'Ligurian Pesto Pasta with Potatoes and Green Beans',
      description: 'Traditional Genoese Trenette al Pesto cooked in one pot with diced Yukon Gold potatoes, tender green beans, and fresh basil pine nut pesto.',
      prepTime: 'PT15M',
      cookTime: 'PT12M',
      totalTime: 'PT27M',
      recipeYield: '4 servings',
      recipeCategory: 'Pasta, Risotto & Gnocchi',
      recipeCuisine: 'Italian'
    },
    pinterestPin: {
      title: 'Authentic Ligurian Pesto Pasta with Potatoes & Green Beans (One-Pot!)',
      description: 'Why do Italians boil potatoes and green beans with pesto pasta? Discover the Genoese one-pot secret that makes Trenette al Pesto unimaginably creamy! Free PDF card.',
      hashtags: ['#ligurianpesto', '#pestopasta', '#trenettealpesto', '#regionalitalian', '#pastarecipes'],
      overlayHeadline: 'Ligurian Pesto Pasta with Potatoes',
      board: 'Pasta, Risotto & Gnocchi',
      scheduledTime: 'Tomorrow at 6:00 PM',
      status: 'scheduled'
    },
    wpStatus: 'published',
    wpPostUrl: 'https://foodsprepared.wasmer.app/italian-recipes',
    wpCategory: 'Pasta, Risotto & Gnocchi',
    createdAt: '2026-10-10T12:30:00Z',
    completedAt: '2026-10-10T12:31:00Z',
    healthScore: 100,
    logEntries: ['Priority 7 Article · SEO Angle: regional recipe · Category: Pasta, Risotto & Gnocchi']
  },

  // ===========================================================================
  // PRIORITY 8: Sardinian Fregola with Seafood or Vegetables
  // ===========================================================================
  {
    id: 'rec-it-prio-08',
    topic: 'Sardinian Fregola with Seafood or Vegetables',
    title: 'Sardinian Fregola with Seafood or Summer Vegetables in Saffron-Tomato Brodo',
    slug: 'sardinian-fregola-with-seafood-or-vegetables',
    niche: 'Regional Italian Recipes',
    themeCategory: 'Regional Italian Recipes',
    italianCategory: 'Regional Italian Recipes',
    dietary: 'Sardinian Regional · High Protein',
    status: 'completed',
    currentStepIndex: 4,
    progress: 100,
    imageUrl: italianSardinianFregolaImg,
    thumbnailUrl: italianSardinianFregolaImg,
    downloadablePdfUrl: '/api/recipe-print/sardinian-fregola-with-seafood-or-vegetables',
    galleryImages: [
      {
        url: italianSardinianFregolaImg,
        caption: 'Photo 1: Toasted Sardinian Fregola Sarda — Simmered risotto-style with clams, zucchini blossoms, cherry tomatoes, and saffron.',
        alt: 'Bowl of Sardinian Fregola with Seafood and Vegetables'
      },
      {
        url: italianBruschettaImg,
        caption: 'Photo 2: Sun-Ripened Cherry Tomatoes & White Wine — Building the aromatic Mediterranean brodo.',
        alt: 'Mediterranean tomatoes and white wine on coastal table'
      },
      {
        url: italianLigurianPestoImg,
        caption: 'Photo 3: Pure Garden Vegetable Option — Swap clams for diced zucchini, chickpeas, and fresh herbs.',
        alt: 'Vibrant Italian vegetable pasta presentation'
      }
    ],
    macroPhotoPrompt: 'Stunning gourmet food photography of Sardinian Fregola with clams, zucchini blossoms, and cherry tomatoes in a golden saffron white wine broth, coastal trattoria table, 8k.',
    prepTime: '15 mins',
    cookTime: '18 mins',
    totalTime: '33 mins',
    servings: '4 servings',
    calories: 470,
    difficulty: 'Medium',
    macros: { protein: '28g', carbs: '54g', fat: '14g', fiber: '5g' },
    ingredients: [
      { item: 'Toasted Sardinian Fregola Sarda (Medium Pearls)', amount: '320g (11 oz)' },
      { item: 'Fresh Manila Clams or Mussels (OR Diced Zucchini & Chickpeas)', amount: '800g clams (or 3 cups vegetables)' },
      { item: 'Halved Datterini or Cherry Tomatoes', amount: '250g' },
      { item: 'Dry Vermentino White Wine & Warm Broth', amount: '120ml wine, 750ml seafood or vegetable broth' },
      { item: 'Saffron Threads', amount: '1 generous pinch', notes: 'bloomed in 2 tbsp warm broth' },
      { item: 'Fresh Garlic, Parsley, Chili Flakes & Olive Oil', amount: '3 cloves garlic, 1/2 cup parsley, 3 tbsp EVOO' }
    ],
    instructions: [
      { step: 1, title: 'Steam Open Clams (or Sear Vegetables)', text: 'In a wide sauté pan, heat 2 tablespoons olive oil with 1 smashed garlic clove and parsley stems. Add clams and white wine, cover for 4 minutes until shells pop open, then transfer clams to a bowl and strain the savory wine juices.', timerMinutes: 5 },
      { step: 2, title: 'Toast Fregola with Tomatoes & Saffron', text: 'In the same pan, sauté remaining minced garlic and halved cherry tomatoes for 2 minutes. Stir in dry toasted Fregola pearls for 1 minute to coat in oil.', timerMinutes: 3 },
      { step: 3, title: 'Simmer Risotto-Style in Saffron Brodo', text: 'Pour in the strained clam wine juices, bloomed saffron, and warm broth. Simmer uncovered for 12 to 14 minutes until the fregola is tender and surrounded by a spoonable golden brodo.', timerMinutes: 13 },
      { step: 4, title: 'Return Seafood/Vegetables & Garnish', text: 'Fold the clams (or roasted zucchini and blossoms) back into the pot for 1 minute to warm through. Shower with chopped parsley, lemon zest, and extra virgin olive oil.' }
    ],
    chefTips: [
      'Fregola Sarda is rolled from semolina dough and oven-toasted in Sardinia, giving it a nutty flavor that absorbs saffron broth like risotto without constant stirring.',
      'For a 100% plant-based Sardinian dinner (`Fregola con Verdure`), replace the clams with diced zucchini, asparagus tips, and a can of chickpeas.'
    ],
    metaDescription: 'Discover Sardinian Fregola with Seafood or Vegetables—nutty toasted pearl pasta simmered in a golden saffron, white wine, and cherry tomato brodo (+ free PDF).',
    focusKeyword: 'sardinian fregola with seafood or vegetables',
    longArticleContent: `## Fregola Sarda: Sardinia’s Ancient Toasted Pearl Pasta
Crafted in Sardinia for over a thousand years, **Fregola** consists of tiny hand-rolled balls of coarse durum wheat semolina that are toasted in an oven until golden brown. That toasting process gives Fregola a nutty depth of flavor that shines in both coastal clam broths (*Fregola con Arselle*) and garden vegetable stews.`,
    schemaJsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: 'Sardinian Fregola with Seafood or Vegetables',
      description: 'Authentic Sardinian toasted Fregola pearl pasta simmered in a saffron, white wine, and cherry tomato broth with clams or Mediterranean vegetables.',
      prepTime: 'PT15M',
      cookTime: 'PT18M',
      totalTime: 'PT33M',
      recipeYield: '4 servings',
      recipeCategory: 'Regional Italian Recipes',
      recipeCuisine: 'Italian'
    },
    pinterestPin: {
      title: 'Authentic Sardinian Fregola with Clams or Vegetables (Saffron Brodo!)',
      description: 'Fall in love with Sardinia’s nutty toasted pearl pasta! Simmered risotto-style with cherry tomatoes, saffron, white wine, and seafood or garden veggies. Free PDF!',
      hashtags: ['#fregola', '#sardinianfood', '#regionalitalian', '#seafoodpasta', '#mediterraneandinner'],
      overlayHeadline: 'Sardinian Fregola in Saffron Brodo',
      board: 'Regional Italian Recipes',
      scheduledTime: 'Tomorrow at 7:00 PM',
      status: 'scheduled'
    },
    wpStatus: 'published',
    wpPostUrl: 'https://foodsprepared.wasmer.app/italian-recipes',
    wpCategory: 'Regional Italian Recipes',
    createdAt: '2026-10-10T12:35:00Z',
    completedAt: '2026-10-10T12:36:00Z',
    healthScore: 100,
    logEntries: ['Priority 8 Article · SEO Angle: regional recipe · Category: Regional Italian Recipes']
  },

  // ===========================================================================
  // PRIORITY 9: High-Protein Chicken Pesto Pasta for Meal Prep
  // ===========================================================================
  {
    id: 'rec-it-prio-09',
    topic: 'High-Protein Chicken Pesto Pasta for Meal Prep',
    title: 'High-Protein Chicken Pesto Pasta with White Beans & Green Beans (44g Protein Meal Prep)',
    slug: 'high-protein-chicken-pesto-pasta-for-meal-prep',
    niche: 'Protein-Rich Italian Meals',
    themeCategory: 'Protein-Rich Italian Meals',
    italianCategory: 'Protein-Rich Italian Meals',
    dietary: 'High-Protein · Meal Prep (44g Protein)',
    status: 'completed',
    currentStepIndex: 4,
    progress: 100,
    imageUrl: italianLigurianPestoImg,
    thumbnailUrl: italianLigurianPestoImg,
    downloadablePdfUrl: '/api/recipe-print/high-protein-chicken-pesto-pasta-for-meal-prep',
    galleryImages: [
      {
        url: italianLigurianPestoImg,
        caption: 'Photo 1: Balanced Pesto Pasta Bowl — Emerald basil pesto tossed with high-protein pasta, crisp green beans, and herbs.',
        alt: 'High-Protein Pesto Pasta with green beans'
      },
      {
        url: salmonBowlImg,
        caption: 'Photo 2: 4-Day Meal Prep Containers — Stores and reheats cleanly for high-protein work lunches without drying out.',
        alt: 'High-protein meal prep bowl presentation'
      },
      {
        url: italianPastaPrepImg,
        caption: 'Photo 3: Protein Boosters — Combining seared garlic-herb chicken breast, Parmigiano-Reggiano, and blended white beans.',
        alt: 'Fresh Italian protein and cheese ingredients'
      }
    ],
    macroPhotoPrompt: 'Vibrant gourmet food photography of High-Protein Chicken Pesto Pasta with seared golden chicken breast strips, crisp green beans, cherry tomatoes, and glossy basil pesto, 8k.',
    prepTime: '10 mins',
    cookTime: '15 mins',
    totalTime: '25 mins',
    servings: '4 meal-prep bowls',
    calories: 530,
    difficulty: 'Easy',
    macros: { protein: '44g', carbs: '46g', fat: '18g', fiber: '7g' },
    ingredients: [
      { item: 'Boneless Skinless Chicken Breasts', amount: '600g (1.3 lbs)', notes: 'cut into bite-sized medallions' },
      { item: 'Bronze-Die Short Pasta (Fusilli, Penne, or Chickpea Pasta)', amount: '320g (11 oz)' },
      { item: 'Fresh Green Beans (Trimmed & Halved)', amount: '200g' },
      { item: 'Fresh Basil Pesto Genovese', amount: '120g (1/2 cup)' },
      { item: 'Secret Meal-Prep Creamy Booster: Cannellini Beans or Greek Yogurt', amount: '1/3 cup blended with pasta water', notes: 'keeps pesto creamy for 4 days in fridge' },
      { item: 'Grated Parmigiano-Reggiano & Cherry Tomatoes', amount: '40g Parmigiano, 1 cup tomatoes' }
    ],
    instructions: [
      { step: 1, title: 'Pan-Sear the Italian Herb Chicken', text: 'Season chicken medallions with Italian oregano, garlic powder, sea salt, and black pepper. Sear in 1 tablespoon olive oil over medium-high heat for 6 minutes until golden and cooked through (165°F).', timerMinutes: 6 },
      { step: 2, title: 'Boil Pasta & Green Beans Together', text: 'Cook fusilli or penne in salted boiling water for 9 minutes, tossing in the green beans for the final 3 minutes so they stay bright green and crisp-tender. Reserve 1/2 cup pasta water.', timerMinutes: 9 },
      { step: 3, title: 'Whisk the No-Split Meal-Prep Pesto Sauce', text: 'Whisk basil pesto with 3 tablespoons of warm starchy pasta water (plus 2 tablespoons blended white beans or ricotta) so the sauce stays creamy and never separates when reheated.', timerMinutes: 2 },
      { step: 4, title: 'Combine & Portion into 4 Glass Containers', text: 'Toss warm pasta, green beans, seared chicken, and halved cherry tomatoes with the creamy pesto emulsion. Divide into 4 airtight meal-prep containers for up to 4 days.' }
    ],
    chefTips: [
      'Why Meal-Prep Pesto Usually Gets Oily: Straight oil-based pesto separates when microwaved. Emulsifying it with starchy pasta water and a spoonful of blended white beans or ricotta locks in a creamy texture all week!',
      'Enjoy cold as an Italian pasta salad or reheat for 90 seconds with a splash of water.'
    ],
    metaDescription: 'Pack 44g of protein into your lunches with this 25-minute High-Protein Chicken Pesto Pasta for Meal Prep! Stays creamy for 4 days. Includes free PDF card.',
    focusKeyword: 'high protein chicken pesto pasta for meal prep',
    longArticleContent: `## The Ultimate High-Protein Italian Meal Prep (44g Protein Per Bowl)
Traditional Italian flavors meet smart macronutrient balance in this **High-Protein Chicken Pesto Pasta**. By pairing lean garlic-seared chicken breast with Ligurian-style green beans, bronze-die pasta, and our anti-separation pesto emulsion trick, you get four lunches that taste freshly cooked on day four.`,
    schemaJsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: 'High-Protein Chicken Pesto Pasta for Meal Prep',
      description: '25-minute high-protein Italian chicken pesto pasta with green beans and cherry tomatoes—44g protein per serving, engineered for 4-day meal prep.',
      prepTime: 'PT10M',
      cookTime: 'PT15M',
      totalTime: 'PT25M',
      recipeYield: '4 servings',
      recipeCategory: 'Protein-Rich Italian Meals',
      recipeCuisine: 'Italian'
    },
    pinterestPin: {
      title: '44g High-Protein Chicken Pesto Pasta for Meal Prep (25 Mins!)',
      description: 'The best high-protein Italian lunch meal prep! Juicy herb chicken, crisp green beans, and creamy basil pesto that never gets oily when reheated. Free PDF!',
      hashtags: ['#highproteinmealprep', '#chickenpestopasta', '#proteinpasta', '#healthyitalian', '#mealprepideas'],
      overlayHeadline: '44g Protein Chicken Pesto Pasta',
      board: 'Protein-Rich Italian Meals',
      scheduledTime: 'Sunday at 4:00 PM',
      status: 'scheduled'
    },
    wpStatus: 'published',
    wpPostUrl: 'https://foodsprepared.wasmer.app/italian-recipes',
    wpCategory: 'Protein-Rich Italian Meals',
    createdAt: '2026-10-10T12:40:00Z',
    completedAt: '2026-10-10T12:41:00Z',
    healthScore: 100,
    logEntries: ['Priority 9 Article · SEO Angle: protein + meal prep · Category: Protein-Rich Italian Meals']
  },

  // ===========================================================================
  // PRIORITY 10: An Easy Italian Lentil and Tomato Ragù
  // ===========================================================================
  {
    id: 'rec-it-prio-10',
    topic: 'An Easy Italian Lentil and Tomato Ragù',
    title: 'An Easy Italian Lentil and Tomato Ragù (Rich, Meaty & Budget-Friendly Bolognese)',
    slug: 'easy-italian-lentil-and-tomato-ragu',
    niche: 'Budget-Friendly Italian',
    themeCategory: 'Budget-Friendly Italian',
    italianCategory: 'Budget-Friendly Italian',
    dietary: 'Plant-Based · High-Fiber · Budget',
    status: 'completed',
    currentStepIndex: 4,
    progress: 100,
    imageUrl: italianLentilRaguImg,
    thumbnailUrl: italianLentilRaguImg,
    downloadablePdfUrl: '/api/recipe-print/easy-italian-lentil-and-tomato-ragu',
    galleryImages: [
      {
        url: italianLentilRaguImg,
        caption: 'Photo 1: Rich Lentil Ragù Over Pappardelle — Slow-simmered brown lentils, carrots, celery, red wine, and San Marzano tomatoes.',
        alt: 'Bowl of Italian Lentil and Tomato Ragu over pappardelle pasta'
      },
      {
        url: italianWhiteBeansImg,
        caption: 'Photo 2: Deep Soffritto & Tomato Reduction — Simmering lentils directly in the tomato-wine broth infuses every grain.',
        alt: 'Simmering tomato and legume sauce in terracotta pot'
      },
      {
        url: italianLasagnaImg,
        caption: 'Photo 3: Perfect for Baked Lasagna or Polenta — Use this economical lentil ragù in lasagnas, baked ziti, or over creamy polenta.',
        alt: 'Baked Italian pasta layers with rich ragu'
      }
    ],
    macroPhotoPrompt: 'Appetizing close-up food photography of hearty Italian Lentil and Tomato Ragu spooned over ribbons of pappardelle pasta, topped with freshly grated Parmigiano-Reggiano and thyme, 8k.',
    prepTime: '10 mins',
    cookTime: '30 mins',
    totalTime: '40 mins',
    servings: '6 servings ($1.40/serving)',
    calories: 450,
    difficulty: 'Easy',
    macros: { protein: '21g', carbs: '66g', fat: '10g', fiber: '12g' },
    ingredients: [
      { item: 'Dried Brown or Green Castelluccio Lentils (or 2 cans cooked)', amount: '220g (1 cup dried)', notes: 'rinsed' },
      { item: 'Finely Minced Soffritto (1 Onion, 2 Carrots, 2 Celery Stalks)', amount: '2 cups total' },
      { item: 'Tomato Paste & Crushed San Marzano Tomatoes', amount: '2 tbsp paste, 1 can (400g) crushed' },
      { item: 'Dry Red Wine (or Balsamic Vinegar Splash)', amount: '120ml (1/2 cup)' },
      { item: 'Vegetable Broth, Rosemary, Bay Leaf & Garlic', amount: '3 cups broth, 3 cloves garlic' },
      { item: 'Pappardelle, Tagliatelle, or Rigatoni Pasta', amount: '450g (1 lb)' }
    ],
    instructions: [
      { step: 1, title: 'Caramelize the Finely Minced Soffritto', text: 'Warm 3 tablespoons olive oil in a Dutch oven over medium heat. Cook finely minced onion, carrot, and celery for 8 minutes until golden and sweet.', timerMinutes: 8 },
      { step: 2, title: 'Toast Tomato Paste & Deglaze with Red Wine', text: 'Add minced garlic, rosemary, and tomato paste; stir for 2 minutes until brick-red. Pour in dry red wine and simmer until reduced by half.', timerMinutes: 4 },
      { step: 3, title: 'Simmer Lentils Until Tender & Velvety', text: 'Add rinsed brown lentils, crushed tomatoes, bay leaf, and 3 cups warm broth. Simmer gently covered for 22 to 25 minutes until lentils are tender and the sauce is thick and glossy.', timerMinutes: 24 },
      { step: 4, title: 'Toss with Al Dente Pasta & Parmigiano', text: 'Toss the bubbling lentil ragù with al dente pappardelle or rigatoni, a splash of pasta water, and freshly grated Parmigiano-Reggiano (or nutritional yeast/olive oil for vegan).' }
    ],
    chefTips: [
      'Cut your carrot, celery, and onion into tiny lentil-sized dice (brunoise) so the vegetables and lentils merge into a single unified, meaty Bolognese texture.',
      'This ragù freezes beautifully for up to 3 months—make a double batch for effortless weeknight pasta or lasagna!'
    ],
    metaDescription: 'Rich, hearty, and $1.40 per serving! Make this Easy Italian Lentil and Tomato Ragù in 40 minutes with pantry lentils, soffritto, and red wine. Free PDF card!',
    focusKeyword: 'easy italian lentil and tomato ragu',
    longArticleContent: `## Why Umbrian & Castelluccio Lentils Make a Show-Stopping Italian Ragù
Across central Italy—especially in Umbria and the plains of Castelluccio di Norcia—tiny, thin-skinned lentils are simmered with *soffritto*, red wine, and tomatoes into a ragù so rich and savory that even devoted meat lovers ask for seconds.`,
    schemaJsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: 'An Easy Italian Lentil and Tomato Ragù',
      description: 'Hearty, economical Italian lentil Bolognese ragù simmered with carrot-celery soffritto, red wine, herbs, and San Marzano tomatoes.',
      prepTime: 'PT10M',
      cookTime: 'PT30M',
      totalTime: 'PT40M',
      recipeYield: '6 servings',
      recipeCategory: 'Budget-Friendly Italian',
      recipeCuisine: 'Italian'
    },
    pinterestPin: {
      title: 'Easy One-Pot Italian Lentil & Tomato Ragù ($1.40/Serving!)',
      description: 'Unbelievably rich, meaty texture made from humble pantry lentils, soffritto, and San Marzano tomatoes! Perfect over pappardelle or rigatoni. Free PDF recipe card!',
      hashtags: ['#lentilragu', '#lentilbolognese', '#budgetitalian', '#plantbaseditalian', '#legumerecipes'],
      overlayHeadline: 'Easy Italian Lentil Ragù',
      board: 'Budget-Friendly Italian',
      scheduledTime: 'Tomorrow at 6:30 PM',
      status: 'scheduled'
    },
    wpStatus: 'published',
    wpPostUrl: 'https://foodsprepared.wasmer.app/italian-recipes',
    wpCategory: 'Budget-Friendly Italian',
    createdAt: '2026-10-10T12:45:00Z',
    completedAt: '2026-10-10T12:46:00Z',
    healthScore: 100,
    logEntries: ['Priority 10 Article · SEO Angle: legumes + economical meals · Category: Budget-Friendly Italian']
  },

  // ===========================================================================
  // PRIORITY 11: Air-Fryer Italian Frittata with Green Beans
  // ===========================================================================
  {
    id: 'rec-it-prio-11',
    topic: 'Air-Fryer Italian Frittata with Green Beans',
    title: '20-Minute Air-Fryer Italian Frittata with Green Beans, Herbs & Pecorino',
    slug: 'air-fryer-italian-frittata-with-green-beans',
    niche: 'Quick Italian Dinners',
    themeCategory: 'Quick Italian Dinners',
    italianCategory: 'Quick Italian Dinners',
    dietary: 'Gluten-Free · High-Protein · Air Fryer',
    status: 'completed',
    currentStepIndex: 4,
    progress: 100,
    imageUrl: italianFrittataImg,
    thumbnailUrl: italianFrittataImg,
    downloadablePdfUrl: '/api/recipe-print/air-fryer-italian-frittata-with-green-beans',
    galleryImages: [
      {
        url: italianFrittataImg,
        caption: 'Photo 1: Golden Puffy Air-Fryer Frittata — Tender green beans, caramelized shallots, and Pecorino baked to a soufflé-like puff.',
        alt: 'Sliced Air-Fryer Italian Frittata with Green Beans on ceramic platter'
      },
      {
        url: italianPastaPrepImg,
        caption: 'Photo 2: Farm-Fresh Eggs & Aged Cheese — Whisking whole eggs with a splash of milk and micro-grated Pecorino Romano.',
        alt: 'Fresh egg yolks and grated cheese on marble counter'
      },
      {
        url: italianBruschettaImg,
        caption: 'Photo 3: Serve Hot or Room Temperature — Pair wedges with crusty bread or stuff into a warm Italian panino for lunch.',
        alt: 'Italian dining table with tomato bruschetta side'
      }
    ],
    macroPhotoPrompt: 'Mouth-watering close-up food photography of golden puffy Italian Frittata with tender green beans, shallots, fresh basil, and Pecorino cheese, sliced into wedges on a rustic ceramic plate, 8k.',
    prepTime: '5 mins',
    cookTime: '14 mins',
    totalTime: '19 mins',
    servings: '4 servings',
    calories: 290,
    difficulty: 'Easy',
    macros: { protein: '22g', carbs: '8g', fat: '19g', fiber: '3g' },
    ingredients: [
      { item: 'Large Farm Eggs', amount: '6 whole eggs' },
      { item: 'Cooked or Blanched Green Beans (Cut into 2cm Pieces)', amount: '1.5 cups (200g)', notes: 'great way to use leftover green beans' },
      { item: 'Grated Pecorino Romano or Parmigiano-Reggiano', amount: '50g (1/2 cup)' },
      { item: 'Ricotta Cheese or Whole Milk', amount: '3 tbsp', notes: 'keeps the air-fryer custard ultra-tender' },
      { item: 'Thinly Sliced Shallot or Sweet Onion & Garlic', amount: '1 shallot, 1 clove garlic' },
      { item: 'Fresh Basil, Flat-Leaf Parsley & Olive Oil', amount: '2 tbsp herbs, 1 tbsp olive oil' }
    ],
    instructions: [
      { step: 1, title: 'Preheat Air Fryer & Grease Cake Pan', text: 'Preheat your air fryer to 350°F (175°C). Brush a 7-inch or 8-inch round oven-safe cake pan, pie dish, or silicone liner with 1 tablespoon of olive oil.', timerMinutes: 2 },
      { step: 2, title: 'Whisk the Creamy Egg & Pecorino Custard', text: 'In a mixing bowl, whisk the 6 eggs, ricotta (or milk), grated Pecorino Romano, chopped basil, parsley, sea salt, and black pepper until frothy.', timerMinutes: 3 },
      { step: 3, title: 'Fold in Green Beans & Shallots', text: 'Stir the tender green beans and thinly sliced shallots into the egg mixture and pour into the prepared pan.', timerMinutes: 1 },
      { step: 4, title: 'Air-Fry at 350°F for 12–14 Minutes', text: 'Place the pan in the air-fryer basket and cook at 350°F (175°C) for 12 to 14 minutes until puffed, golden brown on top, and just set in the center. Slice into wedges and serve warm or at room temperature.', timerMinutes: 13 }
    ],
    chefTips: [
      'Why the Air Fryer Makes a Better Frittata: Circulating convection heat cooks the top and bottom evenly without ever having to flip the frittata on the stove!',
      'In Italy, cold frittata wedges stuffed inside crusty bread (Panino con la Frittata) are the #1 picnic and work lunch.'
    ],
    metaDescription: 'Make a fluffy, golden Air-Fryer Italian Frittata with Green Beans and Pecorino in under 20 minutes—no flipping required! High-protein, gluten-free, with free PDF.',
    focusKeyword: 'air fryer italian frittata with green beans',
    longArticleContent: `## Hands-Free Weeknight Magic: Air-Fryer Italian Frittata
In Italian households, a **Frittata** is the ultimate weeknight hero—turning a handful of cooked green beans, zucchini, or herbs and half a dozen eggs into a satisfying dinner in minutes. Using the air fryer eliminates stove-top flipping and bakes the custard into a golden, soufflé-like crown.`,
    schemaJsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: 'Air-Fryer Italian Frittata with Green Beans',
      description: '19-minute hands-free Air-Fryer Italian Frittata loaded with tender green beans, shallots, fresh herbs, ricotta, and Pecorino Romano.',
      prepTime: 'PT5M',
      cookTime: 'PT14M',
      totalTime: 'PT19M',
      recipeYield: '4 servings',
      recipeCategory: 'Quick Italian Dinners',
      recipeCuisine: 'Italian'
    },
    pinterestPin: {
      title: '15-Min Air-Fryer Italian Frittata with Green Beans (No Flipping!)',
      description: 'Fluffy, golden, and packed with 22g protein! How to bake an authentic Italian green bean and Pecorino frittata right in your air fryer. Free printable PDF card!',
      hashtags: ['#airfryerfrittata', '#italianfrittata', '#quickitaliandinners', '#greenbeanrecipes', '#highprotein'],
      overlayHeadline: 'Air-Fryer Italian Frittata',
      board: 'Quick Italian Dinners',
      scheduledTime: 'Tomorrow at 8:00 AM',
      status: 'scheduled'
    },
    wpStatus: 'published',
    wpPostUrl: 'https://foodsprepared.wasmer.app/italian-recipes',
    wpCategory: 'Quick Italian Dinners',
    createdAt: '2026-10-10T12:50:00Z',
    completedAt: '2026-10-10T12:51:00Z',
    healthScore: 100,
    logEntries: ['Priority 11 Article · SEO Angle: appliance-specific recipe · Category: Quick Italian Dinners']
  },

  // ===========================================================================
  // PRIORITY 12: Abruzzese Crespelle in Brodo: A Regional Italian Recipe
  // ===========================================================================
  {
    id: 'rec-it-prio-12',
    topic: 'Abruzzese Crespelle in Brodo: A Regional Italian Recipe',
    title: 'Abruzzese Scrippelle ’Mbusse (Crespelle in Brodo): Authentic Regional Italian Recipe',
    slug: 'abruzzese-crespelle-in-brodo-regional-italian-recipe',
    niche: 'Regional Italian Recipes',
    themeCategory: 'Regional Italian Recipes',
    italianCategory: 'Regional Italian Recipes',
    dietary: 'Abruzzo Regional Heritage',
    status: 'completed',
    currentStepIndex: 4,
    progress: 100,
    imageUrl: italianSardinianFregolaImg,
    thumbnailUrl: italianSardinianFregolaImg,
    downloadablePdfUrl: '/api/recipe-print/abruzzese-crespelle-in-brodo-regional-italian-recipe',
    galleryImages: [
      {
        url: italianPastaPrepImg,
        caption: 'Photo 1: Whisper-Thin Egg Batter & Aged Cheese — Whisking farm eggs, flour, water, and freshly grated Pecorino/Parmigiano.',
        alt: 'Fresh Italian eggs and grated cheese on marble counter'
      },
      {
        url: italianFrittataImg,
        caption: 'Photo 2: Cooking Paper-Thin Scrippelle — Swirling the delicate crêpes in a lightly greased skillet for 60 seconds.',
        alt: 'Golden thin Italian egg crepes on ceramic plate'
      },
      {
        url: italianSardinianFregolaImg,
        caption: 'Photo 3: Rolled with Cheese & Drowned in Golden Brodo — Served steaming hot in aromatic chicken or vegetable broth.',
        alt: 'Warm Italian broth bowl in rustic dining room'
      }
    ],
    macroPhotoPrompt: 'Authentic regional Italian food photography of Abruzzese Scrippelle Mbusse (delicate rolled egg crespelle filled with Pecorino and Parmigiano floating in clear golden chicken brodo), dusted with nutmeg and parsley, 8k.',
    prepTime: '20 mins',
    cookTime: '15 mins',
    totalTime: '35 mins',
    servings: '4 servings',
    calories: 380,
    difficulty: 'Medium',
    macros: { protein: '23g', carbs: '26g', fat: '18g', fiber: '1g' },
    ingredients: [
      { item: 'Large Farm Eggs', amount: '4 whole eggs', notes: 'at room temperature' },
      { item: 'All-Purpose or Italian Tipo 00 Flour', amount: '125g (1 cup)' },
      { item: 'Filtered Water', amount: '250ml (1 cup)', notes: 'Abruzzo tradition uses water instead of milk for lighter crêpes!' },
      { item: 'Grated Pecorino Abruzzese & Parmigiano-Reggiano Mix', amount: '120g (1.25 cups)', notes: 'for rolling inside the crespelle' },
      { item: 'Rich Golden Chicken or Vegetable Brodo (Broth)', amount: '1.2 liters (5 cups)', notes: 'piping hot' },
      { item: 'Freshly Grated Nutmeg & Finely Chopped Parsley', amount: '1/4 tsp nutmeg, 1 tbsp parsley' }
    ],
    instructions: [
      { step: 1, title: 'Whisk the Traditional Water-and-Egg Batter', text: 'Whisk the 4 eggs with a pinch of salt and freshly grated nutmeg. Sift in the flour, then slowly stream in 1 cup of water while whisking until smooth. Rest the batter for 20 minutes.', timerMinutes: 20 },
      { step: 2, title: 'Swirl Paper-Thin Scrippelle (Crespelle)', text: 'Heat an 8-inch nonstick or seasoned crêpe pan over medium heat and rub lightly with butter or bacon fat. Pour 3 tablespoons of batter, swirling immediately into a paper-thin circle. Cook 45 seconds per side until lightly golden. Repeat to make 12 crespelle.', timerMinutes: 10 },
      { step: 3, title: 'Fill & Roll with Pecorino-Parmigiano', text: 'Sprinkle 1.5 tablespoons of the grated Pecorino and Parmigiano blend across each warm crespella and roll up tightly like a cigar.', timerMinutes: 3 },
      { step: 4, title: 'Drown in Steaming Golden Brodo (’Mbusse)', text: 'Arrange 3 rolled crespelle in each warm soup bowl. Ladle piping-hot golden broth over the top so the cheese melts inside the delicate rolls. Serve immediately.' }
    ],
    chefTips: [
      'Why Abruzzese Scrippelle Use Water Instead of Milk: Using water in the batter makes the crêpes ultra-light and porous so they soak up the savory broth without falling apart.',
      'In Teramo (Abruzzo), Scrippelle ’Mbusse ("wet crêpes") is the crown jewel of Sunday and holiday tables—yet it uses the simplest budget ingredients in the kitchen!'
    ],
    metaDescription: 'Discover Abruzzese Crespelle in Brodo (Scrippelle ’Mbusse)—delicate cheese-rolled Italian crêpes bathed in golden broth. A hidden regional treasure (+ free PDF)!',
    focusKeyword: 'abruzzese crespelle in brodo regional italian recipe',
    longArticleContent: `## Scrippelle ’Mbusse: Teramo’s Hidden Culinary Jewel
High in the mountainous region of **Abruzzo**, the city of Teramo guards one of Italy’s most comforting and under-covered regional recipes: **Scrippelle ’Mbusse** (known across Italy as *Crespelle in Brodo*). Delicate, paper-thin egg crêpes are rolled around aged Pecorino and Parmigiano cheese, then "drowned" (*’mbusse* in local dialect) in crystal-clear golden broth.`,
    schemaJsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: 'Abruzzese Crespelle in Brodo (Scrippelle ’Mbusse)',
      description: 'Traditional regional recipe from Teramo, Abruzzo featuring paper-thin egg crespelle rolled with Pecorino and Parmigiano cheese and served in hot golden broth.',
      prepTime: 'PT20M',
      cookTime: 'PT15M',
      totalTime: 'PT35M',
      recipeYield: '4 servings',
      recipeCategory: 'Regional Italian Recipes',
      recipeCuisine: 'Italian'
    },
    pinterestPin: {
      title: 'Abruzzese Crespelle in Brodo (Cheese-Stuffed Italian Crêpes in Broth!)',
      description: 'Have you ever tried Scrippelle ’Mbusse from Abruzzo? Paper-thin Italian egg crêpes rolled with melted Pecorino cheese and served in golden broth! Free PDF card.',
      hashtags: ['#crespelle', '#abruzzofood', '#regionalitalian', '#italiansoup', '#scrippellembusse'],
      overlayHeadline: 'Abruzzese Crespelle in Brodo',
      board: 'Regional Italian Recipes',
      scheduledTime: 'Sunday at 1:00 PM',
      status: 'scheduled'
    },
    wpStatus: 'published',
    wpPostUrl: 'https://foodsprepared.wasmer.app/italian-recipes',
    wpCategory: 'Regional Italian Recipes',
    createdAt: '2026-10-10T12:55:00Z',
    completedAt: '2026-10-10T12:56:00Z',
    healthScore: 100,
    logEntries: ['Priority 12 Article · SEO Angle: less-covered regional dish · Category: Regional Italian Recipes']
  }
];

export const NICHE_PRESETS = [
  {
    niche: 'Budget-Friendly Italian',
    description: 'Pasta e ceci, pasta e fagioli, pantry pasta, lentils, white beans, leftover bread dishes and inexpensive family meals',
    examples: [
      'What Is Cucina Povera? Traditional Italian Cooking on a Budget',
      'Easy Pasta e Ceci with Canned Chickpeas',
      'What to Do with Leftover Italian Bread',
      'An Easy Italian Lentil and Tomato Ragù'
    ]
  },
  {
    niche: 'Quick Italian Dinners',
    description: '20–30-minute dinners, simple sauces, one-pan dishes, and recipes for busy evenings',
    examples: [
      'Italian Pantry Dinners Made with Five Everyday Ingredients',
      'Air-Fryer Italian Frittata with Green Beans'
    ]
  },
  {
    niche: 'Pasta, Risotto & Gnocchi',
    description: 'Pasta shapes and sauces, risotto, homemade gnocchi, baked pasta and traditional combinations',
    examples: [
      'Ligurian Pesto Pasta with Potatoes and Green Beans',
      'Authentic Roman Spaghetti alla Carbonara'
    ]
  },
  {
    niche: 'Regional Italian Recipes',
    description: 'Dedicated collections for Sicily, Calabria, Liguria, Sardinia, Abruzzo, Tuscany and other regions',
    examples: [
      'Sardinian Fregola with Seafood or Vegetables',
      'Abruzzese Crespelle in Brodo: A Regional Italian Recipe'
    ]
  },
  {
    niche: 'Soups, Beans & Vegetables',
    description: 'Minestrone, bean soups, vegetable stews, salads, Italian side dishes and legume-based meals',
    examples: [
      'Tuscan-Style White Beans with Tomatoes and Rosemary',
      'Pasta e Fagioli: An Easy Italian Pasta and Bean Soup'
    ]
  },
  {
    niche: 'Protein-Rich Italian Meals',
    description: 'Chicken and seafood dinners, bean-based meals, balanced pasta dishes, and recipes that store well for lunches',
    examples: [
      'High-Protein Chicken Pesto Pasta for Meal Prep',
      'Sardinian Fregola with Seafood or Vegetables'
    ]
  }
];

export const DEFAULT_WP_CONFIG: WordPressConfig = {
  url: 'https://foodsprepared.wasmer.app',
  username: 'elattarayman1@gmail.com',
  appPassword: (import.meta as any).env?.VITE_WP_APP_PASSWORD || '',
  syncApiKey: (import.meta as any).env?.VITE_WP_AUTOSYNC_SECRET || '',
  useAutoSyncPlugin: true,
  defaultStatus: 'publish',
  isConnected: true,
  activeCategories: [
    { id: 84, name: 'Budget-Friendly Italian', slug: 'budget-friendly-italian', count: 4 },
    { id: 85, name: 'Quick Italian Dinners', slug: 'quick-italian-dinners', count: 2 },
    { id: 86, name: 'Pasta, Risotto & Gnocchi', slug: 'pasta-risotto-gnocchi', count: 1 },
    { id: 87, name: 'Regional Italian Recipes', slug: 'regional-italian-recipes', count: 2 },
    { id: 88, name: 'Soups, Beans & Vegetables', slug: 'soups-beans-vegetables', count: 2 },
    { id: 89, name: 'Protein-Rich Italian Meals', slug: 'protein-rich-italian-meals', count: 1 }
  ]
};

export const DEFAULT_PINTEREST_CONFIG: PinterestConfig = {
  defaultBoard: 'Budget-Friendly Italian',
  boards: [
    'Budget-Friendly Italian',
    'Quick Italian Dinners',
    'Pasta, Risotto & Gnocchi',
    'Regional Italian Recipes',
    'Soups, Beans & Vegetables',
    'Protein-Rich Italian Meals'
  ],
  intervalMinutes: 45,
  enableJitter: true,
  utmCampaign: 'italian_cucina_povera_v1',
  autoSaveToFeed: true
};
