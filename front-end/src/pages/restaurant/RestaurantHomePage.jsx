import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../Components/Header';
import restaurantImg from '../../Assets/images/restaurant.jpg';


const RestaurantHomePage = () => {
  return (
    <div>
      <main className="container text-center mt-5">
        <h1>Welcome to Rolve Restaurant</h1>
        <p>Experience authentic dishes made with passion and organic ingredients.</p>
        <img src={restaurantImg} alt="Restaurant"/>

      </main>
    </div>
  );
};

export default RestaurantHomePage;
