"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { RoundedBox, ContactShadows, Sparkles, Html } from "@react-three/drei"
import { DoubleSide, type Group, type Mesh } from "three"
import { Hotspot } from "./hotspot"
import type { PanelId } from "./types"

const COLORS = {
  floor: "#e8ddc9",
  floorDark: "#2a2440",
  rug: "#f4a896",
  wallBack: "#f2eef9",
  wallBackDark: "#221f38",
  wallSide: "#eae6f5",
  wallSideDark: "#1e1b32",
  wood: "#c9a876",
  woodDark: "#b08e63",
  indigo: "#7c5cfc",
  sky: "#5ec8f5",
  mint: "#52cf9e",
  peach: "#fbaa61",
  pink: "#f28fc0",
  cream: "#faf6ee",
  screen: "#3b3560",
  night: "#171335",
}

// Desk sits against the back-right corner of the (now smaller) room.
const DESK = { x: 1.55, y: 0, z: -1.95 }

function Room({ isDark }: { isDark: boolean }) {
  return (
    <group>
      <RoundedBox args={[7, 0.2, 5.4]} radius={0.08} position={[0, -0.1, 0]} receiveShadow>
        <meshStandardMaterial color={isDark ? COLORS.floorDark : COLORS.floor} />
      </RoundedBox>
      <mesh position={[0.2, 0.011, 0.4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.4, 32]} />
        <meshStandardMaterial color={COLORS.rug} />
      </mesh>
      <RoundedBox args={[7, 4.2, 0.2]} radius={0.06} position={[0, 2, -2.8]} receiveShadow>
        <meshStandardMaterial color={isDark ? COLORS.wallBackDark : COLORS.wallBack} />
      </RoundedBox>
      <RoundedBox args={[0.2, 4.2, 5.4]} radius={0.06} position={[-3.6, 2, 0]} receiveShadow>
        <meshStandardMaterial color={isDark ? COLORS.wallSideDark : COLORS.wallSide} />
      </RoundedBox>
    </group>
  )
}

function Window({ isDark, onToggleTheme }: { isDark: boolean; onToggleTheme: () => void }) {
  const [hovered, setHovered] = useState(false)
  const paneColor = isDark ? COLORS.night : COLORS.sky
  return (
    <group
      position={[1.2, 2.25, -2.68]}
      onClick={(e) => {
        e.stopPropagation()
        onToggleTheme()
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
      scale={hovered ? 1.04 : 1}
    >
      <mesh>
        <planeGeometry args={[1.4, 1.2]} />
        <meshStandardMaterial color={paneColor} emissive={paneColor} emissiveIntensity={isDark ? 0.5 : 0.4} />
      </mesh>
      {isDark && <Sparkles count={12} scale={[1.2, 1, 0.1]} size={2.5} speed={0.3} color="#ffffff" />}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[1.48, 0.06, 0.04]} />
        <meshStandardMaterial color={COLORS.cream} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[0.06, 1.28, 0.04]} />
        <meshStandardMaterial color={COLORS.cream} />
      </mesh>
      {hovered && (
        <Html center position={[0, 0.85, 0]} style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap rounded-full bg-black/80 text-white text-xs font-medium px-3 py-1.5 shadow-lg">
            Toggle day / night
          </div>
        </Html>
      )}
      {/* dust motes drifting through the light */}
      <Sparkles count={18} scale={[2.5, 2, 1.5]} position={[0, -0.8, 1.2]} size={1.5} speed={0.15} opacity={0.5} color={isDark ? "#cfd0ff" : "#ffffff"} />
    </group>
  )
}

function WallClock() {
  const secondHand = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    if (secondHand.current) secondHand.current.rotation.z = -clock.elapsedTime * 0.9
  })
  return (
    <group position={[2.3, 2.85, -2.68]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.05, 24]} />
        <meshStandardMaterial color={COLORS.cream} />
      </mesh>
      <mesh ref={secondHand} position={[0, 0, 0.03]}>
        <boxGeometry args={[0.02, 0.24, 0.01]} />
        <meshStandardMaterial color={COLORS.pink} />
      </mesh>
    </group>
  )
}

function Desk() {
  return (
    <group position={[DESK.x, DESK.y, DESK.z]}>
      <RoundedBox args={[2, 0.12, 0.9]} radius={0.05} position={[0, 1, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={COLORS.wood} />
      </RoundedBox>
      {[
        [-0.9, -0.35],
        [0.9, -0.35],
        [-0.9, 0.35],
        [0.9, 0.35],
      ].map(([sx, sz], i) => (
        <RoundedBox key={i} args={[0.1, 0.95, 0.1]} radius={0.03} position={[sx, 0.5, sz]} castShadow>
          <meshStandardMaterial color={COLORS.woodDark} />
        </RoundedBox>
      ))}
      <RoundedBox args={[0.5, 0.04, 0.18]} radius={0.02} position={[0, 1.08, 0.22]} castShadow>
        <meshStandardMaterial color={COLORS.cream} />
      </RoundedBox>
    </group>
  )
}

function Monitor({ isDark }: { isDark: boolean }) {
  const screenRef = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    const mat = screenRef.current?.material as any
    if (mat) mat.emissiveIntensity = 0.55 + Math.sin(clock.elapsedTime * 2.4) * 0.12
  })
  return (
    <group position={[0, 1.06, -0.15]}>
      <RoundedBox args={[0.1, 0.32, 0.1]} radius={0.02} position={[0, 0.16, 0]} castShadow>
        <meshStandardMaterial color="#2b2b30" />
      </RoundedBox>
      <RoundedBox args={[0.85, 0.56, 0.06]} radius={0.03} position={[0, 0.58, 0]} castShadow>
        <meshStandardMaterial color="#2b2b30" />
      </RoundedBox>
      <mesh ref={screenRef} position={[0, 0.58, 0.035]}>
        <planeGeometry args={[0.73, 0.45]} />
        <meshStandardMaterial color={COLORS.screen} emissive={isDark ? COLORS.sky : COLORS.indigo} emissiveIntensity={0.55} />
      </mesh>
    </group>
  )
}

function Chair() {
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
        <RoundedBox args={[0.5, 0.08, 0.5]} radius={0.04} position={[0, 0.55, 0]} castShadow>
          <meshStandardMaterial color={COLORS.indigo} />
        </RoundedBox>
        <RoundedBox args={[0.5, 0.55, 0.08]} radius={0.04} position={[0, 0.88, -0.22]} castShadow>
          <meshStandardMaterial color={COLORS.indigo} />
        </RoundedBox>
        <mesh position={[0, 0.27, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.55, 12]} />
          <meshStandardMaterial color="#2b2b30" />
        </mesh>
        <mesh position={[0, 0.02, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.03, 24]} />
          <meshStandardMaterial color="#2b2b30" />
        </mesh>
      </group>
    </group>
  )
}

function Bookshelf() {
  const books = [
    { color: COLORS.indigo, h: 0.42 },
    { color: COLORS.sky, h: 0.38 },
    { color: COLORS.mint, h: 0.46 },
    { color: COLORS.peach, h: 0.34 },
  ]
  return (
    <group position={[-3.15, 0, -1.0]}>
      <RoundedBox args={[0.6, 2.3, 0.85]} radius={0.04} position={[0, 1.15, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={COLORS.wood} />
      </RoundedBox>
      {[0.45, 1.1, 1.75].map((shelfY, si) => (
        <group key={si} position={[0.13, shelfY, 0]}>
          <RoundedBox args={[0.65, 0.05, 0.9]} radius={0.02} castShadow>
            <meshStandardMaterial color={COLORS.woodDark} />
          </RoundedBox>
          {books.map((book, bi) => (
            <RoundedBox
              key={bi}
              args={[0.055, book.h, 0.34]}
              radius={0.01}
              position={[0.04, book.h / 2 + 0.03, -0.28 + bi * 0.19]}
              castShadow
            >
              <meshStandardMaterial color={book.color} />
            </RoundedBox>
          ))}
        </group>
      ))}
    </group>
  )
}

function Diploma() {
  return (
    <group position={[-0.85, 2.15, -2.67]}>
      <RoundedBox args={[0.85, 1.05, 0.07]} radius={0.03} castShadow>
        <meshStandardMaterial color={COLORS.peach} />
      </RoundedBox>
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[0.68, 0.86]} />
        <meshStandardMaterial color={COLORS.cream} />
      </mesh>
      <mesh position={[0, 0.02, 0.05]}>
        <planeGeometry args={[0.4, 0.05]} />
        <meshStandardMaterial color={COLORS.indigo} />
      </mesh>
      <mesh position={[0, -0.12, 0.05]}>
        <planeGeometry args={[0.5, 0.03]} />
        <meshStandardMaterial color={COLORS.woodDark} />
      </mesh>
    </group>
  )
}

function SideTable({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <RoundedBox args={[0.75, 0.07, 0.55]} radius={0.03} position={[0, 0.7, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={COLORS.wood} />
      </RoundedBox>
      {[
        [-0.3, -0.2],
        [0.3, -0.2],
        [-0.3, 0.2],
        [0.3, 0.2],
      ].map(([sx, sz], i) => (
        <RoundedBox key={i} args={[0.06, 0.65, 0.06]} radius={0.02} position={[sx, 0.34, sz]} castShadow>
          <meshStandardMaterial color={COLORS.woodDark} />
        </RoundedBox>
      ))}
    </group>
  )
}

function RetroTerminal() {
  const screenRef = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    const mat = screenRef.current?.material as any
    if (mat) mat.emissiveIntensity = clock.elapsedTime % 1 > 0.85 ? 0.15 : 0.85
  })
  return (
    <group position={[0, 0.74, 0]}>
      <RoundedBox args={[0.5, 0.46, 0.46]} radius={0.06} castShadow>
        <meshStandardMaterial color={COLORS.cream} />
      </RoundedBox>
      <mesh ref={screenRef} position={[0, 0.02, 0.24]}>
        <planeGeometry args={[0.32, 0.25]} />
        <meshStandardMaterial color="#0d1a12" emissive={COLORS.mint} emissiveIntensity={0.85} />
      </mesh>
    </group>
  )
}

function Phone() {
  return (
    <group position={[0.75, 1.06, -0.1]} rotation={[0, 0.3, 0]}>
      <RoundedBox args={[0.34, 0.08, 0.3]} radius={0.03} castShadow>
        <meshStandardMaterial color={COLORS.pink} />
      </RoundedBox>
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.02, 20]} />
        <meshStandardMaterial color={COLORS.cream} />
      </mesh>
      <group position={[0.02, 0.14, 0.02]} rotation={[0, 0, 0.5]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.035, 0.22, 4, 8]} />
          <meshStandardMaterial color={COLORS.pink} />
        </mesh>
      </group>
    </group>
  )
}

function ResumePapers() {
  return (
    <group position={[-0.6, 1.03, 0.2]}>
      <RoundedBox args={[0.3, 0.03, 0.22]} radius={0.01} castShadow>
        <meshStandardMaterial color="#ffffff" />
      </RoundedBox>
      <RoundedBox args={[0.28, 0.03, 0.2]} radius={0.01} position={[0, 0.03, 0]} castShadow>
        <meshStandardMaterial color="#ffffff" />
      </RoundedBox>
    </group>
  )
}

function RecordPlayer() {
  const discRef = useRef<Group>(null)
  useFrame((_, delta) => {
    if (discRef.current) discRef.current.rotation.y += delta * 2.2
  })
  return (
    <group position={[0, 0.71, 0]}>
      <RoundedBox args={[0.6, 0.08, 0.5]} radius={0.03} castShadow>
        <meshStandardMaterial color={COLORS.wood} />
      </RoundedBox>
      <group ref={discRef} position={[-0.06, 0.065, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.015, 32]} />
          <meshStandardMaterial color="#232028" />
        </mesh>
        <mesh position={[0, 0.01, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.01, 16]} />
          <meshStandardMaterial color={COLORS.pink} />
        </mesh>
      </group>
      <mesh position={[0.22, 0.09, -0.12]} rotation={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.16, 0.015, 0.02]} />
        <meshStandardMaterial color="#2b2b30" />
      </mesh>
    </group>
  )
}

function FloorLamp() {
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
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.18, 0.04, 20]} />
        <meshStandardMaterial color="#2b2b30" />
      </mesh>
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.022, 0.022, 1.9, 10]} />
        <meshStandardMaterial color="#2b2b30" />
      </mesh>
      <mesh position={[0, 2, 0]} castShadow scale={hovered ? 1.08 : 1}>
        <coneGeometry args={[0.25, 0.35, 20, 1, true]} />
        <meshStandardMaterial
          color={COLORS.peach}
          emissive={COLORS.peach}
          emissiveIntensity={on ? 0.6 : 0}
          side={DoubleSide}
        />
      </mesh>
      {on && <pointLight position={[0, 1.9, 0]} intensity={7} distance={3.6} color={COLORS.peach} />}
      {hovered && (
        <Html center position={[0, 2.4, 0]} style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap rounded-full bg-black/80 text-white text-xs font-medium px-3 py-1.5 shadow-lg">
            {on ? "Turn off lamp" : "Turn on lamp"}
          </div>
        </Html>
      )}
    </group>
  )
}

function Mascot() {
  const groupRef = useRef<Group>(null)
  const [greeting, setGreeting] = useState(false)
  const greetings = ["Hi, I'm Chip! 👋", "Welcome in!", "Try the record player 🎵", "Beep boop 🤖"]
  const [line, setLine] = useState(greetings[0])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 2) * 0.04
    groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.6) * 0.25
  })

  return (
    <group position={[0.55, 0, -0.85]}>
      <group
        ref={groupRef}
        onClick={(e) => {
          e.stopPropagation()
          setLine(greetings[Math.floor(Math.random() * greetings.length)])
          setGreeting(true)
          setTimeout(() => setGreeting(false), 1800)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = "pointer"
        }}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        <mesh position={[0, 0.14, 0]} castShadow>
          <sphereGeometry args={[0.14, 20, 20]} />
          <meshStandardMaterial color={COLORS.mint} />
        </mesh>
        <mesh position={[0, 0.34, 0]} castShadow>
          <sphereGeometry args={[0.1, 20, 20]} />
          <meshStandardMaterial color={COLORS.mint} />
        </mesh>
        <mesh position={[-0.04, 0.35, 0.08]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0.04, 0.35, 0.08]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.08, 6]} />
          <meshStandardMaterial color="#2b2b30" />
        </mesh>
        <mesh position={[0, 0.49, 0]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color={COLORS.pink} emissive={COLORS.pink} emissiveIntensity={0.6} />
        </mesh>
      </group>
      {greeting && (
        <Html center position={[0, 0.55, 0]} style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap rounded-2xl bg-white text-foreground text-xs font-semibold px-3 py-1.5 shadow-lg">
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
  isDark: boolean
  onToggleTheme: () => void
}

export function Scene({ onSelect, onDownloadResume, isDark, onToggleTheme }: SceneProps) {
  return (
    <group>
      <Room isDark={isDark} />
      <Desk />

      <Hotspot id="projects" label="Projects" position={[DESK.x, 0, DESK.z + 0.02]} onSelect={onSelect}>
        <Monitor isDark={isDark} />
      </Hotspot>

      <Hotspot id="contact" label="Contact" position={[DESK.x, 0, DESK.z]} onSelect={onSelect}>
        <Phone />
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
        <ResumePapers />
      </group>

      <Chair />
      <Mascot />

      <Hotspot id="blog" label="Blog" position={[0, 0, 0]} onSelect={onSelect}>
        <Bookshelf />
      </Hotspot>

      <Hotspot id="about" label="About" position={[0, 0, 0]} onSelect={onSelect}>
        <Diploma />
      </Hotspot>

      <Hotspot id="terminal" label="Terminal" position={[-3.0, 0, 0.75]} onSelect={onSelect}>
        <SideTable position={[0, 0, 0]} />
        <RetroTerminal />
      </Hotspot>

      <Hotspot id="interests" label="Interests" position={[-2.9, 0, 1.85]} onSelect={onSelect}>
        <SideTable position={[0, 0, 0]} />
        <RecordPlayer />
      </Hotspot>

      <FloorLamp />
      <Window isDark={isDark} onToggleTheme={onToggleTheme} />
      <WallClock />

      <ContactShadows position={[0, 0, 0]} opacity={isDark ? 0.5 : 0.35} scale={8} blur={2} far={4} />
    </group>
  )
}
