import React, { useState, useRef, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const FilterDropdown = ({ 
  label = "Filter", 
  options = [], 
  value, 
  onChange,
  className 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200"
      >
        <span>{selectedOption ? selectedOption.label : label}</span>
        <ApperIcon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          className="h-4 w-4 transition-transform duration-200" 
        />
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-fade-in">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-2 text-sm hover:bg-primary-50 transition-colors duration-150",
                  value === option.value && "bg-primary-50 text-primary-600 font-medium"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;