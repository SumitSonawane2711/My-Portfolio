import { NextResponse, type NextRequest } from "next/server";
import { revalidateSite } from "@/shared/libs/revalidate";
import { toErrorMessage } from "@/shared/libs/errors";
import { mediumServices } from "@/features/medium/services/mediumServices";

// Daily Medium sync (vercel.json → crons). Vercel sends
// "Authorization: Bearer $CRON_SECRET" when CRON_SECRET is set for the project.
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await mediumServices.sync();
    revalidateSite.blog();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: toErrorMessage(error) }, { status: 500 });
  }
}
