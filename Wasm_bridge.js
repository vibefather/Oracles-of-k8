# This is the Python file that `wasm-bridge.js` would load and run.
# For simplicity, this is Conway's Game of Life.
# You would replace this with your "Two-way Fibonacci rev automata".

import numpy as np

class FibonacciAutomata:
    def __init__(self, width, height):
        self.width = width
        self.height = height
        # Initialize grid with 30% density
        self.grid = np.random.choice([0, 1], size=(height, width), p=[0.7, 0.3])

    def get_grid(self):
        # Return grid as a list for JS conversion
        return self.grid.tolist()

    def set_grid(self, new_grid_list):
        self.grid = np.array(new_grid_list)
        self.height, self.width = self.grid.shape

    def update_grid_at(self, y, x, state):
        self.grid[y, x] = state

    def step(self):
        new_grid = self.grid.copy()
        changes = 0
        
        for y in range(self.height):
            for x in range(self.width):
                # Calculate neighbors with wrapping
                neighbors = np.sum(self.grid[
                    (y-1+self.height)%self.height:(y+2+self.height)%self.height,
                    (x-1+self.width)%self.width:(x+2+self.width)%self.width
                ]) - self.grid[y, x]
                
                is_alive = self.grid[y, x] == 1
                
                if is_alive and (neighbors < 2 or neighbors > 3):
                    new_grid[y, x] = 0  # Die
                    changes += 1
                elif not is_alive and neighbors == 3:
                    new_grid[y, x] = 1  # Born
                    changes += 1
        
        self.grid = new_grid
        # Return both the new grid and the number of changes
        return {
            "newGrid": self.grid.tolist(),
            "changes": changes
        }

# This is how Pyodide would create an instance for JS to use
# automata_instance = FibonacciAutomata(20, 20)



