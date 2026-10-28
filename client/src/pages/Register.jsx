import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setError("");
    if (form.password.length < 8) return setError("Use at least 8 characters for your password.");
    if (form.password !== form.confirmPassword) return setError("Your passwords do not match.");
    setBusy(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate("/login", {
        replace: true,
        state: { success: "Your account was created. Sign in to start writing." }
      });
    } catch (reason) { setError(reason.message); }
    finally { setBusy(false); }
  }

  return <section className="auth-page register-page">
    <div className="auth-side register-side"><div className="auth-side-inner"><span className="auth-quote-mark">✳</span><h2>Your point of view belongs in the conversation.</h2><p>Start a space for your stories, your questions, and the ideas you can't stop thinking about.</p><div className="register-note"><i className="bi bi-feather" /> Your next chapter starts here.</div></div></div>
    <div className="auth-form-side"><div className="auth-form-wrap">
      <span className="section-kicker">MAKE YOURSELF AT HOME</span><h1>Start your story.</h1><p className="auth-subtitle">Create an account. It only takes a moment.</p>
      {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
      <form onSubmit={submit} className="auth-form">
        <label className="form-label" htmlFor="name">Your name</label><input id="name" className="form-control" required minLength="2" maxLength="80" autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="How should we call you?" />
        <label className="form-label" htmlFor="email">Email address</label><input id="email" className="form-control" required type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" />
        <label className="form-label" htmlFor="password">Password</label>
        <div className="password-field"><input id="password" className="form-control" required minLength="8" maxLength="128" type={showPassword ? "text" : "password"} autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="At least 8 characters" /><button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}><i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} /></button></div>
        <label className="form-label" htmlFor="confirmPassword">Confirm password</label><input id="confirmPassword" className="form-control" required type={showPassword ? "text" : "password"} autoComplete="new-password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} placeholder="Type it once more" />
        <button className="btn btn-gradient w-100 auth-submit" type="submit" disabled={busy}>{busy ? "Creating account..." : "Create account"} <i className="bi bi-arrow-right" /></button>
      </form>
      <p className="auth-switch">Already part of the community? <Link to="/login">Sign in</Link></p>
    </div></div>
  </section>;
}
