1. Auto-Playing Carousels:
- Concern: Auto-Playing carousels (automatically switches slides) can be disorientating, distracting, difficult to read and operate. WCAG requires authors provide users with a mechanism to pause, stop, or hide auto-moving/updating content. 
- Mitigation: The best option is to not automatically play at all. The next best is to provide a control to pause/play the carousel. We also recommend using the media query prefers-reduced-motion to pause the carousel and/or reduce the animation effects when swapping slides.
2. Responsive Design Issues:
- Concern: Carousels may not adapt well to different viewport sizes. All content and functionality should be available to users at smaller viewport sizes. If multiple controls perform the same function (e.g. swapping slides) only one needs to be available at smaller viewport size.
- Mitigation: Implement responsive design principles to ensure that carousels adapt to smaller viewport sizes. Test the carousel on different devices to verify its usability and readability.
3. Color Contrast
- Concern: Carousel controls may be located overlaying the carousel slide. Often those slides are promotional images. When the background of a control is unknown authors run the risk of a color contrast issue (the control or it's focus indicator).
- Mitigation: Placing the controls against a background color that is known and contrast well works. Focus indicators can be placed on the inside of a control using a negative outline-offset. Focus indicators can also be two-toned similar to the default Chrome focus indicator.