// Store the most recently executed code for retry after flag detection
let lastExecutedCode = '';
let futureFlags = {
    print_function: true,
    division: true,
    dunder_round: true,
    unicode_literals: true,
    annotations: true,
    generators: true,
    bankers_rounding: true,
    class_repr: true,
    inherit_from_object: true,
    super_args: true,
    octal_number_literal: true,
    python_version: true,
    exceptions: true,
    no_long_type: true,
    ceil_floor_int: true,
    silent_octal_literal: true
    // New flags will be added automatically
};

// Track code execution count for free usage limit
// Using a consistent approach without window object references
let codeExecutionCount = parseInt(localStorage.getItem('pythonPractice_execCount') || '0');
const MAX_FREE_EXECUTIONS = 6;

// Function to check if the user has reached their free execution limit
function checkExecutionLimit() {
    // Skip check if user is logged in
    if (typeof auth !== 'undefined' && auth.currentUser) {
        return true; // Logged in users have unlimited executions
    }
    
    // Check execution count for non-logged in users
    if (codeExecutionCount >= MAX_FREE_EXECUTIONS) {
        const output = document.getElementById('output');
        if (output) {
            output.textContent = 'Free usage limit reached. Please login to continue.';
        }
        
        // Show toast notification if available
        if (typeof showToast === 'function') {
            showToast('Free usage limit reached. Please login to continue.', 'error');
        }
        
        return false; // Prevent execution
    }
    
    // Show remaining runs toast if getting low
    const remainingRuns = MAX_FREE_EXECUTIONS - codeExecutionCount;
    if (remainingRuns <= 3 && remainingRuns > 0 && typeof showToast === 'function') {
        showToast(`${remainingRuns} free runs remaining`, 'warning');
    }
    
    return true; // Allow execution
}

// Function to increment execution count
function incrementExecutionCount() {
    // Only increment if user is not logged in
    if (typeof auth === 'undefined' || !auth.currentUser) {
        codeExecutionCount++;
        localStorage.setItem('pythonPractice_execCount', codeExecutionCount);
    }
}

// Custom input modal for Skulpt input()
function showInputModal(promptText) {
    return new Promise((resolve) => {
        // Create modal elements
        let modal = document.createElement('div');
        modal.id = 'skulpt-input-modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.background = 'rgba(0,0,0,0.4)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '9999';

        let box = document.createElement('div');
        box.style.background = '#fff';
        box.style.padding = '24px 32px';
        box.style.borderRadius = '8px';
        box.style.boxShadow = '0 2px 16px rgba(0,0,0,0.2)';
        box.style.display = 'flex';
        box.style.flexDirection = 'column';
        box.style.alignItems = 'stretch';
        box.style.minWidth = '280px';

        let label = document.createElement('label');
        label.textContent = promptText || 'Input:';
        label.style.marginBottom = '12px';
        label.style.fontWeight = 'bold';
        box.appendChild(label);

        let input = document.createElement('input');
        input.type = 'text';
        input.style.padding = '8px';
        input.style.fontSize = '16px';
        input.style.marginBottom = '12px';
        input.style.border = '1px solid #ccc';
        input.style.borderRadius = '4px';
        input.autofocus = true;
        box.appendChild(input);

        let btn = document.createElement('button');
        btn.textContent = 'Submit';
        btn.style.padding = '8px 16px';
        btn.style.fontSize = '16px';
        btn.style.background = '#007bff';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        box.appendChild(btn);

        // Allow Enter key to submit
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                btn.click();
            }
        });

        btn.onclick = function() {
            let val = input.value;
            document.body.removeChild(modal);
            resolve(val);
        };

        modal.appendChild(box);
        document.body.appendChild(modal);
        input.focus();
    });
}

// Configure Skulpt with Python 3 support
function configureSkulpt() {
    console.log('Sk object exists:', typeof Sk !== 'undefined');
    if (typeof Sk === 'undefined') {
        console.error('Skulpt not loaded!');
        return;
    }

    // Configure Skulpt with dynamically updated future flags
    Sk.configure({
        output: function(text) {
            const output = document.getElementById('output');
            if (output && output.textContent === "Running...") {
                output.textContent = text;
            } else if (output) {
                output.textContent += text;
            }
        },
        read: function(x) {
            if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
                throw "File not found: '" + x + "'";
            return Sk.builtinFiles["files"][x];
        },
        __future__: futureFlags,
        execLimit: 10000,
        timeoutMsg: function() {
            return "Program timed out. Possible infinite loop?";
        },
        inputfun: function(promptText) {
            // Return a promise for Skulpt async input
            return showInputModal(promptText);
        },
        inputfunTakesPrompt: true
    });
}

// Function to run Python code using Skulpt with automatic flag detection
function runPythonWithSkulpt(code, options = {}) {
    // Check execution limit before running code
    if (!checkExecutionLimit()) {
        return; // Exit if limit is reached
    }
    
    const output = document.getElementById('output');
    output.textContent = "Running...";
    lastExecutedCode = code; // Store the code for potential retry
    
    // Increment execution count before running code
    incrementExecutionCount();
    
    try {
        Sk.pre = "output";
        // Merge passed options with default configuration
        const config = {
            output: function(text) {
                if (output && output.textContent === "Running...") {
                    output.textContent = text;
                } else if (output) {
                    output.textContent += text;
                }
            },
            __future__: { ...futureFlags, ...(options.__future__ || {}) },
            read: function(x) {
                if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
                    throw "File not found: '" + x + "'";
                return Sk.builtinFiles["files"][x];
            },
            inputfun: function(promptText) {
                return showInputModal(promptText);
            },
            inputfunTakesPrompt: true,
            execLimit: 10000,
            timeoutMsg: function() {
                return "Program timed out. Possible infinite loop?";
            }
        };
        
        // Configure Skulpt with merged options
        Sk.configure(config);
        
        Sk.misceval.asyncToPromise(function() {
            return Sk.importMainWithBody("<stdin>", false, code, true);
        }).then(function() {
            if (output.textContent === "Running...") {
                output.textContent = "Program executed successfully (no output)";
            }
        }, function(err) {
            handleSkulptError(err, code);
        });
    } catch(err) {
        handleSkulptError(err, code);
    }
}

// Function to handle Skulpt errors and detect missing __future__ flags
function handleSkulptError(err, code) {
    const output = document.getElementById('output');
    const errMsg = err.toString();
    output.textContent = errMsg;
    
    // Check if error is about a missing __future__ flag
    const match = errMsg.match(/must specify Sk\.__future__\.(\w+) and it must be a boolean/);
    if (match && match[1]) {
        const missingFlag = match[1];
        console.log(`Auto-adding missing __future__ flag: ${missingFlag}`);
        
        // Add the missing flag
        futureFlags[missingFlag] = true;
        
        // Update Skulpt configuration with new flag
        Sk.configure({
            __future__: futureFlags
        });
        
        // Show a message that we're retrying with the new flag
        output.textContent = `Adding missing flag "${missingFlag}" and retrying...`;
        
        // Retry execution with the fixed flags after a short delay
        setTimeout(() => {
            runPythonWithSkulpt(code);
        }, 500);
    }
}

// Initialize Skulpt when the page loads
document.addEventListener('DOMContentLoaded', configureSkulpt);