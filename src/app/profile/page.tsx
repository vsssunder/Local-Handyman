"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserProfile } from "@/lib/data";
import { useRouter } from "next/navigation";
import { handleUpdateProfile } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { SkillSuggester } from "@/components/SkillSuggester";
import { Edit, MapPin, PlusCircle, Loader2, Save } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type UserProfile = {
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
  specialty?: string;
  bio?: string;
  skills: string[];
  workingLocations: string[];
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        <>
         <Save className="mr-2 h-4 w-4"/>
         Save Changes
        </>
      )}
    </Button>
  );
}


export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const [formState, formAction] = useFormState(
    handleUpdateProfile.bind(null, user?.uid || ""),
    { message: "", error: false }
  );

  useEffect(() => {
    if (formState.message) {
      toast({
        title: formState.error ? "Error" : "Success",
        description: formState.message,
        variant: formState.error ? "destructive" : "default",
      });
    }
  }, [formState, toast]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const profile = (await getUserProfile(currentUser.uid)) as UserProfile | null;
        if (profile) {
          setUserProfile(profile);
        } else {
          // Handle case where profile doesn't exist for a logged-in user
           toast({ title: "Error", description: "Could not load user profile.", variant: "destructive" });
        }
      } else {
        router.push("/login");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router, toast]);
  

  if (loading || !userProfile) {
    return (
       <div className="container mx-auto py-12 px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Card><CardContent className="p-6 text-center space-y-4"><Skeleton className="w-32 h-32 rounded-full mx-auto"/><Skeleton className="h-6 w-3/4 mx-auto"/><Skeleton className="h-5 w-1/2 mx-auto"/></CardContent></Card>
            </div>
            <div className="lg:col-span-3">
              <Card>
                <CardHeader><Skeleton className="h-7 w-1/3" /><Skeleton className="h-4 w-2/3 mt-2" /></CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                      <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                    </div>
                     <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-24 w-full" /></div>
                    <div className="text-right"><Skeleton className="h-10 w-32" /></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
       </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="relative w-32 h-32 mx-auto">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} data-ai-hint="person"/>
                  <AvatarFallback className="text-4xl">{userProfile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="icon" className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-background">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <h2 className="text-2xl font-bold mt-4 font-headline">{userProfile.name}</h2>
              <p className="text-muted-foreground">{userProfile.specialty || 'No specialty set'}</p>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Profile Information</CardTitle>
              <CardDescription>Manage your personal and professional details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <form action={formAction} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" defaultValue={userProfile.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue={userProfile.email} disabled />
                  </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="specialty">Specialty / Title</Label>
                    <Input id="specialty" name="specialty" defaultValue={userProfile.specialty} placeholder="e.g., Master Plumber"/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">About Me</Label>
                  <Textarea id="bio" name="bio" defaultValue={userProfile.bio} rows={4} placeholder="Tell customers a little about yourself and your experience."/>
                </div>
                <div className="text-right">
                  <SubmitButton />
                </div>
              </form>

              <Separator />

              <div>
                <h3 className="text-lg font-medium font-headline">My Skills</h3>
                <div className="flex flex-wrap gap-2 mt-4">
                  {userProfile.skills.map((skill) => (
                    <Badge key={skill} variant="default" className="text-sm py-1">
                      {skill}
                    </Badge>
                  ))}
                  <Button variant="outline" size="sm" className="gap-1">
                    <PlusCircle className="h-4 w-4"/>
                    Add Skill
                  </Button>
                </div>
                <SkillSuggester currentBio={userProfile.bio} />
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium font-headline">Working Locations</h3>
                 <div className="flex flex-wrap gap-2 mt-4">
                  {userProfile.workingLocations.map((location) => (
                    <Badge key={location} variant="secondary" className="text-sm py-1 gap-1">
                      <MapPin className="h-3 w-3"/>
                      {location}
                    </Badge>
                  ))}
                  <Button variant="outline" size="sm" className="gap-1">
                    <PlusCircle className="h-4 w-4"/>
                    Add Location
                  </Button>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
