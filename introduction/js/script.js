const shadow = document.querySelector('.cursor-shadow');
window.addEventListener('mousemove', (e) => {
    shadow.style.setProperty('--x', e.clientX + 'px');
    shadow.style.setProperty('--y', e.clientY + 'px');
});

const eduItems = document.querySelectorAll('.custom-list li');
const displayImg = document.getElementById('edu-display-img');

if (displayImg) {
    eduItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const newImgSrc = this.getAttribute('data-image');
            displayImg.classList.add('img-fade');
            
            setTimeout(() => {
                displayImg.src = newImgSrc;
                displayImg.classList.remove('img-fade');
            }, 300);
        });
    });
}

const revealSection = function (entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
            observer.unobserve(entry.target);
        }
    });
};

const sectionObserver = new IntersectionObserver(revealSection, {
    root: null, 
    threshold: 0.2 
});

document.querySelectorAll('.content-section').forEach(section => {
    sectionObserver.observe(section);
});