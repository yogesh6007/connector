import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROLES } from '../utils/constants';
import { RouteGuard } from './RouteGuard';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout';
import { StudentLayout } from '../layouts/StudentLayout';
import { OrganizerLayout } from '../layouts/OrganizerLayout';

// Public Pages
import { Landing } from '../pages/public/Landing';
import { Login } from '../pages/public/Login';
import { Register } from '../pages/public/Register';

// Student Pages
import { StudentDashboard } from '../pages/student/StudentDashboard';
import { Feed } from '../pages/student/Feed';
import { Explore } from '../pages/student/Explore';
import { Projects } from '../pages/student/Projects';
import { ProjectDetails } from '../pages/student/ProjectDetails';
import { CreateProject } from '../pages/student/CreateProject';
import { MyProjects } from '../pages/student/MyProjects';
import { FindTeammates } from '../pages/student/FindTeammates';
import { Opportunities } from '../pages/student/Opportunities';
import { OpportunityDetails } from '../pages/student/OpportunityDetails';
import { Applications } from '../pages/student/Applications';
import { Messages } from '../pages/student/Messages';
import { Notifications } from '../pages/student/Notifications';
import { Profile } from '../pages/student/Profile';
import { Settings } from '../pages/student/Settings';

// Organizer Pages
import { OrganizerDashboard } from '../pages/organizer/OrganizerDashboard';
import { OrganizerFeed } from '../pages/organizer/Feed';
import { OrganizerOpportunities } from '../pages/organizer/Opportunities';
import { CreateOpportunity } from '../pages/organizer/CreateOpportunity';
import { Applicants } from '../pages/organizer/Applicants';
import { Students } from '../pages/organizer/Students';
import { OrganizerStudentProfile } from '../pages/organizer/StudentProfile';
import { OrganizerProjects } from '../pages/organizer/Projects';
import { OrganizationProfile } from '../pages/organizer/OrganizationProfile';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Student Workspace Routes */}
      <Route
        path="/student"
        element={
          <RouteGuard allowedRoles={[ROLES.STUDENT]}>
            <StudentLayout />
          </RouteGuard>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="feed" element={<Feed />} />
        <Route path="explore" element={<Explore />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/create" element={<CreateProject />} />
        <Route path="projects/my" element={<MyProjects />} />
        <Route path="projects/:id" element={<ProjectDetails />} />
        <Route path="teammates" element={<FindTeammates />} />
        <Route path="opportunities" element={<Opportunities />} />
        <Route path="opportunities/:id" element={<OpportunityDetails />} />
        <Route path="applications" element={<Applications />} />
        <Route path="messages" element={<Messages />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
        <Route path="profile/:id" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Organizer Workspace Routes */}
      <Route
        path="/organizer"
        element={
          <RouteGuard allowedRoles={[ROLES.ORGANIZER]}>
            <OrganizerLayout />
          </RouteGuard>
        }
      >
        <Route index element={<Navigate to="/organizer/dashboard" replace />} />
        <Route path="dashboard" element={<OrganizerDashboard />} />
        <Route path="feed" element={<OrganizerFeed />} />
        <Route path="explore" element={<Explore />} />
        <Route path="opportunities" element={<OrganizerOpportunities />} />
        <Route path="opportunities/create" element={<CreateOpportunity />} />
        <Route path="opportunities/:id" element={<OpportunityDetails />} />
        <Route path="applicants" element={<Applicants />} />
        <Route path="students" element={<Students />} />
        <Route path="students/:id" element={<OrganizerStudentProfile />} />
        <Route path="projects" element={<OrganizerProjects />} />
        <Route path="messages" element={<Messages />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<OrganizationProfile />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
