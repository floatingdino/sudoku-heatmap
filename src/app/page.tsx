"use client"


import createStyle from "@josephmark/createstyle";
import Script from "next/script";
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import type { PyodideInterface } from "pyodide";
import parseSolution, { CellSolution, interpolateColor, normaliseDifficulty } from "@/utils/parseSolution";
import clsx from "clsx";
import * as Popover from "@radix-ui/react-popover"

declare const loadPyodide: () => Promise<PyodideInterface>

const Container = createStyle("div", "mx-auto px-4 max-w-lg")

const SAMPLE_PUZZLES = [
  '.7.....43.4...961.8..6349...94.52...35846..2....8..53..8..7..919.21....5..7.4.8.2',
  '72..96..3...2.5....8...4.2........6.1.65.38.7.4........3.8...9....7.2...2..43..18', // SudokuWiki "Moderate",
  '3.9...4..2..7.9....87......75..6.23.6..9.4..8.28.5..41......59....1.6..7..6...1.4', //SudokuWiki "Tough"
]

const LEGAL_NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

function Cell({puzzleValue, solutionValue, normalisedDifficulty, hardest = false, easiest = false}: {puzzleValue: string, solutionValue: CellSolution | null, normalisedDifficulty: number | null, hardest?: boolean, easiest?: boolean}) {
  const isGiven = LEGAL_NUMBERS.includes(puzzleValue)
  return (
    <Popover.Root>
      <Popover.Trigger className={clsx("p-1 border flex items-center justify-center", hardest && "border-red-500", easiest && "border-green-500", !hardest && !easiest && "border-black")} style={{aspectRatio: 1, color: isGiven ? "black" : "blue", "--bg-opacity": 0.5, backgroundColor: isGiven ? "white" : interpolateColor(normalisedDifficulty!)} as CSSProperties}>
        {isGiven ? puzzleValue : solutionValue?.solution || null}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="p-4 bg-white border" style={{width: 400}}>
          <h3>Cell Difficulty Rating: {solutionValue?.difficulty}</h3>
          <h3>Strategies Used: {Array.from(solutionValue?.strategies?.values() || []).join(", ")}</h3>
          <h3>Touches Used: {solutionValue?.touches}</h3>
        </Popover.Content>
      </Popover.Portal>
  </Popover.Root>
  )
}

export default function Home() {
  const [puzzle, setPuzzle] = useState(SAMPLE_PUZZLES[2])
  const [ready, setReady] = useState(false)
  const [lastRun, setLastRun] = useState('')
  const runtime = useRef<PyodideInterface | null>(null)

  const onLoad = () => {
    loadPyodide().then(py => {
      runtime.current = py
      py.setStdout({batched: (x) => {
        // console.log(x)
        return setLastRun((y) => `${y}
${x}`);
      }})
      py.loadPackage("/roukaour_sudoku_solver.whl").then(() => {setReady(true)})
    })

  }

  const parsedSolution = useMemo(() => lastRun ? parseSolution(lastRun) : null, [lastRun])
  const maxDifficulty = useMemo(() => parsedSolution ? parsedSolution.reduce((a, b) => {
    const isHarder = b.difficulty > a.difficulty
    if (isHarder) {
      return b
    }
    return a
  }) : null, [parsedSolution])
  const minDifficulty = useMemo(() => parsedSolution ? parsedSolution.reduce((a, b) => {
    if (a.difficulty === -1) {
      return b
    }
    const isEasier = (b.difficulty < a.difficulty) && b.difficulty > -1
    if (isEasier) {
      return b
    }
    return a
  }):null, [parsedSolution])

  useEffect(() => {
    if (!ready || !runtime.current) {
      return
    }
    const pyodide = runtime.current
    setLastRun('')
    pyodide.runPythonAsync(`
      from sudoku import solve_board
      solve_board("${puzzle}", False, True)`)
  }, [ready, puzzle])
  return (
    <>
    <Script src="https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js" strategy="lazyOnload" onLoad={onLoad} />
    <Container className="py-4">
      <label className="block">Enter Puzzle</label>
      <textarea value={puzzle} onChange={e => setPuzzle(e.target.value)} className="w-full border mb-4" />
        <div className="grid grid-cols-9 grid-rows-9 text-center mx-auto font-bold">
          {puzzle.split('').map((cell, i) => {
            const solution = parsedSolution?.[i]
            return (
              <Cell puzzleValue={cell} solutionValue={solution || null} hardest={solution === maxDifficulty} easiest={solution === minDifficulty} normalisedDifficulty={(solution?.difficulty && maxDifficulty?.difficulty && minDifficulty?.difficulty) ? normaliseDifficulty(solution?.difficulty, maxDifficulty?.difficulty, minDifficulty?.difficulty):null} key={[puzzle, i].join("")} />
            );
          })}
        </div>
        {!ready && <p className="mt-5">Loading solver...</p>}
        {lastRun && <>
        <h2 className="mt-5 font-bold">Solution Path</h2>
        <pre>{lastRun}</pre>
        </>}
    </Container>
    </>
  );
}


