import { useEffect, useState } from "react";
import ImageWithFallback from "./ImageWithFallback";

function AnimatedStat({ value }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionPreference.matches || value === 0) {
      setDisplayValue(value);
      return undefined;
    }

    let frame;
    let startTime;
    const duration = 650;
    const animate = (timestamp) => {
      if (startTime === undefined) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setDisplayValue(Math.round(value * progress));
      if (progress < 1) frame = window.requestAnimationFrame(animate);
    };

    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [value]);

  return <strong>{displayValue}</strong>;
}

export default function CategoryHero({ category, blogs = [] }) {
  const contributors = new Set(blogs.map((blog) =>
    typeof blog.author === "string" ? blog.author : blog.author?.name
  ).filter(Boolean)).size;
  const minutes = blogs.reduce((total, blog) => {
    const text = typeof blog.content === "string" ? blog.content.trim() : "";
    return total + (Number(blog.readingTime) || Math.max(1, Math.ceil(text.split(/\s+/).length / 220)));
  }, 0);
  const stats = [blogs.length, contributors, minutes];

  return (
    <section className={`category-hero category-theme--${category.theme}`} aria-labelledby="category-title">
      <div className="category-hero-pattern" aria-hidden="true" />
      <div className="category-hero-copy">
        <span className="category-hero-eyebrow"><i className={`bi ${category.icon}`} /> {category.eyebrow}</span>
        <h1 id="category-title" className={category.theme === "technology" ? "category-title-typing" : ""}>
          {category.title}
        </h1>
        <p>{category.subtitle}</p>
        <div className="category-hero-stats">
          {category.statLabels.map((label, index) => (
            <div className="category-stat" key={label} style={{ "--reveal-index": index }}>
              <AnimatedStat value={stats[index]} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="category-hero-image">
        <ImageWithFallback src={blogs[0]?.imageUrl || category.imageUrl} alt={`${category.name} stories`} />
        <span className="category-hero-image-label"><i className={`bi ${category.icon}`} /> The {category.name} edit</span>
      </div>
      {category.theme === "creativity" && <div className="creative-floats" aria-hidden="true"><span>✳</span><span>✦</span><span>○</span></div>}
    </section>
  );
}
