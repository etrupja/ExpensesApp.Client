
// ========================================
// INDEX.JS
// Homepage dashboard statistics
// ========================================

function updateDashboard() {
    const expenses = getExpenses();

    const countElement = document.getElementById("stat-count");
    const totalElement = document.getElementById("stat-total");
    const latestElement = document.getElementById("stat-latest");

    // Calculate total expenses
    let total = 0;

    expenses.forEach(function (expense) {
        total += Number(expense.amount);
    });

    // Display number of expenses
    countElement.textContent = expenses.length;

    // Display total spent
    totalElement.textContent = total.toLocaleString() + " Lek";

    // Find most recent expense
    if (expenses.length === 0) {
        latestElement.textContent = "none yet";
    } else {
        const latest = expenses.reduce(function (newest, expense) {
            return new Date(expense.date) > new Date(newest.date)
                ? expense
                : newest;
        });

        latestElement.textContent = latest.title;
    }
}

updateDashboard();
