import React from 'react'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'

interface DispatchProfileCardProps {
  dispatch: any
  driverName: string
  driverInitials: string
  driverPhoto?: string
  activeTab: string
  setActiveTab: (tab: any) => void
  tabs: readonly string[]
  tabIcons: Record<string, React.ReactNode>
  auditLog: any[]
  field: (val: any, fallback?: string) => string
}

export const DispatchProfileCard: React.FC<DispatchProfileCardProps> = ({
  dispatch,
  driverName,
  driverInitials,
  driverPhoto,
  activeTab,
  setActiveTab,
  tabs,
  tabIcons,
  auditLog,
  field,
}) => {
  return (
    <div className='card mb-5'>
      <div className='card-body pt-7 pb-0'>
        <div className='d-flex align-items-center mb-6'>
          <div className='symbol symbol-60px me-4'>
            {driverPhoto ? (
              <img src={toAbsoluteUrl(driverPhoto)} alt={driverName} />
            ) : (
              <div
                className='symbol-label fw-bolder fs-3 text-primary'
                style={{background: 'var(--bs-primary-light, #e9f0ff)'}}
              >
                {driverInitials}
              </div>
            )}
          </div>
          <div className='flex-grow-1'>
            <h3 className='fw-bolder mb-0'>{driverName}</h3>
            <span className='text-muted fs-7'>{field(dispatch.driver_id)}</span>
          </div>
          <span
            className={`badge fw-bold fs-7 px-4 py-3 badge-light-${
              dispatch.d_status === 'PENDING'
                ? 'warning'
                : dispatch.d_status === 'DISPATCHED'
                ? 'success'
                : 'secondary'
            }`}
          >
            {field(dispatch.d_status, 'Pending')}
          </span>
        </div>

        {/* Tabs */}
        <ul className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-6 fw-bolder'>
          {tabs.map((tab) => (
            <li key={tab} className='nav-item'>
              <a
                href='#'
                className={`nav-link text-active-primary pb-4 d-flex align-items-center ${
                  activeTab === tab ? 'active' : ''
                }`}
                onClick={(e) => {
                  e.preventDefault()
                  setActiveTab(tab)
                }}
              >
                {tabIcons[tab]}
                {tab}
                {tab === 'Reports' && auditLog.filter((a) => a.scope === 'Report').length > 0 && (
                  <span className='badge badge-warning ms-2 fs-9 py-1 px-2'>
                    {auditLog.filter((a) => a.scope === 'Report').length}
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
