import { useState } from "react";
import { getBusinesses, saveBusinesses } from "./storage";

export default function MyBusiness({ user }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [businesses, setBusinesses] = useState(getBusinesses());
  const [message, setMessage] = useState("");

  const myBusinesses = businesses.filter(
    business => business.userId === user.id
  );

  function handleSubmit(e) {
    e.preventDefault();

    const business = {
      id: crypto.randomUUID(),
      userId: user.id,
      name: name.trim(),
      description: description.trim()
    };

    const updated = [business, ...businesses];

    saveBusinesses(updated);
    setBusinesses(updated);
    setName("");
    setDescription("");
    setMessage("Business added successfully!");
  }

  return (
    <>
      <div className="card">
        <h1>My Business</h1>
        <p>Add your business information.</p>

        {message && <p>{message}</p>}

        <form onSubmit={handleSubmit}>
          <label>Business Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter business name"
            required
          />

          <label>Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe your business"
            rows="4"
          />

          <button className="primary">Add Business</button>
        </form>
      </div>

      <div className="card">
        <h2>My Businesses ({myBusinesses.length})</h2>

        {myBusinesses.map(business => (
          <div className="business-item" key={business.id}>
            <h3>{business.name}</h3>
            <p>{business.description || "No description added."}</p>
          </div>
        ))}

        {myBusinesses.length === 0 && (
          <p>No business added yet.</p>
        )}
      </div>
    </>
  );
}
