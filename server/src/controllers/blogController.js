const Blog = require("../models/Blog");
const Category = require("../models/Category");
const Comment = require("../models/Comment");
const User = require("../models/User");
const mongoose = require("mongoose");
const uniqueSlug = require("../utils/slug");

const publicFields = "title slug description content imageUrl category author tags status featured likes readCount createdAt updatedAt";

async function listBlogs(req, res, next) {
  try {
    const { search = "", category, page = "1", limit = "9", sort = "latest" } = req.query;
    const pageNumber = Math.max(1, Number.parseInt(page, 10) || 1);
    const pageSize = Math.min(24, Math.max(1, Number.parseInt(limit, 10) || 9));
    const query = { status: "published" };
    if (category) query.category = category;
    if (search.trim()) {
      const regex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      const authors = await User.find({ name: regex }).select("_id");
      query.$or = [
        { title: regex },
        { description: regex },
        { tags: regex },
        { author: { $in: authors.map((author) => author._id) } }
      ];
    }
    const sortBy = sort === "popular" ? { readCount: -1, createdAt: -1 } : { createdAt: -1 };
    const [blogs, total] = await Promise.all([
      Blog.find(query).select(publicFields).populate("author", "name avatarUrl").populate("category", "name slug color")
        .sort(sortBy).skip((pageNumber - 1) * pageSize).limit(pageSize).lean(),
      Blog.countDocuments(query)
    ]);
    res.json({ blogs, pagination: { page: pageNumber, limit: pageSize, total, pages: Math.ceil(total / pageSize) } });
  } catch (error) { next(error); }
}

async function getBlog(req, res, next) {
  try {
    const identity = mongoose.Types.ObjectId.isValid(req.params.id)
      ? { $or: [{ _id: req.params.id }, { slug: req.params.id }] }
      : { slug: req.params.id };
    const blog = await Blog.findOne(identity)
      .select(publicFields).populate("author", "name bio avatarUrl").populate("category", "name slug color");
    if (!blog || (blog.status !== "published" && String(blog.author._id) !== String(req.user?._id) && req.user?.role !== "admin")) {
      return res.status(404).json({ message: "Story not found." });
    }
    if (blog.status === "published") {
      await Blog.updateOne({ _id: blog._id }, { $inc: { readCount: 1 } });
      blog.readCount += 1;
    }
    res.json({ blog });
  } catch (error) { next(error); }
}

async function createBlog(req, res, next) {
  try {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).json({ message: "Choose a valid category." });
    const blog = await Blog.create({
      ...req.body,
      slug: await uniqueSlug(Blog, req.body.title),
      author: req.user.id,
      status: req.body.status === "published" ? "published" : "draft",
      tags: [...new Set((req.body.tags || []).map((tag) => tag.trim().toLowerCase()).filter(Boolean))].slice(0, 8)
    });
    res.status(201).json({ blog });
  } catch (error) { next(error); }
}

async function myBlogs(req, res, next) {
  try {
    const blogs = await Blog.find({ author: req.user.id }).select(publicFields)
      .populate("category", "name slug color").sort({ updatedAt: -1 }).lean();
    res.json({ blogs });
  } catch (error) { next(error); }
}

async function updateBlog(req, res, next) {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Story not found." });
    if (String(blog.author) !== String(req.user.id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "You cannot edit this story." });
    }
    if (req.body.category && !(await Category.exists({ _id: req.body.category }))) {
      return res.status(400).json({ message: "Choose a valid category." });
    }
    for (const field of ["title", "description", "content", "imageUrl", "category", "status", "tags"]) {
      if (!Object.hasOwn(req.body, field)) continue;
      blog[field] = field === "tags"
        ? [...new Set(req.body.tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean))].slice(0, 8)
        : req.body[field];
    }
    if (req.body.title) blog.slug = await uniqueSlug(Blog, req.body.title, blog._id);
    if (!["draft", "published"].includes(blog.status)) blog.status = "draft";
    await blog.save();
    await blog.populate("category", "name slug color");
    res.json({ blog });
  } catch (error) { next(error); }
}

async function deleteBlog(req, res, next) {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Story not found." });
    if (String(blog.author) !== String(req.user.id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "You cannot delete this story." });
    }
    await Promise.all([
      blog.deleteOne(),
      Comment.deleteMany({ blog: blog._id }),
      User.updateMany({}, { $pull: { bookmarks: blog._id } })
    ]);
    res.json({ message: "Story deleted." });
  } catch (error) { next(error); }
}

async function toggleLike(req, res, next) {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, status: "published" });
    if (!blog) return res.status(404).json({ message: "Story not found." });
    const liked = blog.likes.some((id) => String(id) === String(req.user.id));
    await Blog.updateOne({ _id: blog.id }, liked
      ? { $pull: { likes: req.user.id } }
      : { $addToSet: { likes: req.user.id } });
    res.json({ liked: !liked, likesCount: blog.likes.length + (liked ? -1 : 1) });
  } catch (error) { next(error); }
}

async function toggleBookmark(req, res, next) {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, status: "published" }).select("_id");
    if (!blog) return res.status(404).json({ message: "Story not found." });
    const bookmarked = req.user.bookmarks.some((id) => String(id) === String(blog.id));
    await User.updateOne({ _id: req.user.id }, bookmarked
      ? { $pull: { bookmarks: blog.id } }
      : { $addToSet: { bookmarks: blog.id } });
    res.json({ bookmarked: !bookmarked });
  } catch (error) { next(error); }
}

async function getBookmarks(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("bookmarks").populate({
      path: "bookmarks", match: { status: "published" }, select: publicFields,
      populate: [{ path: "author", select: "name avatarUrl" }, { path: "category", select: "name slug color" }]
    });
    res.json({ blogs: user.bookmarks.filter(Boolean) });
  } catch (error) { next(error); }
}

async function getComments(req, res, next) {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, status: "published" }).select("_id");
    if (!blog) return res.status(404).json({ message: "Story not found." });
    const comments = await Comment.find({ blog: blog.id }).populate("author", "name avatarUrl").sort({ createdAt: -1 }).lean();
    res.json({ comments });
  } catch (error) { next(error); }
}

async function addComment(req, res, next) {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, status: "published" }).select("_id");
    if (!blog) return res.status(404).json({ message: "Story not found." });
    const comment = await Comment.create({ blog: blog.id, author: req.user.id, content: req.body.content });
    await comment.populate("author", "name avatarUrl");
    res.status(201).json({ comment });
  } catch (error) { next(error); }
}

module.exports = {
  listBlogs, getBlog, createBlog, myBlogs, updateBlog, deleteBlog,
  toggleLike, toggleBookmark, getBookmarks, getComments, addComment
};
