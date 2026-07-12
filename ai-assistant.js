/* ==========================================================================
   Mitti Fresh - Intelligent AI Shopping Assistant
   ========================================================================== */

(function () {
  // Prevent duplicate load
  if (window.MittiFreshAIInitialized) return;
  window.MittiFreshAIInitialized = true;

  // AI Product catalog dictionary for accurate reference matches
  const AI_CATALOG = {
    "wheat-atta": {
      name: "MP Sharbhati Atta",
      id: "wheat-atta",
      image: "assets/wheat_atta.jpg",
      description: "Traditional stone-ground flour milled from premium Sharbhati wheat grains.",
      sizes: { "1kg": 60, "5kg": 275, "10kg": 540 },
      benefits: "Milled slowly to retain natural fibers, vitamins, and gluten elasticity. Easy digestability.",
      shelfLife: "3 Months (Store in airtight container in dry place)"
    },
    "multigrain-atta": {
      name: "Multigrain Atta (Goal-Based)",
      id: "multigrain-atta",
      image: "assets/multigrain_atta.jpg",
      description: "Intelligent blend of wheat, chana, oats, barley, ragi, and soy grains.",
      sizes: { "1kg": 80, "5kg": 390, "10kg": 760 },
      benefits: "High dietary fiber, excellent glycemic response for sugar management, protein-rich.",
      shelfLife: "3 Months (Store in dry, cool conditions)"
    },
    "mustard-oil": {
      name: "Cold Pressed Mustard Oil",
      id: "mustard-oil",
      image: "assets/mustard_oil.jpg",
      description: "100% pure yellow mustard oil extracted via wood-pressed cold expulsion.",
      sizes: { "1L": 190, "5L": 930 },
      benefits: "No heat processing. Rich in Omega-3/6, high smoke point perfect for traditional cooking.",
      shelfLife: "12 Months (Store away from direct light)"
    },
    "groundnut-oil": {
      name: "Cold Pressed Groundnut Oil",
      id: "groundnut-oil",
      image: "assets/groundnut_oil.jpg",
      description: "100% pure cold-pressed peanut/groundnut oil extracted without chemical solvents.",
      sizes: { "1L": 210, "5L": 1030 },
      benefits: "Heart-healthy monounsaturated fats. Adds a delicate nutty flavor to food.",
      shelfLife: "12 Months"
    },
    "besan": {
      name: "Besan (Gram Flour)",
      id: "besan",
      image: "assets/wheat_atta.jpg",
      description: "Stone-ground pure chana dal flour. Free from chemical additives.",
      sizes: { "1kg": 110 },
      benefits: "Rich in proteins and low glycemic index. Great for cooking standard dishes.",
      shelfLife: "4 Months"
    },
    "maize-flour": {
      name: "Maize Flour (Makki Atta)",
      id: "maize-flour",
      image: "assets/wheat_atta.jpg",
      description: "Premium stone-ground yellow corn flour.",
      sizes: { "1kg": 65 },
      benefits: "Naturally gluten-free, rich in beta-carotene antioxidants.",
      shelfLife: "3 Months"
    }
  };

  // Inject Styles dynamically into the document head
  const styleEl = document.createElement("style");
  styleEl.innerHTML = `
    /* Floating AI Button */
    .ai-chat-launcher {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: var(--color-primary, #214E34);
      color: #FFF;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 30px rgba(33, 78, 52, 0.3);
      cursor: pointer;
      z-index: 9999;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      border: 2px solid var(--color-accent, #C89A45);
    }
    .ai-chat-launcher:hover {
      transform: scale(1.1);
      box-shadow: 0 12px 35px rgba(33, 78, 52, 0.4);
    }
    .ai-chat-launcher i {
      font-size: 1.6rem;
    }
    .ai-chat-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      background-color: var(--color-accent, #C89A45);
      color: var(--color-primary, #214E34);
      width: 18px;
      height: 18px;
      border-radius: 50%;
      font-size: 0.7rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pulse 2s infinite;
    }

    /* Chat window container */
    .ai-chat-window {
      position: fixed;
      bottom: 96px;
      right: 24px;
      width: 380px;
      max-width: 90vw;
      height: 520px;
      max-height: 80vh;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px) saturate(180%);
      -webkit-backdrop-filter: blur(12px) saturate(180%);
      border: 1px solid rgba(33, 78, 52, 0.1);
      box-shadow: var(--shadow-lux-md, 0 15px 35px rgba(0,0,0,0.1));
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 9998;
      font-family: var(--font-primary, sans-serif);
      animation: slideUpFade 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }

    /* Header */
    .ai-chat-header {
      background-color: var(--color-primary, #214E34);
      color: #FFF;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid var(--color-accent, #C89A45);
    }
    .ai-header-profile {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .ai-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: var(--color-bg-light, #F5EFEB);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-primary, #214E34);
      font-weight: 700;
      border: 1.5px solid var(--color-accent, #C89A45);
    }
    .ai-status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #2ECC71;
      display: inline-block;
      margin-left: 6px;
      box-shadow: 0 0 8px #2ECC71;
    }

    /* Chat Messages Body */
    .ai-chat-messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 14px;
      background-color: rgba(245, 239, 235, 0.2);
    }

    /* Message Bubbles */
    .ai-msg {
      max-width: 80%;
      padding: 12px 16px;
      border-radius: 12px;
      font-size: 0.92rem;
      line-height: 1.45;
    }
    .ai-msg-received {
      background-color: var(--color-bg-white, #FFF);
      color: var(--color-text-dark, #333);
      align-self: flex-start;
      border-bottom-left-radius: 2px;
      border: 1px solid rgba(33,78,52,0.06);
      box-shadow: 0 2px 5px rgba(0,0,0,0.02);
    }
    .ai-msg-sent {
      background-color: var(--color-primary, #214E34);
      color: #FFF;
      align-self: flex-end;
      border-bottom-right-radius: 2px;
      box-shadow: 0 3px 8px rgba(33, 78, 52, 0.15);
    }

    /* Quick Action Chips & Suggestion buttons */
    .ai-quick-actions-bar {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding: 8px 12px;
      background-color: rgba(33, 78, 52, 0.03);
      border-top: 1px solid rgba(33, 78, 52, 0.05);
      border-bottom: 1px solid rgba(33, 78, 52, 0.05);
    }
    .ai-quick-actions-bar::-webkit-scrollbar {
      display: none;
    }
    .ai-chip {
      background-color: #FFF;
      border: 1px solid rgba(33,78,52,0.12);
      color: var(--color-primary, #214E34);
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 0.8rem;
      font-weight: 700;
      white-space: nowrap;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: all 0.2s ease;
    }
    .ai-chip:hover {
      background-color: var(--color-primary, #214E34);
      color: #FFF;
      border-color: var(--color-primary, #214E34);
    }
    .ai-chip-accent {
      border-color: var(--color-accent, #C89A45);
      color: var(--color-accent, #C89A45);
    }

    /* Suggested Question Chips inside message flow */
    .ai-suggested-questions {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 8px;
    }
    .ai-suggest-btn {
      background-color: transparent;
      border: 1px dashed var(--color-primary, #214E34);
      color: var(--color-primary, #214E34);
      text-align: left;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 0.82rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .ai-suggest-btn:hover {
      background-color: rgba(33, 78, 52, 0.05);
      border-style: solid;
    }

    /* Input Footer */
    .ai-chat-input-bar {
      padding: 12px 16px;
      background-color: #FFF;
      display: flex;
      align-items: center;
      gap: 10px;
      border-top: 1px solid rgba(33, 78, 52, 0.08);
    }
    .ai-input {
      flex: 1;
      height: 40px;
      border: 1.5px solid rgba(33, 78, 52, 0.12);
      border-radius: 20px;
      padding: 0 16px;
      font-size: 0.88rem;
      outline: none;
      transition: all 0.2s ease;
    }
    .ai-input:focus {
      border-color: var(--color-primary, #214E34);
      box-shadow: 0 0 0 2px rgba(33, 78, 52, 0.05);
    }
    .ai-send-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: var(--color-primary, #214E34);
      color: #FFF;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .ai-send-btn:hover {
      background-color: var(--color-accent, #C89A45);
      transform: scale(1.05);
    }

    /* Typing Indicator Bubble */
    .ai-typing-bubble {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 12px 16px;
    }
    .ai-dot {
      width: 6px;
      height: 6px;
      background-color: var(--color-primary, #214E34);
      border-radius: 50%;
      opacity: 0.4;
      animation: bounce 1.4s infinite ease-in-out both;
    }
    .ai-dot:nth-child(2) { animation-delay: 0.2s; }
    .ai-dot:nth-child(3) { animation-delay: 0.4s; }

    /* Inactivity Smart Suggestion Toast */
    .ai-toast-suggestion {
      position: fixed;
      bottom: 96px;
      right: 24px;
      background-color: var(--color-bg-white, #FFF);
      color: var(--color-primary, #214E34);
      border: 1.5px solid var(--color-accent, #C89A45);
      padding: 12px 16px;
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.1);
      z-index: 9997;
      max-width: 280px;
      font-size: 0.88rem;
      cursor: pointer;
      display: none;
      animation: slideUpFade 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }

    /* Animations */
    @keyframes slideUpFade {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1.0); }
    }
    @keyframes pulse {
      0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(200, 154, 69, 0.5); }
      70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(200, 154, 69, 0); }
      100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(200, 154, 69, 0); }
    }

    /* Responsive Fullscreen on Mobile */
    @media (max-width: 480px) {
      .ai-chat-window {
        width: 100%;
        height: 100%;
        max-height: 100%;
        bottom: 0;
        right: 0;
        border-radius: 0;
      }
    }
  `;
  document.head.appendChild(styleEl);

  // Dynamic DOM Elements construction
  const chatButton = document.createElement("div");
  chatButton.className = "ai-chat-launcher";
  chatButton.id = "ai-chat-launcher";
  chatButton.innerHTML = `
    <i class="fa-solid fa-comments"></i>
    <span class="ai-chat-badge" id="ai-chat-badge" style="display:none;">1</span>
  `;

  const chatWindow = document.createElement("div");
  chatWindow.className = "ai-chat-window";
  chatWindow.id = "ai-chat-window";
  chatWindow.innerHTML = `
    <div class="ai-chat-header">
      <div class="ai-header-profile">
        <div class="ai-avatar">MF</div>
        <div>
          <strong style="font-size:1.05rem; display:block; line-height:1.2;">Mitti Fresh AI<span class="ai-status-indicator" title="AI Representative Online"></span></strong>
          <span style="font-size:0.75rem; opacity:0.85;">Your Store Assistant</span>
        </div>
      </div>
      <button id="ai-chat-close-btn" style="background:none; border:none; color:#FFF; font-size:1.2rem; cursor:pointer; padding:4px;"><i class="fa-solid fa-xmark"></i></button>
    </div>

    <!-- Quick actions selector links -->
    <div class="ai-quick-actions-bar">
      <div class="ai-chip" id="ai-action-shop"><i class="fa-solid fa-basket-shopping"></i> Shop Now</div>
      <div class="ai-chip" id="ai-action-track"><i class="fa-solid fa-truck"></i> Track Order</div>
      <div class="ai-chip" id="ai-action-grind"><i class="fa-solid fa-play"></i> Watch Live Grinding</div>
      <div class="ai-chip" id="ai-action-whatsapp"><i class="fa-brands fa-whatsapp"></i> WhatsApp</div>
      <div class="ai-chip" id="ai-action-call"><i class="fa-solid fa-phone"></i> Call Store</div>
    </div>

    <!-- Messages -->
    <div class="ai-chat-messages" id="ai-chat-messages">
      <!-- Loaded dynamically -->
    </div>

    <!-- User Input Footer -->
    <div class="ai-chat-input-bar">
      <input type="text" class="ai-input" id="ai-chat-input" placeholder="Type a question...">
      <button class="ai-send-btn" id="ai-chat-send-btn"><i class="fa-solid fa-paper-plane"></i></button>
    </div>
  `;

  const suggestionToast = document.createElement("div");
  suggestionToast.className = "ai-toast-suggestion";
  suggestionToast.id = "ai-toast-suggestion";

  // Append items to body
  document.body.appendChild(chatButton);
  document.body.appendChild(chatWindow);
  document.body.appendChild(suggestionToast);

  // AI Memory / Context
  let memory = {
    customerName: "",
    preferredLang: "", // 'en' or 'hi'
    recentlyViewed: "",
    addedToCart: []
  };

  // Assistant Questions flow stage markers
  let surveyStage = ""; // 'need', 'usage', 'family', 'qty'
  let recommendationContext = ""; // 'atta' or 'oil'
  let surveyAnswers = { need: "", usage: "", family: "", qty: "" };

  // Timer trackers
  let inactivityTimer = null;
  const INACTIVITY_LIMIT = 20000; // 20 seconds
  let suggestionShown = false;

  // DOM references
  const msgContainer = document.getElementById("ai-chat-messages");
  const chatInput = document.getElementById("ai-chat-input");
  const sendBtn = document.getElementById("ai-chat-send-btn");
  const closeBtn = document.getElementById("ai-chat-close-btn");
  const badgeEl = document.getElementById("ai-chat-badge");

  // Inactive notifications options
  const SUGGESTION_CHOICES = [
    "Need help choosing the right atta?",
    "Would you like to explore our best-selling cold pressed oils?",
    "Do you want to check the status of your order?"
  ];

  // Initialize conversations greeting
  const renderGreeting = () => {
    const greetingHtml = `
      <div class="ai-msg ai-msg-received">
        👋 <strong>Welcome to Mitti Fresh!</strong><br><br>
        I'm your AI Shopping Assistant. How can I help you today?<br><br>
        🌾 <strong>Choose the right atta</strong><br>
        🥜 <strong>Choose cold-pressed oil</strong><br>
        📦 <strong>Track your order</strong><br>
        ❓ <strong>Answer product details</strong>
        <div class="ai-suggested-questions" style="margin-top:12px;">
          <button class="ai-suggest-btn" data-query="Which atta is best for diabetes?">Which atta is best for diabetes?</button>
          <button class="ai-suggest-btn" data-query="How does cold grinding work?">How does stone grinding work?</button>
          <button class="ai-suggest-btn" data-query="Help me choose the right oil">Help me choose the right oil</button>
        </div>
      </div>
    `;
    msgContainer.innerHTML = greetingHtml;
    attachSuggestionClickListeners();
  };

  // Helper: display message bubble
  const appendMessage = (text, type = "received") => {
    const msg = document.createElement("div");
    msg.className = `ai-msg ai-msg-${type === "received" ? "received" : "sent"}`;
    msg.innerHTML = text;
    msgContainer.appendChild(msg);
    msgContainer.scrollTop = msgContainer.scrollHeight;
  };

  // Helper: display typing indicator
  const showTypingIndicator = () => {
    const bubble = document.createElement("div");
    bubble.className = "ai-msg ai-msg-received ai-typing-bubble";
    bubble.id = "ai-typing-indicator";
    bubble.innerHTML = `<span class="ai-dot"></span><span class="ai-dot"></span><span class="ai-dot"></span>`;
    msgContainer.appendChild(bubble);
    msgContainer.scrollTop = msgContainer.scrollHeight;
  };

  const removeTypingIndicator = () => {
    const el = document.getElementById("ai-typing-indicator");
    if (el) el.remove();
  };

  // Open / Close chat
  const toggleChat = (forceOpen = null) => {
    const isOpen = forceOpen !== null ? forceOpen : (chatWindow.style.display === "flex");
    if (isOpen) {
      chatWindow.style.display = "none";
    } else {
      chatWindow.style.display = "flex";
      chatInput.focus();
      badgeEl.style.display = "none";
      suggestionToast.style.display = "none";
      resetInactivityTimer();
    }
  };

  chatButton.addEventListener("click", () => toggleChat());
  closeBtn.addEventListener("click", () => toggleChat(true));

  // Smart suggestions toast click triggers
  suggestionToast.addEventListener("click", () => {
    toggleChat();
    const query = suggestionToast.textContent;
    handleUserInput(query);
    suggestionToast.style.display = "none";
  });

  // Reset inactivity timer
  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    if (suggestionShown) return;

    inactivityTimer = setTimeout(() => {
      const isWindowOpen = (chatWindow.style.display === "flex");
      if (!isWindowOpen && !suggestionShown) {
        const randIndex = Math.floor(Math.random() * SUGGESTION_CHOICES.length);
        const suggestionText = SUGGESTION_CHOICES[randIndex];
        
        suggestionToast.textContent = suggestionText;
        suggestionToast.style.display = "block";
        badgeEl.style.display = "flex";
        suggestionShown = true;
      }
    }, INACTIVITY_LIMIT);
  };

  // Track global client interactions to prevent alerts while typing
  window.addEventListener("mousemove", resetInactivityTimer);
  window.addEventListener("keypress", resetInactivityTimer);
  window.addEventListener("click", resetInactivityTimer);

  // Send message submit handlers
  const handleSend = () => {
    const text = chatInput.value.trim();
    if (!text) return;
    
    appendMessage(text, "sent");
    chatInput.value = "";
    resetInactivityTimer();
    
    showTypingIndicator();
    setTimeout(() => {
      removeTypingIndicator();
      handleUserInput(text);
    }, 1000);
  };

  sendBtn.addEventListener("click", handleSend);
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSend();
  });

  // Dynamic Suggestion clicks inside chat flow
  const attachSuggestionClickListeners = () => {
    document.querySelectorAll(".ai-suggest-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const query = e.target.getAttribute("data-query");
        appendMessage(query, "sent");
        showTypingIndicator();
        setTimeout(() => {
          removeTypingIndicator();
          handleUserInput(query);
        }, 800);
      });
    });
  };

  // Reusable add-to-cart link builder
  const buildAddToCartButton = (id, sizeName, sizeVal, price) => {
    const callbackKey = `ai_cart_add_${id}_${sizeVal}`;
    window[callbackKey] = () => {
      if (window.addToCartExternal) {
        window.addToCartExternal(id, AI_CATALOG[id].name, AI_CATALOG[id].image, sizeVal, price);
        appendMessage(`✅ Added <strong>${AI_CATALOG[id].name} (${sizeName})</strong> to your cart!`, "received");
        if (window.toggleCartDrawerExternal) {
          setTimeout(() => window.toggleCartDrawerExternal(true), 400);
        }
      } else {
        appendMessage("Sorry, unable to add to cart directly. Please purchase from the Shop catalog.", "received");
      }
    };
    return `<button class="ai-chip ai-chip-accent" onclick="window['${callbackKey}']()"><i class="fa-solid fa-cart-plus"></i> Add ${sizeName} (₹${price})</button>`;
  };

  // Core NLP Dialog parser & response generator
  const handleUserInput = (input) => {
    const raw = input.toLowerCase().trim();
    
    // Language detection
    const isHindi = raw.includes("atta") || raw.includes("tel") || raw.includes("daam") || 
                    raw.includes("kya") || raw.includes("batao") || raw.includes("paise") || 
                    raw.includes("kaise") || raw.includes("ghar") || raw.includes("swasthya") || 
                    raw.includes("namaste") || raw.includes("madhumeh");
    
    if (isHindi) memory.preferredLang = "hi";
    
    // Conversational state check: Recommendation Survey flow
    if (surveyStage !== "") {
      handleSurveyFlow(raw, isHindi);
      return;
    }

    // --- DIALOG INTENT MATCHES ---

    // Intent: Greeting
    if (raw.includes("hello") || raw.includes("hi") || raw.includes("namaste") || raw.includes("hey") || raw.includes("hello ai")) {
      if (isHindi) {
        appendMessage("नमस्ते! मैं मिट्टी फ्रेश का एआई सहायक हूँ। आज मैं आटा, सरसों तेल या अन्य अनाज चुनने में आपकी क्या सहायता कर सकता हूँ?");
      } else {
        appendMessage("Hello! How can I assist you with Mitti Fresh staples today? I can help choose the right stone-ground atta, cold-pressed oil, or track your order.");
      }
      return;
    }

    // Intent: Watch live grinding
    if (raw.includes("live") || raw.includes("grinding") || raw.includes("watch") || raw.includes("pisai")) {
      if (isHindi) {
        appendMessage("आप Bamnol Dwarka स्थित हमारी दुकान से लाइव पत्थर की पिसाई देख सकते हैं! लाइव वीडियो देखने के लिए नीचे दिए गए बटन पर क्लिक करें।", "received");
      } else {
        appendMessage("We mill fresh wheat grains on traditional stone grinders! You can inspect the live milling process online by clicking below:", "received");
      }
      appendMessage(`<a href="/#live-stream" class="ai-chip ai-chip-accent" target="_blank"><i class="fa-solid fa-play"></i> Watch Live Stream</a>`);
      return;
    }

    // Intent: Store location & timing FAQs
    if (raw.includes("timing") || raw.includes("open") || raw.includes("timing") || raw.includes("hour") || raw.includes("location") || raw.includes("shop") || raw.includes("dukan") || raw.includes("address")) {
      if (isHindi) {
        appendMessage("मिट्टी फ्रेश द्वारका सेक्टर 28, बामनोली विलेज, नई दिल्ली में स्थित है। हमारे खुलने का समय रोजाना सुबह 9:00 बजे से रात 9:00 बजे तक है।");
      } else {
        appendMessage("Mitti Fresh is located at Dwarka Sector 28, Bamnoli Village, New Delhi. We are open daily from 9:00 AM to 9:00 PM.");
      }
      return;
    }

    // Intent: Diabetes & medical warnings
    if (raw.includes("diabetes") || raw.includes("sugar") || raw.includes("diabetic") || raw.includes("madhumeh")) {
      if (isHindi) {
        appendMessage("मधुमेह (Diabetes) के लिए हमारा <strong>Multigrain Atta (Goal-Based)</strong> सबसे बेहतर माना जाता है क्योंकि इसमें उच्च फाइबर और चना, बाजरा, रागी शामिल हैं जो ग्लाइसेमिक रिस्पांस को नियंत्रित करते हैं।<br><br>⚠️ <em>कृपया ध्यान दें: यह केवल सामान्य शैक्षणिक जानकारी है। चिकित्सा सलाह के लिए डॉक्टर से परामर्श लें।</em>");
      } else {
        appendMessage("For blood sugar management, our stone-ground <strong>Multigrain Atta (Goal-Based)</strong> is highly recommended. It blends fiber-rich grains like chana, ragi, and oats which support healthy sugar responses.<br><br>⚠️ <em>Disclaimer: This is for general educational information only. Please consult a healthcare practitioner for personal medical advice.</em>");
      }
      appendMessage(buildAddToCartButton("multigrain-atta", "5 kg", "5kg", 390));
      return;
    }

    // Intent: Heart Health & Best Oil
    if (raw.includes("healthiest oil") || raw.includes("heart") || raw.includes("which oil") || raw.includes("healthy oil") || raw.includes("sabse accha tel")) {
      if (isHindi) {
        appendMessage("हृदय स्वास्थ्य और सामान्य खाना पकाने के लिए हमारा <strong>Cold Pressed Mustard Oil</strong> और <strong>Groundnut Oil</strong> सबसे अच्छे हैं। वे रसायनों और अत्यधिक गर्मी के बिना पारंपरिक कोल्हू से निकाले जाते हैं जिससे पोषक तत्व बने रहते हैं।<br><br>⚠️ <em>चिकित्सा संबंधी निर्णयों के लिए कृपया अपने चिकित्सक से सलाह लें।</em>");
      } else {
        appendMessage("Our wood-pressed <strong>Cold Pressed Mustard Oil</strong> and <strong>Groundnut Oil</strong> are excellent heart-healthy options. Milled cold without solvents, they preserve healthy monounsaturated fats.<br><br>⚠️ <em>Disclaimer: Please consult a healthcare professional for customized cardiovascular nutrition plans.</em>");
      }
      appendMessage(buildAddToCartButton("mustard-oil", "5 Liter", "5l", 930));
      return;
    }

    // Intent: Track order (Dynamic lookup in LocalStorage orders database)
    if (raw.includes("track") || raw.includes("order status") || raw.includes("mera order") || raw.includes("status")) {
      // Find order ID matches from string
      const matchedId = input.toUpperCase().match(/MF-\d{6}/);
      if (matchedId) {
        const oId = matchedId[0];
        const orders = JSON.parse(localStorage.getItem('mitti_fresh_orders') || '[]');
        const ord = orders.find(o => o.orderId === oId);
        
        if (ord) {
          if (isHindi) {
            appendMessage(`मैंने आपके ऑर्डर <strong>${oId}</strong> की जांच की है:<br>• भुगतान स्थिति: <strong>${ord.paymentStatus}</strong><br>• डिलीवरी स्थिति: <strong>${ord.orderStatus}</strong><br><br>निश्चिंत रहें, हमारी टीम काम कर रही है!`);
          } else {
            appendMessage(`Checked order status for <strong>${oId}</strong>:<br>• Payment State: <strong>${ord.paymentStatus}</strong><br>• Order Stage: <strong>${ord.orderStatus}</strong><br><br>Our shipping agents are coordinating fresh dispatch.`);
          }
        } else {
          if (isHindi) {
            appendMessage(`क्षमा करें, मुझे <strong>${oId}</strong> नंबर का कोई आर्डर नहीं मिला। कृपया सही आर्डर नंबर जांचें या सहायता टीम से संपर्क करें।`);
          } else {
            appendMessage(`I couldn't locate order ID <strong>${oId}</strong> in our Local Storage records. Please verify the code on your invoice.`);
          }
        }
      } else {
        if (isHindi) {
          appendMessage("अपना आर्डर ट्रैक करने के लिए कृपया अपना Mitti Fresh Order ID (उदा: <strong>MF-123456</strong>) लिखें।");
        } else {
          appendMessage("To trace your shipment, please type your Mitti Fresh Order ID (e.g. <strong>MF-637281</strong>) directly in our chat.");
        }
      }
      return;
    }

    // Intent: General delivery parameters
    if (raw.includes("delivery") || raw.includes("shipping") || raw.includes("charge") || raw.includes("area") || raw.includes("pin")) {
      if (isHindi) {
        appendMessage("हम द्वारका सेक्टर 28 और आसपास के क्षेत्रों में डिलीवरी करते हैं। ₹500 से अधिक के आर्डर पर डिलीवरी मुफ्त है। अन्यथा ₹50 चार्ज लागू होता है।");
      } else {
        appendMessage("We deliver to Dwarka Sector 28 and surrounding PIN codes in New Delhi. Delivery is free for order subtotals above ₹500, otherwise flat ₹50 shipping applies.");
      }
      return;
    }

    // Intent: Cash on Delivery or UPI payments
    if (raw.includes("payment") || raw.includes("cod") || raw.includes("paytm") || raw.includes("gpay") || raw.includes("upi") || raw.includes("cash")) {
      if (isHindi) {
        appendMessage("हम Razorpay (UPI, Google Pay, कार्ड, नेट बैंकिंग) और Cash on Delivery (COD) स्वीकार करते हैं। द्वारका क्षेत्र में COD पर ₹50 सुविधा शुल्क लागू होता है।");
      } else {
        appendMessage("We support secure payments online (UPI, GPay, Credit/Debit cards via Razorpay), Direct bank UPI transfers, and Cash on Delivery (COD) for Dwarka Sector 28 (with a flat ₹50 COD convenience charge).");
      }
      return;
    }

    // Intent: Stone grinding / cold pressed milling process explanations
    if (raw.includes("stone grinding") || raw.includes("stone-ground") || raw.includes("cold pressed") || raw.includes("coldpressed") || raw.includes("wood pressed")) {
      if (isHindi) {
        appendMessage("हम पारंपरिक धीमी पत्थर की चक्की (Stone Grinder) का उपयोग करते हैं जिससे गर्मी उत्पन्न नहीं होती और पोषक तत्व बने रहते हैं। हमारे तेल भी लकड़ी के कोल्हू से ठंडी विधि से निकाले जाते हैं जिसमें कोई रसायन नहीं मिलाया जाता।");
      } else {
        appendMessage("We use traditional stone-grinding wheels operating at low speeds to prevent heat production, preserving natural vitamins and fibers. Similarly, our cold-pressed oils are extracted via wooden press extraction without toxic chemical refining.");
      }
      return;
    }

    // Intent: Recommendations Survey Initiation
    if (raw.includes("choose") || raw.includes("recommend") || raw.includes("help me select") || raw.includes("kaun sa") || raw.includes("kon sa") || raw.includes("select") || raw.includes("kharidna")) {
      const selectOil = raw.includes("oil") || raw.includes("tel");
      recommendationContext = selectOil ? "oil" : "atta";
      surveyStage = "need";
      
      if (isHindi) {
        appendMessage(selectOil ? "आइए आपके लिए सही तेल चुनें! आप मुख्य रूप से कौन सा तेल तलाश रहे हैं? (उदा: सरसों तेल, मूंगफली तेल)" : "आइए आपके लिए सही आटा चुनें! आप मुख्य रूप से क्या आटा ढूंढ रहे हैं? (उदा: सामान्य रोटी, मधुमेह/स्वास्थ्य के लिए)");
      } else {
        appendMessage(selectOil ? "Let's choose the perfect cooking oil! What type are you looking for? (e.g. Mustard oil, Groundnut oil)" : "Let's select the ideal stone-ground flour! What health goals are you targeting? (e.g. Regular soft rotis, Low glycemic/Diabetic health)");
      }
      return;
    }

    // Intent: Product Catalog Matches
    let productMatch = null;
    for (const key in AI_CATALOG) {
      if (raw.includes(key) || raw.includes(AI_CATALOG[key].name.toLowerCase()) || (key === "wheat-atta" && raw.includes("sharbhati"))) {
        productMatch = AI_CATALOG[key];
        break;
      }
    }

    if (productMatch) {
      const sizesList = Object.entries(productMatch.sizes).map(([sz, pr]) => `${sz} - ₹${pr}`).join(", ");
      if (isHindi) {
        appendMessage(`<strong>${productMatch.name}</strong>:<br>${productMatch.description}<br><br>• लाभ: ${productMatch.benefits}<br>• पैक और दाम: ${sizesList}<br>• शेल्फ लाइफ: ${productMatch.shelfLife}`);
      } else {
        appendMessage(`<strong>${productMatch.name}</strong>:<br>${productMatch.description}<br><br>• Benefits: ${productMatch.benefits}<br>• Pack Sizes: ${sizesList}<br>• Shelf Life: ${productMatch.shelfLife}`);
      }
      
      // Build add to cart options dynamically
      const sizeKeys = Object.keys(productMatch.sizes);
      sizeKeys.forEach(k => {
        msgContainer.appendChild(document.createElement("div")).innerHTML = buildAddToCartButton(productMatch.id, k, k.toLowerCase(), productMatch.sizes[k]);
      });
      msgContainer.scrollTop = msgContainer.scrollHeight;
      return;
    }

    // Default Fallback: Confidently escalate to support team
    if (isHindi) {
      appendMessage("मैं आपकी सटीक आवश्यकताओं को समझने के लिए आपको हमारी स्टोर टीम से जोड़ना चाहूंगा:", "received");
    } else {
      appendMessage("I want to connect you directly with our store representative to get the most accurate answers for your custom requests:", "received");
    }
    appendMessage(`
      <div style="display:flex; flex-direction:column; gap:8px; width:100%; margin-top:8px;">
        <a href="https://wa.me/918595077263?text=Hi%20Mitti%20Fresh!%20I%20have%20an%20inquiry%20regarding%20products." target="_blank" class="ai-chip ai-chip-accent" style="justify-content:center;"><i class="fa-brands fa-whatsapp"></i> Chat on WhatsApp</a>
        <a href="tel:8595077263" class="ai-chip" style="justify-content:center; border-color:var(--color-primary);"><i class="fa-solid fa-phone"></i> Call Representative</a>
      </div>
    `);
  };

  // Recommendations Survey questionnaire flow logic
  const handleSurveyFlow = (raw, isHindi) => {
    if (surveyStage === "need") {
      surveyAnswers.need = raw;
      surveyStage = "usage";
      if (isHindi) {
        appendMessage("बहुत बढ़िया। आप मुख्य रूप से इसका उपयोग किस काम के लिए करेंगे? (उदा: रोजाना रोटी, तलना, सामान्य कुकिंग)");
      } else {
        appendMessage("Understood. What will you mainly use it for? (e.g. Daily soft rotis, deep frying, baking)");
      }
    } else if (surveyStage === "usage") {
      surveyAnswers.usage = raw;
      surveyStage = "family";
      if (isHindi) {
        appendMessage("आपके परिवार में कितने सदस्य हैं?");
      } else {
        appendMessage("How many members are there in your family?");
      }
    } else if (surveyStage === "family") {
      surveyAnswers.family = raw;
      surveyStage = "qty";
      if (isHindi) {
        appendMessage("आपको कितनी मात्रा की आवश्यकता है? (उदा: 5kg, 10kg, 2 Liter)");
      } else {
        appendMessage("How much quantity do you usually need? (e.g. 5kg, 10kg, 2 Liter)");
      }
    } else if (surveyStage === "qty") {
      surveyAnswers.qty = raw;
      surveyStage = ""; // Clear stage
      
      // Analyze answers and recommend
      let recId = "";
      if (recommendationContext === "oil") {
        recId = (surveyAnswers.need.includes("mustard") || surveyAnswers.need.includes("sarso") || surveyAnswers.usage.includes("fry") || surveyAnswers.usage.includes("cooking")) ? "mustard-oil" : "groundnut-oil";
      } else {
        recId = (surveyAnswers.need.includes("sugar") || surveyAnswers.need.includes("diabet") || surveyAnswers.need.includes("weight") || surveyAnswers.need.includes("health")) ? "multigrain-atta" : "wheat-atta";
      }
      
      const prod = AI_CATALOG[recId];
      if (isHindi) {
        appendMessage(`आपकी आवश्यकताओं के आधार पर, हम <strong>${prod.name}</strong> की सलाह देते हैं!<br><br>• विवरण: ${prod.description}<br>• लाभ: ${prod.benefits}`);
      } else {
        appendMessage(`Based on your answers, we recommend our premium <strong>${prod.name}</strong>!<br><br>• Description: ${prod.description}<br>• Key Benefits: ${prod.benefits}`);
      }
      
      // Render buy options
      const sizeKeys = Object.keys(prod.sizes);
      sizeKeys.forEach(k => {
        msgContainer.appendChild(document.createElement("div")).innerHTML = buildAddToCartButton(prod.id, k, k.toLowerCase(), prod.sizes[k]);
      });
      msgContainer.scrollTop = msgContainer.scrollHeight;
    }
  };

  // Header quick actions button click handler events
  document.getElementById("ai-action-shop").addEventListener("click", () => {
    window.location.href = "/collections/staples";
  });
  document.getElementById("ai-action-track").addEventListener("click", () => {
    toggleChat(false);
    appendMessage("Check order status", "sent");
    showTypingIndicator();
    setTimeout(() => {
      removeTypingIndicator();
      handleUserInput("track order status");
    }, 500);
  });
  document.getElementById("ai-action-grind").addEventListener("click", () => {
    window.location.href = "/#live-stream";
  });
  document.getElementById("ai-action-whatsapp").addEventListener("click", () => {
    window.open("https://wa.me/918595077263?text=Hi%20Mitti%20Fresh!%20I%20need%20help%20completing%20my%20order.", "_blank");
  });
  document.getElementById("ai-action-call").addEventListener("click", () => {
    window.location.href = "tel:8595077263";
  });

  // Render initial greeting on dynamic load
  renderGreeting();
})();
