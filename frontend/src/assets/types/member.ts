export interface MemberRole {
  id: number;
  name: "ADMIN" | "MEMBER";
}

export interface ProjectMember {
  id: number;
  projectId: number;
  userId: number;

  user: {
    id: number;
    name: string;
    email: string;
    role: MemberRole;
  };

  role?: "OWNER" | "ADMIN" | "MEMBER";

  createdAt?: string;
}

export interface AddMemberInput {
  userId: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: MemberRole;
}