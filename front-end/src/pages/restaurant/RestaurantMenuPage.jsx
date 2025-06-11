import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {useState} from 'react';


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
         <div style={{ fontFamily: "'Crimson Text', serif" }}>
            <section className="container-fluid p-0 position-relative">
       
      
          <div className="container text-center px-3">
            <br />
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