import { NextRequest, NextResponse } from "next/server";
import { createAdminSession } from "@/server/clients";
import { appwritecfg } from "@/config/appwrite.config";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const patientId = searchParams.get("patientId");
    const limit = parseInt(searchParams.get("limit") || "50");

    const session = await createAdminSession();
    const queries = [
      "orderBy(timestamp, desc)",
      `limit(${limit})`
    ];

    if (userId) queries.push(`userId = "${userId}"`);
    if (patientId) queries.push(`patientId = "${patientId}"`);

    const result = await session.tables.listDocuments(
      appwritecfg.databaseId,
      appwritecfg.tables.auditLogs,
      queries
    );

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
