// src/services/managerService.ts
import api from './backendService';
import { Project } from '../types';

export const managerService = {
  async getManagerProfile(firebaseUid: string): Promise<any> {
    const response = await api.api.get(`/manager/profile/${firebaseUid}`);
    return response.data;
  },

  async getManagerDashboard(firebaseUid: string | number): Promise<any> { // ✅ Accept both string and number
    const response = await api.api.get(`/manager/dashboard/${firebaseUid}`);
    return response.data;
  },

  async getManagerProjects(firebaseUid: string | number): Promise<Project[]> { // ✅ Accept both string and number
    const response = await api.api.get(`/manager/projects/${firebaseUid}`);
    return response.data;
  },

  // ARCHIVE FUNCTIONALITY - NEW METHODS
  async archiveProject(projectId: string): Promise<any> {
    const response = await api.api.patch(`/projects/${projectId}/archive`);
    return response.data;
  },

  async unarchiveProject(projectId: string): Promise<any> {
    const response = await api.api.patch(`/projects/${projectId}/unarchive`);
    return response.data;
  },
// ADD TO YOUR EXISTING managerService.ts
async getArchivedManagerProjects(firebaseUid: string | number): Promise<Project[]> {
  const response = await api.api.get(`/manager/projects/${firebaseUid}/archived`);
  return response.data;
}
};