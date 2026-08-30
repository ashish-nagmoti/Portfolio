"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { Scene } from "./scene"
import type { PanelId } from "./types"

interface RoomCanvasProps {
  onSelect: (id: PanelId) => void
  onDownloadResume: () => void
}

export function RoomCanvas({ onSelect, onDownloadResume }: RoomCanvasProps) {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [6, 4.6, 6.6], fov: 42 }} className="!touch-none">
      <color attach="background" args={["#08090b"]} />
      <fog attach="fog" args={["#08090b", 9, 16]} />
      <Suspense fallback={null}>
        <Scene onSelect={onSelect} onDownloadResume={onDownloadResume} />
      </Suspense>
      <OrbitControls
        enablePan={false}
        minDistance={4.5}
        maxDistance={9}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2.3}
        minAzimuthAngle={-Math.PI / 2.4}
        maxAzimuthAngle={Math.PI / 5}
        target={[-0.3, 0.9, -0.5]}
        enableDamping
        dampingFactor={0.08}
      />
    </Canvas>
  )
}
