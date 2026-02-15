"use client";

import UserPage from "@/components/page/UserPage";
import ApplicationForm from "@/components/sections/private/application/ApplicationForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";

const Page = () => {
  return (
    <UserPage title="Create application">
      <Button onClick={() => redirect("/applications")} variant={"secondary"}>
        <ArrowLeft />
        Go Back
      </Button>
      <div className="w-full mx-auto">
        <h1 className="text-xl md:text-4xl calistoga mb-4">
          Track your <span className="text-primary">next</span>{" "}
          <span className="text-malachite">link</span>
        </h1>
        <div className="w-full">
          <ApplicationForm />
        </div>
      </div>
    </UserPage>
  );
};

export default Page;
