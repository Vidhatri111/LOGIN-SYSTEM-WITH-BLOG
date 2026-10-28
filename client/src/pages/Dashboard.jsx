import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { formatDate } from "../components/BlogCard";
import ImageWithFallback from "../components/ImageWithFallback";
import api from "../services/api";

export default function Dashboard() {
  const [blogs, setBlogs] = useState([]);
  const [bookmarks, setBookmarks] = useState(0);
  const [error, setError] = useState("");
  useEffect(() => {
    Promise.all([api.get("/blogs/my-blogs"), api.get("/blogs/bookmarks")])
      .then(([own, saved]) => { setBlogs(own.data.blogs); setBookmarks(saved.data.blogs.length); })
      .catch((reason) => setError(reason.message));
  }, []);
  const counts = [
    { label: "Total stories", number: blogs.length, icon: "bi-journal-richtext", color: "lavender" },
    { label: "Published", number: blogs.filter((blog) => blog.status === "published").length, icon: "bi-send-check", color: "pink" },
    { label: "Drafts", number: blogs.filter((blog) => blog.status === "draft").length, icon: "bi-pencil-square", color: "orange" },
    { label: "Bookmarks", number: bookmarks, icon: "bi-bookmark-heart", color: "blue" }
  ];
  return <DashboardLayout title="A good day to create." subtitle="Here's what's happening in your corner of WriteSphere.">
    {error && <div className="alert alert-danger">{error}</div>}
    <div className="stat-grid">{counts.map((item) => <div className="stat-card" key={item.label}><span className={`stat-icon ${item.color}`}><i className={`bi ${item.icon}`} /></span><span className="stat-number">{item.number}</span><span className="stat-label">{item.label}</span></div>)}</div>
    <section className="dashboard-panel"><div className="panel-heading"><div><h2>Your recent stories</h2><p>The latest work from your writing desk.</p></div><Link to="/dashboard/blogs" className="text-link">View all <i className="bi bi-arrow-right" /></Link></div>
      {blogs.length === 0 ? <div className="dashboard-empty"><span className="empty-icon"><i className="bi bi-feather" /></span><h3>Your first story is waiting.</h3><p>Turn that idea in your notes app into something someone else can discover.</p><Link to="/blogs/new" className="btn btn-gradient">Write your first story</Link></div>
        : <div className="recent-list">{blogs.slice(0, 5).map((blog) => <div className="recent-row" key={blog._id}><ImageWithFallback src={blog.imageUrl || "/writing-desk.svg"} alt="" /><div className="recent-title"><Link to={`/blogs/${blog.slug || blog._id}`}>{blog.title}</Link><span>{blog.category?.name || "Uncategorized"} · {formatDate(blog.updatedAt)}</span></div><span className={`status-badge ${blog.status}`}>{blog.status}</span><Link className="recent-edit" to={`/blogs/${blog._id}/edit`} aria-label={`Edit ${blog.title}`}><i className="bi bi-pencil" /></Link></div>)}</div>}
    </section>
  </DashboardLayout>;
}
