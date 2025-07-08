// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { TooltipProvider } from '@workspace/ui/components/tooltip';
// Import your layouts/components
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import { Toaster } from "@workspace/ui/components/sonner";
import { AuthProvider } from './components/Auth/AuthProvider';
import { DashboardLayout } from './components/layouts/DashboardLayout';
import RiskAssessmentPage from './pages/RiskAssessmentPage';
import RiskAssessmentInputPage from './pages/RiskAssessmentInputPage';


function App() {
  return (
    <HelmetProvider>
      <Provider store={store}>
        <TooltipProvider>
          <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
              <AuthProvider>
                <Toaster />
                <Routes>
                  <Route path="/" element={<DashboardLayout />}>
                    <Route index element={<RiskAssessmentPage />} />
                    <Route path="penilaian-resiko" element={<RiskAssessmentPage />} />
                    <Route path="penilaian-resiko/:id" element={<RiskAssessmentInputPage />} />
                    <Route path="penilaian-resiko/:id/edit" element={<RiskAssessmentInputPage />} />
                  </Route>
                </Routes>
              </AuthProvider>
            </BrowserRouter>
          </PersistGate>
        </TooltipProvider>
      </Provider>
    </HelmetProvider>
  );
}

export default App;