"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserProfile } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const profile = await getUserProfile(currentUser.uid);
        setUserProfile(profile as UserProfile);
      } else {
        // No user is signed in.
        router.push("/login");
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  if (loading) {
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
            <p>You must be logged in to view this page.</p>
            <Button asChild className="mt-4">
                <Link href="/login">Go to Login</Link>
            </Button>
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
