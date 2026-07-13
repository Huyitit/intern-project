import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getUsers, exportUsersSlow, deleteUser } from "../api/users";
import { type User } from "../types";
import { exportToCSV } from "../utils/csv";
import styles from "./UserList.module.css";

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

  // const handleDelete = async (id: number) => {
  //   if (!window.confirm("Are you sure you want to delete this user?")) return;
  //   try {
  //     const response = await deleteUser(id);
  //     if (response.success) {
  //       toast.success("User deleted successfully");
  //       fetchUsersData();
  //     } else {
  //       toast.error(response.message || "Failed to delete user");
  //     }
  //   } catch (err) {
  //     toast.error("An error occurred");
  //   }
  // };

  return (
    <div className={styles.container} data-testid="user-list-page">
      <div className={styles.header}>
        <h2 data-testid="user-list-heading">User Management</h2>
        <div className={styles.actions}>
          <form className={styles.searchForm} data-testid="user-list-search-form" onSubmit={handleSearch}>
            <input
              className={styles.searchInput}
              placeholder="Search Username..."
              data-testid="user-list-search-input"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button className={styles.searchBtn} data-testid="user-list-search-btn" type="submit">Search</button>
          </form>
          <button className={styles.exportBtn} data-testid="user-list-export-btn" onClick={handleExport} disabled={exporting}>
            {exporting ? "Exporting..." : "Export CSV"}
          </button>
        </div>
      </div>

      {loading ? (
        <p className={styles.loading} data-testid="user-list-loading">Loading users...</p>
      ) : error ? (
        <p className={styles.error} data-testid="user-list-error">Something went wrong fetching users.</p>
      ) : (
        <div className={styles.tableContainer} data-testid="user-list-table-container">
          <table className={styles.table} data-testid="user-list-table">
            <thead data-testid="user-list-thead">
              <tr data-testid="user-list-tr-header">
                <th data-testid="user-list-th-id" onClick={() => handleSort("id")}>ID {sort === "id" && (order === "asc" ? "↑" : "↓")}</th>
                <th data-testid="user-list-th-username" onClick={() => handleSort("username")}>Username {sort === "username" && (order === "asc" ? "↑" : "↓")}</th>
                <th data-testid="user-list-th-fullname">Full Name</th>
                <th data-testid="user-list-th-actions">Actions</th>
              </tr>
            </thead>
            <tbody data-testid="user-list-tbody">
              {users.length > 0 ? users.map((user) => (
                <tr data-testid={`user-list-tr-${user.id}`} key={user.id}>
                  <td data-testid={`user-list-td-id-${user.id}`}>{user.id}</td>
                  <td data-testid={`user-list-td-username-${user.id}`}>{user.username}</td>
                  <td data-testid={`user-list-td-fullname-${user.id}`}>{user.full_name}</td>
                  <td data-testid={`user-list-td-actions-${user.id}`}>
                    <button className={styles.viewBtn} data-testid={`user-list-view-btn-${user.id}`} onClick={() => navigate(`/admin/users/${user.id}`)}>View Profile</button>
                  </td>
                </tr>
              )) : 
              <tr data-testid="user-list-tr-no-users">
                <td data-testid="user-list-td-no-users">No users found</td>
              </tr>
              }
            </tbody>
          </table>
        </div>
      )}

      <div className={styles.pagination} data-testid="user-list-pagination-group">
        <button
          className={styles.pageBtn}
          data-testid="prev-button"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <button
          className={styles.pageBtn}
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
