import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const location = useLocation();
  const navigate = useNavigate();

  // Determine back navigation logic based on current path
  const getBackNavigation = () => {
    const path = location.pathname;
    
    if (path === "/" || path === "/dashboard") {
      return null; // No back button on dashboard
    }
    
    if (path.startsWith("/employees/")) {
      if (path.includes("/add") || path.includes("/edit")) {
        return { path: "/employees", label: "Back to Employees" };
      }
      return { path: "/employees", label: "Back to Employees" };
    }
    
    if (path === "/employees") {
      return { path: "/", label: "Back to Dashboard" };
    }
    
    if (path === "/attendance") {
      return { path: "/", label: "Back to Dashboard" };
    }
    
    if (path === "/departments") {
      return { path: "/", label: "Back to Dashboard" };
    }
    
    if (path === "/reports") {
      return { path: "/", label: "Back to Dashboard" };
    }
    
    return { path: "/", label: "Back to Dashboard" };
  };

  const backNavigation = getBackNavigation();
  const navigation = [
    { name: "Dashboard", href: "/", icon: "Home" },
    { name: "Employees", href: "/employees", icon: "Users" },
    { name: "Attendance", href: "/attendance", icon: "Clock" },
    { name: "Departments", href: "/departments", icon: "Building2" },
    { name: "Reports", href: "/reports", icon: "FileText" }
  ];

  const isActive = (href) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="flex justify-between items-center h-16">
          {/* Back Button & Logo */}
          <div className="flex items-center space-x-4">
            {backNavigation && (
              <Button
                variant="ghost"
                onClick={() => navigate(backNavigation.path)}
                className="flex items-center space-x-2"
              >
                <ApperIcon name="ArrowLeft" className="h-4 w-4" />
                <span className="hidden sm:inline">{backNavigation.label}</span>
              </Button>
            )}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Users" className="h-6 w-6 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-gray-900">
                TeamCore
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive(item.href)
                    ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg"
                    : "text-gray-600 hover:text-primary-600 hover:bg-primary-50"
                )}
              >
                <ApperIcon name={item.icon} className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="small"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-slide-up">
          <div className="px-4 py-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-200",
                  isActive(item.href)
                    ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg"
                    : "text-gray-600 hover:text-primary-600 hover:bg-primary-50"
                )}
              >
                <ApperIcon name={item.icon} className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;