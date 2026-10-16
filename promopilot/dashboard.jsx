import { Link } from "react-router-dom";

export default function Dashboard({ user }) {
  return (
    <div className="card">
      <p className="eyebrow">PROMOPILOT DASHBOARD</p>
      <h1>Welcome, {user.name}!</h1>
      <p>Manage your account and business from one place.</p>

      <div className="dashboard-links">
        <Link className="action-card" to="/account">
          <h3>Manage Account</h3>
          <p>Update your personal information.</p>
        </Link>

        <Link className="action-card" to="/my-business">
          <h3>My Business</h3>
          <p>Add and manage your businesses.</p>
        </Link>

        <Link className="action-card" to="/businesses">
          <h3>All Businesses</h3>
          <p>View registered businesses.</p>
        </Link>
      </div>
    </div>
  );
}

