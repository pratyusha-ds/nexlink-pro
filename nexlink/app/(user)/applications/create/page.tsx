"use client";

import UserPage from "@/components/page/UserPage";
import ApplicationForm from "@/components/sections/private/application/ApplicationForm";

const Page = () => {
  return (
    <UserPage title="Create application">
      <ApplicationForm />
    </UserPage>
  );
};

export default Page;
