/* eslint-disable jsx-a11y/anchor-is-valid */
'use client'
import React, {useState} from 'react'
import { DIVISION_DATA, STATUS_MAP } from '../data/dispatchInfo'
import {Driver, DispatchStatus, FleetGroup, CollectionGroup, SelectedDriver} from '../types/dispatch'
import {StatusBadge, CollapseToggle} from '../components/ui'
import {DriverModal} from '../components/DriverModal'


const countByStatus = (drivers: Driver[]) =>
  drivers.reduce((acc, d) => {
    acc[d.dispatchStatus] = (acc[d.dispatchStatus] ?? 0) + 1
    return acc
  }, {} as Record<DispatchStatus, number>)

const STATUS_ORDER: DispatchStatus[] = ['dispatched', 'cc', 'nd', 'shop', 'hold']

const StatusSummaryBadges: React.FC<{drivers: Driver[]}> = ({drivers}) => {
  const counts = countByStatus(drivers)
  return (
    <div className='d-flex gap-2 flex-wrap'>
      {STATUS_ORDER.map((s) => counts[s] ? (
        <span key={s} className={`badge ${STATUS_MAP[s].badge} fw-bold fs-9`}>
          {STATUS_MAP[s].label} ×{counts[s]}
        </span>
      ) : null)}
    </div>
  )
}


const FleetTable: React.FC<{
  fleet: FleetGroup
  divisionName: string
  collectionId: string
  onDriverClick: (s: SelectedDriver) => void
}> = ({fleet, divisionName, collectionId, onDriverClick}) => {
  const counts   = countByStatus(fleet.drivers)
  const total    = fleet.drivers.length
  const dispatched = counts['dispatched'] ?? 0

  return (
    <div className='mb-2'>
      {/* Fleet label row */}
      <div className='d-flex align-items-center px-3 py-2 bg-light-primary rounded-top'>
        <span className='fw-bolder text-primary fs-8 text-uppercase me-2'>
          {fleet.fleetName}
        </span>
        <span className='badge badge-light fw-bold fs-9'>{fleet.fleetId}</span>
      </div>

      {/* Fleet data table */}
      <table className='table table-row-dashed table-row-gray-200 align-middle gs-0 gy-2 mb-0'>
        <thead>
          <tr className='text-muted fw-bold fs-8 text-uppercase border-0'>
            <th className='ps-3'>Car Name</th>
            <th>Driver</th>
            <th>Odometer Reading</th>
            <th>Remarks</th>
            <th>Check List</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {fleet.drivers.map((driver) => {
            const issueNotes = driver.checklist
              .filter(c => c.status === 'issue' && c.remarks)
              .map(c => c.remarks)
              .join(', ')

            return (
              <tr key={driver.id}>
                <td className='fw-bold text-gray-800 fs-7 ps-3'>{driver.car}</td>
                <td>
                  <a
                    href='#'
                    className='fw-bold text-primary fs-7 text-hover-dark'
                    onClick={(e) => {
                      e.preventDefault()
                      onDriverClick({driver, divisionName, collectionId, fleetName: fleet.fleetName})
                    }}
                  >
                    {driver.name}
                  </a>
                </td>
                <td className='text-gray-600 fs-7'>{driver.odometer}</td>
                <td className='text-gray-600 fs-7'>{driver.remarks}</td>
                <td className='fs-7'>
                  {issueNotes
                    ? <span className='text-danger'>{issueNotes}</span>
                    : driver.checklist.some(c => c.status === 'skipped')
                      ? <span className='text-muted'>—</span>
                      : <span className='text-success fw-bold'>All OK</span>
                  }
                </td>
                <td>
                  <div className='d-flex align-items-center gap-1'>
                    <StatusBadge status={driver.dispatchStatus} />
                    {driver.overrides.length > 0 && (
                      <span className='badge badge-light-dark fw-bold fs-9'>OVR</span>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
        {/* Fleet subtotal */}
        <tfoot>
          <tr className='border-top bg-light'>
            <td colSpan={2} className='fw-bolder text-gray-700 fs-8 ps-3 py-3'>
              Total {fleet.fleetName}
            </td>
            <td className='fw-bolder text-success fs-7 py-3'>
              {dispatched}
            </td>
            <td colSpan={3} className='py-3'>
              <div className='d-flex gap-3'>
                {STATUS_ORDER.map((s) => counts[s] ? (
                  <span key={s} className='fs-9 text-muted'>
                    <span className={`fw-bolder ${STATUS_MAP[s].textColor}`}>{counts[s]}</span>
                    {' '}{STATUS_MAP[s].label}
                  </span>
                ) : null)}
                <span className='fs-9 text-muted border-start ps-3'>
                  <span className='fw-bolder text-gray-800'>{total}</span> total
                </span>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

// ─── Collection Block ─────────────────────────────────────────────────────────

const CollectionBlock: React.FC<{
  collection: CollectionGroup
  divisionName: string
  isOpen: boolean
  onToggle: () => void
  onDriverClick: (s: SelectedDriver) => void
}> = ({collection, divisionName, isOpen, onToggle, onDriverClick}) => {
  const allDrivers = collection.fleets.flatMap(f => f.drivers)
  const colTotal   = allDrivers.length
  const colDispatched = allDrivers.filter(d => d.dispatchStatus === 'dispatched').length

  return (
    <div className='mb-5'>
      {/* Collection header */}
      <CollapseToggle
        open={isOpen}
        onClick={onToggle}
        className='px-5 py-3 border rounded mb-0'
      >
        <div className='d-flex align-items-center gap-3 flex-grow-1'>
          <span className='fw-bolder text-gray-800 fs-7'>
            Collection: <span className='text-primary'>{collection.collectionId}</span>
          </span>
          <StatusSummaryBadges drivers={allDrivers} />
        </div>
        <span className='text-muted fs-8 ms-auto me-3'>
          <span className='fw-bolder text-success'>{colDispatched}</span> / {colTotal} dispatched
        </span>
      </CollapseToggle>

      {isOpen && (
        <div className='border border-top-0 rounded-bottom p-4'>
          {collection.fleets.map((fleet, fi) => (
            <div key={`${fleet.fleetId}-${fi}`} className={fi > 0 ? 'mt-5' : ''}>
              <FleetTable
                fleet={fleet}
                divisionName={divisionName}
                collectionId={collection.collectionId}
                onDriverClick={onDriverClick}
              />
            </div>
          ))}

          {/* Collection total */}
          <div className='d-flex align-items-center justify-content-between border-top mt-3 pt-3 px-2'>
            <span className='fw-bolder text-gray-700 fs-8 text-uppercase'>
              Collection Total — {collection.collectionId}
            </span>
            <div className='d-flex gap-4'>
              {STATUS_ORDER.map((s) => {
                const count = allDrivers.filter(d => d.dispatchStatus === s).length
                return count ? (
                  <div key={s} className='text-center'>
                    <div className={`fw-bolder fs-6 ${STATUS_MAP[s].textColor}`}>{count}</div>
                    <div className='text-muted fs-9'>{STATUS_MAP[s].label}</div>
                  </div>
                ) : null
              })}
              <div className='text-center border-start ps-4'>
                <div className='fw-bolder fs-6 text-primary'>{colTotal}</div>
                <div className='text-muted fs-9'>Total</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

const DispatchReports: React.FC = () => {
  const [selected, setSelected] = useState<SelectedDriver | null>(null)

  // Expand/collapse: divisions and collections keyed by string
  const [openDivisions,   setOpenDivisions]   = useState<Record<string, boolean>>(
    () => Object.fromEntries(DIVISION_DATA.map(d => [d.divisionId, true]))
  )
  const [openCollections, setOpenCollections] = useState<Record<string, boolean>>({})

  const isColOpen  = (key: string) => key in openCollections ? openCollections[key] : true
  const toggleDiv  = (id: string)  => setOpenDivisions(p  => ({...p, [id]: !p[id]}))
  const toggleCol  = (key: string) => setOpenCollections(p => ({...p, [key]: !(key in p ? p[key] : true)}))

  // Grand totals
  const allDrivers      = DIVISION_DATA.flatMap(d => d.collections.flatMap(c => c.fleets.flatMap(f => f.drivers)))
  const grandTotal      = allDrivers.length
  const grandDispatched = allDrivers.filter(d => d.dispatchStatus === 'dispatched').length

  return (
    <div>
      {selected && (
        <DriverModal
          driver={selected.driver}
          fleetName={selected.fleetName}
          division={selected.divisionName}
          collectionId={selected.collectionId}
          onClose={() => setSelected(null)}
        />
      )}

      {/* Page header */}
      <div className='d-flex align-items-center justify-content-between mb-6'>
        <div>
          <h2 className='fw-bolder mb-0'>Dispatch Report — Daily</h2>
          <span className='text-muted fs-7'>Feb 22, 2026</span>
        </div>
        <div className='d-flex gap-3'>
          <div className='border rounded px-5 py-3 text-center'>
            <div className='fw-bolder fs-4 text-success'>{grandDispatched}</div>
            <div className='text-muted fs-9'>Dispatched</div>
          </div>
          <div className='border rounded px-5 py-3 text-center'>
            <div className='fw-bolder fs-4 text-primary'>{grandTotal}</div>
            <div className='text-muted fs-9'>Overall Fleet</div>
          </div>
        </div>
      </div>

      {/* Division sections */}
      {DIVISION_DATA.map((div) => {
        const divDrivers     = div.collections.flatMap(c => c.fleets.flatMap(f => f.drivers))
        const divDispatched  = divDrivers.filter(d => d.dispatchStatus === 'dispatched').length
        const isDivOpen      = openDivisions[div.divisionId] ?? true

        return (
          <div key={div.divisionId} className='card mb-5'>

            {/* Division header */}
            <div className='card-header border-0'>
              <CollapseToggle
                open={isDivOpen}
                onClick={() => toggleDiv(div.divisionId)}
                className='card-title'
              >
                <h4 className='fw-bolder m-0'>{div.divisionName}</h4>
                <span className='badge badge-light fw-bold fs-8'>{div.divisionId}</span>
              </CollapseToggle>
              <div className='card-toolbar'>
                <span className='text-muted fs-8'>
                  Dispatched:&nbsp;
                  <span className='fw-bolder text-success'>{divDispatched}</span>
                  &nbsp;/&nbsp;{divDrivers.length}
                </span>
              </div>
            </div>

            {isDivOpen && (
              <div className='card-body pt-2'>
                {div.collections.map((col) => {
                  const colKey = `${div.divisionId}-${col.collectionId}`
                  return (
                    <CollectionBlock
                      key={colKey}
                      collection={col}
                      divisionName={div.divisionName}
                      isOpen={isColOpen(colKey)}
                      onToggle={() => toggleCol(colKey)}
                      onDriverClick={setSelected}
                    />
                  )
                })}

                {/* Division total */}
                <div className='d-flex align-items-center justify-content-between border-top pt-5 px-2'>
                  <span className='fw-bolder text-gray-700 fs-7 text-uppercase'>
                    Division Total — {div.divisionName}
                  </span>
                  <div className='d-flex gap-4'>
                    {STATUS_ORDER.map((s) => {
                      const count = divDrivers.filter(d => d.dispatchStatus === s).length
                      return count ? (
                        <div key={s} className='text-center'>
                          <div className={`fw-bolder fs-6 ${STATUS_MAP[s].textColor}`}>{count}</div>
                          <div className='text-muted fs-9'>{STATUS_MAP[s].label}</div>
                        </div>
                      ) : null
                    })}
                    <div className='text-center border-start ps-4'>
                      <div className='fw-bolder fs-6 text-primary'>{divDrivers.length}</div>
                      <div className='text-muted fs-9'>Total</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* Grand total */}
      <div className='card'>
        <div className='card-body py-5 px-7'>
          <div className='d-flex align-items-center justify-content-between'>
            <span className='fw-bolder text-gray-800 fs-6 text-uppercase'>Overall Fleet Total</span>
            <div className='d-flex gap-4'>
              {STATUS_ORDER.map((s) => {
                const count = allDrivers.filter(d => d.dispatchStatus === s).length
                return count ? (
                  <div key={s} className='text-center'>
                    <div className={`fw-bolder fs-5 ${STATUS_MAP[s].textColor}`}>{count}</div>
                    <div className='text-muted fs-9'>{STATUS_MAP[s].label}</div>
                  </div>
                ) : null
              })}
              <div className='text-center border-start ps-4'>
                <div className='fw-bolder fs-5 text-primary'>{grandTotal}</div>
                <div className='text-muted fs-9'>Total</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DispatchReports