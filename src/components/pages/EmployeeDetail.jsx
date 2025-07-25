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

const OnboardingChecklist = ({ employee }) => {
  const [checklist, setChecklist] = useState({
    accountSetup: {
      title: "Account Setup",
      tasks: [
        { id: "email", label: "Set up company email account", completed: false },
        { id: "password", label: "Create secure password", completed: false },
        { id: "systems", label: "Grant access to company systems", completed: false },
        { id: "badges", label: "Issue security badges/keycards", completed: false }
      ]
    },
    documentation: {
      title: "Documentation",
      tasks: [
        { id: "contract", label: "Employment contract signed", completed: false },
        { id: "handbook", label: "Employee handbook reviewed", completed: false },
        { id: "policies", label: "Company policies acknowledged", completed: false },
        { id: "emergency", label: "Emergency contact information collected", completed: false },
        { id: "tax", label: "Tax forms completed", completed: false }
      ]
    },
    equipment: {
      title: "Equipment & Tools",
      tasks: [
        { id: "laptop", label: "Laptop/computer assigned", completed: false },
        { id: "software", label: "Required software installed", completed: false },
        { id: "phone", label: "Company phone/extension set up", completed: false },
        { id: "supplies", label: "Office supplies provided", completed: false }
      ]
    },
    training: {
      title: "Training & Orientation",
      tasks: [
        { id: "orientation", label: "Company orientation completed", completed: false },
        { id: "safety", label: "Safety training completed", completed: false },
        { id: "department", label: "Department-specific training", completed: false },
        { id: "mentor", label: "Mentor/buddy assigned", completed: false }
      ]
    },
    workspace: {
      title: "Workspace Setup",
      tasks: [
        { id: "desk", label: "Desk/workspace assigned", completed: false },
        { id: "parking", label: "Parking space allocated", completed: false },
        { id: "tour", label: "Office tour completed", completed: false },
        { id: "introductions", label: "Team introductions completed", completed: false }
      ]
    }
  });

  const handleTaskToggle = (categoryId, taskId) => {
    setChecklist(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        tasks: prev[categoryId].tasks.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      }
    }));

    const task = checklist[categoryId].tasks.find(t => t.id === taskId);
    if (!task.completed) {
      toast.success(`Task completed: ${task.label}`);
    } else {
      toast.info(`Task unmarked: ${task.label}`);
    }
  };

  const getTotalTasks = () => {
    return Object.values(checklist).reduce((total, category) => total + category.tasks.length, 0);
  };

  const getCompletedTasks = () => {
    return Object.values(checklist).reduce(
      (total, category) => total + category.tasks.filter(task => task.completed).length,
      0
    );
  };

  const getProgressPercentage = () => {
    const total = getTotalTasks();
    const completed = getCompletedTasks();
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const getCategoryProgress = (category) => {
    const total = category.tasks.length;
    const completed = category.tasks.filter(task => task.completed).length;
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  };

  const totalTasks = getTotalTasks();
  const completedTasks = getCompletedTasks();
  const progressPercentage = getProgressPercentage();

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-display font-semibold text-gray-900">
            Onboarding Progress
          </h3>
          <div className="text-sm text-gray-600">
            {completedTasks} of {totalTasks} tasks completed
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-display font-bold text-gray-900">
              {progressPercentage}%
            </span>
            <div className="flex items-center space-x-2">
              <ApperIcon 
                name={progressPercentage === 100 ? "CheckCircle" : "Clock"} 
                className={`h-5 w-5 ${progressPercentage === 100 ? "text-success-500" : "text-warning-500"}`} 
              />
              <span className={`text-sm font-medium ${progressPercentage === 100 ? "text-success-600" : "text-warning-600"}`}>
                {progressPercentage === 100 ? "Complete" : "In Progress"}
              </span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </Card>

      {/* Checklist Categories */}
      <div className="space-y-4">
        {Object.entries(checklist).map(([categoryId, category]) => {
          const progress = getCategoryProgress(category);
          return (
            <Card key={categoryId} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-display font-medium text-gray-900">
                  {category.title}
                </h4>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    {progress.completed}/{progress.total}
                  </span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-primary-600">
                    {progress.percentage}%
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                {category.tasks.map((task) => (
                  <div key={task.id} className="flex items-center space-x-3 group">
                    <button
                      onClick={() => handleTaskToggle(categoryId, task.id)}
                      className={`
                        flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
                        ${task.completed
                          ? "bg-primary-500 border-primary-500 hover:bg-primary-600"
                          : "border-gray-300 hover:border-primary-500 group-hover:border-primary-400"
                        }
                      `}
                    >
                      {task.completed && (
                        <ApperIcon name="Check" className="h-3 w-3 text-white" />
                      )}
                    </button>
                    <label 
                      className={`
                        flex-1 text-sm cursor-pointer transition-all duration-200
                        ${task.completed 
                          ? "text-gray-500 line-through" 
                          : "text-gray-900 group-hover:text-primary-600"
                        }
                      `}
                      onClick={() => handleTaskToggle(categoryId, task.id)}
                    >
                      {task.label}
                    </label>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Action Buttons */}
      {progressPercentage === 100 && (
        <Card className="p-6 bg-success-50 border-success-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ApperIcon name="CheckCircle" className="h-6 w-6 text-success-500" />
              <div>
                <h4 className="font-medium text-success-900">Onboarding Complete!</h4>
                <p className="text-sm text-success-700">
                  {employee.firstName} {employee.lastName} has completed all onboarding tasks.
                </p>
              </div>
            </div>
            <Button 
              className="bg-success-500 hover:bg-success-600 text-white"
              onClick={() => toast.success("Onboarding completion recorded!")}
            >
              Mark as Complete
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

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
    { id: "onboarding", label: "Onboarding", icon: "CheckSquare" },
    { id: "attendance", label: "Attendance", icon: "Clock" },
    { id: "documents", label: "Documents", icon: "FileText" }
  ];

  return (
<div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-end">
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

      {activeTab === "onboarding" && (
        <OnboardingChecklist employee={employee} />
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