const STORAGE_KEY = 'expense-tracker-expenses';

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('visible');
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.classList.remove('visible');
  }, 3000);
}

function readExpenses() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const expenses = JSON.parse(saved);
    if (!Array.isArray(expenses)) {
      throw new Error('Saved expenses are not a list.');
    }
    return expenses;
  } catch (error) {
    console.error('Unable to read saved expenses.', error);
    showToast('Saved expenses could not be loaded. Check browser storage.');
    return [];
  }
}

function saveExpenses(expenses) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    return true;
  } catch (error) {
    console.error('Unable to save expenses.', error);
    showToast('Expense could not be saved. Check browser storage settings.');
    return false;
  }
}

function formatAmount(amount) {
  return `${Number(amount).toLocaleString()} Lek`;
}

function formatDate(date) {
  const parsedDate = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsedDate.getTime())
    ? date
    : parsedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function createId() {
  return window.crypto && typeof window.crypto.randomUUID === 'function'
    ? window.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function todayAsLocalDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function setClock() {
  const clock = document.getElementById('clock');
  if (!clock) return;

  const update = () => {
    clock.textContent = new Date().toLocaleTimeString();
  };
  update();
  window.setInterval(update, 1000);
}

function setCurrentNavigation() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach((link) => {
    if (link.getAttribute('href') === currentPage) {
      link.setAttribute('aria-current', 'page');
    }
  });
}

function validateForm(form) {
  const values = {
    title: form.elements.title.value.trim(),
    amount: Number(form.elements.amount.value),
    category: form.elements.category.value,
    date: form.elements.date.value
  };
  const errors = {
    title: values.title ? '' : 'Please enter a title.',
    amount: Number.isInteger(values.amount) && values.amount > 0
      ? ''
      : 'Enter an amount greater than zero.',
    category: values.category ? '' : 'Please choose a category.',
    date: values.date ? '' : 'Please choose a date.'
  };

  let valid = true;
  Object.entries(errors).forEach(([name, message]) => {
    const errorElement = form.querySelector(`[data-for="${name}"]`);
    if (errorElement) errorElement.textContent = message;
    if (message) valid = false;
  });

  return valid ? values : null;
}

function clearFormErrors(form) {
  form.querySelectorAll('.error').forEach((element) => {
    element.textContent = '';
  });
}

function initializeHome() {
  const latestElement = document.getElementById('stat-latest');
  if (!latestElement) return;

  const count = document.getElementById('stat-count');
  const expenses = readExpenses();
  const total = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  count.textContent = String(expenses.length);
  document.getElementById('stat-total').textContent = formatAmount(total);

  const latest = expenses
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  latestElement.textContent = latest
    ? `${latest.title} · ${formatDate(latest.date)}`
    : 'none yet';
}

function initializeAddForm() {
  const form = document.getElementById('expense-form');
  if (!form) return;

  const dateInput = form.elements.date;
  dateInput.value = todayAsLocalDate();
  form.addEventListener('input', () => clearFormErrors(form));
  form.addEventListener('change', () => clearFormErrors(form));

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const values = validateForm(form);
    if (!values) return;

    const expenses = readExpenses();
    const expense = { id: createId(), ...values };
    if (!saveExpenses([expense, ...expenses])) return;

    const recent = document.getElementById('recent');
    const item = document.createElement('li');
    item.textContent = `${expense.title} — ${formatAmount(expense.amount)} · ${expense.category}`;
    document.getElementById('recent-list').prepend(item);
    recent.style.display = '';
    form.reset();
    dateInput.value = todayAsLocalDate();
    showToast('Expense added.');
  });
}

function initializeExpenses() {
  const list = document.getElementById('expense-list');
  if (!list) return;

  const search = document.getElementById('search');
  const categoryFilter = document.getElementById('filter-category');
  const modal = document.getElementById('edit-modal');
  const editForm = document.getElementById('edit-form');

  function render() {
    const expenses = readExpenses();
    const query = search.value.trim().toLocaleLowerCase();
    const category = categoryFilter.value;
    const filtered = expenses.filter((expense) => {
      const matchesTitle = expense.title.toLocaleLowerCase().includes(query);
      return matchesTitle && (!category || expense.category === category);
    });

    const total = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
    const biggest = expenses.reduce((current, expense) => (
      !current || Number(expense.amount) > Number(current.amount) ? expense : current
    ), null);
    document.getElementById('stat-total').textContent = formatAmount(total);
    document.getElementById('stat-count').textContent = String(expenses.length);
    document.getElementById('stat-average').textContent = formatAmount(
      expenses.length ? Math.round(total / expenses.length) : 0
    );
    document.getElementById('stat-biggest').textContent = biggest
      ? `${biggest.title} · ${formatAmount(biggest.amount)}`
      : 'none';

    list.replaceChildren();
    filtered.forEach((expense) => {
      const row = document.createElement('tr');
      [formatDate(expense.date), expense.title, expense.category, formatAmount(expense.amount)]
        .forEach((value, index) => {
          const cell = document.createElement('td');
          cell.textContent = value;
          if (index === 3) cell.classList.add('num');
          row.append(cell);
        });

      const actions = document.createElement('td');
      actions.className = 'actions';
      const editButton = document.createElement('button');
      editButton.type = 'button';
      editButton.className = 'btn btn-small';
      editButton.dataset.action = 'edit';
      editButton.dataset.id = expense.id;
      editButton.textContent = 'Edit';
      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'btn btn-small btn-danger';
      deleteButton.dataset.action = 'delete';
      deleteButton.dataset.id = expense.id;
      deleteButton.textContent = 'Delete';
      actions.append(editButton, deleteButton);
      row.append(actions);
      list.append(row);
    });

    document.getElementById('count').textContent = `(${filtered.length})`;
    document.getElementById('empty-message').hidden = filtered.length > 0;
    document.getElementById('clear-all').disabled = expenses.length === 0;
  }

  search.addEventListener('input', render);
  categoryFilter.addEventListener('change', render);
  document.getElementById('load-sample').addEventListener('click', () => {
    const today = todayAsLocalDate();
    const samples = [
      { id: createId(), title: 'Lunch', amount: 450, category: 'Food', date: today },
      { id: createId(), title: 'Bus ticket', amount: 80, category: 'Transport', date: today },
      { id: createId(), title: 'Notebook', amount: 220, category: 'Books', date: today }
    ];
    if (saveExpenses(samples)) {
      render();
      showToast('Sample expenses added.');
    }
  });

  document.getElementById('clear-all').addEventListener('click', () => {
    if (!window.confirm('Delete all expenses? This cannot be undone.')) return;
    if (saveExpenses([])) {
      render();
      showToast('All expenses deleted.');
    }
  });

  list.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const expenses = readExpenses();
    const expense = expenses.find((item) => item.id === button.dataset.id);
    if (!expense) return;

    if (button.dataset.action === 'edit') {
      editForm.querySelector('#edit-id').value = expense.id;
      editForm.elements.title.value = expense.title;
      editForm.elements.amount.value = expense.amount;
      editForm.elements.category.value = expense.category;
      editForm.elements.date.value = expense.date;
      clearFormErrors(editForm);
      modal.classList.add('open');
      editForm.elements.title.focus();
    } else if (button.dataset.action === 'delete'
      && window.confirm(`Delete "${expense.title}"?`)) {
      if (saveExpenses(expenses.filter((item) => item.id !== expense.id))) {
        render();
        showToast('Expense deleted.');
      }
    }
  });

  editForm.addEventListener('input', () => clearFormErrors(editForm));
  editForm.addEventListener('change', () => clearFormErrors(editForm));
  editForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const values = validateForm(editForm);
    if (!values) return;

    const id = editForm.querySelector('#edit-id').value;
    const expenses = readExpenses().map((expense) => (
      expense.id === id ? { ...expense, ...values } : expense
    ));
    if (saveExpenses(expenses)) {
      modal.classList.remove('open');
      render();
      showToast('Expense updated.');
    }
  });

  document.getElementById('cancel-edit').addEventListener('click', () => {
    modal.classList.remove('open');
  });
  modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.classList.remove('open');
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') modal.classList.remove('open');
  });

  render();
}

setClock();
setCurrentNavigation();
initializeHome();
initializeAddForm();
initializeExpenses();
