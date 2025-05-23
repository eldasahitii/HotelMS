import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';

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
      setMessage('Failed to load data.');
      setMessageType('danger');
    }
  };

  // Helper functions
  const getRoomType = (id) => roomTypes.find((type) => type.roomTypeID === id);
  const getRoomStatus = (id) => roomStatuses.find((status) => status.roomStatusID === id);

  // Filter available rooms by status name === "Available"
  const availableRooms = rooms.filter(
    (room) => getRoomStatus(room.roomStatusID)?.roomStatusName === 'Available'
  );

  // Rooms to display based on toggle
  const displayedRooms = showOnlyAvailable ? availableRooms : rooms;

  // Group displayed rooms by roomTypeID
  const roomsByType = displayedRooms.reduce((acc, room) => {
    if (!acc[room.roomTypeID]) acc[room.roomTypeID] = [];
    acc[room.roomTypeID].push(room);
    return acc;
  }, {});

  // Count available rooms by type for summary
  const availableRoomsCountByType = rooms.reduce((acc, room) => {
    const status = getRoomStatus(room.roomStatusID);
    if (status?.roomStatusName === 'Available') {
      acc[room.roomTypeID] = (acc[room.roomTypeID] || 0) + 1;
    }
    return acc;
  }, {});

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#f2f6fc' }}>
      <aside className="text-white p-4" style={{ width: '240px', backgroundColor: '#324b6b' }}>
        <h4 className="fw-bold mb-4">
          <i className="bi bi-building"></i> HotelMS
        </h4>
        <ul className="nav flex-column">
          <li className="nav-item">
            <i className="bi bi-house-door me-2"></i> Room Managing
          </li>
        </ul>
        <button className="btn btn-outline-light w-100 mt-2" onClick={() => navigate('/login')}>
          <i className="bi bi-box-arrow-right me-2"></i> Logout
        </button>
      </aside>

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

        {/* Toggle to show only available rooms */}
        <div className="mb-3">
          <label>
            <input
              type="checkbox"
              checked={showOnlyAvailable}
              onChange={() => setShowOnlyAvailable(!showOnlyAvailable)}
              className="me-2"
            />
            Show only available rooms
          </label>
        </div>

        {/* Available rooms count summary */}
        <div className="mb-3">
          <h5>Available Rooms by Type:</h5>
          {roomTypes.length === 0 ? (
            <p>No room types loaded.</p>
          ) : (
            <ul className="list-inline">
              {roomTypes.map((type) => (
                <li
                  key={type.roomTypeID}
                  className="list-inline-item me-3 px-3 py-1 border rounded"
                  style={{ backgroundColor: '#d1e7dd', color: '#0f5132' }}
                >
                  <strong>{type.name}</strong>: {availableRoomsCountByType[type.roomTypeID] || 0} free
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Rooms grouped by type */}
        <div className="card">
          <div className="card-header bg-primary text-white">
            <i className="bi bi-door-open me-2"></i> Rooms Overview
          </div>
          <div className="card-body p-0">
            <table className="table mb-0">
              <thead className="table-light">
                <tr>
                  <th>Room Number</th>
                  <th>Title</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Images</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(roomsByType).length > 0 ? (
                  Object.entries(roomsByType).map(([typeID, rooms]) => {
                    const type = getRoomType(parseInt(typeID));
                    return (
                      <React.Fragment key={typeID}>
                        {/* Type Header Row spanning all columns */}
                        <tr className="table-primary">
                          <td colSpan="7" className="fw-bold">
                            {type?.name || 'Unknown Type'} — Capacity: {type?.capacity || 'N/A'} — Price: $
                            {type?.price || 'N/A'}
                          </td>
                        </tr>
                        {/* Rows for each room under this type */}
                        {rooms.map((room) => {
                          const status = getRoomStatus(room.roomStatusID);
                          return (
                            <tr key={room.roomID}>
                              <td>{room.roomNumber}</td>
                              <td>{room.title}</td>
                              <td>{type?.capacity || 'N/A'}</td>
                              <td>{status?.roomStatusName || 'N/A'}</td>
                              <td>{type?.name || 'N/A'}</td>
                              <td>{type ? `$${type.price}` : 'N/A'}</td>
                              <td>
                                {type?.images && type.images.length > 0 ? (
                                  type.images.map((img, idx) => (
                                    <img
                                      key={idx}
                                      src={img.imageUrl}
                                      alt={`${type.name} Image ${idx + 1}`}
                                      style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '5px' }}
                                    />
                                  ))
                                ) : (
                                  <span>No Images</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">
                      No rooms to display.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RoomReceptionistDashboard;
