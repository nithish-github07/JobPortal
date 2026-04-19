import api from "./axios";

// ─── Auth ─────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
};

// ─── User ─────────────────────────────────────────────
export const userAPI = {
  getProfile: () => api.get("/user/profile"),
  updateProfile: (data) => api.put("/user/profile", data),
  uploadResume: (formData) =>
    api.post("/user/resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteAccount: () => api.delete("/user/account"),
};

// ─── Jobs ──────────────────────────────────────────────
export const jobAPI = {
  create: (data) => api.post("/jobs", data),
  getAll: (params) => api.get("/jobs", { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
};

// ─── Applications ─────────────────────────────────────
export const applicationAPI = {
  apply: (jobId, data) => api.post(`/application/${jobId}`, data),
  myApplications: () => api.get("/application/my"),
  jobApplicants: (jobId) => api.get(`/application/job/${jobId}`),
  updateStatus: (id, status) =>
    api.patch(`/application/${id}/status`, { status }),
  withdraw: (id) => api.delete(`/application/${id}`),
};

// ─── Saved Jobs ────────────────────────────────────────
export const savedJobAPI = {
  save: (jobId) => api.post(`/savedJob/${jobId}`),
  getSaved: () => api.get("/savedJob"),
  remove: (jobId) => api.delete(`/savedJob/${jobId}`),
};

// ─── Dashboard ─────────────────────────────────────────
export const dashboardAPI = {
  recruiterStats: () => api.get("/dashboard/recruiter/stats"),
  recruiterRecentApplications: () =>
    api.get("/dashboard/recruiter/recent-applications"),
  userStats: () => api.get("/dashboard/user/stats"),
  userSavedJobs: () => api.get("/dashboard/user/saved-jobs"),
};