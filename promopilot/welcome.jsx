import { useState } from "react";
import { Link } from "react-router-dom";
import { getUsers } from "./storage";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const user = getUsers().find(
      u =>
        u.email === email.trim().toLowerCase() &&
        u.password === password
    );

    if (!user) {
      setError("Incorrect email or password.");
      return;
    }

    onLogin(user);
  }

  return (
    <div className="card auth-card">
      <h1>Welcome Back!</h1>
      <p>Login to your PromoPilot account.</p>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Email Address</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button className="primary" type="submit">Log In</button>
      </form>

      <p>
        Don't have an account? <Link to="/register">Create Your Account</Link>
      </p>
    </div>
  );
}