let canvas = document.getElementById("play-area");
let ctx = canvas.getContext("2d");

canvas.width = 1200;
canvas.height = 500;

let alienSpeed = 1000;
let rowsMoved = 0;

let bulletFired = false;

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

const aliens = [ {alienXPos: 10, alienYPos: 10, isDead: false}, {alienXPos: 60, alienYPos: 10, isDead: false}, {alienXPos: 110, alienYPos: 10, isDead: false}, {alienXPos: 160, alienYPos: 10, isDead: false}, {alienXPos: 210, alienYPos: 10, isDead: false}, {alienXPos: 260, alienYPos: 10, isDead: false}, {alienXPos: 310, alienYPos: 10, isDead: false}, {alienXPos: 360, alienYPos: 10, isDead: false}, {alienXPos: 410, alienYPos: 10, isDead: false}, {alienXPos: 460, alienYPos: 10, isDead: false} ]

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
spawnAliens();

function moveAliensRight() {
    let moveAliensRt = setInterval(() => {
        for (let baddie of aliens) {
            ctx.clearRect(baddie.alienXPos, baddie.alienYPos, 31, 31);
            baddie.alienXPos += 10;
        }
        spawnAliens();
        if (aliens[9].alienXPos >= 1150) {
            clearInterval(moveAliensRt);
            for (let baddie of aliens) {
                ctx.clearRect(baddie.alienXPos, baddie.alienYPos, 31, 31);
                baddie.alienYPos += 30;
            }
            rowsMoved++;
            if (rowsMoved >= 3 && alienSpeed >= 100) {
                alienSpeed -= 50;
                rowsMoved = 0;
            }
            moveAliensLeft();
        }
    },
    alienSpeed)
}

function moveAliensLeft() {
    let moveAliensLt = setInterval(() => {
        for (let baddie of aliens) {
            ctx.clearRect(baddie.alienXPos, baddie.alienYPos, 31, 31);
            baddie.alienXPos -= 10;
        }
        spawnAliens();
        if (aliens[0].alienXPos <= 50) {
            clearInterval(moveAliensLt);
            for (let baddie of aliens) {
                ctx.clearRect(baddie.alienXPos, baddie.alienYPos, 31, 31);
                baddie.alienYPos += 30;
            }
            rowsMoved++;
            // aliens only speed up after moving right - see function above
            moveAliensRight();
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
    let bullet = { x: playerXPos + 22, y: 440, width: 5, height: 15, speed: 10 };
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    let shot = setInterval(() => {
        ctx.clearRect(bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.y -= bullet.speed;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        for (invader of aliens) {
            if (bullet.x > invader.alienXPos && bullet.x < (invader.alienXPos + 30) && bullet.y > invader.alienYPos && bullet.y < (invader.alienYPos + 30)) {
                invader.isDead = true;
                ctx.clearRect(invader.alienXPos, invader.alienYPos, 30, 30);
                ctx.clearRect(bullet.x, bullet.y, bullet.width, bullet.height);
                clearInterval(shot);
                return;
            } 
        }
        if (bullet.y <= -20) {
            clearInterval(shot);
        }
    }, 50)
}

moveAliensRight();