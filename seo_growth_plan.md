# ServiceDue SEO & Growth Strategy: Dominate the Dealership Niche 🚀

## 1. High-Intent Keyword Strategy ("The Money Keywords")
We will target **bottom-of-funnel** keywords where the user is ready to buy or deeply frustrated with their current process.

### Primary Keyword Clusters:
*   **Problem-Aware:** "reduce dealership service churn", "increase service center revenue", "lost customer recovery scripts"
*   **Solution-Aware:** "two-wheeler service CRM", "whatsapp automation for automobile dealers", "garage management software with whatsapp"
*   **Brand-Specific (Programmatic):** "Suzuki dealership CRM", "Honda service center automation software", "Royal Enfield customer follow-up tool"

## 2. Technical SEO & AEO (Answer Engine Optimization)
To rank in AI overviews (Gemini/ChatGPT/Perplexity), we must speak their language: **Structured Data**.

### Implementation Plan:
*   **Dynamic Meta Tags:** Replace static HTML tags with `react-helmet-async` for unique titles per page.
*   **JSON-LD Schemas:** Inject structured data on every page.
    *   `SoftwareApplication` Schema (Ratings, Price, OS).
    *   `FAQPage` Schema (for Q&A sections).
    *   `Organization` Schema (Logo, Social Proof).
*   **Sitemap & Robots:** Ensure clean crawling paths.

## 3. Programmatic SEO Architecture (The Scale Engine)
We cannot manually write pages for every city and brand. We will build a **Template Engine**.

**URL Structure:** `/solutions/{brand}-service-crm`
*   *Example:* `/solutions/suzuki-service-crm`
*   *Example:* `/solutions/hero-service-crm`
*   *Example:* `/solutions/tvs-service-crm`

**Dynamic Content Injection:**
*   Headline: "The #1 Service CRM for **{Brand}** Dealers"
*   Copy: "Integrates with **{Brand}** DMS to recover lost revenue."
*   Meta Title: "Best WhatsApp Automation for **{Brand}** Service Centers"

## 4. E-E-A-T (Trust Signals)
*   **About Page:** Highlight "By Dealers, For Dealers" expertise.
*   **Case Studies:** "How a Pune Suzuki Dealer recovered ₹5L/month".
*   **Legal:** We already added Privacy/Terms (Good start!).

---

## Action Plan (Execution Steps)

1.  **[TECH]** Install `react-helmet-async` for dynamic SEO.
2.  **[TECH]** Create `SEOHead` component with JSON-LD Injection.
3.  **[CONTENT]** Create "Programmatic Landing Page" template (`/src/pages/solutions/IndustryPage.tsx`).
4.  **[CONTENT]** Create Data Dictionary for Brands (Suzuki, Hero, Honda, Bajaj, Yamaha, Royal Enfield).
5.  **[TECH]** Generate `sitemap.xml` and `robots.txt`.
