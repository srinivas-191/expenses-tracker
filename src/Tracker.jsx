import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Tracker = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const readExpenses = () => {
      const savedExpenses = localStorage.getItem('expenses');
      setExpenses(savedExpenses ? JSON.parse(savedExpenses) : []);
    };

    readExpenses();
    window.addEventListener('expensesUpdated', readExpenses);

    return () => {
      window.removeEventListener('expensesUpdated', readExpenses);
    };
  }, []);


  const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);

  // Calculate category totals
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  // Get top categories
  const topCategories = Object.entries(categoryTotals)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 4);

  return (
    <div className="tracker" data-aos="fade-in">
      <h1 data-aos="fade-down">Total Expenses Tracker</h1>
      <Link to="/" className="back-link">Back to Home</Link>

      <div className="total" data-aos="fade-up">
        <h2>Total Expenses: ${totalAmount.toFixed(2)}</h2>
      </div>

      <div className="top-categories" data-aos="fade-up">
        <h2>Top Expense Categories</h2>
        <ul>
          {topCategories.map(([category, amount], index) => (
            <li key={category} className={`category-item ${index < 3 ? 'highlight' : ''}`} data-aos="zoom-in">
              <span className="category-name">{category}</span>
              <span className="category-amount">${amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Tracker;