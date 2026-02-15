import { ReactNode } from "react";

interface UserPageProps {
  title?: string;
  description?: string;
  children: ReactNode;
}

function UserPage({ title, description, children }: UserPageProps) {
  return (
    <section>
      <div className="pt-24 py-4 md:pt-6 px-6 space-y-4">
        {title && <h1 className="text-xl md:text-3xl font-bold">{title}</h1>}
        {description && <p className="text-muted">{description}</p>}
        {children}
      </div>
    </section>
  );
}

export default UserPage;
