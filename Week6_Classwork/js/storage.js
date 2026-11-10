
// ========================================
// STORAGE.JS
// Handles all localStorage operations
// ========================================

const STORAGE_KEY = "expenses";

// Get all expenses
function getExpenses() {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
        return [];
    }

    try {
        const expenses = JSON.parse(data);
        return Array.isArray(expenses) ? expenses : [];
    } catch (error) {
        console.error("Error reading expenses:", error);
        return [];
    }
}

// Save expenses
function saveExpenses(expenses) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

// Add a new expense
function addExpense(expense) {
    const expenses = getExpenses();

    expense.id = Date.now().toString() + Math.random().toString(16).slice(2);

    expenses.push(expense);

    saveExpenses(expenses);
}

// Update an existing expense
function updateExpense(id, updatedExpense) {
    const expenses = getExpenses();

    const index = expenses.findIndex(expense => expense.id === id);

    if (index === -1) {
        return false;
    }

    updatedExpense.id = id;
    expenses[index] = updatedExpense;

    saveExpenses(expenses);
    return true;
}

// Delete one expense
function deleteExpense(id) {
    const expenses = getExpenses();

    const updatedExpenses = expenses.filter(
        expense => expense.id !== id
    );

    saveExpenses(updatedExpenses);
}

// Delete all expenses
function clearExpenses() {
    localStorage.removeItem(STORAGE_KEY);
}
