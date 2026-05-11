import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CATEGORY_OPTIONS = [
  'Food',
  'Transportation',
  'Entertainment',
  'Utilities',
  'Other'
];

const normalizeKey = (value) => value.trim().toLowerCase();

const createExpenseRecord = (description, amount, category) => {
  const now = new Date();
  const detail = {
    amount: parseFloat(amount),
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: now.toLocaleDateString(),
    day: now.toLocaleDateString(undefined, { weekday: 'long' })
  };

  return {
    id: Date.now(),
    description: description.trim(),
    amount: parseFloat(amount),
    category,
    date: detail.date,
    time: detail.time,
    day: detail.day,
    occurrences: 1,
    lastAddedAt: now.toISOString(),
    occurrenceDetails: [detail]
  };
};

const Expenses = () => {
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [duplicateRequest, setDuplicateRequest] = useState(null);

  // Save expenses to localStorage whenever expenses change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    window.dispatchEvent(new Event('expensesUpdated'));
  }, [expenses]);

  const addExpense = (e) => {
    e.preventDefault();
    if (!description || !amount || !category) return;

    const now = new Date();
    const todayDate = now.toLocaleDateString();
    const normalizedDescription = normalizeKey(description);
    const normalizedCategory = normalizeKey(category);

    const existingExpense = expenses.find((expense) =>
      normalizeKey(expense.description) === normalizedDescription &&
      normalizeKey(expense.category) === normalizedCategory &&
      expense.date === todayDate
    );

    const newExpenseData = {
      amount: parseFloat(amount),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      day: now.toLocaleDateString(undefined, { weekday: 'long' }),
      date: todayDate,
      lastAddedAt: now.toISOString()
    };

    if (existingExpense) {
      setDuplicateRequest({
        existingExpense,
        newExpenseData,
        description: description.trim(),
        category,
        amount: parseFloat(amount)
      });
      return;
    }

    setExpenses([...expenses, createExpenseRecord(description, amount, category)]);
    setDescription('');
    setAmount('');
    setCategory('');
  };

  const confirmDuplicateAdd = () => {
    if (!duplicateRequest) return;

    const { existingExpense, newExpenseData } = duplicateRequest;
    const updatedExpense = {
      ...existingExpense,
      amount: existingExpense.amount + newExpenseData.amount,
      time: newExpenseData.time,
      day: newExpenseData.day,
      occurrences: (existingExpense.occurrences ?? 1) + 1,
      lastAddedAt: newExpenseData.lastAddedAt,
      occurrenceDetails: [
        ...(existingExpense.occurrenceDetails || []),
        {
          amount: newExpenseData.amount,
          time: newExpenseData.time,
          date: newExpenseData.date,
          day: newExpenseData.day
        }
      ]
    };

    setExpenses(expenses.map((expense) =>
      expense.id === existingExpense.id ? updatedExpense : expense
    ));
    setDuplicateRequest(null);
    setDescription('');
    setAmount('');
    setCategory('');
  };

  const cancelDuplicateAdd = () => {
    setDuplicateRequest(null);
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const clearExpenses = () => {
    setExpenses([]);
    localStorage.removeItem('expenses');
    window.dispatchEvent(new Event('expensesUpdated'));
  };

  const sortedExpenses = [...expenses].sort((a, b) => {
    const aTime = a.lastAddedAt ? new Date(a.lastAddedAt).getTime() : a.id;
    const bTime = b.lastAddedAt ? new Date(b.lastAddedAt).getTime() : b.id;
    return bTime - aTime;
  });

  return (
    <div className="expenses" data-aos="fade-in">
      <h1 data-aos="fade-down">Expense Tracker</h1>
      <Link to="/" className="back-link">Back to Home</Link>

      <form onSubmit={addExpense} className="expense-form" data-aos="fade-up">
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          step="0.01"
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <button type="submit">Add Expense</button>
      </form>

      {duplicateRequest && (
        <div className="modal-overlay">
          <div className="modal-window" data-aos="zoom-in">
            <h3>Duplicate expense detected</h3>
            <p>
              You already have a {duplicateRequest.category} expense with description "{duplicateRequest.description}" today.
            </p>
            <p>
              Add ₹{duplicateRequest.amount.toFixed(2)} to the existing entry and update the time to {duplicateRequest.newExpenseData.time}?
            </p>
            <div className="modal-actions">
              <button type="button" className="modal-cancel" onClick={cancelDuplicateAdd}>
                Cancel
              </button>
              <button type="button" className="modal-confirm" onClick={confirmDuplicateAdd}>
                Yes, update expense
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="expenses-list" data-aos="fade-up">
        <h2>Expenses</h2>
        {expenses.length === 0 ? (
          <p>No expenses yet.</p>
        ) : (
          <>
            <div className="clear-row">
              <button type="button" className="clear-button" onClick={clearExpenses}>
                Clear All Expenses
              </button>
            </div>
            <ul>
              {sortedExpenses.map(expense => (
                <li key={expense.id} className="expense-item" data-aos="zoom-in">
                  <div className="expense-info">
                    <span className="description">{expense.description}</span>
                    <span className="category">{expense.category}</span>
                    <span className="date">{expense.day}, {expense.date} at {expense.time}</span>
                    {expense.occurrences > 1 && (
                      <span className="expense-note">
                        Added {expense.occurrences} times today
                      </span>
                    )}
                  </div>
                  <div className="expense-amount">
                    <span>₹ {expense.amount.toFixed(2)}</span>
                    <button type="button" onClick={() => deleteExpense(expense.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default Expenses;