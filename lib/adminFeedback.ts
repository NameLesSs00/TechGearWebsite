import type { AdminNoticeTone } from "@/app/admin/(dashboard)/_components/AdminControls";

export const ADMIN_NOTICE_PARAM = "notice";
export const ADMIN_NOTICE_TYPE_PARAM = "noticeType";

export function withAdminNotice(path: string, message: string, tone: AdminNoticeTone = "success") {
  const [pathname, query = ""] = path.split("?");
  const params = new URLSearchParams(query);
  params.set(ADMIN_NOTICE_PARAM, message);
  params.set(ADMIN_NOTICE_TYPE_PARAM, tone);

  const nextQuery = params.toString();
  return nextQuery ? `${pathname}?${nextQuery}` : pathname;
}
