// Modern JavaScript for TrendMall E-commerce - 2024

// Global State
const appState = {
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    wishlist: JSON.parse(localStorage.getItem('wishlist')) || [],
    darkMode: localStorage.getItem('darkMode') === 'true'
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initDarkMode();
    initSearch();
    initProductFilters();
    initShoppingCart();
    initWishlist();
    initQuickView();
    initCountdown();
    initScrollEffects();
    initScrollToTop();
    
    // Load saved state
    updateCartUI();
    updateWishlistUI();
    
    console.log('🛍️ TrendMall loaded successfully!');
});

// Navigation Functions
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerOffset = 100;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            }
        });
    });
    
    // Active navigation highlight
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Dark Mode
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    
    // Apply saved dark mode preference
    if (appState.darkMode) {
        body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        appState.darkMode = body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', appState.darkMode);
        
        // Update icon
        darkModeToggle.innerHTML = appState.darkMode 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
    });
}

// Search Functionality
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        if (query) {
            // Filter products based on search query
            filterProducts(query);
            scrollToSection('products');
        }
    }
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// Product Filters
function initProductFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            // Filter products
            productCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

function filterProducts(query) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        if (title.includes(query)) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });
}

// Shopping Cart
function initShoppingCart() {
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    const overlay = document.getElementById('overlay');
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    
    // Open cart
    cartBtn.addEventListener('click', () => {
        cartSidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close cart
    closeCart.addEventListener('click', closeCartSidebar);
    overlay.addEventListener('click', closeCartSidebar);
    
    function closeCartSidebar() {
        cartSidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Add to cart functionality
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const product = {
                id: Date.now(),
                name: productCard.querySelector('h3').textContent,
                price: productCard.querySelector('.current-price').textContent,
                image: productCard.querySelector('img').src,
                quantity: 1
            };
            
            addToCart(product);
            showNotification('상품이 장바구니에 추가되었습니다! 🛒', 'success');
        });
    });
}

function addToCart(product) {
    const existingItem = appState.cart.find(item => item.name === product.name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        appState.cart.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(appState.cart));
    updateCartUI();
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    // Update cart count
    const totalItems = appState.cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    cartItems.innerHTML = '';
    let total = 0;
    
    appState.cart.forEach(item => {
        const price = parseInt(item.price.replace(/[^\d]/g, ''));
        total += price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-controls">
                    <button onclick="updateQuantity('${item.name}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.name}', 1)">+</button>
                </div>
                <p>${item.price}</p>
            </div>
            <button onclick="removeFromCart('${item.name}')" class="remove-item">×</button>
        `;
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = `₩${total.toLocaleString()}`;
}

// Wishlist
function initWishlist() {
    const wishlistBtn = document.getElementById('wishlistBtn');
    const wishlistSidebar = document.getElementById('wishlistSidebar');
    const closeWishlist = document.getElementById('closeWishlist');
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    
    // Open wishlist
    wishlistBtn.addEventListener('click', () => {
        wishlistSidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close wishlist
    closeWishlist.addEventListener('click', () => {
        wishlistSidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Add to wishlist
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productCard = e.target.closest('.product-card');
            const product = {
                id: Date.now(),
                name: productCard.querySelector('h3').textContent,
                price: productCard.querySelector('.current-price').textContent,
                image: productCard.querySelector('img').src
            };
            
            toggleWishlist(product, btn);
        });
    });
}

function toggleWishlist(product, btn) {
    const existingIndex = appState.wishlist.findIndex(item => item.name === product.name);
    
    if (existingIndex > -1) {
        appState.wishlist.splice(existingIndex, 1);
        btn.classList.remove('active');
        showNotification('위시리스트에서 제거되었습니다', 'info');
    } else {
        appState.wishlist.push(product);
        btn.classList.add('active');
        showNotification('위시리스트에 추가되었습니다! ❤️', 'success');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(appState.wishlist));
    updateWishlistUI();
}

function updateWishlistUI() {
    const wishlistCount = document.getElementById('wishlistCount');
    wishlistCount.textContent = appState.wishlist.length;
}

// Quick View Modal
function initQuickView() {
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    const quickViewModal = document.getElementById('quickViewModal');
    const closeQuickView = document.getElementById('closeQuickView');
    
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productCard = e.target.closest('.product-card');
            showQuickView(productCard);
        });
    });
    
    closeQuickView.addEventListener('click', () => {
        quickViewModal.classList.remove('active');
        document.body.style.overflow = '';
    });
}

function showQuickView(productCard) {
    const modal = document.getElementById('quickViewModal');
    const content = document.getElementById('quickViewContent');
    
    const product = {
        name: productCard.querySelector('h3').textContent,
        price: productCard.querySelector('.current-price').textContent,
        image: productCard.querySelector('img').src,
        rating: productCard.querySelector('.rating-count').textContent
    };
    
    content.innerHTML = `
        <div class="quick-view-product">
            <img src="${product.image}" alt="${product.name}">
            <div class="quick-view-info">
                <h2>${product.name}</h2>
                <div class="product-rating">
                    <div class="stars">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    <span>${product.rating}</span>
                </div>
                <p class="quick-view-price">${product.price}</p>
                <p class="product-description">이 제품은 최신 기술과 트렌디한 디자인을 결합한 프리미엄 상품입니다.</p>
                <div class="quick-view-actions">
                    <button class="btn btn-primary">장바구니 담기</button>
                    <button class="btn btn-secondary">바로 구매</button>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Countdown Timer
function initCountdown() {
    const countdown = document.getElementById('countdown');
    if (!countdown) return;
    
    // Set target date (7 days from now)
    const targetDate = new Date().getTime() + (7 * 24 * 60 * 60 * 1000);
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        
        if (distance < 0) {
            countdown.innerHTML = '<h3>세일이 종료되었습니다!</h3>';
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Scroll Effects
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    const animateElements = document.querySelectorAll(
        '.section-header, .category-card, .product-card, .sale-banner'
    );
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Scroll to Top Button
function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Utility Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerOffset = 100;
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

function updateQuantity(productName, change) {
    const item = appState.cart.find(item => item.name === productName);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productName);
        } else {
            localStorage.setItem('cart', JSON.stringify(appState.cart));
            updateCartUI();
        }
    }
}

function removeFromCart(productName) {
    appState.cart = appState.cart.filter(item => item.name !== productName);
    localStorage.setItem('cart', JSON.stringify(appState.cart));
    updateCartUI();
    showNotification('상품이 장바구니에서 제거되었습니다', 'info');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
            </span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Category card interactions
document.addEventListener('DOMContentLoaded', () => {
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            // Filter products by category
            const filterBtn = document.querySelector(`[data-filter="${category}"]`);
            if (filterBtn) {
                filterBtn.click();
                scrollToSection('products');
            }
        });
    });
});

// Export functions for global access
window.scrollToSection = scrollToSection;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;

console.log(`
🛍️ TrendMall E-commerce 2024
━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Modern design with glassmorphism
🌙 Dark mode support
🛒 Shopping cart functionality
❤️ Wishlist feature
🔍 Product search & filtering
📱 Fully responsive
━━━━━━━━━━━━━━━━━━━━━━━━━
Made with ❤️ for modern shopping
`);

// Contact Form
function initContactForm() {
    const form = document.querySelector('.contact-form');
    const inputs = form.querySelectorAll('input, textarea');
    
    // Form validation and submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        if (!data.name || !data.email || !data.message) {
            showNotification('모든 필드를 입력해주세요.', 'error');
            return;
        }
        
        if (!isValidEmail(data.email)) {
            showNotification('올바른 이메일 주소를 입력해주세요.', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('메시지가 성공적으로 전송되었습니다! 🎉', 'success');
        form.reset();
        
        // Reset floating labels
        inputs.forEach(input => {
            input.classList.remove('has-value');
        });
    });
    
    // Floating label effect
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
            input.parentElement.classList.remove('focused');
        });
        
        input.addEventListener('input', () => {
            if (input.value) {
                input.classList.add('has-value');
            } else {
                input.classList.remove('has-value');
            }
        });
    });
}

// Scroll to Top Button
function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Typing Effect for Hero Title
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const text = heroTitle.innerHTML;
    heroTitle.innerHTML = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            heroTitle.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    };
    
    // Start typing effect after a delay
    setTimeout(typeWriter, 1000);
}

// Parallax Effect
function initParallax() {
    const parallaxElements = document.querySelectorAll('.floating-card');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach((element, index) => {
            const speed = (index + 1) * 0.2;
            element.style.transform = `translateY(${rate * speed}px)`;
        });
    });
}

// Utility Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerOffset = 80;
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
            </span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Smooth scrolling for all internal links
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
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Add entrance animations
    const elements = document.querySelectorAll('.hero-title, .hero-description, .hero-buttons');
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.style.animation = 'fadeInUp 0.8s ease forwards';
        }, index * 200);
    });
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
    // Scroll-dependent functions here
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

// Dark mode toggle (bonus feature)
function initDarkMode() {
    const darkModeToggle = document.createElement('button');
    darkModeToggle.innerHTML = '🌙';
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.style.cssText = `
        position: fixed;
        top: 50%;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: none;
        background: var(--primary-gradient);
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        z-index: 1000;
        transition: all 0.3s ease;
        transform: translateY(-50%);
    `;
    
    document.body.appendChild(darkModeToggle);
    
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        darkModeToggle.innerHTML = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });
}

// Initialize dark mode toggle
// initDarkMode();

// Console welcome message
console.log(`
🎨 Portfolio Website 2024
━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Modern design with smooth animations
🚀 Optimized performance
📱 Fully responsive
🎯 Interactive elements
━━━━━━━━━━━━━━━━━━━━━━━━━
Made with ❤️ by Creative Developer
`);

// Export functions for global access
window.scrollToSection = scrollToSection;
