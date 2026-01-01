import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-[3px]",
    lg: "w-12 h-12 border-4",
    xl: "w-16 h-16 border-[5px]",
  };

  return (
    <div
      className={`
        inline-block animate-spin rounded-full
        border-stone-200
        border-t-morandi-primary
        ${sizeClasses[size]}
        ${className}
      `}
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  fullscreen?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  text,
  fullscreen = false,
}) => {
  if (!isLoading) return null;

  const containerClasses = fullscreen
    ? "fixed inset-0 z-[60]"
    : "absolute inset-0 z-50 rounded-[inherit]";

  return (
    <div
      className={`${containerClasses} flex flex-col items-center justify-center bg-white/50 backdrop-blur-[2px] transition-all duration-300`}
    >
      <Spinner size="lg" />
      {text && (
        <p className="mt-4 text-stone-500 font-medium tracking-widest text-sm">
          {text}
        </p>
      )}
    </div>
  );
};
