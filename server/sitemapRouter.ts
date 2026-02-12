import { Router } from "express";
import * as db from "./db";

export const sitemapRouter = Router();

sitemapRouter.get("/sitemap.xml", async (req, res) => {
  try {
    const posts = await db.getBlogPosts("published");
    const baseUrl = `https://${req.get("host")}`;

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Blog Index -->
  <url>
    <loc>${baseUrl}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Static Pages -->
  <url>
    <loc>${baseUrl}/marketplace</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/documentation</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Blog Posts -->
${posts
  .map(
    (post) => `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date(post.updatedAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(sitemap);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).send("Error generating sitemap");
  }
});
