import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Sidebar from "./components/layout/Navbar";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/auth/Profile";

// Job Pages
import JobList from "./pages/job/JobList";
import JobDetail from "./pages/job/JobDetail";
import CreateJob from "./pages/job/CreateJob";
import EditJob from "./pages/job/EditJob";

// Application Pages
import MyApplications from "./pages/application/MyApplications";
import JobApplicants from "./pages/application/JobApplicants";

// Saved Jobs
import SavedJobs from "./pages/savedJob/SavedJobs";

// Dashboard
import Dashboard from "./pages/dashboard/Dashboard";

const AppRoutes = () => {
  const location = useLocation();
  const background = location.state && location.state.background;

  return (
    <>
      <Routes location={background || location}>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/jobs" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<JobList />} />
        
        {/* Only show JobDetail as a separate page if no background (direct link) */}
        {!background && <Route path="/jobs/:id" element={<JobDetail />} />}

        {/* Any Logged In User */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />

        {/* Jobseeker Only */}
        <Route path="/my-applications" element={
          <ProtectedRoute role="jobSeeker"><MyApplications /></ProtectedRoute>
        } />
        <Route path="/saved-jobs" element={
          <ProtectedRoute role="jobSeeker"><SavedJobs /></ProtectedRoute>
        } />  

        {/* Recruiter Only */}
        <Route path="/jobs/create" element={
          <ProtectedRoute role="recruiter"><CreateJob /></ProtectedRoute>
        } />
        <Route path="/jobs/:id/edit" element={
          <ProtectedRoute role="recruiter"><EditJob /></ProtectedRoute>
        } />
        <Route path="/jobs/:jobId/applicants" element={
          <ProtectedRoute role="recruiter"><JobApplicants /></ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* Modal Route Overlay */}
      {background && (
        <Routes>
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/jobs/:id/edit" element={
            <ProtectedRoute role="recruiter"><EditJob /></ProtectedRoute>
          } />
        </Routes>
      )}
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
          <Sidebar />
          <main style={{ flex: 1, width: '100%' }}>
            <AppRoutes />
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
