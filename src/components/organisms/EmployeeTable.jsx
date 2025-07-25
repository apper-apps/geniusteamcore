import React from "react";
import Card from "@/components/atoms/Card";
import Avatar from "@/components/atoms/Avatar";
import StatusBadge from "@/components/molecules/StatusBadge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const EmployeeTable = ({ employees, onEdit, onView, onDelete }) => {
  if (!employees || employees.length === 0) {
    return (
      <Card className="p-8 text-center">
        <ApperIcon name="Users" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
        <p className="text-gray-500">Get started by adding your first employee.</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee, index) => (
              <tr 
                key={employee.Id} 
                className={`hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 transition-all duration-200 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Avatar
                      src={employee.profilePhoto}
                      fallback={`${employee.firstName} ${employee.lastName}`}
                      size="medium"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {employee.firstName} {employee.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{employee.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{employee.role}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{employee.department}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={employee.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(employee.startDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => onView?.(employee)}
                    >
                      <ApperIcon name="Eye" className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => onEdit?.(employee)}
                    >
                      <ApperIcon name="Edit" className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => onDelete?.(employee)}
                      className="text-error-600 hover:text-error-700 hover:bg-error-50"
                    >
                      <ApperIcon name="Trash2" className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default EmployeeTable;