const { createApp, ref, onMounted, watch, nextTick } = Vue;

const app = createApp({
    setup() {
        const activeProject = ref(null);
        
        const projects = ref([
            { 
              id: 'delivery', 
              title: '(Project Rudy) Delivery App', 
              subtitle: 'Similar to Grab / Food Panda', 
              desc: 'A simple mobile delivery app featuring real-time tracking, order management, and a seamless checkout experience.', 
              image: 'css/assets/delivery.png',
              media: [
                    { type: 'video', src: 'css/assets/pr1.mp4', alt: 'Delivery Ad Demo Video' },
                    { type: 'video', src: 'css/assets/pr2.mp4', alt: 'Delivery Ad 2 Video' }
                ] 
            },

            { 
                id: 'game', 
                title: '(Friendle) Interactive Choice Game', 
                subtitle: 'Chatting Strangers Parody', 
                desc: 'A web-based narrative experience mimicking random chat websites.', 
                image: 'css/assets/chat.png',
            },
            { 
                id: 'ebook', 
                title: 'Voice Assisted E-Book', 
                subtitle: 'Accessibility-focused Reading', 
                desc: 'A simple python code with voice commands and text-to-speech technology.', 
                image: 'css/assets/ebook.png' 
            },
            { 
                id: 'shoes', 
                title: '(DropStock) Shoe Selling Website', 
                subtitle: 'Shoe Selling Website Community Forum', 
                desc: 'Developed the social hub of the platform, allowing sneakerheads to discuss trends.', 
                image: 'css/assets/shoe.png',
                media: [
                    { type: 'image', src: 'css/assets/dropstockdemo.png', alt: 'DropStock Demo' },
                    { type: 'image', src: 'css/assets/dropstockdemo2.png', alt: 'DropStock Demo 2' }
                ] 
            },
            { 
                id: 'matchmake', 
                title: '(La-Love) Love/Matchmade Tester', 
                subtitle: 'Front-end design', 
                desc: 'A matchmaking website where you measure your chance with your crush.', 
                image: 'css/assets/love.png',
                media: [
                    { type: 'image', src: 'css/assets/matchmakedemo.png', alt: 'Matchmake Demo' } 
                ] 
            }
        ]);

        const shatterText = (el) => {
            if (!el) return;
            const text = el.textContent;
            el.innerHTML = ''; 
            [...text].forEach(char => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char; 
                span.classList.add('bop-letter');
                el.appendChild(span);
            });
        };

        watch(activeProject, async (newVal) => {
            if (newVal) {
                await nextTick();
                const dynamicTitle = document.querySelector('.details-content h2');
                shatterText(dynamicTitle);

                const carouselEl = document.querySelector('.carousel');
                if (carouselEl && window.bootstrap) {
                   const carouselInstance = bootstrap.Carousel.getOrCreateInstance(carouselEl, {
                        interval: false, // No timer
                        ride: false      // No auto-start
                    });
                    carouselInstance.pause();
                }
            }
        });

        const selectProject = (project) => {
            if (activeProject.value?.id === project.id) return;
            activeProject.value = project;
        };

        onMounted(() => {
            initVanillaLogic();
            initParticles();
            initBopEffect();
            initLocalVideoPauser();
        });

        return { projects, activeProject, selectProject };
    }
});

function initLocalVideoPauser() {
    const expSection = document.getElementById('exp');
    
    expSection.addEventListener('slide.bs.carousel', function () {
        const videos = expSection.querySelectorAll('video');
        
        videos.forEach(video => {
            video.pause();
        });
    });
}

function initVanillaLogic() {
    const shadow = document.querySelector('.cursor-shadow');
    
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX + 'px';
        const y = e.clientY + 'px';
        
        // Updates the background spotlight (--x, --y)
        document.documentElement.style.setProperty('--x', x);
        document.documentElement.style.setProperty('--y', y);

        // Updates the mix-blend-mode cursor shadow
        if (shadow) {
            shadow.style.setProperty('--x', x);
            shadow.style.setProperty('--y', y);
        }
    });

    // Education Image Hover
    const eduItems = document.querySelectorAll('.custom-list li');
    const displayImg = document.getElementById('edu-display-img');
    if (displayImg) {
        eduItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                displayImg.classList.add('img-fade');
                setTimeout(() => {
                    displayImg.src = this.getAttribute('data-image');
                    displayImg.classList.remove('img-fade');
                }, 300);
            });
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('reveal'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.content-section').forEach(s => observer.observe(s));
}

function initBopEffect() {
    const targets = document.querySelectorAll('.display-2, h2:not(.details-content h2), .bop-text');
    targets.forEach(target => {
        const text = target.textContent;
        target.innerHTML = ''; 
        [...text].forEach(char => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char; 
            span.classList.add('bop-letter');
            target.appendChild(span);
        });
    });
}

function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor(x, y) {
            this.x = x; this.y = y;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 1.5;
            this.speedY = (Math.random() - 0.5) * 1.5;
            this.life = 1.0;
        }
        update() { this.x += this.speedX; this.y += this.speedY; this.life -= 0.01; }
        draw() {
            ctx.fillStyle = `rgba(0, 0, 0, ${this.life * 0.2})`;
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }
    }

    window.addEventListener('mousemove', (e) => {
        for (let i = 0; i < 1; i++) particles.push(new Particle(e.clientX, e.clientY));
    });

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles = particles.filter(p => p.life > 0);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
}

app.mount('#app');