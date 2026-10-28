import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user.name || "", bio: user.bio || "", avatarUrl: user.avatarUrl || "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function save(event) {
    event.preventDefault();
    setBusy(true); setMessage(""); setError("");
    try {
      const { data } = await api.put("/auth/me", form);
      updateUser(data.user);
      setMessage("Your profile has been updated.");
    } catch (reason) { setError(reason.message); }
    finally { setBusy(false); }
  }
  return <DashboardLayout title="Your profile" subtitle="A little context helps readers get to know the person behind the words.">
    <div className="editor-panel profile-panel">
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="profile-summary"><span className="dashboard-avatar">{user.name.slice(0, 1)}</span><div><h2>{user.name}</h2><p>{user.email}</p><span className="status-badge published">{user.role}</span></div></div>
      <form className="auth-form profile-form" onSubmit={save}>
        <label className="form-label" htmlFor="profile-name">Display name</label><input id="profile-name" className="form-control" required minLength="2" maxLength="80" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <label className="form-label" htmlFor="profile-bio">Short bio</label><textarea id="profile-bio" className="form-control" maxLength="280" rows="4" placeholder="What are you curious about?" value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} />
        <label className="form-label" htmlFor="avatarUrl">Avatar URL <span className="optional-label">optional</span></label><input id="avatarUrl" className="form-control" type="url" value={form.avatarUrl} onChange={(event) => setForm({ ...form, avatarUrl: event.target.value })} placeholder="https://..." />
        <button className="btn btn-gradient align-self-start" disabled={busy}>{busy ? "Saving..." : "Save profile"} <i className="bi bi-check2" /></button>
      </form>
    </div>
  </DashboardLayout>;
}
