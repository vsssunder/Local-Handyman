
import { Skeleton } from "@/components/ui/skeleton";
import React, { Suspense } from "react";

function DashboardLoading() {
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<DashboardLoading />}>{children}</Suspense>;
}
