let minutes = 25;
let seconds = 0;
let timer;
let isRunning = false;
let pomodoroCount = 0;
let todayCount = 0;
let currentMode = 'focus'; // 'focus', 'shortBreak', 'longBreak'
let quotes = [
    "✨ Progress over perfection!",
    "🌱 Small steps every day!",
    "🔥 Stay focused, stay fabulous!",
    "💖 You’re doing amazing, bestie!",
    "🚀 One pomodoro at a time!"
];

// DOM Elements
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const pomodoroDisplay = document.getElementById('pomodoroCount');
const todayDisplay = document.getElementById('todayCount');
const quoteDisplay = document.getElementById('quote');

const focusInput = document.getElementById('focusInput');
const shortBreakInput = document.getElementById('shortBreakInput');
const longBreakInput = document.getElementById('longBreakInput');

const finishSound = document.getElementById('finishSound');
const lofiMusic = document.getElementById('lofiMusic');

// Update Timer Display
function updateDisplay() {
    minutesDisplay.textContent = String(minutes).padStart(2, '0');
    secondsDisplay.textContent = String(seconds).padStart(2, '0');
}

// Random Quote
function setRandomQuote() {
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    quoteDisplay.textContent = random;
}

// Start Timer
function startTimer() {
    if (isRunning) return;
    isRunning = true;
    timer = setInterval(() => {
        if (seconds === 0) {
            if (minutes === 0) {
                clearInterval(timer);
                isRunning = false;
                finishSound.play();

                if (currentMode === 'focus') {
                    pomodoroCount++;
                    todayCount++;
                    pomodoroDisplay.textContent = pomodoroCount;
                    todayDisplay.textContent = todayCount;
                    startConfetti();
                }

                // Auto Switch Logic
                if (currentMode === 'focus') {
                    startBreak();
                } else if (currentMode === 'shortBreak' || currentMode === 'longBreak') {
                    setToFocus();
                }

                alert("⏰ Timer Finished!");
                return;
            }
            minutes--;
            seconds = 59;
        } else {
            seconds--;
        }
        updateDisplay();
    }, 1000);
}

// Start Short or Long Break after focus
function startBreak() {
    if (pomodoroCount % 4 === 0) {
        currentMode = 'longBreak';
        minutes = Number(longBreakInput.value);
    } else {
        currentMode = 'shortBreak';
        minutes = Number(shortBreakInput.value);
    }
    seconds = 0;
    updateDisplay();
}

// Back to Focus after break
function setToFocus() {
    currentMode = 'focus';
    minutes = Number(focusInput.value);
    seconds = 0;
    setRandomQuote();
    updateDisplay();
}

// Pause Timer
function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
}

// Reset Timer
function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    setTimerByMode();
    updateDisplay();
}

// Set Timer by Current Mode
function setTimerByMode() {
    if (currentMode === 'focus') {
        minutes = Number(focusInput.value);
    } else if (currentMode === 'shortBreak') {
        minutes = Number(shortBreakInput.value);
    } else if (currentMode === 'longBreak') {
        minutes = Number(longBreakInput.value);
    }
    seconds = 0;
}

// Input Changes
focusInput.addEventListener('change', () => {
    clearInterval(timer);
    isRunning = false;
    currentMode = 'focus';
    setTimerByMode();
    updateDisplay();
});

shortBreakInput.addEventListener('change', () => {
    clearInterval(timer);
    isRunning = false;
    currentMode = 'shortBreak';
    setTimerByMode();
    updateDisplay();
});

longBreakInput.addEventListener('change', () => {
    clearInterval(timer);
    isRunning = false;
    currentMode = 'longBreak';
    setTimerByMode();
    updateDisplay();
});

// Button Listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// Dark Mode Toggle
const darkToggle = document.getElementById('darkModeToggle');
darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
});

// Info Modal Logic
const infoBtn = document.getElementById('infoBtn');
const infoModal = document.getElementById('infoModal');
const closeBtn = document.querySelector('.close');

infoBtn.addEventListener('click', () => {
    infoModal.style.display = "block";
});

closeBtn.addEventListener('click', () => {
    infoModal.style.display = "none";
});

window.addEventListener('click', (event) => {
    if (event.target == infoModal) {
        infoModal.style.display = "none";
    }
});

// Music Toggle
const musicToggle = document.getElementById('musicToggle');
musicToggle.addEventListener('click', () => {
    if (lofiMusic.paused) {
        lofiMusic.play();
        musicToggle.textContent = "🔇";
    } else {
        lofiMusic.pause();
        musicToggle.textContent = "🎶";
    }
});

// Confetti on Focus Session Complete
function startConfetti() {
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        confetti(Object.assign({}, defaults, {
            particleCount: 50,
            origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 }
        }));
    }, 250);
}

// Initialize on Load
setTimerByMode();
updateDisplay();
setRandomQuote();
