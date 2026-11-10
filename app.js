$(function () {
  var expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  function save() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }

  function updateClock() {
    $("#clock").text(new Date().toLocaleTimeString());
  }

  function showList() {
    var search = ($("#search").val() || "").toLowerCase();
    var category = $("#filter-category").val() || "";
    var list = $("#expense-list").empty();
    var total = 0;
    var shown = 0;

    for (var i = 0; i < expenses.length; i++) {
      var expense = expenses[i];
      total += Number(expense.amount);

      if (expense.title.toLowerCase().indexOf(search) === -1 ||
          (category && expense.category !== category)) {
        continue;
      }

      shown++;
      var row = $("<tr>");
      row.append($("<td>").text(expense.date));
      row.append($("<td>").text(expense.title));
      row.append($("<td>").text(expense.category));
      row.append($("<td>").text(expense.amount + " Lek"));

      var edit = $("<button>").addClass("btn btn-primary btn-sm me-1")
        .text("Edit").click((function (item) {
          return function () {
            $("#edit-id").val(expenses.indexOf(item));
            $("#edit-title").val(item.title);
            $("#edit-amount").val(item.amount);
            $("#edit-category").val(item.category);
            $("#edit-date").val(item.date);
            $("#edit-modal").show();
          };
        }(expense)));

      var remove = $("<button>").addClass("btn btn-danger btn-sm")
        .text("Delete").click((function (item) {
          return function () {
            expenses.splice(expenses.indexOf(item), 1);
            save();
            showList();
          };
        }(expense)));

      row.append($("<td>").append(edit, remove));
      list.append(row);
    }

    $("#count").text("(" + shown + ")");
    $("#stat-count").text(expenses.length);
    $("#stat-total").text(total + " Lek");
    $("#stat-average").text(expenses.length ?
      Math.round(total / expenses.length) + " Lek" : "0 Lek");
    if (expenses.length > 0) {
      var biggest = expenses[0];
      for (var j = 1; j < expenses.length; j++) {
        if (Number(expenses[j].amount) > Number(biggest.amount)) {
          biggest = expenses[j];
        }
      }
      $("#stat-biggest").text(biggest.title + " (" + biggest.amount + " Lek)");
    } else {
      $("#stat-biggest").text("none");
    }
    $("#empty-message").toggle(shown === 0);
  }

  $("#expense-form").submit(function (event) {
    event.preventDefault();

    var title = $("#title").val().trim();
    var amount = $("#amount").val();
    var category = $("#category").val();
    var date = $("#date").val();

    if (!title || !amount || !category || !date) {
      alert("Please fill in all fields.");
      return;
    }

    expenses.push({
      title: title,
      amount: Number(amount),
      category: category,
      date: date
    });
    save();

    $("#recent-list").prepend($("<li>").text(title + " - " + amount + " Lek"));
    $("#recent").show();
    $("#expense-form")[0].reset();
    $("#date").val(new Date().toISOString().slice(0, 10));
    alert("Expense added.");
  });

  $("#search, #filter-category").on("input change", showList);

  $("#load-sample").click(function () {
    expenses.push({
      title: "Coffee",
      amount: 200,
      category: "Food",
      date: new Date().toISOString().slice(0, 10)
    });
    save();
    showList();

    if ($("#stat-latest").length && expenses.length > 0) {
      $("#stat-count").text(expenses.length);
      $("#stat-latest").text(expenses[expenses.length - 1].title);
    }
  });

  $("#clear-all").click(function () {
    expenses = [];
    save();
    showList();
  });

  $("#cancel-edit").click(function () {
    $("#edit-modal").hide();
  });

  $("#edit-form").submit(function (event) {
    event.preventDefault();
    var index = $("#edit-id").val();

    expenses[index] = {
      title: $("#edit-title").val(),
      amount: Number($("#edit-amount").val()),
      category: $("#edit-category").val(),
      date: $("#edit-date").val()
    };

    save();
    showList();
    $("#edit-modal").hide();
  });

  $("#date").val(new Date().toISOString().slice(0, 10));
  updateClock();
  setInterval(updateClock, 1000);
  showList();
});
