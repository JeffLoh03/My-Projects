document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const bookingButtons = document.querySelectorAll('.btn-book, .btn-consultation');
    const bookingModal = document.getElementById('booking-modal');
    const closeBtn = document.querySelector('.close-btn');
    const bookingForm = document.getElementById('booking-form');
    const therapistSelect = document.getElementById('therapist');
    const dateInput = document.getElementById('date');

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;

    // Open booking modal
    bookingButtons.forEach(button => {
        button.addEventListener('click', function() {
            bookingModal.style.display = 'block';
            // If booking from therapist card, pre-select the therapist
            if (this.closest('.therapist-card')) {
                const therapistName = this.closest('.therapist-card').querySelector('h3').textContent;
                const option = Array.from(therapistSelect.options).find(opt => opt.text === therapistName);
                if (option) {
                    therapistSelect.value = option.value;
                }
            }
        });
    });

    // Close booking modal
    closeBtn.addEventListener('click', function() {
        bookingModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === bookingModal) {
            bookingModal.style.display = 'none';
        }
    });

    // Handle form submission
    bookingForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form data
        const formData = {
            consultationType: document.getElementById('consultation-type').value,
            therapist: document.getElementById('therapist').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            notes: document.getElementById('notes').value
        };

        // Here you would typically send this data to your backend
        console.log('Booking details:', formData);

        // Show success message
        showNotification('Consultation booked successfully! We will send you a confirmation email.', 'success');

        // Close modal and reset form
        bookingModal.style.display = 'none';
        bookingForm.reset();
    });

    // Notification function
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);

        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Add animation to cards when they come into view
    const cards = document.querySelectorAll('.step-card, .therapist-card, .benefit-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';
        observer.observe(card);
    });
}); 