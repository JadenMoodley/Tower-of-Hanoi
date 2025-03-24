let woodTexture = null;
let camY = -350;
let numMoves = 0;
let numDisks = parseInt(localStorage.getItem("numDisks")) || 7;
let towers = [];
let selectedDisk = null;
let label, timerLabel;
let confettiPieces = [];
let startTime;
const diskHeight = 25;
const numConfetti = 1000;
const colors = ["red", "orange", "yellow", "green", "blue", "purple", "brown"]; 
let movingDisk = null;
let targetPos = null;

function preload() {
    woodTexture = loadImage("images/wood.png");
}

function setup() {
    createCanvas(920, 600, WEBGL);
    noStroke();
    cursor(CROSS);

    label = createP("");
    label.position(20, 10);

    timerLabel = createP("Time: 0s");
    timerLabel.position(20, 40);

    resetGame();
}

function resetGame() {
    numMoves = 0;
    selectedDisk = 0;
    confettiPieces = [];
    startTime = millis(); 

    towers = [[], [], []];
    for (let i = 0; i < numDisks; i++) {
        towers[0][i] = numDisks - i;
    }
}

function draw() {
    background(255);
    let x = min(abs(camY / 2), frameCount * 3);
    let z = height / 1.5 + min(600, frameCount * 10);
    camera(x, camY, z, 0, 0, 0, 0, 1, 0);

    let targetMoves = pow(2, numDisks) - 1;
    label.html(`${numMoves} of ${targetMoves} moves`);

    let elapsedTime = floor((millis() - startTime) / 1000);
    timerLabel.html(`Time: ${elapsedTime}s`);

    ambientLight(40);
    pointLight(color("white"), 200, -200, 0);
    directionalLight(color("white"), 0, 0, -1);

    drawTowers();
    drawDisks();
    animateMove();

    for (let c of confettiPieces) {
        c.update();
        c.display();
    }
}

function drawTowers() {
    push();
    translate(0, 150, 0);
    rotateX(HALF_PI);
    texture(woodTexture);
    box(850, 300, 20);
    pop();

    for (let i = 0; i < 3; i++) {
        push();
        translate(i * 250 - 250, 0, 0);
        fill("silver");
        shininess(100);
        specularMaterial("silver");
        cylinder(10, 300);
        pop();
    }
}

function drawDisks() {
    for (let i = 0; i < towers.length; i++) {
        for (let j = 0; j < towers[i].length; j++) {
            let diskSize = towers[i][j];
            let x = (i - 1) * 250;
            let y = -j * (diskHeight * 1.8) + 120;
            drawDisk(diskSize, x, y);
        }
    }
}

function drawDisk(size, x, y) {
    push();
    if (size === selectedDisk) stroke("aqua");
    else noStroke();
    translate(x, y, 0);
    rotateX(HALF_PI);
    fill(colors[size - 1]);
    torus(size * 15, 25);
    pop();
}

function animateMove() {
    if (movingDisk && targetPos) {
        let dx = (targetPos.x - movingDisk.x) * 0.1;
        let dy = (targetPos.y - movingDisk.y) * 0.1;

        movingDisk.x += dx;
        movingDisk.y += dy;

        if (abs(dx) < 1 && abs(dy) < 1) {
            movingDisk = null;
            targetPos = null;
        }
    }
}

function mousePressed() {
  if (selectedDisk == null) return resetGame();

  let selectedTower;
  let x = map(mouseX, 0, width, -width / 2, width / 2);
  if (x < -100) selectedTower = 0;
  else if (x > 100) selectedTower = 2;
  else selectedTower = 1;

  if (selectedDisk === 0) {
      
      if (towers[selectedTower].length > 0) {
          selectedDisk = towers[selectedTower].at(-1);
      }
  } else {
      let topDisk = towers[selectedTower].at(-1);
      
      // Check if move is valid (either tower is empty or disk is smaller)
      if (topDisk == null || topDisk > selectedDisk) {
          for (let i = 0; i < towers.length; i++) {
              if (towers[i].includes(selectedDisk)) {
                  towers[i].pop();
                  break;
              }
          }
          
          towers[selectedTower].push(selectedDisk);
          selectedDisk = 0;
          numMoves++; //  Count only valid moves
      } else {
          selectedDisk = 0; // Drop selection if move is invalid
      }
  }

  if (towers[2].length == numDisks) {
      selectedDisk = null;
      saveToLeaderboard();
      createEndGameUI();
      for (let i = 0; i < numConfetti; i++) {
          confettiPieces.push(new Confetti());
      }
  }
}


// Confetti Class
class Confetti {
    constructor() {
        this.pos = createVector(
            random(-800 / 2, 800 / 2),
            random(-height / 2, -height / 4),
            random(-150, 150)
        );
        this.vel = createVector(0, random(2, 5), 0);
        this.acc = createVector(0, 0.05, 0);
        this.size = random(5, 10);
        this.color = color(random(colors));
        this.rotX = random(TWO_PI);
        this.rotY = random(TWO_PI);
        this.rotZ = random(TWO_PI);
    }

    update() {
        if (this.pos.y > 120) return;
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.rotX = random(TWO_PI);
        this.rotY = random(TWO_PI);
        this.rotZ = random(TWO_PI);
    }

    display() {
        push();
        translate(this.pos.x, this.pos.y, this.pos.z);
        rotateX(this.rotX);
        rotateY(this.rotY);
        rotateZ(this.rotZ);
        noStroke();
        fill(this.color);
        plane(this.size);
        pop();
    }
}

// Leaderboard 
function saveToLeaderboard() {
    let username = localStorage.getItem("username") || "Player";
    let numDisks = parseInt(localStorage.getItem("numDisks")) || numDisks;
    let timeTaken = (millis() - startTime) / 1000;

    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ name: username, time: timeTaken, moves: numMoves, disks: numDisks });

    leaderboard.sort((a, b) => a.time - b.time || a.moves - b.moves);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

function showLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    let message = "🏆 Leaderboard 🏆\n";

    leaderboard.forEach((entry, index) => {
        message += `${index + 1}. ${entry.name} - ${entry.time.toFixed(2)}s, Moves: ${entry.moves}, Disks: ${entry.disks}\n`;
    });

    alert(message);
}

function createEndGameUI() {
    let leaderboardBtn = createButton("View Leaderboard");
    leaderboardBtn.position(20, height - 50);
    leaderboardBtn.mousePressed(showLeaderboard);

    let menuBtn = createButton("Back to Menu");
    menuBtn.position(180, height - 50);
    menuBtn.mousePressed(() => window.location.href = "index.html");
}
