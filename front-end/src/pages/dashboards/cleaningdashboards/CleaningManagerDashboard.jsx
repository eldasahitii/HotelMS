import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Select from "react-select";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import 'react-toastify/dist/ReactToastify.css';

export default function CleaningManagerDashboard() {
  const [staff, setStaff] = useState([]);
  const [users, setUsers] = useState([]);
  const [newStaff, setNewStaff] = useState({ userID: '', shift: '', isActive: true });
  const [shiftFilter, setShiftFilter] = useState('');
  const [editingStaffID, setEditingStaffID] = useState(null);
  const [editShift, setEditShift] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);
  const [currentUserID, setCurrentUserID] = useState(null);

  useEffect(() => {
    fetchData();
    fetchCurrentUser();
    toast.clearWaitingQueue();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get("/api/Auth/me", { withCredentials: true });
      setCurrentUserID(parseInt(res.data.userId || res.data.userID));
    } catch (err) {
      console.error("Failed to fetch current user", err);
    }
  };

  const fetchData = async () => {
    try {
      const staffRes = await axios.get("/api/CleaningStaff/getAllCleaningStaff", { withCredentials: true });
      setStaff(staffRes.data);

      const usersRes = await axios.get("/api/User/getAll", { withCredentials: true });
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load data.");
    }
  };

  const handleDeleteStaff = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the staff member.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/CleaningStaff/deleteCleaningStaff?id=${id}`, { withCredentials: true });
        toast.success("Staff deleted successfully.");
        fetchData();
        Swal.fire('Deleted!', 'The staff member has been deleted.', 'success');
      } catch (err) {
        toast.error("Failed to delete staff.");
        Swal.fire('Error', 'Something went wrong while deleting.', 'error');
      }
    }
  };

  const openEditForm = (staff) => {
    setEditingStaffID(staff.cleaningStaffID);
    setEditShift(staff.shift);
    setEditIsActive(staff.isActive);
  };

  const handleConfirmUpdate = async () => {
    try {
      await axios.put(
        `/api/CleaningStaff/updateCleaningStaff?id=${editingStaffID}`,
        {
          cleaningStaffID: editingStaffID,
          shift: editShift,
          isActive: editIsActive,
          assignedByUserID: currentUserID
        },
        { withCredentials: true }
      );
      toast.success("Staff updated successfully.");
      setEditingStaffID(null);
      fetchData();
    } catch (err) {
      toast.error("Failed to update staff.");
    }
  };

  const handleAddStaff = async () => {
    if (!newStaff.userID || !newStaff.shift || !currentUserID) {
      toast.warn("Please select User and Shift.");
      return;
    }
    try {
      await axios.post(
        "/api/CleaningStaff/addCleaningStaff",
        {
          userID: parseInt(newStaff.userID),
          shift: newStaff.shift,
          isActive: newStaff.isActive,
          assignedByUserID: currentUserID
        },
        { withCredentials: true }
      );
      setNewStaff({ userID: '', shift: '', isActive: true });
      toast.success("Staff added successfully.");
      fetchData();
    } catch (error) {
      toast.error("Failed to add staff.");
    }
  };

  const handleGetByShift = async () => {
    if (!shiftFilter) return;
    try {
      const result = await axios.get(`/api/CleaningStaff/getByShift?shift=${shiftFilter}`, { withCredentials: true });
      setStaff(result.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to filter by shift.");
    }
  };

  const handleShowActive = async () => {
    try {
      if (staff.length && staff.every(s => s.isActive)) {
        const allStaff = await axios.get("/api/CleaningStaff/getAllCleaningStaff", { withCredentials: true });
        setStaff(allStaff.data);
      } else {
        const activeStaff = await axios.get("/api/CleaningStaff/getAllActive", { withCredentials: true });
        setStaff(activeStaff.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load staff.");
    }
  };

 return (
    <main className="p-3" style={{ backgroundColor: '#f2f6fc', minHeight: '100dvh',paddingTop: '380px' }}>
      <h2 className="fw-bold text-primary mb-4"><i className="bi bi-people-fill me-2"></i>Cleaning Manager</h2>

      <div className="card mb-4">
        <div className="card-header" style={{ backgroundColor: '#5cb85c', color: '#fff' }}>
          <i className="bi bi-person-plus-fill me-2"></i>Add New Cleaning Staff
        </div>
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-6">
              <Select
                options={users
                  .filter(u => u.roleType === "Customer")
                  .map(user => ({
                    value: user.userID,
                    label: `${user.firstName} ${user.lastName}`
                  }))}
                value={users
                  .filter(u => u.roleType === "Customer")
                  .map(user => ({
                    value: user.userID,
                    label: `${user.firstName} ${user.lastName}`
                  }))
                  .find(option => option.value.toString() === newStaff.userID)
                }
                onChange={(selectedOption) => {
                  setNewStaff({ ...newStaff, userID: selectedOption?.value.toString() });
                }}
                placeholder="Select User..."
                isClearable
              />
              {newStaff.userID && (
                <div className="mt-2">
                  <strong>Email: </strong> {users.find(u => u.userID.toString() === newStaff.userID)?.email}
                </div>
              )}
            </div>
            <div className="col-md-6">
              <select
                className="form-control"
                value={newStaff.shift}
                onChange={e => setNewStaff({ ...newStaff, shift: e.target.value })}
              >
                <option value="">Select shift</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Night">Night</option>
              </select>
            </div>
          </div>
          <button className="btn btn-success w-100 mt-2" onClick={handleAddStaff}>
            <i className="bi bi-check-circle me-2"></i>Add Staff
          </button>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-2 mb-2">
       <div className="col-md-9">
  <Select
    className="basic-single"
    classNamePrefix="select"
    value={
      shiftFilter
        ? { value: shiftFilter, label: shiftFilter }
        : null
    }
    isClearable
    placeholder="Filter by Shifts"
    onChange={(selected) => setShiftFilter(selected ? selected.value : "")}
    options={[
      { value: "Morning", label: "Morning" },
      { value: "Afternoon", label: "Afternoon" },
      { value: "Night", label: "Night" },
    ]}
  />
</div>

            <div className="col-md-3">
              <button className="btn btn-outline-primary w-100" onClick={handleGetByShift}>
                <i className="bi bi-filter me-2"></i>Filter
              </button>
            </div>
            <button
              className="btn btn-outline-success w-100 mt-2 py-2"
              style={{ height: '48px', fontWeight: 500 }}
              onClick={handleShowActive}
            >
              <i className="bi bi-person-check me-2"></i> Show Active
            </button>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header" style={{ backgroundColor: '#7ca8d8', color: '#fff' }}>
          <i className="bi bi-people-fill me-2"></i>Cleaning Staff
        </div>
        <div className="table-responsive">
          <table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Shift</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s, index) => (
                <tr key={s.cleaningStaffID}>
                  <td>{index + 1}</td>
                  <td>{s.firstName} {s.lastName}</td>
                  <td>{s.email}</td>
                  <td>
                    {editingStaffID === s.cleaningStaffID ? (
                      <select className="form-select form-select-sm" value={editShift} onChange={e => setEditShift(e.target.value)}>
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                        <option value="Night">Night</option>
                      </select>
                    ) : s.shift}
                  </td>
                  <td>
                    {editingStaffID === s.cleaningStaffID ? (
                      <select className="form-select form-select-sm" value={editIsActive} onChange={e => setEditIsActive(e.target.value === "true")}>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    ) : (s.isActive ? "Active" : "Inactive")}
                  </td>
                  <td>
                    {editingStaffID === s.cleaningStaffID ? (
                      <>
                        <button className="btn btn-sm btn-dark me-2" onClick={handleConfirmUpdate}>Save</button>
                        <button className="btn btn-sm btn-secondary" onClick={() => setEditingStaffID(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-sm btn-outline-danger me-2" onClick={() => handleDeleteStaff(s.cleaningStaffID)}>
                          <i className="bi bi-trash"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-dark me-2" onClick={() => openEditForm(s)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
