document.addEventListener('DOMContentLoaded', () => {
    const profileOverview = document.querySelector('.profile-overview');
    const editProfileBtn = document.querySelector('.btn-edit-profile');
    const saveButton = document.querySelector('.btn-consultation');
    const cancelButton = document.querySelector('.btn-secondary');
    const formInputs = document.querySelectorAll('input');
    const editAvatarBtn = document.querySelector('.edit-avatar-btn');
    const headerName = document.querySelector('.profile-info-header h2');
    
    // Store original form data for cancel functionality
    let originalFormData = {};

    // Sync names initially
    const nameInput = document.querySelector('input[placeholder="Enter your full name"]');
    headerName.textContent = nameInput.value;

    // Handle name input changes
    nameInput.addEventListener('input', (e) => {
        headerName.textContent = e.target.value;
    });

    // Handle edit mode toggle
    editProfileBtn.addEventListener('click', () => {
        profileOverview.classList.add('profile-edit-mode');
        editProfileBtn.style.display = 'none';
        
        // Store current form values
        storeFormData();
        
        // Enable form fields
        formInputs.forEach(input => {
            if (input.type === 'checkbox') {
                input.disabled = false;
            } else {
                input.readOnly = false;
            }
        });
    });

    // Store current form values
    function storeFormData() {
        originalFormData = {
            name: nameInput.value,
            email: document.querySelector('input[placeholder="Enter your email"]').value,
            phone: document.querySelector('input[placeholder="Enter your phone number"]').value,
            preferences: {
                emailNotifications: document.querySelector('.preference-item:nth-child(1) input').checked,
                dailyReminders: document.querySelector('.preference-item:nth-child(2) input').checked,
                darkMode: document.querySelector('.preference-item:nth-child(3) input').checked
            },
            avatar: document.getElementById('profile-image').src
        };
    }

    // Restore original form data
    function restoreFormData() {
        nameInput.value = originalFormData.name;
        headerName.textContent = originalFormData.name;
        document.querySelector('input[placeholder="Enter your email"]').value = originalFormData.email;
        document.querySelector('input[placeholder="Enter your phone number"]').value = originalFormData.phone;
        document.querySelector('.preference-item:nth-child(1) input').checked = originalFormData.preferences.emailNotifications;
        document.querySelector('.preference-item:nth-child(2) input').checked = originalFormData.preferences.dailyReminders;
        document.querySelector('.preference-item:nth-child(3) input').checked = originalFormData.preferences.darkMode;
        document.getElementById('profile-image').src = originalFormData.avatar;
    }

    // Exit edit mode
    function exitEditMode() {
        profileOverview.classList.remove('profile-edit-mode');
        editProfileBtn.style.display = 'flex';
        
        // Disable form fields
        formInputs.forEach(input => {
            if (input.type === 'checkbox') {
                input.disabled = true;
            } else {
                input.readOnly = true;
            }
        });
    }

    // Handle profile image upload
    editAvatarBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.getElementById('profile-image').src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        };
        
        input.click();
    });

    // Handle form submission
    saveButton.addEventListener('click', () => {
        // Collect form data
        const formData = {
            name: nameInput.value,
            email: document.querySelector('input[placeholder="Enter your email"]').value,
            phone: document.querySelector('input[placeholder="Enter your phone number"]').value,
            preferences: {
                emailNotifications: document.querySelector('.preference-item:nth-child(1) input').checked,
                dailyReminders: document.querySelector('.preference-item:nth-child(2) input').checked,
                darkMode: document.querySelector('.preference-item:nth-child(3) input').checked
            }
        };

        // Here you would typically send this data to your backend
        console.log('Saving profile data:', formData);
        
        // Show success message
        showNotification('Profile updated successfully!', 'success');
        
        // Exit edit mode
        exitEditMode();
    });

    // Handle cancel button
    cancelButton.addEventListener('click', () => {
        restoreFormData();
        exitEditMode();
    });

    // Notification system
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Dark mode toggle
    const darkModeToggle = document.querySelector('.preference-item:nth-child(3) input');
    darkModeToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    });

    // Load user stats (simulated)
    function loadUserStats() {
        const stats = {
            diaryEntries: 28,
            achievements: 5,
            tasksCompleted: 15
        };

        document.querySelectorAll('.stat-number').forEach((stat, index) => {
            const value = Object.values(stats)[index];
            animateNumber(stat, 0, value, 1000);
        });
    }

    // Number animation helper
    function animateNumber(element, start, end, duration) {
        let current = start;
        const range = end - start;
        const increment = range / (duration / 16);
        const handle = setInterval(() => {
            current += increment;
            element.textContent = Math.round(current);
            if (current >= end) {
                element.textContent = end;
                clearInterval(handle);
            }
        }, 16);
    }

    // Initialize stats
    loadUserStats();
}); 