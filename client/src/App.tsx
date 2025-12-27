import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { MainLayout } from "@/components/layout";
import Dashboard from "./pages/Dashboard";
import EquipmentPage from "./pages/EquipmentPage";
import EquipmentDetailPage from "./pages/EquipmentDetailPage";
import EquipmentFormPage from "./pages/EquipmentFormPage";
import TeamsPage from "./pages/TeamsPage";
import RequestsPage from "./pages/RequestsPage";
import RequestFormPage from "./pages/RequestFormPage";
import CalendarPage from "./pages/CalendarPage";
import ReportsPage from "./pages/ReportsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/equipment" element={<EquipmentPage />} />
              <Route path="/equipment/new" element={<EquipmentFormPage />} />
              <Route path="/equipment/:id" element={<EquipmentDetailPage />} />
              <Route path="/equipment/:id/edit" element={<EquipmentFormPage />} />
              <Route path="/teams" element={<TeamsPage />} />
              <Route path="/requests" element={<RequestsPage />} />
              <Route path="/requests/new" element={<RequestFormPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/reports" element={<ReportsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
