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
    roomStatusID: '',
    roomTypeID: '',
    images: [],
    imageInput: ''
  });
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [editRoomData, setEditRoomData] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchRooms();
    fetchRoomTypes();
    fetchRoomStatuses();
  }, []);

  const getRoleFromToken = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    } catch (e) {
      return null;
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await axios.get('https://localhost:7117/api/Room/GetAllRooms', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const response = await axios.get('https://localhost:7117/api/RoomType/GetAllRoomTypes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoomTypes(response.data);
    } catch (error) {
      console.error('Error fetching room types:', error);
    }
  };

  const fetchRoomStatuses = async () => {
    try {
      const role = getRoleFromToken();
      const response = await axios.get(`https://localhost:7117/api/RoomStatus/getAllRoomsStatuses?role=${role}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoomStatuses(response.data);
    } catch (error) {
      console.error('Error fetching room statuses:', error);
    }
  };

  const addImageUrl = () => {
    if (newRoom.imageInput.trim() === '') return;
    setNewRoom(prev => ({
      ...prev,
      images: [...prev.images, prev.imageInput.trim()],
      imageInput: ''
    }));
  };

  const removeImageUrl = (index) => {
    setNewRoom(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddRoom = async () => {
    if (!newRoom.name || !newRoom.capacity || !newRoom.roomStatusID || !newRoom.roomTypeID) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const payload = {
        Name: newRoom.name,
        Capacity: newRoom.capacity,
        Size: newRoom.size,
        Description: newRoom.description,
        Price: parseFloat(newRoom.price),
        RoomStatusID: parseInt(newRoom.roomStatusID, 10),
        RoomTypeID: parseInt(newRoom.roomTypeID, 10),
        Images: newRoom.images  // <-- must match DTO exactly
      };

      const response = await axios.post('https://localhost:7117/api/Room/AddRoom', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage('Room added successfully.');
      setMessageType('success');
      setNewRoom({
        name: '',
        capacity: '',
        size: '',
        description: '',
        price: '',
        roomStatusID: '',
        roomTypeID: '',
        images: [],
        imageInput: ''
      });
      fetchRooms();
    } catch (error) {
      console.error('Error adding room:', error);
      alert('Failed to add room.');
    }
  };

  const handleEdit = (room) => {
    setEditingRoomId(room.roomID);
    setEditRoomData({ ...room });
  };

  const handleUpdateRoom = async () => {
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

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#f2f6fc' }}>
    <aside className="text-white p-4" style={{ width: '240px', backgroundColor: '#324b6b' }}>
  <h4 className="fw-bold mb-4">
    <i className="bi bi-people"></i> HotelMS
  </h4>
  <ul className="nav flex-column">
    <li className="nav-item">
      <i className="bi bi-person-badge me-2"></i> Receptionist Management
    </li>
    
    {/* Button to navigate to Room Manager Dashboard */}
    <button
      className="btn btn-outline-light w-100 mt-3 mb-3"
      onClick={() => navigate('/room-manager-dashboard')}
    >
      <i className="bi bi-building me-2"></i> Room Manager
    </button>

    {/* New button to navigate to Receptionist Management */}
    <button
      className="btn btn-outline-light w-100 mb-3"
      onClick={() => navigate('/room-manager-receptionist-management')}
    >
      <i className="bi bi-person-lines-fill me-2"></i> Receptionist Management
    </button>

    {/* Logout button */}
    <button
      className="btn btn-outline-light w-100 mt-2"
      onClick={() => {
        localStorage.removeItem('token');
        navigate('/login');
      }}
    >
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
            <input className="form-control mb-2" placeholder="Size" value={newRoom.size} onChange={(e) => setNewRoom({ ...newRoom, size: e.target.value })} />
            <textarea className="form-control mb-2" placeholder="Description" value={newRoom.description} onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}></textarea>
            <input className="form-control mb-2" type="number" placeholder="Price" value={newRoom.price} onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })} />

            <div className="d-flex mb-2">
              <input className="form-control me-2" placeholder="Add Image URL" value={newRoom.imageInput} onChange={(e) => setNewRoom({ ...newRoom, imageInput: e.target.value })} />
              <button className="btn btn-primary" onClick={addImageUrl}>Add Image</button>
            </div>

            <ul>
              {newRoom.images.map((img, idx) => (
                <li key={idx}>{img} <button className="btn btn-sm btn-danger" onClick={() => removeImageUrl(idx)}>Remove</button></li>
              ))}
            </ul>

            <select className="form-control mb-2" value={newRoom.roomStatusID} onChange={(e) => setNewRoom({ ...newRoom, roomStatusID: e.target.value })}>
              <option value="">Select Room Status</option>
              {roomStatuses.map(status => (
                <option key={status.roomStatusID} value={status.roomStatusID}>{status.roomStatusName}</option>
              ))}
            </select>

            <select className="form-control mb-2" value={newRoom.roomTypeID} onChange={(e) => setNewRoom({ ...newRoom, roomTypeID: e.target.value })}>
              <option value="">Select Room Type</option>
              {roomTypes.map(type => (
                <option key={type.roomTypeID} value={type.roomTypeID}>{type.name}</option>
              ))}
            </select>

            <button className="btn btn-success w-100" onClick={handleAddRoom}>
              <i className="bi bi-check-circle me-2"></i>Add Room
            </button>
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
                  <th>Images</th>
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
                      {room.roomImages && room.roomImages.length > 0 ? (
                        room.roomImages.map((img, idx) => (
                          <img
                            key={idx}
                            src={img.imageUrl}
                            alt={`Room ${room.name} Image ${idx + 1}`}
                            style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '5px' }}
                          />
                        ))
                      ) : (
                        <span>No Images</span>
                      )}
                    </td>
                    <td>{room.roomStatus?.roomStatusName || 'N/A'}</td>
                    <td>{room.roomType?.name || 'N/A'}</td>
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
