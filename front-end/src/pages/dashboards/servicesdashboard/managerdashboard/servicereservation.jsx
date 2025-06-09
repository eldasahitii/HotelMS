import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ServiceReservation = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [services, setServices] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [filterService, setFilterService] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get('https://localhost:7117/api/Auth/me', { withCredentials: true });
        fetchReservations();
      } catch {
        toast.error('You must be logged in as a service manager.');
        navigate('/login');
      }
    };
    checkAuth();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await axios.get('https://localhost:7117/api/HotelServiceReservation/GetAllReservations', {
        withCredentials: true,
      });

      const poolAndSpaIDs = [1, 2, 3, 4];
      const eventIDs = [5, 6];

      const data = res.data.map((r) => {
        const serviceName = r.hotelServiceName || 'Unknown';

        let sourceType = 'Unknown';
        if (poolAndSpaIDs.includes(r.hotelServiceDetailID)) {
          sourceType = 'Pool & Spa';
        } else if (eventIDs.includes(r.hotelServiceDetailID)) {
          sourceType = 'Events';
        }

        return {
          reservationID: r.reservationID,
          hotelServiceDetailID: r.hotelServiceDetailID,
          serviceName,
          sourceType,
          reservationDate: new Date(r.reservationDate).toLocaleDateString(),
          timeSlot: r.timeSlot,
          fullName: `${r.firstName} ${r.lastName}`,
          email: r.email,
          phone: r.phone,
          status: r.reservationStatusName || 'Unknown',
        };
      });

      setReservations(data);
      setFilteredReservations(data);
      setServices([...new Set(data.map((r) => r.serviceName))]);
      setStatuses([...new Set(data.map((r) => r.status))]);
    } catch (err) {
      toast.error('Failed to load reservations');
      console.error(err);
    }
  };

  useEffect(() => {
    let filtered = reservations;
    if (filterService) {
      filtered = filtered.filter(r => r.serviceName === filterService);
    }
    if (filterStatus) {
      filtered = filtered.filter(r => r.status === filterStatus);
    }
    setFilteredReservations(filtered);
  }, [filterService, filterStatus, reservations]);

  const handleLogout = async () => {
    try {
      await axios.post('https://localhost:7117/api/Auth/logout', null, { withCredentials: true });
    } catch {
      // silently fail
    }
    navigate('/login');
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#f9fbfd' }}>
      <main className="flex-grow-1 container py-4 d-flex flex-column">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
          <h2 className="fw-bold text-primary mb-0">
            <i className="bi bi-person-video3 me-2"></i> Service Reservations Dashboard
          </h2>
          <button className="btn btn-outline-danger ms-md-3" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </button>
        </div>

        <div className="d-flex flex-column flex-sm-row gap-3 mb-3">
          <select
            className="form-select flex-grow-1"
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
          >
            <option value="">All Services</option>
            {services.map(service => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>

          <select
            className="form-select flex-grow-1"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="card flex-grow-1">
          <div className="card-header bg-primary text-white d-flex align-items-center">
            <i className="bi bi-calendar-check me-2"></i> Reservations List
          </div>
          <div className="card-body p-0 table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Source</th>
                  <th>Service</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Date</th>
                  <th>Time Slot</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.length > 0 ? (
                  filteredReservations.map(r => (
                    <tr key={r.reservationID}>
                      <td>{r.sourceType}</td>
                      <td>{r.serviceName}</td>
                      <td>{r.fullName}</td>
                      <td>{r.email}</td>
                      <td>{r.phone}</td>
                      <td>{r.reservationDate}</td>
                      <td>{r.timeSlot}</td>
                      <td>{r.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-3">No reservations found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServiceReservation;
