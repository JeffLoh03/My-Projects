// Mood data structure
let moodData = {
    joy: 0,
    sadness: 0,
    anger: 0,
    anxiety: 0,
    numb: 0
};

// Achievement status
const achievements = {
    happy: { unlocked: false, progress: 0 },
    calm: { unlocked: false, progress: 0 },
    strong: { unlocked: false, progress: 0 }
};

// Daily quotes
const quotes = [
    "The only way out is through. - Robert Frost",
    "You are stronger than you know.",
    "Every day is a new beginning.",
    "Your emotions are valid.",
    "Progress, not perfection.",
    "You've got this!",
    "Take it one day at a time.",
    "Be patient with yourself."
];

// Music recommendations based on mood
const musicLinks = {
    joy: "https://open.spotify.com/embed/track/3Zwu2K0Qa5sT6teCCHPShP",
    sadness: "https://open.spotify.com/embed/track/1dGr1c8CrMLDpV6mPbImSI",
    anxiety: "https://open.spotify.com/embed/track/5ChkMS8OtdzJeqyybCc9R5",
    anger: "https://open.spotify.com/embed/track/7hDVYcQq6MxkdJGweuCtl9",
    numb: "https://open.spotify.com/embed/track/2nLtzopw4rPReszdYBJU6h"
};

// Initialize mood chart
let moodChart;

function initMoodChart() {
    const ctx = document.getElementById('moodChart').getContext('2d');
    moodChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Joy', 'Sadness', 'Anger', 'Anxiety', 'Numb'],
            datasets: [{
                data: [0, 0, 0, 0, 0],
                backgroundColor: [
                    '#FFD700', // Joy
                    '#A2D2FF', // Sadness
                    '#FF6B6B', // Anger
                    '#FFA07A', // Anxiety
                    '#C9C9C9'  // Numb
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Update mood data and check achievements
function updateMoodData(data) {
    moodData = data;
    updateChart();
    checkAchievements();
    updateMusicRecommendation();
}

// Update the chart with new data
function updateChart() {
    const total = Object.values(moodData).reduce((a, b) => a + b, 0);
    const percentages = Object.values(moodData).map(value => (value / total) * 100);
    moodChart.data.datasets[0].data = percentages;
    moodChart.update();
}

// Check and update achievements
function checkAchievements() {
    const total = Object.values(moodData).reduce((a, b) => a + b, 0);
    
    // Happy Soul Achievement
    const joyPercentage = (moodData.joy / total) * 100;
    achievements.happy.progress = joyPercentage;
    if (joyPercentage >= 40 && !achievements.happy.unlocked) {
        unlockAchievement('happy', 'Happy Soul');
    }

    // Calm Master Achievement
    const anxietyAngerPercentage = ((moodData.anxiety + moodData.anger) / total) * 100;
    achievements.calm.progress = 100 - anxietyAngerPercentage;
    if (anxietyAngerPercentage < 20 && !achievements.calm.unlocked) {
        unlockAchievement('calm', 'Calm Master');
    }

    // Strong Heart Achievement
    const challengingEmotions = ((moodData.sadness + moodData.numb) / total) * 100;
    achievements.strong.progress = challengingEmotions;
    if ((moodData.sadness >= 20 || moodData.numb >= 15) && !achievements.strong.unlocked) {
        unlockAchievement('strong', 'Strong Heart');
    }

    updateAchievementCards();
}

// Update achievement cards display
function updateAchievementCards() {
    Object.keys(achievements).forEach(achievement => {
        const card = document.getElementById(`achievement-${achievement}`);
        const progressBar = card.querySelector('.progress-bar');
        const status = card.querySelector('.achievement-status');
        
        progressBar.style.width = `${achievements[achievement].progress}%`;
        status.textContent = `Progress: ${Math.round(achievements[achievement].progress)}%`;
        
        if (achievements[achievement].unlocked) {
            card.classList.add('unlocked');
            card.style.opacity = '1';
        } else {
            card.style.opacity = '0.5';
        }
    });
}

// Show achievement unlock animation
function unlockAchievement(id, name) {
    achievements[id].unlocked = true;
    const modal = document.getElementById('achievement-modal');
    const message = document.getElementById('achievement-message');
    message.textContent = `Congratulations! You've unlocked the "${name}" achievement!`;
    modal.style.display = 'block';
    
    // Hide modal after 3 seconds
    setTimeout(() => {
        modal.style.display = 'none';
    }, 3000);
}

// Set daily quote
function setDailyQuote() {
    const quoteElement = document.getElementById('inspirational-quote');
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteElement.textContent = randomQuote;
}

// Update music player based on dominant mood
function updateMusicRecommendation() {
    const total = Object.values(moodData).reduce((a, b) => a + b, 0);
    let dominantMood = Object.entries(moodData)
        .reduce((a, b) => (b[1] > a[1] ? b : a))[0];

    const musicPlayer = document.getElementById('spotify-player');
    if (musicPlayer) {
        musicPlayer.src = musicLinks[dominantMood];
    }
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
    initMoodChart();
    setDailyQuote();
    
    document.querySelector('.quote').classList.add('visible');
    document.querySelector('.btn-consultation').addEventListener('click', () => {
        document.getElementById('achievement-modal').style.display = 'none';
    });

    setTimeout(() => {
        updateMoodData({
            joy: 8,
            sadness: 3,
            anger: 12,
            anxiety: 1,
            numb: 1
        });
 },1000);
});
