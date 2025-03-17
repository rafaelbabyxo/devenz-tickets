import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  if (params.model === "Ticket" && params.action === "create") {
    // Gerar um número aleatório de 4 dígitos com o prefixo #
    const ticketNumber = `#${Math.floor(1000 + Math.random() * 9000)}`;
    params.args.data.ticketNumber = ticketNumber;
  }
  return next(params);
});

export default prisma;