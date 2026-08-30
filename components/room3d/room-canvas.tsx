"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { Scene } from "./scene"
import type { PanelId } from "./types"

interface RoomCanvasProps {
  onSelect: (id: PanelId) => void
  onDownloadResume: () => void
}

export function RoomCanvas({ onSelect, onDownloadResume }: RoomCanvasProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [7.5, 5.5, 8], fov: 40 }}
      className="!touch-none"
    >
      <color attach="background" args={["#eef0f8"]} />
      <fog attach="fog" args={["#eef0f8", 14, 26]} />
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[6, 8, 4]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <Suspense fallback={null}>
        <Scene onSelect={onSelect} onDownloadResume={onDownloadResume} />
        <Environment preset="apartment" environmentIntensity={0.4} />
      </Suspense>
      <OrbitControls
        enablePan={false}
        minDistance={6}
        maxDistance={13}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2.3}
        minAzimuthAngle={-Math.PI / 2.4}
        maxAzimuthAngle={Math.PI / 5}
        target={[-0.3, 1, -0.5]}
        enableDamping
        dampingFactor={0.08}
      />
    </Canvas>
  )
}
