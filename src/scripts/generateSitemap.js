// src/utils/sitemapGenerator.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Your website URL - update this to your GitHub Pages URL
const WEBSITE_URL = 'https://arbeauty.ca';

// Get current date for lastmod
const getCurrentDate = () => new Date().toISOString().split('T')[0];

// Function to get all route paths from your React components
function getRoutePaths() {
  // Add your routes here. This is just an example - modify according to your routes
  return [
    '/',
    // Add more routes as needed
  ];
}

// Generate sitemap XML content
function generateSitemapXml(routes) {
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${WEBSITE_URL}${route}</loc>
    <lastmod>${getCurrentDate()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xmlContent;
}

// Main function to generate sitemap
export function generateSitemap() {
  try {
    // Get all routes
    const routes = getRoutePaths();
    
    // Generate sitemap content
    const sitemapContent = generateSitemapXml(routes);
    
    // Write to public folder
    const publicPath = path.resolve(__dirname, '../../../public');
    
    // Create public directory if it doesn't exist
    if (!fs.existsSync(publicPath)) {
      fs.mkdirSync(publicPath, { recursive: true });
    }
    
    // Write sitemap file
    fs.writeFileSync(
      path.join(publicPath, 'sitemap.xml'),
      sitemapContent
    );
    
    console.log('Sitemap generated successfully!');
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

// If running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSitemap();
}