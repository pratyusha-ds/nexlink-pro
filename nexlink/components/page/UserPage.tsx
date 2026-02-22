import { ReactNode } from "react";

interface UserPageProps {
  title?: string;
  description?: string;
  children: ReactNode;
}

function UserPage({ title, description, children }: UserPageProps) {
  return (
    <section className="h-fit min-h-dvh pt-24 py-4 md:pt-6 px-6 flex flex-col">
      <div className="space-y-4 flex-1 flex flex-col">
        <div className="space-y-2">
          {title && <h1 className="text-xl md:text-3xl font-bold">{title}</h1>}
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex-1 flex flex-col">{children}</div>
      </div>
    </section>
  );
}

export default UserPage;
