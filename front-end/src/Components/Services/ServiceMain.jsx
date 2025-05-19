// src/components/HotelServices/HotelServicesList.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const HotelServicesList = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: 1,
      name: 'Pool & Spa',
      description: 'Relax and unwind in our luxurious pool and spa facilities.',
      imageUrl: 'https://source.unsplash.com/400x250/?spa,pool',
      route: '/services/pool-spa'
    },
    {
      id: 2,
      name: 'Events',
      description: 'Book venues for weddings, conferences, and special occasions.',
      imageUrl: 'https://source.unsplash.com/400x250/?wedding,event',
      route: '/services/events'
    }
  ];

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Hotel Services</h2>
      <div className="row">
        {services.map(service => (
          <div className="col-md-6 mb-4" key={service.id}>
            <div className="card shadow-sm">
              <img src={service.imageUrl} className="card-img-top" alt={service.name} />
              <div className="card-body">
                <h5 className="card-title">{service.name}</h5>
                <p className="card-text">{service.description}</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(service.route)}
                >
                  View {service.name}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelServicesList;
