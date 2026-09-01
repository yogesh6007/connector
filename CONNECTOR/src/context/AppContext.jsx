import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { postService } from '../services/postService';
import { projectService } from '../services/projectService';
import { opportunityService } from '../services/opportunityService';
import { applicationService } from '../services/applicationService';
import { messageService } from '../services/messageService';
import { notificationService } from '../services/notificationService';
import { userService } from '../services/userService';
import { apiRequest } from '../services/api';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const [posts, setPosts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [recruitingProjects, setRecruitingProjects] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch Public/Feed Data
  const fetchFeed = useCallback(async () => {
    try {
      const data = await postService.getPosts();
      setPosts(data);
    } catch (e) {
      console.error('Error fetching posts:', e);
    }
  }, []);

  // Fetch Projects Catalog
  const fetchProjects = useCallback(async () => {
    try {
      const data = await projectService.getProjects();
      setProjects(data);
      const recData = await projectService.getRecruitingProjects();
      setRecruitingProjects(recData);
    } catch (e) {
      console.error('Error fetching projects:', e);
    }
  }, []);

  // Fetch My Projects
  const fetchMyProjects = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await projectService.getMyProjects();
      setMyProjects(data);
    } catch (e) {
      console.error('Error fetching my projects:', e);
    }
  }, [isAuthenticated]);

  // Fetch Opportunities
  const fetchOpportunities = useCallback(async () => {
    try {
      const data = await opportunityService.getOpportunities();
      setOpportunities(data);
    } catch (e) {
      console.error('Error fetching opportunities:', e);
    }
  }, []);

  // Fetch Applications
  const fetchApplications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      if (user?.role === 'organizer') {
        const data = await applicationService.getOrganizerApplicants();
        setApplications(data);
      } else {
        const data = await applicationService.getMyApplications();
        setApplications(data);
      }
    } catch (e) {
      console.error('Error fetching applications:', e);
    }
  }, [isAuthenticated, user?.role]);

  // Fetch Conversations
  const fetchConversations = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await messageService.getConversations();
      setConversations(data);
    } catch (e) {
      console.error('Error fetching conversations:', e);
    }
  }, [isAuthenticated]);

  // Fetch Notifications
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (e) {
      console.error('Error fetching notifications:', e);
    }
  }, [isAuthenticated]);

  // Fetch Registered Students
  const fetchStudents = useCallback(async () => {
    try {
      const data = await userService.getAllUsers({ role: 'student' });
      setStudents(data);
    } catch (e) {
      console.error('Error fetching students:', e);
    }
  }, []);

  // Load on mount and when authentication changes
  useEffect(() => {
    fetchFeed();
    fetchProjects();
    fetchOpportunities();
    fetchStudents();

    if (isAuthenticated) {
      fetchMyProjects();
      fetchApplications();
      fetchConversations();
      fetchNotifications();
    }
  }, [isAuthenticated, user?.id]);

  // Post Actions
  const createPost = async (postData) => {
    const newPost = await postService.createPost(postData);
    setPosts(prev => [newPost, ...prev]);
    return newPost;
  };

  const likePost = async (postId) => {
    const result = await postService.toggleLike(postId);
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          isLiked: result.isLiked,
          likesCount: result.likesCount
        };
      }
      return p;
    }));
  };

  const commentPost = async (postId, content) => {
    const updatedComments = await postService.addComment(postId, content);
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: updatedComments,
          commentsCount: updatedComments.length
        };
      }
      return p;
    }));
  };

  const replyComment = async (postId, commentId, content) => {
    const updatedComments = await postService.addReply(postId, commentId, content);
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: updatedComments
        };
      }
      return p;
    }));
  };

  const deleteComment = async (postId, commentId) => {
    const updatedComments = await postService.deleteComment(postId, commentId);
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: updatedComments,
          commentsCount: updatedComments.length
        };
      }
      return p;
    }));
  };

  const savePost = async (postId) => {
    const result = await postService.toggleSave(postId);
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          isSaved: result.isSaved,
          savedCount: result.savedCount
        };
      }
      return p;
    }));
  };

  const sharePost = async (postId) => {
    const result = await postService.sharePost(postId);
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          isShared: result.isShared,
          sharesCount: result.sharesCount
        };
      }
      return p;
    }));
  };

  // Project Actions
  const createProject = async (projectData) => {
    const newProj = await projectService.createProject(projectData);
    setProjects(prev => [newProj, ...prev]);
    setRecruitingProjects(prev => [newProj, ...prev]);
    setMyProjects(prev => [newProj, ...prev]);
    fetchFeed();
    return newProj;
  };

  const sendProjectInterest = async (projectId, interestData) => {
    const interest = await projectService.sendInterest(projectId, interestData);
    fetchProjects();
    fetchMyProjects();
    return interest;
  };

  const handleInterestRequest = async (projectId, interestId, action) => {
    const res = await projectService.handleInterestRequest(projectId, interestId, action);
    fetchProjects();
    fetchMyProjects();
    return res;
  };

  // Opportunity Actions
  const createOpportunity = async (oppData) => {
    const newOpp = await opportunityService.createOpportunity(oppData);
    setOpportunities(prev => [newOpp, ...prev]);
    fetchFeed();
    return newOpp;
  };

  const joinOpportunityCommunity = async (oppId) => {
    const res = await opportunityService.joinCommunity(oppId);
    fetchOpportunities();
    return res;
  };

  const applyToOpportunity = async (oppId, applicationData) => {
    const newApp = await applicationService.applyToOpportunity(oppId, applicationData);
    setApplications(prev => [newApp, ...prev]);
    fetchOpportunities();
    return newApp;
  };

  const updateApplicationStatus = async (applicationId, status, note) => {
    const updated = await applicationService.updateStatus(applicationId, status, note);
    setApplications(prev => prev.map(a => a.id === applicationId ? updated : a));
    return updated;
  };

  // Messaging Actions
  const sendMessage = async (conversationId, text, recipientId) => {
    const result = await messageService.sendMessage(conversationId, text, recipientId);
    fetchConversations();
    return result;
  };

  const startConversation = async (recipient) => {
    return sendMessage(null, '👋 Hi! I would love to connect with you.', recipient.id);
  };

  // Notification Actions
  const markNotificationAsRead = async (id) => {
    await notificationService.markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Reset database state (dev tool)
  const resetData = async () => {
    await apiRequest('/admin/db/reset', { method: 'POST' });
    setPosts([]);
    setProjects([]);
    setRecruitingProjects([]);
    setMyProjects([]);
    setOpportunities([]);
    setApplications([]);
    setConversations([]);
    setNotifications([]);
    setStudents([]);
  };

  return (
    <AppContext.Provider
      value={{
        posts,
        projects,
        recruitingProjects,
        myProjects,
        opportunities,
        applications,
        conversations,
        notifications,
        students,
        loading,
        fetchFeed,
        fetchProjects,
        fetchMyProjects,
        fetchOpportunities,
        fetchApplications,
        fetchConversations,
        fetchNotifications,
        fetchStudents,
        createPost,
        likePost,
        commentPost,
        replyComment,
        deleteComment,
        savePost,
        sharePost,
        createProject,
        sendProjectInterest,
        handleInterestRequest,
        createOpportunity,
        joinOpportunityCommunity,
        applyToOpportunity,
        updateApplicationStatus,
        sendMessage,
        startConversation,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        resetData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
