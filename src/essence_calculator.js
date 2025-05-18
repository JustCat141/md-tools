
const animatedBeerCount = 60;

let data;

fetch('data.json')
    .then(response => response.json())
    .then(json => {
        data = json;
        const mapSelect = document.getElementById('map');
        data.levels.forEach(level => {
            const option = document.createElement('option');
            option.value = level.level;
            option.textContent = `${level.level} - ${level.name}`;
            mapSelect.appendChild(option);
        });
    });

function calculateResult() {
    const beerAmount = parseFloat(document.getElementById('beerAmount').value) || 0;
    const selectedMapLevel = parseInt(document.getElementById('map').value);
    const difficulty = document.getElementById('difficulty').value;
    const vipActive = document.getElementById('vipPass').checked;
    const eventMultiplier = parseFloat(document.getElementById('event').value) || 0;
    const levelKey = document.getElementById('level').value;

    if (!data) return;

    const levelData = data.levels.find(l => l.level === selectedMapLevel);
    const dropChance = data.dropChance[levelKey] || 0.8;
    const beerRequired = levelData.beerRequired + ((levelKey === 'lvl-b1' || levelKey === 'lvl-b2') ? 1 : 0);

    let essencePerBeer = 0;

    if (levelKey === 'lvl-b1' || levelKey === 'lvl-b2') {
        essencePerBeer = levelData[`b_diff_${difficulty}`];
    } else {
        essencePerBeer = levelData[`diff_${difficulty}`];
    }

    console.log(levelData);

    let baseValue = Math.floor(beerAmount / beerRequired) * essencePerBeer * dropChance;

    let multiplier = 1;
    if (vipActive) {
        multiplier = 1.05;
    }

    multiplier += eventMultiplier;

    baseValue *= multiplier;

    const finalValue = Math.ceil(baseValue);
    let duration = Math.min(400, finalValue * 2);
    let resultEl = document.getElementById('result');
    animateCountUp(0, finalValue, duration, resultEl);
}

function createBeer(index) {
    const beer = document.createElement('div');
    beer.className = 'beer-float';
    beer.textContent = '🍺';
    beer.style.top = (Math.random() * window.innerHeight) + 'px';
    beer.style.left = (Math.random() * window.innerWidth) + 'px';
    beer.style.fontSize = (12 + Math.random() * 18) + 'px';
    beer.style.opacity = 0.1 + Math.random() * 0.3;
    beer.style.animationDuration = (20 + Math.random() * 40) + 's';
    beer.style.animationDelay = (Math.random() * -60) + 's';
    document.body.appendChild(beer);
}

for (let i = 0; i < animatedBeerCount; i++) {
    createBeer(i);
}

function animateCountUp(start, end, duration, element) {
    let range = end - start;
    if (range === 0) {
        element.textContent = end.toLocaleString('en-US') + ' essence';
        return;
    }
    let minTimer = 20;
    let stepTime = Math.max(Math.floor(duration / range), minTimer);
    let startTime = new Date().getTime();
    let endTime = startTime + duration;
    function run() {
        let now = new Date().getTime();
        let remaining = Math.max((endTime - now) / duration, 0);
        let value = Math.round(end - (remaining * range));
        element.textContent = value.toLocaleString('en-US') + ' essence';
        if (value === end) return;
        requestAnimationFrame(run);
    }
    run();
}