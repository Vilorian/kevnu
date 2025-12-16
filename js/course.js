/**
 * Course-specific JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    initCourseFilters();
    initCourseSearch();
    initEnrollment();
});

/**
 * Initialize course filters
 */
function initCourseFilters() {
    const filterForm = document.getElementById('courseFilters');
    if (!filterForm) return;

    const filterInputs = filterForm.querySelectorAll('input, select');
    
    filterInputs.forEach(input => {
        input.addEventListener('change', debounce(function() {
            applyFilters();
        }, 300));
    });
}

/**
 * Apply course filters
 */
function applyFilters() {
    const form = document.getElementById('courseFilters');
    if (!form) return;

    const formData = new FormData(form);
    const params = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
        if (value) {
            params.append(key, value);
        }
    }

    // Update URL without reload
    const newUrl = window.location.pathname + '?' + params.toString();
    window.history.pushState({}, '', newUrl);

    // Fetch filtered courses
    fetchCourses(params);
}

/**
 * Fetch courses with filters
 */
async function fetchCourses(params) {
    try {
        const response = await fetch(`/php/api/courses.php?${params.toString()}`);
        const data = await response.json();
        
        if (data.success) {
            renderCourses(data.courses);
        } else {
            showNotification('Error loading courses', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error loading courses', 'error');
    }
}

/**
 * Render courses
 */
function renderCourses(courses) {
    const container = document.getElementById('coursesContainer');
    if (!container) return;

    if (courses.length === 0) {
        container.innerHTML = '<p class="text-center">No courses found.</p>';
        return;
    }

    container.innerHTML = courses.map(course => `
        <div class="course-card fade-in">
            <img src="${course.thumbnail || '/assets/images/placeholder.jpg'}" alt="${course.title}" class="course-card__image">
            <div class="course-card__content">
                <span class="course-card__category">${course.category}</span>
                <h3 class="course-card__title">${course.title}</h3>
                <p class="course-card__description">${course.short_description || course.description.substring(0, 120)}...</p>
                <div class="course-card__meta">
                    <span class="course-card__instructor">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        ${course.instructor_name}
                    </span>
                    ${course.rating > 0 ? `
                        <span class="course-card__rating">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            ${course.rating.toFixed(1)}
                        </span>
                    ` : ''}
                </div>
                <div class="course-card__footer">
                    <span class="course-card__price">${formatCurrency(course.price)}</span>
                    <a href="/course-detail.php?slug=${course.slug}" class="btn btn--primary btn--small">View Course</a>
                </div>
            </div>
        </div>
    `).join('');

    // Re-initialize scroll animations
    if (typeof initScrollAnimations === 'function') {
        initScrollAnimations();
    }
}

/**
 * Initialize course search
 */
function initCourseSearch() {
    const searchInput = document.getElementById('courseSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', debounce(function() {
        const query = this.value.trim();
        searchCourses(query);
    }, 500));
}

/**
 * Search courses
 */
async function searchCourses(query) {
    const params = new URLSearchParams();
    if (query) {
        params.append('search', query);
    }

    await fetchCourses(params);
}

/**
 * Initialize enrollment
 */
function initEnrollment() {
    const enrollButtons = document.querySelectorAll('[data-enroll]');
    
    enrollButtons.forEach(button => {
        button.addEventListener('click', async function(e) {
            e.preventDefault();
            const courseId = this.dataset.enroll;
            await enrollInCourse(courseId);
        });
    });
}

/**
 * Enroll in course
 */
async function enrollInCourse(courseId) {
    try {
        const response = await fetch('/php/api/enroll.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ course_id: courseId })
        });

        const data = await response.json();

        if (data.success) {
            showNotification('Successfully enrolled in course!', 'success');
            setTimeout(() => {
                window.location.href = '/dashboard.php';
            }, 1500);
        } else {
            if (data.redirect) {
                window.location.href = data.redirect;
            } else {
                showNotification(data.message || 'Error enrolling in course', 'error');
            }
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error enrolling in course', 'error');
    }
}

/**
 * Debounce function
 */
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

