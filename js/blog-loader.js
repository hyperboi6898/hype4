/**
 * Simple Blog Post Loader
 * Loads the latest blog posts from the index.json file
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get the blog grid container
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) {
        console.error('Blog grid container not found');
        return;
    }
    
    // Show loading message
    blogGrid.innerHTML = '<div style="text-align: center; padding: 2rem;"><p>Đang tải bài viết...</p></div>';
    
    // Fetch the blog index
    fetch('/blog/markdown/index.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch blog index');
            }
            return response.json();
        })
        .then(data => {
            // Sort posts by date (newest first)
            const sortedPosts = data.posts.sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });
            
            // Clear loading message
            blogGrid.innerHTML = '';
            
            // Take the first 3 posts
            const postsToShow = sortedPosts.slice(0, 3);
            
            // Add each post to the blog grid
            postsToShow.forEach(post => {
                // Extract image URL from the image HTML
                let imageSrc = '/blog/images/image.webp'; // Default image
                const imageMatch = post.image.match(/src=\"([^\"]+)\"/i);
                if (imageMatch && imageMatch[1]) {
                    imageSrc = imageMatch[1];
                }
                
                // Format relative time
                const postDate = new Date(post.date);
                const now = new Date();
                const diffDays = Math.floor(Math.abs(now - postDate) / (1000 * 60 * 60 * 24));
                
                let timeText = 'Hôm nay';
                if (diffDays === 1) timeText = 'Hôm qua';
                else if (diffDays > 1) timeText = `${diffDays} ngày trước`;
                
                // Create blog card HTML
                const postHTML = `
                    <div class="blog-card fade-in">
                        <div class="blog-image">
                            <img src="${imageSrc}" alt="${post.title}" class="blog-thumbnail">
                        </div>
                        <div class="blog-content">
                            <h3 class="blog-title">
                                <a href="blog/post.html?slug=${post.slug}" style="color: inherit; text-decoration: none;">
                                    ${post.title}
                                </a>
                            </h3>
                            <p class="blog-excerpt">${post.excerpt}</p>
                            <div class="blog-meta">
                                <span>${timeText}</span>
                                <span>⏱️ ${post.readTime} phút đọc</span>
                            </div>
                        </div>
                    </div>
                `;
                
                // Add the post to the grid
                blogGrid.innerHTML += postHTML;
            });
            
            console.log('Blog posts loaded successfully');
        })
        .catch(error => {
            console.error('Error loading blog posts:', error);
            blogGrid.innerHTML = '<div style="text-align: center; padding: 2rem;"><p>Lỗi khi tải bài viết. Vui lòng thử lại sau.</p></div>';
        });
});
