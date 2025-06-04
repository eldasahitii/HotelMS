import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

export default function MenuDashboard() {
  const [menuItems, setMenuItems] = useState([]);
  const [newMenuItem, setNewMenuItem] = useState({ name: '', description: '', price: '', image_url: '', is_available: true, menuCategoryID: 1 });
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [editMenuData, setEditMenuData] = useState({ name: '', description: '', price: '', image_url: '', is_available: true, menuCategoryID: 1 });
  const [categories, setCategories] = useState([]);




  const safeInputValue = (value) => value ?? '';
  const safeNumberValue = (value) => value === '' || value === null || value === undefined ? '' : Number(value);

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get("/api/MenuItem/getAllMenuItems", {
        withCredentials: true
      });
      setMenuItems(response.data);
    } catch {
      toast.error("Failed to fetch menu items.");
    }
  };
  const fetchCategories = async () => {
  try {
    const response = await axios.get("/api/MenuCategory/getAllCategories", {
      withCredentials: true
    });
    setCategories(response.data);
  } catch {
    toast.error("Failed to fetch categories.");
  }
};

  const handleAddMenuItem = async () => {
    try {
      await axios.post("/api/MenuItem/addMenuItem", {
        ...newMenuItem,
        price: Number(newMenuItem.price)
      }, {
        withCredentials: true
      });
      toast.success("Menu item added successfully.");
      setNewMenuItem({ name: '', description: '', price: '', image_url: '', is_available: true, menuCategoryID: 1 });
      fetchMenuItems();
    } catch {
      toast.error("Failed to add menu item.");
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
      await axios.put(`/api/MenuItem/updateMenuItem?id=${editingMenuItem.menuItemID}`, {
        name: editMenuData.name,
        description: editMenuData.description,
        price: Number(editMenuData.price),
        image_url: editMenuData.image_url,
        is_available: editMenuData.is_available,
        menuCategoryID: Number(editMenuData.menuCategoryID)
      }, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
      toast.success("Menu item updated successfully.");
      setEditingMenuItem(null);
      fetchMenuItems();
    } catch (error) {
      toast.error("Failed to update menu item.");
    }
  };

  const handleDeleteMenuItem = async (id) => {
    const result = await Swal.fire({
              title: 'Delete Menu Item?',
              text: "Are you sure you want to remove this menu item?",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Yes, remove it',
              cancelButtonText: 'No'
            });
        
            if (!result.isConfirmed) return;
    try {
      await axios.delete(`/api/MenuItem/deleteMenuItem?id=${id}`, {
        withCredentials: true
      });
      toast.success("Menu Item deleted.");
      fetchMenuItems();
    } catch {
      toast.error("Failed to delete menu item.");
    }
  };

  return (
    <div id="menu">
      <h2 className="fw-bold text-primary mb-4">
        <i className="bi bi-list-ul me-2"></i>Menu Management
      </h2>
      
                    <ToastContainer position="top-right" autoClose={3000} />
      



      <div className="card mt-4">
        <div className="card-header bg-success text-white">
          <i className="bi bi-plus-circle me-2"></i> Add Menu Item
        </div>
        <div className="card-body">
          <input className="form-control mb-2" placeholder="Name" value={safeInputValue(newMenuItem.name)} onChange={e => setNewMenuItem({ ...newMenuItem, name: e.target.value })} />
          <input className="form-control mb-2" placeholder="Description" value={safeInputValue(newMenuItem.description)} onChange={e => setNewMenuItem({ ...newMenuItem, description: e.target.value })} />
          <input className="form-control mb-2" type="number" placeholder="Price" value={safeNumberValue(newMenuItem.price)} onChange={e => setNewMenuItem({ ...newMenuItem, price: e.target.value })} />
          <input className="form-control mb-2" placeholder="Image URL" value={safeInputValue(newMenuItem.image_url)} onChange={e => setNewMenuItem({ ...newMenuItem, image_url: e.target.value })} />
          <select
            className="form-control mb-2"
            value={newMenuItem.menuCategoryID}
            onChange={e => setNewMenuItem({ ...newMenuItem, menuCategoryID: parseInt(e.target.value) })}
          >
           <option value="">Select Category</option>
            {categories.map(cat => (
           <option key={cat.menuCategoryID} value={cat.menuCategoryID}>
           {cat.name}
           </option>
          ))}
         </select>
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
                <th>Category</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item, index) => (
                <tr key={item.menuItemID}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>${Number(item.price).toFixed(2)}</td>
                  <td>{item.is_available ? "Yes" : "No"}</td>
                  <td>{item.categoryName}</td>
                  <td><img src={item.image_url} alt={item.name} style={{ width: "80px", borderRadius: "8px", objectFit: "cover" }} /></td>
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
            <input className="form-control mb-2" value={safeInputValue(editMenuData.name)} onChange={e => setEditMenuData({ ...editMenuData, name: e.target.value })} />
            <input className="form-control mb-2" value={safeInputValue(editMenuData.description)} onChange={e => setEditMenuData({ ...editMenuData, description: e.target.value })} />
            <input className="form-control mb-2" type="number" value={safeNumberValue(editMenuData.price)} onChange={e => setEditMenuData({ ...editMenuData, price: e.target.value })} />
            <input className="form-control mb-2" value={safeInputValue(editMenuData.image_url)} onChange={e => setEditMenuData({ ...editMenuData, image_url: e.target.value })} />
            <select
                 className="form-control mb-2"
                 value={editMenuData.menuCategoryID}
                 onChange={e => setEditMenuData({ ...editMenuData, menuCategoryID: parseInt(e.target.value) })}
             >
             <option value="">Select Category</option>
             {categories.map(cat => (
              <option key={cat.menuCategoryID} value={cat.menuCategoryID}>
             {cat.name}
              </option>
             ))}
            </select>
            <div className="form-check mb-2">
              <input className="form-check-input" type="checkbox" checked={editMenuData.is_available} onChange={e => setEditMenuData({ ...editMenuData, is_available: e.target.checked })} />
              <label className="form-check-label">Available</label>
            </div>
            <button className="btn btn-primary me-2" onClick={handleUpdateMenuItem}>Save</button>
            <button className="btn btn-secondary" onClick={() => setEditingMenuItem(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
