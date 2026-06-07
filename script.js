// DOM Elements
let hours = document.getElementById('hours');
let minutes = document.getElementById('minutes');
let seconds = document.getElementById('seconds');
let milliseconds = document.getElementById('milliseconds');
let startBtn = document.getElementById('startBtn');
let pauseBtn = document.getElementById('pauseBtn');
let resetBtn = document.getElementById('resetBtn');
let lapBtn = document.getElementById('lapBtn');
let lapList = document.getElementById('lapList');
let clearLapsBtn = document.getElementById('clearLapsBtn');

// Variables
let timer = null;
let isRunning = false;
let hour = 0, min = 0, sec = 0, ms = 0;
let lapCounter = 1;
let lastLapTime = 0;

// Format time with leading zeros
function formatTime(value) {
    return value < 10 ? `0${value}` : value;
}

// Update display
function updateDisplay() {
    hours.textContent = formatTime(hour);
    minutes.textContent = formatTime(min);
    seconds.textContent = formatTime(sec);
    milliseconds.textContent = ms < 10 ? `0${ms}` : ms;
}

// Stopwatch logic
function stopwatch() {
    ms++;
    
    if (ms === 100) {
        ms = 0;
        sec++;
        
        if (sec === 60) {
            sec = 0;
            min++;
            
            if (min === 60) {
                min = 0;
                hour++;
            }
        }
    }
    
    updateDisplay();
}

// Get current time as string
function getCurrentTime() {
    return `${formatTime(hour)}:${formatTime(min)}:${formatTime(sec)}.${ms < 10 ? `0${ms}` : ms}`;
}

// Get time in milliseconds for lap difference calculation
function getTimeInMs() {
    return (hour * 3600000) + (min * 60000) + (sec * 1000) + ms;
}

// Start stopwatch
function startStopwatch() {
    if (!isRunning) {
        timer = setInterval(stopwatch, 10);
        isRunning = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
    }
}

// Pause stopwatch
function pauseStopwatch() {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }
}

// Reset stopwatch
function resetStopwatch() {
    // Stop the timer
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
    }
    
    // Reset all values
    hour = 0;
    min = 0;
    sec = 0;
    ms = 0;
    updateDisplay();
    
    // Reset button states
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    
    // Reset lap counter and last lap time
    lapCounter = 1;
    lastLapTime = 0;
    
    // Clear lap list
    clearAllLaps();
}

// Record lap
function recordLap() {
    if (!isRunning && hour === 0 && min === 0 && sec === 0 && ms === 0) {
        return;
    }
    
    let currentTime = getCurrentTime();
    let currentTimeMs = getTimeInMs();
    let difference = '';
    
    if (lastLapTime === 0) {
        difference = '+0.00s';
    } else {
        let diffMs = currentTimeMs - lastLapTime;
        let diffSec = (diffMs / 1000).toFixed(2);
        difference = `+${diffSec}s`;
    }
    
    // Remove empty message if exists
    if (lapList.children[0] && lapList.children[0].classList.contains('empty-lap')) {
        lapList.innerHTML = '';
    }
    
    // Create lap item
    let lapItem = document.createElement('li');
    lapItem.innerHTML = `
        <span class="lap-number">Lap ${lapCounter}</span>
        <span class="lap-time">${currentTime}</span>
        <span class="lap-diff">${difference}</span>
    `;
    
    lapList.insertBefore(lapItem, lapList.firstChild);
    lapCounter++;
    lastLapTime = currentTimeMs;
    
    // Smooth scroll to top of lap list
    lapList.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Clear all laps
function clearAllLaps() {
    lapList.innerHTML = '<li class="empty-lap">No laps recorded yet. Press "Lap" to start tracking!</li>';
    lapCounter = 1;
    lastLapTime = 0;
}

// Keyboard shortcuts
document.addEventListener('keydown', (event) => {
    switch(event.code) {
        case 'Space':
            event.preventDefault();
            if (isRunning) {
                pauseStopwatch();
            } else {
                startStopwatch();
            }
            break;
        case 'KeyR':
            resetStopwatch();
            break;
        case 'KeyL':
            recordLap();
            break;
        case 'KeyC':
            if (event.ctrlKey || event.metaKey) {
                event.preventDefault();
                clearAllLaps();
            }
            break;
    }
});

// Event Listeners
startBtn.addEventListener('click', startStopwatch);
pauseBtn.addEventListener('click', pauseStopwatch);
resetBtn.addEventListener('click', resetStopwatch);
lapBtn.addEventListener('click', recordLap);
clearLapsBtn.addEventListener('click', clearAllLaps);

// Initialize display
updateDisplay();