/**
 * Hostinger-specific UI JavaScript
 * This file is used when the app is deployed to Hostinger
 */

// Make sure we don't override any existing auth settings from enhanced-ui.js
if (typeof auth !== 'undefined') {
    // Set authentication mode to PHP for server-side authentication
    auth.mode = 'php';
    
    // Update API base URL if needed
    auth.apiBaseUrl = '/php';
}

// Example code collection - use the standard naming to match enhanced-ui.js
const examples = {
    hello: `# Hello World Example
print("Hello, World!")
name = "Python Coder"
print("Welcome to Python Practice, {}!".format(name))`,

    variables: `# Variables Example
# Strings
name = "Python Coder"
print("Hello, " + name)

# Numbers
age = 25
print("Age:", age)
print("Next year:", age + 1)

# Boolean
is_beginner = True
print("Beginner:", is_beginner)

# Lists
fruits = ["apple", "banana", "cherry"]
print("Fruits:", fruits)
print("First fruit:", fruits[0])
print("Last fruit:", fruits[-1])

# Add to list
fruits.append("orange")
print("Updated fruits:", fruits)`,

    conditionals: `# Conditionals Example
age = 20

if age < 18:
    print("You are a minor")
elif age >= 18 and age < 65:
    print("You are an adult")
else:
    print("You are a senior")
    
# One-line conditional (ternary-like)
is_adult = "Yes" if age >= 18 else "No"
print("Is adult?", is_adult)

# Logical operators
has_license = True
can_drive = has_license and age >= 18
print("Can drive?", can_drive)`,

    loops: `# Loops Example
# For loop with range
print("Counting:")
for i in range(5):
    print(i)

# For loop with list
fruits = ["apple", "banana", "cherry"]
print("\\nFruits:")
for fruit in fruits:
    print(fruit)

# While loop
print("\\nWhile loop:")
count = 0
while count < 5:
    print(count)
    count += 1

# Break and continue
print("\\nBreak example:")
for i in range(10):
    if i > 5:
        break
    print(i)

print("\\nContinue example:")
for i in range(10):
    if i % 2 == 0:
        continue
    print(i)`,

    functions: `# Functions Example
# Basic function
def greet(name):
    return "Hello, " + name + "!"

print(greet("Python Coder"))

# Function with default parameter
def greet_with_time(name, time="morning"):
    return "Good " + time + ", " + name + "!"

print(greet_with_time("Python Coder"))
print(greet_with_time("Python Coder", "evening"))

# Function with multiple returns
def check_number(num):
    if num > 0:
        return "Positive"
    elif num < 0:
        return "Negative"
    else:
        return "Zero"

print(check_number(10))
print(check_number(-5))
print(check_number(0))

# Function with multiple parameters
def calculate_rectangle_area(length, width):
    return length * width

print("Rectangle area:", calculate_rectangle_area(5, 3))`
};

// Function to show toast notifications if not already defined
if (typeof showToast === 'undefined') {
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
    
    // Expose the showToast function globally
    window.showToast = showToast;
}

// Initialize the example selector dropdown
function initializeExampleSelector() {
    const exampleSelect = document.getElementById('example-select');
    
    if (exampleSelect && typeof editor !== 'undefined') {
        exampleSelect.addEventListener('change', function() {
            const selected = this.value;
            if (selected && examples[selected]) {
                editor.setValue(examples[selected]);
                
                // Show toast notification when example is loaded
                if (typeof showToast === 'function') {
                    showToast(`${this.options[this.selectedIndex].text} loaded`, 'info');
                }
            }
            
            // Reset selector to default after selection
            setTimeout(() => {
                exampleSelect.value = "";
            }, 300);
        });
        
        console.log('Example selector initialized');
    } else {
        console.warn('Example selector or editor not found');
    }
}

// Add CSS-specific overrides for Hostinger environment
document.addEventListener('DOMContentLoaded', function() {
    // Make sure we handle full width content properly
    if (document.querySelector('.main.full-width')) {
        console.log('Applying full-width style overrides for Hostinger');
    }
    
    // If there's a clear output button, make sure it's working
    const clearOutputBtn = document.getElementById('clear-output');
    if (clearOutputBtn) {
        clearOutputBtn.addEventListener('click', function() {
            document.getElementById('output').textContent = 'Output cleared';
            if (typeof showToast === 'function') {
                showToast('Output cleared', 'info');
            }
        });
    }
    
    // Initialize example selector after DOM is fully loaded and editor is available
    // We use a small delay to ensure editor is fully initialized
    setTimeout(() => {
        initializeExampleSelector();
    }, 300);
});