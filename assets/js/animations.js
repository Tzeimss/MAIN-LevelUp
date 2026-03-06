// Scroll Animation Manager
class ScrollAnimationManager {
    constructor() {
        this.animatingElements = [];
        this.init();
    }

    init() {
        this.setupScrollListener();
        this.cacheElements();
    }

    cacheElements() {
        this.animatingElements = document.querySelectorAll('[data-animate]');
    }

    setupScrollListener() {
        const handleScroll = () => {
            this.animatingElements.forEach(element => {
                if (!element.animated) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        setTimeout(() => {
                            element.classList.add('animated');
                            element.animated = true;
                        }, element.getAttribute('data-delay') || 0);
                    }
                }
            });
        };
        window.addEventListener('scroll', () => requestAnimationFrame(handleScroll));
        handleScroll();
    }
}

// Initialize on document load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ScrollAnimationManager());
} else {
    new ScrollAnimationManager();
}

// Particle Effect for hero section
class ParticleEffect {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.init();
    }

    init() {
        // Create canvas for particles
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        `;
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.particles.length < 50) {
            this.particles.push(new Particle(this.canvas.width, this.canvas.height));
        }

        this.particles = this.particles.filter(p => {
            p.update();
            p.draw(this.ctx);
            return p.opacity > 0;
        });

        requestAnimationFrame(() => this.animate());
    }
}

class Particle {
    constructor(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.color = Math.random() > 0.5 ? '#d4af37' : '#2196F3';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity -= 0.002;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// Number Counter Animation
class CounterAnimation {
    constructor() {
        this.init();
    }

    init() {
        const items = document.querySelectorAll('.stat-item h4');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.animated) {
                    this.animateCounter(entry.target);
                    entry.target.animated = true;
                }
            });
        }, { threshold: 0.5 });

        items.forEach(item => observer.observe(item));
    }

    animateCounter(element) {
        const text = element.textContent;
        const isSymbol = text === '∞';
        const finalValue = parseInt(text) || 0;

        if (isSymbol) {
            element.style.animation = 'pulse 2s ease-in-out infinite';
            return;
        }

        let current = 0;
        const increment = Math.ceil(finalValue / 30);
        const interval = setInterval(() => {
            current += increment;
            if (current >= finalValue) {
                element.textContent = finalValue;
                clearInterval(interval);
            } else {
                element.textContent = current;
            }
        }, 30);
    }
}

// Initialize counter animation
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new CounterAnimation());
} else {
    new CounterAnimation();
}

// Parallax effect for hero section
function setupParallax() {
    const heroBackground = document.querySelector('.hero-background');
    if (!heroBackground) return;

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        heroBackground.style.transform = `translateY(${scrollPosition * 0.5}px)`;
    });
}

document.addEventListener('DOMContentLoaded', setupParallax);

// Smooth hover effects for cards
function setupCardHoverEffects() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

document.addEventListener('DOMContentLoaded', setupCardHoverEffects);

// Text reveal animation
function setupTextReveal() {
    const elements = document.querySelectorAll('[data-reveal]');
    elements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        let index = 0;

        const timer = setInterval(() => {
            if (index < text.length) {
                element.textContent += text[index];
                index++;
            } else {
                clearInterval(timer);
            }
        }, 40);
    });
}

// Modal functionality
class Modal {
    constructor() {
        this.modal = null;
    }

    open(content) {
        this.modal = document.createElement('div');
        this.modal.className = 'modal animate-fade-in';
        this.modal.innerHTML = `
            <div class="modal-content animate-bounce">
                <span class="close">&times;</span>
                ${content}
            </div>
        `;

        document.body.appendChild(this.modal);
        this.modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;

        this.modal.querySelector('.close').addEventListener('click', () => this.close());
    }

    close() {
        if (this.modal) {
            this.modal.remove();
            this.modal = null;
        }
    }
}

// Export Modal for global use
window.Modal = Modal;

// Lazy load images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

document.addEventListener('DOMContentLoaded', setupLazyLoading);

// Wave animation effect
class WaveAnimation {
    constructor(element) {
        this.element = element;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        this.animate();
    }

    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = 100;
        this.canvas.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100px;
        `;
        this.element.appendChild(this.canvas);
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
        });
    }

    animate() {
        let time = 0;
        const animate = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.strokeStyle = '#d4af37';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();

            for (let x = 0; x < this.canvas.width; x++) {
                const y = this.canvas.height / 2 + Math.sin(x * 0.01 + time) * 20;
                if (x === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            this.ctx.stroke();
            time += 0.05;
            requestAnimationFrame(animate);
        };
        animate();
    }
}

// Confetti effect for celebrations
class ConfettiEffect {
    static burst() {
        const colors = ['#d4af37', '#2196F3', '#9c27b0', '#f44336'];
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                top: -10px;
                border-radius: 50%;
                pointer-events: none;
                z-index: 999;
            `;
            document.body.appendChild(confetti);

            const duration = Math.random() * 2 + 2;
            confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight + 10}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: duration * 1000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => confetti.remove();
        }
    }
}

// Export for global use
window.ConfettiEffect = ConfettiEffect;

// Initialize all animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // You can add additional initialization here
});
