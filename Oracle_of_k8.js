<!DOCTYPE html>
<html lang="en" class="bg-stone-900 text-stone-300">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Oracle of K'ux</title>
    <!-- 1. Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- 2. three.js (3D Visualization) -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <!-- 3. tone.js (RTS Sonification) -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.7.77/Tone.js"></script>
    
    <style>
        /* Custom scrollbar for an "ancient" feel */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #1c1917; } /* bg-stone-900 */
        ::-webkit-scrollbar-thumb { background: #57534e; border-radius: 4px; } /* bg-stone-600 */
        ::-webkit-scrollbar-thumb:hover { background: #a8a29e; } /* bg-stone-400 */
        
        /* Base card styling (Magic Card Style) */
        .card {
            background-color: #292524; /* bg-stone-800 */
            border: 1px solid #44403c; /* bg-stone-700 */
            border-radius: 12px;
            overflow: hidden;
            transition: all 0.2s ease-in-out;
            font-family: 'Times New Roman', Times, serif;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        }
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 15px rgba(252, 211, 77, 0.1); /* amber-300 */
            border-color: #fcd34d; /* amber-300 */
        }
        .card-header {
            padding: 8px 12px;
            background-color: #1c1917; /* bg-stone-900 */
            border-bottom: 1px solid #44403c;
        }
        /* K'inich Glyph (Bone Code) */
        .card-art {
            font-family: 'Courier New', Courier, monospace;
            font-size: 10px;
            line-height: 1.1;
            padding: 8px;
            background: #1c1917;
            border-radius: 4px;
            margin: 8px;
            color: #7dd3fc; /* sky-300 */
            white-space: pre;
            text-align: center;
            border: 1px solid #44403c;
        }
        /* Constellation Key (TAQ Grid) */
        .card-taq-grid {
            display: grid;
            gap: 2px;
            margin: 8px;
            padding: 4px;
            background: #1c1917;
            border-radius: 4px;
        }
        .card-taq-tile {
            width: 100%;
            padding-bottom: 100%; /* Aspect ratio 1:1 */
            background-color: #3b82f6; /* blue-600 */
            opacity: 0.5;
        }
        .card-taq-tile.active {
            background-color: #fcd34d; /* amber-300 */
            opacity: 1;
        }
        .card-text {
            padding: 4px 12px;
            font-size: 14px;
            font-style: italic;
            background-color: rgba(0,0,0,0.2);
            border-top: 1px solid #44403c;
            color: #d6d3d1; /* stone-300 */
        }
        .card-button {
            background-color: #b45309; /* amber-700 */
            color: #fefce8; /* yellow-50 */
            padding: 8px 12px;
            width: 100%;
            font-weight: bold;
            transition: background-color 0.2s;
            text-align: center;
            cursor: pointer;
            font-family: sans-serif;
            font-size: 14px;
        }
        .card-button:hover {
            background-color: #92400e; /* amber-800 */
        }
        
        /* Major Glyphs Panel */
        .major-arcana-card {
            background-color: #44403c; /* bg-stone-700 */
            padding: 10px;
            border-radius: 8px;
            border: 1px solid #57534e; /* bg-stone-600 */
            cursor: pointer;
            transition: all 0.2s;
            font-family: 'Times New Roman', Times, serif;
        }
        .major-arcana-card:hover {
            background-color: #57534e;
            border-color: #fcd34d; /* amber-300 */
        }
        
        /* Main Oracle Tablet (TAQ Grid) */
        #taq-grid {
            display: grid;
            border: 2px solid #fcd34d; /* amber-300 */
            box-shadow: 0 0 20px rgba(252, 211, 77, 0.3);
            background: #0c0a09; /* stone-950 (Obsidian) */
        }
        .taq-tile {
            width: 100%;
            padding-bottom: 100%; /* Aspect ratio 1:1 */
            background-color: #0c4a6e; /* sky-900 */
            opacity: 0.3;
            transition: all 0.1s;
        }
        .taq-tile.active {
            background-color: #fcd34d; /* amber-300 (Glowing Gold) */
            opacity: 1;
            box-shadow: 0 0 10px #fcd34d;
        }
        .taq-tile:hover {
            background-color: #fefce8; /* yellow-50 */
            opacity: 0.8;
            cursor: pointer;
        }
    </style>
</head>
<body class="font-serif">
    
    <!-- Main Game Container -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 max-w-[1920px] mx-auto h-screen">
        
        <!-- Col 1: The Oracle Tablet (Board) -->
        <div class="lg:col-span-2 h-full flex flex-col p-4 bg-stone-800 rounded-lg shadow-lg overflow-hidden border border-stone-700">
            <h1 class="text-2xl font-bold text-amber-300 mb-4">Oracle Tablet (Live Starmap)</h1>
            <div id="taq-grid-container" class="flex-grow flex items-center justify-center">
                <div id="taq-grid" class="aspect-square w-full max-w-[80vh]">
                    <!-- Tiles go here -->
                </div>
            </div>
        </div>
        
        <!-- Col 2: Hand & Viz (Actions) -->
        <div class="h-full flex flex-col gap-4 overflow-hidden">
            <!-- Celestial Viz -->
            <div class="h-1/2 bg-stone-800 rounded-lg shadow-lg p-4 flex flex-col border border-stone-700">
                <h2 class="text-xl font-bold text-amber-300 mb-2">Celestial Viz (Pyramid Field)</h2>
                <div id="viz-canvas-container" class="flex-grow rounded-md overflow-hidden bg-black">
                    <!-- three.js canvas will be appended here -->
                </div>
            </div>
            
            <!-- Hand (Pyramid Echoes) -->
            <div class="h-1/2 bg-stone-800 rounded-lg shadow-lg p-4 flex flex-col border border-stone-700">
                <h2 class="text-xl font-bold text-amber-300 mb-2">Hand (Pyramid Echoes)</h2>
                <div id="hand-container" class="flex-grow overflow-y-auto space-y-4 pr-2">
                    <p class="text-stone-400">Scrying the Xibalba Archive...</p>
                </div>
            </div>
        </div>

        <!-- Col 3: System (Game State & Major Glyphs) -->
        <div class="h-full flex flex-col gap-4 overflow-hidden">
            <!-- Game State -->
            <div class="bg-stone-800 rounded-lg shadow-lg p-6 border border-stone-700">
                <h2 class="text-xl font-bold text-amber-300 mb-4">Oracle State</h2>
                <div classs="space-y-3">
                    <div>
                        <span class="text-stone-400">Alignment:</span>
                        <span id="resonance-score" class="text-2xl font-bold text-sky-300 float-right">0</span>
                    </div>
                    <div>
                        <span class="text-stone-400">Starlight (Ka):</span>
                        <span id="cycles" class="text-2xl font-bold text-sky-300 float-right">10</span>
                    </div>
                </div>
                <button id="end-turn-button" class="w-full bg-amber-500 text-stone-900 font-bold p-4 rounded-lg mt-6 shadow-lg transition hover:bg-amber-400 font-sans">
                    CONVERGE PATTERNS
                </button>
            </div>
            
            <!-- Major Glyphs -->
            <div class="bg-stone-800 rounded-lg shadow-lg p-4 flex-col flex-grow overflow-hidden border border-stone-700">
                <h2 class="text-xl font-bold text-amber-300 mb-4">Major Glyphs (System Powers)</h2>
                <div id="major-arcana-container" class="flex-grow overflow-y-auto space-y-3 pr-2">
                    <!-- Major Arcana cards will be dynamically generated here -->
                </div>
            </div>
        </div>
    </div>
    
    <!-- Message Modal -->
    <div id="message-modal" class="hidden fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 font-serif">
        <div class="bg-stone-800 p-8 rounded-lg shadow-2xl max-w-sm text-center border border-amber-300">
            <h3 id="message-title" class="text-2xl font-bold text-amber-300 mb-4"></h3>
            <p id="message-body" class="text-stone-300 mb-6"></p>
            <button id="message-close-button" class="bg-amber-500 text-stone-900 font-bold py-2 px-6 rounded-lg font-sans">Close</button>
        </div>
    </div>


    <!-- JavaScript Game Logic -->
    <script type="module">
        // === GAME STATE ===
        let gameState = {
            resonanceScore: 0,
            cycles: 10,
            gridSize: 20, // 20x20 grid
            grid: [], // 2D array [y][x]
            isSimulating: false,
        };
        
        // === MOCK DATABASE ===
        // This is our "Xibalba Archive" (Pinecone) mock. It stores past states.
        let pineconeDeck = [];

        // === DOM ELEMENTS ===
        const ui = {
            grid: document.getElementById('taq-grid'),
            handContainer: document.getElementById('hand-container'),
            majorArcanaContainer: document.getElementById('major-arcana-container'),
            score: document.getElementById('resonance-score'),
            cycles: document.getElementById('cycles'),
            endTurnButton: document.getElementById('end-turn-button'),
            modal: document.getElementById('message-modal'),
            modalTitle: document.getElementById('message-title'),
            modalBody: document.getElementById('message-body'),
            modalClose: document.getElementById('message-close-button'),
        };

        // === MAJOR ARCANA (SYSTEM CARDS) DECK ===
        const majorArcanaDeck = [
            { id: 0, name: "The Uncarved Stone", cost: 1, effect: "reseed", quip: "From the void, a new pattern." },
            { id: 1, name: "The World Tree (Yaxche)", cost: 20, effect: "evolve", quip: "The Loom weaves 1,000 futures." },
            { id: 2, name: "The Flood (Xibalba)", cost: 5, effect: "purge", quip: "The tablet is wiped clean by the waters." },
            { id: 3, name: "The Conch Resonator", cost: 3, effect: "sonify", quip: "The sound of the cosmos itself." },
        ];
        
        // === MOCK AUTOMATA (GAME OF LIFE) ===
        // This simulates the "World Loom"
        class Automata {
            constructor(grid) {
                this.grid = grid;
                this.size = grid.length;
            }
            
            step() {
                let newGrid = this.createEmptyGrid(this.size);
                let changes = 0;
                
                for (let y = 0; y < this.size; y++) {
                    for (let x = 0; x < this.size; x++) {
                        const neighbors = this.countNeighbors(y, x);
                        const isAlive = this.grid[y][x] === 1;
                        
                        // Game of Life rules
                        if (isAlive && (neighbors < 2 || neighbors > 3)) {
                            newGrid[y][x] = 0; // Die
                            changes++;
                        } else if (!isAlive && neighbors === 3) {
                            newGrid[y][x] = 1; // Born
                            changes++;
                        } else {
                            newGrid[y][x] = isAlive ? 1 : 0; // Stays same
                        }
                    }
                }
                this.grid = newGrid;
                return { newGrid, changes };
            }

            countNeighbors(y, x) {
                let count = 0;
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (i === 0 && j === 0) continue;
                        const newY = (y + i + this.size) % this.size;
                        const newX = (x + j + this.size) % this.size;
                        count += this.grid[newY][newX];
                    }
                }
                return count;
            }
            
            createEmptyGrid(size) {
                return Array(size).fill(0).map(() => Array(size).fill(0));
            }

            // "Embeds" the grid into a single number for comparison
            embed() {
                return this.grid.flat().reduce((a, b) => a + b, 0); // Simple "live cell" count
            }
            
            // Calculates "Alignment" (score)
            calculateResonance(changes) {
                const liveCells = this.embed();
                // We reward "stable" or "oscillating" states, not chaos.
                const stabilityBonus = Math.max(0, 100 - (changes * 10));
                const complexityBonus = liveCells * 5;
                return Math.max(0, stabilityBonus + complexityBonus);
            }
        }
        
        // === VIZ MODULE (three.js) ===
        class Viz {
            constructor(container) {
                this.container = container;
                this.scene = new THREE.Scene();
                this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
                this.renderer = new THREE.WebGLRenderer({ antialias: true });
                this.renderer.setSize(container.clientWidth, container.clientHeight);
                container.appendChild(this.renderer.domElement);
                
                this.gridSize = 0;
                this.pyramids = []; // 2D array of THREE.Mesh
                
                this.camera.position.z = 20;
                this.camera.position.y = 15;
                this.camera.lookAt(0, 0, 0);

                const light = new THREE.DirectionalLight(0xffffff, 1);
                light.position.set(5, 10, 7.5);
                this.scene.add(light);
                this.scene.add(new THREE.AmbientLight(0x999999));
                
                // Add a "desert floor"
                const floorGeo = new THREE.PlaneGeometry(50, 50);
                const floorMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.8 });
                const floor = new THREE.Mesh(floorGeo, floorMat);
                floor.rotation.x = -Math.PI / 2;
                floor.position.y = -0.5;
                this.scene.add(floor);
                
                window.addEventListener('resize', () => this.onResize());
                this.animate();
            }

            onResize() {
                this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
            }

            animate() {
                requestAnimationFrame(() => this.animate());
                this.scene.rotation.y += 0.002;
                this.renderer.render(this.scene, this.camera);
            }

            initGrid(gridSize) {
                this.gridSize = gridSize;
                // Use CylinderGeometry to make a 4-sided pyramid
                const geometry = new THREE.CylinderGeometry(0, 0.5, 1, 4); 
                
                for (let y = 0; y < gridSize; y++) {
                    this.pyramids[y] = [];
                    for (let x = 0; x < gridSize; x++) {
                        const material = new THREE.MeshStandardMaterial({ 
                            color: 0x0c4a6e, // sky-900
                            transparent: true,
                            opacity: 0.3,
                            roughness: 0.5,
                            metalness: 0.1
                        });
                        const pyramid = new THREE.Mesh(geometry, material);
                        pyramid.position.set(
                            x - gridSize / 2 + 0.5,
                            0,
                            y - gridSize / 2 + 0.5
                        );
                        this.scene.add(pyramid);
                        this.pyramids[y][x] = pyramid;
                    }
                }
            }

            update(grid) {
                if (this.gridSize === 0) this.initGrid(grid.length);

                for (let y = 0; y < this.gridSize; y++) {
                    for (let x = 0; x < this.gridSize; x++) {
                        const isAlive = grid[y][x] === 1;
                        const pyramid = this.pyramids[y][x];
                        
                        // Animate height and appearance
                        pyramid.material.opacity = isAlive ? 1.0 : 0.3;
                        pyramid.material.color.set(isAlive ? 0xfcd34d : 0x0c4a6e); // amber-300 : sky-900
                        
                        // Make active pyramids "float" and glow
                        pyramid.material.emissive.set(isAlive ? 0xfcd34d : 0x000000);
                        pyramid.position.y = isAlive ? 0.5 : 0;
                    }
                }
            }
        }
        
        // === RTS MODULE (The Conch Resonator) ===
        class RTS {
            constructor() {
                // Use FMSynth for a more mystical, bell-like or flute-like tone
                this.synth = new Tone.PolySynth(Tone.FMSynth, {
                    harmonicity: 3,
                    modulationIndex: 10,
                    envelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.2 }
                }).toDestination();
                
                this.filter = new Tone.AutoFilter("4n").toDestination().start();
                this.synth.connect(this.filter);
                
                // Use a Pentatonic (ancient) scale
                this.notes = ["C3", "D3", "E3", "G3", "A3", "C4", "D4", "E4", "G4", "A4"];
                this.loop = new Tone.Pattern((time, note) => {
                    this.synth.triggerAttackRelease(note, "8n", time);
                }, this.notes, "random");
                this.loop.interval = "8n";
                
                Tone.Transport.start();
            }
            
            start() {
                Tone.Transport.start();
                this.loop.start(0);
            }
            
            stop() {
                this.loop.stop(0);
            }
            
            // Update sound based on grid state
            update(grid) {
                const liveCells = grid.flat().reduce((a, b) => a + b, 0);
                const maxCells = grid.length * grid.length;
                const density = liveCells / maxCells;
                
                this.filter.frequency.value = (density * 500) + 100;
                this.loop.interval = (1.0 - density) * 0.5 + 0.125 + "n";
            }
        }

        // === CYBERLOOM (MAIN GAME LOGIC) ===
        // This is the "Star-Priest's" main logic
        class Cyberloom {
            constructor() {
                this.automata = new Automata(this.createEmptyGrid(gameState.gridSize));
                gameState.grid = this.automata.grid;
                
                this.viz = new Viz(document.getElementById('viz-canvas-container'));
                this.rts = new RTS();
                
                this.initBoard();
                this.initMajorArcana();
                this.bindEvents();
                
                this.showMessage("Oracle Online", "Welcome, Star-Priest. The Oracle of K'ux awaits your guidance. Press 'CONVERGE PATTERNS' to begin.");
            }

            initBoard() {
                ui.grid.innerHTML = '';
                ui.grid.style.gridTemplateColumns = `repeat(${gameState.gridSize}, 1fr)`;
                
                for (let y = 0; y < gameState.gridSize; y++) {
                    for (let x = 0; x < gameState.gridSize; x++) {
                        const tile = document.createElement('div');
                        tile.classList.add('taq-tile');
                        tile.dataset.y = y;
                        tile.dataset.x = x;
                        if (gameState.grid[y][x] === 1) tile.classList.add('active');
                        
                        tile.addEventListener('click', () => this.onTileClick(y, x));
                        ui.grid.appendChild(tile);
                    }
                }
                this.viz.update(gameState.grid);
            }
            
            initMajorArcana() {
                ui.majorArcanaContainer.innerHTML = '';
                for (const card of majorArcanaDeck) {
                    const cardEl = document.createElement('div');
                    cardEl.className = "major-arcana-card";
                    cardEl.innerHTML = `
                        <div class="font-bold text-amber-300">${card.name}</div>
                        <div class="text-sm text-stone-400 italic mb-2">"${card.quip}"</div>
                        <div class="text-right font-bold text-sky-300">Cost: ${card.cost} Starlight</div>
                    `;
                    cardEl.addEventListener('click', () => this.playMajorArcana(card));
                    ui.majorArcanaContainer.appendChild(cardEl);
                }
            }
            
            bindEvents() {
                ui.endTurnButton.addEventListener('click', () => this.runTurn());
                ui.modalClose.addEventListener('click', () => ui.modal.classList.add('hidden'));
            }
            
            // --- Game Loop Phases ---
            
            async runTurn() {
                if (gameState.isSimulating) return;
                
                // 1. RESOLUTION PHASE (Convergence)
                await this.runSimulation();
                
                // 2. DRAW PHASE (Scrying)
                this.drawHand();
                
                // 3. START PHASE (Gather Starlight)
                this.updateCycles(10); // Gain 10 Starlight
                
                this.updateUI();
                
                if (gameState.resonanceScore >= 1000000) {
                    this.showMessage("ALIGNMENT ACHIEVED", `You have harmonized the Oracle! Final Alignment: ${gameState.resonanceScore}. The cosmos is in balance.`);
                    this.rts.stop();
                }
            }
            
            async runSimulation() {
                gameState.isSimulating = true;
                ui.endTurnButton.disabled = true;
                ui.endTurnButton.textContent = "CONVERGING...";
                this.rts.start();
                
                let totalResonance = 0;
                let totalChanges = 0;
                
                for (let i = 0; i < 100; i++) {
                    const { newGrid, changes } = this.automata.step();
                    gameState.grid = newGrid;
                    totalChanges += changes;
                    
                    if (i % 5 === 0) { 
                        this.viz.update(gameState.grid);
                        this.rts.update(gameState.grid);
                        this.renderGrid();
                        await new Promise(res => setTimeout(res, 20)); 
                    }
                }
                
                this.viz.update(gameState.grid);
                this.rts.update(gameState.grid);
                this.renderGrid();
                
                // 4. SCORING PHASE
                const turnResonance = this.automata.calculateResonance(totalChanges);
                this.updateScore(gameState.resonanceScore + turnResonance);
                
                // 5. SAVING PHASE (Record in Xibalba)
                this.saveToPinecone(gameState.grid, turnResonance);
                
                gameState.isSimulating = false;
                ui.endTurnButton.disabled = false;
                ui.endTurnButton.textContent = "CONVERGE PATTERNS";
            }
            
            drawHand() {
                ui.handContainer.innerHTML = '';
                const currentEmbedding = this.automata.embed();
                
                if (pineconeDeck.length === 0) {
                     ui.handContainer.innerHTML = '<p class="text-stone-400">The Xibalba Archive is empty. Converge patterns to create Echoes.</p>';
                     return;
                }
                
                const sortedDeck = [...pineconeDeck].sort((a, b) => {
                    const diffA = Math.abs(a.embedding - currentEmbedding);
                    const diffB = Math.abs(b.embedding - currentEmbedding);
                    return diffA - diffB;
                });
                
                const hand = sortedDeck.slice(0, 5);
                
                for (const cardData of hand) {
                    this.renderCard(cardData);
                }
            }
            
            // --- Actions ---
            
            onTileClick(y, x) {
                if (gameState.isSimulating) return;
                if (gameState.cycles < 1) {
                    this.showMessage("No Starlight", "You need 1 Starlight to inscribe the Tablet.");
                    return;
                }
                
                this.updateCycles(gameState.cycles - 1);
                
                gameState.grid[y][x] = gameState.grid[y][x] === 1 ? 0 : 1;
                this.automata.grid = gameState.grid; 
                
                this.renderTile(y, x);
                this.viz.update(gameState.grid);
            }

            playMajorArcana(card) {
                if (gameState.isSimulating) return;
                if (gameState.cycles < card.cost) {
                    this.showMessage("Not Enough Starlight", `You need ${card.cost} Starlight to invoke ${card.name}.`);
                    return;
                }
                this.updateCycles(gameState.cycles - card.cost);
                
                switch (card.effect) {
                    case "reseed":
                        gameState.grid = this.createRandomGrid(gameState.gridSize);
                        this.automata.grid = gameState.grid;
                        this.showMessage("The Uncarved Stone", "The Tablet has been re-seeded from a new pattern.");
                        break;
                    case "evolve":
                        this.showMessage("The World Tree", "The Loom will weave an extra 1000 cycles at the end of this turn. (Effect stub)");
                        break;
                    case "purge":
                        gameState.grid = this.createEmptyGrid(gameState.gridSize);
                        this.automata.grid = gameState.grid;
                        this.showMessage("The Flood", "The Tablet is wiped clean by the waters of Xibalba.");
                        break;
                    case "sonify":
                        this.rts.start();
                        this.showMessage("The Conch Resonator", "The sacred conch sounds the note of the cosmos.");
                        break;
                }
                
                this.renderGrid();
                this.viz.update(gameState.grid);
            }
            
            playMinorArcana(cardData) {
                if (gameState.isSimulating) return;
                if (gameState.cycles < cardData.cost) {
                    this.showMessage("Not Enough Starlight", `You need ${cardData.cost} Starlight to channel this Echo.`);
                    return;
                }
                this.updateCycles(gameState.cycles - cardData.cost);
                
                // "Imprint this Constellation Key"
                const layout = cardData.taqLayout;
                const center = Math.floor(gameState.gridSize / 2) - 2;
                
                for (let y = 0; y < layout.length; y++) {
                    for (let x = 0; x < layout.length; x++) {
                        const gridY = center + y;
                        const gridX = center + x;
                        if (gridY >= 0 && gridY < gameState.gridSize && gridX >= 0 && gridX < gameState.gridSize) {
                            if (layout[y][x] === 1) { 
                                gameState.grid[gridY][x] = 1;
                            }
                        }
                    }
                }
                
                this.automata.grid = gameState.grid;
                this.renderGrid();
                this.viz.update(gameState.grid);
                this.showMessage("Echo Channeled", `Echo ${cardData.id} has been imprinted on the live Tablet.`);
            }

            // --- Utility & Helpers ---
            
            saveToPinecone(grid, resonance) {
                if (resonance < 100) return; 
                
                const newId = pineconeDeck.length;
                const embedding = this.automata.embed();
                
                const cardData = {
                    id: newId,
                    name: `Echo #${newId}`,
                    type: this.getCardType(resonance),
                    cost: Math.max(1, Math.floor(resonance / 100)),
                    boneCode: this.generateBoneCode(embedding),
                    taqLayout: this.generateTaqLayout(grid), // 5x5 snapshot
                    quip: this.generateQuip(resonance, embedding),
                    embedding: embedding
                };
                
                pineconeDeck.push(cardData);
            }
            
            getCardType(resonance) {
                if (resonance > 1000) return "Celestial Mandate";
                if (resonance > 500) return "Complex Starship";
                if (resonance > 200) return "Stable Constellation";
                return "Whisper from Xibalba";
            }
            
            // New "K'inich Glyph" (Bone Code) generator
            generateBoneCode(embedding) {
                let art = "";
                const chars = [' ', '.', ':', '~', '|', 'O', '[]'];
                for (let i = 0; i < 5; i++) {
                    let line = "";
                    for (let j = 0; j < 11; j++) {
                        const hash = Math.sin(embedding * (i * 11) + j) * 10000;
                        const charIndex = (Math.abs(hash) % chars.length);
                        line += chars[charIndex] || ' ';
                    }
                    art += line + "\n";
                }
                return art;
            }

            generateTaqLayout(grid) {
                // Take a 5x5 snapshot from the center
                const layout = this.createEmptyGrid(5);
                const center = Math.floor(gameState.gridSize / 2) - 2;
                for (let y = 0; y < 5; y++) {
                    for (let x = 0; x < 5; x++) {
                         layout[y][x] = grid[center+y]?.[center+x] || 0;
                    }
                }
                return layout;
            }

            generateQuip(resonance, embedding) {
                if (resonance > 1000) return "A perfect alignment. The cosmos sings.";
                if (embedding > 200) return "The sky was filled with starships.";
                if (embedding < 50) return "A memory from the First Sun.";
                return "The pattern flickered, and was recorded."
            }
            
            createEmptyGrid(size) {
                return Array(size).fill(0).map(() => Array(size).fill(0));
            }

            createRandomGrid(size) {
                let grid = this.createEmptyGrid(size);
                for (let y = 0; y < size; y++) {
                    for (let x = 0; x < size; x++) {
                        grid[y][x] = Math.random() > 0.7 ? 1 : 0; 
                    }
                }
                return grid;
            }
            
            // --- UI Rendering ---
            
            renderGrid() {
                for (let y = 0; y < gameState.gridSize; y++) {
                    for (let x = 0; x < gameState.gridSize; x++) {
                        this.renderTile(y, x);
                    }
                }
            }
            
            renderTile(y, x) {
                const tile = ui.grid.querySelector(`.taq-tile[data-y='${y}'][data-x='${x}']`);
                if (tile) {
                    if (gameState.grid[y][x] === 1) {
                        tile.classList.add('active');
                    } else {
                        tile.classList.remove('active');
                    }
                }
            }

            renderCard(cardData) {
                const cardEl = document.createElement('div');
                cardEl.className = "card";
                
                // Constellation Key (TAQ Layout)
                let taqHTML = `<div class="card-taq-grid" style="grid-template-columns: repeat(5, 1fr);">`;
                for (let y = 0; y < 5; y++) {
                    for (let x = 0; x < 5; x++) {
                        taqHTML += `<div class="card-taq-tile ${cardData.taqLayout[y][x] === 1 ? 'active' : ''}"></div>`;
                    }
                }
                taqHTML += `</div>`;
                
                cardEl.innerHTML = `
                    <div class="card-header flex justify-between">
                        <span class="font-bold text-lg text-amber-300">${cardData.name}</span>
                        <span class="font-bold text-lg text-sky-300">${cardData.cost} S</span>
                    </div>
                    <div class="text-stone-400 text-sm px-3">${cardData.type}</div>
                    <div class="card-art" title="K'inich Glyph">${cardData.boneCode}</div>
                    <div class="px-3 text-sm font-bold text-stone-400">Effect: Imprint Constellation Key</div>
                    ${taqHTML}
                    <div class="card-text">"${cardData.quip}"</div>
                    <button class="card-button">Channel This Echo</button>
                `;
                
                cardEl.querySelector('.card-button').addEventListener('click', () => this.playMinorArcana(cardData));
                ui.handContainer.appendChild(cardEl);
            }

            updateUI() {
                ui.score.textContent = gameState.resonanceScore;
                ui.cycles.textContent = gameState.cycles;
            }
            
            updateScore(newScore) {
                gameState.resonanceScore = newScore;
                ui.score.textContent = newScore;
            }
            
            updateCycles(newCycles) {
                gameState.cycles = newCycles;
                ui.cycles.textContent = newCycles;
            }
            
            showMessage(title, body) {
                ui.modalTitle.textContent = title;
                ui.modalBody.textContent = body;
                ui.modal.classList.remove('hidden');
            }
        }
        
        // --- START THE GAME ---
        window.addEventListener('load', async () => {
            await Tone.start();
            console.log("Audio context started. The Conch Resonator is active.");
            new Cyberloom();
        });

    </script>
</body>
</html>


