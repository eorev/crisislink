
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { LifeBuoy, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import Layout from '@/components/layout/Layout';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Basic validation
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    setIsLoading(true);
    
    // Simulating login process
    // In a real app, this would be connected to Supabase
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Login successful!",
        description: "Welcome back to CrisisLink.",
        duration: 3000,
      });
      
      // In a real app, we would redirect to dashboard after successful login
      // For demo, we'll just clear the form
      setEmail('');
      setPassword('');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
      console.error('Login error:', err);
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
              <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
              <CardDescription className="text-center">
                Access your CrisisLink dashboard
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-xs text-crisisBlue-600 hover:text-crisisBlue-800">
                      Forgot password?
                    </Link>
                  </div>
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
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-crisisBlue-600 hover:bg-crisisBlue-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-crisisBlue-600 hover:text-crisisBlue-800">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
