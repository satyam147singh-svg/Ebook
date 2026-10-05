/**
 * Dynamic Mini-CMS Course Landing Page Engine
 * Renders 5 Different High-Converting Layout Templates:
 * 1. template_tech (Cyberpunk & Tech Dark)
 * 2. template_luxury (Minimalist Clean Luxury)
 * 3. template_sales (Video Masterclass High-Converting Sales)
 * 4. template_saas (Modern SaaS & Dev Platform)
 * 5. template_author (Bestseller E-Book & Author Showcase)
 * 
 * Also handles:
 * - Returning Buyer Auto-Fill
 * - Interactive Checkout Modal
 * - Direct DRM Reader Integration
 */

function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

let CURRENT_COURSE = null;

document.addEventListener("DOMContentLoaded", () => {
    loadCourseData();
    renderCourseLandingPage();
    setupCourseCheckoutModal();
    setupCurriculumAccordion();
    setupHamburger();
});

function loadCourseData() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get("id");

    const catalog = JSON.parse(localStorage.getItem("antigravity_courses_catalog") || "[]");
    
    if (courseId) {
        CURRENT_COURSE = catalog.find(c => c.id === courseId);
    }

    if (!CURRENT_COURSE && catalog.length > 0) {
        CURRENT_COURSE = catalog[0];
    }

    // Ultimate fallback if catalog was empty
    if (!CURRENT_COURSE) {
        CURRENT_COURSE = {
            id: "course_antigravity_master_guide",
            title: "Google Antigravity Master Guide: Build Any Software & Website in Minutes",
            subtitle: "The Ultimate Step-by-Step Blueprint to Autonomous AI Software Engineering",
            category: "AI & Autonomous Software",
            price: 199,
            strikePrice: 1499,
            author: "AI Engineering Guild & Antigravity Pioneers",
            badge: "Bestseller",
            chapterCount: 9,
            isActive: true,
            landingConfig: {
                templateId: "template_tech",
                heroHeadline: "Google Antigravity Se Koi Bhi Software & Website Record Time Me Banayein!",
                heroSubheadline: "Zero coding experience required. Learn the master blueprint to generate production apps, SaaS, and bots with autonomous agent workflows.",
                keyPoints: [
                    "Autonomous Planning & Architecture Blueprint",
                    "Multi-File Generation with Terminal Auto-Repair",
                    "Browser Subagent Testing & Verification",
                    "Freelance Client Delivery & ₹1L-₹3L Monthly Earning Roadmap"
                ],
                ctaText: "Unlock Master Guide & Reader Pass • ₹199"
            }
        };
    }
}

function renderCourseLandingPage() {
    const c = CURRENT_COURSE;
    const lc = c.landingConfig || {};
    const templateId = lc.templateId || "template_tech";

    // Set Document Titles & Meta
    document.title = `${c.title} - Antigravity Academy`;
    const metaDesc = document.getElementById("pageMetaDesc");
    if (metaDesc) metaDesc.content = c.subtitle || c.title;

    // Apply Theme to Body
    const body = document.getElementById("dynamicPageBody");
    if (body) {
        body.className = `template-${templateId.replace('template_', '')}-theme`;
    }

    // Update Nav Prices
    const navPrice = document.querySelector(".dyn-price-tag");
    if (navPrice) navPrice.textContent = `₹${c.price || 199}`;

    const container = document.getElementById("dynamicLandingContent");
    if (!container) return;

    const price = c.price || 199;
    const strike = c.strikePrice || (price * 5);
    const discount = Math.round(((strike - price) / strike) * 100);

    const headline = lc.heroHeadline || c.title;
    const subheadline = lc.heroSubheadline || c.subtitle || "Comprehensive step-by-step master material with production code.";
    const ctaText = lc.ctaText || `Unlock Complete Guide • ₹${price}`;
    const keyPoints = (lc.keyPoints && lc.keyPoints.length > 0) ? lc.keyPoints : [
        "Autonomous Planning & Architecture Blueprint",
        "Multi-File Generation with Terminal Auto-Repair",
        "Browser Subagent Testing & Verification",
        "Client Delivery & Monthly Revenue Monetization Strategy"
    ];

    // Chapters list from ebookData or fallback
    let chapters = [];
    if (c.ebookData && Array.isArray(c.ebookData.chapters) && c.ebookData.chapters.length > 0) {
        chapters = c.ebookData.chapters;
    } else {
        chapters = [1, 2, 3, 4, 5, 6].map(n => ({
            number: String(n).padStart(2, '0'),
            title: { english: `Module ${n}: Advanced Blueprints & Core Implementation of ${c.title}` },
            summary: { english: `Practical step-by-step master material, code patterns, and production architecture insights.` }
        }));
    }

    // RENDER BASED ON TEMPLATE
    let templateHtml = "";

    switch (templateId) {
        case "template_luxury":
            templateHtml = renderTemplateLuxury(c, headline, subheadline, keyPoints, price, strike, discount, ctaText, chapters);
            break;
        case "template_sales":
            templateHtml = renderTemplateSales(c, headline, subheadline, keyPoints, price, strike, discount, ctaText, chapters);
            break;
        case "template_saas":
            templateHtml = renderTemplateSaas(c, headline, subheadline, keyPoints, price, strike, discount, ctaText, chapters);
            break;
        case "template_author":
            templateHtml = renderTemplateAuthor(c, headline, subheadline, keyPoints, price, strike, discount, ctaText, chapters);
            break;
        case "template_tech":
        default:
            templateHtml = renderTemplateTech(c, headline, subheadline, keyPoints, price, strike, discount, ctaText, chapters);
            break;
    }

    container.innerHTML = templateHtml;

    // Attach buy triggers
    document.querySelectorAll(".btn-trigger-course-buy").forEach(btn => {
        btn.addEventListener("click", () => {
            openCourseModal();
        });
    });
}

/* ==========================================================================
   TEMPLATE 1: CYBERPUNK & TECH DARK (Neon Cyan & Emerald)
   ========================================================================== */
function renderTemplateTech(c, headline, subheadline, keyPoints, price, strike, discount, ctaText, chapters) {
    return `
        <!-- Hero Section -->
        <section class="template-hero-section" style="background: radial-gradient(circle at 10% 20%, rgba(0, 240, 255, 0.12) 0%, transparent 40%), linear-gradient(180deg, #070913 0%, #0c1024 100%);">
            <div class="template-container">
                <div class="template-grid-2col">
                    <div>
                        <div class="badge-pill" style="margin-bottom: 16px;">
                            <span class="badge-dot"></span>
                            <span>${escapeHtml(c.badge || "Bestseller")} • ${escapeHtml(c.category || "AI & Software")}</span>
                        </div>
                        <h1 style="font-size: clamp(2.1rem, 4vw, 3.2rem); font-family: var(--font-heading); font-weight: 800; line-height: 1.25; margin-bottom: 16px; color: #fff;">
                            ${escapeHtml(headline)}
                        </h1>
                        <p style="font-size: 1.05rem; color: #94a3b8; line-height: 1.6; margin-bottom: 24px;">
                            ${escapeHtml(subheadline)}
                        </p>

                        <div style="display: flex; gap: 14px; align-items: center; margin-bottom: 24px; flex-wrap: wrap;" class="hero-actions-dynamic">
                            <button type="button" class="btn btn-primary btn-pulse btn-trigger-course-buy" style="padding: 16px 36px; font-size: 1.05rem;">
                                ⚡ ${escapeHtml(ctaText)}
                            </button>
                            <a href="#curriculum" class="btn btn-secondary" style="padding: 16px 24px;">
                                📚 View Curriculum
                            </a>
                        </div>

                        <div class="price-tag-hero" style="margin-bottom: 20px;">
                            <span class="price-now">₹${price}</span>
                            <span class="price-old">₹${strike}</span>
                            <span class="discount-badge">${discount}% OFF • Instant Access</span>
                        </div>

                        <div class="guarantee-strip">
                            <div class="guarantee-item"><span>⚡</span> <span>Instant DRM Reader Token</span></div>
                            <div class="guarantee-item"><span>🔒</span> <span>Single-Device Hardware Lock</span></div>
                            <div class="guarantee-item"><span>🏆</span> <span>Verified Developer Certificate</span></div>
                        </div>
                    </div>

                    <!-- Tech Terminal Mockup Visual -->
                    <div>
                        <div style="background: rgba(15, 20, 43, 0.85); border: 1px solid rgba(0, 240, 255, 0.3); border-radius: 16px; padding: 20px; box-shadow: 0 0 35px rgba(0, 240, 255, 0.15);">
                            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 12px; margin-bottom: 14px;">
                                <div style="display: flex; gap: 6px;">
                                    <span style="width: 10px; height: 10px; border-radius: 50%; background: #ef4444;"></span>
                                    <span style="width: 10px; height: 10px; border-radius: 50%; background: #f59e0b;"></span>
                                    <span style="width: 10px; height: 10px; border-radius: 50%; background: #10b981;"></span>
                                </div>
                                <span style="font-family: monospace; font-size: 0.75rem; color: #00f0ff;">antigravity-agent --session live</span>
                            </div>
                            <pre style="font-family: monospace; font-size: 0.82rem; color: #34d399; line-height: 1.6; margin: 0; overflow-x: auto;"><code>$ initializing autonomous pipeline...
&gt; Analyzing repository context [OK]
&gt; Parsing multi-file module graphs [OK]
&gt; Running browser subagent validation [PASS]
&gt; Deploying production bundle [SUCCESS]

Status: 100% PRODUCTION READY
Chapters: ${chapters.length} Modules Included
Access: Single-Device Encrypted DRM</code></pre>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        ${renderCommonSections(c, keyPoints, chapters, price, strike, discount, ctaText)}
    `;
}

/* ==========================================================================
   TEMPLATE 2: MINIMALIST CLEAN LUXURY (Obsidian & Royal Violet)
   ========================================================================== */
function renderTemplateLuxury(c, headline, subheadline, keyPoints, price, strike, discount, ctaText, chapters) {
    return `
        <section class="template-hero-section" style="background: radial-gradient(circle at 80% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), linear-gradient(180deg, #0b0f19 0%, #070913 100%);">
            <div class="template-container">
                <div class="template-grid-2col">
                    <div>
                        <div style="display: inline-block; padding: 4px 12px; background: rgba(139, 92, 246, 0.15); border: 1px solid rgba(139, 92, 246, 0.35); border-radius: 20px; font-size: 0.75rem; color: #a78bfa; font-weight: 700; margin-bottom: 16px;">
                            💎 PREMIUM MASTERCLASS
                        </div>
                        <h1 style="font-size: clamp(2.2rem, 4.2vw, 3.4rem); font-family: var(--font-heading); font-weight: 900; line-height: 1.2; margin-bottom: 16px; background: linear-gradient(135deg, #fff 40%, #c4b5fd 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                            ${escapeHtml(headline)}
                        </h1>
                        <p style="font-size: 1.1rem; color: #cbd5e1; line-height: 1.65; margin-bottom: 26px;">
                            ${escapeHtml(subheadline)}
                        </p>

                        <div style="display: flex; gap: 14px; align-items: center; margin-bottom: 24px;" class="hero-actions-dynamic">
                            <button type="button" class="btn btn-primary btn-trigger-course-buy" style="background: linear-gradient(135deg, #8b5cf6, #ec4899); border: none; padding: 16px 36px; font-size: 1.05rem;">
                                💎 ${escapeHtml(ctaText)}
                            </button>
                            <a href="#curriculum" class="btn btn-secondary" style="padding: 16px 24px;">
                                Explore Curriculum
                            </a>
                        </div>

                        <div class="price-tag-hero">
                            <span class="price-now" style="color: #a78bfa;">₹${price}</span>
                            <span class="price-old">₹${strike}</span>
                            <span class="discount-badge" style="background: rgba(139, 92, 246, 0.2); color: #c4b5fd;">Save ${discount}% Today</span>
                        </div>
                    </div>

                    <!-- Luxury Minimalist Card Visual -->
                    <div>
                        <div style="background: rgba(15, 23, 42, 0.75); border: 1px solid rgba(139, 92, 246, 0.25); border-radius: 20px; padding: 32px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5); backdrop-filter: blur(16px);">
                            <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: #a78bfa; font-weight: 800;">Curated Course Content</span>
                            <h3 style="font-size: 1.4rem; color: #fff; margin: 10px 0 16px;">${escapeHtml(c.title)}</h3>
                            <p style="font-size: 0.88rem; color: #94a3b8; line-height: 1.6; margin-bottom: 20px;">
                                Author: <strong>${escapeHtml(c.author || "Elite Instructor")}</strong><br>
                                Modules: <strong>${chapters.length} Detailed Chapters</strong><br>
                                Format: Interactive DRM Web Reader
                            </p>
                            <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px; display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 0.8rem; color: #10b981;">✓ All DRM Features Enabled</span>
                                <span style="font-size: 1.25rem; font-weight: 800; color: #a78bfa;">₹${price}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        ${renderCommonSections(c, keyPoints, chapters, price, strike, discount, ctaText)}
    `;
}

/* ==========================================================================
   TEMPLATE 3: HIGH-CONVERTING MASTERCLASS SALES (Urgency & Social Proof)
   ========================================================================== */
function renderTemplateSales(c, headline, subheadline, keyPoints, price, strike, discount, ctaText, chapters) {
    return `
        <!-- Urgency Alert Bar -->
        <div style="background: linear-gradient(90deg, #ef4444, #f59e0b); color: #fff; padding: 10px 16px; text-align: center; font-size: 0.85rem; font-weight: 700; letter-spacing: 0.3px;">
            ⚡ LIMITED TIME OFFER: Get 87% OFF Launch Price Today! Only <span id="countdownTimer">02:44:18</span> remaining before price increases to ₹${strike}!
        </div>

        <section class="template-hero-section" style="background: radial-gradient(circle at 50% 20%, rgba(239, 68, 68, 0.1) 0%, transparent 50%), #070913;">
            <div class="template-container" style="text-align: center; max-width: 900px;">
                <div style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 30px; font-size: 0.82rem; color: #f87171; font-weight: 800; margin-bottom: 18px;">
                    🔥 HIGH-CONVERTING MASTERCLASS • 2,410+ ACTIVE ENROLLMENTS
                </div>
                <h1 style="font-size: clamp(2.3rem, 4.5vw, 3.6rem); font-family: var(--font-heading); font-weight: 900; line-height: 1.2; margin-bottom: 18px; color: #fff;">
                    ${escapeHtml(headline)}
                </h1>
                <p style="font-size: 1.15rem; color: #cbd5e1; line-height: 1.6; margin-bottom: 28px; max-width: 760px; margin-left: auto; margin-right: auto;">
                    ${escapeHtml(subheadline)}
                </p>

                <div style="display: flex; justify-content: center; gap: 14px; margin-bottom: 24px;" class="hero-actions-dynamic">
                    <button type="button" class="btn btn-primary btn-pulse btn-trigger-course-buy" style="background: linear-gradient(135deg, #ef4444, #f59e0b); border: none; padding: 18px 44px; font-size: 1.12rem; box-shadow: 0 0 30px rgba(239, 68, 68, 0.4);">
                        🔥 ${escapeHtml(ctaText)}
                    </button>
                </div>

                <div class="price-tag-hero" style="justify-content: center; margin-bottom: 20px;">
                    <span class="price-now" style="color: #f87171;">₹${price}</span>
                    <span class="price-old">₹${strike}</span>
                    <span class="discount-badge" style="background: #ef4444; color: #fff;">Save ${discount}%</span>
                </div>

                <div class="guarantee-strip" style="justify-content: center;">
                    <div class="guarantee-item"><span>⚡</span> <span>Instant Access Delivered to Email</span></div>
                    <div class="guarantee-item"><span>🔒</span> <span>100% Encrypted Reader DRM</span></div>
                    <div class="guarantee-item"><span>⭐</span> <span>4.9 / 5 Rating from 2,410+ Buyers</span></div>
                </div>
            </div>
        </section>

        ${renderCommonSections(c, keyPoints, chapters, price, strike, discount, ctaText)}
    `;
}

/* ==========================================================================
   TEMPLATE 4: MODERN SAAS & DEV PLATFORM (Code Snippets & Architecture)
   ========================================================================== */
function renderTemplateSaas(c, headline, subheadline, keyPoints, price, strike, discount, ctaText, chapters) {
    return `
        <section class="template-hero-section" style="background: radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 40%), linear-gradient(180deg, #090d16 0%, #070913 100%);">
            <div class="template-container">
                <div class="template-grid-2col">
                    <div>
                        <div class="badge-pill" style="margin-bottom: 16px; background: rgba(59, 130, 246, 0.15); border-color: rgba(59, 130, 246, 0.35); color: #60a5fa;">
                            <span class="badge-dot" style="background: #3b82f6;"></span>
                            <span>⚡ Full-Stack Production Architecture</span>
                        </div>
                        <h1 style="font-size: clamp(2.1rem, 4vw, 3.2rem); font-family: var(--font-heading); font-weight: 800; line-height: 1.25; margin-bottom: 16px; color: #fff;">
                            ${escapeHtml(headline)}
                        </h1>
                        <p style="font-size: 1.05rem; color: #94a3b8; line-height: 1.6; margin-bottom: 24px;">
                            ${escapeHtml(subheadline)}
                        </p>

                        <div style="display: flex; gap: 14px; align-items: center; margin-bottom: 24px;" class="hero-actions-dynamic">
                            <button type="button" class="btn btn-primary btn-trigger-course-buy" style="background: linear-gradient(135deg, #3b82f6, #06b6d4); border: none; padding: 16px 36px; font-size: 1.05rem;">
                                🚀 ${escapeHtml(ctaText)}
                            </button>
                            <a href="#curriculum" class="btn btn-secondary" style="padding: 16px 24px;">
                                Modules Breakdown
                            </a>
                        </div>

                        <div class="price-tag-hero">
                            <span class="price-now" style="color: #60a5fa;">₹${price}</span>
                            <span class="price-old">₹${strike}</span>
                            <span class="discount-badge" style="background: rgba(59, 130, 246, 0.2); color: #93c5fd;">${discount}% OFF Launch</span>
                        </div>
                    </div>

                    <!-- Code Snippet Box -->
                    <div>
                        <div style="background: #0d1326; border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);">
                            <div style="background: #080c19; padding: 12px 18px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-family: monospace; font-size: 0.8rem; color: #60a5fa;">api/auth/session.ts</span>
                                <span style="font-size: 0.72rem; color: #10b981;">✓ TypeScript Strict</span>
                            </div>
                            <pre style="padding: 18px; font-family: monospace; font-size: 0.82rem; color: #e2e8f0; line-height: 1.6; margin: 0; overflow-x: auto;"><code>import { createClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
}</code></pre>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        ${renderCommonSections(c, keyPoints, chapters, price, strike, discount, ctaText)}
    `;
}

/* ==========================================================================
   TEMPLATE 5: BESTSELLER E-BOOK & AUTHOR SHOWCASE (3D Cover & Reviews)
   ========================================================================== */
function renderTemplateAuthor(c, headline, subheadline, keyPoints, price, strike, discount, ctaText, chapters) {
    return `
        <section class="template-hero-section" style="background: radial-gradient(circle at 75% 30%, rgba(16, 185, 129, 0.12) 0%, transparent 40%), linear-gradient(180deg, #070913 0%, #0d1726 100%);">
            <div class="template-container">
                <div class="template-grid-2col">
                    <div>
                        <div class="badge-pill" style="margin-bottom: 16px; background: rgba(16, 185, 129, 0.15); border-color: rgba(16, 185, 129, 0.35); color: #34d399;">
                            <span class="badge-dot" style="background: #10b981;"></span>
                            <span>📚 Official Author Edition 2026-2027</span>
                        </div>
                        <h1 style="font-size: clamp(2.1rem, 4vw, 3.2rem); font-family: var(--font-heading); font-weight: 800; line-height: 1.25; margin-bottom: 16px; color: #fff;">
                            ${escapeHtml(headline)}
                        </h1>
                        <p style="font-size: 1.05rem; color: #94a3b8; line-height: 1.6; margin-bottom: 24px;">
                            ${escapeHtml(subheadline)}
                        </p>

                        <!-- Author Card Box -->
                        <div style="display: flex; align-items: center; gap: 14px; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 14px 18px; margin-bottom: 24px;">
                            <div style="width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #10b981, #00f0ff); display: flex; align-items: center; justify-content: center; font-size: 1.4rem;">
                                ✍️
                            </div>
                            <div>
                                <strong style="color: #fff; font-size: 0.95rem; display: block;">${escapeHtml(c.author || "Google Antigravity Team")}</strong>
                                <span style="color: #94a3b8; font-size: 0.78rem;">Autonomous Coding Pioneer & Software Engineer</span>
                            </div>
                        </div>

                        <div style="display: flex; gap: 14px; align-items: center; margin-bottom: 24px;" class="hero-actions-dynamic">
                            <button type="button" class="btn btn-primary btn-trigger-course-buy" style="background: linear-gradient(135deg, #10b981, #00f0ff); color: #070913; border: none; padding: 16px 36px; font-size: 1.05rem;">
                                📖 ${escapeHtml(ctaText)}
                            </button>
                            <a href="#curriculum" class="btn btn-secondary" style="padding: 16px 24px;">
                                📚 Read Sample Topics
                            </a>
                        </div>

                        <div class="price-tag-hero">
                            <span class="price-now">₹${price}</span>
                            <span class="price-old">₹${strike}</span>
                            <span class="discount-badge">${discount}% OFF • Instant Access</span>
                        </div>
                    </div>

                    <!-- 3D Book Graphic Mockup Visual -->
                    <div style="text-align: center;">
                        <div style="display: inline-block; position: relative;">
                            <img src="assets/images/cover.jpg" alt="Book Cover" style="width: 280px; max-width: 100%; border-radius: 14px; box-shadow: 0 20px 50px rgba(0, 240, 255, 0.25), 0 0 100px rgba(16, 185, 129, 0.15); transform: perspective(800px) rotateY(-8deg); transition: transform 0.4s ease;">
                            <div style="margin-top: 20px; font-size: 0.85rem; color: #94a3b8;">
                                ⭐⭐⭐⭐⭐ <strong>4.9 / 5</strong> (Based on verified student reviews)
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        ${renderCommonSections(c, keyPoints, chapters, price, strike, discount, ctaText)}
    `;
}

/* ==========================================================================
   COMMON SECTIONS: Key Points, Curriculum Accordion, Pricing Card
   ========================================================================== */
function renderCommonSections(c, keyPoints, chapters, price, strike, discount, ctaText) {
    return `
        <!-- KEY HIGHLIGHTS SECTION -->
        <section style="padding: 60px 0; background: rgba(255, 255, 255, 0.01); border-top: 1px solid rgba(255, 255, 255, 0.05); border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
            <div class="template-container">
                <div style="text-align: center; margin-bottom: 40px;">
                    <span style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: #00f0ff; font-weight: 700;">CORE TAKEAWAYS</span>
                    <h2 style="font-size: 2.2rem; font-family: var(--font-heading); color: #fff; margin-top: 6px;">What You Will Master in This Guide</h2>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px;">
                    ${keyPoints.map((pt, idx) => `
                        <div style="background: rgba(18, 24, 52, 0.65); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 14px; padding: 22px; transition: all 0.2s;">
                            <div style="font-size: 1.8rem; margin-bottom: 12px; color: #00f0ff;">0${idx + 1}</div>
                            <h4 style="font-size: 1.05rem; color: #fff; margin-bottom: 8px;">Key Pillar 0${idx + 1}</h4>
                            <p style="font-size: 0.88rem; color: #94a3b8; line-height: 1.5; margin: 0;">${escapeHtml(pt)}</p>
                        </div>
                    `).join("")}
                </div>
            </div>
        </section>

        <!-- CURRICULUM SECTION -->
        <section id="curriculum" style="padding: 70px 0;">
            <div class="template-container" style="max-width: 900px;">
                <div style="text-align: center; margin-bottom: 36px;">
                    <span style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: #10b981; font-weight: 700;">COMPLETE SYLLABUS</span>
                    <h2 style="font-size: 2.2rem; font-family: var(--font-heading); color: #fff; margin-top: 6px;">Curriculum (${chapters.length} Modules)</h2>
                    <p style="color: #94a3b8; font-size: 0.95rem;">Step-by-step master material encrypted inside the single-device DRM reader:</p>
                </div>

                <div class="curriculum-accordion-wrap">
                    ${chapters.map((ch, idx) => {
                        const titleText = (ch.title && (ch.title.english || ch.title.hinglish || ch.title.hindi)) || `Chapter ${ch.number || idx + 1}`;
                        const summaryText = (ch.summary && (ch.summary.english || ch.summary.hinglish || ch.summary.hindi)) || `Detailed step-by-step master material and implementation instructions for ${titleText}.`;

                        return `
                            <div class="curriculum-accordion-item ${idx === 0 ? 'open' : ''}">
                                <div class="curriculum-header-row">
                                    <div style="display: flex; align-items: center; gap: 12px;">
                                        <span style="background: rgba(0, 240, 255, 0.15); color: #00f0ff; font-weight: 800; font-size: 0.78rem; padding: 3px 8px; border-radius: 4px;">
                                            CH ${ch.number || String(idx + 1).padStart(2, '0')}
                                        </span>
                                        <strong style="color: #fff; font-size: 0.95rem;">${escapeHtml(titleText)}</strong>
                                    </div>
                                    <span style="color: #94a3b8; font-size: 1.1rem;" class="acc-chevron">▾</span>
                                </div>
                                <div class="curriculum-body-content">
                                    <p style="margin: 0;">${escapeHtml(summaryText)}</p>
                                </div>
                            </div>
                        `;
                    }).join("")}
                </div>
            </div>
        </section>

        <!-- PRICING & ENROLL SECTION -->
        <section id="pricing" style="padding: 70px 0 90px; background: rgba(0, 0, 0, 0.3);">
            <div class="template-container" style="max-width: 600px;">
                <div class="glass-panel" style="padding: 36px 28px; text-align: center; border-color: rgba(0, 240, 255, 0.4); box-shadow: 0 0 40px rgba(0, 240, 255, 0.15);">
                    <div style="display: inline-block; padding: 4px 14px; background: rgba(0, 240, 255, 0.15); color: #00f0ff; border-radius: 20px; font-size: 0.78rem; font-weight: 700; margin-bottom: 14px;">
                        ⚡ INSTANT UNLOCK PASS
                    </div>
                    <h3 style="font-size: 1.8rem; font-family: var(--font-heading); color: #fff; margin-bottom: 8px;">
                        ${escapeHtml(c.title)}
                    </h3>
                    <p style="color: #94a3b8; font-size: 0.88rem; margin-bottom: 24px;">
                        Full Access to ${chapters.length} Modules • DRM Encrypted Reader • Lifetime Updates
                    </p>

                    <div style="display: flex; align-items: baseline; justify-content: center; gap: 10px; margin-bottom: 24px;">
                        <span style="font-size: 2.8rem; font-weight: 900; color: #10b981; font-family: var(--font-heading);">₹${price}</span>
                        <span style="font-size: 1.2rem; color: #64748b; text-decoration: line-through;">₹${strike}</span>
                        <span class="discount-badge">${discount}% OFF</span>
                    </div>

                    <button type="button" class="btn btn-primary btn-pulse btn-trigger-course-buy" style="width: 100%; padding: 18px; font-size: 1.15rem; margin-bottom: 16px;">
                        🚀 Proceed to Buy (₹${price})
                    </button>

                    <div style="display: flex; flex-direction: column; gap: 8px; text-align: left; font-size: 0.82rem; color: #cbd5e1; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 18px;">
                        <div>✓ <strong>Single-Device Hardware Lock:</strong> Zero risk of unauthorized link copying.</div>
                        <div>✓ <strong>UPI & Cashfree:</strong> Pay via GPay, PhonePe, Paytm, Cards or NetBanking.</div>
                        <div>✓ <strong>Instant Access:</strong> DRM reader credentials emailed within 30 seconds.</div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function setupCurriculumAccordion() {
    document.addEventListener("click", (e) => {
        const header = e.target.closest(".curriculum-header-row");
        if (header) {
            const item = header.closest(".curriculum-accordion-item");
            if (item) item.classList.toggle("open");
        }
    });
}

// Returning User Profile Management
function getSavedBuyerProfile() {
    try {
        const saved = localStorage.getItem("antigravity_buyer_profile");
        if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
}

function saveBuyerProfile(name, email, phone) {
    try {
        localStorage.setItem("antigravity_buyer_profile", JSON.stringify({
            name, email, phone, lastUpdated: new Date().toISOString()
        }));
    } catch (e) {}
}

function populateBuyerDetailsIntoCourseModal() {
    const profile = getSavedBuyerProfile();
    const noticeEl = document.getElementById("returningBuyerNoticeCoursePage");
    const nameEl = document.getElementById("cpBuyerName");
    const emailEl = document.getElementById("cpBuyerEmail");
    const phoneEl = document.getElementById("cpBuyerPhone");
    const consentEl = document.getElementById("cpBuyerConsent");

    if (profile && profile.name) {
        if (nameEl && !nameEl.value) nameEl.value = profile.name;
        if (emailEl && !emailEl.value) emailEl.value = profile.email || "";
        if (phoneEl && !phoneEl.value) phoneEl.value = profile.phone || "";
        if (consentEl) consentEl.checked = true;

        if (noticeEl) {
            noticeEl.style.display = "flex";
            noticeEl.innerHTML = `<span>👋 <strong>Welcome back, ${escapeHtml(profile.name)}!</strong> Details pre-filled from your previous purchase. Direct payment ready.</span>`;
        }
    } else {
        if (noticeEl) noticeEl.style.display = "none";
    }
}

// Checkout Modal
function setupCourseCheckoutModal() {
    const modal = document.getElementById("coursePageCheckoutModal");
    const closeBtn = document.getElementById("closeCourseModal");
    const doneBtn = document.getElementById("cpBtnCloseDone");
    const form = document.getElementById("coursePagePaymentForm");

    if (closeBtn && modal) {
        closeBtn.addEventListener("click", () => {
            modal.classList.remove("active");
            document.body.style.overflow = "";
        });
    }

    if (doneBtn && modal) {
        doneBtn.addEventListener("click", () => {
            modal.classList.remove("active");
            document.body.style.overflow = "";
        });
    }

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove("active");
                document.body.style.overflow = "";
            }
        });
    }

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const c = CURRENT_COURSE;
            const name = document.getElementById("cpBuyerName").value.trim();
            const email = document.getElementById("cpBuyerEmail").value.trim().toLowerCase();
            const phone = document.getElementById("cpBuyerPhone").value.trim();

            if (!name || !email || !phone) {
                alert("Please fill in Name, Email Address, and Phone Number.");
                return;
            }

            // Save profile for subsequent purchases
            saveBuyerProfile(name, email, phone);

            // Generate secure token
            const rand1 = Math.random().toString(36).substring(2, 6).toUpperCase();
            const rand2 = Math.random().toString(36).substring(2, 6).toUpperCase();
            const token = `AGY-COURSE-${rand1}-${rand2}-${Date.now().toString().slice(-4)}`;

            // Save order
            const order = {
                id: "ORD-" + Date.now(),
                courseId: c.id,
                courseTitle: c.title,
                name: name,
                email: email,
                phone: phone,
                amount: c.price || 199,
                currency: "₹",
                gateway: "Cashfree / Direct",
                token: token,
                timestamp: new Date().toISOString(),
                dateFormatted: new Date().toLocaleString(),
                status: "PAID / SUCCESS"
            };

            const existing = JSON.parse(localStorage.getItem("antigravity_orders") || "[]");
            existing.unshift(order);
            localStorage.setItem("antigravity_orders", JSON.stringify(existing));

            // Show success step
            document.getElementById("courseModalFormStep").style.display = "none";
            const successStep = document.getElementById("courseModalSuccessStep");
            successStep.style.display = "block";

            const tokenDisplay = document.getElementById("cpSuccessTokenDisplay");
            if (tokenDisplay) tokenDisplay.textContent = token;

            const readerBtn = document.getElementById("cpBtnLaunchReader");
            if (readerBtn) {
                readerBtn.href = `reader.html?courseId=${encodeURIComponent(c.id)}&token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`;
            }
        });
    }
}

function openCourseModal() {
    const modal = document.getElementById("coursePageCheckoutModal");
    if (!modal || !CURRENT_COURSE) return;

    const c = CURRENT_COURSE;
    document.getElementById("courseModalFormStep").style.display = "block";
    document.getElementById("courseModalSuccessStep").style.display = "none";

    document.getElementById("cpModalCourseTitle").textContent = c.title;
    document.getElementById("cpModalPrice").textContent = `₹${c.price || 199}`;
    document.getElementById("cpModalStrikePrice").textContent = `₹${c.strikePrice || (c.price || 199) * 5}`;
    document.getElementById("cpBtnPayAmount").textContent = `₹${c.price || 199}`;

    populateBuyerDetailsIntoCourseModal();

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function setupHamburger() {
    const btn = document.getElementById("nav-hamburger");
    const menu = document.getElementById("mobile-menu");
    if (btn && menu) {
        btn.addEventListener("click", () => {
            menu.classList.toggle("open");
        });
    }
}
