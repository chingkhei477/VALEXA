renderLayout("offers");

const params = new URLSearchParams(window.location.search);
const offer = getOfferById(params.get("id"));
const content = document.getElementById("offer-content");

if (!offer) {
  content.innerHTML = `<div class="container empty-state">
    <h1>Offer not found</h1>
    <p>This offer may have ended. Browse current offers instead.</p>
    <a href="offers.html" class="btn btn-primary">Browse offers</a>
  </div>`;
} else {
  const category = getCategoryById(offer.category);
  content.innerHTML = `
    <div class="container">
      <div class="offer-detail-head">
        <div>
          <span class="tag">${category.name}</span>
          <h1 style="margin-top:10px;">${offer.merchant}</h1>
          <p class="text-muted">${offer.headline}</p>
        </div>
        <div class="offer-detail-cashback">
          <span class="amount">${formatCashback(offer)}</span>
          <span class="text-muted" style="font-size:0.82rem;">per qualifying order</span>
        </div>
      </div>

      <div class="detail-block">
        <h2>Eligibility</h2>
        <p>${offer.eligibility}</p>
      </div>
      <div class="detail-block">
        <h2>Terms &amp; conditions</h2>
        <p>${offer.terms}</p>
      </div>

      <div class="detail-block form-card" style="margin:0;">
        <h2>Activate and shop</h2>
        <p class="text-muted" style="font-size:0.9rem;">Click through to ${offer.merchant} to shop. Once your order is placed, come back and confirm it below so Valexa can start tracking your cashback.</p>
        <a href="${offer.link}" target="_blank" rel="noopener" class="btn btn-primary btn-block" style="margin-bottom:20px;">Shop at ${offer.merchant}</a>

        <div id="confirm-section"></div>
      </div>
    </div>`;

  renderConfirmSection();
}

function renderConfirmSection() {
  const wrap = document.getElementById("confirm-section");
  const user = getCurrentUser();

  if (!user) {
    wrap.innerHTML = `<p class="form-hint">
      <a href="login.html?next=offer-details.html%3Fid%3D${offer.id}">Log in</a> or
      <a href="register.html">create an account</a> to confirm a purchase and track your cashback.
    </p>`;
    return;
  }

  wrap.innerHTML = `
    <form id="confirm-form">
      <div class="form-field">
        <label for="order-amount">Order amount you paid (₹)</label>
        <input type="number" id="order-amount" min="1" step="0.01" required>
        <p class="form-hint">Cashback is calculated on this amount using ${offer.merchant}'s current rate.</p>
      </div>
      <div id="confirm-message" class="form-message" hidden></div>
      <button type="submit" class="btn btn-accent btn-block">Confirm purchase &amp; start tracking</button>
    </form>`;

  const form = document.getElementById("confirm-form");
  const msgEl = document.getElementById("confirm-message");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById("order-amount").value);
    if (!amount || amount <= 0) {
      showFormMessage(msgEl, "Enter the amount you paid for this order.");
      return;
    }
    const cashback = offer.cashbackType === "percent" ? +(amount * offer.cashbackValue / 100).toFixed(2) : offer.cashbackValue;

    const records = getCashbackHistory(user.id);
    records.unshift({
      id: "cb_" + Date.now().toString(36),
      offerId: offer.id,
      merchant: offer.merchant,
      orderAmount: amount,
      amount: cashback,
      status: "pending",
      date: new Date().toISOString(),
    });
    localStorage.setItem("valexa_cashback_" + user.id, JSON.stringify(records));

    showFormMessage(msgEl, `Purchase confirmed. ${formatINR(cashback)} cashback is now pending in your dashboard.`, "success");
    form.reset();
  });
}
