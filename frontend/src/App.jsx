import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Navbar from "./components/layout/Navbar";

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
``
// Dashboard
import Dashboard from "./pages/dashboard/Dashboard";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/jobs" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/jobs/:id" element={<JobDetail />} />

          {/* Any Logged In User */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />

          {/* Jobseeker Only */}
          <Route path="/my-applications" element={
            <ProtectedRoute role="jobseeker"><MyApplications /></ProtectedRoute>
          } />
          <Route path="/saved-jobs" element={
            <ProtectedRoute role="jobseeker"><SavedJobs /></ProtectedRoute>
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
      </BrowserRouter>
    </AuthProvider>
  );
}
