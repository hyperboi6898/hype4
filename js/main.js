// Theme Toggle
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (body.getAttribute('data-theme') === 'dark') {
        body.setAttribute('data-theme', 'light');
        themeToggle.textContent = '☀️';
    } else {
        body.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '🌙';
    }
}

// Language Toggle
function toggleLanguage() {
    const langToggle = document.querySelector('.lang-toggle');
    if (langToggle.textContent === '🇻🇳') {
        langToggle.textContent = '🇺🇸';
        // Add English translation logic here
    } else {
        langToggle.textContent = '🇻🇳';
        // Add Vietnamese translation logic here
    }
}

// Debug: Check MarkdownBlog instance and renderPost
if (window.blog) {
    console.log('window.blog exists:', window.blog);
    console.log('typeof window.blog.renderPost:', typeof window.blog.renderPost);
} else if (typeof blog !== "undefined") {
    console.log('blog exists:', blog);
    console.log('typeof blog.renderPost:', typeof blog.renderPost);
} else {
    console.log('No global blog object found.');
}


// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            navLinks.classList.remove('active');
        });
    });

    // Animation observers
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
        observer.observe(el);
    });

    // Header background on scroll
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(15, 20, 25, 0.98)';
        } else {
            header.style.background = 'rgba(15, 20, 25, 0.95)';
        }
    });

    // Counter animation
    function animateCounter(element, target, suffix = '') {
        let start = 0;
        const increment = target / 100;
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + suffix;
            }
        }
        updateCounter();
    }

    // Stats animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach((counter, index) => {
                    const target = parseFloat(counter.dataset.target);
                    setTimeout(() => {
                        if (counter.textContent.includes('$')) {
                            animateCounter(counter, target, 'B');
                            counter.textContent = '$' + counter.textContent;
                        } else if (counter.textContent.includes('K')) {
                            animateCounter(counter, target, 'K+');
                        } else if (counter.textContent.includes('%')) {
                            animateCounter(counter, target, '%');
                        } else {
                            animateCounter(counter, target, '+');
                        }
                    }, index * 200);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    });

    if (document.querySelector('.stats')) {
        statsObserver.observe(document.querySelector('.stats'));
    }

    // FAQ Toggle
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
});

// Chat Widget
function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    if (chatWindow.style.display === 'none' || !chatWindow.style.display) {
        chatWindow.style.display = 'flex';
    } else {
        chatWindow.style.display = 'none';
    }
}

// Real-time price updates using CoinGecko API
async function fetchTokenPrice() {
    try {
        // Tạo loading state
        document.getElementById('hype-price').innerHTML = '$<span class="loading"></span>';
        document.getElementById('live-price').innerHTML = '$<span class="loading"></span>';

        // Gọi CoinGecko API (miễn phí, không cần API key)
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=hyperliquid&vs_currencies=usd&include_24hr_change=true');
        
        if (!response.ok) {
            throw new Error('Không thể kết nối đến CoinGecko API');
        }
        
        const data = await response.json();
        
        // Kiểm tra dữ liệu trả về
        if (!data.hyperliquid) {
            throw new Error('Không tìm thấy dữ liệu token HYPE');
        }
        
        // Lấy giá và phần trăm thay đổi
        const price = data.hyperliquid.usd;
        const change = data.hyperliquid.usd_24h_change;
        
        // Cập nhật UI
        document.getElementById('hype-price').textContent = '$' + price.toFixed(2);
        document.getElementById('live-price').textContent = '$' + price.toFixed(2);
        
        const changeElements = [
            document.getElementById('hype-change'),
            document.getElementById('live-change')
        ];
        
        changeElements.forEach(el => {
            if (el) {
                el.textContent = (change > 0 ? '+' : '') + change.toFixed(2) + '%' + (el.id === 'live-change' ? ' (24h)' : '');
                el.className = 'price-change ' + (change > 0 ? 'positive' : 'negative');
            }
        });
        
        console.log('Price updated from CoinGecko:', price);
        return true;
    } catch (error) {
        console.error('Error fetching price:', error);
        
        // Fallback to simulated data if API fails
        const basePrice = 36.92;
        const variation = (Math.random() - 0.5) * 2; // ±1%
        const newPrice = basePrice + variation;
        const change = ((newPrice - basePrice) / basePrice * 100).toFixed(2);
        
        document.getElementById('hype-price').textContent = '$' + newPrice.toFixed(2);
        document.getElementById('live-price').textContent = '$' + newPrice.toFixed(2) + ' (est.)';
        
        const changeElements = [
            document.getElementById('hype-change'),
            document.getElementById('live-change')
        ];
        
        changeElements.forEach(el => {
            if (el) {
                el.textContent = (change > 0 ? '+' : '') + change + '%' + (el.id === 'live-change' ? ' (24h est.)' : '');
                el.className = 'price-change ' + (change > 0 ? 'positive' : 'negative');
            }
        });
        
        console.log('Using simulated price data as fallback');
        return false;
    }
}

// Update prices immediately and then every 60 seconds (để tránh rate limit)
fetchTokenPrice();
setInterval(fetchTokenPrice, 60000);

// Blog Slider Functionality
function initBlogSlider() {
    const slider = document.getElementById('blogSlider');
    if (!slider) return;
    
    const slides = slider.querySelectorAll('.blog-slide');
    const prevBtn = document.getElementById('blogPrev');
    const nextBtn = document.getElementById('blogNext');
    const dotsContainer = document.getElementById('blogDots');
    
    let currentIndex = 0;
    let slidesPerView = 1;
    let autoSlideInterval;
    
    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    // Update slides per view based on screen size
    function updateSlidesPerView() {
        if (window.innerWidth >= 1200) {
            slidesPerView = 3;
        } else if (window.innerWidth >= 768) {
            slidesPerView = 2;
        } else {
            slidesPerView = 1;
        }
    }
    
    // Go to specific slide
    function goToSlide(index) {
        if (index < 0) {
            index = slides.length - slidesPerView;
        } else if (index > slides.length - slidesPerView) {
            index = 0;
        }
        
        currentIndex = index;
        const translateValue = -currentIndex * (100 / slidesPerView) + '%';
        slider.style.transform = `translateX(${translateValue})`;
        
        // Update active dot
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
        
        // Reset auto slide timer
        resetAutoSlide();
    }
    
    // Next slide
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }
    
    // Previous slide
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }
    
    // Start auto slide
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }
    
    // Reset auto slide
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
    
    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Responsive handling
    window.addEventListener('resize', () => {
        updateSlidesPerView();
        goToSlide(currentIndex);
    });
    
    // Initialize
    updateSlidesPerView();
    startAutoSlide();
    
    // Pause auto slide on hover
    slider.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    slider.addEventListener('mouseleave', startAutoSlide);
}

// Initialize blog slider when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initBlogSlider();
});

// Add some interactive chat responses
const chatResponses = [
    "Bạn có thể bắt đầu với $10 để test thử platform nhé! 💰",
    "Mã VN84 sẽ giúp bạn tiết kiệm phí khi đăng ký đấy! 🎁",
    "Hyperliquid không charge phí gas, rất tiết kiệm chi phí! ⚡",
    "Community Telegram VN rất active, mời bạn tham gia! 🇻🇳",
    "Có tutorial video trên YouTube, check it out! 📺"
];

// Simulate auto chat responses
setTimeout(() => {
    const chatBody = document.getElementById('chatBody');
    if (chatBody) {
        const randomResponse = chatResponses[Math.floor(Math.random() * chatResponses.length)];
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message bot';
        messageDiv.textContent = randomResponse;
        chatBody.appendChild(messageDiv);
    }
}, 10000); // Show after 10 seconds
