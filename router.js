// ===================== ROUTER =====================

/**
 * Sets the active page.
 * @param {string} key - The key of the page to set as active.
 */
function setActivePage(key) {
    document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
    const target = document.getElementById("page" + key);
    const home = document.getElementById("pagehome");
    (target || home).classList.add("active");
    window.scrollTo(0, 0);
}

/**
 * Gets the current route from the URL pathname.
 * @returns {string} The current route.
 */
function currentRoute() {
    const path = window.location.pathname;
    const key = path === '/' ? 'home' : path.substring(1);
    // Known static pages
    const staticPages = ["home", "calc", "pomodoro", "adkar", "quiz", "habits", "flashcards", "resources", "khetma", "teachers", "contributors", "s1", "s2", "s3", "s4", "s5", "s6"];
    if (staticPages.includes(key)) return key;
    return SEMESTERS.some((s) => s.key === key) ? key : "home";
}

/**
 * Initializes the pages for each semester by dynamically generating the UI
 */
function initPages() {
    // Generate the UI for each semester page
    for (const sem of SEMESTERS) {
        const semKey = sem.key;
        const pageEl = document.getElementById("page" + semKey);

        if (pageEl && !pageEl.hasChildNodes()) {
            // Generate the page HTML using the template
            pageEl.innerHTML = pageTemplate(semKey, sem.label);

            // Build the modules UI
            buildModulesUI(semKey);

            // Attach event listeners
            const btnCalc = document.getElementById("btnCalc" + semKey);
            const btnReset = document.getElementById("btnReset" + semKey);
            const btnExample = document.getElementById("btnExample" + semKey);
            const btnHome = document.getElementById("btnHome" + semKey);

            if (btnCalc) btnCalc.addEventListener("click", () => computeAndRender(semKey));
            if (btnReset) btnReset.addEventListener("click", () => resetUI(semKey));
            if (btnExample) btnExample.addEventListener("click", () => {
                fillExample(semKey);
                computeAndRender(semKey);
            });
            if (btnHome) btnHome.addEventListener("click", () => navigateTo('home'));
        }
    }
}

/**
 * Navigate to a specific route using History API
 * @param {string} route - The route to navigate to
 */
function navigateTo(route) {
    history.pushState({}, '', '/' + route);
    const apply = () => {
        const route = currentRoute();
        setActivePage(route);

        // Initialize teachers page when navigating to it
        if (route === 'teachers') {
            initTeachersPage();
        }
        // Initialize resources page when navigating to it
        if (route === 'resources') {
            initResourcesPage();
        }
        // Initialize flashcards page when navigating to it
        if (route === 'flashcards') {
            initFlashcards();
        }
        // Initialize khetma page when navigating to it
        if (route === 'khetma') {
            renderKhetmaList(); // Assuming this function exists
        }
    };
    apply();
}

/**
 * Initializes the router using History API instead of hash
 */
function initRouter() {
    const apply = () => {
        const route = currentRoute();
        setActivePage(route);

        // Initialize teachers page when navigating to it
        if (route === 'teachers') {
            initTeachersPage();
        }
        // Initialize resources page when navigating to it
        if (route === 'resources') {
            initResourcesPage();
        }
        // Initialize flashcards page when navigating to it
        if (route === 'flashcards') {
            initFlashcards();
        }
        // Initialize khetma page when navigating to it
        if (route === 'khetma') {
            renderKhetmaList(); // Assuming this function exists
        }
    };

    // Handle initial load
    apply();

    // Handle back/forward buttons
    window.addEventListener('popstate', apply);

    // Intercept all link clicks to prevent full page reloads
    document.addEventListener('click', function (event) {
        const target = event.target.closest('a');
        if (target && target.href.startsWith(window.location.origin)) {
            event.preventDefault();
            const path = new URL(target.href).pathname;
            if (path !== window.location.pathname) {
                navigateTo(path.substring(1)); // Remove leading slash
            }
        }
    });
}