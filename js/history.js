renderLayout("");
const user = requireAuth();

if (user) {
  const filterEl = document.getElementById("status-filter");
  const tbody = document.getElementById("history-rows");
  const emptyEl = document.getElementById("history-empty");
  const allRecords = getCashbackHistory(user.id);

  function render() {
    const filter = filterEl.value;
    const records = filter ? allRecords.filter((r) => r.status === filter) : allRecords;
    tbody.innerHTML = "";
    emptyEl.hidden = records.length > 0;

    records.forEach((r) => {
      tbody.insertAdjacentHTML("beforeend", `
        <tr>
          <td>${r.merchant}</td>
          <td>${formatINR(r.orderAmount)}</td>
          <td>${formatINR(r.amount)}</td>
          <td><span class="status-pill status-${r.status}">${r.status}</span></td>
          <td>${new Date(r.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
        </tr>`);
    });
  }

  filterEl.addEventListener("change", render);
  render();
}
