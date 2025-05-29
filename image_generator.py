import os
import sys
import base64
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
from google import genai
from google.genai import types
from dotenv import load_dotenv

def create_placeholder_image(output_path, prompt_text):
    """Creates a simple placeholder image with text."""
    try:
        # Create a simple colored background image
        width, height = 1200, 630  # Standard blog header size
        img = Image.new('RGB', (width, height), color=(73, 109, 137))
        draw = ImageDraw.Draw(img)
        
        # Add text to the image - simplified to avoid font issues
        # Draw the text in the center
        text_lines = ["Hyperliquid Blog", prompt_text]
        y_position = height // 3
        
        for line in text_lines:
            # Simple text drawing without font calculations
            draw.text((width // 2, y_position), line, fill=(255, 255, 255))
            y_position += 50  # Move down for next line
        
        # Save the image
        img.save(output_path)
        
        # Verify the image was created
        if os.path.exists(output_path):
            print(f"Created placeholder image at: {output_path}")
            return True
        else:
            print(f"Failed to create image at: {output_path}")
            return False
    except Exception as e:
        print(f"Error creating placeholder image: {e}")
        return False

def create_simple_image_file(output_path, text):
    """Creates a very simple image file using basic file operations when PIL fails."""
    try:
        # Create a simple HTML file that can be converted to an image later
        html_path = output_path + ".html"
        with open(html_path, 'w') as f:
            f.write(f"""<!DOCTYPE html>
<html>
<head>
    <title>Placeholder Image</title>
    <style>
        body {{ background-color: #456d89; color: white; font-family: Arial; text-align: center; padding: 100px; }}
        h1 {{ margin-bottom: 20px; }}
    </style>
</head>
<body>
    <h1>Hyperliquid Blog</h1>
    <p>{text}</p>
</body>
</html>""")
        
        # Create a very simple bitmap image as a last resort
        with open(output_path, 'wb') as f:
            # Simple BMP header and data for a blue image
            # This is a minimal 24-bit BMP file with a blue background
            bmp_header = bytes([
                0x42, 0x4D,             # 'BM' signature
                0x3E, 0x00, 0x00, 0x00, # File size: 62 bytes
                0x00, 0x00, 0x00, 0x00, # Reserved
                0x36, 0x00, 0x00, 0x00, # Offset to pixel data
                0x28, 0x00, 0x00, 0x00, # DIB header size
                0x02, 0x00, 0x00, 0x00, # Width: 2 pixels
                0x02, 0x00, 0x00, 0x00, # Height: 2 pixels
                0x01, 0x00,             # Color planes: 1
                0x18, 0x00,             # Bits per pixel: 24
                0x00, 0x00, 0x00, 0x00, # Compression: none
                0x0C, 0x00, 0x00, 0x00, # Image size: 12 bytes
                0x00, 0x00, 0x00, 0x00, # X pixels per meter
                0x00, 0x00, 0x00, 0x00, # Y pixels per meter
                0x00, 0x00, 0x00, 0x00, # Colors in color table
                0x00, 0x00, 0x00, 0x00, # Important color count
            ])
            # 4 pixels of blue color (2x2 image)
            pixel_data = bytes([0x99, 0x66, 0x33]) * 4  # BGR format
            f.write(bmp_header + pixel_data)
        
        print(f"Created simple placeholder image at: {output_path}")
        print(f"Also created HTML version at: {html_path}")
        return True
    except Exception as e:
        print(f"Error creating simple image file: {e}")
        return False

def create_better_image(output_path, text):
    """Creates a better looking placeholder image with gradient and text."""
    try:
        from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
        
        # Create a base image
        width, height = 1200, 630
        img = Image.new('RGB', (width, height), color=(0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Draw a gradient background
        for y in range(height):
            # Calculate gradient color (dark blue to lighter blue)
            r = int(25 + (y / height) * 20)
            g = int(40 + (y / height) * 30)
            b = int(80 + (y / height) * 60)
            draw.line([(0, y), (width, y)], fill=(r, g, b))
        
        # Add some circles for visual interest
        for i in range(5):
            x = width // 5 * i + 100
            y = height // 2
            size = 100 + i * 20
            draw.ellipse((x-size//2, y-size//2, x+size//2, y+size//2), 
                        outline=(255, 255, 255, 128), width=2)
        
        # Add text
        title = "HYPERLIQUID"
        subtitle = text
        
        # Draw title
        draw.text((width//2, height//3), title, fill=(255, 255, 255), anchor="mm")
        
        # Draw subtitle
        draw.text((width//2, height//2), subtitle, fill=(200, 200, 255), anchor="mm")
        
        # Apply a slight blur for a softer look
        img = img.filter(ImageFilter.GaussianBlur(radius=1))
        
        # Save the image
        img.save(output_path)
        print(f"Created enhanced placeholder image at: {output_path}")
        return True
    except Exception as e:
        print(f"Error creating enhanced image: {e}")
        return False

def generate_image_with_gemini(output_path, prompt):
    """Generates an image using Gemini API based on the prompt using the new Google Gen AI SDK."""
    try:
        print(f"\nGenerating image for '{prompt}' using Gemini...")
        
        # Load API key from .env file
        load_dotenv()
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            print("Error: GOOGLE_API_KEY not found in .env file.")
            return False
        
        # Create a client with the API key
        client = genai.Client(api_key=api_key)
        
        # Prepare the prompt for image generation
        image_prompt = f"Create a high-quality image of {prompt}. "
        image_prompt += "Make it visually appealing with clean design and relevant imagery."
        
        print(f"Sending prompt to Gemini: {image_prompt}")
        
        # Generate the image using Gemini
        try:
            # Use the new SDK approach for image generation
            response = client.models.generate_content(
                model="gemini-2.0-flash-preview-image-generation",
                contents=image_prompt,
                config=types.GenerateContentConfig(
                    response_modalities=['TEXT', 'IMAGE']
                )
            )
            
            # Process the response and save the image
            image_saved = False
            
            # Extract the image from the response
            try:
                # Process the response parts
                for part in response.candidates[0].content.parts:
                    if part.text is not None:
                        print(f"Gemini response text: {part.text}")
                    elif part.inline_data is not None:
                        # Save the image
                        image = Image.open(BytesIO(part.inline_data.data))
                        image.save(output_path)
                        print(f"Image successfully generated and saved to: {output_path}")
                        image_saved = True
                        break
            except Exception as struct_error:
                print(f"Error processing response structure: {struct_error}")
                print(f"Response structure: {dir(response)}")
                
                # Try to debug the response structure
                try:
                    print(f"Response type: {type(response)}")
                    print(f"Response JSON: {response.model_dump_json(exclude_none=True)}")
                except Exception as debug_error:
                    print(f"Error debugging response: {debug_error}")
            
            if not image_saved:
                print("No image was generated in the response.")
                print("Falling back to placeholder image...")
                return False
                
            return True
            
        except Exception as e:
            print(f"Error generating image with Gemini: {e}")
            print(f"Error details: {str(e)}")
            return False
            
    except Exception as e:
        print(f"Error in Gemini image generation setup: {e}")
        return False

def main():
    if len(sys.argv) < 3:
        print("Usage: python image_generator.py <output_path> <text> [method]")
        print("Methods: gemini, placeholder, simple, better (default: gemini)")
        return
    
    output_path = sys.argv[1]
    text = sys.argv[2]
    method = sys.argv[3] if len(sys.argv) > 3 else "gemini"
    
    # Create the directory if it doesn't exist
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    if method == "gemini":
        # Try Gemini first, fall back to other methods if it fails
        if not generate_image_with_gemini(output_path, text):
            print("Gemini image generation failed. Falling back to better placeholder...")
            if not create_better_image(output_path, text):
                print("Better placeholder failed. Falling back to simple placeholder...")
                if not create_placeholder_image(output_path, text):
                    print("Simple placeholder failed. Creating minimal image...")
                    create_simple_image_file(output_path, text)
    elif method == "placeholder":
        create_placeholder_image(output_path, text)
    elif method == "simple":
        create_simple_image_file(output_path, text)
    elif method == "better":
        # Try the best method first, fall back to simpler methods if it fails
        if not create_better_image(output_path, text):
            print("Falling back to placeholder image...")
            if not create_placeholder_image(output_path, text):
                print("Falling back to simple image...")
                create_simple_image_file(output_path, text)
    else:
        print(f"Unknown method: {method}")
        print("Using default method (gemini)...")
        generate_image_with_gemini(output_path, text)
    
    # Verify the image was created
    if os.path.exists(output_path):
        print(f"SUCCESS: Image created at {output_path}")
    else:
        print(f"FAILURE: Image was not created at {output_path}")

if __name__ == "__main__":
    main()
