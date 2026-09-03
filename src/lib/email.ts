import "server-only";
import { Resend } from "resend";

let client: Resend | null = null;

function getClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  if (!client) client = new Resend(apiKey);
  return client;
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const resend = getClient();
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY belum diatur — email ke ${to} dilewati ("${subject}").`);
    return;
  }

  const from = process.env.EMAIL_FROM || "SIPATAN <no-reply@example.com>";
  try {
    await resend.emails.send({ from, to, subject, html });
  } catch (err) {
    console.error("[email] Gagal mengirim email:", err);
  }
}

function layout(title: string, bodyHtml: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #18181b;">
      <div style="background: #047857; padding: 16px 24px; border-radius: 8px 8px 0 0;">
        <span style="color: #fff; font-weight: bold; font-size: 16px;">SIPATAN</span>
      </div>
      <div style="border: 1px solid #e4e4e7; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
        <h1 style="font-size: 18px; margin: 0 0 12px;">${title}</h1>
        ${bodyHtml}
      </div>
      <p style="font-size: 12px; color: #a1a1aa; margin-top: 12px;">
        Email ini dikirim otomatis, mohon tidak membalas ke alamat ini.
      </p>
    </div>
  `;
}

export function sanggahanKonfirmasiEmail(nomorTiket: string): { subject: string; html: string } {
  return {
    subject: `Sanggahan Anda Diterima — ${nomorTiket}`,
    html: layout(
      "Sanggahan Anda telah diterima",
      `<p>Terima kasih, sanggahan Anda telah kami terima dengan nomor tiket:</p>
       <p style="font-family: monospace; font-size: 18px; font-weight: bold; background: #f4f4f5; padding: 8px 12px; border-radius: 6px;">${nomorTiket}</p>
       <p>Simpan nomor tiket ini untuk melacak status sanggahan Anda di halaman "Lacak Sanggahan".</p>`
    ),
  };
}

export function sanggahanStatusEmail(
  nomorTiket: string,
  statusLabel: string,
  catatan?: string | null
): { subject: string; html: string } {
  return {
    subject: `Status Sanggahan ${nomorTiket} Diperbarui: ${statusLabel}`,
    html: layout(
      "Status sanggahan Anda diperbarui",
      `<p>Sanggahan dengan nomor tiket <strong>${nomorTiket}</strong> kini berstatus:</p>
       <p style="font-size: 16px; font-weight: bold; color: #047857;">${statusLabel}</p>
       ${catatan ? `<p style="margin-top: 12px;">Catatan dari admin:</p><p style="white-space: pre-line;">${catatan}</p>` : ""}`
    ),
  };
}
