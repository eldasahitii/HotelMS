import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const RecepsionistReservationDashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [reservationStatuses, setReservationStatuses] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [filterRoomType, setFilterRoomType] = useState('');
  const [filterReservationStatus, setFilterReservationStatus] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [loading, setLoading] = useState(false);
  const [newReservation, setNewReservation] = useState({
    roomID: '',
    checkInDate: '',
    checkOutDate: '',
    specialRequests: '',
    customerUserID: '',
  });
  const [editReservationID, setEditReservationID] = useState(null);
  const [editReservationData, setEditReservationData] = useState({
    checkInDate: '',
    checkOutDate: '',
    specialRequests: '',
  });

  const navigate = useNavigate();
  const api = axios.create({
    baseURL: 'https://localhost:7117/api/RoomReservation',
    withCredentials: true,
  });

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('https://localhost:7117/api/User/GetAllCustomers', { withCredentials: true });
      setCustomers(res.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers.');
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await axios.get('https://localhost:7117/api/Room/GetAllRooms', { withCredentials: true });
      setRooms(res.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to load rooms.');
    }
  };

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/GetAllReservations');
      const data = res.data.map((r) => ({
        reservationID: r.reservationID,
        roomTypeName: r.roomTypeName || 'Unknown',
        reservationStatusName: r.reservationStatusName || 'Unknown',
        checkInDate: r.checkInDate ? new Date(r.checkInDate).toLocaleDateString() : 'N/A',
        checkOutDate: r.checkOutDate ? new Date(r.checkOutDate).toLocaleDateString() : 'N/A',
        specialRequests: r.specialRequests || '',
        userID: r.userID || null,
        firstName: r.firstName || '',
        lastName: r.lastName || '',
        email: r.email || '',
        createdByReceptionistID: r.createdByReceptionistID || null,
        receptionistFirstName: r.receptionistFirstName || '',
        receptionistLastName: r.receptionistLastName || '',
        receptionistEmail: r.receptionistEmail || '',
      }));
      setReservations(data);
      setFilteredReservations(data);
      setRoomTypes([...new Set(data.map((r) => r.roomTypeName).filter(Boolean))]);
      setReservationStatuses([...new Set(data.map((r) => r.reservationStatusName).filter(Boolean))]);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      if (error.response) {
        if (error.response.status === 401) {
          toast.error('Unauthorized. Please log in again.');
          navigate('/login');
        } else {
          toast.error(`Server error: ${error.response.status} ${error.response.statusText}`);
        }
      } else {
        toast.error('Network error or server not reachable.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        await axios.get('https://localhost:7117/api/Auth/me', { withCredentials: true });
        await fetchCustomers();
        await fetchRooms();
        await fetchReservations();
      } catch (error) {
        toast.error('You must be logged in to view reservations.');
        navigate('/login');
      }
    };
    checkAuthAndLoad();
  }, [navigate]);

  useEffect(() => {
    let filtered = reservations;
    if (filterRoomType) {
      filtered = filtered.filter((r) => r.roomTypeName && r.roomTypeName.toLowerCase() === filterRoomType.toLowerCase());
    }
    if (filterReservationStatus) {
      filtered = filtered.filter((r) => r.reservationStatusName && r.reservationStatusName.toLowerCase() === filterReservationStatus.toLowerCase());
    }
    setFilteredReservations(filtered);
  }, [filterRoomType, filterReservationStatus, reservations]);

  return (
    <div>
      {/* Component UI Code */}
    </div>
  );
};

export default RecepsionistReservationDashboard;
