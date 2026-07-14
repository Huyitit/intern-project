import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../../utils/auth';
import styles from './Header.module.css';

export const Header = () => {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftContent}>
        <h2 className={styles.pageTitle}>Dashboard</h2>
      </div>
      <div className={styles.rightContent}>
        <span className={styles.userInfo}>
          Welcome, <strong>{user?.full_name}</strong>
        </span>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </header>
  );
};
