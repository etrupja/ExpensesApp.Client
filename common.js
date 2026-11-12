// Shared helpers used by every page.
const STORAGE_KEY = "expenses";

function loadExpenses() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
}

function saveExpenses(expenses) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

function formatLek(amount) {
  return Number(amount).toLocaleString("en-US") + " Lek";
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function todayISO() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

// Returns an object like { title: "message" }. Empty object means valid.
function validateExpense(values) {
  const errors = {};
  const title = values.title.trim();
  const amount = Number(values.amount);

  if (title.length < 2) {
    errors.title = "Enter a title with at least 2 characters.";
  } else if (title.length > 60) {
    errors.title = "Keep the title under 60 characters.";
  }

  if (values.amount === "" || !Number.isFinite(amount) || amount < 1) {
    errors.amount = "Enter an amount of 1 Lek or more.";
  }

  if (!values.category) {
    errors.category = "Choose a category.";
  }

  if (!values.date) {
    errors.date = "Choose a date.";
  }

  return errors;
}

function showFormErrors(form, errors) {
  form.querySelectorAll(".error").forEach((el) => {
    const message = errors[el.dataset.for] || "";
    el.textContent = message;
    el.closest(".field").classList.toggle("invalid", Boolean(message));
  });
}

let toastTimer;
function showToast(message, isError) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.toggle("error", Boolean(isError));
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
}

function startClock() {
  const clock = document.getElementById("clock");
  if (!clock) return;
  const tick = () => { clock.textContent = new Date().toLocaleTimeString("en-GB"); };
  tick();
  setInterval(tick, 1000);
}

function markActiveNav() {
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach((link) => {
    if (link.getAttribute("href") === current) link.classList.add("active");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  startClock();
  markActiveNav();
});
