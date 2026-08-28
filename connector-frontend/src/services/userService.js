import { INITIAL_STUDENTS, INITIAL_ORGANIZATIONS } from '../data/mockData';

export const userService = {
  getStudentById(id, customStudents = []) {
    return customStudents.find((s) => s.id === id) || INITIAL_STUDENTS.find((s) => s.id === id) || INITIAL_STUDENTS[0];
  },

  getOrganizationById(id, customOrgs = []) {
    return customOrgs.find((o) => o.id === id) || INITIAL_ORGANIZATIONS.find((o) => o.id === id) || INITIAL_ORGANIZATIONS[0];
  },

  getAllStudents(customStudents = []) {
    return customStudents.length > 0 ? customStudents : INITIAL_STUDENTS;
  },

  getAllOrganizations(customOrgs = []) {
    return customOrgs.length > 0 ? customOrgs : INITIAL_ORGANIZATIONS;
  }
};
