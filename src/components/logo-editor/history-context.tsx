"use client"
import { createContext, useContext, useCallback, useReducer, useEffect, ReactNode } from "react"
import { IconProperties } from "./icon-context"
import { BackgroundProperties } from "./background-context"

interface HistoryState {
  past: EditorState[]
  present: EditorState
  future: EditorState[]
}

interface EditorState {
  icon: IconProperties | null
  background: BackgroundProperties | null
}

type HistoryAction =
  | { type: "PUSH"; newPresent: Partial<EditorState> }
  | { type: "UNDO" }
  | { type: "REDO" }

interface HistoryContextType {
  canUndo: boolean
  canRedo: boolean
  pushState: (state: Partial<EditorState>) => void
  undo: () => void
  redo: () => void
  currentState: EditorState
}

const HistoryContext = createContext<HistoryContextType | null>(null)

function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  const { past, present, future } = state

  switch (action.type) {
    case "PUSH": {
      const newPresent = {
        icon: action.newPresent.icon !== undefined ? action.newPresent.icon : present.icon,
        background: action.newPresent.background !== undefined ? action.newPresent.background : present.background,
      }
      return {
        past: [...past, present],
        present: newPresent,
        future: [],
      }
    }
    case "UNDO": {
      if (past.length === 0) return state

      const previous = past[past.length - 1]
      const newPast = past.slice(0, past.length - 1)

      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      }
    }
    case "REDO": {
      if (future.length === 0) return state

      const next = future[0]
      const newFuture = future.slice(1)

      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      }
    }
    default:
      return state
  }
}

export function HistoryProvider({ 
  children,
  initialState 
}: { 
  children: ReactNode
  initialState: EditorState
}) {
  const [state, dispatch] = useReducer(historyReducer, {
    past: [],
    present: initialState,
    future: [],
  })

  const pushState = useCallback((newPresent: Partial<EditorState>) => {
    dispatch({ type: "PUSH", newPresent })
  }, [])

  const undo = useCallback(() => {
    if (state.past.length === 0) return
    dispatch({ type: "UNDO" })
  }, [state.past.length])

  const redo = useCallback(() => {
    if (state.future.length === 0) return
    dispatch({ type: "REDO" })
  }, [state.future.length])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        switch (event.key.toLowerCase()) {
          case 'z':
            event.preventDefault() 
            undo()
            break
          case 'y':
            event.preventDefault() 
            redo()
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [undo, redo])

  const canUndo = state.past.length > 0
  const canRedo = state.future.length > 0

  return (
    <HistoryContext.Provider 
      value={{ 
        canUndo, 
        canRedo, 
        pushState, 
        undo, 
        redo,
        currentState: state.present 
      }}
    >
      {children}
    </HistoryContext.Provider>
  )
}

export function useHistory() {
  const context = useContext(HistoryContext)
  if (!context) {
    throw new Error("useHistory must be used within a HistoryProvider")
  }
  return context
}
