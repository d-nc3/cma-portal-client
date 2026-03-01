import React, {useState} from 'react'
import {KTIcon, toAbsoluteUrl} from '../../../../../_metronic/helpers'
import {Driver} from '../types/dispatch'
import {CheckBadge, StatusBadge} from './ui'

type ModalTab = 'info' | 'checklist' | 'overrides'

interface DriverModalProps {
  driver: Driver
  fleetName: string
  division: string
  collectionId: string
  onClose: () => void
}

export const DriverModal: React.FC<DriverModalProps> = ({
  driver: d, fleetName, division, collectionId, onClose,
}) => {
  const [tab, setTab] = useState<ModalTab>('info')

  const allOk    = d.checklist.every(c => c.status === 'ok')
  const hasIssue = d.checklist.some(c => c.status === 'issue')

  const TABS: {key: ModalTab; label: string}[] = [
    {key: 'info',      label: 'Driver Info'},
    {key: 'checklist', label: 'Checklist'},
    {key: 'overrides', label: 'Overrides'},
  ]

  return (
    <div
      className='modal fade show d-block'
      style={{background: 'rgba(0,0,0,0.5)', zIndex: 1055}}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className='modal-dialog modal-dialog-centered modal-lg'>
        <div className='modal-content'>

          {/* Header */}
          <div className='modal-header border-0 pb-0'>
            <div className='d-flex align-items-center gap-3'>
              <div className='symbol symbol-50px'>
                <img src={toAbsoluteUrl(d.photo)} alt={d.name} />
              </div>
              <div>
                <h5 className='fw-bolder mb-0'>{d.name}</h5>
                <div className='d-flex align-items-center gap-2 mt-1 flex-wrap'>
                  <span className='text-muted fs-8'>{d.id}</span>
                  <span className='text-muted fs-8'>·</span>
                  <span className='badge badge-light fw-bold fs-9'>{fleetName}</span>
                  <span className='badge badge-light-primary fw-bold fs-9'>{division}</span>
                  <span className='badge badge-light-dark fw-bold fs-9'>{collectionId}</span>
                </div>
              </div>
            </div>
            <button className='btn btn-sm btn-icon btn-light-secondary' onClick={onClose}>
              <KTIcon iconName='cross' className='fs-5' />
            </button>
          </div>

          {/* Tab Bar */}
          <div className='modal-header border-0 pt-4 pb-0'>
            <ul className='nav nav-tabs nav-line-tabs nav-line-tabs-2x fs-7 fw-bold border-0'>
              {TABS.map(({key, label}) => (
                <li key={key} className='nav-item'>
                  <a
                    href='#'
                    className={`nav-link text-active-primary pb-3 ${tab === key ? 'active' : ''}`}
                    onClick={(e) => {e.preventDefault(); setTab(key)}}
                  >
                    {label}
                    {key === 'overrides' && d.overrides.length > 0 && (
                      <span className='badge badge-warning ms-2 py-1 px-2 fs-9'>
                        {d.overrides.length}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className='modal-body pt-5'>
            {tab === 'info' && (
              <div className='row g-5'>
                <div className='col-12'>
                  <div className='d-flex align-items-center gap-3 p-4 rounded bg-light border'>
                    <div className='flex-grow-1'>
                      <span className='text-muted fs-8 text-uppercase fw-bold d-block mb-1'>Status</span>
                      <StatusBadge status={d.dispatchStatus} />
                    </div>
                    <div className='flex-grow-1'>
                      <span className='text-muted fs-8 text-uppercase fw-bold d-block mb-1'>Remarks</span>
                      <span className='fw-bold fs-7 text-gray-800'>{d.remarks || '—'}</span>
                    </div>
                    <div className='flex-grow-1'>
                      <span className='text-muted fs-8 text-uppercase fw-bold d-block mb-1'>Odometer</span>
                      <span className='fw-bold fs-7 text-gray-800'>{d.odometer}</span>
                    </div>
                  </div>
                </div>
                <div className='col-md-6'>
                  <span className='text-muted fw-bold fs-8 text-uppercase d-block mb-2'>Personal Info</span>
                  <div className='separator separator-dashed mb-4' />
                  <div className='mb-3'>
                    <span className='text-muted fs-8'>License No.</span>
                    <div className='fw-bolder fs-7 text-gray-800 mt-1'>{d.license}</div>
                  </div>
                  <div>
                    <span className='text-muted fs-8'>Phone</span>
                    <div className='d-flex align-items-center gap-2 mt-1'>
                      <KTIcon iconName='phone' className='fs-6 text-primary' />
                      <span className='fw-bolder fs-7 text-primary'>{d.phone}</span>
                    </div>
                  </div>
                </div>
                <div className='col-md-6'>
                  <span className='text-muted fw-bold fs-8 text-uppercase d-block mb-2'>Assignment</span>
                  <div className='separator separator-dashed mb-4' />
                  <div className='mb-3'>
                    <span className='text-muted fs-8'>Assigned Car</span>
                    <div className='fw-bolder fs-7 text-gray-800 mt-1'>{d.car}</div>
                  </div>
                  <div>
                    <span className='text-muted fs-8'>Boundary Rate</span>
                    <div className='fw-bolder fs-7 text-primary mt-1'>{d.boundaryRate}</div>
                  </div>
                </div>
                <div className='col-12'>
                  <span className='text-muted fw-bold fs-8 text-uppercase d-block mb-2'>Grouping</span>
                  <div className='separator separator-dashed mb-4' />
                  <div className='row g-3'>
                    {[
                      {label: 'Fleet',         value: fleetName},
                      {label: 'Division',      value: division},
                      {label: 'Collection ID', value: collectionId},
                    ].map((g, i) => (
                      <div key={i} className='col-4'>
                        <div className='border rounded px-4 py-3 text-center'>
                          <div className='fw-bolder fs-7 text-gray-800'>{g.value}</div>
                          <div className='text-muted fs-9 mt-1'>{g.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Checklist Tab ── */}
            {tab === 'checklist' && (
              <div>
                <div className='d-flex align-items-center gap-3 mb-5'>
                  {allOk && !hasIssue && (
                    <span className='badge badge-light-success fw-bold fs-7 px-4 py-2'>
                      <KTIcon iconName='check-circle' className='fs-6 me-1' />All Clear
                    </span>
                  )}
                  {hasIssue && (
                    <span className='badge badge-light-danger fw-bold fs-7 px-4 py-2'>
                      <KTIcon iconName='warning-2' className='fs-6 me-1' />Issues Found
                    </span>
                  )}
                  {d.overrides.some(o => o.scope === 'Checklist') && (
                    <span className='badge badge-light-warning fw-bold fs-7 px-4 py-2'>
                      <KTIcon iconName='shield-tick' className='fs-6 me-1' />Override Applied
                    </span>
                  )}
                </div>
                <div className='table-responsive'>
                  <table className='table table-row-dashed table-row-gray-200 align-middle gs-0 gy-2'>
                    <thead>
                      <tr className='text-muted fw-bold fs-8 text-uppercase border-0'>
                        <th>Item</th><th>Status</th><th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.checklist.map((c, i) => (
                        <tr key={i}>
                          <td className='fw-bold text-gray-800 fs-7'>{c.label}</td>
                          <td><CheckBadge status={c.status} /></td>
                          <td className='text-muted fs-8'>{c.remarks || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === 'overrides' && (
              d.overrides.length === 0 ? (
                <div className='text-center py-8'>
                  <KTIcon iconName='shield-tick' className='fs-2tx text-success mb-3' />
                  <p className='text-muted fs-7'>No overrides recorded for this driver.</p>
                </div>
              ) : (
                <div className='table-responsive'>
                  <table className='table table-row-dashed table-row-gray-200 align-middle gs-0 gy-3'>
                    <thead>
                      <tr className='text-muted fw-bold fs-8 text-uppercase border-0'>
                        <th>Timestamp</th><th>Scope</th><th>Target</th><th>Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.overrides.map((o, i) => (
                        <tr key={i}>
                          <td className='text-muted fs-8 text-nowrap'>{o.timestamp}</td>
                          <td><span className='badge badge-light-warning fw-bold fs-8'>{o.scope}</span></td>
                          <td className='fw-bold text-gray-800 fs-7'>{o.target}</td>
                          <td className='text-gray-600 fs-7'>{o.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}

          </div>

          <div className='modal-footer border-0 pt-0'>
            <button className='btn btn-sm btn-light' onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}