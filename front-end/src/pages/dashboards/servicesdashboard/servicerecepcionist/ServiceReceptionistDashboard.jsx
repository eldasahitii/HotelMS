import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { toast } from 'react-toastify';

const ServiceReceptionistDashboard = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

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
      console.error('Error fetching service data:', error);
      toast.error('Failed to load service data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading services...</div>;
  }

  if (services.length === 0) {
    return <div className="text-center mt-5">No services found.</div>;
  }

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#f2f6fc' }}>
      <main className="flex-grow-1 p-4 container">
        <h2 className="fw-bold text-primary mb-4 text-center text-md-start">
          <i className="bi bi-tools me-2"></i> Service Receptionist Dashboard
        </h2>

        <div className="row g-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="col-12 col-sm-6 col-md-4 col-lg-3"
            >
              <div className="card h-100 shadow-sm d-flex flex-column">
                {service.detailImage && (
                  <img
                    src={`https://localhost:7117/Images/Services/${service.detailImage}`}
                    className="card-img-top"
                    alt={service.detailTitle}
                    style={{ objectFit: 'cover', height: '200px', width: '100%' }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{service.detailTitle}</h5>
                  <p className="card-text flex-grow-1">{service.detailDescription}</p>
                  <p className="card-text fw-bold">
                    Price: {service.price ? service.price : <span style={{ color: 'red' }}>N/A</span>}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ServiceReceptionistDashboard;
