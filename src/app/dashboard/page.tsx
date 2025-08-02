import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { userProfiles } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// For this demo, we'll show a generic dashboard. In a real app, you'd fetch the logged-in user's data.
const user = userProfiles.worker; 

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2 font-headline">Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Welcome back, {user.name}. Here's an overview of your jobs.
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
              {user.activeJobs.length > 0 ? (
                user.activeJobs.map((job) => (
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
              {user.completedJobs.length > 0 ? (
                user.completedJobs.map((job) => (
                  <div key={job.id} className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <Link href={`/jobs/${job.id}`} className="font-semibold text-lg hover:underline">{job.title}</Link>
                      <p className="text-sm text-muted-foreground">{job.customer}</p>
                    </div>
                    <div className="flex items-center gap-4">
                       <Badge className="bg-green-600 hover:bg-green-700">Completed</Badge>
                       {user.role === 'worker' && <span className="font-medium text-green-600">+${job.earnings}</span>}
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
