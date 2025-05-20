import { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  contact: string;
  bio: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
