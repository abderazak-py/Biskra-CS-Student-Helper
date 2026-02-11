// ===================== RESOURCES PAGE =====================

// Define resource links configuration for each module
// TODO: Update titles and URLs with actual names from your Google Drive
const RESOURCE_LINKS = {
    os: {
        cours: [
            { title: "Cours 1", url: "https://drive.google.com/file/d/1k7Oq70Hd9Wmd-O9_Jm-PLR1Mli5EVb8u/view?usp=drive_link" },
            { title: "Cours 2", url: "#" },
            { title: "Cours 3", url: "#" },
            { title: "Cours 4", url: "#" }
        ],
        td: [
            { title: "TD 1", url: "#" },
            { title: "TD 2", url: "#" },
            { title: "TD 3", url: "#" },
            { title: "TD 4", url: "#" }
        ],
        tp: [
            { title: "TP 1", url: "#" },
            { title: "TP 2", url: "#" },
            { title: "TP 3", url: "#" },
            { title: "TP 4", url: "#" }
        ]
    },
    tl: {
        cours: [
            { title: "Cours 1", url: "#" },
            { title: "Cours 2", url: "#" },
            { title: "Cours 3", url: "#" }
        ],
        td: [
            { title: "TD 1", url: "#" },
            { title: "TD 2", url: "#" },
            { title: "TD 3", url: "#" }
        ],
        tp: [] // Add TP files if they exist in your drive
    },
    rx: {
        cours: [
            { title: "Cours 1", url: "#" },
            { title: "Cours 2", url: "#" },
            { title: "Cours 3", url: "#" },
            { title: "Cours 4", url: "#" }
        ],
        td: [
            { title: "TD 1", url: "#" },
            { title: "TD 2", url: "#" },
            { title: "TD 3", url: "#" }
        ],
        tp: [
            { title: "TP 1", url: "#" },
            { title: "TP 2", url: "#" },
            { title: "TP 3", url: "#" }
        ]
    },
    bd: {
        cours: [
            { title: "Cours 1", url: "#" },
            { title: "Cours 2", url: "#" },
            { title: "Cours 3", url: "#" },
            { title: "Cours 4", url: "#" }
        ],
        td: [
            { title: "TD 1", url: "#" },
            { title: "TD 2", url: "#" },
            { title: "TD 3", url: "#" }
        ],
        tp: [
            { title: "TP 1", url: "#" },
            { title: "TP 2", url: "#" },
            { title: "TP 3", url: "#" },
            { title: "TP 4", url: "#" }
        ]
    },
    poo: {
        cours: [
            { title: "Cours 1", url: "#" },
            { title: "Cours 2", url: "#" },
            { title: "Cours 3", url: "#" }
        ],
        td: [], // Add TD files if they exist in your drive
        tp: [
            { title: "TP 1", url: "#" },
            { title: "TP 2", url: "#" },
            { title: "TP 3", url: "#" },
            { title: "TP 4", url: "#" }
        ]
    },
    web: {
        cours: [], // Add Cours files if they exist in your drive
        td: [], // Add TD files if they exist in your drive
        tp: [
            { title: "TP 1", url: "#" },
            { title: "TP 2", url: "#" },
            { title: "TP 3", url: "#" },
            { title: "TP 4", url: "#" }
        ]
    },
    eng: {
        cours: [
            { title: "Cours 1", url: "#" },
            { title: "Cours 2", url: "#" },
            { title: "Cours 3", url: "#" }
        ],
        td: [], // Add TD files if they exist in your drive
        tp: [] // Add TP files if they exist in your drive
    }
};

/**
 * Initializes the resources page with S4 modules
 */
function initResourcesPage() {
    const moduleList = document.querySelector('.module-list');

    if (!moduleList) return;

    // Get S4 modules from the existing MODULES object
    const s4Modules = MODULES.s4;

    // Clear any existing content
    moduleList.innerHTML = '';

    // Create module cards for each S4 module
    s4Modules.forEach(module => {
        const moduleCard = document.createElement('div');
        moduleCard.className = 'module-card';

        // Generate HTML for each resource section based on the configuration
        const coursSection = generateResourceSection(module.key, 'Cours', 'cours', module);
        const tdSection = generateResourceSection(module.key, 'TD (Travaux Dirigés)', 'td', module);
        const tpSection = generateResourceSection(module.key, 'TP (Travaux Pratiques)', 'tp', module);

        moduleCard.innerHTML = `
            <button class="module-header">
                <span>${module.name}</span>
                <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>
            <div class="module-content">
                ${coursSection}
                ${tdSection}
                ${tpSection}
            </div>
        `;

        moduleList.appendChild(moduleCard);
    });

    // Add event listeners to the accordion headers
    setupAccordionEvents();
}

/**
 * Generates HTML for a resource section (Cours/TD/TP)
 */
function generateResourceSection(moduleKey, sectionTitle, sectionType, module) {
    // Check if the module has this type of resource (hasTP, tpOnly, etc.)
    if (sectionType === 'tp' && module.tpOnly && !module.hasTP) {
        // For tpOnly modules, we still show the TP section
    } else if (sectionType === 'td' && module.tpOnly) {
        // Don't show TD section for tpOnly modules
        if (module.key !== 'eng') {  // Special case: English doesn't have TD/TP
            return '';
        }
    }

    const resources = RESOURCE_LINKS[moduleKey] && RESOURCE_LINKS[moduleKey][sectionType]
        ? RESOURCE_LINKS[moduleKey][sectionType]
        : [];

    if (resources.length === 0 && !(module.key === 'eng' && (sectionType === 'td' || sectionType === 'tp'))) {
        // Don't show empty sections except for English which might have empty sections
        if (resources.length === 0) {
            return '';
        }
    }

    const linksHtml = resources.map((resource, index) =>
        `<a href="${resource.url}" class="resource-link" target="_blank">${resource.title}</a>`
    ).join('');

    return `
        <div class="resource-section">
            <button class="resource-header">
                <span>${sectionTitle}</span>
                <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>
            <div class="resource-links">
                ${linksHtml}
                ${resources.length === 0 ? '<div class="no-resources">Aucun lien disponible pour le moment</div>' : ''}
            </div>
        </div>
    `;
}

/**
 * Sets up the accordion events for modules
 */
function setupAccordionEvents() {
    const moduleHeaders = document.querySelectorAll('.module-header');
    const semesterHeader = document.querySelector('.accordion-header');
    const resourceHeaders = document.querySelectorAll('.resource-header');

    // Toggle individual module accordions
    moduleHeaders.forEach(header => {
        header.addEventListener('click', function () {
            const content = this.nextElementSibling;
            const arrow = this.querySelector('.arrow');

            content.classList.toggle('active');
            arrow.classList.toggle('rotate');
        });
    });

    // Toggle semester accordion
    semesterHeader.addEventListener('click', function () {
        const content = this.nextElementSibling;
        const arrow = this.querySelector('.arrow');

        content.classList.toggle('active');
        arrow.classList.toggle('rotate');
    });

    // Toggle individual resource accordions (Cours/TD/TP)
    resourceHeaders.forEach(header => {
        header.addEventListener('click', function () {
            const content = this.nextElementSibling;
            const arrow = this.querySelector('.arrow');

            content.classList.toggle('active');
            arrow.classList.toggle('rotate');
        });
    });
}