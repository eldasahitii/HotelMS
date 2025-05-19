import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../Components/Header';
import restaurantImg from '../../Assets/images/restaurant.jpg';
import './RestaurantHomePage.css';
import restaurantTerrace from '../../Assets/images/restaurantTerrace.jpg';
import restaurantInterior from '../../Assets/images/restaurantInterior.jpg';
import pasta from '../../Assets/images/pasta.jpg';
import steak from '../../Assets/images/steak.jpg';
import risotto from '../../Assets/images/risotto.jpg';
import axios from 'axios';
import {useState} from 'react';


const RestaurantHomePage = () => {

  const [formData, setFormData] = useState({
  guestID: '',
  dateTime: '',
  tableID: ''
});

const handleChange = (e) => {
  setFormData({...formData, [e.target.name]: e.target.value});
};

const handleSubmit = async(e) => {
  e.preventDeafult();
  try {
    await axios.post('/api/Host/createReservation', {
      guestID: parseInt(formData.guestID),
      dateTime: formData.dateTime,
      restaurantTableID: parseInt(formData.tableID)
    });
    alert('Reservation submitted!');
    setFormData({guestID: '', dateTime: '', tableID: ''});
  } catch (error) {
    alert("Error creating reservation");
    console.error(error);
  }
};
  return (
   <div>
     <section className="container-fluid p-0 position-relative">
       
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundImage: `url(${restaurantImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(4px) brightness(0.6)',
            zIndex: 1,
          }}
        />

  
        <div
          className="d-flex justify-content-center align-items-center text-center text-white"
          style={{
            height: '100vh',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div className="container px-3">
            <h1 className="display-4 fw-bold">Welcome to Rolve Restaurant</h1>
            <p className="lead mx-auto" style={{ maxWidth: '700px' }}>
              Discover the essence of fine dining at Rolve Restaurant, where every dish is crafted with
              organic ingredients, timeless flavors, and a passion for culinary excellence.
            </p>
          </div>
        </div>
      </section>

    <section className="about-section py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <img
                src={restaurantTerrace}
                alt="Inside Rolve Restaurant"
                className="img-fluid rounded shadow w-50"
              />
              <img src={restaurantInterior} alt="restaurant interior"  className="img-fluid rounded shadow w-50" />
            </div>
            <div className="col-md-6 text-center text-md-start">
              <h2 className="mb-4">About Rolve Restaurant</h2>
              <p className="lead">
                At Rolve Restaurant, we believe food should not only taste amazing but also be nourishing.
                Our chefs blend tradition with creativity, using locally sourced organic ingredients to bring
                every dish to life. From our vibrant kitchen to your table, we serve with passion, purpose,
                and a deep respect for nature.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-white">
        <div className="container text-center">
          <h2 className="mb-4 fw-bold">Chef's Selections</h2>
          <p className="mb-5 lead">A taste of our favorites, hand-picked by our head chef.</p>

          <div className="row justify-content-center g-4 menu-card">
            <div className="col-sm-6 col-md-4 col-1g-3">
              <div className="card shadow-sm">
                <img src={pasta} className="card-img-top" alt="Truffle pasta" style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Truffle Tagliatelle</h5>
                  <p className="card-text small">Fresh pasta with black truffle cream and parmesan.</p>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-md-4 col-1g-3 menu-card">
              <div className="card shadow-sm">
                <img src={steak}  className="card-img-top" alt="steak" style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Herb-Crusted Filet</h5>
                  <p className="card-text small">Tender beef filet served with seasonal vegetables.</p>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-md-4 col-1g-3  menu-card">
              <div className="card shadow-sm">
                <img src={risotto} className="card-img-top" alt="risotto" style={{ height: '200px', objectFit: 'cover' }} />
                <div className="card-body">
                  <h5 className="card-title fw-bold">Wild Mushroom Risotto</h5>
                  <p className="card-text small">Creamy risotto with porcini mushrooms and thyme.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <a href="" className="btn btn-dark btn-1g"> View Full Menu</a>
          </div>
        </div>

      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4">Book a Table</h2>

          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-6">
              <input 
              type="number"
              className="form-control"
              placeholder='Guest ID'
              name="guestID"
              value={FormData.guestID}
              onChange={handleChange}
              required
              />
            </div>
            <div className="col-md-6">
              <input
              type="datetime-local"
              className="form-control"
              name="dateTime"
              value={formData.dateTime}
              onChange={handleChange}
              required
              />
           </div>
           <div className="col-md-6">
             <input
             type="number"
             className="form-control"
             placeholder="Table ID"
             name="tableID"
             value={formData.tableID}
             onChange={handleChange}
             required
             />
           </div>

            <div className="col-12 text-center">
              <button type="submit" className="btn btn-dark px-5">Submit Reservation</button>
           </div>


          </form>
        </div>
      </section>


   </div>
  );
};

export default RestaurantHomePage;
