import { useState } from "react";
import { Link } from "react-router-dom";
import { getUsers, saveUsers } from "./storage";

export default function Register({ onRegister }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const [error, setError] = useState("");

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const email = form.email.trim().toLowerCase();
    const users = getUsers();

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (users.some(u => u.email === email)) {
      setError("This email is already registered.");
      return;
    }

    const newUser = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      email,
      phone: form.phone.trim(),
      password: form.password,
      isAdmin: false
    };

    saveUsers([...users, newUser]);
    onRegister(newUser);
  }

  return (
    <div className="card auth-card">
      <h1>Create Your Account</h1>
      <p>Join PromoPilot today.</p>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Your Name</label>
        <input name="name" value={form.name} onChange={change} required />

        <label>Email Address</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={change}
          required
        />

        <label>Your Phone Number</label>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={change}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={change}
          minLength={6}
          required
        />

        <button className="primary" type="submit">
          Create Account
        </button>
      </form>

      <p>
        Already registered? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
