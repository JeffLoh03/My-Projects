document.addEventListener('DOMContentLoaded', function() {
    // Mood Selection
    const moodButtons = document.querySelectorAll('.mood-btn');
    const moodMessage = document.createElement('p');
    moodMessage.className = 'mood-message';
    document.querySelector('.mood-selector').appendChild(moodMessage);

    const moodMessages = {
        happy: "Great! Keep smiling 😊",
        calm: "Stay relaxed and enjoy the moment! ✨",
        tired: "Make sure to rest well! 😴",
        anxious: "Take a deep breath, you're doing great! 🧘"
    };

    function updateMoodUI(selectedMood) {
        moodButtons.forEach(btn => btn.classList.remove('active'));
        const selectedButton = document.querySelector(`[data-mood="${selectedMood}"]`);
        if (selectedButton) {
            selectedButton.classList.add('active');
            moodMessage.textContent = moodMessages[selectedMood] || '';
            moodMessage.style.opacity = 1; // Show message smoothly
        }
    }

    moodButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedMood = this.dataset.mood;
            localStorage.setItem('currentMood', selectedMood);
            updateMoodUI(selectedMood);
            showNotification(`Mood updated to ${selectedMood}! 😊`);
        });
    });

    // Load last selected mood
    const lastMood = localStorage.getItem('currentMood');
    if (lastMood) {
        updateMoodUI(lastMood);
    }

    // Quick Actions
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.querySelector('span').textContent;
            showNotification(`Opening ${action}... ✨`);
        });
    });

    // Notification function
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
});
