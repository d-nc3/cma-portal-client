// types.ts
export type ViolationStatus = 'valid' | 'expiring' | 'expired'

export interface Violation {
  id: number
  date: string
  violationType: string
  description: string
  ticketNumber: string
  issueDate: string
  ticketExpiry: string
  amount: number
  status: ViolationStatus
  settled: boolean
  receiptUrl?: string | null
  settledDate?: string
  settledAmount?: number
}