import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
  const [editingRoomID, setEditingRoomID] = useState(null);
  const [editRoom, setEditRoom] = useState(null);

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

    const updatedRoom = { ...newRoom, roomStatusID, roomTypeID };

    try {
      await axios.post('https://localhost:7117/api/Room/AddRoom', updatedRoom, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRooms();
    } catch (error) {
      console.error('Error adding room:', error.response ? error.response.data : error.message);
    }
  };

  const startEditRoom = (room) => {
    setEditingRoomID(room.roomID);
    setEditRoom({ ...room });
  };

  const handleUpdateRoom = async () => {
    const token = localStorage.getItem('token');
    if (!token || !editRoom) return;

    const roomStatusID = parseInt(editRoom.roomStatusID, 10);
    const roomTypeID = parseInt(editRoom.roomTypeID, 10);

    try {
      await axios.put(`https://localhost:7117/api/Room/UpdateRoom?id=${editingRoomID}`,
        { ...editRoom, roomStatusID, roomTypeID },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingRoomID(null);
      setEditRoom(null);
      fetchRooms();
    } catch (error) {
      console.error('Error updating room:', error);
      alert('Failed to update room.');
    }
  };

  return (
    <div>
      <h1>Room Manager Dashboard</h1>

      <div>
        <h3>Add New Room</h3>
        <input type="text" placeholder="Room Name" value={newRoom.name} onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })} />
        <input type="text" placeholder="Capacity" value={newRoom.capacity} onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })} />
        <input type="text" placeholder="Size" value={newRoom.size} onChange={(e) => setNewRoom({ ...newRoom, size: e.target.value })} />
        <textarea placeholder="Description" value={newRoom.description} onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })} />
        <input type="number" placeholder="Price" value={newRoom.price} onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })} />
        <input type="text" placeholder="Image URL" value={newRoom.imageUrl} onChange={(e) => setNewRoom({ ...newRoom, imageUrl: e.target.value })} />

        <select value={newRoom.roomStatusID} onChange={(e) => setNewRoom({ ...newRoom, roomStatusID: e.target.value })}>
          <option value="">Select Room Status</option>
          {roomStatuses.map((status) => (
            <option key={status.roomStatusID} value={status.roomStatusID}>{status.roomStatusName}</option>
          ))}
        </select>

        <select value={newRoom.roomTypeID} onChange={(e) => setNewRoom({ ...newRoom, roomTypeID: e.target.value })}>
          <option value="">Select Room Type</option>
          {roomTypes.map((type) => (
            <option key={type.roomTypeID} value={type.roomTypeID}>{type.name}</option>
          ))}
        </select>

        <button onClick={handleAddRoom}>Add Room</button>
      </div>

      {editRoom && (
        <div>
          <h3>Edit Room: {editRoom.name}</h3>
          <input type="text" value={editRoom.name} onChange={(e) => setEditRoom({ ...editRoom, name: e.target.value })} />
          <input type="text" value={editRoom.capacity} onChange={(e) => setEditRoom({ ...editRoom, capacity: e.target.value })} />
          <input type="text" value={editRoom.size} onChange={(e) => setEditRoom({ ...editRoom, size: e.target.value })} />
          <textarea value={editRoom.description} onChange={(e) => setEditRoom({ ...editRoom, description: e.target.value })} />
          <input type="number" value={editRoom.price} onChange={(e) => setEditRoom({ ...editRoom, price: e.target.value })} />
          <input type="text" value={editRoom.imageUrl} onChange={(e) => setEditRoom({ ...editRoom, imageUrl: e.target.value })} />

          <select value={editRoom.roomStatusID} onChange={(e) => setEditRoom({ ...editRoom, roomStatusID: e.target.value })}>
            <option value="">Select Room Status</option>
            {roomStatuses.map((status) => (
              <option key={status.roomStatusID} value={status.roomStatusID}>{status.roomStatusName}</option>
            ))}
          </select>

          <select value={editRoom.roomTypeID} onChange={(e) => setEditRoom({ ...editRoom, roomTypeID: e.target.value })}>
            <option value="">Select Room Type</option>
            {roomTypes.map((type) => (
              <option key={type.roomTypeID} value={type.roomTypeID}>{type.name}</option>
            ))}
          </select>

          <button onClick={handleUpdateRoom}>Save Changes</button>
          <button onClick={() => { setEditingRoomID(null); setEditRoom(null); }}>Cancel</button>
        </div>
      )}

      <h3>All Rooms</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Capacity</th>
            <th>Size</th>
            <th>Description</th>
            <th>Price</th>
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
              <td>{room.size}</td>
              <td>{room.description}</td>
              <td>{room.price}</td>
              <td>{room.roomStatusName}</td>
              <td>{room.roomTypeName}</td>
              <td><button onClick={() => startEditRoom(room)}>Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomManagerDashboard;