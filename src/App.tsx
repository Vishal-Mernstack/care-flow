import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";
import Departments from "./pages/Departments";
import Emergency from "./pages/Emergency";
import Pharmacy from "./pages/Pharmacy";
import Laboratory from "./pages/Laboratory";
import Reports from "./pages/Reports";
import Billing from "./pages/Billing";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            }
          />
          <Route
            path="/patients"
            element={
              <MainLayout>
                <Patients />
              </MainLayout>
            }
          />
          <Route
            path="/doctors"
            element={
              <MainLayout>
                <Doctors />
              </MainLayout>
            }
          />
          <Route
            path="/appointments"
            element={
              <MainLayout>
                <Appointments />
              </MainLayout>
            }
          />
          <Route
            path="/departments"
            element={
              <MainLayout>
                <Departments />
              </MainLayout>
            }
          />
          <Route
            path="/emergency"
            element={
              <MainLayout>
                <Emergency />
              </MainLayout>
            }
          />
          <Route
            path="/pharmacy"
            element={
              <MainLayout>
                <Pharmacy />
              </MainLayout>
            }
          />
          <Route
            path="/laboratory"
            element={
              <MainLayout>
                <Laboratory />
              </MainLayout>
            }
          />
          <Route
            path="/reports"
            element={
              <MainLayout>
                <Reports />
              </MainLayout>
            }
          />
          <Route
            path="/billing"
            element={
              <MainLayout>
                <Billing />
              </MainLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <MainLayout>
                <Settings />
              </MainLayout>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
