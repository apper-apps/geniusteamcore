import React, { useEffect, useState } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import employeeService from "@/services/api/employeeService";
import attendanceService from "@/services/api/attendanceService";
import departmentService from "@/services/api/departmentService";
import { endOfMonth, format, startOfMonth, subDays } from "date-fns";
import toast from "react-hot-toast";

const Reports = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReport, setSelectedReport] = useState("overview");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [employeesData, departmentsData, attendanceData] = await Promise.all([
        employeeService.getAll(),
        departmentService.getAll(),
        attendanceService.getAll()
      ]);
      
      setEmployees(employeesData);
      setDepartments(departmentsData);
      setAttendance(attendanceData);
      
    } catch (err) {
      setError(err.message || "Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const generateOverviewReport = () => {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(emp => emp.status === "Active").length;
    const onLeave = employees.filter(emp => emp.status === "On Leave").length;
    const terminated = employees.filter(emp => emp.status === "Terminated").length;

    const currentMonth = format(new Date(), "yyyy-MM");
    const monthlyAttendance = attendance.filter(att => att.date.startsWith(currentMonth));
    const presentDays = monthlyAttendance.filter(att => att.status === "Present").length;
    const totalAttendanceDays = monthlyAttendance.length;
    const attendanceRate = totalAttendanceDays > 0 ? (presentDays / totalAttendanceDays * 100).toFixed(1) : 0;

    return {
      totalEmployees,
      activeEmployees,
      onLeave,
      terminated,
      attendanceRate,
      monthlyAttendance: monthlyAttendance.length
    };
  };

  const generateDepartmentReport = () => {
    return departments.map(dept => {
      const deptEmployees = employees.filter(emp => emp.department === dept.name);
      const activeInDept = deptEmployees.filter(emp => emp.status === "Active").length;
      
      const deptAttendance = attendance.filter(att => {
        const employee = employees.find(emp => emp.Id === att.employeeId);
        return employee && employee.department === dept.name;
      });
      
      const presentInDept = deptAttendance.filter(att => att.status === "Present").length;
      const deptAttendanceRate = deptAttendance.length > 0 
        ? (presentInDept / deptAttendance.length * 100).toFixed(1) 
        : 0;

      return {
        ...dept,
        totalEmployees: deptEmployees.length,
        activeEmployees: activeInDept,
        attendanceRate: deptAttendanceRate
      };
    });
  };

  const generateAttendanceReport = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = format(subDays(new Date(), i), "yyyy-MM-dd");
      const dayAttendance = attendance.filter(att => att.date === date);
      const present = dayAttendance.filter(att => att.status === "Present").length;
      const absent = dayAttendance.filter(att => att.status === "Absent").length;
      const leave = dayAttendance.filter(att => att.status === "Leave").length;
      
      return {
        date,
        present,
        absent,
        leave,
        total: dayAttendance.length
      };
    }).reverse();

    return last30Days;
  };

  const exportReport = (reportType) => {
    // This would typically generate and download a CSV/PDF file
    // For demo purposes, we'll just show a success message
    toast.success(`${reportType} report exported successfully!`);
  };

  if (loading) {
    return <Loading rows={4} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  const overviewData = generateOverviewReport();
  const departmentData = generateDepartmentReport();
  const attendanceData = generateAttendanceReport();

  const reportTypes = [
    { value: "overview", label: "Overview Report" },
    { value: "department", label: "Department Report" },
    { value: "attendance", label: "Attendance Report" },
    { value: "payroll", label: "Payroll Report" }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-2">
            Generate and export detailed reports about your team
          </p>
        </div>
        <div className="flex space-x-3">
          <Select
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="min-w-[200px]"
          >
            {reportTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Select>
          <Button onClick={() => exportReport(selectedReport)}>
            <ApperIcon name="Download" className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Report Content */}
      {selectedReport === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Employees</p>
                  <p className="text-2xl font-display font-bold text-primary-600">
                    {overviewData.totalEmployees}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Users" className="h-5 w-5 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Employees</p>
                  <p className="text-2xl font-display font-bold text-success-600">
                    {overviewData.activeEmployees}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-success-500 to-success-600 rounded-lg flex items-center justify-center">
                  <ApperIcon name="UserCheck" className="h-5 w-5 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">On Leave</p>
                  <p className="text-2xl font-display font-bold text-warning-600">
                    {overviewData.onLeave}
                  </p>
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
                  <p className="text-2xl font-display font-bold text-secondary-600">
                    {overviewData.attendanceRate}%
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name="TrendingUp" className="h-5 w-5 text-white" />
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
              Employee Status Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-success-50">
                <p className="text-2xl font-display font-bold text-success-600">
                  {overviewData.activeEmployees}
                </p>
                <p className="text-sm text-success-700">Active</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-warning-50">
                <p className="text-2xl font-display font-bold text-warning-600">
                  {overviewData.onLeave}
                </p>
                <p className="text-sm text-warning-700">On Leave</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-gray-50">
                <p className="text-2xl font-display font-bold text-gray-600">
                  {overviewData.terminated}
                </p>
                <p className="text-sm text-gray-700">Terminated</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {selectedReport === "department" && (
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Employees
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Active Employees
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attendance Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {departmentData.map((dept, index) => (
                    <tr 
                      key={dept.Id}
                      className={`hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 transition-all duration-200 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mr-3">
                            <ApperIcon name="Building2" className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{dept.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {dept.totalEmployees}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {dept.activeEmployees}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                          {dept.attendanceRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {selectedReport === "attendance" && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
              Last 30 Days Attendance Trend
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {attendanceData.map((day, index) => (
                <div key={day.date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {format(new Date(day.date), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-success-600">Present: {day.present}</span>
                    <span className="text-error-600">Absent: {day.absent}</span>
                    <span className="text-warning-600">Leave: {day.leave}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {selectedReport === "payroll" && (
        <Card className="p-8 text-center">
          <ApperIcon name="DollarSign" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Payroll Report</h3>
          <p className="text-gray-500 mb-4">
            Payroll reporting feature is coming soon. This will include salary breakdown, deductions, and payment summaries.
          </p>
          <Button variant="outline">
            <ApperIcon name="Bell" className="h-4 w-4 mr-2" />
            Notify When Available
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Reports;