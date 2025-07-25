import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";

const DepartmentList = ({ departments = [], employees = [], onEdit, onDelete }) => {
  const getDepartmentEmployees = (departmentName) => {
    return employees.filter(emp => emp.department === departmentName);
  };

  const getManagerName = (managerId) => {
    const manager = employees.find(emp => emp.Id === managerId);
    return manager ? `${manager.firstName} ${manager.lastName}` : "No Manager";
  };

  if (!departments || departments.length === 0) {
    return (
      <Card className="p-8 text-center">
        <ApperIcon name="Building2" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
        <p className="text-gray-500">Create your first department to get started.</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {departments.map((department) => {
        const deptEmployees = getDepartmentEmployees(department.name);
        const managerName = getManagerName(department.managerId);
        
        return (
          <Card key={department.Id} hover className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Building2" className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-gray-900">{department.name}</h3>
                  <p className="text-sm text-gray-600">{deptEmployees.length} employees</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => onEdit?.(department)}
                >
                  <ApperIcon name="Edit" className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => onDelete?.(department)}
                  className="text-error-600 hover:text-error-700 hover:bg-error-50"
                >
                  <ApperIcon name="Trash2" className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Manager</p>
                <p className="text-sm text-gray-600">{managerName}</p>
              </div>

              {deptEmployees.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Team Members</p>
                  <div className="flex -space-x-2 overflow-hidden">
                    {deptEmployees.slice(0, 5).map((employee) => (
                      <Avatar
                        key={employee.Id}
                        src={employee.profilePhoto}
                        fallback={`${employee.firstName} ${employee.lastName}`}
                        size="small"
                        className="border-2 border-white hover:z-10 transition-all duration-200"
                      />
                    ))}
                    {deptEmployees.length > 5 && (
                      <div className="w-8 h-8 bg-gray-100 border-2 border-white rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                        +{deptEmployees.length - 5}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default DepartmentList;