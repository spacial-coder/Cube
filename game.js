const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: 50,
    y: 350,
    width: 20,
    height: 20,
    color: '#FFF',
    dx: 0,
    dy: 0,
    speed: 2,
    gravity: 0.5,
    jumpStrength: -10,
    onGround: false
};

const keys = {
    left: false,
    right: false,
    up: false
};

const levels = [
    [
        { x: 0, y: 380, width: 800, height: 20 },
        { x: 100, y: 300, width: 100, height: 20 },
        { x: 250, y: 250, width: 100, height: 20 },
        { x: 400, y: 200, width: 100, height: 20 },
        { x: 550, y: 150, width: 100, height: 20 }
    ],
    [
        { x: 0, y: 380, width: 800, height: 20 },
        { x: 150, y: 300, width: 100, height: 20 },
        { x: 300, y: 250, width: 100, height: 20 },
        { x: 450, y: 200, width: 100, height: 20 },
        { x: 600, y: 150, width: 100, height: 20 }
    ],
    [
        { x: 0, y: 380, width: 800, height: 20 },
        { x: 50, y: 320, width: 100, height: 20 },
        { x: 200, y: 280, width: 100, height: 20 },
        { x: 350, y: 240, width: 100, height: 20 },
        { x: 500, y: 200, width: 100, height: 20 }
    ],
    [
        { x: 0, y: 380, width: 800, height: 20 },
        { x: 0, y: 300, width: 50, height: 20 },
        { x: 100, y: 250, width: 50, height: 20 },
        { x: 200, y: 200, width: 50, height: 20 },
        { x: 300, y: 150, width: 50, height: 20 },
        { x: 400, y: 100, width: 50, height: 20 },
        { x: 500, y: 50, width: 50, height: 20 }
    ]
];

let currentLevel = 0;
let gameOver = false;

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawPlayer() {
    drawRect(player.x, player.y, player.width, player.height, player.color);
}

function drawPlatforms() {
    levels[currentLevel].forEach(platform => {
        drawRect(platform.x, platform.y, platform.width, platform.height, '#FFF');
    });
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updatePlayer() {
    if (keys.left) {
        player.dx = -player.speed;
    } else if (keys.right) {
        player.dx = player.speed;
    } else {
        player.dx = 0;
    }

    if (keys.up && player.onGround) {
        player.dy = player.jumpStrength;
        player.onGround = false;
    }

    player.dy += player.gravity;

    player.x += player.dx;
    player.y += player.dy;

    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.onGround = true;
    }

    levels[currentLevel].forEach(platform => {
        if (player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y < platform.y + platform.height &&
            player.y + player.height > platform.y) {

            if (player.dy > 0 && player.y + player.height - player.dy <= platform.y) {
                player.y = platform.y - player.height;
                player.dy = 0;
                player.onGround = true;
            }
        }
    });

    if (player.x > canvas.width) {
        currentLevel++;
        if (currentLevel >= levels.length) {
            gameOver = true;
        } else {
            player.x = 0;
            player.y = canvas.height - player.height;
            player.dy = 0;
            player.onGround = true;
        }
    }
}

function gameLoop() {
    if (gameOver) {
        alert("Congratulations! You've completed all levels.");
        return;
    }

    clearCanvas();
    drawPlatforms();
    drawPlayer();
    updatePlayer();

    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', function (e) {
    if (e.code === 'ArrowLeft') {
        keys.left = true;
    }
    if (e.code === 'ArrowRight') {
        keys.right = true;
    }
    if (e.code === 'Space') {
        keys.up = true;
    }
});

document.addEventListener('keyup', function (e) {
    if (e.code === 'ArrowLeft') {
        keys.left = false;
    }
    if (e.code === 'ArrowRight') {
        keys.right = false;
    }
    if (e.code === 'Space') {
        keys.up = false;
    }
});

gameLoop();
