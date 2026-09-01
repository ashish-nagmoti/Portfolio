import * as React from "react"

// Phones are identified by their short side, not raw width, so a phone
// rotated to landscape (e.g. 852x393) still counts as a phone — unlike a
// width-only check, which would misclassify it as a desktop viewport.
const PHONE_MAX_DIMENSION = 500

function computePhoneOrientation() {
  if (typeof window === "undefined") return { isPhone: false, isPortrait: false }
  const w = window.innerWidth
  const h = window.innerHeight
  return { isPhone: Math.min(w, h) < PHONE_MAX_DIMENSION, isPortrait: h > w }
}

export function usePhoneOrientation() {
  const [state, setState] = React.useState(() => computePhoneOrientation())

  React.useEffect(() => {
    const update = () => setState(computePhoneOrientation())
    update()
    window.addEventListener("resize", update)
    window.addEventListener("orientationchange", update)
    return () => {
      window.removeEventListener("resize", update)
      window.removeEventListener("orientationchange", update)
    }
  }, [])

  return state
}

// The OS shell only ever mounts the desktop UI once a phone is rotated to
// landscape (portrait phones see a rotate prompt instead), so "mobile" here
// means "phone held upright" — everywhere this is still true, the compact
// iOS-style layout applies; everywhere it's false, the full desktop UI
// renders, including on a landscape phone.
export function useIsMobile() {
  const { isPhone, isPortrait } = usePhoneOrientation()
  return isPhone && isPortrait
}
