module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("favicon*");
  // Resume: add only the file you intend to publish (no-PII version)
  eleventyConfig.addPassthroughCopy("resume_pdf.pdf");

  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("blog/posts/*.md").reverse();
  });

  eleventyConfig.addCollection("categories", function (collectionApi) {
    const posts = collectionApi.getFilteredByGlob("blog/posts/*.md");
    const cats = new Set();
    posts.forEach((p) => {
      const c = p.data.categories;
      if (Array.isArray(c)) c.forEach((cat) => cats.add(cat));
    });
    return [...cats].sort();
  });

  eleventyConfig.addFilter("date", function (date, format) {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    if (format === "YYYY-MM-DD") return d.toISOString().slice(0, 10);
    if (format === "MMM d, yyyy") return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    if (format === "MMMM d, yyyy") return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    return d.toLocaleDateString();
  });

  const baseUrl = process.env.BASE_URL || "";
  eleventyConfig.addGlobalData("baseUrl", baseUrl);

  eleventyConfig.addFilter("absoluteUrl", function (path) {
    const base = process.env.BASE_URL || "https://example.com";
    if (!path) return base;
    try {
      return new URL(path, base.endsWith("/") ? base : base + "/").href;
    } catch {
      return base;
    }
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    templateFormats: ["njk", "md", "html"],
    htmlOutputSuffix: "-o",
    pathPrefix: process.env.PATH_PREFIX || "",
  };
};
