import { JobPostForm } from "@/components/JobPostForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function PostJobPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-headline">Post a New Job</CardTitle>
            <CardDescription>
              Fill out the details below to find the perfect handyman for your task.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <JobPostForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
