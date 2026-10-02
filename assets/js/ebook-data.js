/**
 * Complete Google Antigravity Master Guide E-Book Database
 * Trilingual: Hinglish, Hindi, English
 * Includes Chapters, Diagrams, Prompts, Terminal Commands & Architecture Insights
 */

const EBOOK_DATA = {
    metadata: {
        title: "Google Antigravity Master Guide: Build Any Software & Website in Minutes",
        subtitle: "The Ultimate Step-by-Step Blueprint to Autonomous AI Software Engineering",
        author: "AI Engineering Guild & Antigravity Pioneers",
        edition: "2026-2027 Autonomous Agent Edition",
        totalPages: 120,
        coverImage: "assets/images/cover.jpg",
        workflowImage: "assets/images/workflow.jpg",
        architectureImage: "assets/images/architecture.jpg"
    },
    chapters: [
        {
            id: 1,
            number: "01",
            title: {
                hinglish: "Chapter 1: Google Antigravity Kya Hai aur Ye Normal AI se Alag Kaise Hai?",
                hindi: "अध्याय 1: गूगल एंटीग्रैविटी क्या है और यह सामान्य AI से अलग कैसे है?",
                english: "Chapter 1: What is Google Antigravity & Why is it a Quantum Leap?"
            },
            summary: {
                hinglish: "Google Antigravity ka introduction, Agentic Coding revolution, aur normal ChatGPT/Claude se 10x powerful hone ke peeche ka secret.",
                hindi: "गूगल एंटीग्रैविटी का परिचय, एजेंटिक कोडिंग क्रांति, और सामान्य चैटबॉट से यह कैसे 10 गुना शक्तिशाली है।",
                english: "Introduction to Google Antigravity, the Agentic coding paradigm shift, and how it differs from traditional chat-based LLMs."
            },
            content: {
                hinglish: `
                    <h2>1.1 Google Antigravity ka Asli Sach</h2>
                    <p>Agar aap abhi tak ChatGPT, Claude ya kisi standard AI chat window me code copy-paste kar rahe the, to aap AI ka sirf 5% power use kar rahe the. <strong>Google Antigravity (AGY)</strong> koi sadharan chatbot nahi hai — ye ek <em>Autonomous Agentic Coding System</em> hai jise Google DeepMind ne create kiya hai.</p>
                    
                    <div class="callout-box info">
                        <strong>💡 Key Difference:</strong> Sadharan AI sirf text likhta hai. Antigravity aapke computer me folder banata hai, code likhta hai, terminal pe commands execute karta hai, errors aane pe unhe self-heal (khud theek) karta hai, aur browser khol kar test bhi karta hai!
                    </div>

                    <div class="reader-image-wrap">
                        <img src="assets/images/architecture.jpg" alt="Google Antigravity Architecture" class="reader-img">
                        <p class="img-caption">चित्र 1.1: Google Antigravity AI Agent Architecture Pipeline</p>
                    </div>

                    <h2>1.2 Antigravity ke 4 Core Pillars</h2>
                    <ol>
                        <li><strong>Autonomous Planning:</strong> Jab aap Antigravity ko koi task dete hain (e.g. <em>"Bhai mere liye ek complete hotel booking website banao"</em>), to ye seedha random code likhna shuru nahi karta. Ye pehle system architecture design karta hai, database schema sochta hai, aur step-by-step roadmap banata hai.</li>
                        <li><strong>Multi-File Context Engine:</strong> Normal LLM ek time pe 1-2 files hi dhyan me rakh paate hain. Antigravity aapke pure project folder ke 100+ files ko analyze karta hai, functions ke relationships ko map karta hai aur clean modular code likhta hai.</li>
                        <li><strong>Tool Execution & Self-Correction:</strong> Antigravity ke paas terminal access, file write/replace tools, grep search aur compiler feedback hota hai. Agar koi syntax error ya bug aaya, to ye bina aapko pareshan kiye khud error log read karke fix kar deta hai.</li>
                        <li><strong>Browser Subagent Validation:</strong> Antigravity background me ya visual window me browser open karke buttons click karta hai, forms fill karta hai, aur verify karta hai ki application 100% working hai ya nahi.</li>
                    </ol>

                    <h2>1.3 Kyun Sikhna Zaroori Hai Antigravity?</h2>
                    <p>Aaj ke time me ek full-stack developer ko ek web app banane me 2 se 4 hafte lagte hain. Google Antigravity ke sath wahi kaam <strong>15 se 30 minute</strong> me complete ho jata hai. Agar aap freelancer, agency owner, student ya software engineer hain, to ye skill aapko market me 99% logo se aage khada kar degi.</p>
                `,
                hindi: `
                    <h2>1.1 गूगल एंटीग्रैविटी का वास्तविक स्वरूप</h2>
                    <p>यदि आप अब तक चैटजीपीटी या क्लॉड में कोड कॉपी-पेस्ट कर रहे थे, तो आप एआई की क्षमता का केवल 5% ही उपयोग कर रहे थे। <strong>गूगल एंटीग्रैविटी (AGY)</strong> कोई साधारण चैटबॉट नहीं है — यह गूगल डीपमाइंड द्वारा विकसित एक <em>स्वायत्त एजेंटिक कोडिंग सिस्टम (Autonomous Agentic Coding System)</em> है।</p>
                    
                    <div class="callout-box info">
                        <strong>💡 मुख्य अंतर:</strong> साधारण एआई केवल टेक्स्ट लिखता है। एंटीग्रैविटी आपके कंप्यूटर में फाइल्स बनाता है, कोड लिखता है, टर्मिनल पर कमांड चलाता है, एरर आने पर उन्हें खुद ठीक करता है और ब्राउज़र में चलाकर टेस्ट भी करता है!
                    </div>

                    <div class="reader-image-wrap">
                        <img src="assets/images/architecture.jpg" alt="गूगल एंटीग्रैविटी आर्किटेक्चर" class="reader-img">
                        <p class="img-caption">चित्र 1.1: गूगल एंटीग्रैविटी एजेंटिक आर्किटेक्चर पाइपलाइन</p>
                    </div>

                    <h2>1.2 एंटीग्रैविटी के 4 मुख्य स्तंभ</h2>
                    <ol>
                        <li><strong>स्वायत्त योजना (Autonomous Planning):</strong> जब आप कोई प्रोजेक्ट मांगते हैं, तो यह सीधे अंधाधुंध कोड नहीं लिखता बल्कि पहले सिस्टम डिजाइन और स्टेप-बाय-स्टेप रोडमैप तैयार करता है।</li>
                        <li><strong>मल्टी-फाइल विश्लेषण:</strong> यह पूरे प्रोजेक्ट के 100+ फाइल्स के आपसी संबंध और आर्किटेक्चर को एक साथ समझता है।</li>
                        <li><strong>टर्मिनल टूल्स व ऑटो-रिपेयर:</strong> पैकेज इंस्टॉल करना, सर्वर चलाना और बग आने पर खुद लॉग देखकर एरर सॉल्व करना।</li>
                        <li><strong>ब्राउज़र सब-एजेंट टेस्टिंग:</strong> आपके बनाए सॉफ्टवेयर को ब्राउज़र में खोलकर बटन्स और फॉर्म्स को ऑटोमैटिक टेस्ट करना।</li>
                    </ol>
                `,
                english: `
                    <h2>1.1 The Paradigm Shift of Google Antigravity</h2>
                    <p>If you have been copying and pasting code from ChatGPT or Claude, you have only tapped into 5% of AI's true capability. <strong>Google Antigravity (AGY)</strong> is not another conversational chatbot; it is an <em>Autonomous Agentic Coding Platform</em> engineered by Google DeepMind to operate as a senior software engineer directly on your machine.</p>

                    <div class="callout-box info">
                        <strong>💡 Core Distinction:</strong> Traditional LLMs generate passive text. Antigravity manipulates file systems, executes terminal processes, interprets compiler diagnostics, auto-heals bugs, and validates through headless browser subagents.
                    </div>

                    <div class="reader-image-wrap">
                        <img src="assets/images/architecture.jpg" alt="Google Antigravity Architecture" class="reader-img">
                        <p class="img-caption">Figure 1.1: Google Antigravity Autonomous Agent Architecture</p>
                    </div>

                    <h2>1.2 The Four Architectural Pillars</h2>
                    <ol>
                        <li><strong>Autonomous Strategic Planning:</strong> Formulates actionable task graphs, dependency analysis, and risk mitigation strategies prior to writing code.</li>
                        <li><strong>Full-Codebase Context Awareness:</strong> Leverages advanced retrieval and indexing across hundreds of files simultaneously.</li>
                        <li><strong>Self-Healing Execution Loop:</strong> Observes terminal stderr, runtime exceptions, and lint feedback, dynamically patching discrepancies.</li>
                        <li><strong>Browser-Driven Verification:</strong> Direct integration with Chromium engines to navigate, click, fill forms, and assert UI correctness.</li>
                    </ol>
                `
            }
        },
        {
            id: 2,
            number: "02",
            title: {
                hinglish: "Chapter 2: Setup, Installation & Antigravity 2.0 Environment",
                hindi: "अध्याय 2: सेटअप, इंस्टॉलेशन और एंटीग्रैविटी 2.0 एनवायरनमेंट",
                english: "Chapter 2: Setup, Installation & Antigravity 2.0 Environment"
            },
            summary: {
                hinglish: "Antigravity CLI, IDE aur Antigravity 2.0 Desktop app ka step-by-step complete installation aur AI models (Gemini, ChatGPT, Claude) connect karne ka full guide.",
                hindi: "एंटीग्रैविटी सीएलआई, आईडीई और डेस्कटॉप ऐप का स्टेप-बाय-स्टेप संपूर्ण इंस्टॉलेशन व AI Models कनेक्शन गाइड।",
                english: "Step-by-step installation of Antigravity CLI, IDE, Antigravity 2.0 Desktop and connecting AI models (Gemini, OpenAI, Claude, Ollama)."
            },
            content: {
                hinglish: `
                    <h2>2.1 Antigravity ke 3 Interfaces (Surfaces)</h2>
                    <p>Google Antigravity ko aap 3 alag-alag tariko se use kar sakte hain:</p>
                    <ul>
                        <li><strong>Antigravity IDE:</strong> AI-first Standalone IDE jisme dedicated chat canvas, inline code lenses aur diff viewer hota hai. <strong>Official Download:</strong> <a href="https://antigravity.google.dev" target="_blank" style="color:#00f0ff;">antigravity.google.dev</a></li>
                        <li><strong>Antigravity CLI (<code>agy</code>):</strong> Terminal lover developers ke liye lightning fast CLI jo command prompt / bash se directly agents ko lease karta hai.</li>
                        <li><strong>Antigravity 2.0 Desktop App:</strong> Google ka flagship Electron application jo parallel agents, background daemons, scheduled tasks aur browser subagents ko visualize karta hai.</li>
                    </ul>

                    <div class="callout-box info">
                        <strong>🔗 Official Links:</strong><br>
                        • Antigravity IDE Download: <a href="https://antigravity.google.dev" target="_blank" style="color:#00f0ff;">https://antigravity.google.dev</a><br>
                        • Antigravity CLI Docs: <a href="https://developers.google.com/antigravity" target="_blank" style="color:#00f0ff;">https://developers.google.com/antigravity</a><br>
                        • GitHub Releases: <a href="https://github.com/google/antigravity" target="_blank" style="color:#00f0ff;">https://github.com/google/antigravity</a>
                    </div>

                    <h2>2.2 Step-by-Step Installation Guide</h2>
                    <p>Antigravity setup karne ke liye aapke system me Node.js (v18+) aur Python (v3.10+) hona chahiye. Iske baad terminal me ye run karein:</p>
                    
                    <pre><code># Antigravity CLI globally install karne ke liye
npm install -g @google/antigravity-cli

# Verify karein ki installation successful hua ya nahi
agy --version

# Antigravity auth login initialize karein
agy auth login</code></pre>

                    <div class="callout-box warning">
                        <strong>⚠️ Security & Permissions Setting:</strong> Antigravity 2.0 me <code>Settings &gt; Tool Execution Policy</code> ko check karein. Agar aap chahte hain ki agent bina bar-bar popup puche speed se kaam kare, to <code>always-proceed</code> ya <code>proceed-in-sandbox</code> select karein.
                    </div>

                    <h2>2.3 AI Models Connect Kaise Karein?</h2>
                    <p>Google Antigravity IDE me aap multiple AI models connect kar sakte hain. Yahan sabse popular models ka setup guide hai:</p>

                    <h3 style="color: #10b981; margin: 16px 0 8px;">🤖 Gemini (Google — Default & Recommended)</h3>
                    <pre><code># Gemini API Key get karo: https://aistudio.google.com/apikey
# Antigravity IDE me: Settings > Model Selection > Gemini 2.0 Flash / Pro
# Ya CLI ke liye:
export GEMINI_API_KEY="your-api-key-here"
agy chat --model gemini-2.0-pro</code></pre>

                    <h3 style="color: #10b981; margin: 16px 0 8px;">💬 ChatGPT / OpenAI Connect Karna</h3>
                    <pre><code># OpenAI API Key: https://platform.openai.com/api-keys
# Antigravity IDE Settings > Model > OpenAI Compatible > GPT-4o
export OPENAI_API_KEY="sk-proj-..."
agy chat --model gpt-4o --provider openai</code></pre>

                    <h3 style="color: #10b981; margin: 16px 0 8px;">🧠 Claude (Anthropic) Connect Karna</h3>
                    <pre><code># Anthropic API Key: https://console.anthropic.com/
# IDE Settings > Model > Claude Sonnet 4 / Haiku
export ANTHROPIC_API_KEY="sk-ant-..."
agy chat --model claude-sonnet-4 --provider anthropic</code></pre>

                    <h3 style="color: #10b981; margin: 16px 0 8px;">🦙 Local Models (Ollama) - FREE Option</h3>
                    <pre><code># Ollama install karo: https://ollama.com
ollama pull llama3.2
# IDE Settings > Model > Ollama > localhost:11434
agy chat --model ollama/llama3.2 --provider ollama</code></pre>

                    <div class="callout-box info">
                        <strong>💡 Pro Tip:</strong> Beginners ke liye <strong>Gemini 2.0 Flash</strong> best choice hai — fast, free tier available, aur Antigravity ke sath native integration hai. Advanced users ke liye Claude Sonnet 4 ka "thinking mode" best results deta hai.
                    </div>

                    <h2>2.4 Folder Structure Samajhiye</h2>
                    <p>Jab Antigravity kisi project me activate hota hai, to wo do primary customization roots ko follow karta hai:</p>
                    <ul>
                        <li><code>~/.gemini/config/</code> : Global settings, common skills aur master rules.</li>
                        <li><code>.agents/</code> ya <code>AGENTS.md</code> : Project-specific guidelines jo agent ko batati hain ki aapka coding style kya hai.</li>
                    </ul>
                `,
                hindi: `
                    <h2>2.1 एंटीग्रैविटी के 3 प्रमुख रूप (Surfaces)</h2>
                    <p>गूगल एंटीग्रैविटी को आप तीन माध्यमों से चला सकते हैं:</p>
                    <ul>
                        <li><strong>एंटीग्रैविटी आईडीई:</strong> कोडिंग के लिए समर्पित पूर्ण आईडीई।</li>
                        <li><strong>एंटीग्रैविटी सीएलआई (agy):</strong> टर्मिनल से सीधा कंट्रोल करने वाला शक्तिशाली टूल।</li>
                        <li><strong>एंटीग्रैविटी 2.0 डेस्कटॉप ऐप:</strong> मल्टी-एजेंट और बैकग्राउंड प्रोसेस मॉनिटर करने वाला आधुनिक डेस्कटॉप ऐप।</li>
                    </ul>

                    <h2>2.2 इंस्टॉलेशन स्टेप्स</h2>
                    <pre><code># एंटीग्रैविटी सीएलआई इंस्टॉल करें
npm install -g @google/antigravity-cli

# वर्जन चेक करें
agy --version

# गूगल अकाउंट ऑथेंटिकेशन
agy auth login</code></pre>

                    <div class="callout-box warning">
                        <strong>⚠️ परमिशन सेटिंग्स:</strong> सेटिंग्स में जाकर <code>Tool Execution Policy</code> को <code>always-proceed</code> रखें ताकि एजेंट पूरी रफ्तार से बिना रुके काम पूरा कर सके।
                    </div>
                `,
                english: `
                    <h2>2.1 The Three Surfaces of Antigravity</h2>
                    <ul>
                        <li><strong>Antigravity IDE:</strong> The unified, AI-native editor with deep workspace synchronization.</li>
                        <li><strong>Antigravity CLI (<code>agy</code>):</strong> High-throughput command-line interface for headless environments and CI/CD pipelines.</li>
                        <li><strong>Antigravity 2.0 Desktop:</strong> Standalone orchestration dashboard for subagents, cron jobs, and visual telemetry.</li>
                    </ul>

                    <h2>2.2 Installation Workflow</h2>
                    <pre><code># Global installation via package manager
npm install -g @google/antigravity-cli

# Verify runtime compatibility
agy --version

# Authenticate with Google Developer credentials
agy auth login</code></pre>
                `
            }
        },
        {
            id: 3,
            number: "03",
            title: {
                hinglish: "Chapter 3: Slash Commands, @ Mentions aur Prompting Framework",
                hindi: "अध्याय 3: स्लैश कमांड्स, @ मेंशंस और मास्टर प्रॉम्प्टिंग फ्रेमवर्क",
                english: "Chapter 3: Slash Commands, @ Mentions & Autonomous Prompting Frameworks"
            },
            summary: {
                hinglish: "/goal, /plan, /grill-me, /learn commands ka secret use aur golden prompting formula.",
                hindi: "स्लैश कमांड्स का सही उपयोग और किसी भी सॉफ्टवेयर को जनरेट करवाने का अचूक प्रॉम्प्ट फॉर्मूला।",
                english: "Mastering built-in slash workflows (/goal, /plan, /grill-me) and prompt engineering frameworks for agents."
            },
            content: {
                hinglish: `
                    <h2>3.1 Antigravity ke 5 Magical Slash Commands</h2>
                    <p>Antigravity me sirf chat nahi hoti, isme built-in autonomous workflows trigger hote hain jab aap slash (<code>/</code>) type karte hain:</p>

                    <div class="cmd-grid">
                        <div class="cmd-card">
                            <code>/goal</code>
                            <p><strong>Overnight Autonomous Mode:</strong> Jab aapko koi bohot bada project banana ho aur aap chahte hain ki agent ghanto tak bina ruke jab tak 100% goal achieve na ho jaye tab tak kaam karta rahe.</p>
                        </div>
                        <div class="cmd-card">
                            <code>/plan</code>
                            <p><strong>Architectural Planning:</strong> Code likhne se pehle detailed task breakdown aur implementation strategy create karne ke liye.</p>
                        </div>
                        <div class="cmd-card">
                            <code>/grill-me</code>
                            <p><strong>Interactive Requirement Interview:</strong> Agent aapse 5-6 sharp sawal puchta hai jisse requirements crystal-clear ho jayein aur project fail hone ka 0% chance rahe.</p>
                        </div>
                        <div class="cmd-card">
                            <code>/learn</code>
                            <p><strong>Permanent Memory Injection:</strong> Agar aapne agent ko koi nayi trick ya rule sikhaya, to /learn se wo use future ke sabhi projects ke liye memorize kar leta hai.</p>
                        </div>
                        <div class="cmd-card">
                            <code>/schedule</code>
                            <p><strong>Background Cron Scheduler:</strong> Kisi script ya monitor ko har 10 minute me ya daily specific time pe run karne ke liye.</p>
                        </div>
                    </div>

                    <h2>3.2 @ Mention Context System</h2>
                    <p>Aap chat me <code>@</code> type karke kisi bhi file, terminal output, ya previous conversation ko instant context bana sakte hain:</p>
                    <ul>
                        <li><code>@src/components/Navbar.jsx</code> : Specific file ko agent ke direct focus me lata hai.</li>
                        <li><code>@terminal</code> : Current terminal error ko pass karta hai.</li>
                        <li><code>@rules</code> : Workspace rules ko load karta hai.</li>
                    </ul>

                    <h2>3.3 The "C-P-R-E" Golden Prompting Formula</h2>
                    <p>Kisi bhi software ko ek baar me flawless banwane ka Antigravity formula:</p>
                    <ol>
                        <li><strong>C (Context):</strong> Aap kaun hain aur target audience kaun hai.</li>
                        <li><strong>P (Problem/Goal):</strong> Software kya kaam karega.</li>
                        <li><strong>R (Rules & Tech Stack):</strong> Kaunsi technology (HTML, React, Python, SQLite) use karni hai.</li>
                        <li><strong>E (Execution & Test):</strong> Agent ko bolo ki wo khud terminal me test kare aur browser me run karke verify kare.</li>
                    </ol>

                    <div class="callout-box success">
                        <strong>🎯 Copy-Paste Golden Prompt Template:</strong>
                        <pre><code>"Act as a Principal Full-Stack Architect. 
Goal: Build a complete responsive CRM web app for digital marketers.
Tech Stack: HTML5, Modern Vanilla CSS (Glassmorphic dark UI), Modular JS, LocalStorage persistence.
Requirements: Lead management, status pipeline (Kanban), export to CSV, search filter, analytics charts.
Execution: Create all files in workspace, write production-ready code with no placeholders, verify syntax and run browser test."</code></pre>
                    </div>
                `,
                hindi: `
                    <h2>3.1 पांच जादुई स्लैश कमांड्स</h2>
                    <p>एंटीग्रैविटी चैट में <code>/</code> टाइप करके आप विशेष सब-एजेंट्स एक्टिवेट कर सकते हैं:</p>
                    <ul>
                        <li><strong>/goal :</strong> जब बड़ा प्रोजेक्ट हो और आप चाहते हैं कि एजेंट तब तक न रुके जब तक प्रोजेक्ट पूरी तरह तैयार न हो जाए।</li>
                        <li><strong>/plan :</strong> कोडिंग से पहले पूरा खाका और माइलस्टोन तैयार करने के लिए।</li>
                        <li><strong>/grill-me :</strong> एजेंट आपसे इंटरव्यू लेकर सभी जरूरी फीचर्स स्पष्ट करता है।</li>
                        <li><strong>/learn :</strong> एजेंट को हमेशा के लिए आपकी पसंद और नियम सिखाने के लिए।</li>
                        <li><strong>/schedule :</strong> ऑटोमैटिक समय पर टास्क चलाने के लिए।</li>
                    </ul>
                `,
                english: `
                    <h2>3.1 Specialized Slash Workflows</h2>
                    <p>Slash commands execute high-order orchestrations within the Antigravity runtime:</p>
                    <ul>
                        <li><code>/goal</code>: Long-running, unconstrained autonomous execution loop that proceeds until full objective satisfaction.</li>
                        <li><code>/plan</code>: Generates structured implementation artifacts prior to code modifications.</li>
                        <li><code>/grill-me</code>: Interactive Socratic interview session to clarify edge cases and ambiguities.</li>
                        <li><code>/learn</code>: Persists workflow corrections into the project's permanent knowledge base.</li>
                        <li><code>/schedule</code>: Deploys background cron timers for periodic agent maintenance.</li>
                    </ul>
                `
            }
        },
        {
            id: 4,
            number: "04",
            title: {
                hinglish: "Chapter 4: 5 Minute me Full-Stack Website & Web App Kaise Banayein (Live Walkthrough)",
                hindi: "अध्याय 4: 5 मिनट में फुल-स्टैक वेबसाइट व वेब ऐप कैसे बनाएं (लाइव वॉकथ्रू)",
                english: "Chapter 4: Generating Full-Stack Websites & Apps in Under 5 Minutes"
            },
            summary: {
                hinglish: "Idea se lekar production deployment tak ka 5-minute practical live project demonstration.",
                hindi: "आइडिया से लेकर लाइव डिप्लॉयमेंट तक 5 मिनट में पूरी वेबसाइट बनाने का प्रैक्टिकल वॉकथ्रू।",
                english: "Zero-to-production case study generating a responsive, animated SaaS platform in minutes."
            },
            content: {
                hinglish: `
                    <h2>4.1 Zero to Production in 5 Minutes</h2>
                    <p>Chaliye ek real-world scenario dekhte hain: Hume ek <em>"AI Social Media Post Generator"</em> SaaS tool banana hai.</p>

                    <div class="reader-image-wrap">
                        <img src="assets/images/workflow.jpg" alt="Antigravity Live Workflow" class="reader-img">
                        <p class="img-caption">चित्र 4.1: Antigravity Autonomous Workflow in Action</p>
                    </div>

                    <h2>4.2 Step 1: Antigravity ko Kickstart Prompt Dena</h2>
                    <pre><code>"Antigravity, mujhe ek complete AI Social Media Caption & Hashtag Generator SaaS web app bana ke do.
Design: Ultra modern Dark Mode, glowing neon cyan accents, glassmorphic cards.
Features:
1. Platform selector (Instagram, LinkedIn, Twitter, YouTube).
2. Tone selector (Professional, Viral, Casual, Hype).
3. Instant generator with 10+ built-in dynamic creative templates.
4. One-click copy, character counter, hashtag generator.
5. History saved in LocalStorage.
Zero placeholders. Complete professional UI with pure CSS and JS."</code></pre>

                    <h2>4.3 Step 2: Agent ki Internal Processing</h2>
                    <p>Jaise hi aap ye prompt bhejte hain, Antigravity ye actions leta hai:</p>
                    <ol>
                        <li><code>list_dir</code> se dekhta hai ki folder khali hai ya pehle se files hain.</li>
                        <li><code>write_to_file</code> se <code>index.html</code>, <code>style.css</code> aur <code>app.js</code> create karta hai.</li>
                        <li>Design tokens (CSS variables for gradients, shadows, border-radii) implement karta hai.</li>
                        <li>Har button pe click handlers aur clipboard copy animation add karta hai.</li>
                    </ol>

                    <h2>4.4 Step 3: Instant Live Preview</h2>
                    <p>Antigravity background me dev server start karta hai aur browser subagent se page ko open karke check karta hai. Aapko sirf 3 minute ke andar ek polished, market-ready web app ready milta hai jise aap seedha Vercel ya Netlify pe live kar sakte hain!</p>
                `,
                hindi: `
                    <h2>4.1 केवल 5 मिनट में पूर्ण प्रोजेक्ट</h2>
                    <p>एंटीग्रैविटी की सबसे बड़ी ताकत यह है कि यह आपके साधारण विचार को कुछ ही मिनटों में एक आधुनिक, सुंदर और चालू वेब ऐप्लिकेशन में बदल देता है।</p>
                    
                    <div class="reader-image-wrap">
                        <img src="assets/images/workflow.jpg" alt="एंटीग्रैविटी वर्कफ़्लो" class="reader-img">
                        <p class="img-caption">चित्र 4.1: एंटीग्रैविटी का रीयल-टाइम कोडिंग वर्कफ़्लो</p>
                    </div>

                    <h2>4.2 मास्टर प्रॉम्प्ट कैसे दें</h2>
                    <p>प्रॉम्प्ट में हमेशा यूआई डिजाइन (Dark mode, glassmorphism) और मुख्य फीचर्स की स्पष्ट लिस्ट दें। एंटीग्रैविटी खुद फाइल्स बनाकर उन्हें आपस में लिंक कर देगा।</p>
                `,
                english: `
                    <h2>4.1 The Rapid Prototype Blueprint</h2>
                    <p>Through holistic architectural reasoning, Antigravity synthesizes frontend semantics, reactive state management, and aesthetic styling concurrently.</p>

                    <div class="reader-image-wrap">
                        <img src="assets/images/workflow.jpg" alt="Autonomous Workflow" class="reader-img">
                        <p class="img-caption">Figure 4.1: Autonomous Synthesis Pipeline</p>
                    </div>

                    <h2>4.2 Orchestration Steps</h2>
                    <p>The agent establishes design tokens, structures the document object model, links reactive handlers, and provisions mock data pipelines in a single unified execution loop.</p>
                `
            }
        },
        {
            id: 5,
            number: "05",
            title: {
                hinglish: "Chapter 5: SaaS, Mobile Apps aur Chrome Extensions Build Karna",
                hindi: "अध्याय 5: सास (SaaS), मोबाइल ऐप्स और क्रोम एक्सटेंशन तैयार करना",
                english: "Chapter 5: Building Complex SaaS, Mobile Apps & Chrome Extensions"
            },
            summary: {
                hinglish: "Antigravity se advanced software products: Chrome extensions, Electron desktop apps aur full-stack SaaS banana.",
                hindi: "एंटीग्रैविटी द्वारा क्रोम एक्सटेंशन, डेस्कटॉप सॉफ्टवेयर और सास प्रोडक्ट्स बनाने का तरीका।",
                english: "Architecting multi-tier applications: Chrome Manifest V3 extensions, Electron desktop bundles, and SaaS."
            },
            content: {
                hinglish: `
                    <h2>5.1 Complex Products Antigravity se Kaise Banayein?</h2>
                    <p>Antigravity sirf basic landing pages tak seemit nahi hai. Aap isse enterprise-grade tools bana sakte hain:</p>

                    <h3>A. Chrome Extensions (Manifest V3)</h3>
                    <p>Antigravity <code>manifest.json</code>, background service workers, content scripts aur popup UI ko perfectly configure karta hai. Example: Amazon price tracker extension ya YouTube auto-summarizer extension.</p>

                    <h3>B. Desktop Apps (Electron / Tauri)</h3>
                    <p>Agar aapko Windows ya Mac ke liye desktop software banana hai (jaise Video Downloader ya Screen Recorder), to Antigravity native OS APIs aur packaging scripts ko autonomously setup kar deta hai.</p>

                    <h3>C. Full-Stack SaaS with Authentication & Database</h3>
                    <p>Firebase, Supabase, PostgreSQL ya SQLite integrate karke Antigravity pura auth flow (Login/Signup, JWT tokens, Protected routes) aur Razorpay/Stripe checkout integrate kar sakta hai.</p>
                `,
                hindi: `
                    <h2>5.1 बड़े सॉफ्टवेयर प्रोजेक्ट्स का निर्माण</h2>
                    <p>एंटीग्रैविटी से आप किसी भी प्रकार का सॉफ्टवेयर बना सकते हैं:</p>
                    <ul>
                        <li><strong>क्रोम एक्सटेंशन्स:</strong> यूट्यूब ऑटोमेशन, अमेज़न प्राइस ट्रैकर आदि।</li>
                        <li><strong>डेस्कटॉप सॉफ्टवेयर:</strong> विंडोज और मैक के लिए सॉफ्टवेयर।</li>
                        <li><strong>सास (SaaS) प्लेटफॉर्म:</strong> यूजर लॉगिन, डाटाबेस और पेमेंट गेटवे युक्त सॉफ्टवेयर।</li>
                    </ul>
                `,
                english: `
                    <h2>5.1 Multi-Surface Engineering</h2>
                    <p>Antigravity effortlessly generalizes across varied runtime environments including Manifest V3 browser extensions, Electron/Tauri desktop wrappers, and distributed client-server architectures.</p>
                `
            }
        },
        {
            id: 6,
            number: "06",
            title: {
                hinglish: "Chapter 6: Autonomous Browser Subagents aur Automated Testing",
                hindi: "अध्याय 6: ब्राउज़र सब-एजेंट्स और ऑटोमेटेड टेस्टिंग का कमाल",
                english: "Chapter 6: Autonomous Browser Subagents & End-to-End Validation"
            },
            summary: {
                hinglish: "Antigravity ka headless/visual browser subagent jo website khol kar buttons click karta hai aur self-test karta hai.",
                hindi: "ब्राउज़र सब-एजेंट कैसे खुद वेबसाइट खोलकर टेस्ट करता है और बग्स को ढूंढकर ठीक करता है।",
                english: "Harnessing the browser subagent to execute real DOM interactions, capture sessions, and verify regressions."
            },
            content: {
                hinglish: `
                    <h2>6.1 Browser Subagent Kya Hai?</h2>
                    <p>Antigravity ka sabse revolutionary feature hai <code>browser_subagent</code>. Jab agent koi website banata hai, to wo insaan ki tarah browser window open karta hai, mouse click karta hai, forms fill karta hai aur dekhta hai ki kahi koi console error to nahi aa raha.</p>

                    <h2>6.2 Self-Healing Loop</h2>
                    <p>Agar koi button click karne par modal open nahi hua, to browser subagent turant parent agent ko report bhejta hai: <em>"Line 45 pe event listener missing hai"</em>. Agent code file me jaakar turant use fix karta hai aur dubara test karta hai jab tak test pass na ho jaye!</p>
                `,
                hindi: `
                    <h2>6.1 ब्राउज़र सब-एजेंट की शक्ति</h2>
                    <p>एंटीग्रैविटी खुद एक अलग ब्राउज़र विंडो खोलकर आपकी वेबसाइट को चलाकर देखता है। यह बटन्स पर क्लिक करता है, फॉर्म भरता है और यदि कोई एरर आता है तो उसे तुरंत सुधार देता है।</p>
                `,
                english: `
                    <h2>6.1 The Autonomous QA Subagent</h2>
                    <p>Antigravity spawns dedicated Chromium subagents equipped with DOM inspection, synthetic user interactions, screenshot analysis, and session recording to ensure 100% test reliability.</p>
                `
            }
        },
        {
            id: 7,
            number: "07",
            title: {
                hinglish: "Chapter 7: Advanced Superpowers: Custom Skills, Rules aur MCP Servers",
                hindi: "अध्याय 7: कस्टम स्किल्स, रूल्स और मॉडल कॉन्टेक्स्ट प्रोटोकॉल (MCP)",
                english: "Chapter 7: Advanced Customizations: Skills, Rules & MCP Integration"
            },
            summary: {
                hinglish: "Apna khud ka Custom Skill kaise banayein, AGENTS.md rules kaise likhein aur MCP se third-party tools connect karein.",
                hindi: "कस्टम स्किल्स और रूल्स बनाकर एंटीग्रैविटी को अपनी कंपनी या पर्सनल स्टाइल के अनुसार ट्रेन करना।",
                english: "Extending agent capabilities with custom SKILL.md modules, behavioral rules, and Model Context Protocol servers."
            },
            content: {
                hinglish: `
                    <h2>7.1 Custom Skills Banana</h2>
                    <p>Aap <code>.agents/skills/my-skill/SKILL.md</code> file banakar Antigravity ko specific workflows sikha sakte hain. Jaise: <em>"Humari company me hamesha Tailwind v3 aur Supabase use hota hai"</em>.</p>

                    <h2>7.2 MCP (Model Context Protocol)</h2>
                    <p>MCP ke jariye Antigravity aapke Slack, GitHub, Figma, Notion ya custom SQL Database se directly baat kar sakta hai. Agent Figma design dekh kar seedha code generate kar sakta hai!</p>
                `,
                hindi: `
                    <h2>7.1 अपनी खुद की स्किल्स (Skills) जोड़ना</h2>
                    <p>आप एंटीग्रैविटी को अपनी पसंद के अनुसार नियम सिखा सकते हैं ताकि वह हमेशा आपकी पसंदीदा कोडिंग स्टाइल और लाइब्रेरी का ही इस्तेमाल करे।</p>
                `,
                english: `
                    <h2>7.1 Extensibility via Model Context Protocol</h2>
                    <p>Through MCP specifications, connect Antigravity to enterprise data lakes, Figma schemas, GitHub PR workflows, and cloud infrastructures seamlessly.</p>
                `
            }
        },
        {
            id: 8,
            number: "08",
            title: {
                hinglish: "Chapter 8: Freelancing, Agency Monetization & Top 10 Pro Secrets",
                hindi: "अध्याय 8: फ्रीलांसिंग, एजेंसी कमाई और टॉप 10 सीक्रेट्स",
                english: "Chapter 8: Monetization, Freelance Dominance & Pro Best Practices"
            },
            summary: {
                hinglish: "Upwork, Fiverr aur local clients ko 1 din me website deliver karke monthly ₹1L - ₹3L kaise kamayein.",
                hindi: "एंटीग्रैविटी की मदद से क्लाइंट्स को 24 घंटे में प्रोजेक्ट डिलीवर करके पैसे कमाने का पूरा रोडमैप।",
                english: "Commercializing autonomous development: Client delivery workflows, pricing, and operational security."
            },
            content: {
                hinglish: `
                    <h2>8.1 Antigravity se Paise Kamane ke 3 Sabse Bada Tarike</h2>
                    <ol>
                        <li><strong>1-Day Web Agency:</strong> Jo kaam traditional agencies 15 din me karti hain, aap Antigravity se 24 ghante me deliver karke premium price charge kar sakte hain.</li>
                        <li><strong>Micro-SaaS & Boilerplates:</strong> Useful micro-tools banakar Gumroad ya direct UPI payment link se bechein.</li>
                        <li><strong>Freelancing Arbitrage:</strong> Upwork aur Fiverr pe high-ticket projects bid karein aur agent ke through high-quality code likhwa kar deliver karein.</li>
                    </ol>

                    <h2>8.2 Golden Rules (Galtiyo se Bachein)</h2>
                    <ul>
                        <li>Kabhi bhi ek sath 10 alag-alag cheezein mat boliye. Pehle Core MVP banwayein, fir iterate karein.</li>
                        <li>Hamesha <code>/plan</code> ka use karein complex features ke liye.</li>
                        <li>Design aesthetic ke liye prompt me clear instructions dein (e.g. glassmorphism, fluid typography, dark mode).</li>
                    </ul>

                    <div class="callout-box success">
                        <strong>🎉 Mubarak ho!</strong> Ab aap Google Antigravity ke true master ban chuke hain. Apna pehla project aaj hi start karein!
                    </div>
                `,
                hindi: `
                    <h2>8.1 कमाई के 3 प्रमुख रास्ते</h2>
                    <ol>
                        <li><strong>24-घंटे वेब एजेंसी:</strong> क्लाइंट्स को रिकॉर्ड समय में प्रीमियम वेबसाइट्स बनाकर दें।</li>
                        <li><strong>माइक्रो-सास (Micro-SaaS):</strong> छोटे-छोटे टूल्स बनाकर उन्हें ऑनलाइन बेचें।</li>
                        <li><strong>फ्रीलांसिंग:</strong> अपवर्क और फाइवर पर इंटरनेशनल क्लाइंट्स के प्रोजेक्ट्स समय से पहले पूरे करें।</li>
                    </ol>
                `,
                english: `
                    <h2>8.1 Commercialization Strategy</h2>
                    <p>Autonomous development collapses time-to-market by 90%, creating massive margin advantages for freelancers, digital agencies, and independent software vendors.</p>
                `
            }
        }
,
        {
            id: 9,
            number: "09",
            title: {
                hinglish: "Chapter 9: Instagram, Social Media aur Freelancing se Kamaai",
                hindi: "अध्याय 9: इंस्टाग्राम, सोशल मीडिया और फ्रीलांसिंग से कमाई",
                english: "Chapter 9: Monetize via Instagram, Social Media & Freelancing"
            },
            summary: {
                hinglish: "Antigravity se banaye website/app ko Instagram aur Freelancing pe bechkar steady income — complete blueprint.",
                hindi: "एंटीग्रैविटी से बनाई वेबसाइट/ऐप को इंस्टाग्राम और फ्रीलांसिंग पर बेचकर नियमित आय का पूरा रोडमैप।",
                english: "A complete blueprint for generating sustainable income by selling AI-built websites via Instagram DMs, Fiverr, and Upwork."
            },
            content: {
                hinglish: `
                    <h2>9.1 Real Paisa Kamane Ka Blueprint</h2>
                    <p>Ab tak aapne seekha ki website/app banana kitna aasan hai. Ab seekhenge <strong>real money kaise generate karein</strong> — Instagram se leke Upwork tak.</p>

                    <div class="callout-box info">
                        <strong>💰 Real Numbers:</strong> Consistent practice se pehle mahine ₹20,000-₹80,000 aur 3 mahine baad ₹1,50,000+ monthly possible hai.
                    </div>

                    <h2>9.2 Method 1: Instagram Direct Sales (Sabse Tez)</h2>
                    <ol>
                        <li><strong>Portfolio Account Banao:</strong> Antigravity se banai websites ki screen recording reels post karo.</li>
                        <li><strong>Niche Target Karo:</strong> Restaurants, salons, doctors, coaches — sab ko website chahiye.</li>
                        <li><strong>DM Outreach:</strong> Roz 20-30 local businesses ko DM: "24 ghante me professional website sirf ₹5,000 me."</li>
                        <li><strong>Demo Dikhao:</strong> 15 minute me demo site banao — conversion 10x hota hai!</li>
                    </ol>

                    <pre><code># Restaurant Demo Prompt:
"Make a stunning dark-mode restaurant website for 'Spice Garden'
with menu, reservation form, gallery, WhatsApp chat button.
Use glassmorphism design with warm orange and gold colors."

# Salon Demo:
"Build a luxury salon website for 'Glamour Studio' with services,
price list, appointment booking, and Instagram feed section."</code></pre>

                    <h2>9.3 Method 2: Freelancing — Dollar Income</h2>

                    <div class="cmd-grid">
                        <div class="cmd-card">
                            <code>🌐 Fiverr.com</code>
                            <p>"I will build a stunning website in 24 hours" — $49-$299 per gig. 5-star reviews ke baad price badhate raho.</p>
                        </div>
                        <div class="cmd-card">
                            <code>💼 Upwork.com</code>
                            <p>"AI-assisted delivery in 24-48 hours" — Hourly $15-$40 se shuru. International clients from USA, UK, Australia.</p>
                        </div>
                        <div class="cmd-card">
                            <code>🔥 Freelancer.in</code>
                            <p>Indian clients ke liye — ₹5,000-₹50,000 per project. Tier-2/3 cities ke business owners perfect target hain.</p>
                        </div>
                        <div class="cmd-card">
                            <code>💼 LinkedIn B2B</code>
                            <p>Startups aur SMBs target karo — $300-$2000 per project. Professional network se referrals se growth hoti hai.</p>
                        </div>
                    </div>

                    <h2>9.4 Method 3: Digital Products — Passive Income</h2>
                    <ul>
                        <li><strong>Website Templates:</strong> Gumroad.com pe $15-$49 me becho — ek baar banao, baar baar biko!</li>
                        <li><strong>SaaS Micro-Tools:</strong> Invoice Generator, Appointment Scheduler — monthly subscription model.</li>
                        <li><strong>Chrome Extensions:</strong> Productivity tools $2-$5 me internationally becho.</li>
                        <li><strong>White-Label Agency:</strong> Packages banao — Starter ₹15K, Business ₹35K, Enterprise ₹75K.</li>
                    </ul>

                    <h2>9.5 Monthly Income Calculator</h2>
                    <div class="callout-box info">
                        <strong>📊 Realistic Monthly Income (Part-Time):</strong><br>
                        • 5 Local websites × ₹8,000 = ₹40,000<br>
                        • 2 Fiverr orders × $150 = ₹25,000<br>
                        • 3 Template sales × $29 = ₹7,000<br>
                        • 5 Maintenance clients × ₹2,500 = ₹12,500<br>
                        <strong style="color: #10b981; font-size: 1.1rem;">Total: ₹84,500/month — Part Time!</strong>
                    </div>

                    <h2>9.6 Instagram Viral Reel Ideas</h2>
                    <ul>
                        <li>📹 "15 minute me professional website" — screen recording reel</li>
                        <li>📹 "Client ne pehli bar website dekhi toh..." — reaction video</li>
                        <li>📹 "AI vs Traditional Developer — Cost Comparison"</li>
                        <li>📹 "Free AI tool jo website banata hai" — hook video for leads</li>
                    </ul>

                    <div class="callout-box success">
                        <strong>🎉 Action Plan — Aaj Se Shuru Karo:</strong><br>
                        1. Antigravity Install karo (Chapter 2 dekho)<br>
                        2. Instagram Portfolio Account banao<br>
                        3. 1 demo website banao aur post karo<br>
                        4. Apne sheher ke 10 local businesses ko DM karo<br>
                        5. Pehla client, pehli ₹5,000 — Start karo aaj!
                    </div>
                `,
                hindi: `
                    <h2>9.1 कमाई के तरीके</h2>
                    <p>रोज 20-30 local businesses को Instagram DM करें। 15 मिनट में demo website बनाएं और दिखाएं।</p>
                    <h2>9.2 Freelancing — Dollar Income</h2>
                    <ul>
                        <li>Fiverr: "24 hours website" — $49-$299 per project</li>
                        <li>Upwork: $15-$40/hr hourly rate</li>
                        <li>Freelancer.in: ₹5,000-₹50,000 per project</li>
                    </ul>
                    <div class="callout-box success">
                        <strong>🎉 Part-time करके भी ₹50,000-₹1,00,000/month संभव!</strong>
                    </div>
                `,
                english: `
                    <h2>9.1 Instagram Direct Sales</h2>
                    <p>DM 20-30 local businesses daily with a live demo. 15 minutes per demo using Antigravity dramatically improves conversion.</p>
                    <h2>9.2 Freelancing Platforms</h2>
                    <ul>
                        <li>Fiverr: "Premium website in 24 hours" — $49-$299</li>
                        <li>Upwork: $15-$40/hr, AI-assisted speed emphasis</li>
                        <li>LinkedIn B2B: $300-$2000 per project</li>
                    </ul>
                    <div class="callout-box success">
                        <strong>🚀 Monthly Projection: $500-$3,000 (₹40K-₹2.5L) within 3 months.</strong>
                    </div>
                `
            }
        }
    ]
};