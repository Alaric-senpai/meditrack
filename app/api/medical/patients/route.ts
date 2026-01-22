import { NextRequest, NextResponse } from "next/server";
import { createAdminSession } from "@/server/clients";
import { appwritecfg } from "@/config/appwrite.config";
import { Query } from "node-appwrite";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "25");
    const offset = parseInt(searchParams.get("offset") || "0");

    const session = await createAdminSession();
    const queries = [
      Query.limit(limit),
      Query.offset(offset),
      Query.orderDesc("createdAt"),
    ];

    if (search) {
      queries.push(Query.or([
        Query.contains("firstName", search),
        Query.contains("lastName", search),
        Query.contains("medicalIdNumber", search),
      ]));
    }

    const result = await session.tables.listDocuments(
      appwritecfg.databaseId,
      appwritecfg.tables.patients,
      queries
    );

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const session = await createAdminSession();
    
    // Simple verification (in production, use RBAC check)
    const now = new Date().toISOString();
    const patientData = {
      ...body,
      createdAt: now,
      updatedAt: now,
      status: "active",
    };

    const document = await session.tables.createDocument(
      appwritecfg.databaseId,
      appwritecfg.tables.patients,
      "unique()",
      patientData
    );

    return NextResponse.json({ success: true, data: document });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
