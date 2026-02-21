/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import {useIntl} from 'react-intl'
import {KTIcon} from '../../../../helpers'
import {SidebarMenuItemWithSub} from './SidebarMenuItemWithSub'
import {SidebarMenuItem} from './SidebarMenuItem'
import {useAuth} from '../../../../../app/modules/auth'

const SidebarMenuMain = () => {
  const intl = useIntl()
  const {hasRole} = useAuth()

  return (
    <>
      <SidebarMenuItem
        to='/dashboard'
        icon='element-11'
        title={intl.formatMessage({id: 'MENU.DASHBOARD'})}
        fontIcon='bi-app-indicator'
      />

      {hasRole('driver') && !hasRole(['admin', 'dispatcher']) && (
        <>
          <div className='menu-item'>
            <div className='menu-content pt-8 pb-2'>
              <span className='menu-section text-muted text-uppercase fs-8 ls-1'>My Information</span>
            </div>
          </div>
          <SidebarMenuItem to='/apps/drivers/overview' title='My Personal Data' icon='user' />
          <SidebarMenuItem to='/apps/drivers/my-ledger' title='My Deposit Ledger' icon='wallet' />
          <SidebarMenuItem to='/apps/drivers/my-charges' title='My Charges' icon='Price-tag' />
        </>
      )}
      
      {hasRole(['dispatcher', 'admin']) && (
        <>
          <div className='menu-item'>
            <div className='menu-content pt-8 pb-2'>
              <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Driver Admin</span>
            </div>
          </div>
          <SidebarMenuItemWithSub to='/apps/drivers' title='Driver Management' icon='address-book' fontIcon='bi-person'>
            <SidebarMenuItem to='/apps/drivers/database' title='Driver Database' hasBullet={true} />
            <SidebarMenuItem to='/apps/drivers/apprehensions' title='Apprehension Management' hasBullet={true} />
            <SidebarMenuItem to='/apps/drivers/deposit-ledger' title='Fleet Deposit Ledger' hasBullet={true} />
            <SidebarMenuItem to='/apps/drivers/charges' title='Fleet Charges' hasBullet={true} />
            <SidebarMenuItem to='/apps/drivers/contribution' title='Contribution Ledger' hasBullet={true} />
            <SidebarMenuItem to='/apps/drivers/reports' title='Drivers Report' hasBullet={true} />
          </SidebarMenuItemWithSub>
        </>
      )}

      {/* --- IV. CASHIERING (Finance Only) --- */}
      {hasRole(['Cashier']) && (
        <>
          <div className='menu-item'>
            <div className='menu-content pt-8 pb-2'>
              <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Finance</span>
            </div>
          </div>
          <SidebarMenuItemWithSub to='/apps/cashiering' title='Cashiering' icon='dollar' fontIcon='bi-wallet2'>
            <SidebarMenuItem to='/apps/cashiering/unit-mgmt' title='Driver & Unit Management' hasBullet={true} />
            <SidebarMenuItem to='/apps/cashiering/transactions' title='Financial Processing' hasBullet={true} />
            <SidebarMenuItem to='/apps/cashiering/calc-engine' title='Calculation Engine' hasBullet={true} />
            <SidebarMenuItem to='/apps/cashiering/profiles' title='Profile Management' hasBullet={true} />
            <SidebarMenuItem to='/apps/cashiering/batch' title='Batch & Fleet Processing' hasBullet={true} />
          </SidebarMenuItemWithSub>
        </>
      )}

      {/* --- II. CAR MASTER & III. DISPATCHER --- */}
      {hasRole(['dispatcher', 'admin']) && (
        <>
          <div className='menu-item'>
            <div className='menu-content pt-8 pb-2'>
              <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Operations</span>
            </div>
          </div>
          <SidebarMenuItemWithSub to='/apps/fleet' title='Car Master List' icon='bus' fontIcon='bi-truck'>
            <SidebarMenuItem to='/apps/fleet/info' title='Vehicle Information' hasBullet={true} />
            <SidebarMenuItem to='/apps/fleet/damages' title='Damage History' hasBullet={true} />
            <SidebarMenuItem to='/apps/fleet/reports' title='Vehicle Reports' hasBullet={true} />
          </SidebarMenuItemWithSub>

          <SidebarMenuItemWithSub to='/apps/dispatch' title='Dispatcher' icon='delivery-2' fontIcon='bi-geo-alt'>
            <SidebarMenuItem to='/apps/dispatch/execution' title='Dispatch Execution' hasBullet={true} />
            <SidebarMenuItem to='/apps/dispatch/window' title='Window Display' hasBullet={true} />
            <SidebarMenuItem to='/apps/dispatch/checklist' title='Pre-Dispatch Checklist' hasBullet={true} />
            <SidebarMenuItem to='/apps/dispatch/reports' title='Dispatch Reports' hasBullet={true} />
          </SidebarMenuItemWithSub>
        </>
      )}

      {/* --- V. INVENTORY & VI. JOB ORDERS --- */}
      {hasRole(['inventory', 'admin']) && (
        <>
          <div className='menu-item'>
            <div className='menu-content pt-8 pb-2'>
              <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Warehouse</span>
            </div>
          </div>
          <SidebarMenuItemWithSub to='/apps/inventory' title='Inventory' icon='archive' fontIcon='bi-box-seam'>
            <SidebarMenuItem to='/apps/inventory/master-list' title='Item Master List' hasBullet={true} />
            <SidebarMenuItem to='/apps/inventory/stock-in' title='Stock-In' hasBullet={true} />
            <SidebarMenuItem to='/apps/inventory/stock-out' title='Stock-Out' hasBullet={true} />
            <SidebarMenuItem to='/apps/inventory/internal-use' title='Internal Issuance' hasBullet={true} />
            <SidebarMenuItem to='/apps/inventory/returns' title='Inventory Returns' hasBullet={true} />
            <SidebarMenuItem to='/apps/inventory/reports' title='Inventory Reports' hasBullet={true} />
          </SidebarMenuItemWithSub>
        </>
      )}

      {hasRole(['dispatcher', 'inventory', 'admin']) && (
        <>
          <div className='menu-item'>
            <div className='menu-content pt-8 pb-2'>
              <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Maintenance</span>
            </div>
          </div>
          <SidebarMenuItemWithSub to='/apps/job-orders' title='Job Orders' icon='setting-2' fontIcon='bi-tools'>
            <SidebarMenuItem to='/apps/job-orders/records' title='Master Record' hasBullet={true} />
            <SidebarMenuItem to='/apps/job-orders/unit-info' title='Unit Info' hasBullet={true} />
            <SidebarMenuItem to='/apps/job-orders/scope' title='Work Scope' hasBullet={true} />
            <SidebarMenuItem to='/apps/job-orders/assignment' title='Personnel Assignment' hasBullet={true} />
          </SidebarMenuItemWithSub>
        </>
      )}

      {/* --- ADMINISTRATION --- */}
      {hasRole('admin') && (
        <>
          <div className='menu-item'>
            <div className='menu-content pt-8 pb-2'>
              <span className='menu-section text-muted text-uppercase fs-8 ls-1'>System</span>
            </div>
          </div>
          <SidebarMenuItemWithSub to='/apps/user-management' title='User Management' fontIcon='bi-shield-check' icon='abstract-28'>
            <SidebarMenuItem to='/apps/user-management/users' title='Users' hasBullet={true} />
            <SidebarMenuItem to='/apps/user-management/roles' title='Roles' hasBullet={true} />
            <SidebarMenuItem to='/apps/user-management/permissions' title='Permissions' hasBullet={true} />
            <SidebarMenuItem to='/apps/user-management/rolePermissions' title='Role Permissions' hasBullet={true} />
          </SidebarMenuItemWithSub>
        </>
      )}
    </>
  )
}

export {SidebarMenuMain}