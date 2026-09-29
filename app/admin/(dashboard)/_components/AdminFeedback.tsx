"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ADMIN_NOTICE_PARAM, ADMIN_NOTICE_TYPE_PARAM } from "@/lib/adminFeedback";
import { AdminNoticeTone } from "./AdminControls";

function isNoticeTone(value: string | null): value is AdminNoticeTone {
  return value === "success" || value === "error" || value === "info";
}

export default function AdminFeedback() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const notice = searchParams.get(ADMIN_NOTICE_PARAM);
  const rawTone = searchParams.get(ADMIN_NOTICE_TYPE_PARAM);
  const tone = isNoticeTone(rawTone) ? rawTone : "success";

  const cleanHref = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(ADMIN_NOTICE_PARAM);
    params.delete(ADMIN_NOTICE_TYPE_PARAM);
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!notice) return;

    toast[tone](notice, {
      id: `${tone}:${notice}`,
    });
    router.replace(cleanHref, { scroll: false });
  }, [cleanHref, notice, router, tone]);

  return null;
}
