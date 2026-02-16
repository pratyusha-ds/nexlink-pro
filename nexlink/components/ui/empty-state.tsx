import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
  };
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center min-h-50">
      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-xs text-gray-500 max-w-xs mb-3">{description}</p>
      {action &&
        (action.href ? (
          <Link href={action.href}>
            <Button variant="outline" size="sm">
              {action.label}
            </Button>
          </Link>
        ) : null)}
    </div>
  );
}
