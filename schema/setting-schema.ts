import z from "zod";

export const updateAccountSchema = z.object({
  name: z
    .string()
    .nonempty({ message: "Fullname is required" })
    .min(3, { message: "Fullname must be at least 3 characters or more." }),
  email: z
    .string()
    .nonempty({ message: "Email is required" })
    .email({ message: "Invalid Email" }),
  image: z.string().optional(),
  bio: z.string().trim().optional(),
});

export const contactSchema = z.object({
  contact: z.string().trim().nonempty({ message: "Contact is required." }),
});

export const changePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .nonempty({ message: "Old password is required" })
      .min(6, { message: "Old Password must be atleast 6 characters or more" }),
    password: z
      .string()
      .nonempty({ message: "Password is required" })
      .min(6, { message: "Password must be atleast 6 characters or more" }),
    confirmPassword: z
      .string()
      .nonempty({ message: "Confirm Password is required" })
      .min(6, {
        message: "Confirm Password must be atleast 6 characters or more",
      }),
  })
  .refine((data) => data.oldPassword !== data.password, {
    message: "Old password & new password shouldn't be same.",
    path: ["password"],
  })
  .refine((data) => data.password == data.confirmPassword, {
    message: "Password and confirm password doesn't matched.",
    path: ["confirmPassword"],
  });

export type updateAccountSchemaType = z.infer<typeof updateAccountSchema>;

export type contactSchemaType = z.infer<typeof contactSchema>;

export type changePasswordSchemaType = z.infer<typeof changePasswordSchema>;
