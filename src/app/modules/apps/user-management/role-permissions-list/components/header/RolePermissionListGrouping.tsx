import {useQueryClient, useMutation} from 'react-query'
import {QUERIES} from '../../../../../../../_metronic/helpers'
import {useListView} from  '../../core/ListViewProvider'
import {useQueryResponse} from '../../core/QueryResponseProvider'


const RolePermissionListGrouping = () => {
  const {selected, clearSelected} = useListView()
  const queryClient = useQueryClient()
  const {query} = useQueryResponse()



  return (
    <div className='d-flex justify-content-end align-items-center'>
      <div className='fw-bolder me-5'>
        <span className='me-2'>{selected.length}</span> Selected
      </div>


    </div>
  )
}

export {RolePermissionListGrouping}
