let addBtn = document.getElementById("addExpenseBtn");
addBtn.addEventListener("click", (event) => {

    event.preventDefault();

    // 1. Marr te dhenat nga forma
    let titleInput = document.getElementById('title').value;
    let amountInput = document.getElementById('amount').value;
    let categoryInput = document.getElementById('category').value;
    let dateInput = document.getElementById('date').value;

    // 2. Krijo object

    let newExpenseObj = {
        title: titleInput,
        amount: amountInput,
        category: categoryInput,
        date: dateInput
    };


    // 3. Marrim elementet ekzistues
    let allExpenses = [];
    let allExpensesLocalStorage = localStorage.getItem('expenses');
    if(allExpensesLocalStorage !== null){
        allExpenses = JSON.parse(allExpensesLocalStorage)
    }

    // 4. Add to array
    allExpenses.push(newExpenseObj);

    // 5. Save
    localStorage.setItem('expenses', JSON.stringify(allExpenses));


    console.log(allExpenses);

})