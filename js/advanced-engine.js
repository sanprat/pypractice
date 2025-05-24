// Interface for the Advanced Editor's Python engine (Pyodide)

// Global state
let pyodideReady = false;
let pyodideLoading = false;
let pyodideInstance = null;

// Display toast messages safely (using ui-helpers)
function safeToastAdvanced(message, type) {
    console.log(`[Advanced Python]: ${message}`);
    if (typeof window.showToast === 'function') {
        window.showToast(message, type || 'info');
    }
    const output = document.getElementById('output');
    if (output) {
        output.textContent = message;
    }
}

// Core function to run Python code with Pyodide
async function runAdvancedPython(code) {
    const output = document.getElementById('output');
    if (!output) return;

    // Check execution limit using auth module (primarily for consistency, logged-in users have no limit)
     if (typeof window.auth === 'undefined' || !window.auth.canExecuteCode()) {
        // auth module will handle showing the message
        return;
    }

    // Update output immediately to provide feedback
    output.textContent = "Preparing Advanced Python environment...";

    // First, make sure Pyodide is loaded
    if (!pyodideReady && !pyodideLoading) {
        await loadPyodideCore();
    }

    // Check if Pyodide has gone stale
    if (pyodideReady && pyodideInstance) {
        try {
            await pyodideInstance.runPythonAsync('1+1');
        } catch (e) {
            console.warn("Pyodide connection seems stale, reloading:", e);
            pyodideReady = false;
            pyodideInstance = null;
            await loadPyodideCore();
        }
    }

    // If it's still loading, show a message and wait
    if (pyodideLoading) {
        output.textContent = "Advanced Python engine is still loading, please wait...";
        await waitForPyodide(15); // Wait up to 15 seconds
        if (!pyodideReady) {
            output.textContent = "Advanced Python engine took too long to load. Please refresh the page.";
            return;
        }
    }

    // If Pyodide failed to load
    if (!pyodideReady || !pyodideInstance) {
        output.textContent = "Advanced Python engine is not available.";
        return;
    }

    try {
        // Execute the code with timeout protection
        output.textContent = "Running code...";

        // Prepare Python environment for this execution
        await pyodideInstance.runPythonAsync(`
import sys, io

class OutputCapture:
    def __init__(self):
        self.value = ""
    def write(self, text):
        self.value += text
    def flush(self):
        pass

stdout_capture = OutputCapture()
stderr_capture = OutputCapture()
old_stdout = sys.stdout
old_stderr = sys.stderr
sys.stdout = stdout_capture
sys.stderr = stderr_capture
`);

        // Run the code with a 10-second timeout
        const result = await executeWithTimeout(async () => {
            return await pyodideInstance.runPythonAsync(code);
        }, 10000);

        // Get output and restore streams
        const stdout = await pyodideInstance.runPythonAsync("stdout_capture.value");
        const stderr = await pyodideInstance.runPythonAsync("stderr_capture.value");

        await pyodideInstance.runPythonAsync(`
sys.stdout = old_stdout
sys.stderr = old_stderr
`);

        // Format the combined output
        let finalOutput = "";
        if (stdout) finalOutput += stdout;
        if (stderr) {
            if (finalOutput && !finalOutput.endsWith('\n')) finalOutput += '\n';
            finalOutput += stderr;
        }

        // Add the return value if meaningful
        if (result !== undefined && result !== null && result.toString() !== "None") {
            if (finalOutput && !finalOutput.endsWith('\n')) finalOutput += '\n';
            finalOutput += "=> " + result.toString();
        }

        // Display the result
        output.textContent = finalOutput || "Code executed successfully (no output)";

    } catch (error) {
        console.error("Advanced Python execution error:", error);

        // Try to restore Python environment
        try {
            await pyodideInstance.runPythonAsync(`
sys.stdout = old_stdout
sys.stderr = old_stderr
`);
        } catch (e) {
            // Ignore cleanup errors
        }

        // Format error message for users
        let errorMsg = error.message || "Unknown error";

        if (errorMsg.includes("timeout") || errorMsg.includes("timed out")) {
            errorMsg = "Your code took too long to execute (timeout after 10 seconds).\nThis may be due to an infinite loop or inefficient code.";
        } else {
            // Clean up Python traceback for better readability
            errorMsg = errorMsg.replace(/File "<exec>"/g, "Line");
        }

        output.textContent = "Error: " + errorMsg;
    }
}

// Helper function to execute code with timeout
async function executeWithTimeout(asyncFn, timeoutMs) {
    return Promise.race([
        asyncFn(),
        new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Code execution timed out")), timeoutMs);
        })
    ]);
}

// Helper function to wait for Pyodide to load
async function waitForPyodide(maxSeconds) {
    return new Promise(resolve => {
        let secondsWaited = 0;
        const checkInterval = setInterval(() => {
            if (pyodideReady || secondsWaited >= maxSeconds) {
                clearInterval(checkInterval);
                resolve(pyodideReady);
            }
            secondsWaited++;
        }, 1000); // Check every second
    });
}

// Core function to load the most minimal version of Pyodide
async function loadPyodideCore() {
    if (pyodideReady || pyodideLoading) return;

    pyodideLoading = true;
    let scriptLoaded = false;

    try {
        // Use the v0.22.0 micro build from jsdelivr (smallest and fastest)
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.22.0/full/pyodide.js";
        script.async = true;

        // Wait for script to load
        scriptLoaded = await new Promise(resolve => {
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.head.appendChild(script);

            // Set a timeout in case onload/onerror aren't triggered
            setTimeout(() => resolve(false), 15000);
        });

        if (!scriptLoaded) {
            throw new Error("Failed to load Pyodide script");
        }

        if (typeof window.loadPyodide !== 'function') {
            throw new Error("Pyodide script loaded but loadPyodide function is missing");
        }

        // Initialize with minimal configuration
        pyodideInstance = await Promise.race([
            window.loadPyodide({
                indexURL: "https://cdn.jsdelivr.net/pyodide/v0.22.0/full/",
                stdin: () => prompt("Python input:") || "" // Use browser prompt for simplicity
            }),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Pyodide initialization timed out")), 20000)
            )
        ]);

        // Load only the absolute minimum packages
        await pyodideInstance.loadPackagesFromImports('import sys, io');

        pyodideReady = true;
        pyodideLoading = false;
        safeToastAdvanced("Advanced Python engine ready", "success");

        return pyodideInstance;
    } catch (error) {
        console.error("Failed to load Pyodide:", error);
        pyodideReady = false;
        pyodideLoading = false;
        safeToastAdvanced("Advanced Python engine failed to load", "error");

        // If script wasn't loaded, try a fallback CDN
        if (!scriptLoaded) {
            tryFallbackCDN();
        }

        throw error;
    }
}

// Try a fallback CDN if the first one fails
async function tryFallbackCDN() {
    try {
        const script = document.createElement('script');
        script.src = "https://pyodide.org/v0.22.0/full/pyodide.js";
        script.async = true;

        document.head.appendChild(script);
        safeToastAdvanced("Trying alternative Advanced Python source...", "info");
    } catch (e) {
        console.error("Failed to load fallback:", e);
    }
}

// Export run function and load function
window.runAdvancedPython = runAdvancedPython;
window.loadAdvancedPythonEngine = loadPyodideCore; // Export load function if needed by app-controller
