#!/usr/bin/env python3
from PIL import Image, ImageDraw
import os

# Path definitions
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = CURRENT_DIR

# Create the output directory if it doesn't exist
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Python logo colors
PYTHON_BLUE = "#3776AB"
PYTHON_WHITE = "#FFFFFF"

def create_simple_python_icon(size):
    """
    Create a simple Python icon with the white snake symbol on blue background
    similar to the one in the attachment
    """
    # Create a blank image with blue background
    icon = Image.new('RGB', (size, size), PYTHON_BLUE)
    draw = ImageDraw.Draw(icon)
    
    # Calculate center and dimensions for the symbol
    center_x, center_y = size // 2, size // 2
    
    # Draw simplified Python logo (similar to the attached image)
    # Calculate dimensions based on size
    padding = size // 5
    symbol_width = size - (padding * 2)
    symbol_height = size - (padding * 2)
    
    # Draw a simplified white snake-like symbol
    # This creates a design similar to the Python logo in the attachment
    # Draw the body as two overlapping rounded rectangles
    top_rect = [(center_x - symbol_width//3, padding), 
                (center_x + symbol_width//3, center_y + symbol_height//6)]
                
    bottom_rect = [(center_x - symbol_width//3, center_y - symbol_height//6), 
                   (center_x + symbol_width//3, size - padding)]
    
    # Draw the rounded rectangles for the snake body
    draw.rounded_rectangle(top_rect, fill=PYTHON_WHITE, radius=size//10)
    draw.rounded_rectangle(bottom_rect, fill=PYTHON_WHITE, radius=size//10)
    
    # Add small circles for the snake's "eyes" or details
    eye_size = max(size // 20, 1)
    draw.ellipse((top_rect[0][0] + symbol_width//4, padding + symbol_height//6, 
                 top_rect[0][0] + symbol_width//4 + eye_size, padding + symbol_height//6 + eye_size), 
                 fill=PYTHON_BLUE)
    
    draw.ellipse((bottom_rect[0][0] + symbol_width//4, size - padding - symbol_height//6, 
                 bottom_rect[0][0] + symbol_width//4 + eye_size, size - padding - symbol_height//6 + eye_size), 
                 fill=PYTHON_BLUE)
    
    return icon

def generate_icons():
    # Icon sizes required for PWA
    sizes = [16, 32, 48, 72, 96, 128, 144, 152, 192, 384, 512]
    
    # Generate PNG icons for all sizes
    for size in sizes:
        icon = create_simple_python_icon(size)
        output_path = os.path.join(OUTPUT_DIR, f"icon-{size}x{size}.png")
        icon.save(output_path, optimize=True)
        print(f"Created {output_path}")
    
    # Create favicon.ico (16x16, 32x32)
    favicon_sizes = [16, 32]
    favicon_images = [create_simple_python_icon(size) for size in favicon_sizes]
    favicon_path = os.path.join(OUTPUT_DIR, "favicon.ico")
    favicon_images[0].save(favicon_path, format='ICO', sizes=[(size, size) for size in favicon_sizes])
    print(f"Created {favicon_path}")
    
    # Create Apple touch icons
    apple_sizes = [152, 167, 180]
    for size in apple_sizes:
        icon = create_simple_python_icon(size)
        output_path = os.path.join(OUTPUT_DIR, f"apple-touch-icon-{size}x{size}.png")
        icon.save(output_path, optimize=True)
        print(f"Created {output_path}")
    
    # Create a generic apple-touch-icon.png (180x180)
    icon = create_simple_python_icon(180)
    output_path = os.path.join(OUTPUT_DIR, "apple-touch-icon.png")
    icon.save(output_path, optimize=True)
    print(f"Created {output_path}")

if __name__ == "__main__":
    try:
        generate_icons()
        print("Icon generation completed successfully!")
    except Exception as e:
        print(f"Error generating icons: {e}")
        print("\nPlease install required dependencies:")
        print("pip install pillow")