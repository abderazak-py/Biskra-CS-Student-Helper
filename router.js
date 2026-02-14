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
 * Initializes the pages for each semester with direct HTML content instead of dynamic generation
 */
function initPages() {
    // We no longer need to initialize pages dynamically since they are in HTML
    // Just ensure any event listeners are attached
    for (const sem of SEMESTERS) {
        const semKey = sem.key;
        const btnCalcElement = document.getElementById("btnCalc" + semKey);
        const btnResetElement = document.getElementById("btnReset" + semKey);
        const btnExampleElement = document.getElementById("btnExample" + semKey);
        const btnHomeElement = document.getElementById("btnHome" + semKey);
        
        if(btnCalcElement) btnCalcElement.addEventListener("click", () => computeAndRender(semKey));
        if(btnResetElement) btnResetElement.addEventListener("click", () => resetUI(semKey));
        if(btnExampleElement) btnExampleElement.addEventListener("click", () => {
            fillExample(semKey);
            computeAndRender(semKey);
        });
        if(btnHomeElement) btnHomeElement.addEventListener("click", () => navigateTo('home'));
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
    document.addEventListener('click', function(event) {
        const target = event.target.closest('a');
        if (target && target.href.startsWith(window.location.origin)) {
            event.preventDefault();
            const path = new URL(target.href).pathname;
            if(path !== window.location.pathname) {
                navigateTo(path.substring(1)); // Remove leading slash
            }
        }
    });
}