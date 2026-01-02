import React, { useEffect, useState } from 'react';
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers';
import { Link, useLocation } from 'react-router-dom';
import { Dropdown1 } from '../../../_metronic/partials';

interface Driver {
  id: string;
  fullname: string;
  address: string;
  contactNumber: string;
  carAssignment: string;
  licenseNumber: string;
  licenseExpiry: string;
}

const AccountHeader: React.FC = () => {
  const location = useLocation();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCurrentDriver = async (): Promise<Driver> => {
    // Get stored object from localStorage
    const stored = localStorage.getItem("kt-auth-react-v");
    if (!stored) throw new Error("No token found in localStorage");

    // Parse JSON and extract token
    let token: string;
    try {
      const parsed = JSON.parse(stored);
      token = parsed.token;
      if (!token) throw new Error("Token missing in stored object");
    } catch {
      throw new Error("Failed to parse token from localStorage");
    }

    // Fetch driver info from backend
    const response = await fetch("http://localhost:5000/api/drivers/driver/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) throw new Error("Unauthorized: Invalid or expired token");
      throw new Error("Failed to fetch driver data");
    }

    return response.json();
  };

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        setLoading(true);
        const driverData = await getCurrentDriver();
        setDriver(driverData);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching driver data:", err);
        setError(err.message);
        setDriver(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDriver();
  }, []);

  if (loading) return <div className="p-5">Loading profile...</div>;
  if (error) return <div className="p-5 text-danger">Error: {error}</div>;
  if (!driver) return <div className="p-5">No driver info found</div>;

  return (
    <div className="card mb-5 mb-xl-10">
      <div className="card-body pt-9 pb-0">
        <div className="d-flex flex-wrap flex-sm-nowrap mb-3">
          <div className="me-7 mb-4">
            <div className="symbol symbol-100px symbol-lg-160px symbol-fixed position-relative">
              <img src={toAbsoluteUrl('/media/avatars/300-1.jpg')} alt="Profile" />
            </div>
          </div>

          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h1 className="fw-bold">{driver.fullname}</h1>
                <div className="d-flex align-items-center gap-2 text-muted">
                  <KTIcon iconName="phone" className="fs-5" />
                  <span>{driver.contactNumber}</span>
                </div>
                <div className="badge badge-light-primary mt-2">{driver.carAssignment}</div>
              </div>
            </div>

            <div className="d-flex flex-wrap mt-4">
              <div className="border border-gray-300 rounded p-4 me-4">
                <div className="fw-bold fs-5">License</div>
                <div className="text-muted">{driver.licenseNumber}</div>
              </div>

              <div className="border border-gray-300 rounded p-4">
                <div className="fw-bold fs-5">Expiry</div>
                <div className="text-muted">
                  {new Date(driver.licenseExpiry).toISOString().split('T')[0]}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex overflow-auto h-55px">
          <ul className="nav nav-line-tabs nav-line-tabs-2x">
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname.includes('overview') ? 'active' : ''}`}
                to="/crafted/account/overview"
              >
                Overview
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname.includes('settings') ? 'active' : ''}`}
                to="/crafted/account/settings"
              >
                Settings
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export { AccountHeader };
