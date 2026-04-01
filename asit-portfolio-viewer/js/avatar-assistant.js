// 3D Animated Avatar Assistant
// A cartoon-style 3D character that represents Asit and talks with lip-sync

(function() {
    'use strict';

    let avatarScene, avatarCamera, avatarRenderer;
    let avatar, head, leftEye, rightEye, mouth, leftPupil, rightPupil;
    let leftArm, rightArm, body, leftEar, rightEar;
    let isTalking = false;
    let blinkInterval;
    let currentUtterance = null;
    let avatarVisible = false;

    // Avatar colors - professional tech look
    const colors = {
        skin: 0xf5d0c5,
        hair: 0x1a1a2e,
        shirt: 0x667eea,
        eyes: 0xffffff,
        pupils: 0x2d3436,
        mouth: 0xc0392b,
        glasses: 0x2d3436
    };

    // Knowledge base for avatar responses
    const avatarKnowledge = {
        greetings: [
            "Hey there! I'm Asit's digital avatar. I'm a Senior Principal Software Engineer at PubMatic with 9+ years of experience. What would you like to know about me?",
            "Hello! Welcome to my portfolio! I'm Asit - I specialize in GenAI, automation, and building intelligent systems. Ask me anything!",
            "Hi! Great to meet you! I'm the virtual Asit. I love talking about AI, automation frameworks, and cool tech projects!"
        ],
        experience: "I've been in the tech industry for over 9 years! Started at TCS in 2016, moved to Pegasystems in 2019, and joined PubMatic in 2021. Now I'm a Senior Principal Software Engineer 1, working on backend APIs, GenAI solutions, and leading automation initiatives. It's been an amazing journey!",
        skills: "My core skills? Python is my go-to at 95% proficiency, followed by C# at 90% and Java at 85%. I'm really passionate about GenAI - I work with RAG, LangChain, LangGraph, MCP Server, and DeepEval. For automation, I use PyTest, Robot Framework, Selenium, and WebdriverIO. I also do a lot of DevOps with Jenkins and Docker!",
        genai: "GenAI is my passion! I've built an enterprise AI chatbot using RAG and LangChain that handles 25-30% of daily workload at PubMatic. I also created an autonomous AI Release Management System where agents manage the entire release lifecycle. Plus, I designed the DeepEval framework for evaluating LLM applications. It's exciting stuff!",
        projects: "Let me tell you about my coolest projects! First, there's the AI-Powered Slack Chatbot that uses RAG architecture. Then the Autonomous Release Management System with LangChain agents. I also built a Universal Test Case Generator that integrates with Jira and Confluence. And I contribute to Prebid.js open source project for header bidding!",
        awards: "I'm proud of my achievements! At PubMatic, I've won the Team Player Award 3 times, Biased Towards Action Award twice, and the Innovation Award. I also won Special Accolades at the 2024 and 2025 Hackathons! At Pegasystems, I got the Excellence and Wow Awards. And at TCS, I won the Zeta 2016 competition and ILP Ideathon!",
        education: "I graduated from ITER, SOA University in Bhubaneswar with a B.Tech in Electronics and Communication Engineering. I had a CGPA of 9.3 - pretty proud of that! I graduated in 2016 and immediately jumped into the tech world.",
        contact: "Want to connect? You can email me at sahooasit@hotmail.com or call me at +91 9040293063. I'm based in Pune, India. You can also find me on LinkedIn at linkedin.com/in/sahooasit. I'd love to hear from you!",
        whyHire: "Why should you hire me? I bring a unique combination - deep automation expertise plus cutting-edge AI implementation. I've reduced testing time by 83%, built AI systems that offload 25-30% of daily workload, and I'm an active open-source contributor. Plus, I'm a hackathon winner and love solving complex problems!",
        hobbies: "When I'm not coding, I love exploring new AI technologies and building POCs. I'm a bit of a tech enthusiast - always experimenting with the latest frameworks. I also enjoy mentoring junior developers and sharing knowledge with the community!",
        fallback: "Hmm, I'm not sure about that specific topic. But I can tell you about my experience, skills, GenAI projects, awards, or how to contact me. What interests you?"
    };

    function createAvatarUI() {
        // Avatar container
        const container = document.createElement('div');
        container.id = 'avatar-container';
        container.innerHTML = `
            <div id="avatar-panel" class="avatar-panel">
                <div id="avatar-canvas-wrapper">
                    <div id="avatar-3d-canvas"></div>
                    <div id="avatar-name-tag">
                        <span class="avatar-name">Asit Sahoo</span>
                        <span class="avatar-title">Senior Principal SWE 1</span>
                    </div>
                </div>
                <div id="avatar-speech-bubble" class="avatar-bubble hidden">
                    <p id="avatar-speech-text"></p>
                </div>
                <div id="avatar-controls">
                    <input type="text" id="avatar-input" placeholder="Ask me anything..." autocomplete="off">
                    <button id="avatar-mic-btn" title="Speak to me">
                        <i class="fas fa-microphone"></i>
                    </button>
                    <button id="avatar-send-btn" title="Send">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
                <div id="avatar-quick-btns">
                    <button class="avatar-chip" data-query="Tell me about yourself">About Me</button>
                    <button class="avatar-chip" data-query="What are your skills?">Skills</button>
                    <button class="avatar-chip" data-query="Tell me about your GenAI work">GenAI</button>
                    <button class="avatar-chip" data-query="What awards have you won?">Awards</button>
                </div>
            </div>
            <button id="avatar-toggle-btn">
                <div class="avatar-btn-face">
                    <div class="mini-avatar-head"></div>
                </div>
                <span class="avatar-btn-label">Talk to Asit</span>
            </button>
        `;
        document.body.appendChild(container);

        // Event listeners
        document.getElementById('avatar-toggle-btn').addEventListener('click', toggleAvatar);
        document.getElementById('avatar-send-btn').addEventListener('click', sendAvatarMessage);
        document.getElementById('avatar-mic-btn').addEventListener('click', startVoiceInput);
        document.getElementById('avatar-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendAvatarMessage();
        });

        // Quick buttons
        document.querySelectorAll('.avatar-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                document.getElementById('avatar-input').value = chip.dataset.query;
                sendAvatarMessage();
            });
        });

        // Initialize 3D avatar
        init3DAvatar();
        
        // Start blinking
        startBlinking();

        // Auto-greet after delay
        setTimeout(() => {
            if (!avatarVisible) {
                pulseAvatarButton();
            }
        }, 3000);
    }

    function init3DAvatar() {
        const canvasContainer = document.getElementById('avatar-3d-canvas');
        
        avatarScene = new THREE.Scene();
        avatarScene.background = null;

        avatarCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
        avatarCamera.position.set(0, 0.15, 4.2);

        avatarRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        avatarRenderer.setSize(220, 220);
        avatarRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        avatarRenderer.setClearColor(0x000000, 0);
        canvasContainer.appendChild(avatarRenderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
        avatarScene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.1);
        directionalLight.position.set(2, 2, 4);
        avatarScene.add(directionalLight);

        const rimLight = new THREE.DirectionalLight(0x667eea, 0.55);
        rimLight.position.set(-2, 1, -2);
        avatarScene.add(rimLight);

        // Create avatar group
        avatar = new THREE.Group();
        avatarScene.add(avatar);

        createAvatarBody();
        
        animateAvatar();
    }

    function createAvatarBody() {
        // Head - slightly oval
        const headGeometry = new THREE.SphereGeometry(1, 32, 32);
        headGeometry.scale(1, 1.1, 1);
        const headMaterial = new THREE.MeshToonMaterial({ color: colors.skin });
        head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 0.5;
        avatar.add(head);

        // Hair - stylized
        const hairGeometry = new THREE.SphereGeometry(1.05, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
        const hairMaterial = new THREE.MeshToonMaterial({ color: colors.hair });
        const hair = new THREE.Mesh(hairGeometry, hairMaterial);
        hair.position.y = 0.6;
        hair.scale.set(1, 0.9, 1);
        avatar.add(hair);

        // Side hair
        const sideHairGeo = new THREE.BoxGeometry(0.3, 0.5, 0.3);
        const leftSideHair = new THREE.Mesh(sideHairGeo, hairMaterial);
        leftSideHair.position.set(-0.9, 0.7, 0);
        avatar.add(leftSideHair);
        
        const rightSideHair = new THREE.Mesh(sideHairGeo, hairMaterial);
        rightSideHair.position.set(0.9, 0.7, 0);
        avatar.add(rightSideHair);

        // Eyes - white part
        const eyeGeometry = new THREE.SphereGeometry(0.22, 16, 16);
        const eyeMaterial = new THREE.MeshToonMaterial({ color: colors.eyes });
        
        leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.35, 0.65, 0.85);
        avatar.add(leftEye);

        rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.35, 0.65, 0.85);
        avatar.add(rightEye);

        // Pupils
        const pupilGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const pupilMaterial = new THREE.MeshToonMaterial({ color: colors.pupils });
        
        leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        leftPupil.position.set(-0.35, 0.65, 1.0);
        avatar.add(leftPupil);

        rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        rightPupil.position.set(0.35, 0.65, 1.0);
        avatar.add(rightPupil);

        // Glasses
        const glassesFrameMaterial = new THREE.MeshToonMaterial({ color: colors.glasses });
        
        // Left lens frame
        const lensFrameGeo = new THREE.TorusGeometry(0.28, 0.03, 8, 32);
        const leftLensFrame = new THREE.Mesh(lensFrameGeo, glassesFrameMaterial);
        leftLensFrame.position.set(-0.35, 0.65, 0.95);
        avatar.add(leftLensFrame);

        const rightLensFrame = new THREE.Mesh(lensFrameGeo, glassesFrameMaterial);
        rightLensFrame.position.set(0.35, 0.65, 0.95);
        avatar.add(rightLensFrame);

        // Bridge
        const bridgeGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.25, 8);
        const bridge = new THREE.Mesh(bridgeGeo, glassesFrameMaterial);
        bridge.rotation.z = Math.PI / 2;
        bridge.position.set(0, 0.65, 0.95);
        avatar.add(bridge);

        // Nose
        const noseGeometry = new THREE.ConeGeometry(0.12, 0.3, 8);
        const noseMaterial = new THREE.MeshToonMaterial({ color: colors.skin });
        const nose = new THREE.Mesh(noseGeometry, noseMaterial);
        nose.rotation.x = Math.PI / 2;
        nose.position.set(0, 0.4, 1.0);
        avatar.add(nose);

        // Mouth
        const mouthGeometry = new THREE.TorusGeometry(0.15, 0.05, 8, 16, Math.PI);
        const mouthMaterial = new THREE.MeshToonMaterial({ color: colors.mouth });
        mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
        mouth.rotation.x = Math.PI;
        mouth.position.set(0, 0.15, 0.9);
        avatar.add(mouth);

        // Ears
        const earGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        const earMaterial = new THREE.MeshToonMaterial({ color: colors.skin });
        
        leftEar = new THREE.Mesh(earGeometry, earMaterial);
        leftEar.position.set(-1.0, 0.5, 0);
        leftEar.scale.set(0.5, 1, 0.5);
        avatar.add(leftEar);

        rightEar = new THREE.Mesh(earGeometry, earMaterial);
        rightEar.position.set(1.0, 0.5, 0);
        rightEar.scale.set(0.5, 1, 0.5);
        avatar.add(rightEar);

        // Neck
        const neckGeometry = new THREE.CylinderGeometry(0.3, 0.35, 0.4, 16);
        const neckMaterial = new THREE.MeshToonMaterial({ color: colors.skin });
        const neck = new THREE.Mesh(neckGeometry, neckMaterial);
        neck.position.y = -0.7;
        avatar.add(neck);

        // Body/Shirt
        const bodyGeometry = new THREE.CylinderGeometry(0.6, 0.8, 1.2, 16);
        const bodyMaterial = new THREE.MeshToonMaterial({ color: colors.shirt });
        body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = -1.5;
        avatar.add(body);

        // Collar
        const collarGeometry = new THREE.TorusGeometry(0.35, 0.08, 8, 16, Math.PI);
        const collarMaterial = new THREE.MeshToonMaterial({ color: 0xffffff });
        const collar = new THREE.Mesh(collarGeometry, collarMaterial);
        collar.rotation.x = Math.PI / 2;
        collar.position.set(0, -0.9, 0.2);
        avatar.add(collar);

        // Arms
        const armGeometry = new THREE.CylinderGeometry(0.14, 0.16, 0.8, 16);
        const armMaterial = new THREE.MeshToonMaterial({ color: colors.shirt });
        
        leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-0.85, -1.3, 0);
        leftArm.rotation.z = 0.3;
        avatar.add(leftArm);

        rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(0.85, -1.3, 0);
        rightArm.rotation.z = -0.3;
        avatar.add(rightArm);

        // Position avatar
        avatar.position.y = -0.05;
        avatar.scale.set(1.05, 1.05, 1.05);
    }

    function animateAvatar() {
        requestAnimationFrame(animateAvatar);

        const time = Date.now() * 0.001;

        // Idle animation - subtle breathing/bobbing
        if (avatar) {
            avatar.position.y = -0.05 + Math.sin(time * 2) * 0.03;
            avatar.rotation.y = Math.sin(time * 0.5) * 0.1;
        }

        // Talking animation
        if (isTalking && mouth) {
            mouth.scale.y = 1 + Math.sin(time * 20) * 0.5;
            mouth.scale.x = 1 + Math.cos(time * 15) * 0.2;
            
            // Head nods while talking
            if (head) {
                head.rotation.x = Math.sin(time * 3) * 0.05;
                head.rotation.z = Math.sin(time * 2) * 0.03;
            }

            // Arm gestures while talking
            if (leftArm && rightArm) {
                leftArm.rotation.z = 0.3 + Math.sin(time * 4) * 0.15;
                rightArm.rotation.z = -0.3 + Math.cos(time * 4) * 0.15;
            }
        } else {
            if (mouth) {
                mouth.scale.y = 1;
                mouth.scale.x = 1;
            }
            if (head) {
                head.rotation.x = 0;
                head.rotation.z = 0;
            }
        }

        // Eye tracking (follow mouse slightly)
        if (leftPupil && rightPupil) {
            const targetX = (mouseX || 0) * 0.05;
            const targetY = (mouseY || 0) * 0.03;
            leftPupil.position.x = -0.35 + targetX;
            leftPupil.position.y = 0.65 + targetY;
            rightPupil.position.x = 0.35 + targetX;
            rightPupil.position.y = 0.65 + targetY;
        }

        avatarRenderer.render(avatarScene, avatarCamera);
    }

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    function startBlinking() {
        blinkInterval = setInterval(() => {
            if (leftEye && rightEye) {
                // Blink
                leftEye.scale.y = 0.1;
                rightEye.scale.y = 0.1;
                leftPupil.visible = false;
                rightPupil.visible = false;

                setTimeout(() => {
                    leftEye.scale.y = 1;
                    rightEye.scale.y = 1;
                    leftPupil.visible = true;
                    rightPupil.visible = true;
                }, 150);
            }
        }, 3000 + Math.random() * 2000);
    }

    function toggleAvatar() {
        const panel = document.getElementById('avatar-panel');
        const btn = document.getElementById('avatar-toggle-btn');
        avatarVisible = !avatarVisible;

        if (avatarVisible) {
            panel.classList.add('avatar-visible');
            btn.classList.add('avatar-btn-hidden');
            
            // Greet on first open
            setTimeout(() => {
                const greeting = avatarKnowledge.greetings[Math.floor(Math.random() * avatarKnowledge.greetings.length)];
                showAvatarResponse(greeting);
            }, 500);
        } else {
            panel.classList.remove('avatar-visible');
            btn.classList.remove('avatar-btn-hidden');
            stopSpeaking();
        }
    }

    function sendAvatarMessage() {
        const input = document.getElementById('avatar-input');
        const text = input.value.trim();
        if (!text) return;

        input.value = '';
        const response = getAvatarResponse(text);
        showAvatarResponse(response);
    }

    function getAvatarResponse(query) {
        const lower = query.toLowerCase();

        if (/^(hi|hello|hey|greetings)/i.test(lower)) {
            return avatarKnowledge.greetings[Math.floor(Math.random() * avatarKnowledge.greetings.length)];
        }
        if (/experience|work|career|job|company/i.test(lower)) return avatarKnowledge.experience;
        if (/skill|tech|programming|language|tool/i.test(lower)) return avatarKnowledge.skills;
        if (/genai|ai|llm|rag|langchain|mcp|deepeval|agentic/i.test(lower)) return avatarKnowledge.genai;
        if (/project|built|created|portfolio/i.test(lower)) return avatarKnowledge.projects;
        if (/award|recognition|achievement|hackathon|won/i.test(lower)) return avatarKnowledge.awards;
        if (/education|degree|university|college|study/i.test(lower)) return avatarKnowledge.education;
        if (/contact|email|phone|reach|connect|hire/i.test(lower)) return avatarKnowledge.contact;
        if (/why.*hire|hire|strength|unique|value|special/i.test(lower)) return avatarKnowledge.whyHire;
        if (/hobby|hobbies|free time|interest/i.test(lower)) return avatarKnowledge.hobbies;
        if (/yourself|about|who|introduce|tell me/i.test(lower)) {
            return avatarKnowledge.greetings[Math.floor(Math.random() * avatarKnowledge.greetings.length)];
        }

        return avatarKnowledge.fallback;
    }

    function showAvatarResponse(text) {
        const bubble = document.getElementById('avatar-speech-bubble');
        const speechText = document.getElementById('avatar-speech-text');
        
        bubble.classList.remove('hidden');
        speechText.textContent = '';
        
        // Typewriter effect
        let i = 0;
        isTalking = true;
        
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                speechText.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 30);

        // Speak the text
        speakText(text);
    }

    function speakText(text) {
        if (!window.speechSynthesis) return;

        stopSpeaking();

        currentUtterance = new SpeechSynthesisUtterance(text);
        currentUtterance.rate = 1.0;
        currentUtterance.pitch = 1.0;
        currentUtterance.volume = 0.8;

        // Try to get a good voice
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.name.includes('Google') && v.lang.startsWith('en'))
            || voices.find(v => v.name.includes('Daniel'))
            || voices.find(v => v.lang.startsWith('en') && v.localService)
            || voices[0];
        
        if (preferredVoice) currentUtterance.voice = preferredVoice;

        currentUtterance.onstart = () => { isTalking = true; };
        currentUtterance.onend = () => { 
            isTalking = false;
            setTimeout(() => {
                document.getElementById('avatar-speech-bubble')?.classList.add('hidden');
            }, 2000);
        };

        speechSynthesis.speak(currentUtterance);
    }

    function stopSpeaking() {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
        isTalking = false;
    }

    // Voice input
    let recognition = null;
    function startVoiceInput() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            showAvatarResponse("Sorry, voice input isn't supported in your browser. Please type your question!");
            return;
        }

        if (!recognition) {
            recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('avatar-input').value = transcript;
                sendAvatarMessage();
            };

            recognition.onstart = () => {
                document.getElementById('avatar-mic-btn').classList.add('listening');
            };

            recognition.onend = () => {
                document.getElementById('avatar-mic-btn').classList.remove('listening');
            };
        }

        recognition.start();
    }

    function pulseAvatarButton() {
        const btn = document.getElementById('avatar-toggle-btn');
        btn.classList.add('avatar-btn-pulse');
        setTimeout(() => btn.classList.remove('avatar-btn-pulse'), 3000);
    }

    // Inject styles
    function injectAvatarStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Avatar Container */
            #avatar-container { position: fixed; bottom: 30px; left: 30px; z-index: 9999; font-family: 'Poppins', sans-serif; }

            /* Toggle Button */
            #avatar-toggle-btn {
                display: flex; align-items: center; gap: 10px;
                padding: 10px 20px 10px 10px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                border: none; border-radius: 50px; cursor: pointer;
                box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
                transition: all 0.3s ease;
                animation: avatarFloat 3s ease-in-out infinite;
            }
            #avatar-toggle-btn:hover { transform: scale(1.05); box-shadow: 0 12px 40px rgba(102, 126, 234, 0.6); }
            #avatar-toggle-btn.avatar-btn-hidden { opacity: 0; pointer-events: none; transform: scale(0.5); }
            #avatar-toggle-btn.avatar-btn-pulse { animation: avatarPulse 1s ease-in-out infinite; }
            
            .avatar-btn-face {
                width: 40px; height: 40px; border-radius: 50%;
                background: rgba(255,255,255,0.2); display: flex;
                align-items: center; justify-content: center;
            }
            .mini-avatar-head {
                width: 28px; height: 32px; border-radius: 50%;
                background: linear-gradient(180deg, #1a1a2e 50%, #f5d0c5 50%);
                position: relative;
            }
            .mini-avatar-head::before {
                content: ''; position: absolute;
                bottom: 8px; left: 50%; transform: translateX(-50%);
                width: 16px; height: 4px; background: #c0392b;
                border-radius: 0 0 8px 8px;
            }
            .avatar-btn-label { color: white; font-weight: 600; font-size: 14px; }

            @keyframes avatarFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
            @keyframes avatarPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(102,126,234,0.4); } 50% { box-shadow: 0 0 0 15px rgba(102,126,234,0); } }

            /* Avatar Panel */
            .avatar-panel {
                position: absolute; bottom: 60px; left: 0;
                width: 340px; background: rgba(255,255,255,0.94);
                backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
                border-radius: 24px; box-shadow: 0 25px 80px rgba(0,0,0,0.2);
                padding: 18px; opacity: 0; transform: translateY(20px) scale(0.9);
                pointer-events: none; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                border: 1px solid rgba(255,255,255,0.45);
            }
            .avatar-panel.avatar-visible {
                opacity: 1; transform: translateY(0) scale(1); pointer-events: all;
            }

            /* 3D Canvas */
            #avatar-canvas-wrapper {
                position: relative; width: 220px; height: 220px;
                margin: 0 auto 18px; border-radius: 28px;
                background: radial-gradient(circle at top, rgba(255,255,255,0.95), rgba(224,229,236,0.85) 58%, rgba(215,223,235,0.9));
                box-shadow: inset 0 10px 30px rgba(255,255,255,0.55), 0 18px 40px rgba(102,126,234,0.12);
                overflow: hidden;
            }
            #avatar-canvas-wrapper::before {
                content: ''; position: absolute; inset: 18px;
                border-radius: 24px;
                background: radial-gradient(circle, rgba(102,126,234,0.12), transparent 68%);
                filter: blur(8px);
                pointer-events: none;
            }
            #avatar-3d-canvas { width: 100%; height: 100%; position: relative; z-index: 2; }
            #avatar-3d-canvas canvas { border-radius: 28px; }

            #avatar-name-tag {
                position: absolute; bottom: 14px; left: 50%; z-index: 3;
                transform: translateX(-50%); background: linear-gradient(135deg, rgba(102,126,234,0.95), rgba(118,75,162,0.92));
                padding: 8px 18px; border-radius: 18px; text-align: center;
                box-shadow: 0 10px 24px rgba(102,126,234,0.28);
                min-width: 170px;
            }
            .avatar-name { display: block; color: white; font-weight: 700; font-size: 13px; }
            .avatar-title { display: block; color: rgba(255,255,255,0.9); font-size: 11px; line-height: 1.35; }

            /* Speech Bubble */
            .avatar-bubble {
                background: #f0f0f5; border-radius: 18px; padding: 12px 16px;
                margin-bottom: 15px; position: relative;
                max-height: 150px; overflow-y: auto;
            }
            .avatar-bubble.hidden { display: none; }
            .avatar-bubble::before {
                content: ''; position: absolute; top: -8px; left: 30px;
                border-left: 8px solid transparent; border-right: 8px solid transparent;
                border-bottom: 8px solid #f0f0f5;
            }
            #avatar-speech-text { font-size: 13px; line-height: 1.5; color: #333; margin: 0; }

            /* Controls */
            #avatar-controls {
                display: flex; gap: 8px; margin-bottom: 12px; align-items: center;
            }
            #avatar-input {
                flex: 1; padding: 11px 16px; border: 2px solid #e5e7eb;
                border-radius: 24px; font-size: 13px; font-family: inherit;
                background: rgba(255,255,255,0.9);
            }
            #avatar-input:focus { border-color: #667eea; outline: none; }
            #avatar-mic-btn, #avatar-send-btn {
                width: 42px; height: 42px; border-radius: 50%;
                border: none; cursor: pointer; display: flex;
                align-items: center; justify-content: center;
                box-shadow: 0 10px 20px rgba(0,0,0,0.08);
            }
            #avatar-mic-btn { background: #f0f0f5; color: #667eea; }
            #avatar-mic-btn.listening { background: #ef4444; color: white; animation: avatarPulse 1s infinite; }
            #avatar-send-btn { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }

            /* Quick Buttons */
            #avatar-quick-btns { display: flex; flex-wrap: wrap; gap: 6px; }
            .avatar-chip {
                padding: 6px 12px; border-radius: 16px;
                border: 1px solid #e5e7eb; background: white;
                font-size: 11px; cursor: pointer; font-family: inherit;
                color: #667eea; transition: all 0.2s;
            }
            .avatar-chip:hover {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white; border-color: transparent;
            }

            /* Responsive */
            @media (max-width: 480px) {
                #avatar-container { bottom: 20px; left: 20px; right: 20px; }
                .avatar-panel { width: calc(100vw - 40px); left: 0; }
                #avatar-toggle-btn { padding: 8px 16px 8px 8px; }
                .avatar-btn-label { font-size: 12px; }
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize
    function init() {
        // Wait for Three.js to be available
        if (typeof THREE === 'undefined') {
            setTimeout(init, 100);
            return;
        }
        injectAvatarStyles();
        createAvatarUI();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
