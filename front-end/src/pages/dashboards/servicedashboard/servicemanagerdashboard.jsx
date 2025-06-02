
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';
// import { useNavigate } from "react-router-dom";

// export default function ServiceManagerDashboard() {
//   const [services, setServices] = useState([]);
//   const [newService, setNewService] = useState({ name: '', description: '', heroImageUrl: '' });
//   const [editingService, setEditingService] = useState(null);
//   const [editServiceData, setEditServiceData] = useState({ name: '', description: '', heroImageUrl: '' });

//   const [message, setMessage] = useState('');
//   const [messageType, setMessageType] = useState('');

//   const fetchServices = async () => {
//     try {
//       const res = await axios.get("/api/HotelService/getAll");
//       setServices(res.data);
//     } catch {
//       setMessage("Error fetching services.");
//       setMessageType("danger");
//     }
//   };

//   useEffect(() => {
//     fetchServices();
//   }, []);

//   const handleAddService = async () => {
//     try {
//       await axios.post("/api/HotelService/add", newService);
//       setMessage("Service added successfully.");
//       setMessageType("success");
//       setNewService({ name: '', description: '', heroImageUrl: '' });
//       fetchServices();
//     } catch {
//       setMessage("Failed to add service.");
//       setMessageType("danger");
//     }
//   };

//   const handleDeleteService = async (id) => {
//     try {
//       await axios.delete(`/api/HotelService/delete?id=${id}`);
//       setMessage("Service deleted.");
//       setMessageType("success");
//       fetchServices();
//     } catch {
//       setMessage("Failed to delete service.");
//       setMessageType("danger");
//     }
//   };

//   const openEditService = (service) => {
//     setEditingService(service);
//     setEditServiceData({
//       name: service.name,
//       description: service.description,
//       heroImageUrl: service.heroImageUrl || ''
//     });
//   };

//   const handleUpdateService = async () => {
//     try {
//       await axios.put(`/api/HotelService/update?id=${editingService.serviceID}`, editServiceData);
//       setMessage("Service updated.");
//       setMessageType("success");
//       setEditingService(null);
//       fetchServices();
//     } catch {
//       setMessage("Failed to update service.");
//       setMessageType("danger");
//     }
//   };

//   const navigate = useNavigate();
//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/login');
//   };

//   return (
//     <div className="d-flex min-vh-100" style={{ backgroundColor: '#f2f6fc' }}>
//       <aside className="text-white p-4" style={{ width: '240px', backgroundColor: '#324b6b' }}>
//         <h4 className="fw-bold mb-4"><i className="bi bi-building"></i> HotelMS</h4>
//         <ul className="nav flex-column">
//           <li className="nav-item">
//             <span className="nav-link text-white fw-bold">
//               <i className="bi bi-gear-fill me-2"></i>Service Management
//             </span>
//           </li>
//           <hr className="text-white" />
//           <button className="btn btn-outline-light w-100" onClick={handleLogout}>
//             <i className="bi bi-box-arrow-right me-2"></i> Logout
//           </button>
//         </ul>
//       </aside>

//       <main className="flex-grow-1 p-4">
//         <h2 className="fw-bold text-primary mb-4">
//           <i className="bi bi-tools me-2"></i>Service Manager
//         </h2>

//         {message && (
//           <div className={`alert alert-${messageType} alert-dismissible fade show`} role="alert">
//             {message}
//             <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
//           </div>
//         )}

//         {/* Add Service Form */}
//         <div className="card mb-4">
//           <div className="card-header bg-success text-white">
//             <i className="bi bi-plus-circle me-2"></i>Add New Service
//           </div>
//           <div className="card-body">
//             <input className="form-control mb-2" placeholder="Name" value={newService.name} onChange={e => setNewService({ ...newService, name: e.target.value })} />
//             <input className="form-control mb-2" placeholder="Description" value={newService.description} onChange={e => setNewService({ ...newService, description: e.target.value })} />
//             <input className="form-control mb-2" placeholder="Hero Image URL" value={newService.heroImageUrl} onChange={e => setNewService({ ...newService, heroImageUrl: e.target.value })} />
//             <button className="btn btn-success w-100" onClick={handleAddService}>Add Service</button>
//           </div>
//         </div>

//         {/* List of Services */}
//         <div className="card">
//           <div className="card-header bg-primary text-white">
//             <i className="bi bi-list-ul me-2"></i>All Services
//           </div>
//           <div className="card-body p-0">
//             <table className="table mb-0">
//               <thead className="table-light">
//                 <tr>
//                   <th>#</th>
//                   <th>Name</th>
//                   <th>Description</th>
//                   <th>Image</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {services.map((service, index) => (
//                   <tr key={service.serviceID || index}>
//                     <td>{index + 1}</td>
//                     <td>{service.name}</td>
//                     <td>{service.description}</td>
//                     <td><img src={service.heroImageUrl} alt={service.name} width="100" style={{ objectFit: 'cover' }} /></td>
//                     <td>
//                       <button className="btn btn-sm btn-outline-danger me-2" onClick={() => handleDeleteService(service.serviceID)}>
//                         <i className="bi bi-trash"></i>
//                       </button>
//                       <button className="btn btn-sm btn-outline-secondary" onClick={() => openEditService(service)}>
//                         <i className="bi bi-pencil-square"></i>
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Edit Service Form */}
//         {editingService && (
//           <div className="card mt-4">
//             <div className="card-header bg-warning text-dark">
//               <i className="bi bi-pencil-square me-2"></i>Edit Service
//             </div>
//             <div className="card-body">
//               <input className="form-control mb-2" value={editServiceData.name} onChange={e => setEditServiceData({ ...editServiceData, name: e.target.value })} />
//               <input className="form-control mb-2" value={editServiceData.description} onChange={e => setEditServiceData({ ...editServiceData, description: e.target.value })} />
//               <input className="form-control mb-2" placeholder="Hero Image URL" value={editServiceData.heroImageUrl} onChange={e => setEditServiceData({ ...editServiceData, heroImageUrl: e.target.value })} />
//               <button className="btn btn-primary me-2" onClick={handleUpdateService}>
//                 <i className="bi bi-check2"></i> Save
//               </button>
//               <button className="btn btn-secondary" onClick={() => setEditingService(null)}>
//                 <i className="bi bi-x"></i> Cancel
//               </button>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react"; 
// import axios from "axios";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';
// import { useNavigate } from "react-router-dom";

// export default function ServiceManagerDashboard() {
//   const [services, setServices] = useState([]);
//   const [newService, setNewService] = useState({ name: '', description: '', heroImageUrl: '' });
//   const [newServiceImage, setNewServiceImage] = useState(null);

//   const [editingService, setEditingService] = useState(null);
//   const [editServiceData, setEditServiceData] = useState({ name: '', description: '', heroImageUrl: '' });
//   const [editServiceImage, setEditServiceImage] = useState(null);

//   const [message, setMessage] = useState('');
//   const [messageType, setMessageType] = useState('');

//   const fetchServices = async () => {
//     try {
//       const res = await axios.get("/api/HotelService/getAll");
//       setServices(res.data);
//     } catch {
//       setMessage("Error fetching services.");
//       setMessageType("danger");
//     }
//   };

//   useEffect(() => {
//     fetchServices();
//   }, []);

//   const handleAddService = async () => {
//     try {
//       const formData = new FormData();
     
//       formData.append("name", newService.name);
//       formData.append("description", newService.description);
//       console.log(URL.createObjectURL(newServiceImage))
//     //   if (newServiceImage) {
//     //     formData.append("heroImage", newServiceImage);
//     //   }

//       await axios.post("/api/HotelService/add", {
//         Name: newService.name,
//         Description: newService.description,
//         HeroImageUrl: ""
//       }, {
//         headers: { "Content-Type": "application/json" },
//       });

//       setMessage("Service added successfully.");
//       setMessageType("success");
//       setNewService({ name: '', description: '', heroImageUrl: '' });
//       setNewServiceImage(null);
//       fetchServices();
//     } catch (error) {
//     console.error("Error adding service:", error);
//     setMessage("Failed to add service.");
//     setMessageType("danger");
//   }
//   };

//   const handleDeleteService = async (id) => {
//     try {
//       await axios.delete(`/api/HotelService/delete?id=${id}`);
//       setMessage("Service deleted.");
//       setMessageType("success");
//       fetchServices();
//     } catch {
//       setMessage("Failed to delete service.");
//       setMessageType("danger");
//     }
//   };

//   const openEditService = (service) => {
//     setEditingService(service);
//     setEditServiceData({
//       name: service.name,
//       description: service.description,
//       heroImageUrl: service.heroImageUrl || ''
//     });
//     setEditServiceImage(null);
//   };

//   const handleUpdateService = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("name", editServiceData.name);
//       formData.append("description", editServiceData.description);
//       if (editServiceImage) {
//         formData.append("heroImage", editServiceImage);
//       }

//       await axios.put(`/api/HotelService/update?id=${editingService.serviceID}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setMessage("Service updated.");
//       setMessageType("success");
//       setEditingService(null);
//       setEditServiceImage(null);
//       fetchServices();
//     } catch {
//       setMessage("Failed to update service.");
//       setMessageType("danger");
//     }
//   };

//   const handleNewImageChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setNewServiceImage(e.target.files[0]);
//     }
//   };

//   const handleEditImageChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setEditServiceImage(e.target.files[0]);
//     }
//   };

//   const navigate = useNavigate();
//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/login');
//   };

//   return (
//     <div className="d-flex min-vh-100" style={{ backgroundColor: '#f2f6fc' }}>
//       <aside className="text-white p-4" style={{ width: '240px', backgroundColor: '#324b6b' }}>
//         <h4 className="fw-bold mb-4"><i className="bi bi-building"></i> HotelMS</h4>
//         <ul className="nav flex-column">
//           <li className="nav-item">
//             <span className="nav-link text-white fw-bold">
//               <i className="bi bi-gear-fill me-2"></i>Service Management
//             </span>
//           </li>
//           <hr className="text-white" />
//           <button className="btn btn-outline-light w-100" onClick={handleLogout}>
//             <i className="bi bi-box-arrow-right me-2"></i> Logout
//           </button>
//         </ul>
//       </aside>

//       <main className="flex-grow-1 p-4">
//         <h2 className="fw-bold text-primary mb-4">
//           <i className="bi bi-tools me-2"></i>Service Manager
//         </h2>

//         {message && (
//           <div className={`alert alert-${messageType} alert-dismissible fade show`} role="alert">
//             {message}
//             <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
//           </div>
//         )}

//         {/* Add Service Form */}
//         <div className="card mb-4">
//           <div className="card-header bg-success text-white">
//             <i className="bi bi-plus-circle me-2"></i>Add New Service
//           </div>
//           <div className="card-body">
//             <input 
//               className="form-control mb-2" 
//               placeholder="Name" 
//               value={newService.name} 
//               onChange={e => setNewService({ ...newService, name: e.target.value })} 
//             />
//             <input 
//               className="form-control mb-2" 
//               placeholder="Description" 
//               value={newService.description} 
//               onChange={e => setNewService({ ...newService, description: e.target.value })} 
//             />
//             <input 
//               type="file" 
//               accept="image/*" 
//               className="form-control mb-2"
//               onChange={handleNewImageChange} 
//             />
//             {newServiceImage && (
//               <img 
//                 src={URL.createObjectURL(newServiceImage)} 
//                 alt="Preview" 
//                 width="100" 
//                 style={{ objectFit: "cover", marginBottom: "10px" }} 
//               />
//             )}
//             <button className="btn btn-success w-100" onClick={handleAddService}>Add Service</button>
//           </div>
//         </div>

//         {/* List of Services */}
//         <div className="card">
//           <div className="card-header bg-primary text-white">
//             <i className="bi bi-list-ul me-2"></i>All Services
//           </div>
//           <div className="card-body p-0">
//             <table className="table mb-0">
//               <thead className="table-light">
//                 <tr>
//                   <th>#</th>
//                   <th>Name</th>
//                   <th>Description</th>
//                   <th>Image</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {services.map((service, index) => (
//                   <tr key={service.serviceID || index}>
//                     <td>{index + 1}</td>
//                     <td>{service.name}</td>
//                     <td>{service.description}</td>
//                     <td>
//                       {service.heroImageUrl && (
//                         <img 
//                           src={service.heroImageUrl} 
//                           alt={service.name} 
//                           width="100" 
//                           style={{ objectFit: 'cover' }} 
//                         />
//                       )}
//                     </td>
//                     <td>
//                       <button 
//                         className="btn btn-sm btn-outline-danger me-2" 
//                         onClick={() => handleDeleteService(service.serviceID)}
//                       >
//                         <i className="bi bi-trash"></i>
//                       </button>
//                       <button 
//                         className="btn btn-sm btn-outline-secondary" 
//                         onClick={() => openEditService(service)}
//                       >
//                         <i className="bi bi-pencil-square"></i>
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Edit Service Form */}
//         {editingService && (
//           <div className="card mt-4">
//             <div className="card-header bg-warning text-dark">
//               <i className="bi bi-pencil-square me-2"></i>Edit Service
//             </div>
//             <div className="card-body">
//               <input 
//                 className="form-control mb-2" 
//                 value={editServiceData.name} 
//                 onChange={e => setEditServiceData({ ...editServiceData, name: e.target.value })} 
//               />
//               <input 
//                 className="form-control mb-2" 
//                 value={editServiceData.description} 
//                 onChange={e => setEditServiceData({ ...editServiceData, description: e.target.value })} 
//               />
//               <input 
//                 type="file" 
//                 accept="image/*" 
//                 className="form-control mb-2"
//                 onChange={handleEditImageChange} 
//               />
//               {editServiceImage ? (
//                 <img 
//                   src={URL.createObjectURL(editServiceImage)} 
//                   alt="Preview" 
//                   width="100" 
//                   style={{ objectFit: "cover", marginBottom: "10px" }} 
//                 />
//               ) : (
//                 editServiceData.heroImageUrl && (
//                   <img 
//                     src={editServiceData.heroImageUrl} 
//                     alt="Current" 
//                     width="100" 
//                     style={{ objectFit: "cover", marginBottom: "10px" }} 
//                   />
//                 )
//               )}
//               <button className="btn btn-primary me-2" onClick={handleUpdateService}>
//                 <i className="bi bi-check2"></i> Save
//               </button>
//               <button className="btn btn-secondary" onClick={() => setEditingService(null)}>
//                 <i className="bi bi-x"></i> Cancel
//               </button>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const api = axios.create({
  baseURL: "https://localhost:7117/api",
  withCredentials: true,
});

export default function ServiceManagerDashboard() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newService, setNewService] = useState({
    name: "",
    description: "",
    heroImageUrl: "",
  });
  const [newServiceImage, setNewServiceImage] = useState(null);

  const [editingServiceID, setEditingServiceID] = useState(null);
  const [editServiceData, setEditServiceData] = useState({
    name: "",
    description: "",
    heroImageUrl: "",
  });
  const [editServiceImage, setEditServiceImage] = useState(null);

  // Fetch all services
  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await api.get("/HotelService/getAll");
      setServices(response.data);
    } catch (error) {
      toast.error("Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  // Handle input changes for add form
  const handleNewInputChange = (e) => {
    const { name, value } = e.target;
    setNewService((prev) => ({ ...prev, [name]: value }));
  };

  // Handle input changes for edit form
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditServiceData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle new image upload
  const handleNewImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewServiceImage(e.target.files[0]);
    }
  };

  // Handle edit image upload
  const handleEditImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setEditServiceImage(e.target.files[0]);
    }
  };

  // Reset add form
  const resetAddForm = () => {
    setNewService({ name: "", description: "", heroImageUrl: "" });
    setNewServiceImage(null);
  };

  // Reset edit form
  const resetEditForm = () => {
    setEditingServiceID(null);
    setEditServiceData({ name: "", description: "", heroImageUrl: "" });
    setEditServiceImage(null);
  };

  // Add a new service
  const handleAddService = async () => {
    if (!newService.name.trim() || !newService.description.trim()) {
      toast.warn("Please fill all fields.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newService.name);
      formData.append("description", newService.description);
      if (newServiceImage) {
        formData.append("heroImage", newServiceImage);
      }

      await api.post("/HotelService/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Service added successfully.");
      resetAddForm();
      loadServices();
    } catch (error) {
      toast.error("Failed to add service.");
    }
  };

  // Open edit service form
  const openEditService = (service) => {
    setEditingServiceID(service.serviceID);
    setEditServiceData({
      name: service.name,
      description: service.description,
      heroImageUrl: service.heroImageUrl || "",
    });
    setEditServiceImage(null);
  };

  // Update existing service
  const handleUpdateService = async () => {
    if (!editServiceData.name.trim() || !editServiceData.description.trim()) {
      toast.warn("Please fill all fields.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", editServiceData.name);
      formData.append("description", editServiceData.description);
      if (editServiceImage) {
        formData.append("heroImage", editServiceImage);
      }

      await api.put(`/HotelService/update?id=${editingServiceID}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Service updated successfully.");
      resetEditForm();
      loadServices();
    } catch (error) {
      toast.error("Failed to update service.");
    }
  };

  // Delete a service with confirmation
  const handleDeleteService = async (id) => {
    if (!id) {
      toast.error("Invalid service ID.");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the service.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await api.delete("/HotelService/delete", { params: { id } });
        toast.success("Service deleted successfully.");
        if (editingServiceID === id) resetEditForm();
        loadServices();
        Swal.fire("Deleted!", "The service has been deleted.", "success");
      } catch (error) {
        toast.error("Failed to delete service.");
        Swal.fire("Error", "Failed to delete the service.", "error");
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ backgroundColor: "#f2f6fc", minHeight: "100vh", padding: "2rem" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">
          <i className="bi bi-tools me-2"></i>Service Manager
        </h2>
        <button className="btn btn-outline-primary" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-1"></i> Logout
        </button>
      </div>

      {/* Add Service */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header d-flex align-items-center bg-white text-primary border-bottom">
          <i className="bi bi-plus-circle me-2"></i>
          <strong>Add New Service</strong>
        </div>
        <div className="card-body">
          <input
            name="name"
            className="form-control mb-2"
            placeholder="Name"
            value={newService.name}
            onChange={handleNewInputChange}
          />
          <input
            name="description"
            className="form-control mb-2"
            placeholder="Description"
            value={newService.description}
            onChange={handleNewInputChange}
          />
          <input
            type="file"
            accept="image/*"
            className="form-control mb-2"
            onChange={handleNewImageChange}
          />
          {newServiceImage && (
            <img
              src={URL.createObjectURL(newServiceImage)}
              alt="Preview"
              width="100"
              style={{ objectFit: "cover", marginBottom: "10px" }}
            />
          )}
          <button className="btn btn-primary w-100" onClick={handleAddService} disabled={loading}>
            {loading ? "Adding..." : "Add Service"}
          </button>
        </div>
      </div>

      {/* List of Services */}
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <i className="bi bi-list-ul me-2"></i>All Services
        </div>
        <div className="card-body p-0">
          <table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Description</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-3">
                    No services found.
                  </td>
                </tr>
              )}
              {services.map((service, index) => (
                <tr key={service.serviceID || index}>
                  <td>{index + 1}</td>
                  <td>{service.name}</td>
                  <td>{service.description}</td>
                  <td>
                    {service.heroImageUrl && (
                      <img
                        src={service.heroImageUrl}
                        alt={service.name}
                        width="100"
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger me-2"
                      onClick={() => handleDeleteService(service.serviceID)}
                      disabled={loading}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => openEditService(service)}
                      disabled={loading}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Service */}
      {editingServiceID && (
        <div className="card mt-4 shadow-sm">
          <div className="card-header bg-primary text-white d-flex align-items-center">
            <i className="bi bi-pencil-square me-2"></i>Edit Service
          </div>
          <div className="card-body">
            <input
              name="name"
              className="form-control mb-2"
              value={editServiceData.name}
              onChange={handleEditInputChange}
            />
            <input
              name="description"
              className="form-control mb-2"
              value={editServiceData.description}
              onChange={handleEditInputChange}
            />
            <input
              type="file"
              accept="image/*"
              className="form-control mb-2"
              onChange={handleEditImageChange}
            />
            {editServiceImage ? (
              <img
                src={URL.createObjectURL(editServiceImage)}
                alt="Preview"
                width="100"
                style={{ objectFit: "cover", marginBottom: "10px" }}
              />
            ) : (
              editServiceData.heroImageUrl && (
                <img
                  src={editServiceData.heroImageUrl}
                  alt="Current"
                  width="100"
                  style={{ objectFit: "cover", marginBottom: "10px" }}
                />
              )
            )}
            <button
              className="btn btn-primary me-2"
              onClick={handleUpdateService}
              disabled={loading}
            >
              <i className="bi bi-check2"></i> Save
            </button>
            <button
              className="btn btn-secondary"
              onClick={resetEditForm}
              disabled={loading}
            >
              <i className="bi bi-x"></i> Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}






