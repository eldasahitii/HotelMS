import React, { use, useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';

export default function RestaurantHostDashboard() {
  const [reservations, setReservations] = useState([]);
  const [newReservation, setNewReservation] = useState({ 
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    restaurantTableID: '',
    dateTime: '',
    status: 'Booked'
  });
  const [userReservation, setUserReservation] = useState({
  email: '',
  restaurantTableID: '',
  dateTime: '',
  status: 'Booked'
});
  const [editingReservation, setEditingReservation] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  const fetchReservations = async () => {
    try {
      const res = await axios.get("/api/Host/getAllReservations",{
       withCredentials: true
      });
      setReservations(res.data);
    } catch (err) {
      setMessage("Failed to fetch reservations.");
      setMessageType("danger");
    }
  };
  const fetchTables = async () => {
    try {
      const res = await axios.get("/api/RestaurantTable/getAllTables", {
        withCredentials: true
      });
      setTables(res.data);
    } catch (err) {
      console.error("Failed to fetch tables", err);
    }
  };
 
  useEffect(() => {
    fetchReservations();
    fetchTables();
  }, []);

  const handleAddReservation = async () => {
  if (
    !newReservation.firstName.trim() ||
    !newReservation.lastName.trim() ||
    !newReservation.email.trim() ||
    !newReservation.phoneNumber.trim() ||
    !newReservation.dateTime ||
    !newReservation.restaurantTableID
  ) {
    setMessage("Please fill in all fields before submitting.");
    setMessageType("danger");
    return;
  }

  try {
    const payload = {
      ...newReservation,
      restaurantTableID: parseInt(newReservation.restaurantTableID),
    };



    await axios.post("/api/Host/createReservationWithGuest", payload, {
      withCredentials: true
    });



    setMessage("Reservation added successfully.");
    setMessageType("success");

    setNewReservation({ 
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      restaurantTableID: '',
      dateTime: '',
      status: 'Booked'
    });

    fetchReservations();
  } catch (error) {
    const validationErrors = error.response?.data?.errors;

  if (validationErrors) {
    const allMessages = Object.values(validationErrors).flat().join(" ");
    setMessage(allMessages);
  } else if (typeof error.response?.data === 'string') {
    
    setMessage(error.response.data);
  } else if (error.response?.data?.title) {
    setMessage(error.response.data.title);
  } else {
    setMessage("Something went wrong. Please try again.");
  }

  setMessageType("danger");
  }
};

const handleUserEmailReservation = async () => {
  const tableID = parseInt(userReservation.restaurantTableID);

  if (
    !userReservation.email.trim() ||
    !userReservation.dateTime ||
    !tableID
  ) {
    setMessage("Email, date/time and table are required.");
    setMessageType("danger");
    return;
  }

  const payload = {
    email: userReservation.email,
    restaurantTableID: tableID,
    dateTime: userReservation.dateTime,
    status: userReservation.status
  };


  try {
    const response = await axios.post("/api/Host/createReservationByEmail", payload, {
      withCredentials: true
    });

    console.log("Success:", response.data);
    setMessage("Reservation for user created successfully.");
    setMessageType("success");

       setUserReservation({
      email: '',
      restaurantTableID: '',
      dateTime: '',
      status: 'Booked'
    });
    fetchReservations();
  } catch (error) {
      const errorData = error.response?.data;

  if (typeof errorData === 'string') {
    setMessage(errorData);
  } else if (errorData?.errors) {
    const allMessages = Object.values(errorData.errors).flat().join(" ");
    setMessage(allMessages);
  } else if (errorData?.title) {
    setMessage(`${errorData.title}: ${errorData.detail || ''}`);
  } else {
    setMessage("Something went wrong. Please try again.");
  }

  setMessageType("danger");
  }
};


  const handleCancelReservation = async (id) => {
    try {
      await axios.delete(`/api/Host/cancelReservation?id=${id}`, {
        withCredentials: true
      });
      setMessage("Reservation cancelled.");
      setMessageType("success");
      fetchReservations();
    } catch (error) {
      setMessage("Failed to cancel reservation.");
      setMessageType("danger");
    }
  };
  const handleUpdateReservationStatus = async (id) => {
    try {
      await axios.put(`/api/Host/updateReservationStatus?id=${id}`, JSON.stringify(newStatus), {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true
      });
      setMessage("Status updated.");
      setMessageType("success");
      setEditingReservation(null);
      setNewStatus('');
      fetchReservations();
    } catch (error) {
      setMessage("Failed to update status.");
      setMessageType("danger");
    }
  };

const handleSearch = () => {
  const trimmedSearch = searchTerm.trim().toLowerCase();

  const filtered = reservations.filter(res =>
    res.guestName &&
    res.guestName.toLowerCase().includes(trimmedSearch)
  );

  setFilteredReservations(filtered);
};

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

 const reservationList = filteredReservations.length > 0 ? filteredReservations : reservations;

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#fefefe' }}>
      <aside className="text-white p-4" style={{ width: '240px', backgroundColor: '#3c4b64' }}>
        <h4 className="fw-bold mb-4"><i className="bi bi-person-circle"></i> Host Panel</h4>
        <ul className="nav flex-column">
          <li className="nav-item">Manage Reservations</li>
        </ul>
        <hr className="text-white" />
        <button className="btn btn-outline-light w-100" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-2"></i> Logout
        </button>
      </aside>

      <main className="flex-grow-1 p-4">
        <h2 className="fw-bold text-primary mb-4">
          <i className="bi bi-calendar2-check me-2"></i>Reservations
        </h2>

        {message && (
          <div className={`alert alert-${messageType} alert-dismissible fade show`}>
            {message}
            <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
          </div>
        )}

        <div className="card mb-4">
  <div className="card-header bg-primary text-white">
    <i className="bi bi-plus-circle me-2"></i>Add Reservation
  </div>
  <div className="card-body">
    <input
      className="form-control mb-2"
      placeholder="First Name"
      value={newReservation.firstName}
      onChange={e => setNewReservation({ ...newReservation, firstName: e.target.value })}
    />
    <input
      className="form-control mb-2"
      placeholder="Last Name"
      value={newReservation.lastName}
      onChange={e => setNewReservation({ ...newReservation, lastName: e.target.value })}
    />
    <input
      className="form-control mb-2"
      type="email"
      placeholder="Email"
      value={newReservation.email}
      onChange={e => setNewReservation({ ...newReservation, email: e.target.value })}
    />
    <input
      className="form-control mb-2"
      placeholder="Phone Number"
      value={newReservation.phoneNumber}
      onChange={e => setNewReservation({ ...newReservation, phoneNumber: e.target.value })}
    />
    <input
      className="form-control mb-2"
      type="datetime-local"
      value={newReservation.dateTime}
      onChange={e => setNewReservation({ ...newReservation, dateTime: e.target.value })}
    />

    <select
      className="form-control mb-2"
      value={newReservation.restaurantTableID}
      onChange={e => setNewReservation({ ...newReservation, restaurantTableID: e.target.value })}
      required
    >
      <option value="">Select Table</option>
      {tables.map(table => (
        <option key={table.restaurantTableID} value={table.restaurantTableID}>
          Table {table.tableNumber} {table.status === "Booked" ? "(Booked)" : ""}
        </option>
      ))}
    </select>

    <button className="btn btn-primary w-100" onClick={handleAddReservation}>
      <i className="bi bi-check2-circle me-2"></i>Add
    </button>
  </div>
</div>

<div className="card mt-4">
  <div className="card-header bg-success text-white">
    <i className="bi bi-envelope-check me-2"></i>Reserve for Existing User
  </div>
  <div className="card-body">
    <input
      className="form-control mb-2"
      type="email"
      placeholder="User Email"
      value={userReservation.email}
      onChange={e => setUserReservation({ ...userReservation, email: e.target.value })}
    />
    <input
      className="form-control mb-2"
      type="datetime-local"
      value={userReservation.dateTime}
      onChange={e => setUserReservation({ ...userReservation, dateTime: e.target.value })}
    />
    <select
      className="form-control mb-2"
      value={userReservation.restaurantTableID}
      onChange={e => setUserReservation({ ...userReservation, restaurantTableID: e.target.value })}
    >
      <option value="">Select Table</option>
      {tables.map(table => (
        <option key={table.restaurantTableID} value={table.restaurantTableID}>
          Table {table.tableNumber} {table.status === "Booked" ? "(Booked)" : ""}
        </option>
      ))}
    </select>
    <button className="btn btn-success w-100" onClick={handleUserEmailReservation}>
      <i className="bi bi-person-plus me-2"></i>Reserve for User
    </button>
  </div>
</div><br /><br />
    
        <div className="row mb-3">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by guest name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <button className="btn btn-primary w-100" onClick={handleSearch}>Search</button>
              </div><br/> <br /><br />
        <div className="card">
          <div className="card-header bg-secondary text-white">
              <i className="bi bi-list-ul me-2"></i>All Reservations
          </div>
          <div className="card-body p-0">
            </div>
            <table className="table mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Guest Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Date & Time</th>
                  <th>Table ID</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservationList.map((res, index) => (
                  <tr key={res.reservationID}>
                    <td>{index + 1}</td>
                    <td>{res.guestName}</td>
                    <td>{res.email}</td>
                    <td>{res.phoneNumber}</td>
                    <td>{new Date(res.dateTime).toLocaleString()}</td>
                    <td>{res.restaurantTableID}</td>
                    <td>{res.status}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleCancelReservation(res.reservationID)}>
                        <i className="bi bi-x-circle"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => {
                         setEditingReservation(res.reservationID);
                          setNewStatus(res.status);
                       }}>
                       <i className="bi bi-pencil-square"></i>
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {editingReservation && (
  <div className="card mt-4">
    <div className="card-header bg-warning text-dark">
      Update Reservation Status
    </div>
    <div className="card-body">
      <input
        className="form-control mb-2"
        placeholder="New Status"
        value={newStatus}
        onChange={e => setNewStatus(e.target.value)}
      />
      <button className="btn btn-primary me-2" onClick={() => handleUpdateReservationStatus(editingReservation)}>
        Save
      </button>
      <button className="btn btn-secondary" onClick={() => setEditingReservation(null)}>
        Cancel
      </button>
    </div>
  </div>
)}

<div className="card mt-5">
  <div className="card-header bg-info text-white">
    <i className="bi bi-table me-2"></i>Table Availability
  </div>
  <div className="card-body p-0">
    <table className="table mb-0">
      <thead className="table-light">
        <tr>
          <th>#</th>
          <th>Table Number</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {tables.map((table, index) => (
          <tr key={table.restaurantTableID}>
            <td>{index + 1}</td>
            <td>{table.tableNumber}</td>
            <td className={table.status === "Booked" ? "text-danger" : "text-success"}>
              {table.status}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


          </div>
        </div>
      </main>
    </div>
  );
}
