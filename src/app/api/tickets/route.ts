import { NextRequest, NextResponse } from "next/server";
import { PrismaGetInstance } from "../../../lib/prisma-pg";

export async function GET(req: NextRequest) {
  const prisma = PrismaGetInstance();

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

    const tickets = await prisma.ticket.findMany({
      where: { userId: session.userId },
      include: {
        User: {
          select: {
            company: true, // Incluir apenas o campo 'company' do usuário
          },
        },
      },
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Erro ao buscar tickets:", error);
    return NextResponse.json({ error: "Erro ao buscar tickets." }, { status: 500 });
  }
}