const router = require("express").Router();
const { body, param } = require("express-validator");
const validate = require("../middleware/validate");
const { authenticate, requireAdmin } = require("../middleware/auth");
const controller = require("../controllers/adminController");

router.use(authenticate, requireAdmin);
router.get("/stats", controller.stats);
router.get("/users", controller.users);
router.get("/blogs", controller.blogs);
router.get("/categories", controller.listCategories);
router.post("/categories", [
  body("name").trim().isLength({ min: 2, max: 40 }),
  body("description").optional().trim().isLength({ max: 180 }),
  body("color").optional().matches(/^#[0-9A-Fa-f]{6}$/)
], validate, controller.addCategory);
router.put("/blogs/:id/status", [
  param("id").isMongoId(),
  body("status").isIn(["draft", "pending", "published"])
], validate, controller.updateBlogStatus);
router.delete("/users/:id", param("id").isMongoId(), validate, controller.deleteUser);
router.delete("/blogs/:id", param("id").isMongoId(), validate, controller.deleteBlog);
router.delete("/categories/:id", param("id").isMongoId(), validate, controller.deleteCategory);

module.exports = router;
