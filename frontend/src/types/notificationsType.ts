import { User } from "./userType";

export type Notifications = {
  _id: string;
  from: User;
  to: User;
  type: "FOLLOW" | "LIKE" | "COMMENT";
  read: boolean;
  createdAt: Date;
};
