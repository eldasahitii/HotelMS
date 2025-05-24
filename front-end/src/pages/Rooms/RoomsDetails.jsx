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
          images: (data.images || []).map((img) =>
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
      const authCheck = await axios.get(`${backendBaseUrl}api/Auth/me`, {
        withCredentials: true,
      });
      if (authCheck.data.role) {
        navigate(`/reserve?roomTypeId=${room.id}`);
      } else {
        navigate("/login");
      }
    } catch (err) {
      navigate("/login");
    }
  };

  if (error) return <div className="alert alert-danger m-3">{error}</div>;
  if (!room) return <div className="m-3">Loading room details...</div>;

  const selectedImages = room.images.slice(-3);

  const customFontFamily = "'Crimson Text', serif";

  return (
    <>
      {/* Images with bigger height and slightly bigger gutters */}
      {selectedImages.length > 0 && (
        <div className="row g-4">
          {selectedImages.map((img, i) => (
            <div key={i} className="col-4">
              <img
                src={img}
                alt={`Room ${i + 1}`}
                className="img-fluid rounded"
                style={{ height: 400, objectFit: "cover", width: "100%" }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Content container with Crimson Text font, left aligned, more top margin */}
      <div className="container" style={{ fontFamily: customFontFamily, marginTop: '4rem' }}>
        <h2 className="display-3 mb-3 text-black">{room.name}</h2>

        <div
          className="mb-3 fs-6 text-black"
          style={{ whiteSpace: "pre-line" }}
        >
          {`Capacity: ${room.capacity}\nSize: ${room.size}`}
        </div>

        <p className="mb-5 fs-6 text-black" style={{ whiteSpace: "pre-line" }}>
          {room.description}
        </p>

        <button
          onClick={handleBookNow}
          className="btn btn-secondary btn-lg px-5 mt-5"
        >
          Book Now
        </button>
      </div>
    </>
  );
}
