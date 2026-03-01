import {FC, useEffect, useState} from 'react'
import {KTCard, KTCardBody, KTIcon} from '../../../../../../_metronic/helpers'
import {useParams} from 'react-router-dom'
import {getDamageRecordById} from '../../core/_requests'

const DamageHistoryTab: FC = () => {
  const {id} = useParams<{id: string}>()
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true)
      try {
        const response = await getDamageRecordById(id)
        // Ensure we are setting the array from the response
        setData(response.data || [])
      } catch (error) {
        console.error('Error fetching damage logs:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchLogs()
  }, [id])

  return (
    <KTCard>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Incident & Damage Logs</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>
            Historical record of unit physical condition
          </span>
        </h3>
      </div>

      <KTCardBody className='py-3'>
        <div className='table-responsive'>
          <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
            <thead>
              <tr className='fw-bold text-muted text-uppercase'>
                <th className='min-w-150px'>Date & Type</th>
                <th className='min-w-200px'>Description</th>
                <th className='min-w-150px'>Slip / Ref No.</th>
                <th className='min-w-100px text-end'>Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((incident) => {
                  // Calculate total from itemizedCharges array in your schema
                  const totalAmount = incident.itemizedCharges?.reduce(
                    (sum: number, charge: any) => sum + Number(charge.amount || 0),
                    0
                  )

                  return (
                    <tr key={incident.id}>
                      <td>
                        <div className='d-flex align-items-center'>
                          <div className='symbol symbol-45px me-5'>
                            <span className='symbol-label bg-light-warning'>
                              <KTIcon iconName='shield-cross' className='fs-2x text-warning' />
                            </span>
                          </div>
                          <div className='d-flex justify-content-start flex-column'>
                            <span className='text-dark fw-bold text-hover-primary fs-6 text-uppercase'>
                              {incident.damageType}
                            </span>
                            <span className='text-muted fw-semibold d-block fs-7'>
                              {new Date(incident.incidentDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className='text-gray-800 fw-semibold d-block fs-7'>
                          {incident.description || 'No description provided'}
                        </span>
                      </td>
                      <td>
                        <div className='d-flex flex-column'>
                          <span className='text-gray-800 fw-bold fs-7'>{incident.slipNumber}</span>
                          <span className='text-muted fs-8'>{incident.issueRefNo}</span>
                        </div>
                      </td>
                      <td className='text-end'>
                        <span className='text-gray-800 fw-bold fs-6'>
                          ₱{totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </span>
                      </td>
                     
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} className='text-center text-muted py-10'>
                    {loading ? 'Loading records...' : 'No incident records found for this vehicle.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </KTCardBody>
    </KTCard>
  )
}

export {DamageHistoryTab}