import { FC } from 'react'
import { KTIcon } from '../../../_metronic/helpers'

const DriverLedgerPage: FC = () => {
  return (
    <div className="container-xxl">

      {/* Page Title */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-8">
        <div>
          <h1 className="fs-2hx fw-bold text-gray-900">
            Drivers Deposit Ledger
          </h1>
          <span className="text-muted">
            Fleet Management System
          </span>
        </div>

        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-icon btn-light-primary">
            <KTIcon iconName="setting-2" className="fs-2" />
          </button>
        </div>
      </div>

      {/* Driver Info Card */}
      <div className="card mb-6">
        <div className="card-body d-flex flex-wrap justify-content-between align-items-center">

          <div className="d-flex align-items-center gap-5">
            <div className="symbol symbol-75px symbol-circle">
              <img src="/media/avatars/300-1.jpg" alt="driver" />
            </div>

            <div>
              <h2 className="fw-bold mb-1">Errow Mirandilla</h2>
              <div className="text-muted">
                Driver ID: DRV-2024-001 | Unit: ABC-123
              </div>

              <div className="mt-2">
                <span className="badge badge-light-success me-2">
                  Active
                </span>
                <span className="text-gray-500 fs-7">
                  Member since 2022
                </span>
              </div>
            </div>
          </div>

          <div className="d-flex gap-3 mt-4 mt-md-0">
            <button
              className="btn btn-success"
              data-bs-toggle="modal"
              data-bs-target="#kt_modal_upload"
            >
              <KTIcon iconName="upload" className="fs-4 me-2" />
              Upload Receipt
            </button>
          </div>
        </div>
      </div>

      {/* Balance Alert Banner */}
      <div className="alert alert-success d-flex align-items-center mb-6">
        <KTIcon iconName="shield-tick" className="fs-2 me-3 text-success" />
        <div>
          <h4 className="mb-1">Driver Has Deposit</h4>
          <span>Credit Balance Available</span>
        </div>

        <div className="ms-auto fw-bold fs-2">
          ₱6,500.00
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-6 mb-6">

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <KTIcon iconName="arrow-down" className="fs-2 text-success" />
                <span className="badge badge-light">A/P</span>
              </div>

              <div className="mt-4">
                <div className="text-muted">Total Deposits</div>
                <div className="fw-bold fs-2 text-success">
                  ₱25,000.00
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <KTIcon iconName="arrow-up" className="fs-2 text-danger" />
                <span className="badge badge-light">A/R</span>
              </div>

              <div className="mt-4">
                <div className="text-muted">Total Charges</div>
                <div className="fw-bold fs-2 text-danger">
                  ₱18,500.00
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <KTIcon iconName="wallet" className="fs-2 text-primary" />
                <span className="badge badge-light">NET</span>
              </div>

              <div className="mt-4">
                <div className="text-muted">Current Balance</div>
                <div className="fw-bold fs-2 text-success">
                  -₱6,500.00
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Ledger Table */}
      <div className="card">
        <div className="card-header border-0 pt-6">
          <h3 className="card-title fw-bold">
            Transaction History
          </h3>

          <div className="card-toolbar d-flex gap-3">
            <input
              type="text"
              className="form-control form-control-sm w-250px"
              placeholder="Search..."
            />

            <button className="btn btn-light-primary btn-sm">
              Generate Report
            </button>

            <button className="btn btn-light-success btn-sm">
              Export
            </button>
          </div>
        </div>

        <div className="card-body py-4">
          <div className="table-responsive">
            <table className="table table-row-bordered align-middle">
              <thead>
                <tr className="fw-bold text-muted">
                  <th>Date</th>
                  <th>Reference</th>
                  <th>Particulars</th>
                  <th className="text-end">Debit</th>
                  <th className="text-end">Credit</th>
                  <th className="text-end">Balance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>05/15/2024</td>
                  <td>REF-001</td>
                  <td>Vehicle Damage - Bumper</td>
                  <td className="text-danger text-end">
                    ₱5,000.00
                  </td>
                  <td className="text-end">-</td>
                  <td className="text-danger text-end fw-bold">
                    ₱1,500.00
                  </td>
                  <td>
                    <span className="badge badge-light-danger">
                      Posted
                    </span>
                  </td>
                </tr>

                <tr>
                  <td>05/10/2024</td>
                  <td>REF-002</td>
                  <td>Cash Deposit</td>
                  <td className="text-end">-</td>
                  <td className="text-success text-end">
                    ₱10,000.00
                  </td>
                  <td className="text-success text-end fw-bold">
                    -₱3,500.00
                  </td>
                  <td>
                    <span className="badge badge-light-success">
                      Verified
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  )
}

export default DriverLedgerPage