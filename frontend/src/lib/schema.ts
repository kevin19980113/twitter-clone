import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  username: z.string().min(1, {
    message: "Username is required",
  }),
  fullName: z.string().min(1, {
    message: "Full name is required",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
});

export const loginSchema = z.object({
  username: z.string().min(1, {
    message: "Username is required",
  }),

  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
});

export const editProfileSchema = z
  .object({
    fullName: z.string().min(1, {
      message: "Full name is required",
    }),
    username: z.string().min(1, {
      message: "Username is required",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    bio: z.string().optional(),
    link: z
      .string()
      .optional()
      .refine(
        (link) => {
          if (link === undefined || link === "") return true;
          return z.string().url().safeParse(link).success;
        },
        {
          message: "Please enter a valid URL.",
        }
      ),
    currentPassword: z.string().refine(
      (currentPassword) => {
        if (currentPassword === undefined || currentPassword === "")
          return true;
        return z.string().min(6).safeParse(currentPassword).success;
      },
      {
        message: "Password must be at least 6 characters long",
      }
    ),
    newPassword: z.string().refine(
      (newPassword) => {
        if (newPassword === undefined || newPassword === "") return true;
        return z.string().min(6).safeParse(newPassword).success;
      },
      {
        message: "Password must be at least 6 characters long",
      }
    ),
    password: z.string().optional(),
  })
  .refine(
    ({ currentPassword, newPassword }) => {
      return !(
        (currentPassword && !newPassword) ||
        (!currentPassword && newPassword)
      );
    },
    {
      message: "Please enter both current password and new password.",
      path: ["password"],
    }
  );

export const createPostSchema = z.object({
  text: z.string().min(1, {
    message: "Please enter some content for your post.",
  }),
});

export const createCommentSchema = z.object({
  text: z.string().min(1, {
    message: "Please enter some content for your comment.",
  }),
});

export type signupSchemaType = z.infer<typeof signupSchema>;
export type loginSchemaType = z.infer<typeof loginSchema>;
export type editProfileSchemaType = z.infer<typeof editProfileSchema>;
export type createPostSchemaType = z.infer<typeof createPostSchema>;
export type createCommentSchemaType = z.infer<typeof createCommentSchema>;
