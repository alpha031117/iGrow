"use client"

import { DeviceFrameset } from 'react-device-frameset'
import 'react-device-frameset/styles/marvel-devices.min.css'
import { ScrollLockProvider, useIsScrollLocked } from '@/context/scroll-lock'

function FrameContent({ children }: { children: React.ReactNode }) {
  const locked = useIsScrollLocked()
  return (
    <div
      className={`w-full h-full overflow-x-hidden [transform:translateZ(0)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${locked ? 'overflow-y-hidden' : 'overflow-y-auto'}`}
    >
      {children}
    </div>
  )
}

export default function DeviceFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <DeviceFrameset device="iPhone X" height={812} width={375}>
        <ScrollLockProvider>
          <FrameContent>{children}</FrameContent>
        </ScrollLockProvider>
      </DeviceFrameset>
    </div>
  )
}
