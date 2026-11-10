
// ========================================
// EXPENSES.JS
// Manage and display all expenses
// ========================================

const expenseList = document.getElementById("expense-list");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("filter-category");
const emptyMessage = document.getElementById("empty-message");


// ========================================
// DISPLAY EXPENSES
// ========================================

function displayExpenses() {

    const expenses = getExpenses();

    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    // Filter expenses
    const filteredExpenses = expenses.filter(function (expense) {

        const matchesTitle = expense.title.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "" ||
            expense.category === selectedCategory;

        return matchesTitle && matchesCategory;
    });

    // Clear existing table rows
    expenseList.innerHTML = "";

    // Display empty message
    if (filteredExpenses.length === 0) {

        if (expenses.length === 0) {
            emptyMessage.style.display = "block";
        } else {
            emptyMessage.textContent = "No matching expenses found.";
            emptyMessage.style.display = "block";
        }

    } else {
        emptyMessage.style.display = "none";
    }

    // Update count
    document.getElementById("count").textContent =
        "(" + filteredExpenses.length + ")";

    // Create table rows
    filteredExpenses.forEach(function (expense) {

        const row = document.createElement("tr");

        const dateCell = document.createElement("td");
        const titleCell = document.createElement("td");
        const categoryCell = document.createElement("td");
        const amountCell = document.createElement("td");
        const actionsCell = document.createElement("td");

        dateCell.textContent = expense.date;
        titleCell.textContent = expense.title;
        categoryCell.textContent = expense.category;

        amountCell.textContent =
            Number(expense.amount).toLocaleString() + " Lek";

        amountCell.className = "num";

        actionsCell.className = "actions";

        // Edit button
        const editButton = document.createElement("button");

        editButton.textContent = "Edit";
        editButton.className = "btn";
        editButton.type = "button";
        editButton.dataset.action = "edit";
        editButton.dataset.id = expense.id;

        // Delete button
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "btn btn-danger";
        deleteButton.type = "button";
        deleteButton.dataset.action = "delete";
        deleteButton.dataset.id = expense.id;

        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);

        row.appendChild(dateCell);
        row.appendChild(titleCell);
        row.appendChild(categoryCell);
        row.appendChild(amountCell);
        row.appendChild(actionsCell);

        expenseList.appendChild(row);
    });

    updateStatistics(expenses);
}


// ========================================
// STATISTICS
// ========================================

function updateStatistics(expenses) {

    let total = 0;
    let biggest = null;

    expenses.forEach(function (expense) {

        const amount = Number(expense.amount);

        total += amount;

        if (biggest === null || amount > Number(biggest.amount)) {
            biggest = expense;
        }
    });

    const count = expenses.length;

    const average = count > 0 ? total / count : 0;

    document.getElementById("stat-total").textContent =
        total.toLocaleString() + " Lek";

    document.getElementById("stat-count").textContent = count;

    document.getElementById("stat-average").textContent =
        Math.round(average).toLocaleString() + " Lek";

    if (biggest === null) {
        document.getElementById("stat-biggest").textContent = "none";
    } else {
        document.getElementById("stat-biggest").textContent =
            biggest.title + " (" +
            Number(biggest.amount).toLocaleString() + " Lek)";
    }
}


// ========================================
// SEARCH AND CATEGORY FILTER
// ========================================

searchInput.addEventListener("input", displayExpenses);

categoryFilter.addEventListener("change", displayExpenses);


// ========================================
// EDIT EXPENSE
// ========================================

function openEditModal(id) {

    const expenses = getExpenses();

    const expense = expenses.find(function (item) {
        return item.id === id;
    });

    if (!expense) {
        return;
    }

    document.getElementById("edit-id").value = expense.id;
    document.getElementById("edit-title").value = expense.title;
    document.getElementById("edit-amount").value = expense.amount;
    document.getElementById("edit-category").value = expense.category;
    document.getElementById("edit-date").value = expense.date;

    document.getElementById("edit-modal").classList.add("open");
}

function closeEditModal() {
    document.getElementById("edit-modal").classList.remove("open");

    document.querySelectorAll("#edit-form .error").forEach(function (error) {
        error.textContent = "";
    });
}

// Cancel editing
document.getElementById("cancel-edit").addEventListener("click", function () {
    closeEditModal();
});

// Close modal when clicking outside
document.getElementById("edit-modal").addEventListener("click", function (event) {
    if (event.target === this) {
        closeEditModal();
    }
});

// Close modal with Escape
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeEditModal();
    }
});

// Save edited expense
document.getElementById("edit-form").addEventListener("submit", function (event) {

    event.preventDefault();

    const title = document.getElementById("edit-title").value;
    const amount = document.getElementById("edit-amount").value;
    const category = document.getElementById("edit-category").value;
    const date = document.getElementById("edit-date").value;

    // Clear old errors
    document.querySelectorAll("#edit-form .error").forEach(function (error) {
        error.textContent = "";
    });

    let valid = true;

    if (title.trim() === "") {
        document.querySelector('#edit-form .error[data-for="title"]')
            .textContent = "Please enter a title.";
        valid = false;
    }

    if (amount === "" || Number(amount) <= 0 ||
        !Number.isInteger(Number(amount))) {
        document.querySelector('#edit-form .error[data-for="amount"]')
            .textContent = "Enter a valid positive whole number.";
        valid = false;
    }

    if (category === "") {
        document.querySelector('#edit-form .error[data-for="category"]')
            .textContent = "Please choose a category.";
        valid = false;
    }

    if (date === "") {
        document.querySelector('#edit-form .error[data-for="date"]')
            .textContent = "Please select a date.";
        valid = false;
    }

    if (!valid) {
        return;
    }

    const id = document.getElementById("edit-id").value;

    const updatedExpense = {
        title: title.trim(),
        amount: Number(amount),
        category: category,
        date: date
    };

    updateExpense(id, updatedExpense);

    closeEditModal();

    displayExpenses();

    showToast("Expense updated successfully!");
});


// ========================================
// DELETE EXPENSE
// ========================================

expenseList.addEventListener("click", function (event) {

    const button = event.target.closest("button[data-action]");

    if (!button) {
        return;
    }

    const id = button.dataset.id;

    if (button.dataset.action === "edit") {
        openEditModal(id);
    }

    if (button.dataset.action === "delete") {

        const confirmed = confirm("Are you sure you want to delete this expense?");

        if (confirmed) {
            deleteExpense(id);

            displayExpenses();

            showToast("Expense deleted successfully!");
        }
    }
});


// ========================================
// DELETE ALL EXPENSES
// ========================================

document.getElementById("clear-all").addEventListener("click", function () {

    const expenses = getExpenses();

    if (expenses.length === 0) {
        showToast("There are no expenses to delete.");
        return;
    }

    const confirmed = confirm(
        "Are you sure you want to delete ALL expenses?"
    );

    if (confirmed) {

        clearExpenses();

        displayExpenses();

        showToast("All expenses deleted.");
    }
});


// ========================================
// LOAD SAMPLE DATA
// ========================================

document.getElementById("load-sample").addEventListener("click", function () {

    if (getExpenses().length > 0) {
        showToast("Sample data can only be loaded into an empty list.");
        return;
    }

    const today = new Date();

    function daysAgo(days) {
        const date = new Date(today);
        date.setDate(date.getDate() - days);

        return date.toISOString().split("T")[0];
    }

    const sampleExpenses = [
        {
            title: "Coffee",
            amount: 150,
            category: "Food",
            date: daysAgo(0)
        },
        {
            title: "Bus ticket",
            amount: 40,
            category: "Transport",
            date: daysAgo(1)
        },
        {
            title: "University books",
            amount: 1200,
            category: "Books",
            date: daysAgo(2)
        },
        {
            title: "Lunch",
            amount: 450,
            category: "Food",
            date: daysAgo(3)
        },
        {
            title: "Cinema",
            amount: 600,
            category: "Fun",
            date: daysAgo(4)
        }
    ];

    sampleExpenses.forEach(function (expense) {
        addExpense(expense);
    });

    displayExpenses();

    showToast("Sample expenses loaded!");
});


// ========================================
// INITIALIZE PAGE
// ========================================

displayExpenses();
