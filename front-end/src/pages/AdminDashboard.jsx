import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('https://localhost:7117/api/users', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(response.data);
  };

  const fetchRoles = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('https://localhost:7117/api/roles', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRoles(response.data);
  };

  const handleRoleChange = async (userId, roleId) => {
    const token = localStorage.getItem('token');
    await axios.put(`https://localhost:7117/api/users/${userId}/role`, { roleId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers(); // Refresh list
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Admin Dashboard</h2>
      <table className="table table-bordered">
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
            <tr key={user.id}>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.role?.name}</td>
              <td>
                <select
                  className="form-select"
                  value={user.roleId}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
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
