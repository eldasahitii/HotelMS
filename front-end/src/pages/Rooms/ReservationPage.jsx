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

  const [loading, setLoading] = useState(true); // Loading user info

  // Get basic user info and userID from auth endpoint
  useEffect(() => {
    axios
      .get("https://localhost:7117/api/Auth/me", { withCredentials: true })
      .then((res) => {
        console.log("User from /me:", res.data);
        const user = res.data;
        const userIDFromResponse = user.userId;

        if (!userIDFromResponse) {
          console.error("User ID missing");
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
        setLoading(false); // <-- Set loading to false here after data loaded
      })
      .catch((error) => {
        console.error("Failed to load user info:", error);
        setLoading(false); // Also stop loading even if error occurred
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
        {
          withCredentials: true,
        }
      );

      alert("Reservation successful!");
      navigate("/rooms");
    } catch (error) {
      console.error(
        "Reservation failed:",
        error.response || error.message || error
      );
      alert("Failed to create reservation. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <p>Loading user information...</p>
      </div>
    );
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
