import { SearchX } from "lucide-react";

function NoSearchResult({
  title = "No results found",
  description = "Try adjusting your search or filter criteria",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center h-180">
      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
        <SearchX className="h-5 w-5 text-gray-400" />
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-xs text-gray-500 max-w-xs">{description}</p>
    </div>
  );
}

export default NoSearchResult;
