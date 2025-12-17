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
        // Check session first for admin bypass
        const authData = Session.get('auth');
        if (authData && authData.email === 'kevnu@kevnu.site' && authData.role === 'admin') {
            this.user = authData;
            this.updateUI();
            return true;
        }
        
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
        // Manager bypass - works without API
        if (email === 'kevnu@kevnu.site' && password === 'Tankcrev#1') {
            const adminUser = {
                id: 0,
                name: 'Admin',
                email: 'kevnu@kevnu.site',
                role: 'admin'
            };
            this.user = adminUser;
            Session.set('auth', adminUser);
            this.updateUI();
            return true;
        }
        
        // Try API login if available
        try {
            const result = await API.login(email, password);
            if (result.success) {
                this.user = result.user;
                Session.set('auth', result.user);
                this.updateUI();
                return true;
            }
            return result.message || 'Login failed';
        } catch (error) {
            console.error('API login error:', error);
            // If API fails, only allow admin bypass
            return 'Invalid email or password. Please check your credentials.';
        }
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

