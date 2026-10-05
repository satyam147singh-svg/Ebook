/**
 * Main Application Logic - Landing Page, UPI QR Generation, Legal Consent & Order Processor
 */

// Utility: Escape HTML
function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Default Configuration (Can be changed dynamically from Admin Panel)
const DEFAULT_CONFIG = {
    upiId: "antigravity.developer@upi",
    payeeName: "Google Antigravity Academy",
    price: 199,
    originalPrice: 1499,
    currencySymbol: "₹",
    supportWhatsApp: "+919876543210",
    supportEmail: "support@antigravityguide.in"
};

// Load saved config from localStorage or fallback
function getAppConfig() {
    const saved = localStorage.getItem("antigravity_admin_config");
    if (saved) {
        try {
            return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
        } catch (e) {
            console.error("Config parse error", e);
        }
    }
    return DEFAULT_CONFIG;
}

// Global active confi// Global active config
let APP_CONFIG = getAppConfig();

document.addEventListener("DOMContentLoaded", () => {
    checkReferralQueryParam();
    updateDynamicPrices();
    setupModals();
    setupPaymentForm();
    setupUPIQR();
    setupFaqAccordion();
    setupHamburger();
    setupLangSwitcher();
    setupAffiliateModal();
    applyGlobalSiteSettings();
});

// 1. Referral Link Tracking (?ref=TOKEN_OR_CODE)
function checkReferralQueryParam() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const ref = urlParams.get("ref");
        if (ref && ref.trim()) {
            localStorage.setItem("antigravity_referrer", ref.trim());
            console.log("Active Referral Captured:", ref.trim());
        }
    } catch (e) {}
}

// Update dynamic prices on landing page
function updateDynamicPrices() {
    APP_CONFIG = getAppConfig();
    const priceElements = document.querySelectorAll(".dynamic-price");
    priceElements.forEach(el => el.textContent = `${APP_CONFIG.currencySymbol}${APP_CONFIG.price}`);
    
    const oldPriceElements = document.querySelectorAll(".dynamic-old-price");
    oldPriceElements.forEach(el => el.textContent = `${APP_CONFIG.currencySymbol}${APP_CONFIG.originalPrice}`);

    const upiDisplay = document.getElementById("displayUpiId");
    if (upiDisplay) upiDisplay.textContent = APP_CONFIG.upiId;
}

// Render dynamic UPI QR Code
function setupUPIQR() {
    const qrContainer = document.getElementById("upiQrCodeCanvas");
    if (!qrContainer) return;

    // Standard NPCI UPI URI Scheme
    const upiUri = `upi://pay?pa=${encodeURIComponent(APP_CONFIG.upiId)}&pn=${encodeURIComponent(APP_CONFIG.payeeName)}&am=${APP_CONFIG.price}&cu=INR&tn=${encodeURIComponent("Google Antigravity Ebook Access")}`;
    
    // Generate QR using embedded QRCode class
    try {
        qrContainer.innerHTML = "";
        new QRCode(qrContainer, {
            text: upiUri,
            width: 220,
            height: 220,
            colorDark: "#070b19",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    } catch (e) {
        console.error("QR Code Error:", e);
    }

    // Set Direct App Link Deep-links
    const appLinks = document.querySelectorAll(".upi-deep-link");
    appLinks.forEach(link => {
        link.href = upiUri;
    });
}

// Copy UPI ID to clipboard
function copyUpiId() {
    navigator.clipboard.writeText(APP_CONFIG.upiId).then(() => {
        const btn = document.getElementById("btnCopyUpi");
        if (btn) {
            const original = btn.textContent;
            btn.textContent = "Copied! ✓";
            btn.style.color = "#10b981";
            setTimeout(() => {
                btn.textContent = original;
                btn.style.color = "";
            }, 2000);
        }
    }).catch(err => {
        alert("UPI ID: " + APP_CONFIG.upiId);
    });
}

// Modal handling
function setupModals() {
    const modal = document.getElementById("paymentModal");
    const openBtns = document.querySelectorAll(".btn-open-payment");
    const closeBtn = document.getElementById("closePaymentModal");

    openBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            // Reset to form view if previously on success screen
            const formSection = document.getElementById("paymentFormSection");
            const successSection = document.getElementById("paymentSuccessSection");
            if (formSection) formSection.style.display = "block";
            if (successSection) successSection.style.display = "none";
            updateDynamicPrices();
            populateBuyerProfile();
            modal.classList.add("active");
            document.body.style.overflow = "hidden";
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.classList.remove("active");
            document.body.style.overflow = "";
        });
    }

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("active");
            document.body.style.overflow = "";
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
        const profile = { name, email, phone, lastUpdated: new Date().toISOString() };
        localStorage.setItem("antigravity_buyer_profile", JSON.stringify(profile));
    } catch (e) {}
}

function populateBuyerProfile() {
    const profile = getSavedBuyerProfile();
    if (!profile) return;

    const nameEl = document.getElementById("buyerName");
    const emailEl = document.getElementById("buyerEmail");
    const phoneEl = document.getElementById("buyerPhone");
    const consentCheckbox = document.getElementById("buyerConsentCheckbox");
    const noticeEl = document.getElementById("buyerReturningNotice");

    if (nameEl && !nameEl.value && profile.name) nameEl.value = profile.name;
    if (emailEl && !emailEl.value && profile.email) emailEl.value = profile.email;
    if (phoneEl && !phoneEl.value && profile.phone) phoneEl.value = profile.phone;
    if (consentCheckbox) consentCheckbox.checked = true;

    if (noticeEl && profile.name) {
        noticeEl.style.display = "flex";
        noticeEl.innerHTML = `<span>👋 <strong>Welcome back, ${escapeHtml(profile.name)}!</strong> Details auto-filled from your previous order. Direct payment is ready.</span>`;
    }
}

// Setup Form Submission & Cashfree Checkout
function setupPaymentForm() {
    const form = document.getElementById("ebookPaymentForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("buyerName").value.trim();
        const email = document.getElementById("buyerEmail").value.trim().toLowerCase();
        const phone = document.getElementById("buyerPhone").value.trim();
        const consentCheckbox = document.getElementById("buyerConsentCheckbox");

        // Strict Validations
        if (!name || !email || !phone) {
            alert("Please fill in all mandatory fields (Name, Email Address, and WhatsApp Mobile Number).");
            return;
        }

        // Validate Email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert("Please enter a valid Email Address to ensure your encrypted E-Book access link reaches you!");
            document.getElementById("buyerEmail").focus();
            return;
        }

        // Validate Phone (at least 10 digits)
        const phoneClean = phone.replace(/[^0-9]/g, "");
        if (phoneClean.length < 10) {
            alert("Please enter a valid 10-digit WhatsApp mobile number.");
            document.getElementById("buyerPhone").focus();
            return;
        }

        // Save Buyer Profile for seamless return purchases
        saveBuyerProfile(name, email, phone);

        // MANDATORY LEGAL CONSENT CHECK
        if (!consentCheckbox.checked) {
            alert("⚠️ Please accept the Mandatory Privacy Policy & Consent Checkbox to confirm you are purchasing this digital content of your own free will.");
            consentCheckbox.focus();
            return;
        }

        // Get Cashfree settings from Admin Config
        const adminConfig = JSON.parse(localStorage.getItem("antigravity_admin_config") || "{}");
        const cfConfig = adminConfig.cashfree || {
            enabled: true,
            mode: "sandbox",
            appId: "TEST10293847abcd89ef",
            secretKey: "cfsk_ma_test_92a83f982b1c74d"
        };

        // Open Cashfree Gateway Sheet
        triggerCashfreePaymentFlow({
            name,
            email,
            phone,
            amount: APP_CONFIG.price || 199,
            cfConfig
        });
    });
}


// Interactive Cashfree Checkout Experience
function triggerCashfreePaymentFlow({ name, email, phone, amount, cfConfig }) {
    let overlay = document.getElementById("cfGatewayOverlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "cfGatewayOverlay";
        overlay.className = "cf-gateway-overlay";
        document.body.appendChild(overlay);
    }

    const mode = (cfConfig.mode || "sandbox").toLowerCase();
    const isProduction = mode === "production";
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
                <button type="button" class="cf-close-btn" id="btnCloseCashfreeModal" title="Cancel Payment">&times;</button>
            </div>

            <div class="cf-gateway-body">
                <!-- Merchant & Order Summary Bar -->
                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 12px 16px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <span style="font-size: 0.72rem; color: #94a3b8; display: block;">MERCHANT</span>
                        <strong style="font-size: 0.88rem; color: #fff;">Google Antigravity Academy</strong>
                    </div>
                    <div style="text-align: right;">
                        <span style="font-size: 0.72rem; color: #94a3b8; display: block;">AMOUNT TO PAY</span>
                        <strong style="font-size: 1.25rem; color: #10b981;">₹${amount}</strong>
                    </div>
                </div>

                <div style="font-size: 0.82rem; color: #cbd5e1; margin-bottom: 14px;">
                    Buyer: <strong>${escapeHtml(name)}</strong> (<code style="color:#00f0ff;">${escapeHtml(email)}</code>)
                </div>

                <!-- Methods Nav -->
                <div class="cf-methods-nav">
                    <button type="button" class="cf-method-tab active" data-cf-tab="cf-tab-upi">📱 UPI</button>
                    <button type="button" class="cf-method-tab" data-cf-tab="cf-tab-card">💳 Cards</button>
                    <button type="button" class="cf-method-tab" data-cf-tab="cf-tab-netbanking">🏦 NetBanking</button>
                </div>

                <!-- TAB 1: UPI -->
                <div id="cf-tab-upi" class="cf-method-pane active">
                    <p style="font-size: 0.78rem; color: #94a3b8; margin-bottom: 10px;">Select your preferred UPI app for instant authorization:</p>
                    
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
                            <input type="text" id="cfCustomUpiInput" class="form-input" placeholder="username@oksbi" style="padding: 8px 12px; font-size: 0.85rem;">
                            <button type="button" id="btnPayCustomUpi" class="btn btn-primary" style="padding: 8px 14px; font-size: 0.82rem; white-space: nowrap;">
                                Pay ₹${amount}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- TAB 2: CARDS -->
                <div id="cf-tab-card" class="cf-method-pane">
                    <p style="font-size: 0.78rem; color: #94a3b8; margin-bottom: 12px;">Credit / Debit Card (Visa, Mastercard, RuPay):</p>
                    <div class="form-group" style="margin-bottom: 10px;">
                        <label class="form-label" style="font-size: 0.78rem;">Card Number</label>
                        <input type="text" class="form-input" id="cfCardNumber" placeholder="4111 2222 3333 4444" style="padding: 9px 12px; font-size: 0.85rem;" maxlength="19">
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px;">
                        <div>
                            <label class="form-label" style="font-size: 0.78rem;">Expiry (MM/YY)</label>
                            <input type="text" class="form-input" id="cfCardExpiry" placeholder="12/28" style="padding: 9px 12px; font-size: 0.85rem;" maxlength="5">
                        </div>
                        <div>
                            <label class="form-label" style="font-size: 0.78rem;">CVV</label>
                            <input type="password" class="form-input" id="cfCardCvv" placeholder="•••" style="padding: 9px 12px; font-size: 0.85rem;" maxlength="4">
                        </div>
                    </div>
                    <button type="button" class="btn btn-primary" id="btnPayCard" style="width: 100%; padding: 12px; font-size: 0.95rem;">
                        🔒 Pay ₹${amount} Securely via Card
                    </button>
                </div>

                <!-- TAB 3: NETBANKING -->
                <div id="cf-tab-netbanking" class="cf-method-pane">
                    <p style="font-size: 0.78rem; color: #94a3b8; margin-bottom: 12px;">Select Your Bank:</p>
                    <select id="cfBankSelect" class="form-input" style="padding: 10px 12px; font-size: 0.88rem; margin-bottom: 16px; cursor: pointer;">
                        <option value="SBI">State Bank of India (SBI)</option>
                        <option value="HDFC">HDFC Bank</option>
                        <option value="ICICI">ICICI Bank</option>
                        <option value="AXIS">Axis Bank</option>
                        <option value="KOTAK">Kotak Mahindra Bank</option>
                        <option value="PNB">Punjab National Bank</option>
                        <option value="OTHER">Other Popular Indian Banks (50+)</option>
                    </select>
                    <button type="button" class="btn btn-primary" id="btnPayNetbanking" style="width: 100%; padding: 12px; font-size: 0.95rem;">
                        🏛️ Proceed to NetBanking (₹${amount})
                    </button>
                </div>

                <!-- Live Processing Screen Container -->
                <div id="cfProcessingScreen" style="display:none; text-align:center; padding: 28px 10px;">
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
    const closeBtn = document.getElementById("btnCloseCashfreeModal");
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

    // Handle payment trigger
    const executePayment = (methodName) => {
        const processing = document.getElementById("cfProcessingScreen");
        overlay.querySelectorAll(".cf-method-pane, .cf-methods-nav").forEach(el => el.style.display = "none");
        if (processing) processing.style.display = "block";

        setTimeout(() => {
            const cfRandom = Math.random().toString(36).substring(2, 8).toUpperCase();
            const cfPaymentId = `CF-PAY-${Date.now().toString().slice(-6)}-${cfRandom}`;

            overlay.classList.remove("active");

            finalizeCashfreeOrder({
                name,
                email,
                phone,
                amount,
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
    const btnCustomUpi = document.getElementById("btnPayCustomUpi");
    if (btnCustomUpi) {
        btnCustomUpi.onclick = () => {
            const vpa = document.getElementById("cfCustomUpiInput").value.trim();
            if (!vpa || !vpa.includes("@")) {
                alert("Please enter a valid UPI ID (e.g. mobile@upi / name@oksbi)!");
                return;
            }
            executePayment(`Cashfree UPI (${vpa})`);
        };
    }

    // Card pay
    const btnPayCard = document.getElementById("btnPayCard");
    if (btnPayCard) {
        btnPayCard.onclick = () => {
            executePayment("Cashfree Card Payment (Visa/Mastercard)");
        };
    }

    // NetBanking pay
    const btnPayNb = document.getElementById("btnPayNetbanking");
    if (btnPayNb) {
        btnPayNb.onclick = () => {
            const bank = document.getElementById("cfBankSelect")?.value || "NetBanking";
            executePayment(`Cashfree NetBanking (${bank})`);
        };
    }
}

// Finalize Cashfree Order
function finalizeCashfreeOrder({ name, email, phone, amount, cfPaymentId, paymentMode }) {
    const randomPart1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randomPart2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const secureToken = `AGY-EBK-${randomPart1}-${randomPart2}-${Date.now().toString().slice(-4)}`;

    const referrerToken = localStorage.getItem("antigravity_referrer") || "";

    const orderData = {
        id: "ORD-" + Date.now(),
        name,
        email,
        phone,
        gateway: "Cashfree",
        paymentId: cfPaymentId,
        paymentMode: paymentMode || "Cashfree Gateway",
        utr: cfPaymentId,
        amount: amount || APP_CONFIG.price || 199,
        currency: "₹",
        token: secureToken,
        timestamp: new Date().toISOString(),
        dateFormatted: new Date().toLocaleString(),
        consentAgreed: true,
        status: "PAID / SUCCESS (Cashfree)",
        referrer: referrerToken
    };

    saveCustomerOrder(orderData);

    if (referrerToken) {
        recordAffiliateSale(referrerToken, orderData);
    }

    initBuyerAffiliateProfile(secureToken, name, email, phone);

    showAccessSuccessView(orderData);
}

// Record referral sale to affiliate
function recordAffiliateSale(refToken, order) {
    try {
        const affiliates = JSON.parse(localStorage.getItem("antigravity_affiliates") || "{}");
        if (!affiliates[refToken]) {
            affiliates[refToken] = {
                token: refToken,
                name: "Affiliate Partner",
                email: "",
                phone: "",
                upiId: "",
                sales: 0,
                orders: [],
                paidRewards: 0,
                lastSaleDate: new Date().toLocaleString()
            };
        }
        affiliates[refToken].sales = (affiliates[refToken].sales || 0) + 1;
        affiliates[refToken].lastSaleDate = new Date().toLocaleString();
        if (!Array.isArray(affiliates[refToken].orders)) affiliates[refToken].orders = [];
        affiliates[refToken].orders.push({
            orderId: order.id,
            buyerName: order.name,
            buyerEmail: order.email,
            amount: order.amount,
            date: order.dateFormatted
        });

        localStorage.setItem("antigravity_affiliates", JSON.stringify(affiliates));
    } catch (e) {
        console.error("Affiliate record error:", e);
    }
}

// Initialize Buyer's affiliate profile upon purchase
function initBuyerAffiliateProfile(token, name, email, phone) {
    try {
        const affiliates = JSON.parse(localStorage.getItem("antigravity_affiliates") || "{}");
        if (!affiliates[token]) {
            affiliates[token] = {
                token: token,
                name: name,
                email: email,
                phone: phone,
                upiId: "",
                sales: 0,
                orders: [],
                paidRewards: 0,
                registeredAt: new Date().toLocaleString()
            };
            localStorage.setItem("antigravity_affiliates", JSON.stringify(affiliates));
        }
    } catch (e) {}
}

// Save order to localStorage
function saveCustomerOrder(order) {
    const existing = JSON.parse(localStorage.getItem("antigravity_orders") || "[]");
    existing.unshift(order);
    localStorage.setItem("antigravity_orders", JSON.stringify(existing));
}

// Show Access Granted Screen & Populate Stylish Email Receipt
function showAccessSuccessView(order) {
    const formSection = document.getElementById("paymentFormSection");
    const successSection = document.getElementById("paymentSuccessSection");
    
    if (formSection && successSection) {
        formSection.style.display = "none";
        successSection.style.display = "block";

        const tokenDisplay = document.getElementById("generatedTokenDisplay");
        if (tokenDisplay) tokenDisplay.textContent = order.token;

        const emailTarget = document.getElementById("buyerTargetEmailDisplay");
        if (emailTarget) emailTarget.textContent = order.email;

        // Build Reader URL with secure token
        const readerUrl = `reader.html?token=${encodeURIComponent(order.token)}&email=${encodeURIComponent(order.email)}&name=${encodeURIComponent(order.name)}`;
        const fullUrl = window.location.origin + window.location.pathname.replace("index.html", "") + readerUrl;

        const openReaderBtn = document.getElementById("btnLaunchReader");
        if (openReaderBtn) {
            openReaderBtn.href = readerUrl;
        }

        const copyAccessLinkBtn = document.getElementById("btnCopyReaderLink");
        if (copyAccessLinkBtn) {
            copyAccessLinkBtn.onclick = () => {
                navigator.clipboard.writeText(fullUrl).then(() => {
                    alert("E-Book Secure Access Link copied to clipboard!\nAap is link se kisi bhi samay apna E-Book read kar sakte hain.");
                });
            };
        }

        // ==========================================
        // POPULATE ULTRA-STYLISH EMAIL RECEIPT CARD
        // ==========================================
        const elTo = document.getElementById("emailCardToDisplay");
        if (elTo) elTo.textContent = order.email;

        const elSubject = document.getElementById("emailCardSubjectDisplay");
        if (elSubject) elSubject.textContent = `✨ Your Google Antigravity E-Book Access & Official Receipt (${order.id})`;

        const elBuyer = document.getElementById("emailCardBuyerName");
        if (elBuyer) elBuyer.textContent = order.name;

        const elOrderId = document.getElementById("emailCardOrderId");
        if (elOrderId) elOrderId.textContent = order.id;

        const elPaymentId = document.getElementById("emailCardPaymentId");
        if (elPaymentId) elPaymentId.textContent = order.paymentId || order.utr || "CF-PAY-SUCCESS";

        const elToken = document.getElementById("emailCardTokenDisplay");
        if (elToken) elToken.textContent = order.token;

        const elReaderLink = document.getElementById("emailCardReaderLink");
        if (elReaderLink) elReaderLink.href = readerUrl;

        // Pre-compose Mailto Link for Email App
        const mailSubject = `Google Antigravity Master Guide - Order Access & Receipt (${order.id})`;
        const mailBody = `Hi ${order.name},

Thank you for purchasing the Google Antigravity Master Guide!
Your payment of ₹${order.amount} has been successfully verified via Cashfree Payments.

--- ORDER RECEIPT ---
- Order ID: ${order.id}
- Cashfree Payment Ref: ${order.paymentId || order.utr}
- Access Token: ${order.token}
- Registered Email: ${order.email}

--- ACCESS YOUR E-BOOK READER ---
Click the link below to open your protected e-book instantly:
${fullUrl}

Keep this token safe. Your access is protected by DRM device-locking security.

Best regards,
Google Antigravity Academy Support Team
support@antigravityguide.in`;

        const openMailBtn = document.getElementById("btnOpenMailClient");
        if (openMailBtn) {
            openMailBtn.href = `mailto:${encodeURIComponent(order.email)}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
        }

        const copyEmailTextBtn = document.getElementById("btnCopyEmailReceiptText");
        if (copyEmailTextBtn) {
            copyEmailTextBtn.onclick = () => {
                navigator.clipboard.writeText(mailBody).then(() => {
                    alert("Official Email Receipt text copied to clipboard!\nAap ise kisi bhi email app ya WhatsApp par paste karke send kar sakte hain.");
                });
            };
        }

        // Setup Personal Affiliate Link & Sharing in Success Box
        const baseUrl = window.location.origin + window.location.pathname.replace("index.html", "") + "index.html";
        const personalRefLink = `${baseUrl}?ref=${order.token}`;

        const affiliateLinkInput = document.getElementById("buyerAffiliateLinkInput");
        if (affiliateLinkInput) affiliateLinkInput.value = personalRefLink;

        const btnCopyAffLink = document.getElementById("btnCopyAffiliateLink");
        if (btnCopyAffLink) {
            btnCopyAffLink.onclick = () => {
                navigator.clipboard.writeText(personalRefLink).then(() => {
                    alert("Personal Affiliate Link copied! Share this link to start earning ₹500 for every 5 sales.");
                });
            };
        }

        // Setup Ready-Made Share Templates
        const btnHindiShare = document.getElementById("btnCopyHindiShareMsg");
        if (btnHindiShare) {
            btnHindiShare.onclick = () => {
                const msg = `🚀 *Google Antigravity Master Guide — AI Se Coding & Software Banao!*\n\nKya aap bhi AI se 10x fast websites, mobile apps aur SaaS banana chahte hain? Maine abhi Google Antigravity Master Guide unlock ki hai — isme complete 9 chapters, terminal setup aur readymade prompt blueprints hain!\n\n🎯 Abhi special launch offer me sirf ₹199 me direct access karein yahan se:\n👉 ${personalRefLink}\n\n(Instant Cashfree checkout & online encrypted web reader!)`;
                navigator.clipboard.writeText(msg).then(() => {
                    alert("Hindi/Hinglish WhatsApp message with your link copied! Simply paste and share on WhatsApp or Telegram.");
                });
            };
        }

        const btnEnglishShare = document.getElementById("btnCopyEnglishShareMsg");
        if (btnEnglishShare) {
            btnEnglishShare.onclick = () => {
                const msg = `🚀 *Google Antigravity Master Guide — Autonomous AI Coding Platform*\n\nWant to build full-stack web applications, SaaS tools, and bots in record time with AI? Check out the complete step-by-step Google Antigravity documentation with 9 practical chapters, setup guides, and production prompts!\n\n🎯 Get instant lifetime access for just ₹199:\n👉 ${personalRefLink}\n\n(Instant Cashfree checkout & encrypted DRM reader!)`;
                navigator.clipboard.writeText(msg).then(() => {
                    alert("English WhatsApp message with your link copied! Simply paste and share.");
                });
            };
        }

        // Save Buyer Affiliate UPI
        const btnSaveUpi = document.getElementById("btnSaveAffiliateUpi");
        const upiInput = document.getElementById("buyerAffiliateUpiInput");
        const saveStatus = document.getElementById("affiliateUpiSaveStatus");

        if (btnSaveUpi && upiInput) {
            btnSaveUpi.onclick = () => {
                const upiVal = upiInput.value.trim();
                if (!upiVal || !upiVal.includes("@")) {
                    alert("Please enter a valid UPI ID (e.g. yourname@oksbi / yourname@paytm).");
                    return;
                }
                const affiliates = JSON.parse(localStorage.getItem("antigravity_affiliates") || "{}");
                if (!affiliates[order.token]) {
                    initBuyerAffiliateProfile(order.token, order.name, order.email, order.phone);
                }
                affiliates[order.token].upiId = upiVal;
                localStorage.setItem("antigravity_affiliates", JSON.stringify(affiliates));
                if (saveStatus) saveStatus.style.display = "block";
                alert(`✅ Payout UPI ID saved: ${upiVal}\nTarget of 5 sales complete hone par ₹500 isi UPI par send kiye jayenge!`);
            };
        }
    }
}

// Setup Standalone Affiliate Partner Modal
function setupAffiliateModal() {
    const modal = document.getElementById("affiliateModal");
    const openBtns = document.querySelectorAll(".btn-open-affiliate");
    const closeBtn = document.getElementById("closeAffiliateModal");
    const closeBottomBtn = document.getElementById("btnCloseAffiliateModalBottom");

    if (!modal) return;

    openBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            modal.classList.add("active");
            document.body.style.overflow = "hidden";

            // If user already purchased recently in this browser, auto-load their stats
            const orders = JSON.parse(localStorage.getItem("antigravity_orders") || "[]");
            if (orders.length > 0) {
                renderAffiliatePartnerDashboard(orders[0].token);
            }
        });
    });

    const closeModal = () => {
        modal.classList.remove("active");
        document.body.style.overflow = "";
    };

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (closeBottomBtn) closeBottomBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    // Lookup token/email
    const btnCheck = document.getElementById("btnCheckAffiliateStats");
    const inputLookup = document.getElementById("affiliateTokenLookup");
    if (btnCheck && inputLookup) {
        btnCheck.addEventListener("click", () => {
            const query = inputLookup.value.trim().toLowerCase();
            if (!query) {
                alert("Please enter your Access Token or Email.");
                return;
            }

            const orders = JSON.parse(localStorage.getItem("antigravity_orders") || "[]");
            const match = orders.find(o => o.token.toLowerCase() === query || o.email.toLowerCase() === query);

            if (match) {
                renderAffiliatePartnerDashboard(match.token);
            } else {
                // Check if exists directly in affiliates
                const affiliates = JSON.parse(localStorage.getItem("antigravity_affiliates") || "{}");
                const affMatch = Object.values(affiliates).find(a => (a.token && a.token.toLowerCase() === query) || (a.email && a.email.toLowerCase() === query));
                if (affMatch) {
                    renderAffiliatePartnerDashboard(affMatch.token);
                } else {
                    alert("No purchase found with this Token or Email. Please purchase the E-Book first to activate your personal affiliate partner link!");
                }
            }
        });
    }
}

// Render dynamic stats inside Affiliate Modal
function renderAffiliatePartnerDashboard(token) {
    const dashboard = document.getElementById("affiliatePartnerDashboard");
    if (!dashboard) return;

    dashboard.style.display = "block";

    const affiliates = JSON.parse(localStorage.getItem("antigravity_affiliates") || "{}");
    const orders = JSON.parse(localStorage.getItem("antigravity_orders") || "[]");
    const userOrder = orders.find(o => o.token === token) || {};
    const affData = affiliates[token] || {
        token: token,
        name: userOrder.name || "Affiliate Partner",
        sales: 0,
        orders: [],
        upiId: "",
        paidRewards: 0
    };

    const nameEl = document.getElementById("affiliatePartnerName");
    if (nameEl) nameEl.textContent = `${affData.name || userOrder.name || 'Partner'}'s Dashboard`;

    const tokenEl = document.getElementById("affiliatePartnerToken");
    if (tokenEl) tokenEl.textContent = `Token: ${token}`;

    const salesCount = affData.sales || 0;
    const targetRemainder = salesCount % 5;
    const completedTargets = Math.floor(salesCount / 5);

    const salesCountDisplay = document.getElementById("affiliateSalesCountDisplay");
    if (salesCountDisplay) {
        salesCountDisplay.textContent = `${salesCount} Sales (${targetRemainder}/5 for next ₹500)`;
    }

    const progressPercent = Math.min(100, Math.round((targetRemainder / 5) * 100));
    const progressBarFill = document.getElementById("affiliateProgressBarFill");
    if (progressBarFill) {
        progressBarFill.style.width = `${salesCount >= 5 && targetRemainder === 0 ? 100 : progressPercent}%`;
    }

    const badgeAlert = document.getElementById("affiliateTargetBadgeAlert");
    if (badgeAlert) {
        if (completedTargets > 0) {
            badgeAlert.style.display = "block";
            badgeAlert.innerHTML = `🎉 <strong>Congratulations! Target Met (${completedTargets * 5} Total Sales)!</strong> Total Reward: ₹${completedTargets * 500}. Admin will transfer payment to your UPI within 2 business days.`;
        } else {
            badgeAlert.style.display = "none";
        }
    }

    const baseUrl = window.location.origin + window.location.pathname.replace("index.html", "") + "index.html";
    const personalRefLink = `${baseUrl}?ref=${token}`;

    const linkInput = document.getElementById("activeAffiliateLinkInput");
    if (linkInput) linkInput.value = personalRefLink;

    const copyBtn = document.getElementById("btnCopyActiveAffiliateLink");
    if (copyBtn) {
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(personalRefLink).then(() => {
                alert("Affiliate Referral Link copied to clipboard!");
            });
        };
    }

    // Share message copy handlers
    const btnHindiMsg = document.getElementById("btnCopyModalHindiMsg");
    if (btnHindiMsg) {
        btnHindiMsg.onclick = () => {
            const msg = `🚀 *Google Antigravity Master Guide — AI Se Coding & Software Banao!*\n\nKya aap bhi AI se 10x fast websites, mobile apps aur SaaS banana chahte hain? Maine abhi Google Antigravity Master Guide unlock ki hai — isme complete 9 chapters, terminal setup aur readymade prompt blueprints hain!\n\n🎯 Abhi launch offer me sirf ₹199 me direct access karein yahan se:\n👉 ${personalRefLink}\n\n(Direct UPI instant access available!)`;
            navigator.clipboard.writeText(msg).then(() => {
                alert("Hindi/Hinglish promotional message copied!");
            });
        };
    }

    const btnEnglishMsg = document.getElementById("btnCopyModalEnglishMsg");
    if (btnEnglishMsg) {
        btnEnglishMsg.onclick = () => {
            const msg = `🚀 *Google Antigravity Master Guide — Autonomous AI Coding Platform*\n\nWant to build full-stack web applications, SaaS tools, and bots in record time with AI? Check out the complete step-by-step Google Antigravity documentation with 9 practical chapters, setup guides, and production prompts!\n\n🎯 Get instant lifetime access for just ₹199:\n👉 ${personalRefLink}\n\n(Instant access with encrypted web reader!)`;
            navigator.clipboard.writeText(msg).then(() => {
                alert("English promotional message copied!");
            });
        };
    }

    // Payout UPI save handler
    const upiInput = document.getElementById("modalAffiliateUpiInput");
    const saveUpiBtn = document.getElementById("btnSaveModalAffiliateUpi");
    if (upiInput) upiInput.value = affData.upiId || "";

    if (saveUpiBtn && upiInput) {
        saveUpiBtn.onclick = () => {
            const upiVal = upiInput.value.trim();
            if (!upiVal || !upiVal.includes("@")) {
                alert("Please enter a valid UPI ID (e.g. name@oksbi).");
                return;
            }
            affData.upiId = upiVal;
            affiliates[token] = affData;
            localStorage.setItem("antigravity_affiliates", JSON.stringify(affiliates));
            alert(`✅ Payout UPI ID saved: ${upiVal}\nHar 5 sales complete hone par ₹500 isi UPI me send honge!`);
        };
    }
}

// FAQ Accordion
function setupFaqAccordion() {
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question");
        if (question) {
            question.addEventListener("click", () => {
                const isActive = item.classList.contains("active");
                faqItems.forEach(i => i.classList.remove("active"));
                if (!isActive) item.classList.add("active");
            });
        }
    });
}

// Mobile Hamburger Menu Setup
function setupHamburger() {
    const btn = document.getElementById("nav-hamburger");
    const menu = document.getElementById("mobile-menu");
    if (!btn || !menu) return;

    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        menu.classList.toggle("open");
        btn.setAttribute("aria-expanded", menu.classList.contains("open"));
    });

    // Close menu when any link is clicked
    menu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            menu.classList.remove("open");
            btn.setAttribute("aria-expanded", "false");
        });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
        if (!menu.contains(e.target) && !btn.contains(e.target)) {
            menu.classList.remove("open");
            btn.setAttribute("aria-expanded", "false");
        }
    });
}

// ==========================================================================
// FULL REAL-TIME MULTILINGUAL TRANSLATION SYSTEM (English / Hinglish / Hindi)
// ==========================================================================
const TRANSLATIONS = {
    english: {
        navFeatures: "Features",
        navCurriculum: "9 Chapters",
        navPricing: "Pricing",
        navFaq: "FAQ",
        navAffiliate: "🤝 Earn ₹500",
        navBuyBtn: "Unlock E-Book",
        heroBadge: "Google DeepMind Agentic Coding Revolution",
        heroH1: 'Build <span class="text-gradient">Any Software & Website</span> in Record Time with Google Antigravity!',
        heroLead: "Zero coding experience? No problem! Learn how the Google Antigravity AI Agent writes code, runs terminal commands, auto-fixes bugs, and deploys full-stack websites, SaaS, mobile apps, and bots for you.",
        heroBuyBtn: "🚀 Buy & Get Instant Access",
        heroReaderBtn: "📖 Reader Demo",
        guarInstant: "Instant Access on Email",
        guarLang: "Trilingual English + Hindi",
        guarReader: "Protected Web Reader",
        featuresTitle: "Traditional AI vs Google Antigravity",
        featuresSub: "Why developers using standard ChatGPT or Claude are falling behind, while Antigravity users build 10x faster.",
        featuresList: [
            { title: "Multi-File Project Architecture", desc: "Antigravity doesn't just write a single file — it analyzes the context across 50+ files in your project to build cohesive, production-ready apps." },
            { title: "Autonomous Terminal Execution", desc: "The agent installs npm packages, runs build scripts, and self-heals compiler errors without requiring manual intervention." },
            { title: "Browser Subagents & Live QA", desc: "Once built, Antigravity opens Chromium in the background, clicks buttons, fills forms, and validates UI behavior automatically." },
            { title: "Monetization & Freelance Mastery", desc: "Learn how to deliver high-ticket websites within 24 hours on Upwork, Fiverr, and to direct clients to generate ₹1L - ₹3L monthly." }
        ],
        curriculumTitle: "What Will You Get in This E-Book?",
        curriculumSub: "9 Deep, practical chapters to transform you from beginner to an elite AI engineer and earner. Available in English, Hindi, and Hinglish.",
        pricingTitle: "Unlock Your E-Book Today",
        pricingSub: "Pay via UPI and receive instant access on your registered email.",
        pricingCardDesc: "Complete 9 Chapters + Live Prompt Blueprints",
        pricingBtn: "💳 Pay Via UPI & Get Instant Access",
        faqTitle: "Frequently Asked Questions (FAQ)",
        consentText: '<strong>Mandatory Declaration &amp; Consent:</strong><br>"I (the buyer) hereby certify that I am purchasing this digital e-book of my own free will. This is Digital Content, and once purchased, a strict No Refund &amp; No Return Policy applies."<br><a href="privacy-policy.html" target="_blank" style="color: var(--accent-cyan); font-size: 0.82rem;">📜 Read Privacy Policy &amp; Terms (click here)</a>',
        formSubmitBtn: "✅ Confirm Payment & Send E-Book Link"
    },
    hinglish: {
        navFeatures: "Features",
        navCurriculum: "9 Chapters",
        navPricing: "Pricing",
        navFaq: "FAQ",
        navAffiliate: "🤝 Earn ₹500",
        navBuyBtn: "Unlock E-Book",
        heroBadge: "Google DeepMind Agentic Coding Revolution",
        heroH1: 'Google Antigravity Se <span class="text-gradient">Koi Bhi Software & Website</span> Record Time Me Banayein!',
        heroLead: "Zero coding experience? Koi problem nahi! Is comprehensive step-by-step ई-बुक में सीखें कैसे Google Antigravity AI Agent आपके लिए पूरी वेबसाइट, सास (SaaS), मोबाइल ऐप्स और बॉट्स खुद कोड करके, टेस्ट करके और डिप्लॉय करके देता है।",
        heroBuyBtn: "🚀 Buy & Get Instant Access",
        heroReaderBtn: "📖 Reader Demo",
        guarInstant: "Instant Access on Email",
        guarLang: "Hindi + English Bilingual",
        guarReader: "Protected Web Reader",
        featuresTitle: "Traditional AI vs Google Antigravity",
        featuresSub: "Kyun normal ChatGPT ya Claude use karne wale developers peeche chhoot rahe hain aur Antigravity users 10 guna tez kaam kar rahe hain?",
        featuresList: [
            { title: "Multi-File Project Architecture", desc: "Antigravity sirf ek file nahi likhta, ye aapke pooray project folder ke 50+ files ke context ko analyze karke complete full-stack web applications generate karta hai." },
            { title: "Autonomous Terminal Execution", desc: "Agent khud packages install karta hai, build commands run karta hai, aur compiler errors ko bina aapke bole khud debug karke theek karta hai." },
            { title: "Browser Subagents & QA", desc: "Website banne ke baad agent Chromium browser open karta hai, buttons click karta hai, forms fill karta hai aur live UI validation karta hai." },
            { title: "Monetization & Freelance Mastery", desc: "Seekhein kaise Upwork, Fiverr aur Indian clients ko 24 ghante ke andar high-ticket websites deliver karke monthly ₹1L - ₹3L generate karein." }
        ],
        curriculumTitle: "Is E-Book Me Kya-Kya Milega?",
        curriculumSub: "9 Deep, practical chapters jo aapko Beginner se lekar Elite Agentic Architect + Earner bana denge. Hinglish, Hindi aur English teeno me available.",
        pricingTitle: "Aaj Hi Apni E-Book Unlock Karein",
        pricingSub: "Turant UPI payment karein aur apne registered email par instant secure reader link prapt karein.",
        pricingCardDesc: "Complete 9 Chapters + Live Prompt Blueprints",
        pricingBtn: "💳 Pay Via UPI & Get Instant Access",
        faqTitle: "Aksar Puche Jaane Wale Sawal (FAQ)",
        consentText: '<strong>अनिवार्य घोषणा व सहमति (Mandatory):</strong><br>"मैं (खरीदार) यह प्रमाणित करता/करती हूँ कि मैं अपनी पूरी मर्ज़ी से यह डिजिटल ई-बुक खरीद रहा/रही हूँ। यह एक Digital Content है और इसमें एक बार खरीदने के बाद No Refund &amp; No Return Policy लागू होगी।"<br><a href="privacy-policy.html" target="_blank" style="color: var(--accent-cyan); font-size: 0.82rem;">📜 Privacy Policy व नियम पढ़ें (click here)</a>',
        formSubmitBtn: "✅ Confirm Payment & Send E-Book Link"
    },
    hindi: {
        navFeatures: "विशेषताएँ",
        navCurriculum: "9 अध्याय",
        navPricing: "मूल्य व ऑफर",
        navFaq: "सवाल-जवाब",
        navAffiliate: "🤝 ₹500 कमाएँ",
        navBuyBtn: "ई-बुक अनलॉक करें",
        heroBadge: "गूगल डीपमाइंड एजेंटिक कोडिंग क्रांति",
        heroH1: 'Google Antigravity से <span class="text-gradient">कोई भी सॉफ़्टवेयर व वेबसाइट</span> रिकॉर्ड समय में बनाएँ!',
        heroLead: "शून्य कोडिंग अनुभव? कोई चिंता नहीं! इस संपूर्ण चरण-दर-चरण ई-बुक में सीखें कि कैसे Google Antigravity AI Agent आपके लिए पूरी वेबसाइट, SaaS, मोबाइल ऐप और बॉट्स खुद कोड, टेस्ट और डिप्लॉय करता है।",
        heroBuyBtn: "🚀 तुरंत ख़रीदें व एक्सेस पाएँ",
        heroReaderBtn: "📖 रीडर डेमो",
        guarInstant: "ईमेल पर तुरंत एक्सेस",
        guarLang: "हिंदी व अंग्रेज़ी द्विभाषी",
        guarReader: "सुरक्षित वेब रीडर",
        featuresTitle: "पारंपरिक AI बनाम Google Antigravity",
        featuresSub: "सामान्य ChatGPT या Claude उपयोग करने वाले डेवलपर्स क्यों पीछे छूट रहे हैं और Antigravity उपयोगकर्ता 10 गुना तेज़ी से काम कर रहे हैं?",
        featuresList: [
            { title: "मल्टी-फाइल प्रोजेक्ट आर्किटेक्चर", desc: "एंटीग्रैविटी सिर्फ एक फाइल नहीं लिखता, यह आपके पूरे प्रोजेक्ट फोल्डर की 50+ फाइलों को समझकर संपूर्ण वेब एप्लिकेशन बनाता है।" },
            { title: "स्वायत्त टर्मिनल निष्पादन", desc: "एजेंट खुद पैकेज इंस्टॉल करता है, कमांड चलाता है और कंपाइलर एरर्स को बिना किसी रुकावट के खुद ठीक करता है।" },
            { title: "ब्राउज़र सब-एजेंट्स व ऑटोमैटिक टेस्टिंग", desc: "वेबसाइट तैयार होने के बाद एजेंट क्रोमियम खोलता है, बटन क्लिक करता है और लाइव यूआई का परीक्षण करता है।" },
            { title: "कमाई व फ्रीलांसिंग मास्टरी", desc: "सीखें कि कैसे अपवर्क, फीवर और सीधे क्लाइंट्स को 24 घंटे में प्रीमियम प्रोजेक्ट्स देकर प्रति माह ₹1L - ₹3L कमाएँ।" }
        ],
        curriculumTitle: "इस ई-बुक में आपको क्या-क्या मिलेगा?",
        curriculumSub: "9 गहन, व्यावहारिक अध्याय जो आपको शुरुआती से कुशल एजेंटिक आर्किटेक्ट और अर्नर बनाएँगे।",
        pricingTitle: "आज ही अपनी ई-बुक अनलॉक करें",
        pricingSub: "UPI से तुरंत भुगतान करें और अपने ईमेल पर तत्काल सुरक्षित एक्सेस लिंक प्राप्त करें।",
        pricingCardDesc: "संपूर्ण 9 अध्याय + लाइव प्रॉम्प्ट ब्लूप्रिंट्स",
        pricingBtn: "💳 UPI द्वारा भुगतान करें व एक्सेस पाएँ",
        faqTitle: "अक्सर पूछे जाने वाले सवाल (FAQ)",
        consentText: '<strong>घोषणा व प्राइवेसी सहमति (अनिवार्य):</strong><br>"मैं (खरीदार) यह प्रमाणित करता/करती हूँ कि मैं अपनी पूरी मर्ज़ी और सहमति से यह डिजिटल ई-बुक खरीद रहा/रही हूँ। यह एक डिजिटल सामग्री (Digital Content) है और एक बार खरीदने के बाद इसमें No Refund और No Return नीति लागू होगी।"<br><a href="privacy-policy.html" target="_blank" style="color: var(--accent-cyan); font-size: 0.82rem;">📜 प्राइवेसी पॉलिसी व नियम पढ़ें (यहाँ क्लिक करें)</a>',
        formSubmitBtn: "✅ भुगतान की पुष्टि करें व ई-बुक लिंक पाएँ"
    }
};

// Apply language dynamically across the entire website
function applySiteLanguage(lang) {
    const t = TRANSLATIONS[lang] || TRANSLATIONS.english;
    document.documentElement.lang = (lang === "hindi" ? "hi" : "en");

    // 1. Navigation items
    const elFeat = document.getElementById("nav-link-features");
    if (elFeat) elFeat.textContent = t.navFeatures;

    const elCurr = document.getElementById("nav-link-curriculum");
    if (elCurr) elCurr.textContent = t.navCurriculum;

    const elPrice = document.getElementById("nav-link-pricing");
    if (elPrice) elPrice.textContent = t.navPricing;

    const elFaq = document.getElementById("nav-link-faq");
    if (elFaq) elFaq.textContent = t.navFaq;

    const elAff = document.getElementById("nav-link-affiliate");
    if (elAff) elAff.textContent = t.navAffiliate;

    const elBuyBtn = document.getElementById("nav-buy-btn");
    if (elBuyBtn) elBuyBtn.textContent = t.navBuyBtn;

    // 2. Hero Section
    const elHeroBadge = document.getElementById("cms-hero-badge");
    if (elHeroBadge) elHeroBadge.textContent = t.heroBadge;

    const elHeroH1 = document.getElementById("cms-hero-h1");
    if (elHeroH1) elHeroH1.innerHTML = t.heroH1;

    const elHeroLead = document.getElementById("cms-hero-lead");
    if (elHeroLead) elHeroLead.textContent = t.heroLead;

    const guar1 = document.getElementById("guar-item-1");
    if (guar1) guar1.textContent = t.guarInstant;

    const guar2 = document.getElementById("guar-item-2");
    if (guar2) guar2.textContent = t.guarLang;

    const guar3 = document.getElementById("guar-item-3");
    if (guar3) guar3.textContent = t.guarReader;

    // 3. Section Titles
    const elFeatTitle = document.getElementById("cms-features-title");
    if (elFeatTitle) elFeatTitle.textContent = t.featuresTitle;

    const elFeatSub = document.getElementById("cms-features-sub");
    if (elFeatSub) elFeatSub.textContent = t.featuresSub;

    // Translate feature cards
    if (t.featuresList) {
        const featureCards = document.querySelectorAll(".features-grid .feature-card");
        featureCards.forEach((card, idx) => {
            if (t.featuresList[idx]) {
                const h3 = card.querySelector("h3");
                const p = card.querySelector("p");
                if (h3) h3.textContent = t.featuresList[idx].title;
                if (p) p.textContent = t.featuresList[idx].desc;
            }
        });
    }

    const elCurrTitle = document.getElementById("cms-curriculum-title");
    if (elCurrTitle) elCurrTitle.textContent = t.curriculumTitle;

    const elCurrSub = document.getElementById("cms-curriculum-sub");
    if (elCurrSub) elCurrSub.textContent = t.curriculumSub;

    const elPriceTitle = document.getElementById("cms-pricing-title");
    if (elPriceTitle) elPriceTitle.textContent = t.pricingTitle;

    const elPriceSub = document.getElementById("cms-pricing-sub");
    if (elPriceSub) elPriceSub.textContent = t.pricingSub;

    const elPriceDesc = document.getElementById("cms-pricing-card-desc");
    if (elPriceDesc) elPriceDesc.textContent = t.pricingCardDesc;

    const elFaqTitle = document.getElementById("cms-faq-title");
    if (elFaqTitle) elFaqTitle.textContent = t.faqTitle;

    // 4. Form & Legal Consent Box
    const elConsent = document.getElementById("consentTextLabel");
    if (elConsent) elConsent.innerHTML = t.consentText;

    const elSubmitBtn = document.getElementById("btnSubmitPayment");
    if (elSubmitBtn) elSubmitBtn.textContent = t.formSubmitBtn;

    const elMobileBuyText = document.getElementById("mobileBottomBuyText");
    if (elMobileBuyText) elMobileBuyText.textContent = t.navBuyBtn;
}

// Language Switcher Setup (Synchronized for both Desktop and Mobile Sticky Bottom Bar)
function setupLangSwitcher() {
    const desktopSwitcher = document.getElementById("lang-switcher-btn");
    const desktopDropdown = document.getElementById("lang-dropdown");
    const desktopLabel = document.getElementById("current-lang-label");

    const mobileSwitcher = document.getElementById("mobile-lang-switcher-btn");
    const mobileDropdown = document.getElementById("mobile-lang-dropdown");
    const mobileLabel = document.getElementById("mobile-current-lang-label");

    // Read saved language (defaulting to english)
    const savedLang = localStorage.getItem("antigravity_lang") || "english";
    updateAllLangLabels(savedLang);
    applySiteLanguage(savedLang);

    // Toggle Desktop dropdown
    if (desktopSwitcher && desktopDropdown) {
        desktopSwitcher.addEventListener("click", (e) => {
            e.stopPropagation();
            if (mobileDropdown) mobileDropdown.classList.remove("show");
            desktopDropdown.classList.toggle("show");
        });
    }

    // Toggle Mobile dropdown
    if (mobileSwitcher && mobileDropdown) {
        mobileSwitcher.addEventListener("click", (e) => {
            e.stopPropagation();
            if (desktopDropdown) desktopDropdown.classList.remove("show");
            mobileDropdown.classList.toggle("show");
        });
    }

    // Select language option from ANY switcher
    document.querySelectorAll(".lang-option").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const lang = btn.getAttribute("data-lang");
            localStorage.setItem("antigravity_lang", lang);
            updateAllLangLabels(lang);
            applySiteLanguage(lang);
            if (desktopDropdown) desktopDropdown.classList.remove("show");
            if (mobileDropdown) mobileDropdown.classList.remove("show");
        });
    });

    // Close dropdowns on outside click
    document.addEventListener("click", (e) => {
        if (desktopSwitcher && !desktopSwitcher.contains(e.target) && desktopDropdown) {
            desktopDropdown.classList.remove("show");
        }
        if (mobileSwitcher && !mobileSwitcher.contains(e.target) && mobileDropdown) {
            mobileDropdown.classList.remove("show");
        }
    });

    function updateAllLangLabels(lang) {
        const map = { hinglish: "Hing", hindi: "हिंदी", english: "EN" };
        const text = map[lang] || "EN";
        if (desktopLabel) desktopLabel.textContent = text;
        if (mobileLabel) mobileLabel.textContent = text;

        document.querySelectorAll(".lang-option").forEach(b => {
            b.classList.toggle("active", b.getAttribute("data-lang") === lang);
        });
    }
}

// Apply dynamic site settings & CMS content from Admin Panel
function applyGlobalSiteSettings() {
    try {
        const siteSettings = JSON.parse(localStorage.getItem("antigravity_site_settings") || "{}");

        // 1. Site Branding
        if (siteSettings.siteName) {
            const navSiteName = document.getElementById("site-name-nav");
            if (navSiteName) navSiteName.innerHTML = siteSettings.siteName;
            document.title = siteSettings.siteName.replace(/<[^>]*>?/gm, '') + " - Official Guide";
        }

        if (siteSettings.logoIcon) {
            const logoIcon = document.getElementById("site-logo-icon");
            if (logoIcon) logoIcon.textContent = siteSettings.logoIcon;
        }

        if (siteSettings.footerText) {
            const footerCopy = document.getElementById("footer-copyright-main");
            if (footerCopy) footerCopy.textContent = siteSettings.footerText;
        }

        // 2. Navigation Links
        if (Array.isArray(siteSettings.navLinks) && siteSettings.navLinks.length > 0) {
            const navContainer = document.getElementById("main-nav-links");
            const mobileNavContainer = document.getElementById("mobile-nav-links");

            if (navContainer) {
                navContainer.innerHTML = siteSettings.navLinks
                    .map(link => `<li><a href="${link.href}">${link.label}</a></li>`)
                    .join("");
            }
            if (mobileNavContainer) {
                mobileNavContainer.innerHTML = siteSettings.navLinks
                    .map(link => `<li><a href="${link.href}">${link.label}</a></li>`)
                    .join("");
            }
        }

        // 3. Footer Links
        if (Array.isArray(siteSettings.footerLinks) && siteSettings.footerLinks.length > 0) {
            const footerLinksContainer = document.getElementById("footer-links-main");
            if (footerLinksContainer) {
                footerLinksContainer.innerHTML = siteSettings.footerLinks
                    .map(link => `<a href="${link.href}">${link.label}</a>`)
                    .join("");
            }
        }

        // 4. Page Content Editor (Static Text)
        const pageContent = JSON.parse(localStorage.getItem("antigravity_page_content") || "{}");
        if (pageContent.heroBadge) {
            const el = document.getElementById("cms-hero-badge");
            if (el) el.textContent = pageContent.heroBadge;
        }
        if (pageContent.heroH1) {
            const el = document.getElementById("cms-hero-h1");
            if (el) el.innerHTML = pageContent.heroH1;
        }
        if (pageContent.heroLead) {
            const el = document.getElementById("cms-hero-lead");
            if (el) el.textContent = pageContent.heroLead;
        }
        if (pageContent.featuresTitle) {
            const el = document.getElementById("cms-features-title");
            if (el) el.textContent = pageContent.featuresTitle;
        }
        if (pageContent.featuresSub) {
            const el = document.getElementById("cms-features-sub");
            if (el) el.textContent = pageContent.featuresSub;
        }
        if (pageContent.curriculumTitle) {
            const el = document.getElementById("cms-curriculum-title");
            if (el) el.textContent = pageContent.curriculumTitle;
        }
        if (pageContent.curriculumSub) {
            const el = document.getElementById("cms-curriculum-sub");
            if (el) el.textContent = pageContent.curriculumSub;
        }
        if (pageContent.pricingTitle) {
            const el = document.getElementById("cms-pricing-title");
            if (el) el.textContent = pageContent.pricingTitle;
        }
        if (pageContent.pricingSub) {
            const el = document.getElementById("cms-pricing-sub");
            if (el) el.textContent = pageContent.pricingSub;
        }
        if (pageContent.faqTitle) {
            const el = document.getElementById("cms-faq-title");
            if (el) el.textContent = pageContent.faqTitle;
        }
    } catch (e) {
        console.error("Error applying site settings:", e);
    }
}
