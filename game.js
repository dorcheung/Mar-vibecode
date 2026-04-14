// Game variables
let canvas, ctx;
let gameLoop;
let isPlaying = false;

// 1 = Wall, 0 = Pill, 2 = Empty
const initialMaze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,0,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,1,1,0,1,0,1,1,0,1,0,1],
    [1,0,0,0,1,0,0,1,0,0,1,0,0,0,1],
    [1,1,1,0,1,0,1,1,1,0,1,0,1,1,1],
    [1,0,0,0,0,0,0,2,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

let maze = [];
const tileSize = 40;
let totalPills = 0;

let player = {
    x: 0,
    y: 0,
    size: 15,
    speed: 3,
    vx: 0,
    vy: 0,
    angle: 0,
    mouthOpen: 0,
    mouthDir: 1
};

let keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, w: false, a: false, s: false, d: false };

window.addEventListener('keydown', e => {
    if(keys.hasOwnProperty(e.key)) keys[e.key] = true;
});
window.addEventListener('keyup', e => {
    if(keys.hasOwnProperty(e.key)) keys[e.key] = false;
});

window.startGame = function() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    canvas.width = initialMaze[0].length * tileSize;
    canvas.height = initialMaze.length * tileSize;

    document.getElementById('cat-meme-container').classList.add('hidden');
    document.getElementById('cat-meme-img').src = '';

    resetGameData();
    isPlaying = true;
    requestAnimationFrame(update);
}

function resetGameData() {
    maze = JSON.parse(JSON.stringify(initialMaze));
    totalPills = 0;
    
    for(let r=0; r<maze.length; r++) {
        for(let c=0; c<maze[r].length; c++) {
            if(maze[r][c] === 0) totalPills++;
            if(maze[r][c] === 2) {
                player.x = c * tileSize + tileSize/2;
                player.y = r * tileSize + tileSize/2;
                player.vx = 0;
                player.vy = 0;
            }
        }
    }
    document.getElementById('pill-score').innerText = `Pills Remaining: ${totalPills}`;
}

function update() {
    if (!isPlaying) return;

    let nextVx = 0;
    let nextVy = 0;
    
    if (keys.ArrowUp || keys.w) { nextVy = -player.speed; player.angle = Math.PI * 1.5; }
    if (keys.ArrowDown || keys.s) { nextVy = player.speed; player.angle = Math.PI * 0.5; }
    if (keys.ArrowLeft || keys.a) { nextVx = -player.speed; player.angle = Math.PI; }
    if (keys.ArrowRight || keys.d) { nextVx = player.speed; player.angle = 0; }

    let futureX = player.x + nextVx;
    let futureY = player.y + nextVy;
    
    let l = futureX - player.size;
    let r = futureX + player.size;
    let t = futureY - player.size;
    let b = futureY + player.size;

    let tlCol = Math.floor(l / tileSize);
    let tlRow = Math.floor(t / tileSize);
    let brCol = Math.floor(r / tileSize);
    let brRow = Math.floor(b / tileSize);

    let collision = false;
    for(let row = tlRow; row <= brRow; row++) {
        for(let col = tlCol; col <= brCol; col++) {
            if(maze[row] && maze[row][col] === 1) collision = true;
        }
    }

    if (!collision) {
        player.x = futureX;
        player.y = futureY;
        player.vx = nextVx;
        player.vy = nextVy;
    } else {
        futureX = player.x + player.vx;
        futureY = player.y + player.vy;
        l = futureX - player.size;
        r = futureX + player.size;
        t = futureY - player.size;
        b = futureY + player.size;
    
        tlCol = Math.floor(l / tileSize);
        tlRow = Math.floor(t / tileSize);
        brCol = Math.floor(r / tileSize);
        brRow = Math.floor(b / tileSize);
        
        collision = false;
        for(let row = tlRow; row <= brRow; row++) {
            for(let col = tlCol; col <= brCol; col++) {
                if(maze[row] && maze[row][col] === 1) collision = true;
            }
        }
        if(!collision) {
            player.x = futureX;
            player.y = futureY;
        }
    }

    // Pill eating
    let centerRow = Math.floor(player.y / tileSize);
    let centerCol = Math.floor(player.x / tileSize);
    
    if (maze[centerRow][centerCol] === 0) {
        maze[centerRow][centerCol] = 2; // Empty
        totalPills--;
        document.getElementById('pill-score').innerText = `Pills Remaining: ${totalPills}`;
        
        if (totalPills <= 0) {
            triggerVictory();
            return;
        }
    }

    // Mouth animation
    if(player.vx !== 0 || player.vy !== 0) {
        player.mouthOpen += 0.05 * player.mouthDir;
        if(player.mouthOpen > 0.4 || player.mouthOpen < 0) {
            player.mouthDir *= -1;
        }
    } else {
        player.mouthOpen = 0.2; 
    }

    draw();
    gameLoop = requestAnimationFrame(update);
}

function draw() {
    ctx.fillStyle = '#0a0a1e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Maze
    for(let r=0; r<maze.length; r++) {
        for(let c=0; c<maze[r].length; c++) {
            if(maze[r][c] === 1) {
                ctx.fillStyle = '#00f3ff';
                ctx.fillRect(c * tileSize, r * tileSize, tileSize, tileSize);
                ctx.fillStyle = '#0a0a1e';
                ctx.fillRect(c * tileSize + 4, r * tileSize + 4, tileSize - 8, tileSize - 8);
            } else if (maze[r][c] === 0) {
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(c * tileSize + tileSize/2, r * tileSize + tileSize/2, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // Draw Doctor PacMan
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.angle);
    
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(0, 0, player.size, player.mouthOpen * Math.PI, (2 - player.mouthOpen) * Math.PI);
    ctx.lineTo(0,0);
    ctx.fill();

    // Stereoscope (Doctor accessory)
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(-2, 0, player.size + 2, 0, Math.PI, true);
    ctx.stroke();
    
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-player.size - 2, -4, 3, 0, Math.PI*2);
    ctx.arc(-player.size - 2, 4, 3, 0, Math.PI*2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(player.size - 2, -player.size - 4, 4, 0, Math.PI*2);
    ctx.fillStyle = '#cccccc';
    ctx.fill();
    ctx.strokeStyle = '#222';
    ctx.stroke();

    ctx.restore();
}

async function triggerVictory() {
    isPlaying = false;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#0f0';
    ctx.font = '30px Space Mono';
    ctx.textAlign = 'center';
    ctx.fillText("Virus clear! Fetching Cat...", canvas.width/2, canvas.height/2);

    try {
        const res = await fetch('https://api.thecatapi.com/v1/images/search');
        const data = await res.json();
        const imgEl = document.getElementById('cat-meme-img');
        imgEl.onload = () => {
            document.getElementById('cat-meme-container').classList.remove('hidden');
        };
        imgEl.src = data[0].url;
    } catch (e) {
        console.error("Cat API fail", e);
    }
}
