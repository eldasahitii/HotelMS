
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
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from "react-router-dom";

export default function ServiceManagerDashboard() {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ name: '', description: '', heroImageUrl: '' });
  const [newServiceImage, setNewServiceImage] = useState(null);

  const [editingService, setEditingService] = useState(null);
  const [editServiceData, setEditServiceData] = useState({ name: '', description: '', heroImageUrl: '' });
  const [editServiceImage, setEditServiceImage] = useState(null);

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const fetchServices = async () => {
    try {
      const res = await axios.get("/api/HotelService/getAll");
      setServices(res.data);
    } catch {
      setMessage("Error fetching services.");
      setMessageType("danger");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAddService = async () => {
    try {
      const formData = new FormData();
     
      formData.append("name", newService.name);
      formData.append("description", newService.description);
      // formData.append("heroImage", newServiceImage); // image upload disabled for now

      await axios.post("/api/HotelService/add", {
        Name: newService.name,
        Description: newService.description,
        HeroImageUrl: ""
      }, {
        headers: { "Content-Type": "application/json" },
      });

      setMessage("Service added successfully.");
      setMessageType("success");
      setNewService({ name: '', description: '', heroImageUrl: '' });
      setNewServiceImage(null);
      fetchServices();
    } catch (error) {
      console.error("Error adding service:", error);
      setMessage("Failed to add service.");
      setMessageType("danger");
    }
  };

  const handleDeleteService = async (id) => {
    try {
      await axios.delete(`/api/HotelService/delete?id=${id}`);
      setMessage("Service deleted.");
      setMessageType("success");
      fetchServices();
    } catch {
      setMessage("Failed to delete service.");
      setMessageType("danger");
    }
  };

  const openEditService = (service) => {
    setEditingService(service);
    setEditServiceData({
      name: service.name,
      description: service.description,
      heroImageUrl: service.heroImageUrl || ''
    });
    setEditServiceImage(null);
  };

  const handleUpdateService = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editServiceData.name);
      formData.append("description", editServiceData.description);
      if (editServiceImage) {
        formData.append("heroImage", editServiceImage);
      }

      await axios.put(`/api/HotelService/update?id=${editingService.serviceID}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Service updated.");
      setMessageType("success");
      setEditingService(null);
      setEditServiceImage(null);
      fetchServices();
    } catch {
      setMessage("Failed to update service.");
      setMessageType("danger");
    }
  };

  const handleNewImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewServiceImage(e.target.files[0]);
    }
  };

  const handleEditImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setEditServiceImage(e.target.files[0]);
    }
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#f2f6fc' }}>
      <aside className="text-white p-4" style={{ width: '240px', backgroundColor: '#324b6b' }}>
        <h4 className="fw-bold mb-4"><i className="bi bi-building"></i> HotelMS</h4>
        <ul className="nav flex-column">
          <li className="nav-item">
            <span className="nav-link text-white fw-bold">
              <i className="bi bi-gear-fill me-2"></i>Service Management
            </span>
          </li>
          <hr className="text-white" />
          <button className="btn btn-outline-light w-100" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </button>
        </ul>
      </aside>

      <main className="flex-grow-1 p-4">
        <h2 className="fw-bold text-primary mb-4">
          <i className="bi bi-tools me-2"></i>Service Manager
        </h2>

        {message && (
          <div className={`alert alert-${messageType} alert-dismissible fade show`} role="alert">
            {message}
            <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
          </div>
        )}

        {/* Add Service Form */}
        <div className="card mb-4 shadow-sm">
          <div 
            className="card-header d-flex align-items-center" 
            style={{ backgroundColor: '#fff', borderBottom: '1px solid #dee2e6', color: '#0d6efd' }}
          >
            <i className="bi bi-plus-circle me-2"></i>
            <strong>Add New Service</strong>
          </div>
          <div className="card-body">
            <input 
              className="form-control mb-2" 
              placeholder="Name" 
              value={newService.name} 
              onChange={e => setNewService({ ...newService, name: e.target.value })} 
            />
            <input 
              className="form-control mb-2" 
              placeholder="Description" 
              value={newService.description} 
              onChange={e => setNewService({ ...newService, description: e.target.value })} 
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
            <button className="btn btn-primary w-100" onClick={handleAddService}>Add Service</button>
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
                          style={{ objectFit: 'cover' }} 
                        />
                      )}
                    </td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-danger me-2" 
                        onClick={() => handleDeleteService(service.serviceID)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-secondary" 
                        onClick={() => openEditService(service)}
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

        {/* Edit Service Form */}
        {editingService && (
          <div className="card mt-4 shadow-sm">
            <div className="card-header bg-primary text-white d-flex align-items-center">
              <i className="bi bi-pencil-square me-2"></i>Edit Service
            </div>
            <div className="card-body">
              <input 
                className="form-control mb-2" 
                value={editServiceData.name} 
                onChange={e => setEditServiceData({ ...editServiceData, name: e.target.value })} 
              />
              <input 
                className="form-control mb-2" 
                value={editServiceData.description} 
                onChange={e => setEditServiceData({ ...editServiceData, description: e.target.value })} 
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
              <button className="btn btn-primary me-2" onClick={handleUpdateService}>
                <i className="bi bi-check2"></i> Save
              </button>
              <button className="btn btn-secondary" onClick={() => setEditingService(null)}>
                <i className="bi bi-x"></i> Cancel
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}




