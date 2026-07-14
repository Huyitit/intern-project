import { getUser } from "../utils/auth";
import styles from "./Dashboard.module.css";

export const Dashboard = () => {
  const user = getUser();
  const isAdmin = user?.role === "admin";

  return (
    <div className={styles.container} data-testid="dashboard-page">
      <div className={styles.glassCard}>
        <h2 data-testid="dashboard-heading">{isAdmin ? "Admin Overview" : "User Overview"}</h2>
        <p data-testid="dashboard-welcome-text">
          Welcome back, {user?.full_name}! Navigate through the application using the sidebar menu.
        </p>
      </div>
    </div>
  );
};
