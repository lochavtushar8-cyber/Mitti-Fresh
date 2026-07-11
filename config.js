/* ==========================================================================
   Mitti Fresh - Payment Gateway Configuration
   ========================================================================== */

const CONFIG = {
  // Official Razorpay credentials placeholder
  // Change to your live Key ID from Razorpay dashboard when deploying to production
  RAZORPAY_KEY_ID: "rzp_test_placeholder",

  // Production endpoints for secure backend integration (empty strings default to sandbox/simulation)
  CREATE_ORDER_API: "http://localhost:3000/api/create-order",
  VERIFY_PAYMENT_API: "http://localhost:3000/api/verify-payment",

  // Cash on Delivery parameters
  COD_ELIGIBLE_PINS: ["110078", "110075", "110059", "110045", "110077", "110076", "110043"], // Dwarka and surrounding sectors
  COD_CHARGE: 50,           // Flat fee in Rupees for Cash on Delivery processing
  FREE_DELIVERY_MIN: 500,   // Order threshold for free standard shipping

  // Estimated Delivery Days
  EST_DELIVERY_DAYS: 2       // Normal delivery turnaround time
};
window.CONFIG = CONFIG;
