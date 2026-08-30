"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { Scene } from "./scene"
import type { PanelId } from "./types"

interface RoomCanvasProps {
  onSelect: (id: PanelId) => void
  onDownloadResume: () => void
  isDark: boolean
  onToggleTheme: () => void
}

export function RoomCanvas({ onSelect, onDownloadResume, isDark, onToggleTheme }: RoomCanvasProps) {
  const bg = isDark ? "#1a1830" : "#eef0f8"

  return (
    <Canvas shadows dpr={[1, 1.5]} camera={{ position: [6, 4.6, 6.6], fov: 42 }} className="!touch-none">
      <color attach="background" args={[bg]} />
      <fog attach="fog" args={[bg, 11, 20]} />
      <ambientLight intensity={isDark ? 0.35 : 0.7} />
      <directionalLight
        position={[5, 7, 3]}
        intensity={isDark ? 0.5 : 1.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <Suspense fallback={null}>
        <Scene onSelect={onSelect} onDownloadResume={onDownloadResume} isDark={isDark} onToggleTheme={onToggleTheme} />
        <Environment preset={isDark ? "night" : "apartment"} environmentIntensity={isDark ? 0.25 : 0.4} />
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
