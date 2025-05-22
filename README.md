# Python Practice Web Application

A web-based Python learning platform that allows students to practice Python programming directly in the browser.

## Description

This project combines elements from both local and remote repositories, providing a web-based Python learning platform.

## Features

### Basic Mode (Skulpt)
- Interactive Python code editor with syntax highlighting
- Real-time code execution using Skulpt
- Line numbers and proper code indentation
- Exercise library with examples for different Python concepts
- Hints and example code for learning assistance

### Advanced Mode (Pyodide) 
- Full Python 3 support with Pyodide
- Access to Python packages and libraries
- Advanced code execution capabilities

## UI/UX Improvements

The application features a modern, user-friendly interface with:

- Clean, responsive design that works on desktop and mobile devices
- Intuitive navigation with tabbed interface
- Exercise sidebar with categorized learning content
- Code editor with line numbers and proper indentation
- Syntax highlighting for better code readability
- Dark-themed output console for better visibility
- Toast notifications for user feedback
- Tooltips for improved usability
- Accessibility improvements for all users

## Technical Notes

### Skulpt Limitations
- Skulpt is a JavaScript implementation of Python that runs in the browser
- It supports most Python 2.x features but has limited Python 3 support
- F-strings and some other Python 3 features are not supported
- For full Python 3 support, the Advanced mode will use Pyodide (WebAssembly-based Python)

### Files Structure
- `index.html` - Original HTML file
- `css/enhanced-styles.css` - CSS styles with modern design
- `js/readme.js` - For reading instructions
- `js/theme.js` - For light and dark theme
- `js/ui-helpers.js` -
- `js/advanced-engine.js` -
- `js/app-controller.js` -
- `js/auth.js` -
- `js/basic-engine.js` -
- `js/editor.js` -

## How to Use

1. Go to pybankers.com and click on pypractice link in the navbar which would open the web app
2. There are 3 tabs, Basic, Advanced and Readme
3. Write or modify Python code in the editor
4. Click "Run Code" to execute the Python code
5. View the output in the console below the editor
6. Use the toolbar for additional features:
   - Read the instructions in readme tab
   - Get hints from examples in readme tab
   - Reset code to the default example
   - Clear the output console

## Future Improvements

- Implement the Advanced mode with Pyodide for full Python 3 support
- Add more exercises and examples
- Implement user authentication and progress tracking
- Add code sharing and export functionality
- Implement a more sophisticated code editor with full syntax highlighting
- Add unit tests for exercises to verify solutions
