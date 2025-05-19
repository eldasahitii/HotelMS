// RoomDetailsPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import room1a from "../../Assets/images/dhoma3bath.webp";
import room1b from "../../Assets/images/junior.jpg";
import room1c from "../../Assets/images/room3-bathroom2.jpg";
import room2a from "../../Assets/images/room2-bathroom.jpg";
import room2b from "../../Assets/images/dhoma22.jpeg";
import room2c from "../../Assets/images/room2-bathrom2.jpg";
import room3a from "../../Assets/images/dhoma1details.jpeg";
import room3b from "../../Assets/images/dhoma1.jpeg";
import room3c from "../../Assets/images/bathroom2-room1.jpg";
import room4a from "../../Assets/images/twin-bathrom.jpg";
import room4b from "../../Assets/images/junior3.jpg";
import room4c from "../../Assets/images/twin-bathroom2.jpg";
import room5a from "../../Assets/images/supertwin-bathroom2.jpg";
import room5b from "../../Assets/images/supertwin.jpg";
import room5c from "../../Assets/images/tile.jpg";

const roomData = {
  "1": {
    title: "Junior Room",
    capacity: "1-2 PERSONS",
    size: "22M2",
    price: 120,
    description: (
      <>
        The <strong>Junior Room</strong> is a cozy and stylish space designed for comfort and relaxation.
        <br /><br />
        <strong>Amenities include:</strong>
        <ul>
          <li>Free high-speed Wi-Fi</li>
          <li>Flat-screen TV with international channels</li>
          <li>Complimentary breakfast every morning</li>
          <li>Fully stocked mini bar</li>
          <li>Air conditioning and heating</li>
        </ul>
      </>
    ),
    images: [room1a, room1b, room1c],
  },
  "2": {
    title: "Deluxe Room",
    capacity: "1-2 PERSONS",
    size: "22M2",
    price: 140,
    description: (
      <>
        The <strong>Deluxe Room</strong> offers an elegant and luxurious atmosphere.
        <br /><br />
        <strong>Amenities include:</strong>
        <ul>
          <li>Plush king-size bed with luxury linens</li>
          <li>High-speed Wi-Fi connection</li>
          <li>Premium coffee machine and tea set</li>
          <li>24-hour room service</li>
          <li>Spacious en-suite bathroom with deluxe toiletries</li>
        </ul>
      </>
    ),
    images: [room2a, room2b, room2c],
  },
  "3": {
    title: "Double Room",
    capacity: "1-2 PERSONS",
    size: "22M2",
    price: 110,
    description: (
      <>
        The <strong>Double Room</strong> combines simplicity with sophistication.
        <br /><br />
        <strong>Amenities include:</strong>
        <ul>
          <li>Comfortable double bed with premium mattress</li>
          <li>Smart TV with streaming services</li>
          <li>Dedicated workspace and reading lamp</li>
          <li>Built-in wardrobe and secure safe</li>
          <li>Complimentary Wi-Fi and air conditioning</li>
        </ul>
      </>
    ),
    images: [room3a, room3b, room3c],
  },
  "4": {
    title: "Twin Room",
    capacity: "1-2 PERSONS",
    size: "30M2",
    price: 130,
    description: (
      <>
        The <strong>Twin Room</strong> is designed with convenience in mind for friends or colleagues.
        <br /><br />
        <strong>Amenities include:</strong>
        <ul>
          <li>Two plush single beds</li>
          <li>Private en-suite bathroom with shower</li>
          <li>Mini fridge and bottled water</li>
          <li>High-speed Wi-Fi access</li>
          <li>Daily housekeeping and toiletries</li>
        </ul>
      </>
    ),
    images: [room4a, room4b, room4c],
  },
  "5": {
    title: "Superior Twin Room",
    capacity: "2-3 PERSONS",
    size: "28M2",
    price: 160,
    description: (
      <>
        Spacious and beautifully appointed, the <strong>Superior Twin Room</strong> is perfect for families.
        <br /><br />
        <strong>Amenities include:</strong>
        <ul>
          <li>Two twin beds plus a pull-out sofa bed</li>
          <li>Room service and minibar</li>
          <li>Large flat-screen TV with entertainment options</li>
          <li>Complimentary breakfast and beverages</li>
          <li>Temperature control, fast Wi-Fi, and workspace</li>
        </ul>
      </>
    ),
    images: [room5a, room5b, room5c],
  },
};

const RoomDetailsPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const room = roomData[roomId];

  if (!room)
    return (
      <div className="container mt-5">
        <h2>Room not found</h2>
      </div>
    );

const handleBookNow = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
  } else {
    navigate("/reserve", { state: { roomId } });
  }
};


  return (
    <div className="container position-relative mt-5" style={{ minHeight: "70vh" }}>
      <img
        src={room.images[0]}
        alt={`${room.title} left corner`}
        className="position-absolute d-none d-md-block rounded shadow"
        style={{
          top: 0,
          left: 0,
          width: "18vw",
          height: "18vw",
          objectFit: "cover",
          borderRadius: "0 0 .5rem 0",
          boxShadow: "0 0 10px rgba(0,0,0,0.3)",
          zIndex: 1,
        }}
      />
      <img
        src={room.images[2]}
        alt={`${room.title} right corner`}
        className="position-absolute d-none d-md-block rounded shadow"
        style={{
          top: 0,
          right: 0,
          width: "18vw",
          height: "18vw",
          objectFit: "cover",
          borderRadius: "0 0 0 .5rem",
          boxShadow: "0 0 10px rgba(0,0,0,0.3)",
          zIndex: 1,
        }}
      />

      <div className="d-flex justify-content-center mb-4" style={{ position: "relative", zIndex: 2 }}>
        <img
          src={room.images[1]}
          alt={`${room.title} center`}
          className="rounded shadow"
          style={{ width: "40vw", maxWidth: "400px", height: "40vw", maxHeight: "400px", objectFit: "cover" }}
        />
      </div>

      <div className="text-center mx-auto" style={{ maxWidth: "700px", position: "relative", zIndex: 3 }}>
        <h1 className="fw-bold mb-4" style={{ fontSize: "3rem", color: "#222" }}>
          {room.title}
        </h1>
        <p><strong>Capacity:</strong> {room.capacity}</p>
        <p><strong>Size:</strong> {room.size}</p>
        <p><strong>Price:</strong> ${room.price} per night</p>
        <div>{room.description}</div>

        <button type="button" className="btn btn-primary btn-lg mt-4 px-5" onClick={handleBookNow}>
          Book Now
        </button>
      </div>
    </div>
  );
};

export default RoomDetailsPage;
