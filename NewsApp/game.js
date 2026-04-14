// Game variables
let canvas, ctx;
let gameLoop;
let isPlaying = false;
let isGameOver = false;
let score = 0;
let frames = 0;
let lives = 3;
let invincibleFrames = 0;

const GRAVITY = 0.4;
const JUMP_INITIAL = -5.8;
const JUMP_HOLD_FORCE = -0.3;
const MAX_HOLD_FRAMES = 18;
let GROUND_Y;

let player = {
    x: 70,
    y: 0,
    radius: 12,
    velocity: 0,
    isGrounded: false,
    isHoldingJump: false,
    holdFrames: 0
};

let obstacles = [];
let OBS_SPEED = 4;
let framesSinceLastObstacle = 0;
const MIN_GAP_FRAMES = 85;

let tear = { active: false, x: 0, y: 0, velocity: 0 };

const scoreEl = document.getElementById('score-display');
const livesEl = document.getElementById('lives-display');
const gameOverUI = document.getElementById('game-over-container');
const restartBtn = document.getElementById('restart-btn');

function jumpStart() {
    if (isPlaying && player.isGrounded && !tear.active) {
        player.velocity = JUMP_INITIAL;
        player.isGrounded = false;
        player.isHoldingJump = true;
        player.holdFrames = 0;
    }
}

function jumpEnd() {
    player.isHoldingJump = false;
}

window.addEventListener('keydown', e => {
    if ((e.code === 'Space' || e.code === 'ArrowUp')) {
        if (!e.repeat) jumpStart();
    }
    if ((e.code === 'Space' || e.code === 'Enter') && isGameOver) {
        resetAndPlay();
    }
});

window.addEventListener('keyup', e => {
    if ((e.code === 'Space' || e.code === 'ArrowUp')) {
        jumpEnd();
    }
});

setTimeout(() => {
    const cvs = document.getElementById('gameCanvas');
    if (cvs) {
        cvs.addEventListener('mousedown', () => jumpStart());
        cvs.addEventListener('mouseup', () => jumpEnd());
        cvs.addEventListener('mouseleave', () => jumpEnd());
    }
}, 500);

window.startGame = function () {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 500;
    GROUND_Y = canvas.height - 50;

    resetAndPlay();
}

window.stopGame = function () {
    isPlaying = false;
    cancelAnimationFrame(gameLoop);
}

function updateLivesUI() {
    let hearts = "";
    for (let i = 0; i < lives; i++) hearts += "♥";
    for (let i = lives; i < 3; i++) hearts += "♡";
    livesEl.innerText = hearts;
}

function resetAndPlay() {
    GROUND_Y = canvas.height - 50;
    player.y = GROUND_Y;
    player.velocity = 0;
    player.isGrounded = true;
    player.isHoldingJump = false;
    player.holdFrames = 0;
    obstacles = [];
    framesSinceLastObstacle = 0;
    tear.active = false;
    score = 0;
    frames = 0;
    lives = 3;
    invincibleFrames = 0;
    OBS_SPEED = 4;
    isPlaying = true;
    isGameOver = false;

    scoreEl.innerText = `Score: ${score}`;
    updateLivesUI();

    gameOverUI.classList.add('hidden');

    if (gameLoop) cancelAnimationFrame(gameLoop);
    update();
}

function handleCollision() {
    lives--;
    updateLivesUI();

    if (lives <= 0) {
        triggerGameOver();
        return;
    }

    // Player lived: grant i-frames and shed a tear without clearing obstacles
    invincibleFrames = 120; // 2 seconds at 60fps

    tear.active = true;
    tear.x = player.x + 10;
    tear.y = player.y - 12;
    tear.velocity = -3;
}

function update() {
    if (!isPlaying) return;

    if (invincibleFrames > 0) invincibleFrames--;

    if (tear.active) {
        tear.velocity += GRAVITY;
        tear.y += tear.velocity;
        if (tear.y > canvas.height) {
            tear.active = false;
        }
    }

    // Physics
    if (player.isHoldingJump && player.holdFrames < MAX_HOLD_FRAMES && !player.isGrounded) {
        player.velocity += JUMP_HOLD_FORCE;
        player.holdFrames++;
    }

    player.velocity += GRAVITY;
    player.y += player.velocity;

    // Ground collision
    if (player.y >= GROUND_Y) {
        player.y = GROUND_Y;
        player.velocity = 0;
        player.isGrounded = true;
    } else {
        player.isGrounded = false;
    }

    // Generate obstacles
    framesSinceLastObstacle++;
    if (framesSinceLastObstacle > MIN_GAP_FRAMES) {
        if (Math.random() < 0.02) {
            // Spawn 1 or 2 consecutive blocks
            let blockCount = Math.random() < 0.3 ? 2 : 1;
            let groupHeight = 25 + Math.random() * 25;

            for (let k = 0; k < blockCount; k++) {
                obstacles.push({
                    x: canvas.width + k * 45, // space them consecutively by 45 pixels
                    y: GROUND_Y + 12 - groupHeight,
                    w: 25,
                    h: groupHeight,
                    passed: false
                });
            }
            framesSinceLastObstacle = 0;
        }
    }

    // Obstacle Logic
    for (let i = obstacles.length - 1; i >= 0; i--) {
        let obs = obstacles[i];
        obs.x -= OBS_SPEED;

        let cx = player.x;
        // cy is roughly bottom center of visual oval
        let cy = player.y;
        let r = player.radius - 2;

        // Simple AABB collision
        let playerBox = { x: cx - r, y: cy - 20, w: r * 2, h: 25 };
        if (playerBox.x < obs.x + obs.w &&
            playerBox.x + playerBox.w > obs.x &&
            playerBox.y < obs.y + obs.h &&
            playerBox.y + playerBox.h > obs.y) {
            if (invincibleFrames <= 0) {
                handleCollision();
            }
        }

        // Score
        if (obs.x + obs.w < player.x && !obs.passed) {
            score++;
            scoreEl.innerText = `Score: ${score}`;
            obs.passed = true;
        }

        // Remove offscreen
        if (obs.x + obs.w < 0) {
            obstacles.splice(i, 1);
        }
    }

    frames++;
    // Speed progression
    if (frames % 300 === 0) {
        OBS_SPEED += 0.2;
    }

    draw();
    gameLoop = requestAnimationFrame(update);
}

function draw() {
    // Sky
    ctx.fillStyle = '#1e2c3a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ground
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, GROUND_Y + 12, canvas.width, canvas.height - GROUND_Y - 12);
    // Ground line
    ctx.fillStyle = '#ccc';
    ctx.fillRect(0, GROUND_Y + 12, canvas.width, 2);

    // Obstacles (Red hurdles)
    ctx.fillStyle = '#ff5555';
    for (let obs of obstacles) {
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);
    }

    // Draw Kiki's Cat
    ctx.save();

    // Blinking effect
    if (invincibleFrames > 0 && Math.floor(frames / 8) % 2 === 0) {
        ctx.globalAlpha = 0.3;
    } else {
        ctx.globalAlpha = 1.0;
    }

    ctx.translate(player.x, player.y);

    // Tilt only slightly when jumping
    let tilt = player.isGrounded ? 0 : Math.min(Math.max(player.velocity * 0.05, -0.3), 0.3);
    ctx.rotate(tilt);

    // Broomstick
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#8B4513';
    ctx.beginPath();
    ctx.moveTo(-25, 10);
    ctx.lineTo(25, 0);
    ctx.stroke();

    // Broom Bristles
    ctx.fillStyle = '#DAA520';
    ctx.beginPath();
    ctx.moveTo(-25, 10);
    ctx.lineTo(-40, 5);
    ctx.lineTo(-40, 15);
    ctx.fill();

    // Cat Body (Black oval)
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.ellipse(0, -5, 12, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cat Head
    ctx.beginPath();
    ctx.arc(8, -12, 8, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.beginPath();
    ctx.moveTo(3, -17);
    ctx.lineTo(1, -25);
    ctx.lineTo(7, -19);
    ctx.moveTo(10, -19);
    ctx.lineTo(15, -25);
    ctx.lineTo(14, -17);
    ctx.fill();

    // Eyes (yellow slit)
    if (tear.active) {
        // Eyes shut tightly
        ctx.strokeStyle = '#ff0';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(8, -13);
        ctx.lineTo(12, -12);
        ctx.moveTo(13, -13);
        ctx.lineTo(16, -12);
        ctx.stroke();
    } else {
        ctx.fillStyle = '#ff0';
        ctx.beginPath();
        ctx.ellipse(10, -13, 2, 3, 0, 0, Math.PI * 2);
        ctx.ellipse(14, -13, 2, 3, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    // Blue Scarf
    ctx.fillStyle = '#0055ff';
    ctx.beginPath();
    ctx.moveTo(2, -6);
    ctx.lineTo(8, -4);
    ctx.lineTo(-12, -8);
    ctx.fill();

    ctx.restore();

    // Draw the Tear if active
    if (tear.active) {
        ctx.fillStyle = '#00f3ff';
        ctx.beginPath();
        ctx.arc(tear.x, tear.y, 4, 0, Math.PI * 2);
        ctx.moveTo(tear.x - 4, tear.y);
        ctx.lineTo(tear.x, tear.y - 8);
        ctx.lineTo(tear.x + 4, tear.y);
        ctx.fill();
    }
}

function triggerGameOver() {
    isPlaying = false;
    isGameOver = true;

    document.getElementById('game-over-msg').innerText = `Final Score: ${score}`;
    gameOverUI.classList.remove('hidden');
}

restartBtn.addEventListener('click', resetAndPlay);
