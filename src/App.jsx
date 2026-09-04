import { Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import LandingPage from './pages/public/LandingPage';
import JobsPage from './pages/public/JobsPage';
import JobDetailsPage from './pages/public/JobDetailsPage';
import CompaniesPage from './pages/public/CompaniesPage';
import AboutPage from './pages/public/AboutPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import SeekerDashboard from './pages/seeker/SeekerDashboard';
import ProfilePage from './pages/seeker/ProfilePage';
import ResumePage from './pages/seeker/ResumePage';
import RecommendationsPage from './pages/seeker/RecommendationsPage';
import ApplicationsPage from './pages/seeker/ApplicationsPage';
import ApplicationDetailsPage from './pages/seeker/ApplicationDetailsPage';
import SettingsPage from './pages/seeker/SettingsPage';
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import RecruiterJobsPage from './pages/recruiter/RecruiterJobsPage';
import CreateJobPage from './pages/recruiter/CreateJobPage';
import EditJobPage from './pages/recruiter/EditJobPage';
import ApplicantsPage from './pages/recruiter/ApplicantsPage';
import CandidateDetailsPage from './pages/recruiter/CandidateDetailsPage';
import RecruiterProfilePage from './pages/recruiter/RecruiterProfilePage';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="jobs/:id" element={<JobDetailsPage />} />
        <Route path="companies" element={<CompaniesPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute role="JOB_SEEKER" />}>
        <Route path="seeker" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/seeker/dashboard" replace />} />
          <Route path="dashboard" element={<SeekerDashboard />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="jobs" element={<JobsPage seeker />} />
          <Route path="jobs/:id" element={<JobDetailsPage seeker />} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="applications/:id" element={<ApplicationDetailsPage />} />
          <Route path="recommendations" element={<RecommendationsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute role="RECRUITER" />}>
        <Route path="recruiter" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/recruiter/dashboard" replace />} />
          <Route path="dashboard" element={<RecruiterDashboard />} />
          <Route path="profile" element={<RecruiterProfilePage />} />
          <Route path="jobs" element={<RecruiterJobsPage />} />
          <Route path="jobs/create" element={<CreateJobPage />} />
          <Route path="jobs/:id" element={<JobDetailsPage seeker />} />
          <Route path="jobs/:id/edit" element={<EditJobPage />} />
          <Route path="jobs/:id/applicants" element={<ApplicantsPage />} />
          <Route path="applicants" element={<ApplicantsPage all />} />
          <Route path="applicants/:id" element={<CandidateDetailsPage />} />
          <Route path="settings" element={<SettingsPage recruiter />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
