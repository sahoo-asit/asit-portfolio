// 3D Particle Engine using Three.js
// Creates an immersive 3D particle background with interactive mouse tracking

(function() {
    'use strict';

    let scene, camera, renderer, particles, mouseX = 0, mouseY = 0;
    let geometryCore, materialCore, meshCore;
    let clock, animationId;
    const particleCount = 2000;
    const connectionDistance = 120;

    function init() {
        // Create canvas container
        const canvas3D = document.createElement('div');
        canvas3D.id = 'three-canvas';
        canvas3D.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;';
        document.body.prepend(canvas3D);

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        camera.position.z = 500;

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        canvas3D.appendChild(renderer.domElement);

        clock = new THREE.Clock();

        createParticles();
        createFloatingGeometry();
        addLights();

        // Event listeners
        document.addEventListener('mousemove', onMouseMove, false);
        window.addEventListener('resize', onResize, false);
        window.addEventListener('scroll', onScroll, false);

        animate();
    }

    function createParticles() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        const colorPalette = [
            new THREE.Color(0x667eea), // blue
            new THREE.Color(0x764ba2), // purple
            new THREE.Color(0x4f46e5), // indigo
            new THREE.Color(0x818cf8), // light indigo
            new THREE.Color(0xa78bfa), // light purple
        ];

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 1500;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 1500;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 800;

            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            sizes[i] = Math.random() * 3 + 1;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            size: 2.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });

        particles = new THREE.Points(geometry, material);
        scene.add(particles);
    }

    function createFloatingGeometry() {
        // Floating icosahedron (wireframe)
        const icoGeo = new THREE.IcosahedronGeometry(60, 1);
        const icoMat = new THREE.MeshPhongMaterial({
            color: 0x667eea,
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });
        geometryCore = new THREE.Mesh(icoGeo, icoMat);
        geometryCore.position.set(0, 0, -100);
        scene.add(geometryCore);

        // Torus ring
        const torusGeo = new THREE.TorusGeometry(100, 2, 16, 100);
        const torusMat = new THREE.MeshPhongMaterial({
            color: 0x764ba2,
            transparent: true,
            opacity: 0.12,
            wireframe: true
        });
        const torus = new THREE.Mesh(torusGeo, torusMat);
        torus.position.set(0, 0, -200);
        torus.name = 'torus';
        scene.add(torus);

        // Small floating spheres
        for (let i = 0; i < 8; i++) {
            const sphereGeo = new THREE.SphereGeometry(Math.random() * 8 + 3, 16, 16);
            const sphereMat = new THREE.MeshPhongMaterial({
                color: i % 2 === 0 ? 0x667eea : 0x764ba2,
                transparent: true,
                opacity: 0.3,
                emissive: i % 2 === 0 ? 0x667eea : 0x764ba2,
                emissiveIntensity: 0.3
            });
            const sphere = new THREE.Mesh(sphereGeo, sphereMat);
            sphere.position.set(
                (Math.random() - 0.5) * 600,
                (Math.random() - 0.5) * 600,
                (Math.random() - 0.5) * 300
            );
            sphere.name = `floatSphere_${i}`;
            scene.add(sphere);
        }
    }

    function addLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0x667eea, 1, 1000);
        pointLight1.position.set(200, 200, 200);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x764ba2, 0.8, 1000);
        pointLight2.position.set(-200, -200, 100);
        scene.add(pointLight2);
    }

    function onMouseMove(event) {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onScroll() {
        const scrollY = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = scrollY / maxScroll;

        // Fade particles based on scroll
        if (particles) {
            particles.material.opacity = Math.max(0.1, 0.6 - scrollPercent * 0.4);
        }

        // Rotate geometry based on scroll
        if (geometryCore) {
            geometryCore.rotation.x = scrollPercent * Math.PI * 2;
            geometryCore.rotation.y = scrollPercent * Math.PI;
        }
    }

    function animate() {
        animationId = requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        // Rotate particles slowly
        if (particles) {
            particles.rotation.y += 0.0003;
            particles.rotation.x += 0.0001;

            // Subtle mouse influence on particles
            particles.rotation.y += mouseX * 0.0002;
            particles.rotation.x += mouseY * 0.0002;
        }

        // Animate core geometry
        if (geometryCore) {
            geometryCore.rotation.x += 0.003;
            geometryCore.rotation.y += 0.005;
            geometryCore.position.y = Math.sin(elapsed * 0.5) * 20;
        }

        // Animate torus
        const torus = scene.getObjectByName('torus');
        if (torus) {
            torus.rotation.x = elapsed * 0.3;
            torus.rotation.y = elapsed * 0.2;
        }

        // Animate floating spheres
        for (let i = 0; i < 8; i++) {
            const sphere = scene.getObjectByName(`floatSphere_${i}`);
            if (sphere) {
                sphere.position.y += Math.sin(elapsed + i) * 0.3;
                sphere.position.x += Math.cos(elapsed * 0.5 + i) * 0.2;
            }
        }

        // Camera follows mouse subtly
        camera.position.x += (mouseX * 30 - camera.position.x) * 0.02;
        camera.position.y += (mouseY * 30 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
