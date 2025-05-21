import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function RoomsDetails() {
  const { roomId } = useParams(); // Get roomId from URL
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token"); // Get JWT from localStorage
  const backendBaseUrl = "https://localhost:7117/";

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (!roomId) {
        setError("Room ID not provided.");
        return;
      }

      if (!token) {
        setError("Unauthorized. Please log in first.");
        return;
      }

      try {
        const response = await axios.get(`${backendBaseUrl}api/RoomType/GetRoomType`, {
          params: { id: roomId },
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const roomData = response.data;

        setRoom({
          id: roomData.roomTypeID,
          name: roomData.name,
          capacity: roomData.capacity,
          size: roomData.size,
          price: roomData.price,
          description: roomData.description,
          images: (roomData.images || []).map((imgObj) =>
            backendBaseUrl + (imgObj.imageUrl.startsWith("/") ? imgObj.imageUrl.slice(1) : imgObj.imageUrl)
          ),
        });
      } catch (err) {
        console.error("Failed to load room details:", err);
        if (err.response) {
          if (err.response.status === 404) {
            setError("Room not found.");
          } else if (err.response.status === 401) {
            setError("Unauthorized. Please log in again.");
          } else {
            setError(`Server error: ${err.response.status} ${err.response.statusText}`);
          }
        } else {
          setError("Network error or server not reachable.");
        }
      }
    };

    fetchRoomDetails();
  }, [roomId, token]);

  const handleBookNow = () => {
    if (!room || !room.id) {
      alert("Room data not loaded yet. Please wait.");
      return;
    }
    // Navigate to reservation page with roomTypeId as query param
    navigate(`/reserve?roomTypeId=${room.id}`);
  };

  if (error) return <div className="alert alert-danger m-3">{error}</div>;
  if (!room) return <div className="m-3">Loading room details...</div>;

  return (
    <div className="container mt-4">
      <h2>{room.name}</h2>
      <p><strong>Capacity:</strong> {room.capacity}</p>
      <p><strong>Size:</strong> {room.size}</p>
      <p><strong>Price:</strong> ${room.price}</p>
      <p><strong>Description:</strong> {room.description}</p>

      {room.images && room.images.length > 0 ? (
        <div className="d-flex flex-wrap gap-3 mt-3">
          {room.images.map((imgPath, index) => (
            <img
              key={index}
              src={imgPath}
              alt={`Room image ${index + 1}`}
              className="img-thumbnail"
              style={{ width: "250px", height: "auto", objectFit: "cover", borderRadius: "8px" }}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted">No images available.</p>
      )}

      <button onClick={handleBookNow} className="btn btn-primary mt-4">
        Book Now
      </button>
    </div>
  );
}
