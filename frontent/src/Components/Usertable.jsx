import { useState, useEffect } from "react";
import axios from "axios";

function Usertable() {
  const [users, setUsers] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: "",
    name: "",
    email: "",
    dob: "",
    password: "",
  });
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    dob: "",
    password: "",
  });

  const API_URL = "http://localhost:3000/api/users"; // Change to your API URL

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users function
  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      //   console.log(response);
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // Open the Update Modal with user data
  const showUpdateModal = (user) => {
    setCurrentUser(user);
    setIsUpdateModalOpen(true);
  };

  // Close the Update Modal
  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };

  // Open the Create Modal
  const showCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  // Close the Create Modal
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  // Handle user update
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/${currentUser.id}`, currentUser);
      fetchUsers(); // Refresh the user list
      closeUpdateModal();
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  // Handle user create
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, newUser);
      fetchUsers(); // Refresh the user list
      closeCreateModal();
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  // Handle delete user
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchUsers(); // Refresh the user list
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // Handle input changes for update and create forms
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // console.log(name, value);
    if (isUpdateModalOpen) {
      setCurrentUser({ ...currentUser, [name]: value });
    } else {
      setNewUser({ ...newUser, [name]: value });
    }
  };

  return (
    <div className="container mx-auto p-6 border-2">
      <h1 className="text-3xl font-bold text-center mb-6">User Management</h1>

      {/* Add New User Button */}
      <div className="mb-4 text-right">
        <button
          onClick={showCreateModal}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New User
        </button>
      </div>

      {/* Users Table */}
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Name</th>
            <th className="py-2 px-4 border-b text-left">Email</th>
            <th className="py-2 px-4 border-b text-left">Date of Birth</th>
            <th className="py-2 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b">{user.name}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">
                {" "}
                {new Date(user.dob).toLocaleDateString()}
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => showUpdateModal(user)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Create User</h2>
            <form onSubmit={handleCreateSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={newUser.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={newUser.dob}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block">Password</label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update User Modal */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Update User</h2>
            <form onSubmit={handleUpdateSubmit}>
              <input type="hidden" name="id" value={currentUser.id} />
              <div className="mb-4">
                <label className="block">Name</label>
                <input
                  type="text"
                  name="name"
                  value={currentUser.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block">Email</label>
                <input
                  type="email"
                  name="email"
                  value={currentUser.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={currentUser.dob}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block">Password</label>
                <input
                  type="password"
                  name="password"
                  value={currentUser.password}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={closeUpdateModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Usertable;
