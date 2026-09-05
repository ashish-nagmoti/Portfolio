// macOS icons use a "squircle" — a continuous-curvature superellipse, not a
// circular-arc rounded rect. CSS border-radius can't produce that curve, so
// this defines it once as an SVG clipPath (objectBoundingBox scales it to
// whatever size each icon renders at) and every icon references it via the
// `.squircle` utility class in globals.css.
export function SquircleDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden focusable="false">
      <defs>
        <clipPath id="squircle-clip" clipPathUnits="objectBoundingBox">
          <path d="M0.22,0 L0.78,0 C0.912,0 1,0.088 1,0.22 L1,0.78 C1,0.912 0.912,1 0.78,1 L0.22,1 C0.088,1 0,0.912 0,0.78 L0,0.22 C0,0.088 0.088,0 0.22,0 Z" />
        </clipPath>
      </defs>
    </svg>
  )
}
