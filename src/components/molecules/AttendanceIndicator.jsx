import React from "react";
import { cn } from "@/utils/cn";

const AttendanceIndicator = ({ status, date, className }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "present":
        return "bg-success-500";
      case "absent":
        return "bg-error-500";
      case "leave":
        return "bg-warning-500";
      case "weekend":
        return "bg-gray-300";
      default:
        return "bg-gray-200";
    }
  };

  return (
    <div className={cn("flex flex-col items-center space-y-1", className)}>
      <div 
        className={cn(
          "w-3 h-3 rounded-full shadow-sm",
          getStatusColor(status)
        )}
      />
      {date && (
        <span className="text-xs text-gray-600">{date}</span>
      )}
    </div>
  );
};

export default AttendanceIndicator;