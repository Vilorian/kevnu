/**
 * Dashboard JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    initProgressTracking();
    initCoursePlayer();
});

/**
 * Initialize progress tracking
 */
function initProgressTracking() {
    const progressButtons = document.querySelectorAll('[data-mark-complete]');
    
    progressButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const contentId = this.dataset.markComplete;
            await markContentComplete(contentId);
        });
    });
}

/**
 * Mark content as complete
 */
async function markContentComplete(contentId) {
    try {
        const response = await fetch('/php/api/progress.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content_id: contentId })
        });

        const data = await response.json();

        if (data.success) {
            // Update UI
            const button = document.querySelector(`[data-mark-complete="${contentId}"]`);
            if (button) {
                button.textContent = 'Completed';
                button.disabled = true;
                button.classList.add('btn--success');
            }

            // Update progress bar
            if (data.progress_percentage !== undefined) {
                updateProgressBar(data.progress_percentage);
            }

            showNotification('Progress updated!', 'success');
        } else {
            showNotification(data.message || 'Error updating progress', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error updating progress', 'error');
    }
}

/**
 * Update progress bar
 */
function updateProgressBar(percentage) {
    const progressBars = document.querySelectorAll('.progress-bar__fill');
    progressBars.forEach(bar => {
        bar.style.width = percentage + '%';
    });

    const progressText = document.querySelectorAll('.progress-percentage');
    progressText.forEach(text => {
        text.textContent = Math.round(percentage) + '%';
    });
}

/**
 * Initialize course player
 */
function initCoursePlayer() {
    const videoPlayers = document.querySelectorAll('video');
    
    videoPlayers.forEach(player => {
        // Track video progress
        player.addEventListener('timeupdate', throttle(function() {
            const progress = (this.currentTime / this.duration) * 100;
            const contentId = this.dataset.contentId;
            
            if (contentId && progress > 80) {
                // Auto-mark as complete when 80% watched
                markContentComplete(contentId);
            }
        }, 5000)); // Throttle to every 5 seconds
    });
}

/**
 * Throttle function
 */
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

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

