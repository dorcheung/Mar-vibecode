const fetchBtn = document.getElementById('fetch-btn');
const headlineEl = document.getElementById('news-headline');
const summaryEl = document.getElementById('news-summary');
const citationEl = document.getElementById('news-citation');
const rollAnim = document.getElementById('roll-anim');
const timeEl = document.getElementById('time-container');

const easterEgg = document.getElementById('easter-egg');
const enterGameBtn = document.getElementById('enter-game-btn');
const quitBtn = document.getElementById('quit-btn');
const gameUi = document.getElementById('game-ui');
const mainPanel = document.getElementById('main-panel');

let newsItems = [];
let fetchCounter = 0;
const GAME_THRESHOLD = 4;

// Clock
setInterval(() => {
    const now = new Date();
    timeEl.innerHTML = now.toDateString() + "<br>" + now.toLocaleTimeString();
}, 1000);

// Load News via RSS to JSON proxy (BBC World News)
async function fetchRSSNews() {
    try {
        const RSS_URL = "http://feeds.bbci.co.uk/news/world/rss.xml";
        const API = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;
        const res = await fetch(API);
        const data = await res.json();
        if (data.status === 'ok') {
            newsItems = data.items;
            // Preload but don't display automatically to save the interaction for user
            headlineEl.textContent = "Standby Ready. Fetch below.";
            summaryEl.textContent = "Global relay online. Awaiting manual refresh to pull live data.";
            citationEl.textContent = "- BBC Terminal";
        }
    } catch (e) {
        console.error("News fetch failed", e);
        newsItems = [{
            title: "Global Relay Offline",
            description: "Unable to establish communication with news satellites. Please check network integrity and try again.",
            link: "http://bbc.co.uk"
        }];
    }
}

function extractThreeSentences(htmlString) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;
    let text = tempDiv.textContent || tempDiv.innerText || "";
    // Grab roughly 3 sentences (splitting loosely by period)
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    return sentences.slice(0, 3).join(" ");
}

function displayNews(item) {
    headlineEl.textContent = item.title;
    summaryEl.textContent = extractThreeSentences(item.description || item.content);
    
    let source = "BBC News";
    if (item.link) {
        try { source = new URL(item.link).hostname.replace('www.', ''); } catch(e){}
    }
    citationEl.textContent = `- ${source}`;
}

function getNewNews() {
    // Animation
    rollAnim.classList.remove('unrolling');
    void rollAnim.offsetWidth; // trigger reflow
    rollAnim.classList.add('unrolling');

    // Display
    if (newsItems.length > 0) {
        const item = newsItems[Math.floor(Math.random() * newsItems.length)];
        displayNews(item);
    }

    // Game Trigger
    fetchCounter++;
    if (fetchCounter >= GAME_THRESHOLD) {
        setTimeout(() => {
            easterEgg.classList.remove('hidden');
            mainPanel.classList.add('hidden'); // hide panel early to show egg alone
        }, 600);
    }
}

fetchBtn.addEventListener('click', getNewNews);
fetchRSSNews();

// Transition to Game
enterGameBtn.addEventListener('click', () => {
    easterEgg.classList.add('hidden');
    gameUi.classList.remove('hidden');
    
    // start game
    if (typeof window.startGame === 'function') {
        window.startGame();
    }
});

// Quit Game
quitBtn.addEventListener('click', () => {
    gameUi.classList.add('hidden');
    mainPanel.classList.remove('hidden');
    
    fetchCounter = 0;
    if (typeof window.stopGame === 'function') {
        window.stopGame();
    }
});
