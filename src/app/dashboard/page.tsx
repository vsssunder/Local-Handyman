
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { onAuthStateChanged, User, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { getUserProfile, addUserProfile } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useFirebase } from "@/components/FirebaseProvider";
import { useToast } from "@/hooks/use-toast";

type UserProfile = {
  name: string;
  activeJobs: any[];
  completedJobs: any[];
  role: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { auth, db } = useFirebase();
  const { toast } = useToast();

   useEffect(() => {
    if (!auth || !db) return;

    // Handle new user sign-up completion
    const completeSignUp = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        const role = window.localStorage.getItem('roleForSignIn');
        
        if (!email || !role) {
          toast({ title: "Registration failed", description: "Sign-up information not found. Please try signing up again.", variant: "destructive"});
          router.push('/signup');
          return;
        }

        try {
          const result = await signInWithEmailLink(auth, email, window.location.href);
          const user = result.user;
          
          // Check if profile already exists
          const existingProfile = await getUserProfile(user.uid, db);
          if (!existingProfile) {
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
              toast({ title: "Welcome!", description: "Your account has been created successfully." });
          }

          window.localStorage.removeItem('emailForSignIn');
          window.localStorage.removeItem('roleForSignIn');
          setUser(user); // Manually set user for initial load
          // Clean up URL
          router.replace('/dashboard');
        } catch (error) {
          console.error("Sign up completion error:", error);
          toast({ title: "Error", description: "Failed to complete your registration. The link may have expired.", variant: "destructive"});
          router.push('/signup');
        }
      }
    };
    
    completeSignUp();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const profile = await getUserProfile(currentUser.uid, db);
          if (profile) {
              setUserProfile(profile as UserProfile);
          }
        } catch (error) {
           console.error("Failed to fetch user profile", error);
           // Don't push to login, might be a temporary issue
        } finally {
            setLoading(false);
        }
      } else {
        // Only redirect if not completing sign up
        if (!isSignInWithEmailLink(auth, window.location.href)) {
            router.push("/login");
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router, auth, db, toast]);


  if (loading || (!userProfile && user)) { // Keep loading if user exists but profile hasn't been fetched yet
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex items-center space-x-4 mb-8">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
            <Skeleton className="h-10 w-[400px] mb-4" />
            <Skeleton className="h-[400px] w-full" />
        </div>
    );
  }

  if (!user || !userProfile) {
    return (
        <div className="container mx-auto py-8 px-4 text-center">
            <p>Redirecting to login...</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2 font-headline">Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Welcome back, {userProfile.name}. Here's an overview of your jobs.
      </p>

      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="active">Active Jobs</TabsTrigger>
          <TabsTrigger value="completed">Completed Jobs</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Jobs</CardTitle>
              <CardDescription>
                Jobs that are currently in progress.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {userProfile.activeJobs && userProfile.activeJobs.length > 0 ? (
                userProfile.activeJobs.map((job: any) => (
                  <div key={job.id} className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <Link href={`/jobs/${job.id}`} className="font-semibold text-lg hover:underline">{job.title}</Link>
                      <p className="text-sm text-muted-foreground">{job.location}</p>
                    </div>
                    <Badge variant="outline">In Progress</Badge>
                    <Button asChild>
                      <Link href={`/jobs/${job.id}`}>View Details</Link>
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">No active jobs.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Jobs</CardTitle>
              <CardDescription>
                A history of your completed work.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {userProfile.completedJobs && userProfile.completedJobs.length > 0 ? (
                userProfile.completedJobs.map((job: any) => (
                  <div key={job.id} className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <Link href={`/jobs/${job.id}`} className="font-semibold text-lg hover:underline">{job.title}</Link>
                      <p className="text-sm text-muted-foreground">{job.customer}</p>
                    </div>
                    <div className="flex items-center gap-4">
                       <Badge className="bg-green-600 hover:bg-green-700">Completed</Badge>
                       {userProfile.role === 'worker' && <span className="font-medium text-green-600">+${job.earnings}</span>}
                    </div>
                    <Button asChild variant="secondary">
                       <Link href={`/jobs/${job.id}`}>View Details</Link>
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">No completed jobs yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
