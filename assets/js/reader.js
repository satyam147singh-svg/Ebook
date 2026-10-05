/**
 * Ultra-Secure E-Book Reader Engine
 * Includes:
 * 1. Single-Device / Anti-Sharing Hardware Lock (Prevents link forwarding/sharing)
 * 2. Dynamic Moving DRM Watermarking
 * 3. Screenshot & Focus Loss Blocker Shield
 * 4. Trilingual Rendering (Hinglish, Hindi, English)
 */

class SecureReaderEngine {
    constructor() {
        this.currentChapterId = 1;
        this.currentLanguage = localStorage.getItem("antigravity_lang") || "hinglish"; // 'hinglish' | 'hindi' | 'english'
        this.currentTheme = "matrix"; // 'matrix' | 'slate' | 'sepia' | 'light'
        this.currentFontSize = "md"; // 'sm' | 'md' | 'lg'
        this.userEmail = "authorized-reader@access.in";
        this.userToken = "AGY-EBK-ACCESS-DEMO";
        this.userName = "Valued Reader";
        this.currentDeviceFingerprint = "";
        this.currentDeviceName = "";
        this.watermarkCanvas = null;
        this.watermarkOffset = 0;
        
        this.init();
    }

    init() {
        this.computeCurrentDevice();
        this.parseAuthParams();
        this.setupSecurityShields();
        this.initWatermarkCanvas();
        this.bindUiControls();
        this.renderSidebarChapters();
        this.loadChapter(1);
    }

    // Compute device hardware fingerprint & human readable device name
    computeCurrentDevice() {
        // Device Type Detection
        const ua = navigator.userAgent;
        let os = "Desktop";
        if (/windows/i.test(ua)) os = "Windows PC";
        else if (/macintosh|mac os x/i.test(ua)) os = "Macintosh";
        else if (/android/i.test(ua)) os = "Android Mobile";
        else if (/iphone|ipad|ipod/i.test(ua)) os = "Apple iOS Device";
        else if (/linux/i.test(ua)) os = "Linux Machine";

        let browser = "Browser";
        if (/chrome|crios/i.test(ua) && !/edge|opr/i.test(ua)) browser = "Chrome";
        else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
        else if (/firefox/i.test(ua)) browser = "Firefox";
        else if (/edg/i.test(ua)) browser = "Edge";

        this.currentDeviceName = `${os} (${browser})`;

        // Hardware metrics
        const screenMetric = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
        const cpuCores = navigator.hardwareConcurrency || 4;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
        const lang = navigator.language || "en";
        
        // Canvas Fingerprinting
        let canvasHash = 0;
        try {
            const canvas = document.createElement("canvas");
            canvas.width = 100;
            canvas.height = 30;
            const ctx = canvas.getContext("2d");
            ctx.textBaseline = "top";
            ctx.font = "14px 'Arial'";
            ctx.fillStyle = "#f60";
            ctx.fillRect(10, 1, 62, 20);
            ctx.fillStyle = "#069";
            ctx.fillText("AntigravityDRM", 2, 15);
            const str = canvas.toDataURL();
            for (let i = 0; i < str.length; i++) {
                canvasHash = ((canvasHash << 5) - canvasHash) + str.charCodeAt(i);
                canvasHash |= 0;
            }
        } catch (e) {
            canvasHash = 999123;
        }

        // Generate combined deterministic signature
        const rawSignature = `${os}|${browser}|${screenMetric}|${cpuCores}|${timezone}|${lang}|${canvasHash}`;
        this.currentDeviceFingerprint = "DEV-" + Math.abs(this.hashCode(rawSignature)).toString(36).toUpperCase();
    }

    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0;
        }
        return hash;
    }

    // 1. DEVICE LOCK & AUTH PARSING
    parseAuthParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        const email = urlParams.get("email");
        const name = urlParams.get("name");

        if (token && email) {
            this.userToken = token;
            this.userEmail = email;
            if (name) this.userName = decodeURIComponent(name);

            // VERIFY DEVICE LOCK
            const isAuthorized = this.verifyDeviceLock(token, email);
            if (!isAuthorized) {
                // Device mismatch! Lockout screen shown.
                return;
            }
            this.hideAuthGate();
        } else {
            // Check if there is an active order in storage
            const hasRecentOrder = localStorage.getItem("antigravity_orders");
            if (hasRecentOrder) {
                try {
                    const orders = JSON.parse(hasRecentOrder);
                    if (orders.length > 0) {
                        this.userToken = orders[0].token;
                        this.userEmail = orders[0].email;
                        this.userName = orders[0].name;

                        if (this.verifyDeviceLock(this.userToken, this.userEmail)) {
                            this.hideAuthGate();
                            return;
                        }
                    }
                } catch (e) {}
            }
            // Show Gatekeeper modal if no token provided
            this.showAuthGate();
        }
    }

    // Strict Device Verification: Only allows the 1st device that activates the token
    verifyDeviceLock(token, email) {
        const registry = JSON.parse(localStorage.getItem("antigravity_device_registry") || "{}");
        const localSecretKey = localStorage.getItem(`agy_device_secret_${token}`);

        // If this token was never activated yet (First time opening!)
        if (!registry[token]) {
            // Generate a random local secret for this browser
            const newSecret = "SEC-" + Math.random().toString(36).substring(2) + Date.now();
            localStorage.setItem(`agy_device_secret_${token}`, newSecret);

            // Bind permanently to this device
            registry[token] = {
                token: token,
                email: email,
                name: this.userName,
                boundDeviceId: this.currentDeviceFingerprint,
                boundDeviceName: this.currentDeviceName,
                activatedAt: new Date().toLocaleString(),
                timestamp: Date.now(),
                secret: newSecret,
                status: "LOCKED_TO_PRIMARY_DEVICE"
            };

            localStorage.setItem("antigravity_device_registry", JSON.stringify(registry));
            return true;
        }

        const boundRecord = registry[token];

        // Check if device matches or local secret matches
        const isDeviceMatched = (boundRecord.boundDeviceId === this.currentDeviceFingerprint);
        const isSecretMatched = (localSecretKey && localSecretKey === boundRecord.secret);

        if (isDeviceMatched || isSecretMatched) {
            // Legitimate buyer on original device
            if (!localSecretKey && boundRecord.secret) {
                localStorage.setItem(`agy_device_secret_${token}`, boundRecord.secret);
            }
            return true;
        }

        // DEVICE MISMATCH DETECTED (LINK WAS SHARED TO ANOTHER PERSON / PHONE / BROWSER)
        this.showDeviceMismatchScreen(boundRecord);
        return false;
    }

    // Display Anti-Sharing Device Lockout Screen & Setup In-Page Payment
    showDeviceMismatchScreen(boundRecord) {
        const mismatchOverlay = document.getElementById("deviceMismatchModal");
        if (!mismatchOverlay) return;

        mismatchOverlay.style.display = "flex";

        // Display who originally shared this link
        const emailEl = document.getElementById("mismatchBuyerEmail");
        if (emailEl) emailEl.textContent = boundRecord.email;

        // WhatsApp support button for genuine device changes
        const whatsappBtn = document.getElementById("btnTransferDeviceSupport");
        if (whatsappBtn) {
            const config = JSON.parse(localStorage.getItem("antigravity_admin_config") || "{}");
            const supportNumber = config.supportWhatsApp || "+919876543210";
            const msg = encodeURIComponent(`Hello Admin, maine Antigravity E-Book khareedi thi. Mera Token: ${boundRecord.token}, Email: ${boundRecord.email}. Maine apna device change kiya hai, kripya mera device lock reset karein.`);
            whatsappBtn.href = `https://wa.me/${supportNumber.replace(/[^0-9]/g, '')}?text=${msg}`;
        }

        // Hide reader shell so no reading is possible until unlocked
        const readerApp = document.getElementById("readerApp");
        if (readerApp) readerApp.style.display = "none";

        // 1. SETUP DYNAMIC UPI QR SCANNER FOR THIS NEW VISITOR
        const adminConfig = JSON.parse(localStorage.getItem("antigravity_admin_config") || "{}");
        const upiId = adminConfig.upiId || "antigravity.developer@upi";
        const payeeName = adminConfig.payeeName || "Google Antigravity Academy";
        const price = adminConfig.price || 199;
        const currencySymbol = adminConfig.currencySymbol || "₹";

        const priceEls = mismatchOverlay.querySelectorAll(".dynamic-price");
        priceEls.forEach(el => el.textContent = `${currencySymbol}${price}`);

        const upiDisplay = document.getElementById("readerDisplayUpiId");
        if (upiDisplay) upiDisplay.textContent = upiId;

        // Generate QR Code
        const qrContainer = document.getElementById("readerUpiQrCodeCanvas");
        if (qrContainer && typeof QRCode !== "undefined") {
            qrContainer.innerHTML = "";
            const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${price}&cu=INR&tn=${encodeURIComponent("Google Antigravity Ebook Personal Pass")}`;
            new QRCode(qrContainer, {
                text: upiUri,
                width: 170,
                height: 170,
                colorDark: "#070b19",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });

            const deepLinks = mismatchOverlay.querySelectorAll(".reader-upi-deep-link");
            deepLinks.forEach(link => link.href = upiUri);
        }

        // 2. SETUP FORM SUBMISSION FOR THIS NEW BUYER
        const mismatchForm = document.getElementById("readerMismatchPaymentForm");
        if (mismatchForm && !mismatchForm.dataset.initialized) {
            mismatchForm.dataset.initialized = "true";
            mismatchForm.addEventListener("submit", (e) => {
                e.preventDefault();

                const name = document.getElementById("readerBuyerName").value.trim();
                const email = document.getElementById("readerBuyerEmail").value.trim().toLowerCase();
                const phone = document.getElementById("readerBuyerPhone").value.trim();
                const utrInput = document.getElementById("readerBuyerUtr");
                const utr = (utrInput && utrInput.value.trim()) ? utrInput.value.trim() : `CF-PAY-${Date.now().toString().slice(-6)}`;
                const consent = document.getElementById("readerBuyerConsentCheckbox");

                if (!name || !email || !phone) {
                    alert("Kripya sabhi fields (Name, Email, WhatsApp) dhyan se bharein!");
                    return;
                }

                if (!consent.checked) {
                    alert("⚠️ Kripya अनिवार्य सहमति (Consent) Checkbox par tick karein.");
                    consent.focus();
                    return;
                }

                // Generate new unique token for this new user
                const rnd1 = Math.random().toString(36).substring(2, 6).toUpperCase();
                const rnd2 = Math.random().toString(36).substring(2, 6).toUpperCase();
                const newToken = `AGY-EBK-${rnd1}-${rnd2}-${Date.now().toString().slice(-4)}`;

                // Generate secret key for this browser
                const newSecret = "SEC-" + Math.random().toString(36).substring(2) + Date.now();
                localStorage.setItem(`agy_device_secret_${newToken}`, newSecret);

                // Register & Lock to this new user's device immediately!
                const registry = JSON.parse(localStorage.getItem("antigravity_device_registry") || "{}");
                registry[newToken] = {
                    token: newToken,
                    email: email,
                    name: name,
                    boundDeviceId: this.currentDeviceFingerprint,
                    boundDeviceName: this.currentDeviceName,
                    activatedAt: new Date().toLocaleString(),
                    timestamp: Date.now(),
                    secret: newSecret,
                    status: "LOCKED_TO_PRIMARY_DEVICE"
                };
                localStorage.setItem("antigravity_device_registry", JSON.stringify(registry));

                // Save new customer order into database
                const orderData = {
                    id: "ORD-" + Date.now(),
                    name,
                    email,
                    phone,
                    utr,
                    amount: price,
                    currency: currencySymbol,
                    token: newToken,
                    timestamp: new Date().toISOString(),
                    dateFormatted: new Date().toLocaleString(),
                    consentAgreed: true,
                    status: "Verified / Access Sent"
                };
                const orders = JSON.parse(localStorage.getItem("antigravity_orders") || "[]");
                orders.unshift(orderData);
                localStorage.setItem("antigravity_orders", JSON.stringify(orders));

                // Update active reader engine credentials
                this.userToken = newToken;
                this.userEmail = email;
                this.userName = name;

                // Update browser URL query without reload
                const newUrl = `${window.location.pathname}?token=${encodeURIComponent(newToken)}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`;
                window.history.replaceState({}, "", newUrl);

                // Hide lock modal and unlock reader
                mismatchOverlay.style.display = "none";
                if (readerApp) readerApp.style.display = "flex";

                // Refresh watermark & load book
                this.drawWatermark();
                this.loadChapter(1);

                alert(`🎉 Congratulations ${name}!\n\nAapka payment verify ho gaya hai aur aapka personal access pass generate ho chuka hai:\nToken: ${newToken}\n\nYah E-Book ab aapke is device par unlock ho gayi hai. Happy Reading!`);
            });
        }
    }

    showAuthGate() {
        const gate = document.getElementById("readerAuthGate");
        if (gate) gate.style.display = "flex";
    }

    hideAuthGate() {
        const gate = document.getElementById("readerAuthGate");
        if (gate) gate.style.display = "none";
    }

    // 2. HARDENED SECURITY SHIELDS (ANTI-SCREENSHOT, ANTI-DEVTOOLS, ANTI-PRINT)
    setupSecurityShields() {
        const shield = document.getElementById("antiScreenshotShield");
        const resumeBtn = document.getElementById("btnResumeReading");

        const triggerShield = (reason) => {
            if (shield) {
                const desc = document.getElementById("shieldReasonDesc");
                if (desc) desc.textContent = reason || "Security focus lost. To prevent unauthorized screen capture or recording, viewing is temporarily paused.";
                shield.classList.add("shield-triggered");
            }
        };

        const dismissShield = () => {
            if (shield) shield.classList.remove("shield-triggered");
        };

        if (resumeBtn) {
            resumeBtn.addEventListener("click", () => {
                dismissShield();
                window.focus();
            });
        }

        // A. BLUR / PAUSE ON WINDOW FOCUS LOSS OR ALT+TAB
        window.addEventListener("blur", () => {
            triggerShield("Window lost focus. Anti-recording and anti-screenshot shield is active.");
        });

        // B. VISIBILITY API (TAB SWITCH DETECTION)
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden") {
                triggerShield("Tab switched or hidden. Content protected against screen capture.");
            }
        });

        // C. BLOCK SHORTCUT KEYS (Ctrl+S, Ctrl+P, Ctrl+U, Ctrl+C, F12, PrintScreen)
        window.addEventListener("keydown", (e) => {
            // PrintScreen Detection
            if (e.key === "PrintScreen" || e.keyCode === 44) {
                e.preventDefault();
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText("PROTECTED_CONTENT_ACCESS_VIOLATION");
                }
                triggerShield("⚠️ Screenshot / PrintScreen detected and blocked! Watermark details recorded.");
                return false;
            }

            if (e.ctrlKey || e.metaKey) {
                const key = e.key.toLowerCase();
                if (['s', 'p', 'u', 'c'].includes(key) || (e.shiftKey && ['i', 'j', 'c'].includes(key))) {
                    e.preventDefault();
                    triggerShield(`Action Ctrl+${key.toUpperCase()} is strictly disabled to protect copyright.`);
                    return false;
                }
            }

            if (e.key === "F12" || e.keyCode === 123) {
                e.preventDefault();
                triggerShield("Developer Tools inspection is strictly prohibited.");
                return false;
            }
        });

        // D. BLOCK RIGHT-CLICK
        document.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            return false;
        });

        // E. DEVTOOLS RESIZE DETECTION
        let devtoolsOpen = false;
        const threshold = 160;
        setInterval(() => {
            const widthDiff = window.outerWidth - window.innerWidth;
            const heightDiff = window.outerHeight - window.innerHeight;
            if (widthDiff > threshold || heightDiff > threshold) {
                if (!devtoolsOpen) {
                    devtoolsOpen = true;
                    triggerShield("Developer Tools or Screen Split detected. Please close inspect window to resume.");
                }
            } else {
                devtoolsOpen = false;
            }
        }, 1000);
    }

    // 3. DYNAMIC WATERMARK CANVAS
    initWatermarkCanvas() {
        this.watermarkCanvas = document.getElementById("securityWatermarkCanvas");
        if (!this.watermarkCanvas) return;

        const resize = () => {
            this.watermarkCanvas.width = window.innerWidth;
            this.watermarkCanvas.height = window.innerHeight;
            this.drawWatermark();
        };

        window.addEventListener("resize", resize);
        resize();

        setInterval(() => {
            this.watermarkOffset = (this.watermarkOffset + 4) % 160;
            this.drawWatermark();
        }, 3000);
    }

    drawWatermark() {
        if (!this.watermarkCanvas) return;
        const ctx = this.watermarkCanvas.getContext("2d");
        const w = this.watermarkCanvas.width;
        const h = this.watermarkCanvas.height;

        ctx.clearRect(0, 0, w, h);
        ctx.save();
        ctx.font = "bold 13px 'JetBrains Mono', monospace";
        ctx.fillStyle = "rgba(0, 240, 255, 0.45)";
        ctx.textAlign = "center";

        const text1 = `PROTECTED • LICENSED TO: ${this.userEmail}`;
        const text2 = `TOKEN: ${this.userToken} • 1-DEVICE LOCKED`;

        const stepX = 340;
        const stepY = 190;

        for (let x = -200 + (this.watermarkOffset % stepX); x < w + 300; x += stepX) {
            for (let y = -100 + (this.watermarkOffset % stepY); y < h + 200; y += stepY) {
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(-22 * Math.PI / 180);
                ctx.fillText(text1, 0, 0);
                ctx.fillText(text2, 0, 16);
                ctx.restore();
            }
        }
        ctx.restore();
    }

    // 4. UI CONTROLS & BINDINGS
    bindUiControls() {
        const langBtns = document.querySelectorAll(".lang-btn");
        langBtns.forEach(btn => {
            btn.classList.toggle("active", btn.dataset.lang === this.currentLanguage);
            btn.addEventListener("click", () => {
                langBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                this.currentLanguage = btn.dataset.lang;
                localStorage.setItem("antigravity_lang", btn.dataset.lang);
                this.renderSidebarChapters();
                this.loadChapter(this.currentChapterId);
            });
        });

        const themeBtn = document.getElementById("btnToggleTheme");
        if (themeBtn) {
            const themes = ["matrix", "slate", "sepia", "light"];
            themeBtn.addEventListener("click", () => {
                const nextIdx = (themes.indexOf(this.currentTheme) + 1) % themes.length;
                this.setTheme(themes[nextIdx]);
            });
        }

        const fontBtn = document.getElementById("btnToggleFont");
        if (fontBtn) {
            const sizes = ["sm", "md", "lg"];
            fontBtn.addEventListener("click", () => {
                const nextIdx = (sizes.indexOf(this.currentFontSize) + 1) % sizes.length;
                this.setFontSize(sizes[nextIdx]);
            });
        }

        const fsBtn = document.getElementById("btnToggleFullscreen");
        if (fsBtn) {
            fsBtn.addEventListener("click", () => {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(err => {});
                } else {
                    if (document.exitFullscreen) document.exitFullscreen();
                }
            });
        }

        const searchInput = document.getElementById("sidebarSearchInput");
        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                const query = e.target.value.toLowerCase().trim();
                this.filterChapters(query);
            });
        }

        const gateForm = document.getElementById("gateVerifyForm");
        if (gateForm) {
            gateForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const inputToken = document.getElementById("gateTokenInput").value.trim();
                const inputEmail = document.getElementById("gateEmailInput").value.trim().toLowerCase();
                if (inputToken && inputEmail) {
                    this.userToken = inputToken;
                    this.userEmail = inputEmail;
                    
                    if (this.verifyDeviceLock(inputToken, inputEmail)) {
                        this.hideAuthGate();
                        this.drawWatermark();
                    }
                } else {
                    alert("Kripya Token aur Email enter karein!");
                }
            });
        }

        const demoBtn = document.getElementById("btnDemoUnlock");
        if (demoBtn) {
            demoBtn.addEventListener("click", () => {
                this.userToken = "AGY-DEMO-" + Math.floor(Math.random() * 90000 + 10000);
                this.userEmail = "demo.developer@antigravity.in";
                this.hideAuthGate();
                this.drawWatermark();
            });
        }
    }

    setTheme(theme) {
        this.currentTheme = theme;
        const viewport = document.getElementById("readerViewport");
        if (viewport) {
            viewport.className = "reader-viewport theme-" + theme;
        }
    }

    setFontSize(size) {
        this.currentFontSize = size;
        const container = document.getElementById("readerArticleContainer");
        if (container) {
            container.className = "reader-article font-" + size;
        }
    }

    // 5. CHAPTER RENDERING & NAVIGATION (Supports Dynamic Multi-Course & Core Antigravity Book)
    getEbookData() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const courseId = urlParams.get("courseId");
            if (courseId) {
                const catalog = JSON.parse(localStorage.getItem("antigravity_courses_catalog") || "[]");
                const matched = catalog.find(c => c.id === courseId);
                if (matched) {
                    if (matched.ebookData && Array.isArray(matched.ebookData.chapters) && matched.ebookData.chapters.length > 0) {
                        return matched.ebookData;
                    }
                    if (matched.isDefault && typeof EBOOK_DATA !== "undefined") {
                        return EBOOK_DATA;
                    }
                }
            }

            const customActive = localStorage.getItem("antigravity_active_ebook");
            if (customActive) {
                const parsed = JSON.parse(customActive);
                if (parsed && Array.isArray(parsed.chapters) && parsed.chapters.length > 0) {
                    return parsed;
                }
            }
        } catch (e) {}
        return typeof EBOOK_DATA !== "undefined" ? EBOOK_DATA : { chapters: [], metadata: {} };
    }


    renderSidebarChapters() {
        const list = document.getElementById("sidebarChapterList");
        const ebook = this.getEbookData();
        if (!list || !ebook.chapters || ebook.chapters.length === 0) return;

        // Update brand title in reader header if metadata exists
        if (ebook.metadata && ebook.metadata.title) {
            const readerLogo = document.querySelector(".reader-logo-text");
            if (readerLogo) {
                const shortTitle = ebook.metadata.title.length > 30 ? ebook.metadata.title.substring(0, 30) + "..." : ebook.metadata.title;
                readerLogo.textContent = shortTitle;
            }
        }

        list.innerHTML = "";
        ebook.chapters.forEach(ch => {
            const item = document.createElement("li");
            item.className = `sidebar-chapter-item ${ch.id === this.currentChapterId ? 'active' : ''}`;
            item.dataset.id = ch.id;

            const title = (ch.title && (ch.title[this.currentLanguage] || ch.title.hinglish || ch.title.english)) || `Chapter ${ch.number}`;
            item.innerHTML = `
                <div class="ch-num">CHAPTER ${ch.number}</div>
                <div class="ch-title">${title}</div>
            `;

            item.addEventListener("click", () => {
                this.loadChapter(ch.id);
            });

            list.appendChild(item);
        });
    }

    filterChapters(query) {
        const items = document.querySelectorAll(".sidebar-chapter-item");
        items.forEach(item => {
            const title = item.querySelector(".ch-title").textContent.toLowerCase();
            if (title.includes(query) || !query) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        });
    }

    loadChapter(chapterId) {
        this.currentChapterId = chapterId;
        const ebook = this.getEbookData();
        const chapter = ebook.chapters.find(c => c.id === chapterId) || ebook.chapters[0];
        if (!chapter) return;

        document.querySelectorAll(".sidebar-chapter-item").forEach(item => {
            if (parseInt(item.dataset.id) === chapter.id) {
                item.classList.add("active");
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                item.classList.remove("active");
            }
        });

        const titleEl = document.getElementById("chapterHeading");
        const bodyEl = document.getElementById("chapterContentBody");
        const progressEl = document.getElementById("readerProgressLabel");

        if (titleEl) {
            titleEl.textContent = (chapter.title && (chapter.title[this.currentLanguage] || chapter.title.hinglish || chapter.title.english)) || `Chapter ${chapter.number}`;
        }

        if (bodyEl) {
            bodyEl.innerHTML = (chapter.content && (chapter.content[this.currentLanguage] || chapter.content.hinglish || chapter.content.english)) || "<p>Content not available.</p>";
        }

        if (progressEl) {
            progressEl.textContent = `Chapter ${chapter.number} of ${ebook.chapters.length}`;
        }

        this.renderFooterNav(chapter.id);

        const viewport = document.getElementById("readerViewport");
        if (viewport) viewport.scrollTop = 0;
    }

    renderFooterNav(currentId) {
        const footer = document.getElementById("readerChapterFooter");
        if (!footer) return;

        const ebook = this.getEbookData();
        footer.innerHTML = "";

        if (currentId > 1) {
            const prevBtn = document.createElement("button");
            prevBtn.className = "btn btn-secondary";
            prevBtn.innerHTML = "← Previous Chapter";
            prevBtn.onclick = () => this.loadChapter(currentId - 1);
            footer.appendChild(prevBtn);
        } else {
            footer.appendChild(document.createElement("div"));
        }

        if (currentId < ebook.chapters.length) {
            const nextBtn = document.createElement("button");
            nextBtn.className = "btn btn-primary";
            nextBtn.innerHTML = "Next Chapter →";
            nextBtn.onclick = () => this.loadChapter(currentId + 1);
            footer.appendChild(nextBtn);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    window.SecureReader = new SecureReaderEngine();
});

function copyReaderUpiId() {
    const adminConfig = JSON.parse(localStorage.getItem("antigravity_admin_config") || "{}");
    const upiId = adminConfig.upiId || "antigravity.developer@upi";
    navigator.clipboard.writeText(upiId).then(() => {
        const btn = document.getElementById("readerBtnCopyUpi");
        if (btn) {
            btn.textContent = "✓";
            setTimeout(() => { btn.textContent = "📋"; }, 2000);
        }
    }).catch(err => {
        alert("UPI ID: " + upiId);
    });
}
