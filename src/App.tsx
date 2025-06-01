
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Configuração global otimizada do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Configurações padrão otimizadas para toda a aplicação
      staleTime: 5 * 60 * 1000, // 5 minutos por padrão
      gcTime: 10 * 60 * 1000, // 10 minutos de cache
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false, // Evita refetches desnecessários
      refetchOnMount: false, // Só refetch se dados estiverem stale
    },
    mutations: {
      retry: 1, // Retry mutations uma vez em caso de erro de rede
    }
  }
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
