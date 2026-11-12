const listEl = document.getElementById("expense-list");
const emptyEl = document.getElementById("empty-message");
const countEl = document.getElementById("count");
const searchEl = document.getElementById("search");
const filterEl = document.getElementById("filter-category");
const modal = document.getElementById("edit-modal");
const editForm = document.getElementById("edit-form");

const emptyDefaultHtml = emptyEl.innerHTML;
let expenses = loadExpenses();

function updateStats() {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const count = expenses.length;
  document.getElementById("stat-total").textContent = formatLek(total);
  document.getElementById("stat-count").textContent = count;
  document.getElementById("stat-average").textContent = formatLek(count ? Math.round(total / count) : 0);

  const biggest = expenses.reduce((max, e) => (!max || e.amount > max.amount ? e : max), null);
  document.getElementById("stat-biggest").textContent = biggest
    ? `${biggest.title} (${formatLek(biggest.amount)})`
    : "none";
}

function render() {
  const query = searchEl.value.trim().toLowerCase();
  const category = filterEl.value;

  const visible = expenses
    .filter((e) => e.title.toLowerCase().includes(query))
    .filter((e) => !category || e.category === category)
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);

  listEl.innerHTML = visible.map((e) => `
    <tr>
      <td>${escapeHtml(e.date)}</td>
      <td>${escapeHtml(e.title)}</td>
      <td><span class="tag">${escapeHtml(e.category)}</span></td>
      <td class="num">${formatLek(e.amount)}</td>
      <td class="actions">
        <button type="button" class="btn btn-small" data-action="edit" data-id="${e.id}">Edit</button>
        <button type="button" class="btn btn-small btn-danger" data-action="delete" data-id="${e.id}">Delete</button>
      </td>
    </tr>`).join("");

  countEl.textContent = expenses.length ? `(${visible.length} of ${expenses.length})` : "";

  if (expenses.length === 0) {
    emptyEl.innerHTML = emptyDefaultHtml;
    emptyEl.style.display = "block";
  } else if (visible.length === 0) {
    emptyEl.style.display = "block";
    emptyEl.textContent = "No expenses match your search or filter.";
  } else {
    emptyEl.style.display = "none";
  }

  document.getElementById("clear-all").disabled = expenses.length === 0;
  updateStats();
}

function openEditor(id) {
  const expense = expenses.find((e) => e.id === id);
  if (!expense) return;
  document.getElementById("edit-id").value = expense.id;
  document.getElementById("edit-title").value = expense.title;
  document.getElementById("edit-amount").value = expense.amount;
  document.getElementById("edit-category").value = expense.category;
  document.getElementById("edit-date").value = expense.date;
  showFormErrors(editForm, {});
  modal.classList.add("open");
  document.getElementById("edit-title").focus();
}

function closeEditor() {
  modal.classList.remove("open");
}

// Edit and delete buttons (one listener for the whole table)
listEl.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const id = Number(button.dataset.id);

  if (button.dataset.action === "edit") {
    openEditor(id);
  } else if (button.dataset.action === "delete") {
    const expense = expenses.find((e) => e.id === id);
    if (expense && confirm(`Delete "${expense.title}"?`)) {
      expenses = expenses.filter((e) => e.id !== id);
      saveExpenses(expenses);
      render();
      showToast("Expense deleted.");
    }
  }
});

editForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const values = {
    title: document.getElementById("edit-title").value,
    amount: document.getElementById("edit-amount").value,
    category: document.getElementById("edit-category").value,
    date: document.getElementById("edit-date").value,
  };

  const errors = validateExpense(values);
  showFormErrors(editForm, errors);
  if (Object.keys(errors).length > 0) return;

  const id = Number(document.getElementById("edit-id").value);
  const expense = expenses.find((e) => e.id === id);
  if (!expense) return;

  expense.title = values.title.trim();
  expense.amount = Number(values.amount);
  expense.category = values.category;
  expense.date = values.date;

  saveExpenses(expenses);
  closeEditor();
  render();
  showToast("Changes saved.");
});

document.getElementById("cancel-edit").addEventListener("click", closeEditor);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeEditor();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeEditor();
});

searchEl.addEventListener("input", render);
filterEl.addEventListener("change", render);

document.getElementById("clear-all").addEventListener("click", () => {
  if (expenses.length && confirm("Delete all expenses? This cannot be undone.")) {
    expenses = [];
    saveExpenses(expenses);
    render();
    showToast("All expenses deleted.");
  }
});

document.getElementById("load-sample").addEventListener("click", () => {
  const today = todayISO();
  const base = Date.now();
  const sample = [
    { title: "Coffee with friends", amount: 350, category: "Food", date: today },
    { title: "Bus card top-up", amount: 1000, category: "Transport", date: today },
    { title: "Algorithms textbook", amount: 2800, category: "Books", date: today },
    { title: "Monthly rent share", amount: 15000, category: "Rent", date: today },
    { title: "Cinema ticket", amount: 600, category: "Fun", date: today },
  ].map((e, i) => ({ id: base + i, ...e }));

  expenses = expenses.concat(sample);
  saveExpenses(expenses);
  render();
  showToast("Sample data loaded.");
});

render();
