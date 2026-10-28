import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import BlogCard, { formatDate, readingTime } from "../components/BlogCard";
import ImageWithFallback from "../components/ImageWithFallback";
import sampleBlogs, { getSampleBlog, normalizeCategory } from "../data/sampleBlogs";

export default function BlogDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [related, setRelated] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [isSample, setIsSample] = useState(false);

  useEffect(() => {
    let active = true;
    setBlog(null);
    setError("");
    setRelated([]);
    const sample = getSampleBlog(id);

    setIsSample(false);
    api.get(`/blogs/${id}`).then(async ({ data: blogData }) => {
      const current = blogData.blog;
      if (!active) return;
      setBlog(current);
      setComments([]);
      setLiked(current.likes?.some((like) => String(like) === String(user?._id)) || false);
      const secondaryRequests = [
        api.get(`/blogs/${id}/comments`),
        user ? api.get("/blogs/bookmarks") : Promise.resolve(null),
        current.category?._id
          ? api.get("/blogs", { params: { category: current.category._id, limit: 4 } })
          : Promise.resolve(null)
      ];
      const [commentsResult, bookmarksResult, relatedResult] = await Promise.allSettled(secondaryRequests);
      if (!active) return;

      if (commentsResult.status === "fulfilled") setComments(commentsResult.value.data.comments);
      else setError(commentsResult.reason.message);
      if (bookmarksResult.status === "fulfilled" && bookmarksResult.value) {
        setBookmarked(bookmarksResult.value.data.blogs.some((saved) => String(saved._id) === String(current._id)));
      } else if (bookmarksResult.status === "rejected") {
        setError(bookmarksResult.reason.message);
      }
      if (relatedResult.status === "fulfilled" && relatedResult.value) {
        setRelated(relatedResult.value.data.blogs.filter((item) => item._id !== current._id).slice(0, 3));
      } else if (relatedResult.status === "rejected") {
        setError(relatedResult.reason.message);
      }
    }).catch((reason) => {
      if (!active) return;
      if (sample && (reason.response?.status === 404 || !reason.response)) {
        setBlog(sample);
        setComments([]);
        setIsSample(true);
        setLiked(false);
        setBookmarked(false);
        setRelated(sampleBlogs.filter((item) =>
          item._id !== sample._id && normalizeCategory(item.category.name) === normalizeCategory(sample.category.name)
        ).slice(0, 3));
        if (!reason.response) {
          setError(`Live stories could not be loaded: ${reason.message}. Showing this sample story instead.`);
        }
        return;
      }
      setError(reason.message);
    });
    return () => { active = false; };
  }, [id, user]);

  async function toggle(action) {
    if (isSample) return;
    if (!user) return setError("Sign in to like or bookmark stories.");
    setError("");
    try {
      const { data } = await api.post(`/blogs/${blog._id}/${action}`);
      if (action === "like") {
        setLiked(data.liked);
        setBlog({ ...blog, likes: Array(data.likesCount).fill(null) });
      } else setBookmarked(data.bookmarked);
    } catch (reason) { setError(reason.message); }
  }

  async function submitComment(event) {
    event.preventDefault();
    if (isSample) return;
    if (!user) return setError("Sign in to join the conversation.");
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post(`/blogs/${blog._id}/comments`, { content: commentText });
      setComments([data.comment, ...comments]);
      setCommentText("");
    } catch (reason) { setError(reason.message); }
    finally { setBusy(false); }
  }

  if (error && !blog) return <div className="container content-page"><div className="empty-panel"><h2>We couldn't find that story.</h2><p>{error}</p><Link to="/blogs" className="btn btn-gradient">Explore stories</Link></div></div>;
  if (!blog) return <div className="page-loader"><span className="spinner-border" /></div>;

  return <article className="story-page container">
    <div className="story-topline"><Link to="/blogs"><i className="bi bi-arrow-left" /> All stories</Link><span className="story-category">{typeof blog.category === "string" ? blog.category : blog.category?.name}</span></div>
    {isSample && <div className="alert alert-info" role="status">Sample story preview. This article is for demonstration and is not stored in the database.</div>}
    <header className="story-header">
      <h1>{blog.title}</h1><p className="story-deck">{blog.description}</p>
      <div className="story-author-line"><span className="author-avatar large-avatar">{blog.author?.name?.slice(0, 1) || "W"}</span><div><b>{blog.author?.name || "WriteSphere"}</b><span>{formatDate(blog.createdAt || blog.publicationDate)} · {Number(blog.readingTime) || readingTime(blog.content)} min read</span></div><div className="story-stats"><span><i className="bi bi-eye" /> {blog.readCount || 0}</span><span><i className="bi bi-heart" /> {blog.likes?.length || 0}</span></div></div>
    </header>
    <ImageWithFallback className="story-cover" src={blog.imageUrl || "/writing-desk.svg"} alt="" />
    <div className="story-layout" style={isSample ? { gridTemplateColumns: "minmax(0, 700px)" } : undefined}>
      {!isSample && <aside className="story-actions">
        <button className={`story-action ${liked ? "is-liked" : ""}`} onClick={() => toggle("like")} aria-label={liked ? "Unlike story" : "Like story"}><i className={`bi ${liked ? "bi-heart-fill" : "bi-heart"}`} /><span>{blog.likes?.length || 0}</span></button>
        <button className={`story-action ${bookmarked ? "is-saved" : ""}`} onClick={() => toggle("bookmark")} aria-label={bookmarked ? "Remove bookmark" : "Bookmark story"}><i className={`bi ${bookmarked ? "bi-bookmark-fill" : "bi-bookmark"}`} /></button>
      </aside>}
      <div className="story-body">
        <div className="story-content">{blog.content.split(/\n{2,}/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
        {blog.tags?.length > 0 && <div className="story-tags">{blog.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>}
        {error && <div className="alert alert-warning mt-3">{error}</div>}
        {!isSample && <section className="comments-section">
          <div className="comments-heading"><h2>Join the conversation</h2><span>{comments.length} {comments.length === 1 ? "response" : "responses"}</span></div>
          <form onSubmit={submitComment} className="comment-form"><textarea value={commentText} onChange={(event) => setCommentText(event.target.value)} minLength="2" maxLength="1200" required placeholder={user ? "Add a thoughtful comment..." : "Sign in to share your thoughts"} disabled={!user} /><button className="btn btn-gradient" disabled={!user || busy || !commentText.trim()}>{busy ? "Posting..." : "Post comment"} <i className="bi bi-arrow-up-right" /></button></form>
          {!user && <p className="comment-signin"><Link to="/login">Sign in</Link> to join this conversation.</p>}
          <div className="comment-list">{comments.map((comment) => <div className="comment-item" key={comment._id}><span className="author-avatar">{comment.author?.name?.slice(0, 1)}</span><div><div className="comment-byline"><b>{comment.author?.name}</b><span>{formatDate(comment.createdAt)}</span></div><p>{comment.content}</p></div></div>)}</div>
        </section>}
      </div>
    </div>
    {related.length > 0 && <section className="related-section"><div className="section-heading"><div><span className="section-kicker">KEEP EXPLORING</span><h2>More like this.</h2></div></div><div className="row g-4">{related.map((item) => <div className="col-md-4" key={item._id}><BlogCard blog={item} /></div>)}</div></section>}
  </article>;
}
