"use client";

import { RegisterResponse } from "@/app/api/register/route";
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
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useRef, useState } from "react";
import Image from "next/image";

export function RegisterForm() {
  // Router serve para fazer redirect de páginas
  const router = useRouter();

  // Referência para os inputs
  const emailInputRef = useRef<HTMLInputElement>(null);
  const companyInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const password2InputRef = useRef<HTMLInputElement>(null);

  // Estados do formulário
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Função que realiza o cadastro ao enviar o formulário
  const handleRegisterSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      // Previne o envio do formulário pelo navegador
      event.preventDefault();
      // Reseta os estados do formulário
      setFormError("");
      setFormLoading(true);

      // Regex para verificar e-mail
      const emailReg = new RegExp(
        "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
      );

      // Verifica se os inputs existem na página
      if (
        emailInputRef.current &&
        companyInputRef.current &&
        password2InputRef.current &&
        passwordInputRef.current
      ) {
        // Pega os valores preenchidos nos inputs
        const email = emailInputRef.current.value;
        const company = companyInputRef.current.value;
        const pass1 = passwordInputRef.current.value;
        const pass2 = password2InputRef.current.value;

        // Começa não precisando dar erro nenhum
        let shouldReturnError = false;

        // Caso encontre algum erro de validação,
        // altera o estado de erro
        if (!emailReg.test(email)) {
          setFormError("Digite um e-mail válido.");
          shouldReturnError = true;
        }

        if (pass1.length < 8) {
          setFormError("A senha precisa ter pelo menos 8 caracteres.");
          shouldReturnError = true;
        }

        if (pass1 !== pass2) {
          setFormError("As senhas não são iguais.");
          shouldReturnError = true;
        }

        if (shouldReturnError) {
          setFormLoading(false);
          setFormSuccess(false);
          return;
        }

        try {
          // Tenta fazer o cadastro
          // Se o AXIOS retornar um erro, ele vai dar um throw new AxiosError()
          // que vai ser verificado no catch()
          const response = await axios.post<RegisterResponse>("/api/register", {
            email,
            company,
            password: pass1,
            password2: pass2,
          });

          // Se chegou aqui, o cadastro deu certo
          router.push("/");

          setFormLoading(false);
          setFormSuccess(true);
        } catch (error) {
          // Se chegou aqui, ocorreu um erro nao tentar cadastrar o usuário
          // Verificamos se é uma instância do AxiosError só para tipar o erro
          if (error instanceof AxiosError) {
            // O erro vem dentro de response.data, como JSON, de acordo com a tipagem
            const { error: errorMessage } = error.response
              ?.data as RegisterResponse;

            // Se o usuário já existe, sugere mandar para o login
            if (errorMessage === "user already exists") {
              setFormError(
                "Esse e-mail já está registrado. Tente ir para o login."
              );
            } else {
              setFormError(errorMessage || error.message);
            }
          }
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
          <h1 className="text-white font-bold text-4xl font-sans">Devenz Studio</h1>
          <p className="text-white mt-1">Bem-vindo ao seu portal de cadastro</p>
        </div>
      </div>
      <div className="flex w-1/2 justify-center items-center bg-zinc-800">
        <form onSubmit={(event) => handleRegisterSubmit(event)} className="w-3/4">
          <div className="mb-7 text-center">
            <Image
              className="w-250 h-300 mx-auto mb-20"
              src="/logo_branca.png"
              alt="Devenz Studio Logo"
              width={250}
              height={250}
            />
            <h1 className="text-white font-bold text-2xl">Criar conta</h1>
            <p className="text-sm font-normal text-white">
              Insira os seus dados para criar uma conta.
            </p>
          </div>
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4 bg-zinc-800">
            <Label className="text-white" htmlFor="email">
              Email
            </Label>
            <Input
              ref={emailInputRef}
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="pl-2 outline-none border-none w-full text-white bg-transparent"
              required
            />
          </div>
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4 bg-zinc-800">
            <Label className="text-white" htmlFor="company">
              Empresa
            </Label>
            <Input
              ref={companyInputRef}
              id="company"
              type="text"
              placeholder="A sua empresa"
              className="pl-2 outline-none border-none w-full text-white bg-transparent"
              required
            />
          </div>
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4 bg-zinc-800">
            <Label className="text-white" htmlFor="password">
              Palavra-passe
            </Label>
            <Input
              ref={passwordInputRef}
              id="password"
              type="password"
              placeholder="Palavra-passe"
              className="pl-2 outline-none border-none w-full text-white bg-transparent"
              required
            />
          </div>
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4 bg-zinc-800">
            <Label className="text-white" htmlFor="password2">
              Repetir palavra-passe
            </Label>
            <Input
              ref={password2InputRef}
              id="password2"
              type="password"
              placeholder="Repita a palavra-passe"
              className="pl-2 outline-none border-none w-full text-white bg-transparent"
              required
            />
          </div>
          {formError && (
            <div className="text-amber-600 mb-4">
              <p className="text-sm font-semibold">Erro no formulário</p>
              <p>{formError}</p>
            </div>
          )}
          {formSuccess && (
            <div className="text-green-500 mb-4">
              <p className="text-sm font-semibold">
                Cadastro realizado, redirecionando para o app
              </p>
            </div>
          )}
          <button
            type="submit"
            className="block w-full bg-orange-600 mt-4 py-2 rounded-2xl text-white font-semibold mb-2 flex items-center justify-center gap-2"
          >
            {formLoading && (
              <LoaderPinwheel className="w-[18px] animate-spin" />
            )}
            Cadastrar
          </button>
          <div className="text-sm text-center mt-4">
            <Link
              href="/login"
              className="hover:text-blue-500 underline text-white"
            >
              Ir para o login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}