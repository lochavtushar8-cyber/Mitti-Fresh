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

  window.openAccountDrawer = () => {
    drawer.classList.add('open');
    drawerOverlay.classList.add('open');
    renderAccountContent();
  };

  window.closeAccountDrawer = () => {
    drawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
  };

  document.addEventListener('click', (e) => {
    if (e.target.closest('#account-toggle') || e.target.closest('#account-close') || e.target.closest('.btn-open-refer-earn') || e.target === drawerOverlay) {
      e.preventDefault();
      toggleDrawer();
    }
  });

  // 6. Account UI Rendering Logic
  let activeTab = 'login'; // 'login', 'register', 'forgot', or 'reset'
  window.loggedInCustomer = null;

  const getAuthToken = () => {
    return localStorage.getItem('mitti_customer_token') || sessionStorage.getItem('mitti_customer_token');
  };

  const setAuthToken = (token, rememberMe = true) => {
    if (token) {
      if (rememberMe) {
        localStorage.setItem('mitti_customer_token', token);
        localStorage.setItem('mitti_remember_me', 'true');
        sessionStorage.removeItem('mitti_customer_token');
      } else {
        sessionStorage.setItem('mitti_customer_token', token);
        localStorage.removeItem('mitti_customer_token');
        localStorage.removeItem('mitti_remember_me');
      }
    } else {
      localStorage.removeItem('mitti_customer_token');
      localStorage.removeItem('mitti_remember_me');
      sessionStorage.removeItem('mitti_customer_token');
    }
  };

  // Extract OAuth access_token or code from URL hash or search parameters
  const extractOAuthFromUrl = () => {
    let token = null;
    let code = null;
    let isOAuthReturn = false;
    try {
      const rawHash = window.location.hash ? window.location.hash.substring(1) : '';
      if (rawHash) {
        const hashParams = new URLSearchParams(rawHash);
        token = hashParams.get('access_token') || hashParams.get('token');
        if (token) isOAuthReturn = true;
      }
      const searchParams = new URLSearchParams(window.location.search);
      if (!token) {
        token = searchParams.get('access_token') || searchParams.get('token');
        if (token) isOAuthReturn = true;
      }
      code = searchParams.get('insforge_code') || searchParams.get('code');
      if (code) isOAuthReturn = true;

      if (sessionStorage.getItem('mitti_oauth_pending')) {
        isOAuthReturn = true;
      }
    } catch(e) {}
    return { token, code, isOAuthReturn };
  };

  // Check initial session & handle OAuth callback sync
  const verifySession = async () => {
    const oauth = extractOAuthFromUrl();
    let token = getAuthToken() || oauth.token;

    if (oauth.token) {
      setAuthToken(oauth.token, true);
    }

    if (!token && !oauth.code) return;

    try {
      const savedRefCode = sessionStorage.getItem('mitti_referral_code') || '';
      const verifier = sessionStorage.getItem('mitti_oauth_verifier') || '';
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(getApiUrl('/api/customers/oauth-sync'), {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          referralCode: savedRefCode, 
          code: oauth.code,
          codeVerifier: verifier
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          setAuthToken(data.token, true);
        }
        window.loggedInCustomer = data.customer;
        window.loggedInCustomer.orders = data.orders || [];

        // If returning from Google OAuth, auto-open Customer Account drawer and clean URL hash
        if (oauth.isOAuthReturn || sessionStorage.getItem('mitti_oauth_pending')) {
          sessionStorage.removeItem('mitti_oauth_pending');
          sessionStorage.removeItem('mitti_oauth_verifier');
          if (window.location.hash || window.location.search.includes('code=') || window.location.search.includes('insforge_code=') || window.location.search.includes('access_token=')) {
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
          }
          setTimeout(() => {
            drawer.classList.add('open');
            drawerOverlay.classList.add('open');
            renderAccountContent();
          }, 300);
        }
      } else {
        if (token) {
          const profRes = await fetch(getApiUrl('/api/customers/profile') + '?t=' + Date.now(), {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (profRes.ok) {
            const profData = await profRes.json();
            window.loggedInCustomer = profData.customer;
            window.loggedInCustomer.orders = profData.orders || [];
          } else {
            setAuthToken(null);
          }
        }
      }
    } catch (e) {
      console.warn("Verify session failed", e);
    }
  };

  // Auto-detect referral code or reset token from URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const refCodeParam = urlParams.get('ref');
  const resetTokenParam = urlParams.get('resetToken');
  const isRegisterRoute = window.location.pathname.includes('/register');

  if (resetTokenParam) {
    activeTab = 'reset';
    setTimeout(() => {
      drawer.classList.add('open');
      drawerOverlay.classList.add('open');
      renderAccountContent();
    }, 400);
  } else if (refCodeParam || isRegisterRoute) {
    activeTab = 'register';
    if (refCodeParam) {
      sessionStorage.setItem('mitti_referral_code', refCodeParam.trim().toUpperCase());
    }
    setTimeout(() => {
      if (!window.loggedInCustomer) {
        drawer.classList.add('open');
        drawerOverlay.classList.add('open');
        renderAccountContent();
      }
    }, 400);
  }

  const renderAccountContent = async () => {
    const container = document.getElementById('account-drawer-content');
    if (!container) return;

    await verifySession();

    if (window.loggedInCustomer) {
      // User is LOGGED IN: Render Dashboard panel & Refer & Earn
      const c = window.loggedInCustomer;
      const totalOrders = c.orders ? c.orders.length : 0;
      
      let refStats = { referralCode: c.referralCode || '', totalReferrals: 0, pendingReferrals: 0, successfulReferrals: 0, referrals: [] };
      try {
        const pRes = await fetch(getApiUrl('/api/customers/profile'), {
          headers: { 'Authorization': `Bearer ${getAuthToken()}` }
        });
        if (pRes.ok) {
          const pData = await pRes.json();
          if (pData.referralStats) refStats = pData.referralStats;
          if (pData.customer) {
            window.loggedInCustomer = pData.customer;
            c.referralCode = pData.customer.referralCode || refStats.referralCode;
          }
        }
      } catch(e) {}

      const refCode = c.referralCode || refStats.referralCode || 'GENERATING';
      const refLink = `${window.location.origin}/register?ref=${refCode}`;

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

        <!-- Refer & Earn Section (Hostinger UI & UX Inspired) -->
        <div style="margin-top: 20px; border-radius: 16px; background: #FFF; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
          
          <!-- Hostinger Navigation Tabs -->
          <div style="display: flex; border-bottom: 1.5px solid #E2E8F0; background: #F8FAFC;">
            <button type="button" id="ref-subtab-btn-refer" style="flex: 1; padding: 12px; border: none; background: transparent; font-weight: 700; font-size: 0.9rem; color: #214E34; border-bottom: 3px solid #214E34; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
              <i class="fa-solid fa-gift"></i> Refer & earn
            </button>
            <button type="button" id="ref-subtab-btn-earnings" style="flex: 1; padding: 12px; border: none; background: transparent; font-weight: 600; font-size: 0.9rem; color: #64748B; border-bottom: 3px solid transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
              <i class="fa-solid fa-chart-pie"></i> My earnings
            </button>
          </div>

          <!-- TAB 1: Refer & Earn Hero Panel -->
          <div id="ref-subtab-content-refer" style="padding: 18px 14px;">
            <div style="background: linear-gradient(135deg, #EBF5ED 0%, #F4F8F5 100%); border-radius: 16px; padding: 22px 14px; text-align: center; border: 1px solid rgba(33,78,52,0.12);">
              <h3 style="margin: 0 0 6px 0; color: #1E293B; font-size: 1.25rem; font-weight: 800; font-family: 'Playfair Display', serif;">
                Invite friends and share fresh organic staples
              </h3>
              <p style="margin: 0 0 18px 0; color: #475569; font-size: 0.82rem;">Share your unique link or code to invite friends & family</p>

              <!-- Hostinger Centerpiece Oval Pill Bar -->
              <div style="background: #FFFFFF; border-radius: 50px; padding: 4px 6px 4px 14px; border: 1.5px solid #214E34; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 14px rgba(33,78,52,0.1);">
                <i class="fa-solid fa-link" style="color: #64748B; font-size: 0.85rem;"></i>
                <input type="text" readonly value="${refLink}" id="input-ref-link" style="border: none; background: transparent; outline: none; font-size: 0.76rem; color: #334155; width: 100%; font-weight: 500;">
                <button type="button" id="btn-copy-ref-link" style="background: #214E34; color: #FFFFFF; border-radius: 40px; padding: 8px 16px; font-weight: 700; font-size: 0.8rem; border: none; white-space: nowrap; display: flex; align-items: center; gap: 6px; cursor: pointer; transition: all 0.2s ease;">
                  <i class="fa-regular fa-copy"></i> Copy link
                </button>
              </div>

              <!-- Secondary Code Box -->
              <div style="margin-top: 14px; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 0.8rem; color: #475569;">
                <span>Referral Code: <strong style="color: #214E34; letter-spacing: 0.5px;">${refCode}</strong></span>
                <button type="button" id="btn-copy-ref-code" style="background: #E2E8F0; color: #1E293B; border: none; padding: 3px 8px; border-radius: 6px; font-size: 0.72rem; font-weight: 700; cursor: pointer;">Copy Code</button>
              </div>
            </div>

            <!-- Share Buttons CTA (WhatsApp & Facebook) -->
            <div style="display: flex; gap: 8px; margin-top: 14px;">
              <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(`Hey! Join Mitti Fresh for fresh & organic staples. Use my referral code *${refCode}* or sign up using my link: ${refLink}`)}" target="_blank" style="flex: 1; background: #25D366; color: #FFF; text-align: center; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 6px; font-weight: 700; padding: 10px; border-radius: 10px; box-shadow: 0 4px 12px rgba(37,211,102,0.2); font-size: 0.82rem;">
                <i class="fa-brands fa-whatsapp" style="font-size: 1.1rem;"></i> WhatsApp
              </a>
              <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(refLink)}" target="_blank" style="flex: 1; background: #1877F2; color: #FFF; text-align: center; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 6px; font-weight: 700; padding: 10px; border-radius: 10px; box-shadow: 0 4px 12px rgba(24,119,242,0.2); font-size: 0.82rem;">
                <i class="fa-brands fa-facebook" style="font-size: 1.1rem;"></i> Facebook
              </a>
            </div>
          </div>

          <!-- TAB 2: My Earnings / Stats Panel -->
          <div id="ref-subtab-content-earnings" style="padding: 16px 14px; display: none;">
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 16px; text-align: center;">
              <div style="background: #F8FAFC; padding: 8px 2px; border-radius: 8px; border: 1px solid #E2E8F0;">
                <div style="font-size: 0.68rem; color: #64748B; font-weight: 600;">Invited</div>
                <div style="font-weight: 800; font-size: 1.05rem; color: #214E34; margin-top: 2px;">${refStats.totalReferrals}</div>
              </div>
              <div style="background: #F8FAFC; padding: 8px 2px; border-radius: 8px; border: 1px solid #E2E8F0;">
                <div style="font-size: 0.68rem; color: #64748B; font-weight: 600;">Pending</div>
                <div style="font-weight: 800; font-size: 1.05rem; color: #D97706; margin-top: 2px;">${refStats.pendingReferrals}</div>
              </div>
              <div style="background: #F8FAFC; padding: 8px 2px; border-radius: 8px; border: 1px solid #E2E8F0;">
                <div style="font-size: 0.68rem; color: #64748B; font-weight: 600;">Successful</div>
                <div style="font-weight: 800; font-size: 1.05rem; color: #16A34A; margin-top: 2px;">${refStats.successfulReferrals}</div>
              </div>
              <div style="background: #F8FAFC; padding: 8px 2px; border-radius: 8px; border: 1px solid #E2E8F0;">
                <div style="font-size: 0.68rem; color: #64748B; font-weight: 600;">Earned</div>
                <div style="font-weight: 800; font-size: 1.05rem; color: #2563EB; margin-top: 2px;">₹${refStats.totalRewardsEarned || 0}</div>
              </div>
            </div>

            <div style="border-top: 1px solid #E2E8F0; padding-top: 12px;">
              <h5 style="margin: 0 0 10px 0; font-size: 0.85rem; color: #334155; font-weight: 700;">Referred Friends History</h5>
              ${refStats.referrals && refStats.referrals.length > 0 ? `
                <div style="max-height: 160px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;">
                  ${refStats.referrals.map(r => `
                    <div style="background: #F8FAFC; padding: 8px 12px; border-radius: 8px; font-size: 0.78rem; display: flex; justify-content: space-between; align-items: center; border: 1px solid #F1F5F9;">
                      <div>
                        <strong>${r.referredCustomerName}</strong><br>
                        <span style="color: #64748B; font-size: 0.72rem;">${r.referredCustomerEmail}</span>
                      </div>
                      <span style="background: #FEF3C7; color: #92400E; padding: 3px 8px; border-radius: 6px; font-weight: 700; font-size: 0.7rem;">${r.status}</span>
                    </div>
                  `).join('')}
                </div>
              ` : `
                <div style="text-align: center; color: #94A3B8; padding: 20px 10px; font-size: 0.82rem;">
                  No referrals yet. Share your link to start earning!
                </div>
              `}
            </div>
          </div>

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

      // Hostinger Subtab Switching Handlers
      const tabBtnRefer = document.getElementById('ref-subtab-btn-refer');
      const tabBtnEarnings = document.getElementById('ref-subtab-btn-earnings');
      const contentRefer = document.getElementById('ref-subtab-content-refer');
      const contentEarnings = document.getElementById('ref-subtab-content-earnings');

      if (tabBtnRefer && tabBtnEarnings) {
        tabBtnRefer.addEventListener('click', () => {
          tabBtnRefer.style.color = '#214E34';
          tabBtnRefer.style.fontWeight = '700';
          tabBtnRefer.style.borderBottom = '3px solid #214E34';

          tabBtnEarnings.style.color = '#64748B';
          tabBtnEarnings.style.fontWeight = '600';
          tabBtnEarnings.style.borderBottom = '3px solid transparent';

          contentRefer.style.display = 'block';
          contentEarnings.style.display = 'none';
        });

        tabBtnEarnings.addEventListener('click', () => {
          tabBtnEarnings.style.color = '#214E34';
          tabBtnEarnings.style.fontWeight = '700';
          tabBtnEarnings.style.borderBottom = '3px solid #214E34';

          tabBtnRefer.style.color = '#64748B';
          tabBtnRefer.style.fontWeight = '600';
          tabBtnRefer.style.borderBottom = '3px solid transparent';

          contentEarnings.style.display = 'block';
          contentRefer.style.display = 'none';
        });
      }

      // Copy Code & Link Event Handlers
      const btnCopyCode = document.getElementById('btn-copy-ref-code');
      if (btnCopyCode) {
        btnCopyCode.addEventListener('click', () => {
          navigator.clipboard.writeText(refCode).then(() => {
            btnCopyCode.textContent = "Copied!";
            setTimeout(() => { btnCopyCode.textContent = "Copy Code"; }, 2000);
          });
        });
      }

      const btnCopyLink = document.getElementById('btn-copy-ref-link');
      if (btnCopyLink) {
        btnCopyLink.addEventListener('click', () => {
          navigator.clipboard.writeText(refLink).then(() => {
            btnCopyLink.innerHTML = `<i class="fa-solid fa-check"></i> Copied!`;
            setTimeout(() => { btnCopyLink.innerHTML = `<i class="fa-regular fa-copy"></i> Copy link`; }, 2000);
          });
        });
      }

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
      if (activeTab === 'forgot') {
        container.innerHTML = `
          <div style="text-align: center; margin-bottom: 20px;">
            <h4 style="margin: 0 0 6px 0; color: #1E293B; font-size: 1.2rem; font-weight: 800;">Forgot Password</h4>
            <p style="font-size: 0.82rem; color: #64748B; margin: 0;">Enter your registered email address to receive a secure 30-minute password reset link.</p>
          </div>

          <form id="customer-forgot-form">
            <div class="account-form-group">
              <label>Email Address</label>
              <input type="email" id="forgot-cust-email" required placeholder="name@example.com">
            </div>
            <button type="submit" class="account-btn" style="margin-bottom: 10px;">Send Reset Link</button>
            <button type="button" id="btn-back-to-login" class="account-btn" style="background: #F1F5F9; color: #334155; font-weight: 600;">Back to Login</button>
          </form>
        `;

        document.getElementById('btn-back-to-login').addEventListener('click', () => {
          activeTab = 'login';
          renderAccountContent();
        });

        document.getElementById('customer-forgot-form').addEventListener('submit', async (e) => {
          e.preventDefault();
          const email = document.getElementById('forgot-cust-email').value.trim();
          try {
            const res = await fetch(getApiUrl('/api/customers/forgot-password'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (res.ok) {
              alert(data.message || "Password reset link sent!");
              activeTab = 'login';
              renderAccountContent();
            } else {
              alert(data.error || "Failed to send reset link.");
            }
          } catch(err) {
            alert("Failed to connect to authentication server.");
          }
        });

      } else if (activeTab === 'reset') {
        const resetTokenVal = new URLSearchParams(window.location.search).get('resetToken') || '';
        container.innerHTML = `
          <div style="text-align: center; margin-bottom: 20px;">
            <h4 style="margin: 0 0 6px 0; color: #1E293B; font-size: 1.2rem; font-weight: 800;">Set New Password</h4>
            <p style="font-size: 0.82rem; color: #64748B; margin: 0;">Enter a new secure password for your account.</p>
          </div>

          <form id="customer-reset-form">
            <input type="hidden" id="reset-token-val" value="${resetTokenVal}">
            <div class="account-form-group">
              <label>New Password (min 6 characters)</label>
              <input type="password" id="reset-new-pass" required minlength="6" placeholder="Enter new password">
            </div>
            <div class="account-form-group">
              <label>Confirm New Password</label>
              <input type="password" id="reset-confirm-pass" required minlength="6" placeholder="Confirm new password">
            </div>
            <button type="submit" class="account-btn">Save New Password & Sign In</button>
          </form>
        `;

        document.getElementById('customer-reset-form').addEventListener('submit', async (e) => {
          e.preventDefault();
          const token = document.getElementById('reset-token-val').value;
          const newPassword = document.getElementById('reset-new-pass').value;
          const confirmPass = document.getElementById('reset-confirm-pass').value;

          if (newPassword !== confirmPass) {
            alert("New password and confirmation password do not match.");
            return;
          }

          try {
            const res = await fetch(getApiUrl('/api/customers/reset-password'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token, newPassword })
            });
            const data = await res.json();
            if (res.ok) {
              alert(data.message || "Password reset successfully! Please log in.");
              activeTab = 'login';
              renderAccountContent();
            } else {
              alert(data.error || "Password reset failed.");
            }
          } catch(err) {
            alert("Failed to connect to authentication server.");
          }
        });

      } else {
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
              <div class="account-form-group">
                <label>Referral Code (Optional)</label>
                <input type="text" id="cust-referral-code" placeholder="e.g. DEVA001" style="text-transform: uppercase;" value="${(refCodeParam || sessionStorage.getItem('mitti_referral_code') || '').toUpperCase()}">
              </div>
            ` : ''}
            <div class="account-form-group">
              <label>Password</label>
              <input type="password" id="cust-password" required placeholder="••••••••">
            </div>

            ${activeTab === 'login' ? `
              <div style="display: flex; justify-content: space-between; align-items: center; margin: -4px 0 16px 0;">
                <label style="font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; gap: 6px; color: #475569; font-weight: 500;">
                  <input type="checkbox" id="cust-remember-me" checked style="accent-color: #214E34; cursor: pointer;"> Remember Me (30 Days)
                </label>
                <a href="#" id="btn-forgot-password-link" style="font-size: 0.8rem; color: #214E34; font-weight: 600; text-decoration: none;">Forgot Password?</a>
              </div>
            ` : ''}

            <button type="submit" class="account-btn" id="btn-cust-submit">
              ${activeTab === 'login' ? 'Sign In' : 'Create Account'}
            </button>

            <div style="margin-top: 14px; text-align: center;">
              <div style="display: flex; align-items: center; margin: 12px 0;">
                <div style="flex: 1; border-bottom: 1px solid #E2E8F0;"></div>
                <span style="padding: 0 10px; font-size: 0.75rem; color: #94A3B8; font-weight: 600; text-transform: uppercase;">Or</span>
                <div style="flex: 1; border-bottom: 1px solid #E2E8F0;"></div>
              </div>
              <button type="button" class="btn-google-auth" style="width: 100%; background: #FFF; color: #334155; border: 1.5px solid #CBD5E1; border-radius: 10px; padding: 10px; font-weight: 600; font-size: 0.88rem; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                Continue with Google
              </button>
            </div>
          </form>
        `;

        // Attach Google OAuth button listener
        document.querySelectorAll('.btn-google-auth').forEach(btn => {
          btn.addEventListener('click', async () => {
            try {
              const refInput = document.getElementById('cust-referral-code');
              const currentRefCode = refInput ? refInput.value.trim() : (sessionStorage.getItem('mitti_referral_code') || '');
              if (currentRefCode) {
                sessionStorage.setItem('mitti_referral_code', currentRefCode.toUpperCase());
              }

              const res = await fetch(getApiUrl('/api/auth/google-url'));
              const data = await res.json();

              if (res.ok && data.url) {
                sessionStorage.setItem('mitti_oauth_pending', 'true');
                if (data.codeVerifier) {
                  sessionStorage.setItem('mitti_oauth_verifier', data.codeVerifier);
                }
                window.location.href = data.url;
              } else {
                alert(data.error || "Could not start Google login. Please try again.");
              }
            } catch (err) {
              console.error("Google auth error:", err);
              alert("Could not start Google login. Please check connection.");
            }
          });
        });

        // Tabs click event handlers
        document.getElementById('tab-cust-login').addEventListener('click', () => {
          activeTab = 'login';
          renderAccountContent();
        });
        document.getElementById('tab-cust-register').addEventListener('click', () => {
          activeTab = 'register';
          renderAccountContent();
        });

        const forgotLink = document.getElementById('btn-forgot-password-link');
        if (forgotLink) {
          forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            activeTab = 'forgot';
            renderAccountContent();
          });
        }

        // Submit Form handler
        document.getElementById('customer-account-form').addEventListener('submit', async (e) => {
          e.preventDefault();
          const email = document.getElementById('cust-email').value.trim();
          const password = document.getElementById('cust-password').value.trim();

          if (activeTab === 'login') {
            const rememberMe = document.getElementById('cust-remember-me') ? document.getElementById('cust-remember-me').checked : true;
            try {
              const res = await fetch(getApiUrl('/api/customers/login'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, rememberMe })
              });
              const data = await res.json();
              if (res.ok) {
                setAuthToken(data.token, rememberMe);
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
            const refCode = document.getElementById('cust-referral-code') ? document.getElementById('cust-referral-code').value.trim() : '';
            try {
              const res = await fetch(getApiUrl('/api/customers/register'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, phone, referralCode: refCode })
              });
              const data = await res.json();
              if (res.ok) {
                setAuthToken(data.token, true);
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
