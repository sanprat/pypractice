// Manages display of README content

let basicReadmeContent = '';
let advancedReadmeContent = '';

// Define example code snippets for Basic Mode
const basicPythonExamples = [
    {
        title: "Hello World",
        code: `print("Hello, World!")`
    },
    {
        title: "Variables and Basic Arithmetic",
        code: `x = 10
y = 5
sum = x + y
print("Sum:", sum)
print("Product:", x * y)`
    },
    {
        title: "Conditional Statements",
        code: `age = 18
if age >= 18:
    print("You are an adult.")
else:
    print("You are a minor.")`
    },
    {
        title: "For Loop",
        code: `for i in range(5):
    print("Iteration:", i)`
    },
    {
        title: "While Loop",
        code: `count = 0
while count < 3:
    print("Count:", count)
    count += 1`
    },
    {
        title: "Simple Function",
        code: `def greet(name):
    return "Hello, " + name + "!"

message = greet("Alice")
print(message)`
    }
];

// Define example code snippets for Advanced Mode
const advancedPythonExamples = [
    {
        title: "Using the Math Module",
        code: `import math

radius = 5
area = math.pi * radius**2
print(f"Area of circle: {area:.2f}")
print(f"Square root of 16: {math.sqrt(16)}")`
    },
    {
        title: "File Handling (Simulated)",
        code: `# In a real environment, this would interact with a file system.
# Pyodide allows in-browser file system operations.
with open("my_file.txt", "w") as f:
    f.write("Hello from Advanced Mode!")

with open("my_file.txt", "r") as f:
    content = f.read()
    print("File content:", content)`
    },
    {
        title: "Working with Lists and Functions",
        code: `def calculate_average(numbers):
    return sum(numbers) / len(numbers)

data = [10, 20, 30, 40, 50]
avg = calculate_average(data)
print("Average:", avg)`
    },
    {
        title: "Classes and Objects",
        code: `class Dog:
    def __init__(self, name, breed):
        self.name = name
        self.breed = breed

    def bark(self):
        return f"{self.name} says Woof!"

my_dog = Dog("Buddy", "Golden Retriever")
print(my_dog.bark())`
    },
    {
        title: "Using External Libraries (e.g., NumPy via Pyodide)",
        code: `# This requires NumPy to be loaded in Pyodide environment
# await micropip.install('numpy') # This would be done once in pyodide-setup.js
import numpy as np

arr = np.array([1, 2, 3, 4, 5])
print("NumPy array:", arr)
print("Sum of array:", np.sum(arr))`
    }
];


document.addEventListener('DOMContentLoaded', () => {
    const readmeContentDiv = document.querySelector('.readme-content');

    // Function to set the content of the README panel
    function setReadmeContent(content) {
        if (readmeContentDiv) {
            readmeContentDiv.innerHTML = content;
        }
    }

    // --- Define README Content ---

    // Content for the Basic Mode README
    basicReadmeContent = `
        <h2>Basic Mode</h2>
        <p>Welcome to Basic Mode! This editor runs simple Python code directly in your browser using Skulpt.</p>
        <p>It's great for learning fundamental concepts like:</p>
        <ul>
            <li>Variables and data types</li>
            <li>Basic arithmetic operations</li>
            <li>Print statements</li>
            <li>Conditional statements (if/elif/else)</li>
            <li>Loops (for/while)</li>
            <li>Simple functions</li>
        </ul>
        <p>ℹ️ Basic Mode runs simple Python quickly in your browser.</p>
        <p>ℹ️ Advanced Mode supports full Python features including libraries like math, random etc.</p>

        <h3>How to Use</h3>
        <p>1. Select a mode (Basic or Advanced) using the tabs at the top.</p>
        <p>2. Write or modify Python code in the editor area.</p>
        <p>3. Click the "<i class='fas fa-play'></i> Run Code" button to execute your Python code.</p>
        <p>4. View the output in the console area below the editor.</p>
        <p>5. Use the "<i class='fas fa-undo'></i> Reset" button to clear the editor content.</p>
        <p>6. Use the "<i class='fas fa-trash-alt'></i> Clear" button in the output header to clear the output console.</p>

        <h3>How to Use the Editor</h3>
        <p>
            The editor supports basic code editing features like syntax highlighting, auto-indentation, and bracket matching.
            You can use \`Tab\` for indentation, \`Shift-Tab\` for de-indentation, and \`Ctrl-/\` (or \`Cmd-/\` on Mac) to toggle comments.
        </p>

        <h3>Basic Python Examples</h3>
        ${basicPythonExamples.map(example => `
            <h4>${example.title}</h4>
            <pre><code class="language-python">${example.code.replace(/`/g, '\\`').replace(/</g, '<').replace(/>/g, '>')}</code></pre>
        `).join('')}

        <p><strong>Limitations:</strong> Basic Mode does not support complex libraries (like NumPy, Pandas, Requests), file I/O, or advanced Python features. If your code requires these, please switch to Advanced Mode.</p>
        <p><strong>Guest Limit:</strong> Guests have a limit of 6 code executions in Basic Mode. <a href="#" id="readme-login-link">Log in or Register</a> for unlimited access and to unlock Advanced Mode.</p>
    `;

    // Content for the Advanced Mode README
    advancedReadmeContent = `
        <h2>Advanced Mode</h2>
        <p>Welcome to Advanced Mode! This editor provides full Python 3 support using Pyodide, allowing you to use a wide range of Python libraries and features.</p>
        <p>It's suitable for more complex tasks and exploring the full power of Python.</p>

        <p>ℹ️ Basic Mode runs simple Python quickly in your browser.</p>
        <p>ℹ️ Advanced Mode supports full Python features including libraries like math, random etc.</p>

        <h3>How to Use</h3>
         <p>1. Select a mode (Basic or Advanced) using the tabs at the top.</p>
        <p>2. Write or modify Python code in the editor area.</p>
        <p>3. Click the "<i class='fas fa-play'></i> Run Code" button to execute your Python code.</p>
        <p>4. View the output in the console area below the editor.</p>
        <p>5. Use the "<i class='fas fa-undo'></i> Reset" button to clear the editor content.</p>
        <p>6. Use the "<i class='fas fa-trash-alt'></i> Clear" button in the output header to clear the output console.</p>

        <h3>How to Use the Editor</h3>
        <p>
            The editor supports advanced code editing features like syntax highlighting, auto-indentation, and bracket matching.
            You can use \`Tab\` for indentation, \`Shift-Tab\` for de-indentation, and \`Ctrl-/\` (or \`Cmd-/\` on Mac) to toggle comments.
            Code completion is available by pressing \`Ctrl-Space\` (or \`Cmd-Space\` on Mac).
        </p>

        <h3>Advanced Python Examples</h3>
         ${advancedPythonExamples.map(example => `
            <h4>${example.title}</h4>
            <pre><code class="language-python">${example.code.replace(/`/g, '\\`').replace(/</g, '<').replace(/>/g, '>')}</code></pre>
        `).join('')}

        <p><strong>Note:</strong> Loading the Advanced Python engine (Pyodide) may take a few seconds the first time you switch to Advanced Mode or run code in it.</p>
    `;


    // Add event listener for the login link in the README
    if (readmeContentDiv) {
        readmeContentDiv.addEventListener('click', (event) => {
            if (event.target && event.target.id === 'readme-login-link') {
                event.preventDefault();
                // Trigger UI to show login/register modals via auth module
                if (typeof window.auth !== 'undefined') {
                     document.getElementById('login-modal').style.display = 'block';
                } else {
                    console.error("Auth module not available to show login modal.");
                }
            }
        });
    }

    // Export function to update visibility and content
    function updateReadmeContent(mode) {
         if (mode === 'basic-mode') {
             setReadmeContent(basicReadmeContent);
         } else if (mode === 'advanced-mode') {
             setReadmeContent(advancedReadmeContent);
         }
         // No content for other modes like 'readme' itself, handled by app-controller
    }


    window.readme = {
        updateReadmeContent // Export this function
    };
});
