const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        const maxWidth = Math.min(window.innerWidth - 30, 500);
        canvas.width = maxWidth;
        canvas.height = Math.floor(maxWidth * 0.8);

        ball.speed = 3.5;
        config.ball.speed = 3.5;
    } else {
        canvas.width = 700;
        canvas.height = 500;

        ball.speed = 4.5;
        config.ball.speed = 4.5;
    }


    if (isMobile) {
        config.brick.cols = 6;
        config.brick.rows = 4;
        config.brick.width = Math.floor((canvas.width - 60) / config.brick.cols);
        config.brick.height = 20;
        config.brick.padding = 6;
        config.brick.offsetTop = 35;
        config.brick.offsetLeft = Math.floor((canvas.width - (config.brick.cols * config.brick.width + (config.brick.cols - 1) * config.brick.padding)) / 2);
    } else {
        config.brick.cols = 8;
        config.brick.rows = 5;
        config.brick.width = 75;
        config.brick.height = 22;
        config.brick.padding = 8;
        config.brick.offsetTop = 40;
        config.brick.offsetLeft = 30;
    }

    if (isMobile) {
        paddle.width = Math.floor(canvas.width / 5);
        paddle.height = 15;
        config.paddle.width = paddle.width;
        config.paddle.height = paddle.height;
        console.log(`📱 Raquette mobile: ${paddle.width}x${paddle.height}px`);
    } else {
        paddle.width = 100;
        paddle.height = 12;
        config.paddle.width = 100;
        config.paddle.height = 12;
    }

    if (gameState.running || bricks.length > 0) {
        initBricks();
        resetBallAndPaddle();
    }
}

window.addEventListener('resize', resizeCanvas);

let gameState = {
    running: false,
    paused: false,
    score: 0,
    lives: 3,
    level: 1
};

const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const enableEffects = !isMobileDevice;

const config = {
    paddle: {
        width: 100,
        height: 12,
        speed: 8,
        color: '#6366f1'
    },
    ball: {
        radius: 7,
        speed: 4.5,
        color: '#ec4899'
    },
    brick: {
        rows: 5,
        cols: 8,
        width: 75,
        height: 22,
        padding: 8,
        offsetTop: 40,
        offsetLeft: 30,
        colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7']
    }
};

let paddle = {
    x: canvas.width / 2 - config.paddle.width / 2,
    y: canvas.height - 30,
    width: config.paddle.width,
    height: config.paddle.height,
    dx: 0
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    radius: config.ball.radius,
    dx: config.ball.speed * (Math.random() > 0.5 ? 1 : -1),
    dy: -config.ball.speed,
    speed: config.ball.speed
};

let bricks = [];
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;
let particles = [];


function loadHighScores() {
    const saved = localStorage.getItem('arcadeDesignerScores');
    if (saved) {
        return JSON.parse(saved);
    }
    return [];
}

function saveHighScore(score, level) {
    let scores = loadHighScores();
    scores.push({
        score: score,
        level: level,
        date: new Date().toLocaleDateString('fr-FR')
    });
    scores.sort((a, b) => b.score - a.score);
    scores = scores.slice(0, 5);
    localStorage.setItem('arcadeDesignerScores', JSON.stringify(scores));
    return scores;
}

function getBestScore() {
    const scores = loadHighScores();
    return scores.length > 0 ? scores[0].score : 0;
}

function displayHighScores() {
    const scores = loadHighScores();
    if (scores.length > 0) {
        console.log('🏆 TOP 5 MEILLEURS SCORES :');
        scores.forEach((s, index) => {
            console.log(`${index + 1}. ${s.score} points - Niveau ${s.level} (${s.date})`);
        });
    }
}

function clearHighScores() {
    localStorage.removeItem('arcadeDesignerScores');
    console.log('🗑️ Scores effacés');
}

window.clearArcadeScores = clearHighScores;


function initBricks() {
    bricks = [];
    for (let row = 0; row < config.brick.rows; row++) {
        bricks[row] = [];
        for (let col = 0; col < config.brick.cols; col++) {
            bricks[row][col] = {
                x: col * (config.brick.width + config.brick.padding) + config.brick.offsetLeft,
                y: row * (config.brick.height + config.brick.padding) + config.brick.offsetTop,
                width: config.brick.width,
                height: config.brick.height,
                status: 1,
                color: config.brick.colors[row % config.brick.colors.length],
                points: row + 1
            };
        }
    }
}

function drawPaddle() {
    if (enableEffects) {
        const gradient = ctx.createLinearGradient(paddle.x, paddle.y, paddle.x + paddle.width, paddle.y);
        gradient.addColorStop(0, '#6366f1');
        gradient.addColorStop(1, '#8b5cf6');
        ctx.fillStyle = gradient;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#6366f1';
    } else {
        ctx.fillStyle = '#6366f1';
    }
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    if (enableEffects) {
        ctx.shadowBlur = 0;
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    if (enableEffects) {
        const gradient = ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, ball.radius);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(1, config.ball.color);
        ctx.fillStyle = gradient;
        ctx.shadowBlur = 20;
        ctx.shadowColor = config.ball.color;
    } else {
        ctx.fillStyle = config.ball.color;
    }
    ctx.fill();
    if (enableEffects) {
        ctx.shadowBlur = 0;
    }
    ctx.closePath();
}

function drawBricks() {
    for (let row = 0; row < config.brick.rows; row++) {
        for (let col = 0; col < config.brick.cols; col++) {
            const brick = bricks[row][col];
            if (brick.status === 1) {
                ctx.fillStyle = brick.color;
                if (enableEffects) {
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = brick.color;
                }
                ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
                if (enableEffects) {
                    ctx.shadowBlur = 0;
                }
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 2;
                ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
            }
        }
    }
}

function drawStats() {
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${gameState.score}`, 20, 25);
    ctx.fillText(`Vies: ${gameState.lives}`, canvas.width - 100, 25);
    ctx.fillText(`Niveau: ${gameState.level}`, canvas.width / 2 - 40, 25);
}

function updateDisplay() {
    const scoreDisplay = document.getElementById('scoreDisplay');
    const livesDisplay = document.getElementById('livesDisplay');
    const levelDisplay = document.getElementById('levelDisplay');

    if (scoreDisplay) {
        scoreDisplay.textContent = gameState.score;
    }
    if (livesDisplay) {
        livesDisplay.textContent = gameState.lives;
    }
    if (levelDisplay) {
        levelDisplay.textContent = gameState.level;
    }
}


function createParticles(x, y, color) {
    for (let i = 0; i < 8; i++) {
        particles.push({
            x: x,
            y: y,
            dx: (Math.random() - 0.5) * 4,
            dy: (Math.random() - 0.5) * 4,
            color: color,
            life: 30
        });
    }
}

function updateParticles() {
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        p.life--;
        ctx.globalAlpha = p.life / 30;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 4, 4);
    });
    ctx.globalAlpha = 1;
}


function detectBrickCollision() {
    for (let row = 0; row < config.brick.rows; row++) {
        for (let col = 0; col < config.brick.cols; col++) {
            const brick = bricks[row][col];
            if (brick.status === 1) {
                if (ball.x + ball.radius > brick.x &&
                    ball.x - ball.radius < brick.x + brick.width &&
                    ball.y + ball.radius > brick.y &&
                    ball.y - ball.radius < brick.y + brick.height) {
                    ball.dy = -ball.dy;
                    brick.status = 0;
                    gameState.score += brick.points * 10;
                    updateDisplay();
                    createParticles(brick.x + brick.width / 2, brick.y + brick.height / 2, brick.color);
                    if (checkWin()) {
                        nextLevel();
                    }
                }
            }
        }
    }
}

function checkWin() {
    for (let row = 0; row < config.brick.rows; row++) {
        for (let col = 0; col < config.brick.cols; col++) {
            if (bricks[row][col].status === 1) {
                return false;
            }
        }
    }
    return true;
}

let levelTransition = {
    active: false,
    countdown: 0,
    startTime: 0,
    message: ''
};

function nextLevel() {
    const isMobile = window.innerWidth <= 768;
    gameState.level++;

    // Augmentation de vitesse plus douce
    if (isMobile) {
        ball.speed += 0.8;
    } else {
        ball.speed += 1.0;
    }

    initBricks();
    resetBallAndPaddle();
    updateDisplay();

    // Lancer le timer de 3 secondes avant de reprendre
    levelTransition.active = true;
    levelTransition.countdown = 3;
    levelTransition.startTime = Date.now();
    levelTransition.message = `Niveau ${gameState.level}`;
    gameState.paused = true;

    console.log(`⏭️ Niveau ${gameState.level} - Vitesse: ${ball.speed}`);
}

function resetBallAndPaddle() {
    // Mettre à jour les dimensions de la raquette selon la config actuelle
    paddle.width = config.paddle.width;
    paddle.height = config.paddle.height;

    // Repositionner la raquette au centre, en bas du canvas
    paddle.x = canvas.width / 2 - paddle.width / 2;
    paddle.y = canvas.height - 30;

    // Réinitialiser la position de la balle
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 50;
    ball.radius = config.ball.radius;
    // Angle léger entre -30° et 30° pour une trajectoire plus droite
    const angle = (Math.random() - 0.5) * Math.PI / 3;
    ball.dx = ball.speed * Math.sin(angle);
    ball.dy = -ball.speed * Math.cos(angle);
}

function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
    }

    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }

    if (ball.y + ball.radius > paddle.y &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width) {
        let hitPos = (ball.x - paddle.x) / paddle.width;
        let angle = (hitPos - 0.5) * Math.PI / 3;
        ball.dy = -Math.abs(ball.dy);
        ball.dx = ball.speed * Math.sin(angle);
    }

    if (ball.y + ball.radius > canvas.height) {
        gameState.lives--;
        updateDisplay();
        if (gameState.lives <= 0) {
            gameOver();
        } else {
            resetBallAndPaddle();
            // Timer de 3 secondes avant de reprendre après perte de vie
            levelTransition.active = true;
            levelTransition.countdown = 3;
            levelTransition.startTime = Date.now();
            levelTransition.message = `Vies restantes : ${gameState.lives}`;
            gameState.paused = true;
        }
    }
}

function updatePaddle() {
    paddle.x = mouseX - paddle.width / 2;
    if (paddle.x < 0) {
        paddle.x = 0;
    }
    if (paddle.x + paddle.width > canvas.width) {
        paddle.x = canvas.width - paddle.width;
    }
}

function drawCursor() {
    if (!gameState.running) return;
    const cursorX = mouseX;
    const cursorY = mouseY;
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, 6, 0, Math.PI * 2);
    const gradient = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, 6);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, '#6366f1');
    ctx.fillStyle = gradient;
    if (enableEffects) {
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#6366f1';
    }
    ctx.fill();
    ctx.closePath();
    if (enableEffects) {
        ctx.shadowBlur = 0;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawPaddle();
    drawBall();
    drawCursor();
    drawStats();
    updateParticles();

    // Gérer le countdown entre niveaux
    if (levelTransition.active) {
        const elapsed = Date.now() - levelTransition.startTime;
        const remaining = Math.ceil(3 - elapsed / 1000);

        if (remaining <= 0) {
            levelTransition.active = false;
            gameState.paused = false;
        } else {
            levelTransition.countdown = remaining;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.textAlign = 'center';

            ctx.fillStyle = '#6366f1';
            ctx.font = 'bold 22px Inter, sans-serif';
            ctx.fillText(levelTransition.message, canvas.width / 2, canvas.height / 2 - 45);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 64px Inter, sans-serif';
            ctx.fillText(remaining, canvas.width / 2, canvas.height / 2 + 20);

            ctx.fillStyle = '#d1d5db';
            ctx.font = '16px Inter, sans-serif';
            ctx.fillText('Repositionnez votre souris...', canvas.width / 2, canvas.height / 2 + 55);
        }
    } else if (gameState.paused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.font = '48px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSE', canvas.width / 2, canvas.height / 2);
    }
}

function gameLoop() {
    if (gameState.running && !gameState.paused) {
        updateBall();
        updatePaddle();
        detectBrickCollision();
    }
    draw();
    requestAnimationFrame(gameLoop);
}


function gameOver() {
    gameState.running = false;
    const gameOverScreen = document.getElementById('gameOverScreen');
    const finalScore = document.getElementById('finalScore');
    const gameOverTitle = document.getElementById('gameOverTitle');

    saveHighScore(gameState.score, gameState.level);
    const bestScore = getBestScore();
    displayHighScores();

    if (gameState.score === bestScore && gameState.score > 0) {
        gameOverTitle.textContent = '🏆 NOUVEAU RECORD !';
    } else {
        gameOverTitle.textContent = 'Game Over!';
    }

    finalScore.textContent = gameState.score;

    const bestScoreElement = document.getElementById('bestScore');
    if (bestScoreElement) {
        bestScoreElement.textContent = `Meilleur score : ${bestScore}`;
    }

    gameOverScreen.classList.add('show');
    canvas.classList.remove('game-active');
    canvas.style.cursor = 'default';
}

function startGame() {
    // Si le jeu n'est pas déjà en cours, on peut démarrer
    if (!gameState.running) {
        gameState.running = true;
        gameState.paused = false;
        canvas.classList.add('game-active');
        canvas.style.cursor = 'none';
        console.log('▶️ Jeu démarré !');
    }
}

function pauseGame() {
    gameState.paused = !gameState.paused;
    const pauseBtn = document.getElementById('pauseBtn');
    if (gameState.paused) {
        pauseBtn.innerHTML = '<i class="fas fa-play"></i> Reprendre';
        canvas.classList.remove('game-active');
    } else {
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        canvas.classList.add('game-active');
    }
}

function resetGame() {
    // Réinitialiser complètement l'état du jeu
    gameState.running = false;
    gameState.paused = false;
    gameState.score = 0;
    gameState.lives = 3;
    gameState.level = 1;

    // Réinitialiser la vitesse de la balle
    ball.speed = config.ball.speed;

    // Réinitialiser les briques
    initBricks();

    // Réinitialiser la balle et la raquette
    resetBallAndPaddle();

    // Réinitialiser les particules
    particles = [];

    const scoreDisplay = document.getElementById('scoreDisplay');
    const livesDisplay = document.getElementById('livesDisplay');
    const levelDisplay = document.getElementById('levelDisplay');

    if (scoreDisplay) scoreDisplay.textContent = '0';
    if (livesDisplay) livesDisplay.textContent = '3';
    if (levelDisplay) levelDisplay.textContent = '1';

    const gameOverScreen = document.getElementById('gameOverScreen');
    if (gameOverScreen) {
        gameOverScreen.classList.remove('show');
    }

    const pauseBtn = document.getElementById('pauseBtn');
    if (pauseBtn) {
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    }

    canvas.classList.remove('game-active');
    canvas.style.cursor = 'default';

    console.log('🔄 Jeu réinitialisé complètement !', {
        score: gameState.score,
        lives: gameState.lives,
        level: gameState.level
    });
}


let isMouseInCanvas = true;

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const newMouseX = (e.clientX - rect.left) * scaleX;
    const newMouseY = (e.clientY - rect.top) * scaleY;
    if (newMouseX >= 0 && newMouseX <= canvas.width) {
        mouseX = newMouseX;
    }
    if (newMouseY >= 0 && newMouseY <= canvas.height) {
        mouseY = newMouseY;
    }
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const touch = e.touches[0];
    const newMouseX = (touch.clientX - rect.left) * scaleX;
    const newMouseY = (touch.clientY - rect.top) * scaleY;
    if (newMouseX >= 0 && newMouseX <= canvas.width) {
        mouseX = newMouseX;
    }
    if (newMouseY >= 0 && newMouseY <= canvas.height) {
        mouseY = newMouseY;
    }
}, { passive: false });

canvas.addEventListener('touchstart', () => {
    if (!gameState.running && !gameState.paused) {
        startGame();
    }
});

canvas.addEventListener('mouseenter', () => {
    isMouseInCanvas = true;
});

canvas.addEventListener('mouseleave', () => {
    isMouseInCanvas = false;
});

document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('pauseBtn').addEventListener('click', pauseGame);
document.getElementById('resetBtn').addEventListener('click', resetGame);
document.getElementById('playAgainBtn').addEventListener('click', resetGame);

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && gameState.running) {
        e.preventDefault();
        pauseGame();
    }
});

// ==========================================
// INITIALISATION
// ==========================================

// Fonction d'initialisation complète
function initializeGame() {
    const isMobile = window.innerWidth <= 768;

    // Réinitialiser complètement l'état du jeu
    gameState.running = false;
    gameState.paused = false;
    gameState.score = 0;
    gameState.lives = 3;
    gameState.level = 1;

    // Réinitialiser la vitesse de la balle selon le device
    ball.speed = isMobile ? 3.5 : 4.5;

    // Réinitialiser les particules
    particles = [];

    // Adapter le canvas à la taille de l'écran
    resizeCanvas();

    initBricks();

    resetBallAndPaddle();

    const scoreDisplay = document.getElementById('scoreDisplay');
    const livesDisplay = document.getElementById('livesDisplay');
    const levelDisplay = document.getElementById('levelDisplay');

    if (scoreDisplay) scoreDisplay.textContent = '0';
    if (livesDisplay) livesDisplay.textContent = '3';
    if (levelDisplay) levelDisplay.textContent = '1';

    console.log('🎮 Jeu initialisé !', {
        score: gameState.score,
        lives: gameState.lives,
        level: gameState.level,
        canvas: `${canvas.width}x${canvas.height}`,
        mobile: isMobile,
        ballSpeed: ball.speed
    });
}

window.addEventListener('load', () => {
    initializeGame();
    gameLoop();
    console.log('🚀 Arcade Designer chargé avec succès !');
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            updateDisplay();
        }, 100);
    });
} else {
    initializeGame();
    gameLoop();
}

