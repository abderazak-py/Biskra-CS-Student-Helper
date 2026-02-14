// ===================== BOOT (main app) =====================

// Initialize the router to handle navigation between different pages.
initRouter();
// Initialize the pages, setting up the basic structure and elements.
initPages();
// Wire up the persistence for notes, so they are saved and loaded.
wireNotesPersistence();
// Wire up the Pomodoro timer functionality.
wirePomodoro();
// Wire up the quiz functionality.
wireQuiz();
