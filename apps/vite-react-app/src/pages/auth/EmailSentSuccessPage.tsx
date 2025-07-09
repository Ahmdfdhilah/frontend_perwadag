import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Mail } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';

import logo from '@/assets/logoLightMode.png';
import loginIcon from '@/assets/loginIcon.png';

export function EmailSentSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || '';

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleResendEmail = () => {
    navigate('/forgot-password', {
      state: { email }
    });
  };

  return (
    <div className="max-h-screen relative overflow-hidden">
      {/* Desktop Layout */}
      <div className="hidden md:flex max-h-screen">
        {/* Left Side - Banner Image */}
        <div className="flex-[2] relative bg-gray-100">
          <img 
            src={loginIcon} 
            alt="Login Banner" 
            className="w-[80%] object-cover"
          />
        </div>

        {/* Right Side - Success Message */}
        <div className="flex-1 flex items-center justify-center bg-background p-8">
          <div className="w-full max-w-md space-y-6">
            
            {/* Logo and Header */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <img src={logo} alt="OKOCE HRIS" className="h-12 w-auto" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Email Terkirim!</h1>
                <p className="text-muted-foreground">
                  Link reset password telah dikirim ke email Anda
                </p>
              </div>
            </div>

            {/* Success Card */}
            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-center mb-4">
                  <div className="rounded-full bg-green-100 p-3">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <CardTitle className="text-xl text-center">Email Berhasil Dikirim</CardTitle>
                <CardDescription className="text-center">
                  Kami telah mengirimkan link reset password ke email Anda
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Success Alert */}
                <Alert>
                  <Mail className="h-4 w-4" />
                  <AlertDescription>
                    Link reset password telah dikirim ke{' '}
                    <span className="font-semibold">{email}</span>
                  </AlertDescription>
                </Alert>

                <div className="text-sm text-muted-foreground space-y-2">
                  <p>Silakan cek email Anda dan klik link yang diberikan untuk reset password.</p>
                  <p>Jika Anda tidak menerima email dalam beberapa menit, cek folder spam atau junk mail.</p>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4 mt-4">
                <Button
                  type="button"
                  className="w-full"
                  onClick={handleBackToLogin}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali ke Login
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleResendEmail}
                >
                  Kirim Ulang Email
                </Button>
              </CardFooter>
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
              <img src={logo} alt="OKOCE HRIS" className="h-12 w-auto" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Email Terkirim!</h1>
              <p className="text-white/80">
                Link reset password telah dikirim ke email Anda
              </p>
            </div>
          </div>

          {/* Success Card */}
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-4">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-xl text-center">Email Berhasil Dikirim</CardTitle>
              <CardDescription className="text-center">
                Kami telah mengirimkan link reset password ke email Anda
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Success Alert */}
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  Link reset password telah dikirim ke{' '}
                  <span className="font-semibold">{email}</span>
                </AlertDescription>
              </Alert>

              <div className="text-sm text-muted-foreground space-y-2">
                <p>Silakan cek email Anda dan klik link yang diberikan untuk reset password.</p>
                <p>Jika Anda tidak menerima email dalam beberapa menit, cek folder spam atau junk mail.</p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 mt-4">
              <Button
                type="button"
                className="w-full"
                onClick={handleBackToLogin}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Login
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleResendEmail}
              >
                Kirim Ulang Email
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}