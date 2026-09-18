renderLayout("offers");

const categorySelect = document.getElementById("category-filter");
VALEXA_CATEGORIES.forEach((cat) => {
  categorySelect.insertAdjacentHTML("beforeend", `<option value="${cat.id}">${cat.name}</option>`);
});

const params = new URLSearchParams(window.location.search);
const initialCategory = params.get("category") || "";
if (initialCategory) categorySelect.value = initialCategory;

const searchInput = document.getElementById("offer-search");
const resultsWrap = document.getElementById("offer-results");
const emptyState = document.getElementById("empty-state");

function renderOffers() {
  const results = searchOffers({ query: searchInput.value, categoryId: categorySelect.value });
  resultsWrap.innerHTML = "";
  emptyState.hidden = results.length > 0;

  results.forEach((offer) => {
    resultsWrap.insertAdjacentHTML("beforeend", `
      <a class="offer-card" href="offer-details.html?id=${offer.id}">
        <span class="tag">${getCategoryById(offer.category).name}</span>
        <span class="merchant">${offer.merchant}</span>
        <span class="cashback-value">${formatCashback(offer)}</span>
        <span class="headline">${offer.headline}</span>
      </a>`);
  });
}

searchInput.addEventListener("input", renderOffers);
categorySelect.addEventListener("change", renderOffers);
renderOffers();
