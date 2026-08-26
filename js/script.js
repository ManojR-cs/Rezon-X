/* =========================================================
   REZONX WEBSITE - COMPLETE JAVASCRIPT
   ========================================================= */


/* =========================================================
   RESPONSIVE NAVBAR
   ========================================================= */

(function () {

    const mainNav = document.getElementById("main-nav");
    const navToggle = document.getElementById("nav-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (!mainNav || !navToggle || !navMenu) {
        return;
    }

    const navLinks = navMenu.querySelectorAll("a");

    function closeNavMenu() {

        mainNav.classList.remove("menu-open");

        navToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        navToggle.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

    }


    navToggle.addEventListener(
        "click",
        function () {

            const isOpen =
                mainNav.classList.toggle("menu-open");

            navToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            navToggle.setAttribute(
                "aria-label",
                isOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
            );

        }
    );


    navLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                closeNavMenu();

            }
        );

    });


    document.addEventListener(
        "click",
        function (event) {

            if (
                window.innerWidth <= 900 &&
                mainNav.classList.contains("menu-open") &&
                !mainNav.contains(event.target)
            ) {

                closeNavMenu();

            }

        }
    );


    window.addEventListener(
        "resize",
        function () {

            if (window.innerWidth > 900) {

                closeNavMenu();

            }

        }
    );

})();


/* =========================================================
   COMMENTS
   ========================================================= */

function addComment() {

    const nameInput =
        document.getElementById("name");

    const messageInput =
        document.getElementById("message");

    const commentSection =
        document.getElementById("comment-section");


    if (
        !nameInput ||
        !messageInput ||
        !commentSection
    ) {

        return;

    }


    const name =
        nameInput.value.trim();

    const message =
        messageInput.value.trim();


    if (
        name === "" ||
        message === ""
    ) {

        alert("Please fill all fields");

        return;

    }


    const commentBox =
        document.createElement("div");

    commentBox.classList.add(
        "comment-box"
    );


    const heading =
        document.createElement("h3");

    heading.textContent =
        name;


    const paragraph =
        document.createElement("p");

    paragraph.textContent =
        message;


    commentBox.appendChild(
        heading
    );

    commentBox.appendChild(
        paragraph
    );


    commentSection.appendChild(
        commentBox
    );


    nameInput.value = "";

    messageInput.value = "";

}


/* =========================================================
   GENERAL MODALS
   ========================================================= */

function openModal(modalId) {

    const modal =
        document.getElementById(modalId);

    if (!modal) {
        return;
    }

    modal.classList.add("active");

}


function closeModal(modalId) {

    const modal =
        document.getElementById(modalId);

    if (!modal) {
        return;
    }

    modal.classList.remove("active");

}


/* =========================================================
   PROJECT DATA
   ========================================================= */

const projectData = {

    "crop-care": {

        title:
            "Crop Care & KVK Alert System",

        image:
            "assets/projects/cropcare-kvk.png",

        description:
            "AI-Based Crop Disease Detection and KVK Alert System helps farmers detect crop diseases by uploading leaf images. The YOLO model identifies the disease and suggests suitable remedies like pesticides or weedicides. Using n8n, the detected disease and location are automatically sent to nearby Krishi Vigyan Kendras (KVKs) for monitoring and research purposes.",

        technologies: [
            "Python",
            "YOLO",
            "AI",
            "n8n"
        ]

    },


    "agribot": {

        title:
            "Multifunctional AgriBot",

        image:
            "assets/projects/agribot.png",

        description:
            "A compact prototype of a multifunctional agricultural robot designed for uneven Indian terrain. The AgriBot integrates a pesticide spraying system with a camera to enable targeted and efficient application. It supports crop surveillance, generates basic crop health insights and can perform additional tasks such as grass cutting. The project aims to evolve into a fully autonomous system with future integration of GPS-based navigation.",

        technologies: [
            "Robotics",
            "Sensors",
            "Automation"
        ]

    },


    "voice-bot": {

        title:
            "Voice Controlled Bot",

        image:
            "assets/projects/voice-bot.png",

        description:
            "This project aims to promote student engagement in robotics through interactive voice-controlled bots. The system enables basic voice interaction to answer queries and provide task reminders, offering a simple and accessible introduction to human-machine interaction and automation.",

        technologies: [
            "Robotics",
            "Voice Recognition",
            "Embedded Systems"
        ]

    },


    "pet-filament": {

        title:
            "PET Bottle 3D Filament",

        image:
            "assets/projects/pet-filament.png",

        description:
            "This project demonstrates a sustainable approach by converting used PET bottles into 3D printing filament. It encourages students to think innovatively about waste utilization and environmental responsibility. The setup produces low-cost filament while reducing material costs and plastic waste.",

        technologies: [
            "3D Printing",
            "Recycling",
            "Mechanical Design"
        ]

    },


    "smart-kiosk": {

        title:
            "Smart Kiosk Printer",

        image:
            "assets/projects/smart-kiosk.png",

        description:
            "The SmartPrint Kiosk System is a local-network printing solution that allows users to upload documents, select print options, make UPI payments using a static QR code and receive automatic printouts through a USB-connected printer. The system also includes an admin portal for monitoring jobs and a notification system for error alerts.",

        technologies: [
            "Python",
            "Web Development",
            "UPI",
            "Automation"
        ]

    }

};


/* =========================================================
   PROJECT MODAL
   ========================================================= */

function openProjectModal(projectId) {

    const project =
        projectData[projectId];


    if (!project) {

        console.error(
            "Project not found:",
            projectId
        );

        return;

    }


    const modal =
        document.getElementById(
            "projectModal"
        );

    const image =
        document.getElementById(
            "modalProjectImage"
        );

    const title =
        document.getElementById(
            "modalProjectTitle"
        );

    const description =
        document.getElementById(
            "modalProjectDescription"
        );

    const techContainer =
        document.getElementById(
            "modalProjectTech"
        );


    if (
        !modal ||
        !image ||
        !title ||
        !description ||
        !techContainer
    ) {

        console.error(
            "Project modal elements are missing."
        );

        return;

    }


    image.src =
        project.image;

    image.alt =
        project.title;


    title.textContent =
        project.title;


    description.textContent =
        project.description;


    techContainer.innerHTML = "";


    project.technologies.forEach(
        function (technology) {

            const tag =
                document.createElement(
                    "span"
                );

            tag.className =
                "project-tech";

            tag.textContent =
                technology;

            techContainer.appendChild(
                tag
            );

        }
    );


    modal.classList.add(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}


function closeProjectModal() {

    const modal =
        document.getElementById(
            "projectModal"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";

}


/* Project modal background click */

(function () {

    const projectModal =
        document.getElementById(
            "projectModal"
        );


    if (!projectModal) {
        return;
    }


    projectModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === projectModal
            ) {

                closeProjectModal();

            }

        }
    );

})();


/* Project modal Escape key */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key !== "Escape") {
            return;
        }


        const projectModal =
            document.getElementById(
                "projectModal"
            );


        if (
            projectModal &&
            projectModal.classList.contains(
                "active"
            )
        ) {

            closeProjectModal();

        }

    }
);


/* =========================================================
   PROJECT CAROUSEL
   ========================================================= */

(function () {

    const track =
        document.querySelector(
            ".projects-track"
        );

    const cards =
        document.querySelectorAll(
            ".project-card"
        );

    const nextButton =
        document.querySelector(
            ".project-next"
        );

    const prevButton =
        document.querySelector(
            ".project-prev"
        );

    const carousel =
        document.querySelector(
            ".projects-carousel"
        );

    const dots =
        document.querySelectorAll(
            ".project-dot"
        );


    if (
        !track ||
        !cards.length ||
        !carousel
    ) {

        return;

    }


    let currentProject = 0;

    let autoPlayTimer = null;

    let isPaused = false;

    let touchActive = false;

    const AUTO_PLAY_DELAY = 3500;


    function getVisibleProjects() {

        if (window.innerWidth <= 700) {
            return 1;
        }

        if (window.innerWidth <= 1100) {
            return 2;
        }

        return 3;

    }


    function updateProjectDots() {

        dots.forEach(
            function (dot, index) {

                dot.classList.toggle(
                    "active",
                    index === currentProject
                );

            }
        );

    }


    function updateProjectCarousel() {

        if (!cards.length) {
            return;
        }


        const visibleProjects =
            getVisibleProjects();


        const cardWidth =
            cards[0]
                .getBoundingClientRect()
                .width;


        const gap =
            window.innerWidth <= 700
                ? 20
                : 30;


        const maxIndex =
            Math.max(
                0,
                cards.length -
                visibleProjects
            );


        if (
            currentProject >
            maxIndex
        ) {

            currentProject =
                maxIndex;

        }


        if (
            currentProject < 0
        ) {

            currentProject = 0;

        }


        const moveAmount =
            currentProject *
            (cardWidth + gap);


        track.style.transform =
            `translateX(-${moveAmount}px)`;


        updateProjectDots();

    }


    function moveNext() {

        if (
            isPaused ||
            touchActive
        ) {

            return;

        }


        const visibleProjects =
            getVisibleProjects();


        const maxIndex =
            Math.max(
                0,
                cards.length -
                visibleProjects
            );


        if (
            currentProject <
            maxIndex
        ) {

            currentProject++;

        } else {

            currentProject = 0;

        }


        updateProjectCarousel();

    }


    function startAutoPlay() {

        stopAutoPlay();


        autoPlayTimer =
            setInterval(
                moveNext,
                AUTO_PLAY_DELAY
            );

    }


    function stopAutoPlay() {

        if (autoPlayTimer) {

            clearInterval(
                autoPlayTimer
            );

            autoPlayTimer = null;

        }

    }


    function pauseCarousel() {

        isPaused = true;

        stopAutoPlay();

    }


    function resumeCarousel() {

        isPaused = false;


        setTimeout(
            function () {

                if (
                    !isPaused &&
                    !touchActive
                ) {

                    startAutoPlay();

                }

            },
            800
        );

    }


    /* Desktop hover */

    carousel.addEventListener(
        "mouseenter",
        pauseCarousel
    );


    carousel.addEventListener(
        "mouseleave",
        resumeCarousel
    );


    /* Touch */

    carousel.addEventListener(
        "touchstart",
        function () {

            touchActive = true;

            pauseCarousel();

        },
        {
            passive: true
        }
    );


    carousel.addEventListener(
        "touchend",
        function () {

            touchActive = false;

            resumeCarousel();

        },
        {
            passive: true
        }
    );


    carousel.addEventListener(
        "touchcancel",
        function () {

            touchActive = false;

            resumeCarousel();

        },
        {
            passive: true
        }
    );


    /* Next */

    if (nextButton) {

        nextButton.addEventListener(
            "click",
            function () {

                pauseCarousel();


                const visibleProjects =
                    getVisibleProjects();


                const maxIndex =
                    Math.max(
                        0,
                        cards.length -
                        visibleProjects
                    );


                if (
                    currentProject <
                    maxIndex
                ) {

                    currentProject++;

                } else {

                    currentProject = 0;

                }


                updateProjectCarousel();


                setTimeout(
                    resumeCarousel,
                    1200
                );

            }
        );

    }


    /* Previous */

    if (prevButton) {

        prevButton.addEventListener(
            "click",
            function () {

                pauseCarousel();


                const visibleProjects =
                    getVisibleProjects();


                const maxIndex =
                    Math.max(
                        0,
                        cards.length -
                        visibleProjects
                    );


                if (
                    currentProject > 0
                ) {

                    currentProject--;

                } else {

                    currentProject =
                        maxIndex;

                }


                updateProjectCarousel();


                setTimeout(
                    resumeCarousel,
                    1200
                );

            }
        );

    }


    /* Dots */

    dots.forEach(
        function (dot, index) {

            dot.addEventListener(
                "click",
                function () {

                    pauseCarousel();


                    const maxIndex =
                        Math.max(
                            0,
                            cards.length -
                            getVisibleProjects()
                        );


                    currentProject =
                        Math.min(
                            index,
                            maxIndex
                        );


                    updateProjectCarousel();


                    setTimeout(
                        resumeCarousel,
                        1200
                    );

                }
            );

        }
    );


    /* Resize */

    window.addEventListener(
        "resize",
        function () {

            updateProjectCarousel();

        }
    );


    /* Initial position */

    updateProjectCarousel();


    /* Start autoplay */

    startAutoPlay();

})();


/* =========================================================
   SCROLL REVEAL + STAT COUNTER
   ========================================================= */

(function () {

    const reduceMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    const revealSelectors = [

        ".section-title",
        ".about-text",
        ".about img",
        ".stat-card",
        ".card",
        ".timeline-item",
        ".project-card",
        ".team-card",
        ".comments"

    ];


    const revealElements = [];


    revealSelectors.forEach(
        function (selector) {

            document
                .querySelectorAll(selector)
                .forEach(
                    function (element) {

                        if (
                            !element.classList.contains(
                                "reveal-on-scroll"
                            )
                        ) {

                            element.classList.add(
                                "reveal-on-scroll"
                            );

                        }


                        revealElements.push(
                            element
                        );

                    }
                );

        }
    );


    /* Stagger cards */

    const staggerGroups = [

        ".stats",
        ".cards",
        ".team",
        ".timeline",
        ".projects-track"

    ];


    staggerGroups.forEach(
        function (selector) {

            const parent =
                document.querySelector(
                    selector
                );


            if (!parent) {
                return;
            }


            Array.from(
                parent.children
            ).forEach(
                function (
                    element,
                    index
                ) {

                    if (
                        element.matches(
                            ".stat-card, .card, .timeline-item, .project-card, .team-card"
                        )
                    ) {

                        element.style.setProperty(
                            "--reveal-delay",
                            Math.min(
                                index * 70,
                                350
                            ) + "ms"
                        );

                    }

                }
            );

        }
    );


    /* Scroll reveal */

    if (reduceMotion) {

        revealElements.forEach(
            function (element) {

                element.classList.add(
                    "is-visible"
                );

            }
        );

    } else {

        const revealObserver =
            new IntersectionObserver(
                function (
                    entries,
                    observer
                ) {

                    entries.forEach(
                        function (entry) {

                            if (
                                !entry.isIntersecting
                            ) {

                                return;

                            }


                            entry.target.classList.add(
                                "is-visible"
                            );


                            observer.unobserve(
                                entry.target
                            );

                        }
                    );

                },
                {
                    threshold: 0.12,
                    rootMargin:
                        "0px 0px -50px 0px"
                }
            );


        revealElements.forEach(
            function (element) {

                revealObserver.observe(
                    element
                );

            }
        );

    }


    /* =====================================================
       STAT COUNT-UP
       ===================================================== */

    const statCards =
        document.querySelectorAll(
            ".stat-card"
        );


    let statsAnimated = false;


    function animateCounter(
        numberElement,
        card
    ) {

        const target =
            Number(
                numberElement.dataset.count
            );


        const suffix =
            numberElement.dataset.suffix ||
            "";


        if (
            !Number.isFinite(target)
        ) {

            return;

        }


        /* Reduced motion */

        if (reduceMotion) {

            numberElement.textContent =
                target + suffix;

            return;

        }


        const duration = 1200;

        const startTime =
            performance.now();


        card.classList.add(
            "is-counting"
        );


        function updateCounter(
            currentTime
        ) {

            const elapsed =
                currentTime -
                startTime;


            const progress =
                Math.min(
                    elapsed /
                    duration,
                    1
                );


            const eased =
                1 -
                Math.pow(
                    1 - progress,
                    3
                );


            const currentValue =
                Math.floor(
                    target *
                    eased
                );


            numberElement.textContent =
                currentValue +
                suffix;


            if (
                progress < 1
            ) {

                requestAnimationFrame(
                    updateCounter
                );

            } else {

                numberElement.textContent =
                    target +
                    suffix;


                setTimeout(
                    function () {

                        card.classList.remove(
                            "is-counting"
                        );

                    },
                    180
                );

            }

        }


        requestAnimationFrame(
            updateCounter
        );

    }


    const statsSection =
        document.querySelector(
            "#stats"
        );


    if (
        statsSection &&
        statCards.length
    ) {

        const statsObserver =
            new IntersectionObserver(
                function (
                    entries,
                    observer
                ) {

                    entries.forEach(
                        function (entry) {

                            if (
                                entry.isIntersecting &&
                                !statsAnimated
                            ) {

                                statsAnimated =
                                    true;


                                statCards.forEach(
                                    function (card) {

                                        const number =
                                            card.querySelector(
                                                ".stat-number"
                                            );


                                        if (number) {

                                            animateCounter(
                                                number,
                                                card
                                            );

                                        }

                                    }
                                );


                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.35
                }
            );


        statsObserver.observe(
            statsSection
        );

    }

})();