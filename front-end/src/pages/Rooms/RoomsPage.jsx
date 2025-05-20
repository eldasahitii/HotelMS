import React, { useEffect, useState } from "react";
import RoomCard from "./RoomCard";
import RoomsHeader from "./RoomsHeader";
import axios from "axios";

function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const backendBaseUrl = "https://localhost:7117/";

    axios.get(`${backendBaseUrl}api/RoomType/GetAllRoomTypes`)
      .then(res => {
        const mappedRooms = res.data.map(roomType => ({
          id: roomType.roomTypeID,  // Important: use roomTypeID here
          title: roomType.name,
          capacity: roomType.capacity,
          size: roomType.size,
          price: roomType.price,
          description: roomType.description,
          images: (roomType.images || []).map(img => backendBaseUrl + img.replace(/^\//, "")), // remove leading slash if any
        }));
        setRooms(mappedRooms);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch room types:", err);
        setError("Failed to load rooms. Please try again later.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container mt-5">
        <h2>Loading rooms...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 text-danger">
        <h3>{error}</h3>
      </div>
    );
  }

  return (
    <>
      <RoomsHeader />
      <div className="extra-margin-top">
        {rooms.map((room, idx) => (
          <div key={room.id} className="mb-5">
            <RoomCard
              id={room.id}
              title={room.title}
              capacity={room.capacity}
              size={room.size}
              price={room.price}
              description={room.description}
              images={room.images}
              reverse={idx % 2 === 1}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default RoomsPage;
