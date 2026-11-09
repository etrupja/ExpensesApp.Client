let addBtn = document.getElementById("addExpenseBtn");
addBtn.addEventListener("click", (event) => {

    event.preventDefault();


    let titleInput = document.getElementById('title').value;
    let amountInput = document.getElementById('amount').value;
    let categoryInput = document.getElementById('category').value;
    let dateInput = document.getElementById('date').value;

    console.log('titleInput - '+titleInput);
    console.log('amnountInput - '+amountInput);
    console.log('categoryInput - '+categoryInput);
    console.log('dateInput - '+dateInput);

    let expenseObj = {
        title: titleInput,
        amount: amountInput,
        category: categoryInput,
        date: dateInput
    };

    expenseObj.amount +=2;

    // console.log(expenseObj);
    console.log('Objekti: '+ JSON.stringify(expenseObj));


    localStorage.setItem('expenses', JSON.stringify(expenseObj));

    let expesnseLocal = localStorage.getItem('expenses');
    console.log('Data: '+ expesnseLocal);
    console.log(JSON.parse(expesnseLocal));


    let allExpenses = [];
    for(let i=0; i<allExpenses.length; i++){
        let expense = allExpenses[i];
        console.log(expense.amount);
    }

})