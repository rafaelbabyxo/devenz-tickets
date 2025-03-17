"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Modal from "react-modal";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getPriorityClass } from "@/lib/getPriorityClass";

interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  message: string;
  priority: string;
  department: string;
  status: string;
  createdAt: string;
  lastUpdate: string; // Atualizar para lastUpdate
  User?: {
    company: string;
  };
  files: string[];
}

const TicketsPage = () => {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 10;

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

  const openModal = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage(null);
  };

  const navigateToTicket = (ticketId: string) => {
    router.push(`/tickets/${ticketId}`);
  };

  // Calculate pagination
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(tickets.length / ticketsPerPage);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 ">
      <div className="bg-orange-500 text-white p-4 rounded-t-lg">
        <h1 className="text-2xl font-bold">Tickets de Suporte</h1>
        <p>O seu Histórico de Tickets connosco</p>
      </div>
      
      <div className="mb-4 mt-4">
        <Link href="/">
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded">
            Enviar Ticket +
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-2 bg-orange-500 text-white">
          <p>{tickets.length} tickets encontrados, Página {currentPage} de {totalPages || 1}</p>
        </div>
        
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assunto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enviado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última atualização</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentTickets.map((ticket) => (
              <tr 
                key={ticket.id} 
                className="hover:bg-gray-50 cursor-pointer" 
                onClick={() => navigateToTicket(ticket.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ticket.ticketNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.subject}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.department}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.User?.company}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    ticket.status === 'Fechado' ? 'bg-gray-100 text-gray-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {ticket.status || 'Aberto'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={getPriorityClass(ticket.priority)}>{ticket.priority}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(ticket.createdAt).toLocaleDateString('pt-PT')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ticket.lastUpdate ? (
                    <>
                      {new Date(ticket.lastUpdate).toLocaleDateString('pt-PT')} {new Date(ticket.lastUpdate).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                    </>
                  ) : (
                    <>
                      {new Date(ticket.createdAt).toLocaleDateString('pt-PT')} {new Date(ticket.createdAt).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination controls */}
        <div className="bg-gray-100 px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Mostrar <span className="font-medium">{indexOfFirstTicket + 1}</span> a <span className="font-medium">
                {Math.min(indexOfLastTicket, tickets.length)}</span> de <span className="font-medium">{tickets.length}</span> resultados
            </p>
          </div>
          <div className="flex-1 flex justify-end">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Seguinte
            </button>
          </div>
        </div>
      </div>

      {/* Modal for image preview */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Imagem Expandida">
        {selectedImage && (
          <div className="flex justify-center items-center h-full">
            <Image src={selectedImage} alt="Imagem Expandida" width={800} height={800} className="object-contain" />
          </div>
        )}
        <button onClick={closeModal} className="absolute top-4 right-4 text-white bg-red-500 rounded-full p-2">Fechar</button>
      </Modal>
    </div>
  );
};

export default TicketsPage;