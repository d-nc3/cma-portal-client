import {useState} from 'react'
import {OverrideEntry} from '../types/dispatch'

const now = () =>
  new Date().toLocaleString('en-PH', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

interface ModalState {
  title: string
  onConfirm: (reason: string) => void
}

export const useOverride = () => {
  const [auditLog, setAuditLog]   = useState<OverrideEntry[]>([])
  const [modal, setModal]         = useState<ModalState | null>(null)

  const addAudit = (scope: string, target: string, reason: string) =>
    setAuditLog(prev => [{
      id: `${Date.now()}`,
      scope, target, reason,
      timestamp: now(),
      overriddenBy: 'Dispatcher',
    }, ...prev])

  const openOverride = (title: string, onConfirm: (r: string) => void) =>
    setModal({
      title,
      onConfirm: (r) => { onConfirm(r); setModal(null) },
    })

  const closeModal = () => setModal(null)

  return {auditLog, modal, addAudit, openOverride, closeModal}
}