import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const RoomReceptionistDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomStatuses, setRoomStatuses] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [roomsRes, roomTypesRes, roomStatusesRes] = await Promise.all([
        axios.get('https://localhost:7117/api/Room/GetAllRooms', { withCredentials: true }),
        axios.get('https://localhost:7117/api/RoomType/GetAllRoomTypes', { withCredentials: true }),
        axios.get('https://localhost:7117/api/RoomStatus/getAllRoomsStatuses', {
          withCredentials: true,
          params: { role: 'RoomRecepsionist' },
        }),
      ]);
      setRooms(roomsRes.data);
      setRoomTypes(roomTypesRes.data);
      setRoomStatuses(roomStatusesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data.');

    }
  };

  const getRoomType = (id) => roomTypes.find((type) => type.roomTypeID === id);
  const getRoomStatus = (id) => roomStatuses.find((status) => status.roomStatusID === id);

  const filteredRooms = showOnlyAvailable
    ? rooms.filter((room) => getRoomStatus(room.roomStatusID)?.roomStatusName === 'Available')
    : rooms;

  const groupedRooms = roomTypes.map((type) => {
    const roomsOfType = filteredRooms.filter((room) => room.roomTypeID === type.roomTypeID);
    const availableRooms = rooms.filter(
      (room) =>
        room.roomTypeID === type.roomTypeID &&
        getRoomStatus(room.roomStatusID)?.roomStatusName === 'Available'
    );
    return { type, rooms: roomsOfType, availableCount: availableRooms.length };
  });

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#f2f6fc' }}>
      {/* Sidebar */}
      <aside className="text-white p-4" style={{ width: '240px', backgroundColor: '#324b6b' }}>
        <h4 className="fw-bold mb-4">
          <i className="bi bi-building"></i> HotelMS
        </h4>
        <ul className="nav flex-column mb-4">
          <li className="nav-item mb-2">
          </li>
          <li className="nav-item mb-2">
            <button
              className="btn btn-outline-light w-100 text-start"
              onClick={() => navigate('/recepsionist-reservations')}
            >
              <i className="bi bi-calendar-check me-2"></i> Reservations
            </button>
          </li>
        </ul>
         <button
          className="btn btn-outline-light w-100 text-start"
          onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
         }}>
          
  <i className="bi bi-box-arrow-right me-2"></i> Logout
</button>

      </aside>

      {/* Main content */}
      <main className="flex-grow-1 p-4">
        <h2 className="fw-bold text-primary mb-4">
          <i className="bi bi-person-lines-fill me-2"></i> Room Receptionist Dashboard
        </h2>

        {message && (
          <div className={`alert alert-${messageType} alert-dismissible fade show`} role="alert">
            {message}
            <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
          </div>
        )}

        <div className="form-check form-switch mb-4">
          <input
            className="form-check-input"
            type="checkbox"
            id="availableToggle"
            checked={showOnlyAvailable}
            onChange={() => setShowOnlyAvailable(!showOnlyAvailable)}
          />
          <label className="form-check-label" htmlFor="availableToggle">
            Show only available rooms
          </label>
        </div>

        {groupedRooms.map(({ type, rooms, availableCount }) => (
          <div className="card mb-4 shadow-sm" key={type.roomTypeID}>
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <div>
                <strong>{type.name}</strong> — Capacity: {type.capacity} — Price: ${type.price}
              </div>
              <span className="badge bg-success">{availableCount} available</span>
            </div>
            <div className="card-body">
              {type.images && type.images.length > 0 && (
                <div className="mb-3 d-flex flex-wrap">
                  {type.images.map((img, index) => (
                    <img
                      key={index}
                      src={img.imageUrl}
                      alt={`${type.name} ${index}`}
                      className="me-2 mb-2"
                      style={{ width: '100px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  ))}
                </div>
              )}
              <h6 className="fw-bold mb-2">Room Numbers:</h6>
              <div className="d-flex flex-wrap">
                {rooms.length > 0 ? (
                  rooms.map((room) => {
                    const status = getRoomStatus(room.roomStatusID);
                    const isAvailable = status?.roomStatusName === 'Available';
                    return (
                      <span
                        key={room.roomID}
                        className={`badge me-2 mb-2 p-2 bg-${isAvailable ? 'success' : 'secondary'}`}
                        style={{ fontSize: '0.9rem' }}
                      >
                        {room.roomNumber} ({status?.roomStatusName})
                      </span>
                    );
                  })
                ) : (
                  <p className="text-muted">No rooms of this type.</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default RoomReceptionistDashboard;
