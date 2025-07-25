import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const DashboardStats = ({ stats }) => {
  const statCards = [
    {
      title: "Total Employees",
      value: stats?.totalEmployees || 0,
      change: "+12%",
      changeType: "increase",
      icon: "Users",
      color: "from-primary-500 to-secondary-500"
    },
    {
      title: "Active Employees",
      value: stats?.activeEmployees || 0,
      change: "+3%",
      changeType: "increase",
      icon: "UserCheck",
      color: "from-success-500 to-success-600"
    },
    {
      title: "On Leave",
      value: stats?.onLeave || 0,
      change: "-5%",
      changeType: "decrease",
      icon: "Calendar",
      color: "from-warning-500 to-warning-600"
    },
    {
      title: "Attendance Rate",
      value: `${stats?.attendanceRate || 0}%`,
      change: "+2%",
      changeType: "increase",
      icon: "Clock",
      color: "from-secondary-500 to-primary-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={stat.title} hover className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-3xl font-display font-bold text-gray-900 mb-2">
                {stat.value}
              </p>
              <div className="flex items-center space-x-1">
                <ApperIcon 
                  name={stat.changeType === "increase" ? "TrendingUp" : "TrendingDown"} 
                  className={`h-4 w-4 ${
                    stat.changeType === "increase" ? "text-success-500" : "text-error-500"
                  }`} 
                />
                <span className={`text-sm font-medium ${
                  stat.changeType === "increase" ? "text-success-600" : "text-error-600"
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500">from last month</span>
              </div>
            </div>
            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center shadow-lg`}>
              <ApperIcon name={stat.icon} className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;