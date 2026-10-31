"use client"

import { useEffect, useState } from "react"
import { ArrowsClockwise, Image as ImageIcon } from "@phosphor-icons/react"
import { showToast } from "./ios/island"
import { cn } from "@/lib/utils"

/*
 * A sliding-tile picture puzzle: eight pieces of a picture and one gap; slide
 * pieces into the gap until the picture is whole. Shuffled by making random
 * legal moves from the solved board, so every shuffle can be solved.
 */

const N = 3
const BLANK = N * N - 1
const PICTURES = [
  { name: "Castle", src: "/puzzle/castle.svg" },
  { name: "Liquid Glass", src: "/wallpapers/glass-dark-thumb.jpg" },
]

const solved = () => Array.from({ length: N * N }, (_, i) => i)
const isSolved = (b: number[]) => b.every((v, i) => v === i)

function neighbours(i: number) {
  const r = Math.floor(i / N)
  const c = i % N
  return [r > 0 && i - N, r < N - 1 && i + N, c > 0 && i - 1, c < N - 1 && i + 1].filter((x): x is number => x !== false)
}

function shuffle(): number[] {
  const b = solved()
  let gap = BLANK
  let prev = -1
  for (let k = 0; k < 90; k++) {
    const options = neighbours(gap).filter((n) => n !== prev)
    const pick = options[Math.floor(Math.random() * options.length)]
    ;[b[gap], b[pick]] = [b[pick], b[gap]]
    prev = gap
    gap = pick
  }
  return isSolved(b) ? shuffle() : b
}

/** The board alone; `size` is its width in px. */
export function PuzzleBoard({ size, compact }: { size: number; compact?: boolean }) {
  // Shuffled after mount: a random board can't be rendered on the server
  const [board, setBoard] = useState<number[]>(solved)
  const [moves, setMoves] = useState(0)
  const [pic, setPic] = useState(0)
  const [won, setWon] = useState(false)
  useEffect(() => setBoard(shuffle()), [])

  const tile = size / N
  const gapAt = board.indexOf(BLANK)

  const slide = (pos: number) => {
    if (won || !neighbours(gapAt).includes(pos)) return
    const next = [...board]
    ;[next[gapAt], next[pos]] = [next[pos], next[gapAt]]
    setBoard(next)
    setMoves((m) => m + 1)
    if (isSolved(next)) {
      setWon(true)
      showToast(`Solved in ${moves + 1} moves 🧩`)
    }
  }
  const restart = (nextPic = pic) => {
    setPic(nextPic)
    setBoard(shuffle())
    setMoves(0)
    setWon(false)
  }

  return (
    <div className={cn("flex gap-3", compact ? "items-center" : "flex-col")}>
      <div
        className="relative shrink-0 overflow-hidden rounded-[14px] bg-black/20 shadow-inner"
        style={{ width: size, height: size }}
        role="grid"
        aria-label="Sliding picture puzzle"
      >
        {board.map((piece, pos) =>
          piece === BLANK && !won ? null : (
            <button
              key={piece}
              type="button"
              onClick={() => slide(pos)}
              aria-label={`Piece ${piece + 1}${neighbours(gapAt).includes(pos) ? ", can move" : ""}`}
              className={cn("absolute left-0 top-0 bg-no-repeat", !won && "rounded-[6px] ring-1 ring-inset ring-white/25")}
              style={{
                width: tile,
                height: tile,
                padding: 0,
                // Plain CSS transform + transition: deterministic, unlike spring-animated motion values
                transform: `translate(${(pos % N) * tile}px, ${Math.floor(pos / N) * tile}px)`,
                transition: "transform 160ms cubic-bezier(0.3, 0.7, 0.2, 1)",
                backgroundImage: `url(${PICTURES[pic].src})`,
                backgroundSize: `${size}px ${size}px`,
                backgroundPosition: `-${(piece % N) * tile}px -${Math.floor(piece / N) * tile}px`,
              }}
            />
          ),
        )}
      </div>
      <div className={cn("flex items-center justify-between gap-2", compact && "flex-1 flex-col items-start")}>
        <span className="text-[11px] text-muted-foreground">
          {won ? <b className="font-semibold text-emerald-600 dark:text-emerald-400">Solved in {moves}!</b> : `${moves} ${moves === 1 ? "move" : "moves"}`}
        </span>
        <span className="flex gap-1">
          <button
            type="button"
            onClick={() => restart((pic + 1) % PICTURES.length)}
            aria-label="Change picture"
            title="Change picture"
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
          >
            <ImageIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => restart()}
            aria-label="Shuffle"
            title="Shuffle"
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
          >
            <ArrowsClockwise className="h-4 w-4" />
          </button>
        </span>
      </div>
    </div>
  )
}
