// Interface for the Basic Editor's Python engine (Skulpt)

// Store the most recently executed code for retry after flag detection
let lastExecutedCodeBasic = '';
let futureFlagsBasic = {
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

// Custom input modal for Skulpt input() - adapted from original skulpt-setup.js
function showInputModalBasic(promptText) {
    return new Promise((resolve) => {
        // Create modal elements
        let modal = document.createElement('div');
        modal.id = 'skulpt-input-modal'; // Keep ID for potential CSS
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


// Configure Skulpt with Python 3 support - adapted from original skulpt-setup.js
function configureSkulptBasic() {
    console.log('Configuring Skulpt for Basic Mode...');
    if (typeof Sk === 'undefined') {
        console.error('Skulpt not loaded!');
        return;
    }

    Sk.configure({
        output: function(text) {
            const output = document.getElementById('output');
            if (output) {
                 // Clear "Running..." message on first output
                if (output.textContent === "Running...") {
                    output.textContent = text;
                } else {
                    output.textContent += text;
                }
            }
        },
        read: function(x) {
            if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
                throw "File not found: '" + x + "'";
            return Sk.builtinFiles["files"][x];
        },
        __future__: futureFlagsBasic,
        execLimit: 10000, // Basic limit
        timeoutMsg: function() {
            return "Program timed out. Possible infinite loop?";
        },
        inputfun: function(promptText) {
            return showInputModalBasic(promptText);
        },
        inputfunTakesPrompt: true
    });
}

// Function to run Python code using Skulpt with automatic flag detection
async function runBasicPython(code) {
    const output = document.getElementById('output');
    if (!output) return;

    output.textContent = "Running...";
    lastExecutedCodeBasic = code; // Store the code for potential retry

    try {
        Sk.pre = "output";
        // Use the current futureFlagsBasic
        const config = {
            output: function(text) {
                 if (output.textContent === "Running...") {
                    output.textContent = text;
                } else {
                    output.textContent += text;
                }
            },
            __future__: futureFlagsBasic,
            read: function(x) {
                if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
                    throw "File not found: '" + x + "'";
                return Sk.builtinFiles["files"][x];
            },
            inputfun: function(promptText) {
                return showInputModalBasic(promptText);
            },
            inputfunTakesPrompt: true,
            execLimit: 10000,
            timeoutMsg: function() {
                return "Program timed out. Possible infinite loop?";
            }
        };

        Sk.configure(config);

        await Sk.misceval.asyncToPromise(function() {
            return Sk.importMainWithBody("<stdin>", false, code, true);
        });

        if (output.textContent === "Running...") {
            output.textContent = "Program executed successfully (no output)";
        }

    } catch(err) {
        handleBasicError(err, code);
    }
}

// Function to handle Skulpt errors and detect missing __future__ flags or advanced features
function handleBasicError(err, code) {
    const output = document.getElementById('output');
    const errMsg = err.toString();
    output.textContent = errMsg;

    // Check if error is about a missing __future__ flag (Skulpt specific)
    const flagMatch = errMsg.match(/must specify Sk\.__future__\.(\w+) and it must be a boolean/);
    if (flagMatch && flagMatch[1]) {
        const missingFlag = flagMatch[1];
        console.log(`Auto-adding missing __future__ flag: ${missingFlag}`);

        // Add the missing flag
        futureFlagsBasic[missingFlag] = true;

        // Update Skulpt configuration with new flag
        Sk.configure({
            __future__: futureFlagsBasic
        });

        // Show a message that we're retrying with the new flag
        output.textContent = `Adding missing flag "${missingFlag}" and retrying...`;

        // Retry execution with the fixed flags after a short delay
        setTimeout(() => {
            runBasicPython(code);
        }, 500);
        return; // Handled this error
    }

    // Option A: Detect errors indicative of advanced features not supported by Skulpt
    // This is a heuristic and might need refinement based on common Skulpt limitations
    const advancedFeatureKeywords = [
        "ImportError", // Often for unsupported libraries
        "AttributeError", // For features on built-ins that Skulpt doesn't implement
        "TypeError", // For unsupported operations
        "SyntaxError", // For very modern syntax Skulpt might not support
        "not implemented" // Skulpt's internal "not implemented" messages
    ];

    const isAdvancedError = advancedFeatureKeywords.some(keyword => errMsg.includes(keyword));

    // If it looks like an advanced feature error and the user is NOT logged in
    if (isAdvancedError && (typeof window.auth === 'undefined' || !window.auth.getCurrentUser())) {
         if (typeof showToast === 'function') {
            showToast('Please upgrade to Advanced by signing in for full Python features.', 'info');
        }
        // Optionally clear output or leave the error message
        // output.textContent = 'Error: This feature requires the Advanced Mode.';
    } else {
        // It's a regular Skulpt error or an advanced error for a logged-in user
        console.error("Skulpt Error:", err);
        // The error message is already in the output
    }
}

// Initialize Skulpt configuration on DOMContentLoaded
document.addEventListener('DOMContentLoaded', configureSkulptBasic);

// Export run function
window.runBasicPython = runBasicPython;
