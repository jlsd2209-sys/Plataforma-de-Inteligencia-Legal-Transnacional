import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Asistente from "./pages/Asistente";

// 1. IMPORTAMOS EL CHATBOT (Basado en la foto de tus carpetas)
import { FloatingButtons } from "@/ui/FloatingButtons";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/asistente" element={<Asistente />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        {/* 2. COLOCAMOS EL CHATBOT AQUÍ PARA QUE SEA GLOBAL */}
        <FloatingButtons />
        
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
