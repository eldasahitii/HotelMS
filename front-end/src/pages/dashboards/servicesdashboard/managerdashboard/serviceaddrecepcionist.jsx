import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

export default function ServiceRecepsionistManager() {
  const [receps, setReceps] = useState([]);
  const [form, setForm] = useState({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    totalReservationsHandled: 0,
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReceps();
  }, []);

  const fetchReceps = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/ServiceRecepsionist/");
      const normalized = res.data.map((r) => ({
        ...r,
        phone: r.phone || "",
        totalReservationsHandled: r.totalReservationsHandled ?? 0,
      }));
      setReceps(normalized);
    } catch {
      toast.error("Failed to load service recepsionists.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (recep) => {
    setEditingId(recep.id);
    setForm({
      ...recep,
      phone: recep.phone || "",
      totalReservationsHandled: recep.totalReservationsHandled ?? 0,
    });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the service recepsionist.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/ServiceRecepsionist/${id}`);
        toast.success("Deleted successfully");
        fetchReceps();
      } catch {
        toast.error("Failed to delete");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dto = { ...form };

    try {
      if (editingId) {
        await axios.put(`/api/ServiceRecepsionist/${editingId}`, dto);
        toast.success("Updated successfully");
      } else {
        await axios.post("/api/ServiceRecepsionist/", dto);
        toast.success("Added successfully");
      }
      setForm({
        id: 0,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        totalReservationsHandled: 0,
      });
      setEditingId(null);
      fetchReceps();
    } catch {
      toast.error("Failed to save data");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "totalReservationsHandled"
          ? value === ""
            ? 0
            : parseInt(value)
          : value,
    }));
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Service Recepsionist Management</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">First Name</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Total Reservations Handled</label>
            <input
              type="number"
              name="totalReservationsHandled"
              value={form.totalReservationsHandled}
              onChange={handleChange}
              className="form-control"
              min="0"
            />
          </div>
        </div>
        <div className="mt-3">
          <button type="submit" className="btn btn-success">
            {editingId ? "Update" : "Add"} Recepsionist
          </button>
          {editingId && (
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => {
                setEditingId(null);
                setForm({
                  id: 0,
                  firstName: "",
                  lastName: "",
                  email: "",
                  phone: "",
                  totalReservationsHandled: 0,
                });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h4 className="mb-3">All Service Recepsionists</h4>
      {loading ? (
        <p>Loading...</p>
      ) : receps.length === 0 ? (
        <p>No recepsionists found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Reservations</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {receps.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>
                    {r.firstName} {r.lastName}
                  </td>
                  <td>{r.email}</td>
                  <td>{r.phone}</td>
                  <td>{r.totalReservationsHandled}</td>
                  <td>
                    <button
                      className="btn btn-info btn-sm me-2"
                      onClick={() => handleEdit(r)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(r.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
