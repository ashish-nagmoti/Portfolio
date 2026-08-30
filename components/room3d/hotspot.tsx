"use client"

import { useRef, useState, type ReactNode } from "react"
import { useFrame } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import { MathUtils, type Group } from "three"
import type { PanelId } from "./types"

interface HotspotProps {
  id: PanelId
  label: string
  position: [number, number, number]
  onSelect: (id: PanelId) => void
  children: ReactNode
}

export function Hotspot({ id, label, position, onSelect, children }: HotspotProps) {
  const [hovered, setHovered] = useState(false)
  const groupRef = useRef<Group>(null)

  useFrame(() => {
    if (!groupRef.current) return
    const target = hovered ? 1.08 : 1
    const s = groupRef.current.scale
    s.x = MathUtils.lerp(s.x, target, 0.15)
    s.y = MathUtils.lerp(s.y, target, 0.15)
    s.z = MathUtils.lerp(s.z, target, 0.15)
  })

  return (
    <group
      position={position}
      ref={groupRef}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = "pointer"
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        setHovered(false)
        document.body.style.cursor = "auto"
      }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(id)
      }}
    >
      {children}
      {hovered && (
        <Html center position={[0, 1.15, 0]} style={{ pointerEvents: "none" }} zIndexRange={[100, 0]}>
          <div className="whitespace-nowrap rounded-full bg-black/80 text-white text-xs font-medium px-3 py-1.5 shadow-lg">
            {label}
          </div>
        </Html>
      )}
    </group>
  )
}
