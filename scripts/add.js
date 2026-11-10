let addBtn = document.getElementById("addExpenseBtn");
addBtn.addEventListener("click", (event) => {

    event.preventDefault();

    // 1. Pergatitja e te dhenave
    let titleInput = document.getElementById('title').value;
    let amountInput = document.getElementById('amount').value;
    let categoryInput = document.getElementById('category').value;
    let dateInput = document.getElementById('date').value;

    // 2. Krijimi i objektit
     let newExpenseObj = {
        title: titleInput,
        amount: amountInput,
        category: categoryInput,
        date: dateInput
    };

    console.log(newExpenseObj);

    // 3. Leximi i te dhenave existuese
    let allExpenses = [];
    let expensesInLocalStorage = localStorage.getItem('expenses');
    if(expensesInLocalStorage !== null){
        allExpenses = JSON.parse(expensesInLocalStorage)
    }


    // 4. Shtohet objekti i ri te array i objekteve
    allExpenses.push(newExpenseObj);

    // 5. Perditeso localStorage
    localStorage.setItem('expenses', JSON.stringify(allExpenses));

})