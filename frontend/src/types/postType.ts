import { User } from "./userType";

type Comment = {
  _id: string;
  text: string;
  user: User;
};

export type like = {
  _id: string;
};

export type PostType = {
  _id: string;
  user: User;
  text: string;
  img?: string;
  likes: like[];
  comments: Comment[];
};
