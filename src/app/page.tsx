import axios, { AxiosHeaders } from "axios";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Footer from "../components/footer/footer";
import Header from "@/components/header/header";
import Link from "next/link";

export default async function Home() {
  try {
    await axios.get(`${process.env.API_URL}/login`, {
      headers: headers() as unknown as AxiosHeaders,
    });
  } catch (error) {
    redirect("/login");
  }

  const valueSuport = "Suporte Técnico";
  const valueInfos = "Informações";
  const valueFinancial = "Financeiro";
  const valueComercial = "Comercial";

  return (
    <div className="h-screen">
      <Header />
      <section className="py-10">
        <div className="container max-w-7xl">
          <h2 className="text-3xl font-medium md:w-1/2">Enviar Ticket</h2>
          <div
            data-orientation="horizontal"
            role="none"
            className="shrink-0 bg-border h-[1px] w-full mb-8 mt-3"
          ></div>
          <div className="flex flex-col justify-between gap-6 md:flex-row">
            <p className="">
              Se não conseguir encontrar a solução para o seu problema abra um
              Ticket de Suporte para o departamento listado a baixo.
            </p>
          </div>
          <div className="mt-11 grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
          <Link href={`/ticket?value=${encodeURIComponent(valueSuport)}`}>
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-orange-600 hover:text-white transition-colors duration-300 group cursor-pointer">
                <div className="p-5">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"
                      />
                    </svg>
                    <p className="mb-1 font-medium">Suporte Técnico</p>
                  </div>
                  <p className="text-zinc-600 group-hover:text-white">Suporte e Questões Técnicas</p>
                </div>
              </div>
            </Link>
            <Link href={`/ticket?value=${encodeURIComponent(valueInfos)}`}>
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-orange-600 hover:text-white transition-colors duration-300 group cursor-pointer">
                <div className="p-5">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                      />
                    </svg>
                    <p className="mb-1 font-medium">Informações</p>
                  </div>
                  <p className="text-zinc-600 group-hover:text-white">Informações e Assuntos Gerais</p>
                </div>
              </div>
            </Link>
            <Link href={`/ticket?value=${encodeURIComponent(valueFinancial)}`}>
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-orange-600 hover:text-white transition-colors duration-300 group cursor-pointer">
                <div className="p-5">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    <p className="mb-1 font-medium">Financeiro</p>
                  </div>
                  <p className="text-zinc-600 group-hover:text-white">
                    Pagamentos e Assuntos de Faturação
                  </p>
                </div>
              </div>
            </Link>
            <Link href={`/ticket?value=${encodeURIComponent(valueComercial)}`}>
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-orange-600 hover:text-white transition-colors duration-300 group cursor-pointer">
                <div className="p-5">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                      />
                    </svg>
                    <p className="mb-1 font-medium">Comercial</p>
                  </div>
                  <p className="text-zinc-600 group-hover:text-white">
                    Pedidos de Proposta e Outros Assuntos Comerciais
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}