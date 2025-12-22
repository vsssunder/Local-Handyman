
"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { sendSignInLinkToEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useFirebase } from "@/components/FirebaseProvider";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("customer");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const { auth, db } = useFirebase();

  const handleSignUp = async () => {
    setError(null);
    setIsSubmitting(true);

    if (!auth || !db) {
      setError("Authentication service not available. Please try again later.");
      setIsSubmitting(false);
      return;
    }

    const actionCodeSettings = {
      // URL to redirect back to.
      // Here we redirect to the dashboard page after sign up.
      url: `${window.location.origin}/dashboard?role=${role}&email=${encodeURIComponent(email)}`,
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      
      // Save the email and role locally to be used after the user clicks the email link.
      window.localStorage.setItem('emailForSignIn', email);
      window.localStorage.setItem('roleForSignIn', role);

      toast({
        title: "Check your email!",
        description: `A verification link has been sent to ${email}. Click it to complete your registration.`,
      });
      // Redirect to a page that informs the user to check their email
      router.push(`/signup/check-email?email=${encodeURIComponent(email)}`);

    } catch (err: any) {
      console.error(err);
      setError(err.message);
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] py-12">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-xl font-headline">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-2">
              <Label>I am a...</Label>
              <RadioGroup value={role} onValueChange={setRole} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="customer" id="customer" />
                  <Label htmlFor="customer">Customer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="worker" id="worker" />
                  <Label htmlFor="worker">Worker</Label>
                </div>
              </RadioGroup>
            </div>
            <Button onClick={handleSignUp} disabled={isSubmitting || !email} className="w-full">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign Up with Email
            </Button>
            
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
