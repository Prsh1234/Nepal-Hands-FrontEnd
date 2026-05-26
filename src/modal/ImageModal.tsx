import {
    Dialog,
    DialogContent,
  } from "@/components/ui/dialog";
  
  interface ImageModalProps {
    open: boolean;
    image: string | null;
    onClose: () => void;
  }
  
  const ImageModal = ({
    open,
    image,
    onClose,
  }: ImageModalProps) => {
    return (
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden border-0 bg-black/95">
          {image && (
            <img
              src={image}
              alt="Preview"
              className="w-full max-h-[90vh] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    );
  };
  
  export default ImageModal;