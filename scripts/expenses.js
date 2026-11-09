// Runs when the page has finished loading
document.addEventListener('DOMContentLoaded', () => {

    // 1. Read the expenses from localStorage
    let allExpenses = [];
    let storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses !== null) {
        allExpenses = JSON.parse(storedExpenses);
    }

    console.log('Loaded expenses: ' + allExpenses.length);

    let expenseList = document.getElementById('expense-list');
    let emptyMessage = document.getElementById('empty-message');
    let countBadge = document.getElementById('count');

    // 2. Show the empty message if there is nothing to display
    if (allExpenses.length === 0) {
        emptyMessage.style.display = 'block';
        countBadge.textContent = '0';
        return;
    }

    emptyMessage.style.display = 'none';
    countBadge.textContent = allExpenses.length;

    // 3. Create one table row for every expense
    let total = 0;
    let biggest = allExpenses[0];

    allExpenses.forEach((expense) => {
        let amount = Number(expense.amount);

        total += amount;
        if (amount > Number(biggest.amount)) {
            biggest = expense;
        }

        let row = document.createElement('tr');

        let dateCell = document.createElement('td');
        dateCell.textContent = expense.date;

        let titleCell = document.createElement('td');
        titleCell.textContent = expense.title;

        let categoryCell = document.createElement('td');
        categoryCell.textContent = expense.category;

        let amountCell = document.createElement('td');
        amountCell.classList.add('text-end');
        amountCell.textContent = amount + ' Lek';

        let actionsCell = document.createElement('td');
        actionsCell.classList.add('text-end');

        row.appendChild(dateCell);
        row.appendChild(titleCell);
        row.appendChild(categoryCell);
        row.appendChild(amountCell);
        row.appendChild(actionsCell);

        expenseList.appendChild(row);
    });

    // 4. Update the quick stats at the top of the page
    document.getElementById('stat-total').textContent = total + ' Lek';
    document.getElementById('stat-count').textContent = allExpenses.length;
    document.getElementById('stat-average').textContent = Math.round(total / allExpenses.length) + ' Lek';
    document.getElementById('stat-biggest').textContent = biggest.title + ' (' + biggest.amount + ' Lek)';
});
