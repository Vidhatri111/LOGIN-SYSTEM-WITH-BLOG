const router = require("express").Router();
const Category = require("../models/Category");

router.get("/", async (_req, res, next) => {
  try {
    res.json({ categories: await Category.find().sort({ name: 1 }).lean() });
  } catch (error) { next(error); }
});

module.exports = router;
