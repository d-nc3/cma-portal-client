/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from 'react'
import {KTIcon, toAbsoluteUrl} from '../../../../../_metronic/helpers'
import {Link, useLocation} from 'react-router-dom'

const sampleDriver = {
  name: 'Rafael Mendoza',
  id: 'DRV-00412',
  license: 'N3-8821-PH',
  photo: '/media/avatars/300-1.jpg',
  status: 'active',
  shift: '6:00 AM – 6:00 PM',
  fleetGroup: 'Metro North · Route 7',
  assignedCar: 'Toyota Vios — ABX 4421',
  boundaryRate: '₱1,200.00 / day',
  dispatchTime: '2026-02-22T06:30:00',
  brief: {
    outstandingCharges: [{label: 'Fuel advance — Feb 18', amount: '₱450.00'}],
    damages: [{label: 'Minor scratch, rear bumper', date: 'Feb 10', severity: 'low'}],
    adminNotes: ['License renewal due March 15', 'Mandatory safety seminar pending'],
    holdWarnings: [] as string[],
  },
}

const DispatchHeader: React.FC = () => {
  const location = useLocation()
  const [odometer, setOdometer] = useState('')
  const [activeTab, setActiveTab] = useState<'charges' | 'damages' | 'notes' | 'holds'>('charges')
  const [override, setOverride] = useState(false)
  const [overridePin, setOverridePin] = useState('')
  const [overrideActive, setOverrideActive] = useState(false)

  const driver = sampleDriver
  const dispatchDate = new Date(driver.dispatchTime)
  const hasHold = driver.brief.holdWarnings.length > 0

  function handleOverride() {
    if (overridePin === '1234') {
      setOverrideActive(true)
      setOverride(false)
    } else {
      alert('Invalid authorization PIN')
    }
  }

  const tabs = [
    {key: 'charges' as const, label: 'Charges', count: driver.brief.outstandingCharges.length},
    {key: 'damages' as const, label: 'Damages', count: driver.brief.damages.length},
    {key: 'notes'   as const, label: 'Notes',   count: driver.brief.adminNotes.length},
    {key: 'holds'   as const, label: 'Holds',   count: driver.brief.holdWarnings.length},
  ]

  return (
    <div className='card mb-5 mb-xl-10'>
      <div className='card-body pt-9 pb-0'>

        {/* ── Top Row: Avatar + Driver Info ── */}
        <div className='d-flex flex-wrap flex-sm-nowrap mb-3'>
          <div className='me-7 mb-4'>
            <div className='symbol symbol-100px symbol-lg-160px symbol-fixed position-relative'>
              <img src={toAbsoluteUrl(driver.photo)} alt={driver.name} />
              <div
                className={`position-absolute translate-middle bottom-0 start-100 mb-6 rounded-circle border border-4 border-white h-20px w-20px ${
                  driver.status === 'active' ? 'bg-success' : 'bg-danger'
                }`}
              />
            </div>
          </div>

          <div className='flex-grow-1'>
            <div className='d-flex justify-content-between align-items-start flex-wrap mb-2'>

              {/* Name + Sub Info */}
              <div className='d-flex flex-column'>
                <div className='d-flex align-items-center mb-2'>
                  <span className='text-gray-800 fs-2 fw-bolder me-2'>{driver.name}</span>
                  <span className={`badge ${driver.status === 'active' ? 'badge-light-success' : 'badge-light-danger'} fs-8 fw-bold`}>
                    {driver.status.toUpperCase()}
                  </span>
                </div>

                <div className='d-flex flex-wrap fw-bold fs-6 mb-4 pe-2'>
                  <span className='d-flex align-items-center text-gray-400 me-5 mb-2'>
                    <KTIcon iconName='profile-circle' className='fs-4 me-1' />
                    {driver.id} · LIC {driver.license}
                  </span>
                  <span className='d-flex align-items-center text-gray-400 me-5 mb-2'>
                    <KTIcon iconName='geolocation' className='fs-4 me-1' />
                    {driver.fleetGroup}
                  </span>
                  <span className='d-flex align-items-center text-gray-400 mb-2'>
                    <KTIcon iconName='time' className='fs-4 me-1' />
                    {driver.shift}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='d-flex my-4 gap-2'>
                <button className='btn btn-sm btn-light-primary'>
                  <KTIcon iconName='notepad' className='fs-4 me-1' />
                  View Profile
                </button>
                {hasHold && (
                  <span className='btn btn-sm btn-light-danger pe-none'>
                    <KTIcon iconName='warning-2' className='fs-4 me-1' />
                    Hold Active
                  </span>
                )}
              </div>
            </div>

            {/* ── Stat Tiles ── */}
            <div className='d-flex flex-wrap flex-stack'>
              <div className='d-flex flex-wrap'>

                <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                  <div className='d-flex align-items-center'>
                    <KTIcon iconName='car' className='fs-3 text-primary me-2' />
                    <div className='fs-6 fw-bolder text-truncate' style={{maxWidth: 130}}>{driver.assignedCar}</div>
                  </div>
                  <div className='fw-bold fs-6 text-gray-400'>Assigned Car</div>
                </div>

                <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                  <div className='d-flex align-items-center'>
                    <KTIcon iconName='dollar' className='fs-3 text-success me-2' />
                    <div className='fs-6 fw-bolder'>{driver.boundaryRate}</div>
                  </div>
                  <div className='fw-bold fs-6 text-gray-400'>Boundary Rate</div>
                </div>

                <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                  <div className='d-flex align-items-center'>
                    <KTIcon iconName='calendar' className='fs-3 text-warning me-2' />
                    <div className='fs-6 fw-bolder'>
                      {dispatchDate.toLocaleTimeString('en-PH', {hour: '2-digit', minute: '2-digit'})}
                    </div>
                  </div>
                  <div className='fw-bold fs-6 text-gray-400'>
                    Dispatch · {dispatchDate.toLocaleDateString('en-PH', {month: 'short', day: 'numeric'})}
                  </div>
                </div>

                <div className='border border-gray-300 border-dashed rounded min-w-150px py-3 px-4 me-6 mb-3'>
                  <div className='d-flex align-items-center mb-1'>
                    <KTIcon iconName='send' className='fs-4 text-info me-2' />
                    <span className='fw-bold fs-6 text-gray-400'>Odometer</span>
                  </div>
                  <input
                    type='number'
                    className='form-control form-control-sm form-control-solid'
                    placeholder='Enter km...'
                    value={odometer}
                    onChange={e => setOdometer(e.target.value)}
                  />
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* ── Hold Warning Banner ── */}
        {hasHold && (
          <div className='notice d-flex bg-light-danger rounded border-danger border border-dashed mb-4 p-6'>
            <KTIcon iconName='warning-2' className='fs-2tx text-danger me-4' />
            <div className='fw-bold'>
              <div className='fs-6 text-danger'>Automatic Hold Active</div>
              <div className='fs-7 text-gray-600'>
                Driver dispatch is restricted. A manual override with authorization is required to proceed.
              </div>
            </div>
          </div>
        )}

        {/* ── Brief Status Nav Tabs ── */}
        <div className='d-flex overflow-auto h-55px'>
          <ul className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap'>
            {tabs.map(t => (
              <li className='nav-item' key={t.key}>
                <button
                  className={`nav-link text-active-primary me-6 bg-transparent border-0 ${activeTab === t.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(t.key)}
                >
                  {t.label}
                  {t.count > 0 && (
                    <span className={`badge ms-2 ${activeTab === t.key ? 'badge-primary' : 'badge-light'}`}>
                      {t.count}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Tab Panel ── */}
        <div className='py-4'>
          {activeTab === 'charges' && (
            driver.brief.outstandingCharges.length === 0
              ? <span className='text-muted fs-7'>No outstanding charges.</span>
              : driver.brief.outstandingCharges.map((c, i) => (
                <div key={i} className='d-flex justify-content-between align-items-center py-2 border-bottom border-gray-100'>
                  <span className='text-gray-600 fs-7'>{c.label}</span>
                  <span className='text-danger fw-bold fs-7'>{c.amount}</span>
                </div>
              ))
          )}
          {activeTab === 'damages' && (
            driver.brief.damages.length === 0
              ? <span className='text-muted fs-7'>No recorded damages.</span>
              : driver.brief.damages.map((d, i) => (
                <div key={i} className='d-flex align-items-center gap-3 py-2 border-bottom border-gray-100'>
                  <span className={`badge ${d.severity === 'high' ? 'badge-light-danger' : 'badge-light-warning'}`}>
                    {d.severity}
                  </span>
                  <span className='text-gray-600 fs-7 flex-grow-1'>{d.label}</span>
                  <span className='text-muted fs-8'>{d.date}</span>
                </div>
              ))
          )}
          {activeTab === 'notes' && (
            driver.brief.adminNotes.length === 0
              ? <span className='text-muted fs-7'>No administrative notes.</span>
              : driver.brief.adminNotes.map((n, i) => (
                <div key={i} className='d-flex align-items-center gap-2 py-2 border-bottom border-gray-100'>
                  <KTIcon iconName='information-2' className='fs-5 text-primary' />
                  <span className='text-gray-600 fs-7'>{n}</span>
                </div>
              ))
          )}
          {activeTab === 'holds' && (
            driver.brief.holdWarnings.length === 0
              ? <span className='text-muted fs-7'>No active holds.</span>
              : driver.brief.holdWarnings.map((h, i) => (
                <div key={i} className='d-flex align-items-center gap-2 py-2 border-bottom border-gray-100'>
                  <KTIcon iconName='warning-2' className='fs-5 text-danger' />
                  <span className='text-gray-600 fs-7'>{h}</span>
                </div>
              ))
          )}
        </div>

        {/* ── Manual Override ── */}
        <div className='d-flex align-items-center justify-content-between border-top border-gray-200 pt-4 pb-5'>
          <div className='d-flex align-items-center gap-3'>
            <span className='fw-bold fs-7 text-gray-500 text-uppercase'>Manual Override</span>
            {overrideActive && (
              <span className='badge badge-light-success'>
                <KTIcon iconName='check-circle' className='fs-7 me-1' />
                Authorized
              </span>
            )}
          </div>
          {!overrideActive && (
            <div className='d-flex align-items-center gap-2'>
              {override && (
                <>
                  <input
                    type='password'
                    className='form-control form-control-sm form-control-solid w-150px'
                    placeholder='Authorization PIN'
                    value={overridePin}
                    onChange={e => setOverridePin(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleOverride()}
                  />
                  <button className='btn btn-sm btn-primary' onClick={handleOverride}>
                    Authorize
                  </button>
                </>
              )}
              <button
                className={`btn btn-sm ${override ? 'btn-light' : 'btn-light-warning'}`}
                onClick={() => setOverride(v => !v)}
              >
                {override ? 'Cancel' : 'Request Override'}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export {DispatchHeader}