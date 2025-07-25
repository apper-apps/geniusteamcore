import React from "react";
import Card from "@/components/atoms/Card";
import Avatar from "@/components/atoms/Avatar";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const EmployeeCard = ({ employee, onEdit, onView }) => {
  return (
    <Card hover className="p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <Avatar
            src={employee.profilePhoto}
            fallback={`${employee.firstName} ${employee.lastName}`}
            size="large"
          />
          <div>
            <h3 className="font-display font-semibold text-gray-900">
              {employee.firstName} {employee.lastName}
            </h3>
            <p className="text-sm text-gray-600">{employee.role}</p>
            <p className="text-xs text-gray-500">{employee.department}</p>
          </div>
        </div>
        <StatusBadge status={employee.status} />
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Mail" className="h-4 w-4" />
          <span>{employee.email}</span>
        </div>
        <div className="flex items-center space-x-2">
          <ApperIcon name="Phone" className="h-4 w-4" />
          <span>{employee.phone}</span>
        </div>
        <div className="flex items-center space-x-2">
          <ApperIcon name="Calendar" className="h-4 w-4" />
          <span>Started {new Date(employee.startDate).toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="flex space-x-2 pt-2">
        <Button
          variant="outline"
          size="small"
          onClick={() => onView?.(employee)}
          className="flex-1"
        >
          <ApperIcon name="Eye" className="h-4 w-4 mr-1" />
          View
        </Button>
        <Button
          variant="primary"
          size="small"
          onClick={() => onEdit?.(employee)}
          className="flex-1"
        >
          <ApperIcon name="Edit" className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </div>
    </Card>
  );
};

export default EmployeeCard;