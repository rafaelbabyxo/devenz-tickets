import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { PrismaGetInstance } from "../../../lib/prisma-pg";  // Altere a importação aqui

export async function POST(req: NextRequest) {
  const prisma = PrismaGetInstance();  // Usar a instância do Prisma que você criou

  try {
    const formData = await req.formData();

    // Lendo os campos do formData com valores padrão para garantir que não sejam undefined
    const subject = formData.get("subject")?.toString().trim() ?? "";  // Garantir que seja uma string
    const message = formData.get("message")?.toString().trim() ?? "";  // Garantir que seja uma string
    const files = formData.getAll("files") as File[];
    const company = formData.get("company")?.toString().trim() ?? "";  // Garantir que seja uma string
    const priority = formData.get("priority")?.toString().trim() ?? "";  // Garantir que seja uma string
    const department = formData.get("department")?.toString().trim() ?? "";  // Garantir que seja uma string
    const userId = formData.get("userId")?.toString().trim() ?? "";

    // Log para verificar se os valores estão sendo extraídos corretamente
    console.log("subject:", subject);
    console.log("message:", message);
    console.log("userId:", userId);

    // Verificar se os campos obrigatórios estão preenchidos
    if (!subject || !message) {
      return NextResponse.json({ error: "Os campos 'subject' e 'message' são obrigatórios." }, { status: 400 });
    }

    // Verificar se o 'userId' está presente
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
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    // Salvar arquivos localmente
    const filePaths: string[] = [];
    for (const file of files) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);  // Converter para Uint8Array
        const filePath = path.join(uploadDir, file.name);
        fs.writeFileSync(filePath, uint8Array);  // Usar Uint8Array aqui
        filePaths.push(filePath); // Salvar caminho do arquivo
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
        company,
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