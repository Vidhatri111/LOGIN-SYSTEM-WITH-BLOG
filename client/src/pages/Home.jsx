import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import CategoryHero from "../components/CategoryHero";
import CategoryStories from "../components/CategoryStories";
import ImageWithFallback from "../components/ImageWithFallback";
import { getCategoryExperience } from "../data/categoryExperiences";
import sampleBlogs, { normalizeCategory, sampleCategories } from "../data/sampleBlogs";

async function fetchPublishedBlogs() {
  const { data } = await api.get("/blogs", { params: { page: 1, limit: 24 } });
  if (!Array.isArray(data.blogs)) throw new Error("The stories service returned an unexpected response.");

  const blogs = [...data.blogs];
  const pageCount = Math.max(1, Number(data.pagination?.pages) || 1);
  const remainingPages = await Promise.allSettled(
    Array.from({ length: pageCount - 1 }, (_, index) =>
      api.get("/blogs", { params: { page: index + 2, limit: 24 } })
    )
  );
  const warnings = [];

  remainingPages.forEach((result) => {
    if (result.status === "fulfilled" && Array.isArray(result.value.data.blogs)) {
      blogs.push(...result.value.data.blogs);
    } else {
      warnings.push(result.status === "rejected"
        ? `Some additional stories could not be loaded: ${result.reason.message}`
        : "Some additional stories were returned in an unexpected format.");
    }
  });

  return { blogs, warnings };
}

export default function Home({ showAll = false }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get("search") || "");
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usingSamples, setUsingSamples] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.allSettled([api.get("/categories"), fetchPublishedBlogs()])
      .then(([categoryResult, blogResult]) => {
        if (!active) return;
        const warnings = [];

        if (categoryResult.status === "fulfilled" && categoryResult.value.data.categories?.length) {
          setCategories(categoryResult.value.data.categories);
        } else {
          setCategories(sampleCategories);
          if (categoryResult.status === "rejected") warnings.push(categoryResult.reason.message);
        }

        if (blogResult.status === "fulfilled") {
          const { blogs: liveBlogs } = blogResult.value;
          warnings.push(...blogResult.value.warnings);
          if (liveBlogs.length) {
            setBlogs(liveBlogs);
            if (warnings.length) setError(warnings.join(" "));
            return;
          }
          setBlogs(sampleBlogs);
          setUsingSamples(true);
          if (warnings.length) setError(warnings.join(" "));
          return;
        }

        setBlogs(sampleBlogs);
        setUsingSamples(true);
        warnings.push(`Live stories could not be loaded: ${blogResult.reason.message}`);
        setError(warnings.join(" "));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  useEffect(() => {
    setSearchText(searchParams.get("search") || "");
  }, [searchParams]);

  function search(event) {
    event.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (searchText.trim()) next.set("search", searchText.trim());
    else next.delete("search");
    setSearchParams(next);
  }

  const visibleBlogs = useMemo(() => {
    const categoryFilter = normalizeCategory(searchParams.get("category"));
    const matchedCategory = categories.find((category) =>
      [category._id, category.slug, category.name].some((value) => normalizeCategory(value) === categoryFilter)
    );
    const categoryName = normalizeCategory(matchedCategory?.name || categoryFilter);
    const query = normalizeCategory(searchParams.get("search"));

    return blogs.filter((blog) => {
      const blogCategory = normalizeCategory(typeof blog.category === "string" ? blog.category : blog.category?.name);
      const categoryMatches = !categoryFilter || blogCategory === categoryName
        || normalizeCategory(typeof blog.category === "object" ? blog.category?.slug : "") === categoryFilter;
      const searchableText = [
        blog.title,
        blog.description,
        typeof blog.author === "string" ? blog.author : blog.author?.name,
        ...(Array.isArray(blog.tags) ? blog.tags : [])
      ].join(" ").toLocaleLowerCase();
      return categoryMatches && (!query || searchableText.includes(query));
    });
  }, [blogs, categories, searchParams]);

  const categoryCountBlogs = useMemo(() => {
    const query = normalizeCategory(searchParams.get("search"));
    if (!query) return blogs;
    return blogs.filter((blog) => [
      blog.title,
      blog.description,
      typeof blog.author === "string" ? blog.author : blog.author?.name,
      ...(Array.isArray(blog.tags) ? blog.tags : [])
    ].join(" ").toLocaleLowerCase().includes(query));
  }, [blogs, searchParams]);

  const activeCategory = searchParams.get("category") || "";
  const activeCategoryMetadata = categories.find((category) =>
    [category._id, category.slug, category.name].some((value) =>
      normalizeCategory(value) === normalizeCategory(activeCategory)
    )
  );
  const categoryExperience = getCategoryExperience(
    activeCategoryMetadata?.slug || activeCategoryMetadata?.name || activeCategory
  );
  const categoryBlogs = categoryExperience
    ? blogs.filter((blog) => getCategoryExperience(
      typeof blog.category === "string" ? blog.category : blog.category?.slug || blog.category?.name
    )?.slug === categoryExperience.slug)
    : [];

  const hasActiveFilters = Boolean(searchParams.get("search") || searchParams.get("category"));
  const featured = !showAll && !hasActiveFilters
    ? visibleBlogs.find((blog) => blog.featured) || visibleBlogs[0]
    : null;
  const cards = featured
    ? visibleBlogs.filter((blog) => blog._id !== featured._id)
    : visibleBlogs;

  function changeCategory(value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set("category", value);
    else next.delete("category");
    setSearchParams(next);
  }

  return <>
    {!showAll && <section className="hero-section">
      <div className="hero-orb hero-orb-one" /><div className="hero-orb hero-orb-two" />
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-star">✳</span> A HOME FOR CURIOUS MINDS</div>
          <h1>Share Your Ideas<br />With <span>The World.</span></h1>
          <p>Thoughtful stories. Fresh perspectives. A community that believes every idea deserves a place to grow.</p>
          <form className="hero-search" onSubmit={search}>
            <i className="bi bi-search" />
            <input aria-label="Search stories" value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Search stories, topics, writers..." />
            <button type="submit" className="btn btn-gradient">Explore <i className="bi bi-arrow-right" /></button>
          </form>
          <div className="hero-proof"><div className="proof-avatars"><span>J</span><span>M</span><span>A</span><span>+</span></div><span><strong>10k+</strong> curious readers every week</span></div>
        </div>
        <div className="hero-art">
          <div className="hero-image-frame"><ImageWithFallback src={featured?.imageUrl || "/writing-desk.svg"} alt="A writing desk with an open notebook" /></div>
          <div className="floating-note note-top"><span className="note-icon"><i className="bi bi-stars" /></span><span><b>Ideas live here</b><small>Find your next favorite</small></span></div>
          <div className="floating-note note-bottom"><span className="note-heart">♡</span><span><b>Stories that stay</b><small>Made by real people</small></span></div>
          <span className="hero-sparkle sparkle-one">✦</span><span className="hero-sparkle sparkle-two">✳</span>
        </div>
      </div>
    </section>}

    {!showAll && featured && <section className="container featured-section">
      <div className="featured-story">
        <Link to={`/blogs/${featured.slug || featured._id}`} className="featured-cover"><ImageWithFallback src={featured.imageUrl || "/writing-desk.svg"} alt="" /><span><i className="bi bi-stars" /> EDITOR'S PICK</span></Link>
        <div className="featured-copy"><span className="section-kicker">A STORY TO START WITH</span><h2><Link to={`/blogs/${featured.slug || featured._id}`}>{featured.title}</Link></h2><p>{featured.description}</p><div className="featured-byline"><span className="author-avatar">{featured.author?.name?.slice(0, 1) || "W"}</span><span><b>{featured.author?.name || "WriteSphere"}</b><small>{featured.category?.name} · {featured.readCount || 0} reads</small></span></div><Link className="text-link" to={`/blogs/${featured.slug || featured._id}`}>Read the story <i className="bi bi-arrow-up-right" /></Link></div>
      </div>
    </section>}

    {categoryExperience && <div className="container category-experience-wrap">
      <CategoryHero category={categoryExperience} blogs={categoryBlogs} />
    </div>}

    <section className="section-wrap container" id="latest">
      <div className="section-heading">
        <div><span className="section-kicker">{showAll ? "THE LIBRARY" : "FRESH FROM THE COMMUNITY"}</span><h2>{searchParams.get("search") ? `Stories about “${searchParams.get("search")}”` : categoryExperience ? `${categoryExperience.name} stories` : showAll ? "Explore all stories" : "Ideas worth your time."}</h2></div>
        {!showAll && <Link className="text-link" to="/blogs">View all stories <i className="bi bi-arrow-up-right" /></Link>}
      </div>
      {showAll && <form className="hero-search library-search" onSubmit={search}>
        <i className="bi bi-search" />
        <input aria-label="Search stories" value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Search titles, authors, topics..." />
        <button type="submit" className="btn btn-gradient">Search <i className="bi bi-arrow-right" /></button>
      </form>}
      <CategoryStories
        blogs={cards}
        countBlogs={categoryCountBlogs}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={changeCategory}
        loading={loading}
        error={error}
        usingSamples={usingSamples}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={() => setSearchParams({})}
      />
    </section>

    {!showAll && <section className="category-band">
      <div className="container">
        <div className="section-heading"><div><span className="section-kicker">FOLLOW YOUR CURIOSITY</span><h2>A little something for everyone.</h2></div><Link className="text-link" to="/categories">All categories <i className="bi bi-arrow-up-right" /></Link></div>
        <div className="row g-3 category-grid">{categories.slice(0, 5).map((category, index) => <Link key={category._id} to={`/blogs?category=${category._id}`} className={`col-6 col-lg category-tile category-tone-${index % 5}`}><span className="category-tile-icon"><i className={`bi ${["bi-cpu", "bi-brush", "bi-sun", "bi-globe2", "bi-lightbulb"][index % 5]}`} /></span><b>{category.name}</b><span>{category.description}</span></Link>)}</div>
      </div>
    </section>}

    {!showAll && <section className="newsletter-section container">
      <div className="newsletter-card"><div className="newsletter-decoration">✳</div><div><span className="section-kicker">THE SUNDAY SENTENCE</span><h2>Make room for good ideas.</h2><p>Join our community of curious readers and creators.</p></div><Link className="btn btn-light-ghost" to="/register">Join WriteSphere <i className="bi bi-arrow-right" /></Link></div>
    </section>}
  </>;
}
