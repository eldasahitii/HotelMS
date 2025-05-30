import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('Customer'); 

  useEffect(() => {
    fetchUsersByRole(selectedRole);
    fetchAllRoles();
  }, [selectedRole]);

  const fetchUsersByRole = async (roleType) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://localhost:7117/api/Admin/getUsersByRole?roleType=${roleType}`, {
        headers: { Authorization: token },
      });
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchAllRoles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://localhost:7117/api/Admin/getAllRoles', {
        headers: { Authorization: token },
      });
      setRoles(response.data);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  const handleRoleChange = async (userId, newRoleId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://localhost:7117/api/users/${userId}/role`,
        { roleId: newRoleId },
        { headers: { Authorization: token } }
      );
      fetchUsersByRole(selectedRole);
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center fw-bold">Admin Dashboard</h2>

      <div className="mb-4">
        <label className="form-label">Filter by Role Type:</label>
        <select
          className="form-select"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          {roles.map((role) => (
            <option key={role.roleID} value={role.roleType}>
              {role.roleType}
            </option>
          ))}
        </select>
      </div>

      <table className="table table-bordered shadow">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Current Role</th>
            <th>Change Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userID}>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.role?.roleType}</td>
              <td>
                <select
                  className="form-select"
                  value={user.roleID}
                  onChange={(e) => handleRoleChange(user.userID, e.target.value)}
                >
                  {roles.map((role) => (
                    <option key={role.roleID} value={role.roleID}>
                      {role.roleType}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
