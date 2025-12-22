
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
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
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useFirebase } from "@/components/FirebaseProvider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkSent, setLinkSent] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { auth } = useFirebase();

  useEffect(() => {
    if (!auth) return;

    // This effect handles the user returning from the email link
    const completeSignIn = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        setIsSubmitting(true);
        let savedEmail = window.localStorage.getItem('emailForSignIn');
        if (!savedEmail) {
          // If the email is not found, we can't proceed.
          // In a real app, you might prompt the user for their email again.
          setError("Your sign-in link is invalid or has expired. Please try again.");
          toast({ title: "Sign-in Failed", description: "Could not find your email for sign-in. The link may have expired.", variant: "destructive" });
          setIsSubmitting(false);
          router.push('/login');
          return;
        }

        try {
          await signInWithEmailLink(auth, savedEmail, window.location.href);
          window.localStorage.removeItem('emailForSignIn');
          toast({ title: "Logged In!", description: "You have successfully logged in." });
          router.push("/dashboard");
        } catch (err: any) {
          console.error(err);
          setError(err.message);
          toast({ title: "Error", description: "The sign-in link is invalid or has expired.", variant: "destructive" });
          setIsSubmitting(false);
        }
      }
    };
    completeSignIn();
  }, [auth, router, toast]);

  const handleSendSignInLink = async () => {
    setError(null);
    setIsSubmitting(true);

    if (!auth) {
      setError("Authentication service is not available. Please try again later.");
      setIsSubmitting(false);
      return;
    }

    const actionCodeSettings = {
      url: window.location.origin + '/dashboard', // Direct redirect to dashboard on success
      handleCodeInApp: true, // This must be true
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      setLinkSent(true);
      toast({
        title: "Check your email!",
        description: `A sign-in link has been sent to ${email}.`,
      });
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
          <CardTitle className="text-2xl font-headline">Login</CardTitle>
          <CardDescription>
            Enter your email below to receive a login link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {linkSent ? (
            <div className="text-center">
              <h3 className="text-lg font-semibold">Email Sent</h3>
              <p className="text-muted-foreground mt-2">
                A magic link has been sent to your email address. Click the link to log in.
              </p>
              <Button variant="link" onClick={() => { setLinkSent(false); setEmail(''); }}>
                Use a different email
              </Button>
            </div>
          ) : (
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
              <Button onClick={handleSendSignInLink} disabled={isSubmitting || !email} className="w-full">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isSubmitting ? 'Sending...' : 'Send Login Link'}
              </Button>

              {error && <p className="text-sm text-destructive text-center">{error}</p>}
            </div>
          )}

          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
