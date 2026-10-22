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

// A phone in either orientation gets the iOS-style home screen; tablets and
// computers get the desktop. (Sideways, a phone is only ~390px tall: too
// short for menu bar + windows + dock.)
export function useIsMobile() {
  return usePhoneOrientation().isPhone
}
