"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
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
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// It's good practice to declare this type globally or in a shared types file
declare global {
  interface Window {
    grecaptcha: any;
    recaptchaVerifier: RecaptchaVerifier;
  }
}

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This effect ensures the reCAPTCHA is rendered only once.
    if (recaptchaContainerRef.current && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
        'size': 'normal',
        'callback': () => {
          // reCAPTCHA solved
        },
        'expired-callback': () => {
           setError("reCAPTCHA expired. Please try again.");
           if (window.grecaptcha) {
            window.grecaptcha.reset(window.recaptchaVerifier.widgetId);
           }
        }
      });
      window.recaptchaVerifier.render();
    }
  }, []);


  const handleSendVerificationCode = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      if (!window.recaptchaVerifier) {
        throw new Error("reCAPTCHA not initialized.");
      }
      
      const result = await signInWithPhoneNumber(auth, `+${phoneNumber}`, window.recaptchaVerifier);
      setConfirmationResult(result);
      toast({ title: "Verification code sent!", description: "Check your phone for the SMS message." });
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async () => {
    setError(null);
    if (!confirmationResult) {
      setError("Please request a verification code first.");
      return;
    }
    setIsSubmitting(true);
    try {
      await confirmationResult.confirm(verificationCode);
      toast({ title: "Logged In!", description: "You have successfully logged in." });
      router.push("/dashboard");
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
          <CardTitle className="text-2xl font-headline">Login with Phone</CardTitle>
          <CardDescription>
            Enter your phone number to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
             {!confirmationResult ? (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="phone-number">Phone Number</Label>
                  <Input
                    id="phone-number"
                    type="tel"
                    placeholder="1234567890"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-muted-foreground">Include country code (e.g., 1 for US)</p>
                </div>
                <div ref={recaptchaContainerRef} className="my-4 flex justify-center"></div>
                <Button onClick={handleSendVerificationCode} disabled={isSubmitting || !phoneNumber} className="w-full">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Verification Code
                </Button>
              </>
            ) : (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="verification-code">Verification Code</Label>
                  <Input
                    id="verification-code"
                    type="text"
                    placeholder="123456"
                    required
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <Button onClick={handleVerifyCode} disabled={isSubmitting || !verificationCode} className="w-full">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verify & Login
                </Button>
              </>
            )}

            {error && <p className="text-sm text-destructive text-center">{error}</p>}
          </div>
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
