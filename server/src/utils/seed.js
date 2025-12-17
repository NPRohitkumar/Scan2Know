const mongoose = require('mongoose')
const dotenv = require('dotenv')
const path = require('path')
const Ingredient = require('../models/Ingredient')
const Product = require('../models/Product')
const ingredientsData = require('../../../data/ingredients.json')


const cleanIngredients = (data) => {
  const map = new Map()

  data.forEach((item, index) => {
    if (!item || !item.ingredient_name) {
      console.warn(`⚠️ Skipping invalid ingredient at index ${index}`, item)
      return
    }

    // Force ingredient_name to string safely
    const name =
      typeof item.ingredient_name === 'string'
        ? item.ingredient_name
        : String(item.ingredient_name)

    const key = name.trim().toLowerCase()

    if (!key) {
      console.warn(`⚠️ Empty ingredient name at index ${index}`)
      return
    }

    if (!map.has(key)) {
      map.set(key, {
        ...item,
        ingredient_name: key // normalized
      })
    }
  })

  return Array.from(map.values())
}

// Load environment variables from the correct path
dotenv.config({ path: path.join(__dirname, '../../.env') })

const seedDatabase = async () => {
  try {
    // Debug: Check if MONGODB_URI is loaded
    if (!process.env.MONGODB_URI) {
      console.error('❌ ERROR: MONGODB_URI is not defined in .env file')
      console.log('Looking for .env file at:', path.join(__dirname, '../../.env'))
      process.exit(1)
    }

    console.log('Connecting to MongoDB...')
    console.log('URI:', process.env.MONGODB_URI)
    
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✓ Connected to MongoDB')

    // Clear existing data
    await Ingredient.deleteMany({})
    await Product.deleteMany({})
    console.log('✓ Cleared existing data')

    // Seed ingredients
    const ingredients = await Ingredient.insertMany(cleanIngredients(ingredientsData))
    console.log(`✓ Seeded ${ingredients.length} ingredients`)

    // Create demo products
    const demoProducts = [
       {
    name: 'Britannia Milk Slice Milk White Bread',
    category: 'Dairy',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour (Maida)', 'Sugar', 'Yeast', 'Milk Solids', 'Soya Flour', 'Preservative (282)', 'Calcium Salt', 'Emulsifier (471)', 'Emulsifier (481(i))', 'Acidity Regulator (260)', 'Flour Treatment Agent (510)', 'Antioxidant (300)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour (Maida), high glycemic load and may affect metabolic system; Sugar, increases dental decay risk and burdens pancreas; Yeast, generally safe but may cause bloating in sensitive individuals and affect digestive system; Milk Solids, source of saturated fat (heart) and lactose (digestive system); Soya Flour, allergen risk (immune system) but source of protein; Preservative (282), may affect digestive system and liver with chronic exposure; Calcium Salt, generally safe (bones); Emulsifier (471), may affect gut microbiota and digestive system; Emulsifier (481(i)), similar gut effects; Acidity Regulator (260), can irritate digestive system in sensitive people; Flour Treatment Agent (510), minor digestive effects; Antioxidant (300), generally safe but excessive intake may affect liver — use whole-grain or minimally processed bread instead.",
    severityCounts: { low: 6, medium: 4, high: 2 },
    organsAffected: ['digestive system', 'metabolic system', 'heart']
  },
  {
    name: 'Modern Milk Plus Bread',
    category: 'Packaged Foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour (Maida)', 'Sugar', 'Yeast', 'Edible Vegetable Fat', 'Soya Flour', 'Preservative (282)', 'Preservative (200)', 'Emulsifier (481(i))', 'Acidity Regulator (260)', 'Antioxidant (300)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour (Maida), high glycemic load and will affect metabolic system; Sugar, dental decay and pancreas; Yeast, digestive system (bloating) in sensitive people; Edible Vegetable Fat, increased saturated/trans fat risk (heart); Soya Flour, allergen potential (immune system); Preservative (282) & Preservative (200), may burden digestive system and liver with long-term exposure; Emulsifier (481(i)), gut microbiota and digestive system; Acidity Regulator (260), digestive irritation in sensitive people; Antioxidant (300), generally safe but monitor intake — use whole-grain or low-preservative versions instead.",
    severityCounts: { low: 5, medium: 3, high: 2 },
    organsAffected: ['digestive system', 'metabolic system', 'heart']
  },
  {
    name: 'Modern Classic Sweet Bun',
    category: 'Packaged Foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour (Maida)', 'Sugar', 'Edible Vegetable Fat', 'Soya Flour', 'Preservative (282)', 'Preservative (200)', 'Emulsifier (481(i))', 'Acidity Regulator (260)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour (Maida), high glycemic load (metabolic system); Sugar, dental decay and pancreas; Edible Vegetable Fat, saturated fat risk (heart); Soya Flour, allergen (immune system); Preservative (282) & Preservative (200), digestive system and liver concerns with chronic intake; Emulsifier (481(i)), may affect gut microbiota and digestive system; Acidity Regulator (260), may irritate digestive tract — enjoy occasionally; use whole-grain buns with natural fats instead.",
    severityCounts: { low: 4, medium: 3, high: 1 },
    organsAffected: ['teeth', 'pancreas', 'digestive system', 'heart']
  },
  {
    name: 'Modern Sweet Plus Bread (With Added Vitamins)',
    category: 'Packaged Foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour (Maida)', 'Sugar', 'Edible Vegetable Fat', 'Soya Flour', 'Preservative (282)', 'Emulsifier (481(i))', 'Acidity Regulator (260)', 'Antioxidant (300)', 'Vitamins'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour (Maida), metabolic load; Sugar, teeth & pancreas; Edible Vegetable Fat, heart risk if saturated; Soya Flour, allergen risk; Preservative (282), digestive & liver concerns; Emulsifier (481(i)), gut microbiota; Acidity Regulator (260), digestive irritation; Antioxidant (300), generally safe; Vitamins, beneficial but do not offset processed-base harms — prefer whole-grain vitamin-fortified options.",
    severityCounts: { low: 5, medium: 3, high: 1 },
    organsAffected: ['digestive system', 'metabolic system', 'heart']
  },
  {
    name: 'Modern Fruity Bun',
    category: 'Packaged Foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour (Maida)', 'Glazed Fruit', 'Sugar', 'Edible Vegetable Fat', 'Soya Flour', 'Preservative (282)', 'Preservative (200)', 'Emulsifier (481(i))', 'Acidity Regulator (260)', 'Antioxidant (300)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour (Maida), metabolic effects; Glazed Fruit, added sugars & possible colors (digestive system, teeth); Sugar, dental & pancreatic stress; Edible Vegetable Fat, heart risk; Soya Flour, allergen; Preservative (282) & (200), digestive & liver concerns; Emulsifier (481(i)), gut microbiota; Acidity Regulator (260), digestive irritation; Antioxidant (300), generally safe — use fruit-forward whole-grain buns without glazing as alternative.",
    severityCounts: { low: 4, medium: 4, high: 1 },
    organsAffected: ['teeth', 'pancreas', 'digestive system', 'heart']
  },
  {
    name: 'Harvest Gold Zero Maida 100% Atta Bread',
    category: 'Packaged Foods',
    ingredients: ingredients.filter(i =>
      ['Whole Wheat Flour (Atta)', 'Sugar', 'Yeast', 'Gluten', 'Wheat Bran', 'Edible Vegetable Oil'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Whole Wheat Flour (Atta), high fiber and supports digestive health (digestive system); Sugar, small amounts may affect teeth/pancreas; Yeast, safe for most (digestive system); Gluten, problematic for celiac (immune/digestive); Wheat Bran, improves digestion; Edible Vegetable Oil, depends on type (heart) — prefer this over refined flour breads as a healthier choice.",
    severityCounts: { low: 4, medium: 1, high: 0 },
    organsAffected: ['digestive system', 'metabolic system', 'heart']
  },
  {
    name: "Harvest Gold Baker's Loaf Slow Baked White Bread",
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Wheat Protein (Gluten)', 'Edible Vegetable Fat', 'Refined Soyabean Oil', 'Preservative (E282)', 'Acidity Regulator (E270)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour, metabolic load; Wheat Protein (Gluten), celiac/allergy risk (digestive/immune); Edible Vegetable Fat & Refined Soyabean Oil, fat composition affects heart; Preservative (E282), digestive & liver concerns; Acidity Regulator (E270), may irritate digestive tract — choose whole-wheat slow-baked options or minimal-additive loaves.",
    severityCounts: { low: 3, medium: 2, high: 1 },
    organsAffected: ['digestive system', 'metabolic system', 'heart']
  },
  {
    name: 'English Oven Brown Bread',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Wheat Flour (Maida)', 'Atta', 'Yeast', 'Sugar', 'Edible Vegetable Oil', 'Wheat Bran'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Wheat Flour (Maida), refined flour metabolic issues; Atta & Wheat Bran, provide fiber (digestive system); Yeast, generally safe; Sugar, teeth & pancreas; Edible Vegetable Oil, heart depends on fat type — prefer whole-wheat-rich brown breads.",
    severityCounts: { low: 4, medium: 1, high: 0 },
    organsAffected: ['digestive system', 'metabolic system', 'teeth']
  },
  {
    name: 'Britannia Muffills Double Choco',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Eggs', 'Edible Hydrogenated Vegetable Oil', 'Cocoa Powder', 'Choco Chips', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour, metabolic load; Sugar, dental decay & pancreas; Eggs, source of protein but cholesterol concerns for some (heart); Edible Hydrogenated Vegetable Oil, trans-fat risk (heart); Cocoa Powder, contains beneficial flavonoids but also caffeine (nervous system); Choco Chips, added sugars & fats (teeth, metabolic); Preservative, digestive/liver concerns — use homemade whole-grain muffins with natural cocoa and unhydrogenated oils instead.",
    severityCounts: { low: 2, medium: 2, high: 2 },
    organsAffected: ['teeth', 'pancreas', 'heart', 'digestive system']
  },
  {
    name: 'Britannia Fudge It - Chocolate Brownie',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Refined Wheat Flour (Maida)', 'Edible Vegetable Oil (Palm)', 'Eggs', 'Cocoa Solids', 'Preservative (200)', 'Emulsifier (471)', 'Acidity Regulator (260)', 'Humectant (422)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar, dental & pancreatic stress; Refined Wheat Flour (Maida), metabolic load; Edible Vegetable Oil (Palm), high saturated fat (heart); Eggs, protein and cholesterol considerations (heart); Cocoa Solids, antioxidant benefits but sugar/processing may counteract; Preservative (200), digestive/liver with chronic intake; Emulsifier (471), gut microbiota; Acidity Regulator (260), digestive irritation; Humectant (422), retains moisture but may affect digestion — prefer dark chocolate, less sugar, and non-palm oils.",
    severityCounts: { low: 2, medium: 3, high: 2 },
    organsAffected: ['teeth', 'digestive system', 'metabolic system', 'heart']
  },
  {
    name: 'Parle-G Original Glucose Biscuits',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour (Maida)', 'Sugar', 'Edible Vegetable Oil', 'Glucose', 'Milk Solids', 'Salt', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour (Maida), high glycemic index and metabolic effects; Sugar & Glucose, dental decay and pancreas; Edible Vegetable Oil, fat-related heart effects; Milk Solids, saturated fat and lactose (heart/digestive); Salt, affects blood pressure (cardiovascular system); Leavening Agent, generally low risk — use whole-grain crackers or low-sugar biscuits instead.",
    severityCounts: { low: 4, medium: 2, high: 1 },
    organsAffected: ['teeth', 'pancreas', 'heart']
  },
  {
    name: 'Britannia Marie Gold',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Edible Vegetable Oil', 'Sugar Syrup', 'Milk Solids', 'Leavening Agent', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour, metabolic system effects; Sugar & Sugar Syrup, dental decay & pancreas; Edible Vegetable Oil, heart-related concerns depending on fat; Milk Solids, saturated fat and lactose (heart/digestive); Leavening Agent, minimal risk; Salt, blood pressure (cardiovascular) — choose whole-grain Marie alternatives with less sugar.",
    severityCounts: { low: 4, medium: 2, high: 1 },
    organsAffected: ['teeth', 'pancreas', 'heart']
  },
  {
    name: 'Sunfeast Farmlite Cookies',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Edible Vegetable Oil (Palm)', 'Glucose Syrup', 'Emulsifier', 'Salt', 'Flavour'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour, metabolic load; Sugar & Glucose Syrup, teeth & pancreas; Edible Vegetable Oil (Palm), saturated fat (heart); Emulsifier, gut microbiota effects; Salt, blood pressure; Flavour additives, potential sensitivities — opt for low-sugar, whole-grain cookies or oat-based alternatives.",
    severityCounts: { low: 3, medium: 3, high: 1 },
    organsAffected: ['teeth', 'pancreas', 'heart', 'digestive system']
  },
  {
    name: 'Hide & Seek Choco Chips',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Edible Vegetable Oil', 'Cocoa Solids', 'Choco Chips (Sugar, Fat)', 'Emulsifier', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour, metabolic effects; Sugar, teeth & pancreas; Edible Vegetable Oil, heart risk depending on type; Cocoa Solids, some antioxidant benefit but processed forms reduce benefit; Choco Chips (sugar + fat), dental & metabolic issues; Emulsifier, gut microbiota; Salt, cardiovascular — use dark-chocolate-chip cookies with whole-grain base and less sugar.",
    severityCounts: { low: 3, medium: 3, high: 1 },
    organsAffected: ['teeth', 'metabolic system', 'heart']
  },
  {
    name: 'Britannia Good Day Butter Cookies',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Butter', 'Edible Vegetable Oil', 'Milk Solids', 'Leavening Agents', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour, metabolic load; Sugar, teeth & pancreas; Butter & Milk Solids, saturated fat (heart); Edible Vegetable Oil, depends on type; Leavening Agents, low risk; Salt, blood pressure concerns — choose baked goods with less butter and whole-grain flour.",
    severityCounts: { low: 3, medium: 3, high: 1 },
    organsAffected: ['heart', 'teeth', 'digestive system']
  },
  {
    name: 'Amul Cheese Slice',
    category: 'Dairy',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Cheese Culture', 'Salt', 'Preservatives', 'Emulsifiers'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids, saturated fat (heart) and lactose (digestive system); Cheese Culture, generally safe and beneficial for digestion; Salt, cardiovascular effects; Preservatives & Emulsifiers, digestive/liver concerns in excess — use natural cheese with fewer additives.",
    severityCounts: { low: 2, medium: 2, high: 1 },
    organsAffected: ['heart', 'digestive system']
  },
  {
    name: 'Amul Butter',
    category: 'Dairy',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Salt', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids (butter), high in saturated fat (heart); Salt, blood pressure; Preservative, digestive/liver with chronic exposure — prefer small amounts of natural butter or plant-based spreads for heart health.",
    severityCounts: { low: 1, medium: 1, high: 1 },
    organsAffected: ['heart', 'digestive system']
  },
  {
    name: 'Nescafe Classic Instant Coffee',
    category: 'Beverages',
    ingredients: ingredients.filter(i =>
      ['Coffee Solids', 'Anticaking Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Coffee Solids, stimulant effects (nervous system) and can increase heart rate in sensitive people; Anticaking Agent, generally low risk but may affect digestion in some — prefer freshly brewed coffee or limit intake.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['nervous system', 'cardiovascular system']
  },
  {
    name: 'Tetley Tea Bags',
    category: 'Beverages',
    ingredients: ingredients.filter(i =>
      ['Tea Leaves', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Tea Leaves, mild stimulant (nervous system) and antioxidant benefits (cardiovascular); Flavor additives, potential sensitivities — prefer plain tea or herbal alternatives if sensitive to caffeine.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['nervous system', 'cardiovascular system']
  },
  {
    name: 'Cadbury Dairy Milk Chocolate',
    category: 'Confectionery',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Cocoa Solids', 'Milk Solids', 'Emulsifier (Soy Lecithin)', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar, teeth & pancreas; Cocoa Solids, antioxidants but depending on cocoa % may be beneficial (cardiovascular); Milk Solids, saturated fat (heart); Emulsifier (Soy Lecithin), allergen potential; Flavor, possible sensitivities — choose dark chocolate with higher cocoa and less sugar.",
    severityCounts: { low: 1, medium: 2, high: 1 },
    organsAffected: ['teeth', 'heart', 'digestive system']
  },
  {
    name: 'Maggi 2-Minute Noodles (Masala)',
    category: 'Instant Foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Palm Oil', 'Salt', 'Tastemaker (Flavors)', 'MSG', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour, metabolic load; Palm Oil, saturated fat (heart); Salt & MSG, can affect blood pressure and cause sensitivity (cardiovascular/nervous system); Tastemaker & Preservative, digestive system and potential long-term effects — prefer whole-grain noodles with fresh veggies and less seasoning.",
    severityCounts: { low: 2, medium: 3, high: 1 },
    organsAffected: ['heart', 'digestive system', 'nervous system']
  },
  {
    name: 'Kellogg\'s Corn Flakes',
    category: 'Breakfast',
    ingredients: ingredients.filter(i =>
      ['Corn Flakes (Maize)', 'Sugar', 'Malt Flavor', 'Salt', 'Vitamins', 'Minerals'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Corn Flakes, processed grain with high glycemic index (metabolic system); Sugar & Malt Flavor, teeth & pancreas; Salt, blood pressure concerns; Vitamins & Minerals, beneficial but do not offset refined grain effects — use whole-grain cereals with minimal sugar.",
    severityCounts: { low: 3, medium: 1, high: 1 },
    organsAffected: ['metabolic system', 'teeth', 'cardiovascular system']
  },
  {
    name: 'MTR Ready-to-Eat Paneer Butter Masala',
    category: 'Ready Meals',
    ingredients: ingredients.filter(i =>
      ['Paneer', 'Tomato Puree', 'Edible Vegetable Oil', 'Cream', 'Salt', 'Preservatives', 'Spices'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Paneer, high saturated fat (heart) but good protein; Tomato Puree, generally safe (digestive); Edible Vegetable Oil & Cream, fat-related heart considerations; Salt & Preservatives, cardiovascular & digestive concerns; Spices, generally safe but may irritate some — prefer fresh-cooked versions with controlled oil and salt.",
    severityCounts: { low: 3, medium: 2, high: 1 },
    organsAffected: ['heart', 'digestive system']
  },
  {
    name: 'Pringles Original',
    category: 'Snacks',
    ingredients: ingredients.filter(i =>
      ['Potato Flakes', 'Vegetable Oil', 'Rice Flour', 'Salt', 'Flavorings', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potato Flakes & Rice Flour, processed carbs (metabolic system); Vegetable Oil, fat profile affects heart; Salt & Flavorings, cardiovascular and possible sensitivities; Preservative, digestive/liver concerns — choose baked potato or whole-veg snacks instead.",
    severityCounts: { low: 2, medium: 3, high: 1 },
    organsAffected: ['metabolic system', 'heart', 'digestive system']
  },
  {
    name: 'Lay\'s Classic',
    category: 'Snacks',
    ingredients: ingredients.filter(i =>
      ['Potatoes', 'Vegetable Oil', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potatoes (fried), high in calories (metabolic system); Vegetable Oil, fat and heart effects; Salt, blood pressure — occasional consumption ok; prefer baked or oven-roasted potato chips with less salt.",
    severityCounts: { low: 1, medium: 2, high: 0 },
    organsAffected: ['metabolic system', 'heart']
  },
  {
    name: 'Bingo Mad Angles',
    category: 'Snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Edible Vegetable Oil', 'Salt', 'Flavouring', 'Color'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour, metabolic load; Edible Vegetable Oil, fat/heart concerns; Salt & Flavouring, cardiovascular and sensitivities; Color additives, possible sensitivities (skin/digestive) — choose whole-grain crunchy snacks with natural seasonings.",
    severityCounts: { low: 2, medium: 3, high: 1 },
    organsAffected: ['metabolic system', 'heart', 'digestive system']
  },
  {
    name: 'Horlicks Health Drink',
    category: 'Beverages',
    ingredients: ingredients.filter(i =>
      ['Malted Barley Extract', 'Wheat Flour', 'Sugar', 'Milk Solids', 'Vitamins & Minerals'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Malted Barley & Wheat Flour, carbs (metabolic); Sugar, teeth & pancreas; Milk Solids, saturated fat (heart); Vitamins & Minerals, beneficial — prefer low-sugar versions or use in moderation.",
    severityCounts: { low: 3, medium: 1, high: 1 },
    organsAffected: ['metabolic system', 'teeth', 'heart']
  },
  {
    name: 'Kurkure Masala',
    category: 'Snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Corn Meal', 'Edible Vegetable Oil', 'Salt', 'Spices', 'Flavor Enhancers'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Corn Meal, processed carb (metabolic); Edible Vegetable Oil, fat/heart aspects; Salt, cardiovascular; Spices & Flavor Enhancers, may affect digestive/nervous system in sensitive people — pick roasted nuts or seeds as healthier snacks.",
    severityCounts: { low: 2, medium: 3, high: 1 },
    organsAffected: ['metabolic system', 'heart', 'digestive system']
  },
  {
    name: 'Pepsi',
    category: 'Beverages',
    ingredients: ingredients.filter(i =>
      ['Carbonated Water', 'Sugar', 'Color', 'Phosphoric Acid', 'Caffeine', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Carbonated Water, may cause bloating; Sugar, dental decay & pancreas; Color additives & Phosphoric Acid, may affect bone health (skeletal system) and digestive system; Caffeine, stimulant (nervous system); Preservatives, digestive/liver concerns — use water or unsweetened beverages.",
    severityCounts: { low: 1, medium: 3, high: 1 },
    organsAffected: ['teeth', 'pancreas', 'nervous system', 'skeletal system']
  },
  {
    name: 'Coca-Cola',
    category: 'Beverages',
    ingredients: ingredients.filter(i =>
      ['Carbonated Water', 'Sugar', 'Color (Caramel)', 'Phosphoric Acid', 'Caffeine', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Carbonated Water, bloating; Sugar, dental & pancreatic stress; Caramel Color & Phosphoric Acid, possible long-term effects on liver/bones; Caffeine, nervous system stimulant — prefer water or unsweetened drinks.",
    severityCounts: { low: 1, medium: 3, high: 1 },
    organsAffected: ['teeth', 'pancreas', 'nervous system', 'skeletal system']
  },
  {
    name: 'Amul Chocolate Bar',
    category: 'Confectionery',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Milk Solids', 'Cocoa Solids', 'Emulsifier', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar, dental & pancreatic stress; Milk Solids, saturated fat (heart); Cocoa Solids, antioxidant potential; Emulsifier, digestive/gut effects; Flavor, sensitivities — choose dark chocolate with higher cocoa and lower sugar.",
    severityCounts: { low: 1, medium: 2, high: 1 },
    organsAffected: ['teeth', 'heart', 'digestive system']
  },
  {
    name: 'Kissan Mixed Fruit Jam',
    category: 'Condiments',
    ingredients: ingredients.filter(i =>
      ['Fruit Pulp', 'Sugar', 'Pectin', 'Acidity Regulator', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Fruit Pulp, vitamins and fiber (digestive); Sugar, teeth & pancreas; Pectin, safe and aids digestion; Acidity Regulator & Preservative, digestive concerns in some — use fresh fruit preserves with less added sugar.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['digestive system', 'teeth', 'pancreas']
  },
  {
    name: 'Amul Taaza Milk (Tetra Pack)',
    category: 'Dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Stabilizers', 'Vitamins'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk, source of calcium & protein but contains saturated fat (heart) and lactose (digestive); Stabilizers, low risk but may affect digestion for some; Vitamins, beneficial — choose toned/low-fat options if concerned about heart health.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['heart', 'digestive system', 'bones']
  },
  {
    name: 'Emami Navratna Oil',
    category: 'Cooking Oil',
    ingredients: ingredients.filter(i =>
      ['Vegetable Oil Blend', 'Antioxidants'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Vegetable Oil Blend, fatty acid profile affects heart (depends on unsaturated vs saturated content); Antioxidants, generally safe — prefer oils high in unsaturated fats like sunflower or olive oil for heart health.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['heart']
  },
  {
    name: 'Fortune Sunflower Oil',
    category: 'Cooking Oil',
    ingredients: ingredients.filter(i =>
      ['Sunflower Oil', 'Antioxidants'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sunflower Oil, high in unsaturated fats (heart-beneficial when used properly); Antioxidants, protective — use in moderation and avoid repeated high-heat reuse.",
    severityCounts: { low: 2, medium: 0, high: 0 },
    organsAffected: ['heart']
  },
  {
    name: 'Dabur Honey',
    category: 'Condiments',
    ingredients: ingredients.filter(i =>
      ['Honey'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Honey, natural sweetener but still sugar (teeth & pancreas) and caloric — use in moderation and prefer raw/local honey when possible.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['teeth', 'pancreas']
  },
  {
    name: 'Saffola Gold',
    category: 'Cooking Oil',
    ingredients: ingredients.filter(i =>
      ['Rice Bran Oil', 'Antioxidants', 'Vitamins'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Rice Bran Oil, favorable fatty acid profile (heart) and high smoke point; Antioxidants & Vitamins, beneficial — good option for cooking with heart-friendly choice.",
    severityCounts: { low: 2, medium: 0, high: 0 },
    organsAffected: ['heart']
  },
  {
    name: 'Amul Kool Chocolate Milk',
    category: 'Beverages',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Sugar', 'Cocoa', 'Flavors', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk, saturated fat (heart) and lactose (digestive); Sugar & Cocoa, teeth & pancreas; Flavors & Preservatives, possible sensitivities and digestive concerns — choose low-sugar or homemade chocolate milk with reduced sugar.",
    severityCounts: { low: 2, medium: 2, high: 1 },
    organsAffected: ['heart', 'teeth', 'pancreas']
  },
  {
    name: 'Mother\'s Recipe Mango Pickle',
    category: 'Condiments',
    ingredients: ingredients.filter(i =>
      ['Mango', 'Salt', 'Mustard Oil', 'Spices', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Mango, natural fruit (digestive); Salt, high-sodium (cardiovascular); Mustard Oil, strong flavor and varied effects on heart depending on use; Spices, digestive/nutrient benefits; Preservative, digestive/liver with chronic exposure — use homemade pickles with less salt if possible.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['digestive system', 'cardiovascular system']
  },
  {
    name: 'Dairy Milk Silk',
    category: 'Confectionery',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Milk Solids', 'Cocoa Butter', 'Emulsifier', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar, dental & pancreas; Milk Solids & Cocoa Butter, saturated fat (heart); Emulsifier, gut microbiota; Flavor, sensitivities — pick dark chocolate with higher cocoa and less sugar as alternative.",
    severityCounts: { low: 1, medium: 2, high: 1 },
    organsAffected: ['teeth', 'heart', 'digestive system']
  },
  {
    name: 'Bournvita',
    category: 'Beverages',
    ingredients: ingredients.filter(i =>
      ['Malted Cereals', 'Sugar', 'Milk Solids', 'Vitamins & Minerals', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Malted Cereals, carbs (metabolic); Sugar, teeth & pancreas; Milk Solids, saturated fat; Vitamins & Minerals, beneficial; Flavor, sensitivities — select low-sugar or use in small quantities.",
    severityCounts: { low: 3, medium: 1, high: 1 },
    organsAffected: ['metabolic system', 'teeth', 'heart']
  },
  {
    name: 'Kurkure Green Chutney',
    category: 'Snacks',
    ingredients: ingredients.filter(i =>
      ['Corn Meal', 'Edible Vegetable Oil', 'Spices', 'Salt', 'Flavorings'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Corn Meal, processed carb (metabolic); Edible Vegetable Oil, fat/heart concerns; Spices & Flavorings, digestive/nervous effects in sensitive people; Salt, blood pressure — choose baked snacks with real herbs and less oil.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system', 'heart', 'digestive system']
  },
  {
    name: 'Aashirvaad Atta (Whole Wheat)',
    category: 'Staples',
    ingredients: ingredients.filter(i =>
      ['Whole Wheat Flour (Atta)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Whole Wheat Flour (Atta), high fiber and supports digestion (digestive system) and better glycemic profile (metabolic system) — recommended over refined flour.",
    severityCounts: { low: 3, medium: 0, high: 0 },
    organsAffected: ['digestive system', 'metabolic system']
  },
  {
    name: 'Tata Salt Iodised',
    category: 'Staples',
    ingredients: ingredients.filter(i =>
      ['Salt', 'Iodine'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Salt, necessary but excess affects blood pressure (cardiovascular system); Iodine, essential for thyroid (endocrine system) — use controlled amounts of iodised salt.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['cardiovascular system', 'endocrine system']
  },
  {
    name: 'SugerFree Chewables (Artificial Sweetener)',
    category: 'Sweeteners',
    ingredients: ingredients.filter(i =>
      ['Artificial Sweetener (Sucralose/Aspartame)', 'Bulking Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Artificial Sweetener (Sucralose/Aspartame), low-calorie substitute but potential sensitivities (nervous/digestive systems); Bulking Agent, generally low risk — use natural sweeteners like stevia or small amounts of sugar depending on health goals.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['digestive system', 'nervous system']
  },
  {
    name: 'Knorr Veg Soup',
    category: 'Instant Foods',
    ingredients: ingredients.filter(i =>
      ['Dehydrated Vegetables', 'Salt', 'Flavour Enhancers', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Dehydrated Vegetables, nutrients preserved; Salt & Flavour Enhancers, cardiovascular and sensitivity issues; Preservatives, digestive/liver concerns — prefer fresh vegetable soups with low salt.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['digestive system', 'cardiovascular system']
  },
  {
    name: 'Dove Chocolate',
    category: 'Confectionery',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Cocoa Solids', 'Milk Solids', 'Emulsifier (Lecithin)', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar, teeth & pancreas; Cocoa Solids, antioxidant benefit depending on cocoa %; Milk Solids, saturated fat (heart); Emulsifier, digestive/gut effects; Flavor, sensitivities — choose high-cocoa dark variants with reduced sugar.",
    severityCounts: { low: 1, medium: 2, high: 1 },
    organsAffected: ['teeth', 'heart', 'digestive system']
  },
  {
    name: 'Patanjali Chyawanprash',
    category: 'Health Foods',
    ingredients: ingredients.filter(i =>
      ['Herbal Extracts', 'Sugar', 'Honey', 'Sesame Oil'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Herbal Extracts, traditional benefits for immunity (immune system); Sugar & Honey, caloric load and teeth/pancreas effects; Sesame Oil, healthy fats in moderation (heart) — use small amounts and consult healthcare if diabetic.",
    severityCounts: { low: 3, medium: 1, high: 1 },
    organsAffected: ['immune system', 'teeth', 'pancreas', 'heart']
  },
  {
    name: 'Gits Ready Mix Idli',
    category: 'Instant Foods',
    ingredients: ingredients.filter(i =>
      ['Rice Flour', 'Urad Dal Powder', 'Salt', 'Fermentation Agent', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Rice Flour & Urad Dal Powder, balanced carbs and protein but processed (metabolic/digestive); Salt, cardiovascular; Fermentation Agent, aids digestibility; Preservative, digestive/liver concerns — homemade idli with minimal additives is preferable.",
    severityCounts: { low: 3, medium: 1, high: 0 },
    organsAffected: ['digestive system', 'metabolic system', 'cardiovascular system']
  },
  {
    name: 'Haldiram\'s Bhujia',
    category: 'Snacks',
    ingredients: ingredients.filter(i =>
      ['Gram Flour', 'Edible Vegetable Oil', 'Salt', 'Spices', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Gram Flour, protein-rich legume (digestive/nutritional); Edible Vegetable Oil, fat/heart concerns; Salt, blood pressure; Spices, digestive stimulation; Preservative, digestive/liver with chronic exposure — choose roasted chana as a healthier crunchy snack.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['digestive system', 'heart']
  },
  {
    name: 'Hershey\'s Kisses',
    category: 'Confectionery',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Cocoa', 'Milk Fat', 'Emulsifier', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar, teeth & pancreas; Cocoa, antioxidant potential; Milk Fat, saturated fat (heart); Emulsifier & Flavor, digestive or sensitivity issues for some — opt for darker chocolates with less sugar.",
    severityCounts: { low: 1, medium: 2, high: 1 },
    organsAffected: ['teeth', 'heart', 'digestive system']
  },
  {
    name: 'Glenmark Paracetamol Tablets',
    category: 'Pharmaceuticals',
    ingredients: ingredients.filter(i =>
      ['Paracetamol'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Paracetamol, analgesic/antipyretic effective for pain/fever (nervous and systemic use) but overdosing may affect liver — use as directed and avoid excess alcohol; alternative: consult physician for appropriate pain management.",
    severityCounts: { low: 0, medium: 0, high: 1 },
    organsAffected: ['liver', 'nervous system']
  },
  {
    name: 'Dettol Antiseptic Liquid',
    category: 'Personal Care',
    ingredients: ingredients.filter(i =>
      ['Chloroxylenol', 'Isopropyl Alcohol', 'Fragrance'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Chloroxylenol, antiseptic (skin/microbial); Isopropyl Alcohol, antiseptic but can dry skin; Fragrance, possible irritation/allergy (skin) — use as directed and avoid ingestion.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['skin']
  },
  {
    name: 'Colgate Toothpaste',
    category: 'Personal Care',
    ingredients: ingredients.filter(i =>
      ['Fluoride', 'Abrasives', 'Sodium Lauryl Sulfate', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Fluoride, prevents dental caries (teeth) but toxic in large doses; Abrasives, clean teeth but may wear enamel if overused; Sodium Lauryl Sulfate, may irritate oral mucosa in some; Flavor, sensitivities — use appropriate fluoride toothpaste in recommended amounts.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['teeth', 'oral mucosa']
  },
  {
    name: 'Surf Excel Detergent Powder',
    category: 'Household',
    ingredients: ingredients.filter(i =>
      ['Surfactants', 'Builders', 'Optical Brighteners', 'Fragrances'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Surfactants & Builders, effective cleaning but may irritate skin (skin); Optical Brighteners & Fragrances, possible sensitivities/allergies — use gloves and rinse garments thoroughly.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['skin']
  },
  {
    name: 'Gillette Mach3 Razor Pack',
    category: 'Personal Care',
    ingredients: ingredients.filter(i =>
      ['Stainless Steel Blades', 'Lubricant Strip'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Stainless Steel Blades, involve risk of cuts if misused (skin); Lubricant Strip, improves glide but may contain fragrances causing irritation — use carefully and replace blades regularly.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['skin']
  },
  {
    name: 'Patanjali Dant Kanti Toothpaste',
    category: 'Personal Care',
    ingredients: ingredients.filter(i =>
      ['Herbal Extracts', 'Fluoride', 'Abrasives', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Herbal Extracts, may support oral health (teeth); Fluoride, prevents decay but use recommended amounts; Abrasives, cleaning action (teeth) with erosion risk if overused; Flavor, sensitivities — good herbal option if fluoride amount is appropriate.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['teeth', 'oral mucosa']
  },
  {
    name: 'Britannia NutriChoice Digestive',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Whole Wheat Flour', 'Sugar', 'Edible Vegetable Oil', 'Bran', 'Salt', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Whole Wheat Flour , higher fiber and aids digestion and will affect the organs digestive system , use atta/wholegrain instead. Sugar , raises blood glucose and will affect the organs pancreas & teeth , use minimal jaggery or fruit instead. Edible Vegetable Oil , source of fats and will affect the organs heart depending on fat type , use unsaturated oils instead. Bran , improves bowel health and will affect the organs digestive system , use natural bran-enriched products instead. Salt , excess raises blood pressure and will affect the organs cardiovascular system , use iodised salt in controlled amounts instead. Leavening Agent , generally low risk but may cause bloating and will affect the organs digestive system , use natural fermentation where possible instead.",
    severityCounts: { low: 4, medium: 1, high: 0 },
    organsAffected: ['digestive system', 'pancreas', 'teeth', 'cardiovascular system']
  },
  {
    name: 'Britannia NutriChoice Oats',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Oats', 'Refined Wheat Flour', 'Sugar', 'Edible Vegetable Oil', 'Salt', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fiber that supports heart & digestion and will affect the organs heart & digestive system , use rolled/steel-cut oats instead. Refined Wheat Flour , high glycemic and will affect the organs metabolic system , use whole-wheat flour instead. Sugar , raises blood glucose and will affect the organs pancreas & teeth , use less sugar or natural sweeteners instead. Edible Vegetable Oil , source of fat and will affect the organs heart depending on fat type , use healthier oils instead. Salt , excess raises blood pressure and will affect the organs cardiovascular system , use limited iodised salt instead. Emulsifier , may alter gut microbiota and will affect the organs digestive system , use clean-label recipes instead.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['heart', 'digestive system', 'pancreas', 'teeth', 'cardiovascular system']
  },
  {
    name: 'McVitie\'s Digestive',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Whole Wheat Flour', 'Sugar', 'Vegetable Oil', 'Salt', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , high glycemic index and will affect the organs metabolic system , use whole-wheat flour instead. Whole Wheat Flour , fiber-rich and will affect the organs digestive system beneficially , use whole-wheat based biscuits. Sugar , increases caries risk and will affect the organs teeth & pancreas , use minimal sweeteners instead. Vegetable Oil , fat source and will affect the organs heart depending on type , use unsaturated oils instead. Salt , excess raises BP and will affect the organs cardiovascular system , reduce salt instead. Leavening Agent , may cause gas and will affect the organs digestive system , prefer naturally leavened options instead.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system', 'digestive system', 'teeth', 'cardiovascular system']
  },
  {
    name: 'Parle Monaco Salted',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Edible Vegetable Oil', 'Salt', 'Malt Extract', 'Leavening Agent', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-grain flour instead. Edible Vegetable Oil , frying oil that will affect the organs heart depending on fat profile , use baked snacks or better oils instead. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt instead. Malt Extract , added sugars and will affect the organs pancreas & teeth , use less added sweeteners instead. Leavening Agent , may cause bloating and will affect the organs digestive system , prefer naturally aerated products instead. Flavor , additives may trigger sensitivities and will affect the organs digestive or immune systems in sensitive people , use natural herbs/spices instead.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system', 'heart', 'cardiovascular system', 'pancreas', 'teeth', 'digestive system']
  },
  {
    name: 'Bakers Choice Plum Cake',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Eggs', 'Edible Vegetable Oil', 'Glazed Fruit', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-wheat or almond flour instead. Sugar , high sugar and will affect the organs pancreas & teeth , use reduced sugar or fruit puree instead. Eggs , rich in protein but cholesterol for some and will affect the organs heart in sensitive individuals , use egg alternatives if needed. Edible Vegetable Oil , fat source and will affect the organs heart depending on type , use unhydrogenated oils instead. Glazed Fruit , added sugars and colors and will affect the organs teeth & digestive system , use natural dried fruit instead. Preservative , prolongs shelf life and will affect the organs liver & digestive system with chronic consumption , prefer preservative-free or fresh cakes instead.",
    severityCounts: { low: 2, medium: 3, high: 1 },
    organsAffected: ['metabolic system', 'pancreas', 'teeth', 'heart', 'liver', 'digestive system']
  },
  {
    name: 'Britannia Cheese Slices',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Salt', 'Emulsifiers', 'Preservatives', 'Cheese Culture'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids , saturated fat and will affect the organs heart & digestive system , use low-fat or fermented cheeses instead. Salt , excess sodium and will affect the organs cardiovascular system , use lower-salt options. Emulsifiers , texture aids that may affect gut microbiota and will affect the organs digestive system , choose minimal-additive cheeses. Preservatives , extend shelf life and will affect the organs liver & digestive system long-term , prefer fresh cheese. Cheese Culture , fermentation aids digestion and will affect the organs digestive system beneficially , use cultured dairy where possible.",
    severityCounts: { low: 2, medium: 2, high: 1 },
    organsAffected: ['heart', 'digestive system', 'cardiovascular system', 'liver']
  },
  {
    name: 'Amul Paneer Cubes',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Culture', 'Salt', 'Stabilizer'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , source of saturated fat and will affect the organs heart & digestive system , use low-fat paneer or tofu instead. Culture , beneficial for digestibility and will affect the organs digestive system positively , prefer cultured paneer. Salt , excess sodium and will affect the organs cardiovascular system , use less salt. Stabilizer , texture aid and may affect digestion in some and will affect the organs digestive system , choose minimal-processing paneer.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['heart', 'digestive system', 'cardiovascular system']
  },
  {
    name: 'Amul Fresh Cream',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk Fat', 'Stabilizers', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Fat , high in saturated fat and will affect the organs heart , use light cream or plant-based creams instead. Stabilizers , texture agents and will affect the organs digestive system in sensitive people , choose simple ingredient cream. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic use , prefer fresh cream without preservatives.",
    severityCounts: { low: 1, medium: 1, high: 1 },
    organsAffected: ['heart', 'digestive system', 'liver']
  },
  {
    name: 'Britannia Cheese Spread',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Edible Vegetable Oil', 'Salt', 'Emulsifiers', 'Preservatives', 'Flavour'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids , saturated fat and will affect the organs heart & digestive system , use low-fat natural cheese instead. Edible Vegetable Oil , added fat and will affect the organs heart depending on type , choose healthier oil profiles. Salt , excess sodium and will affect the organs cardiovascular system , use reduced-salt spreads. Emulsifiers , may affect gut microbiota and will affect the organs digestive system , prefer minimal-emulsifier spreads. Preservatives , prolong shelf life and will affect the organs liver & digestive system with long-term exposure , choose fresh spreads. Flavour , additives may trigger sensitivities and will affect the organs digestive or immune systems in sensitive people , use natural flavorings instead.",
    severityCounts: { low: 2, medium: 3, high: 1 },
    organsAffected: ['heart', 'digestive system', 'cardiovascular system', 'liver']
  },
  {
    name: 'Sunfeast Dark Fantasy Chocobake',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Vegetable Oil', 'Cocoa Solids', 'Emulsifier', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use wholegrain flour. Sugar , raises blood glucose and will affect the organs pancreas & teeth , use less sugar. Vegetable Oil , fat source and will affect the organs heart depending on type , use unhydrogenated oils. Cocoa Solids , antioxidant potential but processed forms and will affect the organs heart & nervous system mildly , prefer high-cocoa content. Emulsifier , may affect gut microbiota and will affect the organs digestive system , prefer minimal additives. Preservative , prolongs shelf life and will affect the organs liver & digestive system long-term , choose fresh-baked goods.",
    severityCounts: { low: 2, medium: 3, high: 1 },
    organsAffected: ['metabolic system', 'pancreas', 'teeth', 'heart', 'digestive system', 'liver']
  },
  {
    name: 'Nestle KitKat',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Milk Solids', 'Cocoa Solids', 'Vegetable Oil', 'Emulsifier', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use wholegrain wafers. Sugar , cariogenic and will affect the organs teeth & pancreas , use reduced sugar variants. Milk Solids , saturated fats and will affect the organs heart , choose low-fat chocolate. Cocoa Solids , antioxidant benefits at higher cocoa percentages and will affect the organs heart & nervous system positively when high-cocoa. Vegetable Oil , fat profile affects heart and will affect the organs cardiovascular system , avoid palm/hydrogenated oils. Emulsifier , may affect gut microbiota and will affect the organs digestive system , prefer lecithin-free options. Flavor , additives may trigger sensitivities and will affect the organs digestive or immune systems in sensitive people , use natural flavors if possible.",
    severityCounts: { low: 2, medium: 3, high: 1 },
    organsAffected: ['metabolic system', 'teeth', 'pancreas', 'heart', 'digestive system']
  },
  {
    name: 'Kellogg\'s Corn Flakes (Honey)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Corn Flakes', 'Sugar', 'Honey', 'Salt', 'Vitamins', 'Minerals'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Corn Flakes , processed cereal and will affect the organs metabolic system , use whole-grain cereals. Sugar , added sugars and will affect the organs pancreas & teeth , reduce added sugar. Honey , natural sweetener but still sugar and will affect the organs teeth & pancreas , use sparingly. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Vitamins , fortification is beneficial and will affect the organs overall nutrition positively , prefer cereals with nutrients and low sugar. Minerals , beneficial and will affect the organs metabolic & skeletal systems positively , continue balanced intake.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system', 'pancreas', 'teeth', 'cardiovascular system', 'skeletal system']
  },
  {
    name: 'Tata Sampann Moong Dal',
    category: 'staples',
    ingredients: ingredients.filter(i =>
      ['Moong Dal (Split)', 'Salt (if packaged)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Moong Dal (Split) , protein-rich legume and will affect the organs digestive & metabolic systems beneficially , use as staple protein. Salt (if packaged) , excess sodium and will affect the organs cardiovascular system , use minimal added salt.",
    severityCounts: { low: 2, medium: 0, high: 0 },
    organsAffected: ['digestive system', 'metabolic system', 'cardiovascular system']
  },
  {
    name: 'MDH Garam Masala',
    category: 'spices',
    ingredients: ingredients.filter(i =>
      ['Coriander', 'Cumin', 'Cinnamon', 'Cardamom', 'Clove', 'Black Pepper'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Coriander , digestive aid and will affect the organs digestive system beneficially , use whole spices. Cumin , aids digestion and will affect the organs digestive system beneficially , use roasted cumin. Cinnamon , may help glycemic control and will affect the organs metabolic & cardiovascular systems beneficially in moderation , use Ceylon cinnamon where possible. Cardamom , digestive & breath benefits and will affect the organs digestive system beneficially , use as spice. Clove , antimicrobial and will affect the organs digestive & oral health beneficially in small amounts , use raw/whole clove. Black Pepper , improves absorption and will affect the organs digestive & metabolic systems beneficially , pair with turmeric for better effect.",
    severityCounts: { low: 5, medium: 0, high: 0 },
    organsAffected: ['digestive system', 'metabolic system', 'cardiovascular system', 'oral health']
  },
  {
    name: 'Tata Tea Gold',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Tea Leaves', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Tea Leaves , contains caffeine and antioxidants and will affect the organs nervous & cardiovascular systems depending on intake , use decaffeinated or herbal teas if sensitive. Flavor , additives may cause sensitivity and will affect the organs digestive or immune systems in sensitive individuals , prefer plain tea.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['nervous system', 'cardiovascular system', 'digestive system']
  },
  {
    name: 'Red Label Tea',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Black Tea Leaves'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Black Tea Leaves , antioxidant-rich but caffeinated and will affect the organs nervous & cardiovascular systems depending on amount , use in moderation or choose green/herbal tea. ",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['nervous system', 'cardiovascular system']
  },
  {
    name: 'Campbell\'s Soup (Tomato)',
    category: 'ready meals',
    ingredients: ingredients.filter(i =>
      ['Tomato Puree', 'Salt', 'Sugar', 'Stabilizers', 'Preservatives', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Tomato Puree , source of lycopene and will affect the organs digestive & cardiovascular systems beneficially , use fresh puree when possible. Salt , excess sodium and will affect the organs cardiovascular system , use low-salt versions. Sugar , added sugar and will affect the organs pancreas & teeth , reduce added sugar. Stabilizers , texture aids that may affect digestion in sensitive people and will affect the organs digestive system , prefer minimal-stabilizer soups. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , choose fresh soups when possible. Flavor , additives may cause sensitivity and will affect the organs digestive or immune systems in sensitive people , prefer natural seasoning.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['digestive system', 'cardiovascular system', 'pancreas', 'teeth', 'liver']
  },
  {
    name: 'MTR Ready-to-Eat Dal Makhani',
    category: 'ready meals',
    ingredients: ingredients.filter(i =>
      ['Whole Black Gram', 'Butter', 'Cream', 'Salt', 'Preservative', 'Spices'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Whole Black Gram , protein and fiber-rich and will affect the organs digestive & metabolic systems beneficially , use as protein source. Butter , saturated fat and will affect the organs heart , reduce butter. Cream , adds saturated fat and will affect the organs heart , use low-fat alternatives. Salt , excess sodium and will affect the organs cardiovascular system , control salt. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic use , prefer freshly cooked dal. Spices , generally beneficial and will affect the organs digestive system positively in moderate amounts , use natural spices.",
    severityCounts: { low: 3, medium: 2, high: 1 },
    organsAffected: ['digestive system', 'metabolic system', 'heart', 'cardiovascular system', 'liver']
  },
  {
    name: 'Tropicana Fruit Juice (Mixed Fruit)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Fruit Juices', 'Sugar', 'Preservatives', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Fruit Juices , provide vitamins but concentrated sugars and will affect the organs pancreas & teeth , prefer whole fruit. Sugar , added sugar and will affect the organs pancreas & teeth , choose no-added-sugar variants. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , pick fresh-pressed juices. Flavor , additives may cause sensitivity and will affect the organs digestive or immune systems in sensitive people , use natural fruit-only juices.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['pancreas', 'teeth', 'digestive system', 'liver']
  },
  {
    name: 'Paper Boat Aam Panna',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Tamarind', 'Raw Mango Extract', 'Sugar', 'Salt', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Tamarind , digestive aid and will affect the organs digestive system beneficially , use natural tamarind. Raw Mango Extract , source of vitamin C and will affect the organs immune & digestive systems positively , prefer natural extract. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Salt , electrolyte function but excess affects cardiovascular system and will affect the organs cardiovascular system , use minimal salt. Preservatives , prolong shelf life and will affect the organs liver & digestive system long-term , choose preservative-free versions.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['digestive system', 'immune system', 'pancreas', 'teeth', 'cardiovascular system', 'liver']
  },
  {
    name: 'Horlicks Chocolate',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Malted Barley', 'Wheat Flour', 'Sugar', 'Milk Solids', 'Vitamins & Minerals', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Malted Barley , carbohydrate source and will affect the organs metabolic system , consume in moderation. Wheat Flour , carb content that will affect the organs metabolic system , prefer whole grains. Sugar , added sugar and will affect the organs pancreas & teeth , lower sugar intake recommended. Milk Solids , saturated fat and lactose affecting heart & digestion and will affect the organs heart & digestive system , use low-fat milk. Vitamins & Minerals , fortification benefits and will affect the organs overall nutrition positively , keep balanced. Flavor , additives may cause sensitivity and will affect the organs digestive or immune systems in sensitive individuals , pick natural flavors.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system', 'pancreas', 'teeth', 'heart', 'digestive system']
  },
  {
    name: 'Knorr Masala-ae-Magic',
    category: 'seasoning',
    ingredients: ingredients.filter(i =>
      ['Spice Mix', 'Salt', 'MSG', 'Anti-caking Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Spice Mix , flavoring with digestive benefits and will affect the organs digestive system positively in moderation , use pure spices. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. MSG , flavor enhancer that may cause sensitivity in some and will affect the organs nervous & digestive systems in susceptible individuals , prefer no-MSG seasonings. Anti-caking Agent , low risk but chemical additive and will affect the organs digestive system in some people , choose natural spice blends.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['digestive system', 'cardiovascular system', 'nervous system']
  },
  {
    name: 'Gatorade',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Water', 'Electrolytes (Salt)', 'Sugar', 'Flavor', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Water , essential hydration and will affect the organs overall beneficially , drink adequate water. Electrolytes (Salt) , restore electrolytes but excess sodium affects cardiovascular system and will affect the organs cardiovascular system , use as needed for heavy exercise. Sugar , energy source but excess affects pancreas & teeth and will affect the organs pancreas & teeth , prefer lower-sugar sports drinks. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in some people , choose natural flavors. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic use , prefer fresh hydration options where possible.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['pancreas', 'teeth', 'cardiovascular system', 'digestive system', 'liver']
  },
  {
    name: 'Sprite',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Carbonated Water', 'Sugar', 'Citric Acid', 'Flavor', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Carbonated Water , may cause bloating and will affect the organs digestive system , consider still water. Sugar , high sugar and will affect the organs pancreas & teeth , choose low/no-sugar variants. Citric Acid , acidity may erode enamel and will affect the organs teeth , limit intake. Flavor , additives may cause sensitivity and will affect the organs digestive or immune systems in sensitive people , prefer natural flavors. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , avoid frequent consumption.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['digestive system', 'pancreas', 'teeth', 'liver']
  },
  {
    name: 'Red Bull',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Caffeine', 'Taurine', 'Sugar', 'B-group Vitamins', 'Carbonated Water', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Caffeine , stimulant and will affect the organs nervous & cardiovascular systems (heart rate) , limit intake. Taurine , amino acid with limited evidence and will affect the organs nervous system modestly , use cautiously. Sugar , increases caloric load and will affect the organs pancreas & teeth , prefer sugar-free variants if needed. B-group Vitamins , supportive but not a substitute for diet and will affect the organs metabolic processes positively , maintain balanced diet. Carbonated Water , may cause bloating and will affect the organs digestive system , drink in moderation. Preservatives , prolong shelf life and will affect the organs liver & digestive system long-term , avoid frequent consumption.",
    severityCounts: { low: 2, medium: 3, high: 1 },
    organsAffected: ['nervous system', 'cardiovascular system', 'pancreas', 'teeth', 'liver']
  },
  {
    name: 'MTR Upma Mix',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Semolina (Rava)', 'Vegetable Oil', 'Salt', 'Spices', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Semolina (Rava) , refined cereal and will affect the organs metabolic system , use whole grain rava. Vegetable Oil , fat source and will affect the organs heart depending on type , use healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Spices , digestive benefits and will affect the organs digestive system positively in moderation , use fresh spices. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic use , cook fresh when possible.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['metabolic system', 'heart', 'cardiovascular system', 'digestive system', 'liver']
  },
  {
    name: 'Knorr Instant Noodles (Creamy)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Milk Powder', 'Flavour Mix', 'MSG', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-grain noodles. Vegetable Oil , frying fat and will affect the organs heart depending on type , use better oils or baked noodles. Milk Powder , dairy add-on and will affect the organs heart & digestion in lactose-sensitive individuals , use lactose-free options if needed. Flavour Mix , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , prefer fresh seasoning. MSG , flavor enhancer that causes sensitivity in some and will affect the organs nervous & digestive systems in susceptible individuals , choose MSG-free versions. Preservatives , extend shelf life and will affect the organs liver & digestive system long-term , prefer fresh meal preparation.",
    severityCounts: { low: 2, medium: 3, high: 1 },
    organsAffected: ['metabolic system', 'heart', 'digestive system', 'nervous system', 'liver']
  },
  {
    name: 'Knorr Stock Cubes (Veg)',
    category: 'seasoning',
    ingredients: ingredients.filter(i =>
      ['Salt', 'Vegetable Fat', 'Flavour Enhancers', 'Preservatives', 'Anti-caking Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Salt , high sodium and will affect the organs cardiovascular system , reduce use. Vegetable Fat , saturated fat profile may affect the organs heart , prefer healthier fats. Flavour Enhancers , may cause sensitivity and will affect the organs nervous & digestive systems in susceptible people , use natural stock. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , use fresh vegetable stock. Anti-caking Agent , low immediate risk but additive and will affect the organs digestive system in some individuals , opt for natural products.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['cardiovascular system', 'heart', 'nervous system', 'digestive system', 'liver']
  },
  {
    name: 'Peanut Butter (Branded)',
    category: 'spreads',
    ingredients: ingredients.filter(i =>
      ['Peanuts', 'Sugar', 'Hydrogenated Vegetable Oil', 'Salt', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Peanuts , protein and healthy fats and will affect the organs heart & metabolic system beneficially in unsweetened form , use 100% roasted peanuts. Sugar , added sugar and will affect the organs pancreas & teeth , choose no-sugar peanut butter. Hydrogenated Vegetable Oil , trans fats and will affect the organs heart adversely , avoid hydrogenated oils. Salt , excess sodium and will affect the organs cardiovascular system , pick low-salt varieties. Emulsifier , texture aid may affect gut microbiota and will affect the organs digestive system in sensitive people , prefer single-ingredient butters.",
    severityCounts: { low: 2, medium: 2, high: 1 },
    organsAffected: ['heart', 'metabolic system', 'pancreas', 'teeth', 'digestive system', 'cardiovascular system']
  },
  {
    name: 'Nutella Hazelnut Spread',
    category: 'spreads',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Palm Oil', 'Hazelnuts', 'Cocoa', 'Skim Milk Powder', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , high added sugar and will affect the organs pancreas & teeth , use less-sweet alternatives. Palm Oil , high saturated fat and will affect the organs heart , avoid palm oil. Hazelnuts , healthy nuts and will affect the organs heart & metabolic system beneficially in moderation , prefer higher-nut-content spreads. Cocoa , antioxidant properties and will affect the organs heart & nervous system beneficially when high-quality and less processed , choose high-cocoa variants. Skim Milk Powder , dairy content and will affect the organs digestive system in sensitive people and heart in full-fat context , consider plant-based spreads. Emulsifier , additive that may affect gut microbiota and will affect the organs digestive system in sensitive people , select clean-label spreads.",
    severityCounts: { low: 1, medium: 3, high: 1 },
    organsAffected: ['pancreas', 'teeth', 'heart', 'digestive system', 'metabolic system', 'nervous system']
  },
  {
    name: 'Garden Fresh Mixed Veg (Frozen)',
    category: 'frozen foods',
    ingredients: ingredients.filter(i =>
      ['Carrot', 'Peas', 'Beans', 'Corn', 'Antioxidant', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Carrot , vitamin A source and will affect the organs vision & immune system beneficially , use fresh carrots. Peas , plant protein & fiber and will affect the organs digestive & metabolic systems beneficially , prefer fresh peas. Beans , fiber and protein supportive and will affect the organs digestive & metabolic systems beneficially , use fresh beans. Corn , carbohydrate and fiber and will affect the organs metabolic & digestive systems , prefer fresh corn. Antioxidant , protects oxidation and will affect the organs cellular health beneficially in moderate amounts , prefer minimal additives. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , choose minimally processed frozen veg without preservatives.",
    severityCounts: { low: 5, medium: 0, high: 0 },
    organsAffected: ['vision', 'immune system', 'digestive system', 'metabolic system', 'liver']
  },
  {
    name: 'Kurkure Masala Munch',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Corn Meal', 'Vegetable Oil', 'Salt', 'Flavourings', 'Spices', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Corn Meal , processed carb and will affect the organs metabolic system , use whole grain snacks. Vegetable Oil , fat source and will affect the organs heart depending on type , opt for better oils. Salt , high sodium and will affect the organs cardiovascular system , reduce salt. Flavourings , additives may trigger sensitivity and will affect the organs digestive or immune systems in sensitive people , choose natural seasonings. Spices , natural but strong and will affect the organs digestive system beneficially in moderation , prefer real spices. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , choose preservative-free options.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system', 'heart', 'cardiovascular system', 'digestive system', 'liver']
  },
  {
    name: 'Lay\'s Wavy (Sour Cream)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Potato', 'Vegetable Oil', 'Sour Cream Powder', 'Salt', 'Flavour'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potato , starchy food and will affect the organs metabolic system when fried , use baked chips. Vegetable Oil , frying oil that will affect the organs heart depending on fat type , prefer non-hydrogenated oils. Sour Cream Powder , dairy-derived and will affect the organs digestive & heart systems depending on fat , choose low-fat seasoning. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Flavour , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , choose natural flavoring.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['metabolic system', 'heart', 'digestive system', 'cardiovascular system']
  },
  {
    name: 'Haldiram\'s Sweets (Rasgulla)',
    category: 'sweets',
    ingredients: ingredients.filter(i =>
      ['Chhena (Paneer)', 'Sugar Syrup', 'Water', 'Cardamom', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Chhena (Paneer) , dairy protein and will affect the organs digestive & heart systems in saturated fat context , use low-fat paneer. Sugar Syrup , high sugar and will affect the organs pancreas & teeth , reduce syrup concentration. Water , neutral and will affect hydration positively , ensure quality water. Cardamom , flavoring beneficial for digestion and will affect the organs digestive system positively , use fresh spices. Preservative , extends shelf life and will affect the organs liver & digestive system with frequent intake , prefer freshly made sweets.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['digestive system', 'heart', 'pancreas', 'teeth', 'liver']
  },
  {
    name: 'Bikanervala Shahi Thali (Ready Meal)',
    category: 'ready meals',
    ingredients: ingredients.filter(i =>
      ['Rice', 'Dal', 'Vegetables', 'Ghee', 'Spices', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Rice , carbohydrate staple and will affect the organs metabolic system depending on type , prefer brown rice. Dal , protein & fiber and will affect the organs digestive & metabolic systems beneficially , include dal. Vegetables , micronutrients and will affect the organs immune & digestive systems beneficially , include fresh vegetables. Ghee , saturated fat and will affect the organs heart when used in excess , use in moderation. Spices , digestive and flavor benefits and will affect the organs digestive system positively in moderation , use fresh spices. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , choose freshly prepared meals.",
    severityCounts: { low: 3, medium: 2, high: 1 },
    organsAffected: ['metabolic system', 'digestive system', 'immune system', 'heart', 'liver']
  },
  {
    name: 'Knorr Veg Stock (Cube)',
    category: 'seasoning',
    ingredients: ingredients.filter(i =>
      ['Salt', 'Hydrogenated Vegetable Fat', 'Flavour Enhancers', 'Preservatives', 'Anti-caking Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Salt , excess sodium and will affect the organs cardiovascular system , use low-salt stocks. Hydrogenated Vegetable Fat , trans/saturated fats and will affect the organs heart adversely , avoid hydrogenated fats. Flavour Enhancers , may trigger sensitivity and will affect the organs nervous & digestive systems in susceptible individuals , prefer natural stock. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic intake , prepare fresh stock. Anti-caking Agent , inert but additive and will affect the organs digestive system in sensitive people , choose natural cubes or homemade.",
    severityCounts: { low: 1, medium: 3, high: 1 },
    organsAffected: ['cardiovascular system', 'heart', 'nervous system', 'digestive system', 'liver']
  },
  {
    name: 'MTR Ready-to-Eat Rajma',
    category: 'ready meals',
    ingredients: ingredients.filter(i =>
      ['Rajma (Kidney Beans)', 'Tomato Gravy', 'Salt', 'Oil', 'Spices', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Rajma (Kidney Beans) , protein & fiber and will affect the organs digestive & metabolic systems beneficially when well-cooked , soak and cook thoroughly. Tomato Gravy , source of lycopene and will affect the organs digestive & cardiovascular systems beneficially , prefer fresh gravy. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Oil , cooking fat and will affect the organs heart depending on type , prefer healthier oils. Spices , digestive benefits and will affect the organs digestive system positively in moderation , use fresh spices. Preservatives , extend shelf life and will affect the organs liver & digestive system with frequent use , opt for preservative-free or freshly cooked rajma.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['digestive system', 'metabolic system', 'cardiovascular system', 'liver']
  },
  {
    name: 'Maggi Masala-ae-Magic Seasoning',
    category: 'seasoning',
    ingredients: ingredients.filter(i =>
      ['Salt', 'Spice Blend', 'MSG', 'Anti-caking Agent', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Salt , high sodium and will affect the organs cardiovascular system , use less salt. Spice Blend , flavor & digestive benefits and will affect the organs digestive system beneficially in moderation , use fresh spices. MSG , flavor enhancer causing sensitivity in some and will affect the organs nervous & digestive systems in susceptible individuals , choose MSG-free options. Anti-caking Agent , additive and will affect the organs digestive system in sensitive people , prefer natural seasonings. Preservatives , extend shelf life and will affect the organs liver & digestive system long-term , select fresh spice mixes.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['cardiovascular system', 'digestive system', 'nervous system', 'liver']
  },
  {
    name: 'Mother Dairy Dahi (Curd)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Live Cultures', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , source of protein & calcium but contains saturated fat and will affect the organs heart & digestive system in full-fat form , choose toned/low-fat. Live Cultures , probiotics that will affect the organs digestive system beneficially , prefer natural live-culture dahi. Salt , if added in excess may affect the organs cardiovascular system , use minimal salt.",
    severityCounts: { low: 2, medium: 0, high: 0 },
    organsAffected: ['digestive system', 'heart', 'cardiovascular system']
  },
  {
    name: 'Epigamia Greek Yogurt (Plain)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Live Cultures'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , concentrated protein with some saturated fat and will affect the organs heart & digestive system in high-fat versions , prefer low-fat Greek yogurt. Live Cultures , probiotics and will affect the organs digestive system beneficially , choose live-culture yogurts.",
    severityCounts: { low: 2, medium: 0, high: 0 },
    organsAffected: ['digestive system', 'heart']
  },
  {
    name: 'Amul Lassi (Sweet)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Sugar', 'Live Cultures', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy with saturated fat and will affect the organs heart & digestive system in full-fat versions , use low-fat milk. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Live Cultures , probiotic benefit and will affect the organs digestive system positively , prefer live cultures. Flavor , additives may cause sensitivity and will affect the organs digestive or immune systems in sensitive people , use natural flavors.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['heart', 'digestive system', 'pancreas', 'teeth']
  },
  {
    name: 'Bournvita Ready-to-Drink',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Sugar', 'Malt Extract', 'Vitamins & Minerals', 'Flavor', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids , dairy-based saturated fats and will affect the organs heart & digestive system in full-fat context , choose low-fat options. Sugar , high added sugar and will affect the organs pancreas & teeth , pick low-sugar versions. Malt Extract , carbohydrate source and will affect the organs metabolic system , prefer whole-grain breakfasts instead. Vitamins & Minerals , fortification benefits and will affect organ systems positively for deficiencies , maintain balanced diet. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , prefer natural flavors. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , prefer fresh-made drinks.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['heart', 'pancreas', 'teeth', 'metabolic system', 'digestive system', 'liver']
  },
  {
    name: 'Quaker Oats (Instant)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Oats', 'Sugar (if flavored)', 'Salt', 'Flavour'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fiber supporting heart & digestion and will affect the organs heart & digestive system beneficially , prefer rolled/steel-cut oats. Sugar (if flavored) , added sugar and will affect the organs pancreas & teeth , reduce sugar. Salt , excess sodium and will affect the organs cardiovascular system , minimize salt. Flavour , additives may cause sensitivity and will affect the organs digestive or immune systems in sensitive people , choose plain oats and add fresh fruit.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['heart', 'digestive system', 'pancreas', 'teeth', 'cardiovascular system']
  },
  {
    name: 'Tilda Basmati Rice',
    category: 'staples',
    ingredients: ingredients.filter(i =>
      ['Basmati Rice'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Basmati Rice , refined carbohydrate providing energy and will affect the organs metabolic system depending on portion and processing , prefer brown/basmati in moderation. ",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['metabolic system']
  },
  {
    name: 'Ching\'s Secret Schezwan Sauce',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Red Chilli', 'Sugar', 'Vinegar', 'Salt', 'Preservatives', 'Flavour'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Red Chilli , spicy component and will affect the organs digestive system in sensitive people , use mild variants. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Vinegar , acidic and may affect the organs digestive system if excess , use in moderation. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , choose fresh sauces. Flavour , additives may cause sensitivity and will affect the organs digestive or immune systems in sensitive people , use natural flavoring.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['digestive system', 'pancreas', 'teeth', 'cardiovascular system', 'liver']
  },
  {
    name: 'Sriracha Hot Sauce',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Chili', 'Vinegar', 'Garlic', 'Sugar', 'Salt', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Chili , spicy and will affect the organs digestive system in sensitive people , use mild sauces. Vinegar , acidic and will affect the organs digestive system if overused , use moderately. Garlic , antimicrobial and will affect the organs immune & digestive systems beneficially , include fresh garlic. Sugar , added sugar and will affect the organs pancreas & teeth , minimize sugar. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Preservatives , extend shelf life and will affect the organs liver & digestive system long-term , prefer preservative-free sauces.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['digestive system', 'immune system', 'pancreas', 'teeth', 'cardiovascular system', 'liver']
  },
  {
    name: 'Nutricup Instant Oats (Masala)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Oats', 'Spice Mix', 'Salt', 'Vegetable Oil', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , beneficial soluble fiber and will affect the organs heart & digestive system positively , prefer plain oats. Spice Mix , flavor and digestive benefit in moderation and will affect the organs digestive system beneficially , use fresh spices. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Vegetable Oil , added fats and will affect the organs heart depending on type , choose healthier oils. Preservative , extends shelf life and will affect the organs liver & digestive system with frequent intake , pick preservative-free mixes.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['heart', 'digestive system', 'cardiovascular system', 'liver']
  },
  {
    name: 'Tata Gluco Plus',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Glucose', 'Salt', 'Flavor', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Glucose , quick energy but spikes blood sugar and will affect the organs pancreas & metabolic system , use for rapid rehydration only. Salt , electrolyte replenishment but excess affects cardiovascular system and will affect the organs cardiovascular system , use as directed. Flavor , additives may cause sensitivity and will affect the organs digestive or immune systems in sensitive people , choose natural flavors. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer fresh electrolyte solutions when possible.",
    severityCounts: { low: 1, medium: 2, high: 0 },
    organsAffected: ['pancreas', 'metabolic system', 'cardiovascular system', 'digestive system', 'liver']
  },
  {
    name: 'Lay\'s Stax (Cheese)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Potato', 'Vegetable Oil', 'Cheese Powder', 'Salt', 'Flavoring', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potato , starchy and will affect the organs metabolic system when fried , choose baked alternatives. Vegetable Oil , frying oil and will affect the organs heart depending on fat type , avoid hydrogenated oil. Cheese Powder , dairy solids that will affect the organs heart & digestion in high-fat contexts , choose low-fat flavors. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Flavoring , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , prefer natural flavors. Preservatives , extend shelf life and will affect the organs liver & digestive system long-term , avoid frequent consumption.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system', 'heart', 'digestive system', 'cardiovascular system', 'liver']
  },
  {
    name: 'Kellogg\'s Oats (Classic)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Oats'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fiber supports heart and digestion and will affect the organs heart & digestive system beneficially , prefer rolled/steel-cut oats for max benefit.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['heart', 'digestive system']
  },
  {
    name: 'Act II Microwave Popcorn (Butter)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Corn Kernels', 'Butter Flavour', 'Hydrogenated Vegetable Oil', 'Salt', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Corn Kernels , whole-grain snack and will affect the organs digestive & metabolic systems beneficially when air-popped , prefer plain popcorn. Butter Flavour , artificial flavor may cause sensitivity and will affect the organs digestive or immune systems in some people , use real butter. Hydrogenated Vegetable Oil , trans fats and will affect the organs heart adversely , avoid hydrogenated fats. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic intake , choose preservative-free options.",
    severityCounts: { low: 2, medium: 2, high: 1 },
    organsAffected: ['digestive system', 'metabolic system', 'heart', 'cardiovascular system', 'liver']
  },
  {
    name: 'Bingo Madangles (Tomato)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Tomato Powder', 'Salt', 'Flavour', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-wheat bases. Vegetable Oil , frying oil and will affect the organs heart depending on type , choose better oils. Tomato Powder , flavor and micronutrients but processed and will affect the organs digestive system mildly , prefer real tomatoes. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Flavour , additives may trigger sensitivity and will affect the organs digestive or immune systems in sensitive people , prefer natural seasoning. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic consumption , avoid frequent intake.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system', 'heart', 'digestive system', 'cardiovascular system', 'liver']
  },
  {
    name: 'Pringles Sour Cream',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Potato Flakes', 'Vegetable Oil', 'Sour Cream Powder', 'Salt', 'Flavour', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potato Flakes , processed carbs and will affect the organs metabolic system , prefer whole potatoes. Vegetable Oil , fat source and will affect the organs heart depending on type , opt for healthier oils. Sour Cream Powder , dairy-derived and will affect the organs digestive & heart systems depending on fat content , choose low-fat seasonings. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Flavour , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , prefer natural flavoring. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic intake , choose preservative-free snacks.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system', 'heart', 'digestive system', 'cardiovascular system', 'liver']
  },
  {
    name: 'Kitchen King Masala (Aachi)',
    category: 'spices',
    ingredients: ingredients.filter(i =>
      ['Coriander', 'Cumin', 'Fenugreek', 'Turmeric', 'Red Chili', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Coriander , digestion aid and will affect the organs digestive system beneficially , use whole coriander. Cumin , digestive support and will affect the organs digestive system positively , use roasted cumin. Fenugreek , may help glucose control and will affect the organs metabolic system beneficially in moderation , consult if on medication. Turmeric , anti-inflammatory benefits and will affect the organs immune & joint systems beneficially , use with black pepper for absorption. Red Chili , pungent and will affect the organs digestive system in sensitive people , use mild chili if needed. Salt , excess sodium and will affect the organs cardiovascular system , minimize added salt.",
    severityCounts: { low: 4, medium: 1, high: 0 },
    organsAffected: ['digestive system', 'metabolic system', 'immune system', 'cardiovascular system', 'joint health']
  },
  {
    name: 'Sunflower Seeds (Snack Pack)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Sunflower Seeds', 'Salt', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sunflower Seeds , source of healthy fats & vitamin E and will affect the organs heart & skin beneficially , prefer unsalted roasted seeds. Salt , excess sodium and will affect the organs cardiovascular system , use minimal salt. Flavor , additives may cause sensitivity and will affect the organs digestive or immune systems in sensitive people , choose natural flavoring.",
    severityCounts: { low: 2, medium: 0, high: 0 },
    organsAffected: ['heart', 'skin', 'cardiovascular system', 'digestive system']
  },
  {
    name: 'Cadbury Perk',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Cocoa', 'Milk Solids', 'Vegetable Oil', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-wheat wafers. Sugar , added sugar and will affect the organs pancreas & teeth , choose less sugary snacks. Cocoa , antioxidant when high-percentage and will affect the organs heart & nervous system beneficially with higher cocoa content , prefer dark chocolate options. Milk Solids , dairy fats and will affect the organs heart & digestion in high-fat contexts , choose low-fat chocolate products. Vegetable Oil , fat content affecting heart depending on type and will affect the organs cardiovascular system , avoid palm/hydrogenated oils. Emulsifier , additive may affect gut microbiota and will affect the organs digestive system in sensitive people , prefer minimal additives.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system', 'pancreas', 'teeth', 'heart', 'digestive system']
  },
  {
    name: 'Tropicana Real Orange',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Orange Juice', 'Sugar', 'Preservative', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Orange Juice , vitamin C and will affect the organs immune & digestive systems beneficially but concentrated sugar and will affect the organs pancreas & teeth , prefer whole fruit. Sugar , added sugar and will affect the organs pancreas & teeth , choose no-added-sugar. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , select fresh juice. Flavor , additives may cause sensitivity and will affect the organs digestive or immune systems in some people , opt for pure juice.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['immune system', 'digestive system', 'pancreas', 'teeth', 'liver']
  },
  {
    name: 'Sunsilk Shampoo (Smooth & Manageable)',
    category: 'personal care',
    ingredients: ingredients.filter(i =>
      ['Surfactants', 'Silicones', 'Fragrances', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Surfactants , cleanse hair/scalp but may irritate and will affect the organs scalp/skin , use mild surfactants. Silicones , smooth hair but may build-up and will affect the organs hair shaft cosmetically , prefer water-soluble silicones if desired. Fragrances , may cause skin sensitivity and will affect the organs skin & respiratory system in sensitive people , use fragrance-free versions if allergic. Preservatives , prevent microbial growth but may affect the organs skin & immune system in sensitive individuals with chronic exposure , choose safe-preservative formulations.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['scalp', 'skin', 'respiratory system', 'immune system']
  },
  {
    name: 'Britannia Little Hearts',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Edible Vegetable Oil', 'Milk Solids', 'Leavening Agent', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , high glycemic/refined carb and will affect the organs metabolic system , use whole-wheat flour instead. Sugar , raises blood glucose and will affect the organs pancreas & teeth , use less sugar or fruit puree instead. Edible Vegetable Oil , source of fats and will affect the organs heart depending on fat type , use unsaturated oils instead. Milk Solids , saturated fat and lactose and will affect the organs heart & digestive system , use low-fat milk solids or plant-based alternatives instead. Leavening Agent , may cause bloating and will affect the organs digestive system , use naturally fermented leavening where possible instead. Salt , excess sodium and will affect the organs cardiovascular system , use reduced salt instead.",
    severityCounts: { low: 4, medium: 2, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system','cardiovascular system']
  },
  {
    name: 'Britannia NutriChoice Digestive (Oats & Honey)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Oats', 'Whole Wheat Flour', 'Honey', 'Edible Vegetable Oil', 'Salt', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fiber supporting heart & digestion and will affect the organs heart & digestive system , use rolled/steel-cut oats instead. Whole Wheat Flour , high fiber and will affect the organs digestive system beneficially , use whole-wheat. Honey , natural sweetener but still sugar and will affect the organs teeth & pancreas , use minimal honey. Edible Vegetable Oil , fat source and will affect the organs heart depending on type , use unsaturated oils instead. Salt , excess sodium and will affect the organs cardiovascular system , use limited iodised salt instead. Emulsifier , may alter gut microbiota and will affect the organs digestive system , choose clean-label products instead.",
    severityCounts: { low: 4, medium: 1, high: 0 },
    organsAffected: ['heart','digestive system','teeth','pancreas','cardiovascular system']
  },
  {
    name: 'Parle Hide & Seek Vanilla',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Vegetable Oil', 'Vanilla Flavour', 'Milk Solids', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-wheat flour instead. Sugar , dental caries & glycemic effect and will affect the organs teeth & pancreas , reduce sugar. Vegetable Oil , fat source and will affect the organs heart depending on type , use unsaturated oils. Vanilla Flavour , additives may cause sensitivities and will affect the organs digestive/immune systems in sensitive people , prefer natural vanilla. Milk Solids , saturated fat and lactose and will affect the organs heart & digestive system , use low-fat alternatives. Leavening Agent , may cause gas and will affect the organs digestive system , use natural leavening when possible.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','teeth','pancreas','heart','digestive system']
  },
  {
    name: 'Sunfeast Marie Light',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Vegetable Oil', 'Salt', 'Leavening Agent', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-grain flour. Sugar , increases caries risk and will affect the organs teeth & pancreas , use minimal sweeteners. Vegetable Oil , fat source and will affect the organs heart depending on type , prefer unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Leavening Agent , may cause bloating and will affect the organs digestive system , use naturally fermented dough. Emulsifier , may affect gut microbiota and will affect the organs digestive system , choose minimal-additive options.",
    severityCounts: { low: 4, medium: 2, high: 0 },
    organsAffected: ['metabolic system','teeth','pancreas','heart','digestive system','cardiovascular system']
  },
  {
    name: 'Britannia Rusk (Mysore)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Butter', 'Eggs', 'Leavening Agent', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-wheat flour. Sugar , high sugar and will affect the organs pancreas & teeth , reduce sugar. Butter , saturated fat and will affect the organs heart if consumed frequently , use light butter or plant-based spread. Eggs , protein source but cholesterol for some and will affect the organs heart in sensitive individuals , use egg whites if needed. Leavening Agent , may cause gas and will affect the organs digestive system , prefer natural leavening. Salt , excess sodium and will affect the organs cardiovascular system , limit salt.",
    severityCounts: { low: 3, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system','cardiovascular system']
  },
  {
    name: 'McCain French Fries (Frozen)',
    category: 'frozen foods',
    ingredients: ingredients.filter(i =>
      ['Potatoes', 'Vegetable Oil', 'Salt', 'Preservative', 'Antioxidant'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potatoes , starchy vegetable and will affect the organs metabolic system depending on portion & preparation , prefer oven-baked. Vegetable Oil , frying fat and will affect the organs heart depending on type and reuse , use high-oleic oils and avoid repeated reuse. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , choose preservative-free frozen potatoes. Antioxidant , prevents oxidation and will affect the organs cellular health beneficially in small amounts , prefer minimal additives.",
    severityCounts: { low: 2, medium: 2, high: 1 },
    organsAffected: ['metabolic system','heart','cardiovascular system','liver','digestive system']
  },
  {
    name: 'Kissan Tomato Ketchup',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Tomato Concentrate', 'Sugar', 'Vinegar', 'Salt', 'Spices', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Tomato Concentrate , source of lycopene and will affect the organs digestive & cardiovascular systems beneficially , prefer fresh tomatoes. Sugar , added sugar and will affect the organs pancreas & teeth , choose low-sugar ketchup. Vinegar , acidic and may affect the organs digestive system if overused , use moderate vinegar. Salt , excessive sodium and will affect the organs cardiovascular system , reduce salt. Spices , flavor & digestive stimulation and will affect the organs digestive system beneficially in moderation , use natural spices. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic use , prefer preservative-free ketchup.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['digestive system','cardiovascular system','pancreas','teeth','liver']
  },
  {
    name: 'Unibic Choco Chip Cookies',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Butter', 'Choco Chips', 'Eggs', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-grain flour. Sugar , raises blood glucose and will affect the organs pancreas & teeth , use less sugar. Butter , saturated fat and will affect the organs heart with frequent intake , use low-fat alternatives. Choco Chips , added sugar & fat and will affect the organs teeth & metabolic system , use dark-chocolate chips. Eggs , protein source and will affect the organs muscle & metabolic system beneficially for most , choose pasteurized eggs if needed. Leavening Agent , may cause gas and will affect the organs digestive system , prefer natural leavening.",
    severityCounts: { low: 3, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Tata Sampann Chana Dal',
    category: 'staples',
    ingredients: ingredients.filter(i =>
      ['Chana Dal', 'Salt (if present)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Chana Dal , protein & fiber and will affect the organs digestive & metabolic systems beneficially , use as staple protein. Salt (if present) , excess sodium and will affect the organs cardiovascular system , limit added salt.",
    severityCounts: { low: 2, medium: 0, high: 0 },
    organsAffected: ['digestive system','metabolic system','cardiovascular system']
  },
  {
    name: 'Aashirvaad Salted Butter Ghee',
    category: 'cooking fat',
    ingredients: ingredients.filter(i =>
      ['Clarified Butter (Ghee)', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Clarified Butter (Ghee) , rich in saturated fats and will affect the organs heart when consumed in excess , use in moderation or choose oils with healthier fat profile. Salt , excess sodium and will affect the organs cardiovascular system , use sparingly. ",
    severityCounts: { low: 1, medium: 1, high: 1 },
    organsAffected: ['heart','cardiovascular system']
  },
  {
    name: 'Tata Tea Agni',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Black Tea Leaves'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Black Tea Leaves , contains caffeine and antioxidants and will affect the organs nervous & cardiovascular systems depending on intake , use decaffeinated or herbal teas if sensitive.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['nervous system','cardiovascular system']
  },
  {
    name: 'Bru Instant Coffee (Strong)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Coffee Solids', 'Anticaking Agent', 'Stabilizer'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Coffee Solids , stimulant effects and will affect the organs nervous system & cardiovascular system in sensitive individuals , limit intake. Anticaking Agent , generally low risk but may affect the organs digestive system in some people , choose pure instant coffee. Stabilizer , texture agent with low risk and will affect the organs digestive system minimally in sensitive individuals , prefer minimal additives.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['nervous system','cardiovascular system','digestive system']
  },
  {
    name: 'Kwality Walls Cornetto (Chocolate)',
    category: 'frozen dessert',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Sugar', 'Cocoa', 'Vegetable Oil', 'Cone (Wheat Flour)', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids , dairy saturated fat and lactose and will affect the organs heart & digestive system , choose low-fat frozen desserts. Sugar , high sugar and will affect the organs pancreas & teeth , reduce sugar intake. Cocoa , antioxidant properties and will affect the organs heart & nervous system beneficially when high-quality and less processed , prefer higher-cocoa options. Vegetable Oil , fat source and will affect the organs heart depending on type , avoid hydrogenated oils. Cone (Wheat Flour) , refined carb and will affect the organs metabolic system , use whole-wheat cones. Emulsifier , additive may affect gut microbiota and will affect the organs digestive system in sensitive people , choose minimal-additive products.",
    severityCounts: { low: 2, medium: 3, high: 1 },
    organsAffected: ['heart','digestive system','pancreas','teeth','metabolic system','nervous system']
  },
  {
    name: 'Amul Kool (Mango)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Sugar', 'Mango Pulp', 'Flavor', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy saturated fat & lactose and will affect the organs heart & digestive system , prefer low-fat milk. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Mango Pulp , fruit nutrients but concentrated sugar and will affect the organs pancreas & teeth , prefer whole fruit. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , use natural flavors. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic use , pick preservative-free beverages.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','pancreas','teeth','liver']
  },
  {
    name: 'Haldiram\'s Aloo Bhujia (Masala)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Potato', 'Gram Flour', 'Edible Vegetable Oil', 'Salt', 'Spices', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potato , starchy ingredient and will affect the organs metabolic system when fried , prefer baked. Gram Flour , protein-rich and will affect the organs digestive & metabolic systems beneficially , include as chickpea alternative. Edible Vegetable Oil , frying fat and will affect the organs heart depending on type , choose healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Spices , flavor and digestive stimulation and will affect the organs digestive system beneficially in moderation , prefer natural spices. Preservative , extends shelf life and will affect the organs liver & digestive system with repeated intake , choose preservative-free snacks.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','digestive system','heart','cardiovascular system','liver']
  },
  {
    name: 'Tata Salt Lite (Low Sodium)',
    category: 'staples',
    ingredients: ingredients.filter(i =>
      ['Reduced Sodium Salt', 'Potassium Chloride'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Reduced Sodium Salt , lowers sodium intake and will affect the organs cardiovascular system beneficially for many people , use as advised. Potassium Chloride , alternative to sodium and will affect the organs cardiovascular & renal systems (monitor if on meds) , consult a doctor if necessary.",
    severityCounts: { low: 2, medium: 0, high: 0 },
    organsAffected: ['cardiovascular system','renal system']
  },
  {
    name: 'MTR Rasam Mix',
    category: 'seasoning',
    ingredients: ingredients.filter(i =>
      ['Tamarind Powder', 'Spice Mix', 'Salt', 'Dehydrated Vegetables', 'Anti-caking Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Tamarind Powder , digestive aid and will affect the organs digestive system beneficially , use fresh tamarind for best results. Spice Mix , flavor & digestive benefits and will affect the organs digestive system positively in moderation , prefer fresh spices. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Dehydrated Vegetables , convenient nutrient source but processed and will affect the organs digestive system moderately , prefer fresh vegetables. Anti-caking Agent , inert additive and will affect the organs digestive system minimally in some people , choose natural mixes when possible.",
    severityCounts: { low: 3, medium: 1, high: 0 },
    organsAffected: ['digestive system','cardiovascular system']
  },
  {
    name: 'Tropicana Essentials (Apple)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Apple Juice', 'Vitamin C', 'Preservatives', 'Sugar (if added)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Apple Juice , provides vitamins but concentrated sugar and will affect the organs pancreas & teeth , prefer whole fruit. Vitamin C , antioxidant and immune support and will affect the organs immune system beneficially , retain natural vitamin content. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic use , choose fresh-pressed juice. Sugar (if added) , increases glycemic load and will affect the organs pancreas & teeth , choose no-added-sugar variety.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['pancreas','teeth','immune system','liver','digestive system']
  },
  {
    name: 'Bingo Mad Angles (Masala)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Tomato Powder', 'Salt', 'Spices', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-grain base instead. Vegetable Oil , frying fat and will affect the organs heart depending on type , prefer healthier oils. Tomato Powder , processed flavor and will affect the organs digestive system mildly , use real tomatoes when possible. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Spices , digestive benefits and will affect the organs digestive system positively in moderation , prefer natural spices. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic intake , choose preservative-free snacks.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Dabur Honitus (Cough Syrup - Herbal)',
    category: 'healthcare',
    ingredients: ingredients.filter(i =>
      ['Herbal Extracts', 'Honey', 'Glycerin'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Herbal Extracts , traditional relief and will affect the organs respiratory & immune systems beneficially in many cases , consult a physician for chronic conditions. Honey , demulcent but high in sugars and will affect the organs teeth & pancreas , limit use in diabetics. Glycerin , soothing humectant and will affect the organs throat/skin beneficially when used properly , use as directed.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['respiratory system','immune system','teeth','pancreas']
  },
  {
    name: 'Dalda Vanaspati (Hydrogenated Oil)',
    category: 'cooking fat',
    ingredients: ingredients.filter(i =>
      ['Hydrogenated Vegetable Oil', 'Antioxidant'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Hydrogenated Vegetable Oil , contains trans/saturated fats and will affect the organs heart adversely with prolonged intake , avoid hydrogenated fats and use unrefined unsaturated oils instead. Antioxidant , prevents oxidation and will affect the organs cellular health minimally beneficially in small amounts , choose minimally processed oils.",
    severityCounts: { low: 0, medium: 1, high: 1 },
    organsAffected: ['heart','cellular health']
  },
  {
    name: 'Tata Sampann Poha (Flattened Rice)',
    category: 'staples',
    ingredients: ingredients.filter(i =>
      ['Flattened Rice (Poha)', 'Salt', 'Turmeric'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Flattened Rice (Poha) , light carbohydrate and will affect the organs metabolic system depending on portion and preparation , use with vegetables and protein. Salt , excess sodium and will affect the organs cardiovascular system , reduce added salt. Turmeric , anti-inflammatory and will affect the organs immune & joint systems beneficially in moderation , pair with black pepper for absorption.",
    severityCounts: { low: 3, medium: 0, high: 0 },
    organsAffected: ['metabolic system','cardiovascular system','immune system','joint health']
  },
  {
    name: 'Patanjali Cow Ghee',
    category: 'cooking fat',
    ingredients: ingredients.filter(i =>
      ['Clarified Butter (Cow Ghee)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Clarified Butter (Cow Ghee) , high in saturated fats and will affect the organs heart when consumed in excess , use sparingly or prefer oils with better unsaturated fat profile.",
    severityCounts: { low: 0, medium: 1, high: 1 },
    organsAffected: ['heart']
  },
  {
    name: 'Pepsi Black (Zero Sugar)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Carbonated Water', 'Artificial Sweetener', 'Caffeine', 'Color', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Carbonated Water , may cause bloating and will affect the organs digestive system , prefer still water. Artificial Sweetener , low-calorie alternative but may affect gut microbiota in some and will affect the organs digestive & metabolic systems in sensitive people , choose minimal sweeteners. Caffeine , stimulant and will affect the organs nervous & cardiovascular systems in high intake , limit consumption. Color , additives may cause sensitivity and will affect the organs digestive or liver systems in sensitive people , prefer minimal additives. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , avoid frequent intake.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['digestive system','nervous system','cardiovascular system','liver','metabolic system']
  },
  {
    name: 'Nestle Everyday Dairy Whitener',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Vegetable Oils', 'Lactose', 'Stabilizers', 'Vitamins'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high-fat forms , select low-fat options if needed. Vegetable Oils , added fats and will affect the organs heart depending on type , prefer unsaturated oils. Lactose , sugar in milk and will affect the organs digestive system in lactose-intolerant individuals , use lactose-free alternatives. Stabilizers , texture aids and will affect the organs digestive system minimally in some people , choose simpler formulations. Vitamins , fortification can be beneficial and will affect the organs overall nutrition positively where deficient , continue balanced diet.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','metabolic system']
  },
  {
    name: 'Pillsbury Atta Choco Cake Mix',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Cocoa', 'Vegetable Oil', 'Emulsifier', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , prefer whole-wheat or alternative flours. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Cocoa , antioxidant when high-percentage and will affect the organs heart & nervous system positively when less processed , choose high-cocoa powder. Vegetable Oil , fat source and will affect the organs heart depending on type , avoid hydrogenated oils. Emulsifier , additive may impact gut microbiota and will affect the organs digestive system in sensitive people , choose minimal additives. Leavening Agent , may cause bloating and will affect the organs digestive system , use natural leavening when possible.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system','nervous system']
  },
  {
    name: 'Cornitos Nacho Crisps (Peri Peri)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Corn', 'Vegetable Oil', 'Salt', 'Peri Peri Seasoning', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Corn , processed grain and will affect the organs metabolic system depending on processing , prefer whole-corn snacks. Vegetable Oil , frying fat and will affect the organs heart depending on type , use healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Peri Peri Seasoning , spices that may irritate sensitive digestive tracts and will affect the organs digestive system in some individuals , use mild seasoning. Preservative , extends shelf life and will affect the organs liver & digestive system with repeated exposure , choose preservative-free options.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','cardiovascular system','digestive system','liver']
  },
  {
    name: 'Gits Poha Mix',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Flattened Rice', 'Spice Mix', 'Salt', 'Dehydrated Vegetables', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Flattened Rice , light carbohydrate and will affect the organs metabolic system depending on portion & toppings , combine with veggies/protein. Spice Mix , digestive benefits in moderation and will affect the organs digestive system positively , prefer fresh spices. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Dehydrated Vegetables , convenient but processed and will affect the organs digestive system moderately , prefer fresh vegetables. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic use , choose preservative-free mixes.",
    severityCounts: { low: 3, medium: 1, high: 0 },
    organsAffected: ['metabolic system','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Knorr Classic Veg Noodles (Cup)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Salt', 'Tastemaker (Flavour)', 'Preservative', 'Anti-caking Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-grain noodles. Vegetable Oil , frying fat and will affect the organs heart depending on type , prefer healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Tastemaker (Flavour) , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , choose natural seasoning. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic use , prefer freshly prepared meals. Anti-caking Agent , inert additive and will affect the organs digestive system minimally in some people , use natural mixes.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Tata Tea Premium',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Black Tea Leaves', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Black Tea Leaves , source of caffeine & antioxidants and will affect the organs nervous & cardiovascular systems depending on intake , use decaffeinated options if sensitive. Flavor , additives may cause sensitivity in some and will affect the organs digestive or immune systems , prefer pure tea leaves.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['nervous system','cardiovascular system','digestive system']
  },
  {
    name: 'Sunfeast YiPPee! Noodles (Masala)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Tastemaker', 'Salt', 'MSG', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , choose whole-grain alternatives. Vegetable Oil , frying fat and will affect the organs heart depending on type , avoid repeated reuse. Tastemaker , flavor additives and will affect the organs digestive or immune systems in sensitive people , prefer fresh seasonings. Salt , excess sodium and will affect the organs cardiovascular system , reduce sodium. MSG , flavor enhancer that causes sensitivity in some and will affect the organs nervous & digestive systems in susceptible individuals , use MSG-free options. Preservative , extends shelf life and will affect the organs liver & digestive system long-term , prefer freshly prepared noodles.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','nervous system','liver']
  },
  {
    name: 'Glucon-D',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Glucose', 'Vitamins', 'Salt', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Glucose , quick energy and will affect the organs pancreas & metabolic system (use for short-term rehydration/exertion only) , use as directed. Vitamins , supportive micronutrients and will affect the organs metabolic & immune systems beneficially when deficient , maintain balanced diet. Salt , electrolyte replenishment but excess affects cardiovascular system and will affect the organs cardiovascular system , use as directed. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , prefer plain ORS for rehydration when appropriate.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['pancreas','metabolic system','cardiovascular system','immune system']
  },
  {
    name: 'Knorr Continental Soup (Sweet Corn)',
    category: 'ready meals',
    ingredients: ingredients.filter(i =>
      ['Corn', 'Milk Solids', 'Salt', 'Starch', 'Preservatives', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Corn , carbohydrate & fiber and will affect the organs metabolic & digestive systems depending on processing , prefer fresh corn. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in sensitive people , use low-fat alternatives. Salt , excess sodium and will affect the organs cardiovascular system , pick low-salt versions. Starch , thickener and will affect the organs metabolic system if highly refined , choose whole-food thickening agents. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , prefer fresh soups. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , use natural seasoning.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','digestive system','heart','cardiovascular system','liver']
  },
  {
    name: 'MTR Pulao Mix',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Rice', 'Spice Mix', 'Vegetable Oil', 'Salt', 'Dehydrated Vegetables', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Rice , carbohydrate staple and will affect the organs metabolic system depending on portion & variety , prefer brown rice for fiber. Spice Mix , flavor & digestive benefits and will affect the organs digestive system positively in moderation , use natural spices. Vegetable Oil , added fats and will affect the organs heart depending on type , prefer unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Dehydrated Vegetables , convenient nutrients but processed and will affect the organs digestive system moderately , prefer fresh vegetables. Preservative , extends shelf life and will affect the organs liver & digestive system long-term , choose preservative-free mixes.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','digestive system','heart','cardiovascular system','liver']
  },
  {
    name: 'Tata Tea Premium Leaf (Masala Chai Blend)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Black Tea Leaves', 'Cardamom', 'Cinnamon', 'Ginger'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Black Tea Leaves , caffeine & antioxidants and will affect the organs nervous & cardiovascular systems depending on intake , use decaf if sensitive. Cardamom , digestive benefits and will affect the organs digestive system positively , prefer whole cardamom. Cinnamon , may help glycemic control and will affect the organs metabolic & cardiovascular systems beneficially in moderation , prefer Ceylon cinnamon. Ginger , digestive aid and will affect the organs digestive & immune systems beneficially , use fresh ginger.",
    severityCounts: { low: 4, medium: 0, high: 0 },
    organsAffected: ['nervous system','cardiovascular system','digestive system','immune system','metabolic system']
  },
  {
    name: 'Amul Mithai Mate Khoya',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Sugar', 'Stabilizer', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high-fat forms , use low-fat alternatives if needed. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Stabilizer , texture aid and will affect the organs digestive system minimally in sensitive people , choose natural products. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , use natural flavorings.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','pancreas','teeth']
  },
  {
    name: 'Cadbury Silk Bubbly',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Milk Solids', 'Cocoa Butter', 'Cocoa Solids', 'Emulsifier', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , high sugar and will affect the organs pancreas & teeth , choose low-sugar options. Milk Solids , dairy fat and lactose and will affect the organs heart & digestive system , prefer low-fat chocolate. Cocoa Butter & Cocoa Solids , components of chocolate that can have antioxidant benefits when cocoa content is high and will affect the organs heart & nervous system beneficially in quality dark chocolate , prefer high-cocoa chocolate. Emulsifier , additive may affect gut microbiota and will affect the organs digestive system in sensitive people , seek minimal additives. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , prefer natural flavors.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['pancreas','teeth','heart','digestive system','nervous system']
  },
  {
    name: 'Hershey\'s Chocolate Syrup',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Cocoa', 'Corn Syrup', 'Preservatives', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , high added sugar and will affect the organs pancreas & teeth , reduce use. Cocoa , antioxidant potential when less processed and will affect the organs heart & nervous system beneficially in quality cocoa , use pure cocoa powder. Corn Syrup , high glycemic sweetener and will affect the organs metabolic system & pancreas , prefer natural sweeteners. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , opt for preservative-free syrups. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive individuals , choose natural flavoring.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['pancreas','teeth','metabolic system','heart','liver']
  },
  {
    name: 'Maggi Vegetable Atta Noodles',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Whole Wheat Flour', 'Vegetable Oil', 'Tastemaker', 'Salt', 'Dehydrated Vegetables', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Whole Wheat Flour , fiber-rich and will affect the organs digestive system beneficially compared with refined flour , prefer whole-grain. Vegetable Oil , frying fat and will affect the organs heart depending on type , choose unsaturated oils. Tastemaker , additives may trigger sensitivities and will affect the organs digestive or immune systems in sensitive people , prefer fresh seasonings. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Dehydrated Vegetables , convenient nutrients but processed and will affect the organs digestive system moderately , prefer fresh veggies. Preservative , prolongs shelf life and will affect the organs liver & digestive system with chronic use , prefer preservative-free options.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['digestive system','heart','cardiovascular system','immune system','liver']
  },
  {
    name: 'Patanjali Honey (Multifloral)',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Honey'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Honey , natural sweetener but still sugar and will affect the organs teeth & pancreas if overused , use minimal amounts and prefer raw/local honey.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['teeth','pancreas']
  },
  {
    name: 'Tata Sampann Rajgira Atta (Amaranth Flour)',
    category: 'staples',
    ingredients: ingredients.filter(i =>
      ['Amaranth Flour'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Amaranth Flour , nutrient-dense pseudo-cereal and will affect the organs metabolic & digestive systems beneficially (good protein & fiber) , use as a whole-grain substitute in rotis and baking.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['metabolic system','digestive system']
  },
  {
    name: 'Lay\'s Kettle Cooked (Sea Salt)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Potato', 'Vegetable Oil', 'Sea Salt', 'Natural Flavours'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potato , starchy vegetable and will affect the organs metabolic system when consumed in fried form , prefer baked. Vegetable Oil , frying fat and will affect the organs heart depending on type , avoid hydrogenated oils. Sea Salt , excess sodium and will affect the organs cardiovascular system , limit intake. Natural Flavours , generally low risk but may cause sensitivity in some and will affect the organs digestive or immune systems in sensitive individuals , prefer minimal flavoring.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['metabolic system','heart','cardiovascular system','digestive system']
  },
  {
    name: 'Britannia NutriChoice Digestive Oats (Raisin)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Oats', 'Whole Wheat Flour', 'Raisins', 'Sugar', 'Edible Vegetable Oil', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fiber and will affect the organs heart & digestive system beneficially , use whole oats. Whole Wheat Flour , high fiber and will affect the organs digestive system beneficially , prefer whole-grain. Raisins , natural sugar and fiber and will affect the organs digestive system & teeth if overconsumed , use fresh fruit alternatives. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Edible Vegetable Oil , fat source and will affect the organs heart depending on type , choose unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','pancreas','teeth','cardiovascular system']
  },
  {
    name: 'Tropicana Pressed Orange',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['100% Orange Juice'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "100% Orange Juice , natural vitamin C & flavonoids but concentrated sugar and will affect the organs pancreas & teeth if overconsumed , prefer whole fruit for fiber retention.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['immune system','pancreas','teeth']
  },
  {
    name: 'Amul Kool (Strawberry)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Sugar', 'Strawberry Flavor', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy saturated fat & lactose and will affect the organs heart & digestive system in full-fat options , prefer low-fat milk. Sugar , added sugar and will affect the organs pancreas & teeth , lower sugar alternatives recommended. Strawberry Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , choose natural fruit flavor. Preservatives , prolong shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free beverages.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','pancreas','teeth','liver']
  },
  {
    name: 'Parle Krack Jack',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Edible Vegetable Oil', 'Salt', 'Leavening Agent', 'Milk Solids'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , use whole-wheat flour instead. Sugar , raises blood glucose and will affect the organs pancreas & teeth , use minimal jaggery or fruit instead. Edible Vegetable Oil , source of fat and will affect the organs heart depending on fat profile , use unsaturated oils instead. Salt , excess sodium and will affect the organs cardiovascular system , use limited iodised salt instead. Leavening Agent , may cause bloating and will affect the organs digestive system , use natural leavening where possible instead. Milk Solids , saturated fat and lactose and will affect the organs heart & digestive system , use low-fat alternatives instead.",
    severityCounts: { low: 4, medium: 2, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system','cardiovascular system']
  },
  {
    name: 'Britannia Good Day Cashew',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Butter', 'Cashew Nuts', 'Milk Solids', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-wheat flour instead. Sugar , increases dental decay and will affect the organs teeth & pancreas , reduce sugar. Butter , saturated fat and will affect the organs heart when frequent , use light butter or plant-based spreads instead. Cashew Nuts , healthy fats & minerals and will affect the organs heart & metabolic system beneficially in moderation , prefer whole nuts. Milk Solids , saturated fat and lactose and will affect the organs heart & digestive system , use low-fat variants instead. Leavening Agent , may cause gas and will affect the organs digestive system , use natural fermentation instead.",
    severityCounts: { low: 3, medium: 3, high: 0 },
    organsAffected: ['metabolic system','teeth','pancreas','heart','digestive system']
  },
  {
    name: 'Bourbon (Parle)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Edible Vegetable Oil', 'Cocoa Solids', 'Milk Solids', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-grain alternatives. Sugar , cariogenic and will affect the organs teeth & pancreas , reduce sugar. Edible Vegetable Oil , fat source and will affect the organs heart depending on type , choose unsaturated oils. Cocoa Solids , antioxidant potential and will affect the organs heart & nervous system beneficially in high-cocoa forms , prefer dark cocoa. Milk Solids , saturated fat and lactose and will affect the organs heart & digestive system , use low-fat dairy. Emulsifier , additive that may alter gut microbiota and will affect the organs digestive system in sensitive people , choose minimal additives.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','teeth','pancreas','heart','digestive system','nervous system']
  },
  {
    name: 'Oreo Chocolate Sandwich',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Vegetable Oil', 'Cocoa Solids', 'Corn Syrup', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-wheat wafers instead. Sugar , raises blood glucose and will affect the organs pancreas & teeth , reduce sugar. Vegetable Oil , fat source and will affect the organs heart depending on type , avoid hydrogenated oils. Cocoa Solids , antioxidant benefits in higher cocoa and will affect the organs heart & nervous system positively when quality cocoa is used , choose higher-cocoa content. Corn Syrup , high glycemic sweetener and will affect the organs metabolic system & pancreas , use natural sweeteners. Emulsifier , additive may affect gut microbiota and will affect the organs digestive system in sensitive people , choose minimal additives.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Peek Freans Hide & Seek (Choco)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Vegetable Oil', 'Cocoa', 'Milk Solids', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-grain flour. Sugar , cariogenic and will affect the organs teeth & pancreas , reduce sugar. Vegetable Oil , added fats and will affect the organs heart depending on type , choose unsaturated oils. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially in higher-quality cocoa , prefer dark chocolate. Milk Solids , saturated fat and lactose and will affect the organs heart & digestive system , use low-fat dairy. Leavening Agent , may cause bloating and will affect the organs digestive system , choose naturally leavened recipes.",
    severityCounts: { low: 3, medium: 3, high: 0 },
    organsAffected: ['metabolic system','teeth','pancreas','heart','digestive system','nervous system']
  },
  {
    name: 'Pepsi (Diet)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Carbonated Water', 'Artificial Sweetener', 'Caffeine', 'Color', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Carbonated Water , may cause bloating and will affect the organs digestive system , use still water instead. Artificial Sweetener , low-calorie substitute but may affect gut microbiota and will affect the organs digestive & metabolic systems in sensitive people , prefer minimal sweeteners. Caffeine , stimulant and will affect the organs nervous & cardiovascular systems at high intake , limit consumption. Color , additives may trigger sensitivity and will affect the organs digestive or immune systems in sensitive people , choose natural beverages. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , avoid frequent intake.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['digestive system','nervous system','cardiovascular system','liver','metabolic system']
  },
  {
    name: 'Cheetos',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Corn Meal', 'Vegetable Oil', 'Salt', 'Cheese Powder', 'Flavourings', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Corn Meal , processed carbohydrate and will affect the organs metabolic system , use whole-grain snacks. Vegetable Oil , added fat and will affect the organs heart depending on type , prefer unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Cheese Powder , dairy solids and will affect the organs heart & digestion in high-fat contexts , use low-fat seasoning. Flavourings , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , use natural spices. Preservative , extends shelf life and will affect the organs liver & digestive system long-term , choose preservative-free snacks.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','cardiovascular system','digestive system','liver']
  },
  {
    name: 'Turtle Chocolate (Local Brand)',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Milk Solids', 'Cocoa', 'Vegetable Oil', 'Emulsifier', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , increases caries risk and will affect the organs teeth & pancreas , cut down sugar. Milk Solids , saturated fat and lactose and will affect the organs heart & digestive system , choose low-fat alternatives. Cocoa , antioxidant potential in high-quality cocoa and will affect the organs heart & nervous system beneficially when cocoa is high-percentage , prefer dark options. Vegetable Oil , added fats and will affect the organs heart depending on type , avoid hydrogenated oils. Emulsifier , additive that may affect gut microbiota and will affect the organs digestive system in sensitive people , prefer minimal-emulsifier products. Flavor , may cause sensitivities and will affect the organs digestive or immune systems in susceptible people , choose natural flavors.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['teeth','pancreas','heart','digestive system','nervous system']
  },
  {
    name: 'Bournvita Biscuits',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Edible Vegetable Oil', 'Malted Barley', 'Milk Solids', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-wheat flour instead. Sugar , cariogenic and will affect the organs teeth & pancreas , reduce sugar. Edible Vegetable Oil , fat source and will affect the organs heart depending on type , use unsaturated oils. Malted Barley , carbohydrate & flavoring and will affect the organs metabolic system , prefer whole grains. Milk Solids , saturated fat and lactose and will affect the organs heart & digestive system , use low-fat milk solids. Leavening Agent , may cause bloating and will affect the organs digestive system , choose natural leavening if possible.",
    severityCounts: { low: 3, medium: 3, high: 0 },
    organsAffected: ['metabolic system','teeth','pancreas','heart','digestive system']
  },
  {
    name: 'Garden Vareli Olive Oil (Cooking)',
    category: 'cooking oil',
    ingredients: ingredients.filter(i =>
      ['Olive Oil'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Olive Oil , high in monounsaturated fats and will affect the organs heart beneficially when used in moderation , use extra-virgin olive oil for cold applications or moderate-heat cooking.",
    severityCounts: { low: 2, medium: 0, high: 0 },
    organsAffected: ['heart']
  },
  {
    name: 'Saffola Active Oil',
    category: 'cooking oil',
    ingredients: ingredients.filter(i =>
      ['Rice Bran Oil', 'Antioxidants', 'Vitamins'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Rice Bran Oil , favorable fatty acid profile and will affect the organs heart beneficially when used appropriately , prefer for high-heat cooking. Antioxidants , protect oils from oxidation and will affect the organs cellular health beneficially in small amounts , choose minimally processed oils. Vitamins , added micronutrients and will affect the organs overall nutrition positively where deficient , maintain balanced intake.",
    severityCounts: { low: 2, medium: 0, high: 0 },
    organsAffected: ['heart','cellular health','metabolic system']
  },
  {
    name: 'MTR Sambar Mix',
    category: 'seasoning',
    ingredients: ingredients.filter(i =>
      ['Tamarind', 'Spice Mix', 'Salt', 'Dehydrated Vegetables', 'Anti-caking Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Tamarind , digestive aid and will affect the organs digestive system beneficially , use fresh tamarind when possible. Spice Mix , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , prefer whole spices. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Dehydrated Vegetables , convenient nutrients but processed and will affect the organs digestive system moderately , prefer fresh vegetables. Anti-caking Agent , inert additive and will affect the organs digestive system minimally in some people , choose natural mixes.",
    severityCounts: { low: 3, medium: 1, high: 0 },
    organsAffected: ['digestive system','cardiovascular system']
  },
  {
    name: 'Tropicana Slice',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Mango Pulp', 'Sugar', 'Water', 'Preservatives', 'Acidity Regulators'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Mango Pulp , fruit nutrients but concentrated sugars and will affect the organs pancreas & teeth , prefer whole fruit. Sugar , added sugar and will affect the organs pancreas & teeth , choose no-added-sugar options. Water , hydration beneficial and will affect the organs overall positively , ensure adequate intake. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , choose fresh fruit. Acidity Regulators , stabilize pH and may irritate sensitive digestive tracts and will affect the organs digestive system in some people , use natural alternatives when possible.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['pancreas','teeth','digestive system','liver']
  },
  {
    name: 'Amul Fresh Cream (Whipping)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk Fat', 'Stabilizers', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Fat , high in saturated fat and will affect the organs heart when consumed in excess , use light cream or plant-based alternatives. Stabilizers , texture aids and will affect the organs digestive system minimally in some people , choose fewer additives. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , prefer fresh cream without preservatives.",
    severityCounts: { low: 1, medium: 1, high: 1 },
    organsAffected: ['heart','digestive system','liver']
  },
  {
    name: 'Cornflakes (Store Brand)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Corn Flakes', 'Sugar', 'Salt', 'Vitamins', 'Minerals', 'Malt Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Corn Flakes , processed cereal and will affect the organs metabolic system (high glycemic index) , prefer whole-grain cereals. Sugar , added sugar and will affect the organs pancreas & teeth , pick low-sugar variants. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Vitamins & Minerals , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet. Malt Flavor , added sweet flavor and will affect the organs pancreas & teeth if present in large amounts , choose unsweetened cereals.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','cardiovascular system']
  },
  {
    name: 'Kellogg\'s Chocos',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Cocoa', 'Malt Extract', 'Vitamins', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-grain options. Sugar , high added sugar and will affect the organs pancreas & teeth , choose low-sugar cereals. Cocoa , antioxidant potential in higher cocoa content and will affect the organs heart & nervous system positively when cocoa is substantial , pick high-cocoa choices. Malt Extract , added sugars/flavor and will affect the organs metabolic system , reduce added sweeteners. Vitamins , fortification beneficial and will affect the organs nutrient status positively , maintain balanced diet. Emulsifier , additive that may impact gut microbiota and will affect the organs digestive system in sensitive people , prefer minimal-additive products.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Tata Tea Premium (Leaf)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Black Tea Leaves'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Black Tea Leaves , antioxidant-rich but caffeinated and will affect the organs nervous & cardiovascular systems depending on intake , use in moderation or choose herbal alternatives if sensitive.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['nervous system','cardiovascular system']
  },
  {
    name: 'Colgate Strong Teeth Toothpaste',
    category: 'personal care',
    ingredients: ingredients.filter(i =>
      ['Fluoride', 'Abrasives', 'Sodium Lauryl Sulfate', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Fluoride , prevents dental caries and will affect the organs teeth beneficially when used correctly , avoid excess ingestion. Abrasives , help clean teeth but may erode enamel if overused and will affect the organs teeth & enamel , use appropriate abrasivity. Sodium Lauryl Sulfate , foaming agent that may irritate oral mucosa in some and will affect the organs oral mucosa , choose SLS-free if sensitive. Flavor , additives may cause sensitivities and will affect the organs oral mucosa or immune system in sensitive people , prefer mild flavors.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['teeth','oral mucosa']
  },
  {
    name: 'Surf Excel Matic (Detergent Liquid)',
    category: 'household',
    ingredients: ingredients.filter(i =>
      ['Surfactants', 'Builders', 'Fragrant', 'Stabilizers', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Surfactants , effective cleaning agents but may irritate skin and will affect the organs skin if direct exposure occurs , use gloves. Builders , enhance cleaning and may cause dryness on skin in some individuals and will affect the organs skin , rinse thoroughly. Fragrant , may trigger allergies and will affect the organs respiratory system & skin in sensitive people , choose fragrance-free formulations if allergic. Stabilizers , maintain formulation and will affect the organs skin minimally in most people , prefer mild formulations. Preservatives , prevent microbial growth but may affect the organs skin & immune system in sensitive individuals with chronic exposure , follow label directions.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['skin','respiratory system','immune system']
  },
  {
    name: 'Vaseline Petroleum Jelly',
    category: 'personal care',
    ingredients: ingredients.filter(i =>
      ['Petroleum Jelly (Petrolatum)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Petroleum Jelly (Petrolatum) , occlusive moisturizer and will affect the organs skin beneficially by preventing water loss but may trap impurities if not applied on clean skin , use as directed or opt for plant-based emollients if preferred.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['skin']
  },
  {
    name: 'Himalaya Baby Shampoo',
    category: 'personal care',
    ingredients: ingredients.filter(i =>
      ['Mild Surfactants', 'Herbal Extracts', 'Fragrance', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Mild Surfactants , cleanse hair and scalp but may irritate extremely sensitive skin and will affect the organs scalp/skin minimally in most infants , choose tear-free formulas. Herbal Extracts , soothing benefits and will affect the organs scalp/skin beneficially in many cases , patch-test for allergies. Fragrance , may cause skin or respiratory sensitivity and will affect the organs skin & respiratory system in some infants , prefer fragrance-free baby shampoos if sensitive. Preservatives , prevent microbial growth and will affect the organs skin & immune system in sensitive individuals with chronic exposure , use gentle-preservative formulations.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['scalp','skin','respiratory system','immune system']
  },
  {
    name: 'Dabur Amla Hair Oil',
    category: 'personal care',
    ingredients: ingredients.filter(i =>
      ['Amla Extract', 'Carrier Oil (Coconut/Other)', 'Fragrance'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Amla Extract , traditional antioxidant & hair health ingredient and will affect the organs scalp/skin beneficially in many users , use regularly as a topical. Carrier Oil (Coconut/Other) , conditions hair and will affect the organs hair shaft positively but may clog pores for some and will affect the organs scalp/skin in sensitive individuals , choose suitable carrier oil. Fragrance , may cause sensitivity and will affect the organs skin & respiratory system in sensitive people , choose fragrance-free if allergic.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['scalp','hair','skin']
  },
  {
    name: 'Dettol Antibacterial Soap (Original)',
    category: 'personal care',
    ingredients: ingredients.filter(i =>
      ['Chloroxylenol', 'Surfactants', 'Fragrance', 'Moisturizer'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Chloroxylenol , antiseptic and will affect the organs skin/microbial load beneficially for hygiene , avoid overuse on sensitive skin. Surfactants , cleansing agents and will affect the organs skin by removing oils which may dry skin in some individuals , moisturize after use. Fragrance , may trigger allergy and will affect the organs skin & respiratory system in sensitive users , choose fragrance-free if allergic. Moisturizer , counters dryness and will affect the organs skin beneficially when included , select glycerin-based moisturizers for dry skin.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['skin','respiratory system']
  },
  {
    name: 'Colgate Sensitive Toothpaste',
    category: 'personal care',
    ingredients: ingredients.filter(i =>
      ['Potassium Nitrate', 'Fluoride', 'Abrasives', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potassium Nitrate , reduces dental sensitivity and will affect the organs teeth beneficially for sensitivity relief , use as directed. Fluoride , prevents caries and will affect the organs teeth beneficially in recommended amounts , avoid ingestion. Abrasives , clean teeth but can erode enamel if overused and will affect the organs teeth & enamel , use low-abrasivity formulas. Flavor , may cause sensitivities in some and will affect the organs oral mucosa or immune systems in susceptible individuals , choose mild flavors.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['teeth','oral mucosa']
  },
  {
    name: 'Dettol Handwash (Original)',
    category: 'personal care',
    ingredients: ingredients.filter(i =>
      ['Surfactants', 'Antimicrobial Agent', 'Fragrance', 'Moisturizer'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Surfactants , cleanse hands but may dry skin and will affect the organs skin if used excessively , use gentle formulations. Antimicrobial Agent , reduces microbes and will affect the organs skin microbiome beneficially for hygiene but avoid overuse that may disrupt flora. Fragrance , may cause skin/respiratory sensitivity and will affect the organs skin & respiratory system in sensitive individuals , choose fragrance-free if allergic. Moisturizer , counters dryness and will affect the organs skin beneficially after washing , use moisturizers for frequent handwashing.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['skin','respiratory system','immune system']
  },
  {
    name: 'Lays Magic Masala (Large)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Potatoes', 'Vegetable Oil', 'Salt', 'Spice Mix', 'Flavor Enhancers', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potatoes , starchy and when fried will affect the organs metabolic system depending on portion & frequency , choose baked. Vegetable Oil , frying oil and will affect the organs heart depending on fat type and reuse , use better oils. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Spice Mix , flavor & digestive stimulation and will affect the organs digestive system in moderation , prefer natural spices. Flavor Enhancers , additives may cause sensitivities and will affect the organs nervous & digestive systems in susceptible individuals , choose no-additive snacks. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic intake , avoid frequent consumption.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','cardiovascular system','digestive system','liver']
  },
  {
    name: 'Tropicana Fruit Punch',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Fruit Juices', 'Sugar', 'Water', 'Preservatives', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Fruit Juices , provide vitamins but concentrated sugar and will affect the organs pancreas & teeth , prefer whole fruits. Sugar , added sugar and will affect the organs pancreas & teeth , choose no-added-sugar options. Water , hydration beneficial and will affect the organs overall positively , maintain intake. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , choose fresh fruit drinks. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , select natural flavors.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['pancreas','teeth','digestive system','liver']
  },
  {
    name: 'Kissan Fruit Jam (Strawberry)',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Fruit Pulp', 'Sugar', 'Pectin', 'Acidity Regulator', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Fruit Pulp , natural fruit nutrients and will affect the organs digestive & immune systems beneficially , prefer fresh fruit. Sugar , added sugar and will affect the organs pancreas & teeth , reduce added sugar. Pectin , gelling agent beneficial for digestion and will affect the organs digestive system positively , use natural pectin. Acidity Regulator , stabilizes pH and may irritate sensitive digestive systems and will affect the organs digestive system in some people , use natural acidulants like lemon. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic use , choose preservative-free preserves.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['digestive system','immune system','pancreas','teeth','liver']
  },
  {
    name: 'Amul Cheese Spread (Single Serve)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Edible Vegetable Oil', 'Salt', 'Emulsifiers', 'Preservatives', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids , dairy saturated fat and lactose and will affect the organs heart & digestive system , use low-fat cheese. Edible Vegetable Oil , added fat and will affect the organs heart depending on type , avoid hydrogenated oils. Salt , excess sodium and will affect the organs cardiovascular system , pick reduced-salt options. Emulsifiers , additives that may alter gut microbiota and will affect the organs digestive system in sensitive people , prefer minimal-emulsifier products. Preservatives , extend shelf life and will affect the organs liver & digestive system long-term , choose fresh cheese spreads. Flavor , additives may trigger sensitivities and will affect the organs digestive or immune systems in sensitive individuals , use natural flavorings.",
    severityCounts: { low: 2, medium: 3, high: 1 },
    organsAffected: ['heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Kellogg\'s Muesli (Mixed Fruit)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Oats', 'Dried Fruits', 'Nuts', 'Sugar (if added)', 'Salt', 'Vitamins'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fiber and will affect the organs heart & digestive system beneficially , prefer rolled/steel-cut oats. Dried Fruits , concentrated sugars and will affect the organs teeth & pancreas if overconsumed , use fresh fruit when possible. Nuts , healthy fats & protein and will affect the organs heart & metabolic system beneficially in moderation , choose unsalted nuts. Sugar (if added) , increases glycemic load and will affect the organs pancreas & teeth , reduce added sugar. Salt , excess sodium and will affect the organs cardiovascular system , minimize salt. Vitamins , fortification beneficial and will affect the organs nutrient status positively if deficient , maintain balanced intake.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','teeth','pancreas','cardiovascular system']
  },
  {
    name: 'Tata Sampann Masoor Dal',
    category: 'staples',
    ingredients: ingredients.filter(i =>
      ['Masoor Dal', 'Salt (if packaged)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Masoor Dal , protein & fiber and will affect the organs digestive & metabolic systems beneficially , include as part of balanced diet. Salt (if packaged) , excess sodium and will affect the organs cardiovascular system , use minimal added salt.",
    severityCounts: { low: 2, medium: 0, high: 0 },
    organsAffected: ['digestive system','metabolic system','cardiovascular system']
  },
  {
    name: 'Tata Coffee Grand (Instant)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Coffee Solids', 'Anticaking Agent', 'Stabilizer'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Coffee Solids , stimulant and will affect the organs nervous system & cardiovascular system in sensitive individuals , limit intake. Anticaking Agent , low risk but may affect digestion in some and will affect the organs digestive system minimally , choose pure coffee. Stabilizer , textural agent and will affect the organs digestive system minimally in sensitive people , prefer minimal-additive options.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['nervous system','cardiovascular system','digestive system']
  },
  {
    name: 'Haldiram\'s Soan Papdi (Traditional Sweet)',
    category: 'sweets',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Refined Wheat Flour', 'Ghee', 'Cardamom', 'Almonds', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , very high sugar and will affect the organs pancreas & teeth , limit intake. Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-grain or alternative flours. Ghee , saturated fat and will affect the organs heart when consumed frequently , use sparingly. Cardamom , flavor & digestive benefits and will affect the organs digestive system positively in moderation , use fresh cardamom. Almonds , healthy fats & minerals and will affect the organs heart & metabolic system beneficially in moderation , use unsalted nuts. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic use , prefer freshly made sweets.",
    severityCounts: { low: 2, medium: 3, high: 1 },
    organsAffected: ['pancreas','teeth','metabolic system','heart','digestive system','liver']
  },
  {
    name: 'MTR Idli/Dosa Mix (Instant)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Rice Flour', 'Urad Dal Powder', 'Salt', 'Fermentation Agent', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Rice Flour , carbohydrate source and will affect the organs metabolic system depending on portion & pairing , prefer balanced meals. Urad Dal Powder , protein & fiber and will affect the organs digestive & metabolic systems beneficially when combined with other grains , use as part of varied diet. Salt , excess sodium and will affect the organs cardiovascular system , minimize salt. Fermentation Agent , aids digestibility and will affect the organs digestive system beneficially , prefer naturally fermented foods. Preservative , extends shelf life and will affect the organs liver & digestive system long-term , choose preservative-free mixes.",
    severityCounts: { low: 3, medium: 1, high: 0 },
    organsAffected: ['metabolic system','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Tata Salt I-Shakti (Iodised)',
    category: 'staples',
    ingredients: ingredients.filter(i =>
      ['Salt', 'Iodine'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Salt , necessary electrolyte but excess affects blood pressure and will affect the organs cardiovascular system , use in moderation. Iodine , essential for thyroid function and will affect the organs endocrine system beneficially when present , use iodised salt as recommended for populations with iodine deficiency.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['cardiovascular system','endocrine system']
  },
  {
    name: 'Nivea Soft Moisturizing Cream',
    category: 'personal care',
    ingredients: ingredients.filter(i =>
      ['Emollients', 'Glycerin', 'Fragrance', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Emollients , improve skin barrier and will affect the organs skin beneficially , choose non-comedogenic formulations if needed. Glycerin , humectant and will affect the organs skin beneficially by retaining moisture , use regularly for dry skin. Fragrance , may cause skin or respiratory sensitivity and will affect the organs skin & respiratory system in susceptible people , choose fragrance-free if allergic. Preservatives , prevent microbial growth but may affect the organs skin & immune system in sensitive individuals with chronic exposure , prefer safe-preservative products.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['skin','respiratory system','immune system']
  },
  {
    name: 'Dettol Surface Cleaner',
    category: 'household',
    ingredients: ingredients.filter(i =>
      ['Phenolic Antimicrobial', 'Surfactants', 'Fragrance', 'Stabilizers'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Phenolic Antimicrobial , effective biocide and will affect the organs surface microbial load beneficially but can be irritating to skin/respiratory tract if misused , use with ventilation and PPE. Surfactants , cleaning agents that may irritate skin and will affect the organs skin if exposure is direct , wear gloves. Fragrance , may cause respiratory or skin sensitivity and will affect the organs respiratory system & skin in sensitive persons , prefer fragrance-free cleaners. Stabilizers , maintain product integrity and will affect the organs minimally in most users , follow label directions.",
    severityCounts: { low: 1, medium: 2, high: 0 },
    organsAffected: ['skin','respiratory system']
  },
  {
    name: 'Garnier Face Wash (Men)',
    category: 'personal care',
    ingredients: ingredients.filter(i =>
      ['Surfactants', 'Astringents', 'Fragrance', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Surfactants , clean skin but may strip oils and will affect the organs skin by causing dryness for some , use gentle surfactants. Astringents , tighten pores but may irritate sensitive skin and will affect the organs skin & barrier function , use sparingly. Fragrance , may trigger sensitivities and will affect the organs skin & respiratory system in sensitive users , prefer fragrance-free if allergic. Preservatives , prevent microbial growth and will affect the organs skin & immune system in sensitive individuals with chronic exposure , pick gentle-preservative formulas.",
    severityCounts: { low: 1, medium: 2, high: 0 },
    organsAffected: ['skin','respiratory system','immune system']
  },
  {
    name: 'Amul Gold Milk (Toned)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Stabilizers', 'Vitamins'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , source of protein & calcium but contains saturated fat and lactose and will affect the organs heart & digestive system in full-fat forms , choose toned/low-fat versions if concerned about heart health. Stabilizers , maintain texture and will affect the organs digestive system minimally in some people , choose simpler formulations. Vitamins , fortification can address deficiencies and will affect the organs overall nutrition beneficially where needed , maintain balanced diet.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['heart','digestive system','skeletal system']
  },
  {
    name: 'Bournvita Biscuits (Choco)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Cocoa', 'Vegetable Oil', 'Milk Solids', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , prefer whole-grain alternatives. Sugar , high added sugar and will affect the organs pancreas & teeth , reduce sugar. Cocoa , antioxidant potential in high-quality cocoa and will affect the organs heart & nervous system beneficially when cocoa content is high , choose dark cocoa. Vegetable Oil , added fats and will affect the organs heart depending on type , avoid hydrogenated oils. Milk Solids , saturated fat & lactose and will affect the organs heart & digestive system , use low-fat options. Emulsifier , additive that may alter gut microbiota and will affect the organs digestive system in sensitive people , pick minimal-emulsifier products.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Horlicks Lite (Sugar Reduced)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Malted Barley', 'Wheat Flour', 'Reduced Sugar', 'Milk Solids', 'Vitamins'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Malted Barley , carbohydrate source and will affect the organs metabolic system depending on portion , use in moderation. Wheat Flour , carbs and will affect the organs metabolic system , prefer whole grains. Reduced Sugar , lower glycemic load and will affect the organs pancreas & teeth beneficially compared to full-sugar variants , choose low-sugar options. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high-fat contexts , use low-fat milk. Vitamins , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet.",
    severityCounts: { low: 3, medium: 1, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Surf Excel Quick Wash (Bar)',
    category: 'household',
    ingredients: ingredients.filter(i =>
      ['Surfactants', 'Builders', 'Fragrances', 'Bleaching Agents'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Surfactants , remove dirt but may irritate skin and will affect the organs skin if direct contact is prolonged , wear gloves. Builders , enhance cleaning and may dry skin in some people and will affect the organs skin , rinse garments thoroughly. Fragrances , may cause allergy and will affect the organs skin & respiratory system in sensitive people , use fragrance-free bars where needed. Bleaching Agents , strong stain removers that can be irritating and will affect the organs skin & respiratory system if misused , use as directed with ventilation.",
    severityCounts: { low: 1, medium: 2, high: 0 },
    organsAffected: ['skin','respiratory system']
  },
  {
    name: 'Knorr Cup-a-Soup (Tomato)',
    category: 'ready meals',
    ingredients: ingredients.filter(i =>
      ['Tomato Powder', 'Salt', 'Sugar', 'Starch', 'Preservatives', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Tomato Powder , provides lycopene and will affect the organs digestive & cardiovascular systems beneficially in natural form , prefer fresh tomatoes. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Starch , thickener and may affect the organs metabolic system if refined and will affect glycemic load , choose whole-food thickeners. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , choose fresh soups where possible. Flavor , additives may trigger sensitivities and will affect the organs digestive or immune systems in sensitive people , prefer natural seasoning.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['digestive system','cardiovascular system','pancreas','teeth','liver']
  },
  {
    name: 'Britannia Little Hearts Creamy',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Vegetable Oil', 'Cream Powder', 'Emulsifier', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-grain alternatives. Sugar , raises blood glucose and will affect the organs pancreas & teeth , reduce sugar. Vegetable Oil , added fats and will affect the organs heart depending on type , choose unsaturated oils. Cream Powder , dairy fat and lactose and will affect the organs heart & digestive system in high-fat contexts , prefer low-fat options. Emulsifier , additive that may change gut microbiota and will affect the organs digestive system in sensitive people , pick minimal-additive products. Salt , excess sodium and will affect the organs cardiovascular system , limit salt.",
    severityCounts: { low: 3, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Amul Mithai Mate (Rabri Mix)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Sugar', 'Stabilizer', 'Flavor', 'Cardamom'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system when consumed in high amounts , use low-fat alternatives. Sugar , high added sugar and will affect the organs pancreas & teeth , reduce sugar. Stabilizer , texture aid and will affect the organs digestive system minimally in sensitive people , choose natural products. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , use natural flavor. Cardamom , digestive & flavor benefit and will affect the organs digestive system positively in moderation , use fresh spices.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','pancreas','teeth','immune system']
  },
  {
    name: 'Kurkure Xpress (Masala)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Corn Meal', 'Vegetable Oil', 'Salt', 'Spices', 'Preservatives', 'Flavor Enhancers'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Corn Meal , processed carb and will affect the organs metabolic system , choose whole-grain snacks. Vegetable Oil , frying fat and will affect the organs heart depending on type , avoid hydrogenated oils. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Spices , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , prefer natural spices. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic intake , pick preservative-free options. Flavor Enhancers , may cause sensitivities and will affect the organs nervous & digestive systems in susceptible people , choose natural seasoning.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Hershey\'s Syrup (Chocolate)',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Cocoa', 'Corn Syrup', 'Preservatives', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , high added sugar and will affect the organs pancreas & teeth , reduce use. Cocoa , antioxidant potential when high-quality and will affect the organs heart & nervous system beneficially in higher-cocoa products , prefer pure cocoa. Corn Syrup , high glycemic sweetener and will affect the organs metabolic system & pancreas , use natural sweeteners. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic intake , opt for preservative-free syrups. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive individuals , choose natural flavoring.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['pancreas','teeth','metabolic system','heart','liver']
  },
  {
    name: 'Maggi Hot Heads (Fiery)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Tastemaker', 'Salt', 'Chilli Powder', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , pick whole-grain noodles. Vegetable Oil , frying fat and will affect the organs heart depending on type , choose healthier oils. Tastemaker , additives may trigger sensitivities and will affect the organs digestive or immune systems in sensitive people , use fresh seasoning. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Chilli Powder , spicy and may irritate sensitive digestive tracts and will affect the organs digestive system in some individuals , prefer milder variants. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic use , prefer preservative-free options.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Right Guard Aerosol (Deodorant)',
    category: 'personal care',
    ingredients: ingredients.filter(i =>
      ['Propellant', 'Fragrance', 'Alcohol', 'Antimicrobial Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Propellant , aerosol delivery and may affect respiratory system if inhaled and will affect the organs respiratory system in misuse , use in well-ventilated areas. Fragrance , may cause skin/respiratory sensitivity and will affect the organs skin & respiratory system in susceptible individuals , choose fragrance-free if allergic. Alcohol , antiseptic and may dry skin and will affect the organs skin & mucosa in some users , prefer alcohol-free formulas if dry skin. Antimicrobial Agent , reduces microbial growth and will affect the organs skin microbiome beneficially for odor control but avoid overuse that may disrupt flora.",
    severityCounts: { low: 1, medium: 2, high: 0 },
    organsAffected: ['respiratory system','skin','immune system']
  },
  {
    name: 'Parachute Coconut Oil',
    category: 'cooking/oil',
    ingredients: ingredients.filter(i =>
      ['Coconut Oil (Refined/Cold Pressed)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Coconut Oil , high in saturated fats and will affect the organs heart when consumed in excess (use in moderation) , prefer oils with higher unsaturated fat content for daily cooking.",
    severityCounts: { low: 1, medium: 0, high: 1 },
    organsAffected: ['heart']
  },
  {
    name: 'Lux Soap (Classic)',
    category: 'personal care',
    ingredients: ingredients.filter(i =>
      ['Surfactants', 'Fragrance', 'Moisturizer', 'Color'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Surfactants , effective cleansers but may dry skin and will affect the organs skin if used frequently without moisturization , use gentle soaps. Fragrance , may cause skin or respiratory sensitivity and will affect the organs skin & respiratory system in sensitive individuals , choose fragrance-free if allergic. Moisturizer , reduces dryness and will affect the organs skin beneficially if included , opt for moisturizing formulations. Color , additives may cause sensitivity in some and will affect the organs skin & immune system in sensitive people , prefer uncolored soaps.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['skin','respiratory system','immune system']
  },
  {
    name: 'MTR Puliogare Mix',
    category: 'seasoning',
    ingredients: ingredients.filter(i =>
      ['Rice', 'Tamarind Powder', 'Spice Mix', 'Salt', 'Dehydrated Vegetables', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Rice , carbohydrate staple and will affect the organs metabolic system depending on portion & variety , prefer brown rice for fiber. Tamarind Powder , digestive aid and will affect the organs digestive system beneficially , use fresh tamarind. Spice Mix , flavor & digestive benefits and will affect the organs digestive system positively in moderation , prefer natural spices. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Dehydrated Vegetables , convenient nutrients but processed and will affect the organs digestive system moderately , prefer fresh vegetables. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic use , choose preservative-free mixes.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Cadbury Bournville Dark',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Cocoa Solids', 'Cocoa Butter', 'Sugar', 'Emulsifier (Soy Lecithin)', 'Vanilla'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Cocoa Solids , antioxidant potential and will affect the organs heart & nervous system positively when high-cocoa , use high-cocoa dark chocolate instead. Cocoa Butter , fat source and will affect the organs heart depending on intake , use in moderation. Sugar , added sugar and will affect the organs pancreas & teeth , use less sugar or natural sweeteners instead. Emulsifier (Soy Lecithin) , processing aid and will affect the organs digestive system in sensitive people , use lecithin-free chocolate if desired. Vanilla , flavoring and will affect the organs digestive/immune system minimally , use natural vanilla where possible instead.",
    severityCounts: { low: 3, medium: 1, high: 0 },
    organsAffected: ['heart','nervous system','pancreas','teeth','digestive system']
  },
  {
    name: 'Amul Cheese Spread (Jar)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Edible Vegetable Oil', 'Salt', 'Emulsifiers', 'Preservatives', 'Flavour'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids , saturated fat & lactose and will affect the organs heart & digestive system , use low-fat cheese alternatives instead. Edible Vegetable Oil , added fats and will affect the organs heart depending on type , choose unsaturated oils instead. Salt , excess sodium and will affect the organs cardiovascular system , use reduced-salt options. Emulsifiers , texture aids and may affect gut microbiota and will affect the organs digestive system in sensitive individuals , prefer minimal-emulsifier spreads. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic intake , opt for preservative-free spreads. Flavour , additives may trigger sensitivities and will affect the organs digestive or immune systems in some people , use natural flavorings instead.",
    severityCounts: { low: 2, medium: 3, high: 1 },
    organsAffected: ['heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Britannia 50-50 (Biscuit)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Vegetable Oil', 'Milk Solids', 'Leavening Agent', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-wheat flour instead. Sugar , increases blood glucose and will affect the organs pancreas & teeth , reduce sugar. Vegetable Oil , fat source and will affect the organs heart depending on type , use unsaturated oils. Milk Solids , saturated fat & lactose and will affect the organs heart & digestive system , choose low-fat dairy. Leavening Agent , may cause bloating and will affect the organs digestive system , prefer natural leavening. Salt , excess sodium and will affect the organs cardiovascular system , limit salt intake.",
    severityCounts: { low: 3, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system','cardiovascular system']
  },
  {
    name: 'Amul Cheese Singles (Kids)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Salt', 'Emulsifiers', 'Preservatives', 'Vitamins'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids , saturated fat & lactose and will affect the organs heart & digestive system , use low-fat dairy options. Salt , excess sodium and will affect the organs cardiovascular system , choose reduced-salt options. Emulsifiers , texture aids that may alter gut microbiota and will affect the organs digestive system in some people , pick minimal-emulsifier products. Preservatives , prolong shelf life and will affect the organs liver & digestive system with chronic use , prefer fresh cheese. Vitamins , fortification beneficial and will affect the organs overall nutrition positively where deficient , maintain balanced diet.",
    severityCounts: { low: 2, medium: 2, high: 1 },
    organsAffected: ['heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Parle Hide & Seek Chocolate (Cream)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Vegetable Oil', 'Cream Powder', 'Emulsifier', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use wholegrain wafers instead. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Vegetable Oil , fat source and will affect the organs heart depending on type , avoid hydrogenated oils. Cream Powder , dairy fat and lactose and will affect the organs heart & digestive system , choose low-fat options. Emulsifier , processing aid that may affect gut microbiota and will affect the organs digestive system in sensitive people , use minimal additives. Salt , excess sodium and will affect the organs cardiovascular system , limit salt.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Tata Salt Lite (Table Salt Low Sodium)',
    category: 'staples',
    ingredients: ingredients.filter(i =>
      ['Reduced Sodium Salt', 'Potassium Chloride', 'Iodine'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Reduced Sodium Salt , lowers sodium intake and will affect the organs cardiovascular system beneficially for many people , use as advised. Potassium Chloride , sodium alternative and will affect the organs cardiovascular & renal systems (monitor medications) , consult a doctor if necessary. Iodine , essential for thyroid and will affect the organs endocrine system beneficially when required , continue iodisation where necessary.",
    severityCounts: { low: 2, medium: 0, high: 0 },
    organsAffected: ['cardiovascular system','renal system','endocrine system']
  },
  {
    name: 'MTR Sambhar Powder',
    category: 'spices',
    ingredients: ingredients.filter(i =>
      ['Coriander', 'Chilli', 'Turmeric', 'Fenugreek', 'Asafoetida', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Coriander , digestive aid and will affect the organs digestive system beneficially , use whole coriander for freshness. Chilli , pungent and may irritate sensitive digestive tracts and will affect the organs digestive system in some people , use mild chilli. Turmeric , anti-inflammatory and will affect the organs immune & joint systems beneficially in moderation , pair with black pepper for absorption. Fenugreek , may influence glycemic control and will affect the organs metabolic system beneficially in moderation , consult if on diabetes medication. Asafoetida , digestive aid and will affect the organs digestive system beneficially for some , use small amounts. Salt , excess sodium and will affect the organs cardiovascular system , reduce added salt.",
    severityCounts: { low: 4, medium: 1, high: 0 },
    organsAffected: ['digestive system','immune system','joint health','metabolic system','cardiovascular system']
  },
  {
    name: 'Tropicana Fruit Cocktail (Juice)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Mixed Fruit Juice', 'Sugar', 'Water', 'Preservatives', 'Acidity Regulators'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Mixed Fruit Juice , provides vitamins but concentrated sugar and will affect the organs pancreas & teeth , prefer whole fruit. Sugar , added sugar and will affect the organs pancreas & teeth , choose no-added-sugar options. Water , hydration and will affect the organs overall positively , maintain adequate intake. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , pick fresh-pressed options when possible. Acidity Regulators , stabilize pH and may irritate sensitive digestive tracts and will affect the organs digestive system in some individuals , use natural acidulants where possible.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['pancreas','teeth','digestive system','liver']
  },
  {
    name: 'Amul Dark Chocolate (Bar)',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Cocoa Solids', 'Cocoa Butter', 'Sugar', 'Emulsifier', 'Vanilla'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Cocoa Solids , antioxidant potential and will affect the organs heart & nervous system beneficially when cocoa % is high , prefer high-cocoa bars. Cocoa Butter , fat source and will affect the organs heart depending on intake , consume in moderation. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Emulsifier , processing aid that may alter gut microbiota and will affect the organs digestive system in sensitive people , seek minimal-emulsifier variants. Vanilla , flavor component and will affect the organs digestive/immune system minimally , use natural vanilla when possible.",
    severityCounts: { low: 3, medium: 1, high: 0 },
    organsAffected: ['heart','nervous system','pancreas','teeth','digestive system']
  },
  {
    name: 'Kurkure Green Chutney (Sticks)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Corn Meal', 'Vegetable Oil', 'Spice Mix', 'Salt', 'Flavorings', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Corn Meal , processed carb and will affect the organs metabolic system , choose whole-grain snacks. Vegetable Oil , frying oil and will affect the organs heart depending on fat type & reuse , prefer healthier oils. Spice Mix , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , use real spices. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Flavorings , additives may trigger sensitivities and will affect the organs digestive or immune systems in sensitive people , use natural seasonings. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic intake , pick preservative-free snacks.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Maggi Hot & Sweet Sauce',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Tomato Concentrate', 'Sugar', 'Vinegar', 'Salt', 'Chilli', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Tomato Concentrate , source of lycopene and will affect the organs digestive & cardiovascular systems beneficially , use fresh tomatoes where possible. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar usage. Vinegar , acidic and may affect the organs digestive system if overused , use in moderation. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Chilli , spice that may irritate sensitive digestive systems and will affect the organs digestive system in some individuals , choose milder versions if needed. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic use , pick preservative-free sauces.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['digestive system','cardiovascular system','pancreas','teeth','liver']
  },
  {
    name: 'Tata Sampann Besan (Gram Flour)',
    category: 'staples',
    ingredients: ingredients.filter(i =>
      ['Gram Flour (Besan)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Gram Flour (Besan) , high-protein legume flour and will affect the organs digestive & metabolic systems beneficially , use as protein-rich staple instead of refined flours.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['digestive system','metabolic system']
  },
  {
    name: 'Dabur Honey (Premium)',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Honey'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Honey , natural sweetener but still sugar and will affect the organs teeth & pancreas if overused , use minimal amounts or raw/local honey where possible.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['teeth','pancreas']
  },
  {
    name: 'CavinKare Chyawanprash',
    category: 'health foods',
    ingredients: ingredients.filter(i =>
      ['Herbal Extracts', 'Sugar', 'Honey', 'Sesame Oil', 'Ghee'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Herbal Extracts , traditional immune-supporting herbs and will affect the organs immune system beneficially for many users , consult healthcare for chronic use. Sugar , high added sugar and will affect the organs pancreas & teeth , reduce quantity if diabetic. Honey , natural sweetener but still sugar and will affect the organs pancreas & teeth , use sparingly. Sesame Oil , healthy fats and will affect the organs heart beneficially in moderation , prefer cold-pressed oils. Ghee , saturated fat and will affect the organs heart if consumed in excess , use sparingly or use healthier oils.",
    severityCounts: { low: 3, medium: 2, high: 1 },
    organsAffected: ['immune system','pancreas','teeth','heart']
  },
  {
    name: 'Tata Tea Premium (Green Tea)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Green Tea Leaves'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Green Tea Leaves , antioxidant-rich and will affect the organs cardiovascular & metabolic systems beneficially when consumed in moderation , prefer plain green tea without sugar.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['cardiovascular system','metabolic system']
  },
  {
    name: 'Horlicks Lite (Chocolate)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Malted Barley', 'Wheat Flour', 'Reduced Sugar', 'Milk Solids', 'Vitamins & Minerals', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Malted Barley , carbohydrate source and will affect the organs metabolic system depending on portion , use in moderation. Wheat Flour , carbs and will affect the organs metabolic system , prefer whole grains. Reduced Sugar , lower glycemic load and will affect the organs pancreas & teeth beneficially compared with full-sugar variants , choose low-sugar options. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high-fat forms , use low-fat milk. Vitamins & Minerals , fortification benefits and will affect the organs overall nutrition positively where deficient , maintain balanced diet. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , prefer natural flavors.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Haldiram\'s Aloo Bhujia (Plain)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Potato', 'Gram Flour', 'Edible Vegetable Oil', 'Salt', 'Spices'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potato , starchy ingredient and will affect the organs metabolic system when fried , prefer baked snacks. Gram Flour , protein-rich and will affect the organs digestive & metabolic systems beneficially , include as healthy legume alternative. Edible Vegetable Oil , frying oil and will affect the organs heart depending on type & reuse , choose healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Spices , flavor & digestive stimulus and will affect the organs digestive system positively in moderation , use real spices.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','digestive system','heart','cardiovascular system']
  },
  {
    name: 'Tata Sampann Ragi Flour',
    category: 'staples',
    ingredients: ingredients.filter(i =>
      ['Ragi Flour (Finger Millet)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Ragi Flour , nutrient-dense millet high in calcium and fiber and will affect the organs skeletal & digestive systems beneficially , use as a whole-grain alternative to refined flours.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['skeletal system','digestive system']
  },
  {
    name: 'Pringles Salt & Vinegar',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Potato Flakes', 'Vegetable Oil', 'Salt', 'Vinegar Powder', 'Flavorings', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potato Flakes , processed carbohydrate and will affect the organs metabolic system , prefer whole potatoes. Vegetable Oil , frying fat and will affect the organs heart depending on type , avoid hydrogenated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Vinegar Powder , acidic seasoning and will affect the organs digestive system in sensitive people , use mild vinegar. Flavorings , additives may trigger sensitivities and will affect the organs digestive or immune systems in some people , choose natural flavoring. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic intake , pick preservative-free snacks.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','cardiovascular system','digestive system','liver']
  },
  {
    name: 'Dalda Vanaspati (Cooking)',
    category: 'cooking fat',
    ingredients: ingredients.filter(i =>
      ['Hydrogenated Vegetable Oil', 'Antioxidant', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Hydrogenated Vegetable Oil , contains trans/saturated fats and will affect the organs heart adversely with prolonged intake , avoid hydrogenated fats and use unrefined unsaturated oils instead. Antioxidant , prevents oxidation and will affect the organs cellular health minimally beneficially in small amounts , choose minimally processed oils. Emulsifier , processing aid and may affect gut microbiota and will affect the organs digestive system in sensitive people , prefer single-ingredient oils.",
    severityCounts: { low: 1, medium: 1, high: 1 },
    organsAffected: ['heart','cellular health','digestive system']
  },
  {
    name: 'MTR Pav Bhaji Masala',
    category: 'spices',
    ingredients: ingredients.filter(i =>
      ['Coriander', 'Chilli', 'Turmeric', 'Black Pepper', 'Cumin', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Coriander , digestive aid and will affect the organs digestive system beneficially , use fresh roasted coriander. Chilli , pungent and may irritate sensitive digestive tracts and will affect the organs digestive system in some people , use mild chilli. Turmeric , anti-inflammatory and will affect the organs immune & joint systems beneficially in moderation , pair with black pepper for absorption. Black Pepper , improves absorption and will affect the organs digestive & metabolic systems beneficially in moderation , use freshly ground pepper. Cumin , aids digestion and will affect the organs digestive system positively , prefer roasted cumin. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt.",
    severityCounts: { low: 4, medium: 1, high: 0 },
    organsAffected: ['digestive system','immune system','joint health','cardiovascular system','metabolic system']
  },
  {
    name: 'Tropicana Essentials (Mango)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Mango Pulp', 'Sugar (if present)', 'Vitamins', 'Preservatives', 'Acidity Regulator'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Mango Pulp , fruit nutrients but concentrated sugar and will affect the organs pancreas & teeth if overused , prefer whole fruit. Sugar (if present) , added sugar and will affect the organs pancreas & teeth , select no-added-sugar variants. Vitamins , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic use , choose fresh fruit where possible. Acidity Regulator , stabilizer that may irritate sensitive digestive systems and will affect the organs digestive system in susceptible individuals , use natural acidulants like lemon.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['pancreas','teeth','digestive system','liver']
  },
  {
    name: 'Glucon-D (Orange)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Glucose', 'Salt', 'Vitamins', 'Flavor', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Glucose , quick energy and will affect the organs pancreas & metabolic system (use for short-term rehydration only) , use as directed. Salt , electrolyte replacement but excess affects cardiovascular system and will affect the organs cardiovascular system , follow guidelines. Vitamins , support metabolism and immune function and will affect the organs metabolic & immune systems positively when deficient , maintain balanced diet. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , prefer natural flavoring. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , avoid frequent consumption.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['pancreas','metabolic system','cardiovascular system','immune system','liver']
  },
  {
    name: 'Kellogg\'s All-Bran (Wheat)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Wheat Bran', 'Wheat Flour', 'Sugar (small)', 'Vitamins', 'Minerals'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Wheat Bran , high fiber and will affect the organs digestive system beneficially , use bran-rich cereals. Wheat Flour , carbohydrate and will affect the organs metabolic system depending on processing , prefer whole-wheat. Sugar (small) , added sugar and will affect the organs pancreas & teeth if present , prefer minimal sugar. Vitamins & Minerals , fortification beneficial and will affect the organs nutrient status positively where needed , maintain balanced diet.",
    severityCounts: { low: 3, medium: 0, high: 0 },
    organsAffected: ['digestive system','metabolic system','pancreas','teeth']
  },
  {
    name: 'Nestle KitKat Dark',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Cocoa Solids', 'Sugar', 'Vegetable Oil', 'Milk Solids', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-wheat wafers if available. Cocoa Solids , antioxidant potential and will affect the organs heart & nervous system beneficially at higher percentages , choose dark variants. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Vegetable Oil , added fats and will affect the organs heart depending on type , avoid hydrogenated oils. Milk Solids , saturated fat & lactose and will affect the organs heart & digestive system , use lower-fat dairy versions. Emulsifier , processing aid that may affect gut microbiota and will affect the organs digestive system in sensitive people , prefer minimal-additive products.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','nervous system','pancreas','teeth','digestive system']
  },
  {
    name: 'Aashirvaad Select Premium (Atta)',
    category: 'staples',
    ingredients: ingredients.filter(i =>
      ['Whole Wheat Flour (Atta)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Whole Wheat Flour (Atta) , high in fiber and micronutrients and will affect the organs digestive & metabolic systems beneficially compared with refined flour , use whole-wheat atta for daily rotis.",
    severityCounts: { low: 2, medium: 0, high: 0 },
    organsAffected: ['digestive system','metabolic system']
  },
  {
    name: 'MTR Bisi Bele Bath Mix',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Rice', 'Toor Dal', 'Spice Mix', 'Tamarind', 'Salt', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Rice , carbohydrate base and will affect the organs metabolic system depending on portion & variety , prefer brown rice. Toor Dal , protein & fiber and will affect the organs digestive & metabolic systems beneficially when combined properly , include legumes. Spice Mix , digestively stimulating and will affect the organs digestive system positively in moderation , use fresh spices. Tamarind , digestive aid and will affect the organs digestive system beneficially for many , use natural tamarind. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic use , choose preservative-free options.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Parle Monaco Maska (Butter)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Edible Vegetable Oil', 'Salt', 'Butter Powder', 'Leavening Agent', 'Sugar'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-grain alternatives. Edible Vegetable Oil , added fat and will affect the organs heart depending on type , choose unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Butter Powder , dairy fat and lactose and will affect the organs heart & digestive system in high-fat contexts , prefer low-fat alternatives. Leavening Agent , may cause gas and will affect the organs digestive system , use natural leavening. Sugar , added sugar and will affect the organs pancreas & teeth , minimize sugar.",
    severityCounts: { low: 3, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','pancreas','teeth']
  },
  {
    name: 'Tropicana Real Peach',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Peach Juice', 'Sugar', 'Water', 'Preservatives', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Peach Juice , provides vitamins but concentrated sugar and will affect the organs pancreas & teeth if overconsumed , prefer whole fruit. Sugar , added sugar and will affect the organs pancreas & teeth , choose no-added-sugar variants. Water , hydration and will affect the organs overall positively , maintain intake. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , opt for fresh juice. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , prefer natural flavors.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['pancreas','teeth','digestive system','liver']
  },
  {
    name: 'Bingo Tedhe Medhe (Tangy Tomato)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Maize Corn', 'Vegetable Oil', 'Tomato Powder', 'Salt', 'Flavour', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Maize Corn , processed grain and will affect the organs metabolic system , prefer whole-corn snacks. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , choose healthier oils. Tomato Powder , processed flavor and will affect the organs digestive system mildly , use real tomatoes when possible. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Flavour , additives may trigger sensitivities and will affect the organs digestive or immune systems in sensitive people , choose natural seasonings. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic intake , pick preservative-free options.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Nestle Everyday (Milk Powder)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Vegetable Oils', 'Lactose', 'Stabilizers', 'Vitamins'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in full-fat forms , choose toned/low-fat milk powder if needed. Vegetable Oils , added fats and will affect the organs heart depending on type , prefer unsaturated oils. Lactose , milk sugar and will affect the organs digestive system in lactose-intolerant individuals , use lactose-free milk powder if required. Stabilizers , processing aids and will affect the organs digestive system minimally in sensitive people , choose simpler formulations. Vitamins , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','metabolic system']
  },
  {
    name: 'Patanjali Dant Kanti (Herbal Toothpaste)',
    category: 'personal care',
    ingredients: ingredients.filter(i =>
      ['Herbal Extracts', 'Fluoride', 'Abrasives', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Herbal Extracts , may support oral health and will affect the organs teeth beneficially for many users , patch-test for allergies. Fluoride , prevents dental caries and will affect the organs teeth beneficially when used in correct amounts , avoid ingestion. Abrasives , clean teeth but may erode enamel if overused and will affect the organs teeth & enamel , use low-abrasivity formulas. Flavor , additives may cause sensitivities and will affect the organs oral mucosa or immune systems in some people , choose mild flavors.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['teeth','oral mucosa']
  },
  {
    name: 'Dabur Amla Hair Oil (Large)',
    category: 'personal care',
    ingredients: ingredients.filter(i =>
      ['Amla Extract', 'Carrier Oil (Coconut)', 'Fragrance', 'Antioxidants'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Amla Extract , antioxidant & hair-health ingredient and will affect the organs scalp/skin beneficially in many users , use regularly as topical. Carrier Oil (Coconut) , conditions hair but high saturated fat topically and will affect the organs scalp/hair shaft cosmetically , choose suitable carrier oil. Fragrance , may cause skin or respiratory sensitivity and will affect the organs skin & respiratory system in sensitive people , choose fragrance-free if allergic. Antioxidants , protect oil from rancidity and will affect the organs cellular health minimally beneficially , prefer cold-pressed oils.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['scalp','hair','skin','respiratory system']
  },
  {
    name: 'Dettol Liquid Handwash (Lemon)',
    category: 'personal care',
    ingredients: ingredients.filter(i =>
      ['Surfactants', 'Antimicrobial Agent', 'Fragrance', 'Moisturizer'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Surfactants , cleanse hands but may dry skin and will affect the organs skin if used frequently , use gentle formulations. Antimicrobial Agent , reduces microbes and will affect the organs skin microbiome beneficially for hygiene but avoid overuse that may disrupt flora. Fragrance , may trigger skin/respiratory sensitivity and will affect the organs skin & respiratory system in sensitive individuals , prefer fragrance-free options if allergic. Moisturizer , counters dryness and will affect the organs skin beneficially after washing , use emollient-rich formulas if hands are frequently washed.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['skin','respiratory system','immune system']
  },
  {
    name: 'Ponds Cold Cream',
    category: 'personal care',
    ingredients: ingredients.filter(i =>
      ['Emollients', 'Perfume', 'Preservatives', 'Antioxidants'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Emollients , moisturize skin and will affect the organs skin beneficially for dry skin , choose non-comedogenic options if prone to acne. Perfume , may cause skin or respiratory sensitivity and will affect the organs skin & respiratory system in sensitive people , choose fragrance-free if allergic. Preservatives , prevent microbial growth but may affect the organs skin & immune system in sensitive individuals with chronic exposure , pick safe-preservative products. Antioxidants , protect formulation and may affect cellular health minimally beneficially , prefer stable formulations.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['skin','respiratory system','immune system']
  },
  {
    name: 'Kellogg\'s Frosties',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Corn Flakes', 'Sugar', 'Malt Extract', 'Vitamins', 'Salt', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Corn Flakes , processed cereal and will affect the organs metabolic system (high glycemic index) , prefer whole-grain cereals. Sugar , high added sugar and will affect the organs pancreas & teeth , select low-sugar options. Malt Extract , flavoring and carbohydrate source and will affect the organs metabolic system if added in excess , reduce added sweeteners. Vitamins , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive individuals , choose natural flavors.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','cardiovascular system']
  },
  {
    name: 'Amul Mithai Mate (Kheer Mix)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Sugar', 'Cardamom', 'Stabilizer'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high-fat forms , use low-fat milk alternatives. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Cardamom , flavor and digestive aid and will affect the organs digestive system beneficially in moderation , prefer whole spice. Stabilizer , texture agent and will affect the organs digestive system minimally in sensitive people , use natural thickening like rice.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['heart','digestive system','pancreas','teeth']
  },
  {
    name: 'Kurkure Chatka (Masala)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Corn Meal', 'Vegetable Oil', 'Salt', 'Spices', 'Preservatives', 'Flavor Enhancers'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Corn Meal , processed carb and will affect the organs metabolic system , choose whole-grain snacks. Vegetable Oil , frying oil and will affect the organs heart depending on type & reuse , prefer unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Spices , flavor & digestive benefits and will affect the organs digestive system positively in moderation , prefer natural spices. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic intake , pick preservative-free options. Flavor Enhancers , additives that may cause sensitivities and will affect the organs nervous & digestive systems in susceptible people , choose MSG-free/clean-label seasonings.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Tata Sampann Jowar Flour',
    category: 'staples',
    ingredients: ingredients.filter(i =>
      ['Jowar (Sorghum) Flour'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Jowar (Sorghum) Flour , gluten-free cereal with fiber & nutrients and will affect the organs digestive & metabolic systems beneficially as a whole-grain alternative , use for rotis and baking.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['digestive system','metabolic system']
  },
  {
    name: 'Hershey\'s Miniature (Assorted)',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Milk Solids', 'Cocoa', 'Vegetable Oil', 'Emulsifier', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , added sugar and will affect the organs pancreas & teeth , limit intake. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high-fat forms , prefer low-fat options. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially in higher-cocoa products , choose dark chocolate. Vegetable Oil , added fat and will affect the organs heart depending on type , avoid hydrogenated oils. Emulsifier , processing aid that may affect gut microbiota and will affect the organs digestive system in sensitive people , pick minimal-additive chocolates. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in some people , prefer natural flavoring.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Parle-G (Glucose Biscuits)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Vegetable Oil', 'Milk Solids', 'Leavening Agent', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , use whole-wheat flour instead. Sugar , quick energy but raises blood glucose and will affect the organs pancreas & teeth , use minimal jaggery or fruit instead. Vegetable Oil , source of dietary fat and will affect the organs heart depending on fat profile , use unsaturated oils instead. Milk Solids , dairy fats & lactose and will affect the organs heart & digestive system in high amounts , use low-fat milk solids instead. Leavening Agent , may cause bloating in sensitive individuals and will affect the organs digestive system , use naturally leavened options instead. Salt , excess sodium and will affect the organs cardiovascular system , use limited iodised salt instead.",
    severityCounts: { low: 4, medium: 2, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system','cardiovascular system']
  },
  {
    name: 'Cadbury Dairy Milk Silk',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Milk Solids', 'Cocoa Butter', 'Cocoa Solids', 'Emulsifier', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , high added sugar and will affect the organs pancreas & teeth , choose lower-sugar or smaller portions instead. Milk Solids , saturated fats and lactose and will affect the organs heart & digestive system in high intake , use low-fat chocolate options. Cocoa Butter , fat component and will affect the organs heart depending on intake , consume in moderation. Cocoa Solids , antioxidant potential when high-percentage and will affect the organs heart & nervous system beneficially in dark chocolate , prefer higher-cocoa bars. Emulsifier , processing aid which may affect gut microbiota in sensitive people and will affect the organs digestive system , pick minimal-emulsifier products. Flavor , additives may trigger sensitivities and will affect the organs digestive or immune systems in sensitive individuals , prefer natural flavors.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['pancreas','teeth','heart','digestive system','nervous system']
  },
  {
    name: 'Sunfeast Dark Fantasy Choco Fills (Cream)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Vegetable Oil', 'Cocoa Solids', 'Cream Powder', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-wheat alternative instead. Sugar , high added sugar and will affect the organs pancreas & teeth , reduce sugar. Vegetable Oil , added fats and will affect the organs heart depending on type , avoid hydrogenated oils. Cocoa Solids , antioxidant when quality is high and will affect the organs heart & nervous system beneficially in dark cocoa , prefer higher-cocoa products. Cream Powder , dairy fat & lactose and will affect the organs heart & digestive system , use low-fat alternatives. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer fresh options.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system','liver']
  },
  {
    name: 'Amul Cheese Slice (Single)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Salt', 'Emulsifiers', 'Preservatives', 'Color', 'Flavour'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids , saturated fat & lactose and will affect the organs heart & digestive system in high intake , choose low-fat cheese. Salt , excess sodium and will affect the organs cardiovascular system , use reduced-salt options. Emulsifiers , processing aids may affect gut microbiota and will affect the organs digestive system in sensitive people , prefer minimal-emulsifier cheeses. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , pick fresh cheese when possible. Color , additives may cause sensitivity and will affect the organs skin & immune system in susceptible people , use color-free products. Flavour , artificial flavours may trigger sensitivities and will affect the organs digestive or immune systems in sensitive individuals , use natural flavors.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['heart','digestive system','cardiovascular system','liver','skin']
  },
  {
    name: 'Maggi 2-Minute Noodles (Masala)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Tastemaker (Flavour)', 'Salt', 'MSG', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , choose whole-grain noodles where possible. Vegetable Oil , frying fat that may affect the organs heart depending on fat type and reuse , prefer non-hydrogenated oils. Tastemaker (Flavour) , contains additives that may affect sensitive individuals and will affect the organs digestive or immune systems in susceptible people , use fresh spices. Salt , high sodium and will affect the organs cardiovascular system , reduce sodium. MSG , flavor enhancer that may trigger sensitivity in some and will affect the organs nervous & digestive systems in susceptible individuals , select no-MSG options if needed. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer freshly prepared meals.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','nervous system','liver']
  },
  {
    name: 'Lay\'s Classic Salted',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Potato', 'Vegetable Oil', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potato , starchy food and when fried will affect the organs metabolic system , prefer oven-baked potatoes. Vegetable Oil , frying oil and will affect the organs heart depending on fat type , avoid hydrogenated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt intake.",
    severityCounts: { low: 1, medium: 2, high: 0 },
    organsAffected: ['metabolic system','heart','cardiovascular system']
  },
  {
    name: 'Pringles BBQ',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Potato Flakes', 'Vegetable Oil', 'Flavoring', 'Salt', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potato Flakes , processed carb and will affect the organs metabolic system , use whole potatoes. Vegetable Oil , added fats and will affect the organs heart depending on type , choose unsaturated oils. Flavoring , additives may cause sensitivity and will affect the organs digestive or immune systems in susceptible people , use natural seasonings. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free snacks.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Quaker Instant Oats (Apple Cinnamon)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Oats', 'Sugar', 'Salt', 'Flavor', 'Dried Apple Pieces'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fiber supporting heart & digestion and will affect the organs heart & digestive system beneficially , use rolled/steel-cut oats where possible. Sugar , added sugar and will affect the organs pancreas & teeth , reduce or replace with fresh fruit. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Flavor , additives may cause sensitivity and will affect the organs digestive or immune systems in sensitive people , prefer natural flavoring. Dried Apple Pieces , concentrated natural sugar & fiber and will affect the organs digestive system & teeth if overused , use fresh fruit instead.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','pancreas','teeth','cardiovascular system']
  },
  {
    name: 'Brookside Dark Chocolate (Fruit & Nut)',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Cocoa Solids', 'Sugar', 'Cocoa Butter', 'Nuts', 'Dried Fruit', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Cocoa Solids , antioxidant potential and will affect the organs heart & nervous system beneficially in high-cocoa content , prefer dark chocolate. Sugar , added sugar and will affect the organs pancreas & teeth , limit intake. Cocoa Butter , fat source and will affect the organs heart depending on amount , consume moderately. Nuts , healthy fats & minerals and will affect the organs heart & metabolic system beneficially in moderation , choose unsalted nuts. Dried Fruit , concentrated sugars and will affect the organs teeth & metabolic system if overused , prefer fresh fruit. Emulsifier , processing aid that may affect gut microbiota in sensitive individuals and will affect the organs digestive system , choose minimal-emulsifier products.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['heart','nervous system','pancreas','teeth','metabolic system']
  },
  {
    name: 'Amul Butter (Salted)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Cream', 'Salt', 'Preservatives', 'Color'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Cream , concentrated saturated fat and will affect the organs heart when consumed in excess , use spreadable light butter or plant-based spreads. Salt , excess sodium and will affect the organs cardiovascular system , limit added salt. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , choose fresh butter. Color , additives may cause sensitivity and will affect the organs skin & immune system in susceptible people , use color-free butter if preferred.",
    severityCounts: { low: 1, medium: 2, high: 0 },
    organsAffected: ['heart','cardiovascular system','liver','skin']
  },
  {
    name: 'Nutrela Soya Chunks',
    category: 'protein',
    ingredients: ingredients.filter(i =>
      ['Textured Soya Protein (Soy),', 'Flavor (if any)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Textured Soya Protein , high plant-protein and will affect the organs metabolic & muscular systems beneficially as a vegetarian protein source , use as part of balanced diet. Flavor (if any) , additives may cause sensitivity and will affect the organs digestive or immune systems in sensitive individuals , prefer plain soya chunks.",
    severityCounts: { low: 2, medium: 0, high: 0 },
    organsAffected: ['metabolic system','muscular system','digestive system']
  },
  {
    name: 'Cadbury 5 Star',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Glucose Syrup', 'Milk Solids', 'Vegetable Oil', 'Cocoa Solids', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , high added sugar and will affect the organs pancreas & teeth , reduce portions. Glucose Syrup , high glycemic sweetener and will affect the organs metabolic system & pancreas , use natural sweeteners or less-sweet options. Milk Solids , saturated fat & lactose and will affect the organs heart & digestive system , choose low-fat chocolate. Vegetable Oil , added fats and will affect the organs heart depending on type , avoid hydrogenated oils. Cocoa Solids , antioxidant benefits when cocoa content is significant and will affect the organs heart & nervous system beneficially in higher-cocoa products , prefer dark chocolate. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , pick minimal-additive products.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['pancreas','teeth','metabolic system','heart','digestive system']
  },
  {
    name: 'Tropicana 100% Mixed Fruit Juice',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Mixed Fruit Juice', 'No Added Sugar', 'Vitamin C'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Mixed Fruit Juice , nutrient-rich but concentrated sugar and will affect the organs pancreas & teeth if overconsumed , prefer whole fruits. No Added Sugar , lowers added-sugar risk and will affect the organs pancreas & teeth beneficially compared to sugared drinks , choose 100% fruit juice without sugar. Vitamin C , antioxidant & immune support and will affect the organs immune system beneficially , keep balanced intake.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['pancreas','teeth','immune system']
  },
  {
    name: 'Hershey\'s Kisses',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Cocoa', 'Milk Solids', 'Emulsifier', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , added sugar and will affect the organs pancreas & teeth , limit intake. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially when cocoa % is higher , choose dark variants. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in large amounts , use low-fat chocolate options. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , prefer minimal-emulsifier products. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in susceptible individuals , prefer natural flavors.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Knorr Veg Soup (Instant)',
    category: 'ready meals',
    ingredients: ingredients.filter(i =>
      ['Dehydrated Vegetables', 'Salt', 'Starch', 'Flavor', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Dehydrated Vegetables , convenient nutrient source but processed and will affect the organs digestive system moderately , prefer fresh vegetables. Salt , excess sodium and will affect the organs cardiovascular system , opt for low-sodium options. Starch , thickener and may affect glycemic load if refined and will affect the organs metabolic system , choose whole-food thickeners. Flavor , additives may cause sensitivity and will affect the organs digestive or immune systems in sensitive people , prefer natural seasoning. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic use , choose fresh soups when possible.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['digestive system','cardiovascular system','metabolic system','liver']
  },
  {
    name: 'Peanut Butter (Natural, No Sugar)',
    category: 'spreads',
    ingredients: ingredients.filter(i =>
      ['Roasted Peanuts', 'Salt', 'Oil (if added)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Roasted Peanuts , rich in protein & healthy fats and will affect the organs heart & metabolic system beneficially in moderation , use 100% peanuts. Salt , excess sodium and will affect the organs cardiovascular system , choose low-salt varieties. Oil (if added) , added fats and will affect the organs heart depending on fat type , use no-added-oil peanut butter where possible.",
    severityCounts: { low: 2, medium: 0, high: 0 },
    organsAffected: ['heart','metabolic system','cardiovascular system']
  },
  {
    name: 'Knorr Veg Stock (Powder)',
    category: 'seasoning',
    ingredients: ingredients.filter(i =>
      ['Salt', 'Vegetable Fat', 'Flavor Enhancers', 'Preservatives', 'Anti-caking Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Salt , high sodium and will affect the organs cardiovascular system , use reduced-salt stocks. Vegetable Fat , may include saturated/trans fats and will affect the organs heart depending on type , choose stocks with healthier fat profile. Flavor Enhancers , additives such as MSG may cause sensitivity in some and will affect the organs nervous & digestive systems in susceptible people , use natural stock. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , prefer homemade stock. Anti-caking Agent , inert additive and will affect the organs digestive system minimally in some people , use natural alternatives if possible.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['cardiovascular system','heart','nervous system','digestive system','liver']
  },
  {
    name: 'Amul Kool (Chocolate)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Sugar', 'Cocoa', 'Flavor', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy fats & lactose and will affect the organs heart & digestive system in full-fat forms , choose toned/low-fat milk. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Cocoa , antioxidant properties in higher-quality cocoa and will affect the organs heart & nervous system beneficially when less processed , prefer better cocoa. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , use natural flavor. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , opt for preservative-free beverages.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','pancreas','teeth','liver']
  },
  {
    name: 'MTR Chana Masala Mix',
    category: 'seasoning',
    ingredients: ingredients.filter(i =>
      ['Chickpea (Chana) Masala Blend', 'Salt', 'Anti-caking Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Chickpea Masala Blend , spice mix that supports digestion and will affect the organs digestive system beneficially in moderation , use fresh spices. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Anti-caking Agent , additive with low immediate risk and will affect the organs digestive system minimally in some people , choose natural mixes.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['digestive system','cardiovascular system']
  },
  {
    name: 'Amul Taaza Milk (Toned)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Stabilizer', 'Vitamins'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , source of protein & calcium but contains some saturated fat and lactose and will affect the organs heart & digestive system in high-fat variants , choose toned milk if concerned. Stabilizer , maintains texture and will affect the organs digestive system minimally in some people , pick simpler formulations. Vitamins , fortification beneficial and will affect the organs overall nutrition positively when deficient , keep balanced diet.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['heart','digestive system','skeletal system']
  },
  {
    name: 'Knorr Instant Noodles Cup (Veg)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Tastemaker', 'Salt', 'Preservative', 'Anti-caking Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , prefer whole-grain alternatives. Vegetable Oil , frying fat that may affect the organs heart depending on type and reuse , choose healthier oils. Tastemaker , flavor additives may cause sensitivities and will affect the organs digestive or immune systems in some people , prefer fresh seasoning. Salt , high sodium and will affect the organs cardiovascular system , limit salt. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free meals. Anti-caking Agent , inert additive and will affect the organs digestive system minimally in sensitive people , use natural blends.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Bournvita Chocolate Drink Mix',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Malted Barley', 'Sugar', 'Milk Solids', 'Vitamins & Minerals', 'Flavor', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Malted Barley , carbohydrate source and will affect the organs metabolic system depending on portion , use in moderation. Sugar , added sugar and will affect the organs pancreas & teeth , prefer reduced-sugar options. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high-fat variants , choose low-fat milk. Vitamins & Minerals , fortification beneficial and will affect the organs nutrient status positively when deficient , maintain balanced intake. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in some people , use natural flavoring. Emulsifier , processing aid that may affect gut microbiota in sensitive individuals and will affect the organs digestive system , seek minimal-emulsifier formulas.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Kellogg\'s Special K (Red Berries)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Rice & Wheat Flakes', 'Sugar', 'Dried Berries', 'Vitamins', 'Minerals', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Rice & Wheat Flakes , processed cereals and will affect the organs metabolic system depending on refinement , choose whole-grain flakes. Sugar , added sugar and will affect the organs pancreas & teeth , pick low-sugar versions. Dried Berries , concentrated natural sugars & fiber and will affect the organs digestive system & teeth if overused , prefer fresh fruit. Vitamins & Minerals , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in some people , prefer natural flavors.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','digestive system']
  },
  {
    name: 'Tata Tea Premium (Assam)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Black Tea Leaves (Assam)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Black Tea Leaves (Assam) , caffeinated antioxidant beverage and will affect the organs nervous & cardiovascular systems depending on intake , use in moderation or select decaf/herbal teas if sensitive.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['nervous system','cardiovascular system']
  },
  {
    name: 'Nescafe Classic',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Coffee Solids', 'Anti-caking Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Coffee Solids , stimulant and will affect the organs nervous & cardiovascular systems in sensitive individuals , limit intake. Anti-caking Agent , low immediate risk but may affect the organs digestive system minimally in some people , prefer pure ground coffee if you want no additives.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['nervous system','cardiovascular system','digestive system']
  },
  {
    name: 'Colgate MaxFresh Toothpaste',
    category: 'personal care',
    ingredients: ingredients.filter(i =>
      ['Fluoride', 'Abrasives', 'Sodium Lauryl Sulfate', 'Flavor', 'Cooling Agents'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Fluoride , prevents dental caries and will affect the organs teeth beneficially when used correctly , avoid excess ingestion. Abrasives , clean teeth but may erode enamel if overused and will affect the organs teeth & enamel , use low-abrasivity formulas. Sodium Lauryl Sulfate , foaming agent that may irritate oral mucosa in some and will affect the organs oral mucosa , choose SLS-free if sensitive. Flavor , additives may cause sensitivities and will affect the organs oral mucosa or immune system in susceptible people , choose mild flavors. Cooling Agents , sensory additives that may irritate sensitive oral mucosa and will affect the organs oral mucosa in some users , select gentle formulations if needed.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['teeth','oral mucosa','immune system']
  },
  {
    name: 'Dabur Honitus (Kids)',
    category: 'healthcare',
    ingredients: ingredients.filter(i =>
      ['Herbal Extracts', 'Honey', 'Glycerin', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Herbal Extracts , traditional relief and will affect the organs respiratory & immune systems beneficially for some , consult a doctor for chronic symptoms. Honey , demulcent but high in sugar and will affect the organs teeth & pancreas , limit for children and avoid for infants. Glycerin , soothing humectant and will affect the organs throat/skin beneficially when used properly , follow dosing guidelines. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive children , choose mild natural flavors.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['respiratory system','immune system','teeth','pancreas']
  },
  {
    name: 'Parachute Advansed Hair Oil',
    category: 'personal care',
    ingredients: ingredients.filter(i =>
      ['Coconut Oil', 'Vitamin E', 'Fragrance', 'Antioxidants'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Coconut Oil , topical conditioning oil and will affect the organs hair shaft & scalp cosmetically , use suitable oils for hair type. Vitamin E , antioxidant added for hair health and will affect the organs scalp/skin beneficially in many users , apply as directed. Fragrance , may cause skin/respiratory sensitization and will affect the organs skin & respiratory system in sensitive people , prefer fragrance-free if allergic. Antioxidants , preserve oil quality and may affect the organs cellular health minimally beneficially , prefer cold-pressed oils.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['hair','scalp','skin','respiratory system']
  },
  {
    name: 'Patanjali Dant Kanti Kids',
    category: 'personal care',
    ingredients: ingredients.filter(i =>
      ['Herbal Extracts', 'Fluoride (if present)', 'Abrasives', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Herbal Extracts , natural additives that may support oral hygiene and will affect the organs teeth beneficially for many users , patch-test for allergies. Fluoride (if present) , prevents caries and will affect the organs teeth beneficially when used correctly , avoid swallowing. Abrasives , help remove plaque but may erode enamel if too abrasive and will affect the organs teeth & enamel , choose gentle formulations. Flavor , additives may cause sensitivities and will affect the organs oral mucosa or immune systems in some children , use mild flavors.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['teeth','oral mucosa']
  },
  {
    name: 'Lifebuoy Handwash (Total)',
    category: 'personal care',
    ingredients: ingredients.filter(i =>
      ['Surfactants', 'Antimicrobial Agent', 'Fragrance', 'Moisturizer'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Surfactants , cleanse hands but may dry skin with frequent use and will affect the organs skin , use gentle formulas. Antimicrobial Agent , reduces microbes and will affect the organs skin microbiome beneficially for hygiene but avoid overuse that may disrupt flora. Fragrance , may trigger skin/respiratory sensitivity and will affect the organs skin & respiratory system in susceptible people , choose fragrance-free if allergic. Moisturizer , counters dryness and will affect the organs skin beneficially after washing , use emollient-rich handwashes for frequent use.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['skin','respiratory system','immune system']
  },
  {
    name: 'Dettol Antiseptic Liquid',
    category: 'household/healthcare',
    ingredients: ingredients.filter(i =>
      ['Chloroxylenol', 'Solvent', 'Fragrance', 'Stabilizer'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Chloroxylenol , antiseptic effective against microbes and will affect the organs skin & wound microbial load beneficially when used correctly , avoid ingestion. Solvent , carrier for antiseptic and may irritate skin/respiratory tract in misuse and will affect the organs skin & respiratory system , use with care. Fragrance , may cause sensitivity and will affect the organs skin & respiratory system in some individuals , choose fragrance-free where possible. Stabilizer , maintains formulation and will affect the organs minimally in most users , follow label instructions.",
    severityCounts: { low: 1, medium: 2, high: 0 },
    organsAffected: ['skin','respiratory system']
  },
  {
    name: 'Surf Excel Liquid (Matic Front Load)',
    category: 'household',
    ingredients: ingredients.filter(i =>
      ['Surfactants', 'Enzymes', 'Fragrance', 'Stabilizers', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Surfactants , remove stains but may irritate skin and will affect the organs skin if direct exposure occurs , wear gloves. Enzymes , improve cleaning performance and may cause allergy in sensitive people and will affect the organs respiratory system if inhaled in powder forms , follow label instructions. Fragrance , may cause allergies and will affect the organs respiratory & skin systems in susceptible individuals , use fragrance-free variants if allergic. Stabilizers , maintain product and will affect the organs minimally in most people , follow directions. Preservatives , prevent microbial growth and will affect the organs skin & immune system in sensitive individuals with chronic exposure , use as instructed.",
    severityCounts: { low: 1, medium: 2, high: 0 },
    organsAffected: ['skin','respiratory system','immune system']
  },
  {
    name: 'MTR Navratan Korma (Ready-To-Eat)',
    category: 'ready meals',
    ingredients: ingredients.filter(i =>
      ['Mixed Vegetables', 'Cream', 'Oil', 'Spices', 'Salt', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Mixed Vegetables , micronutrient-rich and will affect the organs immune & digestive systems beneficially , prefer fresh veg. Cream , saturated fat & dairy and will affect the organs heart & digestive system in high amounts , use low-fat alternatives. Oil , cooking fat and will affect the organs heart depending on fat type , choose unsaturated oils. Spices , digestive and flavor benefits and will affect the organs digestive system positively in moderation , use fresh spices. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic intake , choose fresh-cooked meals when possible.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['immune system','digestive system','heart','cardiovascular system','liver']
  },
  {
    name: 'Bikano Soan Papdi (Festive)',
    category: 'sweets',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Refined Wheat Flour', 'Ghee', 'Almonds', 'Cardamom', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , very high sugar and will affect the organs pancreas & teeth , limit intake. Refined Wheat Flour , refined carb and will affect the organs metabolic system , prefer whole-grain alternatives. Ghee , saturated fat and will affect the organs heart when consumed frequently , use sparingly. Almonds , healthy fats & minerals and will affect the organs heart & metabolic system beneficially in moderation , choose unsalted nuts. Cardamom , digestive aid and will affect the organs digestive system positively in moderation , use fresh cardamom. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , choose freshly made sweets where possible.",
    severityCounts: { low: 2, medium: 3, high: 1 },
    organsAffected: ['pancreas','teeth','metabolic system','heart','digestive system','liver']
  },
  {
    name: 'Tata Sampann Masala Tea (Blend)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Black Tea Leaves', 'Cardamom', 'Cinnamon', 'Clove', 'Ginger'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Black Tea Leaves , caffeine & antioxidants and will affect the organs nervous & cardiovascular systems depending on intake , use moderation. Cardamom , digestive benefits and will affect the organs digestive system positively , prefer whole cardamom. Cinnamon , may help glycemic control and will affect the organs metabolic & cardiovascular systems beneficially in moderation , choose Ceylon cinnamon. Clove , antimicrobial and will affect the organs oral & digestive systems beneficially in small amounts , use fresh cloves. Ginger , digestive aid and will affect the organs digestive & immune systems beneficially , use fresh ginger.",
    severityCounts: { low: 4, medium: 0, high: 0 },
    organsAffected: ['nervous system','cardiovascular system','digestive system','immune system','metabolic system']
  },
  {
    name: 'Britannia Tiger (Cream Filled)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Vegetable Oil', 'Cream Powder', 'Emulsifier', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , prefer whole-grain alternatives. Sugar , raises blood glucose and will affect the organs pancreas & teeth , reduce sugar. Vegetable Oil , added fats and will affect the organs heart depending on type , avoid hydrogenated oils. Cream Powder , dairy fats and will affect the organs heart & digestive system in high amounts , choose low-fat options. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , choose minimal-emulsifier variants. Salt , excess sodium and will affect the organs cardiovascular system , limit salt.",
    severityCounts: { low: 3, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system','cardiovascular system']
  },
  {
    name: 'Tropicana 100% Apple (No Sugar)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['100% Apple Juice', 'Vitamin C (Fortified)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "100% Apple Juice , natural vitamins but concentrated sugar and will affect the organs pancreas & teeth if overconsumed , prefer whole fruit. Vitamin C (Fortified) , supports immune function and will affect the organs immune system beneficially where deficient , maintain balanced diet.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['pancreas','teeth','immune system']
  },
  {
    name: 'Amul Kool (Mango Light)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Reduced Sugar', 'Mango Pulp', 'Flavor', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy fats & lactose that will affect the organs heart & digestive system in full-fat forms , choose toned milk. Reduced Sugar , lower glycemic load and will affect the organs pancreas & teeth beneficially compared to full-sugar options , prefer reduced-sugar variants. Mango Pulp , fruit nutrients but concentrated sugar and will affect the organs pancreas & teeth if overconsumed , prefer whole fruit. Flavor , additives may cause sensitivity and will affect the organs digestive or immune systems in susceptible people , use natural flavor. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , choose fresh drinks when possible.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','pancreas','teeth','liver']
  },
  {
    name: 'Knorr Pasta (Veg)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Durum Wheat Semolina', 'Dehydrated Vegetables', 'Salt', 'Starch', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Durum Wheat Semolina , refined cereal and will affect the organs metabolic system depending on portion and processing , prefer whole-wheat pasta. Dehydrated Vegetables , convenient nutrients but processed and will affect the organs digestive system moderately , use fresh vegetables. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Starch , thickener and may affect the organs metabolic system if highly refined , choose whole-food thickeners. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free options.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['metabolic system','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Bingo Mad Angles (Cream & Onion)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Spice Mix', 'Salt', 'Flavorings', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-grain alternatives. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , prefer healthier oils. Spice Mix , flavor & digestive benefits and will affect the organs digestive system positively in moderation , prefer natural spices. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Flavorings , additives may trigger sensitivities and will affect the organs digestive or immune systems in sensitive people , use natural seasonings. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic intake , choose preservative-free snacks.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Maggi Noodles (Masala - Oats Variant)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Oats (Atta Blend)', 'Vegetable Oil', 'Tastemaker', 'Salt', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fiber that supports heart & digestion and will affect the organs heart & digestive system beneficially compared to refined flour , prefer whole oats. Vegetable Oil , frying fat and will affect the organs heart depending on type , choose unsaturated oils. Tastemaker , additives may cause sensitivities and will affect the organs digestive or immune systems in susceptible people , use fresh seasoning. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free options.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Haldiram\'s Navrattan Mix',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Lentils', 'Peanuts', 'Spices', 'Vegetable Oil', 'Salt', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Lentils , plant protein & fiber and will affect the organs digestive & metabolic systems beneficially , include as protein source. Peanuts , healthy fats & protein and will affect the organs heart & metabolic system beneficially in moderation , prefer roasted unsalted nuts. Spices , digestive stimulation and will affect the organs digestive system positively in moderation , use natural spices. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , choose healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic use , pick preservative-free snack mixes.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['digestive system','metabolic system','heart','cardiovascular system','liver']
  },
  {
    name: 'Tata Sampann Poha (Small Pack)',
    category: 'staples',
    ingredients: ingredients.filter(i =>
      ['Flattened Rice (Poha)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Flattened Rice (Poha) , light carbohydrate and will affect the organs metabolic system depending on portion and preparation , combine with vegetables and protein for balanced meals.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['metabolic system','digestive system']
  },
  {
    name: 'Amul Cheese Block (Regular)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Salt', 'Culture', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , source of saturated fat & lactose and will affect the organs heart & digestive system in high-fat forms , choose low-fat cheese where appropriate. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Culture , fermentation aids digestibility and will affect the organs digestive system beneficially in cultured cheeses. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , prefer fresh cheese.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Britannia Marie Gold',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Vegetable Oil', 'Milk Solids', 'Salt', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , use whole-wheat flour instead. Sugar , raises blood glucose and will affect the organs pancreas & teeth , use less sugar or natural sweeteners instead. Vegetable Oil , fat source and will affect the organs heart depending on type , use unsaturated oils instead. Milk Solids , saturated fat & lactose and will affect the organs heart & digestive system , use low-fat dairy instead. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Leavening Agent , may cause gas and will affect the organs digestive system , choose natural leavening when possible.",
    severityCounts: { low: 4, medium: 2, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system','cardiovascular system']
  },
  {
    name: 'Parle Hide & Seek (Vanilla)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Vegetable Oil', 'Vanilla Flavor', 'Milk Solids', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-grain flour instead. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Vegetable Oil , fat source and will affect the organs heart depending on type , prefer unsaturated oils. Vanilla Flavor , synthetic additive may cause sensitivities and will affect the organs digestive/immune systems in sensitive people , use natural vanilla instead. Milk Solids , saturated fat & lactose and will affect the organs heart & digestive system , pick low-fat dairy. Leavening Agent , may cause bloating and will affect the organs digestive system , use natural leavening.",
    severityCounts: { low: 3, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system','immune system']
  },
  {
    name: 'Sunfeast Mom\'s Magic',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Butter', 'Milk Solids', 'Eggs', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-wheat alternatives. Sugar , high sugar and will affect the organs pancreas & teeth , reduce sugar. Butter , saturated fat and will affect the organs heart when frequent , use light spreads. Milk Solids , saturated fat & lactose and will affect the organs heart & digestive system , use low-fat options. Eggs , protein source and will affect the organs muscular & metabolic systems beneficially for many , use pasteurized eggs when required. Leavening Agent , may cause gas and will affect the organs digestive system , prefer natural fermentation.",
    severityCounts: { low: 3, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system','muscular system']
  },
  {
    name: 'Tata Salt (Regular)',
    category: 'staples',
    ingredients: ingredients.filter(i =>
      ['Salt', 'Iodine'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Salt , essential electrolyte but excess affects blood pressure and will affect the organs cardiovascular system , use in moderation. Iodine , essential for thyroid and will affect the organs endocrine system beneficially when present , use iodised salt where deficiency risk exists.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['cardiovascular system','endocrine system']
  },
  {
    name: 'Amul Milk Powder (Full Cream)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Vegetable Oil', 'Stabilizers', 'Vitamins'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids , saturated fat & lactose and will affect the organs heart & digestive system in high-fat forms , use toned/skim milk powder if needed. Vegetable Oil , added fats and will affect the organs heart depending on type , prefer unsaturated oils. Stabilizers , processing aids and will affect the organs digestive system minimally in some people , choose simpler formulations if sensitive. Vitamins , fortification beneficial and will affect the organs overall nutrition positively where deficient , maintain balanced diet.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','metabolic system']
  },
  {
    name: 'McCain Potato Wedges',
    category: 'frozen foods',
    ingredients: ingredients.filter(i =>
      ['Potatoes', 'Vegetable Oil', 'Salt', 'Preservatives', 'Antioxidant'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potatoes , starchy vegetable and will affect the organs metabolic system depending on portion & cooking method , prefer oven-baked. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , use high-oleic oils and avoid repeated reuse. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , choose preservative-free frozen products. Antioxidant , prevents oxidation and will affect the organs cellular health beneficially in small amounts , prefer minimal additives.",
    severityCounts: { low: 2, medium: 2, high: 1 },
    organsAffected: ['metabolic system','heart','cardiovascular system','liver']
  },
  {
    name: 'Knorr Instant Soup (Mushroom)',
    category: 'ready meals',
    ingredients: ingredients.filter(i =>
      ['Mushroom Powder', 'Milk Solids', 'Starch', 'Salt', 'Preservatives', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Mushroom Powder , umami & nutrients and will affect the organs immune & digestive systems beneficially in moderation , use fresh mushrooms where possible. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high-fat forms , prefer low-fat. Starch , thickener and may affect glycemic load if refined and will affect the organs metabolic system , prefer whole-food thickeners. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic intake , choose fresh soups. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , opt for natural seasoning.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['immune system','digestive system','heart','cardiovascular system','liver']
  },
  {
    name: 'Bingo Mad Angles (Chilli)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Salt', 'Chilli Powder', 'Spice Mix', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-grain base instead. Vegetable Oil , frying fat and will affect the organs heart depending on type , prefer healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Chilli Powder , spicy and may irritate digestive tracts in some and will affect the organs digestive system , use milder seasoning. Spice Mix , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , prefer real spices. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free snacks.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Kissan Mixed Fruit Jam',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Fruit Pulp', 'Sugar', 'Pectin', 'Acidity Regulator', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Fruit Pulp , natural fruit nutrients and will affect the organs digestive & immune systems beneficially , prefer fresh fruit. Sugar , added sugar and will affect the organs pancreas & teeth , reduce added sugar. Pectin , gelling agent helpful for digestion and will affect the organs digestive system positively , use natural pectin. Acidity Regulator , stabilizes pH and may irritate sensitive digestive tracts and will affect the organs digestive system in some people , use natural acidulants like lemon. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic use , choose preservative-free preserves.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['digestive system','immune system','pancreas','teeth','liver']
  },
  {
    name: 'Nestle Cerelac (Wheat)',
    category: 'baby foods',
    ingredients: ingredients.filter(i =>
      ['Wheat Flour', 'Milk Solids', 'Sugar', 'Vitamins & Minerals', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Wheat Flour , cereal base and will affect the organs metabolic system depending on processing , prefer whole-grain versions. Milk Solids , dairy nutrients but contain lactose and saturated fat and will affect the organs digestive & heart systems in some contexts , use age-appropriate formulas. Sugar , added sugar and will affect the organs pancreas & teeth if present , minimize added sugar for infants. Vitamins & Minerals , fortification beneficial for growth and will affect the organs overall development positively where deficient , follow pediatric guidance. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive infants , choose minimal-flavor options.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['metabolic system','digestive system','pancreas','teeth','developmental system']
  },
  {
    name: 'Tata Tea Premium (Ctc)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Black Tea Leaves', 'Natural Flavors'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Black Tea Leaves , source of caffeine & antioxidants and will affect the organs nervous & cardiovascular systems depending on intake , use decaf/herbal alternatives if sensitive. Natural Flavors , additives may cause sensitivities and will affect the organs digestive or immune systems in susceptible people , prefer plain tea leaves.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['nervous system','cardiovascular system','immune system']
  },
  {
    name: 'Patanjali Honey (Organic)',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Honey'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Honey , natural sweetener but still sugar and will affect the organs teeth & pancreas if overused , use minimal honey and avoid for infants under 1 year.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['teeth','pancreas']
  },
  {
    name: 'Amul Dark Chocolate (Bite-sized)',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Cocoa Solids', 'Cocoa Butter', 'Sugar', 'Emulsifier', 'Vanilla'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Cocoa Solids , antioxidant potential and will affect the organs heart & nervous system beneficially when cocoa % is high , prefer high-cocoa dark chocolate. Cocoa Butter , fat component and will affect the organs heart depending on total intake , consume in moderation. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , choose low-additive options. Vanilla , flavoring and will affect the organs digestive/immune system minimally , prefer natural vanilla.",
    severityCounts: { low: 3, medium: 1, high: 0 },
    organsAffected: ['heart','nervous system','pancreas','teeth','digestive system']
  },
  {
    name: 'Horlicks Classic (Malt)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Malted Barley', 'Wheat Flour', 'Sugar', 'Milk Solids', 'Vitamins & Minerals'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Malted Barley , carbohydrate source and will affect the organs metabolic system depending on portion , use in moderation. Wheat Flour , carbs that will affect the organs metabolic system depending on refinement , prefer whole grains. Sugar , added sugar and will affect the organs pancreas & teeth , choose reduced-sugar alternatives. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high-fat forms , use toned milk. Vitamins & Minerals , fortification beneficial and will affect the organs overall nutrition positively where deficient , follow dietary guidance.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Bingo Yumitos (Tomato)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Corn Meal', 'Vegetable Oil', 'Tomato Powder', 'Salt', 'Flavoring', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Corn Meal , processed grain and will affect the organs metabolic system , use whole-grain snacks. Vegetable Oil , frying fat and will affect the organs heart depending on type , prefer unsaturated oils. Tomato Powder , processed flavor and will affect the organs digestive system mildly , use fresh tomatoes when possible. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Flavoring , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , choose natural seasonings. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic use , pick preservative-free options.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Kellogg\'s Corn Flakes (Sugar Free)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Corn Flakes', 'Salt', 'Vitamins & Minerals'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Corn Flakes , processed cereal and will affect the organs metabolic system (higher glycemic index) , prefer whole-grain cereals. Salt , excess sodium and will affect the organs cardiovascular system , limit added salt. Vitamins & Minerals , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet.",
    severityCounts: { low: 2, medium: 0, high: 0 },
    organsAffected: ['metabolic system','cardiovascular system','nutritional status']
  },
  {
    name: 'Nutella (Hazelnut Spread)',
    category: 'spreads',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Hazelnuts', 'Vegetable Oil', 'Cocoa', 'Skimmed Milk Powder', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , very high added sugar and will affect the organs pancreas & teeth , reduce portions. Hazelnuts , healthy fats & minerals and will affect the organs heart & metabolic system beneficially in moderation , prefer more nuts less sugar. Vegetable Oil , added fat and will affect the organs heart depending on type , use spreads with better fat profiles. Cocoa , antioxidant potential in higher-quality cocoa and will affect the organs heart & nervous system beneficially when cocoa % is higher , choose dark cocoa spreads. Skimmed Milk Powder , dairy protein with lower fat and will affect the organs digestive system beneficially in some contexts , choose lower-fat dairy if needed. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , prefer low-additive spreads.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['pancreas','teeth','heart','digestive system','nervous system']
  },
  {
    name: 'Amul Taaza (Full Cream)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Stabilizer', 'Vitamins'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , full-cream dairy with saturated fat and lactose and will affect the organs heart & digestive system when consumed in high amounts , use toned/skim milk if needed. Stabilizer , processing aid and will affect the organs digestive system minimally in sensitive people , choose simple formulations. Vitamins , fortification beneficial and will affect the organs overall nutrition positively where deficient , maintain balanced diet.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['heart','digestive system','nutritional status']
  },
  {
    name: 'Maggi Masala Noodles (Cup)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Tastemaker', 'Salt', 'MSG', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , choose whole-grain variants. Vegetable Oil , frying oil and will affect the organs heart depending on type & reuse , prefer healthier oils. Tastemaker , additives may affect sensitive individuals and will affect the organs digestive or immune systems in susceptible people , use fresh seasonings. Salt , excess sodium and will affect the organs cardiovascular system , decrease salt. MSG , flavor enhancer that may trigger sensitivity in some and will affect the organs nervous & digestive systems in sensitive individuals , opt for MSG-free options if needed. Preservative , prolongs shelf life and will affect the organs liver & digestive system with chronic use , prefer freshly prepared meals.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','nervous system','liver']
  },
  {
    name: 'Tropicana Orange (No Sugar Added)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['100% Orange Juice', 'Vitamin C (Fortified)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "100% Orange Juice , natural vitamin C & flavonoids but concentrated sugar and will affect the organs pancreas & teeth if overconsumed , prefer whole fruit. Vitamin C (Fortified) , antioxidant & immune support and will affect the organs immune system beneficially where deficient , maintain balanced intake.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['pancreas','teeth','immune system']
  },
  {
    name: 'Haldiram\'s Bhujia (Spicy)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Gram Flour', 'Potato', 'Vegetable Oil', 'Salt', 'Spices', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Gram Flour , protein-rich legume flour and will affect the organs digestive & metabolic systems beneficially , include as protein source. Potato , starchy ingredient and when fried will affect the organs metabolic system , prefer baked variants. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , prefer healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Spices , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , use natural spices. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic intake , pick preservative-free options.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['digestive system','metabolic system','heart','cardiovascular system','liver']
  },
  {
    name: 'Lays Magic Masala (Small)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Potato', 'Vegetable Oil', 'Salt', 'Spice Mix', 'Flavorings'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potato , starchy and when fried will affect the organs metabolic system , prefer baked options. Vegetable Oil , frying oil and will affect the organs heart depending on type , avoid hydrogenated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit intake. Spice Mix , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , prefer real spices. Flavorings , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , choose natural seasonings.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system']
  },
  {
    name: 'Cadbury Eclairs',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Glucose Syrup', 'Milk Solids', 'Vegetable Oil', 'Flavor', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , high added sugar and will affect the organs pancreas & teeth , reduce portions. Glucose Syrup , high glycemic sweetener and will affect the organs metabolic system & pancreas , prefer natural sweeteners. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system , choose low-fat options. Vegetable Oil , added fats and will affect the organs heart depending on type , avoid hydrogenated oils. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive individuals , use natural flavors. Emulsifier , processing aid that may affect gut microbiota in susceptible people and will affect the organs digestive system , pick minimal-additive options.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['pancreas','teeth','metabolic system','heart','digestive system']
  },
  {
    name: 'Amul Cheese Spread (Tubes)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Edible Vegetable Oil', 'Salt', 'Emulsifiers', 'Preservatives', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system , use low-fat alternatives. Edible Vegetable Oil , added fats and will affect the organs heart depending on type , choose unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , use reduced-salt options. Emulsifiers , processing aids that may alter gut microbiota and will affect the organs digestive system in sensitive people , prefer minimal-emulsifier spreads. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic use , choose preservative-free spreads. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in susceptible individuals , use natural flavors.",
    severityCounts: { low: 2, medium: 3, high: 1 },
    organsAffected: ['heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Tata Sampann Moong Dal',
    category: 'staples',
    ingredients: ingredients.filter(i =>
      ['Moong Dal'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Moong Dal , high-quality plant protein & fiber and will affect the organs digestive & metabolic systems beneficially , use as a staple protein source.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['digestive system','metabolic system']
  },
  {
    name: 'Saffola Masala Oats',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Oats', 'Spice Mix', 'Salt', 'Dehydrated Vegetables', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fiber and will affect the organs heart & digestive system beneficially , prefer whole oats. Spice Mix , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , use natural spices. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Dehydrated Vegetables , convenient nutrients but processed and will affect the organs digestive system moderately , prefer fresh vegetables. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , choose natural flavoring.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','cardiovascular system']
  },
  {
    name: 'Kellogg\'s Chocos (Mini)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Cocoa', 'Emulsifier', 'Vitamins'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , choose whole-grain cereals. Sugar , added sugar and will affect the organs pancreas & teeth , pick low-sugar variants. Cocoa , antioxidant potential when high-cocoa and will affect the organs heart & nervous system beneficially in quality cocoa , prefer higher-cocoa options. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , seek minimal-additive cereals. Vitamins , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Maggi Masala-ae-Magic (Soupy)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Tastemaker', 'Salt', 'Sugar', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , prefer whole-grain options. Tastemaker , additives may affect sensitive people and will affect the organs digestive or immune systems in some , use fresh seasoning. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Preservative , prolongs shelf life and will affect the organs liver & digestive system with chronic use , prefer fresh soups.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','digestive system','pancreas','teeth','cardiovascular system']
  },
  {
    name: 'Pringles Sour Cream & Onion',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Potato Flakes', 'Vegetable Oil', 'Salt', 'Flavorings', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potato Flakes , processed carb and will affect the organs metabolic system , use whole potatoes when possible. Vegetable Oil , added fats and will affect the organs heart depending on type , prefer unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Flavorings , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , choose natural flavoring. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic intake , pick preservative-free options.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','cardiovascular system','liver']
  },
  {
    name: 'Cadbury Dairy Milk (Silk Bubbly)',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Milk Solids', 'Cocoa', 'Emulsifier', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , added sugar and will affect the organs pancreas & teeth , reduce portions. Milk Solids , saturated fat & lactose and will affect the organs heart & digestive system , choose lower-fat chocolate if needed. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially when cocoa content is high , prefer dark chocolate. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , pick minimal-emulsifier variants. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in susceptible people , use natural flavors.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['pancreas','teeth','heart','digestive system','nervous system']
  },
  {
    name: 'Amul Mithai Mate (Kesar)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Sugar', 'Saffron', 'Stabilizer'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high amounts , use low-fat alternatives. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Saffron , flavor & antioxidant properties and will affect the organs mood & immune system beneficially in small amounts , use quality saffron. Stabilizer , texture aid and will affect the organs digestive system minimally in some people , prefer natural thickening agents.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','pancreas','teeth','immune system']
  },
  {
    name: 'Hershey\'s Chocolate Spread',
    category: 'spreads',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Cocoa', 'Vegetable Oil', 'Skimmed Milk Powder', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , added sugar and will affect the organs pancreas & teeth , limit use. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially when high-quality cocoa is used , prefer higher-cocoa spreads. Vegetable Oil , added fats and will affect the organs heart depending on type , avoid hydrogenated oils. Skimmed Milk Powder , dairy protein and will affect the organs digestive system in some people , choose lower-fat dairy if required. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , choose minimal-additive spreads.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Maggi Tomato Ketchup (Packet)',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Tomato Concentrate', 'Sugar', 'Vinegar', 'Salt', 'Spices', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Tomato Concentrate , source of lycopene and will affect the organs digestive & cardiovascular systems beneficially , prefer fresh tomatoes. Sugar , added sugar and will affect the organs pancreas & teeth , choose low-sugar ketchup. Vinegar , acidic and may affect the organs digestive system if overused , use in moderation. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Spices , flavor & digestive stimulation and will affect the organs digestive system beneficially in moderation , use natural spices. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , choose preservative-free ketchup when possible.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['digestive system','cardiovascular system','pancreas','teeth','liver']
  },
  {
    name: 'Pepsi (Regular, Can)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Carbonated Water', 'Sugar', 'Caffeine', 'Color', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Carbonated Water , may cause bloating and will affect the organs digestive system , prefer still water. Sugar , high added sugar and will affect the organs pancreas & teeth , limit sugary drinks. Caffeine , stimulant and will affect the organs nervous & cardiovascular systems in high intakes , moderate consumption. Color , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , opt for fewer additives. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , avoid frequent intake.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['digestive system','pancreas','teeth','nervous system','cardiovascular system','liver']
  },
  {
    name: 'Tropicana Strawberry (Juice)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Strawberry Juice', 'Sugar', 'Water', 'Preservatives', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Strawberry Juice , provides vitamins but concentrated sugar and will affect the organs pancreas & teeth if overused , prefer whole fruit. Sugar , added sugar and will affect the organs pancreas & teeth , choose no-added-sugar options. Water , hydration beneficial and will affect the organs overall positively , maintain intake. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , choose fresh-pressed juice if possible. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , prefer natural flavors.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['pancreas','teeth','digestive system','liver']
  },
  {
    name: 'Amul Kool (Coffee)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Sugar', 'Coffee Extract', 'Flavor', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy fats & lactose and will affect the organs heart & digestive system in full-fat forms , choose toned milk. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Coffee Extract , caffeine present and will affect the organs nervous & cardiovascular systems in sensitive individuals , limit intake. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in susceptible people , use natural flavor. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free beverages.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','pancreas','teeth','nervous system','liver']
  },
  {
    name: 'Britannia Tiger Cream (Chocolate)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Vegetable Oil', 'Cream Powder', 'Cocoa', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , prefer whole-grain flour. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Vegetable Oil , added fats and will affect the organs heart depending on type , avoid hydrogenated oils. Cream Powder , dairy fat & lactose and will affect the organs heart & digestive system , use low-fat alternatives. Cocoa , antioxidant potential in higher-cocoa forms and will affect the organs heart & nervous system beneficially , choose dark cocoa. Emulsifier , processing aid that may affect gut microbiota and will affect the organs digestive system in sensitive individuals , pick minimal-additive options.",
    severityCounts: { low: 3, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system','nervous system']
  },
  {
    name: 'Amul Fresh Cream (Tetrapack)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk Fat', 'Stabilizers', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Fat , saturated fat and will affect the organs heart when consumed in excess , use low-fat alternatives. Stabilizers , processing aids and will affect the organs digestive system minimally in sensitive people , prefer simple formulations. Preservatives , prolong shelf life and will affect the organs liver & digestive system with chronic exposure , use fresh cream where possible.",
    severityCounts: { low: 1, medium: 1, high: 1 },
    organsAffected: ['heart','digestive system','liver']
  },
  {
    name: 'Kurkure (Masala Munch)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Corn Meal', 'Vegetable Oil', 'Salt', 'Spice Mix', 'Preservative', 'Flavor Enhancer'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Corn Meal , processed carb and will affect the organs metabolic system , choose whole-grain snacks. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , prefer healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Spice Mix , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , use natural spices. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic intake , pick preservative-free options. Flavor Enhancer , additives may trigger sensitivities and will affect the organs nervous & digestive systems in susceptible people , choose clean-label seasonings.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Tata Sampann Chana (Kabuli)',
    category: 'staples',
    ingredients: ingredients.filter(i =>
      ['Kabuli Chana (Chickpeas)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Kabuli Chana , high-protein legume rich in fiber and will affect the organs digestive & metabolic systems beneficially , use as protein-rich staple.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['digestive system','metabolic system']
  },
  {
    name: 'Bournvita Biscuits (Milk)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Milk Solids', 'Vegetable Oil', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-wheat flour instead. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Milk Solids , saturated fat & lactose and will affect the organs heart & digestive system , choose low-fat dairy. Vegetable Oil , added fats and will affect the organs heart depending on type , avoid hydrogenated oils. Leavening Agent , may cause bloating and will affect the organs digestive system , prefer natural leavening.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Quaker Oats (Plain)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Oats'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fiber that supports heart & digestion and will affect the organs heart & digestive system beneficially , use rolled/steel-cut oats regularly.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['heart','digestive system']
  },
  {
    name: 'Hershey\'s Dark (85%)',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Cocoa Solids', 'Cocoa Butter', 'Sugar', 'Emulsifier (Soy Lecithin)', 'Vanilla'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Cocoa Solids , high antioxidant potential and will affect the organs heart & nervous system beneficially when cocoa % is high , prefer high-percentage dark chocolate. Cocoa Butter , fat source and will affect the organs heart depending on intake , use in moderation. Sugar , added sugar and will affect the organs pancreas & teeth , minimize sugar. Emulsifier (Soy Lecithin) , processing aid and will affect the organs digestive system in sensitive people , pick lecithin-free if required. Vanilla , flavoring and will affect the organs digestive/immune system minimally , prefer natural vanilla.",
    severityCounts: { low: 3, medium: 1, high: 0 },
    organsAffected: ['heart','nervous system','pancreas','teeth']
  },
  {
    name: 'Amul Ghee (Cow)',
    category: 'cooking fat',
    ingredients: ingredients.filter(i =>
      ['Clarified Butter (Ghee)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Clarified Butter (Ghee) , rich in saturated fats and will affect the organs heart when consumed in excess , use sparingly or prefer oils with healthier unsaturated fat profiles for daily cooking.",
    severityCounts: { low: 0, medium: 1, high: 1 },
    organsAffected: ['heart']
  },
  {
    name: 'Tropicana Mixed Fruit (No Sugar)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Mixed Fruit Juice', 'Vitamin C'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Mixed Fruit Juice , vitamins present but concentrated sugars and will affect the organs pancreas & teeth if overconsumed , prefer whole fruits. Vitamin C , antioxidant & immune support and will affect the organs immune system beneficially where deficient , maintain balanced intake.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['pancreas','teeth','immune system']
  },
  {
    name: 'Parle Krack Jack (Butter)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Butter', 'Sugar', 'Salt', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-grain alternatives. Butter , saturated fat and will affect the organs heart when frequent , use light spreads. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Leavening Agent , may cause gas and will affect the organs digestive system , choose natural leavening.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','heart','pancreas','teeth','digestive system']
  },
  {
    name: 'Maggi 2-Minute Noodles (Masala - Family Pack)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Tastemaker', 'Salt', 'MSG', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , favor whole-grain substitutions. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , prefer high-quality oils. Tastemaker , additives may cause sensitivities and will affect the organs digestive or immune systems in susceptible people , use fresh spices. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. MSG , flavor enhancer that may trigger sensitivity in some and will affect the organs nervous & digestive systems in susceptible individuals , choose no-MSG if needed. Preservative , prolongs shelf life and will affect the organs liver & digestive system with chronic use , prefer fresh cooking.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','nervous system','liver']
  },
  {
    name: 'Parle Monaco (Salted)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Edible Vegetable Oil', 'Salt', 'Leavening Agent', 'Sugar'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , use whole-wheat flour instead. Edible Vegetable Oil , source of fat and will affect the organs heart depending on fat profile , use unsaturated oils instead. Salt , excess sodium and will affect the organs cardiovascular system , use limited iodised salt instead. Leavening Agent , may cause bloating and will affect the organs digestive system , use natural leavening where possible instead. Sugar , added sugar and will affect the organs pancreas & teeth , use minimal natural sweeteners instead.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','heart','cardiovascular system','digestive system','pancreas','teeth']
  },
  {
    name: 'Sunfeast Marie',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Vegetable Oil', 'Salt', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , use whole-wheat flour instead. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar or use fruit as sweetener. Vegetable Oil , dietary fat and will affect the organs heart depending on type , use unsaturated oils instead. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , choose minimal-additive products instead.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system','cardiovascular system']
  },
  {
    name: 'Britannia NutriChoice (Digestive)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Whole Wheat Flour', 'Sugar', 'Vegetable Oil', 'Oats', 'Salt', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Whole Wheat Flour , high fiber and will affect the organs digestive & metabolic systems beneficially , use whole-wheat products. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Vegetable Oil , fat source and will affect the organs heart depending on type , prefer unsaturated oils. Oats , soluble fiber and will affect the organs heart & digestive system beneficially , use rolled oats. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Leavening Agent , may cause bloating and will affect the organs digestive system , use natural leavening instead.",
    severityCounts: { low: 4, medium: 2, high: 0 },
    organsAffected: ['digestive system','metabolic system','pancreas','teeth','heart','cardiovascular system']
  },
  {
    name: 'Pepsi (Diet Bottle)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Carbonated Water', 'Artificial Sweetener', 'Caffeine', 'Color', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Carbonated Water , may cause bloating and will affect the organs digestive system , use still water instead. Artificial Sweetener , low-calorie substitute but may affect gut microbiota and will affect the organs digestive & metabolic systems in sensitive people , prefer minimal sweeteners. Caffeine , stimulant and will affect the organs nervous & cardiovascular systems at high intake , limit consumption. Color , additive that may cause sensitivities and will affect the organs digestive or immune systems in some people , choose fewer-additive drinks. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , opt for fresh beverages.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['digestive system','metabolic system','nervous system','cardiovascular system','liver','immune system']
  },
  {
    name: 'Bingo Mad Angles (Chilli Guntur)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Corn Meal', 'Vegetable Oil', 'Salt', 'Chilli Powder', 'Flavorings', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Corn Meal , processed carbohydrate and will affect the organs metabolic system , use whole-grain alternatives. Vegetable Oil , frying oil and will affect the organs heart depending on type & reuse , prefer healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Chilli Powder , spicy ingredient that may irritate some digestive systems and will affect the organs digestive system , prefer milder spice. Flavorings , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , use natural seasonings. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , choose preservative-free snacks.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver','immune system']
  },
  {
    name: 'Haldiram\'s Khatta Meetha',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Lentils', 'Peanuts', 'Sugar', 'Salt', 'Vegetable Oil', 'Spices'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Lentils , plant protein & fiber and will affect the organs digestive & metabolic systems beneficially , include lentils in diet. Peanuts , healthy fats & protein and will affect the organs heart & metabolic system beneficially in moderation , prefer roasted unsalted. Sugar , added sugar and will affect the organs pancreas & teeth , limit sugar. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , choose healthier oils. Spices , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , use natural spices.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['digestive system','metabolic system','heart','cardiovascular system','pancreas','teeth']
  },
  {
    name: 'Amul Milk (Toned 1L)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Stabilizer', 'Vitamins'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , source of protein & calcium but contains saturated fat & lactose and will affect the organs heart & digestive system in high-fat forms , use toned/low-fat milk if needed. Stabilizer , processing aid and will affect the organs digestive system minimally in sensitive individuals , prefer minimal additives. Vitamins , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['heart','digestive system','skeletal system','nutritional status']
  },
  {
    name: 'Kissan Tomato Ketchup (Bottle)',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Tomato Concentrate', 'Sugar', 'Vinegar', 'Salt', 'Spices', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Tomato Concentrate , source of lycopene and will affect the organs digestive & cardiovascular systems beneficially , use fresh tomatoes where possible. Sugar , added sugar and will affect the organs pancreas & teeth , choose reduced-sugar ketchup. Vinegar , acidic agent and may irritate sensitive digestive tracts and will affect the organs digestive system in some , use in moderation. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Spices , flavor & digestive benefits and will affect the organs digestive system positively in moderation , use natural spices. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , prefer preservative-free condiments.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['digestive system','cardiovascular system','pancreas','teeth','liver']
  },
  {
    name: 'Nestle Milkmaid (Sweetened Condensed Milk)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Sugar', 'Stabilizer'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids , concentrated dairy nutrients with saturated fat & lactose and will affect the organs heart & digestive system in high intake , use sparingly. Sugar , very high added sugar and will affect the organs pancreas & teeth , avoid frequent consumption. Stabilizer , processing aid and will affect the organs digestive system minimally in sensitive people , prefer simple alternatives.",
    severityCounts: { low: 1, medium: 1, high: 1 },
    organsAffected: ['heart','digestive system','pancreas','teeth']
  },
  {
    name: 'Oreo Mini',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Vegetable Oil', 'Cocoa', 'Emulsifier', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-grain wafers instead. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Vegetable Oil , fats that will affect the organs heart depending on type , avoid hydrogenated oils. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially in higher-cocoa products , choose darker cocoa. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , prefer minimal-emulsifier options. Salt , excess sodium and will affect the organs cardiovascular system , limit salt.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system','cardiovascular system']
  },
  {
    name: 'Kellogg\'s Cornflakes (Regular)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Corn Flakes', 'Sugar', 'Salt', 'Vitamins', 'Malt Extract'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Corn Flakes , processed cereal with higher glycemic index and will affect the organs metabolic system , prefer whole-grain cereals. Sugar , added sugar and will affect the organs pancreas & teeth , choose low-sugar options. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Vitamins , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet. Malt Extract , flavor & carbohydrate source and will affect the organs metabolic system if added in excess , reduce added sweeteners.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','cardiovascular system']
  },
  {
    name: 'Amul Cheese (Grated)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Salt', 'Preservatives', 'Anti-caking Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy nutrient containing saturated fat & lactose and will affect the organs heart & digestive system in high intake , choose low-fat cheese. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , prefer fresh products. Anti-caking Agent , processing aid and will affect the organs digestive system minimally in sensitive individuals , use natural alternatives if possible.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Maggi Noodles (Masala - Single Serve)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Tastemaker', 'Salt', 'MSG', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , pick whole-grain variants when possible. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , prefer unsaturated oils. Tastemaker , contains additives that may affect sensitive people and will affect the organs digestive or immune systems in susceptible individuals , use fresh seasonings. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. MSG , flavor enhancer that may trigger sensitivity in some and will affect the organs nervous & digestive systems in sensitive individuals , opt for no-MSG products if needed. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer freshly prepared meals.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','nervous system','liver']
  },
  {
    name: 'Nutrela Soya Nuggets (Masala)',
    category: 'protein',
    ingredients: ingredients.filter(i =>
      ['Textured Soya Protein', 'Spice Mix', 'Salt', 'Oil', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Textured Soya Protein , high plant-protein and will affect the organs metabolic & muscular systems beneficially , use as vegetarian protein source. Spice Mix , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , use natural spices. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Oil , frying/added fat and will affect the organs heart depending on type & reuse , choose healthy oils. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic intake , pick preservative-free options.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['metabolic system','muscular system','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Dalda (Vanaspati)',
    category: 'cooking fat',
    ingredients: ingredients.filter(i =>
      ['Hydrogenated Vegetable Oil', 'Antioxidant', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Hydrogenated Vegetable Oil , may contain trans/saturated fats and will affect the organs heart adversely with prolonged intake , avoid hydrogenated fats and use unrefined unsaturated oils instead. Antioxidant , prevents oxidation and will affect the organs cellular health minimally beneficially , prefer minimally processed oils. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , choose single-ingredient oils instead.",
    severityCounts: { low: 1, medium: 1, high: 1 },
    organsAffected: ['heart','cellular health','digestive system']
  },
  {
    name: 'Kurkure (Twisted)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Corn Meal', 'Vegetable Oil', 'Salt', 'Spice Mix', 'Flavor Enhancers', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Corn Meal , processed carbohydrate and will affect the organs metabolic system , choose whole-grain snacks. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , prefer higher-oleic oils. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Spice Mix , digestive stimulation in moderation and will affect the organs digestive system positively , use real spices. Flavor Enhancers , additives may trigger sensitivities and will affect the organs nervous & digestive systems in susceptible people , choose clean-label seasonings. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer preservative-free products.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Tropicana 100% Pineapple',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Pineapple Juice', 'Vitamin C', 'No Added Sugar'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Pineapple Juice , natural fruit nutrients but concentrated sugars and will affect the organs pancreas & teeth if overused , prefer whole fruit. Vitamin C , antioxidant & immune support and will affect the organs immune system beneficially where deficient , maintain balanced intake. No Added Sugar , reduces added-sugar load and will affect the organs pancreas & teeth beneficially compared to sugared drinks , choose 100% fruit juice without added sugar.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['pancreas','teeth','immune system']
  },
  {
    name: 'Bournvita (Jar)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Malted Barley', 'Sugar', 'Milk Solids', 'Vitamins & Minerals', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Malted Barley , carbohydrate source and will affect the organs metabolic system depending on portion , use in moderation. Sugar , added sugar and will affect the organs pancreas & teeth , choose reduced-sugar options. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high-fat forms , use toned milk. Vitamins & Minerals , fortification beneficial and will affect the organs nutrient status positively where deficient , follow dietary guidance. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , prefer low-additive formulas.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Amulpro (Protein Milk)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Added Whey Protein', 'Vitamins', 'Stabilizer'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , source of protein & calcium but contains saturated fat & lactose and will affect the organs heart & digestive system in full-fat forms , use toned or low-fat milk. Added Whey Protein , concentrated protein and will affect the organs muscular & metabolic systems beneficially for many users when required , use as directed. Vitamins , fortification beneficial and will affect the organs nutrient status positively where deficient , keep balanced diet. Stabilizer , processing aid and will affect the organs digestive system minimally in some people , prefer simple formulations.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['muscular system','metabolic system','heart','digestive system']
  },
  {
    name: 'Quaker Oatmeal (Instant)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Oats', 'Sugar (small)', 'Salt', 'Flavor', 'Dried Fruit'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fiber and will affect the organs heart & digestive system beneficially , use rolled or steel-cut oats where possible. Sugar (small) , added sugar and will affect the organs pancreas & teeth if present , reduce sugar. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , prefer natural flavors. Dried Fruit , concentrated natural sugars & fiber and will affect the organs digestive system & teeth if overused , use fresh fruit instead.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','pancreas','teeth','cardiovascular system']
  },
  {
    name: 'Britannia Milk Bikis',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Milk Solids', 'Vegetable Oil', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , use whole-wheat flour instead. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Milk Solids , saturated fat & lactose and will affect the organs heart & digestive system , choose low-fat dairy. Vegetable Oil , added fat and will affect the organs heart depending on type , avoid hydrogenated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt intake.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system','cardiovascular system']
  },
  {
    name: 'Maggi Masala (Family Pack 4 Noodles)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Tastemaker', 'Salt', 'MSG', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , prefer whole-grain noodles. Vegetable Oil , frying oil and will affect the organs heart depending on type & reuse , choose non-hydrogenated oils. Tastemaker , contains additives that may affect sensitive individuals and will affect the organs digestive or immune systems in susceptible people , use fresh spices. Salt , excess sodium and will affect the organs cardiovascular system , cut down on salt. MSG , flavor enhancer that may trigger sensitivity in some and will affect the organs nervous & digestive systems in sensitive individuals , opt for MSG-free options if needed. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer freshly prepared foods.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','nervous system','liver']
  },
  {
    name: 'Amul Buttermilk (Probiotic)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Buttermilk (Curd)', 'Live Cultures', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Buttermilk (Curd) , fermented dairy beneficial and will affect the organs digestive & immune systems positively for many , prefer live-culture products. Live Cultures , probiotics and will affect the organs digestive & immune systems beneficially in many users , maintain dietary diversity. Salt , excess sodium and will affect the organs cardiovascular system when excessive , limit added salt.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['digestive system','immune system','cardiovascular system']
  },
  {
    name: 'Tata Salt Lite (Table Sachet)',
    category: 'staples',
    ingredients: ingredients.filter(i =>
      ['Reduced Sodium Salt', 'Iodine'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Reduced Sodium Salt , lowers sodium intake and will affect the organs cardiovascular system beneficially for many people , use as advised. Iodine , essential for thyroid function and will affect the organs endocrine system beneficially when required , continue iodisation where needed.",
    severityCounts: { low: 2, medium: 0, high: 0 },
    organsAffected: ['cardiovascular system','endocrine system']
  },
  {
    name: 'Hershey\'s Chocolate Syrup',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Cocoa', 'Corn Syrup', 'Preservative', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , high added sugar and will affect the organs pancreas & teeth , reduce usage. Cocoa , antioxidant potential in higher-quality cocoa and will affect the organs heart & nervous system beneficially in less-processed cocoa , choose higher-cocoa products. Corn Syrup , high glycemic sweetener and will affect the organs metabolic system & pancreas , use natural sweeteners. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer preservative-free syrups. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , choose natural flavorings.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['pancreas','teeth','metabolic system','heart','liver']
  },
  {
    name: 'Britannia Cheese (Slices Pack)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Emulsifiers', 'Salt', 'Preservatives', 'Color'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy saturated fat & lactose and will affect the organs heart & digestive system in high amounts , choose low-fat cheese. Emulsifiers , processing aids that may affect gut microbiota and will affect the organs digestive system in sensitive people , prefer natural cheeses. Salt , excess sodium and will affect the organs cardiovascular system , choose reduced-sodium options. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , pick fresh cheese. Color , additives may cause sensitivities in some and will affect the organs skin & immune system , select color-free products if preferred.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','cardiovascular system','liver','skin']
  },
  {
    name: 'Tropicana Apple (No Sugar)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Apple Juice (100%)', 'Vitamin C (Fortified)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Apple Juice (100%) , natural vitamins but concentrated sugars and will affect the organs pancreas & teeth if overconsumed , prefer whole apples. Vitamin C (Fortified) , antioxidant & immune support and will affect the organs immune system beneficially where deficient , maintain balanced intake.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['pancreas','teeth','immune system']
  },
  {
    name: 'Kellogg\'s Muesli (Apple & Almond)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Oats', 'Dried Apple', 'Almonds', 'Sugar (if added)', 'Salt', 'Vitamins'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fiber and will affect the organs heart & digestive system beneficially , choose rolled oats. Dried Apple , concentrated sugar & fiber and will affect the organs teeth & digestive system if overused , use fresh fruit. Almonds , healthy fats & minerals and will affect the organs heart & metabolic system beneficially in moderation , prefer unsalted nuts. Sugar (if added) , added sugar and will affect the organs pancreas & teeth , reduce added sugar. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Vitamins , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','teeth','pancreas','cardiovascular system']
  },
  {
    name: 'Amul Paneer (Fresh)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Salt', 'Culture (for some brands)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy-rich protein & calcium but contains saturated fat & lactose and will affect the organs heart & digestive system in high-fat variants , choose low-fat paneer if needed. Salt , excess sodium and will affect the organs cardiovascular system , limit salt use. Culture , fermentation aids digestibility and will affect the organs digestive system beneficially in cultured products , prefer fresh paneer.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['digestive system','heart','cardiovascular system']
  },
  {
    name: 'Haldiram\'s Aloo Chips',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Potato', 'Vegetable Oil', 'Salt', 'Spices', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potato , starchy vegetable and when fried will affect the organs metabolic system , prefer baked variants. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , opt for healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Spices , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , use natural spices. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , choose preservative-free snacks.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Tata Tea Gold (Premium)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Black Tea Leaves', 'Natural Flavors'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Black Tea Leaves , source of caffeine & antioxidants and will affect the organs nervous & cardiovascular systems depending on intake , use in moderation. Natural Flavors , additives may cause sensitivities and will affect the organs digestive or immune systems in susceptible people , prefer plain teas.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['nervous system','cardiovascular system','immune system']
  },
  {
    name: 'Cadbury Celebrations (Assorted)',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Milk Solids', 'Cocoa', 'Vegetable Oil', 'Emulsifier', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , added sugar and will affect the organs pancreas & teeth , limit portions. Milk Solids , saturated fat & lactose and will affect the organs heart & digestive system in large intake , choose lower-fat options. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially in high-cocoa products , prefer darker chocolate. Vegetable Oil , added fats and will affect the organs heart depending on type , avoid hydrogenated oils. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , pick minimal-additive chocolates. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive individuals , use natural flavors.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['pancreas','teeth','heart','digestive system','nervous system']
  },
  {
    name: 'Amul Instant Pudding Mix',
    category: 'dessert',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Sugar', 'Starch', 'Flavor', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high intake , use low-fat milk where possible. Sugar , added sugar and will affect the organs pancreas & teeth , minimize sugar. Starch , thickener that may affect glycemic load if refined and will affect the organs metabolic system , use whole-food thickeners. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , choose natural flavors. Preservative , prolongs shelf life and will affect the organs liver & digestive system with chronic exposure , prefer fresh desserts.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['heart','digestive system','pancreas','teeth','liver']
  },
  {
    name: 'Maggi Masala (Noodles Bowl)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Tastemaker', 'Salt', 'MSG', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , choose whole-grain alternatives when possible. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , opt for unsaturated oils. Tastemaker , contains additives that may affect sensitive individuals and will affect the organs digestive or immune systems in susceptible people , use fresh spices. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. MSG , flavor enhancer that may cause sensitivity in some and will affect the organs nervous & digestive systems in susceptible individuals , choose MSG-free if concerned. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer freshly prepared meals.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','nervous system','liver']
  },
  {
    name: 'Parle Marie Light',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Vegetable Oil', 'Salt', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , use whole-wheat flour instead. Sugar , added sugar and will affect the organs pancreas & teeth , use less sugar or natural fruit sweeteners instead. Vegetable Oil , source of fat and will affect the organs heart depending on fat profile , use unsaturated oils instead. Salt , excess sodium and will affect the organs cardiovascular system , use limited iodised salt instead. Leavening Agent , may cause bloating and will affect the organs digestive system , choose natural leavening when possible instead.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','cardiovascular system','digestive system']
  },
  {
    name: 'Sunfeast Farmlite Digestive',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Whole Wheat Flour', 'Oats', 'Sugar', 'Vegetable Oil', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Whole Wheat Flour , high-fiber carbohydrate and will affect the organs digestive & metabolic systems beneficially , use whole-wheat products. Oats , soluble fiber and will affect the organs heart & digestive system beneficially , prefer rolled oats. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Vegetable Oil , added fat and will affect the organs heart depending on type , choose unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt intake.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['digestive system','metabolic system','heart','pancreas','teeth','cardiovascular system']
  },
  {
    name: 'Pepsi (Can 330ml)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Carbonated Water', 'Sugar', 'Caffeine', 'Color', 'Phosphoric Acid', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Carbonated Water , may cause bloating and will affect the organs digestive system , use still water instead. Sugar , high added sugar and will affect the organs pancreas & teeth , limit sugary drinks. Caffeine , stimulant and will affect the organs nervous & cardiovascular systems at high intake , moderate consumption. Color , additives may trigger sensitivities and will affect the organs digestive or immune systems in some people , prefer fewer-additive drinks. Phosphoric Acid , acidity regulator and may affect bone mineral balance if excessive and will affect the organs skeletal & renal systems , use natural acidic ingredients. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , choose fresh beverages.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['digestive system','pancreas','teeth','nervous system','cardiovascular system','skeletal system','liver']
  },
  {
    name: 'Coke (Regular Bottle)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Carbonated Water', 'Sugar', 'Caffeine', 'Color (Caramel)', 'Phosphoric Acid', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Carbonated Water , may cause bloating and will affect the organs digestive system , prefer still water. Sugar , high added sugar and will affect the organs pancreas & teeth , reduce intake. Caffeine , stimulant and will affect the organs nervous & cardiovascular systems in sensitive people , moderate intake. Color (Caramel) , additive that may cause sensitivities and will affect the organs digestive or immune systems in some , choose fewer additives. Phosphoric Acid , acidity regulator and may affect bone mineral balance with chronic high intake and will affect the organs skeletal & renal systems , use natural acidulants. Preservatives , prolong shelf life and will affect the organs liver & digestive system with chronic exposure , minimize consumption.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['digestive system','pancreas','teeth','nervous system','cardiovascular system','skeletal system','liver']
  },
  {
    name: 'Amul Taaza (Tetra 500ml)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Stabilizer', 'Vitamins (A,D)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , source of protein & calcium but contains lactose and some saturated fat and will affect the organs digestive & heart systems depending on fat content , use toned/low-fat milk if required. Stabilizer , processing aid and will affect the organs digestive system minimally in some sensitive people , choose simple formulations. Vitamins (A,D) , fortification supports vision & bone health and will affect the organs skeletal & immune systems beneficially when needed , maintain balanced diet.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['digestive system','heart','skeletal system','immune system']
  },
  {
    name: 'Tata Tea Premium (Green Tea Bags)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Green Tea Leaves'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Green Tea Leaves , antioxidant-rich beverage and will affect the organs cardiovascular & metabolic systems beneficially in moderation , drink plain or without added sugar for benefit.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['cardiovascular system','metabolic system']
  },
  {
    name: 'Horlicks (Chocolate Jar)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Malted Barley', 'Wheat Flour', 'Sugar', 'Milk Solids', 'Vitamins & Minerals', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Malted Barley , carbohydrate source and will affect the organs metabolic system depending on portion , use in moderation. Wheat Flour , carbohydrate that will affect the organs metabolic system depending on refinement , prefer whole grains. Sugar , added sugar and will affect the organs pancreas & teeth , choose reduced-sugar options. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high-fat forms , use toned milk. Vitamins & Minerals , fortification beneficial and will affect the organs overall nutrition positively where deficient , follow recommended intakes. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in susceptible people , prefer natural flavors.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system','immune system']
  },
  {
    name: 'Kellogg\'s Special K (Original)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Rice & Wheat Flakes', 'Sugar (small)', 'Vitamins & Minerals', 'Salt', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Rice & Wheat Flakes , processed cereals and will affect the organs metabolic system depending on refinement , prefer whole-grain cereals. Sugar (small) , added sugar and will affect the organs pancreas & teeth if present , pick low-sugar options. Vitamins & Minerals , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive individuals , opt for natural flavors.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','cardiovascular system','immune system']
  },
  {
    name: 'Patanjali Cow Ghee',
    category: 'cooking fat',
    ingredients: ingredients.filter(i =>
      ['Clarified Butter (Ghee)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Clarified Butter (Ghee) , rich in saturated fats and will affect the organs heart adversely when consumed in excess , use sparingly or prefer oils with healthier unsaturated fat profiles for everyday cooking.",
    severityCounts: { low: 0, medium: 1, high: 1 },
    organsAffected: ['heart']
  },
  {
    name: 'Dalda (Cooking Vanaspati)',
    category: 'cooking fat',
    ingredients: ingredients.filter(i =>
      ['Hydrogenated Vegetable Oil', 'Antioxidant', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Hydrogenated Vegetable Oil , may contain trans/saturated fats and will affect the organs heart adversely with prolonged intake , avoid hydrogenated fats and use unrefined unsaturated oils instead. Antioxidant , prevents rancidity and will affect the organs cellular health minimally beneficially , prefer minimally processed oils. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , choose single-ingredient oils instead.",
    severityCounts: { low: 1, medium: 1, high: 1 },
    organsAffected: ['heart','cellular health','digestive system']
  },
  {
    name: 'Amul Butter Salted (Pack)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Cream', 'Salt', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Cream , concentrated dairy fat and will affect the organs heart when consumed frequently , use light spreads or small amounts. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Preservative , prolongs shelf life and will affect the organs liver & digestive system with chronic exposure , choose fresh butter where possible.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['heart','cardiovascular system','liver']
  },
  {
    name: 'Parle Hide & Seek Choco (Pack)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Vegetable Oil', 'Cocoa', 'Milk Solids', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , replace with whole-grain alternatives. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Vegetable Oil , added fat and will affect the organs heart depending on fat type , use unsaturated oils. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially when cocoa % is higher , prefer dark cocoa. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high intake , choose low-fat dairy. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , prefer minimal-additive products.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system','nervous system']
  },
  {
    name: 'Nutrela Soya Chunks (Pack)',
    category: 'protein',
    ingredients: ingredients.filter(i =>
      ['Textured Soya Protein', 'Flavor (optional)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Textured Soya Protein , high plant-protein and will affect the organs muscular & metabolic systems beneficially as a vegetarian protein source , include as part of balanced diet. Flavor (optional) , additives may cause sensitivities and will affect the organs digestive or immune systems in some people , prefer plain soya chunks without flavor.",
    severityCounts: { low: 2, medium: 0, high: 0 },
    organsAffected: ['muscular system','metabolic system','digestive system']
  },
  {
    name: 'Maggi 2-Minute Noodles (Masala Pack of 8)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Tastemaker (Spice Mix)', 'Salt', 'MSG', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-grain noodles where possible. Vegetable Oil , frying fat and will affect the organs heart depending on fat type & reuse , prefer healthier oils. Tastemaker (Spice Mix) , contains additives that may affect sensitive people and will affect the organs digestive or immune systems in susceptible individuals , prefer fresh spices. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. MSG , flavor enhancer that may trigger sensitivity in some and will affect the organs nervous & digestive systems in susceptible people , opt for no-MSG options if desired. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , choose fresh meals where possible.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','nervous system','liver']
  },
  {
    name: 'Britannia Good Day (Butter Cookies)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Butter', 'Milk Solids', 'Salt', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , prefer whole-grain flour. Sugar , added sugar and will affect the organs pancreas & teeth , cut down sugar. Butter , saturated fat and will affect the organs heart if consumed frequently , use light spreads. Milk Solids , dairy fat & lactose and will affect the organs heart & digestive system , choose low-fat dairy. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Leavening Agent , may cause bloating and will affect the organs digestive system , use natural leavening when possible.",
    severityCounts: { low: 3, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system','cardiovascular system']
  },
  {
    name: 'Tropicana Mosambi (No Sugar)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Mosambi (Sweet Lime) Juice (100%)', 'Vitamin C (Fortified)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Mosambi Juice (100%) , natural citrus nutrients but concentrated sugar and will affect the organs pancreas & teeth if overconsumed , prefer whole fruit. Vitamin C (Fortified) , antioxidant & immune support and will affect the organs immune system beneficially when needed , keep balanced intake.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['pancreas','teeth','immune system']
  },
  {
    name: 'Bingo Tedhe Medhe (Peri Peri)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Maize Corn', 'Vegetable Oil', 'Salt', 'Peri Peri Spice', 'Flavorings', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Maize Corn , processed grain and will affect the organs metabolic system , prefer whole-corn snacks. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , choose healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Peri Peri Spice , spicy seasoning that may irritate some digestive tracts and will affect the organs digestive system , use milder spice if sensitive. Flavorings , additives may trigger sensitivities and will affect the organs digestive or immune systems in susceptible people , opt for natural seasonings. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , choose preservative-free options.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Nestle KitKat (4 Finger)',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour (for wafers)', 'Sugar', 'Vegetable Oil', 'Cocoa', 'Milk Solids', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb in wafers and will affect the organs metabolic system , use whole-grain wafers if available. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Vegetable Oil , added fats and will affect the organs heart depending on type , avoid hydrogenated oils. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially in higher-cocoa products , prefer dark variants. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system , choose low-fat dairy. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , choose minimal-additive chocolates.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system','nervous system']
  },
  {
    name: 'Amul Cheese (Triangle Pack)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Emulsifiers', 'Salt', 'Preservatives', 'Color'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy containing saturated fat & lactose and will affect the organs heart & digestive system in high amounts , choose low-fat cheese where needed. Emulsifiers , processing aids that may affect gut microbiota and will affect the organs digestive system in sensitive people , prefer natural cheeses. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free products. Color , additives may trigger sensitivities and will affect the organs skin & immune system in susceptible people , select color-free variants.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','cardiovascular system','liver','skin']
  },
  {
    name: 'Kurkure (Masala Munch Small)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Corn Meal', 'Vegetable Oil', 'Salt', 'Spice Mix', 'Preservatives', 'Flavor Enhancers'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Corn Meal , processed carbohydrate and will affect the organs metabolic system , choose whole-grain snacks. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , choose unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Spice Mix , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , use natural spices. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free options. Flavor Enhancers , additives may trigger sensitivities and will affect the organs nervous & digestive systems in susceptible people , choose clean-label seasonings.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Dabur Honey (Small Jar)',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Honey'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Honey , natural sweetener but still sugar and will affect the organs teeth & pancreas if overused , use sparingly or raw/local honey where available and avoid for infants under 1 year.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['teeth','pancreas']
  },
  {
    name: 'Glucon-D (Powder Sachet)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Glucose', 'Salt', 'Vitamins', 'Flavor', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Glucose , quick energy and will affect the organs pancreas & metabolic system (use for rehydration/energy short-term) , use as directed. Salt , electrolyte replacement but excess affects cardiovascular system and will affect the organs cardiovascular & renal systems , follow guidelines. Vitamins , support metabolism & immunity and will affect the organs metabolic & immune systems beneficially when deficient , maintain balanced diet. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , prefer natural flavors. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , avoid frequent consumption.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['pancreas','metabolic system','cardiovascular system','renal system','immune system','liver']
  },
  {
    name: 'Cadbury 5 Star (Mini)',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Glucose Syrup', 'Milk Solids', 'Vegetable Oil', 'Cocoa Solids', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , added sugar and will affect the organs pancreas & teeth , reduce portions. Glucose Syrup , high-glycemic sweetener and will affect the organs metabolic system & pancreas , prefer natural sweeteners. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high intake , choose lower-fat alternatives. Vegetable Oil , added fats and will affect the organs heart depending on type , avoid hydrogenated oils. Cocoa Solids , antioxidant potential when cocoa % is higher and will affect the organs heart & nervous system beneficially in dark products , prefer higher-cocoa content. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , opt for minimal-additive chocolates.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['pancreas','teeth','metabolic system','heart','digestive system','nervous system']
  },
  {
    name: 'Tata Salt Lite (Box)',
    category: 'staples',
    ingredients: ingredients.filter(i =>
      ['Reduced Sodium Salt', 'Potassium Chloride', 'Iodine'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Reduced Sodium Salt , lowers sodium intake and will affect the organs cardiovascular system beneficially for many people , use as advised. Potassium Chloride , sodium alternative and will affect the organs cardiovascular & renal systems (monitor if on meds) , consult physician if required. Iodine , essential for thyroid and will affect the organs endocrine system beneficially when required , continue iodisation where deficiency risk exists.",
    severityCounts: { low: 2, medium: 0, high: 0 },
    organsAffected: ['cardiovascular system','renal system','endocrine system']
  },
  {
    name: 'Maggi Hot & Sweet Sauce (Bottle)',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Tomato Concentrate', 'Sugar', 'Vinegar', 'Salt', 'Chilli', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Tomato Concentrate , source of lycopene and will affect the organs digestive & cardiovascular systems beneficially , prefer fresh tomatoes. Sugar , added sugar and will affect the organs pancreas & teeth , choose low-sugar options. Vinegar , acidic agent and may irritate sensitive digestive tracts and will affect the organs digestive system in some people , use in moderation. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Chilli , spicy ingredient that may irritate sensitive digestive systems and will affect the organs digestive system in some individuals , use milder versions if needed. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free sauces.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['digestive system','cardiovascular system','pancreas','teeth','liver']
  },
  {
    name: 'Tropicana Mango (No Sugar)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Mango Pulp', 'Vitamins', 'No Added Sugar', 'Acidity Regulator'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Mango Pulp , fruit nutrients but concentrated natural sugar and will affect the organs pancreas & teeth if overused , prefer whole fruit. Vitamins , fortification may help nutrient status and will affect the organs overall nutrition beneficially when deficient , maintain balanced diet. No Added Sugar , reduces added-sugar load and will affect the organs pancreas & teeth beneficially compared to sugared drinks , choose 100% pulp options. Acidity Regulator , stabilizes pH and may irritate some digestive tracts and will affect the organs digestive system in sensitive individuals , prefer natural acidulants like lemon.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['pancreas','teeth','digestive system','nutritional status']
  },
  {
    name: 'Kellogg\'s All-Bran (Original)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Wheat Bran', 'Wheat Flour', 'Vitamins & Minerals', 'Sugar (small)', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Wheat Bran , high in fiber and will affect the organs digestive system beneficially , include bran-rich cereals. Wheat Flour , carbohydrate and will affect the organs metabolic system depending on processing , prefer whole-wheat. Vitamins & Minerals , fortification helpful and will affect the organs nutrient status positively where deficient , maintain balanced intake. Sugar (small) , added sugar and will affect the organs pancreas & teeth if present , choose minimal-sugar cereals. Salt , excess sodium and will affect the organs cardiovascular system , limit added salt.",
    severityCounts: { low: 3, medium: 1, high: 0 },
    organsAffected: ['digestive system','metabolic system','pancreas','teeth','cardiovascular system']
  },
  {
    name: 'Amul Cheese Shreds (Mozzarella)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Salt', 'Enzymes/Culture', 'Anti-caking Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy containing saturated fat & lactose and will affect the organs heart & digestive system depending on fat content , choose low-fat alternatives if needed. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Enzymes/Culture , help texture & digestibility and will affect the organs digestive system beneficially in some cases , prefer natural fermentation. Anti-caking Agent , processing aid and will affect the organs digestive system minimally in sensitive people , choose minimally processed options.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['heart','digestive system','cardiovascular system']
  },
  {
    name: 'Haldiram\'s Moong Dal (Roasted)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Moong Dal', 'Salt', 'Vegetable Oil', 'Spices'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Moong Dal , protein-rich legume and will affect the organs digestive & metabolic systems beneficially , include as a healthy snack. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Vegetable Oil , added fat and will affect the organs heart depending on type , prefer minimal oil or roasted options. Spices , flavor & digestive benefits and will affect the organs digestive system positively in moderation , use natural spices.",
    severityCounts: { low: 3, medium: 1, high: 0 },
    organsAffected: ['digestive system','metabolic system','cardiovascular system','heart']
  },
  {
    name: 'Britannia Milk Bikis (Small)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Milk Solids', 'Vegetable Oil', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , use whole-grain alternatives. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system , opt for low-fat dairy. Vegetable Oil , added fats and will affect the organs heart depending on type , avoid hydrogenated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt intake.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system','cardiovascular system']
  },
  {
    name: 'Quaker Oats (Chocolate Flavor)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Oats', 'Sugar', 'Cocoa', 'Flavor', 'Salt', 'Dried Milk'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fiber and will affect the organs heart & digestive system beneficially , prefer plain oats and add fresh fruit. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Cocoa , antioxidant potential in quality cocoa and will affect the organs heart & nervous system beneficially when cocoa % is meaningful , choose high-quality cocoa. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , prefer natural flavoring. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Dried Milk , dairy protein & lactose and will affect the organs digestive system in lactose-intolerant individuals , use lactose-free milk if needed.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','pancreas','teeth','nervous system']
  },
  {
    name: 'Maggi Masala (Cup Noodles Veg)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Tastemaker', 'Salt', 'Preservatives', 'Anti-caking Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , choose whole-grain alternatives. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , use healthier oils. Tastemaker , contains additives and will affect the organs digestive or immune systems in sensitive individuals , opt for fresh spices. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , prefer fresh meals when possible. Anti-caking Agent , processing aid and will affect the organs digestive system minimally in sensitive people , choose natural blends.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Kellogg\'s Frosties (Small)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Corn Flakes', 'Sugar', 'Malt Extract', 'Vitamins & Minerals', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Corn Flakes , processed cereal and will affect the organs metabolic system (higher glycemic index) , prefer whole-grain cereals. Sugar , high added sugar and will affect the organs pancreas & teeth , minimize sugar. Malt Extract , flavoring & carbohydrate and will affect the organs metabolic system if used in excess , prefer less sweet versions. Vitamins & Minerals , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet. Salt , excess sodium and will affect the organs cardiovascular system , limit salt.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','cardiovascular system']
  },
  {
    name: 'Amul Mithai Mate (Kheer Instant Small)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Sugar', 'Flavor (Cardamom)', 'Stabilizer'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high intake , use low-fat milk. Sugar , added sugar and will affect the organs pancreas & teeth , cut down sugar. Flavor (Cardamom) , natural spice and will affect the organs digestive system positively in moderation , prefer whole cardamom. Stabilizer , processing aid and will affect the organs digestive system minimally in some people , use natural thickening agents if possible.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','pancreas','teeth']
  },
  {
    name: 'Bournvita Biscuits (Choco)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Cocoa', 'Milk Solids', 'Vegetable Oil', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , prefer whole-wheat alternatives. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially when cocoa % is higher , choose better cocoa. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system , use low-fat dairy. Vegetable Oil , added fats and will affect the organs heart depending on type , avoid hydrogenated oils. Leavening Agent , may cause bloating and will affect the organs digestive system , try natural leavening.",
    severityCounts: { low: 3, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system','nervous system']
  },
  {
    name: 'Kurkure (Green Chutney Small)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Corn Meal', 'Vegetable Oil', 'Salt', 'Spice Mix', 'Flavoring', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Corn Meal , processed carb and will affect the organs metabolic system , choose whole-grain snacks where possible. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , prefer healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Spice Mix , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , use natural whole spices. Flavoring , additives may cause sensitivities and will affect the organs digestive or immune systems in delicate individuals , opt for natural seasonings. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , choose preservative-free options.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Dabur Chyawanprash (Small Jar)',
    category: 'health foods',
    ingredients: ingredients.filter(i =>
      ['Herbal Extracts', 'Sugar', 'Honey', 'Ghee', 'Sesame Oil'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Herbal Extracts , traditional immune-supporting herbs and will affect the organs immune system beneficially for many users , consult healthcare for chronic conditions. Sugar , added sugar and will affect the organs pancreas & teeth , reduce quantity if diabetic. Honey , natural sweetener but still sugar and will affect the organs teeth & pancreas if overused , use sparingly. Ghee , saturated fat and will affect the organs heart when consumed in excess , use sparingly or prefer healthier oils for daily use. Sesame Oil , healthy unsaturated fats and will affect the organs heart beneficially in moderation , prefer cold-pressed oils.",
    severityCounts: { low: 3, medium: 2, high: 1 },
    organsAffected: ['immune system','pancreas','teeth','heart']
  },
  {
    name: 'Kellogg\'s Chocos (Family Pack)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Cocoa', 'Emulsifier', 'Vitamins & Minerals'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , choose whole-grain cereals. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially when cocoa is higher-percentage , prefer better cocoa content. Emulsifier , processing aid that may affect gut microbiota and will affect the organs digestive system in sensitive people , look for minimal additives. Vitamins & Minerals , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Amul Kool (Chocolate Small)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Sugar', 'Cocoa', 'Flavor', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy fats & lactose and will affect the organs heart & digestive system in full-fat forms , prefer toned milk. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Cocoa , antioxidant potential in quality cocoa and will affect the organs heart & nervous system beneficially when cocoa % is higher , choose better cocoa. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in susceptible people , prefer natural flavors. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free beverages.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','pancreas','teeth','nervous system','liver']
  },
  {
    name: 'Britannia 50-50 (Cream)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Vegetable Oil', 'Milk Solids', 'Cream Powder', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , use whole-wheat flour instead. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Vegetable Oil , added fats and will affect the organs heart depending on type , avoid hydrogenated oils. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system , choose low-fat alternatives. Cream Powder , dairy fat & lactose and will affect the organs heart & digestive system , use sparingly. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , prefer minimal-additive products.",
    severityCounts: { low: 3, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Pringles Original (Pack)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Potato Flakes', 'Vegetable Oil', 'Salt', 'Flavorings', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potato Flakes , processed carbohydrate and will affect the organs metabolic system , prefer whole potatoes. Vegetable Oil , added fats and will affect the organs heart depending on type , choose unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Flavorings , additives may cause sensitivities and will affect the organs digestive or immune systems in some people , choose natural flavoring. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free snacks.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','cardiovascular system','liver']
  },
  {
    name: 'Nestle Everyday (Toned Milk Powder)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Vegetable Oils', 'Lactose', 'Vitamins', 'Stabilizer'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids , dairy nutrients that include saturated fat & lactose and will affect the organs heart & digestive system depending on fat content , choose toned options. Vegetable Oils , added fats and will affect the organs heart depending on type , prefer unsaturated oils. Lactose , milk sugar and will affect the organs digestive system in lactose-intolerant people , use lactose-free milk if needed. Vitamins , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet. Stabilizer , processing aid and will affect the organs digestive system minimally in sensitive individuals , choose basic formulations.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','metabolic system']
  },
  {
    name: 'Amul Cheese Spread (Jar Small)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Edible Vegetable Oil', 'Salt', 'Emulsifiers', 'Preservatives', 'Flavour'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high intake , use low-fat alternatives. Edible Vegetable Oil , added fats and will affect the organs heart depending on type , prefer unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Emulsifiers , processing aids that may affect gut microbiota and will affect the organs digestive system in sensitive people , opt for minimal-emulsifier spreads. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free spreads. Flavour , additives may cause sensitivities and will affect the organs digestive or immune systems in some people , prefer natural flavors.",
    severityCounts: { low: 2, medium: 3, high: 1 },
    organsAffected: ['heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Tata Sampann Besan (Pack)',
    category: 'staples',
    ingredients: ingredients.filter(i =>
      ['Gram Flour (Besan)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Gram Flour (Besan) , high-protein legume flour and will affect the organs digestive & metabolic systems beneficially , use as protein-rich alternative to refined flour.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['digestive system','metabolic system']
  },
  {
    name: 'MTR Rasam Powder',
    category: 'spices',
    ingredients: ingredients.filter(i =>
      ['Coriander', 'Chilli', 'Tamarind Powder', 'Salt', 'Asafoetida'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Coriander , digestive aid and will affect the organs digestive system beneficially , use fresh roasted seeds. Chilli , pungent and may irritate some digestive tracts and will affect the organs digestive system in sensitive individuals , prefer mild chilli. Tamarind Powder , souring agent and digestive aid and will affect the organs digestive system beneficially in moderation , use fresh tamarind. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Asafoetida , digestive aid and will affect the organs digestive system beneficially for many , use small amounts.",
    severityCounts: { low: 4, medium: 1, high: 0 },
    organsAffected: ['digestive system','cardiovascular system']
  },
  {
    name: 'Britannia Little Hearts',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Vegetable Oil', 'Milk Solids', 'Salt', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-wheat alternatives. Sugar , added sugar and will affect the organs pancreas & teeth , cut down sugar. Vegetable Oil , added fat and will affect the organs heart depending on type , prefer unsaturated oils. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system , choose low-fat dairy. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Leavening Agent , may cause gas and will affect the organs digestive system , use natural leavening where possible.",
    severityCounts: { low: 3, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system','cardiovascular system']
  },
  {
    name: 'Amul Fresh Paneer (Small)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Salt', 'Culture (if present)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy protein & calcium but contains saturated fat & lactose and will affect the organs heart & digestive system depending on fat content , choose low-fat paneer if needed. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Culture , fermentation aids digestibility and will affect the organs digestive system beneficially in some products , prefer fresh paneer.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['digestive system','heart','cardiovascular system']
  },
  {
    name: 'Knorr Masala-ae-Magic (Soup)',
    category: 'ready meals',
    ingredients: ingredients.filter(i =>
      ['Dehydrated Vegetables', 'Salt', 'Starch', 'Flavor', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Dehydrated Vegetables , convenient nutrients but processed and will affect the organs digestive system moderately , prefer fresh vegetables. Salt , excess sodium and will affect the organs cardiovascular system , choose low-sodium options. Starch , thickener and may affect glycemic load if refined and will affect the organs metabolic system , prefer whole-food thickeners. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in some people , prefer natural seasoning. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , choose fresh soups where possible.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['digestive system','cardiovascular system','metabolic system','liver']
  },
  {
    name: 'Hershey\'s Kisses (Small Pack)',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Cocoa', 'Milk Solids', 'Emulsifier', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , added sugar and will affect the organs pancreas & teeth , limit intake. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially when cocoa % is higher , prefer dark options. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high amounts , pick low-fat variants. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , prefer minimal-additive chocolates. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in susceptible individuals , use natural flavors.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['pancreas','teeth','heart','digestive system','nervous system']
  },
  {
    name: 'Dabur Hajmola (Tablet)',
    category: 'digestive',
    ingredients: ingredients.filter(i =>
      ['Herbal Extracts', 'Sugar', 'Salt', 'Spices'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Herbal Extracts , traditional digestive aids and will affect the organs digestive system beneficially in many people , consult if on medications. Sugar , added sugar and will affect the organs pancreas & teeth if present , limit sugar. Salt , excess sodium and will affect the organs cardiovascular system , avoid excess. Spices , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , use natural spices.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['digestive system','pancreas','teeth','cardiovascular system']
  },
  {
    name: 'Maggi Tomato (Ketchup Sachet)',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Tomato Concentrate', 'Sugar', 'Vinegar', 'Salt', 'Spices', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Tomato Concentrate , source of lycopene and will affect the organs digestive & cardiovascular systems beneficially , use real tomatoes where possible. Sugar , added sugar and will affect the organs pancreas & teeth , use reduced-sugar ketchup. Vinegar , acidic agent and may affect the organs digestive system in sensitive people , use in moderation. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Spices , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , use natural spices. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , prefer preservative-free condiments.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['digestive system','cardiovascular system','pancreas','teeth','liver']
  },
  {
    name: 'Parle Monaco (Butter)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Butter', 'Salt', 'Leavening Agent', 'Sugar'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , use whole-wheat flour instead. Butter , saturated fat and will affect the organs heart when consumed frequently , use light spreads. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Leavening Agent , may cause bloating and will affect the organs digestive system , prefer natural leavening. Sugar , added sugar and will affect the organs pancreas & teeth , use minimal natural sweeteners instead.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','heart','cardiovascular system','digestive system','pancreas','teeth']
  },
  {
    name: 'Britannia NutriChoice Oats Marie',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Whole Wheat Flour', 'Oats', 'Sugar', 'Edible Vegetable Oil', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Whole Wheat Flour , fiber-rich carb and will affect the organs digestive & metabolic systems beneficially , use whole-wheat products. Oats , soluble fiber and will affect the organs heart & digestive system beneficially , use rolled oats. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Edible Vegetable Oil , source of fat and will affect the organs heart depending on fat profile , prefer unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt.",
    severityCounts: { low: 4, medium: 1, high: 0 },
    organsAffected: ['digestive system','metabolic system','heart','pancreas','teeth','cardiovascular system']
  },
  {
    name: 'Sunfeast Dark Fantasy (Choco Creme)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Vegetable Oil', 'Cocoa Solids', 'Cream Powder', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , prefer whole-grain flour. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Vegetable Oil , frying/added fat and will affect the organs heart depending on type , avoid hydrogenated oils. Cocoa Solids , antioxidant potential when high-percentage and will affect the organs heart & nervous system beneficially , choose higher-cocoa options. Cream Powder , dairy fat & lactose and will affect the organs heart & digestive system in high intake , use low-fat alternatives. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer fresh products.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system','liver','nervous system']
  },
  {
    name: 'Maggi Oats Noodles (Masala)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Oats', 'Vegetable Oil', 'Tastemaker', 'Salt', 'Preservative', 'MSG'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fiber and will affect the organs heart & digestive system beneficially compared to refined flour , use whole oats. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , prefer unsaturated oils. Tastemaker , flavor additives that may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , use fresh seasoning. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer fresh meals. MSG , flavor enhancer that may trigger sensitivity in some and will affect the organs nervous & digestive systems in susceptible individuals , opt for MSG-free options if needed.",
    severityCounts: { low: 3, medium: 3, high: 0 },
    organsAffected: ['heart','digestive system','cardiovascular system','liver','nervous system','immune system']
  },
  {
    name: 'Lays Salt & Vinegar',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Potato', 'Vegetable Oil', 'Salt', 'Vinegar Powder', 'Flavorings'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potato , starchy vegetable and when fried will affect the organs metabolic system , prefer baked options. Vegetable Oil , frying oil and will affect the organs heart depending on type , avoid hydrogenated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Vinegar Powder , acidic flavoring and may irritate sensitive digestive systems and will affect the organs digestive system in some people , use fresh acidulants. Flavorings , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive individuals , choose natural seasonings.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','cardiovascular system','digestive system','immune system']
  },
  {
    name: 'Amul Kool (Strawberry)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Sugar', 'Strawberry Flavor', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy containing fat & lactose and will affect the organs heart & digestive system in full-fat forms , choose toned milk. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Strawberry Flavor , flavoring may cause sensitivities and will affect the organs digestive or immune systems in susceptible individuals , prefer natural fruit. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , choose fresh beverages.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','pancreas','teeth','liver','immune system']
  },
  {
    name: 'Quaker Oats (Apple Cinnamon Cup)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Oats', 'Sugar', 'Dried Apple', 'Cinnamon', 'Salt', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fiber and will affect the organs heart & digestive system beneficially , prefer plain oats with fresh fruit. Sugar , added sugar and will affect the organs pancreas & teeth if present , reduce sugar. Dried Apple , concentrated sugar & fiber and will affect the organs teeth & digestive system if overused , use fresh apple. Cinnamon , may help glycemic control in moderation and will affect the organs metabolic & cardiovascular systems beneficially , prefer true cinnamon. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , choose natural flavors.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','pancreas','teeth','cardiovascular system','immune system']
  },
  {
    name: 'Nutella Mini (Single Serve)',
    category: 'spreads',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Hazelnuts', 'Vegetable Oil', 'Cocoa', 'Skimmed Milk Powder', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , very high added sugar and will affect the organs pancreas & teeth , reduce portions. Hazelnuts , healthy fats & minerals and will affect the organs heart & metabolic system beneficially in moderation , prefer more nut content. Vegetable Oil , added fats and will affect the organs heart depending on type , choose spreads with better fat profiles. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially when quality is high , prefer higher-cocoa. Skimmed Milk Powder , dairy protein and will affect the organs digestive system in lactose-intolerant individuals , use lactose-free versions if necessary. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , choose low-additive spreads.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['pancreas','teeth','heart','digestive system','nervous system']
  },
  {
    name: 'Cadbury Bournville (Dark)',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Cocoa Solids', 'Cocoa Butter', 'Sugar', 'Emulsifier', 'Vanilla'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Cocoa Solids , high antioxidant potential and will affect the organs heart & nervous system beneficially in high-percentage dark chocolate , prefer high-cocoa options. Cocoa Butter , fat component and will affect the organs heart depending on total intake , eat in moderation. Sugar , added sugar and will affect the organs pancreas & teeth , minimize sugar. Emulsifier , processing aid and will affect the organs digestive system in sensitive people , pick minimal-additive chocolate. Vanilla , flavoring and will affect the organs digestive/immune system minimally , prefer natural vanilla.",
    severityCounts: { low: 3, medium: 1, high: 0 },
    organsAffected: ['heart','nervous system','pancreas','teeth']
  },
  {
    name: 'Kissan Real Fruit Jam (Strawberry)',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Strawberry Pulp', 'Sugar', 'Pectin', 'Acidity Regulator', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Strawberry Pulp , fruit nutrients & fiber and will affect the organs digestive & immune systems beneficially when fresh , prefer fresh fruit. Sugar , added sugar and will affect the organs pancreas & teeth , reduce added sugar. Pectin , gelling agent and will affect the organs digestive system beneficially in moderation , use natural pectin. Acidity Regulator , stabilizes pH and may irritate some digestive tracts and will affect the organs digestive system in sensitive people , prefer natural acidulants. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , choose preservative-free preserves.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['digestive system','immune system','pancreas','teeth','liver']
  },
  {
    name: 'Pringles Cheddar Cheese',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Potato Flakes', 'Vegetable Oil', 'Cheddar Cheese Powder', 'Salt', 'Flavorings', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potato Flakes , processed carb and will affect the organs metabolic system , prefer whole potatoes. Vegetable Oil , added fats and will affect the organs heart depending on type , choose unsaturated oils. Cheddar Cheese Powder , dairy fat & sodium and will affect the organs heart & cardiovascular system in high intake , prefer minimal cheese flavoring. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Flavorings , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , choose natural seasonings. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free snacks.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','cardiovascular system','digestive system','liver']
  },
  {
    name: 'Amul Cheese Single Slice (Plain)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Emulsifier', 'Salt', 'Preservative', 'Color'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy saturated fat & lactose and will affect the organs heart & digestive system in high intake , choose low-fat cheese. Emulsifier , processing aid that may affect gut microbiota and will affect the organs digestive system in sensitive people , prefer natural cheeses. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick fresh cheese. Color , additives may cause sensitivities and will affect the organs skin & immune system in susceptible individuals , choose color-free options.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','cardiovascular system','liver','skin']
  },
  {
    name: 'Tata Tea Agni (Strong)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Black Tea Leaves (Strong)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Black Tea Leaves (Strong) , caffeinated & antioxidant beverage and will affect the organs nervous & cardiovascular systems depending on intake , drink in moderation or choose lighter brews if sensitive.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['nervous system','cardiovascular system']
  },
  {
    name: 'Britannia Cheese Cubes',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Salt', 'Culture', 'Preservatives', 'Anti-caking Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy source with saturated fat & lactose and will affect the organs heart & digestive system in high intake , choose low-fat options. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Culture , fermentation may aid digestibility and will affect the organs digestive system beneficially in some cases , prefer cultured cheeses. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free cheese. Anti-caking Agent , processing aid and will affect the organs digestive system minimally in sensitive people , prefer minimally processed options.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Maggi Noodles (Oats - Family Pack)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Oats', 'Vegetable Oil', 'Tastemaker', 'Salt', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fiber and will affect the organs heart & digestive system beneficially compared to refined flour , use whole oats. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , pick unsaturated oils. Tastemaker , contains additives that may affect sensitive people and will affect the organs digestive or immune systems in some individuals , choose fresh spices. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer preservative-free meals.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','cardiovascular system','liver','immune system']
  },
  {
    name: 'Kurkure (Mast Masala)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Corn Meal', 'Vegetable Oil', 'Salt', 'Spice Mix', 'Flavor Enhancers', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Corn Meal , processed carb and will affect the organs metabolic system , use whole-grain alternatives. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , prefer high-oleic oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Spice Mix , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , choose natural spices. Flavor Enhancers , additives may trigger sensitivities and will affect the organs nervous & digestive systems in susceptible people , opt for clean-label seasonings. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer preservative-free snacks.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Tropicana Apple (No Sugar Small)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Apple Juice (100%)', 'Vitamin C (Fortified)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Apple Juice (100%) , natural vitamins & natural sugar and will affect the organs pancreas & teeth if overconsumed , prefer whole fruit. Vitamin C (Fortified) , antioxidant & immune support and will affect the organs immune system beneficially when deficient , maintain balanced intake.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['pancreas','teeth','immune system']
  },
  {
    name: 'Bournvita (Kids Pack)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Malted Barley', 'Sugar', 'Milk Solids', 'Vitamins & Minerals', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Malted Barley , carbohydrate source and will affect the organs metabolic system depending on portion , use in moderation. Sugar , added sugar and will affect the organs pancreas & teeth , choose reduced-sugar options. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high-fat variants , use toned milk. Vitamins & Minerals , fortification beneficial and will affect the organs overall nutrition positively where deficient , follow pediatric guidance. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive children , prefer mild flavoring.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system','immune system']
  },
  {
    name: 'Amul Dahi (Curd - Home Pack)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Live Cultures'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , source of protein & calcium with some saturated fat & lactose and will affect the organs heart & digestive system depending on fat content , choose toned variants if needed. Live Cultures , probiotics and will affect the organs digestive & immune systems beneficially in many users , prefer natural curd with live culture.",
    severityCounts: { low: 2, medium: 0, high: 0 },
    organsAffected: ['digestive system','immune system','heart']
  },
  {
    name: 'Nestle KitKat (Mini Pack)',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour (Wafers)', 'Sugar', 'Vegetable Oil', 'Cocoa', 'Milk Solids', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb in wafers and will affect the organs metabolic system , use whole-grain wafers if available. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Vegetable Oil , added fats and will affect the organs heart depending on type , avoid hydrogenated oils. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially in quality cocoa , prefer dark cocoa when possible. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system , choose lower-fat dairy. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , pick minimal-additive chocolates.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system','nervous system']
  },
  {
    name: 'Kellogg\'s All-Bran (Fruit & Nut)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Wheat Bran', 'Dried Fruit', 'Nuts', 'Sugar (small)', 'Vitamins'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Wheat Bran , high fiber and will affect the organs digestive system beneficially , include bran cereals. Dried Fruit , concentrated sugars & fiber and will affect the organs teeth & digestive system if overused , prefer fresh fruit. Nuts , healthy fats & minerals and will affect the organs heart & metabolic system beneficially in moderation , choose unsalted nuts. Sugar (small) , added sugar and will affect the organs pancreas & teeth if present , minimize added sugar. Vitamins , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['digestive system','teeth','heart','metabolic system']
  },
  {
    name: 'Amul Mithai Mate (Small Kaju Burfi)',
    category: 'sweets',
    ingredients: ingredients.filter(i =>
      ['Cashew', 'Sugar', 'Milk Solids', 'Ghee', 'Cardamom'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Cashew , nutritious nuts rich in fats & minerals and will affect the organs heart & metabolic system beneficially in moderation , prefer unsalted nuts. Sugar , added sugar and will affect the organs pancreas & teeth , limit intake. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high intake , use sparingly. Ghee , saturated fat and will affect the organs heart when consumed frequently , use small amounts. Cardamom , digestive aid and will affect the organs digestive system positively in moderation , use real cardamom.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['heart','metabolic system','pancreas','teeth','digestive system']
  },
  {
    name: 'Haldiram\'s Mixed Namkeen (Small)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Lentils', 'Peanuts', 'Spices', 'Vegetable Oil', 'Salt', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Lentils , plant protein & fiber and will affect the organs digestive & metabolic systems beneficially , eat as protein-rich snack. Peanuts , healthy fats & protein and will affect the organs heart & metabolic system beneficially in moderation , prefer roasted unsalted. Spices , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , use natural spices. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , choose healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free mixes.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['digestive system','metabolic system','heart','cardiovascular system','liver']
  },
  {
    name: 'Tata Salt (Table - Bulk)',
    category: 'staples',
    ingredients: ingredients.filter(i =>
      ['Salt', 'Iodine'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Salt , essential electrolyte but excess affects blood pressure and will affect the organs cardiovascular system , use in moderation. Iodine , essential for thyroid and will affect the organs endocrine system beneficially when required , use iodised salt where deficiency risk exists.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['cardiovascular system','endocrine system']
  },
  {
    name: 'Maggi Masala (2-Minute Noodles Multipack)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Tastemaker', 'Salt', 'MSG', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , favor whole-grain varieties. Vegetable Oil , frying oil and will affect the organs heart depending on type & reuse , prefer unsaturated oils. Tastemaker , flavor additives that may affect sensitive individuals and will affect the organs digestive or immune systems in susceptible people , use fresh spices. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. MSG , flavor enhancer that may trigger sensitivity in some and will affect the organs nervous & digestive systems in sensitive individuals , choose no-MSG if necessary. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer freshly prepared foods.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','nervous system','liver']
  },
  {
    name: 'Britannia Little Hearts (Choco)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Vegetable Oil', 'Cocoa', 'Milk Solids', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-wheat alternatives. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Vegetable Oil , added fat and will affect the organs heart depending on type , avoid hydrogenated oils. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially in quality cocoa , prefer higher-cocoa. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system , choose low-fat dairy. Leavening Agent , may cause gas and will affect the organs digestive system , use natural leavening.",
    severityCounts: { low: 3, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system','nervous system']
  },
  {
    name: 'Amul Chocolate (Bar Small)',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Cocoa', 'Milk Solids', 'Emulsifier', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , added sugar and will affect the organs pancreas & teeth , reduce portions. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially when quality is high , prefer higher-cocoa chocolate. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high intake , choose lower-fat variants. Emulsifier , processing aid that may affect gut microbiota and will affect the organs digestive system in sensitive people , pick minimal-additive options. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in susceptible individuals , choose natural flavors.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['pancreas','teeth','heart','digestive system','nervous system']
  },
  {
    name: 'Kellogg\'s Chocos (Snack Pack)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Cocoa', 'Emulsifier', 'Vitamins & Minerals'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , choose whole-grain cereals. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially in quality cocoa , prefer higher-cocoa products. Emulsifier , processing aid that may affect gut microbiota and will affect the organs digestive system in sensitive people , look for minimal additives. Vitamins & Minerals , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Nestle Everyday (Tea Whitener)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Vegetable Oils', 'Stabilizer', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids , dairy nutrients that include saturated fat & lactose and will affect the organs heart & digestive system depending on fat content , prefer toned milk. Vegetable Oils , added fats and will affect the organs heart depending on type , choose unsaturated oils. Stabilizer , processing aid and will affect the organs digestive system minimally in sensitive people , choose simple formulations. Emulsifier , processing aid that may impact gut microbiota in some and will affect the organs digestive system , opt for minimal-additive products.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','metabolic system']
  },
  {
    name: 'Hershey\'s Syrup (Chocolate)',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Cocoa', 'Corn Syrup', 'Flavor', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , high added sugar and will affect the organs pancreas & teeth , limit usage. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially when cocoa is higher-quality , prefer better cocoa. Corn Syrup , high glycemic sweetener and will affect the organs metabolic system & pancreas , use natural sweeteners. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , choose natural flavoring. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer preservative-free syrups.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['pancreas','teeth','metabolic system','heart','liver']
  },
  {
    name: 'Tata Sampann Rice Bran Oil (Cooking)',
    category: 'cooking fat',
    ingredients: ingredients.filter(i =>
      ['Rice Bran Oil'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Rice Bran Oil , predominantly unsaturated fats with beneficial components and will affect the organs heart beneficially when used in place of saturated fats , use as a healthier cooking oil alternative.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['heart','metabolic system']
  },
  {
    name: 'Amul Cheese (Mozzarella Block)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Salt', 'Culture', 'Anti-caking Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy containing saturated fat & lactose and will affect the organs heart & digestive system in high amounts , choose lower-fat options if needed. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Culture , fermentation may aid digestibility and will affect the organs digestive system beneficially in some cases , prefer cultured cheeses. Anti-caking Agent , processing aid and will affect the organs digestive system minimally in sensitive people , choose minimally processed cheese where possible.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['heart','digestive system','cardiovascular system']
  },
  {
    name: 'Britannia Milk Toast',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Milk Solids', 'Sugar', 'Vegetable Oil', 'Salt', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , use whole-wheat bread if possible. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system , choose low-fat options. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Vegetable Oil , added fats and will affect the organs heart depending on type , avoid hydrogenated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Leavening Agent , may cause gas and will affect the organs digestive system , use natural leavening when possible.",
    severityCounts: { low: 3, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','pancreas','teeth']
  },
  {
    name: 'Parle Krack Jack (Sweet)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Butter', 'Salt', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , use whole-wheat flour instead. Sugar , added sugar and will affect the organs pancreas & teeth , use minimal natural sweeteners instead. Butter , saturated fat and will affect the organs heart when consumed often , use light spreads instead. Salt , excess sodium and will affect the organs cardiovascular system , use limited iodised salt instead. Leavening Agent , may cause bloating and will affect the organs digestive system , use natural leavening instead.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','cardiovascular system','digestive system']
  },
  {
    name: 'Sunfeast Marielight',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Whole Wheat Flour', 'Sugar (reduced)', 'Vegetable Oil', 'Salt', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Whole Wheat Flour , high fibre and will affect the organs digestive & metabolic systems beneficially , use whole-wheat products instead. Sugar (reduced) , lower added sugar but still contributes to sugar load and will affect the organs pancreas & teeth , use fruit purees instead. Vegetable Oil , added fat and will affect the organs heart depending on fat profile , use unsaturated oils instead. Salt , excess sodium and will affect the organs cardiovascular system , limit salt instead. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , choose minimal-additive items instead.",
    severityCounts: { low: 4, medium: 1, high: 0 },
    organsAffected: ['digestive system','metabolic system','pancreas','teeth','heart','cardiovascular system']
  },
  {
    name: 'Britannia 50-50 (Butter & Chocolate)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Butter', 'Cocoa', 'Milk Solids', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , use whole-wheat flour instead. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar or use fruit instead. Butter , saturated fat and will affect the organs heart if frequent , use light spreads instead. Cocoa , antioxidant potential depending on cocoa % and will affect the organs heart & nervous system beneficially in higher-cocoa products , choose higher-cocoa options. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system , use low-fat dairy instead. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , pick minimal-additive versions instead.",
    severityCounts: { low: 2, medium: 4, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system','nervous system']
  },
  {
    name: 'Lays Fiery Chilli',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Potato', 'Vegetable Oil', 'Chilli Powder', 'Salt', 'Flavorings', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potato , starchy food and when fried will affect the organs metabolic system , bake potatoes instead. Vegetable Oil , frying oil and will affect the organs heart depending on type & reuse , use high-oleic oils instead. Chilli Powder , spicy agent that may irritate some digestive tracts and will affect the organs digestive system , use milder spice instead. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt instead. Flavorings , additives may cause sensitivities and will affect the organs digestive or immune systems in susceptible people , use natural seasonings instead. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free snacks instead.",
    severityCounts: { low: 1, medium: 4, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','immune system','liver']
  },
  {
    name: 'Nestle Maggi Masala (Single Sachet)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Tastemaker (Spice Mix)', 'Salt', 'MSG', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-grain noodles instead. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , choose unsaturated oils instead. Tastemaker (Spice Mix) , contains additives that may affect sensitive people and will affect the organs digestive or immune systems , use fresh spices instead. Salt , excess sodium and will affect the organs cardiovascular system , limit salt instead. MSG , flavor enhancer that may trigger sensitivity in some and will affect the organs nervous & digestive systems in susceptible individuals , choose MSG-free options instead. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer freshly prepared meals instead.",
    severityCounts: { low: 2, medium: 4, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','nervous system','liver']
  },
  {
    name: 'Coke Zero (Can)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Carbonated Water', 'Artificial Sweetener', 'Caffeine', 'Color', 'Phosphoric Acid', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Carbonated Water , may cause bloating and will affect the organs digestive system , prefer still water instead. Artificial Sweetener , low-calorie substitute that may affect gut microbiota in some and will affect the organs digestive & metabolic systems in sensitive people , prefer minimal sweeteners instead. Caffeine , stimulant and will affect the organs nervous & cardiovascular systems in high intake , limit consumption instead. Color , additive that may cause sensitivities and will affect the organs digestive or immune systems in some individuals , choose fewer-additive drinks instead. Phosphoric Acid , acidity regulator and may affect bone mineral balance with chronic high intake and will affect the organs skeletal & renal systems , use natural acidulants instead. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , minimize frequent intake instead.",
    severityCounts: { low: 1, medium: 4, high: 0 },
    organsAffected: ['digestive system','metabolic system','nervous system','cardiovascular system','skeletal system','renal system','liver','immune system']
  },
  {
    name: 'Britannia Marie Light (Sugar Free)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Artificial Sweetener', 'Vegetable Oil', 'Salt', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , use whole-wheat flour instead. Artificial Sweetener , low-calorie sweetener that may affect gut microbiota in some and will affect the organs digestive & metabolic systems in sensitive individuals , prefer minimal sweetening. Vegetable Oil , added fat and will affect the organs heart depending on type , use unsaturated oils instead. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Leavening Agent , may cause gas and will affect the organs digestive system , use natural leavening instead.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','digestive system','heart','cardiovascular system']
  },
  {
    name: 'Amul Gold Butter (Block)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Cream', 'Salt', 'Preservative', 'Color'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Cream , concentrated saturated fat and will affect the organs heart when consumed in excess , use light spreads instead. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Preservative , prolongs shelf life and will affect the organs liver & digestive system with chronic exposure , choose fresh butter instead. Color , additives may cause sensitivities and will affect the organs skin & immune system in some people , pick color-free options instead.",
    severityCounts: { low: 1, medium: 2, high: 0 },
    organsAffected: ['heart','cardiovascular system','liver','skin','immune system']
  },
  {
    name: 'Quaker Instant Oats (Masala)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Oats', 'Spice Mix', 'Salt', 'Dehydrated Vegetables', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fiber and will affect the organs heart & digestive system beneficially , use rolled/steel-cut oats where possible. Spice Mix , flavouring & digestive stimulation and will affect the organs digestive system positively in moderation , prefer natural spices. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Dehydrated Vegetables , convenient nutrients but processed and will affect the organs digestive system moderately , choose fresh vegetables when possible. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in some people , prefer natural flavoring.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','cardiovascular system','immune system']
  },
  {
    name: 'Nutrela Soya Chunks (Plain Pack)',
    category: 'protein',
    ingredients: ingredients.filter(i =>
      ['Textured Soya Protein'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Textured Soya Protein , high plant-protein and will affect the organs muscular & metabolic systems beneficially as a vegetarian protein source , use as part of balanced diet instead.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['muscular system','metabolic system']
  },
  {
    name: 'Kissan Mango Jam',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Mango Pulp', 'Sugar', 'Pectin', 'Acidity Regulator', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Mango Pulp , fruit nutrients and will affect the organs digestive & immune systems beneficially when consumed as fruit , prefer whole fruit instead. Sugar , added sugar and will affect the organs pancreas & teeth , reduce added sugar. Pectin , gelling agent and will affect the organs digestive system beneficially in moderation , use natural pectin. Acidity Regulator , stabilizes pH and may irritate sensitive digestive tracts and will affect the organs digestive system in some people , use natural acidulants instead. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , choose preservative-free preserves when possible.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['digestive system','immune system','pancreas','teeth','liver']
  },
  {
    name: 'Bingo Tomato Twist',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Tomato Powder', 'Salt', 'Flavorings', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-grain alternatives instead. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , use unsaturated oils instead. Tomato Powder , processed flavoring and will affect the organs digestive system mildly , choose fresh tomatoes instead. Salt , excess sodium and will affect the organs cardiovascular system , limit salt instead. Flavorings , additives may cause sensitivities and will affect the organs digestive or immune systems in susceptible people , use natural seasonings instead. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free snacks instead.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver','immune system']
  },
  {
    name: 'Amul Powdered Milk (Toned)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Stabilizer', 'Vitamins', 'Anticaking Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids , dairy nutrients that contain lactose & some saturated fat and will affect the organs digestive & heart systems depending on fat content , choose toned variants if needed. Stabilizer , processing aid and will affect the organs digestive system minimally in sensitive individuals , prefer simple formulations. Vitamins , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet. Anticaking Agent , processing aid and will affect the organs digestive system minimally in some people , choose basic formulations instead.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['digestive system','heart','nutritional status']
  },
  {
    name: 'Kurkure (Masala Twist)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Corn Meal', 'Vegetable Oil', 'Salt', 'Spice Mix', 'Flavor Enhancers', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Corn Meal , processed carbohydrate and will affect the organs metabolic system , use whole-grain snacks instead. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , choose healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Spice Mix , flavour & digestive stimulation and will affect the organs digestive system positively in moderation , prefer natural spices. Flavor Enhancers , additives may trigger sensitivities and will affect the organs nervous & digestive systems in susceptible people , opt for clean-label seasonings. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free options instead.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Tropicana Guava (No Sugar)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Guava Pulp', 'Vitamin C', 'No Added Sugar'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Guava Pulp , rich in vitamin C & fiber and will affect the organs immune & digestive systems beneficially when consumed as whole fruit , prefer whole fruit. Vitamin C , antioxidant & immune support and will affect the organs immune system beneficially where deficient , maintain balanced intake. No Added Sugar , reduces added-sugar risk and will affect the organs pancreas & teeth beneficially compared to sugared drinks , choose 100% fruit options.",
    severityCounts: { low: 2, medium: 0, high: 0 },
    organsAffected: ['immune system','digestive system','pancreas','teeth']
  },
  {
    name: 'Haldiram\'s Aloo Bhujia (Small)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Gram Flour', 'Potato', 'Vegetable Oil', 'Salt', 'Spices', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Gram Flour , protein-rich legume flour and will affect the organs digestive & metabolic systems beneficially , include as protein-rich snack. Potato , starchy ingredient and when fried will affect the organs metabolic system , prefer baked alternatives. Vegetable Oil , frying oil and will affect the organs heart depending on type & reuse , choose unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Spices , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , prefer natural spices. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free snacks instead.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['digestive system','metabolic system','heart','cardiovascular system','liver']
  },
  {
    name: 'Britannia Good Day (Almond)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Vegetable Oil', 'Milk Solids', 'Almonds', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-grain flour instead. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Vegetable Oil , added fats and will affect the organs heart depending on type , prefer unsaturated oils. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system , choose low-fat dairy. Almonds , healthy fats & minerals and will affect the organs heart & metabolic system beneficially in moderation , prefer unsalted nuts. Leavening Agent , may cause gas and will affect the organs digestive system , use natural leavening if possible.",
    severityCounts: { low: 3, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Amul Cheese Cubes (Party Pack)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Salt', 'Preservatives', 'Anti-caking Agent', 'Culture'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy nutrient with saturated fat & lactose and will affect the organs heart & digestive system in high intake , choose lower-fat cheese. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free products. Anti-caking Agent , processing aid and will affect the organs digestive system minimally in sensitive people , prefer natural options. Culture , fermentation may aid digestibility and will affect the organs digestive system beneficially in some cases , opt for cultured cheeses.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Kellogg\'s Chocos (Family Box)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Cocoa', 'Emulsifier', 'Vitamins & Minerals'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , prefer whole-grain cereals. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially in quality cocoa , pick higher-cocoa options. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , look for minimal additives. Vitamins & Minerals , fortification helps nutrient status and will affect the organs overall nutrition beneficially where deficient , maintain balanced diet.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Peanut Butter (Crunchy)',
    category: 'spreads',
    ingredients: ingredients.filter(i =>
      ['Roasted Peanuts', 'Salt', 'Oil (if added)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Roasted Peanuts , rich in protein & healthy fats and will affect the organs heart & metabolic system beneficially in moderation , use 100% peanuts without additives. Salt , excess sodium and will affect the organs cardiovascular system , choose low-salt versions. Oil (if added) , extra fat and will affect the organs heart depending on type , use no-added-oil peanut butter where possible.",
    severityCounts: { low: 2, medium: 0, high: 0 },
    organsAffected: ['heart','metabolic system','cardiovascular system']
  },
  {
    name: 'Maggi Masala (Noodles Instant Pack)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Tastemaker', 'Salt', 'MSG', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , opt for whole-grain alternatives. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , choose unsaturated oils. Tastemaker , contains additives that may affect sensitive people and will affect the organs digestive or immune systems , use fresh spices. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. MSG , flavor enhancer that may trigger sensitivity in some and will affect the organs nervous & digestive systems in susceptible individuals , pick MSG-free options if concerned. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , prefer freshly prepared meals.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','nervous system','liver']
  },
  {
    name: 'Tropicana Mixed Fruit (Small)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Mixed Fruit Juice', 'Vitamin C', 'No Added Sugar'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Mixed Fruit Juice , nutrient-rich but concentrated sugar and will affect the organs pancreas & teeth if overconsumed , prefer whole fruits. Vitamin C , antioxidant & immune support and will affect the organs immune system beneficially when deficient , maintain balanced intake. No Added Sugar , reduces added-sugar risk and will affect the organs pancreas & teeth beneficially compared to sugared drinks , choose unsweetened juice options.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['pancreas','teeth','immune system']
  },
  {
    name: 'Bournvita (Family Jar)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Malted Barley', 'Sugar', 'Milk Solids', 'Vitamins & Minerals', 'Flavor', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Malted Barley , carbohydrate source and will affect the organs metabolic system depending on portion , use sparingly. Sugar , added sugar and will affect the organs pancreas & teeth , pick reduced-sugar alternatives. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high intake , use toned milk. Vitamins & Minerals , fortification beneficial and will affect the organs overall nutrition positively where deficient , follow label guidance. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in some people , prefer natural flavors. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , choose low-additive formulations.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system','immune system']
  },
  {
    name: 'Amul Taaza (Small Tetra)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Stabilizer', 'Vitamins'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , source of protein & calcium but contains lactose and some saturated fat and will affect the organs digestive & heart systems depending on fat content , choose toned milk if needed. Stabilizer , processing aid and will affect the organs digestive system minimally in sensitive people , prefer simple formulations. Vitamins , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['digestive system','heart','nutritional status']
  },
  {
    name: 'Hershey\'s Kisses (Party Pack)',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Cocoa', 'Milk Solids', 'Emulsifier', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , added sugar and will affect the organs pancreas & teeth , limit portions. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially when cocoa % is higher , prefer dark chocolate. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in large intake , choose low-fat options. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , look for minimal-additive chocolate. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in susceptible people , prefer natural flavors.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['pancreas','teeth','heart','digestive system','nervous system']
  },
  {
    name: 'Knorr Veg Soup (Instant Cup)',
    category: 'ready meals',
    ingredients: ingredients.filter(i =>
      ['Dehydrated Vegetables', 'Salt', 'Starch', 'Flavor', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Dehydrated Vegetables , convenient nutrients but processed and will affect the organs digestive system moderately , prefer fresh vegetables. Salt , excess sodium and will affect the organs cardiovascular system , choose low-sodium options. Starch , thickener and may affect glycemic load if refined and will affect the organs metabolic system , use whole-food thickeners. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in some people , prefer natural seasoning. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick fresh soups when possible.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['digestive system','cardiovascular system','metabolic system','liver','immune system']
  },
  {
    name: 'Bikano Mathri (Classic)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Ghee', 'Salt', 'Spices', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-grain alternatives. Ghee , concentrated saturated fat and will affect the organs heart adversely when consumed frequently , use sparingly. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Spices , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , prefer natural spices. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , select preservative-free snacks.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Parachute Coconut Oil (Small Bottle)',
    category: 'personal care/food',
    ingredients: ingredients.filter(i =>
      ['Coconut Oil'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Coconut Oil , saturated tropical fat used topically & for cooking and will affect the organs heart if used excessively in diet , use in moderation and prefer unsaturated oils for daily cooking.",
    severityCounts: { low: 0, medium: 1, high: 0 },
    organsAffected: ['heart']
  },
  {
    name: 'Dalda (Small Tin)',
    category: 'cooking fat',
    ingredients: ingredients.filter(i =>
      ['Hydrogenated Vegetable Oil', 'Emulsifier', 'Antioxidant'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Hydrogenated Vegetable Oil , may contain trans/saturated fats and will affect the organs heart adversely with prolonged intake , avoid hydrogenated fats and use unrefined unsaturated oils instead. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , pick single-ingredient oils instead. Antioxidant , prevents rancidity and will affect the organs cellular health minimally beneficially , choose minimally processed oils instead.",
    severityCounts: { low: 1, medium: 1, high: 1 },
    organsAffected: ['heart','digestive system','cellular health']
  },
  {
    name: 'Tata Sampann Toor Dal',
    category: 'staples',
    ingredients: ingredients.filter(i =>
      ['Toor Dal (Split Pigeon Pea)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Toor Dal , high-quality plant protein & fibre and will affect the organs digestive & metabolic systems beneficially , use as staple protein source instead.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['digestive system','metabolic system']
  },
  {
    name: 'Amul Mithai Mate (Rasgulla Pack)',
    category: 'sweets',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Sugar', 'Cardamom', 'Stabilizer'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high intake , use sparingly. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Cardamom , digestive spice and will affect the organs digestive system positively in moderation , prefer whole cardamom. Stabilizer , processing aid and will affect the organs digestive system minimally in sensitive people , use natural thickeners instead.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','pancreas','teeth']
  },
  {
    name: 'Horlicks (Lite)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Malted Barley', 'Oats', 'Sugar (reduced)', 'Milk Solids', 'Vitamins & Minerals'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Malted Barley , carbohydrate source and will affect the organs metabolic system depending on portion , use in moderation. Oats , soluble fiber and will affect the organs heart & digestive system beneficially , prefer whole oats. Sugar (reduced) , lower added sugar but still contributes to sugar load and will affect the organs pancreas & teeth , reduce further. Milk Solids , dairy nutrients with lactose and saturated fat and will affect the organs heart & digestive system in high intake , choose toned milk. Vitamins & Minerals , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','pancreas','teeth']
  },
  {
    name: 'Britannia Milk Bikis (Family Pack)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Milk Solids', 'Vegetable Oil', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , use whole-wheat alternatives. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system , choose low-fat dairy. Vegetable Oil , added fat and will affect the organs heart depending on type , avoid hydrogenated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt intake.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system','cardiovascular system']
  },
  {
    name: 'Pringles Salt & Vinegar (Large)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Potato Flakes', 'Vegetable Oil', 'Salt', 'Vinegar Powder', 'Flavorings', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potato Flakes , processed carbohydrate and will affect the organs metabolic system , use whole potatoes instead. Vegetable Oil , added fats and will affect the organs heart depending on type , prefer unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Vinegar Powder , acidic flavoring and may affect the organs digestive system in sensitive people , use natural acidulants. Flavorings , additives may cause sensitivities and will affect the organs digestive or immune systems in susceptible individuals , choose natural flavoring. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free snacks.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','cardiovascular system','digestive system','immune system','liver']
  },
  {
    name: 'Amul Paneer Cubes (Vacuum Pack)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Salt', 'Acidity Regulator', 'Preservative (if any)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy protein & calcium but contains saturated fat & lactose and will affect the organs heart & digestive system depending on fat content , prefer low-fat paneer if needed. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Acidity Regulator , stabilizes pH and may affect the organs digestive system in some people , use natural acidulants. Preservative (if any) , extends shelf life and will affect the organs liver & digestive system with chronic exposure , choose preservative-free fresh paneer instead.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['digestive system','heart','cardiovascular system','liver']
  },
  {
    name: 'Kellogg\'s Muesli (Regular)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Oats', 'Dried Fruit', 'Nuts', 'Sugar (small)', 'Salt', 'Vitamins'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fiber and will affect the organs heart & digestive system beneficially , prefer rolled oats. Dried Fruit , concentrated sugars & fiber and will affect the organs teeth & digestive system if overused , use fresh fruit. Nuts , healthy fats & minerals and will affect the organs heart & metabolic system beneficially in moderation , opt for unsalted nuts. Sugar (small) , added sugar and will affect the organs pancreas & teeth if present , reduce added sugar. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Vitamins , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','teeth','pancreas','cardiovascular system']
  },
  {
    name: 'Maggi Tomato (Sachet Big)',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Tomato Concentrate', 'Sugar', 'Vinegar', 'Salt', 'Spices', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Tomato Concentrate , source of lycopene and will affect the organs digestive & cardiovascular systems beneficially when from real tomatoes , prefer fresh tomatoes. Sugar , added sugar and will affect the organs pancreas & teeth , reduce added sugar. Vinegar , acidic agent and may affect the organs digestive system in sensitive people , use in moderation. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Spices , flavor & digestive benefits and will affect the organs digestive system positively in moderation , use natural spices. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free condiments.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['digestive system','cardiovascular system','pancreas','teeth','liver']
  },
  {
    name: 'Dabur Honey (Family Jar)',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Honey'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Honey , natural sweetener but still sugar and will affect the organs teeth & pancreas if overused , use sparingly and avoid for infants under 1 year.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['teeth','pancreas']
  },
  {
    name: 'Tata Sampann Jeera Rice',
    category: 'staples',
    ingredients: ingredients.filter(i =>
      ['Basmati Rice', 'Jeera (Cumin)', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Basmati Rice , carbohydrate source and will affect the organs metabolic system depending on portion & processing , prefer wholegrain rice if possible. Jeera (Cumin) , digestive aid and will affect the organs digestive system beneficially in moderation , use whole cumin. Salt , excess sodium and will affect the organs cardiovascular system , limit salt.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['metabolic system','digestive system','cardiovascular system']
  },
  {
    name: 'Amul Cheese (Pasta Pack)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Salt', 'Emulsifiers', 'Anti-caking Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy nutrient with saturated fat & lactose and will affect the organs heart & digestive system in large intake , choose lower-fat alternatives when needed. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Emulsifiers , processing aids that may affect gut microbiota and will affect the organs digestive system in sensitive people , look for minimal-emulsifier versions. Anti-caking Agent , processing aid and will affect the organs digestive system minimally in some people , use simpler products if preferred.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','cardiovascular system']
  },
  {
    name: 'Kurkure (Nacho Flavour)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Corn Meal', 'Vegetable Oil', 'Salt', 'Cheese Powder', 'Flavor Enhancers', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Corn Meal , processed carbohydrate and will affect the organs metabolic system , use whole-grain alternatives. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , choose healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Cheese Powder , dairy-derived flavor with sodium & fats and will affect the organs heart & cardiovascular system in excess , prefer minimal cheese seasoning. Flavor Enhancers , additives may trigger sensitivities and will affect the organs nervous & digestive systems in susceptible people , opt for clean-label seasonings. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free snacks.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','cardiovascular system','digestive system','liver']
  },
  {
    name: 'Tropicana Orange (Small Bottle)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Orange Juice (100%)', 'Vitamin C'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Orange Juice (100%) , rich in vitamin C but concentrated natural sugars and will affect the organs pancreas & teeth if overconsumed , prefer whole fruit. Vitamin C , antioxidant & immune support and will affect the organs immune system beneficially where deficient , maintain balanced intake.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['pancreas','teeth','immune system']
  },
  {
    name: 'Britannia Cheese (Grated Small)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Salt', 'Preservatives', 'Anti-caking Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy nutrient containing saturated fat & lactose and will affect the organs heart & digestive system in high intake , choose low-fat cheese where appropriate. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free options. Anti-caking Agent , processing aid and will affect the organs digestive system minimally in sensitive people , use natural alternatives if possible.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Maggi Masala (Snack Noodles)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Tastemaker', 'Salt', 'MSG', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , select whole-grain options if available. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , prefer unsaturated oils. Tastemaker , contains additives that may affect sensitive individuals and will affect the organs digestive or immune systems , use fresh seasonings. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt intake. MSG , flavor enhancer that may trigger sensitivity in some and will affect the organs nervous & digestive systems in susceptible people , avoid if sensitive. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer freshly prepared meals.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','nervous system','liver']
  },
  {
    name: 'Hershey\'s Dark (58%)',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Cocoa Solids', 'Cocoa Butter', 'Sugar', 'Emulsifier', 'Vanilla'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Cocoa Solids , antioxidant potential and will affect the organs heart & nervous system beneficially at higher cocoa percentages , choose darker chocolate. Cocoa Butter , fat component and will affect the organs heart depending on intake , consume in moderation. Sugar , added sugar and will affect the organs pancreas & teeth , minimize sugar. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , prefer low-additive chocolate. Vanilla , flavoring and will affect the organs digestive/immune system minimally , use natural vanilla where possible.",
    severityCounts: { low: 3, medium: 1, high: 0 },
    organsAffected: ['heart','nervous system','pancreas','teeth']
  },
  {
    name: 'Tata Salt (Iodised Small)',
    category: 'staples',
    ingredients: ingredients.filter(i =>
      ['Salt', 'Iodine'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Salt , essential electrolyte but excess affects blood pressure and will affect the organs cardiovascular system , use in moderation. Iodine , essential for thyroid and will affect the organs endocrine system beneficially where needed , use iodised salt where deficiency risk exists.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['cardiovascular system','endocrine system']
  },
  {
    name: 'Amul Kool (Vanilla)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Sugar', 'Vanilla Flavor', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy fats & lactose and will affect the organs heart & digestive system in full-fat forms , choose toned milk. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Vanilla Flavor , synthetic flavor may cause sensitivities and will affect the organs digestive or immune systems in some people , prefer natural vanilla. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free beverages.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','pancreas','teeth','liver','immune system']
  },
  {
    name: 'Britannia NutriChoice Oats (Pack)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Oats', 'Whole Wheat Flour', 'Sugar (small)', 'Vegetable Oil', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fiber and will affect the organs heart & digestive system beneficially , use rolled oats. Whole Wheat Flour , high-fibre flour and will affect the organs digestive & metabolic systems beneficially , choose whole-wheat. Sugar (small) , added sugar and will affect the organs pancreas & teeth if present , reduce sugar. Vegetable Oil , added fat and will affect the organs heart depending on type , prefer unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt.",
    severityCounts: { low: 4, medium: 1, high: 0 },
    organsAffected: ['heart','digestive system','metabolic system','pancreas','teeth','cardiovascular system']
  },
  {
    name: 'Parle-G (Classic)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Edible Vegetable Oil', 'Milk Solids', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , use whole-wheat flour instead. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar or use fruit purée instead. Edible Vegetable Oil , source of fat and will affect the organs heart depending on fat type , use unsaturated oils instead. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system , choose low-fat milk solids. Salt , excess sodium and will affect the organs cardiovascular system , limit salt intake.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system','cardiovascular system']
  },
  {
    name: 'Sunfeast Rich Tea',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Vegetable Oil', 'Salt', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , use whole-grain flour instead. Sugar , added sugar and will affect the organs pancreas & teeth , use less sugar or natural sweeteners instead. Vegetable Oil , processing fat and will affect the organs heart depending on type , prefer unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Leavening Agent , may cause bloating and will affect the organs digestive system , prefer natural leavening.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system','cardiovascular system']
  },
  {
    name: 'Britannia Tiger (Milk)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Milk Solids', 'Sugar', 'Edible Vegetable Oil', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-wheat flour instead. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system , opt for low-fat milk solids. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Edible Vegetable Oil , added fat and will affect the organs heart depending on type , use unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','pancreas','teeth','cardiovascular system']
  },
  {
    name: 'Amul Cool Milk (Chocolate)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Sugar', 'Cocoa', 'Flavor', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy containing saturated fat & lactose and will affect the organs heart & digestive system in full-fat forms , use toned milk. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially in quality cocoa , prefer higher-cocoa alternatives. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in susceptible people , opt for natural flavoring. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , choose preservative-free beverages.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['heart','digestive system','pancreas','teeth','nervous system','liver']
  },
  {
    name: 'Nestle Everyday (Milkmaid Sachet)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Sugar', 'Stabilizer'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids , concentrated dairy nutrients with saturated fat & lactose and will affect the organs heart & digestive system in high intake , use sparingly. Sugar , very high added sugar and will affect the organs pancreas & teeth , avoid frequent use. Stabilizer , processing aid and will affect the organs digestive system minimally in sensitive people , prefer simpler alternatives.",
    severityCounts: { low: 1, medium: 1, high: 1 },
    organsAffected: ['heart','digestive system','pancreas','teeth']
  },
  {
    name: 'Bingo (Cheese)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Cheese Powder', 'Salt', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , prefer whole-grain bases. Vegetable Oil , added fat and will affect the organs heart depending on type , pick unsaturated oils. Cheese Powder , dairy-derived flavor with sodium and fats and will affect the organs heart & cardiovascular system in high intake , choose minimal cheese seasoning. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , choose preservative-free snacks.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','cardiovascular system','liver','digestive system']
  },
  {
    name: 'Kellogg\'s Fruit & Fibre',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Whole Grain Cereal', 'Dried Fruit', 'Sugar (small)', 'Nuts', 'Vitamins & Minerals'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Whole Grain Cereal , high-fiber base and will affect the organs digestive & metabolic systems beneficially , prefer whole-grain cereals. Dried Fruit , concentrated natural sugars & fiber and will affect the organs teeth & digestive system if overused , use fresh fruit. Sugar (small) , added sugar and will affect the organs pancreas & teeth if present , minimize added sugar. Nuts , healthy fats & minerals and will affect the organs heart & metabolic system beneficially in moderation , choose unsalted nuts. Vitamins & Minerals , fortification beneficial and will affect the organs nutrient status positively where deficient , follow dietary guidance.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['digestive system','metabolic system','teeth','heart']
  },
  {
    name: 'Maggi Tomato (Family Bottle)',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Tomato Concentrate', 'Sugar', 'Vinegar', 'Salt', 'Spices', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Tomato Concentrate , source of lycopene and will affect the organs digestive & cardiovascular systems beneficially , prefer fresh tomatoes. Sugar , added sugar and will affect the organs pancreas & teeth , choose reduced-sugar ketchup. Vinegar , acidic agent and may irritate sensitive digestive tracts and will affect the organs digestive system , use in moderation. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Spices , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , use natural spices. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free condiments.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['digestive system','cardiovascular system','pancreas','teeth','liver']
  },
  {
    name: 'Tropicana Pomegranate (No Sugar)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Pomegranate Juice (100%)', 'Vitamin C'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Pomegranate Juice (100%) , antioxidant-rich but concentrated sugar and will affect the organs pancreas & teeth if overused , prefer whole fruit. Vitamin C , antioxidant & immune support and will affect the organs immune system beneficially where deficient , maintain balanced intake.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['pancreas','teeth','immune system']
  },
  {
    name: 'Hershey\'s Chocolate (Classic)',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Cocoa', 'Milk Solids', 'Emulsifier', 'Vanilla'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , added sugar and will affect the organs pancreas & teeth , reduce portions. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially in higher-cocoa content , prefer dark chocolate. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system , choose lower-fat options. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , opt for minimal-emulsifier chocolate. Vanilla , flavoring and will affect the organs digestive/immune system minimally in most people , use natural vanilla if possible.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['pancreas','teeth','heart','digestive system','nervous system']
  },
  {
    name: 'Pringles BBQ (Small)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Potato Flakes', 'Vegetable Oil', 'BBQ Flavor', 'Salt', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potato Flakes , processed carbohydrate and will affect the organs metabolic system , prefer whole potatoes. Vegetable Oil , added fats and will affect the organs heart depending on type , choose unsaturated oils. BBQ Flavor , additives & smoke flavor may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , choose natural seasonings. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free snacks.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','cardiovascular system','liver']
  },
  {
    name: 'Amul Cheese Singles (Value Pack)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Emulsifiers', 'Salt', 'Preservatives', 'Anti-caking Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy containing saturated fat & lactose and will affect the organs heart & digestive system in high intake , choose low-fat cheese options. Emulsifiers , processing aids that may affect gut microbiota and will affect the organs digestive system in sensitive people , prefer natural cheeses. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free cheese. Anti-caking Agent , processing aid and will affect the organs digestive system minimally in some people , use simpler products when possible.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Kurkure (Desi Masala)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Corn Meal', 'Vegetable Oil', 'Salt', 'Spice Mix', 'Flavor Enhancers', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Corn Meal , processed carbohydrate and will affect the organs metabolic system , prefer whole-grain snacks. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , opt for healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Spice Mix , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , use whole spices. Flavor Enhancers , additives may trigger sensitivities and will affect the organs nervous & digestive systems in susceptible people , choose clean-label seasonings. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free options.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Kissan Mixed Fruit Jam (Large)',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Fruit Pulp', 'Sugar', 'Pectin', 'Acidity Regulator', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Fruit Pulp , natural fruit nutrients and will affect the organs digestive & immune systems beneficially when fresh , prefer whole fruit. Sugar , added sugar and will affect the organs pancreas & teeth , reduce added sugar. Pectin , gelling agent that may aid digestion and will affect the organs digestive system positively in moderation , use natural pectin. Acidity Regulator , stabilizes pH and may irritate sensitive digestive tracts and will affect the organs digestive system in some people , use natural acidulants instead. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , choose preservative-free preserves.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['digestive system','immune system','pancreas','teeth','liver']
  },
  {
    name: 'Quaker Oats (Steel Cut)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Oats'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , high-fibre whole grain and will affect the organs heart & digestive system beneficially , use steel-cut or rolled oats regularly instead of instant refined cereals.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['heart','digestive system']
  },
  {
    name: 'Maggi Noodles (Masala Single)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Tastemaker', 'Salt', 'MSG', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , choose whole-grain noodles when possible. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , prefer unsaturated oils. Tastemaker , flavoring additives may cause sensitivities and will affect the organs digestive or immune systems in susceptible people , use fresh seasonings. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. MSG , flavor enhancer that may trigger sensitivity in some and will affect the organs nervous & digestive systems in sensitive individuals , avoid if concerned. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer freshly prepared meals.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','nervous system','liver']
  },
  {
    name: 'Dabur Honey (Squeezy)',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Honey'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Honey , natural sweetener but still sugar and will affect the organs teeth & pancreas if overused , use sparingly and never for infants under 1 year.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['teeth','pancreas']
  },
  {
    name: 'Amul Ghee (Small Jar)',
    category: 'cooking fat',
    ingredients: ingredients.filter(i =>
      ['Clarified Butter (Ghee)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Clarified Butter (Ghee) , rich in saturated fats and will affect the organs heart adversely when consumed in excess , use sparingly and prefer unsaturated oils for daily cooking.",
    severityCounts: { low: 0, medium: 1, high: 1 },
    organsAffected: ['heart']
  },
  {
    name: 'Tata Tea Premium (Tea Bags)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Black Tea Leaves', 'Natural Flavors'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Black Tea Leaves , source of caffeine & antioxidants and will affect the organs nervous & cardiovascular systems depending on intake , prefer moderate consumption. Natural Flavors , additives may cause sensitivities and will affect the organs digestive or immune systems in susceptible individuals , choose plain tea leaves.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['nervous system','cardiovascular system','immune system']
  },
  {
    name: 'Kurkure (Masala Chunkz)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Corn Meal', 'Vegetable Oil', 'Salt', 'Spice Mix', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Corn Meal , processed carbohydrate and will affect the organs metabolic system , prefer whole-grain snacks. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , pick healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Spice Mix , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , use true spices. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , choose preservative-free options.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Britannia Cheese (Creamy Spread)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Edible Vegetable Oil', 'Salt', 'Emulsifiers', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high intake , use low-fat spreads. Edible Vegetable Oil , added fats and will affect the organs heart depending on type , choose unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Emulsifiers , processing aids that may affect gut microbiota and will affect the organs digestive system in sensitive people , prefer minimal-emulsifier products. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free spreads.",
    severityCounts: { low: 2, medium: 3, high: 1 },
    organsAffected: ['heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Haldiram\'s Samosa (Frozen)',
    category: 'frozen foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Potato', 'Peas', 'Vegetable Oil', 'Salt', 'Spices'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-grain pastry where possible. Potato , starchy filling and will affect the organs metabolic system based on portion & cooking method , prefer baked versions. Peas , plant protein & fiber and will affect the organs digestive & metabolic systems beneficially , include vegetables. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , choose healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Spices , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , choose fresh spices.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','digestive system','heart','cardiovascular system']
  },
  {
    name: 'Kellogg\'s Corn Flakes (Family Box)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Corn Flakes', 'Sugar', 'Salt', 'Vitamins & Minerals', 'Malt Extract'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Corn Flakes , processed cereal with higher glycemic index and will affect the organs metabolic system , prefer whole-grain cereals. Sugar , added sugar and will affect the organs pancreas & teeth , choose low-sugar options. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Vitamins & Minerals , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet. Malt Extract , flavoring carbohydrate and will affect the organs metabolic system if used in excess , reduce added sweeteners.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','cardiovascular system']
  },
  {
    name: 'Nutella (Family Jar)',
    category: 'spreads',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Hazelnuts', 'Vegetable Oil', 'Cocoa', 'Skimmed Milk Powder', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , very high added sugar and will affect the organs pancreas & teeth , reduce portions. Hazelnuts , healthy fats & minerals and will affect the organs heart & metabolic system beneficially in moderation , choose higher-nut recipes. Vegetable Oil , added fats and will affect the organs heart depending on type , prefer spreads with unsaturated oils. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially in higher-quality cocoa , pick dark cocoa spreads if possible. Skimmed Milk Powder , dairy protein with low fat and will affect the organs digestive system in lactose-intolerant people , use lactose-free alternatives if required. Emulsifier , processing aid and may affect gut microbiota in sensitive people and will affect the organs digestive system , opt for minimal-additive spreads.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['pancreas','teeth','heart','digestive system','nervous system']
  },
  {
    name: 'Maggi Oats (Cup Veg)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Oats', 'Dehydrated Vegetables', 'Tastemaker', 'Salt', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fiber and will affect the organs heart & digestive system beneficially compared to refined flour , use whole oats. Dehydrated Vegetables , convenient nutrients but processed and will affect the organs digestive system moderately , prefer fresh vegetables when possible. Tastemaker , contains additives that may affect sensitive people and will affect the organs digestive or immune systems in susceptible individuals , use fresh spices. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer fresh food options.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Tropicana Mixed Fruit (Large)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Mixed Fruit Juice', 'Vitamin C', 'No Added Sugar'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Mixed Fruit Juice , vitamins present but concentrated natural sugars and will affect the organs pancreas & teeth if overconsumed , prefer whole fruits. Vitamin C , antioxidant & immune support and will affect the organs immune system beneficially where deficient , maintain balanced intake. No Added Sugar , reduces added-sugar load and will affect the organs pancreas & teeth beneficially compared to sugared drinks , choose 100% juice without added sugar.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['pancreas','teeth','immune system']
  },
  {
    name: 'Bournvita (Small Jar)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Malted Barley', 'Sugar', 'Milk Solids', 'Vitamins & Minerals', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Malted Barley , carbohydrate source and will affect the organs metabolic system depending on portion , use in moderation. Sugar , added sugar and will affect the organs pancreas & teeth , pick reduced-sugar options. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high intake , use toned milk. Vitamins & Minerals , fortification beneficial and will affect the organs nutrient status positively where deficient , follow recommended intake. Emulsifier , processing aid and may affect gut microbiota in sensitive people and will affect the organs digestive system , choose low-additive formulas.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Amul Mithai Mate (Rasgulla Single)',
    category: 'sweets',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Sugar', 'Stabilizer', 'Cardamom'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high intake , use sparingly. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Stabilizer , processing aid and will affect the organs digestive system minimally in sensitive individuals , prefer natural thickeners. Cardamom , natural spice and will affect the organs digestive system positively in moderation , use whole spice where possible.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','pancreas','teeth']
  },
  {
    name: 'Kellogg\'s Frosties (Family)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Corn Flakes', 'Sugar', 'Malt Extract', 'Vitamins & Minerals', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Corn Flakes , processed cereal and will affect the organs metabolic system (higher GI) , prefer whole-grain cereals. Sugar , added sugar and will affect the organs pancreas & teeth , minimize sugar. Malt Extract , flavoring & carbs and will affect the organs metabolic system if used in excess , reduce added sweeteners. Vitamins & Minerals , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet. Salt , excess sodium and will affect the organs cardiovascular system , limit salt.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','cardiovascular system']
  },
  {
    name: 'Pepsi (Party Bottle)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Carbonated Water', 'Sugar', 'Caffeine', 'Color', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Carbonated Water , may cause bloating and will affect the organs digestive system , prefer still water. Sugar , high added sugar and will affect the organs pancreas & teeth , limit sugary drinks. Caffeine , stimulant and will affect the organs nervous & cardiovascular systems in high intake , moderate consumption. Color , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , choose fewer-additive drinks. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , minimize intake.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['digestive system','pancreas','teeth','nervous system','cardiovascular system','liver']
  },
  {
    name: 'Dalda (Cooking Paste Jar)',
    category: 'cooking fat',
    ingredients: ingredients.filter(i =>
      ['Hydrogenated Vegetable Oil', 'Antioxidant', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Hydrogenated Vegetable Oil , may contain trans/saturated fats and will affect the organs heart adversely with prolonged intake , avoid hydrogenated fats and use unrefined unsaturated oils instead. Antioxidant , prevents rancidity and will affect the organs cellular health minimally beneficially , prefer minimally processed oils. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , choose single-ingredient oils instead.",
    severityCounts: { low: 1, medium: 1, high: 1 },
    organsAffected: ['heart','cellular health','digestive system']
  },
  {
    name: 'Parachute Coconut Oil (Edible)',
    category: 'cooking fat',
    ingredients: ingredients.filter(i =>
      ['Coconut Oil'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Coconut Oil , high in saturated fats and will affect the organs heart if used excessively in diet , use sparingly and prefer unsaturated oils for daily cooking.",
    severityCounts: { low: 0, medium: 1, high: 0 },
    organsAffected: ['heart']
  },
  {
    name: 'Tata Sampann Urad Dal',
    category: 'staples',
    ingredients: ingredients.filter(i =>
      ['Urad Dal (Split Black Gram)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Urad Dal , high-quality plant protein & fiber and will affect the organs digestive & metabolic systems beneficially , include as protein-rich staple instead of processed snacks.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['digestive system','metabolic system']
  },
  {
    name: 'Kurkure (Chatka)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Corn Meal', 'Vegetable Oil', 'Salt', 'Spice Mix', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Corn Meal , processed carbohydrate and will affect the organs metabolic system , prefer whole-grain snacks. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , choose healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Spice Mix , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , prefer real spices. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free options.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Amul Fresh Cream (Small)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk Fat', 'Stabilizers', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Fat , saturated fat and will affect the organs heart when consumed in excess , use low-fat alternatives. Stabilizers , processing aids and will affect the organs digestive system minimally in sensitive people , choose simple formulations. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , use fresh cream where possible.",
    severityCounts: { low: 1, medium: 1, high: 1 },
    organsAffected: ['heart','digestive system','liver']
  },
  {
    name: 'Kellogg\'s Special K (Fruits)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Rice & Wheat Flakes', 'Dried Fruit', 'Sugar (small)', 'Vitamins & Minerals', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Rice & Wheat Flakes , processed cereals and will affect the organs metabolic system depending on refinement , prefer whole-grain cereals. Dried Fruit , concentrated sugar & fiber and will affect the organs teeth & digestive system if overused , use fresh fruit. Sugar (small) , added sugar and will affect the organs pancreas & teeth if present , minimize added sugar. Vitamins & Minerals , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet. Salt , excess sodium and will affect the organs cardiovascular system , limit salt.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['metabolic system','teeth','digestive system','cardiovascular system']
  },
  {
    name: 'Britannia Good Day (Cashew)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Vegetable Oil', 'Milk Solids', 'Cashews', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , use whole-wheat flour instead. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Vegetable Oil , added fat and will affect the organs heart depending on type , prefer unsaturated oils. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system , choose low-fat dairy. Cashews , healthy fats & minerals and will affect the organs heart & metabolic system beneficially in moderation , prefer unsalted nuts. Leavening Agent , may cause gas and will affect the organs digestive system , choose natural leavening where possible.",
    severityCounts: { low: 3, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Maggi Hot & Sweet (Bottle)',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Tomato Concentrate', 'Sugar', 'Vinegar', 'Salt', 'Chilli', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Tomato Concentrate , source of lycopene and will affect the organs digestive & cardiovascular systems beneficially , prefer fresh tomatoes. Sugar , added sugar and will affect the organs pancreas & teeth , choose low-sugar options. Vinegar , acidity regulator and may irritate some digestive tracts and will affect the organs digestive system , use in moderation. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Chilli , spicy ingredient and may irritate some and will affect the organs digestive system in sensitive people , use milder versions if needed. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free sauces.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['digestive system','cardiovascular system','pancreas','teeth','liver']
  },
  {
    name: 'Tropicana Guava (Large)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Guava Pulp', 'Vitamin C', 'No Added Sugar'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Guava Pulp , rich in vitamin C & fiber and will affect the organs immune & digestive systems beneficially when consumed as whole fruit , prefer whole fruit. Vitamin C , antioxidant & immune support and will affect the organs immune system beneficially where deficient , maintain balanced intake. No Added Sugar , reduces added-sugar intake and will affect the organs pancreas & teeth beneficially compared to sugared drinks , choose 100% pulp options.",
    severityCounts: { low: 2, medium: 0, high: 0 },
    organsAffected: ['immune system','digestive system','pancreas','teeth']
  },
  {
    name: 'Haldiram\'s Sev (Small)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Gram Flour', 'Vegetable Oil', 'Salt', 'Spices', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Gram Flour , legume protein & fiber and will affect the organs digestive & metabolic systems beneficially when roasted , prefer roasted options. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , choose healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Spices , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , use natural spices. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free snacks.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['digestive system','metabolic system','heart','cardiovascular system','liver']
  },
  {
    name: 'Amul Paneer (Small Vacuum)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Salt', 'Acidity Regulator'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy protein & calcium but contains saturated fat & lactose and will affect the organs heart & digestive system depending on fat content , choose low-fat paneer if needed. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Acidity Regulator , stabilizes pH and may affect the organs digestive system in some people , prefer natural acidulants.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['digestive system','heart','cardiovascular system']
  },
  {
    name: 'Kellogg\'s Muesli (Fruit & Nut)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Oats', 'Dried Fruit', 'Nuts', 'Sugar (small)', 'Vitamins'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fiber and will affect the organs heart & digestive system beneficially , prefer plain oats with fresh fruit. Dried Fruit , concentrated sugars & fiber and will affect the organs teeth & digestive system if overused , use fresh fruit. Nuts , healthy fats & minerals and will affect the organs heart & metabolic system beneficially in moderation , pick unsalted nuts. Sugar (small) , added sugar and will affect the organs pancreas & teeth if present , reduce added sugar. Vitamins , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','teeth','metabolic system']
  },
  {
    name: 'Britannia 50-50 (Family Pack)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Vegetable Oil', 'Milk Solids', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , prefer whole-wheat flour. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Vegetable Oil , added fat and will affect the organs heart depending on type , prefer unsaturated oils. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system , choose low-fat alternatives. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , choose minimal-additive products.",
    severityCounts: { low: 3, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Maggi Noodles (Family Value)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Tastemaker', 'Salt', 'MSG', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-grain alternatives when available. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , pick healthier oils. Tastemaker , contains additives that may affect sensitive people and will affect the organs digestive or immune systems in susceptible individuals , use fresh seasonings. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. MSG , flavor enhancer that may trigger sensitivity in some and will affect the organs nervous & digestive systems in sensitive people , avoid if concerned. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , prefer fresh cooking.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','nervous system','liver']
  },
   {
    name: 'Parle Monaco (Masala)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Edible Vegetable Oil', 'Salt', 'Masala Spice Mix', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , use whole-wheat flour instead. Edible Vegetable Oil , frying/added fat and will affect the organs heart depending on fat profile & reuse , prefer unsaturated oils instead. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Masala Spice Mix , flavoring that may irritate sensitive digestive tracts and will affect the organs digestive system in some people , use simple natural spices instead. Leavening Agent , may cause bloating and will affect the organs digestive system , use natural leavening where possible instead.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','heart','cardiovascular system','digestive system']
  },
  {
    name: 'Britannia Good Day (Honey & Almond)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Edible Vegetable Oil', 'Honey', 'Almonds', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , prefer whole-wheat flour. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Edible Vegetable Oil , added fat and will affect the organs heart depending on type , choose unsaturated oils. Honey , natural sweetener but still sugar and will affect the organs teeth & pancreas if overused , use sparingly. Almonds , healthy fats & minerals and will affect the organs heart & metabolic system beneficially in moderation , use unsalted nuts. Leavening Agent , may cause gas and will affect the organs digestive system , use natural leavening instead.",
    severityCounts: { low: 3, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Maggi Masala (Single Cup)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Tastemaker', 'Salt', 'MSG', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-grain alternatives. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , prefer unsaturated oils. Tastemaker , contains additives that may affect sensitive people and will affect the organs digestive or immune systems , use fresh seasonings. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. MSG , flavor enhancer that may trigger sensitivity in some and will affect the organs nervous & digestive systems in susceptible individuals , opt for MSG-free options. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer freshly prepared meals.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','nervous system','liver']
  },
  {
    name: 'Lays Magic Masala',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Potato', 'Vegetable Oil', 'Salt', 'Masala Flavor', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potato , starchy vegetable and when fried will affect the organs metabolic system , prefer baked potato snacks. Vegetable Oil , frying oil and will affect the organs heart depending on type & reuse , choose healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Masala Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , use natural spice blends. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free options.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','cardiovascular system','digestive system','liver']
  },
  {
    name: 'Amul Gold (Milk 500ml)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Stabilizer', 'Added Vitamins'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , source of protein & calcium but contains lactose & saturated fat and will affect the organs digestive & heart systems depending on fat content , choose toned/low-fat milk if needed. Stabilizer , processing aid and will affect the organs digestive system minimally in sensitive people , prefer minimal additives. Added Vitamins , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['digestive system','heart','nutritional status']
  },
  {
    name: 'Tata Tea Green (Loose)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Green Tea Leaves'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Green Tea Leaves , antioxidant-rich beverage and will affect the organs cardiovascular & metabolic systems beneficially in moderation , drink plain or with minimal sweeteners for benefit.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['cardiovascular system','metabolic system']
  },
  {
    name: 'Nutrela Soya (Tandoori)',
    category: 'protein',
    ingredients: ingredients.filter(i =>
      ['Textured Soya Protein', 'Spice Mix', 'Salt', 'Oil', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Textured Soya Protein , high plant-protein and will affect the organs muscular & metabolic systems beneficially , use as vegetarian protein source. Spice Mix , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , prefer natural spices. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Oil , added fat and will affect the organs heart depending on type & reuse , choose unsaturated oils. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , select preservative-free options.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['muscular system','metabolic system','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Kurkure (Spicy)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Corn Meal', 'Vegetable Oil', 'Salt', 'Spice Mix', 'Flavor Enhancers', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Corn Meal , processed carbohydrate and will affect the organs metabolic system , prefer whole-grain snacks. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , choose healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Spice Mix , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , use natural spices. Flavor Enhancers , additives may trigger sensitivities and will affect the organs nervous & digestive systems in susceptible people , pick clean-label seasonings. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , choose preservative-free items.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Quaker Oats Instant (Vanilla)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Oats', 'Sugar', 'Flavor', 'Dried Milk', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fiber and will affect the organs heart & digestive system beneficially , prefer plain oats with fresh fruit. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in some people , prefer natural flavoring. Dried Milk , dairy protein & lactose and will affect the organs digestive system in lactose-intolerant persons , use lactose-free dairy if needed. Salt , excess sodium and will affect the organs cardiovascular system , limit salt.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','pancreas','teeth','cardiovascular system']
  },
  {
    name: 'Peanut Butter (Smooth)',
    category: 'spreads',
    ingredients: ingredients.filter(i =>
      ['Roasted Peanuts', 'Salt', 'Sugar (optional)', 'Oil (if added)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Roasted Peanuts , rich in protein & healthy fats and will affect the organs heart & metabolic system beneficially in moderation , prefer 100% peanuts without additives. Salt , excess sodium and will affect the organs cardiovascular system , use low-salt versions. Sugar (optional) , added sugar and will affect the organs pancreas & teeth if included , avoid added sugar. Oil (if added) , extra fat and will affect the organs heart depending on type , choose no-added-oil peanut butter where possible.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['heart','metabolic system','cardiovascular system','pancreas','teeth']
  },
  {
    name: 'Nutella (Small)',
    category: 'spreads',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Hazelnuts', 'Vegetable Oil', 'Cocoa', 'Skimmed Milk Powder', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , very high added sugar and will affect the organs pancreas & teeth , reduce portions. Hazelnuts , healthy fats & minerals and will affect the organs heart & metabolic system beneficially in moderation , prefer higher-nut content spreads. Vegetable Oil , added fats and will affect the organs heart depending on type , choose spreads with unsaturated oils. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially in quality cocoa , prefer higher-cocoa content. Skimmed Milk Powder , dairy protein with low fat and will affect the organs digestive system in lactose-intolerant people , use lactose-free alternatives if required. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , opt for minimal-additive spreads.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['pancreas','teeth','heart','digestive system','nervous system']
  },
  {
    name: 'Cadbury Dairy Milk (Small)',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Milk Solids', 'Cocoa', 'Emulsifier', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , added sugar and will affect the organs pancreas & teeth , limit consumption. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in large intake , choose lower-fat options. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially in high-cocoa products , prefer darker chocolate. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , pick minimal-additive chocolate. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in susceptible people , prefer natural flavoring.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['pancreas','teeth','heart','digestive system','nervous system']
  },
  {
    name: 'Kissan Tomato Ketchup (Small)',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Tomato Concentrate', 'Sugar', 'Vinegar', 'Salt', 'Spice', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Tomato Concentrate , source of lycopene and will affect the organs digestive & cardiovascular systems beneficially when from real tomatoes , use fresh tomatoes where possible. Sugar , added sugar and will affect the organs pancreas & teeth , choose reduced-sugar ketchup. Vinegar , acidic agent and may irritate sensitive digestive tracts and will affect the organs digestive system in some people , use in moderation. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Spice , natural flavors & digestive benefits and will affect the organs digestive system positively in moderation , prefer whole spices. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free condiments.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['digestive system','cardiovascular system','pancreas','teeth','liver']
  },
  {
    name: 'Maggi Oats (Family Pack)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Oats', 'Vegetable Oil', 'Tastemaker', 'Salt', 'Preservative', 'MSG'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fiber and will affect the organs heart & digestive system beneficially compared to refined flour , include oats where possible. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , pick unsaturated oils. Tastemaker , flavor additives that may affect sensitive people and will affect the organs digestive or immune systems , use fresh seasonings. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer freshly prepared meals. MSG , flavor enhancer that may trigger sensitivity in some and will affect the organs nervous & digestive systems in susceptible individuals , opt for MSG-free options.",
    severityCounts: { low: 3, medium: 3, high: 0 },
    organsAffected: ['heart','digestive system','cardiovascular system','liver','nervous system','immune system']
  },
  {
    name: 'Amul Cheese (Pizzza Pack)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Salt', 'Emulsifiers', 'Anti-caking Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy nutrient containing saturated fat & lactose and will affect the organs heart & digestive system depending on fat content , choose lower-fat cheese where possible. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Emulsifiers , processing aids that may affect gut microbiota and will affect the organs digestive system in sensitive people , choose simpler cheeses. Anti-caking Agent , processing aid and will affect the organs digestive system minimally in sensitive people , prefer minimally processed options.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['heart','digestive system','cardiovascular system']
  },
  {
    name: 'Tropicana Mango (Small)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Mango Pulp', 'Vitamins', 'No Added Sugar', 'Acidity Regulator'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Mango Pulp , natural fruit nutrients but concentrated sugar and will affect the organs pancreas & teeth if overused , prefer whole fruit. Vitamins , fortification beneficial and will affect the organs nutritional status positively where deficient , maintain balanced intake. No Added Sugar , reduces added-sugar load and will affect the organs pancreas & teeth beneficially compared to sugared drinks , choose 100% pulp. Acidity Regulator , stabilizer that may irritate sensitive digestive tracts and will affect the organs digestive system in some people , prefer natural acidulants like lemon.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['pancreas','teeth','digestive system','nutritional status']
  },
  {
    name: 'Haldiram\'s Bhujia (Large)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Gram Flour', 'Vegetable Oil', 'Salt', 'Spices', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Gram Flour , legume protein & fiber and will affect the organs digestive & metabolic systems beneficially when roasted , include as nutrient-dense snack. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , use healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Spices , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , use natural spices. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , choose preservative-free options.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['digestive system','metabolic system','heart','cardiovascular system','liver']
  },
  {
    name: 'Kellogg\'s Chocos (Mini Pack)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Cocoa', 'Emulsifier', 'Vitamins & Minerals'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , prefer whole-grain cereals. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially when cocoa quality is higher , choose higher-cocoa options. Emulsifier , processing aid that may affect gut microbiota and will affect the organs digestive system in sensitive people , look for minimal additives. Vitamins & Minerals , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Maggi Noodles (Oats Cup)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Oats', 'Vegetable Oil', 'Tastemaker', 'Salt', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fiber and will affect the organs heart & digestive system beneficially compared to refined noodle flour , use whole oats. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , prefer unsaturated oils. Tastemaker , flavor additives that may affect sensitive people and will affect the organs digestive or immune systems , use fresh spices. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer freshly cooked meals.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','cardiovascular system','liver','immune system']
  },
  {
    name: 'Amul Mithai (Rasgulla Box)',
    category: 'sweets',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Sugar', 'Stabilizer', 'Cardamom'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids , dairy concentrated nutrients and will affect the organs heart & digestive system in high intake , use sparingly. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Stabilizer , processing aid and will affect the organs digestive system minimally in sensitive individuals , prefer natural thickeners. Cardamom , natural digestive spice and will affect the organs digestive system positively in moderation , use whole spice.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','pancreas','teeth']
  },
  {
    name: 'Bournvita (Single Serve)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Malted Barley', 'Sugar', 'Milk Solids', 'Vitamins & Minerals', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Malted Barley , carbohydrate source and will affect the organs metabolic system depending on portion , use in moderation. Sugar , added sugar and will affect the organs pancreas & teeth , choose reduced-sugar versions. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high intake , use toned milk. Vitamins & Minerals , fortification beneficial and will affect the organs nutrient status positively where deficient , follow recommended intake. Flavor , synthetic additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , prefer natural flavors.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Kurkure (Limited Edition)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Corn Meal', 'Vegetable Oil', 'Salt', 'Spice Mix', 'Flavorings', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Corn Meal , processed carbohydrate and will affect the organs metabolic system , prefer whole-grain snacks. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , select healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Spice Mix , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , use natural spices. Flavorings , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , choose natural seasonings. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free products.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Dabur Chyawanprash (Single)',
    category: 'health foods',
    ingredients: ingredients.filter(i =>
      ['Herbal Extracts', 'Sugar', 'Ghee', 'Honey', 'Sesame Oil'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Herbal Extracts , traditional immune-supporting herbs and will affect the organs immune system beneficially for many users , consult a physician if on meds. Sugar , added sugar and will affect the organs pancreas & teeth , reduce intake if diabetic. Ghee , saturated fat and will affect the organs heart when consumed frequently , use sparingly. Honey , natural sweetener but still sugar and will affect the organs teeth & pancreas if overused , use sparingly. Sesame Oil , healthy unsaturated fats and will affect the organs heart beneficially in moderation , prefer cold-pressed oil.",
    severityCounts: { low: 3, medium: 2, high: 1 },
    organsAffected: ['immune system','pancreas','teeth','heart']
  },
  {
    name: 'Tata Salt Lite (Pouch)',
    category: 'staples',
    ingredients: ingredients.filter(i =>
      ['Reduced Sodium Salt', 'Iodine', 'Potassium Chloride'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Reduced Sodium Salt , lowers sodium intake and will affect the organs cardiovascular system beneficially for many people , use as advised. Iodine , essential for thyroid and will affect the organs endocrine system beneficially where needed , continue iodisation where deficiency risk exists. Potassium Chloride , sodium alternative and will affect the organs cardiovascular & renal systems (monitor if on meds) , consult physician if required.",
    severityCounts: { low: 2, medium: 0, high: 0 },
    organsAffected: ['cardiovascular system','endocrine system','renal system']
  },
  {
    name: 'Kellogg\'s Crunchy Nuts (Box)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Whole Grain Cereal', 'Nuts', 'Sugar (small)', 'Salt', 'Vitamins'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Whole Grain Cereal , high-fiber base and will affect the organs digestive & metabolic systems beneficially , choose whole-grain cereals. Nuts , healthy fats & minerals and will affect the organs heart & metabolic system beneficially in moderation , prefer unsalted nuts. Sugar (small) , added sugar and will affect the organs pancreas & teeth if present , minimize added sugar. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Vitamins , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet.",
    severityCounts: { low: 3, medium: 1, high: 0 },
    organsAffected: ['digestive system','metabolic system','heart','pancreas','teeth']
  },
  {
    name: 'Britannia NutriChoice (Oats Cookies)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Oats', 'Whole Wheat Flour', 'Sugar (small)', 'Vegetable Oil', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fiber and will affect the organs heart & digestive system beneficially , use rolled oats. Whole Wheat Flour , high-fiber flour and will affect the organs digestive & metabolic systems beneficially , choose whole-wheat. Sugar (small) , added sugar and will affect the organs pancreas & teeth if present , reduce added sugar. Vegetable Oil , added fat and will affect the organs heart depending on type , prefer unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt.",
    severityCounts: { low: 4, medium: 1, high: 0 },
    organsAffected: ['heart','digestive system','metabolic system','pancreas','teeth','cardiovascular system']
  },
  {
    name: 'Amul Paneer (Tandoori Cubes)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Salt', 'Spices', 'Acidity Regulator'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy protein & calcium but contains saturated fat & lactose and will affect the organs heart & digestive system depending on fat content , choose low-fat paneer if needed. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Spices , natural flavors & digestive stimulation and will affect the organs digestive system positively in moderation , prefer whole spices. Acidity Regulator , stabilizes pH and may affect the organs digestive system in some people , choose natural acidulants where possible.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['digestive system','heart','cardiovascular system']
  },
  {
    name: 'Maggi Tastemaker (Extra Masala)',
    category: 'seasoning',
    ingredients: ingredients.filter(i =>
      ['Spice Mix', 'Salt', 'MSG', 'Anti-caking Agent', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Spice Mix , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , prefer fresh spices. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. MSG , flavor enhancer that may cause sensitivity in some and will affect the organs nervous & digestive systems in susceptible people , avoid if sensitive. Anti-caking Agent , processing aid and will affect the organs digestive system minimally in sensitive people , prefer simple blends. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free seasonings.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['digestive system','cardiovascular system','nervous system','liver']
  },
  {
    name: 'Kissan Fruit Spread (Orange)',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Orange Pulp', 'Sugar', 'Pectin', 'Acidity Regulator', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Orange Pulp , natural fruit nutrients & vitamin C and will affect the organs immune & digestive systems beneficially if from real fruit , prefer whole fruit. Sugar , added sugar and will affect the organs pancreas & teeth , reduce added sugar. Pectin , gelling agent and will affect the organs digestive system beneficially in moderation , use natural pectin. Acidity Regulator , stabilizer that may irritate some digestive tracts and will affect the organs digestive system in sensitive individuals , use natural lemon where possible. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , choose preservative-free spreads.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['immune system','digestive system','pancreas','teeth','liver']
  },
  {
    name: 'Kellogg\'s Rice Krispies',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Rice Flakes', 'Sugar (small)', 'Salt', 'Vitamins & Minerals'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Rice Flakes , processed grain and will affect the organs metabolic system depending on portion , prefer whole-grain cereals. Sugar (small) , added sugar and will affect the organs pancreas & teeth if present , choose low-sugar cereals. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Vitamins & Minerals , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','cardiovascular system']
  },
  {
    name: 'Bikano Mathri (Small Pack)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Ghee', 'Salt', 'Spices'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , prefer whole-grain pastry. Ghee , saturated fat and will affect the organs heart adversely in high intake , use sparingly or choose healthier fats. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Spices , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , prefer natural spices.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system']
  },
  {
    name: 'Amul Cheese Singles (Small Pack)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Emulsifier', 'Salt', 'Preservative', 'Color'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy with saturated fat & lactose and will affect the organs heart & digestive system depending on intake , choose low-fat cheese where needed. Emulsifier , processing aid that may affect gut microbiota and will affect the organs digestive system in sensitive people , prefer natural cheeses. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free variants. Color , additives may cause sensitivities and will affect the organs skin & immune system in some people , choose color-free products.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','cardiovascular system','liver','skin']
  },
  {
    name: 'Pringles Sour Cream & Onion',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Potato Flakes', 'Vegetable Oil', 'Sour Cream Powder', 'Onion Powder', 'Salt', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potato Flakes , processed ingredient and will affect the organs metabolic system , prefer whole potatoes. Vegetable Oil , added fats and will affect the organs heart depending on type , choose unsaturated oils. Sour Cream Powder , dairy-derived flavor with fat & sodium and will affect the organs heart & cardiovascular system in excess , prefer milder seasoning. Onion Powder , flavoring and will affect the organs digestive system minimally , prefer fresh onion. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free snacks.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','cardiovascular system','liver']
  },
  {
    name: 'Tropicana Apple (Family)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Apple Juice (100%)', 'Vitamin C (Fortified)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Apple Juice (100%) , natural fruit nutrients but concentrated sugars and will affect the organs pancreas & teeth if overconsumed , prefer whole apples. Vitamin C (Fortified) , antioxidant & immune support and will affect the organs immune system beneficially where deficient , maintain balanced intake.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['pancreas','teeth','immune system']
  },
  {
    name: 'Maggi Masala (Snack Pack)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Tastemaker', 'Salt', 'MSG', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , opt for whole-grain alternatives. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , prefer healthier oils. Tastemaker , contains additives that may affect sensitive people and will affect the organs digestive or immune systems , use fresh seasonings. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. MSG , flavor enhancer that may trigger sensitivity in some and will affect the organs nervous & digestive systems in susceptible individuals , avoid if sensitive. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , choose fresh food.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','nervous system','liver']
  },
  {
    name: 'Amul Butter (Small)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Cream', 'Salt', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Cream , concentrated saturated fat and will affect the organs heart when consumed frequently , use light spreads or small amounts. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Preservative , prolongs shelf life and will affect the organs liver & digestive system with chronic exposure , prefer fresh butter where possible.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['heart','cardiovascular system','liver']
  },
  {
    name: 'Bournvita Biscuits (Family)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Cocoa', 'Milk Solids', 'Vegetable Oil', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , prefer whole-wheat alternatives. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially when cocoa quality is higher , choose higher-cocoa options. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high intake , use low-fat dairy. Vegetable Oil , added fat and will affect the organs heart depending on type , avoid hydrogenated oils. Leavening Agent , may cause gas and will affect the organs digestive system , use natural leavening where possible.",
    severityCounts: { low: 3, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system','nervous system']
  },
  {
    name: 'Kurkure (Tandoori)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Corn Meal', 'Vegetable Oil', 'Salt', 'Tandoori Spice Mix', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Corn Meal , processed carb and will affect the organs metabolic system , choose whole-grain snacks where possible. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , pick unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Tandoori Spice Mix , pungent flavors that may irritate sensitive digestive tracts and will affect the organs digestive system in some people , use fresh spices. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer preservative-free snacks.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Dabur Honey (Small Squeeze)',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Honey'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Honey , natural sweetener but still sugar and will affect the organs teeth & pancreas if overused , use sparingly and avoid for infants under 1 year.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['teeth','pancreas']
  },
  {
    name: 'Tata Sampann Chana (Kabuli)',
    category: 'staples',
    ingredients: ingredients.filter(i =>
      ['Kabuli Chana (Chickpeas)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Kabuli Chana , plant protein & fiber and will affect the organs digestive & metabolic systems beneficially , include as staple for plant-based protein instead.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['digestive system','metabolic system']
  },
  {
    name: 'Maggi Tomato Sauce (Bottle)',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Tomato Concentrate', 'Sugar', 'Vinegar', 'Salt', 'Spices', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Tomato Concentrate , source of lycopene and will affect the organs digestive & cardiovascular systems beneficially when from real tomatoes , use fresh tomatoes where possible. Sugar , added sugar and will affect the organs pancreas & teeth , pick reduced-sugar options. Vinegar , acidic agent and may irritate sensitive digestive tracts and will affect the organs digestive system in some people , use in moderation. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Spices , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , use natural spices. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , choose preservative-free condiments.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['digestive system','cardiovascular system','pancreas','teeth','liver']
  },
  {
    name: 'Parle Hide & Seek (Chocolate Chip)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Vegetable Oil', 'Chocolate Chips', 'Milk Solids', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , use whole-wheat flour instead. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Vegetable Oil , added fat and will affect the organs heart depending on type , choose unsaturated oils. Chocolate Chips , added sugar & fat and will affect the organs pancreas & heart , pick higher-cocoa chips or reduce portions. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system , use low-fat dairy. Leavening Agent , may cause gas and will affect the organs digestive system , use natural leavening instead.",
    severityCounts: { low: 3, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Sunfeast Dark Fantasy Choco Fills (Family)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Vegetable Oil', 'Cocoa Solids', 'Filling (Sugar & Fat)', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-grain flour. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Vegetable Oil , added fat and will affect the organs heart depending on type , prefer unsaturated oils. Cocoa Solids , antioxidant potential and will affect the organs heart & nervous system beneficially when cocoa % is high , choose higher-cocoa. Filling (Sugar & Fat) , concentrated sugar & fat and will affect the organs pancreas & heart , limit intake. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick fresh bakery items.",
    severityCounts: { low: 2, medium: 4, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','liver','nervous system']
  },
  {
    name: 'Lays Classic Salted',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Potato', 'Vegetable Oil', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potato , starchy vegetable and when fried will affect the organs metabolic system , opt for baked potato snacks. Vegetable Oil , frying oil and will affect the organs heart depending on type & reuse , choose high-oleic oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt.",
    severityCounts: { low: 1, medium: 2, high: 0 },
    organsAffected: ['metabolic system','heart','cardiovascular system']
  },
  {
    name: 'Maggi Noodles (Chicken Flavor)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Tastemaker (Chicken)', 'Salt', 'MSG', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , choose whole-grain noodles where possible. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , pick unsaturated oils. Tastemaker (Chicken) , flavour mix with salt & additives and will affect the organs digestive or immune systems in sensitive people , use fresh seasoning. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. MSG , flavour enhancer that may trigger sensitivity in some and will affect the organs nervous & digestive systems in susceptible individuals , avoid if sensitive. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer fresh food.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','nervous system','liver']
  },
  {
    name: 'Nutella (Snack Pack)',
    category: 'spreads',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Hazelnuts', 'Vegetable Oil', 'Cocoa', 'Skimmed Milk Powder', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , very high added sugar and will affect the organs pancreas & teeth , reduce portions. Hazelnuts , healthy fats & minerals and will affect the organs heart & metabolic system beneficially in moderation , prefer higher-nut options. Vegetable Oil , added fats and will affect the organs heart depending on type , choose spreads with unsaturated oils. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially in quality cocoa , pick higher-cocoa spreads. Skimmed Milk Powder , dairy protein & lactose and will affect the organs digestive system in lactose-intolerant people , use lactose-free alternatives if required. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , opt for minimal-additive spreads.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['pancreas','teeth','heart','digestive system','nervous system']
  },
  {
    name: 'Cadbury Dairy Milk Silk',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Milk Solids', 'Cocoa Butter', 'Cocoa Solids', 'Emulsifier', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , added sugar and will affect the organs pancreas & teeth , reduce consumption. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high intake , pick lower-fat options. Cocoa Butter , fat component and will affect the organs heart depending on intake , consume in moderation. Cocoa Solids , antioxidant potential and will affect the organs heart & nervous system beneficially in higher-cocoa chocolate , choose darker options when possible. Emulsifier , processing aid may affect gut microbiota in sensitive people and will affect the organs digestive system , select minimal-additive chocolate. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in susceptible people , prefer natural flavoring.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['pancreas','teeth','heart','digestive system','nervous system']
  },
  {
    name: 'Amul Butter (250g)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Cream', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Cream , concentrated saturated fat and will affect the organs heart when consumed frequently , use small amounts or light spreads. Salt , excess sodium and will affect the organs cardiovascular system , limit salt.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['heart','cardiovascular system']
  },
  {
    name: 'Tropicana Mango (Large)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Mango Pulp', 'Vitamin C', 'No Added Sugar'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Mango Pulp , fruit nutrients & natural sugar and will affect the organs pancreas & teeth if overconsumed , prefer whole fruit. Vitamin C , antioxidant & immune support and will affect the organs immune system beneficially where deficient , maintain balanced intake. No Added Sugar , reduces added-sugar risk and will affect the organs pancreas & teeth beneficially compared to sugared drinks , choose 100% pulp options.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['pancreas','teeth','immune system']
  },
  {
    name: 'Kissan Orange Marmalade',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Orange Pulp', 'Sugar', 'Pectin', 'Acidity Regulator', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Orange Pulp , fruit nutrients & vitamin C and will affect the organs immune & digestive systems beneficially when fresh , prefer whole fruit. Sugar , added sugar and will affect the organs pancreas & teeth , reduce added sugar. Pectin , gelling agent and will affect the organs digestive system beneficially in moderation , use natural pectin. Acidity Regulator , stabilizes pH and may irritate sensitive digestive tracts and will affect the organs digestive system in some people , use natural acidulants like lemon. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , choose preservative-free spreads.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['immune system','digestive system','pancreas','teeth','liver']
  },
  {
    name: 'Pringles Original (Family)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Potato Flakes', 'Vegetable Oil', 'Salt', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potato Flakes , processed ingredient and will affect the organs metabolic system , use whole potatoes instead. Vegetable Oil , added fats and will affect the organs heart depending on type , prefer unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free snacks.",
    severityCounts: { low: 1, medium: 2, high: 0 },
    organsAffected: ['metabolic system','heart','cardiovascular system','liver']
  },
  {
    name: 'Quaker Oats (Instant Chocolate)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Oats', 'Sugar', 'Cocoa', 'Milk Powder', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fiber and will affect the organs heart & digestive system beneficially , prefer plain oats with fresh ingredients. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially in higher-quality cocoa , choose higher-cocoa. Milk Powder , dairy protein & lactose and will affect the organs digestive system in lactose-intolerant people , use lactose-free milk. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in some people , prefer natural flavoring.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['heart','digestive system','pancreas','teeth','nervous system']
  },
  {
    name: 'Tata Tea Premium (Loose)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Black Tea Leaves'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Black Tea Leaves , caffeinated & antioxidant beverage and will affect the organs nervous & cardiovascular systems depending on intake , moderate consumption recommended.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['nervous system','cardiovascular system']
  },
  {
    name: 'Amul Cheese (Shredded)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Salt', 'Emulsifier', 'Anti-caking Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy nutrient containing saturated fat & lactose and will affect the organs heart & digestive system in high intake , choose low-fat cheese where possible. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Emulsifier , processing aid that may affect gut microbiota and will affect the organs digestive system in sensitive people , prefer minimal-additive cheeses. Anti-caking Agent , processing aid and will affect the organs digestive system minimally in sensitive people , use natural alternatives if needed.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['heart','digestive system','cardiovascular system']
  },
  {
    name: 'Bournvita (Chocolate Jar)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Malted Barley', 'Sugar', 'Milk Solids', 'Vitamins & Minerals', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Malted Barley , carbohydrate source and will affect the organs metabolic system depending on portion , use in moderation. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in large intake , use toned milk. Vitamins & Minerals , fortification beneficial and will affect the organs nutrient status positively where deficient , follow recommended intake. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in susceptible people , prefer natural flavoring.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Kurkure (Cream & Onion)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Corn Meal', 'Vegetable Oil', 'Salt', 'Cream Powder', 'Onion Powder', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Corn Meal , processed carbohydrate and will affect the organs metabolic system , choose whole-grain snacks when possible. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , prefer unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Cream Powder , dairy-derived flavor with fat & sodium and will affect the organs heart & cardiovascular system in excess , prefer milder seasonings. Onion Powder , flavoring and will affect the organs digestive system minimally , use fresh onion when possible. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free snacks.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','cardiovascular system','digestive system','liver']
  },
  {
    name: 'Kellogg\'s All-Bran (Original)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Wheat Bran', 'Sugar (small)', 'Vitamins & Minerals'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Wheat Bran , high fibre and will affect the organs digestive system beneficially , include bran cereals. Sugar (small) , added sugar and will affect the organs pancreas & teeth if present , minimize added sugar. Vitamins & Minerals , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['digestive system','pancreas','teeth']
  },
  {
    name: 'Amul Mithai (Gulab Jamun)',
    category: 'sweets',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Sugar', 'Ghee', 'Cardamom'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high intake , use sparingly. Sugar , added sugar and will affect the organs pancreas & teeth , limit intake. Ghee , concentrated saturated fat and will affect the organs heart adversely when consumed frequently , use small amounts. Cardamom , digestive spice and will affect the organs digestive system positively in moderation , use real cardamom.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','pancreas','teeth']
  },
  {
    name: 'Haldiram\'s Aloo Bhujia (Family Pack)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Potato', 'Gram Flour', 'Vegetable Oil', 'Salt', 'Spices', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potato , starchy base and when fried will affect the organs metabolic system , prefer baked options. Gram Flour , legume protein & fiber and will affect the organs digestive & metabolic systems beneficially , include as protein-rich snack. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , use healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Spices , flavor & digestive benefits and will affect the organs digestive system positively in moderation , prefer natural spices. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free mixes.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','digestive system','heart','cardiovascular system','liver']
  },
  {
    name: 'Tata Sampann Toor Dal (Premium)',
    category: 'staples',
    ingredients: ingredients.filter(i =>
      ['Toor Dal (Split Pigeon Pea)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Toor Dal , plant protein & fibre and will affect the organs digestive & metabolic systems beneficially , include as staple protein instead of processed snacks.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['digestive system','metabolic system']
  },
  {
    name: 'Dalda (Block)',
    category: 'cooking fat',
    ingredients: ingredients.filter(i =>
      ['Hydrogenated Vegetable Oil'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Hydrogenated Vegetable Oil , may contain trans/saturated fats and will affect the organs heart adversely with prolonged intake , avoid hydrogenated fats and use unrefined unsaturated oils instead.",
    severityCounts: { low: 0, medium: 0, high: 1 },
    organsAffected: ['heart']
  },
  {
    name: 'Amul Kool (Chocolate Small)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Sugar', 'Cocoa', 'Flavor', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy fat & lactose and will affect the organs heart & digestive system depending on fat content , choose toned milk. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially in quality cocoa , prefer higher-cocoa. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in some people , choose natural flavoring. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free drinks.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','pancreas','teeth','nervous system','liver']
  },
  {
    name: 'Nestle KitKat Chunky',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour (Wafers)', 'Sugar', 'Vegetable Oil', 'Cocoa', 'Milk Solids', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb in wafers and will affect the organs metabolic system , prefer whole-grain wafers. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Vegetable Oil , added fats and will affect the organs heart depending on type , avoid hydrogenated oils. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially in quality cocoa , choose higher-cocoa. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system , use lower-fat dairy. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , select minimal-additive options.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Kellogg\'s Chocos (Box)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Cocoa', 'Emulsifier', 'Vitamins & Minerals'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , prefer whole-grain cereals. Sugar , added sugar and will affect the organs pancreas & teeth , minimize sugar. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially in quality cocoa , choose higher-cocoa options. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , look for minimal additives. Vitamins & Minerals , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Tropicana Orange (Family)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Orange Juice (100%)', 'Vitamin C'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Orange Juice (100%) , natural vitamin C & sugars and will affect the organs pancreas & teeth if overconsumed , prefer whole fruit. Vitamin C , antioxidant & immune support and will affect the organs immune system beneficially where deficient , maintain balanced intake.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['pancreas','teeth','immune system']
  },
  {
    name: 'Haldiram\'s Namkeen (Family)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Lentils', 'Peanuts', 'Vegetable Oil', 'Salt', 'Spices', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Lentils , plant protein & fibre and will affect the organs digestive & metabolic systems beneficially , include as protein-rich snack. Peanuts , healthy fats & protein and will affect the organs heart & metabolic system beneficially in moderation , prefer roasted unsalted. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , choose healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Spices , flavour & digestive benefits and will affect the organs digestive system positively in moderation , prefer natural spices. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free mixes.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['digestive system','metabolic system','heart','cardiovascular system','liver']
  },
  {
    name: 'Amul Paneer (Tika Pack)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Salt', 'Spices', 'Preservative (if any)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy protein & calcium but contains saturated fat & lactose and will affect the organs heart & digestive system depending on fat content , choose low-fat paneer if needed. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Spices , natural flavors & digestive stimulation and will affect the organs digestive system positively in moderation , use fresh spices. Preservative (if any) , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free paneer.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['digestive system','heart','cardiovascular system','liver']
  },
  {
    name: 'Maggi Masala (Value Cup)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Tastemaker', 'Salt', 'MSG', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , choose whole-grain alternatives. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , prefer unsaturated oils. Tastemaker , flavour additives that may affect sensitive individuals and will affect the organs digestive or immune systems , use fresh seasoning. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. MSG , flavour enhancer that may trigger sensitivity in some and will affect the organs nervous & digestive systems in susceptible people , avoid if sensitive. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer freshly prepared meals.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','nervous system','liver']
  },
  {
    name: 'Dabur Honey (Large Jar)',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Honey'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Honey , natural sweetener but still sugar and will affect the organs teeth & pancreas if overused , use sparingly and avoid for infants under 1 year.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['teeth','pancreas']
  },
  {
    name: 'Kellogg\'s Corn Flakes (Small)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Corn Flakes', 'Sugar (small)', 'Salt', 'Vitamins & Minerals'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Corn Flakes , processed cereal and will affect the organs metabolic system due to higher GI , prefer whole-grain cereals. Sugar (small) , added sugar and will affect the organs pancreas & teeth if present , minimize added sugar. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Vitamins & Minerals , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','cardiovascular system']
  },
  {
    name: 'Britannia Milk Bikis (Snack)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Milk Solids', 'Vegetable Oil', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-wheat alternatives. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high intake , choose low-fat dairy. Vegetable Oil , added fat and will affect the organs heart depending on type , prefer unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Pringles Cheese & Onion (Family)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Potato Flakes', 'Vegetable Oil', 'Cheese Powder', 'Onion Powder', 'Salt', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potato Flakes , processed carb and will affect the organs metabolic system , use whole potatoes instead. Vegetable Oil , added fat and will affect the organs heart depending on type , choose unsaturated oils. Cheese Powder , dairy-derived flavor with sodium & fats and will affect the organs heart & cardiovascular system in excess , prefer minimal cheese seasoning. Onion Powder , flavoring and will affect the organs digestive system minimally , use fresh onion when possible. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free snacks.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','cardiovascular system','digestive system','liver']
  },
  {
    name: 'Amul Cheese (Grated Large)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Salt', 'Preservatives', 'Anti-caking Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy nutrient containing saturated fat & lactose and will affect the organs heart & digestive system in high intake , choose lower-fat cheese where possible. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , choose preservative-free options. Anti-caking Agent , processing aid and will affect the organs digestive system minimally in sensitive people , opt for natural alternatives.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Britannia Good Day (Butter)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Butter', 'Milk Solids', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , prefer whole-wheat flour. Sugar , added sugar and will affect the organs pancreas & teeth , reduce. Butter , saturated fat and will affect the organs heart when consumed frequently , use light spreads. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system , choose low-fat dairy. Leavening Agent , may cause gas and will affect the organs digestive system , use natural leavening.",
    severityCounts: { low: 3, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Tata Sampann Moong Dal',
    category: 'staples',
    ingredients: ingredients.filter(i =>
      ['Moong Dal (Split Green Gram)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Moong Dal , rich plant protein & fibre and will affect the organs digestive & metabolic systems beneficially , include in balanced meals instead of processed snacks.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['digestive system','metabolic system']
  },
  {
    name: 'Kellogg\'s Muesli (Light)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Oats', 'Dried Fruit', 'Nuts', 'Sugar (small)', 'Vitamins'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fibre and will affect the organs heart & digestive system beneficially , prefer plain oats with fresh fruit. Dried Fruit , concentrated sugars & fibre and will affect the organs teeth & digestive system if overused , prefer fresh fruit. Nuts , healthy fats & minerals and will affect the organs heart & metabolic system beneficially in moderation , pick unsalted nuts. Sugar (small) , added sugar and will affect the organs pancreas & teeth if present , reduce added sugar. Vitamins , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','teeth','metabolic system']
  },
  {
    name: 'Maggi Noodles (Oats Masala Family)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Oats', 'Vegetable Oil', 'Tastemaker', 'Salt', 'Preservative', 'MSG'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fibre and will affect the organs heart & digestive system beneficially compared to refined flour , prefer oats versions. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , choose unsaturated oils. Tastemaker , flavour additives that may affect sensitive people and will affect the organs digestive or immune systems , use fresh seasoning. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer freshly prepared meals. MSG , flavour enhancer that may trigger sensitivity in some and will affect the organs nervous & digestive systems in susceptible individuals , opt for MSG-free options.",
    severityCounts: { low: 3, medium: 3, high: 0 },
    organsAffected: ['heart','digestive system','cardiovascular system','liver','nervous system','immune system']
  },
  {
    name: 'Dabur Chyawanprash (Family Jar)',
    category: 'health foods',
    ingredients: ingredients.filter(i =>
      ['Herbal Extracts', 'Sugar', 'Ghee', 'Honey', 'Sesame Oil'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Herbal Extracts , traditional immune-supporting herbs and will affect the organs immune system beneficially for many users , consult a physician if on medication. Sugar , added sugar and will affect the organs pancreas & teeth , reduce intake if diabetic. Ghee , saturated fat and will affect the organs heart when consumed frequently , use sparingly. Honey , natural sweetener but still sugar and will affect the organs teeth & pancreas if overused , use sparingly. Sesame Oil , healthy unsaturated fats and will affect the organs heart beneficially in moderation , prefer cold-pressed oil.",
    severityCounts: { low: 3, medium: 2, high: 1 },
    organsAffected: ['immune system','pancreas','teeth','heart']
  },
  {
    name: 'Britannia Good Day (Chocolate)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Vegetable Oil', 'Cocoa', 'Milk Solids', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , prefer whole-grain flour. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Vegetable Oil , added fats and will affect the organs heart depending on type , choose unsaturated oils. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially in higher-cocoa options , pick higher-cocoa. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system , select low-fat dairy. Leavening Agent , may cause gas and will affect the organs digestive system , use natural leavening where possible.",
    severityCounts: { low: 3, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Kurkure (Simply Salted)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Corn Meal', 'Vegetable Oil', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Corn Meal , processed carbohydrate and will affect the organs metabolic system , choose whole-grain snacks. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , prefer healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt.",
    severityCounts: { low: 1, medium: 2, high: 0 },
    organsAffected: ['metabolic system','heart','cardiovascular system']
  },
  {
    name: 'Amul Taaza (1L)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Stabilizer', 'Vitamins'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy source of protein & calcium with lactose and some saturated fat and will affect the organs digestive & heart systems depending on fat content , choose toned milk if required. Stabilizer , processing aid and will affect the organs digestive system minimally in sensitive people , prefer simple formulations. Vitamins , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['digestive system','heart','nutritional status']
  },
  {
    name: 'Kissan Strawberry Jam (Large)',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Strawberry Pulp', 'Sugar', 'Pectin', 'Acidity Regulator', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Strawberry Pulp , fruit nutrients & fibre and will affect the organs digestive & immune systems beneficially when fresh , choose whole fruit where possible. Sugar , added sugar and will affect the organs pancreas & teeth , reduce added sugar. Pectin , gelling agent and will affect the organs digestive system beneficially in moderation , use natural pectin. Acidity Regulator , stabilizes pH and may irritate sensitive digestive tracts and will affect the organs digestive system in some people , prefer natural acidulants. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free preserves.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['digestive system','immune system','pancreas','teeth','liver']
  },
   {
    name: 'Parle Monaco (Cream)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Milk Solids', 'Salt', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , use whole-wheat flour instead. Vegetable Oil , added fat and will affect the organs heart depending on type , choose unsaturated oils instead. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system , prefer low-fat dairy. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Leavening Agent , may cause bloating and will affect the organs digestive system , use natural leavening instead.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system']
  },
  {
    name: 'Britannia 50-50 (Chocolate Family)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Vegetable Oil', 'Cocoa Solids', 'Milk Solids', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , use whole-grain flour instead. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Vegetable Oil , added fats and will affect the organs heart depending on type , prefer unsaturated oils. Cocoa Solids , antioxidant potential and will affect the organs heart & nervous system beneficially in higher-cocoa options , choose higher-cocoa. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system , choose low-fat dairy. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , select minimal-additive products.",
    severityCounts: { low: 2, medium: 4, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system','nervous system']
  },
  {
    name: 'Lays Magic (Barbecue)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Potato', 'Vegetable Oil', 'Salt', 'BBQ Flavor', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potato , starchy vegetable and when fried will affect the organs metabolic system , prefer baked potato snacks. Vegetable Oil , frying oil and will affect the organs heart depending on type & reuse , use unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. BBQ Flavor , additives & smoke flavor may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , choose natural seasonings. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free snacks.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','cardiovascular system','liver','immune system']
  },
  {
    name: 'Maggi Noodles (Masala Big)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Tastemaker', 'Salt', 'MSG', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , choose whole-grain noodles when possible. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , pick unsaturated oils. Tastemaker , flavor additives that may affect sensitive people and will affect the organs digestive or immune systems , use fresh spices. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. MSG , flavor enhancer that may trigger sensitivity in some and will affect the organs nervous & digestive systems in susceptible individuals , avoid if sensitive. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer fresh meals.",
    severityCounts: { low: 2, medium: 4, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','nervous system','liver']
  },
  {
    name: 'Nutella (Party Jar)',
    category: 'spreads',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Hazelnuts', 'Vegetable Oil', 'Cocoa', 'Skimmed Milk Powder', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , very high added sugar and will affect the organs pancreas & teeth , reduce portions. Hazelnuts , healthy fats & minerals and will affect the organs heart & metabolic system beneficially in moderation , prefer higher-nut content spreads. Vegetable Oil , added fats and will affect the organs heart depending on type , choose unsaturated-oil spreads. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially in quality cocoa , pick higher-cocoa. Skimmed Milk Powder , dairy protein & lactose and will affect the organs digestive system in lactose-intolerant people , use lactose-free alternatives if required. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , opt for minimal-additive spreads.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['pancreas','teeth','heart','digestive system','nervous system']
  },
  {
    name: 'Cadbury Dairy Milk (Family)',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Milk Solids', 'Cocoa', 'Emulsifier', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , added sugar and will affect the organs pancreas & teeth , limit consumption. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high intake , choose lower-fat options. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially in higher-cocoa chocolate , prefer darker variants. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , pick minimal-additive chocolate. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in susceptible people , use natural flavors where possible.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['pancreas','teeth','heart','digestive system','nervous system']
  },
  {
    name: 'Amul Gold (Butter Block)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Cream', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Cream , concentrated saturated fat and will affect the organs heart when consumed frequently , use sparingly. Salt , excess sodium and will affect the organs cardiovascular system , limit salt.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['heart','cardiovascular system']
  },
  {
    name: 'Tropicana Orange (Small Bottle)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Orange Juice (100%)', 'Vitamin C'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Orange Juice (100%) , natural vitamin C & sugars and will affect the organs pancreas & teeth if overconsumed , prefer whole fruit. Vitamin C , antioxidant & immune support and will affect the organs immune system beneficially where deficient , maintain balanced intake.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['pancreas','teeth','immune system']
  },
  {
    name: 'Pringles Salt & Vinegar (Small)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Potato Flakes', 'Vegetable Oil', 'Salt', 'Vinegar Powder', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potato Flakes , processed carbohydrate and will affect the organs metabolic system , choose whole potatoes instead. Vegetable Oil , added fats and will affect the organs heart depending on type , prefer unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Vinegar Powder , acidic flavoring and may affect the organs digestive system in sensitive people , use natural acidulants. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free snacks.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','cardiovascular system','digestive system','liver']
  },
  {
    name: 'Quaker Oats (Apple Cinnamon Family)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Oats', 'Sugar', 'Dried Apple', 'Cinnamon', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fiber and will affect the organs heart & digestive system beneficially , prefer plain oats with fresh fruit. Sugar , added sugar and will affect the organs pancreas & teeth if present , reduce sugar. Dried Apple , concentrated sugar & fiber and will affect the organs teeth & digestive system if overused , use fresh apple. Cinnamon , may aid glycemic control in moderation and will affect the organs metabolic & cardiovascular systems beneficially , prefer true cinnamon. Salt , excess sodium and will affect the organs cardiovascular system , limit salt.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','pancreas','teeth','cardiovascular system']
  },
  {
    name: 'Kellogg\'s Corn Flakes (Family Box)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Corn Flakes', 'Sugar (small)', 'Salt', 'Vitamins & Minerals'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Corn Flakes , processed cereal and will affect the organs metabolic system due to higher GI , prefer whole-grain cereals. Sugar (small) , added sugar and will affect the organs pancreas & teeth if present , minimize. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Vitamins & Minerals , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','cardiovascular system']
  },
  {
    name: 'Haldiram\'s Mixture (Small)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Lentils', 'Peanuts', 'Vegetable Oil', 'Salt', 'Spices', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Lentils , plant protein & fibre and will affect the organs digestive & metabolic systems beneficially , include as protein-rich snack. Peanuts , healthy fats & protein and will affect the organs heart & metabolic system beneficially in moderation , prefer roasted unsalted. Vegetable Oil , frying oil and will affect the organs heart depending on type & reuse , choose unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Spices , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , use natural spices. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer preservative-free mixes.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['digestive system','metabolic system','heart','cardiovascular system','liver']
  },
  {
    name: 'Amul Paneer (Plain)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Salt', 'Acidity Regulator'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy protein & calcium but contains saturated fat & lactose and will affect the organs heart & digestive system depending on fat content , choose low-fat paneer if needed. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Acidity Regulator , stabilizes pH and may affect the organs digestive system in some people , use natural acidulants.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['digestive system','heart','cardiovascular system']
  },
  {
    name: 'Tata Tea Agni (Tea Bags Strong)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Black Tea Leaves (Strong)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Black Tea Leaves (Strong) , caffeinated & antioxidant beverage and will affect the organs nervous & cardiovascular systems depending on intake , moderate consumption recommended.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['nervous system','cardiovascular system']
  },
  {
    name: 'Britannia Marie (Classic)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Edible Vegetable Oil', 'Salt', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , use whole-wheat alternatives. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Edible Vegetable Oil , added fat and will affect the organs heart depending on type , prefer unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Leavening Agent , may cause bloating and will affect the organs digestive system , use natural leavening where possible.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Kurkure (Masala Munch)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Corn Meal', 'Vegetable Oil', 'Salt', 'Spice Mix', 'Flavor Enhancers', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Corn Meal , processed carbohydrate and will affect the organs metabolic system , prefer whole-grain snacks. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , choose healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Spice Mix , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , use natural spices. Flavor Enhancers , additives may trigger sensitivities and will affect the organs nervous & digestive systems in susceptible people , opt for clean-label seasonings. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free options.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Kissan Mango Jam (Small)',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Mango Pulp', 'Sugar', 'Pectin', 'Acidity Regulator', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Mango Pulp , fruit nutrients and will affect the organs digestive & immune systems beneficially when from real fruit , prefer whole fruit. Sugar , added sugar and will affect the organs pancreas & teeth , reduce added sugar. Pectin , gelling agent and will affect the organs digestive system beneficially in moderation , use natural pectin. Acidity Regulator , stabilizes pH and may irritate sensitive digestive tracts and will affect the organs digestive system in some people , use natural acidulants instead. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , choose preservative-free preserves.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['digestive system','immune system','pancreas','teeth','liver']
  },
  {
    name: 'Hershey\'s Syrup (Family)',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Cocoa', 'Corn Syrup', 'Flavor', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , very high added sugar and will affect the organs pancreas & teeth , limit usage. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially in quality cocoa , prefer higher-cocoa. Corn Syrup , high glycemic sweetener and will affect the organs metabolic system & pancreas , use natural sweeteners. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , choose natural flavoring. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer preservative-free syrups.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['pancreas','teeth','metabolic system','heart','liver']
  },
  {
    name: 'Tata Sampann Rice (Regular)',
    category: 'staples',
    ingredients: ingredients.filter(i =>
      ['Rice', 'Salt (if fortified)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Rice , staple carbohydrate and will affect the organs metabolic system depending on portion & processing , prefer wholegrain rice where possible. Salt (if fortified) , added minerals and will affect the organs endocrine & cardiovascular systems depending on content , use iodised salt if needed.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['metabolic system','endocrine system']
  },
  {
    name: 'Pepsi (Can)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Carbonated Water', 'Sugar', 'Color', 'Caffeine', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Carbonated Water , may cause bloating and will affect the organs digestive system , prefer still water. Sugar , very high added sugar and will affect the organs pancreas & teeth , avoid frequent sugary drinks. Color , additives may cause sensitivities and will affect the organs digestive or immune systems in some people , choose fewer-additive drinks. Caffeine , stimulant and will affect the organs nervous & cardiovascular systems in excess , limit intake. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , minimize frequent intake.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['digestive system','pancreas','teeth','nervous system','cardiovascular system','liver']
  },
  {
    name: 'Amul Kool (Mango)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Sugar', 'Mango Flavor', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy with lactose & fat and will affect the organs digestive & heart systems depending on fat content , choose toned milk. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Mango Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in susceptible people , choose real fruit. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free beverages.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['digestive system','heart','pancreas','teeth','liver']
  },
  {
    name: 'Bournvita (Kids Small)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Malted Barley', 'Sugar', 'Milk Solids', 'Vitamins & Minerals', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Malted Barley , carbohydrate source and will affect the organs metabolic system depending on portion , use in moderation. Sugar , added sugar and will affect the organs pancreas & teeth , choose reduced-sugar versions. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high intake , use toned milk. Vitamins & Minerals , fortification beneficial and will affect the organs nutrient status positively where deficient , follow pediatric guidance. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive children , prefer natural flavors.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system','immune system']
  },
  {
    name: 'Kellogg\'s Special K (Original)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Rice & Wheat Flakes', 'Sugar (small)', 'Vitamins & Minerals'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Rice & Wheat Flakes , processed cereals and will affect the organs metabolic system depending on refinement , prefer whole-grain cereals. Sugar (small) , added sugar and will affect the organs pancreas & teeth if present , minimize sugar. Vitamins & Minerals , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','nutritional status']
  },
  {
    name: 'Maggi Tastemaker (Masala Sachet)',
    category: 'seasoning',
    ingredients: ingredients.filter(i =>
      ['Spice Mix', 'Salt', 'MSG', 'Anti-caking Agent', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Spice Mix , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , prefer natural spices. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. MSG , flavor enhancer that may trigger sensitivity in some and will affect the organs nervous & digestive systems in susceptible individuals , avoid if sensitive. Anti-caking Agent , processing aid and will affect the organs digestive system minimally in sensitive people , choose simple blends. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free seasonings.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['digestive system','cardiovascular system','nervous system','liver']
  },
  {
    name: 'Kurkure (Masala Munch Family)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Corn Meal', 'Vegetable Oil', 'Salt', 'Spice Mix', 'Flavorings', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Corn Meal , processed carbohydrate and will affect the organs metabolic system , prefer whole-grain snacks. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , choose healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Spice Mix , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , use natural spices. Flavorings , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , choose natural seasonings. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free options.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Dalda (Soft Spread)',
    category: 'cooking fat',
    ingredients: ingredients.filter(i =>
      ['Hydrogenated Vegetable Oil', 'Emulsifier', 'Antioxidant'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Hydrogenated Vegetable Oil , may contain trans/saturated fats and will affect the organs heart adversely with prolonged intake , avoid hydrogenated fats and use unrefined unsaturated oils instead. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , pick single-ingredient oils. Antioxidant , prevents rancidity and will affect the organs cellular health minimally beneficially , prefer minimally processed oils.",
    severityCounts: { low: 1, medium: 1, high: 1 },
    organsAffected: ['heart','digestive system','cellular health']
  },
  {
    name: 'Tropicana Apple (Small)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Apple Juice (100%)', 'Vitamin C (Fortified)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Apple Juice (100%) , natural nutrients but concentrated sugars and will affect the organs pancreas & teeth if overconsumed , prefer whole apple. Vitamin C (Fortified) , antioxidant & immune support and will affect the organs immune system beneficially where deficient , maintain balanced intake.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['pancreas','teeth','immune system']
  },
  {
    name: 'Amul Cheese Cubes (Small)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Salt', 'Preservative', 'Anti-caking Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy nutrient containing saturated fat & lactose and will affect the organs heart & digestive system in high intake , choose lower-fat options. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free cheese. Anti-caking Agent , processing aid and will affect the organs digestive system minimally in sensitive people , choose unprocessed cheese where possible.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Britannia Tiger (Family)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Milk Solids', 'Sugar', 'Edible Vegetable Oil', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , prefer whole-wheat. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system , choose low-fat variants. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Edible Vegetable Oil , added fat and will affect the organs heart depending on type , use unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','pancreas','teeth','cardiovascular system']
  },
  {
    name: 'Kellogg\'s All-Bran (Fruit)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Wheat Bran', 'Dried Fruit', 'Sugar (small)', 'Vitamins & Minerals'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Wheat Bran , high fibre and will affect the organs digestive system beneficially , include bran cereals. Dried Fruit , concentrated sugars & fibre and will affect the organs teeth & digestive system if overused , prefer fresh fruit. Sugar (small) , added sugar and will affect the organs pancreas & teeth if present , minimize added sugar. Vitamins & Minerals , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['digestive system','teeth','pancreas','nutritional status']
  },
  {
    name: 'Maggi Oats (Masala Small)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Oats', 'Vegetable Oil', 'Tastemaker', 'Salt', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fiber and will affect the organs heart & digestive system beneficially , use whole oats. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , prefer unsaturated oils. Tastemaker , flavor additives that may affect sensitive people and will affect the organs digestive or immune systems , use fresh spices. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer fresh meals.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Dabur Honey (Squeeze Small)',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Honey'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Honey , natural sweetener but still sugar and will affect the organs teeth & pancreas if overused , use sparingly and avoid for infants under 1 year.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['teeth','pancreas']
  },
  {
    name: 'Amul Mithai (Kaju Katli)',
    category: 'sweets',
    ingredients: ingredients.filter(i =>
      ['Cashew', 'Sugar', 'Milk Solids', 'Ghee', 'Cardamom'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Cashew , nutritious nuts rich in fats & minerals and will affect the organs heart & metabolic system beneficially in moderation , prefer unsalted nuts. Sugar , added sugar and will affect the organs pancreas & teeth , limit intake. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high intake , use sparingly. Ghee , saturated fat and will affect the organs heart when consumed frequently , use small amounts. Cardamom , digestive spice and will affect the organs digestive system positively in moderation , choose whole cardamom.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['heart','metabolic system','pancreas','teeth','digestive system']
  },
  {
    name: 'Tata Sampann Masoor Dal',
    category: 'staples',
    ingredients: ingredients.filter(i =>
      ['Masoor Dal (Red Lentil)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Masoor Dal , plant protein & fibre and will affect the organs digestive & metabolic systems beneficially , include as staple protein source.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['digestive system','metabolic system']
  },
  {
    name: 'Kurkure (Punjabi Tadka)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Corn Meal', 'Vegetable Oil', 'Salt', 'Spice Mix', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Corn Meal , processed carbohydrate and will affect the organs metabolic system , prefer whole-grain snacks. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , choose healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Spice Mix , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , use real spices. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free options.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Kissan Mixed Fruit Jam (Small)',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Fruit Pulp', 'Sugar', 'Pectin', 'Acidity Regulator', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Fruit Pulp , natural fruit nutrients and will affect the organs digestive & immune systems beneficially when fresh , prefer whole fruit. Sugar , added sugar and will affect the organs pancreas & teeth , reduce added sugar. Pectin , gelling agent and will affect the organs digestive system beneficially in moderation , use natural pectin. Acidity Regulator , stabilizes pH and may irritate sensitive digestive tracts and will affect the organs digestive system in some people , use natural acidulants. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , choose preservative-free preserves.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['digestive system','immune system','pancreas','teeth','liver']
  },
  {
    name: 'Tropicana Guava (Small)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Guava Pulp', 'Vitamin C', 'No Added Sugar'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Guava Pulp , rich in vitamin C & fiber and will affect the organs immune & digestive systems beneficially when consumed as whole fruit , prefer whole fruit. Vitamin C , antioxidant & immune support and will affect the organs immune system beneficially where deficient , maintain balanced intake. No Added Sugar , reduces added-sugar risk and will affect the organs pancreas & teeth beneficially compared to sugared drinks , choose 100% fruit options.",
    severityCounts: { low: 2, medium: 0, high: 0 },
    organsAffected: ['immune system','digestive system','pancreas','teeth']
  },
  {
    name: 'Hershey\'s Dark (Small)',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Cocoa Solids', 'Cocoa Butter', 'Sugar', 'Emulsifier', 'Vanilla'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Cocoa Solids , antioxidant potential and will affect the organs heart & nervous system beneficially in higher-cocoa chocolate , choose darker chocolate. Cocoa Butter , fat component and will affect the organs heart depending on intake , consume in moderation. Sugar , added sugar and will affect the organs pancreas & teeth , minimize sugar. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , choose low-additive chocolate. Vanilla , flavoring and will affect the organs digestive/immune system minimally , prefer natural vanilla.",
    severityCounts: { low: 3, medium: 1, high: 0 },
    organsAffected: ['heart','nervous system','pancreas','teeth']
  },
  {
    name: 'Parle Hide & Seek (Dark Chocolate)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Vegetable Oil', 'Dark Chocolate Chips', 'Milk Solids', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , use whole-wheat flour instead. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Vegetable Oil , added fat and will affect the organs heart depending on type , prefer unsaturated oils. Dark Chocolate Chips , added sugar & fat (but some antioxidants if high cocoa) and will affect the organs pancreas & heart , prefer higher-cocoa options or reduce portion. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system , choose low-fat dairy. Leavening Agent , may cause gas and will affect the organs digestive system , use natural leavening instead.",
    severityCounts: { low: 3, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Sunfeast Marie Light (Sugar Free Pack)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Artificial Sweetener', 'Vegetable Oil', 'Salt', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , use whole-wheat flour instead. Artificial Sweetener , low-calorie substitute that may affect gut microbiota in some and will affect the organs digestive & metabolic systems in sensitive people , prefer minimal sweetening. Vegetable Oil , added fat and will affect the organs heart depending on type , choose unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Leavening Agent , may cause gas and will affect the organs digestive system , use natural leavening.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','digestive system','cardiovascular system','heart']
  },
  {
    name: 'Lays Spanish Tomato Tango',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Potato', 'Vegetable Oil', 'Tomato Powder', 'Salt', 'Flavorings', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potato , starchy vegetable and when fried will affect the organs metabolic system , prefer baked snacks. Vegetable Oil , frying oil and will affect the organs heart depending on type & reuse , use high-oleic oils. Tomato Powder , processed flavor and will affect the organs digestive system mildly , use fresh tomato flavours. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Flavorings , additives may cause sensitivities and will affect the organs digestive or immune systems in susceptible people , use natural seasonings. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free snacks instead.",
    severityCounts: { low: 1, medium: 4, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver','immune system']
  },
  {
    name: 'Maggi Noodles (Vegetable Big Pack)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Dehydrated Vegetables', 'Tastemaker', 'Salt', 'MSG', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , choose whole-grain noodles if available. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , pick unsaturated oils. Dehydrated Vegetables , convenient nutrients but processed and will affect the organs digestive system moderately , prefer fresh vegetables. Tastemaker , contains additives that may affect sensitive people and will affect the organs digestive or immune systems , use fresh spices. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. MSG , flavor enhancer that may trigger sensitivity in some and will affect the organs nervous & digestive systems in susceptible individuals , choose MSG-free if concerned. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer freshly prepared meals.",
    severityCounts: { low: 2, medium: 4, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','nervous system','liver','immune system']
  },
  {
    name: 'Nutella (Mini Jar)',
    category: 'spreads',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Hazelnuts', 'Vegetable Oil', 'Cocoa', 'Skimmed Milk Powder', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , very high added sugar and will affect the organs pancreas & teeth , reduce portion size. Hazelnuts , healthy fats & minerals and will affect the organs heart & metabolic system beneficially in moderation , prefer higher-nut spreads. Vegetable Oil , added fat and will affect the organs heart depending on type , choose unsaturated oils. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially in high-quality cocoa , pick higher-cocoa. Skimmed Milk Powder , dairy protein & lactose and will affect the organs digestive system in lactose-intolerant people , consider lactose-free alternatives. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , opt for minimal-additive spreads.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['pancreas','teeth','heart','digestive system','nervous system']
  },
  {
    name: 'Cadbury Perk (Single)',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Refined Wheat Flour (Wafers)', 'Cocoa', 'Milk Solids', 'Vegetable Oil', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , added sugar and will affect the organs pancreas & teeth , limit consumption. Refined Wheat Flour (Wafers) , refined carb and will affect the organs metabolic system , prefer whole-grain wafers. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially in higher-cocoa products , favour darker chocolate. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in large intake , choose low-fat alternatives. Vegetable Oil , added fats and will affect the organs heart depending on type , avoid hydrogenated oils. Emulsifier , processing aid that may affect gut microbiota and will affect the organs digestive system in sensitive people , prefer minimal-additive bars.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['pancreas','teeth','metabolic system','heart','digestive system','nervous system']
  },
  {
    name: 'Amul Cheese Spread (Jar)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Edible Vegetable Oil', 'Salt', 'Emulsifiers', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high intake , prefer low-fat options. Edible Vegetable Oil , added fat and will affect the organs heart depending on type , choose unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Emulsifiers , processing aids that may affect gut microbiota and will affect the organs digestive system in sensitive people , select minimal-emulsifier products. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free spreads.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Tropicana Orange (On-the-Go)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Orange Juice (100%)', 'Vitamin C'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Orange Juice (100%) , natural vitamin C & sugars and will affect the organs pancreas & teeth if overconsumed , prefer whole fruit. Vitamin C , antioxidant & immune support and will affect the organs immune system beneficially where deficient , maintain balanced intake.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['pancreas','teeth','immune system']
  },
  {
    name: 'Kurkure (Tadka Trail)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Corn Meal', 'Vegetable Oil', 'Salt', 'Spice Mix', 'Flavor Enhancers', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Corn Meal , processed carbohydrate and will affect the organs metabolic system , choose whole-grain snacks. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , pick unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Spice Mix , flavor & digestive stimulation and will affect the organs digestive system positively in moderation , prefer real spices. Flavor Enhancers , additives may cause sensitivities and will affect the organs nervous & digestive systems in susceptible people , pick clean-label seasonings. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , choose preservative-free options.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Quaker Oats (Chocolate Small)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Oats', 'Sugar', 'Cocoa', 'Milk Powder', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fiber and will affect the organs heart & digestive system beneficially , prefer plain oats with fresh fruit. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially in quality cocoa , choose higher-cocoa. Milk Powder , dairy protein & lactose and will affect the organs digestive system in lactose-intolerant people , use lactose-free milk if required. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in some people , prefer natural flavoring.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['heart','digestive system','pancreas','teeth','nervous system']
  },
  {
    name: 'Pepsi (Small Bottle)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Carbonated Water', 'Sugar', 'Color', 'Caffeine', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Carbonated Water , may cause bloating and will affect the organs digestive system , prefer still water. Sugar , high added sugar and will affect the organs pancreas & teeth , limit sugary drinks. Color , additives may cause sensitivities and will affect the organs digestive or immune systems in sensitive people , choose fewer-additive drinks. Caffeine , stimulant and will affect the organs nervous & cardiovascular systems in excess , moderate consumption. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , reduce frequent intake.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['digestive system','pancreas','teeth','nervous system','cardiovascular system','liver']
  },
  {
    name: 'Maggi Oats (Cup Masala)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Oats', 'Dehydrated Vegetables', 'Tastemaker', 'Salt', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fiber and will affect the organs heart & digestive system beneficially , prefer whole oats. Dehydrated Vegetables , convenient nutrients but processed and will affect the organs digestive system moderately , use fresh vegetables where possible. Tastemaker , contains additives that may affect sensitive people and will affect the organs digestive or immune systems , use fresh spices. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer fresh food options.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','cardiovascular system','liver','immune system']
  },
  {
    name: 'Amul Mithai (Rasgulla Single)',
    category: 'sweets',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Sugar', 'Stabilizer', 'Cardamom'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high intake , use sparingly. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Stabilizer , processing aid and will affect the organs digestive system minimally in sensitive people , prefer natural thickeners. Cardamom , digestive spice and will affect the organs digestive system positively in moderation , use whole cardamom.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','pancreas','teeth']
  },
  {
    name: 'Kellogg\'s Chocos (Snack Pack)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Cocoa', 'Emulsifier', 'Vitamins & Minerals'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , prefer whole-grain cereals. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially when cocoa % is higher , choose higher-cocoa options. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , look for minimal additives. Vitamins & Minerals , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Pringles Paprika (Small)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Potato Flakes', 'Vegetable Oil', 'Paprika Powder', 'Salt', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potato Flakes , processed carbohydrate and will affect the organs metabolic system , prefer whole potatoes. Vegetable Oil , added fats and will affect the organs heart depending on type , choose unsaturated oils. Paprika Powder , natural spice and will affect the organs digestive system mildly (benefit/irritation in some) , prefer natural spices. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free snacks.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','cardiovascular system','liver','digestive system']
  },
  {
    name: 'Nutrela Soya (Plain Pack)',
    category: 'protein',
    ingredients: ingredients.filter(i =>
      ['Textured Soya Protein'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Textured Soya Protein , high plant-protein and will affect the organs muscular & metabolic systems beneficially as a vegetarian protein source , include it as part of balanced diet instead of processed meats.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['muscular system','metabolic system']
  },
  {
    name: 'Bingo Mad Angles (Peri Peri)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Salt', 'Peri Peri Seasoning', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , prefer whole-grain alternatives. Vegetable Oil , frying/added fat and will affect the organs heart depending on type , choose unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Peri Peri Seasoning , spices that may irritate sensitive digestive tracts and will affect the organs digestive system in some people , use milder seasoning. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free snacks.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Amul Kool (Chocolate Sachet)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Sugar', 'Cocoa', 'Flavor', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy with lactose & fat and will affect the organs digestive & heart systems depending on fat content , choose toned milk. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially in quality cocoa , prefer higher-cocoa. Flavor , synthetic additives may cause sensitivities and will affect the organs digestive or immune systems in some people , choose natural flavors. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer preservative-free drinks.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['digestive system','heart','pancreas','teeth','nervous system','liver']
  },
  {
    name: 'Kissan Mixed Fruit Jam (Single)',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Fruit Pulp', 'Sugar', 'Pectin', 'Acidity Regulator', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Fruit Pulp , natural fruit nutrients and will affect the organs digestive & immune systems beneficially when from real fruit , prefer whole fruit. Sugar , added sugar and will affect the organs pancreas & teeth , reduce added sugar. Pectin , gelling agent and will affect the organs digestive system beneficially in moderation , use natural pectin. Acidity Regulator , stabilizes pH and may irritate sensitive digestive tracts and will affect the organs digestive system in some people , use natural acidulants instead. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , choose preservative-free preserves.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['digestive system','immune system','pancreas','teeth','liver']
  },
  {
    name: 'Kellogg\'s Muesli (Nutritious Pack)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Oats', 'Dried Fruit', 'Nuts', 'Sugar (small)', 'Vitamins'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fiber and will affect the organs heart & digestive system beneficially , choose plain oats with fresh fruit for best effects. Dried Fruit , concentrated natural sugars & fiber and will affect the organs teeth & digestive system if overused , use fresh fruit. Nuts , healthy fats & minerals and will affect the organs heart & metabolic system beneficially in moderation , prefer unsalted nuts. Sugar (small) , added sugar and will affect the organs pancreas & teeth if present , minimize added sugar. Vitamins , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','teeth','metabolic system']
  },
  {
    name: 'Dabur Honey (Travel Size)',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Honey'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Honey , natural sweetener but still sugar and will affect the organs teeth & pancreas if overused , use sparingly and avoid for infants under 1 year.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['teeth','pancreas']
  },
  {
    name: 'Amul Fresh Cream (200ml)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk Fat', 'Stabilizers', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Fat , saturated fat and will affect the organs heart when consumed in excess , use low-fat alternatives. Stabilizers , processing aids and will affect the organs digestive system minimally in sensitive people , prefer simple formulations. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , use fresh cream where possible.",
    severityCounts: { low: 1, medium: 1, high: 1 },
    organsAffected: ['heart','digestive system','liver']
  },
  {
    name: 'Britannia Treat Small (Choco)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Vegetable Oil', 'Cocoa', 'Milk Solids', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , prefer whole-wheat flour. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Vegetable Oil , added fats and will affect the organs heart depending on type , choose unsaturated oils. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially in higher-cocoa products , prefer higher-cocoa. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system , choose low-fat dairy. Leavening Agent , may cause gas and will affect the organs digestive system , use natural leavening where possible.",
    severityCounts: { low: 3, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Kurkure (Fiery Chilli)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Corn Meal', 'Vegetable Oil', 'Chilli Powder', 'Salt', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Corn Meal , processed carbohydrate and will affect the organs metabolic system , opt for whole-grain snacks. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , use healthier oils. Chilli Powder , spicy agent that may irritate some digestive tracts and will affect the organs digestive system , use milder spice alternatives if needed. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free options.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Maggi Masala (Family Jar)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Tastemaker', 'Salt', 'MSG', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , choose whole-grain noodle options if available. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , prefer unsaturated oils. Tastemaker , contains additives that may affect sensitive people and will affect the organs digestive or immune systems , use fresh seasonings. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. MSG , flavor enhancer that may trigger sensitivity in some and will affect the organs nervous & digestive systems in susceptible individuals , avoid if concerned. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , prefer freshly prepared meals.",
    severityCounts: { low: 2, medium: 4, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','nervous system','liver']
  },
  {
    name: 'Kellogg\'s Crunchy Nut (Bar)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Whole Grain Cereal', 'Nuts', 'Sugar (small)', 'Salt', 'Vitamins'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Whole Grain Cereal , high-fiber base and will affect the organs digestive & metabolic systems beneficially , prefer whole-grain cereals. Nuts , healthy fats & minerals and will affect the organs heart & metabolic system beneficially in moderation , choose unsalted nuts. Sugar (small) , added sugar and will affect the organs pancreas & teeth if present , minimize added sugar. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Vitamins , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet.",
    severityCounts: { low: 3, medium: 1, high: 0 },
    organsAffected: ['digestive system','metabolic system','heart','pancreas','teeth']
  },
  {
    name: 'Dabur Chyawanprash (Travel)',
    category: 'health foods',
    ingredients: ingredients.filter(i =>
      ['Herbal Extracts', 'Sugar', 'Ghee', 'Honey', 'Sesame Oil'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Herbal Extracts , traditional immune-supporting herbs and will affect the organs immune system beneficially for many users , consult a physician if on medication. Sugar , added sugar and will affect the organs pancreas & teeth , reduce intake if diabetic. Ghee , saturated fat and will affect the organs heart when consumed frequently , use sparingly. Honey , natural sweetener but still sugar and will affect the organs teeth & pancreas if overused , use sparingly. Sesame Oil , healthy unsaturated fats and will affect the organs heart beneficially in moderation , prefer cold-pressed oil.",
    severityCounts: { low: 3, medium: 2, high: 1 },
    organsAffected: ['immune system','pancreas','teeth','heart']
  },
  {
    name: 'Tata Salt (Premium Small)',
    category: 'staples',
    ingredients: ingredients.filter(i =>
      ['Salt', 'Iodine'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Salt , essential electrolyte but excess affects blood pressure and will affect the organs cardiovascular system , use in moderation. Iodine , essential for thyroid and will affect the organs endocrine system beneficially where needed , use iodised salt where deficiency risk exists.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['cardiovascular system','endocrine system']
  },
  {
    name: 'Amul Paneer (Rich Pack)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Salt', 'Acidity Regulator', 'Preservative (if any)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy protein & calcium but contains saturated fat & lactose and will affect the organs heart & digestive system depending on fat content , choose low-fat paneer if needed. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Acidity Regulator , stabilizes pH and may affect the organs digestive system in some people , prefer natural acidulants. Preservative (if any) , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free fresh paneer.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['digestive system','heart','cardiovascular system','liver']
  },
  {
    name: 'Kurkure (Fiery Masala Family)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Corn Meal', 'Vegetable Oil', 'Salt', 'Spice Mix', 'Flavorings', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Corn Meal , processed carbohydrate and will affect the organs metabolic system , prefer whole-grain snacks. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , choose healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Spice Mix , flavour & digestive stimulation and will affect the organs digestive system positively in moderation , use natural spices. Flavorings , additives may cause sensitivities and will affect the organs digestive or immune systems in some people , choose natural seasonings. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free products.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Parle Monaco (Butter)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Butter', 'Vegetable Oil', 'Salt', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , use whole-wheat flour instead. Butter , saturated fat and will affect the organs heart when consumed frequently , use light spreads. Vegetable Oil , added fat and will affect the organs heart depending on type , choose unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Leavening Agent , may cause bloating and will affect the organs digestive system , use natural leavening where possible.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system']
  },
  {
    name: 'Britannia NutriChoice Digestive',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Whole Wheat Flour', 'Oats', 'Sugar (small)', 'Vegetable Oil', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Whole Wheat Flour , high-fibre flour and will affect the organs digestive & metabolic systems beneficially , prefer whole-wheat products. Oats , soluble fibre and will affect the organs heart & digestive system beneficially , include rolled/steel-cut oats. Sugar (small) , added sugar and will affect the organs pancreas & teeth if present , minimize added sugar. Vegetable Oil , added fat and will affect the organs heart depending on type , prefer unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt.",
    severityCounts: { low: 4, medium: 1, high: 0 },
    organsAffected: ['digestive system','metabolic system','heart','pancreas','teeth','cardiovascular system']
  },
  {
    name: 'Lays Mint Mischief',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Potato', 'Vegetable Oil', 'Mint Powder', 'Salt', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potato , starchy vegetable and when fried will affect the organs metabolic system , opt for baked options. Vegetable Oil , frying oil and will affect the organs heart depending on type & reuse , use high-oleic oils. Mint Powder , flavouring that may affect digestion in some and will affect the organs digestive system minimally , use fresh mint. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free snacks.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Maggi Noodles (Masala Family Pack)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Tastemaker', 'Salt', 'MSG', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , prefer whole-grain noodles. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , choose unsaturated oils. Tastemaker , flavour mix with additives that may affect sensitive people and will affect the organs digestive or immune systems , use fresh seasonings. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. MSG , flavour enhancer that may trigger sensitivity in some and will affect the organs nervous & digestive systems in susceptible individuals , avoid if sensitive. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer freshly prepared meals.",
    severityCounts: { low: 2, medium: 4, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','nervous system','liver','immune system']
  },
  {
    name: 'Nutella (Family - Hazelnut Spread)',
    category: 'spreads',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Hazelnuts', 'Vegetable Oil', 'Cocoa', 'Skimmed Milk Powder', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , very high added sugar and will affect the organs pancreas & teeth , reduce portion size. Hazelnuts , healthy fats & minerals and will affect the organs heart & metabolic system beneficially in moderation , prefer higher-nut formulations. Vegetable Oil , added fats and will affect the organs heart depending on type , choose unsaturated oils. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially in high-quality cocoa , prefer higher-cocoa options. Skimmed Milk Powder , dairy protein & lactose and will affect the organs digestive system in lactose-intolerant people , use lactose-free alternatives if required. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , opt for minimal-additive spreads.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['pancreas','teeth','heart','digestive system','nervous system']
  },
  {
    name: 'Cadbury Bournville (Dark)',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Cocoa Solids', 'Cocoa Butter', 'Sugar', 'Emulsifier', 'Vanilla'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Cocoa Solids , antioxidant-rich and will affect the organs heart & nervous system beneficially in high-cocoa chocolate , choose dark chocolate. Cocoa Butter , fat component and will affect the organs heart depending on intake , consume in moderation. Sugar , added sugar and will affect the organs pancreas & teeth , minimise sugar. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , prefer low-additive chocolate. Vanilla , flavouring that affects palatability and will affect the organs digestive/immune systems minimally , prefer natural vanilla.",
    severityCounts: { low: 3, medium: 1, high: 0 },
    organsAffected: ['heart','nervous system','pancreas','teeth','digestive system']
  },
  {
    name: 'Amul Taaza (500ml)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Stabilizer', 'Added Vitamins'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , source of protein & calcium but contains lactose & saturated fat and will affect the organs digestive & heart systems depending on fat content , choose toned milk if needed. Stabilizer , processing aid and will affect the organs digestive system minimally in sensitive people , prefer minimal additives. Added Vitamins , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['digestive system','heart','nutritional status']
  },
  {
    name: 'Pringles Original (Small)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Potato Flakes', 'Vegetable Oil', 'Salt', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potato Flakes , processed ingredient and will affect the organs metabolic system , prefer whole potatoes or less-processed snacks. Vegetable Oil , added fats and will affect the organs heart depending on type , prefer unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , choose preservative-free options.",
    severityCounts: { low: 1, medium: 2, high: 0 },
    organsAffected: ['metabolic system','heart','cardiovascular system','liver']
  },
  {
    name: 'Kellogg\'s All-Bran (Oat Mix)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Wheat Bran', 'Oats', 'Sugar (small)', 'Vitamins & Minerals'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Wheat Bran , very high fibre that will affect the organs digestive system beneficially , include for bowel regularity. Oats , soluble fibre and will affect the organs heart & digestive system beneficially , prefer rolled steel-cut oats. Sugar (small) , added sugar and will affect the organs pancreas & teeth if present , minimise added sugar. Vitamins & Minerals , fortification beneficial and will affect the organs nutrient status positively where deficient , follow recommended intake.",
    severityCounts: { low: 3, medium: 1, high: 0 },
    organsAffected: ['digestive system','heart','pancreas','teeth','nutritional status']
  },
  {
    name: 'Maggi Masala (Cup Family)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Tastemaker', 'Salt', 'MSG', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , choose whole-grain alternatives. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , pick unsaturated oils. Tastemaker , contains additives that may affect sensitive people and will affect the organs digestive or immune systems , use fresh seasonings. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. MSG , flavour enhancer that may trigger sensitivity in some and will affect the organs nervous & digestive systems in susceptible individuals , avoid if concerned. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer freshly prepared food.",
    severityCounts: { low: 2, medium: 4, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','nervous system','liver']
  },
  {
    name: 'Bournvita (Sachet)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Malted Barley', 'Sugar', 'Milk Solids', 'Vitamins & Minerals', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Malted Barley , carbohydrate source and will affect the organs metabolic system depending on portion , use moderately. Sugar , added sugar and will affect the organs pancreas & teeth , choose reduced-sugar options. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high intake , use toned milk. Vitamins & Minerals , fortification beneficial and will affect the organs nutrient status positively where deficient , follow recommended intake. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in some people , prefer natural flavors.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system','immune system']
  },
  {
    name: 'Kurkure (Masala Munch - Small)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Corn Meal', 'Vegetable Oil', 'Salt', 'Spice Mix', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Corn Meal , processed carbohydrate and will affect the organs metabolic system , prefer whole-grain snacks. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , choose healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Spice Mix , flavour & digestive stimulation and will affect the organs digestive system positively in moderation , use natural spices. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free options.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Amul Cheese Spread (Small Jar)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Edible Vegetable Oil', 'Salt', 'Emulsifiers', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high intake , prefer low-fat options. Edible Vegetable Oil , added fats and will affect the organs heart depending on type , choose unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Emulsifiers , processing aids that may affect gut microbiota and will affect the organs digestive system in sensitive people , select minimal-emulsifier products. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free spreads.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Tropicana Pineapple (Small)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Pineapple Juice (100%)', 'Vitamin C', 'No Added Sugar'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Pineapple Juice (100%) , natural fruit nutrients but concentrated sugars and will affect the organs pancreas & teeth if overused , prefer whole fruit. Vitamin C , antioxidant & immune support and will affect the organs immune system beneficially where deficient , maintain balanced intake. No Added Sugar , reduces added-sugar load and will affect the organs pancreas & teeth beneficially compared to sugared drinks , choose 100% juice options.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['pancreas','teeth','immune system']
  },
  {
    name: 'Pringles Sour Cream & Onion (Family)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Potato Flakes', 'Vegetable Oil', 'Sour Cream Powder', 'Onion Powder', 'Salt', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potato Flakes , processed carbohydrate and will affect the organs metabolic system , prefer whole potatoes. Vegetable Oil , added fats and will affect the organs heart depending on type , choose unsaturated oils. Sour Cream Powder , dairy-derived flavour with fat & sodium and will affect the organs heart & cardiovascular system in excess , prefer milder seasoning. Onion Powder , flavouring and will affect the organs digestive system minimally , use fresh onion when possible. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , choose preservative-free snacks.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','cardiovascular system','digestive system','liver']
  },
  {
    name: 'Kellogg\'s Muesli (Fruit & Nuts Family)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Oats', 'Dried Fruit', 'Nuts', 'Sugar (small)', 'Vitamins'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fibre and will affect the organs heart & digestive system beneficially , prefer plain oats with fresh fruit. Dried Fruit , concentrated sugars & fibre and will affect the organs teeth & digestive system if overused , use fresh fruit. Nuts , healthy fats & minerals and will affect the organs heart & metabolic system beneficially in moderation , pick unsalted nuts. Sugar (small) , added sugar and will affect the organs pancreas & teeth if present , minimize added sugar. Vitamins , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','teeth','metabolic system']
  },
  {
    name: 'Maggi Oats (Tandoori Cup)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Oats', 'Dehydrated Vegetables', 'Tastemaker', 'Salt', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fibre and will affect the organs heart & digestive system beneficially , include whole oats. Dehydrated Vegetables , convenient nutrients but processed and will affect the organs digestive system moderately , prefer fresh vegetables. Tastemaker , contains additives that may affect sensitive people and will affect the organs digestive or immune systems , use fresh spices. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , choose fresh food options.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','cardiovascular system','liver','immune system']
  },
  {
    name: 'Dabur Honey (Family Squeeze)',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Honey'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Honey , natural sweetener but still sugar and will affect the organs teeth & pancreas if overused , use sparingly and avoid for infants under 1 year.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['teeth','pancreas']
  },
  {
    name: 'Amul Mithai (Barfi Box)',
    category: 'sweets',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Sugar', 'Ghee', 'Nuts', 'Cardamom'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids , dairy concentrated nutrients with saturated fat & lactose and will affect the organs heart & digestive system in high intake , use sparingly. Sugar , added sugar and will affect the organs pancreas & teeth , reduce intake. Ghee , saturated fat and will affect the organs heart adversely when consumed frequently , use small amounts. Nuts , healthy fats & minerals and will affect the organs heart & metabolic system beneficially in moderation , choose unsalted nuts. Cardamom , digestive spice and will affect the organs digestive system positively in moderation , prefer whole cardamom.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','pancreas','teeth','metabolic system']
  },
  {
    name: 'Tata Tea Premium (Family Pack)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Black Tea Leaves', 'Natural Flavors'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Black Tea Leaves , source of caffeine & antioxidants and will affect the organs nervous & cardiovascular systems depending on intake , prefer moderate consumption. Natural Flavors , additives may cause sensitivities and will affect the organs digestive or immune systems in susceptible people , choose plain tea leaves.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['nervous system','cardiovascular system','immune system']
  },
  {
    name: 'Nestle KitKat (Mini Pack)',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour (Wafers)', 'Sugar', 'Vegetable Oil', 'Cocoa', 'Milk Solids', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour (Wafers) , refined carbohydrate and will affect the organs metabolic system , prefer whole-grain wafers. Sugar , added sugar and will affect the organs pancreas & teeth , reduce consumption. Vegetable Oil , added fats and will affect the organs heart depending on type , avoid hydrogenated oils. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially in higher-cocoa chocolate , choose darker variants. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system , prefer low-fat dairy. Emulsifier , processing aid and may affect gut microbiota in sensitive people and will affect the organs digestive system , opt for minimal-additive options.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Kissan Strawberry Jam (Single)',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Strawberry Pulp', 'Sugar', 'Pectin', 'Acidity Regulator', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Strawberry Pulp , natural fruit nutrients & fibre and will affect the organs digestive & immune systems beneficially when from real fruit , prefer whole fruit. Sugar , added sugar and will affect the organs pancreas & teeth , reduce added sugar. Pectin , gelling agent and will affect the organs digestive system beneficially in moderation , use natural pectin. Acidity Regulator , stabilizes pH and may irritate sensitive digestive tracts and will affect the organs digestive system in some people , use natural acidulants. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , choose preservative-free preserves.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['digestive system','immune system','pancreas','teeth','liver']
  },
  {
    name: 'Kellogg\'s Rice Krispies (Snack)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Rice Flakes', 'Sugar (small)', 'Salt', 'Vitamins & Minerals'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Rice Flakes , processed grain and will affect the organs metabolic system depending on portion , prefer whole-grain cereals. Sugar (small) , added sugar and will affect the organs pancreas & teeth if present , minimize added sugar. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Vitamins & Minerals , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','cardiovascular system','nutritional status']
  },
  {
    name: 'Haldiram\'s Potato Chips (Plain)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Potato', 'Vegetable Oil', 'Salt', 'Spice (optional)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potato , starchy vegetable and when fried will affect the organs metabolic system , choose baked or air-fried options. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , pick unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Spice (optional) , flavouring that may affect the organs digestive system in sensitive people minimally , prefer natural spices.",
    severityCounts: { low: 1, medium: 2, high: 0 },
    organsAffected: ['metabolic system','heart','cardiovascular system','digestive system']
  },
  {
    name: 'Britannia Milk Bikis (Family Pack)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Milk Solids', 'Vegetable Oil', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , prefer whole-wheat alternatives. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high intake , choose low-fat dairy. Vegetable Oil , added fat and will affect the organs heart depending on type , prefer unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Maggi Tomato Ketchup (Small)',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Tomato Concentrate', 'Sugar', 'Vinegar', 'Salt', 'Spice', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Tomato Concentrate , source of lycopene and will affect the organs digestive & cardiovascular systems beneficially when from real tomatoes , prefer fresh tomatoes. Sugar , added sugar and will affect the organs pancreas & teeth , choose reduced-sugar ketchup. Vinegar , acidic agent that may irritate sensitive digestive tracts and will affect the organs digestive system in some people , use in moderation. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Spice , natural flavors & digestive stimulation and will affect the organs digestive system positively in moderation , prefer whole spices. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free condiments.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['digestive system','cardiovascular system','pancreas','teeth','liver']
  },
  {
    name: 'Dalda (Cake Maker)',
    category: 'cooking fat',
    ingredients: ingredients.filter(i =>
      ['Hydrogenated Vegetable Oil', 'Emulsifier', 'Antioxidant'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Hydrogenated Vegetable Oil , may contain trans/saturated fats and will affect the organs heart adversely with prolonged intake , avoid hydrogenated fats and use unrefined unsaturated oils instead. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , choose single-ingredient oils. Antioxidant , prevents rancidity and will affect the organs cellular health minimally beneficially , prefer minimally processed oils.",
    severityCounts: { low: 1, medium: 1, high: 1 },
    organsAffected: ['heart','digestive system','cellular health']
  },
  {
    name: 'Tropicana Mixed Fruit (Small)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Mixed Fruit Juice', 'Vitamin C', 'No Added Sugar'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Mixed Fruit Juice , vitamins present but concentrated natural sugars and will affect the organs pancreas & teeth if overconsumed , prefer whole fruits. Vitamin C , antioxidant & immune support and will affect the organs immune system beneficially where deficient , maintain balanced intake. No Added Sugar , reduces added-sugar load and will affect the organs pancreas & teeth beneficially compared to sugared drinks , choose 100% juice without added sugar.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['pancreas','teeth','immune system']
  },
  {
    name: 'Haldiram\'s Sweets (Assorted)',
    category: 'sweets',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Milk Solids', 'Ghee', 'Nuts', 'Cardamom'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , added sugar and will affect the organs pancreas & teeth , limit intake. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high intake , use sparingly. Ghee , saturated fat and will affect the organs heart adversely when consumed frequently , choose small portions. Nuts , healthy fats & minerals and will affect the organs heart & metabolic system beneficially in moderation , prefer unsalted nuts. Cardamom , digestive spice and will affect the organs digestive system positively in moderation , use whole spice.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['pancreas','teeth','heart','digestive system','metabolic system']
  },
  {
    name: 'Kellogg\'s Frosted Flakes',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Corn Flakes', 'Sugar', 'Malt Extract', 'Vitamins & Minerals', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Corn Flakes , processed cereal and will affect the organs metabolic system (higher GI) , prefer whole-grain cereals. Sugar , added sugar and will affect the organs pancreas & teeth , minimize sugar. Malt Extract , flavouring carbohydrate and will affect the organs metabolic system if used in excess , reduce added sweeteners. Vitamins & Minerals , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet. Salt , excess sodium and will affect the organs cardiovascular system , limit salt.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','cardiovascular system']
  },
  {
    name: 'Maggi Sauces (Chilli)',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Tomato Concentrate', 'Sugar', 'Vinegar', 'Chilli', 'Salt', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Tomato Concentrate , source of lycopene and will affect the organs digestive & cardiovascular systems beneficially when from real tomatoes , use fresh tomatoes where possible. Sugar , added sugar and will affect the organs pancreas & teeth , prefer reduced-sugar sauces. Vinegar , acidic agent and may irritate sensitive digestive tracts and will affect the organs digestive system , use in moderation. Chilli , spicy ingredient and may irritate some digestive systems and will affect the organs digestive system in sensitive people , use milder options if needed. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , choose preservative-free sauces.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['digestive system','cardiovascular system','pancreas','teeth','liver']
  },
  {
    name: 'Dabur Chyawanprash (Single Jar)',
    category: 'health foods',
    ingredients: ingredients.filter(i =>
      ['Herbal Extracts', 'Sugar', 'Ghee', 'Honey', 'Sesame Oil'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Herbal Extracts , traditional immune-supporting herbs and will affect the organs immune system beneficially for many users , consult a physician if on medication. Sugar , added sugar and will affect the organs pancreas & teeth , reduce intake if diabetic. Ghee , saturated fat and will affect the organs heart when consumed frequently , use sparingly. Honey , natural sweetener but still sugar and will affect the organs teeth & pancreas if overused , use sparingly. Sesame Oil , healthy unsaturated fats and will affect the organs heart beneficially in moderation , prefer cold-pressed oil.",
    severityCounts: { low: 3, medium: 2, high: 1 },
    organsAffected: ['immune system','pancreas','teeth','heart']
  },
  {
    name: 'Tata Sampann Atta (Whole Wheat)',
    category: 'staples',
    ingredients: ingredients.filter(i =>
      ['Whole Wheat Flour'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Whole Wheat Flour , high-fibre whole grain and will affect the organs digestive & metabolic systems beneficially , use in place of refined flour for better glycemic control.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['digestive system','metabolic system']
  },
  {
    name: 'Kurkure (Chatka Family)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Corn Meal', 'Vegetable Oil', 'Salt', 'Masala Flavor', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Corn Meal , processed carbohydrate and will affect the organs metabolic system , prefer whole-grain snacks. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , choose healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Masala Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in some people , use natural spice blends. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free options.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Amul Fresh Cream (Family)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk Fat', 'Stabilizers', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Fat , saturated fat and will affect the organs heart when consumed in excess , use low-fat alternatives. Stabilizers , processing aids and will affect the organs digestive system minimally in sensitive people , prefer simpler formulations. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , use fresh cream where possible.",
    severityCounts: { low: 1, medium: 1, high: 1 },
    organsAffected: ['heart','digestive system','liver']
  },
  {
    name: 'Kellogg\'s Special K (Fruit)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Rice & Wheat Flakes', 'Dried Fruit', 'Sugar (small)', 'Vitamins & Minerals'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Rice & Wheat Flakes , processed cereals and will affect the organs metabolic system depending on refinement , prefer whole-grain cereals. Dried Fruit , concentrated sugars & fibre and will affect the organs teeth & digestive system if overused , choose fresh fruit. Sugar (small) , added sugar and will affect the organs pancreas & teeth if present , minimize added sugar. Vitamins & Minerals , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['metabolic system','teeth','digestive system','pancreas','nutritional status']
  },
  {
    name: 'Nutrela Soya (Tikki Mix)',
    category: 'protein',
    ingredients: ingredients.filter(i =>
      ['Textured Soya Protein', 'Spice Mix', 'Salt', 'Oil', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Textured Soya Protein , high plant-protein and will affect the organs muscular & metabolic systems beneficially , use as vegetarian protein source. Spice Mix , flavour & digestive stimulation and will affect the organs digestive system positively in moderation , prefer natural spices. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Oil , added fat and will affect the organs heart depending on type & reuse , choose unsaturated oils. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free options.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['muscular system','metabolic system','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Bingo Mad Angles (Chaat)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Salt', 'Chaat Seasoning', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , prefer whole-grain alternatives. Vegetable Oil , frying/added fat and will affect the organs heart depending on type , choose unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Chaat Seasoning , spice mix that may irritate sensitive digestive tracts and will affect the organs digestive system in some people , use milder whole spices. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , select preservative-free snacks.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Amul Cheese (Spreadable Tube)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Edible Vegetable Oil', 'Salt', 'Emulsifiers', 'Preservatives'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high intake , choose low-fat or natural cheeses. Edible Vegetable Oil , added fats and will affect the organs heart depending on type , prefer unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Emulsifiers , processing aids that may affect gut microbiota and will affect the organs digestive system in sensitive people , pick minimal-emulsifier products. Preservatives , extend shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free spreads when possible.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Tropicana Pomegranate (Small)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Pomegranate Juice (100%)', 'Vitamin C'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Pomegranate Juice (100%) , antioxidant-rich but concentrated sugar and will affect the organs pancreas & teeth if overused , prefer whole fruit. Vitamin C , antioxidant & immune support and will affect the organs immune system beneficially where deficient , maintain balanced intake.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['pancreas','teeth','immune system']
  },
  {
    name: 'Haldiram\'s Aloo Bhujia (Snack)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Potato', 'Gram Flour', 'Vegetable Oil', 'Salt', 'Spices', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potato , starchy base and when fried will affect the organs metabolic system , prefer baked options. Gram Flour , legume protein & fibre and will affect the organs digestive & metabolic systems beneficially when roasted , include as protein-rich snack. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , choose healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Spices , flavour & digestive stimulation and will affect the organs digestive system positively in moderation , use natural spices. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free mixes.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','digestive system','heart','cardiovascular system','liver']
  },
  {
    name: 'Britannia 50-50 (Snack Pack)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Vegetable Oil', 'Milk Solids', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , prefer whole-grain flour. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Vegetable Oil , added fat and will affect the organs heart depending on type , choose unsaturated oils. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system , choose low-fat dairy. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , select minimal-additive products.",
    severityCounts: { low: 3, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Parle G (Classic)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Edible Vegetable Oil', 'Salt', 'Leavening Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , use whole-wheat flour instead. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Edible Vegetable Oil , added fat and will affect the organs heart depending on type , choose unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Leavening Agent , may cause bloating and will affect the organs digestive system , use natural leavening instead.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system','cardiovascular system']
  },
  {
    name: 'Sunfeast Dark Fantasy (Choco Cream)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Vegetable Oil', 'Cocoa Solids', 'Filling (Sugar & Fat)', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , use whole-grain flour instead. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Vegetable Oil , added fat and will affect the organs heart depending on type , prefer unsaturated oils. Cocoa Solids , antioxidant potential and will affect the organs heart & nervous system beneficially when cocoa % is higher , choose higher-cocoa. Filling (Sugar & Fat) , concentrated sugar & fat and will affect the organs pancreas & heart , limit intake. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick fresh bakery items.",
    severityCounts: { low: 2, medium: 4, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','liver','nervous system']
  },
  {
    name: 'Lays American Style Cream & Onion',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Potato', 'Vegetable Oil', 'Salt', 'Cream Powder', 'Onion Powder', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potato , starchy vegetable and when fried will affect the organs metabolic system , prefer baked potato snacks. Vegetable Oil , frying oil and will affect the organs heart depending on type & reuse , choose healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Cream Powder , dairy-derived flavor with fat & sodium and will affect the organs heart & cardiovascular system in excess , prefer milder seasoning. Onion Powder , processed flavor and will affect the organs digestive system minimally , use fresh onion. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free snacks.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','cardiovascular system','digestive system','liver']
  },
  {
    name: 'Maggi 2-Minute Noodles (Masala Family)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Tastemaker', 'Salt', 'MSG', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , opt for whole-grain noodles. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , prefer unsaturated oils. Tastemaker , contains additives and will affect the organs digestive or immune systems in sensitive individuals , use fresh seasonings. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. MSG , flavor enhancer that may trigger sensitivity in some and will affect the organs nervous & digestive systems in susceptible people , avoid if sensitive. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer fresh meals.",
    severityCounts: { low: 2, medium: 4, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','nervous system','liver','immune system']
  },
  {
    name: 'Nutella (Spread Small)',
    category: 'spreads',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Hazelnuts', 'Vegetable Oil', 'Cocoa', 'Skimmed Milk Powder', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , very high added sugar and will affect the organs pancreas & teeth , reduce portion size. Hazelnuts , healthy fats & minerals and will affect the organs heart & metabolic system beneficially in moderation , prefer higher-nut options. Vegetable Oil , added fat and will affect the organs heart depending on type , choose unsaturated oils. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially in quality cocoa , prefer higher-cocoa content. Skimmed Milk Powder , dairy protein & lactose and will affect the organs digestive system in lactose-intolerant people , use lactose-free alternatives if required. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , opt for minimal-additive spreads.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['pancreas','teeth','heart','digestive system','nervous system']
  },
  {
    name: 'Cadbury Dairy Milk (Tiny)',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Sugar', 'Milk Solids', 'Cocoa', 'Emulsifier', 'Flavor'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Sugar , added sugar and will affect the organs pancreas & teeth , limit consumption. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system in high intake , choose lower-fat options. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially in higher-cocoa chocolate , prefer darker choices. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , select minimal-additive chocolate. Flavor , additives may cause sensitivities and will affect the organs digestive or immune systems in susceptible individuals , use natural flavoring where possible.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['pancreas','teeth','heart','digestive system','nervous system']
  },
  {
    name: 'Amul Taaza (Long Life)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Stabilizer', 'Added Vitamins'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , source of protein & calcium but contains lactose & saturated fat and will affect the organs digestive & heart systems depending on fat content , choose toned milk if needed. Stabilizer , processing aid and will affect the organs digestive system minimally in sensitive people , prefer minimal additives. Added Vitamins , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['digestive system','heart','nutritional status']
  },
  {
    name: 'Tropicana Mixed Fruit (Large)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Mixed Fruit Juice', 'Vitamin C', 'No Added Sugar'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Mixed Fruit Juice , contains concentrated natural sugars and will affect the organs pancreas & teeth if overconsumed , prefer whole fruits. Vitamin C , antioxidant & immune support and will affect the organs immune system beneficially where deficient , maintain balanced intake. No Added Sugar , reduces added-sugar load and will affect the organs pancreas & teeth beneficially compared to sugared drinks , choose 100% juice.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['pancreas','teeth','immune system']
  },
  {
    name: 'Kurkure (Multigrain)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Corn Meal', 'Vegetable Oil', 'Multigrain Flour', 'Salt', 'Spice Mix', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Corn Meal , processed carbohydrate and will affect the organs metabolic system , prefer whole-grain snacks. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , choose unsaturated oils. Multigrain Flour , may add fibre & nutrients and will affect the organs digestive & metabolic systems beneficially compared to refined flour , prefer true whole grains. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Spice Mix , flavour & digestive stimulation and will affect the organs digestive system positively in moderation , use natural spices. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free products.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Quaker Oats (Plain)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Oats'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fibre and will affect the organs heart & digestive system beneficially , prefer plain oats with fresh fruit as healthier breakfast alternative.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['heart','digestive system']
  },
  {
    name: 'Peanut Butter (Crunchy)',
    category: 'spreads',
    ingredients: ingredients.filter(i =>
      ['Roasted Peanuts', 'Salt', 'Sugar (optional)', 'Oil (if added)'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Roasted Peanuts , rich in protein & healthy fats and will affect the organs heart & metabolic system beneficially in moderation , prefer 100% peanuts. Salt , excess sodium and will affect the organs cardiovascular system , use low-salt versions. Sugar (optional) , added sugar and will affect the organs pancreas & teeth if included , avoid added sugar. Oil (if added) , additional fat and will affect the organs heart depending on type , choose no-added-oil peanut butter where possible.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['heart','metabolic system','cardiovascular system','pancreas','teeth']
  },
  {
    name: 'Cadbury Bournville (Small)',
    category: 'confectionery',
    ingredients: ingredients.filter(i =>
      ['Cocoa Solids', 'Cocoa Butter', 'Sugar', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Cocoa Solids , antioxidant-rich and will affect the organs heart & nervous system beneficially in high-cocoa chocolate , choose darker varieties. Cocoa Butter , fat component and will affect the organs heart depending on intake , consume in moderation. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , pick low-additive chocolate.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['heart','nervous system','pancreas','teeth','digestive system']
  },
  {
    name: 'Amul Cheese (Block Medium)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Milk', 'Salt', 'Emulsifier', 'Anti-caking Agent'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk , dairy nutrient with saturated fat & lactose and will affect the organs heart & digestive system in high intake , choose lower-fat cheese when appropriate. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , prefer natural cheeses. Anti-caking Agent , processing aid and will affect the organs digestive system minimally in sensitive people , choose minimally processed products.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['heart','digestive system','cardiovascular system']
  },
  {
    name: 'Kissan Mango Crush (Jar)',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Mango Pulp', 'Sugar', 'Pectin', 'Acidity Regulator', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Mango Pulp , fruit nutrients & flavour but concentrated natural sugar and will affect the organs pancreas & teeth if overused , prefer whole mango. Sugar , added sugar and will affect the organs pancreas & teeth , choose reduced-sugar variants. Pectin , gelling agent and will affect the organs digestive system beneficially in moderation , use natural pectin. Acidity Regulator , stabilizer that may irritate sensitive digestive tracts and will affect the organs digestive system in some people , prefer natural acidulants. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free spreads.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['pancreas','teeth','digestive system','liver']
  },
  {
    name: 'Kellogg\'s Corn Flakes (Mini)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Corn Flakes', 'Sugar (small)', 'Salt', 'Vitamins & Minerals'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Corn Flakes , processed cereal and will affect the organs metabolic system due to higher GI , prefer whole-grain cereals. Sugar (small) , added sugar and will affect the organs pancreas & teeth if present , minimize sugar. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Vitamins & Minerals , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet.",
    severityCounts: { low: 2, medium: 1, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','cardiovascular system','nutritional status']
  },
  {
    name: 'Pringles BBQ (Family)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Potato Flakes', 'Vegetable Oil', 'BBQ Seasoning', 'Salt', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Potato Flakes , processed ingredient and will affect the organs metabolic system , prefer whole potatoes. Vegetable Oil , added fats and will affect the organs heart depending on type , choose unsaturated oils. BBQ Seasoning , processed flavouring with additives and will affect the organs digestive or immune systems in sensitive people , opt for natural seasonings. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free snacks.",
    severityCounts: { low: 1, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','cardiovascular system','digestive system','liver']
  },
  {
    name: 'Maggi Oats (Masala Family)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Oats', 'Vegetable Oil', 'Tastemaker', 'Salt', 'MSG', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fibre and will affect the organs heart & digestive system beneficially compared to refined flour , prefer oats versions. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , choose unsaturated oils. Tastemaker , contains additives that may affect sensitive people and will affect the organs digestive or immune systems , use fresh spices. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. MSG , flavour enhancer that may trigger sensitivity in some and will affect the organs nervous & digestive systems in susceptible individuals , avoid if sensitive. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer freshly prepared meals.",
    severityCounts: { low: 3, medium: 3, high: 0 },
    organsAffected: ['heart','digestive system','cardiovascular system','nervous system','liver','immune system']
  },
  {
    name: 'Amul Mithai (Rasgulla Box Small)',
    category: 'sweets',
    ingredients: ingredients.filter(i =>
      ['Milk Solids', 'Sugar', 'Stabilizer', 'Cardamom'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Milk Solids , dairy concentrated nutrients and will affect the organs heart & digestive system in high intake , prefer moderation. Sugar , added sugar and will affect the organs pancreas & teeth , limit consumption. Stabilizer , processing aid and will affect the organs digestive system minimally in sensitive people , prefer natural thickeners. Cardamom , digestive spice and will affect the organs digestive system positively in moderation , use whole spice.",
    severityCounts: { low: 2, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','pancreas','teeth']
  },
  {
    name: 'Dabur Honey (Premium Jar)',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Honey'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Honey , natural sweetener but still sugar and will affect the organs teeth & pancreas if overused , use sparingly and avoid for infants under 1 year.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['teeth','pancreas']
  },
  {
    name: 'Kellogg\'s Muesli (Classic)',
    category: 'breakfast',
    ingredients: ingredients.filter(i =>
      ['Oats', 'Dried Fruit', 'Nuts', 'Sugar (small)', 'Vitamins'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Oats , soluble fibre and will affect the organs heart & digestive system beneficially , prefer plain oats with fresh fruit. Dried Fruit , concentrated sugars & fibre and will affect the organs teeth & digestive system if overused , choose fresh fruit. Nuts , healthy fats & minerals and will affect the organs heart & metabolic system beneficially in moderation , pick unsalted nuts. Sugar (small) , added sugar and will affect the organs pancreas & teeth if present , minimize added sugar. Vitamins , fortification beneficial and will affect the organs nutrient status positively where deficient , maintain balanced diet.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['heart','digestive system','teeth','metabolic system']
  },
  {
    name: 'Bingo (Mad Angles - Mexican Chili)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Salt', 'Chili Powder', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carbohydrate and will affect the organs metabolic system , prefer whole-grain alternatives. Vegetable Oil , frying/added fat and will affect the organs heart depending on type , choose unsaturated oils. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Chili Powder , spicy component that may irritate sensitive digestive tracts and will affect the organs digestive system in some people , use milder spices. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free snacks.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Amul Butter (Tiny)',
    category: 'dairy',
    ingredients: ingredients.filter(i =>
      ['Cream', 'Salt'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Cream , concentrated saturated fat and will affect the organs heart when consumed frequently , use light spreads or small amounts. Salt , excess sodium and will affect the organs cardiovascular system , limit salt.",
    severityCounts: { low: 1, medium: 1, high: 0 },
    organsAffected: ['heart','cardiovascular system']
  },
  {
    name: 'Kurkure (Masala Munch - Single)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Refined Corn Meal', 'Vegetable Oil', 'Salt', 'Spice Mix', 'Flavor Enhancers', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Corn Meal , processed carbohydrate and will affect the organs metabolic system , prefer whole-grain snacks. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , select healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. Spice Mix , flavour & digestive stimulation and will affect the organs digestive system positively in moderation , use natural spices. Flavor Enhancers , additives may trigger sensitivities and will affect the organs nervous & digestive systems in susceptible people , opt for clean-label seasonings. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free options.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','liver']
  },
  {
    name: 'Tata Tea (Green Tea Bags)',
    category: 'beverages',
    ingredients: ingredients.filter(i =>
      ['Green Tea Leaves'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Green Tea Leaves , antioxidant-rich beverage and will affect the organs cardiovascular & metabolic systems beneficially in moderation , drink plain or with minimal sweeteners for benefit.",
    severityCounts: { low: 1, medium: 0, high: 0 },
    organsAffected: ['cardiovascular system','metabolic system']
  },
  {
    name: 'Kissan Tomato Ketchup (Family)',
    category: 'condiments',
    ingredients: ingredients.filter(i =>
      ['Tomato Concentrate', 'Sugar', 'Vinegar', 'Salt', 'Spice', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Tomato Concentrate , source of lycopene and will affect the organs digestive & cardiovascular systems beneficially when from real tomatoes , prefer fresh tomatoes. Sugar , added sugar and will affect the organs pancreas & teeth , choose reduced-sugar ketchup. Vinegar , acidic agent and may irritate sensitive digestive tracts and will affect the organs digestive system in some people , use in moderation. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Spice , natural flavours & digestive stimulation and will affect the organs digestive system positively in moderation , use whole spices. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free condiments.",
    severityCounts: { low: 2, medium: 3, high: 0 },
    organsAffected: ['digestive system','cardiovascular system','pancreas','teeth','liver']
  },
  {
    name: 'Haldiram\'s Bhujia (Snack Pack)',
    category: 'snacks',
    ingredients: ingredients.filter(i =>
      ['Gram Flour', 'Vegetable Oil', 'Salt', 'Spices', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Gram Flour , legume protein & fibre and will affect the organs digestive & metabolic systems beneficially when roasted , include as nutrient-dense snack. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , choose healthier oils. Salt , excess sodium and will affect the organs cardiovascular system , limit salt. Spices , flavour & digestive stimulation and will affect the organs digestive system positively in moderation , use natural spices. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , pick preservative-free options.",
    severityCounts: { low: 3, medium: 2, high: 0 },
    organsAffected: ['digestive system','metabolic system','heart','cardiovascular system','liver']
  },
  {
    name: 'Britannia Little Hearts (Chocolate)',
    category: 'bakery',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Sugar', 'Vegetable Oil', 'Cocoa', 'Milk Solids', 'Emulsifier'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , prefer whole-wheat flour. Sugar , added sugar and will affect the organs pancreas & teeth , reduce sugar. Vegetable Oil , added fats and will affect the organs heart depending on type , choose unsaturated oils. Cocoa , antioxidant potential and will affect the organs heart & nervous system beneficially in higher-cocoa options , prefer higher-cocoa. Milk Solids , dairy saturated fat & lactose and will affect the organs heart & digestive system , choose low-fat dairy. Emulsifier , processing aid that may affect gut microbiota in sensitive people and will affect the organs digestive system , select minimal-additive items.",
    severityCounts: { low: 3, medium: 3, high: 0 },
    organsAffected: ['metabolic system','pancreas','teeth','heart','digestive system']
  },
  {
    name: 'Maggi Tomato Noodles (Cup)',
    category: 'instant foods',
    ingredients: ingredients.filter(i =>
      ['Refined Wheat Flour', 'Vegetable Oil', 'Tastemaker (Tomato)', 'Salt', 'MSG', 'Preservative'].includes(i.ingredient_name)
    ).map(i => i._id),
    summary: "Refined Wheat Flour , refined carb and will affect the organs metabolic system , choose whole-grain noodles where available. Vegetable Oil , frying fat and will affect the organs heart depending on type & reuse , pick unsaturated oils. Tastemaker (Tomato) , flavour mix with additives and will affect the organs digestive or immune systems in sensitive people , prefer fresh seasoning. Salt , excess sodium and will affect the organs cardiovascular system , reduce salt. MSG , flavour enhancer that may trigger sensitivity in some and will affect the organs nervous & digestive systems in susceptible individuals , avoid if sensitive. Preservative , extends shelf life and will affect the organs liver & digestive system with chronic exposure , prefer freshly prepared meals.",
    severityCounts: { low: 2, medium: 4, high: 0 },
    organsAffected: ['metabolic system','heart','digestive system','cardiovascular system','nervous system','liver']
  }
]

    await Product.insertMany(demoProducts)
    console.log(`✓ Seeded ${demoProducts.length} demo products`)

    console.log('\n✅ Database seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seed error:', error)
    process.exit(1)
  }
}

seedDatabase()

