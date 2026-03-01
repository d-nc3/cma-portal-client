import React from 'react'
import {OverrideBadge} from './ui'
import {KTIcon} from '../../../../../_metronic/helpers'
import {AuditTrail} from './OverrideModal'
import {CHECKLIST_TEMPLATE} from '../data/dispatchInfo'
import type {CheckStatus} from '../types/dispatch'

interface ChecklistTabProps {
  dispatch: any
  driverName: string
  submitted: boolean
  setSubmitted: (val: boolean) => void
  checklist: Record<string, {status: CheckStatus | ''; remarks: string}>
  setChecklist: React.Dispatch<
    React.SetStateAction<Record<string, {status: CheckStatus | ''; remarks: string}>>
  >
  checklistOverridden: boolean
  setChecklistOverridden: (val: boolean) => void
  openOverride: (title: string, onConfirm: (reason: string) => void) => void
  addAudit: (scope: string, title: string, reason: string) => void
  auditLog: any[]
  field: (val: any, fallback?: string) => string
}

export const ChecklistTab: React.FC<ChecklistTabProps> = ({
  dispatch,
  driverName,
  submitted,
  setSubmitted,
  checklist,
  setChecklist,
  checklistOverridden,
  setChecklistOverridden,
  openOverride,
  addAudit,
  auditLog,
  field,
}) => {
  const setCheckStatus = (key: string, status: CheckStatus) =>
    setChecklist((prev) => ({...prev, [key]: {...prev[key], status}}))
  const setRemarks = (key: string, remarks: string) =>
    setChecklist((prev) => ({...prev, [key]: {...prev[key], remarks}}))

  const allChecked = CHECKLIST_TEMPLATE.every(({key}) => checklist[key].status !== '')
  const canSubmit = allChecked || checklistOverridden

  return (
    <>
      <div className='card'>
        <div className='card-header border-0 pt-6'>
          <div className='card-title d-flex align-items-center gap-2'>
            <h4 className='fw-bolder m-0'>Pre-Dispatch Vehicle Checklist</h4>
            {checklistOverridden && <OverrideBadge />}
          </div>
          <div className='card-toolbar'>
            <span className='text-muted fs-7'>
              {field(dispatch.vehicle_id)} · {driverName}
            </span>
          </div>
        </div>

        <div className='card-body p-9'>
          {submitted ? (
            <div className='text-center py-10'>
              <KTIcon iconName='check-circle' className='fs-2tx text-success mb-4' />
              <h4 className='fw-bolder text-gray-800'>Checklist Submitted</h4>
              {checklistOverridden && (
                <p className='text-warning fw-bold fs-7 mb-2'>Submitted with manual override</p>
              )}
              <p className='text-muted fs-6 mb-5'>
                Pre-dispatch vehicle check recorded successfully.
              </p>
              <button
                className='btn btn-sm btn-light-primary'
                onClick={() => {
                  setSubmitted(false)
                  setChecklistOverridden(false)
                  setChecklist(
                    Object.fromEntries(
                      CHECKLIST_TEMPLATE.map(({key}) => [
                        key,
                        {status: '' as CheckStatus | '', remarks: ''},
                      ])
                    )
                  )
                }}
              >
                Reset Checklist
              </button>
            </div>
          ) : (
            <>
              <div className='table-responsive mb-8'>
                <table className='table table-row-dashed table-row-gray-200 align-middle gs-0 gy-3'>
                  <thead>
                    <tr className='text-muted fw-bold fs-7 text-uppercase border-0'>
                      <th style={{width: 220}}>Item</th>
                      <th style={{width: 160}}>Status</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CHECKLIST_TEMPLATE.map(({key, label}) => {
                      const row = checklist[key]
                      return (
                        <tr key={key}>
                          <td className='fw-bold text-gray-800 fs-6'>
                            {label}
                            {!row.status && checklistOverridden && (
                              <span className='badge badge-light-secondary fw-bold fs-9 ms-2'>
                                Skipped
                              </span>
                            )}
                          </td>
                          <td>
                            <div className='d-flex gap-3'>
                              {(['ok', 'issue'] as CheckStatus[]).map((s) => (
                                <label
                                  key={s}
                                  className='d-flex align-items-center gap-1 cursor-pointer'
                                >
                                  <input
                                    type='radio'
                                    name={`status-${key}`}
                                    checked={row.status === s}
                                    onChange={() => setCheckStatus(key, s)}
                                    className='form-check-input mt-0'
                                  />
                                  <span
                                    className={`fw-bold fs-7 ${
                                      s === 'ok' ? 'text-success' : 'text-danger'
                                    }`}
                                  >
                                    {s === 'ok' ? 'OK' : 'Issue'}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </td>
                          <td>
                            <input
                              type='text'
                              className='form-control form-control-sm'
                              placeholder='Optional remarks…'
                              value={row.remarks}
                              onChange={(e) => setRemarks(key, e.target.value)}
                            />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className='d-flex justify-content-between align-items-center'>
                {!allChecked && !checklistOverridden ? (
                  <button
                    className='btn btn-sm btn-light-warning'
                    onClick={() =>
                      openOverride('Incomplete Checklist', (reason) => {
                        setChecklistOverridden(true)
                        addAudit('Checklist', 'Pre-Dispatch Vehicle Checklist', reason)
                      })
                    }
                  >
                    <KTIcon iconName='shield-tick' className='fs-7 me-1' />
                    Manual Override
                  </button>
                ) : (
                  <div />
                )}

                <div className='d-flex align-items-center gap-4'>
                  {!canSubmit && (
                    <span className='text-muted fs-8'>
                      All items must be marked or override applied.
                    </span>
                  )}
                  <button
                    className='btn btn-primary btn-sm'
                    disabled={!canSubmit}
                    onClick={() => setSubmitted(true)}
                  >
                    <KTIcon iconName='check' className='fs-6 me-1' />
                    Submit Checklist
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <AuditTrail entries={auditLog.filter((a) => a.scope === 'Checklist')} />
    </>
  )
}
