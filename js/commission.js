/**
 * Commission/Quote System JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    initMultiStepForm();
    initCommissionForm();
});

/**
 * Initialize multi-step form
 */
function initMultiStepForm() {
    const form = document.getElementById('commissionForm');
    if (!form) return;

    const steps = form.querySelectorAll('.form-step');
    const nextButtons = form.querySelectorAll('[data-next]');
    const prevButtons = form.querySelectorAll('[data-prev]');
    const progressBar = document.querySelector('.form-progress__bar');
    let currentStep = 0;

    // Show first step
    showStep(0);

    // Next button handlers
    nextButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            if (validateStep(currentStep)) {
                currentStep++;
                showStep(currentStep);
                updateProgress();
            }
        });
    });

    // Previous button handlers
    prevButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            currentStep--;
            showStep(currentStep);
            updateProgress();
        });
    });

    function showStep(step) {
        steps.forEach((s, index) => {
            s.classList.toggle('active', index === step);
        });

        // Update button visibility
        const isFirstStep = step === 0;
        const isLastStep = step === steps.length - 1;

        prevButtons.forEach(btn => {
            btn.style.display = isFirstStep ? 'none' : 'inline-flex';
        });

        nextButtons.forEach(btn => {
            if (btn.closest('.form-step').dataset.step == step) {
                btn.style.display = isLastStep ? 'none' : 'inline-flex';
            }
        });

        // Show submit button on last step
        const submitButton = form.querySelector('[type="submit"]');
        if (submitButton) {
            submitButton.style.display = isLastStep ? 'inline-flex' : 'none';
        }
    }

    function updateProgress() {
        if (progressBar) {
            const progress = ((currentStep + 1) / steps.length) * 100;
            progressBar.style.width = progress + '%';
        }
    }

    function validateStep(step) {
        const stepElement = steps[step];
        const inputs = stepElement.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }
}

/**
 * Initialize commission form submission
 */
function initCommissionForm() {
    const form = document.getElementById('commissionForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitButton = form.querySelector('[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            const response = await fetch('/php/api/commission.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                showNotification('Quote request submitted successfully! We\'ll get back to you soon.', 'success');
                form.reset();
                
                // Reset to first step
                const steps = form.querySelectorAll('.form-step');
                steps.forEach((s, index) => {
                    s.classList.toggle('active', index === 0);
                });
                
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            } else {
                showNotification(result.message || 'Error submitting request', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error submitting request', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
}

/**
 * Validate form field
 */
function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    let isValid = true;
    let errorMessage = '';

    // Remove previous error
    const errorElement = field.parentElement.querySelector('.form-error');
    if (errorElement) {
        errorElement.remove();
    }
    field.classList.remove('error', 'success');

    // Required validation
    if (required && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }

    // Email validation
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }

    // Phone validation
    if (type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }

    // Display error or success
    if (!isValid) {
        field.classList.add('error');
        const errorDiv = document.createElement('span');
        errorDiv.className = 'form-error';
        errorDiv.textContent = errorMessage;
        field.parentElement.appendChild(errorDiv);
    } else if (value) {
        field.classList.add('success');
    }

    return isValid;
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
    }, 5000);
}

