import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className, rows = 3 }) => {
  return (
    <div className={cn("animate-pulse space-y-4", className)}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full animate-shimmer"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 animate-shimmer"></div>
            </div>
            <div className="h-8 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loading;