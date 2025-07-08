import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Lock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@workspace/ui/components/form';
import { Progress } from '@workspace/ui/components/progress';

import { authService } from '@/services/authService';
import logo from '@/assets/logo.png';

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<any>(null);
  const [checkingStrength, setCheckingStrength] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    }
  });

  const password = form.watch('password');

  // Check token validity on component mount
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setError('Invalid or missing reset token');
      return;
    }
    
    // Token exists, consider it valid for now
    // Backend will validate when we submit
    setTokenValid(true);
  }, [token]);

  // Check password strength as user types
  useEffect(() => {
    if (password && password.length >= 3) {
      setCheckingStrength(true);
      const timer = setTimeout(async () => {
        try {
          const result = await authService.checkPasswordStrength(password);
          setPasswordStrength(result);
        } catch (err) {
          console.error('Password strength check error:', err);
        } finally {
          setCheckingStrength(false);
        }
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setPasswordStrength(null);
    }
  }, [password]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await authService.confirmPasswordReset({
        token,
        new_password: data.password,
      });
      
      setSuccess(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  if (tokenValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/5 px-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <img src={logo} alt="OKOCE HRIS" className="h-12 w-auto" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Invalid Link</h1>
              <p className="text-muted-foreground">
                Password reset link is invalid or expired
              </p>
            </div>
          </div>

          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-12 w-12 text-red-600" />
              </div>
              <CardTitle className="text-xl">Link expired</CardTitle>
              <CardDescription>
                The password reset link is invalid or has expired
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4 text-sm">
                <p className="mb-2 font-medium">What can you do?</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Request a new password reset link</li>
                  <li>• Make sure you're using the latest email</li>
                  <li>• Check that the link hasn't expired</li>
                </ul>
              </div>

              <div className="flex flex-col gap-2">
                <Button 
                  onClick={() => navigate('/forgot-password')}
                  className="w-full"
                >
                  Request new reset link
                </Button>
                
                <Button 
                  onClick={handleGoToLogin}
                  variant="outline"
                  className="w-full"
                >
                  Back to login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/5 px-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <img src={logo} alt="OKOCE HRIS" className="h-12 w-auto" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Password reset</h1>
              <p className="text-muted-foreground">
                Your password has been successfully reset
              </p>
            </div>
          </div>

          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <CardTitle className="text-xl">Password updated!</CardTitle>
              <CardDescription>
                Your password has been successfully changed
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4 text-sm">
                <p className="mb-2 font-medium">What's next?</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Your password is now updated</li>
                  <li>• You can now sign in with your new password</li>
                  <li>• Keep your password secure</li>
                </ul>
              </div>

              <Button 
                onClick={handleGoToLogin}
                className="w-full"
              >
                Continue to sign in
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/5 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img src={logo} alt="OKOCE HRIS" className="h-12 w-auto" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Reset password</h1>
            <p className="text-muted-foreground">
              Enter your new password below
            </p>
          </div>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Create new password
            </CardTitle>
            <CardDescription>
              Your new password must be strong and secure
            </CardDescription>
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your new password"
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

                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Password strength:</span>
                      {checkingStrength && (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      )}
                    </div>
                    {passwordStrength && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={passwordStrength.strength_score * 20} 
                            className="flex-1 h-2"
                          />
                          <span className="text-xs text-muted-foreground">
                            {passwordStrength.strength_score}/5
                          </span>
                        </div>
                        {passwordStrength.errors.length > 0 && (
                          <ul className="text-xs text-red-600 space-y-1">
                            {passwordStrength.errors.map((error: string, index: number) => (
                              <li key={index}>• {error}</li>
                            ))}
                          </ul>
                        )}
                        {passwordStrength.feedback.length > 0 && (
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {passwordStrength.feedback.map((feedback: string, index: number) => (
                              <li key={index}>• {feedback}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm new password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm your new password"
                            disabled={loading}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            disabled={loading}
                          >
                            {showConfirmPassword ? (
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

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || !passwordStrength?.valid}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating password...
                    </>
                  ) : (
                    'Update password'
                  )}
                </Button>
              </CardContent>
            </form>
          </Form>
        </Card>

        <div className="text-center">
          <Button
            variant="link"
            size="sm"
            onClick={handleGoToLogin}
            className="text-xs"
          >
            Back to login
          </Button>
        </div>
      </div>
    </div>
  );
}