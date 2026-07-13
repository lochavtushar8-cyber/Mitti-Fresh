/* ==========================================================================
   Mitti Fresh - Customer Accounts & Session Sync Helper (user-account.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Resolve relative API base URLs
  const getApiUrl = (path) => {
    if (typeof window.getApiEndpoint === 'function') {
      return window.getApiEndpoint(path);
    }
    return path;
  };

  // 2. Inject CSS Styles dynamically into the head
  const styles = `
    .account-trigger {
      background: none;
      border: none;
      color: var(--color-primary, #214e34);
      font-size: 1.35rem;
      cursor: pointer;
      margin-right: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.2s, transform 0.2s;
    }
    .account-trigger:hover {
      opacity: 0.8;
      transform: scale(1.05);
    }
    .account-drawer-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9998;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease;
    }
    .account-drawer-overlay.open {
      opacity: 1;
      visibility: visible;
    }
    .account-drawer {
      position: fixed;
      top: 0;
      right: -450px;
      width: 100%;
      max-width: 450px;
      height: 100%;
      background: #FFF;
      box-shadow: -5px 0 25px rgba(0,0,0,0.1);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      transition: right 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      font-family: var(--font-primary, sans-serif);
      color: var(--color-text, #333);
    }
    .account-drawer.open {
      right: 0;
    }
    .account-drawer-header {
      padding: 20px;
      border-bottom: 1px solid #EEE;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--color-primary, #214e34);
      color: #FFF;
    }
    .account-drawer-header h3 {
      margin: 0;
      font-family: var(--font-secondary, serif);
      font-size: 1.3rem;
      color: #FFF;
    }
    .account-drawer-close {
      background: none;
      border: none;
      color: #FFF;
      font-size: 1.2rem;
      cursor: pointer;
    }
    .account-drawer-content {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
    }
    .account-tabs {
      display: flex;
      border-bottom: 1.5px solid #EEE;
      margin-bottom: 20px;
    }
    .account-tab {
      flex: 1;
      text-align: center;
      padding: 10px;
      cursor: pointer;
      font-weight: 600;
      color: var(--color-text-muted, #777);
      border-bottom: 2px solid transparent;
      transition: color 0.2s;
    }
    .account-tab.active {
      color: var(--color-primary, #214e34);
      border-bottom-color: var(--color-primary, #214e34);
    }
    .account-form-group {
      margin-bottom: 16px;
    }
    .account-form-group label {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 6px;
      color: var(--color-primary, #214e34);
    }
    .account-form-group input {
      width: 100%;
      padding: 10px 12px;
      border: 1.5px solid #DDD;
      border-radius: 4px;
      font-size: 0.9rem;
      transition: border-color 0.2s;
    }
    .account-form-group input:focus {
      border-color: var(--color-primary, #214e34);
      outline: none;
    }
    .account-btn {
      width: 100%;
      padding: 12px;
      background: var(--color-primary, #214e34);
      color: #FFF;
      border: none;
      border-radius: 4px;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s;
    }
    .account-btn:hover {
      background: var(--color-accent, #bd963e);
      color: var(--color-primary, #214e34);
    }
    .reward-badge {
      background: #fbf5e6;
      border: 1px solid var(--color-accent, #bd963e);
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      margin-bottom: 20px;
    }
    .reward-points {
      font-size: 2.2rem;
      font-weight: 800;
      color: var(--color-accent, #bd963e);
      line-height: 1;
      margin-top: 4px;
    }
    .account-section-title {
      font-family: var(--font-secondary, serif);
      color: var(--color-primary, #214e34);
      border-bottom: 1px solid #EEE;
      padding-bottom: 8px;
      margin-top: 24px;
      margin-bottom: 12px;
      font-size: 1.1rem;
    }
    .address-card {
      border: 1.5px solid #EEE;
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .address-details {
      font-size: 0.85rem;
      line-height: 1.4;
    }
    .address-delete-btn {
      background: none;
      border: none;
      color: #E74C3C;
      cursor: pointer;
      font-size: 0.95rem;
    }
    .order-history-item {
      border-bottom: 1px solid #EEE;
      padding: 12px 0;
    }
    .order-header-info {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--color-text-muted, #777);
      margin-bottom: 4px;
    }
    .order-status-badge {
      display: inline-block;
      padding: 2px 6px;
      font-size: 0.7rem;
      font-weight: 700;
      border-radius: 3px;
      background: #EEE;
      color: #333;
    }
    .order-status-badge.status-paid {
      background: #D4EFDF;
      color: #27AE60;
    }
    .order-status-badge.status-pending {
      background: #FCF3CF;
      color: #F39C12;
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  // 3. Inject Account Icon into Navigation Bar
  const cartToggle = document.getElementById('cart-toggle');
  if (cartToggle) {
    const accountBtn = document.createElement('button');
    accountBtn.className = 'account-trigger';
    accountBtn.id = 'account-toggle';
    accountBtn.setAttribute('aria-label', 'Open Customer Account');
    accountBtn.innerHTML = `<i class="fa-solid fa-user"></i>`;
    cartToggle.parentNode.insertBefore(accountBtn, cartToggle);
  }

  // 4. Inject Account Drawer HTML
  const drawerOverlay = document.createElement('div');
  drawerOverlay.className = 'account-drawer-overlay';
  drawerOverlay.id = 'account-overlay';
  document.body.appendChild(drawerOverlay);

  const drawer = document.createElement('div');
  drawer.className = 'account-drawer';
  drawer.id = 'account-drawer';
  drawer.innerHTML = `
    <div class="account-drawer-header">
      <h3>My Account</h3>
      <button class="account-drawer-close" id="account-close">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    <div class="account-drawer-content" id="account-drawer-content">
      <!-- Content populated dynamically -->
    </div>
  `;
  document.body.appendChild(drawer);

  // 5. Drawer Toggle Event Handlers
  const toggleDrawer = () => {
    drawer.classList.toggle('open');
    drawerOverlay.classList.toggle('open');
    if (drawer.classList.contains('open')) {
      renderAccountContent();
    }
  };

  document.addEventListener('click', (e) => {
    if (e.target.closest('#account-toggle') || e.target.closest('#account-close') || e.target === drawerOverlay) {
      toggleDrawer();
    }
  });

  // 6. Account UI Rendering Logic
  let activeTab = 'login'; // 'login' or 'register'
  window.loggedInCustomer = null;

  const getAuthToken = () => localStorage.getItem('mitti_customer_token');
  const setAuthToken = (token) => {
    if (token) {
      localStorage.setItem('mitti_customer_token', token);
    } else {
      localStorage.removeItem('mitti_customer_token');
    }
  };

  // Check initial session
  const verifySession = async () => {
    const token = getAuthToken();
    if (!token) return;
    try {
      const res = await fetch(getApiUrl('/api/customers/profile') + '?t=' + Date.now(), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        window.loggedInCustomer = data.customer;
        window.loggedInCustomer.orders = data.orders || [];
      } else {
        setAuthToken(null);
      }
    } catch (e) {
      console.warn("Verify session failed", e);
    }
  };

  const renderAccountContent = async () => {
    const container = document.getElementById('account-drawer-content');
    if (!container) return;

    await verifySession();

    if (window.loggedInCustomer) {
      // User is LOGGED IN: Render Dashboard panel
      const c = window.loggedInCustomer;
      const totalOrders = c.orders ? c.orders.length : 0;
      
      container.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <h4 style="margin: 0; font-size: 1.25rem;">Welcome, <strong>${c.name}</strong></h4>
          <p style="font-size: 0.85rem; color: #777; margin: 2px 0 10px 0;">${c.email}</p>
          <button class="account-btn" id="btn-customer-logout" style="background: #CB4335; padding: 6px 12px; font-size: 0.8rem; width: auto; font-weight: 600;">Logout</button>
        </div>

        <div class="reward-badge">
          <div style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--color-primary);">Loyalty Reward Balance</div>
          <div class="reward-points">${c.rewardPoints || 0} <span style="font-size: 1rem; font-weight: 500;">Points</span></div>
          <div style="font-size: 0.75rem; color: #777; margin-top: 4px;">Earn 5% points on every order to redeem for future discounts!</div>
        </div>

        <!-- Saved Addresses Section -->
        <h4 class="account-section-title">Saved Shipping Addresses</h4>
        <div id="addresses-list-container">
          ${c.addresses && c.addresses.length > 0 ? c.addresses.map((a, idx) => `
            <div class="address-card">
              <div class="address-details">
                <strong>${a.house}</strong>, ${a.street}<br>
                ${a.landmark ? a.landmark + ', ' : ''}${a.city} - ${a.pin}
              </div>
              <button class="address-delete-btn" data-index="${idx}" aria-label="Delete Address"><i class="fa-solid fa-trash"></i></button>
            </div>
          `).join('') : '<p style="font-size: 0.85rem; color:#777;">No saved addresses yet.</p>'}
        </div>

        <!-- Add Address Form -->
        <details style="margin-top: 15px; font-size: 0.9rem;">
          <summary style="font-weight: 600; cursor: pointer; color: var(--color-primary);">+ Add New Address</summary>
          <form id="add-address-form" style="margin-top: 12px; padding: 12px; border: 1px solid #EEE; border-radius: 6px;">
            <div class="account-form-group">
              <label>Flat / House No.</label>
              <input type="text" id="new-house" required placeholder="e.g. H-104">
            </div>
            <div class="account-form-group">
              <label>Street / Area</label>
              <input type="text" id="new-street" required placeholder="e.g. Dwarka Sector 7">
            </div>
            <div class="account-form-group">
              <label>Landmark</label>
              <input type="text" id="new-landmark" placeholder="e.g. Near Ramphal Chowk">
            </div>
            <div class="account-form-group">
              <label>PIN Code</label>
              <input type="text" id="new-pin" required pattern="[0-9]{6}" placeholder="e.g. 110075">
            </div>
            <button type="submit" class="account-btn" style="padding: 8px;">Save Address</button>
          </form>
        </details>

        <!-- Order History Section -->
        <h4 class="account-section-title">My Order History (${totalOrders})</h4>
        <div id="order-history-container">
          ${totalOrders > 0 ? c.orders.map(o => {
            const isPaid = o.paymentStatus === 'Paid' || o.paymentStatus === 'Verified';
            return `
              <div class="order-history-item">
                <div class="order-header-info">
                  <span>Order ID: <code>${o.orderId}</code></span>
                  <span>${o.date ? o.date.split(',')[0] : ''}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-top: 4px;">
                  <span>Amount paid: <strong>₹${o.amount}</strong></span>
                  <span class="order-status-badge ${isPaid ? 'status-paid' : 'status-pending'}">${o.orderStatus}</span>
                </div>
              </div>
            `;
          }).join('') : '<p style="font-size: 0.85rem; color:#777;">No previous orders found.</p>'}
        </div>
      `;

      // Logout handler
      document.getElementById('btn-customer-logout').addEventListener('click', () => {
        setAuthToken(null);
        window.loggedInCustomer = null;
        renderAccountContent();
      });

      // Add Address form submit handler
      document.getElementById('add-address-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const addressData = {
          house: document.getElementById('new-house').value.trim(),
          street: document.getElementById('new-street').value.trim(),
          landmark: document.getElementById('new-landmark').value.trim(),
          pin: document.getElementById('new-pin').value.trim()
        };
        try {
          const res = await fetch(getApiUrl('/api/customers/address'), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(addressData)
          });
          if (res.ok) {
            renderAccountContent();
          } else {
            const err = await res.json();
            alert(err.error || "Failed to add address.");
          }
        } catch (err) {
          alert("Server connection failed.");
        }
      });

      // Address delete click handler
      document.getElementById('addresses-list-container').addEventListener('click', async (e) => {
        const delBtn = e.target.closest('.address-delete-btn');
        if (!delBtn) return;
        const index = delBtn.getAttribute('data-index');
        if (!confirm("Are you sure you want to delete this address?")) return;
        try {
          const res = await fetch(getApiUrl(`/api/customers/address/${index}/delete`), {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${getAuthToken()}` }
          });
          if (res.ok) {
            renderAccountContent();
          }
        } catch (err) {
          alert("Server connection failed.");
        }
      });

    } else {
      // User is NOT logged in: Render Forms
      container.innerHTML = `
        <div class="account-tabs">
          <div class="account-tab ${activeTab === 'login' ? 'active' : ''}" id="tab-cust-login">Login</div>
          <div class="account-tab ${activeTab === 'register' ? 'active' : ''}" id="tab-cust-register">Register</div>
        </div>

        <form id="customer-account-form">
          ${activeTab === 'register' ? `
            <div class="account-form-group">
              <label>Full Name</label>
              <input type="text" id="cust-name" required placeholder="Enter your name">
            </div>
          ` : ''}
          <div class="account-form-group">
            <label>Email Address</label>
            <input type="email" id="cust-email" required placeholder="name@example.com">
          </div>
          ${activeTab === 'register' ? `
            <div class="account-form-group">
              <label>Phone Number</label>
              <input type="tel" id="cust-phone" required placeholder="10-digit mobile number">
            </div>
          ` : ''}
          <div class="account-form-group">
            <label>Password</label>
            <input type="password" id="cust-password" required placeholder="••••••••">
          </div>
          <button type="submit" class="account-btn" id="btn-cust-submit">
            ${activeTab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      `;

      // Tabs click event handlers
      document.getElementById('tab-cust-login').addEventListener('click', () => {
        activeTab = 'login';
        renderAccountContent();
      });
      document.getElementById('tab-cust-register').addEventListener('click', () => {
        activeTab = 'register';
        renderAccountContent();
      });

      // Submit Form handler
      document.getElementById('customer-account-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('cust-email').value.trim();
        const password = document.getElementById('cust-password').value.trim();

        if (activeTab === 'login') {
          // Process Login API
          try {
            const res = await fetch(getApiUrl('/api/customers/login'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok) {
              setAuthToken(data.token);
              window.loggedInCustomer = data.customer;
              renderAccountContent();
            } else {
              alert(data.error || "Invalid credentials.");
            }
          } catch (err) {
            alert("Login service is currently offline.");
          }
        } else {
          // Process Register API
          const name = document.getElementById('cust-name').value.trim();
          const phone = document.getElementById('cust-phone').value.trim();
          try {
            const res = await fetch(getApiUrl('/api/customers/register'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name, email, password, phone })
            });
            const data = await res.json();
            if (res.ok) {
              setAuthToken(data.token);
              window.loggedInCustomer = data.customer;
              renderAccountContent();
            } else {
              alert(data.error || "Registration failed.");
            }
          } catch (err) {
            alert("Registration service is currently offline.");
          }
        }
      });
    }
  };

  // Expose helper globally
  window.getLoggedInCustomer = () => window.loggedInCustomer;
  
  // Fetch dynamic settings from server to sync contact details and alert banner globally
  const applySettings = (settings) => {
    if (!settings) return;
    
    // Sync support phone links and text
    if (settings.supportPhone) {
      const cleanPhone = settings.supportPhone.trim();
      
      // Update tel links
      document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.href = `tel:${cleanPhone}`;
        if (link.textContent.includes('8595077263') || link.classList.contains('phone-link')) {
          link.textContent = cleanPhone;
        }
      });
      
      // Update WhatsApp links
      document.querySelectorAll('a[href^="https://wa.me/"]').forEach(link => {
        try {
          const url = new URL(link.href);
          const textParam = url.searchParams.get('text');
          const cleanNumber = cleanPhone.replace(/\D/g, ''); // strip spaces/symbols
          const finalNumber = cleanNumber.startsWith('91') ? cleanNumber : `91${cleanNumber}`;
          link.href = `https://wa.me/${finalNumber}${textParam ? `?text=${encodeURIComponent(textParam)}` : ''}`;
          
          if (link.textContent.includes('8595077263')) {
            link.innerHTML = link.innerHTML.replace(/8595077263/g, cleanPhone);
          }
        } catch(e) {}
      });

      // Walk text nodes to replace hardcoded phone occurrences dynamically
      const walkTextNodes = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          if (node.nodeValue.includes('8595077263')) {
            node.nodeValue = node.nodeValue.replace(/8595077263/g, cleanPhone);
          }
        } else {
          node.childNodes.forEach(walkTextNodes);
        }
      };
      walkTextNodes(document.body);
    }
  };

  const syncSettingsGlobally = async () => {
    try {
      const res = await fetch(getApiUrl('/api/settings') + '?t=' + Date.now());
      if (res.ok) {
        const settings = await res.json();
        applySettings(settings);
      } else {
        const cached = localStorage.getItem('mitti_fresh_settings');
        if (cached) applySettings(JSON.parse(cached));
      }
    } catch (e) {
      const cached = localStorage.getItem('mitti_fresh_settings');
      if (cached) applySettings(JSON.parse(cached));
    }
  };

  // Trigger initial background session check
  verifySession();
  syncSettingsGlobally();
});
