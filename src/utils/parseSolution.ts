
const STRATEGIES = [
  'naked singles',
  'hidden singles',
  'naked pairs',
  'hidden pairs',
  'naked triples',
  'hidden triples',
  'naked quads',
  'hidden quads',
  'unit intersection',
  'X-wing',
  'Y-wing',
  'swordfish',
  'XYZ-wing',
  '3D Medusa',
  'dual Medusa',
  'jellyfish',
  'bi-value cell focing chain',
  'dual unit forcing chain',
  'Nishio forcing chain',
  'anti-Nishio forcing chain',
  '2-cell subset exclusion',
  '3-cell subset exclusion',
  'guessing'
]

const ROWS = 'ABCDEFGHJ';

export type CellSolution = {
  touches: number
  solved: boolean
  strategies: Set<string>
  index: number
  solution: string | null
  difficulty: number
}

export default function parseSolution(working: string): CellSolution[] {
  const solutionMap: CellSolution[] = Array.from({length: 81}, (_, i) => ({index: i, touches: 0, solved: false, solution: null, strategies: new Set(), difficulty: -1}))

  let currentStrategy = ''
  const rx = new RegExp(`[${ROWS}]\\d`, 'g')
  working.split('\n').forEach((line) => {
    if (line.startsWith("Try")) {
      currentStrategy = line.slice(3).trim()
      console.log(currentStrategy)
      return
    }
    if (!line.startsWith(" * ") && !line.startsWith(" - ")) {
      return
    }
    let cells = line.match(rx)?.flat()
    if (currentStrategy === "X-wing") {
      const columns = line.match("columns \\(([\\d, ]+)\\)")?.[1]?.split(", ") || []
      const rows = line.match(`rows \\(([${ROWS}, ]+)\\)`)?.[1]?.split(", ") || []
      cells = rows.flatMap((row) => columns.map((column) => row + column))
    }
    cells?.forEach((cell) => {
      const [rowName, column] = cell.split('')
      const lineRow = ROWS.indexOf(rowName)
      const lineCol = parseInt(column) - 1
      const cellIndex = lineRow * 9 + lineCol

      const solutionCell = solutionMap[cellIndex]
      if (solutionCell?.solved) {
        return
      }

      if (!cellIndex) {
        console.log(line)
      }
      solutionCell.touches++
      solutionCell.strategies.add(currentStrategy)
    })
  })

  const solution = working.match(/Solved: (\d{81})/)
  if (solution) {
    solution[1].split('').forEach((solution, i) => {
      solutionMap[i].solution = solution
    })
  }

  return solutionMap.map((cell) => {
    return {...cell, difficulty: rateCell(cell)}})
}

export function rateCell(cell: CellSolution) {
  if (cell.strategies.size === 0) {
    return -1
  }
  const maxDifficulty = Array.from(cell.strategies.values()).map((s) => STRATEGIES.indexOf(s)).reduce((a, b) => Math.max(a, b), -1)
  return cell.touches / 10 + maxDifficulty
}

export function normaliseDifficulty(difficulty: number, maxDifficulty: number, minDifficulty: number) {
  return (difficulty - minDifficulty) / (maxDifficulty - minDifficulty)
}

const _lowColor = [0, 255, 0]
const _highColor = [255, 0, 0]

export function interpolateColor(value: number, options?: {lowColor?: [number,number,number], highColor?: [number,number,number], min?: number, max: number}) {
  const {lowColor = _lowColor, highColor = _highColor, min = 0, max = 1} = options || {}
  const ratio = (value - min) / (max - min)
  const color = lowColor.map((low, i) => {
    const high = highColor[i]
    return Math.round(low + (high - low) * ratio)
  })
  return `rgba(${color.join(',')}, var(--bg-opacity))`
}