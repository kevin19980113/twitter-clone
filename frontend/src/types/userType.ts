export type User = {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  profileImg?: string;
  coverImg?: string;
  bio?: string;
  link?: string;
  following: string[];
  followers: string[];
  createdAt: Date;
};
