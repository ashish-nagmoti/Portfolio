"use client"

import { useEffect, useState, type KeyboardEvent, type ReactNode } from "react"
import { ArrowsClockwise, Eye, Image as ImageIcon } from "@phosphor-icons/react"
import { showToast } from "./ios/island"
import { cn } from "@/lib/utils"

/*
 * A sliding-tile picture puzzle: a stopwatch and a 4×4 board of fifteen
 * pieces and one gap. Slide pieces into the gap until the picture is whole;
 * hold the eye to peek at it. Shuffled by making random legal moves from the
 * solved board, so every shuffle can be solved. It draws no card of its own:
 * it sits inside a widget's glass.
 */

const N = 4
const BLANK = N * N - 1
const PICTURES = [
  { name: "Toucan", src: "/puzzle/toucan.svg" },
  { name: "Castle", src: "/puzzle/castle.svg" },
  { name: "Lift-off", src: "/puzzle/space.svg" },
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
  for (let k = 0; k < 160; k++) {
    const options = neighbours(gap).filter((n) => n !== prev)
    const pick = options[Math.floor(Math.random() * options.length)]
    ;[b[gap], b[pick]] = [b[pick], b[gap]]
    prev = gap
    gap = pick
  }
  return isSolved(b) ? shuffle() : b
}

const pad = (n: number) => String(n).padStart(2, "0")
const clock = (ms: number) => {
  const s = Math.floor(ms / 1000)
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`
}

const ICON_BUTTON =
  "grid h-6 w-6 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground active:scale-90 dark:hover:bg-white/10"

/**
 * A header (`title`, then the stopwatch and controls) over the board; `size`
 * is the board's width in px. `aside` sits beside the board, for a wide slot.
 */
export function PuzzleBoard({ size, title, aside }: { size: number; title: ReactNode; aside?: ReactNode }) {
  // Shuffled after mount: a random board can't be rendered on the server
  const [board, setBoard] = useState<number[]>(solved)
  const [moves, setMoves] = useState(0)
  const [pic, setPic] = useState(0)
  const [won, setWon] = useState(false)
  const [peek, setPeek] = useState(false)
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [now, setNow] = useState(0)
  useEffect(() => setBoard(shuffle()), [])

  // The stopwatch runs from the first move until the picture is whole
  useEffect(() => {
    if (startedAt === null || won) return
    const t = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(t)
  }, [startedAt, won])
  const elapsed = startedAt === null ? 0 : Math.max(0, now - startedAt)

  const tile = size / N
  const gapAt = board.indexOf(BLANK)

  const slide = (pos: number) => {
    if (won || !neighbours(gapAt).includes(pos)) return
    const next = [...board]
    ;[next[gapAt], next[pos]] = [next[pos], next[gapAt]]
    const t = Date.now()
    if (startedAt === null) setStartedAt(t)
    setNow(t)
    setBoard(next)
    setMoves((m) => m + 1)
    if (isSolved(next)) {
      setWon(true)
      showToast(`Solved in ${clock(t - (startedAt ?? t))}, ${moves + 1} moves 🧩`)
    }
  }
  const restart = (nextPic = pic) => {
    setPic(nextPic)
    setBoard(shuffle())
    setMoves(0)
    setWon(false)
    setStartedAt(null)
    setNow(0)
  }
  const peekKey = (on: boolean) => (e: KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault()
      setPeek(on)
    }
  }
  const picture = `url(${PICTURES[pic].src})`

  return (
    <div className="select-none">
      <div className="mb-2.5 flex items-center gap-1">
        <span className="mr-auto min-w-0">{title}</span>
        <span
          className="mr-0.5 rounded-md bg-black/5 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-foreground/80 dark:bg-white/10"
          title={`${moves} ${moves === 1 ? "move" : "moves"}`}
        >
          {clock(elapsed)}
        </span>
        <button
          type="button"
          aria-label="Hold to see the picture"
          title="Hold to see the picture"
          onPointerDown={() => setPeek(true)}
          onPointerUp={() => setPeek(false)}
          onPointerLeave={() => setPeek(false)}
          onPointerCancel={() => setPeek(false)}
          onKeyDown={peekKey(true)}
          onKeyUp={peekKey(false)}
          className={cn(ICON_BUTTON, peek && "bg-black/5 text-foreground dark:bg-white/10")}
        >
          <Eye className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => restart((pic + 1) % PICTURES.length)}
          aria-label={`Change picture (now ${PICTURES[pic].name})`}
          title="Change picture"
          className={ICON_BUTTON}
        >
          <ImageIcon className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => restart()} aria-label="Shuffle" title="Shuffle" className={ICON_BUTTON}>
          <ArrowsClockwise className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-3.5">
        <div
          className="relative shrink-0 overflow-hidden rounded-[14px] bg-black/10 shadow-[inset_0_1px_3px_rgba(0,0,0,0.25)] dark:bg-black/30"
          style={{ width: size, height: size }}
          role="grid"
          aria-label={`Sliding picture puzzle, ${moves} ${moves === 1 ? "move" : "moves"}`}
        >
          {board.map((piece, pos) =>
            piece === BLANK ? null : (
              <button
                key={piece}
                type="button"
                onClick={() => slide(pos)}
                aria-label={`Piece ${piece + 1}${neighbours(gapAt).includes(pos) ? ", can move" : ""}`}
                className="absolute left-0 top-0 p-0"
                style={{
                  width: tile,
                  height: tile,
                  // Plain CSS transform + transition: deterministic, unlike spring-animated motion values
                  transform: `translate(${(pos % N) * tile}px, ${Math.floor(pos / N) * tile}px)`,
                  transition: "transform 140ms cubic-bezier(0.3, 0.7, 0.2, 1)",
                }}
              >
                {/* Inset so the pieces read as separate blocks, each with a lit glass edge */}
                <span
                  className="absolute inset-[1.5px] rounded-[7px] bg-no-repeat shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22),0_1px_2px_rgba(0,0,0,0.25)]"
                  style={{
                    backgroundImage: picture,
                    backgroundSize: `${size}px ${size}px`,
                    backgroundPosition: `-${(piece % N) * tile + 1.5}px -${Math.floor(piece / N) * tile + 1.5}px`,
                  }}
                />
              </button>
            ),
          )}
          {/* The whole picture: while "?" is held, and once it's solved */}
          <div
            className={cn(
              "pointer-events-none absolute inset-0 bg-cover transition-opacity duration-300",
              peek || won ? "opacity-100" : "opacity-0",
            )}
            style={{ backgroundImage: picture }}
          />
          {won && (
            <span className="absolute inset-x-0 bottom-2 mx-auto w-fit rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
              Solved in {moves} moves!
            </span>
          )}
        </div>
        {aside}
      </div>
    </div>
  )
}
