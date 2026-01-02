/**
 * main.js (The "Cyberloom")
 * * This is the central event bus and coordinator.
 * It initializes all modules and "weaves" data between them.
 * - Listens for events from TAQ.js (user input).
 * - Sends commands to the WASM-Bridge (automata).
 * - Receives state updates from the WASM-Bridge.
 * - Forwards new states to VIZ.js, RTS.js, and TAQ.js for rendering.
 */

import { TaqInterface } from './taq.js';
import { Viz }StandardVisualization } from './viz.js';
import { RtsSonifier } from './rts.js';
import { WasmBridge } from './wasm-bridge.js';

// --- MAIN APP INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    const cyberloom = new Cyberloom();
    cyberloom.init();
});

class Cyberloom {
    constructor() {
        this.statusText = document.getElementById('status-text');
        this.statusLight = document.getElementById('status-light');
        this.rtsControls = document.getElementById('rts-controls');
        
        // 1. Initialize all modules
        this.taq = new TaqInterface(
            document.getElementById('notebook-panel'),
            document.getElementById('hand-container')
        );
        this.viz = new VizStandardVisualization(document.getElementById('viz-canvas-container'));
        this.rts = new RtsSonifier(this.rtsControls);
        this.bridge = new WasmBridge();

        this.grid = null;
        this.isSimulating = false;
    }

    async init() {
        this.statusText.textContent = "Loading Automata...";
        
        // 2. Load the WASM module (mocked)
        try {
            await this.bridge.load();
            this.grid = this.bridge.getInitialGrid(20, 20); // Get a 20x20 grid
            
            // 3. Initial render
            this.taq.render(this.grid);
            this.viz.initGrid(this.grid);
            
            // 4. Bind all event listeners (the "weave")
            this.bindEvents();
            
            this.updateStatus("Online", "green");
            console.log("Cyberloom initialized. All modules loaded.");
            
            // Start the simulation loop
            this.startSimulationLoop();

        } catch (err) {
            this.updateStatus("Error", "red");
            console.error("Failed to initialize Cyberloom:", err);
        }
    }
    
    bindEvents() {
        // Listen for user input from the TAQ interface
        document.addEventListener('taq:perturb', (e) => this.handleTaqPerturb(e.detail));
        document.addEventListener('taq:playCard', (e) => this.handlePlayCard(e.detail));
        document.addEventListener('taq:queryPinecone', () => this.handleQueryPinecone());
    }
    
    // --- EVENT HANDLERS ---
    
    handleTaqPerturb(detail) {
        if (!this.grid) return;
        const { y, x, newState } = detail;
        this.grid[y][x] = newState;
        
        // Directly update the automata in the bridge
        this.bridge.updateGridAt(y, x, newState);
        
        // Update the visualizers
        this.viz.updateGrid(this.grid);
        this.rts.playNote(y, x, newState); // Play a sound for the click
    }
    
    handlePlayCard(cardData) {
        if (!this.grid) return;
        console.log('[Cyberloom] Playing card:', cardData.name);
        
        // "Imprint this TAQ Layout"
        const layout = cardData.taqLayout;
        const center = Math.floor(this.grid.length / 2) - 2;
        
        for (let y = 0; y < layout.length; y++) {
            for (let x = 0; x < layout.length; x++) {
                const gridY = center + y;
                const gridX = center + x;
                if (gridY >= 0 && gridY < this.grid.length && gridX >= 0 && gridX < this.grid.length) {
                    if (layout[y][x] === 1) { // Only imprint "on" tiles
                        this.grid[gridY][gridX] = 1;
                        this.bridge.updateGridAt(gridY, gridX, 1);
                    }
                }
            }
        }
        
        // Re-render everything with the new state
        this.taq.render(this.grid);
        this.viz.updateGrid(this.grid);
        this.rts.playEffect("cardPlay");
    }

    async handleQueryPinecone() {
        console.log('[Cyberloom] Querying Pinecone...');
        this.taq.setHandLoading(true);

        try {
            // Mock vector of the current grid state
            const mockVector = this.grid.flat().slice(0, 10); 
            
            const response = await fetch('/api/v1/pinecone/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vector: mockVector })
            });
            const data = await response.json();
            
            this.taq.renderHand(data.memories);
            
        } catch (err) {
            console.error("Failed to query Pinecone:", err);
            this.taq.setHandLoading(false);
        }
    }
    
    // --- SIMULATION LOOP ---
    
    startSimulationLoop() {
        this.isSimulating = true;
        this.gameLoop();
    }
    
    gameLoop() {
        if (!this.isSimulating) return;

        // 1. Advance the automata
        const { newGrid, changes } = this.bridge.step();
        this.grid = newGrid;

        // 2. Weave new state to all modules
        this.taq.render(this.grid);
        this.viz.updateGrid(this.grid);
        this.rts.update(this.grid, changes);

        // 3. Loop
        setTimeout(() => {
            requestAnimationFrame(() => this.gameLoop());
        }, 100); // Run simulation step every 100ms
    }
    
    // --- UTILITY ---
    
    updateStatus(text, color) {
        this.statusText.textContent = text;
        this.statusLight.className = `inline-block w-3 h-3 bg-${color}-500 rounded-full`;
        if (color === "green") {
            this.statusLight.classList.remove('animate-pulse');
        } else {
            this.statusLight.classList.add('animate-pulse');
        }
    }
}

