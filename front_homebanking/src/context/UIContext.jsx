import { createContext, useContext, useState, useCallback, useMemo } from 'react'

// Estado de UI compartido: principalmente el toggle "Ocultar importes" (patrón BBVA).
const UIContext = createContext(null)

const HIDE_KEY = 'hb_hide_amounts'

export function UIProvider({ children }) {
  const [hideAmounts, setHideAmounts] = useState(() => localStorage.getItem(HIDE_KEY) === '1')

  const toggleHideAmounts = useCallback(() => {
    setHideAmounts((prev) => {
      const next = !prev
      localStorage.setItem(HIDE_KEY, next ? '1' : '0')
      return next
    })
  }, [])

  const value = useMemo(() => ({ hideAmounts, toggleHideAmounts }), [hideAmounts, toggleHideAmounts])
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) return { hideAmounts: false, toggleHideAmounts: () => {} }
  return ctx
}
