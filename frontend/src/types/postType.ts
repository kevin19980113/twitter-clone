import { User } from "./userType";

type Comment = {
  _id: string;
  text: string;
  user: User;
};

export type PostType = {
  _id: string;
  user: User;
  text: string;
  img?: string;
  likes: string[];
  comments: Comment[];
};
