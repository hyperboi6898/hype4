
ưới đây là nội dung đầy đủ cho file README.md, bạn có thể copy và thêm vào:

markdown
CopyInsert
# Hyperliquid Vietnam Landing Page

## 🚀 Features
- Real-time HYPE price ticker
- Dark/Light theme toggle
- Mobile responsive design
- Referral code integration (VN84)
- FAQ, testimonials, blog sections
- Markdown-based blog system

## 🔗 Links
- Live site: [Your domain]
- Hyperliquid app: https://app.hyperliquid.xyz/join/VN84

## 📁 Project Structure
hype4/ ├── index.html # Trang HTML chính ├── css/ │ └── styles.css # CSS styles ├── js/ │ ├── main.js # JavaScript chính │ └── markdown-parser.js # Xử lý blog Markdown ├── blog/ │ ├── index.html # Trang danh sách blog │ ├── post.html # Template chi tiết bài viết │ ├── posts/ # HTML blog posts │ └── markdown/ # Markdown blog posts ├── images/ │ └── ... # Hình ảnh └── assets/ └── fonts/ # Fonts

CopyInsert

## 🛠️ Development
```bash
# Clone repository
git clone [https://github.com/hyperboi6898/hype4.git](https://github.com/hyperboi6898/hype4.git)

# Open with live server for development
📦 Tech Stack
HTML5, CSS3, Vanilla JavaScript
Responsive design with CSS Grid/Flexbox
Real-time price updates
Intersection Observer API for animations
Markdown-based blog system
📝 Blog System
Cách thêm bài viết mới
Tạo file Markdown trong blog/markdown/
markdown
CopyInsert
---
title: Tiêu đề bài viết
date: 2025-05-27
author: Tên tác giả
category: tutorial
readTime: 15
excerpt: Tóm tắt bài viết
image: 📈
---

# Nội dung bài viết
...
Cập nhật blog/markdown/index.json
json
CopyInsert
{
  "posts": [
    {
      "slug": "ten-file-markdown",
      "title": "Tiêu đề bài viết",
      "excerpt": "Tóm tắt bài viết",
      "category": "tutorial",
      "date": "2025-05-27",
      "readTime": 15,
      "image": "📈",
      "featured": false
    }
  ]
}
Truy cập bài viết: blog/post.html?slug=ten-file-markdown
🌐 Deploy options
GitHub Pages (Free):
bash
CopyInsert
# Settings > Pages > Source: Deploy from branch > main
# Site will be available at: https://hyperboi6898.github.io/hype4/
Netlify/Vercel (Free):
bash
CopyInsert
# Connect GitHub repo directly
# Auto-deploy when you push new code