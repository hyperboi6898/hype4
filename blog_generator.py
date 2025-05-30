import os
import json
import base64
import time
import subprocess
from datetime import datetime
from slugify import slugify # pip install python-slugify
from github import Github # pip install PyGithub
from google import genai # pip install google-genai
from google.genai import types
from dotenv import load_dotenv # pip install python-dotenv
# from PIL import Image # pip install Pillow (Optional for more advanced image processing)

# Base directory for all file operations
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# --- Configuration ---
load_dotenv()
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GEMINI_API_KEY:
    print("Error: GOOGLE_API_KEY not found in .env file or environment variables.")
    exit()

# GitHub configuration
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

GITHUB_REPO = os.getenv("GITHUB_REPO", "hyperboi6898/hype4")
GITHUB_USERNAME = os.getenv("GITHUB_USERNAME", "hyperboi6898")

# Check if GitHub token is available
if not GITHUB_TOKEN:
    print("Error: GitHub token not found in environment variables.")
    print("Please add your GitHub token to the .env file as GITHUB_TOKEN=your_token")
    exit()

# Initialize GitHub client
try:
    g = Github(GITHUB_TOKEN)
    repo = g.get_repo(GITHUB_REPO)
    print(f"Successfully connected to GitHub repository: {GITHUB_REPO}")
except Exception as e:
    print(f"Error connecting to GitHub: {e}")
    exit()

# Create Gemini client
client = genai.Client(api_key=GEMINI_API_KEY)
MODEL_NAME = "gemini-2.0-flash" # Updated model name

# Base paths (relative to where the script is run)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(BASE_DIR)
BLOG_MARKDOWN_DIR = os.path.join(PARENT_DIR, "hype4", "blog", "markdown")
BLOG_IMAGES_DIR = os.path.join(PARENT_DIR, "hype4", "blog", "images")

# Ensure local directories exist for temporary files
os.makedirs(BLOG_MARKDOWN_DIR, exist_ok=True)
os.makedirs(BLOG_IMAGES_DIR, exist_ok=True)

# --- GitHub Functions ---

def github_create_file(path, content, commit_message):
    """Creates or updates a file locally instead of directly on GitHub.
    This helps avoid conflicts when multiple processes are updating the repository."""
    try:
        # Create the full local path
        full_path = os.path.join(BASE_DIR, path)
        
        # Ensure directory exists
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        
        # Write the file locally
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"Created/Updated file: {path}")
        return True
    except Exception as e:
        print(f"Error creating/updating file locally: {e}")
        return False

def get_current_index():
    """Gets the current index.json file from the local repository or creates a new one if it doesn't exist."""
    try:
        index_path = os.path.join(BASE_DIR, "blog/markdown/index.json")
        
        if os.path.exists(index_path):
            with open(index_path, 'r', encoding='utf-8') as f:
                content = f.read()
            return json.loads(content)
        else:
            # If index.json doesn't exist
            return {"posts": []}
    except Exception as e:
        print(f"Error reading index.json: {e}")
        # If there are issues with the file
        return {"posts": []}

def update_blog_index(title, slug, excerpt, category, image_path, featured=False):
    """Updates the blog index.json file with the new post."""
    try:
        # Get current index
        index_data = get_current_index()
        
        # Create new post entry
        new_post = {
            "slug": slug,
            "title": title,
            "excerpt": excerpt,
            "category": category,
            "date": datetime.now().strftime("%Y-%m-%dT%H:%M:%S.000Z"),
            "readTime": max(1, round(len(excerpt.split()) / 20)),
            "image": f'<img src="{image_path}" alt="{title}" style="width:100%;height:auto;">',
            "featured": featured
        }
        
        # Add to beginning of posts list (newest first)
        index_data["posts"].insert(0, new_post)
        
        # Write updated index back to GitHub
        index_json = json.dumps(index_data, indent=2)
        github_create_file("blog/markdown/index.json", index_json, "Update blog index with new post")
        
        return True
    except Exception as e:
        print(f"Error updating blog index: {e}")
        return False

def upload_image_to_github(local_image_path, github_path):
    """Copies an image to the local GitHub repository structure instead of uploading directly.
    This helps avoid conflicts when multiple processes are updating the repository."""
    try:
        # Create the full destination path
        full_dest_path = os.path.join(BASE_DIR, github_path)
        
        # Check if source and destination are the same file
        if os.path.abspath(local_image_path) == os.path.abspath(full_dest_path):
            # File is already in the correct location, no need to copy
            print(f"Image already exists at the correct location: {github_path}")
            return True
        
        # Ensure directory exists
        os.makedirs(os.path.dirname(full_dest_path), exist_ok=True)
        
        # Copy the image file
        import shutil
        shutil.copy2(local_image_path, full_dest_path)
        
        print(f"Successfully copied image to local repository: {github_path}")
        return True
    except Exception as e:
        print(f"Error copying image to local repository: {e}")
        return False

# --- Helper Functions ---

def get_user_input():
    """Gets necessary inputs from the user with smart defaults."""
    print("--- New Blog Post Creator (GitHub Version) ---")
    idea = input("Enter the main idea/topic for the blog post: ")
    
    # Use default author without asking
    author = "Team HyperVN"
    
    # Use default category without asking
    categories = ["tutorial", "news", "analysis", "airdrop"]
    default_category = "news"
    category = default_category
    
    # Auto-generate image prompt based on the blog topic
    image_prompt = f"Cryptocurrency blog header image about {idea}"
    print(f"Auto-generated image prompt: '{image_prompt}'")
    
    # Auto-generate alt text
    image_alt_text = f"Illustration representing {idea} for Hyperliquid blog post"
    print(f"Auto-generated alt text: '{image_alt_text}'")
    
    # Create a placeholder path for the image
    placeholder_dir = os.path.join(PARENT_DIR, "hype4", "blog", "images")
    os.makedirs(placeholder_dir, exist_ok=True)
    image_path_input = os.path.join(placeholder_dir, "placeholder.txt")
    
    return {
        "idea": idea,
        "author": author,
        "category": category,
        "image_path_input": image_path_input,
        "image_alt_text": image_alt_text
    }

def create_placeholder_image(output_path, prompt_text):
    """Creates a simple placeholder image with text."""
    try:
        from PIL import Image, ImageDraw
        
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

def generate_image_with_gemini(prompt, post_slug):
    """Generates an image using Gemini API based on the prompt."""
    try:
        print(f"\nGenerating image for '{prompt}' using Gemini...")
        
        # Ensure the target directory exists
        os.makedirs(BLOG_IMAGES_DIR, exist_ok=True)
        
        # Create filename based on post slug
        image_filename_base = slugify(post_slug[:50])
        new_image_filename = f"{image_filename_base}.webp"  # Using webp for consistency
        new_image_path_local = os.path.join(BLOG_IMAGES_DIR, new_image_filename)
        
        # The path that will be used in the markdown file
        markdown_image_path = f"/blog/images/{new_image_filename}"
        
        # Try to generate the image using Gemini
        try:
            # Import the image generator module
            import sys
            # Add the parent directory to the path to import the image_generator module
            sys.path.append(PARENT_DIR)
            import image_generator
            
            # Prepare the prompt for image generation
            image_prompt = f"Cryptocurrency blog header image about {prompt}"
            image_prompt += ". The image should be suitable for a cryptocurrency/blockchain blog post."
            
            print(f"Attempting to generate image with Gemini using prompt: '{image_prompt}'")
            
            # Call the image generator function
            image_generated = image_generator.generate_image_with_gemini(new_image_path_local, image_prompt)
            
            if image_generated:
                print(f"Successfully generated image with Gemini at: {new_image_path_local}")
            else:
                print("Gemini image generation failed, falling back to placeholder image.")
                # Try to create a placeholder image
                image_created = create_placeholder_image(new_image_path_local, prompt)
                if not image_created:
                    # If that fails, try the simple fallback method
                    image_created = create_simple_image_file(new_image_path_local, prompt)
        
        except Exception as e:
            print(f"Error generating image with Gemini: {e}")
            print("Falling back to placeholder image.")
            
            # Try to create a placeholder image using PIL first
            image_created = False
            try:
                image_created = create_placeholder_image(new_image_path_local, prompt)
                if image_created:
                    print("Created a placeholder image.")
            except Exception as e:
                print(f"Error creating PIL placeholder image: {e}")
            
            # If PIL failed, try the simple fallback method
            if not image_created:
                try:
                    image_created = create_simple_image_file(new_image_path_local, prompt)
                    if image_created:
                        print("Created a simple placeholder image as fallback.")
                    else:
                        print("Could not create a placeholder image. You'll need to add an image manually.")
                except Exception as e:
                    print(f"Error creating fallback image: {e}")
                    print("You'll need to add an image manually.")
        
        # Verify the image file exists
        if os.path.exists(new_image_path_local):
            print(f"Confirmed image file exists at: {new_image_path_local}")
        else:
            print(f"WARNING: Image file does not exist at: {new_image_path_local}")
            print("The markdown will reference this path, but you'll need to add the image manually.")
            
            # Create a placeholder text file with instructions as a last resort
            placeholder_txt_path = os.path.join(BLOG_IMAGES_DIR, f"{image_filename_base}.txt")
            with open(placeholder_txt_path, 'w') as f:
                f.write(f"Please generate an image for: {prompt}\n")
                f.write(f"Using Gemini 2.0 Flash Preview Image Generation\n")
                f.write(f"And save it to this location as {new_image_filename}")
            
            print(f"Created instruction file at: {placeholder_txt_path}")
        
        return markdown_image_path, new_image_path_local
            
    except Exception as e:
        print(f"Error in image generation setup: {e}")
        return None, None

def handle_image(image_path_input, post_slug, image_alt_text):
    """Prepares image path and HTML tags for the blog post."""
    try:
        # Generate image path using Gemini (or get placeholder path)
        markdown_image_path, new_image_path_local = generate_image_with_gemini(post_slug, post_slug)
        
        frontmatter_image_html = f'<img src="{markdown_image_path}" alt="{image_alt_text}" style="width:100%;height:auto;">'
        
        # Create a short caption (max 5 words)
        short_caption = ' '.join(image_alt_text.split()[:5])
        
        # Using single quotes for HTML attributes to avoid backslash issues
        inline_image_html_with_caption = f'''
<figure style='text-align: center;'>
  <img src='{markdown_image_path}' alt='{short_caption}' style='width:100%;max-width:600px;margin:0 auto;display:block;'>
  <figcaption style='font-size: 0.9em; color: #555; margin-top: 5px;'>{short_caption}</figcaption>
</figure>
'''
        return markdown_image_path, frontmatter_image_html, inline_image_html_with_caption, new_image_path_local

    except Exception as e:
        print(f"Error handling image: {e}")
        return None, None, None, None

def generate_content_with_gemini(idea, category):
    """Generates blog content using Gemini with the new Google Gen AI SDK."""
    print(f"\nGenerating content for '{idea}' using Gemini ({MODEL_NAME})...")
    
    prompt_parts = [
        "You are an expert blog post writer for 'Hyperliquid Vietnam', a platform focused on decentralized perpetuals trading.",
        f"The target audience is Vietnamese crypto users, traders, and those interested in DeFi and Hyperliquid features.",
        f"The category of this post is: '{category}'.",
        f"The main topic/idea for this post is: '{idea}'.",
        "\nPlease generate the following for the blog post:",
        "1. A compelling and SEO-friendly 'Title' (in Vietnamese if appropriate for Hyperliquid Vietnam, otherwise English).",
        "2. A short 'Excerpt' (around 150-250 characters, concise and engaging, for blog listing pages).",
        "3. The main 'Content' of the blog post in Markdown format. The content should be:",
        "    - Well-structured with H1 (for the main title, though I'll use the 'Title' above for frontmatter), H2, H3, and H4 headings where appropriate.",
        "    - Informative, clear, and engaging for the target audience.",
        "    - SEO-friendly, naturally incorporating relevant keywords related to Hyperliquid, DeFi, trading, and the specific topic.",
        "    - Use Markdown for formatting: lists, bold, italics, blockquotes, code blocks (if applicable).",
        "    - If you need to mention a link, use placeholder like `[link text](https://app.hyperliquid.xyz/join/VN84)`.",
        "    - The tone should be professional yet accessible.",
        "    - Please ensure the content is substantial enough for a blog post (aim for at least 500-800 words, but prioritize quality).",
        "    - Do NOT include the YAML frontmatter (--- ... ---) in your response.",
        "    - Do NOT include a featured image tag in the main content; I will add it. However, you can suggest logical places for other images by writing: `[SUGGESTED_IMAGE: description for an image here]` if you think more images would enhance the content.",
        "\nFormat your response strictly as follows, with each part clearly demarcated:",
        "---TITLE_START---",
        "The Title Here",
        "---TITLE_END---",
        "---EXCERPT_START---",
        "The Excerpt Here",
        "---EXCERPT_END---",
        "---CONTENT_START---",
        "The Markdown Content Here",
        "---CONTENT_END---"
    ]
    
    full_prompt = "\n".join(prompt_parts)

    try:
        # Using the new Google Gen AI SDK approach
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=full_prompt,
            config=types.GenerateContentConfig(
                temperature=0.7,
                max_output_tokens=4096,
            )
        )
        
        # Extract the text from the response
        text_response = response.text
        title = text_response.split("---TITLE_START---")[1].split("---TITLE_END---")[0].strip()
        excerpt = text_response.split("---EXCERPT_START---")[1].split("---EXCERPT_END---")[0].strip()
        content = text_response.split("---CONTENT_START---")[1].split("---CONTENT_END---")[0].strip()
        
        # Remove title from content if it appears at the beginning
        if content.startswith(f"# {title}"):
            content = content.replace(f"# {title}", "", 1).strip()
        elif content.startswith(f"# {title.lower()}"):
             content = content.replace(f"# {title.lower()}", "", 1).strip()

        print("Content generated successfully!")
        return title, excerpt, content
    except Exception as e:
        print(f"Error generating content with Gemini: {e}")
        print(f"Error details: {str(e)}")
        return None, None, None

def generate_additional_images(suggested_image_descriptions):
    """Generates additional images based on suggested image descriptions in the content."""
    additional_images = []
    
    for i, desc in enumerate(suggested_image_descriptions):
        print(f"\nGenerating additional image {i+1}: '{desc}'")
        
        # Create filename for the additional image
        image_filename_base = f"additional-image-{i+1}-{slugify(desc[:30])}"
        new_image_filename = f"{image_filename_base}.webp"
        new_image_path_local = os.path.join(BLOG_IMAGES_DIR, new_image_filename)
        
        # The path that will be used in the markdown file
        markdown_image_path = f"/blog/images/{new_image_filename}"
        
        try:
            # Import the image generator module
            import sys
            sys.path.append(PARENT_DIR)
            import image_generator
            
            # Prepare the prompt for image generation
            image_prompt = f"Create a high-quality cryptocurrency image showing: {desc}"
            image_prompt += ". Clean, professional design. No text or captions in the image."
            
            print(f"Attempting to generate image with Gemini using prompt: '{image_prompt}'")
            
            # Call the image generator function
            image_generated = image_generator.generate_image_with_gemini(new_image_path_local, image_prompt)
            
            if image_generated:
                print(f"Successfully generated additional image at: {new_image_path_local}")
                
                # Create a short caption (max 5 words)
                short_caption = ' '.join(desc.split()[:5])
                
                # Create HTML for the image with simplified caption
                image_html = f'''
<figure style='text-align: center;'>
  <img src='{markdown_image_path}' alt='{short_caption}' style='width:100%;max-width:600px;margin:0 auto;display:block;'>
  <figcaption style='font-size: 0.9em; color: #555; margin-top: 5px;'>{short_caption}</figcaption>
</figure>
'''
                
                additional_images.append({
                    'description': desc,
                    'local_path': new_image_path_local,
                    'markdown_path': markdown_image_path,
                    'html': image_html,
                    'github_path': f"blog/images/{new_image_filename}"
                })
            else:
                print(f"Failed to generate additional image for: {desc}")
        except Exception as e:
            print(f"Error generating additional image: {e}")
    
    return additional_images

def create_markdown_file(title, author, category, excerpt, frontmatter_image_html, main_content, inline_image_html_with_caption, user_idea, additional_images=None):
    """Creates the markdown file with frontmatter and content on GitHub."""
    post_slug = slugify(title)
    if not post_slug: 
        post_slug = slugify(user_idea) if user_idea else "untitled-post"
        
    filename = f"{post_slug}.md"
    filepath = f"blog/markdown/{filename}"

    word_count = len(main_content.split())
    read_time = max(1, round(word_count / 200))
    date_str = datetime.now().strftime("%Y-%m-%d")

    # Prepare title and excerpt with escaped quotes
    safe_title = title.replace('"', '&quot;')
    safe_excerpt = excerpt.replace('"', '&quot;')
    
    frontmatter = f'''---
title: "{safe_title}"
date: {date_str}
author: "{author}"
category: {category}
readTime: {read_time}
excerpt: "{safe_excerpt}"
image: {frontmatter_image_html}
featured: false
---
'''
    
    # Process content to replace suggested image placeholders with actual images
    processed_content = main_content
    if additional_images:
        for img in additional_images:
            placeholder = f"[SUGGESTED_IMAGE: {img['description']}]"
            if placeholder in processed_content:
                processed_content = processed_content.replace(placeholder, img['html'])
    
    content_parts = processed_content.split("\n\n", 1)
    if len(content_parts) > 1:
        first_block = content_parts[0]
        rest_of_content = content_parts[1]
        
        if first_block.startswith("#") or len(first_block.split()) < 30:
             final_content = f"{first_block}\n\n{inline_image_html_with_caption}\n\n{rest_of_content}"
        else: 
             final_content = f"{first_block}\n\n{inline_image_html_with_caption}\n\n{rest_of_content}"
    else: 
        final_content = f"{processed_content}\n\n{inline_image_html_with_caption}"

    full_file_content = f"{frontmatter}\n{final_content}"

    # Upload to GitHub
    if github_create_file(filepath, full_file_content, f"Add new blog post: {title}"):
        print(f"\nSuccessfully created blog post on GitHub: {filepath}")
        
        # Update the index.json file
        image_path = frontmatter_image_html.split('src="')[1].split('"')[0]
        update_blog_index(title, post_slug, excerpt, category, image_path)
        
        return filepath
    else:
        print("Failed to create blog post on GitHub.")
        return None

# --- Main Execution ---
if __name__ == "__main__":
    user_inputs = get_user_input()

    # Generate content and image locally
    initial_slug_for_image = slugify(user_inputs["idea"]) if user_inputs["idea"] else "blog-image"
    md_img_path, fm_img_html, inline_img_html, local_img_path = handle_image(
        user_inputs["image_path_input"],
        initial_slug_for_image, 
        user_inputs["image_alt_text"]
    )

    if not md_img_path or not local_img_path:
        print("Failed to process image. Exiting.")
        exit()

    title, excerpt, content_body = generate_content_with_gemini(
        user_inputs["idea"],
        user_inputs["category"]
    )

    if title and excerpt and content_body and local_img_path:
        # Upload main image to GitHub
        github_image_path = f"blog/images/{os.path.basename(local_img_path)}"
        main_image_uploaded = upload_image_to_github(local_img_path, github_image_path)
        
        if not main_image_uploaded:
            print("Failed to upload main image to GitHub. Post not created.")
            exit()
            
        # Extract suggested image descriptions from content
        import re
        suggested_image_pattern = r"\[SUGGESTED_IMAGE:\s*([^\]]+)\]"
        suggested_image_descriptions = re.findall(suggested_image_pattern, content_body)
        
        additional_images = []
        if suggested_image_descriptions:
            print(f"Found {len(suggested_image_descriptions)} suggested image placeholders in content.")
            additional_images = generate_additional_images(suggested_image_descriptions)
            
            # Upload additional images to GitHub
            for img in additional_images:
                if not upload_image_to_github(img['local_path'], img['github_path']):
                    print(f"Warning: Failed to upload additional image: {img['description']}")
        
        # Create markdown file on GitHub with all images
        created_file_path = create_markdown_file(
            title,
            user_inputs["author"],
            user_inputs["category"],
            excerpt,
            fm_img_html, 
            content_body,
            inline_img_html,
            user_inputs["idea"],
            additional_images
        )
        
        if created_file_path:
            print(f"\nBlog post created successfully on GitHub!")
            print(f"View it at: https://github.com/{GITHUB_REPO}/blob/main/{created_file_path}")
            
            # Add, commit, and push the new blog post and images to GitHub
            print("\nBlog post created successfully! Adding and committing to Git...")
            
            try:
                # Add the new files
                add_result = subprocess.run(["git", "add", created_file_path], cwd=BASE_DIR, capture_output=True, text=True)
                
                # Add any new images
                image_paths = [f"blog/images/{os.path.basename(local_img_path)}"]
                for img in additional_images:
                    image_paths.append(img['github_path'])
                
                for img_path in image_paths:
                    add_img_result = subprocess.run(["git", "add", img_path], cwd=BASE_DIR, capture_output=True, text=True)
                
                # Commit the changes
                commit_result = subprocess.run(["git", "commit", "-m", f"Add blog post: {title}"], cwd=BASE_DIR, capture_output=True, text=True)
                
                # Push the changes
                print("\nPushing changes to GitHub...")
                push_result = subprocess.run(["git", "push"], cwd=BASE_DIR, capture_output=True, text=True)
                
                if push_result.returncode == 0:
                    print("\nBlog post successfully created and all changes pushed to GitHub!")
                else:
                    print(f"\nWarning: Push failed with error: {push_result.stderr}")
                    print("You may need to manually push the changes later.")
            except Exception as e:
                print(f"\nError with Git operations: {e}")
                print("You may need to manually add, commit, and push the changes.")
                print("Use: git add . && git commit -m \"Add new blog post\" && git push")
    else:
        print("Failed to generate content or image. Post not created.")
