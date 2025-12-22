
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult, UserCredential } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { addUserProfile } from "@/lib/data";
import { useFirebase } from "@/components/FirebaseProvider";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}


export default function SignupPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("customer");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaReady, setCaptchaReady] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { auth, db } = useFirebase();
  
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!auth) return;

    if (!window.recaptchaVerifier && recaptchaContainerRef.current) {
        const verifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
            'size': 'invisible',
            'callback': () => {
                setCaptchaReady(true);
            },
            'expired-callback': () => {
                setError("reCAPTCHA expired. Please try again.");
                setCaptchaReady(false);
                window.recaptchaVerifier?.clear();
            }
        });
        window.recaptchaVerifier = verifier;
        verifier.render().then(() => setCaptchaReady(true)).catch((err) => {
            console.error("reCAPTCHA render error:", err);
            setError("Failed to initialize reCAPTCHA. Please refresh the page.");
        });
    } else if (window.recaptchaVerifier) {
        setCaptchaReady(true);
    }
  }, [auth]);

  const handleSendVerificationCode = async () => {
    setError(null);
    setIsSubmitting(true);

    const verifier = window.recaptchaVerifier;
    if (!auth || !verifier) {
      setError("reCAPTCHA verifier not initialized. Please refresh the page.");
      setIsSubmitting(false);
      return;
    }

    try {
      const formattedPhoneNumber = `+${phoneNumber}`;
      const result = await signInWithPhoneNumber(auth, formattedPhoneNumber, verifier);
      setConfirmationResult(result);
      toast({ title: "Verification code sent!", description: "Check your phone for the SMS message." });
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      toast({ title: "Error", description: err.message, variant: "destructive" });
      verifier.clear();
      setCaptchaReady(false);
      // Re-render the verifier
      verifier.render().then(() => setCaptchaReady(true));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async () => {
    setError(null);
    if (!confirmationResult || !db) {
      setError("Please request a verification code first.");
      return;
    }
    setIsSubmitting(true);
    try {
      const userCredential: UserCredential = await confirmationResult.confirm(verificationCode);
      const user = userCredential.user;

       const baseProfile = {
        id: user.uid,
        name: `User ${user.uid.substring(0, 5)}`,
        email: user.email,
        phone: user.phoneNumber,
        role: role,
        avatarUrl: `https://placehold.co/128x128.png`,
        activeJobs: [],
        completedJobs: [],
      };

      const newUserProfile = role === 'worker'
        ? {
            ...baseProfile,
            specialty: 'New Worker',
            rating: 0,
            skills: [],
            workingLocations: [],
            bio: '',
            reviews: [],
          }
        : baseProfile;
      
      await addUserProfile(newUserProfile, db);

      toast({ title: "Success!", description: "Your account has been created." });
      
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
      <div id="recaptcha-container-signup" ref={recaptchaContainerRef}></div>
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-xl font-headline">Sign Up with Phone</CardTitle>
          <CardDescription>
            Enter your information to create an account
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
                <Button onClick={handleSendVerificationCode} disabled={isSubmitting || !phoneNumber || !captchaReady} className="w-full">
                  {isSubmitting || !captchaReady ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {isSubmitting ? 'Sending...' : !captchaReady ? 'Preparing...' : 'Send Verification Code'}
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
                  Verify & Sign Up
                </Button>
              </>
            )}
            
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
