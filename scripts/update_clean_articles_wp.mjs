import fs from 'fs';
import path from 'path';

const WP_URL = process.env.WP_SITE_URL || 'https://foodsprepared.wasmer.app';
const SYNC_KEY = process.env.WP_AUTOSYNC_SECRET || '';

async function loadRecipesFromTs() {
  let code = fs.readFileSync(path.resolve('src/data/sampleRecipes.ts'), 'utf8');
  code = code.replace(/import\s+\{[^}]+\}\s+from\s+'[^']+';/g, '');
  code = code.replace(
    /import\s+(\w+)\s+from\s+'\.\.\/assets\/images\/([^']+)';/g,
    "const $1 = 'src/assets/images/$2';"
  );
  code = code.replace(/export const (\w+)\s*:\s*[^=]+=/g, 'export const $1 =');
  const tempMjs = path.resolve('scripts/_temp_recipes_clean.mjs');
  fs.writeFileSync(tempMjs, code, 'utf8');
  const mod = await import(`file:///${tempMjs.replace(/\\/g, '/')}?t=${Date.now()}`);
  try {
    fs.unlinkSync(tempMjs);
  } catch {}
  return {
    INITIAL_RECIPES: mod.INITIAL_RECIPES,
    ITALIAN_RECIPE_CATEGORIES: mod.ITALIAN_RECIPE_CATEGORIES,
  };
}

function mapToWpCategories(italianCategory) {
  const cat = (italianCategory || 'Budget-Friendly Italian').trim();
  if (cat.toLowerCase().includes('budget')) {
    return ['Budget Friendly Italian', 'Italian Recipes'];
  }
  return [cat, 'Italian Recipes'];
}

// Per-recipe tailored blog sections matching the exact simple, warm style of nourishyourglow.com
const ARTICLE_BLOG_DETAILS = {
  'rec-it-prio-01': {
    intro: [
      'There is something deeply comforting about traditional Italian peasant cooking—humble pantry staples transformed into a rich, velvety meal that warms the whole kitchen. This <strong>Cucina Povera Master Chickpea &amp; Pasta Stew</strong> brings together tender bronze-die ditalini pasta, creamy chickpeas, sweet garlic, and fragrant fresh rosemary in a single pot.',
      'I first fell in love with <em>cucina povera</em> ("poor kitchen" cooking) while exploring how Italian grandmothers turned inexpensive dried beans, leftover country bread, and garden herbs into unforgettable family dinners. Instead of relying on heavy cream or expensive cuts of meat, this tradition uses starchy pasta cooking water, puréed legumes, and extra virgin olive oil to create a naturally glossy, deeply savory broth.',
      'What I adore most about this dish is how effortlessly it comes together on a busy weeknight for less than $1.65 per serving. Whether you serve it steaming hot with toasted garlic bread or pack it for cozy lunches during the week, this recipe proves that the simplest Italian ingredients create the most extraordinary flavor.'
    ],
    whyLove: [
      { title: 'Ultra Budget-Friendly', desc: 'Made entirely with everyday pantry staples for under $1.65 per generous bowl.' },
      { title: 'Naturally Creamy Without Dairy', desc: 'Puréeing a small scoop of chickpeas with starchy pasta water creates a velvety broth without heavy cream.' },
      { title: 'One-Pot Easy Cleanup', desc: 'Everything simmers in a single heavy pot in just 30 minutes from start to finish.' },
      { title: 'High in Plant Protein & Fiber', desc: 'Packs 16g of protein and 9g of dietary fiber per serving to keep you full and energized.' },
      { title: 'Even Better the Next Day', desc: 'The rosemary, garlic, and tomato flavors deepen overnight in the fridge.' }
    ],
    faq: [
      { q: 'What does Cucina Povera mean in Italian cooking?', a: 'Cucina povera literally translates to "poor kitchen" or peasant cooking. It is the traditional Italian philosophy of turning humble, affordable ingredients—like beans, lentils, pasta, herbs, and leftover bread—into deeply flavorful meals with zero food waste.' },
      { q: 'Can I use dried chickpeas instead of canned?', a: 'Yes! Soak 1 cup of dried chickpeas overnight in cold water with a pinch of baking soda, then simmer until tender before starting the recipe. Reserve the cooking liquid to use as your broth.' },
      { q: 'What pasta shape works best for this stew?', a: 'Short tubular pasta shapes like ditalini, tubetti, elbow macaroni, or broken spaghetti strands work best because they scoop up the creamy chickpea broth in every spoonful.' },
      { q: 'Can I freeze leftovers?', a: 'Yes, this stew freezes wonderfully for up to 3 months. If freezing, cook the pasta slightly al dente so it stays tender when reheated.' }
    ],
    storage: [
      { title: 'Refrigerator', desc: 'Store cooled leftovers in an airtight container in the refrigerator for up to 4 days.' },
      { title: 'Freezer', desc: 'Freeze in individual freezer-safe containers for up to 3 months. Thaw overnight in the fridge before warming.' },
      { title: 'Reheating', desc: 'Warm gently on the stovetop over medium-low heat with a splash of water or vegetable broth to loosen the starchy sauce, then finish with fresh olive oil.' }
    ],
    variations: [
      { title: 'Tuscan Greens Boost', desc: 'Wilted lacinato kale, baby spinach, or Swiss chard can be stirred in during the final 3 minutes of simmering.' },
      { title: 'Smoky Pancetta Twist', desc: 'Crisp 2 ounces of diced pancetta or guanciale in the pot before adding the garlic and rosemary.' },
      { title: 'Crispy Pangrattato Topping', desc: 'Top each bowl with toasted garlic breadcrumbs instead of grated cheese for a 100% plant-based crunch.' },
      { title: 'Spicy Calabrian Kick', desc: 'Stir in a teaspoon of crushed Calabrian chili paste or red pepper flakes with the garlic.' }
    ]
  },
  'rec-it-prio-02': {
    intro: [
      'There’s something irresistible about a steaming bowl of Roman <strong>Pasta e Ceci (Pasta and Chickpeas)</strong>—cozy, deeply savory, and ready in under 25 minutes using ingredients you already have in your cupboard. This easy one-pot recipe pairs tender ditalini pasta with canned chickpeas, golden garlic, fresh rosemary, and a touch of tomato paste.',
      'In Rome, <em>pasta e ceci</em> is the ultimate weeknight comfort food. The secret that separates a watery soup from an authentic Roman trattoria bowl is a simple 30-second trick: mashing or blending a third of the chickpeas right in the pot before adding the pasta. Combined with the starch released by the ditalini, the broth transforms into a rich, velvety sauce that clings to every bite.',
      'Whether you need a last-minute meatless Monday dinner or a nourishing lunch that reheats like a dream, this recipe delivers big Italian flavor with almost zero prep work.'
    ],
    whyLove: [
      { title: 'Ready in 25 Minutes', desc: 'Uses canned chickpeas so you can put a traditional Roman dinner on the table on any busy evening.' },
      { title: 'Rich, Creamy Texture', desc: 'Blending a portion of the chickpeas creates a thick, luxurious sauce without any heavy cream.' },
      { title: 'Five Pantry Staples', desc: 'Made with canned chickpeas, short pasta, garlic, rosemary, and extra virgin olive oil.' },
      { title: 'Family-Friendly Comfort Food', desc: 'Mild, cozy, and cheesy—both kids and adults love the tender pasta and creamy broth.' },
      { title: 'One Pot, Zero Fuss', desc: 'The pasta cooks directly in the chickpea broth, concentrating all the flavor in one pot.' }
    ],
    faq: [
      { q: 'Should I drain and rinse the canned chickpeas?', a: 'Give them a light rinse, or even better, save a few tablespoons of the starchy liquid from the can (aquafaba) to help emulsify the broth.' },
      { q: 'Do I boil the pasta separately?', a: 'No! Cooking the uncooked pasta directly in the simmering broth is essential because the pasta releases starch that thickens the soup naturally.' },
      { q: 'Can I make this vegan?', a: 'Absolutely. Simply omit the Pecorino Romano cheese at the end or swap in your favorite plant-based Parmesan or toasted garlic breadcrumbs.' },
      { q: 'What if the soup gets too thick as it sits?', a: 'Pasta continues to absorb liquid as it cools. Just stir in a splash of warm water or broth when reheating to restore the silky consistency.' }
    ],
    storage: [
      { title: 'Refrigerator', desc: 'Keep leftovers in a sealed container in the fridge for up to 4 days.' },
      { title: 'Freezer', desc: 'Freeze the chickpea base (before adding pasta) for up to 3 months, then boil fresh pasta when ready to serve.' },
      { title: 'Reheating', desc: 'Reheat over low heat on the stove with 2–3 tablespoons of water, stirring until hot and glossy.' }
    ],
    variations: [
      { title: 'Roman Anchovy Depth', desc: 'Melt 1–2 anchovy fillets into the olive oil with the garlic and rosemary for traditional Roman umami.' },
      { title: 'Lemon & Herb Finish', desc: 'Add a squeeze of fresh lemon juice and chopped flat-leaf parsley right before serving for brightness.' },
      { title: 'Gluten-Free Option', desc: 'Use gluten-free chickpea or brown rice ditalini pasta—it thickens the broth beautifully.' },
      { title: 'Baby Spinach Addition', desc: 'Fold in two handfuls of fresh baby spinach right as you turn off the heat.' }
    ]
  },
  'rec-it-prio-03': {
    intro: [
      'Few dishes capture the soul of Florentine home cooking quite like <strong>Tuscan-Style White Beans with Tomatoes, Garlic &amp; Fresh Rosemary (Fagioli all’Uccelletto)</strong>. Creamy cannellini beans are gently braised in a fragrant olive oil infusion of whole garlic cloves, woodsy rosemary, fresh sage, and sweet crushed San Marzano tomatoes.',
      'In Florence, this beloved dish got its name—<em>all’uccelletto</em> ("in the style of little birds")—because sage and rosemary were the classic herbs used in Tuscan kitchens for roasting game. When simmered with tender white beans and plum tomatoes, those same aromatic herbs create a rich, velvety glaze that tastes like it cooked all afternoon, yet takes only 25 minutes in one skillet.',
      'Serve these warm, saucy beans spooned generously over thick slices of toasted country bread rubbed with garlic, alongside roast chicken, or as a satisfying plant-based main course.'
    ],
    whyLove: [
      { title: 'Ready in 25 Minutes', desc: 'Transforms two cans of white cannellini beans into an authentic Florentine trattoria dish in one skillet.' },
      { title: 'Incredible Herbal Aroma', desc: 'Fresh rosemary, sage leaves, and whole garlic cloves infuse the extra virgin olive oil with unforgettable flavor.' },
      { title: 'Versatile Side or Main Dish', desc: 'Delicious piled onto toasted sourdough bruschetta, served beside grilled meats, or enjoyed on its own.' },
      { title: 'Naturally Vegan & Gluten-Free', desc: '100% plant-based, dairy-free, and packed with 15g of protein and 11g of fiber per serving.' },
      { title: 'Meal-Prep Superstar', desc: 'Tastes even better on day two as the beans soak up the rosemary-tomato juices.' }
    ],
    faq: [
      { q: 'What kind of white beans work best?', a: 'Cannellini beans (white kidney beans) are traditional in Tuscany because of their thin skins and creamy, buttery centers. Great Northern beans or navy beans also work well.' },
      { q: 'How do I keep the beans from breaking apart?', a: 'Keep the heat on a gentle low simmer rather than a rolling boil, and stir gently with a wooden spoon so the beans stay whole while the sauce thickens.' },
      { q: 'Can I use dried herbs instead of fresh?', a: 'Fresh rosemary and sage are highly recommended so they can infuse the olive oil, but in a pinch, use 1 teaspoon of dried rosemary and 1/2 teaspoon of rubbed sage.' },
      { q: 'How is this traditionally served in Tuscany?', a: 'In Florence, it is served in shallow bowls with a drizzle of raw green Tuscan olive oil, cracked black pepper, and thick slices of grilled unsalted Tuscan bread.' }
    ],
    storage: [
      { title: 'Refrigerator', desc: 'Store leftovers in an airtight container in the refrigerator for up to 5 days.' },
      { title: 'Freezer', desc: 'Freeze cooled beans and sauce in freezer-safe containers for up to 3 months.' },
      { title: 'Reheating', desc: 'Warm gently in a skillet over low heat with a splash of water or olive oil until bubbling.' }
    ],
    variations: [
      { title: 'Tuscan Sausage & Beans', desc: 'Brown 2 links of Italian fennel sausage in the skillet before simmering the tomatoes and beans.' },
      { title: 'Baked Cheesy White Beans', desc: 'Top the skillet with shredded mozzarella and Parmigiano and broil for 3 minutes until golden and bubbly.' },
      { title: 'Garlicky Greens & Beans', desc: 'Wilt a bunch of chopped Tuscan kale or escarole into the tomato sauce before adding the cannellini beans.' },
      { title: 'Bruschetta Appetizer', desc: 'Mash half the beans slightly and spoon over grilled sourdough crostini for an easy crowd-pleasing appetizer.' }
    ]
  },
  'rec-it-prio-04': {
    intro: [
      'When chilly evenings call for a bowl of pure comfort, nothing beats a steaming pot of <strong>Classic Pasta e Fagioli (Italian Pasta and Bean Soup)</strong>. Loaded with tender cannellini beans, aromatic carrots, celery, onion, crushed tomatoes, and al dente ditalini pasta, this one-pot soup is hearty enough to be a complete meal.',
      'Every Italian region has its own cherished version of <em>pasta e fagioli</em>, but the secret to the richest, most velvety broth is always the same: simmering a Parmigiano-Reggiano cheese rind right in the pot and blending a ladleful of beans to naturally thicken the soup. As the pasta boils directly in the seasoned broth, it releases starch that binds everything into a silky, spoon-coating masterpiece.',
      'Serve each bowl topped with a snowy mountain of freshly grated Parmigiano, a drizzle of peppery extra virgin olive oil, and warm crusty bread for dipping.'
    ],
    whyLove: [
      { title: 'Cozy One-Pot Meal', desc: 'A complete, nourishing family dinner with vegetables, beans, and pasta cooked in a single Dutch oven.' },
      { title: 'Thick, Velvety Broth', desc: 'Blending a portion of the beans gives you a restaurant-quality creamy texture without any heavy cream.' },
      { title: 'Budget-Friendly Ingredients', desc: 'Uses everyday pantry canned beans, basic mirepoix vegetables, and short pasta.' },
      { title: 'Rich Savory Umami', desc: 'Simmering a Parmesan rind with rosemary and garlic infuses the broth with deep, slow-cooked flavor in 35 minutes.' },
      { title: 'Freezer & Meal-Prep Friendly', desc: 'Makes 6 generous servings that reheat beautifully for lunches all week.' }
    ],
    faq: [
      { q: 'What beans are best for Pasta e Fagioli?', a: 'Cannellini beans or borlotti (cranberry) beans are the classic Italian choices. You can even use one can of cannellini and one can of red kidney beans.' },
      { q: 'How do I stop the pasta from getting mushy in leftovers?', a: 'If you plan to store leftovers for several days, you can cook the ditalini separately and ladle the hot bean soup over individual bowls of pasta.' },
      { q: 'What if I don’t have a Parmesan rind?', a: 'No problem! Just stir an extra 2 tablespoons of freshly grated Parmigiano-Reggiano into the soup right at the end of cooking.' },
      { q: 'Can I make this soup vegetarian or vegan?', a: 'Yes! Use vegetable broth instead of chicken broth, and skip the Parmesan rind for a 100% vegan version.' }
    ],
    storage: [
      { title: 'Refrigerator', desc: 'Store in an airtight container in the refrigerator for up to 4 days.' },
      { title: 'Freezer', desc: 'Freeze the soup base (without pasta) for up to 3 months. Thaw and boil fresh ditalini when serving.' },
      { title: 'Reheating', desc: 'Warm over medium-low heat on the stovetop, adding a splash of broth or water to loosen the thickened soup.' }
    ],
    variations: [
      { title: 'Pancetta or Bacon Base', desc: 'Sauté 3 ounces of diced pancetta with the onion, carrot, and celery for a smoky depth of flavor.' },
      { title: 'Italian Sausage Pasta e Fagioli', desc: 'Brown 1/2 pound of mild or hot Italian sausage in the pot before adding the vegetables.' },
      { title: 'Garden Vegetable Boost', desc: 'Add diced zucchini and baby spinach during the last 5 minutes of simmering.' },
      { title: 'Herb Pesto Swirl', desc: 'Swirl a spoonful of fresh basil pesto into each bowl right before serving.' }
    ]
  },
  'rec-it-prio-05': {
    intro: [
      'Busy weeknights don’t mean settling for bland takeout when you have five everyday Italian staples in your kitchen. This <strong>5-Ingredient Italian Pantry Pasta</strong> turns bronze-die spaghetti, golden garlic, extra virgin olive oil, freshly grated Pecorino Romano, and cracked black pepper into a glossy, restaurant-worthy dinner in just 20 minutes.',
      'Italian home cooks are masters of the 15-minute pantry dinner. The magic lies in treating starchy pasta cooking water as a key ingredient: when tossed vigorously off the heat with olive oil and finely micro-grated aged cheese, the starch molecules bind the fat and cheese into a silky, creamy sauce that coats every strand without a single drop of heavy cream.',
      'Once you master this simple 5-ingredient method, you can spin it into half a dozen different weeknight dinners using whatever you have in your cupboard.'
    ],
    whyLove: [
      { title: 'Only 5 Everyday Ingredients', desc: 'No special grocery trip required—uses staples you already have in your pantry and fridge.' },
      { title: 'On the Table in 20 Minutes', desc: 'The sauce comes together in the skillet in the exact time it takes the pasta water to boil.' },
      { title: 'Restaurant-Style Glossy Sauce', desc: 'Uses the classic Italian pasta-water emulsion technique for a silky, never-greasy finish.' },
      { title: 'Endlessly Customizable', desc: 'Easily add canned chickpeas, tuna, cherry tomatoes, or toasted breadcrumbs.' },
      { title: 'Incredible Flavor on a Dime', desc: 'Costs less than $1.50 per serving while tasting like a Roman trattoria classic.' }
    ],
    faq: [
      { q: 'Why did my cheese clump instead of melting smoothly?', a: 'Cheese clumps if the pan is too hot or if pre-shredded bagged cheese (which contains anti-caking starch) is used. Always remove the skillet from the heat for 30 seconds before tossing in freshly grated cheese.' },
      { q: 'Why should I use less water when boiling the pasta?', a: 'Boiling pasta in slightly less water concentrates the released wheat starch, giving you "liquid gold" pasta water that emulsifies the sauce effortlessly.' },
      { q: 'Can I use Parmigiano-Reggiano instead of Pecorino?', a: 'Yes! Pecorino Romano gives a sharper, saltier Roman bite, while Parmigiano-Reggiano gives a sweeter, nuttier flavor—or use a 50/50 blend of both.' },
      { q: 'What pasta shapes work best?', a: 'Long strands like spaghetti, bucatini, linguine, or tonnarelli hold the glossy garlic-and-cheese emulsion best.' }
    ],
    storage: [
      { title: 'Refrigerator', desc: 'Store leftover pasta in an airtight container in the fridge for up to 3 days.' },
      { title: 'Freezer', desc: 'Emulsified cheese pastas are best enjoyed fresh and are not recommended for freezing.' },
      { title: 'Reheating', desc: 'Warm in a skillet over medium-low heat with 2 tablespoons of water and a drizzle of olive oil, tossing until glossy again.' }
    ],
    variations: [
      { title: 'Roman Carbonara Upgrade', desc: 'Crisp diced guanciale or pancetta and temper 3 egg yolks with the Pecorino before tossing off-heat.' },
      { title: 'Pantry Tuna & Capers', desc: 'Flake a jar of olive-oil-packed Italian tuna and a spoonful of capers into the garlic oil.' },
      { title: 'San Marzano Marinara', desc: 'Simmer 1 can of crushed San Marzano tomatoes with the garlic for 10 minutes before tossing with pasta.' },
      { title: 'Crunchy Pangrattato Finish', desc: 'Top with golden garlic-toasted breadcrumbs and fresh parsley.' }
    ]
  },
  'rec-it-prio-06': {
    intro: [
      'In an Italian kitchen, a loaf of crusty country bread is never thrown away—in fact, some of Italy’s most famous dishes were invented specifically for day-old bread! This <strong>Tuscan Leftover Bread Panzanella, Bruschetta &amp; Crispy Pangrattato Guide</strong> transforms stale Italian loaves into a vibrant, juicy dinner in just 20 minutes.',
      'When fresh bread goes stale, it loses moisture—which actually makes it a culinary superpower. Lightly toasted in the oven or rubbed with raw garlic on a hot grill pan, day-old bread acts like a flavorful sponge that drinks up sweet ripe tomato juices, extra virgin olive oil, and tangy red wine vinegar without turning soggy.',
      'Plus, any remaining crusts can be pulsed into coarse crumbs and toasted in olive oil with garlic and herbs to make <em>pangrattato</em> ("poor man’s Parmesan"), the ultimate crunchy topping for pasta and soups.'
    ],
    whyLove: [
      { title: 'Zero Food Waste', desc: 'Turns dry, day-old baguettes, ciabatta, or sourdough loaves into a showstopping Italian meal.' },
      { title: 'Ready in 20 Minutes', desc: 'Minimal cooking required—just crisp the bread cubes while the tomatoes marinate.' },
      { title: 'Bright, Juicy Mediterranean Flavors', desc: 'Ripe tomatoes, crisp cucumber, red onion, fresh basil, and golden olive oil.' },
      { title: 'Bonus Crispy Pangrattato', desc: 'Learn the 4-minute toasted breadcrumb trick that elevates every pasta dish in your repertoire.' },
      { title: 'Light Yet Satisfying', desc: 'At 330 calories per serving, it pairs wonderfully with grilled chicken, fish, or white beans.' }
    ],
    faq: [
      { q: 'Can I use fresh bread if I don’t have stale bread?', a: 'Yes! Just cube your fresh Italian or sourdough bread and bake it on a sheet pan at 350°F (175°C) for 10–12 minutes until dry and crisp on the outside.' },
      { q: 'How do I keep Panzanella from getting soggy?', a: 'Salt your cut tomatoes in a colander first, toast the bread cubes until firm, and let the dressed salad rest for 15 minutes before serving so the bread softens slightly while keeping its bite.' },
      { q: 'What is Pangrattato?', a: 'Pangrattato is coarse breadcrumbs toasted in olive oil with garlic and herbs. In southern Italy, it was traditionally sprinkled over pasta when aged cheese was too expensive.' },
      { q: 'How long does homemade pangrattato last?', a: 'Stored in an airtight glass jar at room temperature, crispy pangrattato stays fresh and crunchy for up to 1 week.' }
    ],
    storage: [
      { title: 'Refrigerator', desc: 'Panzanella is best enjoyed within 2–3 hours of tossing, or store the dressed tomatoes and toasted bread separately in the fridge for up to 2 days.' },
      { title: 'Freezer', desc: 'Have extra stale bread? Cube it or pulse it into fresh breadcrumbs and freeze in a zip-top bag for up to 3 months.' },
      { title: 'Reheating / Refreshing', desc: 'Re-crisp stored pangrattato or bread cubes in a dry skillet over medium heat for 2 minutes.' }
    ],
    variations: [
      { title: 'Creamy Burrata Panzanella', desc: 'Tear a ball of fresh burrata or bocconcini mozzarella over the salad right before serving.' },
      { title: 'High-Protein White Bean Panzanella', desc: 'Toss in 1 drained can of cannellini beans or chickpeas to turn it into a filling main dish.' },
      { title: 'Warm Tuscan Pappa al Pomodoro', desc: 'Simmer stale bread cubes in crushed tomatoes, garlic, vegetable broth, and basil for a cozy bread soup.' },
      { title: 'Lemon-Herb Pangrattato', desc: 'Add grated lemon zest and finely chopped rosemary to your toasted breadcrumbs for seafood pastas.' }
    ]
  },
  'rec-it-prio-07': {
    intro: [
      'If you have ever visited the sun-drenched coast of Liguria, you know that authentic <strong>Trenette al Pesto (Ligurian Pesto Pasta with Potatoes and Green Beans)</strong> is a revelation. Ribbon pasta is boiled in the very same pot as tender Yukon Gold potato cubes and crisp green beans, then tossed off the heat with vibrant emerald basil pesto.',
      'Why do Genoese cooks boil potatoes and green beans with their pasta? Aside from making it an effortless one-pot meal, the diced potatoes release delicate starch into the boiling water. When you ladle that starchy water into the pesto and toss everything together, the pesto transforms into a velvety, creamy coating that hugs every strand of pasta and every green bean.',
      'By pulsing the basil briefly with chilled olive oil and tossing the sauce completely off the heat, your pesto stays bright green, fragrant, and fresh—never dark or oily.'
    ],
    whyLove: [
      { title: 'Authentic Genoese One-Pot Method', desc: 'Potatoes, green beans, and pasta all boil together in the same pot for effortless timing and cleanup.' },
      { title: 'Bright Emerald Basil Pesto', desc: 'Off-heat tossing keeps the sweet basil vibrant green and preserves its fresh aroma.' },
      { title: 'Extra Creamy Texture', desc: 'Starch from the boiling potatoes and pasta binds the pesto and olive oil into a silky glaze.' },
      { title: 'Complete Veggie & Pasta Dinner', desc: 'With green beans and potatoes built right into the dish, you don’t even need a separate side.' },
      { title: 'Ready in Under 30 Minutes', desc: 'Fast enough for a Tuesday night yet special enough for weekend dinner guests.' }
    ],
    faq: [
      { q: 'Why does pesto sometimes turn brown or dark?', a: 'Basil oxidizes when exposed to heat or over-blended in a warm food processor. Pulse the basil just until smooth, and never cook pesto in a hot skillet—always toss it with pasta off the heat!' },
      { q: 'What pasta can I use if I can’t find trenette?', a: 'Linguine, bavette, fettuccine, or trofie are the traditional substitutes and work beautifully.' },
      { q: 'Can I use store-bought refrigerated pesto?', a: 'Yes! For the freshest flavor, choose a refrigerated pesto made with extra virgin olive oil and stir in 2 tablespoons of freshly grated Parmigiano-Reggiano before tossing.' },
      { q: 'What kind of potatoes work best?', a: 'Waxy or all-purpose potatoes like Yukon Gold or yellow potatoes hold their cube shape while adding a creamy texture.' }
    ],
    storage: [
      { title: 'Refrigerator', desc: 'Store leftover pasta in an airtight container for up to 3 days. Extra pesto can be kept in a jar topped with a thin layer of olive oil for 5 days.' },
      { title: 'Freezer', desc: 'Freeze homemade basil pesto in ice cube trays for up to 3 months so you always have fresh Ligurian flavor on hand.' },
      { title: 'Reheating', desc: 'Warm leftovers gently with a splash of water in a covered skillet over low heat, or enjoy at room temperature as a pasta salad.' }
    ],
    variations: [
      { title: 'Toasted Walnut or Almond Pesto', desc: 'Swap pine nuts for toasted walnuts or blanched almonds for a budget-friendly nutty flavor.' },
      { title: 'Grilled Shrimp Topping', desc: 'Top each plate with garlic-lemon grilled shrimp for a coastal Ligurian feast.' },
      { title: 'Cherry Tomato Pop', desc: 'Fold in a cup of halved sweet cherry tomatoes right at the end for juicy contrast.' },
      { title: 'Creamy Burrata Finish', desc: 'Nestle a spoonful of fresh stracciatella or burrata in the center of each warm bowl.' }
    ]
  },
  'rec-it-prio-08': {
    intro: [
      'Transport your kitchen to the turquoise coast of Sardinia with this <strong>Sardinian Fregola with Seafood or Summer Vegetables in Saffron-Tomato Brodo</strong>. Made from semolina dough rolled into tiny pearls and toasted in ovens until golden, <em>fregola sarda</em> has a warm, nutty flavor and satisfying chewy bite unlike any other Italian pasta.',
      'Instead of boiling and draining fregola like regular pasta, we cook it risotto-style in a single wide pan with white wine, sweet cherry tomatoes, garlic, and a pinch of golden saffron threads. As the toasted pasta pearls simmer, they drink up every drop of the savory Mediterranean broth while releasing starch to create a glossy, spoonable sauce.',
      'Whether you make the classic coastal version with sweet littleneck clams or the garden vegetable version with diced zucchini and chickpeas, it’s a breathtaking 33-minute dinner.'
    ],
    whyLove: [
      { title: 'Unique Toasted Nutty Flavor', desc: 'Oven-toasted Sardinian fregola pearls bring a warm, roasted depth and irresistible al dente texture.' },
      { title: 'Flexible Seafood or Veggie Options', desc: 'Works equally well with clams and shrimp or with summer zucchini and chickpeas.' },
      { title: 'Golden Saffron & Tomato Brodo', desc: 'A pinch of saffron and splash of dry white wine create an aromatic restaurant-quality broth.' },
      { title: 'One-Pan Risotto-Style Cooking', desc: 'No stirring constantly like risotto—just simmer gently in one wide skillet for 14 minutes.' },
      { title: 'Light & Mediterranean', desc: 'Balanced, vibrant, and packed with coastal Italian herbs and extra virgin olive oil.' }
    ],
    faq: [
      { q: 'What is Sardinian fregola (fregula)?', a: 'Fregola is a traditional pasta from Sardinia made of coarse semolina flour and water rolled into small spheres and toasted in the oven, giving it a mottled golden color and nutty taste.' },
      { q: 'What can I substitute if I can’t find fregola?', a: 'Israeli (pearl) couscous toasted in a dry skillet for 3 minutes, or acini di pepe / orzo pasta, makes a great substitute.' },
      { q: 'How do I clean fresh clams before cooking?', a: 'Soak fresh littleneck clams in cold salted water for 20 minutes so they expel any sand, then scrub the shells under cool running water and discard any cracked or open clams.' },
      { q: 'Should the finished dish be soupy or dry?', a: 'Authentic Sardinian fregola is served "brodoso"—with enough glossy saffron-tomato broth at the bottom of the bowl to soak up with crusty bread.' }
    ],
    storage: [
      { title: 'Refrigerator', desc: 'Store seafood fregola in the fridge for up to 2 days, or the vegetable version for up to 4 days.' },
      { title: 'Freezer', desc: 'The vegetable fregola freezes well for up to 2 months; avoid freezing cooked clams in their shells.' },
      { title: 'Reheating', desc: 'Warm gently in a saucepan over low heat with a splash of broth or water until steaming.' }
    ],
    variations: [
      { title: 'Mixed Seafood Marinara', desc: 'Add peeled shrimp, mussels, and calamari rings during the final 4 minutes of simmering.' },
      { title: 'Garden Zucchini & Chickpea', desc: 'Skip the seafood and simmer with diced zucchini, yellow squash, and 1 can of chickpeas.' },
      { title: 'Crispy Bottarga or Pangrattato', desc: 'Finish with grated cured mullet roe (bottarga) or lemon-garlic toasted breadcrumbs.' },
      { title: 'Spicy Arrabbiata Brodo', desc: 'Add extra crushed red pepper flakes and a spoonful of tomato paste for a bolder, spicier broth.' }
    ]
  },
  'rec-it-prio-09': {
    intro: [
      'Finding a high-protein meal prep recipe that actually stays creamy and delicious on day four can feel impossible—until you try this <strong>High-Protein Chicken Pesto Pasta with White Beans &amp; Green Beans</strong>. Packing an incredible <strong>44 grams of protein per bowl</strong>, this vibrant 25-minute Italian dinner is built specifically for busy weeknights and make-ahead lunches.',
      'Most meal-prep pesto pastas dry out in the refrigerator because the pasta absorbs all the oil. Here, we use a game-changing Italian kitchen trick: blending half a can of creamy cannellini beans with a splash of starchy pasta water right into the basil pesto! It boosts the protein and fiber while creating a luscious, velvety sauce that stays moist and glossy when reheated.',
      'Paired with golden-seared garlic-herb chicken breast and crisp-tender green beans, this recipe fills four meal-prep containers with restaurant-quality Italian flavor.'
    ],
    whyLove: [
      { title: '44g Protein Per Serving', desc: 'Combines lean chicken breast, bronze-die or legume pasta, white beans, and Parmigiano-Reggiano.' },
      { title: 'Never Dries Out in Meal Prep', desc: 'The white-bean-and-pasta-water emulsion keeps the pesto sauce creamy for 4 full days.' },
      { title: 'Ready in 25 Minutes', desc: 'Prep four balanced lunches or dinners in less than half an hour.' },
      { title: 'Built-In Veggies & Fiber', desc: 'Crisp green beans and cannellini beans add 7g of fiber and vibrant color to every container.' },
      { title: 'Delicious Warm or Cold', desc: 'Enjoy it heated up at work or straight from the fridge like a gourmet Italian pasta salad.' }
    ],
    faq: [
      { q: 'Can you taste the blended white beans in the pesto?', a: 'Not at all! Cannellini beans have a very mild, buttery flavor that blends seamlessly with basil, garlic, and Parmesan, simply making the pesto extra creamy.' },
      { q: 'How do I reheat pesto pasta without separating the oil?', a: 'Add 1 tablespoon of water to your container before microwaving for 60–90 seconds at medium power, then give it a quick stir.' },
      { q: 'What pasta should I use for maximum protein?', a: 'Standard bronze-die durum wheat penne or fusilli gives 44g protein per serving; swapping in chickpea or lentil pasta pushes it over 50g protein per serving!' },
      { q: 'Can I use rotisserie chicken to save time?', a: 'Yes! Shred 3 cups of skinless rotisserie chicken breast and fold it in right at the end with the pesto.' }
    ],
    storage: [
      { title: 'Refrigerator', desc: 'Divide into 4 airtight glass meal-prep containers and refrigerate for up to 4 days.' },
      { title: 'Freezer', desc: 'Freeze portions in freezer-safe containers for up to 2 months. Thaw overnight in the fridge before reheating.' },
      { title: 'Reheating', desc: 'Sprinkle with a teaspoon of water, cover loosely, and warm in the microwave for 60–90 seconds, or enjoy chilled.' }
    ],
    variations: [
      { title: 'Sun-Dried Tomato & Spinach', desc: 'Add sliced sun-dried tomatoes and baby spinach to the warm pasta so the greens wilt gently.' },
      { title: 'Red Pesto (Pesto Trapanese)', desc: 'Swap green basil pesto for Sicilian tomato-almond pesto for a tangy Mediterranean twist.' },
      { title: 'Crispy Air-Fryer Chicken Cutlets', desc: 'Slice crispy air-fried Italian chicken cutlets on top of each meal-prep bowl.' },
      { title: 'Vegetarian High-Protein Swap', desc: 'Replace the chicken with an extra can of chickpeas and cubed mozzarella pearls.' }
    ]
  },
  'rec-it-prio-10': {
    intro: [
      'There is nothing quite like the aroma of a slow-simmered Italian ragù filling the kitchen on a Sunday afternoon. This <strong>Easy Italian Lentil and Tomato Ragù</strong> captures all the deep, rich, meaty comfort of a traditional Bolognese sauce using humble pantry brown lentils—in just 40 minutes and for only $1.40 per serving.',
      'Like every great Emilia-Romagna ragù, this recipe starts with a classic <em>soffritto</em> of finely diced onion, carrot, and celery sautéed slowly in extra virgin olive oil until sweet and golden. Dry red wine, tomato paste, crushed San Marzano tomatoes, and aromatic bay leaf and rosemary create a velvety base where the dried lentils simmer until tender and plump.',
      'Toss it with wide ribbons of pappardelle or tagliatelle, spoon it over creamy polenta, or layer it into a cozy baked lasagna that everyone at the table will devour.'
    ],
    whyLove: [
      { title: 'Rich, Meaty Texture', desc: 'Brown or green lentils hold their shape and mimic the hearty bite of traditional meat ragù.' },
      { title: 'Only $1.40 Per Serving', desc: 'Makes 6 generous servings from a single cup of dried pantry lentils and canned tomatoes.' },
      { title: 'Authentic Soffritto Depth', desc: 'Caramelized onion, carrot, celery, garlic, and red wine build layers of genuine Italian flavor.' },
      { title: 'High Fiber & Plant Protein', desc: 'Delivers 18g of protein and 12g of fiber per serving with zero cholesterol.' },
      { title: 'Freezer-Friendly Batch Sauce', desc: 'Double the batch and freeze jars of ragù for instant weeknight pasta dinners.' }
    ],
    faq: [
      { q: 'Which type of lentils work best for Italian ragù?', a: 'Brown lentils, green lentils, or French Puy lentils are ideal because they stay tender-firm and meaty. Avoid red split lentils, which break down into a purée.' },
      { q: 'Do I need to soak the lentils before cooking?', a: 'No soaking is needed! Just give the dried lentils a quick rinse under cold water and simmer them directly in the tomato-and-broth sauce for 25–30 minutes.' },
      { q: 'Can I make this without red wine?', a: 'Yes, simply replace the 1/2 cup of red wine with extra vegetable broth plus 1 teaspoon of balsamic vinegar for acidity and depth.' },
      { q: 'Why do you add a splash of milk at the end?', a: 'Just like in authentic Ragù alla Bolognese, a splash of whole milk or unsweetened oat milk balances the acidity of the tomatoes and rounds out the sauce into a velvety glaze.' }
    ],
    storage: [
      { title: 'Refrigerator', desc: 'Store the lentil ragù in an airtight jar or container in the fridge for up to 5 days.' },
      { title: 'Freezer', desc: 'Freeze cooled sauce in freezer bags or containers for up to 3 months.' },
      { title: 'Reheating', desc: 'Simmer gently in a saucepan over low heat with a splash of pasta cooking water before tossing with hot pasta.' }
    ],
    variations: [
      { title: 'Mushroom & Lentil Bolognese', desc: 'Finely chop 8 ounces of cremini mushrooms and sauté them with the soffritto for extra umami.' },
      { title: 'Creamy Polenta Bowls', desc: 'Spoon the hot lentil ragù over soft Parmesan polenta instead of pasta.' },
      { title: 'Baked Lentil Lasagna', desc: 'Layer this ragù with lasagna sheets, ricotta, and mozzarella for a crowd-pleasing baked dinner.' },
      { title: 'Walnut & Herb Boost', desc: 'Stir in 1/3 cup of finely chopped toasted walnuts for an even richer texture.' }
    ]
  },
  'rec-it-prio-11': {
    intro: [
      'When you need a warm, nourishing Italian dinner on the table in less than 20 minutes with zero stove-top babysitting, this <strong>Air-Fryer Italian Frittata with Green Beans, Herbs &amp; Pecorino</strong> is a total game-changer. Whisked eggs, crisp-tender green beans, sweet shallots, fresh basil, and sharp Pecorino Romano bake into a golden, soufflé-like frittata right in your air fryer.',
      'Making a traditional frittata on the stove requires watching the heat carefully and flipping a heavy skillet over the burner. In the air fryer, circulating convection heat cooks the eggs evenly from top and bottom at the same time—giving you a puffed, golden-brown crust and a creamy, custard-like center without ever flipping!',
      'Serve warm wedges with a crisp tomato salad for a 19-minute weeknight dinner, or slice it into thick squares to stuff inside crusty Italian panini for lunch.'
    ],
    whyLove: [
      { title: 'Ready in 19 Minutes', desc: '4 minutes to whisk and 14 minutes in the air fryer—hands-free weeknight cooking at its best.' },
      { title: 'No Flipping Required', desc: 'Even air-fryer circulation puffs and browns the top without any tricky skillet flips.' },
      { title: 'High-Protein & Gluten-Free', desc: 'Packs 21g of protein per serving with only 290 calories and 6g of carbs.' },
      { title: 'Great Hot or Room Temperature', desc: 'Just like in Italian wine bars, frittata tastes amazing warm, room temp, or cold from the fridge.' },
      { title: 'Uses Fresh or Leftover Veggies', desc: 'Works with fresh steamed green beans or leftover roasted vegetables from the night before.' }
    ],
    faq: [
      { q: 'What pan fits inside an air fryer for making a frittata?', a: 'A 7-inch or 8-inch round cake pan, glass pie dish, oven-safe ceramic baking dish, or silicone air-fryer liner works great. Just measure your basket first.' },
      { q: 'How do I keep eggs from sticking to the pan?', a: 'Brush the bottom and sides of your baking dish generously with extra virgin olive oil or line the bottom with a circle of parchment paper.' },
      { q: 'Why shouldn’t I set the air fryer above 350°F?', a: 'Eggs cook gently; 350°F (175°C) allows the center to set into a tender custard without over-browning the outside or making the eggs rubbery.' },
      { q: 'Can I bake this in a regular oven instead?', a: 'Yes! Bake in a preheated 375°F (190°C) oven for 18–22 minutes until puffed and golden in the center.' }
    ],
    storage: [
      { title: 'Refrigerator', desc: 'Store sliced frittata in an airtight container in the refrigerator for up to 4 days.' },
      { title: 'Freezer', desc: 'Wrap individual wedges tightly and freeze for up to 2 months.' },
      { title: 'Reheating', desc: 'Pop slices back into the air fryer at 320°F for 3 minutes, or enjoy at room temperature.' }
    ],
    variations: [
      { title: 'Potato & Rosemary Frittata', desc: 'Add 1 cup of thinly sliced cooked potatoes and fresh rosemary needles.' },
      { title: 'Zucchini & Mint Ribbons', desc: 'Swap green beans for sautéed zucchini coins and fresh mint leaves.' },
      { title: 'Creamy Ricotta Pockets', desc: 'Dollop spoonfuls of whole-milk ricotta over the top before air-frying.' },
      { title: 'Roasted Red Pepper & Provolone', desc: 'Fold in strips of jarred roasted red peppers and cubed provolone cheese.' }
    ]
  },
  'rec-it-prio-12': {
    intro: [
      'Tucked away in the mountain towns of Teramo in the Abruzzo region of central Italy is one of the country’s most extraordinary comfort foods: <strong>Abruzzese Scrippelle ’Mbusse (Cheese-Rolled Crespelle in Golden Brodo)</strong>. Whisper-thin Italian egg crêpes are dusted with aged Pecorino and Parmigiano cheese, rolled into delicate cylinders, and ladled over with steaming golden broth.',
      'The dialect name <em>scrippelle ’mbusse</em> literally translates to "wet crêpes." Unlike French crêpes that are made with milk and butter, traditional Abruzzese scrippelle use only flour, whole eggs, and water—creating a lacy, paper-thin pancake that drinks up the hot, aromatic broth while melting the aged cheese inside into a savory, velvety filling.',
      'Whether you serve it as a cozy winter dinner or as an unforgettable first course for a special family gathering, this hidden regional gem uses just five everyday ingredients.'
    ],
    whyLove: [
      { title: 'Authentic Regional Treasure', desc: 'A beloved Abruzzese family recipe that brings genuine regional Italian heritage to your table.' },
      { title: 'Only 5 Simple Ingredients', desc: 'Eggs, flour, water, aged Italian cheese, and rich golden chicken or vegetable broth.' },
      { title: 'Delicate, Melt-in-Your-Mouth Texture', desc: 'The warm broth softens the thin egg crêpes and melts the Pecorino-Parmigiano filling inside.' },
      { title: 'Make-Ahead Friendly', desc: 'Cook the scrippelle crêpes up to 2 days ahead, then simply roll and ladle hot broth when ready to eat.' },
      { title: 'Ready in 35 Minutes', desc: 'Each thin crêpe cooks in less than 60 seconds in a non-stick skillet.' }
    ],
    faq: [
      { q: 'Why is the scrippelle batter made with water instead of milk?', a: 'In Abruzzo, water is used instead of milk so the crêpes turn out ultra-thin, light, and porous—allowing them to absorb the flavorful broth without becoming heavy.' },
      { q: 'Why should the batter rest for 15 minutes?', a: 'Resting lets the flour fully hydrate and relaxes the gluten, ensuring your scrippelle swirl into paper-thin rounds without tearing.' },
      { q: 'What kind of broth is best?', a: 'A rich homemade chicken broth (brodo di gallina) or a golden vegetable broth simmered with onion, carrot, celery, and a Parmesan rind is ideal.' },
      { q: 'Can I bake rolled scrippelle instead of serving them in broth?', a: 'Yes! In Abruzzo, layering rolled scrippelle in a baking dish with tomato ragù and mozzarella creates another famous dish called Timballo Teramano.' }
    ],
    storage: [
      { title: 'Refrigerator', desc: 'Stack cooled, un-filled scrippelle crêpes between sheets of parchment paper in an airtight bag in the fridge for up to 3 days. Store broth separately.' },
      { title: 'Freezer', desc: 'Freeze stacked crêpes (separated by parchment) for up to 2 months; thaw in the fridge before rolling with cheese.' },
      { title: 'Reheating', desc: 'Bring the broth to a rolling simmer and ladle it piping hot over the cheese-rolled scrippelle right before serving.' }
    ],
    variations: [
      { title: 'Fresh Nutmeg & Cinnamon Whisper', desc: 'Add a tiny pinch of freshly grated nutmeg (or a whisper of cinnamon, as done in Teramo) to the grated cheese filling.' },
      { title: 'Spinach & Ricotta Baked Crespelle', desc: 'Fill the crêpes with ricotta and spinach, top with marinara sauce, and bake at 375°F for 20 minutes.' },
      { title: 'Fresh Herb Crêpe Batter', desc: 'Whisk 2 tablespoons of finely minced flat-leaf parsley into the egg batter.' },
      { title: 'Vegetarian Golden Brodo', desc: 'Simmer vegetable broth with saffron threads and a Parmigiano rind for a rich meatless version.' }
    ]
  }
};

function buildSimpleNourishStyleArticleHtml(r, wpHeroUrl, gallery, pdfDownloadUrl) {
  const details = ARTICLE_BLOG_DETAILS[r.id] || ARTICLE_BLOG_DETAILS['rec-it-prio-01'];
  const photo1 = gallery[0]?.url || wpHeroUrl;
  const photo2 = gallery[1]?.url || wpHeroUrl;
  const photo3 = gallery[2]?.url || wpHeroUrl;

  const introHtml = details.intro
    .map((p) => `<p style="font-size:18px;line-height:1.8;color:#2d3748;margin:0 0 20px;">${p}</p>`)
    .join('');

  const whyLoveHtml = details.whyLove
    .map(
      (item) =>
        `<li style="margin-bottom:12px;font-size:17px;line-height:1.7;color:#2d3748;"><strong style="color:#1a202c;">${item.title}</strong> &ndash; ${item.desc}</li>`
    )
    .join('');

  const ingredientNotesHtml = (r.ingredients || [])
    .map(
      (ing) =>
        `<li style="margin-bottom:12px;font-size:17px;line-height:1.7;color:#2d3748;"><strong style="color:#1a202c;">${ing.item} (${ing.amount})</strong> &ndash; ${
          ing.notes
            ? `Prepared ${ing.notes} so it blends seamlessly into the dish.`
            : 'Use fresh, high-quality Italian pantry staples for the best flavor.'
        }</li>`
    )
    .join('');

  const stepsBlogHtml = (r.instructions || [])
    .map(
      (inst) =>
        `<li style="margin-bottom:18px;font-size:17px;line-height:1.75;color:#2d3748;"><strong style="color:#1a202c;font-size:18px;">${inst.title}</strong><br />${inst.text}</li>`
    )
    .join('');

  const faqHtml = details.faq
    .map(
      (f) =>
        `<p style="margin:0 0 18px;font-size:17px;line-height:1.75;color:#2d3748;"><strong style="color:#1a202c;font-size:18px;">${f.q}</strong><br />${f.a}</p>`
    )
    .join('');

  const storageHtml = details.storage
    .map(
      (s) =>
        `<li style="margin-bottom:10px;font-size:17px;line-height:1.7;color:#2d3748;"><strong style="color:#1a202c;">${s.title}</strong> &ndash; ${s.desc}</li>`
    )
    .join('');

  const variationsHtml = details.variations
    .map(
      (v) =>
        `<li style="margin-bottom:10px;font-size:17px;line-height:1.7;color:#2d3748;"><strong style="color:#1a202c;">${v.title}</strong> &ndash; ${v.desc}</li>`
    )
    .join('');

  const cardIngredientsHtml = (r.ingredients || [])
    .map(
      (ing) =>
        `<li style="margin-bottom:10px;font-size:16px;line-height:1.6;color:#2d3748;list-style-type:disc;"><strong style="color:#1a202c;">${ing.amount}</strong> ${ing.item}${
          ing.notes ? ` <span style="color:#718096;font-style:italic;">(${ing.notes})</span>` : ''
        }</li>`
    )
    .join('');

  const cardInstructionsHtml = (r.instructions || [])
    .map(
      (inst) =>
        `<li style="margin-bottom:14px;font-size:16px;line-height:1.7;color:#2d3748;list-style-type:decimal;"><strong style="color:#1a202c;">${inst.title}:</strong> ${inst.text}</li>`
    )
    .join('');

  const cardTipsHtml =
    r.chefTips && r.chefTips.length > 0
      ? `<div style="margin-top:24px;padding-top:20px;border-top:1px dashed #e2d5c3;"><h3 style="font-size:20px;font-weight:700;color:#1a202c;margin:0 0 12px;">Chef&rsquo;s Notes</h3><ul style="margin:0;padding-left:22px;color:#4a5568;font-size:15px;line-height:1.7;">${r.chefTips
          .map((t) => `<li style="margin-bottom:6px;">${t}</li>`)
          .join('')}</ul></div>`
      : '';

  const pinShareUrl = `https://www.pinterest.com/pin/create/bookmarklet/?url=${encodeURIComponent(
    `${WP_URL}/${r.slug}/`
  )}&media=${encodeURIComponent(wpHeroUrl)}&description=${encodeURIComponent(r.title)}`;

  // Single-line / clean block formatting so WordPress wpautop never inserts unwanted <br> tags
  return [
    `<div class="semplice-clean-article" style="max-width:780px;margin:0 auto;font-family:'Poppins',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#2d3748;">`,

    // Subtle Warm Jump to Recipe + Download PDF Bar at top
    `<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;background:#FFF8F2;border:1px solid #F3E5D8;padding:14px 20px;border-radius:12px;margin-bottom:28px;">`,
    `<span style="font-size:14px;font-weight:600;color:#7C4A2D;">🇮🇹 ${r.italianCategory} &bull; ⏱️ ${r.totalTime}</span>`,
    `<div style="display:flex;gap:10px;flex-wrap:wrap;">`,
    `<a href="#recipe" style="background:#227755;color:#ffffff;padding:8px 18px;border-radius:999px;font-size:13px;font-weight:600;text-decoration:none;display:inline-block;">📋 Jump to Recipe</a>`,
    `<a href="${pdfDownloadUrl}" target="_blank" rel="noopener" download="${r.slug}.pdf" style="background:#D96B43;color:#ffffff;padding:8px 18px;border-radius:999px;font-size:13px;font-weight:600;text-decoration:none;display:inline-block;">📥 Download Recipe PDF</a>`,
    `</div></div>`,

    // 3 Warm Intro Paragraphs
    introHtml,

    // In-Post Recipe Image 1
    `<p style="margin:28px 0;"><img src="${photo1}" alt="${r.title}" style="width:100%;max-height:540px;object-fit:cover;border-radius:14px;display:block;margin:0 auto;" /></p>`,

    // Why You'll Love It
    `<h2 style="font-size:28px;font-weight:700;color:#1a202c;margin:36px 0 16px;">Why You&rsquo;ll Love It</h2>`,
    `<ul style="margin:0 0 28px;padding-left:24px;">${whyLoveHtml}</ul>`,

    // Ingredient Notes & Details
    `<h2 style="font-size:28px;font-weight:700;color:#1a202c;margin:36px 0 16px;">Ingredient Notes &amp; Details</h2>`,
    `<ul style="margin:0 0 28px;padding-left:24px;">${ingredientNotesHtml}</ul>`,

    // In-Post Recipe Image 2
    `<p style="margin:28px 0;"><img src="${photo2}" alt="${r.title} preparation" style="width:100%;max-height:540px;object-fit:cover;border-radius:14px;display:block;margin:0 auto;" /></p>`,

    // Step-by-Step Instructions
    `<h2 style="font-size:28px;font-weight:700;color:#1a202c;margin:36px 0 16px;">Step-by-Step Instructions</h2>`,
    `<ol style="margin:0 0 28px;padding-left:24px;">${stepsBlogHtml}</ol>`,

    // In-Post Recipe Image 3
    `<p style="margin:28px 0;"><img src="${photo3}" alt="${r.title} serving" style="width:100%;max-height:540px;object-fit:cover;border-radius:14px;display:block;margin:0 auto;" /></p>`,

    // FAQ
    `<h2 style="font-size:28px;font-weight:700;color:#1a202c;margin:36px 0 16px;">FAQ</h2>`,
    faqHtml,

    // Storage Tips
    `<h2 style="font-size:28px;font-weight:700;color:#1a202c;margin:36px 0 16px;">Storage Tips</h2>`,
    `<ul style="margin:0 0 28px;padding-left:24px;">${storageHtml}</ul>`,

    // Variations
    `<h2 style="font-size:28px;font-weight:700;margin:36px 0 16px;color:#1a202c;">Variations</h2>`,
    `<ul style="margin:0 0 40px;padding-left:24px;">${variationsHtml}</ul>`,

    // Clean, Modern WPRM-Style Recipe Card at #recipe (like nourishyourglow.com)
    `<div id="recipe" style="background:#FFF8F2;border:2px solid #F0E2D4;border-radius:20px;overflow:hidden;margin:40px 0 24px;box-shadow:0 8px 24px rgba(0,0,0,0.04);">`,
    `<div style="background:#227755;color:#ffffff;padding:30px 28px;text-align:center;">`,
    `<img src="${wpHeroUrl}" alt="${r.title}" style="width:170px;height:170px;object-fit:cover;border-radius:50%;border:6px solid #ffffff;margin:0 auto 16px;display:block;" />`,
    `<h2 style="font-size:26px;font-weight:700;color:#ffffff;margin:0 0 10px;">${r.title}</h2>`,
    `<p style="font-size:15px;line-height:1.65;color:#EAF5F0;max-width:620px;margin:0 auto 14px;">${r.metaDescription}</p>`,
    `<div style="font-size:16px;color:#FBBF24;margin-bottom:18px;">&#9733;&#9733;&#9733;&#9733;&#9733; <span style="font-size:13px;color:#ffffff;">5.0 from 18 reviews</span></div>`,
    `<div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">`,
    `<a href="${pdfDownloadUrl}" target="_blank" rel="noopener" download="${r.slug}.pdf" style="background:#ffffff;color:#227755;padding:10px 22px;border-radius:999px;font-size:14px;font-weight:700;text-decoration:none;display:inline-block;">📥 Download Recipe PDF</a>`,
    `<a href="${pinShareUrl}" target="_blank" rel="noopener nofollow" style="background:#D96B43;color:#ffffff;padding:10px 22px;border-radius:999px;font-size:14px;font-weight:700;text-decoration:none;display:inline-block;">📌 Pin Recipe</a>`,
    `</div></div>`,

    // Recipe Times & Servings Strip
    `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:12px;background:#FDF2E7;padding:18px 24px;border-bottom:1px solid #F0E2D4;text-align:center;">`,
    `<div><span style="font-size:12px;text-transform:uppercase;color:#8C6246;display:block;font-weight:600;">Prep Time</span><strong style="font-size:16px;color:#1a202c;">${r.prepTime}</strong></div>`,
    `<div><span style="font-size:12px;text-transform:uppercase;color:#8C6246;display:block;font-weight:600;">Cook Time</span><strong style="font-size:16px;color:#1a202c;">${r.cookTime}</strong></div>`,
    `<div><span style="font-size:12px;text-transform:uppercase;color:#8C6246;display:block;font-weight:600;">Total Time</span><strong style="font-size:16px;color:#1a202c;">${r.totalTime}</strong></div>`,
    `<div><span style="font-size:12px;text-transform:uppercase;color:#8C6246;display:block;font-weight:600;">Servings</span><strong style="font-size:16px;color:#1a202c;">${r.servings}</strong></div>`,
    `<div><span style="font-size:12px;text-transform:uppercase;color:#8C6246;display:block;font-weight:600;">Calories</span><strong style="font-size:16px;color:#D96B43;">${r.calories} kcal</strong></div>`,
    `</div>`,

    // Recipe Card Body: Ingredients & Instructions
    `<div style="padding:28px;">`,
    `<h3 style="font-size:22px;font-weight:700;color:#1a202c;margin:0 0 14px;border-bottom:2px solid #F0E2D4;padding-bottom:8px;">Ingredients</h3>`,
    `<ul style="margin:0 0 28px;padding-left:22px;">${cardIngredientsHtml}</ul>`,
    `<h3 style="font-size:22px;font-weight:700;color:#1a202c;margin:0 0 14px;border-bottom:2px solid #F0E2D4;padding-bottom:8px;">Instructions</h3>`,
    `<ol style="margin:0 0 20px;padding-left:22px;">${cardInstructionsHtml}</ol>`,
    cardTipsHtml,
    `<div style="margin-top:24px;padding:16px 20px;background:#ffffff;border:1px solid #F0E2D4;border-radius:12px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">`,
    `<span style="font-size:14px;color:#4a5568;"><strong>Nutrition per serving:</strong> ${r.calories} kcal &bull; Protein: ${r.macros?.protein || '18g'} &bull; Carbs: ${r.macros?.carbs || '48g'} &bull; Fat: ${r.macros?.fat || '14g'} &bull; Fiber: ${r.macros?.fiber || '7g'}</span>`,
    `<a href="${pdfDownloadUrl}" target="_blank" rel="noopener" download="${r.slug}.pdf" style="color:#D96B43;font-size:14px;font-weight:700;text-decoration:none;">📥 Save Printable PDF Card &rarr;</a>`,
    `</div>`,
    `</div></div>`,
    `</div>`
  ].join('\n');
}

async function main() {
  const { INITIAL_RECIPES, ITALIAN_RECIPE_CATEGORIES } = await loadRecipesFromTs();
  const existingManifest = JSON.parse(
    fs.readFileSync(path.resolve('output/published_wordpress_12_articles.json'), 'utf8')
  );
  const manifestMap = new Map(existingManifest.map((m) => [m.id, m]));

  const updatedSummary = [];

  for (let idx = 0; idx < INITIAL_RECIPES.length; idx++) {
    const r = INITIAL_RECIPES[idx];
    const prev = manifestMap.get(r.id) || {};
    const wpHeroUrl = prev.thumbnailUrl || '';
    const gallery = prev.gallery || [];
    const pdfDownloadUrl = prev.pdfUrl || `${WP_URL}/${r.slug}/#recipe`;

    const cleanHtml = buildSimpleNourishStyleArticleHtml(r, wpHeroUrl, gallery, pdfDownloadUrl);

    console.log(`[Updating Article ${idx + 1}/12] ${r.title}...`);
    // IMPORTANT: We DO NOT pass `recipe` in the payload so the AutoSync plugin does NOT append
    // the duplicate card or the raw JSON-LD '{ "@context": "https://schema.org/" ... }' text!
    const pubRes = await fetch(`${WP_URL}/wp-json/autosync/v1/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-sync-key': SYNC_KEY },
      body: JSON.stringify({
        articles: [
          {
            title: r.title,
            slug: r.slug,
            external_id: r.id,
            status: 'publish',
            post_type: 'post',
            categories: mapToWpCategories(r.italianCategory),
            tags: [
              r.focusKeyword || 'italian recipe',
              r.italianCategory,
              ...(r.pinterestPin?.hashtags?.map((h) => h.replace('#', '')) || []),
            ],
            content: cleanHtml,
          },
        ],
      }),
    });

    const pubJson = await pubRes.json();
    const resItem = pubJson?.results?.[0] || {};
    console.log(`   -> Updated Post ID ${resItem.post_id}: ${resItem.permalink}`);

    updatedSummary.push({
      ...prev,
      postId: resItem.post_id || prev.postId,
      permalink: resItem.permalink || prev.permalink,
    });
  }

  // Also update the /italian-recipes/ hub with the same warm, clean theme & colors
  const hubHtml = [
    `<div class="semplice-italian-hub" style="max-width:1060px;margin:0 auto;font-family:'Poppins',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#2d3748;">`,
    `<div style="background:#FFF8F2;border:2px solid #F0E2D4;border-radius:20px;padding:36px 30px;margin-bottom:36px;text-align:center;">`,
    `<span style="background:#227755;color:#ffffff;padding:5px 16px;border-radius:999px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;display:inline-block;margin-bottom:12px;">🇮🇹 Semplice Italian Kitchen</span>`,
    `<h2 style="font-size:32px;font-weight:700;color:#1a202c;margin:0 0 12px;">Authentic Italian Recipes &amp; Everyday Comfort Classics</h2>`,
    `<p style="font-size:17px;color:#4a5568;line-height:1.7;max-width:720px;margin:0 auto;">Explore our collection of traditional budget-friendly Italian dinners, regional classics, and cozy soups. Every recipe includes step-by-step photos and a free printable PDF recipe card.</p>`,
    `</div>`,
    `<h2 style="font-size:26px;font-weight:700;color:#1a202c;margin:0 0 18px;">Browse by Category</h2>`,
    `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;margin-bottom:42px;">`,
    ...ITALIAN_RECIPE_CATEGORIES.map(
      (c) =>
        `<div style="background:#FFF8F2;border:1px solid #F0E2D4;border-radius:14px;padding:20px;"><div style="font-size:24px;margin-bottom:6px;">${c.icon}</div><h3 style="font-size:19px;font-weight:700;color:#1a202c;margin:0 0 6px;"><a href="${WP_URL}/category/${c.slug}/" style="color:#1a202c;text-decoration:none;">${c.name}</a></h3><p style="font-size:14px;color:#4a5568;line-height:1.6;margin:0 0 12px;">${c.description}</p><a href="${WP_URL}/category/${c.slug}/" style="font-size:13px;font-weight:700;color:#227755;text-decoration:none;">View Recipes &rarr;</a></div>`
    ),
    `</div>`,
    `<h2 style="font-size:26px;font-weight:700;color:#1a202c;margin:0 0 20px;">Latest Italian Recipes</h2>`,
    `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px;">`,
    ...updatedSummary.map(
      (art) =>
        `<div style="background:#ffffff;border:1px solid #F0E2D4;border-radius:16px;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,0.04);"><a href="${art.permalink}" style="display:block;"><img src="${art.thumbnailUrl}" alt="${art.title}" style="width:100%;height:220px;object-fit:cover;display:block;" /></a><div style="padding:20px;"><span style="display:inline-block;background:#FFF8F2;color:#D96B43;border:1px solid #F0E2D4;font-size:11px;font-weight:700;padding:3px 10px;border-radius:999px;margin-bottom:8px;">${art.category}</span><h3 style="font-size:19px;font-weight:700;color:#1a202c;margin:0 0 8px;line-height:1.4;"><a href="${art.permalink}" style="color:#1a202c;text-decoration:none;">${art.title}</a></h3><p style="font-size:14px;color:#4a5568;line-height:1.6;margin:0 0 14px;">${art.metaDescription}</p><div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding-top:12px;border-top:1px solid #F0E2D4;"><a href="${art.permalink}" style="font-size:14px;font-weight:700;color:#227755;text-decoration:none;">View Recipe &rarr;</a><a href="${art.pdfUrl}" target="_blank" rel="noopener" download="${art.slug}.pdf" style="background:#D96B43;color:#ffffff;padding:7px 14px;border-radius:999px;font-size:12px;font-weight:700;text-decoration:none;">📥 Free PDF</a></div></div></div>`
    ),
    `</div></div>`,
  ].join('\n');

  await fetch(`${WP_URL}/wp-json/autosync/v1/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-sync-key': SYNC_KEY },
    body: JSON.stringify({
      articles: [
        {
          title: 'Italian Recipes — Semplice Italian Kitchen Collection',
          slug: 'italian-recipes',
          external_id: 'page-italian-recipes-hub',
          status: 'publish',
          categories: ['Italian Recipes'],
          content: hubHtml,
        },
      ],
    }),
  });

  console.log('\nAll 12 articles and /italian-recipes/ hub updated cleanly!');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
