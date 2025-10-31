import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Rating = () => {
  const [reports, setReports] = useState([]);
  const [ratings, setRatings] = useState({});
  const [studentRatings, setStudentRatings] = useState({});
  const [editing, setEditing] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  // Fetch reports and their ratings
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("/api/reports", { headers });
        setReports(res.data);

        // Fetch ratings for each report
        res.data.forEach(async (report) => {
          try {
            const ratingRes = await axios.get(
              `/api/ratings/report/${report.id}`,
              { headers }
            );
            setStudentRatings((prev) => ({
              ...prev,
              [report.id]: ratingRes.data || [],
            }));
          } catch {
            // If no ratings exist
            setStudentRatings((prev) => ({
              ...prev,
              [report.id]: [],
            }));
          }
        });
      } catch (err) {
        alert("Failed to fetch reports");
      }
    };

    fetchReports();
  }, []);

  // Handle rating input
  const handleRatingChange = (reportId, field, value) => {
    setRatings((prev) => ({
      ...prev,
      [reportId]: {
        ...prev[reportId],
        [field]: value,
      },
    }));
  };

  // Add a rating
  const handleAddRating = async (reportId) => {
    const ratingData = ratings[reportId] || { rating: 0, comments: "" };

    if (!ratingData.rating || ratingData.rating < 1 || ratingData.rating > 5) {
      alert("Rating must be between 1 and 5");
      return;
    }

    try {
      await axios.post(
        "/api/ratings",
        { report_id: reportId, ...ratingData },
        { headers }
      );
      alert("Rating added successfully!");

      // Refresh student ratings
      const res = await axios.get(`/api/ratings/report/${reportId}`, {
        headers,
      });
      setStudentRatings((prev) => ({
        ...prev,
        [reportId]: res.data,
      }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add rating");
    }
  };

  // Edit mode
  const handleEdit = (reportId) => {
    setEditing(reportId);
  };

  // Save edited rating
  const handleSaveEdit = async (reportId) => {
    try {
      await axios.put(
        `/api/ratings/${reportId}`,
        ratings[reportId],
        { headers }
      );
      alert("Rating updated successfully!");
      setEditing(null);
    } catch (err) {
      alert("Failed to update rating");
    }
  };

  // Delete rating
  const handleDelete = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this rating?")) return;

    try {
      await axios.delete(`/api/ratings/${reportId}`, { headers });
      alert("Rating deleted successfully!");

      // Remove from state
      setRatings((prev) => {
        const newRatings = { ...prev };
        delete newRatings[reportId];
        return newRatings;
      });

      // Refresh student ratings
      const res = await axios.get(`/api/ratings/report/${reportId}`, {
        headers,
      });
      setStudentRatings((prev) => ({
        ...prev,
        [reportId]: res.data,
      }));
    } catch {
      alert("Failed to delete rating");
    }
  };

  // Search reports
  const handleSearch = async () => {
    try {
      const res = await axios.get(`/api/search/reports?query=${searchQuery}`, {
        headers,
      });
      setReports(res.data);
    } catch {
      alert("Search failed");
    }
  };

  return (
    <div className="container mt-5">
      <h3>Rate Reports</h3>

      {/* Search bar */}
      <div className="d-flex mb-3">
        <input
          type="text"
          placeholder="Search reports..."
          className="form-control me-2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch} className="btn btn-secondary">
          Search
        </button>
      </div>

      {/* Reports table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Lecturer</th>
            <th>Topic</th>
            <th>Rating (1-5)</th>
            <th>Comments</th>
            <th>Students' Ratings</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">
                No reports found.
              </td>
            </tr>
          ) : (
            reports.map((report) => (
              <tr key={report.id}>
                <td>{report.id}</td>
                <td>{report.lecturer_name}</td>
                <td>{report.topic_taught}</td>

                {/* Rating input */}
                <td>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    className="form-control"
                    value={ratings[report.id]?.rating || ""}
                    onChange={(e) =>
                      handleRatingChange(report.id, "rating", e.target.value)
                    }
                    disabled={editing !== report.id && ratings[report.id]?.rating}
                  />
                </td>

                {/* Comments input */}
                <td>
                  <textarea
                    className="form-control"
                    value={ratings[report.id]?.comments || ""}
                    onChange={(e) =>
                      handleRatingChange(report.id, "comments", e.target.value)
                    }
                    disabled={editing !== report.id && ratings[report.id]?.comments}
                  />
                </td>

                {/* Students' Ratings */}
                <td>
                  {studentRatings[report.id]?.length > 0 ? (
                    <ul className="list-unstyled">
                      {studentRatings[report.id].map((r, i) => (
                        <li key={i}>
                          <strong>Rating:</strong> {r.rating} <br />
                          <strong>Comments:</strong> {r.comments}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <em>No ratings yet</em>
                  )}
                </td>

                {/* Action buttons */}
                <td>
                  {editing === report.id ? (
                    <button
                      onClick={() => handleSaveEdit(report.id)}
                      className="btn btn-success btn-sm"
                    >
                      Save
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleAddRating(report.id)}
                        className="btn btn-primary btn-sm me-2"
                      >
                        Rate
                      </button>
                      <button
                        onClick={() => handleEdit(report.id)}
                        className="btn btn-info btn-sm me-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(report.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Rating;
