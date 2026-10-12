export interface CreateProjectInput {
  title: string;
  description?: string;
}

export interface UpdateProjectInput {
  title?: string;
  description?: string;
}