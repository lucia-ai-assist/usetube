import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let error;
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        error = signUpError;
        if (!error) {
          toast({
            title: "Check your email",
            description: "We've sent you a verification link to complete your registration.",
          });
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        error = signInError;
        if (!error) {
          navigate("/dashboard");
        }
      }

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[rgba(147,39,143,1)] via-[rgba(234,172,232,1)] to-[rgba(246,219,245,1)] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <img src="/logo.svg" alt="Usetube Logo" className="w-24 h-24" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Usetube</h1>
          <p className="text-gray-600">Your personal YouTube playlist manager</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white flex items-center justify-center gap-2 py-6"
            disabled={isLoading}
          >
            <Mail className="h-5 w-5" />
            {isLoading ? "Please wait..." : (isSignUp ? "Sign up with Email" : "Sign in with Email")}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-[#8B5CF6] hover:underline"
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </div>

          <p className="text-xs text-center text-gray-500">
            By {isSignUp ? "signing up" : "signing in"}, you agree to our Terms of Service and Privacy Policy
          </p>
        </form>
      </div>
    </div>
  );
};

export default Auth;