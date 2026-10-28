import BlogCard from "./BlogCard";
import { categoryForBlog } from "../data/categoryExperiences";

export default function AnimatedBlogCard({ blog, index = 0 }) {
  const category = categoryForBlog(blog);

  return (
    <div
      className={`animated-blog-card${category ? ` category-card--${category.theme}` : ""}`}
      style={{ "--card-index": index }}
    >
      <BlogCard blog={blog} />
    </div>
  );
}
