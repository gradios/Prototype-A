const state = {
    player: {
        hp: 100,
        stamina: 50,
        maxStamina: 50,
        armor: 5,
        stats: { strength: 10, agility: 10 }
    },
    log: []
};

const rooms = {
    'start': {
        name: 'Abandoned Alleyway',
        description: 'A narrow, trash-strewn alley. Shadows loom.',
        exits: { 'east': 'street' },
        enemies: []
    },
    'street': {
        name: 'Main Street',
        description: 'A wide, cracked boulevard. Abandoned cars litter the way.',
        exits: { 'west': 'start', 'north': 'store' },
        enemies: [{ name: 'Scavenger', hp: 30, damage: 5 }]
    },
    'store': {
        name: 'Ruined Convenience Store',
        description: 'Broken glass covers the floor. Shelves are empty.',
        exits: { 'south': 'street' },
        enemies: []
    }
};

let currentRoomId = 'start';

function log(message) {
    const logDiv = document.getElementById('log-content');
    if (!logDiv) return;
    const entry = document.createElement('div');
    entry.textContent = `> ${message}`;
    logDiv.prepend(entry);
    state.log.push(message);
}

function updateStatsUI() {
    const statsDiv = document.getElementById('stats-content');
    if (!statsDiv) return;
    statsDiv.innerHTML = `
        <p>HP: ${state.player.hp}</p>
        <p>Stamina: ${state.player.stamina}/${state.player.maxStamina}</p>
        <p>Armor: ${state.player.armor}</p>
    `;
}

function updateMapUI() {
    const mapDiv = document.getElementById('map-content');
    if (!mapDiv) return;
    const room = rooms[currentRoomId];
    mapDiv.innerHTML = `
        <h3 class="room-name">${room.name}</h3>
        <p>${room.description}</p>
        <div class="exits">
            ${Object.entries(room.exits).map(([dir, target]) =>
                `<button onclick="move('${target}')">Move ${dir.toUpperCase()}</button>`
            ).join('')}
        </div>
    `;
}

function move(roomId) {
    currentRoomId = roomId;
    const room = rooms[currentRoomId];
    log(`Entered ${room.name}`);
    updateMapUI();
    checkCombat();
}

function checkCombat() {
    const room = rooms[currentRoomId];
    const combatDiv = document.getElementById('combat-content');
    if (!combatDiv) return;
    if (room.enemies && room.enemies.length > 0) {
        renderCombat(room.enemies[0]);
    } else {
        combatDiv.innerHTML = 'No immediate threats.';
    }
}

function renderCombat(enemy) {
    const combatDiv = document.getElementById('combat-content');
    if (!combatDiv) return;
    combatDiv.innerHTML = `
        <p>Target: ${enemy.name} (${enemy.hp} HP)</p>
        <button onclick="performAction('attack')">Attack (5 Stamina)</button>
        <button onclick="performAction('defend')">Defend (2 Stamina)</button>
    `;
}

function performAction(action) {
    if (state.player.stamina < 5) {
        log("Too tired for that action!");
        return;
    }

    if (action === 'attack') {
        state.player.stamina -= 5;
        const damage = state.player.stats.strength / 2;
        log(`You attack for ${damage} damage!`);
    } else if (action === 'defend') {
        state.player.stamina -= 2;
        log("You take a defensive stance.");
    }

    updateStatsUI();
    checkCombat();
}

// Initialize
log("System Initialized. Welcome to the Wasteland.");
updateStatsUI();
updateMapUI();
