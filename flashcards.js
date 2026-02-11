/* Biskra CS Student Helper - Flashcards Feature (fixed + modern custom dropdown)
   - Fix: new cards dueAt no longer 0
   - Fix: keydown handler not duplicated (no listener leak)
   - Fix: reveal is idempotent + disables itself
   - Fix: respects deck settings (studyOrder, enableSRS, newPerDay minimal)
   - UI: replaces legacy <select> with fully themed custom dropdown
*/

const FLASHCARDS_STORAGE_KEY = "biskraCSflashcardsv1";

let flashcardsData;
let currentStudySession = null;
let _studyKeydownBound = false;

// -------------------- Utils --------------------
function generateId(prefix = "item_") {
    if (crypto && crypto.randomUUID) return prefix + crypto.randomUUID();
    return prefix + Date.now() + Math.random().toString(36).substring(2, 9);
}

function now() {
    return Date.now();
}

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

function shuffleInPlace(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0;
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function escapeHtml(str) {
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

// -------------------- Custom Select --------------------
function closeAllCustomSelect(except = null) {
    document.querySelectorAll(".customSelect.open").forEach((w) => {
        if (except && w === except) return;
        w.classList.remove("open");
        const btn = w.querySelector(".customSelectBtn");
        if (btn) btn.setAttribute("aria-expanded", "false");
    });
}

function upgradeSelectToCustom(selectEl, { placeholder = "Select..." } = {}) {
    if (!selectEl || selectEl.dataset.customized === "1") return;
    selectEl.dataset.customized = "1";

    // wrapper
    const wrapper = document.createElement("div");
    wrapper.className = "customSelect";
    wrapper.tabIndex = -1;

    // button
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "customSelectBtn";
    btn.setAttribute("aria-haspopup", "listbox");
    btn.setAttribute("aria-expanded", "false");

    const valueSpan = document.createElement("span");
    valueSpan.className = "customSelectValue";

    const chevron = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    chevron.setAttribute("viewBox", "0 0 24 24");
    chevron.setAttribute("class", "customSelectChevron");
    chevron.setAttribute("aria-hidden", "true");
    chevron.innerHTML = `<path fill="currentColor" d="M12 15.6a1 1 0 0 1-.7-.29l-6-6a1 1 0 1 1 1.4-1.42L12 13.18l5.3-5.3a1 1 0 0 1 1.4 1.42l-6 6a1 1 0 0 1-.7.3z"></path>`;

    btn.appendChild(valueSpan);
    btn.appendChild(chevron);

    // menu
    const menu = document.createElement("div");
    menu.className = "customSelectMenu";
    menu.setAttribute("role", "listbox");

    function rebuildMenu() {
        menu.innerHTML = "";

        const opts = Array.from(selectEl.options || []);
        if (opts.length === 0) {
            const empty = document.createElement("div");
            empty.className = "customSelectEmpty";
            empty.textContent = "No options";
            menu.appendChild(empty);
            return;
        }

        const currentValue = selectEl.value;

        opts.forEach((opt) => {
            if (opt.disabled && opt.value === "") {
                // treat as placeholder
                return;
            }

            const optionBtn = document.createElement("button");
            optionBtn.type = "button";
            optionBtn.className = "customSelectOption";
            optionBtn.setAttribute("role", "option");
            optionBtn.dataset.value = opt.value;
            optionBtn.textContent = opt.textContent;

            const selected = opt.value === currentValue;
            optionBtn.setAttribute("aria-selected", selected ? "true" : "false");

            optionBtn.addEventListener("click", () => {
                selectEl.value = opt.value;
                selectEl.dispatchEvent(new Event("change", { bubbles: true }));

                // close
                wrapper.classList.remove("open");
                btn.setAttribute("aria-expanded", "false");
                updateValue();
            });

            menu.appendChild(optionBtn);
        });
    }

    function updateValue() {
        const selected = selectEl.options && selectEl.selectedIndex >= 0
            ? selectEl.options[selectEl.selectedIndex]
            : null;

        let label = selected ? selected.textContent : "";
        if (!label || selectEl.value === "") label = placeholder;
        valueSpan.textContent = label;

        // sync aria-selected
        const currentValue = selectEl.value;
        menu.querySelectorAll(".customSelectOption").forEach((b) => {
            b.setAttribute("aria-selected", b.dataset.value === currentValue ? "true" : "false");
        });
    }

    // mount
    const parent = selectEl.parentNode;
    parent.insertBefore(wrapper, selectEl);
    wrapper.appendChild(btn);
    wrapper.appendChild(menu);
    wrapper.appendChild(selectEl); // keep select inside wrapper (hidden by CSS)

    rebuildMenu();
    updateValue();

    // behavior
    btn.addEventListener("click", () => {
        const isOpen = wrapper.classList.toggle("open");
        closeAllCustomSelect(isOpen ? wrapper : null);
        btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // keyboard (basic)
    btn.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            wrapper.classList.remove("open");
            btn.setAttribute("aria-expanded", "false");
            btn.blur();
        }
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            btn.click();
        }
    });

    // keep in sync if code changes options/value
    selectEl.addEventListener("change", () => {
        rebuildMenu();
        updateValue();
    });

    // global close
    document.addEventListener("click", (e) => {
        if (!wrapper.contains(e.target)) {
            wrapper.classList.remove("open");
            btn.setAttribute("aria-expanded", "false");
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            wrapper.classList.remove("open");
            btn.setAttribute("aria-expanded", "false");
        }
    });
}

// -------------------- Store --------------------
function getDefaultFlashcardsData() {
    return {
        version: 1,
        updatedAt: now(),
        decks: [],
        cards: [],
        ui: { lastDeckId: null },
    };
}

function repairCorruptData() {
    console.warn("Flashcards data was corrupt or invalid. Resetting to default.");
    return getDefaultFlashcardsData();
}

function loadFlashcardsData() {
    const raw = localStorage.getItem(FLASHCARDS_STORAGE_KEY);
    if (!raw) return getDefaultFlashcardsData();
    try {
        const data = JSON.parse(raw);
        if (
            data &&
            typeof data === "object" &&
            Array.isArray(data.decks) &&
            Array.isArray(data.cards)
        ) {
            return data;
        }
        return repairCorruptData();
    } catch (error) {
        console.error("Error parsing flashcards data:", error);
        return repairCorruptData();
    }
}

function saveFlashcardsData() {
    flashcardsData.updatedAt = now();
    try {
        localStorage.setItem(FLASHCARDS_STORAGE_KEY, JSON.stringify(flashcardsData));
    } catch (error) {
        console.error("Error saving flashcards data:", error);
    }
}

function validateFlashcardsStore() {
    const data = flashcardsData;
    let needsSave = false;

    if (!data.version) {
        flashcardsData = getDefaultFlashcardsData();
        needsSave = true;
    }

    if (!data.ui || typeof data.ui !== "object") {
        data.ui = { lastDeckId: null };
        needsSave = true;
    }

    data.decks.forEach((d) => {
        if (!d.settings || typeof d.settings !== "object") {
            d.settings = { studyOrder: "due-first", newPerDay: 20, enableSRS: true };
            needsSave = true;
        } else {
            if (!d.settings.studyOrder) d.settings.studyOrder = "due-first";
            if (typeof d.settings.newPerDay !== "number") d.settings.newPerDay = 20;
            if (typeof d.settings.enableSRS !== "boolean") d.settings.enableSRS = true;
        }
    });

    data.cards.forEach((c) => {
        if (!c.srs || typeof c.srs !== "object") {
            c.srs = {
                state: "new",
                ease: 2.5,
                intervalDays: 0,
                repetitions: 0,
                dueAt: now(),
                lastReviewedAt: 0,
            };
            needsSave = true;
        }
        if (typeof c.srs.dueAt !== "number" || c.srs.dueAt <= 0) {
            c.srs.dueAt = now();
            needsSave = true;
        }
        if (!c.stats || typeof c.stats !== "object") {
            c.stats = { seen: 0, correct: 0, wrong: 0 };
            needsSave = true;
        }
    });

    if (needsSave) saveFlashcardsData();
}

// -------------------- Rendering: Decks --------------------
function renderDecks() {
    const container = document.getElementById("flashcards-decks");
    if (!container) return;

    const decks = flashcardsData.decks;

    container.innerHTML = `
    <div class="actions" style="margin-bottom:16px">
      <button id="show-create-deck-form">Create Deck</button>
      <button id="load-sample-deck" class="secondary">Load Sample Deck</button>
    </div>

    <div id="create-deck-form" style="display:none; margin-bottom:16px">
      <div class="module">
        <div class="top"><div class="name">New Deck</div></div>
        <div class="row one" style="margin-bottom:12px">
          <div>
            <label>Deck Name</label>
            <input type="text" id="new-deck-name" placeholder="e.g., Algorithms" />
          </div>
        </div>
        <div class="actions">
          <button id="save-deck">Save Deck</button>
          <button id="cancel-create-deck" class="secondary">Cancel</button>
        </div>
      </div>
    </div>

    <div id="decks-list"></div>
  `;

    const list = container.querySelector("#decks-list");

    if (decks.length === 0) {
        list.innerHTML = `
      <div class="emptyState" style="text-align:center; padding:40px 20px; color:var(--muted)">
        <div style="font-size:48px; margin-bottom:16px">📚</div>
        <div style="font-size:18px; font-weight:700; margin-bottom:8px">No decks yet</div>
        <div>Click Create Deck to get started.</div>
      </div>
    `;
    } else {
        list.innerHTML = decks
            .map((deck) => {
                const cardCount = flashcardsData.cards.filter((c) => c.deckId === deck.id).length;
                const dueCount = flashcardsData.cards.filter(
                    (c) => c.deckId === deck.id && (c.srs?.dueAt ?? now()) <= now()
                ).length;

                return `
          <div class="homeBtn" style="margin-bottom:10px">
            <div class="homeBtnLeft">
              <div>
                <div class="t">${escapeHtml(deck.name)}</div>
                <div class="d">${cardCount} cards, ${dueCount} due</div>
              </div>
            </div>
            <div class="actions">
              <button class="study-deck" data-deck-id="${deck.id}">Study</button>
              <button class="edit-deck secondary" data-deck-id="${deck.id}">Edit</button>
              <button class="delete-deck secondary" data-deck-id="${deck.id}">Delete</button>
            </div>
          </div>
        `;
            })
            .join("");
    }

    container.querySelector("#show-create-deck-form").addEventListener("click", () => {
        container.querySelector("#create-deck-form").style.display = "block";
        container.querySelector("#new-deck-name").focus();
    });

    container.querySelector("#cancel-create-deck").addEventListener("click", () => {
        container.querySelector("#create-deck-form").style.display = "none";
        container.querySelector("#new-deck-name").value = "";
    });

    container.querySelector("#save-deck").addEventListener("click", () => {
        const deckName = container.querySelector("#new-deck-name").value.trim();
        if (!deckName) return;

        const newDeck = {
            id: generateId("deck_"),
            name: deckName,
            description: "",
            createdAt: now(),
            updatedAt: now(),
            settings: { studyOrder: "due-first", newPerDay: 20, enableSRS: true },
        };

        flashcardsData.decks.push(newDeck);
        flashcardsData.ui.lastDeckId = newDeck.id;
        saveFlashcardsData();

        renderDecks();
        renderCreateCardForm();
        renderStudyTab();
        renderStatsTab();
    });

    container.querySelector("#load-sample-deck").addEventListener("click", () => {
        showSampleDeckModal();
    });

    list.querySelectorAll(".delete-deck").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const deckId = e.target.dataset.deckId;
            const deck = flashcardsData.decks.find(d => d.id === deckId);
            if (!deck) return;
            
            const cardCount = flashcardsData.cards.filter(c => c.deckId === deckId).length;
            const message = `Are you sure you want to permanently delete the deck "${deck.name}"?\n\nThis will delete the deck and all ${cardCount} flashcard(s) it contains.\nThis action cannot be undone.`;
            
            showDeleteConfirmation(message, () => {
                flashcardsData.decks = flashcardsData.decks.filter((d) => d.id !== deckId);
                flashcardsData.cards = flashcardsData.cards.filter((c) => c.deckId !== deckId);
                if (flashcardsData.ui.lastDeckId === deckId) flashcardsData.ui.lastDeckId = null;

                saveFlashcardsData();
                renderDecks();
                renderCreateCardForm();
                renderStudyTab();
                renderStatsTab();
            });
        });
    });

    list.querySelectorAll(".study-deck").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const deckId = e.target.dataset.deckId;
            flashcardsData.ui.lastDeckId = deckId;
            saveFlashcardsData();
            showFlashcardTab("study");
        });
    });

    list.querySelectorAll(".edit-deck").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const deckId = e.target.dataset.deckId;
            const deck = flashcardsData.decks.find((d) => d.id === deckId);
            if (!deck) return;

            const newName = prompt("Deck name:", deck.name);
            if (newName == null) return;

            const trimmed = newName.trim();
            if (!trimmed) return;

            deck.name = trimmed;
            deck.updatedAt = now();
            saveFlashcardsData();
            renderDecks();
            renderCreateCardForm();
            renderStudyTab();
        });
    });
}

// -------------------- Rendering: Create --------------------
function renderCreateCardForm() {
    const container = document.getElementById("flashcards-create");
    if (!container) return;

    const decks = flashcardsData.decks;
    const options = decks.map((d) => `<option value="${d.id}">${escapeHtml(d.name)}</option>`).join("");

    container.innerHTML = `
    <div class="module">
      <div class="top"><div class="name">Create a New Card</div></div>

      <div class="row one" style="margin-bottom:12px">
        <div>
          <label>Deck</label>
          <select id="card-deck-select">
            ${options || `<option value="" disabled selected>No decks yet</option>`}
          </select>
        </div>
      </div>

      <div class="row one" style="margin-bottom:12px">
        <div>
          <label>Front</label>
          <textarea id="card-front" rows="3" placeholder="What is the question or term?"></textarea>
        </div>
      </div>

      <div class="row one" style="margin-bottom:12px">
        <div>
          <label>Back</label>
          <textarea id="card-back" rows="3" placeholder="What is the answer or definition?"></textarea>
        </div>
      </div>

      <div class="row one" style="margin-bottom:12px">
        <div>
          <label>Tags (comma-separated)</label>
          <input type="text" id="card-tags" placeholder="e.g., chapter1, hard" />
        </div>
      </div>

      <div class="actions">
        <button id="save-card">Save Card</button>
      </div>
    </div>

    <div class="module" style="margin-top:16px">
      <div class="top"><div class="name">Browse Cards</div></div>
      <div id="browse-cards-container"></div>
    </div>
  `;

    // Upgrade select to custom dropdown
    const deckSelect = container.querySelector("#card-deck-select");
    upgradeSelectToCustom(deckSelect, { placeholder: "Select deck" });

    container.querySelector("#save-card").addEventListener("click", () => {
        const deckId = deckSelect ? deckSelect.value : "";
        const front = container.querySelector("#card-front").value.trim();
        const back = container.querySelector("#card-back").value.trim();
        const tags = container
            .querySelector("#card-tags")
            .value.split(",")
            .map((t) => t.trim())
            .filter(Boolean);

        if (!deckId || !front || !back) {
            alert("Please select a deck and fill in both the front and back of the card.");
            return;
        }

        flashcardsData.cards.push({
            id: generateId("card_"),
            deckId,
            front,
            back,
            tags,
            createdAt: now(),
            updatedAt: now(),
            srs: {
                state: "new",
                ease: 2.5,
                intervalDays: 0,
                repetitions: 0,
                dueAt: now(),
                lastReviewedAt: 0,
            },
            stats: { seen: 0, correct: 0, wrong: 0 },
        });

        flashcardsData.ui.lastDeckId = deckId;
        saveFlashcardsData();

        container.querySelector("#card-front").value = "";
        container.querySelector("#card-back").value = "";
        container.querySelector("#card-tags").value = "";

        renderBrowseCards();
        renderDecks();
        renderStatsTab();
    });

    renderBrowseCards();
}

function renderBrowseCards() {
    const container = document.getElementById("browse-cards-container");
    if (!container) return;

    const cards = flashcardsData.cards;
    if (cards.length === 0) {
        container.innerHTML = `<div style="color:var(--muted)">No cards created yet.</div>`;
        return;
    }

    const rows = cards
        .map((card) => {
            const deck = flashcardsData.decks.find((d) => d.id === card.deckId);
            return `
        <tr>
          <td>${escapeHtml(card.front)}</td>
          <td>${escapeHtml(card.back)}</td>
          <td>${deck ? escapeHtml(deck.name) : "N/A"}</td>
          <td><button class="delete-card secondary" data-card-id="${card.id}">Delete</button></td>
        </tr>
      `;
        })
        .join("");

    container.innerHTML = `
    <table class="table">
      <thead><tr><th>Front</th><th>Back</th><th>Deck</th><th>Actions</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;

    container.querySelectorAll(".delete-card").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const cardId = e.target.dataset.cardId;
            const card = flashcardsData.cards.find(c => c.id === cardId);
            if (!card) return;
            
            const truncatedFront = card.front.length > 60 ? card.front.substring(0, 60) + '...' : card.front;
            const message = `Are you sure you want to permanently delete this flashcard?\n\nFront: "${truncatedFront}"\n\nThis action cannot be undone.`;
            
            showDeleteConfirmation(message, () => {
                flashcardsData.cards = flashcardsData.cards.filter((c) => c.id !== cardId);
                saveFlashcardsData();
                renderBrowseCards();
                renderDecks();
                renderStatsTab();
            });
        });
    });
}

// -------------------- Rendering: Study --------------------
function renderStudyTab() {
    const container = document.getElementById("flashcards-study");
    if (!container) return;

    const decks = flashcardsData.decks;
    const lastDeckId = flashcardsData.ui.lastDeckId;

    if (decks.length === 0) {
        container.innerHTML = `
      <div class="emptyState" style="text-align:center; padding:40px 20px; color:var(--muted)">
        <div>Create a deck first to start studying.</div>
      </div>
    `;
        return;
    }

    const options = decks
        .map((d) => `<option value="${d.id}" ${d.id === lastDeckId ? "selected" : ""}>${escapeHtml(d.name)}</option>`)
        .join("");

    container.innerHTML = `
    <div class="module">
      <div class="row two">
        <div>
          <label>Select Deck</label>
          <select id="study-deck-select">${options}</select>
        </div>
        <div style="display:flex; align-items:flex-end; gap:10px">
          <button id="start-study-session">Start Studying</button>
          <button id="reset-session" class="secondary">Reset</button>
        </div>
      </div>

      <div id="study-session-container" style="margin-top:16px"></div>
    </div>
  `;

    const studySelect = container.querySelector("#study-deck-select");
    upgradeSelectToCustom(studySelect, { placeholder: "Select deck" });

    container.querySelector("#start-study-session").addEventListener("click", () => {
        startStudySession(studySelect.value);
    });

    container.querySelector("#reset-session").addEventListener("click", () => {
        endStudySession(true);
    });
}

function buildCardsToReview(deck) {
    const all = flashcardsData.cards.filter((c) => c.deckId === deck.id);

    const due = all.filter((c) => (c.srs?.dueAt ?? now()) <= now());
    const notDue = all.filter((c) => (c.srs?.dueAt ?? now()) > now());

    const newPerDay = clamp(Number(deck.settings?.newPerDay ?? 20), 0, 500);

    let candidates = due.slice();
    if (newPerDay > 0) candidates = candidates.concat(notDue.slice(0, newPerDay));

    const order = deck.settings?.studyOrder || "due-first";
    if (order === "due-first") {
        candidates.sort((a, b) => (a.srs?.dueAt ?? 0) - (b.srs?.dueAt ?? 0));
    } else {
        shuffleInPlace(candidates);
    }
    return candidates;
}

function startStudySession(deckId) {
    const deck = flashcardsData.decks.find((d) => d.id === deckId);
    if (!deck) return;

    flashcardsData.ui.lastDeckId = deckId;
    saveFlashcardsData();

    const cardsToReview = buildCardsToReview(deck);

    currentStudySession = {
        deckId,
        deckSettings: deck.settings || { studyOrder: "due-first", newPerDay: 20, enableSRS: true },
        cards: cardsToReview,
        currentIndex: 0,
        startTime: now(),
        correct: 0,
        wrong: 0,
    };

    renderCurrentStudyCard();
}

function bindStudyKeydown() {
    if (_studyKeydownBound) return;
    document.addEventListener("keydown", handleStudyKeydown);
    _studyKeydownBound = true;
}

function unbindStudyKeydown() {
    if (!_studyKeydownBound) return;
    document.removeEventListener("keydown", handleStudyKeydown);
    _studyKeydownBound = false;
}

function handleStudyKeydown(e) {
    if (!currentStudySession) return;

    if (e.code === "Space") {
        e.preventDefault();
        const revealBtn = document.getElementById("reveal-card");
        if (revealBtn) revealBtn.click();
        return;
    }

    if (["1", "2", "3", "4"].includes(e.key)) {
        e.preventDefault();
        const ratingMap = { "1": 1, "2": 3, "3": 4, "4": 5 };
        const rating = ratingMap[e.key];
        const rateBtn = document.querySelector(`.rate-card[data-rating="${rating}"]`);
        if (rateBtn) rateBtn.click();
    }
}

function endStudySession(clearOnly = false) {
    unbindStudyKeydown();
    currentStudySession = null;

    if (clearOnly) {
        renderStudyTab();
        return;
    }

    renderStudyTab();
    renderDecks();
    renderStatsTab();
    saveFlashcardsData();
}

function renderCurrentStudyCard() {
    const container = document.getElementById("study-session-container");
    if (!container || !currentStudySession) return;

    const card = currentStudySession.cards[currentStudySession.currentIndex];

    if (!card) {
        const endTime = now();
        const duration = Math.round((endTime - currentStudySession.startTime) / 1000);
        const total = currentStudySession.correct + currentStudySession.wrong;
        const accuracy = total > 0 ? Math.round((currentStudySession.correct / total) * 100) : 0;

        container.innerHTML = `
      <div class="module">
        <div class="top"><div class="name">Session Complete!</div></div>

        <div class="stat"><div class="big">${total}</div><div class="sub">Cards reviewed</div></div>
        <div class="stat"><div class="big">${accuracy}%</div><div class="sub">Accuracy</div></div>
        <div class="stat"><div class="big">${duration}s</div><div class="sub">Time spent</div></div>

        <div class="actions"><button id="end-study-session">Back to Deck Selection</button></div>
      </div>
    `;

        container.querySelector("#end-study-session").addEventListener("click", () => endStudySession(false));
        unbindStudyKeydown();
        return;
    }

    bindStudyKeydown();

    container.innerHTML = `
    <div class="module">
      <div class="kpi">
        <span>Card <strong>${currentStudySession.currentIndex + 1}</strong> of <strong>${currentStudySession.cards.length}</strong></span>
        <span style="color:var(--muted)">Space = reveal, 1-4 = rate</span>
      </div>

      <div class="study-card">
        <div class="card-face front">${escapeHtml(card.front)}</div>
        <div class="card-face back" style="display:none">${escapeHtml(card.back)}</div>
      </div>

      <div class="actions" id="study-actions">
        <button id="reveal-card">Reveal</button>
      </div>
    </div>
  `;

    container.querySelector("#reveal-card").addEventListener("click", revealStudyCard);
}

function revealStudyCard() {
    const back = document.querySelector(".study-card .back");
    const actionsContainer = document.getElementById("study-actions");
    const revealBtn = document.getElementById("reveal-card");

    if (!back || !actionsContainer) return;

    back.style.display = "block";
    if (revealBtn) revealBtn.disabled = true;

    if (actionsContainer.querySelector(".rate-card")) return;

    actionsContainer.innerHTML = `
    <button class="rate-card again" data-rating="1">Again (1)</button>
    <button class="rate-card hard" data-rating="3">Hard (2)</button>
    <button class="rate-card good" data-rating="4">Good (3)</button>
    <button class="rate-card success" data-rating="5">Easy (4)</button>
  `;

    actionsContainer.querySelectorAll(".rate-card").forEach((btn) => {
        btn.addEventListener("click", (e) => processCardRating(parseInt(e.target.dataset.rating, 10)));
    });
}

function processCardRating(rating) {
    if (!currentStudySession) return;

    const card = currentStudySession.cards[currentStudySession.currentIndex];
    if (!card) return;

    unbindStudyKeydown();

    card.srs.lastReviewedAt = now();
    card.stats.seen += 1;

    const enableSRS = !!currentStudySession.deckSettings?.enableSRS;

    if (rating >= 3) {
        currentStudySession.correct += 1;
        card.stats.correct += 1;
    } else {
        currentStudySession.wrong += 1;
        card.stats.wrong += 1;
    }

    if (enableSRS) {
        let ease = Number(card.srs.ease ?? 2.5);
        let interval = Number(card.srs.intervalDays ?? 0);
        let repetitions = Number(card.srs.repetitions ?? 0);

        if (rating >= 3) {
            if (repetitions === 0) interval = 1;
            else if (repetitions === 1) interval = 6;
            else interval = Math.round(interval * ease);

            repetitions += 1;
            card.srs.state = "review";
        } else {
            repetitions = 0;
            interval = 1;
            card.srs.state = "learning";
        }

        ease = ease + (0.1 - (5 - rating) * 0.08 - (5 - rating) * 0.02);
        ease = clamp(ease, 1.3, 3.5);

        card.srs.ease = ease;
        card.srs.intervalDays = interval;
        card.srs.repetitions = repetitions;
        card.srs.dueAt = now() + interval * 24 * 60 * 60 * 1000;
    } else {
        card.srs.dueAt = now() + 2 * 60 * 1000;
    }

    card.updatedAt = now();
    saveFlashcardsData();

    currentStudySession.currentIndex += 1;
    renderCurrentStudyCard();
}

// -------------------- Rendering: Stats --------------------
function renderStatsTab() {
    const container = document.getElementById("flashcards-stats");
    if (!container) return;

    const totalDecks = flashcardsData.decks.length;
    const totalCards = flashcardsData.cards.length;
    const totalReviews = flashcardsData.cards.reduce((sum, c) => sum + (c.stats?.seen || 0), 0);

    container.innerHTML = `
    <div class="module">
      <div class="top"><div class="name">Overall Stats</div></div>
      <div class="row three">
        <div class="stat"><div class="big">${totalDecks}</div><div class="sub">Decks</div></div>
        <div class="stat"><div class="big">${totalCards}</div><div class="sub">Cards</div></div>
        <div class="stat"><div class="big">${totalReviews}</div><div class="sub">Total reviews</div></div>
      </div>
    </div>

    <div class="module" style="margin-top:16px">
      <div class="top"><div class="name">Import / Export</div></div>
      <p style="color:var(--muted); margin-top:0">Save your flashcards to a file or load them from a backup.</p>
      <div class="actions">
        <button id="export-flashcards">Export to JSON</button>
        <button id="import-flashcards" class="secondary">Import from JSON</button>
        <input type="file" id="import-file-input" style="display:none" accept=".json" />
      </div>
    </div>
  `;

    container.querySelector("#export-flashcards").addEventListener("click", exportFlashcards);
    container.querySelector("#import-flashcards").addEventListener("click", () => {
        container.querySelector("#import-file-input").click();
    });
    container.querySelector("#import-file-input").addEventListener("change", importFlashcards);
}

function exportFlashcards() {
    const dataStr = JSON.stringify(flashcardsData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `biskra-cs-flashcards-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importFlashcards(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importedData = JSON.parse(e.target.result);
            if (!importedData || !importedData.version || !Array.isArray(importedData.decks) || !Array.isArray(importedData.cards)) {
                alert("Invalid or corrupted file.");
                return;
            }

            if (!confirm("Replace your current flashcards with the imported data? This cannot be undone.")) return;

            flashcardsData = importedData;
            validateFlashcardsStore();
            saveFlashcardsData();

            renderDecks();
            renderCreateCardForm();
            renderStudyTab();
            renderStatsTab();
            alert("Flashcards imported successfully!");
            showFlashcardTab("decks");
        } catch (error) {
            alert("Error reading or parsing the file.");
            console.error(error);
        }
    };
    reader.readAsText(file);
    event.target.value = "";
}

// -------------------- Sample deck --------------------
function loadSampleDeckInternal() {
    const sampleDeck = {
        id: generateId("deck_"),
        name: "CS Basics",
        description: "A few cards to get you started.",
        createdAt: now(),
        updatedAt: now(),
        settings: { studyOrder: "due-first", newPerDay: 20, enableSRS: true },
    };

    const sampleCards = [
        { front: "What is an Algorithm?", back: "A step-by-step procedure for solving a problem." },
        { front: "What does API stand for?", back: "Application Programming Interface." },
        { front: "What is a variable?", back: "A storage location with a specific type and an associated name." },
        { front: "What is a function?", back: "A block of code that can be called and executed." },
        { front: "What is git?", back: "A distributed version control system." },
        { front: "What is HTML?", back: "HyperText Markup Language, for creating web pages." },
        { front: "What is CSS?", back: "Cascading Style Sheets, for styling web pages." },
        { front: "What is JavaScript?", back: "A programming language for adding interactivity to web pages." },
        { front: "What is a database?", back: "An organized collection of data." },
        { front: "What is a bug?", back: "An error in a program that causes incorrect or unexpected results." },
    ];

    flashcardsData.decks.push(sampleDeck);

    sampleCards.forEach((card) => {
        flashcardsData.cards.push({
            id: generateId("card_"),
            deckId: sampleDeck.id,
            front: card.front,
            back: card.back,
            tags: ["sample"],
            createdAt: now(),
            updatedAt: now(),
            srs: {
                state: "new",
                ease: 2.5,
                intervalDays: 0,
                repetitions: 0,
                dueAt: now(),
                lastReviewedAt: 0,
            },
            stats: { seen: 0, correct: 0, wrong: 0 },
        });
    });

    flashcardsData.ui.lastDeckId = sampleDeck.id;

    saveFlashcardsData();
    renderDecks();
    renderCreateCardForm();
    renderStudyTab();

    // Update UI to show success without alert
    const originalButtonText = document.querySelector("#load-sample-deck").textContent;
    document.querySelector("#load-sample-deck").textContent = "Loaded!";
    setTimeout(() => {
        document.querySelector("#load-sample-deck").textContent = originalButtonText;
    }, 2000);
}

function loadSampleDeck() {
    showSampleDeckModal();
}

// -------------------- Tabs / Init --------------------
function showFlashcardTab(tabName) {
    if (tabName !== "study") unbindStudyKeydown();

    document.querySelectorAll("#pageflashcards .tab-content").forEach((content) => {
        content.classList.remove("active");
    });

    document.querySelectorAll("#pageflashcards .tab-link").forEach((link) => {
        link.classList.remove("active");
    });

    const activeContent = document.getElementById(`flashcards-${tabName}`);
    if (activeContent) activeContent.classList.add("active");

    const activeLink = document.querySelector(`#pageflashcards .tab-link[data-tab="${tabName}"]`);
    if (activeLink) activeLink.classList.add("active");

    if (tabName === "create") renderCreateCardForm();
    else if (tabName === "study") renderStudyTab();
    else if (tabName === "stats") renderStatsTab();
}

function initFlashcards() {
    flashcardsData = loadFlashcardsData();
    validateFlashcardsStore();

    document.querySelectorAll("#pageflashcards .tab-link").forEach((btn) => {
        btn.addEventListener("click", () => showFlashcardTab(btn.dataset.tab));
    });

    // Close dropdowns when scrolling inside flashcards card (nice UX)
    const flashPage = document.getElementById("pageflashcards");
    if (flashPage) {
        flashPage.addEventListener("scroll", () => closeAllCustomSelect());
    }

    renderDecks();
    showFlashcardTab("decks");
    console.log("Flashcards feature initialized.");
}

// Initialize modal event listeners after the initFlashcards function
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) {
        // Close modal when clicking outside the dialog
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                modal.style.display = 'none';
            }
        });
    }
});

window.initFlashcards = initFlashcards;

function showDeleteConfirmation(message, onConfirm) {
    const modal = document.getElementById('deleteConfirmModal');
    const messageElement = document.getElementById('deleteConfirmMessage');
    const confirmButton = document.getElementById('confirmDeleteBtn');
    const cancelButton = document.getElementById('cancelDeleteBtn');
    
    messageElement.textContent = message;
    
    // Define the event handlers
    const confirmHandler = () => {
        onConfirm();
        closeModal();
    };
    
    const cancelHandler = closeModal;
    
    // Add event listeners
    confirmButton.addEventListener('click', confirmHandler);
    cancelButton.addEventListener('click', cancelHandler);
    
    // Show the modal
    modal.style.display = 'flex';
    
    // Function to close the modal and clean up event listeners
    function closeModal() {
        modal.style.display = 'none';
        confirmButton.removeEventListener('click', confirmHandler);
        cancelButton.removeEventListener('click', cancelHandler);
    }
}

function showSampleDeckModal() {
    const modal = document.getElementById('sampleDeckModal');
    const confirmButton = document.getElementById('confirmSampleBtn');
    const cancelButton = document.getElementById('cancelSampleBtn');
    
    // Define the event handlers
    const confirmHandler = () => {
        loadSampleDeckInternal();
        modal.style.display = 'none';
    };
    
    const cancelHandler = () => {
        modal.style.display = 'none';
    };
    
    // Add event listeners
    confirmButton.addEventListener('click', confirmHandler);
    cancelButton.addEventListener('click', cancelHandler);
    
    // Show the modal
    modal.style.display = 'flex';
}
