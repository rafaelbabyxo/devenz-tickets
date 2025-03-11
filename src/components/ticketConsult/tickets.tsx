"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface Ticket {
  id: string;
  subject: string;
  message: string;
  priority: string;
  department: string;
  user?: {
    name: string;
  };
  files: string[];
}

const TicketsPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get("/api/tickets");
        setTickets(response.data);
        setLoading(false);
      } catch (error) {
        setError("Erro ao buscar tickets.");
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Meus Tickets</h1>
      <ul className="space-y-4">
        {tickets.map((ticket) => (
          <li key={ticket.id} className="border border-gray-300 rounded-lg p-4 bg-white shadow">
            <h2 className="text-xl font-semibold">{ticket.subject}</h2>
            <p className="mt-2">{ticket.message}</p>
            <p className="mt-2"><strong>Prioridade:</strong> {ticket.priority}</p>
            <p className="mt-2"><strong>Departamento:</strong> {ticket.department}</p>
            <p className="mt-2"><strong>Ficheiros:</strong> {ticket.files.join(", ")}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TicketsPage;