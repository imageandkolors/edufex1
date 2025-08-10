document.addEventListener('DOMContentLoaded', () => {

    // --- INPUT HANDLER ---
    const Input = {
        keys: {},
        init() {
            window.addEventListener('keydown', e => this.keys[e.code] = true);
            window.addEventListener('keyup', e => this.keys[e.code] = false);
        }
    };

    // --- UI MANAGER ---
    // Manages all interactions with the HTML UI elements.
    const UIManager = {
        elements: {},
        init() {
            this.elements = {
                // HUD
                playerLevel: document.getElementById('player-level'),
                hpBar: document.getElementById('hp-bar'),
                manaBar: document.getElementById('mana-bar'),
                playerGold: document.getElementById('player-gold'),
                currentQuest: document.getElementById('current-quest'),
                // Panels
                inventoryScreen: document.getElementById('inventory-screen'),
                questLog: document.getElementById('quest-log'),
                // Panel Content
                inventoryList: document.getElementById('inventory-list'),
                questList: document.getElementById('quest-list'),
                // Buttons
                inventoryButton: document.getElementById('inventory-button'),
                questsButton: document.getElementById('quests-button'),
                closeButtons: document.querySelectorAll('.close-button'),
            };
            this.elements.inventoryButton.addEventListener('click', () => this.togglePanel('inventoryScreen'));
            this.elements.questsButton.addEventListener('click', () => this.togglePanel('questLog'));
            this.elements.closeButtons.forEach(btn => {
                btn.addEventListener('click', () => this.hidePanel(btn.dataset.target));
            });
            console.log("UI Manager initialized.");
        },
        update(player) {
            this.elements.playerLevel.textContent = player.level;
            this.elements.playerGold.textContent = player.gold;
            // Update bars (assuming max stats are in player.baseStats)
            const hpPercent = (player.stats.hp / player.baseStats.hp) * 100;
            const manaPercent = (player.stats.mana / player.baseStats.mana) * 100;
            this.elements.hpBar.style.width = `${hpPercent}%`;
            this.elements.manaBar.style.width = `${manaPercent}%`;
            // Update current quest
            const activeQuest = player.quests.find(q => q.status === 'active');
            this.elements.currentQuest.textContent = activeQuest ? activeQuest.title : 'None';
        },
        togglePanel(panelId) {
            const panel = this.elements[panelId];
            if (panel) {
                panel.classList.toggle('hidden');
            }
        },
        hidePanel(panelId) {
             const panel = this.elements[panelId];
            if (panel) {
                panel.classList.add('hidden');
            }
        }
    };

    // --- INVENTORY MANAGER ---
    const InventoryManager = {
        render(player, itemsData) {
            const list = UIManager.elements.inventoryList;
            list.innerHTML = '';
            if (player.inventory.length === 0) {
                list.innerHTML = '<p>Your backpack is empty.</p>';
                return;
            }
            player.inventory.forEach(itemRef => {
                const item = findItem(itemRef.id, itemsData);
                if (item) {
                    const el = document.createElement('div');
                    el.textContent = `${item.name} (x${itemRef.quantity})`;
                    list.appendChild(el);
                }
            });
        }
    };

    // --- QUEST MANAGER ---
    const QuestManager = {
         render(player, questsData) {
            const list = UIManager.elements.questList;
            list.innerHTML = '';
             const activeQuests = player.quests.filter(q => q.status !== 'completed');
             if (activeQuests.length === 0) {
                 list.innerHTML = '<p>No active quests.</p>';
                 return;
             }
             activeQuests.forEach(questRef => {
                const quest = questsData.find(q => q.id === questRef.id);
                if (quest) {
                    const el = document.createElement('div');
                    el.innerHTML = `<h4>${quest.title}</h4><p>${quest.description}</p>`;
                    list.appendChild(el);
                }
             });
         }
    };

    // --- SAVE MANAGER ---
    const SaveManager = {
        saveKey: 'pixelRpgSaveData',
        save(player) {
            const saveData = {
                x: player.x,
                y: player.y,
                level: player.level,
                gold: player.gold,
                stats: player.stats,
                inventory: player.inventory,
                quests: player.quests
            };
            localStorage.setItem(this.saveKey, JSON.stringify(saveData));
            console.log("Game saved!", saveData);
            alert("Game Saved!");
        },
        load() {
            const savedData = localStorage.getItem(this.saveKey);
            if (savedData) {
                console.log("Save data found, loading.");
                return JSON.parse(savedData);
            }
            console.log("No save data found.");
            return null;
        }
    };

    // --- COMBAT MANAGER (Placeholder) ---
    const CombatManager = {
        startCombat(player, enemyId) {
            alert(`Combat started with an enemy of type: ${enemyId}!`);
            console.log(`Combat would start here between player and ${enemyId}.`);
        }
    };

    // --- UTILITY FUNCTIONS ---
    function findItem(itemId, itemsData) {
        for (const category in itemsData) {
            const item = itemsData[category].find(i => i.id === itemId);
            if (item) return item;
        }
        return null;
    }

    // --- WORLD CLASS ---
    class World { /* ... (unchanged) ... */
        constructor() {
            this.tileSize = 32;
            this.tileMap = [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
                [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
                [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
                [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 1],
                [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            ];
        }
        isSolid(x, y) {
            const tileX = Math.floor(x / this.tileSize);
            const tileY = Math.floor(y / this.tileSize);
            if (tileY < 0 || tileY >= this.tileMap.length || tileX < 0 || tileX >= this.tileMap[0].length) {
                return true;
            }
            return this.tileMap[tileY][tileX] === 1;
        }
        draw(ctx) {
            for (let row = 0; row < this.tileMap.length; row++) {
                for (let col = 0; col < this.tileMap[row].length; col++) {
                    const tile = this.tileMap[row][col];
                    ctx.fillStyle = tile === 1 ? '#4a4a4a' : '#8a8a8a';
                    ctx.fillRect(col * this.tileSize, row * this.tileSize, this.tileSize, this.tileSize);
                }
            }
        }
    }

    // --- PLAYER CLASS ---
    class Player {
        constructor(classData) {
            this.x = 64;
            this.y = 64;
            this.size = 28;
            this.speed = 150;
            this.name = classData.name;
            // Full stats for reference, current stats for gameplay
            this.baseStats = { ...classData.stats };
            this.stats = { ...classData.stats };
            this.level = 1;
            this.gold = 25;
            // Starting items and quests for the scaffold
            this.inventory = [{ id: 'health_potion', quantity: 3 }];
            this.quests = [{ id: 'q1_tutorial', status: 'active' }];
        }
        update(deltaTime, world) { /* ... (unchanged) ... */
            const moveSpeed = this.speed * (deltaTime / 1000);
            let dx = 0, dy = 0;
            if (Input.keys['KeyW'] || Input.keys['ArrowUp']) dy -= 1;
            if (Input.keys['KeyS'] || Input.keys['ArrowDown']) dy += 1;
            if (Input.keys['KeyA'] || Input.keys['ArrowLeft']) dx -= 1;
            if (Input.keys['KeyD'] || Input.keys['ArrowRight']) dx += 1;
            if (dx !== 0 || dy !== 0) {
                 const length = Math.sqrt(dx * dx + dy * dy);
                 const moveX = (dx / length) * moveSpeed;
                 const moveY = (dy / length) * moveSpeed;
                if (!world.isSolid(this.x + moveX, this.y) && !world.isSolid(this.x + moveX + this.size, this.y + this.size) && !world.isSolid(this.x + moveX, this.y + this.size) && !world.isSolid(this.x + moveX + this.size, this.y)) {
                    this.x += moveX;
                }
                if (!world.isSolid(this.x, this.y + moveY) && !world.isSolid(this.x + this.size, this.y + moveY + this.size) && !world.isSolid(this.x, this.y + moveY + this.size) && !world.isSolid(this.x + this.size, this.y + moveY)) {
                    this.y += moveY;
                }
            }
        }
        draw(ctx) { /* ... (unchanged) ... */
            ctx.fillStyle = '#f1c40f';
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }
    }

    // --- MAIN GAME OBJECT ---
    const Game = {
        // ... properties ...
        canvas: null, ctx: null, lastTime: 0,
        world: null, player: null,
        data: {},

        init() {
            this.canvas = document.getElementById('game-canvas');
            this.ctx = this.canvas.getContext('2d');
            this.resizeCanvas();
            window.addEventListener('resize', () => this.resizeCanvas());

            Input.init(); // Initialize input handler
            UIManager.init(); // Initialize UI manager

            console.log("Initializing game...");

            this.loadAssets().then(() => {
                console.log("Assets loaded.");
                this.world = new World();
                this.player = new Player(this.data.classes[0]); // Default to Warrior

                // Render initial UI state
                InventoryManager.render(this.player, this.data.items);
                QuestManager.render(this.player, this.data.quests);

                // Hook up save/load buttons
                document.getElementById('save-button').addEventListener('click', () => this.saveGame());
                document.getElementById('load-button').addEventListener('click', () => this.loadGame());

                this.gameLoop(0);
            });
        },

        saveGame() {
            SaveManager.save(this.player);
        },

        loadGame() {
            const loadedData = SaveManager.load();
            if (loadedData) {
                // Apply loaded data to the player object
                this.player.x = loadedData.x;
                this.player.y = loadedData.y;
                this.player.level = loadedData.level;
                this.player.gold = loadedData.gold;
                this.player.stats = loadedData.stats;
                this.player.inventory = loadedData.inventory;
                this.player.quests = loadedData.quests;
                // Re-render UI
                InventoryManager.render(this.player, this.data.items);
                QuestManager.render(this.player, this.data.quests);
                alert("Game Loaded!");
            } else {
                alert("No save data found!");
            }
        },

        async loadAssets() { /* ... (unchanged) ... */
            const assetPaths = {
                classes: 'assets/data/classes.json',
                enemies: 'assets/data/enemies.json',
                items: 'assets/data/items.json',
                quests: 'assets/data/quests.json',
            };
            this.data = {};
            try {
                const responses = await Promise.all(Object.values(assetPaths).map(path => fetch(path)));
                const jsonData = await Promise.all(responses.map(res => res.json()));
                const keys = Object.keys(assetPaths);
                for (let i = 0; i < keys.length; i++) { this.data[keys[i]] = jsonData[i]; }
            } catch (error) { console.error("Error loading assets:", error); }
        },

        gameLoop(timestamp) {
            const deltaTime = (timestamp - this.lastTime) || 0;
            this.lastTime = timestamp;
            this.update(deltaTime);
            this.draw();
            requestAnimationFrame((ts) => this.gameLoop(ts));
        },

        update(deltaTime) {
            if (this.player && this.world) {
                this.player.update(deltaTime, this.world);
                UIManager.update(this.player);
            }
        },

        draw() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            if (this.world && this.player) {
                this.world.draw(this.ctx);
                this.player.draw(this.ctx);
            } else {
                this.ctx.fillStyle = 'white';
                this.ctx.font = '24px "Courier New"';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('Loading...', this.canvas.width / 2, this.canvas.height / 2);
            }
        },

        resizeCanvas() { /* ... (unchanged) ... */
            const container = document.getElementById('game-container');
            this.canvas.width = container.clientWidth;
            this.canvas.height = container.clientHeight;
            if (this.ctx) { this.draw(); }
        }
    };

    Game.init();
});
