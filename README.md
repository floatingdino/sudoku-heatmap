# Sudoku Heatmap

Uses [roukaour/sudoku](https://github.com/roukaour/sudoku) Sudoku solver to solve a given sudoku and rank which squares are most difficult to solve, based on human solving techniques.

The solver is packaged as a Python wheel using [pyodide](https://github.com/pyodide/pyodide) and runs in the browser using the pyodide runtime.

## Usage

1. Install dependencies using `npm install`
2. Run the development server using `npm run dev`
3. Enter a Sudoku into the puzzle field (81 numbers, any character that is not 1-9 is treated as an empty square eg '.' or '0')