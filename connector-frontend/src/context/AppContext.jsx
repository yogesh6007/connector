import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_STUDENTS,
  INITIAL_ORGANIZATIONS,
  INITIAL_PROJECTS,
  INITIAL_POSTS,
  INITIAL_OPPORTUNITIES,
  INITIAL_APPLICATIONS,
  INITIAL_MENTORS,
  INITIAL_MENTORSHIP_REQUESTS,
  INITIAL_CONVERSATIONS,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';
import { postService } from '../services/postService';
import { projectService } from '../services/projectService';
import { opportunityService } from '../services/opportunityService';
import { applicationService } from '../services/applicationService';
import { mentorService } from '../services/mentorService';
import { messageService } from '../services/messageService';
import { notificationService } from '../services/notificationService';
import { useAuth } from './AuthContext';

const AppContext = createContext();

function loadState(key, fallback) {
  try {
    const saved = localStorage.getItem(`connector_${key}`);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function saveState(key, value) {
  try {
    localStorage.setItem(`connector_${key}`, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to save state', err);
  }
}

export function AppProvider({ children }) {
  const { currentUser } = useAuth();

  const [posts, setPosts] = useState(() => loadState('posts', INITIAL_POSTS));
  const [projects, setProjects] = useState(() => loadState('projects', INITIAL_PROJECTS));
  const [opportunities, setOpportunities] = useState(() => loadState('opportunities', INITIAL_OPPORTUNITIES));
  const [applications, setApplications] = useState(() => loadState('applications', INITIAL_APPLICATIONS));
  const [mentors, setMentors] = useState(() => loadState('mentors', INITIAL_MENTORS));
  const [mentorshipRequests, setMentorshipRequests] = useState(() => loadState('mentorship_requests', INITIAL_MENTORSHIP_REQUESTS));
  const [conversations, setConversations] = useState(() => loadState('conversations', INITIAL_CONVERSATIONS));
  const [notifications, setNotifications] = useState(() => loadState('notifications', INITIAL_NOTIFICATIONS));
  const [students, setStudents] = useState(() => loadState('students', INITIAL_STUDENTS));
  const [organizations, setOrganizations] = useState(() => loadState('organizations', INITIAL_ORGANIZATIONS));

  const [followingIds, setFollowingIds] = useState(() => loadState('following_ids', ['student-2', 'org-1']));
  const [savedProjectIds, setSavedProjectIds] = useState(() => loadState('saved_projects', ['proj-1']));
  const [savedOpportunityIds, setSavedOpportunityIds] = useState(() => loadState('saved_opportunities', ['opp-1']));
  const [toasts, setToasts] = useState([]);

  // Auto-sync with localStorage
  useEffect(() => saveState('posts', posts), [posts]);
  useEffect(() => saveState('projects', projects), [projects]);
  useEffect(() => saveState('opportunities', opportunities), [opportunities]);
  useEffect(() => saveState('applications', applications), [applications]);
  useEffect(() => saveState('mentorship_requests', mentorshipRequests), [mentorshipRequests]);
  useEffect(() => saveState('conversations', conversations), [conversations]);
  useEffect(() => saveState('notifications', notifications), [notifications]);
  useEffect(() => saveState('students', students), [students]);
  useEffect(() => saveState('organizations', organizations), [organizations]);
  useEffect(() => saveState('following_ids', followingIds), [followingIds]);
  useEffect(() => saveState('saved_projects', savedProjectIds), [savedProjectIds]);
  useEffect(() => saveState('saved_opportunities', savedOpportunityIds), [savedOpportunityIds]);

  // Toast Helper
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Follow / Unfollow Toggle
  const toggleFollow = (targetId, targetName = '') => {
    setFollowingIds((prev) => {
      const isFollowing = prev.includes(targetId);
      const next = isFollowing ? prev.filter((id) => id !== targetId) : [...prev, targetId];
      addToast(isFollowing ? `Unfollowed ${targetName || 'user'}` : `Now following ${targetName || 'user'}!`, 'info');
      return next;
    });
  };

  // Saved Items
  const toggleSaveProject = (projectId) => {
    setSavedProjectIds((prev) => {
      const isSaved = prev.includes(projectId);
      const next = isSaved ? prev.filter((id) => id !== projectId) : [...prev, projectId];
      addToast(isSaved ? 'Project removed from saved items' : 'Project saved to your bookmarks!', 'success');
      return next;
    });
  };

  const toggleSaveOpportunity = (oppId) => {
    setSavedOpportunityIds((prev) => {
      const isSaved = prev.includes(oppId);
      const next = isSaved ? prev.filter((id) => id !== oppId) : [...prev, oppId];
      addToast(isSaved ? 'Opportunity removed from bookmarks' : 'Opportunity saved to your bookmarks!', 'success');
      return next;
    });
  };

  // Post Actions
  const createPost = (postData) => {
    const newPost = postService.createPost(postData, currentUser);
    setPosts((prev) => [newPost, ...prev]);
    addToast('Post published to CONNECTOR Feed!', 'success');
    return newPost;
  };

  const togglePostLike = (postId) => {
    setPosts((prev) => postService.toggleLike(prev, postId));
  };

  const togglePostSave = (postId) => {
    setPosts((prev) => postService.toggleSave(prev, postId));
    addToast('Post bookmark updated', 'info');
  };

  const addComment = (postId, commentText) => {
    setPosts((prev) => postService.addComment(prev, postId, commentText, currentUser));
    addToast('Comment added!', 'success');
  };

  const addReply = (postId, commentId, replyText) => {
    setPosts((prev) => postService.addReply(prev, postId, commentId, replyText, currentUser));
    addToast('Reply sent!', 'success');
  };

  // Project Actions
  const createProject = (projectData) => {
    const newProject = projectService.createProject(projectData, currentUser);
    setProjects((prev) => [newProject, ...prev]);
    addToast(`Project "${newProject.title}" published successfully!`, 'success');
    return newProject;
  };

  const submitJoinRequest = (projectId, requestData) => {
    setProjects((prev) => projectService.submitJoinRequest(prev, projectId, requestData, currentUser));
    addToast('Join request sent to project leader!', 'success');

    // Notify project leader
    const proj = projects.find((p) => p.id === projectId);
    if (proj) {
      setNotifications((prev) =>
        notificationService.addNotification(prev, {
          type: 'teammate_request',
          title: 'New Join Request',
          content: `${currentUser.name} requested to join "${proj.title}" as ${requestData.appliedRole || 'Teammate'}.`,
          link: '/student/projects/my',
          avatar: currentUser.avatar
        })
      );
    }
  };

  const handleJoinRequest = (projectId, requestId, action) => {
    setProjects((prev) => projectService.handleJoinRequest(prev, projectId, requestId, action));
    addToast(action === 'accept' ? 'Teammate accepted into the project team!' : 'Join request declined.', action === 'accept' ? 'success' : 'info');
  };

  const removeMember = (projectId, memberId) => {
    setProjects((prev) => projectService.removeMember(prev, projectId, memberId));
    addToast('Team member removed from project.', 'info');
  };

  // Opportunity Actions
  const createOpportunity = (oppData) => {
    const newOpp = opportunityService.createOpportunity(oppData, currentUser);
    setOpportunities((prev) => [newOpp, ...prev]);
    addToast(`Opportunity "${newOpp.title}" created successfully!`, 'success');
    return newOpp;
  };

  const updateOpportunityStatus = (oppId, newStatus) => {
    setOpportunities((prev) => opportunityService.updateOpportunityStatus(prev, oppId, newStatus));
    addToast(`Opportunity status updated to ${newStatus}`, 'info');
  };

  // Application Actions
  const applyToOpportunity = (opportunity, applicationData) => {
    const nextApps = applicationService.applyToOpportunity(applications, opportunity, currentUser, applicationData);
    setApplications(nextApps);

    // Increase opportunity applicant count
    setOpportunities((prev) =>
      prev.map((o) => (o.id === opportunity.id ? { ...o, applicantsCount: (o.applicantsCount || 0) + 1 } : o))
    );

    addToast(`Application submitted to ${opportunity.organization?.name || 'Organization'}!`, 'success');

    // Add confirmation notification
    setNotifications((prev) =>
      notificationService.addNotification(prev, {
        type: 'application_submitted',
        title: 'Application Submitted',
        content: `Your application for "${opportunity.title}" was submitted successfully.`,
        link: '/student/applications',
        avatar: opportunity.organization?.logo
      })
    );
  };

  const updateApplicationStatus = (appId, newStatus) => {
    setApplications((prev) => applicationService.updateApplicationStatus(prev, appId, newStatus));
    addToast(`Applicant status changed to "${newStatus}"`, 'success');

    // Send notification to applicant
    const app = applications.find((a) => a.id === appId);
    if (app) {
      setNotifications((prev) =>
        notificationService.addNotification(prev, {
          type: 'application_update',
          title: `Application Update: ${newStatus}`,
          content: `Your application for "${app.opportunityTitle}" is now marked as ${newStatus}.`,
          link: '/student/applications'
        })
      );
    }
  };

  // Mentorship Actions
  const requestMentorship = (mentor, message) => {
    const nextRequests = mentorService.requestMentorship(mentorshipRequests, mentor, currentUser, message);
    setMentorshipRequests(nextRequests);
    addToast(`Mentorship request sent to ${mentor.name}!`, 'success');
  };

  const handleMentorshipRequest = (requestId, newStatus) => {
    setMentorshipRequests((prev) => mentorService.updateRequestStatus(prev, requestId, newStatus));
    addToast(`Mentorship request marked as ${newStatus}`, 'info');
  };

  // Messaging Actions
  const sendMessage = (convId, text) => {
    setConversations((prev) => messageService.sendMessage(prev, convId, text, currentUser.id));
  };

  const startConversation = (targetUser, initialMessage) => {
    const updated = messageService.startConversation(conversations, targetUser, initialMessage, currentUser.id);
    setConversations(updated);
    addToast(`Conversation opened with ${targetUser.name}`, 'info');
    return updated[0];
  };

  // Notification Actions
  const markNotificationRead = (notifId) => {
    setNotifications((prev) => notificationService.markAsRead(prev, notifId));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => notificationService.markAllAsRead(prev));
    addToast('All notifications marked as read', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        posts,
        projects,
        opportunities,
        applications,
        mentors,
        mentorshipRequests,
        conversations,
        notifications,
        students,
        organizations,
        followingIds,
        savedProjectIds,
        savedOpportunityIds,
        toasts,
        addToast,
        removeToast,
        toggleFollow,
        toggleSaveProject,
        toggleSaveOpportunity,
        createPost,
        togglePostLike,
        togglePostSave,
        addComment,
        addReply,
        createProject,
        submitJoinRequest,
        handleJoinRequest,
        removeMember,
        createOpportunity,
        updateOpportunityStatus,
        applyToOpportunity,
        updateApplicationStatus,
        requestMentorship,
        handleMentorshipRequest,
        sendMessage,
        startConversation,
        markNotificationRead,
        markAllNotificationsRead
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
