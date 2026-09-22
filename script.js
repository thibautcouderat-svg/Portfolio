document.addEventListener('DOMContentLoaded', () => {

    /* =========================
       ANIMATION D'APPARITION AU SCROLL
    ========================= */

    const revealElements = document.querySelectorAll('.reveal');

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

        revealElements.forEach((el) => revealObserver.observe(el));
    } else {
        // Navigateur trop ancien pour IntersectionObserver : on affiche tout directement
        revealElements.forEach((el) => el.classList.add('visible'));
    }


    /* =========================
       BARRES DE COMPÉTENCES SUR MOBILE / TACTILE
       (le survol "hover" n'existe pas au doigt,
       on simule donc l'effet au clic/tap)
    ========================= */

    const skillsWithLevel = document.querySelectorAll('.skill[style*="--level"]');

    skillsWithLevel.forEach((skill) => {
        skill.addEventListener('click', () => {
            const alreadyTouched = skill.classList.contains('touched');

            // On referme les autres cartes ouvertes
            skillsWithLevel.forEach((s) => s.classList.remove('touched'));

            if (!alreadyTouched) {
                skill.classList.add('touched');
            }
        });
    });

});
