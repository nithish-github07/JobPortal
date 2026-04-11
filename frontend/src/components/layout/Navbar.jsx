import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide navbar on auth pages
  const hideOn = ["/login", "/register"];
  if (hideOn.includes(location.pathname)) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav>
      <Link to="/">Applyo</Link>
      <div>
        <Link to="/jobs">Browse Jobs</Link>
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign Up</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard">Dashboard</Link>
            {user.role === "jobseeker" && (
              <>
                <Link to="/my-applications">My Applications</Link>
                <Link to="/saved-jobs">Saved Jobs</Link>
              </>
            )}
            {user.role === "recruiter" && (
              <Link to="/jobs/create">Post Job</Link>
            )}
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}