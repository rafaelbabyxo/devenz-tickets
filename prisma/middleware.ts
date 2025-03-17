import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  // Middleware para geração de ticketNumber
  if (params.model === "Ticket" && params.action === "create") {
    // Gerar um número aleatório de 4 dígitos com o prefixo #
    const ticketNumber = `#${Math.floor(1000 + Math.random() * 9000)}`;
    params.args.data.ticketNumber = ticketNumber;
  }

  // Middleware para garantir que a role seja válida (opcional)
  if (params.model === "User" && params.action === "create") {
    const role = params.args.data.role;
    if (!["USER", "ADMIN"].includes(role)) {
      throw new Error("Role inválida. Use 'USER' ou 'ADMIN'.");
    }
  }

  return next(params);
});

export default prisma;