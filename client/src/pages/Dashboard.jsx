import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h2>GearGuard</h2>
        <button onClick={handleLogout} className="btn btn-logout">
          Logout
        </button>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-card">
          <h1>Welcome to GearGuard! 🎉</h1>
          <div className="user-info">
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            {user?.phone && <p><strong>Phone:</strong> {user?.phone}</p>}
            <p><strong>Role:</strong> {user?.role}</p>
            <p><strong>Status:</strong> <span className="status-badge">{user?.is_active ? 'Active' : 'Inactive'}</span></p>
          </div>
          <div className="info-message">
            <p>✅ Authentication successful!</p>
            <p>You are now logged into your portal account.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
