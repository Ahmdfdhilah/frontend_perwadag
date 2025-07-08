// apps/vite-react-app/src/pages/auth/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Loader2, Shield } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@workspace/ui/components/form';

import { useAuth } from '@/components/Auth/AuthProvider';
import logo from '@/assets/logo.png';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  mfa_code: z.string().optional()
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showMfaInput, setShowMfaInput] = useState(false);
  const [loginError, setLoginError] = useState<string>('');

  const { login, loading, error, mfaRequired, clearAuthError, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/dashboard';

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && user) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, from]);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      mfa_code: ''
    }
  });

  // Show MFA input if required
  React.useEffect(() => {
    if (mfaRequired) {
      setShowMfaInput(true);
      setLoginError('Please enter your MFA code to continue');
    }
  }, [mfaRequired]);

  // Clear errors when form values change
  React.useEffect(() => {
    if (error || loginError) {
      clearAuthError();
      setLoginError('');
    }
  }, [form.watch(), clearAuthError]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoginError('');

      const loginData = {
        email: data.email,
        password: data.password,
        ...(data.mfa_code && { mfa_code: data.mfa_code })
      };

      await login(loginData);

      // If login successful, redirect
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('Login error:', err);

      if (err.requires_mfa) {
        setShowMfaInput(true);
        setLoginError(err.message || 'MFA code required');
      } else {
        setLoginError(err.message || 'Login failed. Please check your credentials.');
        setShowMfaInput(false);
      }
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password', {
      state: { email: form.getValues('email') }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/5 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img src={logo} alt="OKOCE HRIS" className="h-12 w-auto" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground">
              Sign in to your HRIS account
            </p>
          </div>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Sign in</CardTitle>
            <CardDescription>
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                {/* Error Alert */}
                {(error || loginError) && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {(() => {
                        if (loginError) return loginError;
                        if (typeof error === 'string') return error;
                        if (error && typeof error === 'object') {
                          if (Array.isArray((error as any).detail)) {
                            return (error as any).detail.join(', ');
                          }
                          return (error as any).detail || (error as any).message || 'Login failed';
                        }
                        return 'An error occurred';
                      })()}
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
                          placeholder="Enter your email"
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

                {/* MFA Code Field */}
                {showMfaInput && (
                  <FormField
                    control={form.control}
                    name="mfa_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          MFA Code
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter your 6-digit MFA code"
                            maxLength={8}
                            disabled={loading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-muted-foreground">
                          Enter the code from your authenticator app or use a backup code
                        </p>
                      </FormItem>
                    )}
                  />
                )}

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="px-0 h-auto font-normal"
                    onClick={handleForgotPassword}
                    disabled={loading}
                  >
                    Forgot password?
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
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        {/* Help Text */}
        {/* <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Having trouble signing in?{' '}
            <Link
              to="/help"
              className="font-medium text-primary hover:underline"
            >
              Get help
            </Link>
          </p>
        </div> */}
      </div>
    </div>
  );
}