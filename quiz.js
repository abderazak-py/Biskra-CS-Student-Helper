// ===================== CS QUIZ =====================

/**
 * @typedef {object} QuizQuestion
 * @property {string} cat - The category of the question.
 * @property {string} q - The question text.
 * @property {string[]} options - An array of possible answers.
 * @property {number} answer - The index of the correct answer in the options array.
 * @property {string} exp - An explanation of the correct answer.
 */

/**
 * An array of quiz questions.
 * @type {QuizQuestion[]}
 */
const QUIZ_QUESTIONS = [
    {
        cat: "Basics",
        q: "Which one is a real programming paradigm?",
        options: ["Object-Oriented Programming", "Circle-Oriented Programming", "Keyboard-Oriented Programming"],
        answer: 0,
        exp: "OOP is a real paradigm; the others are jokes.",
    },
    {
        cat: "Fun",
        q: "Who is the best female programmer?",
        options: ["Ada Lovelace", "Ibtihal", "Grace Hopper"],
        answer: 1,
        exp: "Because she made the first pull request.",
    },
    {
        cat: "Data Structures",
        q: "Which structure uses LIFO (Last In, First Out)?",
        options: ["Queue", "Stack", "Binary search tree"],
        answer: 1,
        exp: "Stacks are LIFO; queues are FIFO.",
    },
    {
        cat: "Algorithms",
        q: "Binary search works correctly only if the array is…",
        options: ["Sorted", "Random", "Full of duplicates"],
        answer: 0,
        exp: "Binary search relies on sorted order to discard half each step.",
    },
    {
        cat: "Big-O",
        q: "Which is generally the fastest growth (worst) as n gets big?",
        options: ["O(n log n)", "O(n^2)", "O(log n)"],
        answer: 1,
        exp: "Quadratic grows faster than n log n and log n.",
    },
    {
        cat: "Operating Systems",
        q: "What does a process scheduler mainly decide?",
        options: ["Which app gets the CPU next", "How many pixels are on screen", "The Wi‑Fi password"],
        answer: 0,
        exp: "Scheduling is about CPU time allocation.",
    },
    {
        cat: "Networking",
        q: "HTTP is mainly used at which layer (classic TCP/IP view)?",
        options: ["Application", "Transport", "Link"],
        answer: 0,
        exp: "HTTP is an application-layer protocol.",
    },
    {
        cat: "Databases",
        q: "In SQL, which keyword is used to filter rows?",
        options: ["WHERE", "FILTERNOW", "SEARCH"],
        answer: 0,
        exp: "WHERE filters rows that match a condition.",
    },
    {
        cat: "Security",
        q: "Which one is a good practice for passwords?",
        options: ["Reuse the same password everywhere", "Use a password manager + unique passwords", "Save passwords in a public note"],
        answer: 1,
        exp: "Unique passwords + a manager reduces damage if one site leaks.",
    },
    {
        cat: "Programming",
        q: "A compiler mainly does what?",
        options: ["Translates source code to machine/bytecode", "Cleans your keyboard", "Makes your internet faster"],
        answer: 0,
        exp: "Compilers translate code; jokes aside.",
    },
    {
        cat: "Fun CS",
        q: "If you find a bug, what is the best first move?",
        options: ["Panic", "Reproduce it consistently", "Delete the whole project"],
        answer: 1,
        exp: "Reproducing makes debugging possible.",
    },
    {
        cat: "Web",
        q: "CSS is mainly responsible for…",
        options: ["Styling/layout", "Database queries", "CPU scheduling"],
        answer: 0,
        exp: "CSS controls appearance; JS controls logic; DB stores data.",
    },
    {
        cat: "Git",
        q: "What does 'git commit' create?",
        options: ["A snapshot in history", "A new laptop", "A virus"],
        answer: 0,
        exp: "A commit records a snapshot of tracked changes.",
    },
    {
        cat: "Fun",
        q: "What's the best club in Biskra?",
        options: ["Debug Club", "InterLink Club", "Metaverse Club"],
        answer: 1,
        exp: "InterLink is the best club here.",
    },
    {
        cat: "Fun",
        q: "Who is the best programmer?",
        options: ["Elon Musk", "Steve Jobs", "Abderrazak"],
        answer: 2,
        exp: "Because Abderrazak made this web application.",
    },
    {
        cat: "Basics",
        q: "What does 'bug' mean in programming?",
        options: ["A feature", "An error in the code", "A hardware upgrade"],
        answer: 1,
        exp: "A bug is an error or flaw that causes incorrect or unexpected behavior.",
    },
    {
        cat: "Basics",
        q: "Which of these is NOT a programming language?",
        options: ["Python", "HTML", "Cappuccino"],
        answer: 2,
        exp: "HTML is a markup language; Cappuccino is just a drink name here.",
    },
    {
        cat: "Programming",
        q: "What does 'IDE' stand for?",
        options: ["Integrated Development Environment", "Internal Data Engine", "Infinite Debugging Experience"],
        answer: 0,
        exp: "An IDE is a software suite that helps you write, run, and debug code.",
    },
    {
        cat: "Programming",
        q: "In most languages, arrays are usually indexed starting from…",
        options: ["0", "1", "−1"],
        answer: 0,
        exp: "Many languages like C, Java, and JavaScript use zero-based indexing.",
    },
    {
        cat: "Data Structures",
        q: "Which data structure is best to implement a FIFO queue?",
        options: ["Queue", "Stack", "Hash table"],
        answer: 0,
        exp: "A queue is explicitly designed for FIFO behavior.",
    },
    {
        cat: "Data Structures",
        q: "Which structure is best suited for fast key–value lookups?",
        options: ["Array", "Hash map", "Queue"],
        answer: 1,
        exp: "Hash maps (dictionaries) give average O(1) key–value access.",
    },
    {
        cat: "Algorithms",
        q: "Which algorithm is typically used for finding the shortest path in a weighted graph?",
        options: ["Bubble sort", "Dijkstra’s algorithm", "Merge sort"],
        answer: 1,
        exp: "Dijkstra’s algorithm finds shortest paths from a source in a weighted graph.",
    },
    {
        cat: "Algorithms",
        q: "Which sorting algorithm is usually O(n log n) in the average case?",
        options: ["Bubble sort", "Insertion sort", "Merge sort"],
        answer: 2,
        exp: "Merge sort guarantees O(n log n) time complexity.",
    },
    {
        cat: "Big-O",
        q: "If an algorithm doubles its steps every time n increases by 1, its complexity is roughly…",
        options: ["O(n)", "O(log n)", "O(2^n)"],
        answer: 2,
        exp: "Doubling with each increment is characteristic of exponential time.",
    },
    {
        cat: "Big-O",
        q: "Which complexity is generally best (fastest) for large n?",
        options: ["O(n^3)", "O(log n)", "O(n^2)"],
        answer: 1,
        exp: "Logarithmic time grows the slowest, so it’s best for large inputs.",
    },
    {
        cat: "Operating Systems",
        q: "What is a 'thread' in an OS?",
        options: ["A type of cable", "A unit of CPU execution inside a process", "A backup file"],
        answer: 1,
        exp: "A thread is the smallest unit of execution scheduled by the OS.",
    },
    {
        cat: "Operating Systems",
        q: "What does 'deadlock' mean?",
        options: ["CPU overheating", "Processes waiting on each other forever", "Hard disk full"],
        answer: 1,
        exp: "Deadlock happens when processes wait on resources in a cycle that never breaks.",
    },
    {
        cat: "Networking",
        q: "Which protocol is commonly used to send emails?",
        options: ["SMTP", "FTP", "SSH"],
        answer: 0,
        exp: "SMTP (Simple Mail Transfer Protocol) is used for sending emails.",
    },
    {
        cat: "Networking",
        q: "Which device usually connects multiple networks together?",
        options: ["Router", "Keyboard", "Monitor"],
        answer: 0,
        exp: "Routers forward packets between different networks.",
    },
    {
        cat: "Networking",
        q: "What does IP in 'IP address' stand for?",
        options: ["Internet Protocol", "Internal Program", "Input Processor"],
        answer: 0,
        exp: "IP stands for Internet Protocol, which handles addressing and routing.",
    },
    {
        cat: "Databases",
        q: "What does SQL stand for?",
        options: ["Structured Query Language", "Simple Question List", "Sequential Query Logic"],
        answer: 0,
        exp: "SQL is the standard language for working with relational databases.",
    },
    {
        cat: "Databases",
        q: "Which SQL command is used to remove a table completely?",
        options: ["DELETE TABLE", "DROP TABLE", "REMOVE TABLE"],
        answer: 1,
        exp: "DROP TABLE deletes the table structure and its data.",
    },
    {
        cat: "Databases",
        q: "A primary key in a table must be…",
        options: ["Unique and not NULL", "Always text", "Always a number"],
        answer: 0,
        exp: "Primary keys uniquely identify rows and cannot be NULL.",
    },
    {
        cat: "Security",
        q: "What does 'HTTPS' add on top of HTTP?",
        options: ["More ads", "Encryption and security", "Faster Wi‑Fi"],
        answer: 1,
        exp: "HTTPS uses TLS to encrypt traffic and improve security.",
    },
    {
        cat: "Security",
        q: "What is phishing?",
        options: ["Optimizing code", "Tricking users into giving up secrets", "Testing Wi‑Fi speed"],
        answer: 1,
        exp: "Phishing uses fake messages/sites to steal credentials or data.",
    },
    {
        cat: "Security",
        q: "Two‑factor authentication (2FA) usually means…",
        options: ["Two passwords only", "Password plus another proof (code, app, device)", "Using two browsers"],
        answer: 1,
        exp: "2FA combines something you know (password) with something you have or are.",
    },
    {
        cat: "Web",
        q: "HTML is mainly used for…",
        options: ["Structuring web content", "Styling pages", "Running database queries"],
        answer: 0,
        exp: "HTML defines the structure and semantics of web pages.",
    },
    {
        cat: "Web",
        q: "JavaScript in the browser is mainly used for…",
        options: ["Interactivity and logic", "Only styling", "Installing drivers"],
        answer: 0,
        exp: "JavaScript adds dynamic behavior and logic to web pages.",
    },
    {
        cat: "Web",
        q: "Which HTTP method is commonly used to request data (without changing it)?",
        options: ["GET", "DELETE", "FORMAT"],
        answer: 0,
        exp: "GET requests data from a resource without modifying it.",
    },
    {
        cat: "Git",
        q: "Which command creates a copy of a remote repository on your machine?",
        options: ["git clone", "git copy", "git download"],
        answer: 0,
        exp: "git clone copies an entire remote repo locally.",
    },
    {
        cat: "Git",
        q: "Which command sends your local commits to a remote?",
        options: ["git push", "git send", "git upload"],
        answer: 0,
        exp: "git push uploads your commits to a remote repository.",
    },
    {
        cat: "Git",
        q: "What does 'git status' show?",
        options: ["Battery level", "Current branch and changes", "Internet speed"],
        answer: 1,
        exp: "git status shows staged/unstaged changes and branch info.",
    },
    {
        cat: "Programming",
        q: "What is a 'loop' used for?",
        options: ["Repeating code multiple times", "Encrypting files", "Drawing UI only"],
        answer: 0,
        exp: "Loops let you repeat a block of code until a condition changes.",
    },
    {
        cat: "Programming",
        q: "In many languages, '==' is used to…",
        options: ["Assign a value", "Compare two values", "Delete a variable"],
        answer: 1,
        exp: "== (or ===) is typically a comparison operator, not assignment.",
    },
    {
        cat: "Programming",
        q: "What is a variable?",
        options: ["A fixed number", "A named storage for data", "Only a constant string"],
        answer: 1,
        exp: "Variables store data values that can change during program execution.",
    },
    {
        cat: "Fun CS",
        q: "When your code works on the first try, you should…",
        options: ["Assume it’s perfect forever", "Still test it and be suspicious", "Immediately refactor the universe"],
        answer: 1,
        exp: "Even if it runs, you still need to test and review the logic.",
    },
    {
        cat: "Fun CS",
        q: "What is the unofficial first step of debugging?",
        options: ["Blame the compiler", "Check if you saved the file and re‑run", "Uninstall the OS"],
        answer: 1,
        exp: "Forgetting to save or re‑run is a classic source of “bugs”.",
    },
    {
        cat: "Fun",
        q: "What’s the most powerful key for a CS student?",
        options: ["Caps Lock", "Ctrl+S", "Num Lock"],
        answer: 1,
        exp: "Saving your work frequently is the real superpower.",
    },
    {
        cat: "Fun",
        q: "A programmer’s best friend during deadlines is…",
        options: ["Sleep", "Coffee or tea", "Turning off the PC"],
        answer: 1,
        exp: "Caffeine and focus are a classic combo during crunch time.",
    },
    {
        cat: "Basics",
        q: "RAM is mainly used for…",
        options: ["Permanent storage", "Temporary working memory", "Improving screen colors"],
        answer: 1,
        exp: "RAM holds data and code that the CPU is actively using.",
    },
    {
        cat: "Basics",
        q: "The CPU is often called the…",
        options: ["Heart of the computer", "Brain of the computer", "Legs of the computer"],
        answer: 1,
        exp: "The CPU performs most calculations, so it’s nicknamed the brain.",
    },
    {
        cat: "Fun",
        q: "Who is the best admin in cs dep ?",
        options: ["Taha abdchafi Metir", "chef dep", "Choumeissa kadi"],
        answer: 0,
        exp: "Because he did a lot for the students of the department.",
    },
];

/**
 * Shuffles an array in place.
 * @param {Array} arr - The array to shuffle.
 * @returns {Array} The shuffled array.
 */
function shuffleInPlace(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/**
 * The state of the quiz.
 * @type {object}
 * @property {QuizQuestion[]} order - The shuffled order of the questions.
 * @property {number} idx - The index of the current question.
 * @property {number} score - The player's score.
 * @property {boolean} locked - Whether the UI is locked after an answer.
 * @property {number} total - The total number of questions.
 */
const quizState = {
    order: [],
    idx: 0,
    score: 0,
    locked: false,
    total: 12,
};

/**
 * A shorthand for document.getElementById.
 * @param {string} id - The ID of the element to get.
 * @returns {HTMLElement|null} The element or null if not found.
 */
function qEl(id) {
    return document.getElementById(id);
}

/**
 * Sets the text of the quiz badge.
 * @param {string} text - The text to set.
 */
function quizSetBadge(text) {
    const b = qEl("quizBadge");
    if (b) b.textContent = text;
}

/**
 * Renders the quiz UI.
 */
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

/**
 * Handles the user's choice of answer.
 * @param {number} chosenIdx - The index of the chosen answer.
 */
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

    const scoreEl = qEl("quizScore");
    if (scoreEl) scoreEl.textContent = String(quizState.score);
}

/**
 * Moves to the next question in the quiz.
 */
function quizNext() {
    if (quizState.idx < quizState.order.length) quizState.idx += 1;
    quizRender();
}

/**
 * Restarts the quiz.
 */
function quizRestart() {
    const pool = [...QUIZ_QUESTIONS];
    shuffleInPlace(pool);

    quizState.total = pool.length;
    quizState.order = pool.slice(0, quizState.total);
    quizState.idx = 0;
    quizState.score = 0;
    quizState.locked = false;

    quizSetBadge("Warm up");
    quizRender();
}

/**
 * Wires up the quiz UI events.
 */
function wireQuiz() {
    const btnNext = qEl("btnQuizNext");
    const btnRestart = qEl("btnQuizRestart");
    const btnHome = qEl("btnQuizHome");

    if (btnNext) btnNext.onclick = quizNext;
    if (btnRestart) btnRestart.onclick = quizRestart;
    if (btnHome) btnHome.onclick = () => (location.hash = "#home");

    quizRestart();
}
