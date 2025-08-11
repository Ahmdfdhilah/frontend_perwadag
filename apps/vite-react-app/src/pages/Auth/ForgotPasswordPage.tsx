import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { requestPasswordResetAsync } from '@/redux/features/authSlice';

import { Button } from '@workspace/ui/components/button';
import { LoadingButton } from '@/components/common/LoadingButton';
import { Input } from '@workspace/ui/components/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@workspace/ui/components/form';
import { useToast } from '@workspace/ui/components/sonner';

import { useTheme } from '@/hooks/useTheme';
import { useCaptcha } from '@/hooks/useCaptcha';
import logoLightMode from '@/assets/logoLightMode.png';
import logoDarkMode from '@/assets/logoDarkMode.png';
import bgImage from '@/assets/bg.webp';
import logoSielang from '@/assets/logo-sielang.png';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordPage() {
  const { isDarkMode } = useTheme();
  const { executeRecaptcha, isLoading: captchaLoading, isEnabled: captchaEnabled, error: captchaError } = useCaptcha();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: location.state?.username || '',
    }
  });

  React.useEffect(() => {
    if (error) {
      setError('');
    } else if (captchaError) {
      setError(`CAPTCHA Error: ${captchaError}`);
    }
  }, [form.watch(), error, captchaError]);

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    setError('');

    try {
      // Generate CAPTCHA token if enabled
      let captchaToken: string | null = null;
      if (captchaEnabled) {
        captchaToken = await executeRecaptcha('forgot_password');
        if (!captchaToken) {
          setError('Gagal menggenerate token keamanan. Silakan refresh halaman dan coba lagi.');
          setLoading(false);
          return;
        }
      }

      await dispatch(requestPasswordResetAsync({ 
        email: data.email,
        captcha_token: captchaToken || undefined 
      })).unwrap();
      toast({
        title: 'Email reset password terkirim',
        description: 'Silakan cek email Anda untuk mendapatkan link reset password.',
        variant: 'default'
      });
      navigate('/callback', {
        state: { email: data.email }
      });
    } catch (error: any) {
      setError(error || 'Terjadi kesalahan saat mengirim email reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen h-screen relative overflow-hidden">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-full">
        {/* Left Side - Background Image (70%) */}
        <div className="w-[70%] relative bg-gray-100 dark:bg-gray-900">
          <img 
            src={bgImage} 
            alt="Background" 
            className="w-full h-full object-cover"
            style={{ height: '100dvh' }}
          />
          {/* Overlay semi-transparan */}
          <div className="absolute inset-0 bg-black/10" />
          
          {/* System Info Overlay - Top Left */}
          <div className="absolute top-2 left-8 text-white flex items-center">
            <img
              src={logoSielang}
              alt="SIELANGMERAH Logo"
              className="w-40 h-40 object-contain"
            />
            <p className="font-bold opacity-90 max-w-sm">
              Sistem Evaluasi Kinerja Perwakilan Perdagangan Metode Jarak Jauh
            </p>
          </div>
        </div>

        {/* Right Side - Forgot Password Form (30%) */}
        <div className="w-[30%] flex items-center justify-center bg-background p-8">
          <div className="w-full max-w-md space-y-6">
            
            {/* Logo and Header */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <img src={isDarkMode ? logoDarkMode : logoLightMode} alt="Logo Kemendag" className="h-12 w-auto" width="144" height="48" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Lupa Password</h1>
                <p className="text-muted-foreground">
                  Masukkan email Anda untuk mendapatkan link reset password
                </p>
              </div>
            </div>

            {/* Forgot Password Form */}
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">Reset Password</CardTitle>
                <CardDescription>
                  Kami akan mengirimkan link reset password ke email Anda
                </CardDescription>
              </CardHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-4">
                    {/* Error Alert */}
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>
                          {error}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Email Field */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter your email address"
                              disabled={loading || captchaLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>

                  <CardFooter className="flex flex-col space-y-4 mt-4">
                    <LoadingButton
                      type="submit"
                      className="w-full"
                      loading={loading || captchaLoading}
                      loadingText={captchaLoading ? "Memverifikasi keamanan..." : "Mengirim..."}
                    >
                      Kirim Link Reset Password
                    </LoadingButton>
                    
                
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleBackToLogin}
                      disabled={loading || captchaLoading}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Kembali ke Login
                    </Button>

                        {/* CAPTCHA Status Indicator */}
                        {captchaEnabled && (
                      <div className="text-xs text-muted-foreground text-center">
                        🛡️ Dilindungi dengan reCAPTCHA
                      </div>
                    )}
                    
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* Logo and Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <img src={isDarkMode ? logoDarkMode : logoLightMode} alt="Logo Kemendag" className="h-12 w-auto" width="144" height="48" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Lupa Password</h1>
              <p className="text-muted-foreground">
                Masukkan email Anda untuk mendapatkan link reset password
              </p>
            </div>
          </div>

          {/* Forgot Password Form */}
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl">Reset Password</CardTitle>
              <CardDescription>
                Kami akan mengirimkan link reset password ke email Anda
              </CardDescription>
            </CardHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  {/* Error Alert */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email address"
                            disabled={loading || captchaLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>

                <CardFooter className="flex flex-col space-y-4 mt-4">
                  <LoadingButton
                    type="submit"
                    className="w-full"
                    loading={loading || captchaLoading}
                    loadingText={captchaLoading ? "Memverifikasi keamanan..." : "Mengirim..."}
                  >
                    Kirim Link Reset Password
                  </LoadingButton>
                  
                  {/* CAPTCHA Status Indicator */}
                  {captchaEnabled && (
                    <div className="text-xs text-muted-foreground text-center">
                      🛡️ Dilindungi dengan reCAPTCHA
                    </div>
                  )}
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleBackToLogin}
                    disabled={loading}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Login
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}