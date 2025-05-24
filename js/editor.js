// Manages CodeMirror editor instances and mode switching

let editorInstance = null;
let currentEditorMode = 'basic-mode'; // 'basic-mode' or 'advanced-mode'
let lastCodingMode = 'basic-mode'; // Store the last active coding mode

document.addEventListener('DOMContentLoaded', () => {
    // Initialize CodeMirror
    editorInstance = CodeMirror(document.getElementById('editor'), {
        mode: 'python',
        lineNumbers: true,
        indentUnit: 4,
        tabSize: 4,
        theme: 'material-darker', // Keep the dark theme for now, theme.js will handle body class
        lineWrapping: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-lint-markers", "CodeMirror-foldgutter"],
        lint: true,
        foldGutter: true,
        extraKeys: {
            "Ctrl-Space": "autocomplete",
            "Cmd-Space": "autocomplete",
            "Tab": function(cm) {
                if (cm.somethingSelected()) {
                    cm.indentSelection("add");
                } else {
                    cm.replaceSelection(cm.getOption("indentWithTabs")? "\t":
                        Array(cm.getOption("indentUnit") + 1).join(" "), "end", "+input");
                }
            },
            "Shift-Tab": function(cm) {
                cm.indentSelection("subtract");
            },
            "Cmd-/": "toggleComment",
            "Ctrl-/": "toggleComment"
        },
        value: '' // Start with a blank editor
    });

    // Hide example selectors as per plan
    const basicSelect = document.getElementById('example-select');
    const advancedSelect = document.getElementById('advanced-example-select');
    if (basicSelect) basicSelect.style.display = 'none';
    if (advancedSelect) advancedSelect.style.display = 'none';


    // Set up tab switching
    setupTabs();

    // Set up Run button
    setupRunButton();

    // Set up Reset button
    setupResetButton();

    // Ensure editor refreshes if needed after DOM is ready
    setTimeout(() => { if(editorInstance) editorInstance.refresh(); }, 100);

    // Initial UI state based on auth status (handled by app-controller)
    // app-controller will call updateEditorUI based on login state
});

// Function to set up tab switching
function setupTabs() {
    const tabs = document.querySelectorAll('.tabs .tab');
    const advancedTab = document.querySelector('.tabs .tab[data-tab="advanced-mode"]');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetMode = this.dataset.tab;

            // Prevent switching to advanced mode if not logged in
            if (targetMode === 'advanced-mode' && (typeof window.auth === 'undefined' || !window.auth.getCurrentUser())) {
                 if (typeof showToast === 'function') {
                    showToast('Please log in to access Advanced Mode.', 'info');
                }
                // Optionally highlight the login/register buttons
                return; // Do not switch tabs
            }

            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to the clicked tab
            this.classList.add('active');

            // Hide all tab content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.style.display = 'none';
            });

            // Show the target tab content
            const targetContent = document.querySelector(`.tab-content[data-tab-content="${targetMode}"]`);
            if (targetContent) {
                targetContent.style.display = 'flex'; // Use flex for layout
            }

            // Update lastCodingMode if the target is not the README tab
            if (targetMode !== 'readme') {
                lastCodingMode = targetMode;
            }

            currentEditorMode = targetMode;

            // Clear editor content when switching modes, unless switching to README
            if (editorInstance && targetMode !== 'readme') {
                editorInstance.setValue('');
                editorInstance.refresh();
            } else if (editorInstance && targetMode === 'readme') {
                 // If switching TO readme, ensure editor is refreshed in case it was hidden
                 editorInstance.refresh();
                 // Update README content based on the last coding mode
                 if (typeof window.readme !== 'undefined' && typeof window.readme.updateReadmeContent === 'function') {
                     window.readme.updateReadmeContent(lastCodingMode);
                 }
            }


            // Update UI based on mode (e.g., show/hide README panel - handled by app-controller)
            // app-controller will listen for mode changes or be called by this module
            // document.dispatchEvent(new CustomEvent('modeChange', { detail: { mode: currentEditorMode } })); // No longer needed here
        });
    });

    // Initial state: Basic Mode is active, Advanced Mode is disabled for guests
    // app-controller will handle enabling/disabling based on auth status
    updateAdvancedTabState(false); // Initially disabled

    // Manually trigger click on the default active tab (Basic Mode) to set initial state
    const initialTab = document.querySelector('.tabs .tab.active');
    if (initialTab) {
        initialTab.click();
    }
}

// Function to update the state of the Advanced Mode tab (enabled/disabled)
function updateAdvancedTabState(isEnabled) {
    const advancedTab = document.querySelector('.tabs .tab[data-tab="advanced-mode"]');
    if (advancedTab) {
        if (isEnabled) {
            advancedTab.classList.remove('disabled');
            advancedTab.style.pointerEvents = 'auto'; // Re-enable clicks
            advancedTab.title = ''; // Remove tooltip if any
        } else {
            advancedTab.classList.add('disabled');
            advancedTab.style.pointerEvents = 'none'; // Disable clicks
            advancedTab.title = 'Log in to unlock Advanced Mode'; // Add tooltip
        }
    }
}


// Function to set up Run button
function setupRunButton() {
    const runBtn = document.getElementById('run-btn');
    if (runBtn) {
        runBtn.addEventListener('click', async () => {
            if (!editorInstance) {
                console.error("Editor not initialized");
                 if(typeof showToast === 'function') showToast('Editor not ready.', 'error');
                return;
            }

            const code = editorInstance.getValue();

            // Check if user is logged in
            const currentUser = typeof window.auth !== 'undefined' ? window.auth.getCurrentUser() : null;

            if (currentEditorMode === "basic-mode") {
                // Basic Mode Logic
                if (!currentUser) {
                    // Guest user - check usage limit
                    let basicModeRunCount = parseInt(localStorage.getItem('basicModeRunCount') || '0', 10);

                    if (basicModeRunCount >= 6) {
                        // Limit reached
                        if (typeof showToast === 'function') {
                            showToast('Please login to continue unlimited access in basic and advanced mode.', 'info');
                        }
                        return; // Block execution
                    } else {
                        // Within limit - increment and run
                        basicModeRunCount++;
                        localStorage.setItem('basicModeRunCount', basicModeRunCount);

                        if (typeof window.runBasicPython === 'function') {
                            await window.runBasicPython(code);
                        } else {
                            console.error("Basic Python engine not available.");
                             if(typeof showToast === 'function') showToast('Basic engine not ready.', 'error');
                        }

                        if (basicModeRunCount === 6) {
                             // Show message on the 6th run
                             if (typeof showToast === 'function') {
                                showToast('Please login to continue unlimited access in basic and advanced mode.', 'info');
                            }
                        } else if (basicModeRunCount >= 3 && basicModeRunCount < 6) {
                             // Optional: Show a warning before reaching the limit
                             // if (typeof showToast === 'function') {
                             //    showToast(`You have ${6 - basicModeRunCount} free uses remaining in Basic Mode.`, 'info');
                             // }
                        }
                    }
                } else {
                    // Logged-in user - unlimited Basic Mode usage
                    if (typeof window.runBasicPython === 'function') {
                        await window.runBasicPython(code);
                    } else {
                        console.error("Basic Python engine not available.");
                         if(typeof showToast === 'function') showToast('Basic engine not ready.', 'error');
                    }
                }

            } else if (currentEditorMode === "advanced-mode") {
                 // Advanced Mode Logic
                 // Check if Advanced Mode is actually enabled (user is logged in)
                 if (!currentUser) {
                     // This case should ideally be prevented by disabled tab, but as a fallback:
                     if (typeof showToast === 'function') {
                        showToast('Please log in to access Advanced Mode.', 'info');
                    }
                    return;
                 }
                // Use Advanced Engine (Pyodide)
                if (typeof window.runAdvancedPython === 'function') {
                     // Ensure Pyodide is loaded before running
                     await window.loadAdvancedPythonEngine(); // Ensure engine is loaded
                    await window.runAdvancedPython(code);
                } else {
                    console.error("Advanced Python engine not available.");
                     if(typeof showToast === 'function') showToast('Advanced engine not ready.', 'error');
                }
            } else {
                 // Running code in README tab is not applicable
                 console.warn("Attempted to run code in non-coding tab:", currentEditorMode);
            }
        });
    } else {
         console.error("Run button not found!");
    }
}

// Function to set up Reset button
function setupResetButton() {
    const resetBtn = document.getElementById('reset-btn');
    // Assuming there's also a reset button for advanced mode with ID 'reset-btn-advanced'
    const resetBtnAdvanced = document.getElementById('reset-btn-advanced');

    const handleReset = () => {
        if (editorInstance) {
            editorInstance.setValue(''); // Reset to blank
             if(typeof showToast === 'function') showToast('Editor cleared', 'info');
        }
    };

    if (resetBtn) {
        resetBtn.addEventListener('click', handleReset);
    }
     if (resetBtnAdvanced) {
        resetBtnAdvanced.addEventListener('click', handleReset);
    }
}

// Get current editor content
function getEditorContent() {
    return editorInstance ? editorInstance.getValue() : '';
}

// Set editor content
function setEditorContent(code) {
    if (editorInstance) {
        editorInstance.setValue(code);
    }
}

// Get current editor mode
function getCurrentEditorMode() {
    return currentEditorMode;
}

// Export functions
window.editor = {
    getEditorContent,
    setEditorContent,
    getCurrentEditorMode,
    updateAdvancedTabState // Export this for app-controller to call
};
