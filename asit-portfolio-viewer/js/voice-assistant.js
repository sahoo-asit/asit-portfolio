// Voice-Enabled AI Assistant
// Uses Web Speech API for text-to-speech (no external API keys needed)
// Integrates with existing knowledgeBase from portfolio-assistant.js

(function() {
    'use strict';

    let isListening = false;
    let isSpeaking = false;
    let recognition = null;
    let synthesis = window.speechSynthesis;
    let assistantVisible = false;
    let selectedVoice = null;

    // Assistant knowledge (mirrors and extends knowledgeBase)
    const assistantData = {
        greetings: [
            "Hi! I'm Asit's AI assistant. I can tell you about his experience, skills, projects, and achievements. What would you like to know?",
            "Hello! Welcome to Asit Sahoo's portfolio. Ask me anything about his professional background!",
            "Hey there! I'm here to help you learn about Asit. He's a Senior Principal Software Engineer 1 at PubMatic with 9+ years of experience."
        ],
        topics: {
            introduction: {
                keywords: ["who", "about", "introduce", "tell me", "background", "overview", "yourself"],
                responses: [
                    "Asit Sahoo is a Senior Principal Software Engineer 1 at PubMatic with over 9 years of experience. He specializes in GenAI, automation framework design, backend API development, and RAG architecture. He's passionate about building AI-first engineering systems and intelligent automation frameworks."
                ]
            },
            experience: {
                keywords: ["experience", "work", "career", "company", "companies", "job", "role", "position", "worked"],
                responses: [
                    "Asit has worked at three major companies. Currently at PubMatic since November 2021, where he progressed from Principal SDET to Senior Principal Software Engineer 1. Before that, he was at Pegasystems from 2019 to 2021 as an SDET. He started his career at Tata Consultancy Services in 2016. At PubMatic, he designs backend APIs for the DSP layer, builds AI-powered tools, and leads automation initiatives."
                ]
            },
            skills: {
                keywords: ["skills", "technologies", "tech stack", "programming", "languages", "tools", "proficient"],
                responses: [
                    "Asit is highly skilled in Python at 95%, C# at 90%, Java at 85%, and JavaScript at 70%. He's expert in automation frameworks like Robot Framework, PyTest, Selenium, WebdriverIO, and Playwright. In AI and GenAI, he works with RAG, LangChain, LangGraph, Langfuse, MCP Server, and DeepEval. He also has strong DevOps skills with Jenkins, Git, Docker, and Kubernetes."
                ]
            },
            genai: {
                keywords: ["genai", "ai", "artificial intelligence", "machine learning", "llm", "rag", "langchain", "mcp", "deepeval", "agentic"],
                responses: [
                    "Asit is a GenAI specialist! He's built an enterprise AI-powered Slack chatbot using RAG, LangChain, and Langfuse that offloads 25 to 30 percent of daily operational workload. He designed an autonomous AI Release Management System with LangChain agents. He also created a DeepEval framework for evaluating LLM-based applications and agentic systems. His expertise includes MCP Server architecture, prompt engineering, and fine-tuning LLMs."
                ]
            },
            projects: {
                keywords: ["projects", "built", "created", "developed", "portfolio", "work samples"],
                responses: [
                    "Asit's notable projects include: An AI-Powered Slack Chatbot Platform using RAG and LangChain that handles 25 to 30 percent of daily workload. An Autonomous AI Release Management System with agents orchestrating the full release lifecycle. A Universal Test Case Generator integrating with Jira and Confluence. Contributions to Prebid.js open-source project for header bidding. And this interactive 3D portfolio website itself!"
                ]
            },
            awards: {
                keywords: ["awards", "recognition", "achievements", "won", "winner", "hackathon"],
                responses: [
                    "Asit has received impressive recognition! At PubMatic: 3 times Team Player Award, 2 times Biased Towards Action Award, Innovation Award, and 2024 and 2025 Hackathon Special Accolade Winner. At Pegasystems: Pega Excellence Award and Wow Award. At TCS: Excellent Performance and Commitment Award, Best Team Award, Zeta 2016 Winner, ILP Ideathon 2016 Winner, and ILP Kudos Award."
                ]
            },
            education: {
                keywords: ["education", "degree", "university", "college", "study", "qualification", "academic"],
                responses: [
                    "Asit holds a Bachelor of Technology in Electronics and Communication Engineering from ITER, SOA University in Bhubaneswar with a CGPA of 9.3. He graduated between 2012 and 2016."
                ]
            },
            contact: {
                keywords: ["contact", "reach", "email", "phone", "connect", "hire", "available"],
                responses: [
                    "You can reach Asit at email sahooasit@hotmail.com or phone +91 9040293063. He's based in Pune, India. You can also connect with him on LinkedIn at linkedin.com/in/sahooasit or check his GitHub at github.com/pm-asit-sahoo. Feel free to use the contact form on this page!"
                ]
            },
            pubmatic: {
                keywords: ["pubmatic", "current", "present", "dsp", "programmatic", "advertising"],
                responses: [
                    "At PubMatic, Asit is currently a Senior Principal Software Engineer 1 since March 2026. He designs Java-based backend APIs for the DSP layer in programmatic advertising. He works on MCP server architecture, PostgreSQL, and RabbitMQ-based messaging pipelines. Previously, he led a team of 3 SDETs and built the enterprise AI chatbot platform."
                ]
            },
            automation: {
                keywords: ["automation", "framework", "testing", "test", "selenium", "pytest", "robot", "webdriverio"],
                responses: [
                    "Asit is an automation expert! He's built comprehensive frameworks using PyTest, Robot Framework, Selenium, WebdriverIO, and Playwright. He reduced test execution time for 2000+ test cases from 6 hours to just 1 hour — an 83% improvement! He also designed the DeepEval framework for evaluating AI systems and wrote test cases for agentic frameworks."
                ]
            },
            why_hire: {
                keywords: ["why hire", "hire", "strengths", "unique", "value", "different", "special"],
                responses: [
                    "Asit brings a rare combination of skills: deep automation expertise plus cutting-edge AI implementation. He's a pioneer in applying RAG architecture to quality engineering. He's reduced testing time by 60%, increased defect detection by 35%, and built AI systems that offload 25-30% of daily workload. He's also an active open-source contributor to Prebid.js and a hackathon winner. His blend of backend engineering, GenAI, and automation makes him uniquely valuable."
                ]
            }
        },
        fallback: "I'm not sure about that specific topic. But I can tell you about Asit's experience, skills, projects, awards, education, or how to contact him. What interests you?"
    };

    function createAssistantUI() {
        // Floating assistant button
        const assistantBtn = document.createElement('div');
        assistantBtn.id = 'voice-assistant-btn';
        assistantBtn.innerHTML = `
            <div class="voice-btn-inner">
                <i class="fas fa-microphone"></i>
            </div>
            <div class="voice-btn-ripple"></div>
        `;
        document.body.appendChild(assistantBtn);

        // Assistant panel
        const panel = document.createElement('div');
        panel.id = 'voice-assistant-panel';
        panel.innerHTML = `
            <div class="va-header">
                <div class="va-avatar">
                    <div class="va-avatar-ring"></div>
                    <i class="fas fa-robot"></i>
                </div>
                <div class="va-title">
                    <h3>Asit's AI Assistant</h3>
                    <span class="va-status" id="va-status">Ready to chat</span>
                </div>
                <button class="va-close" id="va-close">&times;</button>
            </div>
            <div class="va-messages" id="va-messages">
                <div class="va-msg va-bot">
                    <div class="va-msg-content">
                        Hi! I'm Asit's AI assistant. Ask me anything about his experience, skills, or projects. You can type or click the microphone to speak! 🎤
                    </div>
                </div>
            </div>
            <div class="va-input-area">
                <input type="text" id="va-input" placeholder="Ask about Asit..." autocomplete="off">
                <button id="va-mic-btn" class="va-mic" title="Speak">
                    <i class="fas fa-microphone"></i>
                </button>
                <button id="va-send-btn" class="va-send" title="Send">
                    <i class="fas fa-paper-plane"></i>
                </button>
                <button id="va-mute-btn" class="va-mute" title="Toggle Voice">
                    <i class="fas fa-volume-up"></i>
                </button>
            </div>
            <div class="va-suggestions" id="va-suggestions">
                <button class="va-chip" data-query="Who is Asit?">Who is Asit?</button>
                <button class="va-chip" data-query="What are his skills?">Skills</button>
                <button class="va-chip" data-query="Tell me about his GenAI work">GenAI</button>
                <button class="va-chip" data-query="What projects has he built?">Projects</button>
                <button class="va-chip" data-query="Awards and achievements">Awards</button>
                <button class="va-chip" data-query="Why should I hire Asit?">Why hire?</button>
            </div>
        `;
        document.body.appendChild(panel);

        // Event listeners
        assistantBtn.addEventListener('click', togglePanel);
        document.getElementById('va-close').addEventListener('click', togglePanel);
        document.getElementById('va-send-btn').addEventListener('click', sendMessage);
        document.getElementById('va-mic-btn').addEventListener('click', toggleListening);
        document.getElementById('va-mute-btn').addEventListener('click', toggleMute);
        
        document.getElementById('va-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        // Suggestion chips
        document.querySelectorAll('.va-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                document.getElementById('va-input').value = chip.dataset.query;
                sendMessage();
            });
        });

        // Initialize speech recognition
        initSpeechRecognition();

        // Load preferred voice
        loadVoice();
    }

    function togglePanel() {
        const panel = document.getElementById('voice-assistant-panel');
        const btn = document.getElementById('voice-assistant-btn');
        assistantVisible = !assistantVisible;
        
        if (assistantVisible) {
            panel.classList.add('va-visible');
            btn.classList.add('va-btn-hidden');
        } else {
            panel.classList.remove('va-visible');
            btn.classList.remove('va-btn-hidden');
            if (isSpeaking) synthesis.cancel();
        }
    }

    function sendMessage() {
        const input = document.getElementById('va-input');
        const text = input.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        input.value = '';

        // Show typing indicator
        showTyping();

        setTimeout(() => {
            removeTyping();
            const response = getResponse(text);
            addMessage(response, 'bot');
            speak(response);
        }, 600 + Math.random() * 400);
    }

    function addMessage(text, sender) {
        const messages = document.getElementById('va-messages');
        const msg = document.createElement('div');
        msg.className = `va-msg va-${sender}`;
        msg.innerHTML = `<div class="va-msg-content">${text}</div>`;
        messages.appendChild(msg);
        messages.scrollTop = messages.scrollHeight;
    }

    function showTyping() {
        const messages = document.getElementById('va-messages');
        const typing = document.createElement('div');
        typing.className = 'va-msg va-bot va-typing-indicator';
        typing.innerHTML = `
            <div class="va-msg-content">
                <div class="va-typing">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        messages.appendChild(typing);
        messages.scrollTop = messages.scrollHeight;
    }

    function removeTyping() {
        const typing = document.querySelector('.va-typing-indicator');
        if (typing) typing.remove();
    }

    function getResponse(query) {
        const lower = query.toLowerCase();

        // Check greetings
        if (/^(hi|hello|hey|greetings|howdy|sup)/i.test(lower)) {
            return assistantData.greetings[Math.floor(Math.random() * assistantData.greetings.length)];
        }

        // Check thanks
        if (/^(thanks|thank you|thx|cheers)/i.test(lower)) {
            return "You're welcome! Is there anything else you'd like to know about Asit?";
        }

        // Match topics by keywords
        let bestMatch = null;
        let bestScore = 0;

        for (const [topic, data] of Object.entries(assistantData.topics)) {
            let score = 0;
            data.keywords.forEach(keyword => {
                if (lower.includes(keyword)) {
                    score += keyword.split(' ').length; // Multi-word matches score higher
                }
            });
            if (score > bestScore) {
                bestScore = score;
                bestMatch = data;
            }
        }

        if (bestMatch && bestScore > 0) {
            return bestMatch.responses[Math.floor(Math.random() * bestMatch.responses.length)];
        }

        // Try the existing getBotResponse if available
        if (typeof getBotResponse === 'function') {
            const existingResponse = getBotResponse(query);
            if (existingResponse) return existingResponse;
        }

        return assistantData.fallback;
    }

    let voiceMuted = false;

    function speak(text) {
        if (voiceMuted || !synthesis) return;
        
        synthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        utterance.onstart = () => {
            isSpeaking = true;
            updateStatus('Speaking...');
            document.getElementById('voice-assistant-btn')?.querySelector('.voice-btn-inner')?.classList.add('speaking');
        };
        utterance.onend = () => {
            isSpeaking = false;
            updateStatus('Ready to chat');
            document.getElementById('voice-assistant-btn')?.querySelector('.voice-btn-inner')?.classList.remove('speaking');
        };

        synthesis.speak(utterance);
    }

    function loadVoice() {
        function setVoice() {
            const voices = synthesis.getVoices();
            // Prefer natural-sounding English voices
            selectedVoice = voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) 
                || voices.find(v => v.name.includes('Samantha'))
                || voices.find(v => v.lang.startsWith('en') && v.localService)
                || voices.find(v => v.lang.startsWith('en'))
                || voices[0];
        }
        
        if (synthesis.getVoices().length) {
            setVoice();
        } else {
            synthesis.onvoiceschanged = setVoice;
        }
    }

    function toggleMute() {
        voiceMuted = !voiceMuted;
        const icon = document.querySelector('#va-mute-btn i');
        icon.className = voiceMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
        if (voiceMuted && isSpeaking) synthesis.cancel();
    }

    function initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            document.getElementById('va-input').value = transcript;
            sendMessage();
        };

        recognition.onstart = () => {
            isListening = true;
            updateStatus('Listening...');
            document.getElementById('va-mic-btn').classList.add('listening');
        };

        recognition.onend = () => {
            isListening = false;
            updateStatus('Ready to chat');
            document.getElementById('va-mic-btn').classList.remove('listening');
        };

        recognition.onerror = () => {
            isListening = false;
            updateStatus('Ready to chat');
            document.getElementById('va-mic-btn').classList.remove('listening');
        };
    }

    function toggleListening() {
        if (!recognition) {
            addMessage("Speech recognition is not supported in your browser. Please type your question instead.", 'bot');
            return;
        }
        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
        }
    }

    function updateStatus(text) {
        const status = document.getElementById('va-status');
        if (status) status.textContent = text;
    }

    // Inject styles
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Voice Assistant Button */
            #voice-assistant-btn {
                position: fixed; bottom: 100px; right: 30px; z-index: 9998;
                width: 60px; height: 60px; cursor: pointer;
                transition: all 0.3s ease;
            }
            #voice-assistant-btn.va-btn-hidden { opacity: 0; pointer-events: none; transform: scale(0.5); }
            .voice-btn-inner {
                width: 60px; height: 60px; border-radius: 50%;
                background: linear-gradient(135deg, #667eea, #764ba2);
                display: flex; align-items: center; justify-content: center;
                color: white; font-size: 22px;
                box-shadow: 0 8px 30px rgba(102, 126, 234, 0.5);
                transition: all 0.3s ease;
                animation: voiceBtnFloat 3s ease-in-out infinite;
            }
            .voice-btn-inner:hover { transform: scale(1.1); box-shadow: 0 12px 40px rgba(102, 126, 234, 0.7); }
            .voice-btn-inner.speaking { animation: voicePulse 1s ease-in-out infinite; }
            .voice-btn-ripple {
                position: absolute; top: 0; left: 0; width: 60px; height: 60px;
                border-radius: 50%; border: 2px solid rgba(102, 126, 234, 0.4);
                animation: ripple 2s infinite;
            }
            @keyframes ripple { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(2); opacity: 0; } }
            @keyframes voiceBtnFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
            @keyframes voicePulse { 0%,100% { box-shadow: 0 0 0 0 rgba(102,126,234,0.4); } 50% { box-shadow: 0 0 0 20px rgba(102,126,234,0); } }

            /* Voice Assistant Panel */
            #voice-assistant-panel {
                position: fixed; bottom: 30px; right: 30px; z-index: 9999;
                width: 400px; max-width: calc(100vw - 40px); height: 550px; max-height: 80vh;
                background: rgba(255,255,255,0.95); backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border-radius: 24px; box-shadow: 0 25px 80px rgba(0,0,0,0.2);
                display: flex; flex-direction: column;
                opacity: 0; transform: translateY(20px) scale(0.95);
                pointer-events: none;
                transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                border: 1px solid rgba(255,255,255,0.3);
                overflow: hidden;
            }
            #voice-assistant-panel.va-visible {
                opacity: 1; transform: translateY(0) scale(1); pointer-events: all;
            }

            /* Header */
            .va-header {
                display: flex; align-items: center; padding: 16px 20px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white; position: relative;
            }
            .va-avatar {
                width: 45px; height: 45px; border-radius: 50%;
                background: rgba(255,255,255,0.2); display: flex;
                align-items: center; justify-content: center;
                font-size: 20px; margin-right: 12px; position: relative;
            }
            .va-avatar-ring {
                position: absolute; inset: -3px; border-radius: 50%;
                border: 2px solid rgba(255,255,255,0.4);
                animation: ringPulse 2s infinite;
            }
            @keyframes ringPulse { 0%,100% { transform: scale(1); opacity:1; } 50% { transform: scale(1.15); opacity:0.5; } }
            .va-title h3 { margin: 0; font-size: 16px; font-weight: 600; }
            .va-status { font-size: 12px; opacity: 0.8; }
            .va-close {
                position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
                background: none; border: none; color: white; font-size: 24px;
                cursor: pointer; opacity: 0.8; transition: opacity 0.2s;
            }
            .va-close:hover { opacity: 1; }

            /* Messages */
            .va-messages {
                flex: 1; overflow-y: auto; padding: 16px;
                display: flex; flex-direction: column; gap: 10px;
            }
            .va-msg { max-width: 85%; animation: msgIn 0.3s ease; }
            .va-bot { align-self: flex-start; }
            .va-user { align-self: flex-end; }
            .va-msg-content {
                padding: 10px 16px; border-radius: 18px;
                font-size: 14px; line-height: 1.5;
            }
            .va-bot .va-msg-content {
                background: #f0f0f5; color: #333; border-bottom-left-radius: 6px;
            }
            .va-user .va-msg-content {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white; border-bottom-right-radius: 6px;
            }
            @keyframes msgIn { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: translateY(0); } }

            /* Typing indicator */
            .va-typing { display: flex; gap: 4px; padding: 4px 0; }
            .va-typing span {
                width: 8px; height: 8px; border-radius: 50%;
                background: #667eea; animation: typingDot 1.4s infinite;
            }
            .va-typing span:nth-child(2) { animation-delay: 0.2s; }
            .va-typing span:nth-child(3) { animation-delay: 0.4s; }
            @keyframes typingDot { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-8px); } }

            /* Input */
            .va-input-area {
                display: flex; align-items: center; padding: 12px 16px;
                border-top: 1px solid #eee; gap: 8px;
            }
            #va-input {
                flex: 1; padding: 10px 16px; border: 2px solid #e5e7eb;
                border-radius: 24px; font-size: 14px; font-family: inherit;
                transition: border-color 0.3s;
            }
            #va-input:focus { border-color: #667eea; outline: none; box-shadow: 0 0 0 3px rgba(102,126,234,0.1); }
            .va-mic, .va-send, .va-mute {
                width: 38px; height: 38px; border-radius: 50%;
                border: none; cursor: pointer; display: flex;
                align-items: center; justify-content: center;
                font-size: 14px; transition: all 0.2s;
            }
            .va-mic { background: #f0f0f5; color: #667eea; }
            .va-mic.listening { background: #ef4444; color: white; animation: voicePulse 1s infinite; }
            .va-send { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
            .va-send:hover { transform: scale(1.1); }
            .va-mute { background: #f0f0f5; color: #667eea; }

            /* Suggestions */
            .va-suggestions {
                display: flex; flex-wrap: wrap; gap: 6px;
                padding: 8px 16px 14px; border-top: 1px solid #f0f0f5;
            }
            .va-chip {
                padding: 6px 14px; border-radius: 20px;
                border: 1px solid #e5e7eb; background: white;
                font-size: 12px; cursor: pointer; font-family: inherit;
                color: #667eea; transition: all 0.2s;
            }
            .va-chip:hover {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white; border-color: transparent;
                transform: translateY(-2px);
            }

            /* Responsive */
            @media (max-width: 480px) {
                #voice-assistant-panel { width: calc(100vw - 20px); right: 10px; bottom: 10px; height: 70vh; }
                #voice-assistant-btn { bottom: 80px; right: 20px; }
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize
    function init() {
        injectStyles();
        createAssistantUI();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
