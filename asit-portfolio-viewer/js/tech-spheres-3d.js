// 3D Floating Tech Stack Spheres with Logo Textures
// Creates an interactive 3D visualization of tech skills

(function() {
    'use strict';

    const techLogos = [
        { name: 'Python', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', color: 0x3776AB },
        { name: 'Java', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', color: 0xED8B00 },
        { name: 'JavaScript', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', color: 0xF7DF1E },
        { name: 'React', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', color: 0x61DAFB },
        { name: 'OpenAI', url: 'https://cdn.simpleicons.org/openai/412991', color: 0x412991 },
        { name: 'Hugging Face', url: 'https://cdn.simpleicons.org/huggingface/FFCC4D', color: 0xFFCC4D },
        { name: 'PyTorch', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg', color: 0xEE4C2C },
        { name: 'Streamlit', url: 'https://cdn.simpleicons.org/streamlit/FF4B4B', color: 0xFF4B4B },
        { name: 'Docker', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', color: 0x2496ED },
        { name: 'PostgreSQL', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', color: 0x336791 },
        { name: 'Git', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', color: 0xF05032 },
        { name: 'Jenkins', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg', color: 0xD24939 },
        { name: 'Selenium', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/selenium/selenium-original.svg', color: 0x43B02A },
        { name: 'MongoDB', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', color: 0x47A248 },
        { name: 'Redis', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg', color: 0xDC382D },
        { name: 'Kubernetes', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg', color: 0x326CE5 },
        { name: 'AWS', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg', color: 0xFF9900 },
        { name: 'Linux', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg', color: 0xFCC624 },
        { name: 'GraphQL', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg', color: 0xE10098 },
        { name: 'TypeScript', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', color: 0x3178C6 },
        { name: 'NodeJS', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', color: 0x339933 },
        { name: 'Grafana', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg', color: 0xF46800 }
    ];

    let scene, camera, renderer, spheres = [], container;
    let targetRotationX = 0, targetRotationY = 0;
    let isDragging = false;
    let highlightedSphere = null;
    let isInitialized = false;
    let isThreeReady = false;
    let animationFrameId = null;

    function isMobileViewport() {
        return window.innerWidth < 768;
    }

    function shouldUse3D() {
        return !isMobileViewport() && supportsWebGL() && typeof THREE !== 'undefined';
    }

    function supportsWebGL() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (error) {
            return false;
        }
    }

    function init() {
        if (isInitialized || document.getElementById('tech-spheres-container')) {
            return;
        }

        isInitialized = true;

        // Create container for tech spheres section
        container = document.createElement('div');
        container.id = 'tech-spheres-container';
        container.innerHTML = `
            <div class="tech-spheres-section">
                <h2 class="tech-spheres-title">MY TECH STACK</h2>
                <div id="tech-spheres-canvas"></div>
                <div class="tech-spheres-overlay">
                    <p class="tech-hint">Auto-exploring stack • Hover a logo card to highlight the sphere</p>
                </div>
                <div id="tech-spheres-legend" class="tech-spheres-legend"></div>
            </div>
        `;

        // Insert after skills section or at appropriate location
        const skillsSection = document.getElementById('skills');
        if (skillsSection) {
            skillsSection.parentNode.insertBefore(container, skillsSection.nextSibling);
        } else {
            document.body.appendChild(container);
        }

        injectStyles();
        renderLegend();
        observeAndLoad();
    }

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .tech-spheres-section {
                position: relative;
                width: 100%;
                height: 100vh;
                min-height: 700px;
                background: linear-gradient(180deg, #0a0a0f 0%, #12121a 50%, #0a0a0f 100%);
                overflow: hidden;
            }
            .tech-spheres-title {
                position: absolute;
                top: 80px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 4rem;
                font-weight: 800;
                letter-spacing: 0.1em;
                color: white;
                z-index: 10;
                text-align: center;
                background: linear-gradient(135deg, #00d4ff, #667eea, #764ba2);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-shadow: none;
            }
            #tech-spheres-canvas {
                width: 100%;
                height: 100%;
                cursor: grab;
                position: relative;
            }
            #tech-spheres-canvas:active {
                cursor: grabbing;
            }
            .tech-spheres-fallback {
                width: 100%;
                min-height: 520px;
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
                gap: 18px;
                align-content: center;
                justify-items: center;
                padding: 160px 24px 180px;
                box-sizing: border-box;
            }
            .tech-sphere-fallback-item {
                width: 102px;
                height: 102px;
                border-radius: 999px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 8px;
                text-align: center;
                color: white;
                font-size: 12px;
                font-weight: 700;
                padding: 10px;
                box-shadow: inset 0 2px 12px rgba(255,255,255,0.28), 0 18px 32px rgba(0,0,0,0.24);
                border: 1px solid rgba(255,255,255,0.18);
                background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.96), rgba(255,255,255,0.35) 28%, rgba(10,10,15,0.12) 60%), linear-gradient(135deg, rgba(0,212,255,0.5), rgba(102,126,234,0.6), rgba(118,75,162,0.82));
            }
            .tech-sphere-fallback-item img {
                width: 34px;
                height: 34px;
                object-fit: contain;
                background: rgba(255,255,255,0.96);
                padding: 4px;
                border-radius: 10px;
            }
            .tech-sphere-fallback-item span {
                display: block;
                line-height: 1.2;
            }
            .tech-spheres-loading {
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                color: rgba(255,255,255,0.78);
                font-size: 14px;
                letter-spacing: 0.08em;
            }
            .tech-spheres-overlay {
                position: absolute;
                bottom: 24px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 11;
            }
            .tech-hint {
                color: rgba(255,255,255,0.5);
                font-size: 14px;
                letter-spacing: 0.1em;
            }
            .tech-spheres-legend {
                position: absolute;
                left: 50%;
                bottom: 68px;
                transform: translateX(-50%);
                width: min(1100px, calc(100% - 40px));
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 12px;
                z-index: 11;
            }
            .tech-legend-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px 12px;
                border-radius: 16px;
                background: rgba(20, 20, 35, 0.72);
                backdrop-filter: blur(14px);
                border: 1px solid rgba(255,255,255,0.08);
                color: rgba(255,255,255,0.88);
                transition: all 0.25s ease;
                cursor: pointer;
                box-shadow: 0 10px 24px rgba(0,0,0,0.18);
            }
            .tech-legend-item:hover,
            .tech-legend-item.active {
                transform: translateY(-2px);
                border-color: rgba(0,212,255,0.45);
                box-shadow: 0 14px 30px rgba(0,0,0,0.24), 0 0 20px rgba(0,212,255,0.12);
                background: rgba(28, 34, 56, 0.88);
            }
            .tech-legend-item img {
                width: 24px;
                height: 24px;
                object-fit: contain;
                border-radius: 6px;
                background: rgba(255,255,255,0.96);
                padding: 3px;
                flex-shrink: 0;
            }
            .tech-legend-name {
                font-size: 13px;
                font-weight: 600;
                line-height: 1.2;
            }
            .tech-tooltip {
                position: fixed;
                padding: 12px 20px;
                background: rgba(20, 20, 35, 0.95);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(102, 126, 234, 0.3);
                border-radius: 12px;
                color: white;
                font-size: 14px;
                font-weight: 600;
                pointer-events: none;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.2s;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3), 0 0 20px rgba(102, 126, 234, 0.2);
            }
            .tech-tooltip.visible {
                opacity: 1;
            }
            @media (max-width: 768px) {
                .tech-spheres-title {
                    font-size: 2rem;
                    top: 100px;
                }
                .tech-spheres-section {
                    height: auto;
                    min-height: 760px;
                    padding-bottom: 180px;
                }
                .tech-spheres-fallback {
                    min-height: 480px;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    padding: 150px 20px 190px;
                    gap: 16px;
                }
                .tech-sphere-fallback-item {
                    width: 96px;
                    height: 96px;
                }
                .tech-spheres-legend {
                    width: calc(100% - 24px);
                    bottom: 72px;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 10px;
                }
                .tech-legend-item {
                    padding: 10px;
                }
                .tech-legend-name {
                    font-size: 12px;
                }
            }
        `;
        document.head.appendChild(style);

        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'tech-tooltip';
        tooltip.id = 'tech-tooltip';
        document.body.appendChild(tooltip);
    }

    function observeAndLoad() {
        const section = container.querySelector('.tech-spheres-section');
        const canvasContainer = document.getElementById('tech-spheres-canvas');
        if (!section || !canvasContainer) return;

        canvasContainer.innerHTML = '<div class="tech-spheres-loading">Loading tech stack...</div>';

        const loadVisualization = () => {
            if (isThreeReady) return;

            if (shouldUse3D()) {
                const threeInitialized = initThreeJS();
                if (threeInitialized) {
                    createSpheres();
                    animate();
                    addEventListeners();
                    isThreeReady = true;
                    return;
                }
            }

            renderFallbackSpheres();
        };

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        observer.disconnect();
                        loadVisualization();
                    }
                });
            }, { rootMargin: '160px 0px' });

            observer.observe(section);
        } else {
            loadVisualization();
        }
    }

    function initThreeJS() {
        const canvasContainer = document.getElementById('tech-spheres-canvas');
        if (!canvasContainer) return false;

        const width = Math.max(canvasContainer.clientWidth, 320);
        const height = Math.max(canvasContainer.clientHeight, isMobileViewport() ? 420 : 620);
        
        try {
            scene = new THREE.Scene();
            scene.fog = new THREE.Fog(0x0a0a0f, 5, 25);

            camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
            camera.position.z = 12;

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
            renderer.setClearColor(0x0a0a0f, 1);
            canvasContainer.innerHTML = '';
            canvasContainer.appendChild(renderer.domElement);

            // Lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
            scene.add(ambientLight);

            const pointLight1 = new THREE.PointLight(0x00d4ff, 1, 50);
            pointLight1.position.set(10, 10, 10);
            scene.add(pointLight1);

            const pointLight2 = new THREE.PointLight(0x764ba2, 0.8, 50);
            pointLight2.position.set(-10, -10, 5);
            scene.add(pointLight2);

            const pointLight3 = new THREE.PointLight(0xff006e, 0.5, 50);
            pointLight3.position.set(0, 10, -10);
            scene.add(pointLight3);

            // Handle resize
            window.addEventListener('resize', () => {
                const nextWidth = Math.max(canvasContainer.clientWidth, 320);
                const nextHeight = Math.max(canvasContainer.clientHeight, isMobileViewport() ? 420 : 620);
                camera.aspect = nextWidth / nextHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(nextWidth, nextHeight);
            });

            return true;
        } catch (error) {
            console.warn('Tech spheres 3D initialization failed, using fallback:', error);
            return false;
        }
    }

    function createSpheres() {
        const sphereGroup = new THREE.Group();
        scene.add(sphereGroup);
        spheres = [];

        techLogos.forEach((tech, index) => {
            // Create sphere with glossy material
            const geometry = new THREE.SphereGeometry(0.8, isMobileViewport() ? 28 : 48, isMobileViewport() ? 28 : 48);
            
            // Create a canvas to draw the logo on white background
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');
            
            // White glossy background
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(256, 256, 256, 0, Math.PI * 2);
            ctx.fill();
            
            // Add subtle gradient for 3D effect
            const gradient = ctx.createRadialGradient(180, 180, 0, 256, 256, 256);
            gradient.addColorStop(0, 'rgba(255,255,255,1)');
            gradient.addColorStop(0.5, 'rgba(240,240,245,1)');
            gradient.addColorStop(1, 'rgba(200,200,210,1)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(256, 256, 256, 0, Math.PI * 2);
            ctx.fill();

            const canvasTexture = new THREE.CanvasTexture(canvas);
            
            // Load logo and draw on canvas
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                const size = 280;
                const x = (512 - size) / 2;
                const y = (512 - size) / 2;
                ctx.drawImage(img, x, y, size, size);
                canvasTexture.needsUpdate = true;
            };
            img.onerror = () => {
                ctx.fillStyle = '#111827';
                ctx.font = 'bold 74px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(tech.name.charAt(0), 256, 256);
                canvasTexture.needsUpdate = true;
            };
            img.src = tech.url;

            const material = new THREE.MeshPhysicalMaterial({
                map: canvasTexture,
                roughness: 0.1,
                metalness: 0.1,
                clearcoat: 1.0,
                clearcoatRoughness: 0.1,
                reflectivity: 0.9,
                envMapIntensity: 1
            });

            const sphere = new THREE.Mesh(geometry, material);
            
            // Position spheres in a cluster
            const phi = Math.acos(-1 + (2 * index) / techLogos.length);
            const theta = Math.sqrt(techLogos.length * Math.PI) * phi;
            const radius = 5 + Math.random() * 2;
            
            sphere.position.x = radius * Math.cos(theta) * Math.sin(phi);
            sphere.position.y = radius * Math.sin(theta) * Math.sin(phi);
            sphere.position.z = radius * Math.cos(phi) - 2;
            
            // Store original position for animation
            sphere.userData = {
                index,
                name: tech.name,
                originalPos: sphere.position.clone(),
                floatOffset: Math.random() * Math.PI * 2,
                floatSpeed: 0.5 + Math.random() * 0.5,
                rotationSpeed: 0.002 + Math.random() * 0.003
            };

            sphereGroup.add(sphere);
            spheres.push(sphere);
        });

        // Store group reference
        scene.userData.sphereGroup = sphereGroup;
    }

    function renderLegend() {
        const legend = document.getElementById('tech-spheres-legend');
        if (!legend) return;

        legend.innerHTML = techLogos.map((tech, index) => `
            <button class="tech-legend-item" data-tech-index="${index}" type="button">
                <img src="${tech.url}" alt="${tech.name} logo">
                <span class="tech-legend-name">${tech.name}</span>
            </button>
        `).join('');

        legend.querySelectorAll('.tech-legend-item').forEach((item) => {
            item.addEventListener('mouseenter', () => focusSphere(Number(item.dataset.techIndex)));
            item.addEventListener('focus', () => focusSphere(Number(item.dataset.techIndex)));
            item.addEventListener('mouseleave', clearFocus);
            item.addEventListener('blur', clearFocus);
            item.addEventListener('click', () => focusSphere(Number(item.dataset.techIndex), true));
        });
    }

    function renderFallbackSpheres() {
        const canvasContainer = document.getElementById('tech-spheres-canvas');
        if (!canvasContainer) return;

        canvasContainer.innerHTML = `
            <div class="tech-spheres-fallback">
                ${techLogos.map((tech) => `
                    <div class="tech-sphere-fallback-item" style="background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.96), rgba(255,255,255,0.35) 28%, rgba(10,10,15,0.12) 60%), linear-gradient(135deg, ${hexToRgba(tech.color, 0.45)}, rgba(102,126,234,0.65), rgba(118,75,162,0.86));">
                        <img src="${tech.url}" alt="${tech.name} logo" loading="lazy">
                        <span>${tech.name}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function hexToRgba(hex, alpha) {
        const red = (hex >> 16) & 255;
        const green = (hex >> 8) & 255;
        const blue = hex & 255;
        return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    }

    function focusSphere(index, snapRotation = false) {
        highlightedSphere = spheres[index] || null;
        document.querySelectorAll('.tech-legend-item').forEach((item) => {
            item.classList.toggle('active', Number(item.dataset.techIndex) === index);
        });

        if (!highlightedSphere) return;

        if (snapRotation && scene.userData.sphereGroup) {
            targetRotationY = -highlightedSphere.userData.originalPos.x * 0.08;
            targetRotationX = highlightedSphere.userData.originalPos.y * 0.04;
        }
    }

    function clearFocus() {
        highlightedSphere = null;
        document.querySelectorAll('.tech-legend-item.active').forEach((item) => item.classList.remove('active'));
    }

    function animate() {
        animationFrameId = requestAnimationFrame(animate);

        if (!renderer || !scene || !camera) return;

        const time = Date.now() * 0.001;
        const sphereGroup = scene.userData.sphereGroup;

        // Rotate entire group based on mouse
        if (sphereGroup) {
            if (!isDragging && !highlightedSphere) {
                targetRotationY += 0.0025;
                targetRotationX = Math.sin(time * 0.25) * 0.08;
            }
            sphereGroup.rotation.y += (targetRotationY - sphereGroup.rotation.y) * 0.05;
            sphereGroup.rotation.x += (targetRotationX - sphereGroup.rotation.x) * 0.05;
        }

        // Animate individual spheres
        spheres.forEach(sphere => {
            const data = sphere.userData;
            
            // Floating animation
            sphere.position.y = data.originalPos.y + Math.sin(time * data.floatSpeed + data.floatOffset) * 0.3;
            
            // Self rotation
            sphere.rotation.y += data.rotationSpeed;
            sphere.rotation.x += data.rotationSpeed * 0.5;

            const isActive = highlightedSphere === sphere;
            const targetScale = isActive ? 1.18 : 1;
            sphere.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);
        });

        renderer.render(scene, camera);
    }

    function addEventListeners() {
        const canvasContainer = document.getElementById('tech-spheres-canvas');
        if (!canvasContainer) return;

        let previousMouseX = 0, previousMouseY = 0;

        canvasContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            previousMouseX = e.clientX;
            previousMouseY = e.clientY;
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        window.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const deltaX = e.clientX - previousMouseX;
                const deltaY = e.clientY - previousMouseY;
                
                targetRotationY += deltaX * 0.005;
                targetRotationX += deltaY * 0.005;
                targetRotationX = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, targetRotationX));
                
                previousMouseX = e.clientX;
                previousMouseY = e.clientY;
            }

            // Raycasting for hover
            checkHover(e);
        });

        // Touch support
        canvasContainer.addEventListener('touchstart', (e) => {
            isDragging = true;
            previousMouseX = e.touches[0].clientX;
            previousMouseY = e.touches[0].clientY;
        });

        canvasContainer.addEventListener('touchmove', (e) => {
            if (isDragging) {
                const deltaX = e.touches[0].clientX - previousMouseX;
                const deltaY = e.touches[0].clientY - previousMouseY;
                
                targetRotationY += deltaX * 0.005;
                targetRotationX += deltaY * 0.005;
                
                previousMouseX = e.touches[0].clientX;
                previousMouseY = e.touches[0].clientY;
            }
        });

        canvasContainer.addEventListener('touchend', () => {
            isDragging = false;
        });
    }

    function checkHover(e) {
        const canvasContainer = document.getElementById('tech-spheres-canvas');
        if (!canvasContainer || !camera || !renderer || !spheres.length) return;

        const rect = canvasContainer.getBoundingClientRect();
        const tooltip = document.getElementById('tech-tooltip');
        if (!tooltip) return;
        
        const mouse = new THREE.Vector2(
            ((e.clientX - rect.left) / rect.width) * 2 - 1,
            -((e.clientY - rect.top) / rect.height) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        
        const intersects = raycaster.intersectObjects(spheres);
        
        if (intersects.length > 0) {
            const sphere = intersects[0].object;
            highlightedSphere = sphere;
            document.querySelectorAll('.tech-legend-item').forEach((item) => {
                item.classList.toggle('active', Number(item.dataset.techIndex) === sphere.userData.index);
            });
            tooltip.textContent = sphere.userData.name;
            tooltip.style.left = e.clientX + 15 + 'px';
            tooltip.style.top = e.clientY + 15 + 'px';
            tooltip.classList.add('visible');
            canvasContainer.style.cursor = 'pointer';
        } else {
            tooltip.classList.remove('visible');
            canvasContainer.style.cursor = 'grab';
            if (!document.querySelector('.tech-legend-item:hover')) {
                clearFocus();
            }
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
