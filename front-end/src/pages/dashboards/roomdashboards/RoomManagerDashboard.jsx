import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';

const RoomManagerDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomStatuses, setRoomStatuses] = useState([]);
  const [newRoom, setNewRoom] = useState({
    name: '',
    capacity: '',
    size: '',
    description: '',
    price: '',
    imageUrl: '',
    roomStatusID: '',
    roomTypeID: '',
  });
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [editRoomData, setEditRoomData] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
    fetchRoomTypes();
    fetchRoomStatuses();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get('https://localhost:7117/api/Room/GetAllRooms', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const response = await axios.get('https://localhost:7117/api/RoomType/GetAllRoomTypes', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setRoomTypes(response.data);
    } catch (error) {
      console.error('Error fetching room types:', error);
    }
  };

  const fetchRoomStatuses = async () => {
    try {
      const response = await axios.get('https://localhost:7117/api/RoomStatus/getAllRoomsStatuses', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setRoomStatuses(response.data);
    } catch (error) {
      console.error('Error fetching room statuses:', error);
    }
  };

  const handleAddRoom = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token is missing');
      return;
    }
    if (!newRoom.name || !newRoom.capacity || !newRoom.roomStatusID || !newRoom.roomTypeID) {
      alert('Please fill in all required fields');
      return;
    }

    const roomStatusID = parseInt(newRoom.roomStatusID, 10);
    const roomTypeID = newRoom.roomTypeID ? parseInt(newRoom.roomTypeID, 10) : null;

    if (isNaN(roomStatusID)) {
      alert('Invalid Room Status selected!');
      return;
    }

    const updatedRoom = { ...newRoom, roomStatusID, roomTypeID };

    try {
      const response = await axios.post('https://localhost:7117/api/Room/AddRoom', updatedRoom, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Room added successfully:', response.data);
      fetchRooms();
      setMessage('Room added successfully.');
      setMessageType('success');
    } catch (error) {
      console.error('Error adding room:', error.response ? error.response.data : error.message);
      alert('An error occurred while adding the room.');
    }
  };

  const handleEdit = (room) => {
    setEditingRoomId(room.roomID);
    setEditRoomData({ ...room });
  };

  const handleUpdateRoom = async () => {
    const token = localStorage.getItem('token');
    if (!token || !editingRoomId) return;

    try {
      await axios.put(`https://localhost:7117/api/Room/UpdateRoom?id=${editingRoomId}`, editRoomData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingRoomId(null);
      setEditRoomData({});
      fetchRooms();
      setMessage('Room updated successfully.');
      setMessageType('success');
    } catch (error) {
      console.error('Error updating room:', error);
      alert('Failed to update room.');
    }
  };

  const handleDeleteRoom = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const isConfirmed = window.confirm('Are you sure you want to delete this room?');
    if (!isConfirmed) return; 

    try {
      await axios.delete(`https://localhost:7117/api/Room/DeleteRoom?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRooms();
      setMessage('Room deleted successfully.');
      setMessageType('success');
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('Failed to delete room.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

const handleReservation = () => {
  navigate('/admin/reservation-dashboard');
};


  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#f2f6fc' }}>
      <aside className="text-white p-4" style={{ width: '240px', backgroundColor: '#324b6b' }}>
        <h4 className="fw-bold mb-4">
          <i className="bi bi-building"></i> HotelMS
        </h4>
        <ul className="nav flex-column">
          <li className="nav-item">
            <i className="bi bi-house-door me-2"></i> RoomManaging
          </li>
<button className="btn btn-outline-light w-100 mt-3 mb-3" onClick={handleReservation}>
  <i className="bi bi-bookmark-plus me-2"></i> Make Reservation
</button>


          <button className="btn btn-outline-light w-100 mt-2" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </button>
        </ul>
      </aside>
      <main className="flex-grow-1 p-4">
        <h2 className="fw-bold text-primary mb-4">
          <i className="bi bi-house-door me-2"></i>Room Manager
        </h2>

        {message && (
          <div className={`alert alert-${messageType} alert-dismissible fade show`} role="alert">
            {message}
            <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
          </div>
        )}

        <div className="card mb-4">
          <div className="card-header bg-success text-white">
            <i className="bi bi-house-door me-2"></i>Add New Room
          </div>
          <div className="card-body">
            <input className="form-control mb-2" placeholder="Room Name" value={newRoom.name} onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })} />
            <input className="form-control mb-2" placeholder="Capacity" value={newRoom.capacity} onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })} />
            <textarea className="form-control mb-2" placeholder="Description" value={newRoom.description} onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}></textarea>
            <input className="form-control mb-2" type="number" placeholder="Price" value={newRoom.price} onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })} />
            <input className="form-control mb-2" placeholder="Image URL" value={newRoom.imageUrl} onChange={(e) => setNewRoom({ ...newRoom, imageUrl: e.target.value })} />

            <select className="form-control mb-2" value={newRoom.roomStatusID} onChange={(e) => setNewRoom({ ...newRoom, roomStatusID: e.target.value })}>
              <option value="">Select Room Status</option>
              {roomStatuses.map((status) => (
                <option key={status.roomStatusID} value={status.roomStatusID}>
                  {status.roomStatusName}
                </option>
              ))}
            </select>

            <select className="form-control mb-2" value={newRoom.roomTypeID} onChange={(e) => setNewRoom({ ...newRoom, roomTypeID: e.target.value })}>
              <option value="">Select Room Type</option>
              {roomTypes.map((type) => (
                <option key={type.roomTypeID} value={type.roomTypeID}>
                  {type.name}
                </option>
              ))}
            </select>

            <button className="btn btn-success w-100" onClick={handleAddRoom}><i className="bi bi-check-circle me-2"></i>Add Room</button>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <i className="bi bi-house-door me-2"></i>Rooms List
          </div>
          <div className="card-body p-0">
            <table className="table mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Capacity</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Image</th>
                  <th>Status</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.roomID}>
                    <td>{room.name}</td>
                    <td>{room.capacity}</td>
                    <td>{room.description}</td>
                    <td>{room.price}</td>
                    <td>
                      {room.imageUrl ? (
                        <img src={room.imageUrl} alt={room.name} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>
                    <td>{room.roomStatus?.roomStatusName}</td>
                    <td>{room.roomType?.name}</td>
                    <td>
                      <button className="btn btn-warning me-2" onClick={() => handleEdit(room)}><i className="bi bi-pencil-square"></i></button>
                      <button className="btn btn-danger" onClick={() => handleDeleteRoom(room.roomID)}><i className="bi bi-trash"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RoomManagerDashboard;
