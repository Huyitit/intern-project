import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getUsers, exportUsersSlow, deleteUser } from "../api/users";
import { type User } from "../types";
import { exportToCSV } from "../utils/csv";

export const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sort, setSort] = useState("id");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const navigate = useNavigate();

  const fetchUsersData = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await getUsers(page, limit, keyword, sort, order);
      if (response.success && response.users) {
        setUsers(response.users);
      } else {
        toast.error(response.message || "Failed to fetch users");
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, [page, limit, keyword, sort, order]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setKeyword(searchInput);
  };

  const handleSort = (column: string) => {
    if (sort === column) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSort(column);
      setOrder("asc");
    }
  };

  const handleExport = async () => {
    setExporting(true);
    toast.info("Preparing CSV export... this may take a moment.");
    try {
      // Simulate delayed endpoint from backend
      const response = await exportUsersSlow();
      if (response.success && response.users) {
        exportToCSV(response.users, "users_export.csv");
        toast.success("Export successful!");
      } else {
        toast.error("Export failed.");
      }
    } catch (err) {
      toast.error("Error during export.");
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await deleteUser(id);
      if (response.success) {
        toast.success("User deleted successfully");
        fetchUsersData();
      } else {
        toast.error(response.message || "Failed to delete user");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  return (
    <div data-testid="user-list">
      <h2>User Management</h2>
      <Link to="/dashboard">Back to Dashboard</Link>

      <form onSubmit={handleSearch}>
        <label>Search Username:</label>
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <button onClick={handleExport} disabled={exporting}>
        {exporting ? "Exporting..." : "Export to CSV"}
      </button>

      {loading ? (
        <p data-testid="loading">Loading...</p>
      ) : error ? (
        <p>Something went wrong.</p>
      ) : (
        <div>
          <table data-testid="user-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("id")}>ID {sort === "id" && (order === "asc" ? "↑" : "↓")}</th>
                <th onClick={() => handleSort("username")}>Username {sort === "username" && (order === "asc" ? "↑" : "↓")}</th>
                <th>Full Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.full_name}</td>
                  <td>
                    <button onClick={() => navigate(`/admin/users/${user.id}`)}>View</button>
                    {/* <button onClick={() => handleDelete(user.id)}>Delete</button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div>
        <button
          data-testid="prev-button"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>
        <button
          data-testid="next-button"
          disabled={users.length < limit}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};
