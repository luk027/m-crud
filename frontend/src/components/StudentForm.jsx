import axios from "axios";
import { useEffect, useState } from "react";

const StudentForm = () => {
  const [studentDataList, setStudentDataList] = useState([]);
  const [isError, setIsError] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [selectUserId, setSelectUserId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    password: "",
  });

  const fectchStudentData = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/users");
      if (res.status === 201) {
        setStudentDataList(res.data.data);
      }
    } catch (error) {
      console.log(error);
      setIsError("Error while fetching students data!");
    }
  };
  useEffect(() => {
    fectchStudentData();
  }, []);

  const removeStudent = async (e, id) => {
    e.preventDefault();
    let verify = confirm("Want to delete?");
    if (verify) {
      try {
        const res = await axios.delete(`http://localhost:8000/api/users/${id}`);
        if (res.status === 200) {
          fectchStudentData();
        }
      } catch (error) {
        setIsError("Error while deleting student!");
        console.log(error);
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditStudent = (e, user) => {
    e.preventDefault();
    setIsEdit(true);
    setSelectUserId(user._id);
    setFormData({
      name: user.name,
      age: user.age,
      email: user.email,
      password: user.password,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Update an existing user
    if (isEdit) {
      try {
        const res = await axios.put(
          `http://localhost:8000/api/users/${selectUserId}`,
          formData
        );
        if (res.status === 200) {
          fectchStudentData();
          setIsError("");
          setIsEdit(false);
          setSelectUserId("");
          setFormData({ name: "", age: "", email: "", password: "" });
          window.alert("Student Updated Successfully!");
        }
      } catch (error) {
        console.log(error);
        setIsError("Error while updating student.");
      }
    } else {
      //Add new user
      try {
        const res = await axios.post(
          "http://localhost:8000/api/users",
          formData
        );
        if (res.status === 201) {
          fectchStudentData();
          setIsError("");
          setFormData({ name: "", age: "", email: "", password: "" });
          window.alert("Student Created Successfully!");
        }
      } catch (error) {
        console.log(error);
        setIsError("Error while creating student.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {isError && <h3 style={{ color: "red" }}> {isError} </h3>}
      <h1>STUDENT FORM</h1>
      Name:{" "}
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
      />
      <br />
      <br />
      Age:{" "}
      <input
        type="number"
        name="age"
        value={formData.age}
        onChange={handleInputChange}
      />
      <br />
      <br />
      Email:{" "}
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
      />
      <br />
      <br />
      Password:{" "}
      <input
        type="text"
        name="password"
        value={formData.password}
        onChange={handleInputChange}
      />
      <br />
      <br />
      <button type="submit"> {isEdit ? "Update" : "Submit"}</button>
      <br />
      <br />
      <br />
      {studentDataList.length > 0 ? (
        studentDataList.map((val, index) => {
          return (
            <ul key={index}>
              <li>ID - {val._id}</li>
              <li>Name: {val.name}</li>
              <li>Age: {val.age}</li>
              <li>Email: {val.email}</li>
              <li>Password: {val.password}</li>
              <hr />
              <button onClick={(e) => handleEditStudent(e, val)}>Edit</button>
              &nbsp;
              <button onClick={(e) => removeStudent(e, val._id)}>Delete</button>
              <hr />
            </ul>
          );
        })
      ) : (
        <p>No data found!</p>
      )}
    </form>
  );
};

export default StudentForm;
