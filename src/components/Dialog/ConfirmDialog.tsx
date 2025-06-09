import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  message = "Bạn có chắc không ?",
}: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Xác nhận</DialogTitle>
        </DialogHeader>
        <p className="text-center text-gray-600 mt-2 mb-2 text-lg">{message}</p>
        <DialogFooter className="flex justify-center space-x-4">
          <Button variant="destructive" onClick={onConfirm}>
            Có, Xóa
          </Button>
          <Button variant="outline" onClick={onClose}>
            Không, Hủy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
