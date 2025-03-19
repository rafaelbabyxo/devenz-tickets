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
            company: true,
            role: true, // Adicionado o campo role
          },
        },
        Responses: {
          include: {
            User: {
              select: {
                email: true,
                company: true,
              },
            },
          },
        }, // Incluir as respostas do ticket
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket não encontrado." }, { status: 404 });
    }

    // Encontrar a última atualização do ticket
    const lastResponse = ticket.Responses.reduce((latest, response) => {
      return response.lastUpdate > latest.lastUpdate ? response : latest;
    }, ticket.Responses[0]);

    const updatedTicket = {
      ...ticket,
      updatedAt: lastResponse ? lastResponse.lastUpdate : ticket.createdAt,
    };

    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error("Erro ao buscar detalhes do ticket:", error);
    return NextResponse.json({ error: "Erro ao buscar detalhes do ticket." }, { status: 500 });
  }
}