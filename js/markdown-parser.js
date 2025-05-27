/**
 * MarkdownBlog - Hệ thống chuyển đổi Markdown thành HTML
 * Duy trì header, footer và style của trang web chính
 */
class MarkdownBlog {
    constructor() {
        this.postsIndex = null;
        this.currentPost = null;
        this.relatedPosts = [];
    }

    /**
     * Tải danh sách bài viết từ file JSON
     */
    async loadPostsIndex() {
        try {
            const response = await fetch('/blog/markdown/index.json');
            if (!response.ok) {
                throw new Error('Không thể tải file index.json');
            }
            this.postsIndex = await response.json();
            return this.postsIndex;
        } catch (error) {
            console.error('Lỗi khi tải danh sách bài viết:', error);
            return null;
        }
    }

    /**
     * Tải nội dung markdown của bài viết
     */
    async getPost(slug) {
        try {
            const response = await fetch(`/blog/markdown/${slug}.md`);
            if (!response.ok) {
                throw new Error(`Không thể tải bài viết: ${slug}`);
            }
            const markdown = await response.text();
            return this.parseMarkdown(markdown);
        } catch (error) {
            console.error('Lỗi khi tải bài viết:', error);
            return null;
        }
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
                data[key] = value.replace(/^['"](.*)['"]$/, '$1'); // Loại bỏ dấu ngoặc kép
            }
        });
        
        return data;
    }

    /**
     * Chuyển đổi Markdown thành HTML
     */
    markdownToHtml(markdown) {
        // Bắt đầu xử lý headings
        let html = markdown
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>');
            
        // Xử lý đoạn text
        html = html.replace(/^\s*(\n)?(.+)/gim, function(m) {
            return /\<(\/)?(h\d|ul|ol|li|blockquote|pre|img|p)/.test(m) ? m : '<p>' + m + '</p>';
        });
            
        // Xử lý bold, italic
        html = html
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>');
            
        // Xử lý links và hình ảnh
        html = html
            .replace(/!\[([^\]]*)\]\(([^\)]*)\)/gim, '<img alt="$1" src="$2" />')
            .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2">$1</a>');
            
        // Xử lý danh sách
        html = html
            .replace(/^\s*\n\* (.*)/gim, '<ul>\n<li>$1</li>')
            .replace(/^\* (.*)/gim, '<li>$1</li>')
            .replace(/^\s*\n\d+\. (.*)/gim, '<ol>\n<li>$1</li>')
            .replace(/^\d+\. (.*)/gim, '<li>$1</li>');
            
        // Xử lý blockquote
        html = html
            .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');
            
        // Xử lý code
        html = html
            .replace(/`([^`]+)`/gim, '<code>$1</code>');
            
        // Clean up
        html = html
            .replace(/<\/ul>\s*\n<ul>/g, '')
            .replace(/<\/ol>\s*\n<ol>/g, '')
            .replace(/\n$/gim, '<br />');
            
        return html.trim();
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

    /**
     * Format ngày
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    /**
     * Hiển thị bài viết
     */
    async renderPost(slug) {
        if (!this.postsIndex) {
            await this.loadPostsIndex();
        }

        const post = await this.getPost(slug);
        if (!post) return false;

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
            <a href="?slug=${post.slug}" class="related-post">
                <div class="related-image">${post.image || '📄'}</div>
                <div class="related-content">
                    <h4 class="related-post-title">${post.title}</h4>
                    <div class="related-post-meta">${this.formatDate(post.date)} · ${post.readTime} phút đọc</div>
                </div>
            </a>`;
        });

        relatedContainer.innerHTML = html;
    }

    /**
     * Lấy tên danh mục
     */
    getCategoryName(category) {
        const categories = {
            'tutorial': 'Hướng dẫn',
            'news': 'Tin tức',
            'analysis': 'Phân tích',
            'airdrop': 'Airdrop'
        };
        return categories[category] || category;
    }

    /**
     * Hiển thị danh sách bài viết
     */
    async renderPostsList(category = 'all') {
        if (!this.postsIndex) {
            await this.loadPostsIndex();
        }

        const blogGrid = document.getElementById('blogGrid');
        if (!blogGrid || !this.postsIndex || !this.postsIndex.posts) return false;

        let posts = this.postsIndex.posts;
        if (category !== 'all') {
            posts = posts.filter(post => post.category === category);
        }

        // Tìm bài viết nổi bật
        const featuredPost = posts.find(post => post.featured);
        
        let html = '';
        
        // Render bài viết nổi bật
        if (featuredPost) {
            html += `
            <article class="blog-post featured-post" data-category="${featuredPost.category}">
                <div class="post-image featured-image">${featuredPost.image || '📄'}</div>
                <div class="featured-content">
                    <span class="featured-badge">⭐ Nổi bật</span>
                    <div class="post-category">${this.getCategoryName(featuredPost.category)}</div>
                    <h2 class="post-title">
                        <a href="post.html?slug=${featuredPost.slug}">
                            ${featuredPost.title}
                        </a>
                    </h2>
                    <p class="post-excerpt">
                        ${featuredPost.excerpt}
                    </p>
                    <div class="post-meta">
                        <div class="post-date">
                            <span>📅</span>
                            <span>${this.formatDate(featuredPost.date)}</span>
                        </div>
                        <div class="read-time">
                            <span>⏱️</span>
                            <span>${featuredPost.readTime} phút đọc</span>
                        </div>
                    </div>
                </div>
            </article>`;
        }

        // Render các bài viết khác
        posts.forEach(post => {
            if (featuredPost && post.slug === featuredPost.slug) return;
            
            html += `
            <article class="blog-post" data-category="${post.category}">
                <div class="post-image">${post.image || '📄'}</div>
                <div class="post-content">
                    <div class="post-category">${this.getCategoryName(post.category)}</div>
                    <h3 class="post-title">
                        <a href="post.html?slug=${post.slug}">
                            ${post.title}
                        </a>
                    </h3>
                    <p class="post-excerpt">
                        ${post.excerpt}
                    </p>
                    <div class="post-meta">
                        <div class="post-date">
                            <span>📅</span>
                            <span>${this.formatDate(post.date)}</span>
                        </div>
                        <div class="read-time">
                            <span>⏱️</span>
                            <span>${post.readTime} phút đọc</span>
                        </div>
                    </div>
                </div>
            </article>`;
        });

        blogGrid.innerHTML = html;
        return true;
    }

    /**
     * Tìm kiếm bài viết
     */
    async searchPosts(searchTerm) {
        if (!this.postsIndex) {
            await this.loadPostsIndex();
        }

        if (!searchTerm || !this.postsIndex || !this.postsIndex.posts) return [];

        searchTerm = searchTerm.toLowerCase();
        return this.postsIndex.posts.filter(post => {
            return post.title.toLowerCase().includes(searchTerm) || 
                   post.excerpt.toLowerCase().includes(searchTerm);
        });
    }
}

// Khởi tạo đối tượng blog
const blog = new MarkdownBlog();

// Kiểm tra xem có param slug không để hiển thị chi tiết bài viết
document.addEventListener('DOMContentLoaded', async function() {
    // Xử lý trang chi tiết bài viết
    if (window.location.pathname.includes('post.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');
        
        if (slug) {
            await blog.renderPost(slug);
        }
    }
    
    // Xử lý trang danh sách bài viết
    if (window.location.pathname.includes('index.html') && window.location.pathname.includes('blog')) {
        // Lấy category từ URL nếu có
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category') || 'all';
        
        // Render danh sách bài viết
        await blog.renderPostsList(category);
        
        // Đánh dấu filter button active
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Xử lý filter bài viết
        filterButtons.forEach(btn => {
            btn.addEventListener('click', async () => {
                const selectedCategory = btn.dataset.category;
                
                // Cập nhật URL với category mới
                const url = new URL(window.location);
                url.searchParams.set('category', selectedCategory);
                window.history.pushState({}, '', url);
                
                // Render lại danh sách bài viết
                await blog.renderPostsList(selectedCategory);
                
                // Cập nhật trạng thái active cho buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // Xử lý tìm kiếm
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', async (e) => {
                const searchTerm = e.target.value;
                if (searchTerm.length > 2) {
                    const results = await blog.searchPosts(searchTerm);
                    // Hiển thị kết quả tìm kiếm
                    const blogGrid = document.getElementById('blogGrid');
                    if (blogGrid) {
                        let html = '';
                        results.forEach(post => {
                            html += `
                            <article class="blog-post" data-category="${post.category}">
                                <div class="post-image">${post.image || '📄'}</div>
                                <div class="post-content">
                                    <div class="post-category">${blog.getCategoryName(post.category)}</div>
                                    <h3 class="post-title">
                                        <a href="post.html?slug=${post.slug}">
                                            ${post.title}
                                        </a>
                                    </h3>
                                    <p class="post-excerpt">
                                        ${post.excerpt}
                                    </p>
                                    <div class="post-meta">
                                        <div class="post-date">
                                            <span>📅</span>
                                            <span>${blog.formatDate(post.date)}</span>
                                        </div>
                                        <div class="read-time">
                                            <span>⏱️</span>
                                            <span>${post.readTime} phút đọc</span>
                                        </div>
                                    </div>
                                </div>
                            </article>`;
                        });
                        
                        if (results.length === 0) {
                            html = '<div style="text-align: center; width: 100%; grid-column: 1/-1;"><p>Không tìm thấy kết quả phù hợp</p></div>';
                        }
                        
                        blogGrid.innerHTML = html;
                    }
                } else if (searchTerm.length === 0) {
                    // Nếu xóa hết từ khóa tìm kiếm, render lại tất cả bài viết
                    const activeCategory = document.querySelector('.filter-btn.active')?.dataset.category || 'all';
                    await blog.renderPostsList(activeCategory);
                }
            });
        }
    }
});
