# HireMatch - Full-Stack MERN Smart Job Portal & Resume Matching System

HireMatch is a production-grade full-stack MERN (MongoDB, Express, React, Node.js) web application that connects job seekers and recruiters with real-time smart matching, resume parsing, role-based JWT authentication, and application lifecycle tracking.

---

## 🌟 Key Features

### 👤 Job Seeker Experience
- **JWT Authentication & Profile Management**: Register/login with password hashing via bcryptjs. Maintain detailed profile with skills, experience, target roles, and social links persisted in MongoDB.
- **Smart Resume Parser**: Upload resume in PDF or DOCX format with text extraction (`pdf-parse`, `mammoth`), skill detection, strengths/gaps identification, and analysis score.
- **3-Pillar Smart Matching Engine**: 
  - Skills Match (60% weight)
  - Experience Match (25% weight)
  - Location Match (15% weight)
  - Compatibility rating (Excellent $\ge 90\%$, Good $75\text{–}89\%$, Moderate $50\text{–}74\%$, Low $< 50\%$)
- **Personalized Recommendations**: Live jobs ranked by match score prioritizing unapplied positions.
- **Application Tracking**: Real-time multi-stage pipeline status (`Applied` $\rightarrow$ `Reviewing` $\rightarrow$ `Shortlisted` $\rightarrow$ `Interview` $\rightarrow$ `Hired` / `Rejected`).

### 🏢 Recruiter Experience
- **Recruiter Dashboard**: Live statistics for Jobs Posted, Total Applicants, Shortlisted, and Interviews.
- **Job Management**: Create, edit, and delete job postings with required skills, nice-to-have skills, experience requirements, work mode, and salary.
- **Candidate Ranking**: View all applicants ranked by smart match compatibility with skill breakdowns.
- **Status Lifecycle Control**: Shortlist, schedule interviews, hire, or reject candidates with live status updates.
- **Resume Inspection**: Download and review candidate resumes directly.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS, responsive design, dark/light theme
- **Routing**: React Router DOM v7 (Public, Seeker, and Recruiter protected routes)
- **Icons**: Lucide React
- **HTTP Client**: Axios with JWT Bearer interceptors

### Backend
- **Runtime**: Node.js & Express.js REST API
- **Database**: MongoDB with Mongoose ODM (indexes on search fields & unique application constraints)
- **Authentication**: JWT (JSON Web Tokens) with role-based authorization middleware
- **File Uploads & Parsing**: Multer, `pdf-parse` (PDF extraction), `mammoth` (DOCX extraction)
- **Security**: bcryptjs password hashing, CORS, sanitized inputs

---

## 📂 Project Structure

```text
Job_portal/
├── backend/
│   ├── config/              # MongoDB connection
│   ├── controllers/         # Auth, User, Job, Application, Resume, Recommendations
│   ├── middleware/          # Auth, Role authorization, Multer upload, Central Error Handler
│   ├── models/              # User, Job, Application, Resume schemas
│   ├── routes/              # Express API route declarations
│   ├── services/            # Matching algorithm & Resume text extractor
│   ├── utils/               # Database seeder (seed.js)
│   ├── uploads/resumes/     # Uploaded resume documents
│   └── server.js            # Express server entrypoint
├── src/
│   ├── components/          # Reusable UI, jobs, applications, matching, resume components
│   ├── context/             # AuthContext, ThemeContext, ToastContext
│   ├── layouts/             # PublicLayout, DashboardLayout
│   ├── pages/
│   │   ├── auth/            # LoginPage, RegisterPage, ForgotPasswordPage
│   │   ├── public/          # LandingPage, JobsPage, JobDetailsPage, CompaniesPage, AboutPage
│   │   ├── recruiter/       # RecruiterDashboard, RecruiterJobsPage, CreateJobPage, EditJobPage, ApplicantsPage, CandidateDetailsPage, RecruiterProfilePage
│   │   └── seeker/          # SeekerDashboard, ProfilePage, ResumePage, RecommendationsPage, ApplicationsPage, ApplicationDetailsPage, SettingsPage
│   ├── routes/              # ProtectedRoute
│   ├── services/            # Axios API services (auth, job, application, user, resume, recommendation)
│   └── main.jsx             # React entrypoint
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) running locally on `mongodb://localhost:27017` or a MongoDB Atlas URI.

### 2. Backend Setup
```bash
cd backend
npm install

# (Optional) Seed the database with sample jobs, seekers, and recruiters:
npm run seed

# Start backend server (runs on http://localhost:5000):
npm run dev
```

### 3. Frontend Setup
In the project root directory:
```bash
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🔑 Demo Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Job Seeker** | `candidate@example.com` | `password123` |
| **Recruiter** | `recruiter@example.com` | `password123` |

---

## 📡 REST API Summary

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user (Job Seeker / Recruiter) | Public |
| `POST` | `/api/auth/login` | Login user & return JWT token | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user info | Private |
| `GET` | `/api/users/profile` | Get user profile | Private |
| `PUT` | `/api/users/profile` | Update user profile & skills | Private |
| `GET` | `/api/jobs` | Search, filter, paginate jobs | Public |
| `GET` | `/api/jobs/:id` | Get job details & personalized match score | Public |
| `POST` | `/api/jobs` | Create new job posting | Recruiter |
| `PUT` | `/api/jobs/:id` | Update job posting | Recruiter |
| `DELETE` | `/api/jobs/:id` | Delete job posting | Recruiter |
| `GET` | `/api/jobs/recruiter/my-jobs` | Get recruiter's posted jobs | Recruiter |
| `POST` | `/api/applications` | Apply for job with resume & cover letter | Job Seeker |
| `GET` | `/api/applications/my-applications` | Get seeker's applied jobs & stages | Job Seeker |
| `GET` | `/api/applications/:id` | Get single application details | Private |
| `GET` | `/api/applications/job/:jobId` | Get ranked candidates for a job | Recruiter |
| `GET` | `/api/applications/recruiter/all` | Get all candidates across all posted jobs | Recruiter |
| `PUT` | `/api/applications/:id/status` | Update candidate hiring stage | Recruiter |
| `POST` | `/api/resumes/upload` | Upload & parse PDF/DOCX resume | Job Seeker |
| `GET` | `/api/resumes/my-resume` | Get latest uploaded resume analysis | Job Seeker |
| `GET` | `/api/resumes/download/:id` | Download resume document | Private |
| `DELETE` | `/api/resumes/:id` | Delete uploaded resume | Job Seeker |
| `GET` | `/api/recommendations/jobs` | Get smart job recommendations | Job Seeker |
