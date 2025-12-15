
"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/JobCard";
import { getAllJobs, serviceCategories } from "@/lib/data";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useFirebase } from "@/components/FirebaseProvider";

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

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { db } = useFirebase();

  useEffect(() => {
    if (!db) return;
    const fetchJobs = async () => {
      setLoading(true);
      const jobList = await getAllJobs(db);
      setJobs(jobList as Job[]);
      setLoading(false);
    };
    fetchJobs();
  }, [db]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold font-headline">Find Your Next Gig</h1>
        <p className="text-muted-foreground mt-2">
          Browse through hundreds of local job postings and find one that matches
          your skills.
        </p>
      </div>

      <Card className="p-4 mb-8 bg-card/80">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search by keyword (e.g. 'faucet repair')" className="pl-10" />
          </div>
          <Select>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {serviceCategories.map((category) => (
                <SelectItem key={category} value={category.toLowerCase()}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input placeholder="Location (e.g. 'San Francisco')" className="w-full md:w-[200px]" />
          <Button className="w-full md:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
            Search
          </Button>
        </div>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <div className="p-6">
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-6 w-full mb-4" />
                <Skeleton className="h-4 w-1/4 mb-4" />
                <Skeleton className="h-12 w-full mb-4" />
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
