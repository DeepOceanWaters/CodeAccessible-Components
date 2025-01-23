// Slightly modified version of the javascript in our tooltip file
// use an anonymous funciton to encapsulate
(() => {
    // max width in pixels for tooltip
    const maxWidth = 500;

    main();

    function main() {
        let revealNameTips = document.querySelectorAll('[data-revealed-name]');

        // add event listeners
        for (const revealNameElement of revealNameTips) {
            prepareHoverableContentState(revealNameElement);
        }

        // remove content on escape or control
        document.body.addEventListener('keydown', toggleHoverContent);

        // handle viewport changes
        window.addEventListener('resize', moveTooltip);
    }

    /**
     * Adds event listeners that set the state of the component
     * @param {HTMLElement} element the element to add event listeners to
     */
    function prepareHoverableContentState(element) {
        // hover
        element.addEventListener('mouseenter', (e) => setState(element, true));
        element.addEventListener('mouseleave', (e) => setState(element, false));
        // focus
        element.addEventListener('focusin', (e) => setState(element, true));
        element.addEventListener('blur', (e) => setState(element, false));
    }

    /**
     * Sets the state and any state related items/attributes.
     * @param {HTMLElement} element the element that owns the state
     * @param {Boolean} isVisible true if visible
     */
    function setState(element, isVisible) {
        // typically, when content appears due to user interaction
        // we want to use ARIA-EXPANDED to convey the expanded or collapsed
        // state of this component. However, in this case, there is no new
        // information being presented that AT would not already know (the 
        // text being shown is the accessible name, or the accessible description).
        // As such, we forgo adding the ARIA-EXPANDED attribute as it would
        // likely only confuse screen reader users, as they might expect the
        // component to reveal new information on activation, rather than
        // perform an action.
        if (isVisible) {
            element.classList.remove('hidden');
        }
        else {
            element.classList.add('hidden');
        }
        let tooltip = element.querySelector('[data-tooltip="group"]');
        repositionTooltip(tooltip);
    }

    /**
     * Finds all elements that are currently showing their tooltip,
     * and then hides those tooltips.
     * @param {KeyboardEvent} e a keyboard event
     */
    function toggleHoverContent(e) {
        // we return if the key pressed isn't Escape or Control
        if (e.key !== 'Escape' && e.key !== 'Control') return;
        // we get all currently visible content. We use querySelectorAll
        // in case the user has both focused an element and hovered a
        // different element.
        let hoveredElements = document.querySelectorAll('[data-revealed-name]:not(.hidden)');
        for (const hoveredElement of hoveredElements) {
            hoveredElement.classList.add('hidden');
        }
    }

    /**
     * Finds all currently visible tooltip text elements, and then
     * repositions them to ensure that they are not offscreen.
     */
    function moveTooltip() {
        // get all visible tooltips
        let visibleTips = document.querySelectorAll(
            '[data-revealed-name]:not(.hidden) [data-tooltip]'
        );
        for (const visibleTip of visibleTips) {
            repositionTooltip(visibleTip);
        }
    }

    /**
     * Checks the position of the tooltip text and repositions and resizes
     * the tooltipText element such that it remains within the viewport.
     * Important for ensuring that there is no loss of content when the viewport
     * is zoomed in.
     * @param {HTMLElement} tooltipText The tooltip text element that is shown on hover/focus
     */
    function repositionTooltip(tooltipText) {
        // reset the styling
        tooltipText.style.removeProperty('width');
        tooltipText.style.removeProperty('left');
        tooltipText.style.removeProperty('white-space');
        // get tooltipText dimensions
        let tooltipRect = tooltipText.getBoundingClientRect();
        // set max-width
        if (tooltipRect.width > maxWidth) {
            tooltipText.style.width = maxWidth + 'px';
            tooltipText.style.whiteSpace = 'normal';
        }
        tooltipRect = tooltipText.getBoundingClientRect();
        // get parentElement dimensions (should be a [data-revealed-name] element)
        let parentRect = tooltipText.parentElement.getBoundingClientRect();
        // viewport width minus body margin
        let vw = document.body.clientWidth + 2 * getPropertyAsNumber(document.body, 'margin');
        // get the padding of the tooltip
        let paddingLeft = getPropertyAsNumber(tooltipText, 'padding-left');
        // math to move the tooltip to the middle
        let parentMiddlePoint = parentRect.x + (parentRect.width / 2);
        let tooltipStartPoint = parentMiddlePoint - (tooltipRect.width / 2);
        let tooltipLeftOffset = tooltipStartPoint - parentRect.x;
        tooltipText.style.left = tooltipLeftOffset + 'px';
        
        // get new tooltip dimensions
        tooltipRect = tooltipText.getBoundingClientRect();
        // if tooltipRect width is larger than viewport, set to viewport;
        if (tooltipRect.width > vw) {
            let widthOffset = (vw - (2 * paddingLeft));
            let leftOffset = (-1 * parentRect.x) +  paddingLeft;
            tooltipText.style.width = widthOffset + 'px';
            tooltipText.style.left = leftOffset + 'px';
            // in the style sheet we've set the "white-space" CSS property
            // to nowrap, but when the text is longer than the width of the
            // viewport, we need to wrap the text
            tooltipText.style.whiteSpace = 'normal';
        }
        // if it starts off screen to the left
        else if (tooltipRect.x < 0) {
            let offset = (-1 * parentRect.x) + paddingLeft;
            tooltipText.style.left = offset + 'px';
        }
        // if it is off screen to the right
        else if ((tooltipRect.x + tooltipRect.width) > vw) {
            let offset = (-1 * (parentRect.x + tooltipRect.width - vw + paddingLeft));
            tooltipText.style.left = offset + 'px';
        }
    }

    /**
     * Gets the integer value of a CSS property for an element as a number. 
     * @param {HTMLElement} element gets the CSS property of this element
     * @param {String} property the CSS property name
     * @returns the CSS property's value as a Number (note CSS values are typically in pixels)
     */
    function getPropertyAsNumber(element, property) {
        return Number(
            window
                .getComputedStyle(element)
                .getPropertyValue(property)
                .match(/\d+/gi)
        );
    }
})();