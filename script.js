// Atom data (Elements 1-30)
const atoms = [
    { name: "Hydrogen", symbol: "H", number: 1, valency: 1, weight: 1.008, color: "#ff6b6b" },
    { name: "Helium", symbol: "He", number: 2, valency: 0, weight: 4.002, color: "#4ecdc4" },
    { name: "Lithium", symbol: "Li", number: 3, valency: 1, weight: 6.941, color: "#ffcc00" },
    { name: "Beryllium", symbol: "Be", number: 4, valency: 2, weight: 9.012, color: "#96c93d" },
    { name: "Boron", symbol: "B", number: 5, valency: 3, weight: 10.81, color: "#45b7d1" },
    { name: "Carbon", symbol: "C", number: 6, valency: 4, weight: 12.01, color: "#ff9f1c" },
    { name: "Nitrogen", symbol: "N", number: 7, valency: 3, weight: 14.01, color: "#ff6b6b" },
    { name: "Oxygen", symbol: "O", number: 8, valency: 2, weight: 16.00, color: "#4ecdc4" },
    { name: "Fluorine", symbol: "F", number: 9, valency: 1, weight: 19.00, color: "#96c93d" },
    { name: "Neon", symbol: "Ne", number: 10, valency: 0, weight: 20.18, color: "#ffcc00" },
    { name: "Sodium", symbol: "Na", number: 11, valency: 1, weight: 22.99, color: "#45b7d1" },
    { name: "Magnesium", symbol: "Mg", number: 12, valency: 2, weight: 24.31, color: "#ff9f1c" },
    { name: "Aluminum", symbol: "Al", number: 13, valency: 3, weight: 26.98, color: "#ff6b6b" },
    { name: "Silicon", symbol: "Si", number: 14, valency: 4, weight: 28.09, color: "#4ecdc4" },
    { name: "Phosphorus", symbol: "P", number: 15, valency: 5, weight: 30.97, color: "#96c93d" },
    { name: "Sulfur", symbol: "S", number: 16, valency: 2, weight: 32.06, color: "#ffcc00" },
    { name: "Chlorine", symbol: "Cl", number: 17, valency: 1, weight: 35.45, color: "#45b7d1" },
    { name: "Argon", symbol: "Ar", number: 18, valency: 0, weight: 39.95, color: "#ff9f1c" },
    { name: "Potassium", symbol: "K", number: 19, valency: 1, weight: 39.10, color: "#ff6b6b" },
    { name: "Calcium", symbol: "Ca", number: 20, valency: 2, weight: 40.08, color: "#4ecdc4" },
    { name: "Scandium", symbol: "Sc", number: 21, valency: 3, weight: 44.96, color: "#96c93d" },
    { name: "Titanium", symbol: "Ti", number: 22, valency: 4, weight: 47.87, color: "#ffcc00" },
    { name: "Vanadium", symbol: "V", number: 23, valency: 5, weight: 50.94, color: "#45b7d1" },
    { name: "Chromium", symbol: "Cr", number: 24, valency: 3, weight: 52.00, color: "#ff9f1c" },
    { name: "Manganese", symbol: "Mn", number: 25, valency: 2, weight: 54.94, color: "#ff6b6b" },
    { name: "Iron", symbol: "Fe", number: 26, valency: 3, weight: 55.85, color: "#4ecdc4" },
    { name: "Cobalt", symbol: "Co", number: 27, valency: 2, weight: 58.93, color: "#96c93d" },
    { name: "Nickel", symbol: "Ni", number: 28, valency: 2, weight: 58.69, color: "#ffcc00" },
    { name: "Copper", symbol: "Cu", number: 29, valency: 2, weight: 63.55, color: "#45b7d1" },
    { name: "Zinc", symbol: "Zn", number: 30, valency: 2, weight: 65.38, color: "#ff9f1c" }
];

let playerName = "";
let score = 0;
let gameActive = false;
let isPaused = false;
let atomInterval;
let speedMultiplier = 1.0;
let currentFibonacciIndex = 0;

const fibonacciIncrements = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89]; // % increases
const scoreThresholds = fibonacciIncrements.map((_, i) => (i + 1) * 50); // 50, 100, 150, 200, 250...

const gameContainer = document.getElementById("game-container");
const startScreen = document.getElementById("start-screen");
const gameOverScreen = document.getElementById("game-over-screen");
const pauseScreen = document.getElementById("pause-screen");
const inputName = document.getElementById("input-name");
const inputAtom = document.getElementById("input-atom");
const scoreDisplay = document.getElementById("score");
const levelDisplay = document.getElementById("level");
const levelUpDisplay = document.getElementById("level-up");
const finalScore = document.getElementById("final-score");
const bow = document.getElementById("bow");
const referenceLine = document.getElementById("reference-line");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const shareButton = document.getElementById("share-button");

function startGame() {
    playerName = inputName.value.trim() || "Player";
    startScreen.style.display = "none";
    inputAtom.style.display = "block";
    bow.style.display = "block";
    referenceLine.style.display = "block";
    inputAtom.focus();
    gameActive = true;
    isPaused = false;
    score = 0;
    speedMultiplier = 1.0;
    currentFibonacciIndex = 0;
    updateScore();
    updateLevel();
    spawnAtoms();
    inputAtom.addEventListener("input", () => {
        if (!isPaused) {
            bow.classList.add("pulling");
            setTimeout(() => bow.classList.remove("pulling"), 200);
            checkInput();
        }
    });
    document.addEventListener("keydown", handlePause);
}

function spawnAtoms() {
    atomInterval = setInterval(() => {
        if (!gameActive || isPaused) return;
        const atomData = atoms[Math.floor(Math.random() * atoms.length)];
        const atom = document.createElement("div");
        atom.classList.add("atom");
        atom.style.backgroundColor = atomData.color;
        atom.style.width = "80px";
        atom.style.height = "80px";
        atom.style.left = `${Math.random() * (window.innerWidth - 80)}px`;
        atom.style.top = "-80px";
        atom.innerHTML = `#${atomData.number}<br>V:${atomData.valency}<br>W:${atomData.weight.toFixed(2)}`;
        atom.dataset.name = atomData.name.toLowerCase();
        atom.dataset.symbol = atomData.symbol.toLowerCase();
        atom.dataset.weight = atomData.weight;
        gameContainer.appendChild(atom);
        animateAtom(atom);
    }, 2000);
}

function animateAtom(atom) {
    let pos = -80;
    const baseSpeed = 1;
    const weightFactor = 1 - (atom.dataset.weight / 70);
    let fallSpeed = baseSpeed * weightFactor * speedMultiplier;
    const atomHeight = 80;
    const linePosition = window.innerHeight - 100;
    const animation = setInterval(() => {
        if (!gameActive || isPaused || !atom.parentElement) {
            clearInterval(animation);
            return;
        }
        pos += fallSpeed;
        atom.style.top = `${pos}px`;
        const atomBottom = pos + atomHeight;
        if (atomBottom >= linePosition && pos >= 0) {
            gameOver();
            clearInterval(animation);
            atom.remove();
        }
    }, 20);
}

function checkInput() {
    const input = inputAtom.value.trim().toLowerCase();
    const atomsOnScreen = document.querySelectorAll(".atom");
    atomsOnScreen.forEach(atom => {
        if (input === atom.dataset.name || input === atom.dataset.symbol) {
            shootArrow(atom);
            inputAtom.value = "";
        }
    });
}

function shootArrow(target) {
    const arrow = document.createElement("div");
    arrow.classList.add("arrow");
    arrow.style.left = `${target.offsetLeft + target.offsetWidth / 2}px`;
    arrow.style.bottom = "60px";
    gameContainer.appendChild(arrow);

    const arrowSpeed = 0.5;
    const distance = window.innerHeight - target.offsetTop - 60;
    const speedPxPerSec = window.innerHeight / arrowSpeed;
    const timeToHit = distance / speedPxPerSec * 1000;

    setTimeout(() => {
        if (target.parentElement) {
            target.classList.add("blast");
            setTimeout(() => {
                if (target.parentElement) {
                    target.remove();
                    score += 10;
                    updateScore();
                    checkSpeedIncrease();
                }
            }, 300);
            arrow.remove();
        }
    }, timeToHit);
}

function checkSpeedIncrease() {
    const nextThreshold = scoreThresholds[currentFibonacciIndex];
    if (score >= nextThreshold && currentFibonacciIndex < fibonacciIncrements.length) {
        const increase = fibonacciIncrements[currentFibonacciIndex] / 100 + 1;
        speedMultiplier *= increase;
        currentFibonacciIndex++;
        updateLevel();
        showLevelUp();
    }
}

function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

function updateLevel() {
    levelDisplay.textContent = `Level: ${currentFibonacciIndex}`;
}

function showLevelUp() {
    levelUpDisplay.textContent = `Level Up! Level ${currentFibonacciIndex}`;
    levelUpDisplay.classList.add("show");
    setTimeout(() => {
        levelUpDisplay.classList.remove("show");
    }, 2000);
}

function gameOver() {
    if (!gameActive) return;
    gameActive = false;
    clearInterval(atomInterval);
    inputAtom.style.display = "none";
    bow.style.display = "none";
    referenceLine.style.display = "none";
    gameOverScreen.style.display = "block";
    finalScore.textContent = `${playerName}, your score: ${score}`;
    document.querySelectorAll(".atom").forEach(atom => atom.remove());
    document.removeEventListener("keydown", handlePause);
}

function restartGame() {
    gameOverScreen.style.display = "none";
    inputAtom.value = "";
    startGame();
}

function shareScore() {
    const atomsHit = score / 10;
    const difficulty = currentFibonacciIndex;
    const shareText = `Atom Archer\n${playerName} blasted ${atomsHit} atoms!\nScore: ${score}\nDifficulty Level: ${difficulty}\nPlay at: [https://rajat-ed.github.io/atom-archer/]`;
    navigator.clipboard.writeText(shareText).then(() => {
        alert("Score copied to clipboard! Share it on social media!");
    });
}

function handlePause(event) {
    if (event.key === "Escape" && gameActive) {
        togglePause();
    }
}

function togglePause() {
    isPaused = !isPaused;
    pauseScreen.style.display = isPaused ? "block" : "none";
    if (!isPaused) {
        inputAtom.focus();
    }
}

// Event listeners
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);
shareButton.addEventListener("click", shareScore);
inputName.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        startGame();
    }
});
