import api from "./api";

import type {
  CreateProjectInput,
  Project,
  UpdateProjectInput,
} from "../types/project";

import type {
  AddMemberInput,
  ProjectMember,
  User,
} from "../types/member";

/*
|--------------------------------------------------------------------------
| Projects
|--------------------------------------------------------------------------
*/

export const getProjects =
  async (): Promise<Project[]> => {
    const response =
      await api.get("/projects");

    return response.data.projects ??
      response.data;
  };

export const getProjectById =
  async (
    id: number
  ): Promise<Project> => {
    const response =
      await api.get(`/projects/${id}`);

    return response.data.project ??
      response.data;
  };

export const createProject =
  async (
    data: CreateProjectInput
  ): Promise<Project> => {
    const response =
      await api.post(
        "/projects",
        data
      );

    return response.data.project ??
      response.data;
  };

export const updateProject =
  async (
    id: number,
    data: UpdateProjectInput
  ): Promise<Project> => {
    const response =
      await api.patch(
        `/projects/${id}`,
        data
      );

    return response.data.project ??
      response.data;
  };

export const deleteProject =
  async (
    id: number
  ): Promise<void> => {
    await api.delete(
      `/projects/${id}`
    );
  };

/*
|--------------------------------------------------------------------------
| Project Members
|--------------------------------------------------------------------------
*/

export const getProjectMembers =
  async (
    projectId: number
  ): Promise<ProjectMember[]> => {
    const response =
      await api.get(
        `/projects/${projectId}/members`
      );

    return response.data.members ??
      response.data;
  };

export const addProjectMember =
  async (
    projectId: number,
    data: AddMemberInput
  ): Promise<ProjectMember> => {
    const response =
      await api.post(
        `/projects/${projectId}/members`,
        data
      );

    return response.data.member ??
      response.data;
  };

export const removeProjectMember =
  async (
    projectId: number,
    userId: number
  ): Promise<void> => {
    await api.delete(
      `/projects/${projectId}/members/${userId}`
    );
  };

  export const getAvailableProjectMembers =
  async (
    projectId: number
  ): Promise<User[]> => {
    const response =
      await api.get(
        `/projects/${projectId}/members/available`
      );

    return (
      response.data.users ??
      response.data
    );
  };