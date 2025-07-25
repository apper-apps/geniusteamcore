import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import FilterDropdown from "@/components/molecules/FilterDropdown";
import EmployeeTable from "@/components/organisms/EmployeeTable";
import EmployeeCard from "@/components/molecules/EmployeeCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import employeeService from "@/services/api/employeeService";
import departmentService from "@/services/api/departmentService";
import { toast } from "react-toastify";

const Employees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewMode, setViewMode] = useState("table"); // "table" or "cards"

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [employeesData, departmentsData] = await Promise.all([
        employeeService.getAll(),
        departmentService.getAll()
      ]);
      
      setEmployees(employeesData);
      setDepartments(departmentsData);
      setFilteredEmployees(employeesData);
      
    } catch (err) {
      setError(err.message || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = [...employees];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(emp =>
        emp.firstName.toLowerCase().includes(query) ||
        emp.lastName.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.role.toLowerCase().includes(query) ||
        emp.department.toLowerCase().includes(query)
      );
    }

    // Apply department filter
    if (departmentFilter) {
      filtered = filtered.filter(emp => emp.department === departmentFilter);
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(emp => emp.status === statusFilter);
    }

    setFilteredEmployees(filtered);
  }, [employees, searchQuery, departmentFilter, statusFilter]);

  const handleAddEmployee = () => {
    navigate("/employees/add");
  };

  const handleEditEmployee = (employee) => {
    navigate(`/employees/edit/${employee.Id}`);
  };

  const handleViewEmployee = (employee) => {
    navigate(`/employees/${employee.Id}`);
  };

  const handleDeleteEmployee = async (employee) => {
    if (window.confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      try {
        await employeeService.delete(employee.Id);
        toast.success("Employee deleted successfully");
        loadData();
      } catch (err) {
        toast.error(err.message || "Failed to delete employee");
      }
    }
  };

  const departmentOptions = [
    { value: "", label: "All Departments" },
    ...departments.map(dept => ({ value: dept.name, label: dept.name }))
  ];

  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "Active", label: "Active" },
    { value: "On Leave", label: "On Leave" },
    { value: "Terminated", label: "Terminated" }
  ];

  if (loading) {
    return <Loading rows={5} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Employees</h1>
          <p className="text-gray-600 mt-2">
            Manage your team members and their information
          </p>
        </div>
        <Button onClick={handleAddEmployee}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employees..."
            className="flex-1 max-w-md"
          />
          <FilterDropdown
            label="Department"
            options={departmentOptions}
            value={departmentFilter}
            onChange={setDepartmentFilter}
          />
          <FilterDropdown
            label="Status"
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "table" ? "primary" : "outline"}
            size="small"
            onClick={() => setViewMode("table")}
          >
            <ApperIcon name="List" className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "cards" ? "primary" : "outline"}
            size="small"
            onClick={() => setViewMode("cards")}
          >
            <ApperIcon name="Grid3X3" className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Results Counter */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {filteredEmployees.length} of {employees.length} employees
        </span>
        {(searchQuery || departmentFilter || statusFilter) && (
          <Button
            variant="ghost"
            size="small"
            onClick={() => {
              setSearchQuery("");
              setDepartmentFilter("");
              setStatusFilter("");
            }}
          >
            <ApperIcon name="X" className="h-4 w-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Employee List */}
      {filteredEmployees.length === 0 ? (
        <Empty
          title="No employees found"
          description="No employees match your current filters. Try adjusting your search criteria or add a new employee."
          icon="Users"
          actionLabel="Add Employee"
          onAction={handleAddEmployee}
        />
      ) : (
        <>
          {viewMode === "table" ? (
            <EmployeeTable
              employees={filteredEmployees}
              onEdit={handleEditEmployee}
              onView={handleViewEmployee}
              onDelete={handleDeleteEmployee}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.map((employee) => (
                <EmployeeCard
                  key={employee.Id}
                  employee={employee}
                  onEdit={handleEditEmployee}
                  onView={handleViewEmployee}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Employees;