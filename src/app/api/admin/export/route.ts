import { NextResponse } from "next/server";
import { getAdminSession } from "@/shared/libs/authGuard";
import { exportAllContent } from "@/features/admin/repositories/backupRepository";

// JSON backup of every content table (not the auth tables). Admin only.
export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await exportAllContent();
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="portfolio-backup-${date}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
