import { NextRequest, NextResponse } from "next/server";
import { PrismaGetInstance } from "../../../../lib/prisma-pg";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const prisma = PrismaGetInstance();
  try {
    const ticketId = params.id;

    // Verificar se o ticket existe
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        User: {
          select: {
            email: true,
            company: true, // Incluir apenas os campos 'email' e 'company' do usuário
          },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket não encontrado." }, { status: 404 });
    }

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Erro ao buscar detalhes do ticket:", error);
    return NextResponse.json({ error: "Erro ao buscar detalhes do ticket." }, { status: 500 });
  }
}