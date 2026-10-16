import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate
} from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import ManageAccount from "./ManageAccount";
import MyBusiness from "./MyBusiness";
import AllBusinesses from "./AllBusinesses";
import AdminPanel from "./AdminPanel";

import {
  getCurrentUser,
  setCurrentUser,
  initializeApp
} from "./storage";

initializeApp();

function PrivateRoute({ user, children }) {
  return user ? children : <Navigate to="/login" replace />;
}

function Layout() {
  const [user, setUser] = useState(getCurrentUser());
  const navigate = useNavigate();

  function login(userData) {
    setCurrentUser(userData);
    setUser(userData);
    navigate("/");
  }

  function logout() {
    setCurrentUser(null);
    setUser(null);
    navigate("/login");
  }

  function updateUser(userData) {
    setCurrentUser(userData);
    setUser(userData);
  }

  return (
    <>
      {user && (
        <nav>
          <Link className="brand" to="/">PromoPilot</Link>
          <Link to="/">Dashboard</Link>
          <Link to="/account">Manage Account</Link>
          <Link to="/my-business">My Business</Link>
          <Link to="/businesses">All Businesses</Link>

          {user.isAdmin && <Link to="/admin">Admin Panel</Link>}

          <button className="logout" onClick={logout}>
            Logout
          </button>
        </nav>
      )}

      <main className="container">
        <Routes>
          <Route
            path="/login"
            element={
              user ? <Navigate to="/" /> : <Login onLogin={login} />
            }
          />

          <Route
            path="/register"
            element={
              user ? <Navigate to="/" /> : <Register onRegister={login} />
            }
          />

          <Route
            path="/"
            element={
              <PrivateRoute user={user}>
                <Dashboard user={user} />
              </PrivateRoute>
            }
          />

          <Route
            path="/account"
            element={
              <PrivateRoute user={user}>
                <ManageAccount user={user} onUpdate={updateUser} />
              </PrivateRoute>
            }
          />

          <Route
            path="/my-business"
            element={
              <PrivateRoute user={user}>
                <MyBusiness user={user} />
              </PrivateRoute>
            }
          />

          <Route
            path="/businesses"
            element={
              <PrivateRoute user={user}>
                <AllBusinesses />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <PrivateRoute user={user}>
                {user.isAdmin
                  ? <AdminPanel />
                  : <Navigate to="/" />}
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

