import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {useState} from 'react';
import restaurantImg from '../../Assets/images/restaurant.jpg';
import AvocadoToast from '../../Assets/images/AvocadoToast.png';
import FluffyPancakes from '../../Assets/images/FluffyPancakes.png';
import SalmonBagel from '../../Assets/images/SalmonBagel.png';
import RestaurantHomePage from './RestaurantHomePage.css';
// import YoughurtBowl from '../../Asstes/images/YoughurtBowl.png';


const RestaurantMenuPage = () => {


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
            <h1 className="display-4 fw-bold">Our Menu</h1>
            <p className="lead mx-auto" style={{ maxWidth: '700px' }}>
               Explore our thoughtfully curated menu, crafted with passion and the finest organic ingredients.
            </p>
          </div>
        </div>
      </section>

      <section className="py-5 bg-white">
        <div className="container text-center">
          <h2>Breakfast</h2>

          <div className="row justify-content-center g-4 menu-card">
            <div className="col-sm-6 col-md-4 col-1g-3">
              <div className="card shadow-sm">
                <img src={AvocadoToast} className="card-img-top" alt="Avocado Toast" style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Avocado Toast</h5>
                  <p className="card-text small">Fresh Avocado with eggs of your liking</p>
                </div>
              </div>
            </div>
          

            <div className="col-sm-6 col-md-4 col-1g-3">
              <div className="card shadow-sm">
                <img src={FluffyPancakes} className="card-img-top" alt="Fluffy Pancakes" style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Fluffy Pancakes</h5>
                  <p className="card-text small">Fluffy korean pancakes with sweet toppings</p>
                </div>
              </div>
            </div>
          

            <div className="col-sm-6 col-md-4 col-1g-3">
              <div className="card shadow-sm">
                <img src={SalmonBagel} className="card-img-top" alt="Salmon Bagel" style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Salmon Bagel</h5>
                  <p className="card-text small">Delicous salmon bagel with cream cheese vegetables and fresh salmon.</p>
                </div>
              </div>
            </div>
          
          </div>

          </div>
     

      </section>
      <section className="py-5 bg-white">
        <div  className="container text-center">
           <h2>Lunch</h2>

          <div className="row justify-content-center g-4 menu-card">
            <div className="col-sm-6 col-md-4 col-1g-3">
              <div className="card shadow-sm">
                <img src={AvocadoToast} className="card-img-top" alt="Avocado Toast" style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Avocado Toast</h5>
                  <p className="card-text small">Fresh Avocado with eggs of your liking</p>
                </div>
              </div>
            </div>
          

            <div className="col-sm-6 col-md-4 col-1g-3">
              <div className="card shadow-sm">
                <img src={FluffyPancakes} className="card-img-top" alt="Fluffy Pancakes" style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Fluffy Pancakes</h5>
                  <p className="card-text small">Fluffy korean pancakes with sweet toppings</p>
                </div>
              </div>
            </div>
          

            <div className="col-sm-6 col-md-4 col-1g-3">
              <div className="card shadow-sm">
                <img src={SalmonBagel} className="card-img-top" alt="Salmon Bagel" style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Salmon Bagel</h5>
                  <p className="card-text small">Delicous salmon bagel with cream cheese vegetables and fresh salmon.</p>
                </div>
              </div>
            </div>

        </div>

        </div>

      </section >

      <section className="py-5 bg-white">
        <div  className="container text-center">
           <h2>Dinner</h2>

          <div className="row justify-content-center g-4 menu-card">
            <div className="col-sm-6 col-md-4 col-1g-3">
              <div className="card shadow-sm">
                <img src={AvocadoToast} className="card-img-top" alt="Avocado Toast" style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Avocado Toast</h5>
                  <p className="card-text small">Fresh Avocado with eggs of your liking</p>
                </div>
              </div>
            </div>
          

            <div className="col-sm-6 col-md-4 col-1g-3">
              <div className="card shadow-sm">
                <img src={FluffyPancakes} className="card-img-top" alt="Fluffy Pancakes" style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Fluffy Pancakes</h5>
                  <p className="card-text small">Fluffy korean pancakes with sweet toppings</p>
                </div>
              </div>
            </div>
          

            <div className="col-sm-6 col-md-4 col-1g-3">
              <div className="card shadow-sm">
                <img src={SalmonBagel} className="card-img-top" alt="Salmon Bagel" style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Salmon Bagel</h5>
                  <p className="card-text small">Delicous salmon bagel with cream cheese vegetables and fresh salmon.</p>
                </div>
              </div>
            </div>

        </div>

        </div>

      </section >

      <section className="py-5 bg-white">
        <div  className="container text-center">
           <h2>Dessert</h2>

          <div className="row justify-content-center g-4 menu-card">
            <div className="col-sm-6 col-md-4 col-1g-3">
              <div className="card shadow-sm">
                <img src={AvocadoToast} className="card-img-top" alt="Avocado Toast" style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Avocado Toast</h5>
                  <p className="card-text small">Fresh Avocado with eggs of your liking</p>
                </div>
              </div>
            </div>
          

            <div className="col-sm-6 col-md-4 col-1g-3">
              <div className="card shadow-sm">
                <img src={FluffyPancakes} className="card-img-top" alt="Fluffy Pancakes" style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Fluffy Pancakes</h5>
                  <p className="card-text small">Fluffy korean pancakes with sweet toppings</p>
                </div>
              </div>
            </div>
          

            <div className="col-sm-6 col-md-4 col-1g-3">
              <div className="card shadow-sm">
                <img src={SalmonBagel} className="card-img-top" alt="Salmon Bagel" style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Salmon Bagel</h5>
                  <p className="card-text small">Delicous salmon bagel with cream cheese vegetables and fresh salmon.</p>
                </div>
              </div>
            </div>

        </div>

        </div>

      </section >

      

         </div>

    );
};

export default RestaurantMenuPage;