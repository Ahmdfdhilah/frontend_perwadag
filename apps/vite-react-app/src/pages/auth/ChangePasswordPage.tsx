// apps/vite-react-app/src/pages/auth/ChangePasswordPage.tsx
import  { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Loader2, Shield, Check, X, AlertTriangle } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@workspace/ui/components/form';
import { Progress } from '@workspace/ui/components/progress';

import { useAuth } from '@/components/Auth/AuthProvider';
import logo from '@/assets/logo.png';

// Password strength validation
const passwordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z.string()
    .min(12, 'Password must be at least 12 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?/~`]/, 'Password must contain at least one special character'),
  confirm_password: z.string()
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

interface PasswordStrength {
  score: number;
  feedback: string[];
  isValid: boolean;
}

export function ChangePasswordPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changeError, setChangeError] = useState<string>('');
  const [isChanging, setIsChanging] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    isValid: false
  });

  const { user, changeUserPassword, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isForced = location.state?.forced || false;
  const from = location.state?.from || '/admin';

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: ''
    }
  });

  // Check password strength
  const checkPasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    const feedback: string[] = [];

    if (password.length >= 12) score += 20;
    else feedback.push('Use at least 12 characters');

    if (/[a-z]/.test(password)) score += 20;
    else feedback.push('Include lowercase letters');

    if (/[A-Z]/.test(password)) score += 20;
    else feedback.push('Include uppercase letters');

    if (/\d/.test(password)) score += 20;
    else feedback.push('Include numbers');

    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?/~`]/.test(password)) score += 20;
    else feedback.push('Include special characters');

    // Bonus for longer passwords
    if (password.length >= 16) score += 10;

    return {
      score: Math.min(score, 100),
      feedback,
      isValid: score >= 100
    };
  };

  // Watch new password for strength checking
  const newPassword = form.watch('new_password');
  useEffect(() => {
    if (newPassword) {
      setPasswordStrength(checkPasswordStrength(newPassword));
    } else {
      setPasswordStrength({ score: 0, feedback: [], isValid: false });
    }
  }, [newPassword]);

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async (data: PasswordFormData) => {
    try {
      setIsChanging(true);
      setChangeError('');

      await changeUserPassword({
        current_password: data.current_password,
        new_password: data.new_password
      });

      // Show success message and redirect
      if (isForced) {
        // If forced change, redirect to original destination
        navigate(from, { replace: true });
      } else {
        // If voluntary change, go back to profile/settings
        navigate('/admin/security', { 
          state: { message: 'Password changed successfully' }
        });
      }
    } catch (err: any) {
      console.error('Password change error:', err);
      setChangeError(err.message || 'Failed to change password. Please try again.');
    } finally {
      setIsChanging(false);
    }
  };

  const handleCancel = () => {
    if (isForced) {
      // If forced, user must change password or logout
      logout();
      navigate('/login', { replace: true });
    } else {
      navigate(-1);
    }
  };


  const getStrengthText = (score: number) => {
    if (score < 40) return 'Weak';
    if (score < 70) return 'Fair';
    if (score < 90) return 'Good';
    return 'Strong';
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/5 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img src={logo} alt="OKOCE HRIS" className="h-12 w-auto" />
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight">Change Password</h1>
            </div>
            <p className="text-muted-foreground">
              {isForced 
                ? 'You are required to change your password before continuing'
                : 'Update your password to keep your account secure'
              }
            </p>
          </div>
        </div>

        {/* Password Change Form */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">
              {isForced ? 'Password Change Required' : 'Update Password'}
            </CardTitle>
            <CardDescription>
              Choose a strong password that you haven't used before
            </CardDescription>
          </CardHeader>
          
          {isForced && (
            <div className="px-6">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  For security reasons, you must change your password before accessing your account.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                {/* Error Alert */}
                {changeError && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {changeError}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Current Password Field */}
                <FormField
                  control={form.control}
                  name="current_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showCurrentPassword ? 'text' : 'password'}
                            placeholder="Enter your current password"
                            disabled={isChanging}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            disabled={isChanging}
                          >
                            {showCurrentPassword ? (
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

                {/* New Password Field */}
                <FormField
                  control={form.control}
                  name="new_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showNewPassword ? 'text' : 'password'}
                            placeholder="Enter your new password"
                            disabled={isChanging}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            disabled={isChanging}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                      
                      {/* Password Strength Indicator */}
                      {newPassword && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Password strength:</span>
                            <span className={`font-medium ${
                              passwordStrength.score < 40 ? 'text-red-500' :
                              passwordStrength.score < 70 ? 'text-yellow-500' :
                              passwordStrength.score < 90 ? 'text-blue-500' :
                              'text-green-500'
                            }`}>
                              {getStrengthText(passwordStrength.score)}
                            </span>
                          </div>
                          <Progress 
                            value={passwordStrength.score} 
                            className="h-2"
                          />
                          {passwordStrength.feedback.length > 0 && (
                            <div className="space-y-1">
                              {passwordStrength.feedback.map((feedback, index) => (
                                <div key={index} className="flex items-center gap-2 text-xs">
                                  <X className="h-3 w-3 text-red-500" />
                                  <span className="text-muted-foreground">{feedback}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                {/* Confirm Password Field */}
                <FormField
                  control={form.control}
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm your new password"
                            disabled={isChanging}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            disabled={isChanging}
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
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isChanging || !passwordStrength.isValid}
                >
                  {isChanging ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Changing Password...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </Button>

                {!isForced && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleCancel}
                    disabled={isChanging}
                  >
                    Cancel
                  </Button>
                )}

                {isForced && (
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      onClick={handleCancel}
                      disabled={isChanging}
                      className="text-muted-foreground"
                    >
                      Sign out instead
                    </Button>
                  </div>
                )}
              </CardFooter>
            </form>
          </Form>
        </Card>

        {/* Security Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Password Security Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Use a unique password you haven't used before</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Include a mix of letters, numbers, and symbols</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Avoid personal information like names or birthdays</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Consider using a password manager</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}