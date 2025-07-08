import  { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Mail, Loader2, CheckCircle } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@workspace/ui/components/form';

import { authService } from '@/services/authService';
import logo from '@/assets/logo.png';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: location.state?.email || '',
    }
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setLoading(true);
      setError('');
      
      await authService.requestPasswordReset(data.email);
      setSuccess(true);
    } catch (err: any) {
      console.error('Password reset request error:', err);
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login', { 
      state: { email: form.getValues('email') } 
    });
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/5 px-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <img src={logo} alt="OKOCE HRIS" className="h-12 w-auto" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Check your email</h1>
              <p className="text-muted-foreground">
                Password reset instructions sent
              </p>
            </div>
          </div>

          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <CardTitle className="text-xl">Email sent successfully</CardTitle>
              <CardDescription>
                We've sent password reset instructions to{' '}
                <span className="font-medium text-foreground">
                  {form.getValues('email')}
                </span>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4 text-sm">
                <p className="mb-2 font-medium">What's next?</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>1. Check your email inbox</li>
                  <li>2. Click the reset link in the email</li>
                  <li>3. Create a new password</li>
                </ul>
              </div>

              <div className="flex flex-col gap-2">
                <Button 
                  onClick={handleBackToLogin}
                  variant="outline"
                  className="w-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to login
                </Button>
                
                <Button 
                  onClick={() => {
                    setSuccess(false);
                    form.reset();
                  }}
                  variant="link"
                  className="w-full"
                >
                  Send to different email
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Didn't receive the email? Check your spam folder or{' '}
              <Button
                variant="link"
                size="sm"
                className="px-0 h-auto font-normal text-xs"
                onClick={() => {
                  setSuccess(false);
                  form.reset();
                }}
              >
                try again
              </Button>
            </p>
          </div>
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
            <h1 className="text-2xl font-bold tracking-tight">Forgot password?</h1>
            <p className="text-muted-foreground">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Reset password
            </CardTitle>
            <CardDescription>
              We'll send reset instructions to your email address
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-2">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending reset email...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Send reset email
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBackToLogin}
                    disabled={loading}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to login
                  </Button>
                </div>
              </CardContent>
            </form>
          </Form>
        </Card>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Remember your password?{' '}
            <Button
              variant="link"
              size="sm"
              className="px-0 h-auto font-normal text-xs"
              onClick={handleBackToLogin}
            >
              Sign in instead
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}