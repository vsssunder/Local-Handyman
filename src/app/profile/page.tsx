import { userProfiles } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { SkillSuggester } from "@/components/SkillSuggester";
import { Edit, MapPin, PlusCircle } from "lucide-react";

// For this demo, we'll show the worker's profile.
const user = userProfiles.worker;

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="relative w-32 h-32 mx-auto">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person"/>
                  <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="icon" className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-background">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <h2 className="text-2xl font-bold mt-4 font-headline">{user.name}</h2>
              <p className="text-muted-foreground">{user.specialty}</p>
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
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={user.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue={user.email} />
                  </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="specialty">Specialty / Title</Label>
                    <Input id="specialty" defaultValue={user.specialty} placeholder="e.g., Master Plumber"/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">About Me</Label>
                  <Textarea id="bio" defaultValue={user.bio} rows={4} placeholder="Tell customers a little about yourself and your experience."/>
                </div>
                <div className="text-right">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>

              <Separator />

              <div>
                <h3 className="text-lg font-medium font-headline">My Skills</h3>
                <div className="flex flex-wrap gap-2 mt-4">
                  {user.skills.map((skill) => (
                    <Badge key={skill} variant="default" className="text-sm py-1">
                      {skill}
                    </Badge>
                  ))}
                  <Button variant="outline" size="sm" className="gap-1">
                    <PlusCircle className="h-4 w-4"/>
                    Add Skill
                  </Button>
                </div>
                <SkillSuggester currentBio={user.bio} />
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium font-headline">Working Locations</h3>
                 <div className="flex flex-wrap gap-2 mt-4">
                  {user.workingLocations.map((location) => (
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
