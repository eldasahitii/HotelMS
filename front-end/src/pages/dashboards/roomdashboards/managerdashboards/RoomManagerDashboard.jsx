import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Create an axios instance with default config for credentials
const api = axios.create({
  baseURL: 'https://localhost:7117/api',
  withCredentials: true,  // send cookies with requests (if your backend uses cookie auth)
});

const RoomManagerDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomStatuses, setRoomStatuses] = useState([]);

  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    roomTypeID: '',
    roomStatusID: '',
  });

  // Load all rooms
  const loadRooms = async () => {
    try {
      const response = await api.get('/Room/GetAllRooms');
      setRooms(response.data);
    } catch (error) {
      console.error('Error loading rooms:', error);
    }
  };

  // Load all room types
  const loadRoomTypes = async () => {
    try {
      const response = await api.get('/RoomType/GetAllRoomTypes');
      setRoomTypes(response.data);
    } catch (error) {
      console.error('Error loading room types:', error);
    }
  };

  // Load all room statuses for RoomManager role
  const loadRoomStatuses = async () => {
    try {
      const response = await api.get('/RoomStatus/getAllRoomsStatuses', {
        params: { role: 'RoomManager' }
      });
      setRoomStatuses(response.data);
    } catch (error) {
      console.error('Error loading room statuses:', error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadRooms();
    loadRoomTypes();
    loadRoomStatuses();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoom(prev => ({ ...prev, [name]: value }));
  };

  // Add new room handler
  const handleAddRoom = async () => {
    if (
      !newRoom.roomNumber.trim() ||
      !newRoom.roomTypeID ||
      !newRoom.roomStatusID
    ) {
      alert('Please fill all fields.');
      return;
    }

    try {
      const payload = {
        roomID: 0, // backend auto-generates ID usually
        roomNumber: newRoom.roomNumber,
        roomTypeID: Number(newRoom.roomTypeID),
        roomStatusID: Number(newRoom.roomStatusID),
      };

      const response = await api.post('/Room/AddRoom', payload);

      console.log('Room added:', response.data);
      alert('Room added successfully.');

      // Reset form
      setNewRoom({
        roomNumber: '',
        roomTypeID: '',
        roomStatusID: '',
      });

      // Refresh room list
      loadRooms();
    } catch (error) {
      console.error('Error adding room:', error);
      alert('Failed to add room. Check console for details.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Room Manager Dashboard</h2>

      {/* Add New Room Form */}
      <div className="card p-3 mb-4">
        <h4>Add New Room</h4>
        <div className="mb-3">
          <label htmlFor="roomNumber" className="form-label">Room Number</label>
          <input
            type="text"
            id="roomNumber"
            name="roomNumber"
            className="form-control"
            value={newRoom.roomNumber}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="roomTypeID" className="form-label">Room Type</label>
          <select
            id="roomTypeID"
            name="roomTypeID"
            className="form-select"
            value={newRoom.roomTypeID}
            onChange={handleInputChange}
          >
            <option value="">Select Type</option>
            {roomTypes.map(rt => (
              <option key={rt.roomTypeID} value={rt.roomTypeID}>
                {rt.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="roomStatusID" className="form-label">Room Status</label>
          <select
            id="roomStatusID"
            name="roomStatusID"
            className="form-select"
            value={newRoom.roomStatusID}
            onChange={handleInputChange}
          >
            <option value="">Select Status</option>
            {roomStatuses.map(rs => (
              <option key={rs.roomStatusID} value={rs.roomStatusID}>
                {rs.roomStatusName}
              </option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary" onClick={handleAddRoom}>
          Add Room
        </button>
      </div>

      {/* Rooms List */}
      <h4>Existing Rooms</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Room Number</th>
            <th>Room Type</th>
            <th>Room Status</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map(room => {
            const type = roomTypes.find(rt => rt.roomTypeID === room.roomTypeID);
            const status = roomStatuses.find(rs => rs.roomStatusID === room.roomStatusID);
            return (
              <tr key={room.roomID}>
                <td>{room.roomNumber}</td>
                <td>{type ? type.name : 'N/A'}</td>
                <td>{status ? status.roomStatusName : 'N/A'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RoomManagerDashboard;
