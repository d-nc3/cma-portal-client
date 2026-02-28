import * as React from 'react'
import { KTIcon } from '../../../../_metronic/helpers'

interface StatCardProps {
  title: string
  value: number
  icon: string
  color: 'primary' | 'success' | 'warning' | 'info'
}

const colorClassMap: Record<string, string> = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  info: 'bg-info',
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="col-md-3">
      <div className="card shadow-sm border-0 h-100 transition p-4" style={{ borderRadius: '0.75rem' }}>
        <div className="d-flex align-items-center">
          
          {/* Icon Circle */}
          <div
            className={`symbol symbol-55px ${colorClassMap[color]} text-white rounded-circle d-flex justify-content-center align-items-center me-4`}
            style={{
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              fontSize: '1.5rem',
            }}
          >
            <KTIcon iconName={icon} className="fs-2" />
          </div>

          {/* Text */}
          <div className="d-flex flex-column">
            <span className="text-muted fs-7 text-uppercase" style={{ letterSpacing: '0.5px' }}>
              {title}
            </span>
            <span className="fw-bold fs-3">{value}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatCard