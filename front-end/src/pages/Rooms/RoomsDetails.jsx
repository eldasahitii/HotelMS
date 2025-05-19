import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const RoomDetailsPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get(`/api/rooms/${roomId}`);
        setRoom(response.data);
      } catch (error) {
        console.error("Failed to fetch room data", error);
      }
    };
    fetchRoomDetails();
  }, [roomId]);

  const handleBookNow = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      navigate("/reserve", { state: { roomId } });
    }
  };

  if (!room) {
    return (
      <div className="container mt-5">
        <h2>Loading room details...</h2>
      </div>
    );
  }

  return (
    <div className="container mt-5" style={{ minHeight: "70vh" }}>
      <div className="text-center mx-auto" style={{ maxWidth: "700px" }}>
        <h1 className="fw-bold mb-4" style={{ fontSize: "3rem", color: "#222" }}>
          {room.name || room.title}
        </h1>
        <p><strong>Capacity:</strong> {room.capacity}</p>
        <p><strong>Size:</strong> {room.size}</p>
        <p><strong>Price:</strong> ${room.price} per night</p>
        <p>{room.description}</p>

        {/* Optional: Show first image if available */}
        {room.images?.length > 0 && (
          <img
            src={room.images[0]}
            alt={room.name}
            className="img-fluid rounded shadow my-3"
            style={{ maxHeight: "300px", objectFit: "cover" }}
          />
        )}

        <button type="button" className="btn btn-primary btn-lg mt-4 px-5" onClick={handleBookNow}>
          Book Now
        </button>
      </div>
    </div>
  );
};

export default RoomDetailsPage;
