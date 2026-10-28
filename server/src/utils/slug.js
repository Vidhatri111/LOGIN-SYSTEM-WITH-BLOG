const crypto = require("crypto");

async function uniqueSlug(Model, value, excludeId) {
  const base = value.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "")
    .trim().replace(/[\s_-]+/g, "-").slice(0, 100) || "story";
  let slug = base;
  let attempt = 0;
  while (await Model.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
    attempt += 1;
    slug = `${base}-${attempt > 1 ? `${attempt}-` : ""}${crypto.randomBytes(3).toString("hex")}`;
  }
  return slug;
}

module.exports = uniqueSlug;
