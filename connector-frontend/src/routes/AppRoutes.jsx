import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import StudentLayout from '../layouts/StudentLayout';
import OrganizerLayout from '../layouts/OrganizerLayout';
import ProtectedRoute from './ProtectedRoute';

// Public Pages
import Landing from '../pages/public/Landing';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';

// Student Pages
import StudentDashboard from '../pages/student/StudentDashboard';
import StudentFeed from '../pages/student/Feed';
import StudentExplore from '../pages/student/Explore';
import StudentProjects from '../pages/student/Projects';
import ProjectDetails from '../pages/student/ProjectDetails';
import CreateProject from '../pages/student/CreateProject';
import MyProjects from '../pages/student/MyProjects';
import FindTeammates from '../pages/student/FindTeammates';
import StudentOpportunities from '../pages/student/Opportunities';
import StudentApplications from '../pages/student/Applications';
import StudentMentors from '../pages/student/Mentors';
import StudentMessages from '../pages/student/Messages';
import StudentNotifications from '../pages/student/Notifications';
import StudentProfile from '../pages/student/Profile';
import StudentSettings from '../pages/student/Settings';

// Organizer Pages
import OrganizerDashboard from '../pages/organizer/OrganizerDashboard';
import OrganizerFeed from '../pages/organizer/Feed';
import OrganizerExplore from '../pages/organizer/Explore';
import OrganizerOpportunities from '../pages/organizer/Opportunities';
import CreateOpportunity from '../pages/organizer/CreateOpportunity';
import OrganizerApplicants from '../pages/organizer/Applicants';
import OrganizerStudents from '../pages/organizer/Students';
import OrganizerStudentProfile from '../pages/organizer/StudentProfile';
import OrganizerProjects from '../pages/organizer/Projects';
import OrganizerMentorship from '../pages/organizer/Mentorship';
import OrganizerMessages from '../pages/organizer/Messages';
import OrganizerNotifications from '../pages/organizer/Notifications';
import OrganizationProfile from '../pages/organizer/OrganizationProfile';
import OrganizerSettings from '../pages/organizer/Settings';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Student Protected Routes */}
      <Route element={<ProtectedRoute allowedRole="student" />}>
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="/student/dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="feed" element={<StudentFeed />} />
          <Route path="explore" element={<StudentExplore />} />
          <Route path="projects" element={<StudentProjects />} />
          <Route path="projects/create" element={<CreateProject />} />
          <Route path="projects/my" element={<MyProjects />} />
          <Route path="projects/:id" element={<ProjectDetails />} />
          <Route path="teammates" element={<FindTeammates />} />
          <Route path="opportunities" element={<StudentOpportunities />} />
          <Route path="applications" element={<StudentApplications />} />
          <Route path="mentors" element={<StudentMentors />} />
          <Route path="messages" element={<StudentMessages />} />
          <Route path="notifications" element={<StudentNotifications />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="settings" element={<StudentSettings />} />
        </Route>
      </Route>

      {/* Organizer Protected Routes */}
      <Route element={<ProtectedRoute allowedRole="organizer" />}>
        <Route path="/organizer" element={<OrganizerLayout />}>
          <Route index element={<Navigate to="/organizer/dashboard" replace />} />
          <Route path="dashboard" element={<OrganizerDashboard />} />
          <Route path="feed" element={<OrganizerFeed />} />
          <Route path="explore" element={<OrganizerExplore />} />
          <Route path="opportunities" element={<OrganizerOpportunities />} />
          <Route path="opportunities/create" element={<CreateOpportunity />} />
          <Route path="opportunities/:id" element={<OrganizerOpportunities />} />
          <Route path="applicants" element={<OrganizerApplicants />} />
          <Route path="students" element={<OrganizerStudents />} />
          <Route path="students/:id" element={<OrganizerStudentProfile />} />
          <Route path="projects" element={<OrganizerProjects />} />
          <Route path="mentorship" element={<OrganizerMentorship />} />
          <Route path="messages" element={<OrganizerMessages />} />
          <Route path="notifications" element={<OrganizerNotifications />} />
          <Route path="profile" element={<OrganizationProfile />} />
          <Route path="settings" element={<OrganizerSettings />} />
        </Route>
      </Route>

      {/* Fallback Catch-all Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
