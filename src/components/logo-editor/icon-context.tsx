"use client"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { useHistory } from "./history-context"

export interface IconProperties {
  size: number
  rotation: number
  strokeWidth: number
  fillColor: string
  opacity: number
}

const defaultProperties: IconProperties = {
  size: 128,
  rotation: 0,
  strokeWidth: 2,
  fillColor: "#000000",
  opacity: 1,
}

interface IconContextType {
  properties: IconProperties
  setProperties: (properties: Partial<IconProperties>) => void
  selectedIcon: string | null
  setSelectedIcon: (icon: string | null) => void
}

const IconContext = createContext<IconContextType | null>(null)

export function IconProvider({ children }: { children: React.ReactNode }) {
  const [properties, setPropertiesState] = useState<IconProperties>(defaultProperties)
  const [selectedIcon, setSelectedIconState] = useState<string | null>("Star") 
  const { pushState, currentState } = useHistory()

  const setProperties = useCallback((newProperties: Partial<IconProperties>) => {
    setPropertiesState(prev => {
      const updated = { ...prev, ...newProperties }
      return updated
    })
    // Push state after the state update is complete
    pushState({
      icon: { ...properties, ...newProperties },
      background: null
    })
  }, [pushState, properties])

  const setSelectedIcon = useCallback((icon: string | null) => {
    setSelectedIconState(icon)
  }, [])

  useEffect(() => {
    if (currentState.icon) {
      setPropertiesState(currentState.icon)
    }
  }, [currentState])

  return (
    <IconContext.Provider value={{ properties, setProperties, selectedIcon, setSelectedIcon }}>
      {children}
    </IconContext.Provider>
  )
}

export function useIcon() {
  const context = useContext(IconContext)
  if (!context) {
    throw new Error("useIcon must be used within an IconProvider")
  }
  return context
}
