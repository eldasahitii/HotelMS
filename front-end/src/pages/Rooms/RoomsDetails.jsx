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
    fontSize: "1.25rem",
    lineHeight: 1.3,
    marginBottom: "1.5rem",
    whiteSpace: "pre-line",
    color: "#333",
  };

  // Styles for description paragraph (no margin, tight line spacing)
  const descriptionStyle = {
    fontSize: "1.15rem",
    lineHeight: 1.5,
    marginTop: 0,
    marginBottom: "2rem",
    whiteSpace: "pre-line",
    color: "#555",
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
        className="container my-5 p-4 rounded shadow-sm"
        style={{
          fontFamily: customFontFamily,
          backgroundColor: "#fafafa",
          maxWidth: 900,
          boxShadow: "0 4px 15px rgb(0 0 0 / 0.1)",
        }}
      >
        <h2
          className="display-4 mb-4"
          style={{ color: "#222", fontWeight: "700", letterSpacing: "0.03em" }}
        >
          {room.name}
        </h2>

        <div
          style={{
            ...capSizeStyle,
            borderBottom: "1px solid #ddd",
            paddingBottom: "1rem",
            marginBottom: "1.75rem",
          }}
          className="d-flex justify-content-start gap-4 flex-wrap"
        >
          <div>
            <strong style={{ color: "#444" }}>Capacity:</strong> {room.capacity}
          </div>
          <div>
            <strong style={{ color: "#444" }}>Size:</strong> {room.size}
          </div>
          <div>
            <strong style={{ color: "#444" }}>Price:</strong> ${room.price}
          </div>
        </div>

        <p style={descriptionStyle} className="text-justify">
          {room.description.split(new RegExp(`(${keywordsToBold.join("|")})`, "gi")).map((part, i) =>
            keywordsToBold.includes(part.toLowerCase()) ? (
              <strong key={i} style={{ color: "#222" }}>
                {part}
              </strong>
            ) : (
              part
            )
          )}
        </p>

<div className="text-center mt-5">
  <button
    onClick={handleBookNow}
    className="btn btn-lg px-5"
    style={{
      backgroundColor: "#28a745", // bootstrap success green
      color: "white",
      borderRadius: "30px",
      fontWeight: "600",
      letterSpacing: "0.05em",
      transition: "background-color 0.3s ease",
      border: "none",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1e7e34")} // darker green
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#28a745")}
  >
    Book Now
  </button>
</div>


      </div>
    </>
  );
}
