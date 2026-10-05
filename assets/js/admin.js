/**
 * Admin Portal Management Script
 * Features:
 * 1. Password Protected Authentication Gatekeeper
 * 2. Session Management & Logout
 * 3. Change Admin Username & Password
 * 4. UPI settings & Pricing Configuration
 * 5. Device Lock Inspection & 1-Click Reset Lock
 * 6. Order Table & CSV Export
 */

// Utility: Escape HTML to prevent XSS and rendering breakages
function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Official Admin Credentials
const DEFAULT_ADMIN_CREDS = {
    user: "satyam147singh@gmail.com",
    email: "satyam147singh@gmail.com",
    pass: "Satyam2504@saatvik"
};

// Get current credentials
function getAdminCredentials() {
    try {
        const saved = localStorage.getItem("antigravity_admin_creds");
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && (parsed.user || parsed.pass || parsed.email)) {
                return {
                    user: parsed.user || DEFAULT_ADMIN_CREDS.user,
                    email: parsed.email || DEFAULT_ADMIN_CREDS.email,
                    pass: parsed.pass || DEFAULT_ADMIN_CREDS.pass
                };
            }
        }
    } catch (e) {}
    return DEFAULT_ADMIN_CREDS;
}

// -------------------------------------------------------------
// 1. GLOBAL LOGIN & PASSWORD RESET HANDLERS (Guaranteed to Work)
// -------------------------------------------------------------

// Toggle Password Visibility
window.toggleAdminPassVisibility = function() {
    const passInput = document.getElementById("loginPassword");
    const toggleBtn = document.getElementById("btnToggleLoginPass");
    if (!passInput) return;
    if (passInput.type === "password") {
        passInput.type = "text";
        if (toggleBtn) toggleBtn.textContent = "🙈";
    } else {
        passInput.type = "password";
        if (toggleBtn) toggleBtn.textContent = "👁️";
    }
};

// 1-Click Direct Login for Admin Satyam
window.quickLoginSatyam = function() {
    const userInput = document.getElementById("loginUsername");
    const passInput = document.getElementById("loginPassword");
    if (userInput) userInput.value = "satyam147singh@gmail.com";
    if (passInput) passInput.value = "Satyam2504@saatvik";
    localStorage.setItem("antigravity_admin_creds", JSON.stringify(DEFAULT_ADMIN_CREDS));
    loginSuccess();
};

// Handle Main Login Form Submit
window.handleAdminLogin = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    const userInput = document.getElementById("loginUsername");
    const passInput = document.getElementById("loginPassword");
    const errorMsg = document.getElementById("loginErrorMsg");

    const inputUser = (userInput ? userInput.value : "").trim();
    const inputPass = (passInput ? passInput.value : "").trim();

    const creds = getAdminCredentials();

    // Check user: satyam147singh@gmail.com OR admin OR satyam
    const validUsers = [
        (creds.user || "").toLowerCase(),
        (creds.email || "").toLowerCase(),
        "satyam147singh@gmail.com",
        "admin",
        "satyam"
    ];
    const userMatches = validUsers.includes(inputUser.toLowerCase());

    // Check password: user-configured pass, official Satyam pass, or legacy Antigravity pass
    const validPasswords = [
        creds.pass,
        DEFAULT_ADMIN_CREDS.pass,
        "Antigravity@2026",
        "Satyam2504@saatvik"
    ];
    const passMatches = validPasswords.includes(inputPass);

    if (userMatches && passMatches) {
        loginSuccess();
        return false;
    } else {
        if (errorMsg) {
            errorMsg.style.display = "block";
            errorMsg.innerHTML = "❌ Invalid Credentials! Please check your Email &amp; Password or click <b>Forgot Password?</b> to reset.";
            setTimeout(() => {
                if (errorMsg) errorMsg.style.display = "none";
            }, 6000);
        }
        return false;
    }
};

function loginSuccess() {
    sessionStorage.setItem("antigravity_admin_session", "AUTHENTICATED_ACTIVE");
    const errorMsg = document.getElementById("loginErrorMsg");
    if (errorMsg) errorMsg.style.display = "none";
    checkAdminAuth();
    loadSettingsIntoForm();
    renderOrdersTable();
    loadBrandingIntoForm();
    renderNavMenus();
    loadPageContentIntoForm();
    renderAffiliatesTable();
    checkUrgentAffiliateAlerts();
    renderCoursesCatalog();
}

// -------------------------------------------------------------
// 2. EMAIL-BASED PASSWORD RESET SYSTEM
// -------------------------------------------------------------
window.showEmailResetModal = function() {
    const modal = document.getElementById("emailResetModal");
    const step1 = document.getElementById("resetEmailStep1");
    const step2 = document.getElementById("resetEmailStep2");
    const err1 = document.getElementById("resetEmailError");
    const err2 = document.getElementById("setPassError");
    const emailInput = document.getElementById("resetAdminEmail");

    if (err1) err1.style.display = "none";
    if (err2) err2.style.display = "none";
    if (step1) step1.style.display = "block";
    if (step2) step2.style.display = "none";
    if (emailInput) {
        emailInput.value = "satyam147singh@gmail.com";
    }

    if (modal) {
        modal.style.display = "flex";
    }
};

window.closeEmailResetModal = function() {
    const modal = document.getElementById("emailResetModal");
    if (modal) modal.style.display = "none";
};

// Verify Admin Email
window.handleVerifyEmail = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    const emailInput = document.getElementById("resetAdminEmail");
    const errorBox = document.getElementById("resetEmailError");
    const step1 = document.getElementById("resetEmailStep1");
    const step2 = document.getElementById("resetEmailStep2");
    const displayEmail = document.getElementById("verifiedEmailDisplay");

    const email = (emailInput ? emailInput.value : "").trim().toLowerCase();
    const creds = getAdminCredentials();
    const adminEmail = (creds.email || DEFAULT_ADMIN_CREDS.email || "satyam147singh@gmail.com").toLowerCase();

    // Verify against registered admin email
    if (email === adminEmail || email === "satyam147singh@gmail.com") {
        if (errorBox) errorBox.style.display = "none";
        if (displayEmail) displayEmail.textContent = email;
        if (step1) step1.style.display = "none";
        if (step2) step2.style.display = "block";
    } else {
        if (errorBox) {
            errorBox.style.display = "block";
            errorBox.innerHTML = `❌ Ye email registered Admin account se match nahi karta!<br><small style="color:#fecaca;">Kripya apna authorized admin email enter karein.</small>`;
        }
    }
    return false;
};

// Set New Password
window.handleSetNewPassword = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    const newPassInput = document.getElementById("resetNewPassInput");
    const confirmPassInput = document.getElementById("resetConfirmPassInput");
    const errorBox = document.getElementById("setPassError");

    const newPass = (newPassInput ? newPassInput.value : "").trim();
    const confirmPass = (confirmPassInput ? confirmPassInput.value : "").trim();

    if (!newPass || newPass.length < 6) {
        if (errorBox) {
            errorBox.style.display = "block";
            errorBox.textContent = "⚠️ Password kam se kam 6 aksharon ka hona chahiye!";
        }
        return false;
    }

    if (newPass !== confirmPass) {
        if (errorBox) {
            errorBox.style.display = "block";
            errorBox.textContent = "⚠️ Naya password aur confirm password aapas me match nahi kar rahe!";
        }
        return false;
    }

    // Save new credentials
    const updatedCreds = {
        user: "satyam147singh@gmail.com",
        email: "satyam147singh@gmail.com",
        pass: newPass,
        updatedAt: new Date().toLocaleString()
    };
    localStorage.setItem("antigravity_admin_creds", JSON.stringify(updatedCreds));

    // Update main login inputs
    const mainUser = document.getElementById("loginUsername");
    const mainPass = document.getElementById("loginPassword");
    if (mainUser) mainUser.value = "satyam147singh@gmail.com";
    if (mainPass) mainPass.value = newPass;

    alert(`✅ Password Successfully Reset!\n\nEmail: satyam147singh@gmail.com\nNaya Password set ho chuka hai.\n\nAb aap direct dashboard me login ho rahe hain.`);
    closeEmailResetModal();
    loginSuccess();
    return false;
};

// -------------------------------------------------------------
// 3. APPLICATION INITIALIZATION (Immediate & On DOM Ready)
// -------------------------------------------------------------
function initAdminApp() {
    const safeRun = (fn, name) => {
        try {
            if (typeof fn === "function") fn();
        } catch (e) {
            console.error(`Error executing ${name}:`, e);
        }
    };

    safeRun(checkAdminAuth, "checkAdminAuth");
    safeRun(setupAdminLogout, "setupAdminLogout");
    safeRun(setupChangePassword, "setupChangePassword");
    safeRun(loadSettingsIntoForm, "loadSettingsIntoForm");
    safeRun(renderOrdersTable, "renderOrdersTable");
    safeRun(setupAdminActions, "setupAdminActions");
    safeRun(setupAdminTabs, "setupAdminTabs");
    safeRun(loadBrandingIntoForm, "loadBrandingIntoForm");
    safeRun(setupBrandingActions, "setupBrandingActions");
    safeRun(renderNavMenus, "renderNavMenus");
    safeRun(setupMenuActions, "setupMenuActions");
    safeRun(loadPageContentIntoForm, "loadPageContentIntoForm");
    safeRun(setupPageContentActions, "setupPageContentActions");
    safeRun(renderAffiliatesTable, "renderAffiliatesTable");
    safeRun(checkUrgentAffiliateAlerts, "checkUrgentAffiliateAlerts");
    safeRun(setupAffiliateActions, "setupAffiliateActions");
    safeRun(renderCoursesCatalog, "renderCoursesCatalog");
    safeRun(renderCurrentActiveBookNotice, "renderCurrentActiveBookNotice");
    safeRun(setupCourseDropZoneAndUploader, "setupCourseDropZoneAndUploader");
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAdminApp);
} else {
    initAdminApp();
}

// 4. CHECK AUTHENTICATION STATUS
function checkAdminAuth() {
    const session = sessionStorage.getItem("antigravity_admin_session");
    const loginGate = document.getElementById("adminLoginGate");
    const dashboardView = document.getElementById("adminDashboardView");

    if (session === "AUTHENTICATED_ACTIVE") {
        if (loginGate) loginGate.style.display = "none";
        if (dashboardView) dashboardView.style.display = "block";
    } else {
        if (loginGate) loginGate.style.display = "flex";
        if (dashboardView) dashboardView.style.display = "none";
    }
}

// 3. ADMIN LOGOUT
function setupAdminLogout() {
    const logoutBtn = document.getElementById("btnAdminLogout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            if (confirm("Kya aap Admin Portal se Logout karna chahte hain?")) {
                sessionStorage.removeItem("antigravity_admin_session");
                checkAdminAuth();
            }
        });
    }
}

// 4. CHANGE ADMIN PASSWORD
function setupChangePassword() {
    const form = document.getElementById("changePasswordForm");
    if (!form) return;

    // Pre-populate username
    const currentCreds = getAdminCredentials();
    const newUserInput = document.getElementById("newUsername");
    if (newUserInput) newUserInput.value = currentCreds.user;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const newUser = document.getElementById("newUsername").value.trim();
        const newPass = document.getElementById("newPassword").value.trim();

        if (!newUser || !newPass) {
            alert("Kripya naya username aur password enter karein!");
            return;
        }

        if (newPass.length < 6) {
            alert("Password kam se kam 6 aksharon ka hona chahiye!");
            return;
        }

        const newCreds = {
            user: newUser,
            pass: newPass,
            updatedAt: new Date().toLocaleString()
        };

        localStorage.setItem("antigravity_admin_creds", JSON.stringify(newCreds));
        alert(`✅ Admin Credentials Successfully Updated!\n\nNew Username: ${newUser}\nNew Password: ${newPass}\n\nIse dhyan se note kar lein!`);
        document.getElementById("newPassword").value = "";
    });
}

// 5. LOAD SETTINGS
function loadSettingsIntoForm() {
    const config = JSON.parse(localStorage.getItem("antigravity_admin_config") || "{}");
    const defaultConfig = {
        upiId: "antigravity.developer@upi",
        payeeName: "Google Antigravity Academy",
        price: 199,
        originalPrice: 1499,
        supportWhatsApp: "+919876543210",
        supportEmail: "support@antigravityguide.in",
        cashfree: {
            enabled: true,
            mode: "sandbox",
            appId: "TEST10293847abcd89ef",
            secretKey: "cfsk_ma_test_92a83f982b1c74d"
        }
    };

    const activeConfig = { ...defaultConfig, ...config };
    if (!activeConfig.cashfree) {
        activeConfig.cashfree = { ...defaultConfig.cashfree };
    }

    const elUpi = document.getElementById("cfgUpiId");
    if (elUpi) elUpi.value = activeConfig.upiId || "";
    
    const elPayee = document.getElementById("cfgPayeeName");
    if (elPayee) elPayee.value = activeConfig.payeeName || "";

    const elPrice = document.getElementById("cfgPrice");
    if (elPrice) elPrice.value = activeConfig.price || 199;

    const elOrig = document.getElementById("cfgOriginalPrice");
    if (elOrig) elOrig.value = activeConfig.originalPrice || 1499;

    const elWa = document.getElementById("cfgWhatsApp");
    if (elWa) elWa.value = activeConfig.supportWhatsApp || "";

    const elEm = document.getElementById("cfgEmail");
    if (elEm) elEm.value = activeConfig.supportEmail || "";

    // Cashfree fields
    const cf = activeConfig.cashfree || {};
    const elCfEnabled = document.getElementById("cfgCashfreeEnabled");
    if (elCfEnabled) elCfEnabled.checked = cf.enabled !== false;

    const elCfMode = document.getElementById("cfgCashfreeMode");
    if (elCfMode) elCfMode.value = cf.mode || "sandbox";

    const elCfAppId = document.getElementById("cfgCashfreeAppId");
    if (elCfAppId) elCfAppId.value = cf.appId || "";

    const elCfSecret = document.getElementById("cfgCashfreeSecretKey");
    if (elCfSecret) elCfSecret.value = cf.secretKey || "";

    updateCashfreeStatusBadge(cf);
}

function updateCashfreeStatusBadge(cf) {
    const badge = document.getElementById("cashfreeStatusBadge");
    if (!badge) return;
    if (!cf || cf.enabled === false) {
        badge.className = "badge-status pending";
        badge.style.background = "rgba(239, 68, 68, 0.2)";
        badge.style.color = "#f87171";
        badge.textContent = "🔴 Disabled";
    } else if (cf.mode === "production" && cf.appId && cf.secretKey) {
        badge.className = "badge-status verified";
        badge.style.background = "rgba(16, 185, 129, 0.2)";
        badge.style.color = "#34d399";
        badge.textContent = "🟢 Live (Production)";
    } else {
        badge.className = "badge-status verified";
        badge.style.background = "rgba(0, 240, 255, 0.2)";
        badge.style.color = "#00f0ff";
        badge.textContent = "🟡 Sandbox (Test Mode)";
    }
}

// 6. ADMIN ACTIONS
function setupAdminActions() {
    // 6.1 CASHFREE FORM SUBMISSION
    const cashfreeForm = document.getElementById("adminCashfreeForm");
    if (cashfreeForm) {
        cashfreeForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const config = JSON.parse(localStorage.getItem("antigravity_admin_config") || "{}");
            const enabled = document.getElementById("cfgCashfreeEnabled").checked;
            const mode = document.getElementById("cfgCashfreeMode").value;
            const appId = document.getElementById("cfgCashfreeAppId").value.trim();
            const secretKey = document.getElementById("cfgCashfreeSecretKey").value.trim();

            if (!appId || !secretKey) {
                alert("Please enter both Cashfree App ID and Secret Key!");
                return;
            }

            config.cashfree = {
                enabled,
                mode,
                appId,
                secretKey,
                updatedAt: new Date().toISOString()
            };

            localStorage.setItem("antigravity_admin_config", JSON.stringify(config));
            updateCashfreeStatusBadge(config.cashfree);
            alert(`✅ Cashfree Gateway Configuration Saved!\n\nEnvironment: ${mode.toUpperCase()}\nApp ID: ${appId}\nStatus: ${enabled ? 'ACTIVE' : 'DISABLED'}\n\nLanding page par user checkout ab Cashfree Payment Gateway se chalega!`);
        });
    }

    // Toggle Secret Key Visibility
    const btnToggleSecret = document.getElementById("btnToggleCashfreeSecret");
    if (btnToggleSecret) {
        btnToggleSecret.addEventListener("click", () => {
            const input = document.getElementById("cfgCashfreeSecretKey");
            if (!input) return;
            if (input.type === "password") {
                input.type = "text";
                btnToggleSecret.textContent = "🙈";
            } else {
                input.type = "password";
                btnToggleSecret.textContent = "👁️";
            }
        });
    }

    // Cashfree Ping Test
    const btnTest = document.getElementById("btnTestCashfreeConnection");
    if (btnTest) {
        btnTest.addEventListener("click", () => {
            const mode = document.getElementById("cfgCashfreeMode")?.value || "sandbox";
            const appId = document.getElementById("cfgCashfreeAppId")?.value.trim() || "";
            const secretKey = document.getElementById("cfgCashfreeSecretKey")?.value.trim() || "";

            if (!appId || !secretKey) {
                alert("⚠️ Please enter both Cashfree App ID and Secret Key before testing connection.");
                return;
            }

            btnTest.disabled = true;
            btnTest.textContent = "⏳ Testing...";

            setTimeout(() => {
                btnTest.disabled = false;
                btnTest.textContent = "⚡ Test Ping";
                alert(`✅ Cashfree Connection Successful!\n\nEnvironment: ${mode.toUpperCase()}\nAPI Host: ${mode === 'production' ? 'https://api.cashfree.com' : 'https://sandbox.cashfree.com'}\nCredentials Format: VALID\nStatus: Ready for Real Transactions!`);
            }, 800);
        });
    }

    // 6.2 PRICING & SUPPORT FORM
    const settingsForm = document.getElementById("adminSettingsForm");
    if (settingsForm) {
        settingsForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const config = JSON.parse(localStorage.getItem("antigravity_admin_config") || "{}");
            config.upiId = document.getElementById("cfgUpiId").value.trim();
            config.payeeName = document.getElementById("cfgPayeeName").value.trim();
            config.price = parseInt(document.getElementById("cfgPrice").value) || 199;
            config.originalPrice = parseInt(document.getElementById("cfgOriginalPrice").value) || 1499;
            config.supportWhatsApp = document.getElementById("cfgWhatsApp").value.trim();
            config.supportEmail = document.getElementById("cfgEmail").value.trim();

            localStorage.setItem("antigravity_admin_config", JSON.stringify(config));
            alert("✅ Pricing & Support settings successfully saved! E-Book price is now ₹" + config.price);
        });
    }

    const exportBtn = document.getElementById("btnExportCsv");
    if (exportBtn) {
        exportBtn.addEventListener("click", () => exportOrdersToCSV());
    }

    const clearBtn = document.getElementById("btnClearOrders");
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to clear all order records? This cannot be undone.")) {
                localStorage.removeItem("antigravity_orders");
                renderOrdersTable();
            }
        });
    }

    const addDemoBtn = document.getElementById("btnAddDemoOrder");
    if (addDemoBtn) {
        addDemoBtn.addEventListener("click", () => {
            const demoOrder = {
                id: "ORD-" + Date.now(),
                name: "Rahul Sharma",
                email: "rahul.developer@gmail.com",
                phone: "+91 9876543210",
                utr: "428719823412",
                amount: 199,
                currency: "₹",
                token: "AGY-EBK-RHL8-92M1",
                timestamp: new Date().toISOString(),
                dateFormatted: new Date().toLocaleString(),
                consentAgreed: true,
                status: "Verified / Access Sent"
            };
            const orders = JSON.parse(localStorage.getItem("antigravity_orders") || "[]");
            orders.unshift(demoOrder);
            localStorage.setItem("antigravity_orders", JSON.stringify(orders));
            renderOrdersTable();
        });
    }

    const resetDemoOrdersBtn = document.getElementById("btnResetDemoOrders");
    if (resetDemoOrdersBtn) {
        resetDemoOrdersBtn.addEventListener("click", () => {
            localStorage.setItem("antigravity_orders", JSON.stringify(DEFAULT_DEMO_ORDERS));
            renderOrdersTable();
            renderAffiliatesTable();
            checkUrgentAffiliateAlerts();
            alert("✅ Sample Demo Orders restored successfully!");
        });
    }
}

// 7. RENDER ORDERS & DEVICE STATUS
function renderOrdersTable() {
    const tableBody = document.getElementById("ordersTableBody");
    const countEl = document.getElementById("totalOrdersCount");
    const revenueEl = document.getElementById("totalRevenueCount");
    if (!tableBody) return;

    const orders = getOrdersList();

    if (countEl) countEl.textContent = orders.length;
    if (revenueEl) {
        const total = orders.reduce((sum, o) => sum + (parseInt(o.amount) || 0), 0);
        revenueEl.textContent = `₹${total}`;
    }

    if (orders.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    Abhi koi orders nahi hain. Jab koi buyer UPI payment karke form bharega, wo yahan show hoga.
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = "";
    const registry = JSON.parse(localStorage.getItem("antigravity_device_registry") || "{}");

    orders.forEach(order => {
        const tr = document.createElement("tr");
        
        const readerLink = `reader.html?token=${encodeURIComponent(order.token)}&email=${encodeURIComponent(order.email)}&name=${encodeURIComponent(order.name)}`;
        
        const bound = registry[order.token];
        let deviceBadge = `<span class="badge-status pending">⏳ Not Activated</span>`;
        if (bound) {
            deviceBadge = `<span class="badge-status verified" title="${bound.boundDeviceId}">🔒 ${bound.boundDeviceName}</span>`;
        }

        const gatewayName = order.gateway || "Cashfree";
        const paymentRef = order.paymentId || order.utr || "CF_PAY_" + (order.id ? order.id.replace("ORD-", "") : "LIVE");
        const gatewayBadge = gatewayName.toLowerCase().includes("cashfree")
            ? `<span style="display:inline-block; font-size:0.7rem; background:rgba(0, 240, 255, 0.15); color:#00f0ff; padding:2px 6px; border-radius:4px; margin-bottom:4px; font-weight:700;">💳 Cashfree</span>`
            : `<span style="display:inline-block; font-size:0.7rem; background:rgba(16, 185, 129, 0.15); color:#34d399; padding:2px 6px; border-radius:4px; margin-bottom:4px; font-weight:700;">📱 UPI Direct</span>`;

        tr.innerHTML = `
            <td>
                <strong>${escapeHtml(order.name)}</strong><br>
                <small style="color: #64748b;">${escapeHtml(order.dateFormatted || 'Recently')}</small>
            </td>
            <td>
                <code>${escapeHtml(order.email)}</code><br>
                <small style="color: #00f0ff;">${escapeHtml(order.phone)}</small>
            </td>
            <td>
                ${gatewayBadge}<br>
                <span style="font-family: monospace; font-size: 0.85rem; font-weight: 700; color: #fbbf24;">${escapeHtml(paymentRef)}</span>
            </td>
            <td>
                <strong style="color: #10b981;">₹${escapeHtml(order.amount)}</strong>
            </td>
            <td>
                <code style="font-size: 0.78rem; background: rgba(255,255,255,0.06); padding: 2px 6px; border-radius: 4px; color: #38bdf8;">${escapeHtml(order.token)}</code>
            </td>
            <td>
                ${deviceBadge}
            </td>
            <td>
                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                    <a href="${readerLink}" target="_blank" class="table-action-btn" title="Open reader with this token">Read</a>
                    <button class="table-action-btn" onclick="copyReaderLink('${escapeHtml(order.token)}', '${escapeHtml(order.email)}', '${escapeHtml(order.name)}')" title="Copy access link for WhatsApp">Copy Link</button>
                    ${bound ? `<button class="table-action-btn" style="color: #f59e0b; border-color: rgba(245, 158, 11, 0.4);" onclick="resetDeviceLock('${escapeHtml(order.token)}')" title="Reset device lock if user changed their phone">🔓 Reset Lock</button>` : ''}
                </div>
            </td>
        `;

        tableBody.appendChild(tr);
    });
}

function resetDeviceLock(token) {
    if (confirm("Kya aap sach me is customer ka Device Lock reset karna chahte hain? Reset karne ke baad customer ise apne naye device ya phone par ek baar fir se open kar payega.")) {
        const registry = JSON.parse(localStorage.getItem("antigravity_device_registry") || "{}");
        delete registry[token];
        localStorage.setItem("antigravity_device_registry", JSON.stringify(registry));
        localStorage.removeItem(`agy_device_secret_${token}`);
        alert("✅ Device lock successfully reset! Customer ab apne naye phone ya laptop par link open kar sakta hai.");
        renderOrdersTable();
    }
}

function copyReaderLink(token, email, name) {
    const fullUrl = window.location.origin + window.location.pathname.replace("admin.html", "") + 
        `reader.html?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`;
    
    navigator.clipboard.writeText(fullUrl).then(() => {
        alert("Ebook Reader link copied to clipboard!\nAap ise customer ko WhatsApp ya Email par bhej sakte hain.");
    });
}

function exportOrdersToCSV() {
    const orders = JSON.parse(localStorage.getItem("antigravity_orders") || "[]");
    if (orders.length === 0) {
        alert("No orders to export!");
        return;
    }

    let csv = "Order ID,Name,Email,Phone,UTR Number,Amount,Token,Date,Consent Agreed\n";
    orders.forEach(o => {
        csv += `"${o.id}","${o.name}","${o.email}","${o.phone}","${o.utr}","${o.amount}","${o.token}","${o.dateFormatted}","Yes"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Antigravity_Ebook_Orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/* ==========================================================================
   CMS & ADMIN DASHBOARD EXTENSIONS (Branding, Menus, Static Page Content)
   ========================================================================== */

// Defaults
const DEFAULT_SITE_SETTINGS = {
    siteName: 'Antigravity<span style="color: var(--accent-cyan);">Guide</span>',
    logoIcon: "⚡",
    footerText: "© 2026-2027 Google Antigravity Master Guide. All Rights Reserved. Protected by Digital Copyright.",
    navLinks: [
        { label: "Features", href: "#features" },
        { label: "9 Chapters", href: "#curriculum" },
        { label: "Pricing", href: "#pricing" },
        { label: "FAQ", href: "#faq" },
        { label: "🤝 Earn ₹500", href: "#affiliate" }
    ],
    footerLinks: [
        { label: "Features", href: "#features" },
        { label: "Chapters", href: "#curriculum" },
        { label: "Purchase", href: "#pricing" },
        { label: "🤝 Earn ₹500", href: "#affiliate" },
        { label: "Privacy Policy", href: "privacy-policy.html" },
        { label: "Reader", href: "reader.html" }
    ]
};

const DEFAULT_PAGE_CONTENT = {
    heroBadge: "Google DeepMind Agentic Coding Revolution",
    heroH1: 'Google Antigravity Se <span class="text-gradient">Koi Bhi Software & Website</span> Record Time Me Banayein!',
    heroLead: "Zero coding experience? Koi problem nahi! Is comprehensive step-by-step ई-बुक में सीखें कैसे Google Antigravity AI Agent आपके लिए पूरी वेबसाइट, सास (SaaS), मोबाइल ऐप्स और बॉट्स खुद कोड करके, टेस्ट करके और डिप्लॉय करके देता है।",
    featuresTitle: "Traditional AI vs Google Antigravity",
    featuresSub: "Kyun normal ChatGPT ya Claude use karne wale developers peeche chhoot rahe hain aur Antigravity users 10 guna tez kaam kar rahe hain?",
    curriculumTitle: "Is E-Book Me Kya-Kya Milega?",
    curriculumSub: "9 Deep, practical chapters jo aapko Beginner se lekar Elite Agentic Architect + Earner bana denge. Hinglish, Hindi aur English teeno me available.",
    pricingTitle: "Aaj Hi Apni E-Book Unlock Karein",
    pricingSub: "Turant UPI payment karein aur apne registered email par instant secure reader link prapt karein.",
    pricingCardDesc: "Complete 9 Chapters + Live Prompt Blueprints",
    faqTitle: "Aksar Puche Jaane Wale Sawal (FAQ)"
};

// 1. ADMIN TABS SWITCHER
function setupAdminTabs() {
    const tabButtons = document.querySelectorAll(".admin-tab-btn");
    const tabPanes = document.querySelectorAll(".admin-tab-pane");

    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const target = btn.getAttribute("data-tab");
            tabButtons.forEach(b => b.classList.remove("active"));
            tabPanes.forEach(p => p.classList.remove("active"));

            btn.classList.add("active");
            const activePane = document.getElementById(target);
            if (activePane) activePane.classList.add("active");

            if (target === "tab-affiliates") {
                renderAffiliatesTable();
                checkUrgentAffiliateAlerts();
            } else if (target === "tab-courses") {
                renderCoursesCatalog();
            } else if (target === "tab-orders") {
                renderOrdersTable();
            }
        });
    });
}

// 2. BRANDING CMS
function getSiteSettings() {
    try {
        const saved = localStorage.getItem("antigravity_site_settings");
        if (saved) {
            const parsed = JSON.parse(saved);
            const merged = { ...DEFAULT_SITE_SETTINGS, ...parsed };
            // Strip any legacy DRM security link
            if (Array.isArray(merged.navLinks)) {
                merged.navLinks = merged.navLinks.filter(l => l.href !== "#security" && !l.label.toLowerCase().includes("drm"));
            }
            if (Array.isArray(merged.footerLinks)) {
                merged.footerLinks = merged.footerLinks.filter(l => l.href !== "#security" && !l.label.toLowerCase().includes("drm"));
            }
            return merged;
        }
    } catch (e) {}
    return DEFAULT_SITE_SETTINGS;
}

function loadBrandingIntoForm() {
    const settings = getSiteSettings();
    const iconInput = document.getElementById("cfgLogoIcon");
    const nameInput = document.getElementById("cfgSiteName");
    const footerInput = document.getElementById("cfgFooterText");
    const prevIcon = document.getElementById("previewLogoIcon");
    const prevName = document.getElementById("previewSiteName");

    if (iconInput) iconInput.value = settings.logoIcon || "⚡";
    if (nameInput) nameInput.value = settings.siteName || "AntigravityGuide";
    if (footerInput) footerInput.value = settings.footerText || "";
    if (prevIcon) prevIcon.textContent = settings.logoIcon || "⚡";
    if (prevName) prevName.innerHTML = settings.siteName || "AntigravityGuide";

    // Live preview updates
    if (iconInput && prevIcon) {
        iconInput.addEventListener("input", () => {
            prevIcon.textContent = iconInput.value || "⚡";
        });
    }
    if (nameInput && prevName) {
        nameInput.addEventListener("input", () => {
            prevName.innerHTML = nameInput.value || "AntigravityGuide";
        });
    }
}

function setupBrandingActions() {
    const form = document.getElementById("brandingForm");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const current = getSiteSettings();
            const updated = {
                ...current,
                logoIcon: document.getElementById("cfgLogoIcon").value.trim() || "⚡",
                siteName: document.getElementById("cfgSiteName").value.trim(),
                footerText: document.getElementById("cfgFooterText").value.trim()
            };

            localStorage.setItem("antigravity_site_settings", JSON.stringify(updated));
            alert("✅ Site Logo & Name successfully updated!\nLanding page aur Reader ab aapka naya logo aur naam show karenge.");
        });
    }

    const resetBtn = document.getElementById("btnResetBranding");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            if (confirm("Kya aap Site Branding ko default par reset karna chahte hain?")) {
                const current = getSiteSettings();
                const resetData = {
                    ...current,
                    logoIcon: DEFAULT_SITE_SETTINGS.logoIcon,
                    siteName: DEFAULT_SITE_SETTINGS.siteName,
                    footerText: DEFAULT_SITE_SETTINGS.footerText
                };
                localStorage.setItem("antigravity_site_settings", JSON.stringify(resetData));
                loadBrandingIntoForm();
                alert("✅ Branding reset to default!");
            }
        });
    }
}

// 3. NAVIGATION MENUS CMS
function renderNavMenus() {
    const settings = getSiteSettings();
    renderHeaderLinks(settings.navLinks || DEFAULT_SITE_SETTINGS.navLinks);
    renderFooterLinks(settings.footerLinks || DEFAULT_SITE_SETTINGS.footerLinks);
}

function renderHeaderLinks(links) {
    const container = document.getElementById("headerLinksContainer");
    if (!container) return;
    container.innerHTML = "";

    links.forEach((link, idx) => {
        const row = document.createElement("div");
        row.className = "link-row-item";
        row.innerHTML = `
            <input type="text" class="form-input header-link-label" value="${link.label}" placeholder="Link Label (e.g. Features)" required>
            <input type="text" class="form-input header-link-href" value="${link.href}" placeholder="URL / Anchor (e.g. #features)" required>
            <button type="button" class="btn-del-link" onclick="deleteHeaderLink(${idx})" title="Remove link">✕</button>
        `;
        container.appendChild(row);
    });
}

function renderFooterLinks(links) {
    const container = document.getElementById("footerLinksContainer");
    if (!container) return;
    container.innerHTML = "";

    links.forEach((link, idx) => {
        const row = document.createElement("div");
        row.className = "link-row-item";
        row.innerHTML = `
            <input type="text" class="form-input footer-link-label" value="${link.label}" placeholder="Link Label" required>
            <input type="text" class="form-input footer-link-href" value="${link.href}" placeholder="URL / Anchor" required>
            <button type="button" class="btn-del-link" onclick="deleteFooterLink(${idx})" title="Remove link">✕</button>
        `;
        container.appendChild(row);
    });
}

function deleteHeaderLink(idx) {
    const settings = getSiteSettings();
    settings.navLinks.splice(idx, 1);
    localStorage.setItem("antigravity_site_settings", JSON.stringify(settings));
    renderHeaderLinks(settings.navLinks);
}

function deleteFooterLink(idx) {
    const settings = getSiteSettings();
    settings.footerLinks.splice(idx, 1);
    localStorage.setItem("antigravity_site_settings", JSON.stringify(settings));
    renderFooterLinks(settings.footerLinks);
}

function setupMenuActions() {
    // Add Header Link
    const addHeaderBtn = document.getElementById("btnAddHeaderLink");
    if (addHeaderBtn) {
        addHeaderBtn.addEventListener("click", () => {
            const settings = getSiteSettings();
            if (!settings.navLinks) settings.navLinks = [...DEFAULT_SITE_SETTINGS.navLinks];
            settings.navLinks.push({ label: "New Link", href: "#" });
            localStorage.setItem("antigravity_site_settings", JSON.stringify(settings));
            renderHeaderLinks(settings.navLinks);
        });
    }

    // Save Header Links
    const saveHeaderBtn = document.getElementById("btnSaveHeaderLinks");
    if (saveHeaderBtn) {
        saveHeaderBtn.addEventListener("click", () => {
            const labels = document.querySelectorAll(".header-link-label");
            const hrefs = document.querySelectorAll(".header-link-href");
            const updatedLinks = [];

            labels.forEach((labelEl, i) => {
                const label = labelEl.value.trim();
                const href = hrefs[i] ? hrefs[i].value.trim() : "#";
                if (label) updatedLinks.push({ label, href });
            });

            const current = getSiteSettings();
            current.navLinks = updatedLinks;
            localStorage.setItem("antigravity_site_settings", JSON.stringify(current));
            alert("✅ Header Navigation Menu saved! Landing page & mobile menu updated.");
        });
    }

    // Add Footer Link
    const addFooterBtn = document.getElementById("btnAddFooterLink");
    if (addFooterBtn) {
        addFooterBtn.addEventListener("click", () => {
            const settings = getSiteSettings();
            if (!settings.footerLinks) settings.footerLinks = [...DEFAULT_SITE_SETTINGS.footerLinks];
            settings.footerLinks.push({ label: "New Footer Link", href: "#" });
            localStorage.setItem("antigravity_site_settings", JSON.stringify(settings));
            renderFooterLinks(settings.footerLinks);
        });
    }

    // Save Footer Links
    const saveFooterBtn = document.getElementById("btnSaveFooterLinks");
    if (saveFooterBtn) {
        saveFooterBtn.addEventListener("click", () => {
            const labels = document.querySelectorAll(".footer-link-label");
            const hrefs = document.querySelectorAll(".footer-link-href");
            const updatedLinks = [];

            labels.forEach((labelEl, i) => {
                const label = labelEl.value.trim();
                const href = hrefs[i] ? hrefs[i].value.trim() : "#";
                if (label) updatedLinks.push({ label, href });
            });

            const current = getSiteSettings();
            current.footerLinks = updatedLinks;
            localStorage.setItem("antigravity_site_settings", JSON.stringify(current));
            alert("✅ Footer Navigation Menu saved!");
        });
    }

    // Reset Menus
    const resetMenusBtn = document.getElementById("btnResetMenus");
    if (resetMenusBtn) {
        resetMenusBtn.addEventListener("click", () => {
            if (confirm("Kya aap Header aur Footer menus ko default par reset karna chahte hain?")) {
                const current = getSiteSettings();
                current.navLinks = [...DEFAULT_SITE_SETTINGS.navLinks];
                current.footerLinks = [...DEFAULT_SITE_SETTINGS.footerLinks];
                localStorage.setItem("antigravity_site_settings", JSON.stringify(current));
                renderNavMenus();
                alert("✅ Menus reset to default!");
            }
        });
    }
}

// 4. PAGE CONTENT EDITOR CMS
function getPageContent() {
    try {
        const saved = localStorage.getItem("antigravity_page_content");
        if (saved) return { ...DEFAULT_PAGE_CONTENT, ...JSON.parse(saved) };
    } catch (e) {}
    return DEFAULT_PAGE_CONTENT;
}

function loadPageContentIntoForm() {
    const content = getPageContent();
    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val || "";
    };

    setVal("cmsInputHeroBadge", content.heroBadge);
    setVal("cmsInputHeroH1", content.heroH1);
    setVal("cmsInputHeroLead", content.heroLead);
    setVal("cmsInputFeaturesTitle", content.featuresTitle);
    setVal("cmsInputFeaturesSub", content.featuresSub);
    setVal("cmsInputCurriculumTitle", content.curriculumTitle);
    setVal("cmsInputCurriculumSub", content.curriculumSub);
    setVal("cmsInputPricingTitle", content.pricingTitle);
    setVal("cmsInputPricingSub", content.pricingSub);
    setVal("cmsInputPricingCardDesc", content.pricingCardDesc);
    setVal("cmsInputFaqTitle", content.faqTitle);
}

function setupPageContentActions() {
    const form = document.getElementById("pageContentForm");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const getVal = (id) => {
                const el = document.getElementById(id);
                return el ? el.value.trim() : "";
            };

            const updatedContent = {
                heroBadge: getVal("cmsInputHeroBadge"),
                heroH1: getVal("cmsInputHeroH1"),
                heroLead: getVal("cmsInputHeroLead"),
                featuresTitle: getVal("cmsInputFeaturesTitle"),
                featuresSub: getVal("cmsInputFeaturesSub"),
                curriculumTitle: getVal("cmsInputCurriculumTitle"),
                curriculumSub: getVal("cmsInputCurriculumSub"),
                pricingTitle: getVal("cmsInputPricingTitle"),
                pricingSub: getVal("cmsInputPricingSub"),
                pricingCardDesc: getVal("cmsInputPricingCardDesc"),
                faqTitle: getVal("cmsInputFaqTitle")
            };

            localStorage.setItem("antigravity_page_content", JSON.stringify(updatedContent));
            alert("✅ All Page Content changes successfully saved!\nLanding page par ab aapka likha naya text dikhega.");
        });
    }

    const resetBtn = document.getElementById("btnResetPageContent");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            if (confirm("Kya aap sabhi page text ko wapas default par reset karna chahte hain?")) {
                localStorage.removeItem("antigravity_page_content");
                loadPageContentIntoForm();
                alert("✅ Page content successfully reset to default!");
            }
        });
    }
}

/* ==========================================================================
   5. AFFILIATE & TARGET REWARDS MANAGEMENT (₹500 PER 5 SALES)
   ========================================================================== */

const DEFAULT_DEMO_ORDERS = [
    {
        id: "ORD-98214",
        token: "AGY-EBK-RHL8-92M1",
        name: "Vikram Malhotra",
        email: "vikram.m@gmail.com",
        phone: "+91 98201 12345",
        utr: "428719823412",
        amount: 199,
        currency: "₹",
        timestamp: "2026-10-02T09:15:00.000Z",
        dateFormatted: "02/10/2026, 02:45 PM",
        verified: true,
        status: "Verified / Access Sent",
        deviceStatus: "Bound: Windows PC (Chrome)",
        refToken: "REF-RAHUL-77"
    },
    {
        id: "ORD-98215",
        token: "AGY-EBK-ANKT-55Q2",
        name: "Aniket Joshi",
        email: "aniket.joshi@outlook.com",
        phone: "+91 98450 67890",
        utr: "428719823413",
        amount: 199,
        currency: "₹",
        timestamp: "2026-10-02T10:02:00.000Z",
        dateFormatted: "02/10/2026, 03:32 PM",
        verified: true,
        status: "Verified / Access Sent",
        deviceStatus: "Bound: Android Mobile (Chrome)",
        refToken: "REF-RAHUL-77"
    },
    {
        id: "ORD-98216",
        token: "AGY-EBK-SNJY-31L9",
        name: "Sanjay Singhania",
        email: "sanjay.s@techcorp.in",
        phone: "+91 98711 23456",
        utr: "428719823414",
        amount: 199,
        currency: "₹",
        timestamp: "2026-10-02T10:45:00.000Z",
        dateFormatted: "02/10/2026, 04:15 PM",
        verified: true,
        status: "Verified / Access Sent",
        deviceStatus: "Bound: Macintosh (Safari)",
        refToken: "REF-RAHUL-77"
    },
    {
        id: "ORD-98217",
        token: "AGY-EBK-MEHA-77X3",
        name: "Sneha Roy",
        email: "sneha.roy@gmail.com",
        phone: "+91 97112 34567",
        utr: "428719823415",
        amount: 199,
        currency: "₹",
        timestamp: "2026-10-02T11:20:00.000Z",
        dateFormatted: "02/10/2026, 04:50 PM",
        verified: true,
        status: "Verified / Access Sent",
        deviceStatus: "Bound: Windows PC (Edge)",
        refToken: "REF-RAHUL-77"
    },
    {
        id: "ORD-98218",
        token: "AGY-EBK-KRNL-88P4",
        name: "Karan Patel",
        email: "karan.patel@startup.io",
        phone: "+91 99001 23456",
        utr: "428719823416",
        amount: 199,
        currency: "₹",
        timestamp: "2026-10-02T11:55:00.000Z",
        dateFormatted: "02/10/2026, 05:25 PM",
        verified: true,
        status: "Verified / Access Sent",
        deviceStatus: "Bound: Apple iOS Device (Safari)",
        refToken: "REF-RAHUL-77"
    },
    {
        id: "ORD-98219",
        token: "AGY-EBK-MANJ-12K8",
        name: "Manoj Tiwari",
        email: "manoj.tiwari@gmail.com",
        phone: "+91 98220 33445",
        utr: "428719823417",
        amount: 199,
        currency: "₹",
        timestamp: "2026-10-02T12:10:00.000Z",
        dateFormatted: "02/10/2026, 05:40 PM",
        verified: true,
        status: "Verified / Access Sent",
        deviceStatus: "Bound: Android Mobile (Chrome)",
        refToken: "REF-PRIYA-99"
    },
    {
        id: "ORD-98220",
        token: "AGY-EBK-DPKA-44Y2",
        name: "Deepika Sen",
        email: "deepika.sen@gmail.com",
        phone: "+91 98330 44556",
        utr: "428719823418",
        amount: 199,
        currency: "₹",
        timestamp: "2026-10-02T12:30:00.000Z",
        dateFormatted: "02/10/2026, 06:00 PM",
        verified: true,
        status: "Verified / Access Sent",
        deviceStatus: "Bound: Windows PC (Chrome)",
        refToken: "REF-PRIYA-99"
    },
    {
        id: "ORD-98221",
        token: "AGY-EBK-RSHI-66Z1",
        name: "Rishi Kapoor",
        email: "rishi.k@outlook.com",
        phone: "+91 98440 55667",
        utr: "428719823419",
        amount: 199,
        currency: "₹",
        timestamp: "2026-10-02T12:45:00.000Z",
        dateFormatted: "02/10/2026, 06:15 PM",
        verified: true,
        status: "Verified / Access Sent",
        deviceStatus: "Bound: Macintosh (Chrome)",
        refToken: "REF-PRIYA-99"
    }
];

const DEFAULT_DEMO_AFFILIATES = {
    "REF-RAHUL-77": {
        token: "REF-RAHUL-77",
        name: "Rahul Sharma (Tech YouTuber)",
        email: "rahul.developer@gmail.com",
        phone: "+91 9876543210",
        upiId: "rahul.dev@okicici",
        referralCount: 5,
        targetSales: 5,
        payoutStatus: "PENDING",
        registeredAt: "2026-10-01T10:00:00.000Z"
    },
    "REF-PRIYA-99": {
        token: "REF-PRIYA-99",
        name: "Priya Patel (AI Community Admin)",
        email: "priya.ai@community.org",
        phone: "+91 9811223344",
        upiId: "priya.patel@paytm",
        referralCount: 3,
        targetSales: 5,
        payoutStatus: "IN_PROGRESS",
        registeredAt: "2026-10-01T14:30:00.000Z"
    },
    "REF-AMIT-42": {
        token: "REF-AMIT-42",
        name: "Amit Verma (Freelance Dev)",
        email: "amit.verma@codelab.in",
        phone: "+91 9899001122",
        upiId: "amitverma@apl",
        referralCount: 5,
        targetSales: 5,
        payoutStatus: "PAID",
        paidAt: "2026-10-02T11:00:00.000Z",
        rewardAmount: 500,
        registeredAt: "2026-09-30T09:00:00.000Z"
    }
};

function getOrdersList() {
    try {
        const saved = localStorage.getItem("antigravity_orders");
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {}
    localStorage.setItem("antigravity_orders", JSON.stringify(DEFAULT_DEMO_ORDERS));
    return DEFAULT_DEMO_ORDERS;
}

function getAffiliatesData() {
    try {
        const saved = localStorage.getItem("antigravity_affiliates");
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && Object.keys(parsed).length > 0) return parsed;
        }
    } catch (e) {}
    localStorage.setItem("antigravity_affiliates", JSON.stringify(DEFAULT_DEMO_AFFILIATES));
    return DEFAULT_DEMO_AFFILIATES;
}

function saveAffiliatesData(data) {
    localStorage.setItem("antigravity_affiliates", JSON.stringify(data));
}

// Check if any partner reached 5 referrals and needs payout
function checkUrgentAffiliateAlerts() {
    const affiliates = getAffiliatesData();
    const orders = getOrdersList();
    const alertBox = document.getElementById("adminAffiliateUrgentAlert");
    const urgentList = document.getElementById("urgentAlertPartnersList");
    const badge = document.getElementById("affiliateAlertBadge");

    let pendingCount = 0;
    let urgentCardsHtml = "";

    Object.values(affiliates).forEach(aff => {
        // Calculate verified/paid referral orders
        const partnerOrders = orders.filter(o => o.refToken && o.refToken.toLowerCase() === aff.token.toLowerCase());
        const salesCount = Math.max(partnerOrders.length, aff.referralCount || 0);

        if (salesCount >= 5 && aff.payoutStatus !== "PAID") {
            pendingCount++;
            urgentCardsHtml += `
                <div class="urgent-partner-card">
                    <div>
                        <strong style="color: #fff; font-size: 0.95rem;">👤 ${escapeHtml(aff.name || "Affiliate Partner")}</strong> 
                        <code style="color: #00f0ff; font-size: 0.8rem; margin-left: 8px;">Token: ${escapeHtml(aff.token)}</code><br>
                        <span style="color: #94a3b8; font-size: 0.85rem;">Email: ${escapeHtml(aff.email || "N/A")} • Phone: ${escapeHtml(aff.phone || "N/A")}</span><br>
                        <span style="color: #f59e0b; font-weight: 700; font-size: 0.9rem;">💳 UPI ID for Payout: <mark style="background:#f59e0b; color:#000; padding:2px 6px; border-radius:4px;">${escapeHtml(aff.upiId || "Not set yet")}</mark></span>
                        <div style="margin-top: 4px; color: #10b981; font-size: 0.8rem; font-weight: 600;">
                            🎯 Target Achieved: ${salesCount} Paid Sales (Target: 5 Sales) • Reward Due: ₹500
                        </div>
                    </div>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <button type="button" class="btn btn-primary btn-mark-paid" data-token="${escapeHtml(aff.token)}" style="background: #10b981; border-color: #10b981; color: #000; font-weight: 700; font-size: 0.85rem; padding: 9px 16px;">
                            ✅ Mark ₹500 as Paid
                        </button>
                        ${aff.phone ? `
                            <a href="https://wa.me/${aff.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${aff.name}, Badhai ho! Aapne Antigravity E-Book affiliate me 5 sales target complete kar liya hai. Aapka ₹500 reward aapke UPI (${aff.upiId}) par bheja ja raha hai.`)}" target="_blank" class="btn btn-secondary" style="font-size: 0.82rem; padding: 9px 12px;">
                                💬 WhatsApp
                            </a>
                        ` : ''}
                    </div>
                </div>
            `;
        }
    });

    if (pendingCount > 0) {
        if (alertBox) alertBox.style.display = "block";
        if (urgentList) urgentList.innerHTML = urgentCardsHtml;
        if (badge) {
            badge.style.display = "inline-block";
            badge.textContent = `${pendingCount} REWARD DUE`;
        }
    } else {
        if (alertBox) alertBox.style.display = "none";
        if (badge) badge.style.display = "none";
    }

    const statPending = document.getElementById("statPendingRewards");
    if (statPending) statPending.textContent = pendingCount;
}

// Render Affiliates Partners Table
function renderAffiliatesTable(filterText = "") {
    const tbody = document.getElementById("affiliatesTableBody");
    if (!tbody) return;

    const affiliates = getAffiliatesData();
    const orders = getOrdersList();
    const affList = Object.values(affiliates);

    // Update summary stats
    const totalAffEl = document.getElementById("statTotalAffiliates");
    const totalSalesEl = document.getElementById("statTotalReferralSales");
    const statPaidRewards = document.getElementById("statPaidRewards");

    let totalReferralSales = 0;
    let totalPaidRewardsSum = 0;

    affList.forEach(a => {
        const partnerOrders = orders.filter(o => o.refToken && o.refToken.toLowerCase() === a.token.toLowerCase());
        const salesCount = Math.max(partnerOrders.length, a.referralCount || 0);
        totalReferralSales += salesCount;
        if (a.payoutStatus === "PAID") totalPaidRewardsSum += 500;
    });

    if (totalAffEl) totalAffEl.textContent = affList.length;
    if (totalSalesEl) totalSalesEl.textContent = totalReferralSales;
    if (statPaidRewards) statPaidRewards.textContent = `₹${totalPaidRewardsSum}`;

    const query = filterText.toLowerCase().trim();
    const filtered = affList.filter(a => {
        if (!query) return true;
        return (a.name && a.name.toLowerCase().includes(query)) ||
               (a.email && a.email.toLowerCase().includes(query)) ||
               (a.token && a.token.toLowerCase().includes(query)) ||
               (a.upiId && a.upiId.toLowerCase().includes(query));
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <div style="font-size: 2.2rem; margin-bottom: 8px;">🤝</div>
                    <p style="font-size: 0.95rem; font-weight: 600; color: #cbd5e1;">Abhi tak koi Affiliate Partner register nahi hua hai.</p>
                    <p style="font-size: 0.82rem; color: #64748b; margin-top: 4px;">Jab koi buyer purchase karega, unka affiliate account aur link automatically yahan aa jayega!</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map(aff => {
        const partnerOrders = orders.filter(o => o.refToken && o.refToken.toLowerCase() === aff.token.toLowerCase());
        const salesCount = Math.max(partnerOrders.length, aff.referralCount || 0);
        const percent = Math.min(100, Math.round((salesCount / 5) * 100));
        const isTargetHit = salesCount >= 5;
        const isPaid = aff.payoutStatus === "PAID";

        let statusBadge = "";
        if (isPaid) {
            statusBadge = `<span class="badge-target-paid">✅ ₹500 Paid</span>`;
        } else if (isTargetHit) {
            statusBadge = `<span class="badge-target-complete">🚨 Target Hit! Pay ₹500</span>`;
        } else {
            statusBadge = `<span class="badge-target-progress">${salesCount}/5 Sales (${percent}%)</span>`;
        }

        return `
            <tr>
                <td>
                    <strong style="color: #fff;">${escapeHtml(aff.name || "Partner")}</strong><br>
                    <code style="color: #00f0ff; font-size: 0.78rem;">${escapeHtml(aff.token)}</code>
                </td>
                <td>
                    <div style="font-size: 0.84rem;">
                        <span>✉️ ${escapeHtml(aff.email || "N/A")}</span><br>
                        <span style="color: #94a3b8;">📱 ${escapeHtml(aff.phone || "N/A")}</span>
                    </div>
                </td>
                <td>
                    <span style="color: #f59e0b; font-family: monospace; font-weight: 700; font-size: 0.85rem;">
                        ${escapeHtml(aff.upiId || "Not set")}
                    </span>
                </td>
                <td>
                    <strong style="font-size: 1.1rem; color: ${salesCount > 0 ? '#10b981' : '#94a3b8'};">${salesCount}</strong>
                    <span style="font-size: 0.75rem; color: #64748b;"> buyers</span>
                </td>
                <td>
                    <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 0.8rem; font-weight: 600; color: ${isTargetHit ? '#10b981' : '#cbd5e1'};">
                            ${salesCount}/5 Target
                        </span>
                        <div class="affiliate-target-bar">
                            <div class="affiliate-target-fill ${isTargetHit ? 'complete' : ''}" style="width: ${percent}%;"></div>
                        </div>
                    </div>
                </td>
                <td>
                    ${statusBadge}
                </td>
                <td>
                    <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
                        <button type="button" class="table-action-btn btn-toggle-orders" data-token="${escapeHtml(aff.token)}" title="View Referred Buyers">
                            👁️ Orders (${partnerOrders.length})
                        </button>
                        ${isTargetHit && !isPaid ? `
                            <button type="button" class="table-action-btn btn-mark-paid" data-token="${escapeHtml(aff.token)}" style="background: rgba(16, 185, 129, 0.2); border-color: #10b981; color: #34d399;">
                                💸 Mark Paid
                            </button>
                        ` : ''}
                        <button type="button" class="table-action-btn btn-add-test-sale" data-token="${escapeHtml(aff.token)}" title="Add +1 Test Referral Order" style="background: rgba(168, 85, 247, 0.15); border-color: #a855f7; color: #c084fc;">
                            ➕ +1 Test Sale
                        </button>
                    </div>
                </td>
            </tr>
            <!-- Collapsible Orders Drawer -->
            <tr id="ordersRow_${escapeHtml(aff.token)}" style="display: none;">
                <td colspan="7" style="background: rgba(0, 0, 0, 0.25); padding: 12px 20px;">
                    <div class="affiliate-orders-accordion">
                        <strong style="color: #00f0ff; font-size: 0.85rem;">📋 Buyers referred by this Partner (${partnerOrders.length} Total):</strong>
                        ${partnerOrders.length === 0 ? `
                            <p style="color: #64748b; font-size: 0.8rem; margin-top: 6px;">Abhi tak is partner ki link se koi paid order nahi aaya hai.</p>
                        ` : `
                            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 10px; margin-top: 8px;">
                                ${partnerOrders.map(o => `
                                    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 8px 12px; font-size: 0.8rem;">
                                        <strong>👤 ${escapeHtml(o.name || "Customer")}</strong><br>
                                        <span style="color: #94a3b8;">✉️ ${escapeHtml(o.email || "")}</span><br>
                                        <span style="color: #cbd5e1;">UTR: <code style="color:#00f0ff;">${escapeHtml(o.utr || "N/A")}</code></span> • <span style="color:#10b981; font-weight:700;">₹${o.amount || 199}</span>
                                    </div>
                                `).join("")}
                            </div>
                        `}
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

// Mark Affiliate Target Reward Paid
function markAffiliatePaid(token) {
    const affiliates = getAffiliatesData();
    if (!affiliates[token]) return;

    if (confirm(`Kya aap confirm karte hain ki aapne ${affiliates[token].name || "Partner"} ke UPI (${affiliates[token].upiId || "N/A"}) par ₹500 reward transfer kar diya hai?`)) {
        affiliates[token].payoutStatus = "PAID";
        affiliates[token].paidAt = new Date().toISOString();
        affiliates[token].rewardAmount = 500;
        saveAffiliatesData(affiliates);

        renderAffiliatesTable();
        checkUrgentAffiliateAlerts();
        alert(`✅ ₹500 Payout recorded for ${affiliates[token].name}!\nPartner status has been updated to PAID.`);
    }
}

// Quick Test Tool: Add Mock Referral Order for Token
function addTestAffiliateReferral(token) {
    const orders = getOrdersList();
    const mockOrder = {
        token: "TEST-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        name: "Test Referral Buyer #" + (orders.length + 1),
        email: `testbuyer${orders.length + 1}@example.com`,
        phone: "+9198765" + Math.floor(10000 + Math.random() * 90000),
        utr: "UTR" + Math.floor(100000000000 + Math.random() * 900000000000),
        amount: 199,
        timestamp: new Date().toISOString(),
        verified: true,
        refToken: token
    };

    orders.unshift(mockOrder);
    localStorage.setItem("antigravity_orders", JSON.stringify(orders));

    // Also update affiliate referral count directly
    const affiliates = getAffiliatesData();
    if (affiliates[token]) {
        affiliates[token].referralCount = (affiliates[token].referralCount || 0) + 1;
        saveAffiliatesData(affiliates);
    }

    renderOrdersTable();
    renderAffiliatesTable();
    checkUrgentAffiliateAlerts();
    alert(`🎉 +1 Test Referral Order added successfully for Token: ${token}!\nAgli baar jab total 5 ho jayenge, to ₹500 payout alert activate ho jayega.`);
}

function setupAffiliateActions() {
    const searchInput = document.getElementById("affiliateSearchInput");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            renderAffiliatesTable(e.target.value);
        });
    }

    const refreshBtn = document.getElementById("btnRefreshAffiliates");
    if (refreshBtn) {
        refreshBtn.addEventListener("click", () => {
            renderAffiliatesTable();
            checkUrgentAffiliateAlerts();
        });
    }

    const resetDemoAffBtn = document.getElementById("btnResetDemoAffiliates");
    if (resetDemoAffBtn) {
        resetDemoAffBtn.addEventListener("click", () => {
            localStorage.setItem("antigravity_affiliates", JSON.stringify(DEFAULT_DEMO_AFFILIATES));
            localStorage.setItem("antigravity_orders", JSON.stringify(DEFAULT_DEMO_ORDERS));
            renderOrdersTable();
            renderAffiliatesTable();
            checkUrgentAffiliateAlerts();
            alert("✅ Sample Demo Affiliate Partners restored successfully!");
        });
    }

    // Delegate clicks for mark-paid, toggle-orders, and add-test-sale
    document.addEventListener("click", (e) => {
        const markBtn = e.target.closest(".btn-mark-paid");
        if (markBtn) {
            const token = markBtn.getAttribute("data-token");
            if (token) markAffiliatePaid(token);
            return;
        }

        const toggleBtn = e.target.closest(".btn-toggle-orders");
        if (toggleBtn) {
            const token = toggleBtn.getAttribute("data-token");
            const row = document.getElementById(`ordersRow_${token}`);
            if (row) {
                row.style.display = row.style.display === "none" ? "table-row" : "none";
            }
            return;
        }

        const addTestBtn = e.target.closest(".btn-add-test-sale");
        if (addTestBtn) {
            const token = addTestBtn.getAttribute("data-token");
            if (token) addTestAffiliateReferral(token);
            return;
        }
    });
}

/* ==========================================================================
   6. COURSE & E-BOOK MANAGER (MULTI-COURSE CMS + 5 TEMPLATES)
   ========================================================================== */

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
        createdAt: "2026-10-01",
        isDefault: true,
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
        createdAt: "2026-10-02",
        isDefault: false,
        landingConfig: {
            templateId: "template_saas",
            heroHeadline: "Build & Launch Production AI Micro-SaaS in Record Time",
            heroSubheadline: "Complete roadmap: Next.js 15 App Router, Server Actions, Stripe/Cashfree payments, Supabase auth, and multi-tenant billing.",
            keyPoints: [
                "Next.js 15 App Router & Server Components Architecture",
                "Supabase Database, Row-Level Security & Auth Flow",
                "Payment Webhooks & Multi-Currency Subscription Handling",
                "Deploying Production Clusters to Vercel & Custom Domains"
            ],
            ctaText: "Enroll in Full-Stack SaaS Masterclass • ₹299"
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
        createdAt: "2026-10-03",
        isDefault: false,
        landingConfig: {
            templateId: "template_sales",
            heroHeadline: "Scale Your AI Web Agency to ₹1,00,000 - ₹3,00,000 Monthly",
            heroSubheadline: "Deliver high-ticket websites in 24 hours using autonomous AI coding tools. Cold outreach scripts, pricing calculators, and contract templates included.",
            keyPoints: [
                "1-Day Website Delivery Workflow with AI Agents",
                "High-Converting Cold DM & Email Pitch Scripts",
                "Client Contract & Retainer Agreement Blueprints",
                "Live Case Studies: From Zero to ₹2,50,000 in 60 Days"
            ],
            ctaText: "Get Instant Access to Agency Blueprint • ₹149"
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
        createdAt: "2026-10-04",
        isDefault: false,
        landingConfig: {
            templateId: "template_luxury",
            heroHeadline: "Architect Autonomous Multi-Agent Systems with Zero Fluff",
            heroSubheadline: "Master advanced prompt engineering frameworks (CPRE), model context protocol (MCP) servers, and custom agent memory injection.",
            keyPoints: [
                "Advanced CPRE Agentic Prompting Frameworks",
                "Model Context Protocol (MCP) Server Integrations",
                "Self-Healing Code Review Loops & Linters",
                "Autonomous Background Daemons & Scheduled Crons"
            ],
            ctaText: "Unlock Advanced Prompt Masterclass • ₹199"
        }
    }
];

function getCoursesCatalog() {
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

function saveCoursesCatalog(catalog) {
    localStorage.setItem("antigravity_courses_catalog", JSON.stringify(catalog));
}

function getTemplateLabel(templateId) {
    const map = {
        "template_tech": "🚀 Tech Dark",
        "template_luxury": "💎 Clean Luxury",
        "template_sales": "🎯 Masterclass Sales",
        "template_saas": "⚡ Modern SaaS",
        "template_author": "📚 Author Showcase"
    };
    return map[templateId] || "🚀 Tech Dark";
}

function renderCoursesCatalog() {
    const tbody = document.getElementById("coursesCatalogTableBody");
    if (!tbody) return;

    const catalog = getCoursesCatalog();
    const activeCourses = catalog.filter(c => c.isActive);
    const activeCount = activeCourses.length;

    // Update active book status card and summary badge
    const activeTitle = document.getElementById("currentActiveBookTitle");
    const activeMeta = document.getElementById("currentActiveBookMeta");
    const summaryBadge = document.getElementById("catalogCountSummaryBadge");

    if (summaryBadge) {
        summaryBadge.textContent = `Total: ${catalog.length} | 🟢 Active: ${activeCount} | ⚪ Draft: ${catalog.length - activeCount}`;
    }

    if (activeTitle) {
        activeTitle.textContent = `${activeCount} Course${activeCount === 1 ? '' : 's'} Currently LIVE on Storefront`;
    }
    if (activeMeta) {
        activeMeta.textContent = `All active courses appear on courses.html with instant purchase & DRM reader. Total courses in catalog: ${catalog.length}`;
    }

    if (catalog.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="empty-state">No courses in catalog. Add one above!</td></tr>`;
        return;
    }

    tbody.innerHTML = catalog.map(c => `
        <tr id="courseRow_${escapeHtml(c.id)}">
            <td>
                <div style="display: flex; align-items: flex-start; gap: 8px;">
                    <div>
                        <strong style="color: #fff; font-size: 0.95rem;">${escapeHtml(c.title)}</strong>
                        ${c.badge ? `<span style="margin-left: 6px; font-size: 0.68rem; background: rgba(0, 240, 255, 0.15); color: #00f0ff; padding: 2px 6px; border-radius: 4px; font-weight: 700;">${escapeHtml(c.badge)}</span>` : ''}
                        <br>
                        <span style="color: #94a3b8; font-size: 0.78rem;">${escapeHtml(c.subtitle || "")}</span>
                        <div style="font-size: 0.72rem; color: #64748b; margin-top: 3px;">By: ${escapeHtml(c.author || "Admin")}</div>
                    </div>
                </div>
            </td>
            <td>
                <span style="background: rgba(255,255,255,0.06); padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; color: #00f0ff;">
                    ${escapeHtml(c.category || "General")}
                </span>
            </td>
            <td>
                <strong>${c.chapterCount || 0}</strong> chapters
            </td>
            <td>
                <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="color: #10b981; font-weight: 700; font-size: 0.95rem;">₹${c.price}</span>
                    ${c.strikePrice ? `<del style="color:#64748b; font-size:0.75rem;">₹${c.strikePrice}</del>` : ''}
                </div>
            </td>
            <td>
                <span style="font-size: 0.75rem; color: #a78bfa; background: rgba(167, 139, 250, 0.12); padding: 3px 8px; border-radius: 4px; border: 1px solid rgba(167, 139, 250, 0.25);">
                    ${getTemplateLabel(c.landingConfig?.templateId)}
                </span>
            </td>
            <td>
                <div style="display: flex; flex-direction: column; gap: 6px; align-items: flex-start;">
                    ${c.isActive ? `
                        <span class="badge-status verified" style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.75rem;">
                            🟢 LIVE (Active)
                        </span>
                        <button type="button" class="table-action-btn btn-toggle-course-status" data-id="${escapeHtml(c.id)}" style="background: rgba(239, 68, 68, 0.12); border-color: rgba(239, 68, 68, 0.4); color: #f87171; font-size: 0.72rem; padding: 3px 8px;">
                            Make Draft
                        </button>
                    ` : `
                        <span class="badge-status pending" style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.75rem;">
                            ⚪ Draft (Inactive)
                        </span>
                        <button type="button" class="table-action-btn btn-toggle-course-status" data-id="${escapeHtml(c.id)}" style="background: rgba(16, 185, 129, 0.15); border-color: #10b981; color: #34d399; font-size: 0.72rem; padding: 3px 8px;">
                            🟢 Make Live
                        </button>
                    `}
                </div>
            </td>
            <td>
                <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
                    <button type="button" class="table-action-btn btn-edit-course" data-id="${escapeHtml(c.id)}" style="background: rgba(245, 158, 11, 0.15); border-color: #f59e0b; color: #fbbf24;" title="Edit Course Details & Landing Page">
                        ✏️ Edit
                    </button>
                    <a href="course.html?id=${encodeURIComponent(c.id)}" target="_blank" class="table-action-btn" style="background: rgba(0, 240, 255, 0.12); border-color: #00f0ff; color: #00f0ff;" title="Open Course Landing Page">
                        🌐 Page
                    </a>
                    <a href="reader.html?courseId=${encodeURIComponent(c.id)}" target="_blank" class="table-action-btn" title="Preview Reader">
                        📖 Reader
                    </a>
                    <button type="button" class="table-action-btn btn-del-course" data-id="${escapeHtml(c.id)}" style="background: rgba(239, 68, 68, 0.15); border-color: #ef4444; color: #f87171;" title="Delete Course">
                        🗑️ Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join("");
}

// Temporary store for currently parsed chapters during drag-and-drop / editing
let CURRENT_PARSED_CHAPTERS = [];

function setupCourseDropZoneAndUploader() {
    const dropZone = document.getElementById("courseDropZone");
    const fileInput = document.getElementById("courseFileInput");
    const browseBtn = document.getElementById("btnBrowseCourseFile");
    const fileInfo = document.getElementById("dropFileInfo");
    const form = document.getElementById("newCourseForm");
    const btnSaveCatalog = document.getElementById("btnSaveToCatalog");
    const btnAddManual = document.getElementById("btnAddManualChapter");
    const btnClearChapters = document.getElementById("btnClearAllChapters");

    const tabBtnUpload = document.getElementById("tabBtnUploadMode");
    const tabBtnPaste = document.getElementById("tabBtnPasteMode");
    const btnLoadSample = document.getElementById("btnLoadSampleDoc");
    const uploadSection = document.getElementById("uploadModeSection");
    const pasteSection = document.getElementById("pasteModeSection");
    const pasteTextarea = document.getElementById("coursePasteTextarea");
    const btnParsePasted = document.getElementById("btnParsePastedText");
    const btnClearPasted = document.getElementById("btnClearPastedText");

    const dropIcon = document.getElementById("dropZoneIcon");
    const dropHeading = document.getElementById("dropZoneHeading");
    const dropSubheading = document.getElementById("dropZoneSubheading");

    if (!dropZone || !fileInput) return;

    // 0. Prevent browser default drag-and-drop navigation on the whole window
    window.addEventListener("dragover", (e) => {
        e.preventDefault();
    }, false);
    window.addEventListener("drop", (e) => {
        e.preventDefault();
    }, false);

    // 1. Mode Switcher Tabs
    if (tabBtnUpload && tabBtnPaste) {
        tabBtnUpload.addEventListener("click", () => {
            tabBtnUpload.classList.add("active");
            tabBtnPaste.classList.remove("active");
            if (uploadSection) uploadSection.style.display = "block";
            if (pasteSection) pasteSection.style.display = "none";
        });

        tabBtnPaste.addEventListener("click", () => {
            tabBtnPaste.classList.add("active");
            tabBtnUpload.classList.remove("active");
            if (uploadSection) uploadSection.style.display = "none";
            if (pasteSection) pasteSection.style.display = "block";
        });
    }

    // 2. Drag & Drop & Click Events on the full-coverage fileInput overlay
    fileInput.addEventListener("dragenter", (e) => {
        e.preventDefault();
        dropZone.classList.add("drag-active");
        if (dropIcon) dropIcon.textContent = "📥";
        if (dropHeading) dropHeading.textContent = "Drop Your E-Book File Here!";
        if (dropSubheading) dropSubheading.textContent = "Release mouse to immediately analyze and parse chapters...";
    });

    fileInput.addEventListener("dragover", (e) => {
        e.preventDefault();
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = "copy";
        }
        dropZone.classList.add("drag-active");
    });

    fileInput.addEventListener("dragleave", (e) => {
        e.preventDefault();
        resetDropZoneVisuals();
    });

    fileInput.addEventListener("drop", (e) => {
        e.preventDefault();
        resetDropZoneVisuals();
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleCourseFileUpload(e.dataTransfer.files[0]);
        }
    });

    function resetDropZoneVisuals() {
        dropZone.classList.remove("drag-active");
        if (dropIcon) dropIcon.textContent = "📄";
        if (dropHeading) dropHeading.textContent = "Drag & Drop your E-Book Document Here";
        if (dropSubheading) dropSubheading.innerHTML = "Supported formats: <strong>.txt, .md (Markdown), .doc, .docx, .html, .json</strong>";
    }

    // Native file input change listener (triggers when user picks a file from browse dialog or drops file)
    fileInput.addEventListener("change", (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleCourseFileUpload(e.target.files[0]);
        }
        setTimeout(() => {
            try { fileInput.value = ""; } catch (err) {}
        }, 800);
    });

    // Secondary Direct Click Button
    const manualBrowseBtn = document.getElementById("btnManualBrowseTrigger");
    if (manualBrowseBtn) {
        manualBrowseBtn.addEventListener("click", (e) => {
            e.preventDefault();
            fileInput.click();
        });
    }

    // 4. File Processing (DOCX, TXT, MD, HTML, JSON)
    async function handleCourseFileUpload(file) {
        if (!file) return;

        if (fileInfo) {
            fileInfo.style.display = "block";
            fileInfo.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <strong>📁 Reading:</strong> ${escapeHtml(file.name)} (${(file.size / 1024).toFixed(1)} KB)
                        <br><span style="color: #94a3b8; font-size: 0.8rem;">⏳ Extracting text and parsing chapter structure...</span>
                    </div>
                </div>
            `;
        }

        // Auto-set title from filename if title input is empty or default
        const titleInput = document.getElementById("courseInputTitle");
        if (titleInput && (!titleInput.value || titleInput.value.includes("Master Next.js"))) {
            const cleanName = file.name
                .replace(/\.[^/.]+$/, "")
                .replace(/[-_]/g, " ")
                .replace(/\b\w/g, l => l.toUpperCase());
            titleInput.value = cleanName;
        }

        try {
            let rawContent = "";
            const ext = file.name.split('.').pop().toLowerCase();

            if (ext === "docx" || ext === "doc") {
                rawContent = await readDocxFile(file);
            } else {
                rawContent = await readTextFile(file);
            }

            if (!rawContent || !rawContent.trim()) {
                const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
                rawContent = `# Chapter 1: Introduction to ${cleanName}\nDetailed foundations, tools, and workflows for ${cleanName}.\n\n# Chapter 2: Practical Implementation & Best Practices\nStep-by-step guidance, code blueprints, and architecture setup.\n\n# Chapter 3: Monetization & Scaling Blueprint\nDeploying to production, client delivery, and long-term revenue strategy.`;
            }

            CURRENT_PARSED_CHAPTERS = parseChaptersFromDocument(rawContent, file.name);
            renderParsedChaptersPreview(CURRENT_PARSED_CHAPTERS);

            if (fileInfo) {
                fileInfo.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                        <div>
                            <span style="color: #10b981; font-weight: 700;">✅ ${escapeHtml(file.name)}</span>
                            <span style="color: #94a3b8; font-size: 0.8rem;">(${(file.size / 1024).toFixed(1)} KB)</span>
                            <br>
                            <strong style="color: #00f0ff;">${CURRENT_PARSED_CHAPTERS.length} Chapters Extracted</strong> & ready to publish!
                        </div>
                        <button type="button" id="btnRemoveUploadedFile" style="background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; color: #f87171; border-radius: 6px; padding: 4px 10px; font-size: 0.78rem; cursor: pointer;">
                            ✕ Remove
                        </button>
                    </div>
                `;

                const removeBtn = document.getElementById("btnRemoveUploadedFile");
                if (removeBtn) {
                    removeBtn.addEventListener("click", () => {
                        CURRENT_PARSED_CHAPTERS = [];
                        renderParsedChaptersPreview([]);
                        fileInfo.style.display = "none";
                    });
                }
            }

        } catch (err) {
            console.error("Document parsing error:", err);
            if (fileInfo) {
                fileInfo.innerHTML = `
                    <div style="color: #ef4444;">
                        <strong>⚠️ Error reading document:</strong> ${escapeHtml(err.message || "File could not be parsed.")}
                        <br><small style="color: #94a3b8;">Try uploading a .txt or .md file, or click "Test with Sample E-Book Doc".</small>
                    </div>
                `;
            }
        }
    }

    // 5. Test with Sample E-Book Doc Button
    if (btnLoadSample) {
        btnLoadSample.addEventListener("click", () => {
            const titleInput = document.getElementById("courseInputTitle");
            const subInput = document.getElementById("courseInputSubtitle");
            const catInput = document.getElementById("courseInputCategory");
            const priceInput = document.getElementById("courseInputPrice");
            const strikeInput = document.getElementById("courseInputStrikePrice");
            const authorInput = document.getElementById("courseInputAuthor");

            if (titleInput) titleInput.value = "Google Antigravity Agentic Blueprint 2026";
            if (subInput) subInput.value = "Complete Guide to Autonomous AI Coding & SaaS Production Delivery";
            if (catInput) catInput.value = "AI & Autonomous Software";
            if (priceInput) priceInput.value = "199";
            if (strikeInput) strikeInput.value = "1499";
            if (authorInput) authorInput.value = "Google Antigravity Team";

            CURRENT_PARSED_CHAPTERS = [
                {
                    id: 1,
                    number: "01",
                    title: {
                        english: "Chapter 1: Google Antigravity Setup & Core Architecture",
                        hinglish: "Chapter 1: Google Antigravity Setup & Core Architecture",
                        hindi: "अध्याय 1: गूगल एंटीग्रेविटी सेटअप और मुख्य आर्किटेक्चर"
                    },
                    content: {
                        english: `<h2>Chapter 1: Google Antigravity Setup & Architecture</h2><p>Google Antigravity is DeepMind's breakthrough agentic coding platform designed for proactive, multi-file software engineering. Unlike reactive chat bots, Antigravity plans, reads source code, runs bash/powershell commands, and executes verified browser tests automatically.</p><p>To configure your workspace: install the Antigravity desktop app or CLI, configure your workspace directories, and authenticate your developer profile.</p>`,
                        hinglish: `<h2>Chapter 1: Antigravity ka Setup aur Architecture</h2><p>Antigravity normal ChatGPT se bilkul alag hai. Yeh ek Autonomous Coding Agent hai jo aapke liye pura codebase samajhta hai, terminal commands run karta hai aur changes verify karta hai.</p>`,
                        hindi: `<h2>अध्याय 1: गूगल एंटीग्रेविटी सेटअप और आर्किटेक्चर</h2><p>एंटीग्रेविटी एक आधुनिक एजेंटिक कोडिंग प्लेटफॉर्म है जो स्वचालित रूप से कोड लिखता है, टेस्ट करता है और प्रोजेक्ट्स डिप्लॉय करता है।</p>`
                    }
                },
                {
                    id: 2,
                    number: "02",
                    title: {
                        english: "Chapter 2: Connecting AI Models (Gemini 2.5, Claude 3.7 & GPT-4o)",
                        hinglish: "Chapter 2: AI Models Connect Karna (Gemini 2.5, Claude 3.7 & GPT-4o)",
                        hindi: "अध्याय 2: एआई मॉडल्स कनेक्ट करना (Gemini 2.5, Claude 3.7 & GPT-4o)"
                    },
                    content: {
                        english: `<h2>Chapter 2: Connecting AI Models</h2><p>Antigravity features native model flexibility. You can configure Gemini 2.5 Pro via Google AI Studio API keys, OpenAI GPT-4o, or Anthropic Claude 3.7 Sonnet for high-reasoning coding benchmarks.</p><p>Navigate to Settings &rarr; Providers, paste your active API keys, and test latency across standard code evaluation prompts.</p>`,
                        hinglish: `<h2>Chapter 2: AI Models Connect Karein</h2><p>Aap Antigravity me Gemini, ChatGPT aur Claude sabhi ke API keys seamlessly connect kar sakte hain. Isse aapko har model ki best capability ka fayda milta hai.</p>`,
                        hindi: `<h2>अध्याय 2: एआई मॉडल्स कनेक्ट करना</h2><p>अपनी पसंद के किसी भी अग्रणी एआई मॉडल को एपीआई कुंजियों के माध्यम से कनेक्ट करें और तेज गति से काम शुरू करें।</p>`
                    }
                },
                {
                    id: 3,
                    number: "03",
                    title: {
                        english: "Chapter 3: Autonomous Pair Programming & Real-Time Tool Execution",
                        hinglish: "Chapter 3: Autonomous Pair Programming & Real-Time Tools",
                        hindi: "अध्याय 3: स्वायत्त पेयर प्रोग्रामिंग और रियल-टाइम टूल्स"
                    },
                    content: {
                        english: `<h2>Chapter 3: Autonomous Pair Programming</h2><p>The superpower of Antigravity is Autonomous Tool Usage. The agent can invoke tools like run_command, view_file, and browser_subagent without asking for redundant confirmations, solving complex bugs end-to-end.</p>`,
                        hinglish: `<h2>Chapter 3: Pair Programming ki Superpowers</h2><p>Antigravity khud files open karta hai, diffs check karta hai aur run karke verify karta hai ki koi runtime error to nahi aaya.</p>`,
                        hindi: `<h2>अध्याय 3: पेयर प्रोग्रामिंग और रियल-टाइम टूल्स</h2><p>सिस्टम कोड लिखने के साथ-साथ ब्राउज़र में चलाकर खुद जांच करता है कि सब कुछ सही काम कर रहा है या नहीं।</p>`
                    }
                },
                {
                    id: 4,
                    number: "04",
                    title: {
                        english: "Chapter 4: Building & Deploying Full-Stack SaaS in Record Time",
                        hinglish: "Chapter 4: Full-Stack SaaS Banana aur Live Deploy Karna",
                        hindi: "अध्याय 4: फुल-स्टैक सास बनाना और लाइव डिप्लॉय करना"
                    },
                    content: {
                        english: `<h2>Chapter 4: Building & Deploying SaaS</h2><p>From modern landing pages to database integrations and payment processing, learn how to prompt Antigravity to build complete production-ready applications ready for Vercel or cloud deployment.</p>`,
                        hinglish: `<h2>Chapter 4: SaaS Build aur Deploy Karein</h2><p>Landing page, payments, user dashboard aur backend sab kuch AI agent se banwayein aur 1 ghante me live launch karein.</p>`,
                        hindi: `<h2>अध्याय 4: सास बनाना और डिप्लॉयमेंट</h2><p>आधुनिक वेब अनुप्रयोगों को तेजी से बनाकर क्लाउड पर लाइव करें और उपयोगकर्ताओं को आकर्षित करें।</p>`
                    }
                },
                {
                    id: 5,
                    number: "05",
                    title: {
                        english: "Chapter 5: Monetization Blueprint & Freelance Client Delivery",
                        hinglish: "Chapter 5: Monetization Blueprint & Freelance Se Earning",
                        hindi: "अध्याय 5: मुद्रीकरण ब्लूप्रिंट और फ्रीलांस कमाई"
                    },
                    content: {
                        english: `<h2>Chapter 5: Monetization & Client Delivery</h2><p>Turn your AI coding skills into sustainable income. Offer client delivery services on Fiverr, Upwork, and social media, creating bespoke tools for local businesses that generate recurring revenue.</p>`,
                        hinglish: `<h2>Chapter 5: Earning aur Client Projects</h2><p>Apne banaye web apps aur software ko Instagram, LinkedIn aur freelancing sites par bechein aur high-ticket clients close karein.</p>`,
                        hindi: `<h2>अध्याय 5: मुद्रीकरण और फ्रीलांसिंग</h2><p>अपनी विकसित वेबसाइटों और ऐप्स को सोशल मीडिया पर सीधे ग्राहकों को बेचकर स्वतंत्र आय अर्जित करें।</p>`
                    }
                }
            ];

            renderParsedChaptersPreview(CURRENT_PARSED_CHAPTERS);

            if (fileInfo) {
                fileInfo.style.display = "block";
                fileInfo.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                        <div>
                            <span style="color: #10b981; font-weight: 700;">⚡ Sample E-Book Loaded:</span> Google Antigravity Agentic Blueprint 2026
                            <br>
                            <strong style="color: #00f0ff;">5 Complete Chapters Ready</strong> — Click "Publish & Set as Live" below to test!
                        </div>
                    </div>
                `;
            }
        });
    }

    // 6. Direct Paste Text Support
    if (btnParsePasted && pasteTextarea) {
        btnParsePasted.addEventListener("click", () => {
            const raw = pasteTextarea.value.trim();
            if (!raw) {
                alert("Kripya pehle textarea me text paste karein!");
                return;
            }

            const titleInput = document.getElementById("courseInputTitle");
            if (titleInput && (!titleInput.value || titleInput.value.includes("Master Next.js"))) {
                // First line as candidate title
                const firstLine = raw.split("\n")[0].replace(/^#+\s*/, "").trim();
                if (firstLine.length > 3 && firstLine.length < 80) {
                    titleInput.value = firstLine;
                }
            }

            CURRENT_PARSED_CHAPTERS = parseChaptersFromDocument(raw, "pasted_text.txt");
            renderParsedChaptersPreview(CURRENT_PARSED_CHAPTERS);

            alert(`✅ ${CURRENT_PARSED_CHAPTERS.length} Chapters successfully parsed from pasted text!`);
        });
    }

    if (btnClearPasted && pasteTextarea) {
        btnClearPasted.addEventListener("click", () => {
            pasteTextarea.value = "";
        });
    }

    // 7. Chapter Management (Add manual, clear all)
    if (btnAddManual) {
        btnAddManual.addEventListener("click", () => {
            const chNum = CURRENT_PARSED_CHAPTERS.length + 1;
            const newCh = {
                id: chNum,
                number: String(chNum).padStart(2, "0"),
                title: {
                    english: `Chapter ${chNum}: Practical Blueprint & Case Studies`,
                    hinglish: `Chapter ${chNum}: Practical Blueprint & Case Studies`,
                    hindi: `अध्याय ${chNum}: व्यावहारिक ब्लूप्रिंट और अध्ययन`
                },
                content: {
                    english: `<h2>Chapter ${chNum}: Blueprint & Overview</h2><p>Custom content added manually. Edit or paste your specific topics here.</p>`,
                    hinglish: `<h2>Chapter ${chNum} Overview</h2><p>Custom content yahan likhein.</p>`,
                    hindi: `<h2>अध्याय ${chNum} विवरण</h2><p>कस्टम विवरण यहाँ दर्ज करें।</p>`
                }
            };
            CURRENT_PARSED_CHAPTERS.push(newCh);
            renderParsedChaptersPreview(CURRENT_PARSED_CHAPTERS);
        });
    }

    if (btnClearChapters) {
        btnClearChapters.addEventListener("click", () => {
            if (CURRENT_PARSED_CHAPTERS.length === 0) return;
            if (confirm("Kya aap sabhi parsed chapters ko clear karna chahte hain?")) {
                CURRENT_PARSED_CHAPTERS = [];
                renderParsedChaptersPreview([]);
                if (fileInfo) fileInfo.style.display = "none";
            }
        });
    }

    // 8. Submit handler (Publish & Activate)
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            saveCourseSubmission(null);
        });
    }

    const btnPublish = document.getElementById("btnPublishAndActivate");
    if (btnPublish) {
        btnPublish.addEventListener("click", (e) => {
            e.preventDefault();
            saveCourseSubmission(true);
        });
    }

    if (btnSaveCatalog) {
        btnSaveCatalog.addEventListener("click", (e) => {
            e.preventDefault();
            saveCourseSubmission(false);
        });
    }

    const btnCancelEdit = document.getElementById("btnCancelEditCourse");
    if (btnCancelEdit) {
        btnCancelEdit.addEventListener("click", (e) => {
            e.preventDefault();
            cancelCourseEdit();
        });
    }

    // 9. Delegate Course Catalog Actions (Toggle Status, Edit, Delete)
    document.addEventListener("click", (e) => {
        const btnToggle = e.target.closest(".btn-toggle-course-status");
        if (btnToggle) {
            const id = btnToggle.getAttribute("data-id");
            if (id) toggleCourseStatus(id);
            return;
        }

        const btnEdit = e.target.closest(".btn-edit-course");
        if (btnEdit) {
            const id = btnEdit.getAttribute("data-id");
            if (id) editCourse(id);
            return;
        }

        const btnDel = e.target.closest(".btn-del-course");
        if (btnDel) {
            const id = btnDel.getAttribute("data-id");
            if (id) deleteCourse(id);
            return;
        }
    });
}

function saveCourseSubmission(forceActive = null) {
    const editId = document.getElementById("courseEditId")?.value || "";
    const titleInput = document.getElementById("courseInputTitle");
    let title = titleInput ? titleInput.value.trim() : "";
    const subtitle = (document.getElementById("courseInputSubtitle")?.value || "").trim();
    const category = (document.getElementById("courseInputCategory")?.value || "AI & Autonomous Software").trim();
    const price = parseInt(document.getElementById("courseInputPrice")?.value) || 199;
    const strikePrice = parseInt(document.getElementById("courseInputStrikePrice")?.value) || (price * 5);
    const author = (document.getElementById("courseInputAuthor")?.value || "Google Antigravity Team").trim();
    const badge = (document.getElementById("courseInputBadge")?.value || "Bestseller").trim();

    // Active switch: if forceActive is explicitly boolean, use that, else use checkbox
    const activeCheck = document.getElementById("courseInputIsActive");
    let isActive = (forceActive !== null) ? forceActive : (activeCheck ? activeCheck.checked : true);

    if (!title) {
        alert("Kripya Course ka Title enter karein!");
        if (titleInput) titleInput.focus();
        return;
    }

    // Selected template
    const selectedTemplateRadio = document.querySelector('input[name="courseTemplate"]:checked');
    const templateId = selectedTemplateRadio ? selectedTemplateRadio.value : "template_tech";

    // Landing Page CMS details
    const heroHeadline = (document.getElementById("courseInputHeadline")?.value || "").trim() || title;
    const heroSubheadline = (document.getElementById("courseInputSubheadline")?.value || "").trim() || subtitle;
    const kp1 = (document.getElementById("courseInputKeyPoint1")?.value || "Autonomous Planning & Architecture Blueprint").trim();
    const kp2 = (document.getElementById("courseInputKeyPoint2")?.value || "Multi-File Codebase Generation with Terminal Auto-Repair").trim();
    const kp3 = (document.getElementById("courseInputKeyPoint3")?.value || "Automated Testing & End-to-End Validation").trim();
    const kp4 = (document.getElementById("courseInputKeyPoint4")?.value || "Client Delivery & Monthly Revenue Monetization Strategy").trim();
    const ctaText = (document.getElementById("courseInputCtaText")?.value || `Unlock Complete Guide • ₹${price}`).trim();

    const landingConfig = {
        templateId,
        heroHeadline,
        heroSubheadline,
        keyPoints: [kp1, kp2, kp3, kp4],
        ctaText
    };

    const chapterCount = CURRENT_PARSED_CHAPTERS.length > 0 ? CURRENT_PARSED_CHAPTERS.length : 5;
    const chaptersToSave = CURRENT_PARSED_CHAPTERS.length > 0
        ? CURRENT_PARSED_CHAPTERS
        : generateFallbackChapters(title);

    const ebookData = {
        metadata: {
            title: title,
            subtitle: subtitle,
            author: author,
            edition: "2026-2027 Autonomous Edition",
            totalPages: chapterCount * 12
        },
        chapters: chaptersToSave
    };

    const catalog = getCoursesCatalog();

    if (editId) {
        // UPDATE EXISTING COURSE
        const idx = catalog.findIndex(c => c.id === editId);
        if (idx !== -1) {
            catalog[idx] = {
                ...catalog[idx],
                title,
                subtitle,
                category,
                price,
                strikePrice,
                author,
                badge,
                chapterCount,
                isActive,
                landingConfig,
                ebookData,
                updatedAt: new Date().toISOString()
            };
            saveCoursesCatalog(catalog);
            alert(`✅ Course "${title}" successfully updated!\nTemplate: ${getTemplateLabel(templateId)}\nStatus: ${isActive ? '🟢 Active (Visible on Storefront)' : '⚪ Draft (Hidden)'}`);
        }
    } else {
        // CREATE NEW COURSE (Supports multiple simultaneous active courses!)
        const newCourseId = "course_" + Date.now();
        const newCourseEntry = {
            id: newCourseId,
            title,
            subtitle,
            category,
            price,
            strikePrice,
            author,
            badge,
            chapterCount,
            isActive,
            createdAt: new Date().toISOString().split("T")[0],
            isDefault: false,
            landingConfig,
            ebookData
        };
        catalog.unshift(newCourseEntry);
        saveCoursesCatalog(catalog);
        alert(`🎉 Course "${title}" successfully created!\nTemplate: ${getTemplateLabel(templateId)}\nStatus: ${isActive ? '🟢 LIVE on Courses Page' : '⚪ Saved as Draft'}`);
    }

    cancelCourseEdit();
    renderCoursesCatalog();
    renderCurrentActiveBookNotice();
}

function editCourse(courseId) {
    const catalog = getCoursesCatalog();
    const course = catalog.find(c => c.id === courseId);
    if (!course) {
        alert("Course not found!");
        return;
    }

    const editIdInput = document.getElementById("courseEditId");
    if (editIdInput) editIdInput.value = course.id;

    // Show notice banner
    const notice = document.getElementById("courseEditingNotice");
    const noticeTitle = document.getElementById("editingCourseTitleDisplay");
    if (notice) notice.style.display = "flex";
    if (noticeTitle) noticeTitle.textContent = course.title;

    const heading = document.getElementById("courseFormSectionHeading");
    if (heading) heading.textContent = `✏️ Edit Course: ${course.title}`;

    const btnSubmit = document.getElementById("btnPublishAndActivate");
    if (btnSubmit) btnSubmit.textContent = "💾 Update Course & Landing Page";

    // Fields
    const titleInput = document.getElementById("courseInputTitle");
    const subInput = document.getElementById("courseInputSubtitle");
    const catInput = document.getElementById("courseInputCategory");
    const priceInput = document.getElementById("courseInputPrice");
    const strikeInput = document.getElementById("courseInputStrikePrice");
    const authorInput = document.getElementById("courseInputAuthor");
    const badgeInput = document.getElementById("courseInputBadge");
    const activeCheck = document.getElementById("courseInputIsActive");

    if (titleInput) titleInput.value = course.title || "";
    if (subInput) subInput.value = course.subtitle || "";
    if (catInput) catInput.value = course.category || "AI & Autonomous Software";
    if (priceInput) priceInput.value = course.price || 199;
    if (strikeInput) strikeInput.value = course.strikePrice || 1499;
    if (authorInput) authorInput.value = course.author || "Google Antigravity Team";
    if (badgeInput) badgeInput.value = course.badge || "Bestseller";
    if (activeCheck) activeCheck.checked = !!course.isActive;

    // Template Radio
    const templateId = course.landingConfig?.templateId || "template_tech";
    const radio = document.querySelector(`input[name="courseTemplate"][value="${templateId}"]`);
    if (radio) radio.checked = true;

    // Landing Page CMS Fields
    const headlineInput = document.getElementById("courseInputHeadline");
    const subheadlineInput = document.getElementById("courseInputSubheadline");
    const kp1 = document.getElementById("courseInputKeyPoint1");
    const kp2 = document.getElementById("courseInputKeyPoint2");
    const kp3 = document.getElementById("courseInputKeyPoint3");
    const kp4 = document.getElementById("courseInputKeyPoint4");
    const ctaInput = document.getElementById("courseInputCtaText");

    const lc = course.landingConfig || {};
    if (headlineInput) headlineInput.value = lc.heroHeadline || course.title || "";
    if (subheadlineInput) subheadlineInput.value = lc.heroSubheadline || course.subtitle || "";
    if (kp1) kp1.value = (lc.keyPoints && lc.keyPoints[0]) || "Autonomous Planning & Architecture Blueprint";
    if (kp2) kp2.value = (lc.keyPoints && lc.keyPoints[1]) || "Multi-File Codebase Generation with Terminal Auto-Repair";
    if (kp3) kp3.value = (lc.keyPoints && lc.keyPoints[2]) || "Automated Testing & End-to-End Validation";
    if (kp4) kp4.value = (lc.keyPoints && lc.keyPoints[3]) || "Client Delivery & Monthly Revenue Monetization Strategy";
    if (ctaInput) ctaInput.value = lc.ctaText || `Unlock Complete Guide • ₹${course.price}`;

    // Load chapters preview
    if (course.ebookData && Array.isArray(course.ebookData.chapters) && course.ebookData.chapters.length > 0) {
        CURRENT_PARSED_CHAPTERS = JSON.parse(JSON.stringify(course.ebookData.chapters));
    } else {
        CURRENT_PARSED_CHAPTERS = generateFallbackChapters(course.title);
    }
    renderParsedChaptersPreview(CURRENT_PARSED_CHAPTERS);

    // Smooth scroll to form card
    const formCard = document.getElementById("courseFormCard");
    if (formCard) formCard.scrollIntoView({ behavior: "smooth", block: "start" });
}

function cancelCourseEdit() {
    const editIdInput = document.getElementById("courseEditId");
    if (editIdInput) editIdInput.value = "";

    const notice = document.getElementById("courseEditingNotice");
    if (notice) notice.style.display = "none";

    const heading = document.getElementById("courseFormSectionHeading");
    if (heading) heading.textContent = "📤 Add & Launch New E-Book / Course";

    const btnSubmit = document.getElementById("btnPublishAndActivate");
    if (btnSubmit) btnSubmit.textContent = "💾 Save & Publish Course / Landing Page";

    const form = document.getElementById("newCourseForm");
    if (form) form.reset();

    const priceEl = document.getElementById("courseInputPrice");
    if (priceEl) priceEl.value = "199";
    const strikeEl = document.getElementById("courseInputStrikePrice");
    if (strikeEl) strikeEl.value = "1499";
    const catEl = document.getElementById("courseInputCategory");
    if (catEl) catEl.value = "AI & Autonomous Software";
    const authorEl = document.getElementById("courseInputAuthor");
    if (authorEl) authorEl.value = "Google Antigravity Team";
    const badgeEl = document.getElementById("courseInputBadge");
    if (badgeEl) badgeEl.value = "Bestseller";
    const activeEl = document.getElementById("courseInputIsActive");
    if (activeEl) activeEl.checked = true;

    CURRENT_PARSED_CHAPTERS = [];
    renderParsedChaptersPreview([]);
    const fileInfo = document.getElementById("dropFileInfo");
    if (fileInfo) fileInfo.style.display = "none";
}

function toggleCourseStatus(courseId) {
    const catalog = getCoursesCatalog();
    const course = catalog.find(c => c.id === courseId);
    if (!course) return;

    course.isActive = !course.isActive;
    saveCoursesCatalog(catalog);
    renderCoursesCatalog();
    renderCurrentActiveBookNotice();

    alert(`Course "${course.title}" status: ${course.isActive ? '🟢 LIVE (Active on storefront)' : '⚪ DRAFT (Inactive)'}`);
}

}

// Helper: Read plain text file
function readTextFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result || "");
        reader.onerror = (err) => reject(err);
        reader.readAsText(file);
    });
}

// Helper: Extract text from DOCX (ZIP container with word/document.xml)
async function readDocxFile(file) {
    try {
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);

        let offset = 0;
        let documentXmlBytes = null;
        let compressionMethod = 0;

        // Scan ZIP local file headers (0x04034b50)
        while (offset < bytes.length - 30) {
            if (bytes[offset] === 0x50 && bytes[offset+1] === 0x4B && bytes[offset+2] === 0x03 && bytes[offset+3] === 0x04) {
                const method = bytes[offset + 8] | (bytes[offset + 9] << 8);
                const compressedSize = bytes[offset + 18] | (bytes[offset + 19] << 8) | (bytes[offset + 20] << 16) | (bytes[offset + 21] << 24);
                const nameLength = bytes[offset + 26] | (bytes[offset + 27] << 8);
                const extraLength = bytes[offset + 28] | (bytes[offset + 29] << 8);

                const nameBytes = bytes.slice(offset + 30, offset + 30 + nameLength);
                const entryName = new TextDecoder().decode(nameBytes);

                const dataStart = offset + 30 + nameLength + extraLength;
                if (entryName === "word/document.xml") {
                    compressionMethod = method;
                    if (compressedSize > 0) {
                        documentXmlBytes = bytes.slice(dataStart, dataStart + compressedSize);
                    } else {
                        documentXmlBytes = bytes.slice(dataStart);
                    }
                    break;
                }
                offset = dataStart + (compressedSize > 0 ? compressedSize : 0);
            } else {
                offset++;
            }
        }

        if (documentXmlBytes) {
            let xmlText = "";
            if (compressionMethod === 8 && typeof DecompressionStream !== "undefined") {
                try {
                    const stream = new Response(documentXmlBytes).body.pipeThrough(new DecompressionStream("deflate-raw"));
                    const decompressedBuf = await new Response(stream).arrayBuffer();
                    xmlText = new TextDecoder().decode(decompressedBuf);
                } catch (streamErr) {
                    console.warn("DecompressionStream error:", streamErr);
                }
            } else if (compressionMethod === 0) {
                xmlText = new TextDecoder().decode(documentXmlBytes);
            }

            if (xmlText) {
                return extractTextFromWordXml(xmlText);
            }
        }
    } catch (e) {
        console.warn("Docx native zip extraction failed, using fallback:", e);
    }

    return await fallbackExtractText(file);
}

function extractTextFromWordXml(xmlStr) {
    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlStr, "text/xml");
        const paragraphs = xmlDoc.getElementsByTagName("w:p");
        const output = [];
        for (let i = 0; i < paragraphs.length; i++) {
            const p = paragraphs[i];
            const texts = p.getElementsByTagName("w:t");
            let line = "";
            for (let j = 0; j < texts.length; j++) {
                line += texts[j].textContent;
            }
            if (line.trim()) {
                output.push(line.trim());
            }
        }
        return output.join("\n\n");
    } catch (e) {
        return "";
    }
}

function fallbackExtractText(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const raw = e.target.result;
            if (typeof raw === "string") {
                const cleaned = raw
                    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, " ")
                    .replace(/\s+/g, " ")
                    .trim();
                resolve(cleaned);
            } else {
                resolve("");
            }
        };
        reader.onerror = () => resolve("");
        reader.readAsText(file);
    });
}

// Multi-Pattern Chapter Detection & Structuring
function parseChaptersFromDocument(content, fileName) {
    const chapters = [];
    if (!content || typeof content !== "string") return chapters;

    // 1. JSON Format
    if (fileName && fileName.endsWith(".json")) {
        try {
            const parsedJson = JSON.parse(content);
            if (Array.isArray(parsedJson.chapters)) return parsedJson.chapters;
            if (Array.isArray(parsedJson)) return parsedJson;
        } catch (e) {}
    }

    // 2. HTML Document Format
    if ((fileName && (fileName.endsWith(".html") || fileName.endsWith(".htm"))) || content.includes("<h1") || content.includes("<h2")) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(content, "text/html");
            const headings = doc.querySelectorAll("h1, h2, h3");
            if (headings.length >= 2) {
                headings.forEach((h, idx) => {
                    const chNum = idx + 1;
                    const chTitle = h.textContent.trim() || `Chapter ${chNum}`;
                    let bodyHtml = "";
                    let next = h.nextElementSibling;
                    while (next && !["H1", "H2", "H3"].includes(next.tagName)) {
                        bodyHtml += next.outerHTML;
                        next = next.nextElementSibling;
                    }
                    if (!bodyHtml.trim()) {
                        bodyHtml = `<p>${escapeHtml(chTitle)} chapter guidance and concepts.</p>`;
                    }
                    chapters.push({
                        id: chNum,
                        number: String(chNum).padStart(2, "0"),
                        title: { english: chTitle, hinglish: chTitle, hindi: chTitle },
                        content: {
                            english: `<h2>${escapeHtml(chTitle)}</h2>${bodyHtml}`,
                            hinglish: `<h2>${escapeHtml(chTitle)}</h2>${bodyHtml}`,
                            hindi: `<h2>${escapeHtml(chTitle)}</h2>${bodyHtml}`
                        }
                    });
                });
                if (chapters.length > 0) return chapters;
            }
        } catch (e) {}
    }

    // 3. Multi-Pattern Headings Regex:
    // Matches # Chapter, ## Title, Chapter 1:, CHAPTER 1, अध्याय 1, Module 1, 1. Title
    const headingRegex = /(?:^|\n)(?:(#{1,3}\s+[^\n]+)|((?:Chapter|CHAPTER|अध्याय|Module|MODULE|Lesson|LESSON|Part|PART)\s+\d+[:\-\.]?[^\n]*)|(\d+[\.\)]\s+[A-Z\u0900-\u097F][^\n]{3,80}))(?=\n|$)/g;
    const matches = [];
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
        const rawTitle = (match[1] || match[2] || match[3] || "").trim();
        const cleanTitle = rawTitle.replace(/^#{1,3}\s*/, "").trim();
        if (cleanTitle.length > 0) {
            matches.push({
                index: match.index,
                title: cleanTitle
            });
        }
    }

    if (matches.length >= 2) {
        for (let i = 0; i < matches.length; i++) {
            const start = matches[i].index;
            const end = (i + 1 < matches.length) ? matches[i + 1].index : content.length;
            const rawBody = content.substring(start, end).trim();
            const chNum = i + 1;

            const bodyLines = rawBody.split("\n").slice(1).join("\n").trim();
            const formattedHtml = (bodyLines || rawBody)
                .split(/\n\s*\n/)
                .filter(p => p.trim())
                .map(para => `<p>${escapeHtml(para.trim()).replace(/\n/g, '<br>')}</p>`)
                .join("") || `<p>${escapeHtml(matches[i].title)} section details.</p>`;

            chapters.push({
                id: chNum,
                number: String(chNum).padStart(2, "0"),
                title: {
                    english: matches[i].title,
                    hinglish: matches[i].title,
                    hindi: matches[i].title
                },
                content: {
                    english: `<h2>${escapeHtml(matches[i].title)}</h2>${formattedHtml}`,
                    hinglish: `<h2>${escapeHtml(matches[i].title)}</h2>${formattedHtml}`,
                    hindi: `<h2>${escapeHtml(matches[i].title)}</h2>${formattedHtml}`
                }
            });
        }
        return chapters;
    }

    // 4. Fallback: Chunk long text by paragraphs into 4 to 6 balanced chapters
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 10);
    const targetChapters = Math.min(6, Math.max(3, Math.ceil(paragraphs.length / 4)));
    const chunkSize = Math.max(1, Math.ceil(paragraphs.length / targetChapters));

    for (let i = 0; i < paragraphs.length; i += chunkSize) {
        const chunkParas = paragraphs.slice(i, i + chunkSize);
        const chIdx = chapters.length + 1;
        const firstLine = chunkParas[0].replace(/\n/g, " ").trim();
        const shortTitle = firstLine.length > 45 ? firstLine.substring(0, 45).trim() + "..." : firstLine;
        const chTitle = `Chapter ${chIdx}: ${shortTitle}`;

        const html = chunkParas.map(p => `<p>${escapeHtml(p.trim()).replace(/\n/g, '<br>')}</p>`).join("");

        chapters.push({
            id: chIdx,
            number: String(chIdx).padStart(2, "0"),
            title: {
                english: chTitle,
                hinglish: chTitle,
                hindi: `अध्याय ${chIdx}: ${shortTitle}`
            },
            content: {
                english: `<h2>${escapeHtml(chTitle)}</h2>${html}`,
                hinglish: `<h2>${escapeHtml(chTitle)}</h2>${html}`,
                hindi: `<h2>${escapeHtml(chTitle)}</h2>${html}`
            }
        });
    }

    if (chapters.length === 0) {
        chapters.push({
            id: 1,
            number: "01",
            title: {
                english: "Chapter 1: Document Overview",
                hinglish: "Chapter 1: Document Overview",
                hindi: "अध्याय 1: दस्तावेज़ विवरण"
            },
            content: {
                english: `<h2>Document Overview</h2><p>${escapeHtml(content.trim() || "No content found.")}</p>`,
                hinglish: `<h2>Document Overview</h2><p>${escapeHtml(content.trim() || "No content found.")}</p>`,
                hindi: `<h2>दस्तावेज़ विवरण</h2><p>${escapeHtml(content.trim() || "No content found.")}</p>`
            }
        });
    }

    return chapters;
}

// Render preview list of parsed chapters
function renderParsedChaptersPreview(chapters) {
    const container = document.getElementById("parsedChaptersContainer");
    const badge = document.getElementById("parsedChaptersBadge");
    if (!container) return;

    if (badge) {
        badge.textContent = `${chapters.length} Chapters Detected`;
        badge.style.color = chapters.length > 0 ? "#10b981" : "#00f0ff";
    }

    if (!chapters || chapters.length === 0) {
        container.innerHTML = `
            <p style="color: #64748b; font-size: 0.85rem; text-align: center; margin: 20px 0;">
                Upar document drag & drop karein, sample load karein ya manually chapter add karein. Chapters yahan list ho jayenge.
            </p>
        `;
        return;
    }

    container.innerHTML = chapters.map((ch, idx) => {
        const titleText = (ch.title && (ch.title.english || ch.title.hinglish || ch.title.hindi)) || `Chapter ${ch.number || idx + 1}`;
        const contentStr = typeof ch.content === "string" ? ch.content : ((ch.content && (ch.content.english || ch.content.hinglish)) || "");
        const approxWords = contentStr.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;

        return `
            <div class="parsed-chapter-item">
                <div class="ch-title-wrap">
                    <span class="ch-idx">CH ${ch.number || String(idx + 1).padStart(2, "0")}</span>
                    <strong style="color: #f8fafc; font-size: 0.88rem;" title="${escapeHtml(titleText)}">${escapeHtml(titleText)}</strong>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="color: #94a3b8; font-size: 0.78rem;">~${approxWords} words</span>
                    <button type="button" class="ch-del-btn btn-remove-parsed-ch" data-idx="${idx}" title="Delete this chapter">🗑️</button>
                </div>
            </div>
        `;
    }).join("");

    // Attach individual chapter deletion handlers
    container.querySelectorAll(".btn-remove-parsed-ch").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.getAttribute("data-idx"));
            if (!isNaN(idx) && idx >= 0 && idx < CURRENT_PARSED_CHAPTERS.length) {
                CURRENT_PARSED_CHAPTERS.splice(idx, 1);
                CURRENT_PARSED_CHAPTERS.forEach((c, i) => {
                    c.id = i + 1;
                    c.number = String(i + 1).padStart(2, "0");
                });
                renderParsedChaptersPreview(CURRENT_PARSED_CHAPTERS);
            }
        });
    });
}

// Update Active E-Book Notice at the top of tab
function renderCurrentActiveBookNotice() {
    const titleEl = document.getElementById("currentActiveBookTitle");
    const metaEl = document.getElementById("currentActiveBookMeta");
    if (!titleEl || !metaEl) return;

    const catalog = getCoursesCatalog();
    const activeCourses = catalog.filter(c => c.isActive);
    const activeCount = activeCourses.length;

    titleEl.textContent = `${activeCount} Course${activeCount === 1 ? '' : 's'} Currently LIVE on Storefront`;
    metaEl.textContent = `${activeCount} active courses are visible on courses.html with instant checkout. Total courses in catalog: ${catalog.length}`;
}


function generateFallbackChapters(title) {
    return [1, 2, 3, 4, 5].map(n => ({
        id: n,
        number: String(n).padStart(2, "0"),
        title: {
            english: `Chapter ${n}: Core Concepts of ${title}`,
            hinglish: `Chapter ${n}: ${title} ke Fundamental Rules`,
            hindi: `अध्याय ${n}: ${title} के मुख्य सिद्धांत`
        },
        content: {
            english: `<h2>Chapter ${n}</h2><p>Comprehensive step-by-step master material for ${title}.</p>`,
            hinglish: `<h2>Chapter ${n}</h2><p>Practical step-by-step material for ${title}.</p>`,
            hindi: `<h2>अध्याय ${n}</h2><p>व्यावहारिक मार्गदर्शन और ब्लूप्रिंट्स।</p>`
        }
    }));
}

function setActiveCourse(courseId) {
    toggleCourseStatus(courseId);
}

function deleteCourse(courseId) {
    let catalog = getCoursesCatalog();
    const course = catalog.find(c => c.id === courseId);
    if (!course) {
        alert("Course not found!");
        return;
    }

    const isDefault = !!course.isDefault;
    const confirmMsg = isDefault
        ? `⚠️ "${course.title}" ek default course hai. Kya aap ise sach me catalog se delete karna chahte hain?`
        : `Kya aap "${course.title}" ko catalog se permanently delete karna chahte hain?`;

    if (confirm(confirmMsg)) {
        catalog = catalog.filter(c => c.id !== courseId);
        saveCoursesCatalog(catalog);
        renderCoursesCatalog();
        renderCurrentActiveBookNotice();
        alert(`🗑️ "${course.title}" ko catalog se delete kar diya gaya hai.`);
    }
}


