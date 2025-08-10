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
    const UIManager = {
        elements: {},
        init() {
            this.elements = {
                playerLevel: document.getElementById('player-level'),
                hpBar: document.getElementById('hp-bar'),
                manaBar: document.getElementById('mana-bar'),
                playerGold: document.getElementById('player-gold'),
                currentQuest: document.getElementById('current-quest'),
                inventoryScreen: document.getElementById('inventory-screen'),
                questLog: document.getElementById('quest-log'),
                inventoryList: document.getElementById('inventory-list'),
                questList: document.getElementById('quest-list'),
                inventoryButton: document.getElementById('inventory-button'),
                questsButton: document.getElementById('quests-button'),
                closeButtons: document.querySelectorAll('.close-button'),
            };
            this.elements.inventoryButton.addEventListener('click', () => this.togglePanel('inventoryScreen'));
            this.elements.questsButton.addEventListener('click', () => this.togglePanel('questLog'));
            this.elements.closeButtons.forEach(btn => {
                btn.addEventListener('click', () => this.hidePanel(btn.dataset.target));
            });
        },
        update(player) {
            this.elements.playerLevel.textContent = player.level;
            this.elements.playerGold.textContent = player.gold;
            const hpPercent = (player.stats.hp / player.baseStats.hp) * 100;
            const manaPercent = (player.stats.mana / player.baseStats.mana) * 100;
            this.elements.hpBar.style.width = `${hpPercent}%`;
            this.elements.manaBar.style.width = `${manaPercent}%`;
            const activeQuest = player.quests.find(q => q.status === 'active');
            this.elements.currentQuest.textContent = activeQuest ? activeQuest.title : 'None';
        },
        togglePanel(panelId) { this.elements[panelId]?.classList.toggle('hidden'); },
        hidePanel(panelId) { this.elements[panelId]?.classList.add('hidden'); }
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
                x: player.x, y: player.y, level: player.level, gold: player.gold,
                stats: player.stats, inventory: player.inventory, quests: player.quests
            };
            localStorage.setItem(this.saveKey, JSON.stringify(saveData));
            alert("Game Saved!");
        },
        load() {
            const savedData = localStorage.getItem(this.saveKey);
            return savedData ? JSON.parse(savedData) : null;
        }
    };

    // --- COMBAT MANAGER (Placeholder) ---
    const CombatManager = {
        startCombat(player, enemyId) {
            alert(`Combat started with an enemy of type: ${enemyId}!`);
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

    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = (err) => reject(`Failed to load image: ${src}`);
            img.src = src;
        });
    }

    // --- ENEMY CLASS ---
    class Enemy {
        constructor(x, y, enemyData) {
            this.x = x;
            this.y = y;
            this.size = 32;
            this.stats = { ...enemyData.stats };
            this.name = enemyData.name;
            this.id = enemyData.id;
        }

        draw(ctx, images) {
            const sprite = images[this.id];
            if (sprite) {
                ctx.drawImage(sprite, this.x, this.y, this.size, this.size);
            } else {
                ctx.fillStyle = 'magenta'; // Use a bright color for missing sprites
                ctx.fillRect(this.x, this.y, this.size, this.size);
            }
        }
    }

    // --- WORLD CLASS ---
    class World {
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
            if (tileY < 0 || tileY >= this.tileMap.length || tileX < 0 || tileX >= this.tileMap[0].length) return true;
            return this.tileMap[tileY][tileX] === 1;
        }
        draw(ctx, images) {
            for (let row = 0; row < this.tileMap.length; row++) {
                for (let col = 0; col < this.tileMap[row].length; col++) {
                    ctx.drawImage(images.floor, col * this.tileSize, row * this.tileSize, this.tileSize, this.tileSize);
                    if (this.tileMap[row][col] === 1) {
                        ctx.drawImage(images.wall, col * this.tileSize, row * this.tileSize, this.tileSize, this.tileSize);
                    }
                }
            }
        }
    }

    // --- PLAYER CLASS ---
    class Player {
        constructor(classData) {
            this.x = 64; this.y = 64; this.size = 28; this.speed = 150;
            this.name = classData.name;
            this.baseStats = { ...classData.stats }; this.stats = { ...classData.stats };
            this.level = 1; this.gold = 25;
            this.inventory = [{ id: 'health_potion', quantity: 3 }];
            this.quests = [{ id: 'q1_tutorial', status: 'active' }];
        }
        update(deltaTime, world) {
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
                if (!world.isSolid(this.x + moveX, this.y) && !world.isSolid(this.x + moveX + this.size, this.y + this.size) && !world.isSolid(this.x + moveX, this.y + this.size) && !world.isSolid(this.x + moveX + this.size, this.y)) this.x += moveX;
                if (!world.isSolid(this.x, this.y + moveY) && !world.isSolid(this.x + this.size, this.y + moveY + this.size) && !world.isSolid(this.x, this.y + moveY + this.size) && !world.isSolid(this.x + this.size, this.y + moveY)) this.y += moveY;
            }
        }
        draw(ctx, images) {
            ctx.drawImage(images.player, this.x, this.y, this.size, this.size);
        }
    }

    // --- MAIN GAME OBJECT ---
    const Game = {
        canvas: null, ctx: null, lastTime: 0,
        world: null, player: null,
        enemies: [],
        images: {},
        data: {},
        assetsLoaded: false,

        init() {
            this.canvas = document.getElementById('game-canvas');
            this.ctx = this.canvas.getContext('2d');
            this.resizeCanvas();
            window.addEventListener('resize', () => this.resizeCanvas());
            Input.init(); UIManager.init();
            console.log("Initializing game...");

            this.loadAssets().then(() => {
                if (!this.assetsLoaded) return;
                this.world = new World();
                this.player = new Player(this.data.classes[0]);
                this.spawnEnemies();
                InventoryManager.render(this.player, this.data.items);
                QuestManager.render(this.player, this.data.quests);
                document.getElementById('save-button').addEventListener('click', () => this.saveGame());
                document.getElementById('load-button').addEventListener('click', () => this.loadGame());
                this.gameLoop(0);
            });
        },

        spawnEnemies() {
            this.enemies = [];
            const goblinData = this.data.enemies.find(e => e.id === 'goblin');
            if (goblinData) {
                this.enemies.push(new Enemy(160, 160, goblinData));
                this.enemies.push(new Enemy(320, 96, goblinData));
                this.enemies.push(new Enemy(224, 224, goblinData));
            }
            console.log(`${this.enemies.length} enemies spawned.`);
        },

        async loadAssets() {
            console.log("Loading assets...");
            const dataPaths = {
                classes: 'assets/data/classes.json', enemies: 'assets/data/enemies.json',
                items: 'assets/data/items.json', quests: 'assets/data/quests.json',
            };
            const imagePaths = {
                player: 'assets/images/player.png', wall: 'assets/images/wall.png',
                floor: 'assets/images/floor.png', goblin: 'assets/images/goblin.png',
            };

            try {
                const dataPromises = Object.values(dataPaths).map(path => fetch(path).then(res => res.json()));
                const imagePromises = Object.values(imagePaths).map(loadImage);

                const [jsonData, imageData] = await Promise.all([
                    Promise.all(dataPromises), Promise.all(imagePromises)
                ]);

                Object.keys(dataPaths).forEach((key, i) => { this.data[key] = jsonData[i]; });
                Object.keys(imagePaths).forEach((key, i) => { this.images[key] = imageData[i]; });

                console.log("All assets loaded successfully.");
                this.assetsLoaded = true;
            } catch (error) {
                console.error("Error loading assets:", error);
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.fillStyle = 'red';
                this.ctx.font = '14px "Courier New"';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('Error loading assets. See console (F12) for details.', this.canvas.width / 2, this.canvas.height / 2);
            }
        },

        saveGame() { SaveManager.save(this.player); },
        loadGame() {
            const loadedData = SaveManager.load();
            if (loadedData) {
                Object.assign(this.player, loadedData);
                InventoryManager.render(this.player, this.data.items);
                QuestManager.render(this.player, this.data.quests);
                alert("Game Loaded!");
            } else {
                alert("No save data found!");
            }
        },

        gameLoop(timestamp) {
            const deltaTime = (timestamp - this.lastTime) || 0;
            this.lastTime = timestamp;
            this.update(deltaTime);
            this.draw();
            requestAnimationFrame((ts) => this.gameLoop(ts));
        },

        update(deltaTime) {
            if (!this.assetsLoaded) return;
            this.player.update(deltaTime, this.world);
            UIManager.update(this.player);
        },

        draw() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            if (this.assetsLoaded) {
                this.world.draw(this.ctx, this.images);
                this.player.draw(this.ctx, this.images);
                this.enemies.forEach(enemy => {
                    enemy.draw(this.ctx, this.images);
                });
            }
        },

        resizeCanvas() {
            const container = document.getElementById('game-container');
            this.canvas.width = container.clientWidth;
            this.canvas.height = container.clientHeight;
            if (this.ctx && this.assetsLoaded) { this.draw(); }
        }
    };

    Game.init();
});
