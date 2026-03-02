"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FiAlertTriangle } from "react-icons/fi";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  count?: number;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Delete Application",
  description = "Are you sure you want to delete this application? This action cannot be undone.",
  count = 1,
}: DeleteConfirmDialogProps) {
  const itemText = count === 1 ? "application" : "applications";
  const updatedTitle = count === 1 ? title : `Delete ${count} Applications`;
  const updatedDescription = count === 1 
    ? description 
    : `Are you sure you want to delete these ${count} ${itemText}? This action cannot be undone.`;

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
              <FiAlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <DialogTitle>{updatedTitle}</DialogTitle>
          </div>
          <DialogDescription>
            {updatedDescription}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
