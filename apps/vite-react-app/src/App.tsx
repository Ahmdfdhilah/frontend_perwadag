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
import { LoginPage } from './pages/auth/LoginPage';
import { DefaultLayout } from './components/layouts';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { EmailSentSuccessPage } from './pages/auth/EmailSentSuccessPage';
import UsersPage from './pages/users/UsersPage';
import ProfilePage from './pages/profile/ProfilePage';
import { PublicRoute, AuthGuard, AdminGuard, AdminOrInspektoratGuard } from './components/Auth/AuthGuard';
import { RoleProtectedRoute } from './components/Auth/RoleProtectedRoute';
import { RoleBasedHome } from './components/Auth/RoleBasedHome';


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
                  </Route>
                  
                  {/* Protected routes */}
                  <Route path="/" element={
                    <AuthGuard>
                      <DashboardLayout />
                    </AuthGuard>
                  }>
                    {/* Home route - redirects based on role */}
                    <Route index element={<RoleBasedHome />} />
                    
                    {/* Risk Assessment - Admin and Inspektorat only */}
                    <Route path="penilaian-resiko" element={
                      <RoleProtectedRoute allowedRoles={['admin', 'inspektorat']}>
                        <RiskAssessmentPage />
                      </RoleProtectedRoute>
                    } />
                    <Route path="penilaian-resiko/:id" element={
                      <RoleProtectedRoute allowedRoles={['admin', 'inspektorat']}>
                        <RiskAssessmentDetailPage />
                      </RoleProtectedRoute>
                    } />
                    <Route path="penilaian-resiko/:id/edit" element={
                      <RoleProtectedRoute allowedRoles={['admin', 'inspektorat']}>
                        <RiskAssessmentInputPage />
                      </RoleProtectedRoute>
                    } />
                    
                    {/* All roles can access these */}
                    <Route path="surat-tugas" element={
                      <RoleProtectedRoute allowedRoles={['admin', 'inspektorat', 'perwadag']}>
                        <SuratTugasPage />
                      </RoleProtectedRoute>
                    } />
                    <Route path="surat-pemberitahuan" element={
                      <RoleProtectedRoute allowedRoles={['admin', 'inspektorat', 'perwadag']}>
                        <SuratPemberitahuanPage />
                      </RoleProtectedRoute>
                    } />
                    <Route path="matriks" element={
                      <RoleProtectedRoute allowedRoles={['admin', 'inspektorat', 'perwadag']}>
                        <MatriksPage />
                      </RoleProtectedRoute>
                    } />
                    <Route path="entry-meeting" element={
                      <RoleProtectedRoute allowedRoles={['admin', 'inspektorat', 'perwadag']}>
                        <EntryMeetingPage />
                      </RoleProtectedRoute>
                    } />
                    <Route path="exit-meeting" element={
                      <RoleProtectedRoute allowedRoles={['admin', 'inspektorat', 'perwadag']}>
                        <ExitMeetingPage />
                      </RoleProtectedRoute>
                    } />
                    <Route path="konfirmasi-meeting" element={
                      <RoleProtectedRoute allowedRoles={['admin', 'inspektorat', 'perwadag']}>
                        <KonfirmasiMeetingPage />
                      </RoleProtectedRoute>
                    } />
                    <Route path="laporan-hasil" element={
                      <RoleProtectedRoute allowedRoles={['admin', 'inspektorat', 'perwadag']}>
                        <LaporanHasilEvaluasiPage />
                      </RoleProtectedRoute>
                    } />
                    <Route path="kuesioner" element={
                      <RoleProtectedRoute allowedRoles={['admin', 'inspektorat', 'perwadag']}>
                        <KuesionerPage />
                      </RoleProtectedRoute>
                    } />
                    <Route path="template-kuesioner" element={
                      <RoleProtectedRoute allowedRoles={['admin', 'inspektorat', 'perwadag']}>
                        <QuestionnaireTemplatePage />
                      </RoleProtectedRoute>
                    } />
                    
                    {/* Admin only routes */}
                    <Route path="users" element={
                      <RoleProtectedRoute allowedRoles={['admin']}>
                        <UsersPage />
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