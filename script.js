document.addEventListener('DOMContentLoaded', function() {

    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');

        const spans = hamburger.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const themeIcon = themeToggle.querySelector('i');

    const currentTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', currentTheme);

    if (currentTheme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }

    themeToggle.addEventListener('click', function() {
        const theme = html.getAttribute('data-theme');

        if (theme === 'light') {
            html.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            html.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    });

    const sections = document.querySelectorAll('section[id]');

    function highlightNavigation() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink?.classList.add('active');
            } else {
                navLink?.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);

    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);

                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    const heroBtns = document.querySelectorAll('.hero-buttons a');
    heroBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';

                if (entry.target.classList.contains('project-card')) {
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(el => {
        el.style.opacity = '0';

        if (el.classList.contains('project-card')) {
            el.style.transform = 'translateY(50px) scale(0.9)';
        } else {
            el.style.transform = 'translateY(30px)';
        }

        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    const heroSubtitle = document.querySelector('.hero-subtitle');
    const originalText = heroSubtitle.textContent;
    let index = 0;

    function typeWriter() {
        if (index < originalText.length) {
            heroSubtitle.textContent = originalText.substring(0, index + 1);
            index++;
            setTimeout(typeWriter, 100);
        }
    }

    setTimeout(() => {
        heroSubtitle.textContent = '';
        typeWriter();
    }, 1000);

    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    });

    const heroSection = document.querySelector('.hero');

    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        if (heroSection && scrolled < window.innerHeight) {
            heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const email = this.getAttribute('href').replace('mailto:', '');

            const tempInput = document.createElement('input');
            tempInput.value = email;
            document.body.appendChild(tempInput);
            tempInput.select();

            try {
                document.execCommand('copy');
                showNotification('Email copié dans le presse-papier !');
            } catch (err) {
                console.log('Erreur lors de la copie');
            }

            document.body.removeChild(tempInput);
        });
    });

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: var(--primary-color);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        
        .nav-link.active {
            color: var(--primary-color);
        }
        
        .nav-link.active::after {
            width: 100%;
        }
    `;
    document.head.appendChild(style);

    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }

    const backToTopButton = document.getElementById('backToTop');

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    if (window.location.hash) {
        setTimeout(() => {
            const targetSection = document.querySelector(window.location.hash);
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }

    // Système de traduction
    const translations = {
        fr: {
            // Navigation
            "Retour": "Retour",
            "Autres Projets": "Autres Projets", 
            "Contact": "Contact",
            
            // Header de projet
            "Application Web & Mobile React": "Application Web & Mobile React",
            "Développement d'applications web et mobiles cross-platform": "Développement d'applications web et mobiles cross-platform",
            
            // Section Kubiq
            "Découvrir Kubiq": "Découvrir Kubiq",
            "Visiter kubiq.net": "Visiter kubiq.net",
            
            // Sections principales
            "Présentation du Projet": "Présentation du Projet",
            "Missions Principales": "Missions Principales", 
            "Technologies & Outils": "Technologies & Outils",
            "Réalisations Concrètes": "Réalisations Concrètes",
            "Compétences Acquises": "Compétences Acquises",
            "Impact & Résultats": "Impact & Résultats",
            
            // Actions
            "Retour aux projets": "Retour aux projets",
            "Me contacter": "Me contacter",
            "Retour en haut": "Retour en haut",
            
            // Missions
            "Dark Mode": "Dark Mode",
            "Traduction Multilingue": "Traduction Multilingue",
            "Page Settings": "Page Settings",
            "Barre de Recherche": "Barre de Recherche",
            "Tests Unitaires (Jest)": "Tests Unitaires (Jest)",
            "Suppression de Compte": "Suppression de Compte",
            "Navigation Expo Router": "Navigation Expo Router",
            "Correction de Bugs": "Correction de Bugs",
            "Migration SDK Expo": "Migration SDK Expo",
            
            // Technologies
            "Framework & Core": "Framework & Core",
            "UI & Design": "UI & Design",
            "State Management & Data": "State Management & Data",
            "Développement & Deploy": "Développement & Deploy",
            
            // Réalisations
            "Migration Web vers Mobile Native": "Migration Web vers Mobile Native",
            "Conformité App Store Apple": "Conformité App Store Apple",
            "Recherche Avancée & UX": "Recherche Avancée & UX",
            "Conformité RGPD": "Conformité RGPD",
            "Dark Mode Avancé": "Dark Mode Avancé",
            "Navigation Optimisée": "Navigation Optimisée",
            "Système de Traduction": "Système de Traduction",
            
            // Compétences
            "Développement Web & Mobile": "Développement Web & Mobile",
            "Travail en Équipe": "Travail en Équipe",
            "Debugging Avancé": "Debugging Avancé",
            "Optimisation": "Optimisation",
            
            // Métriques
            "Amélioration des performances": "Amélioration des performances",
            "Langues supportées": "Langues supportées", 
            "Bugs critiques résolus": "Bugs critiques résolus"
        },
        
        en: {
            // Navigation
            "Retour": "Back",
            "Autres Projets": "Other Projects",
            "Contact": "Contact",
            
            // Header de projet
            "Application Web & Mobile React": "Web & Mobile React Application",
            "Développement d'applications web et mobiles cross-platform": "Cross-platform web and mobile application development",
            
            // Section Kubiq
            "Découvrir Kubiq": "Discover Kubiq",
            "Visiter kubiq.net": "Visit kubiq.net",
            
            // Sections principales
            "Présentation du Projet": "Project Overview",
            "Missions Principales": "Main Missions",
            "Technologies & Outils": "Technologies & Tools", 
            "Réalisations Concrètes": "Concrete Achievements",
            "Compétences Acquises": "Skills Acquired",
            "Impact & Résultats": "Impact & Results",
            
            // Actions
            "Retour aux projets": "Back to projects",
            "Me contacter": "Contact me", 
            "Retour en haut": "Back to top",
            
            // Missions
            "Dark Mode": "Dark Mode",
            "Traduction Multilingue": "Multilingual Translation", 
            "Page Settings": "Settings Page",
            "Barre de Recherche": "Search Bar",
            "Tests Unitaires (Jest)": "Unit Tests (Jest)",
            "Suppression de Compte": "Account Deletion",
            "Navigation Expo Router": "Expo Router Navigation",
            "Correction de Bugs": "Bug Fixes",
            "Migration SDK Expo": "Expo SDK Migration",
            
            // Technologies
            "Framework & Core": "Framework & Core",
            "UI & Design": "UI & Design", 
            "State Management & Data": "State Management & Data",
            "Développement & Deploy": "Development & Deploy",
            
            // Réalisations
            "Migration Web vers Mobile Native": "Web to Mobile Native Migration",
            "Conformité App Store Apple": "Apple App Store Compliance",
            "Recherche Avancée & UX": "Advanced Search & UX",
            "Conformité RGPD": "GDPR Compliance",
            "Dark Mode Avancé": "Advanced Dark Mode",
            "Navigation Optimisée": "Optimized Navigation", 
            "Système de Traduction": "Translation System",
            
            // Compétences
            "Développement Web & Mobile": "Web & Mobile Development",
            "Travail en Équipe": "Teamwork",
            "Debugging Avancé": "Advanced Debugging",
            "Optimisation": "Optimization",
            
            // Métriques
            "Amélioration des performances": "Performance improvement",
            "Langues supportées": "Languages supported",
            "Bugs critiques résolus": "Critical bugs resolved"
        }
    };

    // Gestion de la langue
    let currentLanguage = localStorage.getItem('portfolio-language') || 'fr';
    
    const languageToggle = document.getElementById('languageToggle');
    const currentLangSpan = document.getElementById('currentLang');
    
    // Initialiser l'affichage de la langue
    if (currentLanguage === 'en') {
        currentLangSpan.textContent = 'EN/FR';
        translatePage('en');
    } else {
        currentLangSpan.textContent = 'FR/EN';
    }
    
    // Fonction de traduction
    function translatePage(lang) {
        // Traduire tous les éléments avec data-fr et data-en
        const elementsWithData = document.querySelectorAll('[data-fr][data-en]');
        elementsWithData.forEach(element => {
            if (lang === 'en') {
                element.textContent = element.getAttribute('data-en');
            } else {
                element.textContent = element.getAttribute('data-fr');
            }
        });
        
        // Traduire les éléments par leur contenu textuel
        const elementsToTranslate = document.querySelectorAll('h1, h2, h3, p, a, span:not(#currentLang)');
        elementsToTranslate.forEach(element => {
            const text = element.textContent.trim();
            if (translations[lang] && translations[lang][text]) {
                element.textContent = translations[lang][text];
            }
        });
        
        // Mettre à jour le titre de la page
        if (lang === 'en') {
            document.title = 'Web & Mobile React Application - Moussa Diallo Portfolio';
        } else {
            document.title = 'Application Web & Mobile React - Portfolio Diallo Moussa';
        }
    }
    
    // Événement de clic sur le toggle de langue
    if (languageToggle) {
        languageToggle.addEventListener('click', function() {
            currentLanguage = currentLanguage === 'fr' ? 'en' : 'fr';
            
            if (currentLanguage === 'en') {
                currentLangSpan.textContent = 'EN/FR';
                translatePage('en');
            } else {
                currentLangSpan.textContent = 'FR/EN';
                translatePage('fr');
            }
            
            // Sauvegarder la préférence
            localStorage.setItem('portfolio-language', currentLanguage);
            
            // Animation du toggle
            languageToggle.style.transform = 'scale(0.9)';
            setTimeout(() => {
                languageToggle.style.transform = 'scale(1)';
            }, 150);
        });
        
        // Effet de survol
        languageToggle.addEventListener('mouseenter', function() {
            this.style.opacity = '0.8';
        });
        
        languageToggle.addEventListener('mouseleave', function() {
            this.style.opacity = '1';
        });
    }

});

