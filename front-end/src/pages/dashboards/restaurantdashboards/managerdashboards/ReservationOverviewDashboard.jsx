import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

export default function ReservationOverviewDashboard() {
  const [reservations, setReservations] = useState([]);


  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get("/api/Host/getAllReservations", {
        withCredentials: true
      });
      setReservations(response.data);
    } catch {
      toast.error("Failed to fetch reservations.");
    }
  };

  return (
    <div id="reservations">
      <h2 className="fw-bold text-primary mb-4">
        <i className="bi bi-calendar-check me-2"></i>All Reservations
      </h2>

                    <ToastContainer position="top-right" autoClose={3000} />
      

      <div className="card mt-4">
        <div className="card-body p-0">
          <table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Guest Name</th>
                <th>Email</th>
                <th>Table Number</th>
                <th>Date & Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((res, index) => (
                <tr key={res.reservationID}>
                  <td>{index + 1}</td>
                  <td>{res.guestName}</td>
                  <td>{res.email}</td>
                  <td>{res.tableNumber}</td>
                  <td>{new Date(res.dateTime).toLocaleString()}</td>
                  <td>{res.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
