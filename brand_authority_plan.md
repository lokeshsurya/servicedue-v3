# Brand Authority & Instant Indexing Plan 🏆

## The Problem
You searched for "ServiceDue" and found nothing. This is normal for a brand new domain, but we can **force** Google to pay attention.

## The Solution: "Big Brand" Signals

### 1. The Sitemap (Technical)
Google is blind right now. We need to hand it a map of your entire site, including the hidden "Suzuki" and "Hero" pages.
*   **Action:** Generate `public/sitemap.xml` listing all 15+ high-value pages.
*   **Result:** Google indexes deep pages, not just the homepage.

### 2. Knowledge Graph (Identity)
To look like a "Big Brand", you need a Knowledge Panel (the box on the right side of Google).
*   **Action:** Enhance `SEOHead.tsx` with `SameAs` schema.
*   **Result:** Connects your site to LinkedIn, Twitter, and Instagram, signaling you are a real company.

### 3. Google Search Console (The Submission)
*   **Action:** I will provide a guide on how to upload the sitemap we just created to GSC.
*   **Result:** This pushes your site to Google's queue *immediately* instead of waiting weeks.

## Execution Steps
1.  **[CODE]** Create `generate-sitemap.js` to build the XML file dynamically from your data.
2.  **[CODE]** Run the script to output `public/sitemap.xml`.
3.  **[CODE]** Update `SEOHead` with full "Corporation" schema.
4.  **[GUIDE]** Write `BRAND_SETUP.md` with instructions for Google Search Console.
