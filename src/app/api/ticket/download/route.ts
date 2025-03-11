// app/api/ticket/download/route.ts
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileName = searchParams.get("file");

  if (!fileName) {
    return NextResponse.json({ error: "Nome do arquivo não fornecido." }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), "uploads", fileName);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Arquivo não encontrado." }, { status: 404 });
  }

  const fileContent = fs.readFileSync(filePath);
  
  return new NextResponse(fileContent, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
