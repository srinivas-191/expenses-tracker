import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Expenses = () => {
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  // Save expenses to localStorage whenever expenses change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    window.dispatchEvent(new Event('expensesUpdated'));
  }, [expenses]);

  const addExpense = (e) => {
    e.preventDefault();
    if (description && amount && category) {
      const newExpense = {
        id: Date.now(),
        description,
        amount: parseFloat(amount),
        category,
        date: new Date().toLocaleDateString()
      };
      setExpenses([...expenses, newExpense]);
      setDescription('');
      setAmount('');
      setCategory('');
    }
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const clearExpenses = () => {
    setExpenses([]);
    localStorage.removeItem('expenses');
    window.dispatchEvent(new Event('expensesUpdated'));
  };

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
          <option value="Food">Food</option>
          <option value="Transportation">Transportation</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Utilities">Utilities</option>
          <option value="Other">Other</option>
        </select>
        <button type="submit">Add Expense</button>
      </form>

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
              {expenses.map(expense => (
                <li key={expense.id} className="expense-item" data-aos="zoom-in">
                  <div className="expense-info">
                    <span className="description">{expense.description}</span>
                    <span className="category">{expense.category}</span>
                    <span className="date">{expense.date}</span>
                  </div>
                  <div className="expense-amount">
                    <span>${expense.amount.toFixed(2)}</span>
                    <button onClick={() => deleteExpense(expense.id)}>Delete</button>
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