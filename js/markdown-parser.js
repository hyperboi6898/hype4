/**
 * MarkdownBlog - Hệ thống chuyển đổi Markdown thành HTML
 * Duy trì header, footer và style của trang web chính
 */
class MarkdownBlog {
    constructor() {
        this.postsIndex = null;
        this.currentPost = null;
        this.relatedPosts = [];
        this.postCache = {};
    }

    /**
     * Tải danh sách bài viết từ index.json
     */
    async loadPostsIndex() {
        // Kiểm tra cache trước
        if (this.postsIndex) {
            return this.postsIndex;
        }

        try {
            // Tải index.json để lấy danh sách bài viết
            const response = await fetch('/blog/markdown/index.json');
            
            if (response.ok) {
                this.postsIndex = await response.json();
                console.log(`Đã tải ${this.postsIndex.posts.length} bài viết từ index.json`);
                return this.postsIndex;
            }
            
            // Nếu không có index.json, thử tải từng file markdown
            console.warn('Không tìm thấy index.json, thử tải trực tiếp từ các file markdown');
            
            // Danh sách các file markdown cần tải
            const markdownFiles = [
                'huong-dan-trading.md',
                'airdrop-season-2.md',
                'hyperliquid-vs-dex.md',
                'hype-token-ath.md',
                'hyperliquid-dat-cot-moc-100-ty-do-la-khoi-luong-giao-dich.md'
            ];
            
            const posts = [];
            
            // Tải từng file markdown một
            for (const fileName of markdownFiles) {
                try {
                    const slug = fileName.replace('.md', '');
                    const response = await fetch(`/blog/markdown/${fileName}`);
                    
                    if (!response.ok) {
                        console.warn(`Không thể tải file ${fileName}`);
                        continue;
                    }
                    
                    const markdown = await response.text();
                    const postData = this.parseMarkdown(markdown);
                    
                    if (postData) {
                        posts.push({
                            slug: slug,
                            title: postData.title || 'Untitled',
                            excerpt: postData.excerpt || '',
                            category: postData.category || 'uncategorized',
                            date: postData.date || new Date().toISOString().split('T')[0],
                            readTime: postData.readTime || 5,
                            image: postData.image || '📄',
                            featured: postData.featured || false
                        });
                    }
                } catch (postError) {
                    console.warn(`Lỗi khi xử lý file ${fileName}:`, postError);
                }
            }
            
            // Sắp xếp bài viết theo ngày, mới nhất lên đầu
            posts.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            this.postsIndex = { posts };
            return this.postsIndex;
        } catch (error) {
            console.error('Lỗi khi tải danh sách bài viết:', error);
            
            // Fallback: Trả về mảng rỗng nếu có lỗi
            this.postsIndex = { posts: [] };
            return this.postsIndex;
        }
    }

    /**
     * Tải nội dung markdown của bài viết trực tiếp từ file
     */
    async getPost(slug) {
        // Nếu đã có trong cache, trả về ngay
        if (this.postCache[slug]) {
            return this.postCache[slug];
        }

        try {
            // Tải trực tiếp từ file markdown
            const response = await fetch(`/blog/markdown/${slug}.md`);
            if (!response.ok) {
                throw new Error(`Không thể tải bài viết: ${slug}`);
            }
            
            const markdown = await response.text();
            const parsed = this.parseMarkdown(markdown);
            
            // Lưu vào cache
            this.postCache[slug] = parsed;
            return parsed;
        } catch (error) {
            console.error('Lỗi khi tải bài viết:', error);
            return null;
        }
    }

    /**
     * Định dạng ngày thành chuỗi ngày/tháng/năm kiểu Việt Nam
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        if (isNaN(date)) return dateString;
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    /**
     * Phân tích file Markdown
     */
    parseMarkdown(markdown) {
        // Tách phần frontmatter và nội dung
        const parts = markdown.split('---');
        if (parts.length < 3) {
            return { content: this.markdownToHtml(markdown) };
        }

        const frontmatter = this.parseFrontmatter(parts[1]);
        const content = this.markdownToHtml(parts[2]);
        
        return { ...frontmatter, content };
    }

    /**
     * Phân tích phần frontmatter
     */
    parseFrontmatter(fm) {
        const lines = fm.trim().split('\n');
        const data = {};
        lines.forEach(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex !== -1) {
                const key = line.substring(0, colonIndex).trim();
                const value = line.substring(colonIndex + 1).trim();
                data[key] = value.replace(/^['\"](.*)['\"]$/, '$1'); // Loại bỏ dấu ngoặc kép
            }
        });
        return data;
    }

    /**
     * Chuyển đổi Markdown thành HTML (hỗ trợ bảng, đoạn, tiêu đề, danh sách, v.v.)
     */
    markdownToHtml(markdown) {
        // Xử lý bảng trước
        let html = this.processMarkdownTables(markdown);
        // Headings
        html = html
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>');
        // Đoạn văn: chia đoạn bằng 2 dòng xuống
        const paragraphs = html.split(/\n\n+/);
        html = paragraphs.map(p => {
            if (p.trim() === '') return '';
            if (p.match(/^<(\/)?(h\d|ul|ol|li|blockquote|pre|img|p|table|tr|td|th)/)) return p;
            return '<p>' + p.replace(/\n/g, ' ') + '</p>';
        }).join('\n\n');
        // Bold, Italic
        html = html
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
        // Links, Images
        html = html
            .replace(/!\[([^\]]*)\]\(([^\)]*)\)/g, '<img alt="$1" src="$2" />')
            .replace(/\[([^\]]*)\]\(([^\)]*)\)/g, '<a href="$2">$1</a>');
        // Danh sách
        html = html
            .replace(/^\s*\n\* (.*)/gim, '<ul>\n<li>$1</li>')
            .replace(/^\* (.*)/gim, '<li>$1</li>')
            .replace(/^\s*\n\d+\. (.*)/gim, '<ol>\n<li>$1</li>')
            .replace(/^\d+\. (.*)/gim, '<li>$1</li>');
        // Blockquote
        html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
        // Inline code
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        // Clean up
        html = html
            .replace(/<\/ul>\s*\n<ul>/g, '')
            .replace(/<\/ol>\s*\n<ol>/g, '')
            .replace(/\n$/gim, '<br />');
        return html.trim();
    }

    /**
     * Xử lý bảng Markdown thành HTML table
     */
    processMarkdownTables(markdown) {
        const lines = markdown.split('\n');
        let inTable = false;
        let tableContent = [];
        let result = [];
        
        // Process each line
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();
            
            // Check if this line is part of a table
            if (trimmedLine.startsWith('|')) {
                if (!inTable) {
                    inTable = true;
                    tableContent = [];
                }
                tableContent.push(line);
            } else {
                // Not a table line
                if (inTable) {
                    // We were in a table, now we're not - process the table
                    if (tableContent.length >= 2) { // Allow tables with just header and separator
                        result.push(this.convertTableToHtml(tableContent));
                    } else {
                        // Not enough lines for a valid table, treat as regular text
                        result = result.concat(tableContent);
                    }
                    inTable = false;
                    tableContent = [];
                }
                result.push(line);
            }
        }
        
        // Handle table at the end of content
        if (inTable) {
            if (tableContent.length >= 2) { // Allow tables with just header and separator
                result.push(this.convertTableToHtml(tableContent));
            } else {
                result = result.concat(tableContent);
            }
        }
        
        return result.join('\n');
    }

    /**
     * Chuyển bảng Markdown thành HTML table
     */
    convertTableToHtml(tableLines) {
        const processedLines = tableLines.map(line => {
            return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(cell => cell.trim());
        });
        const headers = processedLines[0];
        const rows = processedLines.slice(2);
        let html = '<table class="markdown-table">';
        html += '<thead><tr>';
        headers.forEach(header => { html += `<th>${header}</th>`; });
        html += '</tr></thead>';
        html += '<tbody>';
        rows.forEach(row => {
            html += '<tr>';
            row.forEach(cell => { html += `<td>${cell}</td>`; });
            html += '</tr>';
        });
        html += '</tbody></table>';
        return html;
    }

    /**
     * Hiển thị chi tiết bài viết
     */
    async renderPost(slug) {
        try {
            if (!this.postsIndex) {
                await this.loadPostsIndex();
            }

            const post = await this.getPost(slug);
            if (!post) {
                console.error(`Không tìm thấy bài viết với slug: ${slug}`);
                return false;
            }

            // Lưu thông tin bài viết hiện tại
            this.currentPost = post;
            
            // Tìm các bài viết liên quan
            this.relatedPosts = this.findRelatedPosts(slug, post.category);

            // Cập nhật tiêu đề trang
            document.title = post.title + ' - Hyperliquid Vietnam';

            // Cập nhật tiêu đề và metadata bài viết
            const postHeader = document.querySelector('.post-header h1');
            if (postHeader) postHeader.textContent = post.title;

            const postDate = document.querySelector('.post-meta-header .post-date');
            if (postDate) postDate.textContent = this.formatDate(post.date);

            const postAuthor = document.querySelector('.post-meta-header .post-author');
            if (postAuthor) postAuthor.textContent = post.author || 'Team HyperVN';

            const postReadTime = document.querySelector('.post-meta-header .post-readtime');
            if (postReadTime) postReadTime.textContent = `${post.readTime} phút đọc`;

            const postCategory = document.querySelector('.post-meta-header .post-category');
            if (postCategory) postCategory.textContent = this.getCategoryName(post.category);

            // Cập nhật nội dung bài viết
            const postContent = document.querySelector('.post-content');
            if (postContent) postContent.innerHTML = post.content;

            // Render bài viết liên quan
            this.renderRelatedPosts();

            return true;
        } catch (error) {
            console.error('Error loading blog post:', error);
            return false;
        }
    }

    /**
     * Hiển thị các bài viết liên quan
     */
    renderRelatedPosts() {
        const relatedContainer = document.querySelector('.related-posts');
        if (!relatedContainer) return;

        let html = '';
        this.relatedPosts.forEach(post => {
            html += `
                <div class="related-post">
                    <a href="post.html?slug=${post.slug}">
                        <div class="related-post-image">${post.image}</div>
                        <div class="related-post-content">
                            <h3>${post.title}</h3>
                            <div class="related-post-meta">${this.formatDate(post.date)} · ${post.readTime} phút đọc</div>
                            <p>${post.excerpt}</p>
                        </div>
                    </a>
                </div>
            `;
        });

        relatedContainer.innerHTML = html || '<p>Không có bài viết liên quan.</p>';
    }

    /**
     * Lấy tên danh mục từ mã danh mục
     */
    getCategoryName(categoryCode) {
        const categories = {
            'news': 'Tin tức',
            'tutorial': 'Hướng dẫn',
            'analysis': 'Phân tích',
            'airdrop': 'Airdrop'
        };
        return categories[categoryCode] || 'Chưa phân loại';
    }

    /**
     * Hiển thị danh sách bài viết
     */
    async renderPostsList(category = 'all') {
        if (!this.postsIndex) {
            await this.loadPostsIndex();
        }

        const postsContainer = document.querySelector('#blogGrid') || document.querySelector('.blog-grid');
        const featuredContainer = document.querySelector('.featured-post');
        
        if (!postsContainer) {
            console.error('Không tìm thấy container cho danh sách bài viết');
            return;
        }

        // Lọc bài viết theo danh mục nếu cần
        let filteredPosts = [...this.postsIndex.posts];
        if (category !== 'all') {
            filteredPosts = filteredPosts.filter(post => post.category === category);
        }

        // Nếu không có bài viết
        if (filteredPosts.length === 0) {
            postsContainer.innerHTML = '<div class="no-posts">Không có bài viết nào trong danh mục này.</div>';
            if (featuredContainer) featuredContainer.style.display = 'none';
            return;
        }

        // Tìm bài viết nổi bật (featured)
        const featuredPost = filteredPosts.find(post => post.featured) || filteredPosts[0];
        
        // Hiển thị bài viết nổi bật nếu có container
        if (featuredContainer && featuredPost) {
            featuredContainer.innerHTML = `
                <div class="featured-post-image">
                    ${featuredPost.image}
                </div>
                <div class="featured-post-content">
                    <div class="post-category">${this.getCategoryName(featuredPost.category)}</div>
                    <h2><a href="post.html?slug=${featuredPost.slug}">${featuredPost.title}</a></h2>
                    <div class="post-meta">
                        <div class="post-date">
                            <span>${this.formatDate(featuredPost.date)}</span>
                        </div>
                        <div class="post-readtime">
                            <span>${featuredPost.readTime} phút đọc</span>
                        </div>
                    </div>
                    <p>${featuredPost.excerpt}</p>
                    <a href="post.html?slug=${featuredPost.slug}" class="read-more">Đọc tiếp</a>
                </div>
            `;
        }

        // Hiển thị các bài viết khác (trừ bài featured)
        const otherPosts = filteredPosts.filter(post => post !== featuredPost);
        
        let postsHtml = '';
        otherPosts.forEach(post => {
            postsHtml += `
                <div class="blog-post">
                    <div class="post-image">
                        <a href="post.html?slug=${post.slug}">
                            ${post.image}
                        </a>
                    </div>
                    <div class="post-content">
                        <div class="post-category">${this.getCategoryName(post.category)}</div>
                        <h3><a href="post.html?slug=${post.slug}">${post.title}</a></h3>
                        <div class="post-meta">
                            <div class="post-date">
                                <span>${this.formatDate(post.date)}</span>
                            </div>
                            <div class="post-readtime">
                                <span>${post.readTime} phút đọc</span>
                            </div>
                        </div>
                        <p>${post.excerpt}</p>
                        <a href="post.html?slug=${post.slug}" class="read-more">Đọc tiếp</a>
                    </div>
                </div>
            `;
        });
        
        postsContainer.innerHTML = postsHtml;
    }

    /**
     * Tìm bài viết liên quan
     */
    findRelatedPosts(currentSlug, category, count = 3) {
        if (!this.postsIndex || !this.postsIndex.posts) return [];
        return this.postsIndex.posts
            .filter(post => post.slug !== currentSlug && post.category === category)
            .slice(0, count);
    }
}

// Khởi tạo đối tượng blog
const blog = new MarkdownBlog();
window.blog = blog; // Đảm bảo blog là global

// Kiểm tra xem có param slug không để hiển thị chi tiết bài viết
document.addEventListener('DOMContentLoaded', async function() {
    // Xử lý trang chi tiết bài viết
    if (window.location.pathname.includes('post.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');
        
        if (slug) {
            try {
                console.log('Loading blog post:', slug);
                await blog.renderPost(slug);
            } catch (error) {
                console.error('Error loading blog post:', error);
            }
        }
    }
    
    // Xử lý trang danh sách bài viết
    if (window.location.pathname.includes('blog/index.html') || window.location.pathname.endsWith('/blog/')) {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category') || 'all';
        
        try {
            await blog.renderPostsList(category);
            
            // Xử lý chuyển đổi danh mục
            const categoryLinks = document.querySelectorAll('.category-filter a');
            categoryLinks.forEach(link => {
                link.addEventListener('click', async function(e) {
                    e.preventDefault();
                    
                    // Xóa class active từ tất cả các link
                    categoryLinks.forEach(l => l.classList.remove('active'));
                    
                    // Thêm class active cho link được click
                    this.classList.add('active');
                    
                    // Lấy danh mục từ data attribute
                    const selectedCategory = this.getAttribute('data-category') || 'all';
                    
                    // Cập nhật URL
                    const newUrl = selectedCategory === 'all' 
                        ? window.location.pathname 
                        : `${window.location.pathname}?category=${selectedCategory}`;
                    history.pushState({}, '', newUrl);
                    
                    // Render lại danh sách bài viết
                    await blog.renderPostsList(selectedCategory);
                });
            });
            
            // Đánh dấu danh mục đang active
            const activeCategory = category || 'all';
            const activeCategoryLink = document.querySelector(`.category-filter a[data-category="${activeCategory}"]`);
            if (activeCategoryLink) {
                activeCategoryLink.classList.add('active');
            }
        } catch (error) {
            console.error('Error loading blog posts:', error);
        }
    }
});

// Debug: Log blog object
console.log('MarkdownBlog instance initialized:', blog);
console.log('typeof blog.renderPost:', typeof blog.renderPost);
