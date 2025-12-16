/**
 * Kevin Courses - Main JavaScript
 * Interactions, Animations, and Dynamic Content
 */

// ============================================
// Navigation
// ============================================
const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
        let lastScroll = 0;
window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
    if (currentScroll > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
});

// Mobile menu toggle
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking a link
    navLinks.forEach(link => {
    link.addEventListener('click', () => {
                navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        });
    });

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');

function updateActiveNavLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
                e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Intersection Observer for Animations
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards and sections
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.course-card, .feature-card, .testimonial-card, .service-card'
    );
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
        observer.observe(el);
        });
    });

// ============================================
// Load Featured Courses
// ============================================
async function loadFeaturedCourses() {
    const coursesGrid = document.getElementById('coursesGrid');
    
    if (!coursesGrid) return;
    
    try {
        // Check if API is available
        if (typeof API !== 'undefined' && API.getCourses) {
            const result = await API.getCourses({ featured: true, limit: 6 });
            
            if (result.success && result.courses && result.courses.length > 0) {
                renderCourses(result.courses);
            } else {
                renderPlaceholderCourses();
            }
        } else {
            // Fallback: Render placeholder courses
            renderPlaceholderCourses();
        }
    } catch (error) {
        console.error('Error loading courses:', error);
        renderPlaceholderCourses();
    }
}

function renderCourses(courses) {
    const coursesGrid = document.getElementById('coursesGrid');
    
    coursesGrid.innerHTML = courses.map((course, index) => {
        const labels = getCourseLabels(course);
        const completion = course.completion_percentage || 0;
        
        return `
        <div class="course-card fade-in" style="animation-delay: ${index * 0.1}s">
            <div class="course-image" style="background: linear-gradient(135deg, #86EFAC 0%, #4ADE80 100%);">
                ${course.thumbnail ? `<img src="${course.thumbnail}" alt="${course.title}" style="width: 100%; height: 100%; object-fit: cover;">` : ''}
                ${labels.length > 0 ? `<div class="course-labels">${labels.map(label => `<span class="course-label course-label-${label.type}">${label.text}</span>`).join('')}</div>` : ''}
                ${completion > 0 ? `<div class="course-completion">
                    <div class="completion-bar">
                        <div class="completion-fill" style="width: ${completion}%"></div>
                    </div>
                    <span class="completion-text">${completion}% Complete</span>
                </div>` : ''}
            </div>
            <div class="course-content">
                <span class="course-category">${formatCategory(course.category)}</span>
                <h3 class="course-title">${course.title}</h3>
                <p class="course-description">${course.short_description || truncateText(course.description, 120)}</p>
                <div class="course-footer">
                    <span class="course-price">${parseFloat(course.price || 0) === 0 ? 'Free' : '$' + parseFloat(course.price || 0).toFixed(2)}</span>
                    <a href="course-detail.html?slug=${course.slug || '#'}" class="btn btn-primary btn--small">View Course</a>
                </div>
            </div>
        </div>
        `;
    }).join('');
    
    // Re-observe new cards
    const newCards = coursesGrid.querySelectorAll('.course-card');
    newCards.forEach(card => observer.observe(card));
}

function getCourseLabels(course) {
    const labels = [];
    
    if (course.is_new || course.created_at && isNewCourse(course.created_at)) {
        labels.push({ type: 'new', text: 'New' });
    }
    if (course.is_popular || course.enrollment_count > 100) {
        labels.push({ type: 'popular', text: 'Popular' });
    }
    if (course.is_featured) {
        labels.push({ type: 'featured', text: 'Featured' });
    }
    if (course.discount_percentage && course.discount_percentage > 0) {
        labels.push({ type: 'sale', text: `${course.discount_percentage}% Off` });
    }
    
    return labels;
}

function isNewCourse(createdAt) {
    const daysSinceCreation = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceCreation < 30;
}

function renderPlaceholderCourses() {
    const coursesGrid = document.getElementById('coursesGrid');
    
    const placeholderCourses = [
        {
            title: 'Web Development Bootcamp Part 1',
            category: 'web-development',
            description: 'Master HTML and CSS fundamentals. Learn to build beautiful, responsive websites from scratch. Perfect for beginners starting their web development journey.',
            price: 0.00
        },
        {
            title: 'Javascript fundamentals, Website Development Bootcamp Part 2',
            category: 'web-development',
            description: 'Learn JavaScript from the ground up. Master variables, functions, DOM manipulation, and modern ES6+ features. Build interactive web applications.',
            price: 20.00
        },
        {
            title: 'React/TypeScript, Website Development Bootcamp Part 3',
            category: 'web-development',
            description: 'Master React and TypeScript to build modern, type-safe web applications. Learn component architecture, hooks, state management, and advanced TypeScript patterns.',
            price: 80.00
        },
        {
            title: 'PHP, Website Development Bootcamp Part 4',
            category: 'backend',
            description: 'Learn PHP server-side programming. Master PHP syntax, functions, object-oriented programming, and build dynamic web applications with PHP.',
            price: 100.00
        },
        {
            title: 'SQL and Databases, Website Development Bootcamp Part 5',
            category: 'backend',
            description: 'Master SQL and database management. Learn to design databases, write complex queries, optimize performance, and work with MySQL, PostgreSQL, and more.',
            price: 50.00
        },
        {
            title: 'APIs, Website Development Bootcamp Part 6',
            category: 'backend',
            description: 'Learn to build and consume RESTful APIs, GraphQL, authentication, rate limiting, and API best practices. Master API design and integration patterns.',
            price: 300.00
        },
        {
            title: 'WEBGL, Website Development Bootcamp Part 7',
            category: 'web-development',
            description: 'Master WebGL to create stunning 3D graphics and interactive visualizations in the browser. Learn shaders, 3D rendering, and advanced graphics programming.',
            price: 200.00
        },
        {
            title: 'UI/UX Design Series 1',
            category: 'ui-ux-design',
            description: 'Learn the fundamentals of UI/UX design. Master design principles, user research, wireframing, and create beautiful user interfaces.',
            price: 0.00
        },
        {
            title: 'UI/UX Design Series 2',
            category: 'ui-ux-design',
            description: 'Advanced UI/UX design techniques. Learn prototyping, user testing, design systems, and create professional design workflows.',
            price: 40.00
        },
        {
            title: 'UI/UX Design Series 3',
            category: 'ui-ux-design',
            description: 'Master Figma and Framer for advanced design work. Learn to create interactive prototypes, design systems, and collaborate effectively with development teams.',
            price: 200.00
        },
        {
            title: 'Typography Series',
            category: 'ui-ux-design',
            description: 'Master the art of typography. Learn font selection, hierarchy, spacing, pairing, and how to create beautiful, readable text designs.',
            price: 20.00
        },
        {
            title: 'Animations Series 1',
            category: 'web-development',
            description: 'Learn to create stunning animations and transitions. Master CSS animations, JavaScript animations, and bring your designs to life with motion.',
            price: 199.00
        }
    ];
    
    coursesGrid.innerHTML = placeholderCourses.map((course, index) => {
        const labels = [];
        labels.push({ type: 'new', text: 'New' });
        
        const completion = 0;
        
        return `
        <div class="course-card fade-in" style="animation-delay: ${index * 0.1}s">
            <div class="course-image" style="background: linear-gradient(135deg, #86EFAC 0%, #4ADE80 100%);">
                ${labels.length > 0 ? `<div class="course-labels">${labels.map(label => `<span class="course-label course-label-${label.type}">${label.text}</span>`).join('')}</div>` : ''}
                ${completion > 0 ? `<div class="course-completion">
                    <div class="completion-bar">
                        <div class="completion-fill" style="width: ${completion}%"></div>
                    </div>
                    <span class="completion-text">${completion}% Complete</span>
                </div>` : ''}
            </div>
            <div class="course-content">
                <span class="course-category">${formatCategory(course.category)}</span>
                <h3 class="course-title">${course.title}</h3>
                <p class="course-description">${course.description}</p>
                <div class="course-footer">
                    <span class="course-price">${course.price === 0 ? 'Free' : '$' + course.price.toFixed(2)}</span>
                    <a href="courses.html" class="btn btn-primary btn--small">View Course</a>
                </div>
            </div>
        </div>
        `;
    }).join('');
    
    // Re-observe new cards
    const newCards = coursesGrid.querySelectorAll('.course-card');
    newCards.forEach(card => observer.observe(card));
}

function formatCategory(category) {
    if (!category) return 'Course';
    return category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function truncateText(text, maxLength) {
    if (!text) return 'Learn essential skills and build real-world projects.';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// ============================================
// Parallax Effects
// ============================================
function initParallax() {
    const heroShapes = document.querySelectorAll('.shape');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        heroShapes.forEach((shape, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            shape.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// ============================================
// Button Hover Effects
// ============================================
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ============================================
// Card Hover Effects
// ============================================
document.querySelectorAll('.course-card, .feature-card, .testimonial-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// ============================================
// Set Current Year
// ============================================
const currentYearElement = document.getElementById('currentYear');
if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
}

// ============================================
// Initialize on DOM Load
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedCourses();
    initParallax();
    
    // Add fade-in animation to hero elements
    const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-actions, .hero-stats');
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Animate stats numbers
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const target = parseInt(stat.textContent.replace(/\D/g, ''));
        if (target) {
            animateNumber(stat, 0, target, 2000);
        }
    });
});

// ============================================
// Number Animation
// ============================================
function animateNumber(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            element.textContent = formatStatNumber(end);
            clearInterval(timer);
        } else {
            element.textContent = formatStatNumber(Math.floor(current));
        }
    }, 16);
}

function formatStatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K+';
    }
    return num + (num === 98 ? '%' : '+');
}

// ============================================
// Scroll to Top (Optional)
// ============================================
let scrollToTopBtn = null;

function createScrollToTopButton() {
    scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 15l-6-6-6 6"/>
        </svg>
    `;
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        box-shadow: 0 10px 30px -5px rgba(34, 197, 94, 0.3);
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    scrollToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-4px)';
        this.style.boxShadow = '0 20px 40px -10px rgba(34, 197, 94, 0.4)';
    });
    
    scrollToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 10px 30px -5px rgba(34, 197, 94, 0.3)';
    });
    
    document.body.appendChild(scrollToTopBtn);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'flex';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });
}

// Initialize scroll to top button
createScrollToTopButton();

// ============================================
// Performance Optimization
// ============================================
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
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
    };
}

// Optimize scroll listeners
const optimizedScrollHandler = throttle(() => {
    updateActiveNavLink();
}, 100);

window.addEventListener('scroll', optimizedScrollHandler);

// ============================================
// Error Handling
// ============================================
window.addEventListener('error', (event) => {
    console.error('Error:', event.error);
});

// ============================================
// Export for use in other scripts
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadFeaturedCourses,
        renderCourses,
        formatCategory,
        truncateText
    };
}
