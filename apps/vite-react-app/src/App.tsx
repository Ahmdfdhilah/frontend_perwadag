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
import RiskAssessmentPage from './pages/RiskAssesment/RiskAssessmentPage';
import RiskAssessmentInputPage from './pages/RiskAssesment/RiskAssessmentInputPage';
import RiskAssessmentDetailPage from './pages/RiskAssesment/RiskAssessmentDetailPage';
import SuratTugasPage from './pages/SuratTugasPage';
import SuratPemberitahuanPage from './pages/SuratPemberitahuanPage';
import EntryMeetingPage from './pages/EntryMeetingPage';
import ExitMeetingPage from './pages/ExitMeetingPage';
import LaporanHasilEvaluasiPage from './pages/LaporanHasilEvaluasiPage';
import KuesionerPage from './pages/KuesionerPage';
import MatriksPage from './pages/MatriksPage';
import { LoginPage } from './pages/auth/LoginPage';
import { DefaultLayout } from './components/layouts';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { EmailSentSuccessPage } from './pages/auth/EmailSentSuccessPage';
import UsersPage from './pages/users/UsersPage';
import ProfilePage from './pages/profile/ProfilePage';


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
                  <Route path="/" element={<DefaultLayout />}>
                    <Route path='login' element={<LoginPage />} />
                    <Route path='forgot-password' element={<ForgotPasswordPage />} />
                    <Route path='callback' element={<EmailSentSuccessPage />} />
                  </Route>
                  <Route path="/" element={<DashboardLayout />}>
                    <Route index element={<RiskAssessmentPage />} />
                    <Route path="penilaian-resiko" element={<RiskAssessmentPage />} />
                    <Route path="penilaian-resiko/:id" element={<RiskAssessmentDetailPage />} />
                    <Route path="penilaian-resiko/:id/edit" element={<RiskAssessmentInputPage />} />
                    <Route path="surat-tugas" element={<SuratTugasPage />} />
                    <Route path="surat-pemberitahuan" element={<SuratPemberitahuanPage />} />
                    <Route path="matriks" element={<MatriksPage />} />
                    <Route path="entry-meeting" element={<EntryMeetingPage />} />
                    <Route path="exit-meeting" element={<ExitMeetingPage />} />
                    <Route path="laporan-hasil" element={<LaporanHasilEvaluasiPage />} />
                    <Route path="kuesioner" element={<KuesionerPage />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="profile" element={<ProfilePage />} />
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