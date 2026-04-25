"use client"

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

type ScrollLockCtx = { lock: () => void; unlock: () => void; locked: boolean }

const Ctx = createContext<ScrollLockCtx>({ lock: () => {}, unlock: () => {}, locked: false })

export function ScrollLockProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0)
  const lock = useCallback(() => setCount(c => c + 1), [])
  const unlock = useCallback(() => setCount(c => Math.max(0, c - 1)), [])
  return <Ctx.Provider value={{ lock, unlock, locked: count > 0 }}>{children}</Ctx.Provider>
}

export function useIsScrollLocked() {
  return useContext(Ctx).locked
}

export function useLockScroll(isOpen: boolean) {
  const { lock, unlock } = useContext(Ctx)
  useEffect(() => {
    if (!isOpen) return
    lock()
    return () => unlock()
  }, [isOpen, lock, unlock])
}
