"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function useActionToast(
  state: { success?: boolean; error?: string },
  successMessage: string
) {
  useEffect(() => {
    if (state.error) toast.error(state.error);
    else if (state.success) toast.success(successMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success, state.error]);
}
