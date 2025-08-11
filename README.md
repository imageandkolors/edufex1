# Pixel RPG - A Vanilla JS Game Scaffold

This project is a lightweight, single-player RPG scaffold built with vanilla HTML, CSS, and JavaScript. It provides a foundation for building a more complex game, with placeholder systems for all the core features of a classic RPG.

## How to Run

Because the game loads data from local JSON files using the `fetch` API, you cannot simply open `index.html` directly in your browser due to Cross-Origin (CORS) security policies. You need to serve the files from a simple local web server.

**Easy Method (using VS Code):**
1.  Install the "Live Server" extension in Visual Studio Code.
2.  Open the project folder in VS Code.
3.  Right-click on `index.html` in the file explorer and select "Open with Live Server".

**Python Method:**
1. Make sure you have Python installed.
2. Open a terminal or command prompt in the project's root directory.
3. Run one of the following commands (depending on your Python version):
   - **Python 3:** `python -m http.server`
   - **Python 2:** `python -m SimpleHTTPServer`
4. Open your web browser and navigate to `http://localhost:8000`.

## How to Customize

The game is designed to be data-driven. You can easily modify the game's content by editing the JSON files in the `assets/data/` directory.

-   **`classes.json`**: Defines the player classes. You can change their base stats (hp, mana, attack, etc.) and their unique abilities.
-   **`enemies.json`**: Defines the enemy types. You can adjust their stats, the XP and gold they drop, and their AI behavior flags.
-   **`items.json`**: Contains all game items, sorted by category (weapons, armor, consumables). You can add new items or change existing ones.
-   **`quests.json`**: Defines the game's quests. Each quest has objectives (e.g., kill X enemies) and rewards (xp, gold, items).

## Project Structure

-   **`index.html`**: The main entry point. Contains the game canvas and all the UI panels (HUD, inventory, etc.).
-   **`style.css`**: Contains all the styles for the game's UI.
-   **`game.js`**: The heart of the project. It contains all the game logic, organized into managers and classes:
    -   **`Game`**: The main game object that orchestrates everything.
    -   **`Input`**: A simple handler for keyboard input.
    -   **`UIManager`**: Manages showing, hiding, and updating the HTML UI.
    -   **`Player` / `World`**: Classes for the player character and the game world.
    -   **Managers (`Inventory`, `Quest`, `Save`, `Combat`)**: Placeholder objects that manage specific game systems.
-   **`assets/`**: Contains all game assets.
    -   `data/`: The customizable JSON files.
    -   `images/`: Placeholder for sprite images. See the "Image Assets" section below for details on the expected formats.
    -   `sfx/`: Placeholder for sound effects.

### Image Assets (`assets/images/`)
The game is configured to use 32x32 pixel sprites. You can replace the placeholder PNG files in this directory with your own art.

-   **`player_spritesheet.png`**: This is the spritesheet for the player character. The animation system expects a specific layout:
    -   It should contain 4 rows, one for each direction.
    -   **Row 0 (top row):** Walking Down
    -   **Row 1:** Walking Left
    -   **Row 2:** Walking Right
    -   **Row 3 (bottom row):** Walking Up
    -   Each row should have multiple frames for the walking animation. The system is currently configured for a 4-frame animation cycle (e.g., Idle, Walk1, Walk2, Walk3).
    -   Therefore, the ideal spritesheet image should be **128px wide** (4 frames * 32px) and **128px high** (4 directions * 32px).

-   **`wall.png`, `floor.png`, `goblin.png`**: These are static 32x32 sprites for world tiles and enemies.
