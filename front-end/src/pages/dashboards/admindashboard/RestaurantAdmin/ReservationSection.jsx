import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ReservationSection() {
  const [reservations, setReservations] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchReservations = async () => {
    const res = await axios.get("/api/Host/getAllReservations", { withCredentials: true });
    setReservations(res.data);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const filteredReservations = reservations.filter(r => {
    const resDate = new Date(r.dateTime);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (start && resDate < start) return false;
    if (end && resDate > end) return false;
    return true;
  });

  return (
    <div className="container py-4">
      <h2 className="mb-4">All Reservations</h2>

      <div className="mb-3 d-flex gap-3">
        <div>
          <label className="form-label">Start Date</label>
          <input type="date" className="form-control" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div>
          <label className="form-label">End Date</label>
          <input type="date" className="form-control" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
      </div>

      <div className="card">
        <div className="card-header">Reservations</div>
        <div className="card-body p-0">
          <table className="table">
            <thead>
              <tr><th>#</th><th>Guest</th><th>Email</th><th>Phone</th><th>Table</th><th>Date</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filteredReservations.map((r, i) => (
                <tr key={r.reservationID}>
                  <td>{i + 1}</td>
                  <td>{r.guestName}</td>
                  <td>{r.email}</td>
                  <td>{r.phoneNumber}</td>
                  <td>{r.tableNumber || r.restaurantTableID}</td>
                  <td>{new Date(r.dateTime).toLocaleString()}</td>
                  <td>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
