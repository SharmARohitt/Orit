// GSAP Initialization
gsap.registerPlugin(ScrollTrigger);

// Global variables
let scene, camera, renderer, particles, particleSystem;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCustomCursor();
    initParticleSystem();
    initTradingChart();
    initMiniChart();
    initBlockchainVisualization();
    initScrollAnimations();
    initNavigation();
    initCounterAnimations();
    setupInteractiveElements();
});

// Custom Cursor
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');

    if (!cursor) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    // Update cursor position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    // Smooth ring animation
    function animateRing() {
        ringX += (mouseX - ringX) * 0.1;
        ringY += (mouseY - ringY) * 0.1;
        
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
        
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effects
    const hoverElements = document.querySelectorAll('button, a, .feature-card, .tech-feature, .asset-category');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursorRing.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorRing.style.borderColor = 'rgba(102, 255, 255, 0.8)';
            cursorDot.style.background = '#66ffff';
        });
        
        element.addEventListener('mouseleave', () => {
            cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorRing.style.borderColor = 'rgba(102, 255, 255, 0.3)';
            cursorDot.style.background = '#66ffff';
        });
    });
}

// Particle System using Canvas
function initParticleSystem() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    
    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.life = Math.random() * 100 + 100;
            this.maxLife = this.life;
            this.size = Math.random() * 2 + 1;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life--;
            
            // Wrap around screen
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
            
            // Reset particle when life ends
            if (this.life <= 0) {
                this.life = this.maxLife;
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
            }
        }
        
        draw() {
            const opacity = this.life / this.maxLife;
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
            gradient.addColorStop(0, `rgba(102, 255, 255, ${opacity * 0.8})`);
            gradient.addColorStop(1, `rgba(102, 255, 255, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Create particles
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
        particles.forEach((particle, i) => {
            particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const opacity = (100 - distance) / 100;
                    ctx.strokeStyle = `rgba(102, 255, 255, ${opacity * 0.2})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Trading Chart Animation
function initTradingChart() {
    const canvas = document.getElementById('trading-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    let animationFrame = 0;
    const dataPoints = [];
    
    // Generate initial data
    for (let i = 0; i < 50; i++) {
        dataPoints.push({
            x: i * (canvas.offsetWidth / 49),
            y: Math.random() * canvas.offsetHeight * 0.6 + canvas.offsetHeight * 0.2,
            target: Math.random() * canvas.offsetHeight * 0.6 + canvas.offsetHeight * 0.2
        });
    }

    function animateChart() {
        ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
        
        // Update data points
        dataPoints.forEach((point, i) => {
            if (Math.random() < 0.02) { // Randomly update target
                point.target = Math.random() * canvas.offsetHeight * 0.6 + canvas.offsetHeight * 0.2;
            }
            point.y += (point.target - point.y) * 0.05;
        });
        
        // Draw gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.offsetHeight);
        gradient.addColorStop(0, 'rgba(102, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(102, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, canvas.offsetHeight);
        dataPoints.forEach((point, i) => {
            if (i === 0) ctx.lineTo(point.x, point.y);
            else ctx.lineTo(point.x, point.y);
        });
        ctx.lineTo(canvas.offsetWidth, canvas.offsetHeight);
        ctx.closePath();
        ctx.fill();
        
        // Draw line
        ctx.strokeStyle = '#66ffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        dataPoints.forEach((point, i) => {
            if (i === 0) ctx.moveTo(point.x, point.y);
            else ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
        
        // Draw glow effect
        ctx.shadowColor = '#66ffff';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        animationFrame++;
        requestAnimationFrame(animateChart);
    }
    
    animateChart();
}

// Mini Chart for Mobile Interface
function initMiniChart() {
    const canvas = document.getElementById('mini-chart-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const dataPoints = [];
    for (let i = 0; i < 20; i++) {
        dataPoints.push(Math.random() * canvas.offsetHeight * 0.6 + canvas.offsetHeight * 0.2);
    }

    function drawMiniChart() {
        ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
        
        // Draw bars
        const barWidth = canvas.offsetWidth / dataPoints.length;
        dataPoints.forEach((value, i) => {
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.offsetHeight);
            gradient.addColorStop(0, '#00ff88');
            gradient.addColorStop(1, 'rgba(0, 255, 136, 0.3)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(i * barWidth, canvas.offsetHeight - value, barWidth - 1, value);
        });
        
        // Update data occasionally
        if (Math.random() < 0.1) {
            dataPoints.shift();
            dataPoints.push(Math.random() * canvas.offsetHeight * 0.6 + canvas.offsetHeight * 0.2);
        }
        
        setTimeout(drawMiniChart, 1000);
    }
    
    drawMiniChart();
}

// Blockchain Visualization
function initBlockchainVisualization() {
    const canvas = document.getElementById('blockchain-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const blocks = [];
    const numBlocks = 15;
    
    // Create blocks
    for (let i = 0; i < numBlocks; i++) {
        blocks.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 30 + 20,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.02,
            glowIntensity: Math.random(),
            connections: []
        });
    }
    
    // Create connections
    blocks.forEach((block, i) => {
        const numConnections = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < numConnections; j++) {
            const targetIndex = Math.floor(Math.random() * blocks.length);
            if (targetIndex !== i) {
                block.connections.push(targetIndex);
            }
        }
    });

    function animateBlockchain() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update blocks
        blocks.forEach(block => {
            block.rotation += block.rotationSpeed;
            block.glowIntensity = Math.sin(Date.now() * 0.003 + block.x) * 0.5 + 0.5;
        });
        
        // Draw connections
        blocks.forEach((block, i) => {
            block.connections.forEach(targetIndex => {
                const target = blocks[targetIndex];
                const gradient = ctx.createLinearGradient(block.x, block.y, target.x, target.y);
                gradient.addColorStop(0, `rgba(102, 255, 255, ${block.glowIntensity * 0.3})`);
                gradient.addColorStop(1, `rgba(102, 255, 255, ${target.glowIntensity * 0.3})`);
                
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(block.x, block.y);
                ctx.lineTo(target.x, target.y);
                ctx.stroke();
            });
        });
        
        // Draw blocks
        blocks.forEach(block => {
            ctx.save();
            ctx.translate(block.x, block.y);
            ctx.rotate(block.rotation);
            
            // Glow effect
            const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, block.size);
            glowGradient.addColorStop(0, `rgba(102, 255, 255, ${block.glowIntensity * 0.5})`);
            glowGradient.addColorStop(1, 'rgba(102, 255, 255, 0)');
            
            ctx.fillStyle = glowGradient;
            ctx.fillRect(-block.size, -block.size, block.size * 2, block.size * 2);
            
            // Block outline
            ctx.strokeStyle = `rgba(102, 255, 255, ${block.glowIntensity})`;
            ctx.lineWidth = 2;
            ctx.strokeRect(-block.size/2, -block.size/2, block.size, block.size);
            
            ctx.restore();
        });
        
        requestAnimationFrame(animateBlockchain);
    }
    
    animateBlockchain();
}

// Scroll Animations
function initScrollAnimations() {
    // Hero animations
    gsap.from('.hero-title .title-line', {
        duration: 1,
        y: 100,
        opacity: 0,
        stagger: 0.2,
        ease: 'power3.out'
    });

    gsap.from('.hero-description', {
        duration: 1,
        y: 50,
        opacity: 0,
        delay: 0.5,
        ease: 'power3.out'
    });

    gsap.from('.hero-buttons .primary-button, .hero-buttons .secondary-button', {
        duration: 1,
        y: 50,
        opacity: 0,
        stagger: 0.2,
        delay: 0.8,
        ease: 'power3.out'
    });

    gsap.from('.hero-stats .stat-item', {
        duration: 1,
        y: 30,
        opacity: 0,
        stagger: 0.1,
        delay: 1.2,
        ease: 'power3.out'
    });

    gsap.from('.trading-dashboard', {
        duration: 1.5,
        x: 100,
        opacity: 0,
        delay: 0.3,
        ease: 'power3.out'
    });

    // Floating elements animation
    gsap.to('.floating-crypto', {
        duration: 20,
        rotation: 360,
        repeat: -1,
        ease: 'none'
    });

    // Features section
    ScrollTrigger.create({
        trigger: '.features-section',
        start: 'top 80%',
        onEnter: () => {
            gsap.from('.feature-card', {
                duration: 0.8,
                y: 100,
                opacity: 0,
                stagger: 0.2,
                ease: 'power3.out'
            });
        }
    });

    // Technology section
    ScrollTrigger.create({
        trigger: '.technology-section',
        start: 'top 80%',
        onEnter: () => {
            gsap.from('.tech-feature', {
                duration: 0.8,
                x: -100,
                opacity: 0,
                stagger: 0.2,
                ease: 'power3.out'
            });
        }
    });

    // Platform section
    ScrollTrigger.create({
        trigger: '.platform-section',
        start: 'top 80%',
        onEnter: () => {
            gsap.from('.platform-left', {
                duration: 1,
                x: -100,
                opacity: 0,
                ease: 'power3.out'
            });
            
            gsap.from('.device-showcase', {
                duration: 1,
                x: 100,
                opacity: 0,
                delay: 0.3,
                ease: 'power3.out'
            });
        }
    });

    // Trust section
    ScrollTrigger.create({
        trigger: '.trust-section',
        start: 'top 80%',
        onEnter: () => {
            gsap.from('.trust-stat', {
                duration: 0.8,
                y: 50,
                opacity: 0,
                stagger: 0.1,
                ease: 'power3.out'
            });
        }
    });

    // Parallax effects for background elements
    gsap.to('.gradient-orb', {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });
}

// Navigation
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
        
        // Change navbar background on scroll
        if (scrollTop > 50) {
            navbar.style.background = 'rgba(10, 10, 15, 0.95)';
        } else {
            navbar.style.background = 'rgba(10, 10, 15, 0.8)';
        }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Counter animations
function initCounterAnimations() {
    function animateCounter(element, target, duration) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target + (element.dataset.suffix || '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start) + (element.dataset.suffix || '');
            }
        }, 16);
    }

    // Animate stat numbers
    ScrollTrigger.create({
        trigger: '.hero-stats',
        start: 'top 80%',
        onEnter: () => {
            document.querySelectorAll('.stat-number').forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/[^\d]/g, ''));
                const suffix = text.replace(/[\d]/g, '');
                stat.dataset.suffix = suffix;
                animateCounter(stat, number, 2000);
            });
        }
    });

    // Animate trust stats
    ScrollTrigger.create({
        trigger: '.trust-stats',
        start: 'top 80%',
        onEnter: () => {
            document.querySelectorAll('.icon-text').forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/[^\d]/g, ''));
                const suffix = text.replace(/[\d]/g, '');
                stat.dataset.suffix = suffix;
                animateCounter(stat, number, 2000);
            });
        }
    });
}

// Interactive Elements
function setupInteractiveElements() {
    // Button hover effects
    document.querySelectorAll('.primary-button').forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                duration: 0.3,
                scale: 1.05,
                boxShadow: '0 15px 50px rgba(102, 255, 255, 0.5)',
                ease: 'power2.out'
            });
        });
        
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                duration: 0.3,
                scale: 1,
                boxShadow: '0 10px 40px rgba(102, 255, 255, 0.4)',
                ease: 'power2.out'
            });
        });
    });

    // Card tilt effects
    document.querySelectorAll('.feature-card, .tech-feature').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            gsap.to(card, {
                duration: 0.3,
                rotationX: rotateX,
                rotationY: rotateY,
                transformPerspective: 1000,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.5,
                rotationX: 0,
                rotationY: 0,
                ease: 'power2.out'
            });
        });
    });

    // Asset price updates
    function updateAssetPrices() {
        const assets = document.querySelectorAll('.asset-item');
        assets.forEach(asset => {
            const priceElement = asset.querySelector('.asset-price');
            const changeElement = asset.querySelector('.asset-change');
            
            if (Math.random() < 0.3) { // 30% chance to update
                const currentPrice = parseFloat(priceElement.textContent.replace(/[$,]/g, ''));
                const changePercent = (Math.random() - 0.5) * 0.1; // -5% to +5%
                const newPrice = currentPrice * (1 + changePercent);
                
                priceElement.textContent = '$' + newPrice.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
                
                const changeValue = changePercent * 100;
                changeElement.textContent = (changeValue > 0 ? '+' : '') + changeValue.toFixed(2) + '%';
                changeElement.className = 'asset-change ' + (changeValue > 0 ? 'positive' : 'negative');
                
                // Flash effect
                gsap.fromTo(asset, {
                    backgroundColor: changeValue > 0 ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 71, 87, 0.2)'
                }, {
                    duration: 0.5,
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    ease: 'power2.out'
                });
            }
        });
    }

    // Update prices every 3 seconds
    setInterval(updateAssetPrices, 3000);

    // Voice command simulation
    const voiceButtons = document.querySelectorAll('.action-button.voice');
    voiceButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Simulate voice recognition
            gsap.to(button, {
                duration: 0.1,
                scale: 0.95,
                yoyo: true,
                repeat: 1
            });
            
            // Create ripple effect
            if (button.querySelector('.voice-ripple')) return;
            
            const ripple = document.createElement('div');
            ripple.className = 'voice-ripple';
            ripple.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                background: rgba(102, 255, 255, 0.3);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                pointer-events: none;
            `;
            
            button.style.position = 'relative';
            button.appendChild(ripple);
            
            gsap.to(ripple, {
                duration: 1,
                width: '200px',
                height: '200px',
                opacity: 0,
                ease: 'power2.out',
                onComplete: () => ripple.remove()
            });
        });
    });

    // Loading states for buttons
    document.querySelectorAll('.cta-button, .primary-button').forEach(button => {
        button.addEventListener('click', () => {
            const originalText = button.querySelector('span').textContent;
            const span = button.querySelector('span');
            
            // Show loading state
            span.textContent = 'Loading...';
            button.style.pointerEvents = 'none';
            
            // Simulate loading
            setTimeout(() => {
                span.textContent = originalText;
                button.style.pointerEvents = 'auto';
            }, 2000);
        });
    });
}

// Utility function for random colors
function getRandomColor() {
    const colors = ['#0066ff', '#00ccff', '#66ffff', '#00ff88', '#8b5cf6'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Resize handler
window.addEventListener('resize', () => {
    // Recalculate positions for responsive elements
    if (window.innerWidth < 768) {
        // Mobile adjustments
        gsap.set('.floating-crypto', { scale: 0.5 });
    } else {
        gsap.set('.floating-crypto', { scale: 1 });
    }
});

// Performance monitoring
let lastTime = performance.now();
let frameCount = 0;
let fps = 0;

function updateFPS() {
    frameCount++;
    const currentTime = performance.now();
    
    if (currentTime >= lastTime + 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;
        
        // Adjust animation quality based on performance
        if (fps < 30) {
            // Reduce particle count or animation complexity
            document.body.classList.add('low-performance');
        } else {
            document.body.classList.remove('low-performance');
        }
    }
    
    requestAnimationFrame(updateFPS);
}

updateFPS();

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}