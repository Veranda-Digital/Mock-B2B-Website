import { HtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);

  // Public site files only. src/assets/video/sources holds the original clips
  // and is kept in the repo, but not published.
  eleventyConfig.addPassthroughCopy({
    "src/assets/css": "assets/css",
    "src/assets/js": "assets/js",
    "src/assets/images": "assets/images",
    "src/assets/illustrations": "assets/illustrations",
    "src/assets/video/hero": "assets/video/hero",
  });
  eleventyConfig.addWatchTarget("src/assets/");

  eleventyConfig.addFilter("year", () => new Date().getFullYear());

  // Escapes text and keeps hyphenated words (e.g. "last-mile") from wrapping at the hyphen.
  const htmlEscapes = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  eleventyConfig.addFilter("keepHyphenated", (text = "") =>
    String(text)
      .replace(/[&<>"']/g, (c) => htmlEscapes[c])
      .replace(/\b\w+(?:-\w+)+\b/g, (word) => `<span class="nowrap">${word}</span>`)
  );

  return {
    // Set by the GitHub Pages workflow (e.g. "/Mock-B2B-Website/"); "/" for local dev.
    pathPrefix: process.env.ELEVENTY_PATH_PREFIX || "/",
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
