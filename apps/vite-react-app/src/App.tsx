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
import QuestionnaireTemplatePage from './pages/QuestionnaireTemplatePage';
import KonfirmasiMeetingPage from './pages/KonfirmasiMeetingPage';
import EmailTemplatesPage from './pages/EmailTemplatesPage';
import { LoginPage } from './pages/auth/LoginPage';
import { DefaultLayout } from './components/layouts';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { EmailSentSuccessPage } from './pages/auth/EmailSentSuccessPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import UsersPage from './pages/users/UsersPage';
import ProfilePage from './pages/Profile/ProfilePage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import { PublicRoute, AuthGuard } from './components/Auth/AuthGuard';
import { RoleProtectedRoute } from './components/Auth/RoleProtectedRoute';

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
                  {/* Public routes */}
                  <Route path="/" element={<DefaultLayout />}>
                    <Route path='login' element={
                      <PublicRoute>
                        <LoginPage />
                      </PublicRoute>
                    } />
                    <Route path='forgot-password' element={
                      <PublicRoute>
                        <ForgotPasswordPage />
                      </PublicRoute>
                    } />
                    <Route path='callback' element={
                      <PublicRoute>
                        <EmailSentSuccessPage />
                      </PublicRoute>
                    } />
                    <Route path='reset-password' element={
                      <PublicRoute>
                        <ResetPasswordPage />
                      </PublicRoute>
                    } />
                  </Route>
                  
                  {/* Protected routes */}
                  <Route path="/" element={
                    <AuthGuard>
                      <DashboardLayout />
                    </AuthGuard>
                  }>
                              
                    {/* Dashboard - All authenticated users */}
                    <Route path="dashboard" element={
                      <RoleProtectedRoute allowedRoles={['ADMIN', 'INSPEKTORAT', 'PERWADAG']}>
                        <DashboardPage />
                      </RoleProtectedRoute>
                    } />
                    
                    {/* Risk Assessment - ADMIN and INSPEKTORAT only */}
                    <Route path="penilaian-resiko" element={
                      <RoleProtectedRoute allowedRoles={['ADMIN', 'INSPEKTORAT']}>
                        <RiskAssessmentPage />
                      </RoleProtectedRoute>
                    } />
                    <Route path="penilaian-resiko/:id" element={
                      <RoleProtectedRoute allowedRoles={['ADMIN', 'INSPEKTORAT']}>
                        <RiskAssessmentDetailPage />
                      </RoleProtectedRoute>
                    } />
                    <Route path="penilaian-resiko/:id/edit" element={
                      <RoleProtectedRoute allowedRoles={['ADMIN', 'INSPEKTORAT']}>
                        <RiskAssessmentInputPage />
                      </RoleProtectedRoute>
                    } />
                    
                    {/* All roles can access these */}
                    <Route path="surat-tugas" element={
                      <RoleProtectedRoute allowedRoles={['ADMIN', 'INSPEKTORAT', 'PERWADAG']}>
                        <SuratTugasPage />
                      </RoleProtectedRoute>
                    } />
                    <Route path="surat-pemberitahuan" element={
                      <RoleProtectedRoute allowedRoles={['ADMIN', 'INSPEKTORAT', 'PERWADAG']}>
                        <SuratPemberitahuanPage />
                      </RoleProtectedRoute>
                    } />
                    <Route path="matriks" element={
                      <RoleProtectedRoute allowedRoles={['ADMIN', 'INSPEKTORAT', 'PERWADAG']}>
                        <MatriksPage />
                      </RoleProtectedRoute>
                    } />
                    <Route path="entry-meeting" element={
                      <RoleProtectedRoute allowedRoles={['ADMIN', 'INSPEKTORAT', 'PERWADAG']}>
                        <EntryMeetingPage />
                      </RoleProtectedRoute>
                    } />
                    <Route path="exit-meeting" element={
                      <RoleProtectedRoute allowedRoles={['ADMIN', 'INSPEKTORAT', 'PERWADAG']}>
                        <ExitMeetingPage />
                      </RoleProtectedRoute>
                    } />
                    <Route path="konfirmasi-meeting" element={
                      <RoleProtectedRoute allowedRoles={['ADMIN', 'INSPEKTORAT', 'PERWADAG']}>
                        <KonfirmasiMeetingPage />
                      </RoleProtectedRoute>
                    } />
                    <Route path="laporan-hasil" element={
                      <RoleProtectedRoute allowedRoles={['ADMIN', 'INSPEKTORAT', 'PERWADAG']}>
                        <LaporanHasilEvaluasiPage />
                      </RoleProtectedRoute>
                    } />
                    <Route path="kuesioner" element={
                      <RoleProtectedRoute allowedRoles={['ADMIN', 'INSPEKTORAT', 'PERWADAG']}>
                        <KuesionerPage />
                      </RoleProtectedRoute>
                    } />
                    <Route path="template-kuesioner" element={
                      <RoleProtectedRoute allowedRoles={['ADMIN', 'INSPEKTORAT', 'PERWADAG']}>
                        <QuestionnaireTemplatePage />
                      </RoleProtectedRoute>
                    } />
                    
                    {/* ADMIN only routes */}
                    <Route path="users" element={
                      <RoleProtectedRoute allowedRoles={['ADMIN']}>
                        <UsersPage />
                      </RoleProtectedRoute>
                    } />
                    <Route path="email-templates" element={
                      <RoleProtectedRoute allowedRoles={['ADMIN']}>
                        <EmailTemplatesPage />
                      </RoleProtectedRoute>
                    } />
                    
                    {/* Profile - All authenticated users */}
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