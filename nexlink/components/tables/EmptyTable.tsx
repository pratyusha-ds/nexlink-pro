import { FolderOpen } from "lucide-react";

function EmptyTable() {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center h-180">
      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
        <FolderOpen className="h-5 w-5 text-gray-400" />
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">
        No applications found
      </h3>
      <p className="text-xs text-gray-500 max-w-xs">
        Get started by creating a new application
      </p>
    </div>
  );
}

export default EmptyTable;
