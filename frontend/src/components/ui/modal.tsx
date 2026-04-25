"use client"

import React from "react"
import { X } from "lucide-react"
import { useLockScroll } from "@/context/scroll-lock"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  useLockScroll(isOpen)
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative bg-[#EEF2FB] w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header — TNG blue gradient */}
        {title && (
          <div
            className="shrink-0 px-5 py-4 flex items-center justify-between rounded-t-3xl"
            style={{ background: 'linear-gradient(135deg, #1A5FD5 0%, #0D2B6E 100%)' }}
          >
            <h2 className="text-[16px] font-bold text-white tracking-tight">{title}</h2>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors bg-white/10 rounded-full p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="overflow-y-auto flex-1 px-4 py-4">
          {children}
        </div>
      </div>
    </div>
  )
}
