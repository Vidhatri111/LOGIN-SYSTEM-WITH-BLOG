import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg site-nav">
      <div className="container">
        <Link className="navbar-brand brand-mark" to="/"><span className="brand-icon">W</span>write<span>sphere</span></Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#siteNav" aria-controls="siteNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="siteNav">
          <div className="navbar-nav mx-auto">
            <NavLink className="nav-link" to="/">Home</NavLink>
            <NavLink className="nav-link" to="/blogs">Blogs</NavLink>
            <NavLink className="nav-link" to="/categories">Categories</NavLink>
            <NavLink className="nav-link" to="/about">About</NavLink>
          </div>
          <div className="nav-actions">
            {user ? <>
              {user.role === "admin" && <Link className="nav-admin-link" to="/admin">Admin</Link>}
              <Link className="avatar-link" to="/dashboard" title="Your dashboard">{user.name.slice(0, 1).toUpperCase()}</Link>
              <Link className="btn btn-gradient btn-sm" to="/blogs/new">Start writing <i className="bi bi-arrow-up-right" /></Link>
            </> : <>
              <Link className="nav-login" to="/login">Log in</Link>
              <Link className="btn btn-gradient btn-sm" to="/register">Start writing <i className="bi bi-arrow-up-right" /></Link>
            </>}
          </div>
        </div>
      </div>
    </nav>
  );
}
