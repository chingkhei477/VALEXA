renderLayout("");
const user = requireAuth();

if (user) {
  document.getElementById("dash-greeting").textContent = `Welcome back, ${user.name.split(" ")[0]}`;

  const summary = cashbackSummary(user.id);
  document.getElementById("stat-pending").textContent = formatINR(summary.pending);
  document.getElementById("stat-confirmed").textContent = formatINR(summary.confirmed);
  document.getElementById("stat-credited").textContent = formatINR(summary.credited);
  document.getElementById("stat-total").textContent = summary.total;

  const records = getCashbackHistory(user.id).slice(0, 5);
  const tbody = document.getElementById("recent-rows");
  document.getElementById("dash-empty").hidden = records.length > 0;

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
