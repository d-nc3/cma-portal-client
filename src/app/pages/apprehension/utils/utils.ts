// utils.ts
import { ViolationStatus } from '../utils/types'

export const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
}

export const getStatusColor = (status: ViolationStatus) => {
  switch (status) {
    case 'valid':
      return 'success'
    case 'expiring':
      return 'warning'
    case 'expired':
      return 'danger'
    default:
      return 'primary'
  }
}