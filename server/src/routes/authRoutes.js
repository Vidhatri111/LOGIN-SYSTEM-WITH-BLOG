const router = require("express").Router();
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { authenticate } = require("../middleware/auth");
const optionalAuth = require("../middleware/optionalAuth");
const controller = require("../controllers/authController");

router.post("/register", [
  body("name").trim().isLength({ min: 2, max: 80 }).withMessage("Name must be 2–80 characters."),
  body("email").trim().isEmail().normalizeEmail().withMessage("Enter a valid email address."),
  body("password").isLength({ min: 8, max: 128 }).withMessage("Password must be at least 8 characters.")
], validate, controller.register);
router.post("/login", [
  body("email").trim().isEmail().normalizeEmail(),
  body("password").isString().notEmpty(),
  body("remember").optional().isBoolean()
], validate, controller.login);
router.post("/logout", controller.logout);
router.get("/me", optionalAuth, controller.me);
router.put("/me", authenticate, [
  body("name").optional().trim().isLength({ min: 2, max: 80 }),
  body("bio").optional().trim().isLength({ max: 280 }),
  body("avatarUrl").optional({ values: "falsy" }).isURL({ require_protocol: true })
], validate, controller.updateMe);

module.exports = router;
