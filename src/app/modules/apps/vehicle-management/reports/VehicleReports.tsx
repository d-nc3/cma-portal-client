import {FC, useState, useEffect, useMemo} from 'react'
import {KTCard, KTCardBody, KTIcon} from '../../../../../_metronic/helpers'
import {getVehicles} from '../core/_requests'

export const VehicleReports: FC = () => {
  const [activeTab, setActiveTab] = useState('compliance')
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getVehicles()
        setVehicles(res.data?.data || res.data || [])
      } catch (e) {
        console.error('Fetch error:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const registrationGroups = useMemo(() => {
    const groups: {[key: string]: any[]} = {
      '1': [], '2': [], '3': [], '4': [], '5': [],
      '6': [], '7': [], '8': [], '9': [], '0': []
    }
    vehicles.forEach((v) => {
      const lastDigit = v.plateNumber?.slice(-1)
      if (groups[lastDigit]) groups[lastDigit].push(v)
    })
    return groups
  }, [vehicles])

  const complianceForecast = useMemo(() => {
    const today = new Date()
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(today.getDate() + 30)

    return vehicles.map(v => {
      const insuranceDate = new Date(v.insuranceExpiration)
      const cpcDate = new Date(v.cpcValidityExpiration)
      
      const daysToInsurance = Math.ceil((insuranceDate.getTime() - today.getTime()) / (1000 * 3600 * 24))
      const daysToCPC = Math.ceil((cpcDate.getTime() - today.getTime()) / (1000 * 3600 * 24))

      return {
        ...v,
        daysToInsurance,
        daysToCPC,
        isUrgent: daysToInsurance <= 30 || daysToCPC <= 30
      }
    }).filter(v => v.isUrgent).sort((a, b) => Math.min(a.daysToInsurance, a.daysToCPC) - Math.min(b.daysToInsurance, b.daysToCPC))
  }, [vehicles])

  // 3. Logic: Financial/Maintenance Impact
  const financialData = useMemo(() => {
    return vehicles.map(v => {
      const totalCost = v.damageHistory?.reduce((acc: number, dmg: any) => 
        acc + (dmg.actualCost || 0), 0) || 0
      return { ...v, totalCost }
    }).sort((a, b) => b.totalCost - a.totalCost)
  }, [vehicles])

  const currentMonthDigit = (new Date().getMonth() + 1).toString().slice(-1)

  return (
    <>
      <div className='row g-5 g-xl-10 mb-5 mb-xl-10'>
        <div className='col-md-4'>
          <div className='card bg-light-danger border-0'>
            <div className='card-body'>
              <KTIcon iconName='information-2' className='text-danger fs-3x ms-n1' />
              <div className='text-gray-900 fw-bold fs-2 mb-2 mt-5'>{complianceForecast.length} Units</div>
              <div className='fw-semibold text-gray-500'>Expiring Permits (30 Days)</div>
            </div>
          </div>
        </div>
        <div className='col-md-4'>
          <div className='card bg-light-primary border-0'>
            <div className='card-body'>
              <KTIcon iconName='calendar' className='text-primary fs-3x ms-n1' />
              <div className='text-gray-900 fw-bold fs-2 mb-2 mt-5'>{registrationGroups[currentMonthDigit]?.length || 0} Units</div>
              <div className='fw-semibold text-gray-500'>Registration Due This Month</div>
            </div>
          </div>
        </div>
        <div className='col-md-4'>
          <div className='card bg-light-warning border-0'>
            <div className='card-body'>
              <KTIcon iconName='dollar' className='text-warning fs-3x ms-n1' />
              <div className='text-gray-900 fw-bold fs-2 mb-2 mt-5'>
                ₱{financialData.reduce((acc, curr) => acc + curr.totalCost, 0).toLocaleString()}
              </div>
              <div className='fw-semibold text-gray-500'>Lifetime Maintenance Spend</div>
            </div>
          </div>
        </div>
      </div>

      <KTCard>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>Vehicle Analysis</span>
            <span className='text-muted mt-1 fw-semibold fs-7'>Proactive compliance and financial monitoring</span>
          </h3>
          <div className='card-toolbar'>
            <ul className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bold'>
              <li className='nav-item'>
                <button className={`nav-link btn btn-active-light-primary border-0 py-5 me-10 ${activeTab === 'compliance' && 'active text-primary'}`} onClick={() => setActiveTab('compliance')}>
                  LTO Schedule
                </button>
              </li>
              <li className='nav-item'>
                <button className={`nav-link btn btn-active-light-primary border-0 py-5 me-10 ${activeTab === 'watch' && 'active text-primary'}`} onClick={() => setActiveTab('watch')}>
                  Permit Watchlist
                </button>
              </li>
              <li className='nav-item'>
                <button className={`nav-link btn btn-active-light-primary border-0 py-5 me-10 ${activeTab === 'financial' && 'active text-primary'}`} onClick={() => setActiveTab('financial')}>
                  Cost/ROI Analysis
                </button>
              </li>
            </ul>
          </div>
        </div>

        <KTCardBody>
          <div className='tab-content'>
            {/* TAB: LTO SCHEDULE */}
            {activeTab === 'compliance' && (
              <div className='row g-5'>
                {Object.entries(registrationGroups).map(([digit, units]) => (
                  <div className='col-md-4 mb-5' key={digit}>
                    <div className={`card border border-dashed ${digit === currentMonthDigit ? 'border-primary bg-light-primary' : 'border-gray-400'} p-5 h-100`}>
                      <div className='d-flex flex-stack mb-5'>
                        <span className='badge badge-dark fs-8 fw-bold'>Digit {digit} ({units.length})</span>
                        {digit === currentMonthDigit && <span className='badge badge-primary'>Current Month</span>}
                      </div>
                      <div className='mh-150px scroll-y'>
                        {units.length > 0 ? units.map(u => (
                          <div key={u.id} className='text-gray-800 fw-bold fs-7 mb-1'>• {u.plateNumber} - <span className='text-muted fw-normal'>{u.unitName}</span></div>
                        )) : <span className='text-muted fs-8 italic'>No units</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: PERMIT WATCHLIST */}
            {activeTab === 'watch' && (
              <div className='row g-5'>
                {complianceForecast.length > 0 ? complianceForecast.map(v => (
                  <div className='col-md-6' key={v.id}>
                    <div className='card bg-light-warning border border-warning border-dashed p-5'>
                      <div className='fw-bold fs-6 text-gray-900'>{v.unitName} ({v.plateNumber})</div>
                      <div className='separator border-warning opacity-20 my-3'></div>
                      <div className='d-flex flex-stack mb-1'>
                        <span className='text-gray-600 fs-7'>Insurance:</span>
                        <span className={`fw-bold fs-7 ${v.daysToInsurance <= 7 ? 'text-danger' : 'text-gray-800'}`}>{v.daysToInsurance} days left</span>
                      </div>
                      <div className='d-flex flex-stack'>
                        <span className='text-gray-600 fs-7'>CPC Validity:</span>
                        <span className={`fw-bold fs-7 ${v.daysToCPC <= 7 ? 'text-danger' : 'text-gray-800'}`}>{v.daysToCPC} days left</span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className='text-center p-10 w-100'>
                    <KTIcon iconName='check-circle' className='text-success fs-3x' />
                    <div className='text-muted mt-2'>All permits are compliant for the next 30 days.</div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: COST/ROI ANALYSIS */}
            {activeTab === 'financial' && (
              <div className='table-responsive'>
                <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
                  <thead>
                    <tr className='fw-bold text-muted text-uppercase'>
                      <th className='min-w-150px'>Unit</th>
                      <th className='min-w-120px text-center'>Boundary Status</th>
                      <th className='min-w-120px'>Repair Expense</th>
                      <th className='min-w-100px text-end'>ROI Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financialData.map((v) => (
                      <tr key={v.id}>
                        <td>
                          <div className='text-dark fw-bold fs-6'>{v.unitName}</div>
                          <div className='text-muted fs-7'>{v.brand} {v.yearModel}</div>
                        </td>
                        <td className='text-center'>
                          <span className='badge badge-light-info fw-bold'>{v.boundaryClassification}</span>
                        </td>
                        <td><span className='text-danger fw-bold'>₱{v.totalCost.toLocaleString()}</span></td>
                        <td className='text-end'>
                           <span className={`badge badge-light-${v.totalCost > 25000 ? 'danger' : 'success'} fw-bold`}>
                            {v.totalCost > 25000 ? 'High Cost' : 'Efficient'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </KTCardBody>
      </KTCard>
    </>
  )
}