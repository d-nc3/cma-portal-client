import React, {useState} from 'react'
import { KTIcon } from '../../../../../_metronic/helpers'
import { OverrideEntry } from '../types/dispatch'

interface OverrideModalProps {
  title: string
  onConfirm: (reason: string) => void
  onClose: () => void
}

export const OverrideModal: React.FC<OverrideModalProps> = ({title, onConfirm, onClose}) => {
  const [reason, setReason] = useState('')

  return (
    <div
      className='modal fade show d-block'
      style={{background: 'rgba(0,0,0,0.45)', zIndex: 1060}}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className='modal-dialog modal-dialog-centered modal-sm'>
        <div className='modal-content'>
          <div className='modal-header border-0 pb-0'>
            <div className='d-flex align-items-center gap-2'>
              <KTIcon iconName='shield-tick' className='fs-3 text-warning' />
              <h5 className='modal-title fw-bolder'>Manual Override</h5>
            </div>
            <button className='btn btn-sm btn-icon btn-light-secondary' onClick={onClose}>
              <KTIcon iconName='cross' className='fs-5' />
            </button>
          </div>

          <div className='modal-body pt-4'>
            <p className='text-muted fs-7 mb-4'>
              Overriding: <span className='fw-bold text-gray-800'>{title}</span>
            </p>
            <label className='fw-bold text-muted fs-7 text-uppercase mb-2 d-block'>
              Reason <span className='text-danger'>*</span>
            </label>
            <textarea
              className='form-control form-control-sm'
              rows={3}
              placeholder='Enter a valid reason…'
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className='modal-footer border-0 pt-0'>
            <button className='btn btn-sm btn-light' onClick={onClose}>Cancel</button>
            <button
              className='btn btn-sm btn-warning'
              disabled={reason.trim().length < 5}
              onClick={() => onConfirm(reason.trim())}
            >
              <KTIcon iconName='shield-tick' className='fs-7 me-1' />
              Apply Override
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export const AuditTrail: React.FC<{entries: OverrideEntry[]}> = ({entries}) => {
  if (entries.length === 0) return null

  return (
    <div className='card mt-5'>
      <div className='card-header border-0 pt-6'>
        <div className='card-title d-flex align-items-center gap-2'>
          <KTIcon iconName='shield-tick' className='fs-4 text-warning' />
          <h5 className='fw-bolder m-0'>Override Audit Trail</h5>
        </div>
      </div>
      <div className='card-body pt-0'>
        <div className='table-responsive'>
          <table className='table table-row-dashed table-row-gray-200 align-middle gs-0 gy-3'>
            <thead>
              <tr className='text-muted fw-bold fs-7 text-uppercase border-0'>
                <th>Timestamp</th>
                <th>Scope</th>
                <th>Target</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr key={e.id ?? i}>
                  <td className='text-muted fs-8 text-nowrap'>{e.timestamp}</td>
                  <td>
                    <span className='badge badge-light-warning fw-bold fs-8'>{e.scope}</span>
                  </td>
                  <td className='fw-bold text-gray-800 fs-7'>{e.target}</td>
                  <td className='text-gray-600 fs-7'>{e.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}