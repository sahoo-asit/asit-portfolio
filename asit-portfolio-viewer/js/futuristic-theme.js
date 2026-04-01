// Futuristic Dark Theme with Glassmorphism and Neon Effects
// Transforms the portfolio into a modern AI-powered dark theme

(function() {
    'use strict';

    function applyFuturisticTheme() {
        // Inject futuristic CSS
        const style = document.createElement('style');
        style.id = 'futuristic-theme';
        style.textContent = `
            /* ===== FUTURISTIC DARK THEME ===== */
            :root {
                --bg-primary: #0a0a0f;
                --bg-secondary: #12121a;
                --bg-card: rgba(20, 20, 35, 0.7);
                --text-primary: #ffffff;
                --text-secondary: #a0a0b0;
                --accent-primary: #667eea;
                --accent-secondary: #764ba2;
                --accent-cyan: #00d4ff;
                --accent-pink: #ff006e;
                --accent-green: #00ff88;
                --glass-bg: rgba(255, 255, 255, 0.03);
                --glass-border: rgba(255, 255, 255, 0.08);
                --glow-primary: 0 0 40px rgba(102, 126, 234, 0.3);
                --glow-cyan: 0 0 30px rgba(0, 212, 255, 0.25);
            }

            /* Base styles */
            body {
                background: var(--bg-primary) !important;
                color: var(--text-primary) !important;
                overflow-x: hidden;
            }

            /* Animated gradient background */
            body::before {
                content: '';
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background: 
                    radial-gradient(ellipse at 20% 20%, rgba(102, 126, 234, 0.15) 0%, transparent 50%),
                    radial-gradient(ellipse at 80% 80%, rgba(118, 75, 162, 0.12) 0%, transparent 50%),
                    radial-gradient(ellipse at 50% 50%, rgba(0, 212, 255, 0.05) 0%, transparent 60%);
                pointer-events: none;
                z-index: -1;
            }

            /* Grid overlay */
            body::after {
                content: '';
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background-image: 
                    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
                background-size: 50px 50px;
                pointer-events: none;
                z-index: -1;
            }

            /* Navigation */
            nav {
                background: rgba(10, 10, 15, 0.85) !important;
                backdrop-filter: blur(20px) saturate(180%) !important;
                -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
                border-bottom: 1px solid var(--glass-border) !important;
            }
            nav h1, nav a {
                color: var(--text-primary) !important;
            }
            nav a:hover {
                color: var(--accent-cyan) !important;
                text-shadow: 0 0 20px var(--accent-cyan);
            }

            /* Hero section */
            .hero-bg, section:first-of-type {
                background: transparent !important;
                min-height: 100vh;
            }

            /* Section backgrounds */
            section {
                background: transparent !important;
            }
            section:nth-child(even) {
                background: rgba(18, 18, 26, 0.5) !important;
            }

            /* Headings */
            h1, h2, h3, h4, h5, h6 {
                color: var(--text-primary) !important;
            }
            h2 {
                background: linear-gradient(135deg, var(--accent-cyan), var(--accent-primary), var(--accent-secondary));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            /* Text */
            p, span, li {
                color: var(--text-secondary) !important;
            }
            a {
                color: var(--accent-cyan) !important;
            }

            /* Cards - Glassmorphism */
            .bg-white, .bg-gray-50, .bg-gray-100,
            [class*="rounded-lg"][class*="shadow"],
            .modern-card {
                background: var(--bg-card) !important;
                backdrop-filter: blur(20px) !important;
                -webkit-backdrop-filter: blur(20px) !important;
                border: 1px solid var(--glass-border) !important;
                box-shadow: var(--glow-primary) !important;
            }
            .bg-white:hover, .modern-card:hover {
                border-color: rgba(102, 126, 234, 0.3) !important;
                box-shadow: var(--glow-primary), 0 20px 40px rgba(0,0,0,0.3) !important;
            }

            /* Skill tags */
            .bg-blue-100, .bg-blue-50, .bg-purple-100, .bg-green-100, .bg-yellow-100 {
                background: rgba(102, 126, 234, 0.15) !important;
                border: 1px solid rgba(102, 126, 234, 0.3) !important;
                color: var(--accent-cyan) !important;
            }

            /* Progress bars */
            .bg-blue-600, .bg-gradient-to-r {
                background: linear-gradient(90deg, var(--accent-primary), var(--accent-cyan)) !important;
                box-shadow: 0 0 15px rgba(0, 212, 255, 0.4);
            }
            .bg-gray-200 {
                background: rgba(255, 255, 255, 0.1) !important;
            }

            /* Buttons */
            button, .btn, [class*="bg-blue-600"], [class*="bg-gradient"] {
                background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)) !important;
                border: none !important;
                box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4) !important;
                transition: all 0.3s ease !important;
            }
            button:hover, .btn:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 8px 30px rgba(102, 126, 234, 0.6) !important;
            }

            /* Border colors */
            .border-t-4, .border-blue-600, .border-purple-600, .border-green-600 {
                border-color: var(--accent-cyan) !important;
            }

            /* Icons */
            .text-blue-600, .text-purple-600, .text-green-600 {
                color: var(--accent-cyan) !important;
            }
            .fa-robot, .fa-brain, .fa-code {
                filter: drop-shadow(0 0 10px var(--accent-cyan));
            }

            /* Input fields */
            input, textarea, select {
                background: rgba(255, 255, 255, 0.05) !important;
                border: 1px solid var(--glass-border) !important;
                color: var(--text-primary) !important;
            }
            input:focus, textarea:focus {
                border-color: var(--accent-cyan) !important;
                box-shadow: 0 0 20px rgba(0, 212, 255, 0.2) !important;
            }
            input::placeholder, textarea::placeholder {
                color: var(--text-secondary) !important;
            }

            /* Scrollbar */
            ::-webkit-scrollbar {
                width: 8px;
                background: var(--bg-primary);
            }
            ::-webkit-scrollbar-thumb {
                background: linear-gradient(180deg, var(--accent-primary), var(--accent-secondary));
                border-radius: 4px;
            }

            /* Neon glow effects */
            .neon-text {
                text-shadow: 
                    0 0 10px var(--accent-cyan),
                    0 0 20px var(--accent-cyan),
                    0 0 40px var(--accent-cyan);
            }
            .neon-border {
                box-shadow: 
                    0 0 5px var(--accent-cyan),
                    0 0 10px var(--accent-cyan),
                    inset 0 0 5px rgba(0, 212, 255, 0.1);
            }

            /* Floating animation */
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
            .float-animation {
                animation: float 4s ease-in-out infinite;
            }

            /* Pulse glow */
            @keyframes pulseGlow {
                0%, 100% { box-shadow: 0 0 20px rgba(0, 212, 255, 0.3); }
                50% { box-shadow: 0 0 40px rgba(0, 212, 255, 0.6); }
            }

            /* Hide old 3D canvas if exists */
            #three-canvas {
                opacity: 0.3;
            }

            /* Avatar container adjustments for dark theme */
            #avatar-container #avatar-panel {
                background: rgba(20, 20, 35, 0.95) !important;
                border: 1px solid rgba(102, 126, 234, 0.3) !important;
            }
            #avatar-container #avatar-input {
                background: rgba(255, 255, 255, 0.05) !important;
                border-color: rgba(255, 255, 255, 0.1) !important;
                color: white !important;
            }
            #avatar-container .avatar-chip {
                background: rgba(102, 126, 234, 0.15) !important;
                border-color: rgba(102, 126, 234, 0.3) !important;
                color: var(--accent-cyan) !important;
            }
            #avatar-container .avatar-chip:hover {
                background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)) !important;
                color: white !important;
            }

            /* Section titles with cyber effect */
            section h2 {
                position: relative;
                display: inline-block;
            }
            section h2::after {
                content: '';
                position: absolute;
                bottom: -10px;
                left: 0;
                width: 60px;
                height: 3px;
                background: linear-gradient(90deg, var(--accent-cyan), transparent);
            }

            /* Cyber corners on cards */
            .cyber-corners {
                position: relative;
            }
            .cyber-corners::before,
            .cyber-corners::after {
                content: '';
                position: absolute;
                width: 20px;
                height: 20px;
                border: 2px solid var(--accent-cyan);
            }
            .cyber-corners::before {
                top: -5px; left: -5px;
                border-right: none; border-bottom: none;
            }
            .cyber-corners::after {
                bottom: -5px; right: -5px;
                border-left: none; border-top: none;
            }

            /* Scanline effect */
            .scanlines::before {
                content: '';
                position: absolute;
                top: 0; left: 0; right: 0; bottom: 0;
                background: repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 2px,
                    rgba(0, 0, 0, 0.1) 2px,
                    rgba(0, 0, 0, 0.1) 4px
                );
                pointer-events: none;
                z-index: 10;
            }
        `;
        document.head.appendChild(style);

        // Add cyber corners to main cards
        document.querySelectorAll('.bg-white.rounded-lg.shadow-lg').forEach(card => {
            card.classList.add('cyber-corners');
        });

        // Add neon effect to section headings
        document.querySelectorAll('section h2').forEach(h2 => {
            h2.style.textAlign = 'center';
        });

        console.log('🌟 Futuristic dark theme applied!');
    }

    // Apply theme on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyFuturisticTheme);
    } else {
        applyFuturisticTheme();
    }
})();
