"use client"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { useHistory } from "./history-context"

export interface BackgroundProperties {
  borderRadius: number
  shadowSize: "none" | "sm" | "md" | "lg" | "xl" | "2xl"
  gradientType: "none" | "linear" | "radial"
  gradientAngle: number
  gradientStartColor: string
  gradientEndColor: string
  backgroundColor: string
}

const defaultProperties: BackgroundProperties = {
  borderRadius: 8,
  shadowSize: "none",
  gradientType: "none",
  gradientAngle: 45,
  gradientStartColor: "#ffffff",
  gradientEndColor: "#000000",
  backgroundColor: "#ffffff"
}

// Shadow presets
export const SHADOW_PRESETS = {
  none: "none",
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)"
} as const

interface BackgroundContextType {
  properties: BackgroundProperties
  setProperties: (properties: Partial<BackgroundProperties>) => void
}

const BackgroundContext = createContext<BackgroundContextType | null>(null)

export function BackgroundProvider({ children }: { children: React.ReactNode }) {
  const [properties, setPropertiesState] = useState<BackgroundProperties>(defaultProperties)
  const { pushState, currentState } = useHistory()

  const setProperties = useCallback((newProperties: Partial<BackgroundProperties>) => {
    setPropertiesState(prev => {
      const updated = { ...prev, ...newProperties }
      return updated
    })
    // Push state after the state update is complete
    pushState({
      background: { ...properties, ...newProperties },
      icon: null
    })
  }, [pushState, properties])

  // Listen to history changes
  useEffect(() => {
    if (currentState.background) {
      setPropertiesState(currentState.background)
    }
  }, [currentState])

  return (
    <BackgroundContext.Provider value={{ properties, setProperties }}>
      {children}
    </BackgroundContext.Provider>
  )
}

export function useBackground() {
  const context = useContext(BackgroundContext)
  if (!context) {
    throw new Error("useBackground must be used within a BackgroundProvider")
  }
  return context
}
