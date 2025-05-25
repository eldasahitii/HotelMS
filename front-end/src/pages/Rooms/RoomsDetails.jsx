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

  const keywordsToBold = ["pool", "breakfast", "wifi", "room service"];

  // Styles for Capacity/Size block (with margin bottom)
  const capSizeStyle = {
    fontSize: "1.1rem",
    lineHeight: 1.2,
    marginBottom: "1rem", // margin between capacity/size and description
    whiteSpace: "pre-line",
  };

  // Styles for description paragraph (no margin, tight line spacing)
  const descriptionStyle = {
    fontSize: "1.1rem",
    lineHeight: 1.2,
    marginTop: 0,
    marginBottom: 0,
    whiteSpace: "pre-line",
  };

  return (
    <>
      {/* Images container with no padding, no gutters */}
      {selectedImages.length > 0 && (
        <div className="container-fluid px-0 mt-4">
          <div className="row g-0 justify-content-center align-items-center">
            {/* Left Image - no padding, touches left edge */}
            <div className="col-12 col-md-3 ps-0 pe-0 pe-md-2">
              <img
                src={selectedImages[0]}
                alt="Room Left"
                className="img-fluid w-100 rounded-0"
                style={{ height: 400, objectFit: "cover" }}
              />
            </div>

            {/* Middle Image with horizontal padding */}
            <div className="col-12 col-md-6 px-3 my-3 my-md-0">
              <img
                src={selectedImages[1]}
                alt="Room Middle"
                className="img-fluid w-100 rounded-0"
                style={{ height: 400, objectFit: "cover" }}
              />
            </div>

            {/* Right Image - no padding, touches right edge */}
            <div className="col-12 col-md-3 pe-0 ps-0 ps-md-2">
              <img
                src={selectedImages[2]}
                alt="Room Right"
                className="img-fluid w-100 rounded-0"
                style={{ height: 400, objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Room details */}
      <div
        className="container"
        style={{ fontFamily: customFontFamily, marginTop: "4rem" }}
      >
        <h2 className="display-3 mb-3 text-black">{room.name}</h2>

        <div style={capSizeStyle} className="text-black">
          <strong>Capacity:</strong> {room.capacity}
          <br />
          <strong>Size:</strong> {room.size}
        </div>

        <p style={descriptionStyle} className="text-black">
          {room.description.split(new RegExp(`(${keywordsToBold.join("|")})`, "gi")).map((part, i) =>
            keywordsToBold.includes(part.toLowerCase()) ? (
              <strong key={i}>{part}</strong>
            ) : (
              part
            )
          )}
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
