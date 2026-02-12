// ===================== POMODORO =====================

/**
 * The interval ID for the Pomodoro timer.
 * @type {number|null}
 */
let pomoInterval = null;

/**
 * The maximum number of focus sessions before the Pomodoro is considered done.
 * @type {number}
 */
const POMOMAXFOCUS = 5;

/**
 * The state of the Pomodoro timer.
 * @type {object}
 * @property {string} phase - The current phase of the timer (focus | short | long | done).
 * @property {number} focusDone - The number of focus sessions completed.
 * @property {number} remaining - The remaining time in seconds.
 * @property {boolean} running - Whether the timer is running.
 * @property {number} focusMin - The duration of a focus session in minutes.
 * @property {number} shortMin - The duration of a short break in minutes.
 * @property {number} longMin - The duration of a long break in minutes.
 * @property {boolean} autoNext - Whether to automatically start the next phase.
 * @property {boolean} sound - Whether to play a sound at the end of a phase.
 */
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

/**
 * A shorthand for document.getElementById.
 * @param {string} id - The ID of the element to get.
 * @returns {HTMLElement|null} The element or null if not found.
 */
function el(id) {
    return document.getElementById(id);
}

/**
 * Formats a number of seconds into MM:SS format.
 * @param {number} sec - The number of seconds.
 * @returns {string} The formatted time.
 */
function formatMMSS(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

/**
 * Gets the label for a given phase.
 * @param {string} phase - The phase to get the label for.
 * @returns {string} The label for the phase.
 */
function phaseLabel(phase) {
    if (phase === "focus") return "Focus";
    if (phase === "short") return "Short Rest";
    if (phase === "long") return "Long Rest";
    return "Done";
}

/**
 * Gets the duration of a phase in seconds.
 * @param {string} phase - The phase to get the duration for.
 * @returns {number} The duration of the phase in seconds.
 */
function phaseDurationSec(phase) {
    if (phase === "focus") return pomoState.focusMin * 60;
    if (phase === "short") return pomoState.shortMin * 60;
    if (phase === "long") return pomoState.longMin * 60;
    return 0;
}

/**
 * Sets the text of the Pomodoro badge.
 * @param {string} text - The text to set.
 */
function setBadge(text) {
    const b = el("pomoBadge");
    if (b) b.textContent = text;
}

/**
 * Renders the Pomodoro timer UI.
 */
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

/**
 * Stops the Pomodoro timer.
 */
function stopTimer() {
    if (pomoInterval) clearInterval(pomoInterval);
    pomoInterval = null;
    pomoState.running = false;
    renderPomo();
}

/**
 * Plays a beep sound.
 */
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
    } catch {
        /* ignore */
    }
}

/**
 * Automatically transitions to the next phase of the Pomodoro timer.
 */
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

        // long rest after every 4th focus session
        pomoState.phase = pomoState.focusDone % 4 === 0 ? "long" : "short";
        pomoState.remaining = phaseDurationSec(pomoState.phase);
    } else if (pomoState.phase === "short" || pomoState.phase === "long") {
        pomoState.phase = "focus";
        pomoState.remaining = phaseDurationSec("focus");
    }

    renderPomo();
    if (pomoState.autoNext) startTimer();
    else stopTimer();
}

/**
 * A single tick of the Pomodoro timer.
 */
function tick() {
    if (pomoState.remaining > 0) {
        pomoState.remaining -= 1;
        renderPomo();
        return;
    }
    nextPhaseAuto();
}

/**
 * Starts the Pomodoro timer.
 */
function startTimer() {
    if (pomoState.phase === "done") return;
    if (pomoInterval) clearInterval(pomoInterval);
    pomoState.running = true;
    pomoInterval = setInterval(tick, 1000);
    renderPomo();
}

/**
 * Applies the Pomodoro settings from the UI.
 */
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

/**
 * Resets the Pomodoro timer.
 * @param {boolean} [full=true] - Whether to do a full reset.
 */
function resetPomodoro(full = true) {
    stopTimer();
    applyPomodoroSettingsFromUI();
    pomoState.phase = "focus";
    pomoState.focusDone = 0;
    pomoState.remaining = phaseDurationSec("focus");
    if (!full) return renderPomo();
    renderPomo();
}

/**
 * Skips the current phase of the Pomodoro timer.
 */
function skipPomodoroPhase() {
    if (pomoState.phase === "done") return;
    pomoState.remaining = 0;
    renderPomo();
    nextPhaseAuto();
}

/**
 * Wires up the Pomodoro timer UI events.
 */
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

    if (btnToggle) {
        btnToggle.onclick = () => {
            if (pomoState.running) return stopTimer();
            applyPomodoroSettingsFromUI();
            if (pomoState.remaining === 0 && pomoState.phase !== "done") {
                pomoState.remaining = phaseDurationSec(pomoState.phase);
            }
            startTimer();
        };
    }
    if (btnReset) btnReset.onclick = () => resetPomodoro(true);
    if (btnSkip) btnSkip.onclick = () => skipPomodoroPhase();
    if (btnHome) btnHome.onclick = () => navigateTo('home');

    resetPomodoro(true);
}
