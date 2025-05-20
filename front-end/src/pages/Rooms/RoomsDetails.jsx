import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function RoomsDetails() {
  const { roomId } = useParams(); // Get roomId from URL
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token"); // Get JWT from localStorage
  const backendBaseUrl = "https://localhost:7117/";

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

        setRoom(response.data);
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

  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!room) return <div>Loading room details...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{room.name}</h2>
      <p><strong>Capacity:</strong> {room.capacity}</p>
      <p><strong>Size:</strong> {room.size}</p>
      <p><strong>Price:</strong> ${room.price}</p>
      <p><strong>Description:</strong> {room.description}</p>

      {room.images && room.images.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "15px" }}>
          {room.images.map((imgPath, index) => (
            <img
              key={index}
              src={`${backendBaseUrl}images/roomtypes/${imgPath.replace(/^.*[\\/]/, "")}`}
              alt={`Room image ${index + 1}`}
              style={{ width: "250px", height: "auto", borderRadius: "8px", objectFit: "cover" }}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted">No images available.</p>
      )}
    </div>
  );
}
