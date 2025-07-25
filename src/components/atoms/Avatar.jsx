import React from "react";
import { cn } from "@/utils/cn";

const Avatar = React.forwardRef(({ 
  className, 
  src,
  alt,
  fallback,
  size = "medium",
  ...props 
}, ref) => {
  const sizes = {
    small: "w-8 h-8 text-sm",
    medium: "w-10 h-10 text-base",
    large: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl"
  };
  
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  
  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full border-2 border-white shadow-sm",
        "bg-gradient-to-br from-primary-500 to-secondary-500 text-white font-medium",
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span className="font-display font-semibold">
          {getInitials(fallback || alt)}
        </span>
      )}
    </div>
  );
});

Avatar.displayName = "Avatar";

export default Avatar;