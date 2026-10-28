const router = require("express").Router();
const { body, param } = require("express-validator");
const validate = require("../middleware/validate");
const { authenticate } = require("../middleware/auth");
const optionalAuth = require("../middleware/optionalAuth");
const controller = require("../controllers/blogController");

const blogFields = [
  body("title").optional().trim().isLength({ min: 3, max: 140 }),
  body("description").optional().trim().isLength({ min: 10, max: 280 }),
  body("content").optional().trim().isLength({ min: 20, max: 50000 }),
  body("category").optional().isMongoId(),
  body("imageUrl").optional({ values: "falsy" }).isURL({ require_protocol: true }),
  body("status").optional().isIn(["draft", "published"]),
  body("tags").optional().isArray({ max: 8 }),
  body("tags.*").optional().isString().trim().isLength({ min: 1, max: 24 })
];
const requiredBlogFields = [
  body("title").trim().isLength({ min: 3, max: 140 }),
  body("description").trim().isLength({ min: 10, max: 280 }),
  body("content").trim().isLength({ min: 20, max: 50000 }),
  body("category").isMongoId()
];
const validId = param("id").isMongoId().withMessage("Invalid story identifier.");

router.get("/", controller.listBlogs);
router.get("/my-blogs", authenticate, controller.myBlogs);
router.get("/bookmarks", authenticate, controller.getBookmarks);
router.post("/", authenticate, [...requiredBlogFields, ...blogFields], validate, controller.createBlog);
router.get("/:id/comments", validId, validate, controller.getComments);
router.post("/:id/comments", authenticate, validId, body("content").trim().isLength({ min: 2, max: 1200 }), validate, controller.addComment);
router.post("/:id/bookmark", authenticate, validId, validate, controller.toggleBookmark);
router.post("/:id/like", authenticate, validId, validate, controller.toggleLike);
router.get("/:id", optionalAuth, controller.getBlog);
router.put("/:id", authenticate, validId, ...blogFields, validate, controller.updateBlog);
router.delete("/:id", authenticate, validId, validate, controller.deleteBlog);

module.exports = router;
