import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export default function UserRoomReservations() {
  const [reservations, setReservations] = useState([]);
  const [restaurantReservations, setRestaurantReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReservation, setEditingReservation] = useState(null);
  const [editingRestaurantRes, setEditingRestaurantRes] = useState(null);
  const [formData, setFormData] = useState({ checkInDate: "", checkOutDate: "", specialRequests: "" });
  const [restaurantFormData, setRestaurantFormData] = useState({ dateTime: "", status: "" });
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchReservations();
    fetchRestaurantReservations();
  }, []);

  async function fetchReservations() {
    setLoading(true);
    try {
      const res = await axios.get("https://localhost:7117/api/RoomReservation/GetUserReservations", { withCredentials: true });
      setReservations(res.data);
    } catch {
      toast.error("Failed to load reservations.");
    } finally {
      setLoading(false);
    }
  }

  const fetchRestaurantReservations = async () => {
    try {
      const res = await axios.get("/api/RestaurantResUser/getUserReservations", { withCredentials: true });
      setRestaurantReservations(res.data);
    } catch {
      toast.error("Failed to load restaurant reservations.");
    }
  };

  function startEdit(reservation) {
    setEditingReservation(reservation);
    setFormData({
      checkInDate: reservation.checkInDate.slice(0, 10),
      checkOutDate: reservation.checkOutDate.slice(0, 10),
      specialRequests: reservation.specialRequests || "",
    });
    setError("");
    setSuccessMsg("");
  }

  const startEditRestaurant = (res) => {
    setEditingRestaurantRes(res);
    setRestaurantFormData({ dateTime: res.dateTime.slice(0, 16), status: res.status });
  };

  function cancelEdit() {
    setEditingReservation(null);
    setError("");
    setSuccessMsg("");
  }

  const cancelEditRestaurant = () => {
    setEditingRestaurantRes(null);
    setRestaurantFormData({ dateTime: "", status: "" });
  };

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  const handleRestaurantInputChange = (e) => {
    const { name, value } = e.target;
    setRestaurantFormData((prev) => ({ ...prev, [name]: value }));
  };

  function toISOStringWithTime(dateStr) {
    return new Date(dateStr + "T00:00:00Z").toISOString();
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setFormLoading(true);

    if (formData.checkInDate >= formData.checkOutDate) {
      toast.error("Check-out date must be after check-in date.");
      setFormLoading(false);
      return;
    }

    try {
      await axios.put(`https://localhost:7117/api/RoomReservation/UpdateReservation/${editingReservation.reservationID}`, {
        CheckInDate: toISOStringWithTime(formData.checkInDate),
        CheckOutDate: toISOStringWithTime(formData.checkOutDate),
        SpecialRequests: formData.specialRequests,
      }, { withCredentials: true });

      toast.success("Reservation updated successfully.");
      setEditingReservation(null);
      fetchReservations();
    } catch (err) {
      if (err.response && err.response.data) {
        setError(typeof err.response.data === "string" ? err.response.data : JSON.stringify(err.response.data));
      } else {
        toast.error("Failed to update reservation.");
      }
    } finally {
      setFormLoading(false);
    }
  }

  const handleRestaurantUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/RestaurantResUser/updateUserReservation/${editingRestaurantRes.reservationID}`, restaurantFormData, { withCredentials: true });
      toast.success("Restaurant reservation updated.");
      setEditingRestaurantRes(null);
      fetchRestaurantReservations();
    } catch {
      toast.error("Failed to update restaurant reservation.");
    }
  };

  async function handleCancel(id) {
    const result = await Swal.fire({ title: 'Are you sure?', text: "Do you want to cancel this reservation?", icon: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'Yes, cancel it!' });
    if (!result.isConfirmed) return;

    try {
      await axios.delete(`https://localhost:7117/api/RoomReservation/CancelReservationUser`, { params: { id }, withCredentials: true });
      Swal.fire({ icon: 'success', title: 'Cancelled!', text: 'Reservation cancelled successfully.', timer: 2500, showConfirmButton: false });
      await fetchReservations();
    } catch {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Failed to cancel reservation.' });
    }
  }

  const cancelRestaurantReservation = async (id) => {
    const result = await Swal.fire({ title: "Cancel restaurant reservation?", icon: "warning", showCancelButton: true, confirmButtonText: "Yes" });
    if (!result.isConfirmed) return;

    try {
      await axios.delete(`/api/RestaurantResUser/cancelUserReservation?id=${id}`, { withCredentials: true });
      toast.success("Restaurant reservation cancelled.");
      fetchRestaurantReservations();
    } catch {
      toast.error("Failed to cancel restaurant reservation.");
    }
  };

  if (loading) return <div className="text-center text-muted py-5">Loading reservations...</div>;

  return (
    <div className="container my-5">
      <h2 className="mb-4 border-bottom pb-2 text-primary fw-bold">My Room Reservations</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      {editingReservation ? (
        <form onSubmit={handleEditSubmit} className="card p-4 mb-4">
          <h5 className="mb-3">Edit Reservation</h5>
          <div className="mb-3">
            <label className="form-label">Check-in Date</label>
            <input type="date" name="checkInDate" className="form-control" value={formData.checkInDate} onChange={handleInputChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Check-out Date</label>
            <input type="date" name="checkOutDate" className="form-control" value={formData.checkOutDate} onChange={handleInputChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Special Requests</label>
            <textarea name="specialRequests" className="form-control" value={formData.specialRequests} onChange={handleInputChange} rows={3} />
          </div>
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <button disabled={formLoading} type="submit" className="btn btn-primary">{formLoading ? "Saving..." : "Save Changes"}</button>
            <button type="button" className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
          </div>
        </form>
      ) : reservations.length === 0 ? (
        <p className="text-muted fst-italic">You have no room reservations.</p>
      ) : (
        <div className="row g-3">
          {reservations.map((res) => {
            const checkIn = new Date(res.checkInDate);
            const checkOut = new Date(res.checkOutDate);
            const nights = Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24));
             const isCancelled = res.status === "Cancelled";

            return (
              <div className="col-12 col-md-6" key={res.reservationID}>
                <div className="card p-3 h-100">
                  <h5>Room {res.roomName || "N/A"}</h5>
                  <p><strong>Check-in:</strong> {checkIn.toLocaleDateString()}</p>
                  <p><strong>Check-out:</strong> {checkOut.toLocaleDateString()}</p>
                  <p><strong>Duration:</strong> {nights} night{nights > 1 ? "s" : ""}</p>
                  <div className="d-grid gap-2">
             <button className="btn btn-outline-primary" onClick={() => startEdit(res)} disabled={isCancelled}>Edit</button>
                    <button className="btn btn-outline-secondary" onClick={() => handleCancel(res.reservationID)} disabled={isCancelled}>Cancel</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <hr className="my-5" />

      <h2 className="mb-4 border-bottom pb-2 text-primary fw-bold">My Restaurant Reservations</h2>

      {editingRestaurantRes ? (
        <form onSubmit={handleRestaurantUpdate} className="card p-4 mb-4">
          <h5 className="mb-3">Edit Restaurant Reservation</h5>
          <input name="dateTime" type="datetime-local" className="form-control mb-2" value={restaurantFormData.dateTime} onChange={handleRestaurantInputChange} required />
                 <select
                 name="status"
                 className="form-control mb-2"
                 value={restaurantFormData.status}
                 onChange={handleRestaurantInputChange}
                >
                 <option value="">Select Status</option>
                 <option value="Occupied">Occupied</option>
                 <option value="Completed">Completed</option>
                 <option value="Cancelled">Cancelled</option>
               </select>
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <button type="submit" className="btn btn-primary">Save</button>
            <button type="button" className="btn btn-secondary" onClick={cancelEditRestaurant}>Cancel</button>
          </div>
        </form>
      ) : restaurantReservations.length === 0 ? (
        <p className="text-muted fst-italic">You have no restaurant reservations.</p>
      ) : (
        <div className="row g-3">
          {restaurantReservations.map((res) => (
            <div className="col-12 col-md-6" key={res.reservationID}>
              <div className="card p-3 h-100">
                <h5>Table #{res.tableNumber || res.restaurantTableID}</h5>
                <p><strong>Date & Time:</strong> {new Date(res.dateTime).toLocaleString()}</p>
                <p><strong>Status:</strong> {res.status}</p>
                <div className="d-grid gap-2">
                  <button className="btn btn-outline-primary" onClick={() => startEditRestaurant(res)}>Edit</button>
                  <button className="btn btn-outline-secondary" onClick={() => cancelRestaurantReservation(res.reservationID)}>Cancel</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from 'react-toastify';
// import Swal from 'sweetalert2';

// export default function UserRoomReservations() {
//   const [reservations, setReservations] = useState([]);
//   const [restaurantReservations, setRestaurantReservations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingReservation, setEditingReservation] = useState(null);
//   const [editingRestaurantRes, setEditingRestaurantRes] = useState(null);
//   const [formData, setFormData] = useState({
//     checkInDate: "",
//     checkOutDate: "",
//     specialRequests: "", 
//   });
//   const [restaurantFormData, setRestaurantFormData] = useState({
//     dateTime: "",
//     status: ""
//   });

//   const [error, setError] = useState("");
//   const [successMsg, setSuccessMsg] = useState("");
//   const [formLoading, setFormLoading] = useState(false);

//   useEffect(() => {
//     fetchReservations();
//     fetchRestaurantReservations();
//   }, []);

//   async function fetchReservations() {
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         "https://localhost:7117/api/RoomReservation/GetUserReservations",
//         {
//           withCredentials: true,
//         }
//       );
//       setReservations(res.data);
//     } catch (err) {
//       toast.error("Failed to load reservations.");
//     } finally {
//       setLoading(false);
//     }
//   }

//    const fetchRestaurantReservations = async () => {
//     try {
//       const res = await axios.get("/api/RestaurantResUser/getUserReservations", {
//         withCredentials: true
//       });
//       setRestaurantReservations(res.data);
//     } catch {
//       toast.error("Failed to load restaurant reservations.");
//     }
//   };

//   function startEdit(reservation) {
//     setEditingReservation(reservation);
//     setFormData({
//       checkInDate: reservation.checkInDate.slice(0, 10),
//       checkOutDate: reservation.checkOutDate.slice(0, 10),
//       specialRequests: reservation.specialRequests || "",
//     });
//     setError("");
//     setSuccessMsg("");
//   }

//   const startEditRestaurant = (res) => {
//     setEditingRestaurantRes(res);
//     setRestaurantFormData({
//       dateTime: res.dateTime.slice(0, 16),
//       status: res.status
//     });
//   };
//   function cancelEdit() {
//     setEditingReservation(null);
//     setError("");
//     setSuccessMsg("");
//   }
//   const cancelEditRestaurant = () => {
//   setEditingRestaurantRes(null);
//   setRestaurantFormData({ dateTime: "", status: "" });
// };


//   function handleInputChange(e) {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   }
//   const handleRestaurantInputChange = (e) => {
//     const { name, value } = e.target;
//     setRestaurantFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   function toISOStringWithTime(dateStr) {
//     return new Date(dateStr + "T00:00:00Z").toISOString();
//   }

// async function handleEditSubmit(e) {
//   e.preventDefault();
//   setError("");
//   setSuccessMsg("");
//   setFormLoading(true);

//   if (formData.checkInDate >= formData.checkOutDate) {
//     toast.error("Check-out date must be after check-in date.");
//     setFormLoading(false);
//     return;
//   }

//   function toISOStringWithTime(dateStr) {
//     return new Date(dateStr + "T00:00:00Z").toISOString();
//   }

//   try {
//     await axios.put(
//       `https://localhost:7117/api/RoomReservation/UpdateReservation/${editingReservation.reservationID}`,
//       {
//         CheckInDate: toISOStringWithTime(formData.checkInDate),
//         CheckOutDate: toISOStringWithTime(formData.checkOutDate),
//         SpecialRequests: formData.specialRequests,
//       },
//       { withCredentials: true }
//     );

//     toast.success("Reservation updated successfully.");
//     setEditingReservation(null);
//     fetchReservations();
//   } catch (err) {
//     if (err.response && err.response.data) {
//       setError(
//         typeof err.response.data === "string"
//           ? err.response.data
//           : JSON.stringify(err.response.data)
//       );
//     } else {
//       toast.error("Failed to update reservation.");
//     }
//   } finally {
//     setFormLoading(false);
//   }
// }

// const handleRestaurantUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put(`/api/RestaurantResUser/updateUserReservation/${editingRestaurantRes.reservationID}`, {
//         dateTime: restaurantFormData.dateTime,
//         status: restaurantFormData.status
//       }, { withCredentials: true });

//       toast.success("Restaurant reservation updated.");
//       setEditingRestaurantRes(null);
//       fetchRestaurantReservations();
//     } catch {
//       toast.error("Failed to update restaurant reservation.");
//     }
//   };


// async function handleCancel(id) {
//   const result = await Swal.fire({
//     title: 'Are you sure?',
//     text: "Do you want to cancel this reservation?",
//     icon: 'warning',
//     showCancelButton: true,
//     confirmButtonColor: '#3085d6',
//     cancelButtonColor: '#d33',
//     confirmButtonText: 'Yes, cancel it!',
//   });

//   if (!result.isConfirmed) return;

//   try {
//     await axios.delete(
//       `https://localhost:7117/api/RoomReservation/CancelReservationUser`,
//       {
//         params: { id },
//         withCredentials: true,
//       }
//     );

//     Swal.fire({
//       icon: 'success',
//       title: 'Cancelled!',
//       text: 'Reservation cancelled successfully.',
//       timer: 2500,
//       showConfirmButton: false,
//     });

//     await fetchReservations();

//   } catch (error) {
//     Swal.fire({
//       icon: 'error',
//       title: 'Oops...',
//       text: 'Failed to cancel reservation.',
//     });
//   }
// }
//   const cancelRestaurantReservation = async (id) => {
//     const result = await Swal.fire({
//       title: "Cancel restaurant reservation?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes"
//     });

//     if (!result.isConfirmed) return;

//     try {
//       await axios.delete(`/api/RestaurantResUser/cancelUserReservation?id=${id}`, {
//         withCredentials: true
//       });
//       toast.success("Restaurant reservation cancelled.");
//       fetchRestaurantReservations();
//     } catch {
//       toast.error("Failed to cancel restaurant reservation.");
//     }
//   };

//   if (loading)
//     return <p style={{ color: "#555", fontStyle: "italic" }}>Loading reservations...</p>;

//   return (
//     <div
//       className="container my-5"
//       style={{
//         maxWidth: 700,
//         fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//         background:
//           "linear-gradient(135deg, #f9f7f1 0%, #e6f0f8 100%)",
//         padding: "30px 20px",
//         borderRadius: 12,
//         boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
//         minHeight: "80vh",
//       }}
//     >
//       <h2
//         className="mb-4"
//         style={{
//           color: "#2f4f4f",
//           fontWeight: "700",
//           borderBottom: "3px solid #6c8ea4",
//           paddingBottom: 8,
//           textShadow: "1px 1px 1px rgba(255,255,255,0.7)",
//         }}
//       >
//         My Room Reservations
//       </h2>

//       {error && (
//         <div
//           className="alert alert-danger"
//           style={{
//             backgroundColor: "#f8d7da",
//             color: "#842029",
//             borderRadius: 6,
//             boxShadow: "inset 0 0 10px #f5c2c7",
//           }}
//         >
//           {error}
//         </div>
//       )}
//       {successMsg && (
//         <div
//           className="alert alert-success"
//           style={{
//             backgroundColor: "#d1e7dd",
//             color: "#0f5132",
//             borderRadius: 6,
//             boxShadow: "inset 0 0 10px #b7dbb8",
//           }}
//         >
//           {successMsg}
//         </div>
//       )}

//       {editingReservation ? (
//         <form
//           onSubmit={handleEditSubmit}
//           className="mb-4 p-4 rounded"
//           style={{
//             backgroundColor: "#ffffffcc",
//             boxShadow: "0 2px 12px rgba(44,62,80,0.12)",
//             borderRadius: 12,
//           }}
//         >
//           <h5
//             style={{
//               color: "#3e4e59",
//               fontWeight: "600",
//               marginBottom: 20,
//               letterSpacing: "0.04em",
//             }}
//           >
//             Edit Reservation
//           </h5>

//           <div className="mb-3">
//             <label className="form-label" style={{ color: "#3e4e59" }}>
//               Check-in Date
//             </label>
//             <input
//               type="date"
//               name="checkInDate"
//               className="form-control"
//               value={formData.checkInDate}
//               onChange={handleInputChange}
//               required
//               style={{ borderColor: "#6c8ea4" }}
//             />
//           </div>

//           <div className="mb-3">
//             <label className="form-label" style={{ color: "#3e4e59" }}>
//               Check-out Date
//             </label>
//             <input
//               type="date"
//               name="checkOutDate"
//               className="form-control"
//               value={formData.checkOutDate}
//               onChange={handleInputChange}
//               required
//               style={{ borderColor: "#6c8ea4" }}
//             />
//           </div>

//           <div className="mb-3">
//             <label className="form-label" style={{ color: "#3e4e59" }}>
//               Special Requests
//             </label>
//             <textarea
//               name="specialRequests"
//               className="form-control"
//               value={formData.specialRequests}
//               onChange={handleInputChange}
//               rows={3}
//               style={{ borderColor: "#6c8ea4" }}
//             />
//           </div>

//           <div className="d-flex gap-2">
//             <button
//               disabled={formLoading}
//               type="submit"
//               className="btn"
//               style={{
//                 backgroundColor: "#6c8ea4",
//                 color: "#fff",
//                 fontWeight: "600",
//                 flex: 1,
//                 borderRadius: 6,
//                 border: "none",
//                 transition: "background-color 0.3s ease",
//                 boxShadow: "0 2px 6px rgba(108,142,164,0.5)",
//               }}
//               onMouseEnter={(e) =>
//                 (e.currentTarget.style.backgroundColor = "#54778a")
//               }
//               onMouseLeave={(e) =>
//                 (e.currentTarget.style.backgroundColor = "#6c8ea4")
//               }
//             >
//               {formLoading ? "Saving..." : "Save Changes"}
//             </button>
//             <button
//               type="button"
//               className="btn btn-outline-secondary flex-grow-1"
//               onClick={cancelEdit}
//               style={{ borderRadius: 6, fontWeight: "600" }}
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       ) : reservations.length === 0 ? (
//         <p style={{ color: "#536878", fontStyle: "italic" }}>
//           You have no room reservations.
//         </p>
//       ) : (
//         <div>
//           {reservations.map((res) => {
//             const checkIn = new Date(res.checkInDate);
//             const checkOut = new Date(res.checkOutDate);
//             const nights = Math.round(
//               (checkOut - checkIn) / (1000 * 60 * 60 * 24)
//             );

//             return (
//               <div
//                 key={res.reservationID}
//                 className="card mb-3"
//                 style={{
//                   boxShadow: "0 4px 15px rgba(108, 142, 164, 0.25)",
//                   borderRadius: 12,
//                   padding: 25,
//                   backgroundColor: "#e9f0f7",
//                   border: "1px solid #b0c4d1",
//                 }}
//               >
//                 <h5 style={{ color: "#2f4f4f", marginBottom: 8 }}>
//                   Room {res.roomName || "N/A"}
//                 </h5>
//                 <p className="mb-1" style={{ color: "#47585a" }}>
//                   <strong>Check-in:</strong> {checkIn.toLocaleDateString()}
//                 </p>
//                 <p className="mb-1" style={{ color: "#47585a" }}>
//                   <strong>Check-out:</strong> {checkOut.toLocaleDateString()}
//                 </p>
//                 <p className="mb-1" style={{ color: "#47585a" }}>
//                   <strong>Duration:</strong> {nights} night{nights > 1 ? "s" : ""}
//                 </p>

//                 <div className="d-flex gap-3 mt-4">
//                   <button
//                     className="btn"
//                     style={{
//                       flex: 1,
//                       borderRadius: 6,
//                       border: "1.8px solid #54778a",
//                       backgroundColor: "#a4bdd9",
//                       color: "#2f4f4f",
//                       fontWeight: "600",
//                       transition: "background-color 0.3s ease, box-shadow 0.3s ease",
//                       boxShadow: "0 2px 8px rgba(84, 119, 138, 0.4)",
//                     }}
//                     onClick={() => startEdit(res)}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.backgroundColor = "#7b9ab7";
//                       e.currentTarget.style.boxShadow =
//                         "0 4px 12px rgba(84, 119, 138, 0.7)";
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.backgroundColor = "#a4bdd9";
//                       e.currentTarget.style.boxShadow =
//                         "0 2px 8px rgba(84, 119, 138, 0.4)";
//                     }}
//                   >
//                     Edit
//                   </button>

//                   <button
//                     className="btn btn-outline-secondary flex-grow-1"
//                     onClick={() => handleCancel(res.reservationID)}
//                     style={{ fontWeight: "600", borderRadius: 6 }}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       <hr className="my-5" />
//       <h2 className="mb-4"  style={{
//     color: "#2f4f4f",
//     fontWeight: "700",
//     borderBottom: "3px solid #6c8ea4",
//     paddingBottom: 8,
//     textShadow: "1px 1px 1px rgba(255,255,255,0.7)",
//     fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
//   }}>My Restaurant Reservations</h2>

//       {editingRestaurantRes ? (
//         <form onSubmit={handleRestaurantUpdate} className="card p-4 mb-4 shadow">
//           <h5 className="mb-3">Edit Restaurant Reservation</h5>
//           <input name="dateTime" type="datetime-local" className="form-control mb-2" value={restaurantFormData.dateTime} onChange={handleRestaurantInputChange} required />
//           <input name="status" className="form-control mb-3" placeholder="Status" value={restaurantFormData.status} onChange={handleRestaurantInputChange} required />
//           <div className="d-flex gap-2">
//             <button type="submit" className="btn btn-primary">Save</button>
//             <button type="button" className="btn btn-secondary" onClick={cancelEditRestaurant}>Cancel</button>
//           </div>
//         </form>
//       ) : (
//         restaurantReservations.length === 0 ? <p>You have no restaurant reservations.</p> :
//           restaurantReservations.map((res) => (
//             <div key={res.reservationID}style={{
//     boxShadow: "0 4px 15px rgba(108, 142, 164, 0.25)",
//     borderRadius: 12,
//     padding: 25,
//     backgroundColor: "#e9f0f7",
//     border: "1px solid #b0c4d1",
//     fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//   }}
// >
//   <h5 style={{ color: "#2f4f4f", marginBottom: 8 }}>
//     Table #{res.tableNumber || res.restaurantTableID}
//   </h5>
//   <p className="mb-1" style={{ color: "#47585a" }}>
//     <strong>Date & Time:</strong> {new Date(res.dateTime).toLocaleString()}
//   </p>
//   <p className="mb-1" style={{ color: "#47585a" }}>
//     <strong>Status:</strong> {res.status}
//   </p>

//   <div className="d-flex gap-2 mt-3">
//     <button
//       className="btn"
//       style={{
//         flex: 1,
//         borderRadius: 6,
//         border: "1.8px solid #54778a",
//         backgroundColor: "#a4bdd9",
//         color: "#2f4f4f",
//         fontWeight: "600",
//         transition: "background-color 0.3s ease, box-shadow 0.3s ease",
//         boxShadow: "0 2px 8px rgba(84, 119, 138, 0.4)",
//       }}
//       onClick={() => startEditRestaurant(res)}
//       onMouseEnter={(e) => {
//         e.currentTarget.style.backgroundColor = "#7b9ab7";
//         e.currentTarget.style.boxShadow =
//           "0 4px 12px rgba(84, 119, 138, 0.7)";
//       }}
//       onMouseLeave={(e) => {
//         e.currentTarget.style.backgroundColor = "#a4bdd9";
//         e.currentTarget.style.boxShadow =
//           "0 2px 8px rgba(84, 119, 138, 0.4)";
//       }}
//     >
//       Edit
//     </button>
//     <button
//       className="btn btn-outline-secondary flex-grow-1"
//       onClick={() => cancelRestaurantReservation(res.reservationID)}
//       style={{ fontWeight: "600", borderRadius: 6 }}
//     >
//       Cancel
//     </button>
//   </div>
// </div>
//           ))
//       )}
//     </div>
//   );
// }
