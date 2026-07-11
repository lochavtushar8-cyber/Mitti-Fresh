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
      { name: "1 kg (Trial)", value: "1kg", price: 70 },
      { name: "5 kg (Family Pack)", value: "5kg", price: 350 },
      { name: "10 kg (Value Pack)", value: "10kg", price: 690 }
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
      { name: "1 kg (Trial)", value: "1kg", price: 80 },
      { name: "5 kg (Family Pack)", value: "5kg", price: 400 },
      { name: "10 kg (Value Pack)", value: "10kg", price: 780 }
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
      { name: "1 kg (Trial)", value: "1kg", price: 80 },
      { name: "5 kg (Family Pack)", value: "5kg", price: 400 },
      { name: "10 kg (Value Pack)", value: "10kg", price: 780 }
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
      { name: "1 kg (Trial)", value: "1kg", price: 80 },
      { name: "5 kg (Family Pack)", value: "5kg", price: 400 },
      { name: "10 kg (Value Pack)", value: "10kg", price: 780 }
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
      { name: "1 kg (Trial)", value: "1kg", price: 85 },
      { name: "5 kg (Family Pack)", value: "5kg", price: 425 },
      { name: "10 kg (Value Pack)", value: "10kg", price: 830 }
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
      { name: "1 kg (Trial)", value: "1kg", price: 80 },
      { name: "5 kg (Family Pack)", value: "5kg", price: 400 },
      { name: "10 kg (Value Pack)", value: "10kg", price: 780 }
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
      { name: "1 kg (Trial)", value: "1kg", price: 85 },
      { name: "5 kg (Family Pack)", value: "5kg", price: 425 },
      { name: "10 kg (Value Pack)", value: "10kg", price: 830 }
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
      { name: "1 kg", value: "1kg", price: 55 },
      { name: "5 kg", value: "5kg", price: 275 },
      { name: "10 kg", value: "10kg", price: 540 }
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
      { name: "1 kg", value: "1kg", price: 48 },
      { name: "5 kg", value: "5kg", price: 240 },
      { name: "10 kg", value: "10kg", price: 470 }
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
      { name: "1 kg", value: "1kg", price: 70 },
      { name: "5 kg", value: "5kg", price: 350 },
      { name: "10 kg", value: "10kg", price: 690 }
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
      { name: "1 kg", value: "1kg", price: 130 },
      { name: "5 kg", value: "5kg", price: 650 }
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
      { name: "1 kg", value: "1kg", price: 110 },
      { name: "5 kg", value: "5kg", price: 550 }
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
      { name: "1 kg", value: "1kg", price: 50 },
      { name: "5 kg", value: "5kg", price: 250 }
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
      { name: "1 kg", value: "1kg", price: 60 },
      { name: "5 kg", value: "5kg", price: 300 }
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
      { name: "1 kg", value: "1kg", price: 120 }
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
      { name: "1 kg", value: "1kg", price: 280 }
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
      { name: "1 kg", value: "1kg", price: 70 },
      { name: "5 kg", value: "5kg", price: 350 }
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
      { name: "1 kg", value: "1kg", price: 60 },
      { name: "5 kg", value: "5kg", price: 300 }
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
      { name: "1 kg", value: "1kg", price: 60 },
      { name: "5 kg", value: "5kg", price: 300 }
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
      { name: "1 kg", value: "1kg", price: 90 },
      { name: "5 kg", value: "5kg", price: 450 }
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
      { name: "1 kg", value: "1kg", price: 150 }
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
      { name: "1 kg", value: "1kg", price: 130 },
      { name: "5 kg", value: "5kg", price: 650 }
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
      { name: "1 kg", value: "1kg", price: 160 }
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
      { name: "1 Liter", value: "1L", price: 360 },
      { name: "5 Liters (Value Pack)", value: "5L", price: 1750 }
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
      { name: "1 Liter", value: "1L", price: 260 },
      { name: "5 Liters (Value Pack)", value: "5L", price: 1250 }
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
      { name: "1 Liter", value: "1L", price: 230 },
      { name: "5 Liters (Value Pack)", value: "5L", price: 1120 }
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
      { name: "1 kg", value: "1kg", price: 40 },
      { name: "10 kg", value: "10kg", price: 400 },
      { name: "50 kg (Bulk)", value: "50kg", price: 1950 }
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
      { name: "1 kg", value: "1kg", price: 40 },
      { name: "10 kg", value: "10kg", price: 400 },
      { name: "50 kg (Bulk)", value: "50kg", price: 1950 }
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
      { name: "1 kg", value: "1kg", price: 150 }
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
      { name: "1 kg", value: "1kg", price: 90 },
      { name: "5 kg", value: "5kg", price: 450 }
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

  // Modal Selectors
  const modalOverlay = document.getElementById('product-modal-overlay');
  const modalClose = document.getElementById('modal-close');
  const modalImage = document.getElementById('modal-image');
  const modalCategory = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const modalPaneDetails = document.getElementById('pane-details');
  const modalPaneNutrition = document.getElementById('pane-nutrition');
  const modalCheckoutSection = document.querySelector('.modal-checkout-section');

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

  // --- PRODUCT CARD HTML GENERATOR ---
  const createProductCardHTML = (prod) => {
    const defaultOption = prod.sizes[1] || prod.sizes[0];
    const optionsHtml = prod.sizes.map(opt => {
      const isSelected = opt.value === defaultOption.value ? 'selected' : '';
      return `<option value="${opt.value}" data-price="${opt.price}" ${isSelected}>${opt.name} - ₹${opt.price}</option>`;
    }).join('');

    const badgeHtml = prod.badge ? `<span class="product-tag badge-${prod.badgeType || 'accent'} font-alt">${prod.badge}</span>` : '';
    const bubbleHtml = prod.infoBubble ? `<div class="info-bubble">${prod.infoBubble}</div>` : '';

    return `
      <div class="product-image-container">
        <img src="${prod.image}" alt="${prod.name}" class="product-image" loading="lazy">
        ${badgeHtml}
        ${bubbleHtml}
      </div>
      <div class="product-details">
        <div class="product-card-header">
          <h3 class="product-title open-modal-trigger" data-product-id="${prod.id}">${prod.name}</h3>
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
          <div class="product-price">₹<span class="price-val" id="price-${prod.id}">${defaultOption.price}</span></div>
          <button class="btn btn-sm btn-primary add-to-cart-btn" 
                  data-id="${prod.id}" 
                  data-name="${prod.name}" 
                  data-image="${prod.image}">
            <i class="fa-solid fa-cart-plus"></i> Add to Cart
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
        const productId = select.getAttribute('data-product-id');
        
        const priceDisplay = document.getElementById(`price-${productId}`);
        if (priceDisplay) {
          priceDisplay.textContent = newPrice;
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

    // 3. Open detailed product specs modal
    activeGridContainer.addEventListener('click', (e) => {
      const trigger = e.target.closest('.open-modal-trigger');
      if (trigger) {
        const id = trigger.getAttribute('data-product-id');
        const prod = PRODUCTS.find(p => p.id === id);
        if (prod) openProductModal(prod);
      }
    });
  }

  // --- ADD TO CART UTILITY ---
  const addToCart = (id, name, image, size, price, btnElement = null) => {
    const existingItem = cart.find(item => item.id === id && item.size === size);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ id, name, image, size, price, quantity: 1 });
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

  // --- PRODUCT SPECS MODAL ACTIONS ---
  const openProductModal = (prod) => {
    modalImage.src = prod.image;
    modalImage.alt = prod.name;
    
    // Set text details
    modalCategory.textContent = prod.category === 'atta-specialty' ? 'Goal-Based Atta' : 
                               (prod.category === 'atta-grains' ? 'Chakki Flours & Grains' : 
                               (prod.category === 'oils' ? 'Cold-Pressed Oils' : 'Khal & Seeds'));
    modalTitle.textContent = prod.name;
    modalDescription.textContent = prod.description;

    // Build ingredients tab pane
    modalPaneDetails.innerHTML = `
      <p style="font-size: 0.95rem; margin-bottom: 12px; color: var(--color-primary); font-weight: 600;">
        <i class="fa-solid fa-leaf"></i> Pure Ingredients:
      </p>
      <p style="margin-bottom: 16px;">${prod.ingredients || '100% natural, farm-sourced raw ingredients without refining or chemical washing.'}</p>
      ${prod.benefits ? `
      <p style="font-size: 0.95rem; margin-bottom: 12px; color: var(--color-primary); font-weight: 600;">
        <i class="fa-solid fa-shield-heart"></i> Daily Health Benefits:
      </p>
      <p>${prod.benefits}</p>` : ''}
    `;

    // Build nutrition tab pane
    if (prod.nutrition) {
      let nutrItems = '';
      for (const [key, value] of Object.entries(prod.nutrition)) {
        const formattedKey = key.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
        nutrItems += `
          <div class="nutrition-item">
            <span class="nutrition-label">${formattedKey}:</span>
            <span class="nutrition-val">${value}</span>
          </div>
        `;
      }
      modalPaneNutrition.innerHTML = `
        <p style="margin-bottom: 16px; font-weight: 600; color: var(--color-primary);">Nutritional Facts per 100g serving:</p>
        <div class="nutrition-grid">${nutrItems}</div>
      `;
    } else {
      modalPaneNutrition.innerHTML = `
        <p>Nutritional charts are currently being certified. Like all raw staples, this product maintains its native high values of plant proteins, complex fiber, minerals, and healthy fats.</p>
      `;
    }

    // Modal action buttons
    // Generate weight selectors block
    const defaultOption = prod.sizes[1] || prod.sizes[0];
    const optionsHtml = prod.sizes.map(opt => {
      const isSelected = opt.value === defaultOption.value ? 'selected' : '';
      return `<option value="${opt.value}" data-price="${opt.price}" ${isSelected}>${opt.name} - ₹${opt.price}</option>`;
    }).join('');

    const modalActionSection = modalCheckoutSection.querySelector('.modal-actions') || document.createElement('div');
    modalActionSection.className = 'modal-actions';
    modalActionSection.style.display = 'flex';
    modalActionSection.style.gap = '16px';
    modalActionSection.style.marginTop = '16px';
    modalActionSection.innerHTML = `
      <select id="modal-size-select" class="product-size-select" style="max-width: 180px;">
        ${optionsHtml}
      </select>
      <button class="btn btn-primary" id="modal-add-to-cart-btn" style="flex-grow: 1;">
        <i class="fa-solid fa-cart-plus"></i> Add to Basket
      </button>
    `;
    
    // Insert selection tools in checkout block
    if (!modalCheckoutSection.querySelector('.modal-actions')) {
      modalCheckoutSection.insertBefore(modalActionSection, modalCheckoutSection.firstChild);
    }

    // Attach listeners inside modal actions
    const modalSelect = document.getElementById('modal-size-select');
    const modalAddBtn = document.getElementById('modal-add-to-cart-btn');

    modalAddBtn.addEventListener('click', () => {
      const selectedOption = modalSelect.options[modalSelect.selectedIndex];
      const size = selectedOption.value;
      const price = parseInt(selectedOption.getAttribute('data-price'));
      
      addToCart(prod.id, prod.name, prod.image, size, price, modalAddBtn);
      
      // Close modal popup
      setTimeout(() => {
        closeProductModal();
      }, 800);
    });

    // Reset default active specification tab
    document.querySelectorAll('.modal-tab').forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-pane') === 'pane-details');
    });
    document.querySelectorAll('.modal-pane').forEach(pane => {
      pane.classList.toggle('active', pane.id === 'pane-details');
    });

    // Open overlay
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeProductModal = () => {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (modalClose) {
    modalClose.addEventListener('click', closeProductModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeProductModal();
    });
  }

  // Specifications tabs listeners inside details modal
  const modalTabsContainer = document.querySelector('.modal-tabs');
  if (modalTabsContainer) {
    modalTabsContainer.addEventListener('click', (e) => {
      const tab = e.target.closest('.modal-tab');
      if (tab) {
        document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.modal-pane').forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const paneId = tab.getAttribute('data-pane');
        document.getElementById(paneId).classList.add('active');
      }
    });
  }

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

  cartToggle.addEventListener('click', () => toggleCartDrawer(true));
  cartClose.addEventListener('click', () => toggleCartDrawer(false));
  cartOverlay.addEventListener('click', () => toggleCartDrawer(false));
  
  document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains('close-cart-link')) {
      toggleCartDrawer(false);
    }
  });

  // --- CART RENDER & QUANTITIES ---
  const updateCartUI = () => {
    const totalItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItemsCount;
    
    if (cart.length === 0) {
      emptyCartState.style.display = 'flex';
      cartItemsList.style.display = 'none';
      cartFooter.style.display = 'none';
    } else {
      emptyCartState.style.display = 'none';
      cartItemsList.style.display = 'flex';
      cartFooter.style.display = 'block';
    }

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

    cartSubtotal.textContent = `₹${finalSubtotal}`;

    // Update Free Delivery Progress Bar (Threshold: ₹500)
    const threshold = 500;
    const progressPercent = Math.min((subtotalValue / threshold) * 100, 100);
    cartProgressFill.style.width = `${progressPercent}%`;
    
    if (subtotalValue >= threshold) {
      cartProgressText.innerHTML = `<i class="fa-solid fa-circle-check"></i> 🎉 Congrats! You've unlocked **Free Delivery**!`;
      cartProgressFill.style.backgroundColor = '#214E34'; // Forest green
    } else {
      const gap = threshold - subtotalValue;
      cartProgressText.innerHTML = `<i class="fa-solid fa-truck-fast"></i> Add **₹${gap}** more for **Free Delivery**`;
      cartProgressFill.style.backgroundColor = ''; // Reverts to default CSS Golden Accent
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

  // --- WHATSAPP CHECKOUT INTEGRATION ---
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

  // --- INITIALIZE CATALOG & CART ---
  renderProducts();
  loadCart();
});
