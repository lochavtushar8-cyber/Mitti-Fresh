/* ==========================================================================
   Mitti Fresh - Dynamic Application Script
   ========================================================================== */

// --- PRODUCT DATABASE (FALLBACK MOCK BACKUP) ---
const STATIC_BACKUP_PRODUCTS = [];


// Dynamic PRODUCTS holder
let PRODUCTS = [];

// --- BEST SELLER RANK SORTING HELPER ---
const sortByBestSellerRank = (productsArr) => {
  if (!Array.isArray(productsArr)) return [];
  return [...productsArr].sort((a, b) => {
    const getRank = (p) => {
      if (!p) return Number.MAX_SAFE_INTEGER;
      let r = p.bestSellerRank ?? p.bestseller_rank ?? p.rank;
      if ((r === null || r === undefined || r === "") && p.video && typeof p.video === 'string' && p.video.startsWith('RANK:')) {
        const parsed = parseInt(p.video.replace('RANK:', ''));
        if (!isNaN(parsed) && parsed > 0) r = parsed;
      }
      return (r !== null && r !== undefined && r !== "" && !isNaN(r) && Number(r) > 0) ? Number(r) : Number.MAX_SAFE_INTEGER;
    };
    const rankA = getRank(a);
    const rankB = getRank(b);
    return rankA - rankB;
  });
};

// Rebuild frontend catalog structure from database variants
const rebuildCatalog = (dbProducts) => {
  const catalogMap = {};
  
  const reverseCategoryMap = (cat, name = "") => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('khal') || lowerName.includes('peas') || lowerName.includes('methi') || lowerName.includes('fenugreek')) {
      return 'khal-seeds';
    }
    switch (cat) {
      case 'Wheat Atta': return 'atta-grains';
      case 'Multigrain Atta': return 'atta-specialty';
      case 'Cold Pressed Oil': return 'oils';
      case 'Gram Flour & Grains': return 'atta-grains';
      default: return 'atta-grains';
    }
  };

  dbProducts.forEach(item => {
    try {
      if (!item || (!item.slug && !item.id)) return;
      const slugVal = item.slug || item.id || "unknown-product";
      const parts = slugVal.split('-');
      const sizeValue = parts[parts.length - 1]; // "1kg"
      const baseId = parts.slice(0, -1).join('-'); // "multigrain-atta-special"
      
      const actualBaseId = baseId || slugVal;
      const actualSizeVal = baseId ? sizeValue : (item.weight || "1 unit");
      const nameVal = item.name ? item.name.replace(/\s*\([^)]*\)\s*$/, '').trim() : "Mitti Fresh Staple";

      const itemImg = item.image || item.imageUrl || item.mainImage || item.thumbnail || "assets/logo.jpg";
      const itemGallery = (Array.isArray(item.gallery) && item.gallery.length > 0) 
        ? item.gallery 
        : ((Array.isArray(item.images) && item.images.length > 0) ? item.images : [itemImg]);

      let rankVal = item.bestseller_rank ?? item.bestSellerRank ?? item.rank;
      if ((rankVal === null || rankVal === undefined || rankVal === "") && item.video && typeof item.video === 'string' && item.video.startsWith('RANK:')) {
        const parsed = parseInt(item.video.replace('RANK:', ''));
        if (!isNaN(parsed) && parsed > 0) rankVal = parsed;
      }

      if (!catalogMap[actualBaseId]) {
        catalogMap[actualBaseId] = {
          id: actualBaseId,
          name: nameVal,
          category: reverseCategoryMap(item.category || "", item.name || ""),
          description: item.shortDescription || item.fullDescription || "",
          basePrice: item.sellingPrice || item.price || 0,
          unit: item.weight ? item.weight.replace(/[\d\s]/g, '') : "kg",
          sizes: [],
          image: itemImg,
          imageUrl: itemImg,
          mainImage: itemImg,
          thumbnail: itemImg,
          gallery: itemGallery,
          images: itemGallery,
          galleryImages: itemGallery,
          ingredients: item.ingredients || "",
          benefits: item.benefits || "",
          nutrition: item.nutrition || null,
          badge: item.badge || "",
          badgeType: item.badgeType || "",
          bestSellerRank: rankVal || null,
          bestseller_rank: rankVal || null,
          rank: rankVal || null
        };
      } else {
        const currentImg = catalogMap[actualBaseId].image;
        const isCurrentDefault = !currentImg || currentImg === 'assets/logo.jpg' || currentImg === 'assets/grinding_live.jpg' || currentImg === 'assets/hero_banner.jpg';
        const isNewUploaded = itemImg && itemImg.startsWith('/uploads/');
        const isNewCustom = itemImg && itemImg !== 'assets/logo.jpg';

        if (isNewUploaded || (isCurrentDefault && isNewCustom)) {
          catalogMap[actualBaseId].image = itemImg;
          catalogMap[actualBaseId].imageUrl = itemImg;
          catalogMap[actualBaseId].mainImage = itemImg;
          catalogMap[actualBaseId].thumbnail = itemImg;
        }

        if (Array.isArray(itemGallery) && itemGallery.length > 0 && (isNewUploaded || isCurrentDefault)) {
          catalogMap[actualBaseId].gallery = itemGallery;
          catalogMap[actualBaseId].images = itemGallery;
          catalogMap[actualBaseId].galleryImages = itemGallery;
        }
      }
      
      catalogMap[actualBaseId].sizes.push({
        name: item.weight || actualSizeVal,
        value: actualSizeVal,
        price: item.sellingPrice || item.price || 0,
        selling_price: item.sellingPrice || item.price || 0,
        mrp: item.MRP || item.sellingPrice || item.price || 0,
        stock: typeof item.stock === 'number' ? item.stock : 100,
        sku: item.SKU || "",
        dbId: item.id || slugVal,
        image: itemImg,
        imageUrl: itemImg,
        mainImage: itemImg,
        thumbnail: itemImg,
        gallery: itemGallery,
        images: itemGallery,
        galleryImages: itemGallery
      });
    } catch (err) {
      console.error("Mitti Fresh - Failed to parse database product entry:", item, err);
    }
  });

  return Object.values(catalogMap);
};

// --- APP INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
  // Inject a small visual floating badge to verify app-v2.js is active
  console.log("Mitti Fresh app-v2.js successfully loaded in browser!");
  try {
    const dbg = document.createElement('div');
    dbg.id = 'mitti-sync-badge';
    dbg.style.position = 'fixed';
    dbg.style.bottom = '15px';
    dbg.style.left = '15px';
    dbg.style.background = 'rgba(33, 78, 52, 0.9)';
    dbg.style.color = '#fff';
    dbg.style.padding = '6px 12px';
    dbg.style.fontSize = '11px';
    dbg.style.borderRadius = '20px';
    dbg.style.zIndex = '999999';
    dbg.style.fontFamily = 'sans-serif';
    dbg.style.pointerEvents = 'none';
    dbg.style.boxShadow = '0 2px 10px rgba(0,0,0,0.15)';
    dbg.style.display = 'flex';
    dbg.style.alignItems = 'center';
    dbg.style.gap = '6px';
    dbg.innerHTML = `<span style="display: inline-block; width: 6px; height: 6px; background: #2ECC71; border-radius: 50%;"></span> Live Sync V2.0 Active`;
    document.body.appendChild(dbg);
  } catch (e) {}

  // Establish real-time SSE listener for catalog updates
  try {
    const sseUrl = window.getApiEndpoint('/api/events');
    if (sseUrl) {
      const eventSource = new EventSource(sseUrl);
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'catalog-updated' || data.type === 'settings-updated') {
            console.log("Mitti Fresh - Live update event received, reloading page...", data);
            window.location.reload();
          }
        } catch (e) {}
      };
    }
  } catch (e) {}

  // Load products list from backend dynamically
  try {
    const res = await fetch(window.getApiEndpoint('/api/products') + '?t=' + Date.now(), { cache: 'no-store' });
    if (res.ok) {
      const dbProducts = await res.json();
      try { localStorage.removeItem('mitti_fresh_products'); } catch (e) {}
      PRODUCTS = sortByBestSellerRank(rebuildCatalog(dbProducts));
    } else {
      const cached = localStorage.getItem('mitti_fresh_products');
      if (cached) {
        try {
          PRODUCTS = sortByBestSellerRank(rebuildCatalog(JSON.parse(cached)));
        } catch(e) {
          PRODUCTS = sortByBestSellerRank(STATIC_BACKUP_PRODUCTS);
        }
      } else {
        PRODUCTS = sortByBestSellerRank(STATIC_BACKUP_PRODUCTS);
      }
    }
  } catch (err) {
    console.warn("Offline fallback, loading static catalog:", err);
    const cached = localStorage.getItem('mitti_fresh_products');
    if (cached) {
      try {
        PRODUCTS = sortByBestSellerRank(rebuildCatalog(JSON.parse(cached)));
      } catch(e) {
        PRODUCTS = sortByBestSellerRank(STATIC_BACKUP_PRODUCTS);
      }
    } else {
      PRODUCTS = sortByBestSellerRank(STATIC_BACKUP_PRODUCTS);
    }
  }

  // Trigger immediate catalog render after products are fetched
  if (typeof renderProducts === 'function') {
    renderProducts();
  }

  // Load dynamic homepage config on homepage
  try {
    const hpRes = await fetch(window.getApiEndpoint('/api/homepage') + '?t=' + Date.now());
    if (hpRes.ok) {
      const hp = await hpRes.json();
      if (hp) {
        if (hp.hero) {
          const heroTitle = document.querySelector('.hero-section h1');
          const heroSubtitle = document.querySelector('.hero-section p');
          if (heroTitle) heroTitle.textContent = hp.hero.title;
          if (heroSubtitle) heroSubtitle.textContent = hp.hero.subtitle;
        }
        
        if (hp.bannerText) {
          const alertSpan = document.querySelector('#announcement-banner span');
          if (alertSpan) {
            alertSpan.textContent = hp.bannerText;
          }
        }
        
        if (hp.testimonials && hp.testimonials.length > 0) {
          const reviewsContainer = document.getElementById('reviews-slider');
          if (reviewsContainer) {
            reviewsContainer.innerHTML = hp.testimonials.map(t => `
              <div class="review-slide">
                <div class="review-stars">
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                </div>
                <p class="review-text">"${t.text}"</p>
                <div class="review-author"><i class="fa-solid fa-circle-check"></i> ${t.name}</div>
                <div class="review-location">${t.role}</div>
              </div>
            `).join('');
            
            // Reinitialize review slider with new dynamic slides
            if (window.initReviewsSlider) {
              window.initReviewsSlider();
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn("Offline homepage config fallback", err);
  }
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
  window.initReviewsSlider = () => {
    const reviewsSlider = document.getElementById('reviews-slider');
    const prevBtn = document.getElementById('rev-prev');
    const nextBtn = document.getElementById('rev-next');
    const dotsContainer = document.getElementById('reviews-dots');

    if (reviewsSlider && prevBtn && nextBtn && dotsContainer) {
      // Clear old dots first
      dotsContainer.innerHTML = "";
      
      const slides = reviewsSlider.querySelectorAll('.review-slide');
      if (slides.length === 0) return;
      
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
        dotsContainer.querySelectorAll('.reviews-dot').forEach((dot, idx) => {
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

      // Clone listeners to avoid duplicate click handlers if re-initialized
      const newPrevBtn = prevBtn.cloneNode(true);
      const newNextBtn = nextBtn.cloneNode(true);
      prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
      nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);

      newNextBtn.addEventListener('click', () => {
        nextSlide();
        resetInterval();
      });

      newPrevBtn.addEventListener('click', () => {
        prevSlide();
        resetInterval();
      });

      // Re-bind dots container click handler
      const newDotsContainer = dotsContainer.cloneNode(true);
      dotsContainer.parentNode.replaceChild(newDotsContainer, dotsContainer);

      newDotsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('reviews-dot')) {
          const index = parseInt(e.target.getAttribute('data-index'));
          updateSlider(index);
          resetInterval();
        }
      });

      const startInterval = () => {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 6000);
      };

      const resetInterval = () => {
        clearInterval(slideInterval);
        startInterval();
      };

      startInterval();
    }
  };

  // Initial call with hardcoded html slides
  window.initReviewsSlider();

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
    const cardImg = (prod.sizes && prod.sizes.find(s => s.image && s.image.startsWith('/uploads/')))
      ? prod.sizes.find(s => s.image && s.image.startsWith('/uploads/')).image
      : ((defaultOption && defaultOption.image) ? defaultOption.image : (prod.image || "assets/logo.jpg"));

    const optionsHtml = prod.sizes.map(opt => {
      const isOutOfStock = opt.stock === 0;
      const stockText = isOutOfStock ? ' (Out of Stock)' : '';
      const optImg = opt.image || cardImg;
      return `<option value="${opt.value}" data-price="${opt.price}" data-mrp="${opt.mrp || opt.price}" data-stock="${opt.stock}" data-image="${optImg}" ${isOutOfStock ? 'style="color:#CB4335"' : ''}>${opt.name} - ₹${opt.price}${stockText}</option>`;
    }).join('');

    const badgeHtml = prod.badge ? `<span class="product-tag badge-${prod.badgeType || 'accent'} font-alt">${prod.badge}</span>` : '';
    const bubbleHtml = prod.infoBubble ? `<div class="info-bubble">${prod.infoBubble}</div>` : '';

    return `
      <a href="/product?id=${prod.id}" class="product-card-media-link">
        <div class="product-image-container">
          <img src="${cardImg}" alt="${prod.name}" class="product-image" loading="lazy">
          ${badgeHtml}
          ${bubbleHtml}
        </div>
      </a>
      <div class="product-details">
        <div class="product-card-header">
          <a href="/product?id=${prod.id}" class="product-title-link">
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
                  data-image="${prod.image}"
                  ${defaultOption.stock === 0 ? 'disabled style="background:#CCC; border-color:#CCC; cursor:not-allowed"' : ''}>
            ${defaultOption.stock === 0 ? 'Out of Stock' : '<i class="fa-solid fa-cart-plus"></i> Add'}
          </button>
        </div></div>
      </div>
    `;
  };

  // --- PRODUCT CATALOG RENDER ---
  function renderProducts() {
    try {
      if (bestsellersList) {
        bestsellersList.innerHTML = '';
        const sortedBestsellers = sortByBestSellerRank(PRODUCTS);
        
        sortedBestsellers.forEach(prod => {
          try {
            if (!prod) return;
            const card = document.createElement('div');
            card.className = 'product-card';
            card.setAttribute('data-category', prod.category || '');
            card.innerHTML = createProductCardHTML(prod);
            bestsellersList.appendChild(card);
          } catch (itemErr) {
            console.error("Mitti Fresh - Failed rendering bestseller item:", prod, itemErr);
          }
        });
      }

      if (productList) {
        productList.innerHTML = '';
        const filteredProducts = PRODUCTS.filter(prod => {
          if (!prod) return false;
          const matchesCategory = currentCategory === 'all' || prod.category === currentCategory;
          const searchLower = (currentSearchQuery || '').toLowerCase();
          const matchesSearch = (prod.name || '').toLowerCase().includes(searchLower) ||
                                (prod.description || '').toLowerCase().includes(searchLower) ||
                                (prod.ingredients && prod.ingredients.toLowerCase().includes(searchLower));
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

        const sortedProducts = sortByBestSellerRank(filteredProducts);

        sortedProducts.forEach(prod => {
          try {
            if (!prod) return;
            const card = document.createElement('div');
            card.className = 'product-card';
            card.setAttribute('data-category', prod.category || '');
            card.innerHTML = createProductCardHTML(prod);
            productList.appendChild(card);
          } catch (itemErr) {
            console.error("Mitti Fresh - Failed rendering product item:", prod, itemErr);
          }
        });
      }
    } catch (err) {
      console.error("Mitti Fresh - Render products error:", err);
    }
  }

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
        const newStock = parseInt(selectedOption.getAttribute('data-stock') || '0');
        const newImg = selectedOption.getAttribute('data-image');
        const productId = select.getAttribute('data-product-id');
        
        if (newImg) {
          const cardImgEl = select.closest('.product-card') ? select.closest('.product-card').querySelector('.product-image') : null;
          if (cardImgEl) cardImgEl.src = newImg;
        }

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

        // Disable Add button if selected option has zero stock
        const buyBtn = select.closest('.product-details').querySelector('.add-to-cart-btn');
        if (buyBtn) {
          if (newStock === 0) {
            buyBtn.disabled = true;
            buyBtn.style.background = '#CCC';
            buyBtn.style.borderColor = '#CCC';
            buyBtn.style.cursor = 'not-allowed';
            buyBtn.innerHTML = 'Out of Stock';
          } else {
            buyBtn.disabled = false;
            buyBtn.style.background = '';
            buyBtn.style.borderColor = '';
            buyBtn.style.cursor = '';
            buyBtn.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Add';
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

  // --- SECURE CHECKOUT PAGE REDIRECT ---
  if (checkoutBtn) {
    checkoutBtn.innerHTML = `<i class="fa-solid fa-credit-card"></i> Proceed to Checkout`;
    checkoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (cart.length === 0) {
        alert("Your basket is empty!");
        return;
      }
      window.location.href = "/checkout";
    });
  }

  // --- DEDICATED PRODUCT DETAILS PAGE RENDERER ---
  const productDetailRoot = document.getElementById('product-detail-root');
  if (productDetailRoot) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const prod = PRODUCTS.find(p => p.id === productId || p.slug === productId || (p.sizes && p.sizes.some(s => s.dbId === productId)));

    if (!prod) {
      // Redirect to shop if product not found
      productDetailRoot.innerHTML = `
        <div class="no-results-state" style="text-align: center; padding: 100px 0;">
          <i class="fa-solid fa-triangle-exclamation" style="font-size: 3rem; color: #E74C3C; margin-bottom: 16px;"></i>
          <h3>Product Not Found</h3>
          <p>The product you are looking for does not exist or has been removed.</p>
          <a href="/collections/staples" class="btn btn-primary" style="margin-top: 20px;">Return to Shop</a>
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
      let backupRelated = PRODUCTS.filter(p => (p.badgeType === 'bestseller' || (p.badge && p.badge.toLowerCase().includes('best'))) && p.id !== prod.id).slice(0, 4);
      if (backupRelated.length === 0) {
        backupRelated = PRODUCTS.filter(p => p.id !== prod.id).slice(0, 4);
      }
      const selectedRelated = relatedProducts.length >= 2 ? relatedProducts : backupRelated;

      let relatedHtml = '';
      selectedRelated.forEach(rel => {
        relatedHtml += `
          <div class="product-card">
            <a href="/product?id=${rel.id}" class="product-card-media-link">
              <div class="product-image-container">
                <img src="${rel.image}" alt="${rel.name}" class="product-image" loading="lazy">
              </div>
            </a>
            <div class="product-details">
              <div class="product-card-header">
                <a href="/product?id=${rel.id}" class="product-title-link">
                  <h3 class="product-title">${rel.name}</h3>
                </a>
              </div>
              <p class="product-description" style="max-height: 40px; overflow: hidden;">${rel.description}</p>
              <div class="product-footer" style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(33, 78, 52, 0.05);">
                <div class="product-price">₹${rel.sizes[0].price}</div>
                <a href="/product?id=${rel.id}" class="btn btn-sm btn-secondary">View Specs</a>
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

      // Log the product object to the console to verify dynamic fields
      console.log("Mitti Fresh loaded product details schema:", prod);

      // Match size variant index based on productId requested in URL
      const targetIdx = prod.sizes.findIndex(s => s.dbId === productId);
      let activeSizeIndex = targetIdx !== -1 ? targetIdx : 0;
      let activeSize = prod.sizes[activeSizeIndex] || prod.sizes[0];
      let activePrice = activeSize.sellingPrice || activeSize.selling_price || activeSize.price || 0;
      let activeMrp = activeSize.mrp || activeSize.originalPrice || activeSize.original_price || activePrice || 0;
      let savings = activeMrp - activePrice;
      let savingsPercent = Math.round((savings / activeMrp) * 100);

      const activeImage = (activeSize && (activeSize.image || activeSize.imageUrl || activeSize.mainImage || activeSize.thumbnail)) || prod.image || "assets/logo.jpg";
      const activeGallery = (activeSize && Array.isArray(activeSize.gallery) && activeSize.gallery.length > 0) 
        ? activeSize.gallery 
        : ((Array.isArray(prod.gallery) && prod.gallery.length > 0) ? prod.gallery : [activeImage]);

      // Render details page grid layout
      productDetailRoot.innerHTML = `
        <div class="product-detail-grid">
          <!-- Left side: Images and Badges -->
          <div class="product-gallery-section">
            <div class="image-zoom-container" id="zoom-container">
              <img src="${activeImage}" alt="${prod.name}" id="main-product-img">
            </div>
            
            <div class="gallery-thumbnails">
              ${activeGallery.map((gUrl, idx) => `
                <button class="gallery-thumbnail ${idx === 0 ? 'active' : ''}" data-src="${gUrl}">
                  <img src="${gUrl}" alt="${prod.name} view ${idx + 1}">
                </button>
              `).join('')}
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
              <button class="btn btn-secondary btn-large" id="buy-now-btn" ${activeSize.stock === 0 ? 'disabled style="background:#CCC; border-color:#CCC; cursor:not-allowed"' : ''}>
                ${activeSize.stock === 0 ? 'Out of Stock' : 'Buy Now'}
              </button>
              <button class="btn btn-primary btn-large" id="add-cart-btn" ${activeSize.stock === 0 ? 'disabled style="background:#CCC; border-color:#CCC; cursor:not-allowed"' : ''}>
                ${activeSize.stock === 0 ? 'Out of Stock' : '<i class="fa-solid fa-cart-plus"></i> Add to Basket'}
              </button>
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
            activePrice = activeSize.sellingPrice || activeSize.selling_price || activeSize.price || 0;
            activeMrp = activeSize.mrp || activeSize.originalPrice || activeSize.original_price || activePrice || 0;
            savings = activeMrp - activePrice;
            savingsPercent = Math.round((savings / activeMrp) * 100);

            const sizeImg = (activeSize && (activeSize.image || activeSize.imageUrl || activeSize.mainImage || activeSize.thumbnail)) || prod.image || "assets/logo.jpg";
            const sizeGallery = (activeSize && Array.isArray(activeSize.gallery) && activeSize.gallery.length > 0) 
              ? activeSize.gallery 
              : ((Array.isArray(prod.gallery) && prod.gallery.length > 0) ? prod.gallery : [sizeImg]);

            const mainImgEl = document.getElementById('main-product-img');
            if (mainImgEl) mainImgEl.src = sizeImg;

            const thumbnailsContainer = document.querySelector('.gallery-thumbnails');
            if (thumbnailsContainer) {
              thumbnailsContainer.innerHTML = sizeGallery.map((gUrl, idx) => `
                <button class="gallery-thumbnail ${idx === 0 ? 'active' : ''}" data-src="${gUrl}">
                  <img src="${gUrl}" alt="${prod.name} view ${idx + 1}">
                </button>
              `).join('');
            }

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

            // Update stock feedback
            const addCartBtn = document.getElementById('add-cart-btn');
            const buyNowBtn = document.getElementById('buy-now-btn');
            const isOut = activeSize.stock === 0;

            [addCartBtn, buyNowBtn, stickyAddCart, stickyBuyNow].forEach(btn => {
              if (btn) {
                btn.disabled = isOut;
                btn.style.background = isOut ? '#CCC' : '';
                btn.style.borderColor = isOut ? '#CCC' : '';
                btn.style.cursor = isOut ? 'not-allowed' : '';
                if (btn === addCartBtn || btn === stickyAddCart) {
                  btn.innerHTML = isOut ? 'Out of Stock' : '<i class="fa-solid fa-cart-plus"></i> Add to Basket';
                } else if (btn === buyNowBtn || btn === stickyBuyNow) {
                  btn.textContent = isOut ? 'Out of Stock' : 'Buy Now';
                }
              }
            });
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
        if (addCartBtn && stickyBar) {
          const buyBtnRect = addCartBtn.getBoundingClientRect();
          if (buyBtnRect.bottom < 0) {
            stickyBar.classList.add('visible');
          } else {
            stickyBar.classList.remove('visible');
          }
        }
      });
    }
  }

  // Expose methods for AI assistant integrations
  window.addToCartExternal = addToCart;
  window.toggleCartDrawerExternal = toggleCartDrawer;

  // --- INITIALIZE CATALOG & CART ---
  renderProducts();
  loadCart();
});
