import React, { useState, useEffect } from "react";
import DashboardStats from "@/components/organisms/DashboardStats";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import employeeService from "@/services/api/employeeService";
import attendanceService from "@/services/api/attendanceService";

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [employeesData, attendanceData] = await Promise.all([
        employeeService.getAll(),
        attendanceService.getAll()
      ]);
      
      setEmployees(employeesData);
      setAttendance(attendanceData);
      
      // Calculate stats
      const totalEmployees = employeesData.length;
      const activeEmployees = employeesData.filter(emp => emp.status === "Active").length;
      const onLeave = employeesData.filter(emp => emp.status === "On Leave").length;
      
      // Calculate attendance rate (simplified)
      const presentToday = attendanceData.filter(att => att.status === "Present").length;
      const totalAttendanceRecords = attendanceData.length;
      const attendanceRate = totalAttendanceRecords > 0 
        ? Math.round((presentToday / totalAttendanceRecords) * 100) 
        : 0;
      
      setStats({
        totalEmployees,
        activeEmployees,
        onLeave,
        attendanceRate
      });
      
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Loading rows={4} />
      </div>
    );
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  const recentEmployees = employees
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
    .slice(0, 5);

  const upcomingEvents = [
    { id: 1, title: "Team Meeting", date: "2024-01-20", type: "meeting" },
    { id: 2, title: "John's Birthday", date: "2024-01-22", type: "birthday" },
    { id: 3, title: "Quarterly Review", date: "2024-01-25", type: "review" }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your team overview.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <ApperIcon name="Calendar" className="h-4 w-4" />
          <span>{new Date().toLocaleDateString("en-US", { 
            weekday: "long", 
            year: "numeric", 
            month: "long", 
            day: "numeric" 
          })}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardStats stats={stats} />

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Employees */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-semibold text-gray-900">
              Recent Hires
            </h3>
            <ApperIcon name="Users" className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentEmployees.map((employee) => (
              <div key={employee.Id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {employee.firstName[0]}{employee.lastName[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {employee.firstName} {employee.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{employee.role}</p>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(employee.startDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Events */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-semibold text-gray-900">
              Upcoming Events
            </h3>
            <ApperIcon name="Calendar" className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className={`w-2 h-2 rounded-full ${
                  event.type === "meeting" ? "bg-primary-500" :
                  event.type === "birthday" ? "bg-success-500" :
                  "bg-warning-500"
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{event.title}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
                <ApperIcon name="ChevronRight" className="h-4 w-4 text-gray-400" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "UserPlus", label: "Add Employee", color: "from-primary-500 to-secondary-500" },
            { icon: "Clock", label: "Mark Attendance", color: "from-success-500 to-success-600" },
            { icon: "FileText", label: "Generate Report", color: "from-warning-500 to-warning-600" },
            { icon: "Building2", label: "Manage Departments", color: "from-secondary-500 to-primary-500" }
          ].map((action, index) => (
            <div 
              key={index}
              className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 cursor-pointer transition-all duration-200 hover:shadow-md group"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200`}>
                <ApperIcon name={action.icon} className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">{action.label}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;