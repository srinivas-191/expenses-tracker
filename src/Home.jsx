import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to Expense Tracker</h1>
      <p>Manage your expenses easily!</p>
      <nav>
        <Link to="/expenses">Add Expenses</Link>
        <Link to="/tracker">View Tracker</Link>
      </nav>
    </div>
  );
};

export default Home;