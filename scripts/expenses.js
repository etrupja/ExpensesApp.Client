document.addEventListener('DOMContentLoaded', () => {
    // 1. Merr expenses nga localStorage
    let allExpsenses = [];

    let allExpsensesInLocalStorage = localStorage.getItem('expenses');
    if(allExpsensesInLocalStorage !== null){
        allExpsenses = JSON.parse(allExpsensesInLocalStorage);
    }

    let tblBody = document.getElementById('expense-list');
    let statsTotal = document.getElementById('stat-total');
    let statsTotalValue = 0;

    allExpsenses.forEach((el) => {
        console.log(el);

        let tblRow = document.createElement('tr');

        //<th scope="col">Date</th>
        let dateTd = document.createElement('td');
        dateTd.textContent = el.date;

        //<td scope="col">Title</th>
        let titleTd = document.createElement('td');
        titleTd.textContent = el.title;

        //<th scope="col">Category</th>
        let categoryTd = document.createElement('td');
        categoryTd.textContent = el.category;

        //<th scope="col" class="text-end">Amount</th>
        let amountTd = document.createElement('td');
        amountTd.textContent = el.amount;

        //<th scope="col" class="text-end">Actions</th>
         let actionTd = document.createElement('td');
        actionTd.innerHTML = '<button style="color:red"> Kliko </button>';


        tblRow.append(dateTd);
        tblRow.append(titleTd);
        tblRow.append(categoryTd);
        tblRow.append(amountTd);
        tblRow.append(actionTd);

        tblBody.append(tblRow);

        statsTotalValue += Number.parseInt(el.amount);
    })

    statsTotal.innerText = statsTotalValue + ' Leke'

})