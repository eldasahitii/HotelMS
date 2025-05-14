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
    roomStatusID: '',  // This will be selected from dropdown
    roomTypeID: '',    // This will be selected from dropdown
  });

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
    const token = localStorage.getItem('token');  // Get token from localStorage
    
    if (!token) {
      console.error('Token is missing');
      return;
    }

    // Basic validation for required fields
    if (!newRoom.name || !newRoom.capacity || !newRoom.roomStatusID || !newRoom.roomTypeID) {
      alert('Please fill in all required fields');
      return;
    }

    // Ensure roomStatusID and roomTypeID are valid numbers
    const roomStatusID = parseInt(newRoom.roomStatusID, 10);
    const roomTypeID = newRoom.roomTypeID ? parseInt(newRoom.roomTypeID, 10) : null;

    if (isNaN(roomStatusID)) {
      alert('Invalid Room Status selected!');
      return;
    }

    console.log("Room Status ID:", roomStatusID);  // Debugging line

    // Create the room object to be sent
    const updatedRoom = { ...newRoom, roomStatusID, roomTypeID };

    try {
      const response = await axios.post(
        'https://localhost:7117/api/Room/AddRoom',
        updatedRoom,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Room added successfully:', response.data);
      fetchRooms();  // Refresh room list after adding
    } catch (error) {
      console.error('Error adding room:', error.response ? error.response.data : error.message);
      if (error.response && error.response.status === 401) {
        alert('Unauthorized! Please log in again.');
      } else if (error.response && error.response.status === 400) {
        alert('Bad Request: Please check the room data.');
      } else {
        alert('An error occurred while adding the room.');
      }
    }
  };

  return (
    <div>
      <h1>Room Manager Dashboard</h1>

      {/* Add Room Form */}
      <div>
        <input
          type="text"
          placeholder="Room Name"
          value={newRoom.name}
          onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Capacity"
          value={newRoom.capacity}
          onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
        />
        <input
          type="text"
          placeholder="Size"
          value={newRoom.size}
          onChange={(e) => setNewRoom({ ...newRoom, size: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newRoom.description}
          onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newRoom.price}
          onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newRoom.imageUrl}
          onChange={(e) => setNewRoom({ ...newRoom, imageUrl: e.target.value })}
        />

        {/* Room Status Dropdown */}
        <select
          value={newRoom.roomStatusID}
          onChange={(e) => setNewRoom({ ...newRoom, roomStatusID: e.target.value })}
        >
          <option value="">Select Room Status</option>
          {roomStatuses.map((status) => (
            <option key={status.roomStatusID} value={status.roomStatusID}>
              {status.roomStatusName}
            </option>
          ))}
        </select>

        {/* Room Type Dropdown */}
        <select
          value={newRoom.roomTypeID}
          onChange={(e) => setNewRoom({ ...newRoom, roomTypeID: e.target.value })}
        >
          <option value="">Select Room Type</option>
          {roomTypes.map((type) => (
            <option key={type.roomTypeID} value={type.roomTypeID}>
              {type.name}
            </option>
          ))}
        </select>

        <button onClick={handleAddRoom}>Add Room</button>
      </div>

      {/* Display Rooms */}
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            {room.name} - {room.capacity} - {room.size} - {room.description} - {room.price} - {room.roomStatusName} - {room.roomTypeName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomManagerDashboard;
