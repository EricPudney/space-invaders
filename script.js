const canvas = document.getElementById("play-area");
const ctx = canvas.getContext("2d");
const currentscore = document.getElementById("score");

canvas.width = 1200;
canvas.height = 500;

let alienSpeed = 400;

let bulletFired = false;
let score = 0;
let scoreIncrement = 10;

const playericon = new Image();
playericon.src = "spaceship.svg";
playerXPos = 575;
playericon.addEventListener(
    "load",
    () => {
        ctx.drawImage(playericon, playerXPos, 460, 50, 30);
    },
    false,
);

const aliens = [ {alienXPos: 50, alienYPos: 10, isDead: false}, {alienXPos: 100, alienYPos: 10, isDead: false}, {alienXPos: 150, alienYPos: 10, isDead: false}, {alienXPos: 200, alienYPos: 10, isDead: false}, {alienXPos: 250, alienYPos: 10, isDead: false}, {alienXPos: 300, alienYPos: 10, isDead: false}, {alienXPos: 350, alienYPos: 10, isDead: false}, {alienXPos: 400, alienYPos: 10, isDead: false}, {alienXPos: 450, alienYPos: 10, isDead: false}, {alienXPos: 500, alienYPos: 10, isDead: false} ]

function spawnAliens() {
    for (let baddie of aliens) 
        if (baddie.isDead === false) {
        const newAlien = new Image();
        newAlien.src = "alien.svg";
        newAlien.addEventListener("load", () => {
            ctx.drawImage(newAlien, baddie.alienXPos, baddie.alienYPos, 30, 30);
        },
        false,
        );
    }
}

function moveAliensRight() {
    let moveAliensRt = setInterval(() => {
        ctx.clearRect(0, aliens[0].alienYPos - 1, canvas.width, 32);
        for (let baddie of aliens) {
            baddie.alienXPos += 10;
        }
        spawnAliens();
        if (aliens[9].alienXPos >= 1150) {
            ctx.clearRect(0, aliens[0].alienYPos - 1, canvas.width, 32);
            for (let baddie of aliens) {
                baddie.alienYPos += 30;
            }
            moveAliensLeft();
            clearInterval(moveAliensRt);
        }
        if (!checkWave) {
            clearInterval(moveAliensRt);
        }
    },
    alienSpeed)
}

function moveAliensLeft() {
    let moveAliensLt = setInterval(() => {
        ctx.clearRect(0, aliens[0].alienYPos - 1, canvas.width, 32);
        for (let baddie of aliens) {
            baddie.alienXPos -= 10;
        }
        spawnAliens();
        if (aliens[0].alienXPos <= 50) {
            ctx.clearRect(0, aliens[0].alienYPos - 1, canvas.width, 32);
            for (let baddie of aliens) {
                baddie.alienYPos += 30;
            }
            moveAliensRight();
            clearInterval(moveAliensLt);
        }
        if (!checkWave) {
            clearInterval(moveAliensLt);
        }
    },
    alienSpeed)
}

document.addEventListener("keydown", (event) => {
    if (event.key === "a") {
        moveLeft()
    }
    if (event.key === "d") {
        moveRight()
    }
    if (event.key === " ") {
        if (bulletFired === false) {
            fire();
            bulletFired = true;
            setTimeout(() => { bulletFired = false }, 1000)
        }
        else {
            return;
        }
    }
})

function moveRight() {
    ctx.clearRect(0, 450, canvas.width, 50);
    if (playerXPos >= canvas.width - 70) {
        playerXPos = canvas.width - 70;
        ctx.drawImage(playericon, playerXPos, 460, 50, 30);
    }
    else {
        playerXPos += 15;
        ctx.drawImage(playericon, playerXPos, 460, 50, 30);
    }
}

function moveLeft() {
    if (playerXPos <= 20) {
        playerXPos = 20;
        ctx.drawImage(playericon, playerXPos, 460, 50, 30);
    }
    else {
        ctx.clearRect(0, 450, canvas.width, 50);
        playerXPos -= 15;
        ctx.drawImage(playericon, playerXPos, 460, 50, 30);
    }
}

function fire() {
    const bullet = { x: playerXPos + 22, y: 440, width: 5, height: 15, speed: 10 };
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    const shot = setInterval(() => {
        ctx.clearRect(bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.y -= bullet.speed;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        for (invader of aliens) {
            if (!invader.isDead) {
            if (bullet.x > invader.alienXPos && bullet.x < (invader.alienXPos + 30) && bullet.y > invader.alienYPos && bullet.y < (invader.alienYPos + 30)) {
                invader.isDead = true;
                score += scoreIncrement;
                ctx.clearRect(invader.alienXPos, invader.alienYPos, 30, 30);
                ctx.clearRect(bullet.x, bullet.y, bullet.width, bullet.height);
                clearInterval(shot);
                updateScore();
                if (checkWave()) {
                    restart();
                }
                return;
            } 
        }
        }
        if (bullet.y <= -20) {
            clearInterval(shot);
        }
    }, 50)
}

function updateScore() {
    currentscore.innerText = "Score: " + score;
}

function checkWave() {
    for (let baddie of aliens) {
        if (!baddie.isDead) {
            return false;
        }
    }
    return true;
}

function restart() {
    for (let i=1; i<=aliens.length; i++) {
        aliens[i-1].isDead = false;
        aliens[i-1].alienXPos = (i*50);
        aliens[i-1].alienYPos = 10;
    }
    scoreIncrement += 10;
    alienSpeed -= 100;
    spawnAliens();
    moveAliensRight();
}

spawnAliens();
moveAliensRight();
updateScore();