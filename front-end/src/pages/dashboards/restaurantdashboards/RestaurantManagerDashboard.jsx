import React, { useEffect, useState} from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link, useNavigate } from "react-router-dom";

export default function RestaurantManagerDashboard() {
  const [activeSection, setActiveSection] = useState("hosts");

  const [hosts, setHosts] = useState([]);
  const [ newHost, setNewHost] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [editingHost, setEditingHost] = useState(null);
  const [editData, setEditData] = useState({firstName: '', lastName: '', email: '' });
 
  const [menuItems, setMenuItems] = useState([]);
  const [newMenuItem, setNewMenuItem] = useState({name: '', description: '', price: '', image_url:'',is_available:true, menuCategoryID: 1});
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [editMenuData, setEditMenuData] = useState({name: '', description: '', price: '', image_url: '', is_available: true, menuCategoryID: 1});
 
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [searchId, setSearchId] = useState('');

  const fetchHosts = async() => {
    try {
      const response = await axios.get("/api/HostManagement/getAllHosts");
      setHosts(response.data);
    } catch {
      setMessage("Failed to fetch hosts");
      setMessageType("danger");
    }
  };
  const fetchMenuItems = async () => {
    try {
      const response = await axios.get("/api/MenuItem/getAllMenuItems", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setMenuItems(response.data);
    } catch {
      setMessage("Failed to fetch menu items.");
      setMessageType("danger");
    }
  };
   useEffect(() => {
    fetchHosts();
    fetchMenuItems();
  }, []);

  const handleAddHost = async () => {
    if(!newHost.firstName || !newHost.lastName || !newHost.email || !newHost.password) {
      setMessage("Please fill all fields.");
      setMessageType("danger");
      return;
    }
    try {
      await axios.post("/api/HostManagement/addHost", newHost);
      setMessage("Host added successfully.");
       setMessageType("success");
      setNewHost({ firstName: '', lastName: '', email: '', password: '' });
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
    } catch (err) {
      setMessage("Failed to delete host.");
      setMessageType("danger");
    }
  };

  const openEditForm = (host) => {
    setEditingHost(host);
    setEditData({ firstName: host.firstName, lastName: host.lastName, email: host.email });
  };

  const handleConfirmUpdate = async () => {
  try {
    await axios.put(`/api/HostManagement/updateHost?id=${editingHost.userID}`, editData);
    setMessage("Host updated successfully.");
    setMessageType("success");
    setEditingHost(null);
    fetchHosts();
  } catch (error) {
    setMessage("Failed to update host.");
    setMessageType("danger");
  }
};

  const handleSearchById = async () => {
    if (!searchId) return;
    try {
      const res = await axios.get(`/api/HostManagement/getHost?id=${searchId}`);
      setHosts(res.data ? [res.data] : []);
    } catch (error) {
      setMessage("Host not found.");
      setMessageType("danger");
    }
  };

  const handleAddMenuItem = async () => {
    try {
      await axios.post("/api/MenuItem/addMenuItem", newMenuItem, {
        headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
      });
      setMessage("Menu item added successfully.");
      setMessageType("success");
      setNewMenuItem({ name: '', description: '', price: '', image_url: '', is_available: true, menuCategoryID: 1});
      fetchMenuItems();
    } catch {
      setMessage("Failed to add menu item.");
      setMessageType("danger");
    }
  };
  const openEditMenuItem = (item) => {
    setEditingMenuItem(item);
    setEditMenuData({
      name: item.name,
      description: item.description,
      price: item.price,
      image_url: item.image_url,
      is_available: item.is_available,
      menuCategoryID: item.menuCategoryID
    });
  };

  const handleUpdateMenuItem = async () => {
    try {
      await axios.put(`/api/MenuItem/updateMenuItem?id=${editingMenuItem.menuItemID}`, editMenuData, {
        headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
      });
      setMessage("Menu item updated successfully.");
      setMessageType("success");
      setEditingMenuItem(null);
      fetchMenuItems();
    } catch(error) {
      setMessage("Failed to update menu item.");
      setMessageType("danger");
    }
  };
  const handleDeleteMenuItem = async(id) => {
    try {
      await axios.delete(`/api/MenuItem/deleteMenuItem?id=${id}`, {
        headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
      });
      setMessage("Menu Item deleted.");
      setMessageType("success");
      fetchMenuItems();
    } catch (error) {
      setMessage("Failed to delete menu item.");
      setMessageType("danger");
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
            <button className={`nav-link text-white ${activeSection === "hosts" ? "fw-bold" : ""}`} onClick={() => setActiveSection("hosts")}>
            <i className="bi bi-people-fill me-2"></i>Restaurant Hosts
            </button>
             <button className={`nav-link text-white ${activeSection === "menu" ? "fw-bold" : ""}`} onClick={() => setActiveSection("menu")}>
            <i className="bi bi-people-fill me-2"></i>Menu Items
            </button>
          </li>
          <hr className="text-white" />
          <button className="btn btn-outline-light w-100" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </button>
        </ul>
      </aside>
      <main className="flex-grow-1 p-4">
        <h2 className="fw-bold text-primary mb-4">
          <i className="bi bi-people-fill me-2"></i>Restaurant Manager
        </h2>

        {activeSection === "hosts" && (
         <>
            <h2 className="fw-bold text-primary mb-4">
               <i className="bi bi-people-fill me-2"></i>Restaurant Hosts
            </h2>

        {message && (
          <div className={`alert alert-${messageType} alert-dismissible fade show`} role="alert">
            {message}
            <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
          </div>
        )}

        
        <div className="card mb-4">
          <div className="card-header bg-success text-white">
            <i className="bi bi-person-plus-fill me-2"></i>Add New Host
          </div>
          <div className="card-body">
            <input className="form-control mb-2" placeholder="First Name" value={newHost.firstName} onChange={e => setNewHost({ ...newHost, firstName: e.target.value })} />
            <input className="form-control mb-2" placeholder="Last Name" value={newHost.lastName} onChange={e => setNewHost({ ...newHost, lastName: e.target.value })} />
            <input className="form-control mb-2" placeholder="Email" value={newHost.email} onChange={e => setNewHost({ ...newHost, email: e.target.value })} />
            <input className="form-control mb-2" placeholder="Password" type="password" value={newHost.password} onChange={e => setNewHost({ ...newHost, password: e.target.value })} />
            <button className="btn btn-success w-100" onClick={handleAddHost}><i className="bi bi-check-circle me-2"></i>Add Host</button>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body d-flex gap-2">
            <input type="number" className="form-control" placeholder="Search by ID" value={searchId} onChange={e => setSearchId(e.target.value)} />
            <button className="btn btn-outline-dark" onClick={handleSearchById}>
              <i className="bi bi-search"></i> Search
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header bg-primary text-white">
            <i className="bi bi-people-fill me-2"></i>All Hosts
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
                      <button className="btn btn-sm btn-outline-danger me-2" onClick={() => handleDeleteHost(host.userID)}><i className="bi bi-trash"></i></button>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => openEditForm(host)}><i className="bi bi-pencil-square"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </>
        )}

       {editingHost && (
  <div className="card mt-4">
    <div className="card-header bg-warning text-dark">
      <i className="bi bi-pencil-square me-2"></i>Edit Host
    </div>
    <div className="card-body">
      <input
        className="form-control mb-2"
        placeholder="First Name"
        value={editData.firstName}
        onChange={e => setEditData({ ...editData, firstName: e.target.value })}
      />
      <input
        className="form-control mb-2"
        placeholder="Last Name"
        value={editData.lastName}
        onChange={e => setEditData({ ...editData, lastName: e.target.value })}
      />
      <input
        className="form-control mb-2"
        placeholder="Email"
        value={editData.email}
        onChange={e => setEditData({ ...editData, email: e.target.value })}
      />
      <button className="btn btn-primary me-2" onClick={handleConfirmUpdate}>
        <i className="bi bi-check2"></i> Save
      </button>
      <button className="btn btn-secondary" onClick={() => setEditingHost(null)}>
        <i className="bi bi-x"></i> Cancel
      </button>
    </div>
  </div>


        )}
        {activeSection === "menu" && (
        <>
         <h2 className="fw-bold text-primary mb-4">
              <i className="bi bi-list-ul me-2"></i>Menu Management
            </h2>
            {message && (
              <div className={`alert alert-${messageType} alert-dismissible fade show`} role="alert">
                {message}
                <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
              </div>
            )}
      
     <div className="card mt-4">
  <div className="card-header bg-success text-white">
    <i className="bi bi-plus-circle me-2"></i> Add Menu Item
  </div>
  <div className="card-body">
    <input className="form-control mb-2" placeholder="Name" value={newMenuItem.name} onChange={e => setNewMenuItem({ ...newMenuItem, name: e.target.value })} />
    <input className="form-control mb-2" placeholder="Description" value={newMenuItem.description} onChange={e => setNewMenuItem({ ...newMenuItem, description: e.target.value })} />
    <input className="form-control mb-2" placeholder="Price" type="number" value={newMenuItem.price} onChange={e => setNewMenuItem({ ...newMenuItem, price: e.target.value })} />
    <input className="form-control mb-2" placeholder="Image URL" value={newMenuItem.image_url} onChange={e => setNewMenuItem({ ...newMenuItem, image_url: e.target.value })} />
    <input className="form-control mb-2" placeholder="Category ID" type="number" value={newMenuItem.menuCategoryID} onChange={e => setNewMenuItem({ ...newMenuItem, menuCategoryID: e.target.value })} />
    <div className="form-check mb-2">
      <input className="form-check-input" type="checkbox" checked={newMenuItem.is_available} onChange={e => setNewMenuItem({ ...newMenuItem, is_available: e.target.checked })} />
      <label className="form-check-label">Available</label>
    </div>
    <button className="btn btn-success w-100" onClick={handleAddMenuItem}>Add Menu Item</button>
  </div>
</div>

<div className="card mt-4">
  <div className="card-header bg-primary text-white">
    <i className="bi bi-list-ul me-2"></i> Menu Items
  </div>
  <div className="card-body p-0">
    <table className="table mb-0">
      <thead className="table-light">
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Price</th>
          <th>Available</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {menuItems.map((item, index) => (
          <tr key={item.menuItemID}>
            <td>{index + 1}</td>
            <td>{item.name}</td>
            <td>${item.price.toFixed(2)}</td>
            <td>{item.is_available ? "Yes" : "No"}</td>
            <td>
              <button className="btn btn-sm btn-outline-danger me-2" onClick={() => handleDeleteMenuItem(item.menuItemID)}><i className="bi bi-trash"></i></button>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => openEditMenuItem(item)}><i className="bi bi-pencil-square"></i></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

{editingMenuItem && (
  <div className="card mt-4">
    <div className="card-header bg-warning text-dark">
      <i className="bi bi-pencil-square me-2"></i>Edit Menu Item
    </div>
    <div className="card-body">
      <input className="form-control mb-2" value={editMenuData.name} onChange={e => setEditMenuData({ ...editMenuData, name: e.target.value })} />
      <input className="form-control mb-2" value={editMenuData.description} onChange={e => setEditMenuData({ ...editMenuData, description: e.target.value })} />
      <input className="form-control mb-2" type="number" value={editMenuData.price} onChange={e => setEditMenuData({ ...editMenuData, price: e.target.value })} />
      <input className="form-control mb-2" value={editMenuData.image_url} onChange={e => setEditMenuData({ ...editMenuData, image_url: e.target.value })} />
      <input className="form-control mb-2" type="number" value={editMenuData.menuCategoryID} onChange={e => setEditMenuData({ ...editMenuData, menuCategoryID: e.target.value })} />
      <div className="form-check mb-2">
        <input className="form-check-input" type="checkbox" checked={editMenuData.is_available} onChange={e => setEditMenuData({ ...editMenuData, is_available: e.target.checked })} />
        <label className="form-check-label">Available</label>
      </div>
      <button className="btn btn-primary me-2" onClick={handleUpdateMenuItem}>Save</button>
      <button className="btn btn-secondary" onClick={() => setEditingMenuItem(null)}>Cancel</button>
    </div>
  </div>
)}
</>
      )}
      </main>
     


    </div>
  );

  
}
  
