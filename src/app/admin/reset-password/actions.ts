"use server";

import { resetPasswordSchema } from "@/lib/validation/password-reset";
import { resetPasswordWithToken } from "@/lib/password-reset";

type ActionState = { error?: string; success?: boolean };

export async function resetPasswordAdminWithToken(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = resetPasswordSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  const result = await resetPasswordWithToken(parsed.data.token, "ADMIN", parsed.data.password);
  if ("error" in result) return { error: result.error };
  return { success: true };
}
