"use client"

import { RoundedBox, ContactShadows } from "@react-three/drei"
import { Hotspot } from "./hotspot"
import type { PanelId } from "./types"

const COLORS = {
  floor: "#e8ddc9",
  rug: "#f4a896",
  wallBack: "#f2eef9",
  wallSide: "#eae6f5",
  wood: "#c9a876",
  woodDark: "#b08e63",
  indigo: "#7c5cfc",
  sky: "#5ec8f5",
  mint: "#52cf9e",
  peach: "#fbaa61",
  pink: "#f28fc0",
  cream: "#faf6ee",
  screen: "#3b3560",
}

function Room() {
  return (
    <group>
      {/* Floor */}
      <RoundedBox args={[9, 0.2, 7]} radius={0.08} position={[0, -0.1, 0]} receiveShadow>
        <meshStandardMaterial color={COLORS.floor} />
      </RoundedBox>
      {/* Rug */}
      <mesh position={[0.3, 0.011, 0.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.8, 32]} />
        <meshStandardMaterial color={COLORS.rug} />
      </mesh>
      {/* Back wall */}
      <RoundedBox args={[9, 4.2, 0.2]} radius={0.06} position={[0, 2, -3.4]} receiveShadow>
        <meshStandardMaterial color={COLORS.wallBack} />
      </RoundedBox>
      {/* Side wall */}
      <RoundedBox args={[0.2, 4.2, 7]} radius={0.06} position={[-4.4, 2, 0]} receiveShadow>
        <meshStandardMaterial color={COLORS.wallSide} />
      </RoundedBox>
      {/* Window */}
      <group position={[1.6, 2.4, -3.28]}>
        <mesh>
          <planeGeometry args={[1.6, 1.4]} />
          <meshStandardMaterial color={COLORS.sky} emissive={COLORS.sky} emissiveIntensity={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[1.68, 0.06, 0.04]} />
          <meshStandardMaterial color={COLORS.cream} />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[0.06, 1.48, 0.04]} />
          <meshStandardMaterial color={COLORS.cream} />
        </mesh>
      </group>
      {/* Wall clock */}
      <mesh position={[-1.6, 3, -3.28]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.05, 24]} />
        <meshStandardMaterial color={COLORS.cream} />
      </mesh>
    </group>
  )
}

function Desk() {
  return (
    <group position={[2.1, 0, -2.5]}>
      <RoundedBox args={[2.2, 0.12, 1]} radius={0.05} position={[0, 1, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={COLORS.wood} />
      </RoundedBox>
      {[
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ].map(([sx, sz], i) => (
        <RoundedBox
          key={i}
          args={[0.1, 0.95, 0.1]}
          radius={0.03}
          position={[sx * 1, 0.5, sz * 0.4]}
          castShadow
        >
          <meshStandardMaterial color={COLORS.woodDark} />
        </RoundedBox>
      ))}
      {/* keyboard */}
      <RoundedBox args={[0.55, 0.04, 0.2]} radius={0.02} position={[0, 1.08, 0.28]} castShadow>
        <meshStandardMaterial color={COLORS.cream} />
      </RoundedBox>
    </group>
  )
}

function Monitor() {
  return (
    <group position={[0, 1.06, -0.1]}>
      <RoundedBox args={[0.1, 0.35, 0.1]} radius={0.02} position={[0, 0.17, 0]} castShadow>
        <meshStandardMaterial color="#2b2b30" />
      </RoundedBox>
      <RoundedBox args={[0.95, 0.62, 0.06]} radius={0.03} position={[0, 0.62, 0]} castShadow>
        <meshStandardMaterial color="#2b2b30" />
      </RoundedBox>
      <mesh position={[0, 0.62, 0.035]}>
        <planeGeometry args={[0.82, 0.5]} />
        <meshStandardMaterial color={COLORS.screen} emissive={COLORS.indigo} emissiveIntensity={0.6} />
      </mesh>
    </group>
  )
}

function Chair() {
  return (
    <group position={[2.1, 0, -1.35]} rotation={[0, Math.PI, 0]}>
      <RoundedBox args={[0.55, 0.08, 0.55]} radius={0.04} position={[0, 0.55, 0]} castShadow>
        <meshStandardMaterial color={COLORS.indigo} />
      </RoundedBox>
      <RoundedBox args={[0.55, 0.6, 0.08]} radius={0.04} position={[0, 0.9, -0.24]} castShadow>
        <meshStandardMaterial color={COLORS.indigo} />
      </RoundedBox>
      <mesh position={[0, 0.27, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.55, 12]} />
        <meshStandardMaterial color="#2b2b30" />
      </mesh>
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.03, 24]} />
        <meshStandardMaterial color="#2b2b30" />
      </mesh>
    </group>
  )
}

function Bookshelf() {
  const books = [
    { color: COLORS.indigo, h: 0.5 },
    { color: COLORS.sky, h: 0.45 },
    { color: COLORS.mint, h: 0.55 },
    { color: COLORS.peach, h: 0.4 },
    { color: COLORS.pink, h: 0.48 },
  ]
  return (
    <group position={[-4.05, 0, -1.4]}>
      <RoundedBox args={[0.7, 2.6, 1]} radius={0.04} position={[0, 1.3, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={COLORS.wood} />
      </RoundedBox>
      {[0.55, 1.3, 2.05].map((shelfY, si) => (
        <group key={si} position={[0.15, shelfY, 0]}>
          <RoundedBox args={[0.75, 0.05, 1.05]} radius={0.02} position={[0, 0, 0]} castShadow>
            <meshStandardMaterial color={COLORS.woodDark} />
          </RoundedBox>
          {books.map((book, bi) => (
            <RoundedBox
              key={bi}
              args={[0.06, book.h, 0.4]}
              radius={0.01}
              position={[0.05, book.h / 2 + 0.03, -0.35 + bi * 0.18]}
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

function PictureFrame() {
  return (
    <group position={[-0.6, 2.4, -3.27]}>
      <RoundedBox args={[0.95, 1.15, 0.08]} radius={0.03} castShadow>
        <meshStandardMaterial color={COLORS.wood} />
      </RoundedBox>
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[0.75, 0.95]} />
        <meshStandardMaterial color={COLORS.indigo} />
      </mesh>
    </group>
  )
}

function SideTable({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <RoundedBox args={[0.9, 0.08, 0.6]} radius={0.03} position={[0, 0.75, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={COLORS.wood} />
      </RoundedBox>
      {[
        [-0.36, -0.22],
        [0.36, -0.22],
        [-0.36, 0.22],
        [0.36, 0.22],
      ].map(([sx, sz], i) => (
        <RoundedBox key={i} args={[0.07, 0.7, 0.07]} radius={0.02} position={[sx, 0.36, sz]} castShadow>
          <meshStandardMaterial color={COLORS.woodDark} />
        </RoundedBox>
      ))}
    </group>
  )
}

function RetroTerminal() {
  return (
    <group position={[0, 0.79, 0]}>
      <RoundedBox args={[0.55, 0.5, 0.5]} radius={0.06} castShadow>
        <meshStandardMaterial color={COLORS.cream} />
      </RoundedBox>
      <mesh position={[0, 0.03, 0.26]}>
        <planeGeometry args={[0.36, 0.28]} />
        <meshStandardMaterial color="#0d1a12" emissive={COLORS.mint} emissiveIntensity={0.8} />
      </mesh>
    </group>
  )
}

function Mailbox() {
  return (
    <group position={[3.35, 1.13, -2.35]}>
      <RoundedBox args={[0.32, 0.24, 0.28]} radius={0.03} castShadow>
        <meshStandardMaterial color={COLORS.pink} />
      </RoundedBox>
      <RoundedBox args={[0.04, 0.18, 0.04]} radius={0.01} position={[0.19, 0.05, 0]} castShadow>
        <meshStandardMaterial color={COLORS.woodDark} />
      </RoundedBox>
      <RoundedBox args={[0.1, 0.1, 0.02]} radius={0.01} position={[0.19, 0.16, 0]} rotation={[0, 0, 0.5]} castShadow>
        <meshStandardMaterial color="#e53e3e" />
      </RoundedBox>
    </group>
  )
}

function Plant() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.28, 0.42, 16]} />
        <meshStandardMaterial color={COLORS.peach} />
      </mesh>
      {[
        [0, 0.65, 0, 0.26],
        [0.15, 0.5, 0.1, 0.18],
        [-0.16, 0.48, -0.08, 0.19],
        [0.05, 0.78, -0.12, 0.16],
      ].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x as number, y as number, z as number]} castShadow>
          <sphereGeometry args={[r as number, 12, 12]} />
          <meshStandardMaterial color={COLORS.mint} />
        </mesh>
      ))}
    </group>
  )
}

function FloorLamp() {
  return (
    <group position={[-3.6, 0, -2.9]}>
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.2, 0.04, 20]} />
        <meshStandardMaterial color="#2b2b30" />
      </mesh>
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 2.1, 10]} />
        <meshStandardMaterial color="#2b2b30" />
      </mesh>
      <mesh position={[0, 2.25, 0]} castShadow>
        <coneGeometry args={[0.28, 0.4, 20, 1, true]} />
        <meshStandardMaterial color={COLORS.peach} emissive={COLORS.peach} emissiveIntensity={0.5} side={2} />
      </mesh>
      <pointLight position={[0, 2.15, 0]} intensity={8} distance={4} color={COLORS.peach} />
    </group>
  )
}

interface SceneProps {
  onSelect: (id: PanelId) => void
  onDownloadResume: () => void
}

export function Scene({ onSelect, onDownloadResume }: SceneProps) {
  return (
    <group>
      <Room />
      <Desk />

      <Hotspot id="projects" label="Projects" position={[2.1, 0, -2.6]} onSelect={onSelect}>
        <Monitor />
      </Hotspot>

      <Hotspot id="contact" label="Contact" position={[0, 0, 0]} onSelect={onSelect}>
        <Mailbox />
      </Hotspot>

      <Chair />

      <group
        position={[1.35, 1.03, -2.28]}
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
        <RoundedBox args={[0.32, 0.03, 0.24]} radius={0.01} position={[0, 0, 0]} castShadow>
          <meshStandardMaterial color="#ffffff" />
        </RoundedBox>
        <RoundedBox args={[0.3, 0.03, 0.22]} radius={0.01} position={[0, 0.03, 0]} castShadow>
          <meshStandardMaterial color="#ffffff" />
        </RoundedBox>
      </group>

      <Hotspot id="blog" label="Blog" position={[0, 0, 0]} onSelect={onSelect}>
        <Bookshelf />
      </Hotspot>

      <Hotspot id="about" label="About" position={[0, 0, 0]} onSelect={onSelect}>
        <PictureFrame />
      </Hotspot>

      <Hotspot id="terminal" label="Terminal" position={[-3.6, 0, 0.9]} onSelect={onSelect}>
        <SideTable position={[0, 0, 0]} />
        <RetroTerminal />
      </Hotspot>

      <Hotspot id="interests" label="Interests" position={[-3.4, 0, 2]} onSelect={onSelect}>
        <Plant />
      </Hotspot>

      <FloorLamp />

      <ContactShadows position={[0, 0, 0]} opacity={0.35} scale={10} blur={2} far={4} />
    </group>
  )
}
