/* ==========================================================================
   Mitti Fresh - Dynamic Application Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- STATE ---
  let cart = [];

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
  
  const categoryCards = document.querySelectorAll('.category-card');
  const productCards = document.querySelectorAll('.product-card');
  const sizeSelectors = document.querySelectorAll('.product-size-select');
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

  // --- LOCAL STORAGE INIT ---
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

  // --- MOBILE NAV TOGGLE ---
  if (mobileMenuToggle && mobileMenu && mobileMenuClose) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenu.classList.add('open');
    });

    mobileMenuClose.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
    });

    // Close mobile nav when clicking a link
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
    });
  }

  // --- CATEGORY FILTERING ---
  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      // Toggle active class on categories
      categoryCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const selectedCategory = card.getAttribute('data-category');

      // Filter products
      productCards.forEach(product => {
        const productCategory = product.getAttribute('data-category');
        if (selectedCategory === 'all' || productCategory === selectedCategory) {
          product.style.display = 'flex';
          // Simple entry animation
          product.style.opacity = '0';
          setTimeout(() => {
            product.style.opacity = '1';
            product.style.transition = 'opacity 0.4s ease';
          }, 50);
        } else {
          product.style.display = 'none';
        }
      });
    });
  });

  // --- PRICE SELECTORS ---
  sizeSelectors.forEach(select => {
    select.addEventListener('change', (e) => {
      const selectedOption = e.target.options[e.target.selectedIndex];
      const newPrice = selectedOption.getAttribute('data-price');
      const productId = e.target.getAttribute('data-product-id');
      
      // Update price display on card
      // We look for the sibling price element or find it by specific id
      let priceDisplay;
      if (productId === 'wheat-atta') {
        priceDisplay = document.getElementById('price-wheat');
      } else if (productId === 'multigrain-atta') {
        priceDisplay = document.getElementById('price-multi');
      } else if (productId === 'mustard-oil') {
        priceDisplay = document.getElementById('price-mustard');
      } else if (productId === 'groundnut-oil') {
        priceDisplay = document.getElementById('price-groundnut');
      }

      if (priceDisplay) {
        priceDisplay.textContent = newPrice;
      }
    });
  });

  // --- CART FUNCTIONS ---
  const toggleCartDrawer = (isOpen) => {
    if (isOpen) {
      cartDrawer.classList.add('open');
      cartOverlay.classList.add('open');
      document.body.style.overflow = 'hidden'; // Lock background scroll
    } else {
      cartDrawer.classList.remove('open');
      cartOverlay.classList.remove('open');
      document.body.style.overflow = ''; // Unlock background scroll
    }
  };

  cartToggle.addEventListener('click', () => toggleCartDrawer(true));
  cartClose.addEventListener('click', () => toggleCartDrawer(false));
  cartOverlay.addEventListener('click', () => toggleCartDrawer(false));
  
  // Connect close cart links in empty state
  document.querySelectorAll('.close-cart-link').forEach(link => {
    link.addEventListener('click', () => toggleCartDrawer(false));
  });

  const updateCartUI = () => {
    // Update badge count
    const totalItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItemsCount;
    
    // Toggle cart drawer states
    if (cart.length === 0) {
      emptyCartState.style.display = 'flex';
      cartItemsList.style.display = 'none';
      cartFooter.style.display = 'none';
    } else {
      emptyCartState.style.display = 'none';
      cartItemsList.style.display = 'flex';
      cartFooter.style.display = 'block';
    }

    // Clear and build items list
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

    // Update subtotal display
    cartSubtotal.textContent = `₹${subtotalValue}`;

    // Add listeners to new controls inside cart
    document.querySelectorAll('.increase-qty').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        const size = btn.getAttribute('data-size');
        adjustQuantity(id, size, 1);
      });
    });

    document.querySelectorAll('.decrease-qty').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        const size = btn.getAttribute('data-size');
        adjustQuantity(id, size, -1);
      });
    });

    document.querySelectorAll('.remove-item-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        const size = btn.getAttribute('data-size');
        removeItem(id, size);
      });
    });
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

  // Add Item to Cart
  addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const id = button.getAttribute('data-id');
      const name = button.getAttribute('data-name');
      const image = button.getAttribute('data-image');
      
      // Get selected size and price
      let selectEl;
      if (id === 'wheat-atta') {
        selectEl = document.getElementById('size-wheat');
      } else if (id === 'multigrain-atta') {
        selectEl = document.getElementById('size-multi');
      } else if (id === 'mustard-oil') {
        selectEl = document.getElementById('size-mustard');
      } else if (id === 'groundnut-oil') {
        selectEl = document.getElementById('size-groundnut');
      }

      const selectedOption = selectEl.options[selectEl.selectedIndex];
      const size = selectedOption.value;
      const price = parseInt(selectedOption.getAttribute('data-price'));

      // Check if item already in cart with same size
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
      
      // Button success animation
      const originalHTML = button.innerHTML;
      button.innerHTML = `<i class="fa-solid fa-check"></i> Added!`;
      button.style.backgroundColor = '#1E442F'; // Darker green on success
      button.disabled = true;
      
      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.backgroundColor = ''; // Reverts to CSS default
        button.disabled = false;
      }, 1000);

      // Open drawer on add
      setTimeout(() => {
        toggleCartDrawer(true);
      }, 400);
    });
  });

  // --- WHATSAPP CHECKOUT INTEGRATION ---
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;

    const phoneNumber = "918595077263"; // International format for India (+91)
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

    // Encode message for URL
    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
  });

  // --- INITIALIZE ---
  loadCart();
});
