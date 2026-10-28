import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ImageWithFallback from "../components/ImageWithFallback";
import sampleBlogs, { normalizeCategory, sampleCategories } from "../data/sampleBlogs";
import { categoryExperiences, getCategoryExperience } from "../data/categoryExperiences";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");
  const [usingSamples, setUsingSamples] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.allSettled([api.get("/categories"), api.get("/blogs", { params: { page: 1, limit: 100 } })])
      .then(([categoryResult, blogResult]) => {
        if (!active) return;
        const warnings = [];

        if (categoryResult.status === "fulfilled" && categoryResult.value.data.categories?.length) {
          setCategories(categoryResult.value.data.categories);
        } else {
          setCategories(sampleCategories);
          if (categoryResult.status === "rejected") warnings.push(`Categories could not be loaded: ${categoryResult.reason.message}`);
        }

        if (blogResult.status === "fulfilled" && Array.isArray(blogResult.value.data.blogs)) {
          const liveBlogs = blogResult.value.data.blogs;
          if (liveBlogs.length) setBlogs(liveBlogs);
          else {
            setBlogs(sampleBlogs);
            setUsingSamples(true);
          }
        } else {
          setBlogs(sampleBlogs);
          setUsingSamples(true);
          warnings.push(blogResult.status === "rejected"
            ? `Live stories could not be loaded: ${blogResult.reason.message}`
            : "The stories service returned an unexpected response.");
        }
        setError(warnings.join(" "));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  const categoryCards = useMemo(() => categoryExperiences.map((experience) => {
    const category = categories.find((item) =>
      getCategoryExperience(item.slug || item.name)?.slug === experience.slug
    ) || sampleCategories.find((item) => item.slug === experience.slug);
    const stories = blogs.filter((blog) => {
      const value = typeof blog.category === "string" ? blog.category : blog.category?.slug || blog.category?.name;
      return getCategoryExperience(value)?.slug === experience.slug
        || normalizeCategory(value) === normalizeCategory(experience.name);
    });

    return { experience, category, stories };
  }), [blogs, categories]);

  return <section className="container content-page categories-page">
    <div className="content-page-heading"><span className="section-kicker">A WORLD OF PERSPECTIVES</span><h1>Follow what<br /><span>makes you curious.</span></h1><p>Five distinct corners of WriteSphere, each with its own ideas, voices and stories to explore.</p></div>
    {error && <div className="alert alert-warning" role="status">{error}</div>}
    {usingSamples && !loading && <div className="sample-stories-note" role="status"><i className="bi bi-stars" /> Editorial samples are shown because no published stories are available yet. They are not saved to your database.</div>}
    {loading ? <div className="loading-grid">{[1, 2, 3].map((item) => <div className="skeleton-card" key={item} />)}</div> : (
      <div className="row g-4 category-page-grid">
        {categoryCards.map(({ experience, category, stories }, index) => (
          <div className="col-md-6 col-lg-4" key={experience.slug}>
            <Link
              to={`/blogs?category=${encodeURIComponent(category?.slug || category?._id || experience.slug)}`}
              className={`category-page-card category-theme--${experience.theme}`}
              style={{ "--card-index": index }}
            >
              <ImageWithFallback className="category-page-image" src={stories[0]?.imageUrl || experience.imageUrl} alt="" loading="lazy" />
              <span className="category-tile-icon"><i className={`bi ${experience.icon}`} /></span>
              <span className="category-card-eyebrow">{experience.eyebrow}</span>
              <h2>{experience.name}</h2>
              <p>{experience.subtitle}</p>
              <span className="category-page-count">{stories.length} {stories.length === 1 ? "story" : "stories"}</span>
              <span className="category-explore">Explore stories <i className="bi bi-arrow-up-right" /></span>
            </Link>
          </div>
        ))}
      </div>
    )}
    <div className="categories-all-link"><Link to="/blogs" className="btn btn-gradient">Explore all stories <i className="bi bi-arrow-right" /></Link></div>
  </section>;
}
