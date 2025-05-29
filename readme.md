# Hyperliquid Vietnam Landing Page

## 🚀 Features
- Real-time HYPE price ticker
- Dark/Light theme toggle
- Mobile responsive design
- Referral code integration (VN84)
- FAQ, testimonials, blog sections
- Markdown-based blog system
- Dynamic blog content loading

## 🔗 Links
- Live site: [Your domain]
- Hyperliquid app: https://app.hyperliquid.xyz/join/VN84

## 📁 Project Structure
```
hype4/
├── index.html              # Main HTML page
├── css/
│   ├── styles.css          # Main CSS styles
│   ├── styles-part2.css    # Additional CSS styles
│   ├── styles-part3.css    # Additional CSS styles
│   ├── styles-part4.css    # Additional CSS styles (blog section)
│   ├── styles-part5.css    # Additional CSS styles
│   └── styles-part6.css    # Additional CSS styles (animations)
├── js/
│   ├── main.js             # Main JavaScript
│   ├── markdown-parser.js  # Markdown processing
│   ├── blog-loader.js      # Dynamic blog loading
│   └── animations.js       # Animation handling
├── blog/
│   ├── index.html          # Blog listing page
│   ├── post.html           # Blog post template
│   └── markdown/           # Markdown blog posts
│       └── index.json      # Blog post metadata
└── images/
    └── ...                 # Images
```

## 🛠️ Development

```bash
# Clone repository
git clone https://github.com/hyperboi6898/hype4.git

# Navigate to project directory
cd hype4

# Start local server
npx http-server -p 8080
```

## 📦 Tech Stack
- HTML5, CSS3, Vanilla JavaScript
- Responsive design with CSS Grid/Flexbox
- Dynamic blog content with JavaScript
- Fade-in animations
- Markdown-based blog system

## 📝 Blog System

### Adding New Blog Posts
1. Create a Markdown file in `blog/markdown/` folder with the following format:

```markdown
---
title: Blog post title
date: 2025-05-27
author: Author name
category: tutorial
readTime: 15
excerpt: Brief summary of the post
image: <img src="/blog/images/your-image.webp" alt="Image description" style="width:100%;height:auto;">
featured: false
---

# Blog content goes here
...
```

2. Update `blog/markdown/index.json` to include the new post:

```json
{
  "posts": [
    {
      "slug": "your-markdown-filename",
      "title": "Blog post title",
      "excerpt": "Brief summary of the post",
      "category": "tutorial",
      "date": "2025-05-27",
      "readTime": 15,
      "image": "<img src=\"/blog/images/your-image.webp\" alt=\"Image description\" style=\"width:100%;height:auto;\">",
      "featured": false
    }
  ]
}
```

3. Access your post at: `blog/post.html?slug=your-markdown-filename`

## ⚠️ Known Issues and Solutions

### Blog Section Visibility Issue
**Problem**: Blog cards with the `fade-in` class might not be visible on the page because they need the `visible` class to be displayed.

**Cause**: The CSS in both `styles.css` and `styles-part6.css` defines the `fade-in` class to have `opacity: 0` by default, only becoming visible when the `visible` class is added:

```css
.fade-in {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
}

.fade-in.visible {
    opacity: 1;
    transform: translateY(0);
}
```

**Solution**: Added `animations.js` script which automatically adds the `visible` class to elements with the `fade-in` class. This ensures that all fade-in elements become visible after they are loaded.

## 🌐 Deploy Options

### GitHub Pages (Free)
```bash
# Settings > Pages > Source: Deploy from branch > main
# Site will be available at: https://hyperboi6898.github.io/hype4/
```

### Netlify/Vercel (Free)
```bash
# Connect GitHub repo directly
# Auto-deploy when you push new code
```