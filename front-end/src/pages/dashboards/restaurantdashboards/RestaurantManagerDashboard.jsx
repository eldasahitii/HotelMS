import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';

export default function RestaurantManagerDashboard() {
  const [hosts, setHosts] = useState([]);
  const [newHost, setNewHost] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [editingHost, setEditingHost] = useState(null);
  const [editData, setEditData] = useState({ firstName: '', lastName: '', email: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const fetchHosts = async () => {
    try {
      const response = await axios.get("/api/HostManagement/getAllHosts");
      setHosts(response.data);
    } catch (error) {
      setMessage("Failed to fetch hosts.");
      setMessageType("danger");
    }
  };

  useEffect(() => {
    fetchHosts();
  }, []);

  const handleAddHost = async () => {
    if (!newHost.firstName || !newHost.lastName || !newHost.email || !newHost.password) {
      setMessage("All fields are required.");
      setMessageType("danger");
      return;
    }
    try {
      await axios.post("/api/HostManagement/addHost", newHost);
      setNewHost({ firstName: '', lastName: '', email: '', password: '' });
      setMessage("Host added successfully.");
      setMessageType("success");
      fetchHosts();
    } catch (error) {
      setMessage("Failed to add host.");
      setMessageType("danger");
    }
  };

  const handleDeleteHost = async (id) => {
    try {
      await axios.delete(`/api/HostManagement/deleteHost?id=${id}`);
      setMessage("Host deleted successfully.");
      setMessageType("success");
      fetchHosts();
    } catch (error) {
      setMessage("Failed to delete host.");
      setMessageType("danger");
    }
  };

  const startEditing = (host) => {
    setEditingHost(host);
    setEditData({ firstName: host.firstName, lastName: host.lastName, email: host.email });
  };

  const cancelEditing = () => {
    setEditingHost(null);
    setEditData({ firstName: '', lastName: '', email: '' });
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`/api/User/updateUser?id=${editingHost.userID}`, editData);
      setMessage("Host updated successfully.");
      setMessageType("success");
      setEditingHost(null);
      fetchHosts();
    } catch (error) {
      setMessage("Failed to update host.");
      setMessageType("danger");
    }
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#fff8f0' }}>
      <aside className="text-white p-4" style={{ width: '240px', backgroundColor: '#8c4a35' }}>
        <h4 className="fw-bold mb-4"><i className="bi bi-shop"></i> Restaurant Manager</h4>
        <ul className="nav flex-column">
          <li className="nav-item">Manage Hosts</li>
        </ul>
        <hr className="text-white" />
        <button className="btn btn-outline-light w-100" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-2"></i> Logout
        </button>
      </aside>

      <main className="flex-grow-1 p-4">
        <h2 className="fw-bold text-danger mb-4">
          <i className="bi bi-person-lines-fill me-2"></i>Host Management
        </h2>

        {message && (
          <div className={`alert alert-${messageType} alert-dismissible fade show`}>
            {message}
            <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
          </div>
        )}

        <div className="card mb-4">
          <div className="card-header bg-danger text-white">
            <i className="bi bi-person-plus me-2"></i>Add New Host
          </div>
          <div className="card-body">
            <input className="form-control mb-2" placeholder="First Name" value={newHost.firstName} onChange={e => setNewHost({ ...newHost, firstName: e.target.value })} />
            <input className="form-control mb-2" placeholder="Last Name" value={newHost.lastName} onChange={e => setNewHost({ ...newHost, lastName: e.target.value })} />
            <input className="form-control mb-2" placeholder="Email" value={newHost.email} onChange={e => setNewHost({ ...newHost, email: e.target.value })} />
            <input type="password" className="form-control mb-2" placeholder="Password" value={newHost.password} onChange={e => setNewHost({ ...newHost, password: e.target.value })} />
            <button className="btn btn-danger w-100" onClick={handleAddHost}><i className="bi bi-check2-circle me-2"></i>Add Host</button>
          </div>
        </div>

        <div className="card">
          <div className="card-header bg-dark text-white">
            <i className="bi bi-people-fill me-2"></i>Host List
          </div>
          <div className="card-body p-0">
            <table className="table mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {hosts.map((host, index) => (
                  <tr key={host.userID}>
                    <td>{index + 1}</td>
                    <td>{host.firstName} {host.lastName}</td>
                    <td>{host.email}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => startEditing(host)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteHost(host.userID)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {editingHost && (
          <div className="card mt-4">
            <div className="card-header bg-warning text-dark">
              <i className="bi bi-pencil-square me-2"></i>Edit Host
            </div>
            <div className="card-body">
              <input className="form-control mb-2" placeholder="First Name" value={editData.firstName} onChange={e => setEditData({ ...editData, firstName: e.target.value })} />
              <input className="form-control mb-2" placeholder="Last Name" value={editData.lastName} onChange={e => setEditData({ ...editData, lastName: e.target.value })} />
              <input className="form-control mb-2" placeholder="Email" value={editData.email} onChange={e => setEditData({ ...editData, email: e.target.value })} />
              <button className="btn btn-primary me-2" onClick={handleSaveEdit}><i className="bi bi-check2"></i> Save</button>
              <button className="btn btn-secondary" onClick={cancelEditing}><i className="bi bi-x"></i> Cancel</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}




// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';
// import { useNavigate } from 'react-router-dom';

// export default function RestaurantManagerDashboard() {
//   const [hosts, setHosts] = useState([]);
//   const [newHost, setNewHost] = useState({ firstName: '', lastName: '', email: '', password: '' });
//   const [message, setMessage] = useState('');
//   const [messageType, setMessageType] = useState('');

//   const fetchHosts = async () => {
//     try {
//       const response = await axios.get("/api/HostManagement/getAllHosts");
//       setHosts(response.data);
//     } catch (error) {
//       setMessage("Failed to fetch hosts.");
//       setMessageType("danger");
//     }
//   };

//   useEffect(() => {
//     fetchHosts();
//   }, []);

//   const handleAddHost = async () => {
//     if (!newHost.firstName || !newHost.lastName || !newHost.email || !newHost.password) {
//       setMessage("All fields are required.");
//       setMessageType("danger");
//       return;
//     }
//     try {
//       await axios.post("/api/HostManagement/addHost", newHost);
//       setNewHost({ firstName: '', lastName: '', email: '', password: '' });
//       setMessage("Host added successfully.");
//       setMessageType("success");
//       fetchHosts();
//     } catch (error) {
//       setMessage("Failed to add host.");
//       setMessageType("danger");
//     }
//   };

//   const handleDeleteHost = async (id) => {
//     try {
//       await axios.delete(`/api/HostManagement/deleteHost?id=${id}`);
//       setMessage("Host deleted successfully.");
//       setMessageType("success");
//       fetchHosts();
//     } catch (error) {
//       setMessage("Failed to delete host.");
//       setMessageType("danger");
//     }
//   };

//   const navigate = useNavigate();
//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/login');
//   };

//   return (
//     <div className="d-flex min-vh-100" style={{ backgroundColor: '#fff8f0' }}>
//       <aside className="text-white p-4" style={{ width: '240px', backgroundColor: '#8c4a35' }}>
//         <h4 className="fw-bold mb-4"><i className="bi bi-shop"></i> Restaurant Manager</h4>
//         <ul className="nav flex-column">
//           <li className="nav-item">Manage Hosts</li>
//         </ul>
//         <hr className="text-white" />
//         <button className="btn btn-outline-light w-100" onClick={handleLogout}>
//           <i className="bi bi-box-arrow-right me-2"></i> Logout
//         </button>
//       </aside>

//       <main className="flex-grow-1 p-4">
//         <h2 className="fw-bold text-danger mb-4">
//           <i className="bi bi-person-lines-fill me-2"></i>Host Management
//         </h2>

//         {message && (
//           <div className={`alert alert-${messageType} alert-dismissible fade show`}>
//             {message}
//             <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
//           </div>
//         )}

//         <div className="card mb-4">
//           <div className="card-header bg-danger text-white">
//             <i className="bi bi-person-plus me-2"></i>Add New Host
//           </div>
//           <div className="card-body">
//             <input className="form-control mb-2" placeholder="First Name" value={newHost.firstName} onChange={e => setNewHost({ ...newHost, firstName: e.target.value })} />
//             <input className="form-control mb-2" placeholder="Last Name" value={newHost.lastName} onChange={e => setNewHost({ ...newHost, lastName: e.target.value })} />
//             <input className="form-control mb-2" placeholder="Email" value={newHost.email} onChange={e => setNewHost({ ...newHost, email: e.target.value })} />
//             <input type="password" className="form-control mb-2" placeholder="Password" value={newHost.password} onChange={e => setNewHost({ ...newHost, password: e.target.value })} />
//             <button className="btn btn-danger w-100" onClick={handleAddHost}><i className="bi bi-check2-circle me-2"></i>Add Host</button>
//           </div>
//         </div>

//         <div className="card">
//           <div className="card-header bg-dark text-white">
//             <i className="bi bi-people-fill me-2"></i>Host List
//           </div>
//           <div className="card-body p-0">
//             <table className="table mb-0">
//               <thead className="table-light">
//                 <tr>
//                   <th>#</th>
//                   <th>Name</th>
//                   <th>Email</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {hosts.map((host, index) => (
//                   <tr key={host.userID}>
//                     <td>{index + 1}</td>
//                     <td>{host.firstName} {host.lastName}</td>
//                     <td>{host.email}</td>
//                     <td>
//                       <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteHost(host.userID)}>
//                         <i className="bi bi-trash"></i>
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
