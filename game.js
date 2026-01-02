// Game state
const gameState = {
    currentScene: 'start',
    inventory: [],
    gameOver: false
};

// Game scenes
const scenes = {
    start: {
        text: "You wake up in a luxurious hotel room in Dubai. The Burj Khalifa towers outside your window. You need to escape the room to catch your flight home, but the door is locked! You notice a safe, a desk, and a window with a beautiful view of the city.",
        choices: [
            { text: "Examine the safe", nextScene: 'safe' },
            { text: "Search the desk", nextScene: 'desk' },
            { text: "Look at the window", nextScene: 'window' }
        ]
    },
    safe: {
        text: "The safe has a 4-digit code lock. There's a note on top that says: 'The year Dubai hosted the World Expo.' You need to figure out the code.",
        choices: [
            { text: "Enter 2020", nextScene: 'safeFail' },
            { text: "Enter 2021", nextScene: 'safeSuccess' },
            { text: "Go back", nextScene: 'start' }
        ]
    },
    safeFail: {
        text: "The safe beeps angrily. Wrong code! You'll need to try again.",
        choices: [
            { text: "Try again", nextScene: 'safe' },
            { text: "Look elsewhere", nextScene: 'start' }
        ]
    },
    safeSuccess: {
        text: "Click! The safe opens. Inside you find a keycard and a map of Dubai. The keycard might be useful!",
        choices: [
            { text: "Take the keycard", nextScene: 'gotKeycard', item: 'keycard' },
            { text: "Take the map", nextScene: 'gotMap', item: 'map' }
        ]
    },
    gotKeycard: {
        text: "You take the keycard. It has a picture of the Burj Al Arab on it. This must be important!",
        choices: [
            { text: "Continue exploring", nextScene: 'start' }
        ]
    },
    gotMap: {
        text: "You take the map. It shows various landmarks in Dubai. Maybe it contains clues?",
        choices: [
            { text: "Continue exploring", nextScene: 'start' }
        ]
    },
    desk: {
        text: "You search the desk drawers. You find a notebook with cryptic notes about Dubai landmarks and a pen shaped like a palm tree.",
        choices: [
            { text: "Take the notebook", nextScene: 'gotNotebook', item: 'notebook' },
            { text: "Leave it and explore more", nextScene: 'start' }
        ]
    },
    gotNotebook: {
        text: "You take the notebook. It contains interesting facts about Dubai that might help you escape.",
        choices: [
            { text: "Continue exploring", nextScene: 'start' }
        ]
    },
    window: {
        text: "You look out the window. The view is breathtaking - you can see the Burj Khalifa, the Dubai Fountain, and the desert beyond. The window doesn't open, but you notice a reflection showing a door code reader.",
        choices: [
            { text: "Go to the door", nextScene: 'door' },
            { text: "Look elsewhere", nextScene: 'start' }
        ]
    },
    door: {
        text: "You approach the door. There's a keycard reader and below it, a riddle: 'I was scheduled for 2020, but the world had other plans. When did I finally shine in Dubai?'",
        choices: [
            { text: "Use keycard (if you have it)", nextScene: 'checkKeycard' },
            { text: "Go back", nextScene: 'start' }
        ]
    },
    checkKeycard: {
        text: "Checking your inventory...",
        choices: []
    }
};

// Initialize game
function initGame() {
    updateScene('start');
}

// Update scene
function updateScene(sceneId) {
    if (gameState.gameOver) return;
    
    gameState.currentScene = sceneId;
    const scene = scenes[sceneId];
    
    // Special handling for checkKeycard
    if (sceneId === 'checkKeycard') {
        if (gameState.inventory.includes('keycard')) {
            winGame();
        } else {
            updateScene('needKeycard');
        }
        return;
    }
    
    const storyText = document.getElementById('story-text');
    const choicesDiv = document.getElementById('choices');
    
    storyText.textContent = scene.text;
    choicesDiv.innerHTML = '';
    
    scene.choices.forEach(choice => {
        const button = document.createElement('button');
        button.className = 'choice-button';
        button.textContent = choice.text;
        button.onclick = () => handleChoice(choice);
        choicesDiv.appendChild(button);
    });
    
    updateInventoryDisplay();
}

// Handle choice
function handleChoice(choice) {
    if (choice.item && !gameState.inventory.includes(choice.item)) {
        gameState.inventory.push(choice.item);
    }
    updateScene(choice.nextScene);
}

// Update inventory display
function updateInventoryDisplay() {
    const inventoryItems = document.getElementById('inventory-items');
    inventoryItems.innerHTML = '';
    
    if (gameState.inventory.length === 0) {
        inventoryItems.textContent = 'Empty';
    } else {
        gameState.inventory.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'inventory-item';
            itemDiv.textContent = item;
            inventoryItems.appendChild(itemDiv);
        });
    }
}

// Win game
function winGame() {
    gameState.gameOver = true;
    const storyText = document.getElementById('story-text');
    const choicesDiv = document.getElementById('choices');
    const statusDiv = document.getElementById('game-status');
    
    storyText.textContent = "You swipe the keycard and hear a satisfying click! The door opens. You've escaped the room! As you step out into the Dubai sunshine, you realize this was just a test from the hotel's new 'Escape Room Experience'. Congratulations, you've successfully escaped in Dubai!";
    choicesDiv.innerHTML = '';
    
    const restartButton = document.createElement('button');
    restartButton.className = 'choice-button';
    restartButton.textContent = 'Play Again';
    restartButton.onclick = () => {
        gameState.currentScene = 'start';
        gameState.inventory = [];
        gameState.gameOver = false;
        statusDiv.textContent = '';
        statusDiv.className = '';
        initGame();
    };
    choicesDiv.appendChild(restartButton);
    
    statusDiv.textContent = '🎉 Victory! You escaped! 🎉';
    statusDiv.className = 'success';
}

// Add missing scene
scenes.needKeycard = {
    text: "You don't have a keycard yet. You need to find it first by exploring the room.",
    choices: [
        { text: "Continue exploring", nextScene: 'start' }
    ]
};

// Start the game when page loads
window.onload = initGame;
