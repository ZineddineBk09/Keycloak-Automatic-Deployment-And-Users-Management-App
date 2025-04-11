"use client";
import React from "react";
import { ClientLoginForm } from "../components/forms/login-form";
import { ThemeToggle } from "../components/theme-toggle";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 flex flex-col items-center justify-center p-4">
      <ClientLoginForm />
    </main>
  );
}
