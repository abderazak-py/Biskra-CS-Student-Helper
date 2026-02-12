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
 * Gets the current route from the URL hash.
 * @returns {string} The current route.
 */
function currentRoute() {
    const key = (location.hash || "#home").replace("#", "");
    // FIX: add "habits" to known static pages (your HTML has id="pagehabits")
    const staticPages = ["home", "calc", "pomodoro", "adkar", "quiz", "habits", "flashcards", "resources", "khetma"];
    if (staticPages.includes(key)) return key;
    return SEMESTERS.some((s) => s.key === key) ? key : "home";
}

/**
 * Initializes the pages for each semester.
 */
function initPages() {
    for (const sem of SEMESTERS) {
        const semKey = sem.key;
        const page = document.getElementById("page" + semKey);
        if (!page) continue;

        page.innerHTML = pageTemplate(semKey, sem.label);

        buildModulesUI(semKey);
        wireMarksPersistenceForSemester(semKey);

        document.getElementById("btnCalc" + semKey).addEventListener("click", () => computeAndRender(semKey));
        document.getElementById("btnReset" + semKey).addEventListener("click", () => resetUI(semKey));
        document.getElementById("btnExample" + semKey).addEventListener("click", () => {
            fillExample(semKey);
            computeAndRender(semKey);
        });
        document.getElementById("btnHome" + semKey).addEventListener("click", () => (location.hash = "#home"));
    }

    // Initialize the resources page
    initResourcesPage();
}

/**
 * Initializes the router.
 */
function initRouter() {
    const apply = () => setActivePage(currentRoute());
    window.addEventListener("hashchange", apply);
    apply();
}