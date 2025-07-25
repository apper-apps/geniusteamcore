import React from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  className, 
  hover = false,
  children, 
  ...props 
}, ref) => {
  return (
    <div
      className={cn(
        "bg-surface rounded-lg shadow-sm border border-gray-100",
        "backdrop-blur-sm bg-white/95",
        hover && "hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;