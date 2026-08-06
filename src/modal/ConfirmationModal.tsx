import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Loader2, AlertTriangle } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: string;
  description: string;

  confirmText?: string;
  cancelText?: string;

  variant?: "default" | "destructive";

  loading?: boolean;

  onConfirm: () => void;
};

const ConfirmationModal = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  loading = false,
  onConfirm,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center mb-3
              ${variant === "destructive"
                ? "bg-red-100 text-red-600"
                : "bg-primary/10 text-primary"
              }`}
          >
            <AlertTriangle className="h-6 w-6" />
          </div>

          <DialogTitle>{title}</DialogTitle>

          <DialogDescription className="pt-1">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {cancelText}
          </Button>

          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            className={
              variant === "destructive"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700 text-white"
            }
            id="confirmation-approve"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;