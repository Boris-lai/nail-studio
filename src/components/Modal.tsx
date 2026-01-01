import React from "react";
import { CheckCircle2 } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/20 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-8 text-center transform transition-all scale-100">
        <div className="flex justify-center mb-4">
          <div className="bg-morandi-light p-3 rounded-full">
            <CheckCircle2 className="w-8 h-8 text-morandi-primary" />
          </div>
        </div>
        <h3 className="text-2xl font-serif text-morandi-text mb-2 tracking-wide">
          {title}
        </h3>
        <p className="text-stone-500 mb-8 font-sans font-light">{message}</p>
        <button
          onClick={onClose}
          className="w-full py-3 bg-morandi-primary text-black rounded-full hover:bg-morandi-accent transition-colors duration-300 font-medium tracking-wide shadow-md hover:shadow-lg"
        >
          關閉
        </button>
      </div>
    </div>
  );
};
