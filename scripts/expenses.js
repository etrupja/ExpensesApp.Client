document.addEventListener('DOMContentLoaded', () =>{
    // 1. Load all elements from localstorage
    let allExpenses = [];
    let allExpensesLocalStorage = localStorage.getItem('expenses');
    if(allExpensesLocalStorage !== null){
        allExpenses = JSON.parse(allExpensesLocalStorage);
    }

    let tbody = document.getElementById('expense-list');

    let statTotal = document.getElementById('stat-total');
    let total = 0;

    allExpenses.forEach((item) => {
        total += Number.parseInt(item.amount);

        let tr = document.createElement('tr');

        let tdDate = document.createElement('td');
        tdDate.innerText = item.date;

        let tdTitle = document.createElement('td');
        tdTitle.innerText = item.title;

        let tdCategory = document.createElement('td');
        tdCategory.innerText = item.category;

        let tdAmount = document.createElement('td');
        tdAmount.innerText = item.amount;

        let tdActions = document.createElement('td');
        tdActions.innerHTML = '<button style="color:red"> Click here </button>'

        tr.append(tdDate);
        tr.append(tdTitle);
        tr.append(tdCategory);
        tr.append(tdAmount);
        tr.append(tdActions);

        tbody.append(tr);
    })

    statTotal.innerText = total + ' Leke';
})