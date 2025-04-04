// app.js

let transactions = [];
let budgets = [];
let investments = [];
let currencySymbol = '₹';

// DOM Elements
const incomeDisplay = document.getElementById('totalIncome');
const expenseDisplay = document.getElementById('totalExpense');
const savingsDisplay = document.getElementById('currentSavings');
const transactionTable = document.getElementById('transactionTable');
const budgetList = document.getElementById('budgetList');
const expenseForm = document.getElementById('expenseForm');
const budgetForm = document.getElementById('budgetForm');
const darkModeToggle = document.getElementById('darkModeToggle');
const currencySelect = document.getElementById('currency');
const searchInput = document.getElementById('search');
const investmentForm = document.getElementById('investmentForm');
const investmentList = document.getElementById('investmentList');

// Dashboard Update
function updateDashboard() {
  const income = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
  incomeDisplay.textContent = `${currencySymbol}${income}`;
  expenseDisplay.textContent = `${currencySymbol}${expense}`;
  savingsDisplay.textContent = `${currencySymbol}${income - expense}`;
}

// Render Transactions
function renderTransactions(filtered = transactions) {
  transactionTable.innerHTML = '';
  filtered.forEach((t, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${t.title}</td>
      <td>${currencySymbol}${t.amount}</td>
      <td>${t.date}</td>
      <td>${t.category}</td>
      <td>${t.payment}</td>
      <td><button onclick="deleteTransaction(${index})">🗑️</button></td>
    `;
    transactionTable.appendChild(row);
  });
}

// Delete Transaction
function deleteTransaction(index) {
  transactions.splice(index, 1);
  saveData();
  updateDashboard();
  renderTransactions();
}

// Render Budgets
function renderBudgets() {
  budgetList.innerHTML = '';
  budgets.forEach(b => {
    const li = document.createElement('li');
    li.textContent = `${b.category}: ${currencySymbol}${b.amount}`;
    budgetList.appendChild(li);
  });
}

// Save Data
function saveData() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
  localStorage.setItem('budgets', JSON.stringify(budgets));
  localStorage.setItem('investments', JSON.stringify(investments));
}

// Load Data
function loadData() {
  const savedTxns = localStorage.getItem('transactions');
  const savedBudgets = localStorage.getItem('budgets');
  const savedInvestments = localStorage.getItem('investments');
  transactions = savedTxns ? JSON.parse(savedTxns) : [];
  budgets = savedBudgets ? JSON.parse(savedBudgets) : [];
  investments = savedInvestments ? JSON.parse(savedInvestments) : [];
}

// Expense Form Submission
expenseForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const date = document.getElementById('date').value;
  const category = document.getElementById('category').value;
  const payment = document.getElementById('paymentMethod').value;

  transactions.push({ title, amount, date, category, payment });
  saveData();
  updateDashboard();
  renderTransactions();
  expenseForm.reset();
});

// Budget Form Submission
budgetForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const category = document.getElementById('budgetCategory').value;
  const amount = parseFloat(document.getElementById('budgetAmount').value);
  budgets.push({ category, amount });
  saveData();
  renderBudgets();
  budgetForm.reset();
});

// Dark Mode Toggle
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

// Currency Selector
currencySelect.addEventListener('change', () => {
  const selected = currencySelect.value;
  currencySymbol = selected === 'INR' ? '₹' : selected === 'USD' ? '$' : '€';
  updateDashboard();
  renderTransactions();
  renderBudgets();
  renderInvestments();
});

// Search Transactions
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const filtered = transactions.filter(t =>
    t.title.toLowerCase().includes(query) ||
    t.category.toLowerCase().includes(query) ||
    t.payment.toLowerCase().includes(query)
  );
  renderTransactions(filtered);
});

// ===== Investment Section Starts Here =====

// Calculate Compound Interest
function calculateCompoundInterest(principal, rate, time) {
  return principal * Math.pow(1 + rate / 100, time) - principal;
}

// Render Investments
function renderInvestments() {
  investmentList.innerHTML = '';
  const now = new Date();
  investments.forEach((inv, index) => {
    const start = new Date(inv.date);
    const yearsPassed = (now - start) / (1000 * 60 * 60 * 24 * 365);
    const interestEarned = calculateCompoundInterest(inv.principal, inv.rate, yearsPassed);

    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${inv.name}</strong>: 
      Principal ${currencySymbol}${inv.principal}, 
      Rate ${inv.rate}%, 
      Time ${inv.years} years, 
      Interest Earned: ${currencySymbol}${interestEarned.toFixed(2)} 
      <button onclick="deleteInvestment(${index})" style="margin-left:10px;">🗑️</button>
    `;
    investmentList.appendChild(li);
  });
}

// Delete Investment
function deleteInvestment(index) {
  investments.splice(index, 1);
  saveData();
  renderInvestments();
}

// Investment Form Submission
investmentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('investmentName').value;
  const principal = parseFloat(document.getElementById('principalAmount').value);
  const rate = parseFloat(document.getElementById('interestRate').value);
  const years = parseFloat(document.getElementById('investmentYears').value);
  const date = new Date().toISOString();

  investments.push({ name, principal, rate, years, date });
  saveData();
  renderInvestments();
  investmentForm.reset();
});

// ===== Investment Section Ends Here =====

// Initial Load
loadData();
updateDashboard();
renderTransactions();
renderBudgets();
renderInvestments();