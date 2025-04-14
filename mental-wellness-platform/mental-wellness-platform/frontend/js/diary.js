document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const modal = document.getElementById('diaryModal');
    const closeBtn = document.querySelector('.close-btn');
    const steps = document.querySelectorAll('.diary-step');
    const emotionCards = document.querySelectorAll('.emotion-card');
    const nextBtn = document.querySelector('.btn-next');
    const backBtns = document.querySelectorAll('.btn-back');
    const previewBtn = document.querySelector('.btn-preview');
    const confirmBtn = document.querySelector('.btn-confirm');
    const imageInput = document.getElementById('entryImage');
    const imagePreview = document.getElementById('imagePreview');
    const diaryForm = document.getElementById('diaryForm');
    const createDiaryBtn = document.getElementById('createDiaryBtn');
    const timelineEntries = document.querySelector('.timeline-entries');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // State
    let currentStep = 0;
    let selectedEmotion = null;
    let selectedImageSrc = '';
    let entries = JSON.parse(localStorage.getItem('diaryEntries')) || [];

    // Initialize
    function init() {
        document.getElementById('entryDate').valueAsDate = new Date();
        showStep(0);
        if (nextBtn) nextBtn.disabled = true;

        // Load and display existing entries
        loadEntries();

        // Open Modal
        createDiaryBtn.addEventListener('click', () => {
            modal.style.display = 'block';
            resetForm();
        });

        // Close Modal
        document.addEventListener('click', function (e) {
            if (e.target.matches('.close-btn') || e.target.matches('.modal')) {
                modal.style.display = 'none';
                resetForm();
            }
        });

        // Live Image Preview When Adding Image
        imageInput.addEventListener('change', function () {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    selectedImageSrc = e.target.result; // Store the image for preview
                    imagePreview.innerHTML = `<img src="${selectedImageSrc}" alt="Selected Image" style="max-width: 100%; border-radius: 8px;">`;
                };
                reader.readAsDataURL(this.files[0]);
            }
        });

        // Weather Selection
        document.querySelectorAll('.weather-icon-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.weather-icon-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                document.getElementById('weather').value = btn.dataset.weather;
            });
        });

        // Sleep Duration Selection
        document.querySelectorAll('.sleep-hour-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.sleep-hour-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                document.getElementById('sleepHours').value = btn.dataset.hours;
            });
        });

        // Entry Actions (View, Edit, Delete)
        timelineEntries.addEventListener('click', function (e) {
            const entryElement = e.target.closest('.diary-entry');
            if (!entryElement) return;

            const entryId = entryElement.dataset.entryId;
            if (e.target.closest('.btn-edit')) {
                editEntry(entryId, entryElement);
            } else if (e.target.closest('.btn-delete')) {
                deleteEntry(entryId, entryElement);
            } else {
                viewEntry(entryId, entryElement);
            }
        });

        // Filtering Optimization
        filterButtons.forEach(button => {
            button.addEventListener('click', function () {
                const filter = this.getAttribute('data-filter');
                document.querySelector('.filter-btn.active')?.classList.remove('active');
                this.classList.add('active');

                requestAnimationFrame(() => {
                    document.querySelectorAll('.diary-entry').forEach(entry => {
                        entry.style.display = (filter === "all" || entry.classList.contains(filter)) ? "block" : "none";
                    });
                });
            });
        });
    }

    // Navigation between steps
    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.style.display = index === stepIndex ? 'block' : 'none';
            step.classList.toggle('active', index === stepIndex);
        });
        currentStep = stepIndex;
    }

    // Emotion selection
    emotionCards.forEach(card => {
        card.addEventListener('click', () => {
            emotionCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedEmotion = card.dataset.emotion;
            if (nextBtn) {
                nextBtn.disabled = false;
                nextBtn.style.animation = 'none';
                nextBtn.offsetHeight; // Trigger reflow
                nextBtn.style.animation = 'bounce 0.5s ease';
            }
        });
    });

    // Next & Back Buttons
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentStep === 0 && !selectedEmotion) {
                showNotification('Please select an emotion', 'error');
                return;
            }
            showStep(currentStep + 1);
        });
    }

    backBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            showStep(currentStep - 1);
        });
    });

    // Preview Entry ( FIXED IMAGE PREVIEW)
    previewBtn.addEventListener('click', () => {
        if (!validateForm()) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        const previewContent = document.querySelector('.preview-content');
        const date = document.getElementById('entryDate').value;
        const weather = document.getElementById('weather').value;
        const sleepHours = document.getElementById('sleepHours').value;
        const title = document.getElementById('entryTitle').value;
        const text = document.getElementById('entryText').value;

        let imageHTML = selectedImageSrc ? `<img src="${selectedImageSrc}" alt="Diary Image" style="max-width: 100%; border-radius: 8px;">` : '';

        previewContent.innerHTML = `
            <h3>${title}</h3>
            <p>${text}</p>
            <p><i class="fas fa-cloud-sun"></i> ${weather} | <i class="fas fa-bed"></i> ${sleepHours} hours of sleep</p>
            ${imageHTML}
        `;
        showStep(2);
    });

    // Reset form
    function resetForm() {
        diaryForm.reset();
        imagePreview.innerHTML = ''; // Clear image preview
        selectedImageSrc = ''; // Reset selected image
        emotionCards.forEach(card => card.classList.remove('selected'));
        if (nextBtn) nextBtn.disabled = true;
        showStep(0);
    }

    // Validate form
    function validateForm() {
        return [...document.querySelectorAll('#diaryForm input, #diaryForm textarea')].every(input => input.value.trim() !== '');
    }

    // View Entry
    function viewEntry(entryId, entryElement) {
        modal.style.display = 'flex';
        document.querySelector('.modal-content').innerHTML = entryElement.innerHTML;
    }

    // Edit Entry
    function editEntry(entryId, entryElement) {
        modal.style.display = 'block';
        showStep(0);
    }

    // Delete Entry
    function deleteEntry(entryId, entryElement) {
        if (confirm('Are you sure you want to delete this entry?')) {
            entries = entries.filter(entry => entry.id !== parseInt(entryId));
            localStorage.setItem('diaryEntries', JSON.stringify(entries));
            entryElement.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => entryElement.remove(), 300);
            showNotification('Entry deleted successfully', 'success');
        }
    }

    // Show Notification
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Save Entry
    confirmBtn.addEventListener('click', () => {
        if (!validateForm()) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        const newEntry = {
            id: Date.now(), // Unique ID using timestamp
            date: document.getElementById('entryDate').value,
            emotion: selectedEmotion,
            weather: document.getElementById('weather').value,
            sleepHours: document.getElementById('sleepHours').value,
            title: document.getElementById('entryTitle').value,
            text: document.getElementById('entryText').value,
            image: selectedImageSrc
        };

        // Add new entry to array
        entries.unshift(newEntry);
        
        // Save to localStorage
        localStorage.setItem('diaryEntries', JSON.stringify(entries));

        // Add entry to timeline
        addEntryToTimeline(newEntry);

        // Close modal and reset form
        modal.style.display = 'none';
        resetForm();
        showNotification('Entry saved successfully!', 'success');
    });

    // Load Entries
    function loadEntries() {
        timelineEntries.innerHTML = ''; // Clear existing entries
        entries.forEach(entry => addEntryToTimeline(entry));
    }

    // Add Entry to Timeline
    function addEntryToTimeline(entry) {
        const date = new Date(entry.date);
        const entryHTML = `
            <div class="diary-entry ${entry.emotion} animate-fade-right" data-entry-id="${entry.id}">
                <div class="entry-date">
                    <span class="date">${date.getDate()}</span>
                    <span class="month">${date.toLocaleString('default', { month: 'short' })}</span>
                    <span class="year">${date.getFullYear()}</span>
                </div>
                <div class="entry-content">
                    <div class="entry-header">
                        <div class="entry-emotion ${entry.emotion}">
                            <i class="fas ${getEmotionIcon(entry.emotion)}"></i>
                            <span>${capitalizeFirstLetter(entry.emotion)}</span>
                        </div>
                        <div class="entry-meta">
                            <div class="entry-weather">
                                <i class="fas ${getWeatherIcon(entry.weather)}"></i>
                                <span>${capitalizeFirstLetter(entry.weather)}</span>
                            </div>
                            <div class="entry-sleep">
                                <i class="fas fa-moon"></i>
                                <span>${entry.sleepHours} hours</span>
                            </div>
                        </div>
                    </div>
                    <h3>${entry.title}</h3>
                    <p>${entry.text}</p>
                    ${entry.image ? `<div class="entry-image"><img src="${entry.image}" alt="Diary image"></div>` : ''}
                    <div class="entry-actions">
                        <button class="btn-edit" data-entry-id="${entry.id}">
                            <i class="fas fa-edit"></i>
                            <span>Edit</span>
                        </button>
                        <button class="btn-delete" data-entry-id="${entry.id}">
                            <i class="fas fa-trash"></i>
                            <span>Delete</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        timelineEntries.insertAdjacentHTML('afterbegin', entryHTML);
    }

    // Helper Functions
    function getEmotionIcon(emotion) {
        const icons = {
            joy: 'fa-smile',
            sadness: 'fa-sad-tear',
            anger: 'fa-angry',
            anxiety: 'fa-wind',
            numb: 'fa-meh'
        };
        return icons[emotion] || 'fa-smile';
    }

    function getWeatherIcon(weather) {
        const icons = {
            sunny: 'fa-sun',
            cloudy: 'fa-cloud',
            rainy: 'fa-cloud-rain',
            stormy: 'fa-bolt'
        };
        return icons[weather] || 'fa-sun';
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Initialize
    init();
});
