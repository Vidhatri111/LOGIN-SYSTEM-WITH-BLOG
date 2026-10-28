require("dotenv").config();
const mongoose = require("mongoose");
const connectDatabase = require("../config/db");
const User = require("../models/User");
const Blog = require("../models/Blog");
const Category = require("../models/Category");
const uniqueSlug = require("../utils/slug");

const categoryData = [
  ["Technology", "Thoughtful takes on tools, code and what comes next.", "#8064F7"],
  ["Creativity", "Ideas, habits and inspiration for making things.", "#E56FB3"],
  ["Lifestyle", "Small observations on living a more intentional life.", "#F0A35E"],
  ["Culture", "Stories about the things that shape how we see the world.", "#62AFA6"],
  ["Business", "Lessons from building, leading and working together.", "#6286D9"]
];
const examples = [
  {
    title: "The quiet art of starting before you're ready",
    description: "A gentler way to move from thinking about the work to making the first small thing.",
    category: "Creativity", tags: ["creativity", "habits"],
    imageUrl: "https://images.unsplash.com/photo-1455390582262-044c42f07f3b?auto=format&fit=crop&w=1200&q=85"
  },
  {
    title: "Designing a calmer corner of the internet",
    description: "What thoughtful digital spaces can teach us about attention, trust and belonging.",
    category: "Technology", tags: ["design", "technology"],
    imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85"
  },
  {
    title: "A field guide to noticing more",
    description: "A few practical prompts for seeing familiar streets, routines and conversations with fresh eyes.",
    category: "Lifestyle", tags: ["life", "writing"],
    imageUrl: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85"
  }
];

async function run() {
  await connectDatabase();
  for (const [name, description, color] of categoryData) {
    const slug = name.toLowerCase();
    await Category.updateOne({ slug }, { $setOnInsert: { name, slug, description, color } }, { upsert: true });
  }
  const author = process.env.SEED_AUTHOR_EMAIL
    ? await User.findOne({ email: process.env.SEED_AUTHOR_EMAIL.toLowerCase() })
    : null;
  if (!author) {
    console.log("Categories are ready. Set SEED_AUTHOR_EMAIL to a registered account and run seed again to add sample stories.");
    return;
  }
  for (const story of examples) {
    const category = await Category.findOne({ name: story.category });
    if (await Blog.exists({ title: story.title, author: author.id })) continue;
    await Blog.create({
      ...story,
      content: `${story.description}\n\nThe best ideas rarely arrive fully formed. They begin as a question, a note in the margin, or a conversation that stays with us. Give that first fragment a little room. Return to it with curiosity, make one useful change, and let the next step reveal itself.\n\nThis is not a shortcut to certainty. It is a practice of paying attention, showing up, and learning in public. The work becomes clearer as we make it.`,
      category: category.id,
      author: author.id,
      slug: await uniqueSlug(Blog, story.title),
      status: "published",
      featured: true
    });
  }
  console.log("Sample categories and stories are ready.");
}

run().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exitCode = 1;
}).finally(() => mongoose.disconnect());
