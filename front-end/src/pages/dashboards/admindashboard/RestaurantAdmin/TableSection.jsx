import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TableSection() {
  const [tables, setTables] = useState([]);
  const [tableStatusFilter, setTableStatusFilter] = useState("All");

  const fetchTables = async () => {
    const res = await axios.get("/api/RestaurantTable/getAllTables", { withCredentials: true });
    setTables(res.data);
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const filteredTables = tables.filter(t => {
    if (tableStatusFilter === "All") return true;
    return t.status?.toLowerCase() === tableStatusFilter.toLowerCase();
  });

  return (
    <div className="container py-4">
      <h2 className="mb-4">Restaurant Tables</h2>

      <div className="mb-3">
        <label className="form-label">Filter by Status</label>
        <select className="form-select w-auto" value={tableStatusFilter} onChange={(e) => setTableStatusFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="Available">Available</option>
          <option value="Occupied">Occupied</option>
        </select>
      </div>

      <div className="card">
        <div className="card-header">All Tables</div>
        <div className="card-body p-0">
          <table className="table">
            <thead>
              <tr><th>#</th><th>Table Number</th><th>Status</th><th>Capacity</th></tr>
            </thead>
            <tbody>
              {filteredTables.map((t, i) => (
                <tr key={t.restaurantTableID}>
                  <td>{i + 1}</td>
                  <td>{t.tableNumber}</td>
                  <td className={t.status === "Occupied" ? "text-danger" : "text-success"}>{t.status}</td>
                  <td>{t.capacity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
