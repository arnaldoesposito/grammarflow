const NOTES_KEY_PREFIX = 'grammar_flow_notes_';
const PROGRESS_KEY = 'grammar_flow_progress';
const STATE_KEY = 'grammar_flow_state'; // Legacy, to be removed/ignored
const ANSWERS_KEY = 'grammar_flow_answers';
const SESSION_KEY = 'grammar_flow_session';

console.log("[Script] script.js loading... v1.2 DEBUG");
// alert("Grammar Flow Script Loaded v1.2"); // Visual confirmation for user

// --- Data Configuration ---
const TOPIC_DATA = {
    "a1": [
        { id: "present_simple_be", title: "Present Simple (Be)" },
        { id: "present_simple_verbs", title: "Present Simple (Verbs)" },
        { id: "present_continuous", title: "Present Continuous" },
        { id: "past_simple_be", title: "Past Simple (Be)" },
        { id: "past_simple", title: "Past Simple (Verbs)" },
        { id: "modals_can_could", title: "Modals: Can & Could" },
        { id: "comparatives", title: "Comparatives" },
        { id: "future_going_to", title: "Future: Going to" },
        { id: "articles", title: "Articles" },
        { id: "personal_pronouns", title: "Personal Pronouns" },
        { id: "possessive_adjectives", title: "Possessive Adjectives" },
        { id: "prepositions_time", title: "Prepositions of Time" },
        { id: "prepositions_place", title: "Prepositions of Place" },
        { id: "plural_nouns", title: "Plural Nouns" },
        { id: "question_words", title: "Question Words" }
    ],
    "a2": [
        { id: "present_simple_vs_continuous", title: "Present Simple vs. Continuous" },
        { id: "past_continuous", title: "Past Continuous" },
        { id: "present_perfect", title: "Present Perfect" },
        { id: "present_perfect_vs_past_simple", title: "Present Perfect vs. Past Simple" },
        { id: "future_going_to_a2", title: "Future: Going To" },
        { id: "future_will", title: "Future: Will" },
        { id: "comparatives_superlatives", title: "Comparatives & Superlatives" },
        { id: "modal_can_could", title: "Modals: Can & Could" },
        { id: "modal_should", title: "Modals: Should" },
        { id: "modal_have_to_must", title: "Modals: Have to/Must" },
        { id: "zero_conditional", title: "Zero Conditional" },
        { id: "first_conditional", title: "First Conditional" },
        { id: "quantifiers", title: "Quantifiers" },
        { id: "gerunds_infinitives", title: "Gerunds & Infinitives" },
        { id: "relative_clauses", title: "Relative Clauses" },
        { id: "used_to", title: "Used To" },
        { id: "question_tags", title: "Question Tags" }
    ],
    "b1": [
        { id: "present_perfect_continuous", title: "Present Perfect Continuous" },
        { id: "pp_simple_vs_continuous", title: "Present Perfect: Simple vs. Continuous" },
        { id: "past_perfect_simple", title: "Past Perfect Simple" },
        { id: "past_perfect_vs_past_simple", title: "Past Perfect vs. Past Simple" },
        { id: "future_continuous", title: "Future Continuous" },
        { id: "modals_obligation", title: "Modals of Obligation" },
        { id: "modals_probability", title: "Modals of Probability" },
        { id: "reported_speech", title: "Reported Speech" },
        { id: "passive_voice", title: "Passive Voice" },
        { id: "relative_clauses_defining", title: "Relative Clauses (Defining)" },
        { id: "gerunds_infinitives_complex", title: "Gerunds & Infinitives (Complex)" },
        { id: "conditionals_review_second", title: "Conditionals (0, 1, 2)" },
        { id: "used_to_would", title: "Used To vs. Would" }
    ],
    "b2": [
        { id: "reported_speech_b2", title: "Reported Speech" },
        { id: "passive_voice_b2", title: "Passive Voice" },
        { id: "third_conditional_b2", title: "Third Conditional" },
        { id: "mixed_conditionals_b2", title: "Mixed Conditionals" },
        { id: "past_perfect_continuous_b2", title: "Past Perfect Continuous" },
        { id: "future_perfect_b2", title: "Future Perfect" },
        { id: "causative_verbs_b2", title: "Causative Verbs" },
        { id: "modals_probability_past_b2", title: "Modals of Probability (Past)" },
        { id: "relative_clauses_advanced_b2", title: "Relative Clauses (Advanced)" },
        { id: "gerunds_infinitives_complex_b2", title: "Gerunds & Infinitives (Complex)" },
        { id: "linking_words_contrast_b2", title: "Linking Words (Contrast)" },
        { id: "indirect_questions_b2", title: "Indirect Questions" },
        { id: "inversion_b2", title: "Inversion" }
    ],
    "c1": [
        { id: "c1_inversion_negative", title: "Inversion with Negative Adverbials" },
        { id: "c1_mixed_cond_past_pres", title: "Mixed Cond. (Past/Present)" },
        { id: "c1_mixed_cond_pres_past", title: "Mixed Cond. (Present/Past)" },
        { id: "c1_cleft_sentences", title: "Cleft Sentences" },
        { id: "c1_advanced_passive", title: "Advanced Passive Structures" },
        { id: "c1_passive_get_have", title: "Passive with 'Get' & Causative" },
        { id: "c1_future_in_past", title: "Future in the Past" },
        { id: "c1_modals_deduction_past", title: "Modals of Deduction (Past)" },
        { id: "c1_advanced_gerunds", title: "Advanced Gerunds & Infinitives" },
        { id: "c1_compound_relative", title: "Compound Relative Clauses" },
        { id: "c1_wish_if_only", title: "Wish and If Only" },
        { id: "c1_subjunctive", title: "Subjunctive Mood" }
    ]
};

// State
let lessons = {}; // Will be loaded from JSON
let topicLevels = {}; // Map: "present_continuous" -> "a1"
let currentTopic = 'present_continuous';
let currentLevel = 'explorer';
let currentExerciseIndex = 0;
let availableWords = [];
let currentAnswer = [];
let isTypeMode = false;
let userProgress = {}; // { topicId: { explorer: [0, 1], ... } }
let userAnswers = {}; // { topicId: { level: { index: [wordObj, ...] } } }
let feedbackTimer;

// DOM Elements
const wordBankEl = document.getElementById('word-bank');
const dropZoneEl = document.getElementById('drop-zone');
const typeInputEl = document.getElementById('type-input');
const checkBtn = document.getElementById('check-btn');
const resetBtn = document.getElementById('reset-btn');
const nextBtn = document.getElementById('next-btn');
const hintBtn = document.getElementById('hint-btn');
const showAnswerBtn = document.getElementById('show-answer-btn');
const feedbackEl = document.getElementById('feedback-area');
const levelSelect = document.getElementById('level-select');
const topicSelect = document.getElementById('topic-select');
const lessonSubtitle = document.getElementById('lesson-subtitle');
const quickLessonEl = document.getElementById('quick-lesson');
const challengeTitle = document.getElementById('challenge-title');
const originalText = document.getElementById('original-text');
const modeToggle = document.getElementById('mode-toggle-checkbox');
const exerciseSelect = document.getElementById('exercise-select');
const exerciseCounter = document.getElementById('exercise-counter');
const difficultyTabs = document.querySelectorAll('.diff-tab');
const difficultyContainer = document.querySelector('.difficulty-tabs');
const notesArea = document.getElementById('study-notes');
const saveStatus = document.getElementById('save-status');
const topicPercentageEl = document.getElementById('topic-percentage');
const topicCountEl = document.getElementById('topic-count');
const resetMenuBtn = document.getElementById('reset-menu-btn');
const resetMenu = document.getElementById('reset-menu');
const notesClearMenuBtn = document.getElementById('notes-clear-menu-btn');
const notesClearMenu = document.getElementById('notes-clear-menu');


// --- UI Functions ---

function applyTheme(topicName) {
    document.body.classList.remove('theme-a1', 'theme-a2', 'theme-b1', 'theme-b2', 'theme-c1');
    // Default to A1 if unknown (robustness)
    const level = topicLevels[topicName] || 'a1';
    document.body.classList.add(`theme-${level}`);
    document.body.style.background = '';
}

function populateTopicSelect(level) {
    topicSelect.innerHTML = '';
    const topics = TOPIC_DATA[level];
    if (!topics) return;

    topics.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t.id;
        opt.textContent = t.title;
        topicSelect.appendChild(opt);
    });

    // Smart Selection Logic
    // If currentTopic is valid for this level, keep it. Else, switch to first.
    const validTopic = topics.find(t => t.id === currentTopic);
    if (!validTopic) {
        changeTopic(topics[0].id);
    } else {
        topicSelect.value = currentTopic;
        // Even if we keep the topic, ensures UI is synced
    }
}

// --- Init & Data Loading ---

async function loadLessons() {
    try {
        const manifestRes = await fetch('lessons/manifest.json');
        if (!manifestRes.ok) throw new Error("Failed to load lesson manifest");
        const fileList = await manifestRes.json();

        // Map each file to a promise that resolves with data or rejects with error
        const loadPromises = fileList.map(async (filename) => {
            try {
                const res = await fetch(`lessons/${filename}`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();

                // Simple Schema Validation
                if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
                    throw new Error("Invalid or Empty JSON");
                }

                return { filename, data };
            } catch (err) {
                // Propagate error with filename context for the settled handler
                throw new Error(`${filename}: ${err.message}`);
            }
        });

        const results = await Promise.allSettled(loadPromises);
        const failedFiles = [];

        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                const { filename, data } = result.value;

                // Heuristic Level Detection
                let level = 'a1';
                const fname = filename.toLowerCase();
                if (fname.includes('a2')) level = 'a2';
                else if (fname.includes('b1')) level = 'b1';
                else if (fname.includes('b2')) level = 'b2';
                else if (fname.includes('c1')) level = 'c1';

                Object.assign(lessons, data);

                Object.keys(data).forEach(topicKey => {
                    topicLevels[topicKey] = level;
                });
            } else {
                // Handle Error
                const fname = fileList[index];
                const cleanError = result.reason ? result.reason.message.replace(`${fname}: `, '') : 'Unknown Error';
                console.error(`Failed to load ${fname}:`, result.reason);
                failedFiles.push(`<strong>${fname}</strong>: ${cleanError}`);
            }
        });

        // Visual Feedback for Partial Failures
        if (failedFiles.length > 0) {
            const container = document.querySelector('.lesson-content');
            if (container) {
                const warnDiv = document.createElement('div');
                warnDiv.className = 'load-warning';
                warnDiv.style.backgroundColor = '#fff3cd';
                warnDiv.style.color = '#856404';
                warnDiv.style.border = '1px solid #ffeeba';
                warnDiv.style.padding = '10px';
                warnDiv.style.marginBottom = '15px';
                warnDiv.style.borderRadius = '8px';
                warnDiv.style.fontSize = '0.9rem';
                warnDiv.innerHTML = `⚠️ <strong>Some content failed to load:</strong><br>${failedFiles.join('<br>')}`;
                container.insertBefore(warnDiv, container.firstChild);
            }
        }

    } catch (error) {
        console.error("Critical Load Error:", error);
        // Fallback for critical manifest failure
        quickLessonEl.innerHTML = `<div class="error-box" style="background:#f8d7da; color:#721c24; padding:15px; border-radius:8px;">
            <h3>System Error</h3>
            <p>Could not initialize lessons. Please refresh the page.</p>
            <small>${error.message}</small>
        </div>`;
    }
}

// --- Missing Functions Fix ---

function reset() {
    console.log("[UI] Resetting current exercise");
    const exercises = getExercises();
    if (!exercises || exercises.length === 0) return;
    const exercise = exercises[currentExerciseIndex];

    availableWords = [...exercise.words];
    currentAnswer = [];
    typeInputEl.value = '';

    checkBtn.disabled = false;
    if (isTypeMode) typeInputEl.disabled = false;

    // Clear Feedback
    if (feedbackTimer) clearTimeout(feedbackTimer);
    feedbackEl.style.display = 'none';

    render();
}

function handleNotesClear(scope) {
    if (scope === 'topic') {
        localStorage.removeItem(NOTES_KEY_PREFIX + currentTopic);
        notesArea.value = '';
    } else if (scope === 'all') {
        if (!confirm('Are you sure you want to delete ALL notes for ALL topics?')) return;

        // Proper iteration to avoid key skipping issues if modifying valid loop
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith(NOTES_KEY_PREFIX)) keys.push(k);
        }
        keys.forEach(k => localStorage.removeItem(k));
        notesArea.value = '';
    }
    if (notesClearMenu) notesClearMenu.classList.remove('show');
}

const LAST_LEVEL_KEY = 'grammar_flow_last_level';
const LAST_TOPIC_KEY = 'grammar_flow_last_topic';

async function init() {
    // Event Listeners
    checkBtn.addEventListener('click', checkAnswer);
    resetBtn.addEventListener('click', reset);
    nextBtn.addEventListener('click', nextExercise);
    hintBtn.addEventListener('click', toggleHint);
    showAnswerBtn.addEventListener('click', toggleShowAnswer);

    levelSelect.addEventListener('change', (e) => populateTopicSelect(e.target.value));
    topicSelect.addEventListener('change', (e) => changeTopic(e.target.value));

    modeToggle.addEventListener('change', (e) => toggleMode(e.target.checked));
    exerciseSelect.addEventListener('change', (e) => jumpToExercise(parseInt(e.target.value)));

    difficultyTabs.forEach(tab => {
        tab.addEventListener('click', () => changeDifficulty(tab.dataset.level));
    });

    notesArea.addEventListener('input', debounce(saveNotes, 1000));
    typeInputEl.addEventListener('input', debounce(saveCurrentAnswer, 500));

    // Manual Save
    const manualSaveBtn = document.getElementById('manual-save-btn');
    if (manualSaveBtn) {
        manualSaveBtn.addEventListener('click', () => {
            saveState();
            alert("Progress Saved! 💾");
        });
    }

    // Menus
    resetMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        resetMenu.classList.toggle('show');
    });
    notesClearMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notesClearMenu.classList.toggle('show');
    });
    document.addEventListener('click', () => {
        resetMenu.classList.remove('show');
        notesClearMenu.classList.remove('show');
    });

    // Reset Button (New Icon)
    resetBtn.addEventListener('click', () => handleResetAction('question'));

    document.querySelectorAll('[data-clear-notes]').forEach(btn => {
        btn.addEventListener('click', (e) => handleNotesClear(e.target.dataset.clearNotes));
    });
    document.querySelectorAll('[data-reset]').forEach(btn => {
        btn.addEventListener('click', (e) => handleResetAction(e.target.dataset.reset));
    });
    feedbackEl.addEventListener('click', () => {
        feedbackEl.style.display = 'none';
        clearTimeout(feedbackTimer);
    });

    // 1. Load Data
    loadLocalData();
    await loadLessons();

    // --- Header Scroll Effect ---
    const header = document.getElementById('site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Dashboard Toggle ---
    const dashboardToggleBtn = document.getElementById('dashboard-toggle-btn');
    const dashboardPanel = document.getElementById('dashboard-details-panel');
    const dashboardChevron = document.getElementById('dashboard-chevron');

    if (dashboardToggleBtn && dashboardPanel) {
        dashboardToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = dashboardPanel.classList.contains('open');
            dashboardPanel.classList.toggle('open', !isOpen);
            if (dashboardChevron) dashboardChevron.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!dashboardPanel.contains(e.target) && !dashboardToggleBtn.contains(e.target)) {
                dashboardPanel.classList.remove('open');
                if (dashboardChevron) dashboardChevron.style.transform = 'rotate(0deg)';
            }
        });
    }

    // 2. Determine Start State
    let startLevel = 'a1';
    let startTopic = TOPIC_DATA.a1[0].id;
    let savedDifficulty = 'explorer';
    let savedIndex = 0;

    // Deep Linking
    const urlParams = new URLSearchParams(window.location.search);
    const linkLevel = urlParams.get('level');
    const linkTopic = urlParams.get('topic');
    let deepLinkFound = false;

    if (linkLevel && TOPIC_DATA[linkLevel]) {
        startLevel = linkLevel;
        if (linkTopic && TOPIC_DATA[startLevel].find(t => t.id === linkTopic)) {
            startTopic = linkTopic;
        } else {
            startTopic = TOPIC_DATA[startLevel][0].id;
        }
        deepLinkFound = true;
        console.log("[Init] Deep Link Loaded:", startLevel, startTopic);
    }

    // Session Restore (only if not deep linking)
    const savedSessionJson = localStorage.getItem(SESSION_KEY);

    if (!deepLinkFound && savedSessionJson) {
        try {
            const session = JSON.parse(savedSessionJson);

            // Validate and restore Level
            if (session.level && TOPIC_DATA[session.level]) {
                startLevel = session.level;
            }

            // Validate and restore Topic
            if (session.topic && TOPIC_DATA[startLevel].find(t => t.id === session.topic)) {
                startTopic = session.topic;
            } else {
                startTopic = TOPIC_DATA[startLevel][0].id;
            }

            // Restore Difficulty
            if (session.difficulty) {
                savedDifficulty = session.difficulty;
            }

            // Restore Exercise Index
            if (typeof session.exerciseIndex === 'number') {
                savedIndex = session.exerciseIndex;
            }

        } catch (e) {
            console.warn("Failed to parse session:", e);
        }
    }

    // Apply restored state to globals
    // IMPORTANT: Set currentTopic *before* populateTopicSelect
    currentLevel = savedDifficulty;
    currentTopic = startTopic;
    currentExerciseIndex = savedIndex;

    // 3. Sync UI
    isInitializing = true;

    levelSelect.value = startLevel;
    populateTopicSelect(startLevel);

    // Explicitly set topic if different from default first option
    if (topicSelect.value !== startTopic) {
        topicSelect.value = startTopic;
    }

    // 4. Update URL to reflect current state (or clean up deep link param order)
    updateURL();

    // Sync Difficulty Tabs
    difficultyTabs.forEach(tab => {
        const isActive = tab.dataset.level === currentLevel;
        tab.classList.toggle('active', isActive);
    });

    // 4. Render
    applyTheme(currentTopic);
    renderProgressDashboard(); // Initialize global progress
    await loadTopic(currentTopic);

    // Done initializing
    isInitializing = false;
}


// --- Core Logic ---
let isInitializing = false;

function saveSession() {
    if (isInitializing) return;

    // Always derive level from current topic to be safe
    const trueLevel = topicLevels[currentTopic] || 'a1';

    const session = {
        level: trueLevel,
        topic: currentTopic,
        difficulty: currentLevel,
        exerciseIndex: currentExerciseIndex
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

async function changeTopic(topicId) {
    const newLevel = topicLevels[topicId] || 'a1';

    // 1. Update State First
    currentTopic = topicId;

    // 2. Sync UI: Level & Topic Selects
    if (levelSelect.value !== newLevel) {
        // Switch Level
        levelSelect.value = newLevel;
        // Repopulate options (this uses currentTopic to set the correct selected option)
        populateTopicSelect(newLevel);
    } else {
        // Same Level: Just update the topic dropdown value
        topicSelect.value = topicId;
    }

    saveSession();

    currentExerciseIndex = 0;
    currentLevel = 'explorer';

    applyTheme(topicId);
    loadLocalNotes();
    updateURL();
    await loadTopic(topicId);
}

function updateURL() {
    const url = new URL(window.location);
    url.searchParams.set('level', topicLevels[currentTopic] || 'a1');
    url.searchParams.set('topic', currentTopic);
    window.history.pushState({}, '', url);
}

function changeDifficulty(level) {
    currentLevel = level;
    saveSession();
    difficultyTabs.forEach(tab => tab.classList.toggle('active', tab.dataset.level === level));
    currentExerciseIndex = 0;
    loadTopic(currentTopic);
}

function loadTopic(topicId) {
    const lesson = lessons[topicId];
    if (!lesson) {
        console.warn(`Lesson content for ${topicId} not found.`);
        return;
    }

    lessonSubtitle.innerHTML = lesson.subtitle;
    quickLessonEl.innerHTML = lesson.quickLesson;

    // Difficulty Tabs logic
    if (lesson.levels) {
        difficultyContainer.style.display = 'flex';
    } else {
        difficultyContainer.style.display = 'none';
    }

    updateExerciseNav();
    updateDashboard();
    loadExercise();
}

function getExercises() {
    const lesson = lessons[currentTopic];
    if (!lesson) return [];
    if (lesson.levels) return lesson.levels[currentLevel] || [];
    return lesson.exercises || [];
}

function loadExercise() {
    const exercises = getExercises();
    if (!exercises || exercises.length === 0) return;

    // Safety check index
    if (currentExerciseIndex >= exercises.length) currentExerciseIndex = 0;

    const exercise = exercises[currentExerciseIndex];

    // UI Sync
    exerciseSelect.value = currentExerciseIndex;
    challengeTitle.textContent = `Challenge #${currentExerciseIndex + 1}`;
    originalText.innerHTML = exercise.original;

    // Restore Work
    const savedLink = getSavedAnswerLink();

    // Default: Clear logic
    // If savedLink exists, restore details
    // simplified for brevity:
    if (savedLink) {
        if (typeof savedLink === 'string') {
            // Type Mode
            if (!isTypeMode) toggleMode(true);
            typeInputEl.value = savedLink;
            availableWords = [...exercise.words];
            currentAnswer = [];
        } else {
            // Block Mode
            if (isTypeMode) toggleMode(false);
            currentAnswer = [...savedLink];
            const usedIds = new Set(currentAnswer.map(w => w.id));
            availableWords = exercise.words.filter(w => !usedIds.has(w.id));
            typeInputEl.value = '';
        }
    } else {
        // Fresh
        if (isTypeMode) toggleMode(false); // Reset to blocks default
        availableWords = [...exercise.words];
        currentAnswer = [];
        typeInputEl.value = '';
    }

    // Clear Feedback
    if (feedbackTimer) clearTimeout(feedbackTimer);
    feedbackEl.style.display = 'none';
    checkBtn.disabled = false;
    checkBtn.disabled = false;
    nextBtn.disabled = true;
    nextBtn.classList.remove('active');
    if (isTypeMode) typeInputEl.disabled = false;

    render();
}

function render() {
    wordBankEl.innerHTML = '';
    dropZoneEl.innerHTML = currentAnswer.length === 0 ? '<span class="placeholder">Click words to build the sentence...</span>' : '';

    availableWords.forEach(word => wordBankEl.appendChild(createWordBlock(word, false)));
    currentAnswer.forEach(word => dropZoneEl.appendChild(createWordBlock(word, true)));
}

function createWordBlock(word, isAnswer) {
    const btn = document.createElement('div');
    btn.className = 'word-block';
    btn.textContent = word.text;
    btn.addEventListener('click', () => {
        if (!isTypeMode) handleWordClick(word, isAnswer);
    });
    return btn;
}

function handleWordClick(word, isAnswer) {
    if (isAnswer) {
        currentAnswer = currentAnswer.filter(w => w.id !== word.id);
        availableWords.push(word);
    } else {
        availableWords = availableWords.filter(w => w.id !== word.id);
        currentAnswer.push(word);
    }
    saveCurrentAnswer();
    render();
}

function checkAnswer() {
    const exercises = getExercises();
    const exercise = exercises[currentExerciseIndex];
    let userAnswerStr = isTypeMode ? typeInputEl.value.trim() : currentAnswer.map(w => w.text).join(' ');

    const cleanUser = userAnswerStr.toLowerCase().replace(/[.,!]/g, '').trim();
    const cleanCorrect = exercise.correctSentence.toLowerCase().replace(/[.,!]/g, '').trim();

    if (cleanUser === cleanCorrect) {
        showFeedback(true, `Correct! 🎉 "${exercise.correctSentence}"`);
        checkBtn.disabled = true;
        if (isTypeMode) typeInputEl.disabled = true;
        markExerciseComplete(currentTopic, currentLevel, currentExerciseIndex);
        updateDashboard();

        if (currentExerciseIndex < exercises.length - 1) {
            nextBtn.disabled = false;
            nextBtn.classList.add('active');
        } else {
            feedbackEl.textContent += " You've completed all exercises for this topic! 🏆";
        }
    } else {
        if (userAnswerStr.length === 0) {
            showFeedback(false, "Please enter an answer first.");
            return;
        }
        showFeedback(false, "Not quite! 💡 Check the hint if you are stuck.");
    }
}

function nextExercise() {
    currentExerciseIndex++;
    saveSession();
    loadExercise();
}

function toggleMode(enabled) {
    isTypeMode = enabled;
    modeToggle.checked = enabled; // Sync UI

    // Visual toggle
    if (isTypeMode) {
        dropZoneEl.style.display = 'none';
        typeInputEl.style.display = 'block';
        typeInputEl.focus();
        wordBankEl.style.opacity = '0.5';
        wordBankEl.style.pointerEvents = 'none';
    } else {
        dropZoneEl.style.display = 'flex';
        typeInputEl.style.display = 'none';
        wordBankEl.style.opacity = '1';
        wordBankEl.style.pointerEvents = 'auto';
    }
}

function toggleHint() {
    const ex = getExercises()[currentExerciseIndex];
    if (feedbackEl.style.display === 'block' && feedbackEl.textContent.includes(ex.hint)) {
        feedbackEl.style.display = 'none';
    } else {
        showFeedback(false, "💡 HINT: " + ex.hint);
    }
}

function toggleShowAnswer() {
    const ex = getExercises()[currentExerciseIndex];
    showFeedback(false, "👀 Answer: " + ex.correctSentence);
}

function showFeedback(isSuccess, text) {
    if (feedbackTimer) clearTimeout(feedbackTimer);
    feedbackEl.textContent = text;
    feedbackEl.className = `feedback-area ${isSuccess ? 'success' : 'error'}`;
    feedbackEl.style.display = 'block';
    feedbackTimer = setTimeout(() => {
        feedbackEl.style.display = 'none';
    }, 5000);
}

function jumpToExercise(index) {
    currentExerciseIndex = index;
    saveSession();
    loadExercise();
}

// --- Persistence ---

function loadLocalData() {
    loadLocalNotes();
    const savedProgress = localStorage.getItem(PROGRESS_KEY);
    if (savedProgress) userProgress = JSON.parse(savedProgress);
    const savedAnswers = localStorage.getItem(ANSWERS_KEY);
    if (savedAnswers) userAnswers = JSON.parse(savedAnswers);

}

function loadLocalNotes() {
    const saved = localStorage.getItem(NOTES_KEY_PREFIX + currentTopic);
    notesArea.value = saved || '';
}

function saveNotes() {
    localStorage.setItem(NOTES_KEY_PREFIX + currentTopic, notesArea.value);
    saveStatus.classList.add('show');
    setTimeout(() => saveStatus.classList.remove('show'), 2000);
}



function saveCurrentAnswer() {
    if (!userAnswers[currentTopic]) userAnswers[currentTopic] = {};
    if (!userAnswers[currentTopic][currentLevel]) userAnswers[currentTopic][currentLevel] = {};

    if (isTypeMode) {
        const val = typeInputEl.value;
        if (!val) delete userAnswers[currentTopic][currentLevel][currentExerciseIndex];
        else userAnswers[currentTopic][currentLevel][currentExerciseIndex] = val;
    } else {
        if (!currentAnswer.length) delete userAnswers[currentTopic][currentLevel][currentExerciseIndex];
        else userAnswers[currentTopic][currentLevel][currentExerciseIndex] = currentAnswer;
    }
    localStorage.setItem(ANSWERS_KEY, JSON.stringify(userAnswers));
}

function getSavedAnswerLink() {
    return userAnswers[currentTopic]?.[currentLevel]?.[currentExerciseIndex] || null;
}

function markExerciseComplete(topic, level, index) {
    if (!userProgress[topic]) userProgress[topic] = {};
    if (!userProgress[topic][level]) userProgress[topic][level] = [];
    if (!userProgress[topic][level].includes(index)) {
        userProgress[topic][level].push(index);
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(userProgress));
        updateExerciseNav();
    }
}

function isExerciseComplete(topic, level, index) {
    return userProgress[topic]?.[level]?.includes(index) || false;
}

function handleResetAction(scope) {
    console.log("[UI] Reset action:", scope);
    if (scope === 'question') {
        // Explicitly remove completion status
        if (userProgress[currentTopic] && userProgress[currentTopic][currentLevel]) {
            userProgress[currentTopic][currentLevel] = userProgress[currentTopic][currentLevel].filter(i => i !== currentExerciseIndex);
            localStorage.setItem(PROGRESS_KEY, JSON.stringify(userProgress));
        }
        // Also clear saved answer to be thorough
        if (userAnswers[currentTopic] && userAnswers[currentTopic][currentLevel]) {
            delete userAnswers[currentTopic][currentLevel][currentExerciseIndex];
            localStorage.setItem(ANSWERS_KEY, JSON.stringify(userAnswers));
        }
        // Use timeout to ensure DOM updates after event loop
        setTimeout(() => {
            updateDashboard();
            updateExerciseNav();
            reset();
        }, 50);
    } else if (scope === 'topic') {
        if (confirm('Reset progress for this topic?')) {
            if (userProgress[currentTopic]) {
                delete userProgress[currentTopic];
                localStorage.setItem(PROGRESS_KEY, JSON.stringify(userProgress));
            }
            if (userAnswers[currentTopic]) {
                delete userAnswers[currentTopic];
                localStorage.setItem(ANSWERS_KEY, JSON.stringify(userAnswers));
            }
            setTimeout(() => {
                updateDashboard();
                updateExerciseNav();
                loadExercise();
            }, 50);
        }
    } else if (scope === 'level') {
        if (confirm(`Reset all progress for Level ${currentLevel.toUpperCase()}?`)) {
            if (userProgress[currentTopic] && userProgress[currentTopic][currentLevel]) {
                delete userProgress[currentTopic][currentLevel];
                localStorage.setItem(PROGRESS_KEY, JSON.stringify(userProgress));
            }
            if (userAnswers[currentTopic] && userAnswers[currentTopic][currentLevel]) {
                delete userAnswers[currentTopic][currentLevel];
                localStorage.setItem(ANSWERS_KEY, JSON.stringify(userAnswers));
            }
            setTimeout(() => {
                updateDashboard();
                updateExerciseNav();
                loadExercise();
            }, 50);
        }
    } else if (scope === 'all') {
        if (confirm('⚠ Reset EVERYTHING? This will delete all progress and history.')) {
            userProgress = {};
            userAnswers = {};
            localStorage.removeItem(PROGRESS_KEY);
            localStorage.removeItem(ANSWERS_KEY);

            setTimeout(() => {
                updateDashboard();
                updateExerciseNav();
                loadExercise();
            }, 50);
        }
    }

    // Hide menu
    if (resetMenu) resetMenu.classList.remove('show');
}

function updateDashboard() {
    if (!lessons[currentTopic]) return;
    const stats = calculateStats(currentTopic);
    topicPercentageEl.textContent = `${Math.round(stats.pct)}%`;
    topicCountEl.textContent = `${stats.done}/${stats.total} Completed`;

    // Restore Label
    const label = document.querySelector('.mastery-label');
    if (label) label.textContent = "TOPIC MASTERY";

    renderProgressDashboard();
}

function updateExerciseNav() {
    const exercises = getExercises();
    exerciseSelect.innerHTML = '';
    exercises.forEach((ex, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `Exercise ${i + 1} ${isExerciseComplete(currentTopic, currentLevel, i) ? '✅' : ''}`;
        exerciseSelect.appendChild(opt);
    });
    exerciseSelect.value = currentExerciseIndex;
    exerciseCounter.textContent = `of ${exercises.length}`;
}

function calculateStats(topicId) {
    const lesson = lessons[topicId];
    if (!lesson) return { total: 0, done: 0, pct: 0 };

    let total = 0;
    let done = 0;

    if (lesson.levels) {
        Object.keys(lesson.levels).forEach(k => {
            total += lesson.levels[k].length;
            done += (userProgress[topicId]?.[k]?.length || 0);
        });
    } else {
        total = lesson.exercises?.length || 0;
        done = userProgress[topicId]?.['explorer']?.length || 0;
    }
    return { total, done, pct: total ? (done / total) * 100 : 0 };
}

function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// --- Global Dashboard (Premium) ---

// const dashboardContainer = document.getElementById('global-dashboard-container'); // REMOVED
const dashboardToggle = document.getElementById('dashboard-toggle-btn');
const dashboardDetails = document.getElementById('dashboard-details-panel');
const searchInput = document.getElementById('dashboard-search-input');
const searchResults = document.getElementById('dashboard-search-results');
const levelGrid = document.getElementById('level-progress-grid');

// Dashboard Toggle Logic
// Dashboard Toggle Logic
if (dashboardToggle && dashboardDetails) {

    let isMenuOpen = false;

    function closeDashboard() {
        isMenuOpen = false;
        dashboardDetails.classList.remove('open');
        const icon = dashboardToggle.querySelector('.chevron-icon');
        if (icon) icon.textContent = '+';

        // Immediate close logic
        dashboardDetails.style.display = 'none';
        dashboardDetails.style.maxHeight = '0px';
        dashboardDetails.style.padding = '0px';
        dashboardDetails.style.zIndex = '';

        document.removeEventListener('click', outsideClickListener);
    }

    function openDashboard() {
        isMenuOpen = true;
        dashboardDetails.classList.add('open');
        // Force styles via JS to ensure visibility and balanced spacing
        dashboardDetails.style.display = 'block';
        dashboardDetails.style.zIndex = '3000';
        dashboardDetails.style.maxHeight = '80vh';
        dashboardDetails.style.padding = '1rem 1.5rem'; // Balanced spacing (matches gap)

        // Also force grid to have no outer margin
        if (levelGrid) {
            levelGrid.style.margin = '0';
            levelGrid.style.padding = '0';
            levelGrid.style.gap = '1rem'; // Uniform gap
        }

        const icon = dashboardToggle.querySelector('.chevron-icon');
        if (icon) icon.textContent = '-';

        setTimeout(() => {
            document.addEventListener('click', outsideClickListener);
        }, 10);
    }

    function outsideClickListener(e) {
        if (!dashboardDetails.contains(e.target) && !dashboardToggle.contains(e.target)) {
            closeDashboard();
        }
    }

    dashboardToggle.onclick = (e) => {
        e.stopPropagation();
        if (isMenuOpen) closeDashboard();
        else openDashboard();
    };
}

// Search Logic
if (searchInput) {
    // Toggle visibility based on content
    const toggleResults = (show) => {
        if (show) {
            searchResults.style.display = 'block';
            searchResults.classList.add('active');
        } else {
            searchResults.style.display = 'none';
            searchResults.classList.remove('active');
        }
    };

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        if (query.length === 0) {
            toggleResults(false);
            return;
        }

        // Filter
        const matches = [];
        Object.keys(TOPIC_DATA).forEach(level => {
            const topics = TOPIC_DATA[level];
            topics.forEach(t => {
                if (t.title.toLowerCase().includes(query)) {
                    matches.push({ ...t, level });
                }
            });
        });

        // Render Results
        searchResults.innerHTML = '';
        toggleResults(true);

        if (matches.length === 0) {
            searchResults.innerHTML = `<div class="search-no-results">No topics found for "${query}"</div>`;
            return;
        }

        matches.forEach(match => {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            // HTML structure for list item
            item.innerHTML = `
                    <span class="search-badge badge-${match.level}">${match.level.toUpperCase()}</span>
                    <span class="search-topic-title">${match.title}</span>
                `;

            item.addEventListener('click', () => {
                changeTopic(match.id);
                searchInput.value = '';
                toggleResults(false);
            });
            searchResults.appendChild(item);
        });
    });

    // Close search when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            toggleResults(false);
        }
    });
}


function renderProgressDashboard() {
    console.log("[UI] Rendering Premium Dashboard...");

    const levels = Object.keys(TOPIC_DATA);
    let totalTopics = 0;
    let totalCompleted = 0;

    const levelStats = {};

    // 1. Calculate Stats
    levels.forEach(level => {
        const topics = TOPIC_DATA[level];
        const lvlTotal = topics.length;
        let lvlCompleted = 0;
        let lvlTotalLessons = 0;
        let lvlCompletedLessons = 0;

        topics.forEach(t => {
            const stats = calculateStats(t.id);
            if (stats.pct >= 100) {
                lvlCompleted++;
            }
            // Count Lessons (Exercises)
            // calculateStats returns { done: X, total: Y, ... } which are exercises
            lvlTotalLessons += stats.total;
            lvlCompletedLessons += stats.done;
        });

        levelStats[level] = {
            total: lvlTotal,
            done: lvlCompleted,
            totalLessons: lvlTotalLessons,
            doneLessons: lvlCompletedLessons
        };
        totalTopics += lvlTotal;
        totalCompleted += lvlCompleted;
        // Global sums
        totalTopics += 0; // Keeping structure but variable reuse: we need new global lesson vars
    });

    // Recalculate global totals for lessons
    let globalTotalLessons = 0;
    let globalDoneLessons = 0;
    Object.values(levelStats).forEach(s => {
        globalTotalLessons += s.totalLessons;
        globalDoneLessons += s.doneLessons;
    });

    const globalPct = globalTotalLessons ? Math.round((globalDoneLessons / globalTotalLessons) * 100) : 0;

    // 2. Update Summary Header
    const globalBar = document.getElementById('global-progress-bar');
    const globalText = document.getElementById('global-percentage');

    if (globalBar && globalText) {
        globalBar.style.width = `${globalPct}%`;
        globalText.textContent = `${globalPct}%`;
    }

    // 3. Render Level Cards
    const grid = document.getElementById('level-progress-grid');
    if (grid) {
        grid.innerHTML = '';

        // Explicit order including C1
        const displayLevels = ['a1', 'a2', 'b1', 'b2', 'c1'];

        displayLevels.forEach(level => {
            const stats = levelStats[level] || { total: 0, done: 0, totalLessons: 0, doneLessons: 0 };
            const pct = stats.totalLessons ? Math.round((stats.doneLessons / stats.totalLessons) * 100) : 0;

            // Create Card
            const card = document.createElement('div');
            card.className = `level-card card-${level}`;

            card.innerHTML = `
                <div class="card-header">
                    <span class="level-badge">${level.toUpperCase()}</span>
                    <span class="level-pct">${pct}%</span>
                </div>
                <div class="card-stats">
                    <div>${stats.done} / ${stats.total} Topics</div>
                    <div>${stats.doneLessons} / ${stats.totalLessons} Lessons</div>
                </div>
                <div class="mini-track">
                    <div class="mini-fill" style="width: ${pct}%"></div>
                </div>
            `;
            grid.appendChild(card);
        });
    }
}

// Start
init();
renderProgressDashboard();
