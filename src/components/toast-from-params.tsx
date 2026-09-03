"use client";

import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const DEFAULT_MESSAGES: Record<string, string> = {
  created: "Data disimpan",
  updated: "Data telah diedit",
};

export function ToastFromParams({
  param = "saved",
  messages = DEFAULT_MESSAGES,
}: {
  param?: string;
  messages?: Record<string, string>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const value = searchParams.get(param);

  useEffect(() => {
    if (!value) return;
    const message = messages[value];
    if (message) toast.success(message);

    const params = new URLSearchParams(searchParams.toString());
    params.delete(param);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return null;
}
