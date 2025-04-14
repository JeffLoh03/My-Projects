document.addEventListener('DOMContentLoaded', () => {
    const deliveryDateInput = document.getElementById('delivery-date');
    const messageSubject = document.getElementById('message-subject');
    const messageContent = document.getElementById('message-content');
    const sendButton = document.getElementById('send-message');
    const pendingMessagesList = document.getElementById('pending-messages-list');

    // Cute emojis for different message types
    const messageEmojis = ['💌', '💝', '🎀', '✨', '🌟', '🌈', '💫', '🦋', '🌸', '🌺'];

    // Set minimum date to 1 month from now and maximum to 12 months
    const today = new Date();
    const minDate = new Date(today.setMonth(today.getMonth() + 1));
    const maxDate = new Date(today.setMonth(today.getMonth() + 11));
    
    deliveryDateInput.min = minDate.toISOString().split('T')[0];
    deliveryDateInput.max = maxDate.toISOString().split('T')[0];

    // Load existing messages from localStorage
    let futureMessages = JSON.parse(localStorage.getItem('futureMessages')) || [];

    // Add floating hearts animation
    function createFloatingHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = '💝';
        heart.style.left = Math.random() * 100 + 'vw';
        document.body.appendChild(heart);
        
        setTimeout(() => heart.remove(), 3000);
    }

    // Handle form submission
    sendButton.addEventListener('click', (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Create floating hearts animation
        for (let i = 0; i < 5; i++) {
            setTimeout(createFloatingHeart, i * 300);
        }

        const newMessage = {
            id: Date.now(),
            subject: messageSubject.value,
            content: messageContent.value,
            deliveryDate: deliveryDateInput.value,
            status: 'pending',
            createdAt: new Date().toISOString(),
            emoji: messageEmojis[Math.floor(Math.random() * messageEmojis.length)]
        };

        // Add new message
        futureMessages.push(newMessage);
        
        // Save to localStorage
        localStorage.setItem('futureMessages', JSON.stringify(futureMessages));

        // Show success message
        showNotification('Message sent with lots of love! 💝', 'success');

        // Reset form
        resetForm();

        // Refresh messages display
        displayPendingMessages();
    });

    function validateForm() {
        if (!deliveryDateInput.value) {
            showNotification('Please pick a special date for your message 📅', 'error');
            return false;
        }

        if (!messageSubject.value.trim()) {
            showNotification('Add a lovely title for your message 🎀', 'error');
            return false;
        }

        if (!messageContent.value.trim()) {
            showNotification('Share your thoughts with your future self 💭', 'error');
            return false;
        }

        return true;
    }

    function resetForm() {
        messageSubject.value = '';
        messageContent.value = '';
        deliveryDateInput.value = '';
    }

    function displayPendingMessages() {
        pendingMessagesList.innerHTML = '';
        
        const sortedMessages = futureMessages
            .sort((a, b) => new Date(a.deliveryDate) - new Date(b.deliveryDate));

        sortedMessages.forEach(message => {
            const deliveryDate = new Date(message.deliveryDate);
            const formattedDate = deliveryDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const messageCard = document.createElement('div');
            messageCard.className = 'message-card';
            messageCard.innerHTML = `
                <div class="message-emoji">${message.emoji || '💌'}</div>
                <div class="message-date">
                    <i class="fas fa-calendar"></i> ${formattedDate}
                </div>
                <div class="message-subject">${message.subject}</div>
                <div class="message-preview">
                    ${message.content.substring(0, 100)}${message.content.length > 100 ? '...' : ''}
                </div>
                <div class="message-status">
                    <i class="fas fa-clock"></i>
                    <span>Waiting to share its magic ✨</span>
                </div>
            `;

            pendingMessagesList.appendChild(messageCard);
        });

        if (sortedMessages.length === 0) {
            pendingMessagesList.innerHTML = `
                <div style="text-align: center; color: var(--text-color); opacity: 0.7;">
                    <div class="empty-state-emoji">🌟</div>
                    <p>Your time capsule is waiting for its first message! ✨</p>
                    <p>Send some love to your future self 💝</p>
                </div>
            `;
        }
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-heart' : 'fa-heart-crack'}"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Check for messages that need to be delivered
    function checkForDelivery() {
        const today = new Date().toISOString().split('T')[0];
        const deliveredMessages = futureMessages.filter(message => 
            message.deliveryDate <= today && message.status === 'pending'
        );

        if (deliveredMessages.length > 0) {
            deliveredMessages.forEach(message => {
                message.status = 'delivered';
                showDeliveryNotification(message);
            });

            // Update localStorage
            localStorage.setItem('futureMessages', JSON.stringify(futureMessages));
            
            // Refresh display
            displayPendingMessages();
        }
    }

    function showDeliveryNotification(message) {
        const modal = document.createElement('div');
        modal.className = 'modal delivery-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="message-received-animation">✨</div>
                <h2>A Special Delivery from Your Past Self 💌</h2>
                <div class="message-date">Written on ${new Date(message.createdAt).toLocaleDateString()} with love</div>
                <h3>${message.subject}</h3>
                <div class="message-body">
                    <div class="message-emoji-large">${message.emoji || '💝'}</div>
                    ${message.content}
                </div>
                <div class="message-footer">
                    <p>Remember how far you've come 🌟</p>
                </div>
                <button class="btn-consultation" onclick="this.closest('.modal').remove()">
                    Close with Gratitude 💝
                </button>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // Initialize
    displayPendingMessages();
    checkForDelivery();

    // Check for deliveries periodically
    setInterval(checkForDelivery, 60000); // Check every minute
}); 