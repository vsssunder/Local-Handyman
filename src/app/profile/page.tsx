"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserProfile, updateUserSkills, updateUserLocations } from "@/lib/data";
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
import { Edit, MapPin, PlusCircle, Loader2, Save, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"


type UserProfile = {
  id: string;
  name: string;
  email: string | null; // email can be null with phone auth
  phone: string | null;
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

  const [newSkill, setNewSkill] = useState("");
  const [newLocation, setNewLocation] = useState("");

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
           toast({ title: "Error", description: "Could not load user profile.", variant: "destructive" });
           router.push('/login');
        }
      } else {
        router.push("/login");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router, toast]);
  
  const handleAddSkill = async (skillToAdd?: string) => {
    const skill = (skillToAdd || newSkill).trim();
    if (skill && userProfile && !userProfile.skills.includes(skill)) {
      const updatedSkills = [...userProfile.skills, skill];
      await updateUserSkills(userProfile.id, updatedSkills);
      setUserProfile({...userProfile, skills: updatedSkills });
      setNewSkill("");
      toast({ title: "Success", description: "Skill added!" });
    }
  };

  const handleRemoveSkill = async (skillToRemove: string) => {
    if (userProfile) {
      const updatedSkills = userProfile.skills.filter(s => s !== skillToRemove);
      await updateUserSkills(userProfile.id, updatedSkills);
      setUserProfile({...userProfile, skills: updatedSkills });
      toast({ title: "Success", description: "Skill removed." });
    }
  };
  
  const handleAddLocation = async () => {
    const location = newLocation.trim();
    if (location && userProfile && !userProfile.workingLocations.includes(location)) {
      const updatedLocations = [...userProfile.workingLocations, location];
      await updateUserLocations(userProfile.id, updatedLocations);
      setUserProfile({...userProfile, workingLocations: updatedLocations });
      setNewLocation("");
      toast({ title: "Success", description: "Location added!" });
    }
  };

  const handleRemoveLocation = async (locationToRemove: string) => {
    if (userProfile) {
      const updatedLocations = userProfile.workingLocations.filter(l => l !== locationToRemove);
      await updateUserLocations(userProfile.id, updatedLocations);
      setUserProfile({...userProfile, workingLocations: updatedLocations });
      toast({ title: "Success", description: "Location removed." });
    }
  };


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
              <p className="text-muted-foreground">{userProfile.specialty || (userProfile.role === 'worker' ? 'No specialty set' : 'Customer')}</p>
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
                    <Label htmlFor="contact">Contact Info</Label>
                    <Input id="contact" type="text" defaultValue={userProfile.phone || userProfile.email || "Not available"} disabled />
                  </div>
                </div>
                 {userProfile.role === 'worker' && <div className="space-y-2">
                    <Label htmlFor="specialty">Specialty / Title</Label>
                    <Input id="specialty" name="specialty" defaultValue={userProfile.specialty} placeholder="e.g., Master Plumber"/>
                </div>}
                <div className="space-y-2">
                  <Label htmlFor="bio">About Me</Label>
                  <Textarea id="bio" name="bio" defaultValue={userProfile.bio} rows={4} placeholder="Tell customers a little about yourself and your experience."/>
                </div>
                <div className="text-right">
                  <SubmitButton />
                </div>
              </form>
              
              {userProfile.role === 'worker' && <>
              <Separator />

              <div>
                <h3 className="text-lg font-medium font-headline">My Skills</h3>
                <div className="flex flex-wrap gap-2 mt-4">
                  {userProfile.skills.map((skill) => (
                    <Badge key={skill} variant="default" className="text-sm py-1 pl-3 pr-1">
                      {skill}
                      <button onClick={() => handleRemoveSkill(skill)} className="ml-2 rounded-full hover:bg-white/20 p-0.5"><X className="h-3 w-3"/></button>
                    </Badge>
                  ))}
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1">
                          <PlusCircle className="h-4 w-4"/>
                          Add Skill
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add a new skill</DialogTitle>
                        <DialogDescription>Enter a new skill to add to your profile.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <Input 
                          value={newSkill} 
                          onChange={(e) => setNewSkill(e.target.value)} 
                          placeholder="e.g., Drywall Repair"
                          onKeyDown={(e) => {
                            if(e.key === 'Enter') {
                              e.preventDefault();
                              handleAddSkill();
                              (e.target as HTMLElement).closest('[role="dialog"]')!.querySelector('button[aria-label="Close"]')?.click();
                            }
                          }}
                        />
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button onClick={() => handleAddSkill()} type="submit">Add Skill</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                </div>
                <SkillSuggester currentBio={userProfile.bio} onSkillSelect={handleAddSkill} />
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium font-headline">Working Locations</h3>
                 <div className="flex flex-wrap gap-2 mt-4">
                  {userProfile.workingLocations.map((location) => (
                    <Badge key={location} variant="secondary" className="text-sm py-1 pl-3 pr-1 gap-1">
                      <MapPin className="h-3 w-3"/>
                      {location}
                      <button onClick={() => handleRemoveLocation(location)} className="ml-2 rounded-full hover:bg-black/10 p-0.5"><X className="h-3 w-3"/></button>
                    </Badge>
                  ))}
                   <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1">
                          <PlusCircle className="h-4 w-4"/>
                          Add Location
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add a new location</DialogTitle>
                        <DialogDescription>Enter a new city or area you work in.</DialogDescription>
                      </DialogHeader>
                       <div className="grid gap-4 py-4">
                        <Input 
                          value={newLocation} 
                          onChange={(e) => setNewLocation(e.target.value)} 
                          placeholder="e.g., San Francisco"
                          onKeyDown={(e) => {
                            if(e.key === 'Enter') {
                              e.preventDefault();
                              handleAddLocation();
                               (e.target as HTMLElement).closest('[role="dialog"]')!.querySelector('button[aria-label="Close"]')?.click();
                            }
                          }}
                        />
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button onClick={handleAddLocation} type="submit">Add Location</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              </>}

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
