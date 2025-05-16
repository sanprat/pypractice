#!/bin/bash
# Simple script to open the enhanced version in the default browser

# Determine the OS and use the appropriate command
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open enhanced-index.html
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open enhanced-index.html
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    start enhanced-index.html
else
    echo "Unsupported OS. Please open enhanced-index.html manually."
fi
