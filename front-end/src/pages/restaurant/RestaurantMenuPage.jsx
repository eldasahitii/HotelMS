import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {useState} from 'react';
// import restaurantImg from '../../Assets/images/restaurant.jpg';
import AvocadoToast from '../../Assets/images/AvocadoToast.png';
import FluffyPancakes from '../../Assets/images/FluffyPancakes.png';
import SalmonBagel from '../../Assets/images/SalmonBagel.png';
import RestaurantHomePage from './RestaurantHomePage.css';
import frenchtoast from '../../Assets/images/frenchtoast.jpg';
import waffles from '../../Assets/images/waffles.jpg';
import eggsBenedict from '../../Assets/images/eggsBenedict.jpg';
import gyoza from '../../Assets/images/gyoza.jpg';
import bruschetta from '../../Assets/images/bruschetta.jpg';
import pasta from '../../Assets/images/pasta.jpg';
import shrimptacos from '../../Assets/images/shrimptacos.jpg';
import chickenrice from '../../Assets/images/chickenrice.jpg';
import ceasersalad from '../../Assets/images/ceasersalad.jpg';
import steak from '../../Assets/images/steak.jpg';
import sushi from '../../Assets/images/sushi.jpg';
import seafoodpasta from '../../Assets/images/seafoodpasta.jpg';
import mushroomrisotto from '../../Assets/images/mushroomrisotto.jpg';
import lobster from '../../Assets/images/lobster.jpg';
import salmon from '../../Assets/images/salmon.jpg';
import tiramisu from '../../Assets/images/tiramisu.jpg';
import applecrumble from '../../Assets/images/applecrumble.jpg';
import chocolate from '../../Assets/images/chocolate.jpg';
// import YoughurtBowl from '../../Asstes/images/YoughurtBowl.png';


const RestaurantMenuPage = () => {

  const [menuItems, setMenuItems] = useState([]);
  const [groupedItems, setGroupedItems] = useState({});

  const fetchMenuItems = async () => {
    try {
      const res = await axios.get('/api/MenuItem/getAllMenuItems', {
        withCredentials: true
      });
      const items = res.data;

      const grouped = items.reduce((acc, item) => {
        const category = item.categoryName;
        if(!acc[category]) acc[category] = [];
        acc[category].push(item);
        return acc;
      }, {});

      setMenuItems(items);
      setGroupedItems(grouped);
    } catch (err) {
      console.error('Failed to load menu items: ', err);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);


    return (
         <div>
            <section className="container-fluid p-0 position-relative">
       
      
          <div className="container text-center px-3">
            <h1 className="display-4 fw-bold">Our Menu</h1>
            <p className="lead mx-auto" style={{ maxWidth: '700px' }}>
               Explore our thoughtfully curated menu, crafted with passion and the finest organic ingredients.
            </p>
          </div>
      </section>

      <section className="py-5 bg-white">
        <div className="container text-center">
          <h2>Breakfast</h2><br /><br />

          <div className="row justify-content-center g-4 menu-card">
            {menuItems
            .filter(item => item.categoryName === "Breakfast")
            .map(item => (
            <div className="col-sm-6 col-md-4 col-1g-3" key={item.menuItemID}>
              <div className="card shadow-sm">
                <img src={item.image_url} className="card-img-top" alt={item.name} style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">{item.name}</h5>
                  <p className="card-text small">{item.description}</p>
                </div>
              </div>
            </div>
            ))}
        
          
          </div>

          </div>
     

      </section>
      <section className="py-5 bg-white">
        <div  className="container text-center">
           <h2>Lunch</h2><br /><br />

          <div className="row justify-content-center g-4 menu-card">
            {menuItems
            .filter(item => item.categoryName === "Lunch")
            .map(item => (
            <div className="col-sm-6 col-md-4 col-1g-3" key={item.menuItemID}>
              <div className="card shadow-sm">
                <img src={item.image_url} className="card-img-top" alt={item.name} style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">{item.name}</h5>
                  <p className="card-text small">{item.description}</p>
                </div>
              </div>
            </div>
            ))}

            

        </div>

        </div>

      </section >

      <section className="py-5 bg-white">
        <div  className="container text-center">
           <h2>Dinner</h2> <br /><br />

        <div className="row justify-content-center g-4 menu-card">
            {menuItems
            .filter(item => item.categoryName === "Dinner")
            .map(item => (
            <div className="col-sm-6 col-md-4 col-1g-3" key={item.menuItemID}>
              <div className="card shadow-sm">
                <img src={item.image_url} className="card-img-top" alt={item.name} style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">{item.name}</h5>
                  <p className="card-text small">{item.description}</p>
                </div>
              </div>
            </div>
            ))}
        

        </div>

        </div>

      </section >

      <section className="py-5 bg-white">
        <div  className="container text-center">
           <h2>Dessert</h2><br /> <br />

         <div className="row justify-content-center g-4 menu-card">
            {menuItems
            .filter(item => item.categoryName === "Dessert")
            .map(item => (
            <div className="col-sm-6 col-md-4 col-1g-3" key={item.menuItemID}>
              <div className="card shadow-sm">
                <img src={item.image_url} className="card-img-top" alt={item.name} style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">{item.name}</h5>
                  <p className="card-text small">{item.description}</p>
                </div>
              </div>
            </div>
            ))}

        </div>

        </div>

      </section >

      

         </div>

    );
};

export default RestaurantMenuPage;