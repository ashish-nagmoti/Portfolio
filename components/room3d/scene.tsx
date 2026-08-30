"use client"

import { useRef, useState, type ReactNode } from "react"
import { useFrame } from "@react-three/fiber"
import { Edges, Grid, Sparkles, Html } from "@react-three/drei"
import type { Group, Mesh } from "three"
import { Hotspot } from "./hotspot"
import type { PanelId } from "./types"

const COLORS = {
  bg: "#08090b",
  fill: "#111316",
  fillRaised: "#16191d",
  green: "#3dff8f",
  amber: "#ffb02e",
  screenOff: "#0b0d0c",
}

// Desk sits against the back-right corner of the room.
const DESK = { x: 1.55, y: 0, z: -1.95 }

function Retro({
  children,
  accent,
  position,
  rotation,
  fill = COLORS.fill,
  onClick,
  onPointerOver,
  onPointerOut,
  scale,
}: {
  children: ReactNode
  accent: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  fill?: string
  onClick?: (e: any) => void
  onPointerOver?: (e: any) => void
  onPointerOut?: (e: any) => void
  scale?: number
}) {
  return (
    <mesh
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {children}
      <meshBasicMaterial color={fill} />
      <Edges color={accent} />
    </mesh>
  )
}

function Room({ accent }: { accent: string }) {
  return (
    <group>
      <mesh position={[0, -0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7, 5.4]} />
        <meshBasicMaterial color={COLORS.bg} />
      </mesh>
      <Grid
        position={[0, 0.001, 0]}
        args={[7, 5.4]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor={accent}
        sectionSize={2}
        sectionThickness={1}
        sectionColor={accent}
        fadeDistance={9}
        fadeStrength={1.5}
        followCamera={false}
        infiniteGrid={false}
        side={2}
      />
      <Retro accent={accent} position={[0, 2, -2.8]}>
        <boxGeometry args={[7, 4.2, 0.15]} />
      </Retro>
      <Retro accent={accent} position={[-3.6, 2, 0]}>
        <boxGeometry args={[0.15, 4.2, 5.4]} />
      </Retro>
    </group>
  )
}

function TerminalWindow({ accent, onCycle }: { accent: string; onCycle: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <group
      position={[1.2, 2.25, -2.68]}
      onClick={(e) => {
        e.stopPropagation()
        onCycle()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = "pointer"
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = "auto"
      }}
      scale={hovered ? 1.05 : 1}
    >
      <Retro accent={accent} fill={COLORS.screenOff}>
        <planeGeometry args={[1.4, 1.2]} />
      </Retro>
      <mesh position={[0, 0, 0.005]}>
        <boxGeometry args={[0.03, 1.2, 0.01]} />
        <meshBasicMaterial color={accent} />
      </mesh>
      <mesh position={[0, 0, 0.005]}>
        <boxGeometry args={[1.4, 0.03, 0.01]} />
        <meshBasicMaterial color={accent} />
      </mesh>
      <Sparkles count={16} scale={[1.2, 1, 0.1]} size={2} speed={0.2} color={accent} />
      {hovered && (
        <Html center position={[0, 0.85, 0]} style={{ pointerEvents: "none" }}>
          <div
            className="whitespace-nowrap font-mono text-xs px-3 py-1.5 bg-black border"
            style={{ color: accent, borderColor: accent }}
          >
            [ cycle phosphor: {accent === COLORS.green ? "amber" : "green"} ]
          </div>
        </Html>
      )}
    </group>
  )
}

function WallClock({ accent }: { accent: string }) {
  const secondHand = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    if (secondHand.current) secondHand.current.rotation.z = -clock.elapsedTime * 0.9
  })
  return (
    <group position={[2.3, 2.85, -2.68]}>
      <Retro accent={accent}>
        <cylinderGeometry args={[0.3, 0.3, 0.04, 24]} />
      </Retro>
      <mesh ref={secondHand} position={[0, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.015, 0.22, 0.01]} />
        <meshBasicMaterial color={accent} />
      </mesh>
    </group>
  )
}

function Desk({ accent }: { accent: string }) {
  return (
    <group position={[DESK.x, DESK.y, DESK.z]}>
      <Retro accent={accent} position={[0, 1, 0]}>
        <boxGeometry args={[2, 0.08, 0.9]} />
      </Retro>
      {[
        [-0.9, -0.35],
        [0.9, -0.35],
        [-0.9, 0.35],
        [0.9, 0.35],
      ].map(([sx, sz], i) => (
        <Retro key={i} accent={accent} position={[sx, 0.5, sz]}>
          <boxGeometry args={[0.06, 0.95, 0.06]} />
        </Retro>
      ))}
      <Retro accent={accent} position={[0, 1.06, 0.22]}>
        <boxGeometry args={[0.5, 0.02, 0.18]} />
      </Retro>
    </group>
  )
}

function Monitor({ accent }: { accent: string }) {
  const screenRef = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    const mat = screenRef.current?.material as any
    if (mat) mat.opacity = 0.75 + Math.sin(clock.elapsedTime * 2.4) * 0.2
  })
  return (
    <group position={[0, 1.06, -0.15]}>
      <Retro accent={accent} position={[0, 0.16, 0]}>
        <boxGeometry args={[0.08, 0.32, 0.08]} />
      </Retro>
      <Retro accent={accent} position={[0, 0.58, 0]} fill={COLORS.screenOff}>
        <boxGeometry args={[0.85, 0.56, 0.05]} />
      </Retro>
      <mesh ref={screenRef} position={[0, 0.58, 0.03]}>
        <planeGeometry args={[0.7, 0.42]} />
        <meshBasicMaterial color={accent} transparent opacity={0.8} />
      </mesh>
    </group>
  )
}

function Chair({ accent }: { accent: string }) {
  const groupRef = useRef<Group>(null)
  const velocity = useRef(0)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += velocity.current * delta
    velocity.current *= Math.pow(0.06, delta)
  })

  return (
    <group position={[DESK.x, 0, DESK.z + 0.95]} rotation={[0, Math.PI, 0]}>
      <group
        ref={groupRef}
        onClick={(e) => {
          e.stopPropagation()
          velocity.current += 14
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = "pointer"
        }}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        <Retro accent={accent} position={[0, 0.55, 0]}>
          <boxGeometry args={[0.5, 0.06, 0.5]} />
        </Retro>
        <Retro accent={accent} position={[0, 0.88, -0.22]}>
          <boxGeometry args={[0.5, 0.55, 0.06]} />
        </Retro>
        <Retro accent={accent} position={[0, 0.27, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.55, 10]} />
        </Retro>
        <Retro accent={accent} position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.03, 20]} />
        </Retro>
      </group>
    </group>
  )
}

function Bookshelf({ accent }: { accent: string }) {
  return (
    <group position={[-3.15, 0, -1.0]}>
      <Retro accent={accent} position={[0, 1.15, 0]}>
        <boxGeometry args={[0.55, 2.3, 0.8]} />
      </Retro>
      {[0.45, 1.1, 1.75].map((shelfY, si) => (
        <group key={si} position={[0.12, shelfY, 0]}>
          <Retro accent={accent}>
            <boxGeometry args={[0.6, 0.03, 0.85]} />
          </Retro>
          {[0.32, 0.26, 0.38, 0.22].map((h, bi) => (
            <Retro key={bi} accent={accent} position={[0.03, h / 2 + 0.03, -0.26 + bi * 0.18]}>
              <boxGeometry args={[0.04, h, 0.32]} />
            </Retro>
          ))}
        </group>
      ))}
    </group>
  )
}

function Diploma({ accent }: { accent: string }) {
  return (
    <group position={[-0.85, 2.15, -2.67]}>
      <Retro accent={accent} fill={COLORS.screenOff}>
        <boxGeometry args={[0.8, 1.0, 0.04]} />
      </Retro>
      <mesh position={[0, 0.28, 0.025]}>
        <planeGeometry args={[0.5, 0.06]} />
        <meshBasicMaterial color={accent} />
      </mesh>
      {[0.1, -0.02, -0.14, -0.26].map((y, i) => (
        <mesh key={i} position={[0, y, 0.025]}>
          <planeGeometry args={[0.55, 0.025]} />
          <meshBasicMaterial color={accent} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  )
}

function SideTable({ accent, position }: { accent: string; position: [number, number, number] }) {
  return (
    <group position={position}>
      <Retro accent={accent} position={[0, 0.7, 0]}>
        <boxGeometry args={[0.7, 0.05, 0.5]} />
      </Retro>
      {[
        [-0.28, -0.18],
        [0.28, -0.18],
        [-0.28, 0.18],
        [0.28, 0.18],
      ].map(([sx, sz], i) => (
        <Retro key={i} accent={accent} position={[sx, 0.34, sz]}>
          <boxGeometry args={[0.05, 0.65, 0.05]} />
        </Retro>
      ))}
    </group>
  )
}

function RetroTerminalProp({ accent }: { accent: string }) {
  const screenRef = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    const mat = screenRef.current?.material as any
    if (mat) mat.opacity = clock.elapsedTime % 1 > 0.85 ? 0.2 : 0.9
  })
  return (
    <group position={[0, 0.74, 0]}>
      <Retro accent={accent} fill={COLORS.fillRaised}>
        <boxGeometry args={[0.46, 0.42, 0.42]} />
      </Retro>
      <mesh ref={screenRef} position={[0, 0.02, 0.22]}>
        <planeGeometry args={[0.3, 0.24]} />
        <meshBasicMaterial color={accent} transparent opacity={0.9} />
      </mesh>
    </group>
  )
}

function Phone({ accent }: { accent: string }) {
  return (
    <group position={[0.75, 1.05, -0.1]} rotation={[0, 0.3, 0]}>
      <Retro accent={accent}>
        <boxGeometry args={[0.32, 0.06, 0.28]} />
      </Retro>
      <Retro accent={accent} position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.02, 16]} />
      </Retro>
    </group>
  )
}

function ResumePapers({ accent }: { accent: string }) {
  return (
    <group position={[-0.6, 1.02, 0.2]}>
      <Retro accent={accent} fill={COLORS.screenOff}>
        <boxGeometry args={[0.3, 0.02, 0.22]} />
      </Retro>
      <Retro accent={accent} fill={COLORS.screenOff} position={[0, 0.025, 0]}>
        <boxGeometry args={[0.28, 0.02, 0.2]} />
      </Retro>
    </group>
  )
}

function RecordPlayer({ accent }: { accent: string }) {
  const discRef = useRef<Group>(null)
  useFrame((_, delta) => {
    if (discRef.current) discRef.current.rotation.y += delta * 2.2
  })
  return (
    <group position={[0, 0.71, 0]}>
      <Retro accent={accent}>
        <boxGeometry args={[0.55, 0.06, 0.45]} />
      </Retro>
      <group ref={discRef} position={[-0.05, 0.06, 0]}>
        <Retro accent={accent} fill={COLORS.screenOff}>
          <cylinderGeometry args={[0.18, 0.18, 0.012, 28]} />
        </Retro>
        <mesh position={[0, 0.008, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.01, 12]} />
          <meshBasicMaterial color={accent} />
        </mesh>
      </group>
    </group>
  )
}

function FloorLamp({ accent }: { accent: string }) {
  const [on, setOn] = useState(true)
  const [hovered, setHovered] = useState(false)
  return (
    <group
      position={[-3.15, 0, -2.35]}
      onClick={(e) => {
        e.stopPropagation()
        setOn((v) => !v)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = "pointer"
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = "auto"
      }}
    >
      <Retro accent={accent} position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.14, 0.16, 0.04, 16]} />
      </Retro>
      <Retro accent={accent} position={[0, 1, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 1.9, 8]} />
      </Retro>
      <Retro accent={on ? accent : COLORS.fill} fill={on ? COLORS.fillRaised : COLORS.fill} position={[0, 2, 0]} scale={hovered ? 1.08 : 1}>
        <coneGeometry args={[0.22, 0.32, 16, 1, true]} />
      </Retro>
      {hovered && (
        <Html center position={[0, 2.35, 0]} style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap font-mono text-xs px-3 py-1.5 bg-black border" style={{ color: accent, borderColor: accent }}>
            [ {on ? "power off" : "power on"} ]
          </div>
        </Html>
      )}
    </group>
  )
}

function Mascot({ accent }: { accent: string }) {
  const groupRef = useRef<Group>(null)
  const [greeting, setGreeting] = useState(false)
  const lines = ["> hello_world()", "> chip.exe running", "> try the terminal", "> beep boop"]
  const [line, setLine] = useState(lines[0])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 2) * 0.03
    groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.6) * 0.2
  })

  return (
    <group position={[0.55, 0, -0.85]}>
      <group
        ref={groupRef}
        onClick={(e) => {
          e.stopPropagation()
          setLine(lines[Math.floor(Math.random() * lines.length)])
          setGreeting(true)
          setTimeout(() => setGreeting(false), 1800)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = "pointer"
        }}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        <Retro accent={accent} position={[0, 0.13, 0]}>
          <boxGeometry args={[0.22, 0.2, 0.18]} />
        </Retro>
        <Retro accent={accent} position={[0, 0.32, 0]}>
          <boxGeometry args={[0.16, 0.14, 0.14]} />
        </Retro>
        <mesh position={[0, 0.33, 0.075]}>
          <planeGeometry args={[0.1, 0.04]} />
          <meshBasicMaterial color={accent} />
        </mesh>
        <Retro accent={accent} position={[0, 0.43, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 0.07, 6]} />
        </Retro>
        <mesh position={[0, 0.47, 0]}>
          <sphereGeometry args={[0.018, 8, 8]} />
          <meshBasicMaterial color={accent} />
        </mesh>
      </group>
      {greeting && (
        <Html center position={[0, 0.55, 0]} style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap font-mono text-xs px-3 py-1.5 bg-black border" style={{ color: accent, borderColor: accent }}>
            {line}
          </div>
        </Html>
      )}
    </group>
  )
}

interface SceneProps {
  onSelect: (id: PanelId) => void
  onDownloadResume: () => void
}

export function Scene({ onSelect, onDownloadResume }: SceneProps) {
  const [phosphor, setPhosphor] = useState<"green" | "amber">("green")
  const accent = phosphor === "green" ? COLORS.green : COLORS.amber

  return (
    <group>
      <Room accent={accent} />
      <Desk accent={accent} />

      <Hotspot id="projects" label="Projects" position={[DESK.x, 0, DESK.z + 0.02]} onSelect={onSelect}>
        <Monitor accent={accent} />
      </Hotspot>

      <Hotspot id="contact" label="Contact" position={[DESK.x, 0, DESK.z]} onSelect={onSelect}>
        <Phone accent={accent} />
      </Hotspot>

      <group
        position={[DESK.x, 0, DESK.z]}
        onClick={(e) => {
          e.stopPropagation()
          onDownloadResume()
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = "pointer"
        }}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        <ResumePapers accent={accent} />
      </group>

      <Chair accent={accent} />
      <Mascot accent={accent} />

      <Hotspot id="blog" label="Blog" position={[0, 0, 0]} onSelect={onSelect}>
        <Bookshelf accent={accent} />
      </Hotspot>

      <Hotspot id="about" label="About" position={[0, 0, 0]} onSelect={onSelect}>
        <Diploma accent={accent} />
      </Hotspot>

      <Hotspot id="terminal" label="Terminal" position={[-3.0, 0, 0.75]} onSelect={onSelect}>
        <SideTable accent={accent} position={[0, 0, 0]} />
        <RetroTerminalProp accent={accent} />
      </Hotspot>

      <Hotspot id="interests" label="Interests" position={[-2.9, 0, 1.85]} onSelect={onSelect}>
        <SideTable accent={accent} position={[0, 0, 0]} />
        <RecordPlayer accent={accent} />
      </Hotspot>

      <FloorLamp accent={accent} />
      <TerminalWindow accent={accent} onCycle={() => setPhosphor((p) => (p === "green" ? "amber" : "green"))} />
      <WallClock accent={accent} />
    </group>
  )
}
