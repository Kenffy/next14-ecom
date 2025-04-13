import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function CheckoutSkeleton() {
  return (
    <div className=" w-full container mx-auto min-h-screen flex flex-col gap-4 py-16">
      <div className=" my-2 md:my-4 flex items-center justify-between pt-16">
        <Skeleton className="h-8 w-[150px]" />
        <Skeleton className="h-8 w-[150px]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="md:col-span-2 flex flex-col gap-8">
          <Skeleton className="h-8 w-full rounded-md" />
          <Skeleton className="h-[480px] w-full rounded-md" />
        </div>

        <div className="md:col-span-1">
          <Skeleton className="h-96 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
