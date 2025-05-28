import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const ReservationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const roomId = queryParams.get("roomTypeId");

  const [userID, setUserID] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://localhost:7117/api/Auth/me", { withCredentials: true })
      .then((res) => {
        const user = res.data;
        const userIDFromResponse = user.userId;
        if (!userIDFromResponse) {
          navigate("/login");
          return;
        }
        setUserID(userIDFromResponse);
      })
      .catch(() => {
        navigate("/login");
      });
  }, [navigate]);

  useEffect(() => {
    if (!userID) return;

    axios
      .get("https://localhost:7117/api/User", {
        params: { id: userID },
        withCredentials: true,
      })
      .then((response) => {
        const user = response.data;
        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
        setEmail(user.email || "");
        setPhone(user.phone || "");
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [userID]);

  const phoneRegex = /^\d{9}$/;

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

    if (phone && !phoneRegex.test(phone)) {
      alert("Phone number must be exactly 9 digits.");
      return;
    }

    try {
      await axios.post(
        "https://localhost:7117/api/RoomReservation/MakeReservation",
        {
          roomID: roomId,
          userID,
          checkInDate,
          checkOutDate,
          specialRequests,
          reservationStatusID: 1,
          firstName,
          lastName,
          email,
          phone,
        },
        { withCredentials: true }
      );

      alert("Reservation successful!");
      navigate("/rooms");
    } catch (error) {
      alert("Failed to create reservation. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div
          className="spinner-border"
          role="status"
          style={{ color: "#2c6e49" }}
          aria-hidden="true"
        ></div>
        <p className="mt-3" style={{ color: "#2c6e49" }}>
          Loading user information...
        </p>
      </div>
    );
  }

  return (
    <div
      className="container my-5 p-4"
      style={{
        maxWidth: "700px",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 className="mb-4 text-center" style={{ color: "#2c6e49" }}>
        Room Reservation
      </h2>
      <form onSubmit={handleSubmit}>
        <section className="mb-4">
          <h5 className="mb-3 border-bottom pb-2" style={{ color: "#4a6f59" }}>
            User Information
          </h5>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">First Name</label>
              <input
                type="text"
                className="form-control shadow-sm"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="Enter your first name"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Last Name</label>
              <input
                type="text"
                className="form-control shadow-sm"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="mt-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@example.com"
            />
          </div>

          <div className="mt-3">
            <label className="form-label fw-semibold">Phone Number</label>
            <input
              type="tel"
              className="form-control shadow-sm"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="044-111-111"
            />
          </div>
        </section>

        <section className="mb-4">
          <h5 className="mb-3 border-bottom pb-2" style={{ color: "#4a6f59" }}>
            Reservation Details
          </h5>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Check-In Date</label>
              <input
                type="date"
                className="form-control shadow-sm"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Check-Out Date</label>
              <input
                type="date"
                className="form-control shadow-sm"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mt-3">
            <label className="form-label fw-semibold">Special Requests</label>
            <textarea
              className="form-control shadow-sm"
              rows="3"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Anything we should know?"
            ></textarea>
          </div>
        </section>

        <div className="d-grid mt-4">
          <button
            type="submit"
            className="btn shadow-sm"
            style={{
              backgroundColor: "#2c6e49",
              color: "#fff",
              fontWeight: "600",
              fontSize: "1.1rem",
              borderRadius: "6px",
              border: "none",
              padding: "12px",
            }}
          >
            Submit Reservation
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReservationPage;
