/**
 * Script to generate blog index.json from markdown files
 * Can be run manually or via GitHub Actions
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const slugify = require('slugify');

// Constants
const BLOG_DIR = path.join(__dirname, '..', 'blog', 'markdown');
const INDEX_FILE = path.join(BLOG_DIR, 'index.json');

// Parse command line arguments
const args = process.argv.slice(2);
const mdArg = args.find(arg => arg.startsWith('--md='))?.split('=')[1] || '';
const imgArg = args.find(arg => arg.startsWith('--img='))?.split('=')[1] || '';

/**
 * Generate slug from title
 */
function generateSlug(title) {
  return slugify(title, {
    lower: true,
    strict: true,
    locale: 'vi'
  });
}

/**
 * Create a new blog post template
 */
function createNewPost(title, imagePath) {
  if (!title) return;
  
  const slug = generateSlug(title);
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  const frontmatter = `---
title: "${title}"
date: ${today}
author: "Team HyperVN"
category: news
readTime: 5
excerpt: "Thêm mô tả ngắn về bài viết tại đây."
image: <img src="/blog/images/${imagePath}" alt="${title}" style="width:100%;height:auto;">
featured: false
---

Nội dung bài viết tại đây...
`;

  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  
  // Don't overwrite existing files
  if (fs.existsSync(filePath)) {
    console.error(`File ${filePath} already exists. Please choose a different title.`);
    return;
  }
  
  fs.writeFileSync(filePath, frontmatter, 'utf8');
  console.log(`Created new post: ${filePath}`);
}

/**
 * Generate index.json from all markdown files
 */
function generateIndex() {
  // Get all markdown files
  const files = fs.readdirSync(BLOG_DIR).filter(file => file.endsWith('.md'));
  
  const posts = [];
  
  // Process each file
  for (const file of files) {
    try {
      const filePath = path.join(BLOG_DIR, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(content);
      
      // Skip if not a valid post
      if (!data.title) continue;
      
      const slug = file.replace('.md', '');
      
      posts.push({
        slug,
        title: data.title || 'Untitled',
        excerpt: data.excerpt || '',
        category: data.category || 'uncategorized',
        date: data.date || new Date().toISOString().split('T')[0],
        readTime: data.readTime || 5,
        image: data.image || '📄',
        featured: data.featured || false
      });
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }
  
  // Sort by date (newest first)
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Write index.json
  fs.writeFileSync(INDEX_FILE, JSON.stringify({ posts }, null, 2), 'utf8');
  console.log(`Generated index.json with ${posts.length} posts`);
}

// Main execution
if (mdArg) {
  // Create a new post
  createNewPost(mdArg, imgArg);
}

// Always regenerate the index
generateIndex();
