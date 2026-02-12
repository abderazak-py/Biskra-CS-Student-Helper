// ===================== KHETMA HELPER =====================

/**
 * Type definition for Khetma object
 * @typedef {Object} Khetma
 * @property {string} id - Unique identifier
 * @property {string} title - Title of the khetma
 * @property {Date} createdAt - Creation date
 * @property {Date} startDate - Start date of the khetma
 * @property {number} targetDays - Number of target days
 * @property {number} sessionsPerDay - Sessions per day (1-10)
 * @property {Array<DayPlan>} plan - Array of day plans
 * @property {number} completedJuzTotal - Total completed juz
 * @property {Date} lastUpdatedAt - Last updated date
 */

/**
 * Type definition for DayPlan object
 * @typedef {Object} DayPlan
 * @property {number} dayIndex - Day index (1..targetDays)
 * @property {Date} date - Date for the day
 * @property {number} assignedJuz - Number of juz assigned for the day
 * @property {number} completedJuz - Number of juz completed for the day
 * @property {'pending'|'done'|'skipped'} status - Status of the day
 */

// Constants
const TOTAL_JUZ = 30;

/**
 * Generates a schedule that divides 30 Juz across targetDays as evenly as possible
 * @param {number} targetDays - Number of target days
 * @param {Date} startDate - Start date
 * @returns {Array<DayPlan>} Array of day plans
 */
function generateSchedule(targetDays, startDate) {
    const total = TOTAL_JUZ;
    const base = Math.floor(total / targetDays);
    const extra = total % targetDays;
    
    const plan = [];
    let currentDate = new Date(startDate);
    currentDate.setHours(0, 0, 0, 0); // Normalize time
    
    for (let i = 1; i <= targetDays; i++) {
        const assignedJuz = base + (i <= extra ? 1 : 0);
        
        plan.push({
            dayIndex: i,
            date: new Date(currentDate),
            assignedJuz: assignedJuz,
            completedJuz: 0,
            status: 'pending'
        });
        
        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return plan;
}

/**
 * Creates a new khetma
 * @param {string} title - Title of the khetma
 * @param {Date} startDate - Start date
 * @param {number} targetDays - Target days (1-365)
 * @param {number} sessionsPerDay - Sessions per day (1-10)
 * @returns {Khetma} New khetma object
 */
function createKhetma(title, startDate, targetDays, sessionsPerDay = 1) {
    const id = 'khetma_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    return {
        id,
        title: title || `Khetma #${Date.now()}`,
        createdAt: new Date(),
        startDate: new Date(startDate),
        targetDays,
        sessionsPerDay: sessionsPerDay || 1,
        plan: generateSchedule(targetDays, startDate),
        completedJuzTotal: 0,
        lastUpdatedAt: new Date()
    };
}

/**
 * Updates a day's completion status
 * @param {Khetma} khetma - The khetma to update
 * @param {number} dayIndex - Index of the day to update
 * @param {number} completedJuz - Number of completed juz for the day
 * @param {'pending'|'done'|'skipped'} status - Status of the day
 * @returns {Khetma} Updated khetma
 */
function updateDayCompletion(khetma, dayIndex, completedJuz, status) {
    const dayPlan = khetma.plan.find(d => d.dayIndex === dayIndex);
    if (!dayPlan) return khetma;
    
    // Validate completedJuz doesn't exceed assignedJuz
    if (completedJuz > dayPlan.assignedJuz) {
        completedJuz = dayPlan.assignedJuz;
    }
    
    // Update the day plan
    dayPlan.completedJuz = completedJuz;
    dayPlan.status = status;
    
    // Recalculate total completed juz
    khetma.completedJuzTotal = khetma.plan.reduce((sum, day) => {
        return sum + day.completedJuz;
    }, 0);
    
    khetma.lastUpdatedAt = new Date();
    return khetma;
}

/**
 * Skips a day in the khetma
 * @param {Khetma} khetma - The khetma to update
 * @param {number} dayIndex - Index of the day to skip
 * @returns {Khetma} Updated khetma
 */
function skipDay(khetma, dayIndex) {
    const dayPlan = khetma.plan.find(d => d.dayIndex === dayIndex);
    if (!dayPlan) return khetma;
    
    dayPlan.status = 'skipped';
    dayPlan.completedJuz = 0;
    
    // Recalculate total completed juz
    khetma.completedJuzTotal = khetma.plan.reduce((sum, day) => {
        return sum + day.completedJuz;
    }, 0);
    
    khetma.lastUpdatedAt = new Date();
    return khetma;
}

/**
 * Regenerates the schedule for a khetma with a new target days count
 * Preserves completed juz as much as possible
 * @param {Khetma} khetma - The khetma to update
 * @param {number} newTargetDays - New target days
 * @returns {Khetma} Updated khetma
 */
function regenerateSchedule(khetma, newTargetDays) {
    // Save the current completed juz total
    const completedJuzTotal = khetma.completedJuzTotal;
    
    // Generate new schedule
    const newPlan = generateSchedule(newTargetDays, khetma.startDate);
    
    // Calculate how many juz have been completed
    let remainingToAssign = completedJuzTotal;
    
    // Assign completed juz to days in order until completedJuzTotal is allocated
    for (let i = 0; i < newPlan.length && remainingToAssign > 0; i++) {
        const dayPlan = newPlan[i];
        const canComplete = Math.min(dayPlan.assignedJuz, remainingToAssign);
        
        dayPlan.completedJuz = canComplete;
        dayPlan.status = canComplete > 0 ? 'done' : 'pending';
        
        remainingToAssign -= canComplete;
    }
    
    // Update khetma with new plan
    khetma.targetDays = newTargetDays;
    khetma.plan = newPlan;
    khetma.lastUpdatedAt = new Date();
    
    return khetma;
}

/**
 * Calculates streak (consecutive days completed)
 * @param {Khetma} khetma - The khetma to calculate streak for
 * @returns {number} Current streak
 */
function calculateStreak(khetma) {
    if (!khetma.plan || khetma.plan.length === 0) return 0;
    
    let streak = 0;
    // Go backwards from the most recent day
    for (let i = khetma.plan.length - 1; i >= 0; i--) {
        const day = khetma.plan[i];
        if (day.status === 'done') {
            streak++;
        } else if (day.status === 'pending' && day.completedJuz > 0) {
            // Partial completion still counts as part of streak
            streak++;
        } else if (day.status === 'skipped') {
            // Skip days break the streak
            break;
        } else {
            // Pending with 0 completed breaks the streak
            break;
        }
    }
    
    return streak;
}

/**
 * Gets today's task for a khetma
 * @param {Khetma} khetma - The khetma
 * @returns {DayPlan|null} Today's day plan or null if not applicable
 */
function getTodaysTask(khetma) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return khetma.plan.find(day => {
        const dayDate = new Date(day.date);
        dayDate.setHours(0, 0, 0, 0);
        return dayDate.getTime() === today.getTime();
    }) || null;
}

/**
 * Calculates progress percentage
 * @param {Khetma} khetma - The khetma
 * @returns {number} Progress percentage
 */
function calculateProgressPercentage(khetma) {
    if (khetma.completedJuzTotal >= TOTAL_JUZ) return 100;
    return Math.round((khetma.completedJuzTotal / TOTAL_JUZ) * 100);
}

/**
 * Loads khetmas from storage
 * @returns {Array<Khetma>} Array of khetmas
 */
function loadKhetmas() {
    const state = loadState();
    const khetmas = state.khetmas || [];
    
    // Convert date strings back to Date objects
    return khetmas.map(k => ({
        ...k,
        createdAt: new Date(k.createdAt),
        startDate: new Date(k.startDate),
        lastUpdatedAt: new Date(k.lastUpdatedAt),
        plan: k.plan.map(p => ({
            ...p,
            date: new Date(p.date)
        }))
    }));
}

/**
 * Saves khetmas to storage
 * @param {Array<Khetma>} khetmas - Array of khetmas to save
 */
function saveKhetmas(khetmas) {
    // Convert Date objects to strings for storage
    const serializableKhetmas = khetmas.map(k => ({
        ...k,
        createdAt: k.createdAt.toISOString(),
        startDate: k.startDate.toISOString(),
        lastUpdatedAt: k.lastUpdatedAt.toISOString(),
        plan: k.plan.map(p => ({
            ...p,
            date: p.date.toISOString()
        }))
    }));
    
    const state = loadState();
    state.khetmas = serializableKhetmas;
    saveState(state);
}

/**
 * Deletes a khetma
 * @param {string} khetmaId - ID of the khetma to delete
 */
function deleteKhetma(khetmaId) {
    const khetmas = loadKhetmas();
    const filteredKhetmas = khetmas.filter(k => k.id !== khetmaId);
    saveKhetmas(filteredKhetmas);
}

// UI Functions
/**
 * Initializes the khetma helper UI
 */
function initKhetmaHelper() {
    // Check if the khetma page element exists
    const khetmaPageElement = document.getElementById('pagekhetma');
    
    // Check current route using the new routing system
    const isOnKhetmaPage = window.location.pathname === '/khetma' || 
                          (window.location.pathname === '/' && document.querySelector('#pagekhetma.active'));
    
    // Initialize immediately if on the khetma page or if the page element exists
    if (isOnKhetmaPage || khetmaPageElement) {
        setTimeout(() => {
            renderKhetmaList();
        }, 10);
    }
    
    // Set up event listeners for the add button on any page
    setupEventListeners();
    
    // Since we're using History API now, we no longer listen for hashchange
    // Instead, we rely on the router to call initKhetmaHelper when navigating to the khetma page
}

/**
 * Sets up event listeners for the khetma helper
 */
function setupEventListeners() {
    // Add event listener for adding new khetma
    const addKhetmaBtn = document.getElementById('addKhetmaBtn');
    if (addKhetmaBtn) {
        addKhetmaBtn.addEventListener('click', () => showAddKhetmaModal());
    }
}

/**
 * Shows the add khetma modal
 */
function showAddKhetmaModal() {
    const modalHtml = `
        <div id="khetmaModal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Add New Khetma</h3>
                    <button id="closeKhetmaModal" class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="khetmaForm">
                        <div class="form-group">
                            <label for="khetmaTitle">Title:</label>
                            <input type="text" id="khetmaTitle" placeholder="e.g., Ramadan Khetma" />
                        </div>
                        
                        <div class="form-group">
                            <label for="khetmaStartDate">Start Date:</label>
                            <input type="date" id="khetmaStartDate" />
                        </div>
                        
                        <div class="form-group">
                            <label for="khetmaTargetDays">Target Days (1-365):</label>
                            <input type="number" id="khetmaTargetDays" min="1" max="365" value="30" />
                        </div>
                        
                        <div class="form-group">
                            <label for="khetmaSessionsPerDay">Sessions Per Day (1-10, optional):</label>
                            <input type="number" id="khetmaSessionsPerDay" min="1" max="10" value="1" />
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Create Khetma</button>
                            <button type="button" id="cancelKhetma" class="btn btn-secondary">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to the body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Wait for the element to be added to the DOM and then set the date and attach events
    setTimeout(() => {
        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('khetmaStartDate');
        if (dateInput) {
            dateInput.value = today;
        }
        
        // Setup event listeners for the modal
        const closeBtn = document.getElementById('closeKhetmaModal');
        const cancelBtn = document.getElementById('cancelKhetma');
        const form = document.getElementById('khetmaForm');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', hideKhetmaModal);
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', hideKhetmaModal);
        }
        
        // Handle form submission with proper event handling
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const title = document.getElementById('khetmaTitle').value.trim();
                const startDate = new Date(document.getElementById('khetmaStartDate').value);
                const targetDays = parseInt(document.getElementById('khetmaTargetDays').value);
                const sessionsPerDay = parseInt(document.getElementById('khetmaSessionsPerDay').value) || 1;
                
                if (targetDays < 1 || targetDays > 365) {
                    alert('Target days must be between 1 and 365');
                    return;
                }
                
                if (isNaN(targetDays) || isNaN(sessionsPerDay)) {
                    alert('Please enter valid numbers for target days and sessions per day');
                    return;
                }
                
                if (sessionsPerDay < 1 || sessionsPerDay > 10) {
                    alert('Sessions per day must be between 1 and 10');
                    return;
                }
                
                // Create new khetma
                const newKhetma = createKhetma(title, startDate, targetDays, sessionsPerDay);
                
                // Load existing khetmas and add the new one
                const khetmas = loadKhetmas();
                khetmas.push(newKhetma);
                saveKhetmas(khetmas);
                
                // Hide modal and refresh the list
                hideKhetmaModal();
                renderKhetmaList();
                
                return false;
            });
        }
    }, 0); // Using 0 timeout to ensure DOM is updated
}

/**
 * Hides the khetma modal
 */
function hideKhetmaModal() {
    const modal = document.getElementById('khetmaModal');
    if (modal) {
        modal.remove();
    }
}

/**
 * Renders the khetma list
 */
function renderKhetmaList() {
    const pageElement = document.getElementById('pagekhetma');
    if (!pageElement) return;
    
    const khetmas = loadKhetmas();
    
    let khetmasHtml = '';
    
    if (khetmas.length === 0) {
        khetmasHtml = `
            <div class="empty-state">
                <h3>No Khetmas Yet</h3>
                <p>Create your first Khetma to start tracking your Quran completion plan.</p>
                <button id="addKhetmaBtn" class="btn btn-primary">Add Your First Khetma</button>
            </div>
        `;
    } else {
        khetmasHtml = `
            <div class="khetma-header">
                <h2>Khetma Helper</h2>
                <button id="addKhetmaBtn" class="btn btn-primary">Add Khetma</button>
            </div>
            <div class="khetma-grid">
                ${khetmas.map(khetma => renderKhetmaCard(khetma)).join('')}
            </div>
        `;
    }
    
    pageElement.innerHTML = khetmasHtml;
    
    // Add event listeners for the add button first
    const addKhetmaBtn = document.getElementById('addKhetmaBtn');
    if (addKhetmaBtn) {
        addKhetmaBtn.addEventListener('click', () => showAddKhetmaModal());
    }
    
    // Add click handlers for khetma cards
    khetmas.forEach(khetma => {
        const card = document.getElementById(`khetma-card-${khetma.id}`);
        if (card) {
            card.addEventListener('click', () => {
                renderKhetmaDetail(khetma.id);
            });
            
            // Add delete button handler
            const deleteBtn = document.getElementById(`delete-khetma-${khetma.id}`);
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent triggering card click
                    showDeleteConfirmation(khetma);
                });
            }
        }
    });
}

/**
 * Shows a delete confirmation modal
 * @param {Khetma} khetma - The khetma to delete
 */
function showDeleteConfirmation(khetma) {
    // Remove any existing modals first
    const existingModal = document.getElementById('deleteConfirmModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modalHtml = `
        <div id="deleteConfirmModal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Delete Confirmation</h3>
                    <button id="closeDeleteModal" class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to delete "<strong>${khetma.title}</strong>"?</p>
                    <p>This action will remove the khetma and all its progress. This cannot be undone.</p>
                </div>
                <div class="form-actions">
                    <button id="confirmDeleteBtn" class="btn btn-danger">Delete</button>
                    <button id="cancelDeleteBtn" class="btn btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to the body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Setup event listeners
    document.getElementById('closeDeleteModal').addEventListener('click', hideDeleteModal);
    document.getElementById('cancelDeleteBtn').addEventListener('click', hideDeleteModal);
    document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
        deleteKhetma(khetma.id);
        renderKhetmaList();
        hideDeleteModal();
    });
    
    // Close modal when clicking outside
    document.getElementById('deleteConfirmModal').addEventListener('click', function(e) {
        if (e.target === this) {
            hideDeleteModal();
        }
    });
    
    // Close modal when pressing escape
    const handleEscKey = function(e) {
        if (e.key === 'Escape') {
            hideDeleteModal();
        }
    };
    
    document.addEventListener('keydown', handleEscKey);
    
    // Store reference to handle removal
    hideDeleteModal.handler = handleEscKey;
}

/**
 * Hides the delete confirmation modal
 */
function hideDeleteModal() {
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) {
        modal.remove();
    }
    
    // Remove the event listener if it was added
    if (hideDeleteModal.handler) {
        document.removeEventListener('keydown', hideDeleteModal.handler);
        delete hideDeleteModal.handler;
    }
}

/**
 * Renders a khetma card
 * @param {Khetma} khetma - The khetma to render
 * @returns {string} HTML for the khetma card
 */
function renderKhetmaCard(khetma) {
    const progressPercentage = calculateProgressPercentage(khetma);
    const streak = calculateStreak(khetma);
    const todaysTask = getTodaysTask(khetma);
    
    return `
        <div class="khetma-card" id="khetma-card-${khetma.id}">
            <div class="khetma-card-header">
                <h3>${khetma.title}</h3>
                <button id="delete-khetma-${khetma.id}" class="btn-delete" title="Delete Khetma">✕</button>
            </div>
            
            <div class="progress-container">
                <div class="progress-text">${progressPercentage}% (${khetma.completedJuzTotal}/30 Juz)</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercentage}%;"></div>
                </div>
            </div>
            
            <div class="khetma-stats">
                <div class="stat">
                    <div class="stat-value">${streak}</div>
                    <div class="stat-label">Day Streak</div>
                </div>
                
                <div class="stat">
                    <div class="stat-value">${todaysTask ? todaysTask.assignedJuz : 'N/A'}</div>
                    <div class="stat-label">Today's Task</div>
                </div>
            </div>
            
            <div class="khetma-actions">
                <button class="btn btn-small">View Details</button>
            </div>
        </div>
    `;
}

/**
 * Renders the khetma detail view
 * @param {string} khetmaId - ID of the khetma to render
 */
function renderKhetmaDetail(khetmaId) {
    const khetmas = loadKhetmas();
    const khetma = khetmas.find(k => k.id === khetmaId);
    
    if (!khetma) {
        console.error('Khetma not found:', khetmaId);
        return;
    }
    
    const pageElement = document.getElementById('pagekhetma');
    if (!pageElement) return;
    
    const progressPercentage = calculateProgressPercentage(khetma);
    const streak = calculateStreak(khetma);
    
    // Format dates nicely
    const startDateStr = formatDate(khetma.startDate);
    const endDate = new Date(khetma.startDate);
    endDate.setDate(endDate.getDate() + khetma.targetDays - 1);
    const endDateStr = formatDate(endDate);
    
    pageElement.innerHTML = `
        <div class="khetma-detail">
            <div class="detail-header">
                <a href="#khetma" class="back-link">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Back to List
                </a>
                <h2>${khetma.title}</h2>
                <div class="detail-summary">
                    <div class="summary-item">
                        <span class="summary-label">Progress:</span>
                        <span class="summary-value">${progressPercentage}% (${khetma.completedJuzTotal}/30 Juz)</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Streak:</span>
                        <span class="summary-value">${streak} days</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Duration:</span>
                        <span class="summary-value">${khetma.targetDays} days (${startDateStr} to ${endDateStr})</span>
                    </div>
                </div>
            </div>
            
            <div class="progress-container">
                <div class="progress-bar large">
                    <div class="progress-fill" style="width: ${progressPercentage}%;"></div>
                </div>
                <div class="progress-text">${progressPercentage}% Complete</div>
            </div>
            
            <div class="khetma-plan-controls">
                <button id="regenerate-btn" class="btn btn-secondary">Regenerate Schedule</button>
            </div>
            
            <div class="khetma-days-list">
                <h3>Plan Timeline</h3>
                <table class="days-table">
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>Date</th>
                            <th>Assigned Juz</th>
                            <th>Completed</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${khetma.plan.map(day => renderDayRow(khetma, day)).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    // Add event listeners for day actions
    khetma.plan.forEach(day => {
        // Mark as done button
        const markDoneBtn = document.getElementById(`mark-done-${khetma.id}-${day.dayIndex}`);
        if (markDoneBtn) {
            markDoneBtn.addEventListener('click', () => {
                const updatedKhetma = updateDayCompletion(khetma, day.dayIndex, day.assignedJuz, 'done');
                updateKhetmaInStorage(updatedKhetma);
                renderKhetmaDetail(updatedKhetma.id);
            });
        }
        
        // Mark as pending button
        const markPendingBtn = document.getElementById(`mark-pending-${khetma.id}-${day.dayIndex}`);
        if (markPendingBtn) {
            markPendingBtn.addEventListener('click', () => {
                const updatedKhetma = updateDayCompletion(khetma, day.dayIndex, 0, 'pending');
                updateKhetmaInStorage(updatedKhetma);
                renderKhetmaDetail(updatedKhetma.id);
            });
        }
        
        // Skip day button
        const skipBtn = document.getElementById(`skip-day-${khetma.id}-${day.dayIndex}`);
        if (skipBtn) {
            skipBtn.addEventListener('click', () => {
                const updatedKhetma = skipDay(khetma, day.dayIndex);
                updateKhetmaInStorage(updatedKhetma);
                renderKhetmaDetail(updatedKhetma.id);
            });
        }
        
        // Partial completion input
        const partialInput = document.getElementById(`partial-completion-${khetma.id}-${day.dayIndex}`);
        if (partialInput) {
            partialInput.addEventListener('change', (e) => {
                const value = Math.max(0, Math.min(parseInt(e.target.value) || 0, day.assignedJuz));
                const status = value === day.assignedJuz ? 'done' : 'pending';
                const updatedKhetma = updateDayCompletion(khetma, day.dayIndex, value, status);
                updateKhetmaInStorage(updatedKhetma);
                renderKhetmaDetail(updatedKhetma.id);
            });
        }
    });
    
    // Add regenerate button handler
    const regenerateBtn = document.getElementById('regenerate-btn');
    if (regenerateBtn) {
        regenerateBtn.addEventListener('click', () => {
            const newTargetDays = prompt(`Enter new target days (current: ${khetma.targetDays}):`, khetma.targetDays);
            const newTargetDaysNum = parseInt(newTargetDays);
            
            if (newTargetDaysNum && newTargetDaysNum >= 1 && newTargetDaysNum <= 365) {
                const updatedKhetma = regenerateSchedule(khetma, newTargetDaysNum);
                updateKhetmaInStorage(updatedKhetma);
                renderKhetmaDetail(updatedKhetma.id);
            } else if (newTargetDays !== null) {
                alert('Invalid number. Please enter a number between 1 and 365.');
            }
        });
    }
}

/**
 * Updates a khetma in storage
 * @param {Khetma} updatedKhetma - The updated khetma
 */
function updateKhetmaInStorage(updatedKhetma) {
    const khetmas = loadKhetmas();
    const index = khetmas.findIndex(k => k.id === updatedKhetma.id);
    if (index !== -1) {
        khetmas[index] = updatedKhetma;
        saveKhetmas(khetmas);
    }
}

/**
 * Renders a day row for the timeline table
 * @param {Khetma} khetma - The parent khetma
 * @param {DayPlan} day - The day to render
 * @returns {string} HTML for the day row
 */
function renderDayRow(khetma, day) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayDate = new Date(day.date);
    dayDate.setHours(0, 0, 0, 0);
    const isToday = dayDate.getTime() === today.getTime();
    const isPast = dayDate < today;
    
    const dayClasses = ['day-row'];
    if (isToday) dayClasses.push('today');
    if (day.status === 'done') dayClasses.push('completed');
    else if (day.status === 'skipped') dayClasses.push('skipped');
    
    return `
        <tr class="${dayClasses.join(' ')}">
            <td>Day ${day.dayIndex}</td>
            <td>${formatDate(day.date)}</td>
            <td>${day.assignedJuz} Juz</td>
            <td>
                <input 
                    type="number" 
                    id="partial-completion-${khetma.id}-${day.dayIndex}"
                    class="partial-input" 
                    min="0" 
                    max="${day.assignedJuz}" 
                    value="${day.completedJuz}" 
                    ${day.status === 'done' || day.status === 'skipped' ? 'disabled' : ''}>
            </td>
            <td class="status-cell">
                <span class="status-badge ${day.status}">${getStatusText(day.status)}</span>
            </td>
            <td class="actions-cell">
                ${day.status !== 'done' ? `<button id="mark-done-${khetma.id}-${day.dayIndex}" class="btn btn-small btn-success">Mark Done</button>` : ''}
                ${day.status !== 'pending' ? `<button id="mark-pending-${khetma.id}-${day.dayIndex}" class="btn btn-small btn-warning">Mark Pending</button>` : ''}
                ${day.status !== 'skipped' ? `<button id="skip-day-${khetma.id}-${day.dayIndex}" class="btn btn-small btn-danger">Skip</button>` : ''}
            </td>
        </tr>
    `;
}

/**
 * Gets the display text for a status
 * @param {'pending'|'done'|'skipped'} status - The status
 * @returns {string} Display text
 */
function getStatusText(status) {
    switch (status) {
        case 'done': return 'Completed';
        case 'skipped': return 'Skipped';
        case 'pending': return 'Pending';
        default: return status;
    }
}

/**
 * Formats a date as a readable string
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createKhetma,
        generateSchedule,
        updateDayCompletion,
        skipDay,
        regenerateSchedule,
        calculateStreak,
        getTodaysTask,
        calculateProgressPercentage,
        TOTAL_JUZ
    };
}

// Debug function to test functionality
function debugKhetma() {
    console.log('Debug: Testing khetma functionality...');
    console.log('Available functions: createKhetma, generateSchedule, loadKhetmas, saveKhetmas');
    console.log('Current khetmas in storage:', loadKhetmas());
    console.log('TOTAL_JUZ constant:', TOTAL_JUZ);
}
