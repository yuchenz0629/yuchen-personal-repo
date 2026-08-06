import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

/**
 * Modal built on the native <dialog>. showModal() gives Escape-to-close,
 * focus trapping and an inert backdrop without reimplementing them.
 */
export function Dialog({
  open,
  onClose,
  children,
}: {
  open: boolean
  onClose: () => void
  children: ReactNode
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={event => {
        // A click landing on the <dialog> itself is the backdrop; the panel
        // inside stops propagation, so this cannot fire from panel content.
        if (event.target === ref.current) onClose()
      }}
      className="m-auto max-w-[min(92vw,640px)] bg-transparent p-0 text-ink backdrop:bg-[rgba(4,10,30,.62)]"
    >
      <div className="glass p-4" onClick={event => event.stopPropagation()}>
        {children}
      </div>
    </dialog>
  )
}
