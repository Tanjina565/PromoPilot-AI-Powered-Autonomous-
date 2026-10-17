import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5001/admin";
const sections = ["users", "businesses", "products", "contents", "campaigns"];

function App() {
  const [summary, setSummary] = useState({});
  const [section, setSection] = useState("users");
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState("");

  async function loadSummary() {
    try {
      const response = await fetch(`${API}/summary`);
      setSummary(await response.json());
    } catch {
      setMessage("Could not connect to the admin API.");
    }
  }

  async function loadRecords(type = section) {
    try {
      const response = await fetch(`${API}/${type}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not load records.");
      setRecords(data);
    } catch (error) {
      setRecords([]);
      setMessage(error.message);
    }
  }

  useEffect(() => { loadSummary(); }, []);
  useEffect(() => { loadRecords(section); }, [section]);

  async function changeUserStatus(user) {
    const status = user.status === "Suspended" ? "Active" : "Suspended";
    const response = await fetch(`${API}/users/${user._id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    const result = await response.json();
    setMessage(result.message || `User status changed to ${status}.`);
    loadRecords("users");
  }

  async function removeRecord(record) {
    const name = record.name || record.title || record.email || "this record";
    if (!window.confirm(`Remove ${name}?`)) return;

    const response = await fetch(`${API}/${section}/${record._id}`, {
      method: "DELETE"
    });
    const result = await response.json();
    setMessage(result.message || "Record removed.");
    loadRecords(section);
    loadSummary();
  }

  async function editRecord(record) {
    const newName = window.prompt("Enter updated name/title:", record.name || record.title || "");
    if (newName === null || !newName.trim()) return;

    const updated = { ...record };
    if ("name" in updated) updated.name = newName.trim();
    else updated.title = newName.trim();
    delete updated._id;
    delete updated.__v;

    const response = await fetch(`${API}/${section}/${record._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    });
    const result = await response.json();
    setMessage(result.message || "Record updated.");
    loadRecords(section);
  }

  function getTitle(record) {
    return record.name || record.title || record.email || "Untitled";
  }

  function getDetails(record) {
    return Object.entries(record)
      .filter(([key]) => !["_id", "__v", "name", "title"].includes(key))
      .map(([key, value]) => `${key}: ${value}`)
      .join(" • ");
  }

  return (
    <main className="admin-page">
      <header>
        <div>
          <p className="small-title">PROMOPILOT</p>
          <h1>Admin Dashboard</h1>
          <p>Manage users and platform content.</p>
        </div>
        <span className="admin-tag">Admin Panel</span>
      </header>

      {message && <p className="message">{message}</p>}

      <section className="summary-grid">
        {[
          ["Users", summary.users],
          ["Businesses", summary.businesses],
          ["Products", summary.products],
          ["Content", summary.contents],
          ["Campaigns", summary.campaigns]
        ].map(([label, count]) => (
          <div className="summary-card" key={label}>
            <p>{label}</p>
            <strong>{count ?? 0}</strong>
          </div>
        ))}
      </section>

      <nav className="tabs">
        {sections.map((item) => (
          <button
            key={item}
            className={section === item ? "active" : ""}
            onClick={() => { setSection(item); setMessage(""); }}
          >
            {item[0].toUpperCase() + item.slice(1)}
          </button>
        ))}
      </nav>

      <section className="records">
        <div className="records-heading">
          <h2>{section[0].toUpperCase() + section.slice(1)}</h2>
          <button onClick={() => { loadRecords(); loadSummary(); }}>Refresh</button>
        </div>

        {records.length === 0 ? (
          <p className="empty">No records found in this section.</p>
        ) : (
          records.map((record) => (
            <article className="record" key={record._id}>
              <div className="record-text">
                <h3>{getTitle(record)}</h3>
                <p>{getDetails(record) || "No extra details"}</p>
              </div>
              <div className="actions">
                {section === "users" && (
                  <button className="secondary" onClick={() => changeUserStatus(record)}>
                    {record.status === "Suspended" ? "Reactivate" : "Suspend"}
                  </button>
                )}
                <button onClick={() => editRecord(record)}>Edit</button>
                <button className="danger" onClick={() => removeRecord(record)}>Remove</button>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

export default App;
