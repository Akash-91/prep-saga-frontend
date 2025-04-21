import React, { useState, useEffect } from 'react';

// Define the User type
interface User {
  id: string;
  email: string;
  role: string;
}

const AdminDashboard = () => {
  // Define users state with the correct type
  const [users, setUsers] = useState<User[]>([]);  // <-- This fixes the 'never[]' error

  useEffect(() => {
    // Fetch users from the backend
    fetch('/api/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(err => console.error('Error fetching users:', err));
  }, []);

  // Promote user to admin
  const promoteToAdmin = (userId: string) => {
    fetch(`/api/users/${userId}/promote`, {
      method: 'PUT',
    })
      .then(response => response.json())
      .then(() => {
        setUsers(users.map(user => user.id === userId ? { ...user, role: 'admin' } : user));
      })
      .catch(err => console.error('Error promoting user:', err));
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.email} - {user.role}
            {user.role !== 'admin' && <button onClick={() => promoteToAdmin(user.id)}>Promote to Admin</button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
