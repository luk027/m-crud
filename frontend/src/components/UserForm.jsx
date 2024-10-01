import { useState, useEffect } from "react";
import axios from "axios";

const UserForm = () => {
  const [userDataObj, setUserDataObj] = useState([]);  // Store user data
  const [error, setError] = useState("");  // Store error message
  const [isEdit, setIsEdit] = useState(false);  // Flag to check if editing
  const [selectedUserId, setSelectedUserId] = useState("");  // Store selected user's ID for editing
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    password: ""
  });  // Store form input data
  let count = 1;

  // Fetch all users from the backend
  const getUsersData = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/users");
      setUserDataObj(res.data.data);
    } catch (error) {
      console.log(error);
      setError("Error fetching users.");
    }
  };
  useEffect(() => {
    getUsersData();
  }, []);

  // Add a new user or update existing user
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isEdit) {
      // Update an existing user
      try {
        const res = await axios.put(`http://localhost:8000/api/users/${selectedUserId}`, formData);
        if (res.status === 200) {
          getUsersData();
          setError("");
          setIsEdit(false);
          setSelectedUserId("");
          setFormData({ name: "", age: "", email: "", password: "" });
          window.alert("User updated successfully!");
        }
      } catch (error) {
          console.error(error);
          setError("Failed to update user.");
      }
    } else {
      // Add a new user
      try {
        const res = await axios.post("http://localhost:8000/api/users", formData);
        if (res.status === 201) {
          getUsersData();
          setError("");
          setFormData({ name: "", age: "", email: "", password: "" });
          window.alert("User added successfully!");
        }
      } catch (error) {
        console.error(error);
        setError("Failed to add user. Email might already exist.");
      }
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Edit user
  const handleEditUser = (user) => {
    setIsEdit(true);
    setSelectedUserId(user._id);
    setFormData({ name: user.name, age: user.age, email: user.email, password: user.password });
  };

  // Remove user
  const removeUser = async (e, id) => {
    let verify = confirm("Want to delete?");
    if (verify) {
      try {
        const res = await axios.delete(`http://localhost:8000/api/users/${id}`);
        if (res.status === 200) {
          getUsersData();
          window.alert("User deleted successfully!");
        }
      } catch (error) {
        console.error(error);
        setError("Failed to delete user.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <h3 style={{ color: "red" }}> {error} </h3>}
      <div>
        Name: <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
      </div>
      <div>
        Age: <input type="number" name="age" value={formData.age} onChange={handleInputChange} required />
      </div>
      <div>
        Email: <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
      </div>
      <div>
        Password: <input type="text" name="password" value={formData.password} onChange={handleInputChange} required />
      </div>
      <br />
      <button type="submit">{isEdit ? "Update" : "Submit"}</button> {/* Change button label based on mode */}
      <br />
      <br />
      {userDataObj.length > 0 ? (
        userDataObj.map((val, index) => (
          <ul key={index}>
            User-{count++}
            &nbsp;&nbsp;
            <button type="button" onClick={() => handleEditUser(val)}>Edit</button> {/* Edit button */}
            &nbsp;
            <button onClick={(e) => removeUser(e, val._id)}>Delete</button> {/* Delete button */}
            <li>Name: {val.name}</li>
            <li>Age: {val.age}</li>
            <li>Email: {val.email}</li>
            <li>Password: {val.password}</li>
            <hr />
          </ul>
        ))
      ) : (
        <p>No user available!</p>
      )}
    </form>
  );
};

export default UserForm;
