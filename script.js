document.addEventListener('DOMContentLoaded', () => {

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;


    /* =========================================================
       1. ANIMATION D'APPARITION AU SCROLL
    ========================================================= */

    const revealTargets = document.querySelectorAll('.reveal, .reveal-item');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealTargets.forEach((el) => revealObserver.observe(el));
    } else {
        revealTargets.forEach((el) => el.classList.add('visible'));
    }


    /* =========================================================
       2. MODE CLAIR / SOMBRE (mémorisé dans localStorage)
    ========================================================= */

    const themeToggle = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    function applyTheme(theme) {
        if (theme === 'light') {
            htmlEl.setAttribute('data-theme', 'light');
            themeToggle.textContent = '☀️';
        } else {
            htmlEl.removeAttribute('data-theme');
            themeToggle.textContent = '🌙';
        }
    }

    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isLight = htmlEl.getAttribute('data-theme') === 'light';
            const newTheme = isLight ? 'dark' : 'light';
            applyTheme(newTheme);
            localStorage.setItem('portfolio-theme', newTheme);
        });
    }


    /* =========================================================
       3. BARRE DE PROGRESSION DE SCROLL + NAVBAR (scrolled + scrollspy)
    ========================================================= */

    const scrollProgress = document.getElementById('scroll-progress');
    const header = document.getElementById('site-header');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('main section[id]');
    const backToTop = document.getElementById('back-to-top');

    function onScroll() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        if (scrollProgress) {
            scrollProgress.style.width = progress + '%';
        }

        if (header) {
            header.classList.toggle('scrolled', scrollTop > 40);
        }

        if (backToTop) {
            backToTop.classList.toggle('visible', scrollTop > 500);
        }

        // Scrollspy : met en évidence le lien du menu correspondant à la section visible
        let currentId = '';
        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 140 && rect.bottom >= 140) {
                currentId = section.id;
            }
        });

        navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        });
    }


    /* =========================================================
       4. LUMIÈRE QUI SUIT LA SOURIS (désactivée sur tactile / reduced motion)
    ========================================================= */

    const mouseGlow = document.querySelector('.mouse-glow');

    if (mouseGlow && !isTouchDevice && !prefersReducedMotion) {
        window.addEventListener('mousemove', (e) => {
            mouseGlow.style.transform = `translate(${e.clientX - 250}px, ${e.clientY - 250}px)`;
        }, { passive: true });
    }


    /* =========================================================
       5. CURSEUR PERSONNALISÉ (désactivé sur tactile / reduced motion)
    ========================================================= */

    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');

    if (cursorDot && cursorRing && !isTouchDevice && !prefersReducedMotion) {
        document.body.classList.add('custom-cursor-active');

        let ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
        }, { passive: true });

        function animateRing() {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            cursorRing.style.transform = `translate(${ringX - 16}px, ${ringY - 16}px)`;
            requestAnimationFrame(animateRing);
        }
        animateRing();

        const hoverTargets = document.querySelectorAll('a, button, .project, .skill, .diploma-card');
        hoverTargets.forEach((el) => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }


    /* =========================================================
       6. EFFET 3D (TILT) SUR LES CARTES (désactivé sur tactile / reduced motion)
    ========================================================= */

    const tiltElements = document.querySelectorAll('.tilt');

    if (!isTouchDevice && !prefersReducedMotion) {
        tiltElements.forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const rotateX = ((y / rect.height) - 0.5) * -8;
                const rotateY = ((x / rect.width) - 0.5) * 8;

                card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }


    /* =========================================================
       7. TEXTE DYNAMIQUE (MACHINE À ÉCRIRE) DANS L'ACCUEIL
    ========================================================= */

    const typedTextEl = document.getElementById('typed-text');
    const typedPhrases = [
        'Étudiant en BUT Informatique',
        'Développeur C++',
        'Développeur Web',
        "Passionné d'informatique",
        'Créateur de projets'
    ];

    if (typedTextEl) {
        if (prefersReducedMotion) {
            typedTextEl.textContent = typedPhrases[0];
        } else {
            let phraseIndex = 0;
            let charIndex = 0;
            let deleting = false;

            function typeLoop() {
                const currentPhrase = typedPhrases[phraseIndex];

                if (!deleting) {
                    charIndex++;
                    typedTextEl.textContent = currentPhrase.slice(0, charIndex);

                    if (charIndex === currentPhrase.length) {
                        deleting = true;
                        setTimeout(typeLoop, 1400);
                        return;
                    }
                } else {
                    charIndex--;
                    typedTextEl.textContent = currentPhrase.slice(0, charIndex);

                    if (charIndex === 0) {
                        deleting = false;
                        phraseIndex = (phraseIndex + 1) % typedPhrases.length;
                    }
                }

                setTimeout(typeLoop, deleting ? 35 : 65);
            }

            typeLoop();
        }
    }


    /* =========================================================
       8. NIVEAUX DE COMPÉTENCES AU TAP (MOBILE / TACTILE)
    ========================================================= */

    const skillsWithLevel = Array.from(document.querySelectorAll('.skill')).filter(
        (el) => el.style.getPropertyValue('--level')
    );

    skillsWithLevel.forEach((skill) => {
        skill.addEventListener('click', () => {
            const alreadyTouched = skill.classList.contains('touched');
            skillsWithLevel.forEach((s) => s.classList.remove('touched'));
            if (!alreadyTouched) {
                skill.classList.add('touched');
            }
        });
    });


    /* =========================================================
       9. FILTRES DE PROJETS
    ========================================================= */

    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project');

    filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterButtons.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach((card) => {
                const categories = (card.getAttribute('data-category') || '').split(' ');
                const shouldShow = filter === 'tous' || categories.includes(filter);
                card.classList.toggle('is-hidden', !shouldShow);
            });
        });
    });


    /* =========================================================
       10. TERMINAL INTERACTIF
    ========================================================= */

    const terminalBody = document.getElementById('terminal-body');
    const terminalInput = document.getElementById('terminal-input');
    const terminalWrapper = document.getElementById('terminal');

    function printLine(text, isPrompt) {
        const line = document.createElement('p');
        line.className = 'terminal-line' + (isPrompt ? ' prompt' : '');
        line.textContent = text;
        terminalBody.insertBefore(line, terminalBody.querySelector('.terminal-input-line'));
    }

    function printHTMLLine(html) {
        const line = document.createElement('p');
        line.className = 'terminal-line';
        line.innerHTML = html;
        terminalBody.insertBefore(line, terminalBody.querySelector('.terminal-input-line'));
    }

    function scrollTerminalToBottom() {
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    const terminalCommands = {
        help: () => {
            printLine('Commandes disponibles :');
            printLine('  help      - affiche cette liste de commandes');
            printLine('  about     - qui je suis');
            printLine('  skills    - mes compétences et niveaux');
            printLine('  projects  - liste de mes projets');
            printLine('  contact   - comment me contacter');
            printLine('  whoami    - une ligne de présentation');
            printLine('  clear     - efface le terminal');
        },
        about: () => {
            printLine('Thibaut COUDERAT — étudiant en BUT Informatique.');
            printLine("Passionné par la programmation, le développement web et les nouvelles technologies.");
        },
        whoami: () => {
            printLine('thibaut');
        },
        skills: () => {
            printLine('C++ ................ 80%');
            printLine('Bash ............... 80%');
            printLine('Bases de données ... 80%');
            printLine('Java ............... 50%');
            printLine('HTML ............... 50%');
            printLine('CSS ................ 50%');
        },
        projects: () => {
            printLine('01. Projet C++   — projet de programmation en C++');
            printLine('02. Portfolio    — ce site, en HTML / CSS / JavaScript');
            printLine('03. À venir...   — prochains projets en cours de route');
        },
        contact: () => {
            printHTMLLine('GitHub : <a href="https://github.com/thibautcouderat-svg" target="_blank" style="color:var(--accent)">github.com/thibautcouderat-svg</a>');
            printHTMLLine('Email  : <a href="mailto:thibaut.couderat@outlook.fr" style="color:var(--accent)">thibaut.couderat@outlook.fr</a>');
        },
        clear: () => {
            terminalBody.querySelectorAll('.terminal-line').forEach((line) => line.remove());
        }
    };

    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter') return;

            const raw = terminalInput.value.trim();
            if (raw.length === 0) return;

            printLine('$ ' + raw, true);
            terminalInput.value = '';

            const commandName = raw.toLowerCase();

            if (terminalCommands[commandName]) {
                terminalCommands[commandName]();
            } else {
                printLine(`Commande introuvable : "${raw}". Tape "help" pour voir les commandes disponibles.`);
            }

            scrollTerminalToBottom();
        });

        // Cliquer/toucher n'importe où dans le terminal ramène le focus sur l'input (pratique sur mobile)
        if (terminalWrapper) {
            terminalWrapper.addEventListener('click', () => {
                terminalInput.focus();
            });
        }
    }


    /* =========================================================
       11. EASTER EGG — KONAMI CODE
    ========================================================= */

    const konamiSequence = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'b', 'a'
    ];
    let konamiProgress = 0;
    const easterToast = document.getElementById('easter-toast');

    window.addEventListener('keydown', (e) => {
        const expected = konamiSequence[konamiProgress];
        const pressed = e.key.length === 1 ? e.key.toLowerCase() : e.key;

        if (pressed === expected) {
            konamiProgress++;

            if (konamiProgress === konamiSequence.length) {
                konamiProgress = 0;
                triggerEasterEgg();
            }
        } else {
            konamiProgress = (pressed === konamiSequence[0]) ? 1 : 0;
        }
    });

    function triggerEasterEgg() {
        if (prefersReducedMotion) return;

        document.body.classList.add('easter-egg-active');
        if (easterToast) easterToast.classList.add('visible');

        setTimeout(() => {
            document.body.classList.remove('easter-egg-active');
            if (easterToast) easterToast.classList.remove('visible');
        }, 3000);
    }

});
