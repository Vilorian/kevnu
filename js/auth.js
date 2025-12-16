/**
 * Authentication Management
 */

class AuthManager {
    constructor() {
        this.user = null;
        this.init();
    }

    async init() {
        // Check if user is logged in
        const authData = Session.get('auth');
        if (authData) {
            this.user = authData;
            this.updateUI();
        } else {
            await this.checkAuth();
        }
    }

    async checkAuth() {
        const result = await API.checkAuth();
        if (result.loggedIn && result.user) {
            this.user = result.user;
            Session.set('auth', result.user);
            this.updateUI();
            return true;
        }
        return false;
    }

    async login(email, password) {
        const result = await API.login(email, password);
        if (result.success) {
            this.user = result.user;
            Session.set('auth', result.user);
            this.updateUI();
            return true;
        }
        return result.message || 'Login failed';
    }

    async register(name, email, password) {
        const result = await API.register(name, email, password);
        if (result.success) {
            this.user = result.user;
            Session.set('auth', result.user);
            this.updateUI();
            return true;
        }
        return result.message || 'Registration failed';
    }

    logout() {
        this.user = null;
        Session.clear();
        API.logout();
    }

    isLoggedIn() {
        return this.user !== null;
    }

    getUser() {
        return this.user;
    }

    updateUI() {
        const navActions = document.querySelector('.navbar__actions');
        if (!navActions) return;

        if (this.isLoggedIn()) {
            const user = this.getUser();
            navActions.innerHTML = `
                <a href="/dashboard" class="btn btn--secondary btn--small">
                    <span class="navbar__user-avatar">${user.name.charAt(0).toUpperCase()}</span>
                    Dashboard
                </a>
                <button class="btn btn--outline btn--small" onclick="authManager.logout()">Logout</button>
            `;
        } else {
            navActions.innerHTML = `
                <a href="/login" class="btn btn--outline btn--small">Login</a>
                <a href="/register" class="btn btn--primary btn--small">Sign Up</a>
            `;
        }
    }
}

// Global auth manager instance
const authManager = new AuthManager();

