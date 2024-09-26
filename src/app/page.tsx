"use client"

import createStyle from "@josephmark/createstyle";
import { useState } from "react";

const Container = createStyle("div", "mx-auto px-4 max-w-lg")

export default function Home() {
  const [puzzle, setPuzzle] = useState('.7.....43.4...961.8..6349...94.52...35846..2....8..53..8..7..919.21....5..7.4.8.2')
  return (
    <>
    <Container className="py-4">
      <label className="block">Enter Puzzle</label>
      <textarea value={puzzle} onChange={e => setPuzzle(e.target.value)} className="w-full border mb-4" />
        <div className="grid grid-cols-9 grid-rows-9 text-center mx-auto font-bold">
          {puzzle.split('').map((cell, i) => (
            <div key={i} className="p-1 border border-black flex items-center justify-center" style={{aspectRatio: 1}}>
              {cell === '.' ? '' : cell}
            </div>
          ))}
        </div>
    </Container>
    </>
  );
}
