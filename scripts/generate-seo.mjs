import { mkdir, writeFile } from "node:fs/promises";

const siteUrl = (process.env.SITE_URL || process.env.VITE_SITE_URL || "https://example.com").replace(/\/$/, "");
const updated = new Date().toISOString().slice(0, 10);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${siteUrl}/</loc><lastmod>${updated}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>${siteUrl}/founder/</loc><lastmod>${updated}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
</urlset>
`;

const robots = `User-agent: *
Allow: /
Disallow: /login
Disallow: /signup
Disallow: /customer
Disallow: /customer-demo
Disallow: /provider
Disallow: /provider-demo
Disallow: /ceo
Disallow: /admin-demo
Sitemap: ${siteUrl}/sitemap.xml
`;

const founder = `<!doctype html>
<html lang="en-IN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Aryan — Founder and CEO of ARANCH PASS</title>
<meta name="description" content="Aryan is the founder and CEO of ARANCH PASS, a pre-launch physical and digital service-identity platform for service providers in India.">
<link rel="canonical" href="${siteUrl}/founder/">
<meta property="og:type" content="profile"><meta property="og:title" content="Aryan — Founder and CEO of ARANCH PASS"><meta property="og:url" content="${siteUrl}/founder/">
<meta name="robots" content="index,follow">
<script type="application/ld+json">${JSON.stringify({
  "@context":"https://schema.org","@type":"Person","@id":`${siteUrl}/founder/#aryan`,name:"Aryan",jobTitle:"Founder and CEO",worksFor:{"@type":"Organization","@id":`${siteUrl}/#organization`,name:"ARANCH PASS",url:`${siteUrl}/`}
})}</script>
<style>body{margin:0;background:rgb(243,240,214);color:#2e0759;font-family:Arial,sans-serif}.wrap{max-width:850px;margin:auto;padding:32px 24px 90px}nav{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #d9d0dc;padding-bottom:22px}a{color:inherit}.brand{font-weight:900}.brand span{color:#f4ad08}.eyebrow{margin-top:90px;font:700 12px monospace;letter-spacing:2px;color:#4d1688}h1{font-size:clamp(50px,9vw,92px);line-height:.92;letter-spacing:-4px;margin:20px 0 28px}p{font-size:18px;line-height:1.7;max-width:680px;color:#5d4b62}.note{margin-top:48px;padding:24px;background:#f7f0d8;border-left:6px solid #f4ad08;font-size:14px}.back{font:700 12px monospace;letter-spacing:1px}</style></head>
<body><main class="wrap"><nav><div class="brand">ARANCH <span>PASS</span></div><a class="back" href="${siteUrl}/">BACK TO WEBSITE</a></nav><div class="eyebrow">FOUNDER PROFILE</div><h1>Aryan<br>Founder &amp; CEO.</h1><p>Aryan is the founder and CEO of ARANCH PASS. He is leading the product, software and early pilot design for a physical–digital service identity intended to help service providers keep completed jobs connected to the assets they maintain.</p><p>ARANCH PASS is currently in pre-launch development. The product, physical materials, provider pilots and commercial model are still being validated.</p><div class="note">This page intentionally publishes only the founder information approved for public use. Verified professional profile links and formal company-entity details can be added later.</div></main></body></html>`;

await mkdir(new URL("../public/founder/", import.meta.url), { recursive: true });
await Promise.all([
  writeFile(new URL("../public/sitemap.xml", import.meta.url), sitemap),
  writeFile(new URL("../public/robots.txt", import.meta.url), robots),
  writeFile(new URL("../public/founder/index.html", import.meta.url), founder),
]);
console.log(`SEO files generated for ${siteUrl}`);
