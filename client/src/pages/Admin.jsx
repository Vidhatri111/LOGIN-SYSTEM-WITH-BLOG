import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { formatDate } from "../components/BlogCard";
import api from "../services/api";

export default function Admin() {
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "", color: "#8B5CF6" });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadStats() {
    try {
      const { data } = await api.get("/admin/stats");
      setStats(data.stats);
    } catch (reason) { setError(reason.message); }
  }
  async function loadTable() {
    try {
      const params = { search, page, limit: 10 };
      if (status) params.status = status;
      if (tab === "users") {
        const { data } = await api.get("/admin/users", { params });
        setUsers(data.users); setPages(data.pagination.pages || 1);
      }
      if (tab === "blogs") {
        const { data } = await api.get("/admin/blogs", { params });
        setBlogs(data.blogs); setPages(data.pagination.pages || 1);
      }
      if (tab === "categories") {
        const { data } = await api.get("/admin/categories");
        setCategories(data.categories);
      }
    } catch (reason) { setError(reason.message); }
  }
  useEffect(() => { loadStats(); }, []);
  useEffect(() => { if (tab !== "overview") loadTable(); }, [tab, search, status, page]);

  async function deleteItem(type, item) {
    const label = type === "users" ? item.name : item.title;
    if (!window.confirm(`Permanently delete ${label}${type === "users" ? " and all their stories" : ""}?`)) return;
    try {
      await api.delete(`/admin/${type}/${item._id}`);
      setNotice(`${type === "users" ? "User" : "Story"} removed.`);
      await loadTable(); await loadStats();
    } catch (reason) { setError(reason.message); }
  }
  async function addCategory(event) {
    event.preventDefault(); setError(""); setNotice("");
    try {
      await api.post("/admin/categories", categoryForm);
      setCategoryForm({ name: "", description: "", color: "#8B5CF6" });
      setNotice("Category created."); await loadTable(); await loadStats();
    } catch (reason) { setError(reason.message); }
  }
  async function changeBlogStatus(blog) {
    const nextStatus = blog.status === "published" ? "draft" : "published";
    try {
      await api.put(`/admin/blogs/${blog._id}/status`, { status: nextStatus });
      setNotice(`Story ${nextStatus === "published" ? "published" : "moved to drafts"}.`);
      await loadTable(); await loadStats();
    } catch (reason) { setError(reason.message); }
  }
  async function deleteCategory(category) {
    if (!window.confirm(`Delete category “${category.name}”?`)) return;
    try {
      await api.delete(`/admin/categories/${category._id}`);
      setNotice("Category deleted."); await loadTable(); await loadStats();
    } catch (reason) { setError(reason.message); }
  }

  const statCards = stats ? [
    ["People", stats.users, "bi-people", "lavender"], ["All stories", stats.blogs, "bi-journal-richtext", "pink"],
    ["Published", stats.published, "bi-send-check", "blue"], ["Pending content", stats.pending, "bi-hourglass-split", "orange"]
  ] : [];
  return <DashboardLayout title="The control room." subtitle="A thoughtful community takes thoughtful care.">
    {error && <div className="alert alert-danger alert-dismissible">{error}<button className="btn-close" onClick={() => setError("")} /></div>}
    {notice && <div className="alert alert-success alert-dismissible">{notice}<button className="btn-close" onClick={() => setNotice("")} /></div>}
    <div className="admin-tabs">{["overview", "users", "blogs", "categories"].map((item) => <button key={item} className={tab === item ? "active" : ""} onClick={() => { setTab(item); setPage(1); setError(""); }}>{item}</button>)}</div>
    {tab === "overview" && <>
      <div className="stat-grid admin-stat-grid">{statCards.map(([label, number, icon, color]) => <div className="stat-card" key={label}><span className={`stat-icon ${color}`}><i className={`bi ${icon}`} /></span><span className="stat-number">{number}</span><span className="stat-label">{label}</span></div>)}</div>
      <div className="dashboard-panel admin-overview"><div className="panel-heading"><div><h2>Community snapshot</h2><p>Content and membership at a glance.</p></div></div><div className="admin-stat-lines"><div><span>Draft stories</span><b>{stats?.drafts ?? "—"}</b></div><div><span>Categories</span><b>{stats?.categories ?? "—"}</b></div><div><span>Pending review</span><b>{stats?.pending ?? "—"}</b></div></div></div>
    </>}
    {tab !== "overview" && <div className="dashboard-panel admin-table-panel">
      {tab === "categories" ? <form className="category-create" onSubmit={addCategory}><div><h2>Categories</h2><p>Add a new place for ideas to find each other.</p></div><input className="form-control" required minLength="2" maxLength="40" placeholder="Category name" value={categoryForm.name} onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })} /><input className="form-control" maxLength="180" placeholder="Short description" value={categoryForm.description} onChange={(event) => setCategoryForm({ ...categoryForm, description: event.target.value })} /><input className="color-input" type="color" value={categoryForm.color} aria-label="Category color" onChange={(event) => setCategoryForm({ ...categoryForm, color: event.target.value })} /><button className="btn btn-gradient">Add category</button></form>
        : <div className="admin-table-controls"><div><h2>Manage {tab}</h2><p>Search, review and manage community {tab}.</p></div><div className="admin-filters"><input className="form-control" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder={`Search ${tab}...`} />{tab === "blogs" && <select className="form-select" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option value="">All statuses</option><option value="published">Published</option><option value="draft">Draft</option><option value="pending">Pending</option></select>}</div></div>}
      {tab === "users" && <div className="table-responsive"><table className="table story-table"><thead><tr><th>User</th><th>Role</th><th>Joined</th><th>Action</th></tr></thead><tbody>{users.map((item) => <tr key={item._id}><td><b>{item.name}</b><small className="d-block text-muted">{item.email}</small></td><td><span className={`status-badge ${item.role === "admin" ? "published" : "draft"}`}>{item.role}</span></td><td>{formatDate(item.createdAt)}</td><td><button className="table-icon-danger" onClick={() => deleteItem("users", item)} title="Delete user"><i className="bi bi-trash3" /></button></td></tr>)}</tbody></table></div>}
      {tab === "blogs" && <div className="table-responsive"><table className="table story-table"><thead><tr><th>Story</th><th>Author</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead><tbody>{blogs.map((item) => <tr key={item._id}><td><b>{item.title}</b><small className="d-block text-muted">{item.category?.name}</small></td><td>{item.author?.name}</td><td><span className={`status-badge ${item.status}`}>{item.status}</span></td><td>{formatDate(item.createdAt)}</td><td><div className="table-actions">{item.status !== "published" && <button title="Publish story" onClick={() => changeBlogStatus(item)}><i className="bi bi-send-check" /></button>}{item.status === "published" && <button title="Move to drafts" onClick={() => changeBlogStatus(item)}><i className="bi bi-file-earmark-arrow-down" /></button>}<button onClick={() => deleteItem("blogs", item)} title="Delete story"><i className="bi bi-trash3" /></button></div></td></tr>)}</tbody></table></div>}
      {tab === "categories" && <div className="category-admin-list">{categories.map((category) => <div key={category._id}><span className="category-color-dot" style={{ backgroundColor: category.color }} /><b>{category.name}</b><small>{category.description}</small><span className="category-slug">{category.slug}</span><button className="table-icon-danger" onClick={() => deleteCategory(category)} title="Delete category"><i className="bi bi-trash3" /></button></div>)}</div>}
      {tab !== "categories" && <div className="pagination-row"><span>Page {page} of {pages}</span><div><button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><button disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button></div></div>}
    </div>}
  </DashboardLayout>;
}
