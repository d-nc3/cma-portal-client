import React, { useState } from 'react'
import { Violation } from '../utils/types'

interface ViolationModalProps {
  violation: Violation
  onClose: () => void
  onConfirm: (amount: number, date: string, file?: File) => void
}

const ViolationModal: React.FC<ViolationModalProps> = ({ violation, onClose, onConfirm }) => {
  const [amount, setAmount] = useState<number>(0)
  const [date, setDate] = useState<string>('')
  const [file, setFile] = useState<File | undefined>()

  const handleConfirm = () => {
    onConfirm(amount, date, file)
  }

  return (
    <div className='modal fade show d-block' tabIndex={-1}>
        <div className='modal-dialog modal-dialog-centered'>
            <div className='modal-content'>
            <div className='modal-header'>
                <h5 className='modal-title'>
                Upload Settlement - {violation.ticketNumber}
                </h5>
                <button className='btn btn-sm btn-icon' onClick={onClose}>
                ✕
                </button>
            </div>

            <div className='modal-body'>
                <input
                type='number'
                className='form-control mb-4'
                placeholder='Settlement Amount'
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                />
                <input
                type='date'
                className='form-control mb-4'
                value={date}
                onChange={(e) => setDate(e.target.value)}
                />
                <input
                type='file'
                className='form-control'
                onChange={(e) => setFile(e.target.files?.[0])}
                />
            </div>

            <div className='modal-footer'>
                <button className='btn btn-light' onClick={onClose}>
                Cancel
                </button>
                <button className='btn btn-primary' onClick={handleConfirm}>
                Confirm Settlement
                </button>
            </div>
            </div>
        </div>
        </div>
  )
}

export default ViolationModal