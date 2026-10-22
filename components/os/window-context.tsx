"use client"

import { createContext, useContext } from "react"

/**
 * True when an app is shown narrow: always on a phone, and on the desktop when
 * its window is resized down. Apps swap sidebars for tab rows and split views
 * for list → detail when it's set.
 */
export const CompactContext = createContext(false)

export const useCompact = () => useContext(CompactContext)
