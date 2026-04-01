// 3D Animated Avatar Guide with Lip-Sync
// A realistic cartoon avatar that guides visitors through the portfolio

(function() {
    'use strict';

    const RIGGED_AVATAR_SOURCES = [
        'assets/models/asit-presenter.glb',
        'https://threejs.org/examples/models/gltf/Soldier.glb',
        'https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb'
    ];

    let avatarScene, avatarCamera, avatarRenderer;
    let avatarModel, mixer, clock;
    let fallbackAvatarModel = null;
    let usesRiggedAvatar = false;
    let animationActions = {};
    let currentRiggedAction = null;
    let currentRiggedIntent = '';
    let mouthMorphBindings = [];
    let riggedBones = {};
    let isSpeaking = false;
    let currentSection = 'hero';
    let mouthMorphTarget = 0;
    let isWalking = false;
    let walkIntensity = 0;
    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;
    let lastScrollTime = performance.now();
    let sectionTransitionUntil = 0;
    let typeIntervalId = null;
    let speechBubbleHideTimeout = null;

    // Section-specific messages
    const sectionMessages = {
        hero: "Hey there! I'm Asit, a Senior Principal Software Engineer. Welcome to my portfolio! Scroll down to explore my work.",
        about: "This section tells you about my journey - 9 plus years building scalable backend systems, Python platforms, and AI-powered engineering products.",
        skills: "Here you can see my stack - from Java Spring Boot and Python to GenAI platforms, LangChain, RAG pipelines, and observability.",
        experience: "My professional experience at PubMatic, Pegasystems, and TCS - building everything from ad-tech APIs to AI chatbots.",
        projects: "Check out my projects! I've built AI chatbots, release management systems, and contributed to Prebid.js open source.",
        contact: "Want to connect? Drop me a message! I'm always excited to discuss new opportunities and tech challenges."
    };

    function init() {
        createAvatarContainer();
        initThreeJS();
        createStylizedAvatar();
        attemptRiggedAvatarUpgrade();
        setupScrollBehavior();
        setupSectionObserver();
        setupSpeechSynthesis();
        animate();
    }

    function createAvatarContainer() {
        const container = document.createElement('div');
        container.id = 'avatar-guide-container';
        container.innerHTML = `
            <div id="avatar-guide-wrapper">
                <div id="avatar-guide-canvas"></div>
                <div id="avatar-guide-speech" class="avatar-speech-hidden">
                    <p id="avatar-guide-text"></p>
                </div>
                <div id="avatar-guide-controls">
                    <button id="avatar-mute-btn" title="Mute/Unmute">
                        <i class="fas fa-volume-up"></i>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(container);
        injectStyles();

        // Mute button
        document.getElementById('avatar-mute-btn').addEventListener('click', toggleMute);
    }

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #avatar-guide-container {
                position: fixed;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
                z-index: 10001;
                font-family: 'Poppins', sans-serif;
            }
            #avatar-guide-wrapper {
                position: relative;
            }
            #avatar-guide-canvas {
                width: 180px;
                height: 240px;
                border-radius: 20px;
                overflow: hidden;
                background: linear-gradient(180deg, rgba(20,20,35,0.9) 0%, rgba(10,10,15,0.95) 100%);
                border: 1px solid rgba(102, 126, 234, 0.3);
                box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 30px rgba(102, 126, 234, 0.15);
            }
            #avatar-guide-canvas canvas {
                border-radius: 20px;
            }
            #avatar-guide-speech {
                position: absolute;
                top: 50%;
                right: calc(100% + 16px);
                left: auto;
                width: 280px;
                margin-bottom: 0;
                padding: 16px 20px;
                background: rgba(20, 20, 35, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(102, 126, 234, 0.3);
                border-radius: 16px;
                box-shadow: 0 15px 50px rgba(0,0,0,0.3), 0 0 20px rgba(102, 126, 234, 0.1);
                transform: translateY(-50%) translateX(10px);
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            }
            #avatar-guide-speech.avatar-speech-visible {
                transform: translateY(-50%) translateX(0);
                opacity: 1;
            }
            #avatar-guide-speech::after {
                content: '';
                position: absolute;
                top: 50%;
                right: -8px;
                transform: translateY(-50%) rotate(-90deg);
                border-left: 10px solid transparent;
                border-right: 10px solid transparent;
                border-top: 10px solid rgba(20, 20, 35, 0.95);
            }
            #avatar-guide-text {
                color: rgba(255,255,255,0.9);
                font-size: 13px;
                line-height: 1.6;
                margin: 0;
            }
            #avatar-guide-controls {
                position: absolute;
                top: 10px;
                right: 10px;
                z-index: 10;
            }
            #avatar-mute-btn {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                border: none;
                background: rgba(255,255,255,0.1);
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s;
            }
            #avatar-mute-btn:hover {
                background: rgba(102, 126, 234, 0.5);
            }
            #avatar-mute-btn.muted {
                color: rgba(255,255,255,0.4);
            }
            @media (max-width: 768px) {
                #avatar-guide-container {
                    bottom: 10px;
                    top: auto;
                    right: 10px;
                    transform: none;
                }
                #avatar-guide-canvas {
                    width: 120px;
                    height: 160px;
                }
                #avatar-guide-speech {
                    top: auto;
                    bottom: calc(100% + 10px);
                    right: 0;
                    width: 220px;
                    padding: 12px 16px;
                    transform: translateY(0) translateX(0);
                }
                #avatar-guide-speech.avatar-speech-visible {
                    transform: translateY(0) translateX(0);
                }
                #avatar-guide-speech::after {
                    top: auto;
                    right: 18px;
                    bottom: -8px;
                    transform: none;
                }
                #avatar-guide-text {
                    font-size: 12px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function initThreeJS() {
        const container = document.getElementById('avatar-guide-canvas');
        
        avatarScene = new THREE.Scene();
        
        avatarCamera = new THREE.PerspectiveCamera(35, 180/240, 0.1, 100);
        avatarCamera.position.set(0, 0.2, 3.5);

        avatarRenderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: 'high-performance'
        });
        avatarRenderer.setSize(180, 240);
        avatarRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        avatarRenderer.setClearColor(0x000000, 0);
        avatarRenderer.outputEncoding = THREE.sRGBEncoding;
        avatarRenderer.toneMapping = THREE.ACESFilmicToneMapping;
        container.appendChild(avatarRenderer.domElement);

        // Lighting for realistic look
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        avatarScene.add(ambientLight);

        const keyLight = new THREE.DirectionalLight(0xffffff, 1);
        keyLight.position.set(2, 3, 4);
        avatarScene.add(keyLight);

        const fillLight = new THREE.DirectionalLight(0x667eea, 0.4);
        fillLight.position.set(-2, 1, 2);
        avatarScene.add(fillLight);

        const rimLight = new THREE.DirectionalLight(0x00d4ff, 0.3);
        rimLight.position.set(0, 2, -3);
        avatarScene.add(rimLight);

        clock = new THREE.Clock();
    }

    function attemptRiggedAvatarUpgrade() {
        if (typeof THREE === 'undefined' || typeof THREE.GLTFLoader === 'undefined') {
            return;
        }

        const loader = new THREE.GLTFLoader();
        let sourceIndex = 0;

        const loadNextSource = () => {
            const source = RIGGED_AVATAR_SOURCES[sourceIndex];
            if (!source) {
                usesRiggedAvatar = false;
                return;
            }

            loader.load(
                source,
                (gltf) => {
                    if (fallbackAvatarModel) {
                        avatarScene.remove(fallbackAvatarModel);
                    }

                    avatarModel = gltf.scene;
                    avatarModel.position.set(0, source.includes('Soldier') ? -1.18 : -1.08, 0);
                    avatarModel.rotation.y = Math.PI * 0.08;
                    avatarModel.scale.set(source.includes('Soldier') ? 1.62 : 1.38, source.includes('Soldier') ? 1.62 : 1.38, source.includes('Soldier') ? 1.62 : 1.38);

                    avatarModel.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.frustumCulled = false;
                        }
                    });

                    avatarScene.add(avatarModel);
                    usesRiggedAvatar = true;
                    mixer = new THREE.AnimationMixer(avatarModel);
                    animationActions = {};

                    gltf.animations.forEach((clip) => {
                        animationActions[clip.name.toLowerCase()] = mixer.clipAction(clip);
                    });

                    mouthMorphBindings = collectMouthMorphBindings(avatarModel);
                    riggedBones = collectRiggedBones(avatarModel);
                    playRiggedIntent('idle', true);
                },
                undefined,
                () => {
                    sourceIndex += 1;
                    loadNextSource();
                }
            );
        };

        loadNextSource();
    }

    function collectMouthMorphBindings(root) {
        const bindings = [];

        root.traverse((child) => {
            if (!child.isMesh || !child.morphTargetDictionary || !child.morphTargetInfluences) {
                return;
            }

            Object.keys(child.morphTargetDictionary).forEach((key) => {
                const normalized = key.toLowerCase();
                if (normalized.includes('mouth') || normalized.includes('viseme') || normalized.includes('jaw') || normalized.includes('open')) {
                    bindings.push({
                        mesh: child,
                        index: child.morphTargetDictionary[key]
                    });
                }
            });
        });

        return bindings;
    }

    function collectRiggedBones(root) {
        const bones = {
            head: null,
            neck: null,
            spine: null,
            leftArm: null,
            rightArm: null,
            leftForeArm: null,
            rightForeArm: null
        };

        root.traverse((child) => {
            if (!child.isBone) {
                return;
            }

            const name = child.name.toLowerCase();

            if (!bones.head && name.includes('head')) bones.head = child;
            if (!bones.neck && name.includes('neck')) bones.neck = child;
            if (!bones.spine && (name.includes('spine') || name.includes('chest'))) bones.spine = child;
            if (!bones.leftArm && ((name.includes('leftarm') || name.includes('arm_l') || name.includes('leftshoulder') || name.includes('leftupperarm')))) bones.leftArm = child;
            if (!bones.rightArm && ((name.includes('rightarm') || name.includes('arm_r') || name.includes('rightshoulder') || name.includes('rightupperarm')))) bones.rightArm = child;
            if (!bones.leftForeArm && (name.includes('leftforearm') || name.includes('leftlowerarm') || name.includes('forearm_l'))) bones.leftForeArm = child;
            if (!bones.rightForeArm && (name.includes('rightforearm') || name.includes('rightlowerarm') || name.includes('forearm_r'))) bones.rightForeArm = child;
        });

        return bones;
    }

    function findActionByKeywords(keywords) {
        const entries = Object.keys(animationActions);
        for (const keyword of keywords) {
            const match = entries.find((name) => name.includes(keyword));
            if (match) {
                return animationActions[match];
            }
        }
        return null;
    }

    function getActionForIntent(intent) {
        if (intent === 'walk') return findActionByKeywords(['walk']);
        if (intent === 'wave') return findActionByKeywords(['wave', 'thumbsup', 'yes']);
        if (intent === 'present') return findActionByKeywords(['thumbsup', 'wave', 'yes', 'no']);
        if (intent === 'talk') return findActionByKeywords(['standing', 'idle', 'yes']);
        return findActionByKeywords(['idle', 'standing']);
    }

    function playRiggedIntent(intent, immediate = false) {
        if (!usesRiggedAvatar) {
            return;
        }

        const action = getActionForIntent(intent) || getActionForIntent('idle');
        if (!action) {
            return;
        }

        if (currentRiggedAction === action && currentRiggedIntent === intent) {
            return;
        }

        const previousAction = currentRiggedAction;
        currentRiggedAction = action;
        currentRiggedIntent = intent;

        action.reset();
        action.enabled = true;
        action.setEffectiveTimeScale(1);
        action.setEffectiveWeight(1);
        action.clampWhenFinished = false;
        action.setLoop(THREE.LoopRepeat, Infinity);

        if (previousAction && previousAction !== action) {
            action.crossFadeFrom(previousAction, immediate ? 0.05 : 0.35, true);
        }

        action.play();
    }

    function triggerRiggedGesture(intent) {
        if (!usesRiggedAvatar) {
            return;
        }

        const action = getActionForIntent(intent);
        if (!action) {
            return;
        }

        const fallbackIntent = isWalking ? 'walk' : (isSpeaking ? 'talk' : 'idle');
        const previousAction = currentRiggedAction;
        currentRiggedAction = action;
        currentRiggedIntent = intent;

        action.reset();
        action.enabled = true;
        action.setEffectiveTimeScale(1);
        action.setEffectiveWeight(1);
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;

        if (previousAction && previousAction !== action) {
            action.crossFadeFrom(previousAction, 0.2, true);
        }

        action.play();

        const resetDelay = Math.max(900, action.getClip().duration * 1000);
        window.setTimeout(() => {
            if (currentRiggedAction === action) {
                playRiggedIntent(fallbackIntent);
            }
        }, resetDelay);
    }

    function updateRiggedAvatar(time, delta) {
        if (!avatarModel || !mixer) {
            return;
        }

        mixer.update(delta);

        const transitionPower = Math.max(0, (sectionTransitionUntil - performance.now()) / 1400);
        const desiredIntent = isWalking ? 'walk' : (isSpeaking ? 'talk' : 'idle');

        if (currentRiggedIntent !== 'wave' && currentRiggedIntent !== 'present') {
            playRiggedIntent(desiredIntent);
        }

        avatarModel.position.y = -1.08 + Math.sin(time * 1.8) * 0.018 + Math.abs(Math.sin(time * 5.2)) * 0.03 * (isWalking ? 1 : 0);
        avatarModel.position.x = Math.sin(time * 4.8) * 0.035 * (isWalking ? 1 : 0);
        avatarModel.rotation.y = Math.PI * 0.08 + Math.max(-0.12, Math.min(0.12, scrollVelocity * 4));
        avatarModel.rotation.z = Math.sin(time * 5.2) * 0.025 * (isWalking ? 1 : 0);

        if (isSpeaking) {
            mouthMorphTarget = 0.25 + Math.abs(Math.sin(time * 16)) * 0.75;
        } else {
            mouthMorphTarget *= 0.82;
        }

        mouthMorphBindings.forEach((binding) => {
            binding.mesh.morphTargetInfluences[binding.index] += (mouthMorphTarget - binding.mesh.morphTargetInfluences[binding.index]) * 0.25;
        });

        const manualHead = riggedBones.head;
        const manualNeck = riggedBones.neck;
        const manualSpine = riggedBones.spine;
        const leftArm = riggedBones.leftArm;
        const rightArm = riggedBones.rightArm;
        const leftForeArm = riggedBones.leftForeArm;
        const rightForeArm = riggedBones.rightForeArm;

        if (manualHead) {
            manualHead.rotation.x += ((Math.sin(time * 1.8) * 0.03) - manualHead.rotation.x) * 0.08;
            manualHead.rotation.y += (((transitionPower * 0.12) + Math.sin(time * 0.9) * 0.04) - manualHead.rotation.y) * 0.08;
        }

        if (manualNeck) {
            manualNeck.rotation.y += (((transitionPower * 0.08) + Math.sin(time * 0.65) * 0.025) - manualNeck.rotation.y) * 0.08;
        }

        if (manualSpine) {
            const targetSpineX = isSpeaking ? Math.sin(time * 4.5) * 0.04 : 0;
            manualSpine.rotation.x += (targetSpineX - manualSpine.rotation.x) * 0.06;
        }

        const speakingArmLift = isSpeaking ? 0.28 + Math.sin(time * 4.8) * 0.12 : 0;
        const speakingForearmLift = isSpeaking ? 0.32 + Math.cos(time * 5.4) * 0.16 : 0;
        const presentingArmLift = transitionPower * 0.42;
        const walkingSwing = Math.sin(time * 5.2) * 0.24 * (isWalking ? 1 : 0);

        if (rightArm) {
            rightArm.rotation.z += ((-0.08 - presentingArmLift - speakingArmLift - walkingSwing) - rightArm.rotation.z) * 0.1;
            rightArm.rotation.x += (((isSpeaking ? 0.14 : 0) + transitionPower * 0.12) - rightArm.rotation.x) * 0.1;
        }

        if (rightForeArm) {
            rightForeArm.rotation.z += ((-0.18 - presentingArmLift * 0.4 - speakingForearmLift) - rightForeArm.rotation.z) * 0.1;
        }

        if (leftArm) {
            leftArm.rotation.z += (((isSpeaking ? 0.16 : 0.05) + walkingSwing * 0.8) - leftArm.rotation.z) * 0.1;
            leftArm.rotation.x += (((isSpeaking ? 0.08 : 0) - transitionPower * 0.04) - leftArm.rotation.x) * 0.1;
        }

        if (leftForeArm) {
            leftForeArm.rotation.z += (((isSpeaking ? 0.12 : 0.02) + Math.sin(time * 4) * 0.08 * (isSpeaking ? 1 : 0)) - leftForeArm.rotation.z) * 0.1;
        }

        avatarModel.traverse((child) => {
            if (!child.isBone) {
                return;
            }

            const boneName = child.name.toLowerCase();

            if (boneName.includes('head')) {
                child.rotation.x += ((Math.sin(time * 1.8) * 0.03) - child.rotation.x) * 0.08;
                child.rotation.y += (((transitionPower * 0.12) + Math.sin(time * 0.9) * 0.04) - child.rotation.y) * 0.08;
            }

            if (isSpeaking && (boneName.includes('neck') || boneName.includes('spine'))) {
                child.rotation.x += ((Math.sin(time * 4.5) * 0.04) - child.rotation.x) * 0.06;
            }
        });
    }

    function createStylizedAvatar() {
        // Create a stylized 3D avatar (cartoon style like reference)
        avatarModel = new THREE.Group();
        fallbackAvatarModel = avatarModel;
        
        // Colors
        const skinColor = 0xd4a574;
        const hairColor = 0x1a1a2e;
        const shirtColor = 0x667eea;
        const pantsColor = 0x2d2d3a;

        // Head
        const headGeo = new THREE.SphereGeometry(0.35, 32, 32);
        headGeo.scale(1, 1.15, 1);
        const headMat = new THREE.MeshStandardMaterial({ 
            color: skinColor, 
            roughness: 0.7,
            metalness: 0.1
        });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.y = 1.1;
        avatarModel.add(head);
        avatarModel.userData.head = head;

        // Hair
        const hairGeo = new THREE.SphereGeometry(0.37, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55);
        const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.8 });
        const hair = new THREE.Mesh(hairGeo, hairMat);
        hair.position.y = 1.15;
        avatarModel.add(hair);

        // Eyes
        const eyeGeo = new THREE.SphereGeometry(0.06, 16, 16);
        const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const pupilMat = new THREE.MeshStandardMaterial({ color: 0x2d3436 });
        
        const leftEyeWhite = new THREE.Mesh(eyeGeo, eyeWhiteMat);
        leftEyeWhite.position.set(-0.12, 1.15, 0.3);
        avatarModel.add(leftEyeWhite);
        
        const rightEyeWhite = new THREE.Mesh(eyeGeo, eyeWhiteMat);
        rightEyeWhite.position.set(0.12, 1.15, 0.3);
        avatarModel.add(rightEyeWhite);

        const pupilGeo = new THREE.SphereGeometry(0.03, 16, 16);
        const leftPupil = new THREE.Mesh(pupilGeo, pupilMat);
        leftPupil.position.set(-0.12, 1.15, 0.35);
        avatarModel.add(leftPupil);
        avatarModel.userData.leftPupil = leftPupil;
        
        const rightPupil = new THREE.Mesh(pupilGeo, pupilMat);
        rightPupil.position.set(0.12, 1.15, 0.35);
        avatarModel.add(rightPupil);
        avatarModel.userData.rightPupil = rightPupil;

        // Glasses
        const glassesFrameMat = new THREE.MeshStandardMaterial({ color: 0x1a1a2e, metalness: 0.5 });
        const lensGeo = new THREE.TorusGeometry(0.09, 0.015, 8, 32);
        
        const leftLens = new THREE.Mesh(lensGeo, glassesFrameMat);
        leftLens.position.set(-0.12, 1.15, 0.32);
        avatarModel.add(leftLens);
        
        const rightLens = new THREE.Mesh(lensGeo, glassesFrameMat);
        rightLens.position.set(0.12, 1.15, 0.32);
        avatarModel.add(rightLens);

        const bridgeGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.08, 8);
        const bridge = new THREE.Mesh(bridgeGeo, glassesFrameMat);
        bridge.rotation.z = Math.PI / 2;
        bridge.position.set(0, 1.15, 0.32);
        avatarModel.add(bridge);

        // Nose
        const noseGeo = new THREE.ConeGeometry(0.04, 0.12, 8);
        const noseMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.7 });
        const nose = new THREE.Mesh(noseGeo, noseMat);
        nose.rotation.x = Math.PI / 2;
        nose.position.set(0, 1.05, 0.35);
        avatarModel.add(nose);

        // Mouth (animated)
        const mouthGeo = new THREE.TorusGeometry(0.06, 0.02, 8, 16, Math.PI);
        const mouthMat = new THREE.MeshStandardMaterial({ color: 0xc0392b });
        const mouth = new THREE.Mesh(mouthGeo, mouthMat);
        mouth.rotation.x = Math.PI;
        mouth.position.set(0, 0.92, 0.3);
        avatarModel.add(mouth);
        avatarModel.userData.mouth = mouth;

        // Neck
        const neckGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.15, 16);
        const neckMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.7 });
        const neck = new THREE.Mesh(neckGeo, neckMat);
        neck.position.y = 0.68;
        avatarModel.add(neck);

        // Body/Torso
        const torsoGeo = new THREE.CylinderGeometry(0.25, 0.3, 0.6, 16);
        const torsoMat = new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.6 });
        const torso = new THREE.Mesh(torsoGeo, torsoMat);
        torso.position.y = 0.3;
        avatarModel.add(torso);

        const jacketGeo = new THREE.CylinderGeometry(0.28, 0.33, 0.62, 20, 1, true);
        const jacketMat = new THREE.MeshStandardMaterial({ color: 0x1c2340, roughness: 0.55, metalness: 0.15, side: THREE.DoubleSide });
        const jacket = new THREE.Mesh(jacketGeo, jacketMat);
        jacket.position.y = 0.3;
        avatarModel.add(jacket);

        const tieGeo = new THREE.BoxGeometry(0.07, 0.32, 0.03);
        const tieMat = new THREE.MeshStandardMaterial({ color: 0x00d4ff, emissive: 0x0a4050, roughness: 0.35 });
        const tie = new THREE.Mesh(tieGeo, tieMat);
        tie.position.set(0, 0.25, 0.27);
        avatarModel.add(tie);

        // Arms
        const armGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.5, 16);
        const armMat = new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.6 });
        
        const leftArm = new THREE.Mesh(armGeo, armMat);
        leftArm.position.set(-0.35, 0.35, 0);
        leftArm.rotation.z = 0.2;
        avatarModel.add(leftArm);
        avatarModel.userData.leftArm = leftArm;
        
        const rightArm = new THREE.Mesh(armGeo, armMat);
        rightArm.position.set(0.35, 0.35, 0);
        rightArm.rotation.z = -0.2;
        avatarModel.add(rightArm);
        avatarModel.userData.rightArm = rightArm;

        // Hands
        const handGeo = new THREE.SphereGeometry(0.06, 16, 16);
        const handMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.7 });
        
        const leftHand = new THREE.Mesh(handGeo, handMat);
        leftHand.position.set(-0.4, 0.05, 0);
        avatarModel.add(leftHand);
        
        const rightHand = new THREE.Mesh(handGeo, handMat);
        rightHand.position.set(0.4, 0.05, 0);
        avatarModel.add(rightHand);
        avatarModel.userData.leftHand = leftHand;
        avatarModel.userData.rightHand = rightHand;

        const hipGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.18, 16);
        const hipMat = new THREE.MeshStandardMaterial({ color: pantsColor, roughness: 0.6 });
        const hips = new THREE.Mesh(hipGeo, hipMat);
        hips.position.y = -0.08;
        avatarModel.add(hips);

        const legGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.58, 16);
        const legMat = new THREE.MeshStandardMaterial({ color: pantsColor, roughness: 0.62 });
        const leftLeg = new THREE.Mesh(legGeo, legMat);
        leftLeg.position.set(-0.12, -0.44, 0);
        avatarModel.add(leftLeg);
        avatarModel.userData.leftLeg = leftLeg;

        const rightLeg = new THREE.Mesh(legGeo, legMat);
        rightLeg.position.set(0.12, -0.44, 0);
        avatarModel.add(rightLeg);
        avatarModel.userData.rightLeg = rightLeg;

        const shoeGeo = new THREE.BoxGeometry(0.16, 0.08, 0.26);
        const shoeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.08 });
        const leftShoe = new THREE.Mesh(shoeGeo, shoeMat);
        leftShoe.position.set(-0.12, -0.77, 0.06);
        avatarModel.add(leftShoe);
        avatarModel.userData.leftShoe = leftShoe;

        const rightShoe = new THREE.Mesh(shoeGeo, shoeMat);
        rightShoe.position.set(0.12, -0.77, 0.06);
        avatarModel.add(rightShoe);
        avatarModel.userData.rightShoe = rightShoe;

        // Position the whole avatar
        avatarModel.position.y = -0.5;
        avatarModel.scale.set(1.1, 1.1, 1.1);
        
        avatarScene.add(avatarModel);
    }

    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        const delta = clock.getDelta();

        if (usesRiggedAvatar) {
            updateRiggedAvatar(time, delta);
            avatarRenderer.render(avatarScene, avatarCamera);
            return;
        }

        if (avatarModel) {
            walkIntensity += ((isWalking ? 1 : 0) - walkIntensity) * 0.08;
            const walkCycle = time * (4 + walkIntensity * 8);
            const transitionPower = Math.max(0, (sectionTransitionUntil - performance.now()) / 1400);

            avatarModel.position.y = -0.5 + Math.sin(time * 2) * (0.02 * (1 - walkIntensity)) + Math.abs(Math.sin(walkCycle)) * 0.035 * walkIntensity;
            avatarModel.position.x = Math.sin(walkCycle) * 0.045 * walkIntensity;
            avatarModel.rotation.z = Math.sin(walkCycle) * 0.035 * walkIntensity;
            avatarModel.rotation.y = Math.sin(time * 0.5) * 0.08 + Math.max(-0.12, Math.min(0.12, scrollVelocity * 4));

            const head = avatarModel.userData.head;
            if (head) {
                head.rotation.y = Math.sin(time * 0.5) * 0.1 + transitionPower * 0.12;
                head.rotation.x = Math.sin(time * 0.3) * 0.05 - walkIntensity * 0.04;
            }

            const leftPupil = avatarModel.userData.leftPupil;
            const rightPupil = avatarModel.userData.rightPupil;
            if (leftPupil && rightPupil) {
                const eyeOffset = Math.sin(time * 0.7) * 0.01 + Math.max(-0.01, Math.min(0.01, scrollVelocity * 0.05));
                leftPupil.position.x = -0.12 + eyeOffset;
                rightPupil.position.x = 0.12 + eyeOffset;
            }

            const mouth = avatarModel.userData.mouth;
            const leftArm = avatarModel.userData.leftArm;
            const rightArm = avatarModel.userData.rightArm;
            const leftLeg = avatarModel.userData.leftLeg;
            const rightLeg = avatarModel.userData.rightLeg;
            const leftShoe = avatarModel.userData.leftShoe;
            const rightShoe = avatarModel.userData.rightShoe;

            if (leftLeg && rightLeg) {
                leftLeg.rotation.x = Math.sin(walkCycle) * 0.65 * walkIntensity;
                rightLeg.rotation.x = -Math.sin(walkCycle) * 0.65 * walkIntensity;
            }

            if (leftShoe && rightShoe) {
                leftShoe.rotation.x = Math.max(0, -Math.sin(walkCycle)) * 0.35 * walkIntensity;
                rightShoe.rotation.x = Math.max(0, Math.sin(walkCycle)) * 0.35 * walkIntensity;
            }

            if (mouth && isSpeaking) {
                if (leftArm && rightArm) {
                    leftArm.rotation.z = 0.28 + Math.sin(time * 4.5) * 0.18 - Math.sin(walkCycle) * 0.12 * walkIntensity;
                    leftArm.rotation.x = 0.12 + Math.cos(time * 3.8) * 0.08;
                    rightArm.rotation.z = -0.32 + Math.cos(time * 5.2) * 0.28 - transitionPower * 0.35;
                    rightArm.rotation.x = -0.12 + Math.sin(time * 4.8) * 0.22 + transitionPower * 0.18;
                }
                const lipSync = Math.abs(Math.sin(time * 15)) * 0.6 + Math.abs(Math.sin(time * 7.5)) * 0.25;
                mouth.scale.y = 0.7 + lipSync * 0.9;
                mouth.scale.x = 0.95 + lipSync * 0.32;
                mouth.rotation.z = Math.sin(time * 8) * 0.06;
            } else if (mouth) {
                mouth.scale.y = 1;
                mouth.scale.x = 1;
                mouth.rotation.z = 0;
                if (leftArm && rightArm) {
                    leftArm.rotation.z = 0.2 + Math.sin(walkCycle) * 0.35 * walkIntensity;
                    leftArm.rotation.x = 0;
                    rightArm.rotation.z = -0.2 - Math.sin(walkCycle) * 0.35 * walkIntensity - transitionPower * 0.28;
                    rightArm.rotation.x = transitionPower * 0.18;
                }
            }

            if (!isSpeaking && leftArm && rightArm && transitionPower > 0) {
                rightArm.rotation.z -= Math.sin(time * 8) * 0.2 * transitionPower;
                leftArm.rotation.z += Math.cos(time * 6) * 0.08 * transitionPower;
            }
        }

        avatarRenderer.render(avatarScene, avatarCamera);
    }

    function setupScrollBehavior() {
        let walkingTimeout;

        window.addEventListener('scroll', () => {
            const now = performance.now();
            const currentY = window.scrollY;
            const deltaY = currentY - lastScrollY;
            const deltaTime = Math.max(now - lastScrollTime, 16);

            scrollVelocity = deltaY / deltaTime;
            isWalking = Math.abs(deltaY) > 4;
            lastScrollY = currentY;
            lastScrollTime = now;

            clearTimeout(walkingTimeout);
            walkingTimeout = setTimeout(() => {
                isWalking = false;
                scrollVelocity *= 0.35;
            }, 140);
        }, { passive: true });
    }

    function setupSectionObserver() {
        const sections = ['hero', 'about', 'skills', 'experience', 'projects', 'contact'];
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                    const sectionId = entry.target.id || 'hero';
                    if (sectionId !== currentSection && sectionMessages[sectionId]) {
                        currentSection = sectionId;
                        sectionTransitionUntil = performance.now() + 1400;
                        triggerRiggedGesture('present');
                        speakMessage(sectionMessages[sectionId]);
                    }
                }
            });
        }, { threshold: [0.3, 0.5], rootMargin: '0px 0px -15% 0px' });

        // Observe sections
        sections.forEach(id => {
            const section = document.getElementById(id) || document.querySelector(`section:nth-of-type(${sections.indexOf(id) + 1})`);
            if (section) {
                observer.observe(section);
            }
        });

        // Initial greeting after delay
        setTimeout(() => {
            triggerRiggedGesture('wave');
            speakMessage(sectionMessages.hero);
        }, 2000);
    }

    let isMuted = false;
    let currentUtterance = null;

    function toggleMute() {
        isMuted = !isMuted;
        const btn = document.getElementById('avatar-mute-btn');
        btn.innerHTML = isMuted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
        btn.classList.toggle('muted', isMuted);
        
        if (isMuted && speechSynthesis.speaking) {
            speechSynthesis.cancel();
            isSpeaking = false;
        }
    }

    function setupSpeechSynthesis() {
        // Preload voices
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => {};
        }
    }

    function speakMessage(text) {
        const speechBubble = document.getElementById('avatar-guide-speech');
        const textElement = document.getElementById('avatar-guide-text');
        
        clearInterval(typeIntervalId);
        clearTimeout(speechBubbleHideTimeout);
        speechBubble.classList.add('avatar-speech-visible');
        textElement.textContent = '';
        
        let i = 0;
        typeIntervalId = setInterval(() => {
            if (i < text.length) {
                textElement.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeIntervalId);
            }
        }, 25);

        if (!isMuted && window.speechSynthesis) {
            speechSynthesis.cancel();
            
            currentUtterance = new SpeechSynthesisUtterance(text);
            currentUtterance.rate = 1.0;
            currentUtterance.pitch = 1.0;
            currentUtterance.volume = 0.8;

            const voices = speechSynthesis.getVoices();
            const preferredVoice = voices.find(v => v.name.includes('Google') && v.lang.startsWith('en'))
                || voices.find(v => v.name.includes('Daniel'))
                || voices.find(v => v.lang.startsWith('en-US'))
                || voices[0];
            
            if (preferredVoice) currentUtterance.voice = preferredVoice;

            currentUtterance.onstart = () => { isSpeaking = true; };
            currentUtterance.onend = () => { 
                isSpeaking = false;
                speechBubbleHideTimeout = setTimeout(() => {
                    speechBubble.classList.remove('avatar-speech-visible');
                }, 3000);
            };

            speechSynthesis.speak(currentUtterance);
        } else {
            isSpeaking = true;
            speechBubbleHideTimeout = setTimeout(() => {
                isSpeaking = false;
                speechBubble.classList.remove('avatar-speech-visible');
            }, text.length * 50 + 3000);
        }
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (typeof THREE !== 'undefined') {
                init();
            } else {
                setTimeout(init, 500);
            }
        });
    } else {
        if (typeof THREE !== 'undefined') {
            init();
        } else {
            setTimeout(init, 500);
        }
    }
})();
