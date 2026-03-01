import React from 'react'
import {StatusBadge} from './ui'
import {KTIcon} from '../../../../../_metronic/helpers'
import {AuditTrail} from './OverrideModal'

interface ReportsTabProps {
  dispatch: any
  reportOverrides: Record<string, string>
  setReportOverrides: React.Dispatch<React.SetStateAction<Record<string, string>>>
  openOverride: (title: string, onConfirm: (reason: string) => void) => void
  addAudit: (scope: string, title: string, reason: string) => void
  auditLog: any[]
  field: (val: any, fallback?: string) => string
  fmtDate: (iso?: string) => string
}

export const ReportsTab: React.FC<ReportsTabProps> = ({
  dispatch,
  reportOverrides,
  setReportOverrides,
  openOverride,
  addAudit,
  auditLog,
  field,
  fmtDate,
}) => {
  return (
    <>
      <div className='card'>
        <div className='card-header border-0 pt-6'>
          <div className='card-title'>
            <h4 className='fw-bolder m-0'>Dispatch Report</h4>
          </div>
          <div className='card-toolbar'>
            <span className='text-muted fs-7'>{fmtDate(dispatch.created_at)}</span>
          </div>
        </div>
        <div className='card-body pt-0'>
          <div className='table-responsive mb-9'>
            <table className='table table-row-dashed table-row-gray-200 align-middle gs-0 gy-4'>
              <thead>
                <tr className='text-muted fw-bold fs-7 text-uppercase border-0'>
                  <th>Field</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {label: 'Dispatch ID', value: String(dispatch.id)},
                  {label: 'Driver ID', value: field(dispatch.driver_id)},
                  {label: 'Vehicle ID', value: field(dispatch.vehicle_id)},
                  {label: 'Collection ID', value: field(dispatch.collection_id)},
                  {
                    label: 'Fleet ID',
                    value: field(dispatch.fleet_id != null ? String(dispatch.fleet_id) : undefined),
                  },
                  {label: 'Status', value: field(dispatch.d_status)},
                  {label: 'Dispatch Time', value: fmtDate(dispatch.dispatch_time)},
                  {label: 'Created At', value: fmtDate(dispatch.created_at)},
                  {label: 'Updated At', value: fmtDate(dispatch.updated_at)},
                ].map((r, i) => {
                  const isOverridden = !!reportOverrides[r.label]
                  return (
                    <tr key={i}>
                      <td className='fw-bold text-gray-700 fs-7'>{r.label}</td>
                      <td className='text-gray-800 fs-6'>
                        {r.label === 'Status' ? (
                          <StatusBadge status={r.value.toLowerCase()} />
                        ) : (
                          r.value
                        )}
                        {isOverridden && (
                          <div className='text-dark fw-bold fs-8 mt-1'>
                            <KTIcon iconName='shield-tick' className='fs-8 text-warning me-1' />
                            Override: {reportOverrides[r.label]}
                          </div>
                        )}
                      </td>
                      <td className='text-end'>
                        {!isOverridden ? (
                          <button
                            className='btn btn-xs btn-light-warning py-1 px-3 fs-8 fw-bold'
                            onClick={() =>
                              openOverride(`${r.label}`, (reason) => {
                                setReportOverrides((prev) => ({...prev, [r.label]: reason}))
                                addAudit('Report', r.label, reason)
                              })
                            }
                          >
                            <KTIcon iconName='shield-tick' className='fs-8 me-1' />
                            Override
                          </button>
                        ) : (
                          <span className='text-muted fs-9'>Overridden</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <AuditTrail entries={auditLog.filter((a) => a.scope === 'Report')} />
    </>
  )
}
