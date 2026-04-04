// Quiz questions data

export const QUIZ_QUESTIONS = [
    {
        cat: "Basics",
        q: "Which one is a real programming paradigm?",
        options: ["Object-Oriented Programming", "Circle-Oriented Programming", "Keyboard-Oriented Programming"],
        answer: 0,
        exp: "OOP is a real paradigm; the others are jokes.",
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
        cat: "Basics",
        q: "What does 'bug' mean in programming?",
        options: ["A feature", "An error in the code", "A hardware upgrade"],
        answer: 1,
        exp: "A bug is an error or flaw that causes incorrect or unexpected behavior.",
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
        cat: "Algorithms",
        q: "Which algorithm is typically used for finding the shortest path in a weighted graph?",
        options: ["Bubble sort", "Dijkstra's algorithm", "Merge sort"],
        answer: 1,
        exp: "Dijkstra's algorithm finds shortest paths from a source in a weighted graph.",
    },
    {
        cat: "Big-O",
        q: "If an algorithm doubles its steps every time n increases by 1, its complexity is roughly…",
        options: ["O(n)", "O(log n)", "O(2^n)"],
        answer: 2,
        exp: "Doubling with each increment is characteristic of exponential time.",
    },
    {
        cat: "Operating Systems",
        q: "What is a 'thread' in an OS?",
        options: ["A type of cable", "A unit of CPU execution inside a process", "A backup file"],
        answer: 1,
        exp: "A thread is the smallest unit of execution scheduled by the OS.",
    },
    {
        cat: "Networking",
        q: "Which protocol is commonly used to send emails?",
        options: ["SMTP", "FTP", "SSH"],
        answer: 0,
        exp: "SMTP (Simple Mail Transfer Protocol) is used for sending emails.",
    },
    {
        cat: "Databases",
        q: "What does SQL stand for?",
        options: ["Structured Query Language", "Simple Question List", "Sequential Query Logic"],
        answer: 0,
        exp: "SQL is the standard language for working with relational databases.",
    },
    {
        cat: "Security",
        q: "What does 'HTTPS' add on top of HTTP?",
        options: ["More ads", "Encryption and security", "Faster Wi‑Fi"],
        answer: 1,
        exp: "HTTPS uses TLS to encrypt traffic and improve security.",
    },
    {
        cat: "Web",
        q: "HTML is mainly used for…",
        options: ["Structuring web content", "Styling pages", "Running database queries"],
        answer: 0,
        exp: "HTML defines the structure and semantics of web pages.",
    },
    {
        cat: "Git",
        q: "Which command creates a copy of a remote repository on your machine?",
        options: ["git clone", "git copy", "git download"],
        answer: 0,
        exp: "git clone copies an entire remote repo locally.",
    },
    {
        cat: "Programming",
        q: "What is a 'loop' used for?",
        options: ["Repeating code multiple times", "Encrypting files", "Drawing UI only"],
        answer: 0,
        exp: "Loops let you repeat a block of code until a condition changes.",
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
        exp: "The CPU performs most calculations, so it's nicknamed the brain.",
    },
];

// Shuffle array utility
export const shuffleArray = (arr) => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};