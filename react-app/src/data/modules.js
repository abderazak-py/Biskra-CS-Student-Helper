// Module data for semester calculators

export const MODULES = {
    // LMD (Licence) Pathway
    s1: [
        { key: "an1", name: "Analyse 1", coef: 4, unit: "UEF1" },
        { key: "alg1", name: "Algèbre 1", coef: 3, unit: "UEF1" },
        { key: "asd1", name: "Algorithmique et structures de données 1", hasTP: true, coef: 4, unit: "UEF2" },
        { key: "ms1", name: "Architecture de la machine 1 (Structure machine)", coef: 3, unit: "UEF2" },
        { key: "ste", name: "Science, Technologie et Environnement", single: true, coef: 1, unit: "UED" },
        { key: "eng", name: "Anglais 1", single: true, coef: 1, unit: "UET" },
        { key: "phy1", name: "Physique 1", coef: 2, optional: true, unit: "UEM" },
        { key: "elec", name: "Électronique", coef: 2, optional: true, unit: "UEM" },
    ],
    s2: [
        { key: "an2", name: "Analyse 2", coef: 4, unit: "UEF1" },
        { key: "alg2", name: "Algèbre 2", coef: 2, unit: "UEF1" },
        { key: "asd2", name: "Algorithmique et structures de données 2", hasTP: true, coef: 4, unit: "UEF2" },
        { key: "ms2", name: "Architecture de la machine 2 (Structure machine)", coef: 2, unit: "UEF2" },
        { key: "proba", name: "Probabilités et statistique 1", coef: 2, unit: "UEM" },
        { key: "ict", name: "Technologies de l'information et de la communication", single: true, coef: 1, unit: "UET" },
        { key: "ptm", name: "Pratique des technologies multimédias", tpOnly: true, coef: 1, unit: "UEM" },
        { key: "phy2", name: "Physique 2", coef: 2, unit: "UEM" },
    ],
    s3: [
        { key: "algo", name: "Algorithmique", hasTP: true, coef: 3, credit: 6, unit: "UEF1" },
        { key: "archi", name: "Architecture des ordinateurs", hasTP: true, coef: 3, credit: 5, unit: "UEF1" },
        { key: "tg", name: "Théorie des graphes", coef: 2, credit: 4, unit: "UEF2" },
        { key: "si", name: "Systèmes d'information", coef: 3, credit: 5, unit: "UEF2" },
        { key: "eng", name: "Anglais 3", single: true, coef: 1, credit: 2, unit: "UET" },
        { key: "mn", name: "Méthodes numériques", coef: 2, credit: 4, unit: "UEM" },
        { key: "lm", name: "Logique mathématique", coef: 2, credit: 4, unit: "UEM" },
    ],
    s4: [
        { key: "os", name: "Systèmes d'exploitation 1", hasTP: true, coef: 3, credit: 5, unit: "UEF1" },
        { key: "tl", name: "Théorie des langages", hasTP: true, coef: 2, credit: 4, unit: "UEF2" },
        { key: "rc", name: "Réseaux de communication", hasTP: true, coef: 3, credit: 6, unit: "UEF1" },
        { key: "bd", name: "Bases de données", hasTP: true, coef: 3, credit: 5, unit: "UEF2" },
        { key: "eng", name: "Anglais 4", single: true, coef: 1, credit: 2, unit: "UET" },
        { key: "poo", name: "Programmation orientée objet", tpOnly: true, coef: 2, credit: 4, unit: "UEM" },
        { key: "web", name: "Développement web", tpOnly: true, coef: 2, credit: 4, unit: "UEM" },
    ],
    s5: [
        { key: "os2", name: "Systèmes d'exploitation 2", hasTP: true, coef: 2, unit: "UEF1" },
        { key: "compil", name: "Compilation", hasTP: true, coef: 2, unit: "UEF1" },
        { key: "logp", name: "Programmation logique", coef: 2, unit: "UEF2" },
        { key: "gl2", name: "Génie logiciel 2", hasTP: true, coef: 2, unit: "UEF2" },
        { key: "mhi", name: "Interaction homme-machine (IHM)", hasTP: true, coef: 2, unit: "UEF2" },
        { key: "ps", name: "Probabilités et statistique", coef: 2, optional: true, unit: "UEM" },
        { key: "pl", name: "Programmation linéaire", coef: 2, optional: true, unit: "UEM" },
        { key: "pp", name: "Paradigmes de programmation", coef: 2, optional: true, unit: "UEM" },
        { key: "ai", name: "Intelligence artificielle", coef: 2, optional: true, unit: "UEM" },
        { key: "eng", name: "Anglais 5", coef: 1, unit: "UET" },
    ],
    s6: [
        { key: "mob", name: "Développement d'applications mobiles", hasTP: true, coef: 3, unit: "UEF1" },
        { key: "sec", name: "Sécurité informatique", coef: 3, unit: "UEF1" },
        { key: "adb", name: "Administration des bases de données", coef: 2, optional: true, unit: "UEF2" },
        { key: "info", name: "Infographie", coef: 2, optional: true, unit: "UEF2" },
        { key: "ws", name: "Web sémantique", coef: 2, optional: true, unit: "UEF2" },
        { key: "crypto", name: "Cryptographie", coef: 2, optional: true, unit: "UEF2" },
        { key: "sw", name: "Rédaction scientifique", coef: 1, optional: true, unit: "UET" },
        { key: "proj", name: "Projet de fin d'études", single: true, coef: 4, unit: "UEM" },
    ],

    // State Engineer Pathway
    eng_s1: [
        { key: "eng_bur", name: "Techniques de l'écriture et bureautique", coef: 1, credit: 2, unit: "C00D0001S1", single: true },
        { key: "eng_an1", name: "Analyse mathématique 1", coef: 3, credit: 3, unit: "C00F0001S1_1" },
        { key: "eng_alg1", name: "Algèbre 1", coef: 3, credit: 3, unit: "C00F0001S1_1" },
        { key: "eng_elec", name: "Bases de l'électronique", coef: 1, credit: 3, unit: "C00M0001S1" },
        { key: "eng_os1", name: "Introduction aux systèmes d'exploitation 1", coef: 3, credit: 4, unit: "C00F0001S1_2", hasTP: true },
        { key: "eng_archi", name: "Architecture de la machine", coef: 4, credit: 6, unit: "C00F0001S1_2", hasTP: true },
        { key: "eng_asd1", name: "Algorithmique et structures de données 1", coef: 5, credit: 6, unit: "C00F0001S1_2", hasTP: true },
        { key: "eng_expr1", name: "Techniques d'expression orale", coef: 1, credit: 2, unit: "C00T0001S1", single: true },
    ],
    eng_s2: [
        { key: "eng_proba", name: "Probabilités et statistique 1", coef: 2, credit: 4, unit: "C00M0001S2" },
        { key: "eng_log", name: "Logique mathématique", coef: 3, credit: 3, unit: "C00F0001S2_1" },
        { key: "eng_alg2", name: "Algèbre 2", coef: 3, credit: 3, unit: "C00F0001S2_1" },
        { key: "eng_an2", name: "Analyse mathématique 2", coef: 3, credit: 6, unit: "C00F0001S2_2" },
        { key: "eng_archi2", name: "Architectures des ordinateurs", coef: 4, credit: 6, unit: "C00F0001S2_2", hasTP: true },
        { key: "eng_asd2", name: "Algorithmique et structure de données 2", coef: 4, credit: 6, unit: "C00F0001S2_2", hasTP: true },
        { key: "eng_expr2", name: "Techniques d'expression orale", coef: 1, credit: 2, unit: "C00T0001S2", single: true },
    ],
    eng_s3: [
        { key: "eng_poo1", name: "Programmation orientée objet 1", coef: 4, credit: 6, unit: "C00F0001S3_1", hasTP: true },
        { key: "eng_asd3", name: "Algorithmique et structure de données", coef: 4, credit: 6, unit: "C00F0001S3_1", hasTP: true },
        { key: "eng_isi", name: "Introduction aux systèmes d'information", coef: 3, credit: 3, unit: "C00F0001S3_1" },
        { key: "eng_alg3", name: "Algèbre 3", coef: 3, credit: 3, unit: "C00F0001S3_2" },
        { key: "eng_an3", name: "Analyse mathématique 3", coef: 3, credit: 6, unit: "C00F0001S3_2" },
        { key: "eng_ps2", name: "Probabilités et statistique 2", coef: 2, credit: 4, unit: "C00M0001S3" },
        { key: "eng_ent", name: "Entrepreneuriat", coef: 1, credit: 2, unit: "C00T0001S3", single: true },
    ],
    eng_s4: [
        { key: "eng_tl", name: "Théorie des langages", coef: 3, credit: 4, unit: "C00F0001S4_1", hasTP: true },
        { key: "eng_net", name: "Introduction aux réseaux", coef: 3, credit: 5, unit: "C00F0001S4_1", hasTP: true },
        { key: "eng_tg", name: "Théorie des graphes", coef: 2, credit: 3, unit: "C00F0001S4_1" },
        { key: "eng_db", name: "Introduction aux bases de données", coef: 3, credit: 4, unit: "C00F0001S4_2", hasTP: true },
        { key: "eng_os2", name: "Introduction aux systèmes d'exploitation", coef: 4, credit: 6, unit: "C00F0001S4_2", hasTP: true },
        { key: "eng_poo2", name: "Programmation orientée objet 2", coef: 4, credit: 6, unit: "C00F0001S4_2", hasTP: true },
        { key: "eng_deont", name: "Déontologie de l'informatique", coef: 1, credit: 2, unit: "C00T0001S4", single: true },
    ]
};

export const SEMESTERS = [
    // LMD Semesters
    { key: "s1", label: "Semester 1", description: "First-year baseline", system: "lmd" },
    { key: "s2", label: "Semester 2", description: "Foundations", system: "lmd" },
    { key: "s3", label: "Semester 3", description: "Core CS modules", system: "lmd" },
    { key: "s4", label: "Semester 4", description: "Momentum", system: "lmd" },
    { key: "s5", label: "Semester 5", description: "Choices included", system: "lmd" },
    { key: "s6", label: "Semester 6", description: "Final stretch", system: "lmd" },

    // State Engineer Semesters
    { key: "eng_s1", label: "Semester 1", description: "First-year baseline", system: "eng" },
    { key: "eng_s2", label: "Semester 2", description: "Foundations", system: "eng" },
    { key: "eng_s3", label: "Semester 3", description: "Core CS modules", system: "eng" },
    { key: "eng_s4", label: "Semester 4", description: "Momentum", system: "eng" },
];