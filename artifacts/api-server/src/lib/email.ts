import nodemailer from "nodemailer";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function renderPostHtml(post: { title: string; excerpt?: string | null; body: string; coverImageUrl?: string | null }) {
  const paragraphs = post.body
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replaceAll("\n", "<br />")}</p>`)
    .join("");
  const cover = post.coverImageUrl
    ? `<img src="${escapeHtml(post.coverImageUrl)}" alt="" style="display:block;width:100%;max-width:620px;height:auto;margin:0 auto 28px;" />`
    : "";

  return `<!doctype html><html><body style="margin:0;background:#090b10;color:#f7f7f2;font-family:Arial,sans-serif;"><main style="max-width:680px;margin:0 auto;padding:48px 24px;"><div style="color:#00f5ff;letter-spacing:.18em;font-size:12px;font-weight:700;margin-bottom:18px;">TRIO BOYS / NEWSLETTER</div>${cover}<h1 style="font-size:42px;line-height:1.05;margin:0 0 18px;">${escapeHtml(post.title)}</h1>${post.excerpt ? `<p style="font-size:18px;line-height:1.5;color:#a9adb6;margin:0 0 28px;">${escapeHtml(post.excerpt)}</p>` : ""}<div style="font-size:17px;line-height:1.75;color:#e6e7e1;">${paragraphs}</div><div style="border-top:1px solid #272b33;margin-top:44px;padding-top:18px;color:#737985;font-size:12px;letter-spacing:.08em;">TRIO BOYS · KEEP IT WEIRD</div></main></body></html>`;
}

export async function sendPostEmail(
  to: string,
  post: { title: string; excerpt?: string | null; body: string; coverImageUrl?: string | null },
) {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number.parseInt(process.env.SMTP_PORT ?? "587", 10);
  const user = process.env.SMTP_USER?.trim();
  const password = process.env.SMTP_PASSWORD?.trim();
  const from = (process.env.SMTP_FROM_EMAIL ?? "Info@trioboys.com").trim();

  if (!host || !user || !password || !Number.isFinite(port)) {
    throw new Error("SMTP email is not configured. Check SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASSWORD.");
  }
  if (!from.includes("@")) {
    throw new Error("SMTP_FROM_EMAIL must be a valid sender address.");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass: password },
  });

  try {
    await transporter.sendMail({
      from,
      to,
      subject: post.title,
      html: renderPostHtml(post),
      text: post.body,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown SMTP error";
    throw new Error(`SMTP rejected the email: ${message}`);
  }
}
