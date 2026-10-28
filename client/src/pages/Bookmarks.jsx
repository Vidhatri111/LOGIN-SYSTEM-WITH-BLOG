import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import BlogCard from "../components/BlogCard";
import api from "../services/api";

export default function Bookmarks() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api.get("/blogs/bookmarks").then(({ data }) => setBlogs(data.blogs)).catch((reason) => setError(reason.message));
  }, []);
  return <DashboardLayout title="Your reading list" subtitle="Stories you've saved for a quieter moment.">
    {error && <div className="alert alert-danger">{error}</div>}
    {!blogs.length ? <div className="dashboard-panel dashboard-empty"><span className="empty-icon"><i className="bi bi-bookmark-heart" /></span><h3>Save a story for later.</h3><p>Bookmark stories as you explore and they'll be waiting here.</p><Link to="/blogs" className="btn btn-gradient">Explore stories</Link></div>
      : <div className="row g-4">{blogs.map((blog) => <div key={blog._id} className="col-lg-6"><BlogCard blog={blog} /></div>)}</div>}
  </DashboardLayout>;
}
