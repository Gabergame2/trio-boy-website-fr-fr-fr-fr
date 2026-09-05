import { ReplitConnectors } from "@replit/connectors-sdk";

const connectors = new ReplitConnectors();

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
  const from = (process.env.RESEND_FROM_EMAIL ?? process.env.RESEND_FROM)?.trim();
  if (!from) {
    throw new Error(
      "Email sender is not configured. Set RESEND_FROM_EMAIL to a verified sender address (for example, Trio Boys <mail@your-domain.com>).",
    );
  }
  if (!from.includes("@")) {
    throw new Error("Email sender must be a valid address and match a verified Resend domain.");
  }

  let response: Response;
  try {
    response = await connectors.proxy("resend", "/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        subject: post.title,
        html: renderPostHtml(post),
        text: post.body,
      }),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown connector error";
    throw new Error(`The Resend connector could not be reached: ${message}`);
  }

  if (!response.ok) {
    const details = (await response.text()).trim();
    throw new Error(
      `Resend rejected the email (${response.status}). ${details || "Check the sender domain and connector configuration."}`,
    );
  }
}
