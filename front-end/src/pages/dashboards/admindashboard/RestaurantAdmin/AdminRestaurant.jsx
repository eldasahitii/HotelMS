// RestaurantAdmin.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function RestaurantAdmin() {
  const [activeSection, setActiveSection] = useState("hosts");

  const [hosts, setHosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [editingHost, setEditingHost] = useState(null);
  const [editData, setEditData] = useState({ firstName: '', lastName: '', email: '' });

  const [tableStatusFilter, setTableStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const navigate = useNavigate();

  const fetchHosts = async () => {
    const res = await axios.get("/api/HostManagement/getAllHosts", { withCredentials: true });
    setHosts(res.data);
  };

  const fetchUsers = async () => {
    const res = await axios.get("/api/User/GetAllCustomers", { withCredentials: true });
    setUsers(res.data);
  };

  const fetchMenuItems = async () => {
    const res = await axios.get("/api/MenuItem/getAllMenuItems", { withCredentials: true });
    setMenuItems(res.data);
  };

  const fetchTables = async () => {
    const res = await axios.get("/api/RestaurantTable/getAllTables", { withCredentials: true });
    setTables(res.data);
  };

  const fetchReservations = async () => {
    const res = await axios.get("/api/Host/getAllReservations", { withCredentials: true });
    setReservations(res.data);
  };

  useEffect(() => {
    fetchHosts();
    fetchUsers();
    fetchMenuItems();
    fetchTables();
    fetchReservations();
  }, []);

  useEffect(() => {
  if (message) {
    const timeout = setTimeout(() => setMessage(''), 3000);
    return () => clearTimeout(timeout);
  }
}, [message]);


  const handleAssignHostRole = async () => {
    if (!selectedUserEmail) return;
    await axios.post("/api/HostManagement/assignHostRole", { email: selectedUserEmail }, { withCredentials: true });
    setSelectedUserEmail("");
     setMessage("Host role assigned successfully.");
    setMessageType("success");
    fetchHosts();
  };

  const openEditHost = (host) => {
    setEditingHost(host);
    setEditData({ firstName: host.firstName, lastName: host.lastName, email: host.email });
  };

  const handleUpdateHost = async () => {
    if (!editingHost) return;
    await axios.put(`/api/HostManagement/updateHost?id=${editingHost.userID}`, editData, { withCredentials: true });
    setEditingHost(null);
    setMessage("Host updated successfully.");
    setMessageType("success");
    fetchHosts();
  };

  const handleDeleteHost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this host?")) return;
    await axios.delete(`/api/HostManagement/deleteHost/${id}`, { withCredentials: true });
    setMessage("Host deleted successfully.");
    setMessageType("success");
    fetchHosts();
  };


  const filteredTables = tables.filter(t => {
    if (tableStatusFilter === "All") return true;
    return t.status.toLowerCase() === tableStatusFilter.toLowerCase();
  });

  const filteredReservations = reservations.filter(r => {
    const resDate = new Date(r.dateTime);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (start && resDate < start) return false;
    if (end && resDate > end) return false;
    return true;
  });

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: "#f2f6fc" }}>
      <aside className="text-white p-4" style={{ width: "240px", backgroundColor: "#324b6b" }}>
        <h4 className="fw-bold mb-4"><i className="bi bi-building"></i> HotelMS Admin</h4>
        <ul className="nav flex-column">
          {['hosts', 'menu', 'tables', 'reservations'].map(section => (
            <button key={section} className={`nav-link text-white ${activeSection === section ? 'fw-bold' : ''}`} onClick={() => setActiveSection(section)}>
              {section === 'hosts' && <><i className="bi bi-people-fill me-2"></i>Hosts</>}
              {section === 'menu' && <><i className="bi bi-list-ul me-2"></i>Menu</>}
              {section === 'tables' && <><i className="bi bi-table me-2"></i>Tables</>}
              {section === 'reservations' && <><i className="bi bi-calendar-check me-2"></i>Reservations</>}
            </button>
          ))}
        </ul>
      </aside>

      <main className="flex-grow-1 p-4">
        <h2 className="fw-bold text-primary mb-4">
          <i className="bi bi-clipboard-data me-2"></i>Restaurant Admin Overview
        </h2>

        {message && (
          <div className={`alert alert-${messageType} alert-dismissible fade show`} role="alert">
            {message}
            <button type="button" className="btn-close" aria-label="Close" onClick={() => setMessage('')}></button>
          </div>
        )}


        {activeSection === "hosts" && (
          <>
            <h5>Assign Host Role</h5>
            <select className="form-select mb-3" value={selectedUserEmail} onChange={(e) => setSelectedUserEmail(e.target.value)}>
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u.userID} value={u.email}>
                  {u.firstName} {u.lastName} ({u.email})
                </option>
              ))}
            </select>
            <button className="btn btn-primary mb-4" onClick={handleAssignHostRole}>Assign</button>

            <div className="card">
              <div className="card-header">All Hosts</div>
              <div className="card-body p-0">
                <table className="table">
                  <thead>
                    <tr><th>#</th><th>Name</th><th>Email</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {hosts.map((h, i) => (
                      <tr key={h.userID}>
                        <td>{i + 1}</td>
                        <td>{h.firstName} {h.lastName}</td>
                        <td>{h.email}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => openEditHost(h)}><i className="bi bi-pencil"></i></button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteHost(h.userID)}><i className="bi bi-trash"></i></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {editingHost && (
              <div className="card mt-4">
                <div className="card-header bg-warning text-dark">Edit Host</div>
                <div className="card-body">
                  <input className="form-control mb-2" placeholder="First Name" value={editData.firstName} onChange={e => setEditData({ ...editData, firstName: e.target.value })} />
                  <input className="form-control mb-2" placeholder="Last Name" value={editData.lastName} onChange={e => setEditData({ ...editData, lastName: e.target.value })} />
                  <input className="form-control mb-2" placeholder="Email" value={editData.email} onChange={e => setEditData({ ...editData, email: e.target.value })} />
                  <button className="btn btn-primary me-2" onClick={handleUpdateHost}>Save</button>
                  <button className="btn btn-secondary" onClick={() => setEditingHost(null)}>Cancel</button>
                </div>
              </div>
            )}
          </>
        )}



        {activeSection === "menu" && (
          <div className="card">
            <div className="card-header">Menu Items</div>
            <div className="card-body p-0">
              <table className="table">
                <thead>
                  <tr><th>#</th><th>Name</th><th>Price</th><th>Available</th><th>Image</th></tr>
                </thead>
                <tbody>
                  {menuItems.map((m, i) => (
                    <tr key={m.menuItemID}>
                      <td>{i + 1}</td>
                      <td>{m.name}</td>
                      <td>${Number(m.price).toFixed(2)}</td>
                      <td>{m.is_available ? 'Yes' : 'No'}</td>
                      <td><img src={m.image_url} alt={m.name} style={{ width: 60 }} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === "tables" && (
          <>
            <div className="mb-3">
              <label className="form-label">Filter by Status</label>
              <select className="form-select w-auto" value={tableStatusFilter} onChange={(e) => setTableStatusFilter(e.target.value)}>
                <option value="All">All</option>
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
              </select>
            </div>
            <div className="card">
              <div className="card-header">Restaurant Tables</div>
              <div className="card-body p-0">
                <table className="table">
                  <thead>
                    <tr><th>#</th><th>Table Number</th><th>Status</th><th>Capacity</th></tr>
                  </thead>
                  <tbody>
                    {filteredTables.map((t, i) => (
                      <tr key={t.restaurantTableID}>
                        <td>{i + 1}</td>
                        <td>{t.tableNumber}</td>
                        <td className={t.status === "Booked" ? "text-danger" : "text-success"}>{t.status}</td>
                        <td>{t.capacity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeSection === "reservations" && (
          <>
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
              <div className="card-header">All Reservations</div>
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
          </>
        )}
      </main>
    </div>
  );
}
