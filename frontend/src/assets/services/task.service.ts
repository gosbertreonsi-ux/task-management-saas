import api from "./api";

import type {
  AssignTaskInput,
  CreateTaskInput,
  Task,
  UpdateTaskInput,
  UpdateTaskStatusInput,
} from "../types/task";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const unwrapTasks = (
  data: any
): Task[] => {
  return data.tasks ?? data;
};

const unwrapTask = (
  data: any
): Task => {
  return data.task ?? data;
};

/*
|--------------------------------------------------------------------------
| Project Tasks
|--------------------------------------------------------------------------
*/

export const getProjectTasks =
  async (
    projectId: number
  ): Promise<Task[]> => {
    const response =
      await api.get(
        `/projects/${projectId}/tasks`
      );

    return unwrapTasks(
      response.data
    );
  };

/*
|--------------------------------------------------------------------------
| Create Task
|--------------------------------------------------------------------------
*/

export const createTask =
  async (
    projectId: number,
    data: CreateTaskInput
  ): Promise<Task> => {
    const response =
      await api.post(
        `/projects/${projectId}/tasks`,
        data
      );

    return unwrapTask(
      response.data
    );
  };

/*
|--------------------------------------------------------------------------
| Get Task
|--------------------------------------------------------------------------
*/

export const getTaskById =
  async (
    id: number
  ): Promise<Task> => {
    const response =
      await api.get(
        `/tasks/${id}`
      );

    return unwrapTask(
      response.data
    );
  };

/*
|--------------------------------------------------------------------------
| Update Task
|--------------------------------------------------------------------------
*/

export const updateTask =
  async (
    id: number,
    data: UpdateTaskInput
  ): Promise<Task> => {
    const response =
      await api.patch(
        `/tasks/${id}`,
        data
      );

    return unwrapTask(
      response.data
    );
  };

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

export const updateTaskStatus =
  async (
    id: number,
    data: UpdateTaskStatusInput
  ): Promise<Task> => {
    const response =
      await api.patch(
        `/tasks/${id}/status`,
        data
      );

    return unwrapTask(
      response.data
    );
  };

/*
|--------------------------------------------------------------------------
| Assign Task
|--------------------------------------------------------------------------
*/

export const assignTask =
  async (
    id: number,
    data: AssignTaskInput
  ): Promise<Task> => {
    const response =
      await api.patch(
        `/tasks/${id}/assign`,
        data
      );

    return unwrapTask(
      response.data
    );
  };

/*
|--------------------------------------------------------------------------
| Delete Task
|--------------------------------------------------------------------------
*/

export const deleteTask =
  async (
    id: number
  ): Promise<void> => {
    await api.delete(
      `/tasks/${id}`
    );
  };