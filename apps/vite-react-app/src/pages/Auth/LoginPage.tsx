// apps/vite-react-app/src/pages/auth/LoginPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import { LoadingButton } from '@/components/common/LoadingButton';
import { Input } from '@workspace/ui/components/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@workspace/ui/components/form';
import { Checkbox } from '@workspace/ui/components/checkbox';
import { useToast } from '@workspace/ui/components/sonner';

import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/components/Auth/AuthProvider';
import logoLightMode from '@/assets/logoLightMode.png';
import logoDarkMode from '@/assets/logoDarkMode.png';
import bgImage from '@/assets/bg.webp';
import logoSielang from '@/assets/logo-sielang.png';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false)
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { isDarkMode } = useTheme();
  const { login, isAuthenticated, loading: authLoading, error, clearAuthError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const { toast } = useToast();

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/';
  const message = location.state?.message || '';

  // Check if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Update local error state when auth error changes
  useEffect(() => {
    if (error) {
      setLoginError(error);
    }
  }, [error]);

  // Set success message if provided
  useEffect(() => {
    if (message) {
      setSuccessMessage(message);
    }
  }, [message]);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false
    }
  });

  // Clear errors and success message when form values change
  useEffect(() => {
    if (loginError) {
      setLoginError('');
      clearAuthError();
    }
    if (successMessage) {
      setSuccessMessage('');
    }
  }, [form.watch(), clearAuthError, loginError, successMessage]);

  const onSubmit = async (data: LoginFormData) => {
    setLoginError('');
    clearAuthError();

    try {
      await login({
        username: data.username,
        password: data.password
      });

      if (data.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      toast({
        title: 'Login berhasil',
        description: 'Selamat datang! Anda berhasil masuk ke sistem.',
        variant: 'default'
      });

      // Navigation will be handled by useEffect when isAuthenticated becomes true
    } catch (error: any) {
      // Error is already handled by auth provider
      console.error('Login failed:', error);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password', {
      state: { username: form.getValues('username') }
    });
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

        {/* Right Side - Login Form (30%) */}
        <div className="w-[30%] flex items-center justify-center bg-background p-8">
          <div className="w-full max-w-md space-y-6">

            {/* Logo and Header */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <img src={isDarkMode ? logoDarkMode : logoLightMode} alt="logo kemendag" className="h-12 w-auto" width="144" height="48" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Selamat Datang</h1>
                <p className="text-muted-foreground">
                  Masuk ke akun Anda
                </p>
              </div>
            </div>

            {/* Login Form */}
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">Login</CardTitle>
                <CardDescription>
                  Masukan username dan password untuk akses akun
                </CardDescription>
              </CardHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-4">
                    {/* Error Alert */}
                    {loginError && (
                      <Alert variant="destructive">
                        <AlertDescription>
                          {loginError}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Success Alert */}
                    {successMessage && (
                      <Alert>
                        <AlertDescription>
                          {successMessage}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Username Field */}
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Masukkan username"
                              disabled={authLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Password Field */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Masukkan password"
                                disabled={authLoading}
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={authLoading}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />


                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                      <FormField
                        control={form.control}
                        name="rememberMe"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={authLoading}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm font-normal">
                                Ingat saya
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        className="px-0 h-auto font-normal"
                        onClick={handleForgotPassword}
                        disabled={authLoading}
                      >
                        Lupa password?
                      </Button>
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-col space-y-4 mt-4">
                    <LoadingButton
                      type="submit"
                      className="w-full"
                      loading={authLoading}
                      loadingText="Masuk..."
                    >
                      Masuk
                    </LoadingButton>
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
              <img src={isDarkMode ? logoDarkMode : logoLightMode} alt="" className="h-12 w-auto" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Selamat Datang</h1>
              <p className="text-muted-foreground">
                Login dengan Username
              </p>
            </div>
          </div>

          {/* Login Form */}
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl">Login</CardTitle>
              <CardDescription>
                Masukan username dan password untuk akses akun
              </CardDescription>
            </CardHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  {/* Error Alert */}
                  {loginError && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        {loginError}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Success Alert */}
                  {successMessage && (
                    <Alert>
                      <AlertDescription>
                        {successMessage}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Username Field */}
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Masukkan username"
                            disabled={authLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password Field */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Masukkan password"
                              disabled={authLoading}
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                              disabled={authLoading}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />


                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <FormField
                      control={form.control}
                      name="rememberMe"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={authLoading}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal">
                              Ingat saya
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      className="px-0 h-auto font-normal"
                      onClick={handleForgotPassword}
                      disabled={authLoading}
                    >
                      Lupa password?
                    </Button>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4 mt-4">
                  <LoadingButton
                    type="submit"
                    className="w-full"
                    loading={authLoading}
                    loadingText="Masuk..."
                  >
                    Masuk
                  </LoadingButton>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}