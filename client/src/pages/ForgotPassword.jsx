import { useAuth } from '../context/AuthContext';
import './ForgotPassword.css';

const ForgotPassword = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Forget Password</h1>
        </div>
        <div className="placeholder-content">
          <p>🚧 This feature is under development</p>
          <p>Password reset functionality will be implemented soon.</p>
          <a href="/login" className="link">← Back to Login</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
