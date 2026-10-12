export type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "DONE";

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
  projectId: number;
  assignedToId: number;
  assignedTo?: {
    id: number;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  dueDate?: string;
  assignedToId: number;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  dueDate?: string;
}

export interface UpdateTaskStatusInput {
  status: TaskStatus;
}

export interface AssignTaskInput {
  assignedToId: number;
}