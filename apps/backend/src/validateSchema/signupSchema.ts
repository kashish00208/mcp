import * as z from "zod";

export const UserSchema = z.object({
  name: z.string(),
  email: z.email("Provide a valid Email ID"),
  password:z.string().min(1).max(12)
});
