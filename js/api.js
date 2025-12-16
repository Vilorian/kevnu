/**
 * API Client - Handles all backend communication
 */

const API_BASE = '/php/api';

class API {
    static async request(endpoint, options = {}) {
        const url = `${API_BASE}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        }
    }

    // Auth
    static async login(email, password) {
        return this.request('/auth.php?action=login', {
            method: 'POST',
            body: { email, password }
        });
    }

    static async register(name, email, password) {
        return this.request('/auth.php?action=register', {
            method: 'POST',
            body: { name, email, password }
        });
    }

    static logout() {
        window.location.href = '/php/api/auth.php?action=logout';
    }

    // Courses
    static async getCourses(filters = {}) {
        const params = new URLSearchParams(filters).toString();
        return this.request(`/courses.php?${params}`);
    }

    static async getCourse(slug) {
        return this.request(`/courses.php?slug=${slug}`);
    }

    // Enrollment
    static async enroll(courseId) {
        return this.request('/enroll.php', {
            method: 'POST',
            body: { course_id: courseId }
        });
    }

    // Progress
    static async updateProgress(contentId) {
        return this.request('/progress.php', {
            method: 'POST',
            body: { content_id: contentId }
        });
    }

    // Commission
    static async submitCommission(data) {
        return this.request('/commission.php', {
            method: 'POST',
            body: data
        });
    }

    // Check auth status
    static async checkAuth() {
        try {
            const response = await fetch('/php/api/auth.php?action=check');
            return await response.json();
        } catch (error) {
            return { loggedIn: false };
        }
    }
}

// Session management
class Session {
    static get(key) {
        try {
            return JSON.parse(sessionStorage.getItem(key));
        } catch {
            return null;
        }
    }

    static set(key, value) {
        sessionStorage.setItem(key, JSON.stringify(value));
    }

    static remove(key) {
        sessionStorage.removeItem(key);
    }

    static clear() {
        sessionStorage.clear();
    }
}

