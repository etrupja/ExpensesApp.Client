const form = document.getElementById("expense-form");
const recentCard = document.getElementById("recent");
const recentList = document.getElementById("recent-list");

document.getElementById("date").value = todayISO();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const values = {
    title: document.getElementById("title").value,
    amount: document.getElementById("amount").value,
    category: document.getElementById("category").value,
    date: document.getElementById("date").value,
  };

  const errors = validateExpense(values);
  showFormErrors(form, errors);

  if (Object.keys(errors).length > 0) {
    showToast("Fix the highlighted fields.", true);
    return;
  }

  const expense = {
    id: Date.now(),
    title: values.title.trim(),
    amount: Number(values.amount),
    category: values.category,
    date: values.date,
  };

  const expenses = loadExpenses();
  expenses.push(expense);
  saveExpenses(expenses);

  const item = document.createElement("li");
  item.textContent = `${expense.title}: ${formatLek(expense.amount)} (${expense.category}, ${expense.date})`;
  recentList.prepend(item);
  recentCard.style.display = "block";

  form.reset();
  document.getElementById("date").value = todayISO();
  showFormErrors(form, {});
  document.getElementById("title").focus();
  showToast("Expense added.");
});
