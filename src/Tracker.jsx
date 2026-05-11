import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CATEGORY_COLORS = {
  Food: '#FF6384',
  Transportation: '#36A2EB',
  Entertainment: '#FFCE56',
  Utilities: '#4BC0C0',
  Other: '#9966FF'
};

const Tracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

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

  const categoryTotals = expenses.reduce((acc, expense) => {
    const category = expense.category || 'Other';
    acc[category] = (acc[category] || 0) + expense.amount;
    return acc;
  }, {});

  const topCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  const sortedExpenses = [...expenses].sort((a, b) => {
    if (b.amount !== a.amount) return b.amount - a.amount;
    const aTime = a.lastAddedAt ? new Date(a.lastAddedAt).getTime() : a.id;
    const bTime = b.lastAddedAt ? new Date(b.lastAddedAt).getTime() : b.id;
    return bTime - aTime;
  });

  const circumference = 2 * Math.PI * 80;
  const chartSegments = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .reduce((acc, [category, amount]) => {
      const percentage = totalAmount > 0 ? amount / totalAmount : 0;
      const dash = percentage * circumference;
      acc.segments.push({
        category,
        amount,
        color: CATEGORY_COLORS[category] ?? '#ccc',
        dash,
        offset: acc.offset
      });
      return {
        segments: acc.segments,
        offset: acc.offset - dash
      };
    }, { segments: [], offset: 0 }).segments;

  return (
    <div className="tracker" data-aos="fade-in">
      <h1 data-aos="fade-down">Total Expenses Tracker</h1>
      <Link to="/" className="back-link">Back to Home</Link>

      <div className="total" data-aos="fade-up">
        <h2>Total Expenses: ₹ {totalAmount.toFixed(2)}</h2>
      </div>

      <div className="top-categories" data-aos="fade-up">
        <h2>Top Expense Categories</h2>
        <div className="chart-section">
          <div className="pie-chart-wrapper">
            <svg className="pie-chart" viewBox="0 0 220 220">
              <circle cx="110" cy="110" r="80" fill="none" stroke="#222" strokeWidth="40" opacity="0.08" />
              {chartSegments.map((segment) => (
                <circle
                  key={segment.category}
                  cx="110"
                  cy="110"
                  r="80"
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="40"
                  strokeDasharray={`${segment.dash} ${circumference - segment.dash}`}
                  strokeDashoffset={segment.offset}
                  strokeLinecap="round"
                  transform="rotate(-90 110 110)"
                />
              ))}
            </svg>
            <div className="pie-center">
              <span>{totalAmount > 0 ? 'Category Share' : 'No Data'}</span>
            </div>
          </div>

          <div className="pie-legend">
            {Object.entries(categoryTotals)
              .sort(([, a], [, b]) => b - a)
              .map(([category, amount]) => (
                <div key={category} className="legend-item">
                  <div className="legend-color" style={{ background: CATEGORY_COLORS[category] ?? '#ccc' }} />
                  <span className="legend-label">{category}</span>
                  <span className="legend-value">{totalAmount > 0 ? ((amount / totalAmount) * 100).toFixed(1) : '0.0'}%</span>
                </div>
              ))}
          </div>
        </div>

        <ul>
          {topCategories.map(([category, amount], index) => (
            <li key={category} className={`category-item ${index < 3 ? 'highlight' : ''}`} data-aos="zoom-in">
              <span className="category-name">{category}</span>
              <span className="category-amount">₹ {amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="all-expenses" data-aos="fade-up">
        <h2>All Expenses</h2>
        {sortedExpenses.length === 0 ? (
          <p>No expenses recorded yet.</p>
        ) : (
          <ul>
            {sortedExpenses.map((expense, index) => (
              <li
                key={expense.id}
                className={`expense-summary-item ${index < 3 ? 'highlight' : 'other'} ${expandedId === expense.id ? 'expanded' : ''}`}
                onClick={() => setExpandedId(expandedId === expense.id ? null : expense.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpandedId(expandedId === expense.id ? null : expense.id); }}
              >
                <div className="expense-summary-main">
                  <span className="description">{expense.description}</span>
                  <span className="category">{expense.category}</span>
                </div>
                <div className="expense-summary-meta">
                  <span className="date">{expense.day ?? ''}{expense.day ? ', ' : ''}{expense.date ?? ''}</span>
                  <span className="time">{expense.time ?? ''}</span>
                </div>
                <div className="expense-summary-bottom">
                  <span className="amount">₹ {expense.amount.toFixed(2)}</span>
                  {!((expandedId === expense.id) && expense.occurrenceDetails?.length > 1) && expense.occurrences > 1 && (
                    <span className="expense-note">Added {expense.occurrences} times today</span>
                  )}
                </div>
                {expandedId === expense.id && expense.occurrenceDetails?.length > 1 && (
                  <div className="expense-summary-details">
                    {expense.occurrenceDetails.map((detail, detailIndex) => (
                      <div key={`${expense.id}-${detailIndex}`} className="expense-detail-row">
                        <p><strong>Time:</strong> {detail.time}</p>
                        <p><strong>Date:</strong> {detail.day}, {detail.date}</p>
                        <p><strong>Amount:</strong> ₹ {detail.amount.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Tracker;