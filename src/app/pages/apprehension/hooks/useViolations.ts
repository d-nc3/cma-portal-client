// useViolations.ts
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Violation } from '../utils/types'

export const useViolations = () => {
  const [violations, setViolations] = useState<Violation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchViolations = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/drivers/me/apprehensions`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )

        const data = response.data
        const formattedData: Violation[] = data.map((a: any) => ({
          id: a.id,
          date: a.date,
          violationType: a.violationType,
          ticketNumber: a.ticketNumber || 'N/A',
          issueDate: a.issueDate,
          ticketExpiry: a.ticketExpiry,
          amount: a.amount || 0,
          status: a.status || 'valid',
          settled: a.settled || false,
          receiptUrl: a.receiptUrl || null,
          settledDate: a.settledDate || undefined,
          settledAmount: a.settledAmount || undefined,
        }))

        setViolations(formattedData)
        setLoading(false)
      } catch (err: any) {
        console.error(err)
        setError(err.message || 'Error fetching apprehensions')
        setLoading(false)
      }
    }

    fetchViolations()
  }, [])

  return { violations, setViolations, loading, error }
}