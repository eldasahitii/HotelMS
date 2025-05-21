import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

const ReservationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Read roomTypeId from query params
  const queryParams = new URLSearchParams(location.search);
  const roomId = queryParams.get("roomTypeId");

  const [userID, setUserID] = useState(null);

  // User info states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Reservation states
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  // On mount: check roomId and token, get userID from token
  useEffect(() => {
    if (!roomId) {
      navigate("/rooms");
      return;
    }

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

  // Fetch user info once userID is set
  useEffect(() => {
    if (!userID) return;

    const token = localStorage.getItem("token");

    axios
      .get("https://localhost:7117/api/User", {
        params: { id: userID },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const user = response.data;
        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
        setEmail(user.email || "");
        setPhone(user.phone || "");
        setAddress(user.address || "");
      })
      .catch((error) => {
        console.error("Failed to load user info:", error);
      });
  }, [userID]);

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
      await axios.post(
        "https://localhost:7117/api/RoomReservations",
        {
          roomID: roomId,
          userID: userID,
          checkInDate,
          checkOutDate,
          specialRequests,
          reservationStatusID: 1,

          // Optional: send user info if your API supports it
          firstName,
          lastName,
          email,
          phone,
          address,
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
    return null; // or loading spinner
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Room Reservation</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: "600px" }}>
        <h5>User Information</h5>
        <div className="row mb-3">
          <div className="col">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="col">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              className="form-control"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>
          <textarea
            className="form-control"
            rows="2"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <h5>Reservation Details</h5>
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
