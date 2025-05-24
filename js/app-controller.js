// Main application controller and orchestrator

document.addEventListener('DOMContentLoaded', async () => {
    console.log("App controller initialized.");

    // Initialize modules (order might matter for dependencies)
    // uiHelpers, editor, and readme modules do not have an explicit init function exported.
    // Their DOMContentLoaded listeners handle their initialization.
    if (typeof window.theme !== 'undefined') window.theme.init();
    if (typeof window.auth !== 'undefined') window.auth.init();

    // Set up initial UI state based on auth status
    await updateUIBasedOnAuth();

    // Listen for mode changes from the editor
    document.addEventListener('modeChange', (event) => {
        const currentMode = event.detail.mode;
        updateUIBasedOnMode(currentMode);
    });

    // Set up clear output button listeners
    const clearOutputBtn = document.getElementById('clear-output');
    if (clearOutputBtn) {
        clearOutputBtn.addEventListener('click', () => clearOutputPanel('output'));
    }
    const clearOutputAdvancedBtn = document.getElementById('clear-output-advanced');
    if (clearOutputAdvancedBtn) {
        clearOutputAdvancedBtn.addEventListener('click', () => clearOutputPanel('output-advanced'));
    }

    // Set up auth button listeners
    setupAuthButtonListeners();

    // Initial UI update for the default mode (Basic Mode)
    updateUIBasedOnMode('basic-mode');
});

// Update UI elements based on authentication status
async function updateUIBasedOnAuth() {
    const currentUser = typeof window.auth !== 'undefined' ? window.auth.getCurrentUser() : null;
    const authButtons = document.querySelector('.auth-buttons');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const saveCodeBtn = document.getElementById('save-code-btn'); // Assuming these exist in HTML
    const myCodesBtn = document.getElementById('my-codes-btn'); // Assuming these exist in HTML

    if (currentUser) {
        console.log("User is logged in:", currentUser.username);
        // Update header buttons to show user profile/logout/save/my codes
        if (authButtons) {
             authButtons.innerHTML = `
                <button id="theme-toggle-btn" title="Toggle theme"><i class="fas fa-sun"></i></button> <!-- Theme toggle -->
                <div class="user-profile">
                    <button class="user-profile-button">
                        <i class="fas fa-user-circle"></i>
                        ${currentUser.username}
                    </button>
                    <div class="user-dropdown">
                        <a href="#" id="save-code-btn"><i class="fas fa-save"></i> Save Code</a>
                        <a href="#" id="my-codes-btn"><i class="fas fa-folder"></i> My Codes</a>
                        <a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a>
                    </div>
                </div>
            `;
            // Re-attach theme toggle listener
             setupThemeToggleListener();
             // Re-attach auth button listeners for the new elements
             setupAuthButtonListeners();
        }

        // Enable Advanced Mode tab
        if (typeof window.editor !== 'undefined') {
            window.editor.updateAdvancedTabState(true);
        }

        // Hide login/register modals if open
        if (loginModal) loginModal.style.display = 'none';
        if (registerModal) registerModal.style.display = 'none';

    } else {
        console.log("User is not logged in (Guest).");
        // Update header buttons to show login/register
         if (authButtons) {
            authButtons.innerHTML = `
                <button id="theme-toggle-btn" title="Toggle theme"><i class="fas fa-sun"></i></button> <!-- Theme toggle -->
                <button id="login-btn"><i class="fas fa-sign-in-alt"></i> Login</button>
                <button id="register-btn"><i class="fas fa-user-plus"></i> Register</button>
            `;
             // Re-attach theme toggle listener
             setupThemeToggleListener();
             // Re-attach auth button listeners for login/register
             setupAuthButtonListeners();
        }

        // Disable Advanced Mode tab
        if (typeof window.editor !== 'undefined') {
            window.editor.updateAdvancedTabState(false);
        }
    }

    // Update UI based on the current mode after auth state is set
    const currentMode = typeof window.editor !== 'undefined' ? window.editor.getCurrentEditorMode() : 'basic-mode';
    updateUIBasedOnMode(currentMode);
}

// Update UI elements based on the current editor mode
function updateUIBasedOnMode(currentMode) {
    // This function is now simplified as tab content visibility is handled by editor.js
    // Any UI changes specific to basic vs advanced mode (other than tab content) would go here.
    // Currently, no such specific changes are needed based on the plan.
}

// Set up event listeners for auth-related buttons
function setupAuthButtonListeners() {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn'); // For logged-in state
    const saveCodeBtn = document.getElementById('save-code-btn'); // For logged-in state
    const myCodesBtn = document.getElementById('my-codes-btn'); // For logged-in state
    const showRegisterLink = document.getElementById('show-register'); // In login modal
    const showLoginLink = document.getElementById('show-login'); // In register modal
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const closeBtns = document.querySelectorAll('.modal .close');

    // Remove existing listeners to prevent duplicates
    // This is a simplified approach; a more robust method would use event delegation
    if (loginBtn) loginBtn.removeEventListener('click', handleLoginButtonClick);
    if (registerBtn) registerBtn.removeEventListener('click', handleRegisterButtonClick);
    if (logoutBtn) logoutBtn.removeEventListener('click', handleLogoutButtonClick);
    if (saveCodeBtn) saveCodeBtn.removeEventListener('click', handleSaveCodeButtonClick);
    if (myCodesBtn) myCodesBtn.removeEventListener('click', handleMyCodesButtonClick);
    if (showRegisterLink) showRegisterLink.removeEventListener('click', handleShowRegisterClick);
    if (showLoginLink) showLoginLink.removeEventListener('click', handleShowLoginClick);
    if (loginForm) loginForm.removeEventListener('submit', handleLoginFormSubmit);
    if (registerForm) registerForm.removeEventListener('submit', handleRegisterFormSubmit);
     closeBtns.forEach(btn => btn.removeEventListener('click', handleModalClose));
     window.removeEventListener('click', handleWindowModalClose);


    // Add new listeners
    if (loginBtn) loginBtn.addEventListener('click', handleLoginButtonClick);
    if (registerBtn) registerBtn.addEventListener('click', handleRegisterButtonClick);
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogoutButtonClick);
    if (saveCodeBtn) saveCodeBtn.addEventListener('click', handleSaveCodeButtonClick);
    if (myCodesBtn) myCodesBtn.addEventListener('click', handleMyCodesButtonClick);
    if (showRegisterLink) showRegisterLink.addEventListener('click', handleShowRegisterClick);
    if (showLoginLink) showLoginLink.addEventListener('click', handleShowLoginClick);
    if (loginForm) loginForm.addEventListener('submit', handleLoginFormSubmit);
    if (registerForm) registerForm.addEventListener('submit', handleRegisterFormSubmit);
     closeBtns.forEach(btn => btn.addEventListener('click', handleModalClose));
     window.addEventListener('click', handleWindowModalClose); // Add only once

     // Add listener for user profile dropdown toggle (if it exists)
     const userProfileButton = document.querySelector('.user-profile-button');
     if(userProfileButton) {
         userProfileButton.removeEventListener('click', handleUserProfileToggle);
         userProfileButton.addEventListener('click', handleUserProfileToggle);
     }
}

// Handlers for auth button events
function handleLoginButtonClick() { document.getElementById('login-modal').style.display = 'block'; }
function handleRegisterButtonClick() { document.getElementById('register-modal').style.display = 'block'; }
async function handleLogoutButtonClick(e) {
    e.preventDefault();
    if (typeof window.auth !== 'undefined') {
        await window.auth.logout();
        updateUIBasedOnAuth(); // Update UI after logout
    }
}
async function handleSaveCodeButtonClick(e) {
    e.preventDefault();
    if (typeof window.auth !== 'undefined' && typeof window.editor !== 'undefined') {
        // Trigger save dialog/modal - this logic might live in auth.js or ui-helpers.js
        // For now, simulate a prompt
        const title = prompt("Enter a title for your code:");
        if (title) {
            const code = window.editor.getEditorContent();
            await window.auth.saveCode(code, title);
        }
    }
}
async function handleMyCodesButtonClick(e) {
    e.preventDefault();
     if (typeof window.auth !== 'undefined') {
        // Trigger load codes modal/display - this logic might live in auth.js or ui-helpers.js
        // For now, simulate loading and displaying in console
        try {
            const result = await window.auth.loadSavedCodes();
            console.log("Loaded codes:", result.data);
            // In a real app, you'd display these in a modal
        } catch (error) {
            console.error("Failed to load codes:", error);
        }
    }
}
function handleShowRegisterClick(e) {
    e.preventDefault();
    document.getElementById('login-modal').style.display = 'none';
    document.getElementById('register-modal').style.display = 'block';
}
function handleShowLoginClick(e) {
    e.preventDefault();
    document.getElementById('register-modal').style.display = 'none';
    document.getElementById('login-modal').style.display = 'block';
}
async function handleLoginFormSubmit(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const messageEl = document.getElementById('login-message');
    messageEl.textContent = ''; messageEl.className = 'form-message'; messageEl.style.display = 'block';
    messageEl.textContent = 'Logging in...';

    if (typeof window.auth !== 'undefined') {
        try {
            const response = await window.auth.login(username, password);
            if (response.success) {
                messageEl.textContent = 'Login successful!'; messageEl.classList.add('success');
                setTimeout(() => {
                    document.getElementById('login-modal').style.display = 'none';
                    updateUIBasedOnAuth(); // Update UI after login
                }, 500);
            } else {
                 throw new Error(response.message || 'Login failed');
            }
        } catch (error) {
            messageEl.textContent = error.message || 'Invalid username or password';
            messageEl.classList.add('error');
        }
    }
}
async function handleRegisterFormSubmit(e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const messageEl = document.getElementById('register-message');
    messageEl.textContent = ''; messageEl.className = 'form-message'; messageEl.style.display = 'block';

    if (password !== confirmPassword) {
        messageEl.textContent = 'Passwords do not match'; messageEl.classList.add('error'); return;
    }
    messageEl.textContent = 'Creating account...';

    if (typeof window.auth !== 'undefined') {
        try {
            const response = await window.auth.register(username, email, password);
             if (response.success) {
                messageEl.textContent = 'Registration successful! Please log in.'; messageEl.classList.add('success');
                document.getElementById('register-form').reset();
                setTimeout(() => {
                    document.getElementById('register-modal').style.display = 'none';
                    document.getElementById('login-modal').style.display = 'block'; // Show login modal
                }, 1000);
            } else {
                 throw new Error(response.message || 'Registration failed');
            }
        } catch (error) {
            messageEl.textContent = error.message || 'Registration failed';
            messageEl.classList.add('error');
        }
    }
}
function handleModalClose() {
    this.closest('.modal').style.display = 'none';
}
function handleWindowModalClose(e) {
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    if (e.target === loginModal) loginModal.style.display = 'none';
    if (e.target === registerModal) registerModal.style.display = 'none';
}
function handleUserProfileToggle() {
    this.closest('.user-profile').classList.toggle('active');
}

// Set up theme toggle listener (needs to be called after auth buttons are potentially re-rendered)
function setupThemeToggleListener() {
     const themeToggleBtn = document.getElementById('theme-toggle-btn');
     if (themeToggleBtn) {
         // Remove existing listener before adding to prevent duplicates
         themeToggleBtn.removeEventListener('click', handleThemeToggleClick);
         themeToggleBtn.addEventListener('click', handleThemeToggleClick);
     }
}

// Handler for theme toggle button click (delegated to theme.js)
function handleThemeToggleClick() {
    if (typeof window.theme !== 'undefined' && typeof window.theme.toggleTheme === 'function') {
        window.theme.toggleTheme(); // Call the toggleTheme function from theme.js
    } else {
        console.error("Theme module or toggleTheme function not available.");
    }
}

// Initial setup of theme toggle listener
document.addEventListener('DOMContentLoaded', setupThemeToggleListener);
