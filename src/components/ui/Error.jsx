import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry, className }) => {
  return (
    <Card className={`p-8 text-center ${className}`}>
      <div className="w-16 h-16 bg-gradient-to-br from-error-500 to-error-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <ApperIcon name="AlertCircle" className="h-8 w-8 text-white" />
      </div>
      <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} className="mx-auto">
          <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </Card>
  );
};

export default Error;