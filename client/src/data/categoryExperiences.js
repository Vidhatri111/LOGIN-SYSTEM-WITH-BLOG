export const categoryExperiences = [
  {
    name: "Business",
    slug: "business",
    icon: "bi-briefcase",
    theme: "business",
    eyebrow: "IDEAS THAT MOVE WORK FORWARD",
    title: "Build with intention.",
    subtitle: "Honest lessons on entrepreneurship, startups, marketing and the strategies behind sustainable growth.",
    imageUrl: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85",
    statLabels: ["Business stories", "Distinct voices", "Minutes of insight"]
  },
  {
    name: "Creativity",
    slug: "creativity",
    icon: "bi-palette",
    theme: "creativity",
    eyebrow: "MAKE ROOM FOR THE IMAGINATION",
    title: "Follow the spark.",
    subtitle: "A colorful collection of art, photography, design projects and small prompts to get your next idea moving.",
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=85",
    statLabels: ["Creative stories", "Distinct voices", "Minutes to explore"]
  },
  {
    name: "Culture",
    slug: "culture",
    icon: "bi-brightness-high",
    theme: "culture",
    eyebrow: "ROOTED IN STORIES AND PLACE",
    title: "Traditions, still becoming.",
    subtitle: "Explore Gujarati traditions, Indian festivals, shared heritage and the histories that connect generations.",
    imageUrl: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=85",
    statLabels: ["Culture stories", "Distinct voices", "Minutes of heritage"]
  },
  {
    name: "Lifestyle",
    slug: "lifestyle",
    icon: "bi-sun",
    theme: "lifestyle",
    eyebrow: "A LITTLE MORE ROOM TO BREATHE",
    title: "Make the everyday yours.",
    subtitle: "Thoughtful routines, productivity, travel and personal growth for a life shaped with care.",
    imageUrl: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85",
    statLabels: ["Lifestyle stories", "Distinct voices", "Minutes to unwind"]
  },
  {
    name: "Technology",
    slug: "technology",
    icon: "bi-cpu",
    theme: "technology",
    eyebrow: "CURIOUS ABOUT WHAT COMES NEXT",
    title: "Technology, made human.",
    subtitle: "Explore AI, React, web development, coding, cybersecurity and the ideas shaping tomorrow.",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85",
    statLabels: ["Tech stories", "Distinct voices", "Minutes of discovery"]
  }
];

export function getCategoryExperience(value) {
  const normalized = String(value || "").trim().toLocaleLowerCase();
  return categoryExperiences.find((category) =>
    category.slug === normalized || category.name.toLocaleLowerCase() === normalized
  );
}

export function categoryForBlog(blog) {
  const value = typeof blog?.category === "string"
    ? blog.category
    : blog?.category?.slug || blog?.category?.name;
  return getCategoryExperience(value);
}
