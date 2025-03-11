"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const TicketForm = () => {
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [userId, setUserId] = useState("");  // Estado para armazenar o userId

  useEffect(() => {
    const value = searchParams.get("value");
    if (value) {
      setInputValue(value);
    }

    // Obter o userId da sessão
    const fetchUserId = async () => {
      try {
        const response = await axios.get("/api/session");
        setUserId(response.data.userId);
        console.log("userId obtido da sessão:", response.data.userId);  // Log para verificar o userId
      } catch (error) {
        console.error("Erro ao obter userId da sessão:", error);
      }
    };

    fetchUserId();
  }, [searchParams]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    setFormLoading(true);

    const subject = event.currentTarget.subject.value;
    const message = event.currentTarget.message.value;
    const priority = event.currentTarget.priority.value;
    const cc = event.currentTarget.cc.value;

    // Verificação de campos obrigatórios
    if (!subject || !message || !userId) {
      setFormError("Os campos 'Assunto', 'Mensagem' e 'userId' são obrigatórios.");
      setFormLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("message", message);
    formData.append("priority", priority);
    formData.append("department", inputValue);
    formData.append("userId", userId); // Adicionando userId ao FormData
    if (cc) formData.append("cc", cc);
    if (selectedFiles) {
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append("files", selectedFiles[i]);
      }
    }

    console.log("FormData sendo enviado:", Array.from(formData.entries()));  // Log para verificar o conteúdo do FormData

    try {
      const response = await axios.post("/api/ticket", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFormSuccess(true);
      setFormLoading(false);
      setFormError("");  // Limpar erros após sucesso
    } catch (error) {
      setFormError("Erro ao criar o ticket.");
      setFormLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-center py-10">
          <div className="grid bg-white rounded-lg shadow-xl w-11/12 md:w-9/12 lg:w-1/2">
            {/* Departamento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 mt-5 mx-7">
              <div className="grid grid-cols-1">
                <label className="uppercase md:text-sm text-xs text-gray-500 text-light font-semibold">
                  Departamento
                </label>
                <input
                  className="py-2 px-3 rounded-lg border-2 border-purple-300 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  type="text"
                  value={inputValue}
                  readOnly
                />
              </div>

              {/* Prioridade */}
              <div className="grid grid-cols-1">
                <label className="uppercase md:text-sm text-xs text-gray-500 text-light font-semibold">
                  Prioridade
                </label>
                <select
                  className="py-2 px-3 rounded-lg border-2 border-purple-300 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  name="priority"
                >
                  <option>Baixa</option>
                  <option>Média</option>
                  <option>Urgente</option>
                </select>
              </div>
            </div>

            {/* CC */}
            <div className="grid grid-cols-1 mt-5 mx-7">
              <label className="uppercase md:text-sm text-xs text-gray-500 text-light font-semibold">
                CC
              </label>
              <input
                className="py-2 px-3 rounded-lg border-2 border-purple-300 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                type="text"
                placeholder="CC"
                name="cc"
              />
            </div>

            {/* Assunto */}
            <div className="grid grid-cols-1 mt-5 mx-7">
              <label className="uppercase md:text-sm text-xs text-gray-500 text-light font-semibold">
                Assunto
              </label>
              <input
                className="py-2 px-3 rounded-lg border-2 border-purple-300 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                type="text"
                placeholder="Assunto"
                name="subject"
              />
            </div>

            {/* Mensagem */}
            <div className="grid grid-cols-1 mt-5 mx-7">
              <label className="uppercase md:text-sm text-xs text-gray-500 text-light font-semibold">
                Mensagem
              </label>
              <textarea
                className="py-2 px-3 rounded-lg border-2 border-purple-300 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Mensagem"
                rows={8}
                name="message"
              ></textarea>
            </div>

            {/* Arquivos */}
            <div className="grid grid-cols-1 mt-5 mx-7">
              <label className="uppercase md:text-sm text-xs text-gray-500 text-light font-semibold mb-1">
                Escolher Ficheiro
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col border-4 border-dashed w-full h-32 hover:bg-gray-100 hover:border-purple-300 group">
                  <div className="flex flex-col items-center justify-center pt-7">
                    <svg
                      className="w-10 h-10 text-purple-400 group-hover:text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                    <p className="lowercase text-sm text-gray-400 group-hover:text-purple-600 pt-1 tracking-wider">
                      {selectedFiles
                        ? Array.from(selectedFiles).map((file) => file.name).join(", ")
                        : "Nenhum ficheiro selecionado"}
                    </p>
                  </div>
                  <input
                    type="file"
                    name="files"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>

            {/* Mensagens de Erro e Sucesso */}
            {formError && (
              <div className="text-red-500 mt-5 mx-7">{formError}</div>
            )}
            {formSuccess && (
              <div className="text-green-500 mt-5 mx-7">
                Ticket criado com sucesso!
              </div>
            )}

            {/* Botão de Submissão */}
            <div className="flex items-center justify-center md:gap-8 gap-4 pt-5 pb-5">
              <button
                type="submit"
                className="w-auto bg-purple-500 hover:bg-purple-700 rounded-lg shadow-xl font-medium text-white px-4 py-2"
                disabled={formLoading}
              >
                {formLoading ? "Carregando..." : "Criar Ticket"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TicketForm;