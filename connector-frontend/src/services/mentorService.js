import { INITIAL_MENTORS, INITIAL_MENTORSHIP_REQUESTS } from '../data/mockData';

export const mentorService = {
  requestMentorship(requests, mentor, student, message) {
    const newRequest = {
      id: `mreq-${Date.now()}`,
      mentorId: mentor.id,
      mentorName: mentor.name,
      studentId: student.id,
      studentName: student.name,
      studentHeadline: student.headline || 'Student',
      studentAvatar: student.avatar,
      message: message || 'I would love to learn from your experience!',
      date: new Date().toISOString(),
      status: 'Pending'
    };
    return [newRequest, ...requests];
  },

  updateRequestStatus(requests, requestId, newStatus) {
    return requests.map((req) => {
      if (req.id === requestId) {
        return { ...req, status: newStatus };
      }
      return req;
    });
  }
};
