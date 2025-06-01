import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MenuSection() {
  const [menuItems, setMenuItems] = useState([]);

  const fetchMenuItems = async () => {
    const res = await axios.get("/api/MenuItem/getAllMenuItems", { withCredentials: true });
    setMenuItems(res.data);
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Menu Items</h2>
      <div className="card">
        <div className="card-header">All Menu Items</div>
        <div className="card-body p-0">
          <table className="table">
            <thead>
              <tr><th>#</th><th>Name</th><th>Price</th><th>Available</th><th>Image</th></tr>
            </thead>
            <tbody>
              {menuItems.map((m, i) => (
                <tr key={m.menuItemID}>
                  <td>{i + 1}</td>
                  <td>{m.name}</td>
                  <td>${Number(m.price).toFixed(2)}</td>
                  <td>{m.is_available ? 'Yes' : 'No'}</td>
                  <td><img src={m.image_url} alt={m.name} style={{ width: 60 }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
