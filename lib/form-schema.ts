import * as z from "zod"

export const UserRole = [
  "patient",
  "doctor",
  "nurse",
  "lab-tech",
  "pharmacist",
  "admin"
] as const;

export const RegisterformSchema = z.object({
  "name": z.string({ error: 'This field is required' }),
  "email": z.email({ error: 'Please enter a valid email' }),
  "password": z.string({ error: 'This field is required' }),
  "confirm-password": z.string({ error: 'This field is required' }),
  "role": z.enum(UserRole).optional().default("patient"), // Optional - defaults to patient for public registration
  "social-media-buttons": z.unknown(),
  "agree": z.literal(true, { error: 'This field is required' })
});


export interface ActionResponse<T = any> {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof T]?: string[];
  };
  inputs?: T;
}
export const LoginformSchema = z.object({
  email: z.email({ error: "Please enter a valid email" }),
  password: z.string({ error: "This field is required" }),
});
