import { getUsers, getBusinesses } from "./storage";

export default function AdminPanel() {
  const users = getUsers();
  const businesses = getBusinesses();

  return (
    <>
      <div className="card">
        <h1>Admin Panel</h1>
        <p>PromoPilot overview</p>

        <div className="stats">
          <div className="stat-card">
            <span>Total Users</span>
            <h2>{users.length}</h2>
          </div>

          <div className="stat-card">
            <span>Total Businesses</span>
            <h2>{businesses.length}</h2>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>All Users</h2>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
              </tr>
            </thead>

            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.isAdmin ? "Admin" : "User"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2>All Businesses</h2>

        {businesses.map(business => {
          const owner = users.find(
            user => user.id === business.userId
          );

          return (
            <div className="business-item" key={business.id}>
              <h3>{business.name}</h3>
              <p>{business.description || "No description."}</p>
              <small>Owner: {owner?.name || "Unknown"}</small>
            </div>
          );
        })}

        {businesses.length === 0 && <p>No businesses found.</p>}
      </div>
    </>
  );
}
