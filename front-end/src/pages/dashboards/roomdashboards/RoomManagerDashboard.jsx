import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RoomManagerDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({
    roomType: '',
    price: '',
    capacity: '',
    status: ''
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get('https://localhost:7117/api/Room/GetAllRooms', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

const handleAddRoom = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Handle missing token case
    console.error('Token is missing');
    return;
  }

  try {
    const response = await axios.post(
      'https://localhost:7117/api/Room/AddRoom',
      newRoom, // Use newRoom here
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('Room added successfully:', response.data);
  } catch (error) {
    console.error('Error adding room:', error.response);
  }
};


  return (
    <div>
      <h1>Room Manager Dashboard</h1>

      {/* Add Room Form */}
      <div>
        <input
          type="text"
          placeholder="Room Type"
          value={newRoom.roomType}
          onChange={(e) => setNewRoom({ ...newRoom, roomType: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newRoom.price}
          onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })}
        />
        <input
          type="number"
          placeholder="Capacity"
          value={newRoom.capacity}
          onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
        />
        <input
          type="text"
          placeholder="Status"
          value={newRoom.status}
          onChange={(e) => setNewRoom({ ...newRoom, status: e.target.value })}
        />
        <button onClick={handleAddRoom}>Add Room</button>
      </div>

      {/* Display Rooms */}
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            {room.roomType} - {room.price} - {room.capacity} - {room.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomManagerDashboard;
