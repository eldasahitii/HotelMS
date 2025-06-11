import React, { use, useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

export default function RestaurantHostDashboard() {
  const [reservations, setReservations] = useState([]);
  const [newReservation, setNewReservation] = useState({ 
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    restaurantTableID: '',
    dateTime: '',
    status: 'Occupied'
  });
  const [userReservation, setUserReservation] = useState({
  email: '',
  restaurantTableID: '',
  dateTime: '',
  status: 'Occupied'
});
  const [editingReservation, setEditingReservation] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [loggedInEmail, setLoggedInEmail] = useState(null);

  const navigate = useNavigate();

  const fetchReservations = async () => {
    try {
      const res = await axios.get("/api/Host/getAllReservations",{
       withCredentials: true
      });
      setReservations(res.data);
    } catch (err) {
      toast.error("Failed to fetch reservations.");
    }
  };
  const fetchTables = async () => {
    try {
      const res = await axios.get("/api/RestaurantTable/getAllTables", {
        withCredentials: true
      });
      setTables(res.data);
    } catch (err) {
      toast.error("Failed to fetch tables.");
    }
  };
  const fetchCurrentUser = async () => {
  try {
    const res = await axios.get("/api/User/me", {
      withCredentials: true,
    });
    setLoggedInEmail(res.data.email);
  } catch {
    setLoggedInEmail(null);
  }
};
 
  useEffect(() => {
    fetchReservations();
    fetchTables();
    fetchCurrentUser();
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
    toast.warning("Please fill in all fields before submitting.");
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

    toast.success("Reservation added successfully.");

    setNewReservation({ 
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      restaurantTableID: '',
      dateTime: '',
      status: 'Occupied'
    });

    fetchReservations();
  } catch (error) {
    const validationErrors = error.response?.data?.errors;

  if (validationErrors) {
    const allMessages = Object.values(validationErrors).flat().join(" ");
    toast.error(allMessages);
  } else if (typeof error.response?.data === 'string') {
    toast.error(error.response.data)
  } else if (error.response?.data?.title) {
    toast.error(error.response.data.title);
  } else {
    toast.error("Something went wrong. Please try again.");
  }

  }
};

const handleUserEmailReservation = async () => {
  const tableID = parseInt(userReservation.restaurantTableID);

  if (
    !userReservation.email.trim() ||
    !userReservation.dateTime ||
    !tableID
  ) {
    toast.warning("Please fill in all fields before submitting.");
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
    toast.success("Reservation for user created successfully.");

       setUserReservation({
      email: '',
      restaurantTableID: '',
      dateTime: '',
      status: 'Occupied'
    });
    fetchReservations();
  } catch (error) {
      const errorData = error.response?.data;

  if (typeof errorData === 'string') {
    toast.error(errorData);
  } else if (errorData?.errors) {
    const allMessages = Object.values(errorData.errors).flat().join(" ");
    toast.error(allMessages);
  } else if (errorData?.title) {
    toast.error(`${errorData.title}: ${errorData.detail || ''}`);
  } else {
    toast.error("Something went wrong. Please try again.");
  }

  }
};


  const handleCancelReservation = async (id) => {
    const result = await Swal.fire({
      title: 'Cancel Reservation?',
      text: "Are you sure you want to cancel this reservation?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it',
      cancelButtonText: 'No'
    });

    if (!result.isConfirmed) return;
    try {
      await axios.delete(`/api/Host/cancelReservation?id=${id}`, {
        withCredentials: true
      });
      toast.success("Reservation cancelled.");
      fetchReservations();
    } catch (error) {
      toast.error("Failed to cancel reservation.");
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
      toast.success("Status updated.");
      setEditingReservation(null);
      setNewStatus('');
      fetchReservations();
      fetchTables();
    } catch (error) {
      toast.error("Failed to update status.");
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

 const reservationList = filteredReservations.length > 0 ? filteredReservations : reservations;

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#fefefe' }}>

      <ToastContainer position="top-right" autoClose={3000} />


      <main className="flex-grow-1 p-4">
        <h2 className="fw-bold text-primary mb-4">
          <i className="bi bi-calendar2-check me-2"></i>Reservations
        </h2>

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
          Table {table.tableNumber} {table.status === "Occupied" ? "(Occupied)" : ""}
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
          Table {table.tableNumber} {table.status === "Occupied" ? "(Occupied)" : ""}
        </option>
      ))}
    </select>
  <button className="btn btn-primary w-100" onClick={handleUserEmailReservation}>
      <i className="bi bi-check2-circle me-2"></i>Add
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
       <select
  className="form-control mb-2"
  value={newStatus}
  onChange={e => setNewStatus(e.target.value)}
>
  <option value="">Select Status</option>
  <option value="Occupied">Occupied</option>
  <option value="Completed">Completed</option>
  <option value="Cancelled">Cancelled</option>
</select>
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
            <td className={table.status === "Occupied" ? "text-danger" : "text-success"}>
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
