import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getUser } from '../../utils/auth';
import styles from './Sidebar.module.css';

export const Sidebar = () => {
  const user = getUser();
  const isAdmin = user?.role === "admin";
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <h2>User Management</h2>
      </div>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link to="/dashboard" className={`${styles.navLink} ${isActive('/dashboard') ? styles.active : ''}`}>
              Dashboard
            </Link>
          </li>
          
          {isAdmin && (
            <>
              <li className={styles.navItem}>
                <Link to="/admin/users" className={`${styles.navLink} ${isActive('/admin/users') ? styles.active : ''}`}>
                  Manage Users
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link to="/admin/users/create" className={`${styles.navLink} ${isActive('/admin/users/create') ? styles.active : ''}`}>
                  Create User
                </Link>
              </li>
            </>
          )}

          <li className={styles.navItem}>
            <Link to="/profile" className={`${styles.navLink} ${isActive('/profile') ? styles.active : ''}`}>
              Profile
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/avatar" className={`${styles.navLink} ${isActive('/avatar') ? styles.active : ''}`}>
              Upload Avatar
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};
