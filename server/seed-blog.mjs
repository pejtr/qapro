import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

const articles = [
  {
    title: "Complete Guide to Browser Automation Testing in 2026",
    slug: "browser-automation-testing-guide-2026",
    excerpt: "Master browser automation testing with Playwright, Puppeteer, and Selenium. Learn best practices, common pitfalls, and advanced techniques for reliable test automation.",
    content: `<h2>Introduction to Browser Automation Testing</h2>
<p>Browser automation testing has become essential for modern web development. With the rise of complex web applications, manual testing is no longer sufficient to ensure quality and reliability.</p>

<h2>Popular Browser Automation Tools</h2>
<h3>1. Playwright</h3>
<p>Playwright is Microsoft's modern automation framework that supports Chromium, Firefox, and WebKit. It offers excellent cross-browser testing capabilities and built-in auto-waiting mechanisms.</p>

<pre><code>// Example Playwright test
const { test, expect } = require('@playwright/test');

test('basic test', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});</code></pre>

<h3>2. Puppeteer</h3>
<p>Puppeteer provides a high-level API to control Chrome/Chromium. It's perfect for web scraping, PDF generation, and automated testing of Chrome-specific features.</p>

<h3>3. Selenium</h3>
<p>Selenium remains the industry standard for cross-browser testing. With WebDriver support for all major browsers, it's ideal for comprehensive test coverage.</p>

<h2>Best Practices for Browser Automation</h2>
<ul>
<li><strong>Use explicit waits</strong> instead of hard-coded sleep statements</li>
<li><strong>Implement Page Object Model</strong> for maintainable test code</li>
<li><strong>Run tests in parallel</strong> to reduce execution time</li>
<li><strong>Use headless mode</strong> for CI/CD pipelines</li>
<li><strong>Capture screenshots</strong> on test failures for debugging</li>
</ul>

<h2>Common Challenges and Solutions</h2>
<p><strong>Flaky Tests:</strong> Use retry mechanisms and proper wait strategies to handle timing issues.</p>
<p><strong>Dynamic Content:</strong> Implement smart selectors that adapt to changing DOM structures.</p>
<p><strong>Authentication:</strong> Store session cookies or tokens to avoid repeated login flows.</p>

<h2>Conclusion</h2>
<p>Browser automation testing is crucial for delivering high-quality web applications. By choosing the right tools and following best practices, you can build a robust test automation framework that scales with your application.</p>`,
    keywords: "browser automation, playwright, puppeteer, selenium, test automation, web testing, QA automation",
    metaDescription: "Comprehensive guide to browser automation testing in 2026. Learn Playwright, Puppeteer, and Selenium best practices for reliable test automation.",
    featuredImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
  },
  {
    title: "Top 10 QA Testing Mistakes and How to Avoid Them",
    slug: "top-10-qa-testing-mistakes",
    excerpt: "Discover the most common QA testing mistakes that lead to bugs in production and learn proven strategies to prevent them in your testing workflow.",
    content: `<h2>Introduction</h2>
<p>Even experienced QA engineers make mistakes that can lead to critical bugs reaching production. Understanding these common pitfalls is the first step to building a more reliable testing process.</p>

<h2>1. Insufficient Test Coverage</h2>
<p><strong>Mistake:</strong> Testing only happy paths and ignoring edge cases.</p>
<p><strong>Solution:</strong> Implement code coverage tools and create a comprehensive test matrix covering all user scenarios.</p>

<h2>2. Ignoring Non-Functional Testing</h2>
<p><strong>Mistake:</strong> Focusing solely on functional tests while neglecting performance, security, and accessibility.</p>
<p><strong>Solution:</strong> Include performance testing, security audits, and accessibility checks in your test plan.</p>

<h2>3. Poor Test Data Management</h2>
<p><strong>Mistake:</strong> Using production data or inconsistent test data across environments.</p>
<p><strong>Solution:</strong> Create dedicated test data sets and use data factories for consistent, realistic test scenarios.</p>

<h2>4. Lack of Test Automation Strategy</h2>
<p><strong>Mistake:</strong> Automating everything or nothing without a clear strategy.</p>
<p><strong>Solution:</strong> Follow the test automation pyramid: more unit tests, fewer UI tests, and automate repetitive, stable scenarios first.</p>

<h2>5. Inadequate Environment Management</h2>
<p><strong>Mistake:</strong> Testing in environments that don't match production.</p>
<p><strong>Solution:</strong> Use containerization (Docker) and infrastructure as code to maintain environment parity.</p>

<h2>6. Skipping Regression Testing</h2>
<p><strong>Mistake:</strong> Only testing new features without verifying existing functionality.</p>
<p><strong>Solution:</strong> Implement automated regression test suites that run on every deployment.</p>

<h2>7. Poor Bug Reporting</h2>
<p><strong>Mistake:</strong> Vague bug reports without reproduction steps or screenshots.</p>
<p><strong>Solution:</strong> Use standardized bug templates with clear reproduction steps, expected vs actual results, and visual evidence.</p>

<h2>8. Testing Too Late in the Cycle</h2>
<p><strong>Mistake:</strong> Waiting until development is complete to start testing.</p>
<p><strong>Solution:</strong> Adopt shift-left testing practices and involve QA from the requirements phase.</p>

<h2>9. Ignoring Mobile Testing</h2>
<p><strong>Mistake:</strong> Only testing on desktop browsers.</p>
<p><strong>Solution:</strong> Include mobile devices and responsive design testing in your test plan.</p>

<h2>10. Not Measuring Test Effectiveness</h2>
<p><strong>Mistake:</strong> Running tests without tracking metrics or improving based on results.</p>
<p><strong>Solution:</strong> Monitor defect detection rate, test execution time, and flakiness metrics to continuously improve your testing process.</p>

<h2>Conclusion</h2>
<p>Avoiding these common QA mistakes requires discipline, proper tooling, and a commitment to continuous improvement. By implementing these solutions, you'll build a more effective testing process that catches bugs before they reach production.</p>`,
    keywords: "QA testing, testing mistakes, test automation, quality assurance, software testing, bug prevention",
    metaDescription: "Learn the top 10 QA testing mistakes that lead to production bugs and discover proven strategies to avoid them in your testing workflow.",
    featuredImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
  },
  {
    title: "Playwright vs Puppeteer: Complete Comparison for 2026",
    slug: "playwright-vs-puppeteer-comparison",
    excerpt: "Detailed comparison of Playwright and Puppeteer for browser automation. Discover which tool is best for your testing needs with real-world examples.",
    content: `<h2>Introduction</h2>
<p>Choosing between Playwright and Puppeteer can be challenging. Both are powerful browser automation tools, but they have different strengths and use cases.</p>

<h2>Overview</h2>
<h3>Playwright</h3>
<p>Developed by Microsoft, Playwright supports Chromium, Firefox, and WebKit. It's designed for modern web testing with built-in features like auto-waiting and network interception.</p>

<h3>Puppeteer</h3>
<p>Created by Google's Chrome team, Puppeteer provides a high-level API for controlling Chrome/Chromium. It's the go-to choice for Chrome-specific automation tasks.</p>

<h2>Browser Support</h2>
<p><strong>Playwright:</strong> Chromium, Firefox, WebKit (Safari)</p>
<p><strong>Puppeteer:</strong> Chromium, Chrome (Firefox support is experimental)</p>
<p><strong>Winner:</strong> Playwright for cross-browser testing</p>

<h2>API and Developer Experience</h2>
<pre><code>// Playwright
const { chromium } = require('playwright');
const browser = await chromium.launch();
const page = await browser.newPage();

// Puppeteer
const puppeteer = require('puppeteer');
const browser = await puppeteer.launch();
const page = await browser.newPage();</code></pre>
<p>Both have similar APIs, but Playwright offers more modern features like auto-waiting and better error messages.</p>

<h2>Performance</h2>
<p><strong>Playwright:</strong> Slightly faster due to optimized browser binaries</p>
<p><strong>Puppeteer:</strong> Excellent performance for Chrome-specific tasks</p>
<p><strong>Winner:</strong> Tie, both are highly performant</p>

<h2>Testing Features</h2>
<p><strong>Playwright:</strong></p>
<ul>
<li>Built-in test runner (@playwright/test)</li>
<li>Auto-waiting for elements</li>
<li>Network interception and mocking</li>
<li>Video recording and screenshots</li>
<li>Trace viewer for debugging</li>
</ul>

<p><strong>Puppeteer:</strong></p>
<ul>
<li>Requires external test runners (Jest, Mocha)</li>
<li>Manual waiting strategies</li>
<li>Request interception</li>
<li>Screenshots and PDF generation</li>
</ul>

<p><strong>Winner:</strong> Playwright for comprehensive testing features</p>

<h2>Use Cases</h2>
<h3>Choose Playwright if you need:</h3>
<ul>
<li>Cross-browser testing</li>
<li>Modern testing framework with built-in features</li>
<li>Mobile emulation and responsive testing</li>
<li>Advanced debugging capabilities</li>
</ul>

<h3>Choose Puppeteer if you need:</h3>
<ul>
<li>Chrome-specific automation</li>
<li>PDF generation from web pages</li>
<li>Web scraping with Chrome DevTools Protocol</li>
<li>Lightweight Chrome automation</li>
</ul>

<h2>Community and Ecosystem</h2>
<p><strong>Playwright:</strong> Growing rapidly, backed by Microsoft, excellent documentation</p>
<p><strong>Puppeteer:</strong> Mature ecosystem, large community, extensive third-party tools</p>

<h2>Conclusion</h2>
<p>For modern test automation with cross-browser support, Playwright is the better choice. For Chrome-specific tasks like PDF generation or web scraping, Puppeteer remains excellent. Both tools are actively maintained and suitable for production use.</p>`,
    keywords: "playwright, puppeteer, browser automation, comparison, test automation, web scraping, chrome automation",
    metaDescription: "Comprehensive comparison of Playwright vs Puppeteer for browser automation in 2026. Learn which tool is best for your testing and automation needs.",
    featuredImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800",
  },
];

async function seedBlog() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  try {
    console.log("Starting blog seed...");
    
    for (const article of articles) {
      const [result] = await connection.execute(
        `INSERT INTO blog_posts (title, slug, content, excerpt, authorId, status, publishedAt, featuredImage, metaDescription, keywords, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, 1, 'published', NOW(), ?, ?, ?, NOW(), NOW())
         ON DUPLICATE KEY UPDATE
         content = VALUES(content),
         excerpt = VALUES(excerpt),
         featuredImage = VALUES(featuredImage),
         metaDescription = VALUES(metaDescription),
         keywords = VALUES(keywords),
         updatedAt = NOW()`,
        [
          article.title,
          article.slug,
          article.content,
          article.excerpt,
          article.featuredImage,
          article.metaDescription,
          article.keywords,
        ]
      );
      console.log(`✓ Seeded: ${article.title}`);
    }
    
    console.log("\n✅ Blog seed completed successfully!");
  } catch (error) {
    console.error("Error seeding blog:", error);
  } finally {
    await connection.end();
  }
}

seedBlog();
