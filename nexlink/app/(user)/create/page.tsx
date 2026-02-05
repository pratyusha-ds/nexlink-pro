export default function CreateApplicationPage() {
  return (
    <div className="flex-1 w-full min-h-svh py-10 px-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-10 space-y-2 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Add New Application
          </h1>
          <p className="text-lg text-muted-foreground">
            Fill in the details manually or search for a company to auto-fill.
          </p>
        </div>
        <div className="w-full">{/* <ApplicationForm /> */}</div>
      </div>
    </div>
  );
}
