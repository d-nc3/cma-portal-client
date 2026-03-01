import React from 'react'
import {SectionLabel, Field} from './ui'
import {Phone, Mail} from 'lucide-react'

interface ProfileTabProps {
  driverInfo: any
  apprehension: any
  vehicleDamage: any
  field: (val: any, fallback?: string) => string
  fmtDate: (iso?: string) => string
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  driverInfo,
  apprehension,
  vehicleDamage,
  field,
  fmtDate,
}) => {
  return (
    <div className='card'>
      <div className='card-body p-9'>
        {/* Personal Info */}
        <div className='row mb-7'>
          <SectionLabel label='Personal Information' />
          <Field label='Birthdate' value={field(driverInfo?.birthdate)} />
          <Field
            label='Age'
            value={field(driverInfo?.age != null ? `${driverInfo.age} yrs` : undefined)}
            col='col-lg-2 col-md-6'
          />
          <Field label='Gender' value={field(driverInfo?.gender)} col='col-lg-2 col-md-6' />
          <Field
            label='Civil Status'
            value={field(driverInfo?.civilStatus)}
            col='col-lg-2 col-md-6'
          />
          <Field label='License No.' value={field(driverInfo?.licenseNo)} />
          <Field label='Home Address' value={field(driverInfo?.address)} col='col-12' />
        </div>

        {/* Contact */}
        <div className='row mb-7'>
          <SectionLabel label='Contact Details' />
          <div className='col-lg-4 col-md-6 mb-5'>
            <label className='fw-bold text-muted fs-7 text-uppercase'>Phone</label>
            <div className='d-flex align-items-center mt-1 gap-2'>
              <Phone size={15} className='text-primary' />
              <span className='fw-bolder fs-6 text-primary'>{field(driverInfo?.phone)}</span>
            </div>
          </div>
          <div className='col-lg-4 col-md-6 mb-5'>
            <label className='fw-bold text-muted fs-7 text-uppercase'>Email</label>
            <div className='d-flex align-items-center mt-1 gap-2'>
              <Mail size={15} className='text-gray-600' />
              <span className='fw-bolder fs-6 text-gray-800'>{field(driverInfo?.email)}</span>
            </div>
          </div>
          <div className='col-lg-4 col-md-6 mb-5'>
            <label className='fw-bold text-muted fs-7 text-uppercase'>Emergency Contact</label>
            <div className='fw-bolder fs-6 text-gray-800 mt-1'>
              {field(driverInfo?.emergencyContact)}
            </div>
            <div className='text-muted fs-7'>{field(driverInfo?.emergencyPhone)}</div>
          </div>
        </div>

        {/* Apprehension Summary */}
        {apprehension && (
          <div className='row mb-7'>
            <SectionLabel label='Apprehension Record' />
            <div className='col-lg-3 col-md-6 mb-5'>
              <label className='fw-bold text-muted fs-7 text-uppercase'>Status</label>
              <div className='mt-1'>
                <span
                  className={`badge fw-bold fs-7 badge-light-${
                    apprehension.status === 'ACTIVE' ? 'danger' : 'secondary'
                  }`}
                >
                  {field(apprehension.status)}
                </span>
              </div>
            </div>
            {apprehension.count != null && (
              <div className='col-lg-3 col-md-6 mb-5'>
                <label className='fw-bold text-muted fs-7 text-uppercase'>Count</label>
                <div className='fw-bolder fs-6 text-gray-800 mt-1'>{apprehension.count}</div>
              </div>
            )}
            {apprehension.apprehensionDate && (
              <div className='col-lg-4 col-md-6 mb-5'>
                <label className='fw-bold text-muted fs-7 text-uppercase'>Date</label>
                <div className='fw-bolder fs-6 text-gray-800 mt-1'>
                  {fmtDate(apprehension.apprehensionDate)}
                </div>
              </div>
            )}
            {apprehension.description && (
              <div className='col-12 mb-5'>
                <label className='fw-bold text-muted fs-7 text-uppercase'>Description</label>
                <div className='fw-bolder fs-6 text-gray-800 mt-1'>{apprehension.description}</div>
              </div>
            )}
          </div>
        )}

        {/* Vehicle Damage Summary */}
        {vehicleDamage && (
          <div className='row'>
            <SectionLabel label='Vehicle Damage Record' />
            <div className='col-lg-3 col-md-6 mb-5'>
              <label className='fw-bold text-muted fs-7 text-uppercase'>Severity</label>
              <div className='mt-1'>
                <span
                  className={`badge fw-bold fs-7 badge-light-${
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
            </div>
            {vehicleDamage.reportedAt && (
              <div className='col-lg-4 col-md-6 mb-5'>
                <label className='fw-bold text-muted fs-7 text-uppercase'>Reported At</label>
                <div className='fw-bolder fs-6 text-gray-800 mt-1'>
                  {fmtDate(vehicleDamage.reportedAt)}
                </div>
              </div>
            )}
            {vehicleDamage.description && (
              <div className='col-12 mb-5'>
                <label className='fw-bold text-muted fs-7 text-uppercase'>Description</label>
                <div className='fw-bolder fs-6 text-gray-800 mt-1'>{vehicleDamage.description}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
