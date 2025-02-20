window.addEventListener('load', () => { //Ensure that everything is loaded
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Ensure Canvas has the correct dimensions *before* drawing
    canvas.width = 800;
    canvas.height = 750;

    const inputField = document.getElementById('inputField');
    const scoreDisplay = document.getElementById('score');
    const livesDisplay = document.getElementById('livesDisplay');
    const gameOverCard = document.getElementById('gameOverCard');
    const finalScoreDisplay = document.getElementById('finalScore');
    const restartButton = document.getElementById('restartButton');

    let score = 0;
    let lives = 5;
    let atoms = [];
    let gameInterval;
    let baseSpeed = 1;
    let isPaused = false;
    const maxAtoms = 7;

    const elements = [
      { number: 1, symbol: 'H', name: 'Hydrogen', weight: 1.008, valency: 1, color: '#455A64', shape: 'circle' },
      { number: 2, symbol: 'He', name: 'Helium', weight: 4.0026, valency: 0, color: '#5D4037', shape: 'square' },
      { number: 3, symbol: 'Li', name: 'Lithium', weight: 6.94, valency: 1, color: '#2E7D32', shape: 'triangle' },
      { number: 4, symbol: 'Be', name: 'Beryllium', weight: 9.012182, valency: 2, color: '#0277BD', shape: 'rectangle' },
      { number: 5, symbol: 'B', name: 'Boron', weight: 10.81, valency: 3, color: '#F9A825', shape: 'pentagon' },
      { number: 6, symbol: 'C', name: 'Carbon', weight: 12.011, valency: 4, color: '#6A1B9A', shape: 'hexagon' },
      { number: 7, symbol: 'N', name: 'Nitrogen', weight: 14.007, valency: 3, color: '#880E4F', shape: 'star' },
      { number: 8, symbol: 'O', name: 'Oxygen', weight: 15.999, valency: 2, color: '#BF360C', shape: 'rhombus' },
      { number: 9, symbol: 'F', name: 'Fluorine', weight: 18.998403163, valency: 1, color: '#3E2723', shape: 'ellipse' },
      { number: 10, symbol: 'Ne', name: 'Neon', weight: 20.180, valency: 0, color: '#1A237E', shape: 'parallelogram' },
      { number: 11, symbol: 'Na', name: 'Sodium', weight: 22.990, valency: 1, color: '#00695C', shape: 'trapezoid' },
      { number: 12, symbol: 'Mg', name: 'Magnesium', weight: 24.305, valency: 2, color: '#263238', shape: 'octagon' },
      { number: 13, symbol: 'Al', name: 'Aluminum', weight: 26.9815384, valency: 3, color: '#424242', shape: 'decagon' },
      { number: 14, symbol: 'Si', name: 'Silicon', weight: 28.085, valency: 4, color: '#0D47A1', shape: 'septagon' },
      { number: 15, symbol: 'P', name: 'Phosphorus', weight: 30.973761998, valency: 3, color: '#B71C1C', shape: 'heart' },
      { number: 16, symbol: 'S', name: 'Sulfur', weight: 32.06, valency: 2, color: '#827717', shape: 'invtriangle' },
      { number: 17, symbol: 'Cl', name: 'Chlorine', weight: 35.45, valency: 1, color: '#E65100', shape: 'shield' },
      { number: 18, symbol: 'Ar', name: 'Argon', weight: 39.948, valency: 0, color: '#33691E', shape: 'invcircle' },
      { number: 19, symbol: 'K', name: 'Potassium', weight: 39.0983, valency: 1, color: '#8E24AA', shape: 'flower' },
      { number: 20, symbol: 'Ca', name: 'Calcium', weight: 40.078, valency: 2, color: '#1B5E20', shape: 'drop' },
      { number: 21, symbol: 'Sc', name: 'Scandium', weight: 44.955908, valency: 3, color: '#00838F', shape: 'infinity' },
      { number: 22, symbol: 'Ti', name: 'Titanium', weight: 47.867, valency: 4, color: '#311B92', shape: 'moon' },
      { number: 23, symbol: 'V', name: 'Vanadium', weight: 50.9415, valency: 5, color: '#3E5D4F', shape: 'cross' },
      { number: 24, symbol: 'Cr', name: 'Chromium', weight: 51.9961, valency: 6, color: '#9E9D24', shape: 'lightning' },
      { number: 25, symbol: 'Mn', name: 'Manganese', weight: 54.938044, valency: 7, color: '#D84315', shape: 'atom' },
      { number: 26, symbol: 'Fe', name: 'Iron', weight: 55.845, valency: 2, color: '#212121', shape: 'dice' },
      { number: 27, symbol: 'Co', name: 'Cobalt', weight: 58.933194, valency: 2, color: '#004D40', shape: 'molecule' },
      { number: 28, symbol: 'Ni', name: 'Nickel', weight: 58.6934, valency: 2, color: '#1A237E', shape: 'barcode' },
      { number: 29, symbol: 'Cu', name: 'Copper', weight: 63.546, valency: 2, color: '#263238', shape: 'radioactive' },
      { number: 30, symbol: 'Zn', name: 'Zinc', weight: 65.38, valency: 2, color: '#3E2723', shape: 'chess' }
    ];

    function startGame() {
        score = 0;
        lives = 5;
        atoms = [];
        baseSpeed = 1;
        isPaused = false;
        scoreDisplay.textContent = `Score: ${score}`;
        updateLivesDisplay();
        gameInterval = setInterval(gameLoop, 30);

        gameOverCard.style.display = 'none';
        inputField.disabled = false;
    }

    function updateLivesDisplay() {
        livesDisplay.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            const heart = document.createElement('div');
            heart.className = 'lifeHeart';
            if (i >= lives) {
                heart.style.opacity = '0.3';
            }
            livesDisplay.appendChild(heart);
        }
    }

    function getReadableTextColor(backgroundColor) {
        const r = parseInt(backgroundColor.slice(1, 3), 16);
        const g = parseInt(backgroundColor.slice(3, 5), 16);
        const b = parseInt(backgroundColor.slice(5, 7), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5 ? 'black' : 'white';
    }

    function createAtom() {
        if (atoms.length < 7) {
            const randomIndex = Math.floor(Math.random() * elements.length);
            const element = elements[randomIndex];
            const atom = {
                x: Math.random() * canvas.width,
                y: 0,
                element: element,
                speed: baseSpeed * (2 - (element.weight / 70)),
                color: element.color,
                textColor: '#FFFFFF',
                shape: element.shape
            };
            atoms.push(atom);
        }
    }

 function updateAtom(atom) {
        atom.y += atom.speed;
        if (atom.y > canvas.height) {
            lives--;
            updateLivesDisplay();

           return true
        }
          return false; // Atom is still in play
    }

    function renderAtom(atom) {
        const fontSize = 12;
        ctx.fillStyle = atom.color;
        ctx.beginPath();
        drawShape(ctx, atom.x, atom.y, atom.element.shape, 25);
        ctx.fill();

        ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.fillStyle = atom.textColor;
        ctx.textAlign = 'center';

        ctx.fillText(atom.element.number, atom.x, atom.y - fontSize);
        ctx.fillText(atom.element.weight.toFixed(2), atom.x, atom.y + fontSize);
        ctx.fillText(atom.element.valency, atom.x + 15, atom.y);

        ctx.closePath();
    }

    function drawShape(ctx, x, y, shape, size) {
        switch (shape) {
            case 'square':
                ctx.fillRect(x - size, y - size, 2 * size, 2 * size);
                break;
            case 'rectangle':
                ctx.fillRect(x - size - 10, y - size + 5, 2 * size + 20, 2 * size - 10);
                break;
            case 'triangle':
                ctx.moveTo(x, y - size);
                ctx.lineTo(x - size, y + size);
                ctx.lineTo(x + size, y + size);
                ctx.closePath();
                break;
            case 'rhombus':
                ctx.moveTo(x - size, y);
                ctx.lineTo(x, y - size);
                ctx.lineTo(x + size, y);
                ctx.lineTo(x, y + size);
                ctx.closePath();
                break;
            case 'ellipse':
                ctx.ellipse(x, y, size + 5, size - 5, 0, 0, 2 * Math.PI);
                break;
            case 'parallelogram':
                ctx.moveTo(x - size - 5, y - size + 5);
                ctx.lineTo(x + size + 5, y - size + 5);
                ctx.lineTo(x + size - 5, y + size - 5);
                ctx.lineTo(x - size -15, y + size - 5);
                ctx.closePath();
                break;
            case 'trapezoid':
                ctx.moveTo(x - size, y + size);
                ctx.lineTo(x + size, y + size);
                ctx.lineTo(x + size / 2, y - size);
                ctx.lineTo(x - size / 2, y - size);
                ctx.closePath();
                break;
            case 'octagon':
                const sides = 8;
                for (let i = 0; i < sides; i++) {
                    const angle = 2 * Math.PI / sides * i;
                    const xCoord = x + size * Math.cos(angle);
                    const yCoord = y + size * Math.sin(angle);
                    if (i === 0) {
                        ctx.moveTo(xCoord, yCoord);
                    } else {
                        ctx.lineTo(xCoord, yCoord);
                    }
                }
                ctx.closePath();
                break;
            case 'pentagon':
                const angleOffset = -Math.PI / 2; // To point the pentagon upwards
                for (let i = 0; i < 5; i++) {
                    const angle = 2 * Math.PI / 5 * i + angleOffset;
                    const xCoord = x + size * Math.cos(angle);
                    const yCoord = y + size * Math.sin(angle);
                    if (i === 0) {
                        ctx.moveTo(xCoord, yCoord);
                    } else {
                        ctx.lineTo(xCoord, yCoord);
                    }
                }
                ctx.closePath();
                break;
           case 'hexagon':
                for (let i = 0; i < 6; i++) {
                    const angle = 2 * Math.PI / 6 * i;
                    const xCoord = x + size * Math.cos(angle);
                    const yCoord = y + size * Math.sin(angle);
                    if (i === 0) {
                        ctx.moveTo(xCoord, yCoord);
                    } else {
                        ctx.lineTo(xCoord, yCoord);
                    }
                }
                ctx.closePath();
                break;
            case 'star':
                    const spikes = 5;
                    const outerRadius = size;
                    const innerRadius = size / 2;
                    let rot = Math.PI / 2 * 3;
                    let xCoord = x;
                    let yCoord = y;
                    let step = Math.PI / spikes;

                    ctx.moveTo(xCoord, yCoord - outerRadius)
                    for (i = 0; i < spikes; i++) {
                        xCoord = x + Math.cos(rot) * outerRadius;
                        yCoord = y + Math.sin(rot) * outerRadius;
                        ctx.lineTo(xCoord, yCoord)
                        rot += step

                        xCoord = x + Math.cos(rot) * innerRadius;
                        yCoord = y + Math.sin(rot) * innerRadius;
                        ctx.lineTo(xCoord, yCoord)
                        rot += step
                    }
                    ctx.lineTo(x, y - outerRadius);
                    ctx.closePath();
                    break;
             case 'shield':
                    ctx.moveTo(x, y - size); // Top point
                    ctx.lineTo(x + size, y);   // Right point
                    ctx.lineTo(x + size, y + size / 2);  // Bottom Right
                    ctx.quadraticCurveTo(x, y + size, x - size, y + size / 2);  // Bottom Curve
                    ctx.lineTo(x - size, y);  // Left Point
                    ctx.closePath();
                    break;
             case 'invtriangle':
                ctx.moveTo(x, y + size); //Top point
                ctx.lineTo(x - size, y - size);   // Right point
                ctx.lineTo(x + size, y - size);  // Bottom Right
                ctx.closePath();
                break;
             case 'invcircle':
                ctx.arc(x, y, size - 10, 0, Math.PI);
                break;
                // Add more shapes here
            default: // circle
                ctx.arc(x, y, size, 0, Math.PI * 2);
        }
    }

    function checkInput(input) {
        const lowerInput = input.toLowerCase();
        for (let i = 0; i < atoms.length; i++) {
            const atom = atoms[i];
            if (
                atom.element.name.toLowerCase() === lowerInput ||
                atom.element.symbol.toLowerCase() === lowerInput
            ) {
                handleHit(atom);
                return;
            }
        }
    }

    function handleHit(atom) {
        score += 10;
        scoreDisplay.textContent = `Score: ${score}`;
        createBlast(atom.x, atom.y, atom.color);
        atoms = atoms.filter(a => a !== atom);
        increaseDifficulty();
    }

    function increaseDifficulty() {
        if (score % 100 === 0 && score > 0) {
            baseSpeed *= 1.01;
            console.log("Speed increased to: " + baseSpeed);
        }
    }

    let blasts = [];

    function createBlast(x, y, color) {
        const blast = {
            x: x,
            y: y,
            color: color,
            size: 10,
            life: 10
        };
        blasts.push(blast);
    }

    function updateBlast(blast) {
        blast.size += 2;
        blast.life--;
    }

    function renderBlast(blast) {
        ctx.beginPath();
        ctx.arc(blast.x, blast.y, blast.size, 0, Math.PI * 2);
        ctx.fillStyle = blast.color;
        ctx.globalAlpha = blast.life / 10;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.closePath();
    }

   function gameLoop() {
    try {
        if (!isPaused) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (Math.random() < 0.02) {
                createAtom();
            }

            for (let i = 0; i < blasts.length; i++) {
                const blast = blasts[i];
                updateBlast(blast);
                renderBlast(blast);

                if (blast.life <= 0) {
                    blasts.splice(i, 1);
                    i--;
                }
            }

            for (let i = atoms.length - 1; i >= 0; i--) {
                const atom = atoms[i];
                const shouldDelete = updateAtom(atom);

                if (shouldDelete) {
                    atoms.splice(i, 1);
                }
            }

           if (lives <= 0) {
                endGame();
            }
        }
        }
         catch (e) {
             console.error("Game loop error:", e);
             clearInterval(gameInterval);
             alert("A critical error occurred. Please refresh the page.");
         }
}

    function endGame() {
        clearInterval(gameInterval);
        finalScoreDisplay.textContent = score;
        gameOverCard.style.display = 'block';
    }

    document.addEventListener('keydown', (event) => {
        if (inputField.disabled) return;

        if (event.key === 'Enter') {
            checkInput(inputField.value);
            inputField.value = '';
        }
        if (event.key === 'Escape') {
            isPaused = !isPaused;
            if (isPaused) {
                clearInterval(gameInterval);
            } else {
                gameInterval = setInterval(gameLoop, 30);
            }
        }
    });

    restartButton.addEventListener('click', () => {
        startGame();
    });

     function handleVisibilityChange() {
            if (document.hidden) {
                clearInterval(gameInterval);
            } else if(!isPaused && lives > 0){
                gameInterval = setInterval(gameLoop, 30);
            }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    function initialSetup() {
        //Explicitly set canvas dimensions
        canvas.width = 800;
        canvas.height = 750;

        //Initialize everything
        startGame();
    }

    initialSetup(); //Call the setup here.

});
