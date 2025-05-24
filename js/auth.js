// Handles user authentication, execution limits, and code persistence

const MAX_GUEST_EXECUTIONS = 5;
let guestExecutionCount = parseInt(localStorage.getItem('guestExecutionCount') || '0', 10);
let currentUser = null; // Will store logged-in user info

// Authentication related functions (Consolidated from enhanced-ui.js and hostinger-ui.js)
const auth = {
    // Configuration - set to 'mock' for localStorage based auth or 'php' for server backend
    mode: 'php', // Set to 'php' for server-side authentication
    
    // Base URL for API endpoints - Set to 'php' directory
    apiBaseUrl: 'php', 
    
    // Current user information
    currentUser: null, // This will be updated by checkAuthStatus or login

    // Initialize authentication system
    init: function() {
        console.log("Auth module initialized. Mode:", this.mode, "API Base URL:", this.apiBaseUrl);
        // Check if user is already logged in
        this.checkAuthStatus();
        
        // Set up event listeners for auth-related buttons (handled by app-controller now)
        // this.setupAuthListeners(); 
        
        // Initialize execution counter (handled by app-controller now)
        // this.initExecutionCounter();
    },
    
    // Check if user is logged in
    checkAuthStatus: function() {
        if (this.mode === 'mock') {
            // Check localStorage for saved user info
            const savedUser = localStorage.getItem('pythonPractice_user');
            if (savedUser) {
                try {
                    this.currentUser = JSON.parse(savedUser);
                    // Update UI is handled by app-controller calling updateUIBasedOnAuth
                    // this.updateUIForLoggedInUser(); 
                    return true;
                } catch (e) {
                    console.error('Failed to parse saved user data');
                    localStorage.removeItem('pythonPractice_user');
                }
            }
            return false;
        } else {
            // Use PHP backend to check session status
            // Ensure the path is correct: php/fixed_login.php
            fetch(`${this.apiBaseUrl}/fixed_login.php?action=check`)
                .then(response => response.json())
                .then(data => {
                    if (data.success && data.logged_in) {
                        this.currentUser = {
                            id: data.user_id,
                            username: data.username
                        };
                        // Update UI is handled by app-controller calling updateUIBasedOnAuth
                        // this.updateUIForLoggedInUser(); 
                        console.log("Auth check successful. User:", this.currentUser.username);
                        // Dispatch a custom event for app-controller to react
                        document.dispatchEvent(new CustomEvent('authStatusChecked', { detail: { user: this.currentUser } }));
                        return true;
                    } else {
                         console.log("Auth check: User not logged in.");
                         // Dispatch a custom event for app-controller to react
                         document.dispatchEvent(new CustomEvent('authStatusChecked', { detail: { user: null } }));
                    }
                    return false;
                })
                .catch(error => {
                    console.error('Auth check failed:', error);
                    // Dispatch a custom event for app-controller to react
                    document.dispatchEvent(new CustomEvent('authStatusChecked', { detail: { user: null, error: error } }));
                    return false;
                });
        }
    },

    // Clean up execution counter data (Guest limit is handled here)
    cleanupExecutionCounter: function() {
        // Remove the counter from localStorage if user logs in
        // This is handled in the login function now
    },

    // Initialize and update the execution counter (Guest limit is handled here)
    initExecutionCounter: function() {
        // No specific init needed here, guestExecutionCount is read on load
    },

    // Update the execution counter in the UI (Handled by app-controller if needed)
    updateExecutionCounter: function() {
        // Disabled in this version
        return;
    },

    // Increment the execution counter (Guest limit is handled here)
    incrementExecutionCounter: function() {
        // This logic is now in the canExecuteCode function
        return true; // Always return true as incrementing happens before check
    },
    
    // Register a new user
    register: function(username, email, password) {
        if (this.mode === 'mock') {
            // Simple validation
            const existingUsers = JSON.parse(localStorage.getItem('pythonPractice_users') || '[]');
            const userExists = existingUsers.some(u => u.username === username || u.email === email);
            
            if (userExists) {
                return Promise.reject({ success: false, message: 'Username or email already exists' });
            }
            
            // Create new user
            const newUser = {
                id: Date.now(), // Simple unique ID
                username: username,
                email: email,
                // In a real app, we would hash the password
                password: password
            };
            
            // Save to localStorage
            existingUsers.push(newUser);
            localStorage.setItem('pythonPractice_users', JSON.stringify(existingUsers));
            
            // Return success
            return Promise.resolve({ 
                success: true,
                message: 'Registration successful',
                user_id: newUser.id,
                username: newUser.username
            });
        } else {
            // Use PHP backend with improved error handling
            // Ensure the path is correct: php/fixed_register.php
            return fetch(`${this.apiBaseUrl}/fixed_register.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            })
            .then(response => {
                // Improved error handling with better debugging
                if (!response.ok) {
                    return response.text().then(text => {
                        console.error('Registration error response:', text);
                        console.error('Status code:', response.status);
                        try {
                            // Try to parse as JSON
                            const jsonError = JSON.parse(text);
                            throw new Error(jsonError.message || 'Registration failed');
                        } catch (e) {
                            // If not JSON or parsing fails
                            throw new Error('Server error: ' + response.status + ' ' + text.substring(0, 100));
                        }
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    // Show success message (handled by app-controller/modal logic)
                    // showToast('Registration successful! Please log in.', 'success');
                    return data;
                } else {
                    throw new Error(data.message || 'Registration failed');
                }
            })
            .catch(error => {
                console.error('Registration error:', error);
                // showToast('Registration error: ' + error.message, 'error'); // Handled by app-controller/modal logic
                throw error;
            });
        }
    },
    
    // Login a user
    login: function(username, password) {
        if (this.mode === 'mock') {
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('pythonPractice_users') || '[]');
            const user = users.find(u => (u.username === username || u.email === username) && u.password === password);
            
            if (!user) {
                return Promise.reject({ success: false, message: 'Invalid username or password' });
            }
            
            // Save current user to localStorage
            this.currentUser = {
                id: user.id,
                username: user.username,
                email: user.email
            };
            
            localStorage.setItem('pythonPractice_user', JSON.stringify(this.currentUser));
            
            // Reset execution count on successful login
            localStorage.setItem('guestExecutionCount', '0');
            guestExecutionCount = 0;
            // if (typeof codeExecutionCount !== 'undefined') { // codeExecutionCount is in basic-engine.js
            //     codeExecutionCount = 0;
            // }
            
            // Return success
            return Promise.resolve({
                success: true,
                message: 'Login successful',
                user_id: user.id,
                username: user.username
            });
        } else {
            // Use PHP backend with improved error handling
            // Ensure the path is correct: php/fixed_login.php
            return fetch(`${this.apiBaseUrl}/fixed_login.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        console.error('Login error response:', text);
                        console.error('Status code:', response.status);
                        try {
                            // Try to parse as JSON
                            const jsonError = JSON.parse(text);
                            throw new Error(jsonError.message || 'Login failed');
                        } catch (e) {
                            // If not JSON or parsing fails
                            throw new Error('Server error: ' + response.status);
                        }
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    this.currentUser = {
                        id: data.user_id,
                        username: data.username
                    };
                    
                    // Reset execution count on successful login
                    localStorage.setItem('guestExecutionCount', '0');
                    guestExecutionCount = 0;
                    // if (typeof codeExecutionCount !== 'undefined') { // codeExecutionCount is in basic-engine.js
                    //     codeExecutionCount = 0;
                    // }
                    
                    // Hide the execution counter when logged in (Handled by app-controller if needed)
                    // const counterEl = document.getElementById('execution-counter');
                    // if (counterEl) counterEl.style.display = 'none';
                }
                return data;
            })
            .catch(error => {
                console.error('Login error:', error);
                // showToast('Login error: ' + error.message, 'error'); // Handled by app-controller/modal logic
                throw error;
            });
        }
    },
    
    // Logout the user
    logout: function() {
        if (this.mode === 'mock') {
            // Remove user from localStorage
            localStorage.removeItem('pythonPractice_user');
            this.currentUser = null;
            
            // Update UI (Handled by app-controller calling updateUIBasedOnAuth)
            // this.updateUIForLoggedOutUser(); 
            return Promise.resolve({ success: true });
        } else {
            // Use PHP backend
            // Ensure the path is correct: php/fixed_login.php
            return fetch(`${this.apiBaseUrl}/fixed_login.php?action=logout`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        this.currentUser = null;
                        // Update UI (Handled by app-controller calling updateUIBasedOnAuth)
                        // this.updateUIForLoggedOutUser();
                    }
                    return data;
                });
        }
    },
    
    // Save user code with title dialog (Modal handled by app-controller)
    saveCode: function(code, title) {
        if (!this.currentUser) {
            // showToast('Please login to save your code', 'error'); // Handled by app-controller
            // Trigger UI to show login/register modals (Handled by app-controller)
            // document.getElementById('login-modal').style.display = 'block';
            return Promise.reject({ success: false, message: 'Authentication required' });
        }
        
        // Modal creation and form handling is in app-controller now
        
        if (this.mode === 'mock') {
            // Save code to localStorage
            const savedCodes = JSON.parse(localStorage.getItem(`pythonPractice_codes_${this.currentUser.id}`) || '[]');
            
            const codeEntry = {
                id: Date.now(),
                title: title,
                code_content: code,
                created_at: new Date().toISOString(),
                last_modified: new Date().toISOString()
            };
            
            savedCodes.push(codeEntry);
            localStorage.setItem(`pythonPractice_codes_${this.currentUser.id}`, JSON.stringify(savedCodes));
            
            // showToast('Code saved successfully', 'success'); // Handled by app-controller
            // saveDialog.style.display = 'none'; // Handled by app-controller
            // saveForm.reset(); // Handled by app-controller
            return Promise.resolve({ success: true });
        } else {
            // Use PHP backend with improved error handling
            // Ensure the path is correct: php/save_progress.php
            return fetch(`${this.apiBaseUrl}/save_progress.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: title,
                    code_content: code
                })
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        console.error('Error response:', text);
                        throw new Error('Server responded with status: ' + response.status);
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    // showToast('Code saved successfully', 'success'); // Handled by app-controller
                    // saveDialog.style.display = 'none'; // Handled by app-controller
                    // saveForm.reset(); // Handled by app-controller
                    return data;
                } else {
                    throw new Error(data.message || 'Failed to save code');
                }
            })
            .catch(error => {
                console.error('Save error:', error);
                // showToast(error.message || 'Failed to save code', 'error'); // Handled by app-controller
                throw error;
            });
        }
    },
    
    // Load user's saved codes (Modal handled by app-controller)
    loadSavedCodes: function() {
        if (!this.currentUser) {
            // showToast('Please login to view your saved codes', 'error'); // Handled by app-controller
            // Trigger UI to show login/register modals (Handled by app-controller)
            // document.getElementById('login-modal').style.display = 'block';
            return Promise.reject({ success: false, message: 'Authentication required' });
        }
        
        // Modal creation and display is in app-controller now
        
        if (this.mode === 'mock') {
            const savedCodes = JSON.parse(localStorage.getItem(`pythonPractice_codes_${this.currentUser.id}`) || '[]');
            // this.displaySavedCodes(savedCodes); // Display handled by app-controller
            return Promise.resolve({ success: true, data: savedCodes });
        } else {
            // Log the API URL for debugging
            console.log('Fetching saved codes from: ' + `${this.apiBaseUrl}/get_codes.php`);
            
            // Clear any previous error messages (Handled by app-controller)
            // const codesList = document.getElementById('saved-codes-list');
            // if (codesList) {
            //     codesList.innerHTML = '<p class="loading">Loading your saved codes...</p>';
            // }
            
            // Fetch saved codes with improved error handling
            // Ensure the path is correct: php/get_codes.php
            return fetch(`${this.apiBaseUrl}/get_codes.php`)
                .then(response => {
                    if (!response.ok) {
                        return response.text().then(text => {
                            console.error('Server response:', text);
                            throw new Error('Server responded with status: ' + response.status);
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Response data:', data);
                    
                    if (data.success) {
                        // Handle the response format - check both possible structures
                        let codes = data.data;
                        // If data.data is an object with codes property, extract the array
                        if (typeof data.data === 'object' && data.data !== null && data.data.codes) {
                            codes = data.data.codes;
                        }
                        // Make sure we have an array
                        codes = Array.isArray(codes) ? codes : [];
                        
                        // this.displaySavedCodes(codes); // Display handled by app-controller
                        return { success: true, data: codes };
                    } else {
                        throw new Error(data.message || 'Failed to load saved codes');
                    }
                })
                .catch(error => {
                    console.error('Error loading saved codes:', error);
                    // Error display handled by app-controller
                    // const codesList = document.getElementById('saved-codes-list');
                    // if (codesList) {
                    //     codesList.innerHTML = `
                    //         <p class="error">Error: ${error.message || 'Failed to load saved codes'}</p>
                    //         <p>Please try again later or contact support.</p>
                    //     `;
                    // }
                    throw error;
                });
        }
    },
    
    // Display saved codes in the modal (Handled by app-controller)
    displaySavedCodes: function(codes) {
        // This function is now in app-controller
    },
    
    // Update the UI for a logged in user with enhanced save and load functionality (Handled by app-controller)
    updateUIForLoggedInUser: function() {
        // This function is now in app-controller
    },
    
    // Update the UI for a logged out user (Handled by app-controller)
    updateUIForLoggedOutUser: function() {
        // This function is now in app-controller
    },
    
    // Set up event listeners for auth-related elements (Handled by app-controller)
    setupAuthListeners: function() {
        // This function is now in app-controller
    },

    // Initialize auth buttons (Handled by app-controller)
    initializeAuthButtons: function() {
        // This function is now in app-controller
    },

    // Function to check if user can run code (for non-logged in users)
    canExecuteCode: function() {
        // This logic is now in basic-engine.js and advanced-engine.js
        // The guest limit is handled there.
        // This function should just return true if logged in, false otherwise.
        return this.currentUser !== null;
    },

    // Increment guest execution count (Handled by basic-engine.js)
    incrementGuestExecutionCount: function() {
        // This logic is now in basic-engine.js
    },

    // Get current user status
    getCurrentUser: function() {
        return this.currentUser;
    }
};

// Export auth to make it globally available
window.auth = auth;

// Initialize auth status on page load
document.addEventListener('DOMContentLoaded', () => {
    // In a real app, this would check session on backend
    // For now, we rely on login/register to set currentUser
    console.log("Auth module initialized. Guest execution count:", guestExecutionCount);
    // Trigger initial auth status check
    auth.checkAuthStatus();
});
