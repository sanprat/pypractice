// UI Helper Functions for Python Practice

// Show a toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = 'toast';
    toast.classList.add(type); // 'info', 'success', 'error', 'warning'
    
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Example code templates
const codeExamples = {
    hello: `# Hello World Example
print("Hello, World!")

# Taking user input
name = input("What is your name? ")
print("Hello, " + name + "!")

# Using .format() for string formatting (Basic editor compatible)
print("Welcome to Python, {}!".format(name))`,

    variables: `# Variables Example
# String variables
name = "Python Coder"
language = "Python"

# Numeric variables
age = 25
version = 3.10
is_fun = True

# Print variables
print("Name:", name)
print("Programming in:", language)
print("Age:", age)
print("Python version:", version)
print("Is Python fun?", is_fun)

# String operations
print("Name uppercase:", name.upper())
print("Language lowercase:", language.lower())

# Math operations
years_experience = age - 20
print("Years of experience:", years_experience)`,

    conditionals: `# Conditional Statements Example
score = 85

# Basic if-else
if score >= 90:
    print("Grade: A")
elif score >= 80:
    print("Grade: B")
elif score >= 70:
    print("Grade: C")
elif score >= 60:
    print("Grade: D")
else:
    print("Grade: F")
    
# Get user input for testing
user_score = int(input("Enter your score (0-100): "))

# Check user score
if user_score > 100 or user_score < 0:
    print("Invalid score!")
else:
    if user_score >= 70:
        print("You passed!")
    else:
        print("You need to study more.")`,

    loops: `# Loops Example
# For loop with range
print("Counting from 0 to 4:")
for i in range(5):
    print("Count:", i)
    
# For loop with list
print("\\nLooping through a list:")
fruits = ["apple", "banana", "cherry", "dragonfruit"]
for fruit in fruits:
    print("Fruit:", fruit)
    
# While loop
print("\\nWhile loop example:")
count = 0
while count < 5:
    print("While count:", count)
    count += 1
    
# Break and continue
print("\\nBreak example:")
for i in range(10):
    if i == 5:
        break
    print("Number before break:", i)

print("\\nContinue example:")
for i in range(5):
    if i == 2:
        continue
    print("Number with continue:", i)`,

    functions: `# Functions Example
# Basic function
def greet(name):
    return "Hello, " + name + "!"
    
# Function with default parameter
def greet_with_time(name, time="morning"):
    return "Good {}, {}!".format(time, name)
    
# Function with multiple parameters
def add_numbers(a, b):
    return a + b
    
# Call the functions
print(greet("Python User"))
print(greet_with_time("Coder"))
print(greet_with_time("Developer", "evening"))
print("Sum:", add_numbers(5, 10))

# Function with multiple returns
def get_min_max(numbers):
    if not numbers:
        return None, None
    return min(numbers), max(numbers)
    
# Using tuple unpacking with function returns
my_list = [23, 45, 9, 17, 82]
minimum, maximum = get_min_max(my_list)
print("Min:", minimum, "Max:", maximum)`
};

const advancedCodeExamples = {
    welcome_advanced: `print("Simple advanced test")`,
    fstrings: `# F-Strings Example
# F-strings provide a concise and convenient way to embed Python expressions inside string literals.
name = "Alice"
age = 30
print(f"My name is {name} and I am {age} years old.")

# You can include expressions too:
price = 19.99
vat_rate = 0.20
total_price = price * (1 + vat_rate)
print(f"Price: \${price:.2f}, VAT: {vat_rate:.0%}, Total: \${total_price:.2f}")

# Multi-line f-strings
message = (
    f"Dear {name},\\n"
    f"Thank you for your purchase of \${total_price:.2f}.\\n"
    f"We hope you enjoy it!"
)
print(message)
`,
    list_comprehensions: `# List Comprehensions Example
# A concise way to create lists.
# Basic list comprehension
squares = [x**2 for x in range(10)]
print(f"Squares from 0 to 9: {squares}")

# With a condition
even_squares = [x**2 for x in range(10) if x % 2 == 0]
print(f"Even squares: {even_squares}")

# Nested list comprehensions (e.g., flatten a list of lists)
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flattened = [num for row in matrix for num in row]
print(f"Flattened matrix: {flattened}")

# Dictionary comprehension
squared_dict = {x: x**2 for x in range(5)}
print(f"Squared dictionary: {squared_dict}")
`,
    classes_simple: `# Simple Class Example
class Dog:
    # Class attribute
    species = "Canis familiaris"

    def __init__(self, name, age):
        # Instance attributes
        self.name = name
        self.age = age

    def description(self):
        return f"{self.name} is {self.age} years old."

    def speak(self, sound):
        return f"{self.name} says {sound}!"

# Create Dog objects (instances)
buddy = Dog("Buddy", 5)
lucy = Dog("Lucy", 3)

print(f"{buddy.name} is a {buddy.species}.")
print(buddy.description())
print(lucy.speak("Woof"))
`
};

// Keep track of the current editor mode
let currentEditorMode = 'basic'; // 'basic' or 'advanced'

// Authentication related functions
const auth = {
    // Configuration - set to 'mock' for localStorage based auth or 'php' for server backend
    mode: 'php', // Change to 'php' when deploying to Hostinger
    
    // Base URL for API endpoints - UPDATED to use root path for Hostinger
    apiBaseUrl: '', // Empty string means same directory as current page
    
    // Current user information
    currentUser: null,
    
    // Initialize authentication system
    init: function() {
        // Check if user is already logged in
        this.checkAuthStatus();
        
        // Set up event listeners for auth-related buttons
        this.setupAuthListeners();
        
        // Initialize execution counter
        this.initExecutionCounter();
    },
    
    // Check if user is logged in
    checkAuthStatus: function() {
        if (this.mode === 'mock') {
            // Check localStorage for saved user info
            const savedUser = localStorage.getItem('pythonPractice_user');
            if (savedUser) {
                try {
                    this.currentUser = JSON.parse(savedUser);
                    this.updateUIForLoggedInUser();
                    return true;
                } catch (e) {
                    console.error('Failed to parse saved user data');
                    localStorage.removeItem('pythonPractice_user');
                }
            }
            return false;
        } else {
            // Use PHP backend to check session status
            fetch(`${this.apiBaseUrl}/login.php?action=check`)
                .then(response => response.json())
                .then(data => {
                    if (data.success && data.logged_in) {
                        this.currentUser = {
                            id: data.user_id,
                            username: data.username
                        };
                        this.updateUIForLoggedInUser();
                        return true;
                    }
                    return false;
                })
                .catch(error => {
                    console.error('Auth check failed:', error);
                    return false;
                });
        }
    },

    // Initialize and update the execution counter
    initExecutionCounter: function() {
        // Create execution counter if it doesn't exist
        if (!localStorage.getItem('pythonPractice_execCount')) {
            localStorage.setItem('pythonPractice_execCount', '0');
        }
        
        // Update UI with current count
        this.updateExecutionCounter();
    },

    // Update the execution counter in the UI
    updateExecutionCounter: function() {
        // Only if user is not logged in
        if (this.currentUser) return;
        
        const count = parseInt(localStorage.getItem('pythonPractice_execCount') || '0');
        const remainingRuns = 6 - count;
        
        // We don't need to create a permanent counter element anymore
        // Only show notifications when runs are low
        if (remainingRuns <= 2 && remainingRuns > 0) {
            showToast(`${remainingRuns} free runs remaining`, 'warning');
        } else if (remainingRuns <= 0) {
            showToast('Free usage limit reached. Please login to continue.', 'error');
        }
        
        // Remove any existing counter elements that might be present
        const counterEl = document.getElementById('execution-counter');
        if (counterEl && counterEl.parentNode) {
            counterEl.parentNode.removeChild(counterEl);
        }
    },

    // Increment the execution counter
    incrementExecutionCounter: function() {
        // Only track if user is not logged in
        if (this.currentUser) return true;
        
        const count = parseInt(localStorage.getItem('pythonPractice_execCount') || '0');
        const newCount = count + 1;
        
        // Update localStorage
        localStorage.setItem('pythonPractice_execCount', newCount.toString());
        
        // Update UI
        this.updateExecutionCounter();
        
        // Return whether user can still run code
        return newCount <= 6;
    },
    
    // Register a new user
    register: function(username, email, password) {
        if (this.mode === 'mock') {
            // Simple validation
            const existingUsers = JSON.parse(localStorage.getItem('pythonPractice_users') || '[]');
            const userExists = existingUsers.some(u => u.username === username || u.email === email);
            
            if (userExists) {
                return Promise.reject({ message: 'Username or email already exists' });
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
            return fetch(`${this.apiBaseUrl}/register.php`, {
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
                    // Show success message
                    showToast('Registration successful! Please log in.', 'success');
                    return data;
                } else {
                    throw new Error(data.message || 'Registration failed');
                }
            })
            .catch(error => {
                console.error('Registration error:', error);
                showToast('Registration error: ' + error.message, 'error');
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
                return Promise.reject({ message: 'Invalid username or password' });
            }
            
            // Save current user to localStorage
            this.currentUser = {
                id: user.id,
                username: user.username,
                email: user.email
            };
            
            localStorage.setItem('pythonPractice_user', JSON.stringify(this.currentUser));
            
            // Reset execution count on successful login
            localStorage.setItem('pythonPractice_execCount', '0');
            if (typeof codeExecutionCount !== 'undefined') {
                codeExecutionCount = 0;
            }
            
            // Return success
            return Promise.resolve({
                success: true,
                message: 'Login successful',
                user_id: user.id,
                username: user.username
            });
        } else {
            // Use PHP backend with improved error handling
            return fetch(`${this.apiBaseUrl}/login.php`, {
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
                    localStorage.setItem('pythonPractice_execCount', '0');
                    if (typeof codeExecutionCount !== 'undefined') {
                        codeExecutionCount = 0;
                    }
                    
                    // Hide the execution counter when logged in
                    const counterEl = document.getElementById('execution-counter');
                    if (counterEl) counterEl.style.display = 'none';
                }
                return data;
            })
            .catch(error => {
                console.error('Login error:', error);
                showToast('Login error: ' + error.message, 'error');
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
            
            // Update UI
            this.updateUIForLoggedOutUser();
            return Promise.resolve({ success: true });
        } else {
            // Use PHP backend
            return fetch(`${this.apiBaseUrl}/login.php?action=logout`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        this.currentUser = null;
                        this.updateUIForLoggedOutUser();
                    }
                    return data;
                });
        }
    },
    
    // Save user code with title dialog
    saveCode: function(code) {
        if (!this.currentUser) {
            showToast('Please login to save your code', 'error');
            return Promise.reject({ message: 'Authentication required' });
        }
        
        // Create save dialog if it doesn't exist
        let saveDialog = document.getElementById('save-code-dialog');
        if (!saveDialog) {
            saveDialog = document.createElement('div');
            saveDialog.id = 'save-code-dialog';
            saveDialog.className = 'modal';
            saveDialog.innerHTML = `
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>Save Code</h2>
                    <form id="save-code-form">
                        <div class="form-group">
                            <label for="code-title">Title</label>
                            <input type="text" id="code-title" name="title" placeholder="Enter a title for your code" required>
                        </div>
                        <div class="form-actions">
                            <button type="submit">Save</button>
                        </div>
                    </form>
                </div>
            `;
            document.body.appendChild(saveDialog);
            
            // Add event listeners for the save dialog
            const closeBtn = saveDialog.querySelector('.close');
            closeBtn.addEventListener('click', () => saveDialog.style.display = 'none');
            
            window.addEventListener('click', (e) => {
                if (e.target === saveDialog) saveDialog.style.display = 'none';
            });
        }
        
        // Show the save dialog
        saveDialog.style.display = 'block';
        
        // Handle form submission
        const saveForm = document.getElementById('save-code-form');
        const handleSave = (e) => {
            e.preventDefault();
            const title = document.getElementById('code-title').value;
            
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
                
                showToast('Code saved successfully', 'success');
                saveDialog.style.display = 'none';
                saveForm.reset();
            } else {
                // Use PHP backend with improved error handling
                fetch(`${this.apiBaseUrl}/save_progress.php`, {
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
                        showToast('Code saved successfully', 'success');
                        saveDialog.style.display = 'none';
                        saveForm.reset();
                    } else {
                        throw new Error(data.message || 'Failed to save code');
                    }
                })
                .catch(error => {
                    console.error('Save error:', error);
                    showToast(error.message || 'Failed to save code', 'error');
                });
            }
        };
        
        saveForm.removeEventListener('submit', handleSave);
        saveForm.addEventListener('submit', handleSave);
    },
    
    // Load user's saved codes
    loadSavedCodes: function() {
        if (!this.currentUser) {
            showToast('Please login to view your saved codes', 'error');
            return;
        }
        
        // Create my codes modal if it doesn't exist
        let myCodesModal = document.getElementById('my-codes-modal');
        if (!myCodesModal) {
            myCodesModal = document.createElement('div');
            myCodesModal.id = 'my-codes-modal';
            myCodesModal.className = 'modal';
            myCodesModal.innerHTML = `
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>My Saved Codes</h2>
                    <div id="saved-codes-list" class="saved-codes-list">
                        <p class="loading">Loading your saved codes...</p>
                    </div>
                </div>
            `;
            document.body.appendChild(myCodesModal);
            
            // Add event listeners for the modal
            const closeBtn = myCodesModal.querySelector('.close');
            closeBtn.addEventListener('click', () => myCodesModal.style.display = 'none');
            
            window.addEventListener('click', (e) => {
                if (e.target === myCodesModal) myCodesModal.style.display = 'none';
            });
        }
        
        // Show the modal
        myCodesModal.style.display = 'block';
        
        // Load saved codes
        if (this.mode === 'mock') {
            const savedCodes = JSON.parse(localStorage.getItem(`pythonPractice_codes_${this.currentUser.id}`) || '[]');
            this.displaySavedCodes(savedCodes);
        } else {
            // Log the API URL for debugging
            console.log('Fetching saved codes from: ' + `${this.apiBaseUrl}/get_codes.php`);
            
            // Clear any previous error messages
            const codesList = document.getElementById('saved-codes-list');
            if (codesList) {
                codesList.innerHTML = '<p class="loading">Loading your saved codes...</p>';
            }
            
            // Fetch saved codes with improved error handling
            fetch(`${this.apiBaseUrl}/get_codes.php`)
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
                        
                        this.displaySavedCodes(codes);
                    } else {
                        throw new Error(data.message || 'Failed to load saved codes');
                    }
                })
                .catch(error => {
                    console.error('Error loading saved codes:', error);
                    const codesList = document.getElementById('saved-codes-list');
                    if (codesList) {
                        codesList.innerHTML = `
                            <p class="error">Error: ${error.message || 'Failed to load saved codes'}</p>
                            <p>Please try again later or contact support.</p>
                        `;
                    }
                });
        }
    },
    
    // Display saved codes in the modal
    displaySavedCodes: function(codes) {
        const codesList = document.getElementById('saved-codes-list');
        if (!codesList) return;
        
        if (!codes || !codes.length) {
            codesList.innerHTML = '<p class="no-codes">You have no saved codes yet.</p>';
            return;
        }
        
        codesList.innerHTML = codes.map(code => `
            <div class="saved-code-item" data-id="${code.id}">
                <h3>${code.title}</h3>
                <p class="code-date">Last modified: ${new Date(code.last_modified).toLocaleString()}</p>
                <div class="code-actions">
                    <button class="load-code-btn" data-code="${encodeURIComponent(code.code_content)}">
                        <i class="fas fa-code"></i> Load
                    </button>
                    <button class="delete-code-btn">
                        <i class="fas fa-trash-alt"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners for load and delete buttons
        codesList.querySelectorAll('.load-code-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const code = decodeURIComponent(btn.dataset.code);
                if (typeof editor !== 'undefined') {
                    editor.setValue(code);
                    showToast('Code loaded successfully', 'success');
                    document.getElementById('my-codes-modal').style.display = 'none';
                }
            });
        });
        
        codesList.querySelectorAll('.delete-code-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const codeItem = btn.closest('.saved-code-item');
                const codeId = codeItem.dataset.id;
                
                if (confirm('Are you sure you want to delete this code?')) {
                    if (this.mode === 'mock') {
                        const savedCodes = JSON.parse(localStorage.getItem(`pythonPractice_codes_${this.currentUser.id}`) || '[]');
                        const updatedCodes = savedCodes.filter(c => c.id !== parseInt(codeId));
                        localStorage.setItem(`pythonPractice_codes_${this.currentUser.id}`, JSON.stringify(updatedCodes));
                        this.displaySavedCodes(updatedCodes);
                        showToast('Code deleted successfully', 'success');
                    } else {
                        fetch(`${this.apiBaseUrl}/delete_code.php`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ id: codeId })
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                codeItem.remove();
                                showToast('Code deleted successfully', 'success');
                                if (!codesList.children.length) {
                                    codesList.innerHTML = '<p class="no-codes">You have no saved codes yet.</p>';
                                }
                            } else {
                                throw new Error(data.message || 'Failed to delete code');
                            }
                        })
                        .catch(error => {
                            showToast(error.message || 'Failed to delete code', 'error');
                        });
                    }
                }
            });
        });
    },
    
    // Update the UI for a logged in user with enhanced save and load functionality
    updateUIForLoggedInUser: function() {
        const authButtons = document.querySelector('.auth-buttons');
        if (!authButtons) return;
        
        // Clear existing buttons
        authButtons.innerHTML = '';
        
        // Create user profile dropdown
        const userProfile = document.createElement('div');
        userProfile.className = 'user-profile';
        userProfile.innerHTML = `
            <button class="user-profile-button">
                <i class="fas fa-user-circle"></i>
                ${this.currentUser.username}
            </button>
            <div class="user-dropdown">
                <a href="#" id="save-code-btn"><i class="fas fa-save"></i> Save Code</a>
                <a href="#" id="my-codes-btn"><i class="fas fa-folder"></i> My Codes</a>
                <a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a>
            </div>
        `;
        
        authButtons.appendChild(userProfile);
        
        // Add event listener for dropdown toggle
        const profileButton = userProfile.querySelector('.user-profile-button');
        profileButton.addEventListener('click', function() {
            userProfile.classList.toggle('active');
        });
        
        // Add event listener for logout
        const logoutBtn = userProfile.querySelector('#logout-btn');
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout()
                .then(() => showToast('Logged out successfully', 'info'))
                .catch(err => showToast('Logout failed', 'error'));
        });
        
        // Add event listener for save code
        const saveCodeBtn = userProfile.querySelector('#save-code-btn');
        saveCodeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof editor !== 'undefined') {
                const code = editor.getValue();
                this.saveCode(code);
            } else {
                showToast('Editor not ready', 'error');
            }
        });
        
        // Add event listener for my codes
        const myCodesBtn = userProfile.querySelector('#my-codes-btn');
        myCodesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.loadSavedCodes();
        });
        
        // Close dropdown when clicking elsewhere
        document.addEventListener('click', (e) => {
            if (!userProfile.contains(e.target)) {
                userProfile.classList.remove('active');
            }
        });
    },
    
    // Update the UI for a logged out user
    updateUIForLoggedOutUser: function() {
        const authButtons = document.querySelector('.auth-buttons');
        if (!authButtons) return;
        
        // Clear existing content
        authButtons.innerHTML = '';
        
        // Add login and register buttons
        authButtons.innerHTML = `
            <button id="login-btn"><i class="fas fa-sign-in-alt"></i> Login</button>
            <button id="register-btn"><i class="fas fa-user-plus"></i> Register</button>
        `;
        
        // Set up event listeners for the new buttons
        initializeAuthButtons();
        
        // Show execution counter
        this.updateExecutionCounter();
    },
    
    // Set up event listeners for auth-related elements
    setupAuthListeners: function() {
        // Login modal interactions
        const loginModal = document.getElementById('login-modal');
        const registerModal = document.getElementById('register-modal');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const closeBtns = document.querySelectorAll('.modal .close');
        
        // Close modal buttons
        closeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                loginModal.style.display = 'none';
                registerModal.style.display = 'none';
            });
        });
        
        // Switch between modals
        document.getElementById('show-register').addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.style.display = 'none';
            registerModal.style.display = 'block';
        });
        
        document.getElementById('show-login').addEventListener('click', function(e) {
            e.preventDefault();
            registerModal.style.display = 'none';
            loginModal.style.display = 'block';
        });
        
        // Login form submission
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            const messageEl = document.getElementById('login-message');
            
            // Reset message
            messageEl.textContent = '';
            messageEl.className = 'form-message';
            
            // Show loading indicator
            messageEl.textContent = 'Logging in...';
            messageEl.style.display = 'block';
            
            // Attempt login
            this.login(username, password)
                .then(response => {
                    if (response.success) {
                        messageEl.textContent = 'Login successful! Redirecting...';
                        messageEl.classList.add('success');
                        
                        // Update UI and close modal
                        setTimeout(() => {
                            loginModal.style.display = 'none';
                            this.updateUIForLoggedInUser();
                            showToast(`Welcome back, ${username}!`, 'success');
                        }, 1000);
                    } else {
                        throw new Error(response.message || 'Login failed');
                    }
                })
                .catch(error => {
                    messageEl.textContent = error.message || 'Invalid username or password';
                    messageEl.classList.add('error');
                });
        });
        
        // Register form submission
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('register-username').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            const messageEl = document.getElementById('register-message');
            
            // Reset message
            messageEl.textContent = '';
            messageEl.className = 'form-message';
            
            // Validate password match
            if (password !== confirmPassword) {
                messageEl.textContent = 'Passwords do not match';
                messageEl.classList.add('error');
                messageEl.style.display = 'block';
                return;
            }
            
            // Show loading indicator
            messageEl.textContent = 'Creating account...';
            messageEl.style.display = 'block';
            
            // Attempt registration
            this.register(username, email, password)
                .then(response => {
                    if (response.success) {
                        messageEl.textContent = 'Registration successful! Please log in.';
                        messageEl.classList.add('success');
                        
                        // Clear form
                        registerForm.reset();
                        
                        // Switch to login modal after delay
                        setTimeout(() => {
                            registerModal.style.display = 'none';
                            loginModal.style.display = 'block';
                            showToast('Account created successfully!', 'success');
                        }, 2000);
                    } else {
                        throw new Error(response.message || 'Registration failed');
                    }
                })
                .catch(error => {
                    messageEl.textContent = error.message || 'Registration failed';
                    messageEl.classList.add('error');
                });
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === loginModal) loginModal.style.display = 'none';
            if (e.target === registerModal) registerModal.style.display = 'none';
        });
    }
};

// Initialize tabs functionality
function initializeTabs() {
    const tabs = document.querySelectorAll('.tab');
    const exampleSelect = document.getElementById('example-select');

    function populateExamples(mode) {
        const examples = mode === 'advanced' ? advancedCodeExamples : codeExamples;
        const defaultExampleKey = mode === 'advanced' ? 'welcome_advanced' : 'hello';
        
        exampleSelect.innerHTML = ''; // Clear existing options

        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = `Select an example (${mode})`;
        exampleSelect.appendChild(defaultOption);

        for (const key in examples) {
            const option = document.createElement('option');
            option.value = key;
            // Convert key to a more readable title (e.g., hello_world -> Hello World)
            option.textContent = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            exampleSelect.appendChild(option);
        }
        
        // Load default example for the mode
        if (typeof editor !== 'undefined' && examples[defaultExampleKey]) {
            editor.setValue(examples[defaultExampleKey]);
            // Do not show toast for default load on tab switch, only for explicit selection
        }
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            currentEditorMode = tab.getAttribute('data-tab'); // 'basic' or 'advanced'
            populateExamples(currentEditorMode);
            
            // Optional: Show a toast indicating mode switch
            // showToast(`${currentEditorMode.charAt(0).toUpperCase() + currentEditorMode.slice(1)} Editor activated`, 'info');
        });
    });

    // Initial population for the default active tab (basic)
    populateExamples('basic');
}

// Initialize example selector
function initializeExampleSelector() {
    const exampleSelect = document.getElementById('example-select');
    if (!exampleSelect) return;
    
    exampleSelect.addEventListener('change', function() {
        const selectedExampleKey = this.value;
        if (!selectedExampleKey) return;
        
        const examples = currentEditorMode === 'advanced' ? advancedCodeExamples : codeExamples;
        
        if (examples[selectedExampleKey] && typeof editor !== 'undefined') {
            editor.setValue(examples[selectedExampleKey]);
            const exampleName = this.options[this.selectedIndex].text;
            showToast(`${exampleName} example loaded`, 'info');
        }
    });
}

// Initialize auth buttons
function initializeAuthButtons() {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            document.getElementById('login-modal').style.display = 'block';
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            document.getElementById('register-modal').style.display = 'block';
        });
    }
}

// Function to check if user can run code (for non-logged in users)
function canRunCode() {
    // If user is logged in, always allow code execution
    if (auth.currentUser) return true;
    
    // Check execution count for non-logged in users
    return auth.incrementExecutionCounter();
}

// Initialize all UI components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeExampleSelector();
    
    // Initialize authentication system
    auth.init();
});

// Export auth to make it globally available
window.auth = auth;
window.codeExamples = codeExamples;
