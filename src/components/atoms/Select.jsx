import React from "react";
import { cn } from "@/utils/cn";

const Select = React.forwardRef(({ 
  className, 
  label,
  error,
  children,
  ...props 
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        className={cn(
          "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
          "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
          "transition-colors duration-200 bg-white",
          error && "border-error-500 focus:ring-error-500 focus:border-error-500",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-sm text-error-600">{error}</p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;