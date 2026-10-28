import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { formatDate } from "../components/BlogCard";
import ImageWithFallback from "../components/ImageWithFallback";
import api from "../services/api";

export default function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");
  async function load() {
    try { const { data } = await api.get("/blogs/my-blogs"); setBlogs(data.blogs); }
    catch (reason) { setError(reason.message); }
  }
  useEffect(() => { load(); }, []);
  async function remove(blog) {
    if (!window.confirm(`Delete “${blog.title}”? This cannot be undone.`)) return;
    try { await api.delete(`/blogs/${blog._id}`); setBlogs((current) => current.filter((item) => item._id !== blog._id)); }
    catch (reason) { setError(reason.message); }
  }
  return <DashboardLayout title="My stories" subtitle="Every draft and published idea, all in one place.">
    {error && <div className="alert alert-danger">{error}</div>}
    {blogs.length === 0 ? <div className="dashboard-panel dashboard-empty"><h3>No stories yet.</h3><Link to="/blogs/new" className="btn btn-gradient">Create your first story</Link></div>
      : <div className="dashboard-panel table-responsive"><table className="table story-table"><thead><tr><th>Story</th><th>Status</th><th>Updated</th><th>Reads</th><th>Actions</th></tr></thead><tbody>{blogs.map((blog) => <tr key={blog._id}><td><div className="table-story"><ImageWithFallback src={blog.imageUrl || "/writing-desk.svg"} alt="" /><span><b>{blog.title}</b><small>{blog.category?.name || "No category"}</small></span></div></td><td><span className={`status-badge ${blog.status}`}>{blog.status}</span></td><td>{formatDate(blog.updatedAt)}</td><td>{blog.readCount || 0}</td><td><div className="table-actions"><Link to={`/blogs/${blog._id}/edit`} title="Edit"><i className="bi bi-pencil" /></Link><button title="Delete" onClick={() => remove(blog)}><i className="bi bi-trash3" /></button></div></td></tr>)}</tbody></table></div>}
  </DashboardLayout>;
}
