import type { NextFunction, Request, RequestHandler, Response } from "express";
import { clerkClient, getAuth } from "@clerk/express";

export const requireAdmin: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    if (!adminEmail) {
      res.status(503).json({ error: "Admin access is not configured" });
      return;
    }

    const user = await clerkClient.users.getUser(userId);
    const primaryEmail = user.emailAddresses.find(
      (address) => address.id === user.primaryEmailAddressId,
    )?.emailAddress.toLowerCase();

    if (!primaryEmail || primaryEmail !== adminEmail) {
      res.status(403).json({ error: "Admin access required" });
      return;
    }

    res.locals.admin = { userId, email: primaryEmail };
    next();
  } catch (error) {
    next(error);
  }
};