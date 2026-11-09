let addBtn = document.getElementById("addExpenseBtn");
addBtn.addEventListener("click", (event) => {

    event.preventDefault();

    let titleInput = document.getElementById('title').value;
    let amountInput = document.getElementById('amount').value;
    let categoryInput = document.getElementById('category').value;
    let dateInput = document.getElementById('date').value;

    let expenseObj = {
        title: titleInput,
        amount: Number(amountInput),
        category: categoryInput,
        date: dateInput
    };

    console.log('Objekti: ' + JSON.stringify(expenseObj));

    // 1. Read the existing expenses from localStorage (or start with an empty list)
    let allExpenses = [];
    let storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses !== null) {
        allExpenses = JSON.parse(storedExpenses);
    }

    // 2. Add the new expense to the list
    allExpenses.push(expenseObj);

    // 3. Save the whole list back to localStorage
    localStorage.setItem('expenses', JSON.stringify(allExpenses));

    console.log('Total expenses stored: ' + allExpenses.length);
    allExpenses.forEach((expense) => {
        console.log(expense.title + ' - ' + expense.amount);
    });

    // Clear the form so the next expense can be typed in
    document.getElementById('expense-form').reset();
})
