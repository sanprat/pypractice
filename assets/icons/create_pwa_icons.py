#!/usr/bin/env python3
from PIL import Image, ImageOps
import os
import io
import base64
import cairosvg

# Path definitions
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = CURRENT_DIR

# Create the output directory if it doesn't exist
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Python logo blue color (approximately from the image)
PYTHON_BLUE = "#3776AB"

# Create a base64 representation of the standard Python logo (replace with your own if preferred)
# This is a data URL representation of a Python logo that matches what was attached
PYTHON_LOGO_BASE64 = """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110.4211 109.8461">
  <defs>
    <linearGradient id="a" x1="89.136" x2="147.77" y1="111.92" y2="168.1" gradientTransform="translate(-134.33 -329.02) scale(2.983)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#5A9FD4"/>
      <stop offset="1" stop-color="#306998"/>
    </linearGradient>
    <linearGradient id="b" x1="69.202" x2="112.75" y1="110.22" y2="158.66" gradientTransform="translate(-134.33 -329.02) scale(2.983)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#FFD43B"/>
      <stop offset="1" stop-color="#FFE873"/>
    </linearGradient>
  </defs>
  <path fill="url(#a)" d="M54.619 0c-4.584.022-8.961.4-12.813 1.062-11.347 1.945-13.406 6.014-13.406 13.5v9.906h26.812v3.406H18.706c-7.792 0-14.616 4.684-16.75 13.594-2.462 10.213-2.571 16.586 0 27.25 1.906 7.938 6.458 13.594 14.25 13.594h9.219v-12.25c0-8.85 7.657-16.656 16.75-16.656h26.781c7.455 0 13.406-6.138 13.406-13.625v-25.531c0-7.266-6.13-12.726-13.406-13.938-4.606-.766-9.385-1.115-13.969-1.093zm-14.5 8.031c2.77 0 5.031 2.299 5.031 5.125 0 2.816-2.262 5.094-5.031 5.094-2.78 0-5.031-2.277-5.031-5.094 0-2.826 2.251-5.125 5.031-5.125z"/>
  <path fill="url(#b)" d="M85.95 28.869v11.906c0 9.231-7.826 17-16.75 17H42.419c-7.336 0-13.406 6.279-13.406 13.625v25.531c0 7.266 6.319 11.54 13.406 13.625 8.487 2.496 16.626 2.947 26.781 0 6.75-1.954 13.406-5.888 13.406-13.625v-9.906H55.825v-3.406h40.188c7.793 0 10.696-5.436 13.406-13.594 2.8-8.398 2.68-16.476 0-27.25-1.926-7.757-5.604-13.594-13.406-13.594h-10.063zm-15.062 64.718c2.78 0 5.031 2.278 5.031 5.094 0 2.827-2.251 5.125-5.031 5.125-2.77 0-5.031-2.299-5.031-5.125 0-2.816 2.26-5.094 5.031-5.094z"/>
</svg>
"""

def create_png_icon(size):
    """Generate a PNG icon of the specified size from the SVG base64 data"""
    # First convert SVG to PNG
    png_data = cairosvg.svg2png(bytestring=PYTHON_LOGO_BASE64, output_width=size, output_height=size)
    
    # Open the PNG data with PIL
    img = Image.open(io.BytesIO(png_data))
    
    # Ensure square aspect ratio
    img = ImageOps.fit(img, (size, size), Image.LANCZOS)
    
    return img

def generate_icons():
    # Icon sizes required for PWA
    sizes = [16, 32, 48, 72, 96, 128, 144, 152, 192, 384, 512]
    
    # Create an SVG version at 512px (already exists as icon-192x192.svg, but this is a larger version)
    with open(os.path.join(OUTPUT_DIR, "icon-512x512.svg"), "w") as svg_file:
        svg_file.write(PYTHON_LOGO_BASE64.strip())
    
    # Generate PNG icons for all sizes
    for size in sizes:
        icon = create_png_icon(size)
        output_path = os.path.join(OUTPUT_DIR, f"icon-{size}x{size}.png")
        icon.save(output_path, optimize=True)
        print(f"Created {output_path}")
    
    # Create favicon.ico (16x16, 32x32)
    favicon_sizes = [16, 32]
    favicon_images = [create_png_icon(size) for size in favicon_sizes]
    favicon_path = os.path.join(OUTPUT_DIR, "favicon.ico")
    favicon_images[0].save(favicon_path, format='ICO', sizes=[(size, size) for size in favicon_sizes])
    print(f"Created {favicon_path}")
    
    # Create Apple touch icons
    apple_sizes = [152, 167, 180]
    for size in apple_sizes:
        icon = create_png_icon(size)
        output_path = os.path.join(OUTPUT_DIR, f"apple-touch-icon-{size}x{size}.png")
        icon.save(output_path, optimize=True)
        print(f"Created {output_path}")
    
    # Create a generic apple-touch-icon.png (180x180)
    icon = create_png_icon(180)
    output_path = os.path.join(OUTPUT_DIR, "apple-touch-icon.png")
    icon.save(output_path, optimize=True)
    print(f"Created {output_path}")

if __name__ == "__main__":
    try:
        generate_icons()
        print("Icon generation completed successfully!")
    except Exception as e:
        print(f"Error generating icons: {e}")
        # If cairosvg isn't installed, provide instructions
        if "cairosvg" in str(e):
            print("\nPlease install required dependencies:")
            print("pip install pillow cairosvg")