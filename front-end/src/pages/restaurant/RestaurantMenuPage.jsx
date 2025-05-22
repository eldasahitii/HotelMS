import React from 'react';
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


    return (
         <div>
            <section className="container-fluid p-0 position-relative">
       
        {/* <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            // backgroundImage: `url(${restaurantImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(4px) brightness(0.6)',
            zIndex: 1,
          }}
        /> */}

  
        {/* <div
          className="d-flex justify-content-center align-items-center text-center text-white"
          style={{
            height: '100vh',
            position: 'relative',
            zIndex: 2,
          }}
        > */}
          <div className="container text-center px-3">
            <h1 className="display-4 fw-bold">Our Menu</h1>
            <p className="lead mx-auto" style={{ maxWidth: '700px' }}>
               Explore our thoughtfully curated menu, crafted with passion and the finest organic ingredients.
            </p>
          </div>
        {/* </div> */}
      </section>

      <section className="py-5 bg-white">
        <div className="container text-center">
          <h2>Breakfast</h2><br /><br />

          <div className="row justify-content-center g-4 menu-card">
            <div className="col-sm-6 col-md-4 col-1g-3">
              <div className="card shadow-sm">
                <img src={AvocadoToast} className="card-img-top" alt="Avocado Toast" style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Avocado Toast</h5>
                  <p className="card-text small">Creamy smashed avocado on toasted artisan bread, topped with perfectly cooked eggs and a touch of lemon. Simple, hearty, and delicious.</p>
                </div>
              </div>
            </div>
          

            <div className="col-sm-6 col-md-4 col-1g-3">
              <div className="card shadow-sm">
                <img src={FluffyPancakes} className="card-img-top" alt="Fluffy Pancakes" style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Fluffy Pancakes</h5>
                  <p className="card-text small">Stacked golden pancakes, light and airy, served with maple syrup and a dusting of powdered sugar. A comforting classic for any time of day.</p>
                </div>
              </div>
            </div>
          

            <div className="col-sm-6 col-md-4 col-1g-3">
              <div className="card shadow-sm">
                <img src={SalmonBagel} className="card-img-top" alt="Salmon Bagel" style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Salmon Bagel</h5>
                  <p className="card-text small">Toasted bagel layered with cream cheese, smoked salmon, fresh dill, and a touch of lemon. A savory and elegant twist on a brunch favorite.</p>
                </div>
              </div>
            </div>

              <div className="col-sm-6 col-md-4 col-1g-3">
              <div className="card shadow-sm">
                <img src={eggsBenedict} className="card-img-top" alt="eggsBenedict" style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Eggs Benedict</h5>
                  <p className="card-text small">Poached eggs served on toasted English muffins with savory ham and velvety hollandaise sauce. A timeless brunch indulgence.</p>
                </div>
              </div>
            </div>

              <div className="col-sm-6 col-md-4 col-1g-3">
              <div className="card shadow-sm">
                <img src={frenchtoast} className="card-img-top" alt="French toast" style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">French Toast</h5>
                  <p className="card-text small">Golden brioche slices soaked in a herbed egg mixture, pan-seared and served with crispy bacon and a drizzle of spiced aioli. A rich and satisfying twist on a brunch favorite.</p>
                </div>
              </div>
            </div>

              <div className="col-sm-6 col-md-4 col-1g-3">
              <div className="card shadow-sm">
                <img src={waffles} className="card-img-top" alt="waffles" style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Waffles</h5>
                  <p className="card-text small">Crispy on the outside, fluffy on the inside — our golden waffles are served with your choice of maple syrup, fresh fruit, or whipped cream. A delightful balance of texture and taste.</p>
                </div>
              </div>
            </div>
          
          </div>

          </div>
     

      </section>
      <section className="py-5 bg-white">
        <div  className="container text-center">
           <h2>Lunch</h2><br /><br />

          <div className="row justify-content-center g-4 menu-card">
            <div className="col-sm-6 col-md-4 col-1g-3">
              <div className="card shadow-sm">
                <img src={bruschetta} className="card-img-top" alt="Bruschetta" style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Bruschetta</h5>
                  <p className="card-text small">Grilled artisan bread topped with fresh diced tomatoes, garlic, basil, and a drizzle of extra virgin olive oil. A vibrant and flavorful Italian classic</p>
                </div>
              </div>
            </div>
          

            <div className="col-sm-6 col-md-4 col-1g-3">
              <div className="card shadow-sm">
                <img src={chickenrice} className="card-img-top" alt="Chicken rice" style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Teriyaki Chicken Rice</h5>
                  <p className="card-text small">Tender grilled chicken glazed with a rich teriyaki sauce, served over steamed rice with sautéed vegetables. A savory and satisfying fusion favorite.s</p>
                </div>
              </div>
            </div>
          

            <div className="col-sm-6 col-md-4 col-1g-3">
              <div className="card shadow-sm">
                <img src={ceasersalad} className="card-img-top" alt="Ceaser Salad" style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Ceaser Salad</h5>
                  <p className="card-text small">Crisp romaine lettuce tossed with creamy Caesar dressing, crunchy croutons, and shaved Parmesan cheese. A timeless classic, simple and full of flavor.</p>
                </div>
              </div>
            </div>

                 <div className="col-sm-6 col-md-4 col-1g-3">
              <div className="card shadow-sm">
                <img src={gyoza} className="card-img-top" alt="Gyoza" style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Shrimp Gyoza</h5>
                  <p className="card-text small">Delicate dumplings filled with seasoned shrimp, pan-seared to a golden crisp and served with a savory dipping sauce. A perfect bite of umami and crunch.</p>
                </div>
              </div>
            </div>

                  <div className="col-sm-6 col-md-4 col-1g-3">
              <div className="card shadow-sm">
                <img src={shrimptacos} className="card-img-top" alt="Shrimp Tacos" style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Shrimp Tacos</h5>
                  <p className="card-text small">Soft tortillas filled with succulent shrimp, fresh slaw, and a zesty lime crema. A vibrant and flavorful coastal favorite.</p>
                </div>
              </div>
            </div>

                  <div className="col-sm-6 col-md-4 col-1g-3">
              <div className="card shadow-sm">
                <img src={pasta} className="card-img-top" alt="Pasta" style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Pasta</h5>
                  <p className="card-text small">Al dente pasta tossed in your choice of classic sauces — from rich tomato basil to creamy Alfredo. Comforting, flavorful, and made to satisfy every craving.</p>
                </div>
              </div>
            </div>

            

        </div>

        </div>

      </section >

      <section className="py-5 bg-white">
        <div  className="container text-center">
           <h2>Dinner</h2> <br /><br />

          <div className="row justify-content-center g-4 menu-card">
            <div className="col-sm-6 col-md-4 col-1g-3">
              <div className="card shadow-sm">
                <img src={salmon} className="card-img-top" alt="Salmon" style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Salmon</h5>
                  <p className="card-text small">Fresh, tender salmon fillet grilled to perfection, served with seasonal vegetables and a lemon herb drizzle. Light, flavorful, and elegantly simple.</p>
                </div>
              </div>
            </div>
          

            <div className="col-sm-6 col-md-4 col-1g-3">
              <div className="card shadow-sm">
                <img src={mushroomrisotto} className="card-img-top" alt="Mushroom Risotto" style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Chciken Mushroom Risotto</h5>
                  <p className="card-text small">Creamy Arborio rice slow-cooked with tender chicken, sautéed mushrooms, and Parmesan cheese. Rich, comforting, and full of earthy flavor.</p>
                </div>
              </div>
            </div>
          

            <div className="col-sm-6 col-md-4 col-1g-3">
              <div className="card shadow-sm">
                <img src={steak} className="card-img-top" alt="Steak" style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Steak</h5>
                  <p className="card-text small">Juicy, perfectly grilled steak seasoned with sea salt and cracked pepper, served with your choice of sides and a house-made herb butter. Bold, hearty, and satisfying.</p>
                </div>
              </div>
            </div>

               <div className="col-sm-6 col-md-4 col-1g-3">
              <div className="card shadow-sm">
                <img src={seafoodpasta} className="card-img-top" alt="Seafood pasta" style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">SeaFood Pasta</h5>
                  <p className="card-text small">A medley of fresh shrimp, mussels, and calamari tossed with al dente pasta in a light garlic and white wine sauce. Elegant, flavorful, and straight from the sea.</p>
                </div>
              </div>
            </div>

               <div className="col-sm-6 col-md-4 col-1g-3">
              <div className="card shadow-sm">
                <img src={lobster} className="card-img-top" alt="Lobster" style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Lobster</h5>
                  <p className="card-text small">Succulent lobster tail, butter-poached and lightly seasoned, served with lemon and herb butter sauce. A luxurious and unforgettable seafood experience.</p>
                </div>
              </div>
            </div>

               <div className="col-sm-6 col-md-4 col-1g-3">
              <div className="card shadow-sm">
                <img src={sushi} className="card-img-top" alt="Sushi" style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Sushi</h5>
                  <p className="card-text small">An assortment of handcrafted sushi rolls and nigiri, featuring fresh fish, seasoned rice, and vibrant ingredients. A perfect balance of flavor, texture, and artistry.</p>
                </div>
              </div>
            </div>

        </div>

        </div>

      </section >

      <section className="py-5 bg-white">
        <div  className="container text-center">
           <h2>Dessert</h2><br /> <br />

          <div className="row justify-content-center g-4 menu-card">
            <div className="col-sm-6 col-md-4 col-1g-3">
              <div className="card shadow-sm">
                <img src={tiramisu} className="card-img-top" alt="Tiramisu" style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Tiramisu</h5>
                  <p className="card-text small">A classic Italian dessert made with layers of espresso-soaked ladyfingers, creamy mascarpone, and a dusting of cocoa powder. Light, rich, and irresistibly indulgent.</p>
                </div>
              </div>
            </div>
          

            <div className="col-sm-6 col-md-4 col-1g-3">
              <div className="card shadow-sm">
                <img src={applecrumble} className="card-img-top" alt="Apple Crumble Pie" style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Apple Crumble Pie</h5>
                  <p className="card-text small">Warm spiced apples baked under a golden, buttery crumble topping, served with a hint of cinnamon. Comforting, nostalgic, and perfect with a scoop of vanilla ice cream</p>
                </div>
              </div>
            </div>
          

            <div className="col-sm-6 col-md-4 col-1g-3">
              <div className="card shadow-sm">
                <img src={chocolate} className="card-img-top" alt="Chocolate Cake" style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Chocolate Cake</h5>
                  <p className="card-text small">Rich and moist layers of decadent chocolate sponge, filled and frosted with smooth chocolate ganache. A timeless treat for true chocolate lovers..</p>
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