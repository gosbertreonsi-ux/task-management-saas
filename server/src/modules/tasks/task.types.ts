export interface CreateTaskInput {
  title: string;

  description?: string;

  status?:
    | "TODO"
    | "IN_PROGRESS"
    | "DONE";

  dueDate?: Date;

  projectId: number;

  assignedToId: number;
}