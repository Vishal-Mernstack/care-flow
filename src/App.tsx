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
          {/* Placeholder routes for other pages */}
          <Route
            path="/pharmacy"
            element={
              <MainLayout>
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Pharmacy module coming soon...</p>
                </div>
              </MainLayout>
            }
          />
          <Route
            path="/laboratory"
            element={
              <MainLayout>
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Laboratory module coming soon...</p>
                </div>
              </MainLayout>
            }
          />
          <Route
            path="/reports"
            element={
              <MainLayout>
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Reports module coming soon...</p>
                </div>
              </MainLayout>
            }
          />
          <Route
            path="/billing"
            element={
              <MainLayout>
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Billing module coming soon...</p>
                </div>
              </MainLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <MainLayout>
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Settings coming soon...</p>
                </div>
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
