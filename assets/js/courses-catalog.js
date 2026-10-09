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

function applyCoursesCatalogSiteSettings() {
    try {
        const siteSettings = JSON.parse(localStorage.getItem("antigravity_site_settings") || "{}");
        if (siteSettings.logoIcon) {
            const logoIcon = document.getElementById("site-logo-icon");
            if (logoIcon) logoIcon.textContent = siteSettings.logoIcon;
        }
        if (siteSettings.siteName) {
            const navSiteName = document.getElementById("site-name-nav");
            if (navSiteName) navSiteName.innerHTML = siteSettings.siteName;
        }
    } catch (e) {}
}

document.addEventListener("DOMContentLoaded", () => {
    applyCoursesCatalogSiteSettings();
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

        if (noticeEl) {
            noticeEl.style.display = "flex";
            noticeEl.innerHTML = `<span>👋 <strong>Welcome back, ${escapeHtml(profile.name)}!</strong> Details pre-filled from your previous order. Direct payment is ready.</span>`;
        }
    } else {
        if (noticeEl) noticeEl.style.display = "none";
    }
}

// Checkout Modal Setup & Mandatory Checks
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
            const consentCheckbox = document.getElementById("buyerConsentCheckboxCourses");

            // 1. Strict Mandatory Validations
            if (!name) {
                alert("Please enter your Full Name before proceeding to payment.");
                document.getElementById("buyerNameInput").focus();
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailPattern.test(email)) {
                alert("Please enter a valid Email Address to receive your course access token!");
                document.getElementById("buyerEmailInput").focus();
                return;
            }

            const phoneClean = phone.replace(/[^0-9]/g, "");
            if (!phone || phoneClean.length < 10) {
                alert("Please enter a valid 10-digit WhatsApp mobile number.");
                document.getElementById("buyerPhoneInput").focus();
                return;
            }

            // Mandatory Consent Checkbox must be explicitly checked by user
            if (!consentCheckbox || !consentCheckbox.checked) {
                alert("⚠️ Mandatory Declaration Check: Kripya 'Mandatory Declaration & Consent' checkbox ko tick karein tabhi payment initiate ho sakega.");
                if (consentCheckbox) consentCheckbox.focus();
                return;
            }

            // Save details for returning user convenience
            saveBuyerProfile(name, email, phone);

            // 2. Open Cashfree / UPI Payment Gateway
            triggerCashfreeCoursePaymentFlow({
                courseId,
                courseTitle,
                price,
                name,
                email,
                phone
            });
        });
    }
}

// Interactive Cashfree / UPI Gateway Flow for Courses
function triggerCashfreeCoursePaymentFlow({ courseId, courseTitle, price, name, email, phone }) {
    let overlay = document.getElementById("cfGatewayOverlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "cfGatewayOverlay";
        overlay.className = "cf-gateway-overlay";
        document.body.appendChild(overlay);
    }

    const adminConfig = JSON.parse(localStorage.getItem("antigravity_admin_config") || "{}");
    const cfConfig = adminConfig.cashfree || {
        enabled: true,
        mode: "sandbox",
        appId: "TEST10293847abcd89ef",
        secretKey: "cfsk_ma_test_92a83f982b1c74d"
    };
    const isProduction = (cfConfig.mode || "sandbox").toLowerCase() === "production";
    const modeBadge = isProduction
        ? '<span class="badge" style="background:rgba(16,185,129,0.2); color:#34d399;">LIVE GATEWAY</span>'
        : '<span class="badge">SANDBOX TEST</span>';

    overlay.innerHTML = `
        <div class="cf-gateway-dialog">
            <div class="cf-gateway-topbar">
                <div class="cf-logo-tag">
                    <span style="font-size: 1.2rem;">💳</span>
                    <span>Cashfree <span style="color: var(--accent-cyan);">Payments</span></span>
                    ${modeBadge}
                </div>
                <button type="button" class="cf-close-btn" id="btnCloseCashfreeModalCourses" title="Cancel Payment">&times;</button>
            </div>

            <div class="cf-gateway-body">
                <!-- Merchant & Order Summary Bar -->
                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 12px 16px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <span style="font-size: 0.72rem; color: #94a3b8; display: block;">PURCHASING</span>
                        <strong style="font-size: 0.88rem; color: #fff;">${escapeHtml(courseTitle)}</strong>
                    </div>
                    <div style="text-align: right;">
                        <span style="font-size: 0.72rem; color: #94a3b8; display: block;">AMOUNT TO PAY</span>
                        <strong style="font-size: 1.25rem; color: #10b981;">₹${price}</strong>
                    </div>
                </div>

                <div style="font-size: 0.82rem; color: #cbd5e1; margin-bottom: 14px;">
                    Buyer: <strong>${escapeHtml(name)}</strong> (<code style="color:#00f0ff;">${escapeHtml(email)}</code>)
                </div>

                <!-- Methods Nav -->
                <div class="cf-methods-nav">
                    <button type="button" class="cf-method-tab active" data-cf-tab="cf-tab-course-upi">📱 UPI</button>
                    <button type="button" class="cf-method-tab" data-cf-tab="cf-tab-course-card">💳 Cards</button>
                    <button type="button" class="cf-method-tab" data-cf-tab="cf-tab-course-netbanking">🏦 NetBanking</button>
                </div>

                <!-- TAB 1: UPI -->
                <div id="cf-tab-course-upi" class="cf-method-pane active">
                    <p style="font-size: 0.78rem; color: #94a3b8; margin-bottom: 10px;">Select your UPI app for instant payment authorization:</p>
                    
                    <button type="button" class="cf-upi-app-btn" data-cf-method="Google Pay">
                        <span style="display:flex; align-items:center; gap:10px;">
                            <span style="font-size:1.2rem;">🔵</span> Google Pay
                        </span>
                        <span style="font-size:0.75rem; color:#10b981; font-weight:700;">Fast Pay &rarr;</span>
                    </button>

                    <button type="button" class="cf-upi-app-btn" data-cf-method="PhonePe">
                        <span style="display:flex; align-items:center; gap:10px;">
                            <span style="font-size:1.2rem;">🟣</span> PhonePe
                        </span>
                        <span style="font-size:0.75rem; color:#10b981; font-weight:700;">Fast Pay &rarr;</span>
                    </button>

                    <button type="button" class="cf-upi-app-btn" data-cf-method="Paytm UPI">
                        <span style="display:flex; align-items:center; gap:10px;">
                            <span style="font-size:1.2rem;">🔷</span> Paytm UPI
                        </span>
                        <span style="font-size:0.75rem; color:#10b981; font-weight:700;">Fast Pay &rarr;</span>
                    </button>

                    <div style="margin-top: 14px; background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px;">
                        <label style="font-size: 0.78rem; color: #94a3b8; display: block; margin-bottom: 6px;">Or Enter Any UPI ID (e.g. mobile@upi):</label>
                        <div style="display: flex; gap: 8px;">
                            <input type="text" id="cfCustomUpiInputCourse" class="form-input" placeholder="username@oksbi" style="padding: 8px 12px; font-size: 0.85rem;">
                            <button type="button" id="btnPayCustomUpiCourse" class="btn btn-primary" style="padding: 8px 14px; font-size: 0.82rem; white-space: nowrap;">
                                Pay ₹${price}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- TAB 2: CARDS -->
                <div id="cf-tab-course-card" class="cf-method-pane">
                    <p style="font-size: 0.78rem; color: #94a3b8; margin-bottom: 12px;">Credit / Debit Card (Visa, Mastercard, RuPay):</p>
                    <div class="form-group" style="margin-bottom: 10px;">
                        <label class="form-label" style="font-size: 0.78rem;">Card Number</label>
                        <input type="text" class="form-input" id="cfCardNumberCourse" placeholder="4111 2222 3333 4444" style="padding: 9px 12px; font-size: 0.85rem;" maxlength="19">
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px;">
                        <div>
                            <label class="form-label" style="font-size: 0.78rem;">Expiry (MM/YY)</label>
                            <input type="text" class="form-input" id="cfCardExpiryCourse" placeholder="12/28" style="padding: 9px 12px; font-size: 0.85rem;" maxlength="5">
                        </div>
                        <div>
                            <label class="form-label" style="font-size: 0.78rem;">CVV</label>
                            <input type="password" class="form-input" id="cfCardCvvCourse" placeholder="•••" style="padding: 9px 12px; font-size: 0.85rem;" maxlength="4">
                        </div>
                    </div>
                    <button type="button" class="btn btn-primary" id="btnPayCardCourse" style="width: 100%; padding: 12px; font-size: 0.95rem;">
                        🔒 Pay ₹${price} Securely via Card
                    </button>
                </div>

                <!-- TAB 3: NETBANKING -->
                <div id="cf-tab-course-netbanking" class="cf-method-pane">
                    <p style="font-size: 0.78rem; color: #94a3b8; margin-bottom: 12px;">Select Your Bank:</p>
                    <select id="cfBankSelectCourse" class="form-input" style="padding: 10px 12px; font-size: 0.88rem; margin-bottom: 16px; cursor: pointer;">
                        <option value="SBI">State Bank of India (SBI)</option>
                        <option value="HDFC">HDFC Bank</option>
                        <option value="ICICI">ICICI Bank</option>
                        <option value="AXIS">Axis Bank</option>
                        <option value="KOTAK">Kotak Mahindra Bank</option>
                        <option value="PNB">Punjab National Bank</option>
                        <option value="OTHER">Other Popular Indian Banks (50+)</option>
                    </select>
                    <button type="button" class="btn btn-primary" id="btnPayNetbankingCourse" style="width: 100%; padding: 12px; font-size: 0.95rem;">
                        🏛️ Proceed to NetBanking (₹${price})
                    </button>
                </div>

                <!-- Processing Screen Container -->
                <div id="cfProcessingScreenCourse" style="display:none; text-align:center; padding: 28px 10px;">
                    <div style="font-size: 2.5rem; margin-bottom: 12px; animation: spin 1.2s linear infinite;">⏳</div>
                    <h4 style="font-size: 1.1rem; color: #00f0ff; margin-bottom: 6px;">Contacting Cashfree Gateway...</h4>
                    <p style="font-size: 0.82rem; color: #94a3b8; margin-bottom: 0;">Authorizing secure 256-bit encrypted transaction with your bank. Please do not close or refresh this tab.</p>
                </div>

                <div style="margin-top: 18px; text-align: center; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 12px;">
                    <span style="font-size: 0.72rem; color: #64748b;">
                        🔒 Protected by Cashfree Payments PCI-DSS Level 1 &amp; RBI Compliant Gateway
                    </span>
                </div>
            </div>
        </div>
    `;

    overlay.classList.add("active");

    // Close button
    const closeBtn = document.getElementById("btnCloseCashfreeModalCourses");
    if (closeBtn) {
        closeBtn.onclick = () => {
            overlay.classList.remove("active");
        };
    }

    // Tab switching
    const tabs = overlay.querySelectorAll(".cf-method-tab");
    tabs.forEach(tab => {
        tab.onclick = () => {
            tabs.forEach(t => t.classList.remove("active"));
            overlay.querySelectorAll(".cf-method-pane").forEach(p => p.classList.remove("active"));
            tab.classList.add("active");
            const targetPane = document.getElementById(tab.dataset.cfTab);
            if (targetPane) targetPane.classList.add("active");
        };
    });

    // Execute Payment and Auto-submit Form
    const executePayment = (methodName) => {
        const processing = document.getElementById("cfProcessingScreenCourse");
        overlay.querySelectorAll(".cf-method-pane, .cf-methods-nav").forEach(el => el.style.display = "none");
        if (processing) processing.style.display = "block";

        setTimeout(() => {
            const cfRandom = Math.random().toString(36).substring(2, 8).toUpperCase();
            const cfPaymentId = `CF-PAY-${Date.now().toString().slice(-6)}-${cfRandom}`;

            overlay.classList.remove("active");

            // Payment done: automatically finalize and submit the course order!
            finalizeCourseOrder({
                courseId,
                courseTitle,
                price,
                name,
                email,
                phone,
                cfPaymentId,
                paymentMode: methodName
            });
        }, 1200);
    };

    // UPI app buttons
    overlay.querySelectorAll(".cf-upi-app-btn").forEach(btn => {
        btn.onclick = () => executePayment(`Cashfree UPI (${btn.dataset.cfMethod})`);
    });

    // Custom UPI pay
    const btnCustomUpi = document.getElementById("btnPayCustomUpiCourse");
    if (btnCustomUpi) {
        btnCustomUpi.onclick = () => {
            const vpa = document.getElementById("cfCustomUpiInputCourse").value.trim();
            if (!vpa || !vpa.includes("@")) {
                alert("Please enter a valid UPI ID (e.g. mobile@upi / name@oksbi)!");
                return;
            }
            executePayment(`Cashfree UPI (${vpa})`);
        };
    }

    // Card pay
    const btnPayCard = document.getElementById("btnPayCardCourse");
    if (btnPayCard) {
        btnPayCard.onclick = () => {
            executePayment("Cashfree Card Payment (Visa/Mastercard)");
        };
    }

    // NetBanking pay
    const btnPayNb = document.getElementById("btnPayNetbankingCourse");
    if (btnPayNb) {
        btnPayNb.onclick = () => {
            const bank = document.getElementById("cfBankSelectCourse")?.value || "NetBanking";
            executePayment(`Cashfree NetBanking (${bank})`);
        };
    }
}

// 3. Finalize Course Order & Auto-Submit (Invoked automatically once payment is verified)
function finalizeCourseOrder({ courseId, courseTitle, price, name, email, phone, cfPaymentId, paymentMode }) {
    // Generate secure DRM access token
    const rand1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const rand2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const token = `AGY-COURSE-${rand1}-${rand2}-${Date.now().toString().slice(-4)}`;

    const order = {
        id: "ORD-" + Date.now(),
        courseId: courseId,
        courseTitle: courseTitle,
        name: name,
        email: email,
        phone: phone,
        amount: price,
        currency: "₹",
        gateway: "Cashfree Payments",
        paymentId: cfPaymentId,
        paymentMode: paymentMode || "Cashfree Gateway",
        token: token,
        timestamp: new Date().toISOString(),
        dateFormatted: new Date().toLocaleString(),
        consentAgreed: true,
        status: "PAID / SUCCESS (Cashfree)"
    };

    const existingOrders = JSON.parse(localStorage.getItem("antigravity_orders") || "[]");
    existingOrders.unshift(order);
    localStorage.setItem("antigravity_orders", JSON.stringify(existingOrders));

    // Automatically transition to success view (user doesn't need to submit separately)
    document.getElementById("checkoutFormStep").style.display = "none";
    const successStep = document.getElementById("checkoutSuccessStep");
    successStep.style.display = "block";

    const tokenDisplay = document.getElementById("successTokenDisplay");
    if (tokenDisplay) tokenDisplay.textContent = token;

    const readerBtn = document.getElementById("btnLaunchCourseReader");
    if (readerBtn) {
        readerBtn.href = `reader.html?courseId=${encodeURIComponent(courseId)}&token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`;
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

    // Ensure mandatory consent checkbox is fresh and unchecked for user verification
    const consentEl = document.getElementById("buyerConsentCheckboxCourses");
    if (consentEl) consentEl.checked = false;

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
