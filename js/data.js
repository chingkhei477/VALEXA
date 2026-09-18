/**
 * VALEXA — catalogue data layer
 * This file stands in for a real offers API. Every function below returns
 * the same shape a backend endpoint would, so swapping VALEXA_DATA for
 * `fetch('/api/offers')` later requires no change anywhere else in the app.
 */

const VALEXA_CATEGORIES = [
  { id: "fashion", name: "Fashion & Apparel", icon: "shirt" },
  { id: "electronics", name: "Electronics", icon: "chip" },
  { id: "beauty", name: "Beauty & Wellness", icon: "sparkle" },
  { id: "home", name: "Home & Living", icon: "home" },
  { id: "travel", name: "Travel & Stays", icon: "plane" },
  { id: "food", name: "Food & Dining", icon: "bowl" },
  { id: "groceries", name: "Groceries", icon: "basket" },
  { id: "recharge", name: "Recharge & Bills", icon: "bolt" },
  { id: "finance", name: "Finance & Insurance", icon: "shield" },
  { id: "entertainment", name: "Entertainment", icon: "play" },
];

const VALEXA_OFFERS = [
  { id: "ut-001", merchant: "Urban Threads", category: "fashion", cashbackType: "percent", cashbackValue: 6, headline: "on all clothing and footwear", eligibility: "New and existing customers. One order per user per day.", terms: "Cashback applies on the pre-discount order value. Excludes gift cards and store credit. Cashback is confirmed after the merchant's own return window closes.", link: "#" },
  { id: "fs-002", merchant: "FootStyle", category: "fashion", cashbackType: "flat", cashbackValue: 120, headline: "on orders above ₹1,999", eligibility: "Valid on orders placed through the Valexa link only.", terms: "One redemption per user per calendar month. Not valid with other coupon stacking that blocks tracking.", link: "#" },
  { id: "tn-003", merchant: "TechNest", category: "electronics", cashbackType: "percent", cashbackValue: 3.5, headline: "on laptops, audio and accessories", eligibility: "All users. Mobile phones are capped separately — see terms.", terms: "Cashback on mobile phones is capped at ₹300 per order. No cap on other electronics categories.", link: "#" },
  { id: "gh-004", merchant: "GadgetHive", category: "electronics", cashbackType: "percent", cashbackValue: 5, headline: "on smart home devices", eligibility: "First-time GadgetHive buyers only.", terms: "Cashback tracks only when cookies are enabled and no ad-blocker interferes with the outbound click.", link: "#" },
  { id: "gm-005", merchant: "GlowMart", category: "beauty", cashbackType: "percent", cashbackValue: 8, headline: "on skincare and haircare", eligibility: "All users.", terms: "Excludes gift sets already marked 'no cashback' on the product page.", link: "#" },
  { id: "hn-006", merchant: "HomeNest", category: "home", cashbackType: "percent", cashbackValue: 4, headline: "on furniture and décor", eligibility: "All users. COD orders are not eligible.", terms: "Cashback is voided if the order is returned, exchanged, or partially cancelled.", link: "#" },
  { id: "st-007", merchant: "SkyTrail Travels", category: "travel", cashbackType: "flat", cashbackValue: 250, headline: "on domestic flight bookings", eligibility: "Bookings above ₹3,500. One booking per user per week.", terms: "Cashback is credited only after the travel date has passed and no cancellation is filed.", link: "#" },
  { id: "st-008", merchant: "StayCircle", category: "travel", cashbackType: "percent", cashbackValue: 7, headline: "on hotel and homestay bookings", eligibility: "All users.", terms: "Cashback excludes taxes and convenience fees shown at checkout.", link: "#" },
  { id: "tt-009", merchant: "TasteTrail", category: "food", cashbackType: "flat", cashbackValue: 40, headline: "on your first three orders", eligibility: "New TasteTrail users only.", terms: "Offer applies to the first three qualifying orders from account creation.", link: "#" },
  { id: "fb-010", merchant: "FreshBasket", category: "groceries", cashbackType: "percent", cashbackValue: 2.5, headline: "on grocery and daily essentials", eligibility: "All users. Minimum order ₹500.", terms: "Cashback excludes fresh produce and dairy lines as listed on the merchant's page.", link: "#" },
  { id: "pe-011", merchant: "PayEase Recharge", category: "recharge", cashbackType: "flat", cashbackValue: 15, headline: "on mobile recharges above ₹299", eligibility: "All users, one recharge per number per month.", terms: "Cashback does not apply to postpaid bill payments, only prepaid recharges.", link: "#" },
  { id: "wb-012", merchant: "WealthBridge", category: "finance", cashbackType: "flat", cashbackValue: 300, headline: "on new term insurance policies", eligibility: "New policy issuance only, subject to the insurer's underwriting.", terms: "Cashback is credited only after the policy's free-look period ends without cancellation.", link: "#" },
  { id: "sj-013", merchant: "StreamJoy", category: "entertainment", cashbackType: "flat", cashbackValue: 60, headline: "on annual subscription plans", eligibility: "New subscribers only.", terms: "Not valid on monthly or trial plans, only annual plans purchased in full.", link: "#" },
  { id: "ut-014", merchant: "Urban Threads", category: "fashion", cashbackType: "percent", cashbackValue: 10, headline: "on ethnic wear during festive weeks", eligibility: "All users, festive calendar dates only.", terms: "Rate reverts to the standard rate outside the listed festive dates on the offer page.", link: "#" },
  { id: "gm-015", merchant: "GlowMart", category: "beauty", cashbackType: "flat", cashbackValue: 75, headline: "on orders above ₹1,200", eligibility: "All users.", terms: "Stackable with merchant discounts but not with other cashback aggregators.", link: "#" },
];

function getCategoryById(id) {
  return VALEXA_CATEGORIES.find((c) => c.id === id) || null;
}

function getOfferById(id) {
  return VALEXA_OFFERS.find((o) => o.id === id) || null;
}

function formatCashback(offer) {
  return offer.cashbackType === "percent"
    ? `${offer.cashbackValue}% cashback`
    : `₹${offer.cashbackValue} cashback`;
}

function searchOffers({ query = "", categoryId = "" } = {}) {
  const q = query.trim().toLowerCase();
  return VALEXA_OFFERS.filter((o) => {
    const matchesQuery = !q || o.merchant.toLowerCase().includes(q) || o.headline.toLowerCase().includes(q);
    const matchesCategory = !categoryId || o.category === categoryId;
    return matchesQuery && matchesCategory;
  });
}
