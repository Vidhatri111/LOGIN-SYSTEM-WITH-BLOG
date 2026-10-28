import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout({ children, title, subtitle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [logoutError, setLogoutError] = useState("");
  const [logoutBusy, setLogoutBusy] = useState(false);
  async function signOut() {
    if (logoutBusy) return;
    setLogoutError("");
    setLogoutBusy(true);
    try { await logout(); navigate("/"); }
    catch (error) { setLogoutError(error.message); }
    finally { setLogoutBusy(false); }
  }
  return <div className="dashboard-shell container">
    <aside className="dashboard-sidebar">
      <div className="dashboard-user"><span className="dashboard-avatar">{user?.name?.slice(0, 1)}</span><div><b>{user?.name}</b><small>{user?.role === "admin" ? "Administrator" : "Writer account"}</small></div></div>
      <span className="sidebar-label">YOUR SPACE</span>
      <nav className="dashboard-menu">
        <NavLink end to="/dashboard"><i className="bi bi-grid-1x2" /> Overview</NavLink>
        <NavLink to="/dashboard/blogs"><i className="bi bi-journal-text" /> My stories</NavLink>
        <NavLink to="/blogs/new"><i className="bi bi-plus-square" /> Create a story</NavLink>
        <NavLink to="/dashboard/bookmarks"><i className="bi bi-bookmark" /> Bookmarks</NavLink>
        <NavLink to="/dashboard/profile"><i className="bi bi-person" /> Profile</NavLink>
      </nav>
      {user?.role === "admin" && <><span className="sidebar-label sidebar-label-spaced">MANAGE</span><nav className="dashboard-menu"><NavLink to="/admin"><i className="bi bi-shield-check" /> Admin panel</NavLink></nav></>}
      {logoutError && <div className="alert alert-danger mt-3 mb-0 p-2" role="alert">{logoutError}</div>}
      <button className="sidebar-logout" onClick={signOut} disabled={logoutBusy}><i className="bi bi-box-arrow-left" /> {logoutBusy ? "Signing out..." : "Log out"}</button>
    </aside>
    <section className="dashboard-content"><header className="dashboard-heading"><div><span className="section-kicker">YOUR WRITE SPHERE</span><h1>{title}</h1><p>{subtitle}</p></div><NavLink className="btn btn-gradient" to="/blogs/new"><i className="bi bi-plus-lg" /> New story</NavLink></header>{children}</section>
  </div>;
}
