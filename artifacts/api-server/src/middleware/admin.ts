import type { NextFunction, Request, RequestHandler, Response } from "express";

export const ADMIN_USERNAME = "Gabergame2";
export const ADMIN_SESSION_COOKIE = "trio_admin_session";

export const requireAdmin: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!process.env.SESSION_SECRET) {
    res.status(503).json({ error: "Admin sessions are not configured" });
    return;
  }

  if (req.signedCookies?.[ADMIN_SESSION_COOKIE] !== ADMIN_USERNAME) {
    res.status(401).json({ error: "Admin login required" });
    return;
  }

  res.locals.admin = { username: ADMIN_USERNAME };
  next();
};

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    signed: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 14,
    path: "/",
  };
}
