import { Link } from "react-router-dom";
import ImageWithFallback from "./ImageWithFallback";

export function formatDate(date) {
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Recently";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(parsedDate);
}

export function readingTime(content = "") {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 220));
}

export default function BlogCard({ blog, featured = false }) {
  const categoryName = typeof blog.category === "string" ? blog.category : blog.category?.name;
  const authorName = typeof blog.author === "string" ? blog.author : blog.author?.name;
  const articleId = blog.slug || blog._id || blog.id;
  const minutesToRead = Number(blog.readingTime) || readingTime(blog.content);

  return (
    <article className={`blog-card ${featured ? "blog-card-featured" : ""}`}>
      <Link to={`/blogs/${articleId}`} className="blog-image-link" aria-label={`Read ${blog.title}`}>
        <ImageWithFallback className="blog-image" src={blog.imageUrl || "/writing-desk.svg"} alt="" loading="lazy" />
        <span className="image-category">{categoryName || "Stories"}</span>
      </Link>
      <div className="blog-card-body">
        <div className="blog-meta"><span>{formatDate(blog.createdAt || blog.publicationDate)}</span><span className="meta-dot" />{minutesToRead} min read</div>
        <h3><Link to={`/blogs/${articleId}`}>{blog.title}</Link></h3>
        <p>{blog.description}</p>
        <div className="card-bottom">
          <span className="author-mini"><span className="author-avatar">{authorName?.slice(0, 1) || "W"}</span>{authorName || "WriteSphere"}</span>
          <Link className="text-link" to={`/blogs/${articleId}`}>Read More <i className="bi bi-arrow-up-right" /></Link>
        </div>
      </div>
    </article>
  );
}
