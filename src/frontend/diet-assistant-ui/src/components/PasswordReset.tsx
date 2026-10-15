import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Mail, 
  ArrowLeft,
  CheckCircle,
  Clock,
  Shield,
  Key,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

interface PasswordResetProps {
  onBack: () => void;
  onComplete: () => void;
}

type ResetStep = 'email' | 'code' | 'newPassword' | 'success';

export function PasswordReset({ onBack, onComplete }: PasswordResetProps) {
  const [step, setStep] = useState<ResetStep>('email');
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('code');
      startResendTimer();
    }, 1500);
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate code verification
    setTimeout(() => {
      setIsLoading(false);
      setStep('newPassword');
    }, 1000);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate password reset
    setTimeout(() => {
      setIsLoading(false);
      setStep('success');
    }, 1500);
  };

  const startResendTimer = () => {
    setResendTimer(60);
    const timer = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendCode = () => {
    if (resendTimer === 0) {
      startResendTimer();
      // Simulate resend
    }
  };

  const isPasswordValid = newPassword.length >= 8 && newPassword === confirmPassword;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="h-16 w-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4"
          >
            {step === 'success' ? (
              <CheckCircle className="h-8 w-8 text-white" />
            ) : (
              <Key className="h-8 w-8 text-white" />
            )}
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-900"
          >
            {step === 'email' && 'Reset Password'}
            {step === 'code' && 'Check Your Email'}
            {step === 'newPassword' && 'Create New Password'}
            {step === 'success' && 'Password Reset Successfully'}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mt-2"
          >
            {step === 'email' && 'Enter your email to receive reset instructions'}
            {step === 'code' && 'Enter the verification code we sent to your email'}
            {step === 'newPassword' && 'Choose a strong new password for your account'}
            {step === 'success' && 'You can now sign in with your new password'}
          </motion.p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              {step === 'email' && <Mail className="h-5 w-5" />}
              {step === 'code' && <Clock className="h-5 w-5" />}
              {step === 'newPassword' && <Lock className="h-5 w-5" />}
              {step === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
              <span>
                {step === 'email' && 'Email Verification'}
                {step === 'code' && 'Code Verification'}
                {step === 'newPassword' && 'New Password'}
                {step === 'success' && 'All Set!'}
              </span>
            </CardTitle>
            
            {step === 'code' && (
              <CardDescription className="text-center">
                We've sent a 6-digit code to <strong>{email}</strong>
              </CardDescription>
            )}
          </CardHeader>

          <CardContent>
            {/* Email Step */}
            {step === 'email' && (
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleEmailSubmit}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    'Send Reset Code'
                  )}
                </Button>
              </motion.form>
            )}

            {/* Code Verification Step */}
            {step === 'code' && (
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleCodeSubmit}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="reset-code">Verification Code</Label>
                  <Input
                    id="reset-code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="text-center tracking-widest text-lg"
                    maxLength={6}
                    required
                  />
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Didn't receive the code?
                  </p>
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleResendCode}
                    disabled={resendTimer > 0}
                    className="text-green-600 hover:text-green-700 p-0"
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                  </Button>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || resetCode.length !== 6}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    'Verify Code'
                  )}
                </Button>
              </motion.form>
            )}

            {/* New Password Step */}
            {step === 'newPassword' && (
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handlePasswordSubmit}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Must be at least 8 characters with letters and numbers
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {newPassword && confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-red-500">Passwords do not match</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !isPasswordValid}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    'Update Password'
                  )}
                </Button>
              </motion.form>
            )}

            {/* Success Step */}
            {step === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Password Updated Successfully
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Your password has been reset. You can now sign in with your new password.
                  </p>
                </div>

                <Button
                  onClick={onComplete}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                >
                  Continue to Sign In
                </Button>
              </motion.div>
            )}

            {/* Security Badge */}
            {step !== 'success' && (
              <div className="text-center mt-6">
                <Badge variant="secondary" className="inline-flex items-center">
                  <Shield className="h-3 w-3 mr-1" />
                  Secure password reset
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Back Button */}
        {step !== 'success' && (
          <div className="text-center mt-6">
            <Button
              variant="link"
              onClick={onBack}
              className="text-gray-500 hover:text-gray-700 flex items-center mx-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Sign In
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
