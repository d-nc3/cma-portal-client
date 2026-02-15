import {FC} from 'react'
import {useIntl} from 'react-intl'
import {toAbsoluteUrl} from '../../../_metronic/helpers'
import {PageTitle} from '../../../_metronic/layout/core'
import {useAuth} from '../../modules/auth'
import {
  ListsWidget2,
  ListsWidget3,
  ListsWidget4,
  ListsWidget6,
  TablesWidget5,
  TablesWidget10,
  MixedWidget8,
  CardsWidget7,
  CardsWidget17,
  CardsWidget20,
  ListsWidget26,
  EngageWidget10,
} from '../../../_metronic/partials/widgets'


const WIDGET_LIST = [
  {
    component: (
      <>
        <CardsWidget20 className='h-md-50 mb-5 mb-xl-10' description='Active Projects' color='#F1416C' img={toAbsoluteUrl('/media/patterns/vector-1.png')} />
        <CardsWidget7 className='h-md-50 mb-5 mb-xl-10' description='Professionals' icon={false} stats={357} labelColor='dark' textColor='gray-300' />
      </>
    ),
    roles: ['admin'],
    gridClass: 'col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10'
  },
  {
    component: (
      <>
        <CardsWidget17 className='h-md-50 mb-5 mb-xl-10' />
        <ListsWidget26 className='h-lg-50' />
      </>
    ),
    roles: ['admin', 'driver', 'dispatcher', 'inventory'], // Everyone
    gridClass: 'col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10'
  },
  {
    component: <EngageWidget10 className='h-md-100' />,
    roles: ['admin', 'dispatcher'],
    gridClass: 'col-xxl-6'
  }
]
const DashboardPage: FC = () => {
  const {hasRole} = useAuth()

  return (
    <>
      <div className='row g-5 g-xl-10 mb-5 mb-xl-10'>
        {WIDGET_LIST
          .filter(widget => hasRole(widget.roles))
          .map((widget, index) => (
            <div key={index} className={widget.gridClass}>
              {widget.component}
            </div>
          ))
        }
      </div>

      {/* Rows that are role-agnostic can stay static, or you can make a 
          second config list for the bottom rows! */}
      <div className='row g-5 gx-xxl-8'>
        <div className='col-xxl-4'>
          <MixedWidget8 className='card-xxl-stretch mb-xl-3' chartColor='success' chartHeight='150px' />
        </div>
        <div className='col-xxl-8'>
          <TablesWidget5 className='card-xxl-stretch mb-5 mb-xxl-8' />
        </div>
      </div>
    </>
  )
}

const DashboardWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
      <DashboardPage />
    </>
  )
}

export {DashboardWrapper}