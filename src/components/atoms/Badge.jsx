import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "medium",
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center font-medium rounded-full transition-colors";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary-100 text-primary-800",
    success: "bg-success-100 text-success-800",
    warning: "bg-warning-100 text-warning-800",
    error: "bg-error-100 text-error-800",
    active: "bg-gradient-to-r from-success-500 to-success-600 text-white shadow-sm",
    leave: "bg-gradient-to-r from-warning-500 to-warning-600 text-white shadow-sm",
    terminated: "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-sm"
  };
  
  const sizes = {
    small: "px-2 py-0.5 text-xs",
    medium: "px-2.5 py-1 text-sm",
    large: "px-3 py-1.5 text-base"
  };
  
  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;