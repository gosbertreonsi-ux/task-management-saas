export interface Project {
  id: number;
  title: string;
  description: string | null;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  title: string;
  description?: string;
}

export interface UpdateProjectInput {
  title?: string;
  description?: string;
}