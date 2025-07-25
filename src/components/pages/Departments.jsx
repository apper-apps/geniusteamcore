import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import DepartmentList from "@/components/organisms/DepartmentList";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import departmentService from "@/services/api/departmentService";
import employeeService from "@/services/api/employeeService";
import { toast } from "react-toastify";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    managerId: ""
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [departmentsData, employeesData] = await Promise.all([
        departmentService.getAll(),
        employeeService.getAll()
      ]);
      
      setDepartments(departmentsData);
      setEmployees(employeesData);
      
    } catch (err) {
      setError(err.message || "Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddDepartment = () => {
    setEditingDepartment(null);
    setFormData({ name: "", managerId: "" });
    setShowForm(true);
  };

  const handleEditDepartment = (department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      managerId: department.managerId || ""
    });
    setShowForm(true);
  };

  const handleDeleteDepartment = async (department) => {
    const departmentEmployees = employees.filter(emp => emp.department === department.name);
    
    if (departmentEmployees.length > 0) {
      toast.error("Cannot delete department with existing employees. Please reassign employees first.");
      return;
    }

    if (window.confirm(`Are you sure you want to delete the ${department.name} department?`)) {
      try {
        await departmentService.delete(department.Id);
        toast.success("Department deleted successfully");
        loadData();
      } catch (err) {
        toast.error(err.message || "Failed to delete department");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Department name is required");
      return;
    }

    try {
      if (editingDepartment) {
        await departmentService.update(editingDepartment.Id, formData);
        toast.success("Department updated successfully");
      } else {
        await departmentService.create(formData);
        toast.success("Department created successfully");
      }
      
      setShowForm(false);
      setFormData({ name: "", managerId: "" });
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to save department");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingDepartment(null);
    setFormData({ name: "", managerId: "" });
  };

  if (loading) {
    return <Loading rows={3} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600 mt-2">
            Organize your team into departments and assign managers
          </p>
        </div>
        <Button onClick={handleAddDepartment}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Department
        </Button>
      </div>

      {/* Department Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-semibold text-gray-900">
                {editingDepartment ? "Edit Department" : "Add New Department"}
              </h2>
              <Button variant="ghost" size="small" onClick={handleCancel}>
                <ApperIcon name="X" className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Department Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter department name"
                required
              />

              <Select
                label="Manager (Optional)"
                value={formData.managerId}
                onChange={(e) => setFormData(prev => ({ ...prev, managerId: e.target.value }))}
              >
                <option value="">Select Manager</option>
                {employees
                  .filter(emp => emp.status === "Active")
                  .map((employee) => (
                    <option key={employee.Id} value={employee.Id}>
                      {employee.firstName} {employee.lastName} - {employee.role}
                    </option>
                  ))}
              </Select>

              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingDepartment ? "Update" : "Create"} Department
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Department Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Departments</p>
              <p className="text-2xl font-display font-bold text-primary-600">{departments.length}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Building2" className="h-5 w-5 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-display font-bold text-success-600">{employees.length}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-success-500 to-success-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" className="h-5 w-5 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Team Size</p>
              <p className="text-2xl font-display font-bold text-warning-600">
                {departments.length > 0 ? Math.round(employees.length / departments.length) : 0}
              </p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-warning-500 to-warning-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="h-5 w-5 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Department List */}
      {departments.length === 0 ? (
        <Empty
          title="No departments found"
          description="Create your first department to organize your team structure."
          icon="Building2"
          actionLabel="Add Department"
          onAction={handleAddDepartment}
        />
      ) : (
        <DepartmentList
          departments={departments}
          employees={employees}
          onEdit={handleEditDepartment}
          onDelete={handleDeleteDepartment}
        />
      )}
    </div>
  );
};

export default Departments;