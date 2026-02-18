"use client";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
//import { ThemeProvider } from "@/components/theme-provider";
import { useState } from "react";
import { ThemeProvider } from "./theme-provider";
import LoginModal from "@/app/components/modals/LoginModal";
import RegisterModal from "@/app/components/modals/RegisterModal";

export function Providers({ children }: { children: React.ReactNode }) {
  // Use state to ensure QueryClient is only created once on the client
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider defaultTheme="light" >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {children}
          <LoginModal />
          <RegisterModal />
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}