import { INITIAL_PROJECTS } from '../data/mockData';

export const projectService = {
  createProject(projectData, currentUser) {
    const newProject = {
      id: `proj-${Date.now()}`,
      title: projectData.title,
      description: projectData.description,
      domain: projectData.domain || 'Artificial Intelligence & ML',
      requiredSkills: projectData.requiredSkills || [],
      suggestedRoles: projectData.suggestedRoles || [],
      teamSize: Number(projectData.teamSize) || 4,
      currentTeamSize: 1,
      duration: projectData.duration || '3 Months',
      workMode: projectData.workMode || 'Remote',
      lookingForTeammates: projectData.lookingForTeammates ?? true,
      status: projectData.status || 'Recruiting Teammates',
      complexity: projectData.complexity || 'Intermediate',
      githubLink: projectData.githubLink || '',
      demoLink: projectData.demoLink || '',
      createdAt: new Date().toISOString(),
      owner: {
        id: currentUser.id,
        name: currentUser.name,
        role: 'Project Creator',
        university: currentUser.university || 'University',
        avatar: currentUser.avatar
      },
      members: [
        {
          id: currentUser.id,
          name: currentUser.name,
          role: 'Project Creator / Lead',
          avatar: currentUser.avatar
        }
      ],
      openPositions: projectData.openPositions || [],
      joinRequests: []
    };
    return newProject;
  },

  submitJoinRequest(projects, projectId, requestData, currentUser) {
    return projects.map((proj) => {
      if (proj.id === projectId) {
        const newReq = {
          id: `req-${Date.now()}`,
          studentId: currentUser.id,
          studentName: currentUser.name,
          studentAvatar: currentUser.avatar,
          studentHeadline: currentUser.headline || 'Student',
          appliedRole: requestData.appliedRole || 'Teammate',
          message: requestData.message || 'I would love to join this project!',
          skills: currentUser.skills || [],
          matchScore: requestData.matchScore || 85,
          date: new Date().toISOString(),
          status: 'pending'
        };
        return {
          ...proj,
          joinRequests: [...(proj.joinRequests || []), newReq]
        };
      }
      return proj;
    });
  },

  handleJoinRequest(projects, projectId, requestId, action) {
    return projects.map((proj) => {
      if (proj.id === projectId) {
        let updatedMembers = [...proj.members];
        let currentTeamSize = proj.currentTeamSize;

        const updatedRequests = (proj.joinRequests || []).map((req) => {
          if (req.id === requestId) {
            if (action === 'accept') {
              // Add to members if not already
              if (!updatedMembers.some((m) => m.id === req.studentId)) {
                updatedMembers.push({
                  id: req.studentId,
                  name: req.studentName,
                  role: req.appliedRole,
                  avatar: req.studentAvatar
                });
                currentTeamSize += 1;
              }
              return { ...req, status: 'accepted' };
            } else {
              return { ...req, status: 'rejected' };
            }
          }
          return req;
        });

        return {
          ...proj,
          members: updatedMembers,
          currentTeamSize,
          joinRequests: updatedRequests,
          lookingForTeammates: currentTeamSize < proj.teamSize
        };
      }
      return proj;
    });
  },

  removeMember(projects, projectId, memberId) {
    return projects.map((proj) => {
      if (proj.id === projectId) {
        const updatedMembers = proj.members.filter((m) => m.id !== memberId);
        return {
          ...proj,
          members: updatedMembers,
          currentTeamSize: Math.max(1, updatedMembers.length)
        };
      }
      return proj;
    });
  }
};
