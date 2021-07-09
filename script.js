window.addEventListener('DOMContentLoaded', () => {
    const tl = gsap.timeline({defaults: {ease: 'power1.out'}, onComplete: () => {
        const typewriter = new Typewriter(document.querySelector('.intro-greet'));
        typewriter.typeString('WEB <br> DEVELOPER').start();
    }});

    tl.to('.hidden-text', {y: '0%', duration: 1, stagger: 0.25});
    tl.to('.slide2', {y:'-100%', duration: 1, delay:0.5});
    tl.to('.slide1', {y:'-100%', duration: 1}, '-=0.5');

    // typing effect
    
    
})