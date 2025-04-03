
let currentSlide = 0;
const totalSlides = 3;
const carouselTrack = document.getElementById('carouselTrack');
const dots = document.querySelectorAll('.dot');
const prevSlideButton = document.getElementById('prevSlide');
const nextSlideButton = document.getElementById('nextSlide');

function updateCarousel() {

    const translateValue = -currentSlide * 100 + '%';
    carouselTrack.style.transform = 'translateX(' + translateValue + ')';

    dots.forEach((dot, index) => {
        const isActive = index === currentSlide;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
}

function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateCarousel();
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

nextSlideButton.addEventListener('click', nextSlide);
prevSlideButton.addEventListener('click', prevSlide);
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => goToSlide(index));
});
updateCarousel();