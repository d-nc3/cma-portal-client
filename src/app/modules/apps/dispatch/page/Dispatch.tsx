'use client'
import React, {useState, useEffect, useCallback} from 'react'
import Cookies from 'js-cookie'
import {KTIcon, toAbsoluteUrl} from '../../../../../_metronic/helpers'
import type {CheckStatus} from '../types/dispatch'
import {CHECKLIST_TEMPLATE} from '../data/dispatchInfo'
import {SectionLabel, Field, StatusBadge, OverrideBadge} from '../components/ui'
import {OverrideModal, AuditTrail} from '../components/OverrideModal'
import {useOverride} from '../hooks/useOverride'
import QRScanner, {ScanPhase} from '../components/QRScanner'
import {createDispatch, getDispatchByDriverId, DispatchRecord} from '../api/dispatchApi'
import {
  User,
  Truck,
  ClipboardList,
  BarChart2,
  AlertTriangle,
  ShieldAlert,
  Phone,
  Mail,
} from 'lucide-react'
import {ProfileTab} from '../components/ProfileTab'
import {DispatchTab} from '../components/DispatchTab'
import {ChecklistTab} from '../components/ChecklistTab'
import {ReportsTab} from '../components/ReportsTab'
import {DispatchProfileCard} from '../components/DispatchProfileCard'

const COOKIE_KEY = 'cma_scanned_driver_id'

const TABS = ['Profile', 'Dispatch', 'Checklist', 'Reports'] as const
type Tab = typeof TABS[number]

const TAB_ICONS: Record<Tab, React.ReactNode> = {
  Profile: <User size={14} className='me-1' />,
  Dispatch: <Truck size={14} className='me-1' />,
  Checklist: <ClipboardList size={14} className='me-1' />,
  Reports: <BarChart2 size={14} className='me-1' />,
}

function field(val: any, fallback = '—'): string {
  return val != null && String(val).trim() ? String(val) : fallback
}
function fmtDate(iso?: string): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const Dispatch: React.FC = () => {
  const [phase, setPhase] = useState<ScanPhase>('idle')
  const [errorMsg, setErrorMsg] = useState<string | undefined>()
  const [dispatch, setDispatch] = useState<DispatchRecord | null>(null)
  const [restoring, setRestoring] = useState(true)

  const [activeTab, setActiveTab] = useState<Tab>('Profile')
  const {auditLog, modal, addAudit, openOverride, closeModal} = useOverride()

  const [holdOverridden, setHoldOverridden] = useState(false)
  const [odometer, setOdometer] = useState('')

  const [checklist, setChecklist] = useState<
    Record<string, {status: CheckStatus | ''; remarks: string}>
  >(() => Object.fromEntries(CHECKLIST_TEMPLATE.map(({key}) => [key, {status: '', remarks: ''}])))
  const [checklistOverridden, setChecklistOverridden] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [reportOverrides, setReportOverrides] = useState<Record<string, string>>({})

  const setCheckStatus = (key: string, status: CheckStatus) =>
    setChecklist((prev) => ({...prev, [key]: {...prev[key], status}}))
  const setRemarks = (key: string, remarks: string) =>
    setChecklist((prev) => ({...prev, [key]: {...prev[key], remarks}}))

  const allChecked = CHECKLIST_TEMPLATE.every(({key}) => checklist[key].status !== '')
  const canSubmit = allChecked || checklistOverridden

  useEffect(() => {
    const saved = Cookies.get(COOKIE_KEY)
    if (!saved) {
      setRestoring(false)
      return
    }

    setPhase('loading')
    getDispatchByDriverId(saved)
      .then((data) => {
        if (data) {
          setDispatch(data)
          setPhase('success')
        } else {
          Cookies.remove(COOKIE_KEY)
          setPhase('idle')
        }
      })
      .catch(() => {
        Cookies.remove(COOKIE_KEY)
        setPhase('idle')
      })
      .finally(() => setRestoring(false))
  }, [])

  const handleScanned = useCallback(async (driverId: string) => {
    setPhase('loading')
    setErrorMsg(undefined)
    try {
      const data = await createDispatch(driverId)
      Cookies.set(COOKIE_KEY, driverId, {expires: 1, sameSite: 'strict'})
      setDispatch(data)
      setPhase('success')
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Failed to create dispatch.'
      setErrorMsg(msg)
      setPhase('error')
      throw err // QRScanner setPhase('error') path
    }
  }, [])

  const handleReset = useCallback(() => {
    Cookies.remove(COOKIE_KEY)
    setDispatch(null)
    setPhase('idle')
    setErrorMsg(undefined)
    setActiveTab('Profile')
    setHoldOverridden(false)
    setOdometer('')
    setChecklistOverridden(false)
    setSubmitted(false)
    setChecklist(
      Object.fromEntries(
        CHECKLIST_TEMPLATE.map(({key}) => [key, {status: '' as CheckStatus | '', remarks: ''}])
      )
    )
  }, [])

  const driverInfo = dispatch?.ddm_tbl_driverInfo
  const apprehension = dispatch?.ddm_tbl_driverApprehension
  const vehicleDamage = dispatch?.vdm_tbl_vehicleDamage

  const driverName = field(
    driverInfo?.fullName ??
      (`${driverInfo?.firstName ?? ''} ${driverInfo?.lastName ?? ''}`.trim() || driverInfo?.id)
  )
  const driverInitials =
    driverName
      .split(' ')
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join('') || 'DR'
  const driverPhoto = driverInfo?.photo

  if (restoring) {
    return (
      <div className='d-flex align-items-center justify-content-center' style={{minHeight: 320}}>
        <div className='spinner-border text-primary' role='status'>
          <span className='visually-hidden'>Restoring session…</span>
        </div>
      </div>
    )
  }

  return (
    <div>
      {modal && (
        <OverrideModal title={modal.title} onConfirm={modal.onConfirm} onClose={closeModal} />
      )}

      <div className='card mb-5'>
        {phase === 'success' && dispatch ? (
          <div className='card-body py-4 px-7 d-flex align-items-center justify-content-between'>
            <div className='d-flex align-items-center gap-3'>
              <div
                className='d-flex align-items-center justify-content-center rounded-circle bg-success-subtle'
                style={{width: 36, height: 36}}
              >
                <KTIcon iconName='check-circle' className='fs-4 text-success' />
              </div>
              <div>
                <span className='fw-bolder text-gray-800 fs-6 d-block lh-sm'>Dispatch Active</span>
                <span className='text-muted fs-8'>Driver ID: {field(dispatch.driver_id)}</span>
              </div>
            </div>
            <button
              className='btn btn-sm btn-light-secondary d-flex align-items-center gap-1'
              onClick={handleReset}
            >
              <KTIcon iconName='scan-barcode' className='fs-6 me-1' />
              Start Scan Again
            </button>
          </div>
        ) : (
          <div className='card-body px-7 py-5'>
            <QRScanner
              phase={phase}
              setPhase={setPhase}
              onScanned={handleScanned}
              onReset={handleReset}
              errorMsg={errorMsg}
            />
          </div>
        )}
      </div>

      {phase === 'success' && dispatch && (
        <>
          <DispatchProfileCard
            dispatch={dispatch}
            driverName={driverName}
            driverInitials={driverInitials}
            driverPhoto={driverPhoto}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabs={TABS}
            tabIcons={TAB_ICONS}
            auditLog={auditLog}
            field={field}
          />

          {activeTab === 'Profile' && (
            <ProfileTab
              driverInfo={driverInfo}
              apprehension={apprehension}
              vehicleDamage={vehicleDamage}
              field={field}
              fmtDate={fmtDate}
            />
          )}

          {activeTab === 'Dispatch' && (
            <DispatchTab
              dispatch={dispatch}
              apprehension={apprehension}
              vehicleDamage={vehicleDamage}
              holdOverridden={holdOverridden}
              setHoldOverridden={setHoldOverridden}
              odometer={odometer}
              setOdometer={setOdometer}
              openOverride={openOverride}
              addAudit={addAudit}
              auditLog={auditLog}
              field={field}
              fmtDate={fmtDate}
            />
          )}

          {activeTab === 'Checklist' && (
            <ChecklistTab
              dispatch={dispatch}
              driverName={driverName}
              submitted={submitted}
              setSubmitted={setSubmitted}
              checklist={checklist}
              setChecklist={setChecklist}
              checklistOverridden={checklistOverridden}
              setChecklistOverridden={setChecklistOverridden}
              openOverride={openOverride}
              addAudit={addAudit}
              auditLog={auditLog}
              field={field}
            />
          )}

          {activeTab === 'Reports' && (
            <ReportsTab
              dispatch={dispatch}
              reportOverrides={reportOverrides}
              setReportOverrides={setReportOverrides}
              openOverride={openOverride}
              addAudit={addAudit}
              auditLog={auditLog}
              field={field}
              fmtDate={fmtDate}
            />
          )}
        </>
      )}
    </div>
  )
}

export default Dispatch
