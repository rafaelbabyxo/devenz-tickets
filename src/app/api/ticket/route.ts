import { NextRequest, NextResponse } from "next/server";
import { PrismaGetInstance } from "../../../lib/prisma-pg";

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

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Erro ao buscar detalhes do ticket:", error);
    return NextResponse.json({ error: "Erro ao buscar detalhes do ticket." }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const prisma = PrismaGetInstance();
  try {
    const ticketId = params.id;
    const { message, userId } = await req.json();

    // Verificar se o ticket existe
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket não encontrado." }, { status: 404 });
    }

    // Verificar se o userId está presente
    if (!userId) {
      return NextResponse.json({ error: "userId é obrigatório." }, { status: 400 });
    }

    // Adicionar a nova resposta ao ticket
    const response = await prisma.response.create({
      data: {
        message,
        ticketId,
        userId,
        lastUpdate: new Date(), // Atualizar o campo lastUpdate
      },
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Erro ao adicionar resposta ao ticket:", error);
    return NextResponse.json({ error: "Erro ao adicionar resposta ao ticket." }, { status: 500 });
  }
}