// settings.js - Holds all tunable numbers and mode mappings in one single place.
// First-year student note: We never bury numbers inside our logic functions;
// keeping them here lets shop owners or judges tune them without breaking code.

export const SETTINGS = {
  // Digital payment matches a bill if received within 60 minutes before or after the bill
  // Guess for pilot trial; will be tuned with real kirana shops.
  WINDOW_MIN: 60,

  // Two bills with the same amount within 5 minutes indicate a possible cashier duplicate tap
  // Guess for pilot trial; will be tuned with real kirana shops.
  DUP_MIN: 5,

  // A credit bill (khata) can be settled by customer payment up to 7 days later
  // Guess for pilot trial; will be tuned with real kirana shops.
  CREDIT_MAX_DAYS: 7,

  // Default display name for the shop
  shopName: "Annachi Store",

  // Base date string for the test records (26 October 2026)
  baseDate: "2026-10-26",

  // Mapping user-entered payment mode aliases to our 4 canonical modes:
  // "cash", "upi", "marketplace", "credit"
  modeAliases: {
    // Cash bucket
    "cash": "cash",
    "panam": "cash",
    "rokkam": "cash",

    // UPI digital bucket
    "upi": "upi",
    "gpay": "upi",
    "googlepay": "upi",
    "phonepe": "upi",
    "paytm": "upi",
    "bhim": "upi",
    "qr": "upi",

    // Marketplace settlement bucket
    "marketplace": "marketplace",
    "payout": "marketplace",
    "online": "marketplace",
    "swiggy": "marketplace",
    "zomato": "marketplace",
    "dunzo": "marketplace",

    // Credit / Khata book bucket
    "credit": "credit",
    "khata": "credit",
    "udhar": "credit",
    "kadam": "credit",
    "baaki": "credit"
  }
};
