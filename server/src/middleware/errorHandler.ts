import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(error);

  if (typeof error === "object" && error !== null && "code" in error) {
    const code = (error as { code: string }).code;

    // PostgreSQL unique constraint violation
    if (code === "23505") {
      return res.status(409).json({
        success: false,
        message: "An employee with this email already exists",
      });
    }
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
