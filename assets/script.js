document.getElementById('about').addEventListener('click', () => {
    generateWinBox({
        title: '/about',
        toMount: 'about-content',
        toType1: 'abt-greet',
        string1: `Hi I'm Rodel, a software developer`,
        toType2: 'abt1',
        string2: `I develop web applications, APIs, backend structure and even frontend designing. 
        I've been part of a team of developers, I'd like to explore online, to learn more and elevate my skills, 
        and to be part of a helping and growing community of developers.`
    })
})


document.getElementById('contact').addEventListener('click', () => {
    generateWinBox({
        title: '/contact',
        toMount: 'contact-content',
        toType1: 'contact-head',
        string1: `Get in touch, send me a message`,
        toType2: 'contact1',
        string2: `contact #: 09666988961, email: cabubas27rodel@gmail.com`,
        top:150,
        left: 250
    })
})

function generateWinBox(details) {
    const {title, toMount, toType1, toType2, string1, string2} = details;
    new WinBox({
        title: title,
        top: details.top??50,
        right: details.right??50,
        left: details.left??50,
        border:1,
        mount: document.getElementById(toMount),
        onfocus: function() {
            this.setBackground('#00aa00')
        },
        onblur: function() {
            this.setBackground('#777')
        }
    });

    document.getElementById(toType1).innerHTML = string1;

    new Typewriter(document.getElementById(toType2), {
        strings: string2,
        autoStart: true,
        delay: 0
    })
}


this.addEventListener('DOMContentLoaded', () => {
    const jobTyper = new Typewriter(document.getElementById('job'));
    const type = document.getElementById('type_res');

    jobTyper.typeString('--who').start().pauseFor(100).callFunction(() => {
       document.querySelector('.Typewriter__cursor').classList.add('hidden')
       type.className = '';
       setTimeout(() => {
            type.innerHTML += ' a software developer';
            setTimeout(() => {
                document.getElementById('job2').className = '';
           }, 100)
       }, 300)
    });
})