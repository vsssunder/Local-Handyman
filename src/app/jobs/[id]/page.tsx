import { jobs, workers } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, DollarSign, User, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const job = jobs.find((j) => j.id === params.id);

  if (!job) {
    notFound();
  }
  
  const applicants = workers.slice(0,3);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <Badge variant="secondary" className="w-fit mb-2">{job.category}</Badge>
              <CardTitle className="text-3xl font-headline">{job.title}</CardTitle>
              <div className="flex items-center gap-4 text-muted-foreground pt-2">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Posted {formatDistanceToNow(new Date(job.postedDate), { addSuffix: true })}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Separator className="my-4" />
              <h3 className="font-semibold text-lg mb-2 font-headline">Job Description</h3>
              <p className="text-foreground/80">{job.description}</p>
              
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-2 font-headline">Budget</h3>
                <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                  <DollarSign className="h-6 w-6" />
                  <span>{job.budget}</span>
                </div>
              </div>

              <div className="mt-8 text-center">
                 <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">Apply for this Job</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Posted By</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                 <AvatarImage src="https://placehold.co/64x64.png" alt={job.customer} data-ai-hint="person" />
                 <AvatarFallback>{job.customer.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">{job.customer}</p>
                <p className="text-sm text-muted-foreground">Customer</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Interested Workers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {applicants.length > 0 ? applicants.map((applicant, index) => (
                <div key={applicant.id}>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={applicant.avatarUrl} alt={applicant.name} data-ai-hint="person" />
                      <AvatarFallback>{applicant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Link href={`/workers/${applicant.id}`} className="font-semibold hover:underline">{applicant.name}</Link>
                      <p className="text-sm text-muted-foreground">{applicant.specialty}</p>
                    </div>
                     <div className="flex items-center gap-1 text-sm text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{applicant.rating}</span>
                      </div>
                  </div>
                  {index < applicants.length - 1 && <Separator className="mt-4" />}
                </div>
              )) : (
                <p className="text-sm text-muted-foreground text-center py-4">Be the first to apply!</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
