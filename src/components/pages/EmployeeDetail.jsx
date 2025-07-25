import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import StatusBadge from "@/components/molecules/StatusBadge";
import AttendanceCalendar from "@/components/organisms/AttendanceCalendar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import employeeService from "@/services/api/employeeService";
import attendanceService from "@/services/api/attendanceService";
import { toast } from "react-toastify";

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("info");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [employeeData, attendanceData] = await Promise.all([
        employeeService.getById(id),
        attendanceService.getByEmployeeId(id)
      ]);
      
      setEmployee(employeeData);
      setAttendance(attendanceData);
      
    } catch (err) {
      setError(err.message || "Failed to load employee details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleEdit = () => {
    navigate(`/employees/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      try {
        await employeeService.delete(employee.Id);
        toast.success("Employee deleted successfully");
        navigate("/employees");
      } catch (err) {
        toast.error(err.message || "Failed to delete employee");
      }
    }
  };

  if (loading) {
    return <Loading rows={3} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  if (!employee) {
    return <Error message="Employee not found" />;
  }

  const tabs = [
    { id: "info", label: "Information", icon: "User" },
    { id: "attendance", label: "Attendance", icon: "Clock" },
    { id: "documents", label: "Documents", icon: "FileText" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/employees")}
          className="mb-4"
        >
          <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
          Back to Employees
        </Button>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleEdit}>
            <ApperIcon name="Edit" className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <ApperIcon name="Trash2" className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Employee Profile Header */}
      <Card className="p-6">
        <div className="flex items-start space-x-6">
          <Avatar
            src={employee.profilePhoto}
            fallback={`${employee.firstName} ${employee.lastName}`}
            size="xl"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-display font-bold text-gray-900">
                  {employee.firstName} {employee.lastName}
                </h1>
                <p className="text-lg text-gray-600 mt-1">{employee.role}</p>
                <p className="text-gray-500">{employee.department}</p>
              </div>
              <StatusBadge status={employee.status} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Mail" className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{employee.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Phone" className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{employee.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Calendar" className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Started {new Date(employee.startDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                ${activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              <ApperIcon name={tab.icon} className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "info" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
              Personal Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-gray-900">{employee.firstName} {employee.lastName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{employee.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-900">{employee.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">
                  <StatusBadge status={employee.status} />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
              Work Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Role</label>
                <p className="text-gray-900">{employee.role}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Department</label>
                <p className="text-gray-900">{employee.department}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Start Date</label>
                <p className="text-gray-900">{new Date(employee.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Employee ID</label>
                <p className="text-gray-900">#{employee.Id.toString().padStart(4, "0")}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "attendance" && (
        <AttendanceCalendar
          attendanceData={attendance}
          selectedEmployee={employee}
        />
      )}

      {activeTab === "documents" && (
        <Card className="p-8 text-center">
          <ApperIcon name="FileText" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
          <p className="text-gray-500 mb-4">Employee documents will appear here when uploaded.</p>
          <Button>
            <ApperIcon name="Upload" className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </Card>
      )}
    </div>
  );
};

export default EmployeeDetail;