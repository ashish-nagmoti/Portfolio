"use client"

import { useEffect, useState, type KeyboardEvent } from "react"
import { ArrowsClockwise, Image as ImageIcon } from "@phosphor-icons/react"
import { showToast } from "./ios/island"
import { cn } from "@/lib/utils"

/*
 * A sliding-tile picture puzzle, styled after the old desktop gadget: a
 * wooden frame, a stopwatch, and a 4×4 board of fifteen pieces and one gap.
 * Slide pieces into the gap until the picture is whole; hold "?" to peek at
 * it. Shuffled by making random legal moves from the solved board, so every
 * shuffle can be solved.
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

// Polished wood: a warm base, long faint grain lines, and a lit top edge
const WOOD =
  "bg-[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0)_30%,rgba(0,0,0,0.18)),repeating-linear-gradient(92deg,rgba(60,30,8,0.16)_0_2px,transparent_2px_7px,rgba(255,220,170,0.07)_7px_9px,transparent_9px_15px),linear-gradient(180deg,#b07a45,#8a5528)] shadow-[inset_0_1px_0_rgba(255,236,200,0.55),inset_0_-1px_0_rgba(0,0,0,0.35),0_14px_30px_-10px_rgba(0,0,0,0.55)]"
const KNOB =
  "grid h-[19px] w-[19px] place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#7a5434,#2c1a0b)] text-[#f6e7c8] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_1px_2px_rgba(0,0,0,0.5)] transition-transform hover:brightness-125 active:scale-90"

/** The whole gadget; `size` is the board's width in px. */
export function PuzzleBoard({ size }: { size: number }) {
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
    <div className={cn("select-none rounded-[12px] p-[7px] pt-[5px]", WOOD)} style={{ width: size + 14 }}>
      <div className="mb-[5px] flex h-[21px] items-center gap-1.5">
        <button type="button" onClick={() => restart()} aria-label="Shuffle" title="Shuffle" className={KNOB}>
          <ArrowsClockwise weight="bold" className="h-[11px] w-[11px]" />
        </button>
        <span
          className="mx-auto rounded-[5px] bg-black/35 px-2 py-px font-mono text-[12px] font-semibold tabular-nums tracking-wider text-[#f8ead0] shadow-[inset_0_1px_2px_rgba(0,0,0,0.5),0_1px_0_rgba(255,230,190,0.25)]"
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
          className={cn(KNOB, "text-[12px] font-bold leading-none")}
        >
          ?
        </button>
        <button
          type="button"
          onClick={() => restart((pic + 1) % PICTURES.length)}
          aria-label={`Change picture (now ${PICTURES[pic].name})`}
          title="Change picture"
          className={KNOB}
        >
          <ImageIcon weight="bold" className="h-[11px] w-[11px]" />
        </button>
      </div>

      <div
        className="relative overflow-hidden rounded-[4px] bg-[#2a170a] shadow-[inset_0_2px_5px_rgba(0,0,0,0.7),0_1px_0_rgba(255,230,190,0.3)]"
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
              {/* Inset 1px so the pieces read as separate blocks, bevelled like the gadget's */}
              <span
                className="absolute inset-px rounded-[3px] bg-no-repeat shadow-[inset_1px_1px_0_rgba(255,255,255,0.4),inset_-1px_-1px_0_rgba(0,0,0,0.4)]"
                style={{
                  backgroundImage: picture,
                  backgroundSize: `${size}px ${size}px`,
                  backgroundPosition: `-${(piece % N) * tile + 1}px -${Math.floor(piece / N) * tile + 1}px`,
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
    </div>
  )
}
