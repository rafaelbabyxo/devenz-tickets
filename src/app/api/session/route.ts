import { NextRequest, NextResponse } from "next/server";
import { PrismaGetInstance } from "../../../lib/prisma-pg";  // Altere a importação aqui

export async function GET(req: NextRequest) {
  const prisma = PrismaGetInstance();  // Usar a instância do Prisma que você criou

  try {
    const authCookie = req.cookies.get("auth-session");
    const sessionToken = authCookie?.value || "";

    if (!sessionToken) {
      return NextResponse.json({ error: "Token de sessão não encontrado." }, { status: 401 });
    }

    const session = await prisma.sessions.findFirst({
      where: { token: sessionToken },
      include: { User: true },
    });

    if (!session || !session.valid || session.expiresAt < new Date()) {
      return NextResponse.json({ error: "Sessão inválida ou expirada." }, { status: 401 });
    }

    return NextResponse.json({ userId: session.userId });
  } catch (error) {
    console.error("Erro ao buscar sessão:", error);
    return NextResponse.json({ error: "Erro ao buscar sessão." }, { status: 500 });
  }
}