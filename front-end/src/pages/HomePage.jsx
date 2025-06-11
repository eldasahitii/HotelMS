import React from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Main from '../Assets/images/main.jpeg';
import OutdoorImg from '../Assets/images/outdoor.jpg';
import RoomImg from '../Assets/images/room1.jpg';
import Pool from '../Assets/images/pool5.jpg';
import bedroom2 from '../Assets/images/bedroom2.jpg';
import Restaurant from '../Assets/images/restaurant.webp';
import "./HomePage.css";

const HeaderSection = () => (
  <div
    className="d-flex flex-column justify-content-center align-items-center rounded"
    style={{
      backgroundImage: `url(${Main})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "600px",
      padding: "2rem",
      marginBottom: "200px",
    }}
  >
    <Container className="text-center">
      <h1 className="text-black" style={{ fontSize: '30px' }}>Amé Hotel</h1>
      <p className="text-black" style={{ fontSize: '75px' }}>Elegance in every element</p>
    </Container>
  </div>
);

const MiddleSection = () => {
  const navigate = useNavigate();

  const handlePool = () => {
    navigate("/services/pool-spa");
  };


  return (
    <div className="container mt-5">
      <div className="row no-wrap-row align-items-center justify-content-center text-center text-md-start">


        <div
          className="col-sm-3 col-md-3 d-flex justify-content-center justify-content-md-start mb-4 mb-md-0 img1 order-1"
          style={{ marginRight: '-78px' }}
        >
          <img src={OutdoorImg} alt="Outdoor view" className="img-fluid" />
        </div>

        <div
          className="col-sm-5 col-md-5 p-4 order-2"
          style={{ backgroundColor: "#eeb699", color: "#343536" }}
        >
          <h3
            className="mb-5"
            style={{ fontStyle: "italic", fontWeight: 100, fontSize: "45px" }}
          >
            A breathtaking experience
          </h3>
          <p
            className="mb-4 px-3 px-md-0"
            style={{ color: "#5c5c5c", fontSize: "20px", lineHeight: 1.5 }}
          >
            Perched along the serene coastline, Amé Hotel offers a sanctuary of refined luxury where every detail reflects elegance and comfort. Guests can indulge in breathtaking sea views while enjoying world-class amenities designed for relaxation and sophistication.
          </p>
          <p
            id="paragraph2"
            className="mb-5 px-3 px-md-0"
            style={{ color: "#5c5c5c", fontSize: "20px", lineHeight: 1.5 }}
          >
            Founded over a century ago, our hotel has been a cherished retreat for travelers seeking tranquility by the sea. Combining its rich maritime heritage with modern luxury, Ame Hotel continues to provide an exquisite escape where history meets the endless horizon.
          </p>

          <button
            onClick={handlePool}
            className="btn px-4 py-2 rounded"
            style={{
              backgroundColor: '#343536',
              color: 'white',
              border: 'none',
            }}
          >
            Read More
          </button>
        </div>


        <div
          className="col-sm-3 col-md-3 d-flex justify-content-center justify-content-md-end mb-4 mb-md-0 img2 order-3"
          style={{ marginLeft: '-110px' }}
        >
          <img src={RoomImg} alt="Room" className="img-fluid" />
        </div>

      </div>
      
      


      <div className="container my-5 mt-7">
        <div className="row justify-content-around align-items-center flex-wrap">
          <div className="col-12 col-md-6 d-flex flex-column justify-content-center mb-4 mb-md-0" style={{ maxWidth: '500px' }}>
            <h3
              className="mb-4 text-start fw-light fst-italic"
              style={{ fontSize: '40px', lineHeight: 1, marginTop: '30px', marginBottom: '30px', color: '#343536' }}
            >
              Soak up the sun and let the good energy take over
            </h3>
<p className="text-start text-black fs-5 lh-base">
  Dive into pure relaxation at our luxurious pool and spa sanctuary. 
  Immerse yourself in crystal-clear waters, unwind with rejuvenating treatments, 
  and let the soothing ambiance melt your stress away. Experience wellness 
  and tranquility like never before—because you deserve the ultimate escape.
</p>


            <button
              onClick={handlePool}
              className="btn px-4 py-2 rounded"
              style={{
                backgroundColor: '#343536',
                color: 'white',
                border: 'none',
              }}
            >
              Read More
            </button>
          </div>

          <div className="col-12 col-md-5 d-flex justify-content-center">
            <img
              src={Pool}
              alt="pool"
              className="img-fluid mt-3"
              style={{ maxWidth: "550px", maxHeight: "400px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ThirdSection = () => (
  <Container className="mt-5 mb-4">
    <div className="d-flex flex-wrap justify-content-end align-items-stretch" style={{ marginTop: '90px' }}>
      <div className="d-flex" style={{ marginTop: '105px', marginRight: '20px' }}>
        <div style={{
          backgroundColor: '#5c5c5c',
          width: '1px',
          height: '310px',
        }} />
      </div>


      <div className="mt-5" style={{ flexShrink: 0 }}>
        <img
          src={bedroom2}
          alt="Bedroom"
          style={{
            width: '320px',
            height: '350px',
            marginTop: '90px'
          }}
          className="img-fluid"
        />
      </div>

  
      <div
        className="d-flex flex-column align-items-center justify-content-start mt-7"
        style={{
          width: '700px',
          height: '600px',
          backgroundColor: '#eeb699',
        }}
      >
        <h3
          className="mt-5 text-dark fst-italic fw-light"
          style={{ 
            fontSize: '40px', 
            fontWeight: 100,
          }}
        >
          Master Suites
        </h3>

        <p
          className="text-center mx-4"
          style={{ 
            fontSize: '20px', 
            lineHeight: 1.5, 
            marginTop: '40px', 
            marginBottom: '20px', 
            color: 'black',

          }}
        >
          Our rooms are a perfect blend of luxury and comfort, meticulously designed to provide an exceptional experience for every guest. From plush bedding to elegant furnishings, each space is thoughtfully curated to create a warm and inviting atmosphere. Whether you're relaxing after a long day or preparing for an exciting adventure, our rooms offer the perfect sanctuary to unwind and rejuvenate.
        </p>

        <p
          className="text-center mx-4"
          style={{ 
            fontSize: '20px', 
            lineHeight: 1.5, 
            color: 'black',

          }}
        >
          Equipped with modern amenities and spacious layouts, our accommodations cater to your every need. Enjoy breathtaking views, soft lighting, and tranquil decor that enhance the sense of peace and sophistication. Experience the ultimate in hospitality where attention to detail and comfort come together to make your stay truly unforgettable.
        </p>
      </div>
    </div>
  </Container>
);

const FourthSection = () => {
  const navigate = useNavigate();

    const handleRestaurant = () => {
    navigate("/restaurant");
  };

  return (
    <Container
      fluid="md"
      className="d-flex flex-wrap justify-content-around align-items-center my-5 mt-7"
      style={{ marginTop: "90px", marginBottom: "90px" }}
    >
      <div className="row w-100 d-flex flex-wrap justify-content-around align-items-center">
        <div
          className="col-12 col-md-6 d-flex justify-content-center"
          style={{ marginTop: "30px" }}
        >
          <img
            src={Restaurant}
            alt="Restaurant"
            style={{ width: "550px", height: "400px", objectFit: "cover" }}
            className="img-fluid"
          />
        </div>


        <div
          className="col-12 col-md-5 d-flex flex-column justify-content-center"
          style={{ maxWidth: "500px" }}
        >
          <h3
            className="text-start"
            style={{
              marginBottom:"20px",
              color: "#343536",
              fontSize: "60px",
              fontStyle: "italic",
              lineHeight: 1,
   
            }}
          >
            Amé Restaurant
          </h3>
<p
  className="text-start"
  style={{ 
    color: "black", 
    fontSize: "20px", 
    lineHeight: 1.3,
  }}
>
  At Amé Restaurant, indulge in a luxurious dining experience where exquisite flavors meet elegant ambiance. Our culinary team crafts each dish with passion and precision, offering a menu that celebrates the finest ingredients and Mediterranean inspiration. Savor every moment in a setting designed for comfort and sophistication.
</p>

          <button
              onClick={handleRestaurant}
              className="btn px-4 py-2 rounded"
              style={{
                backgroundColor: '#343536',
                color: 'white',
                border: 'none',
              }}
            >
              Read More
            </button>
        </div>
      </div>
    </Container>
  );
};


const HomePageHeader = () => (
   <div className="home-container" style={{ fontFamily: "'Crimson Text', serif" }}>
    <HeaderSection />
    <MiddleSection />
    <ThirdSection />
    <FourthSection />
  </div>
);

export default HomePageHeader;
