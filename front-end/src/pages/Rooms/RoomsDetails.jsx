import React from "react";
import { useParams } from "react-router-dom";
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
    description: "Our Junior Room is perfect for solo travelers or couples. Enjoy amenities like free Wi-Fi, a flat-screen TV, complimentary breakfast, a mini bar, and air conditioning—all in a cozy and elegant setting.",
    images: [room1a, room1b,room1c]
  },
  "2": {
    title: "Deluxe Room",
    capacity: "1-2 PERSONS",
    size: "22M2",
    price: 140,
    description: "The Deluxe Room offers an elevated stay with a plush king-size bed, high-speed Wi-Fi, a coffee machine, 24-hour room service, and a luxurious en-suite bathroom with premium toiletries.",
    images: [room2a, room2b,room2c]
  },
  "3": {
    title: "Double Room",
    capacity: "1-2 PERSONS",
    size: "22M2",
    price: 110,
    description: "This stylish Double Room includes a comfortable double bed, smart TV, workspace, wardrobe, and essentials like free Wi-Fi, air conditioning, and a safe for your valuables.",
    images: [room3a, room3b,room3c]
  },
  "4": {
    title: "Twin Room",
    capacity: "1-2 PERSONS",
    size: "30M2",
    price: 130,
    description: "Our Twin Room is ideal for friends or colleagues traveling together. Features two single beds, private bathroom, complimentary toiletries, Wi-Fi, mini fridge, and daily housekeeping.",
    images: [room4a, room4b,room4c]
  },
  "5": {
    title: "Superior Twin Room",
    capacity: "2-3 PERSONS",
    size: "28M2",
    price: 160,
    description: "The Superior Twin Room accommodates up to three guests with two twin beds and a pull-out sofa. Includes amenities such as a minibar, room service, a flat-screen TV, and complimentary breakfast.",
    images: [room5a, room5b,room5c]
  }
};

const RoomDetailsPage = () => {
  const { roomId } = useParams();
  const room = roomData[roomId];

  if (!room) return <div className="container mt-5"><h2>Room not found</h2></div>;

  return (
    <div className="container mt-5">
      <h2>{room.title}</h2>
      <p><strong>Capacity:</strong> {room.capacity}</p>
      <p><strong>Size:</strong> {room.size}</p>
      <p><strong>Price:</strong> ${room.price} per night</p>
      <p>{room.description}</p>
      
      <div className="row">
        {room.images.map((img, index) => (
          <div className="col-md-6 mb-3" key={index}>
            <img src={img} alt={`${room.title} ${index + 1}`} className="img-fluid rounded shadow" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomDetailsPage;
