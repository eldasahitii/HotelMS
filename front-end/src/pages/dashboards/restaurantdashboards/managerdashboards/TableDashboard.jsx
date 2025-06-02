import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

export default function TableDashboard() {
  const [tables, setTables] = useState([]);
  const [newTable, setNewTable] = useState({ tableNumber: '', capacity: '' });
  const [editingTable, setEditingTable] = useState(null);
  const [editTableData, setEditTableData] = useState({ tableNumber: '', capacity: '' });
  const [tableFilter, setTableFilter] = useState("All");
  


  const safeNumberValue = (value) => value === '' || value === null || value === undefined ? '' : Number(value);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await axios.get("/api/RestaurantTable/getAllTables");
      setTables(response.data);
    } catch {
      toast.error("Failed to fetch tables.");
    }
  };

  const handleAddTable = async () => {
    const tableNumber = parseInt(newTable.tableNumber);
    const capacity = parseInt(newTable.capacity);
    try {
      await axios.post("/api/RestaurantTable/addTable", { TableNumber: tableNumber, Capacity: capacity });
      toast.success("Table added successfully.");
      setNewTable({ tableNumber: '', capacity: '' });
      fetchTables();
    } catch {
      toast.error("Failed to add table.");
    }
  };

  const handleDeleteTable = async (id) => {
    const result = await Swal.fire({
                  title: 'Delete Table?',
                  text: "Are you sure you want to remove this table?",
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: 'Yes, remove it',
                  cancelButtonText: 'No'
                });
            
                if (!result.isConfirmed) return;
    try {
      await axios.delete(`/api/RestaurantTable/deleteTable?id=${id}`);
      toast.success("Table deleted.");
      fetchTables();
    } catch {
      toast.error("Failed to delete table.");
    }
  };

  const openEditTable = (table) => {
    setEditingTable(table);
    setEditTableData({ tableNumber: table.tableNumber, capacity: table.capacity });
  };

  const handleUpdateTable = async () => {
    const tableNumber = parseInt(editTableData.tableNumber);
    const capacity = parseInt(editTableData.capacity);
    try {
      await axios.put(`/api/RestaurantTable/updateTable?id=${editingTable.restaurantTableID}`, {
        TableNumber: tableNumber,
        Capacity: capacity
      });
      toast.success("Table updated successfully");
      setEditingTable(null);
      fetchTables();
    } catch {
      toast.error("Failed to update table.");
    }
  };

  return (
    <div id="tables">
      <h2 className="fw-bold text-primary mb-4">
        <i className="bi bi-table me-2"></i>Table Management
      </h2>

           <ToastContainer position="top-right" autoClose={3000} />
      

      <div className="card mt-4">
        <div className="card-header bg-success text-white">
          <i className="bi bi-plus-circle me-2"></i> Add Table
        </div>
        <div className="card-body">
          <input className="form-control mb-2" type="number" placeholder="Table Number" value={safeNumberValue(newTable.tableNumber)} onChange={e => setNewTable({ ...newTable, tableNumber: e.target.value })} />
          <input className="form-control mb-2" placeholder="Capacity" value={safeNumberValue(newTable.capacity)} onChange={e => setNewTable({ ...newTable, capacity: e.target.value })} />
          <button className="btn btn-success w-100" onClick={handleAddTable}>Add Table</button>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-body d-flex gap-2 align-items-center">
          <label className="form-label mb-0">Filter by Status:</label>
          <select className="form-select w-auto" value={tableFilter} onChange={(e) => setTableFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
          </select>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header bg-primary text-white">
          <i className="bi bi-list-ul me-2"></i> Tables
        </div>
        <div className="card-body p-0">
          <table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Table Number</th>
                <th>Status</th>
                <th>Capacity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tables
                .filter(table => tableFilter === "All" ? true : table.status.toLowerCase() === tableFilter.toLowerCase())
                .map((table, index) => (
                  <tr key={table.restaurantTableID}>
                    <td>{index + 1}</td>
                    <td>{table.tableNumber}</td>
                    <td>{table.status}</td>
                    <td>{table.capacity}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-danger me-2" onClick={() => handleDeleteTable(table.restaurantTableID)}><i className="bi bi-trash"></i></button>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => openEditTable(table)}><i className="bi bi-pencil-square"></i></button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingTable && (
        <div className="card mt-4">
          <div className="card-header bg-warning text-dark">
            <i className="bi bi-pencil-square me-2"></i>Edit Table
          </div>
          <div className="card-body">
            <input className="form-control mb-2" type="number" value={safeNumberValue(editTableData.tableNumber)} onChange={e => setEditTableData({ ...editTableData, tableNumber: e.target.value })} />
            <input className="form-control mb-2" value={safeNumberValue(editTableData.capacity)} onChange={e => setEditTableData({ ...editTableData, capacity: e.target.value })} />
            <button className="btn btn-primary me-2" onClick={handleUpdateTable}>Save</button>
            <button className="btn btn-secondary" onClick={() => setEditingTable(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}