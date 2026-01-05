const { createApp, ref, onMounted, watch, nextTick } = Vue;

let audioCtx;
let analyser;
let dataArray;
let source;
let audioVisualData = ref(0);

const app = createApp({
    setup() {
        // --- PORTFOLIO LOGIC ---
        const activeProject = ref(null);
        const projects = ref([
            { id: 'delivery', title: '(Project Rudy) Delivery App', subtitle: 'Similar to Grab / Food Panda', desc: 'A simple mobile delivery app featuring real-time tracking, order management, and a seamless checkout experience.', image: 'css/assets/delivery.png', media: [{ type: 'youtube', src: 'https://www.youtube.com/embed/CfkjJd6pFHY', alt: 'Delivery Ad Demo Video' }, { type: 'youtube', src: 'https://www.youtube.com/embed/cY8D7BRjUfk', alt: 'Delivery Ad 2 Video' }] },
            { id: 'game', title: '(Friendle) Interactive Choice Game', subtitle: 'Chatting Strangers Parody', desc: 'A web-based narrative experience mimicking random chat websites.', image: 'css/assets/chat.png' },
            { id: 'ebook', title: 'Voice Assisted E-Book', subtitle: 'Accessibility-focused Reading', desc: 'A simple python code with voice commands and text-to-speech technology.', image: 'css/assets/Ebook.png' },
            { id: 'shoes', title: '(DropStock) Shoe Selling Website', subtitle: 'Community Forum', desc: 'Developed the social hub of the platform, allowing sneakerheads to discuss trends.', image: 'css/assets/shoe.png', media: [{ type: 'image', src: 'css/assets/dropstockdemo.png', alt: 'DropStock Demo' }, { type: 'image', src: 'css/assets/dropstockdemo2.png', alt: 'DropStock Demo 2' }] },
            { id: 'matchmake', title: '(La-Love) Love Tester', subtitle: 'Front-end design', desc: 'A matchmaking website where you measure your chance with your crush.', image: 'css/assets/love.png', media: [{ type: 'image', src: 'css/assets/matchmakedemo.png', alt: 'Matchmake Demo' }] }
        ]);

        const selectProject = (project) => {
            if (activeProject.value?.id === project.id) return;
            activeProject.value = project;
        };

        // --- HOBBIES & AUDIO LOGIC ---
        const activeHobby = ref('music');
        const selectedCD = ref(null);
        const audioPlayer = new Audio(); 
        
        const isPlaying = ref(false);
        const isMuted = ref(false);
        const audioProgress = ref(0);
        const audioVolume = ref(1); 
        const rotationSpeed = ref('0s');

        const setupAnalyser = () => {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioCtx.createAnalyser();
                source = audioCtx.createMediaElementSource(audioPlayer);
                source.connect(analyser);
                analyser.connect(audioCtx.destination);
                analyser.fftSize = 256;
                dataArray = new Uint8Array(analyser.frequencyBinCount);
            }
            if (audioCtx.state === 'suspended') audioCtx.resume();
        };

        const hobbyData = ref({
            music: { title: 'Music', icon: 'fas fa-music', top5: [
                { name: "America's Next Freak", artist: "FM-Static", img: 'css/assets/song1.png', audio: 'music1.mp3' },
                { name: "Teenage Dirtbag", artist: "Wheatus", img: 'css/assets/song2.png', audio: 'music2.mp3' },
                { name: "Famous Last Words", artist: "My Chemical Romance", img: 'css/assets/song3.png', audio: 'music3.mp3' },
                { name: "Tears Over Beers", artist: "Modern Baseball", img: 'css/assets/song4.png', audio: 'music4.mp3' },
                { name: "Bullet proof Love", artist: "Pierce the Veil", img: 'css/assets/song5.png', audio: 'music5.mp3' },
                { name: "Hard Times", artist: "Paramore", img: 'css/assets/song6.png', audio: 'music6.mp3' }
            ]},
            games: { 
                title: 'Gaming', 
                icon: 'fas fa-ghost', 
                selectedGame: null,
                items: [
                    { name: 'Valorant', device: 'pc', color: '#ff4655', icon: 'https://i.pinimg.com/1200x/f5/dd/24/f5dd24b3418701f617275cfa6a265ac8.jpg' },
                    { name: 'Roblox', device: 'pc', color: '#4923c6ff', icon: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Roblox_Logo_2025.png' },
                    { name: 'Minecraft', device: 'pc', color: '#538b32', icon: 'https://images.icon-icons.com/2699/PNG/512/minecraft_logo_icon_168974.png' },
                    { name: 'Mobile Legends', device: 'mobile', color: '#d4ca3eff', icon: 'https://downloadr2.apkmirror.com/wp-content/uploads/2024/01/45/65ba54423faa3_com.mobile.legends.png' },
                    { name: 'Discord: khaoss.x', device: 'mobile', color: '#7753ecff', icon:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZkjJsjxdWHZx1bu22YA_cJm7bicMd7d_pfw&s' }
                ] 
            }, 
        });

        audioPlayer.ontimeupdate = () => {
            if (audioPlayer.duration) audioProgress.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        };

        audioPlayer.onended = () => {
            isPlaying.value = false;
            audioProgress.value = 0;
            rotationSpeed.value = '0s';
        };

        const handleHobbyChange = (key) => {
            activeHobby.value = key;
            if (key !== 'music') {
                audioPlayer.pause();
                isPlaying.value = false;
                selectedCD.value = null;
            }
        };

        const playCD = (cd) => {
            setupAnalyser();
            selectedCD.value = cd;
            audioPlayer.src = 'css/assets/' + cd.audio;
            audioPlayer.load();
            audioPlayer.play().then(() => {
                isPlaying.value = true;
                rotationSpeed.value = '3s';
            }).catch(e => console.error(e));
        };
        
        const togglePlay = () => {
            if (!selectedCD.value) return;
            setupAnalyser();
            if (audioPlayer.paused) {
                audioPlayer.play();
                isPlaying.value = true;
                rotationSpeed.value = '3s';
            } else {
                audioPlayer.pause();
                isPlaying.value = false;
                rotationSpeed.value = '0s';
            }
        };

        const updateVisuals = () => {
            if (analyser && isPlaying.value) {
                analyser.getByteFrequencyData(dataArray);
                let sum = 0;
                for(let i = 0; i < 12; i++) sum += dataArray[i];
                audioVisualData.value = sum / 12; 
                
                const cdImg = document.querySelector('.cd-display img');
                if (cdImg) {
                    const bass = audioVisualData.value;
                    const hue = (Date.now() / 5) % 360;
                    const intensity = bass / 25;
                    const shakeX = (Math.random() - 0.5) * intensity;
                    const shakeY = (Math.random() - 0.5) * intensity;
                    const scale = 1 + (bass / 150);
                    
                    cdImg.style.transform = `scale(${scale}) translate(${shakeX}px, ${shakeY}px)`;
                    cdImg.style.filter = `
                        drop-shadow(0 0 ${bass/4}px hsla(${hue}, 100%, 50%, 0.9))
                        drop-shadow(0 0 ${bass/8}px white)
                        brightness(${1 + bass/255})
                    `;
                }
            } else {
                audioVisualData.value = 0;
                const cdImg = document.querySelector('.cd-display img');
                if(cdImg) {
                    cdImg.style.filter = 'none';
                    cdImg.style.transform = 'scale(1)';
                }
            }
            requestAnimationFrame(updateVisuals);
        };
        updateVisuals();

        const restartAudio = () => { audioPlayer.currentTime = 0; };
        const toggleMute = () => { isMuted.value = !isMuted.value; audioPlayer.muted = isMuted.value; };
        const setVolume = (e) => { audioVolume.value = e.target.value; audioPlayer.volume = e.target.value; };
        const seekAudio = (e) => {
            if (!audioPlayer.duration) return;
            const rect = e.currentTarget.getBoundingClientRect();
            audioPlayer.currentTime = ((e.clientX - rect.left) / rect.width) * audioPlayer.duration;
        };

        const launchGame = (game) => {
            hobbyData.value.games.selectedGame = null;
            setTimeout(() => {
                hobbyData.value.games.selectedGame = game;
            }, 100);
        };

        // --- HEART GALLERY LOGIC ---
        const galleryItems = ref([
            { type: 'image', src: 'css/assets/gallery/1.jpg' }, 
            { type: 'image', src: 'css/assets/gallery/2.jpg' }, 
            { type: 'image', src: 'css/assets/gallery/3.jpg' },
            { type: 'image', src: 'css/assets/gallery/4.jpg' }, 
            { type: 'image', src: 'css/assets/gallery/5.png' }, 
            { type: 'image', src: 'css/assets/gallery/6.jpg' },
            { type: 'image', src: 'css/assets/gallery/7.jpg' }, 
            { type: 'image', src: 'css/assets/gallery/8.jpg' }, 
            { type: 'video', src: 'css/assets/gallery/9.mp4' },
            { type: 'image', src: 'css/assets/gallery/10.jpg' }, 
            { type: 'image', src: 'css/assets/gallery/11.jpg' }, 
            { type: 'image', src: 'css/assets/gallery/12.jpg' },
            { type: 'image', src: 'css/assets/gallery/13.jpg' }           
        ]);

        const showModal = ref(false);
        const selectedItem = ref(null);

        const openModal = (item) => {
            selectedItem.value = item;
            showModal.value = true;
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            showModal.value = false;
            selectedItem.value = null;
            document.body.style.overflow = 'auto';
        };

        // --- GUESTBOOK LOGIC ---
        const guestbookComments = ref(JSON.parse(localStorage.getItem('portfolio-comments')) || []);
        const newGuestName = ref('');
        const newGuestMessage = ref('');
        const messageInput = ref(null);

        const focusMessage = () => {
            if(messageInput.value) messageInput.value.focus();
        };

        const addComment = () => {
            if (!newGuestName.value.trim() || !newGuestMessage.value.trim()) return;

            const newEntry = {
                id: Date.now(),
                name: newGuestName.value,
                message: newGuestMessage.value,
                date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            };

            guestbookComments.value.unshift(newEntry);
            localStorage.setItem('portfolio-comments', JSON.stringify(guestbookComments.value));

            // Reset
            newGuestName.value = '';
            newGuestMessage.value = '';
        };

        const deleteComment = (id) => {
            guestbookComments.value = guestbookComments.value.filter(c => c.id !== id);
            localStorage.setItem('portfolio-comments', JSON.stringify(guestbookComments.value));
        };

const resources = ref([
    {
        name: 'Google Search Engine',
        description: 'Used to find images and programming tutorials.',
        icon: 'fas fa-search',
        link: 'https://google.com'
    },
    {
        name: 'Font Awesome',
        description: 'Scalable vector icons used throughout the interface.',
        icon: 'fab fa-fort-awesome',
        link: 'https://fontawesome.com'
    },
    {
        name: 'Bootstrap',
        description: 'Responsive framework for layout and components.',
        icon: 'fab fa-bootstrap',
        link: 'https://getbootstrap.com'
    },
    {
        name: 'Canva',
        description: 'UI Design and graphics creation.',
        icon: 'fas fa-palette', 
        link: 'https://canva.com'
    },
    {
        name: 'Gemini AI',
        description: 'Help with logic, debugging, and code structure.',
        icon: 'fas fa-microchip',
        link: 'https://gemini.google.com/app'
    },
    {
        name: 'Microsoft Co-pilot',
        description: 'Assistance with complex logic and code generation.',
        icon: 'fab fa-microsoft',
        link: 'https://copilot.microsoft.com/'
    },
    {
        name: 'Github',
        description: 'Hosted code repository and webpage through Github Pages.',
        icon: 'fas fa-github',
        link: 'https://github.com/'
    },
    {
        name: 'Emoji Combos',
        description: 'For cute text and emoji decorations.',
        icon: 'fas fa-heart',
        link: 'https://emojicombos.com/heart'
    },    
]);

        onMounted(() => {
            initVanillaLogic();
            initParticles();
            initBopEffect();
            initLocalVideoPauser();

            window.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') closeModal();
            });
        });

        return { 
            projects, activeProject, selectProject, 
            activeHobby, hobbyData, selectedCD, 
            handleHobbyChange, playCD,
            isPlaying, isMuted, audioProgress,
            togglePlay, restartAudio, toggleMute, seekAudio, setVolume, audioVolume, rotationSpeed, 
            launchGame, galleryItems, showModal, selectedItem, openModal, closeModal,
            guestbookComments, newGuestName, newGuestMessage, messageInput, focusMessage, addComment, deleteComment, resources
        };
    }
});

// --- VANILLA FUNCTIONS ---

function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '9999'; 
    canvas.style.pointerEvents = 'none';

    const ctx = canvas.getContext('2d');
    let particles = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor(x, y) {
            this.x = x; this.y = y;
            this.baseSize = Math.random() * 2 + 1.5;
            this.size = this.baseSize;
            this.speedX = (Math.random() - 0.5) * 4; 
            this.speedY = (Math.random() - 0.5) * 4;
            this.life = 1.0;
            this.hue = (Date.now() / 10) % 360;
        }
        update(intensity) { 
            this.x += this.speedX * (1 + intensity/40); 
            this.y += this.speedY * (1 + intensity/40); 
            this.size = this.baseSize + (intensity / 15);
            this.life -= 0.012; 
            this.hue = (this.hue + 2) % 360; 
        }
        draw(intensity) {
            if (intensity > 1) {
                ctx.fillStyle = `hsla(${this.hue}, 100%, 65%, ${this.life})`;
                ctx.shadowBlur = intensity / 5;
                ctx.shadowColor = `hsla(${this.hue}, 100%, 50%, 0.8)`;
            } else {
                ctx.fillStyle = `rgba(200, 230, 255, ${this.life * 0.4})`;
                ctx.shadowBlur = 0;
            }
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0; 
        }
    }

    window.addEventListener('mousemove', (e) => {
        let count = audioVisualData.value > 30 ? 5 : 2;
        for (let i = 0; i < count; i++) particles.push(new Particle(e.clientX, e.clientY));
    });

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles = particles.filter(p => p.life > 0);
        particles.forEach(p => { 
            p.update(audioVisualData.value); 
            p.draw(audioVisualData.value); 
        });
        requestAnimationFrame(animate);
    }
    animate();
}

function initLocalVideoPauser() {
    const expSection = document.getElementById('exp');
    if (!expSection) return;
    expSection.addEventListener('slide.bs.carousel', function () {
        const videos = expSection.querySelectorAll('video');
        videos.forEach(v => v.pause());
        const iframes = expSection.querySelectorAll('iframe');
        iframes.forEach(i => { const s = i.src; i.src = s; });
    });
}

function initVanillaLogic() {
    const shadow = document.querySelector('.cursor-shadow');
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX + 'px'; const y = e.clientY + 'px';
        document.documentElement.style.setProperty('--x', x);
        document.documentElement.style.setProperty('--y', y);
        if (shadow) { shadow.style.setProperty('--x', x); shadow.style.setProperty('--y', y); }
    });
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('reveal'); });
    }, { threshold: 0.05 });
    document.querySelectorAll('.content-section').forEach(s => observer.observe(s));
}

function initBopEffect() {
    const targets = document.querySelectorAll('.display-2, h2:not(.details-content h2), .bop-text');
    targets.forEach(target => {
        const text = target.textContent;
        if(!text) return;
        target.innerHTML = ''; 
        [...text].forEach(char => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char; 
            span.classList.add('bop-letter');
            target.appendChild(span);
        });
    });
}

app.mount('#app');