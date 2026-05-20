import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ImageModalProps {
    open: boolean;
    image: string | null;
    onClose: () => void;
}

const ImageModal = ({ open, image, onClose }: ImageModalProps) => {
    return (
        <AnimatePresence>
            {open && image && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative max-w-[90vw] max-h-[90vh] rounded-xl overflow-hidden shadow-2xl bg-black"
                    >
                        <img
                            src={`data:image/jpeg;base64,${image}`}
                            alt="Preview"
                            className="block max-w-[90vw] max-h-[90vh] object-contain"
                        />

                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black transition"
                        >
                            <X size={18} />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ImageModal;