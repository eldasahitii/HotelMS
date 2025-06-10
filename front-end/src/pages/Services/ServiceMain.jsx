// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import axios from "axios";

// const ServiceMain = () => {
//   const navigate = useNavigate();
//   const [imageUrl, setImageUrl] = useState('');
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [cardImageUrl, setCardImageUrl] = useState('');
//   const [CardTitle, setCardTitle] = useState('');
//   const [CardDescription, setCardDescription] = useState('');
//   const [eventCardImage, setEventCardImage] = useState('');
//   const [eventCardTitle, setEventCardTitle] = useState('');
//   const [eventCardDescription, setEventCardDescription] = useState('');

//   useEffect(() => {
//     fetchHeroImage();
//     fetchHeroTitle();
//     fetchHeroDescription();
//     fetchCardImage();
//     fetchCardTitle();
//     fetchCardDescription();
//     fetchEventCardImage();
//     fetchEventCardTitle();
//     fetchEventCardDescription();
//   }, [])

//   async function fetchHeroImage() {
//     try {
//       const res = await axios.get(
//         "https://localhost:7117/api/HotelService/1/hero-image",
//         { withCredentials: true }
//       );
//       setImageUrl(res.data);
//     } catch (err) {
//       console.error("Failed to get hero image!");
//     }
//   }
//   async function fetchHeroTitle() {
//     try {
//       const res = await axios.get(
//         "https://localhost:7117/api/HotelService/1/hero-title",
//         { withCredentials: true }
//       );
//       setTitle(res.data);
//     } catch (err) {
//       console.error("Failed to get hero title!");
//     }
//   }
//   async function fetchHeroDescription() {
//     try {
//       const res = await axios.get(
//         "https://localhost:7117/api/HotelService/1/hero-description",
//         { withCredentials: true }
//       );
//       setDescription(res.data);
//     } catch (err) {
//       console.error("Failed to get hero description!");
//     }
//   }
//   async function fetchCardImage() {
//     try {
//       const res = await axios.get(
//         "https://localhost:7117/api/HotelServiceCards/1/card-image",
//         { withCredentials: true }
//       );
//       setCardImageUrl(res.data);
//     } catch (err) {
//       console.error("Failed to get card image!");
//     }
//   }
//   async function fetchCardTitle() {
//     try {
//       const res = await axios.get(
//         "https://localhost:7117/api/HotelServiceCards/1/card-title",
//         { withCredentials: true }
//       );
//       setCardTitle(res.data);
//     } catch (err) {
//       console.error("Failed to get card title!");
//     }
//   }
//   async function fetchCardDescription() {
//     try {
//       const res = await axios.get(
//         "https://localhost:7117/api/HotelServiceCards/1/card-description",
//         { withCredentials: true }
//       );
//       setCardDescription(res.data);
//     } catch (err) {
//       console.error("Failed to get card description!");
//     }
//   }
//   async function fetchEventCardImage() {
//     try {
//       const res = await axios.get(
//         "https://localhost:7117/api/HotelServiceCards/2/card-image",
//         { withCredentials: true }
//       );
//       setEventCardImage(res.data);
//     } catch (err) {
//       console.error("Failed to get event card image!");
//     }
//   }
//   async function fetchEventCardTitle() {
//     try {
//       const res = await axios.get(
//         "https://localhost:7117/api/HotelServiceCards/2/card-title",
//         { withCredentials: true }
//       );
//       setEventCardTitle(res.data);
//     } catch (err) {
//       console.error("Failed to get event card title!");
//     }
//   }
//   async function fetchEventCardDescription() {
//     try {
//       const res = await axios.get(
//         "https://localhost:7117/api/HotelServiceCards/2/card-description",
//         { withCredentials: true }
//       );
//       setEventCardDescription(res.data);
//     } catch (err) {
//       console.error("Failed to get event card description!");
//     }
//   }

//   return (
//     <div className="bg-white min-vh-100 d-flex flex-column">
//       {/* Hero Section */}
//       <div
//         className="d-flex align-items-center justify-content-center text-center text-white"
//         style={{
//           backgroundImage: `url('https://localhost:7117/Images/Services/${imageUrl}')`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           height: '80vh',
//           position: 'relative',
//         }}
//       >
//         <div className="bg-dark bg-opacity-50 p-4 w-100">
//           <h1 className="display-4 fw-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
//             {title}
//           </h1>
//           <p className="lead">{description}</p>
//         </div>
//       </div>

//       {/* Pool & Spa Section */}
//       <div className="container py-5 flex-grow-1">
//         <div className="row align-items-center">
//           <div className="col-md-6 mb-4 mb-md-0">
//             <div className="border border-4 border-white shadow-sm rounded bg-light p-2">
//               <img
//                 src={`https://localhost:7117/Images/Services/${cardImageUrl}`}
//                 className="img-fluid rounded"
//                 alt="Pool and Spa"
//               />
//             </div>
//           </div>
//           <div className="col-md-6">
//             <h2 className="text-dark">{CardTitle}</h2>
//             <p className="text-muted">{CardDescription}</p>
//             <button className="btn btn-dark" onClick={() => navigate('/services/pool-spa')}>
//               See More
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Events Section */}
//       <div className="container py-5">
//         <div className="row align-items-center flex-md-row-reverse">
//           <div className="col-md-6 mb-4 mb-md-0">
//             <div className="border border-4 border-white shadow-sm rounded bg-light p-2">
//               <img
//                 src={`https://localhost:7117/Images/Services/${eventCardImage}`}
//                 className="img-fluid rounded"
//                 alt="Events"
//               />
//             </div>
//           </div>
//           <div className="col-md-6">
//             <h2 className="text-dark">{eventCardTitle}</h2>
//             <p className="text-muted">{eventCardDescription}</p>
//             <button className="btn btn-dark" onClick={() => navigate('/services/event-page')}>
//               See More
//             </button>
//           </div>
//         </div>
//       </div>

      
//     </div>
//   );
// };

// export default ServiceMain;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";

const ServiceMain = () => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetchHeroData();
    fetchServiceCards();
  }, []);

  const fetchHeroData = async () => {
    try {
      const [imageRes, titleRes, descRes] = await Promise.all([
        axios.get("https://localhost:7117/api/HotelService/1/hero-image", { withCredentials: true }),
        axios.get("https://localhost:7117/api/HotelService/1/hero-title", { withCredentials: true }),
        axios.get("https://localhost:7117/api/HotelService/1/hero-description", { withCredentials: true }),
      ]);
      setImageUrl(imageRes.data);
      setTitle(titleRes.data);
      setDescription(descRes.data);
    } catch (err) {
      console.error("Failed to fetch hero data!", err);
    }
  };

  const fetchServiceCards = async () => {
    try {
      const res = await axios.get("https://localhost:7117/api/HotelServiceCards/all", { withCredentials: true });
      setCards(res.data);
    } catch (err) {
      console.error("Failed to fetch service cards!", err);
    }
  };

  const resolveImageSrc = (imageString) => {
    if (imageString?.startsWith("data:image")) {
      return imageString;
    } else if (imageString?.includes(".")) {
      return `https://localhost:7117/Images/Services/${imageString}`;
    } else {
      return `data:image/jpeg;base64,${imageString}`;
    }
  };

  return (
    <div className="bg-white min-vh-100 d-flex flex-column">
      {/* Hero Section */}
      <div
        className="d-flex align-items-center justify-content-center text-center text-white"
        style={{
          backgroundImage: `url('https://localhost:7117/Images/Services/${imageUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '80vh',
          position: 'relative',
        }}
      >
        <div className="bg-dark bg-opacity-50 p-4 w-100">
          <h1 className="display-4 fw-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            {title}
          </h1>
          <p className="lead">{description}</p>
        </div>
      </div>

      {/* Dynamic Service Cards Section */}
      <div className="container py-5 flex-grow-1">
        {cards.length === 0 ? (
          <p>No service cards available.</p>
        ) : (
          cards.map((card, index) => (
            <div
              key={card.id}
              className={`row align-items-center ${index % 2 !== 0 ? 'flex-md-row-reverse' : ''} mb-5`}
            >
              <div className="col-md-6 mb-4 mb-md-0">
                <div className="border border-4 border-white shadow-sm rounded bg-light p-2">
                  <img
                    src={resolveImageSrc(card.cardImage)}
                    className="img-fluid rounded"
                    alt={card.cardTitle}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <h2 className="text-dark">{card.cardTitle}</h2>
                <p className="text-muted">{card.cardDescription}</p>
                <button className="btn btn-dark" onClick={() => navigate(card.cardLink || "#")}>
                  See More
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ServiceMain;


