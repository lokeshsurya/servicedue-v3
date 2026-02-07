import fs from 'fs';
import { industryData } from './src/content/industryData.ts';

const baseUrl = 'https://servicedueapp.in';

const staticRoutes = [
    '',
    '/pricing',
    '/how-it-works',
    '/contact',
    '/privacy',
    '/terms',
    '/waitlist'
];

const generateSitemap = () => {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticRoutes.map(route => `
    <url>
        <loc>${baseUrl}${route}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${route === '' ? '1.0' : '0.8'}</priority>
    </url>
    `).join('')}
    ${industryData.map(page => `
    <url>
        <loc>${baseUrl}/solutions/${page.slug}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    `).join('')}
</urlset>`;

    fs.writeFileSync('./public/sitemap.xml', sitemap);
    console.log('✅ Sitemap generated successfully at public/sitemap.xml');
};

generateSitemap();
