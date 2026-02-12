// ===================== SETTINGS =====================
/**
 * @typedef {object} MarkScale
 * @property {number} MIN - The minimum possible mark.
 * @property {number} MAX - The maximum possible mark.
 * @property {number} PASS - The minimum mark to pass.
 */

/** @type {MarkScale} */
const MARKSCALE = { MIN: 0, MAX: 20, PASS: 10 };

/**
 * @typedef {object} Weights
 * @property {number} CC - The weight of the continuous assessment.
 * @property {number} EXAM - The weight of the exam.
 */

/** @type {Weights} */
const WEIGHTS = { CC: 0.4, EXAM: 0.6 };

// ===================== CALCULATION =====================

/**
 * Checks if a module has been selected by the user.
 * @param {string} semKey - The key of the semester (e.g., "s1").
 * @param {object} m - The module object.
 * @returns {boolean} - True if the module is selected, false otherwise.
 */
function choiceSelected(semKey, m) {
    if (!m.optional) return true;
    if (m.single) return !isEmptyInput(document.getElementById(`${semKey}${m.key}note`));

    let ids = [];
    if (m.hasTP) ids = [`${semKey}${m.key}td`, `${semKey}${m.key}tp`, `${semKey}${m.key}ex`];
    else if (m.tpOnly) ids = [`${semKey}${m.key}tp`, `${semKey}${m.key}ex`];
    else ids = [`${semKey}${m.key}td`, `${semKey}${m.key}ex`];

    return ids.some((id) => !isEmptyInput(document.getElementById(id)));
}

/**
 * Calculates the mark for a given module.
 * @param {string} semKey - The key of the semester (e.g., "s1").
 * @param {object} m - The module object.
 * @returns {number} - The calculated mark for the module, or NaN if the inputs are invalid.
 */
function moduleMark(semKey, m) {
    if (m.single) return readVal(`${semKey}${m.key}note`);

    const ex = readVal(`${semKey}${m.key}ex`);

    if (m.hasTP) {
        const td = readVal(`${semKey}${m.key}td`);
        const tp = readVal(`${semKey}${m.key}tp`);
        if ([td, tp, ex].some(Number.isNaN)) return NaN;
        return WEIGHTS.CC * ((td + tp) / 2) + WEIGHTS.EXAM * ex;
    }

    if (m.tpOnly) {
        const tp = readVal(`${semKey}${m.key}tp`);
        if ([tp, ex].some(Number.isNaN)) return NaN;
        return WEIGHTS.CC * tp + WEIGHTS.EXAM * ex;
    }

    const td = readVal(`${semKey}${m.key}td`);
    if ([td, ex].some(Number.isNaN)) return NaN;
    return WEIGHTS.CC * td + WEIGHTS.EXAM * ex;
}

/**
 * Resets the UI for a given semester.
 * @param {string} semKey - The key of the semester to reset (e.g., "s1").
 */
function resetUI(semKey) {
    const modules = MODULES[semKey];

    for (const m of modules) {
        const ids = [];
        if (m.single) ids.push(`${semKey}${m.key}note`);
        else if (m.hasTP) ids.push(`${semKey}${m.key}td`, `${semKey}${m.key}tp`, `${semKey}${m.key}ex`);
        else if (m.tpOnly) ids.push(`${semKey}${m.key}tp`, `${semKey}${m.key}ex`);
        else ids.push(`${semKey}${m.key}td`, `${semKey}${m.key}ex`);

        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.value = "";
        });
    }

    clearSemesterFromStorage(semKey);

    const avgEl = document.getElementById("avg" + semKey);
    if (avgEl) avgEl.textContent = "";

    const st = document.getElementById("status" + semKey);
    if (st) {
        st.textContent = "";
        st.className = "sub";
    }

    const sumCoefEl = document.getElementById("sumCoef" + semKey);
    if (sumCoefEl) sumCoefEl.textContent = "";

    const tbody = document.getElementById("tbody" + semKey);
    if (tbody) tbody.innerHTML = "";

    setWarn(semKey, "");
}

/**
 * Computes the average mark for a semester and renders the results.
 * @param {string} semKey - The key of the semester to compute and render (e.g., "s1").
 */
function computeAndRender(semKey) {
    setWarn(semKey, "");
    const modules = MODULES[semKey];

    let sumCoef = 0;
    let sum = 0;
    const rows = [];

    for (const m of modules) {
        if (m.optional && !choiceSelected(semKey, m)) continue;

        const mark = moduleMark(semKey, m);
        if (Number.isNaN(mark)) {
            setWarn(semKey, `Fill all required fields using numbers between ${MARKSCALE.MIN} and ${MARKSCALE.MAX}.`);
            return;
        }

        sumCoef += m.coef;
        sum += mark * m.coef;

        rows.push({
            name: m.name + (m.optional ? " (choice)" : ""),
            mark,
            coef: m.coef,
        });
    }

    if (sumCoef === 0) {
        setWarn(semKey, "No modules selected.");
        return;
    }

    const avg = sum / sumCoef;

    const avgEl = document.getElementById("avg" + semKey);
    if (avgEl) avgEl.textContent = avg.toFixed(2);

    const st = document.getElementById("status" + semKey);
    const pass = avg >= MARKSCALE.PASS;
    if (st) {
        st.textContent = pass ? "PASS" : "FAIL";
        st.className = pass ? "pass" : "fail";
    }

    const sumCoefEl = document.getElementById("sumCoef" + semKey);
    if (sumCoefEl) sumCoefEl.textContent = String(sumCoef);

    const tbody = document.getElementById("tbody" + semKey);
    if (tbody) {
        tbody.innerHTML = rows
            .map((r) => `<tr><td>${r.name}</td><td>${r.mark.toFixed(2)}</td><td>${r.coef}</td></tr>`)
            .join("");
    }
}

// ===================== EXAMPLES =====================
/**
 * Fills the form with example data for a given semester.
 * @param {string} semKey - The key of the semester to fill with example data (e.g., "s1").
 */
function fillExample(semKey) {
    const set = (id, v) => {
        const el = document.getElementById(id);
        if (el) {
            el.value = v;
            persistInputValue(el);
        }
    };

    switch (semKey) {
        case "s1":
            set("s1an1td", 12); set("s1an1ex", 11);
            set("s1alg1td", 13); set("s1alg1ex", 12);
            set("s1asd1td", 13); set("s1asd1tp", 14); set("s1asd1ex", 12);
            set("s1ms1td", 12); set("s1ms1ex", 10);
            set("s1stenote", 15);
            set("s1engnote", 16);
            set("s1phy1td", 12); set("s1phy1ex", 10);
            set("s1electd", 11); set("s1elecex", 12);
            return;

        case "s2":
            set("s2an2td", 11); set("s2an2ex", 12);
            set("s2alg2td", 12); set("s2alg2ex", 11);
            set("s2asd2td", 12); set("s2asd2tp", 13); set("s2asd2ex", 11);
            set("s2ms2td", 10); set("s2ms2ex", 11);
            set("s2probatd", 12); set("s2probaex", 10);
            set("s2ictnote", 16);
            set("s2ptmtp", 13); set("s2ptmex", 12);
            set("s2phy2td", 11); set("s2phy2ex", 10);
            return;

        case "s3":
            set("s3algotd", 12); set("s3algotp", 13); set("s3algoex", 11);
            set("s3architd", 11); set("s3architp", 12); set("s3archiex", 12);
            set("s3tgtd", 10); set("s3tgex", 10);
            set("s3sitd", 14); set("s3siex", 10);
            set("s3mntd", 15); set("s3mnex", 12);
            set("s3lmtd", 13); set("s3lmex", 9);
            set("s3engnote", 16);
            return;

        case "s4":
            set("s4ostd", 12); set("s4ostp", 12); set("s4osex", 11);
            set("s4tltd", 13); set("s4tlex", 10);
            set("s4rctd", 11); set("s4rctp", 12); set("s4rcex", 12);
            set("s4bdtd", 14); set("s4bdtp", 15); set("s4bdex", 11);
            set("s4pootp", 13); set("s4pooex", 10);
            set("s4webtp", 14); set("s4webex", 12);
            set("s4engnote", 17);
            return;

        case "s5":
            set("s5os2td", 12); set("s5os2tp", 12); set("s5os2ex", 11);
            set("s5compiltd", 11); set("s5compiltp", 12); set("s5compilex", 10);
            set("s5logptd", 13); set("s5logpex", 11);
            set("s5gl2td", 12); set("s5gl2tp", 13); set("s5gl2ex", 11);
            set("s5mhitd", 14); set("s5mhitp", 14); set("s5mhiex", 12);
            set("s5aitd", 14); set("s5aiex", 12);
            set("s5pltd", 12); set("s5plex", 11);
            set("s5engtd", 16); set("s5engex", 14);
            return;

        case "s6":
            set("s6mobtd", 13); set("s6mobtp", 14); set("s6mobex", 12);
            set("s6sectd", 12); set("s6secex", 11);
            set("s6cryptotd", 12); set("s6cryptoex", 10);
            set("s6wstd", 13); set("s6wsex", 12);
            set("s6swtd", 14); set("s6swex", 13);
            set("s6projnote", 16);
            return;

        default:
            return;
    }
}
