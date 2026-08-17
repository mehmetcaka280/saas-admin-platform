import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Zod Hatalarını Yakala
  if (err instanceof ZodError || err.name === "ZodError" || err.issues) {
    const issues = err.issues || err.errors || [];
    const formattedErrors = issues.map((e: any) => ({
      field: e.path.join("."),
      message: e.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Girdi doğrulama hatası.",
      errors: formattedErrors,
    });
  }

  // Diğer Genel Hatalar
  const statusCode = err.statusCode || 400;
  const message = err.message || "Sunucuda beklenmeyen bir hata oluştu.";

  return res.status(statusCode).json({
    success: false,
    message,
  });
};