"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Modal from "react-modal";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import { getPriorityClass } from "@/lib/getPriorityClass";

interface Ticket {
  id: string;
  cc?: string;
  subject: string;
  message: string;
  priority: string;
  department: string;
  files: string[];
  company: string;
  userId: string;
  User: {
    id: string;
    email: string;
    company: string;
  };
  status?: string;
  createdAt?: string; // Certifique-se de que o campo createdAt está presente
}

interface Message {
  id: string;
  content: string;
  sender: {
    name: string;
    email: string;
    role: string;
  };
  createdAt: string;
}

const TicketDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const ticketId = params.id;
        const response = await axios.get(`/api/tickets/${ticketId}`);
        setTicket(response.data);

        // Simulated messages for demonstration
        if (response.data) {
          setMessages([
            {
              id: "1",
              content: response.data.message,
              sender: {
                name: response.data.User?.email.split("@")[0] || "Usuário",
                email: response.data.User?.email || "email@example.com",
                role: "Cliente",
              },
              createdAt: new Date().toLocaleDateString("pt-BR"),
            },
          ]);
        }

        setLoading(false);
      } catch (error) {
        setError("Erro ao buscar detalhes do ticket.");
        setLoading(false);
      }
    };
    fetchTicket();
  }, [params.id]);

  const openModal = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage(null);
  };

  const goBack = () => {
    router.push("/tickets");
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("pt-BR");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Carregando...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!ticket) {
    return <div className="text-center">Ticket não encontrado</div>;
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4 max-w-5xl">
        <button
          onClick={goBack}
          className="mb-4 flex items-center text-orange-600 hover:text-orange-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Voltar para Tickets
        </button>

        <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
          {/* Ticket Header */}
          <div className="p-4 border-b flex justify-between items-center bg-gray-50">
            <div>
              <p className="text-xl font-semibold">
                #{ticket.id} - {ticket.subject}
              </p>
              <div className="flex gap-2 mt-1">
                <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                  {ticket.status || "Aberto"}
                </span>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full ${getPriorityClass(
                    ticket.priority
                  )}`}
                >
                  {ticket.priority}
                </span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
                  {ticket.department}
                </span>
                <div className="text-sm text-gray-500">
                  <p>
                    Criado:{" "}
                    {ticket.createdAt
                      ? formatDate(ticket.createdAt)
                      : "Data não disponível"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Ticket Address Bar */}
          {/* Messages List */}
          <div className="divide-y">
            {messages.map((message, index) => (
              <div key={index} className="p-4">
                {/* Message Header */}
                <div className="flex justify-between items-center mb-2 font-bold bg-orange-600 p-2 rounded">
                  <div className="text-sm text-white">
                    {ticket.User?.company || "N/A"}
                  </div>
                  <div className="text-sm text-white">
                    <p>
                      {" "}
                      {ticket.createdAt
                        ? formatDate(ticket.createdAt)
                        : "Data não disponível"}
                    </p>
                  </div>
                </div>

                {/* Message Content */}
                <div className="mb-4">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>

                {/* Attachments */}
                {index === 0 && ticket.files && ticket.files.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {ticket.files.map((file, fileIndex) => (
                      <div key={fileIndex} className="relative">
                        <Image
                          src={file}
                          alt={`Anexo ${fileIndex + 1}`}
                          width={100}
                          height={100}
                          className="cursor-pointer border rounded w-28 h-28 object-cover"
                          onClick={() => openModal(file)}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Signature */}
                <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                  <div className="mt-2 flex items-center">
                    <div className="mr-4">
                      <Image
                        src="/logo.png"
                        alt="Logo"
                        width={50}
                        height={50}
                        className="h-10 w-auto"
                      />
                    </div>
                    <div>
                      <p className="font-semibold">
                        {message.sender.name} / Technical Support
                      </p>
                      <p>
                        Suporte Técnico / Tech Support: {message.sender.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        Web • Facebook • Twitter • Mastodon • YouTube • LinkedIn
                        • Instagram
                      </p>
                      <p className="text-xs font-semibold text-orange-600">
                        Datacenter, Cloud & Webhosting Business Solutions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reply Section */}
          <div className="p-4 bg-blue-50 border-t">
            <div className="flex items-center text-blue-600 font-medium mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Resposta
              <button className="ml-auto text-gray-500 hover:text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mensagem
              </label>
              <textarea
                placeholder=""
                className="w-full p-3 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Anexos
              </label>
              <div className="flex items-center">
                <label className="cursor-pointer">
                  <div className="border rounded px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100">
                    Escolher ficheiro
                  </div>
                  <input type="file" className="hidden" />
                </label>
                <span className="ml-3 text-sm text-gray-500">
                  Nenhum ficheiro selecionado
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Extensões de arquivos permitidos: doc, docx, xls, png, gif, jpg,
                jpeg, webp, zip, pdf, txt, log, eml, txt, csv, pps, ppt
              </p>
              <div className="mt-2 text-right">
                <button className="text-green-600 hover:text-green-700 text-sm flex items-center justify-center float-right">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Adicionar Mais
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CC
              </label>
              <div className="flex">
                <input
                  type="text"
                  className="flex-1 p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder=""
                />
                <button className="ml-2 text-green-600 hover:text-green-700 text-sm px-3 py-2 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Adicionar Mais
                </button>
              </div>
            </div>

            <div className="flex justify-center space-x-3 mt-6">
              <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-medium">
                Enviar
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-medium">
                Cancelar
              </button>
            </div>
          </div>
        </div>

        {/* Modal for image preview */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Imagem Expandida"
          className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-75"
          overlayClassName="fixed inset-0"
        >
          {selectedImage && (
            <div className="relative max-w-4xl max-h-screen bg-white p-2 rounded-lg">
              <Image
                src={selectedImage}
                alt="Imagem Expandida"
                width={800}
                height={800}
                className="object-contain max-h-[80vh]"
              />
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
        </Modal>
      </div>
      <Footer />
    </div>
  );
};

export default TicketDetailPage;
