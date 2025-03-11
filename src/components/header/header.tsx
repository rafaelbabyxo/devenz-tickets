"use client";

import React, { useState } from "react";
import Image from "next/image";
import Logo from "../../../public/logo.png";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  const isActive = (paths: string[]) => paths.includes(pathname);

  return (
    <header className="static inset-x-0 top-0 z-20 bg-background">
      <div className="container">
        <nav
          aria-label="Main Navigation"
          className="relative z-10 flex w-full items-center justify-center"
        >
          <div className="flex w-full items-center justify-between gap-12 py-4">
            {/* Logo */}
            <div>
              <Image src={Logo} alt="Logo" className="h-16 w-auto" />
            </div>

            {/* Navigation Links */}
            <ul className="hidden lg:flex items-center space-x-8">
              {/* Home */}
              <li>
                <a
                  href="https://devenz.pt/"
                  className={`inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground`}
                >
                  Home
                </a>
              </li>

              {/* Tickets (Dropdown) */}
              <li
                className="relative group"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
                    isActive(["/", "/", "/tickets/consult"])
                      ? "bg-accent text-accent-foreground"
                      : ""
                  }`}
                >
                  Tickets
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`ml-2 h-4 w-4 transition-transform ${
                      isDropdownOpen ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="absolute left-0 top-full w-48 bg-white shadow-lg rounded-md max-w-fit max-h-fit">
                    <ul className="py-2">
                      <li>
                        <a
                          href="/"
                          className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                            isActive(["/"]) ? "bg-gray-100" : ""
                          }`}
                        >
                          Criar
                        </a>
                      </li>
                      <li>
                        <a
                          href="/tickets"
                          className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                            isActive(["/tickets"]) ? "bg-gray-100" : ""
                          }`}
                        >
                          Consultar
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
              </li>

              {/* Contactos */}
              <li>
                <button
                  className={`inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
                    isActive(["/contact"])
                      ? "bg-accent text-accent-foreground"
                      : ""
                  }`}
                  onClick={() => router.push("/contact")}
                >
                  Contactos
                </button>
              </li>
            </ul>

            {/* Conta Button */}
            <div className="hidden lg:flex items-center gap-4">
              <button className="inline-flex items-center justify-center rounded-md border border-input px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                Conta
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
