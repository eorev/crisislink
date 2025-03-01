
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LifeBuoy, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import Layout from '@/components/layout/Layout';

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Basic validation
    if (!email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    // Simulating registration process
    // In a real app, this would be connected to Supabase
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Account created!",
        description: "You have successfully created your account.",
        duration: 5000,
      });
      
      // In a real app, we would redirect to dashboard after successful registration
      // For demo, we'll just clear the form
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('An error occurred during registration. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <Link to="/" className="flex items-center gap-2">
              <LifeBuoy className="h-7 w-7 text-crisisBlue-600" aria-hidden="true" />
              <span className="text-xl font-semibold bg-gradient-to-r from-crisisBlue-600 to-crisisBlue-800 bg-clip-text text-transparent">
                CrisisLink
              </span>
            </Link>
          </div>
          
          <Card className="animate-fade-in bg-white/80 backdrop-blur-sm shadow-lg border-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
              <CardDescription className="text-center">
                Sign up to access the CrisisLink disaster management system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-800 px-4 py-3 rounded-md text-sm" role="alert">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-white"
                    disabled={isLoading}
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-crisisBlue-600 hover:bg-crisisBlue-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-crisisBlue-600 hover:text-crisisBlue-800">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="underline hover:text-gray-700">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="underline hover:text-gray-700">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
