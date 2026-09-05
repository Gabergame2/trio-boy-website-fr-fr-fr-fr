import { Router, type IRouter } from "express";
import { and, desc, eq } from "drizzle-orm";
import {
  CreateAdminPostBody,
  SubscribeToNewsletterBody,
  UpdateAdminPostBody,
} from "@workspace/api-zod";
import { db, postsTable, subscribersTable } from "@workspace/db";
import { requireAdmin } from "../middleware/admin";
import { sendPostEmail } from "../lib/email";

const router: IRouter = Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

router.post("/subscribe", async (req, res, next) => {
  try {
    const parsed = SubscribeToNewsletterBody.parse(req.body);
    const email = parsed.email.trim().toLowerCase();
    if (!emailPattern.test(email)) {
      res.status(400).json({ error: "Enter a valid email address" });
      return;
    }

    const [subscriber] = await db
      .insert(subscribersTable)
      .values({ email, status: "active", unsubscribedAt: null })
      .onConflictDoUpdate({
        target: subscribersTable.email,
        set: { status: "active", unsubscribedAt: null },
      })
      .returning();
    res.status(201).json(subscriber);
  } catch (error) {
    next(error);
  }
});

router.use("/admin", requireAdmin);

router.get("/admin/me", (req, res) => {
  res.json(res.locals.admin);
});

router.get("/admin/posts", async (_req, res, next) => {
  try {
    res.json(await db.select().from(postsTable).orderBy(desc(postsTable.createdAt)));
  } catch (error) {
    next(error);
  }
});

router.post("/admin/posts", async (req, res, next) => {
  try {
    const input = CreateAdminPostBody.parse(req.body);
    const status = input.status ?? "draft";
    const [post] = await db
      .insert(postsTable)
      .values({
        title: input.title.trim(),
        excerpt: input.excerpt?.trim() || null,
        body: input.body.trim(),
        coverImageUrl: input.coverImageUrl?.trim() || null,
        status,
        publishedAt: status === "published" ? new Date() : null,
      })
      .returning();
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
});

router.patch("/admin/posts/:id", async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      res.status(400).json({ error: "Invalid post id" });
      return;
    }
    const input = UpdateAdminPostBody.parse(req.body);
    const [existing] = await db.select().from(postsTable).where(eq(postsTable.id, id));
    if (!existing) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    const status = input.status ?? existing.status;
    const [post] = await db
      .update(postsTable)
      .set({
        ...(input.title !== undefined ? { title: input.title.trim() } : {}),
        ...(input.excerpt !== undefined ? { excerpt: input.excerpt.trim() || null } : {}),
        ...(input.body !== undefined ? { body: input.body.trim() } : {}),
        ...(input.coverImageUrl !== undefined ? { coverImageUrl: input.coverImageUrl.trim() || null } : {}),
        status,
        publishedAt: status === "published" && !existing.publishedAt ? new Date() : existing.publishedAt,
      })
      .where(eq(postsTable.id, id))
      .returning();
    res.json(post);
  } catch (error) {
    next(error);
  }
});

router.delete("/admin/posts/:id", async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      res.status(400).json({ error: "Invalid post id" });
      return;
    }
    await db.delete(postsTable).where(eq(postsTable.id, id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.post("/admin/posts/:id/send", async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      res.status(400).json({ error: "Invalid post id" });
      return;
    }
    const [post] = await db.select().from(postsTable).where(eq(postsTable.id, id));
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    const subscribers = await db
      .select()
      .from(subscribersTable)
      .where(eq(subscribersTable.status, "active"));
    if (!subscribers.length) {
      res.status(400).json({ error: "There are no active subscribers yet" });
      return;
    }
    if (!process.env.RESEND_FROM_EMAIL) {
      res.status(503).json({ error: "Set RESEND_FROM_EMAIL before sending" });
      return;
    }

    const results = await Promise.allSettled(
      subscribers.map((subscriber) => sendPostEmail(subscriber.email, post)),
    );
    const sent = results.filter((result) => result.status === "fulfilled").length;
    const failed = results.length - sent;
    if (sent) {
      await db
        .update(postsTable)
        .set({ status: "published", publishedAt: post.publishedAt ?? new Date(), sentAt: new Date() })
        .where(eq(postsTable.id, id));
    }
    res.json({ sent, failed, recipientCount: subscribers.length });
  } catch (error) {
    next(error);
  }
});

router.get("/admin/subscribers", async (_req, res, next) => {
  try {
    res.json(await db.select().from(subscribersTable).orderBy(desc(subscribersTable.subscribedAt)));
  } catch (error) {
    next(error);
  }
});

router.delete("/admin/subscribers/:id", async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      res.status(400).json({ error: "Invalid subscriber id" });
      return;
    }
    await db
      .update(subscribersTable)
      .set({ status: "unsubscribed", unsubscribedAt: new Date() })
      .where(and(eq(subscribersTable.id, id), eq(subscribersTable.status, "active")));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;