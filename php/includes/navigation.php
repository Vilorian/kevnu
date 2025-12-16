<?php
require_once __DIR__ . '/../config/config.php';
$isLoggedIn = isLoggedIn();
$currentUser = null;
if ($isLoggedIn) {
    require_once __DIR__ . '/../config/database.php';
    require_once __DIR__ . '/../classes/User.php';
    $database = new Database();
    $db = $database->getConnection();
    $user = new User($db);
    $user->getById(getCurrentUserId());
    $currentUser = $user;
}
?>

<nav class="navbar" id="navbar">
    <div class="container">
        <div class="navbar__content">
            <a href="/" class="navbar__logo">
                <span class="navbar__logo-icon">✓</span>
                <span class="navbar__logo-text">Kevin Courses</span>
            </a>
            
            <button class="navbar__toggle" id="navToggle" aria-label="Toggle navigation">
                <span></span>
                <span></span>
                <span></span>
            </button>

            <ul class="navbar__menu" id="navMenu">
                <li><a href="/" class="navbar__link <?php echo basename($_SERVER['PHP_SELF']) == 'index.php' ? 'active' : ''; ?>">Home</a></li>
                <li><a href="/courses.php" class="navbar__link <?php echo basename($_SERVER['PHP_SELF']) == 'courses.php' ? 'active' : ''; ?>">Courses</a></li>
                <li><a href="/commission.php" class="navbar__link <?php echo basename($_SERVER['PHP_SELF']) == 'commission.php' ? 'active' : ''; ?>">Commission</a></li>
                <li><a href="/blog.php" class="navbar__link <?php echo basename($_SERVER['PHP_SELF']) == 'blog.php' ? 'active' : ''; ?>">Blog</a></li>
                <li><a href="/about.php" class="navbar__link <?php echo basename($_SERVER['PHP_SELF']) == 'about.php' ? 'active' : ''; ?>">About</a></li>
                <li><a href="/contact.php" class="navbar__link <?php echo basename($_SERVER['PHP_SELF']) == 'contact.php' ? 'active' : ''; ?>">Contact</a></li>
            </ul>

            <div class="navbar__actions">
                <?php if ($isLoggedIn): ?>
                    <a href="/dashboard.php" class="btn btn--secondary btn--small">
                        <span class="navbar__user-avatar">
                            <?php echo strtoupper(substr($currentUser->name, 0, 1)); ?>
                        </span>
                        Dashboard
                    </a>
                    <a href="/php/api/auth.php?action=logout" class="btn btn--outline btn--small">Logout</a>
                <?php else: ?>
                    <a href="/login.php" class="btn btn--outline btn--small">Login</a>
                    <a href="/register.php" class="btn btn--primary btn--small">Sign Up</a>
                <?php endif; ?>
            </div>
        </div>
    </div>
</nav>

