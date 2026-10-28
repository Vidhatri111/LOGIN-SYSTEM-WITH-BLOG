import AnimatedBlogCard from "./AnimatedBlogCard";
import { categoryForBlog } from "../data/categoryExperiences";
import { normalizeCategory } from "../data/sampleBlogs";

function categoryCount(blogs, category) {
  return blogs.filter((blog) => {
    const experience = categoryForBlog(blog);
    if (experience) return experience.slug === category.slug;
    const value = typeof blog.category === "string" ? blog.category : blog.category?.name;
    return normalizeCategory(value) === normalizeCategory(category.name);
  }).length;
}

export default function CategoryStories({
  blogs,
  countBlogs = blogs,
  categories,
  activeCategory,
  onCategoryChange,
  loading,
  error,
  usingSamples,
  hasActiveFilters,
  onClearFilters
}) {
  return (
    <>
      <div className="category-pills category-count-pills" aria-label="Filter stories by category">
        <button
          type="button"
          className={`category-pill ${!activeCategory ? "active" : ""}`}
          aria-pressed={!activeCategory}
          onClick={() => onCategoryChange("")}
        >
          All Stories <span className="category-pill-count">{countBlogs.length}</span>
        </button>
        {categories.map((category) => {
          const experience = categoryForBlog({ category });
          const active = [category._id, category.slug, category.name].some((value) =>
            normalizeCategory(value) === normalizeCategory(activeCategory)
          );
          return (
            <button
              type="button"
              key={category._id || category.slug || category.name}
              className={`category-pill${experience ? ` category-pill--${experience.theme}` : ""}${active ? " active" : ""}`}
              aria-pressed={active}
              onClick={() => onCategoryChange(category.slug || category._id || category.name)}
            >
              {category.name} <span className="category-pill-count">{categoryCount(countBlogs, category)}</span>
            </button>
          );
        })}
      </div>

      {error && <div className="alert alert-warning" role="status">{error}</div>}
      {usingSamples && !loading && (
        <div className="sample-stories-note" role="status">
          <i className="bi bi-stars" /> Previewing editorial samples; they are not saved to your database.
        </div>
      )}
      {loading ? (
        <div className="loading-grid">{[1, 2, 3].map((item) => <div className="skeleton-card" key={item} />)}</div>
      ) : blogs.length === 0 ? (
        <div className="empty-panel">
          <span className="empty-icon"><i className="bi bi-journal-richtext" /></span>
          <h3>{hasActiveFilters ? "No stories found" : "No stories just yet"}</h3>
          <p>{hasActiveFilters ? "Try changing your search or choosing a different category." : "Be the first to share something thoughtful."}</p>
          {hasActiveFilters && <button className="btn btn-gradient" type="button" onClick={onClearFilters}>Clear filters</button>}
        </div>
      ) : (
        <div className="row g-4 category-story-grid" aria-live="polite">
          {blogs.map((blog, index) => (
            <div key={blog._id || blog.id || blog.slug} className="col-md-6 col-lg-4">
              <AnimatedBlogCard blog={blog} index={index} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
