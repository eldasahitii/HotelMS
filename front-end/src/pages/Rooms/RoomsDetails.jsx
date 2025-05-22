import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function RoomsDetails() {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);
  const backendBaseUrl = "https://localhost:7117/";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (!roomId) {
        setError("Room ID not provided.");
        return;
      }
      try {
        const res = await axios.get(`${backendBaseUrl}api/RoomType/GetRoomType`, {
          params: { id: roomId },
          withCredentials: true,
        });
        const data = res.data;
        setRoom({
          id: data.roomTypeID,
          name: data.name,
          capacity: data.capacity,
          size: data.size,
          price: data.price,
          description: data.description,
          images: (data.images || []).map(img =>
            backendBaseUrl + (img.imageUrl.startsWith("/") ? img.imageUrl.slice(1) : img.imageUrl)
          ),
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load room details.");
      }
    };
    fetchRoomDetails();
  }, [roomId]);

  const handleBookNow = async () => {
    if (!room?.id) {
      alert("Room data not loaded yet.");
      return;
    }

    try {
      // Check if user is logged in before navigating
      const authCheck = await axios.get(`${backendBaseUrl}api/Auth/me`, {
        withCredentials: true,
      });
      if (authCheck.data.role) {
        // User logged in - navigate to reservation page
        navigate(`/reserve?roomTypeId=${room.id}`);
      } else {
        // Not logged in - redirect to login
        navigate("/login");
      }
    } catch (err) {
      // Any error assume not logged in
      navigate("/login");
    }
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

      {room.images?.length > 0 ? (
        <div className="d-flex flex-wrap gap-3 mt-3">
          {room.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Room image ${i + 1}`}
              className="img-thumbnail"
              style={{ width: 250, height: 'auto', objectFit: 'cover', borderRadius: 8 }}
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
