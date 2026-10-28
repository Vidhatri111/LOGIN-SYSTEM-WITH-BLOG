const User = require("../models/User");
const Blog = require("../models/Blog");
const Category = require("../models/Category");
const Comment = require("../models/Comment");
const uniqueSlug = require("../utils/slug");

async function stats(_req, res, next) {
  try {
    const [users, blogs, published, drafts, pending, categories] = await Promise.all([
      User.countDocuments(), Blog.countDocuments(), Blog.countDocuments({ status: "published" }),
      Blog.countDocuments({ status: "draft" }), Blog.countDocuments({ status: "pending" }), Category.countDocuments()
    ]);
    res.json({ stats: { users, blogs, published, drafts, pending, categories } });
  } catch (error) { next(error); }
}

async function users(req, res, next) {
  try {
    const { search = "", page = "1", limit = "10" } = req.query;
    const pageNum = Math.max(1, Number.parseInt(page, 10) || 1);
    const perPage = Math.min(50, Math.max(1, Number.parseInt(limit, 10) || 10));
    const filter = search.trim()
      ? { $or: [{ name: new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") }, { email: new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") }] }
      : {};
    const [rows, total] = await Promise.all([
      User.find(filter).select("name email role createdAt").sort({ createdAt: -1 })
        .skip((pageNum - 1) * perPage).limit(perPage).lean(),
      User.countDocuments(filter)
    ]);
    res.json({ users: rows, pagination: { page: pageNum, pages: Math.ceil(total / perPage), total } });
  } catch (error) { next(error); }
}

async function blogs(req, res, next) {
  try {
    const { search = "", status, page = "1", limit = "10" } = req.query;
    const pageNum = Math.max(1, Number.parseInt(page, 10) || 1);
    const perPage = Math.min(50, Math.max(1, Number.parseInt(limit, 10) || 10));
    const filter = {};
    if (status && ["draft", "pending", "published"].includes(status)) filter.status = status;
    if (search.trim()) filter.title = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const [rows, total] = await Promise.all([
      Blog.find(filter).select("title status author category createdAt").populate("author", "name email")
        .populate("category", "name").sort({ createdAt: -1 }).skip((pageNum - 1) * perPage).limit(perPage).lean(),
      Blog.countDocuments(filter)
    ]);
    res.json({ blogs: rows, pagination: { page: pageNum, pages: Math.ceil(total / perPage), total } });
  } catch (error) { next(error); }
}

async function addCategory(req, res, next) {
  try {
    const category = await Category.create({
      name: req.body.name,
      slug: await uniqueSlug(Category, req.body.name),
      description: req.body.description || "",
      color: req.body.color || "#8B5CF6"
    });
    res.status(201).json({ category });
  } catch (error) { next(error); }
}

async function deleteUser(req, res, next) {
  try {
    if (String(req.params.id) === String(req.user.id)) {
      return res.status(400).json({ message: "You cannot delete your own administrator account." });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    const authoredBlogIds = await Blog.find({ author: user.id }).distinct("_id");
    await Promise.all([
      Blog.deleteMany({ author: user.id }),
      Comment.deleteMany({ $or: [{ author: user.id }, { blog: { $in: authoredBlogIds } }] }),
      User.updateMany({}, { $pull: { bookmarks: { $in: authoredBlogIds } } }),
      User.deleteOne({ _id: user.id })
    ]);
    res.json({ message: "User and their content were deleted." });
  } catch (error) { next(error); }
}

async function deleteBlog(req, res, next) {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Story not found." });
    await Promise.all([
      Comment.deleteMany({ blog: blog.id }),
      User.updateMany({}, { $pull: { bookmarks: blog.id } })
    ]);
    res.json({ message: "Story deleted." });
  } catch (error) { next(error); }
}

async function updateBlogStatus(req, res, next) {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    ).select("title status");
    if (!blog) return res.status(404).json({ message: "Story not found." });
    res.json({ blog });
  } catch (error) { next(error); }
}

async function listCategories(_req, res, next) {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();
    res.json({ categories });
  } catch (error) { next(error); }
}

async function deleteCategory(req, res, next) {
  try {
    if (await Blog.exists({ category: req.params.id })) {
      return res.status(409).json({ message: "This category is in use. Move its stories before deleting it." });
    }
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found." });
    res.json({ message: "Category deleted." });
  } catch (error) { next(error); }
}

module.exports = { stats, users, blogs, addCategory, deleteUser, deleteBlog, updateBlogStatus, listCategories, deleteCategory };
