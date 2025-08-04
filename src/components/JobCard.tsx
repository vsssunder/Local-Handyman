
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Job = {
  id: string;
  title: string;
  customerName: string;
  location: string;
  category: string;
  postedDate: string;
  description: string;
  budget: number;
};

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
            <Badge variant="secondary">{job.category}</Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDistanceToNow(new Date(job.postedDate), { addSuffix: true })}</span>
            </div>
        </div>
        <CardTitle className="pt-2 font-headline">{job.title}</CardTitle>
        <CardDescription>by {job.customerName}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {job.description}
        </p>
        <div className="mt-4 space-y-2 text-sm">
           <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{job.location}</span>
           </div>
           <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="font-semibold">Budget: ${job.budget}</span>
           </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/jobs/${job.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
