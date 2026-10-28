import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setError("");
    setBusy(true);
    try {
      await login(form);
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (reason) { setError(reason.message); }
    finally { setBusy(false); }
  }

  return <section className="auth-page">
    <div className="auth-side"><div className="auth-side-inner"><span className="auth-quote-mark">“</span><h2>Every great story begins with a single thought.</h2><p>Find your people. Share what matters. Keep the good ideas moving.</p><div className="auth-reader"><div className="reader-stack"><span>J</span><span>M</span><span>A</span></div><span>Loved by writers and readers everywhere</span></div></div></div>
    <div className="auth-form-side"><div className="auth-form-wrap">
      <span className="section-kicker">WELCOME BACK</span><h1>Pick up where<br />your curiosity left off.</h1><p className="auth-subtitle">Sign in to your WriteSphere account.</p>
      {location.state?.success && <div className="alert alert-success py-2" role="status">{location.state.success}</div>}
      {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
      <form onSubmit={submit} className="auth-form">
        <label className="form-label" htmlFor="email">Email address</label><input id="email" className="form-control" type="email" autoComplete="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" />
        <div className="label-row"><label className="form-label" htmlFor="password">Password</label></div>
        <div className="password-field"><input id="password" className="form-control" type={showPassword ? "text" : "password"} autoComplete="current-password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Enter your password" /><button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}><i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} /></button></div>
        <label className="remember-label"><input type="checkbox" checked={form.remember} onChange={(event) => setForm({ ...form, remember: event.target.checked })} /> Keep me signed in</label>
        <button className="btn btn-gradient w-100 auth-submit" type="submit" disabled={busy}>{busy ? "Signing in..." : "Sign in"} <i className="bi bi-arrow-right" /></button>
      </form>
      <p className="auth-switch">New to WriteSphere? <Link to="/register">Create an account</Link></p>
    </div></div>
  </section>;
}
