/* ==========================================================================
   Mitti Fresh - Dynamic Application Script
   ========================================================================== */

// --- PRODUCT DATABASE ---
const PRODUCTS = [
  // Goal-Based Atta Blends
  {
    id: "multigrain-atta-special",
    name: "Multigrain Atta (Goal-Based)",
    category: "atta-specialty",
    description: "Formulated for overall nutrition and better digestion. A wholesome blend of grains.",
    basePrice: 70,
    unit: "kg",
    sizes: [
      { name: "1 kg (Trial)", value: "1kg", price: 70, mrp: 85 },
      { name: "5 kg (Family Pack)", value: "5kg", price: 350, mrp: 400 },
      { name: "10 kg (Value Pack)", value: "10kg", price: 690, mrp: 790 }
    ],
    image: "assets/multigrain_atta.jpg",
    badge: "100% Whole Grains",
    badgeType: "bestseller",
    ingredients: "Wheat (3.75 kg), Chana (300 g), Soybean (200 g), Oats (150 g), Jau (200 g), Ragi (150 g), Makka (125 g), Jowar (75 g), Bajra (50 g) [ratio for 5kg pack]",
    benefits: "High Fibre, Better Digestion, Rich in Vitamins & Minerals",
    nutrition: {
      energy: "362 kcal",
      protein: "14.2 g",
      carbohydrates: "68.4 g",
      fat: "2.8 g",
      dietary_fiber: "11.5 g"
    }
  },
  {
    id: "high-protein-atta",
    name: "High Protein Atta",
    category: "atta-specialty",
    description: "Designed for fitness enthusiasts and active lifestyles. Supports muscle growth.",
    basePrice: 80,
    unit: "kg",
    sizes: [
      { name: "1 kg (Trial)", value: "1kg", price: 80, mrp: 95 },
      { name: "5 kg (Family Pack)", value: "5kg", price: 400, mrp: 460 },
      { name: "10 kg (Value Pack)", value: "10kg", price: 780, mrp: 890 }
    ],
    image: "assets/multigrain_atta.jpg",
    badge: "Fitness Choice",
    badgeType: "new",
    ingredients: "Wheat (2.90 kg), Chana (900 g), Soybean (600 g), Oats (200 g), Jau (150 g), Ragi (100 g), Jowar (75 g), Bajra (75 g) [ratio for 5kg pack]",
    benefits: "High in Protein, Muscle Growth & Recovery, Natural Energy Booster",
    nutrition: {
      energy: "374 kcal",
      protein: "19.5 g",
      carbohydrates: "61.2 g",
      fat: "3.2 g",
      dietary_fiber: "9.8 g"
    }
  },
  {
    id: "weight-loss-atta",
    name: "Weight Loss Atta",
    category: "atta-specialty",
    description: "High-fiber dietary formulation that keeps you full longer to support weight management.",
    basePrice: 80,
    unit: "kg",
    sizes: [
      { name: "1 kg (Trial)", value: "1kg", price: 80, mrp: 95 },
      { name: "5 kg (Family Pack)", value: "5kg", price: 400, mrp: 460 },
      { name: "10 kg (Value Pack)", value: "10kg", price: 780, mrp: 890 }
    ],
    image: "assets/multigrain_atta.jpg",
    badge: "Weight Control",
    badgeType: "accent",
    ingredients: "Wheat (2.80 kg), Oats (600 g), Jau (600 g), Chana (500 g), Soybean (300 g), Flaxseed (200 g) [ratio for 5kg pack]",
    benefits: "High Fibre, High Protein, Supports Healthy Weight, Better Digestion",
    nutrition: {
      energy: "358 kcal",
      protein: "16.8 g",
      carbohydrates: "58.4 g",
      fat: "4.8 g",
      dietary_fiber: "14.2 g"
    }
  },
  {
    id: "sugar-balance-atta",
    name: "Sugar Balance Atta",
    category: "atta-specialty",
    description: "Low glycemic index conscious blend. Formulated to help reduce daily sugar spikes.",
    basePrice: 80,
    unit: "kg",
    sizes: [
      { name: "1 kg (Trial)", value: "1kg", price: 80, mrp: 95 },
      { name: "5 kg (Family Pack)", value: "5kg", price: 400, mrp: 460 },
      { name: "10 kg (Value Pack)", value: "10kg", price: 780, mrp: 890 }
    ],
    image: "assets/multigrain_atta.jpg",
    badge: "Sugar Conscious",
    badgeType: "green",
    ingredients: "Wheat (2.70 kg), Jau (750 g), Oats (500 g), Chana (500 g), Soybean (300 g), Flaxseed (150 g), Ragi (100 g) [ratio for 5kg pack]",
    benefits: "Helps Reduce Sugar Spikes, Supports Heart Health, High Fibre",
    nutrition: {
      energy: "354 kcal",
      protein: "15.4 g",
      carbohydrates: "59.8 g",
      fat: "4.1 g",
      dietary_fiber: "13.6 g"
    }
  },
  {
    id: "heart-care-atta",
    name: "Heart Care Atta",
    category: "atta-specialty",
    description: "Flaxseed fortified wheat blend rich in heart-healthy plant-based Omega-3 fatty acids.",
    basePrice: 85,
    unit: "kg",
    sizes: [
      { name: "1 kg (Trial)", value: "1kg", price: 85, mrp: 99 },
      { name: "5 kg (Family Pack)", value: "5kg", price: 425, mrp: 490 },
      { name: "10 kg (Value Pack)", value: "10kg", price: 830, mrp: 950 }
    ],
    image: "assets/multigrain_atta.jpg",
    badge: "Cardio Care",
    badgeType: "accent",
    ingredients: "Wheat (3.00 kg), Oats (600 g), Jau (600 g), Flaxseed (300 g), Chana (500 g) [ratio for 5kg pack]",
    benefits: "Rich in Fibre, Omega-3 from Flaxseed, Helps Maintain Cholesterol",
    nutrition: {
      energy: "368 kcal",
      protein: "14.8 g",
      carbohydrates: "62.4 g",
      fat: "5.6 g",
      dietary_fiber: "12.2 g"
    }
  },
  {
    id: "kids-growth-atta",
    name: "Kids Growth Atta",
    category: "atta-specialty",
    description: "Fortified with finger millets and legumes. High calcium and iron for active growth.",
    basePrice: 80,
    unit: "kg",
    sizes: [
      { name: "1 kg (Trial)", value: "1kg", price: 80, mrp: 95 },
      { name: "5 kg (Family Pack)", value: "5kg", price: 400, mrp: 460 },
      { name: "10 kg (Value Pack)", value: "10kg", price: 780, mrp: 890 }
    ],
    image: "assets/multigrain_atta.jpg",
    badge: "For Active Kids",
    badgeType: "new",
    ingredients: "Wheat (3.40 kg), Chana (700 g), Ragi (400 g), Oats (300 g), Soybean (200 g) [ratio for 5kg pack]",
    benefits: "High Protein, Rich in Calcium, Rich in Iron, Healthy Growth",
    nutrition: {
      energy: "364 kcal",
      protein: "15.1 g",
      carbohydrates: "64.2 g",
      fat: "3.5 g",
      dietary_fiber: "10.4 g"
    }
  },
  {
    id: "gut-health-atta",
    name: "Gut Health Atta",
    category: "atta-specialty",
    description: "Digestive wellness formulation rich in natural prebiotics and high quality dietary fibers.",
    basePrice: 85,
    unit: "kg",
    sizes: [
      { name: "1 kg (Trial)", value: "1kg", price: 85, mrp: 99 },
      { name: "5 kg (Family Pack)", value: "5kg", price: 425, mrp: 490 },
      { name: "10 kg (Value Pack)", value: "10kg", price: 830, mrp: 950 }
    ],
    image: "assets/multigrain_atta.jpg",
    badge: "Digestive Care",
    badgeType: "green",
    ingredients: "Wheat (2.80 kg), Oats (700 g), Jau (600 g), Chana (600 g), Flaxseed (300 g) [ratio for 5kg pack]",
    benefits: "High Fibre, Supports Digestive Health, Promotes Regular Bowels",
    nutrition: {
      energy: "360 kcal",
      protein: "14.6 g",
      carbohydrates: "61.8 g",
      fat: "4.9 g",
      dietary_fiber: "15.8 g"
    }
  },

  // Chakki Flours & Grains
  {
    id: "mp-sharbhati-atta",
    name: "MP Sharbhati Atta",
    category: "atta-grains",
    description: "Premium stone-ground wheat flour sourced from Sharbhati wheat grains. Super soft rotis.",
    basePrice: 55,
    unit: "kg",
    sizes: [
      { name: "1 kg", value: "1kg", price: 55, mrp: 65 },
      { name: "5 kg", value: "5kg", price: 275, mrp: 320 },
      { name: "10 kg", value: "10kg", price: 540, mrp: 620 }
    ],
    image: "assets/wheat_atta.jpg",
    badge: "Bestseller",
    badgeType: "bestseller",
    ingredients: "100% Premium MP Sharbhati Wheat Grains",
    nutrition: {
      energy: "348 kcal",
      protein: "11.8 g",
      carbohydrates: "72.4 g",
      fat: "1.6 g",
      dietary_fiber: "10.8 g"
    }
  },
  {
    id: "mp-atta-regular",
    name: "MP Atta (Regular)",
    category: "atta-grains",
    description: "Freshly stone-milled whole wheat flour. Balanced nutrition for daily home meals.",
    basePrice: 48,
    unit: "kg",
    sizes: [
      { name: "1 kg", value: "1kg", price: 48, mrp: 55 },
      { name: "5 kg", value: "5kg", price: 240, mrp: 270 },
      { name: "10 kg", value: "10kg", price: 470, mrp: 530 }
    ],
    image: "assets/wheat_atta.jpg",
    ingredients: "100% Whole Wheat Grains",
    nutrition: {
      energy: "340 kcal",
      protein: "10.2 g",
      carbohydrates: "73.2 g",
      fat: "1.4 g",
      dietary_fiber: "10.2 g"
    }
  },
  {
    id: "multigrain-atta-regular",
    name: "Multigrain Atta (Regular)",
    category: "atta-grains",
    description: "Standard daily multigrain flour ground fresh from selected local grains.",
    basePrice: 70,
    unit: "kg",
    sizes: [
      { name: "1 kg", value: "1kg", price: 70, mrp: 80 },
      { name: "5 kg", value: "5kg", price: 350, mrp: 395 },
      { name: "10 kg", value: "10kg", price: 690, mrp: 780 }
    ],
    image: "assets/multigrain_atta.jpg",
    ingredients: "Wheat, Chana, Oats, Soybean, Jau",
    nutrition: {
      energy: "356 kcal",
      protein: "13.6 g",
      carbohydrates: "69.1 g",
      fat: "2.1 g",
      dietary_fiber: "11.2 g"
    }
  },
  {
    id: "besan",
    name: "Besan (Gram Flour)",
    category: "atta-grains",
    description: "100% pure stone-milled Bengal gram flour. No yellow peas added. Authentic taste.",
    basePrice: 130,
    unit: "kg",
    sizes: [
      { name: "1 kg", value: "1kg", price: 130, mrp: 150 },
      { name: "5 kg", value: "5kg", price: 650, mrp: 720 }
    ],
    image: "assets/wheat_atta.jpg",
    ingredients: "100% Stone-Ground Chana Dal Grains",
    nutrition: {
      energy: "387 kcal",
      protein: "22.4 g",
      carbohydrates: "57.8 g",
      fat: "5.0 g",
      dietary_fiber: "10.8 g"
    }
  },
  {
    id: "channa-roasted",
    name: "Sattu (Roasted Gram Flour)",
    category: "atta-grains",
    description: "Nutritious roasted chana sattu. High protein, cooling, and great for summer beverages.",
    basePrice: 110,
    unit: "kg",
    sizes: [
      { name: "1 kg", value: "1kg", price: 110, mrp: 130 },
      { name: "5 kg", value: "5kg", price: 550, mrp: 620 }
    ],
    image: "assets/wheat_atta.jpg",
    badge: "Bestseller",
    badgeType: "bestseller",
    ingredients: "100% Stone-Ground Roasted Bengal Gram (Chana)",
    nutrition: {
      energy: "410 kcal",
      protein: "23.8 g",
      carbohydrates: "58.2 g",
      fat: "6.2 g",
      dietary_fiber: "11.8 g"
    }
  },
  {
    id: "bajra-flour",
    name: "Bajra (Pearl Millet)",
    category: "atta-grains",
    description: "Freshly ground pearl millet flour. Highly warming, rich in iron, perfect for winters.",
    basePrice: 50,
    unit: "kg",
    sizes: [
      { name: "1 kg", value: "1kg", price: 50, mrp: 60 },
      { name: "5 kg", value: "5kg", price: 250, mrp: 290 }
    ],
    image: "assets/wheat_atta.jpg",
    ingredients: "100% Stone-Ground Pearl Millet (Bajra) Grains",
    nutrition: {
      energy: "361 kcal",
      protein: "11.6 g",
      carbohydrates: "67.5 g",
      fat: "5.0 g",
      dietary_fiber: "8.5 g"
    }
  },
  {
    id: "makka-flour",
    name: "Makka (Maize / Corn)",
    category: "atta-grains",
    description: "Stone-ground yellow maize flour. Traditional rich texture for makki ki roti.",
    basePrice: 60,
    unit: "kg",
    sizes: [
      { name: "1 kg", value: "1kg", price: 60, mrp: 70 },
      { name: "5 kg", value: "5kg", price: 300, mrp: 340 }
    ],
    image: "assets/wheat_atta.jpg",
    ingredients: "100% Stone-Ground Yellow Maize (Corn) Grains",
    nutrition: {
      energy: "365 kcal",
      protein: "9.4 g",
      carbohydrates: "74.3 g",
      fat: "3.6 g",
      dietary_fiber: "7.3 g"
    }
  },
  {
    id: "soya-flour",
    name: "Soya (Soybean Flour)",
    category: "atta-grains",
    description: "Finely milled soybean flour. Excellent source of plant protein to blend with regular atta.",
    basePrice: 120,
    unit: "kg",
    sizes: [
      { name: "1 kg", value: "1kg", price: 120, mrp: 140 }
    ],
    image: "assets/wheat_atta.jpg",
    ingredients: "100% Pure Soybean Grains",
    nutrition: {
      energy: "441 kcal",
      protein: "36.5 g",
      carbohydrates: "30.2 g",
      fat: "20.1 g",
      dietary_fiber: "9.3 g"
    }
  },
  {
    id: "alsi-flour",
    name: "Alsi (Flaxseed Flour)",
    category: "atta-grains",
    description: "100% pure flaxseed powder. Ground fresh to keep natural oils and healthy fats intact.",
    basePrice: 280,
    unit: "kg",
    sizes: [
      { name: "1 kg", value: "1kg", price: 280, mrp: 320 }
    ],
    image: "assets/wheat_atta.jpg",
    ingredients: "100% Pure Flaxseeds (Alsi)",
    nutrition: {
      energy: "534 kcal",
      protein: "18.3 g",
      carbohydrates: "28.9 g",
      fat: "42.2 g",
      dietary_fiber: "27.3 g"
    }
  },
  {
    id: "daliya",
    name: "Daliya (Broken Wheat)",
    category: "atta-grains",
    description: "Coarsely ground whole wheat grains. Rich in dietary fiber, clean and nutritious.",
    basePrice: 70,
    unit: "kg",
    sizes: [
      { name: "1 kg", value: "1kg", price: 70, mrp: 80 },
      { name: "5 kg", value: "5kg", price: 350, mrp: 390 }
    ],
    image: "assets/wheat_atta.jpg",
    ingredients: "100% Premium Cracked Whole Wheat Grains",
    nutrition: {
      energy: "342 kcal",
      protein: "12.4 g",
      carbohydrates: "71.8 g",
      fat: "1.5 g",
      dietary_fiber: "11.2 g"
    }
  },
  {
    id: "jou-flour",
    name: "Jou (Barley)",
    category: "atta-grains",
    description: "Freshly milled barley flour. Supports healthy digestion and metabolic wellness.",
    basePrice: 60,
    unit: "kg",
    sizes: [
      { name: "1 kg", value: "1kg", price: 60, mrp: 70 },
      { name: "5 kg", value: "5kg", price: 300, mrp: 340 }
    ],
    image: "assets/wheat_atta.jpg",
    ingredients: "100% Stone-Ground Barley (Jou) Grains",
    nutrition: {
      energy: "354 kcal",
      protein: "12.5 g",
      carbohydrates: "73.5 g",
      fat: "2.3 g",
      dietary_fiber: "17.3 g"
    }
  },
  {
    id: "jowar-flour",
    name: "Jowar (Sorghum)",
    category: "atta-grains",
    description: "Stone-ground sorghum flour. Naturally gluten-free, light, and easy to digest.",
    basePrice: 60,
    unit: "kg",
    sizes: [
      { name: "1 kg", value: "1kg", price: 60, mrp: 70 },
      { name: "5 kg", value: "5kg", price: 300, mrp: 340 }
    ],
    image: "assets/wheat_atta.jpg",
    ingredients: "100% Stone-Ground Sorghum (Jowar) Grains",
    nutrition: {
      energy: "339 kcal",
      protein: "10.6 g",
      carbohydrates: "74.6 g",
      fat: "3.3 g",
      dietary_fiber: "6.3 g"
    }
  },
  {
    id: "ragi-flour",
    name: "Raggi (Finger Millet)",
    category: "atta-grains",
    description: "Stone-milled calcium-rich finger millet flour. Crucial staple for children and elderly.",
    basePrice: 90,
    unit: "kg",
    sizes: [
      { name: "1 kg", value: "1kg", price: 90, mrp: 100 },
      { name: "5 kg", value: "5kg", price: 450, mrp: 490 }
    ],
    image: "assets/wheat_atta.jpg",
    ingredients: "100% Stone-Ground Finger Millet (Ragi) Grains",
    nutrition: {
      energy: "328 kcal",
      protein: "7.3 g",
      carbohydrates: "72.6 g",
      fat: "1.3 g",
      dietary_fiber: "11.5 g"
    }
  },
  {
    id: "oats-flour",
    name: "Oats Flour",
    category: "atta-grains",
    description: "Whole oat groats milled into a nutritious flour. Excellent for healthy baking.",
    basePrice: 150,
    unit: "kg",
    sizes: [
      { name: "1 kg", value: "1kg", price: 150, mrp: 175 }
    ],
    image: "assets/wheat_atta.jpg",
    ingredients: "100% Pure Milled Oat Groats Grains",
    nutrition: {
      energy: "389 kcal",
      protein: "16.9 g",
      carbohydrates: "66.3 g",
      fat: "6.9 g",
      dietary_fiber: "10.6 g"
    }
  },
  {
    id: "basmati-rice",
    name: "Basmati Rice (Premium)",
    category: "atta-grains",
    description: "Aromatic, long-grain basmati rice. Selected premium quality aged grains.",
    basePrice: 130,
    unit: "kg",
    sizes: [
      { name: "1 kg", value: "1kg", price: 130, mrp: 155 },
      { name: "5 kg", value: "5kg", price: 650, mrp: 740 }
    ],
    image: "assets/hero_banner.jpg",
    ingredients: "100% Pure Aged Long-Grain Basmati Rice Grains",
    nutrition: {
      energy: "349 kcal",
      protein: "8.1 g",
      carbohydrates: "77.2 g",
      fat: "0.6 g",
      dietary_fiber: "1.3 g"
    }
  },
  {
    id: "moong-dal",
    name: "Moong Dal (Green Gram Dal)",
    category: "atta-grains",
    description: "Premium quality green gram dal. Untreated, unrefined, full of plant proteins.",
    basePrice: 160,
    unit: "kg",
    sizes: [
      { name: "1 kg", value: "1kg", price: 160, mrp: 185 }
    ],
    image: "assets/hero_banner.jpg",
    ingredients: "100% Organic Green Gram Grains",
    nutrition: {
      energy: "347 kcal",
      protein: "24.5 g",
      carbohydrates: "62.6 g",
      fat: "1.2 g",
      dietary_fiber: "16.3 g"
    }
  },

  // Cold-Pressed Oils
  {
    id: "yellow-mustard-oil",
    name: "Cold Pressed Yellow Mustard Oil",
    category: "oils",
    description: "Extracted using traditional wooden kohlus from premium yellow seeds. Aromatic & light flavor.",
    basePrice: 360,
    unit: "L",
    sizes: [
      { name: "1 Liter", value: "1L", price: 360, mrp: 420 },
      { name: "5 Liters (Value Pack)", value: "5L", price: 1750, mrp: 2000 }
    ],
    image: "assets/mustard_oil.jpg",
    badge: "Bestseller",
    badgeType: "bestseller",
    infoBubble: "Crafted from 3kg premium seeds per liter",
    ingredients: "100% Cold-Pressed Yellow Mustard Seeds",
    nutrition: {
      energy: "898 kcal",
      protein: "0 g",
      carbohydrates: "0 g",
      fat: "99.8 g",
      saturated_fat: "11.6 g"
    }
  },
  {
    id: "black-mustard-oil",
    name: "Cold Pressed Black Mustard Oil",
    category: "oils",
    description: "Traditionally kohlu-pressed black mustard seeds. Strong pungency, natural health benefits.",
    basePrice: 260,
    unit: "L",
    sizes: [
      { name: "1 Liter", value: "1L", price: 260, mrp: 310 },
      { name: "5 Liters (Value Pack)", value: "5L", price: 1250, mrp: 1500 }
    ],
    image: "assets/mustard_oil.jpg",
    ingredients: "100% Cold-Pressed Black Mustard Seeds",
    nutrition: {
      energy: "898 kcal",
      protein: "0 g",
      carbohydrates: "0 g",
      fat: "99.8 g",
      saturated_fat: "12.4 g"
    }
  },
  {
    id: "groundnut-oil",
    name: "Cold Pressed Groundnut Oil",
    category: "oils",
    description: "Chemical-free unrefined oil wood-pressed from select peanuts. High smoke point cooking.",
    basePrice: 230,
    unit: "L",
    sizes: [
      { name: "1 Liter", value: "1L", price: 230, mrp: 275 },
      { name: "5 Liters (Value Pack)", value: "5L", price: 1120, mrp: 1300 }
    ],
    image: "assets/groundnut_oil.jpg",
    badge: "Newly Launched",
    badgeType: "new",
    ingredients: "100% Cold-Pressed Groundnuts (Peanuts)",
    nutrition: {
      energy: "899 kcal",
      protein: "0 g",
      carbohydrates: "0 g",
      fat: "100 g",
      saturated_fat: "16.8 g"
    }
  },

  // Cattle Feed & Extras
  {
    id: "yellow-mustard-khal",
    name: "Yellow Mustard Khal",
    category: "khal-seeds",
    description: "Premium yellow mustard oil cake residue. Highly nutritious feed supplement for cattle.",
    basePrice: 40,
    unit: "kg",
    sizes: [
      { name: "1 kg", value: "1kg", price: 40, mrp: 40 },
      { name: "10 kg", value: "10kg", price: 400, mrp: 400 },
      { name: "50 kg (Bulk)", value: "50kg", price: 1950, mrp: 1950 }
    ],
    image: "assets/hero_banner.jpg",
    badge: "Mustard Oil Cake",
    ingredients: "100% Pure Yellow Mustard Seed Cake Cake Residue"
  },
  {
    id: "black-mustard-khal",
    name: "Black Mustard Khal",
    category: "khal-seeds",
    description: "Traditional black mustard oil cake residue. High protein cattle feed value.",
    basePrice: 40,
    unit: "kg",
    sizes: [
      { name: "1 kg", value: "1kg", price: 40, mrp: 40 },
      { name: "10 kg", value: "10kg", price: 400, mrp: 400 },
      { name: "50 kg (Bulk)", value: "50kg", price: 1950, mrp: 1950 }
    ],
    image: "assets/hero_banner.jpg",
    badge: "Mustard Oil Cake",
    ingredients: "100% Pure Black Mustard Seed Cake Cake Residue"
  },
  {
    id: "methi-dana",
    name: "Methi Dana (Fenugreek Grains)",
    category: "khal-seeds",
    description: "Premium selected fenugreek seeds, ideal for spice use or traditional wellness recipes.",
    basePrice: 150,
    unit: "kg",
    sizes: [
      { name: "1 kg", value: "1kg", price: 150, mrp: 170 }
    ],
    image: "assets/hero_banner.jpg",
    ingredients: "100% Pure Fenugreek (Methi) Seeds Grains"
  },
  {
    id: "ghat-peas",
    name: "Ghat (Dried Field Peas)",
    category: "khal-seeds",
    description: "Selected high-grade dried field peas. Nutritious source of dietary proteins.",
    basePrice: 90,
    unit: "kg",
    sizes: [
      { name: "1 kg", value: "1kg", price: 90, mrp: 105 },
      { name: "5 kg", value: "5kg", price: 450, mrp: 500 }
    ],
    image: "assets/hero_banner.jpg",
    ingredients: "100% Pure Dried Green Field Peas (Ghat) Grains"
  }
];

// --- APP INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  let cart = [];
  let currentCategory = 'all';
  let currentSearchQuery = '';
  let discountPercentage = 0; // Managed by coupon code

  // --- SELECTORS ---
  const header = document.getElementById('site-header');
  const cartToggle = document.getElementById('cart-toggle');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-drawer-overlay');
  const cartClose = document.getElementById('cart-close');
  const cartCount = document.getElementById('cart-count');
  const cartItemsList = document.getElementById('cart-items-list');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const emptyCartState = document.getElementById('empty-cart-state');
  const cartFooter = document.getElementById('cart-footer');
  const checkoutBtn = document.getElementById('checkout-whatsapp');
  
  const couponInput = document.getElementById('coupon-code');
  const applyCouponBtn = document.getElementById('apply-coupon');
  const cartProgressFill = document.getElementById('cart-progress-fill');
  const cartProgressText = document.getElementById('cart-progress-text');

  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  
  const categoryTabs = document.getElementById('category-tabs');
  const productList = document.getElementById('product-list');
  const bestsellersList = document.getElementById('bestsellers-list');
  
  const searchInput = document.getElementById('search-input');
  const searchClear = document.getElementById('search-clear');

  // --- LOCAL STORAGE FUNCTIONS ---
  const loadCart = () => {
    const savedCart = localStorage.getItem('mitti_fresh_cart');
    if (savedCart) {
      try {
        cart = JSON.parse(savedCart);
        updateCartUI();
      } catch (e) {
        console.error("Error loading cart", e);
        cart = [];
      }
    }
  };

  const saveCart = () => {
    localStorage.setItem('mitti_fresh_cart', JSON.stringify(cart));
  };

  // --- HEADER SCROLL EFFECT ---
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- MOBILE NAV OVERLAY ---
  if (mobileMenuToggle && mobileMenu && mobileMenuClose) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenu.classList.add('open');
    });

    mobileMenuClose.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
    });
  }

  // --- FAQ ACCORDION TOGGLING ---
  const faqWrapper = document.querySelector('.faq-wrapper');
  if (faqWrapper) {
    faqWrapper.addEventListener('click', (e) => {
      const trigger = e.target.closest('.faq-trigger');
      if (trigger) {
        const item = trigger.closest('.faq-item');
        const content = item.querySelector('.faq-content');
        
        const isOpen = item.classList.contains('open');
        
        // Close all other items
        document.querySelectorAll('.faq-item').forEach(i => {
          i.classList.remove('open');
          i.querySelector('.faq-content').style.maxHeight = '0';
        });

        if (!isOpen) {
          item.classList.add('open');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      }
    });
  }

  // --- REVIEWS TESTIMONIAL SLIDER ---
  const reviewsSlider = document.getElementById('reviews-slider');
  const prevBtn = document.getElementById('rev-prev');
  const nextBtn = document.getElementById('rev-next');
  const dotsContainer = document.getElementById('reviews-dots');

  if (reviewsSlider && prevBtn && nextBtn && dotsContainer) {
    const slides = document.querySelectorAll('.review-slide');
    let currentIndex = 0;
    let slideInterval;

    // Create Navigation Dots
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.className = `reviews-dot ${index === 0 ? 'active' : ''}`;
      dot.setAttribute('data-index', index);
      dotsContainer.appendChild(dot);
    });

    const updateSlider = (index) => {
      currentIndex = index;
      reviewsSlider.style.transform = `translateX(-${currentIndex * 100}%)`;
      
      // Update active dot
      document.querySelectorAll('.reviews-dot').forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    };

    const nextSlide = () => {
      let index = (currentIndex + 1) % slides.length;
      updateSlider(index);
    };

    const prevSlide = () => {
      let index = (currentIndex - 1 + slides.length) % slides.length;
      updateSlider(index);
    };

    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetInterval();
    });

    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetInterval();
    });

    dotsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('reviews-dot')) {
        const index = parseInt(e.target.getAttribute('data-index'));
        updateSlider(index);
        resetInterval();
      }
    });

    const startInterval = () => {
      slideInterval = setInterval(nextSlide, 6000);
    };

    const resetInterval = () => {
      clearInterval(slideInterval);
      startInterval();
    };

    startInterval();
  }

  // --- STATS NUMBERS COUNT-UP ANIMATION ---
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length > 0) {
    const options = {
      root: null,
      threshold: 0.1,
      rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const numberEl = entry.target;
          const targetVal = parseInt(numberEl.getAttribute('data-target'));
          let currentVal = 0;
          const duration = 2000; // 2 seconds
          const stepTime = Math.max(Math.floor(duration / targetVal), 10);
          
          const increment = Math.ceil(targetVal / (duration / stepTime));

          const counter = setInterval(() => {
            currentVal += increment;
            if (currentVal >= targetVal) {
              numberEl.textContent = targetVal + (targetVal === 200 || targetVal === 2010 ? '+' : '');
              clearInterval(counter);
            } else {
              numberEl.textContent = currentVal;
            }
          }, stepTime);

          observer.unobserve(numberEl);
        }
      });
    }, options);

    statNumbers.forEach(num => observer.observe(num));
  }

  // --- PRODUCT CARD HTML GENERATOR (UPDATED TO TAKE TO PRODUCT.HTML) ---
  const createProductCardHTML = (prod) => {
    const defaultOption = prod.sizes[0];
    const optionsHtml = prod.sizes.map(opt => {
      return `<option value="${opt.value}" data-price="${opt.price}" data-mrp="${opt.mrp || opt.price}">${opt.name} - ₹${opt.price}</option>`;
    }).join('');

    const badgeHtml = prod.badge ? `<span class="product-tag badge-${prod.badgeType || 'accent'} font-alt">${prod.badge}</span>` : '';
    const bubbleHtml = prod.infoBubble ? `<div class="info-bubble">${prod.infoBubble}</div>` : '';

    return `
      <a href="product.html?id=${prod.id}" class="product-card-media-link">
        <div class="product-image-container">
          <img src="${prod.image}" alt="${prod.name}" class="product-image" loading="lazy">
          ${badgeHtml}
          ${bubbleHtml}
        </div>
      </a>
      <div class="product-details">
        <div class="product-card-header">
          <a href="product.html?id=${prod.id}" class="product-title-link">
            <h3 class="product-title">${prod.name}</h3>
          </a>
          <div class="product-rating"><i class="fa-solid fa-star"></i> 5.0</div>
        </div>
        <p class="product-description">${prod.description}</p>

        <div class="product-selector-group">
          <label for="size-select-${prod.id}" class="selector-label">Selection:</label>
          <select id="size-select-${prod.id}" class="product-size-select" data-product-id="${prod.id}">
            ${optionsHtml}
          </select>
        </div>

        <div class="product-footer">
          <div class="product-price">
            ${defaultOption.mrp > defaultOption.price ? `<span class="product-mrp-strike" style="text-decoration: line-through; color: var(--color-text-muted); font-size: 0.9rem; margin-right: 8px;">₹${defaultOption.mrp}</span>` : ''}
            ₹<span class="price-val" id="price-${prod.id}">${defaultOption.price}</span>
          </div>
          <button class="btn btn-sm btn-primary add-to-cart-btn" 
                  data-id="${prod.id}" 
                  data-name="${prod.name}" 
                  data-image="${prod.image}">
            <i class="fa-solid fa-cart-plus"></i> Add
          </button>
        </div>
      </div>
    `;
  };

  // --- PRODUCT CATALOG RENDER ---
  const renderProducts = () => {
    if (bestsellersList) {
      bestsellersList.innerHTML = '';
      const bestsellers = PRODUCTS.filter(prod => prod.badgeType === 'bestseller');
      
      bestsellers.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-category', prod.category);
        card.innerHTML = createProductCardHTML(prod);
        bestsellersList.appendChild(card);
      });
      return;
    }

    if (productList) {
      productList.innerHTML = '';
      const filteredProducts = PRODUCTS.filter(prod => {
        const matchesCategory = currentCategory === 'all' || prod.category === currentCategory;
        const matchesSearch = prod.name.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
                              prod.description.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
                              (prod.ingredients && prod.ingredients.toLowerCase().includes(currentSearchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      });

      if (filteredProducts.length === 0) {
        productList.innerHTML = `
          <div class="no-results-state">
            <i class="fa-solid fa-magnifying-glass"></i>
            <h3>No items found</h3>
            <p>We couldn't find any staples matching "${currentSearchQuery}". Try adjusting your keywords.</p>
          </div>
        `;
        return;
      }

      filteredProducts.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-category', prod.category);
        card.innerHTML = createProductCardHTML(prod);
        productList.appendChild(card);
      });
    }
  };

  // --- GRID INTERACTION DELEGATORS ---
  const activeGridContainer = productList || bestsellersList;
  if (activeGridContainer) {
    // 1. Weight size selector changes
    activeGridContainer.addEventListener('change', (e) => {
      if (e.target.classList.contains('product-size-select')) {
        const select = e.target;
        const selectedOption = select.options[select.selectedIndex];
        const newPrice = selectedOption.getAttribute('data-price');
        const newMrp = selectedOption.getAttribute('data-mrp');
        const productId = select.getAttribute('data-product-id');
        
        const priceDisplay = document.getElementById(`price-${productId}`);
        if (priceDisplay) {
          priceDisplay.textContent = newPrice;
        }

        // Dynamically update strike price in card if present
        const footerPriceBlock = select.closest('.product-details').querySelector('.product-price');
        if (footerPriceBlock) {
          const strikePrice = footerPriceBlock.querySelector('.product-mrp-strike');
          if (parseInt(newMrp) > parseInt(newPrice)) {
            if (strikePrice) {
              strikePrice.textContent = `₹${newMrp}`;
              strikePrice.style.display = 'inline';
            } else {
              footerPriceBlock.insertAdjacentHTML('afterbegin', `<span class="product-mrp-strike" style="text-decoration: line-through; color: var(--color-text-muted); font-size: 0.9rem; margin-right: 8px;">₹${newMrp}</span>`);
            }
          } else if (strikePrice) {
            strikePrice.style.display = 'none';
          }
        }
      }
    });

    // 2. Add to cart button clicks
    activeGridContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.add-to-cart-btn');
      if (btn) {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        const image = btn.getAttribute('data-image');
        
        const select = document.getElementById(`size-select-${id}`);
        const selectedOption = select.options[select.selectedIndex];
        const size = selectedOption.value;
        const price = parseInt(selectedOption.getAttribute('data-price'));

        addToCart(id, name, image, size, price, btn);
      }
    });
  }

  // --- ADD TO CART UTILITY ---
  const addToCart = (id, name, image, size, price, qtyVal = 1, btnElement = null) => {
    // Overloaded to handle quantity values directly
    if (typeof qtyVal === 'object' && qtyVal !== null) {
      btnElement = qtyVal;
      qtyVal = 1;
    }

    const existingItem = cart.find(item => item.id === id && item.size === size);
    if (existingItem) {
      existingItem.quantity += qtyVal;
    } else {
      cart.push({ id, name, image, size, price, quantity: qtyVal });
    }

    saveCart();
    updateCartUI();
    
    if (btnElement) {
      const originalHTML = btnElement.innerHTML;
      btnElement.innerHTML = `<i class="fa-solid fa-check"></i> Added!`;
      btnElement.style.backgroundColor = '#C89A45'; // Gold accent feedback
      btnElement.disabled = true;
      
      setTimeout(() => {
        btnElement.innerHTML = originalHTML;
        btnElement.style.backgroundColor = '';
        btnElement.disabled = false;
      }, 1000);
    }

    setTimeout(() => toggleCartDrawer(true), 400);
  };

  // --- SEARCH ENGINE INTERFACE ---
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      searchClear.style.display = currentSearchQuery.length > 0 ? 'block' : 'none';
      renderProducts();
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      currentSearchQuery = '';
      searchClear.style.display = 'none';
      renderProducts();
      searchInput.focus();
    });
  }

  // --- CATEGORY TABS ACTION TRIGGER ---
  if (categoryTabs) {
    categoryTabs.addEventListener('click', (e) => {
      const card = e.target.closest('.category-card');
      if (card) {
        document.querySelectorAll('.category-card').forEach(tab => {
          tab.classList.remove('active');
        });
        card.classList.add('active');
        
        currentCategory = card.getAttribute('data-category');
        renderProducts();
        
        // Scroll list header if mobile layout active
        if (window.innerWidth < 768) {
          const shopHeader = document.querySelector('.shop-section');
          if (shopHeader) shopHeader.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  // --- CART SLIDING DRAWER CONTROL ---
  const toggleCartDrawer = (isOpen) => {
    if (isOpen) {
      cartDrawer.classList.add('open');
      cartOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    } else {
      cartDrawer.classList.remove('open');
      cartOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  if (cartToggle) cartToggle.addEventListener('click', () => toggleCartDrawer(true));
  if (cartClose) cartClose.addEventListener('click', () => toggleCartDrawer(false));
  if (cartOverlay) cartOverlay.addEventListener('click', () => toggleCartDrawer(false));
  
  document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains('close-cart-link')) {
      toggleCartDrawer(false);
    }
  });

  // --- CART RENDER & QUANTITIES ---
  const updateCartUI = () => {
    const totalItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItemsCount;
    
    if (cart.length === 0) {
      if (emptyCartState) emptyCartState.style.display = 'flex';
      if (cartItemsList) cartItemsList.style.display = 'none';
      if (cartFooter) cartFooter.style.display = 'none';
    } else {
      if (emptyCartState) emptyCartState.style.display = 'none';
      if (cartItemsList) cartItemsList.style.display = 'flex';
      if (cartFooter) cartFooter.style.display = 'block';
    }

    if (cartItemsList) {
      cartItemsList.innerHTML = '';
      let subtotalValue = 0;

      cart.forEach(item => {
        const itemSubtotal = item.price * item.quantity;
        subtotalValue += itemSubtotal;

        const cartItemEl = document.createElement('li');
        cartItemEl.className = 'cart-item';
        cartItemEl.innerHTML = `
          <img src="${item.image}" alt="${item.name}" class="cart-item-image">
          <div class="cart-item-details">
            <h4 class="cart-item-title">${item.name}</h4>
            <span class="cart-item-meta">Size: ${item.size} • ₹${item.price} each</span>
            <div class="cart-item-actions">
              <div class="quantity-control">
                <button class="quantity-btn decrease-qty" data-id="${item.id}" data-size="${item.size}">
                  <i class="fa-solid fa-minus"></i>
                </button>
                <span class="quantity-val">${item.quantity}</span>
                <button class="quantity-btn increase-qty" data-id="${item.id}" data-size="${item.size}">
                  <i class="fa-solid fa-plus"></i>
                </button>
              </div>
              <span class="cart-item-price">₹${itemSubtotal}</span>
            </div>
          </div>
          <button class="remove-item-btn" data-id="${item.id}" data-size="${item.size}" aria-label="Remove item">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        `;
        cartItemsList.appendChild(cartItemEl);
      });

      // Apply Coupon Code reductions if set
      let finalSubtotal = subtotalValue;
      if (discountPercentage > 0) {
        const discount = Math.floor(subtotalValue * (discountPercentage / 100));
        finalSubtotal = subtotalValue - discount;
      }

      if (cartSubtotal) cartSubtotal.textContent = `₹${finalSubtotal}`;

      // Update Free Delivery Progress Bar (Threshold: ₹500)
      const threshold = 500;
      const progressPercent = Math.min((subtotalValue / threshold) * 100, 100);
      if (cartProgressFill) cartProgressFill.style.width = `${progressPercent}%`;
      
      if (cartProgressText) {
        if (subtotalValue >= threshold) {
          cartProgressText.innerHTML = `<i class="fa-solid fa-circle-check"></i> 🎉 Congrats! You've unlocked **Free Delivery**!`;
          if (cartProgressFill) cartProgressFill.style.backgroundColor = '#214E34'; // Forest green
        } else {
          const gap = threshold - subtotalValue;
          cartProgressText.innerHTML = `<i class="fa-solid fa-truck-fast"></i> Add **₹${gap}** more for **Free Delivery**`;
          if (cartProgressFill) cartProgressFill.style.backgroundColor = ''; // Reverts to default CSS Golden Accent
        }
      }
    }
  };

  // Coupon application logic
  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener('click', () => {
      const code = couponInput.value.trim().toUpperCase();
      if (code === 'PURE10') {
        discountPercentage = 10;
        alert('Coupon "PURE10" applied! 10% discount subtracted from your total.');
        updateCartUI();
      } else if (code.length > 0) {
        alert('Invalid coupon code. Try PURE10 for 10% off.');
      }
    });
  }

  const adjustQuantity = (id, size, delta) => {
    const item = cart.find(i => i.id === id && i.size === size);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        removeItem(id, size);
      } else {
        saveCart();
        updateCartUI();
      }
    }
  };

  const removeItem = (id, size) => {
    cart = cart.filter(i => !(i.id === id && i.size === size));
    saveCart();
    updateCartUI();
  };

  if (cartItemsList) {
    cartItemsList.addEventListener('click', (e) => {
      const increaseBtn = e.target.closest('.increase-qty');
      const decreaseBtn = e.target.closest('.decrease-qty');
      const removeBtn = e.target.closest('.remove-item-btn');
      
      if (increaseBtn) {
        const id = increaseBtn.getAttribute('data-id');
        const size = increaseBtn.getAttribute('data-size');
        adjustQuantity(id, size, 1);
      }
      
      if (decreaseBtn) {
        const id = decreaseBtn.getAttribute('data-id');
        const size = decreaseBtn.getAttribute('data-size');
        adjustQuantity(id, size, -1);
      }
      
      if (removeBtn) {
        const id = removeBtn.getAttribute('data-id');
        const size = removeBtn.getAttribute('data-size');
        removeItem(id, size);
      }
    });
  }

  // --- WHATSAPP CHECKOUT INTEGRATION ---
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) return;

      const phoneNumber = "918595077263"; // Direct business WhatsApp
      let message = `*Mitti Fresh Order Inquiry*\n`;
      message += `------------------------------------\n`;
      
      let subtotalValue = 0;
      cart.forEach((item, index) => {
        const itemSubtotal = item.price * item.quantity;
        subtotalValue += itemSubtotal;
        message += `${index + 1}. *${item.name}* (${item.size})\n`;
        message += `   Qty: ${item.quantity} x ₹${item.price} = *₹${itemSubtotal}*\n`;
      });

      message += `------------------------------------\n`;
      
      let finalSubtotal = subtotalValue;
      if (discountPercentage > 0) {
        const discount = Math.floor(subtotalValue * (discountPercentage / 100));
        finalSubtotal = subtotalValue - discount;
        message += `*Subtotal:* ₹${subtotalValue}\n`;
        message += `*Coupon Code applied (PURE10):* -10% (-₹${discount})\n`;
      }

      const threshold = 500;
      const shipping = subtotalValue >= threshold ? 'Free' : '₹50 (Coordinated via WhatsApp)';
      message += `*Shipping:* ${shipping}\n`;
      message += `*Total Order Value: ₹${finalSubtotal}*\n\n`;
      message += `Please confirm availability and coordinate delivery/pick-up details for Dwarka Sector 28. Thank you!`;

      const encodedText = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;

      window.open(whatsappUrl, '_blank');
    });
  }

  // --- DEDICATED PRODUCT DETAILS PAGE RENDERER ---
  const productDetailRoot = document.getElementById('product-detail-root');
  if (productDetailRoot) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const prod = PRODUCTS.find(p => p.id === productId);

    if (!prod) {
      // Redirect to shop if product not found
      productDetailRoot.innerHTML = `
        <div class="no-results-state" style="text-align: center; padding: 100px 0;">
          <i class="fa-solid fa-triangle-exclamation" style="font-size: 3rem; color: #E74C3C; margin-bottom: 16px;"></i>
          <h3>Product Not Found</h3>
          <p>The product you are looking for does not exist or has been removed.</p>
          <a href="shop.html" class="btn btn-primary" style="margin-top: 20px;">Return to Shop</a>
        </div>
      `;
    } else {
      // Set page Title and Meta specifications
      document.title = `${prod.name} — Mitti Fresh`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', `${prod.description} Order fresh from Mitti Fresh Dwarka Sec 28, Delhi.`);
      
      const breadcrumbActive = document.getElementById('breadcrumb-active');
      if (breadcrumbActive) breadcrumbActive.textContent = prod.name;

      // Populate related products
      const relatedProducts = PRODUCTS.filter(p => p.category === prod.category && p.id !== prod.id).slice(0, 4);
      const backupRelated = PRODUCTS.filter(p => p.badgeType === 'bestseller' && p.id !== prod.id).slice(0, 4);
      const selectedRelated = relatedProducts.length >= 2 ? relatedProducts : backupRelated;

      let relatedHtml = '';
      selectedRelated.forEach(rel => {
        relatedHtml += `
          <div class="product-card">
            <a href="product.html?id=${rel.id}" class="product-card-media-link">
              <div class="product-image-container">
                <img src="${rel.image}" alt="${rel.name}" class="product-image" loading="lazy">
              </div>
            </a>
            <div class="product-details">
              <div class="product-card-header">
                <a href="product.html?id=${rel.id}" class="product-title-link">
                  <h3 class="product-title">${rel.name}</h3>
                </a>
              </div>
              <p class="product-description" style="max-height: 40px; overflow: hidden;">${rel.description}</p>
              <div class="product-footer" style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(33, 78, 52, 0.05);">
                <div class="product-price">₹${rel.sizes[0].price}</div>
                <a href="product.html?id=${rel.id}" class="btn btn-sm btn-secondary">View Specs</a>
              </div>
            </div>
          </div>
        `;
      });

      // Construct nutrition facts rows
      let nutrRows = '';
      if (prod.nutrition) {
        for (const [key, value] of Object.entries(prod.nutrition)) {
          const formattedKey = key.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
          nutrRows += `
            <tr>
              <td class="bold-text">${formattedKey}</td>
              <td>${value}</td>
            </tr>
          `;
        }
      } else {
        nutrRows = `
          <tr>
            <td colspan="2">Nutritional facts are being certified. Retains all natural vitamins, complex dietary fiber, and healthy germ fats.</td>
          </tr>
        `;
      }

      // Check default size specs
      let activeSizeIndex = 0;
      let activeSize = prod.sizes[activeSizeIndex];
      let activePrice = activeSize.price;
      let activeMrp = activeSize.mrp || activePrice;
      let savings = activeMrp - activePrice;
      let savingsPercent = Math.round((savings / activeMrp) * 100);

      // Render details page grid layout
      productDetailRoot.innerHTML = `
        <div class="product-detail-grid">
          <!-- Left side: Images and Badges -->
          <div class="product-gallery-section">
            <div class="image-zoom-container" id="zoom-container">
              <img src="${prod.image}" alt="${prod.name}" id="main-product-img">
            </div>
            
            <div class="gallery-thumbnails">
              <button class="gallery-thumbnail active" data-src="${prod.image}">
                <img src="${prod.image}" alt="Primary view">
              </button>
              <button class="gallery-thumbnail" data-src="assets/grinding_live.jpg">
                <img src="assets/grinding_live.jpg" alt="Milling closeup">
              </button>
              <button class="gallery-thumbnail" data-src="assets/hero_banner.jpg">
                <img src="assets/hero_banner.jpg" alt="Grains sourcing">
              </button>
            </div>

            <div class="product-badges-row">
              <span class="product-tag badge-bestseller font-alt">✓ Freshly Milled</span>
              <span class="product-tag badge-green font-alt">✓ Stone Chakki</span>
              <span class="product-tag badge-accent font-alt">✓ Cold Pressed</span>
              <span class="product-tag badge-new font-alt">✓ 100% Raw Pure</span>
            </div>
          </div>

          <!-- Right side: Specifications metadata, Pricing, Purchase actions -->
          <div class="product-meta-content">
            <span class="product-meta-category">${prod.category === 'atta-specialty' ? 'Specialty Atta Blend' : 
                                                 (prod.category === 'atta-grains' ? 'Chakki Flours & Grains' : 
                                                 (prod.category === 'oils' ? 'Cold-Pressed Oil' : 'Cattle Feed & Extras'))}</span>
            <h1 class="product-meta-title">${prod.name}</h1>
            
            <div class="product-meta-rating">
              <div class="stars-row"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
              <span>5.0 (Google verified shop ratings)</span>
            </div>

            <p class="product-meta-desc">${prod.description}</p>

            <!-- Interactive Pricing Section -->
            <div class="product-pricing-wrapper">
              <div class="pricing-block">
                ${savings > 0 ? `<span class="mrp-strike-price" id="detail-mrp">₹${activeMrp}</span>` : ''}
                <span class="offer-price-bold" id="detail-price">₹${activePrice}</span>
              </div>
              <span class="savings-badge-alert" id="detail-savings" style="${savings > 0 ? '' : 'display: none;'}">You Save ₹${savings} (${savingsPercent}%)</span>
            </div>

            <!-- Variant Selector -->
            <div class="variants-selector-wrapper">
              <h4 class="variants-title">Select Pack Size Variant:</h4>
              <div class="variants-grid" id="variant-chips-container">
                ${prod.sizes.map((size, index) => `
                  <button class="variant-chip ${index === 0 ? 'active' : ''}" 
                          data-index="${index}" 
                          data-value="${size.value}" 
                          data-price="${size.price}" 
                          data-mrp="${size.mrp || size.price}">
                    ${size.name}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Quantity Selector & Action buttons -->
            <div class="quantity-selection-row">
              <h4 class="variants-title" style="margin-bottom: 0;">Quantity:</h4>
              <div class="quantity-adjuster">
                <button class="qty-btn" id="qty-dec"><i class="fa-solid fa-minus"></i></button>
                <span class="qty-val" id="qty-current-val">1</span>
                <button class="qty-btn" id="qty-inc"><i class="fa-solid fa-plus"></i></button>
              </div>
            </div>

            <!-- CTA Purchase Action Groups -->
            <div class="purchase-buttons-group">
              <button class="btn btn-secondary btn-large" id="buy-now-btn" style="background-color: var(--color-accent); border-color: var(--color-accent); color: var(--color-bg-white);">Buy Now</button>
              <button class="btn btn-primary btn-large" id="add-cart-btn"><i class="fa-solid fa-cart-plus"></i> Add to Basket</button>
              <button class="btn btn-primary btn-large whatsapp-purchase-btn" id="whatsapp-purchase-btn">
                <i class="fa-brands fa-whatsapp"></i> Order on WhatsApp
              </button>
            </div>

            <!-- Inline Trust badges -->
            <div class="trust-badges-grid">
              <div class="trust-badge-item"><i class="fa-solid fa-wheat-awn"></i> ✓ Fresh Daily</div>
              <div class="trust-badge-item"><i class="fa-solid fa-shield-halved"></i> ✓ No Chemicals</div>
              <div class="trust-badge-item"><i class="fa-solid fa-mortar-pestle"></i> ✓ Stone Ground</div>
              <div class="trust-badge-item"><i class="fa-solid fa-droplet"></i> ✓ Cold Pressed</div>
              <div class="trust-badge-item"><i class="fa-solid fa-box-open"></i> ✓ Hygienic Pack</div>
              <div class="trust-badge-item"><i class="fa-solid fa-truck-fast"></i> ✓ Fast Delivery</div>
            </div>
          </div>
        </div>

        <!-- Specifications Tab Sections -->
        <div class="details-tabs-section">
          <div class="details-tab-nav">
            <button class="tab-nav-btn active" data-pane="tab-pane-desc">Description</button>
            <button class="tab-nav-btn" data-pane="tab-pane-ingred">Ingredients</button>
            <button class="tab-nav-btn" data-pane="tab-pane-nutrition">Nutrition facts</button>
            <button class="tab-nav-btn" data-pane="tab-pane-benefits">Health Benefits</button>
            <button class="tab-nav-btn" data-pane="tab-pane-storage">Storage & FAQs</button>
          </div>
          
          <div class="tab-pane active" id="tab-pane-desc">
            <p>${prod.description}</p>
            <p style="margin-top: 16px;">Our stone-ground chakki flour is processed at slow speeds to ensure that grinding temperatures remain cool, locking in all vital wheat germ, healthy plant fats, fibers, and minerals. Similarly, cold-pressed oils are slowly wood-extracted beneath 45°C without toxic solvents, preserving their raw aroma, antioxidants, and nutritional structure.</p>
          </div>
          
          <div class="tab-pane" id="tab-pane-ingred">
            <p style="font-weight: 600; color: var(--color-primary); margin-bottom: 8px;">100% Purity Guarantee:</p>
            <p>${prod.ingredients || '100% natural, single-source raw farm ingredients without any processing chemicals, bleaching, or additives.'}</p>
          </div>
          
          <div class="tab-pane" id="tab-pane-nutrition">
            <table class="nutrition-table-facts">
              <thead>
                <tr>
                  <th>Nutritional Values</th>
                  <th>Serving per 100g</th>
                </tr>
              </thead>
              <tbody>
                ${nutrRows}
              </tbody>
            </table>
          </div>
          
          <div class="tab-pane" id="tab-pane-benefits">
            <p>${prod.benefits || 'Promotes daily energy levels, supports gut digestion, rich in essential dietary fibers, and provides heart-healthy micro-nutrients.'}</p>
            <p style="margin-top: 16px;">By switching away from industrially refined packaged brands, you eliminate chemical bleaches, preservatives, and high-heat processing from your diet, allowing your family to absorb authentic, raw nutrition.</p>
          </div>
          
          <div class="tab-pane" id="tab-pane-storage">
            <p><strong>Storage Guidelines:</strong> Since our staples have zero artificial preservatives, we recommend storing them inside cool, dry areas in airtight containers. consume flour blends within 30-45 days of milling, and wood-pressed oils within 6 months of extraction.</p>
            <p style="margin-top: 16px;"><strong>Delivery Areas:</strong> We deliver within 12-24 hours across Dwarka Sector 28 and surrounding sectors in Delhi NCR. Pick-up options are available directly from our Dwarka shop location.</p>
          </div>
        </div>

        <!-- Why Choose Mitti Fresh Info cards -->
        <section class="why-choose-section" style="padding: 40px 0; background-color: var(--color-bg-light); border-radius: var(--radius-premium); margin-bottom: 60px;">
          <div class="section-header">
            <span class="section-subtitle">Purity Standard</span>
            <h2 class="section-title" style="font-size: 2.2rem;">Mitti Fresh vs Ordinary Store Brands</h2>
          </div>
          <div class="why-grid" style="padding: 0 32px; gap: 24px;">
            <div class="why-card" style="background-color: var(--color-bg-white);">
              <div class="why-icon-wrap"><i class="fa-solid fa-wheat-awn"></i></div>
              <h3>Stone Chakki Ground</h3>
              <p>Milled at slow speeds keeping grains cool. Preserves natural wheat germ, bran, and healthy dietary fibers.</p>
            </div>
            <div class="why-card" style="background-color: var(--color-bg-white);">
              <div class="why-icon-wrap"><i class="fa-solid fa-droplet"></i></div>
              <h3>Slow Wooden Kohlu</h3>
              <p>Oils extracted under 45°C without solvent extraction chemicals. Intact aroma, color, and omega fatty acids.</p>
            </div>
            <div class="why-card" style="background-color: var(--color-bg-white);">
              <div class="why-icon-wrap"><i class="fa-solid fa-eye"></i></div>
              <h3>100% Transparency</h3>
              <p>Watch us mill your grains and press your oils live right inside our physical Dwarka store, or request video updates.</p>
            </div>
          </div>
        </section>

        <!-- Customer reviews block -->
        <section class="reviews-section" style="padding: 40px 0; border-top: 1px solid rgba(33, 78, 52, 0.08); margin-bottom: 60px;">
          <div class="section-header">
            <span class="section-subtitle">Testimonials</span>
            <h2 class="section-title" style="font-size: 2.2rem;">Customer Reviews</h2>
          </div>
          
          <div class="photo-reviews-grid">
            <div class="photo-review-card">
              <img src="assets/grinding_live.jpg" alt="Customer review photo: Fresh Atta">
            </div>
            <div class="photo-review-card">
              <img src="assets/mustard_oil.jpg" alt="Customer review photo: Mustard Oil">
            </div>
            <div class="photo-review-card">
              <img src="assets/multigrain_atta.jpg" alt="Customer review photo: Atta Pack">
            </div>
            <div class="photo-review-card">
              <img src="assets/groundnut_oil.jpg" alt="Customer review photo: Oil bottles">
            </div>
          </div>

          <div class="reviews-slider" style="display: flex; flex-direction: column; gap: 24px; transform: none; width: 100%;">
            <div class="review-slide" style="width: 100%; border: 1px solid rgba(33, 78, 52, 0.08); border-radius: var(--radius-premium); padding: 32px; background-color: var(--color-bg-white); box-shadow: var(--shadow-lux-sm);">
              <div class="review-stars" style="margin-bottom: 12px;"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
              <p class="review-text" style="font-size: 1.05rem; line-height: 1.6; color: var(--color-text-muted);">"Highly recommend Mitti Fresh! The Sharbhati wheat flour is extremely fresh. The rotis are sweet and remain soft even hours after baking. Knowing it has no chemicals gives me absolute peace of mind."</p>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 16px;">
                <div class="review-author" style="font-weight: 700; color: var(--color-primary);"><i class="fa-solid fa-circle-check"></i> Sunita Lochav</div>
                <span class="review-verified-badge"><i class="fa-solid fa-shield-check"></i> Google Verified Buyer</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Related products section -->
        <section class="related-section" style="border-top: 1px solid rgba(33, 78, 52, 0.08); padding-top: 48px;">
          <h3 class="font-alt" style="font-size: 1.8rem; color: var(--color-primary); margin-bottom: 32px;">You May Also Like</h3>
          <div class="product-grid" style="grid-template-columns: repeat(4, 1fr); gap: 24px;">
            ${relatedHtml}
          </div>
        </section>
      `;

      // Set sticky purchase bar details
      const stickyBar = document.getElementById('sticky-purchase-bar');
      const stickyTitle = document.getElementById('sticky-title');
      const stickyPrice = document.getElementById('sticky-price');
      const stickyBuyNow = document.getElementById('sticky-buy-now');
      const stickyAddCart = document.getElementById('sticky-add-cart');

      if (stickyTitle) stickyTitle.textContent = prod.name;
      if (stickyPrice) stickyPrice.textContent = `₹${activePrice}`;

      // Variant Selector Click Handlers
      const variantChipsContainer = document.getElementById('variant-chips-container');
      if (variantChipsContainer) {
        variantChipsContainer.addEventListener('click', (e) => {
          const chip = e.target.closest('.variant-chip');
          if (chip) {
            document.querySelectorAll('.variant-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            activeSizeIndex = parseInt(chip.getAttribute('data-index'));
            activeSize = prod.sizes[activeSizeIndex];
            activePrice = activeSize.price;
            activeMrp = activeSize.mrp || activePrice;
            savings = activeMrp - activePrice;
            savingsPercent = Math.round((savings / activeMrp) * 100);

            // Update details prices
            const priceEl = document.getElementById('detail-price');
            const mrpEl = document.getElementById('detail-mrp');
            const savingsEl = document.getElementById('detail-savings');

            if (priceEl) priceEl.textContent = `₹${activePrice}`;
            if (mrpEl) mrpEl.textContent = `₹${activeMrp}`;
            if (stickyPrice) stickyPrice.textContent = `₹${activePrice}`;

            if (savingsEl) {
              if (savings > 0) {
                savingsEl.textContent = `You Save ₹${savings} (${savingsPercent}%)`;
                savingsEl.style.display = 'inline-block';
              } else {
                savingsEl.style.display = 'none';
              }
            }
          }
        });
      }

      // Thumbnail Image Switcher Handlers
      const thumbnailsContainer = document.querySelector('.gallery-thumbnails');
      const mainImg = document.getElementById('main-product-img');
      if (thumbnailsContainer && mainImg) {
        thumbnailsContainer.addEventListener('click', (e) => {
          const thumb = e.target.closest('.gallery-thumbnail');
          if (thumb) {
            document.querySelectorAll('.gallery-thumbnail').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            mainImg.src = thumb.getAttribute('data-src');
          }
        });
      }

      // Main image magnification zoom handlers
      const zoomContainer = document.getElementById('zoom-container');
      if (zoomContainer && mainImg) {
        zoomContainer.addEventListener('mousemove', (e) => {
          const { left, top, width, height } = zoomContainer.getBoundingClientRect();
          const x = ((e.clientX - left) / width) * 100;
          const y = ((e.clientY - top) / height) * 100;
          mainImg.style.transformOrigin = `${x}% ${y}%`;
        });
        zoomContainer.addEventListener('mouseleave', () => {
          mainImg.style.transformOrigin = 'center center';
        });
      }

      // Quantity Adjuster Handlers
      const qtyCurrentVal = document.getElementById('qty-current-val');
      let qtyVal = 1;

      document.getElementById('qty-inc').addEventListener('click', () => {
        qtyVal += 1;
        qtyCurrentVal.textContent = qtyVal;
      });

      document.getElementById('qty-dec').addEventListener('click', () => {
        if (qtyVal > 1) {
          qtyVal -= 1;
          qtyCurrentVal.textContent = qtyVal;
        }
      });

      // Tab spec switches
      const tabNav = document.querySelector('.details-tab-nav');
      if (tabNav) {
        tabNav.addEventListener('click', (e) => {
          const btn = e.target.closest('.tab-nav-btn');
          if (btn) {
            document.querySelectorAll('.tab-nav-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const paneId = btn.getAttribute('data-pane');
            document.getElementById(paneId).classList.add('active');
          }
        });
      }

      // Add to cart click
      const addCartBtn = document.getElementById('add-cart-btn');
      addCartBtn.addEventListener('click', () => {
        addToCart(prod.id, prod.name, prod.image, activeSize.value, activePrice, qtyVal, addCartBtn);
      });

      // Buy Now click (Adds to cart & opens cart drawer instantly)
      const buyNowBtn = document.getElementById('buy-now-btn');
      buyNowBtn.addEventListener('click', () => {
        addToCart(prod.id, prod.name, prod.image, activeSize.value, activePrice, qtyVal);
        setTimeout(() => toggleCartDrawer(true), 200);
      });

      // Sticky Buy Now click
      if (stickyBuyNow) {
        stickyBuyNow.addEventListener('click', () => {
          addToCart(prod.id, prod.name, prod.image, activeSize.value, activePrice, 1);
          setTimeout(() => toggleCartDrawer(true), 200);
        });
      }

      // Sticky Add to Cart click
      if (stickyAddCart) {
        stickyAddCart.addEventListener('click', () => {
          addToCart(prod.id, prod.name, prod.image, activeSize.value, activePrice, 1, stickyAddCart);
        });
      }

      // Order on WhatsApp checkout link
      const whatsappPurchaseBtn = document.getElementById('whatsapp-purchase-btn');
      whatsappPurchaseBtn.addEventListener('click', () => {
        const number = "918595077263";
        const msg = `*Mitti Fresh Product Order Inquiry*\n` +
                    `------------------------------------\n` +
                    `*Product:* ${prod.name}\n` +
                    `*Variant Size:* ${activeSize.name}\n` +
                    `*Price per Unit:* ₹${activePrice} (MRP: ₹${activeMrp})\n` +
                    `*Quantity Ordered:* ${qtyVal}\n` +
                    `*Total Value:* *₹${activePrice * qtyVal}*\n` +
                    `------------------------------------\n` +
                    `Please check item availability and coordinate shipping/pickup options for Dwarka Sector 28. Thank you!`;
        window.open(`https://wa.me/${number}?text=${encodeURIComponent(msg)}`, '_blank');
      });

      // Sticky bottom bar viewport scroll handler
      window.addEventListener('scroll', () => {
        const buyBtnRect = addCartBtn.getBoundingClientRect();
        if (buyBtnRect.bottom < 0) {
          stickyBar.classList.add('visible');
        } else {
          stickyBar.classList.remove('visible');
        }
      });
    }
  }

  // --- INITIALIZE CATALOG & CART ---
  renderProducts();
  loadCart();
});
