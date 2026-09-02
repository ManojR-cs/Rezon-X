/* =========================================================
   SUPABASE CONFIGURATION
   ========================================================= */

const SUPABASE_URL = "https://zjmqqmxxxfzsabkimguh.supabase.co";

const SUPABASE_KEY = "sb_publishable_XK9cx2nyhTs9GB9qFeyA4w_ydlpztJl";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

/* =========================================================
   PROJECT LIKES - SUPABASE
========================================================= */

const VISITOR_ID_KEY = "rezonx_visitor_id";


function getVisitorId() {

    let visitorId =
        localStorage.getItem(
            VISITOR_ID_KEY
        );


    if (!visitorId) {

        visitorId =
            crypto.randomUUID();

        localStorage.setItem(
            VISITOR_ID_KEY,
            visitorId
        );

    }


    return visitorId;

}


const visitorId =
    getVisitorId();



/* =========================================================
   LOAD LIKE COUNTS
========================================================= */

async function loadLikeCounts() {

    const likeButtons =
        document.querySelectorAll(
            ".project-like-btn"
        );


    if (!likeButtons.length) {
        return;
    }


    const {
        data: likes,
        error
    } =
        await supabaseClient
            .from("project_likes")
            .select(
                "project_id, visitor_id"
            );


    if (error) {

        console.error(
            "Failed to load likes:",
            error
        );

        return;

    }


    const likeCountByProject = {};


    likes.forEach(
        function (like) {

            if (
                !likeCountByProject[
                    like.project_id
                ]
            ) {

                likeCountByProject[
                    like.project_id
                ] = 0;

            }


            likeCountByProject[
                like.project_id
            ]++;

        }
    );


    likeButtons.forEach(
        function (button) {

            const projectId =
                button.dataset.projectId;


            const countElement =
                button.querySelector(
                    ".like-count"
                );


            if (!countElement) {
                return;
            }


            countElement.textContent =
                likeCountByProject[
                    projectId
                ] || 0;


            const alreadyLiked =
                likes.some(
                    function (like) {

                        return (
                            like.project_id ===
                            projectId &&

                            like.visitor_id ===
                            visitorId
                        );

                    }
                );


            button.classList.toggle(
                "liked",
                alreadyLiked
            );


            button.setAttribute(
                "aria-pressed",
                String(alreadyLiked)
            );

        }
    );

}



/* =========================================================
   HANDLE PROJECT LIKES
========================================================= */

async function handleProjectLike(
    button
) {

    const projectId =
        button.dataset.projectId;


    if (!projectId) {

        console.error(
            "Project ID is missing."
        );

        return;

    }


    if (
        button.classList.contains(
            "liked"
        )
    ) {

        return;

    }


    button.disabled = true;


    try {

        const {
            data: existingLike,
            error: checkError
        } =
            await supabaseClient
                .from("project_likes")
                .select("id")
                .eq(
                    "project_id",
                    projectId
                )
                .eq(
                    "visitor_id",
                    visitorId
                )
                .maybeSingle();


        if (checkError) {

            throw checkError;

        }


        if (existingLike) {

            button.classList.add(
                "liked"
            );

            button.setAttribute(
                "aria-pressed",
                "true"
            );

            return;

        }


        const {
            error: insertError
        } =
            await supabaseClient
                .from("project_likes")
                .insert({

                    project_id:
                        projectId,

                    visitor_id:
                        visitorId

                });


        if (insertError) {
            if (insertError.code === "23505") {
                // Ignore unique constraint violation, act as if successful
                button.classList.add("liked");
                button.setAttribute("aria-pressed", "true");
                return;
            }
            throw insertError;
        }


        const countElement =
            button.querySelector(
                ".like-count"
            );


        if (countElement) {

            const currentCount =
                Number(
                    countElement.textContent
                ) || 0;


            countElement.textContent =
                currentCount + 1;

        }


        button.classList.add(
            "liked"
        );


        button.setAttribute(
            "aria-pressed",
            "true"
        );


    } catch (error) {

        console.error(
            "Failed to add like:",
            error
        );


        alert(
            "Unable to add your like. Please try again."
        );


    } finally {

        button.disabled = false;

    }

}



/* =========================================================
   INITIALIZE PROJECT LIKES
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const likeButtons =
            document.querySelectorAll(
                ".project-like-btn"
            );


        likeButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        handleProjectLike(
                            button
                        );

                    }
                );

            }
        );


        loadLikeCounts();

    }
);

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
   PROJECT COMMENTS - SUPABASE
   ========================================================= */

let activeProjectId = null;


/* =========================================================
   LOAD COMMENTS
   ========================================================= */

async function loadProjectComments(
    projectId
) {

    const commentsList =
        document.getElementById(
            "projectCommentsList"
        );

    const modalCommentCount =
        document.getElementById(
            "modalCommentCount"
        );


    if (
        !commentsList ||
        !modalCommentCount
    ) {

        return;

    }


    commentsList.innerHTML =
        "<p>Loading comments...</p>";


    try {

        const {
            data: comments,
            error
        } =
            await supabaseClient
                .from("public_project_comments")
                .select(
                    "id, name, message, created_at"
                )
                .eq(
                    "project_id",
                    projectId
                )
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (error) {

            throw error;

        }


        modalCommentCount.textContent =
            `${comments.length} Comment${
                comments.length === 1
                    ? ""
                    : "s"
            }`;


        commentsList.innerHTML = "";


        if (comments.length === 0) {

            commentsList.innerHTML =
                "<p class=\"no-comments\">No comments yet. Be the first to comment!</p>";

            return;

        }


        comments.forEach(
            function (comment) {

                const commentBox =
                    document.createElement(
                        "div"
                    );

                commentBox.className =
                    "project-comment";


                const name =
                    document.createElement(
                        "h4"
                    );

                name.textContent =
                    comment.name;


                const message =
                    document.createElement(
                        "p"
                    );

                message.textContent =
                    comment.message;


                const date =
                    document.createElement(
                        "small"
                    );

                date.textContent =
                    formatCommentDate(
                        comment.created_at
                    );


                commentBox.appendChild(
                    name
                );

                commentBox.appendChild(
                    message
                );

                commentBox.appendChild(
                    date
                );


                commentsList.appendChild(
                    commentBox
                );

            }
        );


    } catch (error) {

        console.error(
            "Failed to load comments:",
            error
        );


        commentsList.innerHTML =
            "<p class=\"comment-error\">Failed to load comments. Please try again.</p>";

    }

}



/* =========================================================
   FORMAT COMMENT DATE
   ========================================================= */

function formatCommentDate(
    dateString
) {

    if (!dateString) {

        return "";

    }


    const date =
        new Date(
            dateString
        );


    return date.toLocaleDateString(
        undefined,
        {

            year:
                "numeric",

            month:
                "short",

            day:
                "numeric"

        }
    );

}



/* =========================================================
   SUBMIT COMMENT
   ========================================================= */

async function submitProjectComment(
    event
) {

    event.preventDefault();


    if (!activeProjectId) {

        alert(
            "Please open a project first."
        );

        return;

    }


    const nameInput =
        document.getElementById(
            "commentName"
        );

    const emailInput =
        document.getElementById(
            "commentEmail"
        );

    const messageInput =
        document.getElementById(
            "commentMessage"
        );

    const submitButton =
        event.target.querySelector(
            ".submit-comment-btn"
        );


    if (
        !nameInput ||
        !emailInput ||
        !messageInput ||
        !submitButton
    ) {

        return;

    }


    const name =
        nameInput.value.trim();

    const email =
        emailInput.value.trim();

    const message =
        messageInput.value.trim();


    if (
        !name ||
        !message
    ) {

        alert(
            "Please enter your name and comment."
        );

        return;

    }


    submitButton.disabled =
        true;

    submitButton.textContent =
        "Posting...";


    try {

        const {
            error
        } =
            await supabaseClient
                .from(
                    "project_comments"
                )
                .insert({

                    project_id:
                        activeProjectId,

                    name:
                        name,

                    email:
                        email || null,

                    message:
                        message

                });


        if (error) {

            throw error;

        }


        nameInput.value = "";
        emailInput.value = "";
        messageInput.value = "";


        await loadProjectComments(
            activeProjectId
        );


        await loadProjectCommentCounts();


        submitButton.textContent =
            "Comment Posted";


        setTimeout(
            function () {

                submitButton.textContent =
                    "Post Comment";

            },
            1500
        );


    } catch (error) {

        console.error(
            "Failed to submit comment:",
            error
        );


        alert(
            "Failed to submit comment. Please try again."
        );


        submitButton.textContent =
            "Post Comment";


    } finally {

        submitButton.disabled =
            false;

    }

}



async function loadProjectCommentCounts() {

    const commentCountElements =
        document.querySelectorAll(
            ".comment-count[data-project-id]"
        );


    if (!commentCountElements.length) {
        return;
    }


    try {

        const {
            data: comments,
            error
        } =
            await supabaseClient
                .from(
                    "public_project_comments"
                )
                .select(
                    "project_id"
                );


        if (error) {
            throw error;
        }


        const commentCountByProject =
            {};


        comments.forEach(
            function (comment) {

                if (
                    !commentCountByProject[
                        comment.project_id
                    ]
                ) {

                    commentCountByProject[
                        comment.project_id
                    ] = 0;

                }


                commentCountByProject[
                    comment.project_id
                ]++;

            }
        );


        commentCountElements.forEach(
            function (countElement) {

                const projectId =
                    countElement.dataset.projectId;


                countElement.textContent =
                    commentCountByProject[
                        projectId
                    ] || 0;

            }
        );


    } catch (error) {

        console.error(
            "Failed to load comment counts:",
            error
        );

    }

}


/* =========================================================
   INITIALIZE PROJECT COMMENTS
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const commentForm =
            document.getElementById(
                "projectCommentForm"
            );


        if (commentForm) {

            commentForm.addEventListener(
                "submit",
                submitProjectComment
            );

        }


       


        loadProjectCommentCounts();

    }
);

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
   DYNAMIC PROJECTS & MODAL - SUPABASE
   ========================================================= */

let projectsMap = {};

function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function getProjectSlug(project) {
    if (project.slug && String(project.slug).trim()) {
        return String(project.slug).trim();
    }
    const title = (project.title || "").toLowerCase();
    if (title.includes("crop care")) return "crop-care";
    if (title.includes("agribot")) return "agribot";
    if (title.includes("voice")) return "voice-bot";
    if (title.includes("pet bottle") || title.includes("filament")) return "pet-filament";
    if (title.includes("smart kiosk") || title.includes("smartprint")) return "smart-kiosk";
    return (project.title || "project").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function getProjectTechStack(project) {
    if (Array.isArray(project.tech_stack)) return project.tech_stack;
    if (typeof project.tech_stack === "string" && project.tech_stack.trim()) {
        return project.tech_stack.split(",").map(function (t) { return t.trim(); }).filter(Boolean);
    }
    const title = (project.title || "").toLowerCase();
    if (title.includes("crop care")) return ["Python", "YOLO", "AI", "n8n"];
    if (title.includes("agribot")) return ["Robotics", "Sensors", "Automation"];
    if (title.includes("voice")) return ["Robotics", "Voice Recognition", "Embedded Systems"];
    if (title.includes("pet bottle") || title.includes("filament")) return ["3D Printing", "Recycling", "Mechanical Design"];
    if (title.includes("smart kiosk") || title.includes("smartprint")) return ["Python", "Web Development", "UPI", "Automation"];
    return ["Innovation", "Technology"];
}

async function loadProjects() {
    const track = document.querySelector(".projects-track");
    const dotsContainer = document.querySelector(".project-dots");

    if (!track) return;

    try {
        const { data: projects, error } = await supabaseClient
            .from("projects")
            .select("*")
            .order("id", { ascending: true });

        if (error) {
            console.error("Failed to load projects from Supabase:", error);
            track.innerHTML = '<div class="no-projects-msg" style="padding: 40px; text-align: center; color: #94a3b8; width: 100%;">Failed to load projects.</div>';
            return;
        }

        if (!projects || projects.length === 0) {
            track.innerHTML = '<div class="no-projects-msg" style="padding: 40px; text-align: center; color: #94a3b8; width: 100%;">No projects available yet.</div>';
            if (dotsContainer) dotsContainer.innerHTML = '';
            return;
        }

        projectsMap = {};
        track.innerHTML = "";

        projects.forEach(function (project) {
            const slug = getProjectSlug(project);
            projectsMap[slug] = project;
            projectsMap[project.id] = project;

            const techStack = getProjectTechStack(project);
            const imageUrl = project.image_url || "assets/projects/agribot.png";
            const shortDesc = project.short_description || project.description || "";

            const article = document.createElement("article");
            article.className = "project-card";
            article.setAttribute("data-project-id", slug);

            const techBadgesHtml = techStack.map(function (t) {
                return `<span>${escapeHtml(t)}</span>`;
            }).join("");

            article.innerHTML = `
                <div class="project-image">
                    <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(project.title)}">
                </div>
                <div class="project-content">
                    <h3>${escapeHtml(project.title)}</h3>
                    <p class="project-brief">${escapeHtml(shortDesc)}</p>
                    <div class="project-tech-stack">
                        ${techBadgesHtml}
                    </div>
                    <button class="project-btn">View Project</button>
                    <div class="project-engagement">
                        <button class="project-like-btn" data-project-id="${escapeHtml(slug)}" aria-label="Like ${escapeHtml(project.title)} project">
                            <span>❤️</span>
                            <span class="like-count">0</span>
                        </button>
                        <button class="project-comment-btn" data-project-id="${escapeHtml(slug)}" aria-label="View ${escapeHtml(project.title)} comments">
                            <span>💬</span>
                            <span class="comment-count" data-project-id="${escapeHtml(slug)}">0</span>
                        </button>
                    </div>
                </div>
            `;

            article.querySelector(".project-btn").addEventListener("click", function() {
                openProjectModal(slug);
            });

            article.querySelector(".project-comment-btn").addEventListener("click", function() {
                openProjectModal(slug);
            });

            article.querySelector(".project-like-btn").addEventListener("click", function() {
                handleProjectLike(this);
            });

            track.appendChild(article);
        });

        if (dotsContainer) {
            dotsContainer.innerHTML = "";
            projects.forEach(function (_, index) {
                const dotBtn = document.createElement("button");
                dotBtn.className = index === 0 ? "project-dot active" : "project-dot";
                dotBtn.setAttribute("aria-label", `Project ${index + 1}`);
                dotsContainer.appendChild(dotBtn);
            });
        }

        initProjectCarousel();
        loadLikeCounts();
        loadProjectCommentCounts();

    } catch (err) {
        console.error("Error loading dynamic projects:", err);
    }
}

/* =========================================================
   PROJECT MODAL
   ========================================================= */

function openProjectModal(projectId) {
    activeProjectId = projectId;
    const project = projectsMap[projectId];

    if (!project) {
        console.error("Project not found:", projectId);
        return;
    }

    const modal = document.getElementById("projectModal");
    const image = document.getElementById("modalProjectImage");
    const title = document.getElementById("modalProjectTitle");
    const description = document.getElementById("modalProjectDescription");
    const techContainer = document.getElementById("modalProjectTech");

    if (!modal || !image || !title || !description || !techContainer) {
        console.error("Project modal elements are missing.");
        return;
    }

    image.src = project.image_url || project.image || "assets/projects/agribot.png";
    image.alt = project.title || "Project Image";
    title.textContent = project.title || "";
    description.textContent = project.description || project.short_description || "";

    techContainer.innerHTML = "";
    const techList = getProjectTechStack(project);
    techList.forEach(function (technology) {
        const tag = document.createElement("span");
        tag.className = "project-tech";
        tag.textContent = technology;
        techContainer.appendChild(tag);
    });

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    loadProjectComments(projectId);
}

function closeProjectModal() {
    const modal = document.getElementById("projectModal");
    if (!modal) return;

    modal.classList.remove("active");
    activeProjectId = null;
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

/* Project modal background click */
(function () {
    const projectModal = document.getElementById("projectModal");
    if (!projectModal) return;

    projectModal.addEventListener("click", function (event) {
        if (event.target === projectModal) {
            closeProjectModal();
        }
    });
})();

/* Project modal Escape key */
document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    const projectModal = document.getElementById("projectModal");
    if (projectModal && projectModal.classList.contains("active")) {
        closeProjectModal();
    }
});

/* =========================================================
   PROJECT CAROUSEL INITIALIZATION
   ========================================================= */

let autoPlayTimer = null;

function initProjectCarousel() {
    const track = document.querySelector(".projects-track");
    const cards = document.querySelectorAll(".project-card");
    const nextButton = document.querySelector(".project-next");
    const prevButton = document.querySelector(".project-prev");
    const carousel = document.querySelector(".projects-carousel");
    const dots = document.querySelectorAll(".project-dot");

    if (!track || !cards.length || !carousel) {
        return;
    }

    let currentProject = 0;
    let isPaused = false;
    let touchActive = false;
    const AUTO_PLAY_DELAY = 3500;

    function getVisibleProjects() {
        if (window.innerWidth <= 700) return 1;
        if (window.innerWidth <= 1100) return 2;
        return 3;
    }

    function updateProjectDots() {
        dots.forEach(function (dot, index) {
            dot.classList.toggle("active", index === currentProject);
        });
    }

    function updateProjectCarousel() {
        if (!cards.length) return;

        const visibleProjects = getVisibleProjects();
        const cardWidth = cards[0].getBoundingClientRect().width;
        const gap = window.innerWidth <= 700 ? 20 : 30;
        const maxIndex = Math.max(0, cards.length - visibleProjects);

        if (currentProject > maxIndex) currentProject = maxIndex;
        if (currentProject < 0) currentProject = 0;

        const moveAmount = currentProject * (cardWidth + gap);
        track.style.transform = `translateX(-${moveAmount}px)`;
        updateProjectDots();
    }

    function moveNext() {
        if (isPaused || touchActive) return;
        const visibleProjects = getVisibleProjects();
        const maxIndex = Math.max(0, cards.length - visibleProjects);

        if (currentProject < maxIndex) {
            currentProject++;
        } else {
            currentProject = 0;
        }

        updateProjectCarousel();
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayTimer = setInterval(moveNext, AUTO_PLAY_DELAY);
    }

    function stopAutoPlay() {
        if (autoPlayTimer) {
            clearInterval(autoPlayTimer);
            autoPlayTimer = null;
        }
    }

    function pauseCarousel() {
        isPaused = true;
        stopAutoPlay();
    }

    function resumeCarousel() {
        isPaused = false;
        setTimeout(function () {
            if (!isPaused && !touchActive) {
                startAutoPlay();
            }
        }, 800);
    }

    /* Clear old listeners by cloning buttons if re-initialized */
    if (nextButton && !nextButton.dataset.bound) {
        nextButton.dataset.bound = "true";
        nextButton.addEventListener("click", function () {
            pauseCarousel();
            const maxIndex = Math.max(0, cards.length - getVisibleProjects());
            if (currentProject < maxIndex) {
                currentProject++;
            } else {
                currentProject = 0;
            }
            updateProjectCarousel();
            setTimeout(resumeCarousel, 1200);
        });
    }

    if (prevButton && !prevButton.dataset.bound) {
        prevButton.dataset.bound = "true";
        prevButton.addEventListener("click", function () {
            pauseCarousel();
            const maxIndex = Math.max(0, cards.length - getVisibleProjects());
            if (currentProject > 0) {
                currentProject--;
            } else {
                currentProject = maxIndex;
            }
            updateProjectCarousel();
            setTimeout(resumeCarousel, 1200);
        });
    }

    dots.forEach(function (dot, index) {
        if (!dot.dataset.bound) {
            dot.dataset.bound = "true";
            dot.addEventListener("click", function () {
                pauseCarousel();
                const maxIndex = Math.max(0, cards.length - getVisibleProjects());
                currentProject = Math.min(index, maxIndex);
                updateProjectCarousel();
                setTimeout(resumeCarousel, 1200);
            });
        }
    });

    if (!carousel.dataset.bound) {
        carousel.dataset.bound = "true";
        carousel.addEventListener("mouseenter", pauseCarousel);
        carousel.addEventListener("mouseleave", resumeCarousel);
        carousel.addEventListener("touchstart", function () {
            touchActive = true;
            pauseCarousel();
        }, { passive: true });
        carousel.addEventListener("touchend", function () {
            touchActive = false;
            resumeCarousel();
        }, { passive: true });
        carousel.addEventListener("touchcancel", function () {
            touchActive = false;
            resumeCarousel();
        }, { passive: true });

        window.addEventListener("resize", function () {
            updateProjectCarousel();
        });
    }

    updateProjectCarousel();
    startAutoPlay();
}


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
                revealObserver.observe(element);
            }
        );

        /* Expose observer for dynamically loaded items */
        window._rezonxRevealObserver = revealObserver;

    }


    /* Stat count-up animation is handled by initStatsObserver()
       which is called after loadSiteSettings() resolves so that
       the Supabase member_count is set on data-count before
       any counter reads it. See CONSOLIDATED INITIALIZATION. */

})();


/* =========================================================
   STAT COUNT-UP — initStatsObserver
   Called after loadSiteSettings() resolves so that the
   Supabase member_count has already been written into
   data-count before any counter reads it.
========================================================= */

var _statsObserverInitialised = false;

function initStatsObserver() {

    if (_statsObserverInitialised) {
        return;
    }

    var statsSection = document.getElementById("stats");

    if (!statsSection) {
        return;
    }

    var statNumbers = statsSection.querySelectorAll(".stat-number");

    if (!statNumbers.length) {
        return;
    }

    _statsObserverInitialised = true;

    var reduceMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function animateCounter(numberElement, card) {

        var target = Number(numberElement.dataset.count);
        var suffix = numberElement.dataset.suffix || "";

        if (!Number.isFinite(target)) {
            return;
        }

        if (reduceMotion) {
            numberElement.textContent = target + suffix;
            return;
        }

        var duration = 1200;
        var startTime = performance.now();

        card.classList.add("is-counting");

        function updateCounter(currentTime) {

            var elapsed  = currentTime - startTime;
            var progress = Math.min(elapsed / duration, 1);
            var eased    = 1 - Math.pow(1 - progress, 3);
            var value    = Math.floor(target * eased);

            numberElement.textContent = value + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                numberElement.textContent = target + suffix;
                setTimeout(function () {
                    card.classList.remove("is-counting");
                }, 180);
            }

        }

        requestAnimationFrame(updateCounter);
    }

    function runAllCounters() {
        statNumbers.forEach(function (numberElement) {
            var card = numberElement.closest(".stat-card") || numberElement.parentElement;
            animateCounter(numberElement, card);
        });
    }

    /* If reduced motion or section already visible, run immediately */
    if (reduceMotion) {
        runAllCounters();
        return;
    }

    var observer = new IntersectionObserver(
        function (entries, obs) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                    return;
                }
                obs.disconnect();
                runAllCounters();
            });
        },
        {
            threshold: 0.2
        }
    );

    observer.observe(statsSection);

}


/* =========================================================
   RECENT HIGHLIGHTS - INFINITE SCROLL
========================================================= */

(function () {

    const highlightsTrack =
        document.querySelector(
            ".highlights-track"
        );


    if (!highlightsTrack) {
        return;
    }


    const originalCards =
        Array.from(
            highlightsTrack.children
        );


    originalCards.forEach(
        function (card) {

            const duplicate =
                card.cloneNode(true);


            duplicate.setAttribute(
                "aria-hidden",
                "true"
            );


            highlightsTrack.appendChild(
                duplicate
            );

        }
    );

})();

/* =========================================================
   CMS ACTIVITIES / RECENT HIGHLIGHTS
========================================================= */

async function loadActivities() {

    const activitiesTrack =
        document.getElementById(
            "activitiesTrack"
        );


    if (!activitiesTrack) {
        return;
    }


    const {
        data: activities,
        error
    } = await supabaseClient
        .from("activities")
        .select("*")
        .order(
            "created_at",
            {
                ascending: false
            }
        );


    if (error) {

        console.error(
            "Failed to load activities:",
            error
        );


        activitiesTrack.innerHTML =
            `
            <div class="activities-loading">

                Unable to load recent highlights.

            </div>
            `;


        return;

    }


    if (
        !activities ||
        activities.length === 0
    ) {

        activitiesTrack.innerHTML =
            `
            <div class="activities-loading">

                No recent highlights available.

            </div>
            `;


        return;

    }


    activitiesTrack.innerHTML =
        "";


    function createActivityCard(
        activity
    ) {

        const card =
            document.createElement(
                "a"
            );


        card.className =
            "activity-card";


        card.href =
            activity.link || "#";


        if (activity.link) {

            card.target =
                "_blank";


            card.rel =
                "noopener noreferrer";

        }


        const imageUrl =
            activity.image_url ||
            "assets/placeholder.jpg";


        const date =
            activity.created_at
                ? new Date(
                    activity.created_at
                ).toLocaleDateString(
                    "en-IN",
                    {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                    }
                )
                : "";


        card.innerHTML =
            `
            <div
                class="activity-image-wrapper">

                <img
                    class="activity-image"
                    src="${imageUrl}"
                    alt="">


                <div
                    class="activity-overlay">

                    <span
                        class="activity-read-more">

                        Read More ↗

                    </span>

                </div>

            </div>


            <div
                class="activity-content">

                <h3
                    class="activity-title">

                </h3>


                <p
                    class="activity-description">

                </p>


                <p
                    class="activity-date">

                </p>

            </div>
            `;


        card
            .querySelector(
                ".activity-image"
            )
            .alt =
            activity.title || "RezonX activity";


        card
            .querySelector(
                ".activity-title"
            )
            .textContent =
            activity.title || "";


        card
            .querySelector(
                ".activity-description"
            )
            .textContent =
            activity.description || "";


        card
            .querySelector(
                ".activity-date"
            )
            .textContent =
            date;


        return card;

    }


    /* ORIGINAL CARDS */

    activities.forEach(
        function (activity) {

            activitiesTrack.appendChild(
                createActivityCard(
                    activity
                )
            );

        }
    );


    /* DUPLICATE CARDS FOR
       INFINITE SCROLL */

    activities.forEach(
        function (activity) {

            activitiesTrack.appendChild(
                createActivityCard(
                    activity
                )
            );

        }
    );

}


/* =========================================================
   LOAD ACHIEVEMENTS - SUPABASE
   ========================================================= */

let achievementsLoaded = false;

async function loadAchievements() {

    if (achievementsLoaded) {
        return;
    }

    achievementsLoaded = true;

    const container =
        document.getElementById(
            "achievementsContainer"
        );

    if (!container) {
        return;
    }

    try {

        const {
            data: achievements,
            error
        } = await supabaseClient
            .from("achievements")
            .select("id, title, description, image_url, created_at")
            .order("created_at", { ascending: false });

        if (error) {
            throw error;
        }

        if (!achievements || achievements.length === 0) {
            container.innerHTML =
                '<p style="text-align:center;color:#94a3b8;padding:40px 0;">No achievements to display yet.</p>';
            return;
        }

        container.innerHTML = "";

        achievements.forEach(function (achievement) {

            const card =
                document.createElement("div");

            card.className = "card";

            const img =
                document.createElement("img");

            img.src =
                achievement.image_url || "";

            img.alt =
                achievement.title || "Achievement";

            const content =
                document.createElement("div");

            content.className = "card-content";

            const heading =
                document.createElement("h3");

            heading.textContent =
                achievement.title || "";

            content.appendChild(heading);

            if (achievement.description) {

                const desc =
                    document.createElement("p");

                desc.textContent =
                    achievement.description;

                content.appendChild(desc);

            }

            card.appendChild(img);
            card.appendChild(content);

            container.appendChild(card);

            /* Register new card with scroll reveal observer */
            if (window._rezonxRevealObserver) {
                card.classList.add("reveal-on-scroll");
                window._rezonxRevealObserver.observe(card);
            }

        });

    } catch (err) {

        console.error(
            "Failed to load achievements:",
            err
        );

        const container2 =
            document.getElementById(
                "achievementsContainer"
            );

        if (container2 && !container2.children.length) {
            container2.innerHTML =
                '<p style="text-align:center;color:#94a3b8;padding:40px 0;">Unable to load achievements.</p>';
        }

    }

}


/* =========================================================
   LOAD GALLERY - SUPABASE
   ========================================================= */

let galleryLoaded = false;

function openAlbumLightbox(album) {

    const lightbox =
        document.getElementById("galleryLightbox");

    const content =
        document.getElementById("galleryLightboxContent");

    if (!lightbox || !content) {
        return;
    }

    content.innerHTML = "";

    // Header with album title & photo count
    const header = document.createElement("div");
    header.className = "gallery-modal-header";
    header.style.gridColumn = "1 / -1";

    const titleEl = document.createElement("h2");
    titleEl.className = "gallery-modal-title";
    titleEl.textContent = album.name;

    const subtitleEl = document.createElement("p");
    subtitleEl.className = "gallery-modal-subtitle";
    subtitleEl.textContent = `${album.images.length} Photos in this Event Album • Click any photo to view full size`;

    header.appendChild(titleEl);
    header.appendChild(subtitleEl);
    content.appendChild(header);

    // Image grid
    album.images.forEach(function (imgObj, index) {

        const wrap = document.createElement("div");
        wrap.className = "gallery-modal-img-wrap";

        const img = document.createElement("img");
        img.src = imgObj.image_url;
        img.alt = imgObj.title || `${album.name} photo ${index + 1}`;
        img.loading = "lazy";

        wrap.appendChild(img);

        wrap.addEventListener("click", function () {
            openSinglePhotoViewer(imgObj.image_url, imgObj.title || album.name);
        });

        content.appendChild(wrap);

    });

    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

}

function openSinglePhotoViewer(imageUrl, captionText) {

    // If an existing single photo viewer exists, remove it
    let viewer = document.getElementById("singlePhotoViewer");
    if (viewer) {
        viewer.remove();
    }

    viewer = document.createElement("div");
    viewer.id = "singlePhotoViewer";
    viewer.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.96);z-index:10001;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;cursor:zoom-out;";

    const closeBtn = document.createElement("span");
    closeBtn.innerHTML = "&times;";
    closeBtn.style.cssText = "position:fixed;top:20px;right:30px;font-size:45px;color:#fff;font-weight:bold;cursor:pointer;z-index:10002;transition:0.2s;";
    closeBtn.addEventListener("mouseover", function () { closeBtn.style.color = "#00d9ff"; });
    closeBtn.addEventListener("mouseout", function () { closeBtn.style.color = "#fff"; });

    const img = document.createElement("img");
    img.src = imageUrl;
    img.style.cssText = "max-width:90vw;max-height:82vh;object-fit:contain;border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,0.8);cursor:default;";

    const caption = document.createElement("p");
    caption.textContent = captionText || "";
    caption.style.cssText = "color:#94a3b8;margin-top:14px;font-size:0.95rem;text-align:center;";

    viewer.appendChild(closeBtn);
    viewer.appendChild(img);
    if (captionText) {
        viewer.appendChild(caption);
    }

    function closeViewer(e) {
        if (e.target === viewer || e.target === closeBtn) {
            viewer.remove();
        }
    }

    viewer.addEventListener("click", closeViewer);
    document.body.appendChild(viewer);

}

function closeGalleryLightbox() {

    const lightbox =
        document.getElementById("galleryLightbox");

    if (!lightbox) {
        return;
    }

    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    // Remove single viewer if active
    const singleViewer = document.getElementById("singlePhotoViewer");
    if (singleViewer) {
        singleViewer.remove();
    }

}


/* Wire up lightbox close handlers once */
(function () {

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            const closeBtn =
                document.getElementById(
                    "galleryLightboxClose"
                );

            if (closeBtn) {
                closeBtn.addEventListener(
                    "click",
                    closeGalleryLightbox
                );
            }

            const lightbox =
                document.getElementById(
                    "galleryLightbox"
                );

            if (lightbox) {
                lightbox.addEventListener(
                    "click",
                    function (event) {
                        if (event.target === lightbox) {
                            closeGalleryLightbox();
                        }
                    }
                );
            }

        }
    );

    document.addEventListener(
        "keydown",
        function (event) {
            if (event.key !== "Escape") {
                return;
            }
            const singleViewer = document.getElementById("singlePhotoViewer");
            if (singleViewer) {
                singleViewer.remove();
                return;
            }
            const lightbox =
                document.getElementById("galleryLightbox");
            if (lightbox && lightbox.classList.contains("active")) {
                closeGalleryLightbox();
            }
        }
    );

})();


async function loadGallery() {

    if (galleryLoaded) {
        return;
    }

    galleryLoaded = true;

    const track =
        document.getElementById("galleryTrack");

    if (!track) {
        return;
    }

    try {

        let images = null;

        // Try selecting with event_name and is_cover first
        const {
            data: fullData,
            error: fullError
        } = await supabaseClient
            .from("gallery")
            .select("id, title, image_url, created_at")
            .order("created_at", { ascending: true });

        if (fullError) {
            throw fullError;
        }

        images = fullData;

        track.innerHTML = "";

        if (!images || images.length === 0) {
            track.innerHTML =
                '<div style="padding:40px;text-align:center;color:#94a3b8;width:100vw;">No gallery images yet.</div>';
            return;
        }

        // Group images by Event / Album name
        const albumMap = new Map();

        images.forEach(function (img) {
            const albumName = img.event_name || img.title || "RezonX Gallery";
            if (!albumMap.has(albumName)) {
                albumMap.set(albumName, {
                    name: albumName,
                    cover: null,
                    images: []
                });
            }
            const album = albumMap.get(albumName);
            album.images.push(img);
            if (img.is_cover || !album.cover) {
                album.cover = img;
            }
        });

        const albums = Array.from(albumMap.values());

        function createAlbumCard(album) {

            const card = document.createElement("div");
            card.className = "gallery-album-card";
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
            card.setAttribute("aria-label", `View ${album.name} album (${album.images.length} photos)`);

            const coverUrl = album.cover ? album.cover.image_url : (album.images[0] ? album.images[0].image_url : "");

            const img = document.createElement("img");
            img.src = coverUrl;
            img.alt = album.name;
            img.loading = "lazy";

            const overlay = document.createElement("div");
            overlay.className = "gallery-album-overlay";

            const title = document.createElement("h3");
            title.className = "gallery-album-title";
            title.textContent = album.name;

            const count = document.createElement("span");
            count.className = "gallery-album-count";
            count.textContent = `📷 ${album.images.length} Photo${album.images.length === 1 ? "" : "s"}`;

            overlay.appendChild(title);
            overlay.appendChild(count);

            card.appendChild(img);
            card.appendChild(overlay);

            card.addEventListener("click", function () {
                openAlbumLightbox(album);
            });

            card.addEventListener("keydown", function (e) {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openAlbumLightbox(album);
                }
            });

            return card;

        }

        // Original set of album cards
        albums.forEach(function (album) {
            track.appendChild(
                createAlbumCard(album)
            );
        });

        // Duplicate set for seamless CSS infinite marquee
        albums.forEach(function (album) {
            const duplicate =
                createAlbumCard(album);
            duplicate.setAttribute(
                "aria-hidden",
                "true"
            );
            track.appendChild(duplicate);
        });

    } catch (err) {

        console.error(
            "Failed to load gallery:",
            err
        );

        const track2 =
            document.getElementById("galleryTrack");

        if (track2) {
            track2.innerHTML =
                '<div style="padding:40px;text-align:center;color:#94a3b8;width:100vw;">Unable to load gallery.</div>';
        }

    }

}


/* =========================================================
   LOAD SITE SETTINGS - MEMBER COUNT & HERO BACKGROUND
   ========================================================= */

async function loadSiteSettings() {

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("site_settings")
            .select("member_count, hero_image_url")
            .eq("id", 1)
            .single();

        if (error) {
            throw error;
        }

        if (data) {

            /* 1. Member Count */
            if (typeof data.member_count === "number") {
                const memberStatEl =
                    document.querySelector(
                        ".stat-number[data-member-count]"
                    ) ||
                    (function () {
                        /* Fallback: find by sibling text "Members" */
                        const statNumbers =
                            document.querySelectorAll(
                                ".stat-number"
                            );

                        for (let i = 0; i < statNumbers.length; i++) {
                            const card = statNumbers[i].closest(".stat-card");
                            if (
                                card &&
                                card.textContent &&
                                card.textContent.toLowerCase().includes("member")
                            ) {
                                return statNumbers[i];
                            }
                        }

                        return null;
                    })();

                if (memberStatEl) {
                    memberStatEl.dataset.count =
                        String(data.member_count);
                }
            }

            /* 2. Dynamic Hero Background Image */
            if (
                data.hero_image_url &&
                typeof data.hero_image_url === "string" &&
                data.hero_image_url.trim() !== ""
            ) {
                const heroSection = document.querySelector(".hero");
                if (heroSection) {
                    heroSection.style.backgroundImage =
                        'linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.7)), url("' +
                        data.hero_image_url.trim() +
                        '")';
                }
            }

        }

    } catch (err) {

        console.error(
            "Failed to load site settings:",
            err
        );

        /* Retain existing fallback value — do nothing */

    }

}


/* =========================================================
   CONSOLIDATED INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* 1. Fetch member count first — data-count on the member
              stat element is updated before the stats observer
              reads it, preventing a race condition. */
        loadSiteSettings().then(function () {

            /* 2. Initialise the stat count-up observer now that
                  member_count is already written into data-count. */
            initStatsObserver();

            /* 3. Load dynamic CMS content. */
            loadProjects();
            loadAchievements();
            loadGallery();

        });

    }
);

/* Activities marquee runs independently (no DOM dependency) */
loadActivities();