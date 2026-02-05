
const modeBtn = document.getElementById("mode");
function applyTheme(theme) {
    document.body.classList.toggle("light", theme === "light");
    localStorage.setItem("theme", theme);
}
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light" || savedTheme === "dark") applyTheme(savedTheme);
if (modeBtn) {
    modeBtn.addEventListener("click", () => {
        const next = document.body.classList.contains("light") ? "dark" : "light";
        applyTheme(next);
    });
}

/* ---------------- PERSISTENCE ---------------- */
const STORAGEKEY = "biskrahelperstatev1";
function safeParseJSON(str, fallback = {}) {
    try {
        return JSON.parse(str);
    } catch {
        return fallback;
    }
}
function loadState() {
    const raw = localStorage.getItem(STORAGEKEY);
    return raw ? safeParseJSON(raw, {}) : {};
}
function saveState(state) {
    try {
        localStorage.setItem(STORAGEKEY, JSON.stringify(state));
    } catch (e) {
        console.warn("Could not save state to localStorage", e);
    }
}
function persistInputValue(inputEl) {
    if (!inputEl || !inputEl.id) return;
    const state = loadState();
    state.marks = state.marks || {};
    state.marks[inputEl.id] = inputEl.value; // keep as string
    saveState(state);
}
function restoreAllSavedInputs() {
    const state = loadState();
    const marks = state.marks || {};
    for (const [id, value] of Object.entries(marks)) {
        const el = document.getElementById(id);
        if (el && ("value" in el)) el.value = value;
    }
}
function clearSemesterFromStorage(semKey) {
    const state = loadState();
    const marks = state.marks || {};
    Object.keys(marks).forEach((id) => {
        if (id.startsWith(semKey)) delete marks[id];
    });
    state.marks = marks;
    saveState(state);
}
function wireMarksPersistenceForSemester(semKey) {
    const host = document.getElementById("modules" + semKey);
    if (!host) return;
    restoreAllSavedInputs();
    host.querySelectorAll('input[type="number"]').forEach((inp) => {
        inp.addEventListener("input", (e) => persistInputValue(e.target));
    });
}
function wireNotesPersistence() {
    const notesEl = document.getElementById("notes");
    if (!notesEl) return;
    const state = loadState();
    notesEl.value = state.notes || "";
    notesEl.addEventListener("input", () => {
        const s = loadState();
        s.notes = notesEl.value;
        saveState(s);
    });
}

/* ---------------- SETTINGS ---------------- */
const WEIGHTS = { CC: 0.4, EXAM: 0.6 };
const MARKSCALE = { MIN: 0, MAX: 20, PASS: 10 };

/* ---------------- MODULES DATA ---------------- */
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
        { key: "rx", name: "RX", hasTP: true, coef: 3 },
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
const SEMESTERS = [
    { key: "s1", label: "S1 average" },
    { key: "s2", label: "S2 average" },
    { key: "s3", label: "S3 average" },
    { key: "s4", label: "S4 average" },
    { key: "s5", label: "S5 average" },
    { key: "s6", label: "S6 average" },
];

/* ---------------- DOM UTILS ---------------- */
function clampMark(v) {
    if (Number.isNaN(v)) return NaN;
    if (v < MARKSCALE.MIN) return MARKSCALE.MIN;
    if (v > MARKSCALE.MAX) return MARKSCALE.MAX;
    return v;
}
function isEmptyInput(el) {
    return !el || String(el.value).trim() === "";
}
function readVal(id) {
    const el = document.getElementById(id);
    if (!el) return NaN;
    return clampMark(parseFloat(el.value));
}
function setWarn(semKey, msg) {
    const el = document.getElementById("warn" + semKey);
    if (!el) return;
    el.textContent = msg || "";
    el.classList.toggle("show", !!msg);
}

/* ---------------- UI BUILDING ---------------- */
function pageTemplate(semKey, avgLabel) {
    return `
  <div class="grid">
    <section class="card">
      <div class="hd">
        <div class="h">Marks</div>
        <div class="badge">Coefficients fixed</div>
      </div>
      <div class="bd">
        <div id="warn${semKey}" class="warn"></div>
        <div class="modules" id="modules${semKey}"></div>
        <div class="actions">
          <button id="btnCalc${semKey}">Calculate</button>
          <button id="btnExample${semKey}" class="secondary">Fill example</button>
          <button id="btnReset${semKey}" class="secondary">Reset</button>
          <button id="btnHome${semKey}" class="secondary">Home</button>
        </div>
      </div>
    </section>

    <aside class="card side">
      <div class="hd">
        <div class="h">Result</div>
        <div class="badge">Weighted average</div>
      </div>
      <div class="bd">
        <div class="stat">
          <div class="sub">${avgLabel}</div>
          <div class="big" id="avg${semKey}"></div>
          <div class="kpi">
            <span>Status</span>
            <strong id="status${semKey}" class="sub"></strong>
          </div>
          <div class="kpi">
            <span>Total coef</span>
            <strong id="sumCoef${semKey}" class="sub"></strong>
          </div>
        </div>

        <div class="stat">
          <div class="sub">Module marks</div>
          <table class="table" id="table${semKey}">
            <thead>
              <tr><th>Module</th><th>Mark</th><th>Coef</th></tr>
            </thead>
            <tbody id="tbody${semKey}"></tbody>
          </table>
        </div>
      </div>
    </aside>
  </div>
  `;
}

function inputsTemplate(semKey, m) {
    const p = `${MARKSCALE.MIN}..${MARKSCALE.MAX}`;
    if (m.single) {
        return `
      <div class="row two">
        <div>
          <label>Note</label>
          <input type="number" step="0.25" min="${MARKSCALE.MIN}" max="${MARKSCALE.MAX}" placeholder="${p}" id="${semKey}${m.key}note" />
        </div>
        <div>
          <label>-</label>
          <input type="number" disabled placeholder="-" />
        </div>
      </div>
    `;
    }
    if (m.hasTP) {
        return `
      <div class="row">
        <div>
          <label>TD</label>
          <input type="number" step="0.25" min="${MARKSCALE.MIN}" max="${MARKSCALE.MAX}" placeholder="${p}" id="${semKey}${m.key}td" />
        </div>
        <div>
          <label>TP</label>
          <input type="number" step="0.25" min="${MARKSCALE.MIN}" max="${MARKSCALE.MAX}" placeholder="${p}" id="${semKey}${m.key}tp" />
        </div>
        <div>
          <label>Exam</label>
          <input type="number" step="0.25" min="${MARKSCALE.MIN}" max="${MARKSCALE.MAX}" placeholder="${p}" id="${semKey}${m.key}ex" />
        </div>
      </div>
    `;
    }
    if (m.tpOnly) {
        return `
      <div class="row two">
        <div>
          <label>TP</label>
          <input type="number" step="0.25" min="${MARKSCALE.MIN}" max="${MARKSCALE.MAX}" placeholder="${p}" id="${semKey}${m.key}tp" />
        </div>
        <div>
          <label>Exam</label>
          <input type="number" step="0.25" min="${MARKSCALE.MIN}" max="${MARKSCALE.MAX}" placeholder="${p}" id="${semKey}${m.key}ex" />
        </div>
      </div>
    `;
    }
    return `
    <div class="row two">
      <div>
        <label>TD</label>
        <input type="number" step="0.25" min="${MARKSCALE.MIN}" max="${MARKSCALE.MAX}" placeholder="${p}" id="${semKey}${m.key}td" />
      </div>
      <div>
        <label>Exam</label>
        <input type="number" step="0.25" min="${MARKSCALE.MIN}" max="${MARKSCALE.MAX}" placeholder="${p}" id="${semKey}${m.key}ex" />
      </div>
    </div>
  `;
}

function buildModulesUI(semKey) {
    const modules = MODULES[semKey];
    const host = document.getElementById("modules" + semKey);
    if (!host) return;
    host.innerHTML = "";
    for (const m of modules) {
        const div = document.createElement("div");
        div.className = "module";
        div.innerHTML = `
      <div class="top">
        <div class="name">${m.name} ${m.optional ? `<span style="opacity:.6;font-weight:700">(choice)</span>` : ""}</div>
        <div class="coef">coef ${m.coef}</div>
      </div>
      ${inputsTemplate(semKey, m)}
    `;
        host.appendChild(div);
    }
}

/* ---------------- CALCULATION ---------------- */
function choiceSelected(semKey, m) {
    if (!m.optional) return true;
    if (m.single) return !isEmptyInput(document.getElementById(`${semKey}${m.key}note`));
    let ids = [];
    if (m.hasTP) ids = [`${semKey}${m.key}td`, `${semKey}${m.key}tp`, `${semKey}${m.key}ex`];
    else if (m.tpOnly) ids = [`${semKey}${m.key}tp`, `${semKey}${m.key}ex`];
    else ids = [`${semKey}${m.key}td`, `${semKey}${m.key}ex`];
    return ids.some((id) => !isEmptyInput(document.getElementById(id)));
}

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

/* ---------------- EXAMPLES ---------------- */
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
            set("s4rxtd", 11); set("s4rxtp", 12); set("s4rxex", 12);
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

/* ---------------- ROUTER ---------------- */
function setActivePage(key) {
    document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
    const target = document.getElementById("page" + key);
    const home = document.getElementById("pagehome");
    (target || home).classList.add("active");
    window.scrollTo(0, 0);
}
function currentRoute() {
    const key = (location.hash || "#home").replace("#", "");
    const staticPages = ["home", "calc", "pomodoro", "adkar", "quiz"];
    if (staticPages.includes(key)) return key;
    return SEMESTERS.some((s) => s.key === key) ? key : "home";
}
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
}
function initRouter() {
    const apply = () => setActivePage(currentRoute());
    window.addEventListener("hashchange", apply);
    apply();
}

/* ---------------- POMODORO Advanced ---------------- */
let pomoInterval = null;
const POMOMAXFOCUS = 5;
const pomoState = {
    phase: "focus", // focus | short | long | done
    focusDone: 0,
    remaining: 25 * 60,
    running: false,
    focusMin: 25,
    shortMin: 5,
    longMin: 15,
    autoNext: true,
    sound: true,
};

function el(id) { return document.getElementById(id); }
function formatMMSS(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}
function phaseLabel(phase) {
    if (phase === "focus") return "Focus";
    if (phase === "short") return "Short Rest";
    if (phase === "long") return "Long Rest";
    return "Done";
}
function phaseDurationSec(phase) {
    if (phase === "focus") return pomoState.focusMin * 60;
    if (phase === "short") return pomoState.shortMin * 60;
    if (phase === "long") return pomoState.longMin * 60;
    return 0;
}
function setBadge(text) {
    const b = el("pomoBadge");
    if (b) b.textContent = text;
}
function renderPomo() {
    const d = el("pomoDisplay");
    const ph = el("pomoPhase");
    const cnt = el("pomoCount");
    if (d) d.textContent = formatMMSS(pomoState.remaining);
    if (ph) ph.textContent = phaseLabel(pomoState.phase);
    if (cnt) cnt.textContent = String(pomoState.focusDone);

    const toggle = el("btnPomoToggle");
    if (toggle) toggle.textContent = pomoState.running ? "Pause" : "Start";

    setBadge(pomoState.phase === "done" ? `Finished (${POMOMAXFOCUS} focus)` : phaseLabel(pomoState.phase));
}
function stopTimer() {
    if (pomoInterval) clearInterval(pomoInterval);
    pomoInterval = null;
    pomoState.running = false;
    renderPomo();
}
function beep() {
    if (!pomoState.sound) return;
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = 880;
        g.gain.value = 0.0001;
        o.connect(g);
        g.connect(ctx.destination);
        o.start();
        g.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.30);
        o.stop(ctx.currentTime + 0.32);
        setTimeout(() => ctx.close && ctx.close(), 600);
    } catch { /* ignore */ }
}
function nextPhaseAuto() {
    beep();
    if (pomoState.phase === "focus") {
        pomoState.focusDone += 1;
        if (pomoState.focusDone >= POMOMAXFOCUS) {
            pomoState.phase = "done";
            pomoState.remaining = 0;
            stopTimer();
            renderPomo();
            return;
        }
        // long rest after 4th focus classic, otherwise short
        pomoState.phase = (pomoState.focusDone % 4 === 0) ? "long" : "short";
        pomoState.remaining = phaseDurationSec(pomoState.phase);
    } else if (pomoState.phase === "short" || pomoState.phase === "long") {
        pomoState.phase = "focus";
        pomoState.remaining = phaseDurationSec("focus");
    }
    renderPomo();
    if (pomoState.autoNext) startTimer();
    else stopTimer();
}
function tick() {
    if (pomoState.remaining > 0) {
        pomoState.remaining -= 1;
        renderPomo();
        return;
    }
    nextPhaseAuto();
}
function startTimer() {
    if (pomoState.phase === "done") return;
    if (pomoInterval) clearInterval(pomoInterval);
    pomoState.running = true;
    pomoInterval = setInterval(tick, 1000);
    renderPomo();
}
function applyPomodoroSettingsFromUI() {
    const focusSelect = el("pomoFocusSelect");
    const shortInp = el("pomoShort");
    const longInp = el("pomoLong");
    const autoChk = el("pomoAuto");
    const soundChk = el("pomoSound");

    pomoState.focusMin = focusSelect ? parseInt(focusSelect.value, 10) : 25;
    pomoState.shortMin = shortInp ? Math.max(1, parseInt(shortInp.value || "5", 10)) : 5;
    pomoState.longMin = longInp ? Math.max(1, parseInt(longInp.value || "15", 10)) : 15;
    pomoState.autoNext = !!(autoChk && autoChk.checked);
    pomoState.sound = !!(soundChk && soundChk.checked);
}
function resetPomodoro(full = true) {
    stopTimer();
    applyPomodoroSettingsFromUI();
    pomoState.phase = "focus";
    pomoState.focusDone = 0;
    pomoState.remaining = phaseDurationSec("focus");
    if (!full) return renderPomo();
    renderPomo();
}
function skipPomodoroPhase() {
    if (pomoState.phase === "done") return;
    pomoState.remaining = 0;
    renderPomo();
    nextPhaseAuto();
}
function wirePomodoro() {
    const btnToggle = el("btnPomoToggle");
    const btnReset = el("btnPomoReset");
    const btnSkip = el("btnPomoSkip");
    const btnHome = el("btnPomoHome");

    const focusSelect = el("pomoFocusSelect");
    const shortInp = el("pomoShort");
    const longInp = el("pomoLong");
    const autoChk = el("pomoAuto");
    const soundChk = el("pomoSound");

    const onSettingsChange = () => {
        applyPomodoroSettingsFromUI();
        if (!pomoState.running) {
            pomoState.phase = "focus";
            pomoState.focusDone = 0;
            pomoState.remaining = phaseDurationSec("focus");
            renderPomo();
        }
    };

    [focusSelect, shortInp, longInp, autoChk, soundChk].forEach((x) => {
        if (!x) return;
        x.addEventListener("change", onSettingsChange);
        x.addEventListener("input", onSettingsChange);
    });

    if (btnToggle) btnToggle.onclick = () => {
        if (pomoState.running) return stopTimer();
        applyPomodoroSettingsFromUI();
        if (pomoState.remaining === 0 && pomoState.phase !== "done") {
            pomoState.remaining = phaseDurationSec(pomoState.phase);
        }
        startTimer();
    };
    if (btnReset) btnReset.onclick = () => resetPomodoro(true);
    if (btnSkip) btnSkip.onclick = () => skipPomodoroPhase();
    if (btnHome) btnHome.onclick = () => (location.hash = "#home");

    resetPomodoro(true);
}

/* ---------------- ADKAR ---------------- */
window.handleDhikr = function (el) {
    const counter = el.querySelector(".counter");
    if (!counter) return;
    const val = parseInt(counter.textContent, 10);
    if (!Number.isFinite(val)) return;
    if (val > 0) counter.textContent = String(val - 1);
    if (val - 1 <= 0) el.classList.add("done");
};

/* ---------------- CS QUIZ ---------------- */
const QUIZ_QUESTIONS = [
    {
        cat: "Basics",
        q: "Which one is a real programming paradigm?",
        options: ["Object-Oriented Programming", "Circle-Oriented Programming", "Keyboard-Oriented Programming"],
        answer: 0,
        exp: "OOP is a real paradigm; the others are jokes."
    },
    {
        cat: "Data Structures",
        q: "Which structure uses LIFO (Last In, First Out)?",
        options: ["Queue", "Stack", "Binary search tree"],
        answer: 1,
        exp: "Stacks are LIFO; queues are FIFO."
    },
    {
        cat: "Algorithms",
        q: "Binary search works correctly only if the array is…",
        options: ["Sorted", "Random", "Full of duplicates"],
        answer: 0,
        exp: "Binary search relies on sorted order to discard half each step."
    },
    {
        cat: "Big-O",
        q: "Which is generally the fastest growth (worst) as n gets big?",
        options: ["O(n log n)", "O(n^2)", "O(log n)"],
        answer: 1,
        exp: "Quadratic grows faster than n log n and log n."
    },
    {
        cat: "Operating Systems",
        q: "What does a process scheduler mainly decide?",
        options: ["Which app gets the CPU next", "How many pixels are on screen", "The Wi‑Fi password"],
        answer: 0,
        exp: "Scheduling is about CPU time allocation."
    },
    {
        cat: "Networking",
        q: "HTTP is mainly used at which layer (classic TCP/IP view)?",
        options: ["Application", "Transport", "Link"],
        answer: 0,
        exp: "HTTP is an application-layer protocol."
    },
    {
        cat: "Databases",
        q: "In SQL, which keyword is used to filter rows?",
        options: ["WHERE", "FILTERNOW", "SEARCH"],
        answer: 0,
        exp: "WHERE filters rows that match a condition."
    },
    {
        cat: "Security",
        q: "Which one is a good practice for passwords?",
        options: ["Reuse the same password everywhere", "Use a password manager + unique passwords", "Save passwords in a public note"],
        answer: 1,
        exp: "Unique passwords + a manager reduces damage if one site leaks."
    },
    {
        cat: "Programming",
        q: "A compiler mainly does what?",
        options: ["Translates source code to machine/bytecode", "Cleans your keyboard", "Makes your internet faster"],
        answer: 0,
        exp: "Compilers translate code; jokes aside."
    },
    {
        cat: "Fun CS",
        q: "If you find a bug, what is the best first move?",
        options: ["Panic", "Reproduce it consistently", "Delete the whole project"],
        answer: 1,
        exp: "Reproducing makes debugging possible."
    },
    {
        cat: "Web",
        q: "CSS is mainly responsible for…",
        options: ["Styling/layout", "Database queries", "CPU scheduling"],
        answer: 0,
        exp: "CSS controls appearance; JS controls logic; DB stores data."
    },
    {
        cat: "Git",
        q: "What does 'git commit' create?",
        options: ["A snapshot in history", "A new laptop", "A virus"],
        answer: 0,
        exp: "A commit records a snapshot of tracked changes."
    },
];

function shuffleInPlace(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

const quizState = {
    order: [],
    idx: 0,
    score: 0,
    locked: false,
    total: 10,
};

function qEl(id) { return document.getElementById(id); }

function quizSetBadge(text) {
    const b = qEl("quizBadge");
    if (b) b.textContent = text;
}

function quizRender() {
    const progress = qEl("quizProgress");
    const score = qEl("quizScore");
    const cat = qEl("quizCategory");
    const q = qEl("quizQuestion");
    const optionsHost = qEl("quizOptions");
    const feedback = qEl("quizFeedback");
    const btnNext = qEl("btnQuizNext");

    if (!progress || !score || !cat || !q || !optionsHost || !feedback || !btnNext) return;

    const done = quizState.idx >= quizState.order.length;
    if (done) {
        quizSetBadge("Finished");
        progress.textContent = `${quizState.order.length}/${quizState.order.length}`;
        score.textContent = String(quizState.score);
        cat.textContent = "Results";
        q.textContent = `You scored ${quizState.score}/${quizState.order.length}.`;
        optionsHost.innerHTML = "";
        feedback.style.display = "block";
        feedback.innerHTML = `Want a rematch? Hit <strong>Restart</strong>.`;
        btnNext.disabled = true;
        return;
    }

    const current = quizState.order[quizState.idx];
    quizSetBadge("Think fast");
    progress.textContent = `${quizState.idx + 1}/${quizState.order.length}`;
    score.textContent = String(quizState.score);
    cat.textContent = current.cat;
    q.textContent = current.q;

    feedback.style.display = "none";
    feedback.innerHTML = "";
    btnNext.disabled = true;

    optionsHost.innerHTML = "";
    quizState.locked = false;

    current.options.forEach((optText, optIdx) => {
        const btn = document.createElement("button");
        btn.className = "quizOptionBtn";
        btn.type = "button";
        btn.textContent = optText;
        btn.onclick = () => quizChoose(optIdx);
        optionsHost.appendChild(btn);
    });
}

function quizChoose(chosenIdx) {
    if (quizState.locked) return;
    const current = quizState.order[quizState.idx];
    const optionsHost = qEl("quizOptions");
    const feedback = qEl("quizFeedback");
    const btnNext = qEl("btnQuizNext");
    if (!current || !optionsHost || !feedback || !btnNext) return;

    quizState.locked = true;

    const buttons = Array.from(optionsHost.querySelectorAll("button"));
    buttons.forEach((b) => (b.disabled = true));

    const correctIdx = current.answer;

    const chosenBtn = buttons[chosenIdx];
    const correctBtn = buttons[correctIdx];

    const isCorrect = chosenIdx === correctIdx;
    if (isCorrect) {
        quizState.score += 1;
        if (chosenBtn) chosenBtn.classList.add("correct");
        quizSetBadge("Nice!");
    } else {
        if (chosenBtn) chosenBtn.classList.add("wrong");
        if (correctBtn) correctBtn.classList.add("reveal");
        quizSetBadge("Oops!");
    }

    feedback.style.display = "block";
    feedback.innerHTML = isCorrect
        ? `Correct. <strong>${current.exp}</strong>`
        : `Wrong. Correct answer: <strong>${current.options[correctIdx]}</strong>. ${current.exp}`;

    btnNext.disabled = false;
    const score = qEl("quizScore");
    if (score) score.textContent = String(quizState.score);
}

function quizNext() {
    if (quizState.idx < quizState.order.length) quizState.idx += 1;
    quizRender();
}

function quizRestart() {
    const pool = [...QUIZ_QUESTIONS];
    shuffleInPlace(pool);

    quizState.total = Math.min(10, pool.length);
    quizState.order = pool.slice(0, quizState.total);
    quizState.idx = 0;
    quizState.score = 0;
    quizState.locked = false;

    quizSetBadge("Warm up");
    quizRender();
}

function wireQuiz() {
    const btnNext = qEl("btnQuizNext");
    const btnRestart = qEl("btnQuizRestart");
    const btnHome = qEl("btnQuizHome");

    if (btnNext) btnNext.onclick = quizNext;
    if (btnRestart) btnRestart.onclick = quizRestart;
    if (btnHome) btnHome.onclick = () => (location.hash = "#home");

    quizRestart();
}

/* ---------------- BOOT ---------------- */
initPages();
initRouter();
wireNotesPersistence();
wirePomodoro();
wireQuiz();
