import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

const ReservationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { roomId } = location.state || {};
  const [userID, setUserID] = useState(null);

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  useEffect(() => {
    // Validate roomId
    if (!roomId) {
      navigate("/rooms");
      return;
    }

    // Get token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const id = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      if (!id) {
        navigate("/login");
        return;
      }
      setUserID(id);
    } catch (err) {
      console.error("Invalid token:", err);
      navigate("/login");
    }
  }, [navigate, roomId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkInDate || !checkOutDate) {
      alert("Please enter both check-in and check-out dates.");
      return;
    }
    if (checkInDate >= checkOutDate) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://your-api-url/api/RoomReservations",
        {
          roomID: roomId,
          userID: userID,
          checkInDate,
          checkOutDate,
          specialRequests,
          reservationStatusID: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Reservation successful!");
      navigate("/");
    } catch (error) {
      console.error("Reservation failed:", error);
      alert("Failed to create reservation. Please try again.");
    }
  };

  if (!userID) {
    // Optional: Show loading spinner or nothing until userID is set
    return null;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Room Reservation</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: "500px" }}>
        <div className="mb-3">
          <label className="form-label">Check-In Date</label>
          <input
            type="date"
            className="form-control"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Check-Out Date</label>
          <input
            type="date"
            className="form-control"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Special Requests</label>
          <textarea
            className="form-control"
            rows="3"
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit Reservation
        </button>
      </form>
    </div>
  );
};

export default ReservationPage;
