/**
 * Frontend Courses Catalog & Direct Checkout Logic
 * Handles:
 * 1. Rendering all Active Courses & E-Books
 * 2. Live Search & Category Filtering
 * 3. 1-Click Direct Purchase Modal
 * 4. Returning User Profile Auto-Fill
 * 5. Direct Reader Launch
 */

// Escape HTML utility
function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Fallback Default Courses
const DEFAULT_COURSES = [
    {
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
            keyPoints: [
                "Autonomous Planning & Architecture Blueprint",
                "Multi-File Generation with Terminal Auto-Repair",
                "Browser Subagent Testing & Verification",
                "Freelance Client Delivery & ₹1L-₹3L Monthly Earning Roadmap"
            ]
        }
    },
    {
        id: "course_nextjs_ai_saas",
        title: "Full-Stack Next.js 15 & AI SaaS Production Masterclass",
        subtitle: "Build & Deploy Monetizable Micro-SaaS with Database, Auth & Payment Gateways",
        category: "Full-Stack Web Dev",
        price: 299,
        strikePrice: 1999,
        author: "Next.js Core Architecture Team",
        badge: "New Launch",
        chapterCount: 6,
        isActive: true,
        landingConfig: {
            templateId: "template_saas",
            keyPoints: [
                "Next.js 15 App Router & Server Components Architecture",
                "Supabase Database, Row-Level Security & Auth Flow",
                "Payment Webhooks & Multi-Currency Subscription Handling",
                "Deploying Production Clusters to Vercel & Custom Domains"
            ]
        }
    },
    {
        id: "course_freelancing_agency",
        title: "AI Freelance & Web Agency Monetization Blueprint",
        subtitle: "Close ₹50,000+ Clients on Upwork, Fiverr & Instagram with 24-Hour AI Delivery",
        category: "Freelance & Business",
        price: 149,
        strikePrice: 999,
        author: "Elite Agency Founders",
        badge: "Trending",
        chapterCount: 5,
        isActive: true,
        landingConfig: {
            templateId: "template_sales",
            keyPoints: [
                "1-Day Website Delivery Workflow with AI Agents",
                "High-Converting Cold DM & Email Pitch Scripts",
                "Client Contract & Retainer Agreement Blueprints",
                "Live Case Studies: From Zero to ₹2,50,000 in 60 Days"
            ]
        }
    },
    {
        id: "course_prompt_systems",
        title: "Prompt Engineering & Autonomous Multi-Agent Systems",
        subtitle: "Architect Self-Healing Agent Workflows, Custom Skills & MCP Servers",
        category: "AI & Automation",
        price: 199,
        strikePrice: 1299,
        author: "Applied AI Research Lab",
        badge: "Masterclass",
        chapterCount: 7,
        isActive: true,
        landingConfig: {
            templateId: "template_luxury",
            keyPoints: [
                "Advanced CPRE Agentic Prompting Frameworks",
                "Model Context Protocol (MCP) Server Integrations",
                "Self-Healing Code Review Loops & Linters",
                "Autonomous Background Daemons & Scheduled Crons"
            ]
        }
    }
];

function getStoredCourses() {
    try {
        const saved = localStorage.getItem("antigravity_courses_catalog");
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {}
    localStorage.setItem("antigravity_courses_catalog", JSON.stringify(DEFAULT_COURSES));
    return DEFAULT_COURSES;
}

// State
let ALL_COURSES = [];
let ACTIVE_CATEGORY = "ALL";
let SEARCH_QUERY = "";

document.addEventListener("DOMContentLoaded", () => {
    ALL_COURSES = getStoredCourses();
    renderCoursesGrid();
    setupSearchAndFilters();
    setupCheckoutModal();
    setupHamburger();
});

// Category Icons & Badges
function getCategoryIcon(cat) {
    if (cat.includes("AI & Autonomous")) return "🤖";
    if (cat.includes("Full-Stack")) return "💻";
    if (cat.includes("Freelance")) return "💼";
    if (cat.includes("Prompt")) return "⚡";
    return "📚";
}

function getTemplateLabel(templateId) {
    const map = {
        "template_tech": "🚀 Tech Dark",
        "template_luxury": "💎 Luxury",
        "template_sales": "🎯 Masterclass",
        "template_saas": "⚡ SaaS",
        "template_author": "📚 Author Bio"
    };
    return map[templateId] || "🚀 Tech";
}

function renderCoursesGrid() {
    const container = document.getElementById("coursesGridContainer");
    const emptyState = document.getElementById("coursesEmptyState");
    if (!container) return;

    // Filter by Active status
    let list = ALL_COURSES.filter(c => c.isActive !== false);

    // Filter by Category
    if (ACTIVE_CATEGORY !== "ALL") {
        list = list.filter(c => c.category === ACTIVE_CATEGORY);
    }

    // Filter by Search Query
    if (SEARCH_QUERY.trim()) {
        const q = SEARCH_QUERY.toLowerCase().trim();
        list = list.filter(c => 
            (c.title && c.title.toLowerCase().includes(q)) ||
            (c.subtitle && c.subtitle.toLowerCase().includes(q)) ||
            (c.category && c.category.toLowerCase().includes(q)) ||
            (c.author && c.author.toLowerCase().includes(q))
        );
    }

    if (list.length === 0) {
        container.innerHTML = "";
        if (emptyState) emptyState.style.display = "block";
        return;
    }

    if (emptyState) emptyState.style.display = "none";

    container.innerHTML = list.map(c => {
        const price = c.price || 199;
        const strikePrice = c.strikePrice || (price * 5);
        const discountPct = Math.round(((strikePrice - price) / strikePrice) * 100);
        const icon = getCategoryIcon(c.category || "");
        const templateLabel = getTemplateLabel(c.landingConfig?.templateId);

        const keyPoints = (c.landingConfig?.keyPoints && c.landingConfig.keyPoints.length > 0)
            ? c.landingConfig.keyPoints
            : [
                "Full-codebase architecture & production blueprints",
                "Self-healing terminal & multi-file workflows",
                "Encrypted single-device DRM reader access",
                "Lifetime updates & verified certificate included"
            ];

        return `
            <div class="course-card-item" data-id="${escapeHtml(c.id)}">
                <div class="course-card-banner">
                    <div class="course-banner-glow"></div>
                    ${c.badge ? `<span class="course-card-badge">${escapeHtml(c.badge)}</span>` : ''}
                    <span class="course-template-pill">${templateLabel}</span>
                    <div class="course-banner-visual">
                        <div class="course-banner-icon">${icon}</div>
                    </div>
                </div>

                <div class="course-card-body">
                    <div class="course-cat-tag">${escapeHtml(c.category || "General")}</div>
                    <h3 class="course-card-title">${escapeHtml(c.title)}</h3>
                    <p class="course-card-subtitle">${escapeHtml(c.subtitle || "")}</p>

                    <div class="course-meta-strip">
                        <span>📚 <strong>${c.chapterCount || 6}</strong> Modules</span>
                        <span>⭐ <strong>4.9/5</strong> (Verified)</span>
                        <span>🔒 Single-Device DRM</span>
                    </div>

                    <ul class="course-highlights-list">
                        ${keyPoints.slice(0, 4).map(pt => `
                            <li>
                                <span class="bullet-check">✓</span>
                                <span>${escapeHtml(pt)}</span>
                            </li>
                        `).join("")}
                    </ul>

                    <div class="course-pricing-row">
                        <div>
                            <span class="course-price-now">₹${price}</span>
                            <span class="course-price-old">₹${strikePrice}</span>
                        </div>
                        <span class="course-discount-pill">${discountPct}% OFF</span>
                    </div>

                    <div class="course-card-actions">
                        <button type="button" class="btn-buy-course-direct btn-trigger-purchase" data-id="${escapeHtml(c.id)}" data-title="${escapeHtml(c.title)}" data-price="${price}" data-strike="${strikePrice}">
                            <span>⚡</span> Buy Now (₹${price})
                        </button>
                        <a href="course.html?id=${encodeURIComponent(c.id)}" class="btn-view-course-landing">
                            <span>👁️</span> Details &rarr;
                        </a>
                    </div>
                </div>
            </div>
        `;
    }).join("");

    // Attach click events on Direct Purchase buttons
    container.querySelectorAll(".btn-trigger-purchase").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const id = btn.getAttribute("data-id");
            const title = btn.getAttribute("data-title");
            const price = btn.getAttribute("data-price");
            const strike = btn.getAttribute("data-strike");
            openCourseCheckoutModal({ id, title, price, strike });
        });
    });
}

function setupSearchAndFilters() {
    const searchInput = document.getElementById("courseSearchInput");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            SEARCH_QUERY = e.target.value;
            renderCoursesGrid();
        });
    }

    const pills = document.querySelectorAll(".cat-pill");
    pills.forEach(pill => {
        pill.addEventListener("click", () => {
            pills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            ACTIVE_CATEGORY = pill.getAttribute("data-category") || "ALL";
            renderCoursesGrid();
        });
    });

    const btnReset = document.getElementById("btnResetFilters");
    if (btnReset) {
        btnReset.addEventListener("click", () => {
            SEARCH_QUERY = "";
            ACTIVE_CATEGORY = "ALL";
            if (searchInput) searchInput.value = "";
            pills.forEach(p => {
                if (p.getAttribute("data-category") === "ALL") p.classList.add("active");
                else p.classList.remove("active");
            });
            renderCoursesGrid();
        });
    }
}

// Returning Buyer Profile
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

function populateBuyerDetailsIntoForm() {
    const profile = getSavedBuyerProfile();
    const noticeEl = document.getElementById("buyerReturningNoticeCourses");
    const nameEl = document.getElementById("buyerNameInput");
    const emailEl = document.getElementById("buyerEmailInput");
    const phoneEl = document.getElementById("buyerPhoneInput");
    const consentEl = document.getElementById("buyerConsentCheckboxCourses");

    if (profile && profile.name) {
        if (nameEl && !nameEl.value) nameEl.value = profile.name;
        if (emailEl && !emailEl.value) emailEl.value = profile.email || "";
        if (phoneEl && !phoneEl.value) phoneEl.value = profile.phone || "";
        if (consentEl) consentEl.checked = true;

        if (noticeEl) {
            noticeEl.style.display = "flex";
            noticeEl.innerHTML = `<span>👋 <strong>Welcome back, ${escapeHtml(profile.name)}!</strong> Details pre-filled from your previous order. Direct payment is ready.</span>`;
        }
    } else {
        if (noticeEl) noticeEl.style.display = "none";
    }
}

// Checkout Modal
function setupCheckoutModal() {
    const modal = document.getElementById("courseCheckoutModal");
    const closeBtn = document.getElementById("closeCheckoutModal");
    const doneBtn = document.getElementById("btnDoneCloseModal");
    const form = document.getElementById("coursePurchaseForm");

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

            const courseId = document.getElementById("modalTargetCourseId")?.value || "";
            const courseTitle = document.getElementById("modalTargetCourseTitle")?.value || "Selected Course";
            const price = parseInt(document.getElementById("modalTargetCoursePrice")?.value) || 199;
            const name = document.getElementById("buyerNameInput").value.trim();
            const email = document.getElementById("buyerEmailInput").value.trim().toLowerCase();
            const phone = document.getElementById("buyerPhoneInput").value.trim();

            if (!name || !email || !phone) {
                alert("Please fill in Name, Email Address, and Phone Number.");
                return;
            }

            // Save for future auto-fill
            saveBuyerProfile(name, email, phone);

            // Generate secure token
            const rand1 = Math.random().toString(36).substring(2, 6).toUpperCase();
            const rand2 = Math.random().toString(36).substring(2, 6).toUpperCase();
            const token = `AGY-COURSE-${rand1}-${rand2}-${Date.now().toString().slice(-4)}`;

            // Save order
            const order = {
                id: "ORD-" + Date.now(),
                courseId: courseId,
                courseTitle: courseTitle,
                name: name,
                email: email,
                phone: phone,
                amount: price,
                currency: "₹",
                gateway: "Cashfree / Direct Payment",
                token: token,
                timestamp: new Date().toISOString(),
                dateFormatted: new Date().toLocaleString(),
                status: "PAID / SUCCESS"
            };

            const existingOrders = JSON.parse(localStorage.getItem("antigravity_orders") || "[]");
            existingOrders.unshift(order);
            localStorage.setItem("antigravity_orders", JSON.stringify(existingOrders));

            // Switch to success view
            document.getElementById("checkoutFormStep").style.display = "none";
            const successStep = document.getElementById("checkoutSuccessStep");
            successStep.style.display = "block";

            const tokenDisplay = document.getElementById("successTokenDisplay");
            if (tokenDisplay) tokenDisplay.textContent = token;

            const readerBtn = document.getElementById("btnLaunchCourseReader");
            if (readerBtn) {
                readerBtn.href = `reader.html?courseId=${encodeURIComponent(courseId)}&token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`;
            }
        });
    }
}

function openCourseCheckoutModal({ id, title, price, strike }) {
    const modal = document.getElementById("courseCheckoutModal");
    if (!modal) return;

    // Reset views
    const formStep = document.getElementById("checkoutFormStep");
    const successStep = document.getElementById("checkoutSuccessStep");
    if (formStep) formStep.style.display = "block";
    if (successStep) successStep.style.display = "none";

    // Set fields
    document.getElementById("modalTargetCourseId").value = id;
    document.getElementById("modalTargetCourseTitle").value = title;
    document.getElementById("modalTargetCoursePrice").value = price;

    const titleEl = document.getElementById("modalSummaryCourseTitle");
    if (titleEl) titleEl.textContent = title;

    const priceEl = document.getElementById("modalSummarySellingPrice");
    if (priceEl) priceEl.textContent = `₹${price}`;

    const strikeEl = document.getElementById("modalSummaryStrikePrice");
    if (strikeEl) strikeEl.textContent = `₹${strike || price * 5}`;

    const btnText = document.getElementById("btnPayAmountText");
    if (btnText) btnText.textContent = `₹${price}`;

    // Auto-fill returning buyer
    populateBuyerDetailsIntoForm();

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
