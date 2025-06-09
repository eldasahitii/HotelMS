import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ServiceReceptionistDashboard = () => {
  const [services, setServices] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get('https://localhost:7117/api/HotelServiceDetail/GetAllServiceDetails', {
        withCredentials: true,
      });
      setServices(res.data);
    } catch (error) {
      console.error('Error fetching service details:', error);
      toast.error('Failed to load service details.');
    }
  };

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#f2f6fc' }}>
      <main className="flex-grow-1 p-4">
        <h2 className="fw-bold text-primary mb-4">
          <i className="bi bi-tools me-2"></i> Service Receptionist Dashboard
        </h2>

        {message && (
          <div className={`alert alert-${messageType} alert-dismissible fade show`} role="alert">
            {message}
            <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
          </div>
        )}

        {services.length > 0 ? (
          services.map((service) => (
            <div className="card mb-4 shadow-sm" key={service.Id}>
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <strong>{service.DetailTitle}</strong>
                <span className="badge bg-info">${service.Price}</span>
              </div>
              <div className="card-body">
                {service.DetailImage && (
                  <img
                    src={service.DetailImage}
                    alt={service.DetailTitle}
                    className="mb-3"
                    style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                )}
                <p>{service.DetailDescription}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">No services available.</p>
        )}
      </main>
    </div>
  );
};

export default ServiceReceptionistDashboard;
