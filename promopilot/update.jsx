import { useState } from "react";
import { getUsers, saveUsers } from "./storage";

export default function ManageAccount({ user, onUpdate }) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (password && password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    const updatedUser = {
      ...user,
      name: name.trim(),
      phone: phone.trim(),
      ...(password ? { password } : {})
    };

    const users = getUsers().map(u =>
      u.id === user.id ? updatedUser : u
    );

    saveUsers(users);
    onUpdate(updatedUser);
    setPassword("");
    setMessage("Account updated successfully!");
  }

  return (
    <div className="card">
      <h1>Manage Account</h1>
      <p>Update your profile information.</p>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <label>Your Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <label>Email Address</label>
        <input value={user.email} disabled />

        <label>Your Phone Number</label>
        <input
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
        />

        <label>New Password (optional)</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          minLength={6}
          placeholder="Leave blank to keep current password"
        />

        <button className="primary">Save Changes</button>
      </form>
    </div>
  );
}

