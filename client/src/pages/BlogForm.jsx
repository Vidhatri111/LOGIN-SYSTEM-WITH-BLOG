import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import api from "../services/api";

const initialForm = { title: "", description: "", content: "", category: "", imageUrl: "", tags: "", status: "draft" };

export default function BlogForm({ edit = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data.categories)).catch((reason) => setError(reason.message));
    if (edit) api.get(`/blogs/${id}`).then(({ data }) => {
      const blog = data.blog;
      setForm({ title: blog.title, description: blog.description, content: blog.content, category: blog.category?._id || "", imageUrl: blog.imageUrl || "", tags: (blog.tags || []).join(", "), status: blog.status });
    }).catch((reason) => setError(reason.message));
  }, [edit, id]);

  async function submit(event, status) {
    event.preventDefault();
    setError("");
    if (!form.category) return setError("Choose a category before saving.");
    if (form.title.trim().length < 3 || form.description.trim().length < 10 || form.content.trim().length < 20) {
      return setError("Add a title, a description of at least 10 characters, and at least 20 characters of story content.");
    }
    setBusy(true);
    const payload = {
      ...form,
      status,
      tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean).slice(0, 8)
    };
    try {
      if (edit) await api.put(`/blogs/${id}`, payload);
      else await api.post("/blogs", payload);
      navigate("/dashboard/blogs");
    } catch (reason) { setError(reason.message); }
    finally { setBusy(false); }
  }

  return <DashboardLayout title={edit ? "Edit your story" : "Make something meaningful."} subtitle={edit ? "A few thoughtful changes can make all the difference." : "Take your time. Every good story starts somewhere."}>
    {error && <div className="alert alert-danger">{error}</div>}
    <form className="editor-panel" onSubmit={(event) => submit(event, form.status)}>
      <div className="editor-topline"><span><i className="bi bi-feather" /> STORY EDITOR</span><span>Saved to your space when you choose a button below</span></div>
      <label className="form-label" htmlFor="title">Story title</label><input id="title" className="form-control title-input" maxLength="140" required minLength="3" placeholder="Give your idea a good name..." value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
      <label className="form-label" htmlFor="description">Short description</label><textarea id="description" className="form-control description-input" maxLength="280" minLength="10" required placeholder="What should a reader know before they begin?" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
      <div className="row g-3"><div className="col-md-6"><label className="form-label" htmlFor="category">Category</label><select id="category" className="form-select" required value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}><option value="">Choose a category</option>{categories.map((category) => <option value={category._id} key={category._id}>{category.name}</option>)}</select></div><div className="col-md-6"><label className="form-label" htmlFor="imageUrl">Cover image URL <span className="optional-label">optional</span></label><input id="imageUrl" className="form-control" type="url" placeholder="https://..." value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} /></div></div>
      <label className="form-label" htmlFor="tags">Tags <span className="optional-label">comma separated, up to 8</span></label><input id="tags" className="form-control" placeholder="writing, creativity, ideas" value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} />
      <label className="form-label" htmlFor="content">Your story</label><textarea id="content" className="form-control story-editor" minLength="20" required placeholder="Start with the sentence that's been on your mind..." value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} />
      <div className="editor-actions"><Link to="/dashboard/blogs" className="btn btn-outline-muted">Cancel</Link><button type="button" className="btn btn-outline-muted" disabled={busy} onClick={(event) => submit(event, "draft")}>{busy ? "Saving..." : "Save as draft"}</button><button type="button" className="btn btn-gradient" disabled={busy} onClick={(event) => submit(event, "published")}>{busy ? "Publishing..." : edit ? "Update story" : "Publish story"} <i className="bi bi-arrow-up-right" /></button></div>
    </form>
  </DashboardLayout>;
}
