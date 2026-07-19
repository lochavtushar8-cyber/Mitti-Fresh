/* ==========================================================================
   Mitti Fresh - Payment Gateway Configuration
   ========================================================================== */

const getApiEndpoint = (path) => {
  if (window.location.hostname === "lochavtushar8-cyber.github.io") {
    return ""; // Force offline LocalStorage simulation on static GitHub Pages
  }
  if (window.location.protocol === "file:") {
    return "http://localhost:3000" + path; // Local testing via file protocol
  }
  return path; // Relative URL when served by Node/Express server
};
window.getApiEndpoint = getApiEndpoint;

const CONFIG = {
  // Official Razorpay credentials placeholder
  // Dynamically fetched from backend /api/config; falls back to correct test key if backend is offline
  RAZORPAY_KEY_ID: "rzp_live_TCvSp0t4dRsI43",

  // Production endpoints resolved dynamically
  CREATE_ORDER_API: getApiEndpoint("/create-order"),
  VERIFY_PAYMENT_API: getApiEndpoint("/api/verify-payment"),

  // Cash on Delivery parameters
  COD_ELIGIBLE_PINS: ["110078", "110075", "110059", "110045", "110077", "110076", "110043"], // Dwarka and surrounding sectors
  COD_CHARGE: 50,           // Flat fee in Rupees for Cash on Delivery processing
  FREE_DELIVERY_MIN: 500,   // Order threshold for free standard shipping

  // Estimated Delivery Days
  EST_DELIVERY_DAYS: 2       // Normal delivery turnaround time
};
window.CONFIG = CONFIG;
