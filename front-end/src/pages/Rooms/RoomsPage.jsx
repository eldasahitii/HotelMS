import React, { useEffect, useState } from "react";
import RoomCard from "./RoomCard";
import RoomsHeader from "./RoomsHeader";
import axios from "axios";

function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const backendBaseUrl = "https://localhost:7117/";

  axios.get("https://localhost:7117/api/RoomType/getAllRoomTypes")
    .then(res => {
      const mappedRooms = res.data.map(roomType => ({
        id: roomType.id, // confirm your RoomType has id
        title: roomType.name,
        capacity: roomType.capacity,
        size: roomType.size,
        price: roomType.price,
        description: roomType.description,
        images: (roomType.images || []).map(img => backendBaseUrl + img),
      }));
      setRooms(mappedRooms);
      setLoading(false);
    })
    .catch(err => {
      console.error("Failed to fetch room types:", err);
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
              images={room.images || []}
              reverse={idx % 2 === 1}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default RoomsPage;
