import type {
  ProjectRole,
} from "@prisma/client";

export interface AddMemberInput {
  projectId: number;
  userId: number;
  role?: ProjectRole;
}