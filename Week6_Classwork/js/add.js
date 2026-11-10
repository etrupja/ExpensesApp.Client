
// ========================================
// ADD.JS
// Add and validate expenses
// ========================================

const expenseForm = document.getElementById("expense-form");

// Set today's date automatically
const dateInput = document.getElementById("date");

if (dateInput) {
    dateInput.value = new Date().toISOString().split("T")[0];
}

// Display validation errors
function showError(field, message) {
    const errorElement = document.querySelector(
        '.error[data-for="' + field + '"]'
    );

    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Clear validation errors
function clearErrors() {
    document.querySelectorAll(".error").forEach(function (error) {
        error.textContent = "";
    });
}

// Validate form
function validateExpense(title, amount, category, date) {
    let valid = true;

    if (title.trim() === "") {
        showError("title", "Please enter an expense title.");
        valid = false;
    }

    if (amount === "" || Number(amount) <= 0 ||
        !Number.isInteger(Number(amount))) {
        showError("amount", "Enter a valid positive whole number.");
        valid = false;
    }

    if (category === "") {
        showError("category", "Please choose a category.");
        valid = false;
    }

    if (date === "") {
        showError("date", "Please select a date.");
        valid = false;
    }

    return valid;
}

// Add expense
expenseForm.addEventListener("submit", function (event) {
    event.preventDefault();

    clearErrors();

    const title = document.getElementById("title").value;
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    if (!validateExpense(title, amount, category, date)) {
        return;
    }

    const expense = {
        title: title.trim(),
        amount: Number(amount),
        category: category,
        date: date
    };

    // Save expense to localStorage
    addExpense(expense);

    // Display recently added expense
    const recentSection = document.getElementById("recent");
    const recentList = document.getElementById("recent-list");

    const listItem = document.createElement("li");

    listItem.textContent =
        expense.title + " - " +
        expense.amount.toLocaleString() + " Lek (" +
        expense.category + ")";

    recentList.appendChild(listItem);

    recentSection.style.display = "block";

    // Reset form
    expenseForm.reset();

    dateInput.value = new Date().toISOString().split("T")[0];

    showToast("Expense added successfully!");
});
