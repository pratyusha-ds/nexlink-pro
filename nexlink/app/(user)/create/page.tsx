import ApplicationForm from "@/components/sections/private/application/ApplicationForm";

// TODO: improve ui/ux; have the same padding per page
export default function CreateApplicationPage() {
  return (
    <div className="flex-1 w-full min-h-svh py-10 pt-24 md:pt-10 px-6 flex flex-col items-center justify-center">
      <div className="w-full mx-auto">
        <div className="space-y-2 mb-4">
          <h1 className="text-xl md:text-3xl font-bold">Add New Application</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Fill in the details manually or search for a company to auto-fill.
          </p>
        </div>
        <div className="w-full">
          <ApplicationForm />
        </div>
      </div>
    </div>
  );
}
