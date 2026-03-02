import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, ExternalLink, Plus } from "lucide-react";

interface JobCardProps {
  job: {
    id: string;
    company: string;
    title: string;
    location: string;
    url: string;
    logo?: string;
    date: string;
  };
}

export function JobCard({ job }: JobCardProps) {
  const trackUrl = `/applications/create?${new URLSearchParams({
    company: job.company,
    title: job.title,
    location: job.location,
    url: job.url,
  }).toString()}`;

  return (
    <Card className="flex flex-col justify-between hover:border-primary/50 transition-colors">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
        <div className="w-12 h-12 rounded border bg-white flex items-center justify-center overflow-hidden shrink-0">
          {job.logo ? (
            <img src={job.logo} alt={job.company} className="object-contain" />
          ) : (
            <div className="text-[10px] font-bold text-gray-400">LOGO</div>
          )}
        </div>
        <div className="overflow-hidden">
          <CardTitle className="text-lg truncate">{job.title}</CardTitle>
          <p className="text-sm text-muted-foreground truncate">
            {job.company}
          </p>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className="flex items-center gap-1 font-normal text-xs"
          >
            <MapPin className="w-3 h-3" /> {job.location}
          </Badge>
          <Badge variant="secondary" className="font-normal text-xs">
            {job.date}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex gap-2">
        <Button variant="outline" className="flex-1" asChild size="sm">
          <a href={job.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-2" /> Details
          </a>
        </Button>
        <Button
          className="flex-1 bg-green-600 hover:bg-green-700"
          size="sm"
          asChild
        >
          <a href={trackUrl}>
            <Plus className="w-4 h-4 mr-2" /> Track
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
