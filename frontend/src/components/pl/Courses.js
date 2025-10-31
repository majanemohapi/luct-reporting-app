import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Courses = () => {
  const [courseForm, setCourseForm] = useState({
    name: "",
    code: "",
    semester: "",
    total_registered_students: "",
  });
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [assignForm, setAssignForm] = useState({ course_id: "", lecturer_id: "" });
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  // Fetch courses & lecturers when page loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, lecturerRes] = await Promise.all([
          axios.get("/api/courses", { headers }),
          axios.get("/api/users?role=lecturer", { headers }),
        ]);
        setCourses(courseRes.data);
        setLecturers(lecturerRes.data);
      } catch (err) {
        alert("Failed to fetch courses or lecturers.");
      }
    };

    fetchData();
  }, []);

  // Handle course form input
  const handleCourseChange = (e) =>
    setCourseForm({ ...courseForm, [e.target.name]: e.target.value });

  // Handle assign form input
  const handleAssignChange = (e) =>
    setAssignForm({ ...assignForm, [e.target.name]: e.target.value });

  // Add course
  const handleAddCourse = async (e) => {
    e.preventDefault();

    const { name, code, semester, total_registered_students } = courseForm;
    if (!name || !code || !semester || !total_registered_students) {
      alert("All fields are required.");
      return;
    }

    try {
      await axios.post("/api/courses", courseForm, { headers });
      alert("✅ Course added successfully!");

      // Refresh list
      const res = await axios.get("/api/courses", { headers });
      setCourses(res.data);

      // Reset form
      setCourseForm({
        name: "",
        code: "",
        semester: "",
        total_registered_students: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add course.");
    }
  };

  // Assign lecturer to course
  const handleAssignLecturer = async (e) => {
    e.preventDefault();

    const { course_id, lecturer_id } = assignForm;
    if (!course_id || !lecturer_id) {
      alert("All fields are required.");
      return;
    }

    try {
      await axios.put(
        `/api/courses/${course_id}/assign`,
        { lecturer_id },
        { headers }
      );
      alert("✅ Lecturer assigned successfully!");

      const res = await axios.get("/api/courses", { headers });
      setCourses(res.data);

      setAssignForm({ course_id: "", lecturer_id: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign lecturer.");
    }
  };

  // Search courses
  const handleSearch = async () => {
    try {
      const res = await axios.get(`/api/search/courses?query=${searchQuery}`, {
        headers,
      });
      setCourses(res.data);
    } catch {
      alert("Search failed.");
    }
  };

  // Delete course
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await axios.delete(`/api/courses/${courseId}`, { headers });
      alert("🗑️ Course deleted successfully.");

      const res = await axios.get("/api/courses", { headers });
      setCourses(res.data);
    } catch {
      alert("Failed to delete course.");
    }
  };

  return (
    <div className="container mt-5">
      {/* Add Course */}
      <h3>Add Course</h3>
      <form onSubmit={handleAddCourse} className="mb-5">
        <div className="row">
          <div className="col-md-3 mb-3">
            <label>Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={courseForm.name}
              onChange={handleCourseChange}
            />
          </div>
          <div className="col-md-3 mb-3">
            <label>Code</label>
            <input
              type="text"
              name="code"
              className="form-control"
              value={courseForm.code}
              onChange={handleCourseChange}
            />
          </div>
          <div className="col-md-3 mb-3">
            <label>Semester</label>
            <input
              type="number"
              name="semester"
              className="form-control"
              value={courseForm.semester}
              onChange={handleCourseChange}
            />
          </div>
          <div className="col-md-3 mb-3">
            <label>Total Registered Students</label>
            <input
              type="number"
              name="total_registered_students"
              className="form-control"
              value={courseForm.total_registered_students}
              onChange={handleCourseChange}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Add Course
        </button>
      </form>

      {/* Assign Lecturer */}
      <h3>Assign Lecturer</h3>
      <form onSubmit={handleAssignLecturer} className="mb-5">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Course</label>
            <select
              name="course_id"
              className="form-control"
              value={assignForm.course_id}
              onChange={handleAssignChange}
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label>Lecturer</label>
            <select
              name="lecturer_id"
              className="form-control"
              value={assignForm.lecturer_id}
              onChange={handleAssignChange}
            >
              <option value="">Select Lecturer</option>
              {lecturers.map((lecturer) => (
                <option key={lecturer.id} value={lecturer.id}>
                  {lecturer.username}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Assign
        </button>
      </form>

      {/* Search and Course List */}
      <h3>Courses</h3>
      <div className="d-flex mb-3">
        <input
          type="text"
          placeholder="Search courses..."
          className="form-control me-2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch} className="btn btn-secondary">
          Search
        </button>
      </div>

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Code</th>
            <th>Semester</th>
            <th>Total Students</th>
            <th>Lecturer</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.length > 0 ? (
            courses.map((course) => (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>{course.name}</td>
                <td>{course.code}</td>
                <td>{course.semester}</td>
                <td>{course.total_registered_students}</td>
                <td>{course.lecturer_name || "Unassigned"}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteCourse(course.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No courses found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Courses;
