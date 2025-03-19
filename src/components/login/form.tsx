"use client";

import { LoginResponse } from "@/app/api/login/route";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios, { AxiosError } from "axios";
import { LoaderPinwheel } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useRef, useState } from "react";

export function LoginForm() {
  // Router serve para fazer redirect de páginas
  const router = useRouter();

  // Referência para os inputs
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Estados do formulário
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Função que realiza o login ao enviar o formulário
  const handleLoginSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      // Previne o envio do formulário pelo navegador
      event.preventDefault();
      // Reseta os estados do formulário
      setFormError("");
      setFormLoading(true);

      // Verifica se os inputs existem na página
      if (emailInputRef.current && passwordInputRef.current) {
        // Pega os valores preenchidos nos inputs
        const email = emailInputRef.current.value;
        const pass1 = passwordInputRef.current.value;

        try {
          // tenta realizar o login
          const response = await axios.post<LoginResponse>("/api/login", {
            email,
            password: pass1,
          });

          // se chegar aqui, o login deu certo
          router.push("/");

          setFormLoading(false);
          setFormSuccess(true);
        } catch (error) {
          // Altera o estado de forma genérica, sem informar o erro
          setFormError("login invalid");
          setFormLoading(false);
          setFormSuccess(false);
        }
      }
    },
    [router]
  );

  return (
    <div className="h-screen flex">
      <div className="flex w-1/2 bg-gradient-to-r from-orange-600 to-zinc-800 justify-around items-center">
        <div>
          <h1 className="text-white font-bold text-4xl font-sans">
            Devenz Studio
          </h1>
          <p className="text-white mt-1">Bem-vindo ao seu portal de login</p>
        </div>
      </div>
      <div className="flex w-1/2 justify-center items-center bg-zinc-800">
        <form
          onSubmit={(event) => handleLoginSubmit(event)}
          className="bg-zinc-800 w-3/4"
        >
          <div className="mb-7 text-center">
            <Image
              className="w-250 h-300 mx-auto mb-20"
              src="/logo_branca.png"
              alt="Devenz Studio Logo"
              width={250}
              height={250}
            />
            <h1 className="text-white font-bold text-2xl mt-4">Login</h1>
            <p className="text-sm font-normal text-white">Bem-vindo de volta</p>
          </div>
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              />
            </svg>
            <Input
              ref={emailInputRef}
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="pl-2 outline-none border-none w-full text-white bg-zinc-800"
              required
            />
          </div>
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2-2 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <Input
              ref={passwordInputRef}
              id="password"
              type="password"
              placeholder="Palavra-passe"
              className="pl-2 outline-none border-none w-full text-white bg-zinc-800"
              required
            />
          </div>
          {formError && (
            <div className="text-amber-600 mb-4">
              <p className="text-sm font-semibold">Erro no login</p>
              <p>Verifique suas credenciais.</p>
            </div>
          )}
          <button
            type="submit"
            className="block w-full bg-orange-600 mt-4 py-2 rounded-2xl text-white font-semibold mb-2 flex items-center justify-center gap-2"
          >
            {formLoading && (
              <LoaderPinwheel className="w-[18px] animate-spin" />
            )}
            Entrar
          </button>
          <div className="text-sm text-center mt-4">
            <Link
              href="/signup"
              className="hover:text-blue-500 underline text-white"
            >
              Criar uma conta
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
