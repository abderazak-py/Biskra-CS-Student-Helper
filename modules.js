// ===================== MODULES DATA =====================

/**
 * @typedef {object} Module
 * @property {string} key - A unique key for the module.
 * @property {string} name - The name of the module.
 * @property {number} coef - The coefficient of the module.
 * @property {boolean} [hasTP] - Whether the module has a practical work (TP) component.
 * @property {boolean} [tpOnly] - Whether the module only has a practical work (TP) component.
 * @property {boolean} [single] - Whether the module has a single mark.
 * @property {boolean} [optional] - Whether the module is optional.
 */

/**
 * @type {Object.<string, Module[]>}
 */
const MODULES = {
    s1: [
        { key: "an1", name: "Analysis 1", coef: 4 },
        { key: "alg1", name: "Algebra 1", coef: 3 },
        { key: "asd1", name: "ASD 1", hasTP: true, coef: 4 },
        { key: "ms1", name: "MS 1", coef: 3 },
        { key: "ste", name: "STE", single: true, coef: 1 },
        { key: "eng", name: "English", single: true, coef: 1 },
        { key: "phy1", name: "Physics 1", coef: 2, optional: true },
        { key: "elec", name: "Electronics", coef: 2, optional: true },
    ],
    s2: [
        { key: "an2", name: "Analysis 2", coef: 4 },
        { key: "alg2", name: "Algebra 2", coef: 2 },
        { key: "asd2", name: "ASD 2", hasTP: true, coef: 4 },
        { key: "ms2", name: "MS 2", coef: 2 },
        { key: "proba", name: "ProbaStats", coef: 2 },
        { key: "ict", name: "ICT", single: true, coef: 1 },
        { key: "ptm", name: "PTM", tpOnly: true, coef: 1 },
        { key: "phy2", name: "Physics 2", coef: 2 },
    ],
    s3: [
        { key: "algo", name: "Algo", hasTP: true, coef: 3 },
        { key: "archi", name: "Archi", hasTP: true, coef: 3 },
        { key: "tg", name: "TG", coef: 2 },
        { key: "si", name: "SI", coef: 3 },
        { key: "eng", name: "English", single: true, coef: 1 },
        { key: "mn", name: "MN", coef: 2 },
        { key: "lm", name: "LM", coef: 2 },
    ],
    s4: [
        { key: "os", name: "OS", hasTP: true, coef: 3 },
        { key: "tl", name: "TL", coef: 2 },
        { key: "rc", name: "RC", hasTP: true, coef: 3 },
        { key: "bd", name: "BD", hasTP: true, coef: 3 },
        { key: "eng", name: "English", single: true, coef: 1 },
        { key: "poo", name: "POO", tpOnly: true, coef: 2 },
        { key: "web", name: "Web", tpOnly: true, coef: 2 },
    ],
    s5: [
        { key: "os2", name: "OS 2", hasTP: true, coef: 2 },
        { key: "compil", name: "Compilation", hasTP: true, coef: 2 },
        { key: "logp", name: "Logic Prog", coef: 2 },
        { key: "gl2", name: "SE 2", hasTP: true, coef: 2 },
        { key: "mhi", name: "MHI", hasTP: true, coef: 2 },
        { key: "ps", name: "ProbStats", coef: 2, optional: true },
        { key: "pl", name: "Linear Prog", coef: 2, optional: true },
        { key: "pp", name: "Paradigms", coef: 2, optional: true },
        { key: "ai", name: "AI", coef: 2, optional: true },
        { key: "eng", name: "English", coef: 1 },
    ],
    s6: [
        { key: "mob", name: "Mobile", hasTP: true, coef: 3 },
        { key: "sec", name: "Security", coef: 3 },
        { key: "adb", name: "Admin BD", coef: 2, optional: true },
        { key: "info", name: "Infographics", coef: 2, optional: true },
        { key: "ws", name: "Web Sem", coef: 2, optional: true },
        { key: "crypto", name: "Crypto", coef: 2, optional: true },
        { key: "sw", name: "Sci Writing", coef: 1, optional: true },
        { key: "proj", name: "Project", single: true, coef: 4 },
    ],
};

/**
 * @typedef {object} Semester
 * @property {string} key - The key of the semester.
 * @property {string} label - The label of the semester.
 */

/**
 * @type {Semester[]}
 */
const SEMESTERS = [
    { key: "s1", label: "S1 average" },
    { key: "s2", label: "S2 average" },
    { key: "s3", label: "S3 average" },
    { key: "s4", label: "S4 average" },
    { key: "s5", label: "S5 average" },
    { key: "s6", label: "S6 average" },
];
