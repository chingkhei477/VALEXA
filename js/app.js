/**
 * VALEXA — shared layout and UI helpers.
 * Renders the header/footer at runtime so every page stays in sync
 * without a template build step, and provides small utilities (icons,
 * toasts, currency formatting) used across pages.
 */

const VALEXA_NAV = [
  { href: "index.html", label: "Home", key: "home" },
  { href: "offers.html", label: "Cashback Offers", key: "offers" },
  { href: "categories.html", label: "Categories", key: "categories" },
  { href: "how-it-works.html", label: "How It Works", key: "how" },
  { href: "about.html", label: "About", key: "about" },
  { href: "contact.html", label: "Support", key: "contact" },
];

function valexaLogoMarkup() {
  return `
  <svg class="logo-mark" width="34" height="34" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="20" cy="20" r="18.5" stroke="var(--color-primary)" stroke-width="3"/>
    <path d="M12 13c0 5.2 3.2 8.3 7.4 8.3M12 13h9.6M12 13h-1.6M19.4 21.3H27" stroke="var(--color-primary)" stroke-width="3" stroke-linecap="round"/>
    <path d="M19.4 17h6.2" stroke="var(--color-primary)" stroke-width="3" stroke-linecap="round"/>
    <circle cx="27.5" cy="27.5" r="4" fill="var(--color-accent)"/>
  </svg>`;
}

function renderHeader(activeKey) {
  const el = document.getElementById("site-header");
  if (!el) return;
  const user = typeof getCurrentUser === "function" ? getCurrentUser() : null;

  const navLinks = VALEXA_NAV.map(
    (item) => `<a href="${item.href}" class="nav-link" ${item.key === activeKey ? 'aria-current="page"' : ""}>${item.label}</a>`
  ).join("");

  const authArea = user
    ? `<a href="dashboard.html" class="btn btn-ghost btn-sm">Dashboard</a>
       <button type="button" class="btn btn-primary btn-sm" id="logout-btn">Log out</button>`
    : `<a href="login.html" class="btn btn-ghost btn-sm">Log in</a>
       <a href="register.html" class="btn btn-primary btn-sm">Join Free</a>`;

  el.innerHTML = `
    <div class="header-inner">
      <a href="index.html" class="brand" aria-label="Valexa home">
        ${valexaLogoMarkup()}
        <span class="brand-name">Valexa</span>
      </a>
      <nav class="main-nav" id="main-nav" aria-label="Primary">
        ${navLinks}
      </nav>
      <div class="header-actions">
        ${authArea}
      </div>
      <button type="button" class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="main-nav" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
    </div>`;

  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      logoutUser();
      window.location.href = "index.html";
    });
  }
}

function renderFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;
  const c = typeof VALEXA_CONFIG !== "undefined" ? VALEXA_CONFIG : {};
  const contactLines = [c.phone, c.address, c.openingHours].filter(Boolean);

  el.innerHTML = `
    <div class="footer-inner">
      <div class="footer-brand">
        <div class="brand">${valexaLogoMarkup()}<span class="brand-name">Valexa</span></div>
        <p class="footer-tagline">Shop through Valexa, get a share of what you spend back.</p>
      </div>
      <div class="footer-col">
        <h3>Explore</h3>
        <a href="offers.html">Cashback Offers</a>
        <a href="categories.html">Categories</a>
        <a href="how-it-works.html">How It Works</a>
        <a href="about.html">About Valexa</a>
      </div>
      <div class="footer-col">
        <h3>Account</h3>
        <a href="login.html">Log In</a>
        <a href="register.html">Create Account</a>
        <a href="dashboard.html">Dashboard</a>
        <a href="cashback-history.html">Cashback History</a>
      </div>
      <div class="footer-col">
        <h3>Legal</h3>
        <a href="terms.html">Terms &amp; Conditions</a>
        <a href="privacy.html">Privacy Policy</a>
        <a href="refund-policy.html">Refund &amp; Cancellation</a>
        <a href="contact.html">Contact &amp; Support</a>
      </div>
      ${
        contactLines.length
          ? `<div class="footer-col">
              <h3>Reach Us</h3>
              ${c.phone ? `<p>${c.phone}</p>` : ""}
              ${c.address ? `<p>${c.address}</p>` : ""}
              ${c.openingHours ? `<p>${c.openingHours}</p>` : ""}
            </div>`
          : ""
      }
    </div>
    <div class="footer-bottom">
      <p>&copy; <span id="footer-year"></span> Valexa. All rights reserved.</p>
    </div>`;

  document.getElementById("footer-year").textContent = new Date().getFullYear();
}

function renderLayout(activeKey) {
  renderHeader(activeKey);
  renderFooter();
}

function formatINR(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

function showFormMessage(el, message, type = "error") {
  if (!el) return;
  el.textContent = message;
  el.className = "form-message " + (type === "success" ? "form-message--success" : "form-message--error");
  el.hidden = false;
}

function clearFormMessage(el) {
  if (!el) return;
  el.hidden = true;
  el.textContent = "";
}

const VALEXA_ICONS = {
  shirt: '<path d="M8 4l4-1 4 1 4 3-2 3-2-1v11H8V9L6 10l-2-3z"/>',
  chip: '<rect x="6" y="6" width="12" height="12" rx="1"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/>',
  home: '<path d="M4 11l8-7 8 7"/><path d="M6 10v9h12v-9"/>',
  plane: '<path d="M3 13l7-2 4-8 2 1-2 7 6 2v2l-6-1-2 6-2-1 1-5-8 2z"/>',
  bowl: '<path d="M4 12h16a8 8 0 01-16 0z"/><path d="M9 12V7M15 12V7"/>',
  basket: '<path d="M5 9h14l-1.5 10h-11z"/><path d="M9 9l1-4h4l1 4"/>',
  bolt: '<path d="M13 3L5 14h6l-1 7 8-11h-6l1-7z"/>',
  shield: '<path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6z"/>',
  play: '<circle cx="12" cy="12" r="9"/><path d="M10 8l6 4-6 4z"/>',
};

function categoryIconSVG(iconKey) {
  const path = VALEXA_ICONS[iconKey] || VALEXA_ICONS.sparkle;
  return `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
}
