import { z } from "zod";

export const employeeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email cannot exceed 255 characters"),

  role: z
    .string()
    .trim()
    .min(2, "Role must contain at least 2 characters")
    .max(100, "Role cannot exceed 100 characters"),
});

export type EmployeeInput = z.infer<typeof employeeSchema>;
