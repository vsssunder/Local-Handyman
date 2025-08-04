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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult, UserCredential } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { addUserProfile } from "@/lib/data";


// It's good practice to declare this type globally or in a shared types file
declare global {
  interface Window {
    grecaptcha: any;
    recaptchaVerifier: RecaptchaVerifier;
  }
}


export default function SignupPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("customer");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  // Effect to ensure the reCAPTCHA container is only created once
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      // The container will be used by the handleSendVerificationCode function
    }
  }, []);

  const handleSendVerificationCode = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      // Use window.recaptchaVerifier to avoid creating multiple instances
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'normal', 
        'callback': (response: any) => {
          // reCAPTCHA solved
        },
        'expired-callback': () => {
           setError("reCAPTCHA expired. Please try again.");
           if (window.grecaptcha) {
            window.grecaptcha.reset();
           }
        }
      });
      
      const result = await signInWithPhoneNumber(auth, `+${phoneNumber}`, window.recaptchaVerifier);
      setConfirmationResult(result);
      toast({ title: "Verification code sent!", description: "Check your phone for the SMS message." });
    } catch (err: any)
     {
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
      const userCredential: UserCredential = await confirmationResult.confirm(verificationCode);
      const user = userCredential.user;

      // Persist user data
       const newUserProfile = {
        id: user.uid,
        name: `User ${user.uid.substring(0, 5)}`, // Placeholder name
        email: user.email, // This will be null with phone auth
        phone: user.phoneNumber,
        role: role,
        avatarUrl: `https://placehold.co/128x128.png`,
        ...(role === 'worker'
          ? {
              specialty: 'New Worker',
              rating: 0,
              skills: [],
              workingLocations: [],
              bio: '',
              reviews: [],
              activeJobs: [],
              completedJobs: [],
            }
          : {
              activeJobs: [],
              completedJobs: [],
            }),
      };
      
      await addUserProfile(newUserProfile);

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
                 <div id="recaptcha-container" className="my-4 flex justify-center"></div>
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
