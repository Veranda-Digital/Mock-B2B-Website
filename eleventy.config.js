import { HtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
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
