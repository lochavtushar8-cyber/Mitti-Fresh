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
    ingredients: "Wheat (3.75 kg), Chana (300 g), Soybean (200 g), Oats (150 g), Jau (200 g), Ragi (150 g), Makka (125 g), Jowar (75 g), Bajra (50 g)",
    benefits: "High Fibre, Better Digestion, Rich in Vitamins & Minerals"
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
    ingredients: "Wheat (2.90 kg), Chana (900 g), Soybean (600 g), Oats (200 g), Jau (150 g), Ragi (100 g), Jowar (75 g), Bajra (75 g)",
    benefits: "High in Protein, Muscle Growth & Recovery, Natural Energy Booster"
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
    ingredients: "Wheat (2.80 kg), Oats (600 g), Jau (600 g), Chana (500 g), Soybean (300 g), Flaxseed (200 g)",
    benefits: "High Fibre, High Protein, Supports Healthy Weight, Better Digestion"
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
    ingredients: "Wheat (2.70 kg), Jau (750 g), Oats (500 g), Chana (500 g), Soybean (300 g), Flaxseed (150 g), Ragi (100 g)",
    benefits: "Helps Reduce Sugar Spikes, Supports Heart Health, High Fibre"
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
    ingredients: "Wheat (3.00 kg), Oats (600 g), Jau (600 g), Flaxseed (300 g), Chana (500 g)",
    benefits: "Rich in Fibre, Omega-3 from Flaxseed, Helps Maintain Cholesterol"
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
    ingredients: "Wheat (3.40 kg), Chana (700 g), Ragi (400 g), Oats (300 g), Soybean (200 g)",
    benefits: "High Protein, Rich in Calcium, Rich in Iron, Healthy Growth"
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
    ingredients: "Wheat (2.80 kg), Oats (700 g), Jau (600 g), Chana (600 g), Flaxseed (300 g)",
    benefits: "High Fibre, Supports Digestive Health, Promotes Regular Bowels"
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
    badgeType: "bestseller"
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
    image: "assets/wheat_atta.jpg"
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
    image: "assets/multigrain_atta.jpg"
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
    image: "assets/wheat_atta.jpg"
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
    badgeType: "bestseller"
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
    image: "assets/wheat_atta.jpg"
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
    image: "assets/wheat_atta.jpg"
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
    image: "assets/wheat_atta.jpg"
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
    image: "assets/wheat_atta.jpg"
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
    image: "assets/wheat_atta.jpg"
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
    image: "assets/wheat_atta.jpg"
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
    image: "assets/wheat_atta.jpg"
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
    image: "assets/wheat_atta.jpg"
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
    image: "assets/wheat_atta.jpg"
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
    image: "assets/hero_banner.jpg"
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
    image: "assets/hero_banner.jpg"
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
    infoBubble: "Crafted from 3kg premium seeds per liter"
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
    image: "assets/mustard_oil.jpg"
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
    badgeType: "new"
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
    badge: "Mustard Oil Cake"
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
    badge: "Mustard Oil Cake"
  },
  {
    id: "methi-dana",
    name: "Methi Dana (Fenugreek Seeds)",
    category: "khal-seeds",
    description: "Premium selected fenugreek seeds, ideal for spice use or traditional wellness recipes.",
    basePrice: 150,
    unit: "kg",
    sizes: [
      { name: "1 kg", value: "1kg", price: 150 }
    ],
    image: "assets/hero_banner.jpg"
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
    image: "assets/hero_banner.jpg"
  }
];

// --- APP INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  let cart = [];
  let currentCategory = 'all';
  let currentSearchQuery = '';

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

  // --- HELPER TO BUILD PRODUCT CARD HTML ---
  const createProductCardHTML = (prod) => {
    // Determine default option
    const defaultOption = prod.sizes[1] || prod.sizes[0]; // Prefer family sizes
    
    // Build options HTML
    const optionsHtml = prod.sizes.map(opt => {
      const isSelected = opt.value === defaultOption.value ? 'selected' : '';
      return `<option value="${opt.value}" data-price="${opt.price}" ${isSelected}>${opt.name} - ₹${opt.price}</option>`;
    }).join('');

    // Build product badge
    const badgeHtml = prod.badge ? `<span class="product-tag badge-${prod.badgeType || 'accent'} font-alt">${prod.badge}</span>` : '';
    
    // Build info bubble (for mustard oil crafted text, etc.)
    const bubbleHtml = prod.infoBubble ? `<div class="info-bubble">${prod.infoBubble}</div>` : '';

    // Build special diet goal blocks (ingredients & benefits list)
    let infoListHtml = '';
    if (prod.ingredients && prod.benefits) {
      infoListHtml = `
        <div class="product-info-list">
          <div class="info-list-title"><i class="fa-solid fa-mortar-pestle"></i> Ingredients Ratio:</div>
          <div class="info-list-val">${prod.ingredients}</div>
          <div class="info-list-title" style="margin-top: 8px;"><i class="fa-solid fa-award"></i> Health Benefits:</div>
          <div class="info-list-val">${prod.benefits}</div>
        </div>
      `;
    }

    return `
      <div class="product-image-container">
        <img src="${prod.image}" alt="${prod.name}" class="product-image" loading="lazy">
        ${badgeHtml}
        ${bubbleHtml}
      </div>
      <div class="product-details">
        <h3 class="product-title">${prod.name}</h3>
        <p class="product-description">${prod.description}</p>
        
        ${infoListHtml}

        <div class="product-selector-group">
          <label for="size-select-${prod.id}" class="selector-label">Selection:</label>
          <select id="size-select-${prod.id}" class="product-size-select" data-product-id="${prod.id}">
            ${optionsHtml}
          </select>
        </div>

        <div class="product-footer">
          <div class="product-price">₹<span class="price-val" id="price-${prod.id}">${defaultOption.price}</span></div>
          <button class="btn btn-sm btn-accent add-to-cart-btn" 
                  data-id="${prod.id}" 
                  data-name="${prod.name}" 
                  data-image="${prod.image}">
            <i class="fa-solid fa-cart-plus"></i> Add to Cart
          </button>
        </div>
      </div>
    `;
  };

  // --- PRODUCT RENDERING LOGIC ---
  const renderProducts = () => {
    // 1. Render Bestsellers if on Home Page
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

    // 2. Render Full Catalog if on Shop Page
    if (productList) {
      productList.innerHTML = '';
      
      // Filter product listing
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

  // --- DELEGATED EVENT LISTENERS FOR DYNAMIC PRODUCT GRIDS ---
  
  // Shared parent listener (detects clicks/changes on either list depending on which page we are on)
  const activeGridContainer = productList || bestsellersList;
  
  if (activeGridContainer) {
    // 1. Dropdown Size/Price Update
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

    // 2. Add to Cart button clicked
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

        // Check if product is already in cart
        const existingItem = cart.find(item => item.id === id && item.size === size);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.push({
            id,
            name,
            image,
            size,
            price,
            quantity: 1
          });
        }

        saveCart();
        updateCartUI();
        
        // Button success feedback
        const originalHTML = btn.innerHTML;
        btn.innerHTML = `<i class="fa-solid fa-check"></i> Added!`;
        btn.style.backgroundColor = '#1E442F'; // Success green
        btn.disabled = true;
        
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.backgroundColor = '';
          btn.disabled = false;
        }, 1000);

        // Open drawer automatically on add
        setTimeout(() => {
          toggleCartDrawer(true);
        }, 400);
      }
    });
  }

  // --- SEARCH TRIGGERS ---
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      
      // Show/hide clear search button
      if (currentSearchQuery.length > 0) {
        searchClear.style.display = 'block';
      } else {
        searchClear.style.display = 'none';
      }
      
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

  // --- CATEGORY TABS CLICK HANDLING ---
  if (categoryTabs) {
    categoryTabs.addEventListener('click', (e) => {
      const card = e.target.closest('.category-card');
      if (card) {
        // Toggle active states on tabs
        document.querySelectorAll('.category-card').forEach(tab => {
          tab.classList.remove('active');
        });
        card.classList.add('active');
        
        currentCategory = card.getAttribute('data-category');
        renderProducts();
        
        // Scroll shop section header into view smoothly if user is on mobile
        if (window.innerWidth < 768) {
          const shopHeader = document.querySelector('.shop-section');
          if (shopHeader) {
            shopHeader.scrollIntoView({ behavior: 'smooth' });
          }
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

  // --- CART ACTIONS & INTERACTIVE RENDER ---
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

    cartSubtotal.textContent = `₹${subtotalValue}`;
  };

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

  // Cart quantity adjuster clicks (Delegated to cart list)
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
    message += `*Total Order Value: ₹${subtotalValue}*\n\n`;
    message += `Please confirm availability and coordinate delivery/pick-up details for Dwarka Sector 28. Thank you!`;

    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;

    window.open(whatsappUrl, '_blank');
  });

  // --- INITIALIZE CATALOG & CART ---
  renderProducts();
  loadCart();
});
