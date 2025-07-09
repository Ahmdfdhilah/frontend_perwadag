// apps/vite-react-app/src/pages/auth/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@workspace/ui/components/form';
import { Checkbox } from '@workspace/ui/components/checkbox';

import { useTheme } from '@/hooks/useTheme';
import logoLightMode from '@/assets/logoLightMode.png';
import logoDarkMode from '@/assets/logoDarkMode.png';
import loginIcon from '@/assets/loginIcon.png';

const loginSchema = z.object({
  email: z.string().min(1, 'Email/NIP is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false)
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { isDarkMode } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string>('');

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/';

  // Check if already logged in (dummy check)
  // React.useEffect(() => {
  //   const isLoggedIn = localStorage.getItem('isLoggedIn');
  //   if (isLoggedIn === 'true') {
  //     navigate(from, { replace: true });
  //   }
  // }, [navigate, from]);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  // Clear errors when form values change
  React.useEffect(() => {
    if (loginError) {
      setLoginError('');
    }
  }, [form.watch()]);

  const onSubmit = (data: LoginFormData) => {
    setLoading(true);
    setLoginError('');

    // Dummy authentication - just simulate a delay
    setTimeout(() => {
      // Store dummy login state
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', data.email);
      if (data.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      
      setLoading(false);
      // Redirect to dashboard
      navigate(from, { replace: true });
    }, 1000);
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password', {
      state: { email: form.getValues('email') }
    });
  };

  return (
    <div className="max-h-screen relative overflow-hidden">
      {/* Desktop Layout */}
      <div className="hidden md:flex max-h-screen">
        {/* Left Side - Banner Image */}
        <div className="flex-[2] relative bg-gray-100 dark:bg-gray-900">
          <img 
            src={loginIcon} 
            alt="Login Banner" 
            className="w-[80%] object-cover"
          />
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center bg-background p-8">
          <div className="w-full max-w-md space-y-6">
            
            {/* Logo and Header */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <img src={isDarkMode ? logoDarkMode : logoLightMode} alt="OKOCE HRIS" className="h-12 w-auto" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Selamat Datang</h1>
                <p className="text-muted-foreground">
                  Login dengan Email atau NIP
                </p>
              </div>
            </div>

            {/* Login Form */}
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">Login</CardTitle>
                <CardDescription>
                  Masukan email/NIP dan pasword untuk akses akun
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

                    {/* Email/NIP Field */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email/NIP</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter your email or NIP"
                              disabled={loading}
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
                                placeholder="Enter your password"
                                disabled={loading}
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loading}
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
                                disabled={loading}
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
                        disabled={loading}
                      >
                        Lupa password?
                      </Button>
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-col space-y-4 mt-4">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Log in...
                        </>
                      ) : (
                        'Sign in'
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md space-y-6">
          {/* Logo and Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <img src={isDarkMode ? logoDarkMode : logoLightMode} alt="OKOCE HRIS" className="h-12 w-auto" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Selamat Datang</h1>
              <p className="text-white/80">
              Login dengan Email atau NIP
              </p>
            </div>
          </div>

          {/* Login Form */}
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl">Login</CardTitle>
              <CardDescription>
              Masukan email/NIP dan pasword untuk akses akun
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

                  {/* Email/NIP Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email/NIP</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter your email or NIP"
                            disabled={loading}
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
                              placeholder="Enter your password"
                              disabled={loading}
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                              disabled={loading}
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
                              disabled={loading}
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
                      disabled={loading}
                    >
                      Lupa password?
                    </Button>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4 mt-4">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Log in...
                      </>
                    ) : (
                      'Sign in'
                    )}
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