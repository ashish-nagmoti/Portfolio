export type AppId = "about" | "projects" | "terminal" | "contact" | "blog" | "interests"

export interface OpenWindow {
  id: AppId
  zIndex: number
  minimized: boolean
  maximized: boolean
  pos: { x: number; y: number }
  size: { width: number; height: number }
}
