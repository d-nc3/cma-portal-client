import React from 'react'
import { KTIcon } from '../../../../../_metronic/helpers'
import {STATUS_MAP} from '../data/dispatchInfo'
import {DispatchStatus, CheckStatus} from '../types/dispatch'

export const SectionLabel: React.FC<{label: string}> = ({label}) => (
  <div className='col-12 mb-4'>
    <span className='text-muted fw-bold fs-7 text-uppercase'>{label}</span>
    <div className='separator separator-dashed mt-2' />
  </div>
)

export const Field: React.FC<{
  label: string
  value: React.ReactNode
  col?: string
}> = ({label, value, col = 'col-lg-3 col-md-6'}) => (
  <div className={`${col} mb-5`}>
    <label className='fw-bold text-muted fs-7 text-uppercase'>{label}</label>
    <div className='fw-bolder fs-6 text-gray-800 mt-1'>{value}</div>
  </div>
)

export const StatusBadge: React.FC<{status: DispatchStatus | string}> = ({status}) => {
  const s = STATUS_MAP[status as DispatchStatus] ?? {label: status, badge: 'badge-light'}
  return <span className={`badge ${s.badge} fw-bold fs-8`}>{s.label}</span>
}

const CHECK_CONFIG: Record<CheckStatus, {color: string; icon: string}> = {
  ok:      {color: 'text-success', icon: 'check-circle'},
  issue:   {color: 'text-danger',  icon: 'warning-2'},
  skipped: {color: 'text-muted',   icon: 'minus-circle'},
}

export const CheckBadge: React.FC<{status: CheckStatus}> = ({status}) => {
  const cfg = CHECK_CONFIG[status]
  return (
    <span className={`d-flex align-items-center gap-1 ${cfg.color}`}>
      <KTIcon iconName={cfg.icon} className='fs-7' />
      <span className='fw-bold fs-8 text-capitalize'>{status}</span>
    </span>
  )
}

export const OverrideBadge: React.FC = () => (
  <span className='badge badge-light-dark fw-bold fs-8 ms-2'>
    <KTIcon iconName='shield-tick' className='fs-8 me-1' />
    Manually Overridden
  </span>
)

export const MiniProgress: React.FC<{value: number; color?: string}> = ({
  value, color = 'bg-primary',
}) => (
  <div className='d-flex align-items-center gap-3'>
    <div className='progress h-6px flex-grow-1' style={{maxWidth: 120}}>
      <div className={`progress-bar ${color}`} style={{width: `${value}%`}} />
    </div>
    <span className='fw-bolder fs-7 text-gray-800'>{value}%</span>
  </div>
)


export const CollapseToggle: React.FC<{
  open: boolean
  onClick: () => void
  children: React.ReactNode
  className?: string
}> = ({open, onClick, children, className = ''}) => (
  <div
    className={`d-flex align-items-center gap-2 cursor-pointer ${className}`}
    onClick={onClick}
  >
    <KTIcon iconName={open ? 'down' : 'right'} className='fs-7 text-muted' />
    {children}
  </div>
)