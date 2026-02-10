// ===================== THEME =====================

/**
 * The button that toggles the color scheme.
 * @type {HTMLElement|null}
 */
const modeBtn = document.getElementById("mode");

/**
 * The button that opens the theme palette selection popup.
 * @type {HTMLElement|null}
 */
const themeBtn = document.getElementById("themeBtn");

/**
 * The theme selection popup.
 * @type {HTMLElement|null}
 */
const themePopup = document.getElementById("themePopup");

/**
 * The button that closes the theme selection popup.
 * @type {HTMLElement|null}
 */
const closeThemePopupBtn = document.getElementById("closeThemePopup");

/**
 * The overlay behind the theme selection popup.
 * @type {HTMLElement|null}
 */
const themeOverlay = document.getElementById("themeOverlay");

/**
 * NodeList of all theme option buttons.
 * @type {NodeListOf<HTMLElement>|null}
 */
const themeOptions = document.querySelectorAll(".themeOption");

/**
 * Applies a color scheme to the document.
 * @param {string} scheme - The color scheme to apply ("light" or "dark").
 */
function applyColorScheme(scheme) {
    document.body.classList.toggle("light", scheme === "light");
    localStorage.setItem("colorScheme", scheme);
}

/**
 * Applies a theme palette to the document.
 * @param {string} palette - The theme palette to apply (e.g., "classic", "orange").
 */
function applyThemePalette(palette) {
    const themes = ["classic", "orange", "red", "pink"];
    // More robustly remove all theme classes
    themes.forEach(t => document.body.classList.remove(`theme-${t}`));

    if (palette !== "classic") {
        document.body.classList.add(`theme-${palette}`);
    }
    localStorage.setItem("themePalette", palette);
    
    // Update active class on buttons
    themeOptions.forEach(opt => {
        opt.classList.toggle("active", opt.dataset.theme === palette);
    });
}

/**
 * Shows or hides the theme selection popup.
 * @param {boolean} show - Whether to show or hide the popup.
 */
function toggleThemePopup(show) {
    if (themePopup && themeOverlay) {
        themePopup.style.display = show ? "block" : "none";
        themeOverlay.style.display = show ? "block" : "none";
    }
}

// Apply saved settings on load
const savedColorScheme = localStorage.getItem("colorScheme");
if (savedColorScheme === "light" || savedColorScheme === "dark") {
    applyColorScheme(savedColorScheme);
}

const savedThemePalette = localStorage.getItem("themePalette") || "classic";
applyThemePalette(savedThemePalette);

// Add click listener to the color scheme toggle button.
if (modeBtn) {
    modeBtn.addEventListener("click", () => {
        const next = document.body.classList.contains("light") ? "dark" : "light";
        applyColorScheme(next);
    });
}

// Add click listeners for the theme palette selection popup.
if (themeBtn) {
    themeBtn.addEventListener("click", () => toggleThemePopup(true));
}
if (closeThemePopupBtn) {
    closeThemePopupBtn.addEventListener("click", () => toggleThemePopup(false));
}
if (themeOverlay) {
    themeOverlay.addEventListener("click", () => toggleThemePopup(false));
}

themeOptions.forEach(option => {
    option.addEventListener("click", () => {
        const selectedPalette = option.dataset.theme;
        applyThemePalette(selectedPalette);
        // Optional: close popup after selection
        // toggleThemePopup(false);
    });
});
