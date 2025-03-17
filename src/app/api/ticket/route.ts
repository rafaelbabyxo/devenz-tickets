import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import prisma from "../../../../prisma/middleware"; // Alterar para usar o Prisma com middleware

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Lendo os campos do formData com valores padrão para garantir que não sejam undefined
    const subject = formData.get("subject")?.toString().trim() ?? "";
    const message = formData.get("message")?.toString().trim() ?? "";
    const files = formData.getAll("files") as File[];
    const company = formData.get("company")?.toString().trim() ?? "";
    const priority = formData.get("priority")?.toString().trim() ?? "";
    const department = formData.get("department")?.toString().trim() ?? "";
    const userId = formData.get("userId")?.toString().trim() ?? "";

    // Verificar se os campos obrigatórios estão preenchidos
    if (!subject || !message) {
      return NextResponse.json({ error: "Os campos 'subject' e 'message' são obrigatórios." }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: "userId é obrigatório." }, { status: 400 });
    }

    // Verificar se o usuário existe no banco de dados
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    // Criar diretório local para armazenar arquivos, se não existir
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    // Salvar arquivos localmente
    const filePaths: string[] = [];
    for (const file of files) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const filePath = path.join(uploadDir, file.name);
        fs.writeFileSync(filePath, uint8Array);
        filePaths.push(`/uploads/${file.name}`);
      } catch (fileError) {
        console.error("Erro ao salvar arquivo:", fileError);
        return NextResponse.json({ error: "Erro ao salvar arquivo." }, { status: 500 });
      }
    }

    // Criar o ticket no banco de dados
    const ticket = await prisma.ticket.create({
      data: {
        subject,
        message,
        files: filePaths,
        priority,
        department,
        userId,
      },
    });

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Erro ao criar ticket:", error);
    return NextResponse.json({ error: "Erro ao criar o ticket." }, { status: 500 });
  }
}