
// encapsulate so that we don't mess with the global context
(() => {
    main();

    function main() {
        const context = document.getElementById('carousel');
        
        const dots = [...context.querySelectorAll('.dot')];
        const slides = [...context.querySelectorAll('.carousel-slide')];
        const prevSlideButton = context.querySelector('.prev');
        const nextSlideButton = context.querySelector('.next');
        const liveRegion = context.querySelector('[role="status"]');
    
        addArrowKeyNavigation(dots);
        for(let dot of dots) {
            dot.addEventListener('click', () => activateDot(dot, dots, slides, liveRegion));
        }
        prevSlideButton.addEventListener('click', () => getNextDot(dots, -1).click());
        nextSlideButton.addEventListener('click', () => getNextDot(dots,  1).click());
    }
    
    function activateDot(dot, dots, slides, liveRegion) {
        // set pressed value
        for(let i = 0; i < dots.length; i++) {
            let dot = dots[i];
            let slide = slides[i];
            dot.setAttribute('aria-pressed', 'false');
            slide.setAttribute('aria-hidden', 'true');
        }
        let slide = slides[dots.indexOf(dot)];
        dot.setAttribute('aria-pressed', 'true');
        slide.setAttribute('aria-hidden', 'false');
        liveRegion.textContent = `${dots.indexOf(dot) + 1}/${dots.length}`;
    }
    
    
    /**
     * Add arrow key navigation
     * @param {HTMLElement[]} items 
     * @param {('horizontal'|'vertical')[]} directions 
     */
    function addArrowKeyNavigation(items, directions = ['horizontal', 'vertical']) {
        for(let item of items) {
            item.addEventListener(
                'keydown', 
                (e) => arrowNavigationKeyboardHandler(e, item, items, directions)
            );
        }
    }
    
    /**
     * 
     * @param {KeyboardEvent} e 
     * @param {HTMLElement} item 
     * @param {HTMLElement[]} items 
     * @param {('horizontal'|'vertical')[]} directions 
     * @returns 
     */
    function arrowNavigationKeyboardHandler(e, item, items, directions = ['horizontal', 'vertical']) {
        // return if not the right key
        let allowedKeys = [];
        if (directions.includes('horizontal')) {
            allowedKeys.push('ArrowLeft', 'ArrowRight');
        }
        if (directions.includes('vertical')) {
            allowedKeys.push('ArrowUp', 'ArrowDown');
        }
    
        if (!allowedKeys.includes(e.key)) return;
    
        // set the direction based on arrow key pressed
        let direction;
        switch(e.key) {
            case 'ArrowUp':
            case 'ArrowLeft':
                direction = -1;
                break;
            case 'ArrowDown':
            case 'ArrowRight':
                direction = 1;
                break;
        }
    
        // get next item and focus it
        let nextItem = getNext(item, items, direction);
        nextItem.focus();
    
        // prevent browser from scrolling
        e.preventDefault();
    }
    
    /**
     * gets next item in list based on direction (1 = next, -1 = previous)
     * @param {T} item 
     * @param {T[]} items 
     * @param {1|-1} direction 
     * @returns next item in array
     */
    function getNext(item, items, direction = 1) {
        let index = items.indexOf(item);
        let nextIndex = (index + direction + items.length) % items.length;
        return items[nextIndex];
    }
    
    /**
     * 
     * @param {HTMLElement[]} dots 
     * @param {(1|-1)} direction 
     */
    function getNextDot(dots, direction) {
        let currentDot = dots.find(d => d.getAttribute('aria-pressed') === 'true');
        return getNext(currentDot, dots, direction);
    }
})();
