const fetchBtn = document.getElementById('fetch-btn');
const factText = document.getElementById('fact-text');
const aminoContainer = document.getElementById('amino-container');
const beakerLiquid = document.getElementById('beaker-liquid');
const rod = document.getElementById('rod');
const easterEgg = document.getElementById('easter-egg');

// Game UI elements
const enterGameBtn = document.getElementById('enter-game-btn');
const quitBtn = document.getElementById('quit-btn');
const gameUi = document.getElementById('game-ui');
const mainPanel = document.getElementById('main-panel');

const AMINO_ACIDS = [
    { name: "Alanine", cid: 5950 },
    { name: "Arginine", cid: 6322 },
    { name: "Asparagine", cid: 6267 },
    { name: "Aspartic Acid", cid: 5960 },
    { name: "Cysteine", cid: 5862 },
    { name: "Glutamic Acid", cid: 33032 },
    { name: "Glutamine", cid: 5961 },
    { name: "Glycine", cid: 750 },
    { name: "Histidine", cid: 6274 },
    { name: "Isoleucine", cid: 6306 },
    { name: "Leucine", cid: 6106 },
    { name: "Lysine", cid: 5962 },
    { name: "Methionine", cid: 6137 },
    { name: "Phenylalanine", cid: 6140 },
    { name: "Proline", cid: 614 },
    { name: "Serine", cid: 5951 },
    { name: "Threonine", cid: 6288 },
    { name: "Tryptophan", cid: 6305 },
    { name: "Tyrosine", cid: 6057 },
    { name: "Valine", cid: 6287 }
];

let spawnedAminos = new Set();
let allFacts = [];

async function loadFacts() {
    try {
        const res = await fetch('facts.json');
        allFacts = await res.json();
    } catch (e) {
        console.error("Fact loading failed", e);
        allFacts = ["Mitochondria is the powerhouse of the cell."]; 
    }
}

function getRandomColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 100%, 50%)`;
}

async function synthesize() {
    rod.classList.remove('stirring');
    void rod.offsetWidth;
    rod.classList.add('stirring');
    beakerLiquid.style.backgroundColor = getRandomColor();

    const randomFact = allFacts[Math.floor(Math.random() * allFacts.length)];
    factText.textContent = randomFact;

    spawnAminoAcid();
}

function spawnAminoAcid() {
    if (spawnedAminos.size >= AMINO_ACIDS.length) return;

    const unspawned = AMINO_ACIDS.filter(a => !spawnedAminos.has(a.name));
    const toSpawn = unspawned[Math.floor(Math.random() * unspawned.length)];
    spawnedAminos.add(toSpawn.name);

    const img = document.createElement('img');
    img.src = `https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=${toSpawn.cid}&t=l`;
    img.classList.add('floating-amino');
    img.title = toSpawn.name;

    const startX = Math.random() * 80;
    const startY = Math.random() * 80;
    const animDuration = 20 + Math.random() * 20;
    const animDelay = -(Math.random() * 30);

    img.style.left = `${startX}vw`;
    img.style.top = `${startY}vh`;
    img.style.animationDuration = `${animDuration}s`;
    img.style.animationDelay = `${animDelay}s`;

    aminoContainer.appendChild(img);

    if (spawnedAminos.size === AMINO_ACIDS.length) {
        setTimeout(() => easterEgg.classList.remove('hidden'), 1000);
    }
}

fetchBtn.addEventListener('click', synthesize);
loadFacts();

// Transition to Game
enterGameBtn.addEventListener('click', () => {
    mainPanel.classList.add('hidden');
    easterEgg.classList.add('hidden');
    gameUi.classList.remove('hidden');
    
    // Call startGame available in window via game.js
    if (typeof window.startGame === 'function') {
        window.startGame();
    }
});

// Quit Game back to Main State
quitBtn.addEventListener('click', () => {
    gameUi.classList.add('hidden');
    mainPanel.classList.remove('hidden');
    
    // Reset molecules allowing replay of the app loop
    spawnedAminos.clear();
    aminoContainer.innerHTML = '';
});
