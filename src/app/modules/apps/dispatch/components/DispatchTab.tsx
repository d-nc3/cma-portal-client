import React from 'react'
import {SectionLabel, Field, OverrideBadge} from './ui'
import {KTIcon} from '../../../../../_metronic/helpers'
import {ShieldAlert, AlertTriangle} from 'lucide-react'
import {AuditTrail} from './OverrideModal'

interface DispatchTabProps {
  dispatch: any
  apprehension: any
  vehicleDamage: any
  holdOverridden: boolean
  setHoldOverridden: (val: boolean) => void
  odometer: string
  setOdometer: (val: string) => void
  openOverride: (title: string, onConfirm: (reason: string) => void) => void
  addAudit: (scope: string, title: string, reason: string) => void
  auditLog: any[]
  field: (val: any, fallback?: string) => string
  fmtDate: (iso?: string) => string
}

export const DispatchTab: React.FC<DispatchTabProps> = ({
  dispatch,
  apprehension,
  vehicleDamage,
  holdOverridden,
  setHoldOverridden,
  odometer,
  setOdometer,
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
            <h4 className='fw-bolder m-0'>Dispatch Window</h4>
          </div>
        </div>
        <div className='card-body p-9'>
          <div className='row mb-9'>
            <SectionLabel label='Assignment' />
            <Field label='Vehicle ID' value={field(dispatch.vehicle_id)} col='col-lg-4 col-md-6' />
            <Field
              label='Collection ID'
              value={field(dispatch.collection_id)}
              col='col-lg-4 col-md-6'
            />
            <Field
              label='Fleet ID'
              value={field(dispatch.fleet_id != null ? String(dispatch.fleet_id) : undefined)}
              col='col-lg-2 col-md-6'
            />
            <Field
              label='Dispatch Time'
              value={fmtDate(dispatch.dispatch_time)}
              col='col-lg-4 col-md-6'
            />
            <div className='col-lg-4 col-md-6 mb-5'>
              <label className='fw-bold text-muted fs-7 text-uppercase'>Odometer Encoding</label>
              <input
                type='text'
                className='form-control form-control-sm mt-2'
                placeholder='e.g. 84,210 km'
                value={odometer}
                onChange={(e) => setOdometer(e.target.value)}
              />
            </div>
          </div>

          {/* Brief Status Summary */}
          <div className='row'>
            <SectionLabel label='Driver Brief Status Summary' />

            {/* Apprehension */}
            <div className='col-lg-6 mb-6'>
              <div className='d-flex align-items-center gap-2 mb-3'>
                <ShieldAlert size={16} className='text-danger' />
                <span className='fw-bold text-gray-700 fs-7 text-uppercase'>Apprehension</span>
              </div>
              {apprehension ? (
                <div className='border rounded px-4 py-3'>
                  <div className='d-flex justify-content-between'>
                    <span className='text-gray-700 fs-7'>{field(apprehension.description)}</span>
                    <span
                      className={`badge fw-bold fs-8 badge-light-${
                        apprehension.status === 'ACTIVE' ? 'danger' : 'secondary'
                      }`}
                    >
                      {field(apprehension.status)}
                    </span>
                  </div>
                  {apprehension.apprehensionDate && (
                    <span className='text-muted fs-8 d-block mt-1'>
                      {fmtDate(apprehension.apprehensionDate)}
                    </span>
                  )}
                </div>
              ) : (
                <span className='text-muted fs-7'>No apprehension record</span>
              )}
            </div>

            {/* Vehicle Damage */}
            <div className='col-lg-6 mb-6'>
              <div className='d-flex align-items-center gap-2 mb-3'>
                <AlertTriangle size={16} className='text-warning' />
                <span className='fw-bold text-gray-700 fs-7 text-uppercase'>Vehicle Damage</span>
              </div>
              {vehicleDamage ? (
                <div className='border rounded px-4 py-3'>
                  <div className='d-flex justify-content-between align-items-center'>
                    <span className='text-gray-700 fs-7'>{field(vehicleDamage.description)}</span>
                    <span
                      className={`badge fw-bold fs-8 badge-light-${
                        vehicleDamage.severity === 'HIGH'
                          ? 'danger'
                          : vehicleDamage.severity === 'MEDIUM'
                          ? 'warning'
                          : 'secondary'
                      }`}
                    >
                      {field(vehicleDamage.severity)}
                    </span>
                  </div>
                  {vehicleDamage.reportedAt && (
                    <span className='text-muted fs-8 d-block mt-1'>
                      {fmtDate(vehicleDamage.reportedAt)}
                    </span>
                  )}
                </div>
              ) : (
                <span className='text-muted fs-7'>No damage record</span>
              )}
            </div>

            {/* Hold Warnings */}
            <div className='col-lg-6 mb-6'>
              <div className='d-flex align-items-center gap-2 mb-3'>
                <KTIcon iconName='warning-2' className='fs-5 text-danger' />
                <span className='fw-bold text-gray-700 fs-7 text-uppercase'>Hold Warnings</span>
                {holdOverridden && <OverrideBadge />}
              </div>
              {apprehension?.status === 'ACTIVE' && !holdOverridden ? (
                <>
                  <div className='d-flex align-items-start gap-2 mb-2'>
                    <KTIcon iconName='warning-2' className='fs-6 text-danger mt-1' />
                    <span className='text-danger fw-bold fs-7'>
                      Driver has an active apprehension
                    </span>
                  </div>
                  <button
                    className='btn btn-sm btn-light-warning mt-3'
                    onClick={() =>
                      openOverride('Hold Warning — Active Apprehension', (reason) => {
                        setHoldOverridden(true)
                        addAudit('Dispatch', 'Hold Warning — Active Apprehension', reason)
                      })
                    }
                  >
                    <KTIcon iconName='shield-tick' className='fs-7 me-1' />
                    Manual Override
                  </button>
                </>
              ) : (
                <div className='d-flex align-items-center gap-2'>
                  <KTIcon iconName='check-circle' className='fs-5 text-success' />
                  <span className='text-success fs-7 fw-bold'>
                    {holdOverridden ? 'Hold overridden — dispatch authorized' : 'No active holds'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <AuditTrail entries={auditLog.filter((a) => a.scope === 'Dispatch')} />
    </>
  )
}
