import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item.", 
  icon = "Database",
  actionLabel = "Add New",
  onAction,
  className 
}) => {
  return (
    <Card className={`p-8 text-center ${className}`}>
      <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <ApperIcon name={icon} className="h-8 w-8 text-white" />
      </div>
      <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {description}
      </p>
      {onAction && (
        <Button onClick={onAction} className="mx-auto">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};

export default Empty;