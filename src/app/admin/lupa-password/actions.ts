"use server";

import { headers } from "next/headers";
import { requestPasswordResetSchema } from "@/lib/validation/password-reset";
import { requestPasswordReset } from "@/lib/password-reset";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";

type ActionState = { error?: string; success?: boolean };

export async function requestResetPasswordAdmin(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const ip = await getClientIp();
  if (isRateLimited(`admin-reset-request:${ip}`, 5, 60 * 60 * 1000)) {
    return { error: "Terlalu banyak permintaan reset password. Silakan coba lagi nanti." };
  }

  const parsed = requestPasswordResetSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  const h = await headers();
  const origin = h.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  await requestPasswordReset(parsed.data.email, "ADMIN", `${origin}/admin/reset-password`);

  return { success: true };
}
