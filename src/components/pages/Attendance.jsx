import React, { useState, useEffect } from "react";
import AttendanceCalendar from "@/components/organisms/AttendanceCalendar";
import TimeClockWidget from "@/components/organisms/TimeClockWidget";
import Card from "@/components/atoms/Card";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import employeeService from "@/services/api/employeeService";
import attendanceService from "@/services/api/attendanceService";
import { format } from "date-fns";

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
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
      
    } catch (err) {
      setError(err.message || "Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getAttendanceStats = () => {
    const today = format(new Date(), "yyyy-MM-dd");
    const todayAttendance = attendance.filter(record => record.date === today);
    
    const present = todayAttendance.filter(record => record.status === "Present").length;
    const absent = todayAttendance.filter(record => record.status === "Absent").length;
    const onLeave = todayAttendance.filter(record => record.status === "Leave").length;
    
    return { present, absent, onLeave, total: todayAttendance.length };
  };

  const handleEmployeeSelect = (employeeId) => {
    const employee = employees.find(emp => emp.Id === parseInt(employeeId));
    setSelectedEmployee(employee || null);
  };

  if (loading) {
    return <Loading rows={3} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  const stats = getAttendanceStats();

  return (
<div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600 mt-2">
            Track and manage employee attendance records
          </p>
        </div>
        <Button>
          <ApperIcon name="Download" className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Time Clock Widget */}
      <TimeClockWidget onAttendanceUpdate={loadData} />

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Present Today</p>
              <p className="text-2xl font-display font-bold text-success-600">{stats.present}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-success-500 to-success-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="UserCheck" className="h-5 w-5 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Absent Today</p>
              <p className="text-2xl font-display font-bold text-error-600">{stats.absent}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-error-500 to-error-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="UserX" className="h-5 w-5 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">On Leave</p>
              <p className="text-2xl font-display font-bold text-warning-600">{stats.onLeave}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-warning-500 to-warning-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Calendar" className="h-5 w-5 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-display font-bold text-primary-600">
                {stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}%
              </p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="h-5 w-5 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Employee Filter */}
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <ApperIcon name="Filter" className="h-5 w-5 text-gray-400" />
          <Select
            label=""
            value={selectedEmployee?.Id || ""}
            onChange={(e) => handleEmployeeSelect(e.target.value)}
            className="max-w-xs"
          >
            <option value="">All Employees</option>
            {employees.map((employee) => (
              <option key={employee.Id} value={employee.Id}>
                {employee.firstName} {employee.lastName}
              </option>
            ))}
          </Select>
          {selectedEmployee && (
            <Button
              variant="ghost"
              size="small"
              onClick={() => setSelectedEmployee(null)}
            >
              <ApperIcon name="X" className="h-4 w-4 mr-1" />
              Clear Filter
            </Button>
          )}
        </div>
      </Card>

      {/* Attendance Calendar */}
      <AttendanceCalendar
        attendanceData={attendance}
        selectedEmployee={selectedEmployee}
      />

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {attendance
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5)
            .map((record) => {
              const employee = employees.find(emp => emp.Id === record.employeeId);
              if (!employee) return null;
              
              return (
                <div key={record.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      record.status === "Present" ? "bg-success-500" :
                      record.status === "Absent" ? "bg-error-500" :
                      "bg-warning-500"
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {employee.firstName} {employee.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {record.status} on {new Date(record.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {record.checkIn && (
                    <div className="text-xs text-gray-500">
                      {new Date(record.checkIn).toLocaleTimeString([], { 
                        hour: "2-digit", 
                        minute: "2-digit" 
                      })}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </Card>
    </div>
  );
};

export default Attendance;